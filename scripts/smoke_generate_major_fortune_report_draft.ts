import {
  buildMajorFortuneEvidence,
  summarizeMajorFortuneEvidenceMatrixQuality,
} from "../src/lib/report-knowledge/majorFortuneEvidence";
import {
  MAJOR_FORTUNE_FIXTURES,
  requireMajorFortuneFixture,
} from "../src/lib/report-knowledge/majorFortuneFixtures";
import {
  summarizeMajorFortuneDraftQuality,
  validateMajorFortuneReportDraft,
} from "../src/lib/report-generation/majorFortuneReportDraftValidator";
import type {
  MajorFortuneDomainLabel,
  MajorFortuneDraftFlowSection,
  MajorFortuneReportDraft,
} from "../src/lib/report-generation/majorFortuneReportDraftTypes";
import { majorFortuneDomainLabels } from "../src/lib/report-generation/majorFortuneReportDraftTypes";
import type {
  MajorFortuneDomainFlowKey,
  MajorFortuneEvidencePacket,
} from "../src/lib/report-knowledge/majorFortuneTypes";
import {
  USER_LIFE_STATUS_LABELS,
  USER_RELATIONSHIP_STATUS_LABELS,
} from "../src/lib/report-knowledge/userContextTypes";
import {
  getMajorFortunePreviewSnapshotRelativePath,
  getMajorFortunePreviewUrl,
  writeMajorFortunePreviewSnapshot,
} from "../src/lib/report-generation/majorFortunePreviewSnapshot";

const openAIKeyEnvName = ["OPENAI", "API", "KEY"].join("_");
const majorFortuneDefaultFixtureId = "deokmin-current-major-fortune";

function getFixtureId(argv: readonly string[]): string {
  const flagIndex = argv.findIndex((arg) => arg === "--fixture");
  const inline = argv.find((arg) => arg.startsWith("--fixture="));

  return inline?.split("=")[1] ??
    (flagIndex >= 0 ? argv[flagIndex + 1] : undefined) ??
    MAJOR_FORTUNE_FIXTURES.find(
      (fixture) => fixture.id === majorFortuneDefaultFixtureId,
    )?.id ??
    MAJOR_FORTUNE_FIXTURES[0].id;
}

function shouldWritePreview(argv: readonly string[]): boolean {
  return argv.includes("--write-preview");
}

function shouldRunAll(argv: readonly string[]): boolean {
  return argv.includes("--all");
}

function getEnvValue(name: string): string | undefined {
  const value = process.env[name];

  return value === undefined || value.trim().length === 0 ? undefined : value;
}

function isWriterEnabled(): boolean {
  return getEnvValue("OPENAI_REPORT_WRITER_ENABLED") === "1";
}

function hasWriterConfig(): boolean {
  return (
    getEnvValue(openAIKeyEnvName) !== undefined &&
    getEnvValue("OPENAI_REPORT_MODEL") !== undefined
  );
}

function writeLine(line: string): void {
  process.stdout.write(`${line}\n`);
}

function writeList(label: string, values: readonly string[]): void {
  writeLine(`${label}:`);
  if (values.length === 0) {
    writeLine("- none");
    return;
  }
  for (const value of values) {
    writeLine(`- ${value}`);
  }
}

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

function firstSentence(value: string): string {
  return value.split(/[.!?。]\s*|[.。]\s*/u)[0]?.trim() || value.trim();
}

function ensureMinimumItems(
  items: readonly string[],
  fallbackItems: readonly string[],
  minimum: number,
): readonly string[] {
  const result = [...items.filter((item) => item.trim().length > 0)];

  for (const fallbackItem of fallbackItems) {
    if (result.length >= minimum) break;
    if (!result.includes(fallbackItem)) {
      result.push(fallbackItem);
    }
  }

  return result;
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
      body: `${flow.summary} ${flow.actionHint}`,
    };
  });
}

