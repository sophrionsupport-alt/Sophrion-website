import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export const runtime = "nodejs";

type EventType = "workshop" | "hackathon" | "hybrid";
type RegistrationType = "individual" | "team" | "both";
type EventMode = "online" | "offline" | "hybrid";

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
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function parseNullableString(v: unknown): string | null {
  if (v == null) return null;
  const t = String(v).trim();
  return t || null;
}

function parseNullableInt(v: unknown): number | null {
  if (v == null || v === "") return null;

  const n = Number(v);
  if (!Number.isFinite(n)) return null;

  return Math.trunc(n);
}

function parseNullableJson(v: unknown) {
  if (v == null || v === "") return null;

  if (typeof v === "string") {
    try {
      return JSON.parse(v);
    } catch {
      return NaN;
    }
  }

  if (typeof v === "object") {
    return v;
  }

  return NaN;
}

function parseEventType(value: unknown): EventType | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  if (
    normalized === "workshop" ||
    normalized === "hackathon" ||
    normalized === "hybrid"
  ) {
    return normalized;
  }
  return null;
}

function parseRegistrationType(value: unknown): RegistrationType | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  if (
    normalized === "individual" ||
    normalized === "team" ||
    normalized === "both"
  ) {
    return normalized;
  }
  return null;
}

function parseEventMode(value: unknown): EventMode | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  if (
    normalized === "online" ||
    normalized === "offline" ||
    normalized === "hybrid"
  ) {
    return normalized;
  }
  return null;
}

const EVENT_SELECT = `
  id,
  slug,
  title,
  subtitle,
  description,
  overview,
  mode,
  venue,
  city,
  state,
  start_at,
  end_at,
  banner_url,
  is_published,
  registration_open,
  event_type,
  registration_type,
  min_team_size,
  max_team_size,
  requires_female_member,
  required_female_count,
  role_based_team,
  rules_markdown,
  schedule_json,
  problem_statements_json,
  judging_json,
  fee,
  prize_pool,
  winner_prize,
  runner_prize,
  benefits_json,
  sample_roles_json,
  created_at,
  updated_at
`;

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
    .from("events")
    .select(EVENT_SELECT)
    .eq("id", id)
    .single();

  if (error) {
    const httpStatus = error.code === "PGRST116" ? 404 : 500;

    return json(
      false,
      {
        error: error.code === "PGRST116" ? "Event not found." : error.message,
      },
      httpStatus
    );
  }

  return json(true, { data });
}

