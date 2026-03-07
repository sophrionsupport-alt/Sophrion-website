// src/app/(site)/careers/apply/page.tsx
import Link from "next/link";
import type { Metadata } from "next";
import CareerApplyForm from "@/components/forms/CareerApplyForm";

export const metadata: Metadata = {
  title: "Apply | Careers",
  description:
    "Apply to Sophrion for an open role or join the builder network.",
};

type PageProps = {
  searchParams: Promise<{
    role_id?: string;
    role?: string;
  }>;
};

export default async function CareersApplyPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const roleId = sp.role_id ?? null;
  const roleTitle = sp.role ?? null;

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

      <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-4 py-10 sm:px-6 md:py-14 lg:px-8">
        <div>
          <Link
            href={roleTitle ? "/careers" : "/careers"}
            className="inline-flex items-center text-sm text-white/65 transition hover:text-white"
          >
            ← Back to careers
          </Link>
        </div>

        <section className="rounded-4xl border border-white/10 bg-white/3 px-6 py-10 md:px-8 md:py-12">
          <div className="max-w-4xl">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-300/80">
              Sophrion careers
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-5xl">
              {roleTitle
                ? `Application for ${roleTitle}`
                : "Join the Sophrion builder network"}
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-7 text-white/65">
              {roleTitle
                ? "Use this form to apply for the selected role. Be direct, thoughtful, and clear about why you are a strong fit."
                : "Do not wait for a perfect role title if you know you can contribute. We are open to strong builders across product, growth, engineering, design, operations, and partnerships."}
            </p>
          </div>
        </section>

        <CareerApplyForm
          roleId={roleId}
          roleTitle={roleTitle}
          source={roleTitle ? "career_role_page" : "builder_network"}
        />
      </div>
    </main>
  );
}