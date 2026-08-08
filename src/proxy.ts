import { NextRequest, NextResponse } from "next/server";
import { decryptSession, SESSION_COOKIE_NAME } from "@/lib/session";

// Checagem otimista (só lê o cookie, sem acessar o banco) para redirecionar
// cedo. A checagem definitiva acontece na DAL (src/lib/dal.ts), mais perto
// dos dados.
const PROTECTED_PREFIX = "/professora";
const LOGIN_ROUTE = "/login";

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = path.startsWith(PROTECTED_PREFIX);
  const isLoginRoute = path === LOGIN_ROUTE;

  const cookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await decryptSession(cookie);
  const isAuthenticated = session?.role === "professora";

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL(LOGIN_ROUTE, req.nextUrl));
  }

  if (isLoginRoute && isAuthenticated) {
    return NextResponse.redirect(new URL(PROTECTED_PREFIX, req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/professora/:path*", "/login"],
};
