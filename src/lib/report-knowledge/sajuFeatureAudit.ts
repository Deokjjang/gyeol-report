import {
  SAJU_FEATURE_EXTRACTION_RULESET_VERSION,
  baekhoDayPillars,
  getTwelveSinsalGroup,
  normalizeBranch,
  normalizeGanji,
  normalizeStem,
  twelveSinsalFeatureByGroup,
  type NormalizedBranch,
  type NormalizedGanji,
  type NormalizedStem,
} from "./sajuFeatureExtractionRules";
import {
  extractComputedSajuFeatures,
  type ComputedSajuFeatureExtractionInput,
  type ComputedSajuFeatureExtractionResult,
} from "./sajuComputedFeatureExtractor";
import { requireSajuFeatureEntry } from "./sajuFeatureTaxonomy";
import { calculateSaju } from "../saju/calculateSaju";
import {
  createExternalFixturePlacement,
  type SajuPillarFeaturePlacement,
} from "./sajuPillarFeaturePlacement";

type PillarRole = "yearPillar" | "monthPillar" | "dayPillar" | "hourPillar";

type BasisRole = "yearBranch" | "monthBranch" | "dayBranch" | "hourBranch";

type SajuAuditFixtureId = "default" | "deokmin" | "sodam-intp";

export type SajuAuditFixture = {
  readonly fixtureId: SajuAuditFixtureId;
  readonly auditLabel: string;
  readonly input: ComputedSajuFeatureExtractionInput;
  readonly expectedPillars: {
    readonly year: string;
    readonly month: string;
    readonly day: string;
    readonly hour: string;
  };
  readonly birthDate?: string;
  readonly calendar?: "solar";
  readonly birthTime?: string;
  readonly timezone?: "Asia/Seoul";
  readonly gender?: "male" | "female";
  readonly externalPlacements?: readonly SajuPillarFeaturePlacement[];
};

export type SajuExternalManseParityResult = {
  readonly fixtureId: SajuAuditFixtureId;
  readonly expectedPillars: SajuAuditFixture["expectedPillars"];
  readonly calculatedPillars?: SajuAuditFixture["expectedPillars"];
  readonly calculatorAvailable: boolean;
  readonly calculatorNote?: string;
  readonly parity: readonly {
    readonly pillar: "year" | "month" | "day" | "hour";
    readonly ok: boolean;
    readonly expected: string;
    readonly calculated?: string;
  }[];
};

export type RuleTableMeta = {
  readonly ruleId: string;
  readonly label: string;
  readonly basis: "day_pillar" | "any_pillar" | "stem_branch_pair";
  readonly notes: string;
};

export type SajuFeatureAuditResult = {
  readonly ruleSetVersion: typeof SAJU_FEATURE_EXTRACTION_RULESET_VERSION;
  readonly pillars: {
    readonly yearPillar?: string;
    readonly monthPillar?: string;
    readonly dayPillar?: string;
    readonly hourPillar?: string;
    readonly heavenlyStems: readonly string[];
    readonly earthlyBranches: readonly string[];
    readonly dayMaster?: string;
    readonly dayBranch?: string;
  };
  readonly detected: readonly {
    readonly featureId: string;
    readonly labelKo: string;
    readonly category: string;
    readonly basis: string;
    readonly matchedBy: string;
    readonly confidence: "computed" | "existing_fact" | "derived";
  }[];
  readonly twelveSinsalByBasis: readonly {
    readonly basis: BasisRole;
    readonly branch?: string;
    readonly detected: readonly {
      readonly featureId: string;
      readonly labelKo: string;
    }[];
  }[];
  readonly ruleTableChecks: readonly {
    readonly meta: RuleTableMeta;
    readonly checked: readonly {
      readonly pillarRole: PillarRole;
      readonly pillar?: string;
      readonly matched: boolean;
      readonly productionEligible: boolean;
    }[];
  }[];
  readonly watchedNotDetected: readonly {
    readonly labelKo: string;
    readonly expectedFeatureIds: readonly string[];
    readonly checkedRules: readonly string[];
    readonly note: string;
  }[];
};

