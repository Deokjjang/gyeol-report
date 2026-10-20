export const META_CONSENT_VERSION = "meta-20261020-v2";
export const META_CONSENT_COOKIE = "__Host-gyeol-meta-consent";
// Explicit production origins. Build-time production alone also includes previews.
export const metaOrigin = (value: string) => value === "https://www.gyeolreport.com" || value === "https://gyeolreport.com";
export const metaConsentValue = (value?: string) => value?.startsWith(`${META_CONSENT_VERSION}:yes:`) && /^[a-f0-9-]{36}$/.test(value.split(":")[2] ?? "") ? true : value?.startsWith(`${META_CONSENT_VERSION}:no:`) && /^[a-f0-9-]{36}$/.test(value.split(":")[2] ?? "") ? false : null;
export const metaTrackingNotice = "광고 성과 측정은 선택 사항입니다. 허용하면 방문·상품 조회·결제 시작·실제 유료 결제·이벤트 적격 신규 가입 완료 여부, 발생 시각, 무작위 전환 식별자, 상품 분류·유료 결제금액, IP 주소·브라우저 정보가 Meta에 전달됩니다. Meta 픽셀은 Meta 쿠키 등 온라인 식별자를 수신할 수 있습니다. 이름·이메일·생년월일·MBTI 값·사주·계정 ID·공유 토큰·원문 URL은 보내지 않습니다. Meta는 이 정보를 광고 측정·맞춤형 광고·서비스 개선에도 이용할 수 있습니다. 거부해도 가입·무료 이용권·결제·리포트 이용에 영향이 없습니다.";
export const metaTransferNotice = "이전받는 자: Meta Platforms, Inc. / 국가: 미국 / 연락처: Privacy Operations, 1 Meta Way, Menlo Park, CA 94025, USA 및 Meta 개인정보처리방침의 문의 창구. 위 측정 항목은 동의 후 이벤트 발생 시(서버 전송은 재시도 포함) HTTPS로 이전됩니다. 목적: 광고 성과 측정, 광고 타게팅·게재 및 Meta 서비스 개선. Meta 이벤트 데이터 보유기간: 최대 2년(비즈니스 도구 약관 제4조). 결리포트의 동의·전환 기록은 최대 180일, IP·브라우저 정보는 전송 성공·거부 시 또는 최대 7일 뒤 삭제합니다. 동의를 거부하거나 사이트의 광고 측정 설정에서 철회할 수 있으며 서비스 이용상 불이익은 없습니다. 이미 Meta로 이전된 정보의 처리·삭제 요청은 Meta 개인정보처리방침의 권리 행사 창구에서도 진행할 수 있습니다.";

export const metaLocalReview = (url: URL) => process.env.NODE_ENV === "development" && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
export const metaCookieName = (local: boolean) => local ? "gyeol-local-meta-consent" : META_CONSENT_COOKIE;
