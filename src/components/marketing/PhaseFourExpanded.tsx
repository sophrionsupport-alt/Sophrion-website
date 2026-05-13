"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils/cn";
import { 
  Rocket, 
  Calendar, 
  Users, 
  Trophy, 
  Briefcase, 
  Target, 
  Zap, 
  Terminal, 
  Database, 
  Palette, 
  Settings,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Award,
  Globe
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

// --- Data ---

const corePurpose = [
  { purpose: "Talent showcase", outcome: "Visibility", icon: Zap },
  { purpose: "Hiring filter", outcome: "Better matches", icon: Target },
  { purpose: "Evaluation simulation", outcome: "Student preparation", icon: ShieldCheck },
  { purpose: "Industry interaction", outcome: "Employer trust", icon: Users },
  { purpose: "Execution proof", outcome: "Credibility", icon: CheckCircle2 },
  { purpose: "Portfolio validation", outcome: "Hiring confidence", icon: Award },
];

const schedule = [
  { 
    day: "Day 1", 
    title: "Portfolio & Pathway Showcase", 
    focus: "Proof-of-work exhibition", 
    desc: "Students showcase deployed systems, dashboards, GitHub repos, design systems, and AI workflows. Builds communication, confidence, and professionalism.",
    color: "border-purple-500/20 bg-purple-500/5 text-purple-400"
  },
  { 
    day: "Day 2", 
    title: "Hiring Challenges", 
    focus: "Pathway-specific problem solving", 
    desc: "Intensive 24h challenges: Build automation workflows, analyze complex datasets, redesign interfaces, or solve operational engineering problems.",
    color: "border-cyan-500/20 bg-cyan-500/5 text-cyan-400"
  },
  { 
    day: "Day 3", 
    title: "Mock Interviews & Reviews", 
    focus: "Technical & Behavioral validation", 
    desc: "Deep-dives into architecture, implementation reasoning, teamwork, and leadership ownership with industry mentors.",
    color: "border-blue-500/20 bg-blue-500/5 text-blue-400"
  },
  { 
    day: "Day 4", 
    title: "Demo Day", 
    focus: "Innovation & Talent Summit", 
    desc: "High-energy startup-style showcase. Product exhibition and talent pitches to a panel of institutional and industry stakeholders.",
    color: "border-indigo-500/20 bg-indigo-500/5 text-indigo-400"
  },
  { 
    day: "Day 5", 
    title: "Recruiter Sprint", 
    focus: "Direct evaluation & interaction", 
    desc: "Companies review portfolios, interact with squads, conduct one-on-one interviews, and shortlist top talent.",
    color: "border-purple-500/20 bg-purple-500/5 text-purple-400"
  },
  { 
    day: "Day 6", 
    title: "Final Evaluation & Matching", 
    focus: "Output determination", 
    desc: "Matching candidates to internships, fellowships, startup squads, or external partner deployments based on performance metrics.",
    color: "border-cyan-500/20 bg-cyan-500/5 text-cyan-400"
  },
  { 
    day: "Day 7", 
    title: "Offers / Fellowship Selection", 
    focus: "Opportunity acceleration", 
    desc: "Final selection announcements and placement onboarding for top contributors and high-performance teams.",
    color: "border-blue-500/20 bg-blue-500/5 text-blue-400"
  },
];

const hiringChallenges = [
  { path: "AI Pathway", challenge: "Build automation workflow", icon: Terminal },
  { path: "Data Pathway", challenge: "Analyze dataset", icon: Database },
  { path: "Design Pathway", challenge: "Redesign interface", icon: Palette },
  { path: "Engineering Pathway", challenge: "Solve operational problem", icon: Settings },
];

const outputTypes = [
  { type: "Internship Opportunities", desc: "Most students", icon: Briefcase },
  { type: "Project Fellowships", desc: "Top contributors", icon: Trophy },
  { type: "Startup Squads", desc: "Internal Sophrion opportunities", icon: Rocket },
  { type: "Advanced Residency", desc: "High performers continue deeper", icon: TrendingUp },
  { type: "Partner Deployments", desc: "Direct team onboarding", icon: Globe },
];

export default function PhaseFourExpanded() {
  return (
    <div className="space-y-24 pb-8">
      {/* Section 1: Identity & Purpose */}
      <section>
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] p-12 text-center">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-cyan-500/5" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-purple-400">Launch Ecosystem</span>
            <h4 className="mt-4 text-3xl font-bold text-white md:text-4xl">Career Launch Week</h4>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-foreground/60">
              An execution-driven hiring and showcase summit where students demonstrate capability and companies evaluate real-world talent.
            </p>
          </motion.div>

          <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {corePurpose.map((item, i) => (
              <motion.div
                key={item.purpose}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex flex-col items-center rounded-2xl bg-white/[0.03] p-6 ring-1 ring-white/5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-cyan-400">
                  <item.icon className="h-5 w-5" />
                </div>
                <h6 className="mt-4 text-[11px] font-bold uppercase tracking-wider text-white">{item.purpose}</h6>
                <p className="mt-1 text-[10px] font-bold text-cyan-500/60">{item.outcome}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: 7-Day Schedule */}
      <section>
        <SectionTitle title="The 7-Day Sprint" subtitle="A high-intensity week of showcase, evaluation, and selection." />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {schedule.map((item, i) => (
            <motion.div
              key={item.day}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "group relative overflow-hidden rounded-2xl border p-6 transition-all duration-500 hover:scale-[1.02]",
                item.color
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.2em] opacity-60">{item.day}</span>
                <Calendar className="h-4 w-4 opacity-40" />
              </div>
              <h5 className="mt-4 text-base font-bold text-white">{item.title}</h5>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-white/40">{item.focus}</p>
              <p className="mt-4 text-xs leading-relaxed text-foreground/50 group-hover:text-foreground/70">{item.desc}</p>
              
              {/* Background accent */}
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/5 blur-3xl" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Section 3: Pathway Challenges */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <section>
          <SectionTitle title="Pathway Hiring Challenges" subtitle="Day 2 Technical Benchmarks" />
          <div className="space-y-3">
            {hiringChallenges.map((item, i) => (
              <div key={item.path} className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5 text-cyan-400">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <h6 className="text-[11px] font-bold uppercase tracking-wider text-foreground/40">{item.path}</h6>
                  <p className="mt-1 text-sm font-bold text-white">{item.challenge}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Output Types */}
        <section>
          <SectionTitle title="Final Output Categories" subtitle="The result of the Launch Week ecosystem." />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {outputTypes.map((out, i) => (
              <div key={out.type} className="group flex items-start gap-4 rounded-xl bg-white/[0.03] p-4 ring-1 ring-white/5 transition-all hover:bg-white/[0.06] hover:ring-white/10">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 transition-colors group-hover:bg-purple-500/20">
                  <out.icon className="h-5 w-5" />
                </div>
                <div>
                  <h6 className="text-xs font-bold text-white">{out.type}</h6>
                  <p className="mt-1 text-[10px] text-foreground/40">{out.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer Call to Action */}
      <section className="rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-transparent p-12 text-center">
        <Trophy className="mx-auto h-10 w-10 text-yellow-500" />
        <h5 className="mt-6 text-2xl font-bold text-white">Acceleration Ecosystem</h5>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-foreground/50">
          The Career Launch Week doesn't just provide interviews—it validates capability and creates direct pathways for top performers into the industry's most innovative companies.
        </p>
      </section>
    </div>
  );
}
