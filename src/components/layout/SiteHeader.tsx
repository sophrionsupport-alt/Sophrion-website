"use client";

import * as React from "react";
import Link from "next/link";
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
        "sticky top-0 z-50 overflow-hidden transition-all duration-300",
        scrolled
          ? [
              "border-b border-white/12",
              "bg-[hsl(var(--background)/0.97)]",
              "backdrop-blur-2xl",
              "shadow-[0_12px_40px_-16px_rgba(0,0,0,0.85)]",
            ]
          : [
              "border-b border-white/8",
              "bg-[hsl(var(--background)/0.78)]",
              "backdrop-blur-xl",
            ],
        className
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 transition-opacity duration-300",
          scrolled ? "opacity-100" : "opacity-70"
        )}
        style={{
          background: scrolled
            ? `
              linear-gradient(to bottom, rgba(3,6,18,0.88), rgba(3,6,18,0.72)),
              radial-gradient(900px circle at 20% -20%, rgba(124,58,237,0.18), transparent 40%),
              radial-gradient(900px circle at 80% -30%, rgba(34,211,238,0.14), transparent 42%)
            `
            : `
              linear-gradient(to bottom, rgba(3,6,18,0.42), rgba(3,6,18,0.28)),
              radial-gradient(900px circle at 20% -20%, rgba(124,58,237,0.10), transparent 38%),
              radial-gradient(900px circle at 80% -30%, rgba(34,211,238,0.08), transparent 40%)
            `,
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/12"
      />

      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 h-px transition-opacity duration-300",
          scrolled ? "opacity-100 bg-white/12" : "opacity-60 bg-white/8"
        )}
      />

      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-2 sm:px-6 lg:px-8">
        <Link
          href={isAdminRoute ? "/admin" : "/"}
          className="inline-flex shrink-0 items-center gap-3"
        >
          <img
            src="/images/brand/symbol-logo.png"
            alt="Sophrion"
            className="h-9 w-9 object-contain"
          />

          <div className="leading-tight">
            <div className="text-sm font-semibold text-foreground">
              {isAdminRoute ? "Sophrion Admin" : "Sophrion"}
            </div>
            <div className="text-xs text-foreground/60">
              {isAdminRoute ? "Operations Console" : "Future Within"}
            </div>
          </div>
        </Link>

        <Nav className="justify-end" />
      </div>
    </header>
  );
}