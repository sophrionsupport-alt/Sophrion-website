// src/lib/tickets/token.ts

import crypto from "crypto";
import type { TicketTokenPayload } from "@/lib/tickets/types";

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