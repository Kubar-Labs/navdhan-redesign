# Apply Portal Frontend — Component Design Document (Rebuild)

> Unit 3 (Apply Portal) — NavDhan Redesign 2026
> Branch: `factory/navdhan-redesign/apply/frontend`
> Status: CDD revision — implementation pending

## 1. Scope & Inputs

This document refines the `/apply` multi-step loan-application wizard for NavDhan.app. It covers routing, state management, component APIs, API integration, Sahamati-inspired consent overlays, accessibility, animation, i18n, and security/PII handling.

### Sources of truth (absolute)

- `.opencode/factory/api-contract.yaml` — API shapes, headers, step enum, requests, responses
- `.opencode/factory/ui-component-registry.json` — component contracts, props, styling tokens, message shapes

### Supporting references consulted

- Sahamati "Design Guidelines for Informed Consent in Account Aggregators (AAs)" (Oct 2023)
- `tests/apply/apply-validation.test.ts`
- `tests/apply/apply-wizard.test.tsx`
- `tests/apply/apply-api.test.ts`
- `tests/i18n/apply-translations.test.ts`
- Existing i18n layout under `src/lib/i18n/`

## 2. Sahamati Consent Design Principles

The consent panels and modals follow the Sahamati-informed consent framework summarized at `https://sahamati.org.in/design-guidelines-for-informed-consent-in-aa/`.

### 2.1 Core principles

| Principle                                   | Frontend implication                                                                                                                                            |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Transparency without cognitive overload** | Each consent panel shows: what data is requested, for what purpose, and who accesses it. Optional deep-detail blocks are collapsed behind "Learn more" toggles. |
| **Empowerment and meaningful control**      | Consent is an **explicit opt-in action** ( unchecked checkbox + primary "I agree" button ). Decline paths are visible and do not silently skip the step.        |
| **Trust and digital confidence**            | Consent surfaces carry trust markers: NavDhan/NBFC logos, RBI-AA/SAHAMATI badges, server-side consent `version`, and masked identifiers.                        |
| **Progressive education**                   | A short one-sentence "Why am I seeing this?" annotation appears above every consent panel. Tooltips define acronyms (AA, eKYC, GSTIN).                          |

### 2.2 Consent triggers

A consent overlay is **required before** any operation that pulls or parses regulated financial/identity data:

| Wizard phase              | API step that triggers consent                           | Consent key pattern                                                                                     |
| ------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Business details          | `basic_details` initial submission                       | `apply.consent.dataUsePurpose` (general KYC)                                                            |
| Aadhaar OTP send / verify | `ekyc_consent` → `ekyc_verification`                     | `apply.consent.aadhaarPurpose`                                                                          |
| PAN eKYC                  | `pan_consent` → `pan_verification`                       | `apply.consent.panPurpose`                                                                              |
| GSTIN returns fetching    | `gstin_consent` → `gstin_verification` → `gstin_returns` | `apply.consent.gstinPurpose`                                                                            |
| Bank Net Banking parsing  | `bank_statement_consent` → `bank_statement_analysis`     | `apply.consent.bankStatementPurpose`                                                                    |
| Document file drops       | `itr_upload` / `tds_upload`                              | `apply.consent.documentPurpose`                                                                         |
| Review and Submit         | `review_submit`                                          | `apply.consent.terms`, `apply.consent.privacy`, `apply.consent.creditBureau`, `apply.consent.marketing` |

### 2.3 Overlay variants

- **Modal (`ConsentModal`)**: used the first time a borrower enters a consent-gated step and whenever the statement version changes.
- **Inline overlay (`ConsentOverlay`)**: used when the borrower returns to an already-consented step or on desktop where a modal would obstruct form context.

Both variants render the same fields:

1. Title and short purpose sentence.
2. Bulleted `dataPoints` with a "Show all" collapse when more than five items.
3. `accessors` list (parties).
4. Version badge and trust markers.
5. A single required checkbox labelled with the localized `statementSnapshot`.
6. Primary accept CTA and visible "Not now" decline path.

### 2.4 Statement snapshot

The exact user-facing text shown at the moment of acceptance is captured as `statement_snapshot` and posted to `/api/apply/consent` before the gated API call proceeds. The version comes from the server/translations and is immutable for the locale.

### 2.5 Decline and revocation UX

- Declining a step-level consent disables the Continue CTA and shows a clear explanation of the consequence (e.g. "Without this consent we cannot fetch your bank statement. You can still submit manually later.").
- Full revocation is out of MVP scope; the Review step notes this in plain language.

