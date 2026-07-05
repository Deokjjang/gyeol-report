import {
  buildCompatibilityEvidencePacketFromFixture,
  getCompatibilityRelationshipTypeLabel,
  getCompatibilityRelationshipTypeFocus,
  getCompatibilityScoreCaution,
  getCompatibilityScoreDisplayLabels,
  requireCompatibilityFixture,
} from "../src/lib/report-knowledge";
import {
  COMPATIBILITY_REPORT_CHAPTER_IDS,
  generateCompatibilityReportDraft,
  getCompatibilityReportDraftSchemaTopLevelKeys,
  buildOpenAICompatibilityReportWriterMessages,
  compatibilityReportDraftJsonSchema,
  compatibilityResponseFormatName,
  CompatibilityReportWriterFailure,
  formatCompatibilityOpenAIRequestDiagnostics,
  validateCompatibilityReportDraft,
  normalizeCompatibilityFinalAdviceItemForValidation,
  deriveAllowedCompatibilityMbtiTerms,
  deriveAllowedCompatibilitySajuTerms,
} from "../src/lib/report-generation";
import {
  getCompatibilityPreviewSnapshotRelativePath,
  getCompatibilityPreviewUrl,
  writeCompatibilityPreviewSnapshot,
} from "../src/lib/report-generation/compatibilityPreviewSnapshot";
import type { CompatibilityReportDraft } from "../src/lib/report-generation";
import type { CompatibilityReportChapterId } from "../src/lib/report-generation/compatibilityReportDraftTypes";

const compatibilitySmokeFixtureIds = [
  "deokmin-sodam-love",
  "deokmin-sodam-marriage",
  "unknown-time-some",
  "friendship-mbti-known",
  "family-unknown-mbti",
  "business-work-partner-sample",
] as const;

const expectedDeepLayerSmokeHints = {
  "business-work-partner-sample": {
    dayMaster: "무토 -> 경금",
    crossTenGod: "식신/편인",
  },
  "family-unknown-mbti": {
    dayMaster: "계수 -> 무토",
    crossTenGod: "정관/정재",
  },
} as const;

