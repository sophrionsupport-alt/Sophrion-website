import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
 import { createSupabaseAdminClient } from "@/lib/supabase/admin";
 
export const runtime = "nodejs";

function json(
  ok: boolean,
  init?: { data?: unknown; error?: string; message?: string },
  status = 200
) {
  return NextResponse.json({ ok, ...init }, { status });
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

    if (
      nextStatus !== "pending" &&
      nextStatus !== "approved" &&
      nextStatus !== "rejected"
    ) {
      return json(false, { error: "Invalid status." }, 400);
    }

    const { data, error } = await auth.supabase
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
        updated_at,
        events (
          title
        )
        `
      )
      .single();

    if (error) {
      const httpStatus = error.code === "PGRST116" ? 404 : 500;

      return json(
        false,
        {
          error:
            error.code === "PGRST116"
              ? "Registration not found."
              : error.message,
        },
        httpStatus
      );
    }

    const payload = {
      ...data,
      event_title:
        (data as { events?: { title?: string | null } | null })?.events?.title ??
        null,
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

   

const admin = createSupabaseAdminClient();

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