import { SAJU_DAY_PILLAR_BY_LABEL } from "./sajuDayPillarKnowledge";
import { SAJU_FEATURE_BY_ID } from "./sajuFeatureTaxonomy";
import type { FiveElement, TenGod } from "./sajuKnowledgeTypes";
import {
  amrokBranchesByStem,
  baekhoDayPillars,
  BRANCHES,
  cheoneulGwiinBranchesByStem,
  dohwaBranchByGroup,
  elementFeatureIdByElement,
  geumyeorokBranchesByStem,
  getTwelveSinsalGroup,
  gongmangBranchesByCycleStart,
  goegangDayPillars,
  gwiinFeatureIdByAlias,
  hyeonchimBranches,
  jaegoGwiinBranchesByStem,
  munchangGwiinBranchesByStem,
  normalizeBranch,
  normalizeGanji,
  normalizeStem,
  relationPairs,
  SAJU_FEATURE_EXTRACTION_RULESET_VERSION,
  sexagenaryCycle,
  sinsalFeatureIdByAlias,
  specialPatternFeatureIdByAlias,
  STEMS,
  tenGodFeatureIdByTenGod,
  twelveSinsalFeatureByGroup,
  yanginBranchesByStem,
  type NormalizedBranch,
  type NormalizedGanji,
  type NormalizedStem,
} from "./sajuFeatureExtractionRules";

const mappableTenGodStrengths = new Set([
  "present",
  "strong",
  "excessive",
] as const);

export type ComputedSajuFeatureExtractionInput = {
  readonly yearPillar?: string;
  readonly monthPillar?: string;
  readonly dayPillar?: string;
  readonly hourPillar?: string;
  readonly dayMaster?: string;
  readonly earthlyBranches?: readonly string[];
  readonly heavenlyStems?: readonly string[];
  readonly fiveElementCounts?: Partial<Record<FiveElement, number>>;
  readonly excessiveElements?: readonly string[];
  readonly missingElements?: readonly string[];
  readonly tenGodSignals?: readonly {
    readonly tenGod: string;
    readonly strength?: string;
  }[];
  readonly specialPatterns?: readonly string[];
  readonly existingSinsal?: readonly string[];
  readonly existingGwiin?: readonly string[];
};

export type ComputedSajuFeatureExtractionDetail = {
  readonly featureId: string;
  readonly source:
    | "pillar"
    | "branch"
    | "stem"
    | "element"
    | "ten_god"
    | "pattern"
    | "existing_fact";
  readonly matchedBy: string;
  readonly confidence: "computed" | "existing_fact" | "derived";
};

export type ComputedSajuFeatureExtractionResult = {
  readonly ruleSetVersion: typeof SAJU_FEATURE_EXTRACTION_RULESET_VERSION;
  readonly featureIds: readonly string[];
  readonly details: readonly ComputedSajuFeatureExtractionDetail[];
};

function normalizeElement(value: string): FiveElement | undefined {
  if (
    value === "wood" ||
    value === "fire" ||
    value === "earth" ||
    value === "metal" ||
    value === "water"
  ) {
    return value;
  }

  const byKo = new Map<string, FiveElement>([
    ["목", "wood"],
    ["화", "fire"],
    ["토", "earth"],
    ["금", "metal"],
    ["수", "water"],
  ]);

  return byKo.get(value.trim());
}

function normalizeTenGod(value: string): TenGod | undefined {
  if (
    value === "bijian" ||
    value === "jie_cai" ||
    value === "shi_shen" ||
    value === "shang_guan" ||
    value === "pian_cai" ||
    value === "zheng_cai" ||
    value === "qi_sha" ||
    value === "zheng_guan" ||
    value === "pian_yin" ||
    value === "zheng_yin"
  ) {
    return value;
  }

  const byKo = new Map<string, TenGod>([
    ["비견", "bijian"],
    ["겁재", "jie_cai"],
    ["식신", "shi_shen"],
    ["상관", "shang_guan"],
    ["편재", "pian_cai"],
    ["정재", "zheng_cai"],
    ["편관", "qi_sha"],
    ["정관", "zheng_guan"],
    ["편인", "pian_yin"],
    ["정인", "zheng_yin"],
  ]);

  return byKo.get(value.trim());
}

