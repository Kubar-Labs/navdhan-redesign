# Frontend CDD Refinement Summary

## Task

Refine the apply-portal frontend Component Design Document for the rebuilt consent-based multi-step Apply wizard.

## Completed work

1. Reviewed absolute sources of truth:
   - `.opencode/factory/api-contract.yaml`
   - `.opencode/factory/ui-component-registry.json`

2. Incorporated Sahamati consent design principles (transparency without overload, meaningful control, trust markers, progressive education) and specified:
   - Consent triggers at every data-fetching/verification step.
   - Explicit opt-in toggles with `statement_snapshot`, `version`, `purpose`, `data_points`, and `accessors`.
   - Modal and inline overlay variants.
   - Decline-path UX and revocation-out-of-scope note.

3. Formulated the client-side state machine and component API bindings for the 8-phase Apply Wizard, mapping to the API `ApplicationStep` enum and the 9 logical step IDs required by the existing test suite.

4. Detailed per-phase UX for:
   - Business details (loan_intent + personal_contact)
   - Aadhaar OTP send/verify
   - PAN eKYC
   - GSTIN verification and returns fetching
   - Bank statement Net Banking parsing via Perfios
   - ITR/TDS document upload
   - Review and Submit
   - Submission result

5. Specified API integration against the contract endpoints (`/apply/initialize`, `/apply/state`, `/apply/ekyc/*`, `/apply/pan/verify`, `/apply/gstin/*`, `/apply/bank-statement/analyze`, `/apply/documents/upload`, `/apply/submit`, `/apply/consent`, `/apply/offers`), with CSRF, idempotency, and error handling.

6. Added PII masking rules, localStorage safety rules, and security constraints (HTTP-only cookie, no JWT in storage, idempotency UUIDs).

7. Defined animation plan respecting `prefers-reduced-motion`.

8. Documented full multilingual strategy under the `apply` namespace for all 8 Indian locales (`en`, `hi`, `bn`, `te`, `mr`, `ta`, `kn`, `ml`) and listed the required message keys that satisfy `tests/i18n/apply-translations.test.ts`.

9. Updated test-driven alignment notes for `apply-validation.test.ts`, `apply-wizard.test.tsx`, `apply-api.test.ts`, and `apply-translations.test.ts`.

## Artifacts changed

- `scratchpads/apply-frontend-cdd.md` — rewritten/replaced with the refined design document.
- `.opencode/factory/subagent-status/frontend-summary.md` — this file.

No production code was modified or committed.
