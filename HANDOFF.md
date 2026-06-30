# NavDhan Redesign 2026 — Engineering Handoff

> **Project**: NavDhan Redesign 2026  
> **Repository**: `navdhan-redesign-2026`  
> **栈 Stack**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Drizzle ORM, PostgreSQL, Vercel  
> **Status**: Phase 1 & Phase 2 complete and deployed. Phase 3 & Phase 4 ready for integration.

---

## 1. Executive Summary & Design System Architecture

The 2026 NavDhan rebuild is anchored around **Calm Credibility** — a visual language that feels trustworthy, understated, and professional without being cold or corporate. The system was compiled in the active Stitch project **`7528632692757947510`** and is now the source of truth for all customer-facing surfaces.

### 1.1 Core Tokens

| Token                 | Value                                       | Usage                                             |
| --------------------- | ------------------------------------------- | ------------------------------------------------- |
| Primary Accent Orange | `#EA580C`                                   | CTAs, active states, emphasis badges, key metrics |
| Surface Cream         | `#FAFAF8`                                   | Base page panels, section backgrounds             |
| NT Slate              | `border-nt-slate-200`                       | 1px card borders, dividers                        |
| Diffused Shadow       | `shadow-[0px_4px_20px_rgba(15,23,42,0.05)]` | White-container cards, modals, overlay panels     |

### 1.2 Typography

| Role          | Font               | Usage                                                      |
| ------------- | ------------------ | ---------------------------------------------------------- |
| Display Serif | `Instrument Serif` | Hero italic callouts, brand statements, large display type |
| Body / UI     | `Inter`            | Body copy, labels, form fields, navigation                 |

Both families are loaded dynamically from Google Fonts in `app/[locale]/layout.tsx` via CSS display variables. `app/layout.tsx` remains a lightweight pass-through root.

### 1.3 Component Primitives

- **White cards**: `bg-white`, `rounded-2xl`, `border border-nt-slate-200`, `shadow-[0px_4px_20px_rgba(15,23,42,0.05)]`.
- **Badges**: Dot-separated string arrays joined with `" · "` via the configured `getTranslator` helper in `translations.ts`.
- **High-contrast logo grids**: Grayscale/opacity-muted logos for "Recognised By" sections.

---

## 2. Phase 1: Customer-Facing Visual & i18n Rebuild (100% Completed)

### 2.1 Custom Font Loading

- `app/[locale]/layout.tsx` now dynamically loads `Inter` and `Instrument Serif` from Google Fonts.
- CSS display variables are forwarded to Tailwind so `font-serif` and `font-sans` resolve correctly.
- `app/layout.tsx` was refactored into a minimal pass-through root to avoid duplicating font metadata.

### 2.2 Unification of Translation Loaders

- Removed the dual-system TypeScript translation loader modules.
- `messages.ts` now statically imports canonical `.json` files per locale.
- Added deep-merge fallback to a master English (`en.json`) catalog so missing keys in secondary locales do not break the UI.

### 2.3 Dot-Separator Badges

- Configured `getTranslator` inside `translations.ts` so that leaf string arrays are automatically joined with `" · "`.
- This powers credential chips, partner lists, and bullet-less metadata rows without per-component formatting code.

### 2.4 Language Parity Gaps Resolved

- Localized legal headings across all non-English locales.
- Translated team mission, values, and banner content so every locale has parity on high-visibility pages.

### 2.5 Visual Grid Refining

| Surface                  | Change                                                                                                                           |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| Hero                     | Refactored to a 2-column grid with a business owner asset and a green "Approval Overlay" callout.                                |
| Trusted By / Recognition | Remade as a grayed-out, high-contrast "Recognised By" grid with full custom logo SVGs and the official Startup Mahakumbh emblem. |
| EMI Calculator           | Re-skinned with 6px slider tracks and a highlighted "Live Breakdown" panel so the resulting EMI is impossible to miss.           |

### 2.6 Roster Alignment

- Purged obsolete entries from `team.json`.
- Aligned COO, Product, and Developer role titles to the borrower-first operations guidelines.

### 2.7 Rollout

- Deployed successfully to production on Vercel:
  - **URL**: https://navdhan-redesign-2026.vercel.app/
- Phase 1 is considered **complete and live**.

