import * as React from "react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> & {
  label?: string;
  hint?: string;
  error?: string;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, label, hint, error, id, ...props },
  ref
) {
  const reactId = React.useId();
  const inputId = id ?? reactId;

  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="grid gap-1.5">
      {label ? (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-foreground/90"
        >
          {label}
        </label>
      ) : null}

      <input
        id={inputId}
        ref={ref}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          "h-10 w-full rounded-xl border px-3 text-sm text-foreground transition-colors",
          "bg-muted border-border",
          "placeholder:text-foreground/45",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:border-transparent",
          "disabled:opacity-60 disabled:cursor-not-allowed",
          error && "border-red-500/50 focus-visible:ring-red-500/40",
          className
        )}
        {...props}
      />

      {error ? (
        <p id={errorId} className="text-xs text-red-300">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-xs text-foreground/55">
          {hint}
        </p>
      ) : null}
    </div>
  );
});

export default Input;