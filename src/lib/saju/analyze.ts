import {
  BRANCH_MAIN_ELEMENT,
  BRANCH_YIN_YANG,
  HIDDEN_STEMS,
  STEM_ELEMENT,
  STEM_YIN_YANG,
} from "./constants";
import { getTenGod } from "./tenGods";
import type {
  ElementLabel,
  FiveElement,
  HeavenlyStem,
  HiddenStemEntry,
  Pillar,
  TenGod,
  YinYangLabel,
} from "./types";

export type PillarSet = {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour?: Pillar;
};

export type VisibleTenGodsResult = {
  stems: Partial<Record<"year" | "month" | "hour", TenGod>>;
  distribution: Record<TenGod, number>;
};

export type ElementAnalysisResult = {
  visible: Record<FiveElement, number>;
  weighted: Record<FiveElement, number>;
  labels: ElementLabel[];
};

export type YinYangAnalysisResult = {
  yin: number;
  yang: number;
  label: YinYangLabel;
};

export type HiddenStemAnalysisResult = {
  entries: HiddenStemEntry[];
  tenGodDistribution: Record<TenGod, number>;
};

const ELEMENTS = [
  "WOOD",
  "FIRE",
  "EARTH",
  "METAL",
  "WATER",
] as const satisfies readonly FiveElement[];

const TEN_GODS = [
  "比肩",
  "劫財",
  "食神",
  "傷官",
  "偏財",
  "正財",
  "偏官",
  "正官",
  "偏印",
  "正印",
] as const satisfies readonly TenGod[];

const ELEMENT_LABELS: Record<
  FiveElement,
  {
    strong: ElementLabel;
    weak: ElementLabel;
    missing: ElementLabel;
  }
> = {
  WOOD: {
    strong: "WOOD_STRONG",
    weak: "WOOD_WEAK",
    missing: "WOOD_MISSING",
  },
  FIRE: {
    strong: "FIRE_STRONG",
    weak: "FIRE_WEAK",
    missing: "FIRE_MISSING",
  },
  EARTH: {
    strong: "EARTH_STRONG",
    weak: "EARTH_WEAK",
    missing: "EARTH_MISSING",
  },
  METAL: {
    strong: "METAL_STRONG",
    weak: "METAL_WEAK",
    missing: "METAL_MISSING",
  },
  WATER: {
    strong: "WATER_STRONG",
    weak: "WATER_WEAK",
    missing: "WATER_MISSING",
  },
};

function getExistingPillars(pillars: PillarSet): Pillar[] {
  const existingPillars = [pillars.year, pillars.month, pillars.day];

  if (pillars.hour) {
    existingPillars.push(pillars.hour);
  }

  return existingPillars;
}

function createElementLabels(
  counts: Record<FiveElement, number>,
  mode: "VISIBLE" | "WEIGHTED",
): ElementLabel[] {
  const labels: ElementLabel[] = [];

  for (const element of ELEMENTS) {
    const value = counts[element];
    const elementLabels = ELEMENT_LABELS[element];

    if (value >= 3) {
      labels.push(elementLabels.strong);
    } else if (value === 0) {
      labels.push(elementLabels.missing);
    } else if (
      (mode === "VISIBLE" && value === 1) ||
      (mode === "WEIGHTED" && value > 0 && value < 1.5)
    ) {
      labels.push(elementLabels.weak);
    }
  }

  return labels;
}

export function createEmptyElementCounts(): Record<FiveElement, number> {
  return {
    WOOD: 0,
    FIRE: 0,
    EARTH: 0,
    METAL: 0,
    WATER: 0,
  };
}

export function createEmptyTenGodDistribution(): Record<TenGod, number> {
  return {
    比肩: 0,
    劫財: 0,
    食神: 0,
    傷官: 0,
    偏財: 0,
    正財: 0,
    偏官: 0,
    正官: 0,
    偏印: 0,
    正印: 0,
  };
}

export function analyzeVisibleElements(
  pillars: PillarSet,
): ElementAnalysisResult {
  const visible = createEmptyElementCounts();

  for (const pillar of getExistingPillars(pillars)) {
    visible[STEM_ELEMENT[pillar.stem]] += 1;
    visible[BRANCH_MAIN_ELEMENT[pillar.branch]] += 1;
  }

  const weighted = { ...visible };

  return {
    visible,
    weighted,
    labels: createElementLabels(visible, "VISIBLE"),
  };
}

