# Stage 1 Specification: Rebuild /apply/ into a Consent-Based Multi-Step Loan Application

You must design the API contract (`api-contract.yaml`) and database schema (`db-schema.yaml`) for rebuilding the `/apply` section into a complete, dynamic, multi-step loan application wizard for the redesigned NavDhan platform.

## Design and Visual Direction
1. **Consent-Based Design Principles:** Take consent-based design principles from the Sahamati Account Aggregator guidelines (https://sahamati.org.in/wp-content/uploads/2025/10/Design-Guidelines-1.pdf). Every third-party API fetch (GSTIN, Bank Statement, eKYC) must be preceded by an explicit, transparent, and user-friendly consent screen detailing:
   - What exact data is being collected (e.g. "GST Returns", "6-month Bank Transactions").
   - The purpose of data collection (e.g. "Assess loan eligibility", "Verify income").
   - Who will have access (e.g. "NavDhan credit team", "Selected partner lenders").
   - Explicit opt-in checkbox and affirmative action buttons.
2. **Third-Party API Integrations (Perfios-driven):** The multi-step wizard will replicate the core flows driven by Perfios and other third-party APIs in the original codebase (https://github.com/Kubar-Labs/navdhan-site):
   - **Aadhaar eKYC Verification:** Explicit consent, Aadhaar number input, dynamic OTP request, and verification status.
   - **PAN & Aadhaar Link Status:** PAN number input, link status verification, and name matching.
   - **GSTIN & GST Return History:** GSTIN input, explicit consent, and Perfios-backed retrieval of GST return history.
   - **Bank Statement Analysis:** Bank selection, bank credentials or net banking/OTP-backed statement analysis (Perfios flow).
   - **Income Tax Returns & TDS Certificate:** Document upload drop-zones for "Income Tax Returns (ITR - 3 Years)" and "Form 26AS (TDS Certificate)".

---

## Deliverable Requirements

### 1. `api-contract.yaml` (under `.opencode/factory/api-contract.yaml`)
Define the complete OpenAPI 3.0 specification covering:
- **`POST /api/apply/initialize`:** Setup the application session with basic details (Name, Email, Phone, Requested Amount, Purpose, Referral Code).
- **`POST /api/apply/ekyc/send-otp`** and **`POST /api/apply/ekyc/verify`** for Aadhaar eKYC.
- **`POST /api/apply/pan/verify`** for PAN & Aadhaar link checks.
- **`POST /api/apply/gstin/verify`** and **`POST /api/apply/gstin/fetch-returns`** for GSTIN consent and return retrieval.
- **`POST /api/apply/bank-statement/analyze`** for Perfios bank transaction processing.
- **`POST /api/apply/documents/upload`** for ITR and Form 26AS file uploads.
- **`POST /api/apply/submit`** for final submission and complete data verification.

### 2. `db-schema.yaml` (under `.opencode/factory/db-schema.yaml`)
Define the YAML-based relational database schemas and relationships:
- **`borrowers`** (id, email, phone, full_name, pan, aadhaar_hash, gstin)
- **`loan_applications`** (id, borrower_id, requested_amount, purpose, referral_code, current_step, status, created_at, updated_at)
- **`ekyc_records`** (id, application_id, aadhaar_last_four, transaction_id, verified_at, response_payload)
- **`pan_records`** (id, application_id, pan, link_status, verified_at)
- **`gstin_records`** (id, application_id, gstin, consent_granted, return_history_payload, fetched_at)
- **`bank_statements`** (id, application_id, bank_name, account_number, perfios_transaction_id, analysis_score, analyzed_at)
- **`uploaded_documents`** (id, application_id, document_type, file_path, uploaded_at)

Please keep contracts clean, precise, and compile-safe. Ensure they focus strictly on the visual and API structure without unnecessary database/backend coupling at this stage.
