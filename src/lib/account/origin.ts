// Exact browser origins only. No suffix matching, forwarded-host trust or
// localhost/preview escape hatch on public account and purchase endpoints.
export function isPublicOrigin(value: string | null): boolean {
  return value === "https://gyeolreport.com" || value === "https://www.gyeolreport.com";
}
export function publicRequestOrigin(request: Request): string | null {
  const origin = new URL(request.url).origin;
  return isPublicOrigin(origin) ? origin : null;
}
export function isPublicSameOrigin(request: Request): boolean {
  const origin = publicRequestOrigin(request);
  return origin !== null && request.headers.get("origin") === origin;
}
