# CDD Review Report — NavDhan Redesign 2026

## Summary
- **Overall status:** CHANGES_REQUESTED
- **Blocking issues:** 3
- **Non-blocking notes:** 7
- **Reviewed by:** staff-engineer
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
- **Status:** APPROVED (with contract amendments)
- **Blocking issues:**
  1. All mutating POSTs must include an `Idempotency-Key` header before the wizard advances. The current CDD references `x-navdhan-requested-with` CSRF but omits idempotency. This must be added to the fetch layer.
- **Notes:**
  - Use the event bus to notify the backend agent that route handlers must be created before the wizard tests can be executed.
  - Keep reduced-motion instant; do not animate step height.
  - Review screen must echo exact PII masking rules from `apply-contract.yaml`.

### apply-backend-cdd.md
- **Status:** CHANGES_REQUESTED
- **Blocking issues:**
  1. **Idempotency-Key missing.** Every mutation (`POST /api/apply/state`, `POST /api/apply/otp/send`, `POST /api/apply/otp/verify`, `POST /api/apply/upload`, `POST /api/apply/submit`, `POST /api/apply/perfios/initiate`) must require and store an `Idempotency-Key`. The CDD currently only mentions CSRF.
  2. **Session-initiation boundary.** The CDD proposes creating a new draft on every `GET /api/apply/state`. This conflicts with the contract requirement to return `401` when the session cookie is absent and could create orphaned drafts. Clarify that draft creation must happen only after the user initiates an action (POST) or after explicit session validation.
  3. **Persistence strategy for tests.** The CDD does not specify how the route handlers will be stubbed so that `tests/apply/*.test.ts` can import them without a real database. Add a concrete in-memory repository/transaction stub plan.
- **Notes:**
  - Define the exact `reference_number` generator format (`NDH-YYYYMMDD-XXXXXX`) and idempotency-value collision behavior.
  - Perfios adapter should be a pure function with a deterministic stub for tests.
  - Rate-limit shape is OK; implementation can rely on a middleware primitive.

### apply-database-cdd.md
- **Status:** CHANGES_REQUESTED
- **Blocking issues:**
  1. **Money columns must be `DECIMAL(19,4)` (or `NUMERIC(19,4)`).** The CDD currently lists `loan_amount` as `bigint`; fintech factory rules prohibit floats but `bigint` for INR is imprecise for paise and makes totals error-prone. Use `DECIMAL`/`NUMERIC` everywhere for money.
  2. **Missing idempotency table.** Add an `idempotency_keys` table with `key`, `scope`, `payload_hash`, `response_body`, `created_at`, and TTL purge strategy.
  3. **Missing PII key reference.** Add `pii_key_id` / `encryption_key_version` columns to applicant/contact/document tables so encrypted PII can be rotated without re-encrypting every row.
- **Notes:**
  - Choose between Drizzle and Prisma and record the decision; Drizzle is preferred for Next.js serverless deployments.
  - Add an indexed `gstin_skipped_reason` or note column if the frontend captures a skip reason.
  - Soft-delete vs. hard-delete policy for drafts should be documented.

### legal-frontend-cdd.md
- **Status:** APPROVED
- **Blocking issues:** None
- **Notes:**
  - Ensure legal prose is sourced from `legal-contract.yaml` and not duplicated in JSX.
  - Company legal name, CIN, address, and emails must come from a single constants file.
  - Provide a visible "last updated" date and a print stylesheet.

## Cross-cutting concerns
1. **Idempotency:** Global factory rules require `Idempotency-Key` on all financial/state mutations. `apply-contract.yaml` does not yet list this header; it must be updated and the backend CDD revised.
2. **Currency columns:** All monetary fields must use `DECIMAL`/`NUMERIC`, not `bigint` or float.
3. **Session vs. draft lifecycle:** A user without a session must not be silently assigned a draft on a GET request.
4. **Test-driven integration:** The frontend wizard and backend routes will initially fail because test imports point to files that do not exist. Both implementation agents should coordinate via the event bus.
5. **PII masking consistency:** PAN, mobile, and Aadhaar masking rules in API responses, review UI, and database design must match exactly.
6. **CSRF + consent audit:** Mutating endpoints need both `x-navdhan-requested-with: apply` and consent-event logging; the CDDs assume these but the consent log schema should be explicit.

## Recommended next steps
1. Update `apply-contract.yaml` to add `Idempotency-Key` header requirements for all POST /api/apply/* endpoints.
2. Update `db-schema.yaml` to use `DECIMAL(19,4)` for money, add `idempotency_keys` table, and add `pii_key_id`/`encryption_key_version` columns.
3. Send the apply-backend and apply-database CDDs back to their respective agents for revision and re-commit.
4. Re-run staff-engineer CDD review (lightweight re-review focusing on the blocking issues and contract deltas).
5. Once CDDs are approved, begin Stage 3 implementation in parallel for marketing frontend, apply frontend, apply backend, apply database, and legal frontend.
