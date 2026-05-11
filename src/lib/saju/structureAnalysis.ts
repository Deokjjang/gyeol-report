import type { SajuCalcResult } from "./types";
import type {
  DayMasterStrengthAnalysis,
  SajuStructureAnalysis,
  SajuStructurePattern,
  StructureAnalysisEvidence,
} from "./structureAnalysisTypes";

type SajuStructureAnalysisInput = Pick<SajuCalcResult, "tenGods" | "elements">;
type TenGodKey =
  keyof SajuStructureAnalysisInput["tenGods"]["distribution"];
type DayMasterStrengthLevel = DayMasterStrengthAnalysis["level"];
type StructurePatternCode = SajuStructurePattern["code"];

type StructureMetrics = {
  peerSupport: number;
  resourceSupport: number;
  outputDrain: number;
  wealthPressure: number;
  officerPressure: number;
  indirectOfficer: number;
  directOfficer: number;
};

const PEER_TEN_GODS = ["比肩", "劫財"] as const satisfies readonly TenGodKey[];
const RESOURCE_TEN_GODS = ["偏印", "正印"] as const satisfies readonly TenGodKey[];
const OUTPUT_TEN_GODS = ["食神", "傷官"] as const satisfies readonly TenGodKey[];
const WEALTH_TEN_GODS = ["偏財", "正財"] as const satisfies readonly TenGodKey[];
const OFFICER_TEN_GODS = ["偏官", "正官"] as const satisfies readonly TenGodKey[];

export function analyzeSajuStructure(
  result: SajuStructureAnalysisInput,
): SajuStructureAnalysis {
  const metrics = getStructureMetrics(result);
  const dayMasterStrength = analyzeDayMasterStrength(metrics);
  const patterns = detectStructurePatterns(result, metrics, dayMasterStrength);

  return {
    dayMasterStrength,
    patterns,
    summary: buildSummary(dayMasterStrength, patterns),
    notices: [
      "신강신약과 구조 후보는 단정이 아니라 현재 계산된 오행·십성 신호를 바탕으로 한 해석 기준입니다.",
    ],
  };
}

function getStructureMetrics(result: SajuStructureAnalysisInput): StructureMetrics {
  return {
    peerSupport: sumTenGods(result, PEER_TEN_GODS),
    resourceSupport: sumTenGods(result, RESOURCE_TEN_GODS),
    outputDrain: sumTenGods(result, OUTPUT_TEN_GODS),
    wealthPressure: sumTenGods(result, WEALTH_TEN_GODS),
    officerPressure: sumTenGods(result, OFFICER_TEN_GODS),
    indirectOfficer: getTenGodCount(result, "偏官"),
    directOfficer: getTenGodCount(result, "正官"),
  };
}

function sumTenGods(
  result: SajuStructureAnalysisInput,
  tenGods: readonly TenGodKey[],
): number {
  return tenGods.reduce(
    (total, tenGod) => total + getTenGodCount(result, tenGod),
    0,
  );
}

function getTenGodCount(
  result: SajuStructureAnalysisInput,
  tenGod: TenGodKey,
): number {
  return result.tenGods.distribution[tenGod];
}

function analyzeDayMasterStrength(
  metrics: StructureMetrics,
): DayMasterStrengthAnalysis {
  const score =
    metrics.peerSupport +
    metrics.resourceSupport -
    metrics.outputDrain * 0.6 -
    metrics.wealthPressure * 0.7 -
    metrics.officerPressure * 0.8;
  const level = getDayMasterStrengthLevel(score);

  return {
    level,
    score: roundToOneDecimal(score),
    labelKo: getDayMasterStrengthLabel(level),
    summaryKo: getDayMasterStrengthSummary(level),
    confidence: "MEDIUM",
    evidence: [
      {
        source: "TEN_GODS",
        keyKo: "비겁",
        valueKo: formatScore(metrics.peerSupport),
      },
      {
        source: "TEN_GODS",
        keyKo: "인성",
        valueKo: formatScore(metrics.resourceSupport),
      },
      {
        source: "TEN_GODS",
        keyKo: "식상",
        valueKo: formatScore(metrics.outputDrain),
      },
      {
        source: "TEN_GODS",
        keyKo: "재성",
        valueKo: formatScore(metrics.wealthPressure),
      },
      {
        source: "TEN_GODS",
        keyKo: "관성",
        valueKo: formatScore(metrics.officerPressure),
      },
    ],
  };
}

