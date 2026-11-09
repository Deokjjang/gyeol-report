export const META_CONSENT_VERSION = "meta-20261020-v2";
export const META_CONSENT_COOKIE = "__Host-gyeol-meta-consent";
// Explicit production origins. Build-time production alone also includes previews.
export const metaOrigin = (value: string) => value === "https://www.gyeolreport.com" || value === "https://gyeolreport.com";
export const metaConsentValue = (value?: string) => value?.startsWith(`${META_CONSENT_VERSION}:yes:`) && /^[a-f0-9-]{36}$/.test(value.split(":")[2] ?? "") ? true : value?.startsWith(`${META_CONSENT_VERSION}:no:`) && /^[a-f0-9-]{36}$/.test(value.split(":")[2] ?? "") ? false : null;
// 덕짱님 결정(2026-11-09, consent-01 배포): 기본 측정(거부하지 않으면 보냄)은 처리방침 16번 「불리한 변경은 30일 전 공지」대로
// 2026-11-09부터 알리고 META_DEFAULT_FROM에 켠다. 그 전에는 예전 그대로 동의한 사람만 보낸다(카드·광고 설정 창·처리방침이 두 판을 함께 싣는다).
// 시행 여부는 서버 시계로만 정한다(GET /api/analytics/meta 응답 optout). SQL meta_optout_effective()의 시각과 같아야 한다(시험이 대조).
// 법률 검토 결과로 시행일 전에 바꿀 수 있는 것(코드 한 줄 + 배포, migration 없음):
//   META_DEFAULT_FROM = null → 기본 측정 전체를 켜지 않는다(시행일 뒤에도 동의한 사람만). 「기본 단계에서 IP 제외」 결론이면 이것 —
//     픽셀은 브라우저가 Meta에 직접 접속해 IP가 드러나고, IP 없는 서버 전송은 Meta가 무효로 볼 수 있다.
//   META_DEFAULT_PURCHASE = false → 결제(Purchase)만 선택 동의한 사람에게.
//   둘 다 처리방침 13번·카드 문구도 함께 고친다(보내는 항목이 바뀜). SQL 쪽 기본 결제 줄은 코드가 회원을 넘기지 않으면 IP가 안 채워져 보내지 않는다.
export const META_DEFAULT_FROM: string | null = "2026-12-10T00:00:00+09:00";
export const META_DEFAULT_PURCHASE: boolean = true;
export const metaDefaultOn = (now = Date.now(), from: string | null = META_DEFAULT_FROM) => from !== null && now >= Date.parse(from);
/** 이 설정으로 보내도 되는지: 동의(true)는 언제나, 기록 없음(null)은 시행일부터(결제는 META_DEFAULT_PURCHASE일 때만), 거부(false)·서버 답 전(undefined)은 안 됨. */
export const metaMaySend = (choice: boolean | null | undefined, defaultOn: boolean, event?: string, purchase = META_DEFAULT_PURCHASE) =>
  choice === true || (choice === null && defaultOn && (event !== "Purchase" || purchase));
