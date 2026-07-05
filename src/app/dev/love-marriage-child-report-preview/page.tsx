import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import type {
  LoveMarriageChildReportDraft,
} from "../../../lib/report-generation/loveMarriageChildReportDraftTypes";
import type {
  LoveMarriageChildReportEvidencePacket,
} from "../../../lib/report-knowledge/loveMarriageChildReportTypes";
import {
  buildLoveMarriageChildReportEvidence,
  type BuildLoveMarriageChildReportEvidenceInput,
} from "../../../lib/report-knowledge/loveMarriageChildReportEvidence";
import {
  LoveMarriageChildReportManseRyeokTable,
  LoveMarriageChildReportMbtiProfileTable,
} from "../../../components/report-tables";
import {
  LoveMarriageChildReportView,
} from "../../reports/[reportId]/LoveMarriageChildReportView";

export const dynamic = "force-dynamic";

type LoveMarriageChildPreviewPageProps = {
  readonly searchParams: Promise<{
    readonly fixture?: string | readonly string[];
    readonly snapshot?: string | readonly string[];
  }>;
};

type PreviewSnapshot = {
  readonly fixtureId: string;
  readonly generatedAt: string;
  readonly evidencePacket: LoveMarriageChildReportEvidencePacket;
  readonly draft: LoveMarriageChildReportDraft;
};

const defaultFixtureId = "deokmin-love";
const previewSnapshotRoot = ".tmp/love-marriage-child-report-preview";

const fixtures = [
  {
    id: defaultFixtureId,
    person: {
      name: "덕민",
      gender: "male",
      mbtiType: "ENTJ",
      relationshipStatus: "single",
      saju: {
        dayPillar: "甲申",
        labels: [
          "편재",
          "정재",
          "정관",
          "편관",
          "식신",
          "정인",
          "현침살",
          "홍염살",
          "도화살",
          "화개살",
          "천을귀인",
          "월덕귀인",
          "甲己합",
          "申亥해",
        ],
      },
    } satisfies BuildLoveMarriageChildReportEvidenceInput,
  },
] as const;

function isPreviewEnabled(): boolean {
  return (
    process.env.NODE_ENV !== "production" ||
    process.env.LOVE_MARRIAGE_CHILD_DEV_PREVIEW_ENABLED === "1"
  );
}

function getFixtureId(
  searchParams: Awaited<LoveMarriageChildPreviewPageProps["searchParams"]>,
): string {
  const fixture = searchParams.fixture;

  if (Array.isArray(fixture)) {
    return fixture[0] ?? defaultFixtureId;
  }
  if (typeof fixture === "string") {
    return fixture;
  }

  return defaultFixtureId;
}

