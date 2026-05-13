// app/api/admin/teams/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type ApiOk<T = unknown> = {
  ok: true;
  data?: T;
  message?: string;
};

type ApiFail = {
  ok: false;
  error: string;
};

function ok<T>(data?: T, message?: string) {
  return NextResponse.json({ ok: true, data, message } satisfies ApiOk<T>);
}

function fail(error: string, status = 400) {
  return NextResponse.json({ ok: false, error } satisfies ApiFail, { status });
}

type EventRef = {
  id: string;
  title: string | null;
  slug: string | null;
};

type TeamMemberRef = {
  id: string;
  is_leader: boolean | null;
};

type TeamRowRaw = {
  id: string;
  event_id: string;
  team_name: string;
  leader_name: string;
  leader_email: string;
  leader_phone: string;
  college: string | null;
  created_at: string;
  updated_at: string;
  events: EventRef | EventRef[] | null;
  team_members: TeamMemberRef[] | null;
};

async function requireAdmin() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { ok: false as const, status: 401, error: "Unauthorized", supabase };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile || profile.role !== "admin") {
    return { ok: false as const, status: 403, error: "Forbidden", supabase };
  }

  return { ok: true as const, supabase, user };
}

function getSingleEvent(events: TeamRowRaw["events"]): EventRef | null {
  if (!events) return null;
  return Array.isArray(events) ? events[0] ?? null : events;
}

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    if (!admin.ok) return fail(admin.error, admin.status);

    const supabase = createSupabaseAdminClient();
    const { searchParams } = new URL(req.url);

    const q = searchParams.get("q")?.trim() ?? "";
    const eventId = searchParams.get("event_id")?.trim() ?? "";
    const sort = searchParams.get("sort")?.trim() ?? "newest";

    let query = supabase
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
        created_at,
        updated_at,
        events (
          id,
          title,
          slug
        ),
        team_members (
          id,
          is_leader
        )
      `,
        { count: "exact" }
      );

    if (eventId) {
      query = query.eq("event_id", eventId);
    }

    if (q) {
      query = query.or(
        [
          `team_name.ilike.%${q}%`,
          `leader_name.ilike.%${q}%`,
          `leader_email.ilike.%${q}%`,
          `college.ilike.%${q}%`,
        ].join(",")
      );
    }

    query =
      sort === "oldest"
        ? query.order("created_at", { ascending: true })
        : query.order("created_at", { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      console.error("admin teams GET failed", error);
      return fail("Failed to load team registrations.", 500);
    }

    const rows = ((data ?? []) as unknown as TeamRowRaw[]).map((team) => {
      const event = getSingleEvent(team.events);

      return {
        id: team.id,
        event_id: team.event_id,
        event_title: event?.title ?? null,
        event_slug: event?.slug ?? null,
        team_name: team.team_name,
        leader_name: team.leader_name,
        leader_email: team.leader_email,
        leader_phone: team.leader_phone,
        college: team.college,
        team_size: team.team_members?.length ?? 0,
        created_at: team.created_at,
        updated_at: team.updated_at,
      };
    });

    return ok({
      rows,
      count: count ?? rows.length,
    });
  } catch (error) {
    console.error("admin teams GET unexpected error", error);
    return fail("Internal server error.", 500);
  }
}