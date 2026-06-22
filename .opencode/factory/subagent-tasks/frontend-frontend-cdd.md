# Frontend Component Design Document Drafting — Stage 3

You are the `@frontend` subagent. Your task is to draft a comprehensive Component Design Document (CDD) inside `scratchpads/frontend-cdd.md` that details the exact technical implementation plan for this i18n and font-loading rebuild.

## References and Contracts

Read the following files carefully first:
- `.opencode/factory/api-contract.yaml`
- `.opencode/factory/db-schema.yaml`
- `.opencode/factory/ui-component-registry.json`
- `DESIGN.md`
- `HANDOFF.md`
- All files under `tests/i18n/` written by `@test-engineer`

## Requirements of the CDD

Your `scratchpads/frontend-cdd.md` must outline the design details, file structures, logic, and edge-case handling for:

1. **Next.js Font Loading**:
   - Technical approach for loading Google fonts `Inter` (sans) and `Instrument_Serif` (serif display) with CSS variables in `app/layout.tsx`.
   - Wiring of classes to the root `<html>` node so the variables are correctly exposed to Tailwind CSS v4 in `app/globals.css`.

2. **Translation Loader Consolidation**:
   - Plan to delete `src/lib/i18n/messages/*.ts` files.
   - Restructuring of `src/lib/i18n/messages.ts` to statically import `src/lib/i18n/messages/*.json` files.
   - Detailed algorithm for `getTranslator` and client-side `t` helpers to support array resolving (auto-detecting arrays and joining with `" · "`).

3. **Homepage i18n Bypass Elimination**:
   - Relocating all translatable text fields (`titleKey`, `descriptionKey`, `questionKey`, `outcomeKey`, etc.) from static files (`siteData.ts` and `team.json`) into the respective 8 locale JSON translation files.
   - Refactoring page and section renders (`page.tsx`, component grids) to dynamically call `t()` with the corresponding namespace keys.

4. **Localized Apply Form**:
   - Structure of the `"apply"` namespace translation schema inside `messages/<locale>.json`.
   - Refactoring of `app/[locale]/apply/page.tsx` to completely remove hardcoded `copyByLocale` matrices, loading all fields/errors/success strings dynamically via translator with proper fallback.

5. **Legal Page Localization**:
   - Localization maps for legal documents' metadata fields (`meta.title`, `meta.description`, and `intro.heading`) across `content/legal/<locale>/*.json` files.

6. **Brand Terminology Alignment**:
   - Exact update to Divyesh Reddy's role key in `team.json` from `"Marketplace Onboarding"` to `"Borrower Onboarding"`.

## Strict Instructions

- Do NOT write or commit any production implementation code at this stage!
- You must write the output solely into `/home/yash/opencode-workspace/navdhan-redesign-2026/scratchpads/frontend-cdd.md`.
