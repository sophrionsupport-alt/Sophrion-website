import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function requireAdminSecret(req: NextRequest) {
  const secret = process.env.ADMIN_API_SECRET?.trim();
  if (!secret) return true;
  return req.headers.get("x-admin-secret") === secret;
}

function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

type RegistrationRow = {
  id: string;
  event_id: string | null;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  college: string | null;
  status: "pending" | "approved" | "rejected" | string | null;
  created_at: string | null;
  events?: {
    id?: string | null;
    title?: string | null;
    venue?: string | null;
    city?: string | null;
    state?: string | null;
    start_at?: string | null;
    end_at?: string | null;
    mode?: string | null;
  } | null;
};

function escapeCsv(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  if (/[",\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function toCsv(rows: RegistrationRow[]) {
  const headers = [
    "registration_id",
    "event_id",
    "event_title",
    "event_mode",
    "event_venue",
    "event_city",
    "event_state",
    "event_start_at",
    "event_end_at",
    "full_name",
    "email",
    "phone",
    "college",
    "status",
    "registered_at",
  ];

  const lines = [headers.join(",")];

  for (const row of rows) {
    const line = [
      row.id,
      row.event_id,
      row.events?.title ?? "",
      row.events?.mode ?? "",
      row.events?.venue ?? "",
      row.events?.city ?? "",
      row.events?.state ?? "",
      row.events?.start_at ?? "",
      row.events?.end_at ?? "",
      row.full_name ?? "",
      row.email ?? "",
      row.phone ?? "",
      row.college ?? "",
      row.status ?? "",
      row.created_at ?? "",
    ].map(escapeCsv);

    lines.push(line.join(","));
  }

  return lines.join("\n");
}

export async function GET(req: NextRequest) {
  try {
    if (!requireAdminSecret(req)) {
      return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() ?? "";
    const status = searchParams.get("status")?.trim() ?? "all";
    const sort = searchParams.get("sort")?.trim() ?? "newest";

    const supabase = supabaseAdmin();

    let query = supabase
      .from("event_registrations")
      .select(`
        id,
        event_id,
        full_name,
        email,
        phone,
        college,
        status,
        created_at,
        events (
          id,
          title,
          mode,
          venue,
          city,
          state,
          start_at,
          end_at
        )
      `);

    if (status !== "all") {
      query = query.eq("status", status);
    }

    if (q) {
      query = query.or(
        [
          `full_name.ilike.%${q}%`,
          `email.ilike.%${q}%`,
          `phone.ilike.%${q}%`,
          `college.ilike.%${q}%`,
        ].join(",")
      );
    }

    query =
      sort === "oldest"
        ? query.order("created_at", { ascending: true })
        : query.order("created_at", { ascending: false });

    const { data, error } = await query;

    if (error) {
      return Response.json(
        { ok: false, error: error.message || "Failed to export registrations." },
        { status: 500 }
      );
    }

    const rows = (data ?? []) as RegistrationRow[];
    const csv = toCsv(rows);

    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    const filename = `registrations-export-${stamp}.csv`;

    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}