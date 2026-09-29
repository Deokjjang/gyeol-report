import { getMbtiProductTraits, type MbtiReportUseCaseKey, type MbtiTraitArea } from "../report-knowledge/mbti/sourceRuntimeAdapter";
import { ATOMIC_BY_ID } from "./atomicRegistry";
import type { ComprehensiveV3Draft, ComprehensiveV3Block } from "./comprehensive";
import type { CareerV3Draft } from "./careerEditorial";
import type { LoveV3Draft } from "./loveEditorial";
import type { CompatibilityV3Draft } from "./compatibilityEditorial";
import type { EditorialScene } from "./editorialComposer";
import type { Domain, Evidence, Product } from "./types";
import { NARRATIVE_EDITION, DETAIL_NARRATIVE_EDITION } from "./narrativeEdition";
import { validateStoryCopy } from "./comprehensiveStorytelling";

const productLibrary: Record<Product, MbtiReportUseCaseKey> = {
  saju_mbti_full: "generalReport", career_money_study: "careerReport", love_marriage_child: "loveMarriageChildReport",
  saju_mbti_compatibility: "compatibilityReport", major_fortune: "daeunReport", annual_fortune: "saeunReport",
};
const domainAreas: Record<Domain, readonly MbtiTraitArea[]> = {
  identity: ["identity", "thinkingStyle", "strengths"], career: ["career", "workplace"], business: ["workplace", "career", "money"],
  money: ["money", "investment"], relationship: ["relationships", "communication"], love: ["love", "marriage"],
  study: ["study", "thinkingStyle"], leadership: ["workplace", "career", "strengths"], lifestyle: ["growth", "thinkingStyle"],
};
export type TraitRequest = {
  product: Product; domain: Domain; section: string; mbti: string;
  selectedSignals: readonly Evidence[]; context?: { lifeStatus?: string; relationshipStatus?: string; category?: string };
  used?: ReadonlySet<string>;
};
export type NarrativeTrait = {
  id: string; evidenceId: string; sourceRefs: readonly string[]; area: MbtiTraitArea;
  text: string; kind: "strength" | "tension" | "amplification"; matchedEvidence: readonly string[];
};

/** Routing tags never establish a natal fact. Only selected, confirmed evidence
 * can amplify a trait; a type by itself describes behavior, not good fortune. */
export function selectNarrativeTraits(request: TraitRequest): readonly NarrativeTrait[] {
  const signals = request.selectedSignals.filter(f => f.certainty === "confirmed" && f.kind !== "mbti");
  const labels = (f: Evidence) => {
    const name = ATOMIC_BY_ID.get(f.featureId)?.name ?? "";
    return [name, name.replace(/살$|귀인$/u, ""), ...(/정관|편관/.test(name) ? ["관성"] : /정재|편재/.test(name) ? ["재성"] : /식신|상관/.test(name) ? ["식상"] : /정인|편인/.test(name) ? ["인성"] : [])].filter(Boolean);
  };
  let areas = domainAreas[request.domain];
  if (request.context?.lifeStatus === "student" && request.domain === "career") areas = ["study", "thinkingStyle"];
  if (request.product === "love_marriage_child" && /parent|child/.test(request.section)) areas = ["parenting"];
  if (request.product === "love_marriage_child" && /marriage|home/.test(request.section)) areas = ["marriage"];
  if (request.product === "saju_mbti_compatibility") {
    const category = request.context?.category;
    areas = category === "love" || category === "marriage" ? ["love", "communication", "relationships"]
      : category === "businessPartner" || category === "managerReport" || category === "coworker" ? ["workplace", "communication", "thinkingStyle"] : ["relationships", "communication"];
  }
  return getMbtiProductTraits(request.mbti, productLibrary[request.product]).flatMap(({ area, trait, evidenceId }) => {
    if (!areas.includes(area) || !trait.id || !trait.strongLine || request.used?.has(evidenceId) || validateStoryCopy(trait.strongLine).length) return [];
    // Source-only analytical notation and extreme claims are not customer copy.
    if (/입력값|알고리즘|엔진|무자비|찢고|독재|반드시|무조건|\b(?:Te|Ti|Fe|Fi|Ne|Ni|Se|Si)\b/.test(trait.strongLine)) return [];
    const matched = signals.filter(f => trait.matchingMyeongliSignals?.some(tag => labels(f).includes(tag)));
    const kind: NarrativeTrait["kind"] = area === "risks" || /갈등|과신|불안|압박/.test(trait.label ?? "") ? "tension" : matched.length ? "amplification" : "strength";
    return [{ id: trait.id, evidenceId, sourceRefs: [`docs/product/mbti/source/${request.mbti}.json:traits:${area}:${trait.id}`], area,
      text: trait.strongLine, kind, matchedEvidence: matched.map(f => f.id), priority: matched.length * 4 + (areas.length - areas.indexOf(area)) }];
  }).sort((a, b) => b.priority - a.priority || a.id.localeCompare(b.id));
}

