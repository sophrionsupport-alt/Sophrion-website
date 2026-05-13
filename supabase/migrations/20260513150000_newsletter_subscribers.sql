-- Newsletter signups from /api/newsletter and /api/public/newsletter/subscribe.
-- Writes use SUPABASE_SERVICE_ROLE_KEY (bypasses RLS).
-- /api/admin/newsletter* uses the service-role client after requireAdmin() — no public.profiles dependency.

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  name text,
  source text NOT NULL DEFAULT 'website',
  status text NOT NULL DEFAULT 'active',
  unsubscribed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT newsletter_subscribers_email_key UNIQUE (email)
);

CREATE INDEX IF NOT EXISTS newsletter_subscribers_created_at_idx
  ON public.newsletter_subscribers (created_at DESC);
CREATE INDEX IF NOT EXISTS newsletter_subscribers_status_idx
  ON public.newsletter_subscribers (status);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Remove legacy policies if you previously ran a version that referenced public.profiles.
DROP POLICY IF EXISTS newsletter_subscribers_admin_select ON public.newsletter_subscribers;
DROP POLICY IF EXISTS newsletter_subscribers_admin_update ON public.newsletter_subscribers;

-- No SELECT/INSERT/UPDATE policies for anon/authenticated: only service role (admin API + public signup) touches this table.
