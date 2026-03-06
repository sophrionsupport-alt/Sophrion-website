import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";

function json(
  ok: boolean,
  init?: { data?: unknown; error?: string; message?: string },
  status = 200
) {
  return NextResponse.json({ ok, ...init }, { status });
}

export async function GET(req: Request) {
  const auth = await requireAdmin();

  if (!auth.ok) {
    return json(false, { error: auth.error }, auth.status);
  }

  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").trim();
  const status = (url.searchParams.get("status") ?? "all").toLowerCase();
  const sort = (url.searchParams.get("sort") ?? "newest").toLowerCase();

  let query = auth.supabase
    .from("colleges")
    .select("id,name,city,state,website,status,created_at,updated_at")
    .order("created_at", { ascending: sort === "oldest" });

  if (status === "active") query = query.eq("status", "active");
  if (status === "inactive") query = query.eq("status", "inactive");

  if (q) {
    const like = `%${q.replace(/%/g, "\\%").replace(/_/g, "\\_")}%`;
    query = query.or(
      `name.ilike.${like},city.ilike.${like},state.ilike.${like},website.ilike.${like}`
    );
  }

  const { data, error } = await query;

  if (error) {
    return json(false, { error: error.message }, 500);
  }

  return json(true, { data });
}

export async function POST(req: Request) {
  const auth = await requireAdmin();

  if (!auth.ok) {
    return json(false, { error: auth.error }, auth.status);
  }

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return json(false, { error: "Invalid JSON body." }, 400);
  }

  const name = String(body.name ?? "").trim();
  const city =
    typeof body.city === "string" ? body.city.trim() || null : null;
  const state =
    typeof body.state === "string" ? body.state.trim() || null : null;
  const website =
    typeof body.website === "string" ? body.website.trim() || null : null;

  if (!name) {
    return json(false, { error: "College name is required." }, 400);
  }

  const { data, error } = await auth.supabase
    .from("colleges")
    .insert({
      name,
      city,
      state,
      website,
      status: "active",
    })
    .select("id,name,city,state,website,status,created_at,updated_at")
    .single();

  if (error) {
    return json(false, { error: error.message }, 500);
  }

  return json(true, { data }, 201);
}