# Apply Portal — Database Component Design Document

**Role:** Database Engineer, Unit 3 (Apply Portal)  
**Branch:** `factory/navdhan-redesign/apply/database`  
**Contract:** `.opencode/factory/apply-contract.yaml` (v1.1.0)  
**Schema source:** `.opencode/factory/db-schema.yaml` (v1.1.0)  

## 1. ORM / migration tool choice

### Decision
Use **Drizzle ORM** (latest 0.31+ / line) with **drizzle-kit** for schema definition, type-safe queries, and migration generation.

### Justification for Next.js 15 + PostgreSQL

| Criterion | Drizzle | Prisma | Recommendation |
|-----------|---------|--------|----------------|
| Runtime size / cold start | Small, no query engine binary | Ships a large Rust binary, non-trivial cold start in serverless | Drizzle is preferable for Vercel/Next.js Route Handlers |
| Query style | SQL-first, composable | Fluent DSL | Drizzle matches Route Handler service-style code |
| TypeScript introspection | Excellent | Excellent | Both acceptable |
| Migration model | TypeScript schema → SQL migrations (`drizzle-kit generate`) | Prisma schema → SQL migrations | Both adequate |
| PostgreSQL feature expressiveness | Native; good but requires hand-tuning for advanced indexes | Rich relation modeling and constraints | Drizzle sufficient; partial unique index support needs hand-tuning |
| Lock-in / deployment complexity | Low | Higher (engine, schema language) | Drizzle keeps the repo close to the contract and SQL |

Given a serverless Next.js 15 deployment where Route Handlers must start fast and the team wants explicit SQL-backed migrations, **Drizzle ORM + drizzle-kit** is the lower-risk choice.

### Driver / dialect selection

- **Primary driver:** `postgres` (node-postgres) via a connection pool.
- **Serverless connection strategy:** Use a **transaction pooler** (Neon, Supabase, or self-managed PgBouncer). In Vercel Edge/Node environments, the `@neondatabase/serverless` driver is acceptable if the project later needs edge runtime.
- **Runtime:** Route Handlers should run in the **Node.js runtime** for full `pg`/`postgres` driver support and transaction/locking semantics. Avoid Edge runtime for routes that mutate application state.

---

## 2. Schema mapping

All PostgreSQL native enums are declared as `pgEnum` in Drizzle. Each contract enum maps one-to-one to a native Postgres enum.

```typescript
// src/db/schema/enums.ts
import { pgEnum } from "drizzle-orm/pg-core";

export const applicationStatusEnum = pgEnum("application_status", [
  "draft",
  "submitted",
  "declined",
  "expired",
]);

export const applicationStepEnum = pgEnum("application_step", [
  "loan_intent",
  "personal_contact",
  "aadhaar_verification",
  "pan_verification",
  "gst_verification",
  "itr_upload",
  "bank_statements",
  "review_submit",
  "submission_result",
]);

export const loanPurposeEnum = pgEnum("loan_purpose", [
  "working_capital",
  "machinery",
  "inventory",
  "business_expansion",
  "debt_refinancing",
  "other",
]);

export const documentTypeEnum = pgEnum("document_type", [
  "itr",
  "bank_statement",
  "gst_return",
  "other",
]);

export const documentStatusEnum = pgEnum("document_status", [
  "pending",
  "uploaded",
  "scanned",
  "failed",
]);

export const scanResultEnum = pgEnum("scan_result", [
  "clean",
  "infected",
  "unreadable",
]);

export const perfiosStatusEnum = pgEnum("perfios_status", [
  "pending",
  "success",
  "failure",
  "partial",
]);

export const consentStepEnum = pgEnum("consent_step", [
  "aadhaar_verification",
  "itr_upload",
  "bank_statements",
  "review_submit",
]);

export const offerStatusEnum = pgEnum("offer_status", [
  "eligible",
  "selected",
  "expired",
  "rejected",
]);

export const eventTypeEnum = pgEnum("event_type", [
  "draft_created",
  "step_transition",
  "otp_sent",
  "otp_verified",
  "otp_failed",
  "consent_recorded",
  "document_uploaded",
  "document_scan_completed",
  "perfios_initiated",
  "perfios_callback_received",
  "application_submitted",
  "submission_failed",
  "offer_received",
  "offer_selected",
]);
```

