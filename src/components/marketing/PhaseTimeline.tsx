import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { ChevronDown } from "lucide-react";

export type PhaseStep = {
  title: string;
  body: string;
};

export default function PhaseTimeline({
  steps,
  className,
}: {
  steps: PhaseStep[];
  className?: string;
}) {
  return (
    <ol className={cn("mx-auto max-w-2xl space-y-3", className)}>
      {steps.map((step, i) => (
        <li key={step.title}>
          <div className="rounded-2xl border border-border bg-card/80 p-5 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-foreground/55">
              Phase {i + 1}
            </p>
            <h3 className="mt-1 text-lg font-semibold text-foreground">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-foreground/70">{step.body}</p>
          </div>
          {i < steps.length - 1 ? (
            <div className="flex justify-center py-1 text-foreground/35">
              <ChevronDown className="h-5 w-5" aria-hidden />
            </div>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
