# NavDhan Redesign 2026 — Design & Content Decisions Log

This document records factual, non-negotiable decisions so future sessions can hand off without re-learning context.

## Brand identity

- Product name: **NavDhan** (capital N and D; all other letters lowercase in body).
- Legal entity: **Kubar Protocol Private Limited** (CIN U70200WB2024PTC274850).
- Registered address: **156, Tarvakere, BTM Layout 1st Stage, Bengaluru, Karnataka**.
- Tagline for public surfaces: **"One stop-solution for all your working capital needs"**.
- Trust signal: **"Powered by Kubar"** may be used as a light footer/brand signal per Design.md.
- All public contact emails live on **@kubar.tech** (loan, partnerships, support, careers, press, outreach, dpo).
- "Talk to Us" CTA routes to **outreach@kubar.tech**.

## Product claims (approved)

- Loan range: ₹5 Lakh – ₹1 Crore.
- Interest rate: 12% – 24% per annum.
- Tenure: 3 – 12 months.
- Zero platform fee.
- Borrower-only copy; do not market to lenders/platforms.

## Visual system (from approved Design.md)

- Light mode only.
- Primary accent: nt-orange-600 (#EA580C).
- Surfaces: cream / off-white (#FAFAF8) and white.
- Text: nt-slate-900 / nt-slate-600.
- Calm, subtle motion; honor `prefers-reduced-motion`.

## Homepage section order

1. Announcement bar
2. Hero
3. Association badges (RBI, FACE, STPI FinGlobe, FinVision)
4. Tech ecosystem partners ticker
5. Loan products
6. Why NavDhan
7. Recognition carousel
8. Customer stories
9. EMI calculator
10. Final CTA
11. Footer

## Recognition carousel — approved 8 events

1. FinVision 2026, NIBM
2. Startup Mahakumbh
3. Bengaluru Tech Summit
4. STPI IMC
5. Kotak BizLabs Demo Day
6. Bharat Innovation Conclave
7. Rubrix, T-Hub
8. AI Summit

Notes:

- LinkedIn assets exist for FinVision/NIBM, Startup Mahakumbh and AI Summit.
- Events without dedicated photos render with a styled title placeholder to avoid fabricated imagery.
- All write-ups describe participation, selection or showcasing; no false "winner" claims except where a win is documented.

## Localization

- Supported locales: `en`, `hi`, `bn`, `te`, `mr`, `ta`, `kn`, `ml`.
- Hindi is the only non-English locale that is fully translated in the TS client messages.
- Other locales fall back to English until translations are provided.

## Things deliberately out of MVP scope

- Full multi-step apply wizard backend with Perfios/OTP/file upload (front-end form only).
- Cookie-consent banner.
- Cookie/scoped rate-limiting.
- Non-English homepage translations beyond Hindi.

## Current known gaps (tracked)

- Ecosystem partners ticker is a static grid; needs animated marquee and verified logos.
- Customer-story section uses fabricated names and placeholder photos.
- No sitewide motion system (scroll reveals, hero entrance, marquee pause-on-hover).
- Apply form does not persist/submit to a backend.
