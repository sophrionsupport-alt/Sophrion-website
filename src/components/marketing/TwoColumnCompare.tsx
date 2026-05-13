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
        className="rounded-2xl border border-white/10 bg-white/3 p-6 backdrop-blur"
      >
        <h3 className="text-lg font-semibold text-foreground">{leftTitle}</h3>
        <ul className="mt-4 space-y-2 text-sm text-foreground/75">
          {leftItems.map((t) => (
            <li key={t}>• {t}</li>
          ))}
        </ul>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 12 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl border border-[hsl(var(--cyan-500)/0.25)] bg-[hsl(var(--brand-600)/0.08)] p-6 backdrop-blur"
      >
        <h3 className="text-lg font-semibold text-foreground">{rightTitle}</h3>
        <ul className="mt-4 space-y-2 text-sm text-foreground/80">
          {rightItems.map((t) => (
            <li key={t}>• {t}</li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
