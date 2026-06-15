import {
  amrokBranchesByStem,
  baekhoDayPillars,
  cheoneulGwiinBranchesByStem,
  geumyeorokBranchesByStem,
  getTwelveSinsalGroup,
  hyeonchimBranches,
  jaegoGwiinBranchesByStem,
  munchangGwiinBranchesByStem,
  normalizeBranch,
  normalizeGanji,
  normalizeStem,
  twelveSinsalFeatureByGroup,
  yanginBranchesByStem,
  type NormalizedBranch,
  type NormalizedGanji,
  type NormalizedStem,
} from "./sajuFeatureExtractionRules";
import { requireSajuFeatureEntry } from "./sajuFeatureTaxonomy";
import type { SajuFeatureCategory } from "./sajuFeatureTypes";

export type SajuPillarKey = "year" | "month" | "day" | "hour";

export type SajuPillarFeaturePlacement = {
  readonly featureId: string;
  readonly labelKo: string;
  readonly category: SajuFeatureCategory;
  readonly pillar: SajuPillarKey;
  readonly pillarLabelKo: "연주" | "월주" | "일주" | "시주";
  readonly sourcePillar: string;
  readonly sourceStem?: string;
  readonly sourceBranch?: string;
  readonly basis: string;
  readonly confidence: "production" | "diagnostic" | "external_fixture";
};

export type SajuPillarGridColumn = {
  readonly columnId: SajuPillarKey;
  readonly labelKo: string;
  readonly pillar?: string;
  readonly heavenlyStem?: string;
  readonly earthlyBranch?: string;
  readonly tenGod?: readonly string[];
  readonly hiddenStems?: readonly string[];
  readonly twelveLifeStage?: readonly string[];
  readonly twelveSinsal?: readonly string[];
  readonly sinsal?: readonly string[];
  readonly gwiin?: readonly string[];
};

export type SajuPillarPlacementInput = {
  readonly yearPillar?: string;
  readonly monthPillar?: string;
  readonly dayPillar?: string;
  readonly hourPillar?: string;
  readonly dayMaster?: string;
  readonly productionFeatureIds?: readonly string[];
};

type PillarPart = {
  readonly raw?: string;
  readonly normalized?: NormalizedGanji;
  readonly stem?: NormalizedStem;
  readonly branch?: NormalizedBranch;
  readonly stemDisplay?: string;
  readonly branchDisplay?: string;
  readonly pillarDisplay?: string;
};

const pillarOrder = [
  { key: "hour", labelKo: "시주" },
  { key: "day", labelKo: "일주" },
  { key: "month", labelKo: "월주" },
  { key: "year", labelKo: "연주" },
] as const satisfies readonly {
  readonly key: SajuPillarKey;
  readonly labelKo: SajuPillarFeaturePlacement["pillarLabelKo"];
}[];

const normalizedStemToHanja = {
  갑: "甲",
  을: "乙",
  병: "丙",
  정: "丁",
  무: "戊",
  기: "己",
  경: "庚",
  신: "辛",
  임: "壬",
  계: "癸",
} as const satisfies Record<NormalizedStem, string>;

const normalizedBranchToHanja = {
  자: "子",
  축: "丑",
  인: "寅",
  묘: "卯",
  진: "辰",
  사: "巳",
  오: "午",
  미: "未",
  신: "申",
  유: "酉",
  술: "戌",
  해: "亥",
} as const satisfies Record<NormalizedBranch, string>;

const normalizedStemToKo = {
  갑: "갑",
  을: "을",
  병: "병",
  정: "정",
  무: "무",
  기: "기",
  경: "경",
  신: "신",
  임: "임",
  계: "계",
} as const satisfies Record<NormalizedStem, string>;

const normalizedBranchToKo = {
  자: "자",
  축: "축",
  인: "인",
  묘: "묘",
  진: "진",
  사: "사",
  오: "오",
  미: "미",
  신: "신",
  유: "유",
  술: "술",
  해: "해",
} as const satisfies Record<NormalizedBranch, string>;

const hiddenStemsByBranch = {
  자: ["癸"],
  축: ["癸", "辛", "己"],
  인: ["戊", "丙", "甲"],
  묘: ["甲", "乙"],
  진: ["乙", "癸", "戊"],
  사: ["戊", "庚", "丙"],
  오: ["丙", "己", "丁"],
  미: ["丁", "乙", "己"],
  신: ["戊", "壬", "庚"],
  유: ["庚", "辛"],
  술: ["辛", "丁", "戊"],
  해: ["戊", "甲", "壬"],
} as const satisfies Record<NormalizedBranch, readonly string[]>;

