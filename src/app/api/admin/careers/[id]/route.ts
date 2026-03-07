// src/app/api/admin/careers/[id]/route.ts
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

type Ctx = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: Ctx) {
  try {
    const guard = await requireAdmin();
    if (guard instanceof NextResponse) return guard;

    const { id } = await params;
    const supabase = supabaseAdmin();

    const { data, error } = await supabase
      .from("career_roles")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Admin fetch role failed:", error);
      return json(false, { error: "Failed to fetch role" }, 500);
    }

    if (!data) {
      return json(false, { error: "Role not found" }, 404);
    }

    return json(true, { data });
  } catch (error) {
    console.error("Admin role GET error:", error);
    return json(false, { error: "Something went wrong" }, 500);
  }
}

export async function PATCH(req: Request, { params }: Ctx) {
  try {
    const guard = await requireAdmin();
    if (guard instanceof NextResponse) return guard;

    const { id } = await params;
    const body = await req.json();
    const parsed = CareerRoleSchema.safeParse(body);

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return json(false, { error: firstIssue?.message || "Invalid input" }, 400);
    }

    const payload = parsed.data;
    const supabase = supabaseAdmin();

    const { data: duplicate } = await supabase
      .from("career_roles")
      .select("id")
      .eq("slug", payload.slug)
      .neq("id", id)
      .maybeSingle();

    if (duplicate) {
      return json(false, { error: "Slug already exists" }, 400);
    }

    const updatePayload = {
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
      .update(updatePayload)
      .eq("id", id)
      .select("id, title, slug")
      .single();

    if (error) {
      console.error("Admin update role failed:", error);
      return json(false, { error: "Failed to update role" }, 500);
    }

    return json(true, { data, message: "Role updated successfully" });
  } catch (error) {
    console.error("Admin role PATCH error:", error);
    return json(false, { error: "Something went wrong" }, 500);
  }
}