### Table mapping

#### `applications`

| Column | Drizzle mapping | Notes |
|--------|-----------------|-------|
| `id` | `uuid("id").primaryKey().defaultRandom()` | Application-layer UUID |
| `session_id` | `varchar("session_id", { length: 255 }).notNull()` | Hashed session token used for lookup |
| `reference_number` | `varchar("reference_number", { length: 32 }).unique()` | Generated on submission |
| `status` | `applicationStatusEnum("status").notNull().default("draft")` | |
| `current_step` | `applicationStepEnum("current_step").notNull().default("loan_intent")` | |
| `loan_amount` | `decimal("loan_amount", { precision: 19, scale: 4 })` | Money in INR units with paise-scale precision. Stored as `decimal(19,4)`. |
| `tenure_months` | `smallint("tenure_months")` | |
| `purpose` | `loanPurposeEnum("purpose")` | |
| `referral_code` | `varchar("referral_code", { length: 20 })` | |
| `gstin_skipped` | `boolean("gstin_skipped").notNull().default(false)` | |
| `perfios_transaction_id` | `varchar("perfios_transaction_id", { length: 255 })` | |
| `submitted_at` | `timestamp("submitted_at", { withTimezone: true })` | |
| `created_at` | `timestamp("created_at", { withTimezone: true }).defaultNow().notNull()` | |
| `updated_at` | `timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()` | Managed by DB trigger or explicit update |

Table-level constraints:

- `loan_amount` multiple-of-10k and range check
- `tenure_months` 3–12 range check
- `referral_code` pattern check

Drizzle syntax (example):

```typescript
export const applications = pgTable(
  "applications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sessionId: varchar("session_id", { length: 255 }).notNull(),
    referenceNumber: varchar("reference_number", { length: 32 }).unique(),
    status: applicationStatusEnum("status").notNull().default("draft"),
    currentStep: applicationStepEnum("current_step").notNull().default("loan_intent"),
    loanAmount: decimal("loan_amount", { precision: 19, scale: 4 }),
    tenureMonths: smallint("tenure_months"),
    purpose: loanPurposeEnum("purpose"),
    referralCode: varchar("referral_code", { length: 20 }),
    gstinSkipped: boolean("gstin_skipped").notNull().default(false),
    perfiosTransactionId: varchar("perfios_transaction_id", { length: 255 }),
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    chkLoanAmount: check("chk_applications_loan_amount", sql` loan_amount IS NULL OR (loan_amount BETWEEN ${500000} AND ${10000000} AND loan_amount % ${10000} = 0) `),
    chkTenure: check("chk_applications_tenure", sql` tenure_months IS NULL OR tenure_months BETWEEN 3 AND 12 `),
    chkReferral: check("chk_applications_referral", sql` referral_code IS NULL OR referral_code ~ '^[A-Za-z0-9_-]+$' `),
  })
);
```

#### `applicants`

| Column | Drizzle mapping | Notes |
|--------|-----------------|-------|
| `id` | `uuid("id").primaryKey().defaultRandom()` | |
| `application_id` | `uuid("application_id").notNull().references(() => applications.id, { onDelete: "cascade" }).unique()` | 1:1 with application |
| `pii_key_id` | `varchar("pii_key_id", { length: 255 }).notNull().default("v1")` | Encryption-key version for all encrypted applicant columns |
| `full_name` | `text("full_name")` | PII — encrypted at rest |
| `mobile_number_hash` | `varchar("mobile_number_hash", { length: 64 })` | SHA-256 of normalized 10-digit mobile |
| `mobile_number_encrypted` | `text("mobile_number_encrypted")` | PII — encrypted full mobile |
| `mobile_number_last_four` | `varchar("mobile_number_last_four", { length: 4 })` | Display masking |
| `email_hash` | `varchar("email_hash", { length: 64 })` | SHA-256 of lower-cased email |
| `email_encrypted` | `text("email_encrypted")` | PII — encrypted full email |
| `business_pin_code` | `varchar("business_pin_code", { length: 6 })` | |
| `aadhaar_hash` | `varchar("aadhaar_hash", { length: 64 })` | SHA-256 of normalized 12-digit Aadhaar |
| `aadhaar_last_four` | `varchar("aadhaar_last_four", { length: 4 })` | |
| `aadhaar_verified` | `boolean("aadhaar_verified").notNull().default(false)` | |
| `aadhaar_verified_at` | `timestamp(...)` | |
| `pan_hash` | `varchar("pan_hash", { length: 64 })` | SHA-256 of upper-case PAN |
| `pan_encrypted` | `text("pan_encrypted")` | PII — encrypted full PAN |
| `pan_masked` | `varchar("pan_masked", { length: 10 })` | e.g. `ABCXX***X` |
| `pan_verified` | `boolean("pan_verified").notNull().default(false)` | |
| `pan_verified_at` | `timestamp(...)` | |
| `gstin` | `varchar("gstin", { length: 15 })` | Plain text per regulatory need |
| `created_at` / `updated_at` | `timestamp(...).defaultNow().notNull()` | |

