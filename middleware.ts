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

  // Handle paths that start with "/admin"
  if (cleanPathname.startsWith("/admin")) {
    if (!token || !token.role) {
      return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
    }

    if (token.role !== "admin") {
      return NextResponse.redirect(new URL(`/${locale}/profile`, req.url));
    }
  } else if (token?.role === "admin") {
    return NextResponse.redirect(new URL(`/${locale}/admin`, req.url));
  }

  return intlMiddleWare(req);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
