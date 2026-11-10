/**
 * 세운 × 원국(+ 지금 대운) 관계 엔진 카드(AM 1-1 ①·2부). 4종 브리프의 흐름·시기 장과 세운 상품이 같은 코드를 쓴다.
 * - 관계는 엔진(detections)이 찾은 것만. 없으면 카드도 근거도 없다(작가가 지어내지 않게).
 * - 해 이름은 「2026년 병오년」(연도 + 간지). 「올해·지금」으로 묶지 않는다(책은 발행일 기준이라 나중에 읽으면 어긋난다).
 * - 충은 나쁨, 합은 좋음으로 단정하지 않는다: 관계마다 쓸 거리와 살필 거리를 함께 준다.
 * 자리의 뜻(해 = 뿌리·바깥, 달 = 일터·사회, 날 = 나·가까운 사람, 시각 = 아랫사람·혼자 쓰는 시간)은 명리 통용 해석(궁위론)이다.
 */
import { HEAVENLY_STEMS } from "@/lib/saju/constants";
import { analyzeIncoming, detectRelations, getAnnualPillar } from "@/lib/saju/detections";
import type { RelationHit } from "@/lib/saju/detections/types";
import type { Pillar, SajuCalcResult } from "@/lib/saju/types";
import { sajuYearAt } from "./chart";
import type { Knowledge } from "./knowledge";
import { HALF_HAP_PLAIN, halfHapLine, josa, tenGodLabel } from "./labels";
import type { Material } from "./schema";

type Evidence = Extract<Material, { kind: "evidence" }>;
type Seat = "year" | "month" | "day" | "hour" | "dayun";

const HANGUL: Readonly<Record<string, string>> = { 甲: "갑", 乙: "을", 丙: "병", 丁: "정", 戊: "무", 己: "기", 庚: "경", 辛: "신", 壬: "임", 癸: "계", 子: "자", 丑: "축", 寅: "인", 卯: "묘", 辰: "진", 巳: "사", 午: "오", 未: "미", 申: "신", 酉: "유", 戌: "술", 亥: "해" };
const glyph = (c: string) => `${HANGUL[c] ?? c}(${c})`;
const isStem = (c: string) => (HEAVENLY_STEMS as readonly string[]).includes(c);

/** 자리 이름과 그 자리가 맡는 삶의 영역(명리 통용 궁위). 날은 하늘 글자 = 나 자신, 땅 글자 = 가장 가까운 사람(배우자 자리). */
export const SEAT_AREA: Readonly<Record<Seat, { readonly name: string; readonly stem: string; readonly branch: string }>> = {
  year: { name: "태어난 해", stem: "뿌리·바깥 모임·윗사람", branch: "뿌리·바깥 모임·윗사람" },
  month: { name: "태어난 달", stem: "일터·사회생활", branch: "일터·사회생활·집안 어른" },
  day: { name: "태어난 날", stem: "나 자신", branch: "나와 가장 가까운 사람의 자리(배우자 자리)" },
  hour: { name: "태어난 시각", stem: "아랫사람·혼자 쓰는 시간", branch: "아랫사람·자녀·혼자 쓰는 시간" },
  dayun: { name: "지금 대운", stem: "지금 10년의 흐름", branch: "지금 10년의 흐름" },
};

