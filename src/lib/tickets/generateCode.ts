// src/lib/tickets/generateCode.ts

import crypto from "crypto";

export function generateTicketCode(): string {
  const random = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `SPH-${random}`;
}

export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString("hex");
}