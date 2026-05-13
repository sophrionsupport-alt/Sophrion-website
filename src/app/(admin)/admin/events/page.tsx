"use client";

import * as React from "react";
import Link from "next/link";
import FiltersBar, { type FiltersState } from "@/components/admin/FiltersBar";
import AdminTable, { type AdminRow } from "@/components/admin/AdminTable";

type EventRecord = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  start_at: string | null;
  mode: string | null;
  venue: string | null;
  city: string | null;
  state: string | null;
  is_published: boolean;
  registration_open: boolean;
};

function fmtDate(s?: string | null) {
  if (!s) return null;
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString();
}

export default function EventsPage() {
  const [filters, setFilters] = React.useState<FiltersState>({
    q: "",
    status: "all",
    sort: "newest",
  });

  const [loading, setLoading] = React.useState(true);
  const [raw, setRaw] = React.useState<EventRecord[]>([]);
  const [rows, setRows] = React.useState<AdminRow[]>([]);
  const [actingId, setActingId] = React.useState<string | null>(null);
  const [exportingEventId, setExportingEventId] = React.useState<string | null>(
    null
  );

  const loadEvents = React.useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (filters.q.trim()) params.set("q", filters.q.trim());
      if (filters.sort) params.set("sort", filters.sort);

      if (filters.status === "approved") params.set("status", "published");
      if (filters.status === "pending") params.set("status", "draft");

      const res = await fetch(`/api/admin/events?${params.toString()}`);
      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) return;

      const list = (json.data?.rows as EventRecord[]) ?? [];

      setRaw(list);

      const mapped: AdminRow[] = list.map((e) => ({
        id: e.id,
        primary: e.title,
        secondary: e.subtitle ?? undefined,
        status: e.is_published ? "published" : "draft",
        meta: [
          fmtDate(e.start_at),
          e.city ?? null,
          e.mode ?? null,
          e.registration_open ? "Reg: Open" : "Reg: Closed",
        ]
          .filter(Boolean)
          .join(" • "),
      }));

      setRows(mapped);
    } catch (err) {
      console.error("Failed to load events", err);
    } finally {
      setLoading(false);
    }
  }, [filters.q, filters.status, filters.sort]);

  async function patchEvent(
    id: string,
    patch: { is_published?: boolean; registration_open?: boolean }
  ) {
    try {
      setActingId(id);

      const res = await fetch(`/api/admin/events/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(patch),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        alert(json?.error || "Failed to update event");
        return;
      }

      await loadEvents();
    } catch {
      alert("Network error");
    } finally {
      setActingId(null);
    }
  }

  async function deleteEvent(id: string) {
    const confirmDelete = window.confirm(
      "Delete this event? This cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      setActingId(id);

      const res = await fetch(`/api/admin/events/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        alert(json?.error || "Failed to delete event");
        return;
      }

      await loadEvents();
    } catch {
      alert("Network error");
    } finally {
      setActingId(null);
    }
  }

  async function exportEventRegistrations(eventId: string) {
    try {
      setExportingEventId(eventId);

      const params = new URLSearchParams();
      params.set("event_id", eventId);
      params.set("sort", "newest");

      const res = await fetch(
        `/api/admin/registrations/export?${params.toString()}`,
        {
          method: "GET",
        }
      );

      if (!res.ok) {
        let message = "Failed to export event registrations";
        try {
          const json = await res.json();
          message = json?.error || message;
        } catch {}
        alert(message);
        return;
      }

      const blob = await res.blob();
      const contentDisposition = res.headers.get("content-disposition") || "";
      const match = contentDisposition.match(/filename="([^"]+)"/i);
      const filename = match?.[1] || `event-registrations-${eventId}.csv`;

      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Failed to export event registrations");
    } finally {
      setExportingEventId(null);
    }
  }

  React.useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-foreground">Events</h1>
          <p className="text-sm text-foreground/60">
            Publish events and control registrations from one place.
          </p>
        </div>

        <Link
          href="/admin/events/new"
          className="inline-flex w-fit items-center justify-center rounded-xl border border-border bg-background/40 px-4 py-2 text-xs text-foreground hover:bg-background/60"
        >
          Create Event
        </Link>
      </div>

      <FiltersBar
        value={filters}
        onChange={setFilters}
        placeholder="Search by title, city, venue, mode…"
        className="max-w-3xl"
      />

      <div className="rounded-xl border border-border bg-card">
        {loading ? (
          <div className="p-6 text-sm text-foreground/60">Loading events...</div>
        ) : (
          <AdminTable
            rows={rows}
            columnsLabel={{
              primary: "Event",
              status: "Status",
              meta: "When / Where / Registration",
              actions: "Manage",
            }}
            renderActions={(row) => {
              const e = raw.find((x) => x.id === row.id);
              if (!e) return null;

              const busy = actingId === e.id;
              const exporting = exportingEventId === e.id;

              return (
                <>
                  <Link
                    href={`/admin/events/${encodeURIComponent(e.id)}`}
                    className="rounded-lg border border-border bg-background/40 px-3 py-1 text-xs hover:bg-background/60"
                  >
                    View
                  </Link>

                  <a
                    href={`/events/${encodeURIComponent(e.slug)}`}
                    className="rounded-lg border border-border bg-background/40 px-3 py-1 text-xs hover:bg-background/60"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Public View
                  </a>

                  <Link
                    href={`/admin/registrations?event_id=${encodeURIComponent(
                      e.id
                    )}`}
                    className="rounded-lg border border-border bg-background/40 px-3 py-1 text-xs hover:bg-background/60"
                  >
                    Registrations
                  </Link>

                  <Link
                    href={`/admin/events/${encodeURIComponent(e.id)}/scanner`}
                    className="rounded-lg border border-border bg-background/40 px-3 py-1 text-xs hover:bg-background/60"
                  >
                    Scanner
                  </Link>

                  <Link
                    href={`/admin/events/${encodeURIComponent(e.id)}/volunteers`}
                    className="rounded-lg border border-border bg-background/40 px-3 py-1 text-xs hover:bg-background/60"
                  >
                    Volunteers
                  </Link>

                  <button
                    onClick={() => exportEventRegistrations(e.id)}
                    disabled={exporting}
                    className="rounded-lg border border-border bg-background/40 px-3 py-1 text-xs hover:bg-background/60 disabled:opacity-50"
                  >
                    {exporting ? "Exporting…" : "Export CSV"}
                  </button>

                  <button
                    className="rounded-lg border border-border bg-background/40 px-3 py-1 text-xs hover:bg-background/60 disabled:opacity-50"
                    disabled={busy}
                    onClick={() =>
                      patchEvent(e.id, { is_published: !e.is_published })
                    }
                  >
                    {busy ? "Working…" : e.is_published ? "Unpublish" : "Publish"}
                  </button>

                  <button
                    className="rounded-lg border border-border bg-background/40 px-3 py-1 text-xs hover:bg-background/60 disabled:opacity-50"
                    disabled={busy}
                    onClick={() =>
                      patchEvent(e.id, {
                        registration_open: !e.registration_open,
                      })
                    }
                  >
                    {busy
                      ? "Working…"
                      : e.registration_open
                      ? "Close Reg"
                      : "Open Reg"}
                  </button>

                  <Link
                    href={`/admin/events/${encodeURIComponent(e.id)}`}
                    className="rounded-lg border border-border bg-background/40 px-3 py-1 text-xs hover:bg-background/60"
                  >
                    Edit
                  </Link>

                  {!e.is_published && (
                    <button
                      onClick={() => deleteEvent(e.id)}
                      className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-1 text-xs text-red-300 hover:bg-red-500/20 disabled:opacity-50"
                      disabled={busy}
                    >
                      Delete
                    </button>
                  )}
                </>
              );
            }}
          />
        )}
      </div>

      <div className="text-xs text-foreground/50">
        Note: Filters “Approved/Pending” map to “Published/Draft” for now.
      </div>
    </div>
  );
}