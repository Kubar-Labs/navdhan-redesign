# Staff Engineer Review — Apply Portal CDDs

- **Reviewed by:** staff-engineer
- **Date:** 2026-06-26
- **CDDs reviewed:**
  - `scratchpads/apply-frontend-cdd.md`
  - `scratchpads/apply-backend-cdd.md`
  - `scratchpads/apply-database-cdd.md`
- **Contracts consulted:**
  - `.opencode/factory/api-contract.yaml`
  - `.opencode/factory/db-schema.yaml`
  - `~/.config/opencode/agents/shared/KUBAR_FINTECH_RULES.md`

## Executive verdict

**STATUS: CHANGES_REQUESTED**

The database CDD is aligned with `db-schema.yaml`. The frontend CDD has improved significantly (correct route wrappers, consent receipt shape, and error handling) but still splits the `basic_details` step into two logical sub-steps in a way that conflicts with the `POST /apply/initialize` contract and retains non-schema fields. The backend CDD is materially misaligned with the finalized `api-contract.yaml`: it defines the wrong route surface, missing canonical endpoints, and uses tables/columns that do not exist in the schema.

---

## 1. Sahamati consent-based design

### What the contract requires

- Every consent-gated mutation (`/apply/ekyc/send-otp`, `/apply/pan/verify`, `/apply/gstin/verify`, `/apply/gstin/fetch-returns`, `/apply/bank-statement/analyze`) embeds a `ConsentReceipt` object.
- The receipt requires `accepted`, `statement_snapshot`, `version`, `locale`, and optionally `data_points`, `purpose`, and `accessors`.
- A standalone `/apply/consent` endpoint records each decision for audit.

### Frontend CDD assessment

- **Good:** `ConsentModal` / `ConsentOverlay` explicitly opt-in (unchecked checkbox + accept CTA), render `purpose`, `dataPoints`, `accessors`, `version`, trust markers, and a "Why am I seeing this?" annotation. Decline paths and revocation limits are documented.
- **Good:** Section 4.4 describes posting `/api/apply/consent` before the gated API call and storing the receipt in client state.
- **Non-blocking:** Ensure the `ConsentReceipt` object sent to the backend actually populates `version`, `data_points`, `purpose`, and `accessors`, not just the UI overlay props.

### Backend CDD assessment

- **Blocking:** `POST /apply/consent` in Section 4.12 accepts only `step_id`, `consent_key`, `accepted`, `statement_snapshot`, and `locale`. It does not consume the full `ConsentReceipt` shape required by the mutation endpoints (`version`, `purpose`, `data_points`, `accessors`). The `consents` table supports the audit trail, but the route contract is incomplete.
- **Blocking:** The backend CDD does not design the canonical contract consent-gated endpoints at all (it only has generic OTP/Perfios routes). Without those endpoints, the consent receipt has nowhere valid to be consumed.

### Database CDD assessment

- **Good:** The `consents` table supports an append-only audit trail with `statement_snapshot`, `locale`, and client-identity hashes.
- **Non-blocking:** Consider adding columns for `version`, `purpose`, `data_points`, and `accessors` so the audit record fully reflects the API `ConsentReceipt`.

---

## 2. Perfios third-party flow

### What the contract requires

- `/apply/bank-statement/analyze` accepts `application_id`, `months`, and `method: netbanking | upload`, plus a `ConsentReceipt`.
- Response returns `perfios_transaction_id`, `redirect_url`, `status`, and `analysis_score`.

### Frontend CDD assessment

- **Good:** Section 5.3 `PerfiosVerificationStep` maps `bank_statement` mode to `/apply/bank-statement/analyze` and Section 6.2 accepts `method: netbanking | upload`.
- **Good:** The UX correctly uses the returned `redirect_url` and polls for `success|failure|partial`, and handles `analysis_score`.

### Backend CDD assessment

