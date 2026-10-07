import type { ClaimProfile } from "./claimCore";
import { CLAIM_REGISTRY } from "./claimRegistry";
import { fusionUnique as unique } from "./fusionCore";
import { HUMAN_GOLDEN_LANGUAGE, humanLanguageErrors } from "./humanDescription";
import { PERSONAL_RESONANCE_REGISTRY } from "./personalResonanceRegistry";
import { mergeResonanceEvidence } from "./personalResonanceEvidence";
import type { PersonalResonanceCandidate, ResonanceEvidence, TraitArc } from "./personalResonanceCore";

const GUIDANCE_KEYS: Record<string, string> = {
  PRECISION_AND_STANDARDS: "PERFECTIONISM_OR_PRIORITY", LEADERSHIP_AND_RESPONSIBILITY: "RESPONSIBILITY_OR_DELEGATION",
  DEEP_UNDERSTANDING: "OVERTHINKING_OR_STOP_RULE", SOCIAL_ATTUNEMENT_AND_CARE: "CARE_AND_BOUNDARY",
  GROWTH_AND_EXPANSION: "GOAL_AND_RECOVERY", MONEY_AND_REALITY: "MONEY_VALUE_BALANCE",
};
/** Every arc begins with a supported description + its reviewed strength.
 * Optional shadows are separately traced, never the opposite of an axis. */
export function buildTraitArcs(candidates: readonly PersonalResonanceCandidate[], claims: ClaimProfile): TraitArc[] {
  const groups = new Map<string, PersonalResonanceCandidate[]>();
  for (const c of candidates) {
    if (!c.positiveMeaning || c.diagnostics.amplifierOnly || c.diagnostics.unsupportedSpecificity) continue;
    const d = PERSONAL_RESONANCE_REGISTRY.find(r => r.id === c.ruleId)!;
    const key = d.arcTheme ?? c.semanticTheme;
    groups.set(key, [...(groups.get(key) ?? []), c]);
  }
  const result: TraitArc[] = [];
  for (const [theme, rows] of groups) {
    const c = (theme === "MONEY_AND_REALITY" ? rows.find(r => r.ruleId === "PR037") : undefined) ?? rows[0];
    const strength = mergeResonanceEvidence(...rows.map(r => r.evidence)), shadowResonanceIds: string[] = [];
    let shadowDescription: string | undefined, shadow: ResonanceEvidence | undefined;
    const scopedClaim = (id: string, level = 2) => claims.candidates.find(x => x.id === id && x.level >= level && !x.fortuneClaim &&
      x.contexts.some(context => rows.some(r => r.contexts.includes(context))) && x.evidence.myeongliEvidenceIds.some(id => strength.myeongliEvidenceIds.includes(id)));
    const attachClaim = (id: string, description: string, min = 2) => {
      const claim = scopedClaim(id, min); if (!claim) return;
      shadowDescription = description; shadow = { ...claim.evidence, claimIds: [claim.id] };
    };
    if (theme === "PRECISION_AND_STANDARDS") {
      const f03 = scopedClaim("F03_PERFECTIONISM");
      const delay = f03?.customerClaim === CLAIM_REGISTRY.find(c => c.id === "F03_PERFECTIONISM")?.alternativeLevel3;
      attachClaim("F03_PERFECTIONISM", delay ? "잘하고 싶은 마음 때문에 시작이나 마감이 늦어질 수 있습니다." : "기준이 높아서 스스로 만족하기 어려울 수 있습니다.");
    }
    if (theme === "DEEP_UNDERSTANDING") attachClaim("F05_OVERTHINKING", "생각이 너무 길어지면 결정이나 시작이 늦어질 수 있습니다.");
    if (theme === "SOCIAL_ATTUNEMENT_AND_CARE") attachClaim("F07_OVERCARE", "남의 일까지 자기 일처럼 챙기다 지칠 수 있습니다.", 3);
    if (theme === "LEADERSHIP_AND_RESPONSIBILITY") {
      const over = candidates.find(r => ["PR026", "PR078", "PR083"].includes(r.ruleId) && r.contexts.some(x => c.contexts.includes(x)) && r.evidence.myeongliEvidenceIds.some(id => strength.myeongliEvidenceIds.includes(id)));
      if (over) { shadowDescription = "내가 할 수 있다는 이유로 일을 너무 많이 가져올 수 있습니다."; shadow = over.evidence; shadowResonanceIds.push(over.id); }
    }
    if (theme === "GROWTH_AND_EXPANSION") {
      const next = rows.find(r => r.ruleId === "PR028");
      if (next) { shadowDescription = "하나를 끝낸 뒤에도 바로 다음 목표를 잡아 스스로를 계속 몰아붙일 수 있습니다."; shadow = next.evidence; }
      else attachClaim("F04_OVERWORK", "목표를 붙들다 쉬면서도 계속 일을 생각할 때가 있습니다.");
    }
    if (theme === "MONEY_AND_REALITY") {
      // Only a money-domain fact bomb, not a wealth-fortune claim.
      const f = scopedClaim("M10_TOO_MANY_MONEY_OPPORTUNITIES");
      if (f?.factBomb && f.contexts.includes("money")) { shadowDescription = f.customerClaim; shadow = { ...f.evidence, claimIds: [f.id] }; }
    }
    if (shadowDescription && humanLanguageErrors(shadowDescription).length) { shadowDescription = undefined; shadow = undefined; }
    const all = mergeResonanceEvidence(strength, ...(shadow ? [shadow] : []));
    result.push({ id: `trait-arc:${theme}`, semanticTheme: theme,
      humanDescription: theme === "PRECISION_AND_STANDARDS" ? HUMAN_GOLDEN_LANGUAGE.precision : c.humanDescription,
      strengthDescription: c.positiveMeaning!, ...(shadowDescription ? { shadowDescription } : {}),
      sourceResonanceIds: unique([...rows.map(r => r.id), ...shadowResonanceIds]), sourceClaimIds: all.claimIds, sourceFusionIds: all.fusionCandidateIds,
      evidenceIds: unique([...all.myeongliEvidenceIds, ...all.mbtiSourceNodeIds]), primaryAxes: unique(rows.flatMap(r => r.primaryAxes)), contexts: unique(rows.flatMap(r => r.contexts)),
      strengthRank: c.rank, ...(GUIDANCE_KEYS[theme] ? { futureGuidanceTheme: GUIDANCE_KEYS[theme] } : {}), relatedArcIds: [],
      provenance: { strength: structuredClone(strength), ...(shadow ? { shadow: structuredClone(shadow) } : {}) } });
  }
  for (const arc of result) arc.relatedArcIds = unique(result.filter(other => other.id !== arc.id && other.primaryAxes.some(a => arc.primaryAxes.includes(a))).map(x => x.id));
  return result;
}
