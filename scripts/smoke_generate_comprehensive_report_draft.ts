import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import {
  buildDeterministicSajuFeatureChapter,
  generateComprehensiveReportDraft,
  isSafeReportGenerationError,
} from "../src/lib/report-generation/openaiComprehensiveReportWriter";
import {
  COMPREHENSIVE_REPORT_V2_LONGFORM_READING_IDS,
  isComprehensiveReportV2Draft,
  type ComprehensiveReportV2ChapterId,
  type ComprehensiveReportV2Draft,
  type ComprehensiveReportV2LongformReadingId,
} from "../src/lib/report-generation/comprehensiveReportDraftTypes";
import { comprehensiveReportDraftJsonSchema } from "../src/lib/report-generation/comprehensiveReportDraftSchema";
import { buildComprehensiveReportV2ProfileTable } from "../src/lib/report-generation/comprehensiveReportProfileTableBuilder";
import { validateComprehensiveReportDraft } from "../src/lib/report-generation/comprehensiveReportDraftValidator";
import {
  buildOpenAIComprehensiveReportWriterMessages,
  deriveAllowedSajuTermsFromEvidencePacket,
} from "../src/lib/report-generation/openaiReportWriterPrompt";
import { buildComprehensiveReportEvidencePacketFromComputedFacts } from "../src/lib/report-knowledge/comprehensiveReportEvidenceInputBuilder";
import type {
  ComprehensiveReportEvidencePacket,
  SelectedSajuFeatureEvidence,
} from "../src/lib/report-knowledge/comprehensiveReportEvidenceTypes";
import {
  getReportQualitySmokeSampleFixtures,
  getReportSmokeFixture,
  getReportSmokeFixtureIdFromArgs,
  getReportSmokeFixtureMatrixModeFromArgs,
  type ReportQualityFixture,
} from "../src/lib/report-knowledge/reportQualityFixtureMatrix";
import {
  evaluateComprehensiveV1QualityGate,
  summarizeComprehensiveV1QualityGate,
} from "../src/lib/report-knowledge/reportQualityGate";
import {
  buildSafeSajuFeatureEvidenceDebugSummary,
  formatSafeSajuFeatureEvidenceDebugSummary,
} from "../src/lib/report-knowledge/sajuFeatureEvidenceDebug";

type RequiredOpenAIReportEnvName =
  | "OPENAI_REPORT_WRITER_ENABLED"
  | "OPENAI_API_KEY"
  | "OPENAI_REPORT_MODEL";

const requiredOpenAIReportEnvNames = [
  "OPENAI_REPORT_WRITER_ENABLED",
  "OPENAI_API_KEY",
  "OPENAI_REPORT_MODEL",
] as const satisfies readonly RequiredOpenAIReportEnvName[];
const comprehensivePreviewSnapshotDir = join(
  process.cwd(),
  ".tmp",
  "comprehensive-report-preview",
);

function writeStatus(message: string): void {
  process.stdout.write(`${message}\n`);
}

function writeErrorStatus(message: string): void {
  process.stderr.write(`${message}\n`);
}

function getEnvValue(name: RequiredOpenAIReportEnvName): string | undefined {
  const value = process.env[name];

  if (typeof value !== "string" || value.trim().length === 0) {
    return undefined;
  }

  return value.trim();
}

function getOptionalEnvValue(name: string): string | undefined {
  const value = process.env[name];

  if (typeof value !== "string" || value.trim().length === 0) {
    return undefined;
  }

  return value.trim();
}

function shouldSkipSmoke(): boolean {
  return requiredOpenAIReportEnvNames.some(
    (name) => getEnvValue(name) === undefined,
  );
}

function shouldWritePreview(argv: readonly string[]): boolean {
  return argv.includes("--write-preview");
}

function getPreviewSnapshotRelativePath(fixtureId: string): string {
  return `.tmp/comprehensive-report-preview/${fixtureId}.latest.json`;
}

function getSchemaTopLevelKeys(): readonly string[] {
  return Object.keys(comprehensiveReportDraftJsonSchema.properties);
}

function writeOpenAIRequestDebug(input: {
  readonly model: string;
  readonly promptChars: number;
}): void {
  if (getOptionalEnvValue("OPENAI_REPORT_WRITER_DEBUG_SAFE") !== "1") {
    return;
  }

  writeStatus("OpenAI request debug:");
  writeStatus(`model: ${input.model}`);
  writeStatus("input message count: 3");
  writeStatus(`approx prompt chars: ${input.promptChars}`);
  writeStatus("response format: comprehensive_report_draft");
  writeStatus(`schema keys: ${getSchemaTopLevelKeys().join(", ")}`);
}

function formatFixturePillars(fixture: ReportQualityFixture): string {
  return [
    fixture.expectedPillars.hour,
    fixture.expectedPillars.day,
    fixture.expectedPillars.month,
    fixture.expectedPillars.year,
  ].join(" ");
}