- **Blocking:** Sections 4.7–4.9 define `/api/apply/perfios/initiate`, `/api/apply/perfios/callback`, and `/api/apply/perfios/status`. The contract collapses this into a single `/apply/bank-statement/analyze` endpoint and does not specify a separate callback path for the frontend. The backend design must be realigned to the contract route and response shape.

### Database CDD assessment

- **Good:** The `bank_statements` table stores `perfios_transaction_id`, `status`, `analysis_score` (`numeric(5,2)`), and `raw_payload`, matching the schema.

---

## 3. Database integrity and currency

### Database CDD assessment

- **Good:** `loan_applications.requested_amount` is mapped to `decimal("requested_amount", { precision: 19, scale: 4 })`, matching `DECIMAL(19,4)` in the schema.
- **Good:** Foreign keys use `ON DELETE CASCADE`, indexes match the schema, and PII lookup columns are hashes only.
- **Good:** The partial unique index on `idempotency_keys(key_hash, scope) WHERE expires_at > now()` is preserved.
- **Non-blocking:** The `verification_status` enum is defined but unused; the CDD correctly flags this as a forward-looking type.
- **Non-blocking:** The backend repository/locking interface only exposes `lockApplication()` and `lockApplicant()`. Consider adding explicit locks for `bank_statements` and `uploaded_documents` rows because Perfios callbacks and document scan completions also mutate financial state.

### Frontend / backend data-model alignment

- **Blocking:** The frontend `ApplyFormValues` includes `tenure_months` and `business_pin_code` (Section 4.1); neither is in `api-contract.yaml` nor `db-schema.yaml`. `loan_applications` has only `requested_amount`, `purpose`, `referral_code`; `borrowers` has no `business_pin_code`.
- **Blocking:** The backend CDD data-model mapping in Section 5.1 references `applications.loan_amount`, `applications.tenure_months`, and `applicants.business_pin_code`. These tables/columns do not exist in the schema; use `loan_applications.requested_amount` and the `borrowers` table.

---

## 4. RSC boundary and type compatibility

### Frontend CDD assessment

- **Good:** The boundary is correct — `app/[locale]/apply/layout.tsx` and `page.tsx` are Server Components, and `ApplyWizard` is the only Client Component. Serializable `messages`, `locale`, and `initialStep` cross the boundary.
- **Blocking:** `WizardStepId` uses `loan_intent`, `personal_contact`, etc. (Section 4.1). These must map precisely to the contract's `ApplicationStep` enum. If the UI needs sub-step granularity, it should be a purely client-side internal state and must not leak into API payloads or server state.
- **Blocking:** The form model includes non-contract fields (`tenure_months`, `business_pin_code`).

### Backend CDD assessment

- **Blocking:** Section 5 defines `STEP_ORDER` starting at `loan_intent`. The contract starts at `basic_details`. The backend state machine and response payloads must mirror the contract's `ApplicationStep` enum exactly, otherwise they will diverge from the database enum.

---

## 5. Route-level correctness

### Frontend CDD route map

- **Good:** Section 2 and Section 7.1 now list the canonical contract endpoints (`/apply/initialize`, `/apply/ekyc/send-otp`, `/apply/ekyc/verify`, `/apply/pan/verify`, `/apply/gstin/verify`, `/apply/gstin/fetch-returns`, `/apply/bank-statement/analyze`, `/apply/documents/upload`, `/apply/submit`, `/apply/consent`).
- **Blocking:** `GET /apply/state` should not silently pass an empty initial state when no draft exists (Section 3.3). The contract's `GET /apply/state` returns `404 APPLICATION_NOT_FOUND` when there is no application. The frontend should detect this and route the borrower through `POST /apply/initialize`.
- **Blocking:** Section 6.2 states that `loan_intent` calls `POST /apply/initialize` immediately, while `personal_contact` data is staged and "submitted together with the next gated step." The contract's `/apply/initialize` requires `full_name`, `email`, `phone`, `requested_amount`, and `purpose` in a single call. The two sub-steps cannot be submitted separately. The UX must collect all `basic_details` fields before calling initialize, or initialize must be called after `personal_contact` with the full payload.

