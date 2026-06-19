# Task: Apply Wizard Rebuild — Full multi-step loan application

## Branch
`factory/navdhan-redesign/apply/frontend`

## Goal
Rebuild `/apply` into a complete inline multi-step loan application matching the Sahamati consent-based design guidelines and the apply contract v1.1.0.

## Required steps (9)
1. Loan Intent — amount (₹5L–₹1Cr), tenure (3–12 months), purpose, referral code
2. Personal & Contact — name, mobile, email, PIN code, business type
3. Aadhaar eKYC Verification — Aadhaar + OTP simulation
4. PAN & Aadhaar Link Status — PAN input + validation
5. GSTIN + GST Return History — GSTIN + verification stub
6. Bank Statement Analysis — Perfios account aggregator stub flow
7. Income Tax Returns (3 years) — file upload stub
8. Form 26AS — TDS Certificate — file upload stub
9. Review & Submit — summary + consent + submit

## UX / consent requirements
- Use the existing `app/apply/_components/ConsentPanel.tsx` component (per-purpose checkboxes, link support, invalid state).
- Show clear step indicator.
- Validate client-side using `app/apply/lib/validation.ts`; show warm, natural error copy (no em-dashes).
- Persist only to React state for this rebuild; do NOT store PII in localStorage. If you remove existing localStorage usage, ensure no errors.
- Explain why each data point is needed before requesting it (purpose-limited).
- Consent checkboxes must link to `/legal/consent-policy` and `/legal/privacy-policy`.
- Honor reduced motion.

## API integration
- Call `/api/apply/state` with `Idempotency-Key` header for state mutations.
- Call stub endpoints `/api/apply/otp/send`, `/api/apply/otp/verify`, `/api/apply/document/upload`, `/api/apply/perfios/account-aggregator/init`, `/api/apply/submit`, `/api/apply/offers`.
- Handle 409 idempotency errors gracefully.

## What to deliver
- `app/[locale]/apply/page.tsx` as the wizard page.
- Re-use and complete `app/apply/_components/*` step components.
- Update `app/apply/lib/api.ts` if needed.
- Add test IDs / basic vitest tests in `tests/apply/*` if time permits.
- Do NOT modify tests from `tests/apply/apply-validation.test.ts` or `apply-api.test.ts` except to update expected routes that changed.

## Build & commit
- `npm run build` must pass.
- Commit to `factory/navdhan-redesign/apply/frontend`.
- Write `scratchpads/apply-wizard-summary.md`.
