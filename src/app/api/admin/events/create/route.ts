import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { slugify } from "@/lib/utils/slugify";

export const runtime = "nodejs";

function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

export async function POST(req: Request) {
  const auth = await requireAdmin();

  if (!auth.ok) {
    return NextResponse.json(
      { ok: false, error: auth.error },
      { status: auth.status }
    );
  }

  try {
    const body = await req.json();
    const supabase = supabaseAdmin();

    const title = String(body.title ?? "").trim();
    if (!title) {
      return NextResponse.json(
        { ok: false, error: "Title is required" },
        { status: 400 }
      );
    }

    const baseSlug = slugify(body.slug || title);
    const slug = `${baseSlug}-${Date.now()}`;
    if (!slug) {
      return NextResponse.json(
        { ok: false, error: "Unable to generate slug" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("events")
      .insert([
        {
          title,
          slug,
          subtitle: body.subtitle ?? null,
          description: body.description ?? null,
          start_at: body.start_at ?? null,
          end_at: body.end_at ?? null,
          mode: body.mode ?? null,
          venue: body.venue ?? null,
          city: body.city ?? null,
          state: body.state ?? null,
          is_published: body.is_published ?? false,
          registration_open: body.registration_open ?? true,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}