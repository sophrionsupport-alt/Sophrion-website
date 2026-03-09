import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export const runtime = "nodejs";

type DeleteMode = "single" | "multiple" | "all";

type Payload = {
  mode: DeleteMode;
  eventId?: string;
  eventIds?: string[];
};

function json(
  ok: boolean,
  init?: { data?: unknown; error?: string; message?: string },
  status = 200
) {
  return NextResponse.json({ ok, ...init }, { status });
}

/* -------------------------------------------------------------------------- */
/* SUPABASE ADMIN CLIENT (BYPASSES RLS)                                       */
/* -------------------------------------------------------------------------- */

function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Missing Supabase env vars");
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

async function getTeamIds(
  supabase: ReturnType<typeof supabaseAdmin>,
  eventIds: string[]
) {
  const { data, error } = await supabase
    .from("teams")
    .select("id")
    .in("event_id", eventIds);

  if (error) throw new Error(error.message);

  return (data ?? []).map((t) => t.id);
}

async function deleteTeamMembers(
  supabase: ReturnType<typeof supabaseAdmin>,
  teamIds: string[]
) {
  if (!teamIds.length) return 0;

  const { data, error } = await supabase
    .from("team_members")
    .delete()
    .in("team_id", teamIds)
    .select("id");

  if (error) throw new Error(error.message);

  return data?.length ?? 0;
}

async function deleteTeams(
  supabase: ReturnType<typeof supabaseAdmin>,
  eventIds: string[]
) {
  const { data, error } = await supabase
    .from("teams")
    .delete()
    .in("event_id", eventIds)
    .select("id");

  if (error) throw new Error(error.message);

  return data?.length ?? 0;
}

/* -------------------------------------------------------------------------- */
/* BULK DELETE ROUTE                                                          */
/* -------------------------------------------------------------------------- */

export async function DELETE(req: NextRequest) {
  try {
    /* ---------- Admin check ---------- */

    const auth = await requireAdmin();

    if (!auth.ok) {
      return json(false, { error: auth.error }, auth.status);
    }

    const body = (await req.json()) as Payload;
    const mode = body?.mode;

    const supabase = supabaseAdmin();

    /* ---------------------------------------------------------------------- */
    /* DELETE REGISTRATIONS FOR ONE EVENT                                     */
    /* ---------------------------------------------------------------------- */

    if (mode === "single") {
      const eventId = body?.eventId;

      if (!eventId) {
        return json(false, { error: "eventId required" }, 400);
      }

      const teamIds = await getTeamIds(supabase, [eventId]);

      const deletedMembers = await deleteTeamMembers(supabase, teamIds);
      const deletedTeams = await deleteTeams(supabase, [eventId]);

      return json(true, {
        data: { deletedTeams, deletedMembers },
        message: "Registrations deleted for event",
      });
    }

    /* ---------------------------------------------------------------------- */
    /* DELETE REGISTRATIONS FOR MULTIPLE EVENTS                               */
    /* ---------------------------------------------------------------------- */

    if (mode === "multiple") {
      const ids = body?.eventIds ?? [];

      if (!ids.length) {
        return json(false, { error: "eventIds required" }, 400);
      }

      const teamIds = await getTeamIds(supabase, ids);

      const deletedMembers = await deleteTeamMembers(supabase, teamIds);
      const deletedTeams = await deleteTeams(supabase, ids);

      return json(true, {
        data: { deletedTeams, deletedMembers },
        message: "Registrations deleted",
      });
    }

    /* ---------------------------------------------------------------------- */
    /* DELETE ALL REGISTRATIONS                                               */
    /* ---------------------------------------------------------------------- */

    if (mode === "all") {
      const { data: members } = await supabase
        .from("team_members")
        .delete()
        .not("id", "is", null)
        .select("id");

      const { data: teams } = await supabase
        .from("teams")
        .delete()
        .not("id", "is", null)
        .select("id");

      return json(true, {
        data: {
          deletedTeams: teams?.length ?? 0,
          deletedMembers: members?.length ?? 0,
        },
        message: "All registrations deleted",
      });
    }

    return json(false, { error: "Invalid mode" }, 400);
  } catch (err: any) {
    console.error("Bulk delete error:", err);

    return json(false, { error: err?.message || "Delete failed" }, 500);
  }
}