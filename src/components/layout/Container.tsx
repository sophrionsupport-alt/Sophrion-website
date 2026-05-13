import * as React from "react";

type ClassValue =
  | string
  | number
  | null
  | undefined
  | false
  | Record<string, boolean>
  | ClassValue[];

function cn(...values: ClassValue[]) {
  const out: string[] = [];

  const walk = (v: ClassValue) => {
    if (!v) return;
    if (typeof v === "string" || typeof v === "number") {
      out.push(String(v));
      return;
    }
    if (Array.isArray(v)) {
      v.forEach(walk);
      return;
    }
    if (typeof v === "object") {
      for (const [k, enabled] of Object.entries(v)) {
        if (enabled) out.push(k);
      }
    }
  };

  values.forEach(walk);
  return out.join(" ");
}

type ContainerSize = "narrow" | "default" | "wide";

type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  /**
   * Controls max width for content.
   * narrow ≈ 960px, default ≈ 1200px, wide ≈ 1400px
   */
  size?: ContainerSize;

  /**
   * Horizontal padding.
   */
  padded?: boolean;

  /**
   * Centers text inside container.
   */
  center?: boolean;

  /**
   * Adds vertical padding.
   * - "none": no vertical padding
   * - "sm": compact
   * - "md": default section spacing
   * - "lg": hero spacing
   */
  py?: "none" | "sm" | "md" | "lg";

  /**
   * Full-width background “bleed” wrapper.
   * Useful for colorful sections with background gradients.
   * If true, renders an outer <section> that spans full width,
   * and an inner constrained container for content.
   */
  bleed?: boolean;

  /**
   * Optional section background classes when bleed is enabled.
   * Example: "bg-gradient-to-b from-brand-900/30 to-transparent"
   */
  bleedClassName?: string;

  /**
   * Adds a subtle glass surface (nice with colorful backgrounds).
   */
  glass?: boolean;
};

const sizeClass: Record<ContainerSize, string> = {
  narrow: "max-w-4xl",
  default: "max-w-6xl",
  wide: "max-w-7xl",
};

const pyClass: Record<NonNullable<ContainerProps["py"]>, string> = {
  none: "",
  sm: "py-8",
  md: "py-12 md:py-16",
  lg: "py-16 md:py-24",
};

function InnerContainer({
  size,
  padded,
  center,
  py,
  glass,
  className,
  children,
  ...props
}: Omit<ContainerProps, "bleed" | "bleedClassName">) {
  return (
    <div
      className={cn(
        "mx-auto w-full",
        sizeClass[size ?? "default"],
        padded !== false && "px-4 sm:px-6 lg:px-8",
        pyClass[py ?? "none"],
        center && "text-center",
        glass && "rounded-3xl glass-surface",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default function Container({
  size = "default",
  padded = true,
  center = false,
  py = "none",
  bleed = false,
  bleedClassName,
  glass = false,
  className,
  children,
  ...props
}: ContainerProps) {
  if (bleed) {
    return (
      <section className={cn("w-full", bleedClassName)}>
        <InnerContainer
          size={size}
          padded={padded}
          center={center}
          py={py}
          glass={glass}
          className={className}
          {...props}
        >
          {children}
        </InnerContainer>
      </section>
    );
  }

  return (
    <InnerContainer
      size={size}
      padded={padded}
      center={center}
      py={py}
      glass={glass}
      className={className}
      {...props}
    >
      {children}
    </InnerContainer>
  );
}