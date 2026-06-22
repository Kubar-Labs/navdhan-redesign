# Task: legal-completion — Finish legal subpages

## Branch
`factory/navdhan-redesign/legal/frontend`

## Start state
Branch equals `factory/navdhan-redesign/stage-5-foundation`. Foundation has `content/legal/{locale}/{slug}.json` for 7 pages × 8 locales, `src/components/legal/`, and a partial renderer. The Header exists but Footer may be incomplete.

Your job: make the legal pages complete, buildable, and committed.

## Priority order
1. `git checkout factory/navdhan-redesign/legal/frontend`.
2. Inspect `content/legal/en/privacy-policy.json` and all renderer components.
3. Finish `src/components/legal/LegalPageShell.tsx`, `LegalSection.tsx`, `LegalTable.tsx`, `LegalTableOfContents.tsx` (client), and any missing renderers.
4. Create or finish `src/components/shells/Footer.tsx` linking to all 7 legal pages if it doesn't exist; align styling with Design.md.
5. Create/finish marketing layouts if not present:
   - `app/[locale]/(marketing)/layout.tsx`
   - `app/[locale]/(marketing)/legal/[slug]/page.tsx` with `generateStaticParams`, `generateMetadata`, and English fallback for missing locales.
   - `app/[locale]/layout.tsx` if missing.
6. Run `npm run build` and fix errors.
7. Commit with `feat(legal): complete legal subpage renderer and layouts`.
8. Write `scratchpads/legal-completion-summary.md`.

## Constraints
- Do not modify the legal JSON content files.
- Do not modify `app/apply/**` or `app/api/apply/**`.