function buildFixtureQualitySummary(fixture: ReportQualityFixture): {
  readonly computedFeatureCount: number;
  readonly spotlightGroups: readonly string[];
  readonly differentiationModulesCount: number;
  readonly qualityGateSummary: string;
} {
  const { packet, mappedFeatures } =
    buildComprehensiveReportEvidencePacketFromComputedFacts({
      mbtiType: fixture.mbti,
      sajuFacts: fixture.sajuFacts,
    });
  const syntheticVisibleSummary = [
    "사주×MBTI 종합 리포트 v1.0",
    "시주 일주 월주 연주 천간 지지",
    fixture.expectedPillars.hour,
    fixture.expectedPillars.day,
    fixture.expectedPillars.month,
    fixture.expectedPillars.year,
    "element-chip--wood element-chip--fire element-chip--earth element-chip--metal element-chip--water",
    packet.sajuSymbolicNickname === undefined ? "" : "사주 한줄 별칭",
    packet.sajuFeatureSpotlight === undefined ? "" : packet.sajuFeatureSpotlight.title,
    packet.reportDifferentiationModules === undefined
      ? ""
      : "읽기 전에 잡고 갈 핵심 포인트",
    "사람들과 대화 카톡 수업 팀플 가족 돈 계좌 잠들기 전",
    "MBTI는 공식 진단이 아니라 자기보고 성향 언어이며 보조 레이어입니다.",
    "오늘부터 할 수 있는 3가지",
  ].join("\n");
  const qualityGate = evaluateComprehensiveV1QualityGate(syntheticVisibleSummary);

  return {
    computedFeatureCount: mappedFeatures.featureIds.length,
    spotlightGroups:
      packet.sajuFeatureSpotlight?.groups
        .filter((group) => group.items.length > 0)
        .map((group) => group.groupId) ?? [],
    differentiationModulesCount: packet.reportDifferentiationModules?.length ?? 0,
    qualityGateSummary: summarizeComprehensiveV1QualityGate(qualityGate),
  };
}

function writeFixtureQualitySummary(input: {
  readonly fixture: ReportQualityFixture;
  readonly status: "PASS" | "SKIPPED" | "FAIL";
  readonly warningsCount?: number;
}): void {
  const summary = buildFixtureQualitySummary(input.fixture);

  writeStatus(
    [
      `- fixture id: ${input.fixture.id}`,
      `MBTI: ${input.fixture.mbti}`,
      `pillars: ${formatFixturePillars(input.fixture)}`,
      `computed feature count: ${summary.computedFeatureCount}`,
      `spotlight groups: ${summary.spotlightGroups.join(", ") || "none"}`,
      `differentiation modules count: ${summary.differentiationModulesCount}`,
      `quality gate summary: ${summary.qualityGateSummary}`,
      `draft status: ${input.status}`,
      `validator warnings count: ${input.warningsCount ?? 0}`,
    ].join(" | "),
  );
}

function writeSafeSajuFeatureDebug(input: {
  readonly computedFeatureIds: readonly string[];
  readonly selectedEvidence: readonly SelectedSajuFeatureEvidence[] | undefined;
  readonly sajuFeatureSpotlight?: ComprehensiveReportEvidencePacket["sajuFeatureSpotlight"];
  readonly sajuSignatureScenes?: ComprehensiveReportEvidencePacket["sajuSignatureScenes"];
}): void {
  if (getOptionalEnvValue("OPENAI_REPORT_WRITER_DEBUG_SAFE") !== "1") {
    return;
  }

  const summary = buildSafeSajuFeatureEvidenceDebugSummary(input);

  for (const line of formatSafeSajuFeatureEvidenceDebugSummary(summary)) {
    writeStatus(line);
  }
}

function writeSafeFailure(error: unknown): void {
  if (isSafeReportGenerationError(error)) {
    writeErrorStatus("failed");
    writeErrorStatus(`code: ${error.code}`);
    writeErrorStatus(`stage: ${error.stage}`);
    if (error.causeCode !== undefined) {
      writeErrorStatus(`cause: ${error.causeCode}`);
    }
    if (error.status !== undefined) {
      writeErrorStatus(`status: ${error.status}`);
    }
    if (error.errorType !== undefined) {
      writeErrorStatus(`errorType: ${error.errorType}`);
    }
    if (error.errorCode !== undefined) {
      writeErrorStatus(`errorCode: ${error.errorCode}`);
    }
    if (error.diagnosticMessage !== undefined) {
      writeErrorStatus(`message: ${error.diagnosticMessage}`);
    }
    if (error.errorParam !== undefined) {
      writeErrorStatus(`param: ${error.errorParam}`);
    }
    if (error.requestId !== undefined) {
      writeErrorStatus(`requestId: ${error.requestId}`);
    }
    if (error.repairAttempted === true) {
      writeErrorStatus("quality repair: attempted");
      writeErrorStatus(
        `quality repair: ${error.repairPassed === true ? "passed" : "failed"}`,
      );
    }
    if (error.validationErrors !== undefined && error.validationErrors.length > 0) {
      writeErrorStatus("errors:");
      for (const validationError of error.validationErrors) {
        writeErrorStatus(`- ${validationError}`);
      }
    }
    return;
  }

  writeErrorStatus("failed");
  writeErrorStatus("code: OPENAI_REPORT_WRITER_SMOKE_FAILED");
  writeErrorStatus("stage: unknown");
  if (error instanceof Error) {
    writeErrorStatus(`message: ${error.message}`);
  }
}

function getPrimarySajuTerms(packet: ComprehensiveReportEvidencePacket): readonly string[] {
  const featureTerms =
    packet.sajuFeatureDictionary
      ?.map((entry) => entry.rawLabel)
      .filter((value) => value.trim().length > 0) ?? [];

  return [
    ...new Set(
      [
        ...featureTerms,
        packet.sajuFeatureSpotlight?.groups[0]?.items[0]?.labelKo,
      ].filter((value): value is string => value !== undefined),
    ),
  ].slice(0, 4);
}

function getSelectedSajuTerm(input: {
  readonly packet: ComprehensiveReportEvidencePacket;
  readonly offset: number;
  readonly fallback: string;
}): string {
  const entries = input.packet.sajuFeatureDictionary ?? [];
  const entry = entries[input.offset % Math.max(entries.length, 1)];

  return entry?.rawLabel ?? input.fallback;
}

