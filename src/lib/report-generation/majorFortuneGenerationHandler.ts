import { withReportInputEvidence } from "./reportInputEvidence";
import { withBirthTimeEvidence } from "../saju/birthTimePrecisionTypes";
import { calculateCustomerDayun, selectCustomerDayun } from "../saju/customerDayun";
import { getAnnualFortuneCurrentYear } from "../report-knowledge/annualFortuneYearRules";
import {
  buildMajorFortuneEvidence,
} from "../report-knowledge/majorFortuneEvidence";
import type {
  MajorFortuneDomainFlowKey,
  MajorFortuneEvidencePacket,
} from "../report-knowledge/majorFortuneTypes";
import {
  USER_LIFE_STATUS_LABELS,
  USER_RELATIONSHIP_STATUS_LABELS,
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
  majorFortuneDomainLabels,
  type MajorFortuneDomainLabel,
  type MajorFortuneDraftFlowSection,
  type MajorFortuneReportDraft,
} from "./majorFortuneReportDraftTypes";
import {
  validateMajorFortuneReportDraft,
} from "./majorFortuneReportDraftValidator";
import {
  generateMajorFortuneReportDraft,
  type MajorFortuneReportWriterConfig,
  type MajorFortuneReportWriterResult,
} from "./openaiMajorFortuneReportWriter";
import type { SinglePersonGenerationInput } from "./reportInputAdapter";
import type { JobStatus } from "./reportInputTypes";

export type MajorFortuneGenerationErrorCode =
  | "MAJOR_FORTUNE_GENERATION_FAILED"
  | "MAJOR_FORTUNE_DRAFT_INVALID"
  | "INVALID_REPORT_INPUT";

export type MajorFortuneGenerationResult =
  | {
      readonly ok: true;
      readonly kind: "majorFortune";
      readonly draft: MajorFortuneReportDraft;
      readonly evidencePacket: MajorFortuneEvidencePacket;
    }
  | {
      readonly ok: false;
      readonly kind: "majorFortune";
      readonly error: {
        readonly code: MajorFortuneGenerationErrorCode;
        readonly message: string;
      };
    };

export type MajorFortuneGenerationHandlerOptions = {
  readonly now?: () => Date;
  readonly writer?: {
    readonly enabled: boolean;
    readonly config?: MajorFortuneReportWriterConfig;
  };
};

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

const domainFlowKeyByLabel = {
  "일·성과": "careerWork",
  "돈·현실": "moneyResource",
  인간관계: "socialFamily",
  "연애·가족": "relationshipLove",
  "학업·자격증": "studyGrowth",
  "몸·생활 리듬": "healthRoutine",
} as const satisfies Record<MajorFortuneDomainLabel, MajorFortuneDomainFlowKey>;

const fallbackSafetyNotes = [
  "이 리포트는 특정 사건이나 날짜를 예언하지 않고, 10년 흐름 안에서 선택과 관리 기준을 잡기 위한 참고 자료입니다.",
  "건강은 질병 진단이 아니라 생활 리듬과 회복 루틴의 관리 관점으로만 해석합니다.",
  "돈과 투자는 수익을 보장하지 않으며, 지출·계약·리스크 관리 기준을 정리하는 용도로만 읽어 주세요.",
  "합격, 승진, 이직, 결혼, 이혼을 확정하지 않고 현재 흐름에서 점검할 선택 기준만 제시합니다.",
] as const;

type MajorFortuneDraftBigTheme = MajorFortuneReportDraft["bigThemes"][number];

export async function generateMajorFortuneProductDraft(
  input: SinglePersonGenerationInput,
  options: MajorFortuneGenerationHandlerOptions = {},
): Promise<MajorFortuneGenerationResult> {
  if (input.kind !== "majorFortune") {
    return majorFortuneFailure({
      code: "INVALID_REPORT_INPUT",
      message: "Major fortune generation requires majorFortune input.",
    });
  }

  let evidencePacket: MajorFortuneEvidencePacket;
  const now = options.now?.() ?? new Date();
  const calculated = calculateCustomerDayun(input.person);
  if (!calculated.ok) return majorFortuneFailure({ code: "INVALID_REPORT_INPUT", message: calculated.error });
  const selection = selectCustomerDayun(calculated.value, getAnnualFortuneCurrentYear(now), now);
  if (!selection.ok) return majorFortuneFailure({ code: "INVALID_REPORT_INPUT", message: selection.error });
  try {
    evidencePacket = {
      ...buildMajorFortuneEvidenceFromGenerationInput(input, calculated.value.cycles, selection.value.targetYear),
      customerDayun: calculated.value,
      dayunSelection: selection.value,
    };
  } catch (error) {
    return majorFortuneFailure({
      code: "MAJOR_FORTUNE_GENERATION_FAILED",
      message: getErrorMessage(error),
    });
  }

  let draftResult: MajorFortuneReportWriterResult;
  try {
    draftResult =
      options.writer?.enabled === true && options.writer.config !== undefined
        ? await generateMajorFortuneReportDraft({
            evidencePacket,
            config: options.writer.config,
          })
        : {
            draft: buildMajorFortuneFallbackDraft(evidencePacket),
            model: "local-major-fortune-fallback",
          };
  } catch (error) {
    return majorFortuneFailure({
      code: "MAJOR_FORTUNE_GENERATION_FAILED",
      message: getErrorMessage(error),
    });
  }

  const validation = validateMajorFortuneReportDraft(draftResult.draft);

  if (!validation.ok || validation.value === undefined) {
    return majorFortuneFailure({
      code: "MAJOR_FORTUNE_DRAFT_INVALID",
      message: validation.errors.join("; "),
    });
  }

  return {
    ok: true,
    kind: "majorFortune",
    draft: {
      ...validation.value,
      dayunContext: selection.value,
      openingSummary: [validation.value.openingSummary, selection.value.notice].filter(Boolean).join(" "),
    },
    evidencePacket: withReportInputEvidence(evidencePacket, input),
  };
}

