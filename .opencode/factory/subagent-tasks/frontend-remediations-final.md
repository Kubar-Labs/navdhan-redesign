# Frontend Remediations & Copy Tuning

You must refine the homepage elements, logo styles, footer structure, and why choose text to perfectly align with the user's explicit visual annotations.

## Requirements

### 1. Rounded Corners for Recognition Badges Logos
In `/home/yash/opencode-workspace/navdhan-redesign-2026/app/[locale]/(marketing)/page.tsx` (around lines 183-205):
- Ensure that the logo container wrappers have the `.rounded-lg` or `.rounded-xl` class and `overflow-hidden` so that their corners are rounded cleanly.
- Add `.rounded-lg` or `.rounded-md` directly to the Next.js `<Image>` component `className` to ensure that all logo images (FinVision, FACE, STPI FinGlobe, and Startup Mahakumbh) render with beautifully rounded corners:
  ```tsx
  <Image
    src={badge.logoAsset}
    alt={...}
    width={112}
    height={40}
    className="h-full w-auto object-contain rounded-lg"
  />
  ```

### 2. NavDhan Heading in Footer Tagline
In `/home/yash/opencode-workspace/navdhan-redesign-2026/src/components/shells/Footer.tsx`:
- Right above the tagline paragraph `<p className="mt-4 max-w-xs text-sm leading-relaxed text-nt-slate-300">{tagline}</p>` (around line 37), add a clean, bold `"NavDhan"` text heading to give the brand statement a clear structural outline:
  ```tsx
  <div className="mt-4 text-base font-bold text-white">NavDhan</div>
  ```

### 3. Remove Bottom Badges from Footer
In `/home/yash/opencode-workspace/navdhan-redesign-2026/src/components/shells/Footer.tsx` (around lines 140-144):
- Remove the bottom badges paragraph `<p className="mt-4 font-medium text-nt-slate-300">{t("global.footer.badges")}</p>` completely.

### 4. Casing Correction for 'RBI DLG Disclosure' Link
In `/home/yash/opencode-workspace/navdhan-redesign-2026/src/components/shells/Footer.tsx` (around lines 7-12):
- Update `legalLabel` helper function to return `"RBI DLG Disclosure"` for the `"rbi-dlg-disclosure"` slug:
  ```typescript
  function legalLabel(slug: string): string {
    if (slug === "rbi-dlg-disclosure") return "RBI DLG Disclosure";
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  ```

### 5. Timelines Accuracy in "Why Choose NavDhan?" Section
Update the `"whyNavDhan"` reasons inside the translation `.json` files:
- **English (`en.json`):**
  - Under `whyNavDhan.reasons[0]` (the "instant-sanction" object, around lines 253-258):
    - Set `"titleKey"` to `"Fast Disbursal"`
    - Set `"bodyKey"` to `"Disbursement takes around 24-72 hours depending on the lender's timeline."`
- **Hindi (`hi.json`):**
  - Under `whyNavDhan.reasons[0]` (around lines 91-97):
    - Set `"titleKey"` to `"त्वरित संवितरण"`
    - Set `"bodyKey"` to `"ऋणदाता की समयसीमा के आधार पर संवितरण में लगभग 24-72 घंटे का समय लगता है।"`

### 6. Verification
- Verify `npm run build` compiles with 100% success.
- Run `npm test -- tests/i18n` to verify all 29 tests pass successfully with these new keys and layout elements.
