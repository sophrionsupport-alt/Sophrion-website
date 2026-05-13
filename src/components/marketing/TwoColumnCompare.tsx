"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils/cn";

export default function TwoColumnCompare({
  leftTitle,
  leftItems,
  rightTitle,
  rightItems,
  className,
}: {
  leftTitle: string;
  leftItems: string[];
  rightTitle: string;
  rightItems: string[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-6 lg:grid-cols-2 lg:gap-8",
        className
      )}
    >
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-lg transition-all duration-300 hover:border-white/[0.12] glow-indigo"
      >
        <h3 className="text-lg font-semibold text-foreground">{leftTitle}</h3>
        <ul className="mt-4 space-y-2.5 text-sm text-foreground/75">
          {leftItems.map((t) => (
            <li key={t} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/30" />
              {t}
            </li>
          ))}
        </ul>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 12 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative rounded-2xl border border-[hsl(var(--cyan-500)/0.2)] bg-[hsl(var(--brand-600)/0.06)] p-6 backdrop-blur-lg transition-all duration-300 hover:border-[hsl(var(--cyan-500)/0.3)] glow-cyan shimmer-border"
      >
        <h3 className="text-lg font-semibold text-foreground">{rightTitle}</h3>
        <ul className="mt-4 space-y-2.5 text-sm text-foreground/80">
          {rightItems.map((t) => (
            <li key={t} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[hsl(var(--cyan-500)/0.6)]" />
              {t}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
