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

function buildYearMbtiLine(input: {
  readonly year: number;
  readonly tenGod: string;
  readonly mbtiType: string | null;
}): string {
  const type = input.mbtiType ?? "MBTI";

  if (input.tenGod.includes("식신")) {
    return `${type} 성향은 작은 결과물을 빨리 만들어 반응을 확인하는 방식으로 켜집니다. 완성도를 오래 붙잡기보다 먼저 보여 줄 범위를 작게 자르면 속도가 성과로 남습니다.`;
  }
  if (input.tenGod.includes("상관")) {
    return `${type} 성향은 기존 기준에 질문을 던지고 개선안을 바로 제시하는 쪽으로 강해집니다. 말이 앞서기 쉬운 해라 제안, 근거, 일정표를 한 묶음으로 내야 힘이 생깁니다.`;
  }
  if (input.tenGod.includes("편재")) {
    return `${type} 성향은 외부 기회와 계약 앞에서 빠르게 판을 키우려는 방식으로 작동합니다. 확장 감각이 장점이지만 정산일, 책임 범위, 철수 기준을 먼저 잠가야 합니다.`;
  }
  if (input.tenGod.includes("정재")) {
    return `${type} 성향은 돈과 시간을 숫자로 정리하고 관리표를 만들려는 쪽으로 드러납니다. 안정화에는 강하지만 검토만 길어지면 움직임이 늦어질 수 있습니다.`;
  }
  if (input.tenGod.includes("편관")) {
    return `${type} 성향은 압박이 들어올수록 바로 결론을 내고 책임 구조를 세우려는 쪽으로 켜집니다. 위기 대응은 빠르지만 권한 없는 책임까지 떠안지 않아야 합니다.`;
  }
  if (input.tenGod.includes("정관")) {
    return `${type} 성향은 평가, 직장 질서, 역할 기준을 공식화하려는 방식으로 드러납니다. 기준을 세우는 힘은 좋지만 지나치게 딱딱해지면 주변과 속도가 벌어집니다.`;
  }
  if (input.tenGod.includes("편인")) {
    return `${type} 성향은 새 정보를 파고들고 다른 가능성을 검토하는 방식으로 작동합니다. 생각이 깊어지는 만큼 기록, 자료 정리, 회복 시간을 실제 일정에 넣어야 합니다.`;
  }
  if (input.tenGod.includes("정인")) {
    return `${type} 성향은 문서, 자격, 학습 루틴을 체계화하려는 쪽으로 드러납니다. 안정적인 정리는 강점이지만 결정을 지나치게 미루면 대운의 속도를 놓칠 수 있습니다.`;
  }
  if (input.tenGod.includes("비견")) {
    return `${type} 성향은 내 방향을 직접 정하고 독립적으로 밀고 가려는 쪽으로 강해집니다. 자기 기준은 선명해지지만 협업에서는 역할 경계를 먼저 말해야 합니다.`;
  }
  if (input.tenGod.includes("겁재")) {
    return `${type} 성향은 경쟁, 동료 관계, 공동 비용 앞에서 주도권을 잡으려는 방식으로 켜집니다. 사람과 돈이 섞이는 장면은 정서보다 기준을 먼저 분리해야 합니다.`;
  }

  return `${type} 성향은 판단 속도와 실행 기준을 앞세우는 방식으로 작동합니다.`;
}

function formatFocusAreasForSentence(values: readonly string[]): string {
  return values.length > 0 ? values.join("·") : "직업·돈·관계·공부";
}

