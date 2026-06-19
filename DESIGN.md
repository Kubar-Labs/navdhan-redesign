# NavDhan Redesign 2026 — Design Brief

This file is the single source of truth for creative direction, content rules, design tokens, motion, and MVP scope for the NavDhan borrower-facing website. All implementation, audits, and copy changes must follow it.

Last approved: 19 June 2026.

## Part 1 · Product & Strategy

### Product vision

NavDhan helps India's small and growing businesses access fair, fast working capital without platform fees, jargon, or lender-first language. We match each business with the right loan offer so the owner can focus on running the business, not chasing paperwork.

### User personas

1. **Raj, kirana-turned-distributor** (urban tier-2/3)
   - Needs ₹20L to restock before a festival season.
   - Distrusts banks because of hidden paperwork and slow approvals.
   - Wants a clear EMI, total interest, and a human support number before uploading documents.

2. **Lakshmi, exporter-manufacturer** (tier-1)
   - Needs ₹75L for raw materials against a purchase order.
   - Compares multiple offers but wants one application, not six.
   - Values transparency and compliance signals.

3. **Karthik, first-time borrower** (small services firm)
   - Unsure what documents he needs.
   - Prefers Hindi or Hinglish; needs simple, warm explanations.

### Core UX principles

1. **Borrower-only framing.** Never talk about "lenders", "platforms", "intermediary" or "partner integrations" on public marketing surfaces.
2. **One primary action per screen.** Everything points to checking eligibility or starting an application.
3. **Show the math before the documents.** EMI, interest rate, and tenure must be clear before heavy upload.
4. **Hindi is a first-class language.** All public copy is available in English and Hindi; other locales fall back to English until translated.
5. **Calm motion, not spectacle.** Every animation earns its place and respects `prefers-reduced-motion`.

### Competitive analysis

- **Razorpay:** trustworthy, clean fintech surfaces. We borrow the calm confidence, not the payments copy.
- **M2P Fintech:** sophisticated SaaS craft. We borrow refined spacing and typography, not B2B messaging.
- **Dodo Payments:** modern, optimistic D2C feel. We borrow warmth and accessibility, not playful color.
- **Zerodha:** minimal, serious, no clutter. We borrow the restraint and clarity.

### MVP scope

In scope:

- 8-locale marketing site (en, hi, bn, te, mr, ta, kn, ml) with full English + Hindi copy.
- Homepage in section order: announcement bar, hero, association badges, technology partnerships ticker, loan products, why NavDhan, recognition photo carousel, customer stories, EMI calculator, final CTA, footer.
- `/team` page with real Kubar team data, headshots, and advisor cards.
- 7 legal pages: privacy policy, terms of use, fair practices code, cookie policy, grievance redressal, RBI-DLG disclosure, consent policy.
- `/apply` front-end eligibility form (backend persistence out of scope for MVP).
- Real photos and logos for association badges, technology partners, team, and recognition events.

Out of scope for MVP:

- Full multi-step wizard backend, OTP, Perfios, file upload, and offer persistence.
- Cookie-consent banner.
- Animations beyond a calm hero entrance, scroll reveals, and the technology-partners marquee.
- Full translations for non-Hindi locales.

### Future roadmap

- Multi-step apply wizard with server-side draft save and document upload.
- Rate limiting, CSP headers, and security middleware.
- Customer story videos and partner-lender logos (only when legally cleared).
- Additional South-Indian language translations.

### Risks & assumptions

- RBI-DLG disclosure language must be reviewed by counsel before going live.
- Customer stories are placeholders until verified borrowers opt in.
- Apply portal backend estimates depend on final Perfios scope.

## Part 2 · Creative Direction

### The ask

A light, trustworthy, Indian fintech marketing website that feels like a conversation with a clear, calm adviser. No dark mode. No card soup. No startup-purple gradients. The design should let a busy MSME owner scan, trust, and apply in under two minutes.

### Aesthetic direction

- **Vibe:** calm, credible, warm.
- **Visual moves:**
  - Near-monochrome base with one decisive orange accent (`#EA580C`, `nt-orange-600`).
  - Generous cream/off-white surfaces (`#FAFAF8`).
  - Clean sans-serif for UI; optional editorial serif for hero emphasis.
  - Rounded corners (8–16 px) used intentionally, not as decoration.
  - Real photography and logos; no 3D blobs or stock illustrations.
