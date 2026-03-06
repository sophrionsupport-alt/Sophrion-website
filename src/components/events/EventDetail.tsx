// src/components/events/EventDetail.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

export type EventDetailData = {
  id: string;
  title: string;
  slug: string;
  date: string;
  location: string;
  description?: string;
};

type Props = {
  event: EventDetailData;
  className?: string;

  // allow injecting any CTA (modal trigger button, etc.)
  cta?: React.ReactNode;

  // optional: show cosmic atmosphere on page background
  atmosphere?: boolean;
};

function formatDateMaybe(date: string) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;

  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(d);
  } catch {
    return date;
  }
}

export default function EventDetail({
  event,
  cta,
  className,
  atmosphere = true,
}: Props) {
  const dateLabel = formatDateMaybe(event.date);

  return (
    <div
      className={cn(
        "relative bg-background py-14 sm:py-20",
        atmosphere &&
          "bg-[radial-gradient(1200px_circle_at_18%_12%,hsl(var(--ring)/0.22),transparent_45%),radial-gradient(1000px_circle_at_82%_36%,hsl(var(--cyan-500)/0.14),transparent_45%)]",
        className
      )}
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-foreground"
        >
          <span aria-hidden="true">←</span> Back to Events
        </Link>

        <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8">
          {/* top hairline glow */}
          <div className="pointer-events-none -mx-6 -mt-6 mb-6 h-px bg-linear-to-r from-transparent via-brand-500/35 to-transparent sm:-mx-8 sm:-mt-8" />

          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {event.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-foreground/70">
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4 text-foreground/55" />
              <span className="whitespace-nowrap">{dateLabel}</span>
            </span>

            <span className="inline-flex items-center gap-2 min-w-0">
              <MapPin className="h-4 w-4 text-foreground/55" />
              <span className="truncate">{event.location}</span>
            </span>
          </div>

          <div className="mt-6 space-y-4 text-foreground/80">
            <p>
              {event.description ??
                "This is a placeholder detail page. Content and registration flows will be wired next."}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {/* Primary CTA slot */}
            {cta ? (
              cta
            ) : (
              <Link
                href="/contact"
                className={cn(
                  "inline-flex items-center justify-center rounded-2xl border px-5 py-3 text-sm font-semibold transition",
                  "border-white/10 bg-white/6 text-foreground hover:bg-white/10",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                )}
              >
                Contact team
              </Link>
            )}

            {/* Secondary action */}
            <Link
              href="/events"
              className={cn(
                "inline-flex items-center justify-center rounded-2xl border px-5 py-3 text-sm font-semibold transition",
                "border-white/10 bg-transparent text-foreground/80 hover:bg-white/6 hover:text-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
              )}
            >
              View all events
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}