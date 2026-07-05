import {
  buildCareerReportEvidence,
  summarizeCareerReportEvidenceMatrixQuality,
} from "../src/lib/report-knowledge/careerReportEvidence";
import {
  CAREER_REPORT_FIXTURES,
  requireCareerReportFixture,
} from "../src/lib/report-knowledge/careerReportFixtures";
import {
  summarizeCareerReportDraftQuality,
  validateCareerReportDraft,
} from "../src/lib/report-generation/careerReportDraftValidator";
import {
  buildCareerReportScreenQaFallbackDraft,
} from "../src/lib/report-generation/careerReportDraftTypes";
import {
  getCareerReportPreviewSnapshotRelativePath,
  getCareerReportPreviewUrl,
  writeCareerReportPreviewSnapshot,
} from "../src/lib/report-generation/careerReportPreviewSnapshot";

const openAIKeyEnvName = ["OPENAI", "API", "KEY"].join("_");
const defaultFixtureId = "deokmin-career";
const writerDisabledSkipMessage =
  "SKIP draft generation, OpenAI writer disabled";

function getFixtureId(argv: readonly string[]): string {
  const flagIndex = argv.findIndex((arg) => arg === "--fixture");
  const inline = argv.find((arg) => arg.startsWith("--fixture="));

  return inline?.split("=")[1] ??
    (flagIndex >= 0 ? argv[flagIndex + 1] : undefined) ??
    CAREER_REPORT_FIXTURES.find((fixture) => fixture.id === defaultFixtureId)
      ?.id ??
    CAREER_REPORT_FIXTURES[0].id;
}

function shouldWritePreview(argv: readonly string[]): boolean {
  return argv.includes("--write-preview");
}

function shouldRunAll(argv: readonly string[]): boolean {
  return argv.includes("--all");
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
    getEnvValue(openAIKeyEnvName) !== undefined &&
    getEnvValue("OPENAI_REPORT_MODEL") !== undefined
  );
}

function writeLine(line: string): void {
  process.stdout.write(`${line}\n`);
}

function hasEvidenceReadiness(
  packet: ReturnType<typeof buildCareerReportEvidence>,
): boolean {
  return (
    packet.recommendedJobs.length >= 8 &&
    packet.moneyStrategies.length > 0 &&
    packet.investmentProfile.disclaimer.length > 0 &&
    packet.studyCertificateStrategy.recommendedMethods.length > 0
  );
}

async function writePreviewSnapshot(input: {
  readonly fixtureId: string;
  readonly packet: ReturnType<typeof buildCareerReportEvidence>;
  readonly draft: Parameters<typeof validateCareerReportDraft>[0];
}): Promise<void> {
  const validation = validateCareerReportDraft(input.draft);

  if (!validation.ok || validation.value === undefined) {
    throw new Error(validation.errors.join("\n"));
  }

  await writeCareerReportPreviewSnapshot({
    fixtureId: input.fixtureId,
    evidencePacket: input.packet,
    draft: validation.value,
  });
  writeLine("snapshot root: .tmp/career-report-preview");
  writeLine("preview route: http://localhost:3000/dev/career-report-preview");
  writeLine(`snapshot: ${getCareerReportPreviewSnapshotRelativePath(input.fixtureId)}`);
  writeLine(`url: ${getCareerReportPreviewUrl(input.fixtureId)}`);
}

