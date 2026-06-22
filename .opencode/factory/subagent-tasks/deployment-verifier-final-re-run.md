# Deployment Verification Re-run

You must execute the final visual and DOM-level verification audit against the running production build on `http://localhost:3001` to confirm that all 15 screens from the Stitch dashboard are fully implemented, functional, and translated.

## Context
A previous verification run returned a FAIL because the Next.js server had cached static files from before the latest Hindi legal translations were completed. We have now re-built the production site and restarted the server on port 3001. You must run a fresh verification pass to check if all localizations are active.

## Verification Checklist

### 1. Multi-Step Apply Wizard (`/en/apply` & `/hi/apply`)
- Navigating to `/en/apply` should load Step 1 successfully. Fill the form, proceed to Step 2, and confirm that Step 2 renders the following React inputs in the DOM:
  - Full Name (`fullName` input)
  - Email Address (`email` input)
  - Mobile Number (`mobile` input)
  - Requested Loan Amount (`loanAmount` input)
- Confirm that `/hi/apply` loads step 1 and step 2 fully localized in Hindi.
- Take screenshots: `apply-wizard-step2-fixed-en.png` and `apply-wizard-step2-fixed-hi.png`.

### 2. Legal Pages (`/en/legal/*` & `/hi/legal/*`)
- Confirm that `/en/legal/terms-of-service` loads the Terms of Use content cleanly without returning a 404 Route Mismatch (it should serve the custom Terms of Use content).
- Confirm that all legal pages (Terms of Use, Privacy Policy, Fair Practices Code, Cookie Policy, RBI DLG Disclosure, Consent Policy, Grievance Redressal) are fully translated into Hindi when accessed via `/hi/legal/...`. Check that the text bodies contain actual Hindi translations rather than English placeholders.
- Take screenshots: `legal-privacy-policy-fixed-hi.png` and `legal-terms-of-service-fixed-hi.png`.

### 3. Our Team Page (`/en/team` & `/hi/team`)
- Confirm that Alok appears in the leadership grid with Name, Title, and Biography.
- Confirm that Divyesh Reddy's role is correctly displayed as `"Borrower Onboarding"`.
- Confirm that `/hi/team` is fully translated into Hindi (including the Mission banner heading/body and all 3 Core Values cards: Empathy first, Radical transparency, and Speed with care).
- Take screenshots: `team-desktop-fixed-en.png` and `team-desktop-fixed-hi.png`.

## Requirements
- Output the results in detail to `.opencode/factory/visual-verification-report.md`.
- Save all verification screenshots under `.opencode/factory/`.
- Write a final summary of checking results to `.opencode/factory/subagent-status/deployment-verifier-summary.json` and `.opencode/factory/subagent-status/deployment-verifier-summary.md`.
