export function volunteerInviteEmail(input: {
  name: string;
  eventTitle: string;
  eventId: string;
  volunteerId: string;
  tempCode: string;
  accessUrl: string;
  expiresAt: string;
}) {
  const safeName = escapeHtml(input.name);
  const safeEvent = escapeHtml(input.eventTitle);
  const safeCode = escapeHtml(input.tempCode);
  const safeUrl = escapeHtml(input.accessUrl);
  const safeEventId = escapeHtml(input.eventId);
  const expires = escapeHtml(new Date(input.expiresAt).toLocaleString());

  const subject = `Scanner access — ${input.eventTitle}`;

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#111827;">
      <p>Hi ${safeName},</p>
      <p>You’ve been granted temporary volunteer scanner access for <strong>${safeEvent}</strong>.</p>
      <p><strong>Temporary code (enter once at login):</strong> <span style="font-family:monospace;font-size:18px;">${safeCode}</span></p>
      <p><strong>Volunteer login:</strong> <a href="${safeUrl}">${safeUrl}</a></p>
      <p><strong>Event ID (paste at login):</strong> <span style="font-family:monospace;">${safeEventId}</span></p>
      <p><strong>Expires:</strong> ${expires}</p>
      <p style="font-size:12px;color:#6b7280;">This code will not be shown again after you leave the admin screen. Do not forward to anyone outside your event team.</p>
    </div>
  `;

  return { subject, html };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
