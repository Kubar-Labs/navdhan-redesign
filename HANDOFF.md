# NavDhan Redesign 2026 — Factory Handoff

This handoff is intended for the next software-factory run. Start here before writing any new code.

## 1. Project snapshot

- **Product:** NavDhan — "One stop-solution for all your working capital needs" (borrower-facing D2C MSME term-loan product).
- **Company:** Kubar Protocol Private Limited, CIN `U70200WB2024PTC274850`.
- **HQ address:** 156, Tarvakere, BTM Layout 1st Stage, Bengaluru, Karnataka.
- **Contact emails:** Use `@kubar.tech` only. Public support is `support@kubar.tech`; business outreach is `outreach@kubar.tech`.
- **Stakeholders:** Vaibhav Sharma (Yash), Founder & Head of Product, Kubar Labs.
- **Repo:** `/home/yash/opencode-workspace/navdhan-redesign-2026`
- **Frozen branch merged to main:** `factory/navdhan-redesign/integration` (commit `70e7938`)
- **Live deployment:** https://navdhan-redesign-2026.vercel.app
- **Tech stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Framer Motion, GSAP/Lenis, next-intl.

## 2. What is already shipped

Marketing site (frontend only):

- 8-locale routing (`en`, `hi`, `bn`, `te`, `mr`, `ta`, `kn`, `ml`) for home, team, legal, and apply.
- Real NavDhan logo in header and footer.
- Announcement bar with dismissible state.
- Responsive header with mobile hamburger menu.
- Hero section with localized headline, support copy, and stats.
- Association badges section using real badge assets (FACE, RBI-aligned, DPDP, etc.).
- Technology partnerships dark infinite marquee with 8 partners: Amplitude, ElevenLabs, Google, Intel, Microsoft, NVIDIA, OpenAI, Perplexity.
- Loan products grid.
- "Why NavDhan" section.
- Recognition photo carousel with modal gallery + write-up for 8 events:
  1. FinVision 2026 (NIBM Pune)
  2. Startup Mahakumbh
  3. Bengaluru Tech Summit
  4. STPI IMC
  5. Kotak BizLabs Demo Day
  6. Bharat Innovation Conclave
  7. Rubrix T-Hub
  8. AI Summit
- Customer story cards with generated borrower photos.
- EMI calculator.
- Final CTA section.
- Team page pulling real people from kubar.tech/team with real headshots.
- Full legal subpage system (7 pages in each locale) with cross-linking and TOC.
- Apply form split into "Loan details" and "About you", localized in `en` and `hi`, with validation and a lightweight `/api/apply/lead` success flow.
- Build passes and generates 88 static pages.

## 3. What still feels unfinished (UI/UX focus for next run)

The user explicitly said the UI/UX element is not done. Do not treat the site as production-ready. Priorities:

1. **Hero typography and layout polish:** The Design.md wants an editorial serif accent (Instrument Serif) on key headline words, a strong focal path, and more generous, deliberate whitespace. The current hero still reads as a default SaaS hero.
2. **Motion design that is intentional, not generic:** Remove the remaining Framer Motion "fade everything in on scroll" patterns. Introduce one unique, calm motion language: staggered hero entrance, subtle parallax or scroll-linked reveals, and micro-interactions on CTAs only. Always respect `prefers-reduced-motion`.
3. **Section spacing and rhythm audit:** The homepage sections feel glued together. Audit every section for consistent vertical rhythm, container widths, and responsive behavior.
4. **Customer stories:** Replace generated photos with real, style-matched borrower/stock imagery or a credible illustration treatment. Names and stories are intentionally fictional; make them visually believable.
5. **Apply portal premium UX:** The form works, but it looks like a form. Reduce fields shown at once, add inline validation feedback, richer input states, and a clearer trust layer (security badges, progress cues, human microcopy).
6. **i18n completeness:** `bn`, `te`, `mr`, `ta`, `kn`, `ml` currently fall back to English for most keys or use the TS message files that re-export English. Finish Hindi parity, then at least partial translations for the other 6 locales.
7. **Team page layout:** The data is real, but the page layout and card treatment can be elevated to match a premium fintech team page.
8. **Footer refinement:** Better grouping, clearer "Talk to Us" block, and consistent trust badges.
9. **Cookie consent banner:** The Cookie Policy refers to granular consent, but no UI exists.
10. **Security headers / CSP:** Add a `middleware.ts` or `next.config.ts` `headers()` definition. This is a UI trust signal as much as a security control.
11. **Cut em-dashes and platform language:** Continue the copy audit. No `—` anywhere in marketing or meta copy. No "lender partners", "intermediary", or platform-facing language on borrower surfaces.

## 4. Design system reference

Primary source: `DESIGN.md` and `.opencode/factory/Design.md` in the repo.

- **Vibe:** trustworthy, calm, premium, Indian fintech.
- **Palette:** light cream/white surfaces (`#FAFAF8`), near-black text (`nt-slate-900`), one warm orange accent (`#EA580C`, `nt-orange-600`). No dark mode.
- **Type:** Inter for UI, Instrument Serif for hero/editorial moments. Use a real modular scale.
- **Layout:** near-monochrome, generous whitespace, one clear focal path per screen.
- **Motion:** subtle, calm, never spectacle. Honor `prefers-reduced-motion`.
- **Anti-patterns:** generic SaaS template, card soup, purple gradients, emoji icons, meaningless 3D blobs, motion for motion's sake.

## 5. Architecture and key files

