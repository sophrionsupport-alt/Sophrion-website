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

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: string | null;
        };
        Insert: {
          id: string;
          role?: string | null;
        };
        Update: {
          id?: string;
          role?: string | null;
        };
        Relationships: [];
      };

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

          is_published?: boolean;
          registration_open?: boolean;

          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      teams: {
        Row: {
          id: string;
          event_id: string;
          team_name: string;
          leader_name: string;
          leader_email: string;
          leader_phone: string | null;
          college: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          team_name: string;
          leader_name: string;
          leader_email: string;
          leader_phone?: string | null;
          college?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          team_name?: string;
          leader_name?: string;
          leader_email?: string;
          leader_phone?: string | null;
          college?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "teams_event_id_fkey";
            columns: ["event_id"];
            referencedRelation: "events";
            referencedColumns: ["id"];
          }
        ];
      };

      team_members: {
        Row: {
          id: string;
          team_id: string;
          member_name: string;
          member_email: string | null;
          member_phone: string | null;
          college: string | null;
          gender: string | null;
          role: string | null;
          is_leader: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          team_id: string;
          member_name: string;
          member_email?: string | null;
          member_phone?: string | null;
          college?: string | null;
          gender?: string | null;
          role?: string | null;
          is_leader?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          team_id?: string;
          member_name?: string;
          member_email?: string | null;
          member_phone?: string | null;
          college?: string | null;
          gender?: string | null;
          role?: string | null;
          is_leader?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey";
            columns: ["team_id"];
            referencedRelation: "teams";
            referencedColumns: ["id"];
          }
        ];
      };

      colleges: {
        Row: {
          id: string;
          name: string;
          city: string | null;
          state: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          city?: string | null;
          state?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          city?: string | null;
          state?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };

      newsletter: {
        Row: {
          id: string;
          email: string;
          source: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          source?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          source?: string | null;
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