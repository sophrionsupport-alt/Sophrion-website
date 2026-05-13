import { NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { ok, fail } from "@/lib/utils/http";
import { ContactSchema } from "@/lib/validators/contact";
import { InquirySchema, type InquiryPayload } from "@/lib/validators/inquiry";
import { sendEmail } from "@/lib/email/send";
import {
  contactAutoReplyEmail,
  contactInboxEmail,
} from "@/lib/email/templates";
import type { ContactPayload } from "@/lib/validators/contact";
import { serverEnv } from "@/lib/env";

export const runtime = "nodejs";

const INQUIRY_LABEL: Record<InquiryPayload["inquiryType"], string> = {
  student: "Student Inquiry",
  institutional: "Institutional Partnership",
  innovation: "Innovation Collaboration",
  mentor: "Mentor Collaboration",
  industry: "Industry / Recruiter Inquiry",
  other: "Other",
};

function inquiryToContactPayload(p: InquiryPayload): ContactPayload {
  const label = INQUIRY_LABEL[p.inquiryType];
  const message =
    (p.organization
      ? `Organization / Institution: ${p.organization}\n\n`
      : "") + p.message;

  return {
    name: p.name,
    email: p.email,
    phone: p.phone,
    subject: `${label}`,
    message,
    source: p.source ?? "inquiry_form",
  };
}

export async function POST(request: NextRequest) {
  try {
    const raw = await request.json();

    if (raw && typeof raw === "object" && "inquiryType" in raw && raw.inquiryType) {
      const parsed = InquirySchema.safeParse(raw);
      if (!parsed.success) {
        return fail("Invalid payload", 400, { issues: parsed.error.issues });
      }

      const p = parsed.data;
      if (p.company && p.company.trim().length > 0) {
        return ok({ ok: true, id: "honeypot" });
      }

      const payload = inquiryToContactPayload(p);
      const supabase = createSupabaseAdminClient();

      const { data: row, error } = await supabase
        .from("contact_messages")
        .insert([
          {
            name: payload.name,
            email: payload.email,
            phone: payload.phone ?? null,
            subject: payload.subject ?? null,
            message: payload.message,
            source: payload.source ?? "website",
          },
        ])
        .select("id, created_at")
        .single();

      if (error) {
        return fail(error.message, 500);
      }

      if (!serverEnv) {
        throw new Error("Server environment variables are not configured.");
      }

      try {
        const built = contactInboxEmail(payload);
        await sendEmail({
          to: serverEnv.CONTACT_INBOX,
          subject: built.subject,
          html: built.html,
          text: built.text,
        });
      } catch (mailError) {
        console.error("[contact] inbox email failed:", mailError);
      }

      try {
        const built = contactAutoReplyEmail(payload);
        await sendEmail({
          to: payload.email,
          subject: built.subject,
          html: built.html,
          text: built.text,
        });
      } catch (mailError) {
        console.error("[contact] auto-reply email failed:", mailError);
      }

      return ok({ ok: true, id: row.id });
    }

    const parsed = ContactSchema.safeParse(raw);
    if (!parsed.success) {
      return fail("Invalid payload", 400, { issues: parsed.error.issues });
    }

    const payload = parsed.data;

    const supabase = createSupabaseAdminClient();

    const { data: row, error } = await supabase
      .from("contact_messages")
      .insert([
        {
          name: payload.name,
          email: payload.email,
          phone: payload.phone ?? null,
          subject: payload.subject ?? null,
          message: payload.message,
          source: payload.source ?? "website",
        },
      ])
      .select("id, created_at")
      .single();

    if (error) {
      return fail(error.message, 500);
    }

    if (!serverEnv) {
      throw new Error("Server environment variables are not configured.");
    }

    try {
      const built = contactInboxEmail(payload);

      await sendEmail({
        to: serverEnv.CONTACT_INBOX,
        subject: built.subject,
        html: built.html,
        text: built.text,
      });
    } catch (mailError) {
      console.error("[contact] inbox email failed:", mailError);
    }

    try {
      const built = contactAutoReplyEmail(payload);

      await sendEmail({
        to: payload.email,
        subject: built.subject,
        html: built.html,
        text: built.text,
      });
    } catch (mailError) {
      console.error("[contact] auto-reply email failed:", mailError);
    }

    return ok({ ok: true, id: row.id });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unexpected error";
    return fail(msg, 500);
  }
}
