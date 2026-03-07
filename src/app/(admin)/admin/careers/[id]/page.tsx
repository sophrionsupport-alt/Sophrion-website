// src/app/(admin)/admin/careers/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import CareerRoleForm from "@/components/forms/CareerRoleForm";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CareerRole } from "@/types/careers";

type PageProps = {
  params: Promise<{ id: string }>;
};

async function getRole(id: string): Promise<CareerRole | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("career_roles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch admin role:", error);
    return null;
  }

  if (!data) return null;

  return {
    ...(data as CareerRole),
    responsibilities: Array.isArray(data.responsibilities)
      ? data.responsibilities
      : [],
    requirements: Array.isArray(data.requirements) ? data.requirements : [],
    nice_to_have: Array.isArray(data.nice_to_have) ? data.nice_to_have : [],
  };
}

export default async function AdminCareerEditPage({ params }: PageProps) {
  const { id } = await params;
  const role = await getRole(id);

  if (!role) notFound();

  return (
    <main className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/admin/careers"
          className="inline-flex items-center text-sm text-white/65 transition hover:text-white"
        >
          ← Back to careers
        </Link>

        <Link
          href={`/careers/${role.slug}`}
          target="_blank"
          className="inline-flex rounded-xl border border-white/12 bg-white/5 px-4 py-2 text-sm font-medium text-white/85"
        >
          View public page
        </Link>
      </div>

      <CareerRoleForm mode="edit" initialData={role} roleId={role.id} />
    </main>
  );
}