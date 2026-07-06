import {
  buildAnnualFortuneEvidence,
  type AnnualFortuneEvidencePacket,
} from "../src/lib/report-knowledge/annualFortuneEvidence";
import {
  ANNUAL_FORTUNE_FIXTURES,
  requireAnnualFortuneFixture,
} from "../src/lib/report-knowledge/annualFortuneFixtures";
import {
  type AnnualFortuneDraftFlowSection,
  type AnnualFortuneReportDraft,
  type AnnualFortuneReportMode,
  annualFortuneReportDraftJsonSchema,
  getAnnualFortuneReportDraftSchemaTopLevelKeys,
} from "../src/lib/report-generation/annualFortuneReportDraftTypes";
import {
  getAnnualMonthlyCardBasisLabel,
  summarizeAnnualFortuneDraftQuality,
  validateAnnualFortuneReportDraft,
} from "../src/lib/report-generation/annualFortuneReportDraftValidator";
import {
  AnnualFortuneReportWriterFailure,
  annualFortuneResponseFormatName,
  formatAnnualFortuneOpenAIRequestDiagnostics,
  generateAnnualFortuneReportDraft,
} from "../src/lib/report-generation/openaiAnnualFortuneReportWriter";
import {
  buildOpenAIAnnualFortuneReportWriterMessages,
} from "../src/lib/report-generation/openaiAnnualFortuneReportWriterPrompt";
import {
  getAnnualFortunePreviewSnapshotRelativePath,
  getAnnualFortunePreviewUrl,
  writeAnnualFortunePreviewSnapshot,
} from "../src/lib/report-generation/annualFortunePreviewSnapshot";
import {
  USER_LIFE_STATUS_LABELS,
} from "../src/lib/report-knowledge/userContextTypes";

const openAIKeyEnvName = ["OPENAI", "API", "KEY"].join("_");
const annualFortuneDefaultFixtureId = "deokmin-2026-current";
const annualFortuneMonthlyBasisFallback = "달력월 기준 운영 가이드";

function getFixtureId(argv: readonly string[]): string {
  const flagIndex = argv.findIndex((arg) => arg === "--fixture");
  const inline = argv.find((arg) => arg.startsWith("--fixture="));

  return inline?.split("=")[1] ??
    (flagIndex >= 0 ? argv[flagIndex + 1] : undefined) ??
    ANNUAL_FORTUNE_FIXTURES.find(
      (fixture) => fixture.id === annualFortuneDefaultFixtureId,
    )?.id ??
    ANNUAL_FORTUNE_FIXTURES[0].id;
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
    getEnvValue(openAIKeyEnvName) !== undefined &&
    getEnvValue("OPENAI_REPORT_MODEL") !== undefined
  );
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

function toDraftMode(mode: AnnualFortuneEvidencePacket["mode"]): AnnualFortuneReportMode {
  return mode === "locked_future" ? "current_year" : mode;
}

function firstSentence(value: string): string {
  return value.split(/[.!?。]\s*|[.。]\s*/u)[0]?.trim() || value.trim();
}

function safeList(
  values: readonly string[],
  fallbackValues: readonly string[],
  minimum: number,
): readonly string[] {
  const result = [...values.filter((value) => value.trim().length > 0)];

  for (const fallbackValue of fallbackValues) {
    if (result.length >= minimum) break;
    if (!result.includes(fallbackValue)) {
      result.push(fallbackValue);
    }
  }

  return result;
}

function formatMonthlyBasis(value: string | null | undefined): string {
  return getAnnualMonthlyCardBasisLabel(value ?? annualFortuneMonthlyBasisFallback);
}

function buildDraftFlowSection(
  packet: AnnualFortuneEvidencePacket,
  key: keyof AnnualFortuneEvidencePacket["domainFlows"],
): AnnualFortuneDraftFlowSection {
  const flow = packet.domainFlows[key];

  return {
    title: flow.title,
    summary: flow.summary,
    supportingSignals: flow.supportingSignals,
    frictionSignals: flow.frictionSignals,
    actionHint: flow.actionHint,
  };
}

