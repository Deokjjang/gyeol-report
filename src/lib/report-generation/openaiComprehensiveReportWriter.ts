import type { ComprehensiveReportEvidencePacket } from "../report-knowledge/comprehensiveReportEvidenceTypes";
import { openAIComprehensiveReportV2NarrativeDraftJsonSchema } from "./comprehensiveReportDraftSchema";
import { buildComprehensiveReportV2ProfileTable } from "./comprehensiveReportProfileTableBuilder";
import type {
  ComprehensiveReportDraft,
  ComprehensiveReportV2Chapter,
  ComprehensiveReportV2ChapterId,
  ComprehensiveReportV2Draft,
  ComprehensiveReportV2NarrativeDraft,
  ComprehensiveReportV2ProfileTable,
} from "./comprehensiveReportDraftTypes";
import { sanitizeComprehensiveReportNarrativeDraft } from "./comprehensiveReportDraftSanitizer";
import { normalizeComprehensiveReportFinalMessage } from "./comprehensiveReportNarrativePostProcessor";
import {
  areAllDraftValidationErrorsRepairable,
  validateComprehensiveReportDraftAfterRepair,
  validateComprehensiveReportDraft,
} from "./comprehensiveReportDraftValidator";
import {
  callOpenAIReportWriter,
  isOpenAIReportWriterClientError,
  type OpenAIReportWriterClientConfig,
} from "./openaiReportWriterClient";
import {
  buildOpenAIComprehensiveReportRepairMessages,
  buildOpenAIComprehensiveReportWriterMessages,
  deriveAllowedSajuTermsFromEvidencePacket,
} from "./openaiReportWriterPrompt";

export type SafeReportGenerationStage =
  | "evidence"
  | "openai"
  | "json_parse"
  | "draft_validation"
  | "snapshot_save"
  | "unknown";

export type SafeReportGenerationError = {
  readonly code: string;
  readonly stage: SafeReportGenerationStage;
  readonly causeCode?: string;
  readonly validationErrors?: readonly string[];
  readonly status?: number;
  readonly errorType?: string;
  readonly errorCode?: string;
  readonly diagnosticMessage?: string;
  readonly requestId?: string;
  readonly errorParam?: string;
  readonly repairAttempted?: boolean;
  readonly repairPassed?: boolean;
};

function formatSafeReportGenerationMessage(
  input: SafeReportGenerationError,
): string {
  const lines = [
    input.code,
    `stage: ${input.stage}`,
  ];

  if (input.causeCode !== undefined) {
    lines.push(`cause: ${input.causeCode}`);
  }
  if (input.validationErrors !== undefined && input.validationErrors.length > 0) {
    lines.push("validation errors:");
    lines.push(...input.validationErrors.map((error) => `- ${error}`));
  }
  if (input.status !== undefined) {
    lines.push(`status: ${input.status}`);
  }
  if (input.errorType !== undefined) {
    lines.push(`errorType: ${input.errorType}`);
  }
  if (input.errorCode !== undefined) {
    lines.push(`errorCode: ${input.errorCode}`);
  }
  if (input.diagnosticMessage !== undefined) {
    lines.push(`message: ${input.diagnosticMessage}`);
  }
  if (input.errorParam !== undefined) {
    lines.push(`param: ${input.errorParam}`);
  }
  if (input.requestId !== undefined) {
    lines.push(`requestId: ${input.requestId}`);
  }
  if (input.repairAttempted === true) {
    lines.push("quality repair: attempted");
    lines.push(
      `quality repair: ${input.repairPassed === true ? "passed" : "failed"}`,
    );
  }

  return lines.join("\n");
}

export class SafeReportGenerationFailure
  extends Error
  implements SafeReportGenerationError
{
  readonly code: string;
  readonly stage: SafeReportGenerationStage;
  readonly causeCode?: string;
  readonly validationErrors?: readonly string[];
  readonly status?: number;
  readonly errorType?: string;
  readonly errorCode?: string;
  readonly diagnosticMessage?: string;
  readonly requestId?: string;
  readonly errorParam?: string;
  readonly repairAttempted?: boolean;
  readonly repairPassed?: boolean;

  constructor(input: SafeReportGenerationError) {
    super(formatSafeReportGenerationMessage(input));
    this.name = "SafeReportGenerationFailure";
    this.code = input.code;
    this.stage = input.stage;
    if (input.causeCode !== undefined) {
      this.causeCode = input.causeCode;
    }
    if (input.validationErrors !== undefined) {
      this.validationErrors = input.validationErrors;
    }
    if (input.status !== undefined) {
      this.status = input.status;
    }
    if (input.errorType !== undefined) {
      this.errorType = input.errorType;
    }
    if (input.errorCode !== undefined) {
      this.errorCode = input.errorCode;
    }
    if (input.diagnosticMessage !== undefined) {
      this.diagnosticMessage = input.diagnosticMessage;
    }
    if (input.requestId !== undefined) {
      this.requestId = input.requestId;
    }
    if (input.errorParam !== undefined) {
      this.errorParam = input.errorParam;
    }
    if (input.repairAttempted !== undefined) {
      this.repairAttempted = input.repairAttempted;
    }
    if (input.repairPassed !== undefined) {
      this.repairPassed = input.repairPassed;
    }
  }
}

function isSafeStage(value: unknown): value is SafeReportGenerationStage {
  return (
    value === "evidence" ||
    value === "openai" ||
    value === "json_parse" ||
    value === "draft_validation" ||
    value === "snapshot_save" ||
    value === "unknown"
  );
}

