import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

type CookieMutate = {
  path?: string;
  maxAge?: number;
  domain?: string;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none" | boolean;
  expires?: Date;
};

export async function proxy(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieMutate) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieMutate) {
          res.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  // refresh auth session if expired
  await supabase.auth.getUser();

  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};