async function handleFallbackPreview(input: {
  readonly fixtureId: string;
  readonly packet: ReturnType<typeof buildCareerReportEvidence>;
  readonly reason: string;
  readonly writePreview: boolean;
}): Promise<void> {
  const fallbackDraft = buildCareerReportScreenQaFallbackDraft(input.packet);
  const validation = validateCareerReportDraft(fallbackDraft);

  if (!validation.ok || validation.value === undefined) {
    throw new Error(validation.errors.join("\n"));
  }

  const quality = summarizeCareerReportDraftQuality(validation.value);

  writeLine(
    input.reason === "OpenAI writer disabled"
      ? writerDisabledSkipMessage
      : `SKIP draft generation, ${input.reason}`,
  );
  writeLine(`SKIP OpenAI draft generation, ${input.reason}`);
  writeLine("fallback draft: screen QA structure");
  writeLine(`recommended jobs: ${validation.value.recommendedJobs.length}`);
  writeLine(`unsuitable jobs: ${validation.value.unsuitableJobs.length}`);
  writeLine(`career paths: ${validation.value.careerPaths.length}`);
  writeLine(`career timing: ${validation.value.careerTiming.length}`);
  writeLine(`action plan: ${validation.value.actionPlan.length}`);
  writeLine(`safety notes: ${validation.value.safetyNotes.length}`);
  writeLine(`hard claim warnings: ${quality.hardClaimWarnings}`);
  writeLine(`financial guarantee warnings: ${quality.financialGuaranteeWarnings}`);
  writeLine(`ticker warnings: ${quality.tickerWarnings}`);
  writeLine(`buy/sell instruction warnings: ${quality.buySellInstructionWarnings}`);

  if (input.writePreview) {
    await writePreviewSnapshot({
      fixtureId: input.fixtureId,
      packet: input.packet,
      draft: validation.value,
    });
    return;
  }

  writeLine(`preview url: ${getCareerReportPreviewUrl(input.fixtureId)}`);
  writeLine("preview source: in-memory fixture fallback when snapshot is missing");
}

