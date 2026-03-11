import { NextResponse } from "next/server";
import { clearScannerSession } from "@/lib/scanner/auth";

export const runtime = "nodejs";

export async function POST() {
  try {
    await clearScannerSession();

    return NextResponse.json({
      ok: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.error("volunteer logout failed", error);
    return NextResponse.json(
      { ok: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}