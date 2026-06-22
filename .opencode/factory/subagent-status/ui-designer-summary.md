# UI Designer Summary — Stage 2 Design

## What was done

1. **Read contracts and design brief**
   - `.opencode/factory/api-contract.yaml`
   - `.opencode/factory/db-schema.yaml`
   - `DESIGN.md`

2. **Established UI component registry**
   - Created `.opencode/factory/ui-component-registry.json` with component interfaces, props, message-key mappings, and design tokens aligned with the contract.

3. **Font token system**
   - Documented `--font-inter` (UI/body/forms) and `--font-instrument-serif` (hero emphasis) with Next.js font contract details, fallback stacks, and `font-display: swap` requirement.

4. **Homepage component layout mapping**
   - Mapped `LoanProducts`, `WhyNavDhan`, `RecognitionCarousel`, and `CustomerStories` to their contract message-key arrays and item schemas (`ProductListItem`, `ReasonListItem`, `RecognitionItem`, `StoryCard`).
   - Confirmed list data must come from locale messages, not `siteData.ts`.

5. **Footer interface**
   - Specified `Footer` props and data shape.
   - Documented that `badges` array must render as a single string joined with " · " by `t()`.

6. **Localized apply form interface**
   - Designed `ApplyForm` client component interface mapped to `apply.*` keys.
   - Listed all form fields, validation rules, localized error messages, and the required `Idempotency-Key` header.

7. **Team page layout and roles**
   - Mapped `TeamPage` sections to `team.json` + `team.*` message keys.
   - Noted that the `TeamCard` role key for Divyesh Reddy must change from "Marketplace Onboarding" to "Borrower Onboarding".

## Files created/updated

- `.opencode/factory/stitch-state.json` (created, null project state)
- `.opencode/factory/ui-component-registry.json` (created)
- `.opencode/factory/subagent-status/ui-designer-summary.md` (this file)

## Notes for downstream agents

- Existing `en.json` uses some non-contract key names (`home.whyNavdhan`, `home.stories`, `home.emi`). The registry follows the contract (`home.whyNavDhan`, `home.customerStories`, `home.emiCalculator`) and implementation should migrate accordingly.
- The `apply.*` namespace must be added to all locale JSON files.
- No production code was written.