**Note:** `applicants.pii_key_id` provides a per-row encryption-key reference for encrypted applicant fields so key rotation can be tracked without re-encrypting every row.

#### `documents`

| Column | Drizzle mapping | Notes |
|--------|-----------------|-------|
| `id` | `uuid("id").primaryKey().defaultRandom()` | |
| `application_id` | `uuid("application_id").notNull().references(...)` |
| `document_type` | `documentTypeEnum("document_type").notNull()` | |
| `file_name` | `varchar("file_name", { length: 255 }).notNull()` | |
| `mime_type` | `varchar("mime_type", { length: 127 }).notNull()` | Constraint: only `application/pdf` |
| `storage_path` | `text("storage_path").notNull()` | Internal object-store path |
| `encryption_key_id` | `varchar("encryption_key_id", { length: 255 }).notNull()` | DEK reference |
| `file_size_bytes` | `bigint("file_size_bytes", { mode: "number" }).notNull()` | 1–5,242,880 |
| `status` | `documentStatusEnum("status").notNull().default("pending")` | |
| `scan_result` | `scanResultEnum("scan_result")` | |
| `financial_year` | `varchar("financial_year", { length: 7 })` | e.g. `2024-25` |
| `created_at` / `updated_at` | timestamps | |

Drizzle `check` constraints for `mime_type` and `file_size_bytes`.

#### `consents`

Append-only table; no `onDelete: "cascade"` is acceptable only if audit is not required after deletion. The contract says consents are immutable. Since `applications(id)` uses cascade, consent rows will be deleted if the application is deleted. This matches `db-schema.yaml`, but operations should treat deletion as a data-retention event only.

| Column | Drizzle mapping | Notes |
|--------|-----------------|-------|
| `id` | `uuid("id").primaryKey().defaultRandom()` | |
| `application_id` | `uuid(...).notNull().references(...)` | cascade |
| `step_id` | `consentStepEnum("step_id").notNull()` | |
| `consent_key` | `varchar("consent_key", { length: 127 }).notNull()` | Stable i18n key |
| `accepted` | `boolean("accepted").notNull()` | |
| `statement_snapshot` | `text("statement_snapshot").notNull()` | Exact user-facing text |
| `locale` | `varchar("locale", { length: 5 }).notNull()` | |
| `client_ip_hash` | `varchar("client_ip_hash", { length: 64 }).notNull()` | SHA-256 of IP |
| `user_agent_hash` | `varchar("user_agent_hash", { length: 64 })` | Optional hash |
| `created_at` / `updated_at` | timestamps | |

#### `lender_offers`

