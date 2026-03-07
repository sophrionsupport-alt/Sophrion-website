"use client";

import * as React from "react";

type TeamRow = {
  id: string;
  event_id: string;
  event_title: string | null;
  event_slug: string | null;
  team_name: string;
  leader_name: string;
  leader_email: string;
  leader_phone: string;
  college: string | null;
  team_size: number;
  created_at: string;
  updated_at: string;
};

type TeamMember = {
  id: string;
  member_name: string;
  member_email: string;
  member_phone: string;
  college: string | null;
  is_leader: boolean | null;
  created_at: string;
  updated_at: string;
};

type TeamDetail = {
  team: {
    id: string;
    event_id: string;
    team_name: string;
    leader_name: string;
    leader_email: string;
    leader_phone: string;
    college: string | null;
    created_at: string;
    updated_at: string;
    team_size: number;
  };
  event: {
    id: string | null;
    title: string | null;
    slug: string | null;
  };
  members: TeamMember[];
};

type ApiOk<T = unknown> = {
  ok: true;
  data?: T;
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

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function TeamDetailModal({
  open,
  onClose,
  teamId,
}: {
  open: boolean;
  onClose: () => void;
  teamId: string | null;
}) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [detail, setDetail] = React.useState<TeamDetail | null>(null);

  React.useEffect(() => {
    if (!open || !teamId) return;

    let active = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        setDetail(null);

        const res = await fetch(`/api/admin/teams/${teamId}`, {
          cache: "no-store",
        });

        const json = (await res.json().catch(() => null)) as ApiResp<TeamDetail> | null;

        if (!active) return;

        if (!res.ok || !json?.ok) {
          setError(
            json && "error" in json
              ? json.error || "Failed to load team details."
              : "Failed to load team details."
          );
          return;
        }

        setDetail(json.data ?? null);
      } catch (err) {
        console.error(err);
        if (active) setError("Failed to load team details.");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [open, teamId]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-4xl rounded-2xl border border-white/10 bg-[hsl(222_40%_9%)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Team Details</h2>
            <p className="text-sm text-white/60">
              Full submission details and member list.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-white/80 hover:bg-white/5"
          >
            Close
          </button>
        </div>

        <div className="max-h-[80vh] overflow-y-auto p-5">
          {loading ? (
            <div className="text-sm text-white/60">Loading team details...</div>
          ) : error ? (
            <div className="text-sm text-red-400">{error}</div>
          ) : !detail ? (
            <div className="text-sm text-white/60">No details found.</div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h3 className="mb-3 text-sm font-semibold text-white">Submission</h3>
                  <div className="space-y-2 text-sm text-white/80">
                    <div><span className="text-white/50">Team:</span> {detail.team.team_name}</div>
                    <div><span className="text-white/50">Event:</span> {detail.event.title ?? "—"}</div>
                    <div><span className="text-white/50">College:</span> {detail.team.college ?? "—"}</div>
                    <div><span className="text-white/50">Team size:</span> {detail.team.team_size}</div>
                    <div><span className="text-white/50">Submitted:</span> {fmtDate(detail.team.created_at)}</div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h3 className="mb-3 text-sm font-semibold text-white">Leader</h3>
                  <div className="space-y-2 text-sm text-white/80">
                    <div><span className="text-white/50">Name:</span> {detail.team.leader_name}</div>
                    <div><span className="text-white/50">Email:</span> {detail.team.leader_email}</div>
                    <div><span className="text-white/50">Phone:</span> {detail.team.leader_phone}</div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">Members</h3>
                  <span className="text-xs text-white/50">{detail.members.length} total</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="border-b border-white/10 text-white/60">
                      <tr>
                        <th className="px-3 py-2 font-medium">Role</th>
                        <th className="px-3 py-2 font-medium">Name</th>
                        <th className="px-3 py-2 font-medium">Email</th>
                        <th className="px-3 py-2 font-medium">Phone</th>
                        <th className="px-3 py-2 font-medium">College</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detail.members.map((member) => (
                        <tr key={member.id} className="border-b border-white/5">
                          <td className="px-3 py-3">
                            <span
                              className={cn(
                                "inline-flex rounded-full px-2 py-1 text-xs font-medium",
                                member.is_leader
                                  ? "bg-cyan-500/15 text-cyan-300"
                                  : "bg-violet-500/15 text-violet-300"
                              )}
                            >
                              {member.is_leader ? "Leader" : "Member"}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-white">{member.member_name}</td>
                          <td className="px-3 py-3 text-white/80">{member.member_email}</td>
                          <td className="px-3 py-3 text-white/80">{member.member_phone}</td>
                          <td className="px-3 py-3 text-white/80">{member.college ?? "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminTeamRegistrationsPage() {
  const [rows, setRows] = React.useState<TeamRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [q, setQ] = React.useState("");
  const [selectedTeamId, setSelectedTeamId] = React.useState<string | null>(null);

  const loadTeams = React.useCallback(async (query = "") => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());

      const qs = params.toString();
      const res = await fetch(`/api/admin/teams${qs ? `?${qs}` : ""}`, {
        cache: "no-store",
      });

      const json = (await res.json().catch(() => null)) as ApiResp<{
        rows: TeamRow[];
        count: number;
      }> | null;

      if (!res.ok || !json?.ok) {
        setRows([]);
        setError(
          json && "error" in json
            ? json.error || "Failed to load team registrations."
            : "Failed to load team registrations."
        );
        return;
      }

      setRows(json.data?.rows ?? []);
    } catch (err) {
      console.error(err);
      setRows([]);
      setError("Failed to load team registrations.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    loadTeams(q);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Team Registrations</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              View team submissions for hackathons, workshops, and multi-member events.
            </p>
          </div>

          <form onSubmit={onSearch} className="flex w-full max-w-md gap-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by team, leader, email, college"
              className="h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              className="h-10 rounded-xl bg-linear-to-r from-violet-500 to-cyan-500 px-4 text-sm font-medium text-white"
            >
              Search
            </button>
          </form>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-card shadow-lg">
          {loading ? (
            <div className="p-6 text-sm text-muted-foreground">Loading team registrations...</div>
          ) : error ? (
            <div className="p-6 text-sm text-red-400">{error}</div>
          ) : rows.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">No team registrations found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-white/10 bg-white/5">
                  <tr>
                    <th className="px-4 py-3 font-medium">Team</th>
                    <th className="px-4 py-3 font-medium">Event</th>
                    <th className="px-4 py-3 font-medium">Leader</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">College</th>
                    <th className="px-4 py-3 font-medium">Size</th>
                    <th className="px-4 py-3 font-medium">Submitted</th>
                    <th className="px-4 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} className="border-b border-white/5">
                      <td className="px-4 py-3 font-medium">{row.team_name}</td>
                      <td className="px-4 py-3">{row.event_title ?? "—"}</td>
                      <td className="px-4 py-3">{row.leader_name}</td>
                      <td className="px-4 py-3">{row.leader_email}</td>
                      <td className="px-4 py-3">{row.college ?? "—"}</td>
                      <td className="px-4 py-3">{row.team_size}</td>
                      <td className="px-4 py-3">{fmtDate(row.created_at)}</td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => setSelectedTeamId(row.id)}
                          className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-white/90 hover:bg-white/5"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <TeamDetailModal
        open={!!selectedTeamId}
        teamId={selectedTeamId}
        onClose={() => setSelectedTeamId(null)}
      />
    </div>
  );
}