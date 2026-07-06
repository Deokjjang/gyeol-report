import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import {
  requireAnnualFortuneFixture,
} from "../../../lib/report-knowledge/annualFortuneFixtures";
import {
  buildAnnualFortuneEvidence,
  type AnnualFortuneEvidencePacket,
} from "../../../lib/report-knowledge/annualFortuneEvidence";
import type {
  AnnualFortuneDraftFlowSection,
  AnnualFortuneReportDraft,
  AnnualFortuneReportMode,
} from "../../../lib/report-generation/annualFortuneReportDraftTypes";
import {
  readAnnualFortunePreviewSnapshot,
} from "../../../lib/report-generation/annualFortunePreviewSnapshot";
import {
  USER_LIFE_STATUS_LABELS,
} from "../../../lib/report-knowledge/userContextTypes";
import { AnnualFortuneReportView } from "../../reports/[reportId]/AnnualFortuneReportView";

export const dynamic = "force-dynamic";

type AnnualFortunePreviewPageProps = {
  readonly searchParams: Promise<{
    readonly fixture?: string | readonly string[];
    readonly snapshot?: string | readonly string[];
  }>;
};

function isPreviewEnabled(): boolean {
  return (
    process.env.NODE_ENV !== "production" ||
    process.env.ANNUAL_FORTUNE_DEV_PREVIEW_ENABLED === "1" ||
    process.env.COMPATIBILITY_DEV_PREVIEW_ENABLED === "1"
  );
}

function getFixtureId(
  searchParams: Awaited<AnnualFortunePreviewPageProps["searchParams"]>,
): string {
  const fixture = searchParams.fixture;

  if (Array.isArray(fixture)) {
    return fixture[0] ?? "deokmin-2026-current";
  }
  if (typeof fixture === "string") {
    return fixture;
  }

  return "deokmin-2026-current";
}

function getSnapshotMode(
  searchParams: Awaited<AnnualFortunePreviewPageProps["searchParams"]>,
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
          세운 리포트
        </p>
        <h1 className="text-2xl font-bold text-[#2b211b]">{title}</h1>
        <p className="whitespace-pre-line text-sm leading-6 text-[#5a4d42]">
          {message}
        </p>
      </section>
    </PreviewShell>
  );
}

function toPreviewDraftMode(
  mode: AnnualFortuneEvidencePacket["mode"],
): AnnualFortuneReportMode {
  return mode === "locked_future" ? "current_year" : mode;
}

