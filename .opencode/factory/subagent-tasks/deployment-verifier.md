# Visual Verification Report — Remediations

You must verify that all visual and translation remediations have been successfully applied on `http://localhost:3001`:

1. **Apply Wizard:**
   - Navigate to `http://localhost:3001/en/apply`.
   - Fill valid details on Step 1 and continue.
   - Verify that Step 2 now fully displays input fields for Full Name, Email Address, Mobile Number, and Requested Loan Amount. Take a screenshot named `apply-wizard-step2-fixed-en.png`.
2. **Terms of Service:**
   - Navigate to `http://localhost:3001/en/legal/terms-of-service` and verify that it resolves successfully to the legal content without returning a 404. Take a screenshot named `legal-terms-of-service-fixed-en.png`.
3. **Team Roster & Roles:**
   - Navigate to `http://localhost:3001/en/team`.
   - Verify that Alok's leader card is present in the roster and Divyesh Reddy's role matches `"Borrower Onboarding"`. Take a screenshot named `team-desktop-fixed-en.png`.
4. **Hindi Localizations Parity:**
   - Navigate to `http://localhost:3001/hi/team`.
   - Verify that the core values and mission banner are completely translated. Take a screenshot.
   - Navigate to `http://localhost:3001/hi/legal/privacy-policy` and verify that the page body is fully localized. Take a screenshot.

Please compile your report in `.opencode/factory/visual-verification-report.md`.
