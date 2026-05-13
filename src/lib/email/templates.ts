// src/lib/email/templates.ts
import { getAppConfig, serverEnv } from "@/lib/env";
import type { ContactPayload } from "@/lib/validators/contact";
import type { NewsletterPayload } from "@/lib/validators/newsletter";
import type { RegistrationPayload } from "@/lib/validators/registration";

const appConfig = getAppConfig();
if (!serverEnv) {
  throw new Error("serverEnv is unavailable in email templates");
}
const env = serverEnv;

function wrapHtml(title: string, bodyHtml: string) {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f6f7fb;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;">
    <div style="max-width:640px;margin:0 auto;padding:24px;">
      <div style="background:#ffffff;border-radius:14px;padding:22px;box-shadow:0 6px 18px rgba(0,0,0,0.06);">
        <div style="font-size:14px;color:#111827;margin-bottom:10px;">
          <strong>${escapeHtml(appConfig.siteName)}</strong>
        </div>
        <h1 style="margin:0 0 12px 0;font-size:18px;line-height:1.35;color:#111827;">
          ${escapeHtml(title)}
        </h1>
        <div style="font-size:14px;line-height:1.6;color:#111827;">
          ${bodyHtml}
        </div>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:18px 0;" />
        <div style="font-size:12px;color:#6b7280;">
          Site:
          <a href="${appConfig.canonicalDomain}" style="color:#4f46e5;text-decoration:none;">
            ${appConfig.canonicalDomain}
          </a><br/>
          Inbox: ${escapeHtml(env.CONTACT_INBOX)}
        </div>
      </div>
    </div>
  </body>
</html>`;
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDateTime(value?: string | null) {
  if (!value) return "To be announced";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "To be announced";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

function getRegistrationEventName(payload: RegistrationPayload & {
  event_name?: string;
  event_title?: string;
}) {
  return payload.event_name || payload.event_title || payload.event_id || "Event";
}

export function contactInboxEmail(payload: ContactPayload) {
  const title = `New contact message: ${payload.subject}`;
  const html = wrapHtml(
    title,
    `<p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
     <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
     ${payload.phone ? `<p><strong>Phone:</strong> ${escapeHtml(payload.phone)}</p>` : ""}
     ${payload.source ? `<p><strong>Source:</strong> ${escapeHtml(payload.source)}</p>` : ""}
     <p><strong>Subject:</strong> ${escapeHtml(payload.subject)}</p>
     <p><strong>Message:</strong></p>
     <div style="white-space:pre-wrap;background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:12px;">${escapeHtml(
       payload.message
     )}</div>`
  );

  const text =
    `New contact message\n\n` +
    `Name: ${payload.name}\n` +
    `Email: ${payload.email}\n` +
    (payload.phone ? `Phone: ${payload.phone}\n` : "") +
    (payload.source ? `Source: ${payload.source}\n` : "") +
    `Subject: ${payload.subject}\n\n` +
    `${payload.message}\n`;

  return { subject: title, html, text };
}

export function contactAutoReplyEmail(payload: ContactPayload) {
  const title = `We received your message`;
  const html = wrapHtml(
    title,
    `<p>Hi ${escapeHtml(payload.name)},</p>
     <p>Thanks for reaching out to ${escapeHtml(appConfig.siteName)}. We’ve received your message and will get back to you soon.</p>
     <p style="margin-top:14px;"><strong>Your subject:</strong> ${escapeHtml(payload.subject)}</p>
     <p style="font-size:12px;color:#6b7280;margin-top:14px;">If you didn’t send this message, you can ignore this email.</p>`
  );

  const text =
    `Hi ${payload.name},\n\n` +
    `Thanks for reaching out to ${appConfig.siteName}. We received your message and will reply soon.\n\n` +
    `Your subject: ${payload.subject}\n`;

  return { subject: `${appConfig.siteName}: ${title}`, html, text };
}

export function newsletterWelcomeEmail(payload: NewsletterPayload) {
  const title = `You're subscribed`;
  const html = wrapHtml(
    title,
    `<p>Thanks${payload.name ? `, ${escapeHtml(payload.name)}` : ""}! You’re now subscribed to updates from ${escapeHtml(
      appConfig.siteName
    )}.</p>
     <p>We’ll send only useful updates: new events, readiness frameworks, and campus-industry insights.</p>`
  );

  const text =
    `Thanks${payload.name ? `, ${payload.name}` : ""}! You’re subscribed to ${appConfig.siteName} updates.\n`;

  return { subject: `${appConfig.siteName}: ${title}`, html, text };
}

