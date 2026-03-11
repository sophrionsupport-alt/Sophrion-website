"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";

import FiltersBar, { type FiltersState } from "@/components/admin/FiltersBar";
import BulkActionsBar from "@/components/admin/BulkActionsBar";
import AdminTable, { type AdminRow } from "@/components/admin/AdminTable";
import Modal from "@/components/ui/Modal";

type RegistrationKind = "team" | "individual";

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

type: RegistrationKind;
team_size?: number | null;

leader_name?: string | null;
leader_email?: string | null;
leader_phone?: string | null;

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
const [exporting, setExporting] = React.useState(false);

const [deleteId, setDeleteId] = React.useState<string | null>(null);

const active = raw.find((r) => r.id === deleteId) ?? null;

function getRegistrationById(id: string) {
return raw.find((r) => r.id === id) ?? null;
}

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
    setRaw([]);
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
        type === "team" ? `👥 ${r.full_name}` : `👤 ${r.full_name}`,
      secondary:
        type === "team"
          ? `${r.event_title ?? r.events?.title ?? ""} • ${
              r.team_size ?? 0
            } members`
          : r.email ?? "",
      status: r.status,
      meta:
        type === "team"
          ? [
              r.leader_name ? `Leader: ${r.leader_name}` : null,
              r.leader_email ?? null,
              r.college ?? null,
              r.event_title ?? r.events?.title ?? null,
            ]
              .filter(Boolean)
              .join(" • ")
          : [r.college, r.phone, r.event_title ?? r.events?.title ?? null]
              .filter(Boolean)
              .join(" • "),
    };
  });

  setRows(mapped);
} catch (err) {
  console.error("Failed loading registrations", err);
  setRaw([]);
  setRows([]);
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
const registration = getRegistrationById(id);


if (!registration) {
  alert("Registration not found");
  return;
}

const res = await fetch(
  `/api/admin/registrations/${id}?kind=${registration.type}`,
  {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ status }),
  }
);

const json = await res.json();

if (!res.ok || !json?.ok) {
  alert(json?.error || "Failed to update");
  return;
}

await loadRegistrations();

}

async function deleteRegistration(id: string) {
const registration = getRegistrationById(id);


if (!registration) {
  alert("Registration not found");
  return;
}

const res = await fetch(
  `/api/admin/registrations/${id}?kind=${registration.type}`,
  {
    method: "DELETE",
  }
);

const json = await res.json();

if (!res.ok || !json?.ok) {
  alert(json?.error || "Delete failed");
  return;
}

setDeleteId(null);
setSelectedIds((prev) => prev.filter((x) => x !== id));
setRows((prev) => prev.filter((r) => r.id !== id));
setRaw((prev) => prev.filter((r) => r.id !== id));


}

async function exportRegistrations() {
try {
setExporting(true);


  const params = new URLSearchParams();

  if (filters.q.trim()) params.set("q", filters.q.trim());
  if (filters.status !== "all") params.set("status", filters.status);
  if (filters.sort) params.set("sort", filters.sort);
  if (eventFilter) params.set("event_id", eventFilter);

  const res = await fetch(
    `/api/admin/registrations/export?${params.toString()}`
  );

  const blob = await res.blob();

  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "registrations-export.csv";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(url);
} catch (error) {
  console.error(error);
  alert("Failed to export registrations");
} finally {
  setExporting(false);
}


}

return ( <div className="space-y-6"> <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"> <div> <h1 className="text-2xl font-semibold">Event Registrations</h1> <p className="text-sm text-foreground/60">
Review and manage individual and team registrations. </p> </div>


    <button
      type="button"
      onClick={exportRegistrations}
      disabled={loading || exporting}
      className="rounded-xl border border-border px-4 py-2 text-xs"
    >
      {exporting ? "Exporting..." : "Export CSV"}
    </button>
  </div>

  <FiltersBar value={filters} onChange={setFilters} />

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
                  className="rounded-lg border border-green-500/40 bg-green-500/10 px-3 py-1 text-xs text-green-300"
                  onClick={() => updateStatus(row.id, "approved")}
                >
                  Approve
                </button>

                <button
                  className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-1 text-xs text-red-300"
                  onClick={() => updateStatus(row.id, "rejected")}
                >
                  Reject
                </button>
              </>
            )}

            {row.status === "approved" && (
              <button
                className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-1 text-xs text-red-300"
                onClick={() => updateStatus(row.id, "rejected")}
              >
                Reject
              </button>
            )}

            {row.status === "rejected" && (
              <button
                className="rounded-lg border border-green-500/40 bg-green-500/10 px-3 py-1 text-xs text-green-300"
                onClick={() => updateStatus(row.id, "approved")}
              >
                Approve
              </button>
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
