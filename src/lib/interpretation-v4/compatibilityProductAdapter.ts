import "server-only";
import { createHash } from "node:crypto";
import { normalizeReportInputPayload } from "../report-generation/reportInputAdapter";
import { calculateCompatibilitySaju } from "../report-generation/compatibilityGenerationHandler";
import { compatibilityNarrativeEvidence } from "./compatibilityEvidence";
import { composeCompatibilityNarrative } from "./compatibilityComposer";
import { buildRelationshipProfiles, projectRelationshipView, type RelationshipView } from "./relationshipProductView";
import { createRelationshipRenderer } from "./relationshipProductNarrative";
import { projectCompatibilityPairView, type PairComparison } from "./compatibilityProductView";
import { humanOutcome } from "./narrativeHumanOutcome";
import { reviewNarrative } from "./editorialGuard";
import type { NarrativeBlock } from "./narrativeTypes";
import type { SajuCalcResult } from "../saju/types";

export const COMPATIBILITY_PRODUCT_VERSION = "compatibility-product-13d-7b-v1";
const digest = (v: unknown) => createHash("sha256").update(JSON.stringify(v)).digest("hex");

/** A/B individual cores once each, canonical pair once. All pair categories,
 * index, directionality and existing interaction scenes remain authoritative. */
export function buildV4CompatibilityProduct(payload: unknown, calculated?: { personA: SajuCalcResult; personB: SajuCalcResult }) {
  const normalized = normalizeReportInputPayload(payload);
  if (!normalized.ok || normalized.value.kind !== "compatibility") return { ok: false as const, errors: ["RELATIONSHIP_PAIR_INPUT_INVALID"] };
  const input = normalized.value;
  const calculations = calculated ?? { personA: calculateCompatibilitySaju(input.personA), personB: calculateCompatibilitySaju(input.personB) };
  const e = compatibilityNarrativeEvidence(payload, calculations);
  if (!e.ok) return e;
  const people = e.persons;
  const canonical = composeCompatibilityNarrative(payload, e);
  if (!canonical.ok) return canonical;
  const romantic = ["love", "marriage"].includes(e.category);
  const context = { jobStatus: "" as const, detailJob: "", relationshipStatus: e.category === "marriage" ? "married" as const : e.category === "love" ? "dating" as const : "" as const };
  const profilesA = buildRelationshipProfiles({ calculation: calculations.personA, name: input.personA.name, mbti: input.personA.mbtiType, context });
  const profilesB = buildRelationshipProfiles({ calculation: calculations.personB, name: input.personB.name, mbti: input.personB.mbtiType, context });
  if (!profilesA.ok || !profilesB.ok) return { ok: false as const, errors: ["RELATIONSHIP_PAIR_PERSON_INVALID"] };
  const a = projectRelationshipView(profilesA.profiles, romantic), b = projectRelationshipView(profilesB.profiles, romantic);
  const pair = projectCompatibilityPairView(a, b, canonical);
  const stableKey = digest([COMPATIBILITY_PRODUCT_VERSION, e.category, e.invariant]);
  function personCore(view: RelationshipView, slot: "personA" | "personB") {
    const renderer = createRelationshipRenderer(view, `${stableKey}:${people[slot].personId}`);
    const eligible = view.candidates.filter(c => !c.factBomb && !c.fortune && c.sourceType !== "GUIDANCE")
      .sort((a, b) => Number(!!b.fusionType) - Number(!!a.fusionType) || Number(b.rank === "SIGNATURE") - Number(a.rank === "SIGNATURE") || a.id.localeCompare(b.id));
    for (const c of eligible) {
      const block = renderer.render(c, `P-${slot}`, romantic && c.contexts.includes("love") ? "love" : c.contexts.includes("social") ? "social" : "recovery");
      if (block) return { block: { ...block, text: `${people[slot].name}님의 가까운 관계에서는 ${block.text}`, proof: { ...block.proof, sourceRefs: [...block.proof.sourceRefs, `person:${people[slot].personId}`] } }, represented: renderer.represented };
    }
    return undefined;
  }
  const coreA = personCore(a, "personA"), coreB = personCore(b, "personB");
  if (!coreA || !coreB) return { ok: false as const, errors: ["RELATIONSHIP_PAIR_CORE_MISSING"] };
  const guidance: NarrativeBlock[] = [];
  const strategies = new Set<string>();
  for (const [view, slot] of [[a, "personA"], [b, "personB"]] as const) {
    const licensed = view.candidates.find(c => c.sourceType === "GUIDANCE" && c.operatingRuleType === "RELATIONSHIP"
      && c.primaryAxes.some(axis => pair.friction.some(p => p.axis === axis)) && c.strategyIds?.every(id => !strategies.has(id)));
    if (!licensed) continue;
    const renderer = createRelationshipRenderer(view, `${stableKey}:repair:${people[slot].personId}`);
    const block = renderer.render(licensed, "P8", romantic && licensed.contexts.includes("love") ? "love" : "social");
    if (block) { guidance.push({ ...block, id: `repair-${slot}-13d`, text: `${people[slot].name}님에게는 이런 방법이 맞습니다. ${block.text}` }); licensed.strategyIds?.forEach(id => strategies.add(id)); }
  }
  function comparison(row: PairComparison, id: string): NarrativeBlock | undefined {
    const left = humanOutcome(row.axis, row.personA.direction), right = humanOutcome(row.axis, row.personB.direction);
    if (!left || !right || row.tag === "CONTEXTUAL") return undefined;
    return { id, text: row.tag === "SHARED" ? `${input.personA.name}님과 ${input.personB.name}님에게 함께 보이는 모습이 있습니다. ${left}`
      : `${input.personA.name}님은 ${left} ${input.personB.name}님은 ${right}`, mode: "prose", tone: row.tag === "FRICTION" ? "observation" : "positive",
      proof: { features: [], seedIds: [], fusionIds: [], sourceRefs: [...row.personA.evidence.map(id => `personA:${id}`), ...row.personB.evidence.map(id => `personB:${id}`)] } };
  }
  const shared = pair.sharedGround.map(r => comparison(r, "pair-shared-13d")).find(Boolean);
  const difference = pair.friction.map(r => comparison(r, "pair-difference-13d")).find(Boolean);
  const core = { personA: coreA.block, personB: coreB.block };
  const sections = canonical.narrative.sections.map(s => {
    if (s.id === "direction-ab" || s.id === "direction-ba") {
      const slot = s.id === "direction-ab" ? "personB" : "personA";
      // Replace the old per-person MBTI overlay, not the canonical influence.
      return { ...s, blocks: [...s.blocks.filter(b => !b.id.endsWith("-response")), core[slot]] };
    }
    if (s.id === "delight" && shared) return { ...s, blocks: [shared, ...s.blocks] };
    if (s.id === "friction" && difference) return { ...s, blocks: [difference, ...s.blocks] };
    if (s.id === "repair" && guidance.length) return { ...s, blocks: [...s.blocks, ...guidance] };
    return s;
  });
  const narrative = { ...canonical.narrative, opening: canonical.narrative.opening.filter(b => !b.id.startsWith("pair-core-") && !b.id.startsWith("pair-shared-")), sections };
  return { ...canonical, narrative, writerVersion: COMPATIBILITY_PRODUCT_VERSION, editorial: reviewNarrative(narrative),
    integration: { version: COMPATIBILITY_PRODUCT_VERSION, pair,
      individualDigests: { personA: digest({ m: a.profiles.myeongli, b: a.profiles.mbti, f: a.profiles.fusion, c: a.profiles.claims, r: a.profiles.resonance }),
        personB: digest({ m: b.profiles.myeongli, b: b.profiles.mbti, f: b.profiles.fusion, c: b.profiles.claims, r: b.profiles.resonance }) },
      represented: { personA: coreA.represented, personB: coreB.represented },
      questions: { P1: "core/delight", P2: "delight", P3: "fortune", P4: "friction", P5: "direction-ab/direction-ba", P6: "scene", P7: "scene/lasting", P8: "repair" } } };
}
export type CompatibilityProduct = Extract<ReturnType<typeof buildV4CompatibilityProduct>, { ok: true }>;