function isStringArray(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

export function isSafeReportGenerationError(
  value: unknown,
): value is SafeReportGenerationError {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as {
    readonly code?: unknown;
    readonly stage?: unknown;
    readonly causeCode?: unknown;
    readonly validationErrors?: unknown;
    readonly status?: unknown;
    readonly errorType?: unknown;
    readonly errorCode?: unknown;
    readonly diagnosticMessage?: unknown;
    readonly requestId?: unknown;
    readonly errorParam?: unknown;
    readonly repairAttempted?: unknown;
    readonly repairPassed?: unknown;
  };

  return (
    typeof candidate.code === "string" &&
    isSafeStage(candidate.stage) &&
    (candidate.causeCode === undefined || typeof candidate.causeCode === "string") &&
    (candidate.validationErrors === undefined ||
      isStringArray(candidate.validationErrors)) &&
    (candidate.status === undefined || typeof candidate.status === "number") &&
    (candidate.errorType === undefined || typeof candidate.errorType === "string") &&
    (candidate.errorCode === undefined || typeof candidate.errorCode === "string") &&
    (candidate.diagnosticMessage === undefined ||
      typeof candidate.diagnosticMessage === "string") &&
    (candidate.requestId === undefined || typeof candidate.requestId === "string") &&
    (candidate.errorParam === undefined || typeof candidate.errorParam === "string") &&
    (candidate.repairAttempted === undefined ||
      typeof candidate.repairAttempted === "boolean") &&
    (candidate.repairPassed === undefined ||
      typeof candidate.repairPassed === "boolean")
  );
}

function getOpenAIRequestDiagnostics(
  error: unknown,
): Pick<
  SafeReportGenerationError,
  "status" | "errorType" | "errorCode" | "diagnosticMessage" | "requestId" | "errorParam"
> {
  if (isOpenAIReportWriterClientError(error)) {
    return {
      ...(error.status === undefined ? {} : { status: error.status }),
      ...(error.errorType === undefined ? {} : { errorType: error.errorType }),
      ...(error.errorCode === undefined ? {} : { errorCode: error.errorCode }),
      ...(error.diagnosticMessage === undefined
        ? {}
        : { diagnosticMessage: error.diagnosticMessage }),
      ...(error.requestId === undefined ? {} : { requestId: error.requestId }),
      ...(error.errorParam === undefined ? {} : { errorParam: error.errorParam }),
    };
  }
  if (isSafeReportGenerationError(error)) {
    return {
      ...(error.status === undefined ? {} : { status: error.status }),
      ...(error.errorType === undefined ? {} : { errorType: error.errorType }),
      ...(error.errorCode === undefined ? {} : { errorCode: error.errorCode }),
      ...(error.diagnosticMessage === undefined
        ? {}
        : { diagnosticMessage: error.diagnosticMessage }),
      ...(error.requestId === undefined ? {} : { requestId: error.requestId }),
      ...(error.errorParam === undefined ? {} : { errorParam: error.errorParam }),
    };
  }

  return {};
}

function getSafeCauseCode(error: unknown): string {
  if (isSafeReportGenerationError(error)) {
    return error.code;
  }
  if (error instanceof Error && error.message.trim().length > 0) {
    const messageCode = error.message.split("\n")[0];

    if (
      messageCode === "OPENAI_REPORT_WRITER_DISABLED" ||
      messageCode === "OPENAI_REPORT_WRITER_CONFIG_MISSING" ||
      messageCode === "OPENAI_REPORT_WRITER_REQUEST_FAILED" ||
      messageCode === "OPENAI_REPORT_WRITER_EMPTY_RESPONSE"
    ) {
      return messageCode;
    }
  }

  return "OPENAI_REPORT_WRITER_REQUEST_FAILED";
}

function isV2NarrativeChapter(value: unknown): value is ComprehensiveReportV2Chapter {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const candidate = value as {
    readonly chapterId?: unknown;
    readonly titleKo?: unknown;
    readonly headline?: unknown;
    readonly hitReadingLines?: unknown;
    readonly body?: unknown;
    readonly solutionLines?: unknown;
    readonly keyPhrases?: unknown;
    readonly sajuTermsUsed?: unknown;
    readonly mbtiTermsUsed?: unknown;
  };

  return (
    typeof candidate.chapterId === "string" &&
    typeof candidate.titleKo === "string" &&
    typeof candidate.headline === "string" &&
    isStringArray(candidate.hitReadingLines) &&
    typeof candidate.body === "string" &&
    isStringArray(candidate.solutionLines) &&
    isStringArray(candidate.keyPhrases) &&
    isStringArray(candidate.sajuTermsUsed) &&
    isStringArray(candidate.mbtiTermsUsed)
  );
}

function isV2NarrativeDraft(value: unknown): value is ComprehensiveReportV2NarrativeDraft {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const candidate = value as {
    readonly version?: unknown;
    readonly productType?: unknown;
    readonly openingTitle?: unknown;
    readonly openingSummary?: unknown;
    readonly coreLine?: unknown;
    readonly chapters?: unknown;
    readonly finalAdvice?: unknown;
    readonly safetyNotes?: unknown;
  };

  return (
    candidate.version === "comprehensive_v2_draft" &&
    candidate.productType === "saju_mbti_full" &&
    typeof candidate.openingTitle === "string" &&
    typeof candidate.openingSummary === "string" &&
    typeof candidate.coreLine === "string" &&
    Array.isArray(candidate.chapters) &&
    candidate.chapters.every(isV2NarrativeChapter) &&
    typeof candidate.finalAdvice === "string" &&
    isStringArray(candidate.safetyNotes)
  );
}

function sanitizeParsedNarrativeDraft(parsed: unknown): {
  readonly parsed: unknown;
  readonly sanitized: boolean;
  readonly sanitizedTerms: readonly string[];
} {
  if (!isV2NarrativeDraft(parsed)) {
    return {
      parsed,
      sanitized: false,
      sanitizedTerms: [],
    };
  }

  const result = sanitizeComprehensiveReportNarrativeDraft(parsed);

  return {
    parsed: result.draft,
    sanitized: result.sanitized,
    sanitizedTerms: result.sanitizedTerms,
  };
}

function getCopySanitizerWarnings(
  ...results: readonly {
    readonly sanitized: boolean;
  }[]
): readonly string[] {
  return results.some((result) => result.sanitized)
    ? ["copy sanitizer: applied"]
    : [];
}

function getFinalMessageNormalizerWarnings(
  ...results: readonly {
    readonly normalized: boolean;
  }[]
): readonly string[] {
  return results.some((result) => result.normalized)
    ? ["final message normalizer: applied"]
    : [];
}

function attachDeterministicProfileTable(input: {
  readonly parsed: unknown;
  readonly evidencePacket: ComprehensiveReportEvidencePacket;
  readonly mbtiType: string;
  readonly profileTable?: ComprehensiveReportV2ProfileTable;
}): unknown {
  if (
    typeof input.parsed !== "object" ||
    input.parsed === null ||
    Array.isArray(input.parsed) ||
    !("version" in input.parsed) ||
    input.parsed.version !== "comprehensive_v2_draft"
  ) {
    return input.parsed;
  }

  return {
    ...input.parsed,
    profileTable:
      input.profileTable ??
      buildComprehensiveReportV2ProfileTable({
        evidencePacket: input.evidencePacket,
        mbtiType: input.mbtiType,
      }),
    ...(input.evidencePacket.sajuFeatureSpotlight === undefined
      ? {}
      : { sajuFeatureSpotlight: input.evidencePacket.sajuFeatureSpotlight }),
    ...(input.evidencePacket.sajuSignatureScenes === undefined
      ? {}
      : { sajuSignatureScenes: input.evidencePacket.sajuSignatureScenes }),
    ...(input.evidencePacket.reportDifferentiationModules === undefined
      ? {}
      : {
          reportDifferentiationModules:
            input.evidencePacket.reportDifferentiationModules,
        }),
    ...(input.evidencePacket.sajuSymbolicNickname === undefined
      ? {}
      : { sajuSymbolicNickname: input.evidencePacket.sajuSymbolicNickname }),
  };
}

type DirectHitSceneRescueResult<T> = {
  readonly draft: T;
  readonly rescued: boolean;
};

const personalitySceneMarkers = [
  "회의",
  "사람들과 대화",
  "카톡",
  "DM",
  "수업",
  "팀플",
  "팀원",
  "설명",
  "오류",
  "결론",
  "담당자",
  "기준표",
  "마감",
  "상대 말",
] as const;
const personalityEvidenceMarkers = [
  "현침살",
  "갑신일주",
  "MBTI",
  "편관",
  "정관",
  "귀문관살",
] as const;

const directHitRescueChapterIds = [
  "saju_identity",
  "personality_pattern",
  "work_money_study",
  "love_relationships",
  "people_family_environment",
] as const satisfies readonly ComprehensiveReportV2ChapterId[];
type DirectHitRescueChapterId = (typeof directHitRescueChapterIds)[number];

const directHitSceneMarkersByChapter = {
  saju_identity: [
    "압박이 걸리는 자리",
    "기준을 빨리 세우고",
    "판을 정리",
    "상대가",
    "결론",
    "도움을 요청",
    "혼자 정리",
    "돈이 들어오면",
    "묶어둘지",
    "사람들과 대화",
    "허점",
    "돈 쓰는 방식",
  ],
  personality_pattern: personalitySceneMarkers,
  work_money_study: [
    "돈이 들어오면",
    "계좌",
    "전문서",
    "자격증",
    "목차",
    "사업 아이디어",
    "고객 기반",
    "반복 수익",
    "실전 적용",
  ],
  love_relationships: [
    "상대가 서운함",
    "호감은 있는데",
    "업무 보고처럼",
    "말투가 정리",
    "다음에 어떻게 할 건데",
    "감정 표현",
    "연락",
    "약속",
  ],
  people_family_environment: [
    "가족",
    "팀",
    "부탁",
    "담당자",
    "마감",
    "기준표",
    "누가 무엇을",
    "정리해 주는 사람",
  ],
} as const satisfies Record<DirectHitRescueChapterId, readonly string[]>;

const directHitEvidenceMarkersByChapter = {
  saju_identity: [
    "갑신일주",
    "편관",
    "정관",
    "천을귀인",
    "무인성",
    "재고귀인",
    "편재",
    "정재",
    "현침살",
  ],
  personality_pattern: personalityEvidenceMarkers,
  work_money_study: [
    "재고귀인",
    "금여록",
    "편재",
    "정재",
    "MBTI",
    "갑신일주",
  ],
  love_relationships: [
    "홍염살",
    "원진살",
    "화 부족",
    "수 부족",
    "무식상",
    "MBTI",
  ],
  people_family_environment: [
    "장성살",
    "정관",
    "편관",
    "천을귀인",
    "무인성",
    "현침살",
    "MBTI",
  ],
} as const satisfies Record<DirectHitRescueChapterId, readonly string[]>;

const directHitRescueFeatureIdsByChapter = {
  saju_identity: [
    "day_pillar_gapsin",
    "ten_god_qi_sha",
    "ten_god_zheng_guan",
    "gwiin_cheoneul",
    "structure_no_resource",
    "gwiin_jaego",
    "ten_god_pian_cai",
    "ten_god_zheng_cai",
    "sinsal_hyeonchim",
  ],
  work_money_study: [
    "gwiin_jaego",
    "gwiin_geumyeorok",
    "ten_god_pian_cai",
    "ten_god_zheng_cai",
    "ten_god_qi_sha",
    "ten_god_zheng_guan",
    "element_earth_excess",
    "structure_jaeda_sinyak",
    "day_pillar_gapsin",
  ],
  love_relationships: [
    "sinsal_hongyeom",
    "sinsal_wonjin",
    "element_fire_missing",
    "element_water_missing",
    "structure_no_output",
  ],
  people_family_environment: [
    "twelve_sinsal_jangseong",
    "ten_god_zheng_guan",
    "ten_god_qi_sha",
    "gwiin_cheoneul",
    "structure_no_resource",
    "sinsal_hyeonchim",
    "sinsal_wonjin",
  ],
} as const;

function hasAnyMarker(text: string, markers: readonly string[]): boolean {
  return markers.some((marker) => text.includes(marker));
}

function isV2DraftWithDeterministicFields(
  value: unknown,
): value is ComprehensiveReportV2Draft {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    "version" in value &&
    value.version === "comprehensive_v2_draft" &&
    "productType" in value &&
    value.productType === "saju_mbti_full" &&
    "profileTable" in value &&
    "chapters" in value &&
    Array.isArray(value.chapters)
  );
}

