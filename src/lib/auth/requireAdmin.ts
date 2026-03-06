import { getActor } from "@/lib/auth/getActor";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const actor = await getActor();

  if (!actor.isAuthenticated) {
    return {
      ok: false as const,
      status: 401,
      error: "Unauthorized",
      supabase,
      actor,
    };
  }

  if (actor.role !== "admin") {
    return {
      ok: false as const,
      status: 403,
      error: "Forbidden",
      supabase,
      actor,
    };
  }

  return {
    ok: true as const,
    status: 200,
    supabase,
    actor,
  };
}