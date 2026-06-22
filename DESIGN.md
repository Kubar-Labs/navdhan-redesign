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

### Copy & voice

Recovered from the original design-agency copywriter and strategist deliverables. This is source material to draw from, not a word-for-word mandate. All copy must still pass the Content Rules below, especially the borrower-only framing and anti-platform/anti-lender language.

#### Voice

Warm, accessible English with subtle Hinglish. Calm, trustworthy, respectful. No jargon, no hype, no filler.

#### Tagline options

1. Sahi loan, sahi lender — bina kisi rukaawat ke.
2. Aap business badhayein, hum funding sambhalte hain.
3. Business ka next step, aasaan loan ke saath.
4. Paisa supply chain ke liye; paperwork chain nahi.
5. Apke business ke kaam aane wala loan.

**Public English tagline (used in footer and key surfaces):** "One stop-solution for all your working capital needs".

**Hinglish/Hindi hero tagline (used in hi locale or as a warm accent in en hero):** "Aap business badhayein, hum funding sambhalte hain."

#### Hinglish accents to sprinkle

Use lightly and only when natural:

- bina tension ke
- aasaan process
- baat karein
- aapka business
- samajhdaar faisla
- seedha, sachcha
- kaam ki baat
- rukaawat nahi
- bharosa rakhein
- sirf ek click
- aapke liye
- chinta chhodo (very sparingly)

#### Section copy matrix (source)

These are starting versions. Replace lender/marketplace/platform phrases with borrower-approved language before publishing.

**Hero**
- eyebrow: Fast business loans for India's MSMEs
- heading: Get the right business loan, without chasing banks.
- body: NavDhan helps small and growing businesses find fair, fast loans. One application. Multiple options. Zero platform fee.
- CTA primary: Check Eligibility
- CTA secondary: Talk to Us
- Stats: ₹5L – ₹1Cr loan range · 3–12 month tenures · 12–24% p.a. rates

**Loan products**
- eyebrow: Loan products
- heading: A loan that fits what your business actually needs.
- body: From buying stock and machinery to managing everyday expenses, choose the loan that fits your plan.
- Items: Collateral-Free Business Loan, Working Capital Loan, Asset / Machinery Finance, Business Growth Loan.
- CTA: Compare Loan Options

**Why NavDhan**
- eyebrow: Why NavDhan
- heading: Built for business owners, not bankers.
- body: You are running a business, not a bank branch. We keep the process digital, transparent, and focused on getting you an offer that works.
- Reasons: one application, matched offers · loan sizes that fit (₹5L–₹1Cr) · clear interest rates (12–24% p.a.) · fast, honest decisions · fully online process · zero platform fee.
- CTA: Apply Now

**How it works**
- eyebrow: How it works
- heading: Apply once. Get matched. Receive funds.
- Step 1: Share your business details.
- Step 2: Compare loan offers.
- Step 3: Complete KYC and get funded.
- CTA: Start Application

**Customer stories**
- eyebrow: Customer stories
- heading: Real businesses. Real loans. Real growth.
- Story 1: Rajiv K., Garment Shop Owner — "I wanted to stock up for the wedding season, but I did not have collateral." → ₹25 Lakh collateral-free business loan.
- Story 2: Sunita M., Handicraft Artisan, Varanasi — "Our loom needed upgrading, but cash flow was tight." → ₹15 Lakh machinery loan.
- Story 3: Amit V., E-commerce Logistics, Gurugram — "We needed working capital to hire more staff and take on bigger orders." → ₹18 Lakh working capital loan.

**Final CTA**
- heading: The right loan for your business is a few clicks away.
- subtext: Zero platform fee · matched offers · quick, transparent process
- CTAs: Apply Online / Talk to Us

**Apply portal microcopy**
- Step titles: Business details, Documents, Offers, KYC & disbursal.
- Button labels: Continue, Back, Save and continue, Check eligibility, Upload document, Choose this offer, Verify OTP, E-sign documents, View dashboard, Back to home.
- Error messages:
  - "Please enter a valid 10-digit mobile number."
  - "Please enter a valid email address."
  - "This field is required so we can review your application."
  - "File too large. Please upload a PDF or image under 5 MB."
  - "We could not read this file. Please upload a clear PDF or image."
  - "Something went wrong on our side. Please try again, or call us for help."
  - "We could not find a matching offer right now. Let's look at what we can do next."
  - "OTP did not match. Please try again or request a new code."
- Success screen:
  - Heading: Aapka application humare paas aa gaya hai.
  - Subtext: We are reviewing your details. Expect a call or message from our team within 24 hours. You can also check your offers anytime from your dashboard.
  - Buttons: View Dashboard / Back to Home

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
