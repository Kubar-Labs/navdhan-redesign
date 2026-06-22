# Apply Portal — Backend Component Design Document

> **Scope:** Unit 3 (`/apply`) backend route handlers for the NavDhan loan-application wizard.  
> **Branch:** `factory/navdhan-redesign/apply/backend`  
> **Source of truth:** `.opencode/factory/apply-contract.yaml` (v1.1.0) and `.opencode/factory/db-schema.yaml` (v1.1.0).  
> **Output type:** Design doc only — no production code is committed in this step.

---

## 1. Goals & constraints

- Implement the public REST surface described in `apply-contract.yaml` as Next.js 15 App Router Route Handlers.
- Enforce the `ApplicationWizard` state machine: linear step progression, no skipping, idempotent step upserts.
- Keep all business logic out of route handlers; route files are thin adapters that delegate to services/repositories.
- Satisfy the fintech-compliance rules from the factory global rules: idempotency for mutations, explicit transactions/row locking, no `float` for money, PII masked in responses and logs.
- Make the implementation testable with the existing Vitest suite (`tests/apply/apply-api.test.ts`, `tests/apply/apply-validation.test.ts`).

### Tech assumptions

- Next.js 15 App Router + TypeScript strict mode.
- Route handlers receive a Web-API `Request` and return a native `Response`.
- Cookies are read from the `Cookie` header directly so tests can call handlers outside a real Next.js request context.
- Server-side validation uses a shared `app/apply/lib/validation.ts` module (also imported by tests) plus per-route Zod schemas for shape validation.
- Persistence is exposed behind a repository interface.  For the GREEN/TDD phase an in-memory repository is sufficient to make the existing tests pass; production plugs in a PostgreSQL repository that follows `db-schema.yaml`.

---

## 2. File layout

```text
app/api/apply/state/route.ts                 # GET /api/apply/state, POST /api/apply/state
app/api/apply/otp/send/route.ts              # POST /api/apply/otp/send
app/api/apply/otp/verify/route.ts            # POST /api/apply/otp/verify
app/api/apply/documents/upload-url/route.ts  # POST /api/apply/documents/upload-url
app/api/apply/documents/upload/route.ts      # POST /api/apply/documents/upload
app/api/apply/perfios/initiate/route.ts      # POST /api/apply/perfios/initiate
app/api/apply/perfios/callback/route.ts      # POST /api/apply/perfios/callback
app/api/apply/perfios/status/route.ts        # GET /api/apply/perfios/status
app/api/apply/submit/route.ts                # POST /api/apply/submit
app/api/apply/offers/route.ts                # GET /api/apply/offers
app/api/apply/consent/route.ts               # POST /api/apply/consent

app/apply/lib/
  validation.ts           # Shared field validators used by routes and UI tests
  session.ts              # Cookie parsing, session-id extraction, expiry checks
  csrf.ts                 # CSRF custom header enforcement
  rate-limit.ts           # Lightweight token-bucket rate-limit stubs
  pii.ts                  # Masking, hashing, encryption helpers
  repository.ts           # Application / applicant / document / consent / offer store
  idempotency.ts          # Idempotency-key cache / deterministic-key helper
  errors.ts               # Common error response builder

app/apply/services/
  otp-service.ts          # OTP stub provider
  perfios-service.ts      # Perfios stub provider
  document-service.ts     # Presigned URL + base64 upload + scan stub
  submission-service.ts   # Final validation, reference generation, lender matching stub
```

---

## 3. Shared infrastructure

### 3.1 Session cookie

- **Name:** `__Host-nd_session`
- **Attributes:** `HttpOnly; Secure; SameSite=Lax; Path=/`
- **Value:** Opaque session token (UUID).  Sent on every request via the `Cookie` header.
- **Expiry:** 30 minutes of inactivity, refreshed on every successful request.
- **Lookup:** `applications.session_id` stores a SHA-256 hash of the cookie value; the cookie value itself is never persisted.
- **Missing cookie handling:**
  - `GET /api/apply/state` returns **`401 SESSION_INVALID`** when the cookie is absent (per `apply-api.test.ts`).
  - All mutating routes return **`401 SESSION_INVALID`** when the cookie is absent.

