import { createMajorFortuneV3 } from "../report-generation/majorFortuneV3Generation";
import { normalizeReportInputPayload } from "../report-generation/reportInputAdapter";
import { calculateMajorFortuneSaju } from "../report-generation/majorFortuneGenerationHandler";
import { buildMajorFortuneDecadeReading } from "../report-knowledge/majorFortuneDecadeReading";
import { getTenGodForStemPair } from "../report-knowledge/annualFortuneYearRules";
import { buildMyeongliMaterialPacket } from "./materialPacket";
import type { NarrativeInput } from "./narrativeTypes";

/** Read-only reuse of the production 14-year window and exact/ranged boundaries.
 * The existing entry point explicitly disables its writer. No V3 prose enters
 * the V4 packet; no calendar, transition or luck calculation is duplicated. */
export async function majorNarrativeEvidence(payload: unknown, evaluatedAt: string) {
  const normalized = normalizeReportInputPayload(payload), instant = Date.parse(evaluatedAt);
  if (!normalized.ok || normalized.value.kind !== "majorFortune" || !Number.isFinite(instant) || !/T.*(?:Z|[+-]\d\d:\d\d)$/.test(evaluatedAt))
    return { ok: false as const, errors: ["V4_MAJOR_INPUT_AND_EXPLICIT_INSTANT_REQUIRED"] };
  const generated = await createMajorFortuneV3(payload, { now: () => new Date(instant) });
  if (!generated?.draft.horizon || generated.draft.editorialYears.length !== 14)
    return { ok: false as const, errors: ["CANONICAL_MAJOR_HORIZON_UNAVAILABLE"] };
  const base = generated.evidencePacket, horizon = generated.draft.horizon, input = normalized.value;
  const calculation = calculateMajorFortuneSaju(input.person);
  const context: NarrativeInput = { calculation, name: input.person.name, mbti: input.person.mbtiType,
    context: { jobStatus: input.userContext.jobStatus, detailJob: input.userContext.detailJob, relationshipStatus: input.userContext.relationshipStatus } };
  const cycles = base.customerDayun!.cycles;
  const readings = cycles.filter(c => c.endYear >= horizon.from && c.startYear <= horizon.through).flatMap(cycle =>
    buildMajorFortuneDecadeReading({ ...base, currentCycle: cycle, currentYear: Math.max(cycle.startYear, Math.min(base.currentYear, cycle.endYear)),
      majorTenGod: { ...base.majorTenGod, stemTenGod: getTenGodForStemPair(base.dayMaster, cycle.stem) },
      previousCycle: cycles.find(c => c.index === cycle.index - 1), nextCycle: cycles.find(c => c.index === cycle.index + 1),
    }).years);
  if (horizon.rows.some(row => !readings.some(year => year.year === row.year)))
    return { ok: false as const, errors: ["CANONICAL_MAJOR_YEAR_EVIDENCE_UNAVAILABLE"] };
  return { ok: true as const, input: context, calculation, materials: buildMyeongliMaterialPacket(context),
    evaluatedAt: new Date(instant).toISOString(), currentYear: horizon.currentYear,
    horizon: { from: horizon.from, through: horizon.through, activeCycle: horizon.activeCycle, evaluatedAtKst: horizon.evaluatedAtKst,
      transitions: horizon.transitions.map(t => ({ year: t.year, dateLabel: t.dateLabel, startSolarKst: t.startSolarKst, startSolarRange: t.startSolarRange, before: t.before, after: t.after })),
      rows: horizon.rows },
    years: horizon.rows.map(row => ({ ...row, annual: readings.find(y => y.year === row.year)!,
      age: base.currentAge + row.year - base.currentYear,
      timePosition: row.year < base.currentYear ? "past" as const : row.year === base.currentYear ? "current" as const : "future" as const })),
    precision: base.customerDayun!.precision, dayunSelection: base.dayunSelection,
    sourceRefs: ["majorFortuneV3Generation:createMajorFortuneV3:writer-disabled", "majorFortuneHorizon:14-year-window", "majorFortuneDecadeReading:major-decade-v2", `calendar:${calculation.calculationVersion}`, `dayun:${base.customerDayun!.calculationVersion}`],
  };
}
export type MajorEvidence = Extract<Awaited<ReturnType<typeof majorNarrativeEvidence>>, { ok: true }>;
export type MajorYearEvidence = MajorEvidence["years"][number];
