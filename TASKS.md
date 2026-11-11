# Doctor Tracker Client Roadmap

Complete tasks sequentially, verify, update this file, make the specified commit,
and stop. “Accept” is the task's acceptance criteria.

## Phase 1 — Foundation

- [x] **01 Inspect repositories.** Audit actual API/auth/Next.js constraints and add project guidance. **Accept:** implementation-backed audit; backend untouched. **Commit:** `docs: audit frontend integration requirements`.
- [x] **02 Configure Next.js and TypeScript.** Tighten framework/compiler and scripts. **Accept:** strict typecheck passes. **Commit:** `chore: configure nextjs and typescript`.
- [x] **03 Configure code quality.** Establish Biome lint/format rules. **Accept:** both checks pass. **Commit:** `chore: configure code quality tooling`.
- [x] **04 Configure Tailwind and shadcn/ui.** Add aliases, utilities, and base primitive. **Accept:** accessible primitive builds. **Commit:** `chore: configure ui tooling`.
- [x] **05 Configure theme and typography.** Add semantic clinical tokens, focus, and motion rules. **Accept:** essential contrast is AA. **Commit:** `style: add clinical design tokens`.
- [x] **06 Configure environment.** Validate server-only `API_BASE_URL` and add safe example. **Accept:** invalid config fails clearly; no secret/public API variable. **Commit:** `chore: validate server environment`.
- [x] **07 Configure tests.** Add Bun-compatible unit/component setup. **Accept:** smoke test passes. **Commit:** `test: configure frontend test infrastructure`.

## Phase 2 — API integration

- [x] **08 Finalize contract inventory.** Reconcile audit with schemas/fixtures. **Accept:** every consumed endpoint is traceable. **Commit:** `docs: finalize api contract inventory`.
- [x] **09 Define API types/schemas.** Add Zod models for envelopes, entities, inputs, and analytics. **Accept:** valid/invalid fixtures pass. **Commit:** `feat: define validated api contracts`.
- [x] **10 Create server API client.** Add server-only URL, timeout, parsing, cookie forwarding, and request policy. **Accept:** GET and unsafe behavior tested. **Commit:** `feat: add server api client`.
- [x] **11 Normalize API errors.** Map validation/auth/forbidden/not-found/rate/network/timeout safely. **Accept:** no internals leak. **Commit:** `feat: normalize api errors`.
- [x] **12 Add query utilities.** Serialize only supported filters/dates/sort/page. **Accept:** encoding and invalid values tested. **Commit:** `feat: add api query utilities`.
- [x] **13 Add API integration tests.** Cover fetch, timeout, cookies, validation, retry limits. **Accept:** deterministic suite passes. **Commit:** `test: cover api integration layer`.

## Phase 3 — Authentication

- [x] **14 Implement cookie synchronization.** Mirror only known cookies at root with preserved flags/expiry. **Accept:** session, persistent, clear tests; tokens server-only. **Commit:** `feat: synchronize authentication cookies`.
- [x] **15 Implement login action.** Validate, send Origin, require ADMIN, sync cookies, return safe result. **Accept:** invalid role/credentials/backend cases tested. **Commit:** `feat: add login server action`.
- [x] **16 Build login form.** Responsive split UI using `useFormik`, validation, visibility, pending/errors. **Accept:** labelled and keyboard/mobile accessible. **Commit:** `feat: build login experience`.
- [x] **17 Support Remember Me.** Wire boolean without changing backend lifetime. **Accept:** persistent/session cookie cases tested. **Commit:** `feat: support remembered sessions`.
- [x] **18 Implement session retrieval.** Validated no-store `/auth/me` with request dedupe. **Accept:** valid/missing/expired cases safe. **Commit:** `feat: add server session retrieval`.
- [x] **19 Protect layout.** Authoritatively require ADMIN and safe return paths. **Accept:** unauthenticated/non-admin content blocked. **Commit:** `feat: protect authenticated routes`.
- [x] **20 Add Proxy redirects.** Next.js 16 optimistic cookie redirects only. **Accept:** assets excluded; layout stays authoritative. **Commit:** `feat: add authentication proxy redirects`.
- [x] **21 Implement refresh.** Cookie-mutating action, exact rotation, one retry, revoked handling, render coordinator. **Accept:** recovery has no loops. **Commit:** `feat: implement session refresh`.
- [x] **22 Coordinate concurrent refresh.** Prevent duplicate rotation without cross-user globals. **Accept:** concurrent simulation yields one rotation. **Commit:** `feat: coordinate concurrent token refresh`.
- [x] **23 Implement logout.** Revoke with CSRF, clear mirrors, invalidate, redirect. **Accept:** idempotent and tested. **Commit:** `feat: add secure logout`.
- [x] **24 Add auth integration tests.** Cover login, remember, guards, CSRF, rotation, concurrency, logout. **Accept:** flows pass without token exposure. **Commit:** `test: cover authentication flows`.

