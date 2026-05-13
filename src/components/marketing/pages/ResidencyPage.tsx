"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import MarketingShell from "@/components/marketing/MarketingShell";
import MarketingSectionHeader from "@/components/marketing/MarketingSectionHeader";
import FeatureGrid from "@/components/marketing/FeatureGrid";
import PhaseTimeline from "@/components/marketing/PhaseTimeline";
import { MARKETING } from "@/lib/marketing/links";
import { cn } from "@/lib/utils/cn";

function Cta({ href, children, primary = true }: { href: string; children: React.ReactNode; primary?: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition",
        primary ? "text-white hover:opacity-95" : "border border-white/10 bg-white/3 text-foreground/85"
      )}
      style={primary ? { background: "linear-gradient(90deg, hsl(var(--brand-600)), hsl(var(--cyan-500)))" } : undefined}
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

const squadRoles = [
  { role: "AI Engineer", desc: "Build AI systems, intelligent workflows, and automation environments." },
  { role: "Full Stack Associate", desc: "Develop product systems, APIs, interfaces, and deployment workflows." },
  { role: "Data Associate", desc: "Build dashboards, analytics systems, reporting environments, and intelligence workflows." },
  { role: "UX Designer", desc: "Design interfaces, product experiences, visual systems, and interaction workflows." },
  { role: "Operations Lead", desc: "Coordinate execution, sprint systems, communication, and accountability workflows." },
  { role: "QA & Documentation Associate", desc: "Testing systems, documentation workflows, deployment validation, operational visibility." },
];

