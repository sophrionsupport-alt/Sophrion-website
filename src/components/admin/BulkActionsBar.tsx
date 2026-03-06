"use client";

import * as React from "react";

export default function BulkActionsBar({
  selectedCount,
  onClear,
  onApprove,
  onReject,
  onPending,
  loading = false,
}: {
  selectedCount: number;
  onClear: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onPending?: () => void;
  loading?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4">
      <div className="text-sm text-foreground/70">
        <span className="font-semibold text-foreground">{selectedCount}</span>{" "}
        selected
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {onPending ? (
          <button
            disabled={loading}
            onClick={onPending}
            className="rounded-xl border border-border bg-background/40 px-3 py-2 text-xs hover:bg-background/60 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Mark Pending
          </button>
        ) : null}

        {onApprove ? (
          <button
            disabled={loading}
            onClick={onApprove}
            className="rounded-xl border border-border bg-background/40 px-3 py-2 text-xs hover:bg-background/60 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Approve
          </button>
        ) : null}

        {onReject ? (
          <button
            disabled={loading}
            onClick={onReject}
            className="rounded-xl border border-border bg-background/40 px-3 py-2 text-xs hover:bg-background/60 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Reject
          </button>
        ) : null}

        <button
          disabled={loading}
          onClick={onClear}
          className="rounded-xl border border-border bg-background/40 px-3 py-2 text-xs hover:bg-background/60 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Clear
        </button>
      </div>
    </div>
  );
}