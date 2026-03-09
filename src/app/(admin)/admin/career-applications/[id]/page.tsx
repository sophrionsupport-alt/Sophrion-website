import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import StatusUpdater from "./status-updater";
import DeleteApplicationButton from "./delete-application-button";
import { type CareerApplication } from "@/types/careers";
function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function getApplication(id: string) {
  const supabase = supabaseAdmin();

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
      recruiter_notes,
      status,
      source,
      created_at,
      updated_at
      `
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch application:", error);
    return null;
  }

  return data;
}

function formatDate(date?: string | null) {
  if (!date) return "—";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

export default async function AdminCareerApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const application = await getApplication(id);

  if (!application) {
    notFound();
  }

  return (
    <main className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-white/40">
            Candidate profile
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-white">
            {application.full_name}
          </h1>
          <p className="mt-2 text-sm text-white/60">
            Review candidate details and move them through the hiring pipeline.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/career-applications"
          className="inline-flex rounded-xl border border-white/12 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/85"
        >
          Back to applications
        </Link>

        <DeleteApplicationButton id={application.id} />
      </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <section className="space-y-6 rounded-3xl border border-white/10 bg-white/3 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-white/40">
                Email
              </p>
              <p className="mt-1 text-sm text-white">{application.email || "—"}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-white/40">
                Phone
              </p>
              <p className="mt-1 text-sm text-white">{application.phone || "—"}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-white/40">
                Role
              </p>
              <p className="mt-1 text-sm text-white">
                {application.role_title_snapshot || "Builder Network"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-white/40">
                Submitted
              </p>
              <p className="mt-1 text-sm text-white">
                {formatDate(application.created_at)}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-white/40">
                College
              </p>
              <p className="mt-1 text-sm text-white">
                {application.college || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-white/40">
                Degree
              </p>
              <p className="mt-1 text-sm text-white">
                {application.degree || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-white/40">
                Graduation year
              </p>
              <p className="mt-1 text-sm text-white">
                {application.graduation_year || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-white/40">
                Source
              </p>
              <p className="mt-1 text-sm text-white">
                {application.source || "—"}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-white/40">
                LinkedIn
              </p>
              {application.linkedin_url ? (
                <a
                  href={application.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-block text-sm text-cyan-300 underline underline-offset-4"
                >
                  Open LinkedIn
                </a>
              ) : (
                <p className="mt-1 text-sm text-white">—</p>
              )}
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-white/40">
                Portfolio
              </p>
              {application.portfolio_url ? (
                <a
                  href={application.portfolio_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-block text-sm text-cyan-300 underline underline-offset-4"
                >
                  Open portfolio
                </a>
              ) : (
                <p className="mt-1 text-sm text-white">—</p>
              )}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-white/40">
              Why join
            </p>
            <div className="mt-2 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-7 text-white/85">
              {application.why_join || "—"}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-white/40">
              Cover letter
            </p>
            <div className="mt-2 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-7 text-white/85">
              {application.cover_letter || "—"}
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-white/10 bg-white/3 p-6">
            <h2 className="text-lg font-semibold text-white">Hiring status</h2>
            <p className="mt-2 text-sm text-white/60">
              Move the candidate across your review pipeline.
            </p>

            <div className="mt-5">
              <StatusUpdater
                id={application.id}
                status={application.status}
              />
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/3 p-6">
            <h2 className="text-lg font-semibold text-white">Resume</h2>
            <p className="mt-2 text-sm text-white/60">
              Open the uploaded candidate document.
            </p>

            <div className="mt-5">
              {application.resume_url ? (
                <a
                  href={application.resume_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-xl bg-linear-to-r from-violet-500 to-cyan-500 px-4 py-2.5 text-sm font-medium text-white"
                >
                  Open resume
                </a>
              ) : (
                <p className="text-sm text-white/60">No resume uploaded.</p>
              )}
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}