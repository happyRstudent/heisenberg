import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { CONSOLE_AUTH_COOKIE } from "@/lib/auth";

export function proxy(request: NextRequest) {
  const hasAuth = request.cookies.get(CONSOLE_AUTH_COOKIE)?.value === "ok";
  if (hasAuth) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/console-login", request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/", "/quotes/:path*"],
};
