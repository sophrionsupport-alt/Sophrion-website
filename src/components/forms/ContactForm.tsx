"use client";

import * as React from "react";
import { z } from "zod";

type SubmitState = { ok: boolean; message: string } | null;

const ContactClientSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().trim().email("Enter a valid email").max(120),
  subject: z
    .string()
    .trim()
    .max(120)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined)),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(4000),
  company: z.string().optional().or(z.literal("")), // honeypot
});

type FormState = z.infer<typeof ContactClientSchema>;

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

function getErrMessage(payload: unknown) {
  if (payload && typeof payload === "object") {
    const o = payload as { error?: unknown; message?: unknown };
    const err = typeof o.error === "string" ? o.error : undefined;
    const msg = typeof o.message === "string" ? o.message : undefined;
    return err || msg || "Submission failed. Please try again.";
  }
  return "Submission failed. Please try again.";
}

export default function ContactForm() {
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<SubmitState>(null);

  const [form, setForm] = React.useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
    company: "",
  });

  const [errors, setErrors] = React.useState<Partial<Record<keyof FormState, string>>>({});

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((p) => ({ ...p, [key]: value }));
    setErrors((p) => {
      if (!p[key]) return p;
      const next = { ...p };
      delete next[key];
      return next;
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);
    setErrors({});

    const parsed = ContactClientSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof FormState, string>> = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path?.[0] as keyof FormState | undefined;
        if (k && !fieldErrors[k]) fieldErrors[k] = issue.message;
      }
      setErrors(fieldErrors);
      setResult({ ok: false, message: "Please fix the highlighted fields." });
      return;
    }

    // honeypot trap
    if (parsed.data.company && parsed.data.company.trim().length > 0) {
      setResult({ ok: true, message: "Thanks — we received your message." });
      setForm({ name: "", email: "", subject: "", message: "", company: "" });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: parsed.data.name,
          email: parsed.data.email,
          subject: parsed.data.subject,
          message: parsed.data.message,
          source: "contact_page",
        }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || json?.ok === false) {
        throw new Error(getErrMessage(json));
      }

      setResult({ ok: true, message: json?.message || "Thanks — we received your message." });
      setForm({ name: "", email: "", subject: "", message: "", company: "" });
    } catch (err: unknown) {
      setResult({ ok: false, message: err instanceof Error ? err.message : "Something went wrong." });
    } finally {
      setLoading(false);
    }
  }

  const inputBase =
    "mt-1 w-full rounded-xl border px-3 py-2 outline-none transition";
  const inputOk =
    "bg-muted border-border text-foreground placeholder:text-foreground/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent";
  const inputBad =
    "bg-muted border-rose-500/40 text-foreground placeholder:text-foreground/40 focus-visible:ring-2 focus-visible:ring-rose-400/50 focus-visible:border-transparent";

  const labelText = "text-sm font-medium text-foreground";
  const helpText = "mt-1 text-xs text-muted-foreground";
  const errorText = "mt-1 text-xs text-rose-200";

  return (
    <section
      className={cn(
        "rounded-2xl border border-border bg-card p-6 sm:p-8",
        "shadow-[0_0_0_1px_hsl(var(--border)/0.6),0_20px_80px_-40px_hsl(var(--ring)/0.35)]"
      )}
    >
      <h2 className="text-xl font-semibold text-foreground">Send a message</h2>
      <p className="mt-1 text-sm text-foreground/70">
        Partnerships, workshops, support, or general questions — we respond quickly.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
        {/* Honeypot */}
        <div className="hidden">
          <label>
            Company
            <input
              value={form.company}
              onChange={(e) => setField("company", e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className={labelText}>Name</span>
            <input
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              required
              autoComplete="name"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "contact_name_error" : undefined}
              className={cn(inputBase, errors.name ? inputBad : inputOk)}
              placeholder="Your full name"
            />
            {errors.name ? (
              <p id="contact_name_error" className={errorText}>
                {errors.name}
              </p>
            ) : null}
          </label>

          <label className="block">
            <span className={labelText}>Email</span>
            <input
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              required
              type="email"
              autoComplete="email"
              inputMode="email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "contact_email_error" : undefined}
              className={cn(inputBase, errors.email ? inputBad : inputOk)}
              placeholder="you@domain.com"
            />
            {errors.email ? (
              <p id="contact_email_error" className={errorText}>
                {errors.email}
              </p>
            ) : null}
          </label>
        </div>

        <label className="block">
          <span className={labelText}>Subject</span>
          <input
            value={form.subject ?? ""}
            onChange={(e) => setField("subject", e.target.value)}
            className={cn(inputBase, errors.subject ? inputBad : inputOk)}
            placeholder="Partnership / Support / General"
          />
          {errors.subject ? (
            <p className={errorText}>{errors.subject}</p>
          ) : (
            <p className={helpText}>Optional — helps us route your message faster.</p>
          )}
        </label>

        <label className="block">
          <span className={labelText}>Message</span>
          <textarea
            value={form.message}
            onChange={(e) => setField("message", e.target.value)}
            required
            rows={6}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "contact_message_error" : "contact_message_help"}
            className={cn(
              "mt-1 w-full resize-none rounded-xl border px-3 py-2 outline-none transition",
              errors.message ? inputBad : inputOk
            )}
            placeholder="Tell us what you need, your timeline, and who you are."
          />
          {errors.message ? (
            <p id="contact_message_error" className={errorText}>
              {errors.message}
            </p>
          ) : (
            <p id="contact_message_help" className={helpText}>
              Include context + timeline. Minimum 10 characters.
            </p>
          )}
        </label>

        <button
          type="submit"
          disabled={loading}
          className={cn(
            "inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white",
            "bg-linear-to-r from-[hsl(var(--brand-600))] to-[hsl(var(--cyan-500))]",
            "shadow-[0_0_0_1px_hsl(var(--border)/0.6),0_16px_50px_-30px_hsl(var(--cyan-500)/0.45)]",
            "hover:opacity-95 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
        >
          {loading ? "Sending…" : "Send message"}
        </button>

        {result && (
          <div
            role="status"
            aria-live="polite"
            className={cn(
              "rounded-xl border px-3 py-2 text-sm",
              result.ok
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-200"
                : "border-rose-500/20 bg-rose-500/10 text-rose-200"
            )}
          >
            {result.message}
          </div>
        )}
      </form>
    </section>
  );
}