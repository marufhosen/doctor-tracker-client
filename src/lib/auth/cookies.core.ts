import { AUTH_COOKIE_NAMES, type AuthCookieName } from "@/lib/api/cookies";

export interface MirroredCookie {
  name: AuthCookieName;
  value: string;
  path: "/";
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax" | "strict" | "none";
  priority?: "low" | "medium" | "high";
  expires?: Date;
  maxAge?: number;
}

export interface MutableCookieStore {
  set(cookie: MirroredCookie): void;
}

const knownCookieNames = new Set<string>(AUTH_COOKIE_NAMES);

const getSetCookieLines = (headers: Headers): string[] => {
  const values = headers.getSetCookie();

  if (values.length > 0) return values;

  const combined = headers.get("set-cookie");
  return combined
    ? combined
        .split(/,(?=\s*doctor_tracker_(?:access|refresh|csrf)=)/i)
        .map((value) => value.trim())
    : [];
};

export function parseAuthSetCookie(line: string): MirroredCookie | undefined {
  const [nameValue, ...attributeParts] = line.split(";");
  const separator = nameValue?.indexOf("=") ?? -1;

  if (!nameValue || separator <= 0) return undefined;

  const name = nameValue.slice(0, separator).trim();
  if (!knownCookieNames.has(name)) return undefined;

  const attributes = new Map<string, string | true>();
  for (const part of attributeParts) {
    const [rawKey, ...rawValue] = part.trim().split("=");
    if (!rawKey) continue;
    attributes.set(rawKey.toLowerCase(), rawValue.length > 0 ? rawValue.join("=") : true);
  }

  const sameSiteValue = attributes.get("samesite");
  const sameSite =
    typeof sameSiteValue === "string" &&
    ["lax", "strict", "none"].includes(sameSiteValue.toLowerCase())
      ? (sameSiteValue.toLowerCase() as "lax" | "strict" | "none")
      : "lax";
  const priorityValue = attributes.get("priority");
  const priority =
    typeof priorityValue === "string" &&
    ["low", "medium", "high"].includes(priorityValue.toLowerCase())
      ? (priorityValue.toLowerCase() as "low" | "medium" | "high")
      : undefined;
  const expiresValue = attributes.get("expires");
  const expires = typeof expiresValue === "string" ? new Date(expiresValue) : undefined;
  const maxAgeValue = attributes.get("max-age");
  const maxAge = typeof maxAgeValue === "string" ? Number(maxAgeValue) : undefined;

  return {
    name: name as AuthCookieName,
    value: decodeURIComponent(nameValue.slice(separator + 1)),
    path: "/",
    httpOnly: attributes.has("httponly"),
    secure: attributes.has("secure"),
    sameSite,
    ...(priority ? { priority } : {}),
    ...(expires && !Number.isNaN(expires.getTime()) ? { expires } : {}),
    ...(maxAge !== undefined && Number.isFinite(maxAge) ? { maxAge } : {}),
  };
}

export function syncAuthCookiesFromHeaders(store: MutableCookieStore, headers: Headers): number {
  let synchronized = 0;

  for (const line of getSetCookieLines(headers)) {
    const cookie = parseAuthSetCookie(line);
    if (!cookie) continue;
    store.set(cookie);
    synchronized += 1;
  }

  return synchronized;
}
