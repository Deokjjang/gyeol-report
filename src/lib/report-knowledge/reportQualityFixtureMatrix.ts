import type { MbtiType } from "./mbtiKnowledgeTypes";
import type { ComputedSajuFacts } from "./sajuComputedFactsTypes";

export type ReportQualityFixture = {
  readonly id: string;
  readonly label: string;
  readonly mbti: MbtiType;
  readonly expectedPillars: {
    readonly year: string;
    readonly month: string;
    readonly day: string;
    readonly hour: string;
  };
  readonly expectedFeatureLabels: readonly string[];
  readonly qualityFocus: readonly string[];
  readonly sajuFacts: ComputedSajuFacts;
};

export type ReportSmokeFixtureId = "default" | "deokmin";

export const DEFAULT_REPORT_SMOKE_FIXTURE_ID = "default-smoke";
export const DEOKMIN_REPORT_SMOKE_FIXTURE_ID = "deokmin-external-manse";

const defaultSmokeFacts = {
  dayMaster: "갑",
  dayPillar: "갑신",
  yearPillar: "병자",
  monthPillar: "기해",
  hourPillar: "정미",
  heavenlyStems: ["丙", "己", "甲", "丁"],
  earthlyBranches: ["子", "亥", "申", "未"],
  fiveElementCounts: {
    wood: 2,
    fire: 0,
    earth: 4,
    metal: 2,
    water: 0,
  },
  excessiveElements: ["earth"],
  missingElements: ["fire", "water"],
  usefulElements: ["water", "wood"],
  tenGodSignals: [
    { tenGod: "pian_cai", strength: "strong" },
    { tenGod: "zheng_cai", strength: "present" },
    { tenGod: "zheng_guan", strength: "strong" },
    { tenGod: "qi_sha", strength: "strong" },
    { tenGod: "zheng_yin", strength: "missing" },
    { tenGod: "shi_shen", strength: "missing" },
  ],
  specialPatterns: ["jaeda_sinyak", "no_resource", "no_output"],
  sinsal: ["hyeonchim", "hongyeom", "gwimun", "wonjin"],
  gwiin: ["jaego"],
} as const satisfies ComputedSajuFacts;

const deokminExternalFacts = {
  dayMaster: "갑",
  dayPillar: "갑신",
  yearPillar: "기묘",
  monthPillar: "신미",
  hourPillar: "무진",
  heavenlyStems: ["己", "辛", "甲", "戊"],
  earthlyBranches: ["卯", "未", "申", "辰"],
  fiveElementCounts: {
    wood: 2,
    fire: 0,
    earth: 4,
    metal: 2,
    water: 0,
  },
  excessiveElements: ["earth"],
  missingElements: ["fire", "water"],
  usefulElements: ["water", "wood"],
  tenGodSignals: [
    { tenGod: "pian_cai", strength: "strong" },
    { tenGod: "zheng_cai", strength: "present" },
    { tenGod: "zheng_guan", strength: "strong" },
    { tenGod: "qi_sha", strength: "strong" },
    { tenGod: "zheng_yin", strength: "missing" },
    { tenGod: "shi_shen", strength: "missing" },
  ],
  specialPatterns: ["jaeda_sinyak", "no_resource", "no_output"],
  sinsal: ["hyeonchim", "hongyeom", "gwimun", "wonjin"],
  gwiin: ["jaego"],
} as const satisfies ComputedSajuFacts;

export const REPORT_QUALITY_FIXTURE_MATRIX = [
  {
    id: DEFAULT_REPORT_SMOKE_FIXTURE_ID,
    label: "Default smoke fixture",
    mbti: "ENTJ",
    expectedPillars: { year: "丙子", month: "己亥", day: "甲申", hour: "丁未" },
    expectedFeatureLabels: [
      "갑신일주",
      "현침살",
      "홍염살",
      "귀문관살",
      "원진살",
      "재고귀인",
    ],
    qualityFocus: ["work", "money", "growth", "positive", "mixed", "warning"],
    sajuFacts: defaultSmokeFacts,
  },
  {
    id: DEOKMIN_REPORT_SMOKE_FIXTURE_ID,
    label: "Deokmin external manse parity fixture",
    mbti: "ENTJ",
    expectedPillars: { year: "己卯", month: "辛未", day: "甲申", hour: "戊辰" },
    expectedFeatureLabels: [
      "갑신일주",
      "장성살",
      "천을귀인",
      "암록",
      "공망",
      "천문성",
    ],
    qualityFocus: ["work", "relationship", "growth", "positive", "mixed", "warning"],
    sajuFacts: deokminExternalFacts,
  },
  {
    id: "reflective-water-infp",
    label: "Deep reflection fixture",
    mbti: "INFP",
    expectedPillars: { year: "癸酉", month: "辛亥", day: "癸卯", hour: "壬子" },
    expectedFeatureLabels: ["계묘일주", "수 과다", "정인", "화 부족", "화개살"],
    qualityFocus: ["love", "study", "growth", "mixed"],
    sajuFacts: {
      dayMaster: "계",
      dayPillar: "계묘",
      yearPillar: "계유",
      monthPillar: "신해",
      hourPillar: "임자",
      heavenlyStems: ["癸", "辛", "癸", "壬"],
      earthlyBranches: ["酉", "亥", "卯", "子"],
      fiveElementCounts: { wood: 2, fire: 0, earth: 0, metal: 2, water: 5 },
      excessiveElements: ["water"],
      missingElements: ["fire"],
      usefulElements: ["fire", "earth"],
      tenGodSignals: [
        { tenGod: "bijian", strength: "strong" },
        { tenGod: "zheng_yin", strength: "strong" },
      ],
      specialPatterns: ["water_excess_floats_wood"],
      sinsal: ["hwagae"],
      gwiin: ["munchang"],
    },
  },
  {
    id: "expressive-fire-enfp",
    label: "Expressive fire-heavy fixture",
    mbti: "ENFP",
    expectedPillars: { year: "甲午", month: "丙午", day: "丙午", hour: "丁巳" },
    expectedFeatureLabels: ["병오일주", "화 과다", "식신", "도화살"],
    qualityFocus: ["personality", "love", "environment", "mixed"],
    sajuFacts: {
      dayMaster: "병",
      dayPillar: "병오",
      yearPillar: "갑오",
      monthPillar: "병오",
      hourPillar: "정사",
      heavenlyStems: ["甲", "丙", "丙", "丁"],
      earthlyBranches: ["午", "午", "午", "巳"],
      fiveElementCounts: { wood: 1, fire: 6, earth: 1, metal: 0, water: 0 },
      excessiveElements: ["fire"],
      missingElements: ["metal", "water"],
      usefulElements: ["water", "metal"],
      tenGodSignals: [
        { tenGod: "bijian", strength: "strong" },
        { tenGod: "shi_shen", strength: "present" },
      ],
      specialPatterns: ["wood_excess_feeds_fire"],
      sinsal: ["dohwa", "hongyeom"],
      gwiin: ["taegeuk"],
    },
  },
  {
    id: "responsibility-earth-istj",
    label: "Strong responsibility fixture",
    mbti: "ISTJ",
    expectedPillars: { year: "戊辰", month: "己未", day: "戊辰", hour: "辛丑" },
    expectedFeatureLabels: ["무진일주", "토 과다", "정관", "장성살"],
    qualityFocus: ["work", "family", "growth", "warning"],
    sajuFacts: {
      dayMaster: "무",
      dayPillar: "무진",
      yearPillar: "무진",
      monthPillar: "기미",
      hourPillar: "신축",
      heavenlyStems: ["戊", "己", "戊", "辛"],
      earthlyBranches: ["辰", "未", "辰", "丑"],
      fiveElementCounts: { wood: 0, fire: 0, earth: 6, metal: 2, water: 0 },
      excessiveElements: ["earth"],
      missingElements: ["wood", "fire", "water"],
      usefulElements: ["wood", "water"],
      tenGodSignals: [
        { tenGod: "bijian", strength: "strong" },
        { tenGod: "shang_guan", strength: "present" },
      ],
      specialPatterns: ["earth_excess_buries_metal"],
      sinsal: ["jangseong"],
      gwiin: ["cheon_eul"],
    },
  },
  {
    id: "precision-metal-intj",
    label: "Metal precision fixture",
    mbti: "INTJ",
    expectedPillars: { year: "庚申", month: "辛酉", day: "辛酉", hour: "庚子" },
    expectedFeatureLabels: ["신유일주", "금 과다", "현침살", "문창귀인"],
    qualityFocus: ["work", "study", "growth", "mixed"],
    sajuFacts: {
      dayMaster: "신",
      dayPillar: "신유",
      yearPillar: "경신",
      monthPillar: "신유",
      hourPillar: "경자",
      heavenlyStems: ["庚", "辛", "辛", "庚"],
      earthlyBranches: ["申", "酉", "酉", "子"],
      fiveElementCounts: { wood: 0, fire: 0, earth: 1, metal: 6, water: 1 },
      excessiveElements: ["metal"],
      missingElements: ["wood", "fire"],
      usefulElements: ["fire", "wood"],
      tenGodSignals: [
        { tenGod: "bijian", strength: "strong" },
        { tenGod: "zheng_yin", strength: "present" },
      ],
      specialPatterns: ["metal_excess_cuts_wood"],
      sinsal: ["hyeonchim"],
      gwiin: ["munchang"],
    },
  },
  {
    id: "growth-wood-infj",
    label: "Wood growth fixture",
    mbti: "INFJ",
    expectedPillars: { year: "乙卯", month: "甲寅", day: "乙巳", hour: "癸卯" },
    expectedFeatureLabels: ["을사일주", "목 과다", "편인", "천문성"],
    qualityFocus: ["personality", "study", "growth", "mixed"],
    sajuFacts: {
      dayMaster: "을",
      dayPillar: "을사",
      yearPillar: "을묘",
      monthPillar: "갑인",
      hourPillar: "계묘",
      heavenlyStems: ["乙", "甲", "乙", "癸"],
      earthlyBranches: ["卯", "寅", "巳", "卯"],
      fiveElementCounts: { wood: 6, fire: 1, earth: 0, metal: 0, water: 1 },
      excessiveElements: ["wood"],
      missingElements: ["earth", "metal"],
      usefulElements: ["metal", "earth"],
      tenGodSignals: [
        { tenGod: "bijian", strength: "strong" },
        { tenGod: "pian_yin", strength: "present" },
      ],
      specialPatterns: ["wood_excess_feeds_fire"],
      sinsal: ["cheonmun", "dohwa"],
      gwiin: ["munchang"],
    },
  },
  {
    id: "attraction-relationship-esfp",
    label: "Relationship attraction fixture",
    mbti: "ESFP",
    expectedPillars: { year: "丁卯", month: "乙酉", day: "丁亥", hour: "丙午" },
    expectedFeatureLabels: ["정해일주", "도화살", "홍염살", "화 부족"],
    qualityFocus: ["love", "relationship", "environment", "positive", "mixed"],
    sajuFacts: {
      dayMaster: "정",
      dayPillar: "정해",
      yearPillar: "정묘",
      monthPillar: "을유",
      hourPillar: "병오",
      heavenlyStems: ["丁", "乙", "丁", "丙"],
      earthlyBranches: ["卯", "酉", "亥", "午"],
      fiveElementCounts: { wood: 2, fire: 3, earth: 0, metal: 1, water: 1 },
      excessiveElements: ["fire"],
      missingElements: ["earth"],
      usefulElements: ["earth", "water"],
      tenGodSignals: [
        { tenGod: "bijian", strength: "present" },
        { tenGod: "zheng_yin", strength: "present" },
      ],
      specialPatterns: [],
      sinsal: ["dohwa", "hongyeom"],
      gwiin: ["cheon_deok"],
    },
  },
  {
    id: "study-writing-isfj",
    label: "Study and writing fixture",
    mbti: "ISFJ",
    expectedPillars: { year: "壬寅", month: "癸卯", day: "壬子", hour: "甲辰" },
    expectedFeatureLabels: ["임자일주", "문창귀인", "학당귀인", "수 과다"],
    qualityFocus: ["study", "family", "growth", "positive"],
    sajuFacts: {
      dayMaster: "임",
      dayPillar: "임자",
      yearPillar: "임인",
      monthPillar: "계묘",
      hourPillar: "갑진",
      heavenlyStems: ["壬", "癸", "壬", "甲"],
      earthlyBranches: ["寅", "卯", "子", "辰"],
      fiveElementCounts: { wood: 3, fire: 0, earth: 1, metal: 0, water: 4 },
      excessiveElements: ["water"],
      missingElements: ["fire", "metal"],
      usefulElements: ["fire", "earth"],
      tenGodSignals: [
        { tenGod: "bijian", strength: "strong" },
        { tenGod: "shi_shen", strength: "present" },
      ],
      specialPatterns: ["water_excess_floats_wood"],
      sinsal: ["hwagae"],
      gwiin: ["munchang"],
    },
  },
  {
    id: "money-resource-estp",
    label: "Money resource fixture",
    mbti: "ESTP",
    expectedPillars: { year: "庚申", month: "戊辰", day: "庚申", hour: "甲申" },
    expectedFeatureLabels: ["경신일주", "편재", "정재", "재고귀인"],
    qualityFocus: ["money", "work", "positive", "mixed"],
    sajuFacts: {
      dayMaster: "경",
      dayPillar: "경신",
      yearPillar: "경신",
      monthPillar: "무진",
      hourPillar: "갑신",
      heavenlyStems: ["庚", "戊", "庚", "甲"],
      earthlyBranches: ["申", "辰", "申", "申"],
      fiveElementCounts: { wood: 1, fire: 0, earth: 2, metal: 5, water: 0 },
      excessiveElements: ["metal"],
      missingElements: ["fire", "water"],
      usefulElements: ["fire", "water"],
      tenGodSignals: [
        { tenGod: "pian_cai", strength: "strong" },
        { tenGod: "zheng_cai", strength: "present" },
      ],
      specialPatterns: ["jaesaenggwan"],
      sinsal: ["yeokma"],
      gwiin: ["jaego"],
    },
  },
  {
    id: "warning-mixed-entp",
    label: "Warning mixed feature fixture",
    mbti: "ENTP",
    expectedPillars: { year: "庚戌", month: "壬辰", day: "庚戌", hour: "庚辰" },
    expectedFeatureLabels: ["경술일주", "괴강살", "백호대살", "공망"],
    qualityFocus: ["personality", "work", "growth", "warning", "mixed"],
    sajuFacts: {
      dayMaster: "경",
      dayPillar: "경술",
      yearPillar: "경술",
      monthPillar: "임진",
      hourPillar: "경진",
      heavenlyStems: ["庚", "壬", "庚", "庚"],
      earthlyBranches: ["戌", "辰", "戌", "辰"],
      fiveElementCounts: { wood: 0, fire: 0, earth: 3, metal: 4, water: 1 },
      excessiveElements: ["metal"],
      missingElements: ["wood", "fire"],
      usefulElements: ["fire", "wood"],
      tenGodSignals: [
        { tenGod: "bijian", strength: "strong" },
        { tenGod: "shang_guan", strength: "present" },
      ],
      specialPatterns: ["metal_excess_cuts_wood"],
      sinsal: ["goegang", "baekho"],
      gwiin: ["taegeuk"],
    },
  },
  {
    id: "balanced-baseline-estj",
    label: "Balanced baseline fixture",
    mbti: "ESTJ",
    expectedPillars: { year: "己丑", month: "丁卯", day: "己亥", hour: "辛未" },
    expectedFeatureLabels: ["기해일주", "정관", "정인", "천을귀인"],
    qualityFocus: ["work", "family", "growth", "positive"],
    sajuFacts: {
      dayMaster: "기",
      dayPillar: "기해",
      yearPillar: "기축",
      monthPillar: "정묘",
      hourPillar: "신미",
      heavenlyStems: ["己", "丁", "己", "辛"],
      earthlyBranches: ["丑", "卯", "亥", "未"],
      fiveElementCounts: { wood: 2, fire: 1, earth: 3, metal: 1, water: 1 },
      excessiveElements: [],
      missingElements: [],
      usefulElements: ["wood", "fire"],
      tenGodSignals: [
        { tenGod: "zheng_guan", strength: "present" },
        { tenGod: "zheng_yin", strength: "present" },
      ],
      specialPatterns: [],
      sinsal: ["jangseong"],
      gwiin: ["cheon_eul"],
    },
  },
  {
    id: "quiet-sensitivity-isfp",
    label: "Quiet sensitivity fixture",
    mbti: "ISFP",
    expectedPillars: { year: "乙未", month: "癸未", day: "乙巳", hour: "丁亥" },
    expectedFeatureLabels: ["을사일주", "화 부족", "홍염살", "원진살"],
    qualityFocus: ["love", "relationship", "growth", "mixed"],
    sajuFacts: {
      dayMaster: "을",
      dayPillar: "을사",
      yearPillar: "을미",
      monthPillar: "계미",
      hourPillar: "정해",
      heavenlyStems: ["乙", "癸", "乙", "丁"],
      earthlyBranches: ["未", "未", "巳", "亥"],
      fiveElementCounts: { wood: 2, fire: 2, earth: 2, metal: 0, water: 2 },
      excessiveElements: [],
      missingElements: ["metal"],
      usefulElements: ["metal", "water"],
      tenGodSignals: [
        { tenGod: "pian_yin", strength: "present" },
        { tenGod: "shi_shen", strength: "present" },
      ],
      specialPatterns: [],
      sinsal: ["hongyeom", "wonjin"],
      gwiin: ["cheon_deok"],
    },
  },
] as const satisfies readonly ReportQualityFixture[];

export function getReportQualityFixtureById(
  fixtureId: string,
): ReportQualityFixture | undefined {
  return REPORT_QUALITY_FIXTURE_MATRIX.find((fixture) => fixture.id === fixtureId);
}

export function getReportSmokeFixture(
  fixtureId: ReportSmokeFixtureId,
): ReportQualityFixture {
  return fixtureId === "deokmin"
    ? REPORT_QUALITY_FIXTURE_MATRIX[1]
    : REPORT_QUALITY_FIXTURE_MATRIX[0];
}

export function getReportSmokeFixtureIdFromArgs(
  argv: readonly string[],
): ReportSmokeFixtureId {
  const fixtureFlagIndex = argv.findIndex((arg) => arg === "--fixture");
  const inlineFixtureArg = argv.find((arg) => arg.startsWith("--fixture="));
  const fixtureValue = inlineFixtureArg?.split("=")[1] ??
    (fixtureFlagIndex >= 0 ? argv[fixtureFlagIndex + 1] : undefined);

  if (fixtureValue === "deokmin") {
    return "deokmin";
  }

  return "default";
}
