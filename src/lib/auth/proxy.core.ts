export type ProxyDecision = "continue" | "login" | "refresh" | "dashboard";

export function hasUsableAccessToken(token: string | undefined, nowSeconds = Date.now() / 1000) {
  if (!token) return false;
  try {
    const payload = token.split(".")[1];
    if (!payload) return false;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(normalized)) as { exp?: unknown };
    return typeof decoded.exp === "number" && decoded.exp > nowSeconds + 5;
  } catch {
    return false;
  }
}

export function getProxyDecision(
  pathname: string,
  hasAccessCookie: boolean,
  hasRefreshCookie: boolean,
): ProxyDecision {
  if (pathname === "/refresh") return "continue";
  if (pathname === "/login") return hasAccessCookie ? "dashboard" : "continue";
  if (hasAccessCookie) return "continue";
  return hasRefreshCookie ? "refresh" : "login";
}
