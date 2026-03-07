// src/app/api/admin/careers/route.ts
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
      .from("career_roles")
      .select(
        `
        id,
        title,
        slug,
        team,
        location,
        employment_type,
        mode,
        short_description,
        min_compensation,
        max_compensation,
        compensation_currency,
        is_open,
        is_published,
        sort_order,
        created_at,
        updated_at
        `
      )
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Admin careers list failed:", error);
      return json(false, { error: "Failed to fetch roles" }, 500);
    }

    return json(true, { data });
  } catch (error) {
    console.error("Admin careers GET error:", error);
    return json(false, { error: "Something went wrong" }, 500);
  }
}