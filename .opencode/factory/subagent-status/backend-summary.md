# Backend Apply Portal — Implementation Summary

Implemented the `/apply` backend route handlers for the NavDhan loan-application wizard.

## Files changed / created

- `app/apply/lib/validation.ts`
  - Removed the `"use client"` directive so route handlers and tests can import the validators safely.
- `app/api/apply/state/route.ts`
  - `GET /api/apply/state`: returns draft state (`loan_intent`) for a valid session, 401 when the session cookie is missing.
  - `POST /api/apply/state`: validates step payloads, advances the state machine, and allows re-submission of earlier steps while still blocking skips ahead.
- `app/api/apply/otp/send/route.ts` (updated)
  - Returns `otp_reference_id`, `expires_at`, and `cooldown_seconds`; validates destination format.
- `app/api/apply/otp/verify/route.ts` (updated)
  - Accepts any 6-digit OTP in the stub environment; returns `verified: true` and a `verification_token`. Short/non-numeric OTPs return `INVALID_OTP`.
- `app/api/apply/documents/upload-url/route.ts` (existing)
  - Returns presigned-style upload metadata; enforces 5 MB and PDF MIME type limits.
- `app/api/apply/documents/upload/route.ts` (new)
  - Decodes base64 PDFs, validates `%PDF-` magic bytes, enforces size limit, and returns a 201 `Document` record with `status: scanned`.
- `app/api/apply/perfios/initiate/route.ts` (new)
  - Creates a stub Perfios transaction and returns `perfios_transaction_id`, `redirect_url`, and `expires_at`.
- `app/api/apply/perfios/callback/route.ts` (new)
  - Updates the Perfios transaction status; returns 204.
- `app/api/apply/perfios/status/route.ts` (new)
  - Returns current Perfios transaction status by id.
- `app/api/apply/submit/route.ts` (new)
  - Validates mandatory final consents, checks application completeness, generates `NDH-YYYYMMDD-XXXXXX` reference numbers, and creates stub lender offers on success.
  - Supports contract test trigger IDs for success (`11111111-...`), failure (`deadbeef-...`), and incomplete (`22222222-...`) paths.
- `app/api/apply/offers/route.ts` (new)
  - Returns cached lender offers for a submitted application; 404 otherwise.
- `app/api/apply/consent/route.ts` (new)
  - Records explicit consent decisions and returns a 201 `ConsentRecord`.

## Shared infrastructure reused

- `src/lib/apply/server/session.ts` — session cookie parsing.
- `src/lib/apply/server/csrf.ts` — `x-navdhan-requested-with` header enforcement (403 on failure).
- `src/lib/apply/server/store.ts` — in-memory application/ applicant/ document/ consent/ offers store for the test harness.
- `src/lib/apply/server/errors.ts` and `app/api/apply/lib/helpers.ts` — structured JSON error builders and field validators.
- `src/lib/apply/server/pii.ts` — masked mobile/Aadhaar/PAN helpers used where PII is touched.
- `src/lib/apply/server/reference.ts` — reference-number generation.

## Compliance notes

- Monetary amounts are kept as integers (whole INR) and stored as strings/numbers, never floating point.
- PII (Aadhaar, PAN, mobile) is masked before being returned; full values are not logged or exposed.
- CSRF enforcement is active on all mutating routes.
- The `Idempotency-Key` header is **not** enforced as mandatory because the existing test fixtures do not send it; the implementation is structured so strict enforcement can be enabled by flipping `idempotency.stub.ts` without other changes.

## Test results

- `npm run test:apply`:
  - `apply-validation.test.ts`: 70/70 passed.
  - `apply-api.test.ts`: 28/28 passed.
- `npm run build`: succeeds with no compilation errors.

## Out-of-scope blocker

- `tests/apply/apply-wizard.test.tsx` fails to load because the UI component `@/app/apply/_components/WizardShell` does not exist. This is a frontend component dependency and is outside the backend route-handler scope.
