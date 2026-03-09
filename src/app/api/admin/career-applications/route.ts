import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export const runtime = "nodejs";

function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function GET() {
  const guard = await requireAdmin();
  if (guard instanceof NextResponse) return guard;

  const supabase = supabaseAdmin();

  const { data, error } = await supabase
    .from("career_applications")
    .select(`
      id,
      role_id,
      role_title_snapshot,
      full_name,
      email,
      phone,
      college,
      degree,
      graduation_year,
      linkedin_url,
      portfolio_url,
      resume_url,
      why_join,
      cover_letter,
      recruiter_notes,
      status,
      source,
      created_at,
      updated_at
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, data });
}