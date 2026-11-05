/**
 * 궁합 점수 표시(최종판3 7). 계산(score.ts)은 그대로 두고, 점수 쪽·브리프에서 "줄 합 = 총점"이 되게 기본점 줄을 만든다.
 * 총점 = 기본 40 + 항목 합(만점 60)이라, 항목 막대만 보이면 39/60 ↔ 79/100처럼 합이 총점과 달라 보였다.
 */
import { koCount } from "@/lib/brief/labels";

export const BASE_POINTS = 40;
export const BASE_ROW_NAME = "기본점";
export type BaseRow = { readonly name: typeof BASE_ROW_NAME; readonly points: number; readonly max: number; readonly reason: string };

/** 기본점 줄의 이유(2문장, 최종 A-10): 시작 점수 40점 + 항목(60점) = 총점. 계산은 그대로. */
export const baseReason = (itemCount: number, itemSum: number, total: number) =>
  `시작 점수 ${BASE_POINTS}점에 아래 ${koCount(itemCount, "항목")}(60점)을 더해요. 이번 항목 점수는 ${itemSum}점이라 총점은 ${total}점이에요.`;
/** 예전 문구(최종판3 7) — 기본점 줄 없이 저장된 옛 v2 Book을 화면에서 그릴 때만 쓴다(과거 Book 화면 변화 0). */
export const legacyBaseReason = (itemCount: number, itemSum: number, total: number) =>
  `기본점은 두 사람 누구에게나 똑같이 주는 ${BASE_POINTS}점이에요. 여기에 아래 ${koCount(itemCount, "항목")}의 점수 ${itemSum}점(60점 만점)을 더해 총점 ${total}점이 돼요.`;

/**
 * 점수 쪽 맨 앞에 둘 기본점 줄. 이미 기본점 줄이 있거나, 항목 합 + 40이 총점과 다르면(옛 v2 MBTI 환산 Book) null — 합이 맞지 않는 줄은 만들지 않는다.
 * 새 Book은 브리프(score.components)부터 이 줄을 싣고, 저장된 v2·v2.1·v2.2 Book은 화면이 이 함수로 붙인다(저장본은 바꾸지 않는다).
 */
export function baseRowOf(total: number, rows: readonly { readonly name: string; readonly points: number }[]): BaseRow | null {
  if (rows.some(r => r.name === BASE_ROW_NAME)) return null;
  const sum = rows.reduce((n, r) => n + r.points, 0);
  if (sum + BASE_POINTS !== total) return null;
  return { name: BASE_ROW_NAME, points: BASE_POINTS, max: BASE_POINTS, reason: legacyBaseReason(rows.length, sum, total) };
}
