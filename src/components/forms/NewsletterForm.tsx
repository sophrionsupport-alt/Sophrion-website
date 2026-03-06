"use client";

import * as React from "react";

type ApiOk<T = unknown> = { ok: true; data?: T; message?: string };
type ApiFail = { ok: false; error?: string; message?: string };
type ApiResp<T = unknown> = ApiOk<T> | ApiFail;

function getErrMessage(payload: any) {
  return payload?.error || payload?.message || "Could not subscribe right now. Please try again.";
}

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

export default function NewsletterForm(props: { source?: string; className?: string }) {
  const source = props.source ?? "footer";

  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    const payload = { email: email.trim(), source };

    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = (await res.json().catch(() => ({}))) as ApiResp;

      if (!res.ok || (json as any)?.ok === false) {
        setErrorMsg(getErrMessage(json));
        return;
      }

      setSuccessMsg((json as any)?.message || "Subscribed.");
      setEmail("");
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={props.className}>
      <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label className="sr-only" htmlFor="newsletter-email">
          Email
        </label>

        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          disabled={loading}
          className={cn(
            "h-10 w-full rounded-xl border px-3 text-sm outline-none transition",
            // Glassy input on dark theme
            "bg-white/5 text-foreground placeholder:text-foreground/40",
            "border-white/10 hover:border-white/15",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent",
            "disabled:opacity-60"
          )}
        />

        <button
          type="submit"
          disabled={loading}
          className={cn(
            "inline-flex h-10 shrink-0 items-center justify-center rounded-xl px-4 text-sm font-semibold text-white",
            // Sophrion CTA gradient
            "bg-linear-to-r from-[hsl(var(--brand-600))] to-[hsl(var(--cyan-500))]",
            "shadow-[0_0_0_1px_hsl(var(--border)/0.6),0_16px_50px_-30px_hsl(var(--cyan-500)/0.35)]",
            "hover:opacity-95 disabled:opacity-60",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
        >
          {loading ? "Subscribing…" : "Subscribe"}
        </button>
      </form>

      {(successMsg || errorMsg) && (
        <p
          aria-live="polite"
          className={cn(
            "mt-2 text-xs",
            successMsg ? "text-emerald-200" : "text-rose-200"
          )}
        >
          {successMsg ?? errorMsg}
        </p>
      )}
    </div>
  );
}