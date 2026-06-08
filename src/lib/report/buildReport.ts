import type {
  ReportBlock,
  ReportInput,
  ReportOutput,
  ReportSection,
} from "./types";
import type {
  EarthlyBranch,
  FiveElement,
  HeavenlyStem,
  TenGod,
} from "../saju/types";
import type { MbtiType } from "../mbti/types";

function createSection(section: ReportSection): ReportSection {
  return section;
}

function unique(values: readonly string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    if (!seen.has(value)) {
      seen.add(value);
      result.push(value);
    }
  }

  return result;
}

function getReportSubject(displayName: string | undefined): string {
  const normalized = displayName?.trim();

  return normalized ? `${normalized}님` : "당신";
}

const SAJU_TAG_DISPLAY_LABELS: Readonly<Record<string, string>> = {
  FIRE_STRONG: "화 기운 강함",
  METAL_STRONG: "금 기운 강함",
  WATER_WEAK: "수 기운 약함",
  WATER_STRONG: "수 기운 강함",
  EARTH_STRONG: "토 기운 강함",
  YIN_HEAVY: "음 기운 우세",
  YANG_HEAVY: "양 기운 우세",
  TEN_GOD_OUTPUT_STRONG: "식상 강함",
  TEN_GOD_RESOURCE_WEAK: "인성 약함",
  WEALTH_OVERLOAD: "재성 과다 후보",
  OFFICER_PRESSURE_HIGH: "관성 압박 후보",
  BRANCH_CLASH_PRESENT: "지지충 신호",
  WEAK_DAYMASTER_WITH_STRONG_WEALTH: "재다신약 후보",
};

const PILLAR_POSITION_LABELS: Readonly<Record<string, string>> = {
  year: "년주",
  month: "월주",
  day: "일주",
  hour: "시주",
};

const STEM_DISPLAY: Readonly<
  Record<
    HeavenlyStem,
    {
      readingKo: string;
      elementKo: string;
      elementHanja: string;
      energyKo: string;
    }
  >
> = {
  甲: {
    readingKo: "갑",
    elementKo: "목",
    elementHanja: "木",
    energyKo: "곧게 뻗는 나무의 기운",
  },
  乙: {
    readingKo: "을",
    elementKo: "목",
    elementHanja: "木",
    energyKo: "유연하게 자라는 풀과 덩굴의 기운",
  },
  丙: {
    readingKo: "병",
    elementKo: "화",
    elementHanja: "火",
    energyKo: "밝게 드러나는 불의 기운",
  },
  丁: {
    readingKo: "정",
    elementKo: "화",
    elementHanja: "火",
    energyKo: "섬세하게 오래 켜지는 불의 기운",
  },
  戊: {
    readingKo: "무",
    elementKo: "토",
    elementHanja: "土",
    energyKo: "크게 받쳐 주는 산과 대지의 기운",
  },
  己: {
    readingKo: "기",
    elementKo: "토",
    elementHanja: "土",
    energyKo: "차분하게 다듬고 품는 흙의 기운",
  },
  庚: {
    readingKo: "경",
    elementKo: "금",
    elementHanja: "金",
    energyKo: "단단하게 정리하고 자르는 금의 기운",
  },
  辛: {
    readingKo: "신",
    elementKo: "금",
    elementHanja: "金",
    energyKo: "정교하게 다듬는 보석 같은 금의 기운",
  },
  壬: {
    readingKo: "임",
    elementKo: "수",
    elementHanja: "水",
    energyKo: "크게 흐르며 연결하는 물의 기운",
  },
  癸: {
    readingKo: "계",
    elementKo: "수",
    elementHanja: "水",
    energyKo: "조용히 스며들어 회복을 돕는 물의 기운",
  },
};

const BRANCH_DISPLAY: Readonly<
  Record<
    EarthlyBranch,
    {
      readingKo: string;
      elementKo: string;
    }
  >
> = {
  子: { readingKo: "자", elementKo: "수" },
  丑: { readingKo: "축", elementKo: "토" },
  寅: { readingKo: "인", elementKo: "목" },
  卯: { readingKo: "묘", elementKo: "목" },
  辰: { readingKo: "진", elementKo: "토" },
  巳: { readingKo: "사", elementKo: "화" },
  午: { readingKo: "오", elementKo: "화" },
  未: { readingKo: "미", elementKo: "토" },
  申: { readingKo: "신", elementKo: "금" },
  酉: { readingKo: "유", elementKo: "금" },
  戌: { readingKo: "술", elementKo: "토" },
  亥: { readingKo: "해", elementKo: "수" },
};

const ELEMENT_DISPLAY: Readonly<
  Record<
    FiveElement,
    {
      labelKo: string;
      tendencyKo: string;
      supplementKo: string;
      colorsKo: string;
      placesKo: string;
      workExamplesKo: string;
      resourceKo: string;
      relationKo: string;
      romanceKo: string;
    }
  >
> = {
  WOOD: {
    labelKo: "목",
    tendencyKo:
      "기획, 성장, 배움, 글쓰기처럼 방향을 세우고 키워 가는 힘이 살아나기 쉽습니다.",
    supplementKo: "공원 산책, 식물 돌보기, 긴 호흡으로 계획을 다시 세우기",
    colorsKo: "그린 계열",
    placesKo: "공원, 산책로, 식물이 있는 작업 공간",
    workExamplesKo: "기획, 교육, 글쓰기, 디자인, 코칭",
    resourceKo:
      "자원을 급하게 쓰기보다 성장 가능성이 있는 곳에 나누어 배치하는 방식과 잘 맞을 수 있습니다.",
    relationKo:
      "관계에서는 상대의 가능성을 먼저 보고 북돋우는 흐름이 살아날 수 있습니다.",
    romanceKo:
      "연애에서는 속도를 정하기 전에 서로의 성장 방향을 맞춰 보는 과정이 도움이 됩니다.",
  },
  FIRE: {
    labelKo: "화",
    tendencyKo:
      "표현, 전달, 주목도, 빠른 반응에서 강점이 살아나기 쉽습니다.",
    supplementKo: "햇빛 보기, 가벼운 운동, 발표 연습, 감정을 말로 정리하기",
    colorsKo: "레드/오렌지 계열",
    placesKo: "햇빛이 드는 공간, 무대감이 있는 회의실, 운동 공간",
    workExamplesKo: "발표, 브랜딩, 콘텐츠, 세일즈, 대외 커뮤니케이션",
    resourceKo:
      "돈과 자원은 속도감 있게 움직이기 쉬워, 사용 전 우선순위를 한 번 적어 두면 균형을 잡기 좋습니다.",
    relationKo:
      "관계에서는 존재감과 반응성이 강점이 되지만 말의 온도를 함께 챙길수록 안정적입니다.",
    romanceKo:
      "연애에서는 빠른 표현이 매력이 될 수 있으나, 상대가 따라올 시간을 주면 흐름이 부드러워집니다.",
  },
  EARTH: {
    labelKo: "토",
    tendencyKo:
      "운영, 책임, 조율, 안정적인 루틴에서 힘이 살아나기 쉽습니다.",
    supplementKo: "식사 루틴, 플래너 정리, 책상 위 기준점 만들기",
    colorsKo: "베이지/브라운 계열",
    placesKo: "정돈된 책상, 안정감 있는 집 근처 공간, 루틴이 잡힌 장소",
    workExamplesKo: "운영, 관리, 프로세스 오너십, 안정성 기반 업무",
    resourceKo:
      "자원을 한 번에 크게 움직이기보다 기준과 계획을 세워 쌓아 가는 방식과 잘 맞을 수 있습니다.",
    relationKo:
      "관계에서는 책임감 있게 챙기는 흐름이 있지만 혼자 떠안지 않는 기준이 필요합니다.",
    romanceKo:
      "연애에서는 안정감을 주는 편이나, 부담을 느끼기 전에 역할을 나누는 대화가 좋습니다.",
  },
  METAL: {
    labelKo: "금",
    tendencyKo:
      "분석, 기준, 정리, 품질 관리처럼 날카롭게 구분하는 힘이 살아나기 쉽습니다.",
    supplementKo: "도구 정리, 체크리스트, 파일 정돈, 한 가지 기준으로 리뷰하기",
    colorsKo: "화이트/실버 계열",
    placesKo: "정리된 작업실, 조용한 회의 공간, 도구가 잘 갖춰진 자리",
    workExamplesKo: "전략, 법무, 금융, 품질 관리, 보안, 엔지니어링, 데이터 리뷰",
    resourceKo:
      "돈과 자원은 기준을 세워 선별하는 방식과 잘 맞으며, 세부 조건 확인이 강점이 될 수 있습니다.",
    relationKo:
      "관계에서는 핵심을 빠르게 짚는 편이라, 표현의 부드러움을 함께 두면 더 잘 전달됩니다.",
    romanceKo:
      "연애에서는 솔직함이 강점이 될 수 있으나, 판단보다 공감 순서를 먼저 두면 안정적입니다.",
  },
  WATER: {
    labelKo: "수",
    tendencyKo:
      "회복, 관찰, 연구, 연결, 감정 순환에서 균형을 잡는 힘이 살아나기 쉽습니다.",
    supplementKo: "물가 산책, 수면 루틴, 반신욕, 조용한 기록 시간",
    colorsKo: "블루/네이비 계열",
    placesKo: "물가, 조용한 카페, 집중이 되는 어두운 톤의 공간",
    workExamplesKo: "리서치, 심리, 커뮤니케이션, 기획, 글로벌/네트워크 흐름",
    resourceKo:
      "자원은 흐름을 읽고 분산해 두는 방식과 잘 맞을 수 있으며, 회복 예산도 함께 두면 좋습니다.",
    relationKo:
      "관계에서는 상대의 감정 흐름을 읽는 감각이 살아날 수 있으나, 말하지 않은 기대를 쌓지 않는 편이 좋습니다.",
    romanceKo:
      "연애에서는 깊이 있는 대화가 잘 맞을 수 있고, 감정이 고이면 글로 먼저 정리하는 방식이 도움이 됩니다.",
  },
};

