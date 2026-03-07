// src/lib/validators/career.ts
import { z } from "zod";
import {
  CAREER_APPLICATION_STATUSES,
  CAREER_EMPLOYMENT_TYPES,
  CAREER_TEAMS,
  CAREER_WORK_MODES,
} from "@/types/careers";

const optionalTrimmedString = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(""))
    .transform((v) => {
      if (!v) return undefined;
      const trimmed = v.trim();
      return trimmed.length ? trimmed : undefined;
    });

const optionalUrl = z
  .string()
  .trim()
  .url("Enter a valid URL")
  .optional()
  .or(z.literal(""))
  .transform((v) => {
    if (!v) return undefined;
    const trimmed = v.trim();
    return trimmed.length ? trimmed : undefined;
  });

const stringArrayField = z
  .array(z.string().trim().min(1, "List item cannot be empty").max(300))
  .default([])
  .transform((items) => items.map((item) => item.trim()).filter(Boolean));

export const CareerRoleSchema = z
  .object({
    title: z.string().trim().min(2, "Title is required").max(120),
    slug: z
      .string()
      .trim()
      .min(2, "Slug is required")
      .max(160)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase slug format"),

    team: z.enum(CAREER_TEAMS, {
      error: "Select a valid team",
    }),

    location: z.string().trim().max(120).optional().default(""),

    employment_type: z.enum(CAREER_EMPLOYMENT_TYPES, {
      error: "Select a valid employment type",
    }),

    mode: z.enum(CAREER_WORK_MODES, {
      error: "Select a valid work mode",
    }),

    short_description: z
      .string()
      .trim()
      .min(12, "Short description is required")
      .max(240, "Keep short description under 240 characters"),

    description: z.string().trim().max(5000).optional().default(""),

    responsibilities: stringArrayField,
    requirements: stringArrayField,
    nice_to_have: stringArrayField,

    min_compensation: z.coerce.number().min(0).nullable().optional(),
    max_compensation: z.coerce.number().min(0).nullable().optional(),
    compensation_currency: z.string().trim().max(12).optional().default("INR"),

    is_open: z.coerce.boolean().default(true),
    is_published: z.coerce.boolean().default(false),
    sort_order: z.coerce.number().int().min(0).default(0),
  })
  .superRefine((data, ctx) => {
    if (
      data.min_compensation != null &&
      data.max_compensation != null &&
      data.min_compensation > data.max_compensation
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["max_compensation"],
        message: "Max compensation must be greater than or equal to min compensation",
      });
    }
  })
  .transform((data) => ({
    ...data,
    location: data.location.trim() || undefined,
    description: data.description.trim() || undefined,
    compensation_currency: data.compensation_currency.trim() || "INR",
    min_compensation:
      data.min_compensation == null || Number.isNaN(data.min_compensation)
        ? null
        : data.min_compensation,
    max_compensation:
      data.max_compensation == null || Number.isNaN(data.max_compensation)
        ? null
        : data.max_compensation,
  }));

export const CareerApplySchema = z.object({
  role_id: z
    .string()
    .uuid("Invalid role id")
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined)),

  role_title_snapshot: optionalTrimmedString(160),
  full_name: z.string().trim().min(2, "Full name is required").max(120),
  email: z.string().trim().email("Valid email is required").max(160),
  phone: optionalTrimmedString(30),
  college: optionalTrimmedString(160),
  degree: optionalTrimmedString(120),
  graduation_year: optionalTrimmedString(20),
  linkedin_url: optionalUrl,
  portfolio_url: optionalUrl,
  why_join: z
    .string()
    .trim()
    .min(20, "Please tell us why you want to join")
    .max(2000),
  cover_letter: optionalTrimmedString(4000),
  source: z.string().trim().max(60).optional().default("careers_site"),
});

export const CareerApplicationStatusSchema = z.object({
  status: z.enum(CAREER_APPLICATION_STATUSES, {
    error: "Select a valid application status",
  }),
});

export type CareerRoleInput = z.infer<typeof CareerRoleSchema>;
export type CareerApplyInput = z.infer<typeof CareerApplySchema>;
export type CareerApplicationStatusInput = z.infer<
  typeof CareerApplicationStatusSchema
>;