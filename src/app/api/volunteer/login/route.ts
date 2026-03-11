import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  createScannerSession,
  verifyVolunteerAccessCode,
} from "@/lib/scanner/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body: Record<string, unknown> | null = await req.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { ok: false, error: "Invalid JSON body." },
        { status: 400 }
      );
    }

    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const code = typeof body.code === "string" ? body.code.trim() : "";
    const eventId = typeof body.eventId === "string" ? body.eventId.trim() : "";

    if (!email || !code || !eventId) {
      return NextResponse.json(
        { ok: false, error: "Email, code, and eventId are required." },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdminClient();

    const { data: access, error } = await supabase
      .from("volunteer_scanner_access")
      .select("*")
      .eq("email", email)
      .eq("event_id", eventId)
      .eq("is_active", true)
      .single();

    if (error || !access) {
      return NextResponse.json(
        { ok: false, error: "Invalid volunteer access." },
        { status: 401 }
      );
    }

    const now = new Date().toISOString();

    if (access.expires_at < now) {
      return NextResponse.json(
        { ok: false, error: "Volunteer access has expired." },
        { status: 401 }
      );
    }

    const valid = await verifyVolunteerAccessCode(code, access.access_code_hash);

    if (!valid) {
      return NextResponse.json(
        { ok: false, error: "Invalid access code." },
        { status: 401 }
      );
    }

    await createScannerSession({
      accessId: access.id,
      eventId: access.event_id,
      maxAgeHours: 12,
    });

    return NextResponse.json({
      ok: true,
      data: {
        eventId: access.event_id,
        fullName: access.full_name,
        email: access.email,
      },
      message: "Volunteer scanner login successful.",
    });
  } catch (error) {
    console.error("volunteer login failed", error);
    return NextResponse.json(
      { ok: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}