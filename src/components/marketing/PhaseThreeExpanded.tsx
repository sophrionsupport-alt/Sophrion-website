"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils/cn";
import { 
  Users, 
  Layers, 
  Terminal, 
  ShieldCheck, 
  BarChart3, 
  Zap, 
  Cpu, 
  Database, 
  Palette, 
  Settings,
  Layout,
  Globe,
  Clock,
  Target,
  CheckCircle2,
  TrendingUp,
  MessageSquare
} from "lucide-react";

// --- Sub-components ---

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-10">
      <h4 className="text-2xl font-bold tracking-tight text-white">{title}</h4>
      {subtitle && <p className="mt-2 text-sm text-foreground/50">{subtitle}</p>}
    </div>
  );
}

// --- Sections ---

const weeklySystem = [
  { layer: "Advanced Learning", purpose: "Skill progression", icon: Layers, color: "text-purple-400" },
  { layer: "Squad Execution", purpose: "Real work", icon: Users, color: "text-cyan-400" },
  { layer: "Sprint Review", purpose: "Accountability", icon: ShieldCheck, color: "text-blue-400" },
  { layer: "Mentor Guidance", purpose: "Feedback", icon: MessageSquare, color: "text-indigo-400" },
  { layer: "Production Output", purpose: "Visible delivery", icon: Zap, color: "text-yellow-400" },
];

const squadRoles = [
  {
    category: "Technical Roles",
    roles: ["AI Engineer", "Full Stack Associate", "Data Analyst", "Automation Associate"],
    icon: Terminal,
    color: "bg-purple-500/10 border-purple-500/20 text-purple-400"
  },
  {
    category: "Creative Roles",
    roles: ["UX Designer", "Brand Systems Associate", "Content Systems Associate"],
    icon: Palette,
    color: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
  },
  {
    category: "Engineering Roles",
    roles: ["Smart Systems Associate", "IoT Associate", "Infrastructure Associate"],
    icon: Settings,
    color: "bg-blue-500/10 border-blue-500/20 text-blue-400"
  },
  {
    category: "Operational Roles",
    roles: ["Sprint Lead", "Documentation Lead", "QA Associate", "Research Associate"],
    icon: Layout,
    color: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
  }
];

const advancedLearning = [
  { path: "AI Pathway", topics: ["RAG systems", "vector databases", "AI orchestration"], icon: Cpu },
  { path: "Data Pathway", topics: ["forecasting", "advanced dashboards", "analytics pipelines"], icon: Database },
  { path: "Design Pathway", topics: ["design systems", "interaction engineering"], icon: Palette },
  { path: "Engineering Pathway", topics: ["digital twins", "industrial simulation", "IoT systems"], icon: Settings },
];

const productionOutputs = [
  { category: "Institutional Systems", items: ["dashboards", "AI assistants", "analytics systems", "workflow tools"], icon: Layout },
  { category: "Deployable Products", items: ["SaaS prototypes", "automation tools", "productivity systems"], icon: Globe },
  { category: "Operational Systems", items: ["reporting pipelines", "communication systems", "digital infrastructure"], icon: Cpu },
  { category: "Portfolio Assets", items: ["GitHub repositories", "case studies", "design systems", "presentations", "deployment links"], icon: Zap },
];