> **Note:** The contract says `GET /api/apply/state` creates a draft if none exists.  The test suite requires a session cookie to be present before any portal request.  The implementation therefore treats the cookie as a mandatory prerequisite; the route creates a draft only when a valid cookie is present but no application exists.

### 3.2 CSRF enforcement

- **Header:** `x-navdhan-requested-with: apply`
- **Applies to:** `POST`, `PUT`, `PATCH` on `/api/apply/*`.
- **Missing/invalid header:** return **`403 FORBIDDEN`** with body `{ "error": "CSRF_INVALID" }`.
- `GET` routes are read-only and do not require the header.

### 3.3 Rate limiting (lightweight stubs)

Stored in process memory (`Map`).  Production must be replaced by Redis.

| Scope | Target | Limit | Window | Key |
|---|---|---|---|---|
| `global` | all `/api/apply/*` | 100 | 60 s | path (or global counter) |
| `per_ip` | `POST /api/apply/otp/send` | 10 | 60 s | hash(client IP) |
| `per_session` | `POST /api/apply/otp/verify` | 5 | 300 s | session hash |

- On breach return **`429 RATE_LIMITED`** with `retry_after_seconds`.
- For the test suite the limits are high enough that normal test runs never exhaust them.

### 3.4 Validation & sanitization

All string fields are:

1. Trimmed of leading/trailing whitespace.
2. Stripped of HTML, control characters, zero-width joiners.

Specific normalizations:

| Field | Rule |
|---|---|
| `mobile_number` | strip non-digits, reject country prefix, must be 10 digits starting with 6–9 |
| `pan_number` | uppercase-on-normalize; validate `[A-Z]{5}[0-9]{4}[A-Z]` |
| `gstin` | uppercase; validate 15-char GSTIN regex |
| `aadhaar_number` | 12 digits only; never returned full |
| `aadhaar_otp` | 6 digits |
| `email` | lower-case; max 255; RFC-ish regex |

Validation helpers live in `app/apply/lib/validation.ts` so `apply-validation.test.ts` passes and routes reuse them.

### 3.5 PII handling

| Field | At-rest storage | Returned to client |
|---|---|---|
| `full_name` | encrypted (`applicants.full_name`) | not in MVP state summary |
| `mobile_number` | SHA-256 hash + encrypted ciphertext + last 4 | masked `91-XXXXXX{last4}` |
| `email` | SHA-256 hash + encrypted ciphertext | not returned full (future: masked prefix) |
| `aadhaar_number` | SHA-256 hash + last 4 only; full never persisted | masked `XXXX XXXX {last4}` |
| `pan_number` | SHA-256 hash + encrypted ciphertext + masked form | masked `ABCXX***X` |
| `gstin` | plain text (regulatory required) | plain text |
| Documents | encrypted object-store path + KMS key id | `document_id`, `file_name`, `status` only |

- All logs and error traces replace full PII with masked values or `[REDACTED]`.
- Encryption is behind a `PiiVault` interface.  In the MVP stub it may use AES-256-GCM with a key derived from `APPLY_ENCRYPTION_KEY` (base64) or a deterministic placeholder in tests.

### 3.6 Idempotency

Factory fintech rules require an `Idempotency-Key` header for all mutating routes.
For contract v1.1.0 it is **mandatory**.

1. Header: `Idempotency-Key: <uuid-v4>` (lowercase, 36 chars).
2. Server computes `key_hash = SHA-256(scope + ":" + raw_key)`. Scope is the hashed session id for session-bound routes, or webhook sender id for `perfios_callback`.
3. `request_path` and `payload_hash` are recorded together with the HTTP response status/body in the `idempotency_keys` table.
4. Replays with the same key + scope return the cached response for **10 minutes**  (`IDEMPOTENCY_TTL_SECONDS`).
5. If the same key is reused with a different payload, return `409 IDEMPOTENCY_KEY_CONFLICT`.
6. Missing header returns `400 IDEMPOTENCY_KEY_REQUIRED`.
7. Distinct keys executing the same mutation still use row-level locking / per-application mutexes to avoid races.