const twelveLifeStageByStem = {
  갑: {
    해: "장생",
    자: "목욕",
    축: "관대",
    인: "건록",
    묘: "제왕",
    진: "쇠",
    사: "병",
    오: "사",
    미: "묘",
    신: "절",
    유: "태",
    술: "양",
  },
  을: {
    오: "장생",
    사: "목욕",
    진: "관대",
    묘: "건록",
    인: "제왕",
    축: "쇠",
    자: "병",
    해: "사",
    술: "묘",
    유: "절",
    신: "태",
    미: "양",
  },
  병: {
    인: "장생",
    묘: "목욕",
    진: "관대",
    사: "건록",
    오: "제왕",
    미: "쇠",
    신: "병",
    유: "사",
    술: "묘",
    해: "절",
    자: "태",
    축: "양",
  },
  정: {
    유: "장생",
    신: "목욕",
    미: "관대",
    오: "건록",
    사: "제왕",
    진: "쇠",
    묘: "병",
    인: "사",
    축: "묘",
    자: "절",
    해: "태",
    술: "양",
  },
  무: {
    인: "장생",
    묘: "목욕",
    진: "관대",
    사: "건록",
    오: "제왕",
    미: "쇠",
    신: "병",
    유: "사",
    술: "묘",
    해: "절",
    자: "태",
    축: "양",
  },
  기: {
    유: "장생",
    신: "목욕",
    미: "관대",
    오: "건록",
    사: "제왕",
    진: "쇠",
    묘: "병",
    인: "사",
    축: "묘",
    자: "절",
    해: "태",
    술: "양",
  },
  경: {
    사: "장생",
    오: "목욕",
    미: "관대",
    신: "건록",
    유: "제왕",
    술: "쇠",
    해: "병",
    자: "사",
    축: "묘",
    인: "절",
    묘: "태",
    진: "양",
  },
  신: {
    자: "장생",
    해: "목욕",
    술: "관대",
    유: "건록",
    신: "제왕",
    미: "쇠",
    오: "병",
    사: "사",
    진: "묘",
    묘: "절",
    인: "태",
    축: "양",
  },
  임: {
    신: "장생",
    유: "목욕",
    술: "관대",
    해: "건록",
    자: "제왕",
    축: "쇠",
    인: "병",
    묘: "사",
    진: "묘",
    사: "절",
    오: "태",
    미: "양",
  },
  계: {
    묘: "장생",
    인: "목욕",
    축: "관대",
    자: "건록",
    해: "제왕",
    술: "쇠",
    유: "병",
    신: "사",
    미: "묘",
    오: "절",
    사: "태",
    진: "양",
  },
} as const satisfies Record<NormalizedStem, Record<NormalizedBranch, string>>;

const tenGodKoByStem = {
  갑: {
    갑: "비견",
    을: "겁재",
    병: "식신",
    정: "상관",
    무: "편재",
    기: "정재",
    경: "편관",
    신: "정관",
    임: "편인",
    계: "정인",
  },
  을: {
    갑: "겁재",
    을: "비견",
    병: "상관",
    정: "식신",
    무: "정재",
    기: "편재",
    경: "정관",
    신: "편관",
    임: "정인",
    계: "편인",
  },
  병: {
    갑: "편인",
    을: "정인",
    병: "비견",
    정: "겁재",
    무: "식신",
    기: "상관",
    경: "편재",
    신: "정재",
    임: "편관",
    계: "정관",
  },
  정: {
    갑: "정인",
    을: "편인",
    병: "겁재",
    정: "비견",
    무: "상관",
    기: "식신",
    경: "정재",
    신: "편재",
    임: "정관",
    계: "편관",
  },
  무: {
    갑: "편관",
    을: "정관",
    병: "편인",
    정: "정인",
    무: "비견",
    기: "겁재",
    경: "식신",
    신: "상관",
    임: "편재",
    계: "정재",
  },
  기: {
    갑: "정관",
    을: "편관",
    병: "정인",
    정: "편인",
    무: "겁재",
    기: "비견",
    경: "상관",
    신: "식신",
    임: "정재",
    계: "편재",
  },
  경: {
    갑: "편재",
    을: "정재",
    병: "편관",
    정: "정관",
    무: "편인",
    기: "정인",
    경: "비견",
    신: "겁재",
    임: "식신",
    계: "상관",
  },
  신: {
    갑: "정재",
    을: "편재",
    병: "정관",
    정: "편관",
    무: "정인",
    기: "편인",
    경: "겁재",
    신: "비견",
    임: "상관",
    계: "식신",
  },
  임: {
    갑: "식신",
    을: "상관",
    병: "편재",
    정: "정재",
    무: "편관",
    기: "정관",
    경: "편인",
    신: "정인",
    임: "비견",
    계: "겁재",
  },
  계: {
    갑: "상관",
    을: "식신",
    병: "정재",
    정: "편재",
    무: "정관",
    기: "편관",
    경: "정인",
    신: "편인",
    임: "겁재",
    계: "비견",
  },
} as const satisfies Record<NormalizedStem, Record<NormalizedStem, string>>;