function buildFeatureNarrative(input: {
  readonly packet: ComprehensiveReportEvidencePacket;
  readonly contextLabel: string;
  readonly offset: number;
}): string {
  const entries = input.packet.sajuFeatureDictionary ?? [];

  if (entries.length === 0) {
    return `${input.contextLabel}에서는 명리 특징을 이름보다 실제 생활에서 드러나는 판단 속도, 관계 반응, 일 처리 리듬으로 읽어야 합니다.`;
  }
  const entry = entries[input.offset % entries.length];
  const meaningGuard = entry.rawLabel.includes("천을귀인")
    ? "천을귀인은 도움받는 통로와 위기 완충, 작은 기회가 열리는 흐름으로 번역합니다."
    : entry.rawLabel.includes("현침")
      ? "현침살은 말, 판단, 분석이 날카롭게 들어가는 구조로 읽습니다."
      : entry.rawLabel.includes("홍염") || entry.rawLabel.includes("도화")
        ? "홍염과 도화 계열은 보여지는 매력, 호감, 존재감이 살아나는 신호로 풀이합니다."
        : "";

  return [
    `${input.contextLabel}에서 ${entry.rawLabel}은 이름을 그대로 믿는 표식이 아니라 ${entry.plainMeaning}`,
    meaningGuard,
    `이 구조는 ${entry.howItShowsInYou}`,
    `${input.contextLabel} 안에서 잘 쓰면 ${entry.strength}`,
    `과해질 때는 ${entry.fatiguePoint}로 번질 수 있으므로`,
    `실제로는 ${entry.practicalUse}`,
  ]
    .filter((value) => value.trim().length > 0)
    .join(" ");
}

function buildMbtiNarrative(input: {
  readonly packet: ComprehensiveReportEvidencePacket;
  readonly contextLabel: string;
  readonly offset: number;
}): string {
  const basis = input.packet.mbtiBasis;
  const traitSeeds = basis?.selectedTraitSeeds ?? [];
  const bridge = input.packet.interpretedSajuMbtiBridgeEvidence ?? [];
  const trait = traitSeeds[input.offset % Math.max(traitSeeds.length, 1)];
  const bridgeItem = bridge[input.offset % Math.max(bridge.length, 1)];
  const traitText =
    trait === undefined
      ? ""
      : `${input.contextLabel}에서는 ${trait.label}이 ${trait.description}로 드러납니다. 이 장면의 장점은 ${trait.strengths.join(", ")}이고, 조절이 늦어지면 ${trait.risks.join(", ")} 부담이 커지므로 ${input.contextLabel}에서는 속도를 한 번 낮춰야 합니다.`;
  const bridgeText =
    bridgeItem === undefined
      ? ""
      : `${input.contextLabel}에서 ${bridgeItem.myeongliSignalLabels.join(", ")} 흐름은 MBTI ${bridgeItem.mbti}의 ${bridgeItem.mbtiTraitTopic} 성향과 만나 ${bridgeItem.interpretation} 실제 사용법은 ${bridgeItem.practicalUse.replace(/[.。]$/, "")}라는 기준으로 ${input.contextLabel}에 적용합니다.`;

  return [
    basis === undefined
      ? "MBTI는 원인이 아니라 행동 발현을 이해하는 보조 언어입니다."
      : `${input.contextLabel}에서 ${basis.titleKo}는 ${basis.oneLine}`,
    traitText,
    bridgeText,
  ]
    .filter((value) => value.trim().length > 0)
    .join(" ");
}