function buildYearCoreFlow(input: {
  readonly packet: MajorFortuneEvidencePacket;
  readonly row: MajorFortuneEvidencePacket["majorFortuneTimelineRows"][number];
  readonly yearReading:
    | MajorFortuneEvidencePacket["cycleYearTimeline"][number]
    | undefined;
}): string {
  const interaction = explainMajorFortuneSignal(input.row.keyInteractionLabel);
  const interactionSentence = interaction ? ` ${interaction}` : "";
  const headline = input.yearReading?.headline ?? input.row.oneLine;

  return `${input.row.year}년 ${input.row.annualGanji} 세운은 ${input.row.annualTenGodLabel} 흐름입니다. ${input.packet.currentMajorFortune.ganji} 대운의 ${input.packet.currentMajorFortune.stemTenGod} 배경 위에서 "${headline}" 흐름을 실제 선택으로 당기는 해입니다.${interactionSentence}`;
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
  const focus = formatFocusAreasForSentence(context.focusAreas);
  const concern =
    context.currentConcern ||
    `${field}에서 ${focus} 흐름을 어디에 쓸지 정하는 것`;
  const tenGod = input.row.annualTenGodLabel;

  if (tenGod.includes("편재")) {
    return `편재가 강하게 잡히는 해라 돈, 계약, 외부 프로젝트, 부업성 수익처럼 현실 자원이 밖으로 움직입니다. ${field} 맥락에서는 서비스 수익화, 외부 제안, 프로젝트 단위 협업을 실제로 검토하기 쉬워지고, ${focus} 중에서도 돈과 일의 연결이 먼저 체감될 수 있습니다.\n\n이 해의 재미는 기회가 보인다는 데 있지만, 핵심은 기회를 잡는 속도가 아니라 조건을 잠그는 순서입니다. ${concern}이 중요해지는 만큼 계약서, 정산일, 책임 범위, 철수 기준을 먼저 정해야 합니다. ${input.mbtiLine}`;
  }
  if (tenGod.includes("정재")) {
    return `정재 흐름은 돈, 시간, 고정비, 정산 기준을 숫자로 고정하려는 해입니다. ${field}에서는 새 기회를 크게 벌리기보다 이미 움직이는 일의 비용 구조, 반복 지출, 수익화 조건을 표로 정리할 때 힘이 납니다.\n\n${focus}를 모두 건드리더라도 중심은 안정화입니다. 관계에서도 좋은 말보다 약속한 시간, 맡을 역할, 돈의 경계를 분명히 할수록 덜 지칩니다. ${input.mbtiLine}`;
  }
  if (tenGod.includes("식신")) {
    return `식신 흐름은 생각을 밖으로 꺼내 결과물로 보여 주는 해입니다. ${field}에서는 기획안, 기능 개선안, 운영 문서, 포트폴리오처럼 남는 산출물이 힘을 얻고, ${focus} 중에서도 직업과 공부가 실제 결과물로 연결되기 쉽습니다.\n\n많이 만드는 해가 아니라 먼저 검증할 결과물을 고르는 해로 써야 합니다. 작은 결과물 하나를 정하고 반응을 확인하면 이후 돈과 관계의 책임도 덜 무거워집니다. ${input.mbtiLine}`;
  }
  if (tenGod.includes("상관")) {
    return `상관 흐름은 말, 제안, 개선안, 불편한 기준을 건드리는 해입니다. ${field}에서는 기존 방식의 허점을 보고 더 나은 구조를 제안하기 쉬우며, ${focus} 중 직업과 관계에서는 말의 속도와 표현 방식이 체감으로 드러납니다.\n\n이 해는 똑똑하게 말하는 것보다 증거와 순서를 같이 내는 것이 중요합니다. 제안이 많아질수록 일정, 책임자, 다음 확인일을 붙여야 말이 성과로 남습니다. ${input.mbtiLine}`;
  }
  if (tenGod.includes("편관")) {
    return `편관 흐름은 압박, 책임, 평가, 갑작스러운 역할 검증이 강해지는 해입니다. ${field}에서는 일이 빨리 커지거나 기준이 엄격해져 누가 결정하고 누가 책임지는지를 바로 정해야 하는 장면이 생길 수 있습니다.\n\n좋게 쓰면 위기 대응력과 추진력이 살아나지만, 나쁘게 쓰면 권한 없이 책임만 떠안습니다. ${concern}을 현실화하려면 맡을 일, 거절할 일, 보고 라인을 먼저 분리해야 합니다. ${input.mbtiLine}`;
  }
  if (tenGod.includes("정관")) {
    return `정관 흐름은 공식적인 역할, 평가 기준, 직장 질서가 선명해지는 해입니다. ${field}에서는 성과를 말로 증명하기보다 기준, 문서, 프로세스로 보여 주는 장면이 중요해지고, ${focus} 중 직업과 관계는 약속의 안정감으로 체감됩니다.\n\n이 해에는 무리하게 판을 키우기보다 신뢰를 잃지 않는 운영 방식이 더 중요합니다. 기준을 세우되 상대의 속도를 너무 몰아붙이지 않아야 장기 책임으로 이어집니다. ${input.mbtiLine}`;
  }
  if (tenGod.includes("편인")) {
    return `편인 흐름은 새 정보, 방향 재검토, 회복, 공부가 안쪽으로 깊어지는 해입니다. ${field}에서는 당장 확장하기보다 자료를 모으고, 배운 것을 다시 분류하고, 다음 선택의 근거를 만드는 시간이 중요해집니다.\n\n겉으로는 느려 보여도 이 해의 성과는 판단 기준이 정교해지는 데 있습니다. ${focus}를 모두 밀어붙이기보다 공부와 회복 루틴을 먼저 잡아야 다음 해에 덜 흔들립니다. ${input.mbtiLine}`;
  }
  if (tenGod.includes("정인")) {
    return `정인 흐름은 문서, 자격, 안정적인 학습, 회복 루틴을 정리하는 해입니다. ${field}에서는 이미 쌓인 경험을 체계화하고, 자료와 기록을 다음 단계의 자산으로 바꾸기 쉽습니다.\n\n이 해는 새 판을 여는 맛보다 기반을 다지는 맛이 큽니다. 돈과 관계도 크게 흔들기보다 생활 리듬, 공부 시간, 고정 지출을 안정화할수록 대운의 부담이 줄어듭니다. ${input.mbtiLine}`;
  }
  if (tenGod.includes("비견")) {
    return `비견 흐름은 내 기준, 독립성, 경쟁심이 선명해지는 해입니다. ${field}에서는 남의 방식에 맞추기보다 내가 끌고 갈 방향을 직접 정하고 싶어질 수 있으며, ${focus} 중 직업과 공부에서는 자기 주도성이 강해집니다.\n\n다만 독립성이 강해질수록 협업에서는 말하지 않은 기준이 갈등이 됩니다. 같이 할 일과 혼자 할 일을 먼저 나누고, 비용과 역할이 섞이는 장면은 초반에 정리해야 합니다. ${input.mbtiLine}`;
  }
  if (tenGod.includes("겁재")) {
    return `겁재 흐름은 동료, 경쟁자, 공동 비용, 관계 속 경계를 건드리는 해입니다. ${field}에서는 같이 움직이는 사람과 속도가 맞으면 힘이 커지지만, 기준이 흐리면 돈과 책임이 섞여 피로가 커질 수 있습니다.\n\n이 해의 핵심은 사람을 멀리하는 것이 아니라 함께할 조건을 분명히 하는 것입니다. ${concern}을 현실화하려면 공동 프로젝트, 비용 분담, 역할 범위를 말로만 두지 말고 기록으로 남겨야 합니다. ${input.mbtiLine}`;
  }

  return `${input.yearReading?.strategicFocus ?? input.row.strategy} 기준이 실제 선택의 중심이 됩니다. ${field}에서 ${focus}를 어디에 쓸지 정리할 때 이 해의 흐름이 구체적으로 드러납니다.\n\n${input.mbtiLine}`;
}

