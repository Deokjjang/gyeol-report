import type { ComprehensivePlanInputs, ComprehensiveEditorialPlan, ComprehensiveSectionId, CandidatePlacement, EditorialCandidate } from "./comprehensivePlanCore";
import type { NarrativeSourceUnit, NarrativePhrase, NarrativeIntent, NarrativeMemory, SentenceRole } from "./narrativeCore";
import type { EvidenceAtom, SemanticSignature } from "./semanticCore";
import { TEN_GOD_SEMANTICS } from "./foundationTenGods";
import { termDefinitionPhrase, NARRATIVE_IMAGES } from "./narrativeTerminology";
import { chooseNarrativeScene, type SceneUse } from "./narrativeSceneCore";
import { NARRATIVE_SCENES } from "./narrativeSceneRegistry";
import { hasExplicitMbti, hasFusionComparison } from "./narrativeSurface";
import { humanMbtiReason } from "./narrativeMbtiReason";
import { polishComprehensiveSource } from "./comprehensiveManuscriptPolish";
import { humanOutcome } from "./narrativeHumanOutcome";
import { GUIDANCE_SHORT_TITLES } from "./operatingRuleRegistry";

export type AdaptedNarrativeSource = { candidate: EditorialCandidate; placement: CandidatePlacement; source: NarrativeSourceUnit;
  intent: NarrativeIntent; scene?: SceneUse; provenance: string[]; diagnostics: string[] };