function buildLocalChapter(input: {
  readonly chapterId: ComprehensiveReportV2ChapterId;
  readonly titleKo: string;
  readonly packet: ComprehensiveReportEvidencePacket;
  readonly displayName: string;
  readonly mbtiType: string;
  readonly featureOffset: number;
}): ComprehensiveReportV2Draft["chapters"][number] {
  const sajuTerms = getPrimarySajuTerms(input.packet);
  const primaryTerm = getSelectedSajuTerm({
    packet: input.packet,
    offset: input.featureOffset,
    fallback: sajuTerms[0] ?? "원국 구조",
  });
  const secondaryTerm = "MBTI 행동 방식";
  const featureNarrative = buildFeatureNarrative({
    packet: input.packet,
    contextLabel: input.titleKo,
    offset: input.featureOffset,
  });
  const mbtiNarrative = buildMbtiNarrative({
    packet: input.packet,
    contextLabel: input.titleKo,
    offset: input.featureOffset,
  });
  const commonBody =
    `${input.titleKo}에서는 ${primaryTerm}과 ${secondaryTerm}을 먼저 놓고 읽습니다. ${featureNarrative} ${input.titleKo}의 ${input.mbtiType} 설명은 원인이 아니라 행동 발현을 비추는 보조 렌즈입니다. ${mbtiNarrative} 그래서 ${input.titleKo}는 짧은 요약이 아니라, 사주 구조가 말투와 판단 속도, 관계 반응, 돈과 공부, 회복 루틴에서 어떻게 다르게 나타나는지 문단으로 이어 읽어야 합니다. ${input.titleKo}의 실제 장면은 대화 중 결론이 먼저 보이는 순간, 메시지 답장이 짧아지는 순간, 업무나 팀플에서 기준표를 먼저 세우는 순간, 잠들기 전에도 다음 일을 굴리는 순간처럼 생활 리듬 속에서 확인됩니다.`;
  const topicExtra =
    input.chapterId === "work_money_study"
      ? "직업과 돈, 공부에서는 외부 기회보다 기록과 구조가 먼저입니다. 자격증이나 전문서를 볼 때도 왜 써먹는지가 보이면 집중이 붙고, 돈은 벌 계획보다 계좌 분리와 방어 규칙이 없을 때 더 빨리 새기 쉽습니다. 이 흐름은 서비스 기획, 개발, 프로젝트 운영처럼 기준과 결과물이 필요한 일에서 특히 현실감 있게 읽힙니다."
      : input.chapterId === "love_relationships"
        ? "연애와 관계에서는 호감이 있어도 따뜻한 말보다 해결책이 먼저 나갈 수 있습니다. 상대가 서운함을 말할 때 바로 결론을 주기보다 마음을 한 문장으로 받아야 합니다. MBTI는 궁합 단정 기준이 아니라 관계에서 필요한 대화 속도, 표현 온도, 약속 습관을 보는 보조 지표로만 써야 합니다."
        : input.chapterId === "people_family_environment"
          ? "사람과 가족, 환경에서는 역할이 흐릴 때 본인이 먼저 정리하려는 힘이 커집니다. 가족 부탁이나 팀 역할 분담에서 해결을 떠안기 전에 맡을 범위와 마감선을 문장으로 나누어야 관계 피로가 줄어듭니다."
          : input.chapterId === "risk_and_growth"
            ? "반복되는 리스크는 겁줄 일이 아니라 운영법을 바꿀 신호입니다. 쉬는 시간, 밤 산책, 기록, 가벼운 운동, 표현 연습처럼 머리를 식히는 장치를 일정 안에 넣어야 오래 갑니다."
            : input.chapterId === "final_message"
              ? "이 리포트의 마지막 핵심은 더 세게 밀어붙이라는 말이 아닙니다. 오늘부터는 일에서는 맡을 일과 버릴 일을 나누고, 관계에서는 결론보다 질문을 먼저 꺼내고, 돈에서는 쓰는 계좌와 지키는 계좌를 분리하고, 회복에서는 밤에 문제 해결을 멈추는 장치를 만들어야 합니다."
              : `${input.titleKo} 장은 공통 만세력표의 이름을 다시 보여주는 곳이 아니라, 원국 특징을 실제 선택과 말투, 관계와 회복 리듬으로 번역하는 본문입니다.`;
  const namedPrefix =
    input.displayName.trim().length > 0 ? `${input.displayName}님, ` : "";
  const namedSubject =
    input.displayName.trim().length > 0 ? `${input.displayName}님은` : "이 구조는";

  const hitReadingLines =
    input.chapterId === "work_money_study"
      ? [
          "일을 잡으면 초반에는 빠르게 판을 정리하지만, 쉬는 기준은 자주 뒤로 밀릴 수 있습니다.",
          "자격증이나 전문서 공부도 왜 써먹는지가 보여야 집중력이 붙는 편입니다.",
          "돈은 벌 아이디어보다 지킬 구조가 없을 때 더 빨리 새기 쉽습니다.",
        ]
      : input.chapterId === "love_relationships"
        ? [
            "호감이 있어도 따뜻한 말보다 해결책이 먼저 나갈 수 있습니다.",
            "상대가 감정을 말할 때 위로보다 다음 행동을 먼저 주고 싶어질 수 있습니다.",
            "감정 기복이 큰 사람보다 말과 생활이 안정적인 사람이 오래 맞을 가능성이 큽니다.",
          ]
        : input.chapterId === "risk_and_growth"
          ? [
              "쉬어야 할 때도 머리가 꺼지지 않아 다음 일정을 먼저 굴릴 수 있습니다.",
              "버티는 힘은 강하지만, 회복 타이밍은 자주 늦게 잡히기 쉽습니다.",
            ]
          : input.chapterId === "final_message"
            ? [
                `${namedSubject} 이기는 법을 빨리 배우지만, 오래 가는 법은 따로 설계해야 하는 편입니다.`,
              ]
            : [
                `${namedPrefix}상대가 설명을 끝내기 전에 이미 결론이 보이는 상황 자주 나오지 않나요?`,
                `${input.titleKo}에서는 감정보다 기준을 먼저 세우는 편입니다.`,
                `${input.titleKo}에서는 책임을 먼저 떠안는 장면이 나올 수 있습니다.`,
              ].slice(0, input.chapterId === "opening" || input.chapterId === "saju_identity" ? 2 : 3);
  const solutionLines =
    input.chapterId === "opening"
      ? []
      : input.chapterId === "work_money_study"
        ? [
            "공부와 일 루틴은 자격증, 전문서, 직무 학습, 사업 학습을 2주 단위로 쪼개세요.",
            "돈은 공격 계획과 방어 계획을 분리해 계좌와 예산을 따로 보세요.",
            "프로젝트를 키우기 전 기록, 정산일, 책임 범위를 먼저 적어 두세요.",
            "쉬는 시간을 성능 관리 일정으로 먼저 넣으세요.",
          ]
        : input.chapterId === "love_relationships"
          ? [
              "맞는 상대: 감정을 천천히 풀어주고 과열을 식혀주는 사람이 맞기 쉽습니다.",
              "피해야 할 상대: 감정 기복이 크고 책임이 흐릿한 사람은 조심할 상대입니다.",
              "보완 기운: 감정 완충과 표현 온도를 보태는 성향이 관계를 오래 가게 합니다.",
              "MBTI 관계 기준: 감정을 천천히 풀어주고 생활 리듬과 책임감이 안정적인 성향을 보되 MBTI만으로 궁합을 단정하지 않습니다.",
            ]
          : input.chapterId === "risk_and_growth"
            ? [
                "밤 산책, 기록, 수면 루틴처럼 머리를 식히는 장치를 일정에 넣으세요.",
                "결론을 바로 말하기 전에 확인 질문을 넣어 전달 속도를 낮추세요.",
                "맡을 일과 내려놓을 일을 나눠 역할 경계선을 정하세요.",
                "회복은 기분 문제가 아니라 오래 가기 위한 운영 장치로 다루세요.",
              ]
            : input.chapterId === "final_message"
              ? [
                  "오늘 대화 전에는 상대의 핵심을 한 문장으로 되받아 주세요.",
                  "일에서는 맡을 일과 내려놓을 일을 구분해 담당 경계선을 먼저 정하세요.",
                  "돈은 쓰는 계좌와 지키는 계좌를 나누고 작은 방어 규칙 하나를 고정하세요.",
                  "회복은 밤 산책, 수면, 기록처럼 일정에 박아 두세요.",
                ]
              : [
                  "결론을 바로 말하기 전에 질문을 먼저 넣으세요.",
                  "책임 범위를 문장으로 정리하세요.",
                  "쉬는 시간을 일정에 먼저 넣으세요.",
                ];

  return {
    chapterId: input.chapterId,
    titleKo: input.titleKo,
    headline: `${input.titleKo}는 ${primaryTerm}을 먼저 놓고 읽습니다.`,
    hitReadingLines,
    body: `${commonBody} ${topicExtra}`,
    solutionLines,
    keyPhrases: [input.titleKo, primaryTerm, input.mbtiType],
    sajuTermsUsed: [primaryTerm],
    mbtiTermsUsed: [input.mbtiType],
  };
}

