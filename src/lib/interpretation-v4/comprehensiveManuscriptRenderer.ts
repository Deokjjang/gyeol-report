import { COMPREHENSIVE_SECTIONS } from "./comprehensivePlanCore";
import { freshNarrativeMemory } from "./narrativeMemory";
import { renderComprehensiveSection } from "./comprehensiveSectionRenderer";
import { validateComprehensiveManuscript } from "./comprehensiveManuscriptValidator";
import { GYEOL_COMPREHENSIVE_MANUSCRIPT_VERSION, type ManuscriptInput, type ComprehensiveManuscriptDraft } from "./comprehensiveManuscriptCore";
import { buildComprehensiveEditorialPlan } from "./comprehensiveEditorialPlan";
import { renderComprehensiveBridge } from "./comprehensiveBridgeRenderer";

/** Standalone draft boundary. No packet, product writer, filesystem or UI dependency. */
export function renderComprehensiveManuscript(input: ManuscriptInput) {
  const rebuilt = buildComprehensiveEditorialPlan(input.profiles);
  if (!rebuilt.ok || JSON.stringify(rebuilt.value) !== JSON.stringify(input.plan)) return { ok: false as const, error: "PLAN_SOURCE_MISMATCH" as const };
  const draft: ComprehensiveManuscriptDraft = { version: GYEOL_COMPREHENSIVE_MANUSCRIPT_VERSION, reportStableKey: input.reportStableKey,
    coreGyeol: { sourceId: input.plan.coreGyeolId, text: input.profiles.resonance.bestCoreGyeol?.humanDescription ?? "" },
    sections: {} as ComprehensiveManuscriptDraft["sections"], fullText: "", narrativeMemory: { language: freshNarrativeMemory(), usedScenes: [], usedTitles: [] },
    terminologyUsage: [], explicitMbtiUsage: 0, sceneUsage: [], titleUsage: [], semanticThemeUsage: {},
    diagnostics: { warnings: [], suppressed: [] }, debug: { sources: {}, bridgeDecisions: [], coreRecall: [] },
    validation: { hardViolations: [], warnings: [], scores: {}, heuristicNotice: "" } };
  for (const [index, id] of COMPREHENSIVE_SECTIONS.entries()) {
    let localDiagnostics: ComprehensiveManuscriptDraft["diagnostics"] = { warnings: [], suppressed: [] };
    let localDebug: ComprehensiveManuscriptDraft["debug"] = { sources: {}, bridgeDecisions: [], coreRecall: [] };
    let rendered = renderComprehensiveSection(input, id, draft.narrativeMemory, localDiagnostics, localDebug);
    let bridgeDecision = { sectionId: id, intent: input.plan.sections[id].bridgeIntent, used: false, reason: "DIRECT_SECTION_OPENING_SUFFICIENT" };
    if (index > 0) {
      const bridge = renderComprehensiveBridge(input, draft.sections[COMPREHENSIVE_SECTIONS[index - 1]], rendered.section, draft.narrativeMemory);
      bridgeDecision = { sectionId: id, intent: bridge.intent, used: false, reason: bridge.reason };
      if (bridge.used) {
        const retryDiagnostics: ComprehensiveManuscriptDraft["diagnostics"] = { warnings: [], suppressed: [] };
        const retryDebug: ComprehensiveManuscriptDraft["debug"] = { sources: {}, bridgeDecisions: [], coreRecall: [] };
        const retry = renderComprehensiveSection(input, id, bridge.memory, retryDiagnostics, retryDebug);
        if (retry.section.validation.hardViolations.length <= rendered.section.validation.hardViolations.length) {
          retry.section.bridgeIn = bridge.sentence;
          retry.section.plainText = `${bridge.sentence.text}\n\n${retry.section.plainText}`;
          rendered = retry; localDiagnostics = retryDiagnostics; localDebug = retryDebug; bridgeDecision.used = true;
        } else bridgeDecision.reason = "BRIDGE_WOULD_DISPLACE_SOURCE";
      }
    }
    draft.sections[id] = rendered.section; draft.narrativeMemory = rendered.memory;
    draft.diagnostics.suppressed.push(...localDiagnostics.suppressed);
    Object.assign(draft.debug.sources, localDebug.sources); draft.debug.bridgeDecisions.push(bridgeDecision);
  }
  draft.debug.coreRecall = draft.sections.C10.sourceCandidateIds.filter(id => {
    const c = input.plan.candidates.find(c => c.id === id)!;
    return c.sourceId === input.plan.finalCoreRecallIntent.operatingPrincipleGuidanceId;
  });
  draft.terminologyUsage = draft.narrativeMemory.language.usedTermDefinitions;
  draft.explicitMbtiUsage = draft.narrativeMemory.language.usedExplicitMbtiMentions;
  draft.sceneUsage = draft.narrativeMemory.usedScenes; draft.titleUsage = draft.narrativeMemory.usedTitles;
  draft.semanticThemeUsage = draft.narrativeMemory.language.usedSemanticThemes;
  draft.fullText = COMPREHENSIVE_SECTIONS.map(id => `${draft.sections[id].title}\n\n${draft.sections[id].plainText}`).join("\n\n");
  draft.validation = validateComprehensiveManuscript(input, draft);
  return { ok: true as const, draft };
}
