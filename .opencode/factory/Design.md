# Creative Brief & Design Specification — NavDhan.app Redesign

**Project:** NavDhan.app complete redesign  
**Client:** Kubar Labs (product: NavDhan)  
**Prepared by:** Creative Director, NavDhan redesign agency team  
**Date:** June 2026  
**Status:** Pending client sign-off

---

## ─ Part 1 · Product & Strategy ─

### Product vision

NavDhan becomes the calm, direct way for Indian MSME owners to turn invoices, purchase orders, and GST history into working capital. One application, multiple lender offers, zero platform fee, and complete transparency on rates, fees, and tenure. The change we create is confidence: a business owner no longer chases bank managers or guesses at hidden charges; they see what they qualify for, choose the offer that fits their cash cycle, and get funded without losing days to paperwork.

### User personas

**1. Rajesh — Restocking Trader, Delhi**
- Business: electronics and mobile accessories wholesaler, ₹2–3 Cr annual turnover.
- Pain: festival seasons demand inventory purchases, but cash is locked in 60–90 day dealer credit; bank OD renewals take 3–4 weeks.
- Trust signal: eligibility based on GST turnover, funds in 24–72 hours, and EMI visible before document upload.

**2. Priya — Manufacturer, Pune**
- Business: second-generation precision parts supplier to auto OEMs, 35 employees, GST-registered for 6 years.
- Pain: lumpy OEM orders need bridge capital; banks treat her as "new to credit" because personal and business histories are mixed.
- Trust signal: consent-led data use, no collateral for strong profiles, human callback option above ₹50L.

**3. Sameer — E-commerce / D2C Brand Owner, Jaipur**
- Business: online apparel brand on Shopify, Amazon, Meesho; ₹80L–₹1.5 Cr annual GMV.
- Pain: ad spend and inventory payouts happen weekly while platform remittances lag; informal lenders cost 3–4% per month.
- Trust signal: fully digital process, tenure as short as 3 months, calculator shows total interest in rupees.

### Core UX principles

1. **Speak to the owner, not the balance sheet.** Copy addresses real situations — stock-up before Diwali, pay suppliers on time, close the payroll gap — not technology pipelines.
2. **Show the number first, ask for data second.** Loan amount, EMI, and total interest should be visible before identity upload. Application gates detailed offers only after consent, never before a range.
3. **One truth, two languages.** Every value proposition, fee disclosure, and CTA works in warm English with subtle Hinglish and translates naturally into Hindi.
4. **Calm over clever.** Visual language borrows from Razorpay's trust and Zerodha's restraint. No dark mode, no crypto gradients, no animated hero illustrations, no emoji icons.
5. **Progress you can see.** Loan application shows status clearly from eligibility through disbursal with realistic timelines. No false urgency, no "approved in 2 minutes" claims.

### Competitive analysis

| Competitor | Strengths | Weaknesses | NavDhan wedge |
|------------|-----------|------------|---------------|
| Traditional Banks | Trust, branches, lowest headline rates | 2–6 week turnaround, collateral-heavy, opaque rejections | Same-day eligibility, multi-lender matching, clear decline reasons |
| NBFC D2C Lenders (Lendingkart, Flexiloans) | Fast digital flow, GST underwriting | Single-lender risk appetite, upsell calls, hidden fees | 10+ matched lenders, zero platform fee, side-by-side offer comparison |
| Neo-bank / Embedded Credit | Clean UX, instant eligibility | Tied to one lender/ecosystem, limited ticket sizes | ₹5L–₹1Cr, broader panel, fixed-tenure working capital loans |

### MVP scope

**In scope**
- Home / landing page with borrower-focused hero, association badges, tech ecosystem marquee, loan products, why NavDhan, recognition carousel, customer stories, EMI calculator, and final CTA.
- Integrated `/apply` multi-step loan portal.
- `/team` page with members and advisors.
- Legal pages: Privacy Policy, Terms of Use, Fair Practices Code, Cookie Policy, Grievance Redressal, RBI-DLG Disclosure, Consent Policy.
- Full i18n support for the eight languages currently on navdhan.app: English, हिन्दी (Hindi), বাংলা (Bengali), తెలుగు (Telugu), मराठी (Marathi), தமிழ் (Tamil), ಕನ್ನಡ (Kannada), മലയാളം (Malayalam).
- Language toggle exposing all eight locales.
- Subtle/calm motion throughout; mobile-first responsive.

**Out of scope**
- Kubar Protocol branding, content, or cross-border trade-finance references.
- Lender partner portal, B2B platform integration landing pages, "embedded credit" infrastructure messaging.
- Native mobile apps.
- Live chat or AI chatbot.
- Dark mode.