function buildLongformReading(input: {
  readonly readingId: ComprehensiveReportV2LongformReadingId;
  readonly packet: ComprehensiveReportEvidencePacket;
  readonly mbtiType: string;
  readonly featureOffset: number;
}): NonNullable<ComprehensiveReportV2Draft["longformReadings"]>[number] {
  const sajuTerms = getPrimarySajuTerms(input.packet);
  const primaryTerm = getSelectedSajuTerm({
    packet: input.packet,
    offset: input.featureOffset,
    fallback: sajuTerms[0] ?? "원국 구조",
  });
  const titleMap = {
    opening: "처음에 보이는 결",
    baseSajuReading: "사주 원국의 기본 형상",
    sajuFeatureReading: "신살·귀인·합충·지장간 해석",
    mbtiReading: "MBTI 성향이 드러나는 방식",
    sajuMbtiBridgeReading: "명리와 MBTI가 만나는 장면",
    workMoneyStudyReading: "일·돈·공부 장문 흐름",
    loveRelationshipReading: "연애와 관계 장문 흐름",
    peopleFamilyEnvironmentReading: "사람·가족·환경 장문 흐름",
    riskGrowthReading: "리스크와 성장 장문 흐름",
    finalMessage: "마지막 정리",
  } as const satisfies Record<ComprehensiveReportV2LongformReadingId, string>;
  const featureNarrative = buildFeatureNarrative({
    packet: input.packet,
    contextLabel: titleMap[input.readingId],
    offset: input.featureOffset,
  });
  const mbtiNarrative = buildMbtiNarrative({
    packet: input.packet,
    contextLabel: titleMap[input.readingId],
    offset: input.featureOffset,
  });
  const linkedChapterIds: readonly ComprehensiveReportV2ChapterId[] =
    input.readingId === "workMoneyStudyReading"
      ? ["work_money_study"]
      : input.readingId === "loveRelationshipReading"
        ? ["love_relationships"]
        : input.readingId === "peopleFamilyEnvironmentReading"
          ? ["people_family_environment"]
          : input.readingId === "riskGrowthReading"
            ? ["risk_and_growth"]
            : input.readingId === "finalMessage"
              ? ["final_message"]
              : ["saju_identity", "personality_pattern"];
  const sceneMap = {
    opening:
      "첫 장에서는 전체 구조를 빠르게 단정하지 않고, 원국의 이름들이 생활 속 선택 습관으로 어떻게 이어지는지 넓게 잡습니다.",
    baseSajuReading:
      "원국 장에서는 천간과 지지가 만든 기본 방향을 일 처리 속도, 돈을 다루는 방식, 관계에서 긴장을 푸는 방식으로 옮겨 읽습니다.",
    sajuFeatureReading:
      "명리 특징 장에서는 신살과 귀인, 합충과 지장간을 미신적 표식이 아니라 반복되는 반응 패턴과 회복 포인트로 바꿔 설명합니다.",
    mbtiReading:
      "MBTI 장에서는 성격 유형을 원인으로 삼지 않고, 같은 사주 구조가 어떤 판단 습관과 대화 방식으로 드러나는지 확인합니다.",
    sajuMbtiBridgeReading:
      "연결 장에서는 명리 신호와 MBTI topic trait가 만날 때 생기는 추진력, 표현 속도, 부담의 방향을 현실 언어로 묶습니다.",
    workMoneyStudyReading:
      "일과 돈, 공부 장에서는 기준을 빨리 세우는 장점이 프로젝트 운영과 수익 구조, 직무 학습에서 어떻게 쓰이는지 봅니다.",
    loveRelationshipReading:
      "관계 장에서는 해결책이 먼저 나오는 습관을 감정 확인, 약속 방식, 표현 온도와 함께 조절하는 법으로 읽습니다.",
    peopleFamilyEnvironmentReading:
      "사람과 가족, 환경 장에서는 역할을 정리하려는 힘이 가족 부탁, 팀 내 책임, 생활 공간의 피로와 어떻게 연결되는지 봅니다.",
    riskGrowthReading:
      "리스크 장에서는 겁을 주지 않고 반복 압박을 줄이는 운영법, 수면과 기록, 산책 같은 회복 장치를 중심에 둡니다.",
    finalMessage:
      "마지막 장에서는 더 강하게 밀어붙이라는 결론이 아니라 오래 쓰기 위한 질문, 기록, 경계선, 회복 루틴으로 정리합니다.",
  } as const satisfies Record<ComprehensiveReportV2LongformReadingId, string>;
  const executionMap = {
    opening:
      "오늘은 판단을 끝내기 전에 왜 그렇게 느꼈는지 한 문장을 남기는 것부터 시작하면 충분합니다.",
    baseSajuReading:
      "일정과 돈, 관계를 한 번에 해결하려 하지 말고 각각의 기준을 따로 적어야 구조가 흐려지지 않습니다.",
    sajuFeatureReading:
      "한자 이름을 외우는 대신 그 이름이 말투, 도움 요청, 역할 연결, 피로 누적으로 어떻게 나타나는지만 확인하세요.",
    mbtiReading:
      "효율과 목표 감각은 살리되 상대가 따라올 시간을 주는 질문을 넣어야 장점이 공격적으로 보이지 않습니다.",
    sajuMbtiBridgeReading:
      "명리 신호가 강하게 들어오는 장면에서는 MBTI식 추진력을 바로 키우기보다 기록과 확인 절차를 먼저 두세요.",
    workMoneyStudyReading:
      "프로젝트, 계좌, 공부 계획은 같은 종이에 두지 말고 역할과 숫자와 학습 목표를 분리해 관리하세요.",
    loveRelationshipReading:
      "관계에서는 해결책을 늦추는 연습이 필요하고, 감정 확인 문장 하나가 오래 가는 리듬을 만듭니다.",
    peopleFamilyEnvironmentReading:
      "가족과 팀 안에서는 내가 맡을 수 있는 범위를 먼저 말해야 책임이 호의에서 부담으로 바뀌지 않습니다.",
    riskGrowthReading:
      "성장은 더 버티는 쪽보다 멈추는 장치를 만드는 쪽에서 시작되고, 회복 시간을 일정에 먼저 넣어야 합니다.",
    finalMessage:
      "결국 이 리포트의 실행은 질문 하나, 기록 하나, 경계선 하나, 회복 루틴 하나로 충분히 시작할 수 있습니다.",
  } as const satisfies Record<ComprehensiveReportV2LongformReadingId, string>;

  return {
    readingId: input.readingId,
    titleKo: titleMap[input.readingId],
    body: [
      `${titleMap[input.readingId]}에서는 ${primaryTerm}을 먼저 놓고 명리 구조를 긴 호흡으로 읽습니다.`,
      featureNarrative,
      mbtiNarrative,
      sceneMap[input.readingId],
      executionMap[input.readingId],
    ].join(" "),
    linkedChapterIds,
    sajuTermsUsed: [primaryTerm],
    mbtiTermsUsed: [input.mbtiType],
  };
}

