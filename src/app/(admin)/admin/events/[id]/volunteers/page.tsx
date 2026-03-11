"use client";

import * as React from "react";
import { useParams } from "next/navigation";

type VolunteerRow = {
  id: string;
  event_id: string;
  full_name: string;
  email: string;
  can_scan: boolean;
  is_active: boolean;
  expires_at: string;
  created_at: string;
  updated_at: string;
};

type CreateResponse = {
  volunteer: VolunteerRow;
  tempCode: string;
};

type ListResponse = {
  rows: VolunteerRow[];
};

function toIsoFromDatetimeLocal(value: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString();
}

function isExpired(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  return date.getTime() < Date.now();
}

export default function EventVolunteersPage() {
  const params = useParams<{ id: string }>();
  const eventId = params?.id ?? "";

  const [rows, setRows] = React.useState<VolunteerRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [expiresAt, setExpiresAt] = React.useState("");
  const [latestCode, setLatestCode] = React.useState<string | null>(null);

  async function loadVolunteers() {
    if (!eventId) {
      setRows([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`/api/admin/events/${eventId}/volunteers`, {
        cache: "no-store",
      });

      const json = await res.json();

      if (!res.ok || !json?.ok) {
        alert(json?.error || "Failed to load volunteers");
        setRows([]);
        return;
      }

      const data = (json.data ?? {}) as ListResponse;
      setRows(Array.isArray(data.rows) ? data.rows : []);
    } catch (error) {
      console.error(error);
      alert("Failed to load volunteers");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    loadVolunteers();
  }, [eventId]);

  async function createVolunteer(e: React.FormEvent) {
    e.preventDefault();

    if (!eventId) {
      alert("Missing event id.");
      return;
    }

    const expiresAtIso = toIsoFromDatetimeLocal(expiresAt);

    if (!expiresAtIso) {
      alert("Please provide a valid expiry date and time.");
      return;
    }

    try {
      setSaving(true);
      setLatestCode(null);

      const res = await fetch(`/api/admin/events/${eventId}/volunteers`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          expiresAt: expiresAtIso,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json?.ok) {
        alert(json?.error || "Failed to create volunteer");
        return;
      }

      const data = json.data as CreateResponse;

      setLatestCode(data.tempCode);
      setFullName("");
      setEmail("");
      setExpiresAt("");

      await loadVolunteers();
    } catch (error) {
      console.error(error);
      alert("Failed to create volunteer");
    } finally {
      setSaving(false);
    }
  }

  async function toggleVolunteer(row: VolunteerRow) {
    if (!eventId) {
      alert("Missing event id.");
      return;
    }

    try {
      const res = await fetch(
        `/api/admin/events/${eventId}/volunteers/${row.id}`,
        {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            is_active: !row.is_active,
            can_scan: !row.is_active,
          }),
        }
      );

      const json = await res.json();

      if (!res.ok || !json?.ok) {
        alert(json?.error || "Failed to update volunteer");
        return;
      }

      await loadVolunteers();
    } catch (error) {
      console.error(error);
      alert("Failed to update volunteer");
    }
  }

  async function revokeVolunteer(row: VolunteerRow) {
    if (!eventId) {
      alert("Missing event id.");
      return;
    }

    const confirmed = window.confirm(
      `Revoke scanner access for ${row.full_name}?`
    );

    if (!confirmed) return;

    try {
      const res = await fetch(
        `/api/admin/events/${eventId}/volunteers/${row.id}`,
        {
          method: "DELETE",
        }
      );

      const json = await res.json();

      if (!res.ok || !json?.ok) {
        alert(json?.error || "Failed to revoke volunteer");
        return;
      }

      await loadVolunteers();
    } catch (error) {
      console.error(error);
      alert("Failed to revoke volunteer");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Volunteer Scanner Access</h1>
        <p className="mt-1 text-sm text-foreground/60">
          Create temporary event-scoped scanner access for volunteers.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <form onSubmit={createVolunteer} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Volunteer Name</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter full name"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Volunteer Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Expires At</label>
            <input
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
              required
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={saving || !eventId}
              className="inline-flex rounded-xl border border-border bg-foreground px-5 py-3 text-sm text-background disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create Volunteer Access"}
            </button>
          </div>
        </form>

        {latestCode && (
          <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            <div className="text-sm font-medium text-emerald-200">
              Temporary code generated
            </div>
            <div className="mt-1 font-mono text-lg text-emerald-100">
              {latestCode}
            </div>
            <div className="mt-1 text-xs text-emerald-100/80">
              Share this once with the volunteer. It will not be shown again.
            </div>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-card">
        {loading ? (
          <div className="p-6 text-sm text-foreground/60">
            Loading volunteers...
          </div>
        ) : rows.length === 0 ? (
          <div className="p-6 text-sm text-foreground/60">
            No volunteer scanner access created yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr className="text-left">
                  <th className="px-4 py-3">Volunteer</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Expires</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const expired = isExpired(row.expires_at);
                  const activeUsable = row.is_active && row.can_scan && !expired;

                  return (
                    <tr key={row.id} className="border-b border-border/60">
                      <td className="px-4 py-3 font-medium">{row.full_name}</td>
                      <td className="px-4 py-3 text-foreground/70">
                        {row.email}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full border px-2 py-0.5 text-xs ${
                            activeUsable
                              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                              : expired
                              ? "border-amber-500/30 bg-amber-500/10 text-amber-200"
                              : "border-red-500/30 bg-red-500/10 text-red-200"
                          }`}
                        >
                          {activeUsable
                            ? "Active"
                            : expired
                            ? "Expired"
                            : "Revoked"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-foreground/70">
                        {new Date(row.expires_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => toggleVolunteer(row)}
                            className="rounded-lg border border-border px-3 py-1 text-xs"
                          >
                            {row.is_active ? "Disable" : "Enable"}
                          </button>

                          <button
                            onClick={() => revokeVolunteer(row)}
                            className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-1 text-xs text-red-300"
                          >
                            Revoke
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}