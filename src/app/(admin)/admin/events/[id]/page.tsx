// src/app/(admin)/admin/events/[id]/page.tsx
"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";

type EventRecord = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;

  mode: string | null;
  venue: string | null;
  city: string | null;
  state: string | null;

  start_at: string | null;
  end_at: string | null;

  banner_url: string | null;

  is_published: boolean;
  registration_open: boolean;

  created_at?: string | null;
  updated_at?: string | null;
};

function toInputDateTime(value: string | null) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

function toISOStringOrNull(localValue: string) {
  const v = localValue.trim();
  if (!v) return null;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

export default function AdminEventEditPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const router = useRouter();

  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  const [event, setEvent] = React.useState<EventRecord | null>(null);

  const [form, setForm] = React.useState({
    title: "",
    subtitle: "",
    description: "",
    mode: "",
    venue: "",
    city: "",
    state: "",
    start_at: "",
    end_at: "",
    banner_url: "",
    slug: "",
  });

  function patchForm(p: Partial<typeof form>) {
    setForm((f) => ({ ...f, ...p }));
  }

  async function loadEvent() {
    if (!id) return;

    try {
      setLoading(true);

      const res = await fetch(`/api/admin/events/${encodeURIComponent(id)}`, {
        method: "GET",
      });
      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        alert(json?.error || "Failed to load event");
        return;
      }

      const e = json.data as EventRecord;
      setEvent(e);

      patchForm({
        title: e.title ?? "",
        subtitle: e.subtitle ?? "",
        description: e.description ?? "",
        mode: e.mode ?? "",
        venue: e.venue ?? "",
        city: e.city ?? "",
        state: e.state ?? "",
        start_at: toInputDateTime(e.start_at),
        end_at: toInputDateTime(e.end_at),
        banner_url: e.banner_url ?? "",
        slug: e.slug ?? "",
      });
    } catch (err) {
      console.error(err);
      alert("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    if (!id) return;

    // minimal validation
    if (!form.title.trim()) {
      alert("Title is required");
      return;
    }

    try {
      setSaving(true);

      const res = await fetch(`/api/admin/events/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          subtitle: form.subtitle.trim() || null,
          description: form.description.trim() || null,
          mode: form.mode.trim() || null,
          venue: form.venue.trim() || null,
          city: form.city.trim() || null,
          state: form.state.trim() || null,
          start_at: toISOStringOrNull(form.start_at),
          end_at: toISOStringOrNull(form.end_at),
          banner_url: form.banner_url.trim() || null,
          slug: form.slug.trim() || null,
        }),
      });

      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) {
        alert(json?.error || "Failed to save event");
        return;
      }

      const next = json.data as EventRecord;
      setEvent((prev) => ({ ...(prev ?? next), ...next }));

      alert("Saved");
    } catch (err) {
      console.error(err);
      alert("Network error");
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish() {
    if (!id || !event) return;
    try {
      setSaving(true);
      const res = await fetch(`/api/admin/events/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ is_published: !event.is_published }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) {
        alert(json?.error || "Failed to update");
        return;
      }
      setEvent((e) => (e ? { ...e, is_published: !e.is_published } : e));
    } finally {
      setSaving(false);
    }
  }

  async function toggleReg() {
    if (!id || !event) return;
    try {
      setSaving(true);
      const res = await fetch(`/api/admin/events/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ registration_open: !event.registration_open }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) {
        alert(json?.error || "Failed to update");
        return;
      }
      setEvent((e) => (e ? { ...e, registration_open: !e.registration_open } : e));
    } finally {
      setSaving(false);
    }
  }

  React.useEffect(() => {
    loadEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!id) {
    return <div className="p-6 text-sm text-foreground/60">Missing event id.</div>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-foreground">Edit Event</h1>
          <p className="text-sm text-foreground/60">
            Update event details, publish, and control registrations.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            className="rounded-xl border border-border bg-background/40 px-4 py-2 text-xs hover:bg-background/60 disabled:opacity-50"
            disabled={saving || loading}
            onClick={() => router.push("/admin/events")}
          >
            Back
          </button>

          <button
            className="rounded-xl border border-border bg-background/40 px-4 py-2 text-xs hover:bg-background/60 disabled:opacity-50"
            disabled={saving || loading}
            onClick={togglePublish}
          >
            {event?.is_published ? "Unpublish" : "Publish"}
          </button>

          <button
            className="rounded-xl border border-border bg-background/40 px-4 py-2 text-xs hover:bg-background/60 disabled:opacity-50"
            disabled={saving || loading}
            onClick={toggleReg}
          >
            {event?.registration_open ? "Close Reg" : "Open Reg"}
          </button>

          <a
            className="rounded-xl border border-border bg-background/40 px-4 py-2 text-xs hover:bg-background/60"
            href={event ? `/events/${encodeURIComponent(event.slug)}` : "#"}
            target="_blank"
            rel="noreferrer"
          >
            View
          </a>

          <button
            className="rounded-xl border border-border bg-background/40 px-4 py-2 text-xs hover:bg-background/60 disabled:opacity-50"
            disabled={saving || loading}
            onClick={save}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        {loading ? (
          <div className="text-sm text-foreground/60">Loading event…</div>
        ) : !event ? (
          <div className="text-sm text-foreground/60">Event not found.</div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-1">
                <span className="text-xs text-foreground/60">Title *</span>
                <input
                  className="w-full rounded-xl border border-border bg-background/40 px-3 py-2 text-sm outline-none"
                  value={form.title}
                  onChange={(e) => patchForm({ title: e.target.value })}
                  placeholder="Event title"
                />
              </label>

              <label className="grid gap-1">
                <span className="text-xs text-foreground/60">Subtitle</span>
                <input
                  className="w-full rounded-xl border border-border bg-background/40 px-3 py-2 text-sm outline-none"
                  value={form.subtitle}
                  onChange={(e) => patchForm({ subtitle: e.target.value })}
                  placeholder="Short supporting line"
                />
              </label>

              <label className="grid gap-1 md:col-span-2">
                <span className="text-xs text-foreground/60">Description</span>
                <textarea
                  className="min-h-35 w-full rounded-xl border border-border bg-background/40 px-3 py-2 text-sm outline-none"
                  value={form.description}
                  onChange={(e) => patchForm({ description: e.target.value })}
                  placeholder="What is this event about?"
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <label className="grid gap-1">
                <span className="text-xs text-foreground/60">Mode</span>
                <input
                  className="w-full rounded-xl border border-border bg-background/40 px-3 py-2 text-sm outline-none"
                  value={form.mode}
                  onChange={(e) => patchForm({ mode: e.target.value })}
                  placeholder="offline / online / hybrid"
                />
              </label>

              <label className="grid gap-1">
                <span className="text-xs text-foreground/60">City</span>
                <input
                  className="w-full rounded-xl border border-border bg-background/40 px-3 py-2 text-sm outline-none"
                  value={form.city}
                  onChange={(e) => patchForm({ city: e.target.value })}
                  placeholder="Hyderabad"
                />
              </label>

              <label className="grid gap-1">
                <span className="text-xs text-foreground/60">State</span>
                <input
                  className="w-full rounded-xl border border-border bg-background/40 px-3 py-2 text-sm outline-none"
                  value={form.state}
                  onChange={(e) => patchForm({ state: e.target.value })}
                  placeholder="Telangana"
                />
              </label>

              <label className="grid gap-1 md:col-span-2">
                <span className="text-xs text-foreground/60">Venue</span>
                <input
                  className="w-full rounded-xl border border-border bg-background/40 px-3 py-2 text-sm outline-none"
                  value={form.venue}
                  onChange={(e) => patchForm({ venue: e.target.value })}
                  placeholder="College / Hall / Zoom"
                />
              </label>

              <label className="grid gap-1">
                <span className="text-xs text-foreground/60">Slug</span>
                <input
                  className="w-full rounded-xl border border-border bg-background/40 px-3 py-2 text-sm outline-none"
                  value={form.slug}
                  onChange={(e) => patchForm({ slug: e.target.value })}
                  placeholder="ai-career-readiness-workshop"
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-1">
                <span className="text-xs text-foreground/60">Start</span>
                <input
                  type="datetime-local"
                  className="w-full rounded-xl border border-border bg-background/40 px-3 py-2 text-sm outline-none"
                  value={form.start_at}
                  onChange={(e) => patchForm({ start_at: e.target.value })}
                />
              </label>

              <label className="grid gap-1">
                <span className="text-xs text-foreground/60">End</span>
                <input
                  type="datetime-local"
                  className="w-full rounded-xl border border-border bg-background/40 px-3 py-2 text-sm outline-none"
                  value={form.end_at}
                  onChange={(e) => patchForm({ end_at: e.target.value })}
                />
              </label>
            </div>

            <label className="grid gap-1">
              <span className="text-xs text-foreground/60">Banner URL</span>
              <input
                className="w-full rounded-xl border border-border bg-background/40 px-3 py-2 text-sm outline-none"
                value={form.banner_url}
                onChange={(e) => patchForm({ banner_url: e.target.value })}
                placeholder="https://..."
              />
            </label>

            <div className="rounded-xl border border-border bg-background/30 px-3 py-2 text-xs text-foreground/60">
              <div>ID: {event.id}</div>
              <div>Status: {event.is_published ? "Published" : "Draft"}</div>
              <div>Registration: {event.registration_open ? "Open" : "Closed"}</div>
              {event.updated_at ? (
                <div>Updated: {new Date(event.updated_at).toLocaleString()}</div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}