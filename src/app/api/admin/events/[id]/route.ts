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

type EventUpdateBody = {
  title?: unknown;
  subtitle?: unknown;
  description?: unknown;
  mode?: unknown;
  venue?: unknown;
  city?: unknown;
  state?: unknown;
  start_at?: unknown;
  end_at?: unknown;
  banner_url?: unknown;
  slug?: unknown;
  is_published?: unknown;
  registration_open?: unknown;
};

export async function GET(
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

  const supabase = supabaseAdmin();

  const { data, error } = await supabase
    .from("events")
    .select(`
      id,
      slug,
      title,
      subtitle,
      description,
      mode,
      venue,
      city,
      state,
      start_at,
      end_at,
      banner_url,
      is_published,
      registration_open,
      created_at,
      updated_at
    `)
    .eq("id", id)
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

  return json(true, { data });
}

export async function PATCH(
  req: Request,
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

  let body: EventUpdateBody = {};
  try {
    body = await req.json();
  } catch {
    return json(false, { error: "Invalid JSON body." }, 400);
  }

  const updates: Record<string, unknown> = {};

  if (body.title !== undefined) {
    const title = String(body.title ?? "").trim();
    if (!title) {
      return json(false, { error: "Title is required." }, 400);
    }
    updates.title = title;
  }

  if (body.subtitle !== undefined) {
    updates.subtitle = body.subtitle == null ? null : String(body.subtitle).trim() || null;
  }

  if (body.description !== undefined) {
    updates.description = body.description == null ? null : String(body.description).trim() || null;
  }

  if (body.mode !== undefined) {
    updates.mode = body.mode == null ? null : String(body.mode).trim() || null;
  }

  if (body.venue !== undefined) {
    updates.venue = body.venue == null ? null : String(body.venue).trim() || null;
  }

  if (body.city !== undefined) {
    updates.city = body.city == null ? null : String(body.city).trim() || null;
  }

  if (body.state !== undefined) {
    updates.state = body.state == null ? null : String(body.state).trim() || null;
  }

  if (body.start_at !== undefined) {
    updates.start_at = body.start_at == null ? null : String(body.start_at);
  }

  if (body.end_at !== undefined) {
    updates.end_at = body.end_at == null ? null : String(body.end_at);
  }

  if (body.banner_url !== undefined) {
    updates.banner_url = body.banner_url == null ? null : String(body.banner_url).trim() || null;
  }

  if (body.slug !== undefined) {
    updates.slug = body.slug == null ? null : String(body.slug).trim() || null;
  }

  if (body.is_published !== undefined) {
    if (typeof body.is_published !== "boolean") {
      return json(false, { error: "is_published must be a boolean." }, 400);
    }
    updates.is_published = body.is_published;
  }

  if (body.registration_open !== undefined) {
    if (typeof body.registration_open !== "boolean") {
      return json(false, { error: "registration_open must be a boolean." }, 400);
    }
    updates.registration_open = body.registration_open;
  }

  if (Object.keys(updates).length === 0) {
    return json(false, { error: "Nothing to update." }, 400);
  }

  updates.updated_at = new Date().toISOString();

  const supabase = supabaseAdmin();

  const { data, error } = await supabase
    .from("events")
    .update(updates)
    .eq("id", id)
    .select(`
      id,
      slug,
      title,
      subtitle,
      description,
      mode,
      venue,
      city,
      state,
      start_at,
      end_at,
      banner_url,
      is_published,
      registration_open,
      created_at,
      updated_at
    `)
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

  return json(true, { data, message: "Event updated successfully." });
}