export const DEFAULT_SMOKE_SAJU_FIXTURE = {
  fixtureId: "default",
  auditLabel: "default-smoke",
  expectedPillars: {
    year: "丙子",
    month: "己亥",
    day: "甲申",
    hour: "丁未",
  },
  input: {
    dayMaster: "甲",
    dayPillar: "甲申",
    yearPillar: "丙子",
    monthPillar: "己亥",
    hourPillar: "丁未",
    fiveElementCounts: {
      wood: 2,
      fire: 0,
      earth: 4,
      metal: 2,
      water: 0,
    },
    excessiveElements: ["earth"],
    missingElements: ["fire", "water"],
    tenGodSignals: [
      { tenGod: "pian_cai", strength: "strong" },
      { tenGod: "zheng_cai", strength: "present" },
      { tenGod: "zheng_guan", strength: "strong" },
      { tenGod: "qi_sha", strength: "strong" },
      { tenGod: "zheng_yin", strength: "missing" },
      { tenGod: "shi_shen", strength: "missing" },
    ],
    specialPatterns: ["jaeda_sinyak", "no_resource", "no_output"],
    existingSinsal: ["hyeonchim", "hongyeom", "gwimun", "wonjin"],
    existingGwiin: ["jaego"],
  },
} as const satisfies SajuAuditFixture;

export const DEOKMIN_EXTERNAL_MANSE_FIXTURE = {
  fixtureId: "deokmin",
  auditLabel: "deokmin-external-manse",
  birthDate: "1999-07-31",
  calendar: "solar",
  birthTime: "07:30",
  timezone: "Asia/Seoul",
  gender: "male",
  expectedPillars: {
    year: "己卯",
    month: "辛未",
    day: "甲申",
    hour: "戊辰",
  },
  input: {
    dayMaster: "甲",
    dayPillar: "甲申",
    yearPillar: "己卯",
    monthPillar: "辛未",
    hourPillar: "戊辰",
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
    tenGodSignals: [
      { tenGod: "pian_cai", strength: "strong" },
      { tenGod: "zheng_cai", strength: "present" },
      { tenGod: "zheng_guan", strength: "strong" },
      { tenGod: "qi_sha", strength: "strong" },
      { tenGod: "zheng_yin", strength: "missing" },
      { tenGod: "shi_shen", strength: "missing" },
    ],
    specialPatterns: ["jaeda_sinyak", "no_resource", "no_output"],
    existingSinsal: ["hyeonchim", "hongyeom", "gwimun", "wonjin"],
    existingGwiin: ["jaego"],
  },
  externalPlacements: [
    createExternalFixturePlacement({
      featureId: "twelve_sinsal_banan",
      pillar: "hour",
      sourcePillar: "戊辰",
      basis: "external fixture visual comparison: 시주 십이신살",
    }),
    createExternalFixturePlacement({
      featureId: "sinsal_baekho",
      labelKo: "백호살",
      pillar: "hour",
      sourcePillar: "戊辰",
      basis: "external fixture visual comparison: 시주 신살",
    }),
    createExternalFixturePlacement({
      featureId: "twelve_sinsal_hwagae",
      pillar: "month",
      sourcePillar: "辛未",
      basis: "external fixture visual comparison: 월주 십이신살",
    }),
    createExternalFixturePlacement({
      featureId: "twelve_sinsal_jangseong",
      pillar: "year",
      sourcePillar: "己卯",
      basis: "external fixture visual comparison: 연주 십이신살",
    }),
    createExternalFixturePlacement({
      featureId: "gwiin_cheoneul",
      pillar: "month",
      sourcePillar: "辛未",
      basis: "external fixture visual comparison: 월주 귀인",
    }),
  ],
} as const satisfies SajuAuditFixture;

