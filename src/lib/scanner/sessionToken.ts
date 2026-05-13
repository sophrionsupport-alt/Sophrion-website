import crypto from "crypto";

function sessionSecret() {
  const s =
    process.env.VOLUNTEER_SESSION_SECRET?.trim() ||
    process.env.TICKET_TOKEN_SECRET?.trim();
  if (!s) {
    throw new Error("Missing VOLUNTEER_SESSION_SECRET or TICKET_TOKEN_SECRET");
  }
  return s;
}

export type VolunteerSessionPayload = {
  accessId: string;
  eventId: string;
  exp: number;
};

export function signVolunteerSession(payload: VolunteerSessionPayload) {
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const sig = crypto
    .createHmac("sha256", sessionSecret())
    .update(body)
    .digest("base64url");
  return `${body}.${sig}`;
}

export function verifyVolunteerSession(token: string): VolunteerSessionPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [body, sig] = parts;
    if (!body || !sig) return null;
    const expected = crypto
      .createHmac("sha256", sessionSecret())
      .update(body)
      .digest("base64url");
    const a = Buffer.from(expected, "utf8");
    const b = Buffer.from(sig, "utf8");
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
    const parsed = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as VolunteerSessionPayload;
    if (
      !parsed ||
      typeof parsed.accessId !== "string" ||
      typeof parsed.eventId !== "string" ||
      typeof parsed.exp !== "number"
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}
