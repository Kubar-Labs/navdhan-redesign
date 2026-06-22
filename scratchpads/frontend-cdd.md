# Frontend Component Design Document — i18n + Font-Loading Rebuild

**Role:** `@frontend` specialist, NavDhan redesign factory run  
**Scope:** Consolidate translation loading, localize the homepage, `/apply`, and legal pages, load Inter + Instrument Serif via Next.js, and align brand terminology. Out of scope: backend, DB, new UI/UX polish.

---

## 1. Next.js Font Loading

### 1.1 Goal

Load only the two approved typefaces on public marketing surfaces:

- **Sans/primary:** `Inter` — body, UI, buttons, forms.
- **Serif accent:** `Instrument Serif` italic — hero/editorial emphasis only.

Both must use `font-display: swap`, expose CSS variables, and keep the Devanagari fallback (`Noto Sans Devanagari`) for Hindi/Marathi.

### 1.2 Files

| Path                      | Action                                                                                                        |
| ------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `app/layout.tsx`          | Pass-through root layout returning `{children}` only.                                                         |
| `app/globals.css`         | Keep existing `var(--font-inter)` / `var(--font-instrument-serif)` wiring; imported by `[locale]/layout.tsx`. |
| `app/[locale]/layout.tsx` | Validate locale; render `<html lang={locale}>`, fonts, `<body>`, and locale children.                         |

### 1.3 Implementation

Root layout (`app/layout.tsx`) is now a pass-through. The `<html>`, `<body>`, font-loading, and active locale attribute all live in the locale-specific layout so that `lang={locale}` is set on the real `<html>` element.

```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
```

```tsx
// app/[locale]/layout.tsx
import "./globals.css";
import { Inter, Instrument_Serif } from "next/font/google";
import { notFound } from "next/navigation";
import { isValidLocale } from "@/src/lib/i18n/config";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
  fallback: ["Noto Sans Devanagari", "system-ui", "sans-serif"],
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
  variable: "--font-instrument-serif",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    notFound();
  }
  return (
    <html lang={locale} className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body className="bg-nt-cream text-nt-slate-900 antialiased">{children}</body>
    </html>
  );
}
```

`app/globals.css` already defines:

```css
--font-sans: var(--font-inter), "Noto Sans Devanagari", system-ui, sans-serif;
--font-display: var(--font-instrument-serif), Georgia, serif;
```

No Tailwind config change required. Instrument Serif is consumed via the existing `.font-display` utility class.

### 1.4 Notes / constraints

- `app/layout.tsx` does not render `<html>`/`<body>`; it only passes children through. The active `app/[locale]/layout.tsx` sets `<html lang={locale}>`, attaches the CSS font variables, and renders the `<body>`.
- `app/[locale]/layout.tsx` validates the locale with `notFound()` for invalid values before rendering.
- This structure satisfies the `api-contract.yaml` requirement that the page `<html>` element carry the active `lang` attribute for SEO and accessibility.
- Metadata can be exported from `app/[locale]/layout.tsx` if locale-aware titles are needed later; for this refactor the existing root metadata export remains unchanged.

---

## 2. Translation Loader Consolidation

### 2.1 Goal

- Delete `src/lib/i18n/messages/*.ts`.
- Convert `src/lib/i18n/messages.ts` to statically import the 8 JSON files.
- Make `getTranslator(locale, namespace?)` deep-merge the default locale as fallback, support dotted keys, namespaces, interpolation, and auto-join arrays with `" · "`.

### 2.2 Files

| Path                           | Action                                                                  |
| ------------------------------ | ----------------------------------------------------------------------- |
| `src/lib/i18n/messages/*.ts`   | Delete.                                                                 |
| `src/lib/i18n/messages.ts`     | Rewrite to statically import `*.json` and expose `getMessages(locale)`. |
| `src/lib/i18n/translations.ts` | Rewrite to use `messages.ts`, add array join + default-locale fallback. |

