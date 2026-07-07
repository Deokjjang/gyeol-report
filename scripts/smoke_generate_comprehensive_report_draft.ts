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
  type ComprehensiveReportV2PillarGridColumn,
  type ComprehensiveReportV2ProfileTable,
} from "../src/lib/report-generation/comprehensiveReportDraftTypes";
import { comprehensiveReportDraftJsonSchema } from "../src/lib/report-generation/comprehensiveReportDraftSchema";
import { buildComprehensiveReportV2ProfileTable } from "../src/lib/report-generation/comprehensiveReportProfileTableBuilder";
import { validateComprehensiveReportDraft } from "../src/lib/report-generation/comprehensiveReportDraftValidator";
import {
  buildOpenAIComprehensiveReportWriterMessages,
  deriveAllowedSajuTermsFromEvidencePacket,
} from "../src/lib/report-generation/openaiReportWriterPrompt";
import { buildCareerReportEvidence } from "../src/lib/report-knowledge/careerReportEvidence";
import { requireCareerReportFixture } from "../src/lib/report-knowledge/careerReportFixtures";
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
  type ReportSmokeFixtureId,
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
type ComprehensiveFeatureDictionaryEntry = NonNullable<
  ComprehensiveReportEvidencePacket["sajuFeatureDictionary"]
>[number];

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

function hasExplicitFixtureArg(argv: readonly string[]): boolean {
  return argv.some((arg) => arg === "--fixture" || arg.startsWith("--fixture="));
}

