import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createVolunteerAccessCodeHash } from "@/lib/scanner/auth";
import { sendMail } from "@/lib/email/sendMail";
import { volunteerInviteEmail } from "@/lib/email/templates/volunteerInvite";
import { getAppConfig } from "@/lib/env";

export const runtime = "nodejs";

function ok<T>(data?: T, message?: string, status = 200) {
  return NextResponse.json({ ok: true, data, message }, { status });
}

function fail(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string; volunteerId: string }> }
) {
  try {
    const auth = await requireAdmin();

    if (!auth.ok) {
      return fail(auth.error, auth.status);
    }

    const { id: eventId, volunteerId } = await ctx.params;

    if (!eventId || !volunteerId) {
      return fail("Event id and volunteer id are required.", 400);
    }

    const body: Record<string, unknown> | null = await req
      .json()
      .catch(() => null);

    if (!body) {
      return fail("Invalid JSON body.", 400);
    }

    const supabase = createSupabaseAdminClient();

    const { data: existingVolunteer, error: existingError } = await supabase
      .from("volunteer_scanner_access")
      .select(
        `
        id,
        event_id,
        full_name,
        email,
        can_scan,
        is_active,
        expires_at,
        created_at,
        updated_at
        `
      )
      .eq("id", volunteerId)
      .eq("event_id", eventId)
      .single();

    if (existingError || !existingVolunteer) {
      return fail(existingError?.message || "Volunteer not found.", 404);
    }

    const { data: eventRow, error: eventError } = await supabase
      .from("events")
      .select("id, title")
      .eq("id", eventId)
      .single();

    if (eventError || !eventRow) {
      return fail("Event not found.", 404);
    }

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (typeof body.is_active === "boolean") {
      updates.is_active = body.is_active;
    }

    if (typeof body.can_scan === "boolean") {
      updates.can_scan = body.can_scan;
    }

    if (typeof body.expires_at === "string" && body.expires_at.trim()) {
      updates.expires_at = body.expires_at.trim();
    }

    const nextIsActive =
      typeof updates.is_active === "boolean"
        ? (updates.is_active as boolean)
        : existingVolunteer.is_active;

    const nextCanScan =
      typeof updates.can_scan === "boolean"
        ? (updates.can_scan as boolean)
        : existingVolunteer.can_scan;

    const nextExpiresAt =
      typeof updates.expires_at === "string"
        ? (updates.expires_at as string)
        : existingVolunteer.expires_at;

    const isReEnable =
      existingVolunteer.is_active === false && nextIsActive === true;

    let newTempCode: string | null = null;
    let emailWarning: string | null = null;

    if (isReEnable) {
      newTempCode = randomBytes(4).toString("hex").toUpperCase();
      const newCodeHash = await createVolunteerAccessCodeHash(newTempCode);
      updates.access_code_hash = newCodeHash;

      if (typeof updates.can_scan !== "boolean") {
        updates.can_scan = true;
      }
    }

    const { data, error } = await supabase
      .from("volunteer_scanner_access")
      .update(updates)
      .eq("id", volunteerId)
      .eq("event_id", eventId)
      .select(
        `
        id,
        event_id,
        full_name,
        email,
        can_scan,
        is_active,
        expires_at,
        created_at,
        updated_at
        `
      )
      .single();

    if (error || !data) {
      return fail(error?.message || "Volunteer not found.", 404);
    }

    const now = new Date().toISOString();

    if (isReEnable) {
      await supabase
        .from("volunteer_scanner_sessions")
        .update({
          revoked_at: now,
        })
        .eq("access_id", volunteerId)
        .is("revoked_at", null);

      try {
        const appConfig = getAppConfig();
        const accessUrl = `${appConfig.canonicalDomain}/volunteer/login`;
        const eventTitle = eventRow.title || "Sophrion Event";

        const emailContent = volunteerInviteEmail({
          name: data.full_name || "Volunteer",
          eventTitle,
          eventId,
          volunteerId: data.id,
          tempCode: newTempCode!,
          accessUrl,
          expiresAt: nextExpiresAt || "",
        });

        await sendMail({
          to: [{ address: data.email, name: data.full_name || undefined }],
          subject: emailContent.subject,
          html: emailContent.html,
        });
      } catch (mailError) {
        console.error("Volunteer re-enable email failed", mailError);
        emailWarning =
          mailError instanceof Error
            ? mailError.message
            : "Volunteer re-enabled but email sending failed.";
      }
    }

    return ok(
      {
        volunteer: data,
        newTempCode,
        emailSent: isReEnable ? !emailWarning : null,
        emailWarning,
        reissuedAccessCode: isReEnable,
        effectiveState: {
          is_active: nextIsActive,
          can_scan: nextCanScan,
          expires_at: nextExpiresAt,
        },
      },
      isReEnable
        ? emailWarning
          ? "Volunteer re-enabled with new temporary access code, but email could not be sent."
          : "Volunteer re-enabled and new temporary access code sent."
        : "Volunteer updated."
    );
  } catch (error) {
    console.error("PATCH volunteer failed", error);
    return fail("Internal server error.", 500);
  }
}

export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string; volunteerId: string }> }
) {
  try {
    const auth = await requireAdmin();

    if (!auth.ok) {
      return fail(auth.error, auth.status);
    }

    const { id: eventId, volunteerId } = await ctx.params;

    if (!eventId || !volunteerId) {
      return fail("Event id and volunteer id are required.", 400);
    }

    const supabase = createSupabaseAdminClient();

    const now = new Date().toISOString();

    const { error } = await supabase
      .from("volunteer_scanner_access")
      .update({
        is_active: false,
        can_scan: false,
        updated_at: now,
      })
      .eq("id", volunteerId)
      .eq("event_id", eventId);

    if (error) {
      return fail(error.message, 500);
    }

    await supabase
      .from("volunteer_scanner_sessions")
      .update({
        revoked_at: now,
      })
      .eq("access_id", volunteerId)
      .is("revoked_at", null);

    return ok(null, "Volunteer access revoked.");
  } catch (error) {
    console.error("DELETE volunteer failed", error);
    return fail("Internal server error.", 500);
  }
}