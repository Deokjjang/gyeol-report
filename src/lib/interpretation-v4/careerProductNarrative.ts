import type { CareerProfiles, CareerPlacement } from "./careerProductSelection";
import { CAREER_VISIBLE_DOMAINS } from "./careerProductSelection";
import type { EditorialCandidate } from "./comprehensivePlanCore";
import type { NarrativePhrase, NarrativeSourceUnit, NarrativeIntent, NarrativeMemory } from "./narrativeCore";
import type { InterpretationContext } from "./semanticCore";
import { renderNarrativeBlock } from "./narrativeBlockRenderer";
import { freshNarrativeMemory } from "./narrativeMemory";
import { chooseNarrativeScene, type SceneUse } from "./narrativeSceneCore";
import { NARRATIVE_SCENES } from "./narrativeSceneRegistry";
import { selectedProofAxes } from "./comprehensiveNarrativeAdapter";
import { directHumanSurface, fusionHumanSurface, WORK_APPLICATION } from "./narrativeHumanSurface";
import { statusVocabulary } from "./narrativeHumanFirst";
import { humanMbtiReason } from "./narrativeMbtiReason";
import { fortuneReason, planFortuneReasons, positiveReward } from "./narrativePositiveReward";
import { humanOutcome } from "./narrativeHumanOutcome";
import type { NarrativeBlock, NarrativeProof } from "./narrativeTypes";

export const careerProof = (c: EditorialCandidate): NarrativeProof => ({ features: [], seedIds: [], fusionIds: c.fusionIds,
  sourceRefs: [...c.evidenceIds, ...c.claimIds, ...c.resonanceIds, ...c.guidanceIds] });

