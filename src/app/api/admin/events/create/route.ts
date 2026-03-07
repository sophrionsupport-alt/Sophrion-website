import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { slugify } from "@/lib/utils/slugify";

export const runtime = "nodejs";

type EventType = "workshop" | "hackathon" | "hybrid";
type RegistrationType = "individual" | "team";

function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

function parseNullableString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
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

function normalizeEventType(value: unknown): EventType {
  const raw = typeof value === "string" ? value.trim() : "";
  return raw === "workshop" || raw === "hackathon" || raw === "hybrid"
    ? raw
    : "workshop";
}

function normalizeRegistrationConfig(body: Record<string, unknown>) {
  const rawType =
    typeof body.registration_type === "string"
      ? body.registration_type.trim()
      : "";

  const registrationType: RegistrationType =
    rawType === "team" || rawType === "individual" ? rawType : "individual";

  let minTeamSize = parseNullableInt(body.min_team_size);
  let maxTeamSize = parseNullableInt(body.max_team_size);
  let requiredFemaleCount = parseNullableInt(body.required_female_count);

  const requiresFemaleMember = parseBoolean(body.requires_female_member, false);
  const roleBasedTeam = parseBoolean(body.role_based_team, false);

  if (registrationType === "individual") {
    return {
      registration_type: registrationType,
      min_team_size: null,
      max_team_size: null,
      requires_female_member: false,
      required_female_count: null,
      role_based_team: false,
    };
  }

  if (Number.isNaN(minTeamSize) || Number.isNaN(maxTeamSize)) {
    return {
      error: "Min team size and max team size must be valid integers.",
    };
  }

  if (minTeamSize === null || maxTeamSize === null) {
    return {
      error: "Min team size and max team size are required for team registration.",
    };
  }

  if (minTeamSize < 1) {
    return {
      error: "Min team size must be at least 1.",
    };
  }

  if (maxTeamSize < minTeamSize) {
    return {
      error: "Max team size must be greater than or equal to min team size.",
    };
  }

  if (!requiresFemaleMember) {
    requiredFemaleCount = null;
  } else {
    if (Number.isNaN(requiredFemaleCount)) {
      return {
        error: "Required female count must be a valid integer.",
      };
    }

    if (requiredFemaleCount === null || requiredFemaleCount < 1) {
      return {
        error: "Required female count must be at least 1 when female member requirement is enabled.",
      };
    }

    if (requiredFemaleCount > maxTeamSize) {
      return {
        error: "Required female count cannot exceed max team size.",
      };
    }
  }

  return {
    registration_type: registrationType,
    min_team_size: minTeamSize,
    max_team_size: maxTeamSize,
    requires_female_member: requiresFemaleMember,
    required_female_count: requiredFemaleCount,
    role_based_team: roleBasedTeam,
  };
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

    const eventType = normalizeEventType(body.event_type);

    const baseSlug = slugify(
      typeof body.slug === "string" && body.slug.trim() ? body.slug : title
    );
    const slug = `${baseSlug}-${Date.now()}`;

    if (!slug) {
      return NextResponse.json(
        { ok: false, error: "Unable to generate slug." },
        { status: 400 }
      );
    }

    const registrationConfig = normalizeRegistrationConfig(body);
    if ("error" in registrationConfig) {
      return NextResponse.json(
        { ok: false, error: registrationConfig.error },
        { status: 400 }
      );
    }

    const scheduleJson = parseNullableJson(body.schedule_json);
    const problemStatementsJson = parseNullableJson(body.problem_statements_json);
    const judgingJson = parseNullableJson(body.judging_json);

    if (Number.isNaN(scheduleJson)) {
      return NextResponse.json(
        { ok: false, error: "Schedule JSON is invalid." },
        { status: 400 }
      );
    }

    if (Number.isNaN(problemStatementsJson)) {
      return NextResponse.json(
        { ok: false, error: "Problem statements JSON is invalid." },
        { status: 400 }
      );
    }

    if (Number.isNaN(judgingJson)) {
      return NextResponse.json(
        { ok: false, error: "Judging JSON is invalid." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("events")
      .insert([
        {
          title,
          slug,
          subtitle: parseNullableString(body.subtitle),
          description: parseNullableString(body.description),
          overview: parseNullableString(body.overview),
          start_at: parseNullableString(body.start_at),
          end_at: parseNullableString(body.end_at),
          mode: parseNullableString(body.mode),
          venue: parseNullableString(body.venue),
          city: parseNullableString(body.city),
          state: parseNullableString(body.state),
          banner_url: parseNullableString(body.banner_url),
          is_published: parseBoolean(body.is_published, false),
          registration_open: parseBoolean(body.registration_open, true),
          event_type: eventType,
          registration_type: registrationConfig.registration_type,
          min_team_size: registrationConfig.min_team_size,
          max_team_size: registrationConfig.max_team_size,
          requires_female_member: registrationConfig.requires_female_member,
          required_female_count: registrationConfig.required_female_count,
          role_based_team: registrationConfig.role_based_team,
          rules_markdown: parseNullableString(body.rules_markdown),
          schedule_json: scheduleJson,
          problem_statements_json: problemStatementsJson,
          judging_json: judgingJson,
        },
      ])
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