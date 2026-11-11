export function getSafeReturnPath(value: string | string[] | undefined): string {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (!candidate || !candidate.startsWith("/") || candidate.startsWith("//")) return "/dashboard";
  if (
    candidate.includes("%") ||
    candidate.includes("\\") ||
    Array.from(candidate).some((character) => character.charCodeAt(0) < 32)
  )
    return "/dashboard";
  try {
    const parsed = new URL(candidate, "https://doctor-tracker.invalid");
    const allowed = ["/dashboard", "/doctors", "/patients"].some(
      (prefix) => parsed.pathname === prefix || parsed.pathname.startsWith(`${prefix}/`),
    );
    return parsed.origin === "https://doctor-tracker.invalid" && allowed
      ? `${parsed.pathname}${parsed.search}`
      : "/dashboard";
  } catch {
    return "/dashboard";
  }
}
