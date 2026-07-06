import {
  buildAnnualFortuneEvidence,
  type AnnualFortuneEvidencePacket,
  type AnnualPersonInput,
} from "../report-knowledge/annualFortuneEvidence";
import {
  requireMajorFortuneFixture,
} from "../report-knowledge/majorFortuneFixtures";
import {
  USER_LIFE_STATUS_LABELS,
  type UserContextProfile,
  type UserLifeStatus,
  type UserRelationshipStatus,
} from "../report-knowledge/userContextTypes";
import { calculateSaju } from "../saju/calculateSaju";
import type {
  ElementLabel,
  Gender as SajuCalcGender,
  Pillar,
  SajuCalcResult,
  TenGod as SajuCalcTenGod,
} from "../saju/types";
import {
  type AnnualFortuneDraftFlowSection,
  type AnnualFortuneReportDraft,
  type AnnualFortuneReportMode,
} from "./annualFortuneReportDraftTypes";
import {
  getAnnualMonthlyCardBasisLabel,
  validateAnnualFortuneReportDraft,
} from "./annualFortuneReportDraftValidator";
import {
  generateAnnualFortuneReportDraft,
  type AnnualFortuneReportWriterConfig,
  type AnnualFortuneReportWriterResult,
} from "./openaiAnnualFortuneReportWriter";
import type { SinglePersonGenerationInput } from "./reportInputAdapter";
import type { JobStatus } from "./reportInputTypes";

export type AnnualFortuneGenerationErrorCode =
  | "ANNUAL_FORTUNE_GENERATION_FAILED"
  | "ANNUAL_FORTUNE_DRAFT_INVALID"
  | "INVALID_REPORT_INPUT";

export type AnnualFortuneGenerationResult =
  | {
      readonly ok: true;
      readonly kind: "annualFortune";
      readonly draft: AnnualFortuneReportDraft;
      readonly evidencePacket: AnnualFortuneEvidencePacket;
    }
  | {
      readonly ok: false;
      readonly kind: "annualFortune";
      readonly error: {
        readonly code: AnnualFortuneGenerationErrorCode;
        readonly message: string;
      };
    };

export type AnnualFortuneGenerationHandlerOptions = {
  readonly writer?: {
    readonly enabled: boolean;
    readonly config?: AnnualFortuneReportWriterConfig;
  };
};

const annualFortunePreviewCurrentDateIso = "2026-06-18T00:00:00+09:00";
const majorFortuneDefaultFixtureId = "deokmin-current-major-fortune";
const annualFortuneMonthlyBasisFallback = "달력월 기준 운영 가이드";

const tenGodKoByHanja = {
  比肩: "비견",
  劫財: "겁재",
  食神: "식신",
  傷官: "상관",
  偏財: "편재",
  正財: "정재",
  偏官: "편관",
  正官: "정관",
  偏印: "편인",
  正印: "정인",
} as const satisfies Record<SajuCalcTenGod, string>;

const elementLabelKoByCalc = {
  WOOD_STRONG: "목 과다",
  WOOD_WEAK: "목 부족",
  WOOD_MISSING: "목 부족",
  FIRE_STRONG: "화 과다",
  FIRE_WEAK: "화 부족",
  FIRE_MISSING: "화 부족",
  EARTH_STRONG: "토 과다",
  EARTH_WEAK: "토 부족",
  EARTH_MISSING: "토 부족",
  METAL_STRONG: "금 과다",
  METAL_WEAK: "금 부족",
  METAL_MISSING: "금 부족",
  WATER_STRONG: "수 과다",
  WATER_WEAK: "수 부족",
  WATER_MISSING: "수 부족",
} as const satisfies Record<ElementLabel, string>;

