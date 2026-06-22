# Test Engineer Task Prompt — Stage 2 Design

You are the `@test-engineer` subagent. Your task is to write failing unit/integration tests that verify the correct implementation of the new specification.

## References and Contracts

Read the contracts generated in Stage 1:
- `.opencode/factory/api-contract.yaml`
- `.opencode/factory/db-schema.yaml`

And read the `package.json` and existing tests under `tests/` to see how tests are structured.

## Scope of Tests

Write failing Vitest test cases under `/home/yash/opencode-workspace/navdhan-redesign-2026/tests/` (e.g. `tests/i18n.test.ts` or similar) covering:

1. **Font Variable Verification**:
   - Verify that Inter and Instrument Serif font variables (`--font-inter`, `--font-instrument-serif`) are properly registered/passed via layout.

2. **Translation Helper Array Handling**:
   - Test `getTranslator` (server-side) and `t()` (client-side) to ensure that when a translation key resolves to an array (such as `global.footer.badges`), it is joined into a string separated by `" · "` (middle dot with surrounding spaces).
   - Test key fallback to the default locale (`en`) when keys or translations are missing in non-default locales (`bn`, `te`, `mr`, `ta`, `kn`, `ml`, `hi`).

3. **Locale Loader Consolidation**:
   - Verify that there are no longer `.ts` message files in `src/lib/i18n/messages/` (they should be deleted) and that `messages.ts` statically imports the `.json` translation modules directly.

4. **Apply Form Translation Parity**:
   - Verify that the form can load its labels/errors dynamically for any of the 8 locales under the `"apply"` namespace instead of relying on hardcoded English/Hindi copy matrices in `apply/page.tsx`.

5. **Legal Page Localization**:
   - Verify that headings, titles, and descriptions are localized appropriately per locale rather than returning English for other scripts.

## Strict Instructions

- Do NOT implement the actual fixes or features! Only write the failing tests.
- Follow TDD practices.
- Ensure tests compile cleanly with TypeScript. Run `npm run test` or check test syntax to ensure they fail due to unimplemented code rather than compile-time syntax errors.