## 3. Wizard Architecture

### 3.1 Borrower-facing phases

The wizard is experienced as **8 phases**. The client state machine still exposes the underlying 9 logical step IDs required by the existing test suite (`tests/apply/apply-wizard.test.tsx`).

| Phase # | Borrower-facing phase | Logical step ID(s)                | API step(s)                                            |
| ------- | --------------------- | --------------------------------- | ------------------------------------------------------ |
| 1       | Business details      | `loan_intent`, `personal_contact` | `basic_details` (POST `/apply/initialize`)             |
| 2       | Aadhaar eKYC OTP      | `aadhaar_verification`            | `ekyc_consent`, `ekyc_verification`                    |
| 3       | PAN eKYC              | `pan_verification`                | `pan_consent`, `pan_verification`                      |
| 4       | GSTIN returns         | `gst_verification`                | `gstin_consent`, `gstin_verification`, `gstin_returns` |
| 5       | Bank Net Banking      | `bank_statements`                 | `bank_statement_consent`, `bank_statement_analysis`    |
| 6       | Document file drops   | `itr_upload`                      | `itr_upload` (and `tds_upload` if required later)      |
| 7       | Review and Submit     | `review_submit`                   | `review_submit`                                        |
| 8       | Result                | `submission_result`               | `submission_result`                                    |

> **Rationale:** The frontend test suite validates 9 WizardStepIds. The 8-phase grouping matches the requested rebuild description and reduces cognitive load in the Stepper.

### 3.2 File structure

```text
app/
  [locale]/
    apply/
      layout.tsx                  # Server Component; sets lang, landmarks, header/footer
      page.tsx                    # Server Component; fetches state, bootstraps ApplyWizard
  api/
    apply/
      initialize/route.ts         # POST wrapper for POST /apply/initialize
      state/route.ts              # GET wrapper for GET /apply/state
      ekyc/send-otp/route.ts
      ekyc/verify/route.ts
      pan/verify/route.ts
      gstin/verify/route.ts
      gstin/fetch-returns/route.ts
      bank-statement/analyze/route.ts
      documents/upload/route.ts
      submit/route.ts
      consent/route.ts
      offers/route.ts             # optional; used by success CTA
src/
  components/
    apply/
      ApplyWizard.tsx             # state container, orchestrator
      ConsentModal.tsx            # Sahamati explicit-consent modal
      ConsentOverlay.tsx          # inline consent panel
      PerfiosVerificationStep.tsx # Aadhaar / PAN / GSTIN / bank statement step
      DocumentUploadZone.tsx      # ITR/TDS drop zone
      Stepper.tsx                 # 8-phase progress indicator
      NavigationFooter.tsx        # back / continue / save
      ReviewSubmitStep.tsx        # summary + final consents
      BusinessDetailsStep.tsx     # phase 1 form
      SubmissionResultStep.tsx    # phase 8
  hooks/
    apply/
      useWizardMachine.ts
      useServerApplication.ts
      useConsent.ts
  lib/
    apply/
      api.ts                      # fetch wrappers, headers, error parsing
      validation.ts               # field validators
      constants.ts                # step config, consent keys
      types.ts                    # shared TypeScript types
      i18n-helpers.ts             # INR / number / date formatting
      masking.ts                  # PII display helpers
    i18n/                         # existing next-intl setup
      config.ts
      translations.ts
      messages/
        en.json, hi.json, bn.json, te.json, mr.json, ta.json, kn.json, ml.json
```

### 3.3 Routing decisions

1. The locale segment is required for non-default locales and optional for `en`. Public URLs: `/apply`, `/hi/apply`, `/bn/apply`, etc.
2. `app/[locale]/apply/layout.tsx` is a Server Component. It sets `<html lang={locale}>`, renders skip link, sticky header, `<main id="apply-main">`, and legal footer links.
3. `app/[locale]/apply/page.tsx` is a Server Component. It calls `GET /api/apply/state` to resume a draft; if no draft exists, it passes an empty initial state. It passes `locale` and `messages` to `ApplyWizard`.
4. `ApplyWizard` is a Client Component (`"use client"`). It owns client runtime state, validation, consent capture, and async orchestration.

## 4. State Management

### 4.1 Domain model

