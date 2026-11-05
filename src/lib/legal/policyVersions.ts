// Version identifiers for the current text, not effective dates.
// Increment the relevant identifier whenever its canonical policy text changes.
// terms·privacy를 올리면 회원은 다음 로그인 때 다시 동의한다(account/policy ACCOUNT_POLICY_VERSIONS). 결제 전 동의 기록(consentEvidence.policyVersions)에도 새 값이 남는다.
// 2026-11-05.1(v5 최종3): 개인정보처리방침 법정 항목·국외 이전 업체별 표·보유 기간, 이용약관 이용권·AI 작성·버전별 열람 기간, 환불정책 이용권 리포트 재생성.
export const CHECKOUT_POLICY_VERSIONS = {
  terms: "2026-11-05.1",
  privacy: "2026-11-05.1",
  refund: "2026-11-05.1",
} as const;
export type CheckoutPolicyVersions = { readonly terms: string; readonly privacy: string; readonly refund: string };

/**
 * 시행일 = 운영 배포일. 배포할 때 YYYY-MM-DD로 정한다(세 문서가 같은 날 시행).
 * 정하기 전에는 null → 문서에 "배포일(확정 전)"이 보인다. 배포 점검표에서 이 값을 먼저 채운다.
 */
export const POLICY_EFFECTIVE_DATE: string | null = null;
const koreanDate = (iso: string) => { const [y, m, d] = iso.split("-").map(Number); return `${y}년 ${m}월 ${d}일`; };
export const POLICY_EFFECTIVE_DATE_KO = POLICY_EFFECTIVE_DATE ? koreanDate(POLICY_EFFECTIVE_DATE) : "배포일(확정 전)";

/** 변경 이력(문서 끝에 그대로 보인다). 최신이 먼저. */
export const POLICY_HISTORY = {
  terms: [`${POLICY_EFFECTIVE_DATE_KO} 시행(현재): 판매 상품 4종, 이용권 조항, AI 작성 고지, 리포트 버전별 열람 기간, 서비스 종료 안내`, "이전 약관(2026년 9월 24일 시행, 문서 버전 2026-06-14.1)"],
  privacy: [`${POLICY_EFFECTIVE_DATE_KO} 시행(현재): 수집 항목·목적 추가(로그인 식별자, 현재 하는 일·연애 상태, 궁합·선물 상대, 이용권, 혜택 알림), 국외 이전 업체별 안내(Anthropic·Supabase·Vercel), 보유 기간 구체화, 쿠키·안전성 확보 조치·구제 기관 안내`, "이전 방침(문서 버전 2026-09-22.1)"],
  refund: [`${POLICY_EFFECTIVE_DATE_KO} 시행(현재): 이용권으로 만든 리포트는 환불 대신 재생성, 생성 시작 후 단순 변심 환불 불가 명시`, "이전 정책(문서 버전 2026-09-22.1)"],
} as const;
