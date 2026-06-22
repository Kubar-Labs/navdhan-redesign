# Task: apply-frontend-completion — Finish the /apply loan portal UI

## Branch
`factory/navdhan-redesign/apply/frontend`

## Start state
The branch equals `factory/navdhan-redesign/stage-5-foundation`. Foundation includes some apply components under `app/apply/_components/`, shared types, i18n, and the design tokens. The API may be incomplete; treat it as a contract target, not a dependency.

Your job: finish the apply frontend so it is complete, buildable, and committed.

## Priority order
1. `git checkout factory/navdhan-redesign/apply/frontend`.
2. Inspect existing apply components in `app/apply/_components/` and `src/`.
3. Finish missing wizard step components, layouts, and wiring:
   - `app/apply/layout.tsx` and `app/apply/page.tsx`
   - Complete any incomplete step components (LoanIntent, PersonalContact, AadhaarVerification, PanVerification, GstVerification, ItrUpload, BankStatements, ReviewSubmit, SubmissionResult)
   - `src/lib/apply/api.ts` typed client for `/api/apply/*` using `Idempotency-Key`
   - `src/lib/apply/state.ts` state machine and reducer
   - `src/lib/apply/validation.ts` Zod schemas matching contract
4. Ensure copy uses warm English + subtle Hinglish, with `next-intl` keys in `messages/en.json` and others.
5. Loan amount ₹5L–₹1Cr, tenure 3–12 months, rate 12–24%.
6. Consent checkboxes link to `/legal/consent-policy` and `/legal/privacy-policy`.
7. Use the existing UI shell styling (Header/Footer optional in apply flow).
8. Run `npm run build` and fix errors.
9. Commit with `feat(apply): complete multi-step loan portal UI`.
10. Write `scratchpads/apply-frontend-completion-summary.md`.

## Constraints
- Do NOT touch backend route handlers in `app/api/apply/**`.
- Do NOT modify tests in `tests/apply/**`.
- Use `Idempotency-Key` header for every mutating API call.