```ts
type WizardStepId =
  | "loan_intent"
  | "personal_contact"
  | "aadhaar_verification"
  | "pan_verification"
  | "gst_verification"
  | "itr_upload"
  | "bank_statements"
  | "review_submit"
  | "submission_result";

type WizardStatus = "idle" | "validating" | "submitting" | "completed" | "error";

/**
 * Non-sensitive values held in React state. Sensitive identifiers are cleared from
 * localStorage and kept only in-memory until posted. The server is the source of truth.
 */
type ApplyFormValues = {
  // Phase 1 — loan_intent
  requested_amount?: number;
  tenure_months?: number;
  purpose?: LoanPurpose;
  referral_code?: string | null;

  // Phase 1 — personal_contact
  full_name?: string;
  mobile_number?: string;
  email?: string;
  business_pin_code?: string;

  // Phase 2 — aadhaar
  aadhaar_number?: string;
  aadhaar_otp?: string;
  aadhaar_otp_reference_id?: string;

  // Phase 3 — pan
  pan_number?: string;

  // Phase 4 — gstin
  gstin?: string | null;
  gstin_skipped?: boolean;
  gstin_return_history?: GstReturnPeriod[];

  // Phase 5 — bank
  bank_name?: string;
  statement_months?: number;
  bank_statement_method?: "netbanking" | "upload";
  perfios_transaction_id?: string;

  // Phase 6 — documents
  itr_document?: Document;
  tds_document?: Document;

  // Phase 7 — review
  consent_terms?: boolean;
  consent_privacy?: boolean;
  consent_credit_bureau?: boolean;
  consent_marketing?: boolean;
};

type WizardState = {
  applicationId?: string;
  currentStepId: WizardStepId;
  stepDirection: "next" | "back";
  formValues: ApplyFormValues;
  wizardStatus: WizardStatus;
  fieldErrors: Record<string, string[]>;
  stepErrors: Record<string, string[]>;
  completedSteps: WizardStepId[];
  submissionResult?: SubmissionResult;
  serverExpiry?: string;
};
```

### 4.2 Three-layer persistence

| Layer          | Source of truth                                             | Owner         | Persistence                                 |
| -------------- | ----------------------------------------------------------- | ------------- | ------------------------------------------- |
| Server         | `ApplicationState` from `GET /apply/state`                  | Backend       | PostgreSQL                                  |
| Client runtime | Current form values, touched fields, transient async status | `ApplyWizard` | In-memory React state                       |
| Local fallback | Non-sensitive subset for recovery                           | `storage.ts`  | `localStorage` key `navdhan_apply_draft_v1` |

**Rules:**

- Server state wins over `localStorage` on startup.
- `localStorage` must **never** contain raw Aadhaar, PAN, GSTIN, or mobile numbers. Persist only `application_id`, `currentStepId`, and non-sensitive fields such as `requested_amount`, `tenure_months`, `purpose`, `referral_code`, `full_name`, `business_pin_code`.
- A manual "Save draft" link writes the safe subset to `localStorage` and shows a transient confirmation.
- Draft expiry is shown when `expires_at` is within 24 hours.

### 4.3 State machine

`useWizardMachine` uses `useReducer` to enforce the following machine:

```
idle --VALIDATE_STEP--> validating
validating --VALIDATION_PASS--> idle
validating --VALIDATION_FAIL--> error
idle --SUBMIT_STEP--> submitting --STEP_SUCCESS--> idle
submitting --STEP_ERROR--> error
error --RESET--> idle
idle --SUBMIT_APPLICATION--> submitting --SUBMISSION_SUCCESS--> completed
submitting --SUBMISSION_ERROR--> error
```

Key actions:

- `FIELD_CHANGE(name, value)` — updates `formValues`, clears field error.
- `FIELD_BLUR(name)` — marks field touched and runs step-level validation.
- `STEP_NEXT` — validates the current step, captures consent if required, calls the relevant API, advances to the returned step, appends to `completedSteps`.
- `STEP_BACK` — moves to the previous logical step without server mutation; sets `stepDirection="back"`.
- `STEP_GOTO(stepId)` — allowed only for completed steps and the current step; used by Review-step edit links.
- `OTP_SEND`, `OTP_VERIFY`, `VERIFY_PAN`, `VERIFY_GSTIN`, `FETCH_GSTIN_RETURNS`, `ANALYZE_BANK_STATEMENT`, `UPLOAD_DOCUMENT` — async helpers that update transient status and emit `STEP_SUCCESS` or `STEP_ERROR`.
- `SUBMIT_APPLICATION` — validates final consents, calls `/apply/submit`, routes to `submission_result`.

