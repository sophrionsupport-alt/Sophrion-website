import * as React from "react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  loading?: boolean;
  iconOnly?: boolean;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium " +
  "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 " +
  "disabled:opacity-60 disabled:pointer-events-none " +
  "select-none";

const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
};

const iconOnlySizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-9 w-9 px-0",
  md: "h-10 w-10 px-0",
  lg: "h-11 w-11 px-0",
};

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "text-white bg-brand-gradient shadow-glow " +
    "hover:brightness-110 hover:scale-[1.02] hover:shadow-[0_0_24px_-4px_hsl(var(--brand-600)/0.5),0_0_12px_-2px_hsl(var(--cyan-500)/0.3)] " +
    "active:brightness-95 active:scale-[0.98]",
  secondary:
    "text-foreground bg-white/6 border border-white/10 hover:bg-white/10 hover:border-white/15 shadow-soft " +
    "hover:scale-[1.01] active:scale-[0.98]",
  ghost:
    "text-foreground/90 hover:text-foreground hover:bg-white/8 border border-transparent hover:border-white/10 " +
    "hover:scale-[1.01]",
  danger:
    "text-white bg-gradient-to-r from-rose-600 to-red-500 " +
    "hover:brightness-110 hover:scale-[1.02] hover:shadow-[0_0_20px_-4px_rgba(225,29,72,0.4)] " +
    "active:brightness-95 active:scale-[0.98]",
};

function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white",
        className
      )}
      aria-hidden="true"
    />
  );
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant = "primary",
    size = "md",
    fullWidth,
    loading,
    iconOnly,
    disabled,
    children,
    ...props
  },
  ref
) {
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      disabled={isDisabled}
      aria-busy={loading ? true : undefined}
      className={cn(
        base,
        iconOnly ? iconOnlySizes[size] : sizes[size],
        variants[variant],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {loading ? (
        <>
          <Spinner />
          {!iconOnly && <span className="text-white/90">Loading</span>}
        </>
      ) : (
        children
      )}
    </button>
  );
});

export default Button;