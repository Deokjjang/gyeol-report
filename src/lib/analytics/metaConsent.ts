export const META_CONSENT_VERSION = "meta-20261020-v2";
export const META_CONSENT_COOKIE = "__Host-gyeol-meta-consent";
// Explicit production origins. Build-time production alone also includes previews.
export const metaOrigin = (value: string) => value === "https://www.gyeolreport.com" || value === "https://gyeolreport.com";
export const metaConsentValue = (value?: string) => value?.startsWith(`${META_CONSENT_VERSION}:yes:`) && /^[a-f0-9-]{36}$/.test(value.split(":")[2] ?? "") ? true : value?.startsWith(`${META_CONSENT_VERSION}:no:`) && /^[a-f0-9-]{36}$/.test(value.split(":")[2] ?? "") ? false : null;
// 덕짱님 결정 A(2026-11-09): 개인 식별 정보 없는 행태정보는 기본으로 보내고 거부한 사람에게는 보내지 않는다(opt-out).
// 이메일·휴대폰 번호 해시값(개인 식별 정보)과 가입 완료 여부는 로그인한 채 선택 동의한 회원만(opt-in). 판(META_CONSENT_VERSION)은 그대로 —
// 올리면 기존 동의·거부 기록과 쿠키가 모두 풀린다. 처리방침 13번이 이 문구를 그대로 싣는다(문서 개정 공지, 동의 버전 그대로).
export const metaTrackingNotice = "결리포트는 광고 성과를 재려고 행태정보를 Meta에 보냅니다: 방문·상품 조회·결제 시작·유료 결제 여부와 발생 시각, 무작위 전환 식별자, 상품 분류·결제금액, 보낼 때 함께 전달되는 IP 주소·브라우저 정보. Meta 픽셀은 Meta 쿠키 등 온라인 식별자를 받을 수 있습니다. 이름·이메일·전화번호·생년월일·MBTI 값·사주·계정 ID·공유 토큰·방문한 페이지 주소는 보내지 않습니다. 원하지 않으면 사이트 맨 아래 「광고 설정」에서 거부할 수 있습니다. 거부하면 그 브라우저에서는 보내지 않고, 로그인한 채 거부하면 그 계정으로 로그인한 다른 브라우저와 그 계정의 결제도 보내지 않습니다. 거부해도 가입·무료 이용권·결제·리포트 이용에 영향이 없습니다.";
export const metaPiiNotice = "선택 동의(개인 식별 정보): 로그인한 채 따로 동의한 회원만, 가입 정보의 이메일과 휴대폰 번호(입력한 경우)를 되돌릴 수 없는 값(SHA-256 해시)으로 바꿔 서버 전송에 함께 붙이고, 이벤트 적격 신규 가입 완료 여부도 보냅니다. 광고 성과를 더 정확히 재는 데 씁니다. 동의하지 않아도 위 기본 측정만 하며 이용에 영향이 없습니다. 동의를 거두려면 「광고 설정」에서 「거부」를 누르세요(기본 측정도 함께 멈춥니다).";
export const metaTransferNotice = "이전받는 자: Meta Platforms, Inc. / 국가: 미국 / 연락처: Privacy Operations, 1 Meta Way, Menlo Park, CA 94025, USA 및 Meta 개인정보처리방침의 문의 창구. 위 측정 항목은 이벤트 발생 시(서버 전송은 재시도 포함) HTTPS로 이전되며, 이메일·휴대폰 번호 해시값은 선택 동의한 경우에만 이전됩니다. 목적: 광고 성과 측정, 광고 타게팅·게재 및 Meta 서비스 개선. Meta 이벤트 데이터 보유기간: 최대 2년(비즈니스 도구 약관 제4조). 결리포트의 광고 설정·전환 기록은 최대 180일, IP·브라우저 정보는 전송 성공·거부 시 또는 최대 7일 뒤 삭제합니다. 사이트의 「광고 설정」에서 언제든 거부할 수 있으며 서비스 이용상 불이익은 없습니다. 이미 Meta로 이전된 정보의 처리·삭제 요청은 Meta 개인정보처리방침의 권리 행사 창구에서도 진행할 수 있습니다.";
/** 처리방침 13번 표(행태정보 항목·목적·거부 방법). */
export const metaBehaviorRows = [
  ["보내는 행태정보", "방문(PageView)·상품 조회(ViewContent)·결제 시작(InitiateCheckout)·유료 결제(Purchase) 여부와 발생 시각, 무작위 전환 식별자, 상품 분류·결제금액, 보낼 때 함께 전달되는 IP 주소·브라우저 정보, Meta 픽셀이 받는 Meta 쿠키 등 온라인 식별자"],
  ["보내지 않는 정보", "이름·이메일·전화번호·생년월일·MBTI 값·사주·계정 ID·공유 토큰·방문한 페이지 주소(선택 동의한 회원의 이메일·휴대폰 번호 해시값은 아래 「선택 동의」)"],
  ["수집 방법", "사이트에 넣은 Meta 픽셀(사이트 화면·주소·로그인 정보를 읽을 수 없는 격리된 창)과 서버 전송(Meta 전환 API)"],
  ["목적", "광고 성과 측정(어떤 광고가 방문·결제로 이어졌는지), 광고 게재·최적화. Meta는 이 정보를 광고 측정·맞춤형 광고·서비스 개선에도 이용할 수 있습니다."],
  ["받는 자", "Meta Platforms, Inc.(미국) — 아래 이전 안내"],
  ["거부 방법", "사이트 맨 아래 「광고 설정」 → 「거부」. 거부하면 그 브라우저에서는 보내지 않고, 로그인한 채 거부하면 그 계정으로 로그인한 다른 브라우저와 그 계정의 결제도 보내지 않습니다. 브라우저 쿠키를 지우면 거부 기록도 지워지니 다시 거부해 주세요. 거부해도 이용에 영향이 없습니다."],
  ["선택 동의", "로그인한 채 따로 동의한 회원만 이메일·휴대폰 번호 해시값(SHA-256)과 이벤트 적격 신규 가입 완료 여부를 함께 보냅니다. 동의하지 않으면 보내지 않습니다."],
] as const;

export const metaLocalReview = (url: URL) => process.env.NODE_ENV === "development" && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
export const metaCookieName = (local: boolean) => local ? "gyeol-local-meta-consent" : META_CONSENT_COOKIE;
// Footer "광고 설정" link ↔ consent panel. 안내 카드는 안내 판마다 한 번(기본 허용으로 바뀌어 이미 카드를 본 사람도 새 안내를 한 번 본다).
export const META_SETTINGS_EVENT = "gyeol:meta-settings";
export const META_AVAILABLE_EVENT = "gyeol:meta-available";
export const META_NOTICE_VERSION = "notice-20261109-optout";
export const META_CARD_SEEN_KEY = `gyeol-meta-card-seen:${META_NOTICE_VERSION}`;
