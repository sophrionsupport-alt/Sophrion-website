"use client";

import * as React from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

type ApiOk<T = unknown> = { ok: true; data?: T; message?: string };
type ApiFail = { ok: false; error?: string; message?: string };
type ApiResp<T = unknown> = ApiOk<T> | ApiFail;

function getErrMessage(payload: any) {
  return payload?.error || payload?.message || "Registration failed. Please try again.";
}

type Props = {
  slug: string;
  triggerLabel?: string;
  className?: string;
};

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

export default function EventRegisterModal({ slug, triggerLabel }: Props) {
  const [open, setOpen] = React.useState(false);

  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [college, setCollege] = React.useState("");
  const [year, setYear] = React.useState("");
  const [rollNumber, setRollNumber] = React.useState("");

  const [loading, setLoading] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const handleClose = React.useCallback(() => {
    setOpen(false);
  }, []);

  function resetAlerts() {
    setSuccessMsg(null);
    setErrorMsg(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    resetAlerts();

    const payload = {
      full_name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      college: college.trim() || undefined,
      year: year.trim() || undefined,
      roll_number: rollNumber.trim() || undefined,
      source: "event_page",
    };

    setLoading(true);
    try {
      const res = await fetch(`/api/events/${encodeURIComponent(slug)}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json().catch(() => ({}))) as ApiResp;

      if (!res.ok || (data as any)?.ok === false) {
        setErrorMsg(getErrMessage(data));
        return;
      }

      setSuccessMsg(
        (data as any)?.message ||
          "Registration received. You’ll get a confirmation email after verification."
      );

      setFullName("");
      setEmail("");
      setPhone("");
      setCollege("");
      setYear("");
      setRollNumber("");
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button
        type="button"
        onClick={() => {
          resetAlerts();
          setOpen(true);
        }}
        className={cn(
          "bg-linear-to-r from-[hsl(var(--brand-600))] to-[hsl(var(--cyan-500))] text-white",
          "shadow-[0_0_0_1px_hsl(var(--border)/0.6),0_16px_50px_-30px_hsl(var(--cyan-500)/0.45)]",
          "hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        )}
      >
        {triggerLabel ?? "Register"}
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        title="Event registration"
        description="Submit your details. We’ll verify and confirm via email."
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            label="Full name"
            name="name"
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            disabled={loading}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            <Input
              label="Phone (optional)"
              name="phone"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="College (optional)"
              name="college"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              disabled={loading}
            />
            <Input
              label="Year (optional)"
              name="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              disabled={loading}
              placeholder="e.g., 2nd Year"
            />
          </div>

          <Input
            label="Roll number (optional)"
            name="roll_number"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            disabled={loading}
          />

          {(successMsg || errorMsg) && (
            <div aria-live="polite" className="text-sm">
              {successMsg ? (
                <p
                  className={cn(
                    "rounded-xl border px-3 py-2",
                    "border-emerald-500/20 bg-emerald-500/10 text-emerald-200"
                  )}
                >
                  {successMsg}
                </p>
              ) : (
                <p
                  className={cn(
                    "rounded-xl border px-3 py-2",
                    "border-rose-500/20 bg-rose-500/10 text-rose-200"
                  )}
                >
                  {errorMsg}
                </p>
              )}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={loading}
              className={cn(
                "bg-white/5 text-foreground border border-white/10",
                "hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              )}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className={cn(
                "bg-linear-to-r from-[hsl(var(--brand-600))] to-[hsl(var(--cyan-500))] text-white",
                "shadow-[0_0_0_1px_hsl(var(--border)/0.6),0_16px_50px_-30px_hsl(var(--cyan-500)/0.45)]",
                "hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              )}
            >
              {loading ? "Submitting..." : "Submit registration"}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            We’ll use your details only for this event and confirmations.
          </p>
        </form>
      </Modal>
    </>
  );
}