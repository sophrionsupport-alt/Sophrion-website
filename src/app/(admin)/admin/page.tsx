"use client";

import * as React from "react";
import Link from "next/link";
import {
  CalendarDays,
  Users,
  MessageSquare,
  Mail,
  Newspaper,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

type StatKey =
  | "events"
  | "registrations"
  | "contacts"
  | "newsletter"
  | "blog"
  | "careers"
  | "careerApplications";

type StatsState = Record<StatKey, { value: number | null; loading: boolean }>;

async function safeCount(url: string): Promise<number | null> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    const json = await res.json().catch(() => null);

    if (!res.ok || !json?.ok) return null;

    const data = json?.data;
    if (typeof data?.count === "number") return data.count;
    if (Array.isArray(data?.rows)) return data.rows.length;
    if (Array.isArray(data)) return data.length;

    return null;
  } catch {
    return null;
  }
}

const statItems = [
  {
    key: "events" as const,
    title: "Events",
    href: "/admin/events",
    icon: CalendarDays,
  },
  {
    key: "registrations" as const,
    title: "Registrations",
    href: "/admin/registrations",
    icon: Users,
  },
  {
    key: "contacts" as const,
    title: "Contacts",
    href: "/admin/contacts",
    icon: MessageSquare,
  },
  {
    key: "newsletter" as const,
    title: "Newsletter",
    href: "/admin/newsletter",
    icon: Mail,
  },
  {
    key: "blog" as const,
    title: "Blog",
    href: "/admin/blog",
    icon: Newspaper,
  },
  {
    key: "careers" as const,
    title: "Careers",
    href: "/admin/careers",
    icon: Users,
  },
  {
    key: "careerApplications" as const,
    title: "Applications",
    href: "/admin/career-applications",
    icon: Users,
  },
];

const sectionLinks = [
  {
    title: "Events",
    description: "Create, edit, publish, and manage event visibility.",
    href: "/admin/events",
  },
  {
    title: "Registrations",
    description: "Review submissions, approvals, and exports.",
    href: "/admin/registrations",
  },
  {
    title: "Contacts",
    description: "Check messages from students, colleges, and visitors.",
    href: "/admin/contacts",
  },
  {
    title: "Newsletter",
    description: "Manage subscribers and audience communication.",
    href: "/admin/newsletter",
  },
  {
    title: "Blog",
    description: "Handle drafts and published posts.",
    href: "/admin/blog",
  },
  {
    title: "Careers",
    description: "Create and manage job roles.",
    href: "/admin/careers",
  },
  {
    title: "Career applications",
    description: "Review candidates and manage hiring pipeline.",
    href: "/admin/career-applications",
  },
  {
    title: "College requests",
    description: "Review institutional interest and follow up.",
    href: "/admin/college-requests",
  },
];

function StatCard({
  title,
  value,
  loading,
  href,
  icon: Icon,
}: {
  title: string;
  value: number | null;
  loading: boolean;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group rounded-2xl border border-border bg-card/90 p-4 transition backdrop-blur-sm",
        "hover:border-white/15 hover:bg-white/5",
        "shadow-[0_0_0_1px_hsl(var(--border)/0.35)]"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs tracking-wide text-foreground/55">{title}</div>
          <div className="mt-1 text-2xl font-semibold text-foreground">
            {loading ? "…" : value === null ? "—" : value.toLocaleString()}
          </div>
        </div>

        <div
          className={cn(
            "grid h-10 w-10 place-items-center rounded-xl border text-foreground/75",
            "border-white/10 bg-white/3",
            "transition group-hover:border-white/15 group-hover:text-cyan-400"
          )}
        >
          <Icon className="h-4.5 w-4.5" />
        </div>
      </div>
    </Link>
  );
}

function SectionLink({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center justify-between rounded-2xl border px-4 py-3 transition",
        "border-white/10 bg-white/3 backdrop-blur-sm",
        "hover:border-white/15 hover:bg-white/5"
      )}
    >
      <div className="min-w-0">
        <div className="text-sm font-medium text-foreground">{title}</div>
        <div className="mt-0.5 text-xs text-foreground/55">{description}</div>
      </div>

      <ArrowRight className="h-4 w-4 shrink-0 text-foreground/35 transition group-hover:text-[hsl(var(--cyan-400))]" />
    </Link>
  );
}

export default function AdminHomePage() {
  const [stats, setStats] = React.useState<StatsState>({
  events: { value: null, loading: true },
  registrations: { value: null, loading: true },
  contacts: { value: null, loading: true },
  newsletter: { value: null, loading: true },
  blog: { value: null, loading: true },
  careers: { value: null, loading: true },
  careerApplications: { value: null, loading: true },
});

  const [refreshing, setRefreshing] = React.useState(false);

const loadStats = React.useCallback(async () => {
  setRefreshing(true);

  setStats((s) => ({
    events: { ...s.events, loading: true },
    registrations: { ...s.registrations, loading: true },
    contacts: { ...s.contacts, loading: true },
    newsletter: { ...s.newsletter, loading: true },
    blog: { ...s.blog, loading: true },
    careers: { ...s.careers, loading: true },
    careerApplications: { ...s.careerApplications, loading: true },
  }));

  const [
    events,
    registrations,
    contacts,
    newsletter,
    blog,
    careers,
    careerApplications,
  ] = await Promise.all([
    safeCount("/api/admin/events"),
    safeCount("/api/admin/registrations"),
    safeCount("/api/admin/contacts"),
    safeCount("/api/admin/newsletter"),
    safeCount("/api/admin/blog"),
    safeCount("/api/admin/careers"),
    safeCount("/api/admin/career-applications"),
  ]);

  setStats({
    events: { value: events, loading: false },
    registrations: { value: registrations, loading: false },
    contacts: { value: contacts, loading: false },
    newsletter: { value: newsletter, loading: false },
    blog: { value: blog, loading: false },
    careers: { value: careers, loading: false },
    careerApplications: { value: careerApplications, loading: false },
  });

  setRefreshing(false);
}, []);
  React.useEffect(() => {
    loadStats();
  }, [loadStats]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-sm text-foreground/60">
            Core admin areas and live counts in one place.
          </p>
        </div>

        <button
          type="button"
          onClick={loadStats}
          disabled={refreshing}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl border border-white/10 px-3.5 py-2 text-sm backdrop-blur-sm transition",
            "bg-white/3 text-foreground/80 hover:border-white/15 hover:bg-white/5 hover:text-foreground",
            "disabled:cursor-not-allowed disabled:opacity-60"
          )}
        >
          <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
          Refresh
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {statItems.map((item) => (
          <StatCard
            key={item.key}
            title={item.title}
            value={stats[item.key].value}
            loading={stats[item.key].loading}
            href={item.href}
            icon={item.icon}
          />
        ))}
      </div>

      <div
        className={cn(
          "rounded-2xl border border-white/10 bg-card/90 p-5 backdrop-blur-sm",
          "shadow-[0_0_0_1px_hsl(var(--border)/0.35)]"
        )}
      >
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-foreground">All sections</h2>
          <p className="mt-1 text-xs text-foreground/55">
            Keep the dashboard lean. Do the real work inside each section.
          </p>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          {sectionLinks.map((item) => (
            <SectionLink
              key={item.href}
              title={item.title}
              description={item.description}
              href={item.href}
            />
          ))}
        </div>
      </div>
    </div>
  );
}