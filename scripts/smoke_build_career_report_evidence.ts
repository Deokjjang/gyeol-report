import {
  buildCareerReportEvidence,
  summarizeCareerReportEvidenceMatrixQuality,
} from "../src/lib/report-knowledge/careerReportEvidence";
import {
  CAREER_REPORT_FIXTURES,
  requireCareerReportFixture,
} from "../src/lib/report-knowledge/careerReportFixtures";

const defaultFixtureId = "deokmin-career";

function getFixtureId(argv: readonly string[]): string {
  const flagIndex = argv.findIndex((arg) => arg === "--fixture");
  const inline = argv.find((arg) => arg.startsWith("--fixture="));

  return inline?.split("=")[1] ??
    (flagIndex >= 0 ? argv[flagIndex + 1] : undefined) ??
    CAREER_REPORT_FIXTURES.find((fixture) => fixture.id === defaultFixtureId)
      ?.id ??
    CAREER_REPORT_FIXTURES[0].id;
}

function shouldRunAll(argv: readonly string[]): boolean {
  return argv.includes("--all");
}

function writeLine(line: string): void {
  process.stdout.write(`${line}\n`);
}

function writeList(label: string, values: readonly string[]): void {
  writeLine(`${label}:`);
  if (values.length === 0) {
    writeLine("- none");
    return;
  }

  for (const value of values) {
    writeLine(`- ${value}`);
  }
}

function buildEvidenceForFixture(
  fixtureId: string,
): ReturnType<typeof buildCareerReportEvidence> {
  const fixture = requireCareerReportFixture(fixtureId);

  return buildCareerReportEvidence({
    fixtureId: fixture.id,
    person: fixture.person,
  });
}

function writeMatrixSummary(): void {
  const evidencePackets = CAREER_REPORT_FIXTURES.map((fixture) =>
    buildCareerReportEvidence({
      fixtureId: fixture.id,
      person: fixture.person,
    }),
  );
  const matrixQuality =
    summarizeCareerReportEvidenceMatrixQuality(evidencePackets);

  writeLine(`career report fixture matrix: ${evidencePackets.length}`);
  for (const [index, evidence] of evidencePackets.entries()) {
    const fixture = CAREER_REPORT_FIXTURES[index];

    writeLine(`fixture: ${fixture.id}`);
    writeLine(`person: ${evidence.personLabel}`);
    writeLine(`mbti: ${evidence.mbtiType ?? "unknown"}`);
    writeLine(`lifeStatus: ${evidence.userContext.lifeStatus}`);
    writeLine(`field: ${evidence.userContext.fieldLabel ?? "none"}`);
    writeLine(
      `relationshipStatus: ${evidence.userContext.relationshipStatus ?? "unknown"}`,
    );
    writeLine(`combined profile: ${evidence.combinedCareerProfile.headline}`);
    writeLine(
      `recommended jobs: ${evidence.recommendedJobs
        .slice(0, 3)
        .map((job) => job.title)
        .join(", ")}`,
    );
    writeLine(
      `money style: ${evidence.combinedCareerProfile.moneyStyleArchetypes.join(", ")}`,
    );
    writeLine(
      `investment style: ${evidence.investmentProfile.preferred.join(", ")}`,
    );
    writeLine(
      `study style: ${evidence.combinedCareerProfile.studyStyleArchetypes.join(", ")}`,
    );
    writeLine(
      `warnings: ${
        matrixQuality.sameJobsAcrossAllFixturesWarnings +
        matrixQuality.specificStockTickerWarnings +
        matrixQuality.guaranteedReturnWarnings +
        matrixQuality.hardDeterministicClaimWarnings +
        matrixQuality.deokminLeakageWarnings
      }`,
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

if (shouldRunAll(process.argv.slice(2))) {
  writeMatrixSummary();
  process.exit(0);
}

const fixture = requireCareerReportFixture(getFixtureId(process.argv.slice(2)));
const evidence = buildEvidenceForFixture(fixture.id);
const matrixQuality = summarizeCareerReportEvidenceMatrixQuality([evidence]);

writeLine(`fixture: ${fixture.id}`);
writeLine(`mbti: ${evidence.mbtiType ?? "unknown"}`);
writeLine(`lifeStatus: ${evidence.userContext.lifeStatus}`);
writeLine(`field: ${evidence.userContext.fieldLabel ?? "none"}`);
writeLine(`combined profile: ${evidence.combinedCareerProfile.headline}`);
writeList(
  "recommended jobs",
  evidence.recommendedJobs.slice(0, 10).map((job) => `${job.title} (${job.fit})`),
);
writeList(
  "money style",
  evidence.combinedCareerProfile.moneyStyleArchetypes,
);
writeList("money strategies", evidence.moneyStrategies.map((item) => item.label));
writeList("investment style", evidence.investmentProfile.preferred);
writeLine(`investment disclaimer: ${evidence.investmentProfile.disclaimer}`);
writeList(
  "study style",
  evidence.combinedCareerProfile.studyStyleArchetypes,
);
writeLine(`study headline: ${evidence.studyCertificateStrategy.headline}`);
writeList(
  "opportunity signals",
  evidence.opportunitySignals.map((signal) => `${signal.title}: ${signal.plain}`),
);
writeList(
  "work risk warnings",
  evidence.workRiskWarnings.map((signal) => `${signal.title}: ${signal.plain}`),
);
writeList(
  "timing hints",
  evidence.timingHints.map((signal) => `${signal.title}: ${signal.plain}`),
);
writeLine(
  `warnings: ${
    matrixQuality.sameJobsAcrossAllFixturesWarnings +
    matrixQuality.specificStockTickerWarnings +
    matrixQuality.guaranteedReturnWarnings +
    matrixQuality.hardDeterministicClaimWarnings +
    matrixQuality.deokminLeakageWarnings
  }`,
);
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
