# Frontend Stitch Alignment & Layout Rebuild

You must pull the HTML content of all screens from the Google Stitch project, cache them locally, and then completely align the local Next.js codebase with the compiled design system and refined layout screens.

## Task 0: Pull and Cache Stitch Screen Artifacts
Before writing any code, you must fetch and write the raw HTML content of all active screens from our Stitch project dashboard (ID `7528632692757947510`) to the local directory `/home/yash/opencode-workspace/navdhan-redesign-2026/.opencode/factory/stitch-assets/`.

Here are the 15 screens and their download URLs to fetch and save:

1. **Terms of Service (Desktop)**
   - Filename: `terms-of-service-desktop.html`
   - URL: `https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2Y5MzM3Yzg5YjNlNzQ1OThhZTE3OWIyNmY1YjU0ZTA5EgsSBxCL5MGX3B8YAZIBIwoKcHJvamVjdF9pZBIVQhM3NTI4NjMyNjkyNzU3OTQ3NTEw&filename=&opi=89354086`
2. **Homepage - Refined (Mobile)**
   - Filename: `homepage-mobile.html`
   - URL: `https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2U3MzExMjZlODlkMDRhOGI5ODUyMWM5NWJmOWQ0ZDE5EgsSBxCL5MGX3B8YAZIBIwoKcHJvamVjdF9pZBIVQhM3NTI4NjMyNjkyNzU3OTQ3NTEw&filename=&opi=89354086`
3. **Apply for Funding (Desktop)**
   - Filename: `apply-desktop.html`
   - URL: `https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2FjMzI2YjEwYmEwMDRiNjVhNzI1MTYzNzhjNTJkZTEwEgsSBxCL5MGX3B8YAZIBIwoKcHJvamVjdF9pZBIVQhM3NTI4NjMyNjkyNzU3OTQ3NTEw&filename=&opi=89354086`
4. **Homepage - Refined (Desktop)**
   - Filename: `homepage-desktop.html`
   - URL: `https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzRjYTRhNjAxM2E3YTQwOGRhMWI4MmQzMWY4YTM2NDBjEgsSBxCL5MGX3B8YAZIBIwoKcHJvamVjdF9pZBIVQhM3NTI4NjMyNjkyNzU3OTQ3NTEw&filename=&opi=89354086`
5. **Our Team (Desktop)**
   - Filename: `team-desktop.html`
   - URL: `https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzNmMTkyMGIxOGMzNjQ3NGY5NTU0NDdmOWQ2MGEyZDQ3EgsSBxCL5MGX3B8YAZIBIwoKcHJvamVjdF9pZBIVQhM3NTI4NjMyNjkyNzU3OTQ3NTEw&filename=&opi=89354086`
6. **Apply for Funding (Mobile)**
   - Filename: `apply-mobile.html`
   - URL: `https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2Y5OWRlOWE4MzAyMTQzYzRhNjJhNDQwOGYyY2NhNWQ2EgsSBxCL5MGX3B8YAZIBIwoKcHJvamVjdF9pZBIVQhM3NTI4NjMyNjkyNzU3OTQ3NTEw&filename=&opi=89354086`
7. **Our Team (Mobile)**
   - Filename: `team-mobile.html`
   - URL: `https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzc4ZDVmZmE5NjM4MDQ2MjFiZTQ4YmQ0MWZkZDJhMmU1EgsSBxCL5MGX3B8YAZIBIwoKcHJvamVjdF9pZBIVQhM3NTI4NjMyNjkyNzU3OTQ3NTEw&filename=&opi=89354086`
8. **Privacy Policy (Desktop)**
   - Filename: `privacy-policy-desktop.html`
   - URL: `https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzcxYjVhZDhjZGQyZTRjMzBiNTg1NDkxNGQ2YTJkZWU2EgsSBxCL5MGX3B8YAZIBIwoKcHJvamVjdF9pZBIVQhM3NTI4NjMyNjkyNzU3OTQ3NTEw&filename=&opi=89354086`
9. **Fair Practices Code (Desktop)**
   - Filename: `fair-practices-desktop.html`
   - URL: `https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzk4OGNhMTU3MzUyNjQxOGU4ODQzMWFiNzk3YzczZGVmEgsSBxCL5MGX3B8YAZIBIwoKcHJvamVjdF9pZBIVQhM3NTI4NjMyNjkyNzU3OTQ3NTEw&filename=&opi=89354086`
10. **Grievance Redressal (Desktop)**
    - Filename: `grievance-redressal-desktop.html`
    - URL: `https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzk3ZWVlYTRmMTdhMzRhM2JiMjEwOTcxOWJhZWQ0OWIzEgsSBxCL5MGX3B8YAZIBIwoKcHJvamVjdF9pZBIVQhM3NTI4NjMyNjkyNzU3OTQ3NTEw&filename=&opi=89354086`
