"use client";

import * as React from "react";
import Link from "next/link";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { supabaseAnon } from "@/lib/supabase/client";

type Props = {
  nextPath: string;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function LoginClient({ nextPath }: Props) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [msg, setMsg] = React.useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    const { error } = await supabaseAnon.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setLoading(false);
      setMsg(error.message || "Login failed. Please try again.");
      return;
    }

    const {
      data: { session },
    } = await supabaseAnon.auth.getSession();

    console.log("login session:", session);

    setLoading(false);

    if (!session) {
      setMsg("Login succeeded, but no session was stored in the browser.");
      return;
    }

    window.location.href = nextPath;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
        <div className="rounded-2xl border border-foreground/10 bg-background/60 p-6 shadow-sm backdrop-blur">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold">Sign in</h1>
            <p className="mt-1 text-sm text-foreground/70">
              Use your email and password to access your dashboard.
            </p>
          </div>

          <form onSubmit={onSubmit} className="grid gap-4">
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@sophrion.in"
              required
            />
            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            {msg ? (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-200">
                {msg}
              </div>
            ) : null}

            <Button type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>

            <div className="text-center text-xs text-foreground/60">
              <span>Back to </span>
              <Link href="/" className="underline underline-offset-4 hover:text-foreground">
                home
              </Link>
            </div>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-foreground/50">
          Admin access is role-gated. Non-admin users will be redirected.
        </p>
      </div>
    </div>
  );
}