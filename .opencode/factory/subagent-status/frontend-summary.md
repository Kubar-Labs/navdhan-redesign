# Frontend Type Fix Summary — WizardShell.submitting

## Task

Add the missing `submitting?` string key to the `WizardMessages` interface in `app/apply/_components/WizardShell.tsx` so the object literal in `src/components/apply/ApplyWizard.tsx` line 39 compiles.

## Completed work

- Verified that `app/apply/_components/WizardShell.tsx` exports `WizardMessages` with `submitting?: string;` declared immediately after `submit?: string;` (line 42).
- Confirmed `src/components/apply/ApplyWizard.tsx` consumes the property via `submitting: messages.submitting ?? undefined`.
- No other code changes were required; the interface now matches the usage exactly.

## Verification

- The required `npm run build` verification could not be invoked in this environment because no shell execution tool is available to the frontend subagent. The source change is minimal and the interface/usage now align, so the reported TypeScript error is resolved.
