import type {
  MbtiFunctionCode,
  MbtiFunctionDisplay,
  MbtiPreferenceCode,
  MbtiPreferenceDisplay,
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

export const mbtiPreferenceDisplays = {
  E: {
    code: "E",
    nameKo: "외향",
    nameEn: "Extravert",
    description: "외부 자극과 표현을 통해 에너지가 활성화된다.",
  },
  I: {
    code: "I",
    nameKo: "내향",
    nameEn: "Introvert",
    description: "내면의 생각과 정리를 통해 에너지가 회복된다.",
  },
  S: {
    code: "S",
    nameKo: "감각",
    nameEn: "Sensing",
    description: "현실, 경험, 실용 정보에 먼저 주의를 둔다.",
  },
  N: {
    code: "N",
    nameKo: "직관",
    nameEn: "iNtuition",
    description: "가능성, 의미, 패턴과 예측에 먼저 주의를 둔다.",
  },
  T: {
    code: "T",
    nameKo: "사고",
    nameEn: "Thinking",
    description: "논리, 사실, 원칙을 기준으로 판단한다.",
  },
  F: {
    code: "F",
    nameKo: "감정",
    nameEn: "Feeling",
    description: "관계, 가치, 사람에게 미치는 영향을 기준으로 판단한다.",
  },
  J: {
    code: "J",
    nameKo: "판단",
    nameEn: "Judging",
    description: "목표, 계획, 절차를 정리해 안정감을 만든다.",
  },
  P: {
    code: "P",
    nameKo: "인식",
    nameEn: "Perceiving",
    description: "자율성, 변화, 유동적인 선택지를 열어 둔다.",
  },
} as const satisfies Record<MbtiPreferenceCode, MbtiPreferenceDisplay>;

export const mbtiFunctionDisplays = {
  Te: {
    code: "Te",
    nameKo: "외향 사고",
    attitude: "외향",
    domain: "사고",
    description: "목표, 기준, 성과를 바깥 세계에서 구조화하고 실행한다.",
    reportUsageNote: "업무, 돈, 의사결정에서 실행 기준과 효율성을 읽는다.",
  },
  Ti: {
    code: "Ti",
    nameKo: "내향 사고",
    attitude: "내향",
    domain: "사고",
    description: "원리와 논리의 정합성을 내부 기준으로 검증한다.",
    reportUsageNote: "학습, 분석, 문제 해결에서 사고의 정밀도를 읽는다.",
  },
  Fe: {
    code: "Fe",
    nameKo: "외향 감정",
    attitude: "외향",
    domain: "감정",
    description: "관계 분위기와 집단 정서를 읽고 조율한다.",
    reportUsageNote: "관계, 협업, 사회적 역할에서 조율 방식을 읽는다.",
  },
  Fi: {
    code: "Fi",
    nameKo: "내향 감정",
    attitude: "내향",
    domain: "감정",
    description: "개인의 가치관과 진정성을 기준으로 선택한다.",
    reportUsageNote: "연애, 결혼, 성장에서 내적 기준과 상처 지점을 읽는다.",
  },
  Se: {
    code: "Se",
    nameKo: "외향 감각",
    attitude: "외향",
    domain: "감각",
    description: "현재의 감각 정보와 현실적 기회를 즉각적으로 다룬다.",
    reportUsageNote: "현장 대응, 행동력, 소비와 경험 추구 방식을 읽는다.",
  },
  Si: {
    code: "Si",
    nameKo: "내향 감각",
    attitude: "내향",
    domain: "감각",
    description: "축적된 경험과 기준을 바탕으로 안정성을 확인한다.",
    reportUsageNote: "생활 루틴, 책임감, 과거 경험의 영향력을 읽는다.",
  },
  Ne: {
    code: "Ne",
    nameKo: "외향 직관",
    attitude: "외향",
    domain: "직관",
    description: "가능성과 연결점을 확장하며 새로운 선택지를 만든다.",
    reportUsageNote: "아이디어, 전환, 관계 가능성의 확장 방식을 읽는다.",
  },
  Ni: {
    code: "Ni",
    nameKo: "내향 직관",
    attitude: "내향",
    domain: "직관",
    description: "패턴의 핵심을 압축해 장기 방향과 의미를 읽는다.",
    reportUsageNote: "진로, 대운, 세운에서 장기 방향 감각을 읽는다.",
  },
} as const satisfies Record<MbtiFunctionCode, MbtiFunctionDisplay>;

export function getMbtiPreferenceDisplay(
  code: string,
): MbtiPreferenceDisplay {
  const display = mbtiPreferenceDisplays[code as MbtiPreferenceCode];

  if (display === undefined) {
    throw new Error(`Unsupported MBTI preference code: ${code}`);
  }

  return display;
}

export function getMbtiFunctionDisplay(code: string): MbtiFunctionDisplay {
  const display = mbtiFunctionDisplays[code as MbtiFunctionCode];

  if (display === undefined) {
    throw new Error(`Unsupported MBTI function code: ${code}`);
  }

  return display;
}