function collectPillars(
  input: ComputedSajuFeatureExtractionInput,
): readonly NormalizedGanji[] {
  const pillars = [
    input.yearPillar,
    input.monthPillar,
    input.dayPillar,
    input.hourPillar,
  ]
    .map(normalizeGanji)
    .filter((value): value is NormalizedGanji => value !== undefined);

  return [...new Set(pillars)];
}

function collectBranches(input: {
  readonly pillars: readonly NormalizedGanji[];
  readonly explicitBranches?: readonly string[];
}): readonly NormalizedBranch[] {
  const normalized = [
    ...input.pillars.map((pillar) => pillar.slice(1)),
    ...(input.explicitBranches ?? []).map(normalizeBranch),
  ].filter((value): value is NormalizedBranch =>
    BRANCHES.includes(value as NormalizedBranch),
  );

  return [...new Set(normalized)];
}

function collectStems(input: {
  readonly pillars: readonly NormalizedGanji[];
  readonly explicitStems?: readonly string[];
  readonly dayMaster?: string;
}): readonly NormalizedStem[] {
  const normalized = [
    ...input.pillars.map((pillar) => pillar.slice(0, 1)),
    ...(input.explicitStems ?? []).map(normalizeStem),
    normalizeStem(input.dayMaster),
  ].filter((value): value is NormalizedStem =>
    STEMS.includes(value as NormalizedStem),
  );

  return [...new Set(normalized)];
}

function findDayMaster(input: {
  readonly explicitDayMaster?: string;
  readonly dayPillar?: NormalizedGanji;
}): NormalizedStem | undefined {
  return (
    normalizeStem(input.explicitDayMaster) ??
    (input.dayPillar === undefined ? undefined : normalizeStem(input.dayPillar))
  );
}

function appendFeature(input: {
  readonly featureIds: string[];
  readonly details: ComputedSajuFeatureExtractionDetail[];
  readonly seen: Set<string>;
  readonly featureId: string | undefined;
  readonly source: ComputedSajuFeatureExtractionDetail["source"];
  readonly matchedBy: string;
  readonly confidence: ComputedSajuFeatureExtractionDetail["confidence"];
}): void {
  if (input.featureId === undefined || !SAJU_FEATURE_BY_ID.has(input.featureId)) {
    return;
  }

  if (!input.seen.has(input.featureId)) {
    input.featureIds.push(input.featureId);
    input.seen.add(input.featureId);
  }

  if (
    !input.details.some(
      (detail) =>
        detail.featureId === input.featureId &&
        detail.source === input.source &&
        detail.matchedBy === input.matchedBy,
    )
  ) {
    input.details.push({
      featureId: input.featureId,
      source: input.source,
      matchedBy: input.matchedBy,
      confidence: input.confidence,
    });
  }
}

function appendAliasFeatures(input: {
  readonly values: readonly string[] | undefined;
  readonly aliases: ReadonlyMap<string, string>;
  readonly featureIds: string[];
  readonly details: ComputedSajuFeatureExtractionDetail[];
  readonly seen: Set<string>;
  readonly matchedPrefix: string;
}): void {
  for (const value of input.values ?? []) {
    appendFeature({
      featureIds: input.featureIds,
      details: input.details,
      seen: input.seen,
      featureId: input.aliases.get(value.trim()),
      source: "existing_fact",
      matchedBy: `${input.matchedPrefix}:${value}`,
      confidence: "existing_fact",
    });
  }
}

function appendDayPillarFeature(input: {
  readonly dayPillar: NormalizedGanji | undefined;
  readonly featureIds: string[];
  readonly details: ComputedSajuFeatureExtractionDetail[];
  readonly seen: Set<string>;
}): void {
  if (input.dayPillar === undefined) {
    return;
  }

  appendFeature({
    featureIds: input.featureIds,
    details: input.details,
    seen: input.seen,
    featureId: SAJU_DAY_PILLAR_BY_LABEL.get(`${input.dayPillar}일주`)?.id,
    source: "pillar",
    matchedBy: `dayPillar:${input.dayPillar}`,
    confidence: "computed",
  });
}