### 2.3 `src/lib/i18n/messages.ts`

```ts
import { defaultLocale, isValidLocale, type Locale } from "./config";
import en from "./messages/en.json";
import hi from "./messages/hi.json";
import bn from "./messages/bn.json";
import te from "./messages/te.json";
import mr from "./messages/mr.json";
import ta from "./messages/ta.json";
import kn from "./messages/kn.json";
import ml from "./messages/ml.json";

const messagesByLocale: Record<Locale, Record<string, unknown>> = {
  en,
  hi,
  bn,
  te,
  mr,
  ta,
  kn,
  ml,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function deepMerge(
  target: Record<string, unknown>,
  source: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = { ...target };
  for (const key of Object.keys(source)) {
    if (isRecord(source[key]) && isRecord(result[key])) {
      result[key] = deepMerge(
        result[key] as Record<string, unknown>,
        source[key] as Record<string, unknown>,
      );
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

export function getMessages(locale: string): Record<string, unknown> {
  if (!isValidLocale(locale)) {
    return messagesByLocale[defaultLocale];
  }
  if (locale === defaultLocale) {
    return messagesByLocale[locale];
  }
  return deepMerge(messagesByLocale[defaultLocale], messagesByLocale[locale]);
}
```

### 2.4 `src/lib/i18n/translations.ts`

```ts
import "server-only";
import { notFound } from "next/navigation";
import { getMessages } from "@/src/lib/i18n/messages";
import { defaultLocale, isValidLocale, type Locale } from "@/src/lib/i18n/config";

export type Messages = Record<string, unknown>;
export type Translator = (key: string, variables?: Record<string, string | number>) => string;

function getByPath(obj: unknown, path: string): unknown {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current === null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

function interpolate(value: string, variables?: Record<string, string | number>): string {
  if (!variables) return value;
  return value.replace(/\{(\w+)\}/g, (_, key) => {
    const replacement = variables[key];
    return replacement === undefined ? `{${key}}` : String(replacement);
  });
}

function formatLeaf(raw: unknown, variables?: Record<string, string | number>): string {
  if (typeof raw === "string") return interpolate(raw, variables);
  if (Array.isArray(raw)) {
    if (raw.length === 0) return "";
    return raw.map((item) => String(item)).join(" · ");
  }
  return "";
}

export async function getTranslator(locale: string, namespace?: string): Promise<Translator> {
  if (!isValidLocale(locale)) notFound();
  const messages = getMessages(locale);

  return (key: string, variables?: Record<string, string | number>): string => {
    // 1. Relative namespace lookup first.
    if (namespace) {
      const namespacedRoot = getByPath(messages, namespace);
      if (namespacedRoot !== null && typeof namespacedRoot === "object") {
        const relativeValue = getByPath(namespacedRoot, key);
        if (typeof relativeValue === "string" || Array.isArray(relativeValue)) {
          return formatLeaf(relativeValue, variables);
        }
      }
    }

    // 2. Absolute dotted-path fallback (the key itself is the full dotted path).
    const absoluteValue = getByPath(messages, key);
    if (typeof absoluteValue === "string" || Array.isArray(absoluteValue)) {
      return formatLeaf(absoluteValue, variables);
    }

    // 3. Fallback to the key string.
    return key;
  };
}
```

### 2.5 Algorithm summary

- Locale validation: invalid routes call `notFound()`.
- Default-locale fallback: `getMessages` deep-merges `en.json` under each requested locale.
- Key resolution order:
  1. Relative lookup inside the namespace object when a namespace is provided (`namespace.key`).
  2. Absolute dotted-path lookup using the key as the full path (`key`).
- Interpolation: `{varName}` tokens replaced from `variables`; missing tokens stay literal.
- Arrays at a leaf are joined with `" · "`; empty arrays return `""`.
- Missing non-array values fall back to the key string.

### 2.6 Test-specific notes

