import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type RegistrationStatus = "pending" | "approved" | "rejected";
type RegistrationKind = "individual" | "team";

type IndividualRow = {
  id: string;
  event_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  college: string | null;
  year: string | null;
  roll_number: string | null;
  status: RegistrationStatus | string | null;
  created_at: string | null;
};

type TeamRow = {
  id: string;
  event_id: string;
  team_name: string | null;
  leader_name: string | null;
  leader_email: string | null;
  leader_phone: string | null;
  college: string | null;
  status: RegistrationStatus | string | null;
  created_at: string | null;
};

type TeamMemberRow = {
  team_id: string;
  member_name: string | null;
  member_email: string | null;
  member_phone: string | null;
  college: string | null;
  gender: string | null;
  role: string | null;
  is_leader: boolean | null;
};

type EventRow = {
  id: string;
  title: string | null;
  mode: string | null;
  venue: string | null;
  city: string | null;
  state: string | null;
  start_at: string | null;
  end_at: string | null;
};

type ExportRow = {
  registration_kind: RegistrationKind;
  registration_id: string;
  event_id: string | null;
  event_title: string | null;
  event_mode: string | null;
  event_venue: string | null;
  event_city: string | null;
  event_state: string | null;
  event_start_at: string | null;
  event_end_at: string | null;
  full_name: string | null;
  leader_name: string | null;
  email: string | null;
  phone: string | null;
  college: string | null;
  team_size: number | null;
  year: string | null;
  roll_number: string | null;
  status: string | null;
  registered_at: string | null;

  team_members_summary: string | null;
  member_1_name: string | null;
  member_1_email: string | null;
  member_1_phone: string | null;
  member_1_college: string | null;
  member_1_gender: string | null;
  member_1_role: string | null;
  member_1_is_leader: string | null;

  member_2_name: string | null;
  member_2_email: string | null;
  member_2_phone: string | null;
  member_2_college: string | null;
  member_2_gender: string | null;
  member_2_role: string | null;
  member_2_is_leader: string | null;

  member_3_name: string | null;
  member_3_email: string | null;
  member_3_phone: string | null;
  member_3_college: string | null;
  member_3_gender: string | null;
  member_3_role: string | null;
  member_3_is_leader: string | null;

  member_4_name: string | null;
  member_4_email: string | null;
  member_4_phone: string | null;
  member_4_college: string | null;
  member_4_gender: string | null;
  member_4_role: string | null;
  member_4_is_leader: string | null;

  member_5_name: string | null;
  member_5_email: string | null;
  member_5_phone: string | null;
  member_5_college: string | null;
  member_5_gender: string | null;
  member_5_role: string | null;
  member_5_is_leader: string | null;

  extra_members_count: number | null;
};

function escapeIlike(value: string) {
  return value
    .replaceAll("\\", "\\\\")
    .replaceAll("%", "\\%")
    .replaceAll("_", "\\_");
}

