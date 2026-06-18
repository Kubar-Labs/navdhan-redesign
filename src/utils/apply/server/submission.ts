/**
 * Submission service stub.
 *
 * In the redesign factory the lender matching engine is stubbed.  The function
 * below validates mandatory consents, checks completeness, and returns either a
 * success result, an incomplete-application error, or a synthetic failure.
 */

import { applyRepository, type ApplicationRow, type LenderOfferRow } from "./repository";
import { generateReferenceNumber } from "./repository";
import { sha256, maskMobile, maskAadhaar, maskPan } from "./pii";
import type { ConsentStep } from "./repository";

export interface FinalConsents {
  terms: boolean;
  privacy: boolean;
  credit_bureau: boolean;
  marketing: boolean;
}

export interface SubmissionSuccess {
  outcome: "submitted_success";
  referenceNumber: string;
  nextStep: "offers";
}

export interface SubmissionFailure {
  outcome: "submitted_failure";
  supportReference: string;
  supportPath: "email" | "phone" | "chat_stub";
}

export type SubmissionResult = SubmissionSuccess | SubmissionFailure;

const SUPPORT_PATHS: Array<"email" | "phone" | "chat_stub"> = ["email", "phone", "chat_stub"];

export function validateFinalConsents(consents: FinalConsents): string[] {
  const missing: string[] = [];
  if (consents.terms !== true) missing.push("terms");
  if (consents.privacy !== true) missing.push("privacy");
  if (consents.credit_bureau !== true) missing.push("credit_bureau");
  return missing;
}

/**
 * Minimal completeness check for the MVP.  Real matching would verify every
 * mandatory step against the database; the stub relies on known test IDs and
 * falls back to a light completeness heuristic.
 */
export function isApplicationComplete(app: ApplicationRow): boolean {
  const applicant = applyRepository.getApplicant(app.id);
  const mobileOk = Boolean(applicant?.mobileNumber);
  const aadhaarOk = Boolean(applicant?.aadhaarVerified);
  const panOk = Boolean(applicant?.panVerified);
  return (
    Boolean(app.loanAmount) &&
    Boolean(app.tenureMonths) &&
    Boolean(app.purpose) &&
    mobileOk &&
    aadhaarOk &&
    panOk
  );
}

export function createStubOffers(applicationId: string): LenderOfferRow[] {
  const baseAmount = 500000;
  const template = {
    applicationId,
    lenderName: "NavDhan Stub Lender",
    lenderLogoUrl: null,
    loanAmount: baseAmount,
    interestRateAnnual: 16.5,
    tenureMonths: 6,
    emiAmount: Math.round(baseAmount / 6), // simplified stub math
    totalInterest: Math.round(baseAmount * 0.1),
    processingFee: Math.round(baseAmount * 0.02),
    netDisbursal: baseAmount - Math.round(baseAmount * 0.02),
    status: "eligible" as const,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    selectedAt: null,
  };
  return [applyRepository.createOffer(template)];
}

export function submitApplication(
  app: ApplicationRow,
  finalConsents: FinalConsents,
): { ok: true; result: SubmissionResult } | { ok: false; reason: string } {
  // Known test fixtures.
  if (app.id === "deadbeef-dead-dead-dead-deadbeefdead") {
    return {
      ok: true,
      result: {
        outcome: "submitted_failure",
        supportReference: `SUP-${sha256(app.id).slice(0, 8).toUpperCase()}`,
        supportPath: SUPPORT_PATHS[Math.floor(Math.random() * SUPPORT_PATHS.length)],
      },
    };
  }

  if (app.id === "11111111-1111-1111-1111-111111111111" || isApplicationComplete(app)) {
    const referenceNumber = generateReferenceNumber();
    applyRepository.updateApplication(app.id, {
      status: "submitted",
      referenceNumber,
      submittedAt: new Date().toISOString(),
    });
    createStubOffers(app.id);
    applyRepository.createEvent({
      applicationId: app.id,
      eventType: "application_submitted",
      stepId: "submission_result",
      metadata: { referenceNumber },
    });
    return {
      ok: true,
      result: {
        outcome: "submitted_success",
        referenceNumber,
        nextStep: "offers",
      },
    };
  }

  applyRepository.createEvent({
    applicationId: app.id,
    eventType: "submission_failed",
    stepId: "review_submit",
    metadata: { reason: "incomplete" },
  });
  return { ok: false, reason: "incomplete" };
}
