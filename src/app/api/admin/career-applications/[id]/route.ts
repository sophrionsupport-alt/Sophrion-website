import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { sendCareerStatusEmail } from "@/lib/email/sendCareerStatusEmail";

export const runtime = "nodejs";

type CareerStatus =
  | "pending"
  | "reviewing"
  | "under_review"
  | "shortlisted"
  | "approved"
  | "selected"
  | "rejected";

function json(
  ok: boolean,
  init?: { data?: unknown; error?: string; message?: string },
  status = 200
) {
  return NextResponse.json({ ok, ...init }, { status });
}

function isValidCareerStatus(value: unknown): value is CareerStatus {
  return (
    value === "pending" ||
    value === "reviewing" ||
    value === "under_review" ||
    value === "shortlisted" ||
    value === "approved" ||
    value === "selected" ||
    value === "rejected"
  );
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin();

    if (!auth.ok) {
      return json(false, { error: auth.error }, auth.status);
    }

    const { id } = await params;

    if (!id) {
      return json(false, { error: "Application id is required." }, 400);
    }

    let body: Record<string, unknown> = {};

    try {
      body = await req.json();
    } catch {
      return json(false, { error: "Invalid JSON body." }, 400);
    }

    const { status, recruiter_notes } = body ?? {};
    const supabase = createSupabaseAdminClient();
    const actorId = auth.actor.userId ?? null;

    const { data: existing, error: existingError } = await supabase
      .from("career_applications")
      .select(
        `
        id,
        full_name,
        email,
        role_id,
        role_title_snapshot,
        recruiter_notes,
        status,
        updated_at
        `
      )
      .eq("id", id)
      .single();

    if (existingError || !existing) {
      return json(
        false,
        {
          error:
            existingError?.code === "PGRST116"
              ? "Application not found."
              : existingError?.message || "Failed to load application.",
        },
        existingError?.code === "PGRST116" ? 404 : 500
      );
    }

    const previousStatus =
      typeof existing.status === "string" ? existing.status : null;

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (status !== undefined) {
      if (typeof status !== "string" || !status.trim()) {
        return json(false, { error: "Invalid status." }, 400);
      }

      const normalizedStatus = status.trim();

      if (!isValidCareerStatus(normalizedStatus)) {
        return json(false, { error: "Invalid status." }, 400);
      }

      updates.status = normalizedStatus;
    }

    if (typeof recruiter_notes === "string") {
      updates.recruiter_notes = recruiter_notes;
    }

    const { data, error } = await supabase
      .from("career_applications")
      .update(updates)
      .eq("id", id)
      .select(
        `
        id,
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
        role_id,
        role_title_snapshot,
        status,
        source,
        created_at,
        updated_at
        `
      )
      .single();

    if (error || !data) {
      console.error("Career application update failed:", error);
      return json(false, { error: "Failed to update application" }, 500);
    }

    let emailResult: unknown = null;

    if (
      typeof updates.status === "string" &&
      previousStatus !== updates.status
    ) {
      try {
        emailResult = await sendCareerStatusEmail({
          applicationId: id,
          actorId,
          source: "career-admin-status-update",
        });
      } catch (mailError) {
        console.error("Career status email failed:", mailError);
      }
    }

    return json(true, {
      data: {
        ...data,
        email_result: emailResult,
      },
      message: "Application updated successfully",
    });
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
    const auth = await requireAdmin();

    if (!auth.ok) {
      return json(false, { error: auth.error }, auth.status);
    }

    const { id } = await params;

    if (!id) {
      return json(false, { error: "Application id is required." }, 400);
    }

    const supabase = createSupabaseAdminClient();

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