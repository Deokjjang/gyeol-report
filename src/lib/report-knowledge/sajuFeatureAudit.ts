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

type PillarRole = "yearPillar" | "monthPillar" | "dayPillar" | "hourPillar";

type BasisRole = "yearBranch" | "monthBranch" | "dayBranch" | "hourBranch";

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
    const detected = basis.detected.some((item) => item.labelKo === "반안살");

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

  return [
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
    "basis diagnostics:",
    "반안살:",
    ...bananBasisLines,
    "백호대살:",
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
