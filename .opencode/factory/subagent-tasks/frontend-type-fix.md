# Frontend Type Fix — WizardShell

You must fix a TypeScript compilation error in `app/apply/_components/WizardShell.tsx` caused by a duplicate `wizard` identifier in the `WizardMessages` interface.

## Error Details
During compilation, Next.js build failed with:
`Type error: Duplicate identifier 'wizard'.` in `app/apply/_components/WizardShell.tsx` line 43.

## Location
- File: `/home/yash/opencode-workspace/navdhan-redesign-2026/app/apply/_components/WizardShell.tsx`
- The `WizardMessages` interface is defined twice with properties:
  - First:
    ```typescript
    wizard?: {
      stepTitles?: Partial<Record<WizardStepId, string>>;
    };
    ``` (around line 43-45)
  - Second:
    ```typescript
    wizard?: {
      back?: string;
      next?: string;
      stepTitles?: Partial<Record<WizardStepId, string>>;
    };
    ``` (around line 111-115)

## Requirements
1. Remove the first duplicate `wizard` property declaration (lines 43-45) from the `WizardMessages` interface.
2. Keep the second, more complete `wizard` property declaration (lines 111-115) to maintain both backwards compatibility (`back`, `next` buttons text) and namespaced titles.
3. Verify that the file compiles cleanly by running a local build command: `npm run build`.

Please execute this fix cleanly and with zero extra unrequested abstraction.