11. **Grievance Redressal (Mobile)**
    - Filename: `grievance-redressal-mobile.html`
    - URL: `https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzM5YTcxNTZkMzNiZDQ4N2VhNmMwOGJhNmQxNmZkNDBlEgsSBxCL5MGX3B8YAZIBIwoKcHJvamVjdF9pZBIVQhM3NTI4NjMyNjkyNzU3OTQ3NTEw&filename=&opi=89354086`
12. **Privacy Policy (Mobile)**
    - Filename: `privacy-policy-mobile.html`
    - URL: `https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2M1YjE5Y2E3YzBiNzRiOWVhNWUwZWUzMzdmYWNmNmU0EgsSBxCL5MGX3B8YAZIBIwoKcHJvamVjdF9pZBIVQhM3NTI4NjMyNjkyNzU3OTQ3NTEw&filename=&opi=89354086`
13. **Terms of Service (Mobile)**
    - Filename: `terms-of-service-mobile.html`
    - URL: `https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2RiYWU3M2NlMTFiODQ5YzNhZDliMWFmZDg2MTg2ZThkEgsSBxCL5MGX3B8YAZIBIwoKcHJvamVjdF9pZBIVQhM3NTI4NjMyNjkyNzU3OTQ3NTEw&filename=&opi=89354086`
14. **Fair Practices Code (Mobile)**
    - Filename: `fair-practices-mobile.html`
    - URL: `https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzdkMjFmMDgyNzYwNDRkZTI5M2Y2OWIwMGZhMDYxYWYzEgsSBxCL5MGX3B8YAZIBIwoKcHJvamVjdF9pZBIVQhM3NTI4NjMyNjkyNzU3OTQ3NTEw&filename=&opi=89354086`
15. **Our Team - Section Layout (Mobile)**
    - Filename: `team-section-mobile.html`
    - URL: `https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzZlMzMwNjJiNWI0ZDQ5MjI4MDhlYWMyMDkxYmJhMjVlEgsSBxCL5MGX3B8YAZIBIwoKcHJvamVjdF9pZBIVQhM3NTI4NjMyNjkyNzU3OTQ3NTEw&filename=&opi=89354086`

*Make sure to download and cache each file cleanly.*

---

## Detailed Rebuild Requirements

### 1. Typography & Font Families
- **Instrument Serif:** Ensure the `.font-display` utility class is applied to all major headings (`<h1>` and `<h2>` elements) so that the serif font is active. Make it `italic` to align with the Stitch "Calm Credibility" look:
  - `<h1 className="font-display italic ...">`
  - `<h2 className="font-display italic ...">`
- **Inter:** Used for body, labels, buttons, values, and calculations.

### 2. Colors & Spacing
- Backgrounds: Use background `bg-nt-cream` (`#FAFAF8`) for base section background panels.
- Card Surfaces: Use background `bg-white` (`#FFFFFF`) for card containers, inputs, and content blocks.
- Borders & Shadows: Use `1px border border-nt-slate-200` and highly diffused ambient shadow `shadow-[0px_4px_20px_rgba(15,23,42,0.05)]` for all interactive cards.
- Margins & Padding: Keep generous vertical breathing room (`py-20 md:py-28`) for desktop sections and transition to responsive layouts on mobile devices.

---

## Page-by-Page Alignment Specifications

### 1. Homepage Refactor (`app/[locale]/(marketing)/page.tsx`)
- Refactor the hero section into a responsive grid (`grid lg:grid-cols-12 gap-12 items-center`).
  - **Left Column (lg:col-span-7):**
    - Eyebrow: `"Fast business loans for India's MSMEs"` or localized.
    - Main Heading (`<h1>`): `"One stop-solution for all your working capital needs"` in `font-display italic text-4xl md:text-5xl lg:text-6xl`.
    - Subtitle / Body text: `"Aap business badhayein, hum funding sambhalte hain. Fast, transparent, and digital loans designed for MSMEs."`
    - CTAs: Primary CTA button (`"Check Eligibility"`), and Secondary CTA button (`"View Products"`).
    - Hero Stats (3 columns): `24Hr Disbursal`, `100% Digital`, `500+ SMEs Served`.
  - **Right Column (lg:col-span-5):**
    - A large business owner image using URL:
      `https://lh3.googleusercontent.com/aida-public/AB6AXuCXYUdUcaSgFmtSJhKeYlcShRRxa5ZvFKdahXIEa9OFW8UWsJfJsEQD8e9KTSZ8RGoaVnet90ggdrFOa9K1kaIhcztAl08LGDalme_uFBKR25id3fDe7LMaMAnDZhrZ98LicKmp7TI27aySuK70OzSrKi-tNrzCNSQZWgOiD56MRL9KM8YV1oIn0-8vusnAgYQR-gniOLHFYz29EURVYuLET9Bwlf7eumVUzgbWjwdBm3KBu4d2PXJ2x4ZArt8DZj8JIstwlhaTM8Q`
    - Floating approval overlay card: `"Funding Approved: ₹15,00,000"`.
