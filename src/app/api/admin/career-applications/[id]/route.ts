// src/app/api/admin/career-applications/[id]/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { CareerApplicationStatusSchema } from "@/lib/validators/careers";

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
      .from("career_applications")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Admin fetch career application failed:", error);
      return json(false, { error: "Failed to fetch application" }, 500);
    }

    if (!data) {
      return json(false, { error: "Application not found" }, 404);
    }

    return json(true, { data });
  } catch (error) {
    console.error("Admin career application GET error:", error);
    return json(false, { error: "Something went wrong" }, 500);
  }
}

export async function PATCH(req: Request, { params }: Ctx) {
  try {
    const guard = await requireAdmin();
    if (guard instanceof NextResponse) return guard;

    const { id } = await params;
    const body = await req.json();
    const parsed = CareerApplicationStatusSchema.safeParse(body);

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return json(false, { error: firstIssue?.message || "Invalid input" }, 400);
    }

    const supabase = supabaseAdmin();

    const { data, error } = await supabase
      .from("career_applications")
      .update({ status: parsed.data.status })
      .eq("id", id)
      .select("id, status, updated_at")
      .single();

    if (error) {
      console.error("Admin update application status failed:", error);
      return json(false, { error: "Failed to update application status" }, 500);
    }

    return json(true, {
      data,
      message: "Application status updated successfully",
    });
  } catch (error) {
    console.error("Admin career application PATCH error:", error);
    return json(false, { error: "Something went wrong" }, 500);
  }
}