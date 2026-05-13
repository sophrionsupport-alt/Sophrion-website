"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { InquirySchema, type InquiryType } from "@/lib/validators/inquiry";
import { cn } from "@/lib/utils/cn";

type Form = {
  name: string;
  email: string;
  phone: string;
  organization: string;
  inquiryType: InquiryType;
  message: string;
  company: string;
};

const TYPE_OPTIONS: { value: InquiryType; label: string }[] = [
  { value: "student", label: "Student Inquiry" },
  { value: "institutional", label: "Institutional Partnership" },
  { value: "innovation", label: "Innovation Collaboration" },
  { value: "mentor", label: "Mentor Collaboration" },
  { value: "industry", label: "Industry / Recruiter Inquiry" },
  { value: "other", label: "Other" },
];

function errMsg(json: unknown) {
  const o = json as { error?: string; message?: string };
  return o?.error || o?.message || "Submission failed.";
}

export default function InquiryForm() {
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic");

  const initialType = React.useMemo((): InquiryType => {
    const t = (topic ?? "").toLowerCase();
    if (t === "partnership" || t === "institutional") return "institutional";
    if (t === "student") return "student";
    if (t === "mentor") return "mentor";
    if (t === "industry") return "industry";
    if (t === "innovation") return "innovation";
    return "other";
  }, [topic]);

  const [form, setForm] = React.useState<Form>({
    name: "",
    email: "",
    phone: "",
    organization: "",
    inquiryType: initialType,
    message: "",
    company: "",
  });

  React.useEffect(() => {
    setForm((f) => ({ ...f, inquiryType: initialType }));
  }, [initialType]);

  const [errors, setErrors] = React.useState<Partial<Record<keyof Form, string>>>({});
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<{ ok: boolean; message: string } | null>(null);

  function setField<K extends keyof Form>(k: K, v: Form[K]) {
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

    const parsed = InquirySchema.safeParse({
      ...form,
      source: "contact_page",
    });

    if (!parsed.success) {
      const fe: Partial<Record<keyof Form, string>> = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof Form | undefined;
        if (k && !fe[k]) fe[k] = issue.message;
      }
      setErrors(fe);
      setResult({ ok: false, message: "Please fix the highlighted fields." });
      return;
    }

    if (parsed.data.company?.trim()) {
      setResult({ ok: true, message: "Thanks — we received your inquiry." });
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
          phone: parsed.data.phone,
          organization: parsed.data.organization,
          inquiryType: parsed.data.inquiryType,
          message: parsed.data.message,
          source: "contact_page",
        }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || json?.ok === false) {
        throw new Error(errMsg(json));
      }
      setResult({ ok: true, message: json?.message || "Thanks — we received your inquiry." });
      setForm({
        name: "",
        email: "",
        phone: "",
        organization: "",
        inquiryType: parsed.data.inquiryType,
        message: "",
        company: "",
      });
    } catch (er: unknown) {
      setResult({
        ok: false,
        message: er instanceof Error ? er.message : "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  }

  const input =
    "mt-1 w-full rounded-xl border border-border bg-muted px-3 py-2 text-sm text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="hidden">
        <label>
          Company
          <input value={form.company} onChange={(e) => setField("company", e.target.value)} tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium text-foreground">Full name</span>
          <input required className={cn(input, errors.name && "border-rose-500/50")} value={form.name} onChange={(e) => setField("name", e.target.value)} autoComplete="name" />
          {errors.name ? <p className="mt-1 text-xs text-rose-300">{errors.name}</p> : null}
        </label>
        <label className="block text-sm">
          <span className="font-medium text-foreground">Email</span>
          <input required type="email" className={cn(input, errors.email && "border-rose-500/50")} value={form.email} onChange={(e) => setField("email", e.target.value)} autoComplete="email" />
          {errors.email ? <p className="mt-1 text-xs text-rose-300">{errors.email}</p> : null}
        </label>
      </div>

      <label className="block text-sm">
        <span className="font-medium text-foreground">Phone (optional)</span>
        <input className={input} value={form.phone} onChange={(e) => setField("phone", e.target.value)} autoComplete="tel" />
      </label>

      <label className="block text-sm">
        <span className="font-medium text-foreground">Organization / Institution (optional)</span>
        <input className={input} value={form.organization} onChange={(e) => setField("organization", e.target.value)} />
      </label>

      <label className="block text-sm">
        <span className="font-medium text-foreground">Inquiry type</span>
        <select className={input} value={form.inquiryType} onChange={(e) => setField("inquiryType", e.target.value as InquiryType)}>
          {TYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm">
        <span className="font-medium text-foreground">Message</span>
        <textarea required rows={6} className={cn(input, "resize-none", errors.message && "border-rose-500/50")} placeholder="Tell us about your interest, institution, collaboration idea, or ecosystem inquiry." value={form.message} onChange={(e) => setField("message", e.target.value)} />
        {errors.message ? <p className="mt-1 text-xs text-rose-300">{errors.message}</p> : null}
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-linear-to-r from-[hsl(var(--brand-600))] to-[hsl(var(--cyan-500))] py-2.5 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-60"
      >
        {loading ? "Submitting…" : "Submit Inquiry"}
      </button>

      {result ? (
        <p role="status" className={cn("text-sm", result.ok ? "text-emerald-300" : "text-rose-300")}>
          {result.message}
        </p>
      ) : null}
    </form>
  );
}
