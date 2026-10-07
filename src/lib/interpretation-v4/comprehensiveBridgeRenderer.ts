import { SECTION_BRIDGE_REGISTRY } from "./narrativeConnectors";
import { renderNarrativeBlock } from "./narrativeBlockRenderer";
import type { ManuscriptInput, ManuscriptMemory, RenderedComprehensiveSection } from "./comprehensiveManuscriptCore";
import type { NarrativeSourceUnit } from "./narrativeCore";

export function renderComprehensiveBridge(input: ManuscriptInput, before: RenderedComprehensiveSection, after: RenderedComprehensiveSection, memory: ManuscriptMemory) {
  const intent = input.plan.sections[before.sectionId].bridgeIntent;
  const common = before.semanticThemes.some(t => after.semanticThemes.includes(t));
  const safe = !!intent && before.blocks.length > 0 && after.blocks.length > 0
    && (intent === "IDENTITY_TO_REINFORCE" ? after.sectionKind === "REINFORCE" : intent === "STRENGTH_TO_FORTUNE" ? after.sectionKind === "GOOD_FORTUNE"
      : intent === "REINFORCE_TO_TENSION" ? after.sectionKind === "TENSION" : intent === "RECOVERY_TO_MANUAL" ? true : common);
  if (!safe || !intent) return { used: false as const, reason: "FLOW_ALREADY_SUFFICIENT_OR_NO_SHARED_MEANING", memory, intent };
  const source: NarrativeSourceUnit = { id: `bridge:${before.sectionId}:${after.sectionId}`, sourceType: "SECTION_BRIDGE", semanticTheme: `bridge:${intent}`,
    primaryAxes: [], contexts: ["identity"], confidence: "HIGH", directnessLevel: 0,
    phrases: [{ id: `bridge:${intent}`, role: "CLOSER", text: SECTION_BRIDGE_REGISTRY[intent], semanticTheme: `bridge:${intent}`, primaryAxes: [],
      contexts: ["identity"], directnessLevel: 0, origin: "BRIDGE", refs: { evidenceIds: before.evidenceIds, claimIds: [], fusionIds: [], resonanceIds: [], guidanceIds: [], mbtiSourceNodeIds: [] } }] };
  const r = renderNarrativeBlock({ source, reportStableKey: input.reportStableKey, sectionId: after.sectionId, intent: "HUMAN", depthIntent: "SHORT",
    context: "identity", presentationIntent: "HIDDEN", explicitMbtiBudget: 7, patternId: "P21" }, memory.language);
  return r.ok ? { used: true as const, sentence: r.block.sentences[0], memory: { ...memory, language: r.nextMemory }, reason: "SUPPORTED_TRANSITION", intent }
    : { used: false as const, reason: "RHYTHM_OR_SOURCE_GUARD", memory, intent };
}
