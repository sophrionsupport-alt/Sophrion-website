import { z } from "zod";

export const JoinApplicationSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(80),
  email: z.string().trim().email("Valid email is required").max(120),
  phone: z
    .string()
    .trim()
    .max(20)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined)),
  college: z.string().trim().min(2, "College / institution is required").max(160),
  year: z.enum(["1st", "2nd", "3rd", "final", "graduate", "other"]),
  pathway: z.enum([
    "ai_systems",
    "data_intelligence",
    "creative_ai",
    "cloud_cyber",
    "smart_engineering",
    "not_sure",
  ]),
  message: z.string().trim().min(10, "Message is required").max(4000),
  source: z.string().trim().max(60).optional(),
  company: z.string().optional().or(z.literal("")),
});

export type JoinApplicationPayload = z.infer<typeof JoinApplicationSchema>;
