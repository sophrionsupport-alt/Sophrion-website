"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils/cn";

export type FeatureItem = {
  title: string;
  body: string;
  icon?: React.ReactNode;
};

export default function FeatureGrid({
  items,
  columns = 3,
  className,
}: {
  items: FeatureItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}) {
  const col =
    columns === 2
      ? "md:grid-cols-2"
      : columns === 4
        ? "md:grid-cols-2 lg:grid-cols-4"
        : "md:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={cn("grid gap-5", col, className)}>
      {items.map((item, i) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, delay: i * 0.05 }}
          className="rounded-2xl border border-border bg-card/80 p-5 backdrop-blur-sm"
        >
          {item.icon ? (
            <div className="mb-3 text-foreground/90">{item.icon}</div>
          ) : null}
          <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-foreground/70">
            {item.body}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
