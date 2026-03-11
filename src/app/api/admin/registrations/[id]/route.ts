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

  const table =
    params.kind === "team" ? "teams" : "event_registrations";

  await admin
    .from(table)
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
    | { id: string; ticket_code: string }
    | undefined;

  let emailSent = false;

  /* ------------------------------------------------------ */
  /* APPROVE → ISSUE TICKET                                 */
  /* ------------------------------------------------------ */

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

    issuedTicket = {
      id: ticket.id,
      ticket_code: ticket.ticket_code,
    };

    try {
      await sendTicketEmail({
        ticketId: ticket.id,
        actorId: params.actorId ?? null,
        source: "admin-approval",
      });

      emailSent = true;
    } catch (err) {
      console.error("Ticket email failed but ticket remains valid:", err);
    }
  }

  /* ------------------------------------------------------ */
  /* APPROVED → REJECTED                                    */
  /* ------------------------------------------------------ */

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

  return {
    issuedTicket,
    emailSent,
  };
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

    const table =
      kind === "team" ? "teams" : "event_registrations";

    const { data: existing, error: existingError } = await admin
      .from(table)
      .select("id,event_id,status")
      .eq("id", id)
      .single();

    if (existingError || !existing) {
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

    const previousStatus = isValidStatus(existing.status)
      ? existing.status
      : "pending";

    const { data, error } = await admin
      .from(table)
      .update({
        status: nextStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*")
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
      | { id: string; ticket_code: string }
      | undefined;

    let emailSent = false;

    try {
      const result = await runTicketLifecycle({
        id,
        kind,
        eventId: data.event_id,
        previousStatus,
        nextStatus,
        actorId,
      });

      issuedTicket = result.issuedTicket;
      emailSent = result.emailSent;
    } catch (lifecycleError) {
      await revertStatus({
        kind,
        id,
        previousStatus,
      });

      console.error("Approval lifecycle failed:", lifecycleError);

      return json(
        false,
        {
          error:
            lifecycleError instanceof Error
              ? lifecycleError.message
              : "Failed to complete approval lifecycle.",
        },
        500
      );
    }

    const { data: eventRow } = await admin
      .from("events")
      .select("title")
      .eq("id", data.event_id)
      .single();

    const payload = {
      ...data,
      event_title: eventRow?.title ?? null,
      type: kind,
      ticket: issuedTicket ?? null,
      ticket_created: !!issuedTicket,
      email_sent: emailSent,
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
      await admin.from("team_members").delete().eq("team_id", id);
      await admin.from("teams").delete().eq("id", id);
      return json(true, { message: "Team registration deleted" });
    }

    await admin
      .from("event_registrations")
      .delete()
      .eq("id", id);

    return json(true, { message: "Registration deleted" });
  } catch (err) {
    console.error("DELETE registration error:", err);
    return json(false, { error: "Server error" }, 500);
  }
}