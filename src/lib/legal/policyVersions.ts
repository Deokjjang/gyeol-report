// Version identifiers for the current text, not effective dates.
// Increment the relevant identifier whenever its canonical policy text changes.
// terms·privacy를 올리면 회원은 다음 로그인 때 다시 동의한다(account/policy ACCOUNT_POLICY_VERSIONS). 결제 전 동의 기록(consentEvidence.policyVersions)에도 새 값이 남는다.
// 2026-11-05.1(v5 최종3): 개인정보처리방침 법정 항목·국외 이전 업체별 표·보유 기간, 이용약관 이용권·AI 작성·버전별 열람 기간, 환불정책 이용권 리포트 재생성.
// 최종 A 17: 2026-11-05.1은 아직 운영에 배포되지 않았다(시행일 POLICY_EFFECTIVE_DATE = null). 같은 배포에 들어가는 문구 보완(종료 안내 수단,
// Supabase 저장 위치 ap-northeast-2, AI 작성 원문 보유 기간)은 버전을 올리지 않고 같은 판에 넣는다 — 올리면 이미 새 판으로 만든 로컬·시험 주문서와
// 동의 기록이 어긋날 뿐 고객이 본 적 있는 판은 없다. 배포 뒤 문구를 바꿀 때는 반드시 올린다.
// 2026-11-06.1(P 추가, 2026-11-05.1 배포 뒤 첫 변경): 비회원 결제 없앰, 이용권 기한·회수·쓸 수 있는 상품, v5 이전 리포트 만료 뒤 법정 최소 기록,
// 결제수단(토스페이·카카오페이), 환불정책 시행일·변경 이력 표시. 회원은 다음 로그인 때 다시 동의한다. 혜택 알림 동의 버전(MARKETING_CONSENT_VERSION)은 그대로.
export const CHECKOUT_POLICY_VERSIONS = {
  terms: "2026-11-06.1",
  privacy: "2026-11-06.1",
  refund: "2026-11-06.1",
} as const;
export type CheckoutPolicyVersions = { readonly terms: string; readonly privacy: string; readonly refund: string };

/**
 * 시행일 = 운영 배포일(KST). 세 문서가 같은 날 시행. 앞 판(2026-11-05.1)은 v5 배포일 2026-11-06에 시행했다.
 * null이면 문서에 "배포일(확정 전)"이 보인다.
 */
// 배포 커밋에서 실제 배포일로 맞춘다
export const POLICY_EFFECTIVE_DATE: string | null = "2026-11-07";
const koreanDate = (iso: string) => { const [y, m, d] = iso.split("-").map(Number); return `${y}년 ${m}월 ${d}일`; };
export const POLICY_EFFECTIVE_DATE_KO = POLICY_EFFECTIVE_DATE ? koreanDate(POLICY_EFFECTIVE_DATE) : "배포일(확정 전)";

/** 변경 이력(문서 끝에 그대로 보인다). 최신이 먼저. */
export const POLICY_HISTORY = {
  terms: [
    `${POLICY_EFFECTIVE_DATE_KO} 시행(현재, 문서 버전 2026-11-06.1): 결제는 로그인한 회원만, 이용권 기한은 이용권에 표시된 날짜까지(이번 이벤트 이용권은 2026년 11월 30일 23:59:59까지), 이용권으로 만들 수 있는 리포트(4종, 대운·세운 제외), 결제를 환불해도 이미 드린 이용권은 회수하지 않음`,
    "2026년 11월 6일 시행(문서 버전 2026-11-05.1): 판매 상품 4종, 이용권 조항, AI 작성 고지, 리포트 버전별 열람 기간, 서비스 종료 안내(서비스 화면 공지 및 이메일 등)",
    "이전 약관(2026년 9월 24일 시행, 문서 버전 2026-06-14.1)",
  ],
  privacy: [
    `${POLICY_EFFECTIVE_DATE_KO} 시행(현재, 문서 버전 2026-11-06.1): 결제는 회원만 하므로 로그인 없이 결제할 때의 항목과 쿠키를 뺌, v5 이전 리포트의 열람 기간이 끝나면 원고와 입력정보를 지우고 법정 최소 기록(주문번호·상품·금액·일시·상태)만 5년 보관, 결제수단(토스페이·카카오페이) 안내`,
    "2026년 11월 6일 시행(문서 버전 2026-11-05.1): 수집 항목·목적 추가(로그인 식별자, 현재 하는 일·연애 상태, 궁합·선물 상대, 이용권, 혜택 알림), 국외 이전 업체별 안내(Anthropic·OpenAI·Supabase·Vercel), 보유 기간 구체화(AI 작성 원문 작업용 사본 30일 포함), 데이터 저장 위치(서울, ap-northeast-2), 쿠키·안전성 확보 조치·구제 기관 안내",
    "이전 방침(문서 버전 2026-09-22.1)",
  ],
  refund: [
    `${POLICY_EFFECTIVE_DATE_KO} 시행(현재, 문서 버전 2026-11-06.1): 시행일과 변경 이력 표시(환불 기준은 그대로)`,
    "2026년 11월 6일 시행(문서 버전 2026-11-05.1): 이용권으로 만든 리포트는 환불 대신 재생성, 생성 시작 후 단순 변심 환불 불가 명시",
    "이전 정책(문서 버전 2026-09-22.1)",
  ],
} as const;
