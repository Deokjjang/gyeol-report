import type { NarrativeBlockDraft, NarrativeMemory, NarrativePhrase, NarrativeRenderResult, NarrativeRequest, NarrativeSentenceDraft, SentenceRole } from "./narrativeCore";
import { orderedPatterns } from "./narrativePatterns";
import { inspectNarrativeSource, validateNarrativeBlock } from "./narrativeValidator";
import { advanceNarrativeMemory, freshNarrativeMemory, memoryCount } from "./narrativeMemory";
import { allowsEnding } from "./narrativeEndings";
import { narrativeSeed, normalizeNarrativeText, sentenceLengthClass, stableVariants } from "./narrativeVariant";
import { hasExplicitMbti, hasFusionComparison, permittedSurfaces, phraseFragments } from "./narrativeSurface";
import { selectConnector } from "./narrativeConnectors";

export const NARRATIVE_PIPELINE_STEPS = ["SOURCE_VALIDITY", "CLAIM_STRENGTH", "COMPATIBLE_PATTERN", "ROLE_SEQUENCE", "SOURCE_PHRASE",
  "CUSTOMER_VOCABULARY", "TERM_FIRST_DEFINITION", "CONNECTOR", "ENDING", "LENGTH_RHYTHM", "MEMORY_REPETITION",
  "ABSTRACT_LANGUAGE", "READABILITY", "DIRECTNESS", "HUMAN_DESCRIPTIVENESS", "CONTEXT_COHERENCE", "EVIDENCE_GROUNDING", "NEXT_MEMORY"] as const;

