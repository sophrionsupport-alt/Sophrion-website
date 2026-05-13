"use client";

import * as React from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";


type ApiOk<T = unknown> = { ok: true; data?: T; message?: string };
type ApiFail = { ok: false; error?: string; message?: string };
type ApiResp<T = unknown> = ApiOk<T> | ApiFail;

export default function EventPublishingRequestForm() {
  const [loading, setLoading] = React.useState(false);
  const [done, setDone] = React.useState<string | null>(null);
  const [err, setErr] = React.useState<string | null>(null);

  const [form, setForm] = React.useState({
    college_name: "",
    contact_name: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    website: "",
    message: "",
  });

  function patch(k: keyof typeof form, v: string) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setDone(null);
    setLoading(true);

    try {
      const res = await fetch("/api/college-requests/event", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });


      const payload: ApiResp<{ id: string; created_at: string }> = await res.json().catch(() => ({ ok: false, message: "Invalid server response" }));

        if (!payload.ok) {
        setErr(payload.message || payload.error || "Submission failed.");
        return;
        }
      setDone(payload.message || "Request submitted.");
      setForm({
        college_name: "",
        contact_name: "",
        email: "",
        phone: "",
        city: "",
        state: "",
        website: "",
        message: "",
      });
    } catch {
      setErr("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-card p-6 space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">Publish Your College Event on Sophrion</h2>
        <p className="text-sm text-foreground/60">
          Share your event details. Our team will review and publish if it matches the platform guidelines.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="College name"
          value={form.college_name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => patch("college_name", e.target.value)}
          required
        />
        <Input
          label="Contact person"
          value={form.contact_name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => patch("contact_name", e.target.value)}
          required
        />
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => patch("email", e.target.value)}
          required
        />
        <Input
          label="Phone (optional)"
          value={form.phone}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => patch("phone", e.target.value)}
        />
        <Input
          label="City (optional)"
          value={form.city}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => patch("city", e.target.value)}
        />
        <Input
          label="State (optional)"
          value={form.state}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => patch("state", e.target.value)}
        />
        <Input
          label="Website (optional)"
          value={form.website}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => patch("website", e.target.value)}
          className="md:col-span-2"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-foreground/80">Message / Event details</label>
        <textarea
          value={form.message}
          onChange={(e) => patch("message", e.target.value)}
          rows={6}
          className="w-full rounded-xl border border-border bg-background/40 px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-foreground/20"
          placeholder="Include: event name, date, mode (online/offline), venue, registration link, poster link (if any), and a short description."
          required
        />
      </div>

      {err ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {err}
        </div>
      ) : null}

      {done ? (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {done}
        </div>
      ) : null}

      <div className="flex items-center gap-3">
        <Button
  type="submit"
  disabled={loading}
  className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white bg-linear-to-r from-[hsl(var(--brand-600))] to-[hsl(var(--cyan-500))] transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
>
  {loading ? "Submitting..." : "Submit request"}
</Button>
        <span className="text-xs text-foreground/50">
          Admin-only publishing. Students can only register once published.
        </span>
      </div>
    </form>
  );
}