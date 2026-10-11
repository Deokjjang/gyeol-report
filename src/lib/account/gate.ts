import "server-only";

// Independent from Book activation. No env/cookie/query/client override.
// Approved direct-sales release; OAuth configuration is a deployment prerequisite.
export function accountPublicEnabled(): boolean { return true; }
export function localAccountAllowed(request: Request): boolean {
  if (process.env.NODE_ENV !== "development") return false;
  const url = new URL(request.url), host = request.headers.get("host");
  if (host) url.host = host;
  return ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
}
