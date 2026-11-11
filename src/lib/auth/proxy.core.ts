export type ProxyDecision = "continue" | "login" | "dashboard";

export function getProxyDecision(
  pathname: string,
  hasAccessCookie: boolean,
  hasRefreshCookie: boolean,
): ProxyDecision {
  if (pathname === "/login") return hasAccessCookie ? "dashboard" : "continue";
  return hasAccessCookie || hasRefreshCookie ? "continue" : "login";
}