| Column | Drizzle mapping | Notes |
|--------|-----------------|-------|
| `id` | `uuid("id").primaryKey().defaultRandom()` | |
| `application_id` | `uuid(...).notNull().references(...)` | cascade |
| `lender_name` | `varchar(..., { length: 127 }).notNull()` | |
| `lender_logo_url` | `text("lender_logo_url")` | validated server-side |
| `loan_amount` | `decimal("loan_amount", { precision: 19, scale: 4 }).notNull()` | INR with paise precision per v1.1.0 |
| `interest_rate_annual` | `numeric("interest_rate_annual", { precision: 5, scale: 2 }).notNull()` | |
| `tenure_months` | `smallint(...).notNull()` | |
| `emi_amount` | `decimal("emi_amount", { precision: 19, scale: 4 }).notNull()` | INR with paise precision per v1.1.0 |
| `total_interest` | `decimal("total_interest", { precision: 19, scale: 4 }).notNull()` | INR with paise precision per v1.1.0 |
| `processing_fee` | `decimal("processing_fee", { precision: 19, scale: 4 }).notNull().default(0)` | INR with paise precision per v1.1.0 |
| `net_disbursal` | `decimal("net_disbursal", { precision: 19, scale: 4 }).notNull()` | INR with paise precision per v1.1.0 |
| `status` | `offerStatusEnum("status").notNull().default("eligible")` | |
| `expires_at` | `timestamp(...)` | |
| `selected_at` | `timestamp(...)` | |
| `created_at` / `updated_at` | timestamps | |

#### `application_events`

| Column | Drizzle mapping | Notes |
|--------|-----------------|-------|
| `id` | `bigserial("id", { mode: "bigint" }).primaryKey()` | Natural ordering |
| `application_id` | `uuid(...).notNull().references(...)` | cascade |
| `event_type` | `eventTypeEnum("event_type").notNull()` | |
| `step_id` | `applicationStepEnum("step_id")` | |
| `metadata` | `jsonb("metadata").notNull().default({})` | Non-PII only |
| `created_at` | `timestamp(...).defaultNow().notNull()` | |

Partition hint: once monthly volume exceeds 10M rows, implement range partitioning on `created_at`. Drizzle does not generate partition DDL; it will be managed by an explicit migration script reviewed by the DB team.

#### `idempotency_keys`

Mirrors contract v1.1.0 idempotency requirements.

| Column | Drizzle mapping | Notes |
|--------|-----------------|-------|
| `id` | `bigserial("id", { mode: "bigint" }).primaryKey()` | |
| `key_hash` | `varchar("key_hash", { length: 64 }).notNull()` | SHA-256(scope + ":" + raw key) |
| `scope` | `varchar("scope", { length: 255 }).notNull()` | e.g. session hash or webhook sender id |
| `request_path` | `varchar("request_path", { length: 255 }).notNull()` | |
| `payload_hash` | `varchar("payload_hash", { length: 64 }).notNull()` | SHA-256 of normalized request body |
| `status_code` | `smallint("status_code").notNull()` | |
| `response_body` | `jsonb("response_body").notNull()` | |
| `created_at` | `timestamp(...).defaultNow().notNull()` | |
| `expires_at` | `timestamp(...).notNull()` | now + `IDEMPOTENCY_TTL_SECONDS` |

Drizzle table-level constraints:

```typescript
export const idempotencyKeys = pgTable(
  "idempotency_keys",
  {
    id: bigserial("id", { mode: "bigint" }).primaryKey(),
    keyHash: varchar("key_hash", { length: 64 }).notNull(),
    scope: varchar("scope", { length: 255 }).notNull(),
    requestPath: varchar("request_path", { length: 255 }).notNull(),
    payloadHash: varchar("payload_hash", { length: 64 }).notNull(),
    statusCode: smallint("status_code").notNull(),
    responseBody: jsonb("response_body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.keyHash, table.scope] }),
    expiresIdx: index("idx_idempotency_keys_expires").on(table.expiresAt),
  })
);
```

#### `otp_attempts`

| Column | Drizzle mapping | Notes |
|--------|-----------------|-------|
| `id` | `uuid("id").primaryKey().defaultRandom()` | |
| `application_id` | `uuid(...).notNull().references(...)` | cascade |
| `channel` | `varchar("channel", { length: 16 }).notNull()` | `sms` or `aadhaar` |
| `destination_hash` | `varchar("destination_hash", { length: 64 }).notNull()` | SHA-256 of normalized destination |
| `otp_reference_id` | `varchar("otp_reference_id", { length: 64 }).notNull().unique()` | |
| `purpose` | `varchar("purpose", { length: 32 }).notNull()` | |
| `expires_at` | `timestamp(...).notNull()` | |
| `verified` | `boolean("verified").notNull().default(false)` | |
| `attempt_count` | `smallint("attempt_count").notNull().default(0)` | 0–3 |
| `created_at` / `updated_at` | timestamps | |

