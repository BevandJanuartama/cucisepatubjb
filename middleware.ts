import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Ganti "admin_session" menjadi "admin_auth"
  const loginCookie = request.cookies.get("admin_auth");
  const { pathname } = request.nextUrl;

  // Jika mencoba akses halaman admin tapi belum login
  if (pathname.startsWith("/admin") && !loginCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Jika sudah login tapi malah mau ke halaman login lagi
  if (pathname === "/login" && loginCookie) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
