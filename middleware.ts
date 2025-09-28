import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Routes protégées qui nécessitent une authentification
  const protectedPaths = ["/admin/dashboard"];
  const currentPath = request.nextUrl.pathname;

  const isProtectedPath = protectedPaths.some((path) =>
    currentPath.startsWith(path),
  );

  const accessToken = request.cookies.get("access_token");
  const refreshToken = request.cookies.get("refresh_token");
  const isAuthenticated = Boolean(accessToken || refreshToken);

  // Si on tente d'accéder à une page protégée sans être authentifié -> redirection vers /admin (login)
  if (isProtectedPath && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.searchParams.set("redirect", currentPath);
    return NextResponse.redirect(url);
  }

  // Si on est déjà authentifié et qu'on visite la page de login, rediriger vers la destination voulue ou le dashboard
  if (currentPath === "/admin" && isAuthenticated) {
    const redirect = request.nextUrl.searchParams.get("redirect");
    const destination =
      redirect && redirect.startsWith("/") ? redirect : "/admin/dashboard";
    const url = request.nextUrl.clone();
    url.pathname = destination;
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Exclure les assets statiques, l'API et l'icône
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