### Risks & assumptions

1. Regulatory clarity on D2C marketing while loans originate from partner banks/NBFCs.
2. Lender SLA consistency for 24–72 hour disbursal promises; UI must set stage-by-stage expectations.
3. Data availability and consent friction for GST and bank statements.
4. Trust transfer from Kubar Labs to NavDhan; build via transparent fees and partner logos.
5. Hindi localization nuance; `hi.ts` will need a native-speaker review pass.

---

## ─ Part 2 · Creative Direction ─

### The ask

A complete redesign of **NavDhan.app** as a modern, borrower-facing D2C MSME lending site. One identity: warm, credible, Indian fintech. Every page, every form, and every animation should make a small business owner feel that NavDhan is built for people like them.

### Aesthetic direction

- **Vibe:** Assured, clear, human.
- **Visual moves:**
  - Light, airy surfaces with a warm cream-white contrast (`#FAFAF8`).
  - Primary action color is NavDhan orange (`#F97316`), used with discipline — buttons, links, active states.
  - Green is reserved for approval/success/progress, not CTAs.
  - Strong typographic hierarchy, generous whitespace, and a single editorial serif accent for hero words.
  - Rounded but not bubbly: 8–12px radius on interactive elements.
  - Subtle motion: staggered hero entrance, one marquee ticker, pause-on-hover carousels.
- **Anti-patterns:** generic SaaS hero + three icon cards; purple/indigo AI gradient; drop-shadow soup; emoji icons; scroll-fade spam; dark mode.

### Content & structure

**Global header (sticky)**
- Logo → `/`
- Links: Loan Products, Why NavDhan, EMI Calculator, Customer Stories
- Language toggle: all eight locales (English, हिन्दी, বাংলা, తెలుగు, मराठी, தமிழ், ಕನ್ನಡ, മലയാളം)
- Primary CTA: Apply Loan → `/apply`

**Homepage section order**
1. Announcement bar
2. Hero
3. Association badges
4. Tech ecosystem partners ticker
5. Loan products
6. Why NavDhan
7. Recognition carousel
8. Customer stories
9. EMI calculator
10. Final CTA
11. Footer

**Keypages**
- `/apply` — multi-step borrower application portal.
- `/team` — leadership members + advisors.
- `/legal/*` — seven required legal pages.

### Copy approach

- Primary tagline: **"Aap business badhayein, hum funding sambhalte hain."**
- Voice: warm, accessible English with subtle Hinglish. No jargon. No "embedded lending," no "marketplace," no "BRE."
- Full section-by-section copy matrix and apply-portal microcopy are documented in the agency copywriter deliverable and summarized below.

### Color system summary

| Role | Token |
|------|-------|
| Primary action | `nt-orange-600` `#EA580C` |
| Brand accent | `nt-orange-500` `#F97316` |
| Success / progress | `nt-green-500` `#22C55E` |
| Primary text | `nt-slate-900` `#0F172A` |
| Muted text | `nt-slate-600` `#475569` |
| Surface alt | `nt-cream` `#FAFAF8` |

### Typography summary

- UI / body: **Inter** + **Noto Sans Devanagari** for Hindi.
- Editorial accent: **Instrument Serif** for hero headline words only.
- Display size: `clamp(2.5rem, 6vw, 4.5rem)`.
- Max reading measure: `65ch`.

### Motion summary

- Hero entrance: staggered `translateY` + opacity, `0.7s` ease.
- Marquee ticker: `30s` linear loop, pause on hover.
- Apply stepper: cross-fade `0.2s`, progress bar `0.4s`.
- All motion respects `prefers-reduced-motion`.

---

## ─ Part 3 · Detailed Copy Matrix ─

### `hero`

| Element | Copy |
|---------|------|
| eyebrow | Fast business loans for India's MSMEs |
| heading | Get the right business loan, **without chasing banks.** |
| body | NavDhan helps small and growing businesses find fair, fast loans from trusted lenders. One application. Multiple offers. Zero platform fee. |
| CTA primary | Check Eligibility |
| CTA secondary | Talk to Us |
| Stat 1 | **₹5L – ₹1Cr** loan range |
| Stat 2 | **10+** active lending partners |
| Stat 3 | **3–12 month** tenures |

### `products`

