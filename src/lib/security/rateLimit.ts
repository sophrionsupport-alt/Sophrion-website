// src/lib/security/rateLimit.ts
import { serverEnv } from "@/lib/env";

export type RateLimitResult = {
  ok: boolean;
  remaining?: number;
  resetMs?: number;
  limit?: number;
  reason?: string;
};

type Options = {
  key: string;
  limit: number;
  windowMs: number;
};

const mem = new Map<string, { count: number; resetAt: number }>();

function memLimit({ key, limit, windowMs }: Options): RateLimitResult {
  const now = Date.now();
  const hit = mem.get(key);

  if (!hit || hit.resetAt <= now) {
    mem.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, resetMs: windowMs, limit };
  }

  if (hit.count >= limit) {
    return {
      ok: false,
      remaining: 0,
      resetMs: Math.max(0, hit.resetAt - now),
      limit,
      reason: "Rate limit exceeded.",
    };
  }

  hit.count += 1;
  mem.set(key, hit);

  return {
    ok: true,
    remaining: Math.max(0, limit - hit.count),
    resetMs: Math.max(0, hit.resetAt - now),
    limit,
  };
}

async function upstashLimit(opts: Options): Promise<RateLimitResult | null> {
  if (!serverEnv) return null;

  const env = serverEnv;
  const url = env.UPSTASH_REDIS_REST_URL;
  const token = env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) return null;

  try {
    const [{ Redis }, { Ratelimit }] = await Promise.all([
      import("@upstash/redis"),
      import("@upstash/ratelimit"),
    ]);

    const redis = new Redis({ url, token });

    const rl = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(opts.limit, `${opts.windowMs} ms`),
      analytics: true,
    });

    const r = await rl.limit(opts.key);

    return {
      ok: r.success,
      remaining: r.remaining,
      resetMs: r.reset ? Math.max(0, r.reset - Date.now()) : undefined,
      limit: opts.limit,
      reason: r.success ? undefined : "Rate limit exceeded.",
    };
  } catch {
    return null;
  }
}

/**
 * Rate limit helper (server-only)
 * Prefer key = `${ip}:${route}` for public endpoints.
 */
export async function rateLimit(opts: Options): Promise<RateLimitResult> {
  const upstash = await upstashLimit(opts);
  if (upstash) return upstash;
  return memLimit(opts);
}