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

export default function InstitutionsPage() {
  const challenges = [
    {
      title: "Employability Gaps",
      body: "Many students graduate without visible proof-of-work or practical execution exposure.",
    },
    {
      title: "AI Transformation Pressure",
      body: "Artificial intelligence is reshaping workflows across every major industry and discipline.",
    },
    {
      title: "Limited Industry Exposure",
      body: "Students often lack access to modern operational environments and production workflows.",
    },
    {
      title: "Outdated Execution Systems",
      body: "Traditional learning models struggle to adapt to rapidly evolving technological ecosystems.",
    },
    {
      title: "Weak Portfolio Ecosystems",
      body: "Many students complete degrees without deployable projects, public repositories, or collaborative execution history.",
    },
    {
      title: "Innovation Infrastructure Gap",
      body: "Institutions increasingly require modern innovation ecosystems aligned with future workforce systems.",
    },
  ];

  const why = [
    {
      title: "Execution-Oriented Learning",
      body: "Students actively build systems instead of relying only on theoretical instruction.",
    },
    {
      title: "AI-Native Workflows",
      body: "Exposure to intelligent productivity systems, automation workflows, and AI-assisted execution environments.",
    },
    {
      title: "Startup-Style Collaboration",
      body: "Squad systems, sprint workflows, accountability structures, and production-oriented execution.",
    },
    {
      title: "Proof-Of-Work Ecosystems",
      body: "GitHub repositories, deployed systems, dashboards, portfolios, and visible contribution history.",
    },
    {
      title: "Interdisciplinary Systems",
      body: "Collaboration across AI, engineering, analytics, design, infrastructure, and operational workflows.",
    },
    {
      title: "Structured Ecosystem Architecture",
      body: "A progressive framework combining foundation systems, pathways, residency environments, and career acceleration.",
    },
  ];

  const integration = [
    {
      title: "Innovation Cells",
      body: "AI readiness programs, innovation initiatives, and collaborative project ecosystems.",
    },
    {
      title: "CRT & Placement Systems",
      body: "Career acceleration environments focused on execution capability and portfolio readiness.",
    },
    {
      title: "Incubation Centers",
      body: "Startup culture, innovation systems, and production-oriented collaboration environments.",
    },
    {
      title: "Departmental Integration",
      body: "AI, engineering, analytics, infrastructure, design, and interdisciplinary pathways.",
    },
    {
      title: "Skill Development Initiatives",
      body: "Modern workflow systems, execution readiness, and AI-native productivity ecosystems.",
    },
    {
      title: "Project & Residency Programs",
      body: "Production-oriented collaborative systems integrated into institutional ecosystems.",
    },
  ];

  const programFlow = [
    {
      title: "Foundation Layer",
      body: "Professional readiness, AI-native productivity, engineering foundations, and execution systems.",
    },
    {
      title: "Pathway Immersion",
      body: "Future-focused specialized domains aligned with emerging industries and intelligent ecosystems.",
    },
    {
      title: "Qualification Layer",
      body: "Collaborative projects, advanced systems, technical capability validation, and execution readiness.",
    },
    {
      title: "Integrated Residency",
      body: "Startup-style production systems, sprint workflows, squad collaboration, and deployment environments.",
    },
    {
      title: "Career Launch Week",
      body: "Demo days, hiring systems, portfolio showcases, recruiter interaction, and opportunity acceleration.",
    },
  ];

  const benefits = [
    {
      title: "Improved Employability",
      body: "Practical capability, collaborative execution experience, and deployable proof-of-work.",
    },
    {
      title: "AI Readiness",
      body: "Intelligent systems, AI workflows, automation environments, and modern productivity ecosystems.",
    },
    {
      title: "Portfolio Visibility",
      body: "Visible public proof-of-work through repositories, dashboards, deployments, and collaborative systems.",
    },
    {
      title: "Innovation Culture",
      body: "Startup-style collaboration, experimentation, accountability, and interdisciplinary execution.",
    },
    {
      title: "Industry Alignment",
      body: "Modern workflows aligned with evolving operational and technological ecosystems.",
    },
    {
      title: "Collaborative Learning",
      body: "Structured squad environments and production-oriented systems.",
    },
  ];

  return (
    <MarketingShell>
      <section className="py-16 sm:py-24">
        <div className={marketingContainerClass}>
          <MarketingSectionHeader
            eyebrow="FOR INSTITUTIONS"
            title="Future-Ready Innovation Ecosystems For Educational Institutions"
            subtitle="Sophrion helps institutions modernize employability systems, AI readiness, innovation culture, and execution-oriented learning environments through structured ecosystem integration."
          />

          <p className="mt-4 text-sm text-foreground/60">
            Built for colleges, universities,
            innovation ecosystems, and future
            workforce transformation.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Cta href={MARKETING.contact}>
              Partner With Sophrion
            </Cta>

            <Cta
              href={MARKETING.ecosystem}
              primary={false}
            >
              Explore Ecosystem
            </Cta>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}