# Staff Engineer Review Prompt — Revised Frontend CDD Re-evaluation

You are the `@staff-engineer` subagent for the NavDhan Redesign Software Factory.
Your task is to re-evaluate the updated Component Design Document (CDD) under `scratchpads/frontend-cdd.md` against the API contract (`.opencode/factory/api-contract.yaml`) and the previous CDD review report (`scratchpads/cdd-review-report.md`).

## Re-evaluation Criteria

Verify that the three previous blocking issues have been fully and robustly resolved in the CDD:

1. **RSC Boundary Serialization (`ApplyForm`)**:
   - Confirm that the server component `app/[locale]/apply/page.tsx` does **not** pass the translation helper function `t` as a prop to the client-side component `ApplyForm`.
   - Confirm that it instead serializes the JSON-formatted `"apply"` namespace translation dictionary (passed as `applyMessages`) across the boundary.
   - Confirm that `ApplyForm` builds the local translator closure locally from this object.

2. **Key Resolution Order**:
   - Confirm that the translation helper in `src/lib/i18n/translations.ts` checks namespaced relative keys first (`namespace.key` or `apply.key`) and falls back to absolute path dotted keys (`key`) only if a match is not found.

3. **Dynamic HTML `lang` Attribute and Custom Fonts**:
   - Confirm that `app/layout.tsx` is a clean pass-through layout that returns `{children}`.
   - Confirm that `app/[locale]/layout.tsx` owns the `<html>` and `<body>` tags, sets `<html lang={locale}>` dynamically based on the active locale, and configures Next.js `Inter` and `Instrument_Serif` fonts dynamically.

## Output Requirements

Write your final evaluation report to `scratchpads/cdd-review-report.md`.
The report must include:
1. **CDD Status**: Either `APPROVED` (if all 3 feedback items are successfully addressed) or `CHANGES_REQUESTED` (if there are remaining blocking gaps).
2. **Analysis**: For each of the three feedback points, cite the specific section/code in the CDD that satisfies the requirement.
3. **Approval Verdict**: A clear statement of approval or next steps.

When complete, output a short summary ending with `STATUS: APPROVED` or `STATUS: CHANGES_REQUESTED`.