export const SODAM_INTP_MANSE_FIXTURE = {
  fixtureId: "sodam-intp",
  auditLabel: "sodam-intp",
  birthDate: "1996-12-06",
  calendar: "solar",
  birthTime: "14:15",
  timezone: "Asia/Seoul",
  gender: "female",
  expectedPillars: {
    year: "丙子",
    month: "己亥",
    day: "丁丑",
    hour: "丁未",
  },
  input: {
    dayMaster: "丁",
    dayPillar: "丁丑",
    yearPillar: "丙子",
    monthPillar: "己亥",
    hourPillar: "丁未",
    heavenlyStems: ["丙", "己", "丁", "丁"],
    earthlyBranches: ["子", "亥", "丑", "未"],
    fiveElementCounts: {
      wood: 0,
      fire: 3,
      earth: 3,
      metal: 0,
      water: 2,
    },
    excessiveElements: ["fire", "earth"],
    missingElements: ["wood", "metal"],
    tenGodSignals: [
      { tenGod: "bijian", strength: "strong" },
      { tenGod: "shi_shen", strength: "strong" },
      { tenGod: "qi_sha", strength: "present" },
      { tenGod: "zheng_guan", strength: "present" },
      { tenGod: "zheng_yin", strength: "missing" },
    ],
    specialPatterns: ["no_resource"],
    existingSinsal: [],
    existingGwiin: [],
  },
} as const satisfies SajuAuditFixture;

export function getSajuAuditFixture(fixtureId: SajuAuditFixtureId): SajuAuditFixture {
  if (fixtureId === "deokmin") {
    return DEOKMIN_EXTERNAL_MANSE_FIXTURE;
  }
  if (fixtureId === "sodam-intp") {
    return SODAM_INTP_MANSE_FIXTURE;
  }

  return DEFAULT_SMOKE_SAJU_FIXTURE;
}

const watchedFeatures = [
  {
    labelKo: "반안살",
    expectedFeatureIds: ["twelve_sinsal_banan"],
    checkedRules: [
      "production V1 dayBranch fallback yearBranch",
      "yearBranch basis audit",
      "monthBranch basis audit",
      "dayBranch basis audit",
      "hourBranch basis audit",
    ],
  },
  {
    labelKo: "백호대살",
    expectedFeatureIds: ["sinsal_baekho"],
    checkedRules: ["baekho V1 day-pillar table", "baekho all-four-pillars audit table"],
  },
  {
    labelKo: "문창귀인",
    expectedFeatureIds: ["gwiin_munchang"],
    checkedRules: ["dayMaster + branch V1 table"],
  },
  {
    labelKo: "금여록",
    expectedFeatureIds: ["gwiin_geumyeorok"],
    checkedRules: ["dayMaster + branch V1 table"],
  },
  {
    labelKo: "도화살",
    expectedFeatureIds: ["sinsal_dohwa"],
    checkedRules: ["dayBranch group + chart branches V1 table"],
  },
  {
    labelKo: "역마살",
    expectedFeatureIds: ["twelve_sinsal_yeokma"],
    checkedRules: [
      "production V1 dayBranch fallback yearBranch",
      "yearBranch basis audit",
      "monthBranch basis audit",
      "dayBranch basis audit",
      "hourBranch basis audit",
    ],
  },
  {
    labelKo: "화개살",
    expectedFeatureIds: ["twelve_sinsal_hwagae"],
    checkedRules: [
      "production V1 dayBranch fallback yearBranch",
      "yearBranch basis audit",
      "monthBranch basis audit",
      "dayBranch basis audit",
      "hourBranch basis audit",
    ],
  },
  {
    labelKo: "천을귀인",
    expectedFeatureIds: ["gwiin_cheoneul"],
    checkedRules: ["dayMaster + branch V1 table"],
  },
  {
    labelKo: "암록",
    expectedFeatureIds: ["gwiin_amrok"],
    checkedRules: ["dayMaster + branch V1 table"],
  },
  {
    labelKo: "장성살",
    expectedFeatureIds: ["twelve_sinsal_jangseong"],
    checkedRules: [
      "production V1 dayBranch fallback yearBranch",
      "yearBranch basis audit",
      "monthBranch basis audit",
      "dayBranch basis audit",
      "hourBranch basis audit",
    ],
  },
] as const;

