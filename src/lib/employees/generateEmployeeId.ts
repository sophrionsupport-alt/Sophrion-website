import { createClient } from "@supabase/supabase-js";

function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function getYearCode() {
  const year = new Date().getFullYear();
  return year.toString().slice(-2);
}

function padSerial(n: number) {
  return String(n).padStart(3, "0");
}

export async function generateEmployeeId(
  department: string,
  roleType: "EMP" | "INT" | "CNT" | "VOL"
) {
  const supabase = supabaseAdmin();

  const year = getYearCode();

  const { data, error } = await supabase
    .from("employees")
    .select("serial_number")
    .eq("year", year)
    .eq("department", department)
    .eq("role_type", roleType)
    .order("serial_number", { ascending: false })
    .limit(1);

  if (error) {
    throw new Error("Failed to fetch serial number");
  }

  const lastSerial = data?.[0]?.serial_number ?? 0;
  const nextSerial = lastSerial + 1;

  const employeeId = `SPH-${year}-${department}-${roleType}-${padSerial(nextSerial)}`;

  return {
    employeeId,
    year,
    serialNumber: nextSerial,
  };
}