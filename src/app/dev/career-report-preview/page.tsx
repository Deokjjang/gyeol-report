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
    <main className="min-h-screen bg-neutral-950 px-5 py-10 text-neutral-50 sm:px-8">
      <section className="mx-auto flex max-w-5xl flex-col gap-6">
        {devStatus === undefined ? null : (
          <aside
            className="rounded-md border border-neutral-800 bg-neutral-900/70 px-3 py-2 text-xs text-neutral-500"
            aria-label="dev-only metadata"
          >
            <span className="font-semibold text-neutral-400">개발 상태</span>
            <span className="ml-2">{devStatus}</span>
          </aside>
        )}
        <p className="text-sm font-medium text-neutral-500">
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
      <section className="space-y-4 rounded-xl border border-neutral-800 bg-neutral-900/80 p-6">
        <p className="text-sm font-semibold text-sky-200">
          직업·커리어·돈·학업 리포트
        </p>
        <h1 className="text-2xl font-bold text-neutral-50">{title}</h1>
        <p className="whitespace-pre-line text-sm leading-6 text-neutral-400">
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
      "직업·커리어·돈·학업 dev preview는 브라우저에서 OpenAI를 호출하지 않고 snapshot 또는 fixture fallback만 사용합니다.",
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
        devStatus={`fixture fallback · ${fixture.id} · writer disabled/no snapshot`}
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
      devStatus={`preview snapshot · ${snapshot.fixtureId} · ${snapshot.generatedAt}`}
    >
      <CareerReportView
        draft={snapshot.draft}
        evidencePacket={snapshot.evidencePacket}
      />
    </PreviewShell>
  );
}
