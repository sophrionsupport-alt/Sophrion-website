"use client";

import * as React from "react";

type SubmitState = { ok: boolean; message: string } | null;

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function Page() {
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<SubmitState>(null);

  const [form, setForm] = React.useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    linkedin: "",
    portfolio: "",
    message: "",
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch("/api/careers/apply", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.message || "Failed to submit");

      setResult({ ok: true, message: "Application received. We will get back to you." });
      setForm({
        fullName: "",
        email: "",
        phone: "",
        role: "",
        linkedin: "",
        portfolio: "",
        message: "",
      });
    } catch (err: any) {
      setResult({ ok: false, message: err?.message || "Something went wrong." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative bg-background py-16 text-foreground sm:py-24">
      {/* Atmospheric glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[18%] top-[10%] h-225 w-225 rounded-full bg-[radial-gradient(closest-side,hsl(var(--ring)/0.20),transparent_70%)]" />
        <div className="absolute right-[10%] top-[30%] h-225 w-225 rounded-full bg-[radial-gradient(closest-side,hsl(var(--cyan-500)/0.12),transparent_70%)]" />
      </div>

      <div className="mx-auto max-w-3xl px-4">
        {/* Header */}
        <div className="space-y-2">
          <p className="text-sm font-semibold tracking-wide text-foreground/70">
            Careers
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="bg-linear-to-r from-[hsl(var(--brand-600))] to-[hsl(var(--cyan-500))] bg-clip-text text-transparent">
              Apply
            </span>
          </h1>

          <p className="text-foreground/70">
            Tell us what you want to build at Sophrion. Keep it concrete: what you shipped, what you learned, what you’ll
            own next.
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={onSubmit}
          className="mt-10 space-y-4 rounded-2xl border border-border bg-card p-6 sm:p-8"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" required>
              <Input
                value={form.fullName}
                onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
                placeholder="Your name"
                required
              />
            </Field>

            <Field label="Role" required>
              <Input
                value={form.role}
                onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                placeholder="e.g., Full-stack, Ops, BD"
                required
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email" required>
              <Input
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="you@domain.com"
                type="email"
                required
              />
            </Field>

            <Field label="Phone">
              <Input
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                placeholder="Optional"
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="LinkedIn">
              <Input
                value={form.linkedin}
                onChange={(e) => setForm((p) => ({ ...p, linkedin: e.target.value }))}
                placeholder="https://linkedin.com/in/..."
              />
            </Field>

            <Field label="Portfolio / GitHub">
              <Input
                value={form.portfolio}
                onChange={(e) => setForm((p) => ({ ...p, portfolio: e.target.value }))}
                placeholder="https://github.com/..."
              />
            </Field>
          </div>

          <Field label="Why you + why now" required>
            <textarea
              value={form.message}
              onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
              required
              rows={6}
              className={cn(
                "mt-1 w-full resize-none rounded-xl border border-border",
                "bg-white/3 px-3 py-2 text-sm text-foreground placeholder:text-foreground/40",
                "outline-none backdrop-blur transition",
                "focus:ring-2 focus:ring-[hsl(var(--ring))] focus:ring-offset-0"
              )}
              placeholder="What have you built? What do you want to own here? Link evidence."
            />
          </Field>

          <button
            type="submit"
            disabled={loading}
            className={cn(
              "inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white",
              "bg-linear-to-r from-[hsl(var(--brand-600))] to-[hsl(var(--cyan-500))]",
              "transition hover:opacity-90 disabled:opacity-60"
            )}
          >
            {loading ? "Submitting…" : "Submit application"}
          </button>

          {result && (
            <div
              className={cn(
                "rounded-xl border px-3 py-2 text-sm",
                result.ok
                  ? "border-[hsl(var(--cyan-500))/0.35] bg-[hsl(var(--cyan-500))/0.10] text-foreground"
                  : "border-[hsl(var(--ring))/0.35] bg-[hsl(var(--ring))/0.10] text-foreground"
              )}
            >
              {result.message}
            </div>
          )}

          <p className="text-xs text-foreground/50">
            This posts to{" "}
            <code className="rounded bg-white/5 px-1 py-0.5 text-foreground/80">
              /api/careers/apply
            </code>
            . If you don’t have the route yet, keep this page as UX-only for now.
          </p>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground">
        {label} {required ? <span className="text-foreground/50">*</span> : null}
      </span>
      {children}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "mt-1 w-full rounded-xl border border-border",
        "bg-white/3 px-3 py-2 text-sm text-foreground placeholder:text-foreground/40",
        "outline-none backdrop-blur transition",
        "focus:ring-2 focus:ring-[hsl(var(--ring))] focus:ring-offset-0",
        props.className
      )}
    />
  );
}