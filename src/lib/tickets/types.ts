// src/lib/tickets/types.ts

export type TicketRegistrationKind = "individual" | "team";

export type TicketStatus =
  | "active"
  | "used"
  | "cancelled"
  | "invalidated";

export type RegistrationStatus = "pending" | "approved" | "rejected";

export type ScanResult =
  | "valid"
  | "already_used"
  | "cancelled"
  | "invalid"
  | "signature_failed"
  | "wrong_event";

export type TicketAuditAction =
  | "issued"
  | "regenerated"
  | "emailed"
  | "resend_requested"
  | "invalidated"
  | "cancelled"
  | "checked_in"
  | "verification_failed"
  | "scan_attempt";

export type TeamMemberSnapshot = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  college: string | null;
  gender: string | null;
  role: string | null;
  is_leader: boolean;
};

export type TicketLeaderSnapshot = {
  name: string;
  email: string | null;
  phone: string | null;
  college: string | null;
};

export type TicketRegistrationSnapshot =
  | {
      kind: "individual";
      registration_id: string;
      name: string;
      email: string;
      phone: string | null;
      college: string | null;
      year: string | null;
      roll_number: string | null;
      status: string | null;
    }
  | {
      kind: "team";
      registration_id: string;
      team_name: string;
      status: string | null;
      leader: TicketLeaderSnapshot | null;
      members: TeamMemberSnapshot[];
    };

export type IndividualRegistrationRecord = {
  id: string;
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

export type TeamMemberRecord = {
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

export type TeamRecord = {
  id: string;
  team_name: string;
  leader_name: string;
  leader_email: string;
  leader_phone: string;
  college: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
  members: TeamMemberRecord[];
};

export type RegistrationSnapshot =
  | {
      registrationKind: "individual";
      eventId: string;
      registration: IndividualRegistrationRecord;
    }
  | {
      registrationKind: "team";
      eventId: string;
      team: TeamRecord;
    };

export type TicketTokenPayload = {
  ticketId: string;
  registrationId: string;
  registrationKind: TicketRegistrationKind;
  eventId: string;
  version: number;
  timestamp: number;
  nonce: string;
};

export type VerifiedTokenResult =
  | {
      ok: true;
      payload: TicketTokenPayload;
    }
  | {
      ok: false;
      error: "invalid_format" | "signature_failed" | "invalid_payload";
    };

export type IssueTicketInput = {
  registrationId: string;
  registrationKind: TicketRegistrationKind;
  eventId: string;
  actorId?: string | null;
  notes?: string | null;
};

export type TicketBase = {
  id: string;
  event_id: string;
  registration_id: string;
  registration_kind: TicketRegistrationKind;
  ticket_code: string;
  verification_token: string;
  status: TicketStatus | string;
  version: number;
  issued_at: string | null;
  emailed_at: string | null;
  checked_in_at: string | null;
  checked_in_by: string | null;
  invalidated_at: string | null;
  cancelled_at: string | null;
  created_by: string | null;
  notes: string | null;
  created_at: string | null;
};

export type TicketEventSnapshot = {
  id: string;
  title: string;
  slug: string | null;
  event_type: string | null;
  registration_type: string | null;
  mode: string | null;
  location: string | null;
  venue_name: string | null;
  start_date: string | null;
  end_date: string | null;
  reporting_time: string | null;
  fee: number | string | null;
  prize_pool: number | string | null;
  winner_prize: number | string | null;
  runner_prize: number | string | null;
  contact_person_name: string | null;
  contact_person_email: string | null;
  contact_person_phone: string | null;
  entry_instructions: string | null;
  map_url: string | null;
};

export type PublicTicketData = {
  ticket: TicketBase;
  event: TicketEventSnapshot;
  registration: TicketRegistrationSnapshot;
};

export type IssueTicketResult =
  | {
      ok: true;
      ticket: TicketBase;
      snapshot: RegistrationSnapshot;
      message: string;
    }
  | {
      ok: false;
      message: string;
    };

export type CheckInTicketInput = {
  token: string;
  eventId?: string | null;
  scannedBy?: string | null;
  source?: string | null;
  device?: string | null;
  ip?: string | null;
  userAgent?: string | null;
};

export type CheckInTicketResult =
  | {
      ok: true;
      result: "valid";
      message: string;
      ticket: TicketBase;
      event: {
        id: string;
        title?: string | null;
        slug?: string | null;
      } | null;
      registration: RegistrationSnapshot | null;
    }
  | {
      ok: false;
      result:
        | "already_used"
        | "cancelled"
        | "invalid"
        | "signature_failed"
        | "wrong_event";
      message: string;
      ticket?: TicketBase;
      event?: {
        id: string;
        title?: string | null;
        slug?: string | null;
      } | null;
      registration?: RegistrationSnapshot | null;
    };