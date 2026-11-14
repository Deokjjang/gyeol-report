/**
 * 두 사람 사이 관계 목록(최종판3 7, 결정론). 원국 감지와 같은 엔진 함수(detectRelations + detectStemClashes)를 두 사람 기둥 한 쌍마다 돌린다.
 * - 범위: 한 사람의 년·월·일·(시) 기둥 × 다른 사람의 년·월·일·(시) 기둥. 시간 미상인 사람의 시주는 보지 않는다(natalEntries).
 * - 천간충: 엔진 표 STEM_CHUNG_TABLE(甲庚·乙辛·丙壬·丁癸, 戊甲·己乙 미채택) 그대로. 원국 v5 만세력 표와 같은 기준이다.
 * - 반합: 삼합 세 글자 중 두 글자(엔진 SAMHAP completeness "half"). 두 사람 기둥 한 쌍에서는 세 글자 삼합이 나올 수 없어 늘 반합이다.
 * - 삼형(寅巳申·丑戌未): 두 사람 사이에서는 두 글자씩만 감지되므로(엔진 partial) 같은 삼형 묶음을 한 줄로 합친다.
 *   두 사람 글자에 세 글자가 다 모이면 full("삼형"), 두 글자뿐이면 partial("형").
 * - 같은 관계(같은 글자 짝·같은 관계 이름)가 한 사람의 여러 자리에 걸리면 한 줄로 합친다(P6e 20).
 * 궁합 점수(score.ts)는 이 목록이 아니라 일간끼리·일지끼리·연지끼리·월지끼리만 본다(점수 산식 그대로, 천간충은 점수에 없음).
 */
import { detectRelations, detectStemClashes, natalEntries } from "@/lib/saju/detections";
import type { ChartPosition, RelationKind } from "@/lib/saju/detections/types";
import type { SajuCalcResult } from "@/lib/saju/types";

export type PairRelation = {
  readonly kind: RelationKind;
  /** 관계 표의 글자 묶음(정렬): 육합 "子丑", 반합·삼형은 세 글자 묶음 "子申辰"·"丑戌未", 자형 "亥亥". */
  readonly key: string;
  /** 하늘 글자(천간합·천간충)인가. */
  readonly sky: boolean;
  /** 반합 = half, 삼형 세 글자가 두 사람 글자에 다 모임 = full, 두 글자만 = partial, 그 밖 = full. */
  readonly completeness: "full" | "half" | "partial";
  readonly subtype?: string;
  /** 각 사람에게서 관계에 든 자리(년·월·일·시 순). */
  readonly a: readonly ChartPosition[]; readonly b: readonly ChartPosition[];
  /** 관계에 든 글자(중복 없이, A 글자 먼저). */
  readonly chars: readonly string[];
  readonly group: "hap" | "friction";
  /** 영향 크기(관계 세기 + 두 사람 각자 가장 중요한 자리의 무게). 첫 쪽 "영향 큰 3개"가 이 순서다. */
  readonly impact: number;
  /** 짧은 관계 이름: 천간합·육합·반합·충·천간충·삼형·형·파·해·원진. */
  readonly name: string;
};

const ORDER: Readonly<Record<ChartPosition, number>> = { year: 0, month: 1, day: 2, hour: 3 };
/** 자리 무게: 날(일주 = 나 자신·생활 자리) 3 > 달(사회 자리) 2 > 해·시각 1. */
const PLACE: Readonly<Record<ChartPosition, number>> = { day: 3, month: 2, year: 1, hour: 1 };
const HAP_KINDS: readonly RelationKind[] = ["STEM_HAP", "YUKHAP", "SAMHAP", "BANGHAP"];
const sortKey = (s: string) => [...s].sort().join("");

/** 짧은 관계 이름(천간합·육합·반합·충·천간충·삼형·형·파·해·원진). 정답지 개수 대조(factsheet/check fact_count)도 이 이름으로 센다. */
export function relationName(kind: RelationKind, completeness: PairRelation["completeness"], subtype?: string): string { return nameOf(kind, completeness, subtype); }
/** 합 묶음(천간합·육합·삼합·방합)인가 — 나머지는 형·충·파·해(마찰). */
export const isHapKind = (kind: RelationKind): boolean => HAP_KINDS.includes(kind);
function nameOf(kind: RelationKind, completeness: PairRelation["completeness"], subtype?: string): string {
  if (kind === "HYEONG") return subtype === "삼형" && completeness === "full" ? "삼형" : "형";
  if (kind === "SAMHAP") return completeness === "half" ? "반합" : "삼합";
  return ({ STEM_HAP: "천간합", STEM_CHUNG: "천간충", YUKHAP: "육합", BANGHAP: "방합", CHUNG: "충", PA: "파", HAE: "해", WONJIN: "원진" } as Record<string, string>)[kind] ?? kind;
}
/** 관계 세기: 충·육합·세 글자 삼형 3, 천간합·천간충·원진·형(두 글자·상형·자형) 2, 반합·파·해 1. */
function weightOf(kind: RelationKind, completeness: PairRelation["completeness"]): number {
  if (kind === "CHUNG" || kind === "YUKHAP" || kind === "BANGHAP") return 3;
  if (kind === "HYEONG") return completeness === "full" ? 3 : 2;
  if (kind === "SAMHAP") return completeness === "half" ? 1 : 3;
  if (kind === "PA" || kind === "HAE") return 1;
  return 2;
}
const best = (ps: readonly ChartPosition[]) => Math.max(...ps.map(p => PLACE[p]));

type Raw = { kind: RelationKind; key: string; sky: boolean; completeness: "full" | "half" | "partial"; subtype?: string; a: ChartPosition[]; b: ChartPosition[]; chars: string[]; order: number };

/** 두 사람 사이 관계 전체(영향 큰 순). 정답지·브리프·화면이 같은 목록을 쓴다. */
export function pairRelations(a: SajuCalcResult, b: SajuCalcResult): PairRelation[] {
  const raw: Raw[] = [];
  // 예전 순서(날–날 먼저, 그다음 날이 낀 짝, 하늘 글자는 땅 글자 뒤)를 같은 영향일 때의 순서로 쓴다.
  const POS: readonly ChartPosition[] = ["day", "month", "year", "hour"];
  const ea = natalEntries(a), eb = natalEntries(b);
  for (const pa of POS) for (const pb of POS) {
    const x = ea.find(e => e.position === pa), y = eb.find(e => e.position === pb);
    if (!x || !y) continue;
    const pair = [{ position: "year" as const, pillar: x.pillar }, { position: "month" as const, pillar: y.pillar }];
    for (const r of [...detectRelations(pair), ...detectStemClashes(pair)]) {
      const sky = r.kind === "STEM_HAP" || r.kind === "STEM_CHUNG";
      const rank = (pa === "day" ? 0 : 2) + (pb === "day" ? 0 : 2) + (sky ? 1 : 0);
      raw.push({ kind: r.kind, key: sortKey(r.key), sky, completeness: r.completeness, ...(r.subtype ? { subtype: r.subtype } : {}), a: [pa], b: [pb], chars: r.members.map(m => m.char), order: rank * 100 + raw.length });
    }
  }
  // 삼형 묶음은 한 줄로(두 사람 글자 전체에서 세 글자가 다 모였는지 본다).
  const samhyeong = new Map<string, Raw>();
  const rest: Raw[] = [];
  for (const r of raw) {
    if (r.kind !== "HYEONG" || r.subtype !== "삼형") { rest.push(r); continue; }
    const m = samhyeong.get(r.key);
    if (!m) samhyeong.set(r.key, { ...r, a: [...r.a], b: [...r.b], chars: [...r.chars] });
    else { m.a = [...new Set([...m.a, ...r.a])]; m.b = [...new Set([...m.b, ...r.b])]; m.chars = [...new Set([...m.chars, ...r.chars])]; m.order = Math.min(m.order, r.order); }
  }
  for (const m of samhyeong.values()) m.completeness = new Set(m.chars).size >= 3 ? "full" : "partial";
  // 같은 관계가 한 사람의 여러 자리에 걸리면 한 줄로(P6e 20): B 자리를 먼저 묶고 A 자리를 묶는다.
  const merge = (rows: Raw[], side: "a" | "b"): Raw[] => {
    const other = side === "a" ? "b" : "a", by = new Map<string, Raw>();
    for (const r of rows) {
      const g = `${r.kind}|${r.key}|${r.sky}|${r.subtype ?? ""}|${r[other].join(",")}`;
      const m = by.get(g);
      if (!m) by.set(g, { ...r, a: [...r.a], b: [...r.b], chars: [...r.chars] });
      else { m[side] = [...new Set([...m[side], ...r[side]])]; m.chars = [...new Set([...m.chars, ...r.chars])]; m.order = Math.min(m.order, r.order); }
    }
    return [...by.values()];
  };
  return [...merge(merge(rest, "b"), "a"), ...samhyeong.values()]
    .map(r => {
      const a2 = [...r.a].sort((p, q) => ORDER[p] - ORDER[q]), b2 = [...r.b].sort((p, q) => ORDER[p] - ORDER[q]);
      return { r, row: { kind: r.kind, key: r.key, sky: r.sky, completeness: r.completeness, ...(r.subtype ? { subtype: r.subtype } : {}), a: a2, b: b2, chars: [...new Set(r.chars)],
        group: HAP_KINDS.includes(r.kind) ? "hap" as const : "friction" as const, impact: weightOf(r.kind, r.completeness) + best(a2) + best(b2), name: nameOf(r.kind, r.completeness, r.subtype) } };
    })
    .sort((p, q) => q.row.impact - p.row.impact || p.r.order - q.r.order)
    .map(x => x.row);
}

/** 묶음 요약 수(최종판3 7): 합 n가지 · 형·충·파·해 n가지, 관계 이름별 수(나온 순서: 합 → 마찰, 표 순서). */
const NAME_ORDER = ["천간합", "육합", "삼합", "방합", "반합", "삼형", "형", "충", "천간충", "원진", "파", "해"];
export function pairRelationCounts(rows: readonly PairRelation[]): { readonly hap: number; readonly friction: number; readonly byName: readonly (readonly [string, number])[] } {
  const by = new Map<string, number>();
  for (const r of rows) by.set(r.name, (by.get(r.name) ?? 0) + 1);
  return { hap: rows.filter(r => r.group === "hap").length, friction: rows.filter(r => r.group === "friction").length,
    byName: NAME_ORDER.filter(n => by.has(n)).map(n => [n, by.get(n)!] as const) };
}