export function createCareerRenderer(profiles: CareerProfiles, stableKey: string) {
  let memory: NarrativeMemory = freshNarrativeMemory();
  const scenes: SceneUse[] = [], diagnostics: { id: string; codes: string[] }[] = [];
  const rendered: { question: string; source: string; theme: string; mbtiDomains: string[]; text: string }[] = [];
  const life = profiles.guidance.context.lifeStatus;
  const learning = ["STUDENT", "JOB_SEEKER"].includes(life);
  const safeContext = (text: string) => life === "EMPLOYEE" || !/승진|상사|부하 직원|지금 회사|현재 회사/.test(text);
  function render(c: EditorialCandidate, question: string, context: InterpretationContext, action?: { text: string; title: string; ref: string }) {
    const refs = { evidenceIds: c.myeongliEvidenceIds, claimIds: c.claimIds, fusionIds: c.fusionIds,
      resonanceIds: c.resonanceIds, guidanceIds: action ? [action.ref] : c.guidanceIds, mbtiSourceNodeIds: c.mbtiSourceNodeIds };
    const level = c.claimLevel ?? 2, phrases: NarrativePhrase[] = [];
    const add = (role: NarrativePhrase["role"], text: string | undefined, origin: NarrativePhrase["origin"], extra: Partial<NarrativePhrase> = {}) => {
      if (!text) return;
      const value = statusVocabulary(text, life);
      if (!safeContext(value)) return;
      phrases.push({ id: `${c.id}:${question}:${phrases.length}`, role, text: value, origin, semanticTheme: c.semanticTheme,
        primaryAxes: c.primaryAxes, contexts: [context], directnessLevel: level, refs, ...extra });
    };
    let intent: NarrativeIntent = "HUMAN";
    const source: NarrativeSourceUnit = { id: `${c.id}:${question}`, sourceType: c.sourceType === "MYEONGLI_PATTERN" ? "MYEONGLI_EVIDENCE" : c.sourceType,
      semanticTheme: c.semanticTheme, primaryAxes: c.primaryAxes, contexts: [context], confidence: c.confidence >= .75 ? "HIGH" : "MEDIUM",
      directnessLevel: level, phrases, metadata: { mbtiType: profiles.mbti.mbtiType ?? undefined, problemAlreadyExplained: question === "K10" } };
    const atoms = profiles.myeongli.evidence.filter(e => c.myeongliEvidenceIds.includes(e.id));
    const applicable = atoms.filter(e => c.primaryAxes.some(a => e.axes[a])).sort((a, b) => b.weight - a.weight);
    const fusion = c.sourceType === "FUSION" ? [...profiles.fusion.reinforce, ...profiles.fusion.tensions, ...profiles.fusion.complements].find(f => f.id === c.sourceId) : undefined;
    const allowed = [...CAREER_VISIBLE_DOMAINS, ...(learning && context === "learning" ? ["STUDY"] : [])];
    const nodes = profiles.mbti.sourceNodes.filter(n => allowed.includes(n.sourceDomain ?? ""));
    const workNodes = nodes.filter(n => ["WORK", "CAREER"].includes(n.sourceDomain ?? "") && fusion?.mbti.sourceNodeIds.includes(n.id));
    const reason = fusion && memory.usedExplicitMbtiMentions < 6 ? humanMbtiReason({ ...profiles, mbti: { ...profiles.mbti,
      sourceNodes: context === "work" && workNodes.length ? workNodes : nodes } }, fusion, "C8", memory) : undefined;
    const human = directHumanSurface(c) ?? fusionHumanSurface(c) ?? c.sourceText;
    if (action || c.sourceType === "GUIDANCE") {
      intent = "GUIDANCE"; source.sourceType = "GUIDANCE";
      const g = [...profiles.guidance.guidanceCandidates, ...profiles.guidance.mergedGuidance].find(g => g.id === c.sourceId);
      add("ACTION", action?.text ?? g?.customerAdvice, "GUIDANCE");
      if (question !== "K10") add("DIRECT_CLAIM", g?.problemDescription, "SYNTHESIS");
      add("MYEONGLI_REASON", g?.whyThisFits, "GUIDANCE");
    } else if (c.fortune) {
      intent = "FORTUNE";
      add("GOOD_RESULT", c.sourceText, "SYNTHESIS");
      const plan = planFortuneReasons(c, profiles);
      const reasons = [...plan.primaryReasonEvidenceIds, ...plan.secondaryReasonEvidenceIds].flatMap(id => {
        const atom = atoms.find(e => e.id === id); return atom ? [fortuneReason(atom)] : [];
      }).filter(Boolean).join(" ");
      add("MYEONGLI_REASON", reasons, "MYEONGLI");
      add("CLOSER", positiveReward(c, atoms), "SYNTHESIS");
    } else if (fusion && reason) {
      intent = fusion.type; source.fusionType = fusion.type; source.conditionSplit = fusion.conditionSplit;
      const side = fusion.myeongli.side;
      const atom = applicable.find(e => (e.axes[side.axis] ?? 0) * side.direction > 0);
      add("MYEONGLI_REASON", atom?.humanDescription ?? humanOutcome(side.axis, side.direction), "MYEONGLI");
      add("MBTI_REASON", reason.text, "MBTI_ACTUAL", { refs: { ...refs, mbtiSourceNodeIds: [reason.nodeId] } });
      if (fusion.type === "TENSION") {
        add("DIRECT_CLAIM", human, "SYNTHESIS");
        add("CONTRAST", `‘${fusion.conditionSplit!.sides!.myeongli}’와 ‘${fusion.conditionSplit!.sides!.mbti}’가 서로 다른 순간에 드러나는 모습이에요.`, "SYNTHESIS", { splitType: fusion.conditionSplit?.type });
        add("CLOSER", human, "SYNTHESIS", { thirdInterpretation: true });
      } else {
        add("DIRECT_CLAIM", atom?.positiveMeaning ?? human, "MYEONGLI");
        add("FUSION", human, "SYNTHESIS", { thirdInterpretation: fusion.type === "COMPLEMENT" });
      }
    } else {
      const arc = profiles.resonance.traitArcs.find(a => a.id === c.sourceId);
      intent = c.factBomb && ["CLAIM", "TRAIT_ARC"].includes(c.sourceType) ? "FACT_BOMB" : "HUMAN";
      add("DIRECT_CLAIM", human, "SYNTHESIS");
      add("MYEONGLI_REASON", applicable.find(e => e.humanDescription !== human)?.humanDescription, "MYEONGLI");
      const positive = arc?.strengthDescription ?? profiles.resonance.candidates.find(r => r.id === c.sourceId)?.positiveMeaning;
      add("CLOSER", c.factBomb ? positive : c.primaryAxes.map(a => (selectedProofAxes(c, profiles)[a] ?? 0) > 0 ? WORK_APPLICATION[a] : undefined).find(Boolean) ?? positive, "SYNTHESIS");
    }
    const scene = !action && c.sourceType !== "GUIDANCE" && !c.fortune ? chooseNarrativeScene(NARRATIVE_SCENES.filter(s =>
      safeContext(s.sourceText) && (!learning || !/회의|고객|계약|부서|직원|업무|납품/.test(s.sourceText))), c, "C8", context,
    profiles.guidance.context, selectedProofAxes(c, profiles), scenes, stableKey) : undefined;
    if (scene) add("LIFE_SCENE", scene.scene.sourceText, "SCENE");
    const patterns = intent === "TENSION" ? ["P27", "P26", "P07"] : intent === "COMPLEMENT" ? ["P30", "P22", "P08"]
      : intent === "REINFORCE" ? ["P28", "P29", "P04"] : intent === "GUIDANCE" ? ["P12", "P17"]
        : intent === "FACT_BOMB" ? ["P10", "P20"] : intent === "FORTUNE" ? ["P18", "P09"] : ["P24", "P19", "P01", "P03"];
    for (const patternId of patterns) {
      const r = renderNarrativeBlock({ source, reportStableKey: stableKey, sectionId: question, intent, context, depthIntent: "DEEP",
        presentationIntent: reason ? "EXPLICIT" : "HIDDEN", explicitMbtiBudget: 6, patternId }, memory);
      if (!r.ok) continue;
      memory = r.nextMemory;
      if (scene && r.block.sentences.some(s => s.role === "LIFE_SCENE")) scenes.push({ sceneId: scene.scene.id, family: scene.scene.family, theme: c.semanticTheme, candidateId: c.id, sectionId: "C8", score: scene.score });
      rendered.push({ question, source: c.id, theme: c.semanticTheme, mbtiDomains: reason && r.block.sentences.some(s => s.role === "MBTI_REASON") ? [reason.domain!] : [], text: r.block.plainText });
      return { id: `${question.toLowerCase()}-${rendered.length}`, text: r.block.plainText, mode: "prose", tone: c.factBomb ? "shadow" : intent === "GUIDANCE" ? "direction" : "positive",
        proof: { ...careerProof(c), sourceRefs: [...careerProof(c).sourceRefs, ...(scene ? [scene.scene.id] : []), ...(action ? [action.ref] : [])] } } satisfies NarrativeBlock;
    }
    diagnostics.push({ id: c.id, codes: ["NO_SAFE_NONREPEATING_REALIZATION"] });
    return undefined;
  }
  return { render, placement: (p: CareerPlacement) => render(p.candidate, p.question, p.context), rendered, diagnostics,
    get explicitMbtiUsage() { return memory.usedExplicitMbtiMentions; } };
}
