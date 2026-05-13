"use client";

import * as React from "react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const GLOW_CLASSES = {
  purple: "glow-purple",
  cyan: "glow-cyan",
  blue: "glow-blue",
  indigo: "glow-indigo",
} as const;

type GlowColor = keyof typeof GLOW_CLASSES;

type Props = React.HTMLAttributes<HTMLDivElement> & {
  glow?: boolean;
  glowColor?: GlowColor;
  surface?: "card" | "glass";
  interactive?: boolean;
  tilt?: boolean;
};

export default function Card({
  className,
  glow = false,
  glowColor,
  surface = "card",
  interactive = false,
  tilt = false,
  children,
  onMouseMove: onMouseMoveProp,
  onMouseLeave: onMouseLeaveProp,
  style: styleProp,
  ...props
}: Props) {
  const [tiltStyle, setTiltStyle] = React.useState<React.CSSProperties>({});
  const cardRef = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      onMouseMoveProp?.(e);
      if (!tilt || !cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      setTiltStyle({
        transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`,
      });
    },
    [tilt, onMouseMoveProp]
  );

  const handleMouseLeave = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      onMouseLeaveProp?.(e);
      if (!tilt) return;
      setTiltStyle({
        transform: "perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)",
      });
    },
    [tilt, onMouseLeaveProp]
  );

  const base =
    "relative rounded-2xl border shadow-soft transition-all duration-300 ease-out";

  const surfaces = {
    card: "bg-card text-card-foreground border-border",
    glass:
      "bg-white/[0.03] text-foreground border-white/[0.08] backdrop-blur-xl supports-[backdrop-filter]:bg-white/[0.03]",
  } as const;

  return (
    <div
      ref={cardRef}
      className={cn(
        base,
        surfaces[surface],
        interactive && "hover:bg-white/[0.05] hover:border-white/[0.15]",
        glow &&
          "hover:border-brand-500/35 hover:shadow-glow focus-within:ring-2 focus-within:ring-ring/40",
        glowColor && GLOW_CLASSES[glowColor],
        tilt && "will-change-transform",
        className
      )}
      style={{ ...styleProp, ...tiltStyle }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </div>
  );
}