| Element | Copy |
|---------|------|
| eyebrow | Loan products |
| heading | A loan for the real things your business needs. |
| body | From buying stock and machinery to managing daily expenses — choose the loan that fits your plan, not the other way around. |
| Item 1 | **Collateral-Free Business Loan** — Unsecured funding up to ₹1 Crore based on your business cash flow. No property or asset needed. |
| Item 2 | **Working Capital Loan** — Cover salaries, stock, supplier payments, or everyday gaps with flexible repayment. |
| Item 3 | **Asset / Machinery Finance** — Buy equipment, vehicles, or tools with EMIs that match your cash cycle. |
| Item 4 | **Business Growth Loan** — Larger-ticket capital to expand to a new city, add capacity, or take on bigger orders. |
| CTA | Compare Loan Options |

### `why`

| Element | Copy |
|---------|------|
| eyebrow | Why NavDhan |
| heading | Built for business owners, not paperwork collectors. |
| body | You are running a business, not a bank branch. We keep the process digital, transparent, and focused on getting you an offer that works. |
| Reason 1 | **One application, multiple lenders.** Apply once and see offers from several trusted lenders side by side. |
| Reason 2 | **Loan sizes that fit.** From ₹5 Lakhs to ₹1 Crore, borrow what your business actually needs. |
| Reason 3 | **Clear interest rates.** Rates from 12% to 24% p.a., with all costs explained upfront. |
| Reason 4 | **Fast, honest decisions.** Approvals typically within 24 hours to 7 days, depending on documents. |
| Reason 5 | **Fully online process.** Submit documents and e-sign from your phone or laptop. |
| Reason 6 | **Zero platform fee.** You pay only what the lender charges. Nothing extra to NavDhan. |
| Badges | RBI Aligned · FACE Registered · 10+ Lender Partners |
| CTA | Apply Now |

### `howItWorks`

| Element | Copy |
|---------|------|
| eyebrow | How it works |
| heading | Apply once. Get matched. Receive funds. |
| Step 1 | **Share your business details** — Fill in basic company and financial information. Our system finds lenders whose criteria match your profile. |
| Step 2 | **Compare loan offers** — See offers with clear rates, tenures, and fees. Pick the one that makes sense for your cash flow. |
| Step 3 | **Complete KYC and get funded** — E-sign documents and verify your bank account. Funds can reach your account in as little as 24 hours to 7 days. |
| CTA | Start Application |

### `stories`

| Name | Role | Question | Outcome |
|------|------|----------|---------|
| Rajiv K. | Garment Shop Owner | "I wanted to stock up for the wedding season, but I did not have collateral. Could I still get a loan?" | Rajiv qualified for a collateral-free ₹25 Lakh business loan. |
| Sunita M. | Handicraft Artisan, Varanasi | "Our loom needed upgrading, but cash flow was tight. Could we get a loan for equipment?" | Sunita secured a ₹15 Lakh machinery loan at a competitive rate. |
| Amit V. | E-commerce Logistics, Gurugram | "We needed working capital to hire more staff and take on bigger orders. What was the simplest way?" | Amit received an ₹18 Lakh working capital loan in days. |

### `recognition`

| Element | Copy |
|---------|------|
| eyebrow | Recognition |
| heading | Trusted by lenders. Recognised by the industry. |
| Points | FACE Registered Member · RBI-Aligned Lending Practices · 10+ Active Lender Partners · Zero Platform Fee |

### Recognition carousel items (8)

1. **FinVision 2026, NIBM** — Demoed at India's national banking innovation fest.
2. **India AI Summit** — Pitched NavDhan's AI-powered credit matching to policymakers and investors.
3. **Startup Mahakumbh** — Popular Choice recognition from India's largest startup congregation.
4. **Bengaluru Tech Summit** — Official launch of NavDhan to Karnataka's tech ecosystem.
5. **STPI IMC** — Recognised at STPI's India Accelerator and innovation cohort.
6. **Kotak BizLabs Demo Day** — Featured fintech among Kotak's enterprise startup network.
7. **Bharat Innovation Conclave** — National showcase for inclusive finance innovation.
8. **Rubrix, T-Hub** — Selected at T-Hub's Rubrix program for high-growth startups.

### `associationBadges`

Display four trusted association logos in a single row:
- FACE
- Startup Mahakumbh
- STPI FinGlobe
- FinVision

### `ecosystemTicker`

Marquee ticker of 8 tech/AI/credible partner logos:
Google, NVIDIA, Microsoft, Intel, Perplexity, OpenAI, Amplitude, Eleven Labs.

### `emiCalculator`

| Element | Copy |
|---------|------|
| eyebrow | EMI Calculator |
| heading | Plan your monthly outgo before you apply. |
| intro | Move the sliders to see an estimate. Your final rate will depend on your business profile, lender, and tenure. |
| amount | Loan amount |
| rate | Interest rate |
| tenure | Tenure |
| monthly | Monthly EMI |
| principal | Principal |
| totalInterest | Total interest |
| totalPayable | Total payable |
| CTA | Check Eligibility |

