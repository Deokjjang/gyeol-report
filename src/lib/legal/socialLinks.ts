/**
 * 푸터 소셜 링크·고객 문의 주소(P6e-ops 9, v5 최종 2-2). 주소는 이 파일 한 곳에서 고친다.
 * 푸터 순서: 인스타그램 · 카카오톡 · X · 스레드. X·스레드 주소가 빈 문자열이면 그 아이콘은 보이지 않는다(링크 없는 아이콘을 두지 않는다).
 */
export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/gyeolreport/",
  x: "https://x.com/gyeolreport",
  threads: "https://www.threads.com/@gyeolreport",
} as const;
export const SUPPORT_CHAT_URL = "http://pf.kakao.com/_sbHaX/chat";

/** https 주소만 허용(비어 있거나 다른 형식이면 null → 아이콘 숨김). */
export function safeSocialUrl(value: string): string | null {
  try { const u = new URL(value); return u.protocol === "https:" && u.hostname ? u.toString() : null; } catch { return null; }
}