const TEN_GOD_GROUPS = [
  {
    labelKo: "비겁",
    tenGods: ["比肩", "劫財"] as const satisfies readonly TenGod[],
    strongKo: "자기 기준, 독립성, 경쟁심이 살아나기 쉽습니다.",
    weakKo: "혼자 결정하기보다 내 기준을 말로 정리하는 연습이 도움이 됩니다.",
    actionKo: "내 기준을 세우고 직접 움직이는 방식",
  },
  {
    labelKo: "식상",
    tenGods: ["食神", "傷官"] as const satisfies readonly TenGod[],
    strongKo: "표현, 생산, 말과 결과물로 드러내는 힘이 강점이 될 수 있습니다.",
    weakKo: "생각을 밖으로 꺼내는 작은 결과물부터 만들면 흐름이 열리기 쉽습니다.",
    actionKo: "생각을 결과물로 바꾸는 방식",
  },
  {
    labelKo: "재성",
    tenGods: ["偏財", "正財"] as const satisfies readonly TenGod[],
    strongKo: "현실 감각, 성과, 자원 관리에 대한 감각이 살아나기 쉽습니다.",
    weakKo: "돈과 자원은 감각보다 기준표로 관리하면 균형을 잡기 좋습니다.",
    actionKo: "자원과 결과를 의식하는 방식",
  },
  {
    labelKo: "관성",
    tenGods: ["偏官", "正官"] as const satisfies readonly TenGod[],
    strongKo: "책임, 기준, 역할 의식이 강점으로 쓰일 수 있습니다.",
    weakKo: "외부 기준·규칙·평가를 의식적으로 구조화하는 편이 좋습니다.",
    actionKo: "역할과 기준 안에서 움직이는 방식",
  },
  {
    labelKo: "인성",
    tenGods: ["偏印", "正印"] as const satisfies readonly TenGod[],
    strongKo: "학습, 분석, 생각 정리 능력이 강점이 될 수 있습니다.",
    weakKo: "쉬기, 배우기, 정리하기를 일정 안에 넣어 두면 안정감을 보완하기 좋습니다.",
    actionKo: "배우고 정리한 뒤 움직이는 방식",
  },
] as const;

const MBTI_STYLE_LABELS: Readonly<Record<MbtiType, string>> = {
  INTJ: "구조 설계형",
  INTP: "원리 탐구형",
  ENTJ: "전략 추진형",
  ENTP: "가능성 실험형",
  INFJ: "의미 통찰형",
  INFP: "가치 탐색형",
  ENFJ: "관계 리드형",
  ENFP: "가능성 확장형",
  ISTJ: "체계 관리형",
  ISFJ: "안정 지원형",
  ESTJ: "현실 운영형",
  ESFJ: "관계 조율형",
  ISTP: "문제 해결형",
  ISFP: "감각 조율형",
  ESTP: "현장 실행형",
  ESFP: "분위기 표현형",
};

const MBTI_STYLE_DESCRIPTIONS: Readonly<Record<MbtiType, string>> = {
  INTJ: "큰 그림을 먼저 세우고, 구조 안에서 조용히 완성도를 높이는 구조 설계형에 가깝습니다.",
  INTP: "원리를 파고들고, 납득되는 기준을 찾을 때 사고가 선명해지는 원리 탐구형에 가깝습니다.",
  ENTJ: "목표를 세우고, 구조를 만들고, 빠르게 밀고 가는 전략 추진형에 가깝습니다.",
  ENTP: "가능성을 열어 두고, 새 관점으로 판을 흔들어 보는 가능성 실험형에 가깝습니다.",
  INFJ: "사람과 흐름의 의미를 읽고, 조용히 방향을 정리하는 내면 통찰형에 가깝습니다.",
  INFP: "가치와 진정성을 중요하게 보고, 자신만의 기준을 탐색하는 가치 탐색형에 가깝습니다.",
  ENFJ: "사람의 반응과 팀의 방향을 함께 보며 이끄는 관계 리드형에 가깝습니다.",
  ENFP: "새 가능성을 빠르게 발견하고 사람과 아이디어를 연결하는 가능성 확장형에 가깝습니다.",
  ISTJ: "정해진 기준과 절차를 지키며 안정적으로 완성하는 체계 관리형에 가깝습니다.",
  ISFJ: "주변의 필요를 세심하게 살피고 안정감을 만드는 안정 지원형에 가깝습니다.",
  ESTJ: "현실 조건을 빠르게 정리하고 실행 구조를 만드는 현실 운영형에 가깝습니다.",
  ESFJ: "관계의 분위기와 실제 도움을 함께 챙기는 관계 조율형에 가깝습니다.",
  ISTP: "상황을 관찰한 뒤 필요한 해결책을 빠르게 찾는 문제 해결형에 가깝습니다.",
  ISFP: "감각과 분위기를 세밀하게 느끼고 자연스럽게 조율하는 감각 조율형에 가깝습니다.",
  ESTP: "현장에서 바로 판단하고 움직이며 흐름을 만드는 현장 실행형에 가깝습니다.",
  ESFP: "사람과 분위기 속에서 에너지를 살리고 표현하는 분위기 표현형에 가깝습니다.",
};

