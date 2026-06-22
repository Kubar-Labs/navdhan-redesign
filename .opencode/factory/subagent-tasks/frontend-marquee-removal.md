# Remove Ecosystem Marquee Entirely

You must remove the Ecosystem Partnerships Marquee component from the homepage layout as requested by the user.

## Requirements

### 1. Refactor `app/[locale]/(marketing)/page.tsx`
- Remove the `EcosystemTicker` component import from the top of the file.
- Remove `<EcosystemTicker />` (and its wrapping layout structures if any) completely from the JSX render body on the homepage.

### 2. Verification
- Run `npm test -- tests/i18n` to verify all 29 i18n, translation, and font variable tests pass with 100% green status.
