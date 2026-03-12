import { NextResponse } from "next/server";
import { requireScannerAccess } from "@/lib/scanner/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type ApiOk<T = unknown> = {
  ok: true;
  data?: T;
  message?: string;
};

type ApiFail = {
  ok: false;
  error: string;
};

function ok<T>(data?: T, message?: string, status = 200) {
  return NextResponse.json({ ok: true, data, message } satisfies ApiOk<T>, {
    status,
  });
}

function fail(error: string, status = 400) {
  return NextResponse.json({ ok: false, error } satisfies ApiFail, { status });
}

export async function GET() {
  try {
    const auth = await requireScannerAccess();

    if (!auth.ok) {
      return fail(auth.error, auth.status);
    }

    const supabase = createSupabaseAdminClient();

    let eventTitle: string | null = null;

    if (auth.actor.eventId) {
      const { data: event } = await supabase
        .from("events")
        .select("title")
        .eq("id", auth.actor.eventId)
        .maybeSingle();

      eventTitle = event?.title ?? null;
    }

    return ok({
      id: auth.actor.accessId,
      full_name: auth.actor.name ?? null,
      email: auth.actor.email ?? null,
      event_id: auth.actor.eventId ?? null,
      event_title: eventTitle,
    });
  } catch (error) {
    console.error("volunteer session GET failed", error);
    return fail("Internal server error.", 500);
  }
}