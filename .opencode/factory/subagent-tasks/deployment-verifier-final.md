# Final Deployment Visual Verification

You must perform the final visual and DOM-level verification against `http://localhost:3001` to confirm that all visual and translation remediations have been successfully applied, built, and served on the production website.

## Requirements

1. **Verify Apply Wizard Step 2:**
   - Navigate to `http://localhost:3001/en/apply`.
   - Fill Step 1 and proceed to Step 2.
   - Confirm that Step 2 rendered input fields for Full Name, Email address, Mobile number, and Requested loan amount.
   - Capture a screenshot `apply-wizard-step2-fixed-en.png`.

2. **Verify Terms of Service page resolves:**
   - Navigate to `http://localhost:3001/en/legal/terms-of-service`.
   - Confirm it serves the "Terms of Use" page content with zero 404 Route Mismatches.
   - Capture a screenshot `legal-terms-of-service-fixed-en.png`.

3. **Verify Team Roster & Roles:**
   - Navigate to `http://localhost:3001/en/team`.
   - Verify Alok's card is present in the leadership grid.
   - Verify Divyesh Reddy's role renders as `"Borrower Onboarding"`.
   - Capture a screenshot `team-desktop-fixed-en.png`.

4. **Verify Hindi Localization Parity:**
   - Navigate to `/hi/team` (Hindi team page). Verify that the Mission banner and Core Values cards are completely localized in Hindi (`"हमारा मिशन"`, `"सहानुभूति (Empathy)"`, `"पारदर्शिता (Transparency)"`, `"गति (Speed)"`).
   - Navigate to `/hi/legal/privacy-policy` (Hindi privacy policy). Verify that the page body is completely localized in Hindi instead of English placeholders.
   - Capture a screenshot `team-desktop-fixed-hi.png` and `legal-privacy-policy-fixed-hi.png`.

5. **Write Report:**
   - Write the final visual-verification-report.md inside `.opencode/factory/` and a summary JSON inside `.opencode/factory/subagent-status/` marking overall status as `success`.
