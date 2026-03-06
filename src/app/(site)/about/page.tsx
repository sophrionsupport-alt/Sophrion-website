"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Shield, Users, Target, Award } from "lucide-react";

export default function Page() {
  return (
    <div className="relative flex flex-col bg-background text-foreground">
      {/* Atmospheric glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[18%] top-[12%] h-225 w-225 rounded-full bg-[radial-gradient(closest-side,hsl(var(--ring)/0.22),transparent_70%)]" />
        <div className="absolute right-[10%] top-[28%] h-225 w-225 rounded-full bg-[radial-gradient(closest-side,hsl(var(--cyan-500)/0.14),transparent_70%)]" />
      </div>

      {/* Hero */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <p className="text-sm font-semibold tracking-wide text-foreground/70">
              About Sophrion
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              <span className="bg-linear-to-l from-[hsl(var(--brand-600))] to-[hsl(var(--cyan-500))] bg-clip-text text-transparent">
                       Institutional Readiness Intelligence
              </span>{" "}
              — built for outcomes
            </h1>

            <p className="mt-5 text-lg leading-relaxed text-foreground/70">
              Sophrion exists to bridge the campus–industry gap by turning placement preparation into a measurable,
              repeatable system — simple enough for adoption, strong enough for scale.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <ValueCard
              icon={Shield}
              title="Integrity by design"
              body="Clear scoring, transparent criteria, and audit-friendly reporting so stakeholders trust the system."
            />
            <ValueCard
              icon={Users}
              title="Human-first systems"
              body="We optimize for students, coordinators, and recruiters — not for dashboards."
            />
            <ValueCard
              icon={Target}
              title="Outcome-driven"
              body="Readiness means placement outcomes. Everything maps back to improvement loops."
            />
            <ValueCard
              icon={Award}
              title="Institution-grade"
              body="Workflows that colleges can operate reliably across batches, departments, and years."
            />
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                What we’re building
              </h2>

              <p className="mt-4 leading-relaxed text-foreground/70">
                A practical readiness layer for institutions: a consistent way to assess, train, and track student
                readiness — and to coordinate interventions early.
              </p>

              <p className="mt-4 leading-relaxed text-foreground/70">
                The goal isn’t “more content”. The goal is clarity: what to do next, for whom, and why — with measurable
                progress.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl border border-border bg-white/3 p-6 backdrop-blur sm:p-8"
            >
              <h3 className="text-lg font-semibold text-foreground">
                The simple promise
              </h3>

              <ul className="mt-4 space-y-3 text-sm text-foreground/70">
                <li>• Clear readiness definition for your institution</li>
                <li>• Practical interventions that teams can execute</li>
                <li>• Evidence-backed reporting for stakeholders</li>
                <li>• Repeatable processes across departments</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ValueCard({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="group rounded-2xl border border-border bg-card p-6 transition hover:bg-white/3">
      <Icon className="h-6 w-6 text-foreground" />

      <h3 className="mt-4 text-base font-semibold text-foreground">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-relaxed text-foreground/70">
        {body}
      </p>

      {/* subtle accent line */}
      <div className="mt-5 h-px w-full bg-linear-to-r from-[hsl(var(--brand-600))/0.0] via-[hsl(var(--brand-600))/0.35] to-[hsl(var(--cyan-500))/0.0] opacity-0 transition group-hover:opacity-100" />
    </div>
  );
}