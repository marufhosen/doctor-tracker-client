import { FileQuestion } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-[70dvh] place-items-center p-6">
      <section aria-labelledby="missing-title" className="max-w-lg text-center">
        <FileQuestion aria-hidden="true" className="mx-auto size-10 text-muted-foreground" />
        <h1 id="missing-title" className="mt-4 text-2xl">
          Record not found
        </h1>
        <p className="mt-2 text-muted-foreground">
          It may have been removed, or the address may be incorrect.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/patients">View patients</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard">Go to dashboard</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
