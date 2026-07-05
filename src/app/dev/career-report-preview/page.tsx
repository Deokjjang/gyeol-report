import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import {
  requireCareerReportFixture,
} from "../../../lib/report-knowledge/careerReportFixtures";
import {
  buildCareerReportEvidence,
} from "../../../lib/report-knowledge/careerReportEvidence";
import {
  buildCareerReportScreenQaFallbackDraft,
} from "../../../lib/report-generation/careerReportDraftTypes";
import {
  readCareerReportPreviewSnapshot,
} from "../../../lib/report-generation/careerReportPreviewSnapshot";
import { CareerReportView } from "../../reports/[reportId]/CareerReportView";

export const dynamic = "force-dynamic";

type CareerReportPreviewPageProps = {
  readonly searchParams: Promise<{
    readonly fixture?: string | readonly string[];
    readonly snapshot?: string | readonly string[];
  }>;
};

function isPreviewEnabled(): boolean {
  return (
    process.env.NODE_ENV !== "production" ||
    process.env.CAREER_REPORT_DEV_PREVIEW_ENABLED === "1"
  );
}

function getFixtureId(
  searchParams: Awaited<CareerReportPreviewPageProps["searchParams"]>,
): string {
  const fixture = searchParams.fixture;

  if (Array.isArray(fixture)) {
    return fixture[0] ?? "deokmin-career";
  }
  if (typeof fixture === "string") {
    return fixture;
  }

  return "deokmin-career";
}

function getSnapshotMode(
  searchParams: Awaited<CareerReportPreviewPageProps["searchParams"]>,
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
    <main className="min-h-screen bg-[#f4efe7] px-4 py-7 text-[#201a18] sm:px-8 sm:py-10">
      <section className="mx-auto flex max-w-5xl flex-col gap-5">
        <div className="flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-[0.16em] text-[#8b8174]">
          <span>Gyeol Report</span>
          <span>Career Preview</span>
        </div>
        {devStatus === undefined ? null : (
          <aside
            className="w-fit rounded-md border border-[#d8d1c4] bg-[#fffdf8]/90 px-3 py-1.5 text-[11px] font-bold text-[#8b8174]"
            aria-label="dev-only metadata"
          >
            <span className="text-[#7f1d38]">preview</span>
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
          직업·커리어·돈·학업 리포트
        </p>
        <h1 className="text-2xl font-extrabold text-[#201a18]">{title}</h1>
        <p className="whitespace-pre-line text-sm leading-6 text-[#6f675d]">
          {message}
        </p>
      </section>
    </PreviewShell>
  );
}

export default async function CareerReportPreviewPage({
  searchParams,
}: CareerReportPreviewPageProps) {
  if (!isPreviewEnabled()) {
    notFound();
  }

  const resolvedSearchParams = await searchParams;
  const fixtureId = getFixtureId(resolvedSearchParams);
  const snapshotMode = getSnapshotMode(resolvedSearchParams);
  let fixture: ReturnType<typeof requireCareerReportFixture>;

  try {
    fixture = requireCareerReportFixture(fixtureId);
  } catch {
    notFound();
  }

  if (snapshotMode !== "latest") {
    return renderMessage(
      "snapshot=latest 모드만 지원합니다.",
      "이 미리보기는 브라우저에서 writer를 호출하지 않고 저장된 snapshot 또는 fixture 화면 데이터를 사용합니다.",
    );
  }

  const snapshot = await readCareerReportPreviewSnapshot(fixtureId);

  if (snapshot === null) {
    const fallbackEvidencePacket = buildCareerReportEvidence({
      fixtureId: fixture.id,
      person: fixture.person,
    });
    const fallbackDraft =
      buildCareerReportScreenQaFallbackDraft(fallbackEvidencePacket);

    return (
      <PreviewShell
        devStatus={`fixture · ${fixture.id}`}
      >
        <CareerReportView
          draft={fallbackDraft}
          evidencePacket={fallbackEvidencePacket}
        />
      </PreviewShell>
    );
  }

  return (
    <PreviewShell
      devStatus={`snapshot · ${snapshot.fixtureId} · ${snapshot.generatedAt}`}
    >
      <CareerReportView
        draft={snapshot.draft}
        evidencePacket={snapshot.evidencePacket}
      />
    </PreviewShell>
  );
}
