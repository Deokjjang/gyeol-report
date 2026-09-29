import { buildAnnualV3, isAnnualV3Draft, annualV3CustomerText } from "../interpretation-v3/annualEditorial";
import { adaptCalculation, adaptMbti, adaptNatalTable, mergeEvidence, validateEvidence } from "../interpretation-v3/evidence";
import type { Evidence } from "../interpretation-v3/types";
import { extendAnnualMonthEvidence, type AnnualMonthExtendedEvidence } from "../report-knowledge/annualMonthExtendedEvidence";
import { buildProductNatalTables, getCanonicalNatalTable } from "../report-knowledge/natalTableEvidence";
import type { AnnualFortuneEvidencePacket } from "../report-knowledge/annualFortuneEvidence";
import { SAJU_CALENDAR_VERSION } from "../saju/calendarVersion";
import type { SajuCalcResult } from "../saju/types";
import { calculateAnnualFortuneSaju, generateAnnualFortuneProductDraft } from "./annualFortuneGenerationHandler";
import { normalizeReportInputPayload } from "./reportInputAdapter";
import { validateAnnualFortuneReportDraft } from "./annualFortuneReportDraftValidator";
import type { AnnualFortuneReportDraft } from "./annualFortuneReportDraftTypes";

export type AnnualV3Evidence = AnnualFortuneEvidencePacket & { annualV3: { version: "annual-evidence-v3.1"; calculation: SajuCalcResult; facts: readonly Evidence[]; monthly: AnnualMonthExtendedEvidence; evaluatedAtKst: string } };
const record = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const stable = (v: unknown): string => Array.isArray(v) ? `[${v.map(stable).join(",")}]` : record(v) ? `{${Object.keys(v).filter(k => v[k] !== undefined).sort().map(k => `${JSON.stringify(k)}:${stable(v[k])}`).join(",")}}` : JSON.stringify(v);
const projection = (d: ReturnType<typeof buildAnnualV3>) => ({ title: d.title, hook: d.hook, spoiler: d.spoiler, evaluatedAtKst: d.evaluatedAtKst, inputSummary: d.inputSummary, opening: d.opening, annualSections: d.annualSections, editorialMonths: d.editorialMonths, focusMonths: d.focusMonths, finale: d.finale, narrativeAudit: d.narrativeAudit });
function annualFacts(packet: unknown, calculation: SajuCalcResult, mbti: string) {
  const table = getCanonicalNatalTable(packet);
  return table ? mergeEvidence(adaptNatalTable(table).filter(f => f.kind !== "element"), adaptCalculation(calculation), adaptMbti(mbti)) : [];
}
export async function createAnnualV3(payload: unknown, options: { now?: () => Date; policyDate?: Date } = {}) {
  const input = normalizeReportInputPayload(payload);
  if (!input.ok || input.value.kind !== "annualFortune") return null;
  const now = options.now?.() ?? new Date();
  // Commerce acceptance date continues to control allowed years. Reading time
  // comes from the server separately; no payload field controls the clock.
  const generated = await generateAnnualFortuneProductDraft(input.value, { now: () => options.policyDate ?? now, writer: { enabled: false } });
  if (!generated.ok) return null;
  const calculation = calculateAnnualFortuneSaju(input.value.person), base = generated.evidencePacket as AnnualFortuneEvidencePacket;
  const packet = { ...base, calendarCalculationVersion: SAJU_CALENDAR_VERSION, natalTableEvidence: buildProductNatalTables(base) };
  if (packet.monthlyCalculationVersion !== "annual-month-jie-kst-v2" || packet.calendarMonths?.length !== 12) return null;
  const facts = annualFacts(packet, calculation, input.value.person.mbtiType), monthly = extendAnnualMonthEvidence(packet);
  const draft = buildAnnualV3(generated.draft, packet, monthly, facts, now);
  return { draft, evidencePacket: { ...packet, annualV3: { version: "annual-evidence-v3.1" as const, calculation, facts, monthly, evaluatedAtKst: draft.evaluatedAtKst } } };
}
export function validateAnnualV3(draft: unknown, evidence: unknown): readonly string[] {
  if (!isAnnualV3Draft(draft) || !record(evidence) || evidence.productType !== "annual_fortune") return ["ANNUAL_V3_CONTRACT_REQUIRED"];
  const packet = evidence as unknown as AnnualV3Evidence, extension = packet.annualV3;
  if (!extension || extension.version !== "annual-evidence-v3.1" || !extension.calculation || !Array.isArray(extension.facts) || !Number.isFinite(Date.parse(extension.evaluatedAtKst))) return ["ANNUAL_V3_EVIDENCE_REQUIRED"];
  if (packet.monthlyCalculationVersion !== "annual-month-jie-kst-v2" || packet.calendarMonths?.length !== 12) return ["ANNUAL_V3_CALENDAR_REQUIRED"];
  const errors: string[] = [];
  const legacy = validateAnnualFortuneReportDraft({ ...draft, version: "v1", productVersion: "v1" }, packet);
  if (!legacy.ok || !legacy.value) return ["ANNUAL_V3_LEGACY_CONTRACT_INVALID", ...legacy.errors];
  const table = getCanonicalNatalTable(packet);
  if (!table || table.pillars.some(p => { const actual = extension.calculation.pillars[p.columnId]; return !actual || actual.stem + actual.branch !== p.pillar || packet.baseSaju.pillars[p.columnId] !== p.pillar; }) || packet.baseSaju.dayMaster !== extension.calculation.pillars.day.stem) errors.push("ANNUAL_V3_NATAL_MISMATCH");
  const facts = annualFacts(packet, extension.calculation, packet.mbtiBasis.type ?? "");
  errors.push(...validateEvidence(facts));
  if (stable(facts) !== stable(extension.facts)) errors.push("ANNUAL_V3_FACTS_MISMATCH");
  const monthly = extendAnnualMonthEvidence(packet);
  if (stable(monthly) !== stable(extension.monthly)) errors.push("ANNUAL_V3_MONTH_EVIDENCE_MISMATCH");
  const expected = buildAnnualV3(legacy.value as AnnualFortuneReportDraft, packet, monthly, facts, new Date(extension.evaluatedAtKst));
  if (stable(projection(draft)) !== stable(projection(expected))) errors.push("ANNUAL_V3_CONTENT_MISMATCH");
  if (draft.editorialMonths.length !== 12 || draft.editorialMonths.some(m => m.paragraphs.length < 4) || draft.finale.length < 4) errors.push("ANNUAL_V3_EDITORIAL_INCOMPLETE");
  if (/evidenceId|sourceRefs|unsupported|backend|debug|metal|water|\d+\s*점|[SABC][+-]?\s*등급|겁재은|정재은|결과이(?:\s|[,.])/iu.test(annualV3CustomerText(draft))) errors.push("ANNUAL_V3_VISIBLE_COPY_INVALID");
  return [...new Set(errors)];
}
