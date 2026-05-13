import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { verifyTicketToken } from "@/lib/tickets/token";
import type {
  CheckInTicketInput,
  CheckInTicketResult,
  RegistrationSnapshot,
  TicketBase,
} from "@/lib/tickets/types";

function asTicket(row: unknown): TicketBase | null {
  if (!row || typeof row !== "object") return null;
  const t = row as Record<string, unknown>;
  if (
    typeof t.id !== "string" ||
    typeof t.event_id !== "string" ||
    typeof t.registration_id !== "string" ||
    typeof t.ticket_code !== "string" ||
    typeof t.verification_token !== "string"
  ) {
    return null;
  }
  return row as TicketBase;
}

export async function checkInTicket(
  input: CheckInTicketInput
): Promise<CheckInTicketResult> {
  const verified = verifyTicketToken(input.token.trim());

  if (!verified.ok) {
    const result: CheckInTicketResult["result"] =
      verified.error === "signature_failed" ? "signature_failed" : "invalid";
    return {
      ok: false,
      result,
      message:
        verified.error === "signature_failed"
          ? "Ticket signature could not be verified."
          : "Invalid ticket token.",
    };
  }

  const { payload } = verified;

  if (!input.eventId || payload.eventId !== input.eventId) {
    return {
      ok: false,
      result: "wrong_event",
      message: "This ticket is not valid for this event.",
    };
  }

  const supabase = createSupabaseAdminClient();

  const { data: ticketRow, error: loadErr } = await supabase
    .from("event_tickets")
    .select(
      `
      id,
      event_id,
      registration_id,
      registration_kind,
      ticket_code,
      verification_token,
      status,
      version,
      issued_at,
      emailed_at,
      checked_in_at,
      checked_in_by,
      invalidated_at,
      cancelled_at,
      created_by,
      notes,
      created_at
    `
    )
    .eq("id", payload.ticketId)
    .maybeSingle();

  if (loadErr || !ticketRow) {
    return {
      ok: false,
      result: "invalid",
      message: "Ticket not found.",
    };
  }

  const ticket = asTicket(ticketRow);
  if (!ticket) {
    return { ok: false, result: "invalid", message: "Ticket not found." };
  }

  if (ticket.event_id !== input.eventId) {
    return {
      ok: false,
      result: "wrong_event",
      message: "This ticket is not valid for this event.",
      ticket,
    };
  }

  if (ticket.status === "cancelled" || ticket.status === "invalidated") {
    return {
      ok: false,
      result: "cancelled",
      message: "This ticket has been cancelled or invalidated.",
      ticket,
    };
  }

  if (ticket.checked_in_at) {
    return {
      ok: false,
      result: "already_used",
      message: "This ticket has already been checked in.",
      ticket,
    };
  }

  if (typeof ticket.version === "number" && ticket.version !== payload.version) {
    return {
      ok: false,
      result: "invalid",
      message: "Ticket version mismatch. Ask the attendee to refresh their ticket.",
      ticket,
    };
  }

  const now = new Date().toISOString();

  const { data: updated, error: updErr } = await supabase
    .from("event_tickets")
    .update({
      checked_in_at: now,
      checked_in_by: input.scannedBy ?? null,
    })
    .eq("id", ticket.id)
    .is("checked_in_at", null)
    .select(
      `
      id,
      event_id,
      registration_id,
      registration_kind,
      ticket_code,
      verification_token,
      status,
      version,
      issued_at,
      emailed_at,
      checked_in_at,
      checked_in_by,
      invalidated_at,
      cancelled_at,
      created_by,
      notes,
      created_at
    `
    )
    .maybeSingle();

  if (updErr || !updated) {
    const { data: again } = await supabase
      .from("event_tickets")
      .select("checked_in_at")
      .eq("id", ticket.id)
      .maybeSingle();

    if (again && (again as { checked_in_at?: string | null }).checked_in_at) {
      return {
        ok: false,
        result: "already_used",
        message: "This ticket has already been checked in.",
        ticket,
      };
    }

    return {
      ok: false,
      result: "invalid",
      message: updErr?.message || "Unable to complete check-in.",
      ticket,
    };
  }

  try {
    await supabase.from("ticket_scans").insert({
      ticket_id: ticket.id,
      event_id: ticket.event_id,
      scanned_by: input.scannedBy ?? null,
      scan_result: "valid",
      source: input.source ?? "scanner",
      payload: { token_version: payload.version },
      device: input.device ?? null,
      ip: input.ip ?? null,
      user_agent: input.userAgent ?? null,
    });
  } catch (scanErr) {
    console.error("[checkInTicket] ticket_scans insert failed:", scanErr);
  }

  const finalTicket = asTicket(updated) ?? ticket;

  const { data: ev } = await supabase
    .from("events")
    .select("id, title, slug")
    .eq("id", ticket.event_id)
    .maybeSingle();

  return {
    ok: true,
    result: "valid",
    message: "Check-in successful.",
    ticket: finalTicket,
    event: ev
      ? {
          id: String((ev as { id: string }).id),
          title: (ev as { title?: string | null }).title ?? null,
          slug: (ev as { slug?: string | null }).slug ?? null,
        }
      : null,
    registration: null as RegistrationSnapshot | null,
  };
}
