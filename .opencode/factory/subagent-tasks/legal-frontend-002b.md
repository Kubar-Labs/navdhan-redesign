# Task: legal-frontend-002b — Implement static legal subpages

## Branch
`factory/navdhan-redesign/legal/frontend`

## Context
Implement Unit 4 legal pages against:
- `.opencode/factory/legal-contract.yaml` v1.0.0
- `content/legal/{locale}/{slug}.json` (already generated for all 8 locales)
- `content/company.json`
- `scratchpads/legal-frontend-cdd.md`
- `.opencode/factory/Design.md` — shell/typography/colors
- `.opencode/factory/marketing-contract.yaml` — footer/legal links

## Important file-permission constraints
Allowed paths:
- `app/**` — pages, layouts
- `src/components/legal/**` — legal-specific renderer components
- `src/lib/**` — content loader, Zod schemas
- `src/types/**`
- `public/**` if needed
- `package.json` / `package-lock.json` only for runtime deps
- Root-level config files: `.prettierrc`, `next.config.ts`, `postcss.config.mjs` — allowed if needed

Do NOT write `middleware.ts` or top-level `components/`/`lib/`.

## What to build
- `app/[locale]/(marketing)/legal/[slug]/page.tsx` — render any of the 7 slugs by reading `content/legal/{locale}/{slug}.json`
- `src/lib/legal/loader.ts` — validate and load JSON content; fallback to English if locale file missing
- `src/components/legal/LegalPageShell.tsx` — page header, article body renderer handling paragraphs, headings, lists, tables
- `src/components/legal/LegalTable.tsx` — accessible table renderer
- Re-use the marketing `Footer` and `Header` from the marketing agent if already on branch; if not present yet, create minimal placeholder shell under `src/components/shells/` that matches styling in Design.md
- Dynamic routes: generateStaticParams for `[locale]` and `[slug]` so all 56 pages are statically generated

## Content files (already present)
`content/legal/{en,hi,bn,te,mr,ta,kn,ml}/{privacy-policy,terms-of-use,fair-practices-code,cookie-policy,grievance-redressal,rbi-dlg-disclosure,consent-policy}.json`

Inspect one file to infer the JSON schema and validate against it.

## Quality
- TypeScript strict
- Tailwind v4 tokens from Design.md
- Accessible headings hierarchy, semantic `<article>` and `<section>`
- Run `npm run build` and fix errors

## Output
Commit to `factory/navdhan-redesign/legal/frontend` and write `scratchpads/legal-frontend-summary.md`.
