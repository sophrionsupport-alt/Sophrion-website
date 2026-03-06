"use client";

import * as React from "react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  closeOnBackdrop?: boolean;
  initialFocusRef?: React.RefObject<HTMLElement | null>;
};

function getFocusable(container: HTMLElement) {
  const selectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(",");

  return Array.from(container.querySelectorAll<HTMLElement>(selectors)).filter(
    (el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden")
  );
}

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  className,
  closeOnBackdrop = true,
  initialFocusRef,
}: Props) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const lastActiveRef = React.useRef<HTMLElement | null>(null);
  const onCloseRef = React.useRef(onClose);

  const titleId = React.useId();
  const descId = React.useId();

  React.useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  React.useEffect(() => {
    if (!open) return;

    lastActiveRef.current = document.activeElement as HTMLElement | null;

    const panel = panelRef.current;
    if (panel) {
      const focusables = getFocusable(panel);
      const toFocus = initialFocusRef?.current || focusables[0] || panel;
      toFocus.focus?.();
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
        return;
      }

      if (e.key !== "Tab") return;

      const panelEl = panelRef.current;
      if (!panelEl) return;

      const focusables = getFocusable(panelEl);

      if (focusables.length === 0) {
        e.preventDefault();
        panelEl.focus();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      lastActiveRef.current?.focus?.();
    };
  }, [open, initialFocusRef]);

  React.useEffect(() => {
    if (!open) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center px-4"
      role="presentation"
    >
      <div
        className="absolute inset-0 bg-black/65 backdrop-blur-sm"
        onMouseDown={(e) => {
          if (!closeOnBackdrop) return;
          if (e.target === e.currentTarget) onCloseRef.current();
        }}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        className={cn(
          "relative w-full max-w-lg rounded-2xl border shadow-glow outline-none",
          "border-white/10 bg-white/6 backdrop-blur-md",
          "p-5 sm:p-6",
          className
        )}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
      >
        {title || description ? (
          <div className="mb-4 grid gap-1">
            <div className="flex items-start justify-between gap-3">
              {title ? (
                <h3 id={titleId} className="text-lg font-semibold text-foreground">
                  {title}
                </h3>
              ) : (
                <span />
              )}

              <button
                type="button"
                onClick={() => onCloseRef.current()}
                className="rounded-lg px-2 py-1 text-sm text-foreground/70 hover:bg-white/8 hover:text-foreground"
              >
                Close
              </button>
            </div>

            {description ? (
              <p id={descId} className="text-sm text-foreground/70">
                {description}
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="text-sm text-foreground/85">{children}</div>
      </div>
    </div>
  );
}