function getChapterDirectHitText(chapter: ComprehensiveReportV2Chapter): string {
  return [
    ...chapter.hitReadingLines,
    chapter.body,
  ].join("\n");
}

function hasPersonalityDirectHitScene(chapter: ComprehensiveReportV2Chapter): boolean {
  const text = getChapterDirectHitText(chapter);

  return (
    hasAnyMarker(text, personalitySceneMarkers) &&
    hasAnyMarker(text, personalityEvidenceMarkers)
  );
}

function isDirectHitRescueChapterId(
  chapterId: ComprehensiveReportV2ChapterId,
): chapterId is DirectHitRescueChapterId {
  return (directHitRescueChapterIds as readonly string[]).includes(chapterId);
}

function hasChapterDirectHitScene(chapter: ComprehensiveReportV2Chapter): boolean {
  if (!isDirectHitRescueChapterId(chapter.chapterId)) {
    return false;
  }

  if (chapter.chapterId === "personality_pattern") {
    return hasPersonalityDirectHitScene(chapter);
  }

  const text = getChapterDirectHitText(chapter);

  return (
    hasAnyMarker(text, directHitSceneMarkersByChapter[chapter.chapterId]) &&
    hasAnyMarker(text, directHitEvidenceMarkersByChapter[chapter.chapterId])
  );
}

