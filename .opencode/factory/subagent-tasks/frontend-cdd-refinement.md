# Frontend CDD Refinement: Apply Portal Rebuild

Refine the dynamic multi-step Apply wizard, components interface bindings, Sahamati consent panel overlays, and multilingual parity to update the Component Design Document `scratchpads/apply-frontend-cdd.md`.

## Instructions
1. Review `/home/yash/opencode-workspace/navdhan-redesign-2026/.opencode/factory/api-contract.yaml` and `.opencode/factory/ui-component-registry.json` as the absolute sources of truth.
2. Incorporate the Sahamati consent-based design principles (Part 1 and Part 2) from `https://sahamati.org.in/wp-content/uploads/2025/10/Design-Guidelines-1.pdf`. Detail the consent overlay triggers, toggle options, and clear language explanations.
3. Formulate the client-side state machine and component API bindings for the complete 8-step Apply Wizard:
   - Business details, Aadhaar OTP send/verify, PAN eKYC, GSTIN returns fetching, Bank Net Banking parsing, Document file drops, Review and Submit, and result pages.
4. Integrate complete dynamic multilingual translation strategies under the `"apply"` namespace for all 8 Indian locales (en, hi, bn, te, mr, ta, kn, ml).
5. Write/update the frontend Component Design Document (CDD) under `scratchpads/apply-frontend-cdd.md` to reflect these exact specifications. No production code is to be committed.
