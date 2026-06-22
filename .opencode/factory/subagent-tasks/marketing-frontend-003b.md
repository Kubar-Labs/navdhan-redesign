# Task: marketing-frontend-003b — Implement the NavDhan marketing website

## Branch
`factory/navdhan-redesign/marketing/frontend`

## Context
You are implementing Unit 2 (marketing website) against these sources of truth:
- `.opencode/factory/Design.md` — creative brief, copy matrix, animation rules
- `.opencode/factory/marketing-contract.yaml` — section order, component APIs, i18n
- `.opencode/factory/ui-component-registry.json` — component props/slots
- `scratchpads/marketing-frontend-cdd.md`
- `scratchpads/cdd-review-report.md`

## Important file-permission constraints
The editing environment blocks top-level `lib/`, `components/`, `hooks/`, `types/` directories. **Write only in the allowed paths below.** Do NOT write `middleware.ts` or any top-level `lib/`, `components/`, `hooks/`, `types/` files.

Allowed paths:
- `app/**` — Next.js App Router pages, layouts, globals.css
- `src/components/**` — React components
- `src/lib/**` — utilities, i18n helpers
- `src/hooks/**` — custom hooks
- `src/types/**` — shared TypeScript types
- `content/**` — already contains legal content JSONs; do not overwrite
- `public/**` — static assets
- `tests/**` — tests
- `package.json` and `package-lock.json` — only if you add runtime deps; do not add dev-only tooling
- `*.css` — root CSS allowed if necessary
- Root-level config files: `.prettierrc`, `next.config.ts`, `postcss.config.mjs` — allowed if needed

PostCSS and Prettier should be configured in their own root files (`.prettierrc`, `postcss.config.mjs`). i18n MUST use `app/[locale]/(marketing)/...` with `generateStaticParams` and `notFound()` for invalid locales; we are intentionally using `[locale]` param routing only.

## What to build
Homepage sections in exact order:
1. AnnouncementBar (optional)
2. Header with locale selector and mobile menu
3. Hero
4. Recognition carousel (8 recognitions)
5. Loan products
6. Why NavDhan
7. Customer stories
8. Association badges
9. Tech ecosystem partners marquee ticker
10. EMI calculator
11. Final CTA
12. Footer

Also build:
- `app/[locale]/(marketing)/team/page.tsx` with members + advisors
- `app/[locale]/(marketing)/layout.tsx` (shared marketing shell)
- `app/[locale]/layout.tsx` (root i18n provider + notFound guard)
- Global components under `src/components/`: shells (Header, Footer, LocaleSelector, MobileMenu), layout primitives (Container, Section), all section components, and UI primitives.
- i18n utilities under `src/lib/i18n/` using `next-intl` without middleware.
- Message JSONs under `messages/` for `en`, `hi`, `bn`, `te`, `mr`, `ta`, `kn`, `ml`.
- Placeholder public assets under `public/assets/`
- Warm English + subtle Hinglish copy per Design.md.

## Quality requirements
- TypeScript strict, 2-space indent
- Tailwind v4 theme tokens already started in `app/globals.css`; extend there
- Subtle/calm motion (Framer Motion), honor `prefers-reduced-motion`
- Responsive mobile-first
- No dark mode; no crypto/web3 aesthetic; no generic card soup
- Run `npm run build` and fix errors before finishing
- Keep commits clean and conventional

## Output
Commit all changes to `factory/navdhan-redesign/marketing/frontend` and write a short `scratchpads/marketing-frontend-summary.md` with what you built, known gaps, and build result.
