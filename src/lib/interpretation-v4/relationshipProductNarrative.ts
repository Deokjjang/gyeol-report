import { renderNarrativeBlock } from "./narrativeBlockRenderer";
import { freshNarrativeMemory } from "./narrativeMemory";
import { chooseNarrativeScene, type SceneUse } from "./narrativeSceneCore";
import { NARRATIVE_SCENES } from "./narrativeSceneRegistry";
import { selectedProofAxes } from "./comprehensiveNarrativeAdapter";
import { directHumanSurface, fusionHumanSurface, RELATION_APPLICATION } from "./narrativeHumanSurface";
import { humanMbtiReason } from "./narrativeMbtiReason";
import { fortuneReason, fortuneSupportReason, planFortuneReasons, positiveReward } from "./narrativePositiveReward";
import { humanOutcome } from "./narrativeHumanOutcome";
import type { RelationshipView, RelationshipPlacement } from "./relationshipProductView";
import type { EditorialCandidate } from "./comprehensivePlanCore";
import type { NarrativePhrase, NarrativeSourceUnit, NarrativeIntent } from "./narrativeCore";
import type { InterpretationContext } from "./semanticCore";
import type { NarrativeBlock, NarrativeProof } from "./narrativeTypes";

export const relationshipProof = (c: EditorialCandidate): NarrativeProof => ({ features: [], seedIds: [], fusionIds: c.fusionIds,
  sourceRefs: [...c.evidenceIds, ...c.claimIds, ...c.resonanceIds, ...c.guidanceIds] });

/** Product source adapter into the frozen Korean renderer. All behavior, scenes,
 * titles, sentence roles and realization guards remain owned by the 13D core. */
