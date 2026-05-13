"use client";

import * as React from "react";
import Link from "next/link";

import { ArrowRight } from "lucide-react";

import MarketingShell from "@/components/marketing/MarketingShell";
import MarketingSectionHeader from "@/components/marketing/MarketingSectionHeader";
import FeatureGrid from "@/components/marketing/FeatureGrid";

import {
  MARKETING,
  PATHWAY_ANCHORS,
} from "@/lib/marketing/links";

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

function DeepDive({
  id,
  eyebrow,
  title,
  subtitle,
  learning,
  projects,
  tools,
}: {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  learning: string[];
  projects: string[];
  tools: string[];
}) {
  return (
    <section
      id={id}
      className="scroll-mt-28 border-t border-white/10 py-16"
    >
      <div className={marketingContainerClass}>
        <MarketingSectionHeader
          eyebrow={eyebrow}
          title={title}
          subtitle={subtitle}
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card/70 p-5">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground/55">
              Learning areas
            </h3>

            <ul className="mt-3 space-y-2 text-sm text-foreground/75">
              {learning.map((x) => (
                <li key={x}>• {x}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card/70 p-5">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground/55">
              Sample projects
            </h3>

            <ul className="mt-3 space-y-2 text-sm text-foreground/75">
              {projects.map((x) => (
                <li key={x}>• {x}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card/70 p-5">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground/55">
              Tools & systems
            </h3>

            <ul className="mt-3 space-y-2 text-sm text-foreground/75">
              {tools.map((x) => (
                <li key={x}>• {x}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function PathwaysPage() {
  return (
    <MarketingShell>
      <section className="py-16 sm:py-24">
        <div className={marketingContainerClass}>
          <MarketingSectionHeader
            eyebrow="FUTURE-READY PATHWAYS"
            title="Explore Specialized Ecosystems Built For The Future Workforce"
            subtitle="Sophrion pathways are designed around emerging industries, AI-native workflows, intelligent systems, collaborative execution, and production-oriented learning environments."
          />

          <p className="mt-4 max-w-2xl text-sm text-foreground/60">
            Each pathway combines learning,
            execution, projects, production systems,
            mentorship, and proof-of-work ecosystems.
          </p>
        </div>
      </section>

      <section className="border-t border-white/10 py-16 sm:pb-24">
        <div className={marketingContainerClass}>
          <div className="mx-auto max-w-4xl text-center">
            <MarketingSectionHeader
              align="center"
              title="Enter A Future-Ready Learning Ecosystem"
              subtitle="Explore AI-native pathways designed around intelligent systems, collaborative execution, production environments, and modern workforce transformation."
            />

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Cta href={MARKETING.join}>
                Join Ecosystem
              </Cta>

              <Cta
                href={MARKETING.residency}
                primary={false}
              >
                Explore Residency
              </Cta>
            </div>

            <p className="mt-6 text-xs text-foreground/50">
              Pathways combine learning,
              execution, AI-native workflows,
              production systems, and visible
              proof-of-work into unified
              future-ready ecosystems.
            </p>

            <p className="mt-4 text-xs text-foreground/40">
              Quick anchors:{" "}

              <Link
                className="underline hover:text-[hsl(var(--cyan-500))]"
                href={PATHWAY_ANCHORS.ai}
              >
                AI Systems
              </Link>

              {" · "}

              <Link
                className="underline hover:text-[hsl(var(--cyan-500))]"
                href={PATHWAY_ANCHORS.data}
              >
                Data
              </Link>

              {" · "}

              <Link
                className="underline hover:text-[hsl(var(--cyan-500))]"
                href={PATHWAY_ANCHORS.creative}
              >
                Creative AI
              </Link>

              {" · "}

              <Link
                className="underline hover:text-[hsl(var(--cyan-500))]"
                href={PATHWAY_ANCHORS.cloud}
              >
                Cloud & Cyber
              </Link>

              {" · "}

              <Link
                className="underline hover:text-[hsl(var(--cyan-500))]"
                href={PATHWAY_ANCHORS.engineering}
              >
                Smart Engineering
              </Link>
            </p>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}