function buildPreviewFlowSection(
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

function buildPreviewHighlights(
  packet: AnnualFortuneEvidencePacket,
): AnnualFortuneReportDraft["monthlyHighlights"] {
  return [
    { label: "1~3월", months: packet.monthlyFortunes.slice(0, 3) },
    { label: "4~6월", months: packet.monthlyFortunes.slice(3, 6) },
    { label: "7~9월", months: packet.monthlyFortunes.slice(6, 9) },
    { label: "10~12월", months: packet.monthlyFortunes.slice(9, 12) },
  ].map((group) => ({
    monthLabel: group.label,
    headline: `${group.label} 운영 흐름`,
    body: `${group.months.map((month) => month.monthTheme).join(" ")} 이 구간은 월별 길흉보다 일, 돈, 관계, 회복 리듬을 어디서 먼저 조정할지 보는 기준입니다.`,
    actionHint:
      group.months[0]?.actionHint ??
      "월별 운영 기준을 작게 나누어 확인하세요.",
  }));
}

function buildInMemoryAnnualFortunePreviewDraft(
  packet: AnnualFortuneEvidencePacket,
): AnnualFortuneReportDraft {
  const mode = toPreviewDraftMode(packet.mode);
  const lifeStatusLabel =
    USER_LIFE_STATUS_LABELS[packet.userContext.lifeStatus];
  const fieldLabel = packet.userContext.fieldLabel ?? null;
  const contextLabel =
    fieldLabel === null || fieldLabel.trim().length === 0
      ? lifeStatusLabel
      : `${lifeStatusLabel} · ${fieldLabel}`;
  const monthlyBasisLabel = "달력월 기준 운영 가이드";
  const flowCards = [
    ["일·성과", packet.domainFlows.careerWork],
    ["돈·현실", packet.domainFlows.moneyResource],
    ["인간관계", packet.domainFlows.socialFamily],
    ["연애·가족", packet.domainFlows.relationshipLove],
    ["학업·자격증", packet.domainFlows.studyGrowth],
    ["몸·생활 리듬", packet.domainFlows.healthRoutine],
  ] as const;
  const majorAnnualCrossReading =
    packet.majorAnnualCross === null
      ? "현재 대운 정보가 입력되지 않은 결과에서는 선택 연도 세운과 원국의 작용을 먼저 읽고, 10년 배경은 연결된 결과에서 보완합니다."
      : `${packet.majorAnnualCross.majorGanji} 대운은 10년 배경이고 ${packet.majorAnnualCross.annualGanji} 세운은 그 위에 올라오는 1년 자극입니다. ${packet.majorAnnualCross.interpretation} ${packet.majorAnnualCross.caution}`;

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
        "현재 상태와 분야 정보는 계산 원인이 아니라 선택 연도 흐름을 현실 장면으로 옮기는 보조 맥락으로만 사용했습니다.",
    },
    openingTitle: `${packet.personContext.name}님의 ${packet.selectedYear}년 세운 리포트`,
    headline: `${packet.annualFortune.ganji} 세운은 ${contextLabel}의 운영 기준을 더 구체적으로 묻는 해입니다.`,
    openingSummary:
      mode === "past_review"
        ? `${packet.selectedYear}년은 그해 왜 압박과 조율이 반복됐는지 회고하는 흐름입니다. ${packet.yearAccessPolicy.notice}`
        : mode === "new_year_preview"
          ? `${packet.selectedYear}년은 신년사주 성격으로 미리 열리는 흐름입니다. 준비, 활용, 조심할 기준을 월별 운영 리듬과 함께 봅니다.`
          : `${packet.selectedYear}년은 올해 준비와 활용, 조율 기준을 함께 보는 현재 세운입니다. 지금부터 남은 흐름을 어떻게 쓸지 확인합니다.`,
    coreLine: `${packet.annualFortune.yearTheme}: ${packet.annualFortune.interpretation}`,
    selectedYearSummary:
      `${packet.annualFortune.ganji} 세운은 ${packet.annualFortune.stemTenGod}·${packet.annualFortune.branchTenGod} 흐름으로 들어와 일, 돈, 관계, 회복 리듬을 올해 기준으로 다시 정리하게 만듭니다.`,
    yearAccessNotice:
      `${packet.yearAccessPolicy.notice} ${packet.yearAccessPolicy.policyLabel}`,
    majorAnnualCrossReading,
    natalAnnualReading:
      `${packet.natalAnnualRelations.interpretation} ${packet.natalAnnualRelations.caution}`,
    monthlyFlowReading:
      "12개월 월운은 한 달씩 끊어진 예언이 아니라 선택 연도 안에서 운영 리듬을 나누어 보는 기준입니다. 상반기와 하반기의 체감 차이를 함께 읽어야 합니다.",
    monthlyHighlights: buildPreviewHighlights(packet),
    careerWorkFlow: buildPreviewFlowSection(packet, "careerWork"),
    moneyResourceFlow: buildPreviewFlowSection(packet, "moneyResource"),
    relationshipFlow: buildPreviewFlowSection(packet, "relationshipLove"),
    healthRoutineFlow: buildPreviewFlowSection(packet, "healthRoutine"),
    mbtiExpression:
      packet.mbtiBasis.type === null
        ? "MBTI가 입력되지 않아도 세운의 큰 구조는 원국, 선택 연도 간지, 월운 기준으로 읽습니다."
        : `${packet.mbtiBasis.type} 성향은 ${packet.mbtiBasis.decisionPattern} ${packet.mbtiBasis.workPattern} 올해 흐름의 원인이 아니라 선택과 말투, 일 처리 속도로 드러나는 방식입니다.`,
    riskManagement: packet.riskPatterns.map(
      (risk) => `${risk.title}: ${risk.summary} ${risk.prevention}`,
    ),
    actionPlan: packet.actionGuides.map(
      (guide) => `${guide.title}: ${guide.action} ${guide.timingHint}`,
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
    flowCards: flowCards.map(([label, flow], index) => ({
      label,
      score: 74 - index * 3,
      headline: flow.title,
      body: `${flow.summary} ${flow.actionHint}`,
    })),
    keySignals: [
      {
        type: "opportunity",
        title: "살릴 흐름",
        body:
          packet.opportunitySignals[0]?.plain ??
          packet.annualFortune.interpretation,
        evidenceLabel:
          packet.opportunitySignals[0]?.type ?? packet.annualFortune.stemTenGod,
      },
      {
        type: "difficulty",
        title: "관리할 흐름",
        body:
          packet.difficultySignals[0]?.plain ??
          packet.annualFortune.caution,
        evidenceLabel:
          packet.difficultySignals[0]?.type ?? packet.annualFortune.branchTenGod,
      },
    ],
    annualStructure: {
      ganjiExplanation: `${packet.annualFortune.ganji}는 ${packet.annualGanji.stem}${packet.annualGanji.branch} 흐름이 선택 연도 배경으로 들어오는 구조입니다.`,
      tenGodExplanation: packet.annualTenGod.plain,
      elementEffectExplanation: packet.elementEffect.plain,
      branchInteractionExplanation:
        packet.branchInteractions.map((interaction) => interaction.plain).join(" ") ||
        packet.natalAnnualRelations.interpretation,
    },
    chapters: flowCards.map(([, flow]) => ({
      title: flow.title,
      headline: flow.summary.split(/[.!?。]\s*|[.。]\s*/u)[0]?.trim() || flow.title,
      body: `${flow.summary} ${flow.actionHint}`,
      likelyScenes: [...flow.supportingSignals, ...flow.frictionSignals].slice(0, 4),
      practicalAdvice: [
        flow.actionHint,
        "일, 돈, 관계의 기준이 섞이면 기록으로 나누어 부담을 줄이세요.",
      ],
    })),
    monthlyFlow: packet.monthlyFortunes.map((month) => ({
      month: month.month,
      label: month.label,
      headline: month.monthTheme,
      monthGanji: month.ganji,
      monthlyBasis: monthlyBasisLabel,
      elementFocus: month.stemTenGod,
      natalInteractionSummary: [...month.supportSignals, ...month.frictionSignals].join(" / ") || null,
      body: `${month.interpretation} ${month.caution}`,
      advice: month.actionHint,
    })),
    finalAdvice: flowCards.map(([, flow]) => flow.actionHint),
    safetyNotes: packet.safetyNotes,
  };
}

