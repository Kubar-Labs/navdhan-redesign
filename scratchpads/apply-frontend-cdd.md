# Apply Portal Frontend — Component Design Document

> Unit 3 (Apply Portal) — NavDhan Redesign 2026  
> Branch: `factory/navdhan-redesign/apply/frontend`  
> Status: CDD (Component Design Document) — implementation pending

## 1. Scope & Inputs

This document designs the /apply multi-step loan application wizard for NavDhan.app. It covers routing, state management, component APIs, API integration, accessibility, animation, i18n, and security/PII handling.

### Sources of truth consulted
- `.opencode/factory/apply-contract.yaml` — API contract and state machine
- `.opencode/factory/apply-ui-registry.json` — apply-specific component specifications
- `.opencode/factory/marketing-contract.yaml` — shared i18n/locale strategy and design tokens
- `.opencode/factory/ui-component-registry.json` — shared shell components and animation principles
- `tests/apply/apply-validation.test.ts`
- `tests/apply/apply-api.test.ts`
- `tests/apply/apply-wizard.test.tsx`

### Known input gap
The creative brief referenced as `.opencode/factory/Design.md` is **not present in the working tree**. This CDD falls back to the marketing contract and apply UI registry for copy, tokens, and motion principles. Any apply-specific brand/creative decisions beyond those files are flagged as blockers in Section 10.

## 2. Route & File Structure

```text
app/
├── [locale]/
│   └── apply/
│       ├── layout.tsx              # ApplyLayout (Server Component)
│       └── page.tsx                # Server Component that bootstraps WizardShell
├── apply/
│   ├── _components/
│   │   ├── ApplyLayout.tsx         # (alias/re-export if needed)
│   │   ├── WizardShell.tsx         # "use client" — state container
│   │   ├── Stepper.tsx
│   │   ├── StepContent.tsx
│   │   ├── LoanIntentStep.tsx
│   │   ├── PersonalContactStep.tsx
│   │   ├── AadhaarVerificationStep.tsx
│   │   ├── PanVerificationStep.tsx
│   │   ├── GstVerificationStep.tsx
│   │   ├── ItrUploadStep.tsx
│   │   ├── BankStatementsStep.tsx
│   │   ├── ReviewSubmitStep.tsx
│   │   ├── SubmissionResultStep.tsx
│   │   ├── ConsentPanel.tsx
│   │   ├── FormField.tsx
│   │   ├── FileUpload.tsx
│   │   ├── OtpInput.tsx
│   │   ├── OfferCard.tsx
│   │   ├── SummaryList.tsx
│   │   ├── ErrorState.tsx
│   │   ├── LoadingState.tsx
│   │   └── NavigationFooter.tsx
│   ├── lib/
│   │   ├── validation.ts           # Field validators (used by tests)
│   │   ├── api.ts                  # Fetch wrappers for /api/apply/*
│   │   ├── types.ts                # Shared apply TypeScript types
│   │   ├── constants.ts            # Steps, phases, consent keys
│   │   ├── i18n-helpers.ts         # Locale-aware number/date formatters
│   │   └── storage.ts              # localStorage draft helpers (PII-safe)
│   └── hooks/
│       ├── useApplyState.ts        # Server-state + draft sync hook
│       ├── useWizardMachine.ts     # Wizard state reducer
│       └── useConsent.ts           # Consent snapshot + record helper
app/api/apply/
... route handlers implemented by the backend agent (blocker: not present)
```

### Routing decisions
1. The locale segment is required for all non-default locales and optional for `en`. To keep the apply flow independent of marketing layout churn, use a dedicated apply path group: `app/[locale]/(apply)/apply/page.tsx` and `app/[locale]/(apply)/apply/layout.tsx`. The public URL remains `/apply` and `/hi/apply`.
2. `ApplyLayout` is a **Server Component**. It sets `html lang`, renders a minimal sticky header, skip link, main landmark, and footer legal links.
3. `/apply/page.tsx` is a **Server Component**. It fetches the server draft via `GET /api/apply/state`, reads the locale param, and passes `initialState`, `locale`, and `stepConfig` into the client `WizardShell`.
4. `WizardShell` is a **Client Component** (`"use client"`). It owns form state, validation, async orchestration, and step transitions.

