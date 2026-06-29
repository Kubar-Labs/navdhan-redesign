# Backend Apply Portal Implementation Task

You must implement all `/apply` Route Handlers per `.opencode/factory/api-contract.yaml` (v1.1.0) and the approved backend CDD in `scratchpads/apply-backend-cdd.md`.

## Requirements
1. **Next.js App Router Handlers:** Create the Route Handler files under `app/api/apply/`:
   - `/api/apply/state`: GET retrieves the application state; POST updates the draft state.
   - `/api/apply/otp/send`: POST sends Aadhaar eKYC OTP.
   - `/api/apply/otp/verify`: POST verifies eKYC OTP.
   - `/api/apply/documents/upload`: POST processes direct file uploads.
   - `/api/apply/perfios/initiate`: POST initiates Net Banking statement analysis.
   - `/api/apply/submit`: POST submits the finalized loan application.
2. **Strict Currency Representation:** All money amounts (requested loan amounts, monthly turnovers) must use type decimal and never floating point.
3. **PII Masking:** Implement clean PII masking filters in logs and endpoints.
4. **Validation:** Use zod and compile-safe schemas in `src/lib/apply/stubs/validation.ts` to validate all inputs.

Ensure compile-safe, high-fidelity execution.
