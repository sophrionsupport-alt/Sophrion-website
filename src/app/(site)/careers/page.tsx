"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";

type Role = {
  title: string;
  type: string;
  location: string;
  description: string;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function Page() {
  const [open, setOpen] = React.useState<number | null>(0);

  const roles: Role[] = [
    {
      title: "Full-stack Engineer",
      type: "Full-time / Contract",
      location: "Hybrid — Hyderabad",
      description:
        "Build the core platform (Next.js + Supabase), ship fast, and keep it production-grade.",
    },
    {
      title: "Campus Partnerships (BD)",
      type: "Full-time / Part-time",
      location: "India",
      description:
        "Work with placement teams and student coordinators to scale programs across campuses.",
    },
    {
      title: "Program Ops",
      type: "Contract",
      location: "Remote",
      description:
        "Run execution: scheduling, cohorts, communications, and reporting loops — clean and consistent.",
    },
  ];

  return (
    <div className="relative bg-background py-14 text-foreground sm:py-20">
      {/* Atmospheric glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[18%] top-[10%] h-225 w-225 rounded-full bg-[radial-gradient(closest-side,hsl(var(--ring)/0.20),transparent_70%)]" />
        <div className="absolute right-[10%] top-[30%] h-225 w-225 rounded-full bg-[radial-gradient(closest-side,hsl(var(--cyan-500)/0.12),transparent_70%)]" />
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <p className="text-sm font-semibold tracking-wide text-foreground/70">
            Careers
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Build{" "}
            <span className="bg-linear-to-r from-[hsl(var(--brand-600))] to-[hsl(var(--cyan-500))] bg-clip-text text-transparent">
              institutional readiness
            </span>{" "}
            infrastructure
          </h1>

          <p className="mt-4 text-foreground/70">
            Own a real slice. Ship. Iterate. Measure. We build systems that
            colleges can run consistently — and students can trust.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            {/* Primary CTA */}
            <Link
              href="/careers/apply"
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white",
                "bg-linear-to-r from-[hsl(var(--brand-600))] to-[hsl(var(--cyan-500))]",
                "transition hover:opacity-90"
              )}
            >
              Apply now <ArrowRight className="h-4 w-4" />
            </Link>

            {/* Secondary CTA */}
            <Link
              href="/contact"
              className={cn(
                "inline-flex items-center justify-center rounded-xl border border-border",
                "bg-white/3 px-4 py-2 text-sm font-semibold text-foreground backdrop-blur",
                "transition hover:bg-white/5"
              )}
            >
              Ask about roles
            </Link>
          </div>
        </motion.div>

        <div className="mt-12 space-y-4">
          {roles.map((r, idx) => {
            const isOpen = open === idx;

            return (
              <div
                key={r.title}
                className="rounded-3xl border border-border bg-card"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <div className="min-w-0">
                    <div className="text-base font-semibold text-foreground">
                      {r.title}
                    </div>
                    <div className="mt-1 text-sm text-foreground/60">
                      {r.type} • {r.location}
                    </div>
                  </div>

                  <ChevronDown
                    className={cn(
                      "h-5 w-5 shrink-0 text-foreground/60 transition",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden px-6 pb-6"
                    >
                      <p className="text-sm leading-relaxed text-foreground/70">
                        {r.description}
                      </p>

                      <div className="mt-5">
                        <Link
                          href="/careers/apply"
                          className={cn(
                            "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white",
                            "bg-linear-to-r from-[hsl(var(--brand-600))] to-[hsl(var(--cyan-500))]",
                            "transition hover:opacity-90"
                          )}
                        >
                          Apply <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>

                      {/* subtle accent divider */}
                      <div className="mt-6 h-px w-full bg-linear-to-r from-[hsl(var(--brand-600))/0.0] via-[hsl(var(--brand-600))/0.35] to-[hsl(var(--cyan-500))/0.0]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}