# Staff Engineer CDD Re-evaluation Report — i18n & Font-Loading Frontend CDD

## CDD under review

- **CDD:** `scratchpads/frontend-cdd.md`
- **Reviewed by:** staff-engineer
- **Date:** 2026-06-22
- **Previous review:** `scratchpads/cdd-review-report.md` (STATUS: CHANGES_REQUESTED)

## Inputs consulted

- `.opencode/factory/api-contract.yaml`
- `~/.config/opencode/agents/shared/KUBAR_FINTECH_RULES.md`
- `scratchpads/frontend-cdd.md` (revised)

## Re-evaluation criteria

The previous review raised three blocking issues. This report verifies whether all three have been fully and robustly resolved in the revised CDD.

---

### 1. RSC Boundary Serialization (`ApplyForm`)

**Requirement:** `app/[locale]/apply/page.tsx` must not pass the translator function `t` as a prop to a client component. It must instead pass the JSON-formatted `"apply"` namespace dictionary (`applyMessages`) and let `ApplyForm` build the local translator closure.

**CDD evidence:**

- Section 4.4, server component code: `applyMessages = messages.apply as Record<string, unknown>; return <ApplyForm locale={locale} applyMessages={applyMessages} />;`
- Section 4.4, client component code: builds `const t = useMemo(() => (key, variables?) => {...}, [applyMessages]);` using only the serializable `applyMessages` object.
- Section 4.4 prose: "Only serializable JSON crosses the React Server Component boundary... the client component builds the translation closure locally."

**Verdict:** Resolved. No function props cross the RSC boundary.

---

### 2. Key Resolution Order

**Requirement:** The translator helper must check namespaced relative keys first (`namespace.key` / `apply.key`) and fall back to absolute dotted-path keys (`key`) only when the relative lookup misses.

**CDD evidence:**

- Section 2.4, `translations.ts`, the returned `t()` closure:
  1. If `namespace` is provided, look up `namespacedRoot = getByPath(messages, namespace)`.
  2. If `namespacedRoot` is an object, look up the relative key inside it: `relativeValue = getByPath(namespacedRoot, key)`.
  3. If the relative lookup misses, perform absolute lookup: `absoluteValue = getByPath(messages, key)`.
- Section 2.5 algorithm summary states: "Relative lookup inside the namespace object when a namespace is provided (`namespace.key`). Absolute dotted-path lookup using the key as the full path (`key`)."

**Verdict:** Resolved. The resolution order now matches `api-contract.yaml` (relative first, absolute fallback).

---

### 3. Dynamic HTML `lang` Attribute and Custom Fonts

**Requirement:** `app/layout.tsx` must be a clean pass-through returning `{children}`; `app/[locale]/layout.tsx` must own `<html>` and `<body>`, set `<html lang={locale}>` dynamically, and configure the Next.js `Inter` and `Instrument_Serif` fonts.

**CDD evidence:**

- Section 1.2 files table: `app/layout.tsx` → pass-through root layout; `app/[locale]/layout.tsx` → validate locale, render `<html lang={locale}>`, fonts, `<body>`, and children.
- Section 1.3 root layout code: `export default function RootLayout({ children }) { return children; }`
- Section 1.3 locale layout code:
  - Validates locale and calls `notFound()` for invalid values.
  - Renders `<html lang={locale} className={`${inter.variable} ${instrumentSerif.variable}`}>`.
  - Uses `next/font/google` with `Inter` and `Instrument_Serif`, `display: "swap"`, fallback stacks, and CSS variables `--font-inter` / `--font-instrument-serif`.
- Section 1.4 notes: "`app/layout.tsx` does not render `<html>`/`<body>`; it only passes children through. The active `app/[locale]/layout.tsx` sets `<html lang={locale}>`."

**Verdict:** Resolved. The real `<html>` element carries the dynamic `lang` attribute and the correct font variables.

---

## Fintech / compliance check

- This CDD is frontend-only and does not introduce DB transactions, currency columns, or server-side PII storage.
- The apply form remains aligned with the existing `ApplyLeadRequest` contract, including the mandatory `Idempotency-Key` header.
- PII handling (mobile, PAN, Aadhaar) remains a client-side/input concern; no logging behavior is changed by this CDD.

## Non-blocking suggestions

- **Global CSS import path:** `app/[locale]/layout.tsx` imports `"./globals.css"`, which will resolve to `app/[locale]/globals.css` rather than `app/globals.css`. Verify the import path is `../globals.css` or that a copy exists; otherwise global styles may not load.
- **Nested layout metadata:** Next.js allows `metadata` exports in nested layouts, but ensure the original root `metadata` is not duplicated unexpectedly once the root layout stops rendering `<html>`.
- **Homepage stats array:** The algorithm correctly handles arrays with `" · "`, but structural arrays like `home.hero.stats` should still be iterated directly from `getMessages()` rather than through `t()`.

## Approval verdict

All three previously blocking issues have been addressed in the revised CDD. The design is consistent with `api-contract.yaml` and is appropriately scoped.

**STATUS: APPROVED**

Implementation may begin.
