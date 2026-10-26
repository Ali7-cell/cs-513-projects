import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect all /admin routes and /api/admin endpoints
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const secret =
      process.env.NEXTAUTH_SECRET ||
      "uaf_jwt_secret_key_super_secure_random_hash_2026";

    const isProduction = process.env.NODE_ENV === "production";

    // Check with explicit secure cookie name first in production
    let token = await getToken({
      req,
      secret,
      cookieName: isProduction
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token",
    });

    if (!token) {
      // Fallback check
      token = await getToken({
        req,
        secret,
      });
    }

    const isAdmin = token?.role === "ADMIN";

    if (!isAdmin) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          {
            success: false,
            error: { message: "Forbidden: Administrator privileges required." },
          },
          { status: 403 }
        );
      }

      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("admin", "true");
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Security & Anti-Cache Headers: Prevents browser history & bfcache from caching admin screens
    const response = NextResponse.next();
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
