import { afterAll, describe, expect, it } from "vitest";
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { SENTENCE_ROLES, ENDING_STYLES, type NarrativeRequest } from "../../../src/lib/interpretation-v4/narrativeCore";
import { renderNarrativeBlock, NARRATIVE_PIPELINE_STEPS } from "../../../src/lib/interpretation-v4/narrativeBlockRenderer";
import { NARRATIVE_PATTERNS } from "../../../src/lib/interpretation-v4/narrativePatterns";
import { freshNarrativeMemory, parseNarrativeMemory, serializeNarrativeMemory } from "../../../src/lib/interpretation-v4/narrativeMemory";
import { validateNarrativeBlock, humanDescriptiveness } from "../../../src/lib/interpretation-v4/narrativeValidator";
import { narrativeSeed, sentenceLengthClass, stableVariants, normalizeNarrativeText } from "../../../src/lib/interpretation-v4/narrativeVariant";
import { narrativeSurfaces } from "../../../src/lib/interpretation-v4/narrativeEndings";
import { NARRATIVE_IMAGES, termDefinitionPhrase } from "../../../src/lib/interpretation-v4/narrativeTerminology";
import { EASY_KOREAN_DICTIONARY, FORBIDDEN_ABSTRACT_PHRASES, customerVocabulary, easyKoreanSuggestions, realizeEasyNounSlots } from "../../../src/lib/interpretation-v4/narrativeVocabulary";
import { CONNECTOR_INTENTS, NARRATIVE_CONNECTORS, SECTION_BRIDGE_REGISTRY, CONDITION_SPLIT_SURFACES, selectConnector } from "../../../src/lib/interpretation-v4/narrativeConnectors";
import { GUIDANCE_CONTEXT_VARIANTS } from "../../../src/lib/interpretation-v4/guidanceContextVariants";
import { FUSION_COMPLEMENT_RULES } from "../../../src/lib/interpretation-v4/fusionComplementRegistry";
import { GOLDEN_LANGUAGE_REQUESTS, claimUnit, claimText, humanUnit, phrase, reinforceUnit, request, tensionUnit, unit } from "./koreanNarrativeFixtures";

