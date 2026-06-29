# Frontend Apply Portal Implementation Task

You must implement the complete 8-step visual and interactive ApplyWizard layout at `/apply` per `.opencode/factory/api-contract.yaml` (v1.1.0) and the approved frontend CDD in `scratchpads/apply-frontend-cdd.md`.

## Requirements
1. **ApplyWizard Component:** Refactor `/home/yash/opencode-workspace/navdhan-redesign-2026/src/components/apply/ApplyWizard.tsx` to handle the 8 progressive steps exactly:
   - Step 1: `loan_intent` (basic details, loan amount request, purpose, and referral code).
   - Step 2: `personal_contact` (full name, email, mobile number).
   - Step 3: `aadhaar_verification` (Aadhaar eKYC OTP send and verify overlay).
   - Step 4: `pan_verification` (PAN & Aadhaar Link Status check).
   - Step 5: `gst_verification` (GSTIN + GST Return History retrieve).
   - Step 6: `itr_upload` (Upload Income Tax Returns 3 Years).
   - Step 7: `bank_statements` (Net Banking bank statement analysis).
   - Step 8: `review_submit` (final review details & submit overlay).
2. **Consent-Based Design Overlays:** Implement beautiful, Sahamati-compliant consent overlay cards (`src/components/apply/ConsentOverlay.tsx`) for Aadhaar, ITR upload, and Bank statements.
3. **Step Stepper:** Add a visual step stepper at the top of the card and a responsive navigation footer at the bottom.
4. **Multilingual Parity:** Ensure complete translations for all new labels and stepper descriptions inside `en.json` and `hi.json` so English/Hindi toggle is fully functional.

Ensure visual excellence, responsive layout, and zero shortcuts.
