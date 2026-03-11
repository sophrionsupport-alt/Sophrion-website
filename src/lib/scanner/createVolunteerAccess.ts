import { randomBytes } from "crypto";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createVolunteerAccessCodeHash } from "@/lib/scanner/auth";

type CreateVolunteerAccessInput = {
  eventId: string;
  fullName: string;
  email: string;
  expiresAt: string;
};

export async function createVolunteerAccess(
  input: CreateVolunteerAccessInput
) {
  const supabase = createSupabaseAdminClient();

  const email = input.email.trim().toLowerCase();
  const fullName = input.fullName.trim();

  if (!email) {
    throw new Error("Volunteer email is required.");
  }

  if (!fullName) {
    throw new Error("Volunteer name is required.");
  }

  if (!input.eventId) {
    throw new Error("Event id is required.");
  }

  if (!input.expiresAt) {
    throw new Error("Expiry is required.");
  }

  const rawCode = randomBytes(4).toString("hex").toUpperCase();
  const codeHash = await createVolunteerAccessCodeHash(rawCode);

  const { data, error } = await supabase
    .from("volunteer_scanner_access")
    .insert({
      event_id: input.eventId,
      full_name: fullName,
      email,
      access_code_hash: codeHash,
      can_scan: true,
      is_active: true,
      expires_at: input.expiresAt,
      updated_at: new Date().toISOString(),
    })
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
    throw new Error(
      error?.message || "Failed to create volunteer scanner access."
    );
  }

  return {
    volunteer: data,
    tempCode: rawCode,
  };
}