# Component Design Document — Legal Pages (Unit 4 Frontend)

**Branch:** `factory/navdhan-redesign/legal/frontend`  
**Scope:** Frontend architecture and component design for the seven public legal / compliance subpages.  
**Status:** Design doc only — no production code in this commit.

---

## 1. Inputs and sources of truth

| File | Purpose |
|------|---------|
| `.opencode/factory/legal-contract.yaml` | Legal page schema, section lists, i18n rules, company details, cross-links |
| `.opencode/factory/marketing-contract.yaml` | Routing, layout group, shell components, i18n architecture, design tokens |
| `.opencode/factory/ui-component-registry.json` | Reusable `Header`, `Footer`, `Section`, `Container`, animation rules |
| `.opencode/factory/Design.md` | Calm/credible creative direction, no dark mode, no aggressive CTAs |

---

## 2. Route structure

The marketing contract defines **one dynamic page** in the marketing route group:

```text
app/[locale]/(marketing)/legal/[slug]/page.tsx     ← physical page
app/[locale]/(marketing)/layout.tsx                ← shared marketing shell (Header/Footer)
```

`generateStaticParams` returns the seven legal slugs:

| `slug` | Public route (`en` default) | Public route (`hi` example) |
|--------|-----------------------------|----------------------------|
| `privacy-policy` | `/legal/privacy-policy` | `/hi/legal/privacy-policy` |
| `terms-of-use` | `/legal/terms-of-use` | `/hi/legal/terms-of-use` |
| `fair-practices-code` | `/legal/fair-practices-code` | `/hi/legal/fair-practices-code` |
| `cookie-policy` | `/legal/cookie-policy` | `/hi/legal/cookie-policy` |
| `grievance-redressal` | `/legal/grievance-redressal` | `/hi/legal/grievance-redressal` |
| `rbi-dlg-disclosure` | `/legal/rbi-dlg-disclosure` | `/hi/legal/rbi-dlg-disclosure` |
| `consent-policy` | `/legal/consent-policy` | `/hi/legal/consent-policy` |

Non-default locales are served under their locale prefix per the marketing contract; the default locale is served without prefix when middleware rewrites remove the `/en` segment.

### Why a dynamic route instead of seven `page.tsx` files
- The legal contract pages share identical layout, i18n, TOC, last-updated, and section-rendering logic.
- A dynamic route keeps the seven contracts in data rather than duplicating UI.
- If a future slug is added, only `generateStaticParams` and the content JSON need to change.

The task prompt’s listed `app/[locale]/legal/privacy-policy/page.tsx` paths should be read as the logical route table above; the physical implementation is the `[slug]` segment.

---

## 3. Content representation

### Recommendation: structured i18n JSON

Legal prose must be translated into **eight locales** (`en`, `hi`, `bn`, `te`, `mr`, `ta`, `kn`, `ml`). Hard-coded TSX cannot satisfy this, and a single markdown file per page cannot hold tables, contact cards, and cross-links in a type-safe way.

**File layout (content):**

```text
messages/
├── en.json                  # global, home, footer (existing)
└── legal/
    ├── en/
    │   ├── privacy-policy.json
    │   ├── terms-of-use.json
    │   ├── fair-practices-code.json
    │   ├── cookie-policy.json
    │   ├── grievance-redressal.json
    │   ├── rbi-dlg-disclosure.json
    │   └── consent-policy.json
    ├── hi/
    │   └── ...
    └── ... (bn, te, mr, ta, kn, ml)
```

At page build time the server component will load the relevant file(s):

```ts
const messages = await getMessages(locale, ["global", `legal.${slug}`]);
```

### Content contract per page

Each page JSON matches this TypeScript shape:

```ts
interface LegalPageContent {
  meta: {
    title: string;
    description: string;
    ogImage?: string;
  };
  lastUpdated: string; // ISO-8601, e.g. "2026-06-18"
  sections: LegalSection[];
}

type LegalSection =
  | ProseSection
  | ListSection
  | ContactSection
  | TableSection;

interface BaseSection {
  id: string;              // URL anchor
  heading: string;
  contentType: "prose" | "list" | "contact_card" | "table";
  crossLink?: { route: string; label: string };
}

interface ProseSection extends BaseSection {
  contentType: "prose";
  body: string;            // plain string; may contain <strong>, <a>
}

interface ListSection extends BaseSection {
  contentType: "list";
  items: string[];
}

interface ContactSection extends BaseSection {
  contentType: "contact_card";
  contacts: { role: string; name?: string; email: string }[];
  companyDetails?: boolean;
}

interface TableSection extends BaseSection {
  contentType: "table";
  columns: string[];
  rows: Record<string, string>[];
}
```