- `t("global.footer.emptyBadges")` is expected to return `""`. Add `"emptyBadges": []` under `global.footer` in `en.json` so the resolved leaf is an empty array.
- `home.whyNavDhan` must use capital `D` to match API contract; rename from `home.whyNavdhan` in JSON files.
- `home.customerStories` and `home.emiCalculator` must replace `home.stories` and `home.emi`.

---

## 3. Homepage i18n Bypass Elimination

### 3.1 Goal

Remove all hardcoded copy arrays from `siteData.ts` and the inline `t()` fallback strings in `page.tsx`. The homepage reads **all** section copy from `messages/<locale>.json`. Only asset registries (`associationBadges`, `techPartners`, `recognitionItems`) and `emiDefaults` stay in TypeScript.

### 3.2 Files

| Path                                | Action                                                                                                        |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `src/lib/data/siteData.ts`          | Remove `loanProducts`, `whyReasons`, `customerStories`, `trustBadges`. Keep asset registries + `emiDefaults`. |
| `src/lib/i18n/messages/*.json`      | Add homepage data arrays; align key names to contract.                                                        |
| `app/[locale]/(marketing)/page.tsx` | Convert to async server component consuming `getTranslator` / `getMessages`.                                  |

### 3.3 Key name alignment in JSON

Rename/move these keys in **all** locale JSON files to match `api-contract.yaml`:

| From (current)                  | To (contract)                    |
| ------------------------------- | -------------------------------- |
| `home.association.eyebrow`      | `home.associationBadges.eyebrow` |
| `home.ecosystem.eyebrow`        | `home.ecosystemTicker.eyebrow`   |
| `home.whyNavdhan`               | `home.whyNavDhan`                |
| `home.stories`                  | `home.customerStories`           |
| `home.emi`                      | `home.emiCalculator`             |
| `home.hero.stat1value/label...` | `home.hero.stats[]`              |

`en.json` currently has `associationBadges.heading`; rename `heading` to `eyebrow` and do the same for `ecosystemTicker.heading`.

### 3.4 New JSON data shapes

#### `home.hero.stats`

```json
"stats": [
  { "value": "₹5L – ₹1Cr", "label": "loan range" },
  { "value": "12-24%", "label": "interest rate p.a." },
  { "value": "3–12 month", "label": "tenures" }
]
```

`getMessages` should return this array unchanged, so the page iterates the array directly. Per API contract `t("home.hero.stats")` joins coerced strings, but in this implementation `t()` is reserved for scalar/array leaves.

#### `home.loanProducts.products`

```json
"products": [
  {
    "id": "collateral-free",
    "titleKey": "Collateral-Free Business Loan",
    "descriptionKey": "Unsecured funding up to ₹1 Crore based on your business cash flow. No property or asset needed.",
    "iconName": "ShieldCheck",
    "ctaKey": "Learn more"
  }
]
```

The page reads this from `getMessages(locale).home.loanProducts.products`. Because `t()` joins arrays, do not call `t("products")` for structural arrays.

#### `home.whyNavDhan.reasons` / `trustBadges`

```json
"trustBadges": ["RBI Aligned", "FACE Registered", "Powered by Kubar"],
"reasons": [
  {
    "id": "one-application",
    "titleKey": "One application, matched offers.",
    "bodyKey": "Apply once and see loan options worked out for your business."
  }
]
```

Trust badges render via `t("home.whyNavDhan.trustBadges")` → joined string.

#### `home.customerStories`

Contract/design says drop fabricated photos per `DESIGN.md`. Two acceptable paths:

1. **Drop the section entirely** until real opt-ins are available (`CustomerStories` renders `null`).
2. Keep a static registry of names/photos in `siteData.ts` and localized copy in JSON.

Recommendation: choose path 1 for MVP to stay honest with brand.

### 3.5 `siteData.ts` exports after refactor

```ts
export const associationBadges: BadgeItem[] = [...];
export const techPartners: PartnerItem[] = [...];
export const recognitionItems: RecognitionItem[] = [...];
export const emiDefaults = { ... };
```

