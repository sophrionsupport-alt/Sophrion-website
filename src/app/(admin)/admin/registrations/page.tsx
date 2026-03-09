"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";

import FiltersBar, { type FiltersState } from "@/components/admin/FiltersBar";
import BulkActionsBar from "@/components/admin/BulkActionsBar";
import AdminTable, { type AdminRow } from "@/components/admin/AdminTable";
import Modal from "@/components/ui/Modal";

type Registration = {
  id: string;
  event_id: string;

  event_title?: string | null;
  events?: { title?: string | null } | null;

  full_name: string;
  email: string | null;
  phone: string | null;
  college: string | null;

  year?: string | null;
  roll_number?: string | null;

  status: "pending" | "approved" | "rejected";

  type?: "team" | "individual";
  team_size?: number;

  created_at: string;
};

export default function RegistrationsPage() {
  const searchParams = useSearchParams();
  const eventFilter = searchParams.get("event_id");

  const [filters, setFilters] = React.useState<FiltersState>({
    q: "",
    status: "all",
    sort: "newest",
  });

  const [rows, setRows] = React.useState<AdminRow[]>([]);
  const [raw, setRaw] = React.useState<Registration[]>([]);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const active = raw.find((r) => r.id === deleteId) ?? null;

  async function loadRegistrations() {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (filters.q.trim()) params.set("q", filters.q.trim());
      if (filters.status !== "all") params.set("status", filters.status);
      if (filters.sort) params.set("sort", filters.sort);
      if (eventFilter) params.set("event_id", eventFilter);

      const res = await fetch(`/api/admin/registrations?${params.toString()}`, {
        cache: "no-store",
      });

      const json = await res.json();

      if (!res.ok || !json?.ok) {
        console.error(json?.error);
        setRows([]);
        return;
      }

      const list: Registration[] = json.data?.rows ?? [];

      setRaw(list);

      const mapped: AdminRow[] = list.map((r) => {
        const type = r.type ?? "individual";

        return {
          id: r.id,

          primary:
            type === "team"
              ? `👥 ${r.full_name}`
              : `👤 ${r.full_name}`,

          secondary:
            type === "team"
              ? `${r.event_title ?? r.events?.title ?? ""} • ${
                  r.team_size ?? 0
                } members`
              : r.email ?? "",

          status: r.status,

          meta:
            type === "team"
              ? "Team Registration"
              : [r.college, r.phone, r.event_title ?? r.events?.title ?? null]
                  .filter(Boolean)
                  .join(" • "),
        };
      });

      setRows(mapped);
    } catch (err) {
      console.error("Failed loading registrations", err);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    loadRegistrations();
  }, [filters, eventFilter]);

  async function updateStatus(
    id: string,
    status: "approved" | "rejected" | "pending"
  ) {
    const res = await fetch(`/api/admin/registrations/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status }),
    });

    const json = await res.json();

    if (!res.ok || !json?.ok) {
      alert(json?.error || "Failed to update");
      return;
    }

    await loadRegistrations();
  }

  async function deleteRegistration(id: string) {
    const res = await fetch(`/api/admin/registrations/${id}`, {
      method: "DELETE",
    });

    const json = await res.json();

    if (!res.ok || !json?.ok) {
      alert(json?.error || "Delete failed");
      return;
    }

    setDeleteId(null);

    setRows((prev) => prev.filter((r) => r.id !== id));
    setRaw((prev) => prev.filter((r) => r.id !== id));
  }

  async function bulkDelete() {
    if (selectedIds.length === 0) return;

    const confirmDelete = window.confirm(
      `Delete ${selectedIds.length} registrations?`
    );

    if (!confirmDelete) return;

    await Promise.all(
      selectedIds.map((id) =>
        fetch(`/api/admin/registrations/${id}`, { method: "DELETE" })
      )
    );

    setSelectedIds([]);

    await loadRegistrations();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Event Registrations</h1>
        <p className="text-sm text-foreground/60">
          Review and manage student registrations.
        </p>
      </div>

      <FiltersBar value={filters} onChange={setFilters} />

      {selectedIds.length > 0 && (
        <BulkActionsBar
          selectedCount={selectedIds.length}
          onClear={() => setSelectedIds([])}
          onApprove={() =>
            selectedIds.forEach((id) => updateStatus(id, "approved"))
          }
          onReject={() =>
            selectedIds.forEach((id) => updateStatus(id, "rejected"))
          }
          onPending={bulkDelete}
        />
      )}

      <div className="rounded-xl border border-border bg-card">
        {loading ? (
          <div className="p-6 text-sm text-foreground/60">
            Loading registrations...
          </div>
        ) : (
          <AdminTable
            rows={rows}
            selectedIds={selectedIds}
            onSelectedIdsChange={setSelectedIds}
            columnsLabel={{
              primary: "Registrant",
              status: "Status",
              meta: "Details",
              actions: "Actions",
            }}
            renderActions={(row) => (
              <>
                {row.status === "pending" && (
                  <>
                    <button
                      className="rounded-lg border border-border px-3 py-1 text-xs"
                      onClick={() => updateStatus(row.id, "approved")}
                    >
                      Approve
                    </button>

                    <button
                      className="rounded-lg border border-border px-3 py-1 text-xs"
                      onClick={() => updateStatus(row.id, "rejected")}
                    >
                      Reject
                    </button>
                  </>
                )}

                <button
                  className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-1 text-xs text-red-300"
                  onClick={() => setDeleteId(row.id)}
                >
                  Delete
                </button>
              </>
            )}
          />
        )}
      </div>

      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete registration"
      >
        {active && (
          <div className="space-y-4">
            <p className="text-sm">
              Delete registration for <b>{active.full_name}</b>?
            </p>

            <div className="flex gap-2">
              <button
                className="rounded-lg bg-red-600 px-4 py-2 text-xs text-white"
                onClick={() => deleteRegistration(active.id)}
              >
                Delete
              </button>

              <button
                className="rounded-lg border px-4 py-2 text-xs"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}