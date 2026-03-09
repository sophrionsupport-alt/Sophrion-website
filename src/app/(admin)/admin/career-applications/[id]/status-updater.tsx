"use client";

import { useState } from "react";

const STATUSES = [
  "new",
  "reviewing",
  "shortlisted",
  "interviewing",
  "selected",
  "rejected",
];

export default function StatusUpdater({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const [value, setValue] = useState(status);

  async function update() {
    await fetch(`/api/admin/career-applications/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: value }),
    });

    location.reload();
  }

  return (
    <div className="space-y-4">

      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="rounded-xl bg-black/20 border border-white/10 p-3 text-white"
      >
        {STATUSES.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>

      <button
        onClick={update}
        className="px-4 py-2 rounded-lg bg-cyan-500 text-white"
      >
        Update Status
      </button>

    </div>
  );
}