function getComprehensivePreviewSmokeFixtureIdFromArgs(
  argv: readonly string[],
): ReportSmokeFixtureId {
  if (hasExplicitFixtureArg(argv)) {
    return getReportSmokeFixtureIdFromArgs(argv);
  }

  return "deokmin";
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

function getPrimarySajuTerms(input: {
  readonly packet: ComprehensiveReportEvidencePacket;
  readonly allowedSajuTerms?: ReadonlySet<string>;
}): readonly string[] {
  const featureTerms =
    input.packet.sajuFeatureDictionary
      ?.map((entry) => entry.rawLabel)
      .filter((value) =>
        input.allowedSajuTerms === undefined ||
        input.allowedSajuTerms.has(value) ||
        isStructuralSajuFeatureLabel(value),
      )
      .filter((value) => value.trim().length > 0) ?? [];

  return [
    ...new Set(
      [
        ...featureTerms,
        input.packet.sajuFeatureSpotlight?.groups[0]?.items[0]?.labelKo,
      ].filter((value): value is string => value !== undefined),
    ),
  ].slice(0, 4);
}

function getContextualFeatureKeywords(
  contextId: ComprehensiveReportV2ChapterId | ComprehensiveReportV2LongformReadingId,
): readonly string[] {
  if (contextId === "work_money_study" || contextId === "workMoneyStudyReading") {
    return [
      "재고귀인",
      "편재",
      "정재",
      "편관",
      "정관",
      "식신",
      "상관",
      "문창",
      "문곡",
      "천문성",
      "무식상",
      "무인성",
    ];
  }
  if (contextId === "love_relationships" || contextId === "loveRelationshipReading") {
    return ["현침", "합", "해", "천을귀인"];
  }
  if (
    contextId === "people_family_environment" ||
    contextId === "peopleFamilyEnvironmentReading"
  ) {
    return [
      "천을귀인",
      "비견",
      "겁재",
      "역마",
      "장성살",
      "암록",
      "편관",
      "정관",
      "망신살",
      "지살",
    ];
  }
  if (contextId === "risk_and_growth" || contextId === "riskGrowthReading") {
    return [
      "귀문",
      "현침",
      "원진",
      "형",
      "충",
      "파",
      "해",
      "토 과다",
      "수 부족",
      "화 부족",
      "무식상",
      "무인성",
    ];
  }
  if (contextId === "saju_identity" || contextId === "baseSajuReading") {
    return ["갑신일주", "토 과다", "편관", "정관", "편재", "정재"];
  }
  if (contextId === "personality_pattern" || contextId === "mbtiReading") {
    return ["현침", "갑신일주", "편관", "정관", "귀문"];
  }
  if (contextId === "sajuFeatureReading") {
    return ["현침", "천을귀인", "귀문", "지장간"];
  }
  if (contextId === "sajuMbtiBridgeReading") {
    return ["현침", "재고귀인", "편관", "갑신일주"];
  }

  return ["천을귀인", "갑신일주", "현침", "재고귀인"];
}

function hasKoreanFinalConsonant(value: string): boolean {
  const lastChar = [...value.trim()].at(-1);

  if (lastChar === undefined) {
    return false;
  }

  const code = lastChar.charCodeAt(0);

  return code >= 0xac00 && code <= 0xd7a3 && (code - 0xac00) % 28 !== 0;
}

function withTopicParticle(value: string): string {
  return `${value}${hasKoreanFinalConsonant(value) ? "은" : "는"}`;
}

function stripSentenceEnd(value: string): string {
  return cleanKoreanParticleRegression(value).trim().replace(/[.。!?]+$/u, "");
}

function cleanKoreanParticleRegression(value: string): string {
  return value
    .replaceAll("정재" + "을", "정재를")
    .replaceAll("편재" + "을", "편재를")
    .replaceAll("토 과다" + "을", "토 과다를")
    .replaceAll("토 과다" + "은", "토 과다는")
    .replaceAll("편재" + "이", "편재가")
    .replaceAll("화개" + "은", "화개는")
    .replaceAll("편재은", "편재는")
    .replaceAll("정재은", "정재는")
    .replaceAll("갑신일주을", "갑신일주를")
    .replaceAll("갑신일주" + "이", "갑신일주가")
    .replaceAll("갑신일주은", "갑신일주는")
    .replaceAll("마지막 정리" + "은", "마지막 정리는")
    .replaceAll("사람, 가족, 환경" + "는", "사람, 가족, 환경은")
    .replaceAll("나타납니다" + "로 나타납니다", "나타납니다")
    .replaceAll("나타납니다" + "로", "나타납니다")
    .replaceAll("입니다로 나타납니다", "입니다")
    .replaceAll("습니다로 나타납니다", "습니다")
    .replaceAll("합니다 " + "그래서", "합니다. 그래서")
    .replaceAll("장면. " + "강점으로", "장면입니다. 강점으로")
    .replaceAll("살아납니다 " + "쪽", "살아나는 방향")
    .replaceAll("조심해야 합니다 " + "쪽", "조심해야 하는 방향")
    .replaceAll("느낍니다가", "느끼는 흐름이")
    .replaceAll("잘 쓰면 잘 쓰면", "잘 쓰면")
    .replace(/([가-힣A-Za-z0-9·]+은)\s+\1\s+/gu, "$1 ");
}

function sentence(value: string): string {
  const trimmed = cleanKoreanParticleRegression(value).trim();

  return /[.。!?]$/u.test(trimmed) ? trimmed : `${trimmed}.`;
}

function uniqueTextValues(values: readonly string[]): readonly string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function getSajuFeatureCategoryLabel(
  entry: ComprehensiveFeatureDictionaryEntry | undefined,
  rawLabel: string,
): string {
  if (rawLabel.includes("일주")) {
    return "일주 구조";
  }
  if (
    rawLabel.includes("과다") ||
    rawLabel.includes("부족") ||
    rawLabel.includes("오행")
  ) {
    return "오행 구조";
  }
  if (
    rawLabel.includes("무식상") ||
    rawLabel.includes("무인성") ||
    rawLabel.includes("재다신약")
  ) {
    return "구조 판단";
  }
  if (
    rawLabel.includes("비견") ||
    rawLabel.includes("겁재") ||
    rawLabel.includes("식신") ||
    rawLabel.includes("상관") ||
    rawLabel.includes("편재") ||
    rawLabel.includes("정재") ||
    rawLabel.includes("편관") ||
    rawLabel.includes("정관") ||
    rawLabel.includes("편인") ||
    rawLabel.includes("정인")
  ) {
    return "십성 구조";
  }
  if (rawLabel.includes("지장간")) {
    return "지장간";
  }
  if (
    rawLabel.includes("합") ||
    rawLabel.includes("충") ||
    rawLabel.includes("형") ||
    rawLabel.includes("파") ||
    rawLabel.includes("해")
  ) {
    return "합충형파해";
  }
  if (
    rawLabel.includes("살") ||
    rawLabel.includes("귀인") ||
    rawLabel.includes("암록") ||
    rawLabel.includes("화개")
  ) {
    return "신살·귀인";
  }

  if (entry?.category === "hidden_stem") {
    return "지장간";
  }
  if (entry?.category === "relation") {
    return "합충형파해";
  }

  return "구조 판단";
}

function isStructuralSajuFeatureLabel(rawLabel: string): boolean {
  return (
    rawLabel.includes("일주") ||
    rawLabel.includes("과다") ||
    rawLabel.includes("부족") ||
    rawLabel.includes("무식상") ||
    rawLabel.includes("무인성") ||
    rawLabel.includes("재다신약") ||
    rawLabel.includes("편재") ||
    rawLabel.includes("정재") ||
    rawLabel.includes("편관") ||
    rawLabel.includes("정관") ||
    rawLabel.includes("비견") ||
    rawLabel.includes("겁재") ||
    rawLabel.includes("식신") ||
    rawLabel.includes("상관") ||
    rawLabel.includes("편인") ||
    rawLabel.includes("정인")
  );
}

function isEvidenceBoundVisibleFeature(input: {
  readonly rawLabel: string;
  readonly allowedSajuTerms: ReadonlySet<string>;
}): boolean {
  return input.allowedSajuTerms.has(input.rawLabel) || isStructuralSajuFeatureLabel(input.rawLabel);
}

function getFeatureOneLineSummary(rawLabel: string): string {
  if (rawLabel.includes("재고귀인")) {
    return "이 표식은 돈이 저절로 쌓인다는 뜻이 아니라, 들어온 자원이 새지 않게 구조화하라는 뜻입니다.";
  }
  if (
    rawLabel.includes("천을귀인") ||
    rawLabel.includes("월덕귀인") ||
    rawLabel.includes("천덕귀인")
  ) {
    return "이 표식은 누군가 대신 해결해 준다는 뜻이 아니라, 도움을 요청할 통로를 미리 열어 두라는 뜻입니다.";
  }
  if (rawLabel.includes("현침")) {
    return "당신에게 현침살은 말을 줄이라는 신호가 아니라, 말의 순서를 바꾸라는 신호입니다.";
  }
  if (rawLabel.includes("망신")) {
    return "망신살은 실패 예고가 아니라, 사람 앞에서 드러나는 장면을 더 정교하게 관리하라는 표식입니다.";
  }
  if (rawLabel.includes("장성")) {
    return "장성살은 앞에 서라는 압박이 아니라, 책임과 권한의 범위를 함께 정하라는 표식입니다.";
  }
  if (rawLabel.includes("백호")) {
    return "백호대살은 위험을 예고하는 말이 아니라, 강한 돌파력을 어디에 쓸지 정하라는 표식입니다.";
  }
  if (rawLabel.includes("반안")) {
    return "반안살은 체면을 세우라는 말이 아니라, 인정받는 자리에서 기준을 잃지 말라는 표식입니다.";
  }
  if (rawLabel.includes("겁살")) {
    return "겁살은 빼앗김을 단정하는 말이 아니라, 급한 선택에서 경계선을 세우라는 표식입니다.";
  }
  if (rawLabel.includes("화개")) {
    return "화개는 고립을 뜻하기보다, 혼자 깊게 정리할 시간이 있어야 빛나는 구조를 말합니다.";
  }
  if (rawLabel.includes("갑신일주")) {
    return "갑신일주는 빠른 판단을 자랑하라는 뜻이 아니라, 선명한 기준을 다듬어 쓰라는 구조입니다.";
  }
  if (rawLabel.includes("토 과다")) {
    return "토 과다는 버티라는 말이 아니라, 맡을 범위와 쉬는 기준을 먼저 정하라는 구조입니다.";
  }
  if (rawLabel.includes("수 부족")) {
    return "수 부족은 감정이 없다는 뜻이 아니라, 쉬고 흘려보내는 루틴을 의식적으로 만들어야 한다는 신호입니다.";
  }
  if (rawLabel.includes("화 부족")) {
    return "화 부족은 표현이 불가능하다는 뜻이 아니라, 온도와 칭찬을 의도적으로 보태야 한다는 신호입니다.";
  }
  if (rawLabel.includes("무식상")) {
    return "무식상은 결과물이 없다는 뜻이 아니라, 머릿속 기준을 보이는 산출물로 꺼내는 연습이 필요하다는 구조입니다.";
  }
  if (rawLabel.includes("재다신약")) {
    return "재다신약은 돈을 못 다룬다는 말이 아니라, 자원과 책임이 커질수록 방어 규칙부터 세워야 한다는 구조입니다.";
  }
  if (rawLabel.includes("지장간")) {
    return "지장간은 겉으로 보이는 기운 안쪽에 숨어 있는 역할과 회복 포인트를 보라는 뜻입니다.";
  }
  if (
    rawLabel.includes("합") ||
    rawLabel.includes("충") ||
    rawLabel.includes("형") ||
    rawLabel.includes("파") ||
    rawLabel.includes("해")
  ) {
    return "이 표식은 좋고 나쁨보다 관계, 일, 생활 리듬에서 어디를 다시 맞춰야 하는지 보라는 뜻입니다.";
  }

  return "이 표식은 운명을 단정하는 말이 아니라, 반복되는 선택 습관을 다루는 기준입니다.";
}

function getSelectedSajuFeatureEntry(input: {
  readonly packet: ComprehensiveReportEvidencePacket;
  readonly offset: number;
  readonly contextId: ComprehensiveReportV2ChapterId | ComprehensiveReportV2LongformReadingId;
  readonly allowedSajuTerms?: ReadonlySet<string>;
}) {
  const entries = (input.packet.sajuFeatureDictionary ?? []).filter((entry) =>
    input.allowedSajuTerms === undefined ||
    isEvidenceBoundVisibleFeature({
      rawLabel: entry.rawLabel,
      allowedSajuTerms: input.allowedSajuTerms,
    }),
  );
  const keywords = getContextualFeatureKeywords(input.contextId);
  const candidates = entries.filter((entry) =>
    keywords.some((keyword) => entry.rawLabel.includes(keyword)),
  );
  const pool = candidates.length > 0 ? candidates : entries;

  return pool[input.offset % Math.max(pool.length, 1)];
}

function getSelectedSajuTerm(input: {
  readonly packet: ComprehensiveReportEvidencePacket;
  readonly offset: number;
  readonly fallback: string;
  readonly contextId: ComprehensiveReportV2ChapterId | ComprehensiveReportV2LongformReadingId;
  readonly allowedSajuTerms?: ReadonlySet<string>;
}): string {
  return (
    getSelectedSajuFeatureEntry({
      packet: input.packet,
      offset: input.offset,
      contextId: input.contextId,
      allowedSajuTerms: input.allowedSajuTerms,
    })?.rawLabel ?? input.fallback
  );
}

function buildFeatureNarrative(input: {
  readonly packet: ComprehensiveReportEvidencePacket;
  readonly contextLabel: string;
  readonly offset: number;
  readonly contextId: ComprehensiveReportV2ChapterId | ComprehensiveReportV2LongformReadingId;
  readonly allowedSajuTerms?: ReadonlySet<string>;
}): string {
  const entry = getSelectedSajuFeatureEntry({
    packet: input.packet,
    offset: input.offset,
    contextId: input.contextId,
    allowedSajuTerms: input.allowedSajuTerms,
  });

  if (entry === undefined) {
    return `${input.contextLabel}은 원국 이름을 늘어놓는 대신 판단 속도, 관계 반응, 일 처리 리듬이 실제 선택에서 어떻게 바뀌는지 설명합니다.`;
  }
  const categoryLabel = getSajuFeatureCategoryLabel(entry, entry.rawLabel);
  const howItShowsInYou = stripSentenceEnd(entry.howItShowsInYou);

  return [
    sentence(
      stripSentenceEnd(entry.plainMeaning).startsWith(entry.rawLabel)
        ? stripSentenceEnd(entry.plainMeaning)
        : `${categoryLabel}인 ${withTopicParticle(entry.rawLabel)} ${stripSentenceEnd(entry.plainMeaning)}`,
    ),
    sentence(
      howItShowsInYou.endsWith("장면")
        ? `${input.contextLabel}에서는 ${howItShowsInYou}으로 드러납니다`
        : `${input.contextLabel}에서 ${howItShowsInYou}`,
    ),
    sentence(`강점은 ${stripSentenceEnd(entry.strength)}`),
    sentence(stripSentenceEnd(entry.fatiguePoint)),
    sentence(stripSentenceEnd(entry.practicalUse)),
    sentence(
      `${input.contextLabel}에서는 ${getFeatureOneLineSummary(entry.rawLabel)}`,
    ),
  ]
    .filter((value) => value.trim().length > 0)
    .join(" ");
}

function buildMbtiNarrative(input: {
  readonly packet: ComprehensiveReportEvidencePacket;
  readonly contextLabel: string;
  readonly contextId: ComprehensiveReportV2ChapterId | ComprehensiveReportV2LongformReadingId;
  readonly offset: number;
  readonly allowedSajuTerms?: ReadonlySet<string>;
}): string {
  return getIntegratedMbtiCopy({
    contextId: input.contextId,
    mbtiType: input.packet.mbtiBasis?.type ?? "ENTJ",
  });
}

function getIntegratedMbtiCopy(input: {
  readonly contextId: ComprehensiveReportV2ChapterId | ComprehensiveReportV2LongformReadingId;
  readonly mbtiType: string;
}): string {
  if (input.contextId === "work_money_study" || input.contextId === "workMoneyStudyReading") {
    return `${input.mbtiType}식 목표 감각이 재성과 관성의 현실 감각과 만나면 돈이 되는 판과 책임질 판을 빨리 구분합니다. 대신 계약, 정산일, 비용 상한선을 적지 않으면 실행력이 곧 부담으로 바뀝니다.`;
  }
  if (input.contextId === "love_relationships" || input.contextId === "loveRelationshipReading") {
    return `현침살의 예리함이 ${input.mbtiType}의 빠른 결론 성향과 겹치면, 당신은 조언을 해준다고 생각하지만 상대는 평가받는다고 느낄 수 있습니다. 관계에서는 맞는 말을 고르는 것보다 말이 들어갈 순서를 잡는 일이 더 중요합니다.`;
  }
  if (
    input.contextId === "people_family_environment" ||
    input.contextId === "peopleFamilyEnvironmentReading"
  ) {
    return `장성살과 귀인의 흐름에 ${input.mbtiType}의 역할 정리 감각이 붙으면 주변이 기대는 사람이 되기 쉽습니다. 다만 부탁을 받는 즉시 해결 모드로 들어가면 호의가 의무로 굳어집니다.`;
  }
  if (input.contextId === "risk_and_growth" || input.contextId === "riskGrowthReading") {
    return `토가 강하고 ${input.mbtiType}식 책임감이 겹치면 맡은 일은 끝까지 끌고 갑니다. 문제는 쉬는 기준을 늘 뒤로 미루기 때문에, 회복을 기분이 아니라 운영 규칙으로 넣어야 한다는 점입니다.`;
  }
  if (input.contextId === "sajuMbtiBridgeReading") {
    return `명리 구조와 ${input.mbtiType} 행동 패턴은 따로 움직이지 않습니다. 예리하게 보는 힘은 기준을 만들고, 기준을 만드는 힘은 사람과 일을 움직이는 방식으로 드러납니다.`;
  }
  if (input.contextId === "opening") {
    return `현침살과 ${input.mbtiType}의 결론 처리 방식이 만나면 첫 반응이 빠르게 정리됩니다. 이 속도는 회의와 문제 해결에서는 장점이지만, 가까운 대화에서는 상대가 따라올 시간을 남겨야 합니다.`;
  }
  if (input.contextId === "saju_identity") {
    return `갑신일주의 압박 속 판단력에 ${input.mbtiType}의 목표 감각이 붙으면 방향을 빨리 세웁니다. 다만 토가 강한 구조라 맡은 일을 오래 붙잡는 만큼 회복 기준을 따로 잡아야 합니다.`;
  }
  if (input.contextId === "personality_pattern") {
    return `현침살은 오류를 빨리 보게 만들고 ${input.mbtiType}의 실행 감각은 그 오류를 바로 고치고 싶게 만듭니다. 그래서 성격 설명보다 말이 나가는 순서가 더 중요합니다.`;
  }

  return `현침살의 예리함과 ${input.mbtiType}의 빠른 결론 성향이 겹치면, 당신은 틀린 구조를 그냥 넘기기 어렵습니다. 이 힘은 일에서는 기획력과 디버깅 감각으로 살아나지만, 관계에서는 말이 너무 빨리 꽂힐 수 있습니다.`;
}

function getChapterHeadline(input: {
  readonly chapterId: ComprehensiveReportV2ChapterId;
  readonly titleKo: string;
  readonly primaryTerm: string;
}): string {
  if (input.chapterId === "opening") {
    return `${input.primaryTerm}을 출발점으로 전체 결을 먼저 잡습니다.`;
  }
  if (input.chapterId === "saju_identity") {
    return "일간과 일주, 오행의 균형이 이 사람의 기본 골격을 만듭니다.";
  }
  if (input.chapterId === "personality_pattern") {
    return "판단이 빠른 이유를 성격 설명이 아니라 원국의 작동 방식으로 봅니다.";
  }
  if (input.chapterId === "work_money_study") {
    return "일·돈·공부는 판을 키우기 전에 구조를 잠글 때 살아납니다.";
  }
  if (input.chapterId === "love_relationships") {
    return "관계에서는 해결 속도보다 말의 온도와 확인 방식이 중요합니다.";
  }
  if (input.chapterId === "people_family_environment") {
    return "사람과 환경에서는 맡을 범위를 정해야 책임이 오래 갑니다.";
  }
  if (input.chapterId === "risk_and_growth") {
    return "반복 리스크는 겁낼 일이 아니라 운영법으로 바꿀 신호입니다.";
  }
  if (input.chapterId === "final_message") {
    return "마지막 기준은 더 세게 밀기보다 오래 가는 장치를 만드는 일입니다.";
  }

  return `${input.titleKo}의 핵심을 실제 선택 기준으로 정리합니다.`;
}

function buildLocalChapter(input: {
  readonly chapterId: ComprehensiveReportV2ChapterId;
  readonly titleKo: string;
  readonly packet: ComprehensiveReportEvidencePacket;
  readonly displayName: string;
  readonly mbtiType: string;
  readonly featureOffset: number;
  readonly allowedSajuTerms: ReadonlySet<string>;
}): ComprehensiveReportV2Draft["chapters"][number] {
  const sajuTerms = getPrimarySajuTerms({
    packet: input.packet,
    allowedSajuTerms: input.allowedSajuTerms,
  });
  const primaryTerm = getSelectedSajuTerm({
    packet: input.packet,
    offset: input.featureOffset,
    fallback: sajuTerms[0] ?? "원국 구조",
    contextId: input.chapterId,
    allowedSajuTerms: input.allowedSajuTerms,
  });
  const featureNarrative = buildFeatureNarrative({
    packet: input.packet,
    contextLabel: input.titleKo,
    offset: input.featureOffset,
    contextId: input.chapterId,
    allowedSajuTerms: input.allowedSajuTerms,
  });
  const mbtiNarrative = buildMbtiNarrative({
    packet: input.packet,
    contextLabel: input.titleKo,
    contextId: input.chapterId,
    offset: input.featureOffset,
    allowedSajuTerms: input.allowedSajuTerms,
  });
  const commonBody =
    `${primaryTerm}은 ${input.titleKo}에서 말투, 선택 속도, 관계 반응으로 드러납니다. ${featureNarrative}\n\n${mbtiNarrative} ${primaryTerm}의 빠른 판단과 ${input.mbtiType}의 목표 지향성이 겹치면 핵심을 빨리 잡지만, 상대에게는 평가처럼 들릴 수 있어 질문을 먼저 놓는 장치가 필요합니다.`;
  const topicExtra =
    input.chapterId === "work_money_study"
      ? "직업과 돈, 공부에서는 외부 기회보다 기록과 구조가 먼저입니다. 자격증이나 전문서를 볼 때도 왜 써먹는지가 보이면 집중이 붙고, 돈은 벌 계획보다 계좌 분리와 방어 규칙이 없을 때 더 빨리 새기 쉽습니다. 이 흐름은 서비스 기획, 개발, 프로젝트 운영처럼 기준과 결과물이 필요한 일에서 현실감 있게 읽힙니다."
      : input.chapterId === "love_relationships"
        ? "연애와 관계에서는 호감이 있어도 따뜻한 말보다 해결책이 먼저 나갈 수 있습니다. 카톡에서 연인이 서운함을 말할 때 바로 다음 행동을 주기보다 마음을 한 문장으로 받아야 합니다. MBTI는 궁합 단정 기준이 아니라 관계에서 필요한 대화 속도, 표현 온도, 약속 습관을 보는 보조 지표로만 써야 합니다."
        : input.chapterId === "people_family_environment"
          ? "사람과 가족, 환경의 문제에서는 역할이 흐릴 때 본인이 먼저 정리하려는 힘이 커집니다. 가족 부탁이나 팀 역할 분담에서 해결을 떠안기 전에 맡을 범위와 마감선을 문장으로 나누어야 관계 피로가 줄어듭니다."
          : input.chapterId === "risk_and_growth"
            ? "반복되는 리스크는 겁줄 일이 아니라 운영법을 바꿀 신호입니다. 쉬는 시간, 밤 산책, 기록, 가벼운 운동, 표현 연습처럼 머리를 식히는 장치를 일정 안에 넣어야 오래 갑니다."
            : input.chapterId === "final_message"
              ? "이 리포트의 마지막 핵심은 더 세게 밀어붙이라는 말이 아닙니다. 오늘부터는 일에서는 맡을 일과 버릴 일을 나누고, 관계에서는 결론보다 질문을 먼저 꺼내고, 돈에서는 쓰는 계좌와 지키는 계좌를 분리하고, 회복에서는 밤에 문제 해결을 멈추는 장치를 만들어야 합니다."
              : `${input.titleKo} 장은 공통 만세력표의 이름을 반복하지 않고, 원국 특징을 실제 선택과 말투, 관계와 회복 리듬으로 풀어내는 본문입니다.`;
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
                `${namedPrefix}상대가 설명을 끝내기 전에 이미 결론이 보이는 순간이 있을 수 있습니다.`,
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
            "프로젝트를 키우기 전 기록, 정산일, 담당 경계를 먼저 적어 두세요.",
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
                  "맡을 몫과 넘겨줄 몫을 문장으로 정리하세요.",
                  "쉬는 시간을 일정에 먼저 넣으세요.",
                ];

  return {
    chapterId: input.chapterId,
    titleKo: input.titleKo,
    headline: getChapterHeadline({
      chapterId: input.chapterId,
      titleKo: input.titleKo,
      primaryTerm,
    }),
    hitReadingLines,
    body: cleanKoreanParticleRegression(`${commonBody} ${topicExtra}`),
    solutionLines,
    keyPhrases: [input.titleKo, primaryTerm, input.mbtiType],
    sajuTermsUsed: [primaryTerm],
    mbtiTermsUsed: [input.mbtiType],
  };
}

