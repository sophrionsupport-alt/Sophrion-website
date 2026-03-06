"use client";

import * as React from "react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export type FiltersState = {
  q: string;
  status: "all" | "pending" | "approved" | "rejected";
  sort: "newest" | "oldest";
};

const DEFAULT_FILTERS: FiltersState = {
  q: "",
  status: "all",
  sort: "newest",
};

export default function FiltersBar({
  value,
  onChange,
  placeholder = "Search by name, email, phone…",
  className,
}: {
  value?: FiltersState;
  onChange?: (next: FiltersState) => void;
  placeholder?: string;
  className?: string;
}) {
  const v = value ?? DEFAULT_FILTERS;

  function patch(p: Partial<FiltersState>) {
    const next = { ...v, ...p };
    onChange?.(next);
  }

  const labelCls = "text-xs text-muted-foreground";
  const controlBase = cn(
    "h-10 w-full rounded-xl px-3 text-sm outline-none transition",
    "border border-white/10 bg-white/5 text-foreground placeholder:text-foreground/40",
    "hover:border-white/15",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent",
    "disabled:opacity-60"
  );

  const resetBtn = cn(
    "h-10 rounded-xl px-3 text-sm font-medium transition",
    "border border-white/10 bg-white/5 text-foreground/80 backdrop-blur",
    "hover:bg-white/10 hover:text-foreground",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
  );

  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur",
        "shadow-[0_0_0_1px_hsl(var(--border)/0.5),0_18px_70px_-45px_hsl(var(--ring)/0.22)]",
        className
      )}
    >
      <div className="grid gap-3 md:grid-cols-[1fr_180px_180px_120px]">
        <div className="grid gap-1.5">
          <label className={labelCls}>Search</label>
          <input
            value={v.q}
            onChange={(e) => patch({ q: e.target.value })}
            placeholder={placeholder}
            className={controlBase}
          />
        </div>

        <div className="grid gap-1.5">
          <label className={labelCls}>Status</label>
          <select
            value={v.status}
            onChange={(e) =>
              patch({ status: e.target.value as FiltersState["status"] })
            }
            className={cn(controlBase, "appearance-none")}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="grid gap-1.5">
          <label className={labelCls}>Sort</label>
          <select
            value={v.sort}
            onChange={(e) => patch({ sort: e.target.value as FiltersState["sort"] })}
            className={cn(controlBase, "appearance-none")}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>

        <div className="grid gap-1.5">
          <span className={labelCls}>Actions</span>
          <button type="button" onClick={() => onChange?.(DEFAULT_FILTERS)} className={resetBtn}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}