export async function generateAnnualFortuneProductDraft(
  input: SinglePersonGenerationInput,
  options: AnnualFortuneGenerationHandlerOptions = {},
): Promise<AnnualFortuneGenerationResult> {
  if (input.kind !== "annualFortune") {
    return annualFortuneFailure({
      code: "INVALID_REPORT_INPUT",
      message: "Annual fortune generation requires annualFortune input.",
    });
  }

  let evidencePacket: AnnualFortuneEvidencePacket;
  try {
    evidencePacket = buildAnnualFortuneEvidenceFromGenerationInput(input);
  } catch (error) {
    return annualFortuneFailure({
      code: "ANNUAL_FORTUNE_GENERATION_FAILED",
      message: getErrorMessage(error),
    });
  }

  let draftResult: AnnualFortuneReportWriterResult;
  try {
    draftResult =
      options.writer?.enabled === true && options.writer.config !== undefined
        ? await generateAnnualFortuneReportDraft({
            evidencePacket,
            config: options.writer.config,
          })
        : {
            draft: buildAnnualFortuneFallbackDraft(evidencePacket),
            model: "local-annual-fortune-fallback",
          };
  } catch (error) {
    return annualFortuneFailure({
      code: "ANNUAL_FORTUNE_GENERATION_FAILED",
      message: getErrorMessage(error),
    });
  }

  const validation = validateAnnualFortuneReportDraft(draftResult.draft);

  if (!validation.ok || validation.value === undefined) {
    return annualFortuneFailure({
      code: "ANNUAL_FORTUNE_DRAFT_INVALID",
      message: validation.errors.join("; "),
    });
  }

  return {
    ok: true,
    kind: "annualFortune",
    draft: validation.value,
    evidencePacket,
  };
}

function buildAnnualFortuneEvidenceFromGenerationInput(
  input: SinglePersonGenerationInput,
): AnnualFortuneEvidencePacket {
  const selectedYear = getSelectedYear(input);
  const majorFortuneFixture = requireMajorFortuneFixture(
    majorFortuneDefaultFixtureId,
  );
  const saju = calculateAnnualFortuneSaju(input.person);
  const person: AnnualPersonInput = {
    label: input.person.name,
    birthDate: input.person.birthDate,
    gender: toAnnualFortuneGender(input.person.gender),
    mbti: input.person.mbtiType === "" ? null : input.person.mbtiType,
    userContext: toAnnualFortuneUserContext(input),
    majorFortuneCycles: majorFortuneFixture.person.majorFortuneCycles,
    pillars: toAnnualFortunePillars(saju),
    labels: deriveAnnualFortuneLabels(saju, input),
  };

  return buildAnnualFortuneEvidence({
    targetYear: selectedYear,
    currentDate: new Date(annualFortunePreviewCurrentDateIso),
    person,
  });
}

function getSelectedYear(input: SinglePersonGenerationInput): number {
  if (!("selectedYear" in input.productOptions)) {
    throw new Error("Annual fortune selectedYear is required.");
  }

  const selectedYear = Number.parseInt(input.productOptions.selectedYear, 10);

  if (!Number.isInteger(selectedYear)) {
    throw new Error("Annual fortune selectedYear must be a valid year.");
  }

  return selectedYear;
}

function calculateAnnualFortuneSaju(
  person: SinglePersonGenerationInput["person"],
): SajuCalcResult {
  const birthTime = person.birthTime.trim();

  return calculateSaju({
    birthDate: person.birthDate,
    ...(person.birthTimeUnknown || birthTime.length === 0
      ? {}
      : { birthTime }),
    birthTimeUnknown: person.birthTimeUnknown || birthTime.length === 0,
    calendarType: "SOLAR",
    gender: toSajuGender(person.gender),
    timezone: "Asia/Seoul",
  });
}

function toAnnualFortunePillars(result: SajuCalcResult) {
  return {
    year: formatPillar(result.pillars.year),
    month: formatPillar(result.pillars.month),
    day: formatPillar(result.pillars.day),
    ...(result.pillars.hour === undefined
      ? {}
      : { hour: formatPillar(result.pillars.hour) }),
  };
}

