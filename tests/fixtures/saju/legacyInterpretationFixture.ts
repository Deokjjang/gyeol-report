import { evaluateSajuMbtiBridge } from "../../../src/lib/bridge/evaluate";
import { evaluateSajuMbtiSuggestion } from "../../../src/lib/mbti/sajuSuggestion";
import { getMbtiProfile } from "../../../src/lib/mbti/types";
import { analyzeFullElements, analyzeFullTenGods, analyzeVisibleYinYang } from "../../../src/lib/saju/analyze";
import { getDayPillarProfile } from "../../../src/lib/saju/dayPillarProfile";
import { extractSajuTags } from "../../../src/lib/saju/extractTags";
import { analyzeRelations } from "../../../src/lib/saju/relations";
import { detectShinsal } from "../../../src/lib/saju/shinsal";
import { analyzeSajuStructure } from "../../../src/lib/saju/structureAnalysis";
import type { SajuCalcResult } from "../../../src/lib/saju/types";

// Unversioned legacy output fixture ONLY, deliberately not a calendar golden.
// Existing narrative/rendering assertions must still cover old stored results;
// pipeline.test and canonicalCalendarGeneration.test cover corrected live input.
export function createLegacyInterpretationFixture() {
  const pillars = {
    year: { stem: "甲", branch: "辰" },
    month: { stem: "丙", branch: "寅" },
    day: { stem: "丙", branch: "申" },
    hour: { stem: "丁", branch: "酉" },
  } as const;
  const elements = analyzeFullElements(pillars);
  const tenGods = analyzeFullTenGods(pillars);
  const relations = analyzeRelations(pillars);
  const format = (value: { positions: readonly [string, string]; pair: readonly [string, string] }) =>
    `${value.positions[0]}-${value.positions[1]}:${value.pair[0]}${value.pair[1]}`;
  const saju: SajuCalcResult = {
    input: {
      birthDate: "2024-02-04", birthTime: "17:27", birthTimeUnknown: false,
      calendarType: "SOLAR", gender: "MALE", timezone: "Asia/Seoul",
    },
    pillars, dayMaster: "丙", elements, tenGods,
    yinYang: analyzeVisibleYinYang(pillars),
    relations: {
      stemCombinations: relations.stemCombinations.map(format),
      branchCombinations: relations.branchCombinations.map(format),
      branchClashes: relations.branchClashes.map(format),
    },
    shinsal: detectShinsal(pillars),
    structureAnalysis: analyzeSajuStructure({ elements, tenGods }),
    notices: [],
  };
  const sajuTags = extractSajuTags(saju);
  const mbti = getMbtiProfile("ENTJ");
  return {
    saju, sajuTags, mbti,
    bridgeSignals: evaluateSajuMbtiBridge({ sajuTags, mbtiProfile: mbti }).signals,
    mbtiSuggestion: evaluateSajuMbtiSuggestion({ sajuTags, userType: "ENTJ" }),
    dayPillarProfile: getDayPillarProfile("丙申"),
    structureAnalysis: saju.structureAnalysis,
  };
}
