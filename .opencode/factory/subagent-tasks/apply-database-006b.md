# Task: apply-database-006b — Implement apply portal data model and migration

## Branch
`factory/navdhan-redesign/apply/database`

## Context
Implement Unit 3 database layer against:
- `.opencode/factory/db-schema.yaml` v1.1.0
- `.opencode/factory/apply-contract.yaml` v1.1.0
- `scratchpads/apply-database-cdd.md`

## Important file-permission constraints
Allowed paths:
- `src/db/**` — schema, config, client, migrations
- `src/types/**` — shared TypeScript types
- `package.json` / `package-lock.json` — only for runtime deps (drizzle-orm, drizzle-kit, pg already present)
- `tests/**` — read-only
- Root-level config files: `.prettierrc`, `next.config.ts`, `postcss.config.mjs` — allowed if needed

Do NOT write root-level `drizzle.config.ts`; use `src/db/drizzle.config.ts` (the package.json scripts already use `--config=src/db/drizzle.config.ts`). Do NOT write `middleware.ts`.

## What to build
- `src/db/schema.ts` — Drizzle ORM table definitions matching `db-schema.yaml` v1.1.0:
  - `applications`, `applicants` (with `pii_key_id`), `documents`, `consents`, `lender_offers`
  - `application_events`, `otp_attempts`, `idempotency_keys`
  - Enums, indexes, foreign keys, DECIMAL(19,4) money columns
- `src/db/index.ts` — `drizzle(pool)` client singleton using `process.env.DATABASE_URL`
- `src/db/drizzle.config.ts` — Drizzle Kit config with `schema: "./src/db/schema.ts"`, `out: "./src/db/migrations"`
- `src/db/migrations/` — generate an initial migration with `npm run db:generate` (or write SQL equivalent; note we cannot run a real DB here, so generate migration file only)
- TypeScript types inferred from Drizzle schema and exported from `src/types/db.ts`

## Quality
- Strict TypeScript
- Use `pg` driver; `drizzle-orm/node-postgres` with `Pool`
- Monetary columns `decimal({ precision: 19, scale: 4 })`
- PII fields noted in comments; no encryption implementation required for v1
- Run `npm run db:generate` and commit generated migration; if it fails, fix schema/config until it succeeds
- Run `npm run build` for type-check

## Output
Commit to `factory/navdhan-redesign/apply/database` and write `scratchpads/apply-database-summary.md`.
