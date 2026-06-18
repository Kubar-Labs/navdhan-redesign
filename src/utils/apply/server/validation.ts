/**
 * Shared field validators for the /apply portal.
 *
 * Mirrors the rules in `.opencode/factory/apply-contract.yaml` v1.1.0.
 */

const PURPOSES = new Set([
  "working_capital",
  "machinery",
  "inventory",
  "business_expansion",
  "debt_refinancing",
  "other",
]);

export function validateLoanAmount(amount: unknown): boolean {
  if (typeof amount !== "number" || !Number.isFinite(amount)) return false;
  if (!Number.isInteger(amount)) return false;
  return amount >= 500000 && amount <= 10000000 && amount % 10000 === 0;
}

export function validateTenureMonths(months: unknown): boolean {
  if (typeof months !== "number" || !Number.isFinite(months)) return false;
  if (!Number.isInteger(months)) return false;
  return months >= 3 && months <= 12;
}

export function validatePurpose(purpose: unknown): boolean {
  return typeof purpose === "string" && PURPOSES.has(purpose);
}

export function validateReferralCode(code: unknown): boolean {
  if (code === null) return true;
  if (typeof code !== "string") return false;
  return code.length <= 20 && /^[A-Za-z0-9_-]+$/.test(code);
}

export function validateFullName(name: unknown): boolean {
  if (typeof name !== "string") return false;
  return name.length >= 2 && name.length <= 150 && /^[A-Za-z\s'.-]+$/.test(name);
}

export function validateMobileNumber(mobile: unknown): boolean {
  if (typeof mobile !== "string") return false;
  return /^[6-9][0-9]{9}$/.test(mobile);
}

export function validateEmail(email: unknown): boolean {
  if (typeof email !== "string") return false;
  if (email.length > 255) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateBusinessPinCode(pin: unknown): boolean {
  if (typeof pin !== "string") return false;
  return /^[1-9][0-9]{5}$/.test(pin);
}

export function validateAadhaarNumber(aadhaar: unknown): boolean {
  if (typeof aadhaar !== "string") return false;
  return /^[0-9]{12}$/.test(aadhaar);
}

export function validateAadhaarOtp(otp: unknown): boolean {
  if (typeof otp !== "string") return false;
  return /^[0-9]{6}$/.test(otp);
}

export function validatePanNumber(pan: unknown): boolean {
  if (typeof pan !== "string") return false;
  return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan);
}

export function validateGstin(gstin: unknown): boolean {
  if (gstin === null) return true;
  if (typeof gstin !== "string") return false;
  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(gstin);
}

export interface FieldError {
  field: string;
  message_i18n_key: string;
  params?: Record<string, unknown>;
}
