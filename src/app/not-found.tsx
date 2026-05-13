import Link from "next/link";
import { MARKETING } from "@/lib/marketing/links";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden bg-background px-4 py-20 text-center text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(800px circle at 50% 20%, hsl(var(--ring) / 0.2), transparent 55%)," +
            "radial-gradient(600px circle at 30% 80%, hsl(var(--cyan-500) / 0.12), transparent 50%)",
        }}
      />
      <div className="relative z-10 max-w-lg">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-foreground/55">404 ERROR</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="bg-linear-to-l from-[hsl(var(--brand-600))] to-[hsl(var(--cyan-500))] bg-clip-text text-transparent">
            Looks Like You Drifted Outside The Ecosystem
          </span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-foreground/70">
          The page you’re looking for may have been moved, redesigned, or doesn’t exist inside the current Sophrion architecture.
        </p>
        <p className="mt-3 text-xs text-foreground/50">Let’s get you back into the ecosystem.</p>
        <p className="mt-2 text-xs italic text-foreground/45">Even intelligent systems lose their way sometimes.</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={MARKETING.home}
            className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95"
            style={{ background: "linear-gradient(90deg, hsl(var(--brand-600)), hsl(var(--cyan-500)))" }}
          >
            Return Home
          </Link>
          <Link
            href={MARKETING.ecosystem}
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/3 px-4 py-2.5 text-sm font-semibold text-foreground/85 backdrop-blur transition hover:bg-white/6"
          >
            Explore Ecosystem
          </Link>
        </div>
      </div>
    </div>
  );
}
