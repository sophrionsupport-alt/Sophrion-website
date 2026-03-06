import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export const runtime = "nodejs";

type ApiOk<T = unknown> = { ok: true; data?: T; message?: string };
type ApiFail = { ok: false; error: string };

function ok<T>(data?: T, message?: string): Response {
  return NextResponse.json({ ok: true, data, message } satisfies ApiOk<T>);
}

function fail(error: string, status = 400): Response {
  return NextResponse.json({ ok: false, error } satisfies ApiFail, { status });
}

// POST body: { status: "pending" | "approved" | "rejected", ids: string[] }
export async function POST(req: Request) {
  const auth = await requireAdmin();

  if (!auth.ok) {
    return fail(auth.error, auth.status);
  }

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return fail("Invalid JSON body.", 400);
  }

  const nextStatus = body.status;
  const ids = Array.isArray(body.ids)
    ? body.ids.map((id) => String(id).trim()).filter(Boolean)
    : [];

  if (
    nextStatus !== "pending" &&
    nextStatus !== "approved" &&
    nextStatus !== "rejected"
  ) {
    return fail("Invalid status.", 400);
  }

  if (ids.length === 0) {
    return fail("Missing ids.", 400);
  }

  const { data, error } = await auth.supabase
    .from("event_registrations")
    .update({
      status: nextStatus,
      updated_at: new Date().toISOString(),
    })
    .in("id", ids)
    .select("id,status,updated_at");

  if (error) {
    console.error("Bulk registration update error:", error);
    return fail(error.message, 500);
  }

  return ok(
    {
      updated: data ?? [],
      count: (data ?? []).length,
    },
    "Bulk update complete."
  );
}