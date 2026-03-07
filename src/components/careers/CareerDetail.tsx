// src/components/careers/CareerDetail.tsx
import Link from "next/link";
import type { CareerRole } from "@/types/careers";

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/75">
      {children}
    </span>
  );
}

function formatCompensation(role: CareerRole) {
  const currency = role.compensation_currency || "INR";

  if (role.min_compensation == null && role.max_compensation == null) {
    return null;
  }

  if (
    role.min_compensation != null &&
    role.max_compensation != null &&
    role.min_compensation !== role.max_compensation
  ) {
    return `${currency} ${role.min_compensation.toLocaleString()} - ${role.max_compensation.toLocaleString()}`;
  }

  const value = role.max_compensation ?? role.min_compensation;
  return value != null ? `${currency} ${value.toLocaleString()}` : null;
}

function Section({
  title,
  items,
}: {
  title: string;
  items?: string[] | null;
}) {
  if (!items || items.length === 0) return null;

  return (
    <section className="rounded-3xl border border-white/10 bg-white/3 p-6 md:p-8">
      <h2 className="text-2xl font-semibold tracking-tight text-white">
        {title}
      </h2>

      <ul className="mt-5 space-y-3">
        {items.map((item, idx) => (
          <li
            key={`${title}-${idx}`}
            className="flex gap-3 text-sm leading-7 text-white/72"
          >
            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function CareerDetail({ role }: { role: CareerRole }) {
  const compensation = formatCompensation(role);
  const applyHref = `/careers/apply?role_id=${encodeURIComponent(
    role.id
  )}&role=${encodeURIComponent(role.title)}`;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_390px]">
        <div className="space-y-8">
          <section className="relative overflow-hidden rounded-4xl border border-white/10 bg-white/3 p-6 md:p-8 lg:p-10">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-90"
              style={{
                background: `
                  radial-gradient(700px circle at 10% 10%, rgba(99,102,241,0.18), transparent 40%),
                  radial-gradient(500px circle at 90% 20%, rgba(34,211,238,0.12), transparent 35%)
                `,
              }}
            />

            <div className="relative">
              <div className="flex flex-wrap gap-2">
                <Badge>{role.team}</Badge>
                <Badge>{role.employment_type}</Badge>
                <Badge>{role.mode}</Badge>
                {role.location ? <Badge>{role.location}</Badge> : null}
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                    role.is_open
                      ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                      : "border border-white/10 bg-white/4 text-white/55"
                  }`}
                >
                  {role.is_open ? "Applications open" : "Role closed"}
                </span>
              </div>

              <h1 className="mt-6 text-3xl font-semibold tracking-tight text-white md:text-5xl">
                {role.title}
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-7 text-white/70 md:text-lg">
                {role.short_description}
              </p>

              {compensation ? (
                <div className="mt-6 text-sm font-medium text-cyan-300/85">
                  Compensation: {compensation}
                </div>
              ) : null}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {role.is_open ? (
                  <Link
                    href={applyHref}
                    className="inline-flex items-center justify-center rounded-xl bg-linear-to-r from-violet-500 to-cyan-500 px-5 py-3 text-sm font-medium text-white"
                  >
                    Apply for this role
                  </Link>
                ) : (
                  <Link
                    href="/careers/apply"
                    className="inline-flex items-center justify-center rounded-xl bg-linear-to-r from-violet-500 to-cyan-500 px-5 py-3 text-sm font-medium text-white"
                  >
                    Join builder network
                  </Link>
                )}

                <Link
                  href="/careers"
                  className="inline-flex items-center justify-center rounded-xl border border-white/12 bg-white/4 px-5 py-3 text-sm font-medium text-white/85"
                >
                  Back to careers
                </Link>
              </div>
            </div>
          </section>

          {role.description ? (
            <section className="rounded-3xl border border-white/10 bg-white/3 p-6 md:p-8">
              <h2 className="text-2xl font-semibold tracking-tight text-white">
                Role summary
              </h2>
              <div className="mt-5 text-sm leading-7 text-white/72 whitespace-pre-line">
                {role.description}
              </div>
            </section>
          ) : null}

          <Section title="Responsibilities" items={role.responsibilities} />
          <Section title="Requirements" items={role.requirements} />
          <Section title="Nice to have" items={role.nice_to_have} />

          <section className="rounded-3xl border border-white/10 bg-white/3 p-6 md:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-white">
              About Sophrion
            </h2>
            <p className="mt-5 text-sm leading-7 text-white/72">
              Sophrion is building future-ready systems that connect education,
              institutions, and real-world opportunity. We care about clarity,
              execution, and work that creates lasting leverage. This is the
              right environment for people who want ownership and are serious
              about building meaningful systems.
            </p>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[1.75rem] border border-white/10 bg-white/3 p-6">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-300/80">
              Quick overview
            </p>

            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-white/40">
                  Team
                </div>
                <div className="mt-2 text-sm text-white/85">{role.team}</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-white/40">
                  Employment type
                </div>
                <div className="mt-2 text-sm text-white/85">
                  {role.employment_type}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-white/40">
                  Work mode
                </div>
                <div className="mt-2 text-sm text-white/85">{role.mode}</div>
              </div>

              {role.location ? (
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-white/40">
                    Location
                  </div>
                  <div className="mt-2 text-sm text-white/85">
                    {role.location}
                  </div>
                </div>
              ) : null}

              {compensation ? (
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-white/40">
                    Compensation
                  </div>
                  <div className="mt-2 text-sm text-white/85">
                    {compensation}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="mt-6">
              {role.is_open ? (
                <Link
                  href={applyHref}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-linear-to-r from-violet-500 to-cyan-500 px-5 py-3 text-sm font-medium text-white"
                >
                  Apply now
                </Link>
              ) : (
                <Link
                  href="/careers/apply"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-linear-to-r from-violet-500 to-cyan-500 px-5 py-3 text-sm font-medium text-white"
                >
                  Join builder network
                </Link>
              )}
            </div>

            <p className="mt-4 text-xs leading-6 text-white/50">
              We value clarity, ownership, and execution. Strong applicants are
              thoughtful, action-oriented, and serious about the mission.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}