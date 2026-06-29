# UI Designer Component Design Task

You must design the component interfaces, layout parameters, and props for the redesigned `/apply` loan application portal, aligning them with the compiled design system ("Calm Credibility") and the API contracts.

## Scope & Contracts
- **API Contract:** `/home/yash/opencode-workspace/navdhan-redesign-2026/.opencode/factory/api-contract.yaml` (specifies steps: loan_intent, personal_contact, aadhaar_verification, pan_verification, gst_verification, bank_statements, itr_upload, review_submit).
- **Stitch Design System:** Follow the Surface Cream base, White card layouts, rounded-xl (12px) shapes, 1px slate-200 borders, and highly diffused ambient shadows from the compiled project.
- **Sahamati Consent-Based Design:** Review and align with consent-based design principles (clear transparency disclosures, purpose statements, and explicit consent modals prior to third-party data pulls like Aadhaar, PAN, GST, and Net Banking statements).

## Your Actions
1. Design the Next.js client-side component interfaces and prop signatures for:
   - `ApplyWizard` (state wrapper and layout grid)
   - `ConsentOverlay` / `ConsentModal` (Sahamati disclosures, purpose description, and checkbox trigger)
   - `PerfiosVerificationStep` (renders dynamic eKYC, PAN status, GST returns, or Net Banking statement analysis loader)
   - `DocumentUploadZone` (ITR and TDS certificate file-drop fields)
2. Record the designed component schemas and props inside `/home/yash/opencode-workspace/navdhan-redesign-2026/.opencode/factory/ui-component-registry.json`.
3. Output your status report to `/home/yash/opencode-workspace/navdhan-redesign-2026/.opencode/factory/subagent-status/ui-designer-design.json`.