function getDirectHitRescueFeatureIds(
  draft: ComprehensiveReportV2Draft,
  evidencePacket?: ComprehensiveReportEvidencePacket,
): ReadonlySet<string> {
  const featureIds = new Set<string>();
  const profileFeatureIdsByLabel: Record<string, readonly string[]> = {
    "갑신": ["day_pillar_gapsin"],
    "갑신일주": ["day_pillar_gapsin"],
    "재고귀인": ["gwiin_jaego"],
    "금여록": ["gwiin_geumyeorok"],
    "천을귀인": ["gwiin_cheoneul"],
    "암록": ["gwiin_amrok"],
    "편재": ["ten_god_pian_cai"],
    "정재": ["ten_god_zheng_cai"],
    "편관": ["ten_god_qi_sha"],
    "정관": ["ten_god_zheng_guan"],
    "재다신약": ["structure_jaeda_sinyak"],
    "무인성": ["structure_no_resource"],
    "무식상": ["structure_no_output"],
    "현침살": ["sinsal_hyeonchim"],
    "홍염살": ["sinsal_hongyeom"],
    "원진살": ["sinsal_wonjin"],
    "화 부족": ["element_fire_missing"],
    "수 부족": ["element_water_missing"],
    "토 과다": ["element_earth_excess"],
  };
  const addProfileLabels = (labels: readonly string[] | undefined) => {
    for (const label of labels ?? []) {
      for (const featureId of profileFeatureIdsByLabel[label] ?? []) {
        featureIds.add(featureId);
      }
    }
  };

  addProfileLabels(draft.profileTable.tenGodSummary);
  addProfileLabels(draft.profileTable.specialPatterns);
  addProfileLabels(draft.profileTable.sinsal);
  addProfileLabels(draft.profileTable.majorSinsal);
  addProfileLabels(draft.profileTable.gwiin);
  addProfileLabels(draft.profileTable.gwiinGilshin);
  addProfileLabels(draft.profileTable.excessiveElements);
  addProfileLabels(draft.profileTable.missingElements);
  addProfileLabels([
    draft.profileTable.dayPillar,
    draft.profileTable.dayMaster,
  ].filter((label): label is string => label !== undefined));

  for (const chapterEvidence of evidencePacket?.selectedSajuFeatureEvidence ?? []) {
    for (const feature of chapterEvidence.features) {
      featureIds.add(feature.id);
    }
  }
  for (const scene of draft.sajuSignatureScenes ?? []) {
    for (const featureId of scene.featureIds) {
      featureIds.add(featureId);
    }
  }
  for (const group of draft.sajuFeatureSpotlight?.groups ?? []) {
    for (const item of group.items) {
      featureIds.add(item.featureId);
    }
  }
  for (const differentiationModule of evidencePacket?.reportDifferentiationModules ?? []) {
    for (const item of differentiationModule.items) {
      for (const featureId of item.sourceFeatureIds) {
        featureIds.add(featureId);
      }
    }
  }

  return featureIds;
}

function hasFeatureId(
  featureIds: ReadonlySet<string>,
  featureId: string,
): boolean {
  return featureIds.has(featureId);
}

function hasAnyFeatureId(
  featureIds: ReadonlySet<string>,
  candidates: readonly string[],
): boolean {
  return candidates.some((featureId) => featureIds.has(featureId));
}

