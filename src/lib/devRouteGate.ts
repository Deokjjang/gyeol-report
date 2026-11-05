/**
 * /dev/* 개발 화면·API의 배포 차단(v5 최종3 배포 차단 위험 3).
 * 배포 빌드(NODE_ENV=production: Vercel Production·Preview, next start)에서는 /dev 아래 모든 주소를 라우트 처리 전에 404로 막는다(src/proxy.ts).
 * 요청 값(쿼리·쿠키·헤더)이나 *_DEV_PREVIEW_ENABLED 같은 환경 설정으로 다시 열 수 없다. 로컬 개발(next dev)은 그대로 각 라우트의 기존 가드가 판단한다.
 * 운영 Book 리더가 쓰는 src/app/dev/book-preview/* 컴포넌트는 import로 쓰이므로 영향이 없다(주소만 막는다).
 */
export function devRoutesBlocked(env: Readonly<Record<string, string | undefined>> = process.env): boolean {
  return env.NODE_ENV === "production";
}

/** pathname이 /dev 또는 /dev/… 인가(proxy matcher "/dev/:path*"와 같은 범위). */
export function isDevPath(pathname: string): boolean {
  return pathname === "/dev" || pathname.startsWith("/dev/");
}