### `finalCta`

| Element | Copy |
|---------|------|
| heading | The right loan for your business is a few clicks away. |
| subtext | Zero platform fee · Multiple lender offers · Quick, transparent process |
| CTA primary | Apply Online |
| CTA secondary | Talk to Us |

### `footer`

| Element | Copy |
|---------|------|
| tagline | Fair loans for India's MSMEs. Built by Kubar Labs. |
| company | Kubar Protocol Private Limited (CIN: U70200WB2024PTC274850) |
| address | 156 Tarvakere, BTM Layout 1st Stage, Bengaluru, Karnataka, India |
| Contact | Loan Enquiry · Partnership Enquiry · Support · Careers · Press (all `@kubar.tech`) |
| Legal | Privacy Policy, Terms of Use, Fair Practices Code, Cookie Policy, Grievance Redressal, RBI-DLG Disclosure, Consent Policy |
| badges | RBI Aligned · FACE Registered · 10+ Lender Partners |
| rights | © 2026 Kubar Protocol Private Limited. NavDhan is a product of Kubar Labs. |

### Apply portal

**Step titles**
1. Business details — Tell us about your business so we can match you with the right lenders.
2. Documents — Share your GST returns, bank statements, and PAN. Your data is used only with your consent.
3. Offers — Compare loan offers side by side. Pick the one that suits your cash flow.
4. KYC & disbursal — E-sign and verify your bank account. Funds are sent directly to you.

**Buttons:** Continue, Back, Save and continue, Check eligibility, Upload document, Choose this offer, Verify OTP, E-sign documents, View dashboard, Back to home.

**Success screen**
- Heading: **Aapka application humare paas aa gaya hai.**
- Subtext: "We are reviewing your details. Expect a call or message from our team within 24 hours."
- CTAs: View Dashboard, Back to Home.

**Error messages**
- "Please enter a valid 10-digit mobile number."
- "Please enter a valid email address."
- "This field is required so lenders can review your application."
- "File too large. Please upload a PDF or image under 5 MB."
- "We could not read this file. Please upload a clear PDF or image."
- "Something went wrong on our side. Please try again, or call us for help."
- "We could not match you to a lender right now. Let's look at what we can do next."
- "OTP did not match. Please try again or request a new code."

---

## ─ Part 4 · Apply Portal Flow ─

1. **Loan intent** — amount (₹5L–₹1Cr), tenure (3–12 months), purpose, referral code optional.
2. **Personal / contact** — full name, mobile, email, business PIN code.
3. **Aadhaar verification** — number + OTP stub.
4. **PAN verification** — PAN number.
5. **GST verification** — GSTIN; allow skip with note if not registered.
6. **ITR upload** — previous year ITR PDF.
7. **Bank statements** — 6–12 months via Perfios stub.
8. **Review & submit** — editable summary + consent checkboxes.
9. **Submission result** — success with reference number or failure with support path.

**No Account Aggregator consent screen.** All data requests follow explicit, consent-based design: each document upload step presents a clear purpose statement and requires user action to proceed.

---

## ─ Part 5 · Design Tokens (quick reference) ─

See `ui-system.md` for full token table. Key values:

```css
--color-primary: #EA580C;       /* nt-orange-600 */
--color-primary-700: #C2410C;
--color-success: #22C55E;       /* nt-green-500 */
--color-text: #0F172A;          /* nt-slate-900 */
--color-muted: #475569;         /* nt-slate-600 */
--color-surface-alt: #FAFAF8;   /* nt-cream */

--font-ui: 'Inter', 'Noto Sans Devanagari', system-ui, sans-serif;
--font-display: 'Instrument Serif', Georgia, serif;

--section-py: clamp(5rem, 8vw, 7rem);
--container: 1280px;
--radius-sm: 8px;
--radius-lg: 12px;
--radius-pill: 999px;
```

---

## Sign-off

This brief is the single source of truth for the redesign. Once approved, the factory team will use it to build, test, and visually verify the new site.

**Approved by client on 2026-06-18 with the following amendments:**
- Preserve all eight languages from the existing site: English, हिन्दी, বাংলা, తెలుగు, मराठी, தமிழ், ಕನ್ನಡ, മലയാളം.
- Reorder homepage: Hero → Association badges → Tech ecosystem ticker → Loan products → Why NavDhan → Recognition carousel → Customer stories → EMI calculator → Final CTA.
- No English subtitle for the primary tagline.

Please reply **"approved"** or list any final tweaks. No code will be written until the brief is signed off.
