// src/lib/tickets/verifyToken.ts

import crypto from "crypto";
import type { TicketTokenPayload, VerifiedTokenResult } from "@/lib/tickets/types";

function getSecret() {
  const secret = process.env.TICKET_TOKEN_SECRET;
  if (!secret) {
    throw new Error("Missing TICKET_TOKEN_SECRET");
  }
  return secret;
}

function base64UrlDecode(input: string) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padLength = (4 - (normalized.length % 4)) % 4;
  const padded = normalized + "=".repeat(padLength);
  return Buffer.from(padded, "base64");
}

function isValidPayload(value: unknown): value is TicketTokenPayload {
  if (!value || typeof value !== "object") return false;

  const v = value as Record<string, unknown>;

  return (
    typeof v.ticketId === "string" &&
    typeof v.registrationId === "string" &&
    (v.registrationKind === "individual" || v.registrationKind === "team") &&
    typeof v.eventId === "string" &&
    typeof v.version === "number" &&
    typeof v.timestamp === "number" &&
    typeof v.nonce === "string"
  );
}

export function verifyTicketToken(token: string): VerifiedTokenResult {
  try {
    const secret = getSecret();

    if (!token || typeof token !== "string" || !token.includes(".")) {
      return { ok: false, error: "invalid_format" };
    }

    const parts = token.split(".");
    if (parts.length !== 2) {
      return { ok: false, error: "invalid_format" };
    }

    const [encodedPayload, encodedSignature] = parts;

    if (!encodedPayload || !encodedSignature) {
      return { ok: false, error: "invalid_format" };
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(encodedPayload)
      .digest();

    const actualSignature = base64UrlDecode(encodedSignature);

    if (
      expectedSignature.length !== actualSignature.length ||
      !crypto.timingSafeEqual(expectedSignature, actualSignature)
    ) {
      return { ok: false, error: "signature_failed" };
    }

    const rawPayload = base64UrlDecode(encodedPayload).toString("utf8");

    let parsed: unknown;

    try {
      parsed = JSON.parse(rawPayload);
    } catch {
      return { ok: false, error: "invalid_payload" };
    }

    if (!isValidPayload(parsed)) {
      return { ok: false, error: "invalid_payload" };
    }

    return {
      ok: true,
      payload: parsed,
    };
  } catch {
    return { ok: false, error: "invalid_payload" };
  }
}