- **Trusted & Compliant Section:** monochrome grayed-out badges for `RBI ALIGNED`, `FACE REGISTERED`, `STPI FinGlobe`, `FinVision`.
- **Featured Product Section:**
  - Heading (`<h2>`): `"Tailored Business Financing"` in `font-display italic`.
  - Implement split card visual for **Term Loans**:
    - Left Column: Tag `"Most Popular"`, Heading `"Term Loans"`, specs grid (Amount: `"₹5L - ₹1Cr"`, Interest Rate: `"12% - 24% p.a."`, Tenure: `"3 - 12 Months"`, Processing: `"Zero Hidden Fees"`).
    - Right Column: Product visualization image URL:
      `https://lh3.googleusercontent.com/aida-public/AB6AXuCWwsgXKRo1SgKeGIArC9I3DjcqLrozkGerKRgGeowwLRjhVagbiG5gpC10ZShEF3qpX0bi9DsVNUj72OVlU1aVzNg2ME_AzQM5rhtxVqB_apfSpgle1HbqLq_i8Xr7KnBqYzXGqzNt7V5Tsbj_BGBS_DsIU3xz5TQd381uJEaNTrYRtUngmw1rFALtzg3abU5EwSgy6ep7l7vYF7EJ4QJI36swriPWTDV6fzjdGP36wxW2uiYbll4Uf00DsQjoJmDU8tmW7OT3140`
- **Why Choose NavDhan Section:**
  - Heading (`<h2>`): `"Why Choose NavDhan?"` (font-display italic).
  - 6 clean white cards matching Stitch copy:
    1. **Instant Sanction** (bolt): `"Get in-principle approval within minutes using our AI-driven assessment engine."`
    2. **100% Secure** (shield): `"Bank-grade encryption ensures your business data remains completely private and protected."`
    3. **Fair Pricing** (scale/balance): `"Transparent interest rates with absolutely zero hidden charges or surprise fees."`
    4. **Minimal Paperwork** (file): `"A completely digital journey. Upload basic documents and let our systems do the rest."`
    5. **24/7 Support** (headphones): `"Dedicated relationship managers available round the clock to assist your queries."`
    6. **Flexible Tenure** (calendar): `"Choose repayment schedules that align perfectly with your business cash flows."`
- **Interactive EMI Calculator ("Plan Your Finances"):**
  - Refined ranges, 6px slider tracks, and highlighted subtle cream "Live Breakdown" area.
- **Final CTA Section:**
  - Heading: `"Ready to grow your business?"` (font-display italic).
  - Body: `"Join 500+ successful enterprises scaling with NavDhan's working capital solutions."`
  - Button CTA: `"Start Application Now"`.

### 2. Team Page Refactor (`app/[locale]/(marketing)/team/page.tsx`)
- Refactor to match Stitch team layout exactly:
  - Heading (`<h1>`): `"Meet Our Team"` in `font-display italic`.
  - Mission banner: `"Empowering India's MSMEs with access to transparent, fair, and fast working capital. Our team brings together veteran bankers, risk analysts, and tech innovators."`
  - Core Values Grid (3 cards):
    1. **Empathy:** `"We understand the challenges of running a business and treat every entrepreneur with dignity and respect."`
    2. **Transparency:** `"No hidden fees, no surprise terms. We believe in absolute clarity in our loan products and processes."`
    3. **Speed:** `"Time is money for small enterprises. We continuously optimize our systems to deliver capital when you need it."`
  - Leadership Grid: Renders standard leadership grid with names, roles (preserving "Borrower Onboarding" for Divyesh Reddy), and localized biographies.

### 3. Apply Page Refactor (`app/[locale]/apply/page.tsx`)
- Ensure the apply page dynamically loads form copy from the localized `"apply"` namespace structure in the message JSON files.
- Align the layout structure with the Stitch Apply wizard elements:
  - Heading: `"Apply for Funding"` in `font-display italic`.
  - Renders 3 clean steps: **1. Business Details**, **2. Personal Details**, **3. Documents Upload**.
  - Renders a sidebar with **Security Assurance** blocks: `"🔒 Bank-Grade Security: Your data is fully encrypted and never shared without permission."` and `"RBI Aligned Assessment"`.

---

## Technical Verification
- Save all fetched screens to `/home/yash/opencode-workspace/navdhan-redesign-2026/.opencode/factory/stitch-assets/` as part of Step 0.
- Ensure all 29 tests under `tests/i18n/` pass flawlessly.
- Apply localized Hindi translations inside `hi.json` to deliver identical language parity.
- Verify production compilation with `npm run build`.
