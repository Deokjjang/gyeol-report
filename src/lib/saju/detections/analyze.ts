/** 원국 감지(analyzeChartDetections)와 유입 기둥 감지(analyzeIncoming). 순수 함수. */
import { HIDDEN_STEMS } from "../constants";
import { getTenGod } from "../tenGods";
import type { Pillar, SajuCalcResult } from "../types";
import { analyzeClimate } from "./climate";
import { detectExtraShinsal } from "./extraShinsal";
import { getGongmang } from "./gongmang";
import { detectRelations } from "./relations";
import { detectStructureFlows } from "./structureFlows";
import { judgeElementBalance } from "./elementBalance";
import { getTwelveStage } from "./twelveStages";
import {
  DETECTIONS_VERSION,
  type ChartDetections,
  type ChartPosition,
  type DetectionOptions,
  type GongmangDetection,
  type IncomingDetection,
  type PositionedPillar,
  type TemporalPosition,
} from "./types";

/** 시주가 감지에 들어가는가: 시간 미상이거나 시주가 없으면 false. */
export function isHourIncluded(saju: Pick<SajuCalcResult, "input" | "pillars">): boolean {
  return !saju.input.birthTimeUnknown && Boolean(saju.pillars.hour);
}

/** 원국 자리 목록(년·월·일·[시]). 시간 미상이면 시주를 넣지 않는다. */
export function natalEntries(saju: Pick<SajuCalcResult, "input" | "pillars">): PositionedPillar[] {
  const { year, month, day, hour } = saju.pillars;
  const entries: PositionedPillar[] = [
    { position: "year", pillar: year },
    { position: "month", pillar: month },
    { position: "day", pillar: day },
  ];
  if (hour && isHourIncluded(saju)) entries.push({ position: "hour", pillar: hour });
  return entries;
}

function gongmangFor(basis: "day" | "year", natal: readonly PositionedPillar[]): GongmangDetection {
  const self = natal.find((e) => e.position === basis);
  if (!self) throw new Error("gongmang basis pillar missing");
  const { xun, branches } = getGongmang(self.pillar);
  const positions = natal
    .filter((e) => e.position !== basis && branches.includes(e.pillar.branch))
    .map((e) => e.position as ChartPosition);
  return { basis, xun, branches, positions };
}

export function analyzeChartDetections(saju: SajuCalcResult, opts: DetectionOptions = {}): ChartDetections {
  const natal = natalEntries(saju);
  const relations = detectRelations(natal);
  const dayMaster = saju.pillars.day.stem;
  const gongmang = [gongmangFor("day", natal), ...(opts.gongmangBasis === "day+year" ? [gongmangFor("year", natal)] : [])];
  return {
    version: DETECTIONS_VERSION,
    hourIncluded: isHourIncluded(saju),
    relations,
    twelveStages: natal.map((e) => ({ position: e.position, branch: e.pillar.branch, stage: getTwelveStage(dayMaster, e.pillar.branch) })),
    climate: analyzeClimate(natal),
    gongmang,
    extraShinsal: detectExtraShinsal(natal, relations, gongmang),
    structureFlows: detectStructureFlows(saju),
    elementBalance: judgeElementBalance(natal),
  };
}

/** 대운·세운·월운 한 기둥 vs 원국. 관계는 유입 기둥이 구성원인 것만 남긴다. */
export function analyzeIncoming(saju: SajuCalcResult, position: TemporalPosition, pillar: Pillar): IncomingDetection {
  const natal = natalEntries(saju);
  const dayMaster = saju.pillars.day.stem;
  const relations = detectRelations([...natal, { position, pillar }]).filter((r) => r.members.some((m) => m.position === position));
  return {
    position,
    pillar,
    stemTenGod: getTenGod(dayMaster, pillar.stem),
    branchTenGod: getTenGod(dayMaster, HIDDEN_STEMS[pillar.branch][0].stem),
    relations,
    twelveStage: getTwelveStage(dayMaster, pillar.branch),
    gongmang: getGongmang(saju.pillars.day).branches.includes(pillar.branch),
  };
}
