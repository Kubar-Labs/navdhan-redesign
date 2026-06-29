# Frontend Type Fix — WizardShell (remove final duplicate wizard)

You must fix a TypeScript compilation error in `app/apply/_components/WizardShell.tsx` caused by a duplicate `wizard` property in the `WizardMessages` interface.

## Error Details
During compilation, Next.js build failed with:
`Type error: Duplicate identifier 'wizard'.` in `app/apply/_components/WizardShell.tsx` line 44.

## Location
- File: `/home/yash/opencode-workspace/navdhan-redesign-2026/app/apply/_components/WizardShell.tsx`
- On lines 44-48, we have:
  ```typescript
  wizard?: {
    back?: string;
    next?: string;
    stepTitles?: Partial<Record<WizardStepId, string>>;
  };
  ```
- On lines 114-118, we ALSO have the exact same property:
  ```typescript
  wizard?: {
    back?: string;
    next?: string;
    stepTitles?: Partial<Record<WizardStepId, string>>;
  };
  ```

## Requirements
1. Remove the second duplicate `wizard` property declaration (lines 114-118) from the `WizardMessages` interface. The interface definition should end directly with:
  ```typescript
    privacyPolicy?: string;
    consentPolicy?: string;
    consentDataPrefix?: string;
  }
  ```
2. Verify that the file compiles cleanly by running a local build command: `npm run build`.

Please execute this fix cleanly and with zero extra unrequested abstraction.
