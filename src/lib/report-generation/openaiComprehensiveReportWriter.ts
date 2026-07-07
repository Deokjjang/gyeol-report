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
  ComprehensiveReportV2SajuFeatureChapter,
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
  const particleResult = sanitizeKoreanParticleRegressions(result.draft);
  const repetitionResult = removeExcessiveLongSentenceRepetition(
    particleResult.value,
  );

  return {
    parsed: repetitionResult.value,
    sanitized:
      result.sanitized || particleResult.sanitized || repetitionResult.sanitized,
    sanitizedTerms: [
      ...result.sanitizedTerms,
      ...(particleResult.sanitized ? ["korean-particle-regression"] : []),
      ...(repetitionResult.sanitized ? ["long-sentence-repetition"] : []),
    ],
  };
}

function sanitizeKoreanParticleRegressionText(value: string): string {
  return value
    .replaceAll("정재" + "을", "정재를")
    .replaceAll("편재" + "을", "편재를")
    .replaceAll("토 과다" + "을", "토 과다를")
    .replaceAll("토 과다" + "은", "토 과다는")
    .replaceAll("편재" + "이", "편재가")
    .replaceAll("화개" + "은", "화개는")
    .replaceAll("편재은", "편재는")
    .replaceAll("정재은", "정재는")
    .replaceAll("갑신일주" + "을", "갑신일주를")
    .replaceAll("갑신일주" + "이", "갑신일주가")
    .replaceAll("갑신일주은", "갑신일주는")
    .replace(/([갑을병정무기경신임계][자축인묘진사오미신유술해]일주)은/gu, "$1는")
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

function normalizeSentenceForRepetition(sentence: string): string {
  return sentence
    .replace(/[“”"']/g, "")
    .replace(/\s+/g, " ")
    .replace(/[.!?。！？]+$/u, "")
    .trim();
}

function removeRepeatedLongSentencesFromText(
  value: string,
  counts: Map<string, number>,
): {
  readonly value: string;
  readonly sanitized: boolean;
} {
  const sentences = value.split(/(?<=[.!?。！？])\s+/u);
  let sanitized = false;
  const kept = sentences.filter((sentence) => {
    const normalized = normalizeSentenceForRepetition(sentence);

    if (normalized.length < 40) {
      return true;
    }

    const count = counts.get(normalized) ?? 0;
    counts.set(normalized, count + 1);

    if (count >= 2) {
      sanitized = true;
      return false;
    }

    return true;
  });

  return {
    value: kept.join(" ").trim(),
    sanitized,
  };
}

function removeExcessiveLongSentenceRepetition<T>(value: T): {
  readonly value: T;
  readonly sanitized: boolean;
} {
  const counts = new Map<string, number>();

  function visit(input: unknown): {
    readonly value: unknown;
    readonly sanitized: boolean;
  } {
    if (typeof input === "string") {
      return removeRepeatedLongSentencesFromText(input, counts);
    }
    if (Array.isArray(input)) {
      let sanitized = false;
      const nextValue = input.map((item) => {
        const result = visit(item);
        sanitized = sanitized || result.sanitized;

        return result.value;
      });

      return { value: nextValue, sanitized };
    }
    if (input !== null && typeof input === "object") {
      let sanitized = false;
      const nextValue = Object.fromEntries(
        Object.entries(input).map(([key, item]) => {
          const result = visit(item);
          sanitized = sanitized || result.sanitized;

          return [key, result.value];
        }),
      );

      return { value: nextValue, sanitized };
    }

    return { value: input, sanitized: false };
  }

  const result = visit(value);

  return {
    value: result.value as T,
    sanitized: result.sanitized,
  };
}

function removeExcessiveLongSentenceRepetitionFromNarrativeFields<T>(
  value: T,
): {
  readonly value: T;
  readonly sanitized: boolean;
} {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return {
      value,
      sanitized: false,
    };
  }

  const counts = new Map<string, number>();
  let sanitized = false;
  const sanitizeNarrativeValue = (input: unknown): unknown => {
    if (typeof input === "string") {
      const result = removeRepeatedLongSentencesFromText(input, counts);
      sanitized = sanitized || result.sanitized;

      return result.value;
    }
    if (Array.isArray(input)) {
      return input.map((item) => sanitizeNarrativeValue(item));
    }

    return input;
  };
  const draft = value as Record<string, unknown>;
  const next: Record<string, unknown> = { ...draft };

  for (const key of ["openingSummary", "coreLine", "finalAdvice"]) {
    if (typeof draft[key] === "string") {
      next[key] = sanitizeNarrativeValue(draft[key]);
    }
  }
  if (Array.isArray(draft.safetyNotes)) {
    next.safetyNotes = sanitizeNarrativeValue(draft.safetyNotes);
  }
  if (Array.isArray(draft.chapters)) {
    next.chapters = draft.chapters.map((chapter) => {
      if (chapter === null || typeof chapter !== "object" || Array.isArray(chapter)) {
        return chapter;
      }

      const candidate = chapter as Record<string, unknown>;

      return {
        ...candidate,
        ...(typeof candidate.headline === "string"
          ? { headline: sanitizeNarrativeValue(candidate.headline) }
          : {}),
        ...(Array.isArray(candidate.hitReadingLines)
          ? { hitReadingLines: sanitizeNarrativeValue(candidate.hitReadingLines) }
          : {}),
        ...(typeof candidate.body === "string"
          ? { body: sanitizeNarrativeValue(candidate.body) }
          : {}),
        ...(Array.isArray(candidate.solutionLines)
          ? { solutionLines: sanitizeNarrativeValue(candidate.solutionLines) }
          : {}),
      };
    });
  }
  if (Array.isArray(draft.longformReadings)) {
    next.longformReadings = draft.longformReadings.map((reading) => {
      if (reading === null || typeof reading !== "object" || Array.isArray(reading)) {
        return reading;
      }

      const candidate = reading as Record<string, unknown>;

      return {
        ...candidate,
        ...(typeof candidate.body === "string"
          ? { body: sanitizeNarrativeValue(candidate.body) }
          : {}),
      };
    });
  }

  return {
    value: next as T,
    sanitized,
  };
}

function sanitizeKoreanParticleRegressions<T>(value: T): {
  readonly value: T;
  readonly sanitized: boolean;
} {
  if (typeof value === "string") {
    const nextValue = sanitizeKoreanParticleRegressionText(value);

    return {
      value: nextValue as T,
      sanitized: nextValue !== value,
    };
  }
  if (Array.isArray(value)) {
    let sanitized = false;
    const nextValue = value.map((item) => {
      const result = sanitizeKoreanParticleRegressions(item);
      sanitized = sanitized || result.sanitized;

      return result.value;
    });

    return {
      value: nextValue as T,
      sanitized,
    };
  }
  if (value !== null && typeof value === "object") {
    let sanitized = false;
    const nextValue = Object.fromEntries(
      Object.entries(value).map(([key, item]) => {
        const result = sanitizeKoreanParticleRegressions(item);
        sanitized = sanitized || result.sanitized;

        return [key, result.value];
      }),
    );

    return {
      value: nextValue as T,
      sanitized,
    };
  }

  return {
    value,
    sanitized: false,
  };
}

function sanitizeFinalComprehensiveDraft<T>(draft: T): {
  readonly draft: T;
  readonly sanitized: boolean;
  readonly sanitizedTerms: readonly string[];
} {
  const particleResult = sanitizeKoreanParticleRegressions(draft);
  const repetitionResult = removeExcessiveLongSentenceRepetitionFromNarrativeFields(
    particleResult.value,
  );

  return {
    draft: repetitionResult.value,
    sanitized: particleResult.sanitized || repetitionResult.sanitized,
    sanitizedTerms: [
      ...(particleResult.sanitized ? ["korean-particle-regression"] : []),
      ...(repetitionResult.sanitized ? ["long-sentence-repetition"] : []),
    ],
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

export function buildDeterministicSajuFeatureChapter(
  evidencePacket: ComprehensiveReportEvidencePacket,
): ComprehensiveReportV2SajuFeatureChapter | undefined {
  const entries = evidencePacket.sajuFeatureDictionary
    ?.filter((entry) =>
      [
        entry.rawLabel,
        entry.userTitle,
        entry.plainMeaning,
        entry.howItShowsInYou,
        entry.strength,
        entry.fatiguePoint,
        entry.practicalUse,
      ].every((value) => value.trim().length > 0),
    )
    .slice(0, 6);

  if (entries === undefined || entries.length < 3) {
    return undefined;
  }

  return {
    titleKo: "명리 특징 해석",
    subtitleKo:
      "공통 만세력표는 근거표로 유지하고, 이 챕터는 신살·귀인·합충·지장간을 현실 언어로 풀어보는 해석입니다.",
    intro:
      "공통 만세력표에 표시되는 신살, 귀인, 합충, 지장간은 이름만 보면 어렵게 느껴질 수 있습니다. 이 챕터에서는 제공된 원국 특징을 사건 예언이 아니라 말투, 판단 속도, 도움을 요청하는 방식, 관계 반응, 일 처리 패턴, 회복 루틴으로 번역합니다.",
    items: entries.map((entry) => ({
      rawLabel: entry.rawLabel,
      userTitle: entry.userTitle,
      plainMeaning: entry.plainMeaning,
      howItShowsInYou: entry.howItShowsInYou,
      strength: entry.strength,
      fatiguePoint: entry.fatiguePoint,
      practicalUse: entry.practicalUse,
    })),
  };
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
  const sajuFeatureChapter = buildDeterministicSajuFeatureChapter(
    input.evidencePacket,
  );

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
    ...(sajuFeatureChapter === undefined ||
    "sajuFeatureChapter" in input.parsed
      ? {}
      : { sajuFeatureChapter }),
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
  "상대가 말",
  "원리상",
  "자료",
  "조건과 예외",
  "생각 정리",
] as const;
const personalityEvidenceMarkers = [
  "현침살",
  "갑신일주",
  "정축일주",
  "MBTI",
  "INTP",
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
    "원리상",
    "자료",
    "조건과 예외",
    "생각 정리",
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
    "예산 분류",
    "자료 정리",
    "자동저축",
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
    "원리",
    "자료",
    "조건과 예외",
  ],
} as const satisfies Record<DirectHitRescueChapterId, readonly string[]>;

const directHitEvidenceMarkersByChapter = {
  saju_identity: [
    "갑신일주",
    "정축일주",
    "편관",
    "정관",
    "천을귀인",
    "무인성",
    "재고귀인",
    "편재",
    "정재",
    "현침살",
    "식신",
    "INTP",
  ],
  personality_pattern: personalityEvidenceMarkers,
  work_money_study: [
    "재고귀인",
    "금여록",
    "편재",
    "정재",
    "MBTI",
    "INTP",
    "갑신일주",
    "정축일주",
    "식신",
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
    "INTP",
  ],
} as const satisfies Record<DirectHitRescueChapterId, readonly string[]>;

const directHitRescueFeatureIdsByChapter = {
  saju_identity: [
    "day_pillar_gapsin",
    "day_pillar_jeongchuk",
    "ten_god_qi_sha",
    "ten_god_zheng_guan",
    "ten_god_shi_shen",
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
    "day_pillar_jeongchuk",
    "ten_god_shi_shen",
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

function getChapterRescueSearchText(chapter: ComprehensiveReportV2Chapter): string {
  return [
    chapter.headline,
    ...chapter.hitReadingLines,
    chapter.body,
    ...chapter.solutionLines,
    ...chapter.keyPhrases,
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
    "정축": ["day_pillar_jeongchuk"],
    "정축일주": ["day_pillar_jeongchuk"],
    "재고귀인": ["gwiin_jaego"],
    "금여록": ["gwiin_geumyeorok"],
    "천을귀인": ["gwiin_cheoneul"],
    "암록": ["gwiin_amrok"],
    "편재": ["ten_god_pian_cai"],
    "정재": ["ten_god_zheng_cai"],
    "식신": ["ten_god_shi_shen"],
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

function getPresentFeatureLabels(
  featureIds: ReadonlySet<string>,
  candidates: readonly {
    readonly featureId: string;
    readonly label: string;
  }[],
): readonly string[] {
  return candidates
    .filter((candidate) => featureIds.has(candidate.featureId))
    .map((candidate) => candidate.label);
}

function joinKoreanFeatureLabels(labels: readonly string[]): string {
  if (labels.length === 0) {
    return "제공된 사주 항목";
  }

  return labels.join("·");
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
  const isIntp = input.draft.profileTable.mbti === "INTP";
  const hasJeongchukIntp =
    isIntp && hasFeatureId(input.featureIds, "day_pillar_jeongchuk");
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

  if (hasJeongchukIntp) {
    return [
      "정축일주는 차가운 흙 속의 작은 불씨처럼, 밖으로 바로 밀어붙이기보다 안에서 원리와 구조를 먼저 정리하는 모습으로 드러날 수 있습니다.",
      "INTP 성향이 함께 있으면 상대가 말하는 동안 바로 반박하기보다 원리상 어디가 맞지 않는지, 어떤 자료와 조건과 예외가 빠졌는지를 조용히 정리하는 장면이 생기기 쉽습니다.",
    ].join(" ");
  }

  if (hasGapsinOfficer) {
    const officerLabels = getPresentFeatureLabels(input.featureIds, [
      { featureId: "ten_god_qi_sha", label: "편관" },
      { featureId: "ten_god_zheng_guan", label: "정관" },
    ]);

    return [
      "갑신일주는 큰 나무가 날카로운 금 위에 선 모습이라, 압박이 걸리는 자리에서 오히려 기준을 빨리 세우고 판을 정리하려는 모습으로 드러날 수 있습니다.",
      `${joinKoreanFeatureLabels(officerLabels)}의 역할 감각이 함께 있으면 문제가 생겼을 때 흩어진 말보다 먼저 책임선, 순서, 결정 기준을 잡으려는 쪽으로 움직이기 쉽습니다.`,
    ].join(" ");
  }

  if (hasHelpRequestPattern) {
    return [
      "천을귀인이 있어 도움의 통로는 있지만, 무인성이 함께 보이면 막히는 순간 바로 기대기보다 한참 혼자 정리한 뒤에야 도움을 요청하는 장면이 생길 수 있습니다.",
      "이 사주의 기본 형상은 스스로 처리하려는 힘과 도움을 받는 통로가 같이 있으므로, 필요한 것을 짧게 말로 꺼낼수록 귀인의 흐름이 더 빨리 살아납니다.",
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
  const isIntp = input.draft.profileTable.mbti === "INTP";
  const hasJaego = hasFeatureId(input.featureIds, "gwiin_jaego");
  const hasMoneyStorage =
    hasJaego &&
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
    "day_pillar_jeongchuk",
    "ten_god_shi_shen",
  ]);

  if (isIntp && (hasJaego || hasMoneyLuck)) {
    return [
      "돈이나 자료가 들어오면 크게 확장하기보다 먼저 기록하고 예산 분류를 나누고 새는 곳을 막고 싶어질 수 있습니다.",
      "공부나 일에서도 바로 실행하기보다 자료 정리, 조건 비교, 자동저축처럼 조용히 쌓이는 구조를 만들 때 안정감이 살아납니다.",
      "이 흐름은 재고귀인의 저장 감각이 INTP의 분석과 검증 성향과 함께 움직일 때 더 선명해집니다.",
    ].join(" ");
  }

  if (hasMoneyStorage || hasMoneyLuck) {
    const moneyLabels = getPresentFeatureLabels(input.featureIds, [
      { featureId: "gwiin_jaego", label: "재고귀인" },
      { featureId: "gwiin_geumyeorok", label: "금여록" },
      { featureId: "ten_god_pian_cai", label: "편재" },
      { featureId: "ten_god_zheng_cai", label: "정재" },
    ]);

    return [
      "돈이 들어오면 단순히 쓰고 싶은 마음보다 '이걸 어디에 묶어둘까'가 먼저 떠오를 수 있습니다.",
      "사업 아이디어를 볼 때도 단순 매출보다 고객 기반, 기록, 반복 수익처럼 남는 구조를 먼저 보게 되는 장면이 자연스럽습니다.",
      `이 흐름은 ${joinKoreanFeatureLabels(moneyLabels)}의 자원 감각이 입력한 MBTI의 효율 감각과 함께 움직일 때 더 선명해집니다.`,
    ].join(" ");
  }

  if (hasOfficerOrDayPillar) {
    const workLabels = getPresentFeatureLabels(input.featureIds, [
      { featureId: "day_pillar_gapsin", label: "갑신일주" },
      { featureId: "day_pillar_jeongchuk", label: "정축일주" },
      { featureId: "ten_god_qi_sha", label: "편관" },
      { featureId: "ten_god_zheng_guan", label: "정관" },
      { featureId: "ten_god_shi_shen", label: "식신" },
    ]);

    return [
      "전문서를 읽을 때도 처음부터 끝까지 읽기보다 목차를 훑고 '이걸 어디에 써먹지?'부터 찾는 장면이 자연스럽습니다.",
      "자격증이나 업무 공부도 흥미만으로 오래 가기보다 실전 적용과 역할이 보일 때 집중이 붙습니다.",
      `${joinKoreanFeatureLabels(workLabels)}의 기준 감각이 입력한 MBTI의 목표 지향과 함께 작동하는 흐름입니다.`,
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
    const relationshipLabels = getPresentFeatureLabels(input.featureIds, [
      { featureId: "sinsal_hongyeom", label: "홍염살" },
      { featureId: "element_fire_missing", label: "화 부족" },
      { featureId: "structure_no_output", label: "무식상" },
    ]);

    return [
      "호감은 있는데 말투가 너무 정리돼서, 상대가 애정 표현이 아니라 업무 보고처럼 느끼는 순간이 생길 수 있습니다.",
      `${joinKoreanFeatureLabels(relationshipLabels)}의 관계 흐름이 겹치면 감정 표현의 온도가 늦게 올라오는 식입니다.`,
      "입력한 MBTI의 해결 중심 성향까지 붙으면 연락이나 약속에서도 감정보다 다음 행동이 먼저 보일 수 있습니다.",
    ].join(" ");
  }

  if (hasFrictionPattern || hasCoolingOrExpressionNeed) {
    const relationshipLabels = getPresentFeatureLabels(input.featureIds, [
      { featureId: "sinsal_wonjin", label: "원진살" },
      { featureId: "element_water_missing", label: "수 부족" },
      { featureId: "element_fire_missing", label: "화 부족" },
      { featureId: "structure_no_output", label: "무식상" },
    ]);

    return [
      "상대가 서운함을 길게 말하고 있는데, 속으로 '그래서 다음에 어떻게 할 건데?'가 먼저 떠오를 수 있습니다.",
      "마음이 없는 게 아니라 감정을 오래 머무르게 두기보다 해결 가능한 형태로 바꾸려는 습관이 먼저 켜지는 장면입니다.",
      `${joinKoreanFeatureLabels(relationshipLabels)}의 표현 속도가 입력한 MBTI의 결론 지향과 맞물릴 때 더 선명해집니다.`,
    ].join(" ");
  }

  return undefined;
}

function buildPeopleFamilyEnvironmentDirectHitRescue(input: {
  readonly draft: ComprehensiveReportV2Draft;
  readonly featureIds: ReadonlySet<string>;
}): string | undefined {
  const isIntp = input.draft.profileTable.mbti === "INTP";
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

  if (isIntp && hasHelpRequestPattern) {
    return [
      "가족이나 가까운 사람이 부탁을 꺼내거나 공부 자료가 막힐 때도 바로 결론을 내기보다, 먼저 원리와 조건을 확인하고 혼자 자료를 찾아보는 장면이 생길 수 있습니다.",
      "천을귀인의 도움 통로가 있어도 무인성이 함께 있으면 질문하기 전 안에서 너무 오래 검토하다가 요청이 늦어질 수 있습니다.",
      "그래서 막힌 지점은 완벽하게 정리된 뒤가 아니라, 자료와 조건과 예외를 짧게 나눈 상태에서 먼저 묻는 편이 부담을 줄입니다.",
    ].join(" ");
  }

  if (hasRoleCenter) {
    const roleLabels = getPresentFeatureLabels(input.featureIds, [
      { featureId: "twelve_sinsal_jangseong", label: "장성살" },
      { featureId: "ten_god_zheng_guan", label: "정관" },
      { featureId: "ten_god_qi_sha", label: "편관" },
    ]);

    return [
      "가족이나 팀에서 누가 무엇을 맡는지 흐리면, 대화의 감정보다 담당자·마감·기준표부터 정리하고 싶어질 수 있습니다.",
      `이 장면은 ${joinKoreanFeatureLabels(roleLabels)}의 역할 의식과 입력한 MBTI의 운영 감각이 같이 움직일 때 자주 나타납니다.`,
      "수업, 팀플, 알바나 업무에서 말이 길어질수록 감정의 결보다 역할표, 일정, 책임선을 먼저 세우고 싶어지는 식으로 드러날 수 있습니다.",
      "그래서 주변에서는 자연스럽게 당신을 정리해 주는 사람으로 기대할 수 있지만, 맡을 범위를 먼저 나누어야 부담이 한쪽으로 쌓이지 않습니다.",
    ].join(" ");
  }

  if (hasHelpRequestPattern) {
    return [
      "부탁을 받으면 거절보다 해결이 먼저 나와서, 나중에는 주변 사람들이 당신을 '정리해 주는 사람'으로 기대하는 흐름이 생길 수 있습니다.",
      "천을귀인이 도움의 통로를 주더라도 무인성이 있으면 정작 도움 요청은 늦어질 수 있습니다.",
      "팀이나 가족 안에서는 담당자, 마감, 기준표를 말로 꺼내야 부담이 한 사람에게만 쌓이지 않습니다.",
      "업무에서 막힌 일을 안에서 오래 붙잡다가 뒤늦게 사람에게 물어보면 생각보다 빨리 풀리는 장면도 이 흐름과 맞닿아 있습니다.",
    ].join(" ");
  }

  if (hasSharpRelationPattern) {
    const sharpLabels = getPresentFeatureLabels(input.featureIds, [
      { featureId: "sinsal_hyeonchim", label: "현침살" },
      { featureId: "sinsal_wonjin", label: "원진살" },
      { featureId: "ten_god_zheng_guan", label: "정관" },
      { featureId: "ten_god_qi_sha", label: "편관" },
    ]);

    return [
      "가족이나 팀에서 역할이 흐려지면, 감정보다 담당자와 마감, 기준표를 먼저 정리하고 싶어질 수 있습니다.",
      `${joinKoreanFeatureLabels(sharpLabels)}의 관계 감각이 입력한 MBTI의 운영 감각과 겹치면 이런 장면이 더 선명해집니다.`,
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
  const officerLabels = preferredScene.featureLabels.filter((label) =>
    ["편관", "정관"].includes(label),
  );
  const selectedEvidenceLine =
    preferredScene.featureLabels.includes("현침살")
      ? "이 흐름은 현침살의 빠른 오류 감지와 입력한 MBTI의 결론 처리 성향이 겹칠 때 더 선명해집니다."
      : preferredScene.featureLabels.includes("갑신일주") &&
          preferredScene.featureLabels.some((label) =>
            ["편관", "정관"].includes(label),
          )
        ? `이 흐름은 갑신일주가 압박 속에서 기준을 세우고 ${joinKoreanFeatureLabels(officerLabels)}의 역할 감각이 붙을 때 더 선명해집니다.`
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

const workMoneySolutionRescueFeatureIds = [
  "gwiin_jaego",
  "gwiin_geumyeorok",
  "gwiin_amrok",
  "ten_god_pian_cai",
  "ten_god_zheng_cai",
  "ten_god_qi_sha",
  "ten_god_zheng_guan",
  "ten_god_shi_shen",
  "element_earth_excess",
  "structure_jaeda_sinyak",
  "day_pillar_gapsin",
  "day_pillar_jeongchuk",
] as const;

function buildWorkMoneyStudySolutionRescueLines(input: {
  readonly draft: ComprehensiveReportV2Draft;
  readonly featureIds: ReadonlySet<string>;
}): readonly string[] {
  if (!hasAnyFeatureId(input.featureIds, workMoneySolutionRescueFeatureIds)) {
    return [];
  }

  const mbti = input.draft.profileTable.mbti;
  const isIntp = mbti === "INTP";
  const isEntj = mbti === "ENTJ";
  const hasJaego = hasFeatureId(input.featureIds, "gwiin_jaego");
  const hasMoneyExpansion = hasAnyFeatureId(input.featureIds, [
    "gwiin_geumyeorok",
    "ten_god_pian_cai",
    "ten_god_zheng_cai",
  ]);
  const hasStudyOrAnalysis = hasAnyFeatureId(input.featureIds, [
    "ten_god_shi_shen",
    "day_pillar_jeongchuk",
    "gwiin_amrok",
  ]);
  const hasRolePressure = hasAnyFeatureId(input.featureIds, [
    "element_earth_excess",
    "ten_god_qi_sha",
    "ten_god_zheng_guan",
    "structure_jaeda_sinyak",
    "day_pillar_gapsin",
  ]);
  const lines: string[] = [];

  if (isIntp && hasJaego) {
    lines.push(
      "돈은 들어오자마자 현금흐름, 저축, 자기계발 예산으로 나누고 자동이체를 먼저 걸어 두세요.",
    );
  } else if (isEntj && hasMoneyExpansion) {
    lines.push(
      "기회가 보이면 바로 확장하기보다, 수익이 남는 구조와 방어 규칙을 먼저 정하세요.",
    );
  } else if (hasJaego || hasMoneyExpansion) {
    lines.push(
      "돈은 들어오는 흐름과 지키는 흐름을 분리해 계좌와 기록으로 남겨 두세요.",
    );
  }

  if (isIntp && hasStudyOrAnalysis) {
    lines.push(
      "공부는 목차-핵심 개념-실전 적용 순서로 읽고, 한 장 끝날 때마다 바로 써먹을 예시를 적어 두세요.",
    );
  } else if (hasStudyOrAnalysis) {
    lines.push(
      "전문서나 자격증 공부는 목차, 핵심 개념, 실전 적용 순서로 나눠 기록하세요.",
    );
  }

  if (isEntj && hasRolePressure) {
    lines.push(
      "업무나 프로젝트는 담당자, 기준, 마감선을 먼저 나누고 본인이 다 끌고 가지 않게 하세요.",
    );
  } else if (hasRolePressure) {
    lines.push(
      "업무나 프로젝트는 기준이 흐릴 때 직접 정리하되, 맡을 일과 넘길 일을 처음부터 나눠 두세요.",
    );
  }

  if (lines.length < 3) {
    lines.push(
      "일과 공부 루틴은 기록, 실행, 점검을 한 번에 몰지 말고 작은 반복 단위로 나눠 두세요.",
    );
  }
  if (lines.length < 4) {
    lines.push(
      "프로젝트가 길어질 때는 오늘 할 일, 넘길 일, 확인할 일을 따로 적어 부담이 한곳에 쌓이지 않게 하세요.",
    );
  }
  if (lines.length < 4) {
    lines.push(
      "계좌, 기록, 루틴 중 하나를 정해 매주 같은 시간에 점검하는 기준을 만들어 두세요.",
    );
  }

  return lines.slice(0, 4);
}

function ensureWorkMoneyStudySolutionLines<T>(
  draft: T,
  evidencePacket?: ComprehensiveReportEvidencePacket,
): DirectHitSceneRescueResult<T> {
  if (!isV2DraftWithDeterministicFields(draft)) {
    return { draft, rescued: false };
  }

  const featureIds = getDirectHitRescueFeatureIds(draft, evidencePacket);
  const rescueLines = buildWorkMoneyStudySolutionRescueLines({
    draft,
    featureIds,
  });

  if (rescueLines.length === 0) {
    return { draft, rescued: false };
  }

  let rescued = false;
  const chapters = draft.chapters.map((chapter) => {
    if (chapter.chapterId !== "work_money_study") {
      return chapter;
    }

    const neededCount = Math.max(0, 4 - chapter.solutionLines.length);

    if (neededCount === 0) {
      return chapter;
    }

    const existingLines = new Set(chapter.solutionLines.map((line) => line.trim()));
    const linesToAdd = rescueLines
      .filter((line) => !existingLines.has(line.trim()))
      .slice(0, neededCount);

    if (linesToAdd.length === 0) {
      return chapter;
    }

    rescued = true;

    return {
      ...chapter,
      solutionLines: [...chapter.solutionLines, ...linesToAdd],
      body: `${chapter.body}\n\n${linesToAdd.join(" ")}`.trim(),
    };
  });

  if (!rescued) {
    return { draft, rescued: false };
  }

  return {
    draft: {
      ...draft,
      chapters,
    } as T,
    rescued: true,
  };
}

function getRiskGrowthMbtiSupportLine(mbti: string): string | undefined {
  if (mbti === "INTP") {
    return "MBTI로 입력된 INTP 성향이 함께 있으면 생각을 혼자 오래 검토하다가 회복 신호를 늦게 알아차릴 수 있으니, 기록과 질문을 밖으로 꺼내는 장치가 필요합니다.";
  }
  if (mbti === "ENTJ") {
    return "MBTI로 입력된 ENTJ 성향이 함께 있으면 목표와 해결 쪽으로 빨리 몰입하기 쉬우니, 쉬는 기준과 위임 기준을 먼저 정해 두는 장치가 필요합니다.";
  }
  if (/^[A-Z]{4}$/.test(mbti)) {
    return `MBTI로 입력된 ${mbti} 성향은 공식 진단이 아니라 행동을 이해하는 보조 언어로만 보고, 회복 신호와 생활 루틴을 점검하는 데 사용하세요.`;
  }

  return undefined;
}

function getWorkMoneyStudyMbtiSupportLine(mbti: string): string | undefined {
  if (mbti === "INTP") {
    return "MBTI로 입력된 INTP 성향이 함께 있으면 공부나 업무에서도 원리와 조건이 납득돼야 집중이 붙기 쉬우므로, 목차-핵심 개념-실전 적용 순서로 정리하는 방식이 잘 맞습니다.";
  }
  if (mbti === "ENTJ") {
    return "MBTI로 입력된 ENTJ 성향이 함께 있으면 기회가 보일 때 바로 확장하려는 속도가 붙기 쉬우므로, 수익 구조와 방어 규칙을 먼저 정해 두는 편이 좋습니다.";
  }
  if (/^[A-Z]{4}$/.test(mbti)) {
    return `입력된 MBTI ${mbti} 성향은 일·돈·공부에서 판단 속도와 실행 방식에 영향을 줄 수 있으므로, 사주 구조와 함께 실제 루틴으로 조정하는 편이 좋습니다.`;
  }

  return undefined;
}

function ensureWorkMoneyStudyMbtiSupport<T>(
  draft: T,
): DirectHitSceneRescueResult<T> {
  if (!isV2DraftWithDeterministicFields(draft)) {
    return { draft, rescued: false };
  }

  const mbti = draft.profileTable.mbti.trim();
  const supportLine = getWorkMoneyStudyMbtiSupportLine(mbti);

  if (supportLine === undefined) {
    return { draft, rescued: false };
  }

  let rescued = false;
  const chapters = draft.chapters.map((chapter) => {
    if (chapter.chapterId !== "work_money_study") {
      return chapter;
    }

    const searchText = getChapterRescueSearchText(chapter);

    if (searchText.includes(mbti) || searchText.includes("MBTI")) {
      return chapter;
    }

    rescued = true;

    return {
      ...chapter,
      body: `${chapter.body}\n\n${supportLine}`.trim(),
      mbtiTermsUsed: chapter.mbtiTermsUsed.includes(mbti)
        ? chapter.mbtiTermsUsed
        : [...chapter.mbtiTermsUsed, mbti],
    };
  });

  if (!rescued) {
    return { draft, rescued: false };
  }

  return {
    draft: {
      ...draft,
      chapters,
    } as T,
    rescued: true,
  };
}

function ensureRiskGrowthMbtiSupport<T>(draft: T): DirectHitSceneRescueResult<T> {
  if (!isV2DraftWithDeterministicFields(draft)) {
    return { draft, rescued: false };
  }

  const mbti = draft.profileTable.mbti.trim();
  const supportLine = getRiskGrowthMbtiSupportLine(mbti);

  if (supportLine === undefined) {
    return { draft, rescued: false };
  }

  let rescued = false;
  const chapters = draft.chapters.map((chapter) => {
    if (chapter.chapterId !== "risk_and_growth") {
      return chapter;
    }

    const searchText = getChapterRescueSearchText(chapter);

    if (searchText.includes(mbti) && searchText.includes("MBTI")) {
      return chapter;
    }

    rescued = true;

    return {
      ...chapter,
      body: `${chapter.body}\n\n${supportLine}`.trim(),
      mbtiTermsUsed: chapter.mbtiTermsUsed.includes(mbti)
        ? chapter.mbtiTermsUsed
        : [...chapter.mbtiTermsUsed, mbti],
    };
  });

  if (!rescued) {
    return { draft, rescued: false };
  }

  return {
    draft: {
      ...draft,
      chapters,
    } as T,
    rescued: true,
  };
}

function ensureChapterStabilityRescue<T>(
  draft: T,
  evidencePacket?: ComprehensiveReportEvidencePacket,
): DirectHitSceneRescueResult<T> {
  const workMoney = ensureWorkMoneyStudySolutionLines(draft, evidencePacket);
  const workMbti = ensureWorkMoneyStudyMbtiSupport(workMoney.draft);
  const riskMbti = ensureRiskGrowthMbtiSupport(workMbti.draft);

  return {
    draft: riskMbti.draft,
    rescued: workMoney.rescued || workMbti.rescued || riskMbti.rescued,
  };
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
  const stabilityInitial = ensureChapterStabilityRescue(
    directHitInitial.draft,
    input.evidencePacket,
  );
  const normalizedInitial = normalizeComprehensiveReportFinalMessage(
    stabilityInitial.draft,
  );
  const finalSanitizedInitial = sanitizeFinalComprehensiveDraft(
    normalizedInitial.draft,
  );
  const validation = validateComprehensiveReportDraft(finalSanitizedInitial.draft, {
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
    const stabilityRepair = ensureChapterStabilityRescue(
      directHitRepair.draft,
      input.evidencePacket,
    );
    const normalizedRepair = normalizeComprehensiveReportFinalMessage(
      stabilityRepair.draft,
    );
    const finalSanitizedRepair = sanitizeFinalComprehensiveDraft(
      normalizedRepair.draft,
    );
    const normalizerWarnings = getFinalMessageNormalizerWarnings(
      normalizedInitial,
      normalizedRepair,
    );
    const repairValidation = validateComprehensiveReportDraft(finalSanitizedRepair.draft, {
      allowedSajuTerms,
      allowedMbtiTerms: [input.mbtiType],
    });

    if (!repairValidation.ok || repairValidation.value === undefined) {
      const postRepairValidation = validateComprehensiveReportDraftAfterRepair(
        finalSanitizedRepair.draft,
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
            ...getCopySanitizerWarnings(finalSanitizedRepair),
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
        ...getCopySanitizerWarnings(finalSanitizedRepair),
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
      ...getCopySanitizerWarnings(sanitizedInitial, finalSanitizedInitial),
      ...getFinalMessageNormalizerWarnings(normalizedInitial),
      ...(validation.warnings ?? []),
    ],
  };
}
