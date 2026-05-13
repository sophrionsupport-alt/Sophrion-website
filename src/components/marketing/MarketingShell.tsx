

"use client";


import * as React from "react";
import { cn } from "@/lib/utils/cn";

export default function MarketingShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex min-h-screen flex-col bg-background text-foreground",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[18%] top-[10%] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(closest-side,hsl(var(--ring)/0.18),transparent_70%)]" />
        <div className="absolute right-[8%] top-[26%] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(closest-side,hsl(var(--cyan-500)/0.12),transparent_70%)]" />
      </div>
      {children}
    </div>
  );
}
