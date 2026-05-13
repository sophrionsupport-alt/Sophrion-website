"use client";

import * as React from "react";
import FiltersBar, { type FiltersState } from "@/components/admin/FiltersBar";
import AdminTable, { type AdminRow } from "@/components/admin/AdminTable";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

type Subscriber = {
  id: string;
  email: string;
  name: string | null;
  status: "active" | "unsubscribed";
  created_at: string;
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
 * Reuse FiltersBar status:
 * pending  -> active
 * rejected -> unsubscribed
 * all      -> all
 * approved -> treated as all
 */
function mapStatus(s: FiltersState["status"]): "all" | "active" | "unsubscribed" {
  if (s === "pending") return "active";
  if (s === "rejected") return "unsubscribed";
  return "all";
}

export default function NewsletterPage() {
  const [filters, setFilters] = React.useState<FiltersState>({
    q: "",
    status: "pending",
    sort: "newest",
  });

  const [loading, setLoading] = React.useState(true);
  const [rows, setRows] = React.useState<AdminRow[]>([]);
  const [active, setActive] = React.useState<Subscriber | null>(null);
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const qs = new URLSearchParams();
      if (filters.q.trim()) qs.set("q", filters.q.trim());
      qs.set("status", mapStatus(filters.status));
      qs.set("sort", filters.sort);

      const res = await fetch(`/api/admin/newsletter?${qs.toString()}`, {
        method: "GET",
        headers: { "content-type": "application/json" },
        cache: "no-store",
      });

      const payload = (await res.json().catch(() => null)) as ApiResp<Subscriber> | null;

      if (!res.ok || !payload || !payload.ok) {
        const message =
          payload && "error" in payload && typeof payload.error === "string"
            ? payload.error
            : "Failed to load newsletter.";

        throw new Error(message);
      }

      const list = Array.isArray(payload.data)
        ? payload.data
        : Array.isArray(payload.data?.rows)
        ? payload.data.rows
        : [];

      const mapped: AdminRow[] = list.map((s) => ({
        id: s.id,
        primary: s.email,
        secondary: s.name ?? "",
        status: s.status === "active" ? "approved" : "rejected",
        meta: fmtDate(s.created_at),
        actions: [
          {
            label: "View",
            onClick: () => {
              setActive(s);
              setOpen(true);
            },
          },
          {
            label: s.status === "active" ? "Unsubscribe" : "Resubscribe",
            onClick: async () => {
              await updateStatus(
                s.id,
                s.status === "active" ? "unsubscribed" : "active"
              );
            },
          },
        ],
      }));

      setRows(mapped);
    } catch (e) {
      console.error(e);
      setRows([]);
      setError(e instanceof Error ? e.message : "Failed to load newsletter.");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- updateStatus is defined below and calls load()
  }, [filters]);

  async function updateStatus(id: string, status: "active" | "unsubscribed") {
    try {
      const res = await fetch(`/api/admin/newsletter/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status }),
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
              status,
            }
          : prev
      );

      await load();
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Failed to update subscriber.");
    }
  }

  React.useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <h1 className="text-xl font-semibold text-foreground">Newsletter</h1>
        <p className="text-sm text-foreground/60">
          Manage newsletter subscribers. Unsubscribe or resubscribe as needed.
        </p>
      </div>

      <FiltersBar
        value={filters}
        onChange={setFilters}
        placeholder="Search by email or name…"
      />

      {error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-2xl border border-border bg-background/40 p-6 text-sm text-foreground/70">
          Loading subscribers…
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-border bg-background/40 p-6">
          <div className="text-sm font-medium text-foreground">
            No subscribers found
          </div>
          <div className="mt-1 text-sm text-foreground/60">
            Subscriptions from your footer form will show up here.
          </div>
        </div>
      ) : (
        <AdminTable rows={rows} />
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Subscriber">
        {active ? (
          <div className="grid gap-4">
            <div className="grid gap-1">
              <div className="text-sm text-foreground/60">Email</div>
              <div className="text-base font-medium text-foreground">{active.email}</div>

              {active.name ? (
                <div className="text-sm text-foreground/70">{active.name}</div>
              ) : null}

              <div className="text-xs text-foreground/50">
                {fmtDate(active.created_at)}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-background/40 p-4">
              <div className="text-sm text-foreground/80">
                Status: <span className="text-foreground">{active.status}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() =>
                  updateStatus(
                    active.id,
                    active.status === "active" ? "unsubscribed" : "active"
                  )
                }
              >
                {active.status === "active" ? "Unsubscribe" : "Resubscribe"}
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