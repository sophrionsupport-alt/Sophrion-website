import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { CareerApplySchema } from "@/lib/validators/careers";
import { sendEmail } from "@/lib/email/send";

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
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildCareerAcknowledgementEmail(input: {
  fullName: string;
  roleTitle?: string | null;
}) {
  const rawName = input.fullName.trim() || "there";
  const safeName = escapeHtml(rawName);
  const safeRole = input.roleTitle ? escapeHtml(input.roleTitle) : null;

  const subject = input.roleTitle
    ? `Application received — ${input.roleTitle}`
    : "Application received — Sophrion";

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.7;color:#111827;">
      <p>Hi ${safeName},</p>

      <p>
        We’ve received your application${
          safeRole ? ` for <strong>${safeRole}</strong>` : ""
        }.
      </p>

      <p>
        Thank you for your interest in Sophrion. Our team will review your submission
        and reach out if there is a strong fit for the next step.
      </p>

      <p>
        Regards,<br />
        Sophrion Careers
      </p>
    </div>
  `;

  const text = [
    `Hi ${rawName},`,
    "",
    `We’ve received your application${
      input.roleTitle ? ` for ${input.roleTitle}` : ""
    }.`,
    "",
    "Thank you for your interest in Sophrion. Our team will review your submission and reach out if there is a strong fit for the next step.",
    "",
    "Regards,",
    "Sophrion Careers",
  ].join("\n");

  return { subject, html, text };
}

function buildAdminNotificationEmail(input: {
  fullName: string;
  email: string;
  roleTitle?: string | null;
  college?: string | null;
  degree?: string | null;
  graduationYear?: string | null;
  linkedin?: string | null;
}) {
  const subject = `New career application — ${input.fullName}`;

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#111827;">
      <h2>New Sophrion Career Application</h2>

      <p><strong>Name:</strong> ${escapeHtml(input.fullName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>

      ${
        input.roleTitle
          ? `<p><strong>Role:</strong> ${escapeHtml(input.roleTitle)}</p>`
          : `<p><strong>Role:</strong> Builder Network</p>`
      }

      ${
        input.college
          ? `<p><strong>College:</strong> ${escapeHtml(input.college)}</p>`
          : ""
      }

      ${
        input.degree
          ? `<p><strong>Degree:</strong> ${escapeHtml(input.degree)}</p>`
          : ""
      }

      ${
        input.graduationYear
          ? `<p><strong>Graduation Year:</strong> ${escapeHtml(
              input.graduationYear
            )}</p>`
          : ""
      }

      ${
        input.linkedin
          ? `<p><strong>LinkedIn:</strong> <a href="${escapeHtml(
              input.linkedin
            )}">${escapeHtml(input.linkedin)}</a></p>`
          : ""
      }

      <hr />

      <p>
        View in admin dashboard:
        <br />
        <a href="https://sophrion.in/admin/career-applications">
          Open applications dashboard
        </a>
      </p>
    </div>
  `;

  const text = [
    "New Sophrion Career Application",
    "",
    `Name: ${input.fullName}`,
    `Email: ${input.email}`,
    `Role: ${input.roleTitle ?? "Builder Network"}`,
    `College: ${input.college ?? "-"}`,
    `Degree: ${input.degree ?? "-"}`,
    `Graduation Year: ${input.graduationYear ?? "-"}`,
    `LinkedIn: ${input.linkedin ?? "-"}`,
    "",
    "Admin dashboard:",
    "https://sophrion.in/admin/career-applications",
  ].join("\n");

  return { subject, html, text };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = CareerApplySchema.safeParse(body);

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return json(false, { error: firstIssue?.message || "Invalid input" }, 400);
    }

    const payload = parsed.data;
    const supabase = supabaseAdmin();

    let roleId: string | null = payload.role_id ?? null;
    let roleTitleSnapshot: string | null = payload.role_title_snapshot ?? null;

    if (roleId) {
      const { data: role, error: roleError } = await supabase
        .from("career_roles")
        .select("id,title,is_published")
        .eq("id", roleId)
        .maybeSingle();

      if (roleError) {
        console.error("Career role lookup failed:", roleError);
        return json(false, { error: "Failed to validate selected role" }, 500);
      }

      if (!role || !role.is_published) {
        return json(false, { error: "Selected role is unavailable" }, 400);
      }

      roleTitleSnapshot = role.title;
    }

    const insertPayload = {
      role_id: roleId,
      role_title_snapshot: roleTitleSnapshot,
      full_name: payload.full_name,
      email: payload.email,
      phone: payload.phone ?? null,
      college: payload.college ?? null,
      degree: payload.degree ?? null,
      graduation_year: payload.graduation_year ?? null,
      linkedin_url: payload.linkedin_url ?? null,
      portfolio_url: payload.portfolio_url ?? null,
      why_join: payload.why_join,
      cover_letter: payload.cover_letter ?? null,
      source: payload.source || "careers_site",
    };

    const { data, error } = await supabase
      .from("career_applications")
      .insert(insertPayload)
      .select("id,full_name,email,status,created_at")
      .single();

    if (error) {
      console.error("Career application insert failed:", error);
      return json(false, { error: "Failed to submit application" }, 500);
    }

    try {
      const applicantMail = buildCareerAcknowledgementEmail({
        fullName: payload.full_name,
        roleTitle: roleTitleSnapshot,
      });

      await sendEmail({
        to: payload.email,
        subject: applicantMail.subject,
        html: applicantMail.html,
        text: applicantMail.text,
      });
    } catch (mailError) {
      console.error("Career acknowledgement email failed:", mailError);
    }

    try {
      const adminEmails =
        process.env.CAREERS_ADMIN_EMAIL?.split(",")
          .map((email) => email.trim())
          .filter(Boolean) ?? [];

      if (adminEmails.length > 0) {
        const adminMail = buildAdminNotificationEmail({
          fullName: payload.full_name,
          email: payload.email,
          roleTitle: roleTitleSnapshot,
          college: payload.college,
          degree: payload.degree,
          graduationYear: payload.graduation_year,
          linkedin: payload.linkedin_url,
        });

        await sendEmail({
          to: adminEmails,
          subject: adminMail.subject,
          html: adminMail.html,
          text: adminMail.text,
        });
      }
    } catch (adminMailError) {
      console.error("Admin notification email failed:", adminMailError);
    }

    return json(
      true,
      {
        data,
        message:
          "Application submitted successfully. We’ll review it and reach out if there is a fit.",
      },
      201
    );
  } catch (error) {
    console.error("Public careers apply API error:", error);
    return json(false, { error: "Something went wrong" }, 500);
  }
}