import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { verifyTicketToken } from "./verifyToken";
import { getRegistrationSnapshot } from "./getRegistrationSnapshot";

type ScanResult =
  | "valid"
  | "already_used"
  | "cancelled"
  | "invalid"
  | "signature_failed"
  | "wrong_event";

type CheckInInput = {
  token: string;
  eventId?: string | null;
  scannedBy?: string | null;
  source?: string | null;
  device?: string | null;
  ip?: string | null;
  userAgent?: string | null;
};

function nowIso() {
  return new Date().toISOString();
}

async function getScannerAccessMeta(accessId?: string | null) {
  if (!accessId) return null;

  const supabase = createSupabaseAdminClient();

  const { data } = await supabase
    .from("volunteer_scanner_access")
    .select("id, full_name, email")
    .eq("id", accessId)
    .maybeSingle();

  return data ?? null;
}

async function insertScanLog(input: {
  ticketId?: string | null;
  eventId?: string | null;
  scannedBy?: string | null;
  scanResult: ScanResult;
  source?: string | null;
  payload?: unknown;
  device?: string | null;
  ip?: string | null;
  userAgent?: string | null;
}) {
  const supabase = createSupabaseAdminClient();

  const { error } = await supabase.from("ticket_scans").insert({
    ticket_id: input.ticketId ?? null,
    event_id: input.eventId ?? null,
    scanned_by: input.scannedBy ?? null,
    scan_result: input.scanResult,
    source: input.source ?? "scanner",
    payload:
      input.payload && typeof input.payload === "object"
        ? (input.payload as Record<string, unknown>)
        : input.payload ?? null,
    device: input.device ?? null,
    ip: input.ip ?? null,
    user_agent: input.userAgent ?? null,
    created_at: nowIso(),
  });

  if (error) {
    console.error("ticket_scans insert failed:", error.message);
  }
}

async function insertAuditLog(input: {
  ticketId?: string | null;
  registrationId?: string | null;
  eventId?: string | null;
  actorId?: string | null;
  action:
    | "issued"
    | "regenerated"
    | "emailed"
    | "resend_requested"
    | "invalidated"
    | "cancelled"
    | "checked_in"
    | "verification_failed"
    | "scan_attempt";
  meta?: unknown;
}) {
  const supabase = createSupabaseAdminClient();

  const { error } = await supabase.from("ticket_audit_logs").insert({
    ticket_id: input.ticketId ?? null,
    registration_id: input.registrationId ?? null,
    event_id: input.eventId ?? null,
    actor_id: input.actorId ?? null,
    action: input.action,
    meta:
      input.meta && typeof input.meta === "object"
        ? (input.meta as Record<string, unknown>)
        : input.meta ?? null,
    created_at: nowIso(),
  });

  if (error) {
    console.error("ticket_audit_logs insert failed:", error.message);
  }
}

