# Database Schema Implementation

You must implement the database migrations and schemas for the Apply Portal based on `.opencode/factory/db-schema.yaml` and the approved database CDD.

## Requirements
1. **Drizzle ORM Models:** Define the type-safe table definitions inside `/home/yash/opencode-workspace/navdhan-redesign-2026/src/db/schema.ts` for:
   - `applications`
   - `documents`
   - `perfios_sessions`
   - `offers`
2. **PostgreSQL Migrations:** Generate and track drizzle migrations under `/home/yash/opencode-workspace/navdhan-redesign-2026/src/db/migrations/`.
3. **Decimal handling:** Ensure all monetary columns use DECIMAL(19,4) to guarantee zero float rounding errors.

Verify type check compiles perfectly.
