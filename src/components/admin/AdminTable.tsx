"use client";

import * as React from "react";

export type AdminRowStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "published"
  | "draft"
  | "active"
  | "team"
  | "unsubscribed";

export type AdminRow = {
  id: string;
  primary: string;
  secondary?: string;
  status?: AdminRowStatus;
  meta?: string;
};

type Props = {
  rows: AdminRow[];
  selectedIds?: string[];
  onSelectedIdsChange?: (next: string[]) => void;
  columnsLabel?: {
    primary?: string;
    status?: string;
    meta?: string;
    actions?: string;
  };
  renderActions?: (row: AdminRow) => React.ReactNode;
};

export default function AdminTable({
  rows,
  selectedIds,
  onSelectedIdsChange,
  columnsLabel,
  renderActions,
}: Props) {
  const hasActions = typeof renderActions === "function";

  const selectable = !!selectedIds && !!onSelectedIdsChange;
  const selected = selectedIds ?? [];

  const allIds = rows.map((r) => r.id);
  const allSelected =
    selectable && rows.length > 0 && selected.length === rows.length;

  function toggleAll() {
    if (!selectable) return;
    onSelectedIdsChange(allSelected ? [] : allIds);
  }

  function toggleOne(id: string) {
    if (!selectable) return;

    onSelectedIdsChange(
      selected.includes(id)
        ? selected.filter((x) => x !== id)
        : [...selected, id]
    );
  }

  function StatusBadge({ status }: { status: AdminRowStatus }) {
    const base =
      "inline-flex items-center rounded-full border px-2 py-0.5 text-xs";

    if (status === "approved")
      return (
        <span
          className={`${base} border-emerald-500/20 bg-emerald-500/10 text-emerald-200`}
        >
          Approved
        </span>
      );

    if (status === "rejected")
      return (
        <span
          className={`${base} border-red-500/20 bg-red-500/10 text-red-200`}
        >
          Rejected
        </span>
      );

    if (status === "published")
      return (
        <span
          className={`${base} border-cyan-500/20 bg-cyan-500/10 text-cyan-200`}
        >
          Published
        </span>
      );

    if (status === "draft")
      return (
        <span
          className={`${base} border-slate-500/20 bg-slate-500/10 text-slate-200`}
        >
          Draft
        </span>
      );

    if (status === "active")
      return (
        <span
          className={`${base} border-emerald-500/20 bg-emerald-500/10 text-emerald-200`}
        >
          Active
        </span>
      );

    if (status === "team")
      return (
        <span
          className={`${base} border-purple-500/20 bg-purple-500/10 text-purple-200`}
        >
          Team
        </span>
      );

    if (status === "unsubscribed")
      return (
        <span
          className={`${base} border-amber-500/20 bg-amber-500/10 text-amber-200`}
        >
          Unsubscribed
        </span>
      );

    return (
      <span
        className={`${base} border-amber-500/20 bg-amber-500/10 text-amber-200`}
      >
        Pending
      </span>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-card">
          <tr className="text-left">
            {selectable && (
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  aria-label="Select all"
                />
              </th>
            )}

            <th className="px-4 py-3">
              {columnsLabel?.primary ?? "Item"}
            </th>

            <th className="px-4 py-3">
              {columnsLabel?.status ?? "Status"}
            </th>

            <th className="px-4 py-3">
              {columnsLabel?.meta ?? "Meta"}
            </th>

            {hasActions && (
              <th className="px-4 py-3">
                {columnsLabel?.actions ?? "Actions"}
              </th>
            )}
          </tr>
        </thead>

        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-border/60">
              {selectable && (
                <td className="px-4 py-3 align-top">
                  <input
                    type="checkbox"
                    checked={selected.includes(r.id)}
                    onChange={() => toggleOne(r.id)}
                    aria-label={`Select ${r.primary}`}
                  />
                </td>
              )}

              <td className="px-4 py-3 align-top">
                <div className="font-medium text-foreground">
                  {r.primary}
                </div>

                {r.secondary && (
                  <div className="mt-0.5 text-xs text-foreground/60">
                    {r.secondary}
                  </div>
                )}
              </td>

              <td className="px-4 py-3 align-top">
                {r.status ? (
                  <StatusBadge status={r.status} />
                ) : (
                  <span className="text-xs text-foreground/50">—</span>
                )}
              </td>

              <td className="px-4 py-3 align-top text-foreground/70">
                {r.meta ?? "—"}
              </td>

              {hasActions && (
                <td className="px-4 py-3 align-top">
                  <div className="flex flex-wrap gap-2">
                    {renderActions?.(r)}
                  </div>
                </td>
              )}
            </tr>
          ))}

          {rows.length === 0 && (
            <tr>
              <td
                className="px-4 py-10 text-center text-sm text-foreground/60"
                colSpan={(selectable ? 1 : 0) + (hasActions ? 4 : 3)}
              >
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}