function hasChapterRescueFeature(
  input: {
    readonly chapterId: Exclude<DirectHitRescueChapterId, "personality_pattern">;
    readonly featureIds: ReadonlySet<string>;
  },
): boolean {
  return hasAnyFeatureId(
    input.featureIds,
    directHitRescueFeatureIdsByChapter[input.chapterId],
  );
}

function buildSajuIdentityDirectHitRescue(input: {
  readonly draft: ComprehensiveReportV2Draft;
  readonly featureIds: ReadonlySet<string>;
}): string | undefined {
  const hasGapsinOfficer =
    hasFeatureId(input.featureIds, "day_pillar_gapsin") &&
    hasAnyFeatureId(input.featureIds, [
      "ten_god_qi_sha",
      "ten_god_zheng_guan",
    ]);
  const hasHelpRequestPattern =
    hasFeatureId(input.featureIds, "gwiin_cheoneul") &&
    hasFeatureId(input.featureIds, "structure_no_resource");
  const hasMoneyStorage =
    hasFeatureId(input.featureIds, "gwiin_jaego") &&
    hasFeatureId(input.featureIds, "ten_god_pian_cai") &&
    hasFeatureId(input.featureIds, "ten_god_zheng_cai");
  const hasSharpReading = hasFeatureId(input.featureIds, "sinsal_hyeonchim");

  if (hasGapsinOfficer) {
    return [
      "갑신일주는 큰 나무가 날카로운 금 위에 선 모습이라, 압박이 걸리는 자리에서 오히려 기준을 빨리 세우고 판을 정리하려는 모습으로 드러날 수 있습니다.",
      "편관이나 정관의 역할 감각이 함께 있으면 문제가 생겼을 때 흩어진 말보다 먼저 책임선, 순서, 결정 기준을 잡으려는 쪽으로 움직이기 쉽습니다.",
    ].join(" ");
  }

  if (hasHelpRequestPattern) {
    return [
      "천을귀인이 있어 도움의 통로는 있지만, 무인성이 함께 보이면 막히는 순간 바로 기대기보다 한참 혼자 정리한 뒤에야 도움을 요청하는 장면이 생길 수 있습니다.",
      "이 사주의 기본 형상은 혼자 버티는 힘과 도움을 받는 통로가 같이 있으므로, 필요한 것을 짧게 말로 꺼낼수록 귀인의 흐름이 더 빨리 살아납니다.",
    ].join(" ");
  }

  if (hasMoneyStorage) {
    return [
      "재고귀인과 편재, 정재가 함께 있으면 돈이 들어오면 쓰는 즐거움보다 어디에 묶어둘지 먼저 생각하는 식으로 나타날 수 있습니다.",
      "자원을 흘려보내기보다 계좌, 기록, 반복 수익처럼 남는 자리를 정할 때 이 사주의 현실 감각이 더 선명해집니다.",
    ].join(" ");
  }

  if (hasSharpReading) {
    return [
      "현침살이 잡히면 사람들과 대화할 때 상대의 설명을 끝까지 듣기 전에도 핵심과 허점이 먼저 보이는 장면이 생길 수 있습니다.",
      "이 예리함은 사주의 기본 형상 안에서 검수와 판단의 힘이 되지만, 바로 말하면 상대에게는 평가처럼 들릴 수 있어 전달 순서가 중요합니다.",
    ].join(" ");
  }

  return undefined;
}

function buildWorkMoneyStudyDirectHitRescue(input: {
  readonly draft: ComprehensiveReportV2Draft;
  readonly featureIds: ReadonlySet<string>;
}): string | undefined {
  const hasMoneyStorage =
    hasFeatureId(input.featureIds, "gwiin_jaego") &&
    hasAnyFeatureId(input.featureIds, [
      "ten_god_pian_cai",
      "ten_god_zheng_cai",
    ]);
  const hasMoneyLuck =
    hasFeatureId(input.featureIds, "gwiin_geumyeorok") ||
    hasMoneyStorage;
  const hasOfficerOrDayPillar = hasAnyFeatureId(input.featureIds, [
    "ten_god_qi_sha",
    "ten_god_zheng_guan",
    "day_pillar_gapsin",
  ]);

  if (hasMoneyStorage || hasMoneyLuck) {
    return [
      "돈이 들어오면 단순히 쓰고 싶은 마음보다 '이걸 어디에 묶어둘까'가 먼저 떠오를 수 있습니다.",
      "사업 아이디어를 볼 때도 단순 매출보다 고객 기반, 기록, 반복 수익처럼 남는 구조를 먼저 보게 되는 장면이 자연스럽습니다.",
      "이 흐름은 재고귀인과 편재·정재의 자원 감각이 입력한 MBTI의 효율 감각과 함께 움직일 때 더 선명해집니다.",
    ].join(" ");
  }

  if (hasOfficerOrDayPillar) {
    return [
      "전문서를 읽을 때도 처음부터 끝까지 읽기보다 목차를 훑고 '이걸 어디에 써먹지?'부터 찾는 장면이 자연스럽습니다.",
      "자격증이나 업무 공부도 흥미만으로 오래 가기보다 실전 적용과 역할이 보일 때 집중이 붙습니다.",
      "갑신일주와 정관·편관의 기준 감각이 입력한 MBTI의 목표 지향과 함께 작동하는 흐름입니다.",
    ].join(" ");
  }

  return undefined;
}

