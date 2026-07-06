import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import {
  requireMajorFortuneFixture,
} from "../../../lib/report-knowledge/majorFortuneFixtures";
import {
  buildMajorFortuneEvidence,
} from "../../../lib/report-knowledge/majorFortuneEvidence";
import type {
  MajorFortuneDomainFlowKey,
  MajorFortuneEvidencePacket,
} from "../../../lib/report-knowledge/majorFortuneTypes";
import type {
  MajorFortuneDomainLabel,
  MajorFortuneDraftFlowSection,
  MajorFortuneReportDraft,
} from "../../../lib/report-generation/majorFortuneReportDraftTypes";
import {
  readMajorFortunePreviewSnapshot,
} from "../../../lib/report-generation/majorFortunePreviewSnapshot";
import {
  USER_LIFE_STATUS_LABELS,
  USER_RELATIONSHIP_STATUS_LABELS,
} from "../../../lib/report-knowledge/userContextTypes";
import { MajorFortuneReportView } from "../../reports/[reportId]/MajorFortuneReportView";

export const dynamic = "force-dynamic";

type MajorFortunePreviewPageProps = {
  readonly searchParams: Promise<{
    readonly fixture?: string | readonly string[];
    readonly snapshot?: string | readonly string[];
  }>;
};

function isPreviewEnabled(): boolean {
  return (
    process.env.NODE_ENV !== "production" ||
    process.env.MAJOR_FORTUNE_DEV_PREVIEW_ENABLED === "1"
  );
}

function getFixtureId(
  searchParams: Awaited<MajorFortunePreviewPageProps["searchParams"]>,
): string {
  const fixture = searchParams.fixture;

  if (Array.isArray(fixture)) {
    return fixture[0] ?? "deokmin-current-major-fortune";
  }
  if (typeof fixture === "string") {
    return fixture;
  }

  return "deokmin-current-major-fortune";
}

function getSnapshotMode(
  searchParams: Awaited<MajorFortunePreviewPageProps["searchParams"]>,
): string | undefined {
  const snapshot = searchParams.snapshot;

  if (Array.isArray(snapshot)) {
    return snapshot[0];
  }
  if (typeof snapshot === "string") {
    return snapshot;
  }

  return undefined;
}

function PreviewShell({
  children,
  devStatus,
}: {
  readonly children: ReactNode;
  readonly devStatus?: string;
}) {
  return (
    <main className="min-h-screen bg-[#f6f0e7] px-4 py-8 text-[#2b211b] sm:px-6 lg:px-8">
      <section className="mx-auto flex min-w-0 max-w-6xl flex-col gap-6">
        {devStatus === undefined ? null : (
          <aside
            className="min-w-0 break-words rounded-[8px] border border-[#ded2c2] bg-[#fffaf1] px-3 py-2 text-xs text-[#76685c]"
            aria-label="dev-only metadata"
          >
            <span className="font-semibold text-[#6f1d35]">개발 상태</span>
            <span className="mt-1 block break-words sm:ml-2 sm:mt-0 sm:inline">{devStatus}</span>
          </aside>
        )}
        <p className="text-sm font-medium text-[#76685c]">
          결 리포트 개발 미리보기
        </p>
        {children}
      </section>
    </main>
  );
}

function renderMessage(title: string, message: string) {
  return (
    <PreviewShell>
      <section className="space-y-4 rounded-[8px] border border-[#ded2c2] bg-[#fffaf1] p-6">
        <p className="text-sm font-semibold text-[#8b6d2d]">
          대운 리포트
        </p>
        <h1 className="text-2xl font-bold text-[#2b211b]">{title}</h1>
        <p className="whitespace-pre-line text-sm leading-6 text-[#5a4d42]">
          {message}
        </p>
      </section>
    </PreviewShell>
  );
}

const previewDomainFlowKeyByLabel = {
  "일·성과": "careerWork",
  "돈·현실": "moneyResource",
  인간관계: "socialFamily",
  "연애·가족": "relationshipLove",
  "학업·자격증": "studyGrowth",
  "몸·생활 리듬": "healthRoutine",
} as const satisfies Record<MajorFortuneDomainLabel, MajorFortuneDomainFlowKey>;

const previewDomainLabels = [
  "일·성과",
  "돈·현실",
  "인간관계",
  "연애·가족",
  "학업·자격증",
  "몸·생활 리듬",
] as const satisfies readonly MajorFortuneDomainLabel[];

function previewFirstSentence(value: string): string {
  return value.split(/[.!?。]\s*|[.。]\s*/u)[0]?.trim() || value.trim();
}

