import { mapComputedSajuFactsToKnowledgeEntryIds } from "./sajuComputedFactsMapper";
import type { ComputedSajuFacts } from "./sajuComputedFactsTypes";
import { SAJU_KNOWLEDGE_BY_ID, FIVE_ELEMENTS } from "./sajuKnowledgeBase";

/** Computed facts override dictionary selections. No strength is inferred from presence. */
export function fusionFactIds(entryIds: readonly string[], facts?: ComputedSajuFacts): ReadonlySet<string> {
  const ids = new Set(facts ? mapComputedSajuFactsToKnowledgeEntryIds(facts).sajuEntryIds : entryIds.filter((id) => SAJU_KNOWLEDGE_BY_ID.has(id)));
  if (facts) {
    for (const element of FIVE_ELEMENTS) {
      const present = facts.fiveElementCounts[element] > 0;
      const missing = facts.missingElements.includes(element);
      const excess = facts.excessiveElements.includes(element);
      if (present && !missing) ids.add(`element_${element}`);
      if (facts.fiveElementCounts[element] === 0 && missing && !excess) ids.add(`element_${element}_missing`);
      if (present && excess && !missing) ids.add(`element_${element}:excess`);
      if ((present && missing) || (!present && excess)) {
        for (const id of [`element_${element}`, `element_${element}_missing`, `element_${element}_excess`, `element_${element}_strong`]) ids.delete(id);
      }
    }
    // Explicit negative measurements cannot be overridden by a broad structure label.
    for (const [pattern, gods] of [
      ["pattern_no_resource", ["zheng_yin", "pian_yin"]],
      ["pattern_no_output", ["shi_shen", "shang_guan"]],
    ] as const) {
      if (facts.tenGodSignals.some((signal) => (gods as readonly string[]).includes(signal.tenGod) && signal.strength !== "missing")) ids.delete(pattern);
    }
    if (["pian_cai", "zheng_cai"].every((god) => facts.tenGodSignals.some((signal) => signal.tenGod === god && ["missing", "weak"].includes(signal.strength)))) ids.delete("pattern_jaeda_sinyak");
    // Existing knowledge calls metal excess "strong"; no numerical threshold is introduced here.
    if (ids.has("element_metal:excess")) ids.add("element_metal_strong");
    for (const signal of facts.tenGodSignals) {
      if (["strong", "excessive"].includes(signal.strength)) ids.add(`ten_god_${signal.tenGod}:strong`);
      if (["missing", "weak"].includes(signal.strength)) {
        ids.delete(`ten_god_${signal.tenGod}`);
        ids.delete(`ten_god_${signal.tenGod}:strong`);
      }
    }
  }
  if (facts) {
    for (const signal of facts.tenGodSignals) {
      if (facts.tenGodSignals.some((other) => other.tenGod === signal.tenGod && other.strength !== signal.strength)) {
        ids.delete(`ten_god_${signal.tenGod}`);
        ids.delete(`ten_god_${signal.tenGod}:strong`);
      }
    }
  }
  // Conflicting caller-provided dictionary facts fail closed for that identity only.
  for (const category of ["day_pillar", "day_master"] as const) {
    const group = [...ids].filter((id) => SAJU_KNOWLEDGE_BY_ID.get(id)?.category === category);
    if (group.length > 1) group.forEach((id) => ids.delete(id));
  }
  for (const element of FIVE_ELEMENTS) {
    const positive = [`element_${element}`, `element_${element}_strong`, `element_${element}_excess`, `element_${element}:excess`];
    const absent = `element_${element}_missing`;
    if (ids.has(absent) && positive.some((id) => ids.has(id))) {
      [absent, ...positive].forEach((id) => ids.delete(id));
    }
  }
  for (const [absent, present] of [
    ["pattern_no_resource", ["ten_god_zheng_yin", "ten_god_pian_yin"]],
    ["pattern_no_output", ["ten_god_shi_shen", "ten_god_shang_guan"]],
  ] as const) {
    if (ids.has(absent) && present.some((id) => ids.has(id))) ids.delete(absent);
  }
  if (ids.has("pattern_singang") && ids.has("pattern_sinyak")) {
    ids.delete("pattern_singang"); ids.delete("pattern_sinyak");
  }
  return ids;
}
