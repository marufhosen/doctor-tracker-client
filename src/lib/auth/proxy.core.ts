export type ProxyDecision = "continue" | "login" | "refresh" | "dashboard";

const base64UrlDecode = (segment: string): string => {
  if (!segment || !/^[A-Za-z0-9_-]+$/.test(segment)) throw new Error("Invalid JWT segment");
  const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return atob(padded);
};

export function hasUsableAccessToken(token: string | undefined, nowSeconds = Date.now() / 1000) {
  if (!token) return false;
  try {
    const segments = token.split(".");
    if (segments.length !== 3) return false;
    const [headerSegment, payloadSegment, signatureSegment] = segments;
    if (!headerSegment || !payloadSegment || !signatureSegment) return false;

    const header = JSON.parse(base64UrlDecode(headerSegment)) as { alg?: unknown; typ?: unknown };
    if (header.alg !== "HS256" || header.typ !== "JWT") return false;

    // HS256 always produces a 256-bit signature. This does not verify the
    // signature cryptographically, but reliably rejects truncated cookies
    // before they reach the protected application shell.
    if (base64UrlDecode(signatureSegment).length !== 32) return false;

    const payload = JSON.parse(base64UrlDecode(payloadSegment)) as { exp?: unknown };
    return typeof payload.exp === "number" && payload.exp > nowSeconds + 5;
  } catch {
    return false;
  }
}

export function getProxyDecision(
  pathname: string,
  hasAccessCookie: boolean,
  hasRefreshCookie: boolean,
): ProxyDecision {
  if (pathname === "/login") return hasAccessCookie ? "dashboard" : "continue";
  if (hasAccessCookie) return "continue";
  return hasRefreshCookie ? "refresh" : "login";
}