const stemByHanja: ReadonlyMap<string, NormalizedStem> = new Map(
  Object.entries(normalizedStemToHanja).map(([normalized, hanja]) => [
    hanja,
    normalized as NormalizedStem,
  ]),
);
const branchByHanja: ReadonlyMap<string, NormalizedBranch> = new Map(
  Object.entries(normalizedBranchToHanja).map(([normalized, hanja]) => [
    hanja,
    normalized as NormalizedBranch,
  ]),
);

function uniqueValues(values: readonly string[]): readonly string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function normalizePillar(raw: string | undefined): PillarPart {
  if (raw === undefined) {
    return {};
  }

  const stripped = raw.trim().replace(/일주$/u, "");
  const normalized = normalizeGanji(stripped);

  if (normalized === undefined) {
    return { raw: stripped };
  }

  const stem = normalizeStem(normalized.slice(0, 1));
  const branch = normalizeBranch(normalized.slice(1, 2));

  return {
    raw: stripped,
    normalized,
    stem,
    branch,
    stemDisplay: stripped.slice(0, 1),
    branchDisplay: stripped.slice(1, 2),
    pillarDisplay: stripped,
  };
}

function getNormalizedStemFromHanja(stem: string | undefined): NormalizedStem | undefined {
  if (stem === undefined) {
    return undefined;
  }

  return stemByHanja.get(stem) ?? normalizeStem(stem);
}

function getMainHiddenStem(branch: NormalizedBranch | undefined): NormalizedStem | undefined {
  if (branch === undefined) {
    return undefined;
  }

  return getNormalizedStemFromHanja(hiddenStemsByBranch[branch].at(-1));
}

function getTenGodLabel(
  dayMaster: NormalizedStem | undefined,
  targetStem: NormalizedStem | undefined,
): string | undefined {
  if (dayMaster === undefined || targetStem === undefined) {
    return undefined;
  }

  return tenGodKoByStem[dayMaster][targetStem];
}

function makePlacement(input: {
  readonly featureId: string;
  readonly pillar: SajuPillarKey;
  readonly pillarLabelKo: SajuPillarFeaturePlacement["pillarLabelKo"];
  readonly part: PillarPart;
  readonly basis: string;
  readonly confidence?: SajuPillarFeaturePlacement["confidence"];
}): SajuPillarFeaturePlacement | undefined {
  if (input.part.pillarDisplay === undefined) {
    return undefined;
  }

  const entry = requireSajuFeatureEntry(input.featureId);

  return {
    featureId: input.featureId,
    labelKo: entry.labelKo,
    category: entry.category,
    pillar: input.pillar,
    pillarLabelKo: input.pillarLabelKo,
    sourcePillar: input.part.pillarDisplay,
    ...(input.part.stemDisplay === undefined ? {} : { sourceStem: input.part.stemDisplay }),
    ...(input.part.branchDisplay === undefined ? {} : { sourceBranch: input.part.branchDisplay }),
    basis: input.basis,
    confidence: input.confidence ?? "production",
  };
}

function shouldIncludeFeature(
  productionFeatureIds: ReadonlySet<string> | undefined,
  featureId: string,
): boolean {
  return productionFeatureIds === undefined || productionFeatureIds.has(featureId);
}

function addPlacement(
  target: SajuPillarFeaturePlacement[],
  placement: SajuPillarFeaturePlacement | undefined,
): void {
  if (
    placement !== undefined &&
    !target.some(
      (item) => item.featureId === placement.featureId && item.pillar === placement.pillar,
    )
  ) {
    target.push(placement);
  }
}

function collectPillarParts(input: SajuPillarPlacementInput): Record<SajuPillarKey, PillarPart> {
  return {
    year: normalizePillar(input.yearPillar),
    month: normalizePillar(input.monthPillar),
    day: normalizePillar(input.dayPillar),
    hour: normalizePillar(input.hourPillar),
  };
}