function deriveAnnualFortuneLabels(
  result: SajuCalcResult,
  input: SinglePersonGenerationInput,
): readonly string[] {
  return uniqueStrings([
    `${formatPillar(result.pillars.day)}일주`,
    ...collectActiveTenGodLabels(result),
    ...deriveTenGodGroupLabels(result),
    ...result.elements.labels.map((label) => elementLabelKoByCalc[label]),
    ...result.structureAnalysis.patterns.map((pattern) => pattern.labelKo),
    ...deriveStructureFallbackLabels(result),
    ...result.relations.stemCombinations,
    ...result.relations.branchCombinations,
    ...result.relations.branchClashes,
    ...result.shinsal.map((detection) => detection.labelKo),
    ...input.userContext.focusAreas.map((area) => `${area} 관심`),
  ]);
}

function collectActiveTenGodLabels(result: SajuCalcResult): readonly string[] {
  return uniqueStrings(
    Object.entries(result.tenGods.distribution)
      .filter(([, count]) => count > 0)
      .map(([tenGod]) => tenGodKoByHanja[tenGod as SajuCalcTenGod]),
  );
}

function deriveTenGodGroupLabels(result: SajuCalcResult): readonly string[] {
  const count = (tenGods: readonly SajuCalcTenGod[]) =>
    tenGods.reduce(
      (sum, tenGod) => sum + (result.tenGods.distribution[tenGod] ?? 0),
      0,
    );
  const groups: string[] = [];

  if (count(["偏財", "正財"]) > 0) groups.push("재성");
  if (count(["偏官", "正官"]) > 0) groups.push("관성");
  if (count(["食神", "傷官"]) > 0) groups.push("식상");
  if (count(["偏印", "正印"]) > 0) groups.push("인성");
  if (count(["比肩", "劫財"]) > 0) groups.push("비겁");

  return groups;
}

function deriveStructureFallbackLabels(result: SajuCalcResult): readonly string[] {
  const labels: string[] = [];
  const hasOutput =
    (result.tenGods.distribution["食神"] ?? 0) +
      (result.tenGods.distribution["傷官"] ?? 0) >
    0;
  const hasResource =
    (result.tenGods.distribution["偏印"] ?? 0) +
      (result.tenGods.distribution["正印"] ?? 0) >
    0;
  const wealthCount =
    (result.tenGods.distribution["偏財"] ?? 0) +
    (result.tenGods.distribution["正財"] ?? 0);
  const strengthLevel = result.structureAnalysis.dayMasterStrength.level;

  if (!hasOutput) labels.push("무식상");
  if (!hasResource) labels.push("무인성");
  if (wealthCount >= 2 && (strengthLevel === "WEAK" || strengthLevel === "VERY_WEAK")) {
    labels.push("재다신약");
  }
  if (strengthLevel === "WEAK" || strengthLevel === "VERY_WEAK") {
    labels.push("신약");
  }
  if (strengthLevel === "STRONG" || strengthLevel === "VERY_STRONG") {
    labels.push("신강");
  }

  return labels;
}

function toAnnualFortuneUserContext(
  input: SinglePersonGenerationInput,
): UserContextProfile {
  const fieldLabel = input.userContext.detailJob.trim();

  return {
    lifeStatus: toAnnualFortuneLifeStatus(input.userContext.jobStatus),
    fieldLabel:
      fieldLabel.length > 0
        ? fieldLabel
        : input.userContext.focusAreas.length > 0
          ? input.userContext.focusAreas.join(" · ")
          : null,
    relationshipStatus: toAnnualFortuneRelationshipStatus(
      input.userContext.relationshipStatus,
    ),
  };
}

function toAnnualFortuneLifeStatus(status: JobStatus): UserLifeStatus {
  if (status === "student") return "student";
  if (status === "job_seeker") return "job_seeker";
  if (status === "employee") return "employee";
  if (status === "freelancer") return "freelancer";
  if (status === "self_employed" || status === "business_owner") {
    return "business_owner";
  }
  if (status === "homemaker" || status === "unemployed") {
    return "resting";
  }

  return "other";
}

function toAnnualFortuneRelationshipStatus(
  status: SinglePersonGenerationInput["userContext"]["relationshipStatus"],
): UserRelationshipStatus {
  if (status === "single" || status === "dating" || status === "married") {
    return status;
  }
  if (status === "some" || status === "marriage_preparing") {
    return "dating";
  }

  return "unknown";
}

