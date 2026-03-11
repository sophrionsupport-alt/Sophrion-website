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
    console.log("[careers/apply] POST hit");

    const body = await req.json();
    console.log("[careers/apply] raw body:", body);

    const parsed = CareerApplySchema.safeParse(body);

    if (!parsed.success) {
      console.error(
        "[careers/apply] validation failed:",
        parsed.error.flatten()
      );
      const firstIssue = parsed.error.issues[0];
      return json(false, { error: firstIssue?.message || "Invalid input" }, 400);
    }

    const payload = parsed.data;
    console.log("[careers/apply] parsed payload:", payload);

    const supabase = supabaseAdmin();

    let roleId: string | null = payload.role_id ?? null;
    let roleTitleSnapshot: string | null = payload.role_title_snapshot ?? null;

    if (roleId) {
      console.log("[careers/apply] validating role:", roleId);

      const { data: role, error: roleError } = await supabase
        .from("career_roles")
        .select("id,title,is_published")
        .eq("id", roleId)
        .maybeSingle();

      if (roleError) {
        console.error("[careers/apply] career role lookup failed:", roleError);
        return json(false, { error: "Failed to validate selected role" }, 500);
      }

      if (!role || !role.is_published) {
        console.error("[careers/apply] selected role unavailable:", role);
        return json(false, { error: "Selected role is unavailable" }, 400);
      }

      roleTitleSnapshot = role.title;
      console.log("[careers/apply] role validated:", roleTitleSnapshot);
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

    console.log("[careers/apply] insert payload:", insertPayload);

    const { data, error } = await supabase
      .from("career_applications")
      .insert(insertPayload)
      .select("id,full_name,email,status,created_at")
      .single();

    if (error) {
      console.error("[careers/apply] career application insert failed:", error);
      return json(false, { error: "Failed to submit application" }, 500);
    }

    console.log("[careers/apply] insert success:", data);

    try {
      const applicantMail = buildCareerAcknowledgementEmail({
        fullName: payload.full_name,
        roleTitle: roleTitleSnapshot,
      });

      console.log("[careers/apply] sending applicant email to:", payload.email);

      const applicantMailResult = await sendEmail({
        to: payload.email,
        subject: applicantMail.subject,
        html: applicantMail.html,
        text: applicantMail.text,
      });

      console.log(
        "[careers/apply] applicant email success:",
        applicantMailResult
      );
    } catch (mailError) {
      console.error("[careers/apply] applicant email failed:", mailError);
    }

    try {
      const adminEmails =
        process.env.CAREERS_ADMIN_EMAIL?.split(",")
          .map((email) => email.trim())
          .filter(Boolean) ?? [];

      console.log("[careers/apply] admin email targets:", adminEmails);

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

        const adminMailResult = await sendEmail({
          to: adminEmails,
          subject: adminMail.subject,
          html: adminMail.html,
          text: adminMail.text,
        });

        console.log("[careers/apply] admin email success:", adminMailResult);
      } else {
        console.log(
          "[careers/apply] admin email skipped: CAREERS_ADMIN_EMAIL not set"
        );
      }
    } catch (adminMailError) {
      console.error(
        "[careers/apply] admin notification email failed:",
        adminMailError
      );
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
    console.error("[careers/apply] public careers apply API error:", error);
    return json(false, { error: "Something went wrong" }, 500);
  }
}