function uniqueValues<T extends string>(values: readonly (T | undefined)[]): readonly T[] {
  return [...new Set(values.filter((value): value is T => value !== undefined))];
}

function normalizePillars(input: ComputedSajuFeatureExtractionInput): Record<PillarRole, NormalizedGanji | undefined> {
  return {
    yearPillar: normalizeGanji(input.yearPillar),
    monthPillar: normalizeGanji(input.monthPillar),
    dayPillar: normalizeGanji(input.dayPillar),
    hourPillar: normalizeGanji(input.hourPillar),
  };
}

function getDisplayPillar(
  rawPillar: string | undefined,
  normalizedPillar: NormalizedGanji | undefined,
): string | undefined {
  if (rawPillar !== undefined && normalizeGanji(rawPillar) !== undefined) {
    return rawPillar.trim();
  }

  return normalizedPillar;
}

function getDisplayStem(input: {
  readonly rawPillar?: string;
  readonly normalizedPillar?: NormalizedGanji;
  readonly fallbackStem?: NormalizedStem;
}): string | undefined {
  if (input.rawPillar !== undefined && normalizeGanji(input.rawPillar) !== undefined) {
    return input.rawPillar.trim().slice(0, 1);
  }

  return input.fallbackStem ?? getPillarStem(input.normalizedPillar);
}

function getDisplayBranch(input: {
  readonly rawPillar?: string;
  readonly normalizedPillar?: NormalizedGanji;
  readonly fallbackBranch?: NormalizedBranch;
}): string | undefined {
  if (input.rawPillar !== undefined && normalizeGanji(input.rawPillar) !== undefined) {
    return input.rawPillar.trim().slice(1);
  }

  return input.fallbackBranch ?? getPillarBranch(input.normalizedPillar);
}

function getPillarStem(pillar: NormalizedGanji | undefined): NormalizedStem | undefined {
  return pillar === undefined ? undefined : normalizeStem(pillar.slice(0, 1));
}

function getPillarBranch(pillar: NormalizedGanji | undefined): NormalizedBranch | undefined {
  return pillar === undefined ? undefined : normalizeBranch(pillar.slice(1));
}

function collectAuditStems(input: {
  readonly pillars: Record<PillarRole, NormalizedGanji | undefined>;
  readonly explicitStems?: readonly string[];
  readonly dayMaster?: string;
}): readonly NormalizedStem[] {
  return uniqueValues([
    getPillarStem(input.pillars.yearPillar),
    getPillarStem(input.pillars.monthPillar),
    getPillarStem(input.pillars.dayPillar),
    getPillarStem(input.pillars.hourPillar),
    ...(input.explicitStems ?? []).map(normalizeStem),
    normalizeStem(input.dayMaster),
  ]);
}

function collectAuditBranches(input: {
  readonly pillars: Record<PillarRole, NormalizedGanji | undefined>;
  readonly explicitBranches?: readonly string[];
}): readonly NormalizedBranch[] {
  return uniqueValues([
    getPillarBranch(input.pillars.yearPillar),
    getPillarBranch(input.pillars.monthPillar),
    getPillarBranch(input.pillars.dayPillar),
    getPillarBranch(input.pillars.hourPillar),
    ...(input.explicitBranches ?? []).map(normalizeBranch),
  ]);
}

function mapDetected(
  extraction: ComputedSajuFeatureExtractionResult,
): SajuFeatureAuditResult["detected"] {
  return extraction.details.map((detail) => {
    const entry = requireSajuFeatureEntry(detail.featureId);

    return {
      featureId: detail.featureId,
      labelKo: entry.labelKo,
      category: entry.category,
      basis: detail.source,
      matchedBy: detail.matchedBy,
      confidence: detail.confidence,
    };
  });
}

