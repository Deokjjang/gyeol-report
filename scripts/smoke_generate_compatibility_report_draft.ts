import {
  buildCompatibilityEvidencePacketFromFixture,
  requireCompatibilityFixture,
} from "../src/lib/report-knowledge";
import {
  generateCompatibilityReportDraft,
  getCompatibilityReportDraftSchemaTopLevelKeys,
  buildOpenAICompatibilityReportWriterMessages,
  compatibilityReportDraftJsonSchema,
  compatibilityResponseFormatName,
  CompatibilityReportWriterFailure,
  formatCompatibilityOpenAIRequestDiagnostics,
} from "../src/lib/report-generation";

function getFixtureId(argv: readonly string[]): string {
  const flagIndex = argv.findIndex((arg) => arg === "--fixture");
  const inline = argv.find((arg) => arg.startsWith("--fixture="));

  return inline?.split("=")[1] ?? (flagIndex >= 0 ? argv[flagIndex + 1] : undefined) ??
    "deokmin-sodam-love";
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
    getEnvValue("OPENAI_API_KEY") !== undefined &&
    getEnvValue("OPENAI_REPORT_MODEL") !== undefined
  );
}

function writeLine(line: string): void {
  process.stdout.write(`${line}\n`);
}

async function main(): Promise<void> {
  const fixture = requireCompatibilityFixture(getFixtureId(process.argv.slice(2)));
  const packet = buildCompatibilityEvidencePacketFromFixture(fixture);

  writeLine(`compatibility fixture: ${fixture.id}`);
  writeLine(`relationship type: ${fixture.input.relationshipType}`);
  writeLine(
    `person A: ${fixture.input.personA.displayName} ${fixture.input.personA.mbti ?? "MBTI unknown"}`,
  );
  writeLine(
    `person B: ${fixture.input.personB.displayName} ${fixture.input.personB.mbti ?? "MBTI unknown"}`,
  );
  writeLine(`score total: ${packet.score.totalScore}`);

  if (!isWriterEnabled()) {
    writeLine("SKIPPED, OpenAI writer not enabled");
    return;
  }
  if (!hasWriterConfig()) {
    writeLine("SKIPPED, OpenAI writer env incomplete");
    return;
  }

  const messages = buildOpenAICompatibilityReportWriterMessages({
    evidencePacket: packet,
  });
  writeLine("OpenAI request debug:");
  writeLine(`model: ${getEnvValue("OPENAI_REPORT_MODEL")}`);
  writeLine(`response format: ${compatibilityResponseFormatName}`);
  writeLine(
    `schema keys: ${getCompatibilityReportDraftSchemaTopLevelKeys().join(", ")}`,
  );
  writeLine(
    `schema approx chars: ${JSON.stringify(compatibilityReportDraftJsonSchema).length}`,
  );
  writeLine(`system chars: ${messages.system.length}`);
  writeLine(`developer chars: ${messages.developer.length}`);
  writeLine(`user chars: ${messages.user.length}`);

  const result = await generateCompatibilityReportDraft({
    evidencePacket: packet,
    config: {
      enabled: true,
      apiKey: getEnvValue("OPENAI_API_KEY") ?? "",
      model: getEnvValue("OPENAI_REPORT_MODEL") ?? "",
    },
  });

  writeLine(`draft version: ${result.draft.version}`);
  writeLine(`chapters: ${result.draft.chapters.length}`);
  writeLine(`first chapter: ${result.draft.chapters[0]?.title ?? "none"}`);
  writeLine(`repair: ${result.repaired ? "applied" : "not needed"}`);
  writeLine("done");
}

main().catch((error: unknown) => {
  if (error instanceof CompatibilityReportWriterFailure) {
    process.stderr.write(`${error.code}\n`);
    if (error.diagnostics !== undefined) {
      for (const line of formatCompatibilityOpenAIRequestDiagnostics(
        error.diagnostics,
      )) {
        process.stderr.write(`${line}\n`);
      }
    } else {
      process.stderr.write(`${error.message}\n`);
    }
    process.exitCode = 1;
    return;
  }

  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