export function registrationInboxEmail(
  payload: RegistrationPayload & { event_name?: string; event_title?: string }
) {
  const eventName = getRegistrationEventName(payload);
  const title = `New registration: ${payload.name} (${eventName})`;

  const html = wrapHtml(
    title,
    `<p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
     <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
     <p><strong>Phone:</strong> ${escapeHtml(payload.phone)}</p>
     <p><strong>College:</strong> ${escapeHtml(payload.college)}</p>
     <p><strong>Year:</strong> ${escapeHtml(payload.year)}</p>
     ${payload.roll_number ? `<p><strong>Roll No:</strong> ${escapeHtml(payload.roll_number)}</p>` : ""}
     <p><strong>Event:</strong> ${escapeHtml(eventName)}</p>
     <p style="color:#6b7280;font-size:12px;margin-top:12px;">
       ${payload.utm_source ? `utm_source=${escapeHtml(payload.utm_source)} ` : ""}
       ${payload.utm_medium ? `utm_medium=${escapeHtml(payload.utm_medium)} ` : ""}
       ${payload.utm_campaign ? `utm_campaign=${escapeHtml(payload.utm_campaign)} ` : ""}
     </p>`
  );

  const text =
    `New registration\n\n` +
    `Name: ${payload.name}\n` +
    `Email: ${payload.email}\n` +
    `Phone: ${payload.phone}\n` +
    `College: ${payload.college}\n` +
    `Year: ${payload.year}\n` +
    (payload.roll_number ? `Roll No: ${payload.roll_number}\n` : "") +
    `Event: ${eventName}\n`;

  return { subject: title, html, text };
}

export function registrationAutoReplyEmail(
  payload: RegistrationPayload & { event_name?: string; event_title?: string }
) {
  const eventName = getRegistrationEventName(payload);
  const title = `Registration received`;

  const html = wrapHtml(
    title,
    `<p>Hi ${escapeHtml(payload.name)},</p>
     <p>We received your registration for <strong>${escapeHtml(eventName)}</strong>.</p>
     <p>Your registration will be reviewed and confirmed. If approved, you’ll receive an update with next steps.</p>`
  );

  const text =
    `Hi ${payload.name},\n\n` +
    `We received your registration for ${eventName}.\n` +
    `We will review and confirm it.\n`;

  return { subject: `${appConfig.siteName}: ${title}`, html, text };
}

type TicketEmailEvent = {
  title: string | null;
  venue: string | null;
  city: string | null;
  state: string | null;
  start_at: string | null;
  end_at: string | null;
  reporting_time: string | null;
  mode: string | null;
};

type TicketEmailIndividual = {
  kind: "individual";
  full_name: string;
  email: string;
  phone: string | null;
  college: string | null;
  year: string | null;
  roll_number: string | null;
};

type TicketEmailTeamMember = {
  member_name: string;
  role: string | null;
  is_leader: boolean;
};

type TicketEmailTeam = {
  kind: "team";
  team_name: string;
  leader_name: string;
  leader_email: string;
  leader_phone: string | null;
  college: string | null;
  members: TicketEmailTeamMember[];
};

type TicketEmailRegistration = TicketEmailIndividual | TicketEmailTeam;

type TicketEmailInput = {
  event: TicketEmailEvent;
  registration: TicketEmailRegistration;
  ticketCode: string;
  ticketUrl: string;
};

