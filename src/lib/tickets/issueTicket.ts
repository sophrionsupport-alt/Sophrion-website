// src/lib/tickets/issueTicket.ts
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { generateTicketCode } from "./generateCode";
import { createTicketToken } from "./token";
import { getRegistrationSnapshot } from "./getRegistrationSnapshot";
import { invalidateTickets } from "./invalidateTickets";
import type { IssueTicketInput } from "./types";

export async function issueTicket(input: IssueTicketInput) {
  const supabase = createSupabaseAdminClient();

  const snapshot = await getRegistrationSnapshot({
    registrationId: input.registrationId,
    registrationKind: input.registrationKind,
  });

  if (!snapshot) {
    throw new Error("Registration not found.");
  }

  if (snapshot.eventId !== input.eventId) {
    throw new Error("Registration does not belong to this event.");
  }

  await invalidateTickets({
    eventId: input.eventId,
    registrationId: input.registrationId,
    registrationKind: input.registrationKind,
    actorId: input.actorId,
  });

  const ticketCode = generateTicketCode();
  const temporaryVerificationToken = `pending_${crypto.randomUUID()}`;

  const { data: ticket, error } = await supabase
    .from("event_tickets")
    .insert({
      event_id: input.eventId,
      registration_id: input.registrationId,
      registration_kind: input.registrationKind,
      ticket_code: ticketCode,
      verification_token: temporaryVerificationToken,
      status: "active",
      version: 1,
      created_by: input.actorId ?? null,
      notes: input.notes ?? null,
    })
    .select()
    .single();

  if (error || !ticket) {
    console.error("event_tickets insert failed:", error);
    throw new Error(
      `Failed to create ticket: ${error?.message ?? "Unknown insert error"}`
    );
  }

  const token = createTicketToken({
    ticketId: ticket.id,
    registrationId: input.registrationId,
    registrationKind: input.registrationKind,
    eventId: input.eventId,
    version: ticket.version,
    timestamp: Date.now(),
    nonce: crypto.randomUUID(),
  });

  const { error: updateError } = await supabase
    .from("event_tickets")
    .update({
      verification_token: token,
      updated_at: new Date().toISOString(),
    })
    .eq("id", ticket.id);

  if (updateError) {
    console.error("event_tickets token update failed:", updateError);
    throw new Error(
      `Ticket created but token update failed: ${updateError.message}`
    );
  }

  const { error: auditError } = await supabase.from("ticket_audit_logs").insert({
    ticket_id: ticket.id,
    registration_id: input.registrationId,
    event_id: input.eventId,
    actor_id: input.actorId ?? null,
    action: "issued",
    created_at: new Date().toISOString(),
  });

  if (auditError) {
    console.error("ticket_audit_logs insert failed:", auditError);
    throw new Error(`Ticket created but audit log failed: ${auditError.message}`);
  }

  return {
    ...ticket,
    verification_token: token,
  };
}