No exported `loanProducts`, `whyReasons`, `customerStories`, or `trustBadges`.

### 3.6 Page refactor

Convert `app/[locale]/(marketing)/page.tsx` to an async server component:

```tsx
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslator(locale, "home");
  const messages = getMessages(locale);
  // ...
}
```

The EMI calculator uses React state, so extract a client `EmiCalculatorClient` that receives scalar labels and numeric defaults.

---

## 4. Localized Apply Form

### 4.1 Goal

Remove the hardcoded `copyByLocale` matrix from `app/[locale]/apply/page.tsx`. All field labels, placeholders, options, consent text, submit/loading/success/error strings, and validation messages load from the `apply` namespace in `messages/<locale>.json`.

### 4.2 Files

| Path                                  | Action                                                               |
| ------------------------------------- | -------------------------------------------------------------------- |
| `src/lib/i18n/messages/<locale>.json` | Add full `apply` namespace schema.                                   |
| `app/[locale]/apply/page.tsx`         | Convert to server component that passes `t` to a client `ApplyForm`. |
| `src/components/apply/ApplyForm.tsx`  | Receive `t` and `locale`; use translated strings for all UI copy.    |

### 4.3 `apply` namespace schema (per locale.json)

```json
"apply": {
  "meta": {
    "title": "Apply: NavDhan",
    "description": "Check your business loan eligibility in under 5 minutes."
  },
  "eyebrow": "Business loan application",
  "heading": "Get the right business loan, without chasing banks.",
  "description": "Fill a few details to check your eligibility. It takes less than 5 minutes.",
  "loanDetailsTitle": "Loan details",
  "amountLabel": "Loan amount",
  "tenureLabel": "Tenure (months)",
  "purposeLabel": "Purpose",
  "purposes": {
    "working_capital": "Working capital",
    "machinery": "Machinery / Equipment",
    "inventory": "Inventory",
    "business_expansion": "Business expansion",
    "debt_refinancing": "Debt refinancing",
    "other": "Other"
  },
  "aboutYouTitle": "About you",
  "fullNameLabel": "Full name",
  "mobileLabel": "Mobile number",
  "mobilePlaceholder": "10-digit mobile",
  "emailLabel": "Email",
  "pinCodeLabel": "Business PIN code",
  "pinCodePlaceholder": "6-digit PIN",
  "emiLabel": "Estimated EMI",
  "emiNoteTemplate": "Total payable {total} @ 18% p.a. This is only an estimate.",
  "consentDataPrefix": "I agree to NavDhan's",
  "consentAnd": "and",
  "consentPolicy": "Consent Policy",
  "privacyPolicy": "Privacy Policy",
  "consentLender": "I consent to sharing my details so NavDhan can find a loan offer for my business.",
  "submit": "Check Eligibility",
  "submitting": "Checking...",
  "successHeading": "Thank you",
  "successBody": "We have received your application. A NavDhan advisor will reach out within 24 hours.",
  "successCta": "Back to home",
  "errorHeading": "Something went wrong",
  "errorBody": "Please check your details and try again.",
  "fieldRequired": "This field is required",
  "validation": {
    "mobileInvalid": "Please enter a valid 10-digit mobile number.",
    "emailInvalid": "Please enter a valid email address.",
    "pinCodeInvalid": "Please enter a valid 6-digit PIN code.",
    "nameInvalid": "Please enter a valid full name.",
    "consentRequired": "You must agree to continue."
  }
}
```

### 4.4 Page + component split

`app/[locale]/apply/page.tsx` (server component):

```tsx
import { ApplyForm } from "@/src/components/apply/ApplyForm";
import { getMessages } from "@/src/lib/i18n/messages";

export default async function ApplyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = getMessages(locale);
  const applyMessages = messages.apply as Record<string, unknown>;
  return <ApplyForm locale={locale} applyMessages={applyMessages} />;
}
```