### 3.7 Transactions & row locking

All mutations that change `applications`, `applicants`, `documents`, `consents`, or `lender_offers` are wrapped in an explicit unit of work.

Repository interface:

```ts
interface ApplyTransaction {
  lockApplication(id: string): Promise<ApplicationRow | null>;
  lockApplicant(applicationId: string): Promise<ApplicantRow | null>;
  updateApplication(...): Promise<void>;
  insertConsent(...): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
}
```

- Postgres implementation: `BEGIN; SELECT ... FOR UPDATE` on `applications` and `applicants` before updates.
- In-memory implementation: a per-application `Mutex`/`Promise` queue to serialize concurrent mutations for the same application during tests.

### 3.8 Test harness / in-memory repository

To make `tests/apply/*.test.ts` pass without a real database, the repository is
exposed as a TypeScript interface and instantiated via an environment-driven
factory.  In test mode the factory returns an **in-memory store** backed by
plain Maps/arrays; in production it returns a **Drizzle/PostgreSQL** implementation.

- `app/apply/lib/repository.ts` — interface + factory function.
- `app/apply/lib/repository-memory.ts` — in-memory implementation that mirrors
  `db-schema.yaml` tables (applications, applicants, documents, consents,
  lender_offers, application_events, otp_attempts, idempotency_keys).
- `app/apply/lib/repository-pg.ts` — production Drizzle implementation
  (will be stubbed enough in the backend implementation to satisfy tests).
- Route handlers import the factory, not a concrete store.  Tests can also
  import `createMemoryRepository()` and reset it between test cases.

All route handler unit tests construct a `Request` with the required cookies
and headers, call the exported `POST`/`GET` handlers, and assert on the returned
`Response`.  No Next.js server or real Postgres is required for the initial
TDD cycle.

---

## 4. Route handler design

All routes return JSON with `Content-Type: application/json`.  Errors always include `detail` (factory rule) and, where contract specifies, a machine-readable `error` code.

### 4.1 `GET /api/apply/state`

**Headers:** session cookie required.  
**Query:** `locale?: en|hi|bn|te|mr|ta|kn|ml` (default `en`).

**Logic:**

1. Parse and validate session cookie.
2. Look up `applications` by hashed session id.
3. If no application, create a new draft (`status=draft`, `current_step=loan_intent`) and a corresponding empty `applicants` row inside a transaction.
4. Refresh `last_activity_at` and cookie `expires_at`.
5. Build `ApplicationState` response with masked PII and document metadata.

**Response 200:** `ApplicationState` schema.

**Response 401:** `{ "error": "SESSION_INVALID", "message_i18n_key": "apply.errors.sessionExpired" }`.

**Response 429:** `{ "error": "RATE_LIMITED", "retry_after_seconds": n }`.

### 4.2 `POST /api/apply/state`

**Headers:** session cookie + CSRF header + required `Idempotency-Key`.  
**Body:**

```ts
{
  application_id?: string;      // UUID
  current_step: ApplicationStep; // one of the 8 editable steps
  payload: StepPayload;
  locale?: SupportedLocale;     // default en
}
```

**Step payload shapes:**

| `current_step` | Required payload fields |
|---|---|
| `loan_intent` | `loan_amount`, `tenure_months`, `purpose`, `referral_code?` |
| `personal_contact` | `full_name`, `mobile_number`, `email`, `business_pin_code` |
| `aadhaar_verification` | `aadhaar_number`, `aadhaar_otp` |
| `pan_verification` | `pan_number` |
| `gst_verification` | `gstin?`, `gstin_skipped: boolean` |
| `itr_upload` | `itr_document_id` |
| `bank_statements` | `perfios_transaction_id`, `statement_months` |
| `review_submit` | `consent_marketing`, `consent_terms`, `consent_privacy`, `consent_credit_bureau` |

**Logic:**

