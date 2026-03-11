import crypto from "crypto";

export function generateEmployeeToken() {
  const random = crypto.randomBytes(12).toString("hex");
  return `EMP_${random}`;
}