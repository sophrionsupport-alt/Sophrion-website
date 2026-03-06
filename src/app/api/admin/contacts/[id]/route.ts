import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";

function json(
  ok: boolean,
  init?: { data?: unknown; error?: string; message?: string },
  status = 200
) {
  return NextResponse.json({ ok, ...init }, { status });
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();

  if (!auth.ok) {
    return json(false, { error: auth.error }, auth.status);
  }

  const { id } = await ctx.params;

  if (!id) {
    return json(false, { error: "Contact message id is required." }, 400);
  }

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return json(false, { error: "Invalid JSON body." }, 400);
  }

  const archived = Boolean(body.archived);

  const { data, error } = await auth.supabase
    .from("contact_messages")
    .update({
      archived,
      archived_at: archived ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id,archived,archived_at,updated_at")
    .single();

  if (error) {
    const httpStatus = error.code === "PGRST116" ? 404 : 500;
    return json(
      false,
      {
        error:
          error.code === "PGRST116"
            ? "Contact message not found."
            : error.message,
      },
      httpStatus
    );
  }

  return json(true, { data });
}