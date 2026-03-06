"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

type ApiOk<T = unknown> = { ok: true; data?: T; message?: string };
type ApiFail = { ok: false; error?: string; message?: string };
type ApiResp<T = unknown> = ApiOk<T> | ApiFail;

export default function NewBlogPostPage() {
  const router = useRouter();

  const [title, setTitle] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [excerpt, setExcerpt] = React.useState("");
  const [coverUrl, setCoverUrl] = React.useState("");
  const [content, setContent] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          cover_url: coverUrl,
          content,
        }),
      });

      const json = (await res.json()) as ApiResp<{ id: string }>;

      if (!json.ok) {
        throw new Error(json.error || "Failed to create blog post");
      }

      if (!json.data?.id) {
        throw new Error("Blog post created, but no ID was returned.");
      }

      router.push(`/admin/blog/${json.data.id}`);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 grid gap-1">
        <h1 className="text-2xl font-semibold text-foreground">
          New Blog Post
        </h1>
        <p className="text-sm text-foreground/60">
          Create a draft first, then publish when ready.
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
          placeholder="optional-auto-generated"
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

        {error ? <div className="text-sm text-red-400">{error}</div> : null}

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? "Creating..." : "Create Draft"}
          </Button>
        </div>
      </form>
    </div>
  );
}