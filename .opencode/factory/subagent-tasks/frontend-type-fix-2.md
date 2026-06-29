# Frontend Type Fix — WizardShell (submitting property)

You must fix a TypeScript compilation error in `src/components/apply/ApplyWizard.tsx` caused by a missing `submitting` property in the `WizardMessages` interface.

## Error Details
During compilation, Next.js build failed with:
`Type error: Object literal may only specify known properties, and 'submitting' does not exist in type 'WizardMessages'.` in `src/components/apply/ApplyWizard.tsx` line 39.

## Location
- File: `/home/yash/opencode-workspace/navdhan-redesign-2026/app/apply/_components/WizardShell.tsx`
- The `WizardMessages` interface needs to have `submitting` declared:
  ```typescript
  export interface WizardMessages {
    back?: string;
    continue?: string;
    submit?: string;
    submitting?: string; // Add this line!
    skip?: string;
    ...
  ```

## Requirements
1. Add `submitting?: string;` inside the `WizardMessages` interface in `/home/yash/opencode-workspace/navdhan-redesign-2026/app/apply/_components/WizardShell.tsx` (around line 42).
2. Verify that the file compiles cleanly by running a local build command: `npm run build`.

Please execute this fix cleanly and with zero extra unrequested abstraction.
