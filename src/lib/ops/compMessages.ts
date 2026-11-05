/**
 * 보상 이용권 안내 문구(P6e-ops, v5 최종 2-3) — 서재 맨 위 한 줄. 문구는 이 파일 한 곳에서만 고친다.
 * 보상 이용권은 이벤트 이용권과 같은 종류다: 장마다 고객이 "내가 쓰기 / 선물 링크 만들기"를 고른다(A는 두 장 다 내가 써도 된다).
 * 자리표시자: {장수} {기한}
 *   {장수} = 지급(예정) 이용권 총 장수(A 2장·B 1장이 기본), {기한} = 지급 뒤 "11월 30일까지"(지급 전에는 쓰지 않는다).
 * 유효기간(최종3): 받은 날부터 30일(TICKET_VALID_DAYS). 지급 전 안내에도 30일을 적는다.
 * state: granted = 이미 서재에 넣음 · waiting_profile = 가입 정보를 입력하면 넣어 줌.
 */
export const COMP_COPY = {
  // A: 결제 후 환불한 고객 — 계산 기준을 바로잡았다는 사과와 감사.
  A: {
    granted: "만세력 계산 기준을 바로잡는 동안 불편을 드려 죄송해요. 기다려 주셔서 고마워요. 사과의 뜻으로 이용권 {장수}장을 넣어 드렸어요. 한 장씩 내가 쓰거나 선물 링크로 친구에게 보낼 수 있어요. {기한} 쓸 수 있어요.",
    waiting_profile: "만세력 계산 기준을 바로잡는 동안 불편을 드려 죄송해요. 기다려 주셔서 고마워요. 아래 가입 정보를 입력하면 사과의 뜻으로 이용권 {장수}장을 바로 넣어 드려요. 한 장씩 내가 쓰거나 친구에게 선물할 수 있어요. 받은 날부터 30일 동안 쓸 수 있어요.",
  },
  // B: 기존 무료 이벤트 가입자 — 업그레이드 안내.
  B: {
    granted: "결리포트가 더 좋아졌어요. 오픈 이벤트에 함께해 주신 분께 업그레이드 이용권 {장수}장을 넣어 드렸어요. 내가 쓰거나 선물 링크로 친구에게 보낼 수 있어요. {기한} 원하는 리포트로 만들어 보세요.",
    waiting_profile: "결리포트가 더 좋아졌어요. 아래 가입 정보를 입력하면 오픈 이벤트에 함께해 주신 분께 드리는 업그레이드 이용권 {장수}장을 바로 넣어 드려요. 내가 쓰거나 친구에게 선물할 수 있어요. 받은 날부터 30일 동안 쓸 수 있어요.",
  },
} as const;

export type CompTier = keyof typeof COMP_COPY;
export type CompNoticeState = keyof (typeof COMP_COPY)["A"];

export function compNoticeText(tier: CompTier, state: CompNoticeState, vars: { quantity: number; until?: string }): string {
  return COMP_COPY[tier][state].replaceAll("{장수}", String(vars.quantity)).replaceAll("{기한}", vars.until ?? "").replace(/ {2,}/g, " ").trim();
}
