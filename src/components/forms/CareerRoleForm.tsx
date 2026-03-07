"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CAREER_EMPLOYMENT_TYPES,
  CAREER_TEAMS,
  CAREER_WORK_MODES,
  type CareerRole,
  type CareersApiResponse,
} from "@/types/careers";

type Props = {
  mode: "create" | "edit";
  initialData?: CareerRole | null;
  roleId?: string;
};

type FormState = {
  title: string;
  slug: string;
  team: string;
  location: string;
  employment_type: string;
  work_mode: string;
  short_description: string;
  description: string;
  responsibilitiesText: string;
  requirementsText: string;
  niceToHaveText: string;
  min_compensation: string;
  max_compensation: string;
  compensation_currency: string;
  is_open: boolean;
  is_published: boolean;
  sort_order: string;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function toLines(value?: string[] | null) {
  return Array.isArray(value) ? value.join("\n") : "";
}

function parseLines(value: string) {
  return value
    .split("\n")
    .map((v) => v.trim())
    .filter(Boolean);
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function CareerRoleForm({
  mode,
  initialData,
  roleId,
}: Props) {
  const router = useRouter();

  const [form, setForm] = React.useState<FormState>({
    title: initialData?.title ?? "",
    slug: initialData?.slug ?? "",
    team: initialData?.team ?? CAREER_TEAMS[0],
    location: initialData?.location ?? "",
    employment_type: initialData?.employment_type ?? CAREER_EMPLOYMENT_TYPES[0],
    work_mode: initialData?.mode ?? CAREER_WORK_MODES[0],
    short_description: initialData?.short_description ?? "",
    description: initialData?.description ?? "",
    responsibilitiesText: toLines(initialData?.responsibilities),
    requirementsText: toLines(initialData?.requirements),
    niceToHaveText: toLines(initialData?.nice_to_have),
    min_compensation:
      initialData?.min_compensation != null
        ? String(initialData.min_compensation)
        : "",
    max_compensation:
      initialData?.max_compensation != null
        ? String(initialData.max_compensation)
        : "",
    compensation_currency: initialData?.compensation_currency ?? "INR",
    is_open: initialData?.is_open ?? true,
    is_published: initialData?.is_published ?? false,
    sort_order:
      initialData?.sort_order != null ? String(initialData.sort_order) : "0",
  });

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        title: form.title,
        slug: form.slug,
        team: form.team,
        location: form.location,
        employment_type: form.employment_type,
        mode: form.work_mode,
        short_description: form.short_description,
        description: form.description,
        responsibilities: parseLines(form.responsibilitiesText),
        requirements: parseLines(form.requirementsText),
        nice_to_have: parseLines(form.niceToHaveText),
        min_compensation: form.min_compensation
          ? Number(form.min_compensation)
          : null,
        max_compensation: form.max_compensation
          ? Number(form.max_compensation)
          : null,
        compensation_currency: form.compensation_currency,
        is_open: form.is_open,
        is_published: form.is_published,
        sort_order: Number(form.sort_order || 0),
      };

      const endpoint =
        mode === "create"
          ? "/api/admin/careers/create"
          : `/api/admin/careers/${roleId}`;

      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = (await res.json()) as CareersApiResponse<{ id: string }>;

      if (!res.ok || !result.ok) {
        setError("error" in result ? result.error || "Failed to save role" : "Failed to save role");
        return;
      }

      setSuccess(result.message || "Role saved successfully");

      if (mode === "create" && result.data?.id) {
        router.push(`/admin/careers/${result.data.id}`);
        router.refresh();
        return;
      }

      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Something went wrong while saving the role");
    } finally {
      setLoading(false);
    }
  }

  async function togglePublish(nextPublished: boolean) {
    if (!roleId) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const endpoint = nextPublished
        ? `/api/admin/careers/${roleId}/publish`
        : `/api/admin/careers/${roleId}/unpublish`;

      const res = await fetch(endpoint, { method: "POST" });
      const result = (await res.json()) as CareersApiResponse;

      if (!res.ok || !result.ok) {
        setError(
          "error" in result
            ? result.error || "Failed to update publish state"
            : "Failed to update publish state"
        );
        return;
      }

      setForm((prev) => ({ ...prev, is_published: nextPublished }));
      setSuccess(result.message || "Publish state updated");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Something went wrong while updating publish state");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            {mode === "create" ? "Create career role" : "Edit career role"}
          </h1>
          <p className="mt-2 text-sm text-white/60">
            Keep content structured and clean. This directly affects public page quality.
          </p>
        </div>

        {mode === "edit" && roleId ? (
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={loading || form.is_published}
              onClick={() => togglePublish(true)}
              className={cn(
                "rounded-xl px-4 py-2 text-sm font-medium text-white",
                form.is_published
                  ? "border border-emerald-400/20 bg-emerald-500/30"
                  : "border border-white/12 bg-white/5"
              )}
            >
              Publish
            </button>

            <button
              type="button"
              disabled={loading || !form.is_published}
              onClick={() => togglePublish(false)}
              className="rounded-xl border border-white/12 bg-white/5 px-4 py-2 text-sm font-medium text-white"
            >
              Unpublish
            </button>
          </div>
        ) : null}
      </div>

      {error ? (
        <div className="mb-6 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="mb-6 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
          {success}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-8">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Title" required>
            <input
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              className={inputClass}
              placeholder="Founding Product Intern"
              required
            />
          </Field>

          <Field label="Slug" required>
            <div className="space-y-2">
              <input
                value={form.slug}
                onChange={(e) => update("slug", e.target.value)}
                className={inputClass}
                placeholder="founding-product-intern"
                required
              />
              <button
                type="button"
                onClick={() => update("slug", slugify(form.title))}
                className="text-xs text-cyan-300 hover:text-cyan-200"
              >
                Generate from title
              </button>
            </div>
          </Field>

          <Field label="Team" required>
            <select
              value={form.team}
              onChange={(e) => update("team", e.target.value)}
              className={inputClass}
            >
              {CAREER_TEAMS.map((item) => (
                <option key={item} value={item} className="bg-slate-950">
                  {item}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Employment type" required>
            <select
              value={form.employment_type}
              onChange={(e) => update("employment_type", e.target.value)}
              className={inputClass}
            >
              {CAREER_EMPLOYMENT_TYPES.map((item) => (
                <option key={item} value={item} className="bg-slate-950">
                  {item}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Work mode" required>
            <select
              value={form.work_mode}
              onChange={(e) => update("work_mode", e.target.value)}
              className={inputClass}
            >
              {CAREER_WORK_MODES.map((item) => (
                <option key={item} value={item} className="bg-slate-950">
                  {item}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Location">
            <input
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              className={inputClass}
              placeholder="India / Hyderabad / Remote"
            />
          </Field>

          <Field label="Compensation min">
            <input
              type="number"
              value={form.min_compensation}
              onChange={(e) => update("min_compensation", e.target.value)}
              className={inputClass}
              placeholder="15000"
            />
          </Field>

          <Field label="Compensation max">
            <input
              type="number"
              value={form.max_compensation}
              onChange={(e) => update("max_compensation", e.target.value)}
              className={inputClass}
              placeholder="30000"
            />
          </Field>

          <Field label="Currency">
            <input
              value={form.compensation_currency}
              onChange={(e) => update("compensation_currency", e.target.value)}
              className={inputClass}
              placeholder="INR"
            />
          </Field>

          <Field label="Sort order">
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => update("sort_order", e.target.value)}
              className={inputClass}
              placeholder="0"
            />
          </Field>
        </div>

        <Field label="Short description" required>
          <textarea
            rows={4}
            value={form.short_description}
            onChange={(e) => update("short_description", e.target.value)}
            className={textareaClass}
            placeholder="One compact, high-quality summary for the role card and header."
            required
          />
        </Field>

        <Field label="Role summary / description">
          <textarea
            rows={6}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            className={textareaClass}
            placeholder="High-level role context, impact, and expectations."
          />
        </Field>

        <div className="grid gap-5 lg:grid-cols-3">
          <Field label="Responsibilities">
            <textarea
              rows={10}
              value={form.responsibilitiesText}
              onChange={(e) => update("responsibilitiesText", e.target.value)}
              className={textareaClass}
              placeholder="One item per line"
            />
          </Field>

          <Field label="Requirements">
            <textarea
              rows={10}
              value={form.requirementsText}
              onChange={(e) => update("requirementsText", e.target.value)}
              className={textareaClass}
              placeholder="One item per line"
            />
          </Field>

          <Field label="Nice to have">
            <textarea
              rows={10}
              value={form.niceToHaveText}
              onChange={(e) => update("niceToHaveText", e.target.value)}
              className={textareaClass}
              placeholder="One item per line"
            />
          </Field>
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-3 text-sm text-white/80">
            <input
              type="checkbox"
              checked={form.is_open}
              onChange={(e) => update("is_open", e.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-black/20"
            />
            Role is open
          </label>

          <label className="flex items-center gap-3 text-sm text-white/80">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => update("is_published", e.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-black/20"
            />
            Role is published
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className={cn(
              "rounded-xl bg-linear-to-r from-violet-500 to-cyan-500 px-5 py-3 text-sm font-medium text-white",
              loading && "cursor-not-allowed opacity-70"
            )}
          >
            {loading
              ? "Saving..."
              : mode === "create"
              ? "Create role"
              : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

const inputClass =
  "h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-cyan-400/30";

const textareaClass =
  "w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-cyan-400/30";

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-white/85">
        {label}
        {required ? <span className="ml-1 text-cyan-300">*</span> : null}
      </label>
      {children}
    </div>
  );
}