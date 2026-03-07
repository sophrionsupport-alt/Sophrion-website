// src/components/careers/CareerHero.tsx
import Link from "next/link";

export default function CareerHero() {
  return (
    <section className="relative overflow-hidden rounded-4xl border border-white/10 bg-white/3 px-6 py-14 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] md:px-10 md:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background: `
            radial-gradient(700px circle at 15% 20%, rgba(99,102,241,0.20), transparent 40%),
            radial-gradient(600px circle at 85% 25%, rgba(34,211,238,0.16), transparent 35%),
            radial-gradient(900px circle at 50% 100%, rgba(168,85,247,0.12), transparent 45%)
          `,
        }}
      />

      <div className="relative mx-auto max-w-5xl">
        <div className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium tracking-wide text-cyan-200">
          Careers at Sophrion
        </div>

        <div className="mt-6 max-w-4xl">
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
            Build the future bridge between education and industry
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-white/70 md:text-lg">
            Sophrion is building systems that help students, colleges, and
            institutions become truly outcome-ready. We are looking for builders
            who want ownership, speed, and meaningful work.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="#open-roles"
            className="inline-flex items-center justify-center rounded-xl bg-linear-to-r from-violet-500 to-cyan-500 px-5 py-3 text-sm font-medium text-white transition hover:scale-[1.01]"
          >
            View open roles
          </Link>

          <Link
            href="/careers/apply"
            className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/4 px-5 py-3 text-sm font-medium text-white/85 transition hover:bg-white/[0.07]"
          >
            Join talent network
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            {
              label: "Mission-first",
              value: "Real work on meaningful systems",
            },
            {
              label: "High ownership",
              value: "Founding-stage speed and responsibility",
            },
            {
              label: "Builder culture",
              value: "Execution over bureaucracy",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur-sm"
            >
              <div className="text-xs uppercase tracking-[0.18em] text-white/45">
                {item.label}
              </div>
              <div className="mt-2 text-sm text-white/85">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}