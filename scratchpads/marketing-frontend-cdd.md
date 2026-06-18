# Component Design Document — NavDhan Marketing Website (Unit 2)

**Role:** Frontend engineer, Unit 2 (Marketing Website)  
**Branch:** `factory/navdhan-redesign/marketing/frontend`  
**Inputs:**
- Creative brief: `.opencode/factory/Design.md`
- Marketing contract: `.opencode/factory/marketing-contract.yaml`
- UI component registry: `.opencode/factory/ui-component-registry.json`
- Visual design system: `.opencode/factory/design/ui-system.md`
- UX / IA: `.opencode/factory/design/ux-ia.md`

**Scope:** This document defines the component architecture, file layout, data wiring, animation strategy, accessibility approach, and static-asset plan for the public marketing site only (Home, Team, and Legal pages). It does **not** cover the `/apply` portal, which is Unit 3.

---

## 1. Project File Layout

All marketing routes live under `(marketing)` route group so the shared shell (Header + Footer) is injected once via `layout.tsx`. Apply-portal routes can live in a separate `(apply)` group when Unit 3 is implemented.

```text
app/
├── [locale]/
│   ├── (marketing)/
│   │   ├── layout.tsx                 # marketing shell: Header + children + Footer
│   │   ├── page.tsx                   # homepage
│   │   ├── not-found.tsx              # localized 404 inside locale segment
│   │   ├── error.tsx                  # localized error boundary
│   │   ├── team/
│   │   │   └── page.tsx               # team page
│   │   ├── legal/
│   │   │   └── [slug]/
│   │   │       └── page.tsx           # static legal pages
│   │   └── globals.css                # Tailwind v4 + font imports
│   ├── layout.tsx                     # next-intl Provider + metadata + html lang/dir
│   └── not-found.tsx                  # fallback 404 outside locale segment
├── components/
│   ├── shells/
│   │   ├── AnnouncementBar.tsx
│   │   ├── Header.tsx
│   │   ├── MobileMenu.tsx
│   │   ├── LocaleSelector.tsx
│   │   └── Footer.tsx
│   ├── layout/
│   │   ├── Container.tsx
│   │   └── Section.tsx
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── AssociationBadges.tsx
│   │   ├── EcosystemTicker.tsx        # registry name; contract calls it TechEcosystemTicker
│   │   ├── LoanProducts.tsx
│   │   ├── WhyNavDhan.tsx
│   │   ├── RecognitionCarousel.tsx
│   │   ├── CustomerStories.tsx
│   │   ├── EmiCalculator.tsx
│   │   ├── FinalCta.tsx
│   │   ├── TeamHero.tsx               # page-level section, not in registry
│   │   ├── TeamMembers.tsx            # page-level section, not in registry
│   │   ├── Advisors.tsx               # page-level section, not in registry
│   │   └── JoinCta.tsx                # page-level section, not in registry
│   └── ui/
│       └── (shadcn components installed on demand)
├── lib/
│   ├── i18n/
│   │   ├── config.ts                  # locale definitions + routing config
│   │   └── navigation.ts              # nav link lists per locale
│   └── utils/
│       ├── cn.ts                      # clsx + tailwind-merge
│       └── emi.ts                     # pure EMI math helper
├── content/
│   ├── association-badges.json
│   ├── tech-partners.json
│   ├── recognition.json
│   ├── stories.json
│   ├── emi-calculator.json
│   ├── team.json
│   └── legal-pages.json
├── messages/
│   ├── en.json
│   ├── hi.json
│   ├── bn.json
│   ├── te.json
│   ├── mr.json
│   ├── ta.json
│   ├── kn.json
│   └── ml.json
├── public/
│   ├── assets/
│   │   ├── logos/
│   │   ├── badges/
│   │   ├── partners/
│   │   ├── recognition/
│   │   ├── stories/
│   │   └── team/
│   ├── favicon.ico
│   ├── apple-touch-icon.png
│   ├── og-image.jpg
│   └── twitter-image.jpg
├── next.config.ts
└── middleware.ts                      # next-intl middleware + locale rewrite
```

