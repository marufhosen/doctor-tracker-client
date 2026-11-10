export const AUTH_COOKIE_NAMES = [
  "doctor_tracker_access",
  "doctor_tracker_refresh",
  "doctor_tracker_csrf",
] as const;

export type AuthCookieName = (typeof AUTH_COOKIE_NAMES)[number];
export type AuthCookies = Partial<Record<AuthCookieName, string>>;

export function serializeAuthCookies(cookies: AuthCookies): string | undefined {
  const serialized = AUTH_COOKIE_NAMES.flatMap((name) => {
    const value = cookies[name];

    return value ? [`${name}=${encodeURIComponent(value)}`] : [];
  }).join("; ");

  return serialized || undefined;
}
