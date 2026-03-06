// src/types/events.ts
export type EventListItem = {
  id: string;
  name: string;
  slug?: string;
  start_date?: string | null;
  location?: string | null;
};

export function eventMeta(e: EventListItem) {
  const parts = [];
  if (e.start_date) parts.push(e.start_date);
  if (e.location) parts.push(e.location);
  return parts.join(" • ");
}