function getDayMasterStrengthLevel(score: number): DayMasterStrengthLevel {
  if (score <= -1.5) {
    return "VERY_WEAK";
  }

  if (score <= -0.5) {
    return "WEAK";
  }

  if (score < 0.8) {
    return "BALANCED";
  }

  if (score < 1.8) {
    return "STRONG";
  }

  return "VERY_STRONG";
}

function getDayMasterStrengthLabel(level: DayMasterStrengthLevel): string {
  switch (level) {
    case "VERY_WEAK":
      return "매우 신약";
    case "WEAK":
      return "신약";
    case "BALANCED":
      return "중화";
    case "STRONG":
      return "신강";
    case "VERY_STRONG":
      return "매우 신강";
  }
}

function getDayMasterStrengthSummary(level: DayMasterStrengthLevel): string {
  switch (level) {
    case "VERY_WEAK":
    case "WEAK":
      return "일간을 돕는 힘보다 소모·성과·책임 쪽 신호가 더 강하게 나타납니다.";
    case "BALANCED":
      return "일간을 돕는 힘과 외부로 쓰이는 힘이 비교적 균형을 이룹니다.";
    case "STRONG":
    case "VERY_STRONG":
      return "일간을 받쳐 주는 힘이 비교적 강해 자기 기준과 추진력이 살아납니다.";
  }
}

function detectStructurePatterns(
  result: SajuStructureAnalysisInput,
  metrics: StructureMetrics,
  dayMasterStrength: DayMasterStrengthAnalysis,
): SajuStructurePattern[] {
  const patterns: SajuStructurePattern[] = [];
  const isWeakDayMaster =
    dayMasterStrength.level === "WEAK" ||
    dayMasterStrength.level === "VERY_WEAK";

  if (isWeakDayMaster && metrics.wealthPressure >= 1) {
    patterns.push(
      createPattern(
        "WEAK_DAYMASTER_WITH_STRONG_WEALTH",
        "재다신약 후보",
        "재성 신호가 일간의 힘보다 크게 작동해, 성과·돈·현실 책임을 감당하는 과정에서 부담이 커질 수 있는 구조입니다.",
        [tenGodEvidence("재성", metrics.wealthPressure)],
      ),
    );
  }

  if (isWeakDayMaster && metrics.outputDrain >= 1) {
    patterns.push(
      createPattern(
        "WEAK_DAYMASTER_WITH_STRONG_OUTPUT",
        "식상 과다형 신약 후보",
        "표현·생산·아이디어를 밖으로 쓰는 힘이 커서, 체력과 집중력이 분산되기 쉬운 구조입니다.",
        [tenGodEvidence("식상", metrics.outputDrain)],
      ),
    );
  }

  if (isWeakDayMaster && metrics.officerPressure >= 0.8) {
    patterns.push(
      createPattern(
        "WEAK_DAYMASTER_WITH_STRONG_OFFICER",
        "관성 압박형 신약 후보",
        "규칙, 책임, 평가, 역할 부담을 강하게 의식하면서 긴장이 쌓이기 쉬운 구조입니다.",
        [tenGodEvidence("관성", metrics.officerPressure)],
      ),
    );
  }

  if (metrics.resourceSupport >= 1.5) {
    patterns.push(
      createPattern(
        "RESOURCE_HEAVY",
        "인성 강한 구조",
        "학습, 분석, 보호 본능, 생각을 정리하는 힘이 강하게 작동하는 구조입니다.",
        [tenGodEvidence("인성", metrics.resourceSupport)],
      ),
    );
  }

  if (metrics.peerSupport >= 1.8) {
    patterns.push(
      createPattern(
        "PEER_HEAVY",
        "비겁 강한 구조",
        "자기 기준, 독립성, 경쟁심, 직접 밀고 나가는 힘이 강하게 작동하는 구조입니다.",
        [tenGodEvidence("비겁", metrics.peerSupport)],
      ),
    );
  }

  if (metrics.outputDrain >= 1.2) {
    patterns.push(
      createPattern(
        "OUTPUT_HEAVY",
        "식상 강한 구조",
        "표현, 생산, 말과 결과물로 자신을 드러내는 힘이 강하게 작동하는 구조입니다.",
        [tenGodEvidence("식상", metrics.outputDrain)],
      ),
    );
  }

  if (metrics.wealthPressure >= 1.2) {
    patterns.push(
      createPattern(
        "WEALTH_HEAVY",
        "재성 강한 구조",
        "현실 감각, 성과, 자원 관리, 결과를 의식하는 힘이 강하게 작동하는 구조입니다.",
        [tenGodEvidence("재성", metrics.wealthPressure)],
      ),
    );
  }

  if (metrics.officerPressure >= 1) {
    patterns.push(
      createPattern(
        "OFFICER_HEAVY",
        "관성 강한 구조",
        "책임, 기준, 평가, 역할 의식이 강하게 작동하는 구조입니다.",
        [tenGodEvidence("관성", metrics.officerPressure)],
      ),
    );
  }

  if (metrics.indirectOfficer > 0 && metrics.directOfficer > 0) {
    patterns.push(
      createPattern(
        "MIXED_OFFICER_KILLING",
        "관살혼잡 후보",
        "규칙과 압박, 책임과 긴장이 함께 작동해 역할과 기준을 정리하는 과정이 중요해질 수 있습니다.",
        [
          tenGodEvidence("편관", metrics.indirectOfficer),
          tenGodEvidence("정관", metrics.directOfficer),
        ],
      ),
    );
  }

  if (hasElementLabel(result, "FIRE_STRONG") && hasElementLabel(result, "METAL_STRONG")) {
    patterns.push(
      createPattern(
        "FIRE_METAL_TENSION",
        "화금 긴장 구조",
        "표현성과 판단력이 동시에 강해, 빠른 결정과 날카로운 반응이 함께 나타날 수 있습니다.",
        [elementEvidence("화", "강함"), elementEvidence("금", "강함")],
      ),
    );
  }

  if (hasElementLabel(result, "WATER_WEAK") || hasElementLabel(result, "WATER_MISSING")) {
    patterns.push(
      createPattern(
        "WATER_WEAK_RECOVERY_NEEDED",
        "수 기운 보완 필요",
        "회복, 휴식, 유연한 조율을 의식적으로 보완할수록 전체 균형이 좋아질 수 있습니다.",
        [elementEvidence("수", "약함")],
      ),
    );
  }

  return patterns;
}

