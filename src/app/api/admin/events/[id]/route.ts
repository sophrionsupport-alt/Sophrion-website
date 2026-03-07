import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export const runtime = "nodejs";

type EventType = "workshop" | "hackathon" | "hybrid";
type RegistrationType = "individual" | "team" | "both";
type EventMode = "online" | "offline" | "hybrid";

type EventRowLite = {
  id: string;
  event_type: EventType | null;
  registration_type: RegistrationType | null;
  min_team_size: number | null;
  max_team_size: number | null;
  requires_female_member: boolean | null;
  required_female_count: number | null;
  role_based_team: boolean | null;
};

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

function parseNullableString(value: unknown): string | null {
  if (value == null) return null;
  const trimmed = String(value).trim();
  return trimmed || null;
}

function parseBoolean(value: unknown): boolean | null {
  if (typeof value === "boolean") return value;
  return null;
}

function parseNullableInt(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;

  if (typeof value === "number" && Number.isInteger(value)) {
    return value;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;

    const parsed = Number(trimmed);
    if (Number.isInteger(parsed)) return parsed;
  }

  return NaN;
}

function parseNullableJson(value: unknown) {
  if (value === null || value === undefined || value === "") return null;

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;

    try {
      return JSON.parse(trimmed);
    } catch {
      return NaN;
    }
  }

  if (typeof value === "object") {
    return value;
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

type EventUpdateBody = {
  title?: unknown;
  subtitle?: unknown;
  slug?: unknown;

  description?: unknown;
  overview?: unknown;

  mode?: unknown;
  venue?: unknown;
  city?: unknown;
  state?: unknown;

  start_at?: unknown;
  end_at?: unknown;

  banner_url?: unknown;

  is_published?: unknown;
  registration_open?: unknown;

  event_type?: unknown;
  registration_type?: unknown;

  min_team_size?: unknown;
  max_team_size?: unknown;
  requires_female_member?: unknown;
  required_female_count?: unknown;
  role_based_team?: unknown;

  rules_markdown?: unknown;
  schedule_json?: unknown;
  problem_statements_json?: unknown;
  judging_json?: unknown;
};

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

  let body: EventUpdateBody = {};
  try {
    body = await req.json();
  } catch {
    return json(false, { error: "Invalid JSON body." }, 400);
  }

  const supabase = supabaseAdmin();

  const { data: existing, error: existingError } = await supabase
    .from("events")
    .select(`
      id,
      event_type,
      registration_type,
      min_team_size,
      max_team_size,
      requires_female_member,
      required_female_count,
      role_based_team
    `)
    .eq("id", id)
    .single<EventRowLite>();

  if (existingError || !existing) {
    const httpStatus = existingError?.code === "PGRST116" ? 404 : 500;

    return json(
      false,
      {
        error:
          existingError?.code === "PGRST116"
            ? "Event not found."
            : existingError?.message || "Failed to load event.",
      },
      httpStatus
    );
  }

  const updates: Record<string, unknown> = {};

  if (body.title !== undefined) {
    const title = String(body.title ?? "").trim();
    if (!title) {
      return json(false, { error: "Title is required." }, 400);
    }
    updates.title = title;
  }

  if (body.subtitle !== undefined) {
    updates.subtitle = parseNullableString(body.subtitle);
  }

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
    if (body.mode === null || body.mode === "") {
      updates.mode = null;
    } else {
      const parsedMode = parseEventMode(body.mode);
      if (!parsedMode) {
        return json(
          false,
          { error: "mode must be one of online, offline, or hybrid." },
          400
        );
      }
      updates.mode = parsedMode;
    }
  }

  if (body.venue !== undefined) {
    updates.venue = parseNullableString(body.venue);
  }

  if (body.city !== undefined) {
    updates.city = parseNullableString(body.city);
  }

  if (body.state !== undefined) {
    updates.state = parseNullableString(body.state);
  }

  if (body.start_at !== undefined) {
    updates.start_at = body.start_at == null ? null : String(body.start_at);
  }

  if (body.end_at !== undefined) {
    updates.end_at = body.end_at == null ? null : String(body.end_at);
  }

  if (body.banner_url !== undefined) {
    updates.banner_url = parseNullableString(body.banner_url);
  }

  if (body.is_published !== undefined) {
    const parsed = parseBoolean(body.is_published);
    if (parsed === null) {
      return json(false, { error: "is_published must be a boolean." }, 400);
    }
    updates.is_published = parsed;
  }

  if (body.registration_open !== undefined) {
    const parsed = parseBoolean(body.registration_open);
    if (parsed === null) {
      return json(false, { error: "registration_open must be a boolean." }, 400);
    }
    updates.registration_open = parsed;
  }

  let nextEventType: EventType =
    existing.event_type ?? "workshop";

  if (body.event_type !== undefined) {
    const parsed = parseEventType(body.event_type);
    if (!parsed) {
      return json(
        false,
        {
          error: "event_type must be one of workshop, hackathon, or hybrid.",
        },
        400
      );
    }
    nextEventType = parsed;
    updates.event_type = parsed;
  }

  let nextRegistrationType: RegistrationType =
    existing.registration_type ?? "individual";

  if (body.registration_type !== undefined) {
    const parsed = parseRegistrationType(body.registration_type);
    if (!parsed) {
      return json(
        false,
        {
          error:
            "registration_type must be one of individual, team, or both.",
        },
        400
      );
    }
    nextRegistrationType = parsed;
    updates.registration_type = parsed;
  }

  const rawMin =
    body.min_team_size !== undefined
      ? parseNullableInt(body.min_team_size)
      : existing.min_team_size;

  const rawMax =
    body.max_team_size !== undefined
      ? parseNullableInt(body.max_team_size)
      : existing.max_team_size;

  const rawRequiresFemale =
    body.requires_female_member !== undefined
      ? parseBoolean(body.requires_female_member)
      : existing.requires_female_member ?? false;

  const rawRequiredFemaleCount =
    body.required_female_count !== undefined
      ? parseNullableInt(body.required_female_count)
      : existing.required_female_count;

  const rawRoleBasedTeam =
    body.role_based_team !== undefined
      ? parseBoolean(body.role_based_team)
      : existing.role_based_team ?? false;

  if (
    body.requires_female_member !== undefined &&
    rawRequiresFemale === null
  ) {
    return json(
      false,
      { error: "requires_female_member must be a boolean." },
      400
    );
  }

  if (body.role_based_team !== undefined && rawRoleBasedTeam === null) {
    return json(
      false,
      { error: "role_based_team must be a boolean." },
      400
    );
  }

  if (
    Number.isNaN(rawMin) ||
    Number.isNaN(rawMax) ||
    Number.isNaN(rawRequiredFemaleCount)
  ) {
    return json(
      false,
      {
        error:
          "min_team_size, max_team_size, and required_female_count must be valid integers.",
      },
      400
    );
  }

  const needsTeamRules =
    nextRegistrationType === "team" || nextRegistrationType === "both";

  if (!needsTeamRules) {
    updates.min_team_size = null;
    updates.max_team_size = null;
    updates.requires_female_member = false;
    updates.required_female_count = null;
    updates.role_based_team = false;
  } else {
    if (rawMin == null || rawMax == null) {
      return json(
        false,
        {
          error:
            "min_team_size and max_team_size are required for team registration.",
        },
        400
      );
    }

    if (rawMin < 1) {
      return json(false, { error: "min_team_size must be at least 1." }, 400);
    }

    if (rawMax < rawMin) {
      return json(
        false,
        { error: "max_team_size must be greater than or equal to min_team_size." },
        400
      );
    }

    const requiresFemaleMember = Boolean(rawRequiresFemale);
    const roleBasedTeam = Boolean(rawRoleBasedTeam);

    let requiredFemaleCount: number | null = rawRequiredFemaleCount;

    if (!requiresFemaleMember) {
      requiredFemaleCount = null;
    } else {
      if (requiredFemaleCount == null || requiredFemaleCount < 1) {
        return json(
          false,
          {
            error:
              "required_female_count must be at least 1 when female member requirement is enabled.",
          },
          400
        );
      }

      if (requiredFemaleCount > rawMax) {
        return json(
          false,
          {
            error: "required_female_count cannot exceed max_team_size.",
          },
          400
        );
      }
    }

    updates.min_team_size = rawMin;
    updates.max_team_size = rawMax;
    updates.requires_female_member = requiresFemaleMember;
    updates.required_female_count = requiredFemaleCount;
    updates.role_based_team = roleBasedTeam;
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
      return json(
        false,
        { error: "problem_statements_json must be valid JSON." },
        400
      );
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

  if (Object.keys(updates).length === 0) {
    return json(false, { error: "Nothing to update." }, 400);
  }

  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("events")
    .update(updates)
    .eq("id", id)
    .select(EVENT_SELECT)
    .single();

  if (error) {
    const httpStatus = error.code === "PGRST116" ? 404 : 500;

    return json(
      false,
      {
        error:
          error.code === "PGRST116"
            ? "Event not found."
            : error.message,
      },
      httpStatus
    );
  }

  return json(true, { data, message: "Event updated successfully." });
}