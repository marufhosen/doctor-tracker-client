import { type NextRequest, NextResponse } from "next/server";

import { getProxyDecision, hasUsableAccessToken } from "@/lib/auth/proxy.core";

export function proxy(request: NextRequest) {
  const decision = getProxyDecision(
    request.nextUrl.pathname,
    hasUsableAccessToken(request.cookies.get("doctor_tracker_access")?.value),
    request.cookies.has("doctor_tracker_refresh"),
  );

  if (decision === "dashboard") return NextResponse.redirect(new URL("/dashboard", request.url));
  if (decision === "refresh") {
    const refresh = new URL("/refresh", request.url);
    refresh.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(refresh);
  }
  if (decision === "login") {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/refresh", "/dashboard/:path*", "/doctors/:path*", "/patients/:path*"],
};
