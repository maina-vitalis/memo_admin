import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Role } from "@/lib/rbac/role.enum";

/** [AUTH] Decode JWT payload without verification (UX routing only — backend enforces security). */
function decodeJwtPayload(token: string): { role?: Role; institutionId?: string | null } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf8"),
    ) as { role?: Role; institutionId?: string | null };
    return payload;
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/setup") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // memo_access is a server-set HttpOnly cookie managed exclusively by the BFF.
  // No URL-decoding needed (server never encodes it) and no Authorization header
  // fallback — the HttpOnly cookie is now always the authoritative signal.
  // NOTE: This middleware is a UX routing helper only. Real security is enforced
  // by the NestJS backend on every authenticated request.
  const token = request.cookies.get("memo_access")?.value ?? null;

  if (!token) {
    return NextResponse.next();
  }

  const payload = decodeJwtPayload(token);
  if (!payload?.role) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/super-admin") && payload.role !== Role.SUPER_ADMIN) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (
    pathname.startsWith("/admin") &&
    payload.role === Role.SUPER_ADMIN
  ) {
    return NextResponse.redirect(new URL("/super-admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/super-admin/:path*", "/admin/:path*"],
};