/**
 * 「남이 본 나」 공개 관문(명령 1/3). 로컬 개발(next dev, NODE_ENV=development)에서만 열린다.
 * 배포 빌드(Vercel Production · Preview, next start)에서는 닫혀 새 화면 · API · "/" 전환이 모두 없는 것과 같다.
 * 요청 값(쿼리 · 쿠키 · 헤더)이나 환경 변수로 열 수 없다. 출시 명령(3/3)에서 true로 바꾼다.
 */
export function mirrorPublicEnabled(): boolean {
  return process.env.NODE_ENV === "development";
}
