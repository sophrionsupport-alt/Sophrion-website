import * as React from "react";
import Link from "next/link";
import { BookOpen, Briefcase, Users, Sparkles, ArrowRight } from "lucide-react";
import { marketingContainerClass, marketingHeroClass } from "@/lib/marketing/layout";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function Page() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Cosmic atmosphere */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="[background:radial-gradient(1200px_circle_at_18%_12%,hsl(var(--ring)/0.22),transparent_45%),radial-gradient(1000px_circle_at_82%_36%,hsl(var(--cyan-500)/0.14),transparent_45%)] absolute inset-0" />
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className={marketingContainerClass}>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div
              className={marketingHeroClass}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/3 px-3 py-1 text-xs text-foreground/70 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--cyan-500))]" />
                STUDENTS
              </div>

              <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Build readiness that recruiters can trust
              </h1>

              <p className="mt-6 text-lg leading-relaxed text-foreground/75 sm:text-xl">
                Practice with structure, get measurable signals, and improve week
                by week — without clutter.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/events"
                  className={cn(
                    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white",
                    "bg-[linear-gradient(to_right,hsl(var(--brand-600)),hsl(var(--cyan-500)))]",
                    "shadow-[0_0_0_1px_rgba(255,255,255,0.12)] transition hover:opacity-95",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--background))]"
                  )}
                >
                  Explore events <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/contact"
                  className={cn(
                    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold",
                    "border border-white/10 bg-white/3 text-foreground/90 backdrop-blur",
                    "transition hover:bg-white/6",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--background))]"
                  )}
                >
                  Ask a question
                </Link>
              </div>

              {/* Upcoming */}
              <div className="mt-10">
                <div className="rounded-2xl border border-white/10 bg-white/3 p-5 backdrop-blur">
                  <div className="text-xs tracking-widest text-foreground/60">
                    UPCOMING
                  </div>
                  <div className="mt-2 text-lg font-semibold text-foreground">
                    Events & workshops are live on /events
                  </div>
                  <p className="mt-1 text-sm text-foreground/70">
                    Browse upcoming sessions, register, and track confirmations.
                  </p>
                  <div className="mt-3">
                    <Link
                      href="/events"
                      className="text-sm font-medium text-[hsl(var(--cyan-500))] hover:underline underline-offset-4"
                    >
                      View events
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Right visual */}
            <div
              className="rounded-3xl border border-white/10 bg-white/3 p-6 backdrop-blur"
            >
              <div className="mb-4">
                <div className="text-sm font-semibold text-foreground">
                  What you’ll get
                </div>
                <div className="mt-1 text-sm text-foreground/60">
                  Designed to be simple, structured, and high-signal.
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Feature
                  icon={BookOpen}
                  title="Structured practice"
                  body="Aptitude, DSA, communication — guided."
                />
                <Feature
                  icon={Users}
                  title="Mock rounds"
                  body="Feedback loops that actually move the needle."
                />
                <Feature
                  icon={Briefcase}
                  title="Placement pathway"
                  body="Clear milestones from start to interviews."
                />
                <Feature
                  icon={Sparkles}
                  title="Signals"
                  body="Simple readiness indicators — not noisy analytics."
                />
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-sm font-semibold text-foreground">
                  You don’t need more “content”.
                </div>
                <p className="mt-1 text-sm text-foreground/70">
                  You need a weekly system that builds outcomes. That’s what
                  Sophrion optimizes for.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 py-14">
        <div className={marketingContainerClass}>
          <div className="rounded-3xl border border-white/10 bg-white/3 p-6 backdrop-blur sm:p-10">
            <h2 className="text-2xl font-semibold text-foreground">
              Want your campus to run a focused program?
            </h2>
            <p className="mt-3 text-foreground/70">
              If you’re a student coordinator, connect us with your placement
              team — we’ll keep it simple.
            </p>
            <div className="mt-6">
              <Link
                href="/contact"
                className={cn(
                  "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white",
                  "bg-[linear-gradient(to_right,hsl(var(--brand-600)),hsl(var(--cyan-500)))]",
                  "shadow-[0_0_0_1px_rgba(255,255,255,0.12)] transition hover:opacity-95",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--background))]"
                )}
              >
                Contact Sophrion
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/3 p-5 backdrop-blur transition hover:bg-white/6">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/4">
        <Icon className="h-5 w-5 text-foreground" />
      </div>
      <div className="mt-3 text-sm font-semibold text-foreground">{title}</div>
      <div className="mt-1 text-sm text-foreground/70">{body}</div>
    </div>
  );
}