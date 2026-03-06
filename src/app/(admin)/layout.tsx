import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set() {},
        remove() {},
      },
    }
  );

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile || profile.role !== "admin") {
    redirect("/unauthorized");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="min-h-[calc(100vh-140px)]">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}