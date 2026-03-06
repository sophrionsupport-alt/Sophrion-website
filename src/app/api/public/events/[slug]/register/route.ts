import { NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { ok, fail } from "@/lib/utils/http";
import { RegistrationSchema } from "@/lib/validators/registration";
import { sendEmail } from "@/lib/email/send";
import { registrationAutoReplyEmail, registrationInboxEmail } from "@/lib/email/templates";
import { serverEnv } from "@/lib/env";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug: rawSlug } = await params;
    const slug = rawSlug?.trim();

    if (!slug) return fail("Missing event slug", 400);

    const raw = await request.json();

    // Validates name/email/phone/college/year/roll_number/utms etc
    const parsed = RegistrationSchema.safeParse(raw);
    if (!parsed.success) {
      return fail("Invalid payload", 400, { issues: parsed.error.issues });
    }

    const input = parsed.data;

    const supabase = createSupabaseAdminClient();

    // Look up event by slug (admin client avoids RLS surprises)
    const { data: event, error: eventErr } = await supabase
      .from("events")
      .select("id, slug, title")
      .eq("slug", slug)
      .maybeSingle();

    if (eventErr) return fail(eventErr.message, 500);
    if (!event) return fail("Event not found", 404);

    // Insert registration as PENDING (so admin can approve/reject)
    const { data: reg, error: regErr } = await supabase
      .from("event_registrations")
      .insert([
        {
          event_id: event.id,
          event_slug: event.slug,
          name: input.name,
          email: input.email,
          phone: input.phone,
          college: input.college,
          year: input.year,
          roll_number: input.roll_number ?? null,
          utm_source: input.utm_source ?? null,
          utm_medium: input.utm_medium ?? null,
          utm_campaign: input.utm_campaign ?? null,
          status: "PENDING",
        },
      ])
      .select("id, created_at, status")
      .single();

    if (regErr) return fail(regErr.message, 500);

    // Build the exact RegistrationPayload your templates expect
    const payload = {
      ...input,
      event_id: event.id,
    };
if (!serverEnv) {
  throw new Error("Server environment variables are not configured.");
}
    // Inbox email
    {
      const built = registrationInboxEmail(payload);
      await sendEmail({
        to: serverEnv.CONTACT_INBOX,
        from: serverEnv.EMAIL_FROM_CONTACT,
        subject: built.subject,
        html: built.html,
        text: built.text,
        replyTo: input.email,
      });
    }

    // Auto-reply to user
    {
      const built = registrationAutoReplyEmail(payload);
      await sendEmail({
        to: input.email,
        from: serverEnv.EMAIL_FROM_NOREPLY,
        subject: built.subject,
        html: built.html,
        text: built.text,
      });
    }

    // Stable response for frontend
    return ok({
      ok: true,
      event: { slug: event.slug, title: event.title },
      registration: { id: reg.id, status: reg.status },
    });
  } catch (e: any) {
    return fail(e?.message ?? "Unexpected error", 500);
  }
}