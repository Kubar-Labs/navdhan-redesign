/**
 * In-memory repository for the /apply portal.
 *
 * This is a GREEN-phase stub that mirrors the tables in
 * `.opencode/factory/db-schema.yaml` v1.1.0.  Production swaps it for a
 * PostgreSQL-backed implementation.
 */

import { randomUUID, randomBytes, createHash } from "node:crypto";

export type ApplicationStatus = "draft" | "submitted" | "declined" | "expired";

export interface ApplicationRow {
  id: string;
  sessionId: string;
  status: ApplicationStatus;
  currentStep: string;
  referenceNumber: string | null;
  loanAmount: number | null;
  tenureMonths: number | null;
  purpose: string | null;
  referralCode: string | null;
  gstinSkipped: boolean;
  perfiosTransactionId: string | null;
  submittedAt: string | null;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
}

export interface ApplicantRow {
  applicationId: string;
  fullName: string | null;
  mobileNumber: string | null;
  mobileLastFour: string | null;
  email: string | null;
  businessPinCode: string | null;
  aadhaarHash: string | null;
  aadhaarLastFour: string | null;
  aadhaarVerified: boolean;
  aadhaarVerifiedAt: string | null;
  panHash: string | null;
  panNumber: string | null;
  panMasked: string | null;
  panVerified: boolean;
  panVerifiedAt: string | null;
  gstin: string | null;
  createdAt: string;
  updatedAt: string;
}

export type DocumentType = "itr" | "bank_statement" | "gst_return" | "other";
export type DocumentStatus = "pending" | "uploaded" | "scanned" | "failed";
export type ScanResult = "clean" | "infected" | "unreadable";

export interface DocumentRow {
  id: string;
  applicationId: string;
  documentType: DocumentType;
  fileName: string;
  mimeType: string;
  storagePath: string;
  encryptionKeyId: string;
  fileSizeBytes: number;
  status: DocumentStatus;
  scanResult: ScanResult | null;
  financialYear: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ConsentStep =
  | "aadhaar_verification"
  | "itr_upload"
  | "bank_statements"
  | "review_submit";

export interface ConsentRow {
  id: string;
  applicationId: string;
  stepId: ConsentStep;
  consentKey: string;
  accepted: boolean;
  statementSnapshot: string;
  locale: string;
  clientIpHash: string;
  userAgentHash: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OtpAttemptRow {
  id: string;
  applicationId: string;
  channel: string;
  destinationHash: string;
  otpReferenceId: string;
  purpose: string;
  expiresAt: string;
  verified: boolean;
  attemptCount: number;
  createdAt: string;
  updatedAt: string;
}

export type PerfiosStatus = "pending" | "success" | "failure" | "partial";

export interface PerfiosTransactionRow {
  perfiosTransactionId: string;
  applicationId: string;
  status: PerfiosStatus;
  statementCount: number | null;
  monthCount: number | null;
  failureReason: string | null;
  monthsRequested: number;
  preferredBank: string | null;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export type OfferStatus = "eligible" | "selected" | "expired" | "rejected";

export interface LenderOfferRow {
  id: string;
  applicationId: string;
  lenderName: string;
  lenderLogoUrl: string | null;
  loanAmount: number;
  interestRateAnnual: number;
  tenureMonths: number;
  emiAmount: number;
  totalInterest: number;
  processingFee: number;
  netDisbursal: number;
  status: OfferStatus;
  expiresAt: string | null;
  selectedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationEventRow {
  id: number;
  applicationId: string;
  eventType: string;
  stepId: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface IdempotencyRecord {
  id: string;
  keyHash: string;
  scope: string;
  requestPath: string;
  payloadHash: string;
  responseStatus: number;
  responseBody: unknown;
  createdAt: string;
  expiresAt: string;
}

function nowIso(): string {
  return new Date().toISOString();
}

function futureIso(minutes: number): string {
  return new Date(Date.now() + minutes * 60 * 1000).toISOString();
}

export function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

export function generateReferenceNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const entropy = randomBytes(4).toString("hex").slice(0, 6).toUpperCase();
  return `NDH-${date}-${entropy}`;
}

export class MemoryRepository {
  private applications = new Map<string, ApplicationRow>();
  private applicationsBySession = new Map<string, string>();
  private applicants = new Map<string, ApplicantRow>();
  private documents = new Map<string, DocumentRow>();
  private consents: ConsentRow[] = [];
  private otpAttempts = new Map<string, OtpAttemptRow>();
  private perfiosTransactions = new Map<string, PerfiosTransactionRow>();
  private offers: LenderOfferRow[] = [];
  private events: ApplicationEventRow[] = [];
  private idempotency = new Map<string, IdempotencyRecord>();
  private eventId = 0;

