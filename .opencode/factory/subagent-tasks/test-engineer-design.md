# Test Engineer Design Task

You must verify the failing test suites for the built `/apply` loan application portal and ensure they align with the API and database contracts designed in Stage 1.

## Scope & Contracts
- **API Contract:** `/home/yash/opencode-workspace/navdhan-redesign-2026/.opencode/factory/api-contract.yaml` (specifies route parameters, return payloads, and Sahamati consent-based flows).
- **Database Schema:** `/home/yash/opencode-workspace/navdhan-redesign-2026/.opencode/factory/db-schema.yaml` (specifies applications, documents, sessions schemas with decimal money formats and PII flags).

## Your Actions
1. Locate the test files under `tests/apply/` (`apply-api.test.ts`, `apply-validation.test.ts`, `apply-wizard.test.tsx`).
2. Run these tests using Vitest to verify they fail cleanly (since the backend handlers and client wizard are currently skeletons/unimplemented).
3. Review the test assertions to ensure they are 100% consistent with the active contracts.
4. Output your status report to `/home/yash/opencode-workspace/navdhan-redesign-2026/.opencode/factory/subagent-status/test-engineer-design.json`.
