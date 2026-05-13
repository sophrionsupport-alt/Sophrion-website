import { z } from "zod";

export const INQUIRY_TYPES = [
  "student",
  "institutional",
  "innovation",
  "mentor",
  "industry",
  "other",
] as const;

export type InquiryType = (typeof INQUIRY_TYPES)[number];

export const InquirySchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(80),
  email: z.string().trim().email("Valid email is required").max(120),
  phone: z
    .string()
    .trim()
    .max(20)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined)),
  organization: z
    .string()
    .trim()
    .max(160)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined)),
  inquiryType: z.enum(INQUIRY_TYPES),
  message: z.string().trim().min(10, "Message is required").max(4000),
  source: z.string().trim().max(80).optional(),
  company: z.string().optional().or(z.literal("")),
});

export type InquiryPayload = z.infer<typeof InquirySchema>;