const kstDay = (iso: string, days = 0) => {
  const d = new Date(Date.parse(iso) + 9 * 3600e3 + days * 86400e3);
  const week = "일월화수목금토"[d.getUTCDay()];
  return { full: `${d.getUTCFullYear()}년 ${d.getUTCMonth() + 1}월 ${d.getUTCDate()}일`, short: `${d.getUTCMonth() + 1}월 ${d.getUTCDate()}일(${week})`, week };
};
const FROM = kstDay(META_DEFAULT_FROM ?? "2026-12-10T00:00:00+09:00"), UNTIL = kstDay(META_DEFAULT_FROM ?? "2026-12-10T00:00:00+09:00", -1);
/** 「2026년 12월 10일」·「12월 10일(목)」·「2026년 12월 9일」 — 카드·광고 설정 창·처리방침이 같은 날짜를 쓴다. */
export const META_DEFAULT_FROM_KO = FROM.full, META_DEFAULT_FROM_SHORT_KO = FROM.short, META_OPTIN_UNTIL_KO = UNTIL.full;
/** 공지 시작일(처리방침 16번 「서비스 화면에 알림」) = 이 판의 운영 배포일(KST). 배포가 자정을 넘기면 이 한 줄을 고친다. */
export const META_NOTICE_FROM_KO = "2026년 11월 9일";
// 시행일 전(META_OPTIN_UNTIL_KO까지) 쓰는 지금 문구 — v5/main dc5dc158 그대로(처리방침 13번 「12월 9일까지」도 이 문장).
export const metaOptInNotice = "광고 성과 측정은 선택 사항입니다. 허용하면 방문·상품 조회·결제 시작·실제 유료 결제·이벤트 적격 신규 가입 완료 여부, 발생 시각, 무작위 전환 식별자, 상품 분류·유료 결제금액, IP 주소·브라우저 정보가 Meta에 전달됩니다. Meta 픽셀은 Meta 쿠키 등 온라인 식별자를 수신할 수 있습니다. 이름·이메일·생년월일·MBTI 값·사주·계정 ID·공유 토큰·원문 URL은 보내지 않습니다. Meta는 이 정보를 광고 측정·맞춤형 광고·서비스 개선에도 이용할 수 있습니다. 거부해도 가입·무료 이용권·결제·리포트 이용에 영향이 없습니다.";
export const metaOptInTransferNotice = "이전받는 자: Meta Platforms, Inc. / 국가: 미국 / 연락처: Privacy Operations, 1 Meta Way, Menlo Park, CA 94025, USA 및 Meta 개인정보처리방침의 문의 창구. 위 측정 항목은 동의 후 이벤트 발생 시(서버 전송은 재시도 포함) HTTPS로 이전됩니다. 목적: 광고 성과 측정, 광고 타게팅·게재 및 Meta 서비스 개선. Meta 이벤트 데이터 보유기간: 최대 2년(비즈니스 도구 약관 제4조). 결리포트의 동의·전환 기록은 최대 180일, IP·브라우저 정보는 전송 성공·거부 시 또는 최대 7일 뒤 삭제합니다. 동의를 거부하거나 사이트의 광고 측정 설정에서 철회할 수 있으며 서비스 이용상 불이익은 없습니다. 이미 Meta로 이전된 정보의 처리·삭제 요청은 Meta 개인정보처리방침의 권리 행사 창구에서도 진행할 수 있습니다.";
// 덕짱님 결정 A(2026-11-09): 개인 식별 정보 없는 행태정보는 시행일(META_DEFAULT_FROM)부터 기본으로 보내고 거부한 사람에게는 보내지 않는다(opt-out).
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
/** 공지(처리방침 16번 「서비스 화면에 알림」): 바뀌는 점·보내는 항목·목적·거부 방법·시행일. 광고 설정 창(시행일 전)과 처리방침 13번이 같은 표를 쓴다. */
export const metaChangeRows = [
  ["시행일", `${META_DEFAULT_FROM_KO}(${FROM.week}) 0시(한국 시간)부터. ${META_NOTICE_FROM_KO}부터 미리 알립니다.`],
  ["바뀌는 점", `${META_OPTIN_UNTIL_KO}까지는 동의한 경우에만 Meta에 보냅니다. ${META_DEFAULT_FROM_SHORT_KO}부터는 거부하지 않으면 기본으로 보냅니다(이름·이메일·전화번호가 없는 행태정보만). 이메일·휴대폰 번호 해시값과 가입 완료 여부는 그 뒤에도 로그인한 채 따로 동의한 회원만 보냅니다.`],
  ["보내는 항목", metaBehaviorRows[0][1]],
  ["목적", metaBehaviorRows[3][1]],
  ["받는 자", metaBehaviorRows[4][1]],
  ["거부 방법", `${metaBehaviorRows[5][1]} 지금 거부해 두면 ${META_DEFAULT_FROM_SHORT_KO} 뒤에도 보내지 않습니다.`],
] as const;
/** 시행일 전 첫 방문 카드(동의·거부·자세히, 닫기 = 결정 보류). */
export const metaChangeCardNotice = `광고 성과 측정 방식이 ${META_DEFAULT_FROM_SHORT_KO}부터 바뀝니다. 지금은 동의한 경우에만 방문·상품 조회·결제 여부 같은 행동 정보를 Meta에 보내지만, 그날부터는 거부하지 않으면 기본으로 보냅니다. 이름·이메일·전화번호는 보내지 않습니다. 원하지 않으면 거부를 누르세요. 거부해도 이용에 영향이 없습니다.`;
/** 시행일 전 동의 칸 첫 줄: 지금 항목에 더해, 시행일부터 이 동의가 「선택 동의」로 읽혀 붙는 해시값까지 알리고 받는다. */
export const metaOptInMeasurementLabel = `[선택] 위 항목의 광고 측정 수집·이용에 동의(${META_DEFAULT_FROM_SHORT_KO}부터는 로그인한 채 동의한 회원의 이메일·휴대폰 번호 해시값도 함께 — 「선택 동의」)`;

export const metaLocalReview = (url: URL) => process.env.NODE_ENV === "development" && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
export const metaCookieName = (local: boolean) => local ? "gyeol-local-meta-consent" : META_CONSENT_COOKIE;
// Footer "광고 설정" link ↔ consent panel. 시행일 뒤 안내 카드는 안내 판마다 한 번(기본 허용으로 바뀌어 이미 카드를 본 사람도 새 안내를 한 번 본다).
// 시행일 전 카드는 정할 때(동의·거부)까지 방문마다 — 닫으면 그 방문(브라우저 세션) 동안만 숨긴다(결정 보류, 거부로 저장 안 함).
export const META_SETTINGS_EVENT = "gyeol:meta-settings";
export const META_AVAILABLE_EVENT = "gyeol:meta-available";
export const META_NOTICE_VERSION = "notice-20261109-optout";
export const META_CARD_SEEN_KEY = `gyeol-meta-card-seen:${META_NOTICE_VERSION}`;
export const META_CARD_LATER_KEY = "gyeol-meta-card-later";
