"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import MarketingShell from "@/components/marketing/MarketingShell";
import MarketingSectionHeader from "@/components/marketing/MarketingSectionHeader";
import FeatureGrid from "@/components/marketing/FeatureGrid";
import PhaseTimeline from "@/components/marketing/PhaseTimeline";
import PhaseOneExpanded from "@/components/marketing/PhaseOneExpanded";
import PhaseTwoExpanded from "@/components/marketing/PhaseTwoExpanded";
import PhaseThreeExpanded from "@/components/marketing/PhaseThreeExpanded";
import PhaseFourExpanded from "@/components/marketing/PhaseFourExpanded";
import { MARKETING } from "@/lib/marketing/links";
import { cn } from "@/lib/utils/cn";

function Cta({ href, children, primary = true }: { href: string; children: React.ReactNode; primary?: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative inline-flex items-center gap-2 overflow-hidden rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300",
        primary
          ? "text-white shadow-[0_10px_30px_-12px_hsl(var(--cyan-500)/0.45)] hover:scale-[1.03] hover:shadow-[0_0_24px_-4px_hsl(var(--cyan-500)/0.45),0_0_12px_-2px_hsl(var(--brand-600)/0.3)]"
          : "border border-white/10 bg-white/[0.03] text-foreground/85 backdrop-blur-sm hover:border-white/[0.15] hover:bg-white/[0.05] hover:text-foreground hover:scale-[1.02]"
      )}
      style={primary ? { background: "linear-gradient(90deg, hsl(var(--brand-600)), hsl(var(--cyan-500)))" } : undefined}
    >
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
      </span>
      {primary && (
        <span
          aria-hidden="true"
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.12] to-transparent transition-transform duration-700 group-hover:translate-x-full"
        />
      )}
    </Link>
  );
}