/** 관계마다 양면 읽기(쓸 거리 · 살필 거리). 좋음·나쁨 단정 금지(AM 1-1 ①). */
const TWO_SIDES: Readonly<Record<string, { readonly name: string; readonly use: string; readonly watch: string }>> = {
  CHUNG: { name: "충(마주 서서 부딪침)", use: "그 자리의 일을 바꾸고 새로 짤 계기", watch: "흔들리는 만큼 일정·마음이 오르내리기 쉬움" },
  STEM_CHUNG: { name: "천간충(하늘 글자끼리 부딪침)", use: "생각을 고쳐 잡을 계기", watch: "마음속 두 방향이 맞서기 쉬움" },
  YUKHAP: { name: "육합(땅 글자끼리 맞물림)", use: "그 자리의 사람·일과 붙고 묶이기 쉬움", watch: "묶이는 만큼 매이고 미루기 쉬움" },
  STEM_HAP: { name: "천간합(하늘 글자끼리 끌려 묶임)", use: "마음이 한쪽으로 끌려 약속이 생기기 쉬움", watch: "끌리는 쪽에 기운을 다 쓰기 쉬움" },
  SAMHAP: { name: "삼합(세 글자가 한 기운으로 모임)", use: "한 기운 쪽으로 힘이 크게 모임", watch: "한쪽으로 쏠려 다른 일을 놓치기 쉬움" },
  BANGHAP: { name: "방합(한 계절 세 글자가 모임)", use: "한 계절 기운이 크게 모임", watch: "한쪽으로 쏠리기 쉬움" },
  HYEONG: { name: "형(서로 깎고 다듬는 마찰)", use: "손볼 일이 드러나 다듬을 수 있음", watch: "가까운 데서 마찰이 생기기 쉬움" },
  PA: { name: "파(맞춰 둔 것에 금이 감)", use: "계획을 다시 맞출 기회", watch: "정해 둔 약속이 어긋나기 쉬움" },
  HAE: { name: "해(가까운 사이의 작은 서운함)", use: "말하지 않던 서운함을 꺼낼 때", watch: "작은 말이 서운함으로 남기 쉬움" },
  WONJIN: { name: "원진(이유 없이 거슬리는 엇박자)", use: "서로 속도가 다르다는 걸 알아챌 때", watch: "이유 없이 거슬리는 엇박자가 생기기 쉬움" },
};
/** 관계 무게(근거 줄 순서): 날 > 달 > 해 > 시각, 충·합 > 형·파·해·원진. */
const SEAT_W: Readonly<Record<Seat, number>> = { day: 4, month: 3, dayun: 2.5, year: 2, hour: 1 };
const KIND_W: Readonly<Record<string, number>> = { CHUNG: 3, YUKHAP: 3, STEM_HAP: 3, STEM_CHUNG: 2, SAMHAP: 2, BANGHAP: 2, HYEONG: 2, PA: 1, HAE: 1, WONJIN: 1 };

export type YearRelationItem = {
  readonly kind: string; readonly name: string; readonly half: boolean;
  /** 엮인 원국 자리(대운 포함)와 그 자리 글자. */
  readonly seats: readonly { readonly seat: Seat; readonly char: string; readonly area: string }[];
  readonly incoming: string; readonly picture: string; readonly use: string; readonly watch: string; readonly weight: number;
};
export type YearRelationCard = {
  readonly year: number; readonly name: string; readonly hanja: string;
  readonly tenGod: { readonly stem: string; readonly branch: string };
  readonly relations: readonly YearRelationItem[];
};

/** 4종 브리프가 다룰 해: 발행 시각의 세운 해(입춘 기준) + 11월~다음 해 입춘 전 발행이면 다음 해. */
export function relationYears(baseDate: string): number[] {
  const { year } = sajuYearAt(baseDate), [cy, cm] = baseDate.split("-").map(Number);
  return cm >= 11 || year < cy ? [year, year + 1] : [year];
}

/** 해 이름: "2026년 병오년(丙午年)". */
export const yearName = (year: number, p: Pillar = getAnnualPillar(year)) => `${year}년 ${HANGUL[p.stem]}${HANGUL[p.branch]}년(${p.stem}${p.branch}年)`;

function itemsOf(hits: readonly RelationHit[], incomingPos: string, k: Knowledge, seatOf: (pos: string) => Seat | null): YearRelationItem[] {
  const out: YearRelationItem[] = [];
  for (const h of hits) {
    const two = TWO_SIDES[h.kind]; if (!two) continue;
    const inc = h.members.filter(m => m.position === incomingPos);
    const seats = h.members.filter(m => m.position !== incomingPos).flatMap(m => { const s = seatOf(m.position); return s ? [{ seat: s, char: m.char as string, area: isStem(m.char) ? SEAT_AREA[s].stem : SEAT_AREA[s].branch }] : []; });
    if (!inc.length || !seats.length) continue;
    const half = (h.kind === "SAMHAP" || h.kind === "BANGHAP") && h.completeness !== "full";
    const pairs = [h.key, [...h.key].reverse().join("")];
    const badge = k.badges.find(b => b.kind === h.kind && b.pair !== undefined && pairs.includes(b.pair)) ?? k.badges.find(b => b.kind === h.kind && b.pair === undefined);
    const picture = badge ? (half ? halfHapLine(badge.line) : badge.line).replace(/ (해|흐름)$/, "") : "";
    // 같은 관계가 여러 자리와 걸리면(예: 寅午戌이 해·시각 모두) 한 줄로 묶는다.
    const same = out.find(x => x.kind === h.kind && x.incoming === inc.map(m => glyph(m.char)).join("·") && x.picture === picture);
    if (same) { (same.seats as { seat: Seat; char: string; area: string }[]).push(...seats.filter(s => !same.seats.some(y => y.seat === s.seat && y.char === s.char))); continue; }
    out.push({ kind: h.kind, name: half ? `${HALF_HAP_PLAIN}` : two.name, half, seats, incoming: inc.map(m => glyph(m.char)).join("·"), picture, use: two.use, watch: two.watch,
      weight: Math.max(...seats.map(s => SEAT_W[s.seat])) * 10 + (KIND_W[h.kind] ?? 0) - (half ? 1 : 0) });
  }
  return out.sort((a, b) => b.weight - a.weight);
}

/** 세운 카드 하나: 원국과의 관계(+ 지금 대운 기둥이 있으면 세운×대운). 같은 해의 같은 카드는 같은 입력에서 늘 같다. */
export function yearRelationCard(saju: SajuCalcResult, k: Knowledge, year: number, dayun?: Pillar): YearRelationCard {
  const p = getAnnualPillar(year), inc = analyzeIncoming(saju, "annual", p);
  const natal = itemsOf(inc.relations, "annual", k, pos => (pos === "year" || pos === "month" || pos === "day" || pos === "hour" ? pos : null));
  const withDayun = dayun ? itemsOf(detectRelations([{ position: "dayun", pillar: dayun }, { position: "annual", pillar: p }]), "annual", k, pos => (pos === "dayun" ? "dayun" : null)) : [];
  return { year, name: yearName(year, p).replace(/\(.*\)$/, ""), hanja: `${p.stem}${p.branch}`, tenGod: { stem: tenGodLabel(inc.stemTenGod), branch: tenGodLabel(inc.branchTenGod) }, relations: [...natal, ...withDayun] };
}

/** 관계 한 줄(작가 근거·카드 공용): "2026년 병오년의 오(午)가 태어난 달 땅 글자 자(子)와 충(마주 서서 부딪침) — 일터·사회생활 자리. 그림: … · 쓸 거리: … · 살필 거리: …". */
export function relationLine(card: Pick<YearRelationCard, "name">, r: YearRelationItem, opts: { picture?: boolean } = {}): string {
  const where = r.seats.map(s => `${SEAT_AREA[s.seat].name} ${isStem(s.char) ? "하늘" : "땅"} 글자 ${glyph(s.char)}`).join("·");
  const areas = [...new Set(r.seats.map(s => s.area))].join("·");
  return `${card.name}의 ${r.incoming}${josa(r.incoming, "이가").slice(-1)} ${where}${josa(where, "과와").slice(-1)} ${r.name} — ${areas} 자리. ${opts.picture !== false && r.picture ? `그림: ${r.picture} · ` : ""}쓸 거리: ${r.use} · 살필 거리: ${r.watch}`;
}

const NOTE = "해는 「2026년 병오년」처럼 연도와 이름으로(「올해·지금」 금지). 충=나쁨·합=좋음 단정 없이 쓸 거리·살필 거리를 함께, 그 자리의 장면 하나로. 사건 단정 금지";

/** 4종 근거(AM 1-1 ①): 관계가 있는 해만, 해마다 무게 가장 큰 관계 하나(토큰 상한 — 세운 상품은 전체 관계를 쓴다). who: 궁합에서 사람 이름. */
export function yearRelationEvidence(saju: SajuCalcResult, k: Knowledge, baseDate: string, who?: string): Evidence | null {
  const facts = relationYears(baseDate).flatMap(y => {
    const card = yearRelationCard(saju, k, y);
    const top = card.relations.slice(0, 1);
    return top.length ? [`${who ? `${who}: ` : ""}${top.map(r => relationLine(card, r, { picture: false })).join(" / ")}`] : [];
  });
  return facts.length ? { kind: "evidence", key: "yearRelation", facts, note: NOTE } : null;
}

/** 두 사람 근거(궁합): 사람마다 한 줄씩, 둘 다 없으면 없음. */
export function pairYearRelationEvidence(people: readonly { readonly saju: SajuCalcResult; readonly who: string }[], k: Knowledge, baseDate: string): Evidence | null {
  const facts = people.flatMap(p => yearRelationEvidence(p.saju, k, baseDate, p.who)?.facts ?? []);
  return facts.length ? { kind: "evidence", key: "yearRelation", facts, note: `${NOTE}. 두 사람에게 같은 해가 다르게 닿는 점을 한 장면으로 잇는다` } : null;
}
