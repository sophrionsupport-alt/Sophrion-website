import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getRegistrationSnapshot } from "@/lib/tickets/getRegistrationSnapshot";
import { sendEmail } from "@/lib/email/send";
import {
  attendeeTicketEmail,
  ticketBackupEmail,
} from "@/lib/email/templates";
import type { TicketRegistrationKind } from "@/lib/tickets/types";

type SendTicketEmailInput = {
  ticketId: string;
  actorId?: string | null;
  source?: string | null;
};

type TicketRow = {
  id: string;
  event_id: string;
  registration_id: string;
  registration_kind: TicketRegistrationKind;
  ticket_code: string;
  emailed_at: string | null;
};

type EventRow = {
  id: string;
  title: string | null;
  venue: string | null;
  city: string | null;
  state: string | null;
  start_at: string | null;
  end_at: string | null;
  reporting_time: string | null;
  mode: string | null;
};

function getBaseUrl() {
  return (
    process.env.TICKET_PUBLIC_BASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    "https://sophrion.in"
  ).replace(/\/+$/, "");
}

export async function sendTicketEmail(input: SendTicketEmailInput) {
  const supabase = createSupabaseAdminClient();

  /* ----------------------------------------------------- */
  /* LOAD TICKET                                           */
  /* ----------------------------------------------------- */

  const { data: ticket, error: ticketError } = await supabase
    .from("event_tickets")
    .select(
      `
      id,
      event_id,
      registration_id,
      registration_kind,
      ticket_code,
      emailed_at
      `
    )
    .eq("id", input.ticketId)
    .single();

  if (ticketError || !ticket) {
    throw new Error("Ticket not found for email send.");
  }

  const ticketRow = ticket as TicketRow;

  /* ----------------------------------------------------- */
  /* DUPLICATE PROTECTION                                  */
  /* ----------------------------------------------------- */

  if (ticketRow.emailed_at) {
    console.log(
      "[TicketEmail] already emailed, skipping:",
      ticketRow.ticket_code
    );

    return {
      ok: true,
      skipped: true,
      reason: "already emailed",
    };
  }

  /* ----------------------------------------------------- */
  /* LOAD REGISTRATION SNAPSHOT                            */
  /* ----------------------------------------------------- */

  const snapshot = await getRegistrationSnapshot({
    registrationId: ticketRow.registration_id,
    registrationKind: ticketRow.registration_kind,
  });

  if (!snapshot) {
    throw new Error("Registration snapshot not found for ticket email.");
  }

  /* ----------------------------------------------------- */
  /* LOAD EVENT                                            */
  /* ----------------------------------------------------- */

  const { data: event, error: eventError } = await supabase
    .from("events")
    .select(
      `
      id,
      title,
      venue,
      city,
      state,
      start_at,
      end_at,
      reporting_time,
      mode
      `
    )
    .eq("id", ticketRow.event_id)
    .single();

  if (eventError || !event) {
    throw new Error("Event not found for ticket email.");
  }

  const eventRow = event as EventRow;

  const ticketUrl = `${getBaseUrl()}/ticket/${encodeURIComponent(
    ticketRow.ticket_code
  )}`;

  /* ----------------------------------------------------- */
  /* DETERMINE RECIPIENT                                   */
  /* ----------------------------------------------------- */

  let recipientName = "";
  let recipientEmail = "";

  if (snapshot.registrationKind === "individual") {
    recipientName = snapshot.registration.full_name;
    recipientEmail = snapshot.registration.email;
  } else {
    recipientName = snapshot.team.leader_name || snapshot.team.team_name;
    recipientEmail = snapshot.team.leader_email || "";
  }

  if (!recipientEmail) {
    throw new Error("Primary ticket recipient email is missing.");
  }

  const backupEmail = process.env.TICKET_BACKUP_EMAIL?.trim();
  if (!backupEmail) {
    throw new Error("Missing TICKET_BACKUP_EMAIL");
  }

  /* ----------------------------------------------------- */
  /* BUILD TEMPLATE DATA                                   */
  /* ----------------------------------------------------- */

  const registrationForTemplate =
    snapshot.registrationKind === "individual"
      ? {
          kind: "individual" as const,
          full_name: snapshot.registration.full_name,
          email: snapshot.registration.email,
          phone: snapshot.registration.phone,
          college: snapshot.registration.college,
          year: snapshot.registration.year,
          roll_number: snapshot.registration.roll_number,
        }
      : {
          kind: "team" as const,
          team_name: snapshot.team.team_name,
          leader_name: snapshot.team.leader_name || snapshot.team.team_name,
          leader_email: snapshot.team.leader_email || "",
          leader_phone: snapshot.team.leader_phone,
          college: snapshot.team.college,
          members: snapshot.team.members.map((member) => ({
            member_name: member.member_name,
            role: member.role,
            is_leader: Boolean(member.is_leader),
          })),
        };

  /* ----------------------------------------------------- */
  /* BUILD EMAIL                                           */
  /* ----------------------------------------------------- */

  const attendeeMail = attendeeTicketEmail({
    event: {
      title: eventRow.title,
      venue: eventRow.venue,
      city: eventRow.city,
      state: eventRow.state,
      start_at: eventRow.start_at,
      end_at: eventRow.end_at,
      reporting_time: eventRow.reporting_time,
      mode: eventRow.mode,
    },
    registration: registrationForTemplate,
    ticketCode: ticketRow.ticket_code,
    ticketUrl,
  });

  console.log("[TicketEmail] primary:", recipientEmail);
  console.log("[TicketEmail] backup:", backupEmail);

  /* ----------------------------------------------------- */
  /* SEND PRIMARY EMAIL                                    */
  /* ----------------------------------------------------- */

  try {
    await sendEmail({
      to: recipientEmail,
      subject: attendeeMail.subject,
      html: attendeeMail.html,
      text: attendeeMail.text,
    });
  } catch (err) {
    console.error("[TicketEmail] primary email failed:", err);
    throw err;
  }

  /* ----------------------------------------------------- */
  /* SEND BACKUP EMAIL (NON BLOCKING)                      */
  /* ----------------------------------------------------- */

  const backupMail = ticketBackupEmail({
    eventTitle: eventRow.title || "Sophrion Event",
    ticketCode: ticketRow.ticket_code,
    ticketUrl,
    recipientName,
    recipientEmail,
    registrationKind: ticketRow.registration_kind,
  });

  try {
    await sendEmail({
      to: backupEmail,
      subject: backupMail.subject,
      html: backupMail.html,
      text: backupMail.text,
    });
  } catch (err) {
    console.error("[TicketEmail] backup email failed:", err);
  }

  /* ----------------------------------------------------- */
  /* UPDATE emailed_at                                     */
  /* ----------------------------------------------------- */

  const emailedAt = new Date().toISOString();

  const { error: updateError } = await supabase
    .from("event_tickets")
    .update({
      emailed_at: emailedAt,
      updated_at: emailedAt,
    })
    .eq("id", ticketRow.id);

  if (updateError) {
    console.error("Failed to update emailed_at:", updateError);
  }

  /* ----------------------------------------------------- */
  /* WRITE AUDIT LOG                                       */
  /* ----------------------------------------------------- */

  const { error: auditError } = await supabase
    .from("ticket_audit_logs")
    .insert({
      ticket_id: ticketRow.id,
      registration_id: ticketRow.registration_id,
      event_id: ticketRow.event_id,
      actor_id: input.actorId ?? null,
      action: "emailed",
      meta: {
        source: input.source ?? "system",
        primary_recipient: recipientEmail,
        backup_recipient: backupEmail,
        emailed_at: emailedAt,
      },
      created_at: emailedAt,
    });

  if (auditError) {
    console.error("Ticket email audit log failed:", auditError);
  }

  return {
    ok: true,
    ticketId: ticketRow.id,
    ticketCode: ticketRow.ticket_code,
    primaryRecipient: recipientEmail,
    backupRecipient: backupEmail,
    emailedAt,
  };
}