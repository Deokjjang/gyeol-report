import type {
  ReportTableBranchDisplay,
  ReportTableEarthlyBranch,
  ReportTableElementColorToken,
  ReportTableFiveElement,
  ReportTableHeavenlyStem,
  ReportTableStemDisplay,
} from "./types";

export const reportTableElementColorTokens = {
  wood: "wood-green",
  fire: "fire-red",
  earth: "earth-soil",
  metal: "metal-gold",
  water: "water-sky",
} as const satisfies Record<
  ReportTableFiveElement,
  ReportTableElementColorToken
>;

export const heavenlyStemDisplays = {
  甲: {
    hanja: "甲",
    ko: "갑",
    element: "wood",
    yinYang: "yang",
    colorToken: reportTableElementColorTokens.wood,
  },
  乙: {
    hanja: "乙",
    ko: "을",
    element: "wood",
    yinYang: "yin",
    colorToken: reportTableElementColorTokens.wood,
  },
  丙: {
    hanja: "丙",
    ko: "병",
    element: "fire",
    yinYang: "yang",
    colorToken: reportTableElementColorTokens.fire,
  },
  丁: {
    hanja: "丁",
    ko: "정",
    element: "fire",
    yinYang: "yin",
    colorToken: reportTableElementColorTokens.fire,
  },
  戊: {
    hanja: "戊",
    ko: "무",
    element: "earth",
    yinYang: "yang",
    colorToken: reportTableElementColorTokens.earth,
  },
  己: {
    hanja: "己",
    ko: "기",
    element: "earth",
    yinYang: "yin",
    colorToken: reportTableElementColorTokens.earth,
  },
  庚: {
    hanja: "庚",
    ko: "경",
    element: "metal",
    yinYang: "yang",
    colorToken: reportTableElementColorTokens.metal,
  },
  辛: {
    hanja: "辛",
    ko: "신",
    element: "metal",
    yinYang: "yin",
    colorToken: reportTableElementColorTokens.metal,
  },
  壬: {
    hanja: "壬",
    ko: "임",
    element: "water",
    yinYang: "yang",
    colorToken: reportTableElementColorTokens.water,
  },
  癸: {
    hanja: "癸",
    ko: "계",
    element: "water",
    yinYang: "yin",
    colorToken: reportTableElementColorTokens.water,
  },
} as const satisfies Record<ReportTableHeavenlyStem, ReportTableStemDisplay>;

export const earthlyBranchDisplays = {
  子: {
    hanja: "子",
    ko: "자",
    element: "water",
    yinYang: "yang",
    colorToken: reportTableElementColorTokens.water,
  },
  丑: {
    hanja: "丑",
    ko: "축",
    element: "earth",
    yinYang: "yin",
    colorToken: reportTableElementColorTokens.earth,
  },
  寅: {
    hanja: "寅",
    ko: "인",
    element: "wood",
    yinYang: "yang",
    colorToken: reportTableElementColorTokens.wood,
  },
  卯: {
    hanja: "卯",
    ko: "묘",
    element: "wood",
    yinYang: "yin",
    colorToken: reportTableElementColorTokens.wood,
  },
  辰: {
    hanja: "辰",
    ko: "진",
    element: "earth",
    yinYang: "yang",
    colorToken: reportTableElementColorTokens.earth,
  },
  巳: {
    hanja: "巳",
    ko: "사",
    element: "fire",
    yinYang: "yin",
    colorToken: reportTableElementColorTokens.fire,
  },
  午: {
    hanja: "午",
    ko: "오",
    element: "fire",
    yinYang: "yang",
    colorToken: reportTableElementColorTokens.fire,
  },
  未: {
    hanja: "未",
    ko: "미",
    element: "earth",
    yinYang: "yin",
    colorToken: reportTableElementColorTokens.earth,
  },
  申: {
    hanja: "申",
    ko: "신",
    element: "metal",
    yinYang: "yang",
    colorToken: reportTableElementColorTokens.metal,
  },
  酉: {
    hanja: "酉",
    ko: "유",
    element: "metal",
    yinYang: "yin",
    colorToken: reportTableElementColorTokens.metal,
  },
  戌: {
    hanja: "戌",
    ko: "술",
    element: "earth",
    yinYang: "yang",
    colorToken: reportTableElementColorTokens.earth,
  },
  亥: {
    hanja: "亥",
    ko: "해",
    element: "water",
    yinYang: "yin",
    colorToken: reportTableElementColorTokens.water,
  },
} as const satisfies Record<ReportTableEarthlyBranch, ReportTableBranchDisplay>;

export function getElementColorToken(
  element: ReportTableFiveElement,
): ReportTableElementColorToken {
  return reportTableElementColorTokens[element];
}

export function getStemDisplay(stem: string): ReportTableStemDisplay {
  const display = heavenlyStemDisplays[stem as ReportTableHeavenlyStem];

  if (display === undefined) {
    throw new Error(`Unsupported heavenly stem: ${stem}`);
  }

  return display;
}

export function getBranchDisplay(branch: string): ReportTableBranchDisplay {
  const display = earthlyBranchDisplays[branch as ReportTableEarthlyBranch];

  if (display === undefined) {
    throw new Error(`Unsupported earthly branch: ${branch}`);
  }

  return display;
}
