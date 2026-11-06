/** 조후: 월지 계절 × 일간 → 필요 기운(CLIMATE_TABLE)과 충족 수준. 시간 미상이면 시주는 넘겨받지 않는다. */
import { BRANCH_MAIN_ELEMENT, HIDDEN_STEMS, STEM_ELEMENT } from "../constants";
import type { FiveElement, HeavenlyStem } from "../types";
import { CLIMATE_TABLE, SEASON_BY_BRANCH, type ClimateFacts, type ClimateNeedRow } from "./tables";
import type { ChartPosition, ClimateDetection, ClimateNeed, PositionedPillar } from "./types";

const ORDER: readonly ChartPosition[] = ["year", "month", "day", "hour"];

function foundAt(row: ClimateNeedRow, natal: readonly PositionedPillar[]): ChartPosition[] {
  const hits = new Set<ChartPosition>();
  for (const { position, pillar } of natal) {
    const p = position as ChartPosition;
    if (row.visible && p !== "day" && pillar.stem === row.stem) hits.add(p);
    if (row.branches.includes(pillar.branch)) hits.add(p);
  }
  return ORDER.filter((p) => hits.has(p));
}

/** natal: 원국 자리(년·월·일·[시]). 일간은 dayMaster로 따로 받는다. */
export function analyzeClimate(natal: readonly PositionedPillar[]): ClimateDetection {
  const day = natal.find((e) => e.position === "day");
  const month = natal.find((e) => e.position === "month");
  if (!day || !month) throw new Error("climate needs day and month pillars");
  const dayMaster = day.pillar.stem;
  const season = SEASON_BY_BRANCH[month.pillar.branch];
  const featureKey = `${dayMaster}:${season}` as const;
  const rule = CLIMATE_TABLE[featureKey];

  const otherStems = natal.filter((e) => e.position !== "day").map((e) => e.pillar.stem);
  const branchChars = natal.map((e) => e.pillar.branch);
  const needs: ClimateNeed[] = rule.needs.map((row) => ({ stem: row.stem, role: row.role, foundAt: foundAt(row, natal) }));
  const roleFound = (role: ClimateNeed["role"]) => needs.some((n) => n.role === role && n.foundAt.length > 0);
  const facts: ClimateFacts = {
    P: roleFound("primary"),
    S: roleFound("secondary"),
    U: roleFound("support"),
    month: month.pillar.branch,
    vis: (...stems: HeavenlyStem[]) => otherStems.some((s) => stems.includes(s)),
    br: (...branches) => branchChars.some((b) => branches.includes(b)),
    n: (...elements: FiveElement[]) =>
      otherStems.filter((s) => elements.includes(STEM_ELEMENT[s])).length +
      branchChars.filter((b) => elements.includes(BRANCH_MAIN_ELEMENT[b])).length,
    count: (stem) => otherStems.filter((s) => s === stem).length + branchChars.filter((b) => HIDDEN_STEMS[b][0].stem === stem).length,
  };

  const lacking = new Set<FiveElement>();
  for (const role of ["primary", "secondary"] as const) {
    const rows = needs.filter((n) => n.role === role);
    if (rows.length && !roleFound(role)) for (const r of rows) lacking.add(STEM_ELEMENT[r.stem]);
  }

  return {
    season,
    monthBranch: month.pillar.branch,
    dayMaster,
    featureKey,
    needs,
    level: rule.level(facts),
    lackingElements: [...lacking],
  };
}
