import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleWare = createMiddleware(routing);

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  const { pathname } = req.nextUrl;

  // Extract locale (like /en, /fr) from the URL and remove it from pathname
  const locale = pathname.split("/")[1];
  const cleanPathname = pathname.replace(`/${locale}`, "");

  // Redirect admin to /admin ONLY if they try to access "/"
  if (cleanPathname === "/" && token?.role === "admin") {
    return NextResponse.redirect(new URL(`/${locale}/admin`, req.url));
  }

  // Allow admin access to "/admin" and "/profile" routes
  if (cleanPathname.startsWith("/admin")) {
    // If the user is not logged in or has no role, redirect to the login page
    if (!token || !token.role) {
      return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
    }

    // Only allow admin users to access admin routes
    if (token.role !== "admin") {
      return NextResponse.redirect(new URL(`/${locale}/profile`, req.url));
    }
  }

  // Restrict access to "/professors" to logged-in users
  if (cleanPathname.startsWith("/professors")) {
    if (!token) {
      return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
    }
  }

  // Allow access to the "/profile" route for any user
  if (cleanPathname === "/profile") {
    return intlMiddleWare(req);
  }

  // No redirection for other pages, allow admins to access all pages
  return intlMiddleWare(req);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