function buildTwelveSinsalBasisAudit(input: {
  readonly basis: BasisRole;
  readonly branch: NormalizedBranch | undefined;
  readonly branches: readonly NormalizedBranch[];
}): SajuFeatureAuditResult["twelveSinsalByBasis"][number] {
  if (input.branch === undefined) {
    return {
      basis: input.basis,
      detected: [],
    };
  }

  const group = getTwelveSinsalGroup(input.branch);
  const table = twelveSinsalFeatureByGroup[group];
  const detected = uniqueValues(input.branches.map((branch) => table[branch])).map(
    (featureId) => ({
      featureId,
      labelKo: requireSajuFeatureEntry(featureId).labelKo,
    }),
  );

  return {
    basis: input.basis,
    branch: input.branch,
    detected,
  };
}

function buildBaekhoRuleTableCheck(
  pillars: Record<PillarRole, NormalizedGanji | undefined>,
): SajuFeatureAuditResult["ruleTableChecks"][number] {
  const checked = (Object.entries(pillars) as [PillarRole, NormalizedGanji | undefined][])
    .map(([pillarRole, pillar]) => ({
      pillarRole,
      ...(pillar === undefined ? {} : { pillar }),
      matched: pillar !== undefined && baekhoDayPillars.has(pillar),
      productionEligible: pillarRole === "dayPillar",
    }));

  return {
    meta: {
      ruleId: "sinsal_baekho_v1",
      label: "백호대살",
      basis: "day_pillar",
      notes:
        "V1 production detects 백호대살 from the day pillar table; audit also checks all four pillars for basis comparison.",
    },
    checked,
  };
}

function buildWatchedNotDetected(
  detectedFeatureIds: ReadonlySet<string>,
  diagnosticFeatureIds: ReadonlySet<string>,
): SajuFeatureAuditResult["watchedNotDetected"] {
  return watchedFeatures
    .filter((feature) =>
      feature.expectedFeatureIds.every((featureId) => !detectedFeatureIds.has(featureId)),
    )
    .map((feature) => {
      const diagnosticMatched = feature.expectedFeatureIds.some((featureId) =>
        diagnosticFeatureIds.has(featureId),
      );

      return {
        labelKo: feature.labelKo,
        expectedFeatureIds: feature.expectedFeatureIds,
        checkedRules: feature.checkedRules,
        note: diagnosticMatched
          ? `${feature.labelKo}은 production V1 추출에는 포함되지 않았지만 기준지 비교 audit에서는 잡힐 수 있습니다. 최종 리포트에는 production 계산 feature로 표시하지 않습니다.`
          : `${feature.labelKo}은 현재 production V1 계산 기준과 기준지 비교 audit에서 검출되지 않았습니다. 최종 리포트에는 없는 feature로 표시하지 않습니다.`,
      };
    });
}

function formatCalculatedPillars(
  result: ReturnType<typeof calculateSaju>,
): SajuAuditFixture["expectedPillars"] {
  return {
    year: `${result.pillars.year.stem}${result.pillars.year.branch}`,
    month: `${result.pillars.month.stem}${result.pillars.month.branch}`,
    day: `${result.pillars.day.stem}${result.pillars.day.branch}`,
    hour:
      result.pillars.hour === undefined
        ? ""
        : `${result.pillars.hour.stem}${result.pillars.hour.branch}`,
  };
}

export function calculateExternalManseParity(
  fixture: SajuAuditFixture,
): SajuExternalManseParityResult {
  if (
    fixture.birthDate === undefined ||
    fixture.birthTime === undefined ||
    fixture.timezone === undefined ||
    fixture.calendar !== "solar"
  ) {
    return {
      fixtureId: fixture.fixtureId,
      expectedPillars: fixture.expectedPillars,
      calculatorAvailable: false,
      calculatorNote:
        "birth-to-pillar calculator not wired for this fixture; using fixture pillars only",
      parity: [],
    };
  }

  try {
    const calculatedPillars = formatCalculatedPillars(
      calculateSaju({
        birthDate: fixture.birthDate,
        birthTime: fixture.birthTime,
        birthTimeUnknown: false,
        calendarType: "SOLAR",
        gender: fixture.gender === "female" ? "FEMALE" : "MALE",
        timezone: fixture.timezone,
      }),
    );
    const parity = (["year", "month", "day", "hour"] as const).map((pillar) => ({
      pillar,
      ok: calculatedPillars[pillar] === fixture.expectedPillars[pillar],
      expected: fixture.expectedPillars[pillar],
      calculated: calculatedPillars[pillar],
    }));

    return {
      fixtureId: fixture.fixtureId,
      expectedPillars: fixture.expectedPillars,
      calculatedPillars,
      calculatorAvailable: true,
      parity,
    };
  } catch (error) {
    return {
      fixtureId: fixture.fixtureId,
      expectedPillars: fixture.expectedPillars,
      calculatorAvailable: false,
      calculatorNote:
        error instanceof Error
          ? `birth-to-pillar calculator failed: ${error.message}`
          : "birth-to-pillar calculator failed",
      parity: [],
    };
  }
}