## 3. State Management

### 3.1 Domain model

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

type WizardStatus =
  | "idle"
  | "validating"
  | "submitting"
  | "completed"
  | "error";

type ApplyFormValues = {
  loan_amount?: number;
  tenure_months?: number;
  purpose?: string;
  referral_code?: string | null;
  full_name?: string;
  mobile_number?: string;
  email?: string;
  business_pin_code?: string;
  aadhaar_number?: string;
  aadhaar_otp?: string;
  pan_number?: string;
  gstin?: string | null;
  gstin_skipped?: boolean;
  itr_document_id?: string;
  itr_file_name?: string;
  perfios_transaction_id?: string;
  statement_months?: number;
  consent_marketing?: boolean;
  consent_terms?: boolean;
  consent_privacy?: boolean;
  consent_credit_bureau?: boolean;
};

type WizardState = {
  currentStepId: WizardStepId;
  stepDirection: "next" | "back";
  formValues: ApplyFormValues;
  wizardStatus: WizardStatus;
  fieldErrors: Record<string, string[]>;
  stepErrors: Record<string, string[]>;
  submissionResult?: SubmissionResult;
  completedSteps: Set<WizardStepId>;
};
```

### 3.2 Three-layer state strategy

| Layer | Responsibility | Persistence | Owner |
|-------|---------------|-------------|-------|
| Server state (source of truth) | Draft record, current step, masked PII, consents | PostgreSQL via `/api/apply/state` | Backend |
| Client runtime state | Current form values, touched fields, validation errors, transient async status | In-memory React state | `WizardShell` |
| Local fallback | Non-sensitive draft id, last completed step, and partial non-PII fields for recovery | `localStorage` key `navdhan_apply_draft_v1` | `storage.ts` |

#### Rules
- On mount, `WizardShell` fetches `GET /api/apply/state?locale={locale}`. Server state **wins** over localStorage.
- After each validated step transition, POST the step payload to `/api/apply/state`. On success, merge the returned `ApplicationState` into local state and update `currentStepId` to the server-returned `current_step`.
- `localStorage` must **not** contain raw Aadhaar/PAN/mobile numbers. Persist only `application_id`, `currentStepId`, and non-sensitive fields such as `loan_amount`, `tenure_months`, `purpose`, `referral_code`, `full_name` (optional), `business_pin_code` (optional). Raw identifier data should live only in memory until sent to the server.
- Provide a manual "Save draft" CTA in the navigation footer that writes the safe subset to `localStorage` and shows a transient confirmation.

### 3.3 State machine inside WizardShell

A `useReducer` implements the registry-defined state machine:

```
idle --VALIDATE_STEP--> validating --VALIDATION_PASS--> idle
validating --VALIDATION_FAIL--> error
idle --SUBMIT--> submitting --SUBMIT_SUCCESS--> completed
submitting --SUBMIT_ERROR--> error
error --RESET--> idle
```

Key actions:
- `FIELD_CHANGE(name, value)` — updates `formValues`, clears field error for that field.
- `FIELD_BLUR(name)` — marks field as touched; runs step-level validation.
- `STEP_NEXT` — validates entire current step, records consent if required, POSTs to `/api/apply/state`, advances to `data.current_step`, sets `stepDirection="next"`, adds step to `completedSteps`.
- `STEP_BACK` — moves to previous logical step without server mutation, sets `stepDirection="back"`.
- `STEP_GOTO(stepId)` — only allowed for steps already in `completedSteps` or the current step; used by the review screen edit links.
- `OTP_REQUEST`, `OTP_VERIFY`, `DOCUMENT_UPLOAD`, `PERFIOS_LINK` — transition WizardShell to `validating` while delegating to dedicated async helpers.
- `SUBMIT` — validates all required consents, POSTs `/api/apply/submit`, then routes to `submission_result`.

### 3.4 Hook responsibilities

- `useWizardMachine(initialState)` — wraps `useReducer` and exposes `state`, `dispatch`, `goNext`, `goBack`, `goTo`, `setField` helpers.
- `useApplyState(locale)` — fetches the server draft, exposes `isLoading`, `error`, `applicationId`, and a `patchState(currentStep, payload)` mutator. Used once by `WizardShell`.
- `useConsent(locale)` — builds the localized consent statement snapshot and posts `/api/apply/consent` before a consent-gated step advances.

## 4. Stepper Component

### 4.1 Phases

The 9-step wizard is collapsed into 5 user-facing phases for clarity:

| Phase | Steps | Icon rationale |
|-------|-------|----------------|
| 1. Loan intent | loan_intent | Target / loan icon |
| 2. About you | personal_contact | User icon |
| 3. Verify identity | aadhaar_verification, pan_verification, gst_verification | Shield/check icon |
| 4. Documents | itr_upload, bank_statements | File icon |
| 5. Review & submit | review_submit, submission_result | Clipboard icon |

### 4.2 Behavior

- **Progress bar**: continuous width 0–100 computed as `(completedStepIndex + partialCurrentStep) / (totalSteps - 1) * 100`. Animated 400ms with `cubic-bezier(0.4, 0, 0.2, 1)`.
- **Step dots**: each step shows number/label. Active step uses `aria-current="step"`. Completed steps get `aria-label="completed"`. Future steps are dimmed.
- **Responsive**: horizontal on `md+`; collapses to a compact phase-only indicator on mobile, with a progressive progress bar. Optionally a vertical drawer on small screens.
- **Interactivity**: default `interactive=false`. On the review step, enable click on completed steps.

## 5. Component-by-Component Notes

All components are implemented under `app/apply/_components/` with explicit prop interfaces. Shared primitives (FormField, ConsentPanel, FileUpload, OtpInput) are designed first because steps depend on them.

### 5.1 Shell components

#### `ApplyLayout`
- Server Component. Props: `children`, `params: { locale }`, `hideFooter?: boolean`.
- Sets `<html lang={locale}>`, `<main id="apply-main">`, skip link to `#apply-main`.
- Renders a sticky header with the NavDhan logo link, locale selector, and a "Back to home" link.
- Footer contains legal links (Terms, Privacy, Consent Policy) pulled from the marketing contract.

