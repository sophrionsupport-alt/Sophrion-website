type SendEmailArgs = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: SendEmailArgs) {
  const apiKey = process.env.ZEPTOMAIL_API_KEY;
  const fromEmail = process.env.ZEPTOMAIL_FROM_EMAIL;
  const fromName = process.env.ZEPTOMAIL_FROM_NAME || "Sophrion";

  if (!apiKey) {
    throw new Error("Missing ZEPTOMAIL_API_KEY");
  }

  if (!fromEmail) {
    throw new Error("Missing ZEPTOMAIL_FROM_EMAIL");
  }

  const recipients = Array.isArray(to) ? to : [to];

  const response = await fetch("https://api.zeptomail.in/v1.1/email", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Zoho-enczapikey ${apiKey}`,
    },
    body: JSON.stringify({
      from: {
        address: fromEmail,
        name: fromName,
      },
      to: recipients.map((email) => ({
        email_address: {
          address: email,
        },
      })),
      subject,
      htmlbody: html,
      textbody: text,
    }),
  });

  const raw = await response.text();

  if (!response.ok) {
    throw new Error(`ZeptoMail failed: ${response.status} ${raw}`);
  }

  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}