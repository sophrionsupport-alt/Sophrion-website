import { NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { ok, fail } from "@/lib/utils/http";
import { ContactSchema } from "@/lib/validators/contact";
import { sendEmail } from "@/lib/email/send";
import { contactAutoReplyEmail, contactInboxEmail } from "@/lib/email/templates";
import { serverEnv } from "@/lib/env";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const raw = await request.json();

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

    if (error) return fail(error.message, 500);
if (!serverEnv) {
  throw new Error("Server environment variables are not configured.");
}
    // Email to internal inbox
    {
      const built = contactInboxEmail(payload);
      await sendEmail({
        to: serverEnv.CONTACT_INBOX,
        from: serverEnv.EMAIL_FROM_CONTACT,
        subject: built.subject,
        html: built.html,
        text: built.text,
        replyTo: payload.email,
      });
    }

    // Auto-reply to user
    {
      const built = contactAutoReplyEmail(payload);
      await sendEmail({
        to: payload.email,
        from: serverEnv.EMAIL_FROM_NOREPLY,
        subject: built.subject,
        html: built.html,
        text: built.text,
      });
    }

    // Keep response structure stable
    return ok({ ok: true, id: row.id });
  } catch (e: any) {
    return fail(e?.message ?? "Unexpected error", 500);
  }
}