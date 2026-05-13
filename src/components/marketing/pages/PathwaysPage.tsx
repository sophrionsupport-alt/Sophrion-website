"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import MarketingShell from "@/components/marketing/MarketingShell";
import MarketingSectionHeader from "@/components/marketing/MarketingSectionHeader";
import FeatureGrid from "@/components/marketing/FeatureGrid";
import { MARKETING, PATHWAY_ANCHORS } from "@/lib/marketing/links";
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
    <section id={id} className="scroll-mt-28 border-t border-white/10 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <MarketingSectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card/70 p-5">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground/55">Learning areas</h3>
            <ul className="mt-3 space-y-2 text-sm text-foreground/75">
              {learning.map((x) => (
                <li key={x}>• {x}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card/70 p-5">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground/55">Sample projects</h3>
            <ul className="mt-3 space-y-2 text-sm text-foreground/75">
              {projects.map((x) => (
                <li key={x}>• {x}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card/70 p-5">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground/55">Tools & systems</h3>
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
  const overview = [
    { title: "Intelligent Software & AI Systems", body: "AI-powered applications, automation systems, SaaS platforms, cloud workflows, and intelligent digital infrastructure." },
    { title: "Data Intelligence & AI Analytics", body: "Analytics systems, dashboards, machine learning workflows, forecasting, and AI-powered business intelligence." },
    { title: "Digital Experience & Creative AI", body: "UI/UX systems, immersive experiences, AI-assisted creative workflows, interaction systems, and digital product design." },
    { title: "Cloud Infrastructure & Cyber Systems", body: "Cloud operations, scalable infrastructure, deployment workflows, security systems, and intelligent operations environments." },
    { title: "Applied Engineering & Smart Systems", body: "IoT systems, robotics workflows, industrial AI, smart infrastructure, automation systems, and engineering modernization." },
  ];

  const experience = [
    { title: "Squad-Based Collaboration", body: "Interdisciplinary teams inside collaborative execution systems." },
    { title: "Sprint Workflows", body: "Agile systems, delivery cycles, accountability reviews, and iterative execution." },
    { title: "AI-Native Productivity", body: "AI-assisted learning, automation workflows, intelligent execution systems, and modern tooling." },
    { title: "Production Systems", body: "Deployable projects, real workflows, collaborative systems, and visible outputs." },
    { title: "Mentor Guidance", body: "Technical reviews, pathway mentorship, execution feedback, and collaborative support." },
    { title: "Public Proof-Of-Work", body: "GitHub repositories, deployed systems, dashboards, portfolios, and contribution ecosystems." },
  ];

  const outputs = [
    { title: "AI Systems", body: "Assistants, automation workflows, intelligent tools, and AI-powered applications." },
    { title: "Dashboards & Analytics", body: "Operational dashboards, analytics ecosystems, forecasting, monitoring platforms." },
    { title: "SaaS Products", body: "Modern web applications, productivity systems, workflow tools, collaborative platforms." },
    { title: "Design Systems", body: "Interfaces, branding ecosystems, immersive experiences, digital product systems." },
    { title: "Engineering Projects", body: "IoT systems, automation environments, smart infrastructure, intelligent engineering." },
    { title: "Portfolio Ecosystems", body: "Repositories, deployment links, presentations, documentation, public proof-of-work." },
  ];

  return (
    <MarketingShell>
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MarketingSectionHeader
            eyebrow="FUTURE-READY PATHWAYS"
            title="Explore Specialized Ecosystems Built For The Future Workforce"
            subtitle="Sophrion pathways are designed around emerging industries, AI-native workflows, intelligent systems, collaborative execution, and production-oriented learning environments."
          />
          <p className="mt-4 max-w-2xl text-sm text-foreground/60">
            Each pathway combines learning, execution, projects, production systems, mentorship, and proof-of-work ecosystems.
          </p>
        </div>
      </section>

      <section className="border-t border-white/10 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MarketingSectionHeader align="center" eyebrow="PATHWAY ARCHITECTURE" title="Future-Focused Domains Aligned With Intelligent Industries" subtitle="Students progress through specialized pathways designed to build practical capability, AI-native productivity, collaborative execution experience, and deployable portfolio systems." />
          <FeatureGrid className="mt-12" items={overview} columns={3} />
        </div>
      </section>

      <DeepDive
        id="pathway-ai-systems"
        eyebrow="PATHWAY 01"
        title="Intelligent Software & AI Systems"
        subtitle="Build AI-native applications, automation systems, scalable digital platforms, intelligent workflows, and modern software ecosystems."
        learning={["AI Software Engineering", "AI Agent Systems", "Full-Stack Systems", "Cloud & DevOps Intelligence", "Cyber Intelligence & Security"]}
        projects={["AI assistants", "workflow automation systems", "SaaS products", "productivity tools", "AI orchestration systems", "intelligent dashboards"]}
        tools={["GitHub", "APIs", "AI tooling", "deployment platforms", "cloud systems", "modern development workflows"]}
      />
      <DeepDive
        id="pathway-data-intelligence"
        eyebrow="PATHWAY 02"
        title="Data Intelligence & AI Analytics"
        subtitle="Work with modern analytics ecosystems, forecasting systems, AI-powered reporting, dashboards, and intelligent data workflows."
        learning={["Data Analytics", "Data Science", "AI & Business Intelligence", "Data Engineering", "Applied AI Research"]}
        projects={["analytics dashboards", "forecasting systems", "recommendation engines", "institutional analytics", "reporting systems", "intelligent monitoring systems"]}
        tools={["dashboards", "visualization tools", "AI analytics systems", "databases", "automation workflows", "reporting ecosystems"]}
      />
      <DeepDive
        id="pathway-creative-ai"
        eyebrow="PATHWAY 03"
        title="Digital Experience & Creative AI"
        subtitle="Design intelligent digital experiences, immersive interfaces, AI-assisted creative systems, and future-ready product ecosystems."
        learning={["UI/UX Systems", "Creative AI Workflows", "Product Experience Engineering", "Digital Branding & Strategy", "Immersive Experiences"]}
        projects={["product redesigns", "immersive interfaces", "AI-generated campaigns", "portfolio systems", "startup branding kits", "interactive experiences"]}
        tools={["design systems", "creative workflows", "AI visual tools", "interface systems", "motion systems", "product ecosystems"]}
      />
      <DeepDive
        id="pathway-cloud-cyber"
        eyebrow="PATHWAY 04"
        title="Cloud Infrastructure & Cyber Systems"
        subtitle="Build scalable infrastructure systems, deployment environments, intelligent operations workflows, and modern security ecosystems."
        learning={["Cloud Infrastructure", "Deployment Systems", "Cybersecurity Systems", "Infrastructure Automation", "Intelligent Operations"]}
        projects={["cloud deployments", "infrastructure dashboards", "monitoring systems", "secure authentication systems", "deployment pipelines", "automation workflows"]}
        tools={["cloud platforms", "deployment systems", "infrastructure workflows", "security systems", "monitoring tools", "DevOps workflows"]}
      />
      <DeepDive
        id="pathway-smart-engineering"
        eyebrow="PATHWAY 05"
        title="Applied Engineering & Smart Systems"
        subtitle="Build intelligent engineering systems combining automation, IoT, industrial AI, robotics, infrastructure systems, and smart operational environments."
        learning={["IoT & Smart Systems", "Robotics & Automation", "Industrial AI Systems", "Embedded Intelligence", "Smart Infrastructure Systems"]}
        projects={["smart monitoring systems", "robotics prototypes", "IoT dashboards", "automation systems", "intelligent infrastructure platforms", "smart campus systems"]}
        tools={["sensors", "IoT systems", "embedded platforms", "monitoring systems", "automation tools", "engineering workflows"]}
      />

      <section className="border-t border-white/10 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MarketingSectionHeader eyebrow="HOW STUDENTS LEARN" title="Production-Oriented Learning Environments" subtitle="Students do not simply consume content. They build, collaborate, deploy, experiment, and contribute through structured execution ecosystems." />
          <FeatureGrid className="mt-10" items={experience} columns={3} />
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MarketingSectionHeader eyebrow="WHAT STUDENTS BUILD" title="Deployable Systems & Visible Proof-Of-Work" />
          <FeatureGrid className="mt-10" items={outputs} columns={3} />
        </div>
      </section>

      <section className="border-t border-white/10 py-16 sm:pb-24">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <MarketingSectionHeader align="center" title="Enter A Future-Ready Learning Ecosystem" subtitle="Explore AI-native pathways designed around intelligent systems, collaborative execution, production environments, and modern workforce transformation." />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Cta href={MARKETING.join}>Join Ecosystem</Cta>
            <Cta href={MARKETING.residency} primary={false}>
              Explore Residency
            </Cta>
          </div>
          <p className="mt-6 text-xs text-foreground/50">
            Pathways combine learning, execution, AI-native workflows, production systems, and visible proof-of-work into unified future-ready ecosystems.
          </p>
          <p className="mt-4 text-xs text-foreground/40">
            Quick anchors:{" "}
            <Link className="underline hover:text-[hsl(var(--cyan-500))]" href={PATHWAY_ANCHORS.ai}>
              AI Systems
            </Link>
            {" · "}
            <Link className="underline hover:text-[hsl(var(--cyan-500))]" href={PATHWAY_ANCHORS.data}>
              Data
            </Link>
            {" · "}
            <Link className="underline hover:text-[hsl(var(--cyan-500))]" href={PATHWAY_ANCHORS.creative}>
              Creative AI
            </Link>
            {" · "}
            <Link className="underline hover:text-[hsl(var(--cyan-500))]" href={PATHWAY_ANCHORS.cloud}>
              Cloud & Cyber
            </Link>
            {" · "}
            <Link className="underline hover:text-[hsl(var(--cyan-500))]" href={PATHWAY_ANCHORS.engineering}>
              Smart Engineering
            </Link>
          </p>
        </div>
      </section>
    </MarketingShell>
  );
}
