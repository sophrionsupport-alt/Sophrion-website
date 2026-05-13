"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import MarketingShell from "@/components/marketing/MarketingShell";
import MarketingSectionHeader from "@/components/marketing/MarketingSectionHeader";
import FeatureGrid from "@/components/marketing/FeatureGrid";
import TwoColumnCompare from "@/components/marketing/TwoColumnCompare";
import { MARKETING } from "@/lib/marketing/links";
import { cn } from "@/lib/utils/cn";

function CtaButton({
  href,
  children,
  variant = "primary",
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        variant === "primary"
          ? "text-white shadow-[0_10px_30px_-12px_hsl(var(--cyan-500)/0.45)] hover:scale-[1.03] hover:shadow-[0_0_24px_-4px_hsl(var(--cyan-500)/0.45),0_0_12px_-2px_hsl(var(--brand-600)/0.3)]"
          : "border border-white/10 bg-white/[0.03] text-foreground/85 backdrop-blur-sm hover:border-white/[0.15] hover:bg-white/[0.05] hover:text-foreground hover:scale-[1.02]",
        className
      )}
      style={
        variant === "primary"
          ? {
              background:
                "linear-gradient(90deg, hsl(var(--brand-600)), hsl(var(--cyan-500)))",
            }
          : undefined
      }
    >
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
      </span>
      {variant === "primary" && (
        <span
          aria-hidden="true"
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.12] to-transparent transition-transform duration-700 group-hover:translate-x-full"
        />
      )}
    </Link>
  );
}

