# UI/UX Refinement: Recognition Cards & Ecosystem Ticker Height

You must apply precise visual refinements to the homepage recognition cards and the ecosystem ticker marquee based on the user's screenshots and guidelines.

## Context & Requirements

### 1. Tighten and Fix Recognition Cards
The 4 logo/badge cards in the "Recognised By" section are currently too tall with excessive padding and empty whitespace.
- **File:** `/home/yash/opencode-workspace/navdhan-redesign-2026/app/[locale]/(marketing)/page.tsx`
- **Refinement Specs:**
  - Update the cards mapping block (around line 184-210) to reduce padding to `p-4 sm:p-5` instead of `p-6` for a tighter visual grid.
  - **FinVision Logo Visibility:** The FinVision logo (`/assets/badges/finvision.png`) has white-on-transparent graphics and is invisible on a white card background. Wrap the FinVision logo `Image` in a dark slate-950 backdrop container (`bg-nt-slate-950 p-2.5 h-10 flex items-center justify-center rounded-lg`) to deliver striking contrast and high readability.
  - Standard logos (`FACE`, `STPI FinGlobe`) should sit in a clean transparent logo container of matching height (`h-10 flex items-center justify-center`).
  - **Startup Mahakumbh Card:** The card uses a text-only fallback badge inside the logo container. Ensure it displays a clean, compact orange badge (`inline-flex items-center gap-1.5 rounded-lg border border-nt-orange-200 bg-nt-orange-50 px-2 py-0.5`) with an orange Lucide `Award` icon. Eliminate the duplicate text-only header inside the logo container so that the card displays its title only once (underneath the logo container).
  - Title element: Change margin-top to `mt-3` and font size/weight to `text-sm font-bold text-nt-slate-900`.
  - Description element: Set size to `text-xs leading-relaxed text-nt-slate-600`.

### 2. Slim Down the Ecosystem Ticker Marquee
The dark blue technology partners marquee bar is too tall and thick compared to the actual size of the logo graphics.
- **File:** `/home/yash/opencode-workspace/navdhan-redesign-2026/src/components/sections/EcosystemTicker.tsx`
- **Refinement Specs:**
  - Change the vertical padding of the parent `<section>` element from the thick `py-12 md:py-16` to a slim, refined `py-5 md:py-6` or `py-6 md:py-8` that tightly wraps the logos.
  - Trim the top margin of the marquee relative container from `mt-8` to `mt-3` or `mt-4` to remove large gaps between the text heading and partner logos.

### 3. Verification
- Re-run `npm test -- tests/i18n` to verify all 29 tests pass with 100% green status.
