import Link from "next/link";
import { MARKETING } from "@/lib/marketing/links";

export default function FooterCtaStrip() {
  return (
    <section className="relative border-t border-white/[0.08] py-12 backdrop-blur-xl">
      {/* Glass background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, hsl(var(--background) / 0.94), hsl(var(--background) / 0.88))",
        }}
      />

      {/* Top edge glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 15%, hsl(var(--glow-purple) / 0.2) 35%, hsl(var(--glow-cyan) / 0.25) 50%, hsl(var(--glow-purple) / 0.2) 65%, transparent 85%)",
        }}
      />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 text-center sm:px-6 lg:flex-row lg:justify-between lg:text-left">
        <div className="max-w-xl">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Build Beyond Traditional Learning
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-foreground/70">
            Enter an AI-native ecosystem designed for the future workforce, intelligent systems, and execution-driven careers.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href={MARKETING.join}
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_24px_-4px_hsl(var(--cyan-500)/0.4),0_0_12px_-2px_hsl(var(--brand-600)/0.25)]"
            style={{ background: "linear-gradient(90deg, hsl(var(--brand-600)), hsl(var(--cyan-500)))" }}
          >
            <span className="relative z-10">Join Ecosystem</span>
            <span
              aria-hidden="true"
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.12] to-transparent transition-transform duration-700 group-hover:translate-x-full"
            />
          </Link>
          <Link
            href={`${MARKETING.contact}?topic=partnership`}
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-semibold text-foreground/85 backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.15] hover:scale-[1.02]"
          >
            Partner With Sophrion
          </Link>
        </div>
      </div>
    </section>
  );
}