const stemLabels: Record<string, string> = { 甲: "갑목", 乙: "을목", 丙: "병화", 丁: "정화", 戊: "무토", 己: "기토", 庚: "경금", 辛: "신금", 壬: "임수", 癸: "계수" };
const branchLabels: Record<string, string> = { 子: "자수", 丑: "축토", 寅: "인목", 卯: "묘목", 辰: "진토", 巳: "사화", 午: "오화", 未: "미토", 申: "신금 지지", 酉: "유금", 戌: "술토", 亥: "해수" };
function atomLabel(e: EvidenceAtom): string | undefined {
  if (e.sourceType === "heavenly_stem") return stemLabels[e.sourceKey];
  if (e.sourceType === "earthly_branch") return branchLabels[e.sourceKey];
  if (e.sourceType === "ten_god") return TEN_GOD_SEMANTICS[e.sourceKey as keyof typeof TEN_GOD_SEMANTICS]?.label;
  return typeof e.metadata?.label === "string" ? e.metadata.label : undefined;
}
const sentence = (s: string) => /[.?]$/.test(s.trim()) ? s.trim() : /다$|요$|죠$/.test(s.trim()) ? `${s.trim()}.` : `${s.trim()}입니다.`;
function easyCustomerDefinition(e: EvidenceAtom) {
  // Definition-only surface, not a change to the semantic atom or its weight.
  return sentence(e.easyMeaning.replace(/쪽을 보조하는 기운/g,"모습과 관련된 기운")
    .replace(/눈을 보조하는 기운/g,"눈에 해당하는 기운")
    .replace(/시간을 보조하는 기운/g,"시간과 관련된 기운"));
}
export function selectedProofAxes(c: EditorialCandidate, i: ComprehensivePlanInputs): SemanticSignature {
  const axes: SemanticSignature = {};
  for (const e of i.myeongli.evidence.filter(e => c.myeongliEvidenceIds.includes(e.id))) for (const axis of c.primaryAxes) axes[axis] = (axes[axis] ?? 0) + (e.axes[axis] ?? 0) * e.weight;
  return axes;
}
/** The scheduler owns selection. This adapter reads only placed candidates and their actual root proof. */
export function adaptComprehensiveSource(plan: ComprehensiveEditorialPlan, i: ComprehensivePlanInputs, sectionId: ComprehensiveSectionId,
  placement: CandidatePlacement, memory: NarrativeMemory, scenes: readonly SceneUse[], reportStableKey: string): AdaptedNarrativeSource | undefined {
  const section = plan.sections[sectionId];
  if (!section.placements.some(p => JSON.stringify(p) === JSON.stringify(placement))) return undefined;
  const c = plan.candidates.find(c => c.id === placement.candidateId);
  if (!c || c.invalidReasons.length) return undefined;
  const context = placement.context, diagnostics: string[] = [], phrases: NarrativePhrase[] = [];
  const refs = { evidenceIds: [...c.myeongliEvidenceIds], claimIds: [...c.claimIds], fusionIds: [...c.fusionIds],
    resonanceIds: [...c.resonanceIds], guidanceIds: [...c.guidanceIds], mbtiSourceNodeIds: [...c.mbtiSourceNodeIds] };
  const level = c.claimLevel ?? 2;
  const add = (role: SentenceRole, text: string | undefined, origin: NarrativePhrase["origin"], id: string, extra: Partial<NarrativePhrase> = {}) => {
    if (!text?.trim()) return;
    phrases.push({ id: `${c.id}:${id}`, role, text: sentence(text), semanticTheme: c.semanticTheme, primaryAxes: [...c.primaryAxes],
      contexts: [context], directnessLevel: level, refs: structuredClone(refs), origin, ...extra });
  };
  let intent: NarrativeIntent = c.sourceType === "GUIDANCE" ? "GUIDANCE" : c.fortune ? "FORTUNE" : c.factBomb ? "FACT_BOMB"
    : c.fusionType && placement.presentationIntent === "EXPLICIT" ? c.fusionType : "HUMAN";
  const sourceType = c.sourceType === "MYEONGLI_PATTERN" ? "MYEONGLI_EVIDENCE" : c.sourceType;
  const source: NarrativeSourceUnit = { id: c.id, sourceType, semanticTheme: c.semanticTheme, primaryAxes: [...c.primaryAxes], contexts: [context],
    confidence: c.confidence >= .75 ? "HIGH" : "MEDIUM", directnessLevel: level, phrases,
    fusionType: c.fusionType, conditionSplit: structuredClone(c.conditionSplit), metadata: { mbtiType: i.mbti.mbtiType ?? undefined,
      problemAlreadyExplained: placement.antecedentCandidateIds.length > 0, selfPerceptionSupported: !!c.conditionSplit?.resolved } };
  if (c.sourceType === "GUIDANCE") {
    const g = [...i.guidance.guidanceCandidates, ...i.guidance.mergedGuidance].find(g => g.id === c.sourceId);
    if (!g || g.customerAdvice !== c.sourceText) return undefined;
    add("ACTION", g.customerAdvice, "GUIDANCE", "advice");
    // SHORT is reserved upstream; the manual retains the concrete, contextual advice.
    if (placement.guidanceRenderIntent === "SHORT_GUIDANCE" && g.diagnostics.action !== g.customerAdvice) {
      phrases.splice(0, phrases.length);
      add("ACTION", GUIDANCE_SHORT_TITLES[g.selectedStrategyIds[0]] ?? g.diagnostics.action, "GUIDANCE", "source-action");
    }
    if (placement.guidanceRenderIntent === "FULL_GUIDANCE") add("DIRECT_CLAIM", g.problemDescription, "SYNTHESIS", "problem");
    // The rationale is source data, not a new behavior diagnosis.
    add("MYEONGLI_REASON", g.whyThisFits, "GUIDANCE", "why");
    return { candidate: c, placement, source, intent, provenance: [...placement.provenanceEvidenceIds], diagnostics };
  }

  const fusion = c.sourceType === "FUSION" ? [...i.fusion.reinforce, ...i.fusion.tensions, ...i.fusion.complements].find(f => f.id === c.sourceId) : undefined;
  const atoms = i.myeongli.evidence.filter(e => c.myeongliEvidenceIds.includes(e.id));
  const fortuneMatch = (e: EvidenceAtom) => c.fortuneFamilies.some(f => f === "PEOPLE_LUCK" ? !!e.fortuneTags?.HELPER_LUCK
    : f === "CHARM_INTIMACY" ? !!e.fortuneTags?.INTIMATE_CHARM
    : f === "CHARM_VISIBILITY" ? !!(e.fortuneTags?.FIRST_IMPRESSION || e.fortuneTags?.SOCIAL_VISIBILITY)
    : f === "HONOR_POSITION" ? !!(e.fortuneTags?.POSITION || e.fortuneTags?.RECOGNITION || e.fortuneTags?.VISIBLE_AUTHORITY)
    : f === "MONEY_FORTUNE" ? !!e.fortuneTags?.ACCUMULATION : false);
  const exposed = atoms.filter(e => [...placement.primaryEvidenceIds, ...placement.supportEvidenceIds].includes(e.id));
  const relevant = (e: EvidenceAtom) => !c.primaryAxes.length || c.primaryAxes.some(a => e.axes[a]) || c.fortune && (e.kind === "FORTUNE" || !!e.fortuneTags);
  const proof = exposed.filter(relevant).sort((a, b) => Number(b.tier === "CORE") - Number(a.tier === "CORE") || b.weight - a.weight);
  const humanCopy = c.fusionType === "REINFORCE" ? c.sourceText
    .replace(/성향을 두 체계가 같은 방향으로 말합니다\.$/, "성향이 있습니다.")
    .replace(/쪽을 두 체계가 같은 방향으로 말합니다\.$/, "쪽입니다.") : c.sourceText;
  const textRole = c.fortune ? "GOOD_RESULT" : "DIRECT_CLAIM";
  add(textRole, humanCopy, c.sourceType === "MYEONGLI_PATTERN" ? "MYEONGLI" : "SYNTHESIS", "human");

  const visibleMbti = fusion && placement.presentationIntent === "EXPLICIT" ? humanMbtiReason(i, fusion, sectionId, memory) : undefined;
  if (fusion && placement.presentationIntent === "EXPLICIT" && !visibleMbti) {
    intent = "HUMAN"; source.fusionType = undefined;
    diagnostics.push("MBTI_VISIBLE_DOMAIN_SUPPRESSED");
  }
  if (fusion && placement.presentationIntent === "EXPLICIT" && visibleMbti) {
    // Actual annotated source only. No dimension-prior or notable-pair reference substitutes.
    const side = fusion.conditionSplit?.sides;
    const mySide = fusion.myeongli.side;
    const reasonAtom = atoms.filter(e=>(e.axes[mySide.axis]??0)*mySide.direction>0)
      .sort((a,b)=>Number(!!atomLabel(b) && !memory.usedTermDefinitions.includes(`${b.sourceType}:${b.sourceKey}`))-Number(!!atomLabel(a) && !memory.usedTermDefinitions.includes(`${a.sourceType}:${a.sourceKey}`))
        || Math.abs(b.axes[mySide.axis]??0)*b.weight-Math.abs(a.axes[mySide.axis]??0)*a.weight)[0];
    const myReason = reasonAtom?.humanDescription ?? humanOutcome(mySide.axis,mySide.direction);
    const label = reasonAtom && atomLabel(reasonAtom), key = reasonAtom && `${reasonAtom.sourceType}:${reasonAtom.sourceKey}`;
    if(reasonAtom && label && key && !memory.usedTermDefinitions.includes(key)) {
      const term={key,displayName:label,easyDefinition:easyCustomerDefinition(reasonAtom),exposurePriority:1,sourceEvidenceIds:[reasonAtom.id]};
      source.evidenceTerms=[...(source.evidenceTerms??[]),term];
      const definition=termDefinitionPhrase(term,source);if(definition)phrases.push(definition);
    } else add("MYEONGLI_REASON", myReason, "MYEONGLI", "fusion-my", reasonAtom?{refs:{...refs,evidenceIds:[reasonAtom.id]}}:{});
    diagnostics.push(`MBTI_VISIBLE_SOURCE:${visibleMbti.nodeId}:${visibleMbti.family}`);
    add("MBTI_REASON", visibleMbti.text, "MBTI_ACTUAL", "fusion-mbti", { refs: { ...refs, mbtiSourceNodeIds: [visibleMbti.nodeId] } });
    if (fusion.type === "TENSION") {
      // Rationale is an internal rule identifier, not customer prose. The already
      // resolved sides supply the condition; the source below supplies the conclusion.
      add("CONTRAST", side ? `‘${side.myeongli}’와 ‘${side.mbti}’를 나눠 보면 두 모습이 함께 이해돼요.` : undefined,
        "SYNTHESIS", "split", { splitType: fusion.conditionSplit?.type });
      // The human conclusion is the upstream third interpretation, not a fresh paraphrase.
      const human = phrases.find(p => p.role === "DIRECT_CLAIM")!;
      human.text = sentence(atoms.find(e => e.positiveMeaning && relevant(e))?.positiveMeaning ?? myReason ?? c.sourceText); human.origin = "MYEONGLI";
      add("CLOSER", c.sourceText, "SYNTHESIS", "third", { thirdInterpretation: true });
    } else {
      const human = phrases.find(p => p.role === "DIRECT_CLAIM")!;
      if (fusion.type === "COMPLEMENT") { human.text = sentence(atoms.find(e => e.positiveMeaning && relevant(e))?.positiveMeaning ?? myReason ?? c.sourceText); human.origin = "MYEONGLI"; }
      else human.text = sentence(atoms.find(e => e.positiveMeaning && relevant(e))?.positiveMeaning ?? humanCopy);
      add("FUSION", humanCopy, "SYNTHESIS", "fusion", { thirdInterpretation: fusion.type === "COMPLEMENT" });
      // A source-backed hook supports R-B without inventing an extra personality judgment.
      add("HOOK", human.text, "SYNTHESIS", "hook");
      if (fusion.type === "REINFORCE") add("CLOSER", humanCopy, "SYNTHESIS", "close");
    }
  } else {
    if (c.factBomb && c.sourceType !== "CLAIM" && c.sourceType !== "TRAIT_ARC") intent = "HUMAN";
    for (const e of proof) {
      const key = `${e.sourceType}:${e.sourceKey}`;
      const owner = plan.terminologyOwnership.find(t => t.termKey === key && t.definitionOwner === sectionId);
      const label = atomLabel(e);
      if (owner && label && !memory.usedTermDefinitions.includes(key) && !source.evidenceTerms?.some(t => t.key === key)) {
        const term = { key, displayName: label, easyDefinition: easyCustomerDefinition(e), exposurePriority: 1, sourceEvidenceIds: [e.id] };
        source.evidenceTerms = [...(source.evidenceTerms ?? []), term];
        const definition = termDefinitionPhrase(term, source);
        if (definition) phrases.push(definition);
      } else if (e.humanDescription && e.humanDescription !== c.sourceText) {
        add("MYEONGLI_REASON", e.humanDescription, "MYEONGLI", `reason:${e.id}`, { refs: { ...refs, evidenceIds: [e.id] } });
      }
      if (c.fortune && fortuneMatch(e)) {
        const imageKey = e.sourceType === "heavenly_stem" ? `stem:${e.sourceKey}` : `shinsal:${e.sourceKey}`;
        if (NARRATIVE_IMAGES[imageKey] && !memory.usedImages.includes(imageKey)) add("IMAGE", `${NARRATIVE_IMAGES[imageKey].image}에 비유할 수 있어요.`, "MYEONGLI", `image:${e.id}`, { imageKey, refs: { ...refs, evidenceIds: [e.id] } });
      }
    }
    const resonance = i.resonance.candidates.find(r => r.id === c.sourceId);
    if (!c.factBomb && resonance?.positiveMeaning) add("CLOSER", resonance.positiveMeaning, "SYNTHESIS", "positive");
    // Result recall reads the selected source's own positive face, never another ranked candidate.
    if (!c.factBomb && !phrases.some(p => p.role === "CLOSER")) {
      const positiveAtoms = c.fortune && atoms.some(fortuneMatch) ? atoms.filter(fortuneMatch) : atoms.filter(relevant);
      for (const e of positiveAtoms.filter(e => e.positiveMeaning && e.positiveMeaning !== c.sourceText)) add("CLOSER", e.positiveMeaning, "MYEONGLI", `positive:${e.id}`, { refs: { ...refs, evidenceIds: [e.id] } });
    }
    if (c.fortune && !proof.some(fortuneMatch)) diagnostics.push("FORTUNE_TERM_EXPOSURE_RESERVED_UPSTREAM");
  }
  const sceneMatch = chooseNarrativeScene(NARRATIVE_SCENES, c, sectionId, context, section.context, selectedProofAxes(c, i), scenes, reportStableKey);
  const scene = sceneMatch ? { sceneId: sceneMatch.scene.id, family: sceneMatch.scene.family, theme: c.semanticTheme, candidateId: c.id, sectionId, score: sceneMatch.score } : undefined;
  if (sceneMatch) add("LIFE_SCENE", sceneMatch.scene.sourceText, "SCENE", sceneMatch.scene.id);
  // A previously explained root may be recalled in its allocated new domain.
  // This is explicit scoped recall, not a second definition or a new personality claim.
  const scope = { identity: "일상에서는", work: "일할 때는", money: "돈을 생각할 때는", social: "사람들과 지낼 때는", love: "가까운 관계에서는", learning: "배울 때는", stress: "압박이 생길 때는", recovery: "쉬는 시간에는" }[context];
  for (const p of [...phrases]) {
    if (["CLOSER", "MYEONGLI_REASON"].includes(p.role) && !p.termDefinitionKey && p.origin === "MYEONGLI"
      && Object.keys(memory.usedPhrases).some(t => t.replace(/(?:습니다|있어요|있죠|있습니다|이에요|입니다|이죠|해요|하죠|합니다)[.]$/, "") === p.text.replace(/(?:습니다|있어요|있죠|있습니다|이에요|입니다|이죠|해요|하죠|합니다)[.]$/, ""))) {
      phrases.push({ ...p, id: `${p.id}:context-recall`, text: `${scope} ${p.text}` });
      diagnostics.push("ALLOCATED_CONTEXT_RESULT_RECALL");
    }
    if (p.role === "DIRECT_CLAIM" && placement.reuseIntent === "DIFFERENT_APPLICATION") phrases.push({ ...p, id: `${p.id}:context-recall`, text: `${scope} ${p.text}` });
  }
  if (placement.presentationIntent === "HIDDEN") source.phrases = phrases.filter(p => p.role !== "MBTI_REASON" && !hasExplicitMbti(p.text) && !hasFusionComparison(p.text));
  if (source.phrases.length < 2) diagnostics.push("LIMITED_SELECTED_SOURCE_NO_PADDING");
  return polishComprehensiveSource({ candidate: c, placement, source, intent, scene, provenance: [...placement.provenanceEvidenceIds], diagnostics }, i, sectionId);
}
