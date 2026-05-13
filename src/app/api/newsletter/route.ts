import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type RequestBody = {
  email?: string;
  source?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function newsletterDbErrorMessage(raw: string): string {
  const m = raw.toLowerCase();
  if (
    m.includes("could not find the table") &&
    m.includes("newsletter_subscribers")
  ) {
    return process.env.NODE_ENV === "development"
      ? "Supabase is missing table public.newsletter_subscribers. In the Supabase SQL Editor, run the SQL file supabase/migrations/20260513150000_newsletter_subscribers.sql, then try again."
      : "Signup is temporarily unavailable. Please try again later.";
  }
  return raw;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RequestBody;

    const email = String(body.email ?? "").trim().toLowerCase();
    const source = String(body.source ?? "unknown").trim();

    if (!email) {
      return NextResponse.json(
        { ok: false, message: "Email is required." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { ok: false, message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    let supabase;
    try {
      supabase = createSupabaseAdminClient();
    } catch {
      return NextResponse.json(
        { ok: false, message: "Server configuration is missing." },
        { status: 500 }
      );
    }

    const { error } = await supabase.from("newsletter_subscribers").upsert(
      {
        email,
        source: source || "website",
        name: null,
        status: "active",
        unsubscribed_at: null,
      },
      { onConflict: "email" }
    );

    if (error) {
      return NextResponse.json(
        { ok: false, message: newsletterDbErrorMessage(error.message) },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { ok: true, message: "Subscribed successfully." },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { ok: false, message: "Could not subscribe right now. Please try again." },
      { status: 500 }
    );
  }
}