function getFixtureId(argv: readonly string[]): string {
  const flagIndex = argv.findIndex((arg) => arg === "--fixture");
  const inline = argv.find((arg) => arg.startsWith("--fixture="));

  return inline?.split("=")[1] ?? (flagIndex >= 0 ? argv[flagIndex + 1] : undefined) ??
    compatibilitySmokeFixtureIds[0];
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

type CompatibilitySmokeEvidencePacket = ReturnType<
  typeof buildCompatibilityEvidencePacketFromFixture
>;

function firstNonEmpty(
  values: readonly (string | null | undefined)[],
  fallback: string,
): string {
  return values.find((value): value is string => Boolean(value?.trim())) ?? fallback;
}

function takeNonEmpty(
  values: readonly (string | null | undefined)[],
  fallback: readonly string[],
  limit: number,
): readonly string[] {
  const filtered = [
    ...new Set(
      values
        .map((value) => value?.trim())
        .filter((value): value is string => Boolean(value)),
    ),
  ];

  return (filtered.length > 0 ? filtered : fallback).slice(0, limit);
}

function formatMbtiPair(packet: CompatibilitySmokeEvidencePacket): string {
  const aType = packet.personAChartSummary.mbti;
  const bType = packet.personBChartSummary.mbti;

  if (aType === undefined && bType === undefined) {
    return "두 사람의 대화 습관";
  }

  return `${aType ?? "MBTI 미입력"} × ${bType ?? "MBTI 미입력"}`;
}

function buildScreenQaRelationshipAnalysis(
  packet: CompatibilitySmokeEvidencePacket,
): CompatibilityReportDraft["relationshipAnalysis"] {
  const relationLabel = getCompatibilityRelationshipTypeLabel(packet.relationshipType);
  const relationFocus = getCompatibilityRelationshipTypeFocus(packet.relationshipType);
  const aName = packet.personAChartSummary.displayName;
  const bName = packet.personBChartSummary.displayName;
  const strengthFinding = packet.directFindings.find(
    (finding) => finding.type === "strength",
  );
  const frictionFinding = packet.directFindings.find(
    (finding) => finding.type === "friction",
  );
  const riskFinding = packet.directFindings.find(
    (finding) => finding.type === "risk",
  );
  const repairFinding = packet.directFindings.find(
    (finding) => finding.type === "repair",
  );
  const pairLovePattern = packet.mbtiCompatibility.lovePattern;
  const pairMarriagePattern = packet.mbtiCompatibility.marriagePattern;
  const elementSummary = firstNonEmpty(
    [
      ...packet.sajuCompatibility.elementComplementSignals,
      ...packet.sajuCompatibility.overloadedElementSignals,
      ...packet.sajuCompatibility.sharedWeakElementSignals,
      ...packet.sajuCompatibility.elementBalance,
    ],
    "두 사람의 오행 흐름은 보완과 피로가 함께 생기는 지점으로 봅니다.",
  );

  return {
    connectionSummary: [
      firstNonEmpty(
        [
          strengthFinding?.interpretation,
          packet.bridgeCompatibility.interpretationMode,
        ],
        `${aName}님과 ${bName}님은 ${relationLabel} 관계에서 장점과 피로가 같이 드러나는 조합입니다.`,
      ),
      pairLovePattern ?? packet.mbtiCompatibility.reportLine,
      elementSummary,
    ]
      .filter((line): line is string => Boolean(line?.trim()))
      .join("\n\n"),
    firstImpression: `${aName}님은 관계의 방향과 기준을 먼저 잡고, ${bName}님은 반응 속도와 확인 방식으로 관계를 읽습니다. 처음에는 이 차이가 끌림이 됩니다. 한쪽은 답을 빠르게 정리하고, 다른 한쪽은 그 답이 성립하는 전제와 예외를 확인합니다.\n\n문제는 가까워진 뒤입니다. ${aName}님이 해결을 위해 속도를 내면 ${bName}님은 생각할 시간을 빼앗긴다고 느끼고, ${bName}님이 신중하게 멈추면 ${aName}님은 관계가 제자리에서 맴돈다고 느낍니다. 이 조합은 감정이 없는 게 아니라, 대화 속도가 안 맞을 때 빠르게 피곤해집니다.`,
    stayingPower: [
      pairMarriagePattern,
      "오래 가려면 감정, 역할, 책임 범위를 한 번에 처리하지 말고 단계로 나누어야 합니다. 이 조합은 서로의 차이를 없애야 안정되는 관계가 아닙니다. 빠르게 정리하는 힘과 오래 검토하는 힘을 같은 자리에서 충돌시키지 않을 때 안정됩니다.",
      "중요한 대화에서는 먼저 감정을 확인하고, 그다음 사실을 맞추고, 마지막에 실행 결정을 내려야 합니다. 순서가 정리되면 한쪽의 속도는 추진력이 되고, 다른 한쪽의 신중함은 관계를 망설이게 하는 요소가 아니라 실수를 줄이는 장치가 됩니다.",
    ]
      .filter((line): line is string => Boolean(line?.trim()))
      .join("\n\n"),
    frictionPoints: takeNonEmpty(
      [
        frictionFinding?.interpretation,
        riskFinding?.interpretation,
        ...packet.frictionPoints,
        ...packet.mbtiCompatibility.friction,
      ],
      [
        "끌림은 빠르게 생기지만 가까워질수록 결론 속도와 확인 방식의 차이가 피로로 쌓일 수 있습니다.",
      ],
      4,
    ),
    categoryReading: `${relationLabel} 관계에서는 ${relationFocus}가 핵심입니다. 이 조합은 장점만 보면 편해 보이지만, 실제로는 기준을 누가 잡고 누가 확인하는지에 따라 체감이 크게 갈립니다.\n\n${elementSummary}\n\n명리에서는 이 차이를 생활 기준, 역할 압박, 회복 속도의 문제로 보고, MBTI에서는 결론을 앞당기는 사람과 전제를 더 확인하려는 사람의 대화 습관으로 봅니다. 같은 차이가 처음에는 매력이고, 가까워지면 피로가 되는 이유가 여기에 있습니다.`,
    aToBFatigue: `${aName}님은 ${bName}님의 확인 시간이 길어지거나 반응이 늦어질 때 관계가 멈춘다고 느낍니다. ${aName}님 입장에서는 이미 핵심이 보였고 이제 정리하면 되는데, ${bName}님이 다시 전제를 확인하면 답답함이 올라옵니다.`,
    bToAFatigue: `${bName}님은 ${aName}님의 결론 속도와 기준 제시가 빠를 때 충분히 설명받기 전에 밀린다고 느낍니다. ${bName}님 입장에서는 아직 생각이 끝나지 않았는데, ${aName}님이 결론을 요구하면 대화가 아니라 압박처럼 들어옵니다.`,
    communicationRecovery: [
      "갈등이 생기면 감정 확인, 사실 정리, 다음 행동을 분리해서 말해야 회복 비용이 줄어듭니다. 바로 결론을 내면 빠른 쪽은 시원하지만, 느린 쪽은 따라오지 못합니다. 반대로 계속 생각만 하면 신중한 쪽은 안전하지만, 빠른 쪽은 방치된다고 느낍니다.",
      packet.mbtiCompatibility.repairStrategy[0],
      repairFinding?.safeWording,
    ]
      .filter((line): line is string => Boolean(line?.trim()))
      .join("\n\n"),
    roleMoneyLifeRhythm: `${relationLabel} 관계에서도 돈, 역할, 일정, 생활 리듬은 감으로 넘기지 않는 편이 낫습니다. 기준이 흐려지면 좋은 보완도 관리 부담으로 바뀝니다.\n\n특히 한쪽이 더 빨리 책임을 잡고 다른 한쪽이 더 오래 생각하는 구조에서는, 역할과 결정권을 말로 분리해야 합니다. 누가 결정하고, 누가 검토하고, 언제 다시 이야기할지 정하지 않으면 사소한 일정과 돈 문제가 관계의 주도권 싸움으로 커집니다.`,
    categorySpecificAdvice: takeNonEmpty(
      [
        packet.categoryLens.repairFocus,
        packet.categoryLens.frictionFocus,
        packet.categoryLens.safetyFocus,
      ],
      ["중요한 결정은 결론 시간과 확인 시간을 따로 잡아야 합니다."],
      3,
    ),
    timingCautions: takeNonEmpty(
      [
        ...packet.sajuCompatibility.timingHints,
        ...packet.bridgeCompatibility.cautionSignals,
      ],
      ["중요한 약속이나 역할 변경은 바로 결론내지 말고 다시 확인할 시간을 둡니다."],
      3,
    ),
    repairStrategy: takeNonEmpty(
      [
        packet.categoryLens.repairFocus,
        ...packet.repairStrategies,
        ...packet.mbtiCompatibility.repairStrategy,
        repairFinding?.safeWording,
      ],
      ["결론, 검토, 실행을 한 번에 처리하지 말고 순서를 나누세요."],
      4,
    ),
    riskManagement: takeNonEmpty(
      [
        riskFinding?.interpretation,
        ...packet.bridgeCompatibility.cautionSignals.map(
          (signal) => `${signal} 그래서 리스크 관리는 감정 설득보다 조기 조율, 말의 순서, 생활 기준 분리로 잡아야 합니다.`,
        ),
        ...packet.frictionPoints,
      ],
      ["기준이 흐려지는 지점을 미리 정리해야 같은 갈등이 반복되지 않습니다."],
      4,
    ),
  };
}

function buildScreenQaChapters(
  packet: CompatibilitySmokeEvidencePacket,
): CompatibilityReportDraft["chapters"] {
  const analysis = buildScreenQaRelationshipAnalysis(packet);
  const chapterBodies: Record<
    Exclude<CompatibilityReportChapterId, "final_message">,
    {
      readonly title: string;
      readonly headline: string;
      readonly body: string;
      readonly directHitScene: string;
      readonly practicalAdvice: string;
    }
  > = {
    overview: {
      title: "전체 구조",
      headline: "장점과 피로가 같이 보이는 조합입니다.",
      body: analysis.connectionSummary,
      directHitScene:
        "한쪽은 기준을 잡고 싶고, 다른 한쪽은 확인 시간이 필요해 대화의 시작점이 달라집니다.",
      practicalAdvice: "중요한 결정은 기준 제시와 확인 시간을 나누어 진행하세요.",
    },
    attraction: {
      title: "첫 인상과 끌림",
      headline: "처음에는 서로 다른 처리 방식이 매력으로 보입니다.",
      body: analysis.firstImpression,
      directHitScene:
        "빠르게 정리하는 사람과 깊게 확인하는 사람이 서로에게 새 자극으로 느껴집니다.",
      practicalAdvice: "끌림이 생겨도 관계 속도는 말로 확인하세요.",
    },
    strengths: {
      title: "오래 가는 힘",
      headline: "역할이 나뉘면 보완성이 살아납니다.",
      body: analysis.stayingPower,
      directHitScene:
        "한 사람은 실행을 밀고, 한 사람은 놓친 조건을 확인하며 균형을 잡습니다.",
      practicalAdvice: "서로의 방식이 필요한 장면을 먼저 정하세요.",
    },
    frictions: {
      title: "자주 부딪히는 지점",
      headline: "속도와 확인 방식이 가장 먼저 부딪힙니다.",
      body: analysis.frictionPoints.join("\n\n"),
      directHitScene:
        "같은 대화를 해도 한쪽은 결론을, 다른 한쪽은 전제 확인을 먼저 요구합니다.",
      practicalAdvice: "결론을 낼 대화와 확인할 대화를 분리하세요.",
    },
    communication: {
      title: "대화와 갈등 회복",
      headline: "말의 순서를 바꾸면 회복 비용이 줄어듭니다.",
      body: analysis.communicationRecovery,
      directHitScene:
        "감정이 올라온 상태에서 바로 해결책을 말하면 상대가 밀린다고 느낄 수 있습니다.",
      practicalAdvice: "감정 확인, 사실 정리, 다음 행동 순서로 말하세요.",
    },
    relationship_scenes: {
      title: "A/B 피로 지점",
      headline: "A가 주는 피로와 B가 주는 피로가 다릅니다.",
      body: `${analysis.aToBFatigue}\n\n${analysis.bToAFatigue}`,
      directHitScene:
        "한쪽은 기다림이 답답하고, 다른 한쪽은 빠른 결론이 부담스럽습니다.",
      practicalAdvice: "답답함과 부담을 각각 따로 말해야 합니다.",
    },
    money_lifestyle: {
      title: "돈/역할/생활 리듬",
      headline: "기준이 흐려지면 좋은 보완도 부담으로 바뀝니다.",
      body: analysis.roleMoneyLifeRhythm,
      directHitScene:
        "돈, 일정, 역할을 감으로 넘기면 사소한 일이 책임 문제로 커집니다.",
      practicalAdvice: "공유 기준과 개인 영역을 짧게라도 문서로 남기세요.",
    },
    conflict_recovery: {
      title: "유지 전략",
      headline: "회복은 감정 설득보다 기준 재정렬에서 빨라집니다.",
      body: analysis.repairStrategy.join("\n\n"),
      directHitScene:
        "같은 문제를 다시 말할 때 기준 없이 감정만 반복하면 피로가 커집니다.",
      practicalAdvice: "다음 대화 시간과 바꿀 행동 하나를 정하세요.",
    },
    long_term_rules: {
      title: "리스크 관리",
      headline: "좋은 조합도 관리 기준이 없으면 지칩니다.",
      body: analysis.riskManagement.join("\n\n"),
      directHitScene:
        "장점으로 보였던 차이가 가까워질수록 압박이나 방치로 느껴질 수 있습니다.",
      practicalAdvice: "역할, 돈, 일정, 말투 중 반복되는 한 가지부터 조정하세요.",
    },
  };

  return COMPATIBILITY_REPORT_CHAPTER_IDS.filter(
    (id): id is Exclude<CompatibilityReportChapterId, "final_message"> =>
      id !== "final_message",
  ).map((id) => ({
    id,
    title: chapterBodies[id].title,
    headline: chapterBodies[id].headline,
    body: chapterBodies[id].body,
    directHitScenes: [chapterBodies[id].directHitScene],
    practicalAdvice: [chapterBodies[id].practicalAdvice],
  }));
}

function buildScreenQaCompatibilityDraft(
  packet: CompatibilitySmokeEvidencePacket,
): CompatibilityReportDraft {
  const relationLabel = getCompatibilityRelationshipTypeLabel(packet.relationshipType);
  const aName = packet.personAChartSummary.displayName;
  const bName = packet.personBChartSummary.displayName;
  const analysis = buildScreenQaRelationshipAnalysis(packet);

  return {
    version: "compatibility_v1_draft",
    productType: "saju_mbti_compatibility",
    productVersion: "1.0",
    relationshipType: packet.relationshipType as CompatibilityReportDraft["relationshipType"],
    personALabel: aName,
    personBLabel: bName,
    openingTitle: `${aName}님과 ${bName}님의 ${relationLabel} 궁합`,
    openingSummary:
      "두 사람은 장점과 피로가 같이 드러나는 조합입니다. 끌림은 빠르게 생기지만 가까워질수록 속도, 기준, 확인 방식이 관계의 체감 온도를 가릅니다. 한쪽은 빠르게 해결하려 하고, 다른 한쪽은 충분히 생각한 뒤 움직이려 합니다.",
    coreLine:
      "끌림은 있지만, 속도와 확정 타이밍을 맞추지 않으면 금방 피곤해지는 조합입니다.",
    scoreSummary: {
      ...packet.score,
      scoreCaution: getCompatibilityScoreCaution(
        packet.relationshipType,
        packet.score.totalScore,
      ),
    },
    chartComparison: {
      personA: packet.personAChartSummary,
      personB: packet.personBChartSummary,
    },
    keyCompatibilityPoints: {
      attractionPoints: takeNonEmpty(
        [
          packet.categoryLens.strengthFocus,
          packet.mbtiCompatibility.reportLine,
        ],
        ["처음에는 서로 다른 처리 방식이 매력으로 보입니다."],
        3,
      ),
      strengthPoints: takeNonEmpty(
        [
          ...packet.strengths,
          ...packet.mbtiCompatibility.positiveInfluence,
        ],
        ["역할이 나뉘면 실행과 검토가 모두 살아납니다."],
        3,
      ),
      frictionPoints: analysis.frictionPoints,
      relationshipRules: analysis.repairStrategy,
    },
    relationshipAnalysis: analysis,
    chapters: buildScreenQaChapters(packet),
    finalAdvice: [
      "대화 규칙: 결론을 내는 시간과 확인하는 시간을 분리하세요.",
      "생활 기준: 돈, 일정, 역할은 감으로 넘기지 말고 공유 기준을 짧게 남기세요.",
      `갈등 회복: ${formatMbtiPair(packet)}의 반응 차이를 성의 부족으로 단정하지 말고 다음 대화 시간을 먼저 정하세요.`,
    ],
    safetyNotes: packet.safetyNotes,
  };
}

async function writePreviewFromDraft(input: {
  readonly fixtureId: string;
  readonly packet: CompatibilitySmokeEvidencePacket;
  readonly draft: CompatibilityReportDraft;
  readonly warnings: readonly string[];
}): Promise<void> {
  await writeCompatibilityPreviewSnapshot({
    fixtureId: input.fixtureId,
    evidencePacket: input.packet,
    draft: input.draft,
    qualityWarnings: input.warnings,
  });
  writeLine("preview snapshot written:");
  writeLine(getCompatibilityPreviewSnapshotRelativePath(input.fixtureId));
  writeLine("Open in browser:");
  writeLine(getCompatibilityPreviewUrl(input.fixtureId));
}

async function handleScreenQaFallback(input: {
  readonly fixtureId: string;
  readonly packet: CompatibilitySmokeEvidencePacket;
  readonly reason: string;
  readonly writePreview: boolean;
  readonly printBody: boolean;
}): Promise<void> {
  const fallbackDraft = buildScreenQaCompatibilityDraft(input.packet);
  const validation = validateCompatibilityReportDraft(fallbackDraft, {
    allowedSajuTerms: deriveAllowedCompatibilitySajuTerms(input.packet),
    allowedMbtiTerms: deriveAllowedCompatibilityMbtiTerms(input.packet),
  });

  if (!validation.ok || validation.value === undefined) {
    throw new Error(validation.errors.join("\n"));
  }

  writeLine(input.reason);
  writeLine("fallback screen QA draft generated");
  writeLine("relationshipAnalysis: present");
  writeLine(`friction points: ${validation.value.relationshipAnalysis.frictionPoints.length}`);
  writeLine(`repair strategy: ${validation.value.relationshipAnalysis.repairStrategy.length}`);
  writeQualityWarnings(validation.warnings);

  if (input.printBody) {
    writeCompatibilityReportBody({
      draft: validation.value,
      warnings: validation.warnings,
    });
  }

  if (input.writePreview) {
    await writePreviewFromDraft({
      fixtureId: input.fixtureId,
      packet: input.packet,
      draft: validation.value,
      warnings: validation.warnings,
    });
  } else {
    writeLine("Open in browser:");
    writeLine(getCompatibilityPreviewUrl(input.fixtureId));
  }
  writeLine("done");
  if (input.writePreview) {
    writeLine("PASS");
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

function writeScoreLabels(
  labels: ReturnType<typeof getCompatibilityScoreDisplayLabels>,
): void {
  writeLine("score labels:");
  writeLine(`- ${labels.attraction}`);
  writeLine(`- ${labels.communication}`);
  writeLine(`- ${labels.lifestyleRhythm}`);
  writeLine(`- ${labels.conflictRecovery}`);
  writeLine(`- ${labels.longTermStability}`);
  writeLine(`- ${labels.growthComplement}`);
}

function writeExpectedDeepLayerHints(fixtureId: string): void {
  const hints =
    expectedDeepLayerSmokeHints[
      fixtureId as keyof typeof expectedDeepLayerSmokeHints
    ];

  if (hints === undefined) {
    return;
  }

  writeLine("expected deep layer hints:");
  writeLine(`- day_master_relation: ${hints.dayMaster}`);
  writeLine(`- cross_ten_god: ${hints.crossTenGod}`);
}

function writeCompatibilityReportBody(input: {
  readonly draft: CompatibilityReportDraft;
  readonly warnings: readonly string[];
}): void {
  const { draft } = input;
  const scoreLabels = getCompatibilityScoreDisplayLabels(draft.relationshipType);

  writeLine("=== COMPATIBILITY REPORT BODY START ===");
  writeLine("사주×MBTI 궁합 리포트 v1.0");
  writeLine(draft.openingTitle);
  writeLine(draft.openingSummary);
  writeLine(draft.coreLine);
  writeLine(`종합 궁합 점수: ${draft.scoreSummary.totalScore}`);
  writeLine(`score label: ${draft.scoreSummary.scoreLabel}`);
  writeLine(`score caution: ${draft.scoreSummary.scoreCaution}`);
  writeLine(`${scoreLabels.attraction}: ${draft.scoreSummary.breakdown.attraction}`);
  writeLine(`${scoreLabels.communication}: ${draft.scoreSummary.breakdown.communication}`);
  writeLine(`${scoreLabels.lifestyleRhythm}: ${draft.scoreSummary.breakdown.lifestyleRhythm}`);
  writeLine(`${scoreLabels.conflictRecovery}: ${draft.scoreSummary.breakdown.conflictRecovery}`);
  writeLine(`${scoreLabels.longTermStability}: ${draft.scoreSummary.breakdown.longTermStability}`);
  writeLine(`${scoreLabels.growthComplement}: ${draft.scoreSummary.breakdown.growthComplement}`);
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
  writeBulletList(
    "오늘부터 할 일",
    draft.finalAdvice.map((item) => {
      const normalized = normalizeCompatibilityFinalAdviceItemForValidation(item);

      return `${normalized.label} - ${normalized.body}`;
    }),
  );
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
  const scoreLabels = getCompatibilityScoreDisplayLabels(
    fixture.input.relationshipType,
  );

  writeLine(`compatibility fixture: ${fixture.id}`);
  writeLine(`relationship type: ${fixture.input.relationshipType}`);
  writeLine(
    `relationship label: ${getCompatibilityRelationshipTypeLabel(fixture.input.relationshipType)}`,
  );
  writeScoreLabels(scoreLabels);
  writeExpectedDeepLayerHints(fixture.id);
  writeLine(
    `person A: ${fixture.input.personA.displayName} ${fixture.input.personA.mbti ?? "MBTI unknown"}`,
  );
  writeLine(
    `person B: ${fixture.input.personB.displayName} ${fixture.input.personB.mbti ?? "MBTI unknown"}`,
  );
  writeLine(`score total: ${packet.score.totalScore}`);
  writeDeepSajuLayers(packet.deepSajuBridge?.notes ?? []);

  if (!isWriterEnabled()) {
    await handleScreenQaFallback({
      fixtureId: fixture.id,
      packet,
      reason: "SKIPPED, OpenAI writer not enabled",
      writePreview,
      printBody,
    });
    return;
  }
  if (!hasWriterConfig()) {
    await handleScreenQaFallback({
      fixtureId: fixture.id,
      packet,
      reason: "SKIPPED, OpenAI writer env incomplete",
      writePreview,
      printBody,
    });
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
  const sanitizedDraft = validation.value ?? result.draft;
  writeQualityWarnings(validation.warnings);
  if (printBody) {
    writeCompatibilityReportBody({
      draft: sanitizedDraft,
      warnings: validation.warnings,
    });
  }
  if (writePreview) {
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
