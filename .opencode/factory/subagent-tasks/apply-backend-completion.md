# Task: apply-backend-completion — Finish /apply API routes

## Branch
`factory/navdhan-redesign/apply/backend`

## Start state
Branch equals `factory/navdhan-redesign/stage-5-foundation`. Foundation has `src/types/`, `src/db/schema.ts`, and possibly one route stub `app/api/apply/state/route.ts`. The database layer may be incomplete; write only the API layer and assume the DB client/schema exist.

Your job: finish all API routes, make them type-safe and committed.

## Priority order
1. `git checkout factory/navdhan-redesign/apply/backend`.
2. Inspect existing `app/api/apply/` and `src/types/apply.ts`.
3. Implement all routes from `apply-contract.yaml` v1.1.0:
   - `GET /api/apply/state?session_id=` and `POST /api/apply/state`
   - `POST /api/apply/otp/send`, `POST /api/apply/otp/verify`
   - `POST /api/apply/document/upload`
   - `POST /api/apply/perfios/account-aggregator/init`, `/status`, `/process`
   - `POST /api/apply/submit`
   - `GET /api/apply/offers`
   - `POST /api/apply/offer/accept`
   - `POST /api/apply/consent/record`
4. Shared server code under `src/lib/apply/server/`:
   - `idempotency.ts` — in-memory idempotency map keyed by `Idempotency-Key`
   - `validation.ts` — Zod schemas
   - `reference.ts` — generate `NAV-YYYY-XXXXXX`
5. Stub Perfios calls; do not call real Perfios.
6. Return contract-defined error codes and shapes; validate `Idempotency-Key` on mutating POSTs (`409 idempotency_key_reused`).
7. Import DB schema/client from `src/db/schema.ts` and `src/db/index.ts`; if `src/db/index.ts` is missing, create a minimal stub that compiles.
8. Run `npm run build` and fix errors.
9. Commit with `feat(apply): complete API routes and server helpers`.
10. Write `scratchpads/apply-backend-completion-summary.md`.

## Constraints
- Do NOT modify tests in `tests/apply/**`.
- Do NOT modify `src/db/schema.ts`.
- Never log raw PII.
