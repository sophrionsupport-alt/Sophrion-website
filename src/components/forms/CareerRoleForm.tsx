"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { CareerRoleFormValues, CareerTeam } from "@/types/careers";
import {
  CAREER_TEAMS,
  CAREER_EMPLOYMENT_TYPES,
  CAREER_WORK_MODES,
} from "@/types/careers";

const defaultValues: CareerRoleFormValues = {
  title: "",
  slug: "",
  team: "Engineering" as CareerTeam,
  location: "",
  employment_type: "Full-time",
  mode: "Hybrid",
  short_description: "",
  description: "",
  responsibilities: [""],
  requirements: [""],
  nice_to_have: [""],
  min_compensation: null,
  max_compensation: null,
  compensation_currency: "INR",
  is_open: true,
  is_published: false,
  sort_order: 0,
};

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function CareerRoleForm({ mode }: { mode: "create" | "edit" }) {
  void mode;
  const router = useRouter();
  const [values, setValues] = React.useState<CareerRoleFormValues>(defaultValues);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  function set<K extends keyof CareerRoleFormValues>(key: K, v: CareerRoleFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: v }));
  }

  function updateList(
    key: "responsibilities" | "requirements" | "nice_to_have",
    index: number,
    text: string
  ) {
    setValues((prev) => {
      const copy = [...prev[key]];
      copy[index] = text;
      return { ...prev, [key]: copy };
    });
  }

  function addLine(key: "responsibilities" | "requirements" | "nice_to_have") {
    setValues((prev) => ({ ...prev, [key]: [...prev[key], ""] }));
  }

  function removeLine(key: "responsibilities" | "requirements" | "nice_to_have", index: number) {
    setValues((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index),
    }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const slug = values.slug.trim() || slugify(values.title);
    const payload = {
      ...values,
      slug,
      responsibilities: values.responsibilities.map((s) => s.trim()).filter(Boolean),
      requirements: values.requirements.map((s) => s.trim()).filter(Boolean),
      nice_to_have: values.nice_to_have.map((s) => s.trim()).filter(Boolean),
    };

    try {
      const res = await fetch("/api/admin/careers", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json?.ok) {
        setError(json?.error || "Failed to save");
        return;
      }
      router.push("/admin/careers");
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-border bg-card p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="text-foreground/80">Title</span>
          <input
            required
            className="w-full rounded-xl border border-border bg-background px-3 py-2"
            value={values.title}
            onChange={(e) => {
              const t = e.target.value;
              set("title", t);
              if (!values.slug) set("slug", slugify(t));
            }}
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-foreground/80">Slug</span>
          <input
            required
            className="w-full rounded-xl border border-border bg-background px-3 py-2 font-mono text-xs"
            value={values.slug}
            onChange={(e) => set("slug", e.target.value)}
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-foreground/80">Team</span>
          <select
            className="w-full rounded-xl border border-border bg-background px-3 py-2"
            value={values.team}
            onChange={(e) => set("team", e.target.value as CareerTeam)}
          >
            {CAREER_TEAMS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-foreground/80">Location</span>
          <input
            className="w-full rounded-xl border border-border bg-background px-3 py-2"
            value={values.location}
            onChange={(e) => set("location", e.target.value)}
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-foreground/80">Employment type</span>
          <select
            className="w-full rounded-xl border border-border bg-background px-3 py-2"
            value={values.employment_type}
            onChange={(e) =>
              set(
                "employment_type",
                e.target.value as CareerRoleFormValues["employment_type"]
              )
            }
          >
            {CAREER_EMPLOYMENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-foreground/80">Work mode</span>
          <select
            className="w-full rounded-xl border border-border bg-background px-3 py-2"
            value={values.mode}
            onChange={(e) => set("mode", e.target.value as CareerRoleFormValues["mode"])}
          >
            {CAREER_WORK_MODES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block space-y-1 text-sm">
        <span className="text-foreground/80">Short description</span>
        <textarea
          required
          rows={3}
          className="w-full rounded-xl border border-border bg-background px-3 py-2"
          value={values.short_description}
          onChange={(e) => set("short_description", e.target.value)}
        />
      </label>

      <label className="block space-y-1 text-sm">
        <span className="text-foreground/80">Full description</span>
        <textarea
          rows={5}
          className="w-full rounded-xl border border-border bg-background px-3 py-2"
          value={values.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </label>

      {(
        [
          ["responsibilities", "Responsibilities"],
          ["requirements", "Requirements"],
          ["nice_to_have", "Nice to have"],
        ] as const
      ).map(([key, label]) => (
        <div key={key} className="space-y-2">
          <div className="text-sm font-medium text-foreground/80">{label}</div>
          {values[key].map((line, i) => (
            <div key={`${key}-${i}`} className="flex gap-2">
              <input
                className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm"
                value={line}
                onChange={(e) => updateList(key, i, e.target.value)}
              />
              <button
                type="button"
                className="rounded-xl border border-border px-3 text-xs"
                onClick={() => removeLine(key, i)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="text-xs text-foreground/70 underline"
            onClick={() => addLine(key)}
          >
            Add line
          </button>
        </div>
      ))}

      <div className="grid gap-4 md:grid-cols-3">
        <label className="space-y-1 text-sm">
          <span className="text-foreground/80">Min compensation</span>
          <input
            type="number"
            className="w-full rounded-xl border border-border bg-background px-3 py-2"
            value={values.min_compensation ?? ""}
            onChange={(e) =>
              set("min_compensation", e.target.value === "" ? null : Number(e.target.value))
            }
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-foreground/80">Max compensation</span>
          <input
            type="number"
            className="w-full rounded-xl border border-border bg-background px-3 py-2"
            value={values.max_compensation ?? ""}
            onChange={(e) =>
              set("max_compensation", e.target.value === "" ? null : Number(e.target.value))
            }
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-foreground/80">Currency</span>
          <input
            className="w-full rounded-xl border border-border bg-background px-3 py-2"
            value={values.compensation_currency}
            onChange={(e) => set("compensation_currency", e.target.value)}
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.is_open}
            onChange={(e) => set("is_open", e.target.checked)}
          />
          Open for applications
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.is_published}
            onChange={(e) => set("is_published", e.target.checked)}
          />
          Published
        </label>
        <label className="flex items-center gap-2">
          Sort order
          <input
            type="number"
            className="w-24 rounded-xl border border-border bg-background px-2 py-1"
            value={values.sort_order}
            onChange={(e) => set("sort_order", Number(e.target.value) || 0)}
          />
        </label>
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <button
        type="submit"
        disabled={saving}
        className="rounded-xl bg-foreground px-4 py-2 text-sm text-background disabled:opacity-50"
      >
        {saving ? "Saving…" : "Create role"}
      </button>
    </form>
  );
}
