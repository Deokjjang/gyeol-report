// Exact browser origins only. No suffix matching, forwarded-host trust or
// preview escape hatch on public account and purchase endpoints.
// P6d-ops: 로컬 E2E만 예외 — next dev(NODE_ENV=development)이고 Supabase가 로컬일 때 localhost 출처를 받는다(/dev/v5-login과 같은 조건).
// 운영 빌드(NODE_ENV=production)와 시험(NODE_ENV=test)에서는 열리지 않는다.
export function isPublicOrigin(value: string | null): boolean {
  return value === "https://gyeolreport.com" || value === "https://www.gyeolreport.com";
}
function isLocalDevOrigin(value: string, env: Readonly<Record<string, string | undefined>> = process.env): boolean {
  return env.NODE_ENV === "development" && /^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?\/?$/.test(env.NEXT_PUBLIC_SUPABASE_URL ?? "") && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(value);
}
export function publicRequestOrigin(request: Request): string | null {
  const origin = new URL(request.url).origin;
  return isPublicOrigin(origin) || isLocalDevOrigin(origin) ? origin : null;
}
export function isPublicSameOrigin(request: Request): boolean {
  const origin = publicRequestOrigin(request);
  return origin !== null && request.headers.get("origin") === origin;
}