function availablePhrases(request: NarrativeRequest, memory: NarrativeMemory): NarrativePhrase[] {
  return request.source.phrases.filter(p => p.origin !== "MBTI_REFERENCE"
    && (!p.termDefinitionKey || !memory.usedTermDefinitions.includes(p.termDefinitionKey))
    && (!p.imageKey || !memory.usedImages.includes(p.imageKey))
    && (!(p.role === "CONTRAST" || p.thirdInterpretation) || request.source.fusionType !== "TENSION" || request.source.conditionSplit?.resolved)
    && (request.presentationIntent !== "HIDDEN" || !hasExplicitMbti(p.text)));
}
function selectSentences(request: NarrativeRequest, memory: NarrativeMemory, order: readonly SentenceRole[], phrases: readonly NarrativePhrase[]) {
  const result: NarrativeSentenceDraft[] = []; const endings = [...memory.endingHistory];
  let connectorApplied = false;
  let explicit = memory.usedExplicitMbtiMentions, questions = memory.questions;
  let sectionQuestions = Object.hasOwn(memory.sectionCounters, request.sectionId) ? memory.sectionCounters[request.sectionId].questions : 0;
  for (const role of order) {
    const options = stableVariants(phrases.filter(p => p.role === role), narrativeSeed(request, role));
    for (const phrase of options) {
      if (request.engineVersion === "comprehensive-manuscript-13d-5b-v1" && result.some(s =>
        normalizeNarrativeText(request.source.phrases.find(p => p.id === s.sourcePhraseId)?.text ?? "") === normalizeNarrativeText(phrase.text))) continue;
      const draft: NarrativeSentenceDraft[] = []; const localEndings = [...endings];
      let localExplicit = explicit, localQuestions = questions, localSectionQuestions = sectionQuestions;
      const fragments = phraseFragments(phrase);
      for (let part = 0; part < fragments.length; part++) {
        const connector = !connectorApplied && part === 0 && ["SHADOW", "CLOSER"].includes(role) && request.connectorIntent
          ? selectConnector(request.connectorIntent, memory, narrativeSeed(request, "CONNECTOR")) : undefined;
        const surfaces = stableVariants(permittedSurfaces(request, phrase, part), narrativeSeed(request, role, part));
        const surface = surfaces.find(v => {
          const text = normalizeNarrativeText((connector?.prefix ?? "") + v.text);
          const mentions = hasExplicitMbti(text) || hasFusionComparison(text);
          return allowsEnding(localEndings, v.ending)
            && (!mentions || (request.presentationIntent === "EXPLICIT" && localExplicit < request.explicitMbtiBudget))
            && (v.ending !== "QUESTION" || (localQuestions < 3 && localSectionQuestions < 1))
            && memoryCount(memory.usedPhrases, text) < (hasFusionComparison(text) ? 2 : 1)
            && ![...result, ...draft].some(s => s.text === text);
        });
        if (!surface) break;
        const text = normalizeNarrativeText((connector?.prefix ?? "") + surface.text);
        const explicitMbtiMention = hasExplicitMbti(text), explicitFusionPhrase = hasFusionComparison(text);
        draft.push({ id: `${request.source.id}:${role}:${phrase.id}:${part}`, role, text, sourcePhraseId: phrase.id, sourceSentenceIndex: part,
          sourceUnitIds: [request.source.id], evidenceIds: [...phrase.refs.evidenceIds], claimIds: [...phrase.refs.claimIds], fusionIds: [...phrase.refs.fusionIds],
          resonanceIds: [...phrase.refs.resonanceIds], guidanceIds: [...phrase.refs.guidanceIds], mbtiSourceNodeIds: [...phrase.refs.mbtiSourceNodeIds],
          semanticTheme: phrase.semanticTheme, directness: phrase.directnessLevel, endingStyle: surface.ending, lengthClass: sentenceLengthClass(text), variantId: surface.id,
          explicitMbtiMention, explicitFusionPhrase, ...(connector ? { connectorId: connector.id } : {}),
          ...(phrase.termDefinitionKey ? { termDefinitionKey: phrase.termDefinitionKey } : {}), ...(phrase.imageKey ? { imageKey: phrase.imageKey } : {}) });
        localEndings.push(surface.ending);
        if (explicitMbtiMention || explicitFusionPhrase) localExplicit++;
        if (surface.ending === "QUESTION") { localQuestions++; localSectionQuestions++; }
      }
      // Never keep half an advice or remove a source qualification to make validation pass.
      if (draft.length !== fragments.length) continue;
      result.push(...draft); endings.push(...draft.map(s => s.endingStyle));
      if (draft.some(s => s.connectorId)) connectorApplied = true;
      explicit = localExplicit; questions = localQuestions; sectionQuestions = localSectionQuestions;
      break;
    }
  }
  return result;
}
function draftBlock(request: NarrativeRequest, memory: NarrativeMemory, patternId: string, family: string, sentences: NarrativeSentenceDraft[]): NarrativeBlockDraft {
  const block: NarrativeBlockDraft = { id: `${request.sectionId}:${request.source.id}:${request.occurrenceIndex ?? 0}`,
    sourceUnitIds: [request.source.id], patternId, patternFamily: family, sentences, sentenceRoles: sentences.map(s => s.role),
    plainText: sentences.map(s => s.text).join(" "), semanticTheme: request.source.semanticTheme, directness: request.source.directnessLevel,
    terminologyUsed: [...new Set(sentences.flatMap(s => (request.source.evidenceTerms ?? []).filter(t => s.text.includes(t.displayName) || t.key === s.termDefinitionKey).map(t => t.key)))],
    connectorUsed: sentences.flatMap(s => s.connectorId ? [s.connectorId] : []), endingSequence: sentences.map(s => s.endingStyle), lengthSequence: sentences.map(s => s.lengthClass),
    validation: { readability: 0, directness: 0, humanDescriptiveness: 0, contextCoherence: 0, evidenceGrounding: 0, narrativeFlow: 0, repetitionPenalty: 0, hardViolations: [], warnings: [] } };
  block.validation = validateNarrativeBlock(request, block, memory); return block;
}
/** One block only. Pure, deterministic, bounded selection; no section/scene/title engine. */
export function renderNarrativeBlock(request: NarrativeRequest, memory: NarrativeMemory = freshNarrativeMemory()): NarrativeRenderResult {
  let block = draftBlock(request, memory, "UNAVAILABLE", "UNAVAILABLE", []);
  if (!inspectNarrativeSource(request).length) {
    const phrases = availablePhrases(request, memory);
    const patterns = orderedPatterns(request, phrases.map(p => p.role));
    candidates: for (const pattern of patterns) {
      if (request.intent === "REINFORCE" && pattern.family === memory.usedPatternFamilies.at(-1)) continue;
      const orders = stableVariants(pattern.roleOrderVariants.map((order, i) => ({ order, i })), narrativeSeed(request, "ORDER"));
      for (const { order, i } of orders) {
        const id = `${pattern.id}:${i}`;
        if (memory.usedParagraphPatterns.at(-1)?.split(":")[0] === pattern.id
          && (request.intent !== "FACT_BOMB" || memory.usedParagraphPatterns.at(-2)?.split(":")[0] === pattern.id)) continue;
        if (request.intent === "GUIDANCE" && order[0] === "ACTION" && !request.source.metadata?.problemAlreadyExplained
          && phrases.some(p => p.role === "DIRECT_CLAIM")) continue;
        const sentences = selectSentences(request, memory, order, phrases);
        const candidate = draftBlock(request, memory, id, pattern.family, sentences);
        if (candidate.validation.hardViolations.length < block.validation.hardViolations.length || block.patternId === "UNAVAILABLE") block = candidate;
        if (!candidate.validation.hardViolations.length) { block = candidate; break candidates; }
      }
    }
  }
  const ok = !block.validation.hardViolations.length;
  const nextMemory = ok ? advanceNarrativeMemory(memory, request, block) : structuredClone(memory);
  return { ok, block, nextMemory, debug: { steps: NARRATIVE_PIPELINE_STEPS, pattern: block.patternId, roles: block.sentenceRoles,
    sourceIds: [request.source.id, ...block.sentences.map(s => s.sourcePhraseId)], variants: block.sentences.map(s => s.variantId),
    terms: block.sentences.flatMap(s => s.termDefinitionKey ? [s.termDefinitionKey] : []), images: block.sentences.flatMap(s => s.imageKey ? [s.imageKey] : []),
    memoryBefore: structuredClone(memory), memoryAfter: structuredClone(nextMemory) } };
}
