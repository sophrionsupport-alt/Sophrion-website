// src/lib/env.ts
import { z } from "zod";

/**
 * Helpers
 */
function toBool(v: unknown, fallback = false) {
  if (typeof v !== "string") return fallback;
  const s = v.trim().toLowerCase();
  if (s === "true" || s === "1" || s === "yes") return true;
  if (s === "false" || s === "0" || s === "no") return false;
  return fallback;
}

function toInt(v: unknown, fallback: number) {
  if (typeof v !== "string") return fallback;
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : fallback;
}

function toCsv(v: unknown) {
  if (typeof v !== "string") return [];
  return v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

const isServer = typeof window === "undefined";

/**
 * Public (browser-safe) env
 * Only NEXT_PUBLIC_* keys should live here.
 */
const PublicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(20),

  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().min(10).optional(),
  NEXT_PUBLIC_TURNSTILE_ENABLED: z.string().optional(), // "true"/"false"
});

export const publicEnv = PublicEnvSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,

  NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  NEXT_PUBLIC_TURNSTILE_ENABLED: process.env.NEXT_PUBLIC_TURNSTILE_ENABLED,
});

/**
 * Server-only env (secrets)
 * Never import this into Client Components.
 */
const ServerEnvSchema = z.object({
  // Branding/domain (server-safe; not secrets)
  SITE_NAME: z.string().min(1),
  CANONICAL_DOMAIN: z.string().url(),
  WWW_REDIRECT_ENABLED: z.string().optional(),

  // Supabase
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20),

  // Email
  EMAIL_PROVIDER: z.enum(["zeptomail", "resend"]).default("zeptomail"),
  ZEPTOMAIL_HOST: z.string().url().optional(),
  ZEPTOMAIL_API_KEY: z.string().min(10).optional(),

  EMAIL_FROM_NOREPLY: z.string().min(3),
  EMAIL_FROM_CONTACT: z.string().min(3),
  CONTACT_INBOX: z.string().email(),

  // Rate limiting (Upstash)
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(10).optional(),

  RATE_LIMIT_CONTACT_PER_IP_PER_MIN: z.string().optional(),
  RATE_LIMIT_CONTACT_PER_EMAIL_PER_MIN: z.string().optional(),
  RATE_LIMIT_NEWSLETTER_PER_IP_PER_MIN: z.string().optional(),
  RATE_LIMIT_NEWSLETTER_PER_EMAIL_PER_MIN: z.string().optional(),
  RATE_LIMIT_REGISTRATION_PER_IP_PER_MIN: z.string().optional(),
  RATE_LIMIT_REGISTRATION_PER_EMAIL_PER_MIN_PER_EVENT: z.string().optional(),

  // Turnstile (server secret)
  TURNSTILE_SECRET_KEY: z.string().min(10).optional(),
  TURNSTILE_ENABLED: z.string().optional(),

  // Admin seeding
  SEED_ADMIN_EMAILS: z.string().optional(),
  DEFAULT_ADMIN_ROLE: z.string().optional(),

  // College system config
  COLLEGE_ONBOARDING_MODE: z
    .enum(["access_request", "invite_only", "both"])
    .default("both"),
  COLLEGE_CAN_PUBLISH: z.string().optional(),
  PUBLISH_MODE: z.enum(["admin_only", "self_publish"]).default("admin_only"),

  // Registration requirements
  REG_REQUIRED_FIELDS: z.string().optional(),

  // Content / LMS / careers
  CAREERS_TYPES: z.string().optional(),
  LEARN_TAGS: z.string().optional(),

  // Blog
  BLOG_ENGINE: z.enum(["mdx"]).default("mdx"),
  BLOG_INITIAL_POSTS: z.string().optional(),

  // Legal flags
  LEGAL_TERMS_ENABLED: z.string().optional(),
  LEGAL_REFUND_CANCELLATION_ENABLED: z.string().optional(),
  LEGAL_COOKIE_POLICY_ENABLED: z.string().optional(),

  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

/**
 * serverEnv is ONLY parsed on the server.
 * In the browser bundle it will be null (no parse, no crash).
 */
export const serverEnv = (isServer
  ? ServerEnvSchema.parse({
      SITE_NAME: process.env.SITE_NAME,
      CANONICAL_DOMAIN: process.env.CANONICAL_DOMAIN,
      WWW_REDIRECT_ENABLED: process.env.WWW_REDIRECT_ENABLED,

      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,

      EMAIL_PROVIDER: process.env.EMAIL_PROVIDER,
      ZEPTOMAIL_HOST: process.env.ZEPTOMAIL_HOST,
      ZEPTOMAIL_API_KEY: process.env.ZEPTOMAIL_API_KEY,

      EMAIL_FROM_NOREPLY: process.env.EMAIL_FROM_NOREPLY,
      EMAIL_FROM_CONTACT: process.env.EMAIL_FROM_CONTACT,
      CONTACT_INBOX: process.env.CONTACT_INBOX,

      UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
      UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,

      RATE_LIMIT_CONTACT_PER_IP_PER_MIN:
        process.env.RATE_LIMIT_CONTACT_PER_IP_PER_MIN,
      RATE_LIMIT_CONTACT_PER_EMAIL_PER_MIN:
        process.env.RATE_LIMIT_CONTACT_PER_EMAIL_PER_MIN,
      RATE_LIMIT_NEWSLETTER_PER_IP_PER_MIN:
        process.env.RATE_LIMIT_NEWSLETTER_PER_IP_PER_MIN,
      RATE_LIMIT_NEWSLETTER_PER_EMAIL_PER_MIN:
        process.env.RATE_LIMIT_NEWSLETTER_PER_EMAIL_PER_MIN,
      RATE_LIMIT_REGISTRATION_PER_IP_PER_MIN:
        process.env.RATE_LIMIT_REGISTRATION_PER_IP_PER_MIN,
      RATE_LIMIT_REGISTRATION_PER_EMAIL_PER_MIN_PER_EVENT:
        process.env.RATE_LIMIT_REGISTRATION_PER_EMAIL_PER_MIN_PER_EVENT,

      TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
      TURNSTILE_ENABLED: process.env.TURNSTILE_ENABLED,

      SEED_ADMIN_EMAILS: process.env.SEED_ADMIN_EMAILS,
      DEFAULT_ADMIN_ROLE: process.env.DEFAULT_ADMIN_ROLE,

      COLLEGE_ONBOARDING_MODE: process.env.COLLEGE_ONBOARDING_MODE,
      COLLEGE_CAN_PUBLISH: process.env.COLLEGE_CAN_PUBLISH,
      PUBLISH_MODE: process.env.PUBLISH_MODE,

      REG_REQUIRED_FIELDS: process.env.REG_REQUIRED_FIELDS,

      CAREERS_TYPES: process.env.CAREERS_TYPES,
      LEARN_TAGS: process.env.LEARN_TAGS,

      BLOG_ENGINE: process.env.BLOG_ENGINE,
      BLOG_INITIAL_POSTS: process.env.BLOG_INITIAL_POSTS,

      LEGAL_TERMS_ENABLED: process.env.LEGAL_TERMS_ENABLED,
      LEGAL_REFUND_CANCELLATION_ENABLED:
        process.env.LEGAL_REFUND_CANCELLATION_ENABLED,
      LEGAL_COOKIE_POLICY_ENABLED: process.env.LEGAL_COOKIE_POLICY_ENABLED,

      NODE_ENV: process.env.NODE_ENV ?? "development",
    })
  : null) as z.infer<typeof ServerEnvSchema> | null;

/**
 * publicConfig: safe, structured config you can import anywhere (client/server).
 * Do NOT put secrets here.
 */
export const publicConfig = {
  supabase: {
    url: publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  turnstile: {
    enabled: toBool(publicEnv.NEXT_PUBLIC_TURNSTILE_ENABLED, false),
    siteKey: publicEnv.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "",
  },
} as const;

/**
 * appConfig: server-only structured config (includes non-public fields).
 * IMPORTANT: Do not import this in Client Components.
 */
export function getAppConfig() {
  if (!serverEnv) {
    throw new Error(
      "getAppConfig() was called in a client bundle. Use publicConfig/publicEnv in client code."
    );
  }

  return {
    siteName: serverEnv.SITE_NAME,
    canonicalDomain: serverEnv.CANONICAL_DOMAIN.replace(/\/$/, ""),
    wwwRedirectEnabled: toBool(serverEnv.WWW_REDIRECT_ENABLED, true),

    supabase: {
      url: publicEnv.NEXT_PUBLIC_SUPABASE_URL,
      anonKey: publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },

    turnstile: {
      enabled: toBool(
        serverEnv.TURNSTILE_ENABLED ?? publicEnv.NEXT_PUBLIC_TURNSTILE_ENABLED,
        false
      ),
      siteKey: publicEnv.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "",
    },

    email: {
      provider: serverEnv.EMAIL_PROVIDER,
      fromNoReply: serverEnv.EMAIL_FROM_NOREPLY,
      fromContact: serverEnv.EMAIL_FROM_CONTACT,
      contactInbox: serverEnv.CONTACT_INBOX,
    },

    rateLimit: {
      contact: {
        perIpPerMin: toInt(serverEnv.RATE_LIMIT_CONTACT_PER_IP_PER_MIN, 5),
        perEmailPerMin: toInt(serverEnv.RATE_LIMIT_CONTACT_PER_EMAIL_PER_MIN, 3),
      },
      newsletter: {
        perIpPerMin: toInt(serverEnv.RATE_LIMIT_NEWSLETTER_PER_IP_PER_MIN, 5),
        perEmailPerMin: toInt(
          serverEnv.RATE_LIMIT_NEWSLETTER_PER_EMAIL_PER_MIN,
          3
        ),
      },
      registration: {
        perIpPerMin: toInt(serverEnv.RATE_LIMIT_REGISTRATION_PER_IP_PER_MIN, 3),
        perEmailPerMinPerEvent: toInt(
          serverEnv.RATE_LIMIT_REGISTRATION_PER_EMAIL_PER_MIN_PER_EVENT,
          2
        ),
      },
    },

    admin: {
      seedEmails: toCsv(serverEnv.SEED_ADMIN_EMAILS),
      defaultRole: serverEnv.DEFAULT_ADMIN_ROLE ?? "global_admin",
    },

    colleges: {
      onboardingMode: serverEnv.COLLEGE_ONBOARDING_MODE,
      canPublish: toBool(serverEnv.COLLEGE_CAN_PUBLISH, false),
      publishMode: serverEnv.PUBLISH_MODE,
    },

    registration: {
      requiredFields: toCsv(serverEnv.REG_REQUIRED_FIELDS),
    },

    content: {
      careersTypes: toCsv(serverEnv.CAREERS_TYPES),
      learnTags: toCsv(serverEnv.LEARN_TAGS),
    },

    blog: {
      engine: serverEnv.BLOG_ENGINE,
      initialPosts: toCsv(serverEnv.BLOG_INITIAL_POSTS),
    },

    legal: {
      termsEnabled: toBool(serverEnv.LEGAL_TERMS_ENABLED, true),
      refundCancellationEnabled: toBool(
        serverEnv.LEGAL_REFUND_CANCELLATION_ENABLED,
        true
      ),
      cookiePolicyEnabled: toBool(serverEnv.LEGAL_COOKIE_POLICY_ENABLED, false),
    },
  } as const;
}