function appendElementFeatures(input: {
  readonly elements: readonly string[] | undefined;
  readonly kind: "excess" | "missing";
  readonly featureIds: string[];
  readonly details: ComputedSajuFeatureExtractionDetail[];
  readonly seen: Set<string>;
}): void {
  for (const value of input.elements ?? []) {
    const element = normalizeElement(value);

    if (element === undefined) {
      continue;
    }

    appendFeature({
      featureIds: input.featureIds,
      details: input.details,
      seen: input.seen,
      featureId: elementFeatureIdByElement[element][input.kind],
      source: "element",
      matchedBy: `${input.kind}:${element}`,
      confidence: "derived",
    });
  }
}

function appendTenGodFeatures(input: {
  readonly tenGodSignals: ComputedSajuFeatureExtractionInput["tenGodSignals"];
  readonly featureIds: string[];
  readonly details: ComputedSajuFeatureExtractionDetail[];
  readonly seen: Set<string>;
}): void {
  for (const signal of input.tenGodSignals ?? []) {
    const tenGod = normalizeTenGod(signal.tenGod);

    if (
      tenGod === undefined ||
      signal.strength === undefined ||
      !mappableTenGodStrengths.has(
        signal.strength as (typeof mappableTenGodStrengths extends Set<infer T> ? T : never),
      )
    ) {
      continue;
    }

    appendFeature({
      featureIds: input.featureIds,
      details: input.details,
      seen: input.seen,
      featureId: tenGodFeatureIdByTenGod[tenGod],
      source: "ten_god",
      matchedBy: `tenGod:${tenGod}:${signal.strength}`,
      confidence: "derived",
    });
  }
}

function appendPatternFeatures(input: {
  readonly patterns: readonly string[] | undefined;
  readonly featureIds: string[];
  readonly details: ComputedSajuFeatureExtractionDetail[];
  readonly seen: Set<string>;
}): void {
  for (const pattern of input.patterns ?? []) {
    appendFeature({
      featureIds: input.featureIds,
      details: input.details,
      seen: input.seen,
      featureId: specialPatternFeatureIdByAlias.get(pattern.trim()),
      source: "pattern",
      matchedBy: `pattern:${pattern}`,
      confidence: "derived",
    });
  }
}

function appendTwelveSinsalFeatures(input: {
  readonly baseBranch: NormalizedBranch | undefined;
  readonly branches: readonly NormalizedBranch[];
  readonly featureIds: string[];
  readonly details: ComputedSajuFeatureExtractionDetail[];
  readonly seen: Set<string>;
}): void {
  if (input.baseBranch === undefined) {
    return;
  }

  const group = getTwelveSinsalGroup(input.baseBranch);
  const table = twelveSinsalFeatureByGroup[group];

  for (const branch of input.branches) {
    appendFeature({
      featureIds: input.featureIds,
      details: input.details,
      seen: input.seen,
      featureId: table[branch],
      source: "branch",
      matchedBy: `twelveSinsal:${input.baseBranch}:${branch}`,
      confidence: "computed",
    });
  }
}

function appendGwiinFeatures(input: {
  readonly dayMaster: NormalizedStem | undefined;
  readonly branches: readonly NormalizedBranch[];
  readonly featureIds: string[];
  readonly details: ComputedSajuFeatureExtractionDetail[];
  readonly seen: Set<string>;
}): void {
  if (input.dayMaster === undefined) {
    return;
  }

  const branchRules = [
    {
      featureId: "gwiin_cheoneul",
      branches: cheoneulGwiinBranchesByStem[input.dayMaster],
    },
    {
      featureId: "gwiin_munchang",
      branches: munchangGwiinBranchesByStem[input.dayMaster],
    },
    {
      featureId: "gwiin_jaego",
      branches: jaegoGwiinBranchesByStem[input.dayMaster],
    },
    {
      featureId: "gwiin_geumyeorok",
      branches: geumyeorokBranchesByStem[input.dayMaster],
    },
    {
      featureId: "gwiin_amrok",
      branches: amrokBranchesByStem[input.dayMaster],
    },
  ] as const;

  for (const rule of branchRules) {
    const matchedBranch = input.branches.find((branch) =>
      (rule.branches as readonly NormalizedBranch[]).includes(branch),
    );

    appendFeature({
      featureIds: input.featureIds,
      details: input.details,
      seen: input.seen,
      featureId: matchedBranch === undefined ? undefined : rule.featureId,
      source: "branch",
      matchedBy:
        matchedBranch === undefined
          ? `gwiin:${input.dayMaster}`
          : `gwiin:${input.dayMaster}:${matchedBranch}`,
      confidence: "computed",
    });
  }
}