#### `WizardShell`
- "use client" state container.
- Props augmented to satisfy tests:
  - `initialStepId?: WizardStepId`
  - `applicationId?: string`
  - `locale: string`
  - `steps: StepConfig[]`
  - `initialValues?: Partial<ApplyFormValues>` (needed by `apply-wizard.test.tsx`)
  - `submissionResult?: SubmissionResult` (needed by result-step test)
- Renders `<Stepper>`, animated `<StepContent>`, the active step component, and `<NavigationFooter>`.
- Manages all async orchestration and focus restoration:
  - On step change, focus moves to the active step heading (`h2`).
  - During `validating`/`submitting`, navigation controls are disabled.
  - Wizard-level errors render `<ErrorState>` with retry.

#### `Stepper`
- Props: `steps`, `currentStepId`, `progressPercent`, `orientation`, `interactive`, `onStepClick`.
- Uses `<ol role="list">` with `<li role="listitem">`. Progress bar has `role="progressbar"`, `aria-valuemin=0`, `aria-valuemax=100`, `aria-valuenow={progressPercent}`.
- Motion via Framer Motion; `useReducedMotion` disables width/scale transitions.

#### `StepContent`
- Wrapper with `AnimatePresence mode="wait"`.
- Enter animation: `translateX(±16px)` + opacity 0→1 for 200ms; direction from WizardShell.
- Exit animation: opacity 0→1 for 150ms.
- Reduced motion: no translateX, cross-fade duration 0ms.
- Sets `role="region"` and `aria-labelledby` pointing to the step title.

