# Frontend Visual Polish: Badges & Marquee Refinements

You must execute final UI/UX visual polish on the Recognition Cards logos and the Ecosystem Ticker marquee to match the user's uploaded screenshots.

## Requirements

### 1. Download & Crop Startup Mahakumbh Logo
- Download the official Startup Mahakumbh logo from:
  `https://www.cgireunion.gov.in/public/upload_image/1753187389.jpg`
- The image contains some white borders and padding. You must crop it tightly (using ImageMagick's `convert` CLI or similar native utilities) to remove unnecessary border margins and keep only the sharp logo elements.
- Save the cropped result at:
  `/home/yash/opencode-workspace/navdhan-redesign-2026/public/assets/badges/mahakumbh.png`
- In `/home/yash/opencode-workspace/navdhan-redesign-2026/src/lib/data/siteData.ts`, update the `"Startup Mahakumbh"` badge to use:
  - `logoAsset: "/assets/badges/mahakumbh.png"`
- In `/home/yash/opencode-workspace/navdhan-redesign-2026/app/[locale]/(marketing)/page.tsx`, ensure Startup Mahakumbh renders its logo using the normal `<Image>` rendering block instead of falling back to the generic Lucide `Award` icon.

### 2. Fix FinVision Logo Visibility
- We discovered that the FinVision logo is white-on-transparent, but it is invisible because its dark backdrop wrapper uses `bg-nt-slate-950` (which is a non-existent color class, causing it to fall back to transparent/white).
- In `/home/yash/opencode-workspace/navdhan-redesign-2026/app/[locale]/(marketing)/page.tsx`, find the FinVision wrapper and change its background color from `bg-nt-slate-950` to standard Tailwind `bg-slate-950` (or `bg-[#0F172A]` / `bg-[#0B0F19]`). This will render a gorgeous dark container that makes the white logo elements 100% visible and sharp.

### 3. Slim Down Ecosystem Ticker Marquee
- The Ecosystem Ticker container is too tall. In `/home/yash/opencode-workspace/navdhan-redesign-2026/src/components/sections/EcosystemTicker.tsx`, trim the vertical padding of the dark blue banner to a slim `py-3 sm:py-4` (or `py-3.5`).
- Ensure all partner logos in the marquee have a **completely consistent size**. Apply a uniform, balanced height constraint to every single logo inside the ticker (for example, `h-5 sm:h-6 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity`) and remove any logo-specific size deviations so they look perfectly aligned.

### 4. Verify & Re-Run Tests
- Run `npm test -- tests/i18n` to verify all 29 tests pass with 100% green status.
