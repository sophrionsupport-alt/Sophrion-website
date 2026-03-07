// src/app/(admin)/admin/career-applications/[id]/status-updater.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CAREER_APPLICATION_STATUSES,
  type CareersApiResponse,
} from "@/types/careers";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function StatusUpdater({
  id,
  currentStatus,
}: {
  id: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [status, setStatus] = React.useState(currentStatus);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/admin/career-applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const result = (await res.json()) as CareersApiResponse;

      if (!res.ok || !result.ok) {
        setError(
          result && "error" in result && result.error
            ? result.error
            : "Failed to update application status"
        );
        return;
      }

      setSuccess(result.message || "Application status updated");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Something went wrong while updating status");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-white/10 bg-white/3 p-6"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="w-full max-w-sm">
          <label className="mb-2 block text-sm font-medium text-white/85">
            Application status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-11 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none"
          >
            {CAREER_APPLICATION_STATUSES.map((item) => (
              <option key={item} value={item} className="bg-slate-950">
                {item}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={cn(
            "inline-flex rounded-xl bg-linear-to-r from-violet-500 to-cyan-500 px-5 py-3 text-sm font-medium text-white",
            loading && "cursor-not-allowed opacity-70"
          )}
        >
          {loading ? "Updating..." : "Update status"}
        </button>
      </div>

      {error ? (
        <div className="mt-4 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
          {success}
        </div>
      ) : null}
    </form>
  );
}