### Why JSON over MDX
- Tables (lender partners, cookie categories) require columnar data.
- Contact cards need type-safe companyDetails interpolation.
- Cross-links need route references that survive i18n translation.
- MDX would require a runtime compiler per locale and complicates review by compliance and legal.

### Translation keys

All section headings, body copy, summaries, list items, and navigation labels are translated. Per the legal contract, the following remain English-only in all locales:

- `shared_company_details.legal_name`
- `shared_company_details.cin`
- Regulatory citations (`RBI Digital Lending Guidelines`, circular numbers)
- Lender partner names
- Technology provider names
- Statutory definitions when exact wording is required

For English-only sections (e.g., `regulatory_references`, `dlg_compliance`), the UI still wraps the English citation in the localized page flow but always renders the English citation as the primary legal text.

---

## 4. Shared shell and page wrapper

Legal pages reuse the existing marketing `(marketing)` layout and its shell:

```text
app/[locale]/(marketing)/layout.tsx
  ├─ AnnouncementBar (if enabled globally)
  ├─ Header (variant="transparent" → becomes solid on scroll)
  ├─ <main id="main-content">
  │    └─ legal/[slug]/page.tsx
  └─ Footer
```

### Layout requirements

- Use the existing `Container` component with `size="legal"` (`max-w-screen-lg` / `1024px`).
- Use the existing `Section` component with `background="white"` and default vertical padding.
- Apply a max reading measure of `65ch` to prose blocks via `max-w-prose` or a wrapper class.
- Add a subtle cream background variant only for the page header / hero strip if the design team finalizes it.
- No visual divergence from the marketing design language (Inter, NavDhan orange, whitespace, 8–12 px radii).

### Header locale selector
- The Header language toggle must work on legal pages because users sharing compliance links may be in any supported locale.
- Legal copy falls back to English for untranslated sections; this must be made explicit in the UI for English-only blocks (see §7).

---

## 5. In-page navigation / Table of Contents

All seven legal pages set `show_table_of_contents: true`. A TOC improves discoverability for long regulatory text.

### Component: `LegalTableOfContents`

```ts
interface LegalTableOfContentsProps {
  sections: { id: string; heading: string }[];
  title?: string; // default: "On this page"
}
```

### Proposed behavior

- **Desktop:** sticky side panel to the right of the article, top offset below the sticky Header (≈ 96 px). Scroll-spy highlights the current section using `IntersectionObserver`. Clicking a link smooth-scrolls to the section anchor.
- **Mobile:** a collapsible disclosure button above the page title (“Jump to section…”) containing the same links. It does not consume horizontal space when closed.
- **Accessibility:** TOC is a `<nav>` landmark with `aria-label="On this page"`; active link uses `aria-current="location"`; focus is moved to the target section on click via `tabIndex={-1}` and `.focus()`.
- **Reduced motion:** smooth scroll is disabled when `prefers-reduced-motion` is active; jumps jump instantly.

The TOC is a **client component** because scroll-spy and click handlers need `window` / `IntersectionObserver` hooks. The page itself remains a server component; only the TOC component carries `"use client"`.

---

## 6. Cross-linking

### Footer cross-links

The `Footer` component already defines a `legalLinks: NavLink[]` array. Populate it from the legal contract’s `footer_cross_links` block:

```ts
const legalLinks = [
  { labelKey: "legal.footer.privacyPolicy", href: "/legal/privacy-policy" },
  { labelKey: "legal.footer.termsOfUse", href: "/legal/terms-of-use" },
  { labelKey: "legal.footer.fairPracticesCode", href: "/legal/fair-practices-code" },
  { labelKey: "legal.footer.cookiePolicy", href: "/legal/cookie-policy" },
  { labelKey: "legal.footer.grievanceRedressal", href: "/legal/grievance-redressal" },
  { labelKey: "legal.footer.rbiDlgDisclosure", href: "/legal/rbi-dlg-disclosure" },
  { labelKey: "legal.footer.consentPolicy", href: "/legal/consent-policy" },
];
```

Labels must match the footer translation keys to satisfy the legal contract’s instruction: “Cross-link labels must match footer labels to avoid duplicate translation keys.”

### In-page cross-links

For sections with `cross_link` (e.g., Privacy Policy cookies → Cookie Policy), render a styled inline link:

```ts
interface LegalCrossLinkProps {
  route: string;
  label: string;
}
```

Use Next.js `<Link>` with the current locale preserved automatically by the i18n middleware.

### Apply-portal cross-links

The `/apply` consent checkboxes will eventually link to:

- `/legal/consent-policy`
- `/legal/privacy-policy`

These routes are exposed to the apply unit so they do not need to synthesize legal page paths.

---

## 7. Last-updated dates and company details

### Last updated

