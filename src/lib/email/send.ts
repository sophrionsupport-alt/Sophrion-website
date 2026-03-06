// src/lib/email/send.ts
import { getAppConfig, serverEnv } from "@/lib/env";

export type SendEmailArgs = {
  to: string | string[];
  from?: string;
  replyTo?: string;
  subject: string;
  html: string;
  text?: string;
  headers?: Record<string, string>;
};

const appConfig = getAppConfig();

if (!serverEnv) {
  throw new Error("serverEnv is unavailable in email sender");
}

const env = serverEnv;

/**
 * Current behavior:
 * - In non-production: logs payload and skips sending
 * - In production:
 *   - if EMAIL_PROVIDER=zeptomail and config exists, sends via ZeptoMail
 *   - otherwise throws a clear error
 */
export async function sendEmail(args: SendEmailArgs) {
  const to = Array.isArray(args.to) ? args.to : [args.to];
  const from = args.from ?? env.EMAIL_FROM_NOREPLY;

  const payload = {
    from,
    to,
    subject: args.subject,
    html: args.html,
    text: args.text,
    replyTo: args.replyTo,
    headers: args.headers,
  };

  if (env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.log("[email:send] DEV MODE - not sending. Payload:", payload);
    return { ok: true as const, id: "dev_stub" as const };
  }

  if (env.EMAIL_PROVIDER !== "zeptomail") {
    throw new Error(
      `Unsupported EMAIL_PROVIDER="${env.EMAIL_PROVIDER}" for current sendEmail implementation.`
    );
  }

  if (!env.ZEPTOMAIL_HOST || !env.ZEPTOMAIL_API_KEY) {
    throw new Error(
      `Email sending is not configured for production. Missing ZEPTOMAIL_HOST or ZEPTOMAIL_API_KEY. Site=${appConfig.canonicalDomain}`
    );
  }

  const res = await fetch(env.ZEPTOMAIL_HOST, {
    method: "POST",
    headers: {
      Authorization: `Zoho-enczapikey ${env.ZEPTOMAIL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: { address: from },
      to: to.map((email) => ({ email_address: { address: email } })),
      subject: args.subject,
      htmlbody: args.html,
      textbody: args.text,
      ...(args.replyTo ? { reply_to: [{ address: args.replyTo }] } : {}),
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Failed to send email via ZeptoMail (status ${res.status}). Site=${appConfig.canonicalDomain}. Body=${body}`
    );
  }

  const json = (await res.json().catch(() => ({}))) as { data?: unknown };
  return { ok: true as const, id: "zeptomail_sent" as const, data: json };
}