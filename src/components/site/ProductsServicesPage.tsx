"use client";

import * as React from "react";
import { motion } from "motion/react";

type Variant = "products" | "services";

const COPY: Record<
  Variant,
  { kicker: string; headline: string; body: string }
> = {
  products: {
    kicker: "Products",
    headline: "Platforms that operationalize readiness",
    body: "This page is the home for Sophrion’s product suite. Add product modules, screenshots, and pricing/plan positioning here.",
  },
  services: {
    kicker: "Services",
    headline: "Enablement for institutions and teams",
    body: "This page is the home for service offerings (onboarding, program design, training, analytics reviews, and support).",
  },
};

export default function ProductsServicesPage({ variant }: { variant: Variant }) {
  const copy = COPY[variant];

  return (
    <div className="relative flex flex-col bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[14%] top-[14%] h-225 w-225 rounded-full bg-[radial-gradient(closest-side,hsl(var(--ring)/0.18),transparent_70%)]" />
        <div className="absolute right-[12%] top-[32%] h-225 w-225 rounded-full bg-[radial-gradient(closest-side,hsl(var(--cyan-500)/0.12),transparent_70%)]" />
      </div>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <p className="text-sm font-semibold tracking-wide text-foreground/70">
              {copy.kicker}
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              <span className="bg-linear-to-l from-[hsl(var(--brand-600))] to-[hsl(var(--cyan-500))] bg-clip-text text-transparent">
                {copy.headline}
              </span>
            </h1>

            <p className="mt-5 text-lg leading-relaxed text-foreground/70">
              {copy.body}
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

