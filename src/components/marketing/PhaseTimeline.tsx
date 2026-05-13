"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils/cn";
import { Plus, X } from "lucide-react";

export type PhaseStep = {
  title: string;
  body: string;
  renderExpanded?: () => React.ReactNode;
};

const GLOW_VARIANTS = [
  "glow-purple",
  "glow-cyan",
  "glow-blue",
  "glow-indigo",
] as const;

export default function PhaseTimeline({
  steps,
  className,
}: {
  steps: PhaseStep[];
  className?: string;
}) {
  const [selectedPhase, setSelectedPhase] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (selectedPhase !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedPhase]);

  return (
    <>
      <ol className={cn("mx-auto max-w-4xl space-y-4", className)}>
        {steps.map((step, i) => {
          const isExpandable = !!step.renderExpanded;

          return (
            <li key={step.title} className="relative">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                onClick={() => isExpandable && setSelectedPhase(i)}
                className={cn(
                  "group relative z-10 cursor-default rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl transition-all duration-500",
                  isExpandable && "cursor-pointer hover:border-white/[0.18] hover:bg-white/[0.05] hover:scale-[1.01]",
                  GLOW_VARIANTS[i % 4]
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40 transition-colors group-hover:text-foreground/60">
                      Phase 0{i + 1}
                    </p>
                    <h3 className="mt-1.5 text-xl font-bold tracking-tight text-foreground">{step.title}</h3>
                    <p className="mt-2.5 text-[15px] leading-relaxed text-foreground/65">{step.body}</p>
                  </div>
                  
                  {isExpandable && (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] transition-all duration-500 group-hover:border-white/20 group-hover:bg-white/5">
                      <Plus className="h-5 w-5 text-foreground/40 transition-colors group-hover:text-foreground" />
                    </div>
                  )}
                </div>
              </motion.div>

              {i < steps.length - 1 && (
                <div className="flex justify-center py-2">
                  <div className="h-8 w-px bg-gradient-to-b from-white/10 to-transparent" />
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {/* Cinematic Modal */}
      <AnimatePresence>
        {selectedPhase !== null && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPhase(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={cn(
                "relative z-10 flex h-full max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#050505]/80 p-1 shadow-[0_0_100px_-20px_rgba(0,0,0,0.5)] backdrop-blur-3xl md:p-2",
                GLOW_VARIANTS[selectedPhase % 4]
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/[0.08] px-8 py-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-500">
                    Deep Dive • Phase 0{selectedPhase + 1}
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-white">{steps[selectedPhase].title}</h2>
                </div>
                <button
                  onClick={() => setSelectedPhase(null)}
                  className="group flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.02] transition-all hover:border-white/20 hover:bg-white/10"
                >
                  <X className="h-6 w-6 text-foreground/40 transition-colors group-hover:text-white" />
                </button>
              </div>

              {/* Content Scroll Area */}
              <div className="flex-1 overflow-y-auto px-8 py-10 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
                <div className="mx-auto max-w-5xl">
                  {steps[selectedPhase].renderExpanded?.()}
                </div>
              </div>

              {/* Brochure Button - Fixed at bottom right */}
              <div className="absolute bottom-10 right-10 z-20">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group flex items-center gap-3 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-6 py-3 text-sm font-bold text-cyan-400 backdrop-blur-xl transition-all hover:border-cyan-500/50 hover:bg-cyan-500/20 hover:shadow-[0_0_20px_-5px_rgba(6,182,212,0.5)]"
                >
                  <Plus className="h-4 w-4 rotate-45 transition-transform group-hover:rotate-0" />
                  <span>Download Brochure</span>
                </motion.button>
              </div>

              {/* Decorative side glow */}
              <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-white/[0.03] to-transparent" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
