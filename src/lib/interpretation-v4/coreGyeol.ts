import { fusionOrder } from "./fusionCore";
import { genericnessPenalty, humanLanguageErrors } from "./humanDescription";
import { roundEditorial, resonanceUnderlying } from "./personalResonanceRanking";
import type { CoreGyeolCandidate, CoreGyeolGrammar, PersonalResonanceCandidate, TraitArc } from "./personalResonanceCore";

/** Reviewed behavioral sentences, not adjective joining or a nickname maker.
 * A row is available only AFTER its complete PR rule has passed. */
export const CORE_GYEOL_SEEDS: readonly { ruleId: string; grammar: CoreGyeolGrammar; concepts: string[]; text: string }[] = [
  { ruleId: "PR001", grammar: "A_BUT_B", concepts: ["THOUGHT", "EXECUTION"], text: "쉽게 결론부터 내리지는 않지만, 한번 납득한 답은 빠르게 실행하는 사람입니다." },
  { ruleId: "PR002", grammar: "A_BUT_B", concepts: ["BELIEF", "SOFT_SPEECH"], text: "말은 부드럽게 해도 중요한 자기 생각까지 쉽게 바뀌지는 않는 사람입니다." },
  { ruleId: "PR004", grammar: "A_AND_B", concepts: ["DEPTH", "CURIOSITY"], text: "궁금한 것을 그냥 넘기지 않고 스스로 납득될 때까지 깊게 확인하는 사람입니다." },
  { ruleId: "PR006", grammar: "A_AND_B", concepts: ["STRATEGY", "PRECISION"], text: "멀리 갈 방향을 생각하면서 지금 고칠 작은 틀림도 함께 보는 사람입니다." },
  { ruleId: "PR009", grammar: "A_TO_B", concepts: ["IDEA", "PLAN"], text: "새로운 생각을 자유롭게 펼친 뒤 실제로 움직일 계획으로 정리하는 사람입니다." },
  { ruleId: "PR012", grammar: "A_TO_B", concepts: ["CURIOSITY", "CREATION"], text: "궁금해서 알아본 것을 자기 생각이나 결과로 꺼내 보여주고 싶은 사람입니다." },
  { ruleId: "PR013", grammar: "A_AND_B", concepts: ["INITIATIVE", "PERSISTENCE"], text: "새로운 일을 먼저 시작하고 끝을 볼 때까지 붙드는 사람입니다." },
  { ruleId: "PR017", grammar: "A_BUT_B", concepts: ["GOAL", "ADAPTABILITY"], text: "가고 싶은 곳은 분명하지만 그곳으로 가는 방법은 바꿀 줄 아는 사람입니다." },
  { ruleId: "PR018", grammar: "TWO_NEEDS", concepts: ["GROWTH", "STABILITY"], text: "더 성장하고 싶어 하면서도 생활의 기본은 안정적으로 지키고 싶은 사람입니다." },
  { ruleId: "PR019", grammar: "TWO_NEEDS", concepts: ["CHANGE", "STABILITY"], text: "새로운 일을 좋아하면서도 생활의 기본은 안정적이길 바라는 사람입니다." },
  { ruleId: "PR022", grammar: "A_TO_B", concepts: ["CREATION", "EXPRESSION"], text: "머릿속 생각을 직접 만들어 다른 사람에게 보여줘야 만족하는 사람입니다." },
  { ruleId: "PR025", grammar: "BEST_UNDER_PRESSURE", concepts: ["LEADERSHIP", "DUTY", "PRESSURE"], text: "일이 어려워질수록 해야 할 순서를 찾아 책임지고 해결하는 사람입니다." },
  { ruleId: "PR037", grammar: "DUAL_VALUE", concepts: ["MONEY", "MEANING"], text: "돈도 중요하고 일의 의미도 포기하고 싶지 않은 사람입니다." },
  { ruleId: "PR049", grammar: "A_AND_B", concepts: ["PERCEPTION", "CARE"], text: "사람의 작은 변화를 빨리 알아차리고 필요한 것을 챙기는 사람입니다." },
  { ruleId: "PR055", grammar: "A_BUT_B", concepts: ["CARE", "BOUNDARY"], text: "사람을 잘 챙기면서도 자신이 책임질 수 있는 범위를 구분하는 사람입니다." },
  { ruleId: "PR058", grammar: "OUTER_INNER", concepts: ["PUBLIC_ENERGY", "RECOVERY"], text: "사람들과 있을 때는 잘 버티지만 혼자 돌아왔을 때 피로를 크게 느끼는 사람입니다." },
  { ruleId: "PR073", grammar: "OUTER_INNER", concepts: ["PUBLIC_PERSISTENCE", "RECOVERY"], text: "사람들 앞에서는 힘든 티를 잘 내지 않지만 혼자 있을 때 피로를 크게 느끼는 사람입니다." },
  { ruleId: "PR081", grammar: "OUTER_INNER", concepts: ["EXPRESSION", "DEPTH", "RECOVERY"], text: "밖에서는 잘 말하고 움직여도 혼자 돌아와 그 일을 다시 생각하는 사람입니다." },
  { ruleId: "PR085", grammar: "A_BUT_B", concepts: ["AUTONOMY", "ADAPTABILITY"], text: "자기 방향은 분명하지만 상황에 맞춰 방법을 바꿀 줄 아는 사람입니다." },
  { ruleId: "PR086", grammar: "TWO_NEEDS", concepts: ["CONNECTION", "AUTONOMY"], text: "사람과 함께하는 것을 좋아하면서도 중요한 선택은 직접 하고 싶은 사람입니다." },
  { ruleId: "PR087", grammar: "OUTER_INNER", concepts: ["QUIET", "LEADERSHIP"], text: "평소에는 조용히 지내도 결정이 필요해지면 앞에서 방향을 잡는 사람입니다." },
  { ruleId: "PR089", grammar: "A_BUT_B", concepts: ["CARE", "SELF_STANDARD"], text: "사람을 배려하면서도 중요한 자기 기준까지 쉽게 흔들리지는 않는 사람입니다." },
  { ruleId: "PR093", grammar: "DUAL_VALUE", concepts: ["MEANING", "REALITY"], text: "의미 있는 일에서 실제로 남는 결과까지 보고 싶은 사람입니다." },
  { ruleId: "PR094", grammar: "DUAL_VALUE", concepts: ["RECOGNITION", "AUTONOMY"], text: "인정받고 싶어 하면서도 남이 정한 성공 방식만 따르고 싶지는 않은 사람입니다." },
  { ruleId: "PR096", grammar: "A_BUT_B", concepts: ["DUTY", "AUTONOMY"], text: "자기 방식대로 움직이면서도 맡은 책임은 끝내려는 사람입니다." },
];
export const CORE_ARC_SEEDS = [
  { theme: "PRECISION_AND_STANDARDS", text: "정확하게 보는 눈 덕분에 잘하지만, 그만큼 스스로에게도 기준이 높은 사람입니다." },
  { theme: "SOCIAL_ATTUNEMENT_AND_CARE", text: "사람을 잘 챙기는 만큼 남의 일까지 자기 일처럼 붙들 때가 있는 사람입니다." },
  { theme: "GROWTH_AND_EXPANSION", text: "목표가 분명할수록 잘 움직이지만 해내고 나서도 바로 다음 목표를 찾는 사람입니다." },
] as const;
export const coreGyeolOrder = (a: CoreGyeolCandidate, b: CoreGyeolCandidate) => b.score - a.score || b.personalSpecificity - a.personalSpecificity || b.evidenceDiversity - a.evidenceDiversity || b.fusionValue - a.fusionValue || fusionOrder(a.id, b.id);
export function buildCoreGyeol(candidates: readonly PersonalResonanceCandidate[], arcs: readonly TraitArc[]) {
  const result: CoreGyeolCandidate[] = [];
  function add(c: PersonalResonanceCandidate, grammar: CoreGyeolGrammar, concepts: string[], text: string, arc?: TraitArc) {
    if (c.diagnostics.amplifierOnly || c.diagnostics.unsupportedSpecificity || c.diagnostics.unresolvedContradiction || c.evidenceStrength < .75 || concepts.length > 3 || humanLanguageErrors(text).length) return;
    const identity = c.contexts.includes("identity") ? 1 : c.contexts.length >= 2 && !c.contexts.every(x => ["money", "love"].includes(x)) ? .8 : .4;
    const diversity = c.familyDiversity, memory = grammar === "A_AND_B" ? .75 : .9;
    // Q1 easy / Q2 behavioral / Q3 independent / Q4 specific / Q5 traceable /
    // Q6 resolved / Q7 no technical/type labels. Reviewed seeds establish Q1/Q2.
    const questions = [true, c.diagnostics.quality === "HUMAN_DESCRIPTIVE", c.diagnostics.independentCount >= 2, c.genericness <= .5,
      c.evidence.myeongliEvidenceIds.length > 0, !c.diagnostics.unresolvedContradiction, !/ENTJ|INFJ|십성|사주|상호작용|결을 가진/.test(text)];
    const qualityPassed = questions.filter(Boolean).length;
    const score = roundEditorial(25 * c.evidenceStrength + 20 * c.specificity + 15 * diversity + 15 * identity + 10 * c.fusionValue + 10 * c.emotionalImpact + 5 * memory - genericnessPenalty(c.genericness) - c.diagnostics.duplicatePenalty);
    result.push({ id: `core-gyeol:${grammar}:${c.ruleId}${arc ? `:${arc.semanticTheme}` : ""}`, grammar, primaryTheme: concepts[0], secondaryTheme: concepts[1], ...(concepts[2] ? { contrastTheme: concepts[2] } : {}),
      sourceResonanceIds: arc?.sourceResonanceIds ?? [c.id], sourceFusionIds: arc?.sourceFusionIds ?? c.evidence.fusionCandidateIds, sourceClaimIds: arc?.sourceClaimIds ?? c.evidence.claimIds,
      evidenceIds: arc?.evidenceIds ?? resonanceUnderlying(c), humanDescription: text, evidenceConfidence: c.evidenceStrength, personalSpecificity: c.specificity,
      evidenceDiversity: diversity, identitySalience: identity, fusionValue: c.fusionValue, emotionalImpact: c.emotionalImpact, memorability: memory, genericness: c.genericness, score,
      diagnostics: { qualityQuestions: questions, qualityPassed, warnings: qualityPassed < 6 ? ["CORE_QUALITY_BELOW_6_OF_7"] : [], eligibleBest: qualityPassed >= 6 && questions[2] && identity >= .8 && c.genericness <= .3, concepts } });
  }
  for (const seed of CORE_GYEOL_SEEDS) {
    const c = candidates.find(c => c.ruleId === seed.ruleId); if (c) add(c, seed.grammar, seed.concepts, seed.text);
  }
  for (const seed of CORE_ARC_SEEDS) {
    const arc = arcs.find(a => a.semanticTheme === seed.theme && a.shadowDescription && a.provenance.shadow);
    const c = arc && candidates.find(c => arc.sourceResonanceIds.includes(c.id));
    if (arc && c) add(c, "STRENGTH_SHADOW", [seed.theme, "SAME_TRAIT_SHADOW"], seed.text, arc);
  }
  const coreGyeolCandidates = result.sort(coreGyeolOrder).slice(0, 15);
  const bestCoreGyeol = coreGyeolCandidates.find(c => c.diagnostics.eligibleBest);
  return { coreGyeolCandidates, ...(bestCoreGyeol ? { bestCoreGyeol } : {}), sourceCandidateCount: result.length };
}
