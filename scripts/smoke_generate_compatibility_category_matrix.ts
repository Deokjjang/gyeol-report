import {
  buildCompatibilityEvidencePacketFromFixture,
  getCompatibilityRelationshipTypeLabel,
  getCompatibilityScoreDisplayLabels,
  requireCompatibilityFixture,
} from "../src/lib/report-knowledge";
import {
  CompatibilityReportWriterFailure,
  buildOpenAICompatibilityReportWriterMessages,
  compatibilityReportDraftJsonSchema,
  compatibilityResponseFormatName,
  deriveAllowedCompatibilityMbtiTerms,
  deriveAllowedCompatibilitySajuTerms,
  formatCompatibilityOpenAIRequestDiagnostics,
  generateCompatibilityReportDraft,
  getCompatibilityReportDraftSchemaTopLevelKeys,
  validateCompatibilityReportDraft,
} from "../src/lib/report-generation";
import {
  getCompatibilityPreviewSnapshotRelativePath,
  getCompatibilityPreviewUrl,
  writeCompatibilityPreviewSnapshot,
} from "../src/lib/report-generation/compatibilityPreviewSnapshot";

const compatibilityCategoryMatrixFixtureIds = [
  "deokmin-sodam-love",
  "deokmin-sodam-marriage",
  "unknown-time-some",
  "friendship-mbti-known",
  "family-unknown-mbti",
  "business-work-partner-sample",
] as const;

type MatrixRow = {
  readonly fixtureId: string;
  readonly relationshipType: string;
  readonly relationshipLabel: string;
  readonly totalScore: number;
  readonly scoreLabels: readonly string[];
  readonly firstChapterTitle: string;
  readonly warningCount: number;
  readonly snapshotPath?: string;
  readonly previewUrl?: string;
  readonly draftText?: string;
  readonly finalAdviceText?: string;
  readonly status: "deterministic" | "pass";
};

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

function getScoreLabelList(
  labels: ReturnType<typeof getCompatibilityScoreDisplayLabels>,
): readonly string[] {
  return [
    labels.attraction,
    labels.communication,
    labels.lifestyleRhythm,
    labels.conflictRecovery,
    labels.longTermStability,
    labels.growthComplement,
  ];
}

function shouldPrintPreviewUrl(row: MatrixRow): boolean {
  return row.status === "pass" && row.previewUrl !== undefined;
}

function assertNoForbiddenText(input: {
  readonly label: string;
  readonly text: string | undefined;
  readonly forbiddenPattern: RegExp;
}): void {
  if (input.text === undefined) {
    return;
  }
  if (input.forbiddenPattern.test(input.text)) {
    throw new Error(`${input.label} output contains forbidden vocabulary`);
  }
}

function assertCategoryDifferentiation(rows: readonly MatrixRow[]): void {
  const relationshipLabels = new Set(rows.map((row) => row.relationshipLabel));
  const love = rows.find((row) => row.fixtureId === "deokmin-sodam-love");
  const family = rows.find((row) => row.fixtureId === "family-unknown-mbti");
  const business = rows.find(
    (row) => row.fixtureId === "business-work-partner-sample",
  );
  const generatedChapterTitles = rows
    .map((row) => row.firstChapterTitle)
    .filter((title) => title !== "-");

  if (relationshipLabels.size < 4) {
    throw new Error("category differentiation failed: fewer than 4 labels");
  }
  if (
    love === undefined ||
    family === undefined ||
    business === undefined ||
    love.scoreLabels.join("|") === family.scoreLabels.join("|") ||
    love.scoreLabels.join("|") === business.scoreLabels.join("|") ||
    family.scoreLabels.join("|") === business.scoreLabels.join("|")
  ) {
    throw new Error("category differentiation failed: score labels did not differ");
  }
  if (
    generatedChapterTitles.length > 1 &&
    new Set(generatedChapterTitles).size === 1
  ) {
    throw new Error("category differentiation failed: first chapters are identical");
  }

  assertNoForbiddenText({
    label: "business_work_partner",
    text: business.draftText,
    forbiddenPattern: /데이트|연애|애인|설렘|호감|마음이 식었다/u,
  });
  assertNoForbiddenText({
    label: "family",
    text: family.draftText,
    forbiddenPattern: /데이트|연애|애인|설렘|호감|끌림/u,
  });
  assertNoForbiddenText({
    label: "love finalAdvice",
    text: love.finalAdviceText,
    forbiddenPattern: /피드백 규칙|의사결정|신뢰 관리|업무 기준/u,
  });
}

