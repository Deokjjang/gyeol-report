import type { NarrativeBlockDraft, NarrativeIssue, NarrativeMemory, NarrativeRequest, NarrativeValidationResult, SentenceRole } from "./narrativeCore";
import { NARRATIVE_PATTERNS } from "./narrativePatterns";
import { CONDITION_SPLIT_SURFACES, NARRATIVE_CONNECTORS } from "./narrativeConnectors";
import { NARRATIVE_IMAGES, termDefinitionText } from "./narrativeTerminology";
import { FORBIDDEN_ABSTRACT_PHRASES, TRACKED_NARRATIVE_WORDS } from "./narrativeVocabulary";
import { hasExplicitMbti, hasFusionComparison, permittedSurfaces, preservePhraseDirectness } from "./narrativeSurface";
import { memoryCount, narrativeSubject, narrativeWordCount, openingFamily } from "./narrativeMemory";
import { allowsEnding, detectEnding } from "./narrativeEndings";
import { normalizeNarrativeText, sentenceLength, sentenceLengthClass } from "./narrativeVariant";

const clamp = (n: number) => Math.max(0, Math.min(100, n));
const hedge = /가능성이 있습니다|일 수 있습니다|할 수 있습니다|여지가 있습니다|떠올릴 수 있습니다|로 보입니다/;
const harmful = /반드시 성공|무조건 부자|부자가 됩니다|고위직이 됩니다|승진합니다|결혼합니다|배우자를 만납니다|평생.*도와|사업이 성공합니다|우울증|ADHD|정신질환|불안장애|트라우마|질병|매수하세요|매도하세요|대출을 받으세요/;
const degrading = /이기적입니다|성격이 나쁩니다|공감 능력이 없습니다|게으릅니다|돈에 미쳤습니다|바람기가 있습니다|사람을 이용합니다|정신적으로 문제가 있습니다/;
const counseling = /괜찮아요|걱정하지 마세요|당신은 잘못된 게 아닙니다|있는 그대로 받아들이세요|운명의 강물|별빛처럼 피어/;
const equal = (a: readonly string[], b: readonly string[]) => JSON.stringify(a) === JSON.stringify(b);
export function humanDescriptiveness(text: string, sourceBackedHuman = false): number {
  const verbs = [...text.matchAll(/(?:생각|고칠|보(?:는|고|지)|봅|봐|움직|정하|정한|끝내|말하|말은|지키|싶|중요|알아차|해결|늦어|돌아|방전|몰아붙|노려|고집|사람복|챙|확인|버티|바꾸|좋아|유지|시작)/g)].length;
  const conditions = /때|뒤|전에는|지만|면서|(?:해|져|어)도|되면|생기면|대신|한번|커서/.test(text);
  const labelOnly = /^(?:분석적|책임감이 있|성장 지향적|관계 중심적|완벽주의적)(?:입니다|습니다)\.$/.test(text);
  return clamp(45 + Math.min(30, verbs * 8) + (conditions ? 12 : 0) + (sourceBackedHuman ? 12 : 0)
    + (/고집이 셉니다|사람복이 있습니다|노려볼 만한 패/.test(text) ? 30 : 0) - (labelOnly ? 35 : 0));
}
export function inspectNarrativeSource(request: NarrativeRequest): NarrativeIssue[] {
  const source = request.source; const issues: NarrativeIssue[] = [];
  const fail = (code: string, refs = [source.id]) => issues.push({ code, refs });
  if (!source.id || !source.semanticTheme || !source.contexts.includes(request.context) || !source.phrases.length) fail("INVALID_SOURCE");
  if (new Set(source.phrases.map(p => p.id)).size !== source.phrases.length) fail("DUPLICATE_SOURCE_PHRASE_ID");
  if (!Number.isInteger(source.directnessLevel) || source.directnessLevel < 0 || source.directnessLevel > 4
    || !Number.isInteger(request.explicitMbtiBudget) || request.explicitMbtiBudget < 0) fail("INVALID_BUDGET_OR_LEVEL");
  if (["REINFORCE", "TENSION", "COMPLEMENT"].includes(request.intent) && source.fusionType !== request.intent) fail("FUSION_TYPE_MISMATCH");
  if (["REINFORCE", "TENSION", "COMPLEMENT"].includes(request.intent)
    && (!source.phrases.some(p => p.origin === "MBTI_ACTUAL" && p.refs.mbtiSourceNodeIds.length)
      || !source.phrases.some(p => p.origin === "MYEONGLI" && p.refs.evidenceIds.length))) fail("FUSION_WITHOUT_ACTUAL_SIDES");
  if (request.intent === "TENSION" && (!source.conditionSplit?.resolved || !source.conditionSplit.type
    || !Object.hasOwn(CONDITION_SPLIT_SURFACES, source.conditionSplit.type)
    || !source.conditionSplit.sides?.myeongli || !source.conditionSplit.sides.mbti || source.conditionSplit.status === "UNRESOLVED"
    || !source.conditionSplit.myeongliEvidenceIds.length || !source.conditionSplit.mbtiSourceNodeIds.length)) fail("UNRESOLVED_TENSION");
  if (["TENSION", "COMPLEMENT"].includes(request.intent)
    && !source.phrases.some(p => p.thirdInterpretation && ["CLOSER", "FUSION"].includes(p.role) && p.origin === "SYNTHESIS")) fail("MISSING_THIRD_INTERPRETATION");
  for (const p of source.phrases) {
    if (!p.id || !p.text.trim() || !p.semanticTheme || !p.contexts.length || !Number.isInteger(p.directnessLevel)
      || p.directnessLevel < 0 || p.directnessLevel > source.directnessLevel) fail("INVALID_PHRASE", [p.id]);
    if (!Object.values(p.refs).some(refs => refs.length)) fail("MISSING_SOURCE_REFS", [p.id]);
    if (p.endingStyle && p.endingStyle !== detectEnding(p.text)
      && !(p.endingStyle === "SHORT_DA" && detectEnding(p.text) === "FORMAL_DA" && sentenceLength(p.text) <= 18)
      && !(p.endingStyle === "DIRECT" && preservePhraseDirectness(p))) fail("INVALID_SOURCE_ENDING", [p.id]);
    if (preservePhraseDirectness(p) && p.text.includes("?")) fail("DIRECT_CLAIM_AS_QUESTION", [p.id]);
    if (p.role === "ACTION" && (p.origin !== "GUIDANCE" || !p.refs.guidanceIds.length)) fail("ADVICE_WITHOUT_SOURCE", [p.id]);
    if (p.role === "LIFE_SCENE" && p.origin !== "SCENE") fail("SCENE_WITHOUT_SOURCE", [p.id]);
    if (p.role === "MBTI_REASON" && p.origin !== "MBTI_REFERENCE" && (p.origin !== "MBTI_ACTUAL" || !p.refs.mbtiSourceNodeIds.length)) fail("MBTI_WITHOUT_ACTUAL_SOURCE", [p.id]);
    if (p.role === "CONTRAST" && request.intent === "TENSION" && p.splitType !== source.conditionSplit?.type) fail("SPLIT_MISMATCH", [p.id]);
    if (p.thirdInterpretation && /주변에서 보는 모습과 본인이 느끼는 모습/.test(p.text) && !source.metadata?.selfPerceptionSupported) fail("UNSUPPORTED_SELF_PERCEPTION", [p.id]);
  }
  return issues;
}
export function validateNarrativeBlock(request: NarrativeRequest, block: NarrativeBlockDraft, memory: NarrativeMemory): NarrativeValidationResult {
  const hardViolations = inspectNarrativeSource(request); const warnings: NarrativeIssue[] = [];
  const hard = (code: string, refs: string[] = []) => hardViolations.push({ code, refs });
  const warn = (code: string, refs: string[] = []) => warnings.push({ code, refs });
  const source = request.source;
  if (block.semanticTheme !== source.semanticTheme || block.directness !== source.directnessLevel || !equal(block.sourceUnitIds, [source.id])) hard("BLOCK_SOURCE_CHANGED");
  const pattern = NARRATIVE_PATTERNS.find(p => p.id === block.patternId.split(":")[0]);
  if (!pattern || pattern.intent !== request.intent || !pattern.compatibleSourceTypes.includes(source.sourceType)
    || (pattern.compatibleFusionTypes && (!source.fusionType || !pattern.compatibleFusionTypes.includes(source.fusionType)))) hard("PATTERN_MISMATCH");
  const roles = block.sentences.map(s => s.role);
  const collapsed = roles.filter((r, i) => i === 0 || r !== roles[i - 1]);
  const subsequence = (order: readonly SentenceRole[]) => {
    let i = 0; return collapsed.every(role => { const found = order.indexOf(role, i); i = found + 1; return found >= 0; });
  };
  if (pattern && (!pattern.requiredRoles.every(r => roles.includes(r)) || !pattern.roleOrderVariants.some(subsequence))) hard("ROLE_FLOW");
  if (!block.sentences.length) hard("EMPTY_BLOCK");
  if (pattern && block.sentences.length > pattern.maxSentences) hard("BLOCK_TOO_LONG");
  if (pattern && block.sentences.length < pattern.minSentences) warn("SPARSE_SOURCE");
  if (request.intent === "FORTUNE" && roles[0] !== "GOOD_RESULT") hard("FORTUNE_NOT_FIRST");
  if (request.intent === "FACT_BOMB" && roles[0] !== "DIRECT_CLAIM") hard("FACT_BOMB_NOT_FIRST");
  if (request.intent === "GUIDANCE" && roles[0] === "ACTION" && !source.metadata?.problemAlreadyExplained && roles.length > 1) warn("ACTION_BEFORE_PROBLEM");
  if (["TENSION", "COMPLEMENT"].includes(request.intent) && !block.sentences.some(s => source.phrases.find(p => p.id === s.sourcePhraseId)?.thirdInterpretation)) hard("THIRD_INTERPRETATION_OMITTED");
  let explicit = memory.usedExplicitMbtiMentions, questions = memory.questions;
  let sectionQuestions = Object.hasOwn(memory.sectionCounters, request.sectionId) ? memory.sectionCounters[request.sectionId].questions : 0;
  const endings = [...memory.endingHistory], lengths = [...memory.sentenceLengthHistory], subjects = [...memory.recentSubjects];
  const definitions = new Set(memory.usedTermDefinitions), images = new Set(memory.usedImages), texts = new Set<string>();
  for (const s of block.sentences) {
    const p = source.phrases.find(p => p.id === s.sourcePhraseId);
    if (!p) { hard("UNSUPPORTED_SENTENCE", [s.id]); continue; }
    const connector = s.connectorId ? NARRATIVE_CONNECTORS.find(c => c.id === s.connectorId && c.prefix) : undefined;
    const surface = permittedSurfaces(request, p, s.sourceSentenceIndex).find(v => v.id === s.variantId);
    if (!surface || normalizeNarrativeText((connector?.prefix ?? "") + surface.text) !== s.text || (s.connectorId && !connector)) hard("UNSUPPORTED_SENTENCE", [s.id]);
    if (s.role !== p.role || !equal(s.sourceUnitIds, [source.id]) || s.directness !== p.directnessLevel) hard("SOURCE_CONTRACT_CHANGED", [s.id]);
    for (const field of ["evidenceIds", "claimIds", "fusionIds", "resonanceIds", "guidanceIds", "mbtiSourceNodeIds"] as const) {
      if (!equal(s[field], p.refs[field])) hard("PROVENANCE_CHANGED", [s.id]);
    }
    if (s.semanticTheme !== p.semanticTheme || p.semanticTheme !== source.semanticTheme
      || !p.contexts.includes(request.context) || (p.primaryAxes.length && !p.primaryAxes.some(a => source.primaryAxes.includes(a)))) hard("CONTEXT_INCOHERENT", [s.id]);
    if (p.origin === "MBTI_REFERENCE") hard("REFERENCE_ONLY_MBTI", [s.id]);
    if (harmful.test(s.text) || degrading.test(s.text)) hard("UNSAFE_ESCALATION", [s.id]);
    if (counseling.test(s.text)) hard("UNSUPPORTED_COUNSELING", [s.id]);
    if (preservePhraseDirectness(p) && hedge.test(s.text) && !hedge.test(p.text)) hard("DIRECT_CLAIM_WEAKENED", [s.id]);
    if (FORBIDDEN_ABSTRACT_PHRASES.some(word => s.text.includes(word))) hard("ABSTRACT_LANGUAGE", [s.id]);
    if (surface && s.endingStyle !== surface.ending) hard("ENDING_METADATA_MISMATCH", [s.id]);
    if (s.lengthClass !== sentenceLengthClass(s.text)) hard("LENGTH_METADATA_MISMATCH", [s.id]);
    if (!allowsEnding(endings, s.endingStyle)) hard("ENDING_REPEAT", [s.id]);
    else if (endings.at(-1) === s.endingStyle) warn("ENDING_PAIR", [s.id]);
    endings.push(s.endingStyle); lengths.push(s.lengthClass);
    if (lengths.slice(-4).length === 4 && lengths.slice(-4).every(c => c === "L")) warn("LONG_RHYTHM", [s.id]);
    if (sentenceLength(s.text) > 55) warn("LONG_SENTENCE", [s.id]);
    const mentioned = (source.evidenceTerms ?? []).filter(t => s.text.includes(t.displayName));
    if (mentioned.length > 1) warn("TERM_DENSITY", [s.id]);
    if (/[\u3400-\u9fff]/.test(s.text)) warn("HANJA_IN_BODY", [s.id]);
    if (/되어집|보여집|진행되어|의\s+\S+의\s+\S+의/.test(s.text)) warn("NOUN_PASSIVE_DENSITY", [s.id]);
    if (/[!…]|[\p{Extended_Pictographic}]/u.test(s.text)) warn("PUNCTUATION", [s.id]);
    if (/은은|는는|이가가|을을|를를/.test(s.text)) warn("DUPLICATE_PARTICLE", [s.id]);
    if (s.termDefinitionKey !== p.termDefinitionKey || s.imageKey !== p.imageKey) hard("EXPOSURE_METADATA_CHANGED", [s.id]);
    if (s.termDefinitionKey) {
      const term = source.evidenceTerms?.find(t => t.key === s.termDefinitionKey);
      if (!term || normalizeNarrativeText(termDefinitionText(term)) !== normalizeNarrativeText(p.text)
        || !term.sourceEvidenceIds.every(id => p.refs.evidenceIds.includes(id))) hard("UNSUPPORTED_TERM_DEFINITION", [s.id]);
      if (definitions.has(s.termDefinitionKey)) hard("TERM_REDEFINITION", [s.id]);
      definitions.add(s.termDefinitionKey);
    }
    if (s.imageKey) {
      if (!NARRATIVE_IMAGES[s.imageKey] || !p.text.includes(NARRATIVE_IMAGES[s.imageKey].image) || !p.refs.evidenceIds.length) hard("UNSUPPORTED_IMAGE", [s.id]);
      if (images.has(s.imageKey)) hard("IMAGE_REUSE", [s.id]); images.add(s.imageKey);
    }
    const mentions = hasExplicitMbti(s.text), comparison = hasFusionComparison(s.text);
    if (s.explicitMbtiMention !== mentions || s.explicitFusionPhrase !== comparison) hard("EXPLICIT_METADATA_MISMATCH", [s.id]);
    if (mentions || comparison) {
      explicit++;
      if (!p.refs.mbtiSourceNodeIds.length || !source.phrases.some(p => p.origin === "MBTI_ACTUAL" && p.refs.mbtiSourceNodeIds.length)) hard("MBTI_WITHOUT_ACTUAL_SOURCE", [s.id]);
      if (request.presentationIntent === "HIDDEN") hard("HIDDEN_EXPOSURE", [s.id]);
    }
    if (s.endingStyle === "QUESTION") { questions++; sectionQuestions++; }
    subjects.push(narrativeSubject(s.text));
    if (subjects.slice(-3).length === 3 && subjects.at(-1) !== "OMITTED" && subjects.slice(-3).every(v => v === subjects.at(-1))) warn("SUBJECT_REPEAT", [s.id]);
    if (texts.has(s.text)) hard("EXACT_SENTENCE_REPEAT", [s.id]); texts.add(s.text);
    if (memoryCount(memory.usedPhrases, s.text) >= (s.explicitFusionPhrase ? 2 : 1)) hard("PHRASE_BUDGET", [s.id]);
    if (connector && (memoryCount(memory.usedConnectors, connector.id) >= connector.maxUses || memory.recentConnectors.includes(connector.id))) hard("CONNECTOR_BUDGET", [s.id]);
  }
  if (explicit > request.explicitMbtiBudget) hard("EXPLICIT_MBTI_BUDGET");
  if (questions > 3 || sectionQuestions > 1) hard("QUESTION_BUDGET");
  const simpleCount = block.plainText.split("쉽게 말하면").length - 1;
  if (memoryCount(memory.usedPhrases, "쉽게 말하면") + simpleCount > 2) warn("SUMMARY_PHRASE_REPEAT");
  for (const word of TRACKED_NARRATIVE_WORDS) {
    const count = narrativeWordCount(block.plainText, word);
    if (count > (["결", "힘"].includes(word) ? 1 : 2)) warn("WORD_OVERUSE", [word]);
    const section = Object.hasOwn(memory.sectionCounters, request.sectionId) ? memory.sectionCounters[request.sectionId] : undefined;
    if (word === "힘" && (section?.words[word] ?? 0) + count > 2) warn("SECTION_WORD_OVERUSE", [word]);
  }
  if (memoryCount(memory.usedSemanticThemes, source.semanticTheme) > 0) warn("SEMANTIC_THEME_RECALL", [source.semanticTheme]);
  if (request.semanticThemeBudget !== undefined && memoryCount(memory.usedSemanticThemes, source.semanticTheme) >= request.semanticThemeBudget) hard("THEME_BUDGET");
  const patternBase = block.patternId.split(":")[0];
  const samePattern = memory.usedParagraphPatterns.at(-1)?.split(":")[0] === patternBase;
  if (samePattern && !(request.intent === "FACT_BOMB" && memory.usedParagraphPatterns.at(-2)?.split(":")[0] !== patternBase)) hard("PATTERN_REPEAT");
  if (request.intent === "REINFORCE" && memory.usedPatternFamilies.at(-1) === block.patternFamily) hard("REINFORCE_FAMILY_REPEAT");
  const opening = openingFamily(block.sentences[0]?.text ?? "");
  if (memory.recentOpenings.slice(-2).length === 2 && memory.recentOpenings.slice(-2).every(o => o === opening)) warn("OPENING_REPEAT");
  if (block.plainText !== block.sentences.map(s => s.text).join(" ") || !equal(block.sentenceRoles, roles)) hard("BLOCK_PROJECTION_MISMATCH");
  const countCodes = (codes: string[], issues = hardViolations) => issues.filter(v => codes.includes(v.code)).length;
  const human = block.sentences.filter(s => ["DIRECT_CLAIM", "GOOD_RESULT", "CONTRAST", "FUSION", "ACTION"].includes(s.role));
  const humanScore = human.length ? Math.round(human.reduce((sum, s) => sum + humanDescriptiveness(s.text, true), 0) / human.length) : 30;
  if (humanScore < 85) warn("GENERIC_DESCRIPTION");
  return { readability: clamp(100 - warnings.filter(w => ["LONG_SENTENCE", "TERM_DENSITY", "HANJA_IN_BODY", "NOUN_PASSIVE_DENSITY"].includes(w.code)).length * 4 - countCodes(["ABSTRACT_LANGUAGE"]) * 30),
    directness: clamp(100 - countCodes(["DIRECT_CLAIM_WEAKENED", "SOURCE_CONTRACT_CHANGED"]) * 50),
    humanDescriptiveness: humanScore,
    contextCoherence: clamp(100 - countCodes(["CONTEXT_INCOHERENT"]) * 50),
    evidenceGrounding: clamp(100 - countCodes(["UNSUPPORTED_SENTENCE", "MISSING_SOURCE_REFS", "PROVENANCE_CHANGED", "MBTI_WITHOUT_ACTUAL_SOURCE", "UNSUPPORTED_IMAGE", "UNSUPPORTED_TERM_DEFINITION"]) * 50),
    narrativeFlow: clamp(100 - countCodes(["PATTERN_MISMATCH", "ROLE_FLOW", "UNRESOLVED_TENSION", "MISSING_THIRD_INTERPRETATION", "THIRD_INTERPRETATION_OMITTED"]) * 50),
    repetitionPenalty: clamp([...hardViolations, ...warnings].filter(i => /REPEAT|OVERUSE|BUDGET|RECALL/.test(i.code)).length * 10), hardViolations, warnings };
}
