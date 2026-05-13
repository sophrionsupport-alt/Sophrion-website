import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hashVolunteerAccessCode } from "@/lib/scanner/volunteerCode";
import { signVolunteerSession } from "@/lib/scanner/sessionToken";

export const runtime = "nodejs";

const COOKIE = "sph_vol_scan";
const MAX_AGE_SEC = 60 * 60 * 12;

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) {
      return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
    }

    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const code = typeof body.code === "string" ? body.code.trim() : "";
    const eventId = typeof body.eventId === "string" ? body.eventId.trim() : "";

    if (!email || !code || !eventId) {
      return NextResponse.json(
        { ok: false, error: "Email, code, and event id are required." },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdminClient();
    const access_code_hash = hashVolunteerAccessCode(code);

    const { data: row, error } = await supabase
      .from("volunteer_scanner_access")
      .select("id, event_id, is_active, can_scan, expires_at")
      .eq("event_id", eventId)
      .eq("email", email)
      .eq("access_code_hash", access_code_hash)
      .maybeSingle();

    if (error || !row) {
      return NextResponse.json({ ok: false, error: "Invalid credentials." }, { status: 401 });
    }

    const r = row as {
      id: string;
      event_id: string;
      is_active: boolean;
      can_scan: boolean;
      expires_at: string;
    };

    if (!r.is_active || !r.can_scan) {
      return NextResponse.json({ ok: false, error: "Access disabled." }, { status: 403 });
    }

    const expMs = new Date(r.expires_at).getTime();
    if (!Number.isFinite(expMs) || expMs < Date.now()) {
      return NextResponse.json({ ok: false, error: "Access expired." }, { status: 403 });
    }

    const sessionToken = signVolunteerSession({
      accessId: r.id,
      eventId: r.event_id,
      exp: Math.min(expMs, Date.now() + MAX_AGE_SEC * 1000),
    });

    const res = NextResponse.json({ ok: true, message: "Signed in." });
    res.cookies.set({
      name: COOKIE,
      value: sessionToken,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: MAX_AGE_SEC,
    });

    return res;
  } catch (e) {
    console.error("[volunteer/login]", e);
    return NextResponse.json({ ok: false, error: "Internal server error." }, { status: 500 });
  }
}
