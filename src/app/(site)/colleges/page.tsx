"use client";

import * as React from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { LayoutDashboard, BookOpen, Users, ShieldCheck } from "lucide-react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function Page() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Atmosphere */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[18%] top-[10%] h-250 w-250 rounded-full bg-[radial-gradient(closest-side,hsl(var(--ring)/0.20),transparent_70%)]" />
        <div className="absolute right-[10%] top-[28%] h-250 w-250 rounded-full bg-[radial-gradient(closest-side,hsl(var(--cyan-500)/0.14),transparent_70%)]" />
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <p className="text-xs tracking-[0.25em] text-foreground/60">
                COLLEGES
              </p>

              <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
                Readiness infrastructure for placement teams
              </h1>

              <p className="mt-4 leading-relaxed text-foreground/70">
                A measurable, repeatable system your institution can run across
                departments and batches — without complex dashboards.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                {/* Primary CTA */}
                <Link
                  href="/contact"
                  className={cn(
                    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white",
                    "bg-linear-to-r from-[hsl(var(--brand-600))] to-[hsl(var(--cyan-500))]",
                    "transition hover:opacity-90"
                  )}
                >
                  Partner with Sophrion
                </Link>

                {/* Secondary CTA */}
                <Link
                  href="/events"
                  className={cn(
                    "inline-flex items-center justify-center rounded-xl border border-border",
                    "bg-white/3 px-4 py-2 text-sm font-semibold text-foreground backdrop-blur",
                    "transition hover:bg-white/5"
                  )}
                >
                  View events
                </Link>
              </div>

              {/* Upcoming card */}
              <div className="mt-10">
                <div className="rounded-2xl border border-border bg-white/3 p-5 backdrop-blur">
                  <div className="text-xs tracking-widest text-foreground/60">
                    UPCOMING
                  </div>

                  <div className="mt-2 text-lg font-semibold text-foreground">
                    Workshops & drives are listed on /events
                  </div>

                  <p className="mt-1 text-sm text-foreground/70">
                    Coordinate campus sessions and track registrations.
                  </p>

                  <div className="mt-3">
                    <Link
                      href="/events"
                      className="text-sm font-medium text-foreground underline underline-offset-4 decoration-foreground/40 hover:decoration-foreground"
                    >
                      Explore events
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="rounded-3xl border border-border bg-card p-6"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Feature icon={LayoutDashboard} title="Simple reporting" body="Readable signals for coordinators." />
                <Feature icon={BookOpen} title="CRT pathways" body="Structured readiness milestones." />
                <Feature icon={Users} title="Execution support" body="Programs your team can run." />
                <Feature icon={ShieldCheck} title="Institution-grade" body="Repeatable processes and clarity." />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-border bg-white/3 p-6 backdrop-blur sm:p-10">
            <h2 className="text-2xl font-semibold text-foreground">
              Want a rollout plan that doesn’t disrupt your calendar?
            </h2>

            <p className="mt-3 text-foreground/70">
              Share your batch size + constraints. We’ll propose a clean rollout
              timeline.
            </p>

            <div className="mt-6 flex gap-3">
              <Link
                href="/contact"
                className={cn(
                  "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white",
                  "bg-linear-to-r from-[hsl(var(--brand-600))] to-[hsl(var(--cyan-500))]",
                  "transition hover:opacity-90"
                )}
              >
                Start a conversation
              </Link>
              
              <Link
                href="/colleges/request"
                className={cn(
                  "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white",
                  "bg-linear-to-r from-[hsl(var(--brand-600))] to-[hsl(var(--cyan-500))]",
                  "transition hover:opacity-90"
                )}
              >
                Publish your college event
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
    <div className="rounded-2xl border border-border bg-white/3 p-5 backdrop-blur transition hover:bg-white/5">
      <Icon className="h-5 w-5 text-foreground" />
      <div className="mt-3 text-sm font-semibold text-foreground">{title}</div>
      <div className="mt-1 text-sm text-foreground/70">{body}</div>

      <div className="mt-4 h-px w-full bg-linear-to-r from-[hsl(var(--brand-600))/0.0] via-[hsl(var(--brand-600))/0.30] to-[hsl(var(--cyan-500))/0.0] opacity-0 transition group-hover:opacity-100" />
    </div>
  );
}