function writeMatrixRow(row: MatrixRow): void {
  writeLine(`fixture: ${row.fixtureId}`);
  writeLine(`relationship type: ${row.relationshipType}`);
  writeLine(`relationship label: ${row.relationshipLabel}`);
  writeLine(`total score: ${row.totalScore}`);
  writeLine(`score labels: ${row.scoreLabels.join(", ")}`);
  writeLine(`first chapter title: ${row.firstChapterTitle}`);
  writeLine(`warning count: ${row.warningCount}`);
  writeLine(`snapshot path: ${row.snapshotPath ?? "-"}`);
  if (shouldPrintPreviewUrl(row)) {
    writeLine(`preview URL: ${row.previewUrl}`);
  } else {
    writeLine("preview URL: -");
  }
  writeLine("");
}

async function buildMatrixRow(input: {
  readonly fixtureId: (typeof compatibilityCategoryMatrixFixtureIds)[number];
  readonly generate: boolean;
  readonly writePreview: boolean;
}): Promise<MatrixRow> {
  const fixture = requireCompatibilityFixture(input.fixtureId);
  const packet = buildCompatibilityEvidencePacketFromFixture(fixture);
  const labels = getCompatibilityScoreDisplayLabels(fixture.input.relationshipType);
  const deterministicRow = {
    fixtureId: fixture.id,
    relationshipType: fixture.input.relationshipType,
    relationshipLabel: getCompatibilityRelationshipTypeLabel(
      fixture.input.relationshipType,
    ),
    totalScore: packet.score.totalScore,
    scoreLabels: getScoreLabelList(labels),
  };

  if (!input.generate) {
    return {
      ...deterministicRow,
      firstChapterTitle: "-",
      warningCount: 0,
      status: "deterministic",
    };
  }

  const messages = buildOpenAICompatibilityReportWriterMessages({
    evidencePacket: packet,
  });
  writeLine(`OpenAI request debug for ${fixture.id}:`);
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
  const validation = validateCompatibilityReportDraft(result.draft, {
    allowedSajuTerms: deriveAllowedCompatibilitySajuTerms(packet),
    allowedMbtiTerms: deriveAllowedCompatibilityMbtiTerms(packet),
  });

  if (!validation.ok) {
    throw new Error(validation.errors.join("\n"));
  }

  const sanitizedDraft = validation.value ?? result.draft;
  const draftText = JSON.stringify(sanitizedDraft);
  let snapshotPath: string | undefined;
  let previewUrl: string | undefined;

  if (input.writePreview) {
    const previewDraft = {
      ...sanitizedDraft,
      deepSajuBridge: packet.deepSajuBridge,
    };

    await writeCompatibilityPreviewSnapshot({
      fixtureId: fixture.id,
      evidencePacket: packet,
      draft: previewDraft,
      qualityWarnings: validation.warnings,
    });
    snapshotPath = getCompatibilityPreviewSnapshotRelativePath(fixture.id);
    previewUrl = getCompatibilityPreviewUrl(fixture.id);
  }

  return {
    ...deterministicRow,
    firstChapterTitle: sanitizedDraft.chapters[0]?.title ?? "-",
    warningCount: validation.warnings.length,
    snapshotPath,
    previewUrl,
    draftText,
    finalAdviceText: sanitizedDraft.finalAdvice.join("\n"),
    status: "pass",
  };
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const writePreview = shouldWritePreview(argv);
  const generate = isWriterEnabled() && hasWriterConfig();

  writeLine("compatibility category matrix:");
  if (!generate) {
    writeLine("generation: skipped, OpenAI writer env incomplete or disabled");
  }

  const rows: MatrixRow[] = [];
  for (const fixtureId of compatibilityCategoryMatrixFixtureIds) {
    rows.push(
      await buildMatrixRow({
        fixtureId,
        generate,
        writePreview,
      }),
    );
  }

  assertCategoryDifferentiation(rows);

  for (const row of rows) {
    writeMatrixRow(row);
  }

  writeLine("category differentiation checks: PASS");
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