### Layout responsibility split

| File | Responsibility |
|------|----------------|
| `app/[locale]/layout.tsx` | Sets `<html lang>` and `dir`. Renders `NextIntlClientProvider`. Loads global fonts. Provides root metadata with `generateMetadata`. |
| `app/[locale]/(marketing)/layout.tsx` | Reads messages/global.json. Renders `AnnouncementBar`, `Header`, `main`, `Footer`. Sticky header correction padding (optional). |
| `app/[locale]/(marketing)/page.tsx` | Composes all homepage sections in signed-off order. Loads `messages/home.json` + content JSON files. |
| `app/[locale]/(marketing)/team/page.tsx` | Composes team page sections. Loads `messages/team.json` + `content/team.json`. |
| `app/[locale]/(marketing)/legal/[slug]/page.tsx` | Generates static params from `content/legal-pages.json`. Uses narrower `Container` size. |

---

## 2. Dependencies to Add

### Runtime

```bash
npm install next-intl framer-motion lucide-react
```

- **`next-intl`** — App Router i18n. Store locale in URL only. Default locale `en` is served prefixless at `/`; other locales at `/<locale>/`.
- **`framer-motion`** — Hero stagger, scroll reveals, mobile menu, locale dropdown, carousels, ticker.
- **`lucide-react`** — All icons (no emoji).

### Optional / build-time

- **GSAP + Lenis** — Not required for launch. Contract lists them, but marketing pages need only Framer Motion. Add only if smooth scrolling is mandated later.

### Tailwind v4 + shadcn/ui

- Project is expected to run Tailwind CSS v4. Use CSS-first configuration (`app/globals.css` with `@import "tailwindcss"` and `@theme` block).
- Install shadcn/ui primitives lazily:
  - `npx shadcn add button`
  - `npx shadcn add slider`
- For the EMI calculator slider evaluate whether the shadcn `Slider` maps cleanly to accessibility requirements; if not, build a thin wrapper around native `<input type="range">`.

### Fonts

Load via `next/font/google`:

```ts
import { Inter, Instrument_Serif } from 'next/font/google';

const inter = Inter({
  subsets: ['latin', 'devanagari'],
  variable: '--font-inter',
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-instrument-serif',
  display: 'swap',
});
```

Note: `Instrument_Serif` does not ship Devanagari; keep it strictly for Latin hero accent words. For Hindi/Marathi headings, keep `Inter` + system Devanagari fallback.

---

## 3. Component-by-Component Implementation Notes

All components are TypeScript React Server Components by default; `"use client"` is added only where interactivity requires state, effects, or event handlers.

### Global shells

#### `AnnouncementBar`

- **Source:** `messages/global.json` key `announcement`.
- **Type:** Client component (needs `localStorage` dismissal state + `useReducedMotion`).
- **Props:** `message`, `href?`, `ctaLabel?`, `variant?: 'default' | 'accent'`, `dismissible?: boolean`.
- **Persistence:** On dismiss, store `navdhan:announcement:hidden` in `localStorage`. Read value on mount; render null if hidden.
- **Animation:** `motion.div` from `y: -32, opacity: 0` to `y: 0, opacity: 1` (300ms). Exit via `AnimatePresence` with `y: -32, opacity: 0`.
- **Reduced motion:** Render instantly without vertical slide; still allow collapse on dismiss.
- **Accessibility:** `role="banner"` or `role="complementary"` with `aria-label="Announcement"`. Dismiss button is 44x44px, `aria-label="Close announcement"`.
- **Responsive:** Single-line on desktop; allow wrap to two lines on mobile.

#### `Header`

