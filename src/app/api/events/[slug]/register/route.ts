import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

type ApiOk<T = unknown> = { ok: true; data?: T; message?: string };
type ApiFail = { ok: false; error: string };

function ok<T>(data?: T, message?: string): Response {
  return NextResponse.json({ ok: true, data, message } satisfies ApiOk<T>);
}

function fail(error: string, status = 400): Response {
  return NextResponse.json({ ok: false, error } satisfies ApiFail, { status });
}

function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json().catch(() => null);

    if (!body) return fail("Invalid request body", 400);

    const full_name = String(body.full_name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const phone = body.phone ? String(body.phone).trim() : null;
    const college = body.college ? String(body.college).trim() : null;
    const year = body.year ? String(body.year).trim() : null;
    const roll_number = body.roll_number ? String(body.roll_number).trim() : null;
    const source = body.source ? String(body.source).trim() : "event_page";

    if (!slug) return fail("Missing event slug", 400);
    if (!full_name) return fail("Full name is required", 400);
    if (!email) return fail("Email is required", 400);

    const supabase = supabaseAdmin();

    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("id, title, is_published, registration_open")
      .eq("slug", slug)
      .single();

    if (eventError || !event) {
      console.error("Event lookup error:", eventError);
      return fail("Event not found", 404);
    }

    if (!event.is_published) {
      return fail("This event is not published yet", 400);
    }

    if (!event.registration_open) {
      return fail("Registration is closed for this event", 400);
    }

    const { data: existing, error: existingError } = await supabase
      .from("event_registrations")
      .select("id")
      .eq("event_id", event.id)
      .eq("email", email)
      .maybeSingle();

    if (existingError) {
      console.error("Duplicate check error:", existingError);
      return fail("Could not verify existing registration", 500);
    }

    if (existing) {
      return fail("You have already registered for this event", 409);
    }

    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0]?.trim() || null;
    const user_agent = req.headers.get("user-agent");

    const { data: inserted, error: insertError } = await supabase
      .from("event_registrations")
      .insert({
        event_id: event.id,
        full_name,
        email,
        phone,
        college,
        year,
        roll_number,
        source,
        ip,
        user_agent,
        status: "pending",
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Registration insert error:", insertError);
      return fail(insertError.message || "Failed to save registration", 500);
    }

    return ok(
      { id: inserted.id },
      "Registration received. You’ll get a confirmation email after verification."
    );
  } catch (error) {
    console.error("Event registration error:", error);
    return fail("Internal server error", 500);
  }
}