export default function HomeMarketing() {
  const modelPhases = [
    {
      title: "Foundation Layer",
      body: "Build professional readiness, digital foundations, AI-native productivity, and execution fundamentals.",
    },
    {
      title: "Pathway Immersion",
      body: "Explore specialized future-focused pathways across AI, data, design, cloud systems, and smart engineering.",
    },
    {
      title: "Qualification Layer",
      body: "Strengthen technical capability through collaborative projects, advanced workflows, and execution assessments.",
    },
    {
      title: "Integrated Residency",
      body: "Operate in startup-style squads, build production systems, and work inside real execution environments.",
    },
    {
      title: "Career Launch Week",
      body: "Participate in demo days, hiring challenges, portfolio showcases, recruiter reviews, and opportunity networks.",
    },
  ];

  const pathwayCards = [
    {
      title: "Intelligent Software & AI Systems",
      body: "Build AI-powered applications, automation systems, SaaS platforms, and intelligent workflows.",
    },
    {
      title: "Data Intelligence & AI Analytics",
      body: "Work with analytics systems, dashboards, forecasting, business intelligence, and AI-powered insights.",
    },
    {
      title: "Digital Experience & Creative AI",
      body: "Design modern digital experiences, AI-assisted creative systems, immersive interfaces, and intelligent products.",
    },
    {
      title: "Cloud Infrastructure & Cyber Systems",
      body: "Learn scalable infrastructure, deployment systems, security workflows, cloud operations, and intelligent infrastructure management.",
    },
    {
      title: "Applied Engineering & Smart Systems",
      body: "Build IoT systems, automation workflows, smart infrastructure, robotics systems, and industrial AI applications.",
    },
  ];

  const residencyFeatures = [
    {
      title: "Squad-Based Collaboration",
      body: "Interdisciplinary teams working on real systems and collaborative execution.",
    },
    {
      title: "Sprint Workflows",
      body: "Agile execution systems, reviews, accountability cycles, and structured delivery.",
    },
    {
      title: "AI-Native Workflows",
      body: "Prompt engineering, AI productivity systems, automation workflows, and intelligent execution tools.",
    },
    {
      title: "Production Outputs",
      body: "AI assistants, dashboards, SaaS prototypes, automation systems, engineering projects, and deployable platforms.",
    },
    {
      title: "Mentor Reviews",
      body: "Technical mentors, industry guidance, and execution feedback systems.",
    },
    {
      title: "Public Proof-Of-Work",
      body: "GitHub repositories, deployed projects, portfolios, presentations, and case studies.",
    },
  ];

  const outcomeItems = [
    {
      title: "Professional Identity",
      body: "LinkedIn optimization, resume systems, presentation capability, communication readiness.",
    },
    {
      title: "Technical Capability",
      body: "Modern development workflows, collaborative systems, deployment environments, AI-native productivity.",
    },
    {
      title: "Production Experience",
      body: "Sprint execution, team collaboration, project systems, and real-world workflows.",
    },
    {
      title: "Portfolio Ecosystem",
      body: "GitHub repositories, deployed applications, dashboards, AI systems, and visible proof-of-work.",
    },
    {
      title: "Career Readiness",
      body: "Internship readiness, hiring preparation, recruiter visibility, and professional confidence.",
    },
    {
      title: "Future Adaptability",
      body: "AI-native workflows, intelligent systems exposure, interdisciplinary thinking, and continuous learning capability.",
    },
  ];

  const institutionBenefits = [
    {
      title: "Employability Transformation",
      body: "Improve practical capability, portfolio quality, and industry readiness.",
    },
    {
      title: "AI Readiness",
      body: "Introduce students to intelligent workflows, AI systems, and future-ready productivity tools.",
    },
    {
      title: "Innovation Culture",
      body: "Enable startup-style collaboration, production systems, and interdisciplinary execution environments.",
    },
    {
      title: "Portfolio Ecosystems",
      body: "Create visible proof-of-work through deployable projects and execution systems.",
    },
    {
      title: "Industry Alignment",
      body: "Bridge the gap between academic systems and modern workforce expectations.",
    },
    {
      title: "Flexible Integration",
      body: "Integrate through innovation cells, CRT systems, incubation centers, and institutional initiatives.",
    },
  ];

  return (
    <MarketingShell>
      {/* 1 Hero */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="max-w-4xl"
          >
            <p className="text-sm font-semibold tracking-wide text-foreground/70">
              AI-native execution ecosystem
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="bg-linear-to-l from-[hsl(var(--brand-600))] to-[hsl(var(--cyan-500))] bg-clip-text text-transparent">
                AI-Native Execution Ecosystem For Future-Ready Talent
              </span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-foreground/75 sm:text-xl">
              Sophrion transforms students into execution-ready professionals through
              production-oriented learning, startup-style collaboration, AI-native workflows,
              and deployable proof-of-work systems.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <CtaButton href={MARKETING.ecosystem}>Explore Ecosystem</CtaButton>
              <CtaButton href={MARKETING.institutions} variant="secondary">
                Partner With Sophrion
              </CtaButton>
            </div>
            <p className="mt-6 text-sm text-foreground/55">
              Built for students, institutions, innovation ecosystems, and the future workforce.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2 Problem */}
      <section className="border-t border-white/10 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MarketingSectionHeader
            eyebrow="THE EDUCATION GAP"
            title="Modern Education Was Not Designed For The AI Era"
            subtitle="Industries are evolving faster than traditional learning systems. While companies demand execution-ready talent, most students still graduate with limited real-world exposure, weak portfolios, and outdated workflows."
          />
          <div className="mt-12">
            <TwoColumnCompare
              leftTitle="Traditional Systems"
              leftItems={[
                "Theory-heavy learning",
                "Isolated classroom environments",
                "Certificate-driven evaluation",
                "Limited practical execution",
                "Weak portfolio visibility",
                "Outdated workflows",
              ]}
              rightTitle="The Sophrion Ecosystem"
              rightItems={[
                "Production-oriented learning",
                "AI-native workflows",
                "Startup-style collaboration",
                "Proof-of-work validation",
                "Deployable projects",
                "Execution-first systems",
              ]}
            />
          </div>
          <p className="mt-10 text-center text-sm text-foreground/65">
            The future belongs to builders, contributors, and adaptive thinkers — not passive learning alone.
          </p>
        </div>
      </section>

      {/* 3 Sophrion Model */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MarketingSectionHeader
            eyebrow="ECOSYSTEM ARCHITECTURE"
            title="A Structured Career Acceleration Ecosystem"
            subtitle="Sophrion combines learning, execution, production, mentorship, and talent acceleration into a unified ecosystem designed for the intelligent economy."
            align="center"
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modelPhases.map((p, i) => {
              const glowClass = ["glow-purple", "glow-cyan", "glow-blue", "glow-indigo", "glow-purple"][i];
              return (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className={cn(
                    "rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-lg",
                    "transition-all duration-300 hover:border-white/[0.14] shimmer-border",
                    glowClass
                  )}
                >
                  <p className="text-xs font-semibold uppercase tracking-widest text-foreground/50">
                    Phase {i + 1}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-foreground">{p.title}</h3>
                  <p className="mt-2 text-sm text-foreground/70">{p.body}</p>
                </motion.div>
              );
            })}
          </div>
          <div className="mt-8 flex justify-center">
            <CtaButton href={MARKETING.ecosystem} variant="secondary">
              See full architecture
            </CtaButton>
          </div>
        </div>
      </section>

      {/* 4 Pathways preview */}
      <section className="border-t border-white/10 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MarketingSectionHeader
            eyebrow="FUTURE PATHWAYS"
            title="Explore Future-Ready Domains"
            subtitle="Sophrion pathways are designed around emerging technologies, intelligent systems, AI-native workflows, and execution-driven careers."
          />
          <div className="mt-10">
            <FeatureGrid items={pathwayCards} columns={3} />
          </div>
          <div className="mt-10 flex justify-center">
            <CtaButton href={MARKETING.pathways}>Explore All Pathways</CtaButton>
          </div>
        </div>
      </section>

      {/* 5 Residency */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MarketingSectionHeader
            eyebrow="EXECUTION ENVIRONMENT"
            title="Startup Simulation + Production Residency"
            subtitle="Students do not simply complete assignments. They collaborate in squads, participate in sprint systems, deploy projects, and contribute inside execution-driven production environments."
            align="center"
          />
          <div className="mt-12">
            <FeatureGrid items={residencyFeatures} columns={3} />
          </div>
          <div className="mt-10 flex justify-center">
            <CtaButton href={MARKETING.residency} variant="secondary">
              How residency works
            </CtaButton>
          </div>
        </div>
      </section>

      {/* 6 Outcomes */}
      <section className="border-t border-white/10 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MarketingSectionHeader
            eyebrow="TRANSFORMATION OUTCOMES"
            title="Students Graduate With Visible Capability"
            subtitle="Every student progresses through structured systems designed to build practical confidence, execution capability, portfolio visibility, and AI-native readiness."
          />
          <div className="mt-12">
            <FeatureGrid items={outcomeItems} columns={3} />
          </div>
        </div>
      </section>

      {/* 7 Institutions */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MarketingSectionHeader
            eyebrow="INSTITUTIONAL ECOSYSTEMS"
            title="Future-Ready Innovation Infrastructure For Institutions"
            subtitle="Sophrion helps educational institutions modernize employability systems, AI readiness, innovation culture, and execution-oriented learning environments."
            align="center"
          />
          <div className="mt-12">
            <FeatureGrid items={institutionBenefits} columns={3} />
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <CtaButton href={MARKETING.institutions}>Partner With Sophrion</CtaButton>
            <CtaButton href={MARKETING.ecosystem} variant="secondary">
              Explore Ecosystem
            </CtaButton>
          </div>
        </div>
      </section>

      {/* 8 Final CTA */}
      <section className="border-t border-white/10 py-16 sm:pb-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <MarketingSectionHeader
            align="center"
            title="Build Beyond Traditional Education"
            subtitle="Enter an AI-native execution ecosystem designed for the future workforce, intelligent systems, and innovation-driven careers."
          />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <CtaButton href={MARKETING.join}>Join Ecosystem</CtaButton>
            <CtaButton href={MARKETING.institutions} variant="secondary">
              Start Institutional Pilot
            </CtaButton>
          </div>
          <p className="mt-8 text-sm text-foreground/55">
            Sophrion is building the next generation of execution-ready talent through AI-native,
            production-oriented learning ecosystems.
          </p>
        </div>
      </section>
    </MarketingShell>
  );
}
