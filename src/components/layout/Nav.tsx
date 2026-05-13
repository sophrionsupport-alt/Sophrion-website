"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Plus, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import SignOutButton from "@/components/auth/SignOutButton";

type NavLink = {
  label: string;
  href: string;
};

const publicLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "For Students", href: "/students" },
  { label: "College Partnerships", href: "/colleges" },
  { label: "Products & Services", href: "/products" },
  { label: "Contact", href: "/contact" },
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
  {
    title: "New event",
    href: "/admin/events/new",
    primary: true,
  },
  {
    title: "New blog",
    href: "/admin/blog/new",
    primary: false,
  },
];

type Props = {
  className?: string;
  onRefresh?: () => void;
  refreshing?: boolean;
};

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
      if (window.innerWidth >= 1024) {
        setOpen(false);
      }
    }

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className={cn("flex min-w-0 items-center", className)}>
      {/* Desktop nav */}
      <div className="hidden min-w-0 flex-1 items-center justify-end gap-3 lg:flex">
        <nav className="flex min-w-0 items-center justify-end gap-1">
          {links.map((item) => {
            const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(item.href + "/");

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

        {isAdminRoute && (
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
        )}
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden">
        <button
          type="button"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-foreground/85 backdrop-blur-sm transition hover:border-white/15 hover:bg-white/8 hover:text-foreground"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 px-4 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[hsl(var(--background)/0.96)] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
              <nav className="flex flex-col p-2">
                {links.map((item) => {
                  const active =
                    pathname === item.href ||
                    (item.href !== "/admin" && pathname.startsWith(item.href));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                        active
                          ? "bg-white/10 text-white"
                          : "text-foreground/78 hover:bg-white/6 hover:text-foreground"
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              {isAdminRoute && (
                <div className="border-t border-white/10 p-3">
                  <div className="flex flex-col gap-2">
                    {adminQuickLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm transition",
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
                          "inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm backdrop-blur-sm transition",
                          "bg-white/3 text-foreground/80 hover:border-white/15 hover:bg-white/5 hover:text-foreground",
                          "disabled:cursor-not-allowed disabled:opacity-60"
                        )}
                      >
                        <RefreshCw
                          className={cn("h-4 w-4", refreshing && "animate-spin")}
                        />
                        Refresh
                      </button>
                    )}

                    <div className="pt-1">
                      <SignOutButton />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}