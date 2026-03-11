import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateEmployeeId } from "@/lib/employees/generateEmployeeId";
import { generateEmployeeToken } from "@/lib/employees/generateEmployeeToken";

export const runtime = "nodejs";

function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function fail(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

function ok(data?: unknown) {
  return NextResponse.json({ ok: true, data });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      full_name,
      email,
      phone,
      department,
      role_type,
      designation,
      photo_url,
      blood_group,
      emergency_contact_name,
      emergency_contact_phone,
    } = body;

    if (!full_name) return fail("full_name is required");
    if (!department) return fail("department is required");
    if (!role_type) return fail("role_type is required");

    const supabase = supabaseAdmin();

    const { employeeId, year, serialNumber } =
      await generateEmployeeId(department, role_type);

    const verificationToken = generateEmployeeToken();

    const { data, error } = await supabase
      .from("employees")
      .insert({
        employee_id: employeeId,
        verification_token: verificationToken,

        year,
        department,
        role_type,
        serial_number: serialNumber,

        full_name,
        email,
        phone,
        designation,
        photo_url,

        blood_group,
        emergency_contact_name,
        emergency_contact_phone,
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      return fail("Failed to create employee", 500);
    }

    const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/verify/${verificationToken}`;

    return ok({
      employee: data,
      verify_url: verifyUrl,
    });
  } catch (err) {
    console.error(err);
    return fail("Server error", 500);
  }
}