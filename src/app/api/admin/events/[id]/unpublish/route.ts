// src/app/api/admin/events/[id]/unpublish/route.ts
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export const runtime = "nodejs";

function json(
  ok: boolean,
  init?: { data?: unknown; error?: string; message?: string },
  status = 200
) {
  return NextResponse.json({ ok, ...init }, { status });
}

export async function POST(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();

  if (!auth.ok) {
    return json(false, { error: auth.error }, auth.status);
  }

  const { id } = await ctx.params;

  if (!id) {
    return json(false, { error: "Event id is required." }, 400);
  }

  const { data, error } = await auth.supabase
    .from("events")
    .update({
      is_published: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    const httpStatus = error.code === "PGRST116" ? 404 : 500;

    return json(
      false,
      {
        error: error.code === "PGRST116" ? "Event not found." : error.message,
      },
      httpStatus
    );
  }

  return json(true, { data, message: "Event unpublished successfully." });
}