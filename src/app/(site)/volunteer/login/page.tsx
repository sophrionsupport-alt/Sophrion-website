"use client";

import { useState } from "react";

export default function VolunteerLoginPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [eventId, setEventId] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch("/api/volunteer/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          code,
          eventId,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json?.ok) {
        alert(json?.error || "Login failed");
        return;
      }

      window.location.href = `/volunteer/scanner/${eventId}`;
    } catch (error) {
      console.error(error);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <div className="rounded-2xl border border-border bg-card p-6">
        <h1 className="text-2xl font-semibold">Volunteer Scanner Login</h1>
        <p className="mt-2 text-sm text-foreground/60">
          Temporary access for event check-in only.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <input
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
            placeholder="Volunteer email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
            placeholder="Temporary access code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <input
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
            placeholder="Event ID"
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl border border-border bg-foreground px-4 py-3 text-sm text-background disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Open Scanner"}
          </button>
        </form>
      </div>
    </div>
  );
}