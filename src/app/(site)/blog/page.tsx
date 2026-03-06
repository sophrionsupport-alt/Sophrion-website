import Link from "next/link";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

async function supabaseServer() {
  const cookieStore = await cookies();

  return createServerClient(
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
}

export default async function BlogPage() {
  const supabase = await supabaseServer();

  const { data: posts, error } = await supabase
    .from("blog_posts")
    .select("id,slug,title,excerpt,published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-2xl font-semibold text-foreground">Blog</h1>
        <p className="mt-2 text-sm text-foreground/60">Failed to load blog posts.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Blog</h1>
        <p className="mt-2 text-sm text-foreground/60">
          Insights, updates, and stories from Sophrion.
        </p>
      </div>

      {!posts?.length ? (
        <div className="rounded-2xl border border-border bg-card p-6 text-sm text-foreground/60">
          No published posts yet.
        </div>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="rounded-2xl border border-border bg-card p-6 transition hover:bg-card/80"
            >
              <h2 className="text-lg font-semibold text-foreground">{post.title}</h2>
              {post.excerpt ? (
                <p className="mt-2 text-sm text-foreground/70">{post.excerpt}</p>
              ) : null}
              <div className="mt-3 text-xs text-foreground/50">
                {post.published_at ? new Date(post.published_at).toLocaleDateString() : ""}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}