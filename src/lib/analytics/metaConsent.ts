export const META_CONSENT_VERSION = "meta-20261020-v1";
export const META_CONSENT_COOKIE = "__Host-gyeol-meta-consent";
// Explicit production origins. Build-time production alone also includes previews.
export const metaOrigin = (value: string) => value === "https://www.gyeolreport.com" || value === "https://gyeolreport.com";
export const metaConsentValue = (value?: string) => value?.startsWith(`${META_CONSENT_VERSION}:yes:`) && /^[a-f0-9-]{36}$/.test(value.split(":")[2] ?? "") ? true : value?.startsWith(`${META_CONSENT_VERSION}:no:`) && /^[a-f0-9-]{36}$/.test(value.split(":")[2] ?? "") ? false : null;
export const metaTrackingNotice = "광고 성과 측정은 선택 사항입니다. 허용하면 페이지 방문·상품 조회·결제 시작·실제 유료 결제·이벤트 적격 신규 가입 완료 여부, 발생 시각, 무작위 전환 식별자와 IP 주소·브라우저 정보가 Meta에 전달됩니다. 이름·이메일·생년월일·MBTI·사주·계정 ID·공유 토큰·원문 URL은 전송하지 않습니다. 거부해도 가입·이벤트 혜택·결제·리포트 이용에 영향이 없습니다. 광고 측정 설정에서 언제든 변경할 수 있습니다.";

export const metaLocalReview = (url: URL) => process.env.NODE_ENV === "development" && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
export const metaCookieName = (local: boolean) => local ? "gyeol-local-meta-consent" : META_CONSENT_COOKIE;