### 4.4 Consent-aware transitions

Every `STEP_NEXT` that targets a consent-gated API route must first:

1. Render the statement snapshot to the borrower.
2. Receive an explicit opt-in (checkbox + button).
3. POST `/api/apply/consent` and await `201`.
4. Only then call the business API (e.g. `/apply/ekyc/send-otp`).
5. On success the receipt is stored in client state; on failure the step remains at the consent overlay with an inline error.

## 5. Component API Bindings

Components are implemented exactly against the registry interfaces in `ui-component-registry.json`.

### 5.1 `ApplyWizard`

- Props:
  - `applicationId?: string`
  - `initialStep?: ApplicationStep` (default `basic_details` on server; client maps to `loan_intent`)
  - `locale: SupportedLocale`
  - `messages: ApplyMessages`
  - `onComplete: (result: SubmissionResult) => void`
- Responsibilities: fetch/merge server state, render `Stepper`, animate `StepContent`, dispatch state machine actions, manage focus restoration to the step heading on transition.

### 5.2 `ConsentModal` / `ConsentOverlay`

- Props match registry exactly (`stepId`, `title`, `purpose`, `dataPoints`, `accessors`, `statementSnapshot`, `version`, `locale`, `onAccept`, `onCancel` / `accepted`).
- Registry `ConsentReceipt` shape is reused.
- Both components forward a `disclosure` slot for legal links.

### 5.3 `PerfiosVerificationStep`

- Props match registry exactly (`applicationId`, `mode`, `locale`, `bankMethod?`, `months?`, `consent`, `messages`, `onComplete`, `onError`).
- Sub-modes map to API routes:
  - `ekyc` → `/apply/ekyc/send-otp` then `/apply/ekyc/verify`
  - `pan` → `/apply/pan/verify`
  - `gstin` → `/apply/gstin/verify`
  - `gstin_returns` → `/apply/gstin/fetch-returns`
  - `bank_statement` → `/apply/bank-statement/analyze`
- Internal sub-state: `idle` → `awaiting_consent` → `input` → `processing` → `success|error`.

### 5.4 `DocumentUploadZone`

- Props match registry exactly.
- Calls `POST /apply/documents/upload` with `multipart/form-data`.
- PDF only, 5 MB max.
- Reports `Document` schema to `onUpload`.

### 5.5 `Stepper`

- Displays **eight borrower-facing phases** derived from the 9 logical step IDs.
- Props: `steps: StepConfig[]`, `currentStepId`, `completedSteps`, `orientation`.
- Horizontal on `md+`; mobile collapses to a compact phase label + progress bar.

### 5.6 `NavigationFooter` / `ReviewSubmitStep`

- Registry props are reused unchanged.
- `NavigationFooter` disables controls while `isLoading` and hides Back on `loan_intent`.
- `ReviewSubmitStep` receives `SummaryGroup[]` generated by `ApplyWizard`, final consents, and handlers.

## 6. Step-by-Step UX Specification

### Phase 1 — Business details

**`loan_intent` sub-step**

- Fields: requested amount (numeric + slider), tenure (select 3–12), purpose (select), referral code (optional).
- Validation aligns with `api-contract.yaml` and `apply-validation.test.ts`:
  - `requested_amount`: integer, 500000–10000000, multiple of 10000.
  - `tenure_months`: integer, 3–12.
  - `purpose`: one of contract enums.
  - `referral_code`: max 20 chars, `[A-Za-z0-9_-]`, nullable.
- EMI preview is `aria-live="polite"`.
- Continue calls `POST /apply/initialize` with `Idempotency-Key` and CSRF header. On success store `application_id` and advance to `personal_contact`.

**`personal_contact` sub-step**

- Fields: full name, mobile, email, business pin code.
- Validation per test suite.
- `autoComplete` attributes and `inputMode="numeric"` for mobile/pin.
- Continue does **not** call a separate endpoint; the data is staged in `ApplyWizard` state and will be submitted together with the next gated step, per API contract flow. If a separate save endpoint is added later, it will be a `PATCH` to `/apply/state`.

### Phase 2 — Aadhaar eKYC OTP