- Each page JSON holds `lastUpdated` as an ISO-8601 string (e.g., `2026-06-18`).
- The `LegalLastUpdated` component formats it with `Intl.DateTimeFormat(locale, { dateStyle: "long" })`.
- Rendered once below the page title (and optionally above the footer), never inside the reading flow.

```ts
interface LegalLastUpdatedProps {
  date: string;   // ISO-8601
  locale: string;
  label: string;  // e.g. "Last updated"
}
```

### Company details

Centralize Kubar Protocol / NavDhan identity details so legal pages and footer never drift out of sync:

**File:** `content/company.json` (or `src/config/company.ts`)

```ts
interface CompanyDetails {
  legalName: string;          // "Kubar Protocol Private Limited"
  abbreviatedName: string;    // "Kubar Protocol"
  brandOperatingName: string; // "NavDhan"
  parentGroupName: string;    // "Kubar Labs"
  cin: string;                // "U70200WB2024PTC274850"
  registeredOffice: string[]; // multi-line address
  supportEmail: string;
  loanEnquiryEmail: string;
  partnershipEmail: string;
  pressEmail: string;
  careersEmail: string;
  dpoEmail: string;
}
```

- `legal-contract.yaml` is the source of truth; the JSON is a checked-in mirror available to both server and client components.
- The `LegalContactCard` rendering `companyDetails: true` reads this object directly.
- `legalName` and `cin` are always rendered in English regardless of locale.

---

## 8. Component inventory

| Component | Location | Props | Client / Server | Notes |
|-----------|----------|-------|-----------------|-------|
| `LegalPage` | `app/[locale]/(marketing)/legal/[slug]/page.tsx` | `params: { locale, slug }` | Server | Loads page content, generates metadata |
| `LegalLayout` | inherited from `(marketing)/layout.tsx` | `children` | Server | Header + Footer + main landmark |
| `LegalPageShell` | `components/legal/LegalPageShell.tsx` | `page: LegalPageContent; slug: string; locale: string` | Server | Title, last-updated, section renderer grid |
| `LegalSectionRenderer` | `components/legal/LegalSectionRenderer.tsx` | `sections: LegalSection[]` | Server | switches on `contentType` |
| `LegalProse` | `components/legal/LegalProse.tsx` | `heading: string; body: string; id: string` | Server | `max-w-[65ch]` typography |
| `LegalList` | `components/legal/LegalList.tsx` | `heading: string; items: string[]; id: string` | Server | `<ul>` or `<ol>` |
| `LegalContactCard` | `components/legal/LegalContactCard.tsx` | `contacts...; showCompanyDetails?: boolean` | Server | address, emails, CIN |
| `LegalTable` | `components/legal/LegalTable.tsx` | `columns: string[]; rows: ...[]` | Server | accessible `<table>` |
| `LegalCrossLink` | `components/legal/LegalCrossLink.tsx` | `route: string; label: string` | Server | Next.js `<Link>` |
| `LegalLastUpdated` | `components/legal/LegalLastUpdated.tsx` | `date, locale, label` | Server | formatted date |
| `LegalTableOfContents` | `components/legal/LegalTableOfContents.tsx` | `sections: {id, heading}[]` | Client | sticky + scroll-spy |

All components have explicit TypeScript prop interfaces. No `any`.

---

## 9. Metadata / SEO

Use Next.js `generateMetadata` in the server page:

```ts
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const content = await getLegalPageContent(params.locale, params.slug);
  return {
    title: content.meta.title,
    description: content.meta.description,
    openGraph: { images: content.meta.ogImage },
    alternates: {
      canonical: `/legal/${params.slug}`,
      languages: buildLanguageAlternates("/legal/", params.slug),
    },
  };
}
```

Add JSON-LD `WebPage` structured data with `dateModified` set to `lastUpdated` so search engines and regulators can see the document version.

---

## 10. Accessibility (WCAG 2.1 AA)

### Landmarks and focus

- Global `Header` already supports a skip-to-content link; ensure the legal page `<main>` has `id="main-content"`.
- Page title is the only `<h1>` in the document.
- Each legal section is an `<h2>`.
- Subsections (if introduced later) should be `<h3>` to preserve hierarchy.
- TOC links move focus to section containers.

### Motion

- All continuous motion follows `prefers-reduced-motion`.
- The static legal content itself does not fade in; only the lightweight page wrapper may reveal.
- Smooth-scroll for TOC is disabled when reduced motion is preferred.

### Color and typography

- Body text uses `nt-slate-900` on `nt-white` or `nt-cream`; minimum 4.5:1.
- Muted text (`nt-slate-600`) remains above 4.5:1 on light surfaces.
- Links use `nt-orange-600` and `nt-orange-700` hover, but never rely on color alone; underline or chevron icon clarifies they are links.

### Tables and lists

