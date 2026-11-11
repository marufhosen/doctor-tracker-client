import { type NextRequest, NextResponse } from "next/server";

import { getProxyDecision } from "@/lib/auth/proxy.core";

export function proxy(request: NextRequest) {
  const decision = getProxyDecision(
    request.nextUrl.pathname,
    request.cookies.has("doctor_tracker_access"),
    request.cookies.has("doctor_tracker_refresh"),
  );

  if (decision === "dashboard") return NextResponse.redirect(new URL("/dashboard", request.url));
  if (decision === "login") {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/dashboard/:path*", "/doctors/:path*", "/patients/:path*"],
};