export function attendeeTicketEmail(input: TicketEmailInput) {
  const eventTitle = input.event.title || "Sophrion Event";
  const title = `${eventTitle} — Your Ticket`;

  const location = [input.event.venue, input.event.city, input.event.state]
    .filter(Boolean)
    .join(", ");

  const recipientName =
    input.registration.kind === "individual"
      ? input.registration.full_name
      : input.registration.leader_name || input.registration.team_name;

  const identityBlock =
    input.registration.kind === "individual"
      ? `
        <p><strong>Attendee:</strong> ${escapeHtml(input.registration.full_name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(input.registration.email)}</p>
        ${input.registration.phone ? `<p><strong>Phone:</strong> ${escapeHtml(input.registration.phone)}</p>` : ""}
        ${input.registration.college ? `<p><strong>College:</strong> ${escapeHtml(input.registration.college)}</p>` : ""}
        ${input.registration.year ? `<p><strong>Year:</strong> ${escapeHtml(input.registration.year)}</p>` : ""}
        ${input.registration.roll_number ? `<p><strong>Roll No:</strong> ${escapeHtml(input.registration.roll_number)}</p>` : ""}
      `
      : `
        <p><strong>Team:</strong> ${escapeHtml(input.registration.team_name)}</p>
        <p><strong>Leader:</strong> ${escapeHtml(input.registration.leader_name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(input.registration.leader_email)}</p>
        ${input.registration.leader_phone ? `<p><strong>Phone:</strong> ${escapeHtml(input.registration.leader_phone)}</p>` : ""}
        ${input.registration.college ? `<p><strong>College:</strong> ${escapeHtml(input.registration.college)}</p>` : ""}
        ${
          input.registration.members.length
            ? `
              <p><strong>Team Members:</strong></p>
              <ul>
                ${input.registration.members
                  .map((member) => {
                    const leaderTag = member.is_leader ? " (Leader)" : "";
                    const roleTag = member.role ? ` — ${escapeHtml(member.role)}` : "";
                    return `<li>${escapeHtml(member.member_name)}${leaderTag}${roleTag}</li>`;
                  })
                  .join("")}
              </ul>
            `
            : ""
        }
      `;

  const html = wrapHtml(
    title,
    `<p>Hi ${escapeHtml(recipientName)},</p>
     <p>Your registration has been approved. Your ticket is now active.</p>
     <p><strong>Ticket Code:</strong> ${escapeHtml(input.ticketCode)}</p>
     <p><strong>Ticket Link:</strong>
       <a href="${input.ticketUrl}" style="color:#4f46e5;text-decoration:none;">
         View your ticket
       </a>
     </p>
     <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;" />
     <p><strong>Event:</strong> ${escapeHtml(eventTitle)}</p>
     <p><strong>Date & Time:</strong> ${escapeHtml(formatDateTime(input.event.start_at))}</p>
     <p><strong>Reporting Time:</strong> ${escapeHtml(formatDateTime(input.event.reporting_time))}</p>
     <p><strong>Mode:</strong> ${escapeHtml(input.event.mode || "To be announced")}</p>
     <p><strong>Location:</strong> ${escapeHtml(location || "To be announced")}</p>
     <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;" />
     ${identityBlock}
     <p style="margin-top:16px;">Please open the ticket page at the venue. The QR shown on the page will be scanned at entry.</p>`
  );

  const textLines = [
    `Hi ${recipientName},`,
    ``,
    `Your registration has been approved. Your ticket is now active.`,
    `Event: ${eventTitle}`,
    `Ticket Code: ${input.ticketCode}`,
    `Ticket Link: ${input.ticketUrl}`,
    `Date & Time: ${formatDateTime(input.event.start_at)}`,
    `Reporting Time: ${formatDateTime(input.event.reporting_time)}`,
    `Mode: ${input.event.mode || "To be announced"}`,
    `Location: ${location || "To be announced"}`,
    ``,
    input.registration.kind === "individual"
      ? `Attendee: ${input.registration.full_name}`
      : `Team: ${input.registration.team_name}`,
    ``,
    `Please open the ticket page at the venue. The QR shown on the page will be scanned at entry.`,
  ];

  return {
    subject: `${appConfig.siteName}: ${title}`,
    html,
    text: textLines.join("\n"),
  };
}

type TicketBackupEmailInput = {
  eventTitle: string;
  ticketCode: string;
  ticketUrl: string;
  recipientName: string;
  recipientEmail: string;
  registrationKind: "individual" | "team";
};

