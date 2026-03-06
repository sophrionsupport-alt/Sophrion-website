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

const VALID = new Set(["new", "in_review", "approved", "rejected"]);

export async function GET(req: Request) {
  const auth = await requireAdmin();

  if (!auth.ok) {
    return fail(auth.error, auth.status);
  }

  const { searchParams } = new URL(req.url);
  const status = (searchParams.get("status") ?? "").trim();

  const parsedLimit = Number(searchParams.get("limit") ?? 50);
  const parsedOffset = Number(searchParams.get("offset") ?? 0);

  const limit = Number.isFinite(parsedLimit)
    ? Math.min(Math.max(parsedLimit, 1), 200)
    : 50;

  const offset = Number.isFinite(parsedOffset)
    ? Math.max(parsedOffset, 0)
    : 0;

  let query = auth.supabase
    .from("college_requests")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error, count } = await query;

  if (error) {
    return fail(error.message, 500);
  }

  return ok({
    rows: data ?? [],
    count: count ?? 0,
    limit,
    offset,
  });
}

// PATCH /api/admin/college-requests?id=... body: { status: ... }
export async function PATCH(req: Request) {
  const auth = await requireAdmin();

  if (!auth.ok) {
    return fail(auth.error, auth.status);
  }

  const { searchParams } = new URL(req.url);
  const id = (searchParams.get("id") ?? "").trim();

  if (!id) {
    return fail("Missing id.", 400);
  }

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return fail("Invalid JSON body.", 400);
  }

  const status = String(body.status ?? "").trim();

  if (!VALID.has(status)) {
    return fail("Invalid status. Use: new|in_review|approved|rejected.", 400);
  }

  const { data, error } = await auth.supabase
    .from("college_requests")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    const httpStatus = error.code === "PGRST116" ? 404 : 500;
    return fail(
      error.code === "PGRST116" ? "College request not found." : error.message,
      httpStatus
    );
  }

  return ok(data, "Request updated.");
}