const SHINSAL_NARRATIVE_TEXTS: Readonly<Record<string, string>> = {
  SHINSAL_HYEONCHIMSAL:
    "현침살이 보여, 남들이 놓치는 작은 차이를 빠르게 포착하는 예리함이 드러납니다.",
  SHINSAL_HONGYEOMSAL:
    "홍염살은 은근히 시선이 가는 매력과 감정 표현의 존재감을 더합니다.",
  SHINSAL_BAEKHODAESAL:
    "백호대살은 강한 집중력과 밀어붙이는 힘이 크게 작동할 수 있음을 보여줍니다.",
  SHINSAL_MANGSINSAL:
    "망신살은 사회적 노출과 평판에 민감하게 반응하는 흐름을 보여줍니다.",
  SHINSAL_YEOKMASAL:
    "역마살은 한곳에 고정되기보다 이동과 변화 속에서 에너지가 살아나는 흐름을 보여줍니다.",
  SHINSAL_DOHWASAL:
    "도화살은 사람들의 시선을 끌고 관계 안에서 감정 반응을 일으키는 매력을 더합니다.",
  SHINSAL_HWAGAE:
    "화개는 혼자 깊이 파고들 때 살아나는 예술성, 몰입, 내면의 깊이를 보여줍니다.",
  SHINSAL_GOSINSAL:
    "고신살은 관계 안에서도 자기만의 거리와 독립성을 지키려는 흐름을 보여줍니다.",
  SHINSAL_GWASUKSAL:
    "과숙살은 쉽게 기대기보다 스스로를 보호하고 신중하게 관계를 여는 흐름을 보여줍니다.",
  SHINSAL_CHEON_EUL_GWIIN:
    "천을귀인은 어려운 상황에서도 도움의 통로나 완충 장치가 생기기 쉬운 구조로 읽을 수 있습니다.",
  SHINSAL_TAEGEUK_GWIIN:
    "태극귀인은 복잡한 상황을 큰 흐름에서 정리하고 균형을 잡으려는 힘을 더합니다.",
  SHINSAL_MUN_CHANG_GWIIN:
    "문창귀인은 말, 글, 학습, 문서화에서 강점이 드러날 수 있는 지적 신호입니다.",
  SHINSAL_HAK_DANG_GWIIN:
    "학당귀인은 배움의 지속성과 체계적으로 익혀가는 힘을 보여주는 신호입니다.",
  SHINSAL_WOL_DEOK_GWIIN:
    "월덕귀인은 관계 안에서 분위기를 부드럽게 만들고 갈등을 완충하는 힘으로 읽을 수 있습니다.",
  SHINSAL_CHEON_DEOK_GWIIN:
    "천덕귀인은 안정감과 보호적 흐름이 더해져 위기에서 급격히 흔들리지 않도록 돕는 신호입니다.",
  SHINSAL_TWELVE_GEOPSAL:
    "겁살은 외부 압박이나 급한 변화 앞에서 반응 속도와 방어 본능이 올라오는 흐름을 보여줍니다.",
  SHINSAL_TWELVE_JAESAL:
    "재살은 경쟁과 견제, 환경적 부담 속에서 스스로를 지키며 대응하는 방식을 보여줍니다.",
  SHINSAL_TWELVE_CHEONSAL:
    "천살은 개인의 의지만으로 움직이기보다 큰 흐름과 외부 조건을 읽는 감각을 더합니다.",
  SHINSAL_TWELVE_JISAL:
    "지살은 활동 반경이 넓어지고 환경을 바꾸며 기회를 찾는 흐름을 보여줍니다.",
  SHINSAL_TWELVE_NYEONSAL:
    "년살은 사람들과의 접점에서 주목을 받거나 인상이 강하게 남는 흐름을 더합니다.",
  SHINSAL_TWELVE_WOLSAL:
    "월살은 막힘을 느끼는 상황에서 관점을 바꾸고 다시 회복하는 방식을 보여줍니다.",
  SHINSAL_TWELVE_MANGSINSAL:
    "망신살은 사회적 노출과 평판에 민감하게 반응하며, 말과 행동의 파급력을 의식하게 만듭니다.",
  SHINSAL_TWELVE_JANGSEONGSAL:
    "장성살은 앞에서 이끌고 책임을 지려는 힘이 강해지는 흐름을 보여줍니다.",
  SHINSAL_TWELVE_BANANSAL:
    "반안살은 안정된 기반을 만들고 성취를 정리해 가려는 흐름을 보여줍니다.",
  SHINSAL_TWELVE_YEOKMASAL:
    "역마살은 이동과 변화 속에서 에너지가 살아나고 활동 반경이 넓어지는 흐름을 보여줍니다.",
  SHINSAL_TWELVE_YUKHAESAL:
    "육해살은 관계나 환경 속에서 소모가 생길 때 조율과 거리감이 중요해지는 흐름을 보여줍니다.",
  SHINSAL_TWELVE_HWAGAE:
    "화개살은 혼자 깊이 몰입하고 의미를 정리하는 과정에서 내면의 깊이가 살아나는 흐름을 보여줍니다.",
};

const SHINSAL_DISPLAY_LIMIT = 10;
const SHINSAL_LIMIT_NOTICE =
  "그 밖의 신살 신호도 함께 감지되지만, 리포트에서는 해석 영향이 큰 신호를 중심으로 정리했습니다.";

function formatSajuTagLabel(value: string): string {
  return SAJU_TAG_DISPLAY_LABELS[value] ?? value;
}

