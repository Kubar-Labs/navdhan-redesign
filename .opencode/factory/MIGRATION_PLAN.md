# Migration Plan — `/apply` Consent-Based Wizard (v1.0.0)

## Scope

This plan applies to the redesigned NavDhan `/apply` loan application wizard. It
introduces a new schema (`borrowers`, `loan_applications`, `ekyc_records`, etc.)
and is intended to replace the legacy `applications` / `applicants` tables once
backfill and validation are complete.

## Migration steps

1. **Create new enum types** (`application_status`, `application_step`, `loan_purpose`, `document_type`, etc.).
2. **Create new tables** in dependency order:
   - `borrowers`
   - `loan_applications`
   - `ekyc_records`, `pan_records`, `gstin_records`, `bank_statements`, `uploaded_documents`, `consents`
   - `idempotency_keys`
3. **Backfill borrowers and loan_applications** from legacy `applications` and `applicants` rows during a maintenance window.
   - Map legacy `applications.loan_amount` → `loan_applications.requested_amount`.
   - Map legacy `applicants.mobile_*` / `email_*` / `aadhaar_*` / `pan_*` to the new PII-safe columns.
   - Generate new UUIDs for `borrowers.id` and `loan_applications.id`; keep a temporary mapping table for rollback.
4. **Migrate uploaded documents** into `uploaded_documents` with normalized `document_type` values (`itr`, `tds_certificate`).
5. **Deploy updated API routes** that read/write only the new schema.
6. **Mark legacy tables as read-only** and keep them for 30 days to support rollback.
7. **Drop legacy tables** after sign-off from product and compliance.

## Rollback

- The legacy schema remains untouched until step 6.
- If rollback is needed before step 6, revert route code and continue using legacy tables.
- After step 6, rollback requires restoring from the mapping table and a database snapshot.

## Data retention / PII notes

- Consent rows are append-only and must be retained for audit.
- Full PII values are never persisted; only hashes, encrypted ciphertext, and masked display values remain.
- `idempotency_keys` rows expire after 10 minutes and can be purged by an scheduled cleanup job.
