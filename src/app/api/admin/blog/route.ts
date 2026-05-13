import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function json(
  ok: boolean,
  init?: { data?: unknown; error?: string; message?: string },
  status = 200
) {
  return NextResponse.json({ ok, ...init }, { status });
}

async function requireAdminSession() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) {
    return { ok: false as const, supabase, error: "Unauthorized" };
  }

  const { data: profile, error: profErr } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profErr || !profile || profile.role !== "admin") {
    return { ok: false as const, supabase, error: "Forbidden" };
  }

  return { ok: true as const, supabase };
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET(req: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) {
    return json(false, { error: auth.error }, auth.error === "Forbidden" ? 403 : 401);
  }

  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").trim();
  const status = (url.searchParams.get("status") ?? "all").toLowerCase(); // published | draft | all
  const sort = (url.searchParams.get("sort") ?? "newest").toLowerCase();

  let query = auth.supabase
    .from("blog_posts")
    .select("id,slug,title,excerpt,is_published,published_at,created_at,updated_at")
    .order("created_at", { ascending: sort === "oldest" });

  if (status === "published") query = query.eq("is_published", true);
  if (status === "draft") query = query.eq("is_published", false);

  if (q) {
    const like = `%${q.replace(/%/g, "\\%").replace(/_/g, "\\_")}%`;
    query = query.or(`title.ilike.${like},slug.ilike.${like},excerpt.ilike.${like},content.ilike.${like}`);
  }

  const { data, error } = await query;

  if (error) return json(false, { error: error.message }, 500);
  return json(true, { data });
}

export async function POST(req: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) {
    return json(false, { error: auth.error }, auth.error === "Forbidden" ? 403 : 401);
  }

  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    body = {};
  }

  const title = String(body?.title ?? "").trim();
  const excerpt = String(body?.excerpt ?? "").trim() || null;
  const content = String(body?.content ?? "").trim();
  const cover_url = String(body?.cover_url ?? "").trim() || null;
  const requestedSlug = String(body?.slug ?? "").trim();

  if (!title) return json(false, { error: "Title is required." }, 400);
  if (!content) return json(false, { error: "Content is required." }, 400);

  const slug = slugify(requestedSlug || title);
  if (!slug) return json(false, { error: "Valid slug could not be generated." }, 400);

  const { data, error } = await auth.supabase
    .from("blog_posts")
    .insert({
      title,
      slug,
      excerpt,
      content,
      cover_url,
      is_published: false,
      published_at: null,
    })
    .select("id,slug,title,excerpt,is_published,published_at,created_at,updated_at")
    .single();

  if (error) return json(false, { error: error.message }, 500);

  return json(true, { data }, 201);
}