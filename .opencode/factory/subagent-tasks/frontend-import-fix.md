# Frontend Import Resolution & Build Fix

You must resolve an import path mismatch in `app/apply/_components/WizardShell.tsx` which is currently preventing the production build compilation on Vercel.

## Root Cause
In `/home/yash/opencode-workspace/navdhan-redesign-2026/app/apply/_components/WizardShell.tsx` line 6-13, the following constants are imported from `constants.ts`:
- `LOAN_AMOUNT_MAX`
- `LOAN_AMOUNT_MIN`
- `LOAN_AMOUNT_STEP`
- `PURPOSE_OPTIONS`
- `TENURE_MAX`
- `TENURE_MIN`

However, these constants are actually declared and exported from `app/apply/lib/validation.ts`, not `constants.ts`. This causes the build compiler to throw an import resolution error.

## Requirements
1. **Modify Import Path:** Edit `/home/yash/opencode-workspace/navdhan-redesign-2026/app/apply/_components/WizardShell.tsx` to import the 6 constants from `validation.ts` instead of `constants.ts`:
   ```typescript
   import {
     LOAN_AMOUNT_MAX,
     LOAN_AMOUNT_MIN,
     LOAN_AMOUNT_STEP,
     PURPOSE_OPTIONS,
     TENURE_MAX,
     TENURE_MIN,
   } from "@/app/apply/lib/validation";
   ```
2. **Local Compilation Check:** Run `npm run build` inside `/home/yash/opencode-workspace/navdhan-redesign-2026` to ensure that Next.js compilation, TypeScript, and linting pass with zero errors on disk.
3. **Run Tests:** Run `npm test -- tests/apply` to verify that all 110 tests pass green successfully.
