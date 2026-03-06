"use client";

import * as React from "react";
import FiltersBar, { type FiltersState } from "@/components/admin/FiltersBar";
import BulkActionsBar from "@/components/admin/BulkActionsBar";
import AdminTable, { type AdminRow } from "@/components/admin/AdminTable";

type CollegeRequestRecord = {
  id: string;
  request_type: "college_onboarding" | "event_hosting";
  college_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  city: string | null;
  state: string | null;
  status: "new" | "in_review" | "approved" | "rejected";
  created_at: string;
};

function mapStatusToAdminStatus(s: CollegeRequestRecord["status"]): AdminRow["status"] {
  // AdminTable expects: pending|approved|rejected (based on your usage)
  if (s === "approved") return "approved";
  if (s === "rejected") return "rejected";
  return "pending"; // new or in_review
}

function formatMeta(r: CollegeRequestRecord) {
  const place = [r.city, r.state].filter(Boolean).join(", ");
  const contact = [r.contact_name, r.phone].filter(Boolean).join(" • ");
  return [place, contact].filter(Boolean).join(" • ");
}

export default function CollegeRequestsPage() {
  const [filters, setFilters] = React.useState<FiltersState>({
    q: "",
    status: "all",
    sort: "newest",
  });

  const [raw, setRaw] = React.useState<CollegeRequestRecord[]>([]);
  const [rows, setRows] = React.useState<AdminRow[]>([]);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);

  async function loadRequests() {
    try {
      setErr(null);
      setLoading(true);

      // API supports status filter (new/in_review/approved/rejected) in our earlier route
      const params = new URLSearchParams();
      if (filters.q.trim()) params.set("q", filters.q.trim()); // local filter only (API may ignore q)
      if (filters.status !== "all") params.set("status", filters.status);

      const res = await fetch(`/api/admin/college-requests?${params.toString()}`);
      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        setErr(json?.error || "Failed to load requests");
        return;
      }

      const list = (json.data.rows ?? []) as CollegeRequestRecord[];
      setRaw(list);

      const mapped: AdminRow[] = list.map((r) => ({
        id: r.id,
        primary: r.college_name,
        secondary: `${r.request_type === "event_hosting" ? "Event publishing" : "College onboarding"} • ${r.email}`,
        status: mapStatusToAdminStatus(r.status),
        meta: formatMeta(r),
      }));

      setRows(mapped);
    } catch (e) {
      console.error(e);
      setErr("Failed to load requests");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: CollegeRequestRecord["status"]) {
    try {
      const res = await fetch(`/api/admin/college-requests?id=${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) {
        alert(json?.error || "Failed to update status");
        return;
      }

      loadRequests();
    } catch {
      alert("Network error");
    }
  }

  React.useEffect(() => {
    loadRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status, filters.sort]);

  const filtered = rows.filter((r) => {
    const q = filters.q.toLowerCase().trim();
    if (!q) return true;
    return (
      r.primary.toLowerCase().includes(q) ||
      (r.secondary ?? "").toLowerCase().includes(q) ||
      (r.meta ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">College Requests</h1>
        <p className="text-sm text-foreground/60">
          Colleges request onboarding or event publishing. Review and update status.
        </p>
      </div>

      {/* Filters */}
      <FiltersBar
        value={filters}
        onChange={setFilters}
        placeholder="Search by college, email, city…"
      />

      {/* Bulk actions placeholder */}
      {selectedIds.length > 0 && (
        <BulkActionsBar selectedCount={selectedIds.length} onClear={() => setSelectedIds([])} />
      )}

      {/* Status quick actions */}
      <div className="flex flex-wrap gap-2">
        <button
          className="rounded-xl border border-border bg-card px-3 py-2 text-xs hover:bg-card/70"
          onClick={() => loadRequests()}
        >
          Refresh
        </button>

        {/* bulk status update (simple first cut) */}
        <button
          className="rounded-xl border border-border bg-card px-3 py-2 text-xs hover:bg-card/70 disabled:opacity-50"
          disabled={selectedIds.length === 0}
          onClick={() => selectedIds.forEach((id) => updateStatus(id, "in_review"))}
        >
          Mark In Review
        </button>
        <button
          className="rounded-xl border border-border bg-card px-3 py-2 text-xs hover:bg-card/70 disabled:opacity-50"
          disabled={selectedIds.length === 0}
          onClick={() => selectedIds.forEach((id) => updateStatus(id, "approved"))}
        >
          Approve
        </button>
        <button
          className="rounded-xl border border-border bg-card px-3 py-2 text-xs hover:bg-card/70 disabled:opacity-50"
          disabled={selectedIds.length === 0}
          onClick={() => selectedIds.forEach((id) => updateStatus(id, "rejected"))}
        >
          Reject
        </button>
      </div>

      {/* Table */}
      <AdminTable
            rows={filtered}
            selectedIds={selectedIds}
            onSelectedIdsChange={setSelectedIds}
            columnsLabel={{
                primary: "College",
                status: "Status",
                meta: "Location / Contact",
                actions: "Review",
            }}
            renderActions={(row) => (
                <>
                <button
                    className="rounded-lg border border-border bg-background/40 px-3 py-1 text-xs hover:bg-background/60"
                    onClick={() => updateStatus(row.id, "in_review")}
                >
                    In review
                </button>
                <button
                    className="rounded-lg border border-border bg-background/40 px-3 py-1 text-xs hover:bg-background/60"
                    onClick={() => updateStatus(row.id, "approved")}
                >
                    Approve
                </button>
                <button
                    className="rounded-lg border border-border bg-background/40 px-3 py-1 text-xs hover:bg-background/60"
                    onClick={() => updateStatus(row.id, "rejected")}
                >
                    Reject
                </button>
                </>
            )}
            />

      {/* Per-row actions (simple list below table) */}
      {!loading && !err && raw.length > 0 ? (
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-sm font-semibold text-foreground">Quick status actions</div>
          <div className="mt-3 grid gap-2">
            {raw.slice(0, 10).map((r) => (
              <div
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-background/30 px-3 py-2"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm text-foreground">{r.college_name}</div>
                  <div className="truncate text-xs text-foreground/60">
                    {r.email} • {r.request_type} • current: {r.status}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    className="rounded-lg border border-border px-3 py-1 text-xs hover:bg-card/60"
                    onClick={() => updateStatus(r.id, "in_review")}
                  >
                    In review
                  </button>
                  <button
                    className="rounded-lg border border-border px-3 py-1 text-xs hover:bg-card/60"
                    onClick={() => updateStatus(r.id, "approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="rounded-lg border border-border px-3 py-1 text-xs hover:bg-card/60"
                    onClick={() => updateStatus(r.id, "rejected")}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 text-xs text-foreground/50">
            Tip: Next enhancement is “Create College” / “Create Event” buttons that prefill forms from the request.
          </div>
        </div>
      ) : null}
    </div>
  );
}