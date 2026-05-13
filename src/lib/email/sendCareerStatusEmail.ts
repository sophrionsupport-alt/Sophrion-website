import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/send";

export async function sendCareerStatusEmail(input: {
  applicationId: string;
  actorId?: string | null;
  source?: string | null;
}) {
  const supabase = createSupabaseAdminClient();

  const { data: app, error } = await supabase
    .from("career_applications")
    .select(
      "id, full_name, email, role_title_snapshot, status, recruiter_notes, updated_at"
    )
    .eq("id", input.applicationId)
    .maybeSingle();

  if (error || !app) {
    console.error("[sendCareerStatusEmail] load failed", error);
    return { ok: false as const, skipped: true as const };
  }

  const row = app as {
    full_name: string;
    email: string;
    role_title_snapshot: string | null;
    status: string;
    recruiter_notes: string | null;
  };

  const role = row.role_title_snapshot || "Sophrion";
  const subject = `Application update — ${role}`;

  const safeName = row.full_name.replaceAll("<", "&lt;");
  const statusLabel = row.status.replaceAll("<", "&lt;");

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#111827;">
      <p>Hi ${safeName},</p>
      <p>Your application status is now: <strong>${statusLabel}</strong>.</p>
      <p>If we need more information, our team will email you from an official Sophrion address.</p>
      <p style="font-size:12px;color:#6b7280;">Reference: ${input.applicationId} · ${input.source ?? "system"}</p>
    </div>
  `;

  try {
    await sendEmail({
      to: row.email,
      subject,
      html,
      text: `Hi ${row.full_name},\n\nYour application status is now: ${row.status}.\n`,
    });
    return { ok: true as const, emailed: true as const };
  } catch (e) {
    console.error("[sendCareerStatusEmail] send failed", e);
    return { ok: false as const, emailed: false as const };
  }
}