function buildMonthlyHighlights(
  packet: AnnualFortuneEvidencePacket,
): AnnualFortuneReportDraft["monthlyHighlights"] {
  const groups = [
    { label: "1~3월", months: packet.monthlyFortunes.slice(0, 3) },
    { label: "4~6월", months: packet.monthlyFortunes.slice(3, 6) },
    { label: "7~9월", months: packet.monthlyFortunes.slice(6, 9) },
    { label: "10~12월", months: packet.monthlyFortunes.slice(9, 12) },
  ];

  return groups.map((group) => {
    const themes = group.months.map((month) => month.monthTheme).join(" ");
    const cautions = group.months
      .map((month) => month.caution)
      .filter((value) => value.trim().length > 0)
      .slice(0, 2)
      .join(" ");
    const actionHint =
      group.months[0]?.actionHint ??
      "월별 운영 기준을 작게 나누어 확인하세요.";

    return {
      monthLabel: group.label,
      headline: `${group.label} 운영 흐름`,
      body: `${themes} 이 구간은 한 달씩 끊어 보기보다 일, 돈, 관계, 회복 리듬이 어디에서 먼저 움직이는지 묶어서 읽는 편이 좋습니다. ${cautions}`,
      actionHint,
    };
  });
}

function buildFlowCards(packet: AnnualFortuneEvidencePacket): AnnualFortuneReportDraft["flowCards"] {
  const cards = [
    ["일·성과", packet.domainFlows.careerWork],
    ["돈·현실", packet.domainFlows.moneyResource],
    ["인간관계", packet.domainFlows.socialFamily],
    ["연애·가족", packet.domainFlows.relationshipLove],
    ["학업·자격증", packet.domainFlows.studyGrowth],
    ["몸·생활 리듬", packet.domainFlows.healthRoutine],
  ] as const;

  return cards.map(([label, flow], index) => ({
    label,
    score: 74 - index * 3,
    headline: flow.title,
    body: `${flow.summary} ${flow.actionHint}`,
  }));
}

function buildKeySignals(packet: AnnualFortuneEvidencePacket): AnnualFortuneReportDraft["keySignals"] {
  const opportunity = packet.opportunitySignals[0];
  const difficulty = packet.difficultySignals[0];
  const relation = packet.natalAnnualRelations.interactions[0];

  return [
    {
      type: "opportunity" as const,
      title: "살릴 흐름",
      body:
        opportunity?.plain ??
        packet.annualFortune.supportSignals[0] ??
        packet.annualFortune.interpretation,
      evidenceLabel: opportunity?.type ?? packet.annualFortune.stemTenGod,
    },
    {
      type: "difficulty" as const,
      title: "관리할 흐름",
      body:
        difficulty?.plain ??
        packet.annualFortune.frictionSignals[0] ??
        packet.annualFortune.caution,
      evidenceLabel: difficulty?.type ?? packet.annualFortune.branchTenGod,
    },
    {
      type: "mixed" as const,
      title: "원국과 닿는 지점",
      body: relation?.plain ?? packet.natalAnnualRelations.interpretation,
      evidenceLabel: relation?.type ?? "원국·세운 관계",
    },
  ];
}

function buildChapters(packet: AnnualFortuneEvidencePacket): AnnualFortuneReportDraft["chapters"] {
  const domainChapters = [
    packet.domainFlows.careerWork,
    packet.domainFlows.moneyResource,
    packet.domainFlows.socialFamily,
    packet.domainFlows.relationshipLove,
    packet.domainFlows.studyGrowth,
    packet.domainFlows.healthRoutine,
  ];

  return domainChapters.map((flow) => ({
    title: flow.title,
    headline: firstSentence(flow.summary),
    body: `${flow.summary} ${flow.actionHint}`,
    likelyScenes: safeList(
      [...flow.supportingSignals, ...flow.frictionSignals].slice(0, 4),
      [
        "일정, 돈, 관계, 회복 리듬 중 한 영역에서 먼저 체감됩니다.",
        "선택 연도의 십성 흐름이 실제 생활 기준을 다시 묻게 만듭니다.",
      ],
      2,
    ).slice(0, 4),
    practicalAdvice: safeList(
      [
        flow.actionHint,
        packet.actionGuides.find((guide) => guide.title === flow.title)?.action ?? "",
      ],
      [
        "결론을 바로 확정하기보다 이번 달에 조정할 기준을 하나만 정하세요.",
        "일, 돈, 관계의 기준이 섞이면 기록으로 나누어 부담을 줄이세요.",
      ],
      2,
    ).slice(0, 4),
  }));
}