function buildBigThemes(packet: MajorFortuneEvidencePacket) {
  const evidenceThemes = packet.strategicThemes.slice(0, 5).map((theme) => ({
    title: theme.label,
    metaphor: theme.metaphor,
    body: theme.plain,
    likelyScenes: theme.concreteImplications,
    strategy: theme.strategy,
  }));
  const fallbackThemes = [
    {
      title: packet.currentMajorFortune.keyTheme,
      metaphor: `${packet.currentMajorFortune.ganji} 대운이 생활의 기준선을 다시 잡는 흐름`,
      body: packet.currentMajorFortune.interpretation,
      likelyScenes: packet.currentMajorFortune.supportSignals,
      strategy: packet.actionGuides[0]?.action ?? "역할과 돈, 시간을 한 장의 기준표로 먼저 정리합니다.",
    },
    {
      title: packet.tenYearFlowSummary.headline,
      metaphor: "10년짜리 흐름을 해마다 나누어 쓰는 방식",
      body: packet.tenYearFlowSummary.summary,
      likelyScenes: packet.tenYearFlowSummary.keySignals,
      strategy: packet.actionGuides[1]?.action ?? "매년 반복되는 압박을 기록하고 줄일 항목을 먼저 정합니다.",
    },
    {
      title: "올해 세운과 만나는 지점",
      metaphor: "긴 대운 위에 올해의 자극이 올라오는 장면",
      body: packet.currentAnnualCross.interpretation,
      likelyScenes: [packet.currentAnnualCross.annualFocus, packet.currentAnnualCross.caution],
      strategy: packet.actionGuides[2]?.action ?? "올해는 확장보다 기준 재정비를 먼저 끝냅니다.",
    },
  ];

  return [...evidenceThemes, ...fallbackThemes].slice(0, 5).slice(0, Math.max(3, evidenceThemes.length));
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
      body: `${flow.summary} ${flow.actionHint}`,
      likelyScenes: [...flow.supportingSignals, ...flow.frictionSignals].slice(0, 4),
      practicalAdvice: ensureMinimumItems(
        [
          flow.actionHint,
          supportSignal
            ? `${supportSignal}은 이번 대운에서 먼저 살릴 기준으로 두고, 성과가 보이는 형태로 기록합니다.`
            : "",
          frictionSignal
            ? `${frictionSignal}은 일정, 돈, 역할 중 하나의 기준으로 쪼개어 과부하가 쌓이기 전에 조정합니다.`
            : "",
        ],
        [
          "말로 넘기기보다 역할, 돈, 시간을 문서나 체크리스트로 남겨 반복되는 부담을 줄입니다.",
          "무리한 확장보다 지금 반복되는 압박을 먼저 정리하고, 남는 힘을 다음 선택에 배치합니다.",
        ],
        2,
      ),
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

    return {
      phase,
      label: phaseLabels[phase],
      headline: firstRow?.headline ?? `${phaseLabels[phase]} 흐름`,
      body:
        rows.map((row) => row.plainInterpretation).join(" ") ||
        packet.tenYearFlowSummary.summary,
      advice:
        firstRow?.strategicFocus ??
        "해마다 반복되는 압박과 선택 기준을 기록해 다음 단계의 기준으로 넘깁니다.",
    };
  });
}