### Backend CDD route map vs contract

The backend CDD route inventory in Section 2 is materially different from `api-contract.yaml`:

| Backend CDD route                           | Contract route                             | Mismatch severity                                                           |
| ------------------------------------------- | ------------------------------------------ | --------------------------------------------------------------------------- |
| `POST /api/apply/state`                     | `POST /apply/initialize`                   | **Major** — the contract has no generic "save any step" POST state endpoint |
| `/api/apply/otp/send`                       | `/apply/ekyc/send-otp`                     | **Major** — wrong path and request shape                                    |
| `/api/apply/otp/verify`                     | `/apply/ekyc/verify`                       | **Major** — response shape differs                                          |
| Missing                                     | `/apply/pan/verify`                        | **Major**                                                                   |
| Missing                                     | `/apply/gstin/verify`                      | **Major**                                                                   |
| Missing                                     | `/apply/gstin/fetch-returns`               | **Major**                                                                   |
| `/api/apply/perfios/*`                      | `/apply/bank-statement/analyze`            | **Major**                                                                   |
| `/api/apply/documents/upload-url`           | Not in contract                            | **Major**                                                                   |
| `POST /api/apply/documents/upload` (base64) | `POST /apply/documents/upload` (multipart) | **Major**                                                                   |

### Initialize flow

- **Blocking:** The contract defines `POST /apply/initialize` as the only way to create an application, requiring `full_name`, `email`, `phone`, `requested_amount`, and `purpose`. The backend CDD has no `/apply/initialize` route and instead has `GET /api/apply/state` auto-create a draft (Section 4.1), which contradicts the contract.
- **Blocking:** The backend CDD `POST /api/apply/state` accepts arbitrary step payloads for `loan_intent`, `personal_contact`, etc. These steps are not in the contract, and there is no contract endpoint for saving partial step data.

---

## 6. Fintech / compliance

### Idempotency

- **Good:** Backend Section 3.6 and frontend Section 7 both require `Idempotency-Key` on mutations and describe replay/conflict behavior. The database table `idempotency_keys` matches the schema.

### Transactions and row locking

- **Good:** Backend CDD states mutations use explicit transactions and `SELECT ... FOR UPDATE` locking on `applications`/`applicants`.
- **Non-blocking:** As noted above, add row locking for `bank_statements` and `uploaded_documents` to fully cover financial-mutation state changes.

### Currency

- **Good:** Database CDD maps `requested_amount` to `DECIMAL(19,4)`; backend CDD does not introduce float currency.

### PII masking

- **Good:** Both implementation CDDs describe masking phone (`XXXXXX{last4}`), PAN (`ABCXX***X`), and Aadhaar (`XXXX XXXX {last4}`) and state that plaintext identifiers must not persist in `localStorage`.
- **Non-blocking:** Ensure backend logs also redact hash columns (`phone_hash`, `aadhaar_hash`, `pan_hash`) from free-text error detail, not just encrypted values.

---

## 7. Cross-CDD alignment

- The **database CDD** uses the schema's step names (`basic_details`, `ekyc_consent`, etc.).
- The **frontend CDD** uses a client-only `WizardStepId` set that must remain internal; its API calls generally map to the contract except for the `basic_details` / initialize split.
- The **backend CDD** uses a legacy step set (`loan_intent`, `aadhaar_verification`, etc.) and non-existent tables (`applications`, `applicants`).

These three designs cannot be implemented together without a backend rewrite.

---

## 8. Blocking issues summary

### `apply-frontend-cdd.md`

