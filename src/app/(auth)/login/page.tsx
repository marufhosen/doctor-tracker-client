import type { LucideIcon } from "lucide-react";
import {
  ChartNoAxesColumn,
  LockKeyhole,
  Plus,
  ShieldCheck,
  Stethoscope,
  Users,
} from "lucide-react";
import { Suspense } from "react";

import { LoginForm } from "@/components/auth/login-form";
import { getSafeReturnPath } from "@/lib/auth/redirect";

const networkFeatures: Array<{ label: string; icon: LucideIcon }> = [
  { label: "Doctors", icon: Stethoscope },
  { label: "Patients", icon: Users },
  { label: "Insights", icon: ChartNoAxesColumn },
];

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  return (
    <Suspense fallback={<LoginPageShell />}>
      <LoginPageContent searchParams={searchParams} />
    </Suspense>
  );
}

async function LoginPageContent({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  return <LoginPageShell returnTo={getSafeReturnPath((await searchParams).next)} />;
}

function LoginPageShell({ returnTo = "/dashboard" }: { returnTo?: string }) {
  return (
    <main className="grid min-h-svh bg-card lg:grid-cols-[45%_55%]">
      <section className="relative hidden overflow-hidden bg-brand-deep px-[8%] py-12 text-white lg:flex lg:flex-col">
        <div className="flex items-center gap-3 text-xl font-semibold">
          <span className="grid size-10 place-items-center rounded-[10px] bg-white/15 text-[#d9cff8]">
            <Plus aria-hidden="true" className="size-6" />
          </span>
          Doctor Tracker
        </div>
        <div className="my-auto max-w-[34rem]">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-[10px] font-medium uppercase tracking-wide text-white/75">
            <ShieldCheck aria-hidden="true" className="size-3.5" />
            Built for administrators
          </span>
          <h1 className="mt-7 text-[clamp(2.4rem,4vw,3.8rem)] leading-[1.12] text-white">
            Care, connected.
            <br />
            Work, simplified.
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-white/65">
            Bring your doctors, patients, and insights together in one calm, organized workspace.
          </p>
          <div className="mt-10 rounded-2xl bg-[#fbfaff] p-6 text-[#2b3043] shadow-2xl shadow-black/10">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <span className="size-2 rounded-full bg-primary" />
                Your care network
              </p>
              <span className="text-[10px] text-muted-foreground">Overview</span>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {networkFeatures.map(({ label, icon: Icon }) => (
                <div key={label} className="rounded-xl bg-white p-4">
                  <Icon aria-hidden="true" className="size-5 text-primary" />
                  <p className="mt-4 text-xs font-medium">{label}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 space-y-3">
              <div className="h-2 w-full rounded-full bg-[#ece8f8]" />
              <div className="h-2 w-4/5 rounded-full bg-[#ece8f8]" />
              <div className="h-2 w-2/3 rounded-full bg-[#ece8f8]" />
            </div>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-4 text-[11px] text-white/65">
            <span className="flex items-center gap-2">
              <Stethoscope className="size-4" />
              Doctor management
            </span>
            <span className="flex items-center gap-2">
              <Users className="size-4" />
              Patient records
            </span>
            <span className="flex items-center gap-2">
              <ChartNoAxesColumn className="size-4" />
              Clear insights
            </span>
          </div>
        </div>
        <p className="flex items-center gap-2 text-[11px] text-white/55">
          <LockKeyhole aria-hidden="true" className="size-4" />A protected workspace for your care
          network.
        </p>
      </section>
      <section className="flex items-center justify-center px-5 py-12 sm:px-10 lg:px-20">
        <div className="w-full max-w-[31rem]">
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <span className="grid size-10 place-items-center rounded-[10px] bg-primary text-white">
              <Plus aria-hidden="true" />
            </span>
            <span className="font-semibold">Doctor Tracker</span>
          </div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Administrator access
          </p>
          <h2 className="mt-7 text-4xl">Welcome back</h2>
          <p className="mt-4 text-sm text-muted-foreground">
            Sign in to manage your doctors and patients.
          </p>
          <div className="mt-7">
            <LoginForm returnTo={returnTo} />
          </div>
          <p className="mt-5 text-[11px] text-muted-foreground">
            Your session is protected. Authorized users only.
          </p>
        </div>
      </section>
    </main>
  );
}
