"use client";

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

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-xl",
        className
      )}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link
            href={isAdminRoute ? "/admin" : "/"}
            className="inline-flex shrink-0 items-center gap-3"
          >
            <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5 text-sm font-semibold text-white shadow-[0_0_0_1px_hsl(var(--border)/0.35)]">
              S
            </div>

            <div className="leading-tight">
              <div className="text-sm font-semibold text-foreground">
                {isAdminRoute ? "Sophrion Admin" : "Sophrion"}
              </div>
              <div className="text-xs text-foreground/55">
                {isAdminRoute ? "Operations Console" : "Future Within"}
              </div>
            </div>
          </Link>
        </div>

        <Nav />
      </div>
    </header>
  );
}