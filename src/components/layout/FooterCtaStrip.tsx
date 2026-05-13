import Link from "next/link";
import { MARKETING } from "@/lib/marketing/links";

export default function FooterCtaStrip() {
  return (
    <section className="border-t border-white/10 bg-[hsl(var(--background)/0.92)] py-10 backdrop-blur-xl">

      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-4 px-4 text-center sm:px-6 lg:flex-row lg:justify-between lg:px-8 lg:text-left">

      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-center sm:px-6 lg:flex-row lg:justify-between lg:text-left">

        <div className="max-w-xl">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Build Beyond Traditional Learning
          </h2>
          <p className="mt-2 text-sm text-foreground/70">
            Enter an AI-native ecosystem designed for the future workforce, intelligent systems, and execution-driven careers.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href={MARKETING.join}
            className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95"
            style={{ background: "linear-gradient(90deg, hsl(var(--brand-600)), hsl(var(--cyan-500)))" }}
          >
            Join Ecosystem
          </Link>
          <Link
            href={`${MARKETING.contact}?topic=partnership`}
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/3 px-4 py-2.5 text-sm font-semibold text-foreground/85 backdrop-blur transition hover:bg-white/6"
          >
            Partner With Sophrion
          </Link>
        </div>
      </div>
    </section>
  );
}
