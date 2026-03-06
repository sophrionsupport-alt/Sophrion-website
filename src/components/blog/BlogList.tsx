"use client";

import * as React from "react";
import { Search } from "lucide-react";
import BlogCard from "./BlogCard";

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

export type BlogCardData = {
  slug: string;
  title: string;
  excerpt?: string;
  cover?: string;
  category?: string;
  author?: string;
  date?: string;
  readingTime?: string;
};

type Props = {
  posts: BlogCardData[];
  className?: string;
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
};

export default function BlogList({
  posts,
  className,
  title = "Blog",
  subtitle = "Insights on education, technology, careers, and institutional readiness.",
  showSearch = true,
}: Props) {
  const [query, setQuery] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState<string>("All");

  const categories = React.useMemo(() => {
    const set = new Set<string>();
    for (const p of posts) if (p.category) set.add(p.category);
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [posts]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      const matchesQuery =
        !q ||
        `${p.title} ${p.excerpt ?? ""} ${p.category ?? ""} ${p.author ?? ""}`
          .toLowerCase()
          .includes(q);

      const matchesCategory =
        activeCategory === "All" || (p.category ?? "") === activeCategory;

      return matchesQuery && matchesCategory;
    });
  }, [posts, query, activeCategory]);

  return (
    <section
      className={cn(
        "relative",
        // Cosmic atmosphere background (subtle)
        "bg-[radial-gradient(1200px_circle_at_18%_12%,hsl(var(--ring)/0.18),transparent_45%),radial-gradient(1000px_circle_at_82%_36%,hsl(var(--cyan-500)/0.12),transparent_45%)]",
        className
      )}
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-14">
        <header className="grid gap-3">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h2>
          <p className="max-w-2xl text-sm text-foreground/70 sm:text-base">
            {subtitle}
          </p>

          {showSearch && (
            <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
              {/* Search */}
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/50" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search posts..."
                  className={cn(
                    "h-11 w-full rounded-2xl pl-10 pr-3 text-sm outline-none transition",
                    "bg-white/5 text-foreground placeholder:text-foreground/40",
                    "border border-white/10 hover:border-white/15",
                    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent"
                  )}
                />
              </div>

              {/* Category pills */}
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => {
                  const active = c === activeCategory;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setActiveCategory(c)}
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-medium transition",
                        active
                          ? cn(
                              "text-white",
                              "bg-linear-to-r from-[hsl(var(--brand-600))] to-[hsl(var(--cyan-500))]",
                              "shadow-[0_0_0_1px_hsl(var(--border)/0.6),0_16px_40px_-30px_hsl(var(--cyan-500)/0.35)]"
                            )
                          : cn(
                              "border border-white/10 bg-white/5 text-foreground/70",
                              "hover:bg-white/10 hover:text-foreground"
                            )
                      )}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </header>

        {/* List */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <BlogCard
              key={p.slug}
              slug={p.slug}
              title={p.title}
              excerpt={p.excerpt}
              cover={p.cover}
              category={p.category}
              author={p.author}
              date={p.date}
              readingTime={p.readingTime}
            />
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur">
            <p className="text-sm text-foreground/70">
              No posts match your search. Try a different keyword or category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}