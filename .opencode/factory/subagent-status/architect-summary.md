# Architect Subagent Summary

## Task

Design the API contract, database schema, UI component registry, and compile-safe
stubs for rebuilding `/apply` into a consent-based multi-step loan application
wizard on the redesigned NavDhan platform.

## Deliverables produced

1. **`.opencode/factory/api-contract.yaml`** — OpenAPI 3.0.3 contract v1.0.0
   covering all required endpoints:
   - `POST /api/apply/initialize`
   - `POST /api/apply/ekyc/send-otp`
   - `POST /api/apply/ekyc/verify`
   - `POST /api/apply/pan/verify`
   - `POST /api/apply/gstin/verify`
   - `POST /api/apply/gstin/fetch-returns`
   - `POST /api/apply/bank-statement/analyze`
   - `POST /api/apply/documents/upload`
   - `POST /api/apply/submit`

   Plus supporting endpoints required by the consent-based flow:
   - `GET /api/apply/state`
   - `POST /api/apply/consent`

   Every mutation requires `Idempotency-Key` and `x-navdhan-requested-with`
   headers. All error responses are defined and monetary values are integers to
   avoid floating-point currency.

2. **`.opencode/factory/db-schema.yaml`** — Relational schema v1.0.0 defining:
   - `borrowers`
   - `loan_applications`
   - `ekyc_records`
   - `pan_records`
   - `gstin_records`
   - `bank_statements`
   - `uploaded_documents`
   - `consents`
   - `idempotency_keys`

   PII columns use encrypted storage plus hashes/masks. Foreign keys specify
   `on_delete: CASCADE`. All core tables include `created_at` and `updated_at`.

3. **`.opencode/factory/ui-component-registry.json`** — Component contracts for
   the apply wizard shell, consent panel, step components, OTP input, file
   upload, stepper, navigation, and summary list.

4. **`.opencode/factory/MIGRATION_PLAN.md`** — Brief migration plan from the
   legacy `applications` / `applicants` tables to the new schema.

5. **Compile-safe stubs** in `src/lib/apply/server/` and `src/lib/apply/`:
   - `initialize-application.stub.ts`
   - `ekyc.stub.ts`
   - `pan.stub.ts`
   - `gstin.stub.ts`
   - `bank-statement.stub.ts`
   - `documents.stub.ts`
   - `submit-application.stub.ts`
   - `consent.stub.ts`
   - `idempotency.stub.ts`
   - `validation.stub.ts`

   These export no-op / throwing placeholders so downstream tests and
   implementations can resolve imports during the RED phase.

## Key design decisions

- **Consent-first**: every third-party fetch (eKYC, PAN, GSTIN, bank statement)
  accepts a `ConsentReceipt` object containing the exact statement snapshot,
  purpose, data points, and accessors shown to the user. Consent decisions are
  persisted in a dedicated `consents` audit table.
- **Idempotency**: all `POST`/`PUT`/`PATCH` endpoints require an
  `Idempotency-Key` header; results are cached in `idempotency_keys`.
- **PII safety**: phone, PAN, name, and bank account numbers are stored as
  encrypted ciphertext with one-way hashes and masked display values. Aadhaar is
  stored only as a hash plus last-four.
- **Currency**: `DECIMAL(19,4)` in the schema; API amounts are whole INR
  integers (no floats).

## No blockers

The contract and schema are ready for `@test-engineer` and implementation
agents. No further clarification is required.
