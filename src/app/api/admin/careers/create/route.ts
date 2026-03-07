// src/app/api/admin/careers/create/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { CareerRoleSchema } from "@/lib/validators/careers";

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

export async function POST(req: Request) {
  try {
    const guard = await requireAdmin();
    if (guard instanceof NextResponse) return guard;

    const body = await req.json();
    const parsed = CareerRoleSchema.safeParse(body);

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return json(false, { error: firstIssue?.message || "Invalid input" }, 400);
    }

    const payload = parsed.data;
    const supabase = supabaseAdmin();

    const { data: existing } = await supabase
      .from("career_roles")
      .select("id")
      .eq("slug", payload.slug)
      .maybeSingle();

    if (existing) {
      return json(false, { error: "Slug already exists" }, 400);
    }

    const insertPayload = {
      title: payload.title,
      slug: payload.slug,
      team: payload.team,
      location: payload.location ?? null,
      employment_type: payload.employment_type,
      mode: payload.mode,
      short_description: payload.short_description,
      description: payload.description ?? null,
      responsibilities: payload.responsibilities,
      requirements: payload.requirements,
      nice_to_have: payload.nice_to_have,
      min_compensation: payload.min_compensation,
      max_compensation: payload.max_compensation,
      compensation_currency: payload.compensation_currency || "INR",
      is_open: payload.is_open,
      is_published: payload.is_published,
      sort_order: payload.sort_order,
    };

    const { data, error } = await supabase
      .from("career_roles")
      .insert(insertPayload)
      .select("id, title, slug")
      .single();

    if (error) {
      console.error("Admin create role failed:", error);
      return json(false, { error: "Failed to create role" }, 500);
    }

    return json(true, { data, message: "Role created successfully" }, 201);
  } catch (error) {
    console.error("Admin careers create error:", error);
    return json(false, { error: "Something went wrong" }, 500);
  }
}