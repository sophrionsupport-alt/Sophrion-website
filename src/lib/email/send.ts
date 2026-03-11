type SendEmailArgs = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
};

type MailAddress = {
  address: string;
  name?: string | null;
};

function getTrimmedEnv(...names: string[]) {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  return "";
}

function ensureEnv(value: string, label: string) {
  if (!value) {
    throw new Error(`Missing required env: ${label}`);
  }
  return value;
}

function normalizeRecipients(to: string | string[]): MailAddress[] {
  const list = Array.isArray(to) ? to : [to];
  const cleaned = list.map((item) => item.trim()).filter(Boolean);

  if (!cleaned.length) {
    throw new Error("At least one recipient is required.");
  }

  return cleaned.map((address) => ({ address }));
}

export async function sendEmail({ to, subject, html, text }: SendEmailArgs) {
  const apiKey = ensureEnv(
    getTrimmedEnv("ZEPTOMAIL_API_KEY", "ZEPTO_MAIL_TOKEN"),
    "ZEPTOMAIL_API_KEY or ZEPTO_MAIL_TOKEN"
  );

  const fromEmail = ensureEnv(
    getTrimmedEnv("ZEPTOMAIL_FROM_EMAIL", "ZEPTO_MAIL_FROM_EMAIL"),
    "ZEPTOMAIL_FROM_EMAIL or ZEPTO_MAIL_FROM_EMAIL"
  );

  const fromName =
    getTrimmedEnv("ZEPTOMAIL_FROM_NAME", "ZEPTO_MAIL_FROM_NAME") || "Sophrion";

  const host = (
    getTrimmedEnv("ZEPTOMAIL_HOST") ||
    "https://api.zeptomail.in"
  ).replace(/\/+$/, "");

  const recipients = normalizeRecipients(to);

  const payload = {
    from: {
      address: fromEmail,
      name: fromName,
    },
    to: recipients.map((recipient) => ({
      email_address: {
        address: recipient.address,
        ...(recipient.name ? { name: recipient.name } : {}),
      },
    })),
    subject,
    htmlbody: html,
    ...(text ? { textbody: text } : {}),
    track_clicks: true,
    track_opens: true,
  };

  console.log("[MAIL] provider: zeptomail");
  console.log("[MAIL] url:", `${host}/v1.1/email`);
  console.log("[MAIL] from:", fromEmail);
  console.log("[MAIL] subject:", subject);
  console.log(
    "[MAIL] to:",
    recipients.map((r) => r.address).join(", ")
  );

  const response = await fetch(`${host}/v1.1/email`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Zoho-enczapikey ${apiKey}`,
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const raw = await response.text();

  console.log("[MAIL] status:", response.status);
  console.log("[MAIL] raw response:", raw || "<empty>");

  if (!response.ok) {
    throw new Error(
      `ZeptoMail failed (${response.status}): ${raw || "<empty response>"}`
    );
  }

  try {
    return raw ? JSON.parse(raw) : { ok: true };
  } catch {
    return raw;
  }
}