import { NextRequest, NextResponse } from "next/server";
import { checkInTicket } from "@/lib/tickets/checkInTicket";
import { requireScannerAccess } from "@/lib/scanner/auth";

export const runtime = "nodejs";

function getClientIp(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? null;

  return (
    req.headers.get("x-real-ip") ??
    req.headers.get("cf-connecting-ip") ??
    null
  );
}

export async function POST(req: NextRequest) {
  try {
    const body: Record<string, unknown> | null = await req.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { ok: false, error: "Invalid JSON body." },
        { status: 400 }
      );
    }

    const token = typeof body.token === "string" ? body.token.trim() : "";
    const eventId = typeof body.eventId === "string" ? body.eventId.trim() : "";

    if (!token || !eventId) {
      return NextResponse.json(
        { ok: false, error: "Token and eventId are required." },
        { status: 400 }
      );
    }

    const auth = await requireScannerAccess(eventId);

    if (!auth.ok) {
      return NextResponse.json(
        { ok: false, error: auth.error },
        { status: auth.status }
      );
    }

    const result = await checkInTicket({
      token,
      eventId,
      scannedBy: auth.actor.accessId,
      source: "volunteer-scanner",
      device: req.headers.get("sec-ch-ua-mobile") ?? "unknown",
      ip: getClientIp(req),
      userAgent: req.headers.get("user-agent"),
    });

    const status =
      result.ok
        ? 200
        : result.result === "already_used" || result.result === "wrong_event"
        ? 409
        : 400;

    return NextResponse.json(
      {
        ok: result.ok,
        error: result.ok ? undefined : result.message,
        data: result,
        message: result.message,
      },
      { status }
    );
  } catch (error) {
    console.error("volunteer checkin failed", error);
    return NextResponse.json(
      { ok: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}