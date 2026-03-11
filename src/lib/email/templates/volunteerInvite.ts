export function volunteerInviteEmail({
  name,
  eventTitle,
  eventId,
  volunteerId,
  tempCode,
  accessUrl,
  expiresAt,
}: {
  name: string;
  eventTitle: string;
  eventId: string;
  volunteerId: string;
  tempCode: string;
  accessUrl: string;
  expiresAt: string;
}) {
  const subject = `Volunteer Access – ${eventTitle}`;

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px;">
      <h2>Volunteer Access Assigned</h2>

      <p>Hello ${name},</p>

      <p>You have been added as a volunteer for the following Sophrion event.</p>

      <div style="background:#f6f7fb;padding:16px;border-radius:10px;margin:16px 0;">
        <p><strong>Event:</strong> ${eventTitle}</p>
        <p><strong>Event ID:</strong> ${eventId}</p>
        <p><strong>Volunteer ID:</strong> ${volunteerId}</p>
        <p><strong>Temporary Access Code:</strong> ${tempCode}</p>
        <p><strong>Access Expiry:</strong> ${expiresAt}</p>
      </div>

      <p>To access the ticket scanner, follow these steps:</p>

      <ol>
        <li>Open the volunteer login page</li>
        <li>Enter your <strong>Event ID</strong></li>
        <li>Enter your <strong>Temporary Access Code</strong></li>
      </ol>

      <p>
        <a
          href="${accessUrl}"
          style="display:inline-block;padding:12px 18px;background:#6d5efc;color:#ffffff;text-decoration:none;border-radius:8px;"
        >
          Open Volunteer Login
        </a>
      </p>

      <p>Please keep these details secure and do not share them.</p>

      <p>Regards,<br/>Sophrion Team</p>
    </div>
  `;

  return { subject, html };
}