export function createRelationshipRenderer(view: RelationshipView, stableKey: string, single = false) {
  const profiles = view.profiles;
  let memory = freshNarrativeMemory();
  const scenes: SceneUse[] = [], suppressed: string[] = [];
  const fortuneReasons = new Set<string>();
  const represented: { question: string; source: string; theme: string; mbtiDomain?: string; mbtiNode?: string; scene?: string }[] = [];
  const safe = (text: string) => !/질투|바람기|바람을|집착|결혼할|배우자가 될/.test(text)
    && (!single || !/연인|배우자|지금 사귀|결혼 생활/.test(text));
  function render(c: EditorialCandidate, question: string, context: InterpretationContext): NarrativeBlock | undefined {
    const refs = { evidenceIds: c.myeongliEvidenceIds, claimIds: c.claimIds, fusionIds: c.fusionIds, resonanceIds: c.resonanceIds,
      guidanceIds: c.guidanceIds, mbtiSourceNodeIds: c.mbtiSourceNodeIds.filter(id => view.nodes.some(n => n.id === id)) };
    const level = c.claimLevel ?? 2, phrases: NarrativePhrase[] = [], selectedFortuneReasons: string[] = [];
    const add = (role: NarrativePhrase["role"], text: string | undefined, origin: NarrativePhrase["origin"], extra: Partial<NarrativePhrase> = {}) => {
      if (text && safe(text)) phrases.push({ id: `${c.id}:${question}:${phrases.length}`, role, text, origin, semanticTheme: c.semanticTheme,
        primaryAxes: c.primaryAxes, contexts: [context], directnessLevel: level, refs, ...extra });
    };
    let intent: NarrativeIntent = "HUMAN";
    const source: NarrativeSourceUnit = { id: `${c.id}:${question}`, sourceType: c.sourceType === "MYEONGLI_PATTERN" ? "MYEONGLI_EVIDENCE" : c.sourceType,
      semanticTheme: c.semanticTheme, primaryAxes: c.primaryAxes, contexts: [context], confidence: c.confidence >= .75 ? "HIGH" : "MEDIUM",
      directnessLevel: level, phrases, metadata: { mbtiType: profiles.mbti.mbtiType ?? undefined } };
    const atoms = profiles.myeongli.evidence.filter(e => c.myeongliEvidenceIds.includes(e.id));
    const applicable = atoms.filter(e => c.primaryAxes.some(a => e.axes[a])).sort((a, b) => b.weight - a.weight);
    const fusion = c.sourceType === "FUSION" ? [...profiles.fusion.reinforce, ...profiles.fusion.tensions, ...profiles.fusion.complements].find(f => f.id === c.sourceId) : undefined;
    // Prefer the actual Love/Marriage node, without altering its annotation or
    // the individual's complete source profile. Pair DB rows are never here.
    const domain = view.domains.find(d => view.nodes.some(n => n.sourceDomain === d && fusion?.mbti.sourceNodeIds.includes(n.id)));
    const reason = fusion && memory.usedExplicitMbtiMentions < 5 ? humanMbtiReason({ ...profiles, mbti: { ...profiles.mbti,
      sourceNodes: view.nodes.filter(n => n.sourceDomain === domain) } }, fusion, "C7", memory) : undefined;
    const human = directHumanSurface(c) ?? fusionHumanSurface(c) ?? c.sourceText;
    if (c.sourceType === "GUIDANCE") {
      intent = "GUIDANCE";
      const g = [...profiles.guidance.guidanceCandidates, ...profiles.guidance.mergedGuidance].find(g => g.id === c.sourceId);
      add("ACTION", g?.customerAdvice, "GUIDANCE"); add("MYEONGLI_REASON", g?.whyThisFits, "GUIDANCE");
    } else if (c.fortune) {
      intent = "FORTUNE"; add("GOOD_RESULT", c.sourceText, "SYNTHESIS");
      const plan = planFortuneReasons(c, profiles);
      selectedFortuneReasons.push(...[...plan.primaryReasonEvidenceIds, ...plan.secondaryReasonEvidenceIds].flatMap(id => {
        const atom = atoms.find(e => e.id === id), text = atom && (plan.secondaryReasonEvidenceIds.includes(id) ? fortuneSupportReason(atom, c) : fortuneReason(atom));
        return text && !fortuneReasons.has(text) ? [text] : [];
      }));
      add("MYEONGLI_REASON", selectedFortuneReasons.join(" "), "MYEONGLI");
      add("CLOSER", positiveReward(c, atoms), "SYNTHESIS");
    } else if (fusion && reason) {
      intent = fusion.type; source.fusionType = fusion.type; source.conditionSplit = fusion.conditionSplit;
      const side = fusion.myeongli.side, atom = applicable.find(e => (e.axes[side.axis] ?? 0) * side.direction > 0);
      add("MYEONGLI_REASON", atom?.humanDescription ?? humanOutcome(side.axis, side.direction), "MYEONGLI");
      add("MBTI_REASON", reason.text, "MBTI_ACTUAL", { refs: { ...refs, mbtiSourceNodeIds: [reason.nodeId] } });
      add("DIRECT_CLAIM", fusion.type === "TENSION" ? human : atom?.positiveMeaning ?? human, "SYNTHESIS");
      if (fusion.type === "TENSION") {
        add("CONTRAST", `‘${fusion.conditionSplit!.sides!.myeongli}’와 ‘${fusion.conditionSplit!.sides!.mbti}’가 서로 다른 순간에 드러나는 모습이에요.`, "SYNTHESIS", { splitType: fusion.conditionSplit?.type });
        add("CLOSER", human, "SYNTHESIS", { thirdInterpretation: true });
      } else add("FUSION", human, "SYNTHESIS", { thirdInterpretation: fusion.type === "COMPLEMENT" });
    } else {
      intent = c.factBomb && ["CLAIM", "TRAIT_ARC"].includes(c.sourceType) ? "FACT_BOMB" : "HUMAN";
      add("DIRECT_CLAIM", human, "SYNTHESIS");
      add("MYEONGLI_REASON", applicable.find(e => e.humanDescription !== human)?.humanDescription, "MYEONGLI");
      const arc = profiles.resonance.traitArcs.find(a => a.id === c.sourceId);
      const positive = arc?.strengthDescription ?? profiles.resonance.candidates.find(r => r.id === c.sourceId)?.positiveMeaning;
      add("CLOSER", c.factBomb ? positive : c.primaryAxes.map(a => (selectedProofAxes(c, profiles)[a] ?? 0) > 0 ? RELATION_APPLICATION[a] : undefined).find(Boolean) ?? positive, "SYNTHESIS");
    }
    const scene = c.sourceType !== "GUIDANCE" && !c.fortune ? chooseNarrativeScene(NARRATIVE_SCENES.filter(s => safe(s.sourceText)), c, "C7", context,
      profiles.guidance.context, selectedProofAxes(c, profiles), scenes, stableKey) : undefined;
    if (scene) add("LIFE_SCENE", scene.scene.sourceText, "SCENE");
    const patterns = intent === "TENSION" ? ["P27", "P26", "P07"] : intent === "COMPLEMENT" ? ["P30", "P22", "P08"]
      : intent === "REINFORCE" ? ["P28", "P29", "P04"] : intent === "GUIDANCE" ? ["P12", "P17"]
        : intent === "FACT_BOMB" ? ["P10", "P20"] : intent === "FORTUNE" ? ["P18", "P09"] : ["P24", "P19", "P01", "P03"];
    for (const patternId of patterns) {
      const result = renderNarrativeBlock({ source, reportStableKey: stableKey, sectionId: question, intent, context, depthIntent: "DEEP",
        presentationIntent: reason ? "EXPLICIT" : "HIDDEN", explicitMbtiBudget: 5, patternId }, memory);
      if (!result.ok) continue;
      memory = result.nextMemory;
      if (c.fortune && result.block.sentences.some(s => s.role === "MYEONGLI_REASON")) selectedFortuneReasons.forEach(text => fortuneReasons.add(text));
      if (scene && result.block.sentences.some(s => s.role === "LIFE_SCENE")) scenes.push({ sceneId: scene.scene.id, family: scene.scene.family, theme: c.semanticTheme, candidateId: c.id, sectionId: "C7", score: scene.score });
      const mbtiUsed = reason && result.block.sentences.some(s => s.role === "MBTI_REASON");
      represented.push({ question, source: c.id, theme: c.semanticTheme, ...(mbtiUsed ? { mbtiDomain: reason.domain!, mbtiNode: reason.nodeId } : {}), ...(scene ? { scene: scene.scene.id } : {}) });
      return { id: `${question.toLowerCase()}-${represented.length}`, text: result.block.plainText, mode: "prose", tone: c.factBomb ? "shadow" : intent === "GUIDANCE" ? "direction" : "positive",
        proof: { ...relationshipProof(c), sourceRefs: [...relationshipProof(c).sourceRefs, ...(scene ? [scene.scene.id] : [])] } };
    }
    suppressed.push(c.id); return undefined;
  }
  return { render, placement: (p: RelationshipPlacement) => render(p.candidate, p.question, p.context), represented, suppressed };
}
