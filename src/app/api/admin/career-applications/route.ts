// src/app/api/admin/career-applications/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export const runtime = "nodejs";

function json(
  ok: boolean,
  init?: { data?: unknown; error?: string; message?: string },
  status = 200
) {
  return NextResponse.json({ ok, ...init }, { status });
}

function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function GET() {
  try {
    const guard = await requireAdmin();
    if (guard instanceof NextResponse) return guard;

    const supabase = supabaseAdmin();

    const { data, error } = await supabase
      .from("career_applications")
      .select(
        `
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
        status,
        source,
        created_at,
        updated_at
        `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Admin career applications list failed:", error);
      return json(false, { error: "Failed to fetch applications" }, 500);
    }

    return json(true, { data });
  } catch (error) {
    console.error("Admin career applications GET error:", error);
    return json(false, { error: "Something went wrong" }, 500);
  }
}