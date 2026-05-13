"use client";

import * as React from "react";
import FiltersBar, { type FiltersState } from "@/components/admin/FiltersBar";
import BulkActionsBar from "@/components/admin/BulkActionsBar";
import AdminTable, { type AdminRow } from "@/components/admin/AdminTable";

type CollegeRecord = {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
  website: string | null;
  status: "active" | "inactive";
  created_at: string;
};

type ApiOk<T = unknown> = { ok: true; data?: T; message?: string };
type ApiFail = { ok: false; error?: string; message?: string };
type ApiResp<T = unknown> = ApiOk<T> | ApiFail;

/**
 * Reuse FiltersBar's status values:
 * - pending  -> active
 * - rejected -> inactive
 * - all/approved -> all
 */
function mapStatus(s: FiltersState["status"]): "all" | "active" | "inactive" {
  if (s === "pending") return "active";
  if (s === "rejected") return "inactive";
  return "all";
}

function fmtDate(s?: string | null) {
  if (!s) return "";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString();
}

export default function CollegesPage() {
  const [filters, setFilters] = React.useState<FiltersState>({
    q: "",
    status: "all",
    sort: "newest",
  });

  const [rows, setRows] = React.useState<AdminRow[]>([]);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);

  async function loadColleges() {
    try {
      setLoading(true);

      const qs = new URLSearchParams();
      if (filters.q.trim()) qs.set("q", filters.q.trim());
      qs.set("status", mapStatus(filters.status));
      qs.set("sort", filters.sort);

      const res = await fetch(`/api/admin/colleges?${qs.toString()}`);
      const json = (await res.json()) as ApiResp<CollegeRecord[]>;

      if (!json.ok) throw new Error(json.error || "Failed to load colleges");

      const list = json.data ?? [];

      const mapped: AdminRow[] = list.map((c) => ({
        id: c.id,
        primary: c.name,
        secondary: c.website ?? "",
        // Map to your AdminRowStatus union:
        // active -> approved, inactive -> rejected
        status: c.status === "active" ? "approved" : "rejected",
        meta: [c.city, c.state].filter(Boolean).join(", "),
        actions: [
          {
            label: c.status === "active" ? "Disable" : "Enable",
            onClick: async () => {
              await toggleStatus(c.id, c.status === "active" ? "inactive" : "active");
            },
          },
          {
            label: "Created",
            onClick: () => {
              // optional: quick info action, harmless
              alert(fmtDate(c.created_at));
            },
          },
        ],
      }));

      setRows(mapped);
    } catch (err) {
      console.error("Failed to load colleges", err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  async function toggleStatus(id: string, status: "active" | "inactive") {
    const res = await fetch(`/api/admin/colleges/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const json = (await res.json()) as ApiResp;
    if (!json.ok) throw new Error(json.error || "Update failed");
    await loadColleges();
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  }

  React.useEffect(() => {
    loadColleges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.q, filters.status, filters.sort]);

  // Since server already filters by q/status, we only keep client-side safety filtering minimal
  const filtered = rows;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">Colleges</h1>
        <p className="text-sm text-foreground/60">
          Manage partner colleges. Disable a college to hide it from active operations.
        </p>
      </div>

      {/* Filters */}
      <FiltersBar
        value={filters}
        onChange={setFilters}
        placeholder="Search by college, city, state, website…"
      />

      {/* Bulk actions */}
      {selectedIds.length > 0 && (
        <BulkActionsBar
          selectedCount={selectedIds.length}
          onClear={() => setSelectedIds([])}
          // If your BulkActionsBar supports buttons, you can add bulk enable/disable later.
        />
      )}

      {/* Table */}
      <div className="rounded-xl border border-border bg-card">
        {loading ? (
          <div className="p-6 text-sm text-foreground/60">Loading colleges...</div>
        ) : (
          <AdminTable
            rows={filtered}
            selectedIds={selectedIds}
            onSelectedIdsChange={setSelectedIds}
            columnsLabel={{
              primary: "College",
              status: "Status",
              meta: "City / State",
              actions: "Actions",
            }}
          />
        )}
      </div>
    </div>
  );
}