// src/lib/tickets/token.ts

import crypto from "crypto";
import type { TicketTokenPayload, VerifiedTokenResult } from "@/lib/tickets/types";

function getSecret() {
  const secret = process.env.TICKET_TOKEN_SECRET;
  if (!secret) {
    throw new Error("Missing TICKET_TOKEN_SECRET");
  }
  return secret;
}

function base64UrlEncode(input: string | Buffer) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function sign(value: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(value).digest();
}

export function createTicketToken(payload: TicketTokenPayload) {
  const secret = getSecret();

  const rawPayload = JSON.stringify(payload);
  const encodedPayload = base64UrlEncode(rawPayload);

  const signature = sign(encodedPayload, secret);
  const encodedSignature = base64UrlEncode(signature);

  return `${encodedPayload}.${encodedSignature}`;
}

function base64UrlDecodeToString(input: string) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = (4 - (normalized.length % 4)) % 4;
  const padded = normalized + "=".repeat(pad);
  return Buffer.from(padded, "base64").toString("utf8");
}

export function verifyTicketToken(token: string): VerifiedTokenResult {
  const secret = getSecret();
  const parts = token.split(".");
  if (parts.length !== 2) {
    return { ok: false, error: "invalid_format" };
  }

  const [encodedPayload, encodedSignature] = parts;
  if (!encodedPayload || !encodedSignature) {
    return { ok: false, error: "invalid_format" };
  }

  let expectedSig: Buffer;
  try {
    expectedSig = sign(encodedPayload, secret);
  } catch {
    return { ok: false, error: "signature_failed" };
  }

  let providedSig: Buffer;
  try {
    const normalized = encodedSignature.replace(/-/g, "+").replace(/_/g, "/");
    const pad = (4 - (normalized.length % 4)) % 4;
    providedSig = Buffer.from(normalized + "=".repeat(pad), "base64");
  } catch {
    return { ok: false, error: "invalid_format" };
  }

  if (
    expectedSig.length !== providedSig.length ||
    !crypto.timingSafeEqual(expectedSig, providedSig)
  ) {
    return { ok: false, error: "signature_failed" };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(base64UrlDecodeToString(encodedPayload));
  } catch {
    return { ok: false, error: "invalid_payload" };
  }

  if (
    !parsed ||
    typeof parsed !== "object" ||
    typeof (parsed as TicketTokenPayload).ticketId !== "string" ||
    typeof (parsed as TicketTokenPayload).eventId !== "string" ||
    typeof (parsed as TicketTokenPayload).registrationId !== "string" ||
    ((parsed as TicketTokenPayload).registrationKind !== "individual" &&
      (parsed as TicketTokenPayload).registrationKind !== "team")
  ) {
    return { ok: false, error: "invalid_payload" };
  }

  return { ok: true, payload: parsed as TicketTokenPayload };
}