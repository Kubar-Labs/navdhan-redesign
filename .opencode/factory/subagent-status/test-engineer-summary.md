# Test Engineer Design Task — Summary

## What I did

1. **Loaded the required discipline** via the `tdd-pipeline` skill.
2. **Read the active contracts** from Stage 1:
   - `.opencode/factory/api-contract.yaml`
   - `.opencode/factory/db-schema.yaml`
3. **Located and reviewed the three RED-phase test files**:
   - `tests/apply/apply-api.test.ts`
   - `tests/apply/apply-validation.test.ts`
   - `tests/apply/apply-wizard.test.tsx`
4. **Cross-checked every major assertion** against the API routes, request/response schemas, step enums, and validation patterns in the contracts.
5. **Wrote the status report** to `.opencode/factory/subagent-status/test-engineer-design.json` documenting the findings and blockers.

## Execution status

The Vitest run (`npm run test:apply`) could not be executed because:

- The current runtime does not expose a shell tool, and
- `node_modules` is not installed in the workspace.

More importantly, the project currently has **no architect stubs** under `src/app/api/apply/` or `src/app/apply/_components/`, so every test import would fail with module-not-found even after installing dependencies. The tests are therefore already in a hard-failing state.

## Alignment findings

The test suite is **not consistent** with the active contracts. The main gaps are:

- **Wrong routes / not in contract**: `POST /api/apply/state`, `/api/apply/otp/*`, `/api/apply/documents/upload-url`, `/api/apply/perfios/*`, `/api/apply/offers`.
- **Missing contract routes in tests**: `/apply/initialize`, `/apply/ekyc/send-otp`, `/apply/ekyc/verify`, `/apply/pan/verify`, `/apply/gstin/verify`, `/apply/gstin/fetch-returns`, `/apply/bank-statement/analyze`.
- **Wizard step names drifted**: tests use `loan_intent`, `personal_contact`, `aadhaar_verification`, etc., while the contract uses `basic_details`, `ekyc_consent`, `ekyc_verification`, `pan_consent`, etc.
- **Document upload uses JSON/base64** instead of the contract's `multipart/form-data` with binary PDF.
- **Mutation tests omit the required `Idempotency-Key` header**.
- `apply-validation.test.ts` is mostly aligned, but `tenure_months` and `business_pin_code` are not part of the active API contract.

## Recommendations

Before the implementation agents enter GREEN phase:

1. Install dependencies and run `npm run test:apply` in an environment with shell access.
2. Provide architect stubs at the exact contract routes so test imports resolve.
3. Refactor `apply-api.test.ts` to call the contract-defined endpoints and assert the contract schemas.
4. Update `apply-wizard.test.tsx` to use the contract `ApplicationStep` enum.
5. Add `Idempotency-Key` headers to all mutation tests.
