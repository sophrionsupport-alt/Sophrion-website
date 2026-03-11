/**
 * Centralized IST time utilities
 * Database stays UTC, UI always converts to IST.
 */

const IST_ZONE = "Asia/Kolkata";

export function toIST(value?: string | Date | null) {
  if (!value) return null;

  const date = typeof value === "string" ? new Date(value) : value;

  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleString("en-IN", {
    timeZone: IST_ZONE,
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function formatDateIST(value?: string | Date | null) {
  if (!value) return null;

  const date = typeof value === "string" ? new Date(value) : value;

  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleDateString("en-IN", {
    timeZone: IST_ZONE,
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export function formatTimeIST(value?: string | Date | null) {
  if (!value) return null;

  const date = typeof value === "string" ? new Date(value) : value;

  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleTimeString("en-IN", {
    timeZone: IST_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

/**
 * Returns "2 minutes ago", "5 hours ago", etc.
 */
export function relativeTime(value?: string | Date | null) {
  if (!value) return null;

  const date = typeof value === "string" ? new Date(value) : value;

  if (Number.isNaN(date.getTime())) return null;

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}