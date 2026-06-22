/**
 * PII masking helpers.
 *
 * Never log or return full Aadhaar, PAN, or mobile numbers.
 */

export function maskMobileNumber(mobile: string | null): string {
  if (!mobile || mobile.length < 4) return "91-XXXXXX****";
  const lastFour = mobile.slice(-4);
  return `91-XXXXXX${lastFour}`;
}

export function maskAadhaarNumber(aadhaar: string | null): string {
  if (!aadhaar || aadhaar.length < 4) return "XXXX XXXX ****";
  const lastFour = aadhaar.slice(-4);
  return `XXXX XXXX ${lastFour}`;
}

export function maskPanNumber(pan: string | null): string {
  if (!pan || pan.length !== 10) return "XXXXX****X";
  return `${pan.slice(0, 3)}XX***X`;
}

export function redact(value: string | null | undefined): string {
  if (!value) return "[REDACTED]";
  return "[REDACTED]";
}
