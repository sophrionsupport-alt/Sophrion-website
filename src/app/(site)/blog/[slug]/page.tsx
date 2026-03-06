import { notFound } from "next/navigation";
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

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const supabase = await supabaseServer();

  const { data: post } = await supabase
    .from("blog_posts")
    .select("title,excerpt,content,published_at,cover_url")
    .eq("slug", params.slug)
    .eq("is_published", true)
    .single();

  if (!post) return notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <article className="rounded-2xl border border-border bg-card p-6">
        <h1 className="text-3xl font-semibold text-foreground">{post.title}</h1>

        {post.published_at ? (
          <div className="mt-2 text-sm text-foreground/50">
            {new Date(post.published_at).toLocaleDateString()}
          </div>
        ) : null}

        {post.excerpt ? (
          <p className="mt-4 text-base text-foreground/70">{post.excerpt}</p>
        ) : null}

        <div className="mt-6 whitespace-pre-wrap text-sm leading-7 text-foreground/90">
          {post.content}
        </div>
      </article>
    </div>
  );
}