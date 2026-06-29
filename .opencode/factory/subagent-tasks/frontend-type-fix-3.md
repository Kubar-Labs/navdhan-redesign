# Frontend Type Fix — WizardShell (restore wizard property)

You must restore the `wizard` property in the `WizardMessages` interface in `/home/yash/opencode-workspace/navdhan-redesign-2026/app/apply/_components/WizardShell.tsx` which was accidentally removed entirely.

## Error Details
During compilation, Next.js build failed with:
`Type error: Property 'wizard' does not exist on type 'Partial<WizardMessages>'.` in `src/components/apply/ApplyWizard.tsx` line 56.

## Location
- File: `/home/yash/opencode-workspace/navdhan-redesign-2026/app/apply/_components/WizardShell.tsx`
- In `WizardMessages` interface definition (which ends on line 109), add the `wizard` property:
  ```typescript
  export interface WizardMessages {
    ...
    privacyPolicy?: string;
    consentPolicy?: string;
    consentDataPrefix?: string;
    wizard?: {
      back?: string;
      next?: string;
      stepTitles?: Partial<Record<WizardStepId, string>>;
    };
  }
  ```

## Requirements
1. Restore the `wizard` property to the `WizardMessages` interface definition inside `/home/yash/opencode-workspace/navdhan-redesign-2026/app/apply/_components/WizardShell.tsx` (right before line 109).
2. Verify that the file compiles cleanly by running a local build command: `npm run build`.

Please execute this fix cleanly and with zero extra unrequested abstraction.
