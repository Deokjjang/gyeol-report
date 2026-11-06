import { isPublicSameOrigin } from "../account/origin";
import { localDevAuthAllowed } from "../account/localDevAccount";

/**
 * P6d-ops 새 엔드포인트(가입 정보·문의·선물·탈퇴·관리자)의 출처 검사. 운영은 기존과 같이 운영 도메인 같은 출처만.
 * next dev + 로컬 Supabase일 때만(localDevAuthAllowed) localhost 같은 출처도 받는다(로컬 E2E). 운영 빌드에서는 NODE_ENV가 production이라 열리지 않는다.
 */
export function opsSameOrigin(request: Request, env: Readonly<Record<string, string | undefined>> = process.env): boolean {
  if (isPublicSameOrigin(request)) return true;
  if (!localDevAuthAllowed(env)) return false;
  const origin = new URL(request.url).origin;
  return /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin) && request.headers.get("origin") === origin;
}
/** GET(읽기)용: 운영 도메인 또는 로컬 개발. */
export function opsOriginAllowed(request: Request, env: Readonly<Record<string, string | undefined>> = process.env): boolean {
  const origin = new URL(request.url).origin;
  return origin === "https://gyeolreport.com" || origin === "https://www.gyeolreport.com" || (localDevAuthAllowed(env) && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin));
}
