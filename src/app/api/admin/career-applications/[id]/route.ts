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

function json(
  ok: boolean,
  init?: { data?: unknown; error?: string; message?: string },
  status = 200
) {
  return NextResponse.json({ ok, ...init }, { status });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const guard = await requireAdmin();
    if (guard instanceof NextResponse) return guard;

    const { id } = await params;
    const body = await req.json();
    const { status, recruiter_notes } = body ?? {};

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (typeof status === "string" && status.trim()) {
      updates.status = status.trim();
    }

    if (typeof recruiter_notes === "string") {
      updates.recruiter_notes = recruiter_notes;
    }

    const supabase = supabaseAdmin();

    const { data, error } = await supabase
      .from("career_applications")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Career application update failed:", error);
      return json(false, { error: "Failed to update application" }, 500);
    }

    return json(true, { data, message: "Application updated successfully" });
  } catch (error) {
    console.error("Career application PATCH error:", error);
    return json(false, { error: "Something went wrong" }, 500);
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const guard = await requireAdmin();
    if (guard instanceof NextResponse) return guard;

    const { id } = await params;
    const supabase = supabaseAdmin();

    const { error } = await supabase
      .from("career_applications")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Career application delete failed:", error);
      return json(false, { error: "Failed to delete application" }, 500);
    }

    return json(true, { message: "Application deleted successfully" });
  } catch (error) {
    console.error("Career application DELETE error:", error);
    return json(false, { error: "Something went wrong" }, 500);
  }
}