1. CSRF + session checks.
2. Resolve application (by `application_id` or by session hash); create new draft if none exists.
3. **Transition check:** `current_step` must equal the stored `current_step` OR be a re-submission of the same step.  Otherwise return **`409 INVALID_TRANSITION`** with `current_step` and `expected_step`.
4. Validate payload using shared validators + Zod schema.
5. On validation failure return **`400 VALIDATION_ERROR`** with `field_errors` array.
6. Apply step-specific side effects:
   - `aadhaar_verification`: record `aadhaar_hash`, last 4, verified flag.
   - `pan_verification`: record PAN hash, encrypted value, masked form, verified flag.
   - `gst_verification`: record `gstin` or `gstin_skipped=true`.
   - `itr_upload`: verify `documents` row exists for `itr_document_id`.
   - `bank_statements`: verify Perfios transaction exists and is `success`/`partial`.
   - `review_submit`: record final consent flags (but does not submit yet).
7. Compute `next_step` from state-machine config and update `applications.current_step`.
8. Append an `application_events` audit row: `step_transition` with `{ from, to }`.
9. Commit transaction; return `ApplicationState`.

**Idempotency:** repeating the same request while the application is still on the same step returns the same `ApplicationState` without a validation error.

### 4.3 `POST /api/apply/otp/send`

**Body:**

```ts
{
  channel: "sms" | "aadhaar";
  destination: string;  // 10-digit mobile for sms, 12-digit Aadhaar for aadhaar
  purpose: "aadhaar_verification" | "mobile_verification";
}
```

**Logic:**

1. CSRF + session + per-destination rate limit.
2. Validate `destination` format by `channel`.
3. Resolve application from session.
4. Create `otp_attempts` row:
   - `otp_reference_id`: UUIDv4
   - `destination_hash`: SHA-256(normalized destination)
   - `expires_at`: now + 5 min
   - `attempt_count`: 0
5. Stub adapter logs a masked destination (no real SMS/Aadhaar gateway call).

**Response 200:** `{ otp_reference_id, expires_at, cooldown_seconds: 60 }`.

**Response 400:** `{ error: "INVALID_DESTINATION", field_errors: [...] }`.

**Response 429:** `{ error: "RATE_LIMITED", retry_after_seconds: n }`.

### 4.4 `POST /api/apply/otp/verify`

**Body:**

```ts
{
  otp_reference_id: string;
  otp: string;          // ^\d{6}$
  purpose: "aadhaar_verification" | "mobile_verification";
}
```

**Logic:**

1. CSRF + session + per-session rate limit.
2. Look up `otp_attempts` by `otp_reference_id` for this application.
3. If expired return **`410 OTP_EXPIRED`**.
4. Increment `attempt_count`; if it exceeds 3 return **`400 INVALID_OTP`** with `remaining_attempts: 0`.
5. Stub provider accepts any 6-digit `otp` as valid.
6. On success mark row verified and return a short-lived `verification_token` (UUID, 10 min TTL in-memory).

**Response 200:** `{ verified: true, verification_token }`.

**Response 400:** `{ error: "INVALID_OTP", remaining_attempts, message_i18n_key: "apply.errors.invalidOtp" }`.

**Response 410:** `{ error: "OTP_EXPIRED" }`.

### 4.5 `POST /api/apply/documents/upload-url`

**Body:**

```ts
{
  document_type: "itr" | "bank_statement" | "gst_return" | "other";
  file_name: string;          // max 255 chars
  file_size_bytes: number;    // max 5_242_880
  mime_type: "application/pdf";
  financial_year?: string;     // e.g. "2024-25", required for itr/gst_return
}
```

**Logic:**

1. CSRF + session.
2. Validate `mime_type` and `file_size_bytes`.
3. If `file_size_bytes > 5_242_880` return **`413 FILE_TOO_LARGE`** with `max_size_bytes: 5242880`.
4. If `document_type` in `itr` / `gst_return` and no `financial_year`, return `400 VALIDATION_ERROR`.
5. Create `documents` row with `status=pending`, encrypted `storage_path` placeholder.
6. Generate a stub presigned URL (signed with `APPLY_UPLOAD_SECRET`) pointing at `PUT /api/apply/documents/upload/{document_id}?token={signed_token}`.

