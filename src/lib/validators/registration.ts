// src/lib/validators/registration.ts
import { z } from "zod";

/**
 * Public event/workshop registration payload shape.
 * If you later split events vs workshops, keep this as a shared base.
 */
export const RegistrationSchema = z.object({
  // Who
  name: z.string().trim().min(2, "Name is required").max(80),
  email: z.string().trim().email("Valid email is required").max(120),
  phone: z.string().trim().min(7).max(20),

  // Academic
  college: z.string().trim().min(2, "College is required").max(160),
  year: z
    .string()
    .trim()
    .min(1, "Year is required")
    .max(20), // keep flexible: "3rd", "Final", "2026", etc.
  roll_number: z
    .string()
    .trim()
    .max(60)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined)),

  // What they register for
  event_id: z.string().trim().min(1, "event_id is required").max(80),

  // Optional tracking
  utm_source: z.string().trim().max(100).optional(),
  utm_medium: z.string().trim().max(100).optional(),
  utm_campaign: z.string().trim().max(100).optional(),
});

export type RegistrationPayload = z.infer<typeof RegistrationSchema>;