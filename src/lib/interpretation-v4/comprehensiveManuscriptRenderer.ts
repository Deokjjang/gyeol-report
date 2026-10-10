import { COMPREHENSIVE_SECTIONS } from "./comprehensivePlanCore";
import { freshNarrativeMemory } from "./narrativeMemory";
import { renderComprehensiveSection } from "./comprehensiveSectionRenderer";
import { validateComprehensiveManuscript } from "./comprehensiveManuscriptValidator";
import { GYEOL_COMPREHENSIVE_MANUSCRIPT_VERSION, type ManuscriptInput, type ComprehensiveManuscriptDraft } from "./comprehensiveManuscriptCore";
import { buildComprehensiveEditorialPlan } from "./comprehensiveEditorialPlan";
import { renderComprehensiveBridge } from "./comprehensiveBridgeRenderer";
import { renderOperatingManual } from "./operatingRuleRenderer";
import { GYEOL_MANUSCRIPT_POLISH_VERSION } from "./comprehensiveManuscriptPolish";
import { auditManuscriptQuality } from "./manuscriptQualityAudit";
import { auditHumanManuscript } from "./manuscriptHumanAudit";
import type { RenderabilityExclusion } from "./comprehensiveRenderability";

/** Standalone draft boundary. No packet, product writer, filesystem or UI dependency. */
export function renderComprehensiveManuscript(input: ManuscriptInput) {
  const rebuilt = buildComprehensiveEditorialPlan(input.profiles);
  if (!rebuilt.ok || JSON.stringify(rebuilt.value) !== JSON.stringify(input.plan)) return { ok: false as const, error: "PLAN_SOURCE_MISMATCH" as const };
  const exclusions: RenderabilityExclusion[] = [];
  let current = input;
  for (let pass = 0; ; pass++) {
    const draft = renderSelectedManuscript(current);
    const rejected = COMPREHENSIVE_SECTIONS.filter(s => s !== "C10").flatMap(section => current.plan.sections[section].placements
      .filter(p => !draft.sections[section].sourceCandidateIds.includes(p.candidateId))
      .map(p => ({ section, candidateId: p.candidateId, primary: p.role === "PRIMARY", reason: draft.diagnostics.suppressed.find(s => s.sectionId === section && s.candidateId === p.candidateId)?.reasons[0] ?? "NOT_RENDERED" })));
    if (!rejected.length || pass === 3) {
      if (rejected.length) draft.validation.hardViolations.push({ code: "RENDERABILITY_NOT_CLOSED", refs: rejected.map(e => `${e.section}:${e.candidateId}`) });
      // Removing an unrenderable mandatory chapter is not a successful reallocation.
      for (const e of exclusions.filter(e => e.primary && !["C9_GENERIC_TRAIT_NOT_RECOVERY", "RECOVERY_PRIORITY_NOT_GROWTH", "SEMANTIC_SAME_ROLE"].includes(e.reason))) {
        if (!draft.sections[e.section].blocks.length) draft.validation.hardViolations.push({ code: "PRIMARY_NOT_RENDERED", refs: [e.candidateId, e.section] });
      }
      return { ok: true as const, draft, plan: current.plan, renderability: { passes: pass + 1, rejected: exclusions } };
    }
    exclusions.push(...rejected.filter(e => !exclusions.some(x => x.section === e.section && x.candidateId === e.candidateId)));
    const replanned = buildComprehensiveEditorialPlan(input.profiles, exclusions);
    if (!replanned.ok) return { ok: false as const, error: "RENDERABILITY_PLAN_FAILED" as const };
    current = { ...input, plan: replanned.value };
  }
}

function renderSelectedManuscript(input: ManuscriptInput): ComprehensiveManuscriptDraft {
  const draft: ComprehensiveManuscriptDraft = { version: GYEOL_COMPREHENSIVE_MANUSCRIPT_VERSION, reportStableKey: input.reportStableKey,
    coreGyeol: { sourceId: input.plan.coreGyeolId, text: input.profiles.resonance.bestCoreGyeol?.humanDescription ?? "" },
    sections: {} as ComprehensiveManuscriptDraft["sections"], fullText: "", narrativeMemory: { language: freshNarrativeMemory(), usedScenes: [], usedTitles: [] },
    terminologyUsage: [], explicitMbtiUsage: 0, sceneUsage: [], titleUsage: [], semanticThemeUsage: {},
    diagnostics: { warnings: [], suppressed: [] }, debug: { sources: {}, bridgeDecisions: [], coreRecall: [] },
    validation: { hardViolations: [], warnings: [], scores: {}, heuristicNotice: "" } };
  for (const [index, id] of COMPREHENSIVE_SECTIONS.entries()) {
    if(id==="C10") {
      const rendered=renderOperatingManual(input,draft);draft.sections.C10=rendered.section;draft.narrativeMemory=rendered.memory;continue;
    }
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
        if (retry.section.validation.hardViolations.length <= rendered.section.validation.hardViolations.length
          && rendered.section.sourceCandidateIds.every(id => retry.section.sourceCandidateIds.includes(id))) {
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
  draft.debug.coreRecall = draft.sections.C10.blocks.flatMap(b=>b.sentences.filter(s=>s.sourcePhraseId.endsWith(":core-recall")).map(s=>s.id));
  draft.diagnostics.warnings.push(`QUALITY_VERSION:${GYEOL_MANUSCRIPT_POLISH_VERSION}`);
  draft.terminologyUsage = draft.narrativeMemory.language.usedTermDefinitions;
  draft.explicitMbtiUsage = draft.narrativeMemory.language.usedExplicitMbtiMentions;
  draft.sceneUsage = draft.narrativeMemory.usedScenes; draft.titleUsage = draft.narrativeMemory.usedTitles;
  draft.semanticThemeUsage = draft.narrativeMemory.language.usedSemanticThemes;
  draft.fullText = COMPREHENSIVE_SECTIONS.map(id => `${draft.sections[id].title}\n\n${draft.sections[id].plainText}`).join("\n\n");
  draft.validation = validateComprehensiveManuscript(input, draft);
  draft.debug.quality = auditManuscriptQuality(draft);
  draft.debug.quality.humanFirst = auditHumanManuscript(draft,input);
  return draft;
}
