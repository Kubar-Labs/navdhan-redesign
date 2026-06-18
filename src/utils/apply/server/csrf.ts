/**
 * CSRF protection: custom header required on every mutating request.
 */

export function validateCsrf(req: Request): boolean {
  return req.headers.get("x-navdhan-requested-with") === "apply";
}
