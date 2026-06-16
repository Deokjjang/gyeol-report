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
import type { CompatibilityReportDraft } from "../src/lib/report-generation";

function getFixtureId(argv: readonly string[]): string {
  const flagIndex = argv.findIndex((arg) => arg === "--fixture");
  const inline = argv.find((arg) => arg.startsWith("--fixture="));

  return inline?.split("=")[1] ?? (flagIndex >= 0 ? argv[flagIndex + 1] : undefined) ??
    "deokmin-sodam-love";
}

function shouldPrintBody(argv: readonly string[]): boolean {
  return (
    argv.includes("--print-body") ||
    argv.includes("--body") ||
    argv.includes("--print")
  );
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

function writeBlankLine(): void {
  writeLine("");
}

function writeBulletList(title: string, items: readonly string[]): void {
  writeLine(title);
  if (items.length === 0) {
    writeLine("- 없음");
    return;
  }

  for (const item of items) {
    writeLine(`- ${item}`);
  }
}

function writeCompatibilityReportBody(draft: CompatibilityReportDraft): void {
  writeLine("=== COMPATIBILITY REPORT BODY START ===");
  writeLine("사주×MBTI 궁합 리포트 v1.0");
  writeLine(draft.openingTitle);
  writeLine(draft.openingSummary);
  writeLine(draft.coreLine);
  writeLine(`종합 궁합 점수: ${draft.scoreSummary.totalScore}`);
  writeLine(`끌림: ${draft.scoreSummary.breakdown.attraction}`);
  writeLine(`대화: ${draft.scoreSummary.breakdown.communication}`);
  writeLine(`생활 리듬: ${draft.scoreSummary.breakdown.lifestyleRhythm}`);
  writeLine(`갈등 회복: ${draft.scoreSummary.breakdown.conflictRecovery}`);
  writeLine(`장기 안정성: ${draft.scoreSummary.breakdown.longTermStability}`);
  writeLine(`성장 보완: ${draft.scoreSummary.breakdown.growthComplement}`);
  writeBlankLine();
  writeLine("핵심 포인트");
  writeBulletList("끌리는 지점:", draft.keyCompatibilityPoints.attractionPoints);
  writeBulletList("잘 맞는 지점:", draft.keyCompatibilityPoints.strengthPoints);
  writeBulletList("부딪히는 지점:", draft.keyCompatibilityPoints.frictionPoints);
  writeBulletList("관계 규칙:", draft.keyCompatibilityPoints.relationshipRules);

  for (const chapter of draft.chapters) {
    writeBlankLine();
    writeLine(chapter.title);
    writeLine(chapter.headline);
    writeLine(chapter.body);
    writeBulletList("찔리는 장면:", chapter.directHitScenes);
    writeBulletList("실전 조언:", chapter.practicalAdvice);
  }

  writeBlankLine();
  writeBulletList("마지막 조언", draft.finalAdvice);
  writeBulletList("안전 안내", draft.safetyNotes);
  writeLine("=== COMPATIBILITY REPORT BODY END ===");
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const printBody = shouldPrintBody(argv);
  const fixture = requireCompatibilityFixture(getFixtureId(argv));
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
  if (printBody) {
    writeCompatibilityReportBody(result.draft);
  }
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
