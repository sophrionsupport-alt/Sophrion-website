import crypto from "crypto";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hashVolunteerAccessCode } from "@/lib/scanner/volunteerCode";

type VolunteerRow = {
  id: string;
  event_id: string;
  full_name: string;
  email: string;
  can_scan: boolean;
  is_active: boolean;
  expires_at: string;
  created_at: string;
  updated_at: string;
};

function randomTempCode() {
  return crypto.randomBytes(5).toString("hex").toUpperCase();
}

export async function createVolunteerAccess(input: {
  eventId: string;
  fullName: string;
  email: string;
  expiresAt: string;
}) {
  const supabase = createSupabaseAdminClient();
  const tempCode = randomTempCode();
  const access_code_hash = hashVolunteerAccessCode(tempCode);

  const { data, error } = await supabase
    .from("volunteer_scanner_access")
    .insert({
      event_id: input.eventId,
      full_name: input.fullName,
      email: input.email.trim().toLowerCase(),
      can_scan: true,
      is_active: true,
      expires_at: input.expiresAt,
      access_code_hash,
    })
    .select(
      "id, event_id, full_name, email, can_scan, is_active, expires_at, created_at, updated_at"
    )
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Failed to create volunteer access.");
  }

  return {
    volunteer: data as VolunteerRow,
    tempCode,
  };
}