function buildMonthlyFlow(packet: AnnualFortuneEvidencePacket): AnnualFortuneReportDraft["monthlyFlow"] {
  return packet.monthlyFortunes.map((month) => ({
    month: month.month,
    label: month.label,
    headline: month.monthTheme,
    monthGanji: month.ganji,
    monthlyBasis: formatMonthlyBasis(null),
    elementFocus: month.stemTenGod,
    natalInteractionSummary: [...month.supportSignals, ...month.frictionSignals].join(" / ") || null,
    body: `${month.interpretation} ${month.caution}`,
    advice: month.actionHint,
  }));
}

function buildWriterDisabledAnnualFortuneDraft(
  packet: AnnualFortuneEvidencePacket,
): AnnualFortuneReportDraft {
  const mode = toDraftMode(packet.mode);
  const lifeStatusLabel =
    USER_LIFE_STATUS_LABELS[packet.userContext.lifeStatus];
  const fieldLabel = packet.userContext.fieldLabel ?? null;
  const contextLabel =
    fieldLabel === null || fieldLabel.trim().length === 0
      ? lifeStatusLabel
      : `${lifeStatusLabel} · ${fieldLabel}`;
  const majorAnnualCrossReading =
    packet.majorAnnualCross === null
      ? "현재 대운 정보가 입력되지 않은 결과에서는 선택 연도 세운과 원국의 작용을 먼저 읽고, 10년 배경은 연결된 결과에서 보완합니다."
      : `${packet.majorAnnualCross.majorGanji} 대운은 10년 배경이고 ${packet.majorAnnualCross.annualGanji} 세운은 그 위에 올라오는 1년 자극입니다. ${packet.majorAnnualCross.interpretation} ${packet.majorAnnualCross.caution}`;
  const natalAnnualReading = `${packet.natalAnnualRelations.interpretation} ${packet.natalAnnualRelations.caution}`;
  const monthlyFlowReading =
    "12개월 월운은 한 달씩 끊어진 예언이 아니라 선택 연도 안에서 운영 리듬을 나누어 보는 기준입니다. 상반기에는 일과 돈의 기준을 먼저 잡고, 하반기에는 관계와 회복 리듬까지 함께 조정하는 식으로 읽는 편이 안전합니다.";
  const finalAdvice = [
    packet.domainFlows.careerWork.actionHint,
    packet.domainFlows.moneyResource.actionHint,
    packet.domainFlows.socialFamily.actionHint,
    packet.domainFlows.relationshipLove.actionHint,
    packet.domainFlows.studyGrowth.actionHint,
    packet.domainFlows.healthRoutine.actionHint,
  ];
  const safetyNotes = safeList(
    packet.safetyNotes,
    [
      "이 리포트는 특정 사건이나 날짜를 단정하지 않고 선택 연도 흐름을 관리 기준으로 읽습니다.",
      "건강은 진단이 아니라 생활 리듬과 회복 루틴의 점검 기준으로만 해석합니다.",
      "돈과 투자는 결과를 보장하지 않고 지출, 계약, 리스크 관리 기준을 정리하는 용도로만 읽어 주세요.",
      "합격, 승진, 이직, 결혼, 이혼, 임신, 출산은 확정하지 않고 현재 흐름에서 점검할 선택 기준만 제시합니다.",
    ],
    4,
  ).slice(0, 4);

  return {
    version: "v1",
    productType: "annual_fortune",
    productVersion: "v1",
    targetYear: packet.selectedYear,
    mode,
    personLabel: packet.personContext.name,
    userContextSummary: {
      lifeStatusLabel,
      fieldLabel,
      translationNote:
        "현재 상태와 분야 정보는 세운 계산의 원인이 아니라, 선택 연도 흐름을 실제 생활 장면으로 옮기는 보조 맥락으로만 사용했습니다.",
    },
    openingTitle: `${packet.personContext.name}님의 ${packet.selectedYear}년 세운 리포트`,
    headline: `${packet.annualFortune.ganji} 세운은 ${contextLabel}의 선택 기준을 더 구체적으로 묻는 해입니다.`,
    openingSummary:
      mode === "past_review"
        ? `${packet.selectedYear}년은 ${packet.annualFortune.yearTheme}이 그해 생활 장면에서 왜 무겁거나 넓게 느껴졌는지 회고하는 흐름입니다. ${packet.yearAccessPolicy.notice}`
        : mode === "new_year_preview"
          ? `${packet.selectedYear}년은 신년사주 성격으로 미리 열리는 흐름입니다. 준비, 활용, 조심할 기준을 월별 운영 리듬과 함께 봅니다.`
          : `${packet.selectedYear}년은 지금부터 남은 흐름을 어떻게 활용하고 조율할지 보는 현재 세운입니다. 상반기에 이미 체감된 신호와 남은 달의 운영 기준을 함께 읽습니다.`,
    coreLine: `${packet.annualFortune.yearTheme}: ${packet.annualFortune.interpretation}`,
    selectedYearSummary:
      `${packet.annualFortune.ganji} 세운은 ${packet.annualFortune.stemTenGod}·${packet.annualFortune.branchTenGod} 흐름으로 들어와 ` +
      `${contextLabel}의 일, 돈, 관계, 회복 리듬을 올해 기준으로 다시 정리하게 만듭니다. ${packet.annualFortune.caution}`,
    yearAccessNotice:
      `${packet.yearAccessPolicy.notice} ${packet.yearAccessPolicy.policyLabel}`,
    majorAnnualCrossReading,
    natalAnnualReading,
    monthlyFlowReading,
    monthlyHighlights: buildMonthlyHighlights(packet),
    careerWorkFlow: buildDraftFlowSection(packet, "careerWork"),
    moneyResourceFlow: buildDraftFlowSection(packet, "moneyResource"),
    relationshipFlow: buildDraftFlowSection(packet, "relationshipLove"),
    healthRoutineFlow: buildDraftFlowSection(packet, "healthRoutine"),
    mbtiExpression:
      packet.mbtiBasis.type === null
        ? "MBTI가 입력되지 않아도 세운의 큰 구조는 원국, 선택 연도 간지, 월운 기준으로 읽습니다. 행동 방식은 실제 생활 기록으로 보완해 보는 편이 좋습니다."
        : `${packet.mbtiBasis.type} 성향은 ${packet.mbtiBasis.decisionPattern} ${packet.mbtiBasis.workPattern} 올해 흐름의 원인이 아니라, 세운이 선택과 말투, 일 처리 속도로 드러나는 방식입니다.`,
    riskManagement: safeList(
      packet.riskPatterns.map((risk) => `${risk.title}: ${risk.summary} ${risk.prevention}`),
      [
        "일과 돈 기준이 동시에 올라오면 역할, 기간, 금액을 문장으로 나누어 확인하세요.",
        "관계와 회복 리듬이 흔들릴 때는 감정 결론보다 연락 주기와 휴식 시간을 먼저 조정하세요.",
      ],
      2,
    ),
    actionPlan: safeList(
      packet.actionGuides.map((guide) => `${guide.title}: ${guide.action} ${guide.timingHint}`),
      [
        "월초에는 일, 돈, 관계, 회복 기준 중 하나를 먼저 정리하세요.",
        "월말에는 실제로 부담이 커진 영역을 기록하고 다음 달 기준을 줄이세요.",
      ],
      3,
    ),
    yearSummary: {
      ganji: packet.annualFortune.ganji,
      displayTitle: `${packet.selectedYear}년 ${packet.annualFortune.ganji}`,
      elementLabel: packet.annualGanji.elementSummary,
      tenGodLabel: `${packet.annualFortune.stemTenGod}의 해`,
      modeLabel: packet.yearAccess.label,
      yearTone: packet.yearlyThemeSummary.summary,
    },
    scoreSummary: {
      flowIndex: 72,
      flowTypeLabel: "선택 연도 운영 기준 강화형",
      flowIndexCaution:
        "이 지표는 좋고 나쁨을 점수화하지 않고, 올해 체감될 관리 강도를 보기 위한 보조 기준입니다.",
    },
    flowCards: buildFlowCards(packet),
    keySignals: buildKeySignals(packet),
    annualStructure: {
      ganjiExplanation: `${packet.annualFortune.ganji}는 ${packet.annualGanji.stem}${packet.annualGanji.branch}의 천간·지지 흐름이 선택 연도 배경으로 들어오는 구조입니다.`,
      tenGodExplanation: packet.annualTenGod.plain,
      elementEffectExplanation: packet.elementEffect.plain,
      branchInteractionExplanation:
        packet.branchInteractions.map((interaction) => interaction.plain).join(" ") ||
        packet.natalAnnualRelations.interpretation,
    },
    chapters: buildChapters(packet),
    monthlyFlow: buildMonthlyFlow(packet),
    finalAdvice,
    safetyNotes,
  };
}

