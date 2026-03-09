import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { slugify } from "@/lib/utils/slugify";

export const runtime = "nodejs";

type EventType = "workshop" | "hackathon" | "hybrid";
type RegistrationType = "individual" | "team" | "both";
type EventMode = "online" | "offline" | "hybrid";

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

function parseBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === "boolean") return value;

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") return true;
    if (normalized === "false") return false;
  }

  return fallback;
}

function parseNullableInt(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;

  return Math.trunc(parsed);
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

function parseEventType(value: unknown): EventType {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase();

  if (
    normalized === "workshop" ||
    normalized === "hackathon" ||
    normalized === "hybrid"
  ) {
    return normalized;
  }

  return "workshop";
}

function parseRegistrationType(value: unknown): RegistrationType {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase();

  if (
    normalized === "individual" ||
    normalized === "team" ||
    normalized === "both"
  ) {
    return normalized;
  }

  return "individual";
}

function parseEventMode(value: unknown): EventMode | null {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase();

  if (
    normalized === "online" ||
    normalized === "offline" ||
    normalized === "hybrid"
  ) {
    return normalized;
  }

  return null;
}

export async function POST(req: Request) {
  const auth = await requireAdmin();

  if (!auth.ok) {
    return NextResponse.json(
      { ok: false, error: auth.error },
      { status: auth.status }
    );
  }

  try {
    const body = (await req.json()) as Record<string, unknown>;
    const supabase = supabaseAdmin();

    const title = String(body.title ?? "").trim();

    if (!title) {
      return NextResponse.json(
        { ok: false, error: "Title is required." },
        { status: 400 }
      );
    }

    const requestedSlug = parseNullableString(body.slug);
    const baseSlug = slugify(requestedSlug || title);

    if (!baseSlug) {
      return NextResponse.json(
        { ok: false, error: "Unable to generate slug." },
        { status: 400 }
      );
    }

    const slug = `${baseSlug}-${Date.now()}`;

    const eventType = parseEventType(body.event_type);
    const registrationType = parseRegistrationType(body.registration_type);
    const mode = parseEventMode(body.mode);

    const minTeamSize =
      registrationType === "team" || registrationType === "both"
        ? parseNullableInt(body.min_team_size)
        : null;

    const maxTeamSize =
      registrationType === "team" || registrationType === "both"
        ? parseNullableInt(body.max_team_size)
        : null;

    const requiresFemaleMember =
      registrationType === "team" || registrationType === "both"
        ? parseBoolean(body.requires_female_member, false)
        : false;

    const requiredFemaleCount =
      registrationType === "team" || registrationType === "both"
        ? parseNullableInt(body.required_female_count)
        : null;

    const roleBasedTeam =
      registrationType === "team" || registrationType === "both"
        ? parseBoolean(body.role_based_team, false)
        : false;

    if (registrationType === "team" || registrationType === "both") {
      if (minTeamSize == null || maxTeamSize == null) {
        return NextResponse.json(
          {
            ok: false,
            error: "Min team size and max team size are required for team events.",
          },
          { status: 400 }
        );
      }

      if (minTeamSize < 1) {
        return NextResponse.json(
          { ok: false, error: "Min team size must be at least 1." },
          { status: 400 }
        );
      }

      if (maxTeamSize < minTeamSize) {
        return NextResponse.json(
          {
            ok: false,
            error: "Max team size must be greater than or equal to min team size.",
          },
          { status: 400 }
        );
      }

      if (requiresFemaleMember) {
        if (requiredFemaleCount == null || requiredFemaleCount < 1) {
          return NextResponse.json(
            {
              ok: false,
              error:
                "Required female count must be a whole number greater than or equal to 1.",
            },
            { status: 400 }
          );
        }

        if (requiredFemaleCount > maxTeamSize) {
          return NextResponse.json(
            {
              ok: false,
              error: "Required female count cannot be greater than max team size.",
            },
            { status: 400 }
          );
        }
      }
    }

    const scheduleJson = parseNullableJson(body.schedule_json);
    if (Number.isNaN(scheduleJson)) {
      return NextResponse.json(
        { ok: false, error: "schedule_json must be valid JSON." },
        { status: 400 }
      );
    }

    const problemStatementsJson = parseNullableJson(body.problem_statements_json);
    if (Number.isNaN(problemStatementsJson)) {
      return NextResponse.json(
        { ok: false, error: "problem_statements_json must be valid JSON." },
        { status: 400 }
      );
    }

    const judgingJson = parseNullableJson(body.judging_json);
    if (Number.isNaN(judgingJson)) {
      return NextResponse.json(
        { ok: false, error: "judging_json must be valid JSON." },
        { status: 400 }
      );
    }

    const benefitsJson = parseNullableJson(body.benefits_json);
    if (Number.isNaN(benefitsJson)) {
      return NextResponse.json(
        { ok: false, error: "benefits_json must be valid JSON." },
        { status: 400 }
      );
    }

    const sampleRolesJson = parseNullableJson(body.sample_roles_json);
    if (Number.isNaN(sampleRolesJson)) {
      return NextResponse.json(
        { ok: false, error: "sample_roles_json must be valid JSON." },
        { status: 400 }
      );
    }

    const payload = {
      title,
      slug,

      subtitle: parseNullableString(body.subtitle),
      description: parseNullableString(body.description),
      overview: parseNullableString(body.overview),

      mode,
      venue: parseNullableString(body.venue),
      city: parseNullableString(body.city),
      state: parseNullableString(body.state),

      start_at: parseNullableString(body.start_at),
      end_at: parseNullableString(body.end_at),
      banner_url: parseNullableString(body.banner_url),

      is_published: parseBoolean(body.is_published, false),
      registration_open: parseBoolean(body.registration_open, true),

      event_type: eventType,
      registration_type: registrationType,

      min_team_size: minTeamSize,
      max_team_size: maxTeamSize,
      requires_female_member: requiresFemaleMember,
      required_female_count: requiresFemaleMember ? requiredFemaleCount : null,
      role_based_team: roleBasedTeam,

      rules_markdown: parseNullableString(body.rules_markdown),

      schedule_json: scheduleJson,
      problem_statements_json: problemStatementsJson,
      judging_json: judgingJson,

      fee: parseNullableString(body.fee),
      prize_pool: parseNullableString(body.prize_pool),
      winner_prize: parseNullableString(body.winner_prize),
      runner_prize: parseNullableString(body.runner_prize),

      benefits_json: benefitsJson,
      sample_roles_json:
        registrationType === "team" || registrationType === "both"
          ? sampleRolesJson
          : null,
    };

    const { data, error } = await supabase
      .from("events")
      .insert([payload])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}