# Test Engineer Summary

## What was done

Wrote failing RED-phase Vitest tests under `tests/i18n/` for the Stage 1 i18n/font/localization contract.

## Files added

- `tests/i18n/font-variables.test.ts`
  - Asserts `app/layout.tsx` loads Inter and Instrument Serif via the Next.js font mechanism and wires `--font-inter` / `--font-instrument-serif` to the root `<html>` element.
  - Verifies `app/globals.css` keeps the required Devanagari and Georgia fallbacks.

- `tests/i18n/translations.test.ts`
  - Verifies `getTranslator(locale)` and the returned `t()` join array leaves (e.g. `global.footer.badges`, namespaced `trustBadges`) with `" · "`.
  - Covers interpolation, default-locale fallback for missing keys (`hi` → `en`), unknown-key fallback, and absolute-key resolution with a namespace.

- `tests/i18n/messages-loader.test.ts`
  - Ensures no `.ts` message source files remain in `src/lib/i18n/messages/`.
  - Asserts one JSON file exists per supported locale.
  - Asserts `src/lib/i18n/messages.ts` statically imports `.json` modules instead of `.ts` modules.

- `tests/i18n/apply-translations.test.ts`
  - Asserts `app/apply/page.tsx` exists and loads translations dynamically (not hardcoded English/Hindi label matrices).
  - Iterates all 8 locales and checks that the required `apply.*` keys resolve to localized strings instead of falling back to the raw key.

- `tests/i18n/legal-localization.test.ts`
  - Iterates every non-default locale and every legal slug.
  - Asserts `loadLegalPage(locale, slug)` returns `meta.title`, `meta.description`, and `intro.heading` that differ from the English versions.

## Test run status

- No shell/bash execution tool was available in this environment, so the suite could not be executed here.
- All test files were written with TypeScript-only Vitest APIs (`it.each`, `toBe`, `toMatch`, etc.) and import from existing modules (`@/src/lib/i18n/translations`, `@/src/lib/legal/loader`, `@/src/lib/i18n/config`) to ensure type safety.
- The expected failures are due to unimplemented code / missing data:
  - `app/layout.tsx` does not register the two font variables.
  - `getTranslator` does not join arrays with `" · "`.
  - `src/lib/i18n/messages.ts` imports `.ts` modules and `.ts` files are still present.
  - `messages/<locale>.json` does not yet contain the `apply` namespace.
  - `app/apply/page.tsx` does not exist.
  - `content/legal/<non-en>/<slug>.json` files currently mirror the English titles/headings.
