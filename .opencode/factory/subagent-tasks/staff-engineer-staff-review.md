# Staff Review of Apply Portal CDDs

You must review the drafted Component Design Documents (CDDs) for the rebuilt consent-based multi-step loan application `/apply` flow.

## Context
Our target `/apply` section requires a fully consent-based multi-step loan application wizard built under Next.js 15, PostgreSQL (via Drizzle ORM), and Tailwind CSS v4.

You must review the three drafted CDDs on disk:
1. **Frontend CDD:** `scratchpads/apply-frontend-cdd.md`
2. **Backend CDD:** `scratchpads/apply-backend-cdd.md`
3. **Database CDD:** `scratchpads/apply-database-cdd.md`

Against our finalized contracts:
- **API Contract:** `.opencode/factory/api-contract.yaml`
- **Database Schema:** `.opencode/factory/db-schema.yaml`

---

## Review Criteria

### 1. Sahamati Consent-Based Design
- Review the frontend layout and state design for compliance with the Sahamati Consent-Based Design Guidelines (e.g. active opt-in checkboxes, explicit consent descriptions, clear purpose disclosures, revocability indicators, and secure data handling overlays).

### 2. Perfios Third-Party Flow
- Review the step progression schema for:
  - **Aadhaar eKYC Verification:** OTP triggering and validation interface.
  - **PAN & Aadhaar Link Status:** Casing and name matches.
  - **GSTIN & GST Returns:** Net Banking data retrieval structures.
  - **Bank Statement Analysis:** Secure Net Banking file parser integrations.

### 3. Database Integrity & Currency
- Review the database fields:
  - Ensure all monetary fields strictly use `DECIMAL(19,4)` instead of floating points.
  - Check presence of non-nullable columns and optimized indexes on unique lookup keys (like application UUID, session IDs, and document SHA256 hashes).

### 4. RSC Boundary & Types Compatibility
- Review server/client components boundary: verify that only serializable JSON slices cross the React Server Component (RSC) boundary, and state hooks are confined to client components.

---

## Instructions
- Write your comprehensive evaluation report to `/home/yash/opencode-workspace/navdhan-redesign-2026/scratchpads/cdd-review-report.md`.
- Conclude the report with a clear, singular verdict:
  - **`STATUS: APPROVED`** if all files are complete, aligned, and compliant.
  - **`STATUS: CHANGES_REQUESTED`** if there are material gaps or non-compliant parts.
