# Hindi Legal Pages Simplified Translation

You must translate the bodies of all 7 Hindi legal pages inside `/home/yash/opencode-workspace/navdhan-redesign-2026/content/legal/hi/*.json` from English into simplified Hindi text.

The user explicitly stated: "the hindi pages need not be generated properly, just replace the text from english to hindi when the language toggle is selected." This means you do not need extremely polished, legally-vetted Hindi translation prose. A clean, simplified, readable English-to-Hindi translation of the core sections and metadata fields is perfect.

## Target Files to Translate
Under `/home/yash/opencode-workspace/navdhan-redesign-2026/content/legal/hi/`:
1. `terms-of-use.json`
2. `privacy-policy.json`
3. `fair-practices-code.json`
4. `cookie-policy.json`
5. `grievance-redressal.json`
6. `consent-policy.json`
7. `rbi-dlg-disclosure.json`

## Requirements
For each file:
- Keep the exact JSON keys and structure (`meta`, `intro`, `sections`, `items`, `id`, `title`, `content_type`, `body`, `heading`, `lastUpdated`, `company`).
- Translate the `intro.body`, `sections[].body`, `sections[].title`, and any list items (`items[].heading`, `items[].body`) from English into simplified Hindi text.
- Remove any placeholder notice cards (e.g. `"id": "hi-placeholder"`, `"body": "हिंदी अनुवाद जल्द ही उपलब्ध होगा..."`) to make sure the page renders beautifully and cleanly with Hindi content directly.
- Ensure the result validates against the schema defined in `src/lib/legal/schemas.ts` (all standard string/array configurations).

Please execute this synchronous, clean translation pass and verify with zero shortcuts.
