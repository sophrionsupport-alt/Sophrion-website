import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { checkInTicket } from "@/lib/tickets/checkInTicket";

export const runtime = "nodejs";

type ApiOk<T = unknown> = {
  ok: true;
  data?: T;
  message?: string;
};

type ApiFail<T = unknown> = {
  ok: false;
  error: string;
  data?: T;
};

function ok<T>(data?: T, message?: string, status = 200) {
  return NextResponse.json({ ok: true, data, message } satisfies ApiOk<T>, {
    status,
  });
}

function fail<T>(error: string, status = 400, data?: T) {
  return NextResponse.json(
    { ok: false, error, data } satisfies ApiFail<T>,
    { status }
  );
}

function getClientIp(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? null;
  }

  return (
    req.headers.get("x-real-ip") ??
    req.headers.get("cf-connecting-ip") ??
    null
  );
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin();

    if (!auth.ok) {
      return fail(auth.error, auth.status);
    }

    const body: Record<string, unknown> | null = await req
      .json()
      .catch(() => null);

    if (!body) {
      return fail("Invalid JSON body.", 400);
    }

    const token = typeof body.token === "string" ? body.token.trim() : "";

    const eventId =
      typeof body.eventId === "string" && body.eventId.trim()
        ? body.eventId.trim()
        : null;

    const source =
      typeof body.source === "string" && body.source.trim()
        ? body.source.trim()
        : "admin-scanner";

    const device =
      typeof body.device === "string" && body.device.trim()
        ? body.device.trim()
        : req.headers.get("sec-ch-ua-mobile") ?? "unknown";

    if (!token) {
      return fail("Token is required.", 400);
    }

    const result = await checkInTicket({
      token,
      eventId,
      scannedBy: auth.actor.userId ?? null,
      source,
      device,
      ip: getClientIp(req),
      userAgent: req.headers.get("user-agent"),
    });

    if (!result.ok) {
      const status =
        result.result === "wrong_event" ? 409 :
        result.result === "already_used" ? 409 :
        result.result === "signature_failed" ? 400 :
        result.result === "cancelled" ? 400 :
        400;

      return fail(result.message, status, result);
    }

    return ok(result, result.message, 200);
  } catch (error) {
    console.error("admin check-in POST failed", error);
    return fail("Internal server error.", 500);
  }
}