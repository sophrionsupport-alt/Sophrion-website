import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  CAREER_TEAMS,
  CAREER_EMPLOYMENT_TYPES,
  CAREER_WORK_MODES,
} from "@/types/careers";

export const runtime = "nodejs";

function json(
  ok: boolean,
  init?: { data?: unknown; error?: string; message?: string },
  status = 200
) {
  return NextResponse.json({ ok, ...init }, { status });
}

const CareerRoleInsertSchema = z.object({
  title: z.string().trim().min(2).max(200),
  slug: z.string().trim().min(2).max(200),
  team: z.enum(CAREER_TEAMS),
  location: z.string().trim().max(200).optional().or(z.literal("")),
  employment_type: z.enum(CAREER_EMPLOYMENT_TYPES),
  mode: z.enum(CAREER_WORK_MODES),
  short_description: z.string().trim().min(10).max(2000),
  description: z.string().trim().max(20000).optional().or(z.literal("")),
  responsibilities: z.array(z.string().trim().min(1)).min(1),
  requirements: z.array(z.string().trim().min(1)).min(1),
  nice_to_have: z.array(z.string().trim()).default([]),
  min_compensation: z.number().nonnegative().nullable().optional(),
  max_compensation: z.number().nonnegative().nullable().optional(),
  compensation_currency: z.string().trim().max(8).optional().or(z.literal("")),
  is_open: z.boolean(),
  is_published: z.boolean(),
  sort_order: z.number().int().min(0).max(1_000_000),
});

export async function POST(req: Request) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) {
      return json(false, { error: auth.error }, auth.status);
    }

    const raw = await req.json().catch(() => null);
    const parsed = CareerRoleInsertSchema.safeParse(raw);

    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message || "Invalid payload";
      return json(false, { error: msg }, 400);
    }

    const p = parsed.data;
    const supabase = createSupabaseAdminClient();

    const insert = {
      title: p.title,
      slug: p.slug,
      team: p.team,
      location: p.location?.trim() ? p.location.trim() : null,
      employment_type: p.employment_type,
      mode: p.mode,
      short_description: p.short_description,
      description: p.description?.trim() ? p.description.trim() : null,
      responsibilities: p.responsibilities,
      requirements: p.requirements,
      nice_to_have: p.nice_to_have ?? [],
      min_compensation: p.min_compensation ?? null,
      max_compensation: p.max_compensation ?? null,
      compensation_currency: p.compensation_currency?.trim()
        ? p.compensation_currency.trim()
        : null,
      is_open: p.is_open,
      is_published: p.is_published,
      sort_order: p.sort_order,
    };

    const { data, error } = await supabase
      .from("career_roles")
      .insert(insert)
      .select("id, title, slug, is_published")
      .single();

    if (error || !data) {
      console.error("[admin/careers] insert failed", error);
      return json(false, { error: error?.message || "Failed to create role" }, 500);
    }

    return json(true, { data, message: "Career role created" }, 201);
  } catch (e) {
    console.error("[admin/careers] POST", e);
    return json(false, { error: "Something went wrong" }, 500);
  }
}
