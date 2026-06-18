# Task: apply-database-completion — Finish DB client, config, and migration

## Branch
`factory/navdhan-redesign/apply/database`

## Start state
Branch equals `factory/navdhan-redesign/stage-5-foundation`. Foundation has `src/db/schema.ts` but may be missing `src/db/index.ts`, `src/db/drizzle.config.ts`, and migrations.

Your job: make the database layer complete, buildable, and committed.

## Priority order
1. `git checkout factory/navdhan-redesign/apply/database`.
2. Inspect `src/db/schema.ts` against `db-schema.yaml` v1.1.0.
3. Create `src/db/index.ts` — PostgreSQL client singleton using `drizzle-orm/node-postgres` `Pool` with `process.env.DATABASE_URL`.
4. Create `src/db/drizzle.config.ts` — schema `./src/db/schema.ts`, out `./src/db/migrations`, dialect `postgresql`.
5. Run `npm run db:generate` and commit the migration files in `src/db/migrations/`.
   - If generation fails, fix the schema/config until it succeeds.
   - No live database is required; just generate the migration SQL.
6. Export inferred types from `src/types/db.ts`.
7. Run `npm run build` and fix errors.
8. Commit with `feat(db): add apply portal client, drizzle config, and initial migration`.
9. Write `scratchpads/apply-database-completion-summary.md`.

## Constraints
- Do NOT modify `src/db/schema.ts` unless you find a bug that prevents migration generation.
- Do not touch frontend or API implementation files.
