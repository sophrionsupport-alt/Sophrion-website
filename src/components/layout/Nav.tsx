"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import SignOutButton from "@/components/auth/SignOutButton";

type NavLink = {
  label: string;
  href: string;
};

const publicLinks: NavLink[] = [
  { label: "Students", href: "/students" },
  { label: "Colleges", href: "/colleges" },
  { label: "Events", href: "/events" },
  { label: "Careers", href: "/careers" },
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

  return (
    <div className={cn("flex min-w-0 flex-1 items-center justify-end gap-3", className)}>
      
      {/* Main Links */}
      <nav className="flex min-w-0 flex-nowrap items-center justify-end gap-1 overflow-x-auto scrollbar-none">
        {links.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "shrink-0 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors",
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

      {/* Admin Actions */}
      {isAdminRoute && (
        <div className="hidden items-center gap-2 lg:flex">

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

          {/* Sign Out */}
          <SignOutButton />

        </div>
      )}
    </div>
  );
}