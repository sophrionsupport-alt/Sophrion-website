import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { CollegeEventPublishRequestSchema } from "@/lib/validators/collegeRequest";

export const runtime = "nodejs";

type ApiOk<T = unknown> = { ok: true; data?: T; message?: string };
type ApiFail = { ok: false; error?: string; message?: string };

function ok<T>(data?: T, message?: string) {
  return NextResponse.json({ ok: true, data, message } satisfies ApiOk<T>);
}

function fail(message: string, status = 400, error?: string) {
  return NextResponse.json(
    { ok: false, message, error } satisfies ApiFail,
    { status }
  );
}

function supabasePublicServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }

  return createClient(url, anon, {
    auth: { persistSession: false },
  });
}

export async function POST(req: Request) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return fail("Invalid JSON body.", 400);
    }

    const parsed = CollegeEventPublishRequestSchema.safeParse(body);

    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message ?? "Invalid form data.";
      return fail(msg, 400);
    }

    const payload = parsed.data;
    const sb = supabasePublicServer();

    const { data, error } = await sb
      .from("college_requests")
      .insert({
        request_type: "event_hosting",
        college_name: payload.college_name,
        contact_name: payload.contact_name,
        email: payload.email,
        phone: payload.phone ?? null,
        city: payload.city ?? null,
        state: payload.state ?? null,
        website: payload.website ?? null,
        message: payload.message,
        status: "new",
      })
      .select("id,created_at")
      .single();

    if (error) {
      return fail(
        "Could not submit request. Please try again.",
        500,
        error.message
      );
    }

    return ok(data, "Request submitted. Our team will contact you shortly.");
  } catch (e: unknown) {
    return fail(
      "Server error.",
      500,
      e instanceof Error ? e.message : "Unknown error"
    );
  }
}