const codes = (r: ReturnType<typeof renderNarrativeBlock>) => r.block.validation.hardViolations.map(i => i.code);
const outputs: ReturnType<typeof renderNarrativeBlock>[] = [];
afterAll(() => {
  mkdirSync("/tmp/gyeol-13d5a-language", { recursive: true });
  writeFileSync("/tmp/gyeol-13d5a-language/golden.json", JSON.stringify(outputs, null, 2));
  writeFileSync("/tmp/gyeol-13d5a-language/golden.txt", outputs.map((r, i) => `${i + 1}. ${r.block.plainText}\n${JSON.stringify(r.block.validation)}`).join("\n\n"));
});
describe("13D-5A Korean language contracts", () => {
  it("retains exact 12 roles / 6 endings / 18 pipeline stages", () => {
    expect(SENTENCE_ROLES).toEqual(["HOOK", "DIRECT_CLAIM", "LIFE_SCENE", "IMAGE", "MYEONGLI_REASON", "MBTI_REASON", "FUSION", "CONTRAST", "GOOD_RESULT", "SHADOW", "ACTION", "CLOSER"]);
    expect(ENDING_STYLES).toHaveLength(6); expect(NARRATIVE_PIPELINE_STEPS).toHaveLength(18);
  });
  it("P01-P12 and all six R families exist; required roles are present in every order", () => {
    for (let i = 1; i <= 12; i++) expect(NARRATIVE_PATTERNS.some(p => p.id === `P${String(i).padStart(2, "0")}`)).toBe(true);
    expect(NARRATIVE_PATTERNS.filter(p => p.intent === "REINFORCE" && Number(p.id.slice(1)) <= 16).map(p => p.family)).toEqual(["R-A", "R-B", "R-C", "R-D", "R-E", "R-F"]);
    for (const p of NARRATIVE_PATTERNS) for (const order of p.roleOrderVariants) for (const role of p.requiredRoles) expect(order, p.id).toContain(role);
    for (const p of NARRATIVE_PATTERNS.filter(p => p.intent === "TENSION")) expect(p.requiredRoles).toContain("CONTRAST");
  });
  it.each(GOLDEN_LANGUAGE_REQUESTS.map((r, i) => [i + 1, r] as const))("golden %s keeps meaning, directness and readable human language", (_, input) => {
    const r = renderNarrativeBlock(input); outputs.push(r);
    expect(r.ok, JSON.stringify(r.block.validation)).toBe(true);
    expect(r.block.validation.readability).toBeGreaterThanOrEqual(90); expect(r.block.validation.directness).toBeGreaterThanOrEqual(80);
    expect(r.block.validation.humanDescriptiveness, r.block.plainText).toBeGreaterThanOrEqual(85);
    expect(r.block.validation.contextCoherence).toBeGreaterThanOrEqual(90); expect(r.block.validation.evidenceGrounding).toBeGreaterThanOrEqual(95);
    expect(r.block.validation.narrativeFlow).toBeGreaterThanOrEqual(80);
    expect(r.block.sentences.every(s => s.sourceUnitIds.length && s.evidenceIds.length)).toBe(true);
    expect(FORBIDDEN_ABSTRACT_PHRASES.some(w => r.block.plainText.includes(w))).toBe(false);
  });
  it("renders a real multi-role human paragraph, not just a label", () => {
    const r = renderNarrativeBlock(request()); expect(r.ok, JSON.stringify(r.block.validation)).toBe(true);
    expect(r.block.sentences.length).toBeGreaterThanOrEqual(2); expect(r.block.plainText).toContain("작은 차이");
  });
  it.each([2, 3] as const)("F01 level %s is not upgraded or weakened", level => {
    const r = renderNarrativeBlock(request(claimUnit("F01_STUBBORN", level, false), { intent: "FACT_BOMB" }));
    expect(r.ok).toBe(true);
    if (level === 3) expect(r.block.plainText).toBe("고집이 셉니다."); else expect(r.block.plainText).toContain("쉽게 바꾸지 않는 편");
  });
  it.each(["P01_PEOPLE_LUCK", "S08_MONEY_AND_HONOR", "S03_HIGH_POSITION", "M08_GOOD_WEALTH_PATTERN"])("preserves level4 %s exactly", id => {
    const r = renderNarrativeBlock(request(claimUnit(id, 4, true), { intent: "FORTUNE" })); expect(r.ok).toBe(true);
    expect(r.block.plainText).toBe(claimText(id, 4)); expect(r.block.sentenceRoles[0]).toBe("GOOD_RESULT");
  });
  it("F03 non-delay never gains a delay; qualified delay remains", () => {
    const nonDelay = renderNarrativeBlock(request(claimUnit("F03_PERFECTIONISM", 3, false), { intent: "FACT_BOMB" }));
    expect(nonDelay.ok).toBe(true); expect(nonDelay.block.plainText).not.toMatch(/늦|마감/);
    const qualified = renderNarrativeBlock(GOLDEN_LANGUAGE_REQUESTS[4]); expect(qualified.block.plainText).toContain("늦어지기도");
  });
  it("guidance preserves high-stakes precision and all original sentences", () => {
    const advice = GUIDANCE_CONTEXT_VARIANTS.find(v => v.id === "precision-safety")!.advice;
    const input = request(unit([phrase("ACTION", advice)], { sourceType: "GUIDANCE", metadata: { problemAlreadyExplained: true } }), { intent: "GUIDANCE" });
    const r = renderNarrativeBlock(input); expect(r.ok, JSON.stringify(r.block.validation)).toBe(true);
    expect(r.block.plainText).toBe(advice); expect(r.block.sentences).toHaveLength(2);
  });
  it("resolved tension keeps condition and third interpretation", () => {
    const r = renderNarrativeBlock(request(tensionUnit(), { intent: "TENSION", depthIntent: "DEEP" }));
    expect(r.ok, JSON.stringify(r.block.validation)).toBe(true); expect(r.block.sentenceRoles).toContain("CONTRAST");
    expect(r.block.plainText).toContain("결정하기 전에는"); expect(r.block.plainText).toContain("시간이 분명히 나뉘는");
  });
  it("unresolved tension cannot fabricate a third reading; factual support stays possible", () => {
    const s = tensionUnit(); s.conditionSplit = undefined;
    expect(codes(renderNarrativeBlock(request(s, { intent: "TENSION" })))).toContain("UNRESOLVED_TENSION");
    const support = renderNarrativeBlock(request(s)); expect(support.ok).toBe(true); expect(support.block.sentenceRoles).not.toContain("CONTRAST");
  });
  it("complement centers the actual third source meaning", () => {
    const third = FUSION_COMPLEMENT_RULES.find(r => r.id === "C001")!.sourceDescription;
    const s = unit([phrase("DIRECT_CLAIM", "작은 문제도 먼저 알아차리는 편입니다."), phrase("MYEONGLI_REASON", "작은 차이를 빨리 보는 편입니다."), phrase("MBTI_REASON", "상대의 마음을 중요하게 생각합니다."), phrase("FUSION", third, { thirdInterpretation: true })], { sourceType: "FUSION", fusionType: "COMPLEMENT" });
    const r = renderNarrativeBlock(request(s, { intent: "COMPLEMENT" })); expect(r.ok, JSON.stringify(r.block.validation)).toBe(true);
    expect(r.block.plainText).toContain("사람을 함부로 몰아붙이지 않는");
  });
  it("reinforce rotates family in the same report memory", () => {
    const a = renderNarrativeBlock(request(reinforceUnit(), { intent: "REINFORCE", presentationIntent: "EXPLICIT" }));
    expect(a.ok, JSON.stringify(a.block.validation)).toBe(true);
    const b = renderNarrativeBlock(request(reinforceUnit(), { intent: "REINFORCE", presentationIntent: "EXPLICIT", occurrenceIndex: 1 }), a.nextMemory);
    expect(b.ok, JSON.stringify(b.block.validation)).toBe(true); expect(b.block.patternFamily).not.toBe(a.block.patternFamily);
  });
  it.each(["P04", "P05", "P13", "P14", "P15", "P16"])("actually renders reinforce family %s", patternId => {
    const s = reinforceUnit(); s.phrases = [...s.phrases,
      phrase("LIFE_SCENE", "끝낸 글에서도 빠진 말을 먼저 찾는 편입니다."),
      phrase("IMAGE", `${NARRATIVE_IMAGES["shinsal:HYEONCHIM"].image}의 모습에 가깝습니다.`, { imageKey: "shinsal:HYEONCHIM" })];
    const r = renderNarrativeBlock(request(s, { intent: "REINFORCE", patternId, presentationIntent: "EXPLICIT" }));
    expect(r.ok, JSON.stringify(r.block.validation)).toBe(true); expect(r.block.patternId.startsWith(patternId)).toBe(true);
  });
  it("actual TraitArc retains the supported strength, shadow and optional action", () => {
    const s = unit([phrase("DIRECT_CLAIM", "작은 오류를 먼저 보는 편입니다."), phrase("GOOD_RESULT", "이 덕분에 고칠 곳을 빨리 찾습니다."),
      phrase("SHADOW", "끝낸 것도 다시 살피다 지칠 수 있습니다."), phrase("ACTION", "중요한 문제부터 고치는 편이 좋습니다.")], { sourceType: "TRAIT_ARC" });
    const r = renderNarrativeBlock(request(s, { intent: "TRAIT_ARC" })); expect(r.ok, JSON.stringify(r.block.validation)).toBe(true);
    expect(r.block.sentenceRoles).toContain("GOOD_RESULT"); expect(r.block.sentenceRoles).toContain("SHADOW");
  });
  it("does not infer MBTI from type names, or create a scene/advice", () => {
    const s = humanUnit(); s.metadata = { mbtiType: "ENTJ" };
    const r = renderNarrativeBlock(request(s)); expect(r.ok).toBe(true);
    expect(r.block.sentenceRoles).not.toContain("MBTI_REASON"); expect(r.block.sentenceRoles).not.toContain("LIFE_SCENE"); expect(r.block.sentenceRoles).not.toContain("ACTION");
  });
  it("reference-only MBTI is suppressed, not used as actual meaning", () => {
    const s = humanUnit(); s.phrases = [...s.phrases, phrase("MBTI_REASON", "ENTJ는 리더입니다.", { origin: "MBTI_REFERENCE" })];
    const r = renderNarrativeBlock(request(s, { presentationIntent: "EXPLICIT" })); expect(r.ok).toBe(true); expect(r.block.plainText).not.toContain("ENTJ");
  });
  it("explicit MBTI never exceeds budget, including two-system closers", () => {
    const input = request(reinforceUnit(), { intent: "REINFORCE", presentationIntent: "EXPLICIT", explicitMbtiBudget: 2 });
    const m = freshNarrativeMemory(); m.usedExplicitMbtiMentions = 2;
    const r = renderNarrativeBlock(input, m); expect(r.ok).toBe(true); expect(r.nextMemory.usedExplicitMbtiMentions).toBe(2);
  });
  it("pure transition, deterministic seed, source immutability and JSON debug", () => {
    const input = request(); const m = freshNarrativeMemory(); const before = JSON.stringify([input, m]);
    const a = renderNarrativeBlock(input, m), b = renderNarrativeBlock(input, m);
    expect(a).toEqual(b); expect(JSON.stringify([input, m])).toBe(before);
    expect(parseNarrativeMemory(serializeNarrativeMemory(a.nextMemory))).toEqual(a.nextMemory);
    expect(JSON.parse(JSON.stringify(a))).toEqual(a);
    expect(narrativeSeed(input, "DIRECT_CLAIM")).not.toBe(narrativeSeed({ ...input, engineVersion: "v2" }, "DIRECT_CLAIM"));
    expect(new Set(Array.from({ length: 20 }, (_, i) => stableVariants([1, 2, 3], String(i))[0])).size).toBe(3);
  });
  it("semantic theme memory counts paraphrases, not just literal sentences", () => {
    const a = renderNarrativeBlock(request()); const s = unit([phrase("DIRECT_CLAIM", "앞뒤가 맞는지 끝까지 확인하는 편입니다.")], { id: "second" });
    const b = renderNarrativeBlock(request(s), a.nextMemory); expect(b.ok).toBe(true);
    expect(b.nextMemory.usedSemanticThemes.PRECISION).toBe(2);
    expect(codes(renderNarrativeBlock(request(s, { semanticThemeBudget: 1 }), a.nextMemory))).toContain("THEME_BUDGET");
  });
  it("term is defined once; image is used once, and neither is invented", () => {
    const source = humanUnit(); const term = { key: "officer", displayName: "편관", easyDefinition: "압박 속에서도 맡은 책임을 챙기는 기운입니다.", exposurePriority: 1, sourceEvidenceIds: ["unit-proof"] };
    const def = termDefinitionPhrase(term, source)!; source.evidenceTerms = [term]; source.phrases = [source.phrases[0], def];
    const first = renderNarrativeBlock(request(source)); expect(first.ok, JSON.stringify(first.block.validation)).toBe(true); expect(first.nextMemory.usedTermDefinitions).toContain("officer");
    const again = renderNarrativeBlock(request(source, { occurrenceIndex: 1 }), first.nextMemory);
    expect(again.ok).toBe(true); expect(again.block.sentences.some(s => s.termDefinitionKey)).toBe(false);
    expect(Object.keys(NARRATIVE_IMAGES).filter(k => k.startsWith("stem:"))).toHaveLength(10);
    expect(Object.keys(NARRATIVE_IMAGES).filter(k => k.startsWith("shinsal:"))).toHaveLength(4);
    const fortune = claimUnit("S03_HIGH_POSITION", 4, true);
    fortune.phrases = [...fortune.phrases, phrase("IMAGE", `${NARRATIVE_IMAGES["shinsal:JANGSEONG"].image}의 모습에 가깝습니다.`, { imageKey: "shinsal:JANGSEONG" })];
    const f = renderNarrativeBlock(request(fortune, { intent: "FORTUNE", patternId: "P09" })); expect(f.ok).toBe(true);
    const used = freshNarrativeMemory(); used.usedImages = ["shinsal:JANGSEONG"];
    const g = renderNarrativeBlock(request(fortune, { intent: "FORTUNE" }), used); expect(g.ok).toBe(true); expect(g.block.sentenceRoles).not.toContain("IMAGE");
  });
  it("100+ suggestions, mandatory vocabulary, no blind substitution", () => {
    expect(Object.keys(EASY_KOREAN_DICTIONARY).length).toBeGreaterThanOrEqual(100);
    for (const w of ["발현", "양상", "상호작용", "경향성이 있습니다", "자원", "보상", "가시성", "재정적 성취"]) expect(EASY_KOREAN_DICTIONARY[w]?.length).toBeGreaterThan(0);
    expect(easyKoreanSuggestions("사회적 지위가 중요합니다.")[0].suggestions).toContain("높은 직책");
    expect(customerVocabulary("STATUS_DRIVE", "work")).toContain("승진"); expect(customerVocabulary("STATUS_DRIVE", "fortune")).toEqual(["명예"]);
    expect(customerVocabulary("RESOURCE_SENSE", "money")).toEqual(["돈", "수입", "재물"]);
    expect(customerVocabulary("HELPER_LUCK", "identity")).toContain("사람복"); expect(customerVocabulary("CHARISMA", "love")).toContain("매력");
    expect(customerVocabulary("EXPERTISE", "work")).toContain("전문성");
  });
  it("connector groups/bridges/split registry retained; repetitions skip exhausted choices", () => {
    expect(CONNECTOR_INTENTS).toHaveLength(5); expect(Object.keys(SECTION_BRIDGE_REGISTRY)).toHaveLength(9); expect(Object.keys(CONDITION_SPLIT_SURFACES)).toHaveLength(10);
    for (const [intent, min] of [["REASON", 5], ["ADD", 4], ["TURN", 4], ["SUMMARY", 5]] as const) expect(NARRATIVE_CONNECTORS.filter(c => c.intent === intent).length).toBeGreaterThanOrEqual(min);
    const m = freshNarrativeMemory(); m.usedConnectors.SUMMARY_PREFIX = 2; m.usedConnectors.SUMMARY_PLAIN = 1;
    expect(selectConnector("SUMMARY", m, "x")).toBeUndefined();
  });
  it("safe endings retain negation/modality and vowel-final Korean grammar", () => {
    expect(narrativeSurfaces(phrase("DIRECT_CLAIM", "실제로 해볼 수 있습니다.")).map(v => v.text)).toEqual(["실제로 해볼 수 있습니다.", "실제로 해볼 수 있어요.", "실제로 해볼 수 있죠."]);
    expect(narrativeSurfaces(phrase("CLOSER", "좋은 기회입니다.")).map(v => v.text)).toContain("좋은 기회예요.");
    expect(narrativeSurfaces(phrase("CLOSER", "좋은 기회입니다.")).map(v => v.text)).toContain("좋은 기회죠.");
    expect(normalizeNarrativeText("말을  고릅니다 ..\r\n다시 봅니다.")).toBe("말을 고릅니다. 다시 봅니다.");
    expect(narrativeSurfaces(phrase("CLOSER", "빠르게 움직입니다.")).map(v => v.text)).toEqual(["빠르게 움직입니다.", "빠르게 움직여요.", "빠르게 움직이죠."]);
    expect(narrativeSurfaces(phrase("CLOSER", "더 잘 보입니다.")).map(v => v.text)).toEqual(["더 잘 보입니다.", "더 잘 보여요.", "더 잘 보이죠."]);
  });
  it("easy noun realization is context/particle-aware, never arbitrary replace", () => {
    expect(realizeEasyNounSlots("사회적 지위가 중요합니다.", "work")).toBe("높은 직책이 중요합니다.");
    expect(realizeEasyNounSlots("재정적 성취를 원합니다.", "money")).toBe("돈을 원합니다.");
    expect(realizeEasyNounSlots("사회적 지위가 중요합니다.", "love")).toBe("사회적 지위가 중요합니다.");
    expect(realizeEasyNounSlots("의사결정권을 갖습니다.", "work")).toBe("의사결정권을 갖습니다.");
    const r = renderNarrativeBlock(request(unit([phrase("DIRECT_CLAIM", "재정적 성취가 중요하지만 의미도 생각합니다.")]), { context: "money" }));
    expect(r.ok).toBe(true); expect(r.block.plainText).toMatch(/^돈이 중요하지만/);
  });
  it("S/M/L is deterministic and never clips text", () => {
    expect(sentenceLengthClass("고집이 셉니다.")).toBe("S"); expect(sentenceLengthClass("가".repeat(19))).toBe("M"); expect(sentenceLengthClass("가".repeat(41))).toBe("L");
  });
  it("specific behavior scores higher than a generic label", () => {
    expect(humanDescriptiveness("남들이 충분히 잘됐다고 해도 고칠 부분부터 먼저 봅니다.", true)).toBeGreaterThanOrEqual(85);
    expect(humanDescriptiveness("분석적입니다.")).toBeLessThan(40);
  });
  it("invalid serialized memory rejected", () => {
    expect(parseNarrativeMemory("bad")).toBeUndefined(); expect(parseNarrativeMemory("{}" )).toBeUndefined();
    expect(parseNarrativeMemory(JSON.stringify({ ...freshNarrativeMemory(), usedPhrases: { x: -1 } }))).toBeUndefined();
  });
});

