"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils/cn";

export default function MarketingSectionHeader({
  eyebrow,
  title,
  subtitle,
  className,
  align = "left",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      className={cn(
        align === "center" && "mx-auto max-w-3xl text-center",
        className
      )}
    >
      {eyebrow ? (
        <p className="text-sm font-semibold tracking-wide text-foreground/70">
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "mt-2 text-3xl font-semibold tracking-tight sm:text-4xl",
          align === "center" && "mx-auto"
        )}
      >
        {title}
      </h2>
      {subtitle ? (
        <div className="mt-4 text-base leading-relaxed text-foreground/70 sm:text-lg">
          {subtitle}
        </div>
      ) : null}
    </motion.div>
  );
}
