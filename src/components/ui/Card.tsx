import * as React from "react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type Props = React.HTMLAttributes<HTMLDivElement> & {
  glow?: boolean;
  surface?: "card" | "glass";
  interactive?: boolean;
};

export default function Card({
  className,
  glow = false,
  surface = "card",
  interactive = false,
  ...props
}: Props) {
  const base =
    "relative rounded-2xl border shadow-soft transition-colors duration-200";

  const surfaces = {
    card: "bg-card text-card-foreground border-border",
    glass:
      "bg-white/5 text-foreground border-white/10 backdrop-blur-md supports-[backdrop-filter]:bg-white/4",
  } as const;

  return (
    <div
      className={cn(
        base,
        surfaces[surface],
        interactive && "hover:bg-white/3 hover:border-white/15",
        glow &&
          "hover:border-brand-500/35 hover:shadow-glow focus-within:ring-2 focus-within:ring-ring/40",
        className
      )}
      {...props}
    />
  );
}