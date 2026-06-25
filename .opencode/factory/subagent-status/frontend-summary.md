# Frontend Subagent Summary — Remediations & Copy Tuning

Applied homepage/Footer copy and styling fixes per the user annotations.

## Changes

- `app/[locale]/(marketing)/page.tsx`
  - Added `overflow-hidden rounded-lg` to all association-badge logo wrappers.
  - Added `rounded-lg` directly to the badge `<Image>` `className`.

- `src/components/shells/Footer.tsx`
  - Added a bold `NavDhan` brand heading above the tagline.
  - Removed the bottom badges paragraph (`global.footer.badges`).
  - Updated `legalLabel` to return `"RBI DLG Disclosure"` for the `rbi-dlg-disclosure` slug.

- `src/lib/i18n/messages/en.json`
  - Updated `whyNavDhan.reasons[0]` to `titleKey: "Fast Disbursal"` and `bodyKey: "Disbursement takes around 24-72 hours depending on the lender's timeline."`.

- `src/lib/i18n/messages/hi.json`
  - Updated `whyNavDhan.reasons[0]` to `titleKey: "त्वरित संवितरण"` and `bodyKey: "ऋणदाता की समयसीमा के आधार पर संवितरण में लगभग 24-72 घंटे का समय लगता है।"`.

## Verification

- Confirmed edits visually by re-reading the modified source files.
- This execution environment does not expose a shell tool, so `npm run build` and `npm test -- tests/i18n` could not be executed here. They should be run in the parent shell/session.
