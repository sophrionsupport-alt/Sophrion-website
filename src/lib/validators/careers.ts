import { z } from "zod";

function optionalText(max: number) {
  return z
    .string()
    .max(max)
    .optional()
    .or(z.literal(""))
    .transform((v) => {
      if (v === undefined || v === null) return undefined;
      const t = v.trim();
      return t.length ? t : undefined;
    });
}

export const CareerApplySchema = z.object({
  role_id: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : v),
    z.string().uuid("Invalid role").optional()
  ),
  role_title_snapshot: optionalText(200),
  full_name: z.string().trim().min(2, "Name is required").max(120),
  email: z.string().trim().email("Valid email is required").max(120),
  phone: optionalText(40),
  college: optionalText(200),
  degree: optionalText(120),
  graduation_year: optionalText(20),
  linkedin_url: optionalText(500),
  portfolio_url: optionalText(500),
  why_join: z.string().trim().min(10, "Tell us why you want to join").max(4000),
  cover_letter: optionalText(8000),
  source: optionalText(80),
});

export type CareerApplyInput = z.infer<typeof CareerApplySchema>;
