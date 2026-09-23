/** An AND of nonempty OR groups. IDs are declared facts, never inferred from prose/tags. */
export type FactCondition = {
  readonly allOf: readonly (readonly string[])[];
  readonly noneOf?: readonly string[];
};
export type BridgeInteractionTrace = {
  readonly interactionId: string;
  readonly ruleId: string;
  readonly interactionType: "agreement" | "tension" | "compensation" | "amplification" | "expression" | "context-switch";
  readonly myeongliEvidenceIds: readonly string[];
  readonly mbtiEvidenceIds: readonly string[];
  readonly contexts: readonly string[];
  /** Confidence in the source linkage, not a measured strength of a person's character. */
  readonly confidence: "direct" | "inferred";
  readonly intensity: "low" | "medium";
};
export function matchFactCondition(condition: FactCondition, ids: ReadonlySet<string>): readonly string[] | null {
  if (!condition.allOf.length || condition.noneOf?.some((id) => ids.has(id))) return null;
  const groups = condition.allOf.map((group) => group.filter((id) => ids.has(id)));
  if (groups.some((group) => !group.length)) return null;
  return [...new Set(groups.flat())].sort();
}
export function interactionKey(input: Pick<BridgeInteractionTrace, "myeongliEvidenceIds" | "mbtiEvidenceIds" | "interactionType" | "contexts">): string {
  return JSON.stringify([ [...new Set(input.myeongliEvidenceIds)].sort(), [...new Set(input.mbtiEvidenceIds)].sort(), input.interactionType, [...new Set(input.contexts)].sort() ]);
}
// Exact source vocabulary adapter. Unknown vocabulary is deliberately NOT a match.
// These IDs reuse the knowledge/feature taxonomy. Group names are explicit ORs, not new facts.
export const BRIDGE_SIGNAL_FACTS: Readonly<Record<string, readonly string[]>> = {
  목: ["element_wood"], 화: ["element_fire"], 토: ["element_earth"], 금: ["element_metal"], 수: ["element_water"],
  wood: ["element_wood"], fire: ["element_fire"], earth: ["element_earth"], metal: ["element_metal"], water: ["element_water"],
  비견: ["ten_god_bijian"], 겁재: ["ten_god_jie_cai"], 식신: ["ten_god_shi_shen"], 상관: ["ten_god_shang_guan"],
  편재: ["ten_god_pian_cai"], 정재: ["ten_god_zheng_cai"], 편관: ["ten_god_qi_sha"], 정관: ["ten_god_zheng_guan"],
  편인: ["ten_god_pian_yin"], 정인: ["ten_god_zheng_yin"],
  현침살: ["sinsal_hyeonchim"], 현침: ["sinsal_hyeonchim"], 도화: ["sinsal_dohwa"], 도화살: ["sinsal_dohwa"],
  홍염: ["sinsal_hongyeom"], 홍염살: ["sinsal_hongyeom"], 역마: ["sinsal_yeokma"], 역마살: ["sinsal_yeokma"],
  천문성: ["sinsal_cheonmun"], 문창: ["nobleman_munchang"], 문창귀인: ["nobleman_munchang"],
  천을귀인: ["nobleman_cheoneul"], 천덕귀인: ["nobleman_cheondeok"], 월덕귀인: ["nobleman_woldeok"],
  태극귀인: ["nobleman_taegeuk"], 재고귀인: ["gwiin_jaego"], 금여록: ["gwiin_geumyeorok"],
};
export const BRIDGE_HINT_FACTS: Readonly<Record<string, readonly string[]>> = {
  ...BRIDGE_SIGNAL_FACTS,
  비겁: ["ten_god_bijian", "ten_god_jie_cai"], 식상: ["ten_god_shi_shen", "ten_god_shang_guan"],
  재성: ["ten_god_pian_cai", "ten_god_zheng_cai"], 관성: ["ten_god_qi_sha", "ten_god_zheng_guan"], 인성: ["ten_god_pian_yin", "ten_god_zheng_yin"],
  귀인: ["nobleman_munchang", "nobleman_cheoneul", "nobleman_cheondeok", "nobleman_woldeok", "nobleman_taegeuk", "gwiin_jaego", "gwiin_geumyeorok"],
};

export function hasGroundedInteractionReferences(
  interaction: BridgeInteractionTrace,
  myeongliIds: ReadonlySet<string>,
  mbtiIds: ReadonlySet<string>,
): boolean {
  return interaction.myeongliEvidenceIds.length > 0 && interaction.mbtiEvidenceIds.length > 0 &&
    interaction.myeongliEvidenceIds.every((id) => myeongliIds.has(id)) &&
    interaction.mbtiEvidenceIds.every((id) => mbtiIds.has(id));
}
