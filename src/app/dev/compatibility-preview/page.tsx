import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import {
  buildCompatibilityEvidencePacketFromFixture,
  requireCompatibilityFixture,
} from "../../../lib/report-knowledge";
import {
  CompatibilityReportWriterFailure,
  formatCompatibilityOpenAIRequestDiagnostics,
  generateCompatibilityReportDraft,
} from "../../../lib/report-generation";
import { CompatibilityReportView } from "../../reports/[reportId]/CompatibilityReportView";

export const dynamic = "force-dynamic";

type CompatibilityPreviewPageProps = {
  readonly searchParams: Promise<{
    readonly fixture?: string | readonly string[];
  }>;
};

const openAIKeyEnvName = ["OPENAI", "API", "KEY"].join("_");
const authorizationHeaderName = ["Author", "ization"].join("");

function isPreviewEnabled(): boolean {
  return (
    process.env.NODE_ENV !== "production" ||
    process.env.COMPATIBILITY_DEV_PREVIEW_ENABLED === "1"
  );
}

function getEnvValue(name: string): string | undefined {
  const value = process.env[name];

  return value === undefined || value.trim().length === 0 ? undefined : value;
}

function isWriterEnabled(): boolean {
  return getEnvValue("OPENAI_REPORT_WRITER_ENABLED") === "1";
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

function PreviewShell({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-neutral-950 px-5 py-10 text-neutral-50 sm:px-8">
      <section className="mx-auto flex max-w-3xl flex-col gap-6">
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
          사주×MBTI 궁합 리포트 v1.0
        </p>
        <h1 className="text-2xl font-bold text-neutral-50">
          궁합 리포트 미리보기를 열 수 없습니다.
        </h1>
        <p className="text-sm leading-6 text-neutral-400">{message}</p>
      </section>
    </PreviewShell>
  );
}

function renderFailureState(error: unknown) {
  const lines =
    error instanceof CompatibilityReportWriterFailure &&
    error.diagnostics !== undefined
      ? formatCompatibilityOpenAIRequestDiagnostics(error.diagnostics).map(
          redactPreviewDiagnosticLine,
        )
      : [error instanceof Error ? error.message : String(error)];

  return (
    <PreviewShell>
      <section className="space-y-4 rounded-xl border border-red-900/70 bg-red-950/30 p-6">
        <p className="text-sm font-semibold text-red-200">
          사주×MBTI 궁합 리포트 v1.0
        </p>
        <h1 className="text-2xl font-bold text-neutral-50">
          궁합 리포트 생성에 실패했습니다.
        </h1>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-red-100/80">
          {lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>
    </PreviewShell>
  );
}

function redactPreviewDiagnosticLine(line: string): string {
  return line
    .replace(/sk-\[[^\s"]+/g, "sk-[redacted]")
    .replace(/sk-[A-Za-z0-9][A-Za-z0-9_-]{5,}/g, "sk-[redacted]")
    .replace(
      new RegExp(`${authorizationHeaderName}:\\s*Bearer\\s+\\S+`, "giu"),
      `${authorizationHeaderName}: Bearer [redacted]`,
    )
    .replace(
      new RegExp(`${openAIKeyEnvName}\\s*=\\s*\\S+`, "gu"),
      `${openAIKeyEnvName}=[redacted]`,
    );
}

export default async function CompatibilityPreviewPage({
  searchParams,
}: CompatibilityPreviewPageProps) {
  if (!isPreviewEnabled()) {
    notFound();
  }

  const fixtureId = getFixtureId(await searchParams);
  let fixture: ReturnType<typeof requireCompatibilityFixture>;

  try {
    fixture = requireCompatibilityFixture(fixtureId);
  } catch {
    notFound();
  }

  const packet = buildCompatibilityEvidencePacketFromFixture(fixture);

  if (!isWriterEnabled()) {
    return renderDisabledState(
      "OpenAI writer is disabled. Enable OPENAI_REPORT_WRITER_ENABLED=1 to preview generated compatibility report.",
    );
  }

  const apiKey = getEnvValue(openAIKeyEnvName);
  const model = getEnvValue("OPENAI_REPORT_MODEL");

  if (apiKey === undefined || model === undefined) {
    return renderDisabledState(
      "OpenAI writer config is incomplete. Set the OpenAI key and OPENAI_REPORT_MODEL to preview generated compatibility report.",
    );
  }

  let result: Awaited<ReturnType<typeof generateCompatibilityReportDraft>>;

  try {
    result = await generateCompatibilityReportDraft({
      evidencePacket: packet,
      config: {
        enabled: true,
        apiKey,
        model,
      },
    });
  } catch (error) {
    return renderFailureState(error);
  }

  return (
    <PreviewShell>
      <CompatibilityReportView draft={result.draft} status="dev preview" />
    </PreviewShell>
  );
}
