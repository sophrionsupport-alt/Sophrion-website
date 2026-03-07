// src/app/(site)/careers/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CareerDetail from "@/components/careers/CareerDetail";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CareerRole } from "@/types/careers";

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function getRoleBySlug(slug: string): Promise<CareerRole | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("career_roles")
    .select(
      `
      id,
      title,
      slug,
      team,
      location,
      employment_type,
      mode,
      short_description,
      description,
      responsibilities,
      requirements,
      nice_to_have,
      min_compensation,
      max_compensation,
      compensation_currency,
      is_open,
      is_published,
      sort_order,
      created_at,
      updated_at
      `
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch career role:", error);
    return null;
  }

  if (!data) return null;

  return {
    ...(data as CareerRole),
    responsibilities: Array.isArray(data.responsibilities)
      ? data.responsibilities
      : [],
    requirements: Array.isArray(data.requirements)
      ? data.requirements
      : [],
    nice_to_have: Array.isArray(data.nice_to_have) ? data.nice_to_have : [],
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const role = await getRoleBySlug(slug);

  if (!role) {
    return {
      title: "Role not found",
    };
  }

  return {
    title: `${role.title} | Careers`,
    description: role.short_description,
  };
}

export default async function CareerRolePage({ params }: PageProps) {
  const { slug } = await params;
  const role = await getRoleBySlug(slug);

  if (!role) {
    notFound();
  }

  return (
    <main className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background: `
            radial-gradient(900px circle at 0% 0%, rgba(99,102,241,0.10), transparent 35%),
            radial-gradient(700px circle at 100% 10%, rgba(34,211,238,0.08), transparent 30%)
          `,
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
        <div className="mb-8">
          <Link
            href="/careers"
            className="inline-flex items-center text-sm text-white/65 transition hover:text-white"
          >
            ← Back to careers
          </Link>
        </div>

        <CareerDetail role={role} />
      </div>
    </main>
  );
}