# Frontend Apply CDD Refinement

You must review and refine the component design document for the redesigned `/apply` dynamic multi-step loan wizard.

## Goals & Constraints
1. **Sahamati Consent-Based Design:** Incorporate specific consent-based design overlays, modals, and checkboxes based on the Sahamati guidelines from the design brief:
   - Clear disclosure of data points (Aadhaar, PAN, GST, bank statements).
   - Clear statement of purpose and data accessors (lenders/underwriters).
   - Frictionless consent acceptance and revocation handling.
2. **Component Interface Alignments:** Ensure all designed components match `/home/yash/opencode-workspace/navdhan-redesign-2026/.opencode/factory/ui-component-registry.json` exactly:
   - `ApplyWizard`: state machine, step renders, localized translation maps.
   - `ConsentPanel`: layout cards, bullet list of data accessors.
   - `AadhaarVerificationStep` / `PanVerificationStep`: verification statuses, interactive focus OTP inputs.
   - `GstVerificationStep` & `BankStatementStep`: Perfios API triggers, loading states, success screens.
   - `DocumentUploadStep`: File dropzones, upload progress bars, scan validation checks.
   - `ReviewSubmitStep` & `Stepper` & `OtpInput`.
3. **Sahamati-Compliant Copy:** Move all localized texts, consent headers, labels, and error namespaces into `en.json` and `hi.json` to guarantee complete multilingual language parity.
4. **Testing Harness:** Ensure structural compliance with `tests/apply/apply-wizard.test.tsx` and `tests/apply/apply-validation.test.ts`.

Please modify `/home/yash/opencode-workspace/navdhan-redesign-2026/scratchpads/apply-frontend-cdd.md` to specify these architectures, and write your completion summary to `/home/yash/opencode-workspace/navdhan-redesign-2026/.opencode/factory/subagent-status/frontend-cdd-summary.md`. Do not commit production code.