---

## 3. Indexes and constraints

### Unique constraints

| Table | Columns | Type | Notes |
|-------|---------|------|-------|
| `applications` | `reference_number` | unique | Human-readable reference; collision must be retried in application code |
| `applicants` | `application_id` | unique | 1:1 mapping enforced at DB |
| `otp_attempts` | `otp_reference_id` | unique | Reference returned to client |
| `lender_offers` | `application_id`, `status` where `status = 'selected'` | partial unique | Only one selected offer per application |

Drizzle supports table-level unique indexes through `uniqueIndex().on(...).where(...)`. Example partial index for lender offers:

```typescript
(table) => ({
  oneSelectedOffer: uniqueIndex("idx_lender_offers_application_status")
    .on(table.applicationId, table.status)
    .where(sql`${table.status} = 'selected'`),
})
```

`drizzle-kit generate` may require hand-tuning of migration SQL for partial unique indexes; verify the generated SQL and adjust the migration file before running.

### Foreign keys

All foreign keys use explicit `onDelete` as declared in `db-schema.yaml`:

```typescript
applicationId: uuid("application_id")
  .notNull()
  .references(() => applications.id, { onDelete: "cascade" }),
```

### Non-unique indexes

Create indexes for every search/access path. The most important ones:

- `applications(session_id)` — draft lookup by session hash
- `applications(status, created_at)` — admin/review listings
- `applicants(mobile_number_hash)`, `(email_hash)`, `(aadhaar_hash)`, `(pan_hash)`, `(gstin)` — deduplication and verification lookups
- `documents(application_id)`, `(application_id, document_type)`, `(status, updated_at)`
- `consents(application_id, consent_key)`, `(application_id, step_id)`, `(created_at)`
- `lender_offers(application_id)`, `(status, expires_at)`
- `application_events(application_id, created_at)`, `(event_type, created_at)`
- `otp_attempts(destination_hash, created_at)`, `(application_id, created_at)`

Drizzle syntax:

```typescript
(table) => ({
  sessionIdx: index("idx_applications_session_id").on(table.sessionId),
  statusCreatedIdx: index("idx_applications_status_created").on(table.status, table.createdAt),
})
```

---

## 4. PII columns and encryption-at-rest

### Per-field policy

Any column holding phone, PAN, Aadhaar, full name, email must never be logged in plaintext by migration or seed scripts. Migrations should contain no sample PII; seed data must use obviously synthetic values and a test DEK.

### Encrypted-value storage

- **Plaintext never stored** for:
  - full mobile → store `mobile_number_encrypted` (ciphertext)
  - full email → store `email_encrypted`
  - full PAN → store `pan_encrypted`
  - full name → store `full_name` as ciphertext
- **One-way hashes** for lookup/deduplication:
  - `mobile_number_hash` = SHA-256(normalized 10-digit mobile)
  - `email_hash` = SHA-256(lowercase email)
  - `aadhaar_hash` = SHA-256(normalized 12-digit Aadhaar)
  - `pan_hash` = SHA-256(uppercase PAN)
- **Display-only masked values**:
  - `mobile_number_last_four`
  - `aadhaar_last_four`
  - `pan_masked`

### Envelope encryption approach

1. Use a **Key Encryption Key (KEK)** stored in a KMS (e.g. Google Cloud KMS) or in environment-secret material.
2. Application generates a **Data Encryption Key (DEK)** per encryption operation (or per application) and encrypts the plaintext with AES-256-GCM.
3. Store the DEK wrapped by the KEK along with the ciphertext nonce.
4. Persist the key reference in a column such as `pii_key_id` (applicants table) or `encryption_key_id` (documents table already has this).

**Recommendation:** add `pii_key_id varchar(255)` to `applicants` so the schema is forward-compatible with key rotation.

### Driver/query implications

- Encryption/decryption happens in the service layer before the value reaches the ORM.
- `findFirst` returns ciphertext; the service layer decrypts using the row's key reference.
- Never use search `WHERE mobile_number_encrypted = ...`; always query by hash.

