// src/app/(admin)/admin/career-applications/page.tsx
import Link from "next/link";
import {
  CAREER_APPLICATION_STATUSES,
  type CareerApplication,
} from "@/types/careers";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function getApplications(): Promise<CareerApplication[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("career_applications")
    .select(
      `
      id,
      role_id,
      role_title_snapshot,
      full_name,
      email,
      phone,
      college,
      degree,
      graduation_year,
      linkedin_url,
      portfolio_url,
      resume_url,
      why_join,
      cover_letter,
      status,
      source,
      created_at,
      updated_at
      `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch career applications:", error);
    return [];
  }

  return (data ?? []) as CareerApplication[];
}

function formatDate(date: string) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

function statusClass(status: string) {
  switch (status) {
    case "new":
      return "border-cyan-400/20 bg-cyan-400/10 text-cyan-300";
    case "reviewing":
      return "border-violet-400/20 bg-violet-400/10 text-violet-300";
    case "shortlisted":
      return "border-sky-400/20 bg-sky-400/10 text-sky-300";
    case "interviewing":
      return "border-amber-400/20 bg-amber-400/10 text-amber-300";
    case "selected":
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
    case "rejected":
      return "border-rose-400/20 bg-rose-400/10 text-rose-300";
    default:
      return "border-white/10 bg-white/[0.05] text-white/70";
  }
}

export const metadata = {
  title: "Career Applications",
};

export default async function AdminCareerApplicationsPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string; role?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const applications = await getApplications();

  const selectedStatus = sp.status ?? "all";
  const selectedRole = sp.role ?? "all";

  const roleOptions = Array.from(
    new Set(
      applications
        .map((app) => app.role_title_snapshot?.trim())
        .filter(Boolean) as string[]
    )
  ).sort((a, b) => a.localeCompare(b));

  const filtered = applications.filter((app) => {
    const matchesStatus =
      selectedStatus === "all" || app.status === selectedStatus;
    const matchesRole =
      selectedRole === "all" || app.role_title_snapshot === selectedRole;

    return matchesStatus && matchesRole;
  });

  return (
    <main className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-white">
          Career applications
        </h1>
        <p className="mt-2 text-sm text-white/60">
          Review candidate submissions and update hiring status.
        </p>
      </div>

      <form className="grid gap-4 rounded-3xl border border-white/10 bg-white/3 p-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-white/85">
            Filter by status
          </label>
          <select
            name="status"
            defaultValue={selectedStatus}
            className="h-11 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none"
          >
            <option value="all" className="bg-slate-950">
              All statuses
            </option>
            {CAREER_APPLICATION_STATUSES.map((status) => (
              <option key={status} value={status} className="bg-slate-950">
                {status}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-white/85">
            Filter by role
          </label>
          <select
            name="role"
            defaultValue={selectedRole}
            className="h-11 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none"
          >
            <option value="all" className="bg-slate-950">
              All roles
            </option>
            {roleOptions.map((role) => (
              <option key={role} value={role} className="bg-slate-950">
                {role}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="inline-flex rounded-xl bg-linear-to-r from-violet-500 to-cyan-500 px-5 py-3 text-sm font-medium text-white"
          >
            Apply filters
          </button>
        </div>
      </form>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/3">
        {filtered.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <h2 className="text-xl font-semibold text-white">
              No applications found
            </h2>
            <p className="mt-3 text-sm text-white/60">
              There are no applications matching the selected filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-white/10 bg-white/2 text-white/55">
                <tr>
                  <th className="px-5 py-4 font-medium">Candidate</th>
                  <th className="px-5 py-4 font-medium">Role</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium">Submitted</th>
                  <th className="px-5 py-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((app) => (
                  <tr
                    key={app.id}
                    className="border-b border-white/10 last:border-b-0"
                  >
                    <td className="px-5 py-4">
                      <div className="font-medium text-white">
                        {app.full_name}
                      </div>
                      <div className="mt-1 text-xs text-white/45">
                        {app.email}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-white/75">
                      {app.role_title_snapshot || "Builder Network"}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs ${statusClass(
                          app.status
                        )}`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-white/75">
                      {formatDate(app.created_at)}
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/career-applications/${app.id}`}
                        className="inline-flex rounded-lg border border-white/12 bg-white/5 px-3 py-2 text-xs font-medium text-white/85"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}