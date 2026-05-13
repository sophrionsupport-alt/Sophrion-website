import crypto from "crypto";

export function hashVolunteerAccessCode(code: string) {
  const pepper =
    process.env.VOLUNTEER_ACCESS_PEPPER?.trim() ||
    process.env.TICKET_TOKEN_SECRET?.trim() ||
    "dev-volunteer-access-pepper";
  return crypto.createHash("sha256").update(`${pepper}:${code}`, "utf8").digest("hex");
}