function createPattern(
  code: StructurePatternCode,
  labelKo: string,
  summaryKo: string,
  evidence: readonly StructureAnalysisEvidence[],
): SajuStructurePattern {
  return {
    code,
    labelKo,
    summaryKo,
    confidence: "MEDIUM",
    evidence,
  };
}

function tenGodEvidence(
  keyKo: string,
  value: number,
): StructureAnalysisEvidence {
  return {
    source: "TEN_GODS",
    keyKo,
    valueKo: formatScore(value),
  };
}

function elementEvidence(
  keyKo: string,
  valueKo: string,
): StructureAnalysisEvidence {
  return {
    source: "ELEMENTS",
    keyKo,
    valueKo,
  };
}

function hasElementLabel(
  result: SajuStructureAnalysisInput,
  label: SajuStructureAnalysisInput["elements"]["labels"][number],
): boolean {
  return result.elements.labels.includes(label);
}

function buildSummary(
  dayMasterStrength: DayMasterStrengthAnalysis,
  patterns: readonly SajuStructurePattern[],
): SajuStructureAnalysis["summary"] {
  const patternLabels = patterns.slice(0, 2).map((pattern) => pattern.labelKo);

  return {
    titleKo: "사주 구조 요약",
    bodyKo:
      patternLabels.length > 0
        ? `이 사주는 ${dayMasterStrength.labelKo} 흐름을 바탕으로 ${patternLabels.join(", ")} 신호가 함께 보입니다. 강점과 부담이 동시에 작동하므로, 어떤 기운이 과하게 쓰이는지 확인하는 것이 중요합니다.`
        : "이 사주는 특정 구조 하나로 단정하기보다, 오행과 십성의 균형을 함께 보며 해석하는 편이 적절합니다.",
    keywordsKo: [
      dayMasterStrength.labelKo,
      ...patterns.slice(0, 3).map((pattern) => pattern.labelKo),
    ],
  };
}

function formatScore(value: number): string {
  return roundToOneDecimal(value).toString();
}

function roundToOneDecimal(value: number): number {
  return Math.round(value * 10) / 10;
}
