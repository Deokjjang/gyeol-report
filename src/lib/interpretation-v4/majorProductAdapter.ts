import "server-only";
import { composeMajorFortuneNarrative } from "./majorComposer";
import { createTimeProductContext, type TimeProductPeriod } from "./timeProductContext";
import { reviewNarrative } from "./editorialGuard";

export const MAJOR_PRODUCT_VERSION = "major-product-13d-7c-v1";

/** Existing canonical horizon/writer runs once. The 13D natal core is a response
 * baseline, not a second calendar or a source of predicted events. */
export async function buildV4MajorProduct(payload: unknown, evaluatedAt: string) {
  const legacy = await composeMajorFortuneNarrative(payload, evaluatedAt);
  if (!legacy.ok) return legacy;
  const time = createTimeProductContext(legacy.evidence.input, MAJOR_PRODUCT_VERSION);
  if (!time.ok) return time;
  const active = legacy.evidence.horizon.activeCycle!;
  const periods: TimeProductPeriod[] = [
    { id: "current-dayun", label: `현재 ${active.ganji} 대운`, kind: "dayun", tenGod: active.tenGod,
      sourceRefs: [...legacy.evidence.sourceRefs, `dayun-cycle:${active.index}:${active.ganji}`, `period-ten-god:${active.tenGod}`] },
    ...legacy.years.map(y => ({ id: `year-${y.year}`, label: `${y.year}년`, kind: "year" as const, tenGod: y.annual.tenGod, sourceRefs: y.annual.evidenceIds })),
  ];
  const projections = periods.map(time.project);
  const first = time.render(projections[0]);
  const additions = new Map(legacy.years.filter(y => y.timePosition !== "past" && y.importance === "HIGH")
    .map(y => [y.year, time.render(projections.find(p => p.timePeriod.id === `year-${y.year}`)!)]));
  const opening = legacy.narrative.opening.filter(b => b.id !== "behavior-now");
  if (first) opening.push(first);
  const sections = legacy.narrative.sections.map(s => {
    const blocks = s.blocks.filter(b => b.id !== "behavior-next");
    const extra = additions.get(Number(s.id.replace("year-", "")));
    return { ...s, blocks: extra ? [...blocks, extra] : blocks };
  });
  const narrative = { ...legacy.narrative, opening, sections };
  return { ...legacy, narrative, writerVersion: MAJOR_PRODUCT_VERSION, behaviorBasis: [],
    years: legacy.years.map(y => ({ ...y, blocks: sections.find(s => s.id === `year-${y.year}`)!.blocks })),
    transitions: legacy.transitions.map(t => ({ ...t, blocks: sections.find(s => s.id === `transition-${t.year}`)!.blocks })),
    editorial: reviewNarrative(narrative), integration: { version: MAJOR_PRODUCT_VERSION, natalBuilds: time.natalBuilds,
      personalDigest: time.personalDigest, timeClaimSource: time.timeClaimSource, represented: time.represented,
      periods: projections.map(p => ({ period: p.timePeriod, activatedThemes: p.activatedThemes, opportunities: p.opportunities, pressures: p.pressures })) } };
}
export type MajorProduct = Extract<Awaited<ReturnType<typeof buildV4MajorProduct>>, { ok: true }>;
