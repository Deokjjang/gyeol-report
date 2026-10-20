import type { CareerProfiles } from "./careerProductSelection";
import type { EditorialCandidate } from "./comprehensivePlanCore";
import type { EvidenceAtom, SemanticAxis } from "./semanticCore";
import { isMeaningfulEvidence } from "./foundationRanking";
import { CAREER_RELEASE_MATERIALS } from "./careerReleaseMaterials";
import { TEN_GOD_SEMANTICS } from "./foundationTenGods";

export type CareerReleaseSource = { candidate: EditorialCandidate; atom: EvidenceAtom; facet: string; axis: SemanticAxis; direction: 1 | -1 };
export function collectCareerReleaseSources(profiles: CareerProfiles, candidates: readonly EditorialCandidate[]) {
  const rows: CareerReleaseSource[] = [];
  for (const candidate of candidates) {
    if (!candidate.primaryEligible || candidate.invalidReasons.length || candidate.internalComplexity || candidate.fortune
      || ["GUIDANCE", "FUSION", "CORE_GYEOL"].includes(candidate.sourceType)) continue;
    for (const [facet, m] of Object.entries(CAREER_RELEASE_MATERIALS)) for (const [axis, direction] of m.axes) {
      if (!candidate.primaryAxes.includes(axis) || (profiles.myeongli.axes[axis] ?? 0) * direction <= 0) continue;
      for (const atom of profiles.myeongli.evidence) if (candidate.myeongliEvidenceIds.includes(atom.id)
        && isMeaningfulEvidence(atom) && atom.tier !== "AMPLIFIER" && (atom.axes[axis] ?? 0) * direction > 0) rows.push({ candidate, atom, facet, axis, direction });
    }
  }
  return rows.sort((a, b) => b.candidate.priorityScore - a.candidate.priorityScore || b.atom.weight - a.atom.weight || a.candidate.id.localeCompare(b.candidate.id) || a.atom.id.localeCompare(b.atom.id));
}
const stems: Record<string, string> = { 甲: "갑목", 乙: "을목", 丙: "병화", 丁: "정화", 戊: "무토", 己: "기토", 庚: "경금", 辛: "신금", 壬: "임수", 癸: "계수" };
const branches: Record<string, string> = { 子: "자수", 丑: "축토", 寅: "인목", 卯: "묘목", 辰: "진토", 巳: "사화", 午: "오화", 未: "미토", 申: "신금", 酉: "유금", 戌: "술토", 亥: "해수" };
export function careerAtomName(e: EvidenceAtom) {
  const position = ({ year: "년주", month: "월주", day: "일주", hour: "시주" } as Record<string, string>)[String(e.metadata?.pillar)] ?? "원국";
  if (e.sourceType === "heavenly_stem") return `${e.metadata?.isDayMaster ? "일간" : `${position} 천간`} ${stems[e.sourceKey] ?? e.sourceKey}`;
  if (e.sourceType === "earthly_branch") return `${position} 지지 ${branches[e.sourceKey] ?? e.sourceKey}`;
  if (e.sourceType === "ten_god") return `${position}${e.metadata?.slot === "branch" ? " 지장간" : " 천간"} ${TEN_GOD_SEMANTICS[e.sourceKey as keyof typeof TEN_GOD_SEMANTICS]?.label ?? e.sourceKey}`;
  if (e.sourceType === "yin_yang") return `원국의 보이는 천간·지지 중 ${e.sourceKey.includes("YANG") ? "양" : "음"} 기운${typeof e.metadata?.yangCount === "number" && typeof e.metadata?.yinCount === "number" ? `(${e.metadata.yangCount}양·${e.metadata.yinCount}음)` : ""}`;
  if (e.sourceType === "element") return `${({ WOOD: "목", FIRE: "화", EARTH: "토", METAL: "금", WATER: "수" } as Record<string, string>)[e.sourceKey] ?? e.sourceKey} 기운`;
  return typeof e.metadata?.label === "string" ? e.metadata.label : "원국에서 확인된 성향";
}
