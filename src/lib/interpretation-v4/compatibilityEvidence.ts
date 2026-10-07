import { normalizeReportInputPayload } from "../report-generation/reportInputAdapter";
import { COMPATIBILITY_ROLE_VERSION, compatibilityRoleLabels } from "../report-generation/reportInputTypes";
import { buildCompatibilityEvidenceFromGenerationInput, calculateCompatibilitySaju } from "../report-generation/compatibilityGenerationHandler";
import { buildProductNatalTables, getCanonicalNatalTable } from "../report-knowledge/natalTableEvidence";
import { createBranchRef, detectCrossBranchRelations } from "../report-knowledge/compatibilityRelationRules";
import { buildCompatibilityDirectionEvidence } from "../report-knowledge/compatibilityDirectionEvidence";
import { buildMyeongliMaterialPacket } from "./materialPacket";
import { projectYinYang } from "./contentEvidence";
import type { SajuCalcResult } from "../saju/types";

/** Projection of existing canonical adapters, NOT a second compatibility engine.
 * The legacy packet stays local: no scores, old prose or role-less assignment is
 * copied into the V4 contract. Unknown-hour evidence remains canonical/partial. */
export function compatibilityNarrativeEvidence(payload: unknown, calculated?: { personA: SajuCalcResult; personB: SajuCalcResult }) {
  const normalized = normalizeReportInputPayload(payload);
  if (!normalized.ok || normalized.value.kind !== "compatibility" || normalized.value.compatibilityRoleVersion !== COMPATIBILITY_ROLE_VERSION)
    return { ok: false as const, errors: ["V4_COMPATIBILITY_FIXED_ROLE_INPUT_REQUIRED"] };
  const input = normalized.value;
  const calculations = calculated ?? { personA: calculateCompatibilitySaju(input.personA), personB: calculateCompatibilitySaju(input.personB) };
  const base = buildCompatibilityEvidenceFromGenerationInput(input, calculations);
  const natalPacket = { ...base, natalTableEvidence: buildProductNatalTables(base) };
  const existing = { direction: buildCompatibilityDirectionEvidence(base.input, base.personAChartSummary, base.personBChartSummary, input.relationshipType) };
  // The legacy detector picks the first matching trine reference. Feed it a
  // stable identity order ONLY in this V4 projection so an A/B swap cannot
  // change the symmetric representative. Rules and original roles stay intact.
  const slots = ["personA", "personB"] as const;
  const order = [...slots].sort((a, b) => existing.direction.persons[a].personId.localeCompare(existing.direction.persons[b].personId));
  const refs = (slot: typeof slots[number]) => (getCanonicalNatalTable(natalPacket, slot)?.pillars ?? []).flatMap(p => {
    const r = createBranchRef({ person: slot, personLabel: input[slot].name, position: p.columnId, pillar: p.pillar }); return r ? [r] : [];
  });
  const detected = detectCrossBranchRelations({ personARefs: refs(order[0]), personBRefs: refs(order[1]) }).map(r => ({ ...r,
    identity: `${r.kind}:${r.refs.map(ref => `${existing.direction.persons[ref.person].personId}:${ref.position}:${ref.branch}`).sort().join("|")}`,
  }));
  const relations = [...new Map(detected.map(r => [r.identity, r])).values()].sort((a, b) => Number(b.refs.every(r => r.position === "day")) - Number(a.refs.every(r => r.position === "day")) || Number(b.refs.some(r => r.position === "day")) - Number(a.refs.some(r => r.position === "day")) || a.identity.localeCompare(b.identity));
  const invariant = [...new Set([...relations.map(r => r.identity),
    ...slots.map(slot => `${existing.direction.persons[slot].personId}:${existing.direction.persons[slot].dayPillar}`),
    ...[existing.direction.aToB, existing.direction.bToA].map(d => `${d.subjectPerson}:to:${d.targetPerson}:${d.receivedTenGod?.tenGod}:${d.element?.relation}`),
  ])].sort();
  const direction = (d: typeof existing.direction.aToB) => ({
    subjectPerson: d.subjectPerson, targetPerson: d.targetPerson, relationId: d.relationId,
    receivedTenGod: d.receivedTenGod, element: d.element, mbtiPair: d.mbtiPair,
  });
  const person = (slot: "personA" | "personB") => ({
    personId: existing.direction.persons[slot].personId, name: input[slot].name, mbti: existing.direction.persons[slot].mbti,
    precision: calculations[slot].birthTimeContext?.birthTimePrecision ?? "unknown",
    yinYang: projectYinYang(calculations[slot]),
    materials: buildMyeongliMaterialPacket({ calculation: calculations[slot], mbti: input[slot].mbtiType, subject: slot }),
  });
  return { ok: true as const, category: input.relationshipType, roleVersion: COMPATIBILITY_ROLE_VERSION,
    roles: compatibilityRoleLabels(input.relationshipType), persons: { personA: person("personA"), personB: person("personB") },
    directions: { aToB: direction(existing.direction.aToB), bToA: direction(existing.direction.bToA) },
    relations, invariant, relationProjection: "canonical-rule-stable-person-order-v1" as const,
    // Current CROSS-person producer supports these five kinds only. Natal-only
    // marks must never become invented pair relations (including wonjin).
    unsupportedCrossRelations: ["stem-combination", "punishment", "break", "wonjin", "directional-harmony"] as const,
  };
}
export type PairEvidence = Extract<ReturnType<typeof compatibilityNarrativeEvidence>, { ok: true }>;
