import type { RelationshipView } from "./relationshipProductView";
import type { EvidenceAtom } from "./semanticCore";
import { isMeaningfulEvidence } from "./foundationRanking";
import { TEN_GOD_SEMANTICS } from "./foundationTenGods";
import { LOVE_RELEASE_MATERIALS } from "./loveReleaseMaterials";
export function loveReleaseSources(view: RelationshipView) {
  return view.candidates.flatMap(candidate => {
    if (candidate.fortune || ["GUIDANCE", "FUSION"].includes(candidate.sourceType) || candidate.internalComplexity) return [];
    return Object.entries(LOVE_RELEASE_MATERIALS).flatMap(([facet, material]) => material.axes.flatMap(([axis, direction]) => {
      if (!candidate.primaryAxes.includes(axis) || (view.profiles.myeongli.axes[axis] ?? 0) * direction <= 0) return [];
      return view.profiles.myeongli.evidence.filter(atom => candidate.myeongliEvidenceIds.includes(atom.id) && atom.tier !== "AMPLIFIER"
        && isMeaningfulEvidence(atom) && (atom.axes[axis] ?? 0) * direction > 0).map(atom => ({ candidate, atom, facet, axis, direction }));
    }));
  });
}
export type LoveReleaseSource = ReturnType<typeof loveReleaseSources>[number];
export function loveSourceName(atom: EvidenceAtom) {
  const position = ({ year: "년주", month: "월주", day: "일주", hour: "시주" } as Record<string, string>)[String(atom.metadata?.pillar)] ?? "원국";
  if (atom.sourceType === "ten_god") return `${position} ${atom.metadata?.slot === "branch" ? "지장간" : "천간"} ${TEN_GOD_SEMANTICS[atom.sourceKey as keyof typeof TEN_GOD_SEMANTICS]?.label ?? atom.sourceKey}`;
  if (atom.sourceType === "element") return `${({ WOOD: "목", FIRE: "화", EARTH: "토", METAL: "금", WATER: "수" } as Record<string, string>)[atom.sourceKey] ?? atom.sourceKey} 기운`;
  if (atom.sourceType === "yin_yang") return atom.sourceKey.includes("YANG") ? "원국의 양 기운" : "원국의 음 기운";
  if (atom.sourceType === "heavenly_stem" || atom.sourceType === "earthly_branch") {
    const stems: Record<string, string> = { 甲: "갑목", 乙: "을목", 丙: "병화", 丁: "정화", 戊: "무토", 己: "기토", 庚: "경금", 辛: "신금", 壬: "임수", 癸: "계수" };
    const branches: Record<string, string> = { 子: "자수", 丑: "축토", 寅: "인목", 卯: "묘목", 辰: "진토", 巳: "사화", 午: "오화", 未: "미토", 申: "신금", 酉: "유금", 戌: "술토", 亥: "해수" };
    return `${position} ${atom.metadata?.isDayMaster ? "일간" : atom.sourceType === "heavenly_stem" ? "천간" : "지지"} ${(atom.sourceType === "heavenly_stem" ? stems : branches)[atom.sourceKey] ?? atom.sourceKey}`;
  }
  return typeof atom.metadata?.label === "string" ? atom.metadata.label : "원국에서 확인된 관계 성향";
}