export default function PhaseThreeExpanded() {
  return (
    <div className="space-y-24 pb-8">
      {/* Hero Section: Residency Identity */}
      <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] p-12 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-cyan-500">Live Execution Environment</span>
          <h4 className="mt-4 text-3xl font-bold text-white md:text-4xl">Integrated Residency & Production System</h4>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-foreground/60">
            Transforming students from learners into execution contributors through startup simulation and production-grade residency.
          </p>
          
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-5">
            {[
              { label: "Build", desc: "Work in squads" },
              { label: "Operate", desc: "Contribute systems" },
              { label: "Contribute", desc: "Advanced learning" },
              { label: "Qualify", desc: "Mentor reviews" },
              { label: "Deploy", desc: "Production output" }
            ].map((step, i) => (
              <div key={step.label} className="flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/20">
                  <span className="text-xs font-bold">→</span>
                </div>
                <h6 className="mt-3 text-sm font-bold text-white">{step.label}</h6>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-foreground/40">{step.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Section 1: Structure & Weekly System */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <section>
          <SectionTitle title="Residency Structure" subtitle="Flexible models designed for deep institutional integration." />
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8">
            <div className="flex items-center gap-4">
              <Clock className="h-6 w-6 text-cyan-400" />
              <div>
                <h6 className="text-lg font-bold text-white">8–16 Weeks Duration</h6>
                <p className="text-sm text-foreground/40">Flexible execution formats</p>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {["Semester-integrated", "Summer-intensive", "Hybrid Weekends", "IN-college model"].map(format => (
                <div key={format} className="rounded-xl bg-white/[0.02] p-4 ring-1 ring-white/5 transition-colors hover:bg-white/[0.05]">
                  <span className="text-xs font-bold text-foreground/70">{format}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <SectionTitle title="Weekly Execution System" subtitle="The heartbeat of residency accountability." />
          <div className="space-y-3">
            {weeklySystem.map((item, i) => (
              <motion.div
                key={item.layer}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04]"
              >
                <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/[0.05]", item.color)}>
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h6 className="text-sm font-bold text-white">{item.layer}</h6>
                  <p className="text-[11px] text-foreground/50">{item.purpose}</p>
                </div>
                <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* Section 2: Squad Architecture */}
      <section>
        <SectionTitle title="Interdisciplinary Squad Architecture" subtitle="Mimicking high-performance startup structures with role-based accountability." />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {squadRoles.map((cat, i) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all hover:bg-white/[0.04]"
            >
              <div className={cn("mb-6 flex h-12 w-12 items-center justify-center rounded-xl ring-1", cat.color)}>
                <cat.icon className="h-6 w-6" />
              </div>
              <h6 className="text-sm font-bold text-white">{cat.category}</h6>
              <div className="mt-4 space-y-2">
                {cat.roles.map(role => (
                  <div key={role} className="flex items-center gap-2 text-[11px] text-foreground/50 transition-colors group-hover:text-foreground/70">
                    <div className="h-1 w-1 rounded-full bg-white/20" />
                    {role}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Section 3: Advanced Learning & Outputs */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <section>
          <SectionTitle title="Advanced Learning Layer" />
          <div className="space-y-4">
            {advancedLearning.map((item, i) => (
              <div key={item.path} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5 text-cyan-400" />
                  <h6 className="text-sm font-bold text-white">{item.path}</h6>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.topics.map(topic => (
                    <span key={topic} className="rounded-lg bg-white/[0.04] px-3 py-1 text-xs text-foreground/60 ring-1 ring-white/10">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle title="Production Output Categories" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {productionOutputs.map((out, i) => (
              <div key={out.category} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.05] text-cyan-400">
                  <out.icon className="h-5 w-5" />
                </div>
                <h6 className="text-sm font-bold text-white">{out.category}</h6>
                <div className="mt-3 space-y-1.5">
                  {out.items.map(item => (
                    <p key={item} className="text-[11px] text-foreground/40">• {item}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Section 4: Evaluation & Strategic Advantage */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <section>
          <SectionTitle title="Final Evaluation Structure" />
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-8">
            <div className="space-y-6">
              {[
                { label: "Execution Contribution", weight: 30 },
                { label: "Sprint Consistency", weight: 20 },
                { label: "Project Quality", weight: 20 },
                { label: "Collaboration", weight: 10 },
                { label: "Communication", weight: 10 },
                { label: "Learning Progression", weight: 10 },
              ].map((item, i) => (
                <div key={item.label}>
                  <div className="mb-2 flex justify-between text-xs">
                    <span className="font-bold text-foreground/70">{item.label}</span>
                    <span className="font-bold text-cyan-400">{item.weight}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.05]">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.weight}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <SectionTitle title="Hidden Strategic Advantage" />
          <div className="space-y-4">
            {[
              { asset: "Student contribution graph", value: "Talent intelligence", icon: TrendingUp },
              { asset: "Project delivery history", value: "Institutional trust", icon: Globe },
              { asset: "Residency metrics", value: "Hiring signals", icon: BarChart3 },
              { asset: "Mentor reviews", value: "Qualification credibility", icon: CheckCircle2 },
              { asset: "Production repositories", value: "Portfolio ecosystem", icon: Database },
            ].map((item, i) => (
              <div key={item.asset} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h6 className="text-sm font-bold text-white">{item.asset}</h6>
                    <p className="text-[10px] uppercase tracking-wider text-cyan-500/60">{item.value}</p>
                  </div>
                </div>
                <Target className="h-4 w-4 text-white/10" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
