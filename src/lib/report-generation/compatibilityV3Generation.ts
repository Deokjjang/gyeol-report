import { buildCompatibilityEvidenceFromGenerationInput, calculateCompatibilitySaju } from "./compatibilityGenerationHandler";
import { normalizeReportInputPayload } from "./reportInputAdapter";
import { COMPATIBILITY_ROLE_VERSION, COMPATIBILITY_RELATIONSHIP_TYPES, type CompatibilityRelationshipType } from "./reportInputTypes";
import { withReportInputEvidence } from "./reportInputEvidence";
import { buildProductNatalTables, getCanonicalNatalTable } from "../report-knowledge/natalTableEvidence";
import type { CompatibilityEvidencePacket } from "../report-knowledge/compatibilityEvidenceBuilder";
import { getDayMasterElementRelation } from "../report-knowledge/compatibilityRelationRules";
import { SAJU_CALENDAR_VERSION } from "../saju/calendarVersion";
import { compatibilityEditorialEvidence, PAIR_SLOTS, type PairCalculations } from "../interpretation-v3/compatibilityEditorialEvidence";
import { buildCompatibilityV3, isCompatibilityV3Draft, compatibilityV3CustomerText, COMPATIBILITY_V3_VERSION, COMPATIBILITY_V3_POLISHED_VERSION, type CompatibilityV3Draft } from "../interpretation-v3/compatibilityEditorial";
import { buildCompatibilityV3Polished } from "../interpretation-v3/compatibilityPolished";
import { validateEvidence } from "../interpretation-v3/evidence";
import { validateV3Copy } from "../interpretation-v3/engine";
import { integrateMbtiNarrative } from "../interpretation-v3/mbtiNarrative";
import { hasNarrativeEdition, hasDetailNarrative } from "../interpretation-v3/narrativeEdition";
import { hasContentRevision, withContentRevision } from "../interpretation-v3/contentRevision";

const record = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const stable = (v: unknown): string => Array.isArray(v) ? `[${v.map(stable).join(",")}]` : record(v) ? `{${Object.keys(v).filter(k => v[k] !== undefined).sort().map(k => `${JSON.stringify(k)}:${stable(v[k])}`).join(",")}}` : JSON.stringify(v);

export function createCompatibilityV3(payload: unknown, version: CompatibilityV3Draft["version"] = COMPATIBILITY_V3_POLISHED_VERSION) {
  const result = normalizeReportInputPayload(payload);
  if (!result.ok || result.value.kind !== "compatibility" || result.value.compatibilityRoleVersion !== COMPATIBILITY_ROLE_VERSION) return null;
  const input = result.value;
  const calculations = { personA: calculateCompatibilitySaju(input.personA), personB: calculateCompatibilitySaju(input.personB) };
  const base = buildCompatibilityEvidenceFromGenerationInput(input);
  const packet = { ...withReportInputEvidence(base, input), calendarCalculationVersion: SAJU_CALENDAR_VERSION, natalTableEvidence: buildProductNatalTables(base) };
  const editorial = compatibilityEditorialEvidence(packet, calculations);
  const draft = (version === COMPATIBILITY_V3_VERSION ? buildCompatibilityV3 : buildCompatibilityV3Polished)(editorial, input.relationshipType, true);
  return { draft: version === COMPATIBILITY_V3_POLISHED_VERSION ? withContentRevision(integrateMbtiNarrative(draft, editorial.facts, { category: input.relationshipType }, true, true)) : draft, evidencePacket: { ...packet, compatibilityV3: { version: "compatibility-evidence-v3.1", calculations, editorial } } };
}

/** Replay only stored canonical tables/calculation with the versioned composer.
 * Legacy role-less snapshots never enter this contract; no calendar/provider/DB. */
