import { div } from "motion/react-client";
import * as React from "react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type Props = React.HTMLAttributes<HTMLDivElement> & {
  /**
   * rounded: typical blocks
   * pill: buttons/chips
   * circle: avatars
   */
  shape?: "rounded" | "pill" | "circle";
  /**
   * Whether to show subtle brand tint behind shimmer
   */
  tint?: boolean;
};

export default function Skeleton({
  className,
  shape = "rounded",
  tint = true,
  ...props
}: Props) {
  const shapeCls =
    shape === "circle" ? "rounded-full" : shape === "pill" ? "rounded-full" : "rounded-xl";

  return (
    <div
      aria-busy="true"
      className={cn(
        "relative overflow-hidden border shadow-soft",
        "bg-muted border-border",
        shapeCls,
        className
      )}
      {...props}
    >
      {/* brand tint (static, subtle) */}
      {tint ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-linear-to-r from-brand-600/10 via-cyan-500/6 to-brand-500/10"
        />
      ) : null}

      {/* shimmer (moving highlight) */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0",
          // start off-screen, sweep across
          "translate-x-[-60%] animate-[skeleton-shimmer_1.2s_ease-in-out_infinite]",
          // highlight band
          "bg-linear-to-r from-transparent via-white/12 to-transparent"
        )}
      />
    </div>
  );
}