function buildYearCaution(row: MajorFortuneEvidencePacket["majorFortuneTimelineRows"][number]): string {
  const tenGod = row.annualTenGodLabel;

  if (tenGod.includes("식신")) {
    return `${row.year}년에는 결과물을 빨리 내는 힘이 커지는 만큼, 검증되지 않은 산출물을 너무 많이 벌리는 것이 부담이 됩니다. 먼저 보여 줄 결과물 하나와 피드백 받을 날짜를 정하세요.`;
  }
  if (tenGod.includes("상관")) {
    return `${row.year}년에는 말과 제안이 빨라지며 기준을 건드릴 수 있습니다. 불만을 바로 던지기보다 근거, 대안, 일정표를 함께 제시해야 충돌이 줄어듭니다.`;
  }
  if (tenGod.includes("편재")) {
    return `${row.year}년에는 외부 기회가 커 보일수록 돈, 계약, 책임 범위가 먼저 흔들릴 수 있습니다. 구두 약속과 감으로 하는 확장은 줄이세요.`;
  }
  if (tenGod.includes("정재")) {
    return `${row.year}년에는 안정화가 강점이지만 지나친 보수성으로 기회를 놓칠 수 있습니다. 숫자는 고정하되, 실험 비용은 작게 남겨 두는 편이 좋습니다.`;
  }
  if (tenGod.includes("편관")) {
    return `${row.year}년에는 압박을 빨리 해결하려다 권한 없는 책임까지 떠안을 수 있습니다. 급한 일일수록 승인선과 거절 기준을 먼저 확인하세요.`;
  }
  if (tenGod.includes("정관")) {
    return `${row.year}년에는 기준과 평가가 선명해지는 대신 유연성이 줄 수 있습니다. 규칙을 세우되 사람의 속도까지 통제하려 하면 피로가 쌓입니다.`;
  }
  if (tenGod.includes("편인")) {
    return `${row.year}년에는 생각이 깊어지는 만큼 실행이 늦어질 수 있습니다. 공부와 회복을 핑계로 결정을 끝없이 미루지 않도록 기준 날짜를 두세요.`;
  }
  if (tenGod.includes("정인")) {
    return `${row.year}년에는 안정적인 정리가 필요하지만, 준비만 하다 흐름을 놓칠 수 있습니다. 문서화와 실행을 한 주기 안에 같이 배치하세요.`;
  }
  if (tenGod.includes("비견")) {
    return `${row.year}년에는 내 기준이 강해지는 만큼 협업에서 고집으로 보일 수 있습니다. 독립성과 역할 분담을 초반에 분리하세요.`;
  }
  if (tenGod.includes("겁재")) {
    return `${row.year}년에는 사람과 비용이 섞이며 피로가 커질 수 있습니다. 공동 비용, 책임 범위, 중단 기준을 먼저 말해야 합니다.`;
  }

  return `${row.year}년에는 ${row.strategy}`;
}