const ending = (s: string) => /니다[.!]?[”’]?$/u.test(s.trim()) ? "formal"
  : /(?:해요|돼요|있어요|없어요|이에요|예요|거예요|가요|봐요|나요)[.!?]?[”’]?$/u.test(s.trim()) ? "conversational"
    : /죠[.!?]?[”’]?$/u.test(s.trim()) ? "recognition" : "other";
const sentences = (s: string) => s.match(/[^.!?]+[.!?]+[”’]?|[^.!?]+$/gu) ?? [];
export function endingWarnings(paragraphs: readonly string[]): readonly string[] {
  const warnings: string[] = []; let previous = "", run = 0;
  paragraphs.flatMap(sentences).forEach((s, index) => {
    const current = ending(s); run = current !== "other" && current === previous ? run + 1 : 1; previous = current;
    if (run >= 3) warnings.push(`ENDING_RUN:${index - 2}:${current}`);
  });
  return warnings;
}
function softer(sentence: string): string {
  return sentence.replace(/있습니다(?=[.!])/gu, "있어요").replace(/없습니다(?=[.!])/gu, "없어요")
    .replace(/보입니다(?=[.!])/gu, "보여요").replace(/모입니다(?=[.!])/gu, "모여요").replace(/쓰입니다(?=[.!])/gu, "쓰여요")
    .replace(/움직입니다(?=[.!])/gu, "움직여요").replace(/쌓입니다(?=[.!])/gu, "쌓여요")
    .replace(/집니다(?=[.!])/gu, "져요").replace(/납니다(?=[.!])/gu, "나요")
    .replace(/합니다(?=[.!])/gu, "해요").replace(/됩니다(?=[.!])/gu, "돼요")
    .replace(/봅니다(?=[.!])/gu, "봐요").replace(/갑니다(?=[.!])/gu, "가요")
    .replace(/(것|사람|편|힘|때|장면|모습|기준|결과|패|중심|시기|대목|시간|자리|문제|뜻|성격|리더|전략|이야기|과정)입니다(?=[.!])/gu,
      (_, noun: string) => `${noun}${(noun.charCodeAt(noun.length - 1) - 0xac00) % 28 ? "이에요" : "예요"}`);
}
/** Only smooth a run when a known conjugation is safe. No arbitrary alternation,
 * no invented hedge, and warnings remain visible to offline editorial QA. */
export function narrativeRhythm(paragraphs: readonly string[]): readonly string[] {
  let previous = "", run = 0;
  return paragraphs.map(p => sentences(p).map(s => {
    let current = ending(s); run = current !== "other" && current === previous ? run + 1 : 1;
    const result = current === "formal" && run >= 3 ? softer(s) : s;
    current = ending(result); if (current !== previous) run = 1; previous = current;
    return result;
  }).join(""));
}