## Phase 4 — Application shell

- [x] **25 Create dashboard layout.** Add semantic responsive shell and skip link. **Accept:** Server Component layout supports nav/content. **Commit:** `feat: create application shell`.
- [x] **26 Create sidebar.** Brand, real routes, active state, collapse. **Accept:** keyboard/narrow desktop work. **Commit:** `feat: add desktop sidebar`.
- [x] **27 Create top navbar.** Page context and sidebar control only. **Accept:** responsive semantic heading/breadcrumb area. **Commit:** `feat: add top navigation`.
- [x] **28 Create profile dropdown.** Safe identity and logout. **Accept:** keyboard/focus behavior passes. **Commit:** `feat: add profile menu`.
- [x] **29 Create mobile navigation.** Accessible Sheet with active/close behavior. **Accept:** focus trap and touch targets pass. **Commit:** `feat: add mobile navigation`.
- [x] **30 Add headers/breadcrumbs.** Shared list/detail/form primitives. **Accept:** responsive and semantic. **Commit:** `feat: add page navigation primitives`.

## Phase 5 — Dashboard

- [x] **31 Integrate summary.** Validated no-store service. **Accept:** valid/auth/error cases tested. **Commit:** `feat: integrate dashboard summary`.
- [x] **32 Create metric cards.** Render real totals. **Accept:** zero differs from failure. **Commit:** `feat: add dashboard metrics`.
- [x] **33 Integrate patients-per-doctor.** Validated analytics service. **Accept:** zero-patient doctors retained. **Commit:** `feat: integrate doctor analytics`.
- [x] **34 Create doctor chart.** Small Recharts boundary plus accessible summary. **Accept:** labels, zero, resize, alternative pass. **Commit:** `feat: chart patients by doctor`.
- [x] **35 Integrate trends.** Validate URL date range and UTC payload. **Accept:** invalid range never reaches backend. **Commit:** `feat: integrate dashboard trends`.
- [x] **36 Create trend charts.** Real series and URL range controls. **Accept:** timezone and empty ranges correct. **Commit:** `feat: chart dashboard trends`.
- [x] **37 Add dashboard states.** Independent streaming skeleton/empty/error states. **Accept:** one section failure does not block all. **Commit:** `feat: add dashboard feedback states`.

## Phase 6 — Doctors

- [x] **38 Integrate doctor listing.** Parse URL and fetch validated pagination. **Accept:** invalid values fall back safely. **Commit:** `feat: integrate doctor listing`.
- [x] **39 Create doctors table.** Responsive accessible table/cards with detail links. **Accept:** mobile usable. **Commit:** `feat: add doctors table`.
- [x] **40 Add doctor search.** URL search without client fetching. **Accept:** reset page, clear, history work. **Commit:** `feat: add doctor search`.
- [x] **41 Add doctor filters.** Specialization/hospital/dates/sort URL controls. **Accept:** combinations match API. **Commit:** `feat: add doctor filters`.
- [x] **42 Add doctor pagination.** Accessible metadata-driven links. **Accept:** boundaries/zero safe. **Commit:** `feat: add doctor pagination`.
- [x] **43 Build doctor form.** Formik/shared Zod for supported fields. **Accept:** mobile, focus, errors, pending pass. **Commit:** `feat: build doctor form`.
- [x] **44 Implement create doctor action.** Revalidate input/auth/ADMIN, CSRF, errors, paths. **Accept:** success/field failures tested. **Commit:** `feat: create doctors through server action`.
- [x] **45 Implement doctor details.** Validated ID, profile, count/list, not-found. **Accept:** invalid/missing/valid render correctly. **Commit:** `feat: add doctor details page`.
- [x] **46 Integrate doctor patients.** Nested URL search/filter/sort/page service. **Accept:** independent meta/empty state. **Commit:** `feat: integrate doctor patient listing`.
- [x] **47 Add doctor patient actions.** ADMIN add/remove with confirmation/revalidation. **Accept:** no reassignment feature. **Commit:** `feat: add doctor patient actions`.