const comprehensiveLongformTitleMap = {
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

function getLinkedChapterIdsForReading(
  readingId: ComprehensiveReportV2LongformReadingId,
): readonly ComprehensiveReportV2ChapterId[] {
  if (readingId === "workMoneyStudyReading") {
    return ["work_money_study"];
  }
  if (readingId === "loveRelationshipReading") {
    return ["love_relationships"];
  }
  if (readingId === "peopleFamilyEnvironmentReading") {
    return ["people_family_environment"];
  }
  if (readingId === "riskGrowthReading") {
    return ["risk_and_growth"];
  }
  if (readingId === "finalMessage") {
    return ["final_message"];
  }

  return ["saju_identity", "personality_pattern"];
}

function buildLaunchBridgeSentences(mbtiType: string): readonly string[] {
  return [
    `현침살은 핵심을 찌르는 힘이고, ${mbtiType}의 빠른 결론 성향은 그 판단을 밖으로 꺼내 기준으로 만듭니다. 이 조합은 업무에서는 오류를 빨리 잡는 실력이지만, 관계에서는 말이 너무 곧게 들어갈 수 있습니다.`,
    `갑신일주는 압박 속에서도 방향을 잡는 구조이고, ${mbtiType}의 실행 감각은 그 판단을 밖으로 꺼내 기준과 역할로 밀어붙입니다. 그래서 당신은 생각이 빠른 사람보다 틀린 구조를 빨리 고치려는 사람에 가깝습니다.`,
    `편재와 정재의 현실 감각에 ${mbtiType}의 목표 지향성이 겹치면, 돈이 되는 판은 빨리 보입니다. 대신 계약, 정산일, 손실 한도 없이 확장하면 책임이 먼저 커집니다.`,
    `토 과다와 ${mbtiType}식 책임감이 만나면 맡은 일은 끝까지 끌고 갑니다. 문제는 쉬는 기준을 항상 뒤로 미루는 데 있으므로, 회복 시간을 성과를 지키는 장치로 고정해야 합니다.`,
  ];
}

function buildLaunchLongformBody(input: {
  readonly readingId: ComprehensiveReportV2LongformReadingId;
  readonly primaryTerm: string;
  readonly mbtiType: string;
}): string {
  if (input.readingId === "opening") {
    return [
      `당신은 상대가 말을 끝내기도 전에 오류가 먼저 보이는 쪽입니다. 현침살의 예리함과 ${input.mbtiType}의 빠른 결론 성향이 겹치면, 틀린 구조를 그냥 넘기기 어렵습니다. 일에서는 이게 기획력, 디버깅, 협상력으로 살아나지만 가까운 관계에서는 말이 너무 빨리 꽂힐 수 있습니다.`,
      "이 리포트의 핵심은 당신을 더 세게 밀어붙이라는 말이 아닙니다. 이미 강한 판단력과 실행력이 있으니, 이제는 그 힘이 사람에게 닿는 순서와 오래 가는 운영법을 잡아야 합니다.",
      "회의, 카톡, 가족 대화, 프로젝트 정리에서 비슷한 장면이 반복될 수 있습니다. 당신은 문제를 해결하려고 말하지만 상대는 평가받는다고 느낄 수 있고, 당신은 시간을 아끼려 하지만 주변은 속도를 따라오지 못할 수 있습니다. 그래서 이 구조의 출발점은 능력을 줄이는 것이 아니라, 능력이 들어갈 순서를 다시 잡는 일입니다.",
      "덕민님에게 필요한 것은 성격을 바꾸는 일이 아닙니다. 이미 보이는 오류를 못 본 척하기는 어렵기 때문에, 오류를 말하기 전 상대가 들을 준비를 하게 만드는 문장 하나가 필요합니다. 그 작은 순서가 일에서는 설득력을 만들고, 관계에서는 날카로움을 신뢰로 바꿉니다.",
    ].join("\n\n");
  }
  if (input.readingId === "baseSajuReading") {
    return [
      `갑신일주는 압박이 걸릴수록 기준을 세우는 구조입니다. 여기에 토가 강하게 깔리면 맡은 일을 쉽게 놓지 않고, 편재와 정재의 현실 감각은 돈과 자원을 그냥 흘려보내기보다 어디에 묶을지 먼저 보게 만듭니다.`,
      "오행 분포는 목 2, 화 0, 토 4, 금 2, 수 0으로 읽힙니다. 목은 방향성과 성장 의지를 만들고, 토는 책임과 현실감을 크게 키우며, 금은 판단과 정리력을 세웁니다. 반대로 화와 수가 비어 있으면 표현의 온도와 회복 루틴은 자동으로 나오기보다 의식적으로 만들어야 합니다.",
      `수 부족은 감정이 없다는 뜻이 아니라 식히는 시간이 늦게 온다는 뜻입니다. ${input.mbtiType}의 목표 지향성까지 겹치면 문제를 해결하는 속도는 빠르지만, 쉬는 기준을 정하지 않으면 날카로움이 예민함으로 바뀝니다.`,
      "이 기본 형상은 생활에서 꽤 현실적으로 드러납니다. 돈을 쓸 때도 이유가 있어야 마음이 놓이고, 공부를 해도 써먹을 장면이 보여야 집중이 붙습니다. 반대로 사람의 감정처럼 숫자로 바로 정리되지 않는 영역에서는 답을 빨리 내리려 할수록 관계의 온도가 늦게 따라올 수 있습니다.",
      "원국의 균형을 한 문장으로 말하면, 현실을 붙잡는 힘은 강하고 식히는 힘은 의식적으로 만들어야 하는 구조입니다. 그래서 업무와 돈에서는 강하지만, 잠들기 전까지 머릿속 회의가 이어지는 날에는 다음 날 판단력까지 같이 닳을 수 있습니다. 책임은 잘 지는데 즐거움과 쉬는 이유를 뒤로 미루는 패턴이 반복되면, 성과보다 피로가 먼저 쌓입니다.",
    ].join("\n\n");
  }
  if (input.readingId === "sajuFeatureReading") {
    return [
      "만세력표에 보이는 표식은 같은 종류가 아닙니다. 갑신일주는 기본 구조이고, 토 과다와 수 부족은 오행의 치우침이며, 천을귀인과 현침살은 신살·귀인의 표식입니다. 재다신약은 자원과 책임의 균형을 따로 봐야 한다는 구조 판단입니다.",
      "그래서 표식은 길흉 딱지로 읽으면 안 됩니다. 백호대살은 강한 돌파력을 어디에 쓸지 묻고, 망신살은 드러나는 자리의 표현 관리를 요구하며, 연일 천간합 甲己는 하고 싶은 방향과 현실 책임이 묶이는 장면을 보여줍니다.",
      "월덕귀인과 천덕귀인은 막힌 일을 부드럽게 풀어주는 통로로 읽고, 반안살과 장성살은 인정받는 자리와 앞에 서는 역할을 함께 봅니다. 겁살은 급하게 움직일 때 비용과 시간을 확인하라는 신호이고, 화개는 혼자 깊게 정리하는 시간이 있어야 판단이 선명해진다는 뜻으로 읽는 편이 정확합니다.",
      "이 장의 목적은 이름을 많이 외우게 하는 것이 아니라, 만세력표에 나온 표식이 실제 행동에서 어디를 건드리는지 보여주는 것입니다. 같은 현침살도 일에서는 분석력이 되고, 관계에서는 말의 날이 되며, 같은 귀인도 도움을 기다리는 태도가 아니라 도움을 요청하는 통로를 만드는 태도로 바뀝니다.",
    ].join("\n\n");
  }
  if (input.readingId === "mbtiReading") {
    return [
      `${input.mbtiType}라는 이름보다 중요한 것은 행동으로 드러나는 방식입니다. 비효율적인 사람을 보면 그냥 넘기기 어렵고, 설명을 듣다가 틀린 부분이 먼저 보이면 표정 관리가 어려울 수 있습니다.`,
      `이 성향은 현침살과 갑신일주의 빠른 판단 구조 안에서 더 선명해집니다. 당신은 조언을 해준다고 생각하지만, 상대는 평가받는다고 느낄 수 있으므로 관계에서는 정답보다 받아들이는 순서가 먼저입니다.`,
      "권위가 있다고 그대로 따르는 쪽도 아닙니다. 책임 없이 자리만 차지하는 사람, 말은 많지만 실행 기준이 없는 사람에게는 인내심이 낮아질 수 있습니다. 당신이 싫어하는 것은 사람 자체라기보다, 실력과 책임이 맞지 않는 구조입니다.",
      "논쟁을 친밀감처럼 느끼는 면도 있습니다. 생각이 맞는 사람과는 치열하게 따져 보는 대화가 오히려 재미가 되지만, 감정 확인이 필요한 사람에게는 그 방식이 공격처럼 들릴 수 있습니다. 감정 지능은 타고난 부드러움이 아니라 장기 성과를 지키는 전략으로 배워야 합니다.",
      "그래서 이 리포트에서는 유형 설명을 길게 반복하지 않습니다. 목표가 보이면 사람과 자원을 재배치하려는 습관, 위임보다 직접 통제하려는 경향, 돈을 영향력과 성취의 지표로 보는 감각이 명리 구조와 만날 때 어떤 생활 패턴으로 바뀌는지를 봅니다.",
    ].join("\n\n");
  }
  if (input.readingId === "sajuMbtiBridgeReading") {
    return [
      ...buildLaunchBridgeSentences(input.mbtiType),
      "이 네 가지 연결은 같은 결론으로 모입니다. 당신은 느린 사람을 싫어한다기보다, 흐릿한 구조를 오래 보고 있기가 어렵습니다. 그래서 잘 맞는 환경은 자유만 많은 곳이 아니라, 권한과 목표와 피드백 기준이 분명한 곳입니다.",
      "반대로 기준이 없는 관계나 말이 자주 바뀌는 조직에서는 에너지가 빨리 닳습니다. 그럴 때 필요한 것은 더 강한 통제가 아니라, 내가 바꿀 수 있는 영역과 상대에게 남길 영역을 분리하는 일입니다.",
    ].join("\n\n");
  }
  if (input.readingId === "workMoneyStudyReading") {
    return [
      `편재의 확장 감각과 정재의 보관 감각이 함께 있으면, 돈과 일은 단순한 안정감보다 판을 만들고 지키는 문제로 다가옵니다. ${input.mbtiType}의 목표 지향성이 붙으면 서비스 수익화, 외부 프로젝트, 포트폴리오, 자격증 공부가 따로가 아니라 하나의 성장 루틴으로 묶입니다.`,
      "당신은 아이디어를 떠올리면 이걸 어떻게 팔지, 어디에 적용할지, 어떤 사람을 붙이면 빨라질지까지 비교적 빨리 갑니다. 이 속도는 장점이지만, 수익화 감각이 빠른 사람일수록 정산일, 권한, 책임 범위를 늦게 쓰면 손해를 봅니다.",
      "프로젝트를 시작할 때는 열정보다 기록과 합의가 먼저입니다. 계약서, 정산일, 비용 상한선, 철수 기준을 먼저 잠그는 사람이 되어야 돈이 들어와도 새지 않고, 공부도 결과물로 남습니다. 돈은 감으로 움직이기보다 숫자와 기준이 있어야 마음이 놓입니다.",
      "개발·서비스 기획 맥락에서는 아이디어보다 검증 기록, 사용자의 반응, 일정 관리가 돈과 실력을 동시에 만듭니다. 공부도 마찬가지입니다. 그냥 많이 읽는 것보다 배운 내용을 화면, 글, 포트폴리오, 제안서 같은 결과물로 바꿀 때 이 구조가 가장 잘 살아납니다.",
      "위임을 할 때도 기준이 필요합니다. 직접 통제하면 빠르지만, 모든 것을 직접 잡으면 판이 커질수록 병목이 됩니다. 맡길 일과 직접 볼 일을 나누는 순간, 확장 감각은 무모함이 아니라 사업 감각으로 바뀝니다.",
    ].join("\n\n");
  }
  if (input.readingId === "loveRelationshipReading") {
    return [
      `연애와 관계에서 핵심은 마음이 없다는 말이 아닙니다. 현침살의 예리함과 ${input.mbtiType}의 빠른 결론 성향이 겹치면, 상대가 감정을 말하는 중에도 해결책과 오류가 먼저 보일 수 있습니다. 천을귀인은 막힌 관계를 사람의 조언이나 좋은 타이밍으로 풀 통로가 있다는 뜻이지만, 먼저 요청하지 않으면 그 통로가 늦게 열립니다.`,
      "당신은 감정이 깊어도 상대가 무책임하면 금방 차갑게 식을 수 있습니다. 말로 사랑한다고 해도 행동 기준이 흐리면 신뢰가 쌓이지 않고, 책임 없는 약속이 반복되면 호감보다 피로가 먼저 올라옵니다.",
      "카톡이나 긴 대화에서 상대가 원하는 것은 결론이 아니라 내 편이라는 확인일 때가 있습니다. 그때 바로 해결책을 주면 당신은 도와줬다고 느끼고, 상대는 마음을 건너뛰었다고 느낄 수 있습니다. 일에서는 팩폭이 실력이지만, 관계에서는 순서를 틀리면 상처가 됩니다.",
      "잘 맞는 상대는 기준을 싫어하지 않으면서도 감정을 말로 확인해 줄 수 있는 사람입니다. 피곤해지는 상대는 책임은 흐리고 감정 확인만 계속 요구하는 사람입니다. 관계를 오래 가게 하는 기준은 약해지는 것이 아니라, 강한 판단을 감정 확인 뒤에 놓는 일입니다.",
      "연인이나 가까운 사람에게는 효율보다 안전감이 먼저 필요할 때가 있습니다. 당신에게는 당연한 기준도 상대에게는 시험처럼 느껴질 수 있으니, 중요한 대화에서는 해결책보다 상대가 느낀 감정을 먼저 요약하는 편이 좋습니다.",
    ].join("\n\n");
  }
  if (input.readingId === "peopleFamilyEnvironmentReading") {
    return [
      `장성살과 천을귀인의 흐름은 사람과 환경 속에서 당신이 기준을 잡고 길을 여는 역할로 나타날 수 있습니다. ${input.mbtiType}의 역할 정리 감각이 붙으면 주변은 당신에게 해결력을 기대하기 쉽습니다.`,
      "문제는 해결력이 아니라 떠안는 속도입니다. 가족 부탁, 팀 역할, 친구의 고민을 듣는 자리에서 바로 정리하려 들면 호의가 의무가 됩니다. 능력 없는 사람을 싫어한다기보다, 책임 없이 말만 많은 구조를 오래 견디기 어려운 쪽에 가깝습니다.",
      "망신살과 백호대살은 사람 앞에서 드러나는 말과 행동의 강도를 함께 보게 합니다. 팀플, 회의, 가족 모임에서 당신의 한마디가 방향을 잡아 줄 수도 있지만, 준비 없이 강하게 나가면 주변은 설득보다 압박을 먼저 느낄 수 있습니다.",
      "공개적인 자리에서는 말과 행동이 생각보다 빨리 퍼질 수 있습니다. 친구에게는 조언이지만 듣는 사람에게는 지적처럼 남을 수 있고, 가족에게는 책임감이지만 본인에게는 짐처럼 쌓일 수 있습니다. 그래서 도움을 주기 전 범위와 시간을 먼저 말해야 합니다.",
      "천을귀인은 도움과 완충의 통로를 뜻합니다. 다만 이 통로는 혼자 다 해결한 뒤에 열리는 것이 아니라, 내가 필요한 도움을 구체적으로 말할 때 더 잘 열립니다. 사람을 자원처럼 쓰는 감각이 아니라 사람과 역할을 나누는 감각이 필요합니다.",
    ].join("\n\n");
  }
  if (input.readingId === "riskGrowthReading") {
    return [
      `리스크는 겁낼 사건이 아니라 반복되는 운영 패턴입니다. 토가 강하고 수가 부족한 구조에 ${input.mbtiType}의 추진력이 겹치면, 버티는 힘은 강하지만 멈추는 기준은 늦게 잡힙니다.`,
      "쉬라는 말만 들으면 잘 못 쉴 수 있습니다. 쉬는 이유와 구조가 있어야 쉽니다. 그래서 성장은 더 버티는 쪽이 아니라 더 잘 멈추는 쪽에서 시작됩니다. 밤 산책, 짧은 기록, 물 마시기, 잠들기 전 문제를 내일로 넘기는 문장 하나가 판단력을 오래 보존합니다.",
      "재다신약은 자원과 책임이 커질수록 방어 규칙부터 세워야 한다는 구조입니다. 돈, 시간, 관계 요청이 한꺼번에 들어올 때 전부 받으면 능력이 아니라 체력이 먼저 닳습니다. 성장의 기준은 더 많은 판을 여는 것이 아니라, 오래 가져갈 판만 남기는 것입니다.",
      "화가 비어 있으면 즐거움과 표현 온도를 의식적으로 만들어야 하고, 수가 비어 있으면 식히는 루틴을 일정에 넣어야 합니다. 토가 강한 사람은 책임을 잘 지지만, 맡을 일과 버릴 일을 나누지 않으면 책임감이 번아웃의 입구가 됩니다.",
      "겁살과 백호대살처럼 압력이 강한 표식은 겁을 주는 말이 아닙니다. 급한 상황에서 빨리 움직일 수 있다는 뜻이지만, 비용과 일정 확인 없이 움직이면 회복보다 수습이 먼저 옵니다. 강한 사람일수록 멈춤 기준을 명확히 가져야 합니다.",
    ].join("\n\n");
  }

  return [
    `마지막 기준은 단순합니다. 현침살과 ${input.mbtiType}의 빠른 판단은 당신의 강점이지만, 그 힘이 사람에게 닿는 순서를 설계해야 오래 갑니다. 맞는 말을 하는 능력보다 중요한 것은 그 말이 들어갈 수 있는 문을 먼저 여는 일입니다.`,
    "오늘부터는 대화에서는 질문 하나를 먼저 두고, 일에서는 역할선 한 줄을 먼저 쓰고, 돈에서는 방어 규칙 하나를 고정하고, 회복에서는 밤에 문제 해결을 멈추는 시간을 정하세요. 이 작은 기준이 쌓이면 강한 추진력은 사람을 밀어붙이는 압력이 아니라, 오래 가는 실행력으로 바뀝니다.",
    "정리하면, 당신은 약한 사람이 아니라 너무 빨리 구조를 보는 사람입니다. 그 빠름을 줄일 필요는 없습니다. 다만 일에서는 기록으로, 관계에서는 확인 문장으로, 돈에서는 기준표로, 회복에서는 일정으로 바꾸어 두면 같은 힘이 훨씬 덜 날카롭고 더 오래 갑니다.",
    "천을귀인은 혼자 버티라는 말의 반대편에 있습니다. 도움을 받을 통로를 미리 열고, 현침살의 날카로운 판단은 사람을 찌르기보다 문제를 정리하는 도구로 써야 합니다. 이 두 기준만 지켜도 같은 사주 구조가 훨씬 부드럽고 강하게 작동합니다.",
  ].join("\n\n");
}

function buildLongformReading(input: {
  readonly readingId: ComprehensiveReportV2LongformReadingId;
  readonly packet: ComprehensiveReportEvidencePacket;
  readonly mbtiType: string;
  readonly featureOffset: number;
  readonly allowedSajuTerms: ReadonlySet<string>;
}): NonNullable<ComprehensiveReportV2Draft["longformReadings"]>[number] {
  const sajuTerms = getPrimarySajuTerms({
    packet: input.packet,
    allowedSajuTerms: input.allowedSajuTerms,
  });
  const primaryTerm = getSelectedSajuTerm({
    packet: input.packet,
    offset: input.featureOffset,
    fallback: sajuTerms[0] ?? "원국 구조",
    contextId: input.readingId,
    allowedSajuTerms: input.allowedSajuTerms,
  });
  const titleKo = comprehensiveLongformTitleMap[input.readingId];
  const body = cleanKoreanParticleRegression(
    buildLaunchLongformBody({
      readingId: input.readingId,
      primaryTerm,
      mbtiType: input.mbtiType,
    }),
  );

  return {
    readingId: input.readingId,
    titleKo,
    body,
    linkedChapterIds: getLinkedChapterIdsForReading(input.readingId),
    sajuTermsUsed: [primaryTerm],
    mbtiTermsUsed: [input.mbtiType],
  };
}

function buildPreviewProfileTable(input: {
  readonly fixture: ReportQualityFixture;
  readonly packet: ComprehensiveReportEvidencePacket;
}): ComprehensiveReportV2ProfileTable {
  const profileTable = buildComprehensiveReportV2ProfileTable({
    evidencePacket: input.packet,
    mbtiType: input.fixture.mbti,
    sajuFacts: input.fixture.sajuFacts,
  });
  const fixturePillars = {
    hour: input.fixture.expectedPillars.hour,
    day: input.fixture.expectedPillars.day,
    month: input.fixture.expectedPillars.month,
    year: input.fixture.expectedPillars.year,
  } as const;
  const ssotPillarGrid = buildSsotPillarGridForFixture(input.fixture);
  const existingColumns = new Map(
    (ssotPillarGrid ?? profileTable.fourPillarGrid ?? []).map((column) => [
      column.columnId,
      column,
    ]),
  );
  const fourPillarGrid = (["hour", "day", "month", "year"] as const).map(
    (columnId) => ({
      ...existingColumns.get(columnId),
      columnId,
      labelKo:
        existingColumns.get(columnId)?.labelKo ??
        (columnId === "hour"
          ? "시주"
          : columnId === "day"
            ? "일주"
            : columnId === "month"
              ? "월주"
              : "연주"),
      pillar: existingColumns.get(columnId)?.pillar ?? fixturePillars[columnId],
    }),
  );
  const gridSinsal = uniqueTextValues(
    fourPillarGrid.flatMap((column) => column.sinsal ?? []),
  );
  const gridGwiin = uniqueTextValues(
    fourPillarGrid.flatMap((column) => column.gwiin ?? []),
  );
  const gridTwelveSinsal = uniqueTextValues(
    fourPillarGrid.flatMap((column) => column.twelveSinsal ?? []),
  );

  return {
    ...profileTable,
    yearPillar: profileTable.yearPillar ?? input.fixture.expectedPillars.year,
    monthPillar: profileTable.monthPillar ?? input.fixture.expectedPillars.month,
    dayPillar: profileTable.dayPillar ?? input.fixture.expectedPillars.day,
    hourPillar: profileTable.hourPillar ?? input.fixture.expectedPillars.hour,
    fourPillarGrid,
    sinsal: gridSinsal,
    gwiin: gridGwiin,
    twelveSinsal: gridTwelveSinsal,
    majorSinsal: gridSinsal,
    gwiinGilshin: gridGwiin,
  };
}

function buildSsotPillarGridForFixture(
  fixture: ReportQualityFixture,
): readonly ComprehensiveReportV2PillarGridColumn[] | null {
  if (fixture.id !== "deokmin-external-manse") {
    return null;
  }

  const careerFixture = requireCareerReportFixture("deokmin-career");
  const evidence = buildCareerReportEvidence({
    fixtureId: careerFixture.id,
    person: careerFixture.person,
  });
  const pillars = evidence.manseRyeokPillars ?? [];

  if (pillars.length < 4) {
    return null;
  }

  return pillars.map((pillar) => ({
    columnId: pillar.columnId,
    labelKo:
      pillar.columnId === "hour"
        ? "시주"
        : pillar.columnId === "day"
          ? "일주"
          : pillar.columnId === "month"
            ? "월주"
            : "연주",
    pillar: pillar.pillar,
    heavenlyStem: pillar.heavenlyStem,
    earthlyBranch: pillar.earthlyBranch,
    tenGod: pillar.tenGod,
    hiddenStems: pillar.hiddenStems,
    twelveLifeStage: pillar.twelveLifeStage,
    twelveSinsal: pillar.twelveSinsal,
    sinsal: pillar.sinsal,
    gwiin: pillar.gwiin,
    interactions: pillar.interactions,
  }));
}

function buildEvidenceBoundSajuFeatureChapter(input: {
  readonly packet: ComprehensiveReportEvidencePacket;
  readonly allowedSajuTerms: ReadonlySet<string>;
}): NonNullable<ComprehensiveReportV2Draft["sajuFeatureChapter"]> {
  const deterministicChapter = buildDeterministicSajuFeatureChapter(input.packet);

  if (deterministicChapter === undefined) {
    throw new Error("SAJU_FEATURE_CHAPTER_UNAVAILABLE");
  }

  const dictionaryEntries = new Map(
    (input.packet.sajuFeatureDictionary ?? []).map((entry) => [entry.rawLabel, entry]),
  );
  const deterministicItems = new Map(
    deterministicChapter.items.map((item) => [item.rawLabel, item]),
  );
  const coreFeatureLabels = [
    "천을귀인",
    "현침살",
    "갑신일주",
    "재다신약",
    "토 과다",
    "수 부족",
  ] as const;
  const quickFeatureLabels = [
    "백호대살",
    "망신살",
    "월덕귀인",
    "천덕귀인",
    "화개",
    "장성살",
    "반안살",
    "겁살",
    "화개살",
    "연일 천간합 甲己",
  ] as const;
  const visibleLabels = [...coreFeatureLabels, ...quickFeatureLabels].filter((rawLabel) =>
    isEvidenceBoundVisibleFeature({
      rawLabel,
      allowedSajuTerms: input.allowedSajuTerms,
    }),
  );
  const items = visibleLabels.map((rawLabel) =>
    buildEvidenceBoundSajuFeatureChapterItem({
      rawLabel,
      dictionaryEntry: dictionaryEntries.get(rawLabel),
      deterministicItem: deterministicItems.get(rawLabel),
    }),
  );

  if (items.length === 0) {
    throw new Error("SAJU_FEATURE_CHAPTER_UNAVAILABLE");
  }

  return {
    ...deterministicChapter,
    subtitleKo: "내 사주의 주요 표식 해석",
    intro:
      "공통 만세력표에 실제로 잡힌 표식과 별도로 계산된 구조 판단만 골라 현실 언어로 풀었습니다. 신살·귀인, 일주, 오행, 십성, 지장간, 합충형파해는 같은 층위가 아니므로 분류를 나누어 읽어야 합니다.",
    items,
  };
}

function buildEvidenceBoundSajuFeatureChapterItem(input: {
  readonly rawLabel: string;
  readonly dictionaryEntry: ComprehensiveFeatureDictionaryEntry | undefined;
  readonly deterministicItem:
    | NonNullable<ComprehensiveReportV2Draft["sajuFeatureChapter"]>["items"][number]
    | undefined;
}): NonNullable<ComprehensiveReportV2Draft["sajuFeatureChapter"]>["items"][number] {
  const fallback = getSajuFeatureCopy(input.rawLabel);
  const deterministicItem = input.deterministicItem;
  const titleWithoutCategory = (
    deterministicItem?.userTitle ??
    input.dictionaryEntry?.userTitle ??
    fallback.userTitle
  ).replace(
    /^(일주 구조|오행 구조|십성 구조|신살·귀인|합충형파해|지장간|구조 판단)\s*·\s*/u,
    "",
  );

  return {
    rawLabel: input.rawLabel,
    userTitle: cleanKoreanParticleRegression(titleWithoutCategory),
    plainMeaning:
      cleanKoreanParticleRegression(
        deterministicItem?.plainMeaning ??
          input.dictionaryEntry?.plainMeaning ??
          fallback.plainMeaning,
      ),
    howItShowsInYou:
      cleanKoreanParticleRegression(
        deterministicItem?.howItShowsInYou ??
          input.dictionaryEntry?.howItShowsInYou ??
          fallback.howItShowsInYou,
      ),
    strength:
      cleanKoreanParticleRegression(
        deterministicItem?.strength ??
          input.dictionaryEntry?.strength ??
          fallback.strength,
      ),
    fatiguePoint:
      cleanKoreanParticleRegression(
        deterministicItem?.fatiguePoint ??
          input.dictionaryEntry?.fatiguePoint ??
          fallback.fatiguePoint,
      ),
    practicalUse:
      sentence(
        deterministicItem?.practicalUse ??
          input.dictionaryEntry?.practicalUse ??
          fallback.practicalUse,
      ),
  };
}

function getLocalSajuFeatureSpotlight(
  packet: ComprehensiveReportEvidencePacket,
): NonNullable<ComprehensiveReportV2Draft["sajuFeatureSpotlight"]> {
  const candidate = packet.sajuFeatureSpotlight;

  if (candidate?.groups.some((group) => group.items.length > 0) === true) {
    return candidate;
  }

  return {
    title: "핵심 표식 요약",
    subtitle: "본문에서 반복해 쓰이는 명리 표식만 골라 정리했습니다.",
    groups: [
      {
        groupId: "talent",
        title: "강점으로 살아나는 표식",
        items: [
          {
            featureId: "sinsal_hyeonchim",
            labelKo: "현침살",
            badge: "예리한 판단",
            shortMeaning: "틀린 구조와 핵심 오류를 빨리 보는 힘입니다.",
            vividLine:
              "상대가 말을 끝내기 전에도 핵심 문제가 먼저 보이는 장면으로 드러납니다.",
            practicalLine:
              "바로 찌르기보다 확인 질문을 먼저 넣으면 실력이 덜 날카롭게 전달됩니다.",
            polarity: "mixed",
            sourceChapterIds: ["personality_pattern", "love_relationships"],
          },
          {
            featureId: "day_pillar_gapsin",
            labelKo: "갑신일주",
            badge: "압박 속 판단",
            shortMeaning: "압박이 있어도 기준을 세우고 방향을 잡는 구조입니다.",
            vividLine:
              "회의, 협상, 프로젝트 정리에서 애매한 판을 빠르게 구조화하는 장면으로 나타납니다.",
            practicalLine:
              "기준을 세우되 상대가 따라올 순서를 함께 설계해야 오래 갑니다.",
            polarity: "positive",
            sourceChapterIds: ["saju_identity", "work_money_study"],
          },
        ],
      },
      {
        groupId: "balance",
        title: "보완하면 오래 가는 표식",
        items: [
          {
            featureId: "element_earth_excess",
            labelKo: "토 과다",
            badge: "책임과 누적",
            shortMeaning: "책임감과 현실 감각이 강하지만 부담도 함께 쌓이는 구조입니다.",
            vividLine:
              "맡은 일을 끝까지 끌고 가지만 쉬는 기준을 늦게 잡는 장면으로 드러납니다.",
            practicalLine:
              "맡을 일과 내려놓을 일을 나누고 회복 시간을 일정에 먼저 넣어야 합니다.",
            polarity: "mixed",
            sourceChapterIds: ["risk_and_growth", "final_message"],
          },
          {
            featureId: "element_water_missing",
            labelKo: "수 부족",
            badge: "회복 루틴",
            shortMeaning: "생각을 식히고 감정을 완충하는 힘을 의식적으로 만들어야 합니다.",
            vividLine:
              "문제 해결 모드가 밤까지 이어져 머리가 늦게 꺼지는 장면으로 나타납니다.",
            practicalLine:
              "밤 산책, 수면, 기록, 물 마시기처럼 식히는 루틴을 고정하세요.",
            polarity: "warning",
            sourceChapterIds: ["risk_and_growth"],
          },
        ],
      },
    ],
  };
}

function getLocalSajuSignatureScenes(
  packet: ComprehensiveReportEvidencePacket,
  mbtiType: string,
): readonly NonNullable<ComprehensiveReportV2Draft["sajuSignatureScenes"]>[number][] {
  if (packet.sajuSignatureScenes !== undefined && packet.sajuSignatureScenes.length > 0) {
    return packet.sajuSignatureScenes;
  }

  return [
    {
      id: "hyeonchim_entj_fast_conclusion",
      title: "틀린 구조가 먼저 보이는 장면",
      featureIds: ["sinsal_hyeonchim"],
      featureLabels: ["현침살", mbtiType],
      topics: ["personality", "work", "relationship"],
      sceneLines: [
        "상대가 길게 설명하는 동안 이미 핵심 오류와 다음 행동이 먼저 보일 수 있습니다.",
        "일에서는 이 속도가 기획, 디버깅, 협상력으로 살아납니다.",
      ],
      sceneLine:
        "현침살과 ENTJ식 빠른 결론 성향이 겹치면, 틀린 구조를 그냥 넘기기 어렵습니다.",
      interpretationLine:
        "강점은 문제의 핵심을 빨리 잡는 힘이고, 피로는 말이 평가처럼 들릴 수 있다는 점입니다.",
      practicalLine:
        "바로 고치기 전에 제가 이해한 핵심은 이것입니다라고 한 번 되받아 주세요.",
    },
    {
      id: "earth_excess_entj_responsibility",
      title: "책임을 끝까지 끌고 가는 장면",
      featureIds: ["element_earth_excess", "element_water_missing"],
      featureLabels: ["토 과다", "수 부족", mbtiType],
      topics: ["work", "growth"],
      sceneLines: [
        "맡은 일은 끝까지 가져가지만 쉬는 기준을 가장 늦게 세울 수 있습니다.",
        "그냥 쉬라는 말보다 쉬는 이유와 구조가 있어야 회복이 시작됩니다.",
      ],
      sceneLine:
        "토 과다와 ENTJ식 책임감이 겹치면, 성실함이 성과가 되지만 부담도 같이 쌓입니다.",
      interpretationLine:
        "수 부족은 감정이 없다는 뜻이 아니라 생각을 식히는 루틴을 따로 만들어야 한다는 신호입니다.",
      practicalLine:
        "밤 산책, 기록, 수면, 물 마시기처럼 회복을 일정에 고정하세요.",
    },
    {
      id: "wealth_stems_entj_money_rules",
      title: "돈이 되는 판을 빨리 보는 장면",
      featureIds: ["ten_god_pian_cai", "ten_god_zheng_cai"],
      featureLabels: ["편재", "정재", mbtiType],
      topics: ["money", "work"],
      sceneLines: [
        "아이디어가 떠오르면 이걸 어떻게 팔지까지 빨리 이어질 수 있습니다.",
        "수익화 감각이 빠른 만큼 정산일, 비용 상한선, 철수 기준을 늦게 쓰면 손해가 커집니다.",
      ],
      sceneLine:
        "편재와 정재의 현실 감각에 ENTJ식 목표 지향성이 겹치면 돈이 되는 판을 빨리 봅니다.",
      interpretationLine:
        "확장 감각은 장점이지만 계약, 정산, 책임 범위를 기록하지 않으면 실행력이 부담으로 바뀝니다.",
      practicalLine:
        "외부 제안과 프로젝트를 시작할 때는 기록, 정산일, 담당 경계를 먼저 적어 두세요.",
    },
  ];
}

function getSajuFeatureCopy(rawLabel: string): {
  readonly userTitle: string;
  readonly plainMeaning: string;
  readonly howItShowsInYou: string;
  readonly strength: string;
  readonly fatiguePoint: string;
  readonly practicalUse: string;
} {
  if (rawLabel === "토 과다") {
    return {
      userTitle: "현실을 붙잡는 힘이 강한 구조입니다.",
      plainMeaning: "토가 강하면 책임, 보관, 현실 감각, 버티는 힘이 커집니다.",
      howItShowsInYou:
        "해야 할 일을 보면 쉽게 놓지 못하고, 끝까지 끌고 가려는 태도로 드러납니다.",
      strength: "프로젝트를 안정화하고 돈과 일정을 구조화하는 데 강합니다.",
      fatiguePoint: "쉬는 기준을 뒤로 미루면 몸과 마음이 무거워지기 쉽습니다.",
      practicalUse: "맡을 일과 내려놓을 일을 먼저 나누고, 회복 시간을 일정에 넣어야 합니다.",
    };
  }
  if (rawLabel === "수 부족") {
    return {
      userTitle: "식히고 흘려보내는 루틴이 필요한 구조입니다.",
      plainMeaning: "수가 부족하면 감정 완충, 회복, 쉬어 가는 리듬이 늦어질 수 있습니다.",
      howItShowsInYou:
        "문제가 생기면 쉬기보다 해결부터 하려 하고, 머리가 늦게 꺼지는 방식으로 드러납니다.",
      strength: "감정에 오래 젖지 않고 빠르게 판단하는 힘이 있습니다.",
      fatiguePoint: "회복이 늦어지면 날카로운 판단이 예민함으로 바뀔 수 있습니다.",
      practicalUse: "밤 산책, 물 마시기, 짧은 기록처럼 생각을 식히는 장치를 고정하세요.",
    };
  }
  if (rawLabel === "백호대살") {
    return {
      userTitle: "강한 압력을 정면으로 처리하는 표식입니다.",
      plainMeaning: "백호대살은 강한 돌파력과 긴장 속 대응력을 뜻합니다.",
      howItShowsInYou: "위기나 압박이 있을 때 물러서기보다 바로 정리하려는 모습으로 드러납니다.",
      strength: "급한 문제를 빠르게 끊고 결론 내는 데 강합니다.",
      fatiguePoint: "말과 선택이 과격해지면 주변이 압박을 느낄 수 있습니다.",
      practicalUse: "강한 결론을 내기 전 상대가 받아들일 순서를 먼저 잡으세요.",
    };
  }
  if (rawLabel === "망신살") {
    return {
      userTitle: "사람 앞에서 드러나는 장면을 관리해야 하는 표식입니다.",
      plainMeaning: "망신살은 감춰 두기보다 밖으로 드러나는 장면이 생기기 쉬운 기운입니다.",
      howItShowsInYou: "말, 표정, 결정이 사람들 앞에서 빠르게 평가받는 순간으로 드러납니다.",
      strength: "공개된 자리에서 존재감과 추진력을 보여줄 수 있습니다.",
      fatiguePoint: "준비 없이 드러나면 오해가 커질 수 있습니다.",
      practicalUse: "중요한 말은 공개 전에 표현과 근거를 한 번 정리하세요.",
    };
  }
  if (rawLabel === "월덕귀인" || rawLabel === "천덕귀인") {
    return {
      userTitle: "관계와 제도 안에서 완충이 생기는 귀인 표식입니다.",
      plainMeaning: `${rawLabel}은 도움, 완충, 보호의 통로를 뜻합니다.`,
      howItShowsInYou: "막힌 일에서 조언, 제도, 선배, 정리된 기준이 길을 열어주는 장면으로 드러납니다.",
      strength: "혼자 버티지 않을 때 문제를 부드럽게 풀 가능성이 커집니다.",
      fatiguePoint: "도움을 요청하지 않으면 완충 통로가 늦게 열릴 수 있습니다.",
      practicalUse: "필요한 도움을 사람, 기준, 제도로 나누어 구체적으로 요청하세요.",
    };
  }
  if (rawLabel === "화개" || rawLabel === "화개살") {
    return {
      userTitle: "혼자 깊게 정리할 때 빛나는 표식입니다.",
      plainMeaning: `${withTopicParticle(rawLabel)} 사색, 정리, 고독, 깊이 파고드는 힘을 뜻합니다.`,
      howItShowsInYou: "시끄러운 자리보다 혼자 정리할 시간이 있을 때 판단이 선명해집니다.",
      strength: "글, 기획, 공부, 분석처럼 깊이가 필요한 일에서 강합니다.",
      fatiguePoint: "혼자 정리하는 시간이 길어지면 관계의 온도가 늦게 따라올 수 있습니다.",
      practicalUse: "혼자 정리한 결론을 사람에게 전달할 문장으로 한 번 더 바꾸세요.",
    };
  }
  if (rawLabel === "장성살") {
    return {
      userTitle: "앞에 서서 기준을 잡는 표식입니다.",
      plainMeaning: "장성살은 책임 있는 자리, 주도권, 앞에 서는 힘을 뜻합니다.",
      howItShowsInYou: "사람들이 머뭇거릴 때 방향과 기준을 먼저 세우는 모습으로 드러납니다.",
      strength: "팀이나 프로젝트에서 중심을 잡고 밀어붙일 수 있습니다.",
      fatiguePoint: "권한 없이 책임만 떠안으면 쉽게 지칩니다.",
      practicalUse: "앞에 설 때는 역할, 권한, 마감선을 같이 정하세요.",
    };
  }
  if (rawLabel === "반안살") {
    return {
      userTitle: "인정받는 자리에서 균형을 잡아야 하는 표식입니다.",
      plainMeaning: "반안살은 성취, 인정, 체면, 올라서는 자리를 뜻합니다.",
      howItShowsInYou: "성과를 보여줘야 하는 자리에서 더 또렷하게 움직이는 모습으로 드러납니다.",
      strength: "평가받는 환경에서 집중력과 품질을 끌어올릴 수 있습니다.",
      fatiguePoint: "인정 욕구가 커지면 쉬운 실패도 크게 받아들일 수 있습니다.",
      practicalUse: "성과를 보여줄 기준을 남의 반응보다 내 체크리스트로 먼저 정하세요.",
    };
  }
  if (rawLabel === "겁살") {
    return {
      userTitle: "급한 선택에서 경계가 필요한 표식입니다.",
      plainMeaning: "겁살은 자원, 시간, 집중이 빠르게 흔들릴 수 있는 압력을 뜻합니다.",
      howItShowsInYou: "갑작스러운 제안이나 압박에서 바로 움직이고 싶어지는 모습으로 드러납니다.",
      strength: "긴급한 판에서 판단과 대응이 빠릅니다.",
      fatiguePoint: "검토 없이 움직이면 시간과 돈이 새기 쉽습니다.",
      practicalUse: "큰 결정을 하기 전 비용, 일정, 철수 기준을 숫자로 확인하세요.",
    };
  }
  if (rawLabel === "연일 천간합 甲己") {
    return {
      userTitle: "관계와 역할이 묶이며 현실 기준을 만드는 흐름입니다.",
      plainMeaning: "연일 천간합 甲己는 개인의 방향성과 현실 책임이 서로 묶이는 관계를 뜻합니다.",
      howItShowsInYou: "하고 싶은 방향과 맡은 역할을 동시에 계산하는 모습으로 드러납니다.",
      strength: "이상과 현실을 연결해 실행 가능한 기준을 만들 수 있습니다.",
      fatiguePoint: "내 방향보다 책임이 앞서면 답답함이 쌓일 수 있습니다.",
      practicalUse: "맡은 역할 안에서 내가 지킬 방향을 한 문장으로 정하세요.",
    };
  }

  return {
    userTitle: `${rawLabel}을 현실 언어로 풀어보는 표식입니다.`,
    plainMeaning: `${rawLabel}은 원국에서 반복되는 반응과 선택 습관을 보여주는 표식입니다.`,
    howItShowsInYou: "일과 관계에서 비슷한 방식으로 반복되는 판단 패턴으로 드러납니다.",
    strength: "잘 쓰면 장점과 역할이 선명해집니다.",
    fatiguePoint: "과하면 같은 방식으로 밀어붙이며 피로가 쌓일 수 있습니다.",
    practicalUse: "표식의 이름보다 실제 행동에서 어떻게 조정할지 먼저 보세요.",
  };
}

function buildLocalFallbackDraft(input: {
  readonly fixture: ReportQualityFixture;
  readonly packet: ComprehensiveReportEvidencePacket;
}): ComprehensiveReportV2Draft {
  const displayName = input.fixture.displayName ?? "";
  const profileTable = buildPreviewProfileTable(input);
  const allowedSajuTerms = new Set(collectProfileTableSajuTerms(profileTable));
  const sajuFeatureChapter = buildEvidenceBoundSajuFeatureChapter({
    packet: input.packet,
    allowedSajuTerms,
  });

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
    openingTitle:
      displayName.trim().length > 0
        ? `${displayName}님의 종합 리포트`
        : "사주×MBTI 종합 리포트",
    openingSummary:
      "명리 구조와 MBTI 행동 패턴을 함께 읽는 자기이해 리포트입니다.",
    coreLine:
      "공통 만세력표는 근거이고, 신살·귀인·합충·지장간 해석과 MBTI 행동 장면이 본문을 이룹니다.",
    profileTable,
    sajuFeatureSpotlight: getLocalSajuFeatureSpotlight(input.packet),
    sajuSignatureScenes: getLocalSajuSignatureScenes(
      input.packet,
      input.fixture.mbti,
    ),
    chapters: chapters.map(([chapterId, titleKo], index) =>
      buildLocalChapter({
        chapterId,
        titleKo,
        packet: input.packet,
        displayName,
        mbtiType: input.fixture.mbti,
        featureOffset: index,
        allowedSajuTerms,
      }),
    ),
    longformReadings: COMPREHENSIVE_REPORT_V2_LONGFORM_READING_IDS.map((readingId, index) =>
      buildLongformReading({
        readingId,
        packet: input.packet,
        mbtiType: input.fixture.mbti,
        featureOffset: index + chapters.length,
        allowedSajuTerms,
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
  const allowedSajuTerms = uniqueTextValues([
    ...deriveAllowedSajuTermsFromEvidencePacket(input.packet),
    ...collectProfileTableSajuTerms(input.draft.profileTable),
  ]);
  const validation = validateComprehensiveReportDraft(input.draft, {
    allowedSajuTerms,
    allowedMbtiTerms: [input.mbtiType],
  });

  if (!validation.ok) {
    throw new Error(
      `LOCAL_COMPREHENSIVE_DRAFT_INVALID\n${validation.errors.join("\n")}`,
    );
  }

  return validation.warnings ?? [];
}

function collectProfileTableSajuTerms(
  profileTable: ComprehensiveReportV2ProfileTable,
): readonly string[] {
  return uniqueTextValues([
    profileTable.yearPillar ?? "",
    profileTable.monthPillar ?? "",
    profileTable.dayPillar ?? "",
    profileTable.hourPillar ?? "",
    ...profileTable.fiveElementSummary,
    ...profileTable.excessiveElements,
    ...profileTable.missingElements,
    ...profileTable.tenGodSummary,
    ...profileTable.specialPatterns,
    ...(profileTable.fourPillarGrid ?? []).flatMap((column) => [
      column.pillar ?? "",
      column.heavenlyStem ?? "",
      column.earthlyBranch ?? "",
      ...(column.tenGod ?? []),
      ...(column.hiddenStems ?? []),
      ...(column.twelveLifeStage ?? []),
      ...(column.twelveSinsal ?? []),
      ...(column.sinsal ?? []),
      ...(column.gwiin ?? []),
      ...(((column as { readonly interactions?: readonly string[] }).interactions) ?? []),
    ]),
  ]);
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

  const fixture = getReportSmokeFixture(
    getComprehensivePreviewSmokeFixtureIdFromArgs(args),
  );

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
