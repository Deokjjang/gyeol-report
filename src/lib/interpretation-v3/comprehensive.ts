import type { ComprehensiveReportV2ProfileTable } from "../report-generation/comprehensiveReportDraftTypes";
import type { UserContextProfile } from "../report-knowledge/userContextTypes";
import { ATOMIC_BY_ID, ATOMIC_REGISTRY, REVIEWED_COPY } from "./atomicRegistry";
import { matchCompounds } from "./compounds";
import { claimStrength, rankEvidence, validateV3Copy } from "./engine";
import { fuseMbti } from "./fusion";
import { lifestyleSuggestions } from "./lifestyle";
import { comprehensiveContextDirections, RELATIONSHIP_DIRECTIONS } from "./comprehensiveContext";
import { COMPREHENSIVE_ATOMIC_COPY, OPENING_CONTEXT } from "./comprehensiveCopy";
import { correctKoreanParticleSlots } from "../report-knowledge/koreanCopyUtils";
import type { Domain, Evidence } from "./types";
import { composeComprehensiveV31, ENRICHED_COMPREHENSIVE_VERSION } from "./comprehensiveComposition";
import { composeComprehensiveV32, STORY_COMPREHENSIVE_VERSION, type WritingMode } from "./comprehensiveStorytelling";
import type { SajuCalcResult } from "../saju/types";
import { composeComprehensiveFinal, FINAL_COMPREHENSIVE_VERSION, type FinalArchetype, type RelatableExample } from "./comprehensiveExperience";
import { composeComprehensiveDepth, DEPTH_COMPREHENSIVE_VERSION } from "./comprehensiveDepth";
import type { EditorialForm, EditorialRole } from "./editorialComposer";

export const COMPREHENSIVE_V3_VERSION = "comprehensive_v3.1" as const;
export type ComprehensiveV3Block = {
  readonly id: string;
  readonly kind: "compound" | "atomic" | "fusion" | "context" | "lifestyle";
  readonly headline: string;
  readonly reading: string;
  readonly action: string;
  readonly why: string;
  readonly caution: string;
  readonly evidenceRefs: readonly string[];
  readonly sourceRefs: readonly string[];
  readonly labels: readonly string[];
  readonly domains: readonly Domain[];
  readonly format?: "prose" | "gift" | "strategy" | "relationship" | "balance";
  readonly paragraphs?: readonly string[];
  readonly ideas?: readonly string[];
  readonly compoundId?: string;
  readonly compoundIds?: readonly string[];
  readonly positiveFeatureIds?: readonly string[];
  readonly writingMode?: WritingMode;
  readonly discoveryKey?: string;
  readonly adviceKeys?: readonly string[];
  readonly prominence?: "hero" | "supporting";
  readonly relatable?: RelatableExample;
  readonly editorialForm?: EditorialForm;
  readonly editorialRoles?: readonly EditorialRole[];
};
export type ComprehensiveV3Section = { readonly id: string; readonly title: string; readonly blocks: readonly ComprehensiveV3Block[] };
export type ComprehensiveV3Draft = {
  readonly productType: "saju_mbti_full";
  readonly productVersion: "v3";
  readonly version: typeof COMPREHENSIVE_V3_VERSION | typeof ENRICHED_COMPREHENSIVE_VERSION | typeof STORY_COMPREHENSIVE_VERSION | typeof FINAL_COMPREHENSIVE_VERSION | typeof DEPTH_COMPREHENSIVE_VERSION;
  readonly personLabel: string;
  readonly title: string;
  readonly profileTable: ComprehensiveReportV2ProfileTable;
  readonly opening: readonly ComprehensiveV3Block[];
  readonly openingContext: string;
  readonly sections: readonly ComprehensiveV3Section[];
  readonly patterns: readonly { readonly strength?: string; readonly why?: string; readonly risk: string; readonly repair: string; readonly labels: readonly string[]; readonly evidenceRefs: readonly string[] }[];
  readonly direction: string;
  readonly directionEvidenceRefs: readonly string[];
  readonly directionArchetype?: FinalArchetype;
  readonly editorialAudit?: { readonly chars: Readonly<Record<EditorialRole, number>>; readonly mix: Readonly<Record<EditorialRole, number>>; readonly rejected: readonly string[]; readonly warnings: readonly string[]; readonly errors: readonly string[]; readonly mixWarnings: readonly EditorialRole[] };
};
export function isComprehensiveV3Draft(value: unknown): value is ComprehensiveV3Draft {
  if (!value || typeof value !== "object") return false;
  const v = value as Partial<ComprehensiveV3Draft>;
  return v.productType === "saju_mbti_full" && v.productVersion === "v3" && [COMPREHENSIVE_V3_VERSION, ENRICHED_COMPREHENSIVE_VERSION, STORY_COMPREHENSIVE_VERSION, FINAL_COMPREHENSIVE_VERSION, DEPTH_COMPREHENSIVE_VERSION].includes(v.version!) &&
    Array.isArray(v.opening) && Array.isArray(v.sections) && Array.isArray(v.patterns) && typeof v.direction === "string";
}
const unique = <T,>(values: readonly T[]) => [...new Set(values)];
const safe = (text: string) => !!text && !validateV3Copy(text).length && !/수 있|수는 없|가능성|보장|예언|참고|단정|기운이 없|원국에 없|evidence|공개 지식|결제 후|\bID\b|output|[a-z]+_[a-z]+/u.test(text);
const pick = (texts: readonly string[]) => texts.find(safe) ?? "";
function label(e: Evidence) {
  if (e.kind === "mbti") return e.featureId.split(":")[1];
  return ATOMIC_BY_ID.get(e.featureId)?.name ?? (e.value && typeof e.value === "object" && "label" in e.value ? String(e.value.label) : "원국 관계");
}
function block(input: Omit<ComprehensiveV3Block, "evidenceRefs" | "labels" | "sourceRefs">, facts: readonly Evidence[], sources: readonly string[]): ComprehensiveV3Block {
  return { ...input, headline: correctKoreanParticleSlots(input.headline), reading: correctKoreanParticleSlots(input.reading), action: correctKoreanParticleSlots(input.action), why: correctKoreanParticleSlots(input.why), evidenceRefs: unique(facts.map(e => e.id)), labels: unique(facts.map(label)), sourceRefs: unique([...sources, ...facts.flatMap(e => e.sourceRefs), ...facts.filter(e => COMPREHENSIVE_ATOMIC_COPY[e.featureId]).map(e => `comprehensiveCopy:${e.featureId}`)]) };
}
/** The whole material registry is eligible; weak/unsafe realizations remain in
 * the professional layer. No favorite-feature allowlist or invented detection. */