function getProductionFeatureIdSet(
  featureIds: readonly string[] | undefined,
): ReadonlySet<string> | undefined {
  return featureIds === undefined ? undefined : new Set(featureIds);
}

export function buildSajuPillarFeaturePlacements(
  input: SajuPillarPlacementInput,
): readonly SajuPillarFeaturePlacement[] {
  const pillarParts = collectPillarParts(input);
  const productionFeatureIds = getProductionFeatureIdSet(input.productionFeatureIds);
  const dayMaster = normalizeStem(input.dayMaster) ?? pillarParts.day.stem;
  const dayBranch = pillarParts.day.branch ?? pillarParts.year.branch;
  const placements: SajuPillarFeaturePlacement[] = [];

  if (dayBranch !== undefined) {
    const group = getTwelveSinsalGroup(dayBranch);
    const table = twelveSinsalFeatureByGroup[group];

    for (const column of pillarOrder) {
      const part = pillarParts[column.key];
      if (part.branch === undefined) {
        continue;
      }

      const featureId = table[part.branch];
      if (shouldIncludeFeature(productionFeatureIds, featureId)) {
        addPlacement(
          placements,
          makePlacement({
            featureId,
            pillar: column.key,
            pillarLabelKo: column.labelKo,
            part,
            basis: "production V1 twelve-sinsal dayBranch fallback yearBranch",
          }),
        );
      }
    }
  }

  if (dayMaster !== undefined) {
    const gwiinRules = [
      {
        featureId: "gwiin_cheoneul",
        branches: cheoneulGwiinBranchesByStem[dayMaster],
        basis: "production V1 dayMaster 천을귀인 branch table",
      },
      {
        featureId: "gwiin_munchang",
        branches: munchangGwiinBranchesByStem[dayMaster],
        basis: "production V1 dayMaster 문창귀인 branch table",
      },
      {
        featureId: "gwiin_jaego",
        branches: jaegoGwiinBranchesByStem[dayMaster],
        basis: "production V1 dayMaster 재고귀인 branch table",
      },
      {
        featureId: "gwiin_geumyeorok",
        branches: geumyeorokBranchesByStem[dayMaster],
        basis: "production V1 dayMaster 금여록 branch table",
      },
      {
        featureId: "gwiin_amrok",
        branches: amrokBranchesByStem[dayMaster],
        basis: "production V1 dayMaster 암록 branch table",
      },
    ] as const;

    for (const rule of gwiinRules) {
      if (!shouldIncludeFeature(productionFeatureIds, rule.featureId)) {
        continue;
      }

      for (const column of pillarOrder) {
        const part = pillarParts[column.key];
        if (
          part.branch !== undefined &&
          (rule.branches as readonly NormalizedBranch[]).includes(part.branch)
        ) {
          addPlacement(
            placements,
            makePlacement({
              featureId: rule.featureId,
              pillar: column.key,
              pillarLabelKo: column.labelKo,
              part,
              basis: rule.basis,
            }),
          );
        }
      }
    }

    const yanginBranches = yanginBranchesByStem[dayMaster];
    if (shouldIncludeFeature(productionFeatureIds, "sinsal_yangin")) {
      for (const column of pillarOrder) {
        const part = pillarParts[column.key];
        if (
          part.branch !== undefined &&
          (yanginBranches as readonly NormalizedBranch[]).includes(part.branch)
        ) {
          addPlacement(
            placements,
            makePlacement({
              featureId: "sinsal_yangin",
              pillar: column.key,
              pillarLabelKo: column.labelKo,
              part,
              basis: "production V1 dayMaster 양인살 branch table",
            }),
          );
        }
      }
    }
  }

  if (
    pillarParts.day.normalized !== undefined &&
    baekhoDayPillars.has(pillarParts.day.normalized) &&
    shouldIncludeFeature(productionFeatureIds, "sinsal_baekho")
  ) {
    addPlacement(
      placements,
      makePlacement({
        featureId: "sinsal_baekho",
        pillar: "day",
        pillarLabelKo: "일주",
        part: pillarParts.day,
        basis: "production V1 백호대살 day-pillar table",
      }),
    );
  }

  if (shouldIncludeFeature(productionFeatureIds, "sinsal_hyeonchim")) {
    for (const column of pillarOrder) {
      const part = pillarParts[column.key];
      if (part.branch !== undefined && hyeonchimBranches.has(part.branch)) {
        addPlacement(
          placements,
          makePlacement({
            featureId: "sinsal_hyeonchim",
            pillar: column.key,
            pillarLabelKo: column.labelKo,
            part,
            basis: "production V1 현침살 branch table",
          }),
        );
      }
    }
  }

  return placements;
}

