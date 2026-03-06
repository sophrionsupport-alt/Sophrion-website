import { createClient } from "@supabase/supabase-js";
import { publicEnv, serverEnv } from "@/lib/env";

function assertServerOnly() {
  if (typeof window !== "undefined") {
    throw new Error("❌ supabaseAdminClient imported in browser/client code.");
  }
}

export function createSupabaseAdminClient() {
  assertServerOnly();

  if (!serverEnv) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY missing from server environment.");
  }

  return createClient(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    serverEnv.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  );
}