- **Type:** Client component.
- **Props:** `navLinks: NavLink[]`, `cta: Cta`, `showLanguageToggle?: boolean`, `variant?: 'transparent' | 'solid'`.
- **Variant behavior:**
  - `transparent` at top of homepage; becomes solid once scroll > 24px.
  - `solid` for legal / team / sub-pages.
- **State:**
  - `isScrolled` — scroll listener throttled with `requestAnimationFrame`.
  - `isMobileMenuOpen` — toggles `MobileMenu` overlay.
- **Data source:** `messages/global.json` nav keys + `cta`.
- **Animation:** `motion.header` animates `backgroundColor`/`backdropFilter` over 200ms. Burger icon animates path via Framer Motion.
- **Accessibility:** Semantic `<header>` with `aria-label="Main navigation"`. Skip-to-content link first. Mobile toggle has `aria-expanded` and `aria-controls="mobile-menu"`.
- **Responsive:** 72px desktop / 64px mobile. Logo left, nav center, CTA + locale right, hamburger at ≤1024px.

#### `LocaleSelector`

- **Type:** Client component.
- **Props:** `value`, `options: LocaleOption[]`, `onChange(locale)`, `variant?: 'compact' | 'full'`.
- **Compact:** Current locale button opens popover list.
- **Full:** Used inside `MobileMenu` as vertical list with 44px touch targets.
- **Animation:** Dropdown reveals opacity + `y: -4`, stagger children 30ms.
- **Accessibility:** `aria-label="Select language"`, `aria-expanded` on trigger, focus trap in full dropdown, `Escape` closes.

#### `Footer`

- **Type:** Server component.
- **Props:** `taglineKey`, `companyKey`, `addressKey`, `copyrightKey`, `contactLinks: NavLink[]`, `companyLinks: NavLink[]`, `legalLinks: NavLink[]`, `badges: string[]`.
- **Data source:** `messages/global.json`.
- **Layout:** 4-column desktop; 2-column tablet; single-column mobile. Badges centered on dark bottom bar.
- **Accessibility:** `<footer>` landmark. Each `<nav>` has `aria-labelledby`. Visible focus rings. Muted text on dark footer must meet 4.5:1.
- **Animation:** Static by default. Optional viewport reveal: opacity + y, 600ms, once.

### Layout primitives

#### `Container`

- **Type:** Server component.
- **Props:** `children`, `size?: 'default' | 'legal' | 'full'`, `className?`.
- **Sizes:** `default` = 1280px; `legal` = 1024px; `full` = 100%.
- **Gutters:** `px-4 sm:px-6 lg:px-8`.

#### `Section`

