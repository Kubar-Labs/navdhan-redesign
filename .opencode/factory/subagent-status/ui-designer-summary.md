# UI Designer Summary

## Task

Design the component interfaces, layout parameters, and props for the redesigned `/apply` loan application portal, aligning them with the Calm Credibility design system and the API contract.

## What was done

1. **Reviewed source material**
   - `DESIGN.md` for tone, tokens, and apply microcopy
   - `api-contract.yaml` for step sequence, schemas, and consent payloads
   - Existing `src/components/apply/ApplyWizard.tsx` to understand current structure
   - `.opencode/factory/stitch-state.json` for design system tokens

2. **Designed four required components**
   - `ApplyWizard` — state wrapper and responsive layout grid (centered max-w-2xl white card, rounded-2xl, slate-200 border, diffused shadow)
   - `ConsentModal` / `ConsentOverlay` — Sahamati-aligned disclosures with purpose, data points, accessors, versioned statement snapshot, and explicit checkbox trigger
   - `PerfiosVerificationStep` — dynamic verification shell supporting eKYC OTP, PAN link status, GSTIN validation/GST returns, and Net Banking analysis loader
   - `DocumentUploadZone` — drag-and-drop upload zone for `itr` and `tds_certificate` with MIME/size validation and status feedback

3. **Updated the UI component registry**
   - Bumped `ui-component-registry.json` to v1.1.0
   - Added shared types matching API contract schemas (`ApplicationStep`, `ApplicationStatus`, `LoanPurpose`, `DocumentType`, `LinkStatus`, `VerificationMode`, `ConsentReceipt`, `FinalConsents`, `SubmissionResult`, `Document`, `ApiError`)
   - Recorded each component's location, props, slots, variants, and styling notes
   - Added `messageShapes` for `ApplyMessages` and `PerfiosStepMessages`

4. **Delivered status report**
   - Wrote `subagent-status/ui-designer-design.json`
   - Wrote this summary file

## Notes for @frontend

- Implement components exactly to the prop interfaces in `ui-component-registry.json`
- All monetary display uses whole INR integers from the API; never format as floats for currency
- Consent modals must block progress until affirmative opt-in is captured and recorded
- `PerfiosVerificationStep` receives a pre-captured `ConsentReceipt`; it does not collect consent itself
- `DocumentUploadZone` must enforce 5 MB PDF limit client-side before calling `/apply/documents/upload`
- Use rounded-xl (12 px) cards, 1 px `nt-slate-200` borders, and `bg-nt-cream` for disclosure panels
- Respect `prefers-reduced-motion` for any loading states