function buildMajorFortuneEvidenceFromGenerationInput(
  input: SinglePersonGenerationInput,
  cycles: MajorFortuneEvidencePacket["currentCycle"][],
  currentYear: number,
): MajorFortuneEvidencePacket {
  const saju = calculateMajorFortuneSaju(input.person);

  return withBirthTimeEvidence(buildMajorFortuneEvidence({
    currentYear,
    person: {
      label: input.person.name,
      birthDate: input.person.birthDate,
      gender: toMajorFortuneGender(input.person.gender),
      mbti: input.person.mbtiType === "" ? null : input.person.mbtiType,
      userContext: toMajorFortuneUserContext(input),
      pillars: toMajorFortunePillars(saju),
      labels: deriveMajorFortuneLabels(saju, input),
      majorFortuneCycleBasis: "manse_engine_major_fortune_table",
      majorFortuneCycles: cycles,
    },
  }), { person: saju.birthTimeContext });
}

function calculateMajorFortuneSaju(
  person: SinglePersonGenerationInput["person"],
): SajuCalcResult {
  const birthTime = person.birthTime.trim();

  return calculateSaju({
    birthDate: person.birthDate,
    ...(person.birthTimeUnknown || birthTime.length === 0
      ? {}
      : { birthTime }),
    birthTimeUnknown: person.birthTimeUnknown,
    birthTimePrecision: person.birthTimePrecision,
    approximateBirthTimeSlot: person.approximateBirthTimeSlot,
    calendarType: "SOLAR",
    gender: toSajuGender(person.gender),
    timezone: "Asia/Seoul",
  });
}

function toMajorFortunePillars(result: SajuCalcResult) {
  return {
    year: formatPillar(result.pillars.year),
    month: formatPillar(result.pillars.month),
    day: formatPillar(result.pillars.day),
    ...(result.pillars.hour === undefined
      ? {}
      : { hour: formatPillar(result.pillars.hour) }),
  };
}

