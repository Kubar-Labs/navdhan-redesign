# Database CDD Refinement: Apply Portal Rebuild

Refine the ORM (Drizzle) structures, indexes, and optimization configurations for `applications`, `documents`, `perfios_sessions`, and `consent_logs` tables to update the Component Design Document `scratchpads/apply-database-cdd.md`.

## Instructions
1. Review `/home/yash/opencode-workspace/navdhan-redesign-2026/.opencode/factory/db-schema.yaml` as the absolute source of truth.
2. Formulate the technical specifications for all required tables and relationships:
   - Schema Definitions: Columns, datatypes, non-nullable restrictions, and default values matching `db-schema.yaml`.
   - Money Fields: Map all monetary amount fields to native decimal representations (DECIMAL 19,4).
   - Indexes and Keys: Unique constraints, primary key configurations, and optimization index definitions (e.g. index on application status or consent logs session id).
   - Database-level locking: Row-level locking and transaction isolated read strategies.
3. Write/update the database Component Design Document (CDD) under `scratchpads/apply-database-cdd.md` to reflect these exact specifications. No production migrations or code are to be committed.
