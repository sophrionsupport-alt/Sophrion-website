import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type ApiOk<T = unknown> = { ok: true; data?: T; message?: string };
type ApiFail = { ok: false; error: string };

type RegistrationStatus = "pending" | "approved" | "rejected";
type RegistrationKind = "individual" | "team";

type IndividualRow = {
  id: string;
  event_id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  college: string | null;
  year: string | null;
  roll_number: string | null;
  status: RegistrationStatus;
  source?: string | null;
  ip?: string | null;
  user_agent?: string | null;
  created_at: string;
  updated_at?: string | null;
};

type TeamRow = {
  id: string;
  event_id: string;
  team_name: string;
  leader_name: string;
  leader_email: string | null;
  leader_phone: string | null;
  college: string | null;
  status: RegistrationStatus;
  created_at: string;
  updated_at?: string | null;
};

type TeamMemberCountRow = {
  team_id: string;
};

type EventTitleRow = {
  id: string;
  title: string | null;
};

function ok<T>(data?: T, message?: string): Response {
  return NextResponse.json({ ok: true, data, message } satisfies ApiOk<T>);
}

function fail(error: string, status = 400): Response {
  return NextResponse.json({ ok: false, error } satisfies ApiFail, { status });
}

function escapeIlike(value: string) {
  return value
    .replaceAll("\\", "\\\\")
    .replaceAll("%", "\\%")
    .replaceAll("_", "\\_");
}

export async function GET(req: Request) {
  const auth = await requireAdmin();

  if (!auth.ok) {
    return fail(auth.error, auth.status);
  }

  const admin = createSupabaseAdminClient();
  const { searchParams } = new URL(req.url);

  const qRaw = (searchParams.get("q") ?? "").trim();
  const q = qRaw ? escapeIlike(qRaw) : "";

  const status = (searchParams.get("status") ?? "").trim().toLowerCase() as
    | RegistrationStatus
    | "";
  const eventId = (searchParams.get("event_id") ?? "").trim();

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

  let individualQuery = admin
    .from("event_registrations")
    .select(
      `
      id,
      event_id,
      full_name,
      email,
      phone,
      college,
      year,
      roll_number,
      status,
      source,
      ip,
      user_agent,
      created_at,
      updated_at
      `
    );

  if (q) {
    individualQuery = individualQuery.or(
      `full_name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%,college.ilike.%${q}%`
    );
  }

  if (status) {
    individualQuery = individualQuery.eq("status", status);
  }

  if (eventId) {
    individualQuery = individualQuery.eq("event_id", eventId);
  }

  let teamQuery = admin
    .from("teams")
    .select(
      `
      id,
      event_id,
      team_name,
      leader_name,
      leader_email,
      leader_phone,
      college,
      status,
      created_at,
      updated_at
      `
    );

  if (q) {
    teamQuery = teamQuery.or(
      `team_name.ilike.%${q}%,leader_name.ilike.%${q}%,leader_email.ilike.%${q}%,leader_phone.ilike.%${q}%,college.ilike.%${q}%`
    );
  }

  if (status) {
    teamQuery = teamQuery.eq("status", status);
  }

  if (eventId) {
    teamQuery = teamQuery.eq("event_id", eventId);
  }

  const [
    { data: individualData, error: individualError },
    { data: teamData, error: teamError },
  ] = await Promise.all([individualQuery, teamQuery]);

  if (individualError) {
    console.error("Admin individual registrations fetch error:", individualError);
    return fail(individualError.message, 500);
  }

  if (teamError) {
    console.error("Admin team registrations fetch error:", teamError);
    return fail(teamError.message, 500);
  }

  const individualRows = (individualData ?? []) as IndividualRow[];
  const teamRows = (teamData ?? []) as TeamRow[];

  const eventIds = Array.from(
    new Set(
      [...individualRows, ...teamRows]
        .map((row) => row.event_id)
        .filter(Boolean)
    )
  );

  const teamIds = teamRows.map((row) => row.id);

  const eventsMap = new Map<string, string | null>();
  const teamCountsMap = new Map<string, number>();

  if (eventIds.length > 0) {
    const { data: eventsData, error: eventsError } = await admin
      .from("events")
      .select("id, title")
      .in("id", eventIds);

    if (eventsError) {
      console.error("Admin events title fetch error:", eventsError);
      return fail(eventsError.message, 500);
    }

    for (const event of (eventsData ?? []) as EventTitleRow[]) {
      eventsMap.set(event.id, event.title ?? null);
    }
  }

  if (teamIds.length > 0) {
    const { data: membersData, error: membersError } = await admin
      .from("team_members")
      .select("team_id")
      .in("team_id", teamIds);

    if (membersError) {
      console.error("Admin team members fetch error:", membersError);
      return fail(membersError.message, 500);
    }

    for (const member of (membersData ?? []) as TeamMemberCountRow[]) {
      teamCountsMap.set(
        member.team_id,
        (teamCountsMap.get(member.team_id) ?? 0) + 1
      );
    }
  }

  const mergedIndividualRows = individualRows.map((row) => ({
    id: row.id,
    event_id: row.event_id,
    event_title: eventsMap.get(row.event_id) ?? null,
    events: { title: eventsMap.get(row.event_id) ?? null },
    full_name: row.full_name,
    email: row.email,
    phone: row.phone,
    college: row.college,
    year: row.year,
    roll_number: row.roll_number,
    status: row.status,
    type: "individual" as RegistrationKind,
    team_size: null,
    leader_name: null,
    leader_email: null,
    leader_phone: null,
    created_at: row.created_at,
  }));

  const mergedTeamRows = teamRows.map((row) => ({
    id: row.id,
    event_id: row.event_id,
    event_title: eventsMap.get(row.event_id) ?? null,
    events: { title: eventsMap.get(row.event_id) ?? null },
    full_name: row.team_name,
    email: row.leader_email ?? null,
    phone: row.leader_phone ?? null,
    college: row.college,
    year: null,
    roll_number: null,
    status: row.status,
    type: "team" as RegistrationKind,
    team_size: teamCountsMap.get(row.id) ?? 0,
    leader_name: row.leader_name,
    leader_email: row.leader_email,
    leader_phone: row.leader_phone,
    created_at: row.created_at,
  }));

  const allRows = [...mergedIndividualRows, ...mergedTeamRows].sort((a, b) => {
    const aTime = new Date(a.created_at).getTime();
    const bTime = new Date(b.created_at).getTime();
    return ascending ? aTime - bTime : bTime - aTime;
  });

  const paginatedRows = allRows.slice(offset, offset + limit);

  return ok({
    rows: paginatedRows,
    count: allRows.length,
    limit,
    offset,
  });
}