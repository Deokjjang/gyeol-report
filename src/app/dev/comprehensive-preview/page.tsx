import { generateProductReport } from "../../../lib/report-generation/generateProductReport";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import type { ComprehensiveReportV2Draft } from "../../../lib/report-generation/comprehensiveReportDraftTypes";
import { ComprehensiveReportV2View } from "../../reports/[reportId]/ComprehensiveReportV2View";

export const dynamic = "force-dynamic";

const comprehensivePreviewSnapshotRelativePath = "shared product generation pipeline";

type ComprehensivePreviewSnapshot = {
  readonly fixtureId?: string;
  readonly generatedAt?: string;
  readonly draft: ComprehensiveReportV2Draft;
  readonly evidencePacket: unknown;
};

function isPreviewEnabled(): boolean {
  return (
    process.env.NODE_ENV !== "production" ||
    process.env.COMPREHENSIVE_DEV_PREVIEW_ENABLED === "1"
  );
}

async function readComprehensivePreviewSnapshot(): Promise<ComprehensivePreviewSnapshot | null> {
  const result = await generateProductReport({
    productKey: "saju_mbti_full", productSlug: "saju-mbti-full",
    person: { name: "덕민", birthDate: "1996-12-06", birthTime: "09:30", birthTimeUnknown: false, approximateBirthTimeSlot: "", gender: "MALE", mbtiType: "ENTJ" },
    userContext: { relationshipStatus: "single", jobStatus: "employee", detailJob: "서비스 기획자", focusAreas: ["직업", "돈"] }, productOptions: {},
  }, { enabled: false, reason: "flag_disabled" }, "deterministic_fallback");
  return result.ok ? { fixtureId: "deokmin-external-manse", draft: result.draft as ComprehensiveReportV2Draft, evidencePacket: result.evidencePacket } : null;
}

function PreviewShell({
  children,
  devStatus,
}: {
  readonly children: ReactNode;
  readonly devStatus?: string;
}) {
  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#f6f0e7] px-4 py-8 text-[#2b211b] sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full min-w-0 max-w-6xl flex-col gap-6">
        {devStatus === undefined ? null : (
          <aside
            className="min-w-0 break-words rounded-[8px] border border-[#ded2c2] bg-[#fffaf1] px-3 py-2 text-xs text-[#76685c]"
            aria-label="dev-only metadata"
          >
            <span className="font-semibold text-[#6f1d35]">개발 상태</span>
            <span className="mt-1 block break-words sm:ml-2 sm:mt-0 sm:inline">
              {devStatus}
            </span>
          </aside>
        )}
        <p className="min-w-0 break-words text-sm font-medium text-[#76685c]">
          결 리포트 개발 미리보기
        </p>
        {children}
      </section>
    </main>
  );
}

function renderMissingSnapshot() {
  return (
    <PreviewShell>
      <section className="space-y-4 rounded-[8px] border border-[#ded2c2] bg-[#fffaf1] p-6">
        <p className="text-sm font-semibold text-[#8b6d2d]">
          사주×MBTI 종합 리포트
        </p>
        <h1 className="text-2xl font-bold text-[#2b211b]">
          미리보기 데이터가 아직 없습니다.
        </h1>
        <p className="text-sm leading-6 text-[#5a4d42]">
          아래 명령으로 최신 미리보기 데이터를 만든 뒤 다시 열어 주세요.
        </p>
        <code className="block overflow-x-auto rounded-[8px] border border-[#eadfce] bg-white px-3 py-2 text-xs text-[#6f1d35]">
          pnpm test -- tests/unit/payment/paidReportReliability.test.ts
        </code>
      </section>
    </PreviewShell>
  );
}

function getPreviewDisplayName(fixtureId: string | undefined): string | undefined {
  return fixtureId === "deokmin-external-manse" ? "덕민" : undefined;
}

export default async function ComprehensivePreviewPage() {
  if (!isPreviewEnabled()) {
    notFound();
  }

  const snapshot = await readComprehensivePreviewSnapshot();

  if (snapshot === null) {
    return renderMissingSnapshot();
  }

  return (
    <PreviewShell
      devStatus={`loaded ${comprehensivePreviewSnapshotRelativePath}${
        snapshot.generatedAt === undefined ? "" : ` · ${snapshot.generatedAt}`
      }`}
    >
      <ComprehensiveReportV2View
        draft={snapshot.draft}
        evidencePacket={snapshot.evidencePacket}
        reportId="dev-comprehensive-preview"
        displayName={getPreviewDisplayName(snapshot.fixtureId)}
      />
    </PreviewShell>
  );
}