#### `NavigationFooter`
- Props: `onBack?`, `onContinue`, `continueLabel`, `continueDisabled`, `isLoading`, `showSave`, `onSave?`.
- Wrapped in `role="group" aria-label="Application navigation"`.
- Back button hidden on `loan_intent`.
- Continue button is primary orange. Loading state keeps accessible name and `disabled`.

### 5.2 Step components

#### `LoanIntentStep`
- Fields: loan amount (numeric input + slider), tenure (select/slider), purpose (select), referral code (optional text).
- Validation aligns with `apply-validation.test.ts` and `apply-contract.yaml`:
  - amount: integer, 500000–10000000, multiple of 10000.
  - tenure: integer, 3–12.
  - purpose: one of `working_capital`, `machinery`, `inventory`, `business_expansion`, `debt_refinancing`, `other`.
  - referral_code: nullable; if provided, max 20 chars, `[A-Za-z0-9_-]`.
- Error display: inline `<FormField>` errors under each input.
- Accessibility: amount/tenure in a fieldset, slider `aria-valuetext` announces formatted INR value, EMI preview region is `aria-live="polite"`.
- Note: registry purpose list and contract mismatch; **contract wins**.

#### `PersonalContactStep`
- Fields: full name, mobile, email, business pin code.
- Validation:
  - full_name: 2–150 chars, `[A-Za-z\s'.-]+`.
  - mobile: `^[6-9]\d{9}$`, no country prefix.
  - email: valid format, max 255.
  - pin: `^[1-9]\d{5}$`.
- Inputs use `autoComplete` (`name`, `tel`, `email`, `postal-code`) and `inputMode="numeric"` for mobile/pin.
- Errors linked via `aria-describedby`.

#### `AadhaarVerificationStep`
- Fields: 12-digit Aadhaar input, OTP (via `OtpInput`), consent checkbox.
- Internal state machine per registry: idle → otp_requested → verifying → verified|error.
- Flow:
  1. User enters Aadhaar and accepts consent.
  2. On continue/request, `WizardShell` calls `POST /api/apply/otp/send` (`channel: aadhaar`, `destination: aadhaar_number`, `purpose: aadhaar_verification`).
  3. OTP input appears; on complete, calls `POST /api/apply/otp/verify`.
  4. On success, WizardShell PATCHes the `aadhaar_verification` step to the server and advances.
- Validation:
  - aadhaar: required, 12 digits.
  - otp: 6 digits (after requested).
  - consent: truthy.
- Accessibility: Aadhaar described by format hint, OTP labelled per digit, OTP sent confirmation announced live.

#### `PanVerificationStep`
- Field: PAN input, consent checkbox.
- Auto uppercase and max length 10.
- Validation: `^[A-Z]{5}[0-9]{4}[A-Z]$`.
- Consent gate required.
- On continue, WizardShell validates and POSTs `pan_verification` step payload. Server is the source of truth for verification; UI may stub a loading state.

#### `GstVerificationStep`
- Fields: radio group for "registered / not registered", GSTIN input (conditional), skip button.
- Validation:
  - isRegistered: required.
  - gstin: required only if registered; pattern `^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$`.
- Skip sets `gstin_skipped=true` and posts the `gst_verification` step with `skipped=true`.
- Accessibility: radiogroup with legend, skip as visible secondary button.

#### `ItrUploadStep`
- Uses shared `FileUpload` with `accept="application/pdf"` and `maxSizeBytes=5_242_880`.
- Local validation: required file, type PDF, size limit.
- Registry mentions images; contract restricts to PDF. **Contract wins**.
- Consent gate required per contract (`apply.consent.itrPurpose`).
- Flow:
  1. File selected.
  2. `WizardShell` calls `POST /api/apply/documents/upload-url`.
  3. Upload to presigned URL (PUT/POST), track progress.
  4. On completion, store `document_id` and `file_name`, advance.
  5. Fallback `POST /api/apply/documents/upload` with base64 only if direct upload fails.

