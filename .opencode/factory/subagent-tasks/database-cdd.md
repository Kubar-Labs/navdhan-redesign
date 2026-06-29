# Database Apply CDD Refinement

You must review and update `/home/yash/opencode-workspace/navdhan-redesign-2026/scratchpads/apply-database-cdd.md` to ensure it is in complete agreement with the newly designed database schema contract, Drizzle conventions, and migration constraints.

## Goals & Constraints
- Focus strictly on `/apply` related tables: `applications`, `documents`, `perfios_sessions`, `consent_logs`.
- Align schema columns, datatypes, and constraints exactly with `.opencode/factory/db-schema.yaml`:
  - `applications`: `id`, `user_id`, `status` (applicationStatusEnum), `current_step` (applicationStepEnum), `amount_requested` (DECIMAL(19,4)), `purpose` (loanPurposeEnum), `referral_code`, `created_at`, `updated_at`.
  - `documents`: `id`, `application_id`, `type` (documentTypeEnum), `url`, `status` (documentStatusEnum), `scan_result` (scanResultEnum), `scanned_at`, `metadata` (jsonb).
  - `perfios_sessions`: `id`, `application_id`, `session_token`, `status` (perfiosStatusEnum), `data` (jsonb), `created_at`.
  - `consent_logs`: `id`, `application_id`, `consent_type` (consentStepEnum), `ip_address`, `user_agent`, `accepted_at`, `revoked_at`.
- Enforce standard optimization indexes and PII masking / encryption mapping at the database design level.
- Review existing test expectations in `tests/apply/apply-validation.test.ts`.

Please modify and update the CDD doc `scratchpads/apply-database-cdd.md` cleanly. Write your finalized execution summary to `/home/yash/opencode-workspace/navdhan-redesign-2026/.opencode/factory/subagent-status/database-cdd-summary.md` when completed.