- **Type:** Server component.
- **Props:** `children`, `as?: 'section' | 'div' | 'article'`, `id?`, `background?: 'white' | 'cream' | 'dark'`, `padding?: 'default' | 'tight' | 'none'`, `className?`.
- **Backgrounds:** white, cream (#FAFAF8), dark (#0A0A0A).
- **Padding:** default `py-20 md:py-28`; tight `py-8`; none `py-0`.
- **Accessibility:** Use `<section>` with id for in-page anchors (`#products`, `#why`, `#emi`, `#stories`).

---

### Homepage Sections

Order strictly follows approved Design.md amendments and `marketing-contract.yaml` `homepage_sections`:

1. AnnouncementBar
2. Hero
3. AssociationBadges
4. EcosystemTicker
5. LoanProducts
6. WhyNavDhan
7. RecognitionCarousel
8. CustomerStories
9. EmiCalculator
10. FinalCta
11. Footer

#### `Hero`

- **Source:** `messages/home.json` key `hero`.
- **Props:** `eyebrowKey`, `headlineKey`, `bodyKey`, `primaryCtaKey`, `primaryHref`, `secondaryCtaKey`, `secondaryHref`, `stats`.
- **Headline typography:** `text-display` token. Apply `Instrument Serif` only to emphasized words if copy permits; otherwise all Inter.
- **Stats:** 3-column desktop; 2x2 or vertical mobile. Values plain strings; no count-up.
- **Animation:** Staggered entrance `staggerChildren: 0.08`, `opacity: 0→1`, `y: 16→0`, 700ms, ease `[0.25, 0.46, 0.45, 0.94]`.
- **Reduced motion:** Force initial values to final; all content visible on paint.
- **Accessibility:** Single H1. Decorative accents `aria-hidden`.
- **Background:** cream (#FAFAF8).

#### `AssociationBadges`

- **Source:** `content/association-badges.json`.
- **Props:** `badges: { name, logoAsset, href?, altKey }[]`.
- **Layout:** 4 logos desktop; 2x2 tablet; horizontal scroll-snap mobile.
- **Animation:** Container `whileInView` opacity 0→1, 600ms. Badges scale 1.02 on hover.
- **Accessibility:** Section `aria-labelledby` "Recognised by". Linked badges have descriptive `aria-label`.
- **Fallbacks:** Missing SVG renders grayscale placeholder with name.

#### `EcosystemTicker` (contract name: `TechEcosystemTicker`)

- **Source:** `content/tech-partners.json`.
- **Props:** `partners`, `speedSeconds?: 30`, `pauseOnHover?: true`, `direction?: 'left' | 'right'`.
- **Implementation:** Duplicate partner array; animate `translateX: 0 → -50%` with `repeat: Infinity`, linear.
- **Pause:** Stop controls on hover/focus.
- **Reduced motion:** Convert to static horizontal scroll-snap list.
- **Accessibility:** `aria-roledescription="marquee"`. Focus pauses ticker.
- **Responsive:** Min logo width 96px mobile, 128px desktop.

#### `LoanProducts`

- **Source:** `messages/home.json` key `loanProducts`.
- **Props:** `eyebrowKey`, `headingKey`, `bodyKey`, `products: ProductCard[]`, `ctaKey`, `ctaHref`.
- **Layout:** 4-column desktop; 2 tablet; 1 mobile. Section CTA centered below.
- **Card:** border 1px slate-100, 12px radius, icon, H3 title, body, text CTA.
- **Animation:** Staggered cards `staggerChildren: 0.1`, `y: 24→0`, opacity, 600ms. Hover `y: -2`.
- **Accessibility:** Section H2. Internal link inside card only; no full-card click.
- **Icons:** Lucide mapping; fallback generic circle.

#### `WhyNavDhan`

- **Source:** `messages/home.json` key `whyNavdhan`.
- **Props:** `eyebrowKey`, `headingKey`, `bodyKey`, `reasons: ReasonBlock[]`, `trustBadgeKeys: string[]`, `ctaKey`, `ctaHref`.
- **Layout:** 3-column desktop; 2 tablet; 1 mobile. Trust badges wrap centered between grid and CTA.
- **Animation:** Grid stagger 0.08, `y: 24→0`, 600ms. Badges fade in as block.
- **Accessibility:** H2 section; H3 per reason. Trust badges as list with `aria-label="Trust indicators"`.
- **Background:** cream.

#### `RecognitionCarousel`

- **Source:** `content/recognition.json`.
- **Props:** `eyebrowKey`, `headingKey`, `items: RecognitionItem[]`, `autoAdvance?: true`, `interval?: 6000`, `showControls?: true`.
- **Layout:** Snap slider. Desktop: 1 card; tablet: 2; mobile: 1 + dots.
- **Animation:** Track `x: -activeIndex * slideWidth`, 400ms ease-in-out.
- **Auto-advance:** `useEffect` interval; pause on hover/focus/touch.
- **Reduced motion:** Disable auto-advance and translation; render static grid.
- **Accessibility:** `role="region"` `aria-roledescription="carousel"`. `aria-live="polite"` on slide changes. Prev/Next labels; dots use `aria-selected`.

#### `CustomerStories`

- **Source:** `content/stories.json`.
- **Props:** `eyebrowKey`, `headingKey`, `stories: StoryCard[]`, `ctaKey`, `ctaHref`.
- **Layout:** 3-column desktop; 2 tablet; 1 mobile with swipe/dots.
- **Card:** 4:3 image, H3 name, role, question quote, outcome.
- **Animation:** Stagger 0.12, `y: 24→0`, 600ms. Mobile `AnimatePresence` cross-fade 300ms.
- **Accessibility:** H2 section; H3 per card. Images alt includes customer name. Swipe region live region for pagination.

#### `EmiCalculator`

- **Source:** `content/emi-calculator.json` defaults + `messages/home.json` labels.
- **Props:** numeric ranges + `ctaKey`, `ctaHref`.
- **State:** `amount`, `rate`, `tenure`; derived `emi`, `totalInterest`, `totalPayable` formatted as INR.
- **Formula:** reducing-balance EMI. Store pure helper in `lib/utils/emi.ts`.
- **Layout:** 2-column desktop; stacked mobile. Sliders with numeric readout.
- **Inputs:** Native range inputs wrapped; labels visible; thumb 24px mobile.
- **Animation:** Number cross-fade 200ms. Thumb scale 1.15 on drag.
- **Reduced motion:** Values update instantly.
- **Accessibility:** `aria-valuetext` per slider; results `aria-live="polite"`; errors `aria-live="assertive"`.

#### `FinalCta`

- **Source:** `messages/home.json` key `finalCta`.
- **Props:** `headingKey`, `subtextKey`, `primaryCtaKey`, `primaryHref`, `secondaryCtaKey`, `secondaryHref`.
- **Layout:** Centered, max ~56ch, inline desktop / stacked mobile.
- **Animation:** `whileInView` opacity 0→1, scale 0.98→1, 600ms.
- **Reduced motion:** Static block.

---

### Team Page Sections

`TeamPage` is registered as a single page component; we decompose into sections.

#### `TeamHero`

- **Source:** `messages/team.json`.
- **Layout:** Page hero with H1, subtext, mission line. Background cream.
- **Animation:** Staggered entrance similar to homepage Hero.

#### `TeamMembers`

- **Source:** `content/team.json` `members`.
- **Layout:** 4-column desktop, 2 tablet, 1 mobile. Image 1:1.
- **Card:** photo placeholder, H3 name, role, bio, LinkedIn if provided.
- **Accessibility:** `<article>`. LinkedIn opens new tab with rel and descriptive label.

#### `Advisors`

- **Source:** `content/team.json` `advisors`.
- **Layout:** 2-column desktop/tablet, 1 mobile.
- **Card:** placeholder photo, H3 name, domain, contribution, LinkedIn.

#### `JoinCta`

- **Source:** `messages/team.json`.
- **Layout:** Centered block with CTA to `mailto:careers@kubar.tech`.
- **Animation:** FadeScale viewport.

---

## 4. Homepage Section Order

| # | Section | Background | Data Source |
|---|---------|------------|-------------|
| 1 | AnnouncementBar | slate-900 / accent | `messages/global.json` |
| 2 | Hero | cream | `messages/home.json` |
| 3 | AssociationBadges | white | `content/association-badges.json` + i18n alt keys |
| 4 | EcosystemTicker | cream | `content/tech-partners.json` |
| 5 | LoanProducts | white | `messages/home.json` |
| 6 | WhyNavDhan | cream | `messages/home.json` |
| 7 | RecognitionCarousel | white | `content/recognition.json` + headings |
| 8 | CustomerStories | cream | `content/stories.json` + headings |
| 9 | EmiCalculator | white | `content/emi-calculator.json` + labels |
| 10 | FinalCta | cream | `messages/home.json` |
| 11 | Footer | black | `messages/global.json` |

---

## 5. Team Page Layout

Route: `/[locale]/team`

1. Header
2. TeamHero
3. TeamMembers
4. Advisors
5. JoinCta
6. Footer

Photos use placeholder until client assets arrive; LinkedIn rendered conditionally.

---

## 6. Legal Shell / Footer Wiring

Legal pages reuse the global marketing layout; no separate legal shell.

- Route: `/[locale]/legal/[slug]`
- Allowed slugs: `privacy-policy`, `terms-of-use`, `fair-practices-code`, `cookie-policy`, `grievance-redressal`, `rbi-dlg-disclosure`, `consent-policy`.
- Layout renders Header (`solid`) and Footer.
- `generateStaticParams()` from `content/legal-pages.json`.
- `Container size="legal"` for readable width.
- Body format (plain/HTML/Markdown) to be decided; recommend `react-markdown` if Markdown.

---

## 7. Static Asset Map

| Asset | Path | Type | Status | Fallback |
|-------|------|------|--------|----------|
| NavDhan logo | `/assets/logos/navdhan-logo.svg` | SVG | Required | Text wordmark |
| Kubar Labs logo | `/assets/logos/kubar-labs-logo.svg` | SVG | Required | Text fallback |
| FACE badge | `/assets/badges/face-logo.svg` | SVG | Placeholder | Gray rectangle + label |
| Startup Mahakumbh | `/assets/badges/startup-mahakumbh-logo.svg` | SVG | Placeholder | Gray rectangle + label |
| STPI FinGlobe | `/assets/badges/stpi-finglobe-logo.svg` | SVG | Placeholder | Gray rectangle + label |
| FinVision | `/assets/badges/finvision-logo.svg` | SVG | Placeholder | Gray rectangle + label |
| Partner logos (8) | `/assets/partners/*.svg` | SVG | Placeholder | Text name |
| Recognition images (8) | `/assets/recognition/*.jpg` | JPG | Placeholder | Solid color block |
| Customer photos (3) | `/assets/stories/*.jpg` | JPG | Placeholder | Initials avatar |
| Team/advisor photos | `/assets/team/placeholder-avatar.jpg` | JPG | Placeholder | Initials avatar |
| Favicon / icons / OG | root public files | Mixed | Required | — |

### Asset strategy

- SVG logos: `next/image` unoptimized or inline for grayscale/color control.
- Photos: `next/image` with `sizes`; `placeholder="blur"` if data available.
- Missing assets must render graceful fallbacks; no broken image icons.

---

## 8. Performance / Accessibility Checklist

### Performance

- [ ] `next/font` for Inter, Noto Sans Devanagari, Instrument Serif; subset.
- [ ] Lazy-load below-fold images/sections.
- [ ] Above-fold hero render-blocking free.
- [ ] Ticker uses transforms only.
- [ ] `loading="lazy"` for non-hero images.
- [ ] Limit third-party scripts.
- [ ] Use `next-intl` namespaces to avoid unused strings.

### Accessibility

- [ ] Landmarks: header, main, footer, section, nav.
- [ ] Single H1 per page; logical heading order.
- [ ] Skip-to-content link.
- [ ] Touch targets ≥ 44x44px.
- [ ] Visible focus rings brand orange.
- [ ] Contrast: text on white ≥ 4.5:1; white on orange for large text only.
- [ ] `prefers-reduced-motion` disables auto-advance/transforms.
- [ ] Sliders have labels, `aria-valuetext`, live result region.
- [ ] No emoji; Lucide icons only.
- [ ] Images have descriptive alt from i18n.
- [ ] Locale updates `<html lang>` and `dir` (all Indic LTR).

### Responsive

- [ ] Mobile-first breakpoints.
- [ ] Hero H1 via `clamp()`.
- [ ] Grids collapse to single column mobile.
- [ ] `scroll-padding-top` for sticky header.
- [ ] Mobile menu focus returns on close.
- [ ] Slider thumbs 24px minimum.

---

## 9. Open Questions / Blockers

1. **Reference site unavailable.** The prompt references `/tmp/navdhan-site` but the directory does not exist. Need access for exact lockups/footer microcopy if required.
2. ~~Design.md path mismatch~~ **Resolved.** `Design.md` and all v1.1.0 contracts have been copied into `navdhan-redesign-2026/.opencode/factory/`.
3. **Component naming inconsistency.** Contract calls marquee `TechEcosystemTicker`; registry calls it `EcosystemTicker`. Recommend internal file `EcosystemTicker.tsx` with alias/export `TechEcosystemTicker` for contract compliance.
4. **Homepage order conflict.** Contract/Design.md approved order supersedes older `ux-ia.md` order.
5. **Missing team components in registry.** Registry registers only `TeamPage`; not `TeamHero`, `TeamMembers`, `Advisors`, `JoinCta`. This CDD treats them as section components; confirm intent.
6. **Legal body format.** `content/legal-pages.json` `bodyKey` is string; undecided plain/HTML/Markdown. Renderer (e.g. `react-markdown`) to be chosen in build phase.
7. **Hindi copy review.** All Indic message files need native-speaker review before release.
8. **Team photos missing.** Use placeholder + initials fallback.
9. **Customer stories fabricated.** Per `ux-ia.md`; confirm no disclaimers needed.
10. **GSAP + Lenis necessity.** Contract lists them but not needed for marketing MVP; confirm whether to install anyway.
11. **Dark mode out of scope.** Confirmed; no `dark:` variants.
12. **EMI rounding rules.** Confirm nearest rupee / rounding mode for displayed results.

---

## Appendix A. Shared TypeScript Shapes

```ts
export interface NavLink {
  labelKey: string;
  href: string;
}

export interface Cta {
  labelKey: string;
  href: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

export interface LocaleOption {
  value: string;
  label: string;
  script: string;
}

export interface ProductCard {
  id: string;
  titleKey: string;
  descriptionKey: string;
  iconName: string;
  href?: string;
  ctaKey: string;
}

export interface ReasonBlock {
  id: string;
  titleKey: string;
  bodyKey: string;
}

export interface RecognitionItem {
  id: string;
  titleKey: string;
  descriptionKey: string;
  imageAsset?: string;
  date?: string;
}

export interface StoryCard {
  id: string;
  name: string;
  roleKey: string;
  questionKey: string;
  outcomeKey: string;
  imageAsset: string;
}

export interface TeamMember {
  id: string;
  name: string;
  roleKey: string;
  bioKey: string;
  imageAsset?: string;
  linkedIn?: string;
}

export interface Advisor {
  id: string;
  name: string;
  domainKey: string;
  contributionKey: string;
  imageAsset?: string;
  linkedIn?: string;
}
```

---

## Appendix B. i18n namespace mapping

| Scope | Namespace | Notes |
|-------|-----------|-------|
| Global shell, nav, footer, alt | global | announcement, nav, footer keys |
| Homepage | home | hero, products, why, recognition, stories, emi, finalCta |
| Team | team | meta, hero, members, advisors, join |
| Legal | legal | `{slug}.title/description/lastUpdated` |
| Errors | errors | notFound, boundary |

---

## Appendix C. Animation quick reference

| Effect | Tech | Properties | Duration | Easing | Reduced Motion |
|--------|------|------------|----------|--------|----------------|
| Hero entrance | Framer Motion | opacity, y | 700ms | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | visible on paint |
| Section reveal | Framer Motion | opacity, y | 600ms | same | static |
| Cards grid | Framer Motion | opacity, y | 600ms | same | static |
| Marquee | Framer Motion | x | 30s | linear | scroll-snap list |
| Carousel | Framer Motion | x | 400ms | ease-in-out | static grid |
| Mobile menu | Framer Motion | x, opacity | 300ms | ease-in-out | instant |
| Button hover | Tailwind | color, y, scale | 150ms | ease | color only |
| Dropdown | Framer Motion | opacity, y | 200ms | ease-out | instant |

---

*End of CDD. No production code has been written.*
