// src/components/tickets/TicketStatusBadge.tsx

import type { TicketStatus } from "@/lib/tickets/types";

type Props = {
  status: TicketStatus;
};

function labelForStatus(status: TicketStatus) {
  switch (status) {
    case "active":
      return "Active";
    case "used":
      return "Checked In";
    case "invalidated":
      return "Invalidated";
    case "cancelled":
      return "Cancelled";
    default:
      return "Unknown";
  }
}

function classesForStatus(status: TicketStatus) {
  switch (status) {
    case "active":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    case "used":
      return "border-cyan-500/30 bg-cyan-500/10 text-cyan-300";
    case "invalidated":
      return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    case "cancelled":
      return "border-rose-500/30 bg-rose-500/10 text-rose-300";
    default:
      return "border-white/10 bg-white/5 text-white/70";
  }
}

export default function TicketStatusBadge({ status }: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-wide ${classesForStatus(
        status
      )}`}
    >
      {labelForStatus(status)}
    </span>
  );
}