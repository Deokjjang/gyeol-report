import "server-only";
import { composeAnnualFortuneNarrative } from "./annualComposer";
import { createTimeProductContext, type TimeProductPeriod } from "./timeProductContext";
import { reviewNarrative } from "./editorialGuard";
import type { AnnualClock } from "./annualEvidence";

export const ANNUAL_PRODUCT_VERSION = "annual-product-13d-7c-v1";
export async function buildV4AnnualProduct(payload: unknown, clock: AnnualClock) {
  const legacy = await composeAnnualFortuneNarrative(payload, clock);
  if (!legacy.ok) return legacy;
  const time = createTimeProductContext(legacy.evidence.input, ANNUAL_PRODUCT_VERSION);
  if (!time.ok) return time;
  const periods: TimeProductPeriod[] = [
    { id: "annual", label: `${legacy.evidence.selectedYear}년`, kind: "year", tenGod: legacy.evidence.raw.annualFortune.stemTenGod,
      sourceRefs: legacy.evidence.sourceRefs },
    ...legacy.months.map(m => ({ id: `month-${m.month}`, label: `${legacy.evidence.selectedYear}년 ${m.month}월`, kind: "month" as const,
      tenGod: m.god, sourceRefs: m.focus.evidenceIds })),
  ];
  const projections = periods.map(time.project), first = time.render(projections[0]);
  const additions = new Map(legacy.months.filter(m => m.plan.mbtiEligible && m.plan.depth !== "brief")
    .map(m => [m.month, time.render(projections.find(p => p.timePeriod.id === `month-${m.month}`)!)]));
  const opening = [...legacy.narrative.opening, ...(first ? [first] : [])];
  const sections = legacy.narrative.sections.map(s => {
    const blocks = s.blocks.filter(b => !/^month-\d+-behavior$/.test(b.id));
    const extra = additions.get(Number(s.id.replace("month-", "")));
    return { ...s, blocks: extra ? [...blocks, extra] : blocks };
  });
  const narrative = { ...legacy.narrative, opening, sections };
  return { ...legacy, narrative, writerVersion: ANNUAL_PRODUCT_VERSION, behaviorBasis: [],
    months: legacy.months.map(m => ({ ...m, behavior: null, blocks: sections.find(s => s.id === `month-${m.month}`)!.blocks })),
    editorial: reviewNarrative(narrative), integration: { version: ANNUAL_PRODUCT_VERSION, natalBuilds: time.natalBuilds,
      personalDigest: time.personalDigest, timeClaimSource: time.timeClaimSource, represented: time.represented,
      periods: projections.map(p => ({ period: p.timePeriod, activatedThemes: p.activatedThemes, opportunities: p.opportunities, pressures: p.pressures })) } };
}
export type AnnualProduct = Extract<Awaited<ReturnType<typeof buildV4AnnualProduct>>, { ok: true }>;