type NarrativeDraft = ComprehensiveV3Draft | CareerV3Draft | LoveV3Draft | CompatibilityV3Draft;
export type NarrativeAudit = { section: string; subject: Evidence["subject"]; traitId: string; evidenceRefs: readonly string[]; sourceRefs: readonly string[]; kind: NarrativeTrait["kind"] };
export function integrateMbtiNarrative<T extends NarrativeDraft>(draft: T, facts: readonly Evidence[], context: TraitRequest["context"] = {}, detailEdition = false): T & { narrativeEdition: typeof NARRATIVE_EDITION | typeof DETAIL_NARRATIVE_EDITION; narrativeAudit: readonly NarrativeAudit[]; rhythmWarnings: readonly string[] } {
  const used = new Set<string>(), domains = new Set<string>(), audit: NarrativeAudit[] = [], copy: string[] = [];
  const names: Partial<Record<Evidence["subject"], string>> = draft.productType === "saju_mbti_compatibility"
    ? { personA: draft.people.personA.name, personB: draft.people.personB.name } : { person: draft.personLabel };
  const inject = (paragraphs: readonly string[], domain: Domain, section: string, subject: Evidence["subject"], refs: readonly string[], allow: boolean, preserveLast = false) => {
    const mbti = facts.find(f => f.subject === subject && f.kind === "mbti" && f.featureId.startsWith("mbti:"))?.featureId.split(":")[1] ?? "";
    const domainKey = `${subject}:${domain}:${/parent|marriage/.test(section) ? section : ""}`;
    const trait = allow && audit.length < 8 && !domains.has(domainKey) ? selectNarrativeTraits({ product: draft.productType, domain, section, mbti, used,
      selectedSignals: facts.filter(f => f.subject === subject && refs.includes(f.id)), context })[0] : undefined;
    const next = [...paragraphs];
    if (trait) {
      // Keep the library sentence intact; replace the type's grammatical subject
      // with the actual person, including directed two-person reports.
      const text = subject === "person" ? trait.text : trait.text.replaceAll(`${mbti}에게`, `${names[subject]}님에게`).replaceAll(`${mbti}는`, `${names[subject]}님은`).replaceAll(`${mbti}의`, `${names[subject]}님의`).replaceAll(`${mbti}가`, `${names[subject]}님이`);
      const existing = mbti ? next.findIndex(p => p.includes(mbti) && p.length < 240) : -1;
      if (existing >= 0) next[existing] = text; else next.push(text);
      used.add(trait.evidenceId); domains.add(domainKey);
      const fact = facts.find(f => f.subject === subject && f.featureId === trait.evidenceId);
      audit.push({ section, subject, traitId: trait.evidenceId, evidenceRefs: [...trait.matchedEvidence, ...(fact ? [fact.id] : [])], sourceRefs: trait.sourceRefs, kind: trait.kind });
    }
    // A deliberately written closing punch keeps its original cadence.
    const result = preserveLast && next.length ? [...narrativeRhythm(next.slice(0, -1)), next.at(-1)!] : narrativeRhythm(next);
    copy.push(...result); return result;
  };
  const block = (b: ComprehensiveV3Block, section: string): ComprehensiveV3Block => ({ ...b,
    ...(b.paragraphs ? { paragraphs: inject(b.paragraphs, b.domains[0] ?? "identity", section, "person", b.evidenceRefs, b.editorialForm !== "punchline" && b.editorialForm !== "tip") } : {}),
  });
  const scene = (s: EditorialScene): EditorialScene => {
    const character = s.parts.filter(p => p.role === "character").map(p => p.text);
    const final = /final|conclusion|ending|^direction$/.test(s.chapter);
    const paragraphs = inject(character, s.domain, s.chapter, s.subject, s.evidenceRefs, !final && s.form !== "punchline" && s.form !== "tip" && (draft.productType !== "saju_mbti_compatibility" || s.chapter === "directions"), final);
    let index = 0;
    const parts = s.parts.map(p => p.role === "character" ? { ...p, text: paragraphs[index++] } : p);
    parts.push(...paragraphs.slice(index).map(text => ({ role: "character" as const, text })));
    return { ...s, parts };
  };
  const enriched = draft.productType === "saju_mbti_full" ? { ...draft, opening: draft.opening.map(b => block(b, "opening")),
    sections: draft.sections.map(s => ({ ...s, blocks: s.blocks.map(b => block(b, s.id)) })), direction: narrativeRhythm(draft.direction.split("\n\n")).join("\n\n") }
    : { ...draft, chapters: draft.chapters.map(c => ({ ...c, scenes: c.scenes.map(scene) })) };
  return { ...enriched, narrativeEdition: detailEdition ? DETAIL_NARRATIVE_EDITION : NARRATIVE_EDITION, narrativeAudit: audit, rhythmWarnings: endingWarnings(copy) } as T & { narrativeEdition: typeof NARRATIVE_EDITION | typeof DETAIL_NARRATIVE_EDITION; narrativeAudit: readonly NarrativeAudit[]; rhythmWarnings: readonly string[] };
}
