"use client";

import * as React from "react";
import Link from "next/link";

import { ArrowRight } from "lucide-react";

import MarketingShell from "@/components/marketing/MarketingShell";
import MarketingSectionHeader from "@/components/marketing/MarketingSectionHeader";
import FeatureGrid from "@/components/marketing/FeatureGrid";
import PhaseTimeline from "@/components/marketing/PhaseTimeline";

import { MARKETING } from "@/lib/marketing/links";

import {
  marketingContainerClass,
} from "@/lib/marketing/layout";

import { cn } from "@/lib/utils/cn";

function Cta({
  href,
  children,
  primary = true,
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition",
        primary
          ? "text-white hover:opacity-95"
          : "border border-white/10 bg-white/3 text-foreground/85"
      )}
      style={
        primary
          ? {
              background:
                "linear-gradient(90deg, hsl(var(--brand-600)), hsl(var(--cyan-500)))",
            }
          : undefined
      }
    >
      {children}

      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

const squadRoles = [
  {
    role: "AI Engineer",
    desc: "Build AI systems, intelligent workflows, and automation environments.",
  },
  {
    role: "Full Stack Associate",
    desc: "Develop product systems, APIs, interfaces, and deployment workflows.",
  },
  {
    role: "Data Associate",
    desc: "Build dashboards, analytics systems, reporting environments, and intelligence workflows.",
  },
  {
    role: "UX Designer",
    desc: "Design interfaces, product experiences, visual systems, and interaction workflows.",
  },
  {
    role: "Operations Lead",
    desc: "Coordinate execution, sprint systems, communication, and accountability workflows.",
  },
  {
    role: "QA & Documentation Associate",
    desc: "Testing systems, documentation workflows, deployment validation, operational visibility.",
  },
];

export default function ResidencyPage() {
  return (
    <MarketingShell>
      <section className="py-16 sm:py-24">
        <div className={marketingContainerClass}>
          <MarketingSectionHeader
            eyebrow="INTEGRATED RESIDENCY & PRODUCTION"
            title="Startup Simulation + Production Residency Ecosystem"
            subtitle="Sophrion residency systems transform students from passive learners into execution contributors through collaborative squads, sprint workflows, AI-native systems, and production-oriented environments."
          />

          <p className="mt-4 text-sm font-medium text-foreground/60">
            Learn. Build. Collaborate. Deploy.
            Showcase.
          </p>
        </div>
      </section>

      <section className="border-t border-white/10 py-16 sm:pb-24">
        <div className={marketingContainerClass}>
          <div className="mx-auto max-w-4xl text-center">
            <MarketingSectionHeader
              align="center"
              title="Enter A Real Execution Environment"
              subtitle="Sophrion residency systems combine startup-style execution, AI-native workflows, collaborative production systems, and deployable proof-of-work into a unified future-ready ecosystem."
            />

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Cta href={MARKETING.join}>
                Join Ecosystem
              </Cta>

              <Cta
                href={MARKETING.institutions}
                primary={false}
              >
                Partner With Sophrion
              </Cta>
            </div>

            <p className="mt-6 text-xs text-foreground/50">
              Built for students, institutions,
              innovation ecosystems, and the future
              of intelligent workforce development.
            </p>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}