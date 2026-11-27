/**
 * 「남이 본 나」 공개 관문 두 개(명령 3/3).
 *  - mirrorRoutesEnabled(): 새 주소를 연다 — /@아이디, 새 시작 주소 /start, /api/mirror/*, 새 내 계정(/me). 「숨은 공개」 = 이것만 true.
 *  - mirrorRootEnabled(): "/"를 이 서비스로 바꾼다(기존 책 홈은 /products, /start · /account는 새 화면으로). 「정식 공개」 = 둘 다 true.
 * 로컬 개발(next dev, NODE_ENV=development)에서는 둘 다 열린다. 배포 빌드(Vercel Production · Preview, next start)는 아래 상수만 따른다.
 * 요청 값(쿼리 · 쿠키 · 헤더)이나 환경 변수로 열 수 없다 — 바꾸려면 상수를 고친 커밋을 배포한다.
 */
export const MIRROR_ROUTES_LIVE: boolean = false;
export const MIRROR_ROOT_LIVE: boolean = false;

const dev = () => process.env.NODE_ENV === "development";
export function mirrorRoutesEnabled(): boolean {
  return dev() || MIRROR_ROUTES_LIVE;
}
/** 정식 공개는 새 주소가 열려 있을 때만 의미가 있다(root만 켜고 routes를 끄는 실수를 막는다). */
export function mirrorRootEnabled(): boolean {
  return dev() || (MIRROR_ROUTES_LIVE && MIRROR_ROOT_LIVE);
}
/** 이 서비스의 시작 주소: 정식 공개 뒤 "/", 그 전(숨은 공개 · 로컬 확인)은 "/start". */
export const mirrorAppPath = (): "/" | "/start" => (mirrorRootEnabled() ? "/" : "/start");
/**
 * 기존 서재(/account) → 새 내 계정(/me)(명령 3 추가 지시 3). 서재 기능 대조(기능 / 기존 위치 / 새 위치 / 확인 방법)에서 빠진 것 0을 확인하고(2026-11-28, scripts/dev/mirror-launch-check.ts me · existing) true로 뒀다.
 * true여도 root 관문(정식 공개)이 열려 있을 때만 보낸다 — 숨은 공개에서는 /account가 지금 그대로다. 동의 · 가입 정보가 남은 회원도 /me가 받는다.
 */
export const ACCOUNT_MOVED_TO_ME: boolean = true;
export const accountMovedToMe = (): boolean => ACCOUNT_MOVED_TO_ME && mirrorRootEnabled();
