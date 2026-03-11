// src/lib/careers/sendCareerStatusEmail.ts

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/send";
import { careerApplicationStatusEmail } from "@/lib/email/templates";

type SendCareerStatusEmailInput = {
  applicationId: string;
  actorId?: string | null;
  source?: string | null;
};

type CareerApplicationRow = {
  id: string;
  role_id: string | null;
  role_title_snapshot: string | null;
  full_name: string | null;
  email: string | null;
  status: string | null;
};

type CareerRoleRow = {
  id: string;
  title: string | null;
};

export async function sendCareerStatusEmail(
  input: SendCareerStatusEmailInput
) {
  const supabase = createSupabaseAdminClient();

  const { data: application, error: appError } = await supabase
    .from("career_applications")
    .select(
      `
      id,
      role_id,
      role_title_snapshot,
      full_name,
      email,
      status
      `
    )
    .eq("id", input.applicationId)
    .single();

  if (appError || !application) {
    throw new Error("Career application not found for status email.");
  }

  const applicationRow = application as CareerApplicationRow;

  if (!applicationRow.email) {
    throw new Error("Candidate email is missing.");
  }

  if (!applicationRow.full_name) {
    throw new Error("Candidate name is missing.");
  }

  if (!applicationRow.status) {
    throw new Error("Application status is missing.");
  }

  let roleTitle = applicationRow.role_title_snapshot || "the applied role";

  if (applicationRow.role_id) {
    const { data: role } = await supabase
      .from("career_roles")
      .select("id, title")
      .eq("id", applicationRow.role_id)
      .maybeSingle();

    if (role) {
      roleTitle = ((role as CareerRoleRow).title || roleTitle).trim();
    }
  }

  const mail = careerApplicationStatusEmail({
    candidateName: applicationRow.full_name,
    roleTitle,
    status: applicationRow.status,
    companyName: "Sophrion",
  });

  await sendEmail({
    to: applicationRow.email,
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
  });

  const now = new Date().toISOString();

  return {
    ok: true as const,
    applicationId: applicationRow.id,
    email: applicationRow.email,
    status: applicationRow.status,
    roleTitle,
    meta: {
      source: input.source ?? "system",
      actor_id: input.actorId ?? null,
      emailed_at: now,
      email_type: "career_status_update",
    },
  };
}