/**
 * 「남이 본 나」 로컬 시험 모드(pnpm mirror:trial): 맥 로컬 배포 빌드(next start)를 Cloudflare 빠른 터널 + 앱 밖 기본 인증(Caddy)으로 열어 맥 · 폰에서 써 본다.
 * 세 조건이 모두 참일 때만 켜진다 — (a) MIRROR_LOCAL_TRIAL=1 (b) Supabase 주소가 로컬(127.0.0.1 · localhost) (c) Vercel 위가 아님(VERCEL · VERCEL_ENV 없음).
 * 켜졌을 때만: 두 공개 관문 열기(gate.ts) · 검수용 로그인(/dev/v5-login) · 터널 주소 한 개를 출처로 받기(account/origin.ts · ops/origin.ts) · 링크 · 카드 주소를 터널 주소로.
 * Vercel(Production · Preview)은 VERCEL을 늘 넣고 Supabase가 운영 주소라 어떤 값을 넣어도 켜지지 않는다(tests/unit/mirror/trial.test.ts).
 */
type Env = Readonly<Record<string, string | undefined>>;
const LOCAL_SUPABASE = /^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?\/?$/;
/** 터널 주소는 Cloudflare 빠른 터널 꼴 하나만(https, 하위 도메인 한 단계). */
const TUNNEL_ORIGIN = /^https:\/\/[a-z0-9-]+\.trycloudflare\.com$/;

export function mirrorTrialMode(env: Env = process.env): boolean {
  return env.MIRROR_LOCAL_TRIAL === "1" && LOCAL_SUPABASE.test(env.NEXT_PUBLIC_SUPABASE_URL ?? "") && env.VERCEL === undefined && env.VERCEL_ENV === undefined;
}
/** 시험 모드일 때 받을 터널 주소(MIRROR_TRIAL_ORIGIN). 꺼져 있거나 꼴이 다르면 null. */
export function mirrorTrialOrigin(env: Env = process.env): string | null {
  const origin = env.MIRROR_TRIAL_ORIGIN ?? "";
  return mirrorTrialMode(env) && TUNNEL_ORIGIN.test(origin) ? origin : null;
}
/**
 * 이 요청이 터널 주소로 들어왔으면 그 주소. next start는 request.url을 묶인 주소(localhost)로 만들므로 Host 헤더(터널 → Caddy가 그대로 넘김)로 본다.
 * 브라우저 Origin과의 비교는 부르는 쪽(기존 같은 출처 검사)이 그대로 한다.
 */
export function mirrorTrialRequestOrigin(request: Request, env: Env = process.env): string | null {
  const origin = mirrorTrialOrigin(env);
  return origin && request.headers.get("host") === new URL(origin).host ? origin : null;
}

/** 로그인 화면의 시험 계정 고르기(시험 모드 주소에서만 보인다). as는 /dev/v5-login?as= 값(p6e-<as>@gyeol.local), "new"는 매번 새 계정. next가 있으면 그리로(기존 회원은 내 계정 → 서재). */
export const MIRROR_TRIAL_ACCOUNTS: readonly { as: string; label: string; next?: string }[] = [
  { as: "new", label: "새 계정으로 처음부터" },
  { as: "t0", label: "친구 0명" },
  { as: "t5", label: "친구 5명" },
  { as: "t40", label: "친구 40명" },
  { as: "t100", label: "친구 100명" },
  { as: "cust", label: "책 있는 기존 회원(아이디 없음)", next: "/me" },
];
/** 브라우저: 시험 모드 터널 주소에서 열렸는가(고르기 화면을 보일지). 실제 허용은 서버(/dev/v5-login)가 정한다. */
export const onTrialHost = (hostname: string): boolean => hostname.endsWith(".trycloudflare.com");
