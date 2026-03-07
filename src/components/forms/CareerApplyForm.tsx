// src/components/forms/CareerApplyForm.tsx
"use client";

import * as React from "react";
import type { CareersApiResponse } from "@/types/careers";

type Props = {
  roleId?: string | null;
  roleTitle?: string | null;
  source?: string;
};

type FormState = {
  full_name: string;
  email: string;
  phone: string;
  college: string;
  degree: string;
  graduation_year: string;
  linkedin_url: string;
  portfolio_url: string;
  why_join: string;
  cover_letter: string;
};

const initialState: FormState = {
  full_name: "",
  email: "",
  phone: "",
  college: "",
  degree: "",
  graduation_year: "",
  linkedin_url: "",
  portfolio_url: "",
  why_join: "",
  cover_letter: "",
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function FieldLabel({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-sm font-medium text-white/85"
    >
      {children}
      {required ? <span className="ml-1 text-cyan-300">*</span> : null}
    </label>
  );
}

export default function CareerApplyForm({
  roleId = null,
  roleTitle = null,
  source = "careers_site",
}: Props) {
  const [form, setForm] = React.useState<FormState>(initialState);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const res = await fetch("/api/public/careers/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role_id: roleId || undefined,
          role_title_snapshot: roleTitle || undefined,
          source,
          ...form,
        }),
      });

      const payload = (await res.json()) as CareersApiResponse;

      if (!res.ok || !payload.ok) {
        setError(
          payload && "error" in payload && payload.error
            ? payload.error
            : "Application submission failed. Please try again."
        );
        return;
      }

      setSuccessMessage(
        payload.message ||
          "Application submitted successfully. We’ll review it and get back to you if there is a fit."
      );
      setForm(initialState);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while submitting your application.");
    } finally {
      setLoading(false);
    }
  }

  if (successMessage) {
    return (
      <div className="rounded-[1.75rem] border border-emerald-400/20 bg-emerald-400/10 p-6 md:p-8">
        <h3 className="text-2xl font-semibold text-white">
          Application submitted
        </h3>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/80">
          {successMessage}
        </p>
        <button
          type="button"
          onClick={() => setSuccessMessage("")}
          className="mt-6 inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white/85"
        >
          Submit another application
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/3 p-6 md:p-8">
      <div className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-300/80">
          Application form
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
          {roleTitle ? `Apply for ${roleTitle}` : "Join Sophrion"}
        </h2>
        <p className="mt-4 text-sm leading-7 text-white/65">
          We care more about clarity, ownership, and intent than polished
          corporate language. Keep it real and make your case well.
        </p>
      </div>

      {error ? (
        <div className="mt-6 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="mt-8 space-y-8">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <FieldLabel htmlFor="full_name" required>
              Full name
            </FieldLabel>
            <input
              id="full_name"
              value={form.full_name}
              onChange={(e) => update("full_name", e.target.value)}
              className="h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-cyan-400/30"
              placeholder="Your full name"
              required
            />
          </div>

          <div>
            <FieldLabel htmlFor="email" required>
              Email
            </FieldLabel>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className="h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-cyan-400/30"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <FieldLabel htmlFor="phone">Phone</FieldLabel>
            <input
              id="phone"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              className="h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-cyan-400/30"
              placeholder="+91..."
            />
          </div>

          <div>
            <FieldLabel htmlFor="college">College / Institution</FieldLabel>
            <input
              id="college"
              value={form.college}
              onChange={(e) => update("college", e.target.value)}
              className="h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-cyan-400/30"
              placeholder="Your college or institution"
            />
          </div>

          <div>
            <FieldLabel htmlFor="degree">Degree / Program</FieldLabel>
            <input
              id="degree"
              value={form.degree}
              onChange={(e) => update("degree", e.target.value)}
              className="h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-cyan-400/30"
              placeholder="B.Tech, MBA, etc."
            />
          </div>

          <div>
            <FieldLabel htmlFor="graduation_year">Graduation year</FieldLabel>
            <input
              id="graduation_year"
              value={form.graduation_year}
              onChange={(e) => update("graduation_year", e.target.value)}
              className="h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-cyan-400/30"
              placeholder="2026"
            />
          </div>

          <div>
            <FieldLabel htmlFor="linkedin_url">LinkedIn URL</FieldLabel>
            <input
              id="linkedin_url"
              type="url"
              value={form.linkedin_url}
              onChange={(e) => update("linkedin_url", e.target.value)}
              className="h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-cyan-400/30"
              placeholder="https://linkedin.com/in/..."
            />
          </div>

          <div>
            <FieldLabel htmlFor="portfolio_url">Portfolio URL</FieldLabel>
            <input
              id="portfolio_url"
              type="url"
              value={form.portfolio_url}
              onChange={(e) => update("portfolio_url", e.target.value)}
              className="h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-cyan-400/30"
              placeholder="https://yourportfolio.com"
            />
          </div>
        </div>

        <div>
          <FieldLabel htmlFor="why_join" required>
            Why do you want to join Sophrion?
          </FieldLabel>
          <textarea
            id="why_join"
            value={form.why_join}
            onChange={(e) => update("why_join", e.target.value)}
            rows={6}
            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-cyan-400/30"
            placeholder="Tell us why this mission, this role, and this stage of company make sense for you."
            required
          />
        </div>

        <div>
          <FieldLabel htmlFor="cover_letter">Anything else we should know?</FieldLabel>
          <textarea
            id="cover_letter"
            value={form.cover_letter}
            onChange={(e) => update("cover_letter", e.target.value)}
            rows={5}
            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-cyan-400/30"
            placeholder="Relevant projects, achievements, links, context, availability, or anything important."
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={loading}
            className={cn(
              "inline-flex items-center justify-center rounded-xl bg-linear-to-r from-violet-500 to-cyan-500 px-5 py-3 text-sm font-medium text-white transition",
              loading && "cursor-not-allowed opacity-70"
            )}
          >
            {loading ? "Submitting..." : "Submit application"}
          </button>

          <p className="text-xs leading-6 text-white/45">
            By applying, you agree that Sophrion may review the information you
            submit for hiring-related evaluation.
          </p>
        </div>
      </form>
    </div>
  );
}