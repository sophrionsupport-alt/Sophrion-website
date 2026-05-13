import * as React from "react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type Props = React.HTMLAttributes<HTMLElement> & {
  tone?: "plain" | "glass";
  padded?: boolean;
};

export default function Section({
  className,
  tone = "plain",
  padded = true,
  children,
  ...props
}: Props) {
  return (
    <section
      className={cn(
        "relative",
        padded && "py-12 sm:py-16",
        // Glass surface layer (stays behind content)
        tone === "glass" &&
          "before:absolute before:inset-0 before:rounded-3xl " +
            "before:bg-white/[0.03] before:backdrop-blur-xl " +
            "before:border before:border-white/[0.08] before:shadow-soft " +
            "before:content-['']",
        className
      )}
      {...props}
    >
      {/* Top hairline glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 5%, hsl(var(--glow-purple) / 0.25) 30%, hsl(var(--glow-cyan) / 0.35) 50%, hsl(var(--glow-purple) / 0.25) 70%, transparent 95%)",
        }}
      />

      {/* Content wrapper ensures content sits above the ::before glass */}
      <div className={cn("relative z-10", tone === "glass" && "px-4 sm:px-6")}>
        {children}
      </div>
    </section>
  );
}