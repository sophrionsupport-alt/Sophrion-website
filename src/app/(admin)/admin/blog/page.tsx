"use client";

import * as React from "react";
import Link from "next/link";
import FiltersBar, { type FiltersState } from "@/components/admin/FiltersBar";
import AdminTable, { type AdminRow } from "@/components/admin/AdminTable";
import Button from "@/components/ui/Button";

type BlogRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
};

type ApiOk<T = unknown> = { ok: true; data?: T; message?: string };
type ApiFail = { ok: false; error?: string; message?: string };
type ApiResp<T = unknown> = ApiOk<T> | ApiFail;

function mapStatus(s: FiltersState["status"]): "all" | "published" | "draft" {
  if (s === "approved") return "published";
  if (s === "pending") return "draft";
  return "all";
}

function fmtDate(s?: string | null) {
  if (!s) return "";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString();
}

export default function AdminBlogPage() {
  const [filters, setFilters] = React.useState<FiltersState>({
    q: "",
    status: "all",
    sort: "newest",
  });

  const [rows, setRows] = React.useState<AdminRow[]>([]);
  const [loading, setLoading] = React.useState(true);

  async function load() {
    try {
      setLoading(true);
      const qs = new URLSearchParams();
      if (filters.q.trim()) qs.set("q", filters.q.trim());
      qs.set("status", mapStatus(filters.status));
      qs.set("sort", filters.sort);

      const res = await fetch(`/api/admin/blog?${qs.toString()}`);
      const json = (await res.json()) as ApiResp<BlogRow[]>;

      if (!json.ok) throw new Error(json.error || "Failed to load blog posts");

      const list = json.data ?? [];
      const mapped: AdminRow[] = list.map((p) => ({
        id: p.id,
        primary: p.title,
        secondary: p.slug,
        status: p.is_published ? "approved" : "pending",
        meta: p.is_published ? fmtDate(p.published_at) : `Draft • ${fmtDate(p.created_at)}`,
        actions: [
          {
            label: "Edit",
            href: `/admin/blog/${p.id}`,
          },
        ],
      }));

      setRows(mapped);
    } catch (err) {
      console.error(err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.q, filters.status, filters.sort]);

  return (
    <div className="grid gap-6">
      <div className="flex items-start justify-between gap-4">
        <div className="grid gap-1">
          <h1 className="text-2xl font-semibold text-foreground">Blog</h1>
          <p className="text-sm text-foreground/60">
            Manage blog posts and publish them to the public site.
          </p>
        </div>

        <Link href="/admin/blog/new">
          <Button>New Post</Button>
        </Link>
      </div>

      <FiltersBar
        value={filters}
        onChange={setFilters}
        placeholder="Search by title, slug, excerpt..."
      />

      <div className="rounded-xl border border-border bg-card">
        {loading ? (
          <div className="p-6 text-sm text-foreground/60">Loading posts...</div>
        ) : rows.length === 0 ? (
          <div className="p-6 text-sm text-foreground/60">No blog posts found.</div>
        ) : (
          <AdminTable
            rows={rows}
            columnsLabel={{
              primary: "Post",
              status: "Status",
              meta: "Published",
              actions: "Actions",
            }}
          />
        )}
      </div>
    </div>
  );
}