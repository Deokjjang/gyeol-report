import { calculateAnnualFortuneSaju, generateAnnualFortuneProductDraft } from "../report-generation/annualFortuneGenerationHandler";
import type { AnnualFortuneEvidencePacket } from "../report-knowledge/annualFortuneEvidence";
import { normalizeReportInputPayload } from "../report-generation/reportInputAdapter";
import { getAnnualFortuneSeoulDateParts, getBranchPairRelations, getTenGodForStemPair } from "../report-knowledge/annualFortuneYearRules";
import { annualSegmentAt, extendAnnualMonthEvidence, type MonthFeature } from "../report-knowledge/annualMonthExtendedEvidence";
import { STEM_COMBINATIONS } from "../saju/constants";
import { buildAnnualFortuneReading } from "../report-knowledge/annualFortuneReading";
import { canonicalV4Feature } from "./materialRegistry";
import { buildMyeongliMaterialPacket } from "./materialPacket";
import type { NarrativeInput } from "./narrativeTypes";

export type AnnualClock = {
  /** Required reading instant, independent of the selected year. */
  currentDate: string;
  /** Offline future-year simulations only; existing commerce policy is unchanged. */
  policyDate?: string;
};
export type AnnualTime = "past" | "current" | "future";
const validInstant = (s: string) => /T.*(?:Z|[+-]\d\d:\d\d)$/.test(s) && Number.isFinite(Date.parse(s));
export const annualPeriodTime = (start: string, end: string, now: string): AnnualTime => Date.parse(now) < Date.parse(start) ? "future" : Date.parse(now) >= Date.parse(end) ? "past" : "current";

/** Gate only canonical computed transit observations; never feed natal markers
 * into this adapter. Keep the raw extension including held facts in the packet. */
export function annualTransitMaterials(features: readonly MonthFeature[]) {
  const held: { observation: MonthFeature; reason: string }[] = [];
  const accepted = new Map<string, { feature: string; observations: MonthFeature[]; sourceRefs: string[] }>();
  for (const f of features) {
    const feature = f.kind === "lifeStage" ? `lifeStage:${f.label}` : f.kind === "relation" ? f.code : canonicalV4Feature(`shinsal:${f.code}`);
    const reason = /mangsin/i.test(feature + f.code) ? "AMBIGUOUS_MANGSIN_RULE" : /mungok|bokseong|cheoneui|banghap/i.test(feature + f.code) ? "UNSUPPORTED_TRANSIT"
      : !f.sourceRefs.some(r => r.startsWith("calendarMonths:")) || !f.basis.target.startsWith("month.") ? "NO_CANONICAL_TRANSIT_PROVENANCE" : null;
    if (reason) { held.push({ observation: f, reason }); continue; }
    const prior = accepted.get(feature);
    if (prior) { prior.observations.push(f); prior.sourceRefs = [...new Set([...prior.sourceRefs, f.id, ...f.sourceRefs])]; }
    else accepted.set(feature, { feature, observations: [f], sourceRefs: [f.id, ...f.sourceRefs] });
  }
  return { accepted: [...accepted.values()], held };
}