- Presented by `PerfiosVerificationStep` with `mode="ekyc"`.
- Consent overlay (`ConsentModal`) shown first; requires explicit opt-in for Aadhaar number and OTP use.
- On accept: call `POST /apply/ekyc/send-otp`.
- Show `OtpInput` with 6 boxes, countdown timer, resend URL.
- On complete, call `POST /apply/ekyc/verify`.
- On success: display masked name and advance.

### Phase 3 — PAN eKYC

- Presented by `PerfiosVerificationStep` with `mode="pan"`.
- Consent overlay required.
- Input auto-uppercases to `^[A-Z]{5}[0-9]{4}[A-Z]$`.
- Calls `POST /apply/pan/verify`.
- On success show `link_status`, masked PAN, name match.

### Phase 4 — GSTIN returns fetching

- Presented by `PerfiosVerificationStep` with `mode="gstin_returns"` (verification is implicit before fetch).
- Consent overlay required.
- Calls `POST /apply/gstin/verify` then `POST /apply/gstin/fetch-returns`.
- Display `return_history` table with period, filing status, taxable value, tax paid.
- Allow skip via `gstin_skipped=true`.

### Phase 5 — Bank Net Banking parsing

- Presented by `PerfiosVerificationStep` with `mode="bank_statement"`.
- Consent overlay required.
- Inputs: bank name (optional), months 6–12, method (`netbanking` or `upload`).
- Calls `POST /apply/bank-statement/analyze`.
- On response:
  - If `redirect_url` present, open in a centered, branded modal iframe or new tab. Security: iframe must use `sandbox="allow-forms allow-scripts allow-same-origin allow-popups"` and start on HTTPS.
  - Otherwise poll transaction status until `success|failure|partial`.

### Phase 6 — Document file drops

- Presented by `DocumentUploadZone`.
- Consent overlay required.
- Accepts PDF up to 5 MB.
- Calls `POST /apply/documents/upload` with `multipart/form-data`.
- Shows upload progress, scanned/failed status.

### Phase 7 — Review and Submit

- Rendered by `ReviewSubmitStep`.
- Summary groups generated from client/server state, with masked PII:
  - mobile → `91-XXXXXX{last4}`
  - aadhaar → `XXXX XXXX {last4}`
  - pan → `ABCXX***X`
  - GSTIN shown in full
- Final consents: `terms`, `privacy`, `credit_bureau` (required); `marketing` (optional).
- Submit disabled until required consents are true.
- Calls `POST /apply/submit` with `final_consents`.

### Phase 8 — Result

- Rendered by `SubmissionResultStep`.
- Success: display `reference_number` (pattern `NDH-YYYYMMDD-XXXXXX`), "View dashboard" CTA, optional "See offers" CTA.
- Failure: display `support_reference` and `support_path`.
- `role="status" aria-live="polite"`; primary action gets initial focus.

## 7. API Integration Contracts

All mutating requests include:

- `credentials: "same-origin"` (HTTP-only `__Host-nd_session` cookie)
- `x-navdhan-requested-with: apply`
- `Idempotency-Key: <uuid-v4>` generated per distinct call
- `Accept-Language: {locale}` when applicable

### 7.1 Endpoint map

| Registry/test expectation | Next.js internal route                     | Underlying contract endpoint         | Use in UI                       |
| ------------------------- | ------------------------------------------ | ------------------------------------ | ------------------------------- |
| Initialize / create draft | `POST /api/apply/initialize`               | `POST /apply/initialize`             | Create application from Phase 1 |
| Resume draft              | `GET /api/apply/state`                     | `GET /apply/state`                   | Fetch `ApplicationState`        |
| Save step                 | `PATCH /api/apply/state` (optional future) | —                                    | Staging non-sensitive data      |
| Aadhaar OTP send          | `POST /api/apply/ekyc/send-otp`            | `POST /apply/ekyc/send-otp`          | After Aadhaar consent           |
| Aadhaar OTP verify        | `POST /api/apply/ekyc/verify`              | `POST /apply/ekyc/verify`            | Verify 6-digit OTP              |
| PAN verify                | `POST /api/apply/pan/verify`               | `POST /apply/pan/verify`             | After PAN consent               |
| GSTIN verify              | `POST /api/apply/gstin/verify`             | `POST /apply/gstin/verify`           | After GSTIN consent             |
| GSTIN returns             | `POST /api/apply/gstin/fetch-returns`      | `POST /apply/gstin/fetch-returns`    | After verify consent            |
| Bank statement analyze    | `POST /api/apply/bank-statement/analyze`   | `POST /apply/bank-statement/analyze` | After bank consent              |
| Document upload           | `POST /api/apply/documents/upload`         | `POST /apply/documents/upload`       | PDF upload                      |
| Submit                    | `POST /api/apply/submit`                   | `POST /apply/submit`                 | Final submission                |
| Consent record            | `POST /api/apply/consent`                  | `POST /apply/consent`                | Before every gated API          |
| Offers                    | `GET /api/apply/offers`                    | `GET /apply/offers`                  | Success CTA                     |

