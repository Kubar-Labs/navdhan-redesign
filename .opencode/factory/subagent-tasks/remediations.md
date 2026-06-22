# Visual Verification Remediations

You must implement the specified visual and content remediations to achieve a 100% green pass on the deployment gate compared to the Google Stitch layout screens.

---

## Detailed Requirements

### 1. Apply Form Step 2 & Summary (ApplyWizard.tsx)
Update `/home/yash/opencode-workspace/navdhan-redesign-2026/src/components/apply/ApplyWizard.tsx`:
* **Hook State:** Expand the `form` hook at line 49 to include:
  - `fullName: ""`
  - `email: ""`
  - `phone: ""`
  - `requestedAmount: ""`
* **Step 2 DOM Inputs:** Under `step === 2`, render these four fields inside a beautifully styled card (matching the styling of Step 1 card):
  - **Full Name (`fullName`)**: Label `{messages.fullNameLabel ?? "Full name"}`. Text input.
  - **Email (`email`)**: Label `{messages.emailLabel ?? "Email"}`. Email input.
  - **Mobile Phone (`phone`)**: Label `{messages.mobileLabel ?? "Mobile number"}`. Tel input with placeholder `{messages.mobilePlaceholder ?? "10-digit mobile"}`.
  - **Loan Amount (`requestedAmount`)**: Label `{messages.amountLabel ?? "Loan amount"}`. Text or number input.
  * Render errors below each field using `errors.fullName`, `errors.email`, `errors.phone`, `errors.requestedAmount`.
* **Step 2 Validations:** Implement `validateStep2()`:
  - Full Name: check `!form.fullName.trim()`.
  - Email: check regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` or basic format.
  - Mobile: check regex `/^\d{10}$/` (exactly 10 digits).
  - Loan Amount: check `!form.requestedAmount.trim()` and parse as a positive float/integer.
  * Store messages inside the `errors` state.
* **handleNext Hook:** Modify `handleNext` to check `validateStep2()` when `step === 2`.
* **Step 3 Review Summary:** Under `step === 3` or as an intermediate review before final submit:
  - Display a beautiful list summarizing all 7 values entered:
    - Business name, business type, annual turnover
    - Contact person, email, mobile phone, requested loan amount
  - Render the consent checkboxes and submit button dynamically from `messages`. On clicking final submit, transition to the success thank you state.
* **Localization:** Pull all form field labels, placeholder strings, and stepper labels dynamically from `messages` (e.g., `messages.fullNameLabel`, `messages.wizard.stepIndicator`, etc.). This guarantees that they render correctly in Hindi on `/hi/apply`!

### 2. Legal Slugs Resolution (loader.ts)
Update `/home/yash/opencode-workspace/navdhan-redesign-2026/src/lib/legal/loader.ts`:
* In `isValidLegalSlug(value: string)`: allow `"terms-of-service"` by returning true.
* In `loadLegalPage(locale, slug)`: if `slug === "terms-of-service"`, rewrite the target variable `slug` to `"terms-of-use"`.
* This resolves the 404 on `/en/legal/terms-of-service` dynamically without duplicating JSON files!

### 3. Team Roster & Roles Sync (team.json)
Update `/home/yash/opencode-workspace/navdhan-redesign-2026/src/lib/data/team.json`:
* Change Divyesh Reddy's `roleKey` from `"Marketplace Onboarding"` to `"Borrower Onboarding"`.
* Append the leader profile for **Alok** to the end of the `members` list:
  ```json
  {
    "id": "alok",
    "name": "Alok",
    "roleKey": "Technology Operations",
    "bioKey": "Ensuring high availability, scale, and reliable digital systems for MSME credit.",
    "imageAsset": "/assets/team/alok.png",
    "linkedIn": "https://linkedin.com"
  }
  ```

### 4. Language Translations Parity (en.json & hi.json)
Update translation files to ensure complete localized parity:

#### Update `en.json` (under `team.values`):
- Match core value titles to exactly: `"Empathy"`, `"Transparency"`, `"Speed"` (instead of "Empathy first", "Radical transparency", "Speed with care").

#### Update `hi.json`:
- **Under `team.values`**: Localize the value names and bodies to Hindi:
  - Empathy ➜ `"सहानुभूति (Empathy)"`, body: `"हम ऋणदाता की सुविधा के बजाय उधारकर्ता की वास्तविक चिंताओं को ध्यान में रखकर काम करते हैं।"`
  - Transparency ➜ `"पारदर्शिता (Transparency)"`, body: `"कोई छिपा हुआ शुल्क नहीं, कोई जटिल शब्दावली नहीं। स्पष्ट शर्तें जिन्हें आप सत्यापित कर सकते हैं।"`
  - Speed ➜ `"गति (Speed)"`, body: `"निर्णय जल्दी लिए जाते हैं क्योंकि हमारी प्रणालियाँ भारी कार्य को संभालती हैं।"`
- **Under `team`**: Add localized team mission body and advisor title details.
- **Under `apply`**: Add localized validation errors, consent copy, and wizard step labels so the entire form is in Hindi.
- **Under `legal` (and localized legal files)**: Replace English placeholder bodies for `terms-of-use.json`, `privacy-policy.json`, `fair-practices-code.json`, and `grievance-redressal.json` under `/content/legal/hi/` with brief, proper Hindi translations or translated headings so they are fully localized for Hindi users.

---

## Verification
* Run `npm test -- tests/i18n` to verify all 29 tests pass successfully.
* Compile the build locally: `npm run build` and ensure zero errors.