---

## 3. Phase 2: Progressive Consent-Based Apply Portal Rebuild (100% Completed)

### 3.1 Database Layer (`src/db/schema.ts`)

Drizzle type-safe schema added for the apply portal, including:

| Table              | Purpose                                                            |
| ------------------ | ------------------------------------------------------------------ |
| `applications`     | Master application record with contact, business, and loan details |
| `documents`        | Uploaded KYC / business document metadata                          |
| `perfios_sessions` | Perfios bank-statement session tracking                            |
| `consent_logs`     | User consent captures with timestamps                              |
| `bank_statements`  | Parsed / received statement metadata                               |

**Type-safety & compliance notes:**

- All financial fields use `DECIMAL` / `NUMERIC` formats.
- Indexes are declared for high-cardinality lookup columns.
- Migration compiled to `0001_opposite_vision.sql`.

### 3.2 Next.js API Routes

12 route handlers deployed under `app/[locale]/apply/api/...`:

```text
app/[locale]/apply/api/
├── checks/
│   ├── aadhaar/route.ts
│   ├── pan/route.ts
│   ├── gstin/route.ts
│   └── ...
├── callbacks/
│   ├── perfios/route.ts
│   └── ...
└── applications/
    └── route.ts
```

All routes are localized under `[locale]` and follow the factory idempotency rules: financial mutations require `Idempotency-Key` headers and use explicit transactions where state changes occur.

### 3.3 ApplyWizard — 8-Phase Progressive Flow

The client-side apply experience is built as a single `ApplyWizard` with eight progressive phases:

```text
1. Business Info
2. Contact & Loan
3. Aadhaar Consent & OTP
4. PAN Verification
5. GSTIN Check
6. Document Upload
7. Bank Statement Net Banking Link (Perfios)
8. Review & Masked PII Summary
```

**Key UX decisions:**

- Server Components fetch static data; client interactivity is gated to the wizard steps.
- Form state is managed incrementally so users can revisit earlier phases without losing data.
- PII (Aadhaar, PAN, phone, bank details) is masked in the review summary.
- Sahamati Account Aggregator privacy overlay cards are rendered in both **English** and **Hindi** before consent capture.

### 3.4 Testing

| Suite                  | File                       | Coverage                                  |
| ---------------------- | -------------------------- | ----------------------------------------- |
| Validation unit tests  | `apply-validation.test.ts` | Schema and rule-level assertions          |
| API route tests        | `apply-api.test.ts`        | Handler contracts and error paths         |
| Wizard component tests | `apply-wizard.test.tsx`    | Step navigation, consent flow, submission |

**Total assertions passed**: `110`

Tests use `@testing-library/jest-dom` extensions and are run with `vitest` / `npm test`.

---

## 4. Phase 3: External API Integrations (Next Phase)

Phase 3 swaps the simulated controllers in the apply portal with live, secure external integrations.

### 4.1 Environment Variables Checklist (Vercel)

Ensure the following values are configured in the Vercel project settings before enabling live flows:

| Variable                  | Purpose                                      |
| ------------------------- | -------------------------------------------- |
| `DATABASE_URL`            | PostgreSQL connection string for Drizzle     |
| `PERFIOS_API_URL`         | Base endpoint for Perfios API                |
| `PERFIOS_MERCHANT_ID`     | Perfios merchant identifier                  |
| `PERFIOS_API_KEY`         | Perfios API key / secret                     |
| `PERFIOS_RSA_PRIVATE_KEY` | RSA private key for Perfios payload signing  |
| `PERFIOS_RSA_PUBLIC_KEY`  | Perfios public key for callback verification |
| `AA_SAHAMATI_BASE_URL`    | Sahamati Account Aggregator base URL         |
| `AA_CLIENT_ID`            | Sahamati AA client ID                        |
| `AA_CLIENT_SECRET`        | Sahamati AA client secret                    |

### 4.2 Stub Swapping

Controllers currently live in:

```text
src/lib/apply/server/*.stub.ts
```

Action plan:

1. Copy each `.stub.ts` to its production counterpart (remove `.stub` suffix).
2. Replace simulated response bodies with signed `fetch()` calls to Perfios systems.
3. Validate response schemas with `zod` before persisting to `applications`, `perfios_sessions`, and `bank_statements`.
4. Wrap all state mutations in explicit transactions with `SELECT ... FOR UPDATE` row-level locking where concurrent updates are possible.
5. Delete the `.stub.ts` files once production controllers are wired and tests pass.

### 4.3 Sahamati AA Flow

1. On phase 7, redirect the user to the Sahamati AA consent screen with a signed, timestamped consent request.
2. Store the `consent_handle` in `consent_logs` with a `PENDING` status.
3. Implement `/api/apply/callbacks/sahamati/route.ts` to receive FI (Financial Information) notifications.
4. On successful notification, fetch the FI payload, parse bank statement metadata, and create a `bank_statements` record.
5. Mask account numbers and phone numbers in all logs.

---

## 5. Phase 4: Decision Engine & Webhook Controllers (Next Phase)

Phase 4 adds backend decisioning, lender routing, and callback handlers.

### 5.1 Risk Engine Decision Matrix

Proposed schema additions:

```text
credit_scores
risk_flags
decision_outcomes
lender_offers
```

Decision flow:

1. Aggregate application data + bank statement insights + bureau score.
2. Run rule-based eligibility and risk flags.
3. Compute `eligible_amount`, `recommended_tenure`, and `interest_rate_floor`.
4. Persist the decision outcome with a deterministic idempotency key.

### 5.2 Lender Matcher Dashboard

- New admin/dashboard routes under `app/[locale]/dashboard/lender-matcher/`.
- UI hooks:
  - `useApplications()` — paginated list of applications pending lender assignment.
  - `useLenderOffers(applicationId)` — mutable lender offer pipeline.
  - `useDecisionMutation()` — trigger risk engine recalculation.
- Layout follows the same white-container card system with the Calm Credibility tokens.

### 5.3 Webhook Handlers

New callback routes to add:

```text
app/[locale]/api/webhooks/
├── perfios/route.ts
├── sahamati/route.ts
└── bureau/route.ts
```

Security requirements:

- Verify HMAC signature headers for every inbound webhook.
- Reject payloads with stale timestamps (> 5 minutes old).
- Log only masked PII.
- Return 2xx quickly and queue heavy processing to avoid webhook timeouts.

---

## 6. Repository Layout Quick Reference

```text
navdhan-redesign-2026/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx              # dynamic font loading
│   │   ├── page.tsx                # marketing home
│   │   └── apply/
│   │       ├── api/                # 12 localized route handlers
│   │       └── ...
│   └── layout.tsx                  # lightweight root pass-through
├── src/
│   ├── components/                 # reusable UI + ApplyWizard
│   ├── db/
│   │   ├── schema.ts               # Drizzle tables + indexes
│   │   └── migrations/
│   │       └── 0001_opposite_vision.sql
│   ├── lib/apply/server/*.stub.ts  # Phase 3 integration stubs
│   ├── hooks/                      # custom data hooks
│   └── types/                      # shared TypeScript contracts
├── tests/
│   ├── apply-validation.test.ts
│   ├── apply-api.test.ts
│   └── apply-wizard.test.tsx
├── public/                         # logos + business owner assets
└── HANDOFF.md                      # this document
```

---

## 7. Immediate Next Steps for the Next Owner

1. **Phase 3 — Perfios**
   - Configure Vercel environment variables listed in §4.1.
   - Promote `src/lib/apply/server/*.stub.ts` to production controllers.
   - Wire live Perfios fetch calls and add request/response signature handling.

2. **Phase 3 — Sahamati AA**
   - Implement the AA redirect and callback handler.
   - Persist FI data to `bank_statements`.

3. **Phase 4 — Decisioning**
   - Create additional Drizzle tables for credit scores, risk flags, decisions, and lender offers.
   - Build rule-based risk engine service.

4. **Phase 4 — Dashboard & Webhooks**
   - Implement lender matcher dashboard routes and hooks.
   - Add HMAC-secured webhook handlers for Perfios, Sahamati, and bureau callbacks.

5. **Tests**
   - Extend `apply-api.test.ts` and `apply-wizard.test.tsx` to cover live integration paths.
   - Maintain the existing bar of **110+ passing assertions**.

---

_Document generated by the Kubar Labs software factory — frontend specialist._