export default function InstitutionsPage() {
  const challenges = [
    { title: "Employability Gaps", body: "Many students graduate without visible proof-of-work or practical execution exposure." },
    { title: "AI Transformation Pressure", body: "Artificial intelligence is reshaping workflows across every major industry and discipline." },
    { title: "Limited Industry Exposure", body: "Students often lack access to modern operational environments and production workflows." },
    { title: "Outdated Execution Systems", body: "Traditional learning models struggle to adapt to rapidly evolving technological ecosystems." },
    { title: "Weak Portfolio Ecosystems", body: "Many students complete degrees without deployable projects, public repositories, or collaborative execution history." },
    { title: "Innovation Infrastructure Gap", body: "Institutions increasingly require modern innovation ecosystems aligned with future workforce systems." },
  ];

  const why = [
    { title: "Execution-Oriented Learning", body: "Students actively build systems instead of relying only on theoretical instruction." },
    { title: "AI-Native Workflows", body: "Exposure to intelligent productivity systems, automation workflows, and AI-assisted execution environments." },
    { title: "Startup-Style Collaboration", body: "Squad systems, sprint workflows, accountability structures, and production-oriented execution." },
    { title: "Proof-Of-Work Ecosystems", body: "GitHub repositories, deployed systems, dashboards, portfolios, and visible contribution history." },
    { title: "Interdisciplinary Systems", body: "Collaboration across AI, engineering, analytics, design, infrastructure, and operational workflows." },
    { title: "Structured Ecosystem Architecture", body: "A progressive framework combining foundation systems, pathways, residency environments, and career acceleration." },
  ];

  const integration = [
    { title: "Innovation Cells", body: "AI readiness programs, innovation initiatives, and collaborative project ecosystems." },
    { title: "CRT & Placement Systems", body: "Career acceleration environments focused on execution capability and portfolio readiness." },
    { title: "Incubation Centers", body: "Startup culture, innovation systems, and production-oriented collaboration environments." },
    { title: "Departmental Integration", body: "AI, engineering, analytics, infrastructure, design, and interdisciplinary pathways." },
    { title: "Skill Development Initiatives", body: "Modern workflow systems, execution readiness, and AI-native productivity ecosystems." },
    { title: "Project & Residency Programs", body: "Production-oriented collaborative systems integrated into institutional ecosystems." },
  ];

  const programFlow = [
    { 
      title: "Foundation Layer", 
      body: "Professional readiness, AI-native productivity, engineering foundations, and execution systems.",
      renderExpanded: () => <PhaseOneExpanded />
    },
    { 
      title: "Pathway Immersion + Qualification", 
      body: "Future-focused specialized domains and advanced systems validation through collaborative execution.",
      renderExpanded: () => <PhaseTwoExpanded />
    },
    { 
      title: "Integrated Residency", 
      body: "Startup-style production systems, sprint workflows, squad collaboration, and deployment environments.",
      renderExpanded: () => <PhaseThreeExpanded />
    },
    { 
      title: "Career Launch Week", 
      body: "Demo days, hiring systems, portfolio showcases, recruiter interaction, and opportunity acceleration.",
      renderExpanded: () => <PhaseFourExpanded />
    },
  ];

  const benefits = [
    { title: "Improved Employability", body: "Practical capability, collaborative execution experience, and deployable proof-of-work." },
    { title: "AI Readiness", body: "Intelligent systems, AI workflows, automation environments, and modern productivity ecosystems." },
    { title: "Portfolio Visibility", body: "Visible public proof-of-work through repositories, dashboards, deployments, and collaborative systems." },
    { title: "Innovation Culture", body: "Startup-style collaboration, experimentation, accountability, and interdisciplinary execution." },
    { title: "Industry Alignment", body: "Modern workflows aligned with evolving operational and technological ecosystems." },
    { title: "Collaborative Learning", body: "Structured squad environments and production-oriented systems." },
  ];

  const pilot = [
    { title: "Foundation Programs", body: "Professional readiness, AI-native workflows, and execution fundamentals." },
    { title: "Specialized Pathways", body: "AI systems, analytics, design, infrastructure, engineering, and intelligent ecosystems." },
    { title: "Residency Systems", body: "Collaborative execution environments, sprint systems, and production-oriented workflows." },
    { title: "Demo & Showcase Events", body: "Portfolio visibility, project presentations, innovation showcases, and ecosystem exposure." },
    { title: "Innovation Ecosystems", body: "Cross-functional collaboration, interdisciplinary systems, and startup-style execution culture." },
    { title: "Opportunity Acceleration", body: "Career launch systems, hiring exposure, internship ecosystems, and future-ready pathways." },
  ];

  const partnerships = [
    { title: "Institutional Pilots", body: "Foundation programs, pathway systems, and residency deployment ecosystems." },
    { title: "Innovation Collaborations", body: "AI initiatives, project systems, hackathons, and interdisciplinary innovation ecosystems." },
    { title: "Industry Ecosystems", body: "Industry-aligned pathways, operational workflows, and collaborative execution systems." },
    { title: "Startup & Incubation Partnerships", body: "Innovation culture, startup workflows, and production-oriented environments." },
    { title: "Workshops & Bootcamps", body: "AI-native productivity, engineering modernization, execution systems, future workforce readiness." },
    { title: "Showcase & Talent Events", body: "Demo days, innovation showcases, project ecosystems, and recruiter interaction environments." },
  ];

  return (
    <MarketingShell>
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MarketingSectionHeader
            eyebrow="FOR INSTITUTIONS"
            title="Future-Ready Innovation Ecosystems For Educational Institutions"
            subtitle="Sophrion helps institutions modernize employability systems, AI readiness, innovation culture, and execution-oriented learning environments through structured ecosystem integration."
          />
          <p className="mt-4 text-sm text-foreground/60">
            Built for colleges, universities, innovation ecosystems, and future workforce transformation.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Cta href={MARKETING.contact}>Partner With Sophrion</Cta>
            <Cta href={MARKETING.ecosystem} primary={false}>
              Explore Ecosystem
            </Cta>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MarketingSectionHeader eyebrow="THE CHALLENGE" title="The Workforce Is Evolving Faster Than Traditional Academic Systems" subtitle="Institutions today face increasing pressure to improve employability, integrate AI readiness, modernize practical learning systems, and align students with rapidly evolving industry expectations." />
          <FeatureGrid className="mt-10" items={challenges} columns={3} />
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MarketingSectionHeader eyebrow="WHY SOPHRION" title="An AI-Native Career Acceleration Ecosystem" subtitle="Sophrion combines learning, execution, production systems, collaborative workflows, AI-native productivity, and portfolio ecosystems into a unified future-ready framework." />
          <FeatureGrid className="mt-10" items={why} columns={3} />
        </div>
      </section>

      <section className="border-t border-white/10 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MarketingSectionHeader eyebrow="INTEGRATION MODEL" title="Flexible Institutional Integration" subtitle="Sophrion is designed to integrate flexibly into existing academic ecosystems, innovation environments, and institutional initiatives." />
          <FeatureGrid className="mt-10" items={integration} columns={3} />
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MarketingSectionHeader eyebrow="PROGRAM ARCHITECTURE" title="A Structured Multi-Layer Learning & Execution Ecosystem" subtitle="Students progress through structured transformation systems designed around execution capability, AI-native workflows, collaborative learning, and production-oriented environments." align="center" />
          <PhaseTimeline className="mt-10" steps={programFlow} />
        </div>
      </section>

      <section className="border-t border-white/10 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MarketingSectionHeader eyebrow="OUTCOMES & BENEFITS" title="Building Future-Ready Student Ecosystems" subtitle="Sophrion is designed to improve practical capability, innovation culture, AI readiness, and execution confidence across institutional environments." />
          <FeatureGrid className="mt-10" items={benefits} columns={3} />
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MarketingSectionHeader eyebrow="IMPLEMENTATION MODEL" title="Structured Pilot & Ecosystem Deployment" subtitle="Sophrion can be deployed through structured pilot ecosystems customized around institutional goals, departments, and innovation initiatives." />
          <FeatureGrid className="mt-10" items={pilot} columns={3} />
        </div>
      </section>

      <section className="border-t border-white/10 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MarketingSectionHeader eyebrow="THE FUTURE" title="Preparing Institutions For The Intelligent Economy" subtitle="Artificial intelligence, automation, and intelligent infrastructure are transforming the future workforce at unprecedented speed. Sophrion supports this transition through scalable, future-ready ecosystem architecture." />
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MarketingSectionHeader eyebrow="PARTNERSHIP ECOSYSTEMS" title="Collaboration Opportunities" />
          <FeatureGrid className="mt-10" items={partnerships} columns={3} />
        </div>
      </section>

      <section className="border-t border-white/10 py-16 sm:pb-24">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <MarketingSectionHeader align="center" title="Build A Future-Ready Institutional Ecosystem" subtitle="Partner with Sophrion to enable AI-native learning systems, production-oriented execution environments, collaborative innovation culture, and future-ready workforce transformation." />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Cta href={MARKETING.contact}>Partner With Sophrion</Cta>
            <Cta href={MARKETING.contact} primary={false}>
              Contact Us
            </Cta>
          </div>
          <p className="mt-6 text-xs text-foreground/50">
            Sophrion combines AI-native workflows, execution systems, collaborative production environments, and innovation ecosystems into a unified future-ready institutional framework.
          </p>
        </div>
      </section>
    </MarketingShell>
  );
}