#### `BankStatementsStep`
- Fields: months selector (6–12), Perfios link button, consent checkbox.
- Validation: months required, 6–12.
- Consent gate required (`apply.consent.bankStatementPurpose`).
- Flow:
  1. Select months, accept consent, click "Link bank account".
  2. `WizardShell` calls `POST /api/apply/perfios/initiate`.
  3. Open returned `redirect_url` in a modal or new tab.
  4. Poll `GET /api/apply/perfios/status?perfios_transaction_id=...` until `success|failure|partial`.
  5. On success, store `perfios_transaction_id` and advance.

#### `ReviewSubmitStep`
- Props: `summary`, `consents: ConsentItem[]`, `isSubmitting`, `errors`, `onEdit`, `onConsentToggle`, `onSubmit`.
- Renders masked PII using `SummaryList`:
  - mobile → `91-XXXXXX{last4}`
  - aadhaar → `XXXX XXXX {last4}`
  - pan → `{first5}{masked3}{last1}` e.g. `ABCXX***X`
  - GSTIN shown in full (not considered PII in contract)
- Consents required per contract: terms, privacy, credit_bureau, marketing. UI registry lists only three; **contract wins** and adds marketing.
- Submit disabled until required consents are true.
- On submit, WizardShell calls `POST /api/apply/submit` and transitions to `submission_result`.

#### `SubmissionResultStep`
- Props: `status`, `referenceNumber`, `headlineKey`, `subtextKey`, CTAs.
- Success: show reference number, "View dashboard" and "Back to home".
- Failure: show support path from `SubmissionResult.support`, "Contact support" CTA.
- `role="status" aria-live="polite"`. Primary action gets initial focus.
- After success, optionally redirect to offers by fetching `GET /api/apply/offers?application_id=...`.

### 5.3 Shared components

#### `ConsentPanel`
- Reusable checkbox group with linked legal copy.
- Props: `items`, `values`, `onToggle`, `error`.
- Each item includes the consent i18n key, localized text, and link to legal page.
- Uses fieldset/legend; error tied with `aria-describedby`.

#### `FormField`
- Layout primitive: label, hint, error, control.
- Props: `id`, `label`, `children`, `hint?`, `error?`, `required?`.
- Forwards `aria-describedby` from hint + error ids.
- Error reveal animation 150ms; instant under reduced motion.

#### `FileUpload`
- Drag-and-drop zone; keyboard accessible button/role=button.
- State: empty → selecting → uploading → uploaded → error.
- Announces selection/removal via `aria-live`.
- Progress bar exposes `aria-valuenow`.

#### `OtpInput`
- 6-digit input with individual boxes.
- `role="group" aria-label="One-time password"`; each box labelled "Digit 1 of 6".
- Auto-focus next, backspace to previous, paste fills all.

#### `OfferCard`
- Used if the result step surfaces lender offers inline.
- Radio-like selectable card with `aria-pressed`.

#### `SummaryList`
- Read-only grouped summary with edit actions.
- Uses `dl/dt/dd` where semantically appropriate.
- Edit buttons labelled `Edit {section}`.

#### `ErrorState` & `LoadingState`
- Error: `role="alert"`, focus moved to title, retry button.
- Loading: `role="status" aria-busy="true"`; spinner replaced by static text under reduced motion.

## 6. API Integration Contracts

All mutating requests must include:
- `credentials: "same-origin"` (HTTP-only `__Host-nd_session` cookie)
- `x-navdhan-requested-with: apply` custom header
- `Idempotency-Key: <uuid-v4>` header (mandatory per contract v1.1.0)
- `Content-Type: application/json` where applicable

`apiFetch` is responsible for generating a fresh UUID v4 for every distinct mutating request and reusing it automatically on automatic retries (e.g., network timeout).

### 6.1 Endpoints consumed by the frontend