function ensurePreviewItems(
  items: readonly string[],
  fallbackItems: readonly string[],
  minimum: number,
): readonly string[] {
  const result = items.filter((item) => item.trim().length > 0);

  for (const fallbackItem of fallbackItems) {
    if (result.length >= minimum) break;
    if (!result.includes(fallbackItem)) {
      result.push(fallbackItem);
    }
  }

  return result;
}

function getPreviewFlow(
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

function buildPreviewDecadeCards(packet: MajorFortuneEvidencePacket) {
  return previewDomainLabels.map((label, index) => {
    const flow = packet.domainFlows[previewDomainFlowKeyByLabel[label]];

    return {
      label,
      index: 72 - index * 3,
      headline: flow.title,
      body: `${flow.summary} ${flow.actionHint}`,
    };
  });
}

function buildPreviewKeySignals(packet: MajorFortuneEvidencePacket) {
  const opportunity = packet.opportunitySignals[0];
  const difficulty = packet.difficultySignals[0];
  const transition = packet.transitionSignals[0];

  return [
    {
      type: "opportunity" as const,
      title: "살릴 흐름",
      body:
        opportunity?.plain ??
        packet.currentMajorFortune.supportSignals[0] ??
        packet.currentMajorFortune.keyTheme,
      evidenceLabel: opportunity?.type ?? "support",
    },
    {
      type: "difficulty" as const,
      title: "관리할 흐름",
      body:
        difficulty?.plain ??
        packet.currentMajorFortune.frictionSignals[0] ??
        packet.currentAnnualCross.caution,
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

function buildPreviewCycleChapters(packet: MajorFortuneEvidencePacket) {
  return previewDomainLabels.map((label) => {
    const flow = packet.domainFlows[previewDomainFlowKeyByLabel[label]];
    const supportSignal = flow.supportingSignals[0];
    const frictionSignal = flow.frictionSignals[0];

    return {
      title: flow.title,
      headline: previewFirstSentence(flow.summary),
      body: `${flow.summary} ${flow.actionHint}`,
      likelyScenes: [...flow.supportingSignals, ...flow.frictionSignals].slice(0, 4),
      practicalAdvice: ensurePreviewItems(
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

function buildPreviewPhaseTimeline(packet: MajorFortuneEvidencePacket) {
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

function buildPreviewMyeongliLayers(packet: MajorFortuneEvidencePacket) {
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

function buildPreviewCycleYearTimeline(packet: MajorFortuneEvidencePacket) {
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

function buildInMemoryMajorFortunePreviewDraft(
  packet: MajorFortuneEvidencePacket,
): MajorFortuneReportDraft {
  const current = packet.currentMajorFortune;
  const domainFlow = packet.domainFlows;
  const userContext = packet.personContext.userContext;
  const relationshipStatus = userContext.relationshipStatus ?? "unknown";

  return {
    version: "v1",
    productType: "major_fortune",
    productVersion: "v1",
    personLabel: packet.personLabel,
    headline: `${packet.personLabel}님의 ${current.ganji} 대운 리포트`,
    openingTitle: `${current.ganji} 대운의 10년 흐름`,
    openingSummary: `${packet.tenYearFlowSummary.summary} ${packet.currentAnnualCross.interpretation}`,
    coreLine: current.keyTheme,
    userContextSummary: {
      lifeStatusLabel: USER_LIFE_STATUS_LABELS[userContext.lifeStatus],
      fieldLabel: userContext.fieldLabel ?? null,
      relationshipStatusLabel:
        relationshipStatus === "unknown"
          ? null
          : USER_RELATIONSHIP_STATUS_LABELS[relationshipStatus],
      translationNote:
        "현재 상태는 예언의 전제가 아니라 대운 흐름을 생활 장면으로 번역하기 위한 맥락입니다.",
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
      flowIndex: packet.cyclePosition.yearIndexInCycle,
      flowTypeLabel: packet.cyclePosition.progressLabel,
      flowIndexCaution:
        "대운의 첫해와 중반, 후반은 체감 방식이 다르므로 올해 세운은 장기 흐름 위의 단기 자극으로 읽습니다.",
    },
    bigThemes: packet.strategicThemes.slice(0, 3).map((theme) => ({
      title: theme.label,
      metaphor: theme.metaphor,
      body: theme.plain,
      likelyScenes: theme.concreteImplications,
      strategy: theme.strategy,
    })),
    decadeCards: buildPreviewDecadeCards(packet),
    keySignals: buildPreviewKeySignals(packet),
    majorStructure: {
      ganjiExplanation: `${current.ganji} 대운은 ${current.stem}${current.branch}의 조합으로, ${current.keyTheme}`,
      tenGodExplanation: `${current.stemTenGod} 흐름은 ${packet.majorTenGod.plain}`,
      elementEffectExplanation: packet.elementEffect.plain,
      branchInteractionExplanation:
        packet.branchInteractions.map((interaction) => interaction.plain).join(" ") ||
        "원국과 대운의 지지 작용은 생활 리듬, 관계, 역할 경계에서 체감됩니다.",
      transitionExplanation: packet.previousToCurrentShift.plain,
    },
    cycleChapters: buildPreviewCycleChapters(packet),
    phaseTimeline: buildPreviewPhaseTimeline(packet),
    majorFortuneTimelineRows: packet.majorFortuneTimelineRows,
    cycleYearTimeline: buildPreviewCycleYearTimeline(packet),
    currentCycleSummary: current.interpretation,
    tenYearTheme: `${packet.tenYearFlowSummary.headline}: ${packet.tenYearFlowSummary.summary}`,
    timelineReading:
      "대운 타임라인은 특정 사건을 맞히기 위한 표가 아니라, 10년 안에서 반복되는 책임, 기회, 조정 지점을 보는 기준입니다.",
    annualCrossReading: `${packet.currentAnnualCross.interpretation} ${packet.currentAnnualCross.caution}`,
    careerWorkFlow: getPreviewFlow(packet, "careerWork"),
    moneyResourceFlow: getPreviewFlow(packet, "moneyResource"),
    relationshipFlow: getPreviewFlow(packet, "relationshipLove"),
    healthRoutineFlow: getPreviewFlow(packet, "healthRoutine"),
    mbtiExpression:
      packet.mbtiBasis.type === null
        ? "MBTI가 입력되지 않아도 대운의 큰 방향은 원국과 대운표 기준으로 먼저 읽습니다."
        : `${packet.mbtiBasis.type} 성향은 ${packet.mbtiBasis.decisionPattern} ${packet.mbtiBasis.workPattern}`,
    riskManagement: packet.riskPatterns.map(
      (risk) => `${risk.title}: ${risk.summary} ${risk.prevention}`,
    ),
    actionPlan: packet.actionGuides.map(
      (guide) => `${guide.title}: ${guide.action} ${guide.timingHint}`,
    ),
    finalAdvice: previewDomainLabels.map((label) => {
      const flow = domainFlow[previewDomainFlowKeyByLabel[label]];

      return {
        label,
        body: `${flow.summary} ${flow.actionHint}`,
      };
    }),
    strongYears: packet.strongYearsWithinCycle.slice(0, 5).map((year) => ({
      year: year.year,
      ganji: year.ganji,
      headline: year.headline,
      body: year.reason,
      advice: year.action,
      whyStrong: year.whyStrong,
      likelyArea: year.likelyArea,
      pushStrategy: year.pushStrategy,
      reduceStrategy: year.reduceStrategy,
    })),
    myeongliLayers: buildPreviewMyeongliLayers(packet),
    safetyNotes: packet.safetyNotes,
  };
}

export default async function MajorFortunePreviewPage({
  searchParams,
}: MajorFortunePreviewPageProps) {
  if (!isPreviewEnabled()) {
    notFound();
  }

  const resolvedSearchParams = await searchParams;
  const fixtureId = getFixtureId(resolvedSearchParams);
  const snapshotMode = getSnapshotMode(resolvedSearchParams);

  let fixture;

  try {
    fixture = requireMajorFortuneFixture(fixtureId);
  } catch {
    notFound();
  }

  if (snapshotMode !== "latest") {
    return renderMessage(
      "snapshot=latest 모드만 지원합니다.",
      [
        "대운 dev preview는 브라우저에서 OpenAI를 호출하지 않고 .tmp/major-fortune-preview snapshot을 읽습니다.",
        "고정 snapshot은 scripts/smoke_generate_major_fortune_report_draft.ts --write-preview로 갱신합니다.",
      ].join("\n"),
    );
  }

  const snapshot = await readMajorFortunePreviewSnapshot(fixtureId);

  if (snapshot === null) {
    const evidencePacket = buildMajorFortuneEvidence({
      fixtureId: fixture.id,
      currentYear: fixture.currentYear,
      person: fixture.person,
    });
    const draft = buildInMemoryMajorFortunePreviewDraft(evidencePacket);

    return (
      <PreviewShell devStatus={`in-memory fixture · ${fixtureId}`}>
        <MajorFortuneReportView draft={draft} evidencePacket={evidencePacket} />
      </PreviewShell>
    );
  }

  return (
    <PreviewShell
      devStatus={`preview snapshot · ${snapshot.fixtureId} · ${snapshot.generatedAt}`}
    >
      <MajorFortuneReportView
        draft={snapshot.draft}
        evidencePacket={snapshot.evidencePacket}
      />
    </PreviewShell>
  );
}
