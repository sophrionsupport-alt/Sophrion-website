// src/lib/tickets/getRegistrationSnapshot.ts

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type {
  RegistrationSnapshot,
  TicketRegistrationKind,
} from "@/lib/tickets/types";

type IndividualRow = {
  id: string;
  event_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  college: string | null;
  year: string | null;
  roll_number: string | null;
  status: string | null;
  source: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type TeamMemberRow = {
  id: string;
  member_name: string;
  member_email: string | null;
  member_phone: string | null;
  college: string | null;
  gender: string | null;
  role: string | null;
  is_leader: boolean | null;
  created_at: string | null;
};

type TeamRow = {
  id: string;
  event_id: string;
  team_name: string;
  leader_name: string | null;
  leader_email: string | null;
  leader_phone: string | null;
  college: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export async function getRegistrationSnapshot(input: {
  registrationId: string;
  registrationKind: TicketRegistrationKind;
}): Promise<RegistrationSnapshot | null> {
  const supabase = createSupabaseAdminClient();

  if (input.registrationKind === "individual") {
    const { data, error } = await supabase
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
        created_at,
        updated_at
        `
      )
      .eq("id", input.registrationId)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    const row = data as IndividualRow;

    return {
      registrationKind: "individual",
      eventId: row.event_id,
      registration: {
        id: row.id,
        full_name: row.full_name,
        email: row.email,
        phone: row.phone,
        college: row.college,
        year: row.year,
        roll_number: row.roll_number,
        status: row.status,
        source: row.source,
        created_at: row.created_at,
        updated_at: row.updated_at,
      },
    };
  }

  const [{ data: team, error: teamError }, { data: members, error: membersError }] =
    await Promise.all([
      supabase
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
        )
        .eq("id", input.registrationId)
        .maybeSingle(),
      supabase
        .from("team_members")
        .select(
          `
          id,
          member_name,
          member_email,
          member_phone,
          college,
          gender,
          role,
          is_leader,
          created_at
          `
        )
        .eq("team_id", input.registrationId)
        .order("is_leader", { ascending: false })
        .order("created_at", { ascending: true }),
    ]);

  if (teamError || membersError || !team) {
    return null;
  }

  const teamRow = team as TeamRow;
  const teamMembers = (members ?? []) as TeamMemberRow[];

  const leaderFromMembers =
    teamMembers.find((member) => Boolean(member.is_leader)) ??
    teamMembers[0] ??
    null;

  const resolvedLeaderName =
    teamRow.leader_name?.trim() || leaderFromMembers?.member_name || "";

  const resolvedLeaderEmail =
    teamRow.leader_email?.trim() || leaderFromMembers?.member_email || "";

  const resolvedLeaderPhone =
    teamRow.leader_phone?.trim() || leaderFromMembers?.member_phone || "";

  const resolvedCollege =
    teamRow.college ?? leaderFromMembers?.college ?? null;

  return {
    registrationKind: "team",
    eventId: teamRow.event_id,
    team: {
      id: teamRow.id,
      team_name: teamRow.team_name,
      leader_name: resolvedLeaderName,
      leader_email: resolvedLeaderEmail,
      leader_phone: resolvedLeaderPhone,
      college: resolvedCollege,
      status: teamRow.status,
      created_at: teamRow.created_at,
      updated_at: teamRow.updated_at,
      members: teamMembers.map((member) => ({
        id: member.id,
        member_name: member.member_name,
        member_email: member.member_email,
        member_phone: member.member_phone,
        college: member.college,
        gender: member.gender,
        role: member.role,
        is_leader: Boolean(member.is_leader),
        created_at: member.created_at,
      })),
    },
  };
}