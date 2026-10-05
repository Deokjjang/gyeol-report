import type { PairEvidence } from "./compatibilityEvidence";
import type { PairCategory } from "./compatibilityNarrativeTypes";
import { compatibilityCharacter } from "./compatibilityCharacters";

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
  version: "gyeol-compatibility-index-13b-1"; total: number; max: 100;
  scores: { label: string; value: number; max: number; factors: Contribution[] }[];
  verdict: string; notice: string; limitations: string[]; category: PairCategory;
};
const bound = (n: number, max: number) => Math.round(Math.min(max, Math.max(0, n)));
const count = (v: readonly string[] | null | undefined) => Math.min(2, new Set(v ?? []).size);

export function buildCompatibilityIndex(e: PairEvidence): CompatibilityIndex {
  const profile = COMPATIBILITY_INDEX_PROFILES[e.category], people = [e.persons.personA, e.persons.personB];
  const element: Contribution[] = [], natal: Contribution[] = [], mbti: Contribution[] = [], recovery: Contribution[] = [];
  const add = (out: Contribution[], factor: string, value: number, sources: string[]) => out.push({ factor, value, sources: [...new Set(sources)].sort() });
  const complements = people.flatMap((a, i) => a.materials.symbolicElements.flatMap(high => {
    const low = people[1 - i].materials.symbolicElements.find(v => v.element === high.element && v.state === "low");
    return high.state === "high" && low ? [{ element: high.element, sources: [...high.sourceRefs, ...low.sourceRefs] }] : [];
  }));
  if (complements.length) add(element, "부족한 오행을 서로 보탬", Math.min(3, complements.length) * 2 * profile.complement, complements.flatMap(c => c.sources));
  const commonExcess = people[0].materials.symbolicElements.filter(v => v.state === "high" && people[1].materials.symbolicElements.some(w => w.element === v.element && w.state === "high"));
  if (commonExcess.length) add(element, "같은 오행으로 치우침", -Math.min(2, commonExcess.length) * 2, commonExcess.flatMap(v => v.sourceRefs));
  const directions = Object.values(e.directions);
  const generated = directions.filter(d => d.element && ["generates", "generated_by"].includes(d.element.relation));
  if (generated.length) add(element, "일간 오행이 서로 생조", 3, generated.map(d => `daymaster-element:${d.relationId}`));
  const yy = people.map(p => p.yinYang);
  if (yy.every(y => y.complete)) {
    const opposite = yy[0].direction !== "mixed" && yy[1].direction !== "mixed" && yy[0].direction !== yy[1].direction;
    if (opposite) add(element, "음양 리듬 보완", 2 * profile.complement, yy.flatMap(y => y.provenance));
    if (yy.every(y => Math.abs(y.yin - y.yang) >= 6) && yy[0].direction === yy[1].direction)
      add(element, "동일한 음양 극단", -3, yy.flatMap(y => y.provenance));
  }
  // Repeated placements of the same branch relation cannot farm points.
  const relations = [...new Map(e.relations.map(r => [`${r.kind}:${[...new Set(r.refs.map(v => v.branch))].sort().join("")}`, r])).values()];
  const harmonies = relations.filter(r => ["six_harmony", "three_harmony", "half_harmony"].includes(r.kind));
  const tensions = relations.filter(r => ["clash", "harm"].includes(r.kind));
  if (harmonies.length) add(natal, "이어지는 명리 관계", Math.min(8, harmonies.reduce((n, r) => n + (r.kind === "three_harmony" ? 4 : r.kind === "six_harmony" ? 3 : 2), 0)) * profile.harmony, harmonies.map(r => r.identity));
  if (tensions.length) add(natal, "부딪히는 명리 관계", -Math.min(10, tensions.reduce((n, r) => n + (r.kind === "clash" ? 3 : 2) * (r.refs.every(v => v.position === "day") ? 1.5 : 1), 0)) * profile.tension, tensions.map(r => r.identity));
  const reciprocal = directions.filter(d => d.receivedTenGod && ["정인", "식신", "정관", "정재"].includes(d.receivedTenGod.tenGodKo));
  if (reciprocal.length) add(natal, "돌봄·표현·책임의 자극", reciprocal.length * profile.complement, reciprocal.map(d => `received-ten-god:${d.relationId}:${d.receivedTenGod!.tenGodKo}`));
  // Natal helpers are NOT evidence that the partner is one's destined helper.
  const pairs = directions.flatMap(d => d.mbtiPair ? [d.mbtiPair] : []);
  const mean = (f: (p: NonNullable<typeof directions[number]["mbtiPair"]>) => number) => pairs.length ? pairs.reduce((n, p) => n + f(p), 0) / pairs.length : 0;
  const refs = pairs.map(p => p.evidenceId);
  if (pairs.length) {
    add(mbti, "공통 관심과 좋은 영향", mean(p => count(p.sharedGround) + count(p.positiveInfluence)) * profile.shared, refs);
    add(mbti, "다르게 반응하는 지점", -mean(p => count(p.friction)) * 2 * profile.tension, refs);
    const romantic = e.category === "love" ? "lovePattern" : e.category === "marriage" ? "marriagePattern" : null;
    // A pattern's existence gives no harmony bonus: only actual shared/repair
    // material contributes. Record romantic coverage without scoring prose mood.
    if (romantic) add(mbti, "관계 유형별 자료", 0, pairs.filter(p => p[romantic]).map(p => `${p.evidenceId}:${romantic}`));
    const repair = mean(p => count(p.repairStrategy));
    if (repair) add(recovery, "대화를 다시 잇는 방법", repair * profile.repair, refs.map(r => `${r}:repairStrategy`));
    // Counts describe coverage, not how well two people match. Separately use
    // reviewed behavior gaps only when BOTH natal×MBTI characters and their DB
    // pair entry exist. No four-letter internet ranking or missing-type guess.
    const characters = people.map(compatibilityCharacter);
    const styles = characters.flatMap(p => p ? [p.style] : []).sort().join(":");
    const rhythm: Record<string, { shared: number; friction: number; repair: number; label: string }> = {
      "care:inquiry": { shared: 2, friction: 3, repair: 2, label: "반응을 원하는 마음과 생각할 시간" },
      "explore:steady": { shared: 2, friction: 3, repair: 2, label: "새 시도와 지켜온 약속" },
      "decisive:inquiry": { shared: 3, friction: 2, repair: 1, label: "결론을 내는 속도와 검토의 깊이" },
      "inquiry:practical": { shared: 1, friction: 3, repair: 1, label: "먼저 이해하기와 먼저 해보기" },
      "decisive:steady": { shared: 3, friction: 2, repair: 1, label: "방향을 넓히는 힘과 기준을 지키는 힘" },
      "care:explore": { shared: 2, friction: 2, repair: 1, label: "챙기는 마음과 새로운 선택" },
      "sensitive:social-rest": { shared: 3, friction: 1, repair: 1, label: "세심한 반응과 혼자 쉬는 틈" },
      "independent:inquiry": { shared: 3, friction: 1, repair: 1, label: "서로에게 남겨줄 독립적인 시간" },
    };
    const behavior = rhythm[styles];
    if (behavior && characters.every(p => p?.fusion)) {
      const boundRefs = [...refs, ...characters.flatMap(p => p!.proof.fusionIds.map(id => `fusion:${id}`))];
      add(mbti, behavior.label, behavior.shared * profile.shared - behavior.friction * profile.tension, boundRefs);
      if (repair) add(recovery, "실제 두 반응을 나눠 조율", behavior.repair * profile.repair / 2, boundRefs);
    }
  }
  if (complements.length) add(recovery, "차이를 역할로 바꿀 여지", Math.min(2, complements.length), complements.flatMap(c => c.sources));
  if (tensions.length >= 3) add(recovery, "여러 충돌을 따로 조율할 필요", -2, tensions.map(r => r.identity));
  const scores = [
    { label: "오행·음양", max: 30, factors: element, base: 15 },
    { label: "명리 관계", max: 35, factors: natal, base: 18 },
    { label: "MBTI", max: 25, factors: mbti, base: 13 },
    { label: "회복력", max: 10, factors: recovery, base: 5 },
  ].map(({ base, ...s }) => ({ ...s, value: bound(base + s.factors.reduce((n, f) => n + f.value, 0), s.max) }));
  const total = scores.reduce((n, s) => n + s.value, 0);
  return { version: "gyeol-compatibility-index-13b-1", total, max: 100, scores, category: e.category,
    verdict: harmonies.length && tensions.length ? "맞물리는 힘과 부딪히는 속도가 함께 있습니다. 좋은 부분을 살리되 조율할 약속은 분명해야 해요."
      : harmonies.length ? "함께 움직이며 서로의 장점을 살릴 여지가 분명합니다. 차이를 역할로 나눠 쓸 때 더 편해져요."
        : tensions.length ? "서로 다른 속도를 이해하는 것이 먼저입니다. 끌림만큼 일상의 약속을 구체적으로 맞춰야 해요."
          : "지수보다 두 사람이 실제로 주고받는 반응을 함께 보세요. 아래의 방향별 이야기에서 관계의 쓰임을 찾을 수 있어요.",
    notice: "명리와 MBTI를 바탕으로 한 엔터테인먼트 해석입니다.",
    limitations: ["관계의 성공 확률이나 검증된 심리검사 점수가 아닙니다. 자료가 없는 항목은 중립값이며 좋은 근거로 가산하지 않습니다.",
      ...(!pairs.length ? ["이 조합의 MBTI 관계 자료가 부족해 해당 항목은 중립으로 두었습니다."] : []),
      ...(yy.some(y => !y.complete) ? ["출생시간이 불확실한 사람의 오행 부족·음양 보완은 점수에 사용하지 않았습니다."] : []),
      "두 사람 사이의 천간합·형·파·원진·방합은 현재 검증된 교차 근거가 없어 반영하지 않았습니다."] };
}