function escapeCsv(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  if (/[",\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function formatTeamMemberSummary(member: TeamMemberRow) {
  return [
    member.member_name ?? "",
    member.member_email ?? "",
    member.member_phone ?? "",
    member.college ?? "",
    member.gender ?? "",
    member.role ?? "",
    member.is_leader ? "leader" : "member",
  ]
    .filter(Boolean)
    .join(" | ");
}

function buildMemberColumns(members: TeamMemberRow[]) {
  const safe = [...members].sort((a, b) => {
    const aLeader = a.is_leader ? 1 : 0;
    const bLeader = b.is_leader ? 1 : 0;
    return bLeader - aLeader;
  });

  const padded = Array.from({ length: 5 }, (_, i) => safe[i] ?? null);

  const row: Record<string, string | number | null> = {
    team_members_summary: safe.length
      ? safe.map(formatTeamMemberSummary).join(" || ")
      : null,
    extra_members_count: safe.length > 5 ? safe.length - 5 : 0,
  };

  padded.forEach((member, index) => {
    const n = index + 1;
    row[`member_${n}_name`] = member?.member_name ?? null;
    row[`member_${n}_email`] = member?.member_email ?? null;
    row[`member_${n}_phone`] = member?.member_phone ?? null;
    row[`member_${n}_college`] = member?.college ?? null;
    row[`member_${n}_gender`] = member?.gender ?? null;
    row[`member_${n}_role`] = member?.role ?? null;
    row[`member_${n}_is_leader`] = member
      ? member.is_leader
        ? "yes"
        : "no"
      : null;
  });

  return row;
}

function toCsv(rows: ExportRow[]) {
  const headers = [
    "registration_kind",
    "registration_id",
    "event_id",
    "event_title",
    "event_mode",
    "event_venue",
    "event_city",
    "event_state",
    "event_start_at",
    "event_end_at",
    "full_name",
    "leader_name",
    "email",
    "phone",
    "college",
    "team_size",
    "year",
    "roll_number",
    "status",
    "registered_at",
    "team_members_summary",

    "member_1_name",
    "member_1_email",
    "member_1_phone",
    "member_1_college",
    "member_1_gender",
    "member_1_role",
    "member_1_is_leader",

    "member_2_name",
    "member_2_email",
    "member_2_phone",
    "member_2_college",
    "member_2_gender",
    "member_2_role",
    "member_2_is_leader",

    "member_3_name",
    "member_3_email",
    "member_3_phone",
    "member_3_college",
    "member_3_gender",
    "member_3_role",
    "member_3_is_leader",

    "member_4_name",
    "member_4_email",
    "member_4_phone",
    "member_4_college",
    "member_4_gender",
    "member_4_role",
    "member_4_is_leader",

    "member_5_name",
    "member_5_email",
    "member_5_phone",
    "member_5_college",
    "member_5_gender",
    "member_5_role",
    "member_5_is_leader",

    "extra_members_count",
  ];

  const lines = [headers.join(",")];

  for (const row of rows) {
    const line = headers.map((header) =>
      escapeCsv((row as unknown as Record<string, unknown>)[header])
    );
    lines.push(line.join(","));
  }

  return lines.join("\n");
}

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin();

    if (!auth.ok) {
      return NextResponse.json(
        { ok: false, error: auth.error },
        { status: auth.status }
      );
    }

    const admin = createSupabaseAdminClient();
    const { searchParams } = new URL(req.url);

    const qRaw = (searchParams.get("q") ?? "").trim();
    const q = qRaw ? escapeIlike(qRaw) : "";
    const status = (searchParams.get("status") ?? "all").trim().toLowerCase();
    const sort = (searchParams.get("sort") ?? "newest").trim().toLowerCase();
    const eventId = (searchParams.get("event_id") ?? "").trim();

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
        created_at
        `
      );

    if (status !== "all") {
      individualQuery = individualQuery.eq("status", status);
    }

    if (eventId) {
      individualQuery = individualQuery.eq("event_id", eventId);
    }

    if (q) {
      individualQuery = individualQuery.or(
        [
          `full_name.ilike.%${q}%`,
          `email.ilike.%${q}%`,
          `phone.ilike.%${q}%`,
          `college.ilike.%${q}%`,
        ].join(",")
      );
    }

    individualQuery =
      sort === "oldest"
        ? individualQuery.order("created_at", { ascending: true })
        : individualQuery.order("created_at", { ascending: false });

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
        created_at
        `
      );

    if (status !== "all") {
      teamQuery = teamQuery.eq("status", status);
    }

    if (eventId) {
      teamQuery = teamQuery.eq("event_id", eventId);
    }

    if (q) {
      teamQuery = teamQuery.or(
        [
          `team_name.ilike.%${q}%`,
          `leader_name.ilike.%${q}%`,
          `leader_email.ilike.%${q}%`,
          `leader_phone.ilike.%${q}%`,
          `college.ilike.%${q}%`,
        ].join(",")
      );
    }

    teamQuery =
      sort === "oldest"
        ? teamQuery.order("created_at", { ascending: true })
        : teamQuery.order("created_at", { ascending: false });

    const [
      { data: individualData, error: individualError },
      { data: teamData, error: teamError },
    ] = await Promise.all([individualQuery, teamQuery]);

    if (individualError) {
      return NextResponse.json(
        {
          ok: false,
          error: individualError.message || "Failed to export registrations.",
        },
        { status: 500 }
      );
    }

    if (teamError) {
      return NextResponse.json(
        {
          ok: false,
          error: teamError.message || "Failed to export team registrations.",
        },
        { status: 500 }
      );
    }

    const individualRows = (individualData ?? []) as IndividualRow[];
    const teamRows = (teamData ?? []) as TeamRow[];

    const eventIds = Array.from(
      new Set(
        [...individualRows, ...teamRows]
          .map((row) => row.event_id)
          .filter(Boolean)
      )
    ) as string[];

    const teamIds = teamRows.map((row) => row.id);

    const eventsMap = new Map<string, EventRow>();
    const teamMembersMap = new Map<string, TeamMemberRow[]>();

    if (eventIds.length > 0) {
      const { data: eventsData, error: eventsError } = await admin
        .from("events")
        .select("id, title, mode, venue, city, state, start_at, end_at")
        .in("id", eventIds);

      if (eventsError) {
        return NextResponse.json(
          {
            ok: false,
            error: eventsError.message || "Failed to load event data.",
          },
          { status: 500 }
        );
      }

      for (const event of (eventsData ?? []) as EventRow[]) {
        eventsMap.set(event.id, event);
      }
    }

    if (teamIds.length > 0) {
      const { data: membersData, error: membersError } = await admin
        .from("team_members")
        .select(
          `
          team_id,
          member_name,
          member_email,
          member_phone,
          college,
          gender,
          role,
          is_leader
          `
        )
        .in("team_id", teamIds);

      if (membersError) {
        return NextResponse.json(
          {
            ok: false,
            error: membersError.message || "Failed to load team members.",
          },
          { status: 500 }
        );
      }

      for (const member of (membersData ?? []) as TeamMemberRow[]) {
        const existing = teamMembersMap.get(member.team_id) ?? [];
        existing.push(member);
        teamMembersMap.set(member.team_id, existing);
      }
    }

    const mergedRows: ExportRow[] = [
      ...individualRows.map((row) => {
        const event = row.event_id ? eventsMap.get(row.event_id) : undefined;

        return {
          registration_kind: "individual" as RegistrationKind,
          registration_id: row.id,
          event_id: row.event_id,
          event_title: event?.title ?? null,
          event_mode: event?.mode ?? null,
          event_venue: event?.venue ?? null,
          event_city: event?.city ?? null,
          event_state: event?.state ?? null,
          event_start_at: event?.start_at ?? null,
          event_end_at: event?.end_at ?? null,
          full_name: row.full_name ?? null,
          leader_name: null,
          email: row.email ?? null,
          phone: row.phone ?? null,
          college: row.college ?? null,
          team_size: null,
          year: row.year ?? null,
          roll_number: row.roll_number ?? null,
          status: row.status ?? null,
          registered_at: row.created_at ?? null,

          team_members_summary: null,
          member_1_name: null,
          member_1_email: null,
          member_1_phone: null,
          member_1_college: null,
          member_1_gender: null,
          member_1_role: null,
          member_1_is_leader: null,

          member_2_name: null,
          member_2_email: null,
          member_2_phone: null,
          member_2_college: null,
          member_2_gender: null,
          member_2_role: null,
          member_2_is_leader: null,

          member_3_name: null,
          member_3_email: null,
          member_3_phone: null,
          member_3_college: null,
          member_3_gender: null,
          member_3_role: null,
          member_3_is_leader: null,

          member_4_name: null,
          member_4_email: null,
          member_4_phone: null,
          member_4_college: null,
          member_4_gender: null,
          member_4_role: null,
          member_4_is_leader: null,

          member_5_name: null,
          member_5_email: null,
          member_5_phone: null,
          member_5_college: null,
          member_5_gender: null,
          member_5_role: null,
          member_5_is_leader: null,

          extra_members_count: null,
        };
      }),

      ...teamRows.map((row) => {
        const event = row.event_id ? eventsMap.get(row.event_id) : undefined;
        const members = teamMembersMap.get(row.id) ?? [];
        const memberColumns = buildMemberColumns(members);

        return {
          registration_kind: "team" as RegistrationKind,
          registration_id: row.id,
          event_id: row.event_id,
          event_title: event?.title ?? null,
          event_mode: event?.mode ?? null,
          event_venue: event?.venue ?? null,
          event_city: event?.city ?? null,
          event_state: event?.state ?? null,
          event_start_at: event?.start_at ?? null,
          event_end_at: event?.end_at ?? null,
          full_name: row.team_name ?? null,
          leader_name: row.leader_name ?? null,
          email: row.leader_email ?? null,
          phone: row.leader_phone ?? null,
          college: row.college ?? null,
          team_size: members.length,
          year: null,
          roll_number: null,
          status: row.status ?? null,
          registered_at: row.created_at ?? null,
          ...memberColumns,
        } as ExportRow;
      }),
    ].sort((a, b) => {
      const aTime = a.registered_at ? new Date(a.registered_at).getTime() : 0;
      const bTime = b.registered_at ? new Date(b.registered_at).getTime() : 0;
      return sort === "oldest" ? aTime - bTime : bTime - aTime;
    });

    const csv = toCsv(mergedRows);

    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    const filename = eventId
      ? `event-registrations-export-${eventId}-${stamp}.csv`
      : `registrations-export-${stamp}.csv`;

    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
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