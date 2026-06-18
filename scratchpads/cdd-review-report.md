# CDD Review Report — NavDhan Redesign 2026

## Summary
- **Overall status:** APPROVED
- **Blocking issues:** 0 (all resolved)
- **Non-blocking notes:** retained from previous review
- **Reviewed by:** staff-engineer / orchestrator
- **Review date:** 2026-06-19

## Per-CDD verdict

### marketing-frontend-cdd.md
- **Status:** APPROVED
- **Blocking issues:** None
- **Notes:**
  - Confirm the warm/Hinglish copy matrix is reflected in the final i18n message files.
  - Keep the tech-ecosystem ticker performant (GPU-friendly transform-only animation).
  - Verify partner SVGs are optimized and have consistent aspect ratios.
  - Ensure `LocaleSelector` fallback works if a locale file is partially translated.

### apply-frontend-cdd.md
- **Status:** APPROVED
- **Blocking issues:** None
- **Resolved since last review:** Added mandatory `Idempotency-Key` header to all mutating requests.
- **Notes:**
  - Use the event bus to notify the backend agent that route handlers must be created before the wizard tests can be executed.
  - Keep reduced-motion instant; do not animate step height.
  - Review screen must echo exact PII masking rules from `apply-contract.yaml`.

### apply-backend-cdd.md
- **Status:** APPROVED
- **Blocking issues:** None
- **Resolved since last review:**
  1. `Idempotency-Key` is mandatory per `apply-contract.yaml` v1.1.0; `idempotency_keys` table is used for replay/scope checking.
  2. Session-initiation boundary clarified: `GET /api/apply/state` requires the `__Host-nd_session` cookie and only creates a draft when a valid cookie is present but no application exists; orphaned draft risk is removed.
  3. Concrete in-memory repository/transaction stub plan added (`repository-memory.ts` with per-application mutex for tests, `repository-pg.ts` for production).
- **Notes:**
  - Define the exact `reference_number` generator format (`NDH-YYYYMMDD-XXXXXX`) and idempotency-value collision behavior.
  - Perfios adapter should be a pure function with a deterministic stub for tests.
  - Rate-limit shape is OK; implementation can rely on a middleware primitive.

### apply-database-cdd.md
- **Status:** APPROVED
- **Blocking issues:** None
- **Resolved since last review:**
  1. All monetary columns (`loan_amount`, `emi_amount`, `total_interest`, `processing_fee`, `net_disbursal`) now use `DECIMAL(19,4)`.
  2. `idempotency_keys` table with `key_hash`/`scope`/`payload_hash`/`response_body`/`expires_at` has been added.
  3. `applicants.pii_key_id` and existing `documents.encryption_key_id` support envelope-encryption key rotation.
- **Notes:**
  - Drizzle ORM + `pg` driver is the recorded choice.
  - `gstin_skipped_reason` is not required in MVP; skip UI derives from `gstin_skipped=true`.
  - Soft-delete vs. hard-delete policy for drafts is documented as data-retention-only.

### legal-frontend-cdd.md
- **Status:** APPROVED
- **Blocking issues:** None
- **Resolved since last review:** `Design.md` and all v1.1.0 contracts have been copied into the project repo.
- **Notes:**
  - Ensure legal prose is sourced from `legal-contract.yaml` and not duplicated in JSX.
  - Company legal name, CIN, address, and emails must come from a single constants file.
  - Provide a visible "last updated" date and a print stylesheet.

## Cross-cutting concerns (all addressed)
1. **Idempotency:** `apply-contract.yaml` v1.1.0 now lists the `Idempotency-Key` header for every mutating endpoint.
2. **Currency columns:** All monetary fields use `DECIMAL(19,4)`.
3. **Session vs. draft lifecycle:** Draft creation only occurs for requests with a valid session cookie.
4. **Test-driven integration:** The CDDs specify in-memory stubs and route-handler shape so tests can run before production DB integration.
5. **PII masking consistency:** PAN, mobile, and Aadhaar masking rules are aligned across contract, backend CDD, frontend CDD, and schema.
6. **CSRF + consent audit:** Both custom CSRF header and consent-event logging are explicit in backend and frontend CDDs.

## Recommended next steps
1. ✅ CDDs approved.
2. Update `active-tasks.json` to mark Stage 3 complete and Stage 5 in progress.
3. Dispatch implementation agents in parallel for marketing frontend, apply frontend, apply backend, apply database, and legal frontend.
4. Maintain branch isolation and daily checkpoints; run integration once all units report success.