export async function PATCH(
  req: Request,
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

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return json(false, { error: "Invalid JSON body." }, 400);
  }

  const supabase = supabaseAdmin();
  const updates: Record<string, unknown> = {};

  if (body.title !== undefined) {
    const title = parseNullableString(body.title);
    if (!title) {
      return json(false, { error: "Title is required." }, 400);
    }
    updates.title = title;
  }

  if (body.subtitle !== undefined) updates.subtitle = parseNullableString(body.subtitle);

  if (body.slug !== undefined) {
    const slug = parseNullableString(body.slug);
    if (!slug) {
      return json(false, { error: "Slug cannot be empty." }, 400);
    }
    updates.slug = slug;
  }

  if (body.description !== undefined) {
    updates.description = parseNullableString(body.description);
  }

  if (body.overview !== undefined) {
    updates.overview = parseNullableString(body.overview);
  }

  if (body.mode !== undefined) {
    const parsed = parseEventMode(body.mode);
    if (!parsed && body.mode != null && body.mode !== "") {
      return json(false, { error: "Invalid mode." }, 400);
    }
    updates.mode = parsed;
  }

  if (body.venue !== undefined) updates.venue = parseNullableString(body.venue);
  if (body.city !== undefined) updates.city = parseNullableString(body.city);
  if (body.state !== undefined) updates.state = parseNullableString(body.state);

  if (body.start_at !== undefined) {
    updates.start_at = parseNullableString(body.start_at);
  }

  if (body.end_at !== undefined) {
    updates.end_at = parseNullableString(body.end_at);
  }

  if (body.banner_url !== undefined) {
    updates.banner_url = parseNullableString(body.banner_url);
  }

  if (body.is_published !== undefined) {
    if (typeof body.is_published !== "boolean") {
      return json(false, { error: "is_published must be boolean." }, 400);
    }
    updates.is_published = body.is_published;
  }

  if (body.registration_open !== undefined) {
    if (typeof body.registration_open !== "boolean") {
      return json(false, { error: "registration_open must be boolean." }, 400);
    }
    updates.registration_open = body.registration_open;
  }

  if (body.event_type !== undefined) {
    const parsed = parseEventType(body.event_type);
    if (!parsed) {
      return json(false, { error: "Invalid event_type." }, 400);
    }
    updates.event_type = parsed;
  }

  if (body.registration_type !== undefined) {
    const parsed = parseRegistrationType(body.registration_type);
    if (!parsed) {
      return json(false, { error: "Invalid registration_type." }, 400);
    }
    updates.registration_type = parsed;
  }

  if (body.min_team_size !== undefined) {
    updates.min_team_size = parseNullableInt(body.min_team_size);
  }

  if (body.max_team_size !== undefined) {
    updates.max_team_size = parseNullableInt(body.max_team_size);
  }

  if (body.requires_female_member !== undefined) {
    if (typeof body.requires_female_member !== "boolean") {
      return json(false, { error: "requires_female_member must be boolean." }, 400);
    }
    updates.requires_female_member = body.requires_female_member;
  }

  if (body.required_female_count !== undefined) {
    updates.required_female_count = parseNullableInt(body.required_female_count);
  }

  if (body.role_based_team !== undefined) {
    if (typeof body.role_based_team !== "boolean") {
      return json(false, { error: "role_based_team must be boolean." }, 400);
    }
    updates.role_based_team = body.role_based_team;
  }

  if (body.rules_markdown !== undefined) {
    updates.rules_markdown = parseNullableString(body.rules_markdown);
  }

  if (body.schedule_json !== undefined) {
    const parsed = parseNullableJson(body.schedule_json);
    if (Number.isNaN(parsed)) {
      return json(false, { error: "schedule_json must be valid JSON." }, 400);
    }
    updates.schedule_json = parsed;
  }

  if (body.problem_statements_json !== undefined) {
    const parsed = parseNullableJson(body.problem_statements_json);
    if (Number.isNaN(parsed)) {
      return json(false, { error: "problem_statements_json must be valid JSON." }, 400);
    }
    updates.problem_statements_json = parsed;
  }

  if (body.judging_json !== undefined) {
    const parsed = parseNullableJson(body.judging_json);
    if (Number.isNaN(parsed)) {
      return json(false, { error: "judging_json must be valid JSON." }, 400);
    }
    updates.judging_json = parsed;
  }

  if (body.fee !== undefined) {
    updates.fee = parseNullableString(body.fee);
  }

  if (body.prize_pool !== undefined) {
    updates.prize_pool = parseNullableString(body.prize_pool);
  }

  if (body.winner_prize !== undefined) {
    updates.winner_prize = parseNullableString(body.winner_prize);
  }

  if (body.runner_prize !== undefined) {
    updates.runner_prize = parseNullableString(body.runner_prize);
  }

  if (body.benefits_json !== undefined) {
    const parsed = parseNullableJson(body.benefits_json);
    if (Number.isNaN(parsed)) {
      return json(false, { error: "benefits_json must be valid JSON." }, 400);
    }
    updates.benefits_json = parsed;
  }

  if (body.sample_roles_json !== undefined) {
    const parsed = parseNullableJson(body.sample_roles_json);
    if (Number.isNaN(parsed)) {
      return json(false, { error: "sample_roles_json must be valid JSON." }, 400);
    }
    updates.sample_roles_json = parsed;
  }

  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("events")
    .update(updates)
    .eq("id", id)
    .select(EVENT_SELECT)
    .single();

  if (error) {
    return json(false, { error: error.message }, 500);
  }

  return json(true, { data, message: "Event updated successfully." });
}

export async function DELETE(
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

  const { data: event, error: fetchError } = await supabase
    .from("events")
    .select("id, is_published")
    .eq("id", id)
    .single();

  if (fetchError) {
    return json(false, { error: fetchError.message }, 500);
  }

  if (event.is_published) {
    return json(
      false,
      { error: "Published events cannot be deleted. Unpublish first." },
      400
    );
  }

  const { error } = await supabase.from("events").delete().eq("id", id);

  if (error) {
    return json(false, { error: error.message }, 500);
  }

  return json(true, { message: "Event deleted successfully." });
}