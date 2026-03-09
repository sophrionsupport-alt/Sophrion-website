"use client";

import { useState } from "react";

type Item = {
  title: string;
  description: string;
};

export default function ProblemStatementsAccordion({
  items,
}: {
  items: Item[];
}) {
  const [open, setOpen] = useState<number | null>(null);

  if (!items?.length) return null;

  return (
    <div className="space-y-3">
      {items.map((p, i) => (
        <div
          key={i}
          className="rounded-xl border border-white/10 bg-white/5"
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full px-4 py-3 text-left text-sm font-medium"
          >
            {p.title}
          </button>

          {open === i && (
            <div className="px-4 pb-4 text-sm text-foreground/70">
              {p.description}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}