import { z } from "zod";

export const CollegeEventPublishRequestSchema = z.object({
  college_name: z.string().trim().min(2, "College name is required").max(140),
  contact_name: z.string().trim().min(2, "Contact person name is required").max(120),
  email: z.string().trim().email("Valid email is required").max(120),
  phone: z.string().trim().min(8).max(20).optional().or(z.literal("")).transform(v => (v ? v : undefined)),
  city: z.string().trim().max(80).optional().or(z.literal("")).transform(v => (v ? v : undefined)),
  state: z.string().trim().max(80).optional().or(z.literal("")).transform(v => (v ? v : undefined)),
  website: z.string().trim().max(200).optional().or(z.literal("")).transform(v => (v ? v : undefined)),
  message: z.string().trim().min(10, "Please add a short message").max(2000),
});

export type CollegeEventPublishRequestPayload = z.infer<typeof CollegeEventPublishRequestSchema>;