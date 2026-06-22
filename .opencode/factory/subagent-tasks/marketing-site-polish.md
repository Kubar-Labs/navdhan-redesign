# Task: Marketing Site Polish — Fix copy, sections, animations, header/footer, team page

## Branch
`factory/navdhan-redesign/integration`

## Goal
Take the current deployed MVP on `factory/navdhan-redesign/integration` and bring the marketing site to a production-ready state that matches the approved Design.md and the user's 24-point instructions.

## Scope of work

### 1. Copy / literary (borrower-only, no em-dashes, natural human language)
- Update `src/lib/i18n/messages/en.json`, `en.ts`, `hi.json`, `hi.ts` (and any other locale files you touch) so **no em-dash (—)** appears in any marketing/hero/meta/team/footer copy.
- Replace the footer tagline with: "One stop-solution for all your working capital needs" (and natural Hindi equivalent).
- Update HQ address everywhere to: "156, Tarvakere, BTM Layout 1st Stage, Bengaluru, Karnataka" (`content/company.json`, messages, legal JSONs).
- Replace all `@navdhan.app` / `@kubarlabs.com` emails with `@kubar.tech` equivalents:
  - support, partnerships, careers, press, loan → their @kubar.tech versions
  - "Talk to Us" → `outreach@kubar.tech`
- Remove platform/lender language from borrower-facing surfaces:
  - "active lending partners" label → "trusted lending network"
  - "One application, multiple lenders." → "One application, matched offers."
  - "You pay only what the lender charges." → "You only pay what your loan agreement says."
  - Trust badge "10+ Lender Partners" → "Powered by Kubar"
  - Apply consent: "I consent to sharing my details with NavDhan's lending partners..." → "I consent to sharing my details so NavDhan can find a loan offer for my business."
- Keep a light "powered by Kubar" trust signal; remove "product of Kubar Labs" usage if present.
- Fix all i18n key mismatches so header/footer display proper text, not raw `global.nav.team`, `global.contact.support`, etc.

### 2. Header, footer, nav, logo, mobile menu
- Add a real NavDhan logo image. Use `public/assets/navdhan-logo.svg` (create a clean orange wordmark SVG, no black background, transparent).
- Add hamburger mobile menu so mobile users can reach Products / Why / EMI / Stories / Team.
- Fix footer "Talk to Us" to use `outreach@kubar.tech`.
- Ensure all footer legal links route correctly under `/{locale}/legal/{slug}`.
- Add correct company name "Kubar Protocol Private Limited", CIN, and address.

### 3. Sections
- **Association badges (home hero/just below hero):** Build as individual logo components/pills using SVG placeholders for FACE, Startup Mahakumbh, STPI FinGlobe, FinVision. Use the style from `/home/yash/screenshots/image 2.png` as reference if needed. Do not paste an image; build components.
- **Industry Recognition photo carousel:** Read `/home/yash/LinkedIn` directory. Add 8 recognitions as a carousel with one hero image per recognition. When a hero image is clicked, show the remaining photos for that recognition + a short write-up. Use Framer Motion for slides.
- **Tech Ecosystem Partners marquee ticker:** Adapt the partner list from kubar.tech (`/tmp/kubar-web` clone) into a horizontally scrolling infinite marquee of partner name/wordmark pills, pause on hover. Style must match NavDhan design language.
- **Loan Products:** 4 cards must have correct icons; fix the machinery icon issue.
- **Customer Stories:** Add representative avatars/portraits (use generic professional SVG placeholders or Unsplash-style URLs if public domain; label as illustrative).
- **EMI Calculator:** already present; ensure it remains functional and styled.
- **Final CTA:** present and linked to /apply.

### 4. Team page
- Scrape the team section from `https://kubar.tech/team` (use webfetch or browser-harness, public login if needed) and add all members + advisors to `app/[locale]/(marketing)/team/page.tsx`.
- Use real names, roles, bios; add LinkedIn links.
- Fix the current route/runtime error.

### 5. Animation system
- Implement a consistent, subtle animation system in `app/globals.css` and via Framer Motion components:
  - Staggered hero entrance (translateY + opacity, 0.7s ease)
  - Scroll-driven section reveals (intersection observer or Framer whileInView)
  - Tech ecosystem marquee (30s linear, pause on hover)
  - Carousel autoplay / manual navigation
  - Honor `prefers-reduced-motion`.

### 6. Design consistency
- Use `font-display` (Instrument Serif) for hero emphasized words per Design.md.
- Ensure light mode, orange accent, cream surfaces, rounded cards, consistent spacing.
- No generic card soup; no emojis.

### 7. Build & commit
- Run `npm run build` and fix errors.
- Commit all changes to `factory/navdhan-redesign/integration` with a concise conventional commit.
- Write `scratchpads/marketing-site-polish-summary.md` listing what was done and any remaining gaps.