function buildLocalFallbackDraft(input: {
  readonly fixture: ReportQualityFixture;
  readonly packet: ComprehensiveReportEvidencePacket;
}): ComprehensiveReportV2Draft {
  const displayName = input.fixture.displayName ?? "";
  const sajuFeatureChapter = buildDeterministicSajuFeatureChapter(input.packet);

  if (sajuFeatureChapter === undefined) {
    throw new Error("SAJU_FEATURE_CHAPTER_UNAVAILABLE");
  }

  const chapters = [
    ["opening", "처음에 보이는 결"],
    ["saju_identity", "사주가 보여주는 기본 형상"],
    ["personality_pattern", "성격과 판단 패턴"],
    ["work_money_study", "일, 돈, 공부가 연결되는 방식"],
    ["love_relationships", "연애와 관계의 온도"],
    ["people_family_environment", "사람, 가족, 환경"],
    ["risk_and_growth", "반복되는 리스크와 성장법"],
    ["final_message", "마지막으로 남길 말"],
  ] as const satisfies readonly (readonly [ComprehensiveReportV2ChapterId, string])[];

  return {
    version: "comprehensive_v2_draft",
    productType: "saju_mbti_full",
    openingTitle: "사주 특징과 MBTI 행동 방식이 만나는 종합 리포트",
    openingSummary:
      "명리 구조를 먼저 읽고, 입력된 MBTI는 그 구조가 실제 행동으로 드러나는 방식을 설명하는 보조 언어로 사용합니다.",
    coreLine:
      "공통 만세력표는 근거이고, 신살·귀인·합충·지장간 해석과 MBTI 행동 장면이 본문을 이룹니다.",
    profileTable: buildComprehensiveReportV2ProfileTable({
      evidencePacket: input.packet,
      mbtiType: input.fixture.mbti,
    }),
    chapters: chapters.map(([chapterId, titleKo], index) =>
      buildLocalChapter({
        chapterId,
        titleKo,
        packet: input.packet,
        displayName,
        mbtiType: input.fixture.mbti,
        featureOffset: index,
      }),
    ),
    longformReadings: COMPREHENSIVE_REPORT_V2_LONGFORM_READING_IDS.map((readingId, index) =>
      buildLongformReading({
        readingId,
        packet: input.packet,
        mbtiType: input.fixture.mbti,
        featureOffset: index + chapters.length,
      }),
    ),
    sajuFeatureChapter,
    finalAdvice:
      "이 리포트는 특정 사건을 단정하지 않고, 원국 특징을 일·돈·관계·공부·회복의 운영 기준으로 바꾸는 데 목적이 있습니다. 오늘부터는 결론보다 질문을 먼저 두고, 돈과 일정은 기록으로 나누며, 회복 시간을 성과를 지키는 장치로 고정해 보세요.",
    safetyNotes: ["자기이해와 생활 점검을 위한 참고 콘텐츠입니다."],
  };
}

