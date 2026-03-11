import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { issueTicket } from "@/lib/tickets/issueTicket";
import { invalidateTickets } from "@/lib/tickets/invalidateTickets";
import { sendTicketEmail } from "@/lib/tickets/sendTicketEmail";

export const runtime = "nodejs";

type RegistrationStatus = "pending" | "approved" | "rejected";
type RegistrationKind = "individual" | "team";

function json(
  ok: boolean,
  init?: { data?: unknown; error?: string; message?: string },
  status = 200
) {
  return NextResponse.json({ ok, ...init }, { status });
}

function getKind(req: Request): RegistrationKind {
  const { searchParams } = new URL(req.url);
  const kind = (searchParams.get("kind") ?? "individual").trim().toLowerCase();
  return kind === "team" ? "team" : "individual";
}

function isValidStatus(value: unknown): value is RegistrationStatus {
  return value === "pending" || value === "approved" || value === "rejected";
}

async function revertStatus(params: {
  kind: RegistrationKind;
  id: string;
  previousStatus: RegistrationStatus;
}) {
  const admin = createSupabaseAdminClient();

  if (params.kind === "team") {
    await admin
      .from("teams")
      .update({
        status: params.previousStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id);
    return;
  }

  await admin
    .from("event_registrations")
    .update({
      status: params.previousStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.id);
}

async function runTicketLifecycle(params: {
  id: string;
  kind: RegistrationKind;
  eventId: string;
  previousStatus: RegistrationStatus;
  nextStatus: RegistrationStatus;
  actorId?: string | null;
}) {
  let issuedTicket:
    | {
        id: string;
        ticket_code: string;
      }
    | undefined;

  if (
    params.nextStatus === "approved" &&
    params.previousStatus !== "approved"
  ) {
    const ticket = await issueTicket({
      registrationId: params.id,
      registrationKind: params.kind,
      eventId: params.eventId,
      actorId: params.actorId ?? null,
      notes: "Issued automatically from admin approval",
    });

    await sendTicketEmail({
      ticketId: ticket.id,
      actorId: params.actorId ?? null,
      source: "admin-approval",
    });

    issuedTicket = {
      id: ticket.id,
      ticket_code: ticket.ticket_code,
    };
  }

  if (
    params.nextStatus === "rejected" &&
    params.previousStatus === "approved"
  ) {
    await invalidateTickets({
      eventId: params.eventId,
      registrationId: params.id,
      registrationKind: params.kind,
      actorId: params.actorId ?? null,
    });
  }

  return { issuedTicket };
}

/* -------------------------------------------------------------------------- */
/* UPDATE REGISTRATION STATUS                                                 */
/* -------------------------------------------------------------------------- */

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin();

    if (!auth.ok) {
      return json(false, { error: auth.error }, auth.status);
    }

    const admin = createSupabaseAdminClient();
    const actorId = auth.actor.userId ?? null;
    const { id } = await ctx.params;

    if (!id) {
      return json(false, { error: "Registration id is required." }, 400);
    }

    let body: Record<string, unknown> = {};

    try {
      body = await req.json();
    } catch {
      return json(false, { error: "Invalid JSON body." }, 400);
    }

    const nextStatus = body.status;

    if (!isValidStatus(nextStatus)) {
      return json(false, { error: "Invalid status." }, 400);
    }

    const kind = getKind(req);

    if (kind === "team") {
      const { data: existingTeam, error: existingError } = await admin
        .from("teams")
        .select(
          `
          id,
          event_id,
          status
          `
        )
        .eq("id", id)
        .single();

      if (existingError || !existingTeam) {
        const httpStatus = existingError?.code === "PGRST116" ? 404 : 500;

        return json(
          false,
          {
            error:
              existingError?.code === "PGRST116"
                ? "Team registration not found."
                : existingError?.message ?? "Failed to load team registration.",
          },
          httpStatus
        );
      }

      const previousStatus = isValidStatus(existingTeam.status)
        ? existingTeam.status
        : "pending";

      const { data, error } = await admin
        .from("teams")
        .update({
          status: nextStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select(
          `
          id,
          event_id,
          team_name,
          leader_name,
          leader_email,
          leader_phone,
          college,
          status,
          created_at,
          updated_at
          `
        )
        .single();

      if (error || !data) {
        const httpStatus = error?.code === "PGRST116" ? 404 : 500;

        return json(
          false,
          {
            error:
              error?.code === "PGRST116"
                ? "Team registration not found."
                : error?.message ?? "Failed to update team registration.",
          },
          httpStatus
        );
      }

      let issuedTicket:
        | {
            id: string;
            ticket_code: string;
          }
        | undefined;

      try {
        const result = await runTicketLifecycle({
          id,
          kind: "team",
          eventId: data.event_id,
          previousStatus,
          nextStatus,
          actorId,
        });

        issuedTicket = result.issuedTicket;
      } catch (lifecycleError) {
        await revertStatus({
          kind: "team",
          id,
          previousStatus,
        });

        console.error("Team approval lifecycle failed:", lifecycleError);

        return json(
          false,
          {
            error:
              lifecycleError instanceof Error
                ? lifecycleError.message
                : "Failed to complete team approval lifecycle.",
          },
          500
        );
      }

      const { count: teamSizeCount, error: membersError } = await admin
        .from("team_members")
        .select("*", { count: "exact", head: true })
        .eq("team_id", id);

      if (membersError) {
        return json(false, { error: membersError.message }, 500);
      }

      const { data: eventRow, error: eventError } = await admin
        .from("events")
        .select("title")
        .eq("id", data.event_id)
        .single();

      if (eventError && eventError.code !== "PGRST116") {
        return json(false, { error: eventError.message }, 500);
      }

      const payload = {
        id: data.id,
        event_id: data.event_id,
        event_title: eventRow?.title ?? null,
        full_name: data.team_name,
        email: data.leader_email ?? null,
        phone: data.leader_phone ?? null,
        college: data.college ?? null,
        status: data.status,
        type: "team",
        team_size: teamSizeCount ?? 0,
        leader_name: data.leader_name ?? null,
        leader_email: data.leader_email ?? null,
        leader_phone: data.leader_phone ?? null,
        created_at: data.created_at,
        updated_at: data.updated_at,
        ticket: issuedTicket ?? null,
      };

      return json(true, { data: payload });
    }

    const { data: existingRegistration, error: existingError } = await admin
      .from("event_registrations")
      .select(
        `
        id,
        event_id,
        status
        `
      )
      .eq("id", id)
      .single();

    if (existingError || !existingRegistration) {
      const httpStatus = existingError?.code === "PGRST116" ? 404 : 500;

      return json(
        false,
        {
          error:
            existingError?.code === "PGRST116"
              ? "Registration not found."
              : existingError?.message ?? "Failed to load registration.",
        },
        httpStatus
      );
    }

    const previousStatus = isValidStatus(existingRegistration.status)
      ? existingRegistration.status
      : "pending";

    const { data, error } = await admin
      .from("event_registrations")
      .update({
        status: nextStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select(
        `
        id,
        event_id,
        full_name,
        email,
        phone,
        college,
        year,
        roll_number,
        status,
        source,
        ip,
        user_agent,
        created_at,
        updated_at
        `
      )
      .single();

    if (error || !data) {
      const httpStatus = error?.code === "PGRST116" ? 404 : 500;

      return json(
        false,
        {
          error:
            error?.code === "PGRST116"
              ? "Registration not found."
              : error?.message ?? "Failed to update registration.",
        },
        httpStatus
      );
    }

    let issuedTicket:
      | {
          id: string;
          ticket_code: string;
        }
      | undefined;

    try {
      const result = await runTicketLifecycle({
        id,
        kind: "individual",
        eventId: data.event_id,
        previousStatus,
        nextStatus,
        actorId,
      });

      issuedTicket = result.issuedTicket;
    } catch (lifecycleError) {
      await revertStatus({
        kind: "individual",
        id,
        previousStatus,
      });

      console.error("Registration approval lifecycle failed:", lifecycleError);

      return json(
        false,
        {
          error:
            lifecycleError instanceof Error
              ? lifecycleError.message
              : "Failed to complete registration approval lifecycle.",
        },
        500
      );
    }

    const { data: eventRow, error: eventError } = await admin
      .from("events")
      .select("title")
      .eq("id", data.event_id)
      .single();

    if (eventError && eventError.code !== "PGRST116") {
      return json(false, { error: eventError.message }, 500);
    }

    const payload = {
      ...data,
      event_title: eventRow?.title ?? null,
      type: "individual",
      ticket: issuedTicket ?? null,
    };

    return json(true, { data: payload });
  } catch (err) {
    console.error("PATCH registration error:", err);
    return json(false, { error: "Server error" }, 500);
  }
}

/* -------------------------------------------------------------------------- */
/* DELETE REGISTRATION                                                        */
/* -------------------------------------------------------------------------- */

export async function DELETE(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin();

    if (!auth.ok) {
      return json(false, { error: auth.error }, auth.status);
    }

    const { id } = await ctx.params;

    if (!id) {
      return json(false, { error: "Registration id is required." }, 400);
    }

    const kind = getKind(req);
    const admin = createSupabaseAdminClient();

    if (kind === "team") {
      const { error: membersError } = await admin
        .from("team_members")
        .delete()
        .eq("team_id", id);

      if (membersError) {
        return json(false, { error: membersError.message }, 500);
      }

      const { error: teamError } = await admin.from("teams").delete().eq("id", id);

      if (teamError) {
        return json(false, { error: teamError.message }, 500);
      }

      return json(true, { message: "Team registration deleted" });
    }

    const { error } = await admin
      .from("event_registrations")
      .delete()
      .eq("id", id);

    if (error) {
      return json(false, { error: error.message }, 500);
    }

    return json(true, { message: "Registration deleted" });
  } catch (err) {
    console.error("DELETE registration error:", err);
    return json(false, { error: "Server error" }, 500);
  }
}