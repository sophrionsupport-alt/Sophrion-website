// src/app/(site)/careers/page.tsx
import Link from "next/link";
import CareerHero from "@/components/careers/CareerHero";
import CareersList from "@/components/careers/CareersList";
import WhyJoin from "@/components/careers/WhyJoin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CareerRoleListItem } from "@/types/careers";

export const metadata = {
  title: "Careers",
  description:
    "Join Sophrion and help build future-ready systems connecting education and industry.",
};

async function getPublishedRoles(): Promise<CareerRoleListItem[]> {
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
      min_compensation,
      max_compensation,
      compensation_currency,
      is_open,
      is_published,
      sort_order,
      created_at
      `
    )
    .eq("is_published", true)
    .eq("is_open", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch career roles:", error);
    return [];
  }

  return (data ?? []) as CareerRoleListItem[];
}

export default async function CareersPage() {
  const roles = await getPublishedRoles();

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

      <div className="relative mx-auto flex max-w-7xl flex-col gap-20 px-4 py-10 sm:px-6 md:py-14 lg:px-8">
        <CareerHero />
        <WhyJoin />
        <CareersList roles={roles} />

        <section className="mx-auto max-w-6xl">
          <div className="rounded-4xl border border-white/10 bg-white/3 px-6 py-10 md:px-10 md:py-12">
            <div className="max-w-3xl">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-300/80">
                Builder network
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                Don’t see the exact role? Reach out anyway.
              </h2>
              <p className="mt-4 text-base leading-7 text-white/65">
                Early-stage hiring is not always linear. If you believe you can
                contribute meaningfully to Sophrion, submit a general
                application and tell us where you can create leverage.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/careers/apply"
                className="inline-flex items-center justify-center rounded-xl bg-linear-to-r from-violet-500 to-cyan-500 px-5 py-3 text-sm font-medium text-white"
              >
                Apply to builder network
              </Link>

              <a
                href="#open-roles"
                className="inline-flex items-center justify-center rounded-xl border border-white/12 bg-white/4 px-5 py-3 text-sm font-medium text-white/85"
              >
                Browse open roles
              </a>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                title: "Application review",
                text: "We review for ownership, clarity, motivation, and role fit rather than polished buzzwords.",
              },
              {
                title: "Interview process",
                text: "Expect practical conversations focused on thinking, execution ability, and alignment with how we build.",
              },
              {
                title: "Internships and contributors",
                text: "We are open to interns, contributors, and high-potential early builders where there is strong alignment.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-white/10 bg-white/3 p-6"
              >
                <h3 className="text-lg font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-white/65">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}