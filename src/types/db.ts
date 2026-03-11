// src/types/db.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export type RegistrationType = "individual" | "team" | "both";
export type EventType = "workshop" | "hackathon" | "hybrid";
export type EventMode = "online" | "offline" | "hybrid";

export type TicketStatus = "active" | "used" | "invalidated" | "cancelled";
export type TicketScanResult =
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

export type VolunteerRole = "scanner" | "coordinator";

export type Database = {
  public: {
    Tables: {
      events: {
        Row: {
          id: string;
          slug: string;
          title: string;
          subtitle: string | null;
          description: string | null;
          overview: string | null;

          event_type: EventType;
          registration_type: RegistrationType;

          min_team_size: number | null;
          max_team_size: number | null;

          requires_female_member: boolean;
          required_female_count: number | null;
          role_based_team: boolean;

          rules_markdown: string | null;
          schedule_json: Json | null;
          problem_statements_json: Json | null;
          judging_json: Json | null;

          start_at: string | null;
          end_at: string | null;
          mode: EventMode | null;
          venue: string | null;
          city: string | null;
          state: string | null;
          banner_url: string | null;

          fee: string | null;
          prize_pool: string | null;
          winner_prize: string | null;
          runner_prize: string | null;

          benefits_json: Json | null;
          sample_roles_json: Json | null;

          reporting_time: string | null;
          contact_person_name: string | null;
          contact_person_email: string | null;
          contact_person_phone: string | null;
          entry_instructions: string | null;
          map_url: string | null;

          is_published: boolean;
          registration_open: boolean;

          created_at: string;
          updated_at: string;
        };

        Insert: {
          id?: string;
          slug: string;
          title: string;
          subtitle?: string | null;
          description?: string | null;
          overview?: string | null;

          event_type?: EventType;
          registration_type?: RegistrationType;

          min_team_size?: number | null;
          max_team_size?: number | null;

          requires_female_member?: boolean;
          required_female_count?: number | null;
          role_based_team?: boolean;

          rules_markdown?: string | null;
          schedule_json?: Json | null;
          problem_statements_json?: Json | null;
          judging_json?: Json | null;

          start_at?: string | null;
          end_at?: string | null;
          mode?: EventMode | null;
          venue?: string | null;
          city?: string | null;
          state?: string | null;
          banner_url?: string | null;

          fee?: string | null;
          prize_pool?: string | null;
          winner_prize?: string | null;
          runner_prize?: string | null;

          benefits_json?: Json | null;
          sample_roles_json?: Json | null;

          reporting_time?: string | null;
          contact_person_name?: string | null;
          contact_person_email?: string | null;
          contact_person_phone?: string | null;
          entry_instructions?: string | null;
          map_url?: string | null;

          is_published?: boolean;
          registration_open?: boolean;

          created_at?: string;
          updated_at?: string;
        };

        Update: {
          id?: string;
          slug?: string;
          title?: string;
          subtitle?: string | null;
          description?: string | null;
          overview?: string | null;

          event_type?: EventType;
          registration_type?: RegistrationType;

          min_team_size?: number | null;
          max_team_size?: number | null;

          requires_female_member?: boolean;
          required_female_count?: number | null;
          role_based_team?: boolean;

          rules_markdown?: string | null;
          schedule_json?: Json | null;
          problem_statements_json?: Json | null;
          judging_json?: Json | null;

          start_at?: string | null;
          end_at?: string | null;
          mode?: EventMode | null;
          venue?: string | null;
          city?: string | null;
          state?: string | null;
          banner_url?: string | null;

          fee?: string | null;
          prize_pool?: string | null;
          winner_prize?: string | null;
          runner_prize?: string | null;

          benefits_json?: Json | null;
          sample_roles_json?: Json | null;

          reporting_time?: string | null;
          contact_person_name?: string | null;
          contact_person_email?: string | null;
          contact_person_phone?: string | null;
          entry_instructions?: string | null;
          map_url?: string | null;

          is_published?: boolean;
          registration_open?: boolean;

          created_at?: string;
          updated_at?: string;
        };

        Relationships: [];
      };

      event_tickets: {
        Row: {
          id: string;
          registration_id: string;
          event_id: string;
          ticket_code: string;
          verification_token: string;
          status: TicketStatus;
          version: number;
          issued_at: string;
          emailed_at: string | null;
          checked_in_at: string | null;
          checked_in_by: string | null;
          invalidated_at: string | null;
          cancelled_at: string | null;
          created_by: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
          registration_kind: "individual" | "team";
        };

        Insert: {
          id?: string;
          registration_id: string;
          event_id: string;
          ticket_code: string;
          verification_token: string;
          status?: TicketStatus;
          version?: number;
          issued_at?: string;
          emailed_at?: string | null;
          checked_in_at?: string | null;
          checked_in_by?: string | null;
          invalidated_at?: string | null;
          cancelled_at?: string | null;
          created_by?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          registration_kind: "individual" | "team";
        };

        Update: {
          id?: string;
          registration_id?: string;
          event_id?: string;
          ticket_code?: string;
          verification_token?: string;
          status?: TicketStatus;
          version?: number;
          issued_at?: string;
          emailed_at?: string | null;
          checked_in_at?: string | null;
          checked_in_by?: string | null;
          invalidated_at?: string | null;
          cancelled_at?: string | null;
          created_by?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          registration_kind: "individual" | "team";
        };

        Relationships: [];
      };

      ticket_scans: {
        Row: {
          id: string;
          ticket_id: string | null;
          event_id: string | null;
          scanned_by: string | null;
          scan_result: TicketScanResult;
          source: string | null;
          payload: Json | null;
          device: string | null;
          ip: string | null;
          user_agent: string | null;
          created_at: string;
        };

        Insert: {
          id?: string;
          ticket_id?: string | null;
          event_id?: string | null;
          scanned_by?: string | null;
          scan_result: TicketScanResult;
          source?: string | null;
          payload?: Json | null;
          device?: string | null;
          ip?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };

        Update: {
          id?: string;
          ticket_id?: string | null;
          event_id?: string | null;
          scanned_by?: string | null;
          scan_result?: TicketScanResult;
          source?: string | null;
          payload?: Json | null;
          device?: string | null;
          ip?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };

        Relationships: [];
      };

      ticket_audit_logs: {
        Row: {
          id: string;
          ticket_id: string | null;
          registration_id: string | null;
          event_id: string | null;
          actor_id: string | null;
          action: TicketAuditAction;
          meta: Json | null;
          created_at: string;
        };

        Insert: {
          id?: string;
          ticket_id?: string | null;
          registration_id?: string | null;
          event_id?: string | null;
          actor_id?: string | null;
          action: TicketAuditAction;
          meta?: Json | null;
          created_at?: string;
        };

        Update: {
          id?: string;
          ticket_id?: string | null;
          registration_id?: string | null;
          event_id?: string | null;
          actor_id?: string | null;
          action?: TicketAuditAction;
          meta?: Json | null;
          created_at?: string;
        };

        Relationships: [];
      };

      event_volunteers: {
        Row: {
          id: string;
          event_id: string;
          name: string;
          email: string;
          temp_password_hash: string;
          role: VolunteerRole;
          active: boolean;
          expires_at: string | null;
          created_at: string;
        };

        Insert: {
          id?: string;
          event_id: string;
          name: string;
          email: string;
          temp_password_hash: string;
          role?: VolunteerRole;
          active?: boolean;
          expires_at?: string | null;
          created_at?: string;
        };

        Update: {
          id?: string;
          event_id?: string;
          name?: string;
          email?: string;
          temp_password_hash?: string;
          role?: VolunteerRole;
          active?: boolean;
          expires_at?: string | null;
          created_at?: string;
        };

        Relationships: [];
      };
    };

    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};