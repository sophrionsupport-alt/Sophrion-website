"use client";

import * as React from "react";
import FiltersBar, { type FiltersState } from "@/components/admin/FiltersBar";
import AdminTable, { type AdminRow } from "@/components/admin/AdminTable";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

type ContactRecord = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  created_at: string;
  archived: boolean;
  archived_at: string | null;
};

type ApiOk<T = unknown> = {
  ok: true;
  data?:
    | {
        rows?: T[];
        count?: number;
      }
    | T[];
  message?: string;
};

type ApiFail = {
  ok: false;
  error?: string;
  message?: string;
};

type ApiResp<T = unknown> = ApiOk<T> | ApiFail;

function fmtDate(s?: string | null) {
  if (!s) return "";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString();
}

/**
 * Reusing FiltersBar:
 * - all      => all
 * - pending  => inbox
 * - approved => archived
 * - rejected => treated as all
 */
function mapStatus(s: FiltersState["status"]): "all" | "inbox" | "archived" {
  if (s === "pending") return "inbox";
  if (s === "approved") return "archived";
  return "all";
}

export default function ContactsPage() {
  const [filters, setFilters] = React.useState<FiltersState>({
    q: "",
    status: "pending",
    sort: "newest",
  });

  const [loading, setLoading] = React.useState(true);
  const [rows, setRows] = React.useState<AdminRow[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState<ContactRecord | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const qs = new URLSearchParams();

      if (filters.q.trim()) qs.set("q", filters.q.trim());
      qs.set("status", mapStatus(filters.status));
      qs.set("sort", filters.sort);

      const res = await fetch(`/api/admin/contacts?${qs.toString()}`, {
        method: "GET",
        headers: { "content-type": "application/json" },
        cache: "no-store",
      });

      const payload = (await res.json().catch(() => null)) as ApiResp<ContactRecord> | null;

      if (!res.ok || !payload || !payload.ok) {
      const message =
        payload && "error" in payload && typeof payload.error === "string"
          ? payload.error
          : "Failed to load contacts.";

      throw new Error(message);
    }

      const list = Array.isArray(payload.data)
        ? payload.data
        : Array.isArray(payload.data?.rows)
        ? payload.data.rows
        : [];

      const mapped: AdminRow[] = list.map((c) => ({
        id: c.id,
        primary: c.name || "Unknown",
        secondary: `${c.email}${c.phone ? ` • ${c.phone}` : ""}`,
        status: c.archived ? "approved" : "pending",
        meta: fmtDate(c.created_at),
        actions: [
          {
            label: "View",
            intent: "primary",
            onClick: () => {
              setActive(c);
              setOpen(true);
            },
          },
          {
            label: c.archived ? "Unarchive" : "Archive",
            intent: "secondary",
            onClick: async () => {
              await toggleArchive(c.id, !c.archived);
            },
          },
        ],
      }));

      setRows(mapped);
    } catch (e) {
      console.error(e);
      setRows([]);
      setError(e instanceof Error ? e.message : "Failed to load contacts.");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- toggleArchive is defined below and calls load(); including it would cycle deps
  }, [filters]);

  async function toggleArchive(id: string, archived: boolean) {
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ archived }),
      });

      const payload = (await res.json().catch(() => null)) as ApiResp | null;

      if (!res.ok || !payload || !payload.ok) {
        const message =
          payload && "error" in payload && typeof payload.error === "string"
            ? payload.error
            : "Update failed.";

        throw new Error(message);
      }

      setActive((prev) =>
        prev && prev.id === id
          ? {
              ...prev,
              archived,
              archived_at: archived ? new Date().toISOString() : null,
            }
          : prev
      );

      await load();
    } catch (e) {
      console.error(e);
    }
  }

  React.useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <h1 className="text-xl font-semibold text-foreground">Contact Messages</h1>
        <p className="text-sm text-foreground/60">
          Review inbound messages. Archive items once handled.
        </p>
      </div>

      <FiltersBar
        value={filters}
        onChange={setFilters}
        placeholder="Search by name, email, phone, message…"
      />

      {error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-2xl border border-border bg-background/40 p-6 text-sm text-foreground/70">
          Loading messages…
        </div>
      ) : (
        <AdminTable rows={rows} />
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Contact Message">
        {active ? (
          <div className="grid gap-4">
            <div className="grid gap-1">
              <div className="text-sm text-foreground/60">From</div>
              <div className="text-base font-medium text-foreground">{active.name}</div>
              <div className="text-sm text-foreground/70">
                {active.email}
                {active.phone ? ` • ${active.phone}` : ""}
              </div>
              <div className="text-xs text-foreground/50">{fmtDate(active.created_at)}</div>
            </div>

            <div className="rounded-2xl border border-border bg-background/40 p-4">
              <div className="whitespace-pre-wrap text-sm text-foreground/90">
                {active.message}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={() => toggleArchive(active.id, !active.archived)}>
                {active.archived ? "Unarchive" : "Archive"}
              </Button>

              <Button variant="secondary" onClick={() => setOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}