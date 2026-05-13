"use client";

import * as React from "react";
import { CONTACT_FAQ } from "@/lib/marketing/contactFaq";
import { cn } from "@/lib/utils/cn";
import { ChevronDown } from "lucide-react";

export default function ContactFaqAccordion() {
  const [open, setOpen] = React.useState<number | null>(0);

  return (

    <div className="mx-auto max-w-4xl space-y-2">

    <div className="mx-auto max-w-3xl space-y-2">

      {CONTACT_FAQ.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className="rounded-2xl border border-white/10 bg-white/3 backdrop-blur">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium text-foreground"
            >
              {item.q}
              <ChevronDown className={cn("h-4 w-4 shrink-0 text-foreground/50 transition", isOpen && "rotate-180")} />
            </button>
            {isOpen ? (
              <div className="border-t border-white/10 px-4 py-3 text-sm leading-relaxed text-foreground/70">
                {item.a}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
