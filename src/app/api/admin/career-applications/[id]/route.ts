import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { sendEmail } from "@/lib/email/send";

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

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildStatusEmail(input: {
  fullName: string;
  status: string;
  roleTitle?: string | null;
}) {
  const subject = `Application status update — ${input.status}`;

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#111827;">
    <p>Hi ${escapeHtml(input.fullName)},</p>

    <p>
      Your application ${
        input.roleTitle
          ? `for <strong>${escapeHtml(input.roleTitle)}</strong>`
          : ""
      } has been updated.
    </p>

    <p>
      <strong>Current status:</strong> ${escapeHtml(input.status)}
    </p>

    <p>
      Our team will contact you if there are further steps required.
    </p>

    <p>
      Regards,<br/>
      Sophrion Careers
    </p>
  </div>
  `;

  const text = `
Hi ${input.fullName},

Your application ${
    input.roleTitle ? `for ${input.roleTitle}` : ""
  } has been updated.

Current status: ${input.status}

Sophrion Careers
`;

  return { subject, html, text };
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
      .select(
        `
        id,
        full_name,
        email,
        role_title_snapshot,
        status
        `
      )
      .single();

    if (error) {
      console.error("Career application update failed:", error);
      return json(false, { error: "Failed to update application" }, 500);
    }

    try {
      const mail = buildStatusEmail({
        fullName: data.full_name,
        status: data.status,
        roleTitle: data.role_title_snapshot,
      });

      await sendEmail({
        to: data.email,
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
      });
    } catch (mailError) {
      console.error("Status email failed:", mailError);
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