function deriveMajorFortuneLabels(
  result: SajuCalcResult,
  input: SinglePersonGenerationInput,
): readonly string[] {
  const activeTenGods = collectActiveTenGodLabels(result);

  return uniqueStrings([
    `${formatPillar(result.pillars.day)}일주`,
    ...activeTenGods,
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

function toMajorFortuneUserContext(
  input: SinglePersonGenerationInput,
): UserContextProfile {
  const fieldLabel = input.userContext.detailJob.trim();

  return {
    lifeStatus: toMajorFortuneLifeStatus(input.userContext.jobStatus),
    fieldLabel:
      fieldLabel.length > 0
        ? fieldLabel
        : input.userContext.focusAreas.length > 0
          ? input.userContext.focusAreas.join(" · ")
          : null,
    relationshipStatus: toMajorFortuneRelationshipStatus(
      input.userContext.relationshipStatus,
    ),
  };
}

function toMajorFortuneLifeStatus(status: JobStatus): UserLifeStatus {
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

function toMajorFortuneRelationshipStatus(
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

function toMajorFortuneGender(
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

function getFlow(
  packet: MajorFortuneEvidencePacket,
  key: MajorFortuneDomainFlowKey,
): MajorFortuneDraftFlowSection {
  const flow = packet.domainFlows[key];

  return {
    title: flow.title,
    summary: flow.summary,
    supportingSignals: flow.supportingSignals,
    frictionSignals: flow.frictionSignals,
    actionHint: flow.actionHint,
  };
}

function buildDecadeCards(packet: MajorFortuneEvidencePacket) {
  return majorFortuneDomainLabels.map((label, index) => {
    const flow = packet.domainFlows[domainFlowKeyByLabel[label]];

    return {
      label,
      index: 72 - index * 3,
      headline: flow.title,
      body: flow.summary,
    };
  });
}

function buildBigThemes(
  packet: MajorFortuneEvidencePacket,
): readonly MajorFortuneDraftBigTheme[] {
  const themes = packet.strategicThemes.slice(0, 5).map((theme) => ({
    title: theme.label,
    metaphor: theme.metaphor,
    body: theme.plain,
    likelyScenes: ensureMinimumItems(
      theme.concreteImplications,
      packet.currentMajorFortune.supportSignals,
      2,
    ).slice(0, 4),
    strategy: theme.strategy,
  }));

  return ensureThemeMinimum(themes, packet);
}

function ensureThemeMinimum(
  themes: readonly MajorFortuneDraftBigTheme[],
  packet: MajorFortuneEvidencePacket,
): readonly MajorFortuneDraftBigTheme[] {
  const fallback = [
    {
      title: packet.currentMajorFortune.keyTheme,
      metaphor: `${packet.currentMajorFortune.ganji} 대운이 생활 기준선을 다시 잡는 흐름`,
      body: packet.currentMajorFortune.interpretation,
      likelyScenes: packet.currentMajorFortune.supportSignals.slice(0, 4),
      strategy: packet.actionGuides[0]?.action ?? "역할과 돈, 시간을 한 장의 기준표로 먼저 정리합니다.",
    },
    {
      title: packet.tenYearFlowSummary.headline,
      metaphor: "10년짜리 흐름을 해마다 나누어 쓰는 방식",
      body: packet.tenYearFlowSummary.summary,
      likelyScenes: packet.tenYearFlowSummary.keySignals.slice(0, 4),
      strategy: packet.actionGuides[1]?.action ?? "반복되는 압박을 기록하고 줄일 항목을 먼저 정합니다.",
    },
    {
      title: "올해 세운과 만나는 지점",
      metaphor: "긴 대운 위에 올해의 자극이 올라오는 장면",
      body: packet.currentAnnualCross.interpretation,
      likelyScenes: [
        packet.currentAnnualCross.annualFocus,
        packet.currentAnnualCross.caution,
      ],
      strategy: packet.actionGuides[2]?.action ?? "올해는 확장보다 기준 재정비를 먼저 끝냅니다.",
    },
  ];

  return [...themes, ...fallback]
    .map((theme) => ({
      ...theme,
      likelyScenes: ensureMinimumItems(theme.likelyScenes, fallback[0].likelyScenes, 2).slice(0, 4),
    }))
    .slice(0, 5)
    .slice(0, Math.max(3, themes.length));
}

function buildKeySignals(packet: MajorFortuneEvidencePacket) {
  const opportunity = packet.opportunitySignals[0];
  const difficulty = packet.difficultySignals[0];
  const transition = packet.transitionSignals[0];

  return [
    {
      type: "opportunity" as const,
      title: "살릴 흐름",
      body: opportunity?.plain ?? packet.currentMajorFortune.supportSignals[0] ?? packet.currentMajorFortune.keyTheme,
      evidenceLabel: opportunity?.type ?? "support",
    },
    {
      type: "difficulty" as const,
      title: "관리할 흐름",
      body: difficulty?.plain ?? packet.currentMajorFortune.frictionSignals[0] ?? packet.currentAnnualCross.caution,
      evidenceLabel: difficulty?.type ?? "friction",
    },
    {
      type: "transition" as const,
      title: "전환 신호",
      body: transition?.plain ?? packet.previousToCurrentShift.plain,
      evidenceLabel: transition?.type ?? "previous_to_current",
    },
  ];
}

function buildCycleChapters(packet: MajorFortuneEvidencePacket) {
  return majorFortuneDomainLabels.map((label) => {
    const flow = packet.domainFlows[domainFlowKeyByLabel[label]];
    const supportSignal = flow.supportingSignals[0];
    const frictionSignal = flow.frictionSignals[0];

    return {
      title: flow.title,
      headline: firstSentence(flow.summary),
      body:
        supportSignal && frictionSignal
          ? `도움이 되는 근거는 ${supportSignal} 관리할 근거는 ${frictionSignal}`
          : flow.summary,
      likelyScenes: ensureMinimumItems(
        [
          ...flow.supportingSignals.map((signal) => `살릴 장면: ${signal}`),
          ...flow.frictionSignals.map((signal) => `조절할 장면: ${signal}`),
        ],
        [`핵심 장면: ${flow.summary}`, `실행 장면: ${flow.actionHint}`],
        2,
      ).slice(0, 4),
      practicalAdvice: ensureMinimumItems(
        [
          getMajorFortuneDomainActionHint(label),
          supportSignal
            ? `이 영역에서 살릴 근거인 ${supportSignal}을 실제 선택 기록에 남깁니다.`
            : "",
          frictionSignal
            ? `관리 근거인 ${frictionSignal}은 과부하가 쌓이기 전에 범위를 좁혀 조정합니다.`
            : "",
        ],
        [
          "역할, 돈, 시간을 문서나 체크리스트로 남겨 반복되는 부담을 줄입니다.",
          "무리한 확장보다 지금 반복되는 압박을 먼저 정리합니다.",
        ],
        2,
      ).slice(0, 4),
    };
  });
}

function buildPhaseTimeline(packet: MajorFortuneEvidencePacket) {
  const phaseLabels = {
    early: "초반 1~3년",
    middle: "중반 4~7년",
    late: "후반 8~10년",
  } as const;

  return (["early", "middle", "late"] as const).map((phase) => {
    const rows = packet.cycleYearTimeline.filter((row) => row.phase === phase);
    const firstRow = rows[0] ?? packet.cycleYearTimeline[0];
    const lastRow = rows.at(-1) ?? firstRow;

    return {
      phase,
      label: phaseLabels[phase],
      headline: firstRow?.headline ?? `${phaseLabels[phase]} 흐름`,
      body:
        firstRow === undefined
          ? packet.tenYearFlowSummary.summary
          : `${phaseLabels[phase]}에는 ${firstRow.roleOfYearInCycle} ${lastRow?.whyItMatters ?? firstRow.whyItMatters}`,
      advice:
        firstRow?.strategicFocus ??
        "해마다 반복되는 압박과 선택 기준을 기록해 다음 단계의 기준으로 넘깁니다.",
    };
  });
}

function buildStrongYears(packet: MajorFortuneEvidencePacket) {
  const fromEvidence = packet.strongYearsWithinCycle.slice(0, 5).map((year) => ({
    year: year.year,
    ganji: year.ganji,
    headline: year.headline,
    body: year.reason,
    advice: year.action,
    whyStrong: year.whyStrong,
    likelyArea: year.likelyArea,
    pushStrategy: year.pushStrategy,
    reduceStrategy: year.reduceStrategy,
  }));
  const fallback = packet.majorFortuneTimelineRows.slice(0, 3).map((row) => ({
    year: row.year,
    ganji: row.annualGanji,
    headline: row.oneLine,
    body: row.strategy,
    advice: row.strategy,
    whyStrong: `${row.majorGanji} 대운 안에서 ${row.annualGanji} 세운이 ${row.annualTenGodLabel} 흐름으로 반복 기준을 자극합니다.`,
    likelyArea: "전환" as const,
    pushStrategy: row.strategy,
    reduceStrategy: "무리한 확장보다 역할, 돈, 회복 기준을 먼저 좁힙니다.",
  }));

  return [...fromEvidence, ...fallback].slice(0, Math.max(3, fromEvidence.length));
}

function buildFinalAdvice() {
  return majorFortuneDomainLabels.map((label) => {
    return {
      label,
      body: `${label} 기준: ${getMajorFortuneDomainActionHint(label)}`,
    };
  });
}

function getMajorFortuneDomainActionHint(label: MajorFortuneDomainLabel): string {
  if (label === "일·성과") {
    return "업무에서는 담당 범위, 결정권자, 다음 확인일을 먼저 적어야 과부하를 줄일 수 있습니다.";
  }
  if (label === "돈·현실") {
    return "돈은 수입 기대보다 고정비, 정산일, 철수 기준을 먼저 나누는 방식이 안전합니다.";
  }
  if (label === "인간관계") {
    return "사람 사이에서는 부탁을 받기 전에 맡을 범위와 거절할 범위를 짧게 확인하세요.";
  }
  if (label === "연애·가족") {
    return "가까운 관계에서는 해결책보다 감정 확인을 먼저 두고, 시간과 맡을 일을 구체적으로 합의하세요.";
  }
  if (label === "학업·자격증") {
    return "공부는 자격증, 문서, 포트폴리오처럼 남는 결과물로 묶을 때 흐름이 오래 갑니다.";
  }

  return "몸과 생활 리듬은 수면, 산책, 기록 시간을 먼저 고정해야 대운의 압박을 덜 받습니다.";
}

function buildDraftMyeongliLayers(packet: MajorFortuneEvidencePacket) {
  return {
    tenGodLayer: packet.myeongliLayers.tenGodLayer,
    elementLayer: packet.myeongliLayers.elementLayer,
    branchInteractionLayer: {
      plain: packet.myeongliLayers.branchInteractionLayer.plain,
      interactions: packet.myeongliLayers.branchInteractionLayer.interactions.map(
        (interaction) => ({
          year: interaction.year ?? null,
          type: interaction.type,
          plainType: interaction.plainType,
          plain: interaction.plain,
          impactArea: interaction.impactArea,
        }),
      ),
    },
    hiddenStemLayer: packet.myeongliLayers.hiddenStemLayer,
    twelveStageLayer: packet.myeongliLayers.twelveStageLayer,
    auxiliaryStarsLayer: packet.myeongliLayers.auxiliaryStarsLayer.map((star) => ({
      label: star.label,
      plain: star.plain,
      caution: star.caution ?? null,
    })),
  };
}

function buildDraftCycleYearTimeline(packet: MajorFortuneEvidencePacket) {
  return packet.cycleYearTimeline.map((row) => ({
    year: row.year,
    ganji: row.ganji,
    yearIndexInCycle: row.yearIndexInCycle,
    phase: row.phase,
    headline: row.headline,
    roleOfYearInCycle: row.roleOfYearInCycle,
    plainInterpretation: row.plainInterpretation,
    strategicFocus: row.strategicFocus,
    whyItMatters: row.whyItMatters,
  }));
}

function buildTimelineYearDetails(
  packet: MajorFortuneEvidencePacket,
): MajorFortuneReportDraft["majorFortuneTimelineRows"] {
  return packet.majorFortuneTimelineRows.map((row) => {
    const yearReading =
      packet.cycleYearTimeline.find((item) => item.year === row.year) ??
      packet.cycleYearTimeline[0];
    const mbtiLine = buildYearMbtiLine({
      tenGod: row.annualTenGodLabel,
      basis: packet.mbtiBasis,
    });

    return {
      ...row,
      ageLabel: toKoreanAgeLabel(row.ageLabel),
      ageBasisLabel:
        row.ageBasisLabel === null
          ? "입력 대운표 기준 한국나이"
          : row.ageBasisLabel.includes("한국나이")
            ? row.ageBasisLabel
            : `${row.ageBasisLabel} · 한국나이`,
      yearDetail: {
        coreFlow: buildYearCoreFlow({ packet, row, yearReading }),
        realWorldScenes: buildContextualYearScene({
          packet,
          row,
          yearReading,
          mbtiLine,
        }),
        cautionPoint: buildYearCaution(row),
        actionStandard: buildYearActionStandard(row),
      },
    };
  });
}

function buildMajorFortuneFallbackDraft(
  packet: MajorFortuneEvidencePacket,
): MajorFortuneReportDraft {
  const current = packet.currentMajorFortune;
  const userContext = packet.personContext.userContext;
  const relationshipStatus = userContext.relationshipStatus ?? "unknown";
  const riskManagement = ensureMinimumItems(
    packet.riskPatterns.map((risk) => `${risk.title}: ${risk.summary} ${risk.prevention}`),
    [
      "과도한 책임 누적: 맡을 일과 맡지 않을 일을 문서로 나누고, 매주 회복 시간을 일정에 고정합니다.",
      "돈과 역할의 경계 흐림: 새 계약이나 지출은 금액, 기간, 회수 기준을 먼저 확인합니다.",
    ],
    2,
  );
  const actionPlan = ensureMinimumItems(
    packet.actionGuides.map((guide) => `${guide.title}: ${guide.action} ${guide.timingHint}`),
    [
      "첫 기준 세우기: 현재 맡은 역할과 반복 지출을 한 장으로 정리합니다.",
      "월간 점검: 대운의 압박이 일, 돈, 관계 중 어디에서 반복되는지 기록합니다.",
      "연간 조정: 올해 세운이 건드리는 초점을 보고 무리한 확장보다 조율할 항목을 먼저 닫습니다.",
    ],
    3,
  );

  return {
    version: "v1",
    productType: "major_fortune",
    productVersion: "v1",
    personLabel: packet.personLabel,
    headline: `${packet.personLabel}님의 ${current.ganji} 대운 리포트`,
    openingTitle: `${current.ganji} 대운의 10년 흐름`,
    openingSummary:
      `${packet.tenYearFlowSummary.summary} 올해는 ${packet.currentAnnualCross.annualGanji} 세운이 올라와 ${packet.currentAnnualCross.annualFocus}을 더 선명하게 건드립니다.`,
    coreLine: current.keyTheme,
    userContextSummary: {
      lifeStatusLabel: USER_LIFE_STATUS_LABELS[userContext.lifeStatus],
      fieldLabel: userContext.fieldLabel ?? null,
      relationshipStatusLabel:
        relationshipStatus === "unknown"
          ? null
          : USER_RELATIONSHIP_STATUS_LABELS[relationshipStatus],
      translationNote:
        "현재 직업, 관계 상태, MBTI는 대운 계산 원인이 아니라 10년 흐름이 실제 행동과 생활 장면에서 어떻게 드러나는지 보조하는 기준으로만 사용했습니다.",
    },
    cycleSummary: {
      ganji: current.ganji,
      displayTitle: `${current.ganji} 대운`,
      cycleIndexLabel: `${current.cycleIndex}번째 대운`,
      currentPositionLabel: packet.cyclePosition.positionLabel,
      ageRangeLabel: current.ageRange,
      yearRangeLabel: current.yearRange,
      stemLabel: current.stem,
      branchLabel: current.branch,
      elementLabel: current.elementFocus.join(" · "),
      tenGodLabel: current.stemTenGod,
      basisLabel: packet.calculationBasis.displayLabel,
    },
    calculationBasis: packet.calculationBasis,
    previousToCurrentShift: {
      previousGanji: packet.previousToCurrentShift.previousGanji ?? null,
      currentGanji: packet.previousToCurrentShift.currentGanji,
      plain: packet.previousToCurrentShift.plain,
      whatChanged: packet.previousToCurrentShift.whatChanged,
    },
    decadeArchetype: packet.decadeArchetype,
    flowIndexSummary: {
      flowIndex: 72,
      flowTypeLabel: "10년 흐름 재정렬형",
      flowIndexCaution:
        "이 지표는 좋고 나쁨이 아니라 10년 동안 반복될 체감 강도를 보기 위한 보조 기준입니다.",
    },
    bigThemes: buildBigThemes(packet),
    myeongliLayers: buildDraftMyeongliLayers(packet),
    decadeCards: buildDecadeCards(packet),
    keySignals: buildKeySignals(packet),
    majorStructure: {
      ganjiExplanation: `${current.ganji} 대운은 ${current.stem}${current.branch}의 천간·지지 흐름이 장기 배경으로 작동합니다.`,
      tenGodExplanation: packet.majorTenGod.plain,
      elementEffectExplanation: packet.elementEffect.plain,
      branchInteractionExplanation:
        packet.branchInteractions.map((interaction) => interaction.plain).join(" ") ||
        "원국과 대운의 지지 작용은 생활 리듬, 관계 거리, 역할 조율의 장면으로 번역합니다.",
      transitionExplanation: packet.previousToCurrentShift.plain,
    },
    cycleChapters: buildCycleChapters(packet),
    phaseTimeline: buildPhaseTimeline(packet),
    strongYears: buildStrongYears(packet),
    majorFortuneTimelineRows: buildTimelineYearDetails(packet),
    cycleYearTimeline: buildDraftCycleYearTimeline(packet),
    currentCycleSummary: current.interpretation,
    tenYearTheme: `${packet.tenYearFlowSummary.headline}: ${packet.tenYearFlowSummary.summary}`,
    timelineReading:
      "대운 타임라인은 한 해의 길흉을 단정하기보다, 현재 대운 안에서 어떤 해가 시작·중반·정리 역할을 맡는지 보여 줍니다.",
    annualCrossReading:
      `${packet.currentAnnualCross.annualGanji} 세운은 현재 대운 위에서 ${packet.currentAnnualCross.interpretation} ${packet.currentAnnualCross.caution}`,
    careerWorkFlow: getFlow(packet, "careerWork"),
    moneyResourceFlow: getFlow(packet, "moneyResource"),
    relationshipFlow: getFlow(packet, "relationshipLove"),
    healthRoutineFlow: getFlow(packet, "healthRoutine"),
    mbtiExpression:
      packet.mbtiBasis.type === null
        ? "MBTI가 입력되지 않아도 대운의 큰 방향은 원국과 대운표 기준으로 읽습니다. 다만 행동 방식은 실제 생활 기록을 통해 보완해 보는 편이 좋습니다."
        : `${packet.mbtiBasis.type} 성향은 ${packet.mbtiBasis.decisionPattern} ${packet.mbtiBasis.workPattern} 대운의 압박은 원인이 아니라, 이 성향이 판단 속도와 실행 방식으로 드러나는 배경입니다.`,
    riskManagement,
    actionPlan,
    finalAdvice: buildFinalAdvice(),
    safetyNotes:
      packet.safetyNotes.length > 0 ? packet.safetyNotes : fallbackSafetyNotes,
  };
}

function toKoreanAgeLabel(ageLabel: string | null): string | null {
  if (ageLabel === null || ageLabel.trim().length === 0) {
    return null;
  }
  if (ageLabel.includes("한국나이")) {
    return ageLabel;
  }

  return `한국나이 ${ageLabel}`;
}

function explainMajorFortuneSignal(value: string | null): string {
  const signal = value?.trim() ?? "";

  if (signal.length === 0) {
    return "원국과 세운의 작용은 생활 리듬, 역할, 관계 조율의 장면으로 풀어 읽습니다.";
  }
  if (signal.includes("충")) {
    return `${signal}: 익숙한 구조와 새 요구가 부딪혀 역할, 계약, 일정 기준을 다시 맞춰야 하는 장면입니다.`;
  }
  if (signal.includes("해")) {
    return `${signal}: 겉으로 크게 싸우지 않아도 불편감과 서운함이 천천히 쌓일 수 있는 지점입니다.`;
  }
  if (signal.includes("형")) {
    return `${signal}: 누적 부담이 커지기 쉬워 기준을 좁히고 회복 시간을 먼저 확보해야 하는 장면입니다.`;
  }
  if (signal.includes("파")) {
    return `${signal}: 기존 방식이 깨지고 다시 맞춰야 하는 장면이 생기기 쉬운 흐름입니다.`;
  }
  if (signal.includes("반합")) {
    return `${signal}: 일부 흐름이 살아나지만 결론까지 가려면 속도와 기준 조율이 필요한 장면입니다.`;
  }
  if (signal.includes("삼합")) {
    return `${signal}: 같은 방향의 힘이 커져 장점과 과열이 함께 생길 수 있는 흐름입니다.`;
  }
  if (signal.includes("합")) {
    return `${signal}: 약속, 관계, 일정이 묶이며 실제 움직임이 생기기 쉬운 흐름입니다.`;
  }

  return signal;
}

function buildYearCoreFlow(input: {
  readonly packet: MajorFortuneEvidencePacket;
  readonly row: MajorFortuneEvidencePacket["majorFortuneTimelineRows"][number];
  readonly yearReading:
    | MajorFortuneEvidencePacket["cycleYearTimeline"][number]
    | undefined;
}): string {
  const interaction = explainMajorFortuneSignal(input.row.keyInteractionLabel);
  const headline = input.yearReading?.headline ?? input.row.oneLine;

  const interactionReading = interaction
    ? `${input.row.annualGanji} 세운의 ${interaction}`
    : "원국과 세운의 작용은 생활 리듬, 역할, 관계 조율의 장면으로 풀어 읽습니다.";

  return `${input.row.year}년 ${input.row.annualGanji} 세운은 ${input.row.annualTenGodLabel} 흐름입니다. ${input.row.annualGanji} 세운은 ${input.packet.currentMajorFortune.ganji} 대운의 ${input.packet.currentMajorFortune.stemTenGod} 배경 위에서 "${headline}" 흐름을 실제 선택으로 당깁니다. ${interactionReading}`;
}

function buildContextualYearScene(input: {
  readonly packet: MajorFortuneEvidencePacket;
  readonly row: MajorFortuneEvidencePacket["majorFortuneTimelineRows"][number];
  readonly yearReading:
    | MajorFortuneEvidencePacket["cycleYearTimeline"][number]
    | undefined;
  readonly mbtiLine: string;
}): string {
  const context = input.packet.userContextReading;
  const field = context.currentField ?? "현재 분야";
  const focus = context.focusAreas.length > 0
    ? context.focusAreas.join("·")
    : "직업·돈·관계·공부";
  const concern =
    context.currentConcern ||
    `${field}에서 ${focus} 흐름을 어디에 쓸지 정하는 것`;

  return `${field} 맥락에서는 ${input.row.strategy} 기준이 실제 장면으로 드러납니다. ${focus} 중에서도 ${input.row.annualTenGodLabel}이 건드리는 영역을 먼저 좁혀야 하고, ${concern}이 중요해지는 해입니다.\n\n${input.row.year}년의 실행 초점은 ${input.yearReading?.strategicFocus ?? input.row.strategy} ${input.mbtiLine}`;
}

function buildYearMbtiLine(input: {
  readonly tenGod: string;
  readonly basis: MajorFortuneEvidencePacket["mbtiBasis"];
}): string {
  if (!input.basis.type) {
    return `${input.tenGod}의 연도 흐름은 명리 근거로 읽으며, 입력되지 않은 MBTI 행동 성향은 추정하지 않습니다.`;
  }

  const type = input.basis.type;
  if (input.tenGod.includes("식신")) return `${type} 성향은 작은 결과물을 먼저 보여 주고 반응을 확인하는 방식으로 식신의 실행력을 살릴 수 있습니다.`;
  if (input.tenGod.includes("상관")) return `${type} 성향은 개선안을 제안할 때 근거와 일정표를 함께 내는 방식으로 상관의 표현력을 조절할 수 있습니다.`;
  if (input.tenGod.includes("편재")) return `${type} 성향은 외부 기회를 빠르게 읽되 정산일과 책임 범위를 먼저 정하는 방식으로 편재의 확장성을 다룹니다.`;
  if (input.tenGod.includes("정재")) return `${type} 성향은 돈과 시간을 숫자로 정리하되 작은 실험 범위를 남기는 방식으로 정재의 안정성을 씁니다.`;
  if (input.tenGod.includes("편관")) return `${type} 성향은 압박 속에서도 권한과 책임을 분리하는 방식으로 편관의 추진력을 과부하 없이 씁니다.`;
  if (input.tenGod.includes("정관")) return `${type} 성향은 평가와 역할 기준을 문서화하되 상대의 속도를 확인하는 방식으로 정관의 질서를 만듭니다.`;
  if (input.tenGod.includes("편인")) return `${type} 성향은 새 정보를 검토한 뒤 실행 날짜를 정하는 방식으로 편인의 탐색이 지연으로 바뀌지 않게 합니다.`;
  if (input.tenGod.includes("정인")) return `${type} 성향은 학습과 기록을 실제 일정에 묶는 방식으로 정인의 정리 능력을 결과로 남깁니다.`;
  if (input.tenGod.includes("비견")) return `${type} 성향은 혼자 할 일과 함께할 일을 초반에 나누는 방식으로 비견의 자기 기준을 협업에 연결합니다.`;
  if (input.tenGod.includes("겁재")) return `${type} 성향은 공동 비용과 역할 범위를 먼저 합의하는 방식으로 겁재의 경쟁과 협업 에너지를 관리합니다.`;

  return `${type} 성향은 ${input.tenGod} 흐름에서 판단 기준과 실행 순서를 명확히 할 때 장점이 살아납니다.`;
}

function buildYearCaution(
  row: MajorFortuneEvidencePacket["majorFortuneTimelineRows"][number],
): string {
  const tenGod = row.annualTenGodLabel;
  if (tenGod.includes("식신")) return `${row.year}년에는 결과물을 너무 많이 벌리기보다 먼저 보여 줄 한 가지와 피드백 날짜를 정해야 합니다.`;
  if (tenGod.includes("상관")) return `${row.year}년에는 빠른 제안이 충돌로 번지지 않도록 근거, 대안, 다음 확인일을 함께 제시하세요.`;
  if (tenGod.includes("편재")) return `${row.year}년에는 외부 기회보다 계약 조건, 정산일, 철수 기준을 먼저 확인해야 비용 누수를 줄일 수 있습니다.`;
  if (tenGod.includes("정재")) return `${row.year}년에는 안정화에만 머물지 않도록 고정비를 정리한 뒤 감당 가능한 실험 범위를 남겨 두세요.`;
  if (tenGod.includes("편관")) return `${row.year}년에는 급한 책임을 떠안기 전에 승인선, 결정 권한, 거절할 일을 먼저 확인하세요.`;
  if (tenGod.includes("정관")) return `${row.year}년에는 규칙을 세우되 사람의 속도까지 통제하지 않도록 평가 기준과 조율 범위를 나누세요.`;
  if (tenGod.includes("편인")) return `${row.year}년에는 검토가 길어져 실행이 늦어지지 않도록 조사 종료일과 첫 행동 날짜를 함께 정하세요.`;
  if (tenGod.includes("정인")) return `${row.year}년에는 준비만 이어지지 않도록 학습 기록과 실제 적용을 같은 주기에 배치하세요.`;
  if (tenGod.includes("비견")) return `${row.year}년에는 자기 기준이 협업의 고집으로 보이지 않도록 혼자 할 일과 합의할 일을 구분하세요.`;
  if (tenGod.includes("겁재")) return `${row.year}년에는 사람과 비용이 섞이지 않도록 공동 지출, 역할, 중단 조건을 초반에 합의하세요.`;

  return `${row.year}년에는 ${row.strategy} 실행 범위와 확인 날짜를 함께 정하세요.`;
}

function buildYearActionStandard(
  row: MajorFortuneEvidencePacket["majorFortuneTimelineRows"][number],
): string {
  const tenGod = row.annualTenGodLabel;
  if (tenGod.includes("식신")) return "먼저 보여 줄 결과물 하나와 피드백 날짜를 정합니다.";
  if (tenGod.includes("상관")) return "제안 하나마다 근거, 대안, 담당자, 다음 확인일을 붙입니다.";
  if (tenGod.includes("편재")) return "새 계약의 금액, 정산일, 책임 범위, 철수 기준을 숫자로 적습니다.";
  if (tenGod.includes("정재")) return "고정비와 반복 일정을 먼저 잠그고 작은 실험 예산을 따로 둡니다.";
  if (tenGod.includes("편관")) return "급한 일일수록 승인선, 권한, 거절 범위를 먼저 확인합니다.";
  if (tenGod.includes("정관")) return "평가 기준과 보고 방식을 문서로 남기고 조율 날짜를 정합니다.";
  if (tenGod.includes("편인")) return "조사 종료일, 선택 기준, 첫 실행 날짜를 한 세트로 묶습니다.";
  if (tenGod.includes("정인")) return "학습 기록 하나를 실제 업무나 생활에 적용하는 날짜를 잡습니다.";
  if (tenGod.includes("비견")) return "혼자 결정할 일과 함께 합의할 일을 초반에 나눕니다.";
  if (tenGod.includes("겁재")) return "공동 비용, 역할, 보상, 중단 조건을 시작 전에 합의합니다.";

  return "그해 먼저 고정할 역할, 돈 기준, 회복 루틴을 하나씩 정합니다.";
}

function ensureMinimumItems(
  items: readonly string[],
  fallbackItems: readonly string[],
  minimum: number,
): readonly string[] {
  const result = uniqueStrings(items.filter((item) => item.trim().length > 0));

  for (const fallbackItem of fallbackItems) {
    if (result.length >= minimum) break;
    if (!result.includes(fallbackItem)) {
      result.push(fallbackItem);
    }
  }

  return result;
}

function firstSentence(value: string): string {
  return value.split(/[.!?。]\s*|[.。]\s*/u)[0]?.trim() || value.trim();
}

function uniqueStrings(values: readonly string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function majorFortuneFailure(input: {
  readonly code: MajorFortuneGenerationErrorCode;
  readonly message: string;
}): MajorFortuneGenerationResult {
  return {
    ok: false,
    kind: "majorFortune",
    error: input,
  };
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown major fortune generation error.";
}
