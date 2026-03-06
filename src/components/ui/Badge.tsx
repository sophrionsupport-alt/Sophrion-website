import * as React from "react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type Variant = "brand" | "cyan" | "muted";
type Size = "sm" | "md";

type Props = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: Variant;
  size?: Size;
};

const variantStyles: Record<Variant, string> = {
  brand:
    "border-brand-500/30 bg-brand-500/12 text-brand-200 hover:bg-brand-500/18",
  cyan:
    "border-cyan-400/30 bg-cyan-400/10 text-cyan-400 hover:bg-cyan-400/16",
  muted:
    "border-white/10 bg-white/6 text-foreground/70 hover:bg-white/10",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-xs",
};

const Badge = React.forwardRef<HTMLSpanElement, Props>(
  ({ className, variant = "muted", size = "md", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full border font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export default Badge;