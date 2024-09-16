import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (!token || !token.role) {
      return NextResponse.redirect(
        new URL("https://next-library-app-weld.vercel.app/login", req.url)
      );
    }

    if (token.role !== "admin") {
      return NextResponse.redirect(
        new URL("https://next-library-app-weld.vercel.app/profile", req.url)
      );
    }
  } else if (token?.role === "admin") {
    return NextResponse.redirect(
      new URL("https://next-library-app-weld.vercel.app/admin", req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/"],
};