`src/components/apply/ApplyForm.tsx` (client component):

```tsx
"use client";

import { useMemo } from "react";

interface ApplyFormProps {
  locale: string;
  applyMessages: Record<string, unknown>;
}

function getByPath(obj: unknown, path: string): unknown {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current === null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

function interpolate(value: string, variables?: Record<string, string | number>): string {
  if (!variables) return value;
  return value.replace(/\{(\w+)\}/g, (_, key) => {
    const replacement = variables[key];
    return replacement === undefined ? `{${key}}` : String(replacement);
  });
}

function formatLeaf(raw: unknown, variables?: Record<string, string | number>): string {
  if (typeof raw === "string") return interpolate(raw, variables);
  if (Array.isArray(raw)) {
    if (raw.length === 0) return "";
    return raw.map((item) => String(item)).join(" · ");
  }
  return "";
}

export function ApplyForm({ locale, applyMessages }: ApplyFormProps) {
  const t = useMemo(
    () =>
      (key: string, variables?: Record<string, string | number>): string => {
        const raw = getByPath(applyMessages, key);
        if (typeof raw === "string" || Array.isArray(raw)) {
          return formatLeaf(raw, variables);
        }
        return key;
      },
    [applyMessages],
  );

  // form state uses t("key") for every label/error
  const emiNote = t("emiNoteTemplate", {
    total: formatCurrencyInr(breakdown.totalPayable),
  });
}
```

Only serializable JSON crosses the React Server Component boundary. The server component extracts the `apply` namespace slice and passes it as `applyMessages`; the client component builds the translation closure locally.

### 4.5 Validation

Use the same native patterns (`[0-9]{10}`, `[1-9][0-9]{5}`, email input type) plus localized messages from `apply.validation.*`. Inline errors render from translator, not hardcoded strings.

### 4.6 Test path mismatch

`tests/i18n/apply-translations.test.ts` reads `app/apply/page.tsx`, but the live route is `app/[locale]/apply/page.tsx`. The CDD recommends updating the test path to `app/[locale]/apply/page.tsx` rather than creating a duplicate route. If the test file is frozen, add a thin `app/apply/page.tsx` re-export that imports and renders the localized page for the default locale.

---

## 5. Legal Page Localization

### 5.1 Goal

Ensure every non-English legal document has localized `meta.title`, `meta.description`, and `intro.heading`. Body copy may remain English placeholder for MVP, but the top metadata must differ from English to satisfy `legal-localization.test.ts`.

### 5.2 Files

| Path                                                      | Action                                                                        |
| --------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `content/legal/<locale>/<slug>.json` (7 non-en × 7 slugs) | Translate `meta.title`, `meta.description`, `intro.heading`.                  |
| `src/app/[locale]/legal/[slug]/page.tsx`                  | Verify it reads `loadLegalPage(locale, slug)` and uses `page.meta.title` etc. |

### 5.3 Required localized fields

For each slug and locale, update:

```json
{
  "meta": {
    "title": "<localized title>",
    "description": "<localized description>"
  },
  "intro": {
    "heading": "<localized heading>",
    "body": "..."
  }
}
```

### 5.4 Translation map example (Hindi)

| Slug                  | `meta.title`      | `intro.heading`   |
| --------------------- | ----------------- | ----------------- |
| `privacy-policy`      | गोपनीयता नीति     | गोपनीयता नीति     |
| `terms-of-use`        | उपयोग की शर्तें   | उपयोग की शर्तें   |
| `fair-practices-code` | उचित प्रथा संहिता | उचित प्रथा संहिता |
| `cookie-policy`       | कुकी नीति         | कुकी नीति         |
| `grievance-redressal` | शिकायत निवारण     | शिकायत निवारण     |
| `rbi-dlg-disclosure`  | RBI-DLG प्रकटीकरण | RBI-DLG प्रकटीकरण |
| `consent-policy`      | सहमति नीति        | सहमति नीति        |

