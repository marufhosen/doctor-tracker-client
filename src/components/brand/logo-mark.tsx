import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-5", className)}
    >
      <path d="M12 20.4 4.6 13.1a4.9 4.9 0 0 1 7.4-6.5 4.9 4.9 0 0 1 7.4 6.5Z" />
      <path d="M5.9 12.1h2.7l1.1-2.2 1.9 4.6 1.2-2.4h3.3" />
    </svg>
  );
}
