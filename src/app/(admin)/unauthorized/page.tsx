import Link from "next/link";
import type { Metadata } from "next";
import SignOutButton from "@/components/auth/SignOutButton";

export const metadata: Metadata = {
  title: "Unauthorized",
  robots: { index: false, follow: false },
};

export default function Unauthorized() {
  return (
    <div className="mx-auto max-w-xl py-20">
      <div className="rounded-xl border border-border bg-card p-10 text-center">
        <h1 className="text-3xl font-semibold text-foreground">
          Access Restricted
        </h1>

        <p className="mt-3 text-sm text-foreground/60">
          You don’t have permission to access this area.
        </p>

        <div className="mt-6 grid gap-3">
          <SignOutButton redirectTo="/login" />

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-linear-to-r from-[hsl(var(--brand-600))] to-[hsl(var(--cyan-500))] px-5 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            Go to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}