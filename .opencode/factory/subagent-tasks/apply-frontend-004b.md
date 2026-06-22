# Task: apply-frontend-004b — Implement the /apply multi-step loan portal UI

## Branch
`factory/navdhan-redesign/apply/frontend`

## Context
You are implementing Unit 3 frontend against:
- `.opencode/factory/Design.md` — copy, animation, voice
- `.opencode/factory/apply-contract.yaml` v1.1.0 — API endpoints, state machine, validation
- `.opencode/factory/apply-ui-registry.json` — component registry
- `scratchpads/apply-frontend-cdd.md`
- `tests/apply/*.test.ts` and `tests/apply/*.test.tsx`

## Important file-permission constraints
Allowed paths only:
- `app/**` — route handlers under `app/api/apply/**` belong to the backend agent; do NOT touch them. App Router pages for `/apply` belong here.
- `src/components/**`
- `src/lib/**` — client helpers, API client, validation schemas
- `src/hooks/**`
- `src/types/**`
- `tests/**` — you may read existing apply tests but do NOT modify or delete them
- `package.json` / `package-lock.json` — only for necessary runtime deps
- `*.css`
- Root-level config files: `.prettierrc`, `next.config.ts`, `postcss.config.mjs` — allowed if needed

Do NOT write `middleware.ts`, or top-level `lib/`, `components/`, etc.

## What to build
- `app/[locale]/apply/page.tsx` — entry page
- `app/[locale]/apply/layout.tsx` — apply-only layout without marketing footer to reduce distraction
- `src/components/apply/` containing all wizard components:
  - `WizardShell`, `Stepper`, `StepContent`
  - `LoanIntentStep`, `PersonalContactStep`
  - `AadhaarVerificationStep`, `PanVerificationStep`, `GstVerificationStep`
  - `ItrUploadStep`, `BankStatementsStep`
  - `ReviewSubmitStep`, `SubmissionResultStep`, `ConsentPanel`
  - `FormField`, `FileUpload`, `OtpInput`, `OfferCard`, `SummaryList`, `ErrorState`, `LoadingState`, `NavigationFooter`
- `src/lib/apply/api.ts` — typed fetch helper calling `/api/apply/*` per contract v1.1.0, passing `Idempotency-Key` header for mutating endpoints
- `src/lib/apply/state.ts` — wizard state machine and reducer
- `src/lib/apply/validation.ts` — Zod schemas matching contract validation
- Loan amount range ₹5L–₹1Cr, tenure 3–12 months, rate 12–24%
- Consent checkboxes linking to `/legal/consent-policy` and `/legal/privacy-policy`
- Warm English + subtle Hinglish copy per Design.md

## Quality
- Strict TypeScript
- Accessible form elements, focus states, error messages
- Subtle Framer Motion transitions, reduced-motion fallback
- Avoid real document uploads for now — use file-to-base64 client-side and send to stubbed API
- Run `npm run build` and fix errors
- Do not modify tests

## Output
Commit to `factory/navdhan-redesign/apply/frontend` and write `scratchpads/apply-frontend-summary.md` with build status.