export async function annualNarrativeEvidence(payload: unknown, clock: AnnualClock) {
  if (!validInstant(clock.currentDate) || (clock.policyDate && !validInstant(clock.policyDate)))
    return { ok: false as const, errors: ["V4_ANNUAL_INPUT_AND_EXPLICIT_INSTANT_REQUIRED"] };
  const policyNow = () => new Date(clock.policyDate ?? clock.currentDate);
  const normalized = normalizeReportInputPayload(payload, { now: policyNow });
  if (!normalized.ok || normalized.value.kind !== "annualFortune")
    return { ok: false as const, errors: [normalized.ok ? "ANNUAL_INPUT_REQUIRED" : normalized.error] };
  const generated = await generateAnnualFortuneProductDraft(normalized.value, { now: policyNow, writer: { enabled: false } });
  if (!generated.ok) return { ok: false as const, errors: ["CANONICAL_ANNUAL_GENERATION_UNAVAILABLE"] };
  const raw = generated.evidencePacket as AnnualFortuneEvidencePacket;
  if (!raw.calendarMonths || raw.monthlyCalculationVersion !== "annual-month-jie-kst-v2")
    return { ok: false as const, errors: ["CANONICAL_ANNUAL_EVIDENCE_OR_YEAR_POLICY_UNAVAILABLE"] };
  const calendar = raw.calendarMonths, allSegments = calendar.flatMap(m => m.segments), monthly = extendAnnualMonthEvidence(raw);
  if (calendar.length !== 12 || calendar.some((m, i) => m.month !== i + 1 || !m.segments.length))
    return { ok: false as const, errors: ["CANONICAL_ANNUAL_COMPLETENESS_REQUIRED"] };
  const person = normalized.value, calculation = calculateAnnualFortuneSaju(person.person);
  const input: NarrativeInput = { name: person.person.name, mbti: person.person.mbtiType, calculation,
    context: { jobStatus: person.userContext.jobStatus, detailJob: person.userContext.detailJob, relationshipStatus: person.userContext.relationshipStatus } };
  const now = getAnnualFortuneSeoulDateParts(new Date(clock.currentDate)), year = raw.selectedYear;
  const months = calendar.map(month => {
    const focus = month.segments.find(s => annualPeriodTime(s.startKst, s.endKstExclusive, clock.currentDate) === "current")
      ?? month.segments.find(s => s.boundaryReason.some(b => b.startsWith("jie:"))) ?? month.segments[0];
    const extension = monthly.months.find(m => m.month === month.month)!.segments.find(s => s.startKst === focus.startKst)!;
    return { ...month, focus, extension, transit: annualTransitMaterials(extension.features), time: annualPeriodTime(month.startKst, month.endKstExclusive, clock.currentDate),
      sourceRefs: ["annual-month-jie-kst-v2", ...focus.evidenceIds, ...focus.relationFacts.map(f => f.id), `calendarMonths:${month.month}:${focus.startKst}`] };
  });
  const crossPeriods = (raw.annualReading ?? buildAnnualFortuneReading(raw)).crossPeriods.map(period => {
    const segment = annualSegmentAt(calendar, period.startKst)!;
    return { startKst: period.startKst, endKstExclusive: period.endKstExclusive, segment,
      time: annualPeriodTime(period.startKst, period.endKstExclusive, clock.currentDate),
      annualGod: getTenGodForStemPair(raw.dayMaster, segment.effectiveAnnualPillar.stem),
      cycles: segment.activeDayunContext.cycles.map(ref => {
        const cycle = raw.customerDayun!.cycles.find(c => c.index === ref.index)!;
        return { cycle, god: getTenGodForStemPair(raw.dayMaster, cycle.stem),
          flowGod: getTenGodForStemPair(cycle.stem, segment.effectiveAnnualPillar.stem),
          branchRelations: getBranchPairRelations(cycle.branch, segment.effectiveAnnualPillar.branch) };
      }),
      sourceRefs: [...period.evidenceIds, "annualFortuneReading:crossPeriods", "annualFortuneYearRules:getTenGodForStemPair", "annualFortuneYearRules:getBranchPairRelations"] };
  });
  // Projection of the existing canonical pair table, not a new stem rule.
  const annualStemRelations = Object.entries(calculation.pillars).flatMap(([position, pillar]) => pillar && (position !== "hour" || person.person.birthTimePrecision === "exact") && STEM_COMBINATIONS.some(([a, b]) =>
    (pillar.stem === a && raw.annualGanji.stem === b) || (pillar.stem === b && raw.annualGanji.stem === a))
    ? [{ position, natalStem: pillar.stem, annualStem: raw.annualGanji.stem, type: "천간합" as const, sourceRefs: ["saju/constants:STEM_COMBINATIONS", `natal:${position}:stem`, `annual:${year}:stem`] }] : []);
  return { ok: true as const, input, clock, currentYear: now.year, currentMonth: now.month, selectedYear: year,
    time: year < now.year ? "past" as const : year > now.year ? "future" as const : "current" as const,
    calculation, raw, monthly, months, crossPeriods, annualStemRelations, materials: buildMyeongliMaterialPacket(input),
    sourceRefs: ["annualFortuneGenerationHandler:generateAnnualFortuneProductDraft:writer-disabled", "annualFortuneEvidence:buildAnnualFortuneEvidence", "annual-month-jie-kst-v2", `annual:${year}`, `calendar:${calculation.calculationVersion}`],
    segments: allSegments };
}
export type AnnualEvidence = Extract<Awaited<ReturnType<typeof annualNarrativeEvidence>>, { ok: true }>;
export type AnnualMonthEvidence = AnnualEvidence["months"][number];
