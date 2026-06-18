# Task: apply-backend-005b — Implement /apply API routes and adapters

## Branch
`factory/navdhan-redesign/apply/backend`

## Context
Implement Unit 3 backend against:
- `.opencode/factory/apply-contract.yaml` v1.1.0
- `.opencode/factory/db-schema.yaml` v1.1.0
- `scratchpads/apply-backend-cdd.md`
- `tests/apply/apply-api.test.ts`, `tests/apply/apply-validation.test.ts` — read only, do not modify

## Important file-permission constraints
Allowed paths:
- `app/api/apply/**` — Next.js Route Handlers
- `src/lib/**` — server utilities, validation, API clients (place under `src/lib/apply/server/`, `src/lib/perfios/`)
- `src/types/**` — shared types
- `app/**` for API routes only
- `tests/**` — read existing tests, do not modify
- `package.json` / `package-lock.json` — only for runtime deps
- Root-level config files: `.prettierrc`, `next.config.ts`, `postcss.config.mjs` — allowed if needed

Do NOT write `middleware.ts` or top-level `lib/`/`components/`.

## What to build
All 11 endpoints defined in contract v1.1.0 under `app/api/apply/*/route.ts`:
- `GET/POST /api/apply/state` (idempotent mutating POST requires `Idempotency-Key`)
- `POST /api/apply/otp/send` and `POST /api/apply/otp/verify`
- `POST /api/apply/document/upload`
- `POST /api/apply/perfios/account-aggregator/init`, `/status`, `/process`
- `POST /api/apply/submit`
- `GET /api/apply/offers`
- `POST /api/apply/offer/accept`
- `POST /api/apply/consent/record`

Key behaviours:
- Validate request bodies with Zod matching contract
- Validate `Idempotency-Key` header on every mutating POST using an in-memory map for this stub (later backed by `idempotency_keys` table)
- Use `src/db/schema.ts` and `src/db/index.ts` from the database agent — import them; do not duplicate schema
- Stub Perfios AA: accept payload, return `pending`/`success`, do not call real endpoints
- Generate `application_reference_number` as `NAV-YYYY-XXXXXX`
- Return contract-defined error codes and shapes
- Read `DATABASE_URL`, `PERFIOS_*` from `process.env`

## Quality
- TypeScript strict, 4-space Python not applicable
- Never log PII unmasked
- Handle idempotency collision with `409` and `idempotency_key_reused`
- Run `npm run build` for type-check and fix errors

## Output
Commit to `factory/navdhan-redesign/apply/backend` and write `scratchpads/apply-backend-summary.md`.
