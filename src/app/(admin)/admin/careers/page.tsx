// src/app/(admin)/admin/careers/page.tsx
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function getRoles() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("career_roles")
    .select(
      `
      id,
      title,
      slug,
      team,
      employment_type,
      mode,
      is_open,
      is_published,
      sort_order,
      created_at
      `
    )
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch admin career roles:", error);
    return [];
  }

  return data ?? [];
}

export const metadata = {
  title: "Admin Careers",
};

export default async function AdminCareersPage() {
  const roles = await getRoles();

  return (
    <main className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">Careers</h1>
          <p className="mt-2 text-sm text-white/60">
            Manage live roles, draft roles, and publish state.
          </p>
        </div>

        <Link
          href="/admin/careers/new"
          className="inline-flex items-center justify-center rounded-xl bg-linear-to-r from-violet-500 to-cyan-500 px-5 py-3 text-sm font-medium text-white"
        >
          New role
        </Link>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/3">
        {roles.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <h2 className="text-xl font-semibold text-white">No roles yet</h2>
            <p className="mt-3 text-sm text-white/60">
              Create your first career role to start hiring through Sophrion.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-white/10 bg-white/2 text-white/55">
                <tr>
                  <th className="px-5 py-4 font-medium">Title</th>
                  <th className="px-5 py-4 font-medium">Team</th>
                  <th className="px-5 py-4 font-medium">Type</th>
                  <th className="px-5 py-4 font-medium">Mode</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium">Sort</th>
                  <th className="px-5 py-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role.id} className="border-b border-white/10 last:border-b-0">
                    <td className="px-5 py-4">
                      <div className="font-medium text-white">{role.title}</div>
                      <div className="mt-1 text-xs text-white/45">{role.slug}</div>
                    </td>
                    <td className="px-5 py-4 text-white/75">{role.team}</td>
                    <td className="px-5 py-4 text-white/75">{role.employment_type}</td>
                    <td className="px-5 py-4 text-white/75">{role.mode}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs ${
                            role.is_published
                              ? "bg-emerald-400/10 text-emerald-300 border border-emerald-400/20"
                              : "bg-white/5 text-white/60 border border-white/10"
                          }`}
                        >
                          {role.is_published ? "Published" : "Draft"}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs ${
                            role.is_open
                              ? "bg-cyan-400/10 text-cyan-300 border border-cyan-400/20"
                              : "bg-white/5 text-white/60 border border-white/10"
                          }`}
                        >
                          {role.is_open ? "Open" : "Closed"}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-white/75">{role.sort_order}</td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/careers/${role.id}`}
                        className="inline-flex rounded-lg border border-white/12 bg-white/5 px-3 py-2 text-xs font-medium text-white/85"
                      >
                        Edit
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