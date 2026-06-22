# Micro-CDD — Technology Partnerships Marquee + Sitewide Animation System

**Role:** Frontend specialist, NavDhan redesign factory run  
**Branch:** `factory/navdhan-redesign/integration`  
**Scope:** Add the technology-partnership marquee and a reusable, reduced-motion-safe animation layer to the marketing site only (`/`, `/team`, `/legal/*`). Out of scope: `/apply`, backend, DB.

**Parent CDD:** Inherits from `scratchpads/marketing-frontend-cdd.md` (approved by staff-engineer on 2026-06-19).

---

## 1. Files to create / change

| Path | Action | Purpose |
|------|--------|---------|
| `src/hooks/useReducedMotion.ts` | Create | Detect `prefers-reduced-motion` on the client. |
| `src/components/motion/FadeIn.tsx` | Create | Reusable section reveal: fade + translateY. |
| `src/components/motion/StaggerContainer.tsx` | Create | Parent wrapper that staggers direct children. |
| `src/components/sections/EcosystemTicker.tsx` | Create | Infinite marquee of partner logos + reduced-motion static grid. |
| `src/lib/data/siteData.ts` | Update | Limit `techPartners` to the eight listed partner logos. |
| `app/[locale]/(marketing)/page.tsx` | Update | Wire `EcosystemTicker` in approved section order; apply animations. |
| `app/[locale]/(marketing)/team/page.tsx` | Update | Apply `FadeIn` / `StaggerContainer` reveals. |
| `src/components/legal/LegalPageShell.tsx` | Update | Wrap page content in `FadeIn`. |
| `app/globals.css` | Update | Add `marquee-scroll` keyframes + `.animate-marquee` utility. |

## 2. Animation system design

### Tokens

- **Duration:** 0.6 s (sections), 0.7 s (hero first element via delay).
- **Ease:** `[0.25, 0.1, 0.25, 1]`.
- **TranslateY:** 16 px hidden -> 0 visible.
- **Opacity:** 0 -> 1.
- **Viewport trigger:** `once: true`, `amount: 0.2`.
- **Stagger:** 0.1 s between children.

### Reduced motion

- `useReducedMotion()` returns `true` when `prefers-reduced-motion: reduce` is active.
- When `true`, `FadeIn` and `StaggerContainer` render static `<div>` wrappers with no transform/opacity transition.
- The marquee falls back to a static grid of logos.

### Components

#### `FadeIn`

Props: `children`, `className?`, `delay?`, `once?`, `amount?`, `direction?`.
- Under normal motion: `motion.div` with `whileInView`, `initial={{ opacity: 0, y: 16 }}`.
- Reduced motion: no animation layer.

#### `StaggerContainer`

Props: `children`, `className?`, `stagger?`, `delay?`, `once?`.
- Wraps each child in `motion.div` configured with `variants`.
- Parent `motion.div` sets `staggerChildren / delayChildren`.
- Reduced motion: plain container.

#### `useReducedMotion`

- Returns boolean; updated via `matchMedia('(prefers-reduced-motion: reduce)')` listener.
- Safe for SSR (initial `false`, set in `useEffect`).

## 3. Technology partnerships marquee

### Data

Use exactly the eight logos listed in the task prompt:

- amplitude.png
- eleven.png
- google.png
- intel.png
- microsoft.png
- nvidia.png
- openai.png
- perplexity.png

Stored as `techPartners` in `src/lib/data/siteData.ts`.

### UX / accessibility

- Heading eyebrow key: `home.ecosystem.eyebrow` -> "Technology Partnerships".
- Infinite horizontal scroll from right to left using a duplicated logo set (so the loop is visually seamless).
- CSS animation duration ~30 s linear; paused on hover / focus.
- Reduced motion: static horizontal flex/grid.
- Each logo has `alt` text.
- Marquee container has `aria-roledescription="marquee"` and `aria-label`; links have explicit labels and are focusable without trapping focus.
- Logos default to muted grayscale, transition to full color on hover/focus.
- Fade masks on left and right edges via `mask-image`.

### Implementation

- Client component (uses `useReducedMotion`).
- Duplicate logo list inside the animated track.
- Tailwind utility `animate-marquee` defined in `globals.css`.
- Logo height: `h-8 md:h-10`; width constrained to `max-w-[140px]`; `object-contain`.

## 4. Section animation map

### Homepage

- **Hero:** `StaggerContainer` wrapping eyebrow, headline, body, CTAs, stats.
- **Association badges:** `FadeIn` reveal.
- **Technology partnerships:** `EcosystemTicker` includes its own `FadeIn` entrance.
- **Loan products:** heading `FadeIn`, cards `StaggerContainer`.
- **Why NavDhan:** heading `FadeIn`, cards `StaggerContainer`.
- **Recognition carousel:** wrapped in `FadeIn`.
- **Customer stories:** heading `FadeIn`, cards `StaggerContainer`.
- **EMI calculator:** wrapped in `FadeIn`.
- **Final CTA:** wrapped in `FadeIn`.
- Trust badges remain static (not in task scope).

### Team page

- Page hero: `FadeIn`.
- Team member cards: `StaggerContainer`.
- Advisor cards: `StaggerContainer`.
- Join CTA: `FadeIn`.

### Legal pages

- `LegalPageShell` wraps its header + body in a single `FadeIn`.

## 5. Build / test plan

1. Run `npm run build` and resolve all TS/lint errors.
2. Run `npm test`.
3. Verify no new build warnings.
4. Verify static export/deploy still possible (no new server usage).

## 6. Risks

- `page.tsx` is a client component; adding `FadeIn`/`StaggerContainer` introduces more client markup, but still renders statically.
- `StaggerContainer` clones children; ensure it handles arrays/nulls via `Children.toArray`.
- Tailwind v4 CSS-first config requires `@keyframes` and utilities inside `globals.css` rather than `tailwind.config.ts`.