## Phase 7 — Patients

- [x] **48 Integrate patient listing.** Validated no-shared-cache global listing. **Accept:** invalid filters safe. **Commit:** `feat: integrate patient listing`.
- [x] **49 Create patients table.** Responsive rows/cards and real actions. **Accept:** optional fields and mobile safe. **Commit:** `feat: add patients table`.
- [x] **50 Add patient search.** URL state with reset/clear/history/no-JS. **Accept:** all flows work. **Commit:** `feat: add patient search`.
- [x] **51 Add patient filters.** Real condition/doctor/date/sort controls. **Accept:** API encoding correct. **Commit:** `feat: add patient filters`.
- [x] **52 Add patient pagination.** Metadata URL controls retaining filters. **Accept:** boundaries pass. **Commit:** `feat: add patient pagination`.
- [x] **53 Build add patient form.** Formik supported fields in fixed doctor context. **Accept:** optionals/age normalize. **Commit:** `feat: build patient creation form`.
- [x] **54 Implement create patient action.** Validate ADMIN/doctor/input, CSRF, revalidate lists/counts. **Accept:** typed result cases tested. **Commit:** `feat: create patients through server action`.
- [x] **55 Implement patient details.** Server view with associated doctor/not-found/actions. **Accept:** optional/missing data explicit. **Commit:** `feat: add patient details page`.
- [x] **56 Build edit patient form.** Formik mutable fields only. **Accept:** dirty/clearing/accessibility/pending pass. **Commit:** `feat: build patient edit form`.
- [x] **57 Implement update action.** Validate changes/ADMIN/CSRF and revalidate. **Accept:** doctor ID cannot be submitted. **Commit:** `feat: update patients through server action`.
- [x] **58 Add delete confirmation.** Accessible named destructive dialog. **Accept:** cancel/focus/keyboard/duplicate prevention pass. **Commit:** `feat: add patient delete confirmation`.
- [x] **59 Implement delete action.** Validate/admin/CSRF, revalidate, safe redirect. **Accept:** missing/repeat/error clear. **Commit:** `feat: delete patients through server action`.
- [x] **60 Implement nested removal.** Use doctor-scoped delete and association error. **Accept:** all affected views revalidate. **Commit:** `feat: remove patients from doctor context`.

## Phase 8 — Quality

- [x] **61 Add shared skeletons.** Match route shapes with reduced motion. **Accept:** loading avoids major shift. **Commit:** `feat: add shared loading skeletons`.
- [x] **62 Add error/empty states.** Root and shared safe retry/navigation. **Accept:** no internals and actions work. **Commit:** `feat: add application feedback states`.
- [x] **63 Review accessibility.** Audit/fix semantics, keyboard, focus, announcements, contrast, charts, motion. **Accept:** automated/manual findings pass. **Commit:** `fix: improve application accessibility`.
- [x] **64 Review mobile.** Audit nav, tables, forms, dialogs, filters. **Accept:** no overflow/unreachable action. **Commit:** `fix: refine responsive layouts`.
- [x] **65 Review caching.** Audit isolation, no-store, dedupe, revalidation. **Accept:** no cross-user data and fresh mutations. **Commit:** `fix: harden data caching strategy`.
- [x] **66 Optimize boundaries.** Reduce client JS, waterfalls, rerenders, chart cost. **Accept:** main pages remain server-rendered; build evidence recorded. **Commit:** `perf: optimize server component boundaries`.
- [ ] **67 Review security/auth.** Threat-model cookies, CSRF, redirects, refresh, roles, validation, leakage. **Accept:** findings fixed with regressions. **Commit:** `fix: harden frontend security`.
- [ ] **68 Add E2E tests.** Cover auth, navigation, doctor creation, patient CRUD, filters, denial. **Accept:** deterministic controlled-backend suite passes. **Commit:** `test: add administrative end-to-end flows`.
- [ ] **69 Verify production build.** Run and fix full type/lint/test/build. **Accept:** all pass cleanly. **Commit:** `chore: verify production build`.
- [ ] **70 Finalize documentation.** Setup, env, backend, scripts, architecture, auth, tests, limitations. **Accept:** new contributor can run/verify without secrets. **Commit:** `docs: finalize client documentation`.
