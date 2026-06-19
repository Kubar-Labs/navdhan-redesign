import { randomUUID } from "crypto";
import { gateRequest, readJsonBody, jsonResponse } from "@/app/api/apply/lib/helpers";
import { getOtpAttempt } from "@/src/lib/apply/server/store";

const MAX_OTP_ATTEMPTS = 3;

export async function POST(request: Request): Promise<Response> {
  const gate = await gateRequest(request);
  if (!gate.ok) return gate.response;

  const body = await readJsonBody(request);
  if (!body) {
    return jsonResponse({ error: "BAD_REQUEST", message: "Invalid JSON body" }, 400);
  }

  const otp = body.otp;
  if (typeof otp !== "string" || !/^\d{6}$/.test(otp)) {
    return jsonResponse(
      {
        error: "INVALID_OTP",
        message: "OTP must be 6 digits",
        remaining_attempts: MAX_OTP_ATTEMPTS - 1,
      },
      400,
    );
  }

  const referenceId = body.otp_reference_id;
  if (typeof referenceId !== "string") {
    return jsonResponse({ error: "INVALID_REFERENCE", message: "Missing reference id" }, 400);
  }

  const attempt = getOtpAttempt(referenceId);
  if (!attempt) {
    return jsonResponse(
      { error: "INVALID_OTP", message: "Reference not found", remaining_attempts: 0 },
      400,
    );
  }

  attempt.attemptCount += 1;
  const remaining = Math.max(0, MAX_OTP_ATTEMPTS - attempt.attemptCount);

  if (attempt.attemptCount > MAX_OTP_ATTEMPTS) {
    return jsonResponse(
      { error: "OTP_EXPIRED", message: "Too many attempts", remaining_attempts: 0 },
      400,
    );
  }

  attempt.verified = true;

  return jsonResponse({
    verified: true,
    verification_token: randomUUID(),
  });
}
