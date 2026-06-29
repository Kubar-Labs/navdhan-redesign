# Staff Engineer Summary

Reviewed the three Apply Portal CDDs against `.opencode/factory/api-contract.yaml`, `.opencode/factory/db-schema.yaml`, and the Kubar fintech rules.

- `scratchpads/apply-database-cdd.md` is aligned with `db-schema.yaml`: `DECIMAL(19,4)` currency, PII hash/encryption design, indexes, and constraints are correct.
- `scratchpads/apply-frontend-cdd.md` is much improved (correct route wrappers, consent receipt UI, error mapping) but still has blocking issues: the `basic_details` split conflicts with `POST /apply/initialize`, and it uses non-contract/non-schema fields (`tenure_months`, `business_pin_code`).
- `scratchpads/apply-backend-cdd.md` is materially misaligned: it designs legacy routes (`/otp/send`, `/perfios/*`, `/documents/upload-url`) instead of the contract endpoints, misses `/apply/initialize`, `/apply/pan/verify`, `/apply/gstin/*`, and `/apply/bank-statement/analyze`, and references tables/columns that do not exist in `db-schema.yaml`.

Wrote the detailed report to `scratchpads/cdd-review-report.md` and appended blocking feedback to `apply-frontend-cdd.md` and `apply-backend-cdd.md`, each ending with `CHANGES_REQUESTED`.

**STATUS: CHANGES_REQUESTED**