describe("narrative output is not accepted merely because it has source IDs", () => {
  function mutate(text: string, input: NarrativeRequest = request()) {
    const b = structuredClone(renderNarrativeBlock(input).block); b.sentences[0].text = text;
    b.plainText = b.sentences.map(s => s.text).join(" "); return validateNarrativeBlock(input, b, freshNarrativeMemory());
  }
  it.each(["그래서 투자에서도 실수가 적습니다.", "좋은 사업 파트너를 만납니다.", "고집이 셀 가능성이 있습니다.", "무조건 부자가 됩니다.", "불안장애가 있습니다.", "일단 내놓고 피드백을 받으세요."])("rejects changed meaning: %s", text => {
    expect(mutate(text).hardViolations.map(v => v.code)).toContain("UNSUPPORTED_SENTENCE");
  });
  it.each(FORBIDDEN_ABSTRACT_PHRASES)("abstract prohibition: %s", text => {
    expect(mutate(text).hardViolations.map(v => v.code)).toContain("ABSTRACT_LANGUAGE");
  });
  it("theme/context mismatch is not accepted through arbitrary refs", () => {
    const s = humanUnit(); s.phrases = s.phrases.map(p => p.role === "MYEONGLI_REASON" ? { ...p, semanticTheme: "LEADERSHIP", primaryAxes: ["LEADERSHIP"] } : p);
    const r = renderNarrativeBlock(request(s, { patternId: "P01" })); expect(codes(r)).toContain("CONTEXT_INCOHERENT"); expect(r.block.validation.contextCoherence).toBeLessThan(90);
  });
  it("provenance tampering fails", () => {
    const input = request(); const b = renderNarrativeBlock(input).block; b.sentences[0].evidenceIds = [];
    expect(validateNarrativeBlock(input, b, freshNarrativeMemory()).hardViolations.some(v => v.code === "PROVENANCE_CHANGED")).toBe(true);
  });
  it("three identical endings, question excess and word excess are visible", () => {
    const input = request(); const b = renderNarrativeBlock(input).block;
    b.sentences.forEach(s => { s.endingStyle = "FORMAL_DA"; });
    const m = freshNarrativeMemory(); m.endingHistory = ["FORMAL_DA", "FORMAL_DA"];
    expect(validateNarrativeBlock(input, b, m).hardViolations.some(v => v.code === "ENDING_REPEAT")).toBe(true);
    const q = request(unit([phrase("DIRECT_CLAIM", "고칠 곳부터 보이지 않나요?")]));
    const qm = freshNarrativeMemory(); qm.questions = 3;
    expect(renderNarrativeBlock(q, qm).ok).toBe(false);
    const w = mutate("힘이 있고 힘을 쓰고 힘도 있습니다. 결을 보고 결도 봅니다."); expect(w.warnings.some(v => v.code === "WORD_OVERUSE")).toBe(true);
  });
  it("3 repeated subjects/openings and long rhythm are diagnosed without deleting copy", () => {
    const s = unit([phrase("DIRECT_CLAIM", "당신은 충분히 확인하고 생각한 뒤에야 중요한 문제를 놓고 어떤 쪽으로 움직여야 하는지 결정하려 하는 사람입니다."),
      phrase("MYEONGLI_REASON", "당신은 작은 차이를 가볍게 넘기지 않고 한번 더 확인하고 생각해 어떤 것이 실제로 중요한지 끝까지 살피는 편입니다."),
      phrase("CLOSER", "당신은 생각이 길어져도 쉽게 내려놓지 않고 왜 그런 일이 생겼는지 다시 확인하며 깊게 생각하는 편입니다.")]);
    const input = request(s, { patternId: "P01" }); const r = renderNarrativeBlock(input);
    const m = freshNarrativeMemory(); m.sentenceLengthHistory = ["L"]; m.recentOpenings = ["PERSON_LABEL", "PERSON_LABEL"];
    const v = validateNarrativeBlock(input, r.block, m);
    expect(v.warnings.map(w => w.code)).toEqual(expect.arrayContaining(["SUBJECT_REPEAT", "OPENING_REPEAT", "LONG_RHYTHM"]));
  });
  it("term redefinition, direct-level question and spoofed ending tags fail", () => {
    const source = humanUnit(); const term = { key: "officer", displayName: "편관", easyDefinition: "맡은 책임을 챙기는 기운입니다.", exposurePriority: 1, sourceEvidenceIds: ["unit-proof"] };
    source.evidenceTerms = [term]; source.phrases = [source.phrases[0], termDefinitionPhrase(term, source)!];
    const input = request(source); const r = renderNarrativeBlock(input); const m = freshNarrativeMemory(); m.usedTermDefinitions = ["officer"];
    expect(validateNarrativeBlock(input, r.block, m).hardViolations.map(w => w.code)).toContain("TERM_REDEFINITION");
    const q = unit([phrase("GOOD_RESULT", "사람복이 있지 않을까요?", { directnessLevel: 4 })], { sourceType: "CLAIM", directnessLevel: 4 });
    expect(codes(renderNarrativeBlock(request(q, { intent: "FORTUNE" })))).toContain("DIRECT_CLAIM_AS_QUESTION");
    const fake = unit([phrase("DIRECT_CLAIM", "깊게 생각합니다.", { endingStyle: "SOFT_YO" })]);
    expect(codes(renderNarrativeBlock(request(fake)))).toContain("INVALID_SOURCE_ENDING");
  });
  it("Fusion cannot be supported by type-name/prior IDs alone", () => {
    const s = reinforceUnit(); s.phrases = s.phrases.map(p => p.role === "MBTI_REASON" ? { ...p, origin: "MBTI_REFERENCE" } : p);
    expect(codes(renderNarrativeBlock(request(s, { intent: "REINFORCE" })))).toContain("FUSION_WITHOUT_ACTUAL_SIDES");
  });
  it("required action, contrast and fortune role cannot be removed", () => {
    for (const input of [request(tensionUnit(), { intent: "TENSION" }), GOLDEN_LANGUAGE_REQUESTS[9], GOLDEN_LANGUAGE_REQUESTS[11]]) {
      const b = renderNarrativeBlock(input).block;
      b.sentences = b.sentences.filter(s => !["CONTRAST", "GOOD_RESULT", "ACTION"].includes(s.role));
      expect(validateNarrativeBlock(input, b, freshNarrativeMemory()).hardViolations.some(v => v.code === "ROLE_FLOW")).toBe(true);
    }
  });
  it("no runtime/customer imports, dependencies, clocks, randomness, external services", () => {
    const names = ["narrativeCore", "narrativeVariant", "narrativePatterns", "narrativeVocabulary", "narrativeConnectors", "narrativeEndings", "narrativeTerminology", "narrativeMemory", "narrativeSurface", "narrativeValidator", "narrativeBlockRenderer"];
    function walk(dir: string): string[] { return readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(join(dir, e.name)) : /\.tsx?$/.test(e.name) ? [join(dir, e.name)] : []); }
    for (const file of walk("src")) {
      const text = readFileSync(file, "utf8");
      if (names.some(n => file === `src/lib/interpretation-v4/${n}.ts`)) expect(text).not.toMatch(/Math\.random|Date\.now|new Date|process\.env|fetch\(|calculateSaju\(|runtimeShadow|bookProjection|from ["'][^"']*(?:Composer|supabase|openai|toss|guidanceProfile|claimProfile|fusionSemanticProfile)/);
      else if (!["narrativeSceneCore", "narrativeTitleCore", "comprehensiveNarrativeAdapter", "comprehensiveManuscriptCore", "comprehensiveSectionRenderer", "comprehensiveBridgeRenderer", "comprehensiveManuscriptValidator", "comprehensiveManuscriptRenderer"].some(n => file === `src/lib/interpretation-v4/${n}.ts`)) for (const name of names) expect(text, file).not.toMatch(new RegExp(`["'][^"']*/${name}["']`));
    }
  });
});