function toAnnualFortuneGender(
  gender: SinglePersonGenerationInput["person"]["gender"],
): string {
  if (gender === "MALE") return "male";
  if (gender === "FEMALE") return "female";
  return "unknown";
}

function toSajuGender(
  gender: SinglePersonGenerationInput["person"]["gender"],
): SajuCalcGender {
  if (gender === "MALE" || gender === "FEMALE") {
    return gender;
  }

  return "OTHER_OR_UNSPECIFIED";
}

function formatPillar(pillar: Pillar): string {
  return `${pillar.stem}${pillar.branch}`;
}

function toDraftMode(mode: AnnualFortuneEvidencePacket["mode"]): AnnualFortuneReportMode {
  return mode === "locked_future" ? "current_year" : mode;
}

function firstSentence(value: string): string {
  return value.split(/[.!?。]\s*|[.。]\s*/u)[0]?.trim() || value.trim();
}

function safeList(
  values: readonly string[],
  fallbackValues: readonly string[],
  minimum: number,
): readonly string[] {
  const result = [...values.filter((value) => value.trim().length > 0)];

  for (const fallbackValue of fallbackValues) {
    if (result.length >= minimum) break;
    if (!result.includes(fallbackValue)) {
      result.push(fallbackValue);
    }
  }

  return result;
}

function formatMonthlyBasis(value: string | null | undefined): string {
  return getAnnualMonthlyCardBasisLabel(
    value ?? annualFortuneMonthlyBasisFallback,
  );
}

function buildDraftFlowSection(
  packet: AnnualFortuneEvidencePacket,
  key: keyof AnnualFortuneEvidencePacket["domainFlows"],
): AnnualFortuneDraftFlowSection {
  const flow = packet.domainFlows[key];

  return {
    title: flow.title,
    summary: flow.summary,
    supportingSignals: flow.supportingSignals,
    frictionSignals: flow.frictionSignals,
    actionHint: flow.actionHint,
  };
}

function buildMonthlyHighlights(
  packet: AnnualFortuneEvidencePacket,
): AnnualFortuneReportDraft["monthlyHighlights"] {
  const groups = [
    { label: "1~3월", months: packet.monthlyFortunes.slice(0, 3) },
    { label: "4~6월", months: packet.monthlyFortunes.slice(3, 6) },
    { label: "7~9월", months: packet.monthlyFortunes.slice(6, 9) },
    { label: "10~12월", months: packet.monthlyFortunes.slice(9, 12) },
  ];

  return groups.map((group) => {
    const themes = group.months.map((month) => month.monthTheme).join(" ");
    const cautions = group.months
      .map((month) => month.caution)
      .filter((value) => value.trim().length > 0)
      .slice(0, 2)
      .join(" ");
    const actionHint =
      group.months[0]?.actionHint ??
      "월별 운영 기준을 작게 나누어 확인하세요.";

    return {
      monthLabel: group.label,
      headline: `${group.label} 운영 흐름`,
      body: `${themes} 이 구간은 한 달씩 끊어 보기보다 일, 돈, 관계, 회복 리듬이 어디에서 먼저 움직이는지 묶어서 읽는 편이 좋습니다. ${cautions}`,
      actionHint,
    };
  });
}

function buildFlowCards(
  packet: AnnualFortuneEvidencePacket,
): AnnualFortuneReportDraft["flowCards"] {
  const cards = [
    ["일·성과", packet.domainFlows.careerWork],
    ["돈·현실", packet.domainFlows.moneyResource],
    ["인간관계", packet.domainFlows.socialFamily],
    ["연애·가족", packet.domainFlows.relationshipLove],
    ["학업·자격증", packet.domainFlows.studyGrowth],
    ["몸·생활 리듬", packet.domainFlows.healthRoutine],
  ] as const;

  return cards.map(([label, flow], index) => ({
    label,
    score: 74 - index * 3,
    headline: flow.title,
    body: `${flow.summary} ${flow.actionHint}`,
  }));
}

