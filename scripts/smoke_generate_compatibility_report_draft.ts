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
  validateCompatibilityReportDraft,
  deriveAllowedCompatibilityMbtiTerms,
  deriveAllowedCompatibilitySajuTerms,
} from "../src/lib/report-generation";
import {
  getCompatibilityPreviewSnapshotRelativePath,
  getCompatibilityPreviewUrl,
  writeCompatibilityPreviewSnapshot,
} from "../src/lib/report-generation/compatibilityPreviewSnapshot";
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

function shouldWritePreview(argv: readonly string[]): boolean {
  return argv.includes("--write-preview");
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

function writeQualityWarnings(warnings: readonly string[]): void {
  writeLine("quality warnings:");
  if (warnings.length === 0) {
    writeLine("- none");
    return;
  }

  for (const warning of warnings) {
    writeLine(`- ${warning}`);
  }
}

function writeDeepSajuLayers(
  notes: NonNullable<
    ReturnType<typeof buildCompatibilityEvidencePacketFromFixture>["deepSajuBridge"]
  >["notes"],
): void {
  type DeepSajuNote = (typeof notes)[number];
  const layerOrder: readonly DeepSajuNote["layer"][] = [
    "day_master_relation",
    "cross_ten_god",
    "element_complement",
    "combined_element_climate",
    "branch_trine",
    "branch_clash",
    "branch_harm",
    "spouse_palace",
    "month_rhythm",
    "hour_life_rhythm",
  ] as const;
  const getLayerOrderIndex = (layer: DeepSajuNote["layer"]): number => {
    const index = layerOrder.indexOf(layer);
    return index >= 0 ? index : Number.MAX_SAFE_INTEGER;
  };

  writeLine("deep saju layers:");
  if (notes.length === 0) {
    writeLine("- none");
    return;
  }

  for (const note of [...notes].sort(
    (left, right) =>
      getLayerOrderIndex(left.layer) - getLayerOrderIndex(right.layer),
  )) {
    writeLine(`- ${note.layer}: ${note.relationLabel}`);
    writeLine(`  plain: ${note.plainKoreanSummary}`);
  }
}

function writeCompatibilityReportBody(input: {
  readonly draft: CompatibilityReportDraft;
  readonly warnings: readonly string[];
}): void {
  const { draft } = input;

  writeLine("=== COMPATIBILITY REPORT BODY START ===");
  writeLine("사주×MBTI 궁합 리포트 v1.0");
  writeLine(draft.openingTitle);
  writeLine(draft.openingSummary);
  writeLine(draft.coreLine);
  writeLine(`종합 궁합 점수: ${draft.scoreSummary.totalScore}`);
  writeLine(`score label: ${draft.scoreSummary.scoreLabel}`);
  writeLine(`score caution: ${draft.scoreSummary.scoreCaution}`);
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
    writeBulletList("반복될 수 있는 장면:", chapter.directHitScenes);
    writeBulletList("실전 조언:", chapter.practicalAdvice);
  }

  writeBlankLine();
  writeBulletList("오늘부터 할 일", draft.finalAdvice);
  writeBulletList("안전 안내", draft.safetyNotes);
  writeQualityWarnings(input.warnings);
  writeLine("=== COMPATIBILITY REPORT BODY END ===");
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const printBody = shouldPrintBody(argv);
  const writePreview = shouldWritePreview(argv);
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
  writeDeepSajuLayers(packet.deepSajuBridge?.notes ?? []);

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
  const validation = validateCompatibilityReportDraft(result.draft, {
    allowedSajuTerms: deriveAllowedCompatibilitySajuTerms(packet),
    allowedMbtiTerms: deriveAllowedCompatibilityMbtiTerms(packet),
  });
  if (!validation.ok) {
    throw new Error(validation.errors.join("\n"));
  }
  writeQualityWarnings(validation.warnings);
  if (printBody) {
    writeCompatibilityReportBody({
      draft: result.draft,
      warnings: validation.warnings,
    });
  }
  if (writePreview) {
    const previewDraft = {
      ...result.draft,
      deepSajuBridge: packet.deepSajuBridge,
    };

    await writeCompatibilityPreviewSnapshot({
      fixtureId: fixture.id,
      evidencePacket: packet,
      draft: previewDraft,
      qualityWarnings: validation.warnings,
    });
    writeLine("preview snapshot written:");
    writeLine(getCompatibilityPreviewSnapshotRelativePath(fixture.id));
    writeLine("Open in browser:");
    writeLine(getCompatibilityPreviewUrl(fixture.id));
  }
  writeLine("done");
  if (writePreview) {
    writeLine("PASS");
  }
}

main().catch((error: unknown) => {
  process.stderr.write("FAIL\n");
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
