import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function ok<T>(data?: T, message?: string, status = 200) {
  return NextResponse.json({ ok: true, data, message }, { status });
}

function fail(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string; volunteerId: string }> }
) {
  try {
    const auth = await requireAdmin();

    if (!auth.ok) {
      return fail(auth.error, auth.status);
    }

    const { id: eventId, volunteerId } = await ctx.params;

    if (!eventId || !volunteerId) {
      return fail("Event id and volunteer id are required.", 400);
    }

    const body: Record<string, unknown> | null = await req
      .json()
      .catch(() => null);

    if (!body) {
      return fail("Invalid JSON body.", 400);
    }

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (typeof body.is_active === "boolean") {
      updates.is_active = body.is_active;
    }

    if (typeof body.can_scan === "boolean") {
      updates.can_scan = body.can_scan;
    }

    if (typeof body.expires_at === "string" && body.expires_at.trim()) {
      updates.expires_at = body.expires_at.trim();
    }

    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase
      .from("volunteer_scanner_access")
      .update(updates)
      .eq("id", volunteerId)
      .eq("event_id", eventId)
      .select(
        `
        id,
        event_id,
        full_name,
        email,
        can_scan,
        is_active,
        expires_at,
        created_at,
        updated_at
        `
      )
      .single();

    if (error || !data) {
      return fail(error?.message || "Volunteer not found.", 404);
    }

    return ok(data, "Volunteer updated.");
  } catch (error) {
    console.error("PATCH volunteer failed", error);
    return fail("Internal server error.", 500);
  }
}

export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string; volunteerId: string }> }
) {
  try {
    const auth = await requireAdmin();

    if (!auth.ok) {
      return fail(auth.error, auth.status);
    }

    const { id: eventId, volunteerId } = await ctx.params;

    if (!eventId || !volunteerId) {
      return fail("Event id and volunteer id are required.", 400);
    }

    const supabase = createSupabaseAdminClient();

    const now = new Date().toISOString();

    const { error } = await supabase
      .from("volunteer_scanner_access")
      .update({
        is_active: false,
        can_scan: false,
        updated_at: now,
      })
      .eq("id", volunteerId)
      .eq("event_id", eventId);

    if (error) {
      return fail(error.message, 500);
    }

    await supabase
      .from("volunteer_scanner_sessions")
      .update({
        revoked_at: now,
      })
      .eq("access_id", volunteerId)
      .is("revoked_at", null);

    return ok(null, "Volunteer access revoked.");
  } catch (error) {
    console.error("DELETE volunteer failed", error);
    return fail("Internal server error.", 500);
  }
}