- Tables use `<th scope="col">`, captions, and horizontal scroll wrappers on mobile.
- Lists are real `<ul>` / `<ol>` elements, not styled paragraphs with bullets.

### English-only blocks

When a section is marked `i18n: english_only` or `company_details_english_only`, render a visually subtle note: “(English original)” / locale equivalent supplied by translations. This satisfies the legal contract and informs non-English users why the text is in English.

---

## 11. Static marketing CTA policy

The legal contract states: “No marketing CTAs should interrupt legal reading flow; page-level CTAs (if any) are limited to 'Talk to Us' / support mailto.”

- **Allowed global CTAs:** Header “Apply Loan” button (inherited shell) and Footer links.
- **Allowed in-flow CTAs:** mailto links inside contact cards (`support@kubar.tech`, `dpo@kubar.tech`) and a single “Talk to Us” text link at the bottom of long pages.
- **Not allowed:** inline loan application buttons, promotional banners, pop-up chat, final-CTA sections, or any conversion widget inside the legal article.

---

## 12. Data loading and validation

Because these pages are strictly static:

1. `LegalPage` calls `getLegalPageContent(locale, slug)` at build time.
2. Use `zod` to validate the JSON shape. A build-time schema failure fails `next build`, preventing malformed legal copy from shipping.
3. Wrap the dynamic segment with `generateStaticParams` so all seven routes are prerendered.
4. Unknown slugs return the localized `not-found.tsx` (already provisioned by the marketing contract).

### Proposed `getLegalPageContent` helper

```ts
// src/lib/legal/getLegalPageContent.ts
import { legalPageSchema } from "@/lib/legal/schemas";

export async function getLegalPageContent(locale: string, slug: string) {
  const raw = await import(`@/messages/legal/${locale}/${slug}.json`);
  return legalPageSchema.parse(raw.default);
}
```

Hard-fail on schema parse during build; legal pages cannot safely degrade.

---

## 13. Blockers and ambiguities

| # | Item | Impact | Recommended resolution |
|---|------|--------|------------------------|
| 1 | **Final legal prose is not provided** — the contracts list section headings and content types only. | We can build schemas, route, shell, and renderers, but final copy requires a legal/compliance review pass. | Legal team to supply copy in the JSON schema defined above; frontend can begin with clearly-marked placeholder text. |
| 2 | **Hindi and Indic translations** — the legal contract requires native-speaker legal review before publication. | Initial builds will contain English and possibly draft Hindi. | Gate non-`en` locales behind `draft: true` until compliance approves. |
| 3 | **Lender partner list for RBI-DLG page** — the table in `rbi_dlg_disclosure` needs lender names, entity types, and regulatory status. | Table rows cannot be finalized without the partner roster. | Product or legal team to provide `content/legal/partners.json`; frontend renders whatever rows are supplied. |
| 4 | **Route representation mismatch** — task prompt lists individual `app/[locale]/legal/<slug>/page.tsx` files; marketing contract specifies a dynamic `[slug]` route. | Implementation must choose one. | This CDD recommends the dynamic route to avoid duplication, with `generateStaticParams` covering all seven slugs. |
| 5 | **Dark mode conflict** — Kubar global frontend rules require `dark:` variants; signed-off `Design.md` explicitly says dark mode is out of scope. | Components could be built with dark-mode tokens that are never specified. | Decide whether to add a dark palette in a separate Design update or to keep light-only. This CDD defers to the signed-off Design.md and flags the conflict. |
| 6 | ~~Design.md not present in repo `.opencode/factory`~~ **Resolved.** `Design.md` and all v1.1.0 contracts have been copied into `navdhan-redesign-2026/.opencode/factory/`. | — | — |

---

## 14. Implementation order (for build phase)

1. Add / mirror `content/company.json` from `shared_company_details`.
2. Create the `messages/legal/{locale}/{slug}.json` stub set with placeholder headings.
3. Define Zod schemas and `getLegalPageContent` loader.
4. Create renderer components (`LegalProse`, `LegalList`, `LegalContactCard`, `LegalTable`).
5. Create `LegalPageShell` and `LegalTableOfContents` (client).
6. Implement `app/[locale]/(marketing)/legal/[slug]/page.tsx` with `generateStaticParams` and `generateMetadata`.
7. Wire footer legal links and confirm cross-linking.
8. Add unit tests for renderer components and schema validation.
9. Run `npm test` and `npm run build` before merging.

---

## 15. Sign-off checklist

- [ ] Staff engineer review of this CDD.
- [ ] No production code modified in `app/` or `components/` until CDD approved.
- [ ] Route strategy (dynamic `[slug]`) accepted.
- [ ] Content representation (structured JSON + next-intl) accepted.
- [ ] Blockers / ambiguities above resolved or accepted as deferred.
