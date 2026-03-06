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

export function registrationInboxEmail(payload: RegistrationPayload) {
  const title = `New registration: ${payload.name} (${payload.event_id})`;
  const html = wrapHtml(
    title,
    `<p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
     <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
     <p><strong>Phone:</strong> ${escapeHtml(payload.phone)}</p>
     <p><strong>College:</strong> ${escapeHtml(payload.college)}</p>
     <p><strong>Year:</strong> ${escapeHtml(payload.year)}</p>
     ${payload.roll_number ? `<p><strong>Roll No:</strong> ${escapeHtml(payload.roll_number)}</p>` : ""}
     <p><strong>Event ID:</strong> ${escapeHtml(payload.event_id)}</p>
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
    `Event ID: ${payload.event_id}\n`;

  return { subject: title, html, text };
}

export function registrationAutoReplyEmail(payload: RegistrationPayload) {
  const title = `Registration received`;
  const html = wrapHtml(
    title,
    `<p>Hi ${escapeHtml(payload.name)},</p>
     <p>We received your registration for <strong>${escapeHtml(payload.event_id)}</strong>.</p>
     <p>Your registration will be reviewed and confirmed. If approved, you’ll receive an update with next steps.</p>`
  );

  const text =
    `Hi ${payload.name},\n\n` +
    `We received your registration for ${payload.event_id}.\n` +
    `We will review and confirm it.\n`;

  return { subject: `${appConfig.siteName}: ${title}`, html, text };
}