function buildKeySignals(
  packet: AnnualFortuneEvidencePacket,
): AnnualFortuneReportDraft["keySignals"] {
  const opportunity = packet.opportunitySignals[0];
  const difficulty = packet.difficultySignals[0];
  const relation = packet.natalAnnualRelations.interactions[0];

  return [
    {
      type: "opportunity" as const,
      title: "살릴 흐름",
      body:
        opportunity?.plain ??
        packet.annualFortune.supportSignals[0] ??
        packet.annualFortune.interpretation,
      evidenceLabel: opportunity?.type ?? packet.annualFortune.stemTenGod,
    },
    {
      type: "difficulty" as const,
      title: "관리할 흐름",
      body:
        difficulty?.plain ??
        packet.annualFortune.frictionSignals[0] ??
        packet.annualFortune.caution,
      evidenceLabel: difficulty?.type ?? packet.annualFortune.branchTenGod,
    },
    {
      type: "mixed" as const,
      title: "원국과 닿는 지점",
      body: relation?.plain ?? packet.natalAnnualRelations.interpretation,
      evidenceLabel: relation?.type ?? "원국·세운 관계",
    },
  ];
}

function buildChapters(
  packet: AnnualFortuneEvidencePacket,
): AnnualFortuneReportDraft["chapters"] {
  const domainChapters = [
    packet.domainFlows.careerWork,
    packet.domainFlows.moneyResource,
    packet.domainFlows.socialFamily,
    packet.domainFlows.relationshipLove,
    packet.domainFlows.studyGrowth,
    packet.domainFlows.healthRoutine,
  ];

  return domainChapters.map((flow) => ({
    title: flow.title,
    headline: firstSentence(flow.summary),
    body: `${flow.summary} ${flow.actionHint}`,
    likelyScenes: safeList(
      [...flow.supportingSignals, ...flow.frictionSignals].slice(0, 4),
      [
        "일정, 돈, 관계, 회복 리듬 중 한 영역에서 먼저 체감됩니다.",
        "선택 연도의 십성 흐름이 실제 생활 기준을 다시 묻게 만듭니다.",
      ],
      2,
    ).slice(0, 4),
    practicalAdvice: safeList(
      [
        flow.actionHint,
        packet.actionGuides.find((guide) => guide.title === flow.title)?.action ?? "",
      ],
      [
        "결론을 바로 확정하기보다 이번 달에 조정할 기준을 하나만 정하세요.",
        "일, 돈, 관계의 기준이 섞이면 기록으로 나누어 부담을 줄이세요.",
      ],
      2,
    ).slice(0, 4),
  }));
}

function buildMonthlyFlow(
  packet: AnnualFortuneEvidencePacket,
): AnnualFortuneReportDraft["monthlyFlow"] {
  return packet.monthlyFortunes.map((month) => ({
    month: month.month,
    label: month.label,
    headline: month.monthTheme,
    monthGanji: month.ganji,
    monthlyBasis: formatMonthlyBasis(null),
    elementFocus: month.stemTenGod,
    natalInteractionSummary:
      [...month.supportSignals, ...month.frictionSignals].join(" / ") || null,
    body: `${month.interpretation} ${month.caution}`,
    advice: month.actionHint,
  }));
}

