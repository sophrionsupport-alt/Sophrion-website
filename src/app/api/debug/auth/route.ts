import { NextResponse } from "next/server";
import { getActor } from "@/lib/auth/getActor";

export async function GET() {
  const actor = await getActor();
  return NextResponse.json({ ok: true, actor });
}