> Note: `tests/apply/apply-api.test.ts` also references legacy `/api/apply/state` (POST), `/api/apply/otp/send`, `/api/apply/otp/verify`, `/api/apply/perfios/*`. These route files are retained as test-compatible adapters and must delegate to the canonical contract endpoints above.

### 7.2 API client helpers

`src/lib/apply/api.ts` exposes:

- `apiFetch<T>(path, options)` — adds CSRF header, generates idempotency key, attaches `Accept-Language`, parses `ApiError`.
- `initializeApplication(payload, locale)` → `ApplicationState`
- `getApplicationState(locale)` → `ApplicationState`
- `sendEkycOtp(...)` → `OtpReference`
- `verifyEkycOtp(...)` → `EkycVerifyResponse`
- `verifyPan(...)` → `PanVerifyResponse`
- `verifyGstin(...)` → `GstinVerifyResponse`
- `fetchGstinReturns(...)` → `GstinReturnsResponse`
- `analyzeBankStatement(...)` → `BankStatementAnalyzeResponse`
- `uploadDocument(...)` → `Document`
- `submitApplication(...)` → `SubmissionResult`
- `recordConsent(...)` → `ConsentRecord`

### 7.3 Error mapping

| API status                                    | Frontend behaviour                                                               |
| --------------------------------------------- | -------------------------------------------------------------------------------- |
| 400 Validation                                | Render inline `fieldErrors`; call `message_i18n_key` fallback if no field match. |
| 401 Session invalid                           | `ErrorState` with link to restart; masked session id.                            |
| 403 CSRF invalid                              | Generic retry message; reload state.                                             |
| 409 Invalid transition / idempotency conflict | Reset `currentStepId` to server `expected_step`.                                 |
| 410 OTP expired                               | Reveal resend and cooldown.                                                      |
| 413 File too large                            | Inline file error with 5 MB limit.                                               |
| 415 Unsupported media                         | Inline type error.                                                               |
| 422 Incomplete application                    | Navigate to first missing step.                                                  |
| 424 Third-party unavailable                   | Show transient service error with retry.                                         |
| 429 Rate limited                              | Countdown from `retry_after_seconds`.                                            |
| 500 Submission failed                         | Show `support_reference` and `support_path`.                                     |

## 8. Security & PII Handling

- **Authentication**: HTTP-only `__Host-nd_session` cookie only. No JWT in `localStorage` or `sessionStorage`.
- **CSRF**: `x-navdhan-requested-with: apply` on every mutation.
- **Input sanitization**: trim whitespace, strip non-printables and zero-width characters, uppercase PAN/GSTIN on blur, reject country prefixes on mobile.
- **Display masking (never log full values)**:
  - Aadhaar → `XXXX XXXX 1234`
  - PAN → `ABCXX***X`
  - Mobile → `91-XXXXXX1234`
- **localStorage**: PII-free. Full identifiers live only in memory until sent over TLS.
- **Idempotency**: fresh UUID v4 per distinct mutating request; reused only on automatic retries of the same request.

## 9. Accessibility

- Skip link to `#apply-main`.
- Each step title is an `h2` and receives focus on transition.
- `Stepper`: `role="list"`/`role="listitem"`, progress bar has `role="progressbar"`.
- `ConsentModal`: `role="dialog" aria-modal="true"`, focus trap, return focus on close.
- Form errors linked with `aria-describedby`.
- `OtpInput`: `role="group"` with labelled digits.
- File dropzone keyboard activatable.
- All colour choices meet WCAG 2.1 AA contrast against `#fafaf8` surface.

## 10. Animation Plan

- Motion is punctuation. Respect `prefers-reduced-motion`.
- Step change: 200ms `translateX(±16px)` + opacity; exit 150ms. Disabled under reduced motion.
- Progress bar: 400ms width ease.
- Consent overlay reveal: 200ms height + opacity.
- Status icons: 300ms scale pop.
- File upload progress width: 200ms linear.
- Submission result content: 300ms scale + 400ms translateY/opacity fade.
- Use `useReducedMotion` from Framer Motion; when true set transition duration to 0.