function buildStrongYears(packet: MajorFortuneEvidencePacket) {
  return packet.strongYearsWithinCycle.slice(0, 5).map((year) => ({
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
}

function buildFinalAdvice(packet: MajorFortuneEvidencePacket) {
  return majorFortuneDomainLabels.map((label) => {
    const flow = packet.domainFlows[domainFlowKeyByLabel[label]];

    return {
      label,
      body: `${flow.summary} ${flow.actionHint}`,
    };
  });
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
  if (/辰申.*반합|申辰.*반합/u.test(signal)) {
    return `${signal}: 생각과 회복, 정보 흐름이 부분적으로 살아나는 장면입니다. 좋게 쓰면 판단 재료가 많아지고, 과하면 결론이 늦어질 수 있습니다.`;
  }
  if (/卯辰.*해|辰卯.*해/u.test(signal)) {
    return `${signal}: 크게 터지는 충돌보다 작지만 반복되는 어긋남과 누적 피로로 보기 쉽습니다.`;
  }
  if (/辰辰.*형/u.test(signal)) {
    return `${signal}: 외부 사건보다 스스로 기준을 높이고 압박을 반복해서 키우는 장면으로 해석합니다.`;
  }
  if (signal.includes("충")) {
    return `${signal}: 익숙한 구조와 새 요구가 부딪혀 역할, 계약, 일정 기준을 다시 맞춰야 하는 장면입니다.`;
  }
  if (signal.includes("해")) {
    return `${signal}: 겉으로 크게 싸우지 않아도 불편감과 서운함이 천천히 쌓일 수 있는 지점입니다.`;
  }
  if (signal.includes("형")) {
    return `${signal}: 반복 압박이 커지기 쉬워 기준을 좁히고 회복 시간을 먼저 확보해야 하는 장면입니다.`;
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

function buildTimelineYearDetails(
  packet: MajorFortuneEvidencePacket,
): MajorFortuneReportDraft["majorFortuneTimelineRows"] {
  return packet.majorFortuneTimelineRows.map((row) => {
    const yearReading =
      packet.cycleYearTimeline.find((item) => item.year === row.year) ??
      packet.cycleYearTimeline[0];
    const careerFlow = packet.domainFlows.careerWork;
    const moneyFlow = packet.domainFlows.moneyResource;
    const relationshipFlow = packet.domainFlows.relationshipLove;
    const healthFlow = packet.domainFlows.healthRoutine;
    const socialFlow = packet.domainFlows.socialFamily;
    const studyFlow = packet.domainFlows.studyGrowth;
    const mbtiLine =
      packet.mbtiBasis.type === null
        ? "MBTI가 없어도 이 해의 판단 방식은 실제 기록과 생활 반응을 보며 보완합니다."
        : `${packet.mbtiBasis.type} 성향은 이 해에 ${packet.mbtiBasis.decisionPattern} ${packet.mbtiBasis.workPattern} 흐름으로 드러나기 쉽습니다. 명리 흐름의 원인이 아니라 실행 속도와 판단 방식의 표현입니다.`;

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
        myeongliSummary: `${row.year}년 ${row.annualGanji} 연운은 ${row.annualTenGodLabel} 흐름으로, ${packet.currentMajorFortune.ganji} 대운 안에서 ${yearReading?.headline ?? row.oneLine} 장면을 강조합니다.`,
        daeunAnnualRelation:
          yearReading?.roleOfYearInCycle ??
          `${packet.currentMajorFortune.ganji} 대운 위에 ${row.annualGanji} 세운이 올라와 그해의 실행 압력을 만듭니다.`,
        natalAnnualRelation: `${row.year}년 기준, ${explainMajorFortuneSignal(row.keyInteractionLabel)}`,
        careerWork: `${row.year}년 ${careerFlow.title}: ${careerFlow.summary} 이 해에는 ${yearReading?.strategicFocus ?? row.strategy}`,
        moneyResource: `${row.year}년 ${moneyFlow.title}: ${row.annualTenGodLabel} 흐름을 돈으로 바로 키우기보다 ${moneyFlow.actionHint}`,
        relationshipLove: `${row.year}년 ${relationshipFlow.title}: ${row.annualGanji} 세운은 관계에서 ${relationshipFlow.actionHint}`,
        healthRoutine: `${row.year}년 ${healthFlow.title}: ${row.annualTenGodLabel} 압박이 커질수록 ${healthFlow.actionHint}`,
        socialFamily: `${row.year}년 ${socialFlow.title}: ${yearReading?.roleOfYearInCycle ?? row.oneLine} 흐름에서는 ${socialFlow.actionHint}`,
        studyGrowth: `${row.year}년 ${studyFlow.title}: ${yearReading?.strategicFocus ?? row.strategy} 기준으로 ${studyFlow.actionHint}`,
        mbtiExpression: `${row.year}년에는 ${mbtiLine}`,
        caution: `${row.year}년 주의점은 ${row.strategy} ${packet.currentAnnualCross.caution}`,
        actionStandard:
          yearReading?.strategicFocus ??
          row.strategy ??
          "그해 먼저 고정할 역할, 돈 기준, 회복 루틴을 하나씩 정합니다.",
      },
    };
  });
}

function buildWriterDisabledMajorFortuneDraft(
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
      `${packet.tenYearFlowSummary.summary} 올해는 ${packet.currentAnnualCross.annualGanji} 세운이 올라와 ` +
      `${packet.currentAnnualCross.annualFocus}을 더 선명하게 건드립니다.`,
    coreLine: current.keyTheme,
    userContextSummary: {
      lifeStatusLabel: USER_LIFE_STATUS_LABELS[userContext.lifeStatus],
      fieldLabel: userContext.fieldLabel ?? null,
      relationshipStatusLabel: USER_RELATIONSHIP_STATUS_LABELS[relationshipStatus],
      translationNote:
        "현재 직업, 관계 상태, MBTI는 대운 흐름이 실제 행동과 생활 장면에서 어떻게 드러나는지 보조하는 기준으로만 사용했습니다.",
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
      `${packet.currentAnnualCross.annualGanji} 세운은 현재 대운 위에서 ${packet.currentAnnualCross.interpretation} ` +
      `${packet.currentAnnualCross.caution}`,
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
    finalAdvice: buildFinalAdvice(packet),
    safetyNotes:
      packet.safetyNotes.length > 0 ? packet.safetyNotes : fallbackSafetyNotes,
  };
}

function hasMyeongliLayers(
  packet: ReturnType<typeof buildMajorFortuneEvidence>,
): boolean {
  return (
    packet.myeongliLayers.tenGodLayer.plain.length > 0 &&
    packet.myeongliLayers.elementLayer.plain.length > 0 &&
    packet.myeongliLayers.hiddenStemLayer.plain.length > 0
  );
}

function hasStrongYearPushReduce(
  packet: ReturnType<typeof buildMajorFortuneEvidence>,
): boolean {
  return packet.strongYearsWithinCycle.every(
    (year) =>
      year.pushStrategy.trim().length > 0 &&
      year.reduceStrategy.trim().length > 0,
  );
}

function writeMatrixReadinessSummary(): void {
  const packets = MAJOR_FORTUNE_FIXTURES.map((fixture) =>
    buildMajorFortuneEvidence({
      fixtureId: fixture.id,
      currentYear: fixture.currentYear,
      person: fixture.person,
    }),
  );
  const quality = summarizeMajorFortuneEvidenceMatrixQuality(packets);

  writeLine(`writer: ${isWriterEnabled() ? "enabled" : "disabled"}`);
  for (const [index, packet] of packets.entries()) {
    const fixture = MAJOR_FORTUNE_FIXTURES[index];

    writeLine(`fixture: ${fixture.id}`);
    writeLine("evidence: PASS");
    writeLine(`timeline: ${packet.majorFortuneTimelineRows.length}`);
    writeLine(`myeongli layers: ${hasMyeongliLayers(packet) ? "PASS" : "FAIL"}`);
    writeLine(
      `relationship hints: ${
        packet.relationshipStatusTranslationHints.length > 0 ? "PASS" : "FAIL"
      }`,
    );
    writeLine(
      `strong year push/reduce: ${
        hasStrongYearPushReduce(packet) ? "PASS" : "FAIL"
      }`,
    );
  }
  writeLine(`matrix similarity warnings: ${quality.matrixSimilarityWarnings}`);
  writeLine(`fixture leakage warnings: ${quality.fixtureLeakageWarnings}`);
  writeLine(`relationship hint warnings: ${quality.relationshipHintWarnings}`);
  writeLine(`likely area diversity warnings: ${quality.likelyAreaDiversityWarnings}`);
  writeLine(
    `technical term leakage warnings: ${quality.technicalTermLeakageWarnings}`,
  );
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);

  if (shouldRunAll(argv)) {
    writeMatrixReadinessSummary();
    return;
  }

  const writePreview = shouldWritePreview(argv);
  const fixture = requireMajorFortuneFixture(getFixtureId(argv));
  const packet = buildMajorFortuneEvidence({
    fixtureId: fixture.id,
    currentYear: fixture.currentYear,
    person: fixture.person,
  });

  writeLine(`major fortune draft fixture: ${fixture.id}`);
  writeLine(`current year: ${packet.currentYear}`);
  writeLine(`current age: ${packet.currentAge}`);
  writeLine(
    `current cycle: ${packet.currentCycle.startYear}-${packet.currentCycle.endYear} age ${packet.currentCycle.startAge}-${packet.currentCycle.endAge}`,
  );
  writeLine(`ganji: ${packet.currentCycle.ganji}`);
  writeLine(`ten god: ${packet.majorTenGod.stemTenGod}`);
  writeLine(`cycle basis: ${packet.majorCycleBasis.displayLabel}`);
  writeLine(`cycle position: ${packet.cyclePosition.positionLabel}`);
  writeLine(
    `elements: ${packet.currentCycle.stemElement}/${packet.currentCycle.branchElement}`,
  );
  writeLine(`calculation basis: ${packet.calculationBasis.displayLabel}`);
  writeLine(`cycle year timeline: ${packet.cycleYearTimeline.length}`);
  writeLine(`major fortune timeline rows: ${packet.majorFortuneTimelineRows.length}`);
  writeLine(`myeongli layers: ten-god/element/branch/hidden-stem/auxiliary-stars`);
  writeList("life area signals", packet.lifeAreaSignals.map((signal) => signal.plain));
  writeList("difficulty signals", packet.difficultySignals.map((signal) => signal.plain));
  writeList("opportunity signals", packet.opportunitySignals.map((signal) => signal.plain));
  writeList(
    "strong years within cycle",
    packet.strongYearsWithinCycle.map(
      (year) =>
        `${year.year} ${year.ganji}: ${year.whyStrong} / push ${year.pushStrategy} / reduce ${year.reduceStrategy}`,
    ),
  );
  writeList(
    "compact daeun seun timeline",
    packet.majorFortuneTimelineRows.map(
      (row) =>
        `${row.year} major ${row.majorGanji} annual ${row.annualGanji} ${row.badges.join(",")}: ${row.oneLine}`,
    ),
  );

  let draft: MajorFortuneReportDraft;

  if (!isWriterEnabled()) {
    writeLine("SKIP draft generation, OpenAI writer disabled -> using local preview draft");
    writeLine("writer disabled fallback draft: enabled");
    draft = buildWriterDisabledMajorFortuneDraft(packet);
  } else if (!hasWriterConfig()) {
    writeLine("SKIP draft generation, OpenAI writer env incomplete -> using local preview draft");
    writeLine("writer config fallback draft: enabled");
    draft = buildWriterDisabledMajorFortuneDraft(packet);
  } else {
    const [
      writerModule,
      promptModule,
      typesModule,
    ] = await Promise.all([
      import("../src/lib/report-generation/openaiMajorFortuneReportWriter"),
      import("../src/lib/report-generation/openaiMajorFortuneReportWriterPrompt"),
      import("../src/lib/report-generation/majorFortuneReportDraftTypes"),
    ]);
    const messages = promptModule.buildOpenAIMajorFortuneReportWriterMessages({
      evidencePacket: packet,
    });

    if (getEnvValue("OPENAI_REPORT_WRITER_DEBUG_SAFE") === "1") {
      writeLine("OpenAI request debug:");
      writeLine(`model: ${getEnvValue("OPENAI_REPORT_MODEL")}`);
      writeLine(`response format: ${writerModule.majorFortuneResponseFormatName}`);
      writeLine(
        `schema keys: ${typesModule.getMajorFortuneReportDraftSchemaTopLevelKeys().join(", ")}`,
      );
      writeLine(
        `schema approx chars: ${JSON.stringify(typesModule.majorFortuneReportDraftJsonSchema).length}`,
      );
      writeLine(`system chars: ${messages.system.length}`);
      writeLine(`developer chars: ${messages.developer.length}`);
      writeLine(`user chars: ${messages.user.length}`);
    }

    const result = await writerModule.generateMajorFortuneReportDraft({
      evidencePacket: packet,
      config: {
        enabled: true,
        apiKey: getEnvValue(openAIKeyEnvName) ?? "",
        model: getEnvValue("OPENAI_REPORT_MODEL") ?? "",
      },
    });
    draft = result.draft;
  }

  const validation = validateMajorFortuneReportDraft(draft);

  if (!validation.ok || validation.value === undefined) {
    throw new Error(validation.errors.join("\n"));
  }

  const quality = summarizeMajorFortuneDraftQuality(validation.value);

  writeLine(`draft version: ${validation.value.version}`);
  writeLine(`decade cards: ${validation.value.decadeCards.length}`);
  writeLine(`chapters: ${validation.value.cycleChapters.length}`);
  writeLine(`phase timeline: ${validation.value.phaseTimeline.length}`);
  writeLine(`cycle year timeline: ${quality.cycleYearTimelineCount}`);
  writeLine(`strong years: ${validation.value.strongYears.length}`);
  writeLine(`final advice: ${validation.value.finalAdvice.length}`);
  writeLine(`safety notes: ${validation.value.safetyNotes.length}`);
  writeLine(
    `safety note warnings: ${
      validation.warnings.filter((warning) =>
        warning.startsWith("MAJOR_FORTUNE_SAFETY_NOTE_WARNING"),
      ).length
    }`,
  );
  writeLine(
    `safety notes repaired: ${
      validation.warnings.includes("MAJOR_FORTUNE_SAFETY_NOTES_REPAIRED")
        ? "true"
        : "false"
    }`,
  );
  writeLine(`missing cycle year warnings: ${quality.missingCycleYearWarnings}`);
  writeLine(`cycle index leak warnings: ${quality.cycleIndexLeakWarnings}`);
  writeLine(
    `technical term warnings: ${quality.technicalTermWithoutExplanationWarnings}`,
  );
  writeLine(
    `small event overfocus warnings: ${quality.smallEventOverfocusWarnings}`,
  );
  writeLine(`wrong cycle basis warnings: ${quality.wrongCycleBasisWarnings}`);
  writeLine(
    `empty myeongli basis warnings: ${quality.emptyMyeongliBasisWarnings}`,
  );
  writeLine(`duplicate big theme warnings: ${quality.duplicateBigThemeWarnings}`);
  writeLine(
    `duplicate big theme domain warnings: ${quality.duplicateBigThemeDomainWarnings}`,
  );
  writeLine(
    `duplicate strong year push warnings: ${quality.duplicateStrongYearPushWarnings}`,
  );
  writeLine(
    `duplicate strong year reduce warnings: ${quality.duplicateStrongYearReduceWarnings}`,
  );
  writeLine(`duplicate top push warnings: ${quality.duplicateTopPushWarnings}`);
  writeLine(`duplicate top reduce warnings: ${quality.duplicateTopReduceWarnings}`);
  writeLine(`short strategy body warnings: ${quality.shortStrategyBodyWarnings}`);
  writeLine(
    `unknown status exposure warnings: ${quality.unknownStatusExposureWarnings}`,
  );
  writeLine(`weak specificity warnings: ${quality.weakSpecificityWarnings}`);
  writeLine(
    `unknown relationship pill warnings: ${quality.unknownRelationshipPillWarnings}`,
  );
  writeLine(
    `slash-separated whyStrong warnings: ${quality.slashSeparatedWhyStrongWarnings}`,
  );
  writeLine(
    `duplicate strong year headline warnings: ${quality.duplicateStrongYearHeadlineWarnings}`,
  );
  writeLine(`weak auxiliary star warnings: ${quality.weakAuxiliaryStarWarnings}`);
  writeLine(`timeline spacing warnings: ${quality.timelineSpacingWarnings}`);
  writeLine(
    `age basis repetition warnings: ${quality.ageBasisRepetitionWarnings}`,
  );
  writeLine(`generic timeline warnings: ${quality.genericTimelineWarnings}`);
  writeLine(`repeated summary warnings: ${quality.repeatedSummaryWarnings}`);
  writeLine(`weak strategy warnings: ${quality.weakStrategyWarnings}`);
  writeLine(
    `relationship status misuse warnings: ${quality.relationshipStatusMisuseWarnings}`,
  );
  writeLine(
    `strong year title repeat warnings: ${quality.strongYearTitleRepeatWarnings}`,
  );
  writeLine(`repeated strategy warnings: ${quality.repeatedStrategyWarnings}`);
  writeLine(`repeated theme warnings: ${quality.repeatedThemeWarnings}`);
  writeLine(`annual-tone warnings: ${quality.annualToneWarnings}`);
  writeLine(`decade-tone warnings: ${quality.decadeToneWarnings}`);
  writeLine(`strong year reason warnings: ${quality.strongYearReasonWarnings}`);
  writeLine(`hard claim warnings: ${quality.hardClaimWarnings}`);
  writeLine(`internal artifact warnings: ${quality.internalArtifactWarnings}`);
  writeLine(`repeated terminology warnings: ${quality.repeatedTerminologyWarnings}`);

  if (writePreview) {
    await writeMajorFortunePreviewSnapshot({
      fixtureId: fixture.id,
      evidencePacket: packet,
      draft: validation.value,
    });
    const snapshotPath = getMajorFortunePreviewSnapshotRelativePath(fixture.id);
    const previewUrl = getMajorFortunePreviewUrl(fixture.id);

    writeLine("preview snapshot written:");
    writeLine(snapshotPath);
    writeLine(`snapshot: ${snapshotPath}`);
    writeLine("Open in browser:");
    writeLine(previewUrl);
    writeLine(`url: ${previewUrl}`);
  }
  writeLine("done");
}

main().catch((error: unknown) => {
  process.stderr.write("FAIL\n");
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
