import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import {
  requireMajorFortuneFixture,
} from "../../../lib/report-knowledge/majorFortuneFixtures";
import {
  readMajorFortunePreviewSnapshot,
} from "../../../lib/report-generation/majorFortunePreviewSnapshot";
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
    <main className="min-h-screen bg-neutral-950 px-5 py-10 text-neutral-50 sm:px-8">
      <section className="mx-auto flex max-w-4xl flex-col gap-6">
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
          대운 리포트
        </p>
        <h1 className="text-2xl font-bold text-neutral-50">{title}</h1>
        <p className="whitespace-pre-line text-sm leading-6 text-neutral-400">
          {message}
        </p>
      </section>
    </PreviewShell>
  );
}

function renderMissingSnapshotState(fixtureId: string) {
  return renderMessage(
    "대운 리포트 preview snapshot이 없습니다.",
    [
      "Preview snapshot not found. Run:",
      `pnpm dlx tsx scripts/smoke_generate_major_fortune_report_draft.ts --fixture ${fixtureId} --write-preview`,
    ].join("\n"),
  );
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

  try {
    requireMajorFortuneFixture(fixtureId);
  } catch {
    notFound();
  }

  if (snapshotMode !== "latest") {
    return renderMessage(
      "snapshot=latest 모드만 지원합니다.",
      "대운 dev preview는 브라우저에서 OpenAI를 호출하지 않고 .tmp/major-fortune-preview snapshot만 읽습니다.",
    );
  }

  const snapshot = await readMajorFortunePreviewSnapshot(fixtureId);

  if (snapshot === null) {
    return renderMissingSnapshotState(fixtureId);
  }

  return (
    <PreviewShell
      devStatus={`preview snapshot · ${snapshot.fixtureId} · ${snapshot.generatedAt}`}
    >
      <MajorFortuneReportView draft={snapshot.draft} />
    </PreviewShell>
  );
}