async function reportAnnualFortuneDraftResult(input: {
  readonly fixtureId: string;
  readonly packet: AnnualFortuneEvidencePacket;
  readonly draft: AnnualFortuneReportDraft;
  readonly writePreview: boolean;
}): Promise<void> {
  const validation = validateAnnualFortuneReportDraft(input.draft);

  if (!validation.ok || validation.value === undefined) {
    throw new Error(validation.errors.join("\n"));
  }

  writeLine(`draft version: ${validation.value.version}`);
  writeLine("flow cards:");
  for (const card of validation.value.flowCards) {
    writeLine(`- ${card.label}: ${card.score}`);
  }
  writeLine(`chapters: ${validation.value.chapters.length}`);
  writeLine(`monthly flow: ${validation.value.monthlyFlow.length}`);
  writeLine(`monthly flow count: ${validation.value.monthlyFlow.length}`);
  const quality = summarizeAnnualFortuneDraftQuality(validation.value);
  writeLine(`vague copy warnings: ${quality.vagueCopyWarnings}`);
  writeLine(`hard claim warnings: ${quality.hardClaimWarnings}`);
  writeLine(`internal artifact warnings: ${quality.internalArtifactWarnings}`);
  writeLine(`raw English labels: ${quality.rawEnglishSignalLabelWarnings}`);
  writeLine(`repeated term warnings: ${quality.repeatedTermWarnings}`);
  writeLine(
    `generic final advice labels: ${quality.genericFinalAdviceLabelWarnings}`,
  );
  writeLine(
    `final advice domain mismatch warnings: ${quality.finalAdviceDomainMismatchWarnings}`,
  );
  writeLine(
    `repeated terminology warnings: ${quality.repeatedTermWarnings}`,
  );
  writeLine(
    `monthly evidence missing warnings: ${quality.monthlyEvidenceMissingWarnings}`,
  );
  writeLine(
    `domain context overreach warnings: ${quality.domainContextOverreachWarnings}`,
  );
  writeLine(
    `missing difficulty signal warnings: ${quality.missingDifficultySignalWarnings}`,
  );
  writeLine(
    `missing opportunity signal warnings: ${quality.missingOpportunitySignalWarnings}`,
  );
  writeLine(`hero duplication warnings: ${quality.heroDuplicationWarnings}`);
  writeLine(
    `future development wording warnings: ${quality.futureDevelopmentWordingWarnings}`,
  );
  writeLine(
    `final advice domain lock warnings: ${quality.finalAdviceDomainLockWarnings}`,
  );
  writeLine(`abnormal script warnings: ${quality.abnormalScriptWarnings}`);
  writeLine(
    `monthly basis repetition warnings: ${quality.monthlyBasisRepetitionWarnings}`,
  );
  writeLine(`grammar residue warnings: ${quality.grammarResidueWarnings}`);
  writeLine(`parenthetical term warnings: ${quality.parentheticalTermWarnings}`);
  writeLine(
    `monthly basis: ${formatMonthlyBasis(input.packet.monthlyFortuneSeeds[0]?.monthGanji.basis)}`,
  );

  if (input.writePreview) {
    await writeAnnualFortunePreviewSnapshot({
      fixtureId: input.fixtureId,
      evidencePacket: input.packet,
      draft: validation.value,
    });
    const snapshotPath = getAnnualFortunePreviewSnapshotRelativePath(input.fixtureId);
    const previewUrl = getAnnualFortunePreviewUrl(input.fixtureId);

    writeLine("preview snapshot written:");
    writeLine(snapshotPath);
    writeLine(`snapshot: ${snapshotPath}`);
    writeLine("Open in browser:");
    writeLine(previewUrl);
    writeLine(`url: ${previewUrl}`);
  }
  writeLine("done");
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const writePreview = shouldWritePreview(argv);
  const fixture = requireAnnualFortuneFixture(getFixtureId(argv));
  const packet = buildAnnualFortuneEvidence({
    targetYear: fixture.targetYear,
    currentDate: new Date(`${fixture.currentDate}T00:00:00+09:00`),
    person: fixture.person,
  });

  writeLine(`annual fortune draft fixture: ${fixture.id}`);
  writeLine(`mode: ${packet.mode}`);
  writeLine(`year: ${packet.targetYear}`);
  writeLine(`ganji: ${packet.annualGanji.ganji}`);
  writeLine(`ten god: ${packet.annualTenGod.stemTenGod}`);
  writeLine(
    `year element: ${packet.annualGanji.stemElement}/${packet.annualGanji.branchElement}`,
  );
  writeLine("user context:");
  writeLine(`- life status: ${packet.userContext.lifeStatus}`);
  writeLine(`- field label: ${packet.userContext.fieldLabel ?? "none"}`);
  writeList(
    "context translation hints",
    packet.contextTranslationHints.map(
      (hint) =>
        `${hint.domain} nouns: ${hint.preferredSceneNouns.join(", ")} | ${hint.plain}`,
    ),
  );
  writeLine(
    `monthly basis: ${formatMonthlyBasis(packet.monthlyFortuneSeeds[0]?.monthGanji.basis)}`,
  );
  writeList(
    "life area signals",
    packet.lifeAreaSignals.map(
      (signal) => `${signal.area} ${signal.strength}: ${signal.plain}`,
    ),
  );
  writeList(
    "difficulty signals",
    packet.difficultySignals.map(
      (signal) => `${signal.type} ${signal.severity}: ${signal.plain}`,
    ),
  );
  writeList(
    "opportunity signals",
    packet.opportunitySignals.map(
      (signal) => `${signal.type} ${signal.strength}: ${signal.plain}`,
    ),
  );

  if (!isWriterEnabled()) {
    writeLine("writer disabled fallback draft: enabled");
    await reportAnnualFortuneDraftResult({
      fixtureId: fixture.id,
      packet,
      draft: buildWriterDisabledAnnualFortuneDraft(packet),
      writePreview,
    });
    return;
  }
  if (!hasWriterConfig()) {
    writeLine("writer config fallback draft: enabled");
    await reportAnnualFortuneDraftResult({
      fixtureId: fixture.id,
      packet,
      draft: buildWriterDisabledAnnualFortuneDraft(packet),
      writePreview,
    });
    return;
  }

  const messages = buildOpenAIAnnualFortuneReportWriterMessages({
    evidencePacket: packet,
  });

  if (getEnvValue("OPENAI_REPORT_WRITER_DEBUG_SAFE") === "1") {
    writeLine("OpenAI request debug:");
    writeLine(`model: ${getEnvValue("OPENAI_REPORT_MODEL")}`);
    writeLine(`response format: ${annualFortuneResponseFormatName}`);
    writeLine(
      `schema keys: ${getAnnualFortuneReportDraftSchemaTopLevelKeys().join(", ")}`,
    );
    writeLine(
      `schema approx chars: ${JSON.stringify(annualFortuneReportDraftJsonSchema).length}`,
    );
    writeLine(`system chars: ${messages.system.length}`);
    writeLine(`developer chars: ${messages.developer.length}`);
    writeLine(`user chars: ${messages.user.length}`);
  }

  const result = await generateAnnualFortuneReportDraft({
    evidencePacket: packet,
    config: {
      enabled: true,
      apiKey: getEnvValue(openAIKeyEnvName) ?? "",
      model: getEnvValue("OPENAI_REPORT_MODEL") ?? "",
    },
  });
  await reportAnnualFortuneDraftResult({
    fixtureId: fixture.id,
    packet,
    draft: result.draft,
    writePreview,
  });
}

main().catch((error: unknown) => {
  process.stderr.write("FAIL\n");
  if (error instanceof AnnualFortuneReportWriterFailure) {
    process.stderr.write(`${error.code}\n`);
    if (error.diagnostics !== undefined) {
      for (const line of formatAnnualFortuneOpenAIRequestDiagnostics(
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

  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