export function validateCompatibilityV3(draft: unknown, packet: unknown, payload?: unknown): readonly string[] {
  if (!isCompatibilityV3Draft(draft) || !record(packet) || !record(packet.compatibilityV3) || !record(packet.inputBasis)) return ["COMPATIBILITY_V3_CONTRACT_REQUIRED"];
  const v3 = packet.compatibilityV3, basis = packet.inputBasis;
  if (v3.version !== "compatibility-evidence-v3.1" || !record(v3.calculations) || basis.compatibilityRoleVersion !== COMPATIBILITY_ROLE_VERSION || draft.compatibilityRoleVersion !== COMPATIBILITY_ROLE_VERSION || !COMPATIBILITY_RELATIONSHIP_TYPES.includes(basis.relationshipType as CompatibilityRelationshipType)) return ["COMPATIBILITY_V3_ROLE_CONTRACT_REQUIRED"];
  if (payload !== undefined && (!record(payload) || payload.compatibilityRoleVersion !== COMPATIBILITY_ROLE_VERSION || payload.relationshipType !== basis.relationshipType)) return ["COMPATIBILITY_V3_INPUT_MISMATCH"];
  try {
    const calculations = v3.calculations as PairCalculations;
    for (const slot of PAIR_SLOTS) {
      const table = getCanonicalNatalTable(packet, slot), person = basis[slot], calc = calculations[slot];
      if (!table || !calc || !record(person) || table.pillars.some(p => { const actual = calc.pillars[p.columnId]; return !actual || actual.stem + actual.branch !== p.pillar; })) return ["COMPATIBILITY_V3_CALCULATION_MISMATCH"];
      const storedInput = (packet as unknown as CompatibilityEvidencePacket).input[slot];
      if (storedInput.displayName !== person.name || (storedInput.mbti ?? "") !== person.mbtiType || storedInput.birthDate !== person.birthDate) return ["COMPATIBILITY_V3_PERSON_MISMATCH"];
      const chart = (packet as unknown as CompatibilityEvidencePacket)[slot === "personA" ? "personAChartSummary" : "personBChartSummary"];
      if (chart.displayName !== person.name || (chart.mbti ?? "") !== person.mbtiType ||
        getDayMasterElementRelation(chart.dayMaster, calc.pillars.day.stem)?.sourceStem !== calc.pillars.day.stem ||
        table.pillars.some(p => chart.pillars[p.columnId] !== p.pillar)) return ["COMPATIBILITY_V3_CHART_INPUT_MISMATCH"];
    }
    if (packet.relationshipType !== basis.relationshipType || (packet as unknown as CompatibilityEvidencePacket).input.relationshipType !== basis.relationshipType) return ["COMPATIBILITY_V3_CATEGORY_MISMATCH"];
    const editorial = compatibilityEditorialEvidence(packet as unknown as CompatibilityEvidencePacket, calculations);
    const errors = [...validateEvidence(editorial.facts)];
    if (stable(editorial) !== stable(v3.editorial)) errors.push("COMPATIBILITY_V3_EVIDENCE_MISMATCH");
    const expected = (draft.version === COMPATIBILITY_V3_VERSION ? buildCompatibilityV3 : buildCompatibilityV3Polished)(editorial, basis.relationshipType as CompatibilityRelationshipType, hasContentRevision(draft));
    const current = hasNarrativeEdition(draft) ? integrateMbtiNarrative(expected, editorial.facts, { category: String(basis.relationshipType) }, hasDetailNarrative(draft), hasContentRevision(draft)) : expected;
    if (stable(hasContentRevision(draft) ? withContentRevision(current) : current) !== stable(draft)) errors.push("COMPATIBILITY_V3_CONTENT_MISMATCH");
    const qa = draft.editorialAudit;
    if (!qa || qa.errors.length || qa.rejected.length || qa.warnings.length || qa.audit.mix.character < 0.75 || qa.audit.mix.advice > 0.25 || draft.chapters.length !== 7) errors.push("COMPATIBILITY_V3_EDITORIAL_INCOMPLETE");
    errors.push(...validateV3Copy(compatibilityV3CustomerText(draft)));
    return errors;
  } catch { return ["COMPATIBILITY_V3_EVIDENCE_INVALID"]; }
}
