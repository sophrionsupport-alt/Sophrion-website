-- Core tables for events, registrations (individual + team), and careers.
-- Apply in the Supabase SQL editor or via: supabase db push / migration run.
-- Service-role API routes bypass RLS; the anon key is used for public event pages (SELECT on events).

-- ---------------------------------------------------------------------------
-- events
-- ---------------------------------------------------------------------------
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  subtitle text,
  description text,
  overview text,

  event_type text NOT NULL DEFAULT 'workshop'
    CHECK (event_type IN ('workshop', 'hackathon', 'hybrid')),
  registration_type text NOT NULL DEFAULT 'individual'
    CHECK (registration_type IN ('individual', 'team', 'both')),

  min_team_size integer,
  max_team_size integer,

  requires_female_member boolean NOT NULL DEFAULT false,
  required_female_count integer,
  role_based_team boolean NOT NULL DEFAULT false,

  rules_markdown text,
  schedule_json jsonb,
  problem_statements_json jsonb,
  judging_json jsonb,

  start_at timestamptz,
  end_at timestamptz,
  mode text CHECK (mode IS NULL OR mode IN ('online', 'offline', 'hybrid')),
  venue text,
  city text,
  state text,
  banner_url text,

  fee text,
  prize_pool text,
  winner_prize text,
  runner_prize text,

  benefits_json jsonb,
  sample_roles_json jsonb,

  reporting_time text,
  contact_person_name text,
  contact_person_email text,
  contact_person_phone text,
  entry_instructions text,
  map_url text,

  is_published boolean NOT NULL DEFAULT false,
  registration_open boolean NOT NULL DEFAULT false,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX events_is_published_idx ON public.events (is_published);
CREATE INDEX events_start_at_idx ON public.events (start_at DESC NULLS LAST);

-- ---------------------------------------------------------------------------
-- event_registrations (individual)
-- ---------------------------------------------------------------------------
CREATE TABLE public.event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events (id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  college text,
  year text,
  roll_number text,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  source text,
  ip text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX event_registrations_event_id_idx ON public.event_registrations (event_id);
CREATE INDEX event_registrations_status_idx ON public.event_registrations (status);
CREATE INDEX event_registrations_created_at_idx ON public.event_registrations (created_at DESC);

-- ---------------------------------------------------------------------------
-- teams + team_members (team registration)
-- ---------------------------------------------------------------------------
CREATE TABLE public.teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events (id) ON DELETE CASCADE,
  team_name text NOT NULL,
  leader_name text NOT NULL,
  leader_email text NOT NULL,
  leader_phone text NOT NULL,
  college text,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX teams_event_id_idx ON public.teams (event_id);
CREATE INDEX teams_status_idx ON public.teams (status);
CREATE INDEX teams_created_at_idx ON public.teams (created_at DESC);

CREATE TABLE public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES public.teams (id) ON DELETE CASCADE,
  member_name text NOT NULL,
  member_email text,
  member_phone text,
  college text,
  gender text,
  role text,
  is_leader boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX team_members_team_id_idx ON public.team_members (team_id);

-- ---------------------------------------------------------------------------
-- career_roles + career_applications
-- ---------------------------------------------------------------------------
CREATE TABLE public.career_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  team text NOT NULL,
  location text,
  employment_type text NOT NULL,
  mode text NOT NULL,
  short_description text NOT NULL,
  description text,
  responsibilities jsonb NOT NULL DEFAULT '[]'::jsonb,
  requirements jsonb NOT NULL DEFAULT '[]'::jsonb,
  nice_to_have jsonb NOT NULL DEFAULT '[]'::jsonb,
  min_compensation integer,
  max_compensation integer,
  compensation_currency text,
  is_open boolean NOT NULL DEFAULT true,
  is_published boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX career_roles_is_published_idx ON public.career_roles (is_published);
CREATE INDEX career_roles_sort_order_idx ON public.career_roles (sort_order);

CREATE TABLE public.career_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id uuid REFERENCES public.career_roles (id) ON DELETE SET NULL,
  role_title_snapshot text,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  college text,
  degree text,
  graduation_year text,
  linkedin_url text,
  portfolio_url text,
  resume_url text,
  why_join text NOT NULL,
  cover_letter text,
  recruiter_notes text,
  status text NOT NULL DEFAULT 'pending'
    CHECK (
      status IN (
        'pending',
        'reviewing',
        'under_review',
        'shortlisted',
        'approved',
        'selected',
        'rejected'
      )
    ),
  source text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX career_applications_role_id_idx ON public.career_applications (role_id);
CREATE INDEX career_applications_status_idx ON public.career_applications (status);
CREATE INDEX career_applications_created_at_idx ON public.career_applications (created_at DESC);

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_applications ENABLE ROW LEVEL SECURITY;

-- Public marketing pages load events with the anon key (see createSupabaseServerClient).
CREATE POLICY events_select_public
  ON public.events
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Writes and sensitive reads use SUPABASE_SERVICE_ROLE_KEY and bypass RLS.
