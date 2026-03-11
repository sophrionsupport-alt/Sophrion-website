import { cookies } from "next/headers";
import { randomBytes, scryptSync, timingSafeEqual, createHash } from "crypto";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const SCANNER_COOKIE = "sophrion_scanner_session";

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function hashSecret(value: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(value, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

function verifySecret(value: string, stored: string) {
  const [salt, key] = stored.split(":");
  if (!salt || !key) return false;

  const derived = scryptSync(value, salt, 64);
  const storedBuf = Buffer.from(key, "hex");

  if (derived.length !== storedBuf.length) return false;
  return timingSafeEqual(derived, storedBuf);
}

export async function createVolunteerAccessCodeHash(code: string) {
  return hashSecret(code);
}

export async function verifyVolunteerAccessCode(
  code: string,
  storedHash: string
) {
  return verifySecret(code, storedHash);
}

export async function createScannerSession(params: {
  accessId: string;
  eventId: string;
  maxAgeHours?: number;
}) {
  const supabase = createSupabaseAdminClient();
  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = sha256(rawToken);
  const hours = params.maxAgeHours ?? 12;
  const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();

  const { error } = await supabase.from("volunteer_scanner_sessions").insert({
    access_id: params.accessId,
    event_id: params.eventId,
    session_token_hash: tokenHash,
    expires_at: expiresAt,
  });

  if (error) {
    throw new Error(`Failed to create scanner session: ${error.message}`);
  }

  const cookieStore = await cookies();
  cookieStore.set(SCANNER_COOKIE, rawToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(expiresAt),
  });

  return { expiresAt };
}

export async function clearScannerSession() {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(SCANNER_COOKIE)?.value;

  if (rawToken) {
    const supabase = createSupabaseAdminClient();
    const tokenHash = sha256(rawToken);

    await supabase
      .from("volunteer_scanner_sessions")
      .update({ revoked_at: new Date().toISOString() })
      .eq("session_token_hash", tokenHash)
      .is("revoked_at", null);
  }

  cookieStore.delete(SCANNER_COOKIE);
}

export async function requireScannerAccess(eventId?: string | null) {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(SCANNER_COOKIE)?.value;

  if (!rawToken) {
    return {
      ok: false as const,
      status: 401,
      error: "Scanner login required.",
    };
  }

  const supabase = createSupabaseAdminClient();
  const tokenHash = sha256(rawToken);
  const now = new Date().toISOString();

  const { data: session, error } = await supabase
    .from("volunteer_scanner_sessions")
    .select(`
      id,
      access_id,
      event_id,
      expires_at,
      revoked_at,
      volunteer_scanner_access (
        id,
        full_name,
        email,
        can_scan,
        is_active,
        expires_at
      )
    `)
    .eq("session_token_hash", tokenHash)
    .is("revoked_at", null)
    .single();

  if (error || !session) {
    return {
      ok: false as const,
      status: 401,
      error: "Invalid scanner session.",
    };
  }

  const access = Array.isArray(session.volunteer_scanner_access)
    ? session.volunteer_scanner_access[0]
    : session.volunteer_scanner_access;

  if (!access) {
    return {
      ok: false as const,
      status: 401,
      error: "Scanner access record not found.",
    };
  }

  if (session.expires_at < now || access.expires_at < now) {
    return {
      ok: false as const,
      status: 401,
      error: "Scanner session expired.",
    };
  }

  if (!access.is_active || !access.can_scan) {
    return {
      ok: false as const,
      status: 403,
      error: "Scanner access is disabled.",
    };
  }

  if (eventId && session.event_id !== eventId) {
    return {
      ok: false as const,
      status: 403,
      error: "This scanner session is not allowed for this event.",
    };
  }

  await supabase
    .from("volunteer_scanner_sessions")
    .update({ last_seen_at: now })
    .eq("id", session.id);

  return {
    ok: true as const,
    actor: {
      accessId: access.id,
      eventId: session.event_id,
      name: access.full_name,
      email: access.email,
    },
  };
}