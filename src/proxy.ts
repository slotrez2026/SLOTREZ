// ─────────────────────────────────────────────────────────────
// Slotrez — Route protection proxy (Next.js 16 + @supabase/ssr)
// Save to: src/proxy.ts
// ─────────────────────────────────────────────────────────────

import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL!;

const PROTECTED_ROUTES = ["/admin"];
const AUTH_ROUTES = ["/login", "/register"];

export async function proxy(req: NextRequest) {
  let res = NextResponse.next({ request: req });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            req.cookies.set(name, value)
          );
          res = NextResponse.next({ request: req });
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const pathname = req.nextUrl.pathname;

  // Always allow auth routes through
  if (pathname.startsWith("/auth")) {
    return res;
  }

  // Only protect admin routes for now
  if (PROTECTED_ROUTES.some((r) => pathname.startsWith(r))) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== ADMIN_EMAIL) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/auth/:path*",
  ],
};
