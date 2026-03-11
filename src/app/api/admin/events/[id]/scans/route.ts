import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export const runtime = "nodejs";

function json(
  ok: boolean,
  init?: { data?: unknown; error?: string; message?: string },
  status = 200
) {
  return NextResponse.json({ ok, ...init }, { status });
}

function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();

  if (!auth.ok) {
    return json(false, { error: auth.error }, auth.status);
  }

  const { id } = await ctx.params;

  if (!id) {
    return json(false, { error: "Event id is required." }, 400);
  }

  const supabase = supabaseAdmin();

  const { data, error } = await supabase
    .from("ticket_scans")
    .select(
      `
      id,
      created_at,
      scan_result,
      source,
      ticket_id,
      scanned_by,
      payload
      `
    )
    .eq("event_id", id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return json(false, { error: error.message }, 500);
  }

  const ticketIds = Array.from(
    new Set((data ?? []).map((row) => row.ticket_id).filter(Boolean))
  ) as string[];

  const volunteerIds = Array.from(
    new Set((data ?? []).map((row) => row.scanned_by).filter(Boolean))
  ) as string[];

  let ticketMap = new Map<string, { id: string; ticket_code?: string | null; checked_in_at?: string | null }>();
  let volunteerMap = new Map<string, { id: string; full_name?: string | null; email?: string | null }>();

  if (ticketIds.length > 0) {
    const { data: tickets } = await supabase
      .from("event_tickets")
      .select("id, ticket_code, checked_in_at")
      .in("id", ticketIds);

    ticketMap = new Map((tickets ?? []).map((t) => [t.id, t]));
  }

  if (volunteerIds.length > 0) {
    const { data: volunteers } = await supabase
      .from("volunteer_scanner_access")
      .select("id, full_name, email")
      .in("id", volunteerIds);

    volunteerMap = new Map((volunteers ?? []).map((v) => [v.id, v]));
  }

  const rows = (data ?? []).map((row) => ({
    ...row,
    ticket: row.ticket_id ? ticketMap.get(row.ticket_id) ?? null : null,
    volunteer: row.scanned_by ? volunteerMap.get(row.scanned_by) ?? null : null,
  }));

  return json(true, { data: { rows } });
}