function buildAnnualFortuneFallbackDraft(
  packet: AnnualFortuneEvidencePacket,
): AnnualFortuneReportDraft {
  const mode = toDraftMode(packet.mode);
  const lifeStatusLabel =
    USER_LIFE_STATUS_LABELS[packet.userContext.lifeStatus];
  const fieldLabel = packet.userContext.fieldLabel ?? null;
  const contextLabel =
    fieldLabel === null || fieldLabel.trim().length === 0
      ? lifeStatusLabel
      : `${lifeStatusLabel} · ${fieldLabel}`;
  const majorAnnualCrossReading =
    packet.majorAnnualCross === null
      ? "현재 대운 정보가 입력되지 않은 결과에서는 선택 연도 세운과 원국의 작용을 먼저 읽고, 10년 배경은 연결된 결과에서 보완합니다."
      : `${packet.majorAnnualCross.majorGanji} 대운은 10년 배경이고 ${packet.majorAnnualCross.annualGanji} 세운은 그 위에 올라오는 1년 자극입니다. ${packet.majorAnnualCross.interpretation} ${packet.majorAnnualCross.caution}`;
  const natalAnnualReading = `${packet.natalAnnualRelations.interpretation} ${packet.natalAnnualRelations.caution}`;
  const monthlyFlowReading =
    "12개월 월운은 한 달씩 끊어진 예언이 아니라 선택 연도 안에서 운영 리듬을 나누어 보는 기준입니다. 상반기에는 일과 돈의 기준을 먼저 잡고, 하반기에는 관계와 회복 리듬까지 함께 조정하는 식으로 읽는 편이 안전합니다.";
  const finalAdvice = [
    packet.domainFlows.careerWork.actionHint,
    packet.domainFlows.moneyResource.actionHint,
    packet.domainFlows.socialFamily.actionHint,
    packet.domainFlows.relationshipLove.actionHint,
    packet.domainFlows.studyGrowth.actionHint,
    packet.domainFlows.healthRoutine.actionHint,
  ];
  const safetyNotes = safeList(
    packet.safetyNotes,
    [
      "이 리포트는 특정 사건이나 날짜를 단정하지 않고 선택 연도 흐름을 관리 기준으로 읽습니다.",
      "건강은 진단이 아니라 생활 리듬과 회복 루틴의 점검 기준으로만 해석합니다.",
      "돈과 투자는 결과를 보장하지 않고 지출, 계약, 리스크 관리 기준을 정리하는 용도로만 읽어 주세요.",
      "합격, 승진, 이직, 결혼, 이혼, 임신, 출산은 확정하지 않고 현재 흐름에서 점검할 선택 기준만 제시합니다.",
    ],
    4,
  ).slice(0, 4);

  return {
    version: "v1",
    productType: "annual_fortune",
    productVersion: "v1",
    targetYear: packet.selectedYear,
    mode,
    personLabel: packet.personContext.name,
    userContextSummary: {
      lifeStatusLabel,
      fieldLabel,
      translationNote:
        "현재 상태와 분야 정보는 세운 계산의 원인이 아니라, 선택 연도 흐름을 실제 생활 장면으로 옮기는 보조 맥락으로만 사용했습니다.",
    },
    openingTitle: `${packet.personContext.name}님의 ${packet.selectedYear}년 세운 리포트`,
    headline: `${packet.annualFortune.ganji} 세운은 ${contextLabel}의 선택 기준을 더 구체적으로 묻는 해입니다.`,
    openingSummary:
      mode === "past_review"
        ? `${packet.selectedYear}년은 ${packet.annualFortune.yearTheme}이 그해 생활 장면에서 왜 무겁거나 넓게 느껴졌는지 회고하는 흐름입니다. ${packet.yearAccessPolicy.notice}`
        : mode === "new_year_preview"
          ? `${packet.selectedYear}년은 신년사주 성격으로 미리 열리는 흐름입니다. 준비, 활용, 조심할 기준을 월별 운영 리듬과 함께 봅니다.`
          : `${packet.selectedYear}년은 지금부터 남은 흐름을 어떻게 활용하고 조율할지 보는 현재 세운입니다. 상반기에 이미 체감된 신호와 남은 달의 운영 기준을 함께 읽습니다.`,
    coreLine: `${packet.annualFortune.yearTheme}: ${packet.annualFortune.interpretation}`,
    selectedYearSummary:
      `${packet.annualFortune.ganji} 세운은 ${packet.annualFortune.stemTenGod}·${packet.annualFortune.branchTenGod} 흐름으로 들어와 ` +
      `${contextLabel}의 일, 돈, 관계, 회복 리듬을 올해 기준으로 다시 정리하게 만듭니다. ${packet.annualFortune.caution}`,
    yearAccessNotice:
      `${packet.yearAccessPolicy.notice} ${packet.yearAccessPolicy.policyLabel}`,
    majorAnnualCrossReading,
    natalAnnualReading,
    monthlyFlowReading,
    monthlyHighlights: buildMonthlyHighlights(packet),
    careerWorkFlow: buildDraftFlowSection(packet, "careerWork"),
    moneyResourceFlow: buildDraftFlowSection(packet, "moneyResource"),
    relationshipFlow: buildDraftFlowSection(packet, "relationshipLove"),
    healthRoutineFlow: buildDraftFlowSection(packet, "healthRoutine"),
    mbtiExpression:
      packet.mbtiBasis.type === null
        ? "MBTI가 입력되지 않아도 세운의 큰 구조는 원국, 선택 연도 간지, 월운 기준으로 읽습니다. 행동 방식은 실제 생활 기록으로 보완해 보는 편이 좋습니다."
        : `${packet.mbtiBasis.type} 성향은 ${packet.mbtiBasis.decisionPattern} ${packet.mbtiBasis.workPattern} 올해 흐름의 원인이 아니라, 세운이 선택과 말투, 일 처리 속도로 드러나는 방식입니다.`,
    riskManagement: safeList(
      packet.riskPatterns.map(
        (risk) => `${risk.title}: ${risk.summary} ${risk.prevention}`,
      ),
      [
        "일과 돈 기준이 동시에 올라오면 역할, 기간, 금액을 문장으로 나누어 확인하세요.",
        "관계와 회복 리듬이 흔들릴 때는 감정 결론보다 연락 주기와 휴식 시간을 먼저 조정하세요.",
      ],
      2,
    ),
    actionPlan: safeList(
      packet.actionGuides.map(
        (guide) => `${guide.title}: ${guide.action} ${guide.timingHint}`,
      ),
      [
        "월초에는 일, 돈, 관계, 회복 기준 중 하나를 먼저 정리하세요.",
        "월말에는 실제로 부담이 커진 영역을 기록하고 다음 달 기준을 줄이세요.",
      ],
      3,
    ),
    yearSummary: {
      ganji: packet.annualFortune.ganji,
      displayTitle: `${packet.selectedYear}년 ${packet.annualFortune.ganji}`,
      elementLabel: packet.annualGanji.elementSummary,
      tenGodLabel: `${packet.annualFortune.stemTenGod}의 해`,
      modeLabel: packet.yearAccess.label,
      yearTone: packet.yearlyThemeSummary.summary,
    },
    scoreSummary: {
      flowIndex: 72,
      flowTypeLabel: "선택 연도 운영 기준 강화형",
      flowIndexCaution:
        "이 지표는 좋고 나쁨을 점수화하지 않고, 올해 체감될 관리 강도를 보기 위한 보조 기준입니다.",
    },
    flowCards: buildFlowCards(packet),
    keySignals: buildKeySignals(packet),
    annualStructure: {
      ganjiExplanation: `${packet.annualFortune.ganji}는 ${packet.annualGanji.stem}${packet.annualGanji.branch}의 천간·지지 흐름이 선택 연도 배경으로 들어오는 구조입니다.`,
      tenGodExplanation: packet.annualTenGod.plain,
      elementEffectExplanation: packet.elementEffect.plain,
      branchInteractionExplanation:
        packet.branchInteractions.map((interaction) => interaction.plain).join(" ") ||
        packet.natalAnnualRelations.interpretation,
    },
    chapters: buildChapters(packet),
    monthlyFlow: buildMonthlyFlow(packet),
    finalAdvice,
    safetyNotes,
  };
}

function annualFortuneFailure(input: {
  readonly code: AnnualFortuneGenerationErrorCode;
  readonly message: string;
}): AnnualFortuneGenerationResult {
  return {
    ok: false,
    kind: "annualFortune",
    error: input,
  };
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function uniqueStrings(values: readonly string[]): readonly string[] {
  return [...new Set(values.filter((value) => value.trim().length > 0))];
}