export function buildSajuPillarGridColumns(input: SajuPillarPlacementInput & {
  readonly featurePlacements?: readonly SajuPillarFeaturePlacement[];
}): readonly SajuPillarGridColumn[] {
  const pillarParts = collectPillarParts(input);
  const dayMaster = normalizeStem(input.dayMaster) ?? pillarParts.day.stem;
  const placements = input.featurePlacements ?? buildSajuPillarFeaturePlacements(input);

  return pillarOrder.map((column) => {
    const part = pillarParts[column.key];
    const stemTenGod = getTenGodLabel(dayMaster, part.stem);
    const branchTenGod = getTenGodLabel(dayMaster, getMainHiddenStem(part.branch));
    const hiddenStems =
      part.branch === undefined ? [] : hiddenStemsByBranch[part.branch];
    const twelveLifeStage =
      dayMaster === undefined || part.branch === undefined
        ? undefined
        : twelveLifeStageByStem[dayMaster][part.branch];
    const columnPlacements = placements.filter(
      (placement) => placement.pillar === column.key && placement.confidence === "production",
    );
    const twelveSinsal = uniqueValues(
      columnPlacements
        .filter((placement) => placement.category === "twelve_sinsal")
        .map((placement) => placement.labelKo),
    );
    const sinsal = uniqueValues(
      columnPlacements
        .filter((placement) => placement.category === "sinsal")
        .map((placement) => placement.labelKo),
    );
    const gwiin = uniqueValues(
      columnPlacements
        .filter((placement) => placement.category === "gwiin")
        .map((placement) => placement.labelKo),
    );
    const tenGod = uniqueValues([
      ...(stemTenGod === undefined ? [] : [`천간 ${stemTenGod}`]),
      ...(branchTenGod === undefined ? [] : [`지지 ${branchTenGod}`]),
    ]);

    return {
      columnId: column.key,
      labelKo: column.labelKo,
      ...(part.pillarDisplay === undefined ? {} : { pillar: part.pillarDisplay }),
      ...(part.stemDisplay === undefined ? {} : { heavenlyStem: part.stemDisplay }),
      ...(part.branchDisplay === undefined ? {} : { earthlyBranch: part.branchDisplay }),
      ...(tenGod.length === 0 ? {} : { tenGod }),
      ...(hiddenStems.length === 0 ? {} : { hiddenStems }),
      ...(twelveLifeStage === undefined ? {} : { twelveLifeStage: [twelveLifeStage] }),
      ...(twelveSinsal.length === 0 ? {} : { twelveSinsal }),
      ...(sinsal.length === 0 ? {} : { sinsal }),
      ...(gwiin.length === 0 ? {} : { gwiin }),
    };
  });
}

export function createExternalFixturePlacement(input: {
  readonly featureId: string;
  readonly labelKo?: string;
  readonly category?: SajuFeatureCategory;
  readonly pillar: SajuPillarKey;
  readonly sourcePillar: string;
  readonly basis: string;
}): SajuPillarFeaturePlacement {
  const entry = requireSajuFeatureEntry(input.featureId);
  const part = normalizePillar(input.sourcePillar);
  const pillarLabelKo = pillarOrder.find((item) => item.key === input.pillar)?.labelKo;

  if (pillarLabelKo === undefined) {
    throw new Error(`Unknown pillar key: ${input.pillar}`);
  }

  return {
    featureId: input.featureId,
    labelKo: input.labelKo ?? entry.labelKo,
    category: input.category ?? entry.category,
    pillar: input.pillar,
    pillarLabelKo,
    sourcePillar: input.sourcePillar,
    ...(part.stemDisplay === undefined ? {} : { sourceStem: part.stemDisplay }),
    ...(part.branchDisplay === undefined ? {} : { sourceBranch: part.branchDisplay }),
    basis: input.basis,
    confidence: "external_fixture",
  };
}

export const SAJU_PILLAR_DISPLAY_HELPERS = {
  normalizedStemToHanja,
  normalizedBranchToHanja,
  normalizedStemToKo,
  normalizedBranchToKo,
  hiddenStemsByBranch,
  twelveLifeStageByStem,
  tenGodKoByStem,
  branchByHanja,
} as const;