1. **Section 3.3:** `GET /apply/state` should handle `404 APPLICATION_NOT_FOUND` and route to initialize, not pass an empty initial state.
2. **Section 3.1 / 4.1:** `WizardStepId` uses `loan_intent` / `personal_contact`. These must be internal client-only sub-states; API payloads must use the contract's `basic_details` step.
3. **Section 3.1 / 6.2:** `loan_intent` calling `POST /apply/initialize` before collecting `full_name`, `email`, and `phone` violates the contract. All `basic_details` fields must be present in the initialize payload.
4. **Section 4.1:** `ApplyFormValues` includes non-contract/non-schema fields `tenure_months` and `business_pin_code`. Remove them or document them as purely client-side analytics fields that are never sent to the backend.

### `apply-backend-cdd.md`

1. **Section 2 / 4:** Route inventory must match the contract exactly. Implement `/apply/initialize`, `/apply/ekyc/send-otp`, `/apply/ekyc/verify`, `/apply/pan/verify`, `/apply/gstin/verify`, `/apply/gstin/fetch-returns`, `/apply/bank-statement/analyze`, and multipart `POST /apply/documents/upload`.
2. **Section 4.1:** `GET /api/apply/state` must not auto-create an application. Draft creation belongs to `POST /apply/initialize`.
3. **Section 4.2:** Remove or redefine generic `POST /api/apply/state` with arbitrary step payloads. Step progression must use the contract endpoints.
4. **Section 4.3–4.4:** Replace OTP routes with the contract's `/apply/ekyc/send-otp` and `/apply/ekyc/verify`, matching request/response schemas.
5. **Missing:** `/apply/pan/verify`, `/apply/gstin/verify`, `/apply/gstin/fetch-returns`, and `/apply/bank-statement/analyze` are absent.
6. **Section 4.5–4.6:** Document upload must be multipart/form-data `POST /apply/documents/upload` returning `201` `Document`; remove base64 and upload-url routes.
7. **Section 4.7–4.9:** Collapse Perfios routes into `/apply/bank-statement/analyze` per the contract.
8. **Section 4.12:** `POST /apply/consent` must accept step IDs from the contract enum (`ekyc_consent`, `pan_consent`, `gstin_consent`, `bank_statement_consent`, `review_submit`) and persist the full consent receipt fields.
9. **Section 5.1:** Data-model mapping references non-existent tables/columns (`applications`, `applicants`, `loan_amount`, `tenure_months`, `business_pin_code`); use `loan_applications` and `borrowers` from `db-schema.yaml`.
10. **Section 5:** `STEP_ORDER` starts at `loan_intent`; must start at `basic_details` and include all contract steps.

### `apply-database-cdd.md`

No blocking issues. The schema mapping, indexes, constraints, currency columns, and PII-at-rest design align with `db-schema.yaml`.

---

## 9. Non-blocking suggestions

1. **Frontend:** Clarify exactly when `POST /apply/initialize` is fired relative to the two Phase-1 sub-steps.
2. **Backend:** Add explicit row-lock methods for `bank_statements` and `uploaded_documents` in the repository/transaction interface.
3. **Backend:** Clarify whether `/api/apply/offers` is an internal convenience route; if it becomes public, add it to `api-contract.yaml`.
4. **All CDDs:** Document how email addresses are classified — the factory PII rule covers phone/PAN/Aadhaar, and `borrowers.email` is stored plain as the login identifier, consistent with the schema.

---

## 10. Conclusion

The database design is sound, the frontend CDD is close but needs cleanup around the `basic_details` / initialize boundary, and the backend CDD must be rewritten against the finalized API contract. The most urgent corrections are:

- Implement the exact route surface from `api-contract.yaml` in the backend CDD.
- Introduce `/apply/initialize` and remove "GET state auto-creates a draft" behavior.
- Ensure the frontend calls initialize only after collecting all required `basic_details` fields.
- Remove or internalize `tenure_months` and `business_pin_code`.
- Persist the full `ConsentReceipt` fields.

**STATUS: CHANGES_REQUESTED**
