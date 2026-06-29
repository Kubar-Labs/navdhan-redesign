# Database Subagent Summary

## What was done

1. Aligned `src/db/schema.ts` with the Apply Portal data model:
   - Added the `bank_statement_status` enum.
   - Added the `bank_statements` table (canonical name in `db-schema.yaml` / approved database CDD; the previous working name was `perfios_sessions`).
   - The table references `applications.id` with `ON DELETE CASCADE`, stores PII-encrypted account numbers, Perfios transaction IDs, statement months, analysis score, raw payload, and timestamps.
   - Added indexes on `(application_id)`, `(perfios_transaction_id)`, and `(status, analyzed_at)`.
   - Added the `months BETWEEN 6 AND 12` check constraint.

2. Monetary columns continue to use `DECIMAL(19,4)` across the schema (e.g., `applications.loan_amount`, `lender_offers.loan_amount`, `lender_offers.emi_amount`).

3. Generated the next Drizzle migration:
   - `src/db/migrations/0001_opposite_vision.sql`
   - Updated journal: `src/db/migrations/meta/_journal.json`
   - Updated snapshot: `src/db/migrations/meta/0001_snapshot.json`

4. Verified the type check compiles cleanly with `npm run build`.

## Files changed

- `src/db/schema.ts`
- `src/db/migrations/0001_opposite_vision.sql`
- `src/db/migrations/meta/_journal.json`
- `src/db/migrations/meta/0001_snapshot.json`
