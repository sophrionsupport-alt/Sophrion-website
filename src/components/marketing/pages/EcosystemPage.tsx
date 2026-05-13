"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import MarketingShell from "@/components/marketing/MarketingShell";
import MarketingSectionHeader from "@/components/marketing/MarketingSectionHeader";
import FeatureGrid from "@/components/marketing/FeatureGrid";
import PhaseTimeline from "@/components/marketing/PhaseTimeline";
import { MARKETING } from "@/lib/marketing/links";
import { marketingContainerClass } from "@/lib/marketing/layout";
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
          : "border border-white/10 bg-white/3 text-foreground/85 hover:bg-white/6"
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

export default function EcosystemPage() {
  const overviewSteps = [
    {
      title: "Foundation Layer",
      body: "Professional readiness, analytical thinking, digital engineering foundations, AI-native workflows, and execution systems.",
    },
    {
      title: "Pathway Immersion",
      body: "Specialized future-focused domains aligned with AI, analytics, design, cloud systems, engineering, and intelligent infrastructure.",
    },
    {
      title: "Qualification Layer",
      body: "Collaborative projects, technical assessments, advanced workflows, and squad readiness systems.",
    },
    {
      title: "Integrated Residency & Production",
      body: "Startup-style execution environments where students work in squads and build production-oriented systems.",
    },
    {
      title: "Career Launch Week",
      body: "Demo days, portfolio showcases, hiring challenges, recruiter interactions, and opportunity systems.",
    },
    {
      title: "Fellowship & Advanced Tracks",
      body: "Advanced residencies, startup squads, deployment opportunities, and future innovation pathways.",
    },
  ];

  const foundation = [
    { title: "Career Readiness Foundations", body: "Communication, presentations, professional identity, LinkedIn optimization, collaboration readiness." },
    { title: "Analytical Intelligence Systems", body: "Logical thinking, quantitative reasoning, structured problem solving." },
    { title: "Digital Engineering Foundations", body: "Programming logic, computational thinking, APIs, debugging, engineering workflows." },
    { title: "Modern Development Workflows", body: "Git, GitHub, documentation, collaboration workflows, deployment awareness." },
    { title: "AI-Native Workflow Systems", body: "Prompt engineering, AI-assisted productivity, intelligent research, automation fundamentals." },
    { title: "Startup Execution Systems", body: "Sprint systems, agile workflows, accountability culture, team collaboration." },
  ];

  const pathwayImmersion = [
    { title: "Intelligent Software & AI Systems", body: "AI applications, SaaS systems, automation workflows, cloud infrastructure, intelligent products." },
    { title: "Data Intelligence & AI Analytics", body: "Dashboards, analytics, AI reporting, forecasting, machine learning, data infrastructure." },
    { title: "Digital Experience & Creative AI", body: "UI/UX, immersive experiences, AI media workflows, product design, digital branding." },
    { title: "Cloud Infrastructure & Cyber Systems", body: "Scalable deployment, infrastructure, cybersecurity, cloud workflows, intelligent operations." },
    { title: "Applied Engineering & Smart Systems", body: "IoT, robotics, industrial AI, embedded systems, automation, smart infrastructure." },
  ];

  const qualification = [
    { title: "Advanced Projects", body: "Increasingly complex systems aligned with specialization pathways." },
    { title: "Collaborative Execution", body: "Team-based workflows, sprint collaboration, technical reviews, interdisciplinary contribution." },
    { title: "Technical Assessments", body: "Execution-focused evaluations around practical implementation and project systems." },
    { title: "Mentor Guidance", body: "Feedback from technical mentors, pathway specialists, and execution reviewers." },
    { title: "Squad Readiness", body: "Preparation for startup-style residency workflows and production collaboration." },
  ];

  const residency = [
    { title: "Squad-Based Collaboration", body: "Interdisciplinary teams operating like modern startup product squads." },
    { title: "Sprint Systems", body: "Agile execution cycles, accountability workflows, blocker reviews, delivery systems." },
    { title: "Production Workflows", body: "Deployable systems instead of isolated academic assignments." },
    { title: "Mentor Reviews", body: "Guidance from technical mentors, industry reviewers, and residency coordinators." },
    { title: "AI-Native Execution", body: "AI-assisted productivity, automation, intelligent workflows, modern operational tools." },
    { title: "Public Proof-Of-Work", body: "Repositories, deployment links, documentation, portfolio ecosystems." },
  ];

  const careerLaunch = [
    { title: "Portfolio Showcase", body: "Projects, deployments, dashboards, repositories, and case studies." },
    { title: "Hiring Challenges", body: "Execution-oriented technical challenges aligned with pathway specializations." },
    { title: "Mock Interviews", body: "Technical reviews, communication assessments, execution-focused evaluations." },
    { title: "Demo Day", body: "Startup-style showcase featuring deployable systems and production outputs." },
    { title: "Recruiter Interactions", body: "Portfolio reviews, squad discussions, hiring evaluations, opportunity discovery." },
    { title: "Opportunity Matching", body: "Internships, fellowships, advanced residencies, startup squads, deployment opportunities." },
  ];

  const fellowship = [
    { title: "Advanced Residencies", body: "Deeper production-oriented execution and collaborative project environments." },
    { title: "Startup Squads", body: "Internal innovation teams on advanced systems and scalable product ecosystems." },
    { title: "Innovation Tracks", body: "AI systems, intelligent infrastructure, analytics ecosystems, automation, applied engineering." },
    { title: "Fellowship Programs", body: "Structured contributor ecosystems for advanced capability and leadership." },
    { title: "Research & Experimentation", body: "Applied AI, experimentation workflows, intelligent engineering, future technology exploration." },
  ];

  const outcomesStudents = [
    "Deployable portfolios",
    "AI-native workflows",
    "Execution confidence",
    "Collaborative capability",
    "Production experience",
  ];
  const outcomesInst = [
    "Employability transformation",
    "Innovation ecosystem development",
    "AI readiness",
    "Portfolio visibility",
    "Industry alignment",
  ];
  const outcomesIndustry = [
    "Execution-ready talent",
    "Proof-of-work validation",
    "Reduced onboarding burden",
    "AI-native workforce readiness",
  ];

  return (
    <MarketingShell>
      <section className="py-16 sm:py-24">
        <div className={marketingContainerClass}>
          <MarketingSectionHeader
            eyebrow="ECOSYSTEM ARCHITECTURE"
            title="A Structured Career Acceleration Ecosystem For The AI Era"
            subtitle="Sophrion combines learning, execution, AI-native workflows, collaborative production systems, and talent acceleration into a unified ecosystem designed for future-ready workforce development."
          />
          <p className="mt-4 max-w-2xl text-sm text-foreground/60">
            Built for students, institutions, innovation ecosystems, and intelligent industries.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Cta href={MARKETING.pathways}>Explore Pathways</Cta>
            <Cta href={MARKETING.residency} primary={false}>
              Explore Residency
            </Cta>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 py-16">
        <div className={marketingContainerClass}>
          <MarketingSectionHeader
            eyebrow="HOW SOPHRION WORKS"
            title="A Progressive Multi-Layer Transformation System"
            subtitle="Students progress through structured layers designed to build technical capability, execution confidence, collaborative workflows, AI-native productivity, and visible proof-of-work."
            align="center"
          />
          <PhaseTimeline steps={overviewSteps} className="mt-12" />
        </div>
      </section>

      <section className="py-16">
        <div className={marketingContainerClass}>
          <MarketingSectionHeader eyebrow="PHASE 1" title="Foundation Layer" subtitle="The foundation layer builds professional readiness, digital capability, AI-native productivity, and execution fundamentals required for modern innovation ecosystems." />
          <FeatureGrid className="mt-10" items={foundation} columns={3} />
          <p className="mt-8 text-sm text-foreground/65">
            Students exit with GitHub profiles, portfolio systems, deployed mini projects, AI-assisted workflow exposure, collaborative sprint experience, and execution readiness fundamentals.
          </p>
        </div>
      </section>

      <section className="border-t border-white/10 py-16">
        <div className={marketingContainerClass}>
          <MarketingSectionHeader eyebrow="PHASE 2" title="Pathway Immersion & Specialization" subtitle="Students explore specialized future-ready pathways aligned with emerging industries, intelligent systems, AI-native workflows, and modern digital ecosystems." />
          <FeatureGrid className="mt-10" items={pathwayImmersion} columns={3} />
        </div>
      </section>

      <section className="py-16">
        <div className={marketingContainerClass}>
          <MarketingSectionHeader eyebrow="PHASE 3" title="Qualification Layer" subtitle="The qualification layer validates technical capability, execution maturity, collaborative readiness, and production-oriented problem solving before students enter residency environments." />
          <FeatureGrid className="mt-10" items={qualification} columns={3} />
        </div>
      </section>

      <section className="border-t border-white/10 py-16">
        <div className={marketingContainerClass}>
          <MarketingSectionHeader eyebrow="PHASE 4" title="Startup Simulation + Production Residency" subtitle="Students transition into execution-oriented residency systems where they work inside collaborative squads, participate in sprint workflows, and build production-grade outputs." />
          <FeatureGrid className="mt-10" items={residency} columns={3} />
        </div>
      </section>

      <section className="py-16">
        <div className={marketingContainerClass}>
          <MarketingSectionHeader eyebrow="PHASE 5" title="Career Launch Week" subtitle="A structured showcase and evaluation ecosystem where students demonstrate capability, present production outputs, and participate in opportunity acceleration systems." />
          <FeatureGrid className="mt-10" items={careerLaunch} columns={3} />
        </div>
      </section>

      <section className="border-t border-white/10 py-16">
        <div className={marketingContainerClass}>
          <MarketingSectionHeader eyebrow="PHASE 6" title="Advanced Growth Ecosystems" subtitle="High-performing students gain access to advanced execution environments, startup ecosystems, innovation tracks, and future-ready growth opportunities." />
          <FeatureGrid className="mt-10" items={fellowship} columns={3} />
        </div>
      </section>

      <section className="py-16">
        <div className={marketingContainerClass}>
          <MarketingSectionHeader eyebrow="OUTCOMES" title="Building Execution-Ready Talent Ecosystems" subtitle="Sophrion is designed to help students, institutions, and innovation ecosystems transition into future-ready operational environments aligned with intelligent workforce systems." align="center" />
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card/70 p-6">
              <h3 className="font-semibold text-foreground">For Students</h3>
              <ul className="mt-3 space-y-2 text-sm text-foreground/70">
                {outcomesStudents.map((t) => (
                  <li key={t}>• {t}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-card/70 p-6">
              <h3 className="font-semibold text-foreground">For Institutions</h3>
              <ul className="mt-3 space-y-2 text-sm text-foreground/70">
                {outcomesInst.map((t) => (
                  <li key={t}>• {t}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-card/70 p-6">
              <h3 className="font-semibold text-foreground">For Industry</h3>
              <ul className="mt-3 space-y-2 text-sm text-foreground/70">
                {outcomesIndustry.map((t) => (
                  <li key={t}>• {t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 py-16 sm:pb-24">
        <div className={marketingContainerClass}>
          <div className="mx-auto max-w-4xl text-center">
          <MarketingSectionHeader
            align="center"
            title="Enter The Future Of Execution-Driven Learning"
            subtitle="Sophrion combines AI-native workflows, production systems, collaborative execution, and innovation ecosystems into a unified future-ready talent infrastructure."
          />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Cta href={MARKETING.pathways}>Explore Pathways</Cta>
            <Cta href={MARKETING.institutions} primary={false}>
              Partner With Sophrion
            </Cta>
          </div>
          <p className="mt-6 text-xs text-foreground/50">
            Built for the next generation of builders, engineers, innovators, and intelligent workforce ecosystems.
          </p>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
