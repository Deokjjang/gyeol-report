import { GYEOL_COMPREHENSIVE_MANUSCRIPT_VERSION, type ManuscriptInput, type ManuscriptMemory, type RenderedComprehensiveSection, type ComprehensiveManuscriptDraft } from "./comprehensiveManuscriptCore";
import type { ComprehensiveSectionId } from "./comprehensivePlanCore";
import type { NarrativeRequest, NarrativeRenderResult } from "./narrativeCore";
import { adaptComprehensiveSource } from "./comprehensiveNarrativeAdapter";
import { renderNarrativeBlock } from "./narrativeBlockRenderer";
import { chooseNarrativeTitle } from "./narrativeTitleCore";
import { meaningSignature, repeatedMeaning, recoveryRelevant } from "./narrativeMeaningSignature";
import { humanFirstPenalty } from "./narrativeHumanFirst";
import { rhythmPenalty, rhythmSignature } from "./narrativeRhythm";
import { classifyRecovery } from "./narrativeRecovery";

export function renderComprehensiveSection(input: ManuscriptInput, id: ComprehensiveSectionId, memory: ManuscriptMemory,
  diagnostics: ComprehensiveManuscriptDraft["diagnostics"], debug: ComprehensiveManuscriptDraft["debug"]) {
  const plan = input.plan.sections[id];
  const section: RenderedComprehensiveSection = { sectionId: id, sectionKind: plan.sectionKind, title: "", blocks: [], plainText: "",
    sourceCandidateIds: [], evidenceIds: [], semanticThemes: [], explicitMbtiCount: 0, sceneIds: [], terminologyUsed: [],
    validation: { hardViolations: [], warnings: [] }, ...(id === "C10" ? { operatingRules: [] } : {}) };
  const next = structuredClone(memory);
  const explicitStart = next.language.usedExplicitMbtiMentions;
  // Only move the scheduler's selected closing operating principle to the end.
  // No new advice or fallback to the unselected candidate pool.
  const closing = input.plan.finalCoreRecallIntent.operatingPrincipleGuidanceId;
  const placements = id === "C9" ? [...plan.placements].sort((a,b)=>classifyRecovery(input.plan.candidates.find(c=>c.id===b.candidateId)!).relevance-classifyRecovery(input.plan.candidates.find(c=>c.id===a.candidateId)!).relevance) : id === "C10" ? [...plan.placements].sort((a, b) =>
    Number(input.plan.candidates.find(c => c.id === a.candidateId)?.sourceId === closing)
    - Number(input.plan.candidates.find(c => c.id === b.candidateId)?.sourceId === closing)) : plan.placements;
  for (const placement of placements) {
    const adapted = adaptComprehensiveSource(input.plan, input.profiles, id, placement, next.language, next.usedScenes, input.reportStableKey);
    if (!adapted) { section.validation.hardViolations.push({ code: "INVALID_PLACED_SOURCE", refs: [placement.candidateId] }); continue; }
    debug.sources[`${id}:${placement.candidateId}`] = adapted;
    const c = adapted.candidate;
    if(id==="C9" && classifyRecovery(c).kind==="GENERIC_TRAIT") {
      diagnostics.suppressed.push({sectionId:id,candidateId:c.id,reasons:["C9_GENERIC_TRAIT_NOT_RECOVERY"]});continue;
    }
    const openingCore=id==="C1"?input.plan.candidates.find(x=>x.sourceType==="CORE_GYEOL" && section.sourceCandidateIds.includes(x.id)):undefined;
    if(openingCore && c.sourceType==="PERSONAL_RESONANCE" && openingCore.resonanceIds.includes(c.sourceId)
      && c.broadTheme===openingCore.broadTheme && c.primaryAxes.every(a=>openingCore.primaryAxes.includes(a))) {
      diagnostics.suppressed.push({sectionId:id,candidateId:c.id,reasons:["CORE_IDENTITY_ALREADY_INTRODUCED",openingCore.id]});continue;
    }
    const meaning=meaningSignature(c,id,placement), duplicate=repeatedMeaning(meaning,next.meanings??[]);
    const preserveQuestion=id==="C8" && (placement.context==="money" || !section.blocks.length);
    if(duplicate && !preserveQuestion && c.sourceType!=="CORE_GYEOL" && !c.fortune && id!=="C3") {
      diagnostics.suppressed.push({sectionId:id,candidateId:c.id,reasons:["SEMANTIC_SAME_ROLE",duplicate.candidateId]});continue;
    }
    if(id==="C9" && !recoveryRelevant(c) && placements.some(p=>recoveryRelevant(input.plan.candidates.find(c=>c.id===p.candidateId)!))) {
      diagnostics.suppressed.push({sectionId:id,candidateId:c.id,reasons:["RECOVERY_PRIORITY_NOT_GROWTH"]});continue;
    }
    if (c.sourceType === "GUIDANCE" && id !== "C10" && !placement.preferredAdvice) {
      diagnostics.suppressed.push({ sectionId: id, candidateId: c.id, reasons: ["GUIDANCE_RESERVED_FOR_MANUAL"] }); continue;
    }
    const coreOpening = id === "C1" && c.sourceType === "CORE_GYEOL";
    const request: NarrativeRequest = { source: adapted.source, reportStableKey: input.reportStableKey, sectionId: id, intent: adapted.intent,
      depthIntent: plan.depthIntent, context: placement.context, presentationIntent: placement.presentationIntent,
      ...(coreOpening ? { patternId: "P01" } : {}),
      engineVersion: GYEOL_COMPREHENSIVE_MANUSCRIPT_VERSION,
      explicitMbtiBudget: Math.min(input.plan.explicitMbtiBudget.max, explicitStart + plan.maxExplicitMbti), occurrenceIndex: section.blocks.length };
    const attempts = [renderNarrativeBlock(request, next.language)];
    const continuations = adapted.intent === "GUIDANCE" ? ["P17"] : adapted.intent === "FORTUNE" ? ["P18"] : adapted.intent === "FACT_BOMB" ? ["P20"]
      : adapted.intent === "HUMAN" ? ["P19", "P24"] : adapted.intent === "COMPLEMENT" ? ["P22", "P30", "P25"] : adapted.intent === "REINFORCE" ? ["P28", "P29", "P23"] : adapted.intent === "TENSION" ? ["P27", "P26"] : [];
    for (const patternId of continuations) attempts.push(renderNarrativeBlock({ ...request, patternId }, next.language));
    const rewardDepth = ["C4", "C5"].includes(id) && !adapted.source.fusionType
      && ["MYEONGLI_REASON", "CLOSER"].every(role=>adapted.source.phrases.some(p=>p.role===role));
    const min = id === "C6" || id === "C10" || c.sourceType === "GUIDANCE" ? 1 : rewardDepth ? 3 : 2;
    const complete = (r: NarrativeRenderResult) => r.ok && r.block.sentences.length >= min
      && (!coreOpening || r.block.sentences[0]?.role === "DIRECT_CLAIM")
      && (!rewardDepth || ["MYEONGLI_REASON", "CLOSER"].every(role=>r.block.sentenceRoles.some(r=>r===role)))
      && (!(adapted.source.fusionType && placement.presentationIntent === "EXPLICIT")
        || ["MYEONGLI_REASON", "MBTI_REASON"].every(role => r.block.sentenceRoles.some(r => r === role)));
    const surfacePenalty=(r:NarrativeRenderResult)=>humanFirstPenalty(r.block.sentences,id)+rhythmPenalty(rhythmSignature(r.block,meaning),next.rhythms??[])
      + (adapted.intent==="TENSION" && !r.block.sentences[0]?.sourcePhraseId.endsWith(":third")?5:0)
      + (adapted.intent==="REINFORCE" && !["P28","P29"].includes(r.block.patternId.split(":")[0])?3:0);
    let result = attempts.filter(complete).sort((a,b)=>surfacePenalty(a)-surfacePenalty(b))[0];
    // Bounded surface/order search, never a change of evidence or sentence meaning.
    for (let variant = 1; !result && variant <= 5; variant++) {
      for (const patternId of [request.patternId, ...continuations]) {
        const r = renderNarrativeBlock({ ...request, patternId, occurrenceIndex: variant + section.blocks.length * 10 }, next.language);
        attempts.push(r);
        if (complete(r)) { result = r; break; }
      }
    }
    (debug.sources[`${id}:${placement.candidateId}`] as Record<string, unknown>).attempts = attempts.map(r => ({ pattern: r.block.patternId, text: r.block.plainText, errors: r.block.validation.hardViolations }));
    if (!result) {
      diagnostics.suppressed.push({ sectionId: id, candidateId: c.id, reasons: [...new Set(attempts.flatMap(r => r.block.validation.hardViolations.map(v => v.code)).concat("NO_COMPLETE_SOURCE_BLOCK"))] });
      if (placement.role === "PRIMARY") section.validation.hardViolations.push({ code: "PRIMARY_NOT_RENDERED", refs: [c.id] });
      continue;
    }
    next.language = result.nextMemory;
    next.meanings=[...(next.meanings??[]),meaning];
    next.rhythms=[...(next.rhythms??[]),rhythmSignature(result.block,meaning)];
    section.blocks.push(result.block); section.sourceCandidateIds.push(c.id);
    section.evidenceIds.push(...result.block.sentences.flatMap(s => s.evidenceIds)); section.semanticThemes.push(c.broadTheme);
    section.terminologyUsed.push(...result.block.terminologyUsed);
    section.validation.warnings.push(...result.block.validation.warnings);
    if (!section.title && (placement.role === "PRIMARY" || !plan.primaryCandidateIds.length || id === "C9" || id === "C10" && c.sourceType === "GUIDANCE")) {
      const title = chooseNarrativeTitle(c, id, next.usedTitles, input.reportStableKey,input.profiles.guidance.context.lifeStatus);
      section.title = title.text; next.usedTitles.push(title);
    }
    if (adapted.scene && result.block.sentences.some(s => s.role === "LIFE_SCENE")) {
      next.usedScenes.push(adapted.scene); section.sceneIds.push(adapted.scene.sceneId);
    }
    if (section.operatingRules && c.sourceType === "GUIDANCE") section.operatingRules.push({ candidateId: c.id,
      text: result.block.plainText, antecedentCandidateIds: [...placement.antecedentCandidateIds] });
  }
  section.explicitMbtiCount = next.language.usedExplicitMbtiMentions - explicitStart;
  section.evidenceIds = [...new Set(section.evidenceIds)]; section.semanticThemes = [...new Set(section.semanticThemes)];
  section.terminologyUsed = [...new Set(section.terminologyUsed)];
  section.plainText = section.blocks.map(b => b.plainText).join("\n\n");
  if (!section.blocks.length) (plan.placements.length && id!=="C9" ? section.validation.hardViolations : section.validation.warnings).push({ code: id==="C9"?"C9_NO_SELECTED_RECOVERY_SOURCE":"EMPTY_SECTION", refs: [id] });
  if (!section.title) section.validation.warnings.push({ code: "NO_PRIMARY_TITLE", refs: [id] });
  return { section, memory: next };
}
