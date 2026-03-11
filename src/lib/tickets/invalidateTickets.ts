// src/lib/tickets/invalidateTickets.ts

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { TicketRegistrationKind } from "./types";

function nowIso() {
  return new Date().toISOString();
}

export async function invalidateTickets(input: {
  eventId: string;
  registrationId: string;
  registrationKind: TicketRegistrationKind;
  actorId?: string | null;
}) {
  const supabase = createSupabaseAdminClient();

  const { data: tickets, error: fetchError } = await supabase
    .from("event_tickets")
    .select("id")
    .eq("event_id", input.eventId)
    .eq("registration_id", input.registrationId)
    .eq("registration_kind", input.registrationKind)
    .eq("status", "active");

  if (fetchError || !tickets || tickets.length === 0) {
    return;
  }

  const ids = tickets.map((ticket) => ticket.id);
  const invalidatedAt = nowIso();

  await supabase
    .from("event_tickets")
    .update({
      status: "invalidated",
      invalidated_at: invalidatedAt,
    })
    .in("id", ids);

  await supabase.from("ticket_audit_logs").insert(
    ids.map((ticketId) => ({
      ticket_id: ticketId,
      registration_id: input.registrationId,
      event_id: input.eventId,
      actor_id: input.actorId ?? null,
      action: "invalidated",
      meta: {
        registration_kind: input.registrationKind,
        invalidated_at: invalidatedAt,
      },
      created_at: invalidatedAt,
    }))
  );
}