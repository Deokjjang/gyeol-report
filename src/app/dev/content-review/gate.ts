import "server-only";

// No query/cookie/header flag can override the deployment or host restrictions.
export function manualReviewAllowed(request: Request): boolean {
  if (process.env.NODE_ENV !== "development" && process.env.NODE_ENV !== "test") return false;
  if (process.env.VERCEL || process.env.CI) return false;
  const host = request.headers.get("host");
  if (!host || !/^(?:localhost|127\.0\.0\.1|\[::1\])(?::\d{1,5})?$/.test(host)) return false;
  if (request.method !== "GET" && request.method !== "HEAD") {
    const origin = request.headers.get("origin");
    if (origin !== `http://${host}` && origin !== `https://${host}`) return false;
  }
  return true;
}
