import Image from "next/image";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { LogoMark } from "@/components/brand/logo-mark";
import { getSafeReturnPath } from "@/lib/auth/redirect";

const doctorPhotoUrl =
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1400&q=80";

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
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background px-4 py-6 sm:px-6 md:py-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_15%,color-mix(in_srgb,var(--brand-soft)_75%,transparent),transparent_55%),radial-gradient(circle_at_90%_85%,color-mix(in_srgb,var(--secondary)_90%,transparent),transparent_50%)]"
      />
      <div className="relative grid w-full max-w-[60rem] overflow-hidden rounded-[1.75rem] border border-border/80 bg-card shadow-[0_28px_70px_-32px_rgba(40,35,63,0.4)] md:h-[min(42rem,calc(100svh-4rem))] md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <aside className="relative hidden min-h-0 flex-col md:flex">
          <div className="relative min-h-0 flex-1">
            <Image
              src={doctorPhotoUrl}
              alt=""
              fill
              preload
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover object-[50%_22%]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-brand-deep/35 via-transparent to-transparent"
            />
          </div>
          <div className="shrink-0 bg-primary px-8 py-6 text-primary-foreground lg:px-10">
            <p className="flex items-center justify-center gap-2.5 text-base font-semibold">
              <span className="grid size-8 place-items-center rounded-full bg-white/15">
                <LogoMark className="size-4" />
              </span>
              Doctor Tracker
            </p>
            <div className="mt-5 border-l-2 border-white/40 pl-4">
              <p className="text-sm leading-6 text-primary-foreground/85">
                Welcome to{" "}
                <span className="font-semibold text-primary-foreground">Doctor Tracker</span>
              </p>
              <p className="mt-1 text-lg leading-7 font-semibold">Hospital Management System</p>
              <p className="mt-3 text-xs leading-5 text-primary-foreground/75">
                A cloud-based workspace to manage your doctors, patients, and care insights in one
                organized place.
              </p>
            </div>
          </div>
        </aside>
        <section className="scrollbar-custom flex min-h-0 flex-col overflow-y-auto px-6 py-8 sm:px-10 lg:px-12">
          <div className="mx-auto my-auto w-full max-w-[23rem]">
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground">
                <LogoMark className="size-5" />
              </span>
              <span className="text-lg font-semibold">Doctor Tracker</span>
            </div>
            <h1 className="mt-6 text-3xl">Login</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your credentials to login to your account.
            </p>
            <div className="mt-6">
              <LoginForm returnTo={returnTo} />
            </div>
            <p className="mt-5 text-center text-xs text-muted-foreground">
              Don&rsquo;t have an account? Contact your administrator.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
