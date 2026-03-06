import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";

function json(
  ok: boolean,
  init?: { data?: unknown; error?: string; message?: string },
  status = 200
) {
  return NextResponse.json({ ok, ...init }, { status });
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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
    return json(false, { error: "Blog post id is required." }, 400);
  }

  const { data, error } = await auth.supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    const status = error.code === "PGRST116" ? 404 : 500;
    return json(false, { error: error.code === "PGRST116" ? "Blog post not found." : error.message }, status);
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
    return json(false, { error: "Blog post id is required." }, 400);
  }

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return json(false, { error: "Invalid JSON body." }, 400);
  }

  const title = String(body.title ?? "").trim();
  const excerpt =
    typeof body.excerpt === "string" ? body.excerpt.trim() || null : null;
  const content = String(body.content ?? "").trim();
  const cover_url =
    typeof body.cover_url === "string" ? body.cover_url.trim() || null : null;
  const requestedSlug = String(body.slug ?? "").trim();
  const is_published = Boolean(body.is_published);

  if (!title) {
    return json(false, { error: "Title is required." }, 400);
  }

  if (!content) {
    return json(false, { error: "Content is required." }, 400);
  }

  const slug = slugify(requestedSlug || title);

  if (!slug) {
    return json(false, { error: "Valid slug could not be generated." }, 400);
  }

  const patch: Record<string, unknown> = {
    title,
    slug,
    excerpt,
    content,
    cover_url,
    is_published,
    updated_at: new Date().toISOString(),
    published_at: is_published
      ? typeof body.published_at === "string" && body.published_at.trim()
        ? body.published_at
        : new Date().toISOString()
      : null,
  };

  const { data, error } = await auth.supabase
    .from("blog_posts")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return json(false, { error: error.message }, 500);
  }

  return json(true, { data });
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();

  if (!auth.ok) {
    return json(false, { error: auth.error }, auth.status);
  }

  const { id } = await ctx.params;

  if (!id) {
    return json(false, { error: "Blog post id is required." }, 400);
  }

  const { error } = await auth.supabase
    .from("blog_posts")
    .delete()
    .eq("id", id);

  if (error) {
    return json(false, { error: error.message }, 500);
  }

  return json(true, { message: "Blog post deleted successfully." });
}