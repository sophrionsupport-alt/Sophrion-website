"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import MarketingShell from "@/components/marketing/MarketingShell";
import MarketingSectionHeader from "@/components/marketing/MarketingSectionHeader";
import FeatureGrid from "@/components/marketing/FeatureGrid";
import JoinForm from "@/components/forms/JoinForm";
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

export default function JoinMarketing() {
  const who = [
    { title: "First-Year Students", body: "Build foundations, digital capability, AI-native workflows, and execution confidence." },
    { title: "Second & Third-Year Students", body: "Explore specialized pathways, collaborative systems, and production-oriented projects." },
    { title: "Final-Year Students", body: "Participate in residency systems, deployment environments, and career acceleration ecosystems." },
    { title: "Builders & Innovators", body: "Work on projects, systems, collaboration environments, and future-ready execution workflows." },
  ];

  const experience = [
    { title: "AI-Native Workflows", body: "Intelligent productivity systems, automation workflows, and AI-assisted execution tools." },
    { title: "Squad-Based Collaboration", body: "Interdisciplinary teams designed around modern startup and product systems." },
    { title: "Production-Oriented Learning", body: "Deployable systems, dashboards, AI tools, and visible proof-of-work." },
    { title: "Sprint Execution", body: "Agile workflows, reviews, accountability systems, and collaborative execution cycles." },
    { title: "Portfolio Development", body: "GitHub repositories, deployed systems, portfolios, and project ecosystems." },
    { title: "Career Acceleration", body: "Practical exposure, execution confidence, and future-ready professional capability." },
  ];

  const pathwaysPreview = [
    { title: "AI Systems", body: "AI applications, automation systems, intelligent products, and modern software ecosystems." },
    { title: "Data Intelligence", body: "Analytics systems, dashboards, AI reporting, and operational intelligence workflows." },
    { title: "Creative AI", body: "UI/UX systems, immersive experiences, AI-assisted creativity, and digital product systems." },
    { title: "Cloud & Cyber", body: "Infrastructure systems, deployment workflows, scalable operations, and security environments." },
    { title: "Smart Engineering", body: "IoT systems, robotics workflows, automation environments, and intelligent infrastructure systems." },
  ];

  const why = [
    { title: "Practical Experience", body: "Work on real systems instead of isolated theoretical assignments." },
    { title: "Public Proof-Of-Work", body: "Visible portfolios, deployments, repositories, and collaborative project systems." },
    { title: "AI Readiness", body: "Familiarity with intelligent workflows and AI-native operational systems." },
    { title: "Collaboration & Communication", body: "Teamwork, execution confidence, and professional communication capability." },
    { title: "Startup-Style Exposure", body: "Sprint systems, collaborative workflows, and production-oriented execution culture." },
    { title: "Future Adaptability", body: "Prepare for rapidly evolving workforce ecosystems and intelligent operational environments." },
  ];

  return (
    <MarketingShell>
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-sm font-semibold tracking-wide text-foreground/70">JOIN SOPHRION</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              <span className="bg-linear-to-l from-[hsl(var(--brand-600))] to-[hsl(var(--cyan-500))] bg-clip-text text-transparent">
                Enter A Future-Ready Execution Ecosystem
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-foreground/75">
              Build practical capability through AI-native workflows, collaborative squads, startup-style execution systems, and production-oriented learning environments.
            </p>
            <p className="mt-3 text-sm text-foreground/55">
              Designed for students, builders, innovators, and future-ready contributors.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Cta href={MARKETING.pathways}>Explore Pathways</Cta>
              <Cta href={MARKETING.contact} primary={false}>
                Contact Team
              </Cta>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-t border-white/10 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MarketingSectionHeader eyebrow="WHO CAN JOIN" title="Built For Future-Focused Learners" />
          <FeatureGrid className="mt-10" items={who} columns={2} />
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MarketingSectionHeader eyebrow="THE EXPERIENCE" title="More Than Traditional Learning" />
          <FeatureGrid className="mt-10" items={experience} columns={3} />
        </div>
      </section>

      <section className="border-t border-white/10 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MarketingSectionHeader eyebrow="PATHWAYS" title="Explore Future-Ready Domains" />
          <FeatureGrid className="mt-10" items={pathwaysPreview} columns={3} />
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MarketingSectionHeader eyebrow="WHY SOPHRION" title="Build Capability That Goes Beyond Certificates" />
          <FeatureGrid className="mt-10" items={why} columns={3} />
        </div>
      </section>

      <section id="join-form" className="scroll-mt-28 border-t border-white/10 py-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <MarketingSectionHeader eyebrow="JOIN THE ECOSYSTEM" title="Start Your Sophrion Journey" />
          <div className="mt-8">
            <JoinForm />
          </div>
        </div>
      </section>

      <section className="py-16 sm:pb-24">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <MarketingSectionHeader align="center" title="Build Beyond Traditional Education" subtitle="Join an AI-native ecosystem designed around execution, collaboration, intelligent systems, and future-ready innovation culture." />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Cta href="#join-form">Join Ecosystem</Cta>
            <Cta href={MARKETING.ecosystem} primary={false}>
              Explore Ecosystem
            </Cta>
          </div>
          <p className="mt-6 text-xs text-foreground/50">
            Sophrion is building the next generation of execution-ready talent through AI-native, production-oriented learning ecosystems.
          </p>
        </div>
      </section>
    </MarketingShell>
  );
}