export default async function AnnualFortunePreviewPage({
  searchParams,
}: AnnualFortunePreviewPageProps) {
  if (!isPreviewEnabled()) {
    notFound();
  }

  const resolvedSearchParams = await searchParams;
  const fixtureId = getFixtureId(resolvedSearchParams);
  const snapshotMode = getSnapshotMode(resolvedSearchParams);

  let fixture;
  try {
    fixture = requireAnnualFortuneFixture(fixtureId);
  } catch {
    notFound();
  }

  if (snapshotMode !== undefined && snapshotMode !== "latest") {
    return renderMessage(
      "snapshot=latest 모드만 지원합니다.",
      "세운 dev preview는 브라우저에서 OpenAI를 호출하지 않고 .tmp/annual-fortune-preview snapshot만 읽습니다.",
    );
  }

  if (snapshotMode === "latest") {
    const snapshot = await readAnnualFortunePreviewSnapshot(fixtureId);

    if (snapshot !== null) {
      return (
        <PreviewShell
          devStatus={`preview snapshot · ${snapshot.fixtureId} · ${snapshot.generatedAt}`}
        >
          <AnnualFortuneReportView
            draft={snapshot.draft}
            evidencePacket={snapshot.evidencePacket}
          />
        </PreviewShell>
      );
    }
  }

  const evidencePacket = buildAnnualFortuneEvidence({
    targetYear: fixture.targetYear,
    currentDate: new Date(`${fixture.currentDate}T00:00:00+09:00`),
    person: fixture.person,
  });
  const draft = buildInMemoryAnnualFortunePreviewDraft(evidencePacket);

  return (
    <PreviewShell
      devStatus={`in-memory fixture · ${fixture.id} · snapshot not loaded`}
    >
      <AnnualFortuneReportView
        draft={draft}
        evidencePacket={evidencePacket}
      />
    </PreviewShell>
  );
}