**Response 200:** `{ document_id, upload_url, upload_method: "PUT", expires_at, public_url_after_upload: null }`.

### 4.6 `POST /api/apply/documents/upload`

**Body:**

```ts
{
  document_type: "itr" | "bank_statement" | "gst_return" | "other";
  file_name: string;
  mime_type: "application/pdf";
  base64_content: string;
  financial_year?: string;
}
```

**Logic:**

1. CSRF + session.
2. If `mime_type !== "application/pdf"` return **`415 UNSUPPORTED_MEDIA_TYPE`**.
3. Decode `base64_content`; fail gracefully on bad base64 → `400 VALIDATION_ERROR`.
4. Validate PDF magic bytes (`%PDF-`).
5. Check decoded size ≤ 5 MB; reject with `413 FILE_TOO_LARGE` if exceeded.
6. Run scan stub (always `clean` in MVP; configurable failure trigger for future tests).
7. Insert `documents` row with `status=scanned`, `scan_result=clean`, encrypted storage path.

**Response 201:** `Document` schema.

### 4.7 `POST /api/apply/perfios/initiate`

**Body:**

```ts
{
  months_requested: number;      // 6–12
  preferred_bank?: string;       // max 100 chars
  consent_accepted: boolean;     // must be true
}
```

**Logic:**

1. CSRF + session.
2. Validate `months_requested` and `consent_accepted === true`.
3. Resolve application; record consent snapshot for bank-statement purpose.
4. Generate `perfios_transaction_id` (e.g. `perfios-<uuid>`).
5. Build stub redirect URL: `/apply/perfios/callback?txn={id}&token={signature}`.
6. Store transaction with `status=pending`, `expires_at` now + 30 min.

**Response 200:** `{ perfios_transaction_id, redirect_url, widget_token: null, expires_at }`.

**Response 400:** `{ error: "VALIDATION_ERROR", field_errors: [...] }`.

**Response 424:** `{ error: "PERFIOS_UNAVAILABLE" }` (triggered by a synthetic failure flag).

### 4.8 `POST /api/apply/perfios/callback`

**Headers:** optional HMAC signature stub check.  
**Body:**

```ts
{
  perfios_transaction_id: string;
  status: "success" | "failure" | "partial";
  statement_count?: number;
  month_count?: number;
  failure_reason?: string;
  metadata?: object;
}
```

**Logic:**

1. Validate HMAC signature if configured; in stub allow a test signature.
2. Update Perfios transaction store.
3. Update `applications.perfios_transaction_id` / statement status.
4. Append `perfios_callback_received` event.

**Response 204:** empty body.

**Response 400:** `{ error: "INVALID_CALLBACK" }`.  
**Response 401:** `{ error: "INVALID_SIGNATURE" }`.

### 4.9 `GET /api/apply/perfios/status`

**Query:** `perfios_transaction_id` (required).

**Logic:**

1. Session check.
2. Return stored transaction status.

**Response 200:** `{ perfios_transaction_id, status, statement_count, month_count }`.

### 4.10 `POST /api/apply/submit`

**Body:**

```ts
{
  application_id: string;
  final_consents: {
    terms: boolean;
    privacy: boolean;
    credit_bureau: boolean;
    marketing: boolean;
  };
  locale?: SupportedLocale;
}
```

**Logic:**

1. CSRF + session.
2. Lock application row and applicant row.
3. Validate required consents: **`terms`**, **`privacy`**, and **`credit_bureau` must be `true`**.  `marketing` is recorded but optional.
4. If any required consent is missing return **`400 VALIDATION_ERROR`** with `missing_consents: ["terms", ...]`.
5. Check all mandatory steps are complete; if not return **`422 INCOMPLETE_APPLICATION`** with `missing_steps`.
6. Generate `reference_number`: `NDH-{YYYYMMDD}-{6 alphanum}`.
7. Call lender-matching stub:
   - Success path: insert stub `lender_offers`, mark `submitted_success`.
   - Failure path: return **`500 SUBMISSION_FAILED`** with `support_reference` and `support_path` (one of `email`, `phone`, `chat_stub`).
