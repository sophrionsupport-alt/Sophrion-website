// src/lib/utils/http.ts
import { NextResponse } from "next/server";

type Json = Record<string, unknown> | unknown[] | string | number | boolean | null;

export function ok<T extends Json>(data: T, init?: ResponseInit) {
  return NextResponse.json(
    { ok: true, data },
    { status: init?.status ?? 200, headers: init?.headers }
  );
}

export function fail(message: string, status = 400, details?: Json, init?: ResponseInit) {
  return NextResponse.json(
    { ok: false, error: { message, details } },
    { status, headers: init?.headers }
  );
}