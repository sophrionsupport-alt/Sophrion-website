import { NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { ok, fail } from "@/lib/utils/http";
import { RegistrationSchema } from "@/lib/validators/registration";
import { sendEmail } from "@/lib/email/send";
import {
  registrationAutoReplyEmail,
  registrationInboxEmail,
} from "@/lib/email/templates";
import { serverEnv } from "@/lib/env";

export const runtime = "nodejs";

function toFieldErrors(
  issues: ReadonlyArray<{ path: PropertyKey[]; message: string }>
) {
  const fieldErrors: Record<string, string> = {};

  for (const issue of issues) {
    const rawKey = issue.path?.[0];
    const key =
      typeof rawKey === "string" || typeof rawKey === "number"
        ? String(rawKey)
        : "form";

    if (!fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }

  return fieldErrors;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug: rawSlug } = await params;
    const slug = rawSlug?.trim();

    if (!slug) {
      return fail("Missing event slug", 400);
    }

    const raw = await request.json();

    const parsed = RegistrationSchema.safeParse(raw);

    if (!parsed.success) {
      return fail("Invalid payload", 400, toFieldErrors(parsed.error.issues));
    }

    const input = parsed.data;
    const supabase = createSupabaseAdminClient();

    const { data: event, error: eventErr } = await supabase
      .from("events")
      .select("id, slug, title")
      .eq("slug", slug)
      .maybeSingle();

    if (eventErr) {
      console.error("[event/register] event fetch failed:", eventErr);
      return fail(eventErr.message, 500);
    }

    if (!event) {
      return fail("Event not found", 404);
    }

    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const userAgent = request.headers.get("user-agent");

    const clientIp = forwardedFor?.split(",")[0]?.trim() || realIp || null;

    const insertPayload = {
      event_id: event.id,
      full_name: input.name,
      email: input.email,
      phone: input.phone,
      college: input.college,
      year: input.year || null,
      roll_number: input.roll_number ?? null,
      status: "pending",
      source: "website",
      ip: clientIp,
      user_agent: userAgent,
    };

    const { data: reg, error: regErr } = await supabase
      .from("event_registrations")
      .insert([insertPayload])
      .select("id, created_at, status")
      .single();

    if (regErr) {
      console.error("[event/register] registration insert failed:", regErr);
      return fail(regErr.message, 500);
    }

    const emailPayload = {
      ...input,
      event_id: event.id,
      event_title: event.title,
      event_slug: event.slug,
    };

    if (!serverEnv) {
      throw new Error("Server environment variables are not configured.");
    }

    try {
      const built = registrationInboxEmail(emailPayload);

      await sendEmail({
        to: serverEnv.CONTACT_INBOX,
        subject: built.subject,
        html: built.html,
        text: built.text,
      });
    } catch (mailError) {
      console.error("[event/register] inbox email failed:", mailError);
    }

    try {
      const built = registrationAutoReplyEmail(emailPayload);

      await sendEmail({
        to: input.email,
        subject: built.subject,
        html: built.html,
        text: built.text,
      });
    } catch (mailError) {
      console.error("[event/register] auto-reply email failed:", mailError);
    }

    return ok({
      event: {
        slug: event.slug,
        title: event.title,
      },
      registration: {
        id: reg.id,
        status: reg.status,
      },
      message: "Registration submitted successfully.",
    });
  } catch (e: any) {
    console.error("[event/register] unexpected error:", e);
    return fail(e?.message ?? "Unexpected error", 500);
  }
}