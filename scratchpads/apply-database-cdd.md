# Apply Portal — Database Component Design Document

**Role:** Database Engineer, Unit 3 (Apply Portal)
**Schema source:** `.opencode/factory/db-schema.yaml` (absolute source of truth)
**ORM/migrations:** Drizzle ORM + drizzle-kit, `pg` driver, Node.js Route-Handler runtime

---

## 1. ORM and driver choice

- **Drizzle ORM** with `drizzle-kit` generates type-safe schemas and SQL migrations.
- **Driver:** `node-postgres` (`pg`) connection pool; use a transaction pooler (PgBouncer/Neon/Supabase) for serverless.
- **Runtime:** Route Handlers that mutate state run in the **Node.js runtime** so transactions, advisory locks, and `SELECT ... FOR UPDATE` work correctly. Edge runtime is avoided for mutating paths.
- All PostgreSQL enums are modelled as native `pgEnum` types so the database enforces allowed values.

---

## 2. Schema-to-Drizzle mapping

### 2.1 Enums

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
  "basic_details",
  "ekyc_consent",
  "ekyc_verification",
  "pan_consent",
  "pan_verification",
  "gstin_consent",
  "gstin_verification",
  "gstin_returns",
  "bank_statement_consent",
  "bank_statement_analysis",
  "itr_upload",
  "tds_upload",
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

export const documentTypeEnum = pgEnum("document_type", ["itr", "tds_certificate"]);

export const documentStatusEnum = pgEnum("document_status", [
  "pending",
  "uploaded",
  "scanned",
  "failed",
]);

export const scanResultEnum = pgEnum("scan_result", ["clean", "infected", "unreadable"]);

export const verificationStatusEnum = pgEnum("verification_status", [
  "pending",
  "verified",
  "failed",
]);

export const bankStatementStatusEnum = pgEnum("bank_statement_status", [
  "pending",
  "success",
  "failure",
  "partial",
]);