8. Append `application_submitted` or `submission_failed` event.
9. Commit transaction.

**Response 200 (success):** `SubmissionResult` with `outcome: "submitted_success"` and `next_step: "offers"`.

### 4.11 `GET /api/apply/offers`

**Query:** `application_id` (required).

**Logic:**

1. Session check.
2. Verify application exists and `status === submitted`.
3. Return cached `lender_offers` rows.

**Response 200:** `{ offers: LenderOffer[] }`.

**Response 404:** `{ error: "APPLICATION_NOT_FOUND" }`.

### 4.12 `POST /api/apply/consent`

**Body:**

```ts
{
  application_id: string;
  step_id: ConsentStep;            // aadhaar_verification | itr_upload | bank_statements | review_submit
  consent_key: string;             // stable i18n key
  accepted: boolean;
  locale?: SupportedLocale;
  statement_snapshot: string;      // max 2000 chars
}
```

**Logic:**

1. CSRF + session.
2. Validate `statement_snapshot` presence and length.
3. Append row to `consents` with `client_ip_hash = SHA-256(ip)`, `user_agent_hash = SHA-256(ua)`.

**Response 201:** `ConsentRecord`.

---

## 5. State machine implementation

The wizard is a linear sequence with one explicit skip (`gst_verification`).

```ts
const STEP_ORDER: ApplicationStep[] = [
  "loan_intent",
  "personal_contact",
  "aadhaar_verification",
  "pan_verification",
  "gst_verification",
  "itr_upload",
  "bank_statements",
  "review_submit",
  "submission_result",
];
```

### Transition rules

- A `POST /api/apply/state` is accepted only when `request.current_step === stored.current_step`.
- Re-submission of the current step is allowed (idempotent upsert).
- Attempting to update a future step returns `409 INVALID_TRANSITION`.
- The server advances `current_step` to `next(step)` after successful validation.
- `gst_verification` may advance to `itr_upload` either by valid `gstin` or by `gstin_skipped=true`.
- `review_submit` advances to `submission_result` only after `/api/apply/submit` succeeds.

### Data model mapping

Each step stores its data across `applications` and `applicants` as per `db-schema.yaml`:

| Step | DB columns |
|---|---|
| `loan_intent` | `applications.loan_amount`, `tenure_months`, `purpose`, `referral_code` |
| `personal_contact` | `applicants.full_name`, `mobile_*`, `email_*`, `business_pin_code` |
| `aadhaar_verification` | `applicants.aadhaar_hash`, `aadhaar_last_four`, `aadhaar_verified`, `aadhaar_verified_at` |
| `pan_verification` | `applicants.pan_hash`, `pan_encrypted`, `pan_masked`, `pan_verified`, `pan_verified_at` |
| `gst_verification` | `applications.gstin_skipped`; `applicants.gstin` |
| `itr_upload` | `documents` row of type `itr` |
| `bank_statements` | `applications.perfios_transaction_id` + Perfios result store |
| `review_submit` | `consents` rows for `terms`, `privacy`, `credit_bureau`, `marketing` |

---

## 6. External adapters (stubs)

### OTP provider stub (`otp-service.ts`)

```ts
interface OtpProvider {
  send(destination: string, channel: OtpChannel, purpose: OtpPurpose): Promise<OtpReference>;
  verify(reference: OtpReference, otp: string): Promise<OtpVerifyResult>;
}
```

- `send` only generates metadata; no network call.
- `verify` accepts any 6-digit code and tracks attempts.

### Perfios stub (`perfios-service.ts`)

```ts
interface PerfiosProvider {
  initiate(applicationId: string, months: number, consent: boolean): Promise<PerfiosSession>;
  acceptCallback(payload: PerfiosCallback): Promise<void>;
  getStatus(txId: string): Promise<PerfiosStatus>;
}
```