function buildLoveRelationshipsDirectHitRescue(input: {
  readonly draft: ComprehensiveReportV2Draft;
  readonly featureIds: ReadonlySet<string>;
}): string | undefined {
  const hasExpressionPattern =
    hasFeatureId(input.featureIds, "sinsal_hongyeom") &&
    hasAnyFeatureId(input.featureIds, [
      "element_fire_missing",
      "structure_no_output",
    ]);
  const hasFrictionPattern =
    hasFeatureId(input.featureIds, "sinsal_wonjin") &&
    hasFeatureId(input.featureIds, "element_water_missing");
  const hasCoolingOrExpressionNeed = hasAnyFeatureId(input.featureIds, [
    "element_fire_missing",
    "element_water_missing",
    "structure_no_output",
  ]);

  if (hasExpressionPattern) {
    return [
      "호감은 있는데 말투가 너무 정리돼서, 상대가 애정 표현이 아니라 업무 보고처럼 느끼는 순간이 생길 수 있습니다.",
      "홍염살의 끌림은 있지만 화 부족과 무식상이 겹치면 감정 표현의 온도가 늦게 올라오는 식입니다.",
      "입력한 MBTI의 해결 중심 성향까지 붙으면 연락이나 약속에서도 감정보다 다음 행동이 먼저 보일 수 있습니다.",
    ].join(" ");
  }

  if (hasFrictionPattern || hasCoolingOrExpressionNeed) {
    return [
      "상대가 서운함을 길게 말하고 있는데, 속으로 '그래서 다음에 어떻게 할 건데?'가 먼저 떠오를 수 있습니다.",
      "마음이 없는 게 아니라 감정을 오래 머무르게 두기보다 해결 가능한 형태로 바꾸려는 습관이 먼저 켜지는 장면입니다.",
      "원진살과 수 부족, 또는 화 부족의 표현 속도가 입력한 MBTI의 결론 지향과 맞물릴 때 더 선명해집니다.",
    ].join(" ");
  }

  return undefined;
}

function buildPeopleFamilyEnvironmentDirectHitRescue(input: {
  readonly draft: ComprehensiveReportV2Draft;
  readonly featureIds: ReadonlySet<string>;
}): string | undefined {
  const peopleSceneEvidenceFeatureIds = new Set(
    (input.draft.sajuSignatureScenes ?? [])
      .filter((scene) =>
        scene.topics.some((topic) =>
          ["family", "relationship"].includes(topic),
        ),
      )
      .flatMap((scene) => scene.featureIds),
  );
  const hasRoleCenter =
    (hasFeatureId(input.featureIds, "twelve_sinsal_jangseong") ||
      hasFeatureId(peopleSceneEvidenceFeatureIds, "twelve_sinsal_jangseong")) &&
    (hasAnyFeatureId(input.featureIds, [
      "ten_god_qi_sha",
      "ten_god_zheng_guan",
    ]) ||
      hasAnyFeatureId(peopleSceneEvidenceFeatureIds, [
        "ten_god_qi_sha",
        "ten_god_zheng_guan",
      ]));
  const hasHelpRequestPattern =
    (hasFeatureId(input.featureIds, "gwiin_cheoneul") ||
      hasFeatureId(peopleSceneEvidenceFeatureIds, "gwiin_cheoneul")) &&
    (hasFeatureId(input.featureIds, "structure_no_resource") ||
      hasFeatureId(peopleSceneEvidenceFeatureIds, "structure_no_resource"));
  const sharpRelationFeatureIds = [
    "sinsal_hyeonchim",
    "sinsal_wonjin",
    "ten_god_qi_sha",
    "ten_god_zheng_guan",
  ] as const;
  const hasSharpRelationPattern =
    hasAnyFeatureId(input.featureIds, sharpRelationFeatureIds) ||
    hasAnyFeatureId(peopleSceneEvidenceFeatureIds, sharpRelationFeatureIds);

  if (hasRoleCenter) {
    return [
      "가족이나 팀에서 누가 무엇을 맡는지 흐리면, 대화의 감정보다 담당자·마감·기준표부터 정리하고 싶어질 수 있습니다.",
      "이 장면은 장성살의 중심성, 정관·편관의 역할 의식, 입력한 MBTI의 운영 감각이 같이 움직일 때 자주 나타납니다.",
      "수업, 팀플, 알바나 업무에서 말이 길어질수록 감정의 결보다 역할표, 일정, 책임선을 먼저 세우고 싶어지는 식으로 드러날 수 있습니다.",
      "그래서 주변에서는 자연스럽게 당신을 정리해 주는 사람으로 기대할 수 있지만, 맡을 범위를 먼저 나누어야 부담이 한쪽으로 쌓이지 않습니다.",
    ].join(" ");
  }

  if (hasHelpRequestPattern) {
    return [
      "부탁을 받으면 거절보다 해결이 먼저 나와서, 나중에는 주변 사람들이 당신을 '정리해 주는 사람'으로 기대하는 흐름이 생길 수 있습니다.",
      "천을귀인이 도움의 통로를 주더라도 무인성이 있으면 정작 도움 요청은 늦어질 수 있습니다.",
      "팀이나 가족 안에서는 담당자, 마감, 기준표를 말로 꺼내야 부담이 한 사람에게만 쌓이지 않습니다.",
      "업무에서 막힌 일을 혼자 끌고 가다가 뒤늦게 사람에게 물어보면 생각보다 빨리 풀리는 장면도 이 흐름과 맞닿아 있습니다.",
    ].join(" ");
  }

  if (hasSharpRelationPattern) {
    return [
      "가족이나 팀에서 역할이 흐려지면, 감정보다 담당자와 마감, 기준표를 먼저 정리하고 싶어질 수 있습니다.",
      "현침살의 빠른 판단과 정관·편관의 역할 의식이 입력한 MBTI의 운영 감각과 겹치면 이런 장면이 더 선명해집니다.",
      "사람들과 대화하거나 팀플과 업무에서 말이 길어질수록 핵심 오류, 담당자, 다음 일정이 먼저 보이고, 가까운 사람에게도 같은 정리 속도가 나올 수 있습니다.",
      "주변에서는 자연스럽게 당신을 정리해 주는 사람으로 기대할 수 있으니, 부탁을 받기 전에 맡을 범위를 먼저 나누는 편이 좋습니다.",
    ].join(" ");
  }

  return undefined;
}