export function analyzeVisibleTenGods(
  pillars: PillarSet,
): VisibleTenGodsResult {
  const dayStem: HeavenlyStem = pillars.day.stem;
  const stems: Partial<Record<"year" | "month" | "hour", TenGod>> = {
    year: getTenGod(dayStem, pillars.year.stem),
    month: getTenGod(dayStem, pillars.month.stem),
  };
  const distribution = createEmptyTenGodDistribution();

  if (pillars.hour) {
    stems.hour = getTenGod(dayStem, pillars.hour.stem);
  }

  for (const tenGod of TEN_GODS) {
    const count = Object.values(stems).filter((value) => value === tenGod)
      .length;
    distribution[tenGod] += count;
  }

  return {
    stems,
    distribution,
  };
}

export function analyzeHiddenStems(
  pillars: PillarSet,
): HiddenStemAnalysisResult {
  const dayStem = pillars.day.stem;
  const entries: HiddenStemEntry[] = [];
  const tenGodDistribution = createEmptyTenGodDistribution();

  for (const pillar of getExistingPillars(pillars)) {
    const hiddenStems = HIDDEN_STEMS[pillar.branch];

    for (const hiddenStem of hiddenStems) {
      const tenGod = getTenGod(dayStem, hiddenStem.stem);
      const entry: HiddenStemEntry = {
        branch: pillar.branch,
        stem: hiddenStem.stem,
        tenGod,
        weight: hiddenStem.weight,
      };

      entries.push(entry);
      tenGodDistribution[tenGod] += hiddenStem.weight;
    }
  }

  return {
    entries,
    tenGodDistribution,
  };
}

export function analyzeWeightedElements(
  pillars: PillarSet,
): Record<FiveElement, number> {
  const weighted = createEmptyElementCounts();

  for (const pillar of getExistingPillars(pillars)) {
    weighted[STEM_ELEMENT[pillar.stem]] += 1;
    weighted[BRANCH_MAIN_ELEMENT[pillar.branch]] += 1;

    for (const hiddenStem of HIDDEN_STEMS[pillar.branch]) {
      weighted[STEM_ELEMENT[hiddenStem.stem]] += hiddenStem.weight;
    }
  }

  return weighted;
}

export function analyzeFullElements(
  pillars: PillarSet,
): ElementAnalysisResult {
  const visible = analyzeVisibleElements(pillars).visible;
  const weighted = analyzeWeightedElements(pillars);

  return {
    visible,
    weighted,
    labels: createElementLabels(weighted, "WEIGHTED"),
  };
}

export function analyzeFullTenGods(pillars: PillarSet): {
  stems: VisibleTenGodsResult["stems"];
  hiddenStems: HiddenStemEntry[];
  distribution: Record<TenGod, number>;
} {
  const visible = analyzeVisibleTenGods(pillars);
  const hidden = analyzeHiddenStems(pillars);
  const distribution = createEmptyTenGodDistribution();

  for (const tenGod of TEN_GODS) {
    distribution[tenGod] += visible.distribution[tenGod];
    distribution[tenGod] += hidden.tenGodDistribution[tenGod];
  }

  return {
    stems: visible.stems,
    hiddenStems: hidden.entries,
    distribution,
  };
}

export function analyzeVisibleYinYang(
  pillars: PillarSet,
): YinYangAnalysisResult {
  let yin = 0;
  let yang = 0;

  for (const pillar of getExistingPillars(pillars)) {
    const stemYinYang = STEM_YIN_YANG[pillar.stem];
    const branchYinYang = BRANCH_YIN_YANG[pillar.branch];

    if (stemYinYang === "YIN") {
      yin += 1;
    } else {
      yang += 1;
    }

    if (branchYinYang === "YIN") {
      yin += 1;
    } else {
      yang += 1;
    }
  }

  let label: YinYangLabel = "BALANCED";

  if (yin >= yang + 2) {
    label = "YIN_HEAVY";
  } else if (yang >= yin + 2) {
    label = "YANG_HEAVY";
  }

  return {
    yin,
    yang,
    label,
  };
}
