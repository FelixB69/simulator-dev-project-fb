import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Routes protégées qui nécessitent une authentification
  const protectedPaths = [
    "/admin/dashboard",
    "/admin/settings",
    "/admin/users",
  ];
  const currentPath = request.nextUrl.pathname;

  const isProtectedPath = protectedPaths.some((path) =>
    currentPath.startsWith(path),
  );

  if (isProtectedPath) {
    const accessToken = request.cookies.get("access_token");
    const refreshToken = request.cookies.get("refresh_token");

    if (!accessToken && !refreshToken) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
