/**
 * Wizard state machine.
 *
 * Linear step progression with one deliberate skip (gst_verification).
 */

import type { FieldError } from "./validation";
import {
  validateLoanAmount,
  validateTenureMonths,
  validatePurpose,
  validateReferralCode,
  validateFullName,
  validateMobileNumber,
  validateEmail,
  validateBusinessPinCode,
  validateAadhaarNumber,
  validateAadhaarOtp,
  validatePanNumber,
  validateGstin,
} from "./validation";

export const STEP_ORDER = [
  "loan_intent",
  "personal_contact",
  "aadhaar_verification",
  "pan_verification",
  "gst_verification",
  "itr_upload",
  "bank_statements",
  "review_submit",
  "submission_result",
] as const;

export type ApplicationStep = (typeof STEP_ORDER)[number];

export const EDITABLE_STEPS = STEP_ORDER.filter((s) => s !== "submission_result");

export function getNextStep(
  currentStep: ApplicationStep,
  payload?: Record<string, unknown>,
): ApplicationStep | null {
  const idx = STEP_ORDER.indexOf(currentStep);
  if (idx < 0) return null;
  if (currentStep === "gst_verification") {
    if (payload?.gstin_skipped === true) return "itr_upload";
  }
  if (currentStep === "review_submit") return "submission_result";
  return STEP_ORDER[idx + 1] ?? null;
}

export function isValidStep(step: string): step is ApplicationStep {
  return STEP_ORDER.includes(step as ApplicationStep);
}

function fieldError(field: string, key: string, params?: Record<string, unknown>): FieldError {
  return { field, message_i18n_key: key, params };
}

export function validateStepPayload(
  step: ApplicationStep,
  payload: Record<string, unknown>,
): FieldError[] {
  const errors: FieldError[] = [];

  switch (step) {
    case "loan_intent": {
      if (!validateLoanAmount(payload.loan_amount)) {
        errors.push(
          fieldError("loan_amount", "apply.errors.invalidAmount", {
            min: 500000,
            max: 10000000,
            multiple: 10000,
          }),
        );
      }
      if (!validateTenureMonths(payload.tenure_months)) {
        errors.push(fieldError("tenure_months", "apply.errors.invalidTenure"));
      }
      if (!validatePurpose(payload.purpose)) {
        errors.push(fieldError("purpose", "apply.errors.requiredField"));
      }
      if (
        "referral_code" in payload &&
        payload.referral_code !== null &&
        payload.referral_code !== undefined &&
        !validateReferralCode(payload.referral_code)
      ) {
        errors.push(fieldError("referral_code", "apply.errors.requiredField"));
      }
      break;
    }

    case "personal_contact": {
      if (!validateFullName(payload.full_name)) {
        errors.push(fieldError("full_name", "apply.errors.requiredField"));
      }
      if (!validateMobileNumber(payload.mobile_number)) {
        errors.push(fieldError("mobile_number", "apply.errors.invalidMobile"));
      }
      if (!validateEmail(payload.email)) {
        errors.push(fieldError("email", "apply.errors.invalidEmail"));
      }
      if (!validateBusinessPinCode(payload.business_pin_code)) {
        errors.push(fieldError("business_pin_code", "apply.errors.invalidPinCode"));
      }
      break;
    }

    case "aadhaar_verification": {
      if (!validateAadhaarNumber(payload.aadhaar_number)) {
        errors.push(fieldError("aadhaar_number", "apply.errors.invalidAadhaar"));
      }
      if (!validateAadhaarOtp(payload.aadhaar_otp)) {
        errors.push(fieldError("aadhaar_otp", "apply.errors.invalidOtp"));
      }
      break;
    }

    case "pan_verification": {
      if (!validatePanNumber(payload.pan_number)) {
        errors.push(fieldError("pan_number", "apply.errors.invalidPan"));
      }
      break;
    }

    case "gst_verification": {
      const skipped = payload.gstin_skipped === true;
      if (!skipped && !validateGstin(payload.gstin ?? null)) {
        errors.push(fieldError("gstin", "apply.errors.invalidGstin"));
      }
      break;
    }

    case "itr_upload": {
      if (typeof payload.itr_document_id !== "string" || !payload.itr_document_id) {
        errors.push(fieldError("itr_document_id", "apply.errors.requiredField"));
      }
      break;
    }

    case "bank_statements": {
      if (typeof payload.perfios_transaction_id !== "string" || !payload.perfios_transaction_id) {
        errors.push(fieldError("perfios_transaction_id", "apply.errors.requiredField"));
      }
      if (
        typeof payload.statement_months !== "number" ||
        payload.statement_months < 6 ||
        payload.statement_months > 12
      ) {
        errors.push(fieldError("statement_months", "apply.errors.requiredField"));
      }
      break;
    }

    case "review_submit": {
      const consents = ["consent_terms", "consent_privacy", "consent_credit_bureau"];
      for (const key of consents) {
        if (payload[key] !== true) {
          errors.push(fieldError(key, "apply.errors.requiredField"));
        }
      }
      break;
    }

    default:
      break;
  }

  return errors;
}