function buildYearActionStandard(row: MajorFortuneEvidencePacket["majorFortuneTimelineRows"][number]): string {
  const tenGod = row.annualTenGodLabel;

  if (/식신|상관/.test(tenGod)) {
    return "작은 결과물 1개, 검증 날짜, 다음 수정 범위를 먼저 정하고 움직입니다.";
  }
  if (/편재|정재/.test(tenGod)) {
    return "계약서, 정산일, 책임 범위, 철수 기준을 숫자로 고정한 뒤 확장합니다.";
  }
  if (/편관|정관/.test(tenGod)) {
    return "승인선, 담당 범위, 평가 기준, 거절할 일을 먼저 문서화합니다.";
  }
  if (/편인|정인/.test(tenGod)) {
    return "학습 목표, 기록 방식, 회복 루틴, 실행 날짜를 한 세트로 묶습니다.";
  }
  if (/비견|겁재/.test(tenGod)) {
    return "혼자 할 일, 함께할 일, 비용을 나눌 일을 초반에 분리합니다.";
  }

  return "그해 먼저 고정할 역할, 돈 기준, 회복 루틴을 하나씩 정합니다.";
}

function buildTimelineYearDetails(
  packet: MajorFortuneEvidencePacket,
): MajorFortuneReportDraft["majorFortuneTimelineRows"] {
  return packet.majorFortuneTimelineRows.map((row) => {
    const yearReading =
      packet.cycleYearTimeline.find((item) => item.year === row.year) ??
      packet.cycleYearTimeline[0];
    const mbtiLine = buildYearMbtiLine({
      year: row.year,
      tenGod: row.annualTenGodLabel,
      mbtiType: packet.mbtiBasis.type,
    });
    const realWorldScenes = buildContextualYearScene({
      packet,
      row,
      yearReading,
      mbtiLine,
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
        realWorldScenes,
        cautionPoint: buildYearCaution(row),
        actionStandard: buildYearActionStandard(row),
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
      relationshipStatusLabel:
        relationshipStatus === "unknown"
          ? null
          : USER_RELATIONSHIP_STATUS_LABELS[relationshipStatus],
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