```text
app/[locale]/(marketing)/page.tsx          # Homepage
app/[locale]/(marketing)/team/page.tsx     # Team page
app/[locale]/(marketing)/legal/[slug]/     # Legal pages
app/[locale]/apply/page.tsx                # Apply form
app/api/apply/lead/route.ts                # Lightweight lead stub
src/components/sections/                   # Homepage sections
src/components/shells/                     # Header, Footer, AnnouncementBar, Logo
src/components/motion/                     # FadeIn, RevealText, StaggerContainer
src/lib/data/siteData.ts                   # Primary marketing data source
src/lib/i18n/messages/*.json               # Server-side translations
src/lib/i18n/messages/*.ts                 # Client-side fallback translations (currently re-exports en.ts for most locales)
content/legal/<locale>/<page>.json         # Legal page content
content/company.json                       # Company details
public/assets/                             # All images, logos, badges, team photos
```

## 6. Local dev commands

```bash
cd /home/yash/opencode-workspace/navdhan-redesign-2026
npm install          # if needed
npm run dev          # http://localhost:3000
npm run build        # must pass before any deploy
npm run test         # vitest tests exist but may need updates
vc --prod            # deploy to Vercel (token already configured locally)
```

## 7. Tools the new factory run should use

- **Chrome DevTools MCP:** Capture full-page screenshots of `/en`, `/hi`, `/en/apply`, `/en/team`, `/en/legal/privacy-policy`, and scrolled homepage depths. Run Lighthouse audits for desktop and mobile. Inspect computed styles, layout shifts, and contrast failures. Iterate on the exact pixels.
- **Stitch / TypeUI:** Use for design-system exploration, new section variants, and component direction. If you use Stitch, sync extracted design tokens to Tailwind or CSS variables and keep the generated HTML/screenshots under `.opencode/factory/stitch-assets/`.
- **browser-harness:** End-to-end navigation, click-throughs, and final visual verification. Prefer `run-agent-headless`.
- **gbrain:** Update the project page `projects/navdhan-redesign-2026` with decisions and final outcomes.

## 8. How to start the next factory run

1. Read this `HANDOFF.md`.
2. Read `DESIGN.md` and `.opencode/factory/navdhan-design-decisions.md`.
3. Create a new branch from `main` (for example, `factory/navdhan-redesign/uiux-polish-v2`).
4. Initialize/update `.opencode/factory/active-tasks.json` with a new `run_id` and `branch_prefix`.
5. Run a visual baseline audit with Chrome DevTools MCP against the live URL.
6. Propose a short UI/UX polish plan to the user before implementing.
7. Implement, build, deploy, and verify.

## 9. Non-negotiables

- **Build must pass and deploy publicly** before ending the run.
- **No hardcoded secrets, no em-dashes in marketing copy, no platform/lender language on borrower surfaces.**
- **All @kubar.tech emails must be correct.**
- **Accessibility basics:** visible focus states, alt text, keyboard operability, reduced-motion support.
- **Commit convention:** `feat(scope):`, `fix(scope):`, `chore(scope):`. Keep commits small and reviewable.

## 10. Ready-to-paste prompt for the new factory run

```text
Resume the NavDhan.app redesign UI/UX polish from the frozen frontend MVP.

Project repo: /home/yash/opencode-workspace/navdhan-redesign-2026
The current frontend is merged into main (commit 70e7938) and deployed at https://navdhan-redesign-2026.vercel.app.

Read first:
- HANDOFF.md
- DESIGN.md
- .opencode/factory/navdhan-design-decisions.md

User (Vaibhav Sharma, Yash) says the UI/UX element is not done yet and wants a premium, no-corner-cutting result. Use the new factory capabilities, especially the Stitch and chrome-devtools MCP integration, to audit and improve the live site.

Priorities:
1. Audit the live site with chrome-devtools MCP: full-page screenshots on /en, /hi, /en/apply, /en/team, a legal page, and deep-scrolled homepage views. Run Lighthouse. Identify spacing, typography, color, contrast, layout-shift, and animation issues.
2. Elevate the homepage hero: editorial typography (Instrument Serif accent), stronger focal path, premium whitespace, no generic SaaS template feel.
3. Replace generic Framer Motion fade-ins with a calm, intentional motion system. Add staggered hero entrance, scroll-linked section reveals, and hover micro-interactions. Honor prefers-reduced-motion.
4. Improve section spacing and rhythm across the homepage. Make each section feel distinct but connected.
5. Replace generated customer-story photos with believable, style-matched borrower imagery or a coherent illustration treatment.
6. Polish the /apply form premium UX: reduce cognitive load, richer input states, inline validation, trust badges, progress cues, warm microcopy. Keep it frontend-only for now.
7. Complete i18n: full Hindi parity, then partial translations for bn, te, mr, ta, kn, ml. Fix any remaining exposed translation keys.
8. Refine the team page layout and card treatment.
9. Add a cookie-consent banner and security headers/CSP via middleware or next.config.ts.
10. Continue the literary/brand cleanup: no em-dashes, no platform/lender language, keep tagline "One stop-solution for all your working capital needs", use @kubar.tech emails.

Rules:
- No hardcoded secrets.
- Always run npm run build before finishing; the build must pass.
- Deploy the final result publicly and do a browser-harness / chrome-devtools visual verification pass.
- Use conventional commits.
- Update .opencode/factory/active-tasks.json and gbrain project page `projects/navdhan-redesign-2026` as you go.
- Create a short visual delta report before and after so the user can see what changed.

Start by showing me your audit findings and a 3-step plan, then proceed after I approve.
```
