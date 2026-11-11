import { redirect } from "next/navigation";
import { Suspense } from "react";

import { RefreshCoordinator } from "@/components/auth/refresh-coordinator";
import { ApplicationShell } from "@/components/layout/application-shell";
import { DesktopSidebar } from "@/components/layout/desktop-sidebar";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { ProfileMenu } from "@/components/layout/profile-menu";
import { TopNavbar } from "@/components/layout/top-navbar";
import { getAuthCookies } from "@/lib/auth/cookies.server";
import { getProtectedRouteDecision } from "@/lib/auth/protected.core";
import { getSession } from "@/lib/auth/session.server";

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
    if ((await getAuthCookies()).doctor_tracker_refresh) return <RefreshCoordinator />;
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