function formatScore(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function formatPositionPair(value: string): string {
  const [left, right] = value.split("-");

  return `${PILLAR_POSITION_LABELS[left] ?? left}와 ${
    PILLAR_POSITION_LABELS[right] ?? right
  }`;
}

function formatRelationItem(
  labelKo: string,
  value: string,
  signalKo: string,
): string {
  const [positionPair, relationPair] = value.split(":");

  if (!positionPair || !relationPair) {
    return `${labelKo}: ${value}`;
  }

  return `${labelKo}: ${formatPositionPair(positionPair)} 사이의 ${relationPair} ${signalKo} 신호`;
}

function removeLeadingLabel(text: string, label: string): string {
  const prefix = `${label}은 `;
  const alternatePrefix = `${label}는 `;

  if (text.startsWith(prefix)) {
    return text.slice(prefix.length);
  }
  if (text.startsWith(alternatePrefix)) {
    return text.slice(alternatePrefix.length);
  }

  return text;
}

function formatShinsalNarrative(tag: {
  code: string;
  labelKo: string;
  descriptionKo: string;
}): string {
  return (
    SHINSAL_NARRATIVE_TEXTS[tag.code] ??
    `${tag.labelKo}: ${removeLeadingLabel(tag.descriptionKo, tag.labelKo)}`
  );
}

function dedupeTagsByCode<T extends { code: string }>(tags: readonly T[]): T[] {
  const seen = new Set<string>();
  const result: T[] = [];

  for (const tag of tags) {
    if (seen.has(tag.code)) {
      continue;
    }
    seen.add(tag.code);
    result.push(tag);
  }

  return result;
}

function normalizeShinsalDisplayGroup(itemKo: string): string {
  if (itemKo.includes("천을귀인")) {
    return "천을귀인";
  }
  if (itemKo.includes("월덕귀인")) {
    return "월덕귀인";
  }
  if (itemKo.includes("천덕귀인")) {
    return "천덕귀인";
  }
  if (itemKo.includes("태극귀인")) {
    return "태극귀인";
  }
  if (itemKo.includes("문창귀인")) {
    return "문창귀인";
  }
  if (itemKo.includes("학당귀인")) {
    return "학당귀인";
  }
  if (itemKo.includes("현침살")) {
    return "현침살";
  }
  if (itemKo.includes("백호대살")) {
    return "백호대살";
  }
  if (itemKo.includes("역마살") || itemKo.includes("역마")) {
    return "역마";
  }
  if (itemKo.includes("화개살") || itemKo.includes("화개")) {
    return "화개";
  }
  if (itemKo.includes("지살")) {
    return "지살";
  }
  if (
    itemKo.includes("도화살") ||
    itemKo.includes("도화") ||
    itemKo.includes("년살") ||
    itemKo.includes("홍염살") ||
    itemKo.includes("홍염")
  ) {
    return "매력/주목";
  }

  return "기타";
}

function getShinsalDisplayPriority(group: string): number {
  switch (group) {
    case "천을귀인":
      return 0;
    case "월덕귀인":
      return 1;
    case "천덕귀인":
      return 2;
    case "태극귀인":
      return 3;
    case "문창귀인":
      return 4;
    case "학당귀인":
      return 5;
    case "현침살":
      return 6;
    case "백호대살":
      return 7;
    case "역마":
      return 8;
    case "화개":
      return 9;
    case "지살":
      return 10;
    case "매력/주목":
      return 11;
    default:
      return 12;
  }
}

function selectVisibleShinsalItems(itemsKo: readonly string[]): string[] {
  const indexed = itemsKo.map((text, index) => ({
    text,
    index,
    group: normalizeShinsalDisplayGroup(text),
  }));
  const selected: string[] = [];
  const seen = new Set<string>();

  indexed.sort((left, right) => {
    const diff =
      getShinsalDisplayPriority(left.group) -
      getShinsalDisplayPriority(right.group);

    return diff === 0 ? left.index - right.index : diff;
  });

  for (const item of indexed) {
    if (seen.has(item.group)) {
      continue;
    }
    seen.add(item.group);
    selected.push(item.text);
  }

  const limited = selected.slice(0, SHINSAL_DISPLAY_LIMIT);

  if (selected.length > SHINSAL_DISPLAY_LIMIT) {
    limited.push(SHINSAL_LIMIT_NOTICE);
  }

  return limited;
}

function formatPillarKo(pillar: { stem: HeavenlyStem; branch: EarthlyBranch }): string {
  const stem = STEM_DISPLAY[pillar.stem];
  const branch = BRANCH_DISPLAY[pillar.branch];

  return `${pillar.stem}${pillar.branch} ${stem.readingKo}${branch.readingKo} — ${stem.readingKo}${stem.elementKo} + ${branch.readingKo}${branch.elementKo}`;
}

function formatDayMasterKo(stem: HeavenlyStem): string {
  const display = STEM_DISPLAY[stem];

  return `${stem}${display.elementHanja} ${display.readingKo}${display.elementKo} 일간 — ${display.energyKo}`;
}

function getElementEntries(input: ReportInput): {
  element: FiveElement;
  value: number;
}[] {
  return (Object.keys(ELEMENT_DISPLAY) as FiveElement[])
    .map((element) => ({
      element,
      value: input.saju.elements.weighted[element],
    }))
    .sort((left, right) => right.value - left.value);
}

function getPrimaryElement(input: ReportInput): FiveElement {
  return getElementEntries(input)[0]?.element ?? "FIRE";
}

function getWeakElement(input: ReportInput): FiveElement {
  return [...getElementEntries(input)].reverse()[0]?.element ?? "WATER";
}

function formatElementLevel(value: number): string {
  if (value >= 3) {
    return "높음";
  }
  if (value <= 1) {
    return "낮음";
  }

  return "중간";
}

function buildElementBalanceItems(input: ReportInput): string[] {
  return getElementEntries(input).map(({ element, value }) => {
    const display = ELEMENT_DISPLAY[element];
    const level = formatElementLevel(value);

    if (value <= 1) {
      return `${display.labelKo}: ${level} (${formatScore(value)}) — ${display.supplementKo} 같은 보완 루틴을 의식적으로 챙겨야 균형이 맞습니다.`;
    }

    return `${display.labelKo}: ${level} (${formatScore(value)}) — ${display.tendencyKo}`;
  });
}

function buildElementPracticalItems(input: ReportInput): string[] {
  const primary = ELEMENT_DISPLAY[getPrimaryElement(input)];
  const weak = ELEMENT_DISPLAY[getWeakElement(input)];

  return [
    `많은 기운: ${primary.labelKo} — ${primary.tendencyKo}`,
    `부족한 기운: ${weak.labelKo} — ${weak.supplementKo}. 의식적으로 챙겨야 균형이 맞습니다.`,
    `추천 색상: ${weak.colorsKo}은 보완을 돕는 상징으로 활용할 수 있습니다.`,
    `추천 공간: ${weak.placesKo}처럼 몸이 차분해지는 장소가 도움이 될 수 있습니다.`,
    `보완 루틴: ${weak.supplementKo}`,
    "추천 색상과 공간은 결과를 보장하는 요소가 아니라, 부족한 기운을 의식적으로 떠올리는 리마인드 도구로 보는 편이 좋습니다.",
  ];
}

function sumTenGodGroup(
  input: ReportInput,
  tenGods: readonly TenGod[],
): number {
  return tenGods.reduce(
    (total, tenGod) => total + input.saju.tenGods.distribution[tenGod],
    0,
  );
}

function getTenGodGroupEntries(input: ReportInput): {
  labelKo: string;
  score: number;
  strongKo: string;
  weakKo: string;
  actionKo: string;
}[] {
  return TEN_GOD_GROUPS.map((group) => ({
    labelKo: group.labelKo,
    score: sumTenGodGroup(input, group.tenGods),
    strongKo: group.strongKo,
    weakKo: group.weakKo,
    actionKo: group.actionKo,
  })).sort((left, right) => right.score - left.score);
}

function buildStrongTenGodItems(input: ReportInput): string[] {
  return getTenGodGroupEntries(input)
    .slice(0, 2)
    .map((entry) => `${entry.labelKo}: ${entry.strongKo}`);
}

function buildWeakTenGodItems(input: ReportInput): string[] {
  return [...getTenGodGroupEntries(input)]
    .reverse()
    .slice(0, 2)
    .map((entry) => `${entry.labelKo}: ${entry.weakKo}`);
}

function buildMovementStyleItems(input: ReportInput): string[] {
  return getTenGodGroupEntries(input)
    .slice(0, 3)
    .map((entry) => `${entry.labelKo}: ${entry.actionKo}`);
}

function getStructureKeywordItems(input: ReportInput): string[] {
  return unique([
    ...(input.structureAnalysis?.summary.keywordsKo ?? []),
    ...input.saju.elements.labels.slice(0, 2).map(formatSajuTagLabel),
    input.mbti.type,
    MBTI_STYLE_LABELS[input.mbti.type],
  ]).slice(0, 5);
}

function buildHookSummaryItems(input: ReportInput): string[] {
  const weak = ELEMENT_DISPLAY[getWeakElement(input)];
  const style = MBTI_STYLE_LABELS[input.mbti.type];

  return [
    buildPersonalizedOpening(input),
    `${input.mbti.type} ${style} 성향과 함께 볼 때, 판단과 실행의 속도를 실전에서 쓰기 쉬운 편으로 읽을 수 있습니다.`,
    `다만 ${weak.labelKo} 기운의 보완 루틴을 챙길수록 강점이 안정적으로 쓰입니다.`,
  ];
}

function buildPersonalizedOpening(input: ReportInput): string {
  const primary = ELEMENT_DISPLAY[getPrimaryElement(input)];
  const subject = getReportSubject(input.displayName);

  return `${subject}은 ${primary.labelKo} 기운의 ${primary.tendencyKo}`;
}

function buildStrengthItems(input: ReportInput): string[] {
  const primary = ELEMENT_DISPLAY[getPrimaryElement(input)];
  const tenGod = getTenGodGroupEntries(input)[0];
  const dayMaster = STEM_DISPLAY[input.saju.dayMaster];

  return unique([
    `${dayMaster.readingKo}${dayMaster.elementKo} 일간의 ${dayMaster.energyKo}이 자기 표현의 중심으로 작동할 수 있습니다.`,
    `${primary.labelKo} 기운: ${primary.tendencyKo}`,
    tenGod
      ? `${tenGod.labelKo}: ${tenGod.strongKo}`
      : "상황을 보고 조율하는 힘이 살아날 수 있습니다.",
  ]).slice(0, 3);
}

function buildCautionItems(input: ReportInput): string[] {
  const weak = ELEMENT_DISPLAY[getWeakElement(input)];
  const tenGod = [...getTenGodGroupEntries(input)].reverse()[0];

  return unique([
    `${weak.labelKo} 기운 보완: ${weak.supplementKo}`,
    tenGod
      ? `${tenGod.labelKo}: ${tenGod.weakKo}`
      : "속도와 회복의 균형을 함께 보는 편이 좋습니다.",
    "빠르게 결론을 내릴 때는 말의 온도와 쉬는 시간을 함께 챙기면 좋습니다.",
  ]).slice(0, 3);
}

function buildTodayRoutineItems(input: ReportInput): string[] {
  const weak = ELEMENT_DISPLAY[getWeakElement(input)];
  const primary = ELEMENT_DISPLAY[getPrimaryElement(input)];

  return [
    `추천 루틴: ${weak.supplementKo}`,
    `추천 공간: ${weak.placesKo}`,
    `추천 색상: ${weak.colorsKo}`,
    `추천 일의 방식: ${primary.workExamplesKo}처럼 강점이 바로 보이는 역할 예시를 참고해 보세요.`,
    "피하면 좋은 패턴: 회복 없이 속도만 올리는 방식",
  ];
}

function createQuickSummaryBlocks(input: ReportInput): ReportBlock[] {
  return [
    {
      kind: "PARAGRAPH",
      titleKo: "나를 부르는 첫 문장",
      bodyKo: buildPersonalizedOpening(input),
    },
    {
      kind: "BULLET_LIST",
      titleKo: "3줄 요약",
      itemsKo: buildHookSummaryItems(input),
    },
    {
      kind: "BULLET_LIST",
      titleKo: "강점",
      itemsKo: buildStrengthItems(input),
    },
    {
      kind: "BULLET_LIST",
      titleKo: "주의할 흐름",
      itemsKo: buildCautionItems(input),
    },
    {
      kind: "BULLET_LIST",
      titleKo: "키워드",
      itemsKo: getStructureKeywordItems(input),
    },
    {
      kind: "BULLET_LIST",
      titleKo: "오늘부터 써먹는 루틴",
      itemsKo: buildTodayRoutineItems(input).slice(0, 3),
    },
  ];
}

function createSajuCoreBlock(input: ReportInput): ReportBlock {
  const { pillars } = input.saju;

  return {
    kind: "KEY_VALUE",
    keyValues: [
      {
        keyKo: "년주",
        valueKo: formatPillarKo(pillars.year),
      },
      {
        keyKo: "월주",
        valueKo: formatPillarKo(pillars.month),
      },
      {
        keyKo: "일주",
        valueKo: formatPillarKo(pillars.day),
      },
      {
        keyKo: "시주",
        valueKo: pillars.hour
          ? formatPillarKo(pillars.hour)
          : "모름",
      },
    ],
  };
}

function createElementsBlock(input: ReportInput): ReportBlock {
  return {
    kind: "BULLET_LIST",
    titleKo: "오행 밸런스",
    itemsKo: buildElementBalanceItems(input),
  };
}

function createElementsPracticalGuideBlock(): ReportBlock {
  return {
    kind: "BULLET_LIST",
    titleKo: "오행 실전 기준",
    itemsKo: [
      "오행은 좋고 나쁨을 나누는 점수가 아니라, 에너지가 어떤 방식으로 쓰이기 쉬운지 보는 언어입니다.",
      "부족한 기운은 억지로 채우기보다 환경, 루틴, 일의 방식으로 보완하는 편이 현실적입니다.",
    ],
  };
}

function createElementsInterpretationBlock(input: ReportInput): ReportBlock {
  return {
    kind: "BULLET_LIST",
    titleKo: "추천 색상·공간·보완 루틴",
    itemsKo: buildElementPracticalItems(input),
  };
}

function createTenGodsBlock(input: ReportInput): ReportBlock {
  const { distribution } = input.saju.tenGods;

  return {
    kind: "KEY_VALUE",
    titleKo: "고급 참고 점수",
    keyValues: [
      { keyKo: "비견", valueKo: formatScore(distribution.比肩) },
      { keyKo: "겁재", valueKo: formatScore(distribution.劫財) },
      { keyKo: "식신", valueKo: formatScore(distribution.食神) },
      { keyKo: "상관", valueKo: formatScore(distribution.傷官) },
      { keyKo: "편재", valueKo: formatScore(distribution.偏財) },
      { keyKo: "정재", valueKo: formatScore(distribution.正財) },
      { keyKo: "편관", valueKo: formatScore(distribution.偏官) },
      { keyKo: "정관", valueKo: formatScore(distribution.正官) },
      { keyKo: "편인", valueKo: formatScore(distribution.偏印) },
      { keyKo: "정인", valueKo: formatScore(distribution.正印) },
    ],
  };
}

function createTenGodsUserFacingBlocks(input: ReportInput): ReportBlock[] {
  return [
    {
      kind: "PARAGRAPH",
      titleKo: "십성 실전 기준",
      bodyKo:
        "십성은 성격표가 아니라 관계, 일, 자원, 표현 방식이 어디로 흐르기 쉬운지 보는 기준입니다.",
    },
    {
      kind: "BULLET_LIST",
      titleKo: "강하게 보이는 흐름",
      itemsKo: buildStrongTenGodItems(input),
    },
    {
      kind: "BULLET_LIST",
      titleKo: "보완하면 좋은 흐름",
      itemsKo: buildWeakTenGodItems(input),
    },
    {
      kind: "BULLET_LIST",
      titleKo: "내가 움직이는 방식",
      itemsKo: buildMovementStyleItems(input),
    },
  ];
}

function createTenGodsInterpretationBlock(): ReportBlock {
  return {
    kind: "PARAGRAPH",
    titleKo: "십성 흐름",
    bodyKo:
      "편인과 비견의 점수가 상대적으로 높게 나타나 자기 기준, 학습성, 독립적 판단이 강하게 작동할 수 있습니다. 재성과 관성도 함께 존재하므로 현실 책임과 성과 압박을 동시에 의식하는 구조로 볼 수 있습니다.",
  };
}

function buildTenGodsSummaryFromStructure(
  structureAnalysis: NonNullable<ReportInput["structureAnalysis"]>,
): string {
  const strengthLabel = structureAnalysis.dayMasterStrength.labelKo;
  const patternLabels = structureAnalysis.patterns
    .slice(0, 2)
    .map((pattern) => pattern.labelKo);

  if (patternLabels.length > 0) {
    return `십성 묶음으로 보면 이 사주는 ${strengthLabel} 흐름 위에 ${patternLabels.join(", ")} 신호가 함께 보입니다. 자기 기준과 학습·분석의 힘은 강하게 살아나지만, 재성·관성처럼 현실 성과와 역할을 다루는 기운도 함께 확인해야 합니다.`;
  }

  return `십성 묶음으로 보면 이 사주는 ${strengthLabel} 흐름을 중심으로 해석할 수 있습니다. 특정 한 기운만 보기보다 비겁·인성·식상·재성·관성의 균형을 함께 보는 편이 적절합니다.`;
}

function buildTenGodsPointItems(
  structureAnalysis: NonNullable<ReportInput["structureAnalysis"]>,
): string[] {
  const evidence = structureAnalysis.dayMasterStrength.evidence;
  const pointLabels = [
    {
      keyKo: "비겁",
      bodyKo: "자기 기준, 독립성, 경쟁심, 직접 밀고 나가는 힘을 봅니다.",
    },
    {
      keyKo: "인성",
      bodyKo: "학습, 분석, 보호 본능, 생각을 정리하는 힘을 봅니다.",
    },
    {
      keyKo: "식상",
      bodyKo: "표현, 생산, 말과 결과물로 자신을 드러내는 방식을 봅니다.",
    },
    {
      keyKo: "재성",
      bodyKo: "현실 감각, 성과, 자원 관리, 결과 의식을 봅니다.",
    },
    {
      keyKo: "관성",
      bodyKo: "책임, 기준, 평가, 역할 의식을 봅니다.",
    },
  ] as const;
  const items: string[] = [];

  for (const point of pointLabels) {
    const item = evidence.find((entry) => entry.keyKo === point.keyKo);

    if (item) {
      items.push(`${point.keyKo} ${item.valueKo}: ${point.bodyKo}`);
    }
  }

  return items;
}

function createTenGodsStructureBlocks(
  structureAnalysis: NonNullable<ReportInput["structureAnalysis"]>,
): ReportBlock[] {
  return [
    {
      kind: "KEY_VALUE",
      titleKo: "십성 묶음",
      keyValues: structureAnalysis.dayMasterStrength.evidence.map((item) => ({
        keyKo: item.keyKo,
        valueKo: item.valueKo,
      })),
    },
    {
      kind: "PARAGRAPH",
      titleKo: "십성 종합",
      bodyKo: buildTenGodsSummaryFromStructure(structureAnalysis),
    },
    {
      kind: "BULLET_LIST",
      titleKo: "십성 해석 포인트",
      itemsKo: buildTenGodsPointItems(structureAnalysis),
    },
  ];
}

function createTenGodsBlocks(input: ReportInput): ReportBlock[] {
  const blocks = [...createTenGodsUserFacingBlocks(input), createTenGodsBlock(input)];

  if (input.structureAnalysis) {
    blocks.push(...createTenGodsStructureBlocks(input.structureAnalysis));
  } else {
    blocks.push(createTenGodsInterpretationBlock());
  }

  return blocks;
}

function createDayMasterInterpretationBlock(input: ReportInput): ReportBlock {
  if (input.saju.pillars.day.stem === "丙") {
    return {
      kind: "PARAGRAPH",
      titleKo: "일간 해석",
      bodyKo:
        "丙 일간은 밝게 드러나는 화의 성질을 기준으로 자신을 표현합니다. 전체 구조에서는 추진력과 표현성이 장점으로 작동할 수 있지만, 주변 기운이 강할수록 속도 조절과 감정 소모 관리가 중요합니다.",
    };
  }

  return {
    kind: "PARAGRAPH",
    titleKo: "일간 해석",
    bodyKo:
      "일간은 사주에서 나를 대표하는 기준점이며, 주변 기운과의 관계 속에서 성향과 대응 방식이 달라질 수 있습니다.",
  };
}

function createDayMasterBlocks(input: ReportInput): ReportBlock[] {
  const blocks: ReportBlock[] = [
    {
      kind: "HIGHLIGHT",
      titleKo: "일간",
      bodyKo: formatDayMasterKo(input.saju.dayMaster),
    },
  ];
  const lookup = input.dayPillarProfile;

  if (!lookup?.ok) {
    blocks.push(createDayMasterInterpretationBlock(input));
    return blocks;
  }

  const { profile } = lookup;

  blocks.push(
    {
      kind: "KEY_VALUE",
      titleKo: "일주",
      keyValues: [
        {
          keyKo: "일주",
          valueKo: profile.nameKo,
        },
        {
          keyKo: "이미지",
          valueKo: profile.imageKo,
        },
      ],
    },
    {
      kind: "PARAGRAPH",
      titleKo: "일주 핵심",
      bodyKo: profile.coreSummaryKo,
    },
    {
      kind: "PARAGRAPH",
      titleKo: "일주 구조",
      bodyKo: profile.structureKo,
    },
    {
      kind: "BULLET_LIST",
      titleKo: "강점",
      itemsKo: profile.strengthItems.map(
        (item) => `${item.titleKo}: ${item.bodyKo}`,
      ),
    },
    {
      kind: "BULLET_LIST",
      titleKo: "주의할 흐름",
      itemsKo: profile.cautionItems.map(
        (item) => `${item.titleKo}: ${item.bodyKo}`,
      ),
    },
    {
      kind: "BULLET_LIST",
      titleKo: "활용 방향",
      itemsKo: profile.developmentItems.map(
        (item) => `${item.titleKo}: ${item.bodyKo}`,
      ),
    },
  );

  return blocks;
}

function createAdvancedPatternsFallbackBlock(input: ReportInput): ReportBlock {
  const labels = input.sajuTags
    .filter((tag) => tag.category === "ADVANCED_PATTERN")
    .map((tag) => formatSajuTagLabel(tag.labelKo || tag.code));

  if (labels.length > 0) {
    return {
      kind: "BULLET_LIST",
      titleKo: "구조 후보",
      itemsKo: labels,
    };
  }

  return {
    kind: "PARAGRAPH",
    bodyKo: "현재 기준에서 강하게 표시할 고급 구조 후보는 없습니다.",
  };
}

function createAdvancedPatternsBlocks(input: ReportInput): ReportBlock[] {
  const structureAnalysis = input.structureAnalysis;

  if (!structureAnalysis) {
    return [createAdvancedPatternsFallbackBlock(input)];
  }

  const blocks: ReportBlock[] = [
    {
      kind: "HIGHLIGHT",
      titleKo: "신강신약",
      bodyKo: `${structureAnalysis.dayMasterStrength.labelKo}: ${structureAnalysis.dayMasterStrength.summaryKo}`,
    },
    {
      kind: "KEY_VALUE",
      titleKo: "구조 근거",
      keyValues: structureAnalysis.dayMasterStrength.evidence.map((item) => ({
        keyKo: item.keyKo,
        valueKo: item.valueKo,
      })),
    },
    {
      kind: "PARAGRAPH",
      titleKo: structureAnalysis.summary.titleKo,
      bodyKo: structureAnalysis.summary.bodyKo,
    },
  ];

  if (structureAnalysis.patterns.length > 0) {
    blocks.push({
      kind: "BULLET_LIST",
      titleKo: "구조 후보",
      itemsKo: structureAnalysis.patterns.map(
        (pattern) => `${pattern.labelKo}: ${pattern.summaryKo}`,
      ),
    });
  } else {
    blocks.push({
      kind: "PARAGRAPH",
      titleKo: "구조 후보",
      bodyKo:
        "현재 계산된 신호만으로는 특정 구조 하나를 강하게 잡기보다 전체 균형을 함께 보는 편이 적절합니다.",
    });
  }

  if (structureAnalysis.notices.length > 0) {
    blocks.push({
      kind: "BULLET_LIST",
      titleKo: "해석 기준",
      itemsKo: [...structureAnalysis.notices],
    });
  }

  return blocks;
}

function createShinsalBlock(input: ReportInput): ReportBlock {
  const shinsalTags = input.sajuTags.filter((tag) => tag.category === "SHINSAL");
  const itemsKo = selectVisibleShinsalItems(
    dedupeTagsByCode(shinsalTags).map(formatShinsalNarrative),
  );

  if (itemsKo.length > 0) {
    return {
      kind: "BULLET_LIST",
      titleKo: "핵심 신호 Top",
      itemsKo,
    };
  }

  return {
    kind: "PARAGRAPH",
    bodyKo: "현재 기준에서 강하게 표시할 신살·귀인 신호는 없습니다.",
  };
}

function createShinsalReadingGuideBlock(): ReportBlock {
  return {
    kind: "BULLET_LIST",
    titleKo: "해석 기준",
    itemsKo: [
      "같은 신호가 여러 위치에서 반복되면, 그 의미는 단정이 아니라 반복해서 드러나기 쉬운 성향으로 읽습니다.",
      "년·월·일·시의 위치는 사건을 단정하는 기준이 아니라, 기질이 드러나기 쉬운 생활 맥락을 나누어 보는 기준입니다.",
      "귀인은 누군가가 알아서 도와준다는 뜻보다, 도움받기 쉬운 태도와 연결 방식을 보여주는 신호로 읽는 편이 안전합니다.",
    ],
  };
}

function createShinsalRepeatedSignalBlock(input: ReportInput): ReportBlock {
  const counts = new Map<string, { labelKo: string; count: number }>();

  for (const detection of input.saju.shinsal) {
    const current = counts.get(detection.code);

    counts.set(detection.code, {
      labelKo: detection.labelKo,
      count: (current?.count ?? 0) + 1,
    });
  }

  const repeated = [...counts.values()]
    .filter((item) => item.count > 1)
    .map((item) => `${item.labelKo}: ${item.count}개 위치에서 반복 감지`);

  return {
    kind: "BULLET_LIST",
    titleKo: "반복 신호",
    itemsKo:
      repeated.length > 0
        ? repeated
        : [
            "현재 계산에서는 같은 신호가 여러 위치에 반복되기보다, 서로 다른 신호가 섞여 보입니다.",
          ],
  };
}

function createShinsalPracticalBlock(input: ReportInput): ReportBlock {
  const codes = new Set(input.saju.shinsal.map((item) => item.code));
  const items: string[] = [
    "일에서는 집중력, 검수, 분석, 표현 방식으로 드러날 수 있습니다.",
    "관계에서는 말의 강도, 거리 조절, 반응 속도를 점검하는 데 도움이 됩니다.",
    "자기관리에서는 예민함을 줄이는 루틴보다 예민함을 쓸 곳과 쉬게 할 곳을 나누는 편이 좋습니다.",
  ];

  if (codes.has("HYEONCHIMSAL")) {
    items.push(
      "현침살 계열 신호는 작은 차이를 빠르게 포착하는 예리함으로 읽을 수 있습니다.",
    );
  }
  if (codes.has("MUN_CHANG_GWIIN") || codes.has("HAK_DANG_GWIIN")) {
    items.push(
      "문창·학당 계열 신호는 말, 글, 학습, 문서화에서 강점이 살아날 수 있습니다.",
    );
  }
  if (codes.has("YEOKMASAL") || codes.has("TWELVE_YEOKMASAL")) {
    items.push(
      "역마 계열 신호는 고정된 환경보다 이동과 변화 속에서 에너지가 살아나기 쉽습니다.",
    );
  }
  if (codes.has("CHEON_EUL_GWIIN") || codes.has("WOL_DEOK_GWIIN")) {
    items.push(
      "귀인 계열 신호는 관계 안에서 도움을 주고받는 장면을 의식적으로 만드는 편이 좋습니다.",
    );
  }

  return {
    kind: "BULLET_LIST",
    titleKo: "실전 해석",
    itemsKo:
      items.length > 0
        ? items
        : ["신살·귀인 신호는 성향을 보조로 읽는 참고값으로 다루는 편이 좋습니다."],
  };
}

function createShinsalBlocks(input: ReportInput): ReportBlock[] {
  return [
    createShinsalBlock(input),
    createShinsalReadingGuideBlock(),
    createShinsalRepeatedSignalBlock(input),
    createShinsalPracticalBlock(input),
  ];
}

function createRelationsBlock(input: ReportInput): ReportBlock {
  const { relations } = input.saju;
  const itemsKo = [
    ...relations.stemCombinations.map((value) =>
      formatRelationItem("천간합", value, "합"),
    ),
    ...relations.branchCombinations.map((value) =>
      formatRelationItem("지지합", value, "합"),
    ),
    ...relations.branchClashes.map((value) =>
      formatRelationItem("지지충", value, "충"),
    ),
  ];

  if (itemsKo.length > 0) {
    return {
      kind: "BULLET_LIST",
      titleKo: "합·충 신호",
      itemsKo,
    };
  }

  return {
    kind: "PARAGRAPH",
    bodyKo: "뚜렷한 합·충 신호가 감지되지 않았습니다.",
  };
}

function createBridgeBlock(input: ReportInput): ReportBlock {
  if (input.bridgeSignals.length > 0) {
    return {
      kind: "BULLET_LIST",
      titleKo: "겹침과 차이",
      itemsKo: input.bridgeSignals.map((signal) => signal.titleKo),
    };
  }

  return {
    kind: "PARAGRAPH",
    bodyKo: "현재 기준에서 강하게 연결되는 사주×MBTI 신호는 없습니다.",
  };
}

function createMbtiProfileBlocks(input: ReportInput): ReportBlock[] {
  return [
    {
      kind: "KEY_VALUE",
      titleKo: "MBTI 기본 정보",
      keyValues: [
        {
          keyKo: "입력 MBTI",
          valueKo: input.mbti.type,
        },
        {
          keyKo: "스타일 이름",
          valueKo: MBTI_STYLE_LABELS[input.mbti.type],
        },
      ],
    },
    {
      kind: "PARAGRAPH",
      titleKo: "스타일 설명",
      bodyKo: MBTI_STYLE_DESCRIPTIONS[input.mbti.type],
    },
    {
      kind: "BULLET_LIST",
      titleKo: "핵심 키워드",
      itemsKo: input.mbti.traits.map((trait) => trait.labelKo).slice(0, 6),
    },
    {
      kind: "PARAGRAPH",
      titleKo: "자기보고 안내",
      bodyKo:
        "MBTI는 내가 인식하는 나의 모습이 반영되기 쉽습니다. 가능하면 나를 오래 본 사람의 피드백이나 여러 번의 검사 결과를 함께 참고하면 더 안정적으로 볼 수 있습니다.",
    },
  ];
}

function createSajuMbtiConnectionBlocks(input: ReportInput): ReportBlock[] {
  const suggestion = input.mbtiSuggestion;
  const matchingAxes = suggestion?.comparison.matchingAxes ?? [];
  const tensionAxes = suggestion?.comparison.tensionAxes ?? [];
  const primary = ELEMENT_DISPLAY[getPrimaryElement(input)];
  const strongestTenGod = getTenGodGroupEntries(input)[0]?.labelKo ?? "균형";
  const style = MBTI_STYLE_LABELS[input.mbti.type];

  return [
    createBridgeBlock(input),
    {
      kind: "BULLET_LIST",
      titleKo: "겹치는 점",
      itemsKo:
        matchingAxes.length > 0
          ? matchingAxes.map(
              (axis) =>
                `${axis} 축은 입력 MBTI와 사주 기반 신호가 비슷하게 보입니다.`,
            )
          : [
              "입력 MBTI는 존중하되, 현재 사주 신호와 겹치는 축은 제한적으로 읽힙니다.",
            ],
    },
    {
      kind: "BULLET_LIST",
      titleKo: "다르게 보이는 점",
      itemsKo:
        tensionAxes.length > 0
          ? tensionAxes.map(
              (axis) =>
                `${axis} 축은 입력한 MBTI와 사주 구조에서 다르게 보일 수 있습니다.`,
            )
          : ["입력 MBTI와 사주 구조 사이의 큰 긴장은 현재 강하게 보이지 않습니다."],
    },
    {
      kind: "PARAGRAPH",
      titleKo: "사주상 더 강하게 보이는 성향",
      bodyKo: `${primary.labelKo} 기운과 ${strongestTenGod} 흐름이 함께 보여, ${primary.tendencyKo}`,
    },
    {
      kind: "PARAGRAPH",
      titleKo: "입력 MBTI 안에서의 세부 스타일",
      bodyKo:
        input.mbti.type === "ENTJ"
          ? "입력 MBTI가 ENTJ라면, 이 리포트에서는 강한 외향 추진형이라기보다 분석과 기준이 강한 전략형 ENTJ에 가깝게 읽을 수 있습니다."
          : `${input.mbti.type} ${style} 안에서도 사주 구조에 따라 표현 방식과 회복 방식은 다르게 나타날 수 있습니다.`,
    },
  ];
}

function createPracticalPointBlocks(input: ReportInput): ReportBlock[] {
  const primary = ELEMENT_DISPLAY[getPrimaryElement(input)];
  const weak = ELEMENT_DISPLAY[getWeakElement(input)];
  const tenGod = getTenGodGroupEntries(input)[0];

  return [
    {
      kind: "BULLET_LIST",
      titleKo: "실전 해석 기준",
      itemsKo: [
        "일에서는 강한 기운을 더 쓰는 역할과 부족한 기운을 보완해 주는 환경을 나누어 보는 것이 도움이 됩니다.",
        "돈과 자원은 많이 들어오는지보다, 관리·판단·교환·축적 중 어느 방식에서 안정감이 생기는지를 보는 편이 안전합니다.",
        "관계에서는 내가 편하게 쓰는 반응 방식과 상대가 부담스럽게 느낄 수 있는 반응 방식을 함께 보는 것이 좋습니다.",
      ],
    },
    {
      kind: "PARAGRAPH",
      titleKo: "잘 맞는 역할",
      bodyKo: `${primary.labelKo} 기운이 두드러져 ${primary.tendencyKo} 앞에서 말하고 설득하거나, 메시지를 정리해 드러내는 역할처럼 강점이 바로 보이는 구조와 잘 맞을 수 있습니다.`,
    },
    {
      kind: "BULLET_LIST",
      titleKo: "강점이 살아나는 직무 예시",
      itemsKo: [
        `강점이 살아나기 쉬운 분야 예시: ${primary.workExamplesKo}`,
        "정밀함이 필요한 역할은 분석, 편집, 리뷰, 기술 검토처럼 작은 차이를 보는 방식과 잘 맞을 수 있습니다.",
        "이동성이 필요한 역할은 현장 업무, 글로벌 협업, 콘텐츠 취재처럼 고정된 자리 밖에서 에너지가 살아날 수 있습니다.",
      ],
    },
    {
      kind: "PARAGRAPH",
      titleKo: "돈과 자원을 다루는 방식",
      bodyKo: `${primary.resourceKo} 예산, 시간, 체력처럼 제한된 자원은 쓰기 전에 우선순위를 짧게 적어 두면 흐름이 안정됩니다.`,
    },
    {
      kind: "PARAGRAPH",
      titleKo: "관계에서 자주 생길 수 있는 장면",
      bodyKo: `${primary.relationKo} 회의나 대화에서 결론을 빨리 내고 싶어지는 장면이 생길 수 있으니, 상대가 따라올 시간을 먼저 확인하면 좋습니다. ${
        tenGod
          ? tenGod.strongKo
          : "내 기준과 상대의 속도를 함께 보는 편이 좋습니다."
      }`,
    },
    {
      kind: "PARAGRAPH",
      titleKo: "연애에서 도움이 되는 태도",
      bodyKo: `${primary.romanceKo} 바로 해결하려 하기보다 감정 확인, 속도 조절, 쉬운 표현부터 시작하면 관계 흐름이 부드러워질 수 있습니다.`,
    },
    {
      kind: "BULLET_LIST",
      titleKo: "오늘부터 써먹는 루틴",
      itemsKo: [
        ...buildTodayRoutineItems(input),
        `보완을 돕는 상징: ${weak.colorsKo}, ${weak.placesKo}`,
        "리마인드 도구: 하루 끝에 말의 온도와 회복 시간을 함께 점검하기",
      ],
    },
  ];
}

function createSajuMbtiSuggestionBlocks(input: ReportInput): ReportBlock[] {
  const suggestion = input.mbtiSuggestion;

  if (!suggestion) {
    return [
      {
        kind: "PARAGRAPH",
        bodyKo: "현재 기준에서 사주 기반 MBTI 보정 정보를 만들 수 없습니다.",
      },
    ];
  }

  const blocks: ReportBlock[] = [
    {
      kind: "HIGHLIGHT",
      titleKo: "입력 MBTI와 사주 기반 후보 비교",
      bodyKo: suggestion.comparison.summaryKo,
    },
  ];
  const isHighTension = suggestion.comparison.tensionAxes.length >= 2;

  if (suggestion.typeSuggestion && isHighTension) {
    blocks.push({
      kind: "PARAGRAPH",
      titleKo: "사주 기반 성향 후보",
      bodyKo:
        "입력한 MBTI와 다른 축이 여러 개 보여, 하나의 유형명으로 단정하기보다 축별 차이를 중심으로 보는 편이 적절합니다.",
    });
  } else if (suggestion.typeSuggestion) {
    blocks.push({
      kind: "KEY_VALUE",
      titleKo: "사주 기반 후보 유형",
      keyValues: [
        {
          keyKo: "후보 MBTI",
          valueKo: suggestion.typeSuggestion.suggestedType,
        },
        {
          keyKo: "신뢰도",
          valueKo: suggestion.typeSuggestion.confidence,
        },
      ],
    });
  } else {
    blocks.push({
      kind: "PARAGRAPH",
      titleKo: "후보 유형",
      bodyKo: "현재 태그만으로는 하나의 MBTI 후보 유형까지 좁히지 않습니다.",
    });
  }

  if (suggestion.axisSuggestions.length > 0) {
    blocks.push({
      kind: "BULLET_LIST",
      titleKo: "축별 사주 신호",
      itemsKo: suggestion.axisSuggestions.map(
        (item) => `${item.axis} → ${item.suggestedSide}: ${item.summaryKo}`,
      ),
    });
  }

  if (suggestion.notices.length > 0) {
    blocks.push({
      kind: "BULLET_LIST",
      titleKo: "해석 기준",
      itemsKo: [...suggestion.notices],
    });
  }

  return blocks;
}

function buildStrengthActionGuideItem(labelKo: string): string {
  if (labelKo.includes("신강")) {
    return `${labelKo} 흐름은 자기 기준과 추진력이 장점이 되지만, 중요한 선택에서는 주변 피드백을 한 번 거쳐 균형을 잡는 편이 좋습니다.`;
  }

  if (labelKo.includes("신약")) {
    return `${labelKo} 흐름은 역할과 외부 요구를 크게 의식하기 쉬우므로, 중요한 선택에서는 맡을 일과 회복 시간을 함께 조율하는 편이 좋습니다.`;
  }

  return `${labelKo} 흐름은 한쪽으로 치우치기보다 균형을 살피는 해석이 어울리므로, 강점과 부담을 함께 점검하는 편이 좋습니다.`;
}

function hasStructurePattern(
  structureAnalysis: NonNullable<ReportInput["structureAnalysis"]>,
  code: string,
): boolean {
  return structureAnalysis.patterns.some((pattern) => pattern.code === code);
}

function buildDayPillarActionGuideItem(
  dayPillarProfile: ReportInput["dayPillarProfile"],
): string | undefined {
  if (!dayPillarProfile?.ok) {
    return undefined;
  }

  const firstStrength = dayPillarProfile.profile.strengthItems[0]?.titleKo;
  const strengthText = firstStrength ? `${firstStrength}을 살리되` : "강점을 살리되";

  return `${dayPillarProfile.profile.nameKo} 흐름에서는 ${strengthText}, 중요한 선택 전 완충 시간을 두면 실행력과 관계 안정성을 함께 챙기기 좋습니다.`;
}

function buildActionGuideItems(input: ReportInput): string[] {
  const structureAnalysis = input.structureAnalysis;

  if (!structureAnalysis) {
    return [
      "강하게 나온 기질은 장점과 부담을 함께 봅니다.",
      "부족하게 나온 기운은 결핍이 아니라 의식적으로 보완할 영역으로 봅니다.",
      "MBTI와 사주가 겹치는 부분은 반복되는 자기 패턴으로 점검합니다.",
      "해석은 맞고 틀림을 가르는 결론보다, 이번 주에 조정할 수 있는 행동 단위로 내려올 때 쓸모가 생깁니다.",
    ];
  }

  const items: string[] = [
    buildStrengthActionGuideItem(structureAnalysis.dayMasterStrength.labelKo),
    "해석은 맞고 틀림을 가르는 결론보다, 이번 주에 조정할 수 있는 행동 단위로 내려올 때 쓸모가 생깁니다.",
  ];
  const patternLabels = structureAnalysis.patterns
    .slice(0, 2)
    .map((pattern) => pattern.labelKo);

  if (patternLabels.length > 0) {
    items.push(
      `${patternLabels.join(", ")} 신호가 함께 보이므로, 혼자 판단을 끝내기보다 기록·검토·대화를 통해 생각을 정리하면 강점이 안정적으로 쓰입니다.`,
    );
  }

  if (hasStructurePattern(structureAnalysis, "FIRE_METAL_TENSION")) {
    items.push(
      "화금 긴장 구조가 보일 때는 빠른 판단과 날카로운 표현이 장점이 되지만, 관계 장면에서는 말의 속도와 강도를 조절하는 것이 도움이 됩니다.",
    );
  }

  if (hasStructurePattern(structureAnalysis, "WATER_WEAK_RECOVERY_NEEDED")) {
    items.push(
      "수 기운 보완 필요 신호가 보일 때는 휴식, 수면, 감정 회복, 느린 루틴을 의식적으로 넣을수록 전체 균형이 좋아집니다.",
    );
  }

  const dayPillarItem = buildDayPillarActionGuideItem(input.dayPillarProfile);

  if (dayPillarItem) {
    items.push(dayPillarItem);
  }

  return unique(items).slice(0, 5);
}

export function buildReport(input: ReportInput): ReportOutput {
  const sections: ReportSection[] = [
    createSection({
      id: "INTRO",
      level: "FREE_PREVIEW",
      titleKo: "리포트 개요",
      summaryKo:
        "이 리포트는 사주 구조와 MBTI 자기인식을 함께 살펴보는 자기이해용 콘텐츠입니다.",
      blocks: [
        {
          kind: "PARAGRAPH",
          bodyKo:
            "사주는 생년월일시를 기준으로 기운의 구조를 살피고, MBTI는 스스로 인식하는 사고·판단·관계 방식을 정리하는 도구로 사용합니다.",
        },
      ],
    }),
    createSection({
      id: "QUICK_SUMMARY",
      level: "FREE_PREVIEW",
      titleKo: "한눈에 보는 나의 결",
      summaryKo:
        "계산된 사주·MBTI 신호를 바탕으로 강점, 주의할 흐름, 바로 써먹을 루틴을 먼저 정리합니다.",
      blocks: createQuickSummaryBlocks(input),
    }),
    createSection({
      id: "SAJU_CORE",
      level: "FREE_PREVIEW",
      titleKo: "사주 기본 구조",
      summaryKo: "사주의 기본 뼈대인 년주·월주·일주·시주입니다.",
      blocks: [createSajuCoreBlock(input)],
    }),
    createSection({
      id: "DAY_MASTER",
      level: "FREE_PREVIEW",
      titleKo: "일간",
      summaryKo: "일간은 사주에서 나를 대표하는 기준점입니다.",
      blocks: createDayMasterBlocks(input),
    }),
    createSection({
      id: "ELEMENTS",
      level: "PAID_FULL",
      titleKo: "오행",
      summaryKo:
        "오행은 목·화·토·금·수의 분포를 통해 에너지의 방향과 보완 루틴을 봅니다.",
      blocks: [
        createElementsBlock(input),
        createElementsPracticalGuideBlock(),
        createElementsInterpretationBlock(input),
      ],
    }),
    createSection({
      id: "TEN_GODS",
      level: "PAID_FULL",
      titleKo: "십성",
      summaryKo: "십성은 일간을 기준으로 관계되는 기운을 분류한 구조입니다.",
      blocks: createTenGodsBlocks(input),
    }),
    createSection({
      id: "ADVANCED_PATTERNS",
      level: "PAID_FULL",
      titleKo: "고급 구조 후보",
      summaryKo: "고급 구조 후보는 단정이 아니라 해석을 위한 신호입니다.",
      blocks: createAdvancedPatternsBlocks(input),
    }),
    createSection({
      id: "SHINSAL",
      level: "PAID_FULL",
      titleKo: "신살·귀인",
      summaryKo:
        "신살과 귀인은 사주 구조 안에서 특정 성향과 보조 흐름을 읽기 위한 참고 신호입니다.",
      blocks: createShinsalBlocks(input),
    }),
    createSection({
      id: "RELATIONS",
      level: "PAID_FULL",
      titleKo: "합과 충",
      summaryKo: "합과 충은 기운 사이의 연결과 긴장을 보는 참고 신호입니다.",
      blocks: [createRelationsBlock(input)],
    }),
    createSection({
      id: "PRACTICAL_POINTS",
      level: "PAID_FULL",
      titleKo: "일·돈·관계 활용 포인트",
      summaryKo:
        "일의 방식, 자원/돈을 다루는 방식, 관계와 연애에서 참고할 흐름을 실전 예시로 정리합니다.",
      blocks: createPracticalPointBlocks(input),
    }),
    createSection({
      id: "MBTI_PROFILE",
      level: "FREE_PREVIEW",
      titleKo: "MBTI 프로필",
      summaryKo:
        "MBTI는 스스로 인식하는 사고와 판단 방식을 정리하는 보조 축입니다.",
      blocks: createMbtiProfileBlocks(input),
    }),
    createSection({
      id: "SAJU_MBTI_BRIDGE",
      level: "PAID_FULL",
      titleKo: "사주×MBTI 연결",
      summaryKo:
        "사주 구조와 MBTI 자기인식이 겹치거나 어긋나는 지점을 정리합니다.",
      blocks: createSajuMbtiConnectionBlocks(input),
    }),
    createSection({
      id: "SAJU_MBTI_SUGGESTION",
      level: "PAID_FULL",
      titleKo: "사주 기반 MBTI 보정",
      summaryKo:
        "입력한 MBTI를 존중하되, 사주 구조에서 다르게 읽히는 성향 축이 있는지 비교합니다.",
      blocks: createSajuMbtiSuggestionBlocks(input),
    }),
    createSection({
      id: "ACTION_GUIDE",
      level: "PAID_FULL",
      titleKo: "활용 가이드",
      summaryKo: "해석은 단정이 아니라 자기이해와 선택을 돕기 위한 참고입니다.",
      blocks: [
        {
          kind: "BULLET_LIST",
          titleKo: "활용 가이드",
          itemsKo: buildActionGuideItems(input),
        },
      ],
    }),
    createSection({
      id: "DISCLAIMER",
      level: "FREE_PREVIEW",
      titleKo: "안내",
      summaryKo: "본 리포트는 자기이해용 콘텐츠입니다.",
      blocks: [
        {
          kind: "WARNING",
          bodyKo:
            "본 리포트는 자기이해를 돕기 위한 참고 콘텐츠이며, 의료·투자·법률·관계 선택에 대한 전문 판단이나 미래 사건 예측을 제공하지 않습니다.",
        },
      ],
    }),
  ];

  return {
    version: "v1",
    titleKo: "결리포트",
    subtitleKo: "사주와 MBTI로 읽는 나의 결",
    sections,
    notices: unique([
      ...input.saju.notices,
      ...(input.mbtiSuggestion?.notices ?? []),
      "출생정보와 해석 결과는 자기이해용 참고자료입니다.",
    ]),
  };
}