- `initiate` returns a fake redirect URL.
- Sensitive Perfios payload (account numbers, full statements) is stored in the encrypted documents store, never returned to the frontend.

### Document scan stub (`document-service.ts`)

```ts
interface DocumentScanner {
  scan(buffer: Buffer): Promise<ScanResult>;  // always clean unless triggered
}
```

### Lender matching stub (`submission-service.ts`)

- For known test IDs (`11111111-...`) return success with one or more stub offers.
- For `deadbeef-dead-dead-dead-deadbeefdead` return a synthetic failure.
- For incomplete data return `INCOMPLETE_APPLICATION` (handled before stub call).

---

## 7. Idempotency & transactions

- Every mutating route **requires** the `Idempotency-Key` header (contract v1.1.0). Missing header returns `400 IDEMPOTENCY_KEY_REQUIRED`.
- The server computes `key_hash = SHA-256(scope + ":" + raw_key)` where scope is the hashed session id (or webhook sender id for `perfios_callback`). Replays with the same key + scope return the cached `(status_code, response_body)` for `IDEMPOTENCY_TTL_SECONDS` (10 minutes).
- If the same key is reused with a different payload, return `409 IDEMPOTENCY_KEY_CONFLICT`.
- Idempotency records are persisted in the `idempotency_keys` table (see `db-schema.yaml` v1.1.0) or an equivalent in-memory store during tests.
- For non-replayed mutations, the route starts a transaction, locks `applications` and `applicants`, applies the mutation, writes the idempotency cache, and commits.
- If the transaction fails, rollback and return a structured error with `support_reference` where appropriate.

---

## 8. Test alignment

| Test file | Test case | Expected handler behavior |
|---|---|---|
| `apply-api.test.ts` | `GET /api/apply/state` with cookie | Return 200 `ApplicationState` with `current_step=loan_intent` and `expires_at` |
| `apply-api.test.ts` | `GET /api/apply/state` without cookie | Return 401 `SESSION_INVALID` |
| `apply-api.test.ts` | `POST /api/apply/state` valid `loan_intent` | Advance to `personal_contact` |
| `apply-api.test.ts` | `POST /api/apply/state` invalid values | Return 400 `VALIDATION_ERROR` with `field_errors` containing the bad fields |
| `apply-api.test.ts` | `POST /api/apply/state` skip to `aadhaar_verification` | Return 409 `INVALID_TRANSITION` with `current_step`/`expected_step` |
| `apply-api.test.ts` | `POST /api/apply/state` missing CSRF | Return 403 |
| `apply-api.test.ts` | `POST /otp/send` valid mobile | Return `otp_reference_id`, `expires_at`, `cooldown_seconds` |
| `apply-api.test.ts` | `POST /otp/send` invalid destination | Return 400 `INVALID_DESTINATION` + `field_errors` |
| `apply-api.test.ts` | `POST /otp/send` missing CSRF | Return 403 |
| `apply-api.test.ts` | `POST /otp/verify` valid OTP | Return `verified: true` + `verification_token` |
| `apply-api.test.ts` | `POST /otp/verify` short OTP | Return 400 `INVALID_OTP` + `remaining_attempts` |
| `apply-api.test.ts` | `POST /documents/upload-url` valid | Return `document_id`, `upload_url`, `upload_method`, `expires_at` |
| `apply-api.test.ts` | `POST /documents/upload-url` too large | Return 413 `FILE_TOO_LARGE` + `max_size_bytes` |
| `apply-api.test.ts` | `POST /documents/upload-url` bad mime | Return 400 |
| `apply-api.test.ts` | `POST /documents/upload` base64 PDF | Return 201 `Document` |
| `apply-api.test.ts` | `POST /documents/upload` image | Return 415 `UNSUPPORTED_MEDIA_TYPE` |
| `apply-api.test.ts` | `POST /perfios/initiate` with consent | Return transaction id, redirect URL, expiry |
| `apply-api.test.ts` | `POST /perfios/initiate` no consent | Return 400 `VALIDATION_ERROR` |
| `apply-api.test.ts` | `POST /perfios/callback` | Return 204 empty |
| `apply-api.test.ts` | `GET /perfios/status` | Return status JSON |
| `apply-api.test.ts` | `POST /submit` success | Return 200 `SubmissionResult` with `outcome=submitted_success`, `reference_number` matching `NDH-YYYYMMDD-XXXXXX`, `next_step=offers` |
| `apply-api.test.ts` | `POST /submit` missing consents | Return 400 `VALIDATION_ERROR` + `missing_consents` |
| `apply-api.test.ts` | `POST /submit` incomplete app | Return 422 `INCOMPLETE_APPLICATION` |
| `apply-api.test.ts` | `POST /submit` failure trigger | Return 500 `SUBMISSION_FAILED` + `support_reference` + `support_path` |
| `apply-api.test.ts` | `GET /offers` submitted app | Return 200 `{ offers: [...] }` |
| `apply-api.test.ts` | `GET /offers` missing/unsubmitted | Return 404 `APPLICATION_NOT_FOUND` |
| `apply-api.test.ts` | `POST /consent` valid | Return 201 `ConsentRecord` |
| `apply-api.test.ts` | `POST /consent` missing snapshot | Return 400 `VALIDATION_ERROR` with `statement_snapshot` in `field_errors` |
| `apply-validation.test.ts` | All field validators | Exported from `app/apply/lib/validation.ts`; used by routes |
| `apply-wizard.test.tsx` | Masked PII display | State response must expose masked mobile, Aadhaar, PAN |

