// src/lib/security/turnstile.ts
import { serverEnv } from "@/lib/env";

type TurnstileVerifyOk = { success: true };
type TurnstileVerifyFail = {
  success: false;
  error?: string;
  codes?: string[];
};

export async function verifyTurnstileToken(
  token: string | null | undefined,
  ip?: string | null
): Promise<TurnstileVerifyOk | TurnstileVerifyFail> {
  const secret = serverEnv?.TURNSTILE_SECRET_KEY;

  // If you haven’t enabled Turnstile yet, don’t block forms.
  if (!secret) return { success: true };

  if (!token) return { success: false, error: "Missing Turnstile token." };

  const form = new FormData();
  form.append("secret", secret);
  form.append("response", token);
  if (ip) form.append("remoteip", ip);

  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    { method: "POST", body: form }
  );

  if (!res.ok) {
    return { success: false, error: "Turnstile verification failed." };
  }

  const json = (await res.json()) as {
    success?: boolean;
    ["error-codes"]?: string[];
  };

  if (json?.success) return { success: true };

  return {
    success: false,
    error: "Turnstile rejected the request.",
    codes: Array.isArray(json?.["error-codes"]) ? json["error-codes"] : undefined,
  };
}