### Audit/logging

- Default Drizzle and application loggers MUST NOT log parameters that are ciphertext for hash-only columns; if statement logs are enabled, redact `*_encrypted` columns.

---

## 5. Migration ordering and seeding

### Migration sequence

Keep migrations **focused** (one schema concern per file):

1. `0001_create_extensions.sql` — `CREATE EXTENSION IF NOT EXISTS "pgcrypto";` (for `gen_random_uuid`); optionally `uuid-ossp`.
2. `0002_create_apply_enums.sql` — create all enum types listed in §2.
3. `0003_create_applications_table.sql` — create `applications` with checks/indexes.
4. `0004_create_applicants_table.sql` — create `applicants` with FK, indexes, checks.
5. `0005_create_documents_table.sql` — create `documents` with FK, checks, indexes.
6. `0006_create_consents_table.sql` — create `consents` with FK, indexes.
7. `0007_create_lender_offers_table.sql` — create `lender_offers` with partial unique index, checks.
8. `0008_create_application_events_table.sql` — create `application_events` with indexes.
9. `0009_create_otp_attempts_table.sql` — create `otp_attempts` with checks, indexes.
10. `0010_create_updated_at_trigger.sql` — `updated_at` trigger function and triggers for all core tables.
11. `0011_create_idempotency_keys_table.sql` — create `idempotency_keys` table and expiry index.
12. `0012_verify_constraints.sql` — idempotent verification script.

If migrating from the legacy system, insert a dedicated one-time migration step after `0010` and before verification. Legacy tables remain untouched until rollback risk is accepted.

### `updated_at` strategy

Choose one of the following and document it in the repository:

- **Option A (recommended):** Database trigger `set_updated_at()`. Applies to all core tables.
- **Option B:** Application explicitly sets `updatedAt: new Date()` on every update.

If Option A is selected, generate a trigger function and attach it to each table that has `updated_at`.

### Seeding

- **Production:** no seeding.
- **Development:** a single Drizzle seed file (`src/db/seed.ts`) creates one or two application drafts with synthetic data and fake encrypted blobs. PII fields use clearly fake values (`91-XXXXXX0000`, `ABCDE0000F`, etc.).
- **Tests:** each test uses a freshly built schema via `drizzle-kit push` or transactional fixtures; never reuse production-like PII.

---

## 6. Connection / pooling configuration for serverless

### Recommended configuration

```typescript
// src/db/client.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: Number(process.env.DB_POOL_MAX ?? "10"),
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
  statement_timeout: 10_000,
});

export const db = drizzle(pool, { schema });
```

For a transaction pooler (PgBouncer / Supabase), add `?pgbouncer=true` and avoid prepared statements spanning multiple queries in the same connection if statement mode is prepared. Use `prepare: false` or driver-specific compat flags when needed.

### Serverless constraints

- Do not hold transactions open across external I/O (verification stub, object store uploads, perfios callbacks). Fetch/validate data, then open a transaction.
- For Route Handlers, keep `max` low (5–10) because many concurrent lambdas can exhaust Postgres `max_connections`.
- If deploying to Vercel with **Neon**, prefer the `@neondatabase/serverless` driver and Drizzle's `drizzle(pool, {schema})` serverless adapter to avoid idle connection issues.
- Use explicit transactions for any state mutation.

---

## 7. Alignment with backend route handlers

### Service layer shape

Backend route handlers import a typed `db` instance and the `applications`, `applicants`, `documents`, `consents`, `lenderOffers`, `applicationEvents`, `otpAttempts` schema objects.

Typical service signatures:

```typescript
// src/services/applicationService.ts
export async function getOrCreateDraft(
  sessionIdHash: string,
): Promise<ApplicationState> { ... }

export async function updateStep(
  applicationId: string,
  stepId: ApplicationStep,
  payload: unknown,
): Promise<ApplicationState> { ... }

export async function submitApplication(
  applicationId: string,
  finalConsents: FinalConsents,
): Promise<SubmissionResult> { ... }

export async function getOffers(applicationId: string): Promise<LenderOffer[]> { ... }

export async function recordOfferSelection(
  applicationId: string,
  offerId: string,
): Promise<void> { ... }
```

