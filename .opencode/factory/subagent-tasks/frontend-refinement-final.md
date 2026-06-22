# Frontend Visual Refinements & Logo Unification

You must apply final UI/UX visual adjustments to the Recognition Cards and the Ecosystem Ticker based on the user's latest layout feedback.

## Context
From the user's uploaded screenshots, we have identified three minor aesthetic imbalances in the local build:
1. **FinVision Logo:** The logo is white-on-transparent and collapses to 0-width in Next.js's flex rendering, making it invisible. We must give the dark background wrapper a fixed width/padding so it never collapses and stands out beautifully.
2. **Startup Mahakumbh Logo:** Currently fallback-rendered as a text badge with a Lucide `Award` icon. You must create and implement a professional vector SVG logo for Startup Mahakumbh and update its config asset path.
3. **Ecosystem Ticker Height & Logo Sizing:** The dark blue marquee bar is too thick, and logos have inconsistent visual weights (some look giant while others look tiny). You must slim down the vertical padding and normalize logo sizes so they have a consistent, highly balanced visual weight.

---

## Requirements

### 1. Create the Startup Mahakumbh SVG Logo
Write a high-fidelity vector SVG logo to `/home/yash/opencode-workspace/navdhan-redesign-2026/public/assets/badges/mahakumbh.svg`:
- It should be a horizontal-aligned vector asset (`viewBox="0 0 160 40"` or similar).
- On the left: a stylized, multi-colored geometric dome/mandala emblem representing a Kumbh/summit (using saffron/orange `#EA580C`, blue `#2563EB`, and green `#16A34A` clean vector segments).
- On the right: clean, high-contrast modern typography displaying `"Startup Mahakumbh"` in deep charcoal `#0F172A` (with `"Startup"` in font-bold and `"Mahakumbh"` in font-semibold/normal).
- Make sure it has a transparent background.

### 2. Update `siteData.ts`
Modify `/home/yash/opencode-workspace/navdhan-redesign-2026/src/lib/data/siteData.ts`:
- Under `associationBadges`, change the `logoAsset` for `Startup Mahakumbh` to `"/assets/badges/mahakumbh.svg"`:
  ```typescript
  {
    name: "Startup Mahakumbh",
    logoAsset: "/assets/badges/mahakumbh.svg",
    altKey: "global.alt.partnerLogo",
    href: "#",
  }
  ```

### 3. Refactor Recognition Badges rendering in `page.tsx`
Modify `/home/yash/opencode-workspace/navdhan-redesign-2026/app/[locale]/(marketing)/page.tsx` around line 180-217:
- Give the inner logo container a fixed height and proper flex scaling wrapper to prevent collapse:
  - For **FinVision** (dark theme wrapper):
    - Wrap the logo inside a container with a guaranteed width: `className="flex h-10 w-28 items-center justify-center rounded-lg bg-slate-900 px-3 py-1.5 shadow-sm border border-slate-800"`
  - For **Startup Mahakumbh**, **FACE**, and **STPI FinGlobe**:
    - Wrap the image in a clean, non-collapsing wrapper: `className="flex h-10 w-28 items-center justify-start"`
- Double-check that next/image is loaded with:
  ```tsx
  <Image
    src={badge.logoAsset}
    alt={tGlobal(`alt.${badge.altKey.split(".").pop()}`, {
      name: badge.name,
    })}
    width={112}
    height={40}
    className="h-full w-auto object-contain"
  />
  ```

### 4. Slim Down and Unify Ecosystem Ticker
Modify `/home/yash/opencode-workspace/navdhan-redesign-2026/src/components/sections/EcosystemTicker.tsx`:
- Trim the vertical padding of the `<section>` to a slim and elegant size:
  - Change `py-6 md:py-8` to `py-3.5 md:py-4.5` (or `py-3.5 md:py-4`).
- In the `TickerLogo` subcomponent, modify the next/image styling to normalize all partner logo sizes and visual weights:
  - Change `className="partner-logo h-8 w-auto max-w-[140px] object-contain md:h-10 md:max-w-[160px]"` to:
    `className="partner-logo h-5 w-auto max-w-[95px] object-contain md:h-6 md:max-w-[105px] opacity-75 hover:opacity-100 transition-opacity duration-300"`
  - This guarantees that wide landscape logos (Amplitude, Perplexity, ElevenLabs) are bounded elegantly by height, and square logos (NVIDIA, OpenAI) remain perfectly proportional and balanced.

---

## Technical Instructions
- **Unit testing:** After implementing, ensure that `npm test -- tests/i18n` passes 100% successfully.
- **Verification:** Ensure that `npm run build` compiles with zero TypeScript or bundler errors.
