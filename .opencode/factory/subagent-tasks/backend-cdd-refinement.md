# Backend CDD Refinement: Apply Portal Rebuild

Refine the existing `/apply` related route handlers (OTP verification, GST history retrieval, statement parsing, PII masking, and DECIMAL currency representation) to update the Component Design Document `scratchpads/apply-backend-cdd.md`.

## Instructions
1. Review `/home/yash/opencode-workspace/navdhan-redesign-2026/.opencode/factory/api-contract.yaml` and `.opencode/factory/db-schema.yaml` as the absolute sources of truth.
2. Formulate the technical specifications for all required Next.js Route Handlers:
   - State Machine: Idempotent progression and validation, no step skipping.
   - Perfios Integration: Aadhaar eKYC send/verify, PAN eKYC status checks, GSTIN return history retrieval, Net Banking statement parsing.
   - Security: Complete PII mask in responses and logs, secure cookie-based session management.
   - Fintech-Compliance: Idempotency keys, database-level transactions, and accurate decimal currency (DECIMAL 19,4) representations.
3. Write/update the backend Component Design Document (CDD) under `scratchpads/apply-backend-cdd.md` to reflect these exact specifications. No production code is to be committed.
