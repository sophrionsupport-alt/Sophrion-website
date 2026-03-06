// src/lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr";
import { publicEnv } from "@/lib/env";

/**
 * Browser Supabase client that stores auth session in cookies (SSR-friendly).
 * Required for server-side route protection (admin layout checks).
 */
export const supabaseAnon = createBrowserClient(
  publicEnv.NEXT_PUBLIC_SUPABASE_URL,
  publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY
);