import { sendEmail } from "@/lib/email/send";

type MailAddress = {
  address: string;
  name?: string | null;
};

type SendMailInput = {
  to: MailAddress[];
  subject: string;
  html: string;
  text?: string;
  cc?: MailAddress[];
  replyTo?: MailAddress[];
  clientReference?: string;
};

function normalizeAddressList(list?: MailAddress[]) {
  return (list ?? [])
    .map((item) => ({
      address: item.address?.trim(),
      name: item.name?.trim() || undefined,
    }))
    .filter((item) => item.address);
}

export async function sendMail(input: SendMailInput) {
  const to = normalizeAddressList(input.to);

  if (!to.length) {
    throw new Error("At least one recipient is required.");
  }

  console.log("[sendMail] forwarding to shared transport");
  console.log(
    "[sendMail] to:",
    to.map((item) => item.address).join(", ")
  );
  console.log("[sendMail] subject:", input.subject);

  return sendEmail({
    to: to.map((item) => item.address),
    subject: input.subject,
    html: input.html,
    text: input.text,
  });
}