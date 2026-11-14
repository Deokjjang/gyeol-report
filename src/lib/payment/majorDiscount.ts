import "server-only";
/**
 * AM 3부 세운 → 대운 연결 할인(결제 준비 쪽만). 승인 경로는 그대로다: 서버가 정한 할인 금액이 주문 저장 금액이 되고, 승인은 「저장 금액 = 요청 금액 = 토스 금액」만 본다.
 * 규칙 원본은 SQL am_major_discount(세운 1건당 1회·7일·환불이면 막음·예약 유일). 같은 사람 대조와 금액 계산은 여기서.
 */
import type { OpsStore } from "../ops/generation/sinks";

/** 할인율(설정값 MAJOR_DISCOUNT_RATE, 기본 0.5). 0보다 크고 1보다 작아야 한다. */
export function majorDiscountRate(env: Readonly<Record<string, string | undefined>> = process.env): number {
  const r = Number(env.MAJOR_DISCOUNT_RATE); return r > 0 && r < 1 ? Math.round(r * 1000) / 1000 : 0.5;
}
/** 할인 금액: 10원 단위 내림, 토스 최소 100원. */
export const discountedAmount = (price: number, rate: number) => Math.max(100, Math.floor((price * (1 - rate)) / 10) * 10);

type PersonLike = { name?: unknown; birthDate?: unknown; birthTime?: unknown; birthTimeUnknown?: unknown; gender?: unknown; mbtiType?: unknown };
const key = (p: PersonLike | undefined) => p ? [String(p.name ?? "").replace(/\s+/g, ""), String(p.birthDate ?? ""), p.birthTimeUnknown === true || !p.birthTime ? "" : String(p.birthTime).slice(0, 5), String(p.gender ?? "")].join("|") : "";
/** 같은 사람 입력: 이름(공백 무시)·생년월일·출생 시각(HH:MM, 미상은 빈 값)·성별이 모두 같다. MBTI는 보지 않는다. */
export function samePerson(a: PersonLike | undefined, b: PersonLike | undefined): boolean { const x = key(a), y = key(b); return x !== "" && x === y && !x.startsWith("|"); }

export type MajorDiscountQuote = { ok: true; annualOrderId: string; until: string; rate: number; amount: number; original: number; input: Record<string, unknown> } | { ok: false; code: string; message: string };
const MESSAGES: Readonly<Record<string, string>> = {
  NOT_FOUND: "이 세운 책의 할인을 찾지 못했어요. 내 서재에서 다시 열어 주세요.", REFUNDED: "환불된 세운 주문에는 대운 할인을 쓸 수 없어요.",
  EXPIRED: "대운 할인은 세운 결제 뒤 7일 안에만 쓸 수 있어요.", USED: "이 세운 주문의 대운 할인은 이미 쓰였어요.", INPUT_EXPIRED: "세운 입력 정보 보관 기간이 지나 할인을 이어 쓸 수 없어요.",
  NOT_SAME: "대운 할인은 세운과 같은 사람 입력에만 쓸 수 있어요.", LOGIN: "로그인한 뒤 내 세운 책에서 이어 주세요.",
};
export const discountMessage = (code: string) => MESSAGES[code] ?? "대운 할인을 확인하지 못했어요. 잠시 뒤 다시 시도해 주세요.";

/** 판정(호출 1회): 세운 주문 조건 → 같은 사람 → 금액. majorPerson이 없으면(바로 이어 보기 화면) 사람 대조 없이 입력을 돌려준다. */
export async function quoteMajorDiscount(store: OpsStore, a: { annualReportId: string; userId: string | null; price: number; majorPerson?: PersonLike }): Promise<MajorDiscountQuote> {
  if (!a.userId) return { ok: false, code: "LOGIN", message: discountMessage("LOGIN") };
  const r = await store.call("check", { annualReportId: a.annualReportId, userId: a.userId });
  if (r.ok !== true) { const code = typeof r.code === "string" ? r.code : "FAILED"; return { ok: false, code, message: discountMessage(code) }; }
  const input = (r.input ?? {}) as { person?: PersonLike };
  if (a.majorPerson && !samePerson(input.person, a.majorPerson)) return { ok: false, code: "NOT_SAME", message: discountMessage("NOT_SAME") };
  const rate = majorDiscountRate();
  return { ok: true, annualOrderId: String(r.annualOrderId), until: String(r.until), rate, amount: discountedAmount(a.price, rate), original: a.price, input: input as Record<string, unknown> };
}
export async function reserveMajorDiscount(store: OpsStore, q: Extract<MajorDiscountQuote, { ok: true }>, majorOrderId: string, userId: string): Promise<boolean> {
  const r = await store.call("reserve", { annualOrderId: q.annualOrderId, majorOrderId, userId, rate: q.rate, amount: q.amount, originalAmount: q.original });
  return r.ok === true;
}
