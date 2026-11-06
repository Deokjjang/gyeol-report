import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { requireCompatibilityFixture } from "../../../lib/report-knowledge";
import {
  readCompatibilityPreviewSnapshot,
} from "../../../lib/report-generation/compatibilityPreviewSnapshot";
import { CompatibilityReportView } from "../../reports/[reportId]/CompatibilityReportView";

export const dynamic = "force-dynamic";

type CompatibilityPreviewPageProps = {
  readonly searchParams: Promise<{
    readonly fixture?: string | readonly string[];
    readonly snapshot?: string | readonly string[];
  }>;
};

function isPreviewEnabled(): boolean {
  return (
    process.env.NODE_ENV !== "production" ||
    process.env.COMPATIBILITY_DEV_PREVIEW_ENABLED === "1"
  );
}

function getFixtureId(searchParams: Awaited<CompatibilityPreviewPageProps["searchParams"]>): string {
  const fixture = searchParams.fixture;

  if (Array.isArray(fixture)) {
    return fixture[0] ?? "deokmin-sodam-love";
  }

  if (typeof fixture === "string") {
    return fixture;
  }

  return "deokmin-sodam-love";
}

function getSnapshotMode(
  searchParams: Awaited<CompatibilityPreviewPageProps["searchParams"]>,
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
      <section className="mx-auto flex max-w-3xl flex-col gap-6">
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
          결리포트 개발 미리보기
        </p>
        {children}
      </section>
    </main>
  );
}

function renderDisabledState(message: string) {
  return (
    <PreviewShell>
      <section className="space-y-4 rounded-xl border border-neutral-800 bg-neutral-900/80 p-6">
        <p className="text-sm font-semibold text-amber-200">
          사주×MBTI 궁합 리포트
        </p>
        <h1 className="text-2xl font-bold text-neutral-50">
          궁합 리포트 미리보기를 열 수 없습니다.
        </h1>
        <p className="whitespace-pre-line text-sm leading-6 text-neutral-400">
          {message}
        </p>
      </section>
    </PreviewShell>
  );
}

function renderMissingSnapshotState(fixtureId: string) {
  return renderDisabledState(`Preview snapshot not found for fixture ${fixtureId}.`);
}

export default async function CompatibilityPreviewPage({
  searchParams,
}: CompatibilityPreviewPageProps) {
  if (!isPreviewEnabled()) {
    notFound();
  }

  const resolvedSearchParams = await searchParams;
  const fixtureId = getFixtureId(resolvedSearchParams);
  const snapshotMode = getSnapshotMode(resolvedSearchParams);
  let fixture: ReturnType<typeof requireCompatibilityFixture>;

  try {
    fixture = requireCompatibilityFixture(fixtureId);
  } catch {
    notFound();
  }

  if (snapshotMode === "latest") {
    const snapshot = await readCompatibilityPreviewSnapshot(fixture.id);

    if (snapshot === null) {
      return renderMissingSnapshotState(fixture.id);
    }

    return (
      <PreviewShell devStatus="preview snapshot">
        <CompatibilityReportView draft={snapshot.draft} />
      </PreviewShell>
    );
  }

  // The OpenAI writer was removed; only stored preview snapshots are rendered here.
  return renderDisabledState(
    "Live generation was removed with the OpenAI writer. Open this page with ?snapshot=latest to view a stored preview snapshot.",
  );
}