---

## 9. Blockers & ambiguities

1. ~~Missing creative brief~~ **Resolved.** `Design.md` and all v1.1.0 contracts have been copied into `navdhan-redesign-2026/.opencode/factory/`.
2. **Missing factory meta files:** No `manifest.md` or `lessons-learned.md` were found, so cross-agent handoff constraints are assumed standard.
3. **Session cookie vs. contract:** `apply-contract.yaml` says `GET /api/apply/state` creates a draft when none exists.  The API test expects `401 SESSION_INVALID` when the cookie is missing.  This CDD resolves the conflict by requiring a cookie for all portal interactions.
4. ~~Idempotency-Key not in contract/tests~~ **Resolved in apply-contract.yaml v1.1.0.** Header is now mandatory; tests must send a valid `Idempotency-Key`.
5. **Final consents mismatch:** The contract declares all four final consents, but the success test sends `marketing: false`.  Implementation treats `terms`, `privacy`, `credit_bureau` as mandatory and `marketing` as recorded-but-optional.
6. **File type mismatch:** The contract restricts uploads to `application/pdf`; the UI registry also allows `image/jpeg` and `image/png` for ITR.  Backend will enforce the contract (PDF only) and reject non-PDF uploads with `415`.
7. **Purpose enum mismatch:** The UI registry uses `business_growth` / `debt_refinance` while the contract and validation tests use `business_expansion` / `debt_refinancing`.  Backend follows the contract/tests.
8. **Stateless environment vs. in-memory stubs:** Next.js route handlers run in a serverless runtime, so module-scoped in-memory stores reset on cold starts.  The MVP/test implementation accepts this limitation; production must switch to Redis + PostgreSQL.
9. **No real encryption/HSM in stub:** PII encryption is interface-driven but the stub key is environment-derived.  A security review is required before any production deployment.

---

## 10. Open questions for `@staff-engineer` review

- `Idempotency-Key` is enforced strictly for contract v1.1.0. Tests should be updated to include it.
- Should `GET /api/apply/state` create the session cookie itself when missing, or is the cookie planted by a landing-page middleware?
- Which ORM/driver should the production repository use?  (Drizzle, Prisma, node-postgres with raw SQL?)  This CDD keeps the repository interface ORM-agnostic.
- Is the lender-matching failure trigger test ID (`deadbeef-dead-dead-dead-deadbeefdead`) acceptable as a permanent test hook, or should it be environment-flag driven?