  private expiryMinutes = 30;

  getApplicationBySession(sessionId: string): ApplicationRow | undefined {
    const id = this.applicationsBySession.get(sessionId);
    if (!id) return undefined;
    return this.applications.get(id);
  }

  getApplicationById(id: string): ApplicationRow | undefined {
    return this.applications.get(id);
  }

  createApplication(sessionId: string): ApplicationRow {
    const now = nowIso();
    const app: ApplicationRow = {
      id: randomUUID(),
      sessionId,
      status: "draft",
      currentStep: "loan_intent",
      referenceNumber: null,
      loanAmount: null,
      tenureMonths: null,
      purpose: null,
      referralCode: null,
      gstinSkipped: false,
      perfiosTransactionId: null,
      submittedAt: null,
      createdAt: now,
      updatedAt: now,
      expiresAt: futureIso(this.expiryMinutes),
    };
    this.applications.set(app.id, app);
    this.applicationsBySession.set(sessionId, app.id);
    this.createApplicant(app.id);
    return app;
  }

  getOrCreateApplication(sessionId: string): ApplicationRow {
    return this.getApplicationBySession(sessionId) ?? this.createApplication(sessionId);
  }

  updateApplication(
    id: string,
    patch: Partial<Omit<ApplicationRow, "id" | "createdAt">>,
  ): ApplicationRow | undefined {
    const app = this.applications.get(id);
    if (!app) return undefined;
    Object.assign(app, patch, { updatedAt: nowIso() });
    return app;
  }

  touchApplication(id: string): void {
    const app = this.applications.get(id);
    if (!app) return;
    app.updatedAt = nowIso();
    app.expiresAt = futureIso(this.expiryMinutes);
  }

  private createApplicant(applicationId: string): ApplicantRow {
    const now = nowIso();
    const applicant: ApplicantRow = {
      applicationId,
      fullName: null,
      mobileNumber: null,
      mobileLastFour: null,
      email: null,
      businessPinCode: null,
      aadhaarHash: null,
      aadhaarLastFour: null,
      aadhaarVerified: false,
      aadhaarVerifiedAt: null,
      panHash: null,
      panNumber: null,
      panMasked: null,
      panVerified: false,
      panVerifiedAt: null,
      gstin: null,
      createdAt: now,
      updatedAt: now,
    };
    this.applicants.set(applicationId, applicant);
    return applicant;
  }

  getApplicant(applicationId: string): ApplicantRow | undefined {
    return this.applicants.get(applicationId);
  }

  getOrCreateApplicant(applicationId: string): ApplicantRow {
    return this.getApplicant(applicationId) ?? this.createApplicant(applicationId);
  }

  updateApplicant(
    applicationId: string,
    patch: Partial<Omit<ApplicantRow, "applicationId" | "createdAt">>,
  ): ApplicantRow | undefined {
    const applicant = this.applicants.get(applicationId);
    if (!applicant) return undefined;
    Object.assign(applicant, patch, { updatedAt: nowIso() });
    return applicant;
  }

  createDocument(fields: Omit<DocumentRow, "id" | "createdAt" | "updatedAt">): DocumentRow {
    const now = nowIso();
    const doc: DocumentRow = {
      id: randomUUID(),
      ...fields,
      createdAt: now,
      updatedAt: now,
    };
    this.documents.set(doc.id, doc);
    return doc;
  }

  getDocument(id: string): DocumentRow | undefined {
    return this.documents.get(id);
  }

