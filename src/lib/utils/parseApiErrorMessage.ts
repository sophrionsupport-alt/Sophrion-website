/**
 * Normalizes API error bodies from `fail()` in `@/lib/utils/http`
 * (`{ ok: false, error: { message, details } }`) and legacy `{ error: string }`.
 */
export function parseApiErrorMessage(payload: unknown): string {
  if (!payload || typeof payload !== "object") {
    return "Something went wrong. Please try again.";
  }

  const o = payload as { error?: unknown; message?: unknown };

  if (typeof o.message === "string" && o.message.trim()) {
    return o.message.trim();
  }

  if (typeof o.error === "string" && o.error.trim()) {
    return o.error.trim();
  }

  if (o.error && typeof o.error === "object" && "message" in o.error) {
    const m = (o.error as { message?: unknown }).message;
    if (typeof m === "string" && m.trim()) {
      return m.trim();
    }
  }

  if (o.error && typeof o.error === "object" && "details" in o.error) {
    const details = (o.error as { details?: unknown }).details;
    if (details && typeof details === "object" && details !== null && "issues" in details) {
      const issues = (details as { issues?: unknown }).issues;
      if (Array.isArray(issues) && issues.length > 0) {
        const first = issues[0];
        if (
          first &&
          typeof first === "object" &&
          "message" in first &&
          typeof (first as { message: unknown }).message === "string"
        ) {
          return (first as { message: string }).message;
        }
      }
    }
  }

  return "Something went wrong. Please try again.";
}
