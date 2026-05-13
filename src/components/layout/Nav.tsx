"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Plus, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import SignOutButton from "@/components/auth/SignOutButton";
import { MARKETING } from "@/lib/marketing/links";

type NavLink = { label: string; href: string };

const publicLinks: NavLink[] = [
  { label: "About", href: MARKETING.about },
  { label: "Ecosystem", href: MARKETING.ecosystem },
  { label: "Pathways", href: MARKETING.pathways },
  { label: "Residency", href: MARKETING.residency },
  { label: "Institutions", href: MARKETING.institutions },
  { label: "Contact", href: MARKETING.contact },
];

const adminLinks: NavLink[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Events", href: "/admin/events" },
  { label: "Registrations", href: "/admin/registrations" },
  { label: "Contacts", href: "/admin/contacts" },
  { label: "Newsletter", href: "/admin/newsletter" },
  { label: "Blog", href: "/admin/blog" },
];

const adminQuickLinks = [
  { title: "New event", href: "/admin/events/new", primary: true },
  { title: "New blog", href: "/admin/blog/new", primary: false },
];

type Props = {
  className?: string;
  onRefresh?: () => void;
  refreshing?: boolean;
};

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Nav({
  className,
  onRefresh,
  refreshing = false,
}: Props) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");
  const links = isAdminRoute ? adminLinks : publicLinks;
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 1024) setOpen(false);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (isAdminRoute) {
    return (
      <div className={cn("flex min-w-0 items-center", className)}>
        <div className="hidden min-w-0 flex-1 items-center justify-end gap-3 lg:flex">
          <nav className="flex min-w-0 items-center justify-end gap-1">
            {links.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname === item.href ||
                    pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-white/10 text-white"
                      : "text-foreground/72 hover:bg-white/6 hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            {adminQuickLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-sm transition",
                  item.primary
                    ? [
                        "text-white",
                        "bg-linear-to-r from-[hsl(var(--brand-600))] to-[hsl(var(--cyan-500))]",
                        "shadow-[0_10px_30px_-12px_hsl(var(--cyan-500)/0.45)] hover:opacity-95",
                      ]
                    : [
                        "border border-white/10 bg-white/3 text-foreground/85 backdrop-blur-sm",
                        "hover:border-white/15 hover:bg-white/5 hover:text-foreground",
                      ]
                )}
              >
                <Plus className="h-4 w-4" />
                {item.title}
              </Link>
            ))}
            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                disabled={refreshing}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/10 px-3.5 py-2 text-sm backdrop-blur-sm transition",
                  "bg-white/3 text-foreground/80 hover:border-white/15 hover:bg-white/5 hover:text-foreground",
                  "disabled:cursor-not-allowed disabled:opacity-60"
                )}
              >
                <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
                Refresh
              </button>
            )}
            <SignOutButton />
          </div>
        </div>
        <div className="lg:hidden">
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((p) => !p)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-foreground/85 backdrop-blur-sm transition hover:border-white/15 hover:bg-white/8"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {open && (
          <div className="absolute left-0 right-0 top-full z-50 mt-2 px-4 sm:px-6 lg:hidden">
            <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl border border-white/10 bg-[hsl(var(--background)/0.96)] shadow-xl backdrop-blur-2xl">
              <nav className="flex flex-col p-2">
                {links.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-xl px-4 py-3 text-sm font-medium text-foreground/80 hover:bg-white/6"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="border-t border-white/10 p-3">
                <div className="flex flex-col gap-2">
                  {adminQuickLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm"
                    >
                      <Plus className="h-4 w-4" />
                      {item.title}
                    </Link>
                  ))}
                  {onRefresh && (
                    <button
                      type="button"
                      onClick={onRefresh}
                      disabled={refreshing}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm"
                    >
                      <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
                      Refresh
                    </button>
                  )}
                  <SignOutButton />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("relative flex min-w-0 flex-1 items-center justify-end", className)}>
      {/* Desktop public */}
      <div className="hidden w-full min-w-0 items-center gap-4 lg:grid lg:grid-cols-[1fr_auto_1fr]">
        <div className="min-w-0" />
        <nav className="flex min-w-0 flex-wrap items-center justify-center gap-1">
          {publicLinks.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "shrink-0 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-white/10 text-white"
                    : "text-foreground/72 hover:bg-white/6 hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex min-w-0 items-center justify-end gap-2">
          <Link
            href={MARKETING.pathways}
            className="shrink-0 rounded-xl border border-white/10 bg-white/3 px-3 py-2 text-xs font-semibold text-foreground/85 backdrop-blur-sm transition hover:bg-white/6 sm:text-sm"
          >
            Explore Pathways
          </Link>
          <Link
            href={MARKETING.join}
            className="shrink-0 rounded-xl px-3 py-2 text-xs font-semibold text-white shadow-lg transition hover:opacity-95 sm:text-sm"
            style={{
              background:
                "linear-gradient(90deg, hsl(var(--brand-600)), hsl(var(--cyan-500)))",
            }}
          >
            Join Ecosystem
          </Link>
        </div>
      </div>

      {/* Mobile trigger */}
      <div className="lg:hidden">
        <button
          type="button"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          onClick={() => setOpen((p) => !p)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-foreground/85 backdrop-blur-sm transition hover:border-white/15 hover:bg-white/8"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile fullscreen overlay */}
      {open ? (
        <div className="fixed inset-0 z-[100] flex flex-col bg-[hsl(var(--background)/0.97)] backdrop-blur-2xl lg:hidden">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
            <span className="text-sm font-semibold text-foreground">Menu</span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-6">
            <Link
              href={MARKETING.home}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-4 text-lg font-medium text-foreground/90 hover:bg-white/6"
            >
              Home
            </Link>
            {publicLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-xl px-4 py-4 text-lg font-medium hover:bg-white/6",
                  isActive(pathname, item.href)
                    ? "bg-white/10 text-white"
                    : "text-foreground/85"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="border-t border-white/10 p-4 space-y-3">
            <Link
              href={MARKETING.join}
              onClick={() => setOpen(false)}
              className="flex w-full items-center justify-center rounded-xl py-3 text-sm font-semibold text-white"
              style={{
                background:
                  "linear-gradient(90deg, hsl(var(--brand-600)), hsl(var(--cyan-500)))",
              }}
            >
              Join Ecosystem
            </Link>
            <Link
              href={`${MARKETING.contact}?topic=partnership`}
              onClick={() => setOpen(false)}
              className="flex w-full items-center justify-center rounded-xl border border-white/10 py-3 text-sm font-semibold text-foreground/85"
            >
              Partner With Sophrion
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