function buildPersonalityDirectHitRescue(input: {
  readonly draft: ComprehensiveReportV2Draft;
}): string | undefined {
  const scenes = input.draft.sajuSignatureScenes ?? [];
  const preferredScene =
    scenes.find(
      (scene) =>
        scene.topics.includes("personality") &&
        scene.featureLabels.includes("현침살"),
    ) ??
    scenes.find(
      (scene) =>
        scene.topics.includes("personality") &&
        scene.featureLabels.some((label) => ["갑신일주", "편관", "정관"].includes(label)),
    ) ??
    scenes.find((scene) => scene.topics.includes("personality"));

  if (preferredScene === undefined) {
    return undefined;
  }

  const sceneLine = preferredScene.sceneLines?.[0] ?? preferredScene.sceneLine;
  const interpretationLine = preferredScene.interpretationLine;
  const selectedEvidenceLine =
    preferredScene.featureLabels.includes("현침살")
      ? "이 흐름은 현침살의 빠른 오류 감지와 입력한 MBTI의 결론 처리 성향이 겹칠 때 더 선명해집니다."
      : preferredScene.featureLabels.includes("갑신일주") &&
          preferredScene.featureLabels.some((label) =>
            ["편관", "정관"].includes(label),
          )
        ? "이 흐름은 갑신일주가 압박 속에서 기준을 세우고 편관·정관의 역할 감각이 붙을 때 더 선명해집니다."
        : undefined;
  const rescueText = [
    sceneLine,
    interpretationLine,
    selectedEvidenceLine,
  ]
    .filter((line): line is string => line !== undefined && line.trim().length > 0)
    .join(" ");

  if (
    !hasAnyMarker(sceneLine, personalitySceneMarkers) ||
    !hasAnyMarker(
      `${rescueText}\n${preferredScene.featureLabels.join("\n")}`,
      personalityEvidenceMarkers,
    )
  ) {
    return undefined;
  }

  return rescueText;
}

function buildDirectHitRescueText(input: {
  readonly draft: ComprehensiveReportV2Draft;
  readonly chapterId: DirectHitRescueChapterId;
  readonly featureIds: ReadonlySet<string>;
}): string | undefined {
  if (input.chapterId === "personality_pattern") {
    return buildPersonalityDirectHitRescue({ draft: input.draft });
  }
  if (!hasChapterRescueFeature({
    chapterId: input.chapterId,
    featureIds: input.featureIds,
  })) {
    return undefined;
  }

  if (input.chapterId === "saju_identity") {
    return buildSajuIdentityDirectHitRescue(input);
  }
  if (input.chapterId === "work_money_study") {
    return buildWorkMoneyStudyDirectHitRescue(input);
  }
  if (input.chapterId === "love_relationships") {
    return buildLoveRelationshipsDirectHitRescue(input);
  }
  if (input.chapterId === "people_family_environment") {
    return buildPeopleFamilyEnvironmentDirectHitRescue(input);
  }

  return undefined;
}

function ensureDirectHitSceneForChapter<T>(
  draft: T,
  evidencePacket?: ComprehensiveReportEvidencePacket,
): DirectHitSceneRescueResult<T> {
  if (!isV2DraftWithDeterministicFields(draft)) {
    return { draft, rescued: false };
  }

  const featureIds = getDirectHitRescueFeatureIds(draft, evidencePacket);
  let rescued = false;
  const rescuedChapters = draft.chapters.map((chapter) => {
    if (
      !isDirectHitRescueChapterId(chapter.chapterId) ||
      hasChapterDirectHitScene(chapter)
    ) {
      return chapter;
    }

    const rescueText = buildDirectHitRescueText({
      draft,
      chapterId: chapter.chapterId,
      featureIds,
    });

    if (rescueText === undefined) {
      return chapter;
    }

    rescued = true;

    return {
      ...chapter,
      hitReadingLines: [
        rescueText,
        ...chapter.hitReadingLines,
      ],
      body: `${rescueText}\n\n${chapter.body}`.trim(),
      mbtiTermsUsed:
        rescueText.includes(draft.profileTable.mbti) &&
        !chapter.mbtiTermsUsed.includes(draft.profileTable.mbti)
          ? [...chapter.mbtiTermsUsed, draft.profileTable.mbti]
          : chapter.mbtiTermsUsed,
    };
  });

  if (!rescued) {
    return { draft, rescued: false };
  }

  const rescuedDraft = {
    ...draft,
    chapters: rescuedChapters,
  } as T;

  return { draft: rescuedDraft, rescued: true };
}

