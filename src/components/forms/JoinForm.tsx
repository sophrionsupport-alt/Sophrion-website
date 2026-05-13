"use client";

import * as React from "react";
import { z } from "zod";
import { JoinApplicationSchema } from "@/lib/validators/join";
import { cn } from "@/lib/utils/cn";

type FormState = z.infer<typeof JoinApplicationSchema>;
type Errors = Partial<Record<keyof FormState, string>>;

function getErr(json: unknown) {
  const o = json as { error?: string; message?: string };
  return o?.error || o?.message || "Submission failed.";
}

export default function JoinForm() {
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<{ ok: boolean; message: string } | null>(null);
  const [errors, setErrors] = React.useState<Errors>({});

  const [form, setForm] = React.useState<FormState>({
    name: "",
    email: "",
    phone: "",
    college: "",
    year: "1st",
    pathway: "not_sure",
    message: "",
    source: "join_page",
    company: "",
  });

  function setField<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((e) => {
      if (!e[k]) return e;
      const n = { ...e };
      delete n[k];
      return n;
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);
    setErrors({});

    const parsed = JoinApplicationSchema.safeParse(form);
    if (!parsed.success) {
      const fe: Errors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof FormState | undefined;
        if (k && !fe[k]) fe[k] = issue.message;
      }
      setErrors(fe);
      setResult({ ok: false, message: "Please fix the highlighted fields." });
      return;
    }

    if (parsed.data.company && parsed.data.company.trim()) {
      setResult({ ok: true, message: "Thanks — we received your application." });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/join", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...parsed.data, company: undefined }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || json?.ok === false) {
        throw new Error(getErr(json));
      }
      setResult({ ok: true, message: "Thanks — we received your application. Our team will follow up soon." });
      setForm({
        name: "",
        email: "",
        phone: "",
        college: "",
        year: "1st",
        pathway: "not_sure",
        message: "",
        source: "join_page",
        company: "",
      });
    } catch (err: unknown) {
      setResult({
        ok: false,
        message: err instanceof Error ? err.message : "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  }

  const input =
    "mt-1 w-full rounded-xl border border-border bg-muted px-3 py-2 text-sm text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-white/10 bg-white/3 p-6 backdrop-blur">
      <div className="hidden">
        <label>
          Company
          <input value={form.company} onChange={(e) => setField("company", e.target.value)} tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className="block text-sm">
        <span className="font-medium text-foreground">Full name</span>
        <input required className={cn(input, errors.name && "border-rose-500/50")} value={form.name} onChange={(e) => setField("name", e.target.value)} />
        {errors.name ? <p className="mt-1 text-xs text-rose-300">{errors.name}</p> : null}
      </label>

      <label className="block text-sm">
        <span className="font-medium text-foreground">Email</span>
        <input required type="email" className={cn(input, errors.email && "border-rose-500/50")} value={form.email} onChange={(e) => setField("email", e.target.value)} />
        {errors.email ? <p className="mt-1 text-xs text-rose-300">{errors.email}</p> : null}
      </label>

      <label className="block text-sm">
        <span className="font-medium text-foreground">Phone (optional)</span>
        <input className={input} value={form.phone ?? ""} onChange={(e) => setField("phone", e.target.value)} />
      </label>

      <label className="block text-sm">
        <span className="font-medium text-foreground">College / Institution</span>
        <input required className={cn(input, errors.college && "border-rose-500/50")} value={form.college} onChange={(e) => setField("college", e.target.value)} />
        {errors.college ? <p className="mt-1 text-xs text-rose-300">{errors.college}</p> : null}
      </label>

      <label className="block text-sm">
        <span className="font-medium text-foreground">Current year</span>
        <select className={input} value={form.year} onChange={(e) => setField("year", e.target.value as FormState["year"])}>
          <option value="1st">1st Year</option>
          <option value="2nd">2nd Year</option>
          <option value="3rd">3rd Year</option>
          <option value="final">Final Year</option>
          <option value="graduate">Graduate</option>
          <option value="other">Other</option>
        </select>
      </label>

      <label className="block text-sm">
        <span className="font-medium text-foreground">Interested pathway</span>
        <select className={input} value={form.pathway} onChange={(e) => setField("pathway", e.target.value as FormState["pathway"])}>
          <option value="ai_systems">AI Systems</option>
          <option value="data_intelligence">Data Intelligence</option>
          <option value="creative_ai">Creative AI</option>
          <option value="cloud_cyber">Cloud & Cyber</option>
          <option value="smart_engineering">Smart Engineering</option>
          <option value="not_sure">Not Sure Yet</option>
        </select>
      </label>

      <label className="block text-sm">
        <span className="font-medium text-foreground">Message</span>
        <textarea required rows={5} className={cn(input, "resize-none", errors.message && "border-rose-500/50")} placeholder="Tell us about your interests, goals, or why you want to join Sophrion." value={form.message} onChange={(e) => setField("message", e.target.value)} />
        {errors.message ? <p className="mt-1 text-xs text-rose-300">{errors.message}</p> : null}
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-linear-to-r from-[hsl(var(--brand-600))] to-[hsl(var(--cyan-500))] py-2.5 text-sm font-semibold text-white shadow-lg transition hover:opacity-95 disabled:opacity-60"
      >
        {loading ? "Submitting…" : "Submit Application"}
      </button>

      {result ? (
        <p role="status" className={cn("text-sm", result.ok ? "text-emerald-300" : "text-rose-300")}>
          {result.message}
        </p>
      ) : null}
    </form>
  );
}
