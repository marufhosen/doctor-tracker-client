import { type NextRequest, NextResponse } from "next/server";

import { AUTH_COOKIE_NAMES } from "@/lib/api/cookies";
import { syncAuthCookiesFromHeaders } from "@/lib/auth/cookies.core";
import { getProxyDecision, hasUsableAccessToken } from "@/lib/auth/proxy.core";
import { rotateAuthSession } from "@/lib/auth/rotate.server";

export async function proxy(request: NextRequest) {
  const decision = getProxyDecision(
    request.nextUrl.pathname,
    hasUsableAccessToken(request.cookies.get("doctor_tracker_access")?.value),
    request.cookies.has("doctor_tracker_refresh"),
  );

  if (decision === "dashboard") return NextResponse.redirect(new URL("/dashboard", request.url));
  if (decision === "refresh") {
    const authCookies = Object.fromEntries(
      AUTH_COOKIE_NAMES.flatMap((name) => {
        const value = request.cookies.get(name)?.value;
        return value ? [[name, value]] : [];
      }),
    );
    const rotated = await rotateAuthSession(authCookies, request.nextUrl.origin);
    if (rotated) {
      const requestHeaders = new Headers(request.headers);
      const forwardedCookies = new Map(
        request.cookies.getAll().map((cookie) => [cookie.name, cookie.value]),
      );
      for (const [name, value] of Object.entries(rotated.cookies)) {
        if (value) forwardedCookies.set(name, value);
      }
      requestHeaders.set(
        "Cookie",
        [...forwardedCookies]
          .map(([name, value]) => `${name}=${encodeURIComponent(value)}`)
          .join("; "),
      );

      const response = NextResponse.next({ request: { headers: requestHeaders } });
      syncAuthCookiesFromHeaders(response.cookies, rotated.headers);
      return response;
    }

    const login = new URL("/login", request.url);
    login.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
    const response = NextResponse.redirect(login);
    for (const name of AUTH_COOKIE_NAMES) {
      response.cookies.set({ name, value: "", path: "/", expires: new Date(0) });
    }
    return response;
  }
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