export async function checkInTicket(input: CheckInInput) {
  const supabase = createSupabaseAdminClient();

  const verified = verifyTicketToken(input.token);

  if (!verified.ok) {
    await insertScanLog({
      ticketId: null,
      eventId: input.eventId ?? null,
      scannedBy: input.scannedBy ?? null,
      scanResult: "signature_failed",
      source: input.source,
      payload: { reason: verified.error },
      device: input.device,
      ip: input.ip,
      userAgent: input.userAgent,
    });

    await insertAuditLog({
      ticketId: null,
      registrationId: null,
      eventId: input.eventId ?? null,
      actorId: input.scannedBy ?? null,
      action: "verification_failed",
      meta: { reason: verified.error },
    });

    return {
      ok: false as const,
      result: "signature_failed" as const,
      message: "Invalid or tampered ticket.",
    };
  }

  const payload = verified.payload;

  const { data: ticket, error } = await supabase
    .from("event_tickets")
    .select("*")
    .eq("id", payload.ticketId)
    .single();

  if (error || !ticket) {
    await insertScanLog({
      ticketId: payload.ticketId,
      eventId: input.eventId ?? payload.eventId,
      scannedBy: input.scannedBy ?? null,
      scanResult: "invalid",
      source: input.source,
      payload: { reason: "ticket_not_found" },
      device: input.device,
      ip: input.ip,
      userAgent: input.userAgent,
    });

    await insertAuditLog({
      ticketId: payload.ticketId,
      registrationId: payload.registrationId,
      eventId: input.eventId ?? payload.eventId,
      actorId: input.scannedBy ?? null,
      action: "verification_failed",
      meta: { reason: "ticket_not_found" },
    });

    return {
      ok: false as const,
      result: "invalid" as const,
      message: "Ticket not found.",
    };
  }

  if (ticket.version !== payload.version) {
    await insertScanLog({
      ticketId: ticket.id,
      eventId: input.eventId ?? ticket.event_id,
      scannedBy: input.scannedBy ?? null,
      scanResult: "invalid",
      source: input.source,
      payload: { reason: "version_mismatch" },
      device: input.device,
      ip: input.ip,
      userAgent: input.userAgent,
    });

    await insertAuditLog({
      ticketId: ticket.id,
      registrationId: ticket.registration_id,
      eventId: input.eventId ?? ticket.event_id,
      actorId: input.scannedBy ?? null,
      action: "verification_failed",
      meta: { reason: "version_mismatch" },
    });

    return {
      ok: false as const,
      result: "invalid" as const,
      message: "Ticket is no longer valid.",
    };
  }

  if (ticket.verification_token !== input.token) {
    await insertScanLog({
      ticketId: ticket.id,
      eventId: input.eventId ?? ticket.event_id,
      scannedBy: input.scannedBy ?? null,
      scanResult: "invalid",
      source: input.source,
      payload: { reason: "token_mismatch" },
      device: input.device,
      ip: input.ip,
      userAgent: input.userAgent,
    });

    await insertAuditLog({
      ticketId: ticket.id,
      registrationId: ticket.registration_id,
      eventId: input.eventId ?? ticket.event_id,
      actorId: input.scannedBy ?? null,
      action: "verification_failed",
      meta: { reason: "token_mismatch" },
    });

    return {
      ok: false as const,
      result: "invalid" as const,
      message: "Ticket token mismatch.",
    };
  }

  if (input.eventId && ticket.event_id !== input.eventId) {
    await insertScanLog({
      ticketId: ticket.id,
      eventId: input.eventId,
      scannedBy: input.scannedBy ?? null,
      scanResult: "wrong_event",
      source: input.source,
      payload: {
        expected_event_id: input.eventId,
        actual_event_id: ticket.event_id,
      },
      device: input.device,
      ip: input.ip,
      userAgent: input.userAgent,
    });

    await insertAuditLog({
      ticketId: ticket.id,
      registrationId: ticket.registration_id,
      eventId: input.eventId,
      actorId: input.scannedBy ?? null,
      action: "scan_attempt",
      meta: {
        result: "wrong_event",
        expected_event_id: input.eventId,
        actual_event_id: ticket.event_id,
      },
    });

    return {
      ok: false as const,
      result: "wrong_event" as const,
      message: "This ticket belongs to a different event.",
    };
  }

  if (ticket.status === "checked_in") {
    const checkedInByMeta = await getScannerAccessMeta(ticket.checked_in_by);

    await insertScanLog({
      ticketId: ticket.id,
      eventId: ticket.event_id,
      scannedBy: input.scannedBy ?? null,
      scanResult: "already_used",
      source: input.source,
      payload: {
        checked_in_at: ticket.checked_in_at,
        checked_in_by: ticket.checked_in_by,
        checked_in_by_name: checkedInByMeta?.full_name ?? null,
        checked_in_by_email: checkedInByMeta?.email ?? null,
      },
      device: input.device,
      ip: input.ip,
      userAgent: input.userAgent,
    });

    await insertAuditLog({
      ticketId: ticket.id,
      registrationId: ticket.registration_id,
      eventId: ticket.event_id,
      actorId: input.scannedBy ?? null,
      action: "scan_attempt",
      meta: {
        result: "already_used",
        checked_in_at: ticket.checked_in_at,
        checked_in_by: ticket.checked_in_by,
        checked_in_by_name: checkedInByMeta?.full_name ?? null,
        checked_in_by_email: checkedInByMeta?.email ?? null,
      },
    });

    const { data: event } = await supabase
      .from("events")
      .select("id, title, slug")
      .eq("id", ticket.event_id)
      .single();

    const registration = await getRegistrationSnapshot({
      registrationId: ticket.registration_id,
      registrationKind: ticket.registration_kind,
    });

    return {
      ok: false as const,
      result: "already_used" as const,
      message: "Ticket already checked in.",
      ticket,
      event: event ?? null,
      registration,
      checkedInMeta: {
        checked_in_at: ticket.checked_in_at ?? null,
        checked_in_by: ticket.checked_in_by ?? null,
        checked_in_by_name: checkedInByMeta?.full_name ?? null,
        checked_in_by_email: checkedInByMeta?.email ?? null,
      },
    };
  }

  if (ticket.status === "cancelled") {
    await insertScanLog({
      ticketId: ticket.id,
      eventId: ticket.event_id,
      scannedBy: input.scannedBy ?? null,
      scanResult: "cancelled",
      source: input.source,
      payload: { cancelled_at: ticket.cancelled_at },
      device: input.device,
      ip: input.ip,
      userAgent: input.userAgent,
    });

    await insertAuditLog({
      ticketId: ticket.id,
      registrationId: ticket.registration_id,
      eventId: ticket.event_id,
      actorId: input.scannedBy ?? null,
      action: "scan_attempt",
      meta: { result: "cancelled", cancelled_at: ticket.cancelled_at },
    });

    return {
      ok: false as const,
      result: "cancelled" as const,
      message: "Ticket has been cancelled.",
    };
  }

  if (ticket.status === "invalidated") {
    await insertScanLog({
      ticketId: ticket.id,
      eventId: ticket.event_id,
      scannedBy: input.scannedBy ?? null,
      scanResult: "invalid",
      source: input.source,
      payload: { invalidated_at: ticket.invalidated_at, status: ticket.status },
      device: input.device,
      ip: input.ip,
      userAgent: input.userAgent,
    });

    await insertAuditLog({
      ticketId: ticket.id,
      registrationId: ticket.registration_id,
      eventId: ticket.event_id,
      actorId: input.scannedBy ?? null,
      action: "scan_attempt",
      meta: {
        result: "invalid",
        status: ticket.status,
        invalidated_at: ticket.invalidated_at,
      },
    });

    return {
      ok: false as const,
      result: "invalid" as const,
      message: "Ticket has been invalidated.",
    };
  }

  if (ticket.status !== "active") {
    await insertScanLog({
      ticketId: ticket.id,
      eventId: ticket.event_id,
      scannedBy: input.scannedBy ?? null,
      scanResult: "invalid",
      source: input.source,
      payload: { status: ticket.status },
      device: input.device,
      ip: input.ip,
      userAgent: input.userAgent,
    });

    await insertAuditLog({
      ticketId: ticket.id,
      registrationId: ticket.registration_id,
      eventId: ticket.event_id,
      actorId: input.scannedBy ?? null,
      action: "scan_attempt",
      meta: { result: "invalid", status: ticket.status },
    });

    return {
      ok: false as const,
      result: "invalid" as const,
      message: "Ticket is not valid for entry.",
    };
  }

  const registration = await getRegistrationSnapshot({
    registrationId: ticket.registration_id,
    registrationKind: ticket.registration_kind,
  });

  if (!registration) {
    await insertScanLog({
      ticketId: ticket.id,
      eventId: ticket.event_id,
      scannedBy: input.scannedBy ?? null,
      scanResult: "invalid",
      source: input.source,
      payload: { reason: "registration_missing" },
      device: input.device,
      ip: input.ip,
      userAgent: input.userAgent,
    });

    await insertAuditLog({
      ticketId: ticket.id,
      registrationId: ticket.registration_id,
      eventId: ticket.event_id,
      actorId: input.scannedBy ?? null,
      action: "verification_failed",
      meta: { reason: "registration_missing" },
    });

    return {
      ok: false as const,
      result: "invalid" as const,
      message: "Registration details not found.",
    };
  }

  const checkedInAt = nowIso();

  const { data: updatedTicket, error: updateError } = await supabase
    .from("event_tickets")
    .update({
      status: "checked_in",
      checked_in_at: checkedInAt,
      checked_in_by: input.scannedBy ?? null,
      updated_at: checkedInAt,
    })
    .eq("id", ticket.id)
    .eq("status", "active")
    .select("*")
    .single();

  if (updateError || !updatedTicket) {
    const { data: latestTicket } = await supabase
      .from("event_tickets")
      .select("*")
      .eq("id", ticket.id)
      .single();

    const checkedInByMeta = await getScannerAccessMeta(
      latestTicket?.checked_in_by ?? null
    );

    await insertScanLog({
      ticketId: ticket.id,
      eventId: ticket.event_id,
      scannedBy: input.scannedBy ?? null,
      scanResult: "already_used",
      source: input.source,
      payload: {
        reason: "concurrent_check_in",
        checked_in_at: latestTicket?.checked_in_at ?? null,
        checked_in_by: latestTicket?.checked_in_by ?? null,
        checked_in_by_name: checkedInByMeta?.full_name ?? null,
        checked_in_by_email: checkedInByMeta?.email ?? null,
      },
      device: input.device,
      ip: input.ip,
      userAgent: input.userAgent,
    });

    await insertAuditLog({
      ticketId: ticket.id,
      registrationId: ticket.registration_id,
      eventId: ticket.event_id,
      actorId: input.scannedBy ?? null,
      action: "scan_attempt",
      meta: {
        result: "already_used",
        reason: "concurrent_check_in",
        checked_in_at: latestTicket?.checked_in_at ?? null,
        checked_in_by: latestTicket?.checked_in_by ?? null,
        checked_in_by_name: checkedInByMeta?.full_name ?? null,
        checked_in_by_email: checkedInByMeta?.email ?? null,
      },
    });

    const { data: event } = await supabase
      .from("events")
      .select("id, title, slug")
      .eq("id", ticket.event_id)
      .single();

    return {
      ok: false as const,
      result: "already_used" as const,
      message: "Ticket was already checked in.",
      ticket: latestTicket ?? ticket,
      event: event ?? null,
      registration,
      checkedInMeta: {
        checked_in_at: latestTicket?.checked_in_at ?? null,
        checked_in_by: latestTicket?.checked_in_by ?? null,
        checked_in_by_name: checkedInByMeta?.full_name ?? null,
        checked_in_by_email: checkedInByMeta?.email ?? null,
      },
    };
  }

  const checkedInByMeta = await getScannerAccessMeta(
    updatedTicket.checked_in_by ?? null
  );

  await insertScanLog({
    ticketId: updatedTicket.id,
    eventId: updatedTicket.event_id,
    scannedBy: input.scannedBy ?? null,
    scanResult: "valid",
    source: input.source,
    payload: {
      checked_in_at: checkedInAt,
      checked_in_by: updatedTicket.checked_in_by ?? null,
      checked_in_by_name: checkedInByMeta?.full_name ?? null,
      checked_in_by_email: checkedInByMeta?.email ?? null,
    },
    device: input.device,
    ip: input.ip,
    userAgent: input.userAgent,
  });

  await insertAuditLog({
    ticketId: updatedTicket.id,
    registrationId: updatedTicket.registration_id,
    eventId: updatedTicket.event_id,
    actorId: input.scannedBy ?? null,
    action: "checked_in",
    meta: {
      checked_in_at: checkedInAt,
      checked_in_by: updatedTicket.checked_in_by ?? null,
      checked_in_by_name: checkedInByMeta?.full_name ?? null,
      checked_in_by_email: checkedInByMeta?.email ?? null,
    },
  });

  const { data: event } = await supabase
    .from("events")
    .select("id, title, slug")
    .eq("id", updatedTicket.event_id)
    .single();

  return {
    ok: true as const,
    result: "valid" as const,
    message: "Check-in successful.",
    ticket: updatedTicket,
    event: event ?? null,
    registration,
    checkedInMeta: {
      checked_in_at: checkedInAt,
      checked_in_by: updatedTicket.checked_in_by ?? null,
      checked_in_by_name: checkedInByMeta?.full_name ?? null,
      checked_in_by_email: checkedInByMeta?.email ?? null,
    },
  };
}