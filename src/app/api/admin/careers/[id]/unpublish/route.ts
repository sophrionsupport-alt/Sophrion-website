// src/app/api/admin/careers/[id]/unpublish/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export const runtime = "nodejs";

function json(
  ok: boolean,
  init?: { data?: unknown; error?: string; message?: string },
  status = 200
) {
  return NextResponse.json({ ok, ...init }, { status });
}

function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

type Ctx = {
  params: Promise<{ id: string }>;
};

export async function POST(_: Request, { params }: Ctx) {
  try {
    const guard = await requireAdmin();
    if (guard instanceof NextResponse) return guard;

    const { id } = await params;
    const supabase = supabaseAdmin();

    const { data, error } = await supabase
      .from("career_roles")
      .update({ is_published: false })
      .eq("id", id)
      .select("id, title, is_published")
      .single();

    if (error) {
      console.error("Unpublish role failed:", error);
      return json(false, { error: "Failed to unpublish role" }, 500);
    }

    return json(true, { data, message: "Role unpublished" });
  } catch (error) {
    console.error("Unpublish role error:", error);
    return json(false, { error: "Something went wrong" }, 500);
  }
}