// Version identifiers for the current text, not effective dates.
// Increment the relevant identifier whenever its canonical policy text changes.
// terms·privacy를 올리면 회원은 다음 로그인 때 다시 동의한다(account/policy ACCOUNT_POLICY_VERSIONS). 결제 전 동의 기록(consentEvidence.policyVersions)에도 새 값이 남는다.
// 2026-11-05.1(v5 최종3): 개인정보처리방침 법정 항목·국외 이전 업체별 표·보유 기간, 이용약관 이용권·AI 작성·버전별 열람 기간, 환불정책 이용권 리포트 재생성.
// 최종 A 17: 2026-11-05.1은 아직 운영에 배포되지 않았다(시행일 POLICY_EFFECTIVE_DATE = null). 같은 배포에 들어가는 문구 보완(종료 안내 수단,
// Supabase 저장 위치 ap-northeast-2, AI 작성 원문 보유 기간)은 버전을 올리지 않고 같은 판에 넣는다 — 올리면 이미 새 판으로 만든 로컬·시험 주문서와
// 동의 기록이 어긋날 뿐 고객이 본 적 있는 판은 없다. 배포 뒤 문구를 바꿀 때는 반드시 올린다.
// 2026-11-06.1(P 추가, 2026-11-05.1 배포 뒤 첫 변경): 비회원 결제 없앰, 이용권 기한·회수·쓸 수 있는 상품, v5 이전 리포트 만료 뒤 법정 최소 기록,
// 결제수단(토스페이·카카오페이), 환불정책 시행일·변경 이력 표시. 회원은 다음 로그인 때 다시 동의한다. 혜택 알림 동의 버전(MARKETING_CONSENT_VERSION)은 그대로.
// 2026-11-07.1(운영 Q, 2026-11-06.1 배포 뒤 변경): 개인정보처리방침에 Telegram(운영자 주문 알림·문의 처리) 처리 위탁·국외 이전 한 줄씩,
// 환불정책 맨 위 3줄(REFUND_POLICY_TOP_LINES)·「문의 방법」 정리. 약관은 그대로(약관을 올리면 회원 전원이 다시 동의해야 한다 — 바꾸지 않음).
// 개인정보처리방침이 올라가 회원은 다음 로그인 때 다시 동의한다(ACCOUNT_POLICY_VERSIONS). 산 책 열람은 그대로(account/policy mayReadOwnedBooks).
export const CHECKOUT_POLICY_VERSIONS = {
  terms: "2026-11-06.1",
  privacy: "2026-11-07.1",
  refund: "2026-11-07.1",
} as const;
export type CheckoutPolicyVersions = { readonly terms: string; readonly privacy: string; readonly refund: string };

/**
 * 시행일 = 그 판의 운영 배포일(KST). 문서마다 따로 센다(운영 Q부터 약관과 나머지 두 문서의 시행일이 다르다).
 * null이면 문서에 "배포일(확정 전)"이 보인다.
 */
// 이용약관 시행일(2026-11-06.1, 2026-11-06 P 배포). 불리한 변경 대상자 0명 근거: docs/v5/final4/legal-review.md 「P 배포 전 보완」.
export const POLICY_EFFECTIVE_DATE: string | null = "2026-11-06";
/** 운영 Q 배포일 = 개인정보처리방침·환불정책 2026-11-07.1 시행일. 배포일이 바뀌면 이 한 줄만 고친다. */
export const OPS_Q_POLICY_EFFECTIVE_DATE: string | null = "2026-11-07";
const koreanDate = (iso: string | null) => { if (!iso) return "배포일(확정 전)"; const [y, m, d] = iso.split("-").map(Number); return `${y}년 ${m}월 ${d}일`; };
/** 이용약관 시행일(한국어). */
export const POLICY_EFFECTIVE_DATE_KO = koreanDate(POLICY_EFFECTIVE_DATE);
/** 문서별 시행일(한국어). 세 문서의 「시행일」·변경 이력 첫 줄이 이 값을 쓴다. */
export const POLICY_EFFECTIVE_DATES_KO = {
  terms: POLICY_EFFECTIVE_DATE_KO,
  privacy: koreanDate(OPS_Q_POLICY_EFFECTIVE_DATE),
  refund: koreanDate(OPS_Q_POLICY_EFFECTIVE_DATE),
} as const;

