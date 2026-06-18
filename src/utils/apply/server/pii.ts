/**
 * PII masking and hashing helpers.
 *
 * Full PII is never logged or echoed; only masked or hashed forms are used.
 */

import { createHash } from "node:crypto";

export function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

export function lastFour(value: string): string {
  return value.slice(-4);
}

export function maskMobile(mobile: string | null): string | null {
  if (!mobile || mobile.length < 4) return null;
  return `91-XXXXXX${lastFour(mobile)}`;
}

export function maskAadhaar(aadhaar: string | null): string | null {
  if (!aadhaar || aadhaar.length < 4) return null;
  return `XXXX XXXX ${lastFour(aadhaar)}`;
}

export function maskPan(pan: string | null): string | null {
  if (!pan || pan.length !== 10) return pan;
  return `${pan.slice(0, 3)}XX***${pan.slice(-1)}`;
}

export function hashAndLastFour(value: string): {
  hash: string;
  lastFour: string;
} {
  return { hash: sha256(value), lastFour: lastFour(value) };
}
