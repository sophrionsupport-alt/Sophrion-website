// src/components/events/EventsList.tsx
"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Search } from "lucide-react";
import EventCard, { type EventCardData } from "./EventCard";

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

type Props = {
  events: EventCardData[];
  className?: string;
  title?: string;
  subtitle?: string;
  atmosphere?: boolean;
};

export default function EventsList({
  events,
  className,
  title = "Events",
  subtitle = "Browse upcoming events and workshops.",
  atmosphere = true,
}: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return events;
    return events.filter((e) =>
      `${e.title} ${e.location}`.toLowerCase().includes(q)
    );
  }, [events, query]);

  return (
    <div
      className={cn(
        "relative bg-background py-14 sm:py-20",
        atmosphere &&
          "bg-[radial-gradient(1200px_circle_at_18%_12%,hsl(var(--ring)/0.22),transparent_45%),radial-gradient(1000px_circle_at_82%_36%,hsl(var(--cyan-500)/0.14),transparent_45%)]",
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-foreground/70">{subtitle}</p>

          {/* Search */}
          <div className="mt-8 rounded-2xl border border-border bg-muted px-4 py-3 shadow-soft">
            <div className="flex items-center gap-3">
              <Search className="h-4 w-4 text-foreground/55" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title or location…"
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-foreground/45"
              />
              {query.trim() ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="rounded-lg px-2 py-1 text-xs text-foreground/70 hover:bg-white/6 hover:text-foreground"
                >
                  Clear
                </button>
              ) : null}
            </div>
          </div>
        </motion.div>

        {/* List */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-border bg-card p-6 text-sm text-foreground/80 shadow-soft">
            No results for{" "}
            <span className="font-semibold text-foreground">
              “{query.trim()}”
            </span>
            .
          </div>
        ) : null}
      </div>
    </div>
  );
}