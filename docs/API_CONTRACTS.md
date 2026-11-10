# API contract inventory

This inventory maps every frontend-consumed endpoint to its backend route,
validation, controller envelope, and service output. It was reconciled against
`doctor-tracker-server` on 2026-11-11. Dates cross the JSON boundary as ISO 8601
strings even though backend service types use `Date`.

## Shared contracts

- MongoDB IDs are 24 hexadecimal characters.
- Success: `{ success: true, message: string, data: T }`.
- Lists: the success fields plus `meta: { page, limit, total, totalPages }`, with
  the item array directly in `data`.
- Failure: `{ success: false, message, error: { code, details? } }`.
- Detail/create/update endpoints wrap the entity by name in `data`.
- Delete/logout endpoints return `data: null`.
- Unknown response keys are not part of the client contract.

Entity outputs:

- User: `id`, `name`, `email`, `role` (`ADMIN | USER`).
- Doctor: `id`, `name`, `specialization`, `hospital`, `phone`, `email`, optional
  `createdBy`, `createdAt`, `updatedAt`.
- Patient: `id`, `doctorId`, `name`, `condition`, optional `phone`, `email`, `age`,
  `gender`, `address`, plus `createdAt`, `updatedAt`.

## Endpoint traceability

| Endpoint | Input validator | Controller data | Service output/schema |
| --- | --- | --- | --- |
| `POST /auth/login` | `auth.validation.ts: loginBodySchema` | `{ user }` | `auth.types.ts: SafeUser` |
| `POST /auth/refresh` | CSRF middleware + refresh cookie | `{ user }` | `auth.types.ts: SafeUser` |
| `GET /auth/me` | access cookie middleware | `{ user }` | `user.service.ts: getCurrentUser` |
| `POST /auth/logout` | CSRF middleware | `null` | `session.service.ts: logoutSession` |
| `GET /doctors` | `doctorListQuerySchema` | doctor array + meta | `doctor.service.ts: DoctorOutput` |
| `POST /doctors` | `createDoctorBodySchema` | `{ doctor }` | `doctor.service.ts: DoctorOutput` |
| `GET /doctors/:id` | `doctorIdParamsSchema` | `{ doctor }` | `doctor.service.ts: DoctorOutput` |
| `GET /doctors/:doctorId/patients` | `doctorPatientListQuerySchema` | patient array + meta | `patient.service.ts: PatientOutput` |
| `POST /doctors/:doctorId/patients` | `createPatientBodySchema` | `{ patient }` | `patient.service.ts: PatientOutput` |
| `DELETE /doctors/:doctorId/patients/:patientId` | `doctorPatientDeleteParamsSchema` | `null` | association-checked delete |
| `GET /patients` | `patientListQuerySchema` | patient array + meta | `patient.service.ts: PatientOutput` |
| `GET /patients/:id` | `patientIdParamsSchema` | `{ patient }` | `patient.service.ts: PatientOutput` |
| `PATCH /patients/:id` | `updatePatientBodySchema` | `{ patient }` | `patient.service.ts: PatientOutput` |
| `DELETE /patients/:id` | `patientIdParamsSchema` | `null` | `patient.service.ts: deletePatient` |
| `GET /dashboard/summary` | authenticated request | `{ summary }` | totals are nonnegative integers |
| `GET /dashboard/patients-by-doctor` | authenticated request | `{ doctors }` | `doctorId`, `doctorName`, `patientCount` |
| `GET /dashboard/trends` | `dashboardTrendsQuerySchema` | `{ trends }` | UTC `YYYY-MM-DD` points with counts |

## Query contracts

Doctor list accepts `search`, `specialization`, `hospital`, `createdFrom`,
`createdTo`, `page`, `limit`, `sortBy`, and `sortOrder`. Patient lists accept the
same common keys with `condition`; only the global list accepts `doctorId`.
Dashboard trends accepts `from` and `to`. Date ranges are inclusive and ordered.

Defaults are page 1, limit 10, `createdAt`, descending. Doctor sort fields are
`name | specialization | hospital | createdAt`; patient sort fields are
`name | condition | age | createdAt`. Limits are 1–100.

## Client schema/fixture mapping

Task 09 implements these named Zod contracts and fixtures:

- `userSchema`, `doctorSchema`, `patientSchema`, and their input schemas.
- `userResponseSchema`, entity response schemas, paginated list schemas, and
  `nullResponseSchema`.
- `dashboardSummaryResponseSchema`, `patientsByDoctorResponseSchema`, and
  `dashboardTrendsResponseSchema`.
- `apiErrorResponseSchema` with opaque `details` retained only for server-side
  field-error normalization.

Task 10 must accept a response schema per request and reject any payload that does
not match this inventory before returning it to a service or action.
