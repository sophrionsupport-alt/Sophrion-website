// src/app/not-found.tsx

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <h1 className="text-5xl font-bold tracking-tight">404</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          The page you’re looking for doesn’t exist.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/"
            className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            Back to Home
          </Link>

          <Link
            href="/contact"
            className="rounded-lg border border-border px-6 py-3 text-sm font-medium transition hover:bg-muted"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </main>
  );
}