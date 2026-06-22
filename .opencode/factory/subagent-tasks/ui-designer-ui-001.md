# UI Designer Task Prompt — Stage 2 Design

You are the `@ui-designer` subagent. Your task is to design the localized UI components layout, register component interfaces, and ensure the Stitch-backed design tokens and component structures are aligned with the contract.

## References and Contracts

Read the contracts and guidelines:
- `.opencode/factory/api-contract.yaml`
- `.opencode/factory/db-schema.yaml`
- `DESIGN.md`

## Scope of Design

1. **Font Token System**:
   - Align the font styling (Inter for UI, Instrument Serif for headlines/accents) and verify how typography tokens in `globals.css` map to Next.js font variables.

2. **Component Interface Mapping**:
   - Design component layouts for Homepage Lists (`loanProducts`, `whyReasons`, `recognitionItems`, `customerStories`) where all strings are translated via the keys specified in the contract rather than direct English-key imports.
   - Design the Footer component interface to accept localized badges arrays and display them with dot separators correctly.

3. **Localized Apply Form Interface**:
   - Design a premium, clean UI interface for the application form (`/apply`) with clear steps, inline validation, clear focus states, and localized fields/errors as defined in the contract's `apply.*` schema.

4. **Team Page Layout and Roles**:
   - Design the card treatment and team alignment for the Team page, ensuring role keys match the contract and use "Borrower Onboarding" instead of "Marketplace Onboarding".

## Outputs Expected

- Update or verify the UI component structures in `/home/yash/opencode-workspace/navdhan-redesign-2026/.opencode/factory/ui-component-registry.json` to ensure strict conformity with the layout requirements.
- No production code should be written.
