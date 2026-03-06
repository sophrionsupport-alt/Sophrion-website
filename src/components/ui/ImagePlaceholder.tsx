import * as React from "react";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  /**
   * Use for consistent media layouts (SEO-friendly stability via CLS reduction).
   * Example: "16/9", "4/3", "1/1"
   */
  ratio?: `${number}/${number}`;
  label?: string;
  /**
   * Optional: show a subtle shimmer skeleton.
   */
  skeleton?: boolean;
};

export default function ImagePlaceholder({
  ratio = "16/9",
  label = "Image",
  skeleton = true,
  className = "",
  ...props
}: Props) {
  const [w, h] = ratio.split("/").map(Number);
  const paddingTop = h && w ? `${(h / w) * 100}%` : "56.25%";

  return (
    <div
      className={[
        "relative overflow-hidden rounded-2xl border border-border bg-muted/30",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <div style={{ paddingTop }} />

      {skeleton ? (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-muted/40 via-muted/20 to-muted/40" />
      ) : null}

      <div className="absolute inset-0 grid place-items-center">
        <div className="rounded-full border border-border bg-background/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
          {label}
        </div>
      </div>
    </div>
  );
}