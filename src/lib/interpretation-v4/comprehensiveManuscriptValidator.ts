import type { ComprehensiveManuscriptDraft, ManuscriptInput, ManuscriptValidation } from "./comprehensiveManuscriptCore";
import { COMPREHENSIVE_SECTIONS } from "./comprehensivePlanCore";
import type { NarrativeIssue } from "./narrativeCore";
import { TITLE_SKELETONS } from "./narrativeTitleRegistry";
import { NARRATIVE_SCENES } from "./narrativeSceneRegistry";
import { chooseNarrativeScene } from "./narrativeSceneCore";
import { selectedProofAxes } from "./comprehensiveNarrativeAdapter";
export function validateComprehensiveManuscript(input: ManuscriptInput, draft: ComprehensiveManuscriptDraft): ManuscriptValidation {
  const hardViolations: NarrativeIssue[] = [], warnings: NarrativeIssue[] = [];
  const hard = (code: string, refs: string[] = []) => hardViolations.push({ code, refs });
  const warn = (code: string, refs: string[] = []) => warnings.push({ code, refs });
  const sections = COMPREHENSIVE_SECTIONS.map(s => draft.sections[s]);
  const sentences = sections.flatMap(s => [...(s.bridgeIn ? [s.bridgeIn] : []), ...s.blocks.flatMap(b => b.sentences)]);
  const seen = new Set<string>(), terms = new Set<string>();
  for (const s of sections) {
    hardViolations.push(...s.validation.hardViolations); warnings.push(...s.validation.warnings);
    for (const id of s.sourceCandidateIds) if (!input.plan.sections[s.sectionId].placements.some(p => p.candidateId === id)) hard("UNSELECTED_CANDIDATE", [id]);
    for (const b of s.blocks) hardViolations.push(...b.validation.hardViolations);
    if (s.explicitMbtiCount > input.plan.sections[s.sectionId].maxExplicitMbti) hard("SECTION_EXPLICIT_BUDGET", [s.sectionId]);
    if (s.sectionKind === "POSITIVE_POTENTIAL" && /사람복|재물복|행운|좋은 운/.test(s.plainText)) hard("INVENTED_FORTUNE", [s.sectionId]);
    const primaries = input.plan.sections[s.sectionId].primaryCandidateIds;
    if (primaries.some(id => !s.sourceCandidateIds.includes(id))) warn("INCOMPLETE_PLANNED_COVERAGE", [s.sectionId]);
  }
  for (const s of sentences) {
    if (/[A-Z]{2,}_[A-Z_]+|actual-source|(?:natal|supplement|foundation|editorial):/.test(s.text)) hard("INTERNAL_IDENTIFIER_EXPOSURE", [s.id]);
    if (seen.has(s.text)) hard("EXACT_SENTENCE_REPEAT", [s.id]); seen.add(s.text);
    if (s.termDefinitionKey) { if (terms.has(s.termDefinitionKey)) hard("TERM_REDEFINITION", [s.id]); terms.add(s.termDefinitionKey); }
  }
  for (const title of draft.titleUsage) {
    const c = input.plan.candidates.find(c => c.id === title.candidateId);
    const titlePlan = input.plan.sections[title.sectionId];
    const eligibleAnchor = c && (titlePlan.primaryCandidateIds.includes(c.id) || titlePlan.placements.some(p => p.candidateId === c.id)
      && (!titlePlan.primaryCandidateIds.length || title.sectionId === "C10" && c.sourceType === "GUIDANCE"));
    if (!eligibleAnchor || !c || title.sourceText !== c.sourceText || !draft.sections[title.sectionId].blocks[0]?.sourceUnitIds.includes(title.candidateId)) hard("TITLE_SOURCE_VIOLATION", [title.candidateId]);
    const spec = TITLE_SKELETONS.find(s => s.id === title.skeletonId);
    if (spec && (!spec.required.every(w => title.sourceText.includes(w)) || (c?.claimLevel ?? 2) < spec.minLevel)) hard("TITLE_UNGROUNDED", [title.skeletonId]);
    if (title.text.length > 50) warn("LONG_SOURCE_TITLE", [title.sectionId]);
  }
  for (let n = 2; n < draft.titleUsage.length; n++) if (draft.titleUsage.slice(n - 2, n + 1).every(t => t.type === draft.titleUsage[n].type)) hard("TITLE_TYPE_REPEAT", [draft.titleUsage[n].sectionId]);
  if (new Set(draft.titleUsage.map(t => t.text)).size !== draft.titleUsage.length) hard("TITLE_TEXT_REPEAT");
  for (const family of new Set(draft.titleUsage.map(t => t.family)))
    if (draft.titleUsage.filter(t => t.family === family).length > 2) hard("TITLE_FAMILY_OVERUSE", [family]);
  for (const use of draft.sceneUsage) {
    const c = input.plan.candidates.find(c => c.id === use.candidateId), spec = NARRATIVE_SCENES.find(s => s.id === use.sceneId);
    const p = input.plan.sections[use.sectionId].placements.find(p => p.candidateId === use.candidateId);
    if (!c || !p || !spec || !chooseNarrativeScene([spec], c, use.sectionId, p.context, input.profiles.guidance.context, selectedProofAxes(c, input.profiles), [], input.reportStableKey)) hard("UNSUPPORTED_SCENE", [use.sceneId]);
  }
  if (new Set(draft.sceneUsage.map(s => s.sceneId)).size !== draft.sceneUsage.length) hard("SCENE_REUSE");
  if (new Set(draft.sceneUsage.map(s => `${s.family}:${s.theme}`)).size !== draft.sceneUsage.length) hard("SCENE_THEME_REUSE");
  for (const budget of input.plan.themeBudget) {
    const renderedPrimarySections = sections.filter(s => input.plan.sections[s.sectionId].placements.some(p => p.role === "PRIMARY"
      && s.sourceCandidateIds.includes(p.candidateId) && input.plan.candidates.find(c => c.id === p.candidateId)?.broadTheme === budget.theme));
    if (renderedPrimarySections.length > budget.maxPrimaryUses) hard("PRIMARY_THEME_BUDGET", [budget.theme]);
  }
  const mbtiExplained = new Set<string>(), factThemes = new Set<string>();
  for (const s of sections) {
    for (const id of new Set(s.blocks.flatMap(b => b.sentences.filter(p => p.role === "MBTI_REASON").flatMap(p => p.mbtiSourceNodeIds)))) {
      if (mbtiExplained.has(id)) warn("MBTI_EXPLANATION_RECALL", [id, s.sectionId]);
      mbtiExplained.add(id);
    }
    for (const id of s.sourceCandidateIds) {
      const c = input.plan.candidates.find(c => c.id === id);
      if (!c?.factBomb) continue;
      if (factThemes.has(c.semanticTheme)) warn("FACT_BOMB_MEANING_RECALL", [c.semanticTheme, s.sectionId]);
      factThemes.add(c.semanticTheme);
    }
  }
  const earlier = new Set(sections.slice(0, 9).flatMap(s => s.evidenceIds));
  const c10 = draft.sections.C10;
  for (const id of c10.evidenceIds) if (!earlier.has(id)) hard("C10_NEW_EVIDENCE", [id]);
  for (const rule of c10.operatingRules ?? []) if (!rule.antecedentCandidateIds.some(id => sections.slice(0, 9).some(s => s.sourceCandidateIds.includes(id)))) hard("C10_NO_ANTECEDENT", [rule.candidateId]);
  if ((c10.operatingRules?.length ?? 0) < 3) warn("MANUAL_BELOW_TARGET");
  if (!draft.debug.coreRecall.length) warn("CORE_RECALL_LIMITED");
  const normalizeMeaning = (text: string) => text.replace(/^(?:일상에서는|일할 때는|돈을 생각할 때는|사람들과 지낼 때는|가까운 관계에서는|배울 때는|압박이 생길 때는|쉬는 시간에는)\s*/, "")
    .replace(/(?:있습니다|있어요|있죠|합니다|해요|하죠|입니다|이에요|이죠|않습니다|않아요|않죠)[.]$/, "");
  const meanings = new Map<string, string>();
  for (const s of sentences) {
    const meaning = normalizeMeaning(s.text);
    if (meanings.has(meaning)) warn("SURFACE_ONLY_MEANING_REPEAT", [meanings.get(meaning)!, s.id]);
    else meanings.set(meaning, s.id);
  }
  for (const s of sections) {
    if (s.blocks.some(b => b.sentences.some(sentence => /구조[.]$|보조합니다|보탭니다/.test(sentence.text)))) warn("SOURCE_EXPLANATORY_VOICE", [s.sectionId]);
    const sources = input.plan.sections[s.sectionId].placements.filter(p => p.presentationIntent === "EXPLICIT")
      .filter(p => input.plan.candidates.find(c => c.id === p.candidateId)?.fusionType);
    if (sources.some(p => !s.sourceCandidateIds.includes(p.candidateId))) warn("EXPLICIT_SOURCE_NOT_REALIZED", [s.sectionId]);
  }
  if (draft.explicitMbtiUsage > 7 || !input.profiles.mbti.available && draft.explicitMbtiUsage) hard("EXPLICIT_MBTI_BUDGET");
  if (terms.size > 16) warn("TERM_EXPOSURE_HIGH");
  for (const group of input.plan.debug.conflictGraph.filter(g => g.kind === "CONTRADICTORY" && !g.resolvedBy.length))
    if ([group.left, group.right].every(id => sections.some(s => s.sourceCandidateIds.includes(id)))) hard("UNRESOLVED_CONTRADICTION", [group.left, group.right]);
  const blocks = sections.flatMap(s => s.blocks), avg = (key: "readability" | "directness" | "humanDescriptiveness" | "evidenceGrounding" | "narrativeFlow" | "contextCoherence" | "repetitionPenalty") => blocks.length ? Math.round(blocks.reduce((n, b) => n + b.validation[key], 0) / blocks.length) : 0;
  const measure = (codes: string[]) => Math.max(0, 100 - hardViolations.filter(i => codes.includes(i.code)).length * 25);
  return { hardViolations, warnings, heuristicNotice: "편집 규칙 진단값이며 고객 체감 품질의 합격 판정을 대신하지 않습니다.", scores: {
    Readability: avg("readability"), Directness: avg("directness"), HumanDescriptiveness: avg("humanDescriptiveness"), EvidenceGrounding: avg("evidenceGrounding"),
    FusionQuality: input.profiles.mbti.available ? measure(["PRIMARY_NOT_RENDERED", "THIRD_INTERPRETATION_OMITTED"]) : null,
    NarrativeFlow: avg("narrativeFlow"), PositiveReward: Math.min(100, (draft.sections.C4.blocks.length + draft.sections.C5.blocks.length) * 25),
    FactBombValue: Math.min(100, draft.sections.C6.blocks.length * 34), AdviceSpecificity: c10.blocks.length ? measure(["C10_NO_ANTECEDENT"]) : null,
    ContextCoherence: avg("contextCoherence"), Repetition: avg("repetitionPenalty"), TerminologyExposure: terms.size,
    SceneGrounding: measure(["UNSUPPORTED_SCENE", "SCENE_REUSE"]), TitleGrounding: measure(["TITLE_SOURCE_VIOLATION", "TITLE_UNGROUNDED"]),
    CoreRecall: draft.debug.coreRecall.length ? 100 : 0, C10Continuity: measure(["C10_NEW_EVIDENCE", "C10_NO_ANTECEDENT"]),
  } };
}
