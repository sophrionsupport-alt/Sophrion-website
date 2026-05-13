// src/lib/validators/registration.ts
import { z } from "zod";

export const RegistrationSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(80),
  email: z.string().trim().email("Valid email is required").max(120),
  phone: z.string().trim().min(7, "Phone is required").max(20),
  college: z.string().trim().min(2, "College is required").max(160),
  year: z.string().trim().min(1, "Year is required").max(40),
  roll_number: z
    .string()
    .trim()
    .max(40)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined)),
  utm_source: z
    .string()
    .trim()
    .max(80)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined)),
  utm_medium: z
    .string()
    .trim()
    .max(80)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined)),
  utm_campaign: z
    .string()
    .trim()
    .max(80)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined)),
});

export type RegistrationPayload = z.infer<typeof RegistrationSchema> & {
  event_id?: string;
  event_title?: string | null;
  event_slug?: string | null;
  event_name?: string;
};
