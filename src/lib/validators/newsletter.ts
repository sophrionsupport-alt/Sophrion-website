// src/lib/validators/newsletter.ts
import { z } from "zod";

export const NewsletterSchema = z.object({
  email: z.string().trim().email("Valid email is required").max(120),
  name: z
    .string()
    .trim()
    .max(80)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined)),
  source: z.string().trim().max(60).optional(), // e.g., "footer"
});

export type NewsletterPayload = z.infer<typeof NewsletterSchema>;