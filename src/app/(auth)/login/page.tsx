import { Activity, HeartPulse, ShieldCheck } from "lucide-react";
import { Suspense } from "react";

import { LoginForm } from "@/components/auth/login-form";
import { getSafeReturnPath } from "@/lib/auth/redirect";

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
  const returnTo = getSafeReturnPath((await searchParams).next);

  return <LoginPageShell returnTo={returnTo} />;
}

function LoginPageShell({ returnTo = "/dashboard" }: { returnTo?: string }) {
  return (
    <main className="grid min-h-svh bg-background lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden bg-clinical-teal p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white_0,transparent_32%),radial-gradient(circle_at_80%_70%,#70c9bd_0,transparent_38%)]" />
        <div className="relative flex items-center gap-3 text-lg font-semibold">
          <span className="grid size-11 place-items-center rounded-xl bg-white/15 ring-1 ring-white/20">
            <HeartPulse aria-hidden="true" />
          </span>
          Doctor Tracker
        </div>
        <div className="relative max-w-xl space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
            Clinical operations
          </p>
          <h1 className="text-4xl leading-tight text-white xl:text-5xl">
            Calm, secure oversight for every doctor and patient.
          </h1>
          <p className="max-w-lg text-lg leading-8 text-white/75">
            A focused administrative workspace for managing care teams, patient assignments, and
            operational trends.
          </p>
          <div className="grid gap-3 pt-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl bg-white/10 p-4 ring-1 ring-white/15">
              <ShieldCheck aria-hidden="true" className="size-5 text-[#b9ded8]" />
              <span className="text-sm">Protected admin access</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white/10 p-4 ring-1 ring-white/15">
              <Activity aria-hidden="true" className="size-5 text-[#b9ded8]" />
              <span className="text-sm">Live operational clarity</span>
            </div>
          </div>
        </div>
        <p className="relative text-sm text-white/60">Secure administrative portal</p>
      </section>
      <section className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-16">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
              <HeartPulse aria-hidden="true" />
            </span>
            <span className="font-semibold">Doctor Tracker</span>
          </div>
          <div className="mb-8 space-y-2">
            <p className="text-sm font-semibold text-primary">Welcome back</p>
            <h2 className="text-3xl">Sign in to your workspace</h2>
            <p className="text-muted-foreground">Use your administrator credentials to continue.</p>
          </div>
          <LoginForm returnTo={returnTo} />
        </div>
      </section>
    </main>
  );
}
