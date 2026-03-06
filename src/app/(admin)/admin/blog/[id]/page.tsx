"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_url: string | null;
  is_published: boolean;
  published_at: string | null;
};

type ApiOk<T = unknown> = { ok: true; data?: T; message?: string };
type ApiFail = { ok: false; error?: string; message?: string };
type ApiResp<T = unknown> = ApiOk<T> | ApiFail;

export default function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();

  const [id, setId] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [excerpt, setExcerpt] = React.useState("");
  const [coverUrl, setCoverUrl] = React.useState("");
  const [content, setContent] = React.useState("");
  const [published, setPublished] = React.useState(false);

  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    async function boot() {
      try {
        const resolved = await params;
        setId(resolved.id);

        const res = await fetch(`/api/admin/blog/${resolved.id}`);
        const json = (await res.json()) as ApiResp<BlogPost>;

        if (!json.ok) {
          throw new Error(json.error || "Failed to load post");
        }

        if (!json.data) {
          throw new Error("Post data not found.");
        }

        const p = json.data;
        setTitle(p.title);
        setSlug(p.slug);
        setExcerpt(p.excerpt ?? "");
        setCoverUrl(p.cover_url ?? "");
        setContent(p.content);
        setPublished(p.is_published);
      } catch (err: any) {
        setError(err.message || "Failed to load post");
      } finally {
        setLoading(false);
      }
    }

    boot();
  }, [params]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          cover_url: coverUrl,
          content,
          is_published: published,
        }),
      });

      const json = (await res.json()) as ApiResp<BlogPost>;

      if (!json.ok) {
        throw new Error(json.error || "Failed to save post");
      }

      if (!json.data) {
        throw new Error("Post saved, but no data was returned.");
      }

      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to save post");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="text-sm text-foreground/60">Loading post...</div>;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 grid gap-1">
        <h1 className="text-2xl font-semibold text-foreground">
          Edit Blog Post
        </h1>
        <p className="text-sm text-foreground/60">
          Update content and toggle publish status.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="grid gap-5 rounded-2xl border border-border bg-card p-6"
      >
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <Input
          label="Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
        />

        <Input
          label="Excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
        />

        <Input
          label="Cover URL"
          value={coverUrl}
          onChange={(e) => setCoverUrl(e.target.value)}
        />

        <label className="grid gap-2">
          <span className="text-sm font-medium text-foreground">Content</span>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={16}
            className="min-h-80 rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none"
            required
          />
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          <span className="text-sm text-foreground">Published</span>
        </label>

        {error ? <div className="text-sm text-red-400">{error}</div> : null}

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/admin/blog")}
          >
            Back
          </Button>

          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Post"}
          </Button>
        </div>
      </form>
    </div>
  );
}