Equivalent translated titles are required for `bn`, `te`, `mr`, `ta`, `kn`, and `ml`. Body content can remain English with a locale placeholder note for now.

### 5.5 Note on schema drift

Some `content/legal/en/*.json` sections use `content_type: "contact_card"`, which is outside the `db-schema.yaml` enum (`prose`, `list`). Keep renderers defensive; the loader already validates through `legalPageSchema`. Do not broaden the schema in this CDD.

---

## 6. Brand Terminology Alignment

### 6.1 Goal

Update Divyesh Reddy's role in `team.json` from `"Marketplace Onboarding"` to `"Borrower Onboarding"` so the team page stays aligned with the borrower-first brand.

### 6.2 Files

| Path                     | Action                                                                |
| ------------------------ | --------------------------------------------------------------------- |
| `src/lib/data/team.json` | Change `members["divyesh-reddy"].roleKey` to `"Borrower Onboarding"`. |

If role text is later migrated to locale JSON, the dotted key should still resolve to the borrower-facing terminology.

---

## 7. Team Page Copy Migration

### 7.1 Goal

Move translatable copy currently hardcoded in `team.json` and `app/[locale]/(marketing)/team/page.tsx` into `messages/<locale>.json` under the `team.*` namespace.

### 7.2 `team.json` changes

Convert static strings to dotted i18n keys:

```json
{
  "pageHeadingKey": "team.hero.heading",
  "pageSubtextKey": "team.hero.subtext",
  "joinCtaKey": "team.join.cta",
  "joinHref": "mailto:careers@kubar.tech",
  "members": [
    {
      "id": "divyesh-reddy",
      "name": "Divyesh Reddy",
      "roleKey": "team.members.items.divyesh-reddy.role",
      "bioKey": "team.members.items.divyesh-reddy.bio",
      "imageAsset": "/assets/team/divyesh.png",
      "linkedIn": "https://www.linkedin.com/in/divyesh-reddy/"
    }
  ],
  "advisors": [
    {
      "id": "debayan-gupta",
      "name": "Debayan Gupta",
      "domainKey": "team.advisors.items.debayan-gupta.domain",
      "contributionKey": "team.advisors.items.debayan-gupta.contribution",
      "imageAsset": "/assets/advisors/debayan.png"
    }
  ]
}
```

Keep English strings in `en.json` under the dotted paths. Other locales fall back to English until translated.

### 7.3 `messages/en.json` additions

```json
"team": {
  "hero": {
    "heading": "Built by people who believe in small business.",
    "subtext": "We are builders, engineers, designers, and operators working to make MSME credit calm, clear, and honest."
  },
  "members": {
    "eyebrow": "Leadership",
    "heading": "Meet the team",
    "items": {
      "divyesh-reddy": {
        "role": "Borrower Onboarding",
        "bio": "Buyer-Risk Intelligence | MSME Credit Analytics"
      }
    }
  },
  "advisors": {
    "eyebrow": "Advisors",
    "heading": "Guided by industry experts",
    "items": {
      "debayan-gupta": {
        "domain": "Professor, CS - MIT, Ashoka University",
        "contribution": "Advises on research-led technology choices and academic partnerships."
      }
    }
  },
  "join": {
    "heading": "Want to shape the future of MSME credit?",
    "subtext": "We are always looking for thoughtful people who care about building fair financial products.",
    "cta": "Join the team"
  }
}
```

### 7.4 `team/page.tsx` updates

- Use `t(teamData.pageHeadingKey)` for the hero heading.
- Use `t(teamData.joinCtaKey)` for the join button.
- Use `t(member.roleKey)` / `t(member.bioKey)` for member cards.
- Use `t(advisor.domainKey)` / `t(advisor.contributionKey)` for advisor cards.
- Replace remaining hardcoded English strings with translated keys.

---

## 8. File-change summary

