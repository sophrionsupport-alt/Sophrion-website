// src/app/(admin)/admin/career-applications/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CareerApplication } from "@/types/careers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import StatusUpdater from "./status-updater";

type PageProps = {
  params: Promise<{ id: string }>;
};

async function getApplication(id: string): Promise<CareerApplication | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("career_applications")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch career application:", error);
    return null;
  }

  return (data as CareerApplication | null) ?? null;
}

function fmtDate(date?: string | null) {
  if (!date) return "—";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="text-xs uppercase tracking-[0.18em] text-white/40">
        {label}
      </div>
      <div className="mt-2 wrap-break-word text-sm leading-6 text-white/85">
        {value?.trim() ? value : "—"}
      </div>
    </div>
  );
}

export default async function AdminCareerApplicationDetailPage({
  params,
}: PageProps) {
  const { id } = await params;
  const application = await getApplication(id);

  if (!application) notFound();

  return (
    <main className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/career-applications"
            className="inline-flex items-center text-sm text-white/65 transition hover:text-white"
          >
            ← Back to applications
          </Link>
          <h1 className="mt-4 text-3xl font-semibold text-white">
            {application.full_name}
          </h1>
          <p className="mt-2 text-sm text-white/60">
            {application.role_title_snapshot || "Builder Network"} • Submitted{" "}
            {fmtDate(application.created_at)}
          </p>
        </div>
      </div>

      <StatusUpdater id={application.id} currentStatus={application.status} />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <InfoCard label="Email" value={application.email} />
        <InfoCard label="Phone" value={application.phone} />
        <InfoCard label="College" value={application.college} />
        <InfoCard label="Degree" value={application.degree} />
        <InfoCard label="Graduation Year" value={application.graduation_year} />
        <InfoCard label="Source" value={application.source} />
        <InfoCard label="LinkedIn" value={application.linkedin_url} />
        <InfoCard label="Portfolio" value={application.portfolio_url} />
        <InfoCard label="Resume URL" value={application.resume_url} />
      </div>

      <section className="rounded-3xl border border-white/10 bg-white/3 p-6 md:p-8">
        <h2 className="text-2xl font-semibold text-white">Why Sophrion</h2>
        <div className="mt-5 whitespace-pre-line text-sm leading-7 text-white/75">
          {application.why_join?.trim() || "—"}
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/3 p-6 md:p-8">
        <h2 className="text-2xl font-semibold text-white">
          Additional information
        </h2>
        <div className="mt-5 whitespace-pre-line text-sm leading-7 text-white/75">
          {application.cover_letter?.trim() || "—"}
        </div>
      </section>
    </main>
  );
}