# Frontend Specialist Implementation Prompt — i18n & Font Rebuild

You are the `@frontend` specialist for the NavDhan Redesign Software Factory.
Your task is to implement the approved Component Design Document (`scratchpads/frontend-cdd.md`) in its entirety. Your changes must be consistent with the API Contract (`.opencode/factory/api-contract.yaml`), the CDD review report (`scratchpads/cdd-review-report.md`), and the Stitch-backed design system (Stitch Project ID: `"7528632692757947510"`, Design System Asset: `"assets/875f92d83591419ea219b4331cc1e4bc"`).

## Objective

Make all five i18n test suites under `tests/i18n/` pass flawlessly:
1. `tests/i18n/font-variables.test.ts`
2. `tests/i18n/messages-loader.test.ts`
3. `tests/i18n/translations.test.ts`
4. `tests/i18n/apply-translations.test.ts`
5. `tests/i18n/legal-localization.test.ts`

---

## Technical Specifications

### 1. Dynamic Font Loading & Pass-Through Root Layout
- **Root Layout (`app/layout.tsx`)**: Re-architect to be a pass-through layout that simply returns `{children}`. It must not render `<html>`, `<body>`, or load any fonts.
- **Locale Layout (`app/[locale]/layout.tsx`)**:
  - Validate that the locale param is valid using `isValidLocale`. If not, call `notFound()`.
  - Load custom Google fonts `Inter` and `Instrument_Serif` using `next/font/google` with `display: "swap"`, proper subsets, fallback stacks, and variable names (`--font-inter` and `--font-instrument-serif`).
  - Import `"../globals.css"` (ensure path is correct relative to `app/[locale]/layout.tsx`).
  - Render `<html lang={locale} className={`${inter.variable} ${instrumentSerif.variable}`}>` and `<body>`.

### 2. Consolidated Translation Loaders & Array Join Formatting
- **Static Imports in `src/lib/i18n/messages.ts`**:
  - Delete duplicate `.ts` locale message files under `src/lib/i18n/messages/` (e.g. `en.ts`, `hi.ts`).
  - Statically import `.json` locale files in `src/lib/i18n/messages.ts`.
  - Implement `getMessages(locale)` returning a deep-merged object where the requested locale's translations are merged onto the base English (`en`) translations so missing keys gracefully fallback to English.
- **Translator Helper in `src/lib/i18n/translations.ts`**:
  - Unify backend and client `t()` helpers to use the same logic.
  - Implement the translator closure returned by `getTranslator(locale, namespace)`:
    1. If `namespace` is specified, attempt a relative path lookup inside that namespace (`namespace.key`).
    2. If relative lookup is missing/undefined, perform an absolute dotted-path lookup (`key`) from the root.
    3. If the resolved leaf is a string, perform `{interpolation}` of variables.
    4. If the resolved leaf is an array of strings, join the elements with a middle dot separator: `" · "` (e.g., `"RBI Aligned · FACE Registered · Powered by Kubar"` for `global.footer.badges`). If the array is empty, return `""`.
    5. Fallback to the key string itself if the resolved key is completely missing.

### 3. Homepage i18n Bypass Elimination
- Move all translatable lists (`loanProducts`, `whyReasons`, `customerStories`, `recognitionItems`) out of static `siteData.ts` or page files into corresponding key structures in `messages/en.json` (and translate them in other locales).
- Update the layout/page renders on the homepage (`app/[locale]/(marketing)/page.tsx`) to lookup titles and descriptions dynamically using `t()` instead of hardcoded English fields.

### 4. Dynamic Lead Form Localization
- Move the dynamic form field names, validation messages, step labels, and placeholders to the `"apply"` namespace in the locale JSON files.
- In `app/[locale]/apply/page.tsx`, do **not** pass the non-serializable translation helper function `t` as a prop to the client-side component `ApplyForm`.
- Instead, load the `"apply"` namespace dictionary as a JSON object (`messages.apply` formatted as `Record<string, unknown>`) and pass it as the `applyMessages` prop.
- In `ApplyForm`, construct the local translation closure using `applyMessages` and localized values locally.

### 5. Legal Page Localization & Brand Alignment
- Ensure all 8 legal folders in `content/legal/[locale]/[slug].json` have correct, fully translated fields for `meta.title`, `meta.description`, and `intro.heading` in their respective languages.
- In `team.json` (under `public/data/team.json` or where team list resides), locate Divyesh Reddy's entry and change his role from `"Marketplace Onboarding"` to borrower-focused `"Borrower Onboarding"`.

---

## Verification

When you have finished making all edits, run the tests to verify correctness:
```bash
npx vitest run tests/i18n
```

If any tests fail, debug and resolve them. Do not mark the task complete until vitest passes cleanly.

Write your final summary to `.opencode/factory/subagent-status/frontend-summary.md` and finish with `STATUS: SUCCESS`.
