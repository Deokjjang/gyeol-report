/**
 * 인앱 브라우저 판별(P 추가 A). 인스타그램·페이스북·카카오톡 등 앱 안 브라우저에서는 Google 로그인이 막힌다(Google 정책: disallowed_useragent).
 * 그래서 로그인 화면은 카카오를 먼저 보이고, Google을 누르면 「기본 브라우저로 열기」를 안내한다. 브라우저에서도 쓰는 순수 함수.
 */
export type InAppKind = "kakaotalk" | "instagram" | "facebook" | "naver" | "line" | "daum" | "band" | "webview";
export function inAppBrowser(ua: string): InAppKind | null {
  if (/KAKAOTALK/i.test(ua)) return "kakaotalk";
  if (/Instagram/i.test(ua)) return "instagram";
  if (/FBAN|FBAV|FB_IAB|FBIOS/i.test(ua)) return "facebook";
  if (/NAVER\(inapp/i.test(ua)) return "naver";
  if (/\bLine\//i.test(ua)) return "line";
  if (/DaumApps/i.test(ua)) return "daum";
  if (/BAND\//i.test(ua)) return "band";
  if (/Android.*; wv\)/i.test(ua)) return "webview";
  return null;
}
/** 기본 브라우저로 여는 주소: 카카오톡은 자체 스킴, 안드로이드는 크롬 intent. 아이폰의 다른 앱은 방법이 없어 null(메뉴 안내). */
export function externalBrowserUrl(kind: InAppKind, ua: string, url: string): string | null {
  if (kind === "kakaotalk") return `kakaotalk://web/openExternal?url=${encodeURIComponent(url)}`;
  if (/Android/i.test(ua) && /^https:\/\//.test(url)) return `intent://${url.slice("https://".length)}#Intent;scheme=https;package=com.android.chrome;end`;
  return null;
}
export const IN_APP_MENU_HINT: Readonly<Record<InAppKind, string>> = {
  kakaotalk: "오른쪽 아래 ⋯ 메뉴에서 「다른 브라우저로 열기」를 눌러 주세요.",
  instagram: "오른쪽 위 ⋯ 메뉴에서 「외부 브라우저에서 열기」를 눌러 주세요.",
  facebook: "오른쪽 위 ⋯ 메뉴에서 「외부 브라우저로 열기」를 눌러 주세요.",
  naver: "아래 메뉴에서 「다른 브라우저로 열기」를 눌러 주세요.",
  line: "오른쪽 위 메뉴에서 「다른 앱으로 열기」를 눌러 주세요.",
  daum: "메뉴에서 「다른 브라우저로 열기」를 눌러 주세요.",
  band: "메뉴에서 「다른 브라우저로 열기」를 눌러 주세요.",
  webview: "사파리나 크롬 같은 기본 브라우저에서 이 주소를 열어 주세요.",
};