| File                                             | Change                                                                 |
| ------------------------------------------------ | ---------------------------------------------------------------------- |
| `app/layout.tsx`                                 | Pass-through root layout returning `{children}`.                       |
| `app/[locale]/layout.tsx`                        | Render `<html lang={locale}>`, fonts, `<body>`, locale validation.     |
| `src/lib/i18n/messages/*.ts`                     | Delete.                                                                |
| `src/lib/i18n/messages.ts`                       | Static JSON imports + `getMessages` with default-locale deep merge.    |
| `src/lib/i18n/translations.ts`                   | Use `messages.ts`; relative namespace lookup before absolute fallback. |
| `src/lib/i18n/messages/en.json`                  | Expand with contract-aligned arrays and `apply` namespace.             |
| `src/lib/i18n/messages/hi.json`                  | Transcribe richer copy, delete `hi.ts`; add `apply` namespace.         |
| `src/lib/i18n/messages/{bn,te,mr,ta,kn,ml}.json` | Add missing keys; align key names; add `apply` namespace.              |
| `src/lib/data/siteData.ts`                       | Remove copy arrays; keep asset registries + emiDefaults.               |
| `src/lib/data/team.json`                         | Use dotted i18n keys; update Divyesh Reddy role.                       |
| `app/[locale]/(marketing)/page.tsx`              | Resolve all copy from JSON; remove siteData copy imports.              |
| `app/[locale]/(marketing)/team/page.tsx`         | Resolve all copy from JSON/team.json keys.                             |
| `app/[locale]/apply/page.tsx`                    | Server component passing serializable `applyMessages` to `ApplyForm`.  |
| `src/components/apply/ApplyForm.tsx`             | Client form; builds local `t()` from `applyMessages`.                  |
| `content/legal/<locale>/*.json`                  | Localize `meta.title`, `meta.description`, `intro.heading`.            |

---

## 9. Build / test plan

1. Run `npm install` if dependencies changed.
2. Run `npm run build` and fix any TypeScript or import errors.
3. Run `npm test` and verify all `tests/i18n/*` pass.
4. Visually smoke-test `/en`, `/hi`, `/en/apply`, `/hi/apply`, `/en/team`, `/hi/legal/privacy-policy`.
5. Confirm no hardcoded English strings appear in localized pages.

---

## 10. Risks and open questions

- **Test path mismatch:** `apply-translations.test.ts` checks `app/apply/page.tsx`. Either update the test path or add a default-locale re-export at `app/apply/page.tsx`.
- **Legal translations:** 49 files need title/description/heading updates. Consider a one-off script to avoid manual copy errors.
- **Locale key rename:** `home.whyNavdhan` → `home.whyNavDhan` requires touching every locale JSON; missing renames will surface as exposed translation keys at runtime.
- **Instrument Serif availability:** `Instrument_Serif` is available in `next/font/google`; if the font manifest omits a required subset, fall back to `next/font/local`.
- **Root `<html>` locale:** Resolved by moving `<html>`, `<body>`, and font variables into `app/[locale]/layout.tsx`; the root layout is now a pass-through.

## Staff Engineer Feedback (addressed)

- `src/components/apply/ApplyForm.tsx` / `app/[locale]/apply/page.tsx`: The server component now passes the serializable `applyMessages` JSON slice into `ApplyForm`. `ApplyForm` builds its own translation closure on the client; no function props cross the RSC boundary.
- `src/lib/i18n/translations.ts`: `t()` now performs the relative namespace lookup (`namespace.key`) first and falls back to the absolute dotted path (`key`) only when the relative lookup misses.
- `app/layout.tsx` / `app/[locale]/layout.tsx`: `app/layout.tsx` is a pass-through and `app/[locale]/layout.tsx` renders `<html lang={locale}>` with the Inter and Instrument Serif font variables attached. This satisfies the `api-contract.yaml` requirement.
- `app/[locale]/(marketing)/page.tsx`: `home.customerStories` message keys remain in JSON as required by the contract, even if the component initially renders `null` while real opt-ins are gathered.

**STATUS: REVISED**
