/** 로컬 개발 전용 테스트 계정(P3 G). 로컬 Supabase(`pnpm db:v5`)에만 있다. 운영과 무관. */
export const LOCAL_DEV_ACCOUNT = { email: "v5-dev@gyeol.local", password: "local-dev-only-password" } as const;
/** next dev이고 Supabase 주소가 로컬일 때만 참. */
export function localDevAuthAllowed(env: Readonly<Record<string, string | undefined>> = process.env): boolean {
  return env.NODE_ENV === "development" && /^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?\/?$/.test(env.NEXT_PUBLIC_SUPABASE_URL ?? "");
}