export default function ResidencyPage() {
  const whatIs = [
    "Collaborative execution",
    "Sprint systems",
    "Production workflows",
    "Deployment environments",
    "Real operational ecosystems",
  ];

  const startupSim = [
    { title: "Agile Sprint Systems", body: "Structured sprint cycles, delivery workflows, reviews, blockers, and execution tracking." },
    { title: "Collaborative Operations", body: "Cross-functional collaboration across AI, engineering, analytics, design, operations, and infrastructure." },
    { title: "AI-Native Workflows", body: "Prompt engineering, AI-assisted execution, automation systems, intelligent productivity workflows." },
    { title: "Accountability Systems", body: "Task ownership, sprint reviews, delivery systems, collaborative accountability culture." },
    { title: "Production-Oriented Learning", body: "Deployable systems instead of isolated theoretical exercises." },
    { title: "Public Proof-Of-Work", body: "GitHub repositories, deployed systems, documentation, presentations, dashboards, portfolios." },
  ];

  const sprintFlow = [
    { title: "Advanced Learning Sessions", body: "Technical progression, pathway systems, and advanced workflows." },
    { title: "Squad Execution", body: "Collaborative project building and production-oriented contribution." },
    { title: "Sprint Reviews", body: "Progress evaluation, blocker resolution, quality checks, accountability systems." },
    { title: "Mentor Guidance", body: "Technical reviews, operational feedback, execution support." },
    { title: "Production Output", body: "Deployments, dashboards, repositories, showcase-ready deliverables." },
  ];

  const mentorGrid = [
    { title: "Technical Mentors", body: "Implementation guidance, architecture reviews, technical systems, execution support." },
    { title: "Industry Reviewers", body: "Practical relevance, business alignment, operational maturity, production feedback." },
    { title: "Residency Coordinators", body: "Sprint management, accountability workflows, operational coordination, escalation systems." },
    { title: "Pathway Specialists", body: "Advanced support aligned with specialized domains and technical ecosystems." },
  ];

  const outputs = [
    { title: "AI Assistants", body: "Automation systems, intelligent workflows, AI-native applications, operational tools." },
    { title: "SaaS Prototypes", body: "Modern web platforms, productivity systems, workflow tools, collaborative environments." },
    { title: "Analytics Dashboards", body: "Reporting systems, intelligence platforms, forecasting environments, operational analytics." },
    { title: "Automation Systems", body: "AI workflows, productivity systems, process automation, operational intelligence." },
    { title: "Smart Engineering Systems", body: "IoT systems, monitoring platforms, smart infrastructure, intelligent engineering workflows." },
    { title: "Portfolio Ecosystems", body: "GitHub repositories, deployment systems, documentation, presentations, public proof-of-work." },
  ];

  const careerLaunch = [
    { title: "Portfolio Showcase", body: "Projects, repositories, dashboards, deployment systems, presentations, proof-of-work ecosystems." },
    { title: "Hiring Challenges", body: "Execution-focused technical challenges aligned with pathway specializations." },
    { title: "Mock Interviews", body: "Technical assessments, communication systems, collaboration reviews, operational readiness evaluation." },
    { title: "Demo Day", body: "Startup-style showcase featuring deployable systems and production outputs." },
    { title: "Recruiter Interaction", body: "Project reviews, squad discussions, portfolio evaluation, hiring opportunities." },
    { title: "Opportunity Matching", body: "Internships, fellowships, startup squads, advanced residencies, deployment opportunities." },
  ];

  const transform = [
    { title: "Professional Identity", body: "Communication systems, presentation capability, professional visibility, collaboration confidence." },
    { title: "Technical Capability", body: "Modern workflows, deployment systems, AI-native tooling, execution readiness." },
    { title: "Collaborative Execution", body: "Team contribution, sprint participation, interdisciplinary systems, operational workflows." },
    { title: "Public Proof-Of-Work", body: "Projects, dashboards, repositories, deployment systems, visible contribution ecosystems." },
    { title: "Career Readiness", body: "Hiring preparation, recruiter visibility, opportunity acceleration, professional confidence." },
    { title: "Future Adaptability", body: "AI-native productivity, intelligent systems exposure, operational thinking, continuous growth capability." },
  ];

  return (
    <MarketingShell>
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MarketingSectionHeader
            eyebrow="INTEGRATED RESIDENCY & PRODUCTION"
            title="Startup Simulation + Production Residency Ecosystem"
            subtitle="Sophrion residency systems transform students from passive learners into execution contributors through collaborative squads, sprint workflows, AI-native systems, and production-oriented environments."
          />
          <p className="mt-4 text-sm font-medium text-foreground/60">Learn. Build. Collaborate. Deploy. Showcase.</p>
        </div>
      </section>

      <section className="border-t border-white/10 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MarketingSectionHeader eyebrow="THE RESIDENCY MODEL" title="A Live Execution Environment" />
          <p className="mt-4 max-w-3xl text-foreground/75">
            The Sophrion residency ecosystem simulates modern startup and production environments where students actively participate in collaborative execution, sprint systems, production workflows, deployment environments, and real operational ecosystems.
          </p>
          <ul className="mt-6 grid gap-2 text-sm text-foreground/70 sm:grid-cols-2">
            {whatIs.map((t) => (
              <li key={t}>• {t}</li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-foreground/65">
            The residency system bridges academic learning, practical capability, and real-world execution readiness.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MarketingSectionHeader eyebrow="EXECUTION CULTURE" title="Experience Modern Product & Startup Workflows" subtitle="Students operate inside systems inspired by modern startups, product organizations, and collaborative engineering environments." />
          <FeatureGrid className="mt-10" items={startupSim} columns={3} />
        </div>
      </section>

      <section className="border-t border-white/10 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MarketingSectionHeader eyebrow="COLLABORATIVE SYSTEMS" title="Squad-Based Execution Ecosystem" subtitle="Students work in interdisciplinary squads designed to simulate real operational environments and collaborative product systems. Ideal squad size: 5–8 students per squad." />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {squadRoles.map((r) => (
              <div key={r.role} className="rounded-2xl border border-border bg-card/70 p-5">
                <h3 className="font-semibold text-foreground">{r.role}</h3>
                <p className="mt-2 text-sm text-foreground/70">{r.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-foreground/65">
            Students develop communication capability, execution confidence, interdisciplinary collaboration, accountability culture, and operational maturity.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MarketingSectionHeader eyebrow="EXECUTION SYSTEMS" title="Structured Sprint & Delivery Workflows" subtitle="Residency execution is organized through structured sprint systems designed to simulate modern operational and product environments." align="center" />
          <PhaseTimeline className="mt-10" steps={sprintFlow} />
          <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-border bg-card/60 p-5 text-sm text-foreground/70">
            <p className="font-semibold text-foreground">Execution components</p>
            <ul className="mt-2 space-y-1">
              <li>• Daily standups — team coordination and execution tracking</li>
              <li>• Weekly reviews — progress systems, blockers, and quality reviews</li>
              <li>• Biweekly demonstrations — mentor presentations, system reviews, collaborative showcases</li>
              <li>• Monthly showcase — project presentations, demos, deployment visibility, execution validation</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MarketingSectionHeader eyebrow="GUIDANCE SYSTEMS" title="Structured Mentor & Review Ecosystem" subtitle="Students receive guidance through technical mentors, industry reviewers, and execution coordinators designed to support practical growth and production capability." />
          <FeatureGrid className="mt-10" items={mentorGrid} columns={2} />
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MarketingSectionHeader eyebrow="WHAT STUDENTS BUILD" title="Production-Oriented Systems & Deployable Outputs" subtitle="Students contribute to real execution systems designed around modern operational environments and deployable proof-of-work ecosystems." />
          <FeatureGrid className="mt-10" items={outputs} columns={3} />
        </div>
      </section>

      <section className="border-t border-white/10 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MarketingSectionHeader eyebrow="OPPORTUNITY SYSTEMS" title="Showcase, Validation & Career Acceleration" subtitle="The residency ecosystem culminates in a structured career launch environment where students demonstrate capability through visible proof-of-work systems and collaborative execution showcases." />
          <FeatureGrid className="mt-10" items={careerLaunch} columns={3} />
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MarketingSectionHeader eyebrow="OUTCOMES" title="From Learners To Execution Contributors" subtitle="The residency ecosystem is designed to build practical capability, operational maturity, collaborative execution confidence, and AI-native readiness for modern workforce environments." />
          <FeatureGrid className="mt-10" items={transform} columns={3} />
        </div>
      </section>

      <section className="border-t border-white/10 py-16 sm:pb-24">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <MarketingSectionHeader align="center" title="Enter A Real Execution Environment" subtitle="Sophrion residency systems combine startup-style execution, AI-native workflows, collaborative production systems, and deployable proof-of-work into a unified future-ready ecosystem." />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Cta href={MARKETING.join}>Join Ecosystem</Cta>
            <Cta href={MARKETING.institutions} primary={false}>
              Partner With Sophrion
            </Cta>
          </div>
          <p className="mt-6 text-xs text-foreground/50">
            Built for students, institutions, innovation ecosystems, and the future of intelligent workforce development.
          </p>
        </div>
      </section>
    </MarketingShell>
  );
}
