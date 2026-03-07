"use client";

import * as React from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

type ApiOk<T = unknown> = { ok: true; data?: T; message?: string };
type ApiFail = {
  ok: false;
  error?: string;
  message?: string;
  fieldErrors?: Record<string, string>;
};
type ApiResp<T = unknown> = ApiOk<T> | ApiFail;

type Props = {
  slug: string;
  eventId: string;
};

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

function getErrMessage(payload: ApiResp | null | undefined) {
  if (!payload || payload.ok) {
    return "Registration failed. Please try again.";
  }

  return payload.error || payload.message || "Registration failed. Please try again.";
}

export default function EventIndividualRegisterForm({
  slug,
  eventId,
}: Props) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [college, setCollege] = React.useState("");
  const [year, setYear] = React.useState("");
  const [rollNumber, setRollNumber] = React.useState("");

  const [loading, setLoading] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>(
    {}
  );

  function resetAlerts() {
    setSuccessMsg(null);
    setErrorMsg(null);
    setFieldErrors({});
  }

  function resetForm() {
    setName("");
    setEmail("");
    setPhone("");
    setCollege("");
    setYear("");
    setRollNumber("");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    resetAlerts();
    setLoading(true);

    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        college: college.trim(),
        year: year.trim(),
        roll_number: rollNumber.trim() || undefined,
        event_id: eventId,
      };

      const res = await fetch(
        `/api/public/events/${encodeURIComponent(slug)}/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = (await res.json().catch(() => null)) as ApiResp | null;

      if (!res.ok || !data || data.ok === false) {
        if (data && !data.ok && data.fieldErrors) {
          setFieldErrors(data.fieldErrors);
        }
        setErrorMsg(getErrMessage(data));
        return;
      }

      setSuccessMsg(
        "Registration submitted successfully. Please check your email for confirmation."
      );
      resetForm();
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/3 p-4 sm:p-5">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-foreground">
            Individual details
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Fill in your registration details below.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <Input
              label="Full name"
              name="name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
              aria-invalid={fieldErrors.name ? true : undefined}
            />
            {fieldErrors.name ? (
              <p className="text-sm text-rose-300">{fieldErrors.name}</p>
            ) : null}
          </div>

          <div className="space-y-1">
            <Input
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              aria-invalid={fieldErrors.email ? true : undefined}
            />
            {fieldErrors.email ? (
              <p className="text-sm text-rose-300">{fieldErrors.email}</p>
            ) : null}
          </div>

          <div className="space-y-1">
            <Input
              label="Phone"
              name="phone"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              disabled={loading}
              aria-invalid={fieldErrors.phone ? true : undefined}
            />
            {fieldErrors.phone ? (
              <p className="text-sm text-rose-300">{fieldErrors.phone}</p>
            ) : null}
          </div>

          <div className="space-y-1">
            <Input
              label="College"
              name="college"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              required
              disabled={loading}
              aria-invalid={fieldErrors.college ? true : undefined}
            />
            {fieldErrors.college ? (
              <p className="text-sm text-rose-300">{fieldErrors.college}</p>
            ) : null}
          </div>

          <div className="space-y-1">
            <Input
              label="Year"
              name="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
              disabled={loading}
              aria-invalid={fieldErrors.year ? true : undefined}
            />
            {fieldErrors.year ? (
              <p className="text-sm text-rose-300">{fieldErrors.year}</p>
            ) : null}
          </div>

          <div className="space-y-1">
            <Input
              label="Roll number"
              name="roll_number"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              disabled={loading}
              aria-invalid={fieldErrors.roll_number ? true : undefined}
            />
            {fieldErrors.roll_number ? (
              <p className="text-sm text-rose-300">{fieldErrors.roll_number}</p>
            ) : null}
          </div>
        </div>
      </div>

      {(successMsg || errorMsg) && (
        <div aria-live="polite" className="text-sm">
          {successMsg ? (
            <p className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-emerald-200">
              {successMsg}
            </p>
          ) : (
            <p className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-rose-200">
              {errorMsg}
            </p>
          )}
        </div>
      )}

      <div className="border-t border-white/10 pt-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            We’ll use your details only for this event and confirmations.
          </p>

          <Button
            type="submit"
            disabled={loading}
            className={cn(
              "bg-linear-to-r from-[hsl(var(--brand-600))] to-[hsl(var(--cyan-500))] text-white"
            )}
          >
            {loading ? "Submitting..." : "Submit registration"}
          </Button>
        </div>
      </div>
    </form>
  );
}