export function ticketBackupEmail(input: TicketBackupEmailInput) {
  const title = `Backup ticket copy`;

  const html = wrapHtml(
    title,
    `<p>This is a backup copy of a ticket email sent from ${escapeHtml(appConfig.siteName)}.</p>
     <p><strong>Event:</strong> ${escapeHtml(input.eventTitle)}</p>
     <p><strong>Recipient:</strong> ${escapeHtml(input.recipientName)} (${escapeHtml(input.recipientEmail)})</p>
     <p><strong>Registration Kind:</strong> ${escapeHtml(input.registrationKind)}</p>
     <p><strong>Ticket Code:</strong> ${escapeHtml(input.ticketCode)}</p>
     <p><strong>Ticket Link:</strong>
       <a href="${input.ticketUrl}" style="color:#4f46e5;text-decoration:none;">
         ${escapeHtml(input.ticketUrl)}
       </a>
     </p>`
  );

  const text =
    `Backup ticket copy\n\n` +
    `Event: ${input.eventTitle}\n` +
    `Recipient: ${input.recipientName} (${input.recipientEmail})\n` +
    `Registration Kind: ${input.registrationKind}\n` +
    `Ticket Code: ${input.ticketCode}\n` +
    `Ticket Link: ${input.ticketUrl}\n`;

  return {
    subject: `[Backup] ${input.eventTitle} — Ticket ${input.ticketCode}`,
    html,
    text,
  };
}

type CareerStatusEmailInput = {
  candidateName: string;
  roleTitle: string;
  status: string;
  companyName?: string;
};

export function careerApplicationStatusEmail(input: CareerStatusEmailInput) {
  const company = input.companyName || appConfig.siteName;
  const normalizedStatus = input.status.trim().toLowerCase();

  let headline = "Application status update";
  let body = "";
  let subject = `${company}: Application update for ${input.roleTitle}`;

  if (normalizedStatus === "reviewing" || normalizedStatus === "under_review") {
    headline = "Your application is under review";
    body = `
      <p>Hi ${escapeHtml(input.candidateName)},</p>
      <p>Thank you for applying to <strong>${escapeHtml(input.roleTitle)}</strong> at ${escapeHtml(company)}.</p>
      <p>Your application is currently under review. Our team is evaluating your profile and we will share the next update once the review is complete.</p>
      <p>We appreciate your interest in joining us.</p>
    `;
    subject = `${company}: Your application is under review`;
  } else if (
    normalizedStatus === "shortlisted" ||
    normalizedStatus === "approved" ||
    normalizedStatus === "selected"
  ) {
    headline = "You have been shortlisted";
    body = `
      <p>Hi ${escapeHtml(input.candidateName)},</p>
      <p>We reviewed your application for <strong>${escapeHtml(input.roleTitle)}</strong> at ${escapeHtml(company)}.</p>
      <p>We’re glad to inform you that you have been <strong>shortlisted</strong> for the next stage.</p>
      <p>Our team will contact you with the next steps shortly.</p>
    `;
    subject = `${company}: You have been shortlisted`;
  } else if (normalizedStatus === "rejected") {
    headline = "Application update";
    body = `
      <p>Hi ${escapeHtml(input.candidateName)},</p>
      <p>Thank you for taking the time to apply for <strong>${escapeHtml(input.roleTitle)}</strong> at ${escapeHtml(company)}.</p>
      <p>After review, we will not be moving forward with your application for this role at this stage.</p>
      <p>We appreciate your interest and encourage you to apply again for relevant opportunities in the future.</p>
    `;
    subject = `${company}: Update on your application`;
  } else {
    body = `
      <p>Hi ${escapeHtml(input.candidateName)},</p>
      <p>Your application status for <strong>${escapeHtml(input.roleTitle)}</strong> at ${escapeHtml(company)} has been updated to <strong>${escapeHtml(input.status)}</strong>.</p>
      <p>We will share more details if further action is needed from your side.</p>
    `;
  }

  const html = wrapHtml(headline, body);

  const text =
    `Hi ${input.candidateName},\n\n` +
    `Your application status for ${input.roleTitle} at ${company} is now: ${input.status}.\n\n` +
    `We will share more details if further action is needed.\n`;

  return {
    subject,
    html,
    text,
  };
}