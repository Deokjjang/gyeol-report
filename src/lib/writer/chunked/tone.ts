/**
 * AM2-10 2부 7 — 달 · 해 기조 한 줄(결정론). 화면 카드(bookAm 오르는 쪽 · 조심할 쪽 칩)와 작가 key 지시(「이 달 기조」)가 같은 함수를 쓴다.
 * 가벼운 모듈이다(화면 코드가 가져온다) — 다른 무거운 모듈을 가져오지 않는다.
 */
import type { TimelineEntry } from "@/lib/brief/schema";

const FLOW_MEAN: Readonly<Record<number, string>> = { 1: "속도를 늦추고 버티는 달", 2: "잔잔하게 다지는 달", 3: "크게 출렁이지 않는 달", 4: "움직임이 많아지는 달", 5: "일이 한꺼번에 몰리기 쉬운 달" };
const DOMAIN_KO: Readonly<Record<string, string>> = { love: "연애", money: "돈", work: "일", people: "사람", mind: "마음" };
export type Tone = { readonly flow: string; readonly up: readonly string[]; readonly care: readonly string[]; readonly gongmang: boolean; readonly side: "good" | "care" | "mixed"; readonly line: string };
/** 달 · 해 기조(엔진 값 하나에서): 흐름 말 · 오르는 영역 · 조심할 영역 · 공망 → 맺는 쪽. 화면 카드와 key 지시가 이 줄을 쓴다(등급 낱말 없이). */
export function toneOf(e: Pick<TimelineEntry, "flow" | "signals" | "badges"> & { readonly kind?: string }): Tone {
  const unit = e.kind === "year" ? "해" : "달";
  const order = ["love", "money", "work", "people", "mind"];
  const sig = (e.signals ?? {}) as Readonly<Record<string, string>>;
  const up = order.filter(d => sig[d] === "↑").map(d => DOMAIN_KO[d]), care = order.filter(d => sig[d] === "↓").map(d => DOMAIN_KO[d]);
  const gongmang = (e.badges ?? []).some(b => /공망/.test(b.label));
  const side: Tone["side"] = care.length && !up.length ? "care" : up.length && !care.length && !gongmang ? "good" : up.length || care.length || gongmang ? "mixed" : "good";
  const flow = (FLOW_MEAN[e.flow?.score ?? 3] ?? FLOW_MEAN[3]).replace(/달$/, unit);
  const end = side === "good" ? "좋은 쪽으로 맺는다" : side === "care" ? "살피는 쪽으로 맺는다" : "좋은 쪽과 조심할 쪽을 나눠 맺는다";
  const line = [flow, up.length ? `기운이 오르는 쪽은 ${up.join("·")}` : "크게 오르는 쪽 없음", care.length ? `조심할 쪽은 ${care.join("·")}` : "조심할 쪽 없음", ...(gongmang ? ["힘이 빠져나가기 쉬운 빈자리(공망)가 있음"] : [])].join(" · ");
  return { flow, up, care, gongmang, side, line: `${line} → ${end}(지킬 것, 본문에 옮기지 않음)` };
}
