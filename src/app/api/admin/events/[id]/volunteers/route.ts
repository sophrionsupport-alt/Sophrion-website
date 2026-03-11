import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createVolunteerAccess } from "@/lib/scanner/createVolunteerAccess";

export const runtime = "nodejs";

function ok<T>(data?: T, message?: string, status = 200) {
  return NextResponse.json({ ok: true, data, message }, { status });
}

function fail(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin();

    if (!auth.ok) {
      return fail(auth.error, auth.status);
    }

    const { id: eventId } = await ctx.params;

    if (!eventId) {
      return fail("Event id is required.", 400);
    }

    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase
      .from("volunteer_scanner_access")
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
      .eq("event_id", eventId)
      .order("created_at", { ascending: false });

    if (error) {
      return fail(error.message, 500);
    }

    return ok({ rows: data ?? [] });
  } catch (error) {
    console.error("GET volunteers failed", error);
    return fail("Internal server error.", 500);
  }
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin();

    if (!auth.ok) {
      return fail(auth.error, auth.status);
    }

    const { id: eventId } = await ctx.params;

    if (!eventId) {
      return fail("Event id is required.", 400);
    }

    const body: Record<string, unknown> | null = await req
      .json()
      .catch(() => null);

    if (!body) {
      return fail("Invalid JSON body.", 400);
    }

    const fullName =
      typeof body.fullName === "string" ? body.fullName.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const expiresAt =
      typeof body.expiresAt === "string" ? body.expiresAt.trim() : "";

    if (!fullName) {
      return fail("Full name is required.", 400);
    }

    if (!email) {
      return fail("Email is required.", 400);
    }

    if (!expiresAt) {
      return fail("Expiry is required.", 400);
    }

    const created = await createVolunteerAccess({
      eventId,
      fullName,
      email,
      expiresAt,
    });

    return ok(
      {
        volunteer: created.volunteer,
        tempCode: created.tempCode,
      },
      "Volunteer access created.",
      201
    );
  } catch (error) {
    console.error("POST volunteer failed", error);
    return fail(
      error instanceof Error ? error.message : "Failed to create volunteer.",
      500
    );
  }
}