  getDocumentsByApplication(applicationId: string): DocumentRow[] {
    return Array.from(this.documents.values()).filter((d) => d.applicationId === applicationId);
  }

  createConsent(fields: Omit<ConsentRow, "id" | "createdAt" | "updatedAt">): ConsentRow {
    const now = nowIso();
    const consent: ConsentRow = {
      id: randomUUID(),
      ...fields,
      createdAt: now,
      updatedAt: now,
    };
    this.consents.push(consent);
    return consent;
  }

  getConsents(applicationId: string): ConsentRow[] {
    return this.consents.filter((c) => c.applicationId === applicationId);
  }

  createOtpAttempt(
    fields: Omit<OtpAttemptRow, "id" | "createdAt" | "updatedAt" | "verified" | "attemptCount">,
  ): OtpAttemptRow {
    const now = nowIso();
    const attempt: OtpAttemptRow = {
      id: randomUUID(),
      ...fields,
      verified: false,
      attemptCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    this.otpAttempts.set(attempt.otpReferenceId, attempt);
    return attempt;
  }

  getOtpAttempt(otpReferenceId: string): OtpAttemptRow | undefined {
    return this.otpAttempts.get(otpReferenceId);
  }

  updateOtpAttempt(
    otpReferenceId: string,
    patch: Partial<Omit<OtpAttemptRow, "id" | "otpReferenceId" | "createdAt">>,
  ): OtpAttemptRow | undefined {
    const attempt = this.otpAttempts.get(otpReferenceId);
    if (!attempt) return undefined;
    Object.assign(attempt, patch, { updatedAt: nowIso() });
    return attempt;
  }

  createPerfiosTransaction(
    fields: Omit<PerfiosTransactionRow, "createdAt" | "updatedAt">,
  ): PerfiosTransactionRow {
    const now = nowIso();
    const txn: PerfiosTransactionRow = {
      ...fields,
      createdAt: now,
      updatedAt: now,
    };
    this.perfiosTransactions.set(txn.perfiosTransactionId, txn);
    return txn;
  }

  getPerfiosTransaction(perfiosTransactionId: string): PerfiosTransactionRow | undefined {
    return this.perfiosTransactions.get(perfiosTransactionId);
  }

  updatePerfiosTransaction(
    perfiosTransactionId: string,
    patch: Partial<Omit<PerfiosTransactionRow, "perfiosTransactionId" | "createdAt">>,
  ): PerfiosTransactionRow | undefined {
    const txn = this.perfiosTransactions.get(perfiosTransactionId);
    if (!txn) return undefined;
    Object.assign(txn, patch, { updatedAt: nowIso() });
    return txn;
  }

  createOffer(fields: Omit<LenderOfferRow, "id" | "createdAt" | "updatedAt">): LenderOfferRow {
    const now = nowIso();
    const offer: LenderOfferRow = {
      id: randomUUID(),
      ...fields,
      createdAt: now,
      updatedAt: now,
    };
    this.offers.push(offer);
    return offer;
  }

  getOffers(applicationId: string): LenderOfferRow[] {
    return this.offers.filter((o) => o.applicationId === applicationId);
  }

  createEvent(fields: Omit<ApplicationEventRow, "id" | "createdAt">): ApplicationEventRow {
    this.eventId += 1;
    const event: ApplicationEventRow = {
      id: this.eventId,
      ...fields,
      createdAt: nowIso(),
    };
    this.events.push(event);
    return event;
  }

  getIdempotencyRecord(scope: string, keyHash: string): IdempotencyRecord | undefined {
    const record = this.idempotency.get(`${scope}:${keyHash}`);
    if (!record) return undefined;
    if (new Date(record.expiresAt) <= new Date()) {
      this.idempotency.delete(`${scope}:${keyHash}`);
      return undefined;
    }
    return record;
  }

  createIdempotencyRecord(record: Omit<IdempotencyRecord, "id" | "createdAt">): IdempotencyRecord {
    const full: IdempotencyRecord = {
      id: randomUUID(),
      ...record,
      createdAt: nowIso(),
    };
    this.idempotency.set(`${record.scope}:${record.keyHash}`, full);
    return full;
  }
}

export const applyRepository = new MemoryRepository();
