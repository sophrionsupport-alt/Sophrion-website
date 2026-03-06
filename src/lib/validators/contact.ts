// src/lib/validators/contact.ts
import { z } from "zod";

export const ContactSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(80, "Name is too long"),
  email: z.string().trim().email("Valid email is required").max(120),
  phone: z
    .string()
    .trim()
    .min(7, "Phone looks too short")
    .max(20, "Phone is too long")
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined)),
  subject: z.string().trim().min(3, "Subject is required").max(120),
  message: z.string().trim().min(10, "Message is required").max(4000),
  source: z.string().trim().max(60).optional(), // e.g., "contact-page"
});

export type ContactPayload = z.infer<typeof ContactSchema>;