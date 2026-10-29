/** 테스트용: 간지 문자열로 SajuCalcResult를 만든다(calculateSaju의 달력 단계만 건너뜀). */
import { analyzeFullElements, analyzeFullTenGods, analyzeVisibleYinYang } from "@/lib/saju/analyze";
import { detectShinsal } from "@/lib/saju/shinsal";
import { analyzeSajuStructure } from "@/lib/saju/structureAnalysis";
import type { PositionedPillar } from "@/lib/saju/detections/types";
import type { EarthlyBranch, Gender, HeavenlyStem, Pillar, SajuCalcResult } from "@/lib/saju/types";

export const P = (ganji: string): Pillar => ({ stem: ganji[0] as HeavenlyStem, branch: ganji[1] as EarthlyBranch });

/** "庚午 辛巳 庚辰 辛巳" 또는 시주 생략 "庚午 辛巳 庚辰". */
export function natalOf(text: string): PositionedPillar[] {
  const parts = text.trim().split(/\s+/);
  const positions = ["year", "month", "day", "hour"] as const;
  return parts.map((g, i) => ({ position: positions[i], pillar: P(g) }));
}

export function chartOf(text: string, opts: { gender?: Gender; timeUnknown?: boolean } = {}): SajuCalcResult {
  const [year, month, day, hour] = text.trim().split(/\s+/).map(P);
  const pillars = { year, month, day, ...(hour && !opts.timeUnknown ? { hour } : {}) };
  const tenGods = analyzeFullTenGods(pillars);
  const elements = analyzeFullElements(pillars);
  return {
    input: {
      birthDate: "2000-01-01",
      birthTimeUnknown: Boolean(opts.timeUnknown || !hour),
      calendarType: "SOLAR",
      gender: opts.gender ?? "FEMALE",
      timezone: "Asia/Seoul",
    },
    pillars,
    dayMaster: day.stem,
    tenGods,
    elements,
    yinYang: analyzeVisibleYinYang(pillars),
    relations: { stemCombinations: [], branchCombinations: [], branchClashes: [] },
    shinsal: detectShinsal(pillars),
    structureAnalysis: analyzeSajuStructure({ tenGods, elements }),
    notices: [],
  };
}
