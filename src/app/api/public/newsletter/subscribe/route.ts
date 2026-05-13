import { NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { ok, fail } from "@/lib/utils/http";
import { NewsletterSchema } from "@/lib/validators/newsletter";
import { sendEmail } from "@/lib/email/send";
import { newsletterWelcomeEmail } from "@/lib/email/templates";
import { serverEnv } from "@/lib/env";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const raw = await request.json();

    const parsed = NewsletterSchema.safeParse(raw);
    if (!parsed.success) {
      return fail("Invalid payload", 400, { issues: parsed.error.issues });
    }

    const payload = parsed.data;

    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .upsert(
        [
          {
            email: payload.email,
            name: payload.name ?? null,
            source: payload.source ?? "website",
            status: "active",
            unsubscribed_at: null,
          },
        ],
        { onConflict: "email" }
      )
      .select("email, status, created_at")
      .single();

    if (error) return fail(error.message, 500);

    if (!serverEnv) {
      throw new Error("Server environment variables are not configured.");
    }

    try {
      const built = newsletterWelcomeEmail(payload);

      await sendEmail({
        to: payload.email,
        subject: built.subject,
        html: built.html,
        text: built.text,
      });
    } catch (mailError) {
      console.error("[newsletter] welcome email failed:", mailError);
    }

    return ok({
      ok: true,
      email: data.email,
      status: data.status,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unexpected error";
    return fail(msg, 500);
  }
}