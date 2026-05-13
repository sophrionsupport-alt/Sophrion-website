"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils/cn";
import { 
  Briefcase, 
  Brain, 
  Code, 
  Terminal, 
  Cpu, 
  Globe, 
  Zap, 
  UserCircle,
  CheckCircle2,
  Clock,
  Layout,
  Target
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

// --- Section 1: Modules ---
const modules = [
  {
    id: "01",
    name: "Career Readiness Foundations",
    purpose: "Build professional mindset and employability readiness",
    icon: Briefcase,
    topics: ["Communication Skills", "Presentation & Public Speaking", "Professional Etiquette", "Resume Foundations", "LinkedIn Optimization", "Time Management", "Team Collaboration", "Problem-Solving Mindset"],
    deliverables: ["LinkedIn Profile", "Professional Bio", "Resume Draft", "Introductory Presentation"],
    hours: "12–15 Hours",
    glow: "glow-purple"
  },
  {
    id: "02",
    name: "Analytical Intelligence Systems",
    purpose: "Strengthen analytical thinking and placement readiness",
    icon: Brain,
    topics: ["Quantitative Aptitude", "Logical Reasoning", "Pattern Recognition", "Analytical Thinking", "Problem Decomposition", "Mental Models", "Time-Based Problem Solving"],
    deliverables: ["Daily Assessments", "Team Challenges", "Timed Aptitude Simulations"],
    hours: "18–24 Hours",
    glow: "glow-cyan"
  },
  {
    id: "03",
    name: "Digital Engineering Foundations",
    purpose: "Create strong computational and digital foundations",
    icon: Code,
    topics: ["Programming Logic", "Variables & Functions", "Loops & Conditional Flows", "Problem Solving", "Computational Structures", "Computational Thinking", "API Fundamentals", "Debugging Mindset"],
    deliverables: ["Logic Challenges", "Mini Coding Tasks", "Problem-Solving Exercises"],
    hours: "24–30 Hours",
    glow: "glow-blue"
  },
  {
    id: "04",
    name: "Modern Development Workflow Systems",
    purpose: "Introduce modern industry-standard workflows",
    icon: Terminal,
    topics: ["VS Code", "Terminal Basics", "Git", "GitHub", "Branching Strategies", "Documentation Standards", "Markdown", "Collaboration Workflows"],
    deliverables: ["GitHub Repositories", "Pull Request Simulations", "Team Collaboration Exercises"],
    hours: "16–20 Hours",
    glow: "glow-indigo"
  },
  {
    id: "05",
    name: "AI-Native Workflow Systems",
    purpose: "Build AI-native productivity and execution capability",
    icon: Cpu,
    topics: ["Prompt Engineering Foundations", "AI Research Workflows", "AI-Assisted Learning", "AI Productivity Systems", "AI-Assisted Debugging", "AI Content Generation", "Responsible AI Usage & Ethics"],
    deliverables: ["AI-Assisted Assignments", "Workflow Exercises", "AI Productivity Showcase"],
    hours: "16–20 Hours",
    glow: "glow-purple"
  },
  {
    id: "06",
    name: "Digital Infrastructure & Deployment Systems",
    purpose: "Help students understand modern digital infrastructure",
    icon: Globe,
    topics: ["Internet Fundamentals", "Hosting Basics", "Domains & DNS", "Deployment Workflows", "Cloud Introduction", "APIs & Integrations", "Security Awareness"],
    deliverables: ["Deployed Mini Project", "Published Portfolio", "Connected Domain/Project"],
    hours: "14–18 Hours",
    glow: "glow-cyan"
  },
  {
    id: "07",
    name: "Startup Execution Systems",
    purpose: "Introduce startup-style execution culture",
    icon: Zap,
    topics: ["Agile Fundamentals", "Sprint Workflows", "Task Management Systems", "Product Thinking", "Team Standups", "Ownership Culture", "Documentation Culture"],
    deliverables: ["Mini Sprint Project", "Team Presentations", "Weekly Demonstrations"],
    hours: "12–16 Hours",
    glow: "glow-blue"
  },
  {
    id: "08",
    name: "Portfolio & Professional Identity Systems",
    purpose: "Build visible proof of skill and professional identity",
    icon: UserCircle,
    topics: ["GitHub Optimization", "Portfolio Development", "LinkedIn Branding", "Documentation Standards", "Project Storytelling", "Presentation Systems"],
    deliverables: ["Optimized GitHub Profile", "Portfolio Website", "LinkedIn Presence", "Deployed Project", "Team Project Showcase", "Resume Foundation"],
    hours: "10–14 Hours",
    glow: "glow-indigo"
  }
];

// --- Main Component ---

export default function PhaseOneExpanded() {
  return (
    <div className="space-y-24 pb-8">
      {/* Section 1: Module Architecture */}
      <section>
        <SectionTitle 
          title="Foundation Layer Architecture" 
          subtitle="Execution-first capability development systems designed for professional readiness, AI-native productivity, and engineering foundations."
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {modules.map((mod, idx) => (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-500 hover:border-white/[0.15] hover:bg-white/[0.04]",
                mod.glow
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.05] ring-1 ring-white/10 group-hover:ring-white/20">
                  <mod.icon className="h-6 w-6 text-foreground/70 transition-colors group-hover:text-white" />
                </div>
                <span className="text-xs font-bold tracking-widest text-foreground/30">M{mod.id}</span>
              </div>

              <div className="mt-5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-500/80">{mod.purpose}</p>
                <h5 className="mt-1 text-lg font-bold text-white">{mod.name}</h5>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-foreground/40">Core Topics</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {mod.topics.map(topic => (
                      <span key={topic} className="rounded-md bg-white/[0.04] px-2 py-0.5 text-[11px] text-foreground/60 ring-1 ring-white/[0.05]">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-end justify-between gap-4 pt-2">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-foreground/40">Deliverables</p>
                    <p className="mt-1 text-xs text-foreground/70">{mod.deliverables.join(" • ")}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="flex items-center gap-1.5 text-foreground/40">
                      <Clock className="h-3.5 w-3.5" />
                      <span className="text-xs font-bold text-foreground/60">{mod.hours}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Hover highlight overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Section 2: Roadmap */}
      <section>
        <SectionTitle title="Foundation Layer Execution Structure" />
        <div className="relative rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8 backdrop-blur-md">
          {/* Timeline Pipeline Line */}
          <div className="absolute left-8 top-[100px] bottom-8 hidden w-px bg-gradient-to-b from-cyan-500/50 via-purple-500/50 to-transparent md:block md:left-1/2" />
          
          <div className="space-y-12">
            {[
              { week: "Week 1", title: "Professional Readiness + Analytical Thinking", outcome: "Communication, Aptitude, Professional Identity", color: "text-purple-400" },
              { week: "Week 2", title: "Programming Logic + Development Workflows", outcome: "Digital & Engineering Capability", color: "text-cyan-400" },
              { week: "Week 3", title: "AI Systems + Infrastructure Foundations", outcome: "AI-Native Productivity & Deployment Awareness", color: "text-blue-400" },
              { week: "Week 4", title: "Startup Execution + Portfolio Building", outcome: "Collaboration, Execution & Public Proof", color: "text-indigo-400" },
            ].map((step, idx) => (
              <motion.div 
                key={step.week}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={cn(
                  "relative flex flex-col gap-6 md:flex-row md:items-center",
                  idx % 2 === 0 ? "md:flex-row-reverse" : ""
                )}
              >
                {/* Node */}
                <div className="absolute left-[-33px] top-0 h-6 w-6 rounded-full bg-black ring-2 ring-white/20 ring-offset-4 ring-offset-black md:left-1/2 md:ml-[-12px]">
                  <div className="absolute inset-1 rounded-full bg-cyan-500 shadow-[0_0_12px_hsl(var(--cyan-500))]" />
                </div>

                <div className="flex-1 md:w-1/2">
                  <div className={cn(
                    "rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05]",
                    idx % 2 === 0 ? "md:text-right" : ""
                  )}>
                    <span className={cn("text-xs font-bold uppercase tracking-[0.2em]", step.color)}>{step.week}</span>
                    <h6 className="mt-2 text-lg font-bold text-white">{step.title}</h6>
                    <div className={cn("mt-4 flex items-center gap-2", idx % 2 === 0 ? "md:justify-end" : "")}>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/40">Outcome:</span>
                      <span className="text-xs text-foreground/70">{step.outcome}</span>
                    </div>
                  </div>
                </div>
                <div className="hidden flex-1 md:block md:w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3 & 4: Stats & Schedule */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section>
          <SectionTitle title="Recommended Engagement" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              { label: "Guided Training", value: "120 - 150", sub: "Hours", icon: Target },
              { label: "Practice & Labs", value: "40 - 60", sub: "Hours", icon: Code },
              { label: "Team Projects", value: "20 - 30", sub: "Hours", icon: Zap },
              { label: "Total Engagement", value: "180 - 220", sub: "Hours", icon: Clock },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05]">
                    <stat.icon className="h-4 w-4 text-cyan-400" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-foreground/40">{stat.label}</span>
                </div>
                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold text-white">{stat.value}</span>
                  <span className="text-xs text-foreground/40">{stat.sub}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle title="Recommended Daily Structure" />
          <div className="space-y-3">
            {[
              { time: "1.5–2h", label: "Concept Session", desc: "Core architectural instruction" },
              { time: "1.5–2h", label: "Guided Practical Lab", desc: "Hands-on execution training" },
              { time: "1h", label: "Team/Sprint Work", desc: "Collaborative project building" },
              { time: "45m", label: "Review & Assessment", desc: "Showcase & technical validation" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04]"
              >
                <div className="flex h-12 w-20 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-xs font-bold text-cyan-400 ring-1 ring-cyan-500/20">
                  {item.time}
                </div>
                <div>
                  <h6 className="text-sm font-bold text-white">{item.label}</h6>
                  <p className="text-[11px] text-foreground/50">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* Section 5: Outcomes */}
      <section>
        <SectionTitle title="Student Outcomes After Foundation Layer" />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Outputs */}
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-8">
            <h6 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-cyan-400">
              <Layout className="h-4 w-4" />
              Tangible Outputs
            </h6>
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {["GitHub Profile", "LinkedIn Profile", "Resume Foundation", "Portfolio Website", "Deployed Mini Project", "Collaborative Team Project", "AI-Assisted Workflow", "Sprint Execution", "Professional Presentation"].map((out, i) => (
                <div key={out} className="flex items-center gap-3 rounded-xl bg-white/[0.03] p-3 ring-1 ring-white/5">
                  <div className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                  <span className="text-xs text-foreground/80">{out}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Expected Outcomes */}
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-8">
            <h6 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-purple-400">
              <CheckCircle2 className="h-4 w-4" />
              Expected Outcomes
            </h6>
            <ul className="mt-8 space-y-4">
              {[
                "Communicate professionally in digital environments",
                "Solve structured logical & analytical problems",
                "Use Git & GitHub confidently for version control",
                "Work in collaborative startup-style squads",
                "Use AI tools productively for research & coding",
                "Deploy and manage basic digital projects",
                "Present technical work confidently to peers",
                "Build and maintain a professional online presence"
              ].map((item, i) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="mt-1 h-4 w-4 shrink-0 text-purple-500/60">
                    <CheckCircle2 className="h-full w-full" />
                  </div>
                  <span className="text-sm leading-snug text-foreground/70">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
