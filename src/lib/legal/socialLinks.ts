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
/** F: 카카오톡 채널 홈(채널 추가). /free 권유 줄. */
export const KAKAO_CHANNEL_URL = "https://pf.kakao.com/_sbHaX";

/**
 * 문의·환불·카카오·전화 문구(운영 Q 1부, 2026-11-06). 고객에게 보이는 안내는 이 네 곳만 남긴다:
 * ① 메인 푸터 ② 환불정책 맨 위 3줄 ③ 서재 문의 창 아래 1줄 ④ 결제 동의 칸(동의 문구는 그대로 + 환불정책·예시 리포트 링크).
 * 사업자 정보의 법정 표시 전화번호는 businessInfo.ts 그대로 둔다.
 */
export const SUPPORT_FOOTER_LINE = "환불 신청과 책 문의는 내 서재에서 할 수 있어요. 상담원 문의는 카카오톡 채널 채팅으로 받고 있어요. 전화 상담은 제공하지 않아요.";
export const REFUND_POLICY_TOP_LINES = [
  "디지털 콘텐츠라 단순 변심 환불은 되지 않아요.",
  "결제 후 30분 안에 책을 못 만들면 신청하지 않아도 자동으로 전액 환불돼요(이용권은 자동으로 돌려드려요). 책이 안 열리는 등 저희 쪽 문제가 확인되면 다시 만들어 드리거나 환불해 드려요.",
  "환불은 내 서재의 해당 책에서 「문의·환불 요청」으로 신청할 수 있어요. 상담이 필요하면 카카오톡 채널 채팅으로 문의해 주세요.",
] as const;
export const REQUEST_WINDOW_LINE = "디지털 콘텐츠라 단순 변심 환불은 되지 않아요. 30분 안에 책을 못 만들면 자동으로 전액 환불돼요. 저희 쪽 문제가 확인되면 다시 만들어 드리거나 환불해 드려요.";
export const CONSENT_LINK_LABELS = { refund: "환불정책", example: "예시 리포트 보기" } as const;
/** 기능 화면(결제 실패·책 상태 등)에서 상담 창구를 가리키는 짧은 말. 전화는 넣지 않는다. */
export const SUPPORT_CHAT_LABEL = "카카오톡 채널로 문의하기";
/** 확인이 필요한 책 화면(attention)에서 문의 링크 바로 위 한 줄. */
export const SUPPORT_PAGE_ADDRESS_HINT = "문의할 때 이 페이지 주소를 함께 알려 주세요.";

/** 서재 문의 창(2부). 사유는 셋만: 바로 처리할 수 있는 둘은 접수, 판단이 필요한 계산 문의는 카카오톡 채널로. */
export const REQUEST_COPY = {
  notOpen: "책이 안 나오거나 안 열려요",
  doublePaid: "같은 걸 두 번 결제했어요",
  calc: "계산이나 내용이 이상해요",
  notOpenHint: "카카오톡·인스타그램 안에서 열었다면 사파리나 크롬으로 열어 보세요. 그래도 안 되면 접수해 주세요.",
  making: "지금 만드는 중이에요. 30분 안에 책을 드리지 못하면 결제는 자동으로 취소돼요. 따로 신청하지 않아도 돼요.",
  makingTicket: "지금 만드는 중이에요. 30분 안에 책을 드리지 못하면 이용권은 자동으로 돌려드려요. 따로 신청하지 않아도 돼요.",
  noDouble: "같은 내용의 다른 결제가 없어요. 카카오톡 채널 상담원에게 문의해 주세요.",
  /** calc-basis.md 부록 A(운영 Q 8부 3, 대운수 = 대운 시작 때의 만 나이 결정 반영). */
  calcGuide: "만세력은 태어난 곳과 상관없이 동경 127.5도 기준 태양시(지금 시계로는 태어난 시각 −30분)로 계산하고, 당시 서머타임도 반영해요. 나이와 대운수는 만 나이로 적어요.",
  calcSend: "어느 부분인지 캡처와 함께 카카오톡 채널로 보내 주세요.",
  calcButton: "카카오톡 채널로 보내기",
  submit: "접수",
  submitted: "접수됨",
  accepted: "접수됐어요. 확인 후 이 책 카드에서 결과를 알려 드릴게요.",
  otherLink: "그 밖의 문의는 카카오톡 채널로",
  dailyLimit: "오늘은 더 접수할 수 없어요. 카카오톡 채널 상담원에게 문의해 주세요.",
} as const;
/** 처리 뒤 책 카드 한 줄(7일 동안). 안내는 처리 봇 [안내] 문구 + 카카오톡 채널 버튼. */
export const REQUEST_RESULT_COPY = {
  refund: "환불됐어요. 결제수단에 따라 바로 또는 영업일 3~5일 안에 돌아가요.",
  regenerate: "다시 만들어 드렸어요.",
  ticket: "이용권을 다시 드렸어요. 서재에서 확인해 주세요.",
  guideNotOpen: "확인해 보니 책은 정상이에요. 사파리나 크롬으로 다시 열어 보시고, 그래도 안 되면 카카오톡 채널 상담원에게 문의 주시면 친절히 안내해 드릴게요.",
  guideOther: "확인이 더 필요해요. 카카오톡 채널 상담원에게 문의 주시면 친절히 안내해 드릴게요.",
} as const;

/** https 주소만 허용(비어 있거나 다른 형식이면 null → 아이콘 숨김). */
export function safeSocialUrl(value: string): string | null {
  try { const u = new URL(value); return u.protocol === "https:" && u.hostname ? u.toString() : null; } catch { return null; }
}