export async function generateComprehensiveReportDraft(input: {
  readonly userDisplayName?: string;
  readonly mbtiType: string;
  readonly evidencePacket: ComprehensiveReportEvidencePacket;
  readonly profileTable?: ComprehensiveReportV2ProfileTable;
  readonly config: OpenAIReportWriterClientConfig;
}): Promise<{
  readonly draft: ComprehensiveReportDraft;
  readonly rawText: string;
  readonly warnings: readonly string[];
}> {
  const allowedSajuTerms = deriveAllowedSajuTermsFromEvidencePacket(input.evidencePacket);
  const messages = buildOpenAIComprehensiveReportWriterMessages({
    userDisplayName: input.userDisplayName,
    mbtiType: input.mbtiType,
    evidencePacket: input.evidencePacket,
    allowedSajuTerms,
  });
  let result: Awaited<ReturnType<typeof callOpenAIReportWriter>>;

  try {
    result = await callOpenAIReportWriter({
      config: input.config,
      messages,
      jsonSchema: openAIComprehensiveReportV2NarrativeDraftJsonSchema,
    });
  } catch (error) {
    throw new SafeReportGenerationFailure({
      code: getSafeCauseCode(error),
      stage: "openai",
      ...getOpenAIRequestDiagnostics(error),
    });
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(result.rawText) as unknown;
  } catch {
    throw new SafeReportGenerationFailure({
      code: "OPENAI_REPORT_WRITER_INVALID_JSON",
      stage: "json_parse",
      validationErrors: ["JSON_PARSE_FAILED"],
    });
  }

  const sanitizedInitial = sanitizeParsedNarrativeDraft(parsed);
  const draftCandidate = attachDeterministicProfileTable({
    parsed: sanitizedInitial.parsed,
    evidencePacket: input.evidencePacket,
    mbtiType: input.mbtiType,
    profileTable: input.profileTable,
  });
  const directHitInitial = ensureDirectHitSceneForChapter(
    draftCandidate,
    input.evidencePacket,
  );
  const normalizedInitial = normalizeComprehensiveReportFinalMessage(
    directHitInitial.draft,
  );
  const validation = validateComprehensiveReportDraft(normalizedInitial.draft, {
    allowedSajuTerms,
    allowedMbtiTerms: [input.mbtiType],
  });

  if (!validation.ok || validation.value === undefined) {
    if (!areAllDraftValidationErrorsRepairable(validation.errors)) {
      throw new SafeReportGenerationFailure({
        code: "OPENAI_REPORT_WRITER_INVALID_JSON",
        stage: "draft_validation",
        validationErrors: validation.errors,
      });
    }

    const repairMessages = buildOpenAIComprehensiveReportRepairMessages({
      userDisplayName: input.userDisplayName,
      mbtiType: input.mbtiType,
      allowedSajuTerms,
      draftJson: JSON.stringify(sanitizedInitial.parsed, null, 2),
      validationErrors: validation.errors,
    });
    let repairResult: Awaited<ReturnType<typeof callOpenAIReportWriter>>;

    try {
      repairResult = await callOpenAIReportWriter({
        config: input.config,
        messages: repairMessages,
        jsonSchema: openAIComprehensiveReportV2NarrativeDraftJsonSchema,
      });
    } catch (error) {
      throw new SafeReportGenerationFailure({
        code: getSafeCauseCode(error),
        stage: "openai",
        repairAttempted: true,
        repairPassed: false,
        ...getOpenAIRequestDiagnostics(error),
      });
    }

    let repairParsed: unknown;

    try {
      repairParsed = JSON.parse(repairResult.rawText) as unknown;
    } catch {
      throw new SafeReportGenerationFailure({
        code: "OPENAI_REPORT_WRITER_INVALID_JSON",
        stage: "json_parse",
        validationErrors: ["REPAIR_JSON_PARSE_FAILED"],
        repairAttempted: true,
        repairPassed: false,
      });
    }

    const sanitizedRepair = sanitizeParsedNarrativeDraft(repairParsed);
    const sanitizerWarnings = getCopySanitizerWarnings(
      sanitizedInitial,
      sanitizedRepair,
    );
    const repairDraftCandidate = attachDeterministicProfileTable({
      parsed: sanitizedRepair.parsed,
      evidencePacket: input.evidencePacket,
      mbtiType: input.mbtiType,
      profileTable: input.profileTable,
    });
    const directHitRepair = ensureDirectHitSceneForChapter(
      repairDraftCandidate,
      input.evidencePacket,
    );
    const normalizedRepair = normalizeComprehensiveReportFinalMessage(
      directHitRepair.draft,
    );
    const normalizerWarnings = getFinalMessageNormalizerWarnings(
      normalizedInitial,
      normalizedRepair,
    );
    const repairValidation = validateComprehensiveReportDraft(normalizedRepair.draft, {
      allowedSajuTerms,
      allowedMbtiTerms: [input.mbtiType],
    });

    if (!repairValidation.ok || repairValidation.value === undefined) {
      const postRepairValidation = validateComprehensiveReportDraftAfterRepair(
        normalizedRepair.draft,
        {
          allowedSajuTerms,
          allowedMbtiTerms: [input.mbtiType],
        },
      );

      if (postRepairValidation.ok && postRepairValidation.value !== undefined) {
        return {
          draft: postRepairValidation.value,
          rawText: repairResult.rawText,
          warnings: [
            ...sanitizerWarnings,
            ...normalizerWarnings,
            "quality repair: attempted",
            "quality repair: passed with warnings",
            ...(postRepairValidation.warnings ?? []),
          ],
        };
      }

      throw new SafeReportGenerationFailure({
        code: "OPENAI_REPORT_WRITER_INVALID_JSON",
        stage: "draft_validation",
        validationErrors: repairValidation.errors,
        repairAttempted: true,
        repairPassed: false,
      });
    }

    const repairWarnings = repairValidation.warnings ?? [];

    return {
      draft: repairValidation.value,
      rawText: repairResult.rawText,
      warnings: [
        ...sanitizerWarnings,
        ...normalizerWarnings,
        "quality repair: attempted",
        repairWarnings.length > 0
          ? "quality repair: passed with warnings"
          : "quality repair: passed",
        ...repairWarnings,
      ],
    };
  }

  return {
    draft: validation.value,
    rawText: result.rawText,
    warnings: [
      ...getCopySanitizerWarnings(sanitizedInitial),
      ...getFinalMessageNormalizerWarnings(normalizedInitial),
      ...(validation.warnings ?? []),
    ],
  };
}