function getSnapshotMode(
  searchParams: Awaited<LoveMarriageChildPreviewPageProps["searchParams"]>,
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

function requireFixture(fixtureId: string): (typeof fixtures)[number] {
  const fixture = fixtures.find((candidate) => candidate.id === fixtureId);

  if (fixture === undefined) {
    notFound();
  }

  return fixture;
}

function getPreviewSnapshotPath(fixtureId: string): string {
  return join(process.cwd(), previewSnapshotRoot, `${fixtureId}.json`);
}

async function readPreviewSnapshot(
  fixtureId: string,
): Promise<PreviewSnapshot | null> {
  try {
    return JSON.parse(
      await readFile(getPreviewSnapshotPath(fixtureId), "utf8"),
    ) as PreviewSnapshot;
  } catch {
    return null;
  }
}

function buildScreenQaDraft(
  evidencePacket: LoveMarriageChildReportEvidencePacket,
): LoveMarriageChildReportDraft {
  const personLabel = evidencePacket.personContext.name;

  return {
    version: "v1",
    productType: "love_marriage_child",
    productVersion: "v1",
    personLabel,
    headline: "기준과 책임이 선명할수록 안정되는 관계 구조",
    openingSummary:
      "당신은 감정만으로 관계를 끌고 가기보다 약속, 생활 기준, 말의 온도를 함께 맞출 때 안정됩니다. 관계가 깊어질수록 책임과 역할을 분명히 하려는 힘이 강하게 작동합니다.",
    loveStyle: {
      headline: "애매한 호감보다 기준이 분명한 관계에서 편해집니다",
      body:
        "당신은 끌림이 있어도 관계의 속도, 약속, 책임감이 흐릿하면 금방 피로해집니다. 좋아하는 마음을 행동과 기준으로 확인하려는 쪽에 가깝습니다.",
      keyPoints: ["명확한 약속", "책임 있는 태도", "말보다 행동"],
      caution: "기준을 너무 빨리 제시하면 상대가 평가받는 느낌을 받을 수 있습니다.",
    },
    attractionPattern: {
      headline: "능력과 태도가 보이는 사람에게 끌립니다",
      body:
        "말을 잘하는 사람보다 자기 일과 생활을 정리하는 사람이 더 크게 들어옵니다. 다만 초반에 상대의 가능성을 너무 빠르게 판단하면 관계의 여지가 줄어듭니다.",
      keyPoints: ["자기관리", "책임감", "현실 감각"],
      caution: "호감보다 검증이 앞서면 관계가 면접처럼 느껴질 수 있습니다.",
      repeatedPattern: ["상대의 태도와 책임감을 빠르게 봅니다.", "관계 초반에 미래 기준까지 함께 계산합니다."],
      betterUse: ["처음에는 기준을 묻되 결론은 늦춥니다.", "상대의 말보다 반복 행동을 봅니다."],
    },
    loveStrengths: {
      headline: "관계를 현실로 옮기는 힘이 있습니다",
      body:
        "감정 표현에만 머무르지 않고 일정, 약속, 돈, 생활 리듬으로 관계를 정리할 수 있습니다. 관계가 깊어질수록 책임감이 장점으로 살아납니다.",
      keyPoints: ["실행력", "생활 감각", "관계 운영"],
      caution: "책임을 혼자 떠안으면 애정이 관리 업무처럼 바뀔 수 있습니다.",
    },
    loveFriction: {
      headline: "정확한 말이 날카롭게 들릴 수 있습니다",
      body:
        "문제를 바로 짚는 힘이 있지만, 가까운 관계에서는 해결보다 공감이 먼저 필요할 때가 있습니다. 말의 정확도보다 순서를 조절해야 합니다.",
      keyPoints: ["직설", "피드백", "속도 조절"],
      caution: "상대의 감정이 정리되기 전에 결론을 내리면 갈등이 커질 수 있습니다.",
      repeatedPattern: ["문제의 원인을 빠르게 찾습니다.", "상대가 느린 반응을 보이면 답답함이 올라옵니다."],
      betterUse: ["해결책 전에 감정을 한 번 확인합니다.", "요청과 판단을 분리해 말합니다."],
    },
    marriageRhythm: {
      headline: "역할과 생활 기준이 맞을 때 결혼 리듬이 안정됩니다",
      body:
        "결혼 생활은 감정보다 반복되는 생활 기준이 중요합니다. 돈, 시간, 집안일, 가족 행사 기준을 초반에 맞출수록 안정감이 커집니다.",
      keyPoints: ["역할 분담", "생활 기준", "장기 책임"],
      caution: "기준이 한쪽의 통제로 느껴지지 않게 합의 과정이 필요합니다.",
    },
    householdMoneyAndRoleSplit: {
      headline: "돈과 역할은 말보다 숫자와 규칙으로 맞춰야 합니다",
      body:
        "공동비, 개인비, 저축, 가족 지원 기준을 흐릿하게 두면 감정 갈등으로 번지기 쉽습니다. 숫자와 역할을 먼저 맞추는 편이 관계를 보호합니다.",
      keyPoints: ["공동비 기준", "개인 영역", "역할 합의"],
      caution: "돈 이야기를 애정의 크기로 해석하지 않도록 분리해야 합니다.",
    },
    conflictRecovery: {
      headline: "갈등은 결론보다 회복 순서가 중요합니다",
      body:
        "갈등이 생기면 관계의 결론을 바로 내기보다 무엇이 불편했는지, 어떤 기준이 어긋났는지를 나눠야 합니다. 회복은 감정, 사실, 요청의 순서로 정리할 때 빨라집니다.",
      keyPoints: ["감정 확인", "상황 분리", "요청 정리"],
      caution: "상대의 성격을 단정하는 말은 회복을 늦춥니다.",
    },
    parentMode: {
      headline: "부모가 되었을 때 기준과 루틴을 세우는 쪽에 강합니다",
      body:
        "당신은 감정만으로 돌보기보다 생활 리듬, 공부 습관, 약속을 잡아주는 역할에 강합니다. 다만 내 기준이 아이의 속도보다 앞서지 않게 조절해야 합니다.",
      keyPoints: ["생활 루틴", "책임감", "기준 세우기"],
      caution: "잘하려는 마음이 통제처럼 느껴지지 않게 감정 확인이 필요합니다.",
      parentingRolePattern: ["반복 루틴을 잡아줍니다.", "약속과 책임을 분명히 가르칩니다.", "실제 행동으로 돌봄을 보여줍니다."],
      avoidProjection: ["내 속도를 아이의 속도로 착각하지 않습니다.", "결과보다 감정 신호를 먼저 확인합니다."],
    },
    breakupReunionPattern: {
      headline: "관계 정리와 회복은 내 반복 패턴부터 봐야 합니다",
      body:
        "흔들리는 관계에서는 상대의 선택을 예측하기보다 내가 반복하는 반응을 먼저 봐야 합니다. 빠른 판단, 직설, 거리 두기 방식이 반복되는지 확인하는 것이 핵심입니다.",
      keyPoints: ["내 반복 반응", "감정 처리", "회복 경계선"],
      caution: "상대의 미래를 단정하는 방식은 관계 회복에도 정리에도 도움이 되지 않습니다.",
      myLoop: ["상대의 태도 변화를 빠르게 평가합니다.", "답답함이 커지면 결론을 앞당기려 합니다."],
      emotionalProcessing: ["감정을 사실과 분리해 적습니다.", "말하기 전에 원하는 요청을 한 문장으로 정리합니다."],
      repairBoundary: ["반복되는 문제와 일시적 감정을 구분합니다.", "내가 바꿀 수 있는 행동과 상대 몫을 나눕니다."],
    },
    relationshipTimingHints: evidencePacket.timingHints.length > 0
      ? evidencePacket.timingHints
      : [
          {
            label: "관계 점검",
            headline: "감정이 커지기 전 기준을 맞춥니다",
            body:
              "갈등 신호는 결론이 아니라 말투, 속도, 생활 기준을 조율하라는 기준입니다.",
            push: ["생활 기준 정리", "대화 기록"],
            avoid: ["상대 단정", "결론 서두르기"],
          },
        ],
    actionPlan: [
      {
        label: "연애",
        headline: "관계 속도를 말로 확인하기",
        body: "호감만 확인하지 말고 서로의 관계 속도와 기준을 확인합니다.",
        firstAction: "원하는 관계 속도를 한 문장으로 적습니다.",
      },
      {
        label: "결혼",
        headline: "생활 기준을 숫자로 맞추기",
        body: "돈, 시간, 역할 분담 기준을 미리 확인합니다.",
        firstAction: "공동비와 개인비 기준을 나눠 적습니다.",
      },
      {
        label: "갈등 회복",
        headline: "말투보다 상황을 분리하기",
        body: "상대 성격을 단정하지 않고 문제가 된 장면을 나눕니다.",
        firstAction: "갈등 장면을 사실, 감정, 요청으로 나눕니다.",
      },
      {
        label: "부모 역할",
        headline: "기준과 감정을 같이 보기",
        body: "루틴을 세우되 감정 신호를 놓치지 않습니다.",
        firstAction: "생활 기준과 감정 확인 시간을 따로 둡니다.",
      },
      {
        label: "관계 정리",
        headline: "내 반복 패턴부터 확인하기",
        body: "관계 결론보다 내가 반복하는 반응을 먼저 봅니다.",
        firstAction: "최근 반복된 말투를 세 가지 적습니다.",
      },
      {
        label: "생활 리듬",
        headline: "혼자 정리하는 시간 확보하기",
        body: "거리감이 아니라 회복 리듬으로 시간을 씁니다.",
        firstAction: "주 1회 혼자 정리하는 시간을 일정에 넣습니다.",
      },
    ],
    riskManagement: [
      {
        title: "기준이 압박으로 들리는 위험",
        body: "빠른 판단이 상대에게는 평가처럼 들릴 수 있습니다.",
        prevention: "요청과 판단을 분리해 말합니다.",
      },
      {
        title: "책임이 한쪽으로 몰리는 위험",
        body: "관계를 안정시키려는 마음이 관리 역할로 커질 수 있습니다.",
        prevention: "역할과 책임을 함께 정합니다.",
      },
    ],
    safetyNotes: [
      "이 리포트는 관계 성향과 반복 패턴을 해석한 참고용입니다.",
      "결과를 단정하지 않고 선택과 대화 기준을 정리합니다.",
      "부모 역할 파트는 실제 아이의 사주나 성향이 아니라 당신의 역할 방식을 다룹니다.",
    ],
  };
}

function PreviewShell({
  children,
  devStatus,
}: {
  readonly children: ReactNode;
  readonly devStatus?: string;
}) {
  return (
    <main className="min-h-screen bg-[#f4efe7] px-4 py-7 text-[#201a18] sm:px-8 sm:py-10">
      <section className="mx-auto flex w-full min-w-0 max-w-[22.5rem] flex-col gap-5 sm:max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-bold uppercase tracking-[0.14em] text-[#8b8174]">
          <span>Gyeol Report</span>
          <span>연애·결혼·자녀 리포트</span>
        </div>
        {devStatus === undefined ? null : (
          <aside
            className="w-fit rounded-md border border-[#d8d1c4] bg-[#fffdf8]/90 px-3 py-1.5 text-[11px] font-bold text-[#8b8174]"
            aria-label="dev-only metadata"
          >
            <span className="text-[#7f1d38]">미리보기</span>
            <span className="ml-2 normal-case tracking-normal">{devStatus}</span>
          </aside>
        )}
        {children}
      </section>
    </main>
  );
}

function renderMessage(title: string, message: string) {
  return (
    <PreviewShell>
      <section className="space-y-4 rounded-lg border border-[#d8d1c4] bg-[#fffdf8] p-6 shadow-[0_18px_70px_rgba(42,31,24,0.08)]">
        <p className="text-sm font-extrabold text-[#7f1d38]">
          연애·결혼·자녀 리포트
        </p>
        <h1 className="text-2xl font-extrabold text-[#201a18]">{title}</h1>
        <p className="whitespace-pre-line text-sm leading-6 text-[#6f675d]">
          {message}
        </p>
      </section>
    </PreviewShell>
  );
}

function renderReportView(
  draft: LoveMarriageChildReportDraft,
  evidencePacket: LoveMarriageChildReportEvidencePacket,
) {
  return (
    <LoveMarriageChildReportView
      draft={draft}
      evidencePacket={evidencePacket}
      manseRyeokTable={
        <LoveMarriageChildReportManseRyeokTable evidence={evidencePacket} />
      }
      mbtiProfileTable={
        <LoveMarriageChildReportMbtiProfileTable evidence={evidencePacket} />
      }
    />
  );
}

export default async function LoveMarriageChildReportPreviewPage({
  searchParams,
}: LoveMarriageChildPreviewPageProps) {
  if (!isPreviewEnabled()) {
    notFound();
  }

  const resolvedSearchParams = await searchParams;
  const fixtureId = getFixtureId(resolvedSearchParams);
  const snapshotMode = getSnapshotMode(resolvedSearchParams);
  const fixture = requireFixture(fixtureId);

  if (snapshotMode !== "latest") {
    return renderMessage(
      "미리보기 링크가 올바르지 않습니다.",
      "제공된 리포트 미리보기 링크로 다시 접속해주세요.",
    );
  }

  const snapshot = await readPreviewSnapshot(fixture.id);

  if (snapshot !== null) {
    return (
      <PreviewShell devStatus="저장된 화면">
        {renderReportView(snapshot.draft, snapshot.evidencePacket)}
      </PreviewShell>
    );
  }

  const evidencePacket = buildLoveMarriageChildReportEvidence(fixture.person);
  const draft = buildScreenQaDraft(evidencePacket);

  return (
    <PreviewShell devStatus="샘플 화면">
      {renderReportView(draft, evidencePacket)}
    </PreviewShell>
  );
}