export function formatExternalManseParity(
  parity: SajuExternalManseParityResult,
): readonly string[] {
  const expected = parity.expectedPillars;
  const calculated = parity.calculatedPillars;

  return [
    "external expected pillars:",
    `hour ${expected.hour}`,
    `day ${expected.day}`,
    `month ${expected.month}`,
    `year ${expected.year}`,
    "current calculated pillars:",
    ...(calculated === undefined
      ? [
          parity.calculatorNote ??
            "birth-to-pillar calculator not wired in this smoke; using expected external fixture only",
        ]
      : [
          `hour ${calculated.hour}`,
          `day ${calculated.day}`,
          `month ${calculated.month}`,
          `year ${calculated.year}`,
        ]),
    "parity:",
    ...(parity.parity.length === 0
      ? ["birth-to-pillar calculator not wired in this smoke; using expected external fixture only"]
      : parity.parity.map(
          (item) =>
            `${item.pillar} ${item.ok ? "PASS" : "FAIL"} expected ${item.expected} calculated ${item.calculated ?? "none"}`,
        )),
  ];
}

export function auditComputedSajuFeatures(
  input: ComputedSajuFeatureExtractionInput,
): SajuFeatureAuditResult {
  const pillars = normalizePillars(input);
  const normalizedHeavenlyStems = collectAuditStems({
    pillars,
    explicitStems: input.heavenlyStems,
    dayMaster: input.dayMaster,
  });
  const normalizedEarthlyBranches = collectAuditBranches({
    pillars,
    explicitBranches: input.earthlyBranches,
  });
  const dayMaster = normalizeStem(input.dayMaster) ?? getPillarStem(pillars.dayPillar);
  const dayBranch = getPillarBranch(pillars.dayPillar);
  const displayDayMaster = getDisplayStem({
    rawPillar: input.dayPillar,
    normalizedPillar: pillars.dayPillar,
    fallbackStem: dayMaster,
  });
  const displayDayBranch = getDisplayBranch({
    rawPillar: input.dayPillar,
    normalizedPillar: pillars.dayPillar,
    fallbackBranch: dayBranch,
  });
  const displayPillars = {
    yearPillar: getDisplayPillar(input.yearPillar, pillars.yearPillar),
    monthPillar: getDisplayPillar(input.monthPillar, pillars.monthPillar),
    dayPillar: getDisplayPillar(input.dayPillar, pillars.dayPillar),
    hourPillar: getDisplayPillar(input.hourPillar, pillars.hourPillar),
  };
  const heavenlyStems = uniqueValues([
    getDisplayStem({
      rawPillar: input.yearPillar,
      normalizedPillar: pillars.yearPillar,
    }),
    getDisplayStem({
      rawPillar: input.monthPillar,
      normalizedPillar: pillars.monthPillar,
    }),
    getDisplayStem({
      rawPillar: input.dayPillar,
      normalizedPillar: pillars.dayPillar,
    }),
    getDisplayStem({
      rawPillar: input.hourPillar,
      normalizedPillar: pillars.hourPillar,
    }),
    ...(input.heavenlyStems ?? []),
  ]);
  const earthlyBranches = uniqueValues([
    getDisplayBranch({
      rawPillar: input.yearPillar,
      normalizedPillar: pillars.yearPillar,
    }),
    getDisplayBranch({
      rawPillar: input.monthPillar,
      normalizedPillar: pillars.monthPillar,
    }),
    getDisplayBranch({
      rawPillar: input.dayPillar,
      normalizedPillar: pillars.dayPillar,
    }),
    getDisplayBranch({
      rawPillar: input.hourPillar,
      normalizedPillar: pillars.hourPillar,
    }),
    ...(input.earthlyBranches ?? []),
  ]);
  const extraction = extractComputedSajuFeatures({
    ...input,
    yearPillar: pillars.yearPillar,
    monthPillar: pillars.monthPillar,
    dayPillar: pillars.dayPillar,
    hourPillar: pillars.hourPillar,
    dayMaster,
    heavenlyStems: normalizedHeavenlyStems,
    earthlyBranches: normalizedEarthlyBranches,
  });
  const detectedFeatureIds = new Set(extraction.featureIds);
  const twelveSinsalByBasis = [
    buildTwelveSinsalBasisAudit({
      basis: "yearBranch",
      branch: getPillarBranch(pillars.yearPillar),
      branches: normalizedEarthlyBranches,
    }),
    buildTwelveSinsalBasisAudit({
      basis: "monthBranch",
      branch: getPillarBranch(pillars.monthPillar),
      branches: normalizedEarthlyBranches,
    }),
    buildTwelveSinsalBasisAudit({
      basis: "dayBranch",
      branch: dayBranch,
      branches: normalizedEarthlyBranches,
    }),
    buildTwelveSinsalBasisAudit({
      basis: "hourBranch",
      branch: getPillarBranch(pillars.hourPillar),
      branches: normalizedEarthlyBranches,
    }),
  ];
  const diagnosticFeatureIds = new Set(
    twelveSinsalByBasis.flatMap((basis) =>
      basis.detected.map((feature) => feature.featureId),
    ),
  );
  if (
    Object.values(pillars).some(
      (pillar) => pillar !== undefined && baekhoDayPillars.has(pillar),
    )
  ) {
    diagnosticFeatureIds.add("sinsal_baekho");
  }

  return {
    ruleSetVersion: SAJU_FEATURE_EXTRACTION_RULESET_VERSION,
    pillars: {
      ...(displayPillars.yearPillar === undefined
        ? {}
        : { yearPillar: displayPillars.yearPillar }),
      ...(displayPillars.monthPillar === undefined
        ? {}
        : { monthPillar: displayPillars.monthPillar }),
      ...(displayPillars.dayPillar === undefined
        ? {}
        : { dayPillar: displayPillars.dayPillar }),
      ...(displayPillars.hourPillar === undefined
        ? {}
        : { hourPillar: displayPillars.hourPillar }),
      heavenlyStems,
      earthlyBranches,
      ...(displayDayMaster === undefined ? {} : { dayMaster: displayDayMaster }),
      ...(displayDayBranch === undefined ? {} : { dayBranch: displayDayBranch }),
    },
    detected: mapDetected(extraction),
    twelveSinsalByBasis,
    ruleTableChecks: [buildBaekhoRuleTableCheck(pillars)],
    watchedNotDetected: buildWatchedNotDetected(
      detectedFeatureIds,
      diagnosticFeatureIds,
    ),
  };
}

