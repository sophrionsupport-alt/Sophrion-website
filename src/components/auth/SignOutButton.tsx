"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { supabaseAnon } from "@/lib/supabase/client";

export default function SignOutButton({
  redirectTo = "/login",
  label = "Sign out & switch account",
}: {
  redirectTo?: string;
  label?: string;
}) {
  const router = useRouter();

  async function onClick() {
    await supabaseAnon.auth.signOut();
    router.replace(redirectTo);
    router.refresh();
  }

  return (
    <Button type="button" onClick={onClick}>
      {label}
    </Button>
  );
}