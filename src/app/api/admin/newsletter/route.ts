import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type ApiOk<T = unknown> = { ok: true; data?: T; message?: string };
type ApiFail = { ok: false; error: string };

function ok<T>(data?: T, message?: string): Response {
  return NextResponse.json({ ok: true, data, message } satisfies ApiOk<T>);
}

function fail(error: string, status = 400): Response {
  return NextResponse.json({ ok: false, error } satisfies ApiFail, { status });
}

function escapeIlike(value: string) {
  return value.replaceAll("\\", "\\\\").replaceAll("%", "\\%").replaceAll("_", "\\_");
}

export async function GET(req: Request) {
  const auth = await requireAdmin();

  if (!auth.ok) {
    return fail(auth.error, auth.status);
  }

  const supabase = createSupabaseAdminClient();

  const { searchParams } = new URL(req.url);

  const qRaw = (searchParams.get("q") ?? "").trim();
  const q = qRaw ? escapeIlike(qRaw) : "";

  const status = (searchParams.get("status") ?? "").trim().toLowerCase();

  const sort = (searchParams.get("sort") ?? "newest").trim().toLowerCase();
  const ascending = sort === "oldest";

  const parsedLimit = Number(searchParams.get("limit") ?? 50);
  const parsedOffset = Number(searchParams.get("offset") ?? 0);

  const limit = Number.isFinite(parsedLimit)
    ? Math.min(Math.max(parsedLimit, 1), 200)
    : 50;

  const offset = Number.isFinite(parsedOffset)
    ? Math.max(parsedOffset, 0)
    : 0;

  let query = supabase
    .from("newsletter_subscribers")
    .select(
      `
      id,
      email,
      name,
      status,
      created_at
    `,
      { count: "exact" }
    )
    .order("created_at", { ascending })
    .range(offset, offset + limit - 1);

  if (q) {
    query = query.or(`email.ilike.%${q}%,name.ilike.%${q}%`);
  }

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("Admin newsletter fetch error:", error);
    return fail(error.message, 500);
  }

  return ok({
    rows: data ?? [],
    count: count ?? 0,
    limit,
    offset,
  });
}