function hasPair(
  branches: readonly NormalizedBranch[],
  pair: readonly [NormalizedBranch, NormalizedBranch],
): boolean {
  return branches.includes(pair[0]) && branches.includes(pair[1]);
}

function appendMajorSinsalFeatures(input: {
  readonly dayMaster: NormalizedStem | undefined;
  readonly dayPillar: NormalizedGanji | undefined;
  readonly dayBranch: NormalizedBranch | undefined;
  readonly branches: readonly NormalizedBranch[];
  readonly featureIds: string[];
  readonly details: ComputedSajuFeatureExtractionDetail[];
  readonly seen: Set<string>;
}): void {
  appendFeature({
    featureIds: input.featureIds,
    details: input.details,
    seen: input.seen,
    featureId:
      input.dayPillar !== undefined && baekhoDayPillars.has(input.dayPillar)
        ? "sinsal_baekho"
        : undefined,
    source: "pillar",
    matchedBy: `baekho:${input.dayPillar ?? "none"}`,
    confidence: "computed",
  });
  appendFeature({
    featureIds: input.featureIds,
    details: input.details,
    seen: input.seen,
    featureId:
      input.dayPillar !== undefined && goegangDayPillars.has(input.dayPillar)
        ? "sinsal_goegang"
        : undefined,
    source: "pillar",
    matchedBy: `goegang:${input.dayPillar ?? "none"}`,
    confidence: "computed",
  });

  if (input.dayMaster !== undefined) {
    const dayMaster = input.dayMaster;
    const yanginBranch = input.branches.find((branch) =>
      (yanginBranchesByStem[dayMaster] as readonly NormalizedBranch[]).includes(
        branch,
      ),
    );

    appendFeature({
      featureIds: input.featureIds,
      details: input.details,
      seen: input.seen,
      featureId: yanginBranch === undefined ? undefined : "sinsal_yangin",
      source: "branch",
      matchedBy:
        yanginBranch === undefined
          ? `yangin:${dayMaster}`
          : `yangin:${dayMaster}:${yanginBranch}`,
      confidence: "computed",
    });
  }

  const hyeonchimBranch = input.branches.find((branch) =>
    hyeonchimBranches.has(branch),
  );
  appendFeature({
    featureIds: input.featureIds,
    details: input.details,
    seen: input.seen,
    featureId: hyeonchimBranch === undefined ? undefined : "sinsal_hyeonchim",
    source: "branch",
    matchedBy: `hyeonchim:${hyeonchimBranch ?? "none"}`,
    confidence: "computed",
  });

  if (input.dayBranch !== undefined) {
    const group = getTwelveSinsalGroup(input.dayBranch);
    const dohwaBranch = dohwaBranchByGroup[group];

    appendFeature({
      featureIds: input.featureIds,
      details: input.details,
      seen: input.seen,
      featureId: input.branches.includes(dohwaBranch) ? "sinsal_dohwa" : undefined,
      source: "branch",
      matchedBy: `dohwa:${input.dayBranch}:${dohwaBranch}`,
      confidence: "computed",
    });
  }

  appendFeature({
    featureIds: input.featureIds,
    details: input.details,
    seen: input.seen,
    featureId: relationPairs.gwimun.some((pair) => hasPair(input.branches, pair))
      ? "sinsal_gwimun"
      : undefined,
    source: "branch",
    matchedBy: "gwimun:pair",
    confidence: "computed",
  });
  appendFeature({
    featureIds: input.featureIds,
    details: input.details,
    seen: input.seen,
    featureId: relationPairs.wonjin.some((pair) => hasPair(input.branches, pair))
      ? "sinsal_wonjin"
      : undefined,
    source: "branch",
    matchedBy: "wonjin:pair",
    confidence: "computed",
  });

  if (input.dayPillar !== undefined) {
    const dayPillarIndex = (sexagenaryCycle as readonly NormalizedGanji[]).indexOf(
      input.dayPillar,
    );
    const emptyBranches =
      dayPillarIndex < 0
        ? undefined
        : gongmangBranchesByCycleStart[Math.floor(dayPillarIndex / 10)];
    const hasGongmang =
      emptyBranches !== undefined &&
      input.branches.some((branch) =>
        (emptyBranches as readonly NormalizedBranch[]).includes(branch),
      );

    appendFeature({
      featureIds: input.featureIds,
      details: input.details,
      seen: input.seen,
      featureId: hasGongmang ? "sinsal_gongmang" : undefined,
      source: "pillar",
      matchedBy:
        emptyBranches === undefined
          ? `gongmang:${input.dayPillar}`
          : `gongmang:${input.dayPillar}:${emptyBranches.join("/")}`,
      confidence: "computed",
    });
  }

  appendFeature({
    featureIds: input.featureIds,
    details: input.details,
    seen: input.seen,
    featureId:
      input.branches.includes("술") || input.branches.includes("해")
        ? "sinsal_cheonmunseong"
        : undefined,
    source: "branch",
    matchedBy: "cheonmunseong:술/해",
    confidence: "computed",
  });
}

