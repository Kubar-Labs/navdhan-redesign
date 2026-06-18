/**
 * Small helpers for building structured JSON responses.
 */

export function jsonResponse(body: unknown, status: number, init?: ResponseInit): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });
}

export function errorResponse(
  status: number,
  error: string,
  extra?: Record<string, unknown>,
): Response {
  return jsonResponse({ error, ...extra }, status);
}
