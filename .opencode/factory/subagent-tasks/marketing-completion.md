# Task: marketing-completion — Finish the marketing website

## Branch
`factory/navdhan-redesign/marketing/frontend`

## Start state
The branch currently equals `factory/navdhan-redesign/stage-5-foundation`. That foundation already contains partial work: `src/types/`, `src/lib/i18n/`, `src/lib/utils/`, `src/lib/data/`, `src/components/shells/Header.tsx`, `src/components/layout/`, some sections/components stubs, `app/globals.css`, `app/layout.tsx`, and i18n/content JSONs.

Your job is to make the marketing site complete, buildable, and committed.

## Priority order
1. `git checkout factory/navdhan-redesign/marketing/frontend` and ensure you are on that branch.
2. Inspect the existing files to understand what is already present. Do NOT rewrite working parts unless necessary.
3. Finish missing pieces:
   - `src/components/shells/Footer.tsx` (full footer with legal links from `marketing-contract.yaml`)
   - `src/components/shells/MobileMenu.tsx`
   - `src/components/shells/AnnouncementBar.tsx` if required
   - Any missing homepage section implementations in `src/components/sections/`
   - `app/[locale]/(marketing)/layout.tsx` (shared marketing layout: Header + Footer)
   - `app/[locale]/(marketing)/page.tsx` (homepage rendering all sections in order)
   - `app/[locale]/(marketing)/team/page.tsx`
   - `app/[locale]/(marketing)/legal/[slug]/page.tsx` only if legal-frontend did not already create it; otherwise leave it.
   - Root locale handling: `app/[locale]/layout.tsx` and `app/page.tsx` redirect to `/en`
   - Placeholder public assets under `public/assets/` and reference them correctly
4. Update message JSONs if any labels are missing; do not translate all Indic locales fully — English fallback is acceptable for this iteration.
5. Run `npm run build` and fix every TypeScript/Next/Tailwind error.
6. Run `npm test` if tests pass; if not, fix critical ones but do not modify apply tests.
7. Commit all changes with a conventional commit like `feat(marketing): complete homepage, team page, and shells`.
8. Write `scratchpads/marketing-completion-summary.md` listing what was completed and any remaining gaps.

## Constraints
- Do NOT touch `app/apply/**` or `app/api/apply/**`.
- Do NOT modify `src/db/schema.ts`.
- Use only TypeScript/React/Tailwind v4.
- Keep motion subtle and honor `prefers-reduced-motion`.
- Do not change design tokens unless required for a fix.