export function comprehensiveCandidates(facts: readonly Evidence[], enriched = false): readonly ComprehensiveV3Block[] {
  const ranked = rankEvidence(facts, "saju_mbti_full");
  const rank = new Map(ranked.map((e, i) => [e.id, i]));
  const candidates: ComprehensiveV3Block[] = [];
  for (const { rule, evidence } of matchCompounds(facts, "person")) {
    const domain = enriched ? rule.domains.find(d => evidence.some(e => e.domains.includes(d))) ?? rule.domains[0] : rule.domains[0];
    if (evidence.some(e => e.certainty !== "confirmed") || ["question", "suppressed"].includes(claimStrength(evidence, domain, rule.kind === "tension"))) continue;
    const atoms = evidence.map(e => ATOMIC_BY_ID.get(e.featureId)).filter(a => a !== undefined);
    candidates.push(block({ id: rule.id, kind: "compound", headline: rule.judgment,
      reading: atoms.map(a => a.feltQuestions[0]).filter(Boolean).slice(0, 1).join(" "), action: rule.directive,
      why: atoms.map(a => COMPREHENSIVE_ATOMIC_COPY[a.id]?.[0] ?? pick([a.coreMeaning])).filter(Boolean).slice(0, 2).join(" "), caution: safe(rule.caution) ? rule.caution : "",
      domains: rule.domains }, evidence, rule.sourceRefs));
  }
  for (const fusion of fuseMbti(facts, "person")) {
    const support = facts.filter(e => fusion.evidenceRefs.includes(e.id));
    const atom = support.find(e => REVIEWED_COPY[e.featureId]);
    if (!atom || support.some(e => e.certainty !== "confirmed") || !safe(fusion.directive)) continue;
    const copy = REVIEWED_COPY[atom.featureId];
    const scene = fusion.scene.replace(/장면입니다[.]?$/, "장면이 익숙한가요?");
    candidates.push(block({ id: fusion.id, kind: "fusion", headline: copy[0], reading: scene,
      action: fusion.directive, why: `명리의 ${label(atom)} 신호에 ${support.find(e => e.kind === "mbti")?.featureId.split(":")[1]}의 행동 습관을 함께 적용한 지침입니다.`,
      caution: pick([fusion.caution, copy[3]]), domains: unique(fusion.contexts.flatMap(d => d === "family" || d === "conflict" ? ["relationship" as const] : d === "marriage" ? ["love" as const] : ["identity", "career", "money", "study", "love"].includes(d) ? [d as Domain] : [])) }, support, fusion.sourceRefs));
  }
  for (const e of ranked) {
    if (e.kind === "mbti" || e.kind === "element") continue;
    const material = ATOMIC_BY_ID.get(e.featureId);
    if (!material || !material.directives.length) continue;
    const copy = REVIEWED_COPY[e.featureId];
    const headline = copy?.[0] ?? pick([material.coreMeaning]);
    const action = pick(material.directives);
    if (!headline || !action) continue;
    const strength = claimStrength([e], e.domains[0]);
    if (strength === "suppressed") continue;
    const scene = material.personalityExpression[0];
    candidates.push(block({ id: `atomic:${e.featureId}`, kind: "atomic", headline: strength === "question" ? copy?.[1] ?? `${material.name}의 다음 장면이 익숙한가요?` : /[.!?]$/.test(headline) ? headline : `${headline}입니다.`,
      reading: copy?.[1] ?? (scene && safe(scene) ? `${scene.replace(/[.]$/, "")}이 익숙한가요?` : ""),
      action, why: COMPREHENSIVE_ATOMIC_COPY[e.featureId]?.[0] ?? (copy ? pick([material.coreMeaning]) : pick(material.strength)),
      caution: COMPREHENSIVE_ATOMIC_COPY[e.featureId]?.[1] ?? pick(material.overuseRisk), domains: e.domains }, [e], material.sourceRefs));
  }
  const priority = (b: ComprehensiveV3Block) => Math.min(...b.evidenceRefs.map(id => rank.get(id) ?? facts.length)) +
    (b.kind === "compound" && !b.id.startsWith("pair:") ? -30 : b.kind === "fusion" ? -20 : b.kind === "compound" ? -10 : 0);
  const meanings = new Set<string>();
  return candidates.toSorted((a, b) => priority(a) - priority(b) || a.id.localeCompare(b.id)).filter(b => {
    const key = `${b.kind === "fusion" ? b.id : b.headline}|${b.action}`;
    if (meanings.has(key)) return false;
    meanings.add(key); return true;
  });
}

