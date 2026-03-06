// src/components/events/EventCard.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { Calendar, MapPin, ArrowRight } from "lucide-react";

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

export type EventCardData = {
  id: string;
  title: string;
  slug: string;
  date: string; // keep existing display/ISO value
  location: string;
  blurb?: string;
  badge?: string; // optional: "LIVE", "Upcoming", "Workshop"
};

type Props = {
  event: EventCardData;
  href?: string; // default: `/events/${slug}`
  className?: string;
  tone?: "card" | "glass";
};

function formatDateMaybe(date: string) {
  // If it's ISO-ish, format it; otherwise return as-is.
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

export default function EventCard({
  event,
  href,
  className,
  tone = "card",
}: Props) {
  const to = href ?? `/events/${event.slug}`;
  const dateLabel = formatDateMaybe(event.date);

  return (
    <Link
      href={to}
      aria-label={`Open event: ${event.title}`}
      className={cn(
        "group relative block rounded-3xl border transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
        // surfaces
        tone === "card" && "bg-card border-border",
        tone === "glass" &&
          "bg-white/6 border-white/10 backdrop-blur-md supports-backdrop-filter:bg-white/5",
        // hover states (cosmic but controlled)
        "hover:-translate-y-0.5 hover:border-brand-500/35 hover:shadow-glow",
        className
      )}
    >
      {/* Top hairline glow */}
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-brand-500/35 to-transparent" />

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-lg font-semibold text-foreground">
                {event.title}
              </h2>

              {event.badge ? (
                <span className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2 py-0.5 text-xs font-medium text-cyan-400">
                  {event.badge}
                </span>
              ) : null}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-foreground/70">
              <span className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4 text-foreground/55" />
                <span className="whitespace-nowrap">{dateLabel}</span>
              </span>

              <span className="inline-flex items-center gap-2 min-w-0">
                <MapPin className="h-4 w-4 text-foreground/55" />
                <span className="truncate">{event.location}</span>
              </span>
            </div>
          </div>

          <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-foreground/45 transition group-hover:translate-x-1 group-hover:text-foreground/80" />
        </div>

        <p className="mt-4 text-sm text-foreground/75">
          {event.blurb ??
            "Registration + confirmation flows will be wired soon."}
        </p>
      </div>
    </Link>
  );
}