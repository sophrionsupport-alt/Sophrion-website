"use client";

import * as React from "react";
import FiltersBar, { type FiltersState } from "@/components/admin/FiltersBar";
import BulkActionsBar from "@/components/admin/BulkActionsBar";
import AdminTable, { type AdminRow } from "@/components/admin/AdminTable";
import Modal from "@/components/ui/Modal";

type RegistrationRecord = {
  id: string;
  event_id: string;
  event_title?: string | null;
  events?: { title?: string | null } | null;
  full_name: string;
  email: string;
  phone: string | null;
  college: string | null;
  year?: string | null;
  roll_number?: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at?: string | null;
  source?: string | null;
  ip?: string | null;
  user_agent?: string | null;
};

export default function RegistrationsPage() {
  const [filters, setFilters] = React.useState<FiltersState>({
    q: "",
    status: "all",
    sort: "newest",
  });

  const [rows, setRows] = React.useState<AdminRow[]>([]);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [bulkLoading, setBulkLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [raw, setRaw] = React.useState<RegistrationRecord[]>([]);
  const [openId, setOpenId] = React.useState<string | null>(null);

  const active = React.useMemo(
    () => (openId ? raw.find((r) => r.id === openId) ?? null : null),
    [openId, raw]
  );

  const loadRegistrations = React.useCallback(async () => {
  try {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (filters.q.trim()) params.set("q", filters.q.trim());
    if (filters.status !== "all") params.set("status", filters.status);
    if (filters.sort) params.set("sort", filters.sort);

    const qs = params.toString();

    const res = await fetch(`/api/admin/registrations${qs ? `?${qs}` : ""}`, {
      cache: "no-store",
    });

    const json = await res.json().catch(() => null);

    if (!res.ok || !json?.ok) {
      setRaw([]);
      setRows([]);
      setError(json?.error || "Failed to load registrations.");
      return;
    }

    // ✅ Prevents "list.map is not a function"
    const list: RegistrationRecord[] = Array.isArray(json?.data?.rows)
      ? json.data.rows
      : [];

    setRaw(list);

    const mapped: AdminRow[] = list.map((r) => {
      const eventTitle = r.event_title ?? r.events?.title ?? null;

      return {
        id: r.id,
        primary: r.full_name,
        secondary: r.email,
        status: r.status,
        meta: [r.college, r.phone, eventTitle ? `Event: ${eventTitle}` : null]
          .filter(Boolean)
          .join(" • "),
      };
    });

    setRows(mapped);
  } catch (err) {
    console.error("Failed to load registrations", err);
    setRaw([]);
    setRows([]);
    setError("Network error while loading registrations.");
  } finally {
    setLoading(false);
  }
}, [filters.q, filters.status, filters.sort]);

  const setStatus = React.useCallback(
    async (id: string, status: "pending" | "approved" | "rejected") => {
      try {
        const res = await fetch(`/api/admin/registrations/${encodeURIComponent(id)}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ status }),
        });

        const json = await res.json().catch(() => null);

        if (!res.ok || !json?.ok) {
          alert(json?.error || "Failed to update status");
          return;
        }

        await loadRegistrations();
      } catch {
        alert("Network error");
      }
    },
    [loadRegistrations]
  );

  const bulkSetStatus = React.useCallback(
    async (status: "pending" | "approved" | "rejected") => {
      if (selectedIds.length === 0) return;

      try {
        setBulkLoading(true);

        const res = await fetch("/api/admin/registrations/bulk", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ ids: selectedIds, status }),
        });

        const json = await res.json().catch(() => null);

        if (!res.ok || !json?.ok) {
          alert(json?.error || "Bulk update failed");
          return;
        }

        setSelectedIds([]);
        await loadRegistrations();
      } catch {
        alert("Network error");
      } finally {
        setBulkLoading(false);
      }
    },
    [selectedIds, loadRegistrations]
  );

  React.useEffect(() => {
    loadRegistrations();
  }, [loadRegistrations]);

  const filtered = React.useMemo(() => {
    return rows.filter((r) => {
      const q = filters.q.toLowerCase();

      const matchQ =
        !q ||
        r.primary.toLowerCase().includes(q) ||
        (r.secondary ?? "").toLowerCase().includes(q) ||
        (r.meta ?? "").toLowerCase().includes(q);

      const matchStatus = filters.status === "all" || r.status === filters.status;
      return matchQ && matchStatus;
    });
  }, [rows, filters.q, filters.status]);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">Event Registrations</h1>
        <p className="text-sm text-foreground/60">
          Review student registrations. Approve or reject after verification.
        </p>
      </div>
      <button
      onClick={() => {
        window.location.href = "/api/admin/registrations/export";
      }}
      className="rounded-lg border border-neutral-700 px-4 py-2 text-sm hover:bg-neutral-800"
    >
      Export Approved
    </button>

      <FiltersBar value={filters} onChange={setFilters} />

      {selectedIds.length > 0 && (
        <BulkActionsBar
          selectedCount={selectedIds.length}
          loading={bulkLoading}
          onClear={() => setSelectedIds([])}
          onApprove={() => bulkSetStatus("approved")}
          onReject={() => bulkSetStatus("rejected")}
          onPending={() => bulkSetStatus("pending")}
        />
      )}

      <div className="rounded-xl border border-border bg-card">
        {loading ? (
          <div className="p-6 text-sm text-foreground/60">Loading registrations...</div>
        ) : error ? (
          <div className="p-6 text-sm text-rose-300">{error}</div>
        ) : (
          <AdminTable
            rows={filtered}
            selectedIds={selectedIds}
            onSelectedIdsChange={setSelectedIds}
            columnsLabel={{
              primary: "Student",
              status: "Status",
              meta: "College / Phone / Event",
              actions: "Review",
            }}
            renderActions={(row) => (
              <>
                <button
                  type="button"
                  className="rounded-lg border border-border bg-background/40 px-3 py-1 text-xs hover:bg-background/60"
                  onClick={() => setOpenId(row.id)}
                >
                  View
                </button>

                {row.status === "pending" ? (
                  <>
                    <button
                      type="button"
                      className="rounded-lg border border-border bg-background/40 px-3 py-1 text-xs hover:bg-background/60"
                      onClick={() => setStatus(row.id, "approved")}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      className="rounded-lg border border-border bg-background/40 px-3 py-1 text-xs hover:bg-background/60"
                      onClick={() => setStatus(row.id, "rejected")}
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-foreground/50">—</span>
                )}
              </>
            )}
          />
        )}
      </div>

      <Modal
        open={!!openId}
        onClose={() => setOpenId(null)}
        title="Registration details"
        description="Verify student info before approving."
      >
        {active ? (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <div className="text-xs text-foreground/60">Full name</div>
                <div className="text-sm text-foreground">{active.full_name}</div>
              </div>

              <div>
                <div className="text-xs text-foreground/60">Status</div>
                <div className="text-sm text-foreground">{active.status}</div>
              </div>

              <div>
                <div className="text-xs text-foreground/60">Email</div>
                <div className="text-sm text-foreground">{active.email}</div>
              </div>

              <div>
                <div className="text-xs text-foreground/60">Phone</div>
                <div className="text-sm text-foreground">{active.phone || "—"}</div>
              </div>

              <div className="sm:col-span-2">
                <div className="text-xs text-foreground/60">College</div>
                <div className="text-sm text-foreground">{active.college || "—"}</div>
              </div>

              <div>
                <div className="text-xs text-foreground/60">Year</div>
                <div className="text-sm text-foreground">{active.year || "—"}</div>
              </div>

              <div>
                <div className="text-xs text-foreground/60">Roll number</div>
                <div className="text-sm text-foreground">{active.roll_number || "—"}</div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-background/30 px-3 py-2 text-xs text-foreground/60">
              <div>ID: {active.id}</div>
              <div>Event: {active.event_title ?? active.events?.title ?? "—"}</div>
              <div className="text-foreground/50">Event ID: {active.event_id}</div>
              <div>
                Submitted:{" "}
                {active.created_at ? new Date(active.created_at).toLocaleString() : "—"}
              </div>
              <div>
                Updated:{" "}
                {active.updated_at ? new Date(active.updated_at).toLocaleString() : "—"}
              </div>
              <div>Source: {active.source || "—"}</div>
            </div>

            <div className="flex flex-wrap gap-2">
              {active.status === "pending" ? (
                <>
                  <button
                    type="button"
                    className="rounded-xl border border-border bg-background/40 px-4 py-2 text-xs hover:bg-background/60"
                    onClick={async () => {
                      await setStatus(active.id, "approved");
                      setOpenId(null);
                    }}
                  >
                    Approve
                  </button>

                  <button
                    type="button"
                    className="rounded-xl border border-border bg-background/40 px-4 py-2 text-xs hover:bg-background/60"
                    onClick={async () => {
                      await setStatus(active.id, "rejected");
                      setOpenId(null);
                    }}
                  >
                    Reject
                  </button>
                </>
              ) : null}

              <button
                type="button"
                className="rounded-xl border border-border bg-background/40 px-4 py-2 text-xs hover:bg-background/60"
                onClick={() => setOpenId(null)}
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="text-sm text-foreground/60">No details found.</div>
        )}
      </Modal>
    </div>
  );
}