## 11. Internationalization — 8 Indian Locales

### 11.1 Strategy

- Framework: existing `next-intl` setup in `src/lib/i18n/`.
- Locales supported: `en`, `hi`, `bn`, `te`, `mr`, `ta`, `kn`, `ml`.
- Default `en` served without prefix.
- The `apply` namespace is loaded dynamically in `app/[locale]/apply/page.tsx`.
- `getTranslator(locale, "apply")` (used by tests) must resolve all keys in `tests/i18n/apply-translations.test.ts`.

### 11.2 Required `apply` namespace keys

Top-level keys (test-required):

```json
{
  "apply": {
    "meta": { "title": "Apply for a loan", "description": "..." },
    "heading": "Business loan application",
    "description": "...",
    "loanDetailsTitle": "Loan details",
    "amountLabel": "Loan amount",
    "tenureLabel": "Tenure (months)",
    "purposeLabel": "Purpose",
    "aboutYouTitle": "About you",
    "fullNameLabel": "Full name",
    "mobileLabel": "Mobile number",
    "emailLabel": "Email address",
    "pinCodeLabel": "Business PIN code",
    "emiLabel": "Estimated EMI",
    "submit": "Submit application",
    "submitting": "Submitting...",
    "successHeading": "Application submitted",
    "errorHeading": "Something went wrong",
    "fieldRequired": "This field is required",
    "validation": {
      "mobileInvalid": "Invalid mobile number",
      "emailInvalid": "Invalid email address",
      "nameInvalid": "Invalid name",
      "consentRequired": "Please accept to continue",
      "amountInvalid": "Amount must be between ₹5,00,000 and ₹1,00,00,000 in multiples of ₹10,000",
      "fileTooLarge": "File must be under 5 MB",
      "unsupportedMedia": "Only PDF files are supported"
    },
    "wizard": {
      "stepIndicator": [
        "Business details",
        "Aadhaar eKYC",
        "PAN eKYC",
        "GSTIN returns",
        "Bank statement",
        "Documents",
        "Review",
        "Result"
      ],
      "back": "Back",
      "next": "Continue",
      "saveAndContinue": "Save draft",
      "businessNameLabel": "Business name",
      "businessNamePlaceholder": "As per GST / trade license",
      "entityTypeLabel": "Business entity",
      "entityTypes": { ... },
      "annualTurnoverLabel": "Annual turnover",
      "annualTurnoverPlaceholder": "...",
      "turnoverRanges": { ... },
      "securityNote": "Your data is encrypted and shared only with consent."
    },
    "consent": {
      "aadhaarPurpose": "I consent to Aadhaar-based eKYC verification...",
      "panPurpose": "I consent to PAN verification and PAN-Aadhaar link check...",
      "gstinPurpose": "I consent to fetching my GSTIN profile and GSTR returns...",
      "bankStatementPurpose": "I consent to analyzing my bank statements...",
      "documentPurpose": "I consent to uploading my income tax documents...",
      "terms": "I agree to the Terms of Service",
      "privacy": "I agree to the Privacy Policy",
      "creditBureau": "I consent to a credit bureau check",
      "marketing": "I consent to receive marketing communications (optional)",
      "dataUsePurpose": "I consent to NavDhan collecting and processing my details...",
      "whyAmISeeingThis": "Why am I seeing this?",
      "whoAccesses": "Who accesses this data?",
      "whatData": "What data is collected?"
    }
  }
}
```

### 11.3 Locale-specific notes

- **English (`en`)**: formal but warm, short sentences.
- **Hindi (`hi`)**: full parity; numerals remain Arabic with Devanagari copy.
- **Indic locales (`bn`, `te`, `mr`, `ta`, `kn`, `ml`)**: use the same key layout; translations can be ML-translated with native review. Dates: `Intl.DateTimeFormat(locale, { dateStyle: 'medium' })`. Currency: `Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })` (canonical numeric form); optional lakhs/crores vernacular copy in helper strings.

## 12. Test-Driven Alignment

### 12.1 `tests/apply/apply-validation.test.ts`

Functions in `src/lib/apply/validation.ts` mirror the test cases exactly:

- `validateLoanAmount`, `validateTenureMonths`, `validatePurpose`, `validateReferralCode`
- `validateFullName`, `validateMobileNumber`, `validateEmail`, `validateBusinessPinCode`
- `validateAadhaarNumber`, `validateAadhaarOtp`, `validatePanNumber`, `validateGstin`

All return `boolean` per tests.

### 12.2 `tests/apply/apply-wizard.test.tsx`

The test suite renders `WizardShell` with the 9 logical step IDs. This CDD retains those IDs. `ApplyWizard` is the production wrapper that accepts registry props and renders `WizardShell` internally to keep tests passing.

Key test expectations:

| Test                                      | Implementation hook                             |
| ----------------------------------------- | ----------------------------------------------- |
| Continue disabled until loan intent valid | `ApplyWizard`/`WizardShell` validation gate     |
| Advances to personal_contact              | `STEP_NEXT` action                              |
| Mobile/email/pin errors                   | `FormField` + validators                        |
| Aadhaar consent checkbox                  | `ConsentOverlay`                                |
| Valid 12-digit Aadhaar / 6-digit OTP      | `PerfiosVerificationStep` mode `ekyc`           |
| Uppercase PAN                             | `PerfiosVerificationStep` mode `pan`            |
| GSTIN or skip                             | `gstin_skipped` path                            |
| ITR PDF upload                            | `DocumentUploadZone`                            |
| Bank link + consent                       | `PerfiosVerificationStep` mode `bank_statement` |
| Masked PII on review                      | `masking.ts` helpers                            |
| Reference number on result                | `SubmissionResultStep`                          |

### 12.3 `tests/i18n/apply-translations.test.ts`

Every supported locale must provide the listed keys under `apply`. The page must use `getTranslator`/`useTranslations` and contain no hard-coded English/Hindi strings for labels.

### 12.4 `tests/apply/apply-api.test.ts`

Frontend responsibilities:

- Include `x-navdhan-requested-with: apply` on all mutations.
- Include `Idempotency-Key` header.
- Send correct request bodies for `initialize`, `ekyc/send-otp`, `ekyc/verify`, `pan/verify`, `gstin/*`, `bank-statement/analyze`, `documents/upload`, `submit`, and `consent`.
- Parse `SubmissionResult`, `ConsentRecord`, `Document`, and error payloads.

## 13. Data Types Summary

```ts
interface StepConfig {
  id: WizardStepId;
  title: string;
  description?: string;
  requiresConsent?: boolean;
  consentKey?: string;
  phaseIndex: number;
  skippable?: boolean;
}

interface SummaryGroup {
  id: string;
  label: string;
  fields: { label: string; value: React.ReactNode; editableStep?: WizardStepId }[];
}
```

`ConsentReceipt` is the registry shape (`accepted`, `statement_snapshot`, `version`, `locale`, `data_points?`, `purpose?`, `accessors?`).

## 14. Blockers / Open Questions

1. **Backend route adapters**: `tests/apply/apply-api.test.ts` imports legacy route handlers (`/api/apply/state/route`, `/api/apply/otp/send`, `/api/apply/perfios/*`). The backend agent should implement these as thin adapters that delegate to the canonical contract endpoints defined in `api-contract.yaml`.
2. **Dependencies**: `next-intl` is expected to be in place. If `framer-motion` is not installed, animation should use CSS transitions to keep bundle small.
3. **Indic copy**: translations for `bn`, `te`, `mr`, `ta`, `kn`, `ml` should be generated with a native-speaker pass before release.
4. **Perfios iframe vs redirect**: final UX decision between modal iframe and new-tab redirect will be made during green-phase implementation; both are captured in Section 7.

## Staff Engineer Feedback

1. **Section 3.3:** `GET /apply/state` should surface the contract's `404 APPLICATION_NOT_FOUND` and route the borrower to initialize, not pass an empty initial state.
2. **Section 3.1 / 4.1:** `WizardStepId` values `loan_intent` and `personal_contact` must remain purely client-side sub-states. API payloads and server state must use the contract's `basic_details` step.
3. **Section 6.2:** Calling `POST /apply/initialize` from the `loan_intent` sub-step, before `full_name`, `email`, and `phone` are collected, violates the contract schema for `/apply/initialize`. Initialize must include all required `basic_details` fields.
4. **Section 4.1:** `ApplyFormValues` includes `tenure_months` and `business_pin_code`, which are not present in `api-contract.yaml` or `db-schema.yaml`. Remove them or explicitly mark them as client-only, never-sent fields.

CHANGES_REQUESTED
