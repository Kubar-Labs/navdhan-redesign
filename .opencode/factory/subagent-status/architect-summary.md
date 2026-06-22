# Architect Summary — navdhan-redesign-2026 v1.0.0

## Deliverables

- `.opencode/factory/api-contract.yaml`
- `.opencode/factory/db-schema.yaml`

## What was specified

1. **Locale message schema (`messages/*.json`)**
   - Defined namespaces: `global`, `home`, `team`, `apply`, `legal`, `errors`.
   - Specified custom list schemas (`LabelHrefList`, `ProductListItem`, `ReasonListItem`) and the `" · "` array join rule.
   - Dedicated `apply.*` namespace to replace hardcoded locale copy in `app/[locale]/apply/page.tsx`.
   - Footer badges schema updated to use message arrays joined with `" · "`.

2. **Font variable mappings (`app/layout.tsx` / `globals.css`)**
   - `--font-inter`: Next.js Google Font, subsets latin/latin-ext, weights 400-700.
   - `--font-instrument-serif`: display serif for optional hero emphasis.
   - Required `font-display: swap` and Devanagari fallback.

3. **Translator contract (`getTranslator` / `t()`)**
   - Async factory returns a sync closure.
   - Supports optional namespace, dotted keys, `{var}` interpolation, missing-key fallback.
   - Array leaves are joined with `" · "` (U+00B7 middle dot).

4. **Homepage layout mapping**
   - Replaced direct `siteData.ts` imports: copy arrays move into locale messages; only asset registries and EMI defaults remain in TS/JSON.
   - Defined `HomePageDataLoader` return shape and `AssetRegistry`/`RecognitionItem`/`EmiDefaults` schemas.

5. **Apply form API contract**
   - Documented `POST /api/apply/lead` request/response shapes including `Idempotency-Key` header, `LoanPurpose` enum, field-level validation errors, and 400/422/429 responses.

6. **Static "database" schema (`db-schema.yaml`)**
   - Documented schemas for `team.json`, `siteData.ts`, `content/legal/<locale>/<slug>.json`, and `content/company.json`.
   - Included migration plan moving marketing copy from TS modules into locale JSON and font loading wiring.

## Constraints respected

- 8 locales supported: `en`, `hi`, `bn`, `te`, `mr`, `ta`, `kn`, `ml`.
- Borrower-first terminology throughout; lender/partner language restricted to legal contexts.
- Brand alignment terms (`NavDhan`, `Kubar Protocol Private Limited`, registered address) included.
- No implementation code was written; only YAML contracts and this summary.
