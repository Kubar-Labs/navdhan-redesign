# Frontend i18n & Layout Refinement

You must refine the homepage elements, announcement bar copy, and hero stats to perfectly match the Stitch compiled design system ("Calm Credibility") and screen layout.

## Context
From our active Stitch project (ID `7528632692757947510`), the compiled design system and homepage screen specify the following elements:
1. **Announcement Bar:**
   - Message: `"🎉 Launch Special: Apply now and get zero processing fee on your first loan!"`
   - CTA Label: `"Claim Offer"`
2. **Hero Stats:**
   - Stat 1: Value `"24Hr"`, Label `"Disbursal"`
   - Stat 2: Value `"100%"`, Label `"Digital"`
   - Stat 3: Value `"500+"`, Label `"SMEs Served"`

Our current app translation files contain placeholder/different values. To ensure complete alignment with the Stitch layout artifacts and maintain the highest visual and content fidelity, you must apply the following refinements.

## Requirements

### 1. Update `en.json`
Update `/home/yash/opencode-workspace/navdhan-redesign-2026/src/lib/i18n/messages/en.json`:
- Under `global.announcement`:
  - Set `"message"` to `"🎉 Launch Special: Apply now and get zero processing fee on your first loan!"`
  - Set `"ctaLabel"` to `"Claim Offer"`
- Under `home.hero.stats`:
  - Update the array to have the 3 exact stat objects from the Stitch layout:
    ```json
    "stats": [
      {
        "value": "24Hr",
        "label": "Disbursal"
      },
      {
        "value": "100%",
        "label": "Digital"
      },
      {
        "value": "500+",
        "label": "SMEs Served"
      }
    ]
    ```

### 2. Update `hi.json`
Update `/home/yash/opencode-workspace/navdhan-redesign-2026/src/lib/i18n/messages/hi.json`:
- Add a localized `global.announcement` block so it has complete language parity with English (preventing fallback to English copy for the announcement):
  ```json
  "announcement": {
    "message": "🎉 लॉन्च विशेष: अभी आवेदन करें और अपने पहले लोन पर शून्य प्रोसेसिंग शुल्क प्राप्त करें!",
    "ctaLabel": "ऑफ़र का दावा करें",
    "href": "/apply"
  }
  ```
- Add/update `home.hero.stats` block to localized versions:
  ```json
  "stats": [
    {
      "value": "24Hr",
      "label": "संवितरण"
    },
    {
      "value": "100%",
      "label": "डिजिटल"
    },
    {
      "value": "500+",
      "label": "MSMEs सेवा दी"
    }
  ]
  ```

### 3. Verify Layout and Tests
- Verify `/home/yash/opencode-workspace/navdhan-redesign-2026/app/[locale]/(marketing)/page.tsx` renders the announcement bar and stats array correctly.
- Run `npm test -- tests/i18n` to verify all 29 tests pass with 100% green status.

Please implement these refinements cleanly, with zero extra unrequested abstraction. Ensure compile-safe execution.
