-- Inbound messages from /api/contact, /api/public/join, and related flows.
-- Run in Supabase: Dashboard → SQL Editor → New query → paste → Run.

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text,
  message text NOT NULL,
  source text,
  archived boolean NOT NULL DEFAULT false,
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS contact_messages_created_at_idx ON public.contact_messages (created_at DESC);
CREATE INDEX IF NOT EXISTS contact_messages_archived_idx ON public.contact_messages (archived);
CREATE INDEX IF NOT EXISTS contact_messages_email_idx ON public.contact_messages (email);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
