"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils/cn";

export type FeatureItem = {
  title: string;
  body: string;
  icon?: React.ReactNode;
};

const GLOW_VARIANTS = [
  "glow-purple",
  "glow-cyan",
  "glow-blue",
  "glow-indigo",
] as const;

function TiltCard({
  children,
  className,
  glowClass,
}: {
  children: React.ReactNode;
  className?: string;
  glowClass: string;
}) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = React.useState<React.CSSProperties>({});

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -3;
      const rotateY = ((x - centerX) / centerX) * 3;

      setTiltStyle({
        transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`,
      });
    },
    []
  );

  const handleMouseLeave = React.useCallback(() => {
    setTiltStyle({
      transform:
        "perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)",
    });
  }, []);

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative rounded-2xl border border-white/[0.08] p-5",
        "bg-white/[0.03] backdrop-blur-lg",
        "transition-all duration-300 ease-out will-change-transform",
        "hover:border-white/[0.14]",
        "shimmer-border",
        glowClass,
        className
      )}
      style={tiltStyle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Ambient hover glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 hover-parent-glow"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, hsl(var(--glow-purple) / 0.06), transparent 60%)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

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
        >
          <TiltCard glowClass={GLOW_VARIANTS[i % 4]}>
            {item.icon ? (
              <div className="mb-3 text-foreground/90">{item.icon}</div>
            ) : null}
            <h3 className="text-base font-semibold text-foreground">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-foreground/70">
              {item.body}
            </p>
          </TiltCard>
        </motion.div>
      ))}
    </div>
  );
}
