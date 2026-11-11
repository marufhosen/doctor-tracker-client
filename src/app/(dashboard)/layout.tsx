import { redirect } from "next/navigation";
import { Suspense } from "react";

import { ApplicationShell } from "@/components/layout/application-shell";
import { DesktopSidebar } from "@/components/layout/desktop-sidebar";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { ProfileMenu } from "@/components/layout/profile-menu";
import { TopNavbar } from "@/components/layout/top-navbar";
import { getProtectedRouteDecision } from "@/lib/auth/protected.core";
import { getSession } from "@/lib/auth/session.server";

// Protected pages depend on request cookies and private no-store API data.
// They cannot be safely prefetched as user-independent instant shells.
export const instant = false;

export default function ProtectedLayout({ children }: LayoutProps<"/">) {
  return (
    <Suspense fallback={null}>
      <ProtectedContent>{children}</ProtectedContent>
    </Suspense>
  );
}

async function ProtectedContent({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const decision = getProtectedRouteDecision(session);
  if (decision === "login") {
    redirect("/login?next=/dashboard");
  }
  if (decision === "forbidden") redirect("/login?reason=forbidden");
  if (decision === "unavailable") throw new Error("Authentication service unavailable");
  if (session.status !== "authenticated") redirect("/login?next=/dashboard");
  return (
    <ApplicationShell
      navigation={<DesktopSidebar />}
      topbar={
        <TopNavbar
          navigationControl={<MobileNavigation />}
          profileMenu={<ProfileMenu user={{ ...session.user, role: "ADMIN" }} />}
        />
      }
    >
      {children}
    </ApplicationShell>
  );
}
