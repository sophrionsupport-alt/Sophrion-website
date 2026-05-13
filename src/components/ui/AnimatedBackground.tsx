"use client";

import * as React from "react";

const ORBS = [
  {
    color: "hsl(262 83% 58% / 0.08)",
    size: "40rem",
    left: "10%",
    top: "5%",
    duration: "22s",
    delay: "0s",
  },
  {
    color: "hsl(188 86% 48% / 0.06)",
    size: "35rem",
    left: "65%",
    top: "15%",
    duration: "26s",
    delay: "-6s",
  },
  {
    color: "hsl(217 91% 60% / 0.05)",
    size: "30rem",
    left: "40%",
    top: "55%",
    duration: "30s",
    delay: "-12s",
  },
  {
    color: "hsl(239 84% 67% / 0.06)",
    size: "38rem",
    left: "80%",
    top: "65%",
    duration: "24s",
    delay: "-4s",
  },
  {
    color: "hsl(262 83% 58% / 0.04)",
    size: "28rem",
    left: "25%",
    top: "75%",
    duration: "28s",
    delay: "-10s",
  },
];

export default function AnimatedBackground() {
  const spotlightRef = React.useRef<HTMLDivElement>(null);
  const mouseRef = React.useRef({ x: 0, y: 0 });
  const rafRef = React.useRef<number>(0);

  React.useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      if (spotlightRef.current) {
        const { x, y } = mouseRef.current;
        spotlightRef.current.style.transform = `translate(${x - 300}px, ${y - 300}px)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Floating gradient orbs */}
      {ORBS.map((orb, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.left,
            top: orb.top,
            background: `radial-gradient(closest-side, ${orb.color}, transparent 70%)`,
            animation: `float-orb ${orb.duration} ease-in-out infinite`,
            animationDelay: orb.delay,
            willChange: "transform",
          }}
        />
      ))}

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), " +
            "linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.6) 0%, transparent 70%)",
        }}
      />

      {/* Mouse-reactive spotlight */}
      <div
        ref={spotlightRef}
        className="absolute"
        style={{
          width: "600px",
          height: "600px",
          background:
            "radial-gradient(closest-side, hsl(262 83% 58% / 0.06), hsl(188 86% 48% / 0.03), transparent 70%)",
          borderRadius: "50%",
          willChange: "transform",
          transform: "translate(-300px, -300px)",
        }}
      />
    </div>
  );
}
