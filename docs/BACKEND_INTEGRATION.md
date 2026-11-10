# Backend integration audit

Audited on 2026-11-11 against `doctor-tracker-server`. The implementation is the
source of truth.

## Runtime and authorization

- Requested API base: `http://localhost:8000/api/v1`. Backend defaults to port
  5000, so its local environment must set `PORT=8000`.
- CORS accepts exactly `CORS_ORIGIN`, credentials, and GET/POST/PATCH/DELETE.
- Every unsafe request needs the exact configured Origin. Except login, it also
  needs the CSRF cookie value in `X-CSRF-Token`.
- All resource endpoints require authentication. Doctor/patient mutations require
  `ADMIN`; `USER` is read-only.

## Cookies and the Next.js boundary

| Cookie | HTTP-only | Backend path | Purpose |
| --- | --- | --- | --- |
| `doctor_tracker_access` | yes | `/api/v1` | 15-minute JWT |
| `doctor_tracker_refresh` | yes | `/api/v1/auth` | rotating opaque token |
| `doctor_tracker_csrf` | no | `/api/v1` | double-submit token |

Cookies use high priority and configured SameSite/Secure flags. A normal session
has a 24-hour absolute backend lifetime; Remember Me persists cookies within a
30-day absolute lifetime. Refresh rotation does not extend that boundary.

These paths do not cover Next.js pages, and a browser cannot apply `Set-Cookie`
from a server-to-server fetch. Login, refresh, and logout must parse backend
headers in a cookie-mutating Server Action and synchronize root-path frontend
cookies with equivalent flags and exact expiry. Server Components can forward
those cookies but cannot rotate them while rendering.

Design consequences:

- Raw token values never cross a Client Component boundary.
- Reads forward only known cookies and use `cache: "no-store"`.
- An expired render-time read returns a reauthentication state; a minimal client
  coordinator invokes one refresh action, then refreshes navigation.
- Refresh coordination is per browser flow, never a process-global token/promise
  cache. The original request is retried once only.
- Logout forwards refresh/CSRF cookies plus Origin/header, then clears local
  mirrors even if backend revocation fails.

## Contracts

Success is `{ success: true, message, data }`; lists add
`meta: { page, limit, total, totalPages }`. Errors are
`{ success: false, message, error: { code, details? } }`. Tokens never appear in
JSON. Common statuses are 400, 401, 403, 404, 429, and 500. Users expose `id`,
`name`, `email`, and `role` (`ADMIN | USER`).

| Method | Path | Response/constraint |
| --- | --- | --- |
| POST | `/auth/login` | user; trusted Origin; optional `rememberMe` |
| POST | `/auth/refresh` | user; refresh+CSRF; rotates all cookies |
| GET | `/auth/me` | `data.user` |
| POST | `/auth/logout` | idempotent, `data: null`, clears cookies |
| GET/POST | `/doctors` | list directly in `data`; create in `data.doctor` |
| GET | `/doctors/:id` | `data.doctor` |
| GET/POST | `/doctors/:doctorId/patients` | nested list/create |
| DELETE | `/doctors/:doctorId/patients/:patientId` | association required |
| GET | `/patients` | list directly in `data` |
| GET/PATCH/DELETE | `/patients/:id` | detail/update/delete |
| GET | `/dashboard/summary` | `data.summary` |
| GET | `/dashboard/patients-by-doctor` | `data.doctors`, including zero |
| GET | `/dashboard/trends` | `data.trends`, optional inclusive dates |

Doctors require name, specialization, hospital, phone, and email. Patients require
name and condition; phone, email, integer age 0–150, gender
(`MALE | FEMALE | OTHER`), and address are optional. Doctor assignment comes only
from the create URL and is immutable.

Both lists accept page 1+, limit 1–100, search, inclusive dates, and asc/desc.
Doctor exact filters are specialization/hospital and sort fields are name,
specialization, hospital, createdAt. Patient exact filters are doctorId/condition
and sort fields are name, condition, age, createdAt.

## Next.js 16 checks

`cookies()` is async; cookie writes are restricted to Server Functions; the
current request interception convention is `proxy.ts`. Proxy will only perform
cookie-presence redirects while protected layouts perform authoritative API
checks.