function validateLocalDraft(input: {
  readonly draft: ComprehensiveReportV2Draft;
  readonly packet: ComprehensiveReportEvidencePacket;
  readonly mbtiType: string;
}): readonly string[] {
  const validation = validateComprehensiveReportDraft(input.draft, {
    allowedSajuTerms: deriveAllowedSajuTermsFromEvidencePacket(input.packet),
    allowedMbtiTerms: [input.mbtiType],
  });

  if (!validation.ok) {
    throw new Error(
      `LOCAL_COMPREHENSIVE_DRAFT_INVALID\n${validation.errors.join("\n")}`,
    );
  }

  return validation.warnings ?? [];
}

async function writePreviewSnapshot(input: {
  readonly fixtureId: string;
  readonly draft: ComprehensiveReportV2Draft;
  readonly evidencePacket: ComprehensiveReportEvidencePacket;
}): Promise<string> {
  await mkdir(comprehensivePreviewSnapshotDir, { recursive: true });
  const relativePath = getPreviewSnapshotRelativePath(input.fixtureId);

  await writeFile(
    join(process.cwd(), relativePath),
    `${JSON.stringify(
      {
        fixtureId: input.fixtureId,
        generatedAt: new Date().toISOString(),
        draft: input.draft,
        evidencePacket: input.evidencePacket,
      },
      null,
      2,
    )}\n`,
    "utf8",
  );

  return relativePath;
}

function summarizeDraftResult(input: {
  readonly draft: ComprehensiveReportV2Draft;
  readonly warnings: readonly string[];
}): {
  readonly draftVersion: string;
  readonly productType: string;
  readonly chapterCount: number;
  readonly coreLine: string;
  readonly firstChapterTitle: string;
  readonly warnings: readonly string[];
} {
  return {
    draftVersion: input.draft.version,
    productType: input.draft.productType,
    chapterCount: input.draft.chapters.length,
    coreLine: input.draft.coreLine,
    firstChapterTitle: input.draft.chapters[0]?.titleKo ?? "none",
    warnings: input.warnings,
  };
}

async function generateLocalFixtureDraft(input: {
  readonly fixture: ReportQualityFixture;
  readonly writePreview: boolean;
}): Promise<ReturnType<typeof summarizeDraftResult>> {
  const { packet, mappedFeatures } = buildComprehensiveReportEvidencePacketFromComputedFacts({
    mbtiType: input.fixture.mbti,
    sajuFacts: input.fixture.sajuFacts,
  });
  writeSafeSajuFeatureDebug({
    computedFeatureIds: mappedFeatures.featureIds,
    selectedEvidence: packet.selectedSajuFeatureEvidence,
    sajuFeatureSpotlight: packet.sajuFeatureSpotlight,
    sajuSignatureScenes: packet.sajuSignatureScenes,
  });
  const draft = buildLocalFallbackDraft({ fixture: input.fixture, packet });
  const warnings = validateLocalDraft({
    draft,
    packet,
    mbtiType: input.fixture.mbti,
  });

  if (input.writePreview) {
    const snapshotPath = await writePreviewSnapshot({
      fixtureId: input.fixture.id,
      draft,
      evidencePacket: packet,
    });
    writeStatus("preview snapshot written:");
    writeStatus(snapshotPath);
    writeStatus(`snapshot: ${snapshotPath}`);
  }

  return summarizeDraftResult({ draft, warnings });
}

async function generateFixtureDraft(input: {
  readonly fixture: ReportQualityFixture;
  readonly apiKey: string;
  readonly model: string;
  readonly writePreview: boolean;
}): Promise<{
  readonly draftVersion: string;
  readonly productType: string;
  readonly chapterCount: number;
  readonly coreLine: string;
  readonly firstChapterTitle: string;
  readonly warnings: readonly string[];
}> {
  const fixture = input.fixture;
  const { packet, mappedFeatures } = buildComprehensiveReportEvidencePacketFromComputedFacts({
    mbtiType: fixture.mbti,
    sajuFacts: fixture.sajuFacts,
  });
  writeSafeSajuFeatureDebug({
    computedFeatureIds: mappedFeatures.featureIds,
    selectedEvidence: packet.selectedSajuFeatureEvidence,
    sajuFeatureSpotlight: packet.sajuFeatureSpotlight,
    sajuSignatureScenes: packet.sajuSignatureScenes,
  });
  const allowedSajuTerms = deriveAllowedSajuTermsFromEvidencePacket(packet);
  const userDisplayName = fixture.displayName ?? fixture.label;
  const messages = buildOpenAIComprehensiveReportWriterMessages({
    userDisplayName,
    mbtiType: fixture.mbti,
    evidencePacket: packet,
    allowedSajuTerms,
  });

  writeOpenAIRequestDebug({
    model: input.model,
    promptChars: messages.system.length + messages.developer.length + messages.user.length,
  });

  const result = await generateComprehensiveReportDraft({
    userDisplayName,
    mbtiType: fixture.mbti,
    evidencePacket: packet,
    config: {
      apiKey: input.apiKey,
      model: input.model,
      enabled: true,
    },
  });
  const firstChapter = isComprehensiveReportV2Draft(result.draft)
    ? result.draft.chapters[0]
    : result.draft.sections[0];

  if (input.writePreview && isComprehensiveReportV2Draft(result.draft)) {
    const snapshotPath = await writePreviewSnapshot({
      fixtureId: fixture.id,
      draft: result.draft,
      evidencePacket: packet,
    });
    writeStatus("preview snapshot written:");
    writeStatus(snapshotPath);
    writeStatus(`snapshot: ${snapshotPath}`);
  }

  return {
    draftVersion: result.draft.version,
    productType: result.draft.productType,
    chapterCount:
      isComprehensiveReportV2Draft(result.draft)
        ? result.draft.chapters.length
        : result.draft.sections.length,
    coreLine: result.draft.coreLine,
    firstChapterTitle: firstChapter?.titleKo ?? "none",
    warnings: result.warnings,
  };
}

