import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type {
  IndividualRegistrationRecord,
  RegistrationSnapshot,
  TeamMemberRecord,
  TeamRecord,
  TicketRegistrationKind,
} from "@/lib/tickets/types";

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

    if (error || !data) return null;

    const row = data as {
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

    const registration: IndividualRegistrationRecord = {
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
    };

    return {
      registrationKind: "individual",
      eventId: row.event_id,
      registration,
    };
  }

  const { data: teamRow, error: teamErr } = await supabase
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
    .maybeSingle();

  if (teamErr || !teamRow) return null;

  const { data: memberRows, error: memErr } = await supabase
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
    .eq("team_id", (teamRow as { id: string }).id);

  if (memErr) return null;

  const members: TeamMemberRecord[] = (memberRows ?? []).map((m) => {
    const r = m as {
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
    return {
      id: r.id,
      member_name: r.member_name,
      member_email: r.member_email,
      member_phone: r.member_phone,
      college: r.college,
      gender: r.gender,
      role: r.role,
      is_leader: r.is_leader,
      created_at: r.created_at,
    };
  });

  const tr = teamRow as {
    id: string;
    event_id: string;
    team_name: string;
    leader_name: string;
    leader_email: string;
    leader_phone: string;
    college: string | null;
    status: string | null;
    created_at: string | null;
    updated_at: string | null;
  };

  const team: TeamRecord = {
    id: tr.id,
    team_name: tr.team_name,
    leader_name: tr.leader_name,
    leader_email: tr.leader_email,
    leader_phone: tr.leader_phone,
    college: tr.college,
    status: tr.status,
    created_at: tr.created_at,
    updated_at: tr.updated_at,
    members,
  };

  return {
    registrationKind: "team",
    eventId: tr.event_id,
    team,
  };
}