export function extractComputedSajuFeatures(
  input: ComputedSajuFeatureExtractionInput,
): ComputedSajuFeatureExtractionResult {
  const featureIds: string[] = [];
  const details: ComputedSajuFeatureExtractionDetail[] = [];
  const seen = new Set<string>();
  const pillars = collectPillars(input);
  const dayPillar = normalizeGanji(input.dayPillar);
  const dayBranch = dayPillar === undefined ? undefined : normalizeBranch(dayPillar);
  const branches = collectBranches({
    pillars,
    explicitBranches: input.earthlyBranches,
  });
  const dayMaster = findDayMaster({
    explicitDayMaster: input.dayMaster,
    dayPillar,
  });

  collectStems({
    pillars,
    explicitStems: input.heavenlyStems,
    dayMaster: input.dayMaster,
  });

  appendDayPillarFeature({ dayPillar, featureIds, details, seen });
  appendElementFeatures({
    elements: input.excessiveElements,
    kind: "excess",
    featureIds,
    details,
    seen,
  });
  appendElementFeatures({
    elements: input.missingElements,
    kind: "missing",
    featureIds,
    details,
    seen,
  });
  appendTenGodFeatures({
    tenGodSignals: input.tenGodSignals,
    featureIds,
    details,
    seen,
  });
  appendPatternFeatures({
    patterns: input.specialPatterns,
    featureIds,
    details,
    seen,
  });
  appendAliasFeatures({
    values: input.existingSinsal,
    aliases: sinsalFeatureIdByAlias,
    featureIds,
    details,
    seen,
    matchedPrefix: "sinsal",
  });
  appendAliasFeatures({
    values: input.existingGwiin,
    aliases: gwiinFeatureIdByAlias,
    featureIds,
    details,
    seen,
    matchedPrefix: "gwiin",
  });
  appendTwelveSinsalFeatures({
    baseBranch: dayBranch ?? normalizeBranch(input.yearPillar),
    branches,
    featureIds,
    details,
    seen,
  });
  appendGwiinFeatures({
    dayMaster,
    branches,
    featureIds,
    details,
    seen,
  });
  appendMajorSinsalFeatures({
    dayMaster,
    dayPillar,
    dayBranch,
    branches,
    featureIds,
    details,
    seen,
  });

  return {
    ruleSetVersion: SAJU_FEATURE_EXTRACTION_RULESET_VERSION,
    featureIds,
    details,
  };
}
