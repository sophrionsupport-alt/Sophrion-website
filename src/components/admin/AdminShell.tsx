"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Building2,
  Mail,
  MessageSquare,
  Newspaper,
  Settings,
  GraduationCap,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const DEFAULT_NAV: NavGroup[] = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    label: "Operations",
    items: [
      { label: "Events", href: "/admin/events", icon: CalendarDays },
      { label: "Registrations", href: "/admin/registrations", icon: Users },
      { label: "Colleges", href: "/admin/colleges", icon: Building2 },
      {
        label: "College Requests",
        href: "/admin/college-requests",
        icon: GraduationCap,
      },
    ],
  },
  {
    label: "Communication",
    items: [
      { label: "Contacts", href: "/admin/contacts", icon: MessageSquare },
      { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
    ],
  },
  {
    label: "Content",
    items: [{ label: "Blog", href: "/admin/blog", icon: Newspaper }],
  },
  {
    label: "System",
    items: [{ label: "Settings", href: "/admin/settings", icon: Settings }],
  },
];

export default function AdminShell({
  children,
  nav = DEFAULT_NAV,
  eyebrow = "Admin",
  title = "Dashboard",
  description,
  actions,
}: {
  children: React.ReactNode;
  nav?: NavGroup[];
  eyebrow?: string;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
        <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="h-fit rounded-2xl border border-border bg-card/70 p-3 backdrop-blur">
            <div className="flex items-center justify-between px-2 py-1">
              <Link href="/" className="text-sm font-semibold text-foreground">
                Sophrion
              </Link>
              <span className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                Admin
              </span>
            </div>

            <div className="mt-4 space-y-4">
              {nav.map((group) => (
                <div key={group.label}>
                  <div className="px-2 pb-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground/80">
                    {group.label}
                  </div>

                  <nav className="grid gap-1">
                    {group.items.map((item) => {
                      const active =
                        pathname === item.href ||
                        (item.href !== "/admin" && pathname?.startsWith(item.href));

                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition",
                            active
                              ? "bg-foreground text-background"
                              : "text-foreground/65 hover:bg-muted hover:text-foreground"
                          )}
                        >
                          {Icon ? <Icon className="h-4 w-4 shrink-0" /> : null}
                          <span className="truncate">{item.label}</span>
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t border-border pt-3">
              <Link
                href="/"
                className="px-2 text-sm text-muted-foreground transition hover:text-foreground"
              >
                View site
              </Link>
            </div>
          </aside>

          <section className="min-w-0 rounded-2xl border border-border bg-card">
            <header className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  {eyebrow}
                </div>
                <h1 className="mt-1 text-xl font-semibold text-foreground">
                  {title}
                </h1>
                {description ? (
                  <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                    {description}
                  </p>
                ) : null}
              </div>

              {actions ? (
                <div className="flex flex-wrap items-center gap-2">{actions}</div>
              ) : null}
            </header>

            <main className="p-5">{children}</main>
          </section>
        </div>
      </div>
    </div>
  );
}