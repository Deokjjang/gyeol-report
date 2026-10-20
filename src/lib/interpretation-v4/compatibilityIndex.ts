import type { PairEvidence } from "./compatibilityEvidence";
import type { PairCategory } from "./compatibilityNarrativeTypes";
import { BIPOLAR_AXES, type InterpretationContext, type SemanticAxis } from "./semanticCore";
import { buildMbtiSemanticProfile, type MbtiSemanticProfile } from "./mbtiSemanticProfile";

export const COMPATIBILITY_INDEX_VERSION = "gyeol-compatibility-index-full-refinement-02" as const;

/** Product editorial weights, NOT empirical probabilities or a new saju
 * calculator. Subscore maxima never change. Category changes the contribution
 * of observed factors inside each subscore, not a category bonus. */
export const COMPATIBILITY_INDEX_PROFILES: Record<PairCategory, { complement: number; harmony: number; tension: number; shared: number; repair: number }> = {
  love: { complement: 1.2, harmony: 1.2, tension: 1, shared: 1, repair: 1 },
  marriage: { complement: 1, harmony: 1, tension: 1.4, shared: 1.1, repair: 1.4 },
  parentChild: { complement: 1.1, harmony: .9, tension: 1.1, shared: .8, repair: 1.5 },
  coworker: { complement: 1.3, harmony: .8, tension: 1.2, shared: .9, repair: 1.1 },
  managerReport: { complement: 1.1, harmony: .7, tension: 1.4, shared: .8, repair: 1.4 },
  businessPartner: { complement: 1.4, harmony: .8, tension: 1.5, shared: 1, repair: 1.5 },
  friendship: { complement: .9, harmony: 1, tension: .8, shared: 1.5, repair: 1.2 },
};
type Contribution = { factor: string; value: number; sources: string[] };
export type CompatibilityIndex = {
  version: "gyeol-compatibility-index-13b-1" | typeof COMPATIBILITY_INDEX_VERSION; total: number; max: 100;
  versionLabel?: string; explanations?: string[];
  scores: { label: string; value: number; max: number; factors: Contribution[] }[];
  verdict: string; notice: string; limitations: string[]; category: PairCategory;
};
const bound = (n: number, max: number) => Math.round(Math.min(max, Math.max(0, n)));
/** Normalize only reviewed source contributions, never four-letter priors.
 * Net/total retains ambiguity when a source supports both directions. */
function sourceRhythm(p: MbtiSemanticProfile, context: InterpretationContext, axis: SemanticAxis) {
  const ids = new Set(p.sourceNodes.filter(n => n.classification === "SCORING_SEMANTIC").map(n => n.id));
  const rows = p.contributions.filter(c => c.axis === axis && c.contexts.includes(context) && c.sourceType !== "dimension_prior"
    && c.annotationConfidence !== "REFERENCE_ONLY" && ids.has(c.sourceNodeId) && ["direct", "inferred"].includes(c.sourceCoverage ?? ""));
  const magnitude = rows.reduce((n, c) => n + Math.abs(c.effectiveValue), 0);
  const net = rows.reduce((n, c) => n + c.effectiveValue, 0);
  return magnitude && net ? { direction: net / magnitude, sources: [...new Set(rows.map(c => c.sourceNodeId))] } : null;
}

export function buildCompatibilityIndex(e: PairEvidence): CompatibilityIndex {
  const profile = COMPATIBILITY_INDEX_PROFILES[e.category], people = [e.persons.personA, e.persons.personB];
  const element: Contribution[] = [], natal: Contribution[] = [], mbti: Contribution[] = [], recovery: Contribution[] = [];
  const add = (out: Contribution[], factor: string, value: number, sources: string[]) => out.push({ factor, value, sources: [...new Set(sources)].sort() });
  const yy = people.map(p => p.yinYang);
  const complete = yy.every(y => y.complete);
  const complements = (complete ? people : []).flatMap((a, i) => a.materials.symbolicElements.flatMap(high => {
    const low = people[1 - i].materials.symbolicElements.find(v => v.element === high.element && v.state === "low");
    return high.state === "high" && low ? [{ element: high.element, sources: [...high.sourceRefs, ...low.sourceRefs] }] : [];
  }));
  if (complements.length) add(element, "부족한 오행을 서로 보탬", Math.min(3, complements.length) * 2 * profile.complement, complements.flatMap(c => c.sources));
  const commonExcess = (complete ? people[0].materials.symbolicElements : []).filter(v => v.state === "high" && people[1].materials.symbolicElements.some(w => w.element === v.element && w.state === "high"));
  if (commonExcess.length) add(element, "같은 오행으로 치우침", -Math.min(2, commonExcess.length) * 1.5, commonExcess.flatMap(v => [...v.sourceRefs, ...people[1].materials.symbolicElements.filter(other => other.element === v.element && other.state === "high").flatMap(other => other.sourceRefs)]));
  const directions = Object.values(e.directions);
  const generated = directions.filter(d => d.element && ["generates", "generated_by"].includes(d.element.relation));
  if (generated.length) add(element, "일간 오행이 서로 생조", 3, generated.map(d => `daymaster-element:${d.relationId}`));
  if (complete) {
    const opposite = yy[0].direction !== "mixed" && yy[1].direction !== "mixed" && yy[0].direction !== yy[1].direction;
    if (opposite) add(element, "음양 리듬 보완", 2 * profile.complement, yy.flatMap(y => y.provenance));
    if (yy.every(y => Math.abs(y.yin - y.yang) >= 6) && yy[0].direction === yy[1].direction)
      add(element, "동일한 음양 극단", -3, yy.flatMap(y => y.provenance));
  }
  // Repeated placements of the same branch relation cannot farm points.
  const uniqueRelations = [...new Map(e.relations.map(r => [`${r.kind}:${[...new Set(r.refs.map(v => v.branch))].sort().join("")}`, r])).values()];
  // A half-harmony nested in an already counted trine is the same support,
  // not an independent second reward. Canonical relations stay untouched.
  const relations = uniqueRelations.filter(r => r.kind !== "half_harmony" || !uniqueRelations.some(full => full.kind === "three_harmony"
    && r.refs.every(ref => full.refs.some(f => f.branch === ref.branch))));
  const harmonies = relations.filter(r => ["six_harmony", "three_harmony", "half_harmony"].includes(r.kind));
  const tensions = relations.filter(r => ["clash", "harm"].includes(r.kind));
  if (harmonies.length) add(natal, "이어지는 명리 관계", 12 * (1 - Math.exp(-harmonies.reduce((n, r) => n + (r.kind === "three_harmony" ? 4 : r.kind === "six_harmony" ? 3 : 2), 0) / 5)) * profile.harmony, harmonies.map(r => r.identity));
  if (tensions.length) add(natal, "부딪히는 명리 관계", -14 * (1 - Math.exp(-tensions.reduce((n, r) => n + (r.kind === "clash" ? 3 : 2) * (r.refs.every(v => v.position === "day") ? 1.5 : 1), 0) / 7)) * profile.tension, tensions.map(r => r.identity));
  const reciprocal = directions.filter(d => d.receivedTenGod && ["정인", "식신", "정관", "정재"].includes(d.receivedTenGod.tenGodKo));
  if (reciprocal.length) add(natal, "돌봄·표현·책임의 자극", reciprocal.length * profile.complement, reciprocal.map(d => `received-ten-god:${d.relationId}:${d.receivedTenGod!.tenGodKo}`));
  // Natal helpers are NOT evidence that the partner is one's destined helper.
  const pairs = directions.flatMap(d => d.mbtiPair ? [d.mbtiPair] : []);
  const refs = pairs.map(p => p.evidenceId);
  if (pairs.length) {
    const context: InterpretationContext = ["love", "marriage"].includes(e.category) ? "love"
      : ["coworker", "managerReport", "businessPartner"].includes(e.category) ? "work" : "social";
    const semantic = people.map(p => { const result = buildMbtiSemanticProfile(p.mbti); return result.ok ? result.value : null; });
    if (semantic.every(p => p?.available)) {
      const axes = BIPOLAR_AXES.flatMap(axis => {
        const a = sourceRhythm(semantic[0]!, context, axis), b = sourceRhythm(semantic[1]!, context, axis);
        if (!a || !b) return [];
        const gap = Math.abs(a.direction - b.direction);
        // Agreement with weak/contradictory source direction earns less, not
        // a perfect match. Difference is adjustment, never a failure forecast.
        return [{ axis, gap, alignment: (1 - gap) * Math.min(Math.abs(a.direction), Math.abs(b.direction)), sources: [...a.sources, ...b.sources] }];
      });
      const labels: Record<typeof BIPOLAR_AXES[number], string> = {
        ACTION_TEMPO: "움직이기 전 살피는 속도", ENERGY_DIRECTION: "에너지를 나누고 모으는 방식",
        STRUCTURE_STYLE: "계획과 여지를 두는 방식", COMMUNICATION_STYLE: "말을 전하는 방식",
        CHANGE_ORIENTATION: "익숙함과 새로움을 고르는 방식", DECISION_STYLE: "결정을 맺는 속도",
        RELATION_STYLE: "함께할 거리", RISK_STYLE: "도전을 고르는 기준",
      };
      if (axes.length >= 2) for (const axis of axes) add(mbti, labels[axis.axis],
        7 * axis.alignment * (axis.alignment >= 0 ? profile.shared : profile.tension) / axes.length,
        [...refs, ...axis.sources]);
      const differences = axes.filter(a => a.gap > .75);
      if (differences.length && pairs.every(p => p.repairStrategy?.length)) add(recovery, "확인된 반응 차이에 쓸 대화 방법",
        Math.min(3, differences.length) * .5 * profile.repair,
        [...refs.map(id => `${id}:repairStrategy`), ...differences.flatMap(a => a.sources)]);
    }
  }
  if (complements.length) add(recovery, "차이를 역할로 바꿀 여지", Math.min(2, complements.length), complements.flatMap(c => c.sources));
  // Tensions were already counted in the natal domain; do not deduct again
  // merely because several relationships describe the same pair.
  const scores = [
    { label: "오행·음양", max: 30, factors: element, base: 15 },
    { label: "명리 관계", max: 35, factors: natal, base: 17 },
    { label: "MBTI", max: 25, factors: mbti, base: 13 },
    { label: "회복력", max: 10, factors: recovery, base: 5 },
  ].map(({ base, ...s }) => ({ ...s, value: bound(base + s.factors.reduce((n, f) => n + f.value, 0), s.max) }));
  const total = scores.reduce((n, s) => n + s.value, 0);
  const explanations = scores.map(s => {
    const good = s.factors.filter(f => f.value > .01).map(f => f.factor), adjust = s.factors.filter(f => f.value < -.01).map(f => f.factor);
    return `${s.label} ${s.value}/${s.max}점 — ${good.length ? `함께 살필 좋은 조건은 ${good.join("·")}입니다` : "확인된 가산 근거가 없는 부분은 중립으로 남겼습니다"}${adjust.length ? `; ${adjust.join("·")} 항목은 조율이 필요한 조건으로 반영했습니다` : "; 자료가 적다는 이유로 단점을 만들어 감점하지 않습니다"}.`;
  });
  return { version: COMPATIBILITY_INDEX_VERSION, versionLabel: "해석 지수 2판", explanations, total, max: 100, scores, category: e.category,
    verdict: harmonies.length && tensions.length ? "맞물리는 힘과 부딪히는 속도가 함께 있습니다. 좋은 부분을 살리되 조율할 약속은 분명해야 해요."
      : harmonies.length ? "함께 움직이며 서로의 장점을 살릴 여지가 분명합니다. 차이를 역할로 나눠 쓸 때 더 편해져요."
        : tensions.length ? "서로 다른 속도를 이해하는 것이 먼저입니다. 끌림만큼 일상의 약속을 구체적으로 맞춰야 해요."
          : "지수보다 두 사람이 실제로 주고받는 반응을 함께 보세요. 아래의 방향별 이야기에서 관계의 쓰임을 찾을 수 있어요.",
    notice: "명리·MBTI의 확인된 관계를 묶은 상징적 해석 지수이며, 관계의 성공 확률이나 두 사람의 실제 행동에 대한 평가가 아닙니다.",
    limitations: ["관계의 성공 확률이나 검증된 심리검사 점수가 아닙니다. 자료가 없는 항목은 중립값이며 좋은 근거로 가산하지 않습니다.",
      ...(!pairs.length ? ["이 조합의 MBTI 관계 자료가 부족해 해당 항목은 중립으로 두었습니다."] : []),
      ...(yy.some(y => !y.complete) ? ["출생시간이 불확실한 사람의 오행 부족·음양 보완은 점수에 사용하지 않았습니다."] : []),
      "같은 지지 관계의 반복과 삼합 안의 반합은 중복 가산하지 않으며, 충돌을 회복력에서 다시 감점하지 않습니다.",
      "MBTI는 해당 관계에 맞는 기존 자료의 행동 선호를 비교하며, 문장의 개수나 유형 이름에 붙은 궁합 등급을 점수로 바꾸지 않습니다.",
      "회복력은 차이를 조율할 자료와 보완 조건의 여지이며 실제로 화해했다는 뜻은 아닙니다.",
      "두 사람 사이의 천간합·형·파·원진·방합은 현재 검증된 교차 근거가 없어 반영하지 않았습니다."] };
}
