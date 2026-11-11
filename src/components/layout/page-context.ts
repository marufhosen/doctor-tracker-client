type PageContext = {
  eyebrow: string;
  title: string;
};

const contexts: Array<{ prefix: string; context: PageContext }> = [
  { prefix: "/dashboard", context: { eyebrow: "Overview", title: "Dashboard" } },
  { prefix: "/doctors", context: { eyebrow: "Clinical team", title: "Doctors" } },
  { prefix: "/patients", context: { eyebrow: "Care records", title: "Patients" } },
];

export function getPageContext(pathname: string): PageContext {
  return (
    contexts.find(({ prefix }) => pathname === prefix || pathname.startsWith(`${prefix}/`))
      ?.context ?? {
      eyebrow: "Administration",
      title: "Doctor Tracker",
    }
  );
}
