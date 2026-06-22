# Frontend i18n + Font-Loading CDD — Completion Summary

**Output:** `scratchpads/frontend-cdd.md`  
**Scope:** Frontend-only. Translation loader redesign, Next.js font loading, homepage/apply/legal/team localization, and brand terminology alignment.

## What was drafted

A single Component Design Document covering ten areas:

1. **Next.js font loading** — `Inter` and `Instrument Serif` via `next/font/google`, CSS variables on root `<html>`, Devanagari fallbacks preserved.
2. **Translation loader consolidation** — static JSON imports, `en` fallback deep merge, dotted key + namespace resolution, interpolation `{var}`, array join `" · "`, empty array -> `""`.
3. **Homepage i18n** — move `loanProducts`, `whyNavDhan`, `customerStories`, `emiCalculator`, `trustBadges`, hero stats into locale JSON; keep only asset registries and `emiDefaults` in `siteData.ts`.
4. **Apply form localization** — full `apply` namespace schema; server page + client `ApplyForm` using translator; replace `copyByLocale`.
5. **Legal localization** — localized `meta.title/meta.description/intro.heading` for all 7 non-English locales × 7 slugs.
6. **Brand term alignment** — Divyesh Reddy role renamed to `Borrower Onboarding`.
7. **Team page migration** — migrate heading/subtext/CTA/member/advisor strings to `team.*` JSON namespace and dotted keys in `team.json`.
8. File-change summary, build/test plan, and risks.

## Key decisions

- `app/[locale]/layout.tsx` will **not** render `<html>`; the root layout in `app/layout.tsx` owns it and injects font variables.
- `getMessages` returns a deep-merged `en` base for all non-English locales so partial translations never crash the UI.
- `t()` resolves namespaced paths first, then relative paths, then falls back to the key string.
- The apply route stays inside `app/[locale]/apply/`. The mismatch with `tests/i18n/apply-translations.test.ts` (which points to `app/apply/page.tsx`) is flagged as a risk; recommend updating the test path or adding a thin default-locale re-export.
- Homepage customer stories are recommended to render `null` until real opt-ins exist.

## Artifacts

- `scratchpads/frontend-cdd.md` — full design document with code samples and file-change table.

## Next step

Route CDD to `@staff-engineer` / `@frontend` for approval, then begin implementation.