export const linkStatusEnum = pgEnum("link_status", ["linked", "not_linked", "unknown"]);
```

### 2.2 `borrowers`

Identity root for a borrower. Encrypted full values and one-way hashes are stored for PII; plaintext phone/PAN/Aadhaar/full name never persists.

| Column                      | Drizzle mapping                                                 | Notes                                  |
| --------------------------- | --------------------------------------------------------------- | -------------------------------------- |
| `id`                        | `uuid("id").primaryKey().defaultRandom()`                       |                                        |
| `email`                     | `varchar("email", { length: 255 }).notNull().unique()`          | Login/contact identifier               |
| `full_name`                 | `text("full_name")`                                             | PII — encrypted at rest                |
| `phone_hash`                | `varchar("phone_hash", { length: 64 })`                         | SHA-256 of normalized 10-digit mobile  |
| `phone_encrypted`           | `text("phone_encrypted")`                                       | PII — encrypted at rest                |
| `phone_last_four`           | `varchar("phone_last_four", { length: 4 })`                     | Display masking                        |
| `pan_hash`                  | `varchar("pan_hash", { length: 64 })`                           | SHA-256 of uppercase PAN               |
| `pan_encrypted`             | `text("pan_encrypted")`                                         | PII — encrypted at rest                |
| `pan_masked`                | `varchar("pan_masked", { length: 10 })`                         | Display masking                        |
| `aadhaar_hash`              | `varchar("aadhaar_hash", { length: 64 })`                       | SHA-256 of 12-digit normalized Aadhaar |
| `aadhaar_last_four`         | `varchar("aadhaar_last_four", { length: 4 })`                   |                                        |
| `gstin`                     | `varchar("gstin", { length: 15 })`                              | Plain text per regulatory need         |
| `created_at` / `updated_at` | `timestamp(..., { withTimezone: true }).defaultNow().notNull()` |                                        |

Drizzle definition:

```typescript
export const borrowers = pgTable(
  "borrowers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    fullName: text("full_name"),
    phoneHash: varchar("phone_hash", { length: 64 }),
    phoneEncrypted: text("phone_encrypted"),
    phoneLastFour: varchar("phone_last_four", { length: 4 }),
    panHash: varchar("pan_hash", { length: 64 }),
    panEncrypted: text("pan_encrypted"),
    panMasked: varchar("pan_masked", { length: 10 }),
    aadhaarHash: varchar("aadhaar_hash", { length: 64 }),
    aadhaarLastFour: varchar("aadhaar_last_four", { length: 4 }),
    gstin: varchar("gstin", { length: 15 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: uniqueIndex("idx_borrowers_email").on(table.email),
    phoneHashIdx: index("idx_borrowers_phone_hash").on(table.phoneHash),
    aadhaarHashIdx: index("idx_borrowers_aadhaar_hash").on(table.aadhaarHash),
    panHashIdx: index("idx_borrowers_pan_hash").on(table.panHash),
    gstinIdx: index("idx_borrowers_gstin").on(table.gstin),
    chkEmail: check("chk_borrowers_email", sql`email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'`),
    chkGstin: check(
      "chk_borrowers_gstin",
      sql`gstin IS NULL OR gstin ~ '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$'`,
    ),
  }),
);
```

### 2.3 `loan_applications` (previously `applications`)

Mutable draft/submission state. This is the central aggregate for the apply wizard.

| Column                      | Drizzle mapping                                                                         | Notes                            |
| --------------------------- | --------------------------------------------------------------------------------------- | -------------------------------- |
| `id`                        | `uuid("id").primaryKey().defaultRandom()`                                               |                                  |
| `borrower_id`               | `uuid("borrower_id").notNull().references(() => borrowers.id, { onDelete: "cascade" })` |                                  |
| `requested_amount`          | `decimal("requested_amount", { precision: 19, scale: 4 })`                              | Money — INR with paise precision |
| `purpose`                   | `loanPurposeEnum("purpose")`                                                            |                                  |
| `referral_code`             | `varchar("referral_code", { length: 20 })`                                              |                                  |
| `current_step`              | `applicationStepEnum("current_step").notNull().default("basic_details")`                |                                  |
| `status`                    | `applicationStatusEnum("status").notNull().default("draft")`                            |                                  |
| `reference_number`          | `varchar("reference_number", { length: 32 }).unique()`                                  | Generated on submission          |
| `submitted_at`              | `timestamp("submitted_at", { withTimezone: true })`                                     |                                  |
| `created_at` / `updated_at` | `timestamp(...).defaultNow().notNull()`                                                 |                                  |

Drizzle definition:

```typescript
export const loanApplications = pgTable(
  "loan_applications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    borrowerId: uuid("borrower_id")
      .notNull()
      .references(() => borrowers.id, { onDelete: "cascade" }),
    requestedAmount: decimal("requested_amount", { precision: 19, scale: 4 }),
    purpose: loanPurposeEnum("purpose"),
    referralCode: varchar("referral_code", { length: 20 }),
    currentStep: applicationStepEnum("current_step").notNull().default("basic_details"),
    status: applicationStatusEnum("status").notNull().default("draft"),
    referenceNumber: varchar("reference_number", { length: 32 }).unique(),
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    borrowerIdx: index("idx_loan_applications_borrower_id").on(table.borrowerId),
    statusCreatedIdx: index("idx_loan_applications_status_created").on(
      table.status,
      table.createdAt,
    ),
    referenceIdx: uniqueIndex("idx_loan_applications_reference_number").on(table.referenceNumber),
    chkAmount: check(
      "chk_loan_applications_requested_amount",
      sql`requested_amount IS NULL OR (requested_amount BETWEEN ${500000} AND ${10000000} AND requested_amount % ${10000} = 0)`,
    ),
    chkReferral: check(
      "chk_loan_applications_referral_code",
      sql`referral_code IS NULL OR referral_code ~ '^[A-Za-z0-9_-]+$'`,
    ),
  }),
);
```

### 2.4 `ekyc_records`

Aadhaar eKYC verification attempt and result.

| Column                      | Drizzle mapping                                                                                   | Notes                 |
| --------------------------- | ------------------------------------------------------------------------------------------------- | --------------------- |
| `id`                        | `uuid("id").primaryKey().defaultRandom()`                                                         |                       |
| `application_id`            | `uuid("application_id").notNull().references(() => loanApplications.id, { onDelete: "cascade" })` |                       |
| `aadhaar_last_four`         | `varchar("aadhaar_last_four", { length: 4 })`                                                     |                       |
| `transaction_id`            | `varchar("transaction_id", { length: 255 })`                                                      | Vendor transaction id |
| `verified_at`               | `timestamp("verified_at", { withTimezone: true })`                                                |                       |
| `response_payload`          | `jsonb("response_payload").default({})`                                                           |                       |
| `created_at` / `updated_at` | `timestamp(...).defaultNow().notNull()`                                                           |                       |

```typescript
export const ekycRecords = pgTable(
  "ekyc_records",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    applicationId: uuid("application_id")
      .notNull()
      .references(() => loanApplications.id, { onDelete: "cascade" }),
    aadhaarLastFour: varchar("aadhaar_last_four", { length: 4 }),
    transactionId: varchar("transaction_id", { length: 255 }),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
    responsePayload: jsonb("response_payload").default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    applicationIdx: index("idx_ekyc_records_application_id").on(table.applicationId),
    transactionIdx: index("idx_ekyc_records_transaction_id").on(table.transactionId),
  }),
);
```

### 2.5 `pan_records`

PAN verification and PAN-Aadhaar link status.

| Column                      | Drizzle mapping                                                | Notes                   |
| --------------------------- | -------------------------------------------------------------- | ----------------------- |
| `id`                        | `uuid("id").primaryKey().defaultRandom()`                      |                         |
| `application_id`            | `uuid(...).notNull().references(..., { onDelete: "cascade" })` |                         |
| `pan_hash`                  | `varchar("pan_hash", { length: 64 })`                          |                         |
| `pan_encrypted`             | `text("pan_encrypted")`                                        | PII — encrypted at rest |
| `pan_masked`                | `varchar("pan_masked", { length: 10 })`                        |                         |
| `link_status`               | `linkStatusEnum("link_status")`                                |                         |
| `name_match`                | `boolean("name_match")`                                        |                         |
| `verified_at`               | `timestamp(...)`                                               |                         |
| `created_at` / `updated_at` | timestamps                                                     |                         |

```typescript
export const panRecords = pgTable(
  "pan_records",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    applicationId: uuid("application_id")
      .notNull()
      .references(() => loanApplications.id, { onDelete: "cascade" }),
    panHash: varchar("pan_hash", { length: 64 }),
    panEncrypted: text("pan_encrypted"),
    panMasked: varchar("pan_masked", { length: 10 }),
    linkStatus: linkStatusEnum("link_status"),
    nameMatch: boolean("name_match"),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    applicationIdx: index("idx_pan_records_application_id").on(table.applicationId),
    panHashIdx: index("idx_pan_records_pan_hash").on(table.panHash),
  }),
);
```

### 2.6 `gstin_records`

GSTIN validation and Perfios-backed return history.

| Column                      | Drizzle mapping                                                | Notes |
| --------------------------- | -------------------------------------------------------------- | ----- |
| `id`                        | `uuid("id").primaryKey().defaultRandom()`                      |       |
| `application_id`            | `uuid(...).notNull().references(..., { onDelete: "cascade" })` |       |
| `gstin`                     | `varchar("gstin", { length: 15 })`                             |       |
| `consent_granted`           | `boolean("consent_granted").notNull().default(false)`          |       |
| `return_history_payload`    | `jsonb("return_history_payload").default({})`                  |       |
| `fetched_at`                | `timestamp(...)`                                               |       |
| `created_at` / `updated_at` | timestamps                                                     |       |

```typescript
export const gstinRecords = pgTable(
  "gstin_records",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    applicationId: uuid("application_id")
      .notNull()
      .references(() => loanApplications.id, { onDelete: "cascade" }),
    gstin: varchar("gstin", { length: 15 }),
    consentGranted: boolean("consent_granted").notNull().default(false),
    returnHistoryPayload: jsonb("return_history_payload").default({}),
    fetchedAt: timestamp("fetched_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    applicationIdx: index("idx_gstin_records_application_id").on(table.applicationId),
    gstinIdx: index("idx_gstin_records_gstin").on(table.gstin),
    chkGstin: check(
      "chk_gstin_records_gstin",
      sql`gstin IS NULL OR gstin ~ '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$'`,
    ),
  }),
);
```

### 2.7 `bank_statements` (previously `perfios_sessions`)

Perfios bank-statement analysis records.

| Column                      | Drizzle mapping                                                  | Notes                                          |
| --------------------------- | ---------------------------------------------------------------- | ---------------------------------------------- |
| `id`                        | `uuid("id").primaryKey().defaultRandom()`                        |                                                |
| `application_id`            | `uuid(...).notNull().references(..., { onDelete: "cascade" })`   |                                                |
| `bank_name`                 | `varchar("bank_name", { length: 127 })`                          |                                                |
| `account_number_encrypted`  | `text("account_number_encrypted")`                               | PII — encrypted at rest                        |
| `account_number_last_four`  | `varchar("account_number_last_four", { length: 4 })`             |                                                |
| `perfios_transaction_id`    | `varchar("perfios_transaction_id", { length: 255 })`             |                                                |
| `months`                    | `smallint("months")`                                             | Statement months requested/fetched             |
| `status`                    | `bankStatementStatusEnum("status").notNull().default("pending")` |                                                |
| `analysis_score`            | `numeric("analysis_score", { precision: 5, scale: 2 })`          | Not money — model score                        |
| `analyzed_at`               | `timestamp(...)`                                                 |                                                |
| `raw_payload`               | `jsonb("raw_payload").default({})`                               | Encrypted-store path lives here, not plaintext |
| `created_at` / `updated_at` | timestamps                                                       |                                                |

```typescript
export const bankStatements = pgTable(
  "bank_statements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    applicationId: uuid("application_id")
      .notNull()
      .references(() => loanApplications.id, { onDelete: "cascade" }),
    bankName: varchar("bank_name", { length: 127 }),
    accountNumberEncrypted: text("account_number_encrypted"),
    accountNumberLastFour: varchar("account_number_last_four", { length: 4 }),
    perfiosTransactionId: varchar("perfios_transaction_id", { length: 255 }),
    months: smallint("months"),
    status: bankStatementStatusEnum("status").notNull().default("pending"),
    analysisScore: numeric("analysis_score", { precision: 5, scale: 2 }),
    analyzedAt: timestamp("analyzed_at", { withTimezone: true }),
    rawPayload: jsonb("raw_payload").default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    applicationIdx: index("idx_bank_statements_application_id").on(table.applicationId),
    perfiosTxIdx: index("idx_bank_statements_perfios_transaction_id").on(
      table.perfiosTransactionId,
    ),
    statusAnalyzedIdx: index("idx_bank_statements_status_analyzed").on(
      table.status,
      table.analyzedAt,
    ),
    chkMonths: check("chk_bank_statements_months", sql`months IS NULL OR months BETWEEN 6 AND 12`),
  }),
);
```

### 2.8 `uploaded_documents` (previously `documents`)

ITR and Form 26AS (TDS certificate) uploads.

| Column                      | Drizzle mapping                                                           | Notes                                |
| --------------------------- | ------------------------------------------------------------------------- | ------------------------------------ |
| `id`                        | `uuid("id").primaryKey().defaultRandom()`                                 |                                      |
| `application_id`            | `uuid(...).notNull().references(..., { onDelete: "cascade" })`            |                                      |
| `document_type`             | `documentTypeEnum("document_type").notNull()`                             |                                      |
| `file_name`                 | `varchar("file_name", { length: 255 }).notNull()`                         |                                      |
| `mime_type`                 | `varchar("mime_type", { length: 127 }).notNull()`                         |                                      |
| `file_size_bytes`           | `bigint("file_size_bytes", { mode: "number" }).notNull()`                 |                                      |
| `file_path`                 | `text("file_path").notNull()`                                             | Internal encrypted object-store path |
| `encryption_key_id`         | `varchar("encryption_key_id", { length: 255 }).notNull()`                 | DEK reference                        |
| `status`                    | `documentStatusEnum("status").notNull().default("pending")`               |                                      |
| `scan_result`               | `scanResultEnum("scan_result")`                                           |                                      |
| `uploaded_at`               | `timestamp("uploaded_at", { withTimezone: true }).defaultNow().notNull()` |                                      |
| `created_at` / `updated_at` | timestamps                                                                |                                      |

```typescript
export const uploadedDocuments = pgTable(
  "uploaded_documents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    applicationId: uuid("application_id")
      .notNull()
      .references(() => loanApplications.id, { onDelete: "cascade" }),
    documentType: documentTypeEnum("document_type").notNull(),
    fileName: varchar("file_name", { length: 255 }).notNull(),
    mimeType: varchar("mime_type", { length: 127 }).notNull(),
    fileSizeBytes: bigint("file_size_bytes", { mode: "number" }).notNull(),
    filePath: text("file_path").notNull(),
    encryptionKeyId: varchar("encryption_key_id", { length: 255 }).notNull(),
    status: documentStatusEnum("status").notNull().default("pending"),
    scanResult: scanResultEnum("scan_result"),
    uploadedAt: timestamp("uploaded_at", { withTimezone: true }).defaultNow().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    applicationIdx: index("idx_uploaded_documents_application_id").on(table.applicationId),
    applicationTypeIdx: index("idx_uploaded_documents_application_type").on(
      table.applicationId,
      table.documentType,
    ),
    statusUpdatedIdx: index("idx_uploaded_documents_status_updated").on(
      table.status,
      table.updatedAt,
    ),
    chkMime: check("chk_uploaded_documents_mime", sql`mime_type = 'application/pdf'`),
    chkSize: check(
      "chk_uploaded_documents_size",
      sql`file_size_bytes > 0 AND file_size_bytes <= 5242880`,
    ),
  }),
);
```

### 2.9 `consents` (previously `consent_logs`)

Append-only audit trail of explicit borrower consent decisions.

| Column                      | Drizzle mapping                                                           | Notes                  |
| --------------------------- | ------------------------------------------------------------------------- | ---------------------- |
| `id`                        | `uuid("id").primaryKey().defaultRandom()`                                 |                        |
| `application_id`            | `uuid(...).notNull().references(..., { onDelete: "cascade" })`            |                        |
| `step_id`                   | `varchar("step_id", { length: 64 }).notNull()`                            | Contract step id       |
| `consent_key`               | `varchar("consent_key", { length: 127 }).notNull()`                       | Stable i18n key        |
| `accepted`                  | `boolean("accepted").notNull()`                                           |                        |
| `statement_snapshot`        | `text("statement_snapshot").notNull()`                                    | Exact user-facing text |
| `locale`                    | `varchar("locale", { length: 5 }).notNull()`                              |                        |
| `client_ip_hash`            | `varchar("client_ip_hash", { length: 64 }).notNull()`                     |                        |
| `user_agent_hash`           | `varchar("user_agent_hash", { length: 64 })`                              |                        |
| `recorded_at`               | `timestamp("recorded_at", { withTimezone: true }).defaultNow().notNull()` |                        |
| `created_at` / `updated_at` | timestamps                                                                |                        |

```typescript
export const consents = pgTable(
  "consents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    applicationId: uuid("application_id")
      .notNull()
      .references(() => loanApplications.id, { onDelete: "cascade" }),
    stepId: varchar("step_id", { length: 64 }).notNull(),
    consentKey: varchar("consent_key", { length: 127 }).notNull(),
    accepted: boolean("accepted").notNull(),
    statementSnapshot: text("statement_snapshot").notNull(),
    locale: varchar("locale", { length: 5 }).notNull(),
    clientIpHash: varchar("client_ip_hash", { length: 64 }).notNull(),
    userAgentHash: varchar("user_agent_hash", { length: 64 }),
    recordedAt: timestamp("recorded_at", { withTimezone: true }).defaultNow().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    appConsentIdx: index("idx_consents_application_consent").on(
      table.applicationId,
      table.consentKey,
    ),
    appStepIdx: index("idx_consents_application_step").on(table.applicationId, table.stepId),
    recordedIdx: index("idx_consents_recorded_at").on(table.recordedAt),
  }),
);
```

### 2.10 `idempotency_keys`

Cache of mutating request results for idempotent replays.

| Column            | Drizzle mapping                                      | Notes             |
| ----------------- | ---------------------------------------------------- | ----------------- |
| `id`              | `uuid("id").primaryKey().defaultRandom()`            |                   |
| `key_hash`        | `varchar("key_hash", { length: 64 }).notNull()`      |                   |
| `scope`           | `varchar("scope", { length: 255 }).notNull()`        | e.g. session hash |
| `request_path`    | `varchar("request_path", { length: 255 }).notNull()` |                   |
| `payload_hash`    | `varchar("payload_hash", { length: 64 }).notNull()`  |                   |
| `response_status` | `smallint("response_status").notNull()`              |                   |
| `response_body`   | `jsonb("response_body")`                             |                   |
| `created_at`      | `timestamp(...).defaultNow().notNull()`              |                   |
| `expires_at`      | `timestamp(...).notNull()`                           |                   |

```typescript
export const idempotencyKeys = pgTable(
  "idempotency_keys",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    keyHash: varchar("key_hash", { length: 64 }).notNull(),
    scope: varchar("scope", { length: 255 }).notNull(),
    requestPath: varchar("request_path", { length: 255 }).notNull(),
    payloadHash: varchar("payload_hash", { length: 64 }).notNull(),
    responseStatus: smallint("response_status").notNull(),
    responseBody: jsonb("response_body"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (table) => ({
    keyScopeIdx: uniqueIndex("idx_idempotency_keys_key_scope")
      .on(table.keyHash, table.scope)
      .where(sql`${table.expiresAt} > now()`),
    expiresIdx: index("idx_idempotency_keys_expires").on(table.expiresAt),
  }),
);
```

---

## 3. Indexes, keys, and constraints

### Primary keys

- All tables use a single `uuid` primary key with `gen_random_uuid()` default.

### Unique constraints

| Table               | Columns                                           | Notes                                                                        |
| ------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------- |
| `borrowers`         | `email`                                           | Login identifier uniqueness enforced at DB                                   |
| `loan_applications` | `reference_number`                                | Human-readable reference generated on submission; backend retries collisions |
| `idempotency_keys`  | `key_hash, scope` (partial, `expires_at > now()`) | Prevents replay while key is live                                            |

### Foreign keys

All foreign keys use `ON DELETE CASCADE` exactly as declared in `db-schema.yaml`:

```typescript
applicationId: uuid("application_id")
  .notNull()
  .references(() => loanApplications.id, { onDelete: "cascade" });
```

### Foreign-key / access indexes

| Table                | Index                                                                         | Reason                                      |
| -------------------- | ----------------------------------------------------------------------------- | ------------------------------------------- |
| `loan_applications`  | `(borrower_id)`                                                               | FK lookup; listing applications by borrower |
| `loan_applications`  | `(status, created_at)`                                                        | Admin/review listings                       |
| `loan_applications`  | `(reference_number)`                                                          | Unique + lookup                             |
| `ekyc_records`       | `(application_id)`, `(transaction_id)`                                        | FK + vendor reconciliation                  |
| `pan_records`        | `(application_id)`, `(pan_hash)`                                              | FK + deduplication                          |
| `gstin_records`      | `(application_id)`, `(gstin)`                                                 | FK + GSTIN lookup                           |
| `bank_statements`    | `(application_id)`, `(perfios_transaction_id)`, `(status, analyzed_at)`       | FK + Perfios callback + status scan         |
| `uploaded_documents` | `(application_id)`, `(application_id, document_type)`, `(status, updated_at)` | FK + status scans                           |
| `consents`           | `(application_id, consent_key)`, `(application_id, step_id)`, `(recorded_at)` | Audit reads                                 |
| `idempotency_keys`   | `(expires_at)`                                                                | TTL cleanup / purge                         |

All PII lookup is by **hash only**; encrypted text columns are never part of a `WHERE` predicate.

---

## 4. PII and encryption-at-rest

### Storage rule

- Plaintext full values never persist for phone, Aadhaar, PAN, bank account number, or applicant name.
- Store one-way SHA-256 hashes for lookup/deduplication:
  - `phone_hash` → 10-digit normalized mobile
  - `aadhaar_hash` → 12-digit normalized Aadhaar
  - `pan_hash` → uppercase PAN
- Store encrypted ciphertext in `*_encrypted` text columns and masked display values in `*_last_four` / `*_masked` columns.
- Files are encrypted client-side or server-side and the persisted `file_path` references an encrypted object-store blob; `encryption_key_id` records the DEK/KEK reference.
- Names, emails, and full bank account numbers are encrypted as ciphertext before reaching the ORM.

### Logging

- Application and statement logs must not emit `*_encrypted`, hash, or masked PII as plaintext.
- Use field redaction for columns such as `phone_encrypted`, `pan_encrypted`, `aadhaar_hash`, etc.

---

## 5. Money fields

All monetary amounts in `db-schema.yaml` are `DECIMAL(19,4)`:

| Table               | Column             | Drizzle mapping                                            |
| ------------------- | ------------------ | ---------------------------------------------------------- |
| `loan_applications` | `requested_amount` | `decimal("requested_amount", { precision: 19, scale: 4 })` |

No float/numeric types are used for currency. `bank_statements.analysis_score` is a model score (`numeric(5,2)`) and is **not** currency.

---

## 6. Row-level locking and transaction strategy

### Required locking patterns

1. **Submission and status mutation**
   - Open an explicit `db.transaction`.
   - Lock the `loan_applications` row first:
     ```typescript
     const [app] = await tx
       .select()
       .from(loanApplications)
       .where(eq(loanApplications.id, applicationId))
       .for("update");
     ```
   - Validate state, insert `consents` if needed, update status/reference number inside the same transaction.

2. **Perfios callback / bank statement update**
   - Lock the `bank_statements` row by `perfios_transaction_id` or `application_id` before changing `status`, `analysis_score`, or `raw_payload`.

3. **Document scan-complete transition**
   - Lock the `uploaded_documents` row before updating `status` or `scan_result`.

4. **Idempotency replay**
   - Do not lock; rely on the partial unique index `(key_hash, scope) WHERE expires_at > now()`.
   - On replay, read the cached row; if `payload_hash` differs, return `409 IDEMPOTENCY_KEY_CONFLICT`.

### Isolation levels

- Default Route-Handler transactions use **Read Committed**.
- Use **Repeatable Read** only for the final submission if the handler reads multiple related rows and must guard against phantoms; otherwise default Read Committed plus `SELECT ... FOR UPDATE` is sufficient.
- Never hold a transaction open across external I/O (SMS gateway, Perfios, object-store upload).

### Optimistic / read-only paths

- GET endpoints read committed snapshots; no locking is required.
- Prefer `select` with related-table joins or Drizzle relational queries over N+1 lookups for `/api/apply/state`.

---

## 7. Migration ordering

Migrations are focused and sequential, mirroring `db-schema.yaml`:

1. `0001_create_extensions.sql` — `pgcrypto`, `uuid-ossp` if required.
2. `0002_create_apply_enums.sql` — create all `pgEnum` types.
3. `0003_create_borrowers_table.sql` — `borrowers` with checks/indexes.
4. `0004_create_loan_applications_table.sql` — `loan_applications` with FK, checks, indexes.
5. `0005_create_ekyc_records_table.sql`.
6. `0006_create_pan_records_table.sql`.
7. `0007_create_gstin_records_table.sql`.
8. `0008_create_bank_statements_table.sql`.
9. `0009_create_uploaded_documents_table.sql`.
10. `0010_create_consents_table.sql`.
11. `0011_create_idempotency_keys_table.sql` — partial unique index may need hand-tuning.
12. `0012_create_updated_at_trigger.sql` — trigger function and attachment for all core tables.
13. `0013_verify_constraints.sql` — idempotent verification.

### `updated_at` strategy

Use a database trigger `set_updated_at()` (Option A) and attach it to every table that has `updated_at`. Application code may also set `updatedAt` defensively, but the trigger is the source of truth.

---

## 8. Connection and environment assumptions

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

- Use a transaction pooler in production to avoid exhausting `max_connections` under Vercel concurrency.
- Keep `max` low (5–10) per lambda instance.

---

## 9. Notes and open items

- **Table-name alignment:** this CDD uses the exact table names from `db-schema.yaml`: `loan_applications`, `uploaded_documents`, `bank_statements`, and `consents`. These replace the working names `applications`, `documents`, `perfios_sessions`, and `consent_logs` used in earlier prompts.
- **`borrowers` is the new identity root:** borrower-level PII is normalized out of `loan_applications`. One borrower may have multiple loan applications over time.
- **`verification_status` enum** is defined in `db-schema.yaml` but currently unused by any table; retained for future verification-state columns.
- **Partial unique index for idempotency:** verify generated `drizzle-kit` SQL and hand-tune the migration if the `WHERE` clause is omitted.
- **Reference-number collisions:** the unique constraint rejects duplicates; the backend retry logic must run inside the submission transaction after acquiring the row lock.
- **No soft deletes in MVP:** `onDelete: "cascade"` is intentional and meant for data-retention operations only.
