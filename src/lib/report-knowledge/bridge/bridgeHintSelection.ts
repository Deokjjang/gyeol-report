import { getMbtiMyeongliBridgeHints, getMbtiSourceProfile, type MbtiMyeongliBridgeHint, type MbtiSourceTraitItem, type MbtiSourceType, type MbtiTraitArea } from "../mbti";
import { BRIDGE_HINT_FACTS, BRIDGE_SIGNAL_FACTS, type BridgeInteractionTrace, interactionKey, hasGroundedInteractionReferences } from "./factConditions";
import type { BridgeProductContext, MyeongliSignal } from "./types";

const signalVocabulary: Partial<Record<MyeongliSignal["kind"], readonly string[]>> = {
  element: ["목", "화", "토", "금", "수", "wood", "fire", "earth", "metal", "water"],
  tenGod: ["비견", "겁재", "식신", "상관", "편재", "정재", "편관", "정관", "편인", "정인"],
  shinsal: ["현침살", "현침", "도화", "도화살", "홍염", "홍염살", "역마", "역마살", "천문성"],
  gwiin: ["문창", "문창귀인", "천을귀인", "천덕귀인", "월덕귀인", "태극귀인", "재고귀인", "금여록"],
};
const domains: Record<BridgeProductContext, readonly string[]> = {
  general: ["general"], careerMoneyStudy: ["career", "workplace", "money", "investment", "study"],
  loveMarriageChild: ["love", "marriage", "parenting", "child", "relationship"],
  compatibility: ["compatibility", "relationship"], daeun: ["daeun", "career", "money", "investment", "growth"], saeun: ["saeun", "career", "relationship", "growth"],
};
export function normalizeBridgeSignals(signals: readonly MyeongliSignal[]): MyeongliSignal[] {
  const facts = new Map<string, MyeongliSignal>();
  for (const signal of signals) {
    const vocabulary = signalVocabulary[signal.kind] ?? [];
    const values = [signal.value, signal.label].filter((value): value is string => !!value && vocabulary.includes(value));
    const ids = [...new Set(values.flatMap((value) => BRIDGE_SIGNAL_FACTS[value] ?? []))];
    // A label and value disagreeing about a fact cannot establish either one.
    if (ids.length !== 1) continue;
    const id = ids[0];
    if (!facts.has(id)) facts.set(id, { ...signal, id });
  }
  return [...facts.values()];
}
export type MatchedBridgeHint = {
  readonly hint: MbtiMyeongliBridgeHint;
  readonly traits: readonly { area: MbtiTraitArea; trait: MbtiSourceTraitItem }[];
  readonly interaction: BridgeInteractionTrace;
};
/** Exact source predicates; labels are vocabulary keys, never substring/semantic searches. */
export function selectMatchedBridgeHints(input: {
  readonly mbtiType: MbtiSourceType;
  readonly productContext: BridgeProductContext;
  readonly factIds: ReadonlySet<string>;
  readonly traitAreas?: readonly MbtiTraitArea[];
}): MatchedBridgeHint[] {
  const source = getMbtiSourceProfile(input.mbtiType);
  if (!source) return [];
  const traits = Object.entries(source.traits ?? {}).flatMap(([area, list]) =>
    (list ?? []).map((trait) => ({ area: area as MbtiTraitArea, trait })),
  ).filter(({ area }) => !input.traitAreas || input.traitAreas.includes(area));
  const mbtiIds = new Set(traits.map(({ area, trait }) => `mbti:${source.type}:traits:${area}:${trait.id}`));
  const matched: MatchedBridgeHint[] = [];
  const seen = new Set<string>();
  for (const hint of getMbtiMyeongliBridgeHints(input.mbtiType) ?? []) {
    const contexts = hint.productDomains.filter((domain) => domains[input.productContext].includes(domain));
    const ids = (BRIDGE_HINT_FACTS[hint.signal] ?? []).filter((id) => input.factIds.has(id));
    if (!contexts.length || !ids.length) continue;
    // These existing source reasons explicitly require strength. Presence/weight cannot prove it.
    if ((input.mbtiType === "ENTJ" && hint.signal === "편관" && !input.factIds.has("ten_god_qi_sha:strong")) ||
      (input.mbtiType === "ENTP" && hint.signal === "상관" && !input.factIds.has("ten_god_shang_guan:strong"))) continue;
    const relevantTraits = traits.filter(({ trait }) => trait.id &&
      (trait.productDomains ?? []).some((domain) => domains[input.productContext].includes(domain)) &&
      (hint.relatedTraits.length ? hint.relatedTraits.includes(trait.id) :
        (trait.matchingMyeongliSignals ?? []).some((signal) => (BRIDGE_HINT_FACTS[signal] ?? []).some((id) => ids.includes(id)))),
    );
    if (!relevantTraits.length) continue;
    // Reviewed source relations only. Unclassified matches stay expression, not inferred agreement.
    const interactionType: BridgeInteractionTrace["interactionType"] =
      source.type === "ENFP" && hint.signal === "정재" && relevantTraits.some(({ trait }) => trait.id === "recurring_income_anchor")
        ? "compensation"
        : source.type === "ENTJ" && hint.signal === "현침살" && relevantTraits.some(({ trait }) => trait.id === "direct_feedback_leader")
          ? "amplification" : "expression";
    const trace = {
      ruleId: `mbti:${source.type}:myeongliBridgeHints:${hint.signal}`,
      interactionType,
      myeongliEvidenceIds: ids,
      mbtiEvidenceIds: relevantTraits.map(({ area, trait }) => `mbti:${source.type}:traits:${area}:${trait.id}`),
      contexts: [...contexts].sort(),
      confidence: hint.sourceCoverage === "direct" ? "direct" as const : "inferred" as const,
      // Source matching proves relevance, not causal strength. No count-based high category.
      intensity: hint.sourceCoverage === "direct" ? "medium" as const : "low" as const,
    };
    const interaction = { ...trace, interactionId: `${trace.ruleId}:${input.productContext}` };
    if (!hasGroundedInteractionReferences(interaction, input.factIds, mbtiIds)) continue;
    const key = interactionKey(trace);
    if (seen.has(key)) continue;
    seen.add(key);
    matched.push({ hint, traits: relevantTraits, interaction });
  }
  return matched;
}
