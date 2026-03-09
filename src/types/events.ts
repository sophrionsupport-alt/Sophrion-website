// src/types/events.ts

export type EventType = "workshop" | "hackathon" | "hybrid";
export type RegistrationType = "individual" | "team" | "both";

export type ScheduleItem = {
  time: string;
  title: string;
};

export type JudgingCriteria = {
  criteria: string;
  weight: string;
};

export type ProblemStatement = {
  title: string;
  description: string;
};

export type EventListItem = {
  id: string;
  slug: string;

  title: string;
  subtitle?: string | null;
  description?: string | null;
  overview?: string | null;

  start_at?: string | null;
  end_at?: string | null;

  mode?: "online" | "offline" | "hybrid" | string | null;
  venue?: string | null;
  city?: string | null;
  state?: string | null;

  banner_url?: string | null;

  is_published: boolean;
  registration_open: boolean;

  event_type: EventType;
  registration_type: RegistrationType;

  min_team_size?: number | null;
  max_team_size?: number | null;
  requires_female_member?: boolean | null;
  required_female_count?: number | null;
  role_based_team?: boolean | null;

  rules_markdown?: string | null;

  schedule_json?: ScheduleItem[] | null;
  problem_statements_json?: ProblemStatement[] | null;
  judging_json?: JudgingCriteria[] | null;

  entry_fee?: number | null;
  prize_first?: number | null;
  prize_second?: number | null;
  prize_third?: number | null;

  benefits_json?: string[] | null;
  sample_roles_json?: string[] | null;
};

export function eventMeta(e: EventListItem) {
  const parts: string[] = [];

  if (e.start_at) {
    const d = new Date(e.start_at);
    if (!Number.isNaN(d.getTime())) {
      parts.push(d.toLocaleString());
    }
  }

  if (e.venue) parts.push(e.venue);
  else if (e.city) parts.push(e.city);

  return parts.join(" • ");
}