| Endpoint | Method | Use in UI | Request highlights | Response handling |
|----------|--------|-----------|--------------------|-------------------|
| `/api/apply/state` | GET | Load/rehydrate draft | query `locale` | `ApplicationState`; 401 triggers error/login flow |
| `/api/apply/state` | POST | Save step payload | `current_step`, `payload`, optional `application_id`, `locale` | Returns next `current_step`; 400/409 display field/transition errors |
| `/api/apply/otp/send` | POST | Aadhaar/mobile OTP | `channel`, `destination`, `purpose` | Returns `otp_reference_id`, `expires_at`, `cooldown_seconds` |
| `/api/apply/otp/verify` | POST | Verify OTP | `otp_reference_id`, `otp`, `purpose` | Returns `verified` + `verification_token`; 400/410 show remaining attempts or expiry |
| `/api/apply/documents/upload-url` | POST | Presigned upload for ITR | `document_type`, `file_name`, `file_size_bytes`, `mime_type`, `financial_year?` | Returns `document_id`, `upload_url`, `upload_method`, `expires_at` |
| `/api/apply/documents/upload` | POST | Base64 fallback | `document_type`, `file_name`, `mime_type`, `base64_content` | Returns `Document` schema |
| `/api/apply/perfios/initiate` | POST | Start bank link | `months_requested`, `preferred_bank?`, `consent_accepted` | Returns `perfios_transaction_id`, `redirect_url`, `widget_token`, `expires_at` |
| `/api/apply/perfios/status` | GET | Poll bank link | query `perfios_transaction_id` | Status object |
| `/api/apply/submit` | POST | Final submission | `application_id`, `final_consents` | `SubmissionResult`; 500 shows support path |
| `/api/apply/offers` | GET | Fetch lender offers | query `application_id` | Array of `LenderOffer` |
| `/api/apply/consent` | POST | Record consent per step | `application_id`, `step_id`, `consent_key`, `accepted`, `statement_snapshot`, `locale` | Returns `ConsentRecord`; call before advancing from consent-gated steps |

### 6.2 API client module

A thin wrapper in `app/apply/lib/api.ts` abstracts the common headers and error parsing:

```ts
async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> { /* ... */ }
```

- Adds `x-navdhan-requested-with: apply`.
- Reads CSRF/session errors and throws typed `ApplyApiError`.
- Extracts `field_errors`, `message_i18n_key`, `retry_after_seconds` for display.

### 6.3 Error handling

- **400 Validation error** → render inline `fieldErrors` under each field.
- **401 Session invalid** → display `ErrorState` with link to restart; do not expose raw session id.
- **403 Missing CSRF header** → should never reach user if client is correct; log to monitoring.
- **409 Invalid transition** → reset current step to server `expected_step`.
- **413 File too large** → show `apply.errors.fileTooLarge` with max size.
- **415 Unsupported media** → show type error.
- **422 Incomplete application** → on submit, go back to first missing step.
- **429 Rate limited** → show retry-after countdown.
- **500 Submission failed** → display support reference and path.

## 7. Security & PII Handling

### 7.1 Session & storage
- **No JWT in localStorage**. Authentication is via `__Host-nd_session` HTTP-only `SameSite=Lax` cookie only.
- The client never introspects the cookie; `fetch` sends it automatically.

### 7.2 CSRF
- All mutating requests include header `x-navdhan-requested-with: apply`.
- If a 403 is returned, surface a generic "Please try again" error and reload the state.

### 7.3 Input sanitization
- Trim whitespace on all strings before validation and submission.
- Strip non-printable Unicode and zero-width joiners from free text.
- Uppercase PAN/GSTIN/Aadhaar destination on blur.
- Normalize mobile to 10 digits, reject prefixes.

### 7.4 Display masking
- Aadhaar: display only last 4 digits as `XXXX XXXX 1234`.
- PAN: display `ABCXX***X`.
- Mobile: display `91-XXXXXX1234`.
- Full values are sent to server over TLS 1.2+ but never logged or persisted in localStorage.

### 7.5 Consent audit
- Each consent checkbox records an immutable snapshot:
  - `application_id`, `step_id`, `consent_key`, `accepted`, `locale`, `statement_snapshot` (the exact text shown), client timestamp.
- Frontend calls `POST /api/apply/consent` before advancing from a consent-gated step.
- Consent withdrawal is not supported in MVP; UI makes this clear.
- Link the full Consent Policy page in every consent statement.

## 8. Animation Plan

### 8.1 Principles (from marketing-contract)
- Motion is punctuation, not prose.
- All continuous motion respects `prefers-reduced-motion`.
- Prefer `translateY + opacity` for reveals; `scale` for feedback.

### 8.2 Specific transitions
- **Step change**: 200ms `translateX(±16px)` + opacity; exit 150ms fade. Disabled under reduced motion.
- **Progress bar**: 400ms width, `cubic-bezier(0.4, 0, 0.2, 1)`.
- **OTP panel / GSTIN reveal / bank link panel**: 200ms height + opacity reveal.
- **Status icons** (verified, success): 300ms scale pop.
- **File upload progress**: width 200ms linear; focus ring scale 150ms.
- **Number changes** (EMI preview): 150ms scale pulse or count-up; instant under reduced motion.
- **Submission result icon/content**: 300ms scale + 400ms translateY/opacity fade.

### 8.3 Implementation helper

```ts
import { useReducedMotion } from "framer-motion";
const shouldReduceMotion = useReducedMotion() ?? false;
```

When `shouldReduceMotion` is true, all Framer Motion transitions have `duration: 0` and height/translate animations are hidden.

## 9. Internationalization (i18n)

- Framework: `next-intl`.
- Locale source: URL segment (`en`, `hi`, `bn`, `te`, `mr`, `ta`, `kn`, `ml`).
- Default locale is `en` served without prefix.
- Message files:
  - `messages/apply/en.json`
  - `messages/apply/hi.json`
  - (other locales)
- Required key categories:
  - `apply.steps.*.title`, `apply.steps.*.description`
  - `apply.fields.*.label`, `apply.helpers.*`
  - `apply.buttons.*`
  - `apply.errors.*`
  - `apply.consent.*`
- Copy tone: warm English with subtle Hinglish helper text; full Hindi parity for the primary flow (`hi`). Other Indic locales use the same message layout.
- Numeric/date formatting:
  - Use `Intl.NumberFormat(locale, { style: 'currency', currency: 'INR' })`. For Hindi, default digit grouping may remain Arabic numerals; confirm in QA.
  - Display loan amount in lakhs/crores where copy supports it, e.g. "₹5 lakh" for `en-IN` audiences.
  - Dates: `Intl.DateTimeFormat(locale, { dateStyle: 'medium' })`.

## 10. Test-Driven Alignment

### `tests/apply/apply-validation.test.ts`
Exercises `app/apply/lib/validation.ts`. Functions to implement:
- `validateLoanAmount`, `validateTenureMonths`, `validatePurpose`, `validateReferralCode`
- `validateFullName`, `validateMobileNumber`, `validateEmail`, `validateBusinessPinCode`
- `validateAadhaarNumber`, `validateAadhaarOtp`, `validatePanNumber`, `validateGstin`

These validators are called by step components and by the API client before submission.

### `tests/apply/apply-api.test.ts`
Exercises route handlers under `app/api/apply/*`. The frontend does not own the route handlers, but the apply portal depends on them. Frontend changes required:
- Provide correct request shapes and CSRF header in `app/apply/lib/api.ts`.
- Ensure `WizardShell` can consume every response schema (`ApplicationState`, `SubmissionResult`, `LenderOffer`, etc.).

