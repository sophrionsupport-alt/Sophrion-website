"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils/cn";
import { 
  Cpu, 
  Database, 
  Palette, 
  Settings, 
  Activity,
  Layers,
  ChevronRight,
  Terminal,
  Zap
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

const pathways = [
  {
    title: "Intelligent Software & AI Systems",
    identity: "Building intelligent digital products, AI systems, automations, and scalable software infrastructure.",
    icon: Cpu,
    glow: "glow-purple",
    subPaths: [
      { name: "AI Software Engineering", focus: "full-stack development, AI integrations, APIs, SaaS systems, intelligent applications" },
      { name: "AI Agent Systems", focus: "autonomous workflows, multi-agent systems, memory systems, reasoning systems, orchestration" },
      { name: "Cloud & DevOps Intelligence", focus: "cloud deployment, scalable systems, CI/CD, AI infrastructure, monitoring" },
      { name: "Cyber Intelligence & Security", focus: "cybersecurity, AI security, ethical hacking, secure systems" },
      { name: "Intelligent Mobile Systems", focus: "Android/iOS, AI mobile integrations, smart assistants" },
    ],
    projects: [
      { sub: "AI Software Engineering", items: ["AI SaaS apps", "chatbots", "workflow systems", "AI assistants"] },
      { sub: "AI Agent Systems", items: ["research agents", "scheduling agents", "AI operations systems"] },
      { sub: "Cloud & DevOps Intelligence", items: ["deploy AI products", "production environments"] },
      { sub: "Cyber Intelligence & Security", items: ["vulnerability systems", "secure login systems", "monitoring dashboards"] },
      { sub: "Intelligent Mobile Systems", items: ["mobile productivity apps", "AI mobile tools"] },
    ]
  },
  {
    title: "Data Intelligence & AI Analytics",
    identity: "Extracting intelligence from data.",
    icon: Database,
    glow: "glow-cyan",
    subPaths: [
      { name: "Data Analytics", focus: "dashboards, visualization, reporting, business insights" },
      { name: "Data Science", focus: "ML models, predictive systems, experimentation" },
      { name: "AI & Business Intelligence", focus: "decision systems, AI-powered reporting, forecasting" },
      { name: "Data Engineering", focus: "pipelines, ETL, databases, architecture" },
      { name: "Applied AI Research", focus: "experimentation, model evaluation, optimization" },
    ],
    projects: [
      { sub: "Data Analytics", items: ["institutional analytics", "placement analytics", "business dashboards"] },
      { sub: "Data Science", items: ["prediction systems", "recommendation engines"] },
      { sub: "AI & Business Intelligence", items: ["AI strategy dashboards", "smart reporting systems"] },
      { sub: "Data Engineering", items: ["scalable data systems"] },
      { sub: "Applied AI Research", items: ["mini research prototypes", "benchmark studies"] },
    ]
  },
  {
    title: "Digital Experience & Creative AI",
    identity: "Human-centered intelligent experiences.",
    icon: Palette,
    glow: "glow-blue",
    subPaths: [
      { name: "UI/UX Design", focus: "product design, interface systems, usability, design systems" },
      { name: "Creative AI & Media", focus: "AI image systems, AI video workflows, AI storytelling, synthetic media" },
      { name: "Product Experience Engineering", focus: "frontend systems, interaction design, animations, immersive UX" },
      { name: "Digital Branding & Strategy", focus: "branding, growth systems, digital positioning" },
      { name: "Immersive & Spatial Experiences", focus: "AR/VR, spatial UX, immersive interaction" },
    ],
    projects: [
      { sub: "UI/UX Design", items: ["app redesigns", "student platforms"] },
      { sub: "Creative AI & Media", items: ["AI campaigns", "content engines", "branded experiences"] },
      { sub: "Product Experience Engineering", items: ["modern product interfaces", "interactive systems"] },
      { sub: "Digital Branding & Strategy", items: ["startup branding kits", "marketing systems"] },
    ]
  },
  {
    title: "Applied Engineering & Industrial AI",
    identity: "Industry + hardware + operations.",
    icon: Settings,
    glow: "glow-indigo",
    subPaths: [
      { name: "IoT & Smart Systems", focus: "sensors, automation, smart monitoring" },
      { name: "Robotics & Automation", focus: "robotics workflows, automation systems" },
      { name: "Industrial AI Systems", focus: "predictive maintenance, manufacturing AI, operational intelligence" },
      { name: "Embedded Intelligence", focus: "embedded systems, edge AI, microcontrollers" },
      { name: "Smart Infrastructure & Energy Systems", focus: "energy analytics, smart grids, infrastructure systems" },
    ],
    projects: [
      { sub: "IoT & Smart Systems", items: ["smart classrooms", "industrial monitoring"] },
      { sub: "Robotics & Automation", items: ["robotic prototypes", "automated systems"] },
      { sub: "Industrial AI Systems", items: ["AI production monitoring"] },
      { sub: "Embedded Intelligence", items: ["intelligent embedded products"] },
      { sub: "Smart Infrastructure & Energy Systems", items: ["campus energy monitoring"] },
    ]
  },
  {
    title: "Future-Ready Engineering Systems",
    identity: "Engineering Modernization Through AI & Smart Systems.",
    icon: Activity,
    glow: "glow-purple",
    subPaths: [
      { name: "Smart Mechanical Systems", focus: "CAD + AI, simulation systems, digital manufacturing, smart maintenance, industrial automation" },
      { name: "Civil Intelligence & Smart Infrastructure", focus: "smart infrastructure, BIM systems, AI-assisted planning, GIS basics, digital construction workflows" },
      { name: "Electrical & Smart Energy Systems", focus: "smart grids, energy monitoring, IoT systems, industrial automation, AI-assisted electrical systems" },
      { name: "Industrial IoT & Automation", focus: "sensors, industrial IoT, automation systems, edge AI, smart monitoring" },
      { name: "Engineering Design Systems", focus: "engineering visualization, CAD presentations, technical storytelling, product rendering, industrial UI systems, simulation visualization" },
      { name: "Robotics & Intelligent Systems", focus: "robotics, embedded intelligence, automation logic" },
    ],
    projects: [
      { sub: "Smart Mechanical Systems", items: ["predictive maintenance dashboard", "smart manufacturing monitor", "automated machine analysis", "AI-assisted design systems"] },
      { sub: "Civil Intelligence & Smart Infrastructure", items: ["smart campus planning", "infrastructure monitoring", "digital twin concepts", "AI-assisted estimation systems"] },
      { sub: "Electrical & Smart Energy Systems", items: ["smart energy dashboard", "campus power monitoring", "AI energy optimization", "automated fault detection"] },
      { sub: "Industrial IoT & Automation", items: ["smart attendance devices", "environmental monitoring", "industrial automation demos"] },
      { sub: "Engineering Design Systems", items: ["industrial product showcases", "engineering simulation visuals", "smart infrastructure interfaces"] },
    ]
  }
];

// --- Main Component ---

export default function PhaseTwoExpanded() {
  const [activePathway, setActivePathway] = React.useState(0);

  return (
    <div className="space-y-16 pb-8">
      {/* Section 1: Core Pathways Selection */}
      <section>
        <SectionTitle 
          title="Pathway Immersion Architecture" 
          subtitle="Specialized domain expertise developed through intelligent workflows and professional-grade execution systems."
        />
        
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Navigation Tabs */}
          <div className="space-y-3 lg:col-span-4">
            {pathways.map((path, idx) => (
              <button
                key={path.title}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePathway(idx);
                }}
                className={cn(
                  "group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-500",
                  activePathway === idx 
                    ? "border-white/20 bg-white/[0.08] shadow-[0_0_24px_-4px_rgba(0,0,0,0.4)]" 
                    : "border-white/[0.04] bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.03]"
                )}
              >
                <div className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-500",
                  activePathway === idx ? "bg-white/10 ring-1 ring-white/20" : "bg-white/[0.05]"
                )}>
                  <path.icon className={cn(
                    "h-5 w-5 transition-colors",
                    activePathway === idx ? "text-cyan-400" : "text-foreground/40 group-hover:text-foreground/60"
                  )} />
                </div>
                <div className="min-w-0">
                  <h5 className={cn(
                    "text-sm font-bold transition-colors",
                    activePathway === idx ? "text-white" : "text-foreground/60 group-hover:text-foreground/80"
                  )}>
                    {path.title}
                  </h5>
                  <p className="mt-0.5 truncate text-[10px] uppercase tracking-wider text-foreground/40">{path.identity}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Detailed Content View */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePathway}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={cn(
                  "rounded-3xl border border-white/[0.08] bg-white/[0.02] p-8 backdrop-blur-xl",
                  pathways[activePathway].glow
                )}
              >
                <div className="mb-8">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-500/80">Pathway Structure</span>
                  <h4 className="mt-2 text-2xl font-bold text-white">{pathways[activePathway].title}</h4>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/60">{pathways[activePathway].identity}</p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {pathways[activePathway].subPaths.map((sub, i) => (
                    <motion.div 
                      key={sub.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="rounded-2xl bg-white/[0.03] p-5 ring-1 ring-white/[0.05] transition-all hover:bg-white/[0.05]"
                    >
                      <h6 className="flex items-center gap-2 text-sm font-bold text-white">
                        <div className="h-1 w-1 rounded-full bg-cyan-500" />
                        {sub.name}
                      </h6>
                      <p className="mt-2 text-[11px] leading-relaxed text-foreground/40">
                        {sub.focus.split(", ").map(f => (
                          <span key={f} className="mr-2 inline-block">#{f}</span>
                        ))}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Section 2: Example Projects Grid */}
      <section>
        <SectionTitle 
          title="Pathway Execution Benchmarks" 
          subtitle="Real-world production systems and intelligent prototypes developed during the Pathway Immersion layer."
        />
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pathways[activePathway].projects.map((proj, i) => (
            <motion.div
              key={proj.sub}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all hover:border-white/[0.12] hover:bg-white/[0.04]"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-cyan-400/60" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">{proj.sub}</span>
                </div>
                <div className="h-1.5 w-1.5 rounded-full bg-cyan-500/40 group-hover:bg-cyan-500" />
              </div>
              
              <div className="space-y-2">
                {proj.items.map(item => (
                  <div key={item} className="flex items-center gap-2.5">
                    <ChevronRight className="h-3 w-3 text-cyan-500/50" />
                    <span className="text-xs text-foreground/70 group-hover:text-foreground/90">{item}</span>
                  </div>
                ))}
              </div>

              {/* Hover effect */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Summary Footer */}
      <section className="rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-transparent p-8 text-center">
        <Zap className="mx-auto h-8 w-8 text-cyan-500" />
        <h5 className="mt-4 text-xl font-bold text-white">Qualification Layer Integration</h5>
        <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-foreground/50">
          Following Pathway Immersion, students enter the Qualification Layer—validating technical capabilities through advanced systems architecture and large-scale collaborative projects.
        </p>
      </section>
    </div>
  );
}