/** 변경 이력(문서 끝에 그대로 보인다). 최신이 먼저. */
export const POLICY_HISTORY = {
  terms: [
    `${POLICY_EFFECTIVE_DATE_KO} 시행(현재, 문서 버전 2026-11-06.1): 결제는 로그인한 회원만, 이용권은 결제에 따른 무상 증정(현금 교환·환불 불가), 이용권 기한은 이용권에 표시된 날짜까지(이번 이벤트 이용권은 2026년 11월 30일 23:59:59까지), 이용권으로 만들 수 있는 리포트(4종, 대운·세운 제외), 결제가 환불되면 그 결제로 받은 미사용 이용권(받지 않은 선물 포함) 회수, 이용권으로 만든 책에 오류가 있으면 다시 만들거나 이용권을 다시 드림`,
    "2026년 11월 6일 시행(문서 버전 2026-11-05.1): 판매 상품 4종, 이용권 조항, AI 작성 고지, 리포트 버전별 열람 기간, 서비스 종료 안내(서비스 화면 공지 및 이메일 등)",
    "이전 약관(2026년 9월 24일 시행, 문서 버전 2026-06-14.1)",
  ],
  privacy: [
    `${POLICY_EFFECTIVE_DATES_KO.privacy} 시행(현재, 문서 버전 2026-11-07.1): 처리 위탁과 국외 이전에 Telegram Messenger Inc.를 더함(운영자 주문 알림·문의 처리 — 주문코드, 상품, 금액, 결제 시각, 결제수단, 기기 정보를 알림이 생길 때 텔레그램 봇 API(HTTPS)로 보내고, 처리 후 메시지를 정리), 문의·요청 항목을 요청 종류와 접수 기기·브라우저 종류로 고침(직접 쓰는 칸 없앰)`,
    "2026년 11월 6일 시행(문서 버전 2026-11-06.1): 결제는 회원만 하므로 로그인 없이 결제할 때의 항목과 쿠키를 뺌, v5 이전 리포트의 열람 기간이 끝나면 원고와 입력정보를 지우고 법정 최소 기록(주문번호·상품·금액·일시·상태)만 5년 보관, 결제수단(토스페이·카카오페이) 안내",
    "2026년 11월 6일 시행(문서 버전 2026-11-05.1): 수집 항목·목적 추가(로그인 식별자, 현재 하는 일·연애 상태, 궁합·선물 상대, 이용권, 혜택 알림), 국외 이전 업체별 안내(Anthropic·OpenAI·Supabase·Vercel), 보유 기간 구체화(AI 작성 원문 작업용 사본 30일 포함), 데이터 저장 위치(서울, ap-northeast-2), 쿠키·안전성 확보 조치·구제 기관 안내",
    "이전 방침(문서 버전 2026-09-22.1)",
  ],
  refund: [
    `${POLICY_EFFECTIVE_DATES_KO.refund} 시행(현재, 문서 버전 2026-11-07.1): 맨 위에 요약 세 줄(단순 변심 환불 불가, 저희 쪽 문제가 확인되면 다시 만들거나 환불, 신청은 내 서재의 「문의·환불 요청」·상담은 카카오톡 채널 채팅), 「문의 방법」 절(전화·이메일로 결제 정보를 보내는 안내)을 빼고 위 요약으로 정리(환불 기준은 그대로)`,
    "2026년 11월 6일 시행(문서 버전 2026-11-06.1): 이용권으로 만든 리포트에 오류가 있으면 다시 만들거나 이용권을 다시 드림, 결제가 환불되면 그 결제로 받은 미사용 이용권 회수 안내, 시행일과 변경 이력 표시(결제 리포트의 환불 기준은 그대로)",
    "2026년 11월 6일 시행(문서 버전 2026-11-05.1): 이용권으로 만든 리포트는 환불 대신 재생성, 생성 시작 후 단순 변심 환불 불가 명시",
    "이전 정책(문서 버전 2026-09-22.1)",
  ],
} as const;
