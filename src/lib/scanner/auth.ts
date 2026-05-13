import { cookies } from "next/headers";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { verifyVolunteerSession } from "@/lib/scanner/sessionToken";

export async function requireScannerAccess(eventId: string) {
  const jar = await cookies();
  const raw = jar.get("sph_vol_scan")?.value;

  if (!raw) {
    return {
      ok: false as const,
      status: 401,
      error: "Scanner session required. Sign in on the volunteer page.",
    };
  }

  const session = verifyVolunteerSession(raw);

  if (!session || session.exp < Date.now()) {
    return {
      ok: false as const,
      status: 401,
      error: "Scanner session expired. Please sign in again.",
    };
  }

  if (session.eventId !== eventId) {
    return {
      ok: false as const,
      status: 403,
      error: "Scanner session is not authorized for this event.",
    };
  }

  const supabase = createSupabaseAdminClient();
  const { data: row, error } = await supabase
    .from("volunteer_scanner_access")
    .select("id, is_active, can_scan, expires_at")
    .eq("id", session.accessId)
    .eq("event_id", eventId)
    .maybeSingle();

  if (error || !row) {
    return {
      ok: false as const,
      status: 403,
      error: "Volunteer access record not found.",
    };
  }

  const expiresAt = new Date(String((row as { expires_at: string }).expires_at)).getTime();
  if (Number.isFinite(expiresAt) && expiresAt < Date.now()) {
    return {
      ok: false as const,
      status: 403,
      error: "Volunteer access has expired.",
    };
  }

  if (!(row as { is_active: boolean }).is_active || !(row as { can_scan: boolean }).can_scan) {
    return {
      ok: false as const,
      status: 403,
      error: "Volunteer scanning is disabled for this account.",
    };
  }

  return {
    ok: true as const,
    status: 200,
    actor: { accessId: session.accessId },
  };
}