function writeMatrixReadinessSummary(): void {
  const packets = CAREER_REPORT_FIXTURES.map((fixture) =>
    buildCareerReportEvidence({
      fixtureId: fixture.id,
      person: fixture.person,
    }),
  );
  const matrixQuality = summarizeCareerReportEvidenceMatrixQuality(packets);

  writeLine(`writer: ${isWriterEnabled() ? "enabled" : "disabled"}`);
  for (const [index, packet] of packets.entries()) {
    const fixture = CAREER_REPORT_FIXTURES[index];

    writeLine(`fixture: ${fixture.id}`);
    writeLine(`evidence: ${hasEvidenceReadiness(packet) ? "PASS" : "FAIL"}`);
    writeLine(`recommended jobs: ${packet.recommendedJobs.length}`);
    writeLine(
      `money style: ${packet.combinedCareerProfile.moneyStyleArchetypes.join(", ")}`,
    );
    writeLine(
      `investment style: ${packet.investmentProfile.preferred.join(", ")}`,
    );
    writeLine(
      `study strategy: ${packet.studyCertificateStrategy.headline}`,
    );
  }
  writeLine(
    `same jobs across all fixtures warnings: ${matrixQuality.sameJobsAcrossAllFixturesWarnings}`,
  );
  writeLine(
    `specific stock ticker detected warnings: ${matrixQuality.specificStockTickerWarnings}`,
  );
  writeLine(
    `guaranteed return detected warnings: ${matrixQuality.guaranteedReturnWarnings}`,
  );
  writeLine(
    `hard deterministic claim detected warnings: ${matrixQuality.hardDeterministicClaimWarnings}`,
  );
  writeLine(`Deokmin leakage warnings: ${matrixQuality.deokminLeakageWarnings}`);
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);

  if (shouldRunAll(argv)) {
    writeMatrixReadinessSummary();
    return;
  }

  const writePreview = shouldWritePreview(argv);
  const fixture = requireCareerReportFixture(getFixtureId(argv));
  const packet = buildCareerReportEvidence({
    fixtureId: fixture.id,
    person: fixture.person,
  });
  const matrixQuality = summarizeCareerReportEvidenceMatrixQuality([packet]);

  writeLine(`career report draft fixture: ${fixture.id}`);
  writeLine(`mbti: ${packet.mbtiType ?? "unknown"}`);
  writeLine(`combined profile: ${packet.combinedCareerProfile.headline}`);
  writeLine(`recommended jobs: ${packet.recommendedJobs.length}`);
  writeLine(
    `money style: ${packet.combinedCareerProfile.moneyStyleArchetypes.join(", ")}`,
  );
  writeLine(
    `investment style: ${packet.investmentProfile.preferred.join(", ")}`,
  );
  writeLine(`study strategy: ${packet.studyCertificateStrategy.headline}`);
  writeLine(`writer: ${isWriterEnabled() ? "enabled" : "disabled"}`);
  writeLine(
    `financial guarantee warnings: ${matrixQuality.guaranteedReturnWarnings}`,
  );
  writeLine(`ticker warnings: ${matrixQuality.specificStockTickerWarnings}`);
  writeLine(
    `hard claim warnings: ${matrixQuality.hardDeterministicClaimWarnings}`,
  );

  if (!isWriterEnabled()) {
    await handleFallbackPreview({
      fixtureId: fixture.id,
      packet,
      reason: "OpenAI writer disabled",
      writePreview,
    });
    return;
  }
  if (!hasWriterConfig()) {
    await handleFallbackPreview({
      fixtureId: fixture.id,
      packet,
      reason: "OpenAI writer env incomplete",
      writePreview,
    });
    return;
  }

  const [writerModule, promptModule, typesModule] = await Promise.all([
    import("../src/lib/report-generation/openaiCareerReportWriter"),
    import("../src/lib/report-generation/openaiCareerReportWriterPrompt"),
    import("../src/lib/report-generation/careerReportDraftTypes"),
  ]);
  const messages = promptModule.buildOpenAICareerReportWriterMessages({
    evidencePacket: packet,
  });

  if (getEnvValue("OPENAI_REPORT_WRITER_DEBUG_SAFE") === "1") {
    writeLine("OpenAI request debug:");
    writeLine(`model: ${getEnvValue("OPENAI_REPORT_MODEL")}`);
    writeLine(`response format: ${writerModule.careerMoneyStudyResponseFormatName}`);
    writeLine(
      `schema keys: ${typesModule.getCareerReportDraftSchemaTopLevelKeys().join(", ")}`,
    );
    writeLine(
      `schema approx chars: ${JSON.stringify(typesModule.careerReportDraftJsonSchema).length}`,
    );
    writeLine(`system chars: ${messages.system.length}`);
    writeLine(`developer chars: ${messages.developer.length}`);
    writeLine(`user chars: ${messages.user.length}`);
  }

  const result = await writerModule.generateCareerReportDraft({
    evidencePacket: packet,
    config: {
      enabled: true,
      apiKey: getEnvValue(openAIKeyEnvName) ?? "",
      model: getEnvValue("OPENAI_REPORT_MODEL") ?? "",
    },
  });
  const validation = validateCareerReportDraft(result.draft);

  if (!validation.ok || validation.value === undefined) {
    throw new Error(validation.errors.join("\n"));
  }

  const quality = summarizeCareerReportDraftQuality(validation.value);

  writeLine(`draft version: ${validation.value.version}`);
  writeLine(`recommended jobs: ${validation.value.recommendedJobs.length}`);
  writeLine(`unsuitable jobs: ${validation.value.unsuitableJobs.length}`);
  writeLine(`career paths: ${validation.value.careerPaths.length}`);
  writeLine(`career timing: ${validation.value.careerTiming.length}`);
  writeLine(`action plan: ${validation.value.actionPlan.length}`);
  writeLine(`safety notes: ${validation.value.safetyNotes.length}`);
  writeLine(`hard claim warnings: ${quality.hardClaimWarnings}`);
  writeLine(`financial guarantee warnings: ${quality.financialGuaranteeWarnings}`);
  writeLine(`ticker warnings: ${quality.tickerWarnings}`);
  writeLine(`buy/sell instruction warnings: ${quality.buySellInstructionWarnings}`);
  writeLine(`internal artifact warnings: ${quality.internalArtifactWarnings}`);
  writeLine(
    `recommended job variety warnings: ${quality.recommendedJobVarietyWarnings}`,
  );
  writeLine(`action plan warnings: ${quality.actionPlanWarnings}`);
  writeLine(`safety note warnings: ${quality.safetyNoteWarnings}`);

  if (writePreview) {
    await writePreviewSnapshot({
      fixtureId: fixture.id,
      packet,
      draft: validation.value,
    });
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);

  process.stderr.write(`FAIL\n${message}\n`);
  process.exit(1);
});
