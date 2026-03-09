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

          is_published?: boolean;
          registration_open?: boolean;

          created_at?: string;
          updated_at?: string;
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