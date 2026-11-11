# Doctor Tracker Client

Administrative frontend for the Doctor Tracker API. It provides authenticated dashboard analytics, doctor management, and doctor-scoped and global patient workflows.

## Requirements

- Bun 1.3 or newer
- The sibling `doctor-tracker-server` service
- MongoDB configured for the server

## Local setup

Install dependencies and create the local environment file:

```bash
bun install --frozen-lockfile
cp .env.example .env
```

`API_BASE_URL` is server-only and must point to the Express API version root:

```dotenv
API_BASE_URL=http://localhost:8000/api/v1
```

Do not rename it to a `NEXT_PUBLIC_` variable. Authentication cookies and API credentials must never enter the browser JavaScript bundle.

Configure and start the sibling server first. Its `CORS_ORIGIN` must exactly match the client origin, normally `http://localhost:3000`. Seed an administrator using the server's documented `bun run seed:admin` command. If the server uses its documented default port `5000`, update `API_BASE_URL` accordingly.

Start the client:

```bash
bun run dev
```

Open `http://localhost:3000` and sign in with the seeded administrator.

## Commands

| Command | Purpose |
| --- | --- |
| `bun run dev` | Start the Next.js development server |
| `bun run build` | Create a production build |
| `bun run start` | Serve the production build |
| `bun run check` | Run Biome formatting and lint checks |
| `bun run typecheck` | Generate route types and run strict TypeScript |
| `bun run test` | Run the complete Bun test suite |
| `bun run test:e2e` | Run the deterministic administrative workflow suite |
| `bun run test:coverage` | Run tests with coverage |

## Architecture

```text
src/
├── app/                 App Router pages, layouts, loading and error boundaries
├── actions/             Server Actions and independently tested mutation policy
├── components/          Server-first UI with focused interactive client islands
├── e2e/                 Controlled administrative workflow tests
├── lib/api/             API client, endpoints, queries and Zod contracts
├── lib/auth/            Cookie, session, refresh, redirect and authorization policy
├── lib/dashboard/       Dashboard query parsing and server data services
├── lib/doctors/         Doctor list/detail services and URL-state parsing
├── lib/patients/        Patient list/detail services and URL-state parsing
└── proxy.ts             Optimistic cookie-presence routing only
```

Pages remain Server Components. Interactive forms, navigation drawers, charts, and dialogs are small Client Components. Reads go through server-only services; mutations use Server Actions. Backend request and response payloads are validated with Zod.

Search, filters, sorting, date ranges, and pagination use URL parameters as their source of truth. This preserves history, reloads, sharing, and no-JavaScript form behavior.

## Authentication and security

The Express service owns authentication policy. The client mirrors only the known access, refresh, and CSRF cookies with the attributes and expiry returned by the server. Access and refresh tokens remain HTTP-only.

- Protected layouts verify the current user and require the `ADMIN` role.
- `proxy.ts` improves navigation but is not an authorization boundary.
- Every mutation validates identifiers, input, the current administrator, Origin, and CSRF state.
- Unsafe requests are never automatically retried.
- Authenticated reads are forcibly `no-store`; React request memoization is limited to the current render.
- Login return paths are restricted to local protected routes.
- API errors are normalized before reaching the UI; raw backend messages and stack traces are not shown.

Use HTTPS and secure cookies in production. Configure the server's proxy, CORS, cookie, and origin settings for the deployed client URL.

## Testing and verification

Unit and integration tests cover API contracts, query serialization, authentication rotation, cookie synchronization, role enforcement, caching, actions, URL state, responsive render alternatives, and accessibility semantics.

The controlled E2E suite exercises an administrator journey through authentication, navigation decisions, doctor creation, patient CRUD, filtering, and non-admin denial without relying on external state. It validates workflow policy rather than driving a real browser.

Run the production gate with:

```bash
bun run check
bun run typecheck
bun run test
bun run test:e2e
bun run build
```

The most recent recorded results are in [docs/VERIFICATION.md](docs/VERIFICATION.md).

## Accessibility and responsive behavior

The interface includes semantic landmarks, skip navigation, visible focus, keyboard-operated Radix dialogs, error announcements, reduced-motion behavior, forced-colors support, chart data tables, responsive cards/tables, and mobile-safe forms and dialogs.

## Current boundaries

- This is an administrator-only interface; standard users are intentionally denied.
- A patient belongs to one doctor. Reassignment is not exposed by the API or UI.
- Analytics reflect backend aggregate endpoints and contain no fabricated data.
- Patient edit intentionally excludes doctor assignment.
- The deterministic E2E suite does not replace deployment-specific browser, proxy, TLS, and cookie validation.
- The client requires the Express API; it contains no database access or internal API routes.

The authoritative API documentation is available in the sibling server at `../doctor-tracker-server/docs/API.md` and `../doctor-tracker-server/docs/openapi.json`.
