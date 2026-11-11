# Doctor Tracker Client — Agent Guide

## Project brief

Doctor Tracker Client is the administrator portal for a care network. It provides
secure login, dashboard analytics, doctor and patient directories, detail views,
and the create, edit, assignment, and removal operations supported by the backend.

The product should feel professional, calm, compact, accessible, and efficient.
Use real API data and supported domain fields only. Do not invent appointments,
clinical records, notifications, registration, password recovery, or analytics
that the server does not provide.

This repository owns presentation and server-side web integration. The sibling
`doctor-tracker-server` owns authentication, authorization, business rules,
persistence, and the canonical API contract.

## Source of truth and repository boundaries

- Treat the server implementation, `docs/API.md`, and `docs/openapi.json` as the
  source of truth. Verify actual routes, schemas, cookies, error envelopes, and
  status codes before changing an integration.
- The sibling server is read-only unless the user explicitly requests a server
  change. Do not silently compensate for a server defect with fake client data.
- Do not add `src/app/api/**`, database models, database connections, or duplicate
  backend business logic here.
- Keep `API_BASE_URL` server-only. Never use `NEXT_PUBLIC_` for private API
  configuration, credentials, or authentication material.
- Preserve unrelated and pre-existing changes in both repositories.

## Current stack

- Next.js 16 App Router, React 19, and strict TypeScript
- Bun for dependency management, scripts, and tests
- Tailwind CSS 4 with semantic CSS variables
- shadcn/ui and Radix primitives, Lucide icons
- Formik via `useFormik` and Zod validation
- Recharts for genuine dashboard data and Sonner for toast feedback
- Poppins, self-hosted through `@fontsource/poppins`, across the application
- Biome for linting and formatting; Bun test with Testing Library

Do not introduce another package manager or overlapping state, form, API, icon,
chart, or component library without a demonstrated need and user approval.

## Next.js 16 rules

- Before changing framework behavior, consult the relevant installed guide under
  `node_modules/next/dist/docs/`; do not rely on older conventions.
- Use `src/proxy.ts`, not deprecated `middleware.ts`.
- Await request-time APIs such as `cookies()`, `headers()`, `params`, and
  `searchParams` where required.
- Cookies may be mutated only in supported Server Function or Proxy contexts.
  Server Components may read cookies but must not attempt to repair them.
- For Cache Components and instant navigation, put uncached or URL-dependent work
  behind an appropriate `Suspense` boundary, use a valid cache strategy, or mark
  the route as blocking when that is intentional.

## Architecture

- Prefer Server Components for pages and data composition. Keep Client Components
  small and limited to browser interaction, Formik state, dialogs, menus, charts,
  and other genuinely interactive UI.
- Use server-only services for reads and Server Actions for mutations. Do not
  duplicate fetch, cookie, refresh, or error-normalization logic in pages.
- Keep API transport in `src/lib/api`, domain orchestration in service modules,
  validation at boundaries, and reusable primitives in `src/components/ui`.
- Validate outbound form data and inbound API responses. Prefer explicit types
  and discriminated results; do not use `any` to bypass a contract.
- Keep filter, sort, pagination, search, and date state in URL parameters. The URL
  is authoritative so views remain shareable and browser navigation works.
- Fetch independent data in parallel and avoid request waterfalls. Use private,
  request-scoped deduplication only when safe.
- Never cross-user cache authentication, session, doctor, or patient data. Use
  `no-store` where identity or sensitive records are involved.
- After successful mutations, revalidate only affected paths or tags and update
  the UI without an unnecessary full-page browser reload.

## Authentication and security invariants

- Authentication uses backend-issued HttpOnly cookies. Raw access tokens, refresh
  tokens, and CSRF secrets must never reach Client Components or browser-readable
  application state.
- Explicitly forward only known authentication cookies and required `Origin`/CSRF
  headers. Mirror rotated cookies with their security attributes and exact expiry.
- Never extend absolute session lifetime during refresh. Remember Me follows the
  backend contract; it is not a client-only timer.
- `src/proxy.ts` is an optimistic navigation and session-repair layer, not an
  authorization boundary. Protected layouts, services, and actions must still
  verify the current user and role.
- Missing, expired, malformed, truncated, or signature-invalid access cookies may
  be repaired transparently when a valid refresh session exists. Do not expose a
  public refresh page or require user-visible refresh navigation.
- Use `src/lib/auth/rotate.server.ts`. Coalesce only requests for the same refresh
  session; never share a rotated result or promise across users.
- Use the shared authenticated request wrapper for mutations. After an explicit
  auth failure, rotate and retry at most once. This differs from transport retry:
  never network-retry a non-idempotent mutation whose outcome is unknown.
- If refresh is absent, invalid, revoked, replayed, or expired, clear local auth
  state as appropriate and redirect to login without creating a redirect loop.
- Logout must call backend revocation, clear mirrored cookies, invalidate relevant
  data, and redirect to login.
- Never log secrets, tokens, cookies, passwords, authorization headers, or
  sensitive patient payloads.

## Forms, errors, and API behavior

- Use Formik's `useFormik`; use shadcn/Radix controls instead of raw custom
  primitives when an accessible project primitive exists.
- Validate on the client for usability and again in the Server Action for trust.
- Every field must show concise, human-readable messages such as “Full name is
  required.” Never render raw Zod diagnostics, regexes, stack traces, database
  errors, or internal backend details.
- Preserve safe backend field errors. Normalize timeouts, network failures,
  unauthorized, forbidden, not-found, conflict, and validation responses.
- Central requests must use safe URL construction, serialized query parameters,
  timeouts/cancellation, typed errors, and controlled retries.
- Do not auto-submit search or filters unless explicitly requested. Clear/reset
  controls must also clear their visible values.

## UI and accessibility

- Preserve the compact violet design system and semantic tokens in `globals.css`;
  avoid one-off colors, dimensions, shadows, and spacing.
- Use Poppins consistently. Maintain clear hierarchy, readable dense tables,
  compact filters, restrained cards, and useful loading/empty/error states.
- Prefer shadcn/ui for buttons, inputs, selects, dialogs, dropdowns, tables,
  badges, skeletons, tooltips, sheets, and related controls.
- Keep breadcrumbs in the top navigation. Detail pages need a discoverable back
  path without duplicating page-level breadcrumbs.
- Dashboard visuals must work for large datasets: aggregate, rank, paginate, or
  summarize instead of rendering every doctor label.
- Support keyboard navigation, visible focus, semantic HTML, labels, error
  announcements, accessible dialogs, WCAG AA contrast, reduced motion,
  touch-friendly controls, and responsive desktop/mobile layouts.
- Mobile navigation must keep the user menu on the right. Wide tables may use the
  shared thin scrollbar or a purpose-built responsive representation.
- Do not add decorative or nonfunctional controls.

## Working agreement

1. Read this file and any more specific `AGENTS.md` that applies.
2. Inspect `git status`, relevant recent commits, and the files involved. Consult
   `TASKS.md` for history, but its old phased workflow does not override the
   user's current request.
3. Confirm existing behavior and inspect the server contract before integration
   changes.
4. Make the smallest coherent change, preserve unrelated work, and add or update
   focused tests.
5. Run proportionate checks, inspect the diff, and report checks not completed.
6. Commit only when requested or explicitly required by the active task. Use a
   short Conventional Commit and stage only related files.

Never commit `.env` files, credentials, tokens, generated secrets, or unrelated
changes. Do not rewrite user work merely to clean the working tree.

## Verification commands

Use the smallest relevant set, expanding for higher-risk changes:

```bash
bun test <relevant-test-file>
bun run typecheck
bun run lint
bun run format:check
bun run build
```

A change is complete when the real API contract is respected, security and
accessibility invariants remain intact, relevant tests pass, and the production
build is checked for material framework, routing, configuration, or integration
changes.