| Test scenario | Component / module exercised |
|---------------|------------------------------|
| GET state | `WizardShell`, `useApplyState`, `app/apply/lib/api.ts` |
| POST state loan_intent | `LoanIntentStep`, `WizardShell`, `api.ts` |
| Invalid POST / 400 | `WizardShell` error mapping, `FormField` |
| Invalid transition / 409 | `WizardShell` state reconciliation |
| Missing CSRF / 403 | `api.ts` header enforcement |
| OTP send/verify | `AadhaarVerificationStep`, `OtpInput`, `api.ts` |
| Document upload-url/upload | `ItrUploadStep`, `FileUpload`, `api.ts` |
| Perfios initiate/callback/status | `BankStatementsStep`, `api.ts` |
| Submit success/failure | `ReviewSubmitStep`, `SubmissionResultStep` |
| Offers GET | `SubmissionResultStep` / future offers view |
| Consent POST | `ConsentPanel`, `useConsent` |

### `tests/apply/apply-wizard.test.tsx`
Exercises `WizardShell` and every step component. Map of tests to components:
- "renders loan_intent" → `WizardShell`, `LoanIntentStep`, `NavigationFooter`
- "disables Continue until loan_intent valid" → `LoanIntentStep`, validation, continue enable logic
- "advances to personal_contact" → `StepContent`, `Stepper`, `PersonalContactStep`
- "validation errors for mobile/email/pin" → `PersonalContactStep`, `FormField`
- "Aadhaar step consent" → `AadhaarVerificationStep`, `ConsentPanel`
- "valid 12-digit Aadhaar" → `AadhaarVerificationStep`, validators
- "valid uppercase PAN" → `PanVerificationStep`, validators
- "valid GSTIN or skip" → `GstVerificationStep`
- "ITR PDF upload" → `ItrUploadStep`, `FileUpload`
- "Bank statements Perfios link + consent" → `BankStatementsStep`
- "masked PII on review" → `ReviewSubmitStep`, `SummaryList`, masking helpers
- "reference number on result" → `SubmissionResultStep`

## 11. Data Types Summary

### Step config

```ts
interface StepConfig {
  id: WizardStepId;
  title: string;
  description?: string;
  requiresConsent?: boolean;
  consentKey?: string;
  skippable?: boolean;
}
```

### Consent item

```ts
interface ConsentItem {
  id: string;           // stable key used in form state, e.g. "consent_terms"
  i18nKey: string;      // e.g. "apply.consent.termsPurpose"
  required: boolean;
  legalHref: string;
}
```

### Summary group

```ts
interface SummaryGroup {
  id: string;
  label: string;
  fields: { label: string; value: React.ReactNode }[];
}
```

## 12. Open Questions / Blockers

1. ~~Missing creative brief~~ **Resolved.** `Design.md` and all v1.1.0 contracts have been copied into `navdhan-redesign-2026/.opencode/factory/`.
2. **Registry vs contract mismatches** to resolve before green-phase coding:
   - `LoanIntentStep` purpose enum in registry (`business_growth`, `debt_refinance`) differs from contract (`business_expansion`, `debt_refinancing`). **Resolution: use contract values**.
   - `LoanIntentStep` amount step in registry is `100000`; contract says multiple of `10000`. **Resolution: use contract**.
   - `ItrUploadStep` accepts images in registry; contract only allows PDF. **Resolution: restrict to PDF**.
   - `ReviewSubmitStep` consent list has 3 items; contract has 4 (terms, privacy, credit_bureau, marketing). **Resolution: use contract**.
   - UI registry calls upload handler `onUpload(file: File)`; contract flow requires two endpoints (upload-url then direct upload). **Resolution: WizardShell orchestrates the two calls**.
3. **Backend route handlers not present**: `tests/apply/apply-api.test.ts` imports `app/api/apply/*`. These route handlers are currently absent and must be implemented by the backend agent or an integration pass.
4. **Test-only props missing from registry**: `WizardShell` needs `initialValues` and `submissionResult` props to satisfy `apply-wizard.test.tsx`. These are added in Section 5.2.
5. **Dependencies not installed**: `next-intl`, `framer-motion`, and `shadcn/ui` are assumed by the registry but are not in `package.json`. They must be added during the green phase.
6. **Hindi copy**: beyond placeholder keys, full Hindi parity requires native-speaker review before release.
