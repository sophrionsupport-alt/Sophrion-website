"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

export default function NewEventPage() {
  const router = useRouter();

  const [loading, setLoading] = React.useState(false);

  const [form, setForm] = React.useState({
    title: "",
    subtitle: "",
    description: "",
    mode: "offline",
    city: "",
    state: "",
    venue: "",
    start_at: "",
    end_at: "",
    banner_url: "",
  });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch("/api/admin/events/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (!res.ok || !json?.ok) {
        alert(json?.error || "Failed to create event");
        return;
      }

      router.push("/admin/events");

    } catch {
      alert("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">

      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Create Event
        </h1>
        <p className="text-sm text-foreground/60">
          Publish a new Sophrion event.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-4">

        <input
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          placeholder="Event title"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          required
        />

        <input
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          placeholder="Subtitle"
          value={form.subtitle}
          onChange={(e) => update("subtitle", e.target.value)}
        />

        <textarea
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          placeholder="Description"
          rows={5}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
            placeholder="City"
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
          />

          <input
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
            placeholder="State"
            value={form.state}
            onChange={(e) => update("state", e.target.value)}
          />
        </div>

        <input
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          placeholder="Venue"
          value={form.venue}
          onChange={(e) => update("venue", e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="datetime-local"
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
            value={form.start_at}
            onChange={(e) => update("start_at", e.target.value)}
          />

          <input
            type="datetime-local"
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
            value={form.end_at}
            onChange={(e) => update("end_at", e.target.value)}
          />
        </div>

        <input
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          placeholder="Banner image URL"
          value={form.banner_url}
          onChange={(e) => update("banner_url", e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl border border-border bg-background/40 px-4 py-2 text-sm hover:bg-background/60 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Event"}
        </button>

      </form>
    </div>
  );
}