export function formatSajuFeatureAuditResult(
  audit: SajuFeatureAuditResult,
  options: {
    readonly fixture?: SajuAuditFixture;
    readonly parity?: SajuExternalManseParityResult;
    readonly externalPlacements?: readonly SajuPillarFeaturePlacement[];
  } = {},
): readonly string[] {
  const pillarLine = [
    audit.pillars.yearPillar,
    audit.pillars.monthPillar,
    audit.pillars.dayPillar,
    audit.pillars.hourPillar,
  ]
    .filter(Boolean)
    .join(" ");

  const bananBasisLines = audit.twelveSinsalByBasis.flatMap((basis) => {
    const detected = basis.detected.some(
      (item) => item.featureId === "twelve_sinsal_banan",
    );

    return [
      `- ${basis.basis} basis: ${detected ? "detected" : "not detected"}`,
    ];
  });
  const baekhoCheck = audit.ruleTableChecks.find(
    (check) => check.meta.ruleId === "sinsal_baekho_v1",
  );
  const baekhoDayDetected =
    baekhoCheck?.checked.some(
      (item) => item.productionEligible && item.matched,
    ) ?? false;
  const baekhoAnyDetected =
    baekhoCheck?.checked.some((item) => item.matched) ?? false;
  const detectedFeatureIds = new Set(audit.detected.map((item) => item.featureId));
  const externalPlacements =
    options.externalPlacements ?? options.fixture?.externalPlacements ?? [];
  const formatExternalPlacementResult = (featureId: string) => {
    const placements = externalPlacements.filter(
      (placement) => placement.featureId === featureId,
    );

    return placements.length === 0
      ? "none"
      : placements
          .map(
            (placement) =>
              `${placement.pillarLabelKo} ${placement.sourcePillar} (${placement.basis})`,
          )
          .join(", ");
  };
  const diagnosticBananDetected = audit.twelveSinsalByBasis.some((basis) =>
    basis.detected.some((item) => item.featureId === "twelve_sinsal_banan"),
  );

  return [
    ...(options.fixture === undefined
      ? []
      : [`audit fixture: ${options.fixture.auditLabel}`]),
    ...(options.parity === undefined ? [] : formatExternalManseParity(options.parity)),
    `feature audit rule set: ${audit.ruleSetVersion}`,
    `pillars: ${pillarLine}`,
    `stems: ${audit.pillars.heavenlyStems.join(" ")}`,
    `branches: ${audit.pillars.earthlyBranches.join(" ")}`,
    "detected features:",
    ...(audit.detected.length === 0
      ? ["- none"]
      : audit.detected.map((item) => `- ${item.labelKo} (${item.matchedBy})`)),
    "twelve-sinsal audit:",
    ...audit.twelveSinsalByBasis.map((basis) => {
      const labels = basis.detected.map((item) => item.labelKo).join(", ");
      return `${basis.basis} ${basis.branch ?? "none"}: ${labels.length === 0 ? "none" : labels}`;
    }),
    "rule table checks:",
    ...audit.ruleTableChecks.flatMap((check) => [
      `- ${check.meta.label}: ${check.meta.notes}`,
      ...check.checked.map(
        (item) =>
          `  - ${item.pillarRole} ${item.pillar ?? "none"}: ${
            item.matched ? "matched" : "not matched"
          }${item.productionEligible ? " (production basis)" : ""}`,
      ),
    ]),
    ...(externalPlacements.length === 0
      ? []
      : [
          "external fixture placements:",
          ...externalPlacements.map(
            (placement) =>
              `- ${placement.labelKo}: ${placement.pillarLabelKo} ${placement.sourcePillar} (${placement.basis})`,
          ),
        ]),
    "basis diagnostics:",
    "반안살:",
    `- production result: ${
      detectedFeatureIds.has("twelve_sinsal_banan") ? "detected" : "not detected"
    }`,
    `- diagnostic basis result: ${diagnosticBananDetected ? "detected" : "not detected"}`,
    `- external fixture placement result: ${formatExternalPlacementResult("twelve_sinsal_banan")}`,
    ...bananBasisLines,
    "백호살:",
    `- production result: ${detectedFeatureIds.has("sinsal_baekho") ? "detected" : "not detected"}`,
    `- diagnostic basis result: ${baekhoAnyDetected ? "detected" : "not detected"}`,
    `- external fixture placement result: ${formatExternalPlacementResult("sinsal_baekho")}`,
    `- dayPillar rule: ${baekhoDayDetected ? "detected" : "not detected"}`,
    `- anyPillar rule: ${baekhoAnyDetected ? "detected" : "not detected"}`,
    "watched not detected:",
    ...(audit.watchedNotDetected.length === 0
      ? ["- none"]
      : audit.watchedNotDetected.map(
          (item) =>
            `- ${item.labelKo}: ${item.note} checked rules: ${item.checkedRules.join(", ")}`,
        )),
  ];
}
