import { PAIR_RELEASE_FACETS } from "./compatibilityReleaseMaterials";
import { isMeaningfulEvidence } from "./foundationRanking";
import { TEN_GOD_SEMANTICS } from "./foundationTenGods";
import type { RelationshipView } from "./relationshipProductView";

/** Existing candidate eligibility and signed roots only. Lexical selection of
 * distinct editorial facets does not recalculate either person's personality. */
export function pairReleaseSources(view: RelationshipView) {
  return PAIR_RELEASE_FACETS.flatMap(material => view.candidates.flatMap(candidate => {
    if (candidate.fortune || candidate.sourceType === "GUIDANCE" || candidate.internalComplexity
      || !candidate.primaryAxes.includes(material.axis) || (view.profiles.myeongli.axes[material.axis] ?? 0) * material.sign <= 0) return [];
    return view.profiles.myeongli.evidence.filter(atom => candidate.myeongliEvidenceIds.includes(atom.id)
      && atom.tier !== "AMPLIFIER" && isMeaningfulEvidence(atom) && (atom.axes[material.axis] ?? 0) * material.sign > 0)
      .map(atom => ({ candidate, atom, material }));
  })).sort((a, b) => Number(b.candidate.rank === "SIGNATURE") - Number(a.candidate.rank === "SIGNATURE")
    || b.candidate.priorityScore - a.candidate.priorityScore || b.atom.weight - a.atom.weight || a.candidate.id.localeCompare(b.candidate.id));
}
export type PairReleaseSource = ReturnType<typeof pairReleaseSources>[number];
export function pairRootName(row: PairReleaseSource) {
  const a = row.atom, position = ({ year: "년주", month: "월주", day: "일주", hour: "시주" } as Record<string, string>)[String(a.metadata?.pillar)] ?? "원국";
  if (a.sourceType === "ten_god") return `${position} ${TEN_GOD_SEMANTICS[a.sourceKey as keyof typeof TEN_GOD_SEMANTICS]?.label ?? a.sourceKey}`;
  if (a.sourceType === "element") return `${({ WOOD: "목", FIRE: "화", EARTH: "토", METAL: "금", WATER: "수" } as Record<string, string>)[a.sourceKey]} 기운`;
  const stems: Record<string, string> = { 甲: "갑목", 乙: "을목", 丙: "병화", 丁: "정화", 戊: "무토", 己: "기토", 庚: "경금", 辛: "신금", 壬: "임수", 癸: "계수" };
  if (a.sourceType === "heavenly_stem") return `${position} ${a.metadata?.isDayMaster ? "일간" : "천간"} ${stems[a.sourceKey]}`;
  const branches: Record<string, string> = { 子: "자수", 丑: "축토", 寅: "인목", 卯: "묘목", 辰: "진토", 巳: "사화", 午: "오화", 未: "미토", 申: "신금", 酉: "유금", 戌: "술토", 亥: "해수" };
  if (a.sourceType === "earthly_branch") return `${position} 지지 ${branches[a.sourceKey]}`;
  if (a.sourceType === "yin_yang") return a.sourceKey.includes("YANG") ? "양의 움직임" : "음의 움직임";
  return typeof a.metadata?.label === "string" ? a.metadata.label : "원국의 관계 성향";
}