async function run(): Promise<void> {
  const args = process.argv.slice(2);
  const writePreview = shouldWritePreview(args);
  const fixtureMatrixMode = getReportSmokeFixtureMatrixModeFromArgs(args);

  if (fixtureMatrixMode === "sample") {
    const fixtures = getReportQualitySmokeSampleFixtures();
    writeStatus("quality matrix smoke: sample");
    writeStatus(`fixtures: ${fixtures.length}`);

    if (shouldSkipSmoke() || getEnvValue("OPENAI_REPORT_WRITER_ENABLED") !== "1") {
      for (const fixture of fixtures) {
        const result = await generateLocalFixtureDraft({
          fixture,
          writePreview: false,
        });
        writeFixtureQualitySummary({
          fixture,
          status: "PASS",
          warningsCount: result.warnings.length,
        });
      }
      writeStatus("writer disabled: used local deterministic draft builder.");
      return;
    }

    const apiKey = getEnvValue("OPENAI_API_KEY");
    const model = getEnvValue("OPENAI_REPORT_MODEL");

    if (apiKey === undefined || model === undefined) {
      for (const fixture of fixtures) {
        const result = await generateLocalFixtureDraft({
          fixture,
          writePreview: false,
        });
        writeFixtureQualitySummary({
          fixture,
          status: "PASS",
          warningsCount: result.warnings.length,
        });
      }
      writeStatus("writer config incomplete: used local deterministic draft builder.");
      return;
    }

    for (const fixture of fixtures) {
      const result = await generateFixtureDraft({
        fixture,
        apiKey,
        model,
        writePreview: false,
      });
      writeFixtureQualitySummary({
        fixture,
        status: "PASS",
        warningsCount: result.warnings.length,
      });
    }
    writeStatus("done");
    return;
  }

  const fixture = getReportSmokeFixture(getReportSmokeFixtureIdFromArgs(args));

  writeStatus(`report fixture: ${fixture.id}`);

  if (shouldSkipSmoke() || getEnvValue("OPENAI_REPORT_WRITER_ENABLED") !== "1") {
    writeStatus("writer disabled: using local deterministic draft builder.");
    const result = await generateLocalFixtureDraft({ fixture, writePreview });

    writeStatus(`draft version: ${result.draftVersion}`);
    writeStatus(`product type: ${result.productType}`);
    writeStatus(`chapters: ${result.chapterCount}`);
    writeStatus(`core line: ${result.coreLine}`);
    writeStatus(`first chapter: ${result.firstChapterTitle}`);
    if (result.warnings.length > 0) {
      writeStatus("warnings:");
      for (const warning of result.warnings) {
        writeStatus(`- ${warning}`);
      }
    }
    writeStatus("done");
    return;
  }

  const apiKey = getEnvValue("OPENAI_API_KEY");
  const model = getEnvValue("OPENAI_REPORT_MODEL");

  if (apiKey === undefined || model === undefined) {
    writeStatus("writer config incomplete: using local deterministic draft builder.");
    const result = await generateLocalFixtureDraft({ fixture, writePreview });

    writeStatus(`draft version: ${result.draftVersion}`);
    writeStatus(`product type: ${result.productType}`);
    writeStatus(`chapters: ${result.chapterCount}`);
    writeStatus(`core line: ${result.coreLine}`);
    writeStatus(`first chapter: ${result.firstChapterTitle}`);
    if (result.warnings.length > 0) {
      writeStatus("warnings:");
      for (const warning of result.warnings) {
        writeStatus(`- ${warning}`);
      }
    }
    writeStatus("done");
    return;
  }

  writeStatus("start");
  const result = await generateFixtureDraft({
    fixture,
    apiKey,
    model,
    writePreview,
  });

  writeStatus(`draft version: ${result.draftVersion}`);
  writeStatus(`product type: ${result.productType}`);
  writeStatus(`chapters: ${result.chapterCount}`);
  writeStatus(`core line: ${result.coreLine}`);
  writeStatus(`first chapter: ${result.firstChapterTitle}`);
  for (const warning of result.warnings) {
    if (warning.startsWith("quality repair:")) {
      writeStatus(warning);
    }
  }
  const contentWarnings = result.warnings.filter(
    (warning) => !warning.startsWith("quality repair:"),
  );

  if (contentWarnings.length > 0) {
    writeStatus("warnings:");
    for (const warning of contentWarnings) {
      writeStatus(`- ${warning}`);
    }
  }
  writeStatus("done");
}

run().catch((error: unknown) => {
  writeSafeFailure(error);
  process.exitCode = 1;
});
