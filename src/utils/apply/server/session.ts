/**
 * Session cookie handling.
 *
 * The portal uses the __Host-nd_session encrypted HTTP-only cookie.
 * In the stub we read the raw value from the Cookie header; the repository
 * stores a hash of the value, never the value itself.
 */

export function getSessionId(req: Request): string | null {
  const cookieHeader = req.headers.get("cookie") ?? "";
  const match = cookieHeader.match(/__Host-nd_session=([^;]+)/);
  return match?.[1] ?? null;
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  // The tests construct plain Request objects without socket info.
  return "unknown";
}
