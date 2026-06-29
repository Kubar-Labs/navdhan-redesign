# Backend Apply CDD Refinement

You must review and update `/home/yash/opencode-workspace/navdhan-redesign-2026/scratchpads/apply-backend-cdd.md` to ensure it is in complete agreement with the newly designed contracts, database schema, and test expectations.

## Goals & Constraints
- Focus strictly on Unit 3 (`/apply`) Next.js Route Handlers.
- Ensure all API endpoints align exactly with `.opencode/factory/api-contract.yaml`:
  - GET/POST route adapters (Linear step progression, linear validation states, upsert idempotency).
  - OTP Send & OTP Verify routes (Aadhaar eKYC OTP loops).
  - Document Upload URL & Document Upload endpoints.
  - Perfios Initiate, Callback, and Status routes (Bank statements net banking parsing, e-statement processing).
  - Submission and Offer routes.
- Enforce Sahamati consent guidelines and fintech-compliance policies:
  - Mask PII fields in logs and response payloads.
  - All financial amounts must use DECIMAL(19,4) (never Float).
  - Relational db transaction locks to prevent concurrency race states.
- Review existing test expectations in `tests/apply/apply-api.test.ts`.

Please modify and update the CDD doc `scratchpads/apply-backend-cdd.md` cleanly. Write your finalized execution summary to `/home/yash/opencode-workspace/navdhan-redesign-2026/.opencode/factory/subagent-status/backend-cdd-summary.md` when completed.