- **Motion appetite:** subtle. Hero entrance, scroll reveals, and the technology partners marquee only. Pause on hover. Respect reduced motion.
- **Anti-patterns:**
  - Generic SaaS hero + three feature cards.
  - Em-dashes in body copy or meta titles.
  - Platform/lender-first copy.
  - Floating drop-shadow card soup.
  - Emoji as icons.

### Approved concept direction: "Clear Credit"

Confident restraint, warm clarity, and proof that NavDhan is a real company run by real people. The page reads top to bottom like a calm walkthrough: what it is, why trust it, how much it costs, proof, and the next step.

### Content & structure

Homepage section order:

1. **Announcement bar** — one line, dismissible or fixed for the launch period.
2. **Hero** — tagline "One stop-solution for all your working capital needs", value props, two CTAs, three stats.
3. **Association badges** — RBI aligned, FACE registered, STPI FinGlobe, FinVision (logo marks).
4. **Technology partnerships** — horizontal marquee of credible tech/AI partner logos.
5. **Loan products** — single term-loan framing for MSMEs: ₹5L–₹1Cr, 12–24% p.a., 3–12 months, zero platform fee.
6. **Why NavDhan** — six reason cards, trust badges, no lender-centric language.
7. **Recognition carousel** — eight approved events, hero image, gallery + write-up modal.
8. **Customer stories** — three MSME stories with real names and photos when available; otherwise drop fabricated photos.
9. **EMI calculator** — sliders for amount, rate, tenure; live breakdown.
10. **Final CTA** — heading + two buttons.
11. **Footer** — legal links, contact emails on `@kubar.tech`, address, "Talk to Us" = outreach@kubar.tech.

### Design tokens

- **Colors:**
  - Primary accent: `nt-orange-600` / `#EA580C`
  - Surface cream: `#FAFAF8`
  - Background white: `#FFFFFF`
  - Text primary: `nt-slate-900` / `#0F172A`
  - Text secondary: `nt-slate-600` / `#475569`
  - Muted: `nt-slate-200` / `#E2E8F0`
- **Typography:**
  - Sans: Inter or equivalent, weights 400/500/600/700.
  - Display serif: Instrument Serif, used sparingly for hero emphasis.
  - Modular type scale: hero `clamp(2.5rem, 6vw, 4.5rem)`, body `1rem`/1.6 line-height.
- **Spacing:** 4 px base grid; section padding `py-16 md:py-24`; container max `max-w-7xl` with responsive horizontal padding.
- **Radius:** `rounded-md` (6 px), `rounded-xl` (12 px), `rounded-2xl` (16 px).

### Motion system

- **Hero entrance:** staggered fade + translateY, 0.7 s ease, first paint within 200 ms.
- **Scroll reveals:** sections fade in and rise slightly when entering viewport. Use CSS scroll-driven animations where supported, with a Framer Motion fallback.
- **Technology partnerships marquee:** infinite horizontal scroll, ~30 s linear loop, pause on hover, duplicate content for seamless loop, respect `prefers-reduced-motion`.
- **Buttons/inputs:** subtle scale/focus-ring micro-interactions.
- **Reduced motion:** disable translateY/parallax; use simple opacity or no animation.

### Content rules

- Product name: **NavDhan** (capital N and D, rest lowercase in body).
- Legal entity: **Kubar Protocol Private Limited**, CIN `U70200WB2024PTC274850`.
- Registered address: **156, Tarvakere, BTM Layout 1st Stage, Bengaluru, Karnataka**.
- Tagline: **"One stop-solution for all your working capital needs"**.
- All public contact emails on `@kubar.tech`: loan, partnerships, support, careers, press, dpo, outreach.
- "Talk to Us" CTA uses `outreach@kubar.tech`.
- No em-dashes anywhere in marketing copy or meta titles.
- No claims of guaranteed approval, "instant" disbursal, or specific tie-ups unless documented.

### Scope & deliverables

- One Next.js 15 App Router project, light mode only.
- All 8 locales supported at route level.
- Public `/assets/` folder containing real logos and photos.
- A living `DESIGN.md` (this file) that every subsequent change must respect.

### Open questions

- Final counsel review of RBI-DLG and privacy-policy wording before production launch.
- Replacement of fabricated customer stories once real borrower opt-ins are collected.
- Whether the marketing footer should list named lending partners after commercial agreements are signed.