export type ComprehensiveV3Input = { name: string; facts: readonly Evidence[]; context: UserContextProfile; relationshipStatus: string; profileTable: ComprehensiveReportV2ProfileTable; calculation?: SajuCalcResult; robust?: boolean };
export function buildComprehensiveV3(input: ComprehensiveV3Input): ComprehensiveV3Draft {
  if (!input.facts.some(f => f.scope === "natal" && f.certainty === "confirmed")) return buildComprehensiveV3Legacy(input);
  return input.calculation ? composeComprehensiveDepth(input, comprehensiveCandidates(input.facts, true)) : buildComprehensiveV31(input);
}
/** Frozen v3.2-final.1 reconstruction for already-saved reports. */
export function buildComprehensiveFinal(input: ComprehensiveV3Input): ComprehensiveV3Draft {
  // Existing uncertain-time treatment is retained. No stronger new assertions
  // are made from conditional evidence just to fill the richer presentation.
  if (!input.facts.some(f => f.scope === "natal" && f.certainty === "confirmed")) return buildComprehensiveV3Legacy(input);
  return input.calculation ? composeComprehensiveFinal(input, comprehensiveCandidates(input.facts, true)) : buildComprehensiveV31(input);
}
export function buildComprehensiveV32(input: ComprehensiveV3Input): ComprehensiveV3Draft {
  return composeComprehensiveV32(input, comprehensiveCandidates(input.facts, true));
}
export function buildComprehensiveV31(input: ComprehensiveV3Input): ComprehensiveV3Draft {
  return composeComprehensiveV31(input, comprehensiveCandidates(input.facts, true));
}
/** Frozen Phase 2 composition for already-stored snapshots. */
export function buildComprehensiveV3Legacy(input: ComprehensiveV3Input): ComprehensiveV3Draft {
  const { facts, context } = input;
  const candidates = comprehensiveCandidates(facts);
  const used = new Set<string>(), sentences = new Set<string>();
  const take = (predicate: (b: ComprehensiveV3Block) => boolean, count: number) => candidates.filter(b => !used.has(b.id) && predicate(b)).slice(0, count).map(b => {
    used.add(b.id);
    // One owner for each sentence: opening, body or patterns, not all three.
    const fresh = (text: string) => text.split(/(?<=[.!?])\s+/u).filter(s => { if (sentences.has(s)) return false; sentences.add(s); return true; }).join(" ");
    return { ...b, headline: fresh(b.headline), reading: fresh(b.reading), why: fresh(b.why), action: fresh(b.action) };
  });
  let strongest = take(b => b.kind === "compound" && !b.domains.every(d => d === "money" || d === "business"), 1);
  if (!strongest.length) strongest = take(b => b.kind === "atomic" && b.domains.includes("identity"), 1);
  const gift = take(b => b.kind === "atomic" && b.evidenceRefs.some(id => facts.some(e => e.id === id && ["gwiin", "shinsal"].includes(e.kind))) && !!b.caution, 1);
  const fusion = take(b => b.kind === "fusion", 1);
  const opening = [...strongest, ...gift, ...fusion];
  if (!fusion.length) opening.push(...take(b => b.kind === "compound" || b.kind === "atomic", 1));
  const sections: ComprehensiveV3Section[] = [];
  const add = (id: string, title: string, predicate: (b: ComprehensiveV3Block) => boolean, count = 2) => {
    const blocks = take(predicate, count); if (blocks.length) sections.push({ id, title, blocks });
  };
  add("strength", "내가 가진 가장 강한 힘", b => b.evidenceRefs.some(id => facts.some(e => e.id === id && ["day_master", "day_pillar", "life_stage"].includes(e.kind))), 1);
  const strengthUse = take(b => b.domains.includes("identity") && b.kind === "compound", 1);
  const strengthSection = sections.find(s => s.id === "strength");
  if (strengthSection) sections[sections.indexOf(strengthSection)] = { ...strengthSection, blocks: [...strengthSection.blocks, ...strengthUse] };
  else if (strengthUse.length) sections.push({ id: "strength", title: "내가 가진 가장 강한 힘", blocks: strengthUse });
  add("gifts", "내가 가진 좋은 패", b => b.kind === "atomic" && b.evidenceRefs.some(id => facts.some(e => e.id === id && (e.kind === "gwiin" || ["sinsal_dohwa", "sinsal_hongyeom", "twelve_sinsal_banan"].includes(e.featureId)))));
  add("choices", "생각하고 선택하는 방식", b => b.kind === "fusion" || b.domains.includes("identity"), 1);
  const contextDirections = comprehensiveContextDirections(context);
  const contextBlock = (domain: Domain, action: string, basis: readonly ComprehensiveV3Block[]) => block({ id: `context:${domain}`, kind: "context", headline: "지금의 상황에 적용하기", reading: "", action, why: "", caution: "", domains: [domain] }, facts.filter(e => basis.flatMap(b => b.evidenceRefs).includes(e.id)), [`userContext:${context.lifeStatus}`, "userContext:detailJob", "comprehensiveContext:DIRECTIONS"]);
  for (const [domain, title, index] of [["career", "일의 결", 0], ["money", "돈의 결", 1], ["study", "배우고 성장하는 방식", 2]] as const) {
    const preferred = domain === "money" ? take(b => ["pair:pian_cai+zheng_cai", "mobile-opportunity"].includes(b.id), 1) : [];
    const compounds = preferred.length ? preferred : take(b => b.kind === "compound" && b.domains.includes(domain), 1);
    const blocks = [...compounds, ...take(b => b.kind !== "compound" && b.domains.includes(domain) && !compounds.some(c => c.evidenceRefs.some(id => b.evidenceRefs.includes(id))), 1)];
    if (blocks.length) sections.push({ id: domain, title, blocks: [...blocks, contextBlock(domain, contextDirections[index], blocks)] });
  }
  // Attraction is not lost behind the many ten-god pairs. Group both genuine
  // signals here when present; they never imply a guaranteed relationship.
  const attraction = take(b => b.kind === "atomic" && b.evidenceRefs.some(id => facts.some(e => e.id === id && ["sinsal_dohwa", "sinsal_hongyeom"].includes(e.featureId))), 2);
  const people = [...attraction, ...take(b => b.domains.includes("relationship"), attraction.length ? 0 : 1)];
  if (people.length) sections.push({ id: "people", title: "사람 관계의 결", blocks: people });
  const love = take(b => b.domains.includes("love"), 1);
  // A relationship directive can also apply a signal already explained above;
  // do not repeat its interpretation just to fill a love chapter.
  const loveBasis = love.length ? love : people.filter(b => b.domains.includes("love"));
  if (loveBasis.length) sections.push({ id: "love", title: "사랑의 결", blocks: [...love, contextBlock("love", RELATIONSHIP_DIRECTIONS[input.relationshipStatus] ?? RELATIONSHIP_DIRECTIONS.unknown, loveBasis)] });
  const lifestyle = lifestyleSuggestions(facts).map((s, i) => block({ id: `lifestyle:${s.element}:${s.condition}`, kind: "lifestyle", headline: `${({ wood: "목", fire: "화", earth: "토", metal: "금", water: "수" })[s.element]}의 ${s.condition === "missing" ? "빈자리를" : "쏠림을"} 생활 리듬으로 보완하세요.`, reading: "", action: `${s.choices.join(" · ")} — 지금 생활에 맞는 작은 활동으로 시작해 보세요.`, why: i === 0 ? "천간·지지와 지장간의 가중치를 반영한 오행 균형을 기준으로 고른 생활 제안입니다." : "", caution: "", domains: ["lifestyle"] }, facts.filter(e => s.evidenceRefs.includes(e.id)), s.sourceRefs));
  if (lifestyle.length) sections.push({ id: "balance", title: "부족한 기운을 보완하는 법", blocks: lifestyle });
  // Keep the requested reading order, irrespective of selection order.
  const order = ["strength", "gifts", "choices", "career", "money", "people", "love", "study", "balance"];
  sections.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
  const all = [...opening, ...sections.flatMap(s => s.blocks)];
  const patternFacts = unique(all.flatMap(b => b.evidenceRefs)).map(id => facts.find(e => e.id === id)!).filter(e => COMPREHENSIVE_ATOMIC_COPY[e.featureId]);
  const patternIds = new Set<string>();
  const patterns = patternFacts.filter(e => { if (patternIds.has(e.featureId)) return false; patternIds.add(e.featureId); return true; }).slice(0, 5).map(e => ({
    risk: COMPREHENSIVE_ATOMIC_COPY[e.featureId][1], repair: COMPREHENSIVE_ATOMIC_COPY[e.featureId][2], labels: [label(e)], evidenceRefs: [e.id],
  }));
  const main = strongest[0] ?? all[0];
  return { version: COMPREHENSIVE_V3_VERSION, productType: "saju_mbti_full", productVersion: "v3", personLabel: input.name,
    title: `${input.name}님의 결, 가진 힘을 쓰는 법`, profileTable: input.profileTable, opening, openingContext: OPENING_CONTEXT[context.lifeStatus] ?? OPENING_CONTEXT.other,
    sections, patterns, direction: main ? `앞으로 제안을 받을 때는 ‘${main.labels.join(" · ")}’의 힘을 쓸 자리가 있는지 먼저 보세요. 잘할 수 있다는 이유만으로 수락하지 말고, 내 판단으로 완성할 범위가 있는 일을 선택하세요.` : "지금 맡을 일의 범위와 끝낼 기준을 먼저 정하세요.", directionEvidenceRefs: main?.evidenceRefs ?? [] };
}
export function comprehensiveV3CustomerText(draft: ComprehensiveV3Draft): string {
  const text = (b: ComprehensiveV3Block) => [b.headline, ...(b.paragraphs ?? []), b.reading, b.action, ...(b.ideas ?? []), b.why, b.labels.join(" · ")].filter(Boolean).join("\n");
  return [draft.title, "핵심 결", ...draft.opening.map(text), draft.openingContext, ...draft.sections.flatMap(s => [s.title, ...s.blocks.map(text)]), "나를 망치기 쉬운 패턴", ...draft.patterns.flatMap(p => [p.strength, p.risk, p.why, p.repair, p.labels.join(" · ")].filter(Boolean)), "앞으로 이렇게 살아가세요", draft.direction].join("\n\n");
}
export function comprehensiveCoverage(facts: readonly Evidence[], draft: ComprehensiveV3Draft) {
  const used = new Set([...draft.opening, ...draft.sections.flatMap(s => s.blocks)].flatMap(b => b.evidenceRefs));
  return { registryAvailable: ATOMIC_REGISTRY.length, registeredFacts: facts.filter(e => ATOMIC_BY_ID.has(e.featureId)).length,
    warnings: facts.filter(e => ["sinsal_dohwa", "sinsal_hongyeom"].includes(e.featureId) && !used.has(e.id)).map(e => `positive-signal-unused:${e.id}`) };
}