### Transaction and locking pattern

For the final submission (and any offer selection/money mutation), use a serializable or read-committed transaction with explicit row locking:

```typescript
await db.transaction(async (tx) => {
  const [app] = await tx
    .select()
    .from(applications)
    .where(eq(applications.id, applicationId))
    .for("update");

  // validate, insert events, create offers, update status
  await tx.insert(applicationEvents).values({ ... });
  await tx.update(applications)
    .set({ status: "submitted", submittedAt: new Date() })
    .where(eq(applications.id, applicationId));
});
```

- Submission must lock the `applications` row before generating `reference_number` and offer rows.
- Offer selection must lock both the application and the chosen offer row to satisfy the partial unique constraint.

### Query patterns

- Fetch full application state with related entities using Drizzle `with:` relational query helpers or explicit joins. Because core tables are small per application, `select` + `join` is acceptable.
- Avoid N+1: when listing offers, select `lenderOffers` filtered by `applicationId` in a single query.

### Encryption boundary

- Service layer receives plaintext from routes, hashes/encrypts, then passes the encrypted object/values to Drizzle.
- `getOrCreateDraft` decrypts ciphertext fields and assembles `ApplicationState` with masked values for the response.

---

## 8. Blockers / ambiguities

1. ~~Currency column types vs. Kubar fintech rule~~ **Resolved in db-schema.yaml v1.1.0.** All monetary columns are now `DECIMAL(19,4)`.

2. ~~Idempotency keys absent from contract~~ **Resolved in apply-contract.yaml v1.1.0 and schema v1.1.0.** `idempotency_keys` table and mandatory `Idempotency-Key` header are now specified.

3. **Partial unique index DSL in Drizzle**  
   The "only one selected offer" constraint is a partial unique index. Drizzle supports `uniqueIndex(...).where(sql...)` but migration generation must be inspected by hand. If unsupported in the installed Drizzle version, the migration file will need a manual SQL block.

4. **Missing encryption-key reference for applicant PII**  
   `applicants` has encrypted columns but no `encryption_key_id`. Adding `pii_key_id` is recommended for key rotation and audit.

5. **`updated_at` responsibility**  
   The contract says timestamps default/ auto-update but does not mandate triggers vs. application code. The DB layer and backend must agree on one strategy and embed it in the contract.

6. **`session_id` in `applications`**  
   The column is described as "Encrypted session cookie identifier; hashed for lookup." The actual cookie value must be hashed by the backend before storage and before querying. The DB column is just a lookup key.

7. **Perfios `statement_months` / response data**  
   The contract asks for `statement_months` and Perfios response fields (e.g. `average_monthly_balance`). No dedicated column exists outside `application_events.metadata` or documents. If analytics need structured fields, a `perfios_statements` table should be added later.

8. **GST skip reason**  
   ` ApplicationState.gst_verification.skipped_reason_i18n_key` is not persisted in `db-schema.yaml`. Either derive it from a constant in the backend or add a column to `applications`/`applicants`.

9. **Reference-number collision handling**  
   `reference_number` is unique but the generation algorithm is in the backend. The DB unique constraint will reject collisions; the backend must retry with a new generated value within the submission transaction.

10. **No soft deletes in MVP**  
    Deletion follows `onDelete` cascade and is intended for data retention only. Confirm with legal/compliance before enabling any automated purge job.

---

## 9. Summary of recommendations

- Adopt **Drizzle ORM + drizzle-kit** with the `pg` driver and a transaction pooler.
- Keep migrations small and sequential, mirroring `db-schema.yaml` migration notes.
- Represent all contract enums as PostgreSQL native enums via `pgEnum`.
- Enforce uniqueness on `reference_number`, `applicants.application_id`, `otp_attempts.otp_reference_id`, and the partial unique index for selected offers.
- Implement PII envelope encryption in the service layer; store only ciphertext, hashes, and masked display fields. Add `pii_key_id` to `applicants`.
- Use explicit transactions with `SELECT ... FOR UPDATE` on submission and offer-selection flows.
- Resolve the `bigint`-vs-`numeric` currency discrepancy before final schema commit.
- Resolve the missing idempotency-key contract/table before backend route handler implementation.
