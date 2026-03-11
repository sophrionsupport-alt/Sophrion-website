// src/lib/tickets/sendTicketEmail.ts

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getRegistrationSnapshot } from "@/lib/tickets/getRegistrationSnapshot";
import { sendMail } from "@/lib/email/sendMail";
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

function formatDateTime(value?: string | null) {
  if (!value) return "To be announced";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "To be announced";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

function esc(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function sendTicketEmail(input: SendTicketEmailInput) {
  const supabase = createSupabaseAdminClient();

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

  const snapshot = await getRegistrationSnapshot({
    registrationId: ticketRow.registration_id,
    registrationKind: ticketRow.registration_kind,
  });

  if (!snapshot) {
    throw new Error("Registration snapshot not found for ticket email.");
  }

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

  const backupEmail = process.env.TICKET_BACKUP_EMAIL?.trim();
  if (!backupEmail) {
    throw new Error("Missing TICKET_BACKUP_EMAIL");
  }

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

  const eventTitle = eventRow.title || "Sophrion Event";
  const locationLine = [eventRow.venue, eventRow.city, eventRow.state]
    .filter(Boolean)
    .join(", ");

  const memberListHtml =
    snapshot.registrationKind === "team"
      ? `
        <div style="margin-top:16px;">
          <div style="font-size:14px;font-weight:700;margin-bottom:8px;">Team Members</div>
          <ul style="padding-left:18px;margin:0;">
            ${snapshot.team.members
              .map((member) => {
                const leaderTag = member.is_leader ? " (Leader)" : "";
                const roleTag = member.role ? ` — ${esc(member.role)}` : "";
                return `<li style="margin-bottom:6px;">${esc(
                  member.member_name
                )}${leaderTag}${roleTag}</li>`;
              })
              .join("")}
          </ul>
        </div>
      `
      : "";

  const summaryLabel =
    snapshot.registrationKind === "team" ? "Team" : "Attendee";
  const summaryValue =
    snapshot.registrationKind === "team"
      ? snapshot.team.team_name
      : snapshot.registration.full_name;

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;background:#0b1020;color:#e5eefc;padding:24px;">
      <div style="max-width:680px;margin:0 auto;background:#121a2f;border:1px solid #24314f;border-radius:16px;overflow:hidden;">
        <div style="padding:24px 24px 8px 24px;background:linear-gradient(135deg,#6d28d9,#06b6d4);">
          <div style="font-size:12px;letter-spacing:1px;text-transform:uppercase;opacity:0.95;">Sophrion Ticket</div>
          <h1 style="margin:8px 0 0 0;font-size:26px;line-height:1.2;">${esc(
            eventTitle
          )}</h1>
        </div>

        <div style="padding:24px;">
          <p style="margin:0 0 16px 0;">Hello ${esc(recipientName)},</p>
          <p style="margin:0 0 16px 0;">
            Your registration has been approved. Your event ticket is now active.
          </p>

          <div style="background:#0f172a;border:1px solid #22314f;border-radius:12px;padding:16px;margin:16px 0;">
            <div style="font-size:13px;color:#9fb2d4;margin-bottom:6px;">${summaryLabel}</div>
            <div style="font-size:18px;font-weight:700;margin-bottom:14px;">${esc(
              summaryValue
            )}</div>

            <div style="font-size:13px;color:#9fb2d4;margin-bottom:6px;">Ticket Code</div>
            <div style="font-size:20px;font-weight:700;letter-spacing:1px;">${esc(
              ticketRow.ticket_code
            )}</div>
          </div>

          <div style="margin:18px 0;">
            <a
              href="${ticketUrl}"
              style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#06b6d4);color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:700;"
            >
              View Ticket
            </a>
          </div>

          <div style="margin-top:20px;">
            <div style="font-size:14px;font-weight:700;margin-bottom:8px;">Event Details</div>
            <div style="font-size:14px;line-height:1.7;">
              <div><strong>Date & Time:</strong> ${esc(
                formatDateTime(eventRow.start_at)
              )}</div>
              <div><strong>Reporting Time:</strong> ${esc(
                formatDateTime(eventRow.reporting_time)
              )}</div>
              <div><strong>Mode:</strong> ${esc(
                eventRow.mode || "To be announced"
              )}</div>
              <div><strong>Location:</strong> ${esc(
                locationLine || "To be announced"
              )}</div>
            </div>
          </div>

          ${memberListHtml}

          <div style="margin-top:24px;font-size:13px;color:#9fb2d4;line-height:1.7;">
            Please carry this ticket page at the venue. The QR on the ticket page will be scanned at entry.
          </div>
        </div>
      </div>
    </div>
  `;

  const textLines = [
    `Hello ${recipientName},`,
    ``,
    `Your registration for ${eventTitle} has been approved.`,
    `Your ticket is now active.`,
    ``,
    `Ticket Code: ${ticketRow.ticket_code}`,
    `View Ticket: ${ticketUrl}`,
    ``,
    `Date & Time: ${formatDateTime(eventRow.start_at)}`,
    `Reporting Time: ${formatDateTime(eventRow.reporting_time)}`,
    `Mode: ${eventRow.mode || "To be announced"}`,
    `Location: ${locationLine || "To be announced"}`,
    ``,
    `Please present the ticket page QR at entry.`,
    ``,
    `- Sophrion`,
  ];

  await sendMail({
    to: [
      {
        address: recipientEmail,
        name: recipientName,
      },
    ],
    subject: `${eventTitle} — Your Sophrion Ticket`,
    html,
    text: textLines.join("\n"),
    clientReference: `ticket:${ticketRow.id}:primary`,
  });

  const backupHtml = `
    <div style="font-family:Arial,Helvetica,sans-serif;padding:20px;">
      <h2>Backup Ticket Copy</h2>
      <p>This is a backup copy of the ticket email sent from Sophrion.</p>
      <ul>
        <li><strong>Event:</strong> ${esc(eventTitle)}</li>
        <li><strong>Recipient:</strong> ${esc(recipientName)} (${esc(
          recipientEmail
        )})</li>
        <li><strong>Registration Kind:</strong> ${esc(
          ticketRow.registration_kind
        )}</li>
        <li><strong>Ticket Code:</strong> ${esc(ticketRow.ticket_code)}</li>
        <li><strong>Ticket URL:</strong> <a href="${ticketUrl}">${ticketUrl}</a></li>
      </ul>
    </div>
  `;

  const backupText = [
    `Backup Ticket Copy`,
    ``,
    `Event: ${eventTitle}`,
    `Recipient: ${recipientName} (${recipientEmail})`,
    `Registration Kind: ${ticketRow.registration_kind}`,
    `Ticket Code: ${ticketRow.ticket_code}`,
    `Ticket URL: ${ticketUrl}`,
  ].join("\n");

  await sendMail({
    to: [
      {
        address: backupEmail,
        name: "Sophrion Admin",
      },
    ],
    subject: `[Backup] ${eventTitle} — Ticket ${ticketRow.ticket_code}`,
    html: backupHtml,
    text: backupText,
    clientReference: `ticket:${ticketRow.id}:backup`,
  });

  const emailedAt = new Date().toISOString();

  await supabase
    .from("event_tickets")
    .update({
      emailed_at: emailedAt,
      updated_at: emailedAt,
    })
    .eq("id", ticketRow.id);

  await supabase.from("ticket_audit_logs").insert({
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

  return {
    ok: true as const,
    ticketId: ticketRow.id,
    ticketCode: ticketRow.ticket_code,
    primaryRecipient: recipientEmail,
    backupRecipient: backupEmail,
    emailedAt,
  };
}