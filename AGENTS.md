# Doctor Tracker Client — Agent Instructions

## Next.js version rules

This project uses Next.js 16. Before changing framework behavior, read the relevant
guide in `node_modules/next/dist/docs/` and follow current conventions. In
particular, use `proxy.ts` rather than deprecated `middleware.ts`, await
request-time APIs such as `cookies()`, and only mutate cookies in a Server
Function.

## Scope and workflow

- Build the frontend incrementally with Bun, App Router, strict TypeScript,
  Tailwind, shadcn/ui, Formik, Zod, Lucide, Recharts, and Sonner.
- Treat sibling `doctor-tracker-server` as read-only and authoritative.
- Before work, inspect Git status, the latest commit, and `TASKS.md`.
- Complete only the first unchecked task and do not implement later tasks early.
- Run relevant checks, update `TASKS.md`, inspect the diff, stage related files,
  make the task's Conventional Commit, report it, and stop.
- Never commit `.env.local`, secrets, tokens, or unrelated changes.

## Architecture and security

- Do not create `app/api/**`, database models, or database connections.
- Keep pages as Server Components; use small Client Components only for browser
  interaction. Use server-only services for reads and Server Actions for writes.
- Validate form input and backend responses. Avoid `any`.
- Never expose raw tokens to Client Components or browser JavaScript.
- Explicitly forward known cookies and required Origin/CSRF headers to Express.
- Mirror backend auth cookies with equivalent security and exact expiry; never
  extend the absolute session lifetime.
- Proxy is an optimistic redirect layer, not an authorization boundary. Recheck
  user and role in layouts, data services, and actions.
- Do not share token state or refresh promises across users. Retry after refresh
  at most once; never automatically retry unsafe mutations.
- Do not cross-user cache authentication or patient data.

## UI and quality

- Use semantic theme tokens and accessible shadcn/ui primitives.
- Keep URL parameters authoritative for filters, sorting, and pagination.
- Support keyboard access, visible focus, labels, error announcements, responsive
  layouts, reduced motion, and meaningful loading/empty/error states.
- Use real backend data only; add no unsupported features or fake analytics.
