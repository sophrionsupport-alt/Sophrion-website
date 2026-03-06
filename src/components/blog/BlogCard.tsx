"use client";

import Image from "next/image";
import Link from "next/link";

type Props = {
  slug: string;
  title: string;
  excerpt?: string;
  cover?: string;
  category?: string;
  author?: string;
  date?: string;
  readingTime?: string;
  className?: string;
};

function cn(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(" ");
}

export default function BlogCard({
  slug,
  title,
  excerpt,
  cover,
  category,
  author,
  date,
  readingTime,
  className,
}: Props) {
  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-card",
        "transition-all duration-300",
        "hover:border-[hsl(var(--cyan-500)/0.35)]",
        "hover:shadow-[0_0_0_1px_hsl(var(--border)/0.5),0_20px_80px_-40px_hsl(var(--cyan-500)/0.35)]",
        className
      )}
    >
      {/* Cover */}
      {cover && (
        <Link href={`/blog/${slug}`} className="block">
          <div className="relative aspect-video w-full overflow-hidden">
            <Image
              src={cover}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* subtle overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-background/80 via-background/20 to-transparent" />
          </div>
        </Link>
      )}

      {/* Content */}
      <div className="space-y-3 p-5">
        {/* Category */}
        {category && (
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
              "bg-white/5 text-[hsl(var(--cyan-500))]",
              "border border-white/10"
            )}
          >
            {category}
          </span>
        )}

        {/* Title */}
        <h3 className="text-lg font-semibold leading-snug text-foreground">
          <Link
            href={`/blog/${slug}`}
            className="transition-colors hover:text-[hsl(var(--cyan-500))]"
          >
            {title}
          </Link>
        </h3>

        {/* Excerpt */}
        {excerpt && (
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {excerpt}
          </p>
        )}

        {/* Meta */}
        {(author || date || readingTime) && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-foreground/60">
            {author && <span>{author}</span>}
            {date && <span>• {date}</span>}
            {readingTime && <span>• {readingTime}</span>}
          </div>
        )}
      </div>

      {/* Hover gradient border */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300",
          "group-hover:opacity-100",
          "bg-[linear-gradient(120deg,transparent,hsla(var(--cyan-500),0.12),transparent)]"
        )}
      />
    </article>
  );
}