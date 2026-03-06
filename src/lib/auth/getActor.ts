import { isRole, type Role } from "./roles";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type Actor = {
  isAuthenticated: boolean;
  userId?: string;
  email?: string | null;
  role: Role;
};

export async function getActor(): Promise<Actor> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) {
    return { isAuthenticated: false, role: "viewer" };
  }

  const { data: profile, error: profileErr } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profileErr && profile && isRole(profile.role)) {
    return {
      isAuthenticated: true,
      userId: user.id,
      email: user.email,
      role: profile.role,
    };
  }

  const metaRole = user.user_metadata?.role;
  const resolvedRole: Role = isRole(metaRole) ? metaRole : "viewer";

  return {
    isAuthenticated: true,
    userId: user.id,
    email: user.email,
    role: resolvedRole,
  };
}