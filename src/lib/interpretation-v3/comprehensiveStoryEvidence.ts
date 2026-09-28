import { ATOMIC_BY_ID } from "./atomicRegistry";
import { canonicalFeatureId } from "./evidence";
import { validateV3Copy } from "./engine";
import { featureRows, SIGNAL_STORIES } from "./comprehensiveEditorial";
import type { ComprehensiveV3Block, ComprehensiveV3Input } from "./comprehensive";
import type { Evidence } from "./types";
import type { SajuCalcResult, TenGod } from "../saju/types";

export const GOD_CODES: Readonly<Record<string, TenGod>> = { bijian: "比肩", jie_cai: "劫財", shi_shen: "食神", shang_guan: "傷官", pian_cai: "偏財", zheng_cai: "正財", qi_sha: "偏官", zheng_guan: "正官", pian_yin: "偏印", zheng_yin: "正印" };
export const unique = <T,>(xs: readonly T[]) => [...new Set(xs)];
const object = (v: unknown): Record<string, unknown> => v && typeof v === "object" ? v as Record<string, unknown> : {};
export const factLabel = (f: Evidence) => ATOMIC_BY_ID.get(f.featureId)?.name ?? (f.kind === "mbti" ? f.featureId.split(":")[1] : f.kind === "spouse_palace" ? "일지 · 배우자궁" : String(object(f.value).label ?? object(f.value).labelKo ?? "원국 관계"));
export function validateStoryCopy(text: string): readonly string[] {
  return [...validateV3Copy(text), ...(/(?:수|수도|수는) 있습니다|가능성이|로 볼 수|원국 전체의 파생 근거/u.test(text) ? ["story-weak-or-technical-copy"] : [])];
}

/** Editorial prominence, NOT a new saju strength calculation. 0.6 is the
 * existing main hidden-stem contribution. Minor-only observations cannot lead.
 * Keep raw weights/positions and the reason, never expose a customer score. */
export function storySupport(id: string, facts: readonly Evidence[], calc: SajuCalcResult) {
  const fs = facts.filter(f => canonicalFeatureId(f.featureId) === canonicalFeatureId(id));
  const god = GOD_CODES[id.replace(/^ten_god_/, "")];
  const weight = god ? calc.tenGods.distribution[god] : undefined;
  const surface = god ? Object.values(calc.tenGods.stems).filter(g => g === god).length : 0;
  const hiddenMain = god ? calc.tenGods.hiddenStems.filter(h => h.tenGod === god && h.weight >= 0.6).length : 0;
  const positions = unique(fs.flatMap(f => Array.isArray(object(f.value).positions) ? object(f.value).positions as string[] : []));
  const confirmed = fs.length > 0 && fs.every(f => f.certainty === "confirmed" && f.sourceRefs.length && f.lineage.length);
  const substantial = confirmed && (god ? (weight ?? 0) >= 0.6 && (surface > 0 || hiddenMain > 0 || (weight ?? 0) >= 1) : fs.some(f => f.salience !== "supporting") && (positions.length > 0 || fs.some(f => ["day_pillar", "day_master"].includes(f.kind))));
  return { featureId: id, weight, surface, hiddenMain, positions, substantial,
    reason: !confirmed ? "정밀도/출처 제한" : god && !substantial ? "소량/보조 지장간 근거: 중심 해석 제외" : substantial ? "직접 위치 또는 충분한 기존 가중 근거" : "보조 사실" };
}
export function compoundProminence(block: ComprehensiveV3Block, input: ComprehensiveV3Input & { calculation: SajuCalcResult }) {
  const fs = input.facts.filter(f => block.evidenceRefs.includes(f.id));
  const natal = fs.filter(f => f.scope === "natal" && ATOMIC_BY_ID.has(f.featureId));
  const supports = unique(natal.map(f => f.featureId)).map(id => storySupport(id, input.facts, input.calculation));
  const independent = natal.filter((f, i) => !natal.slice(0, i).some(other => other.featureId === f.featureId || other.lineage.some(id => f.lineage.includes(id))));
  const relevant = block.domains.some(d => ["identity", "career", "money", "relationship", "love", "study", "lifestyle", "leadership"].includes(d));
  const hero = relevant && supports.length > 0 && supports.every(s => s.substantial) && fs.every(f => f.certainty === "confirmed") && (block.kind !== "compound" || independent.length >= 2);
  const contextRelevant = input.context.lifeStatus === "business_owner" ? block.domains.includes("business") : ["student", "job_seeker"].includes(input.context.lifeStatus) ? block.domains.includes("study") : block.domains.includes("career");
  return { id: block.id, prominence: hero ? "hero" as const : "supporting" as const, supports, independent: independent.length, relevant, contextRelevant,
    reason: !relevant ? "종합 영역 밖" : supports.some(s => !s.substantial) ? "약한 구성 요소는 존재만으로 중심 조합이 되지 않음" : hero ? "독립된 직접 근거와 상품 관련성 충족" : "독립 근거 부족" };
}
export function prioritizeStoryCandidates(candidates: readonly ComprehensiveV3Block[], input: ComprehensiveV3Input & { calculation: SajuCalcResult }) {
  return candidates.map(b => ({ b, p: compoundProminence(b, input) })).toSorted((a, b) =>
    Number(b.p.prominence === "hero") - Number(a.p.prominence === "hero") ||
    b.p.supports.reduce((n, s) => n + s.surface, 0) - a.p.supports.reduce((n, s) => n + s.surface, 0) ||
    Math.min(...b.p.supports.map(s => s.weight ?? 1)) - Math.min(...a.p.supports.map(s => s.weight ?? 1)) ||
    b.p.independent - a.p.independent ||
    b.p.supports.reduce((n, s) => n + s.positions.filter(p => p === "day" || p === "month").length, 0) - a.p.supports.reduce((n, s) => n + s.positions.filter(p => p === "day" || p === "month").length, 0) ||
    Number(b.p.contextRelevant) - Number(a.p.contextRelevant) || a.b.id.localeCompare(b.b.id)).map(({ b, p }) => ({ ...b, prominence: p.prominence }));
}

const TABLE_POWERS: Readonly<Record<string, string>> = {
  day_pillar_jeongchuk: "조용한 집념·축적·감정을 다스리는 힘", day_pillar_gyeongo: "결단·경쟁·자기 판단을 실행하는 힘", day_pillar_gyeongjin: "안에 품은 결단·기반을 남기는 힘", day_pillar_gabo: "방향을 세우고 밖으로 표현하는 힘", day_pillar_muo: "존재감·책임·자리를 지키는 힘",
  twelve_sinsal_geopsal: "위험을 알아보고 자원과 관계의 경계를 지키는 힘", twelve_sinsal_yukhae: "작은 불편을 알아보고 생활과 관계를 정비하는 힘", twelve_sinsal_jisal: "새 환경·현장에서 접점을 넓히는 힘", "shinsal:GOSINSAL": "혼자 정리하는 시간과 관계의 거리를 구분하는 성향", "shinsal:GWASUKSAL": "독립적인 생활과 가까운 관계의 거리를 살피는 성향",
};
const STRUCTURES: Readonly<Record<string, readonly [string, string]>> = {
  PEER_HEAVY: ["자기 기준과 동료의 존재감이 큰 구조", "독립적인 선택·경쟁·협력의 몫을 살피는 기준"],
  OUTPUT_HEAVY: ["생각을 밖으로 내보내는 쪽에 무게가 실린 구조", "표현·생산·결과물을 만드는 힘"],
  WEALTH_HEAVY: ["자원과 교환을 다루는 쪽에 무게가 실린 구조", "기회를 고르고 관리하는 힘"],
  OFFICER_HEAVY: ["역할과 외부 요구를 감당하는 쪽에 무게가 실린 구조", "책임·규칙·압박에 대응하는 힘"],
  RESOURCE_HEAVY: ["배우고 해석하는 쪽에 무게가 실린 구조", "이해·탐구·자기 기반을 만드는 힘"],
};
export function storyFeatureRows(facts: readonly Evidence[], calc: SajuCalcResult) {
  const rows = featureRows(facts).filter(r => !r.featureId.startsWith("ten_god_") || (storySupport(r.featureId, facts, calc).weight ?? 0) >= 0.3).map(r => {
    const power = TABLE_POWERS[r.featureId] ?? SIGNAL_STORIES[r.featureId]?.[1] ?? r.power;
    const meaning = validateStoryCopy(r.meaning).length ? ATOMIC_BY_ID.get(r.featureId)?.name + "의 원국 표식" : r.meaning;
    return { ...r, meaning, power: validateStoryCopy(power).length ? "확인된 위치와 함께 읽는 성향의 단서" : power };
  });
  for (const f of facts.filter(f => f.certainty === "confirmed" && ["relation", "structure"].includes(f.kind))) {
    const v = object(f.value), structure = STRUCTURES[String(v.code)];
    if (f.kind === "structure" && !structure) continue; // Do not promote tentative structure candidates.
    const clash = f.featureId.includes("CLASH");
    rows.push({ featureId: f.featureId, label: factLabel(f), meaning: structure?.[0] ?? (clash ? "두 자리의 지지가 충을 이루는 배치" : "두 자리의 글자가 합을 이루는 배치"), power: structure?.[1] ?? (clash ? "서로 다른 요구를 나누어 살펴보는 관계의 단서" : "서로 이어지는 두 자리를 함께 살펴보는 관계의 단서"), evidenceRefs: [f.id] });
  }
  return rows.map(r => ({ ...r, details: facts.filter(f => r.evidenceRefs.includes(f.id)).map(f => {
    const v = object(f.value), support = storySupport(f.featureId, facts, calc);
    return { basis: String(v.basis ?? (f.kind === "structure" ? "기존 구조 판정" : f.kind === "relation" ? "원국 합·충 계산" : "기존 원국 계산")), positions: support.positions,
      sourceRefs: f.sourceRefs, ...(support.weight !== undefined ? { weight: support.weight, surface: support.surface, hiddenMain: support.hiddenMain } : {}) };
  }) }));
}
