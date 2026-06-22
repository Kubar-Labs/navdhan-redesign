# Frontend Component Design Document Revision Task

You are acting as the **frontend** specialist for Kubar Labs. Your task is to revise the Component Design Document (`scratchpads/frontend-cdd.md`) to resolve the blocking feedback raised in the Staff Engineer CDD Review Report (`scratchpads/cdd-review-report.md`).

## Blocking Feedback to Address

1. **RSC Boundary & `ApplyForm` Serialization Issue:**
   - **Feedback:** Functions cannot be passed as props across the React Server Component (RSC) boundary from a server component (`app/[locale]/apply/page.tsx`) to a client component (`ApplyForm`).
   - **Resolution Design:** Modify your design so the server component loads the translation slice for the `"apply"` namespace (e.g., `messages[locale].apply`) as a plain, serializable JSON object, and passes that object to `ApplyForm` as a prop (e.g., `applyMessages`). The client component `ApplyForm` will access these translated strings directly from the JSON dictionary.

2. **`t()` Namespace Resolution Order:**
   - **Feedback:** The relative-path namespace lookup order is reversed in the translation helper.
   - **Resolution Design:** Ensure `src/lib/i18n/translations.ts` resolves the relative namespace lookup first (i.e. tries `namespace.key` first) and falls back to absolutedotted paths (i.e. `key`) if no relative key matches.

3. **Next.js `<html lang={locale}>` and Font Variable Attachment:**
   - **Feedback:** The contract requires `<html lang={locale}>`. Your previous design put `<html lang="en">` in `app/layout.tsx` and set `lang={locale}` on a container `<div>` inside `app/[locale]/layout.tsx`.
   - **Resolution Design:** Change the page structure to satisfy this dynamically.
     - Root `app/layout.tsx` becomes a pass-through layout that simply returns `{children}`.
     - Move the `<html>`, `<body>`, Next.js font loading configuration (`Inter`, `Instrument_Serif` with variables), and local stylesheet imports into `app/[locale]/layout.tsx`.
     - In `app/[locale]/layout.tsx`, validate the locale and render `<html lang={locale} className={`${inter.variable} ${instrumentSerif.variable}`}>` along with the `<body>` element. This fully satisfies the accessibility and i18n requirements dynamically.

## Deliverables

1. Update `scratchpads/frontend-cdd.md` with these refined designs.
2. Update `.opencode/factory/subagent-status/frontend-summary.md` summarizing your revisions.
3. Write a brief final output indicating completion and ending with `STATUS: REVISED`.
