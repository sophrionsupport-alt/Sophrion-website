// src/lib/tickets/getTicketByCode.ts

import { createClient } from "@supabase/supabase-js";
import type {
  PublicTicketData,
  TicketBase,
  TicketEventSnapshot,
  TicketRegistrationSnapshot,
  TeamMemberSnapshot,
} from "@/lib/tickets/types";

function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRole) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  return createClient(url, serviceRole, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function normalizeTicket(row: Record<string, any>): TicketBase {
  return {
    id: row.id,
    event_id: row.event_id,
    registration_id: row.registration_id,
    registration_kind: row.registration_kind,
    ticket_code: row.ticket_code,
    verification_token: row.verification_token,
    status: row.status,
    version: row.version ?? 1,
    issued_at: row.issued_at ?? null,
    emailed_at: row.emailed_at ?? null,
    checked_in_at: row.checked_in_at ?? null,
    checked_in_by: row.checked_in_by ?? null,
    invalidated_at: row.invalidated_at ?? null,
    cancelled_at: row.cancelled_at ?? null,
    created_by: row.created_by ?? null,
    notes: row.notes ?? null,
    created_at: row.created_at ?? null,
  };
}

function buildLocation(row: Record<string, any>) {
  const parts = [row.venue, row.city, row.state]
    .map((v) => (typeof v === "string" ? v.trim() : v))
    .filter(Boolean);

  return parts.length ? parts.join(", ") : null;
}

function normalizeEvent(row: Record<string, any>): TicketEventSnapshot {
  return {
    id: row.id,
    title: row.title ?? "Event",
    slug: row.slug ?? null,
    event_type: row.event_type ?? null,
    registration_type: row.registration_type ?? null,
    mode: row.mode ?? null,
    location: buildLocation(row),
    venue_name: row.venue ?? null,
    start_date: row.start_at ?? null,
    end_date: row.end_at ?? null,
    reporting_time: row.reporting_time ?? null,
    fee: row.fee ?? row.entry_fee ?? null,
    prize_pool: row.prize_pool ?? null,
    winner_prize: row.winner_prize ?? row.prize_first ?? null,
    runner_prize: row.runner_prize ?? row.prize_second ?? null,
    contact_person_name: row.contact_person_name ?? null,
    contact_person_email: row.contact_person_email ?? null,
    contact_person_phone: row.contact_person_phone ?? null,
    entry_instructions: row.entry_instructions ?? null,
    map_url: row.map_url ?? null,
  };
}

async function getIndividualRegistrationSnapshot(
  registrationId: string
): Promise<TicketRegistrationSnapshot> {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("event_registrations")
    .select(
      `
      id,
      full_name,
      email,
      phone,
      college,
      year,
      roll_number,
      status
      `
    )
    .eq("id", registrationId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch individual registration: ${error.message}`);
  }

  if (!data) {
    throw new Error("Individual registration not found");
  }

  return {
    kind: "individual",
    registration_id: data.id,
    name: data.full_name ?? "Participant",
    email: data.email ?? "",
    phone: data.phone ?? null,
    college: data.college ?? null,
    year: data.year ?? null,
    roll_number: data.roll_number ?? null,
    status: data.status ?? null,
  };
}

async function getTeamRegistrationSnapshot(
  teamId: string
): Promise<TicketRegistrationSnapshot> {
  const supabase = createSupabaseAdminClient();

  const [{ data: team, error: teamError }, { data: members, error: membersError }] =
    await Promise.all([
      supabase
        .from("teams")
        .select(
          `
          id,
          team_name
          `
        )
        .eq("id", teamId)
        .maybeSingle(),
      supabase
        .from("team_members")
        .select(
          `
          id,
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
        .eq("team_id", teamId)
        .order("is_leader", { ascending: false }),
    ]);

  if (teamError) {
    throw new Error(`Failed to fetch team: ${teamError.message}`);
  }

  if (membersError) {
    throw new Error(`Failed to fetch team members: ${membersError.message}`);
  }

  if (!team) {
    throw new Error("Team registration not found");
  }

  const normalizedMembers: TeamMemberSnapshot[] = (members ?? []).map((m) => ({
    id: m.id,
    name: m.member_name ?? "Member",
    email: m.member_email ?? null,
    phone: m.member_phone ?? null,
    college: m.college ?? null,
    gender: m.gender ?? null,
    role: m.role ?? null,
    is_leader: Boolean(m.is_leader),
  }));

  const leader = normalizedMembers.find((m) => m.is_leader) ?? null;

  return {
    kind: "team",
    registration_id: team.id,
    team_name: team.team_name ?? "Team",
    status: null,
    leader: leader
      ? {
          name: leader.name,
          email: leader.email,
          phone: leader.phone,
          college: leader.college,
        }
      : null,
    members: normalizedMembers,
  };
}

async function getRegistrationSnapshot(
  registrationId: string,
  registrationKind: "individual" | "team"
): Promise<TicketRegistrationSnapshot> {
  if (registrationKind === "individual") {
    return getIndividualRegistrationSnapshot(registrationId);
  }

  return getTeamRegistrationSnapshot(registrationId);
}

export async function getTicketByCode(
  code: string
): Promise<PublicTicketData | null> {
  const normalizedCode = decodeURIComponent(String(code)).trim().toUpperCase();

  if (!normalizedCode) return null;

  const supabase = createSupabaseAdminClient();

  const { data: ticketRow, error: ticketError } = await supabase
    .from("event_tickets")
    .select(
      `
      id,
      event_id,
      registration_id,
      registration_kind,
      ticket_code,
      verification_token,
      status,
      version,
      issued_at,
      emailed_at,
      checked_in_at,
      checked_in_by,
      invalidated_at,
      cancelled_at,
      created_by,
      notes,
      created_at
      `
    )
    .eq("ticket_code", normalizedCode)
    .maybeSingle();

  if (ticketError) {
    throw new Error(`Failed to fetch ticket: ${ticketError.message}`);
  }

  if (!ticketRow) {
    return null;
  }

  const { data: eventRow, error: eventError } = await supabase
    .from("events")
    .select(
      `
      id,
      title,
      slug,
      event_type,
      registration_type,
      mode,
      venue,
      city,
      state,
      start_at,
      end_at,
      fee,
      entry_fee,
      prize_pool,
      winner_prize,
      runner_prize,
      prize_first,
      prize_second,
      reporting_time,
      contact_person_name,
      contact_person_email,
      contact_person_phone,
      entry_instructions,
      map_url
      `
    )
    .eq("id", ticketRow.event_id)
    .maybeSingle();

  if (eventError) {
    throw new Error(`Failed to fetch event: ${eventError.message}`);
  }

  if (!eventRow) {
    throw new Error("Event not found for ticket");
  }

  const registration = await getRegistrationSnapshot(
    ticketRow.registration_id,
    ticketRow.registration_kind
  );

  return {
    ticket: normalizeTicket(ticketRow),
    event: normalizeEvent(eventRow),
    registration,
  };
}