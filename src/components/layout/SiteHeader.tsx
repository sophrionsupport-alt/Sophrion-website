"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Nav from "./Nav";
import { cn } from "@/lib/utils/cn";

type Props = {
  className?: string;
};

export default function SiteHeader({ className }: Props) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "relative z-50 sticky top-0 transition-all duration-500 ease-out",
        scrolled
          ? [
              "border-b border-white/[0.1]",
              "shadow-[0_12px_48px_-16px_rgba(0,0,0,0.9),0_0_1px_0_rgba(255,255,255,0.05)]",
            ]
          : [
              "border-b border-white/[0.06]",
            ],
        className
      )}
    >
      {/* Multi-layer glassmorphism background */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 transition-all duration-500",
          scrolled ? "opacity-100" : "opacity-80"
        )}
        style={{
          backdropFilter: scrolled ? "blur(24px) saturate(1.4)" : "blur(16px) saturate(1.2)",
          WebkitBackdropFilter: scrolled ? "blur(24px) saturate(1.4)" : "blur(16px) saturate(1.2)",
          background: scrolled
            ? `
              linear-gradient(to bottom, rgba(3,6,18,0.92), rgba(3,6,18,0.78)),
              radial-gradient(900px circle at 20% -20%, rgba(124,58,237,0.15), transparent 40%),
              radial-gradient(900px circle at 80% -30%, rgba(34,211,238,0.10), transparent 42%)
            `
            : `
              linear-gradient(to bottom, rgba(3,6,18,0.55), rgba(3,6,18,0.35)),
              radial-gradient(900px circle at 20% -20%, rgba(124,58,237,0.08), transparent 38%),
              radial-gradient(900px circle at 80% -30%, rgba(34,211,238,0.06), transparent 40%)
            `,
        }}
      />

      {/* Top edge glow line */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 10%, rgba(124,58,237,0.2) 35%, rgba(34,211,238,0.25) 50%, rgba(124,58,237,0.2) 65%, transparent 90%)",
        }}
      />

      {/* Bottom edge glow line */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 h-px transition-opacity duration-500",
          scrolled ? "opacity-100" : "opacity-40"
        )}
        style={{
          background:
            "linear-gradient(90deg, transparent 15%, rgba(124,58,237,0.15) 35%, rgba(34,211,238,0.2) 50%, rgba(124,58,237,0.15) 65%, transparent 85%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-17 items-center justify-between gap-4 py-3">
          <Link
            href={isAdminRoute ? "/admin" : "/"}
            className="inline-flex min-w-0 shrink-0 items-center gap-3 transition-opacity duration-200 hover:opacity-90"
          >
            <Image
              src="/images/brand/symbol-logo.png"
              alt="Sophrion"
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
            />

            <div className="min-w-0 leading-tight">
              <div className="truncate text-sm font-semibold text-foreground">
                {isAdminRoute ? "Sophrion Admin" : "Sophrion"}
              </div>
              <div className="truncate text-xs text-foreground/60">
                {isAdminRoute ? "Operations Console" : "Future-Ready Execution Ecosystem"}
              </div>
            </div>
          </Link>

          <Nav className="flex-1 justify-end" />
        </div>
      </div>
    </header>
  );
}