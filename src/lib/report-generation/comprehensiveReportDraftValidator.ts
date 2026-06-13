import type {
  ComprehensiveReportDraft,
  ComprehensiveReportDraftSection,
  ComprehensiveReportDraftTone,
  ComprehensiveReportV1Draft,
  ComprehensiveReportV2Chapter,
  ComprehensiveReportV2ChapterId,
  ComprehensiveReportV2Draft,
  ComprehensiveReportV2ProfileTable,
} from "./comprehensiveReportDraftTypes";
import { COMPREHENSIVE_REPORT_V2_CHAPTER_IDS } from "./comprehensiveReportDraftTypes";
import {
  COMPREHENSIVE_REPORT_SECTION_DEFINITIONS,
  COMPREHENSIVE_REPORT_SECTION_IDS,
  type ComprehensiveReportSectionId,
} from "../report-knowledge/reportSectionSchema";
import { SAJU_KNOWLEDGE_BASE } from "../report-knowledge/sajuKnowledgeBase";
import type { SajuKnowledgeEntry } from "../report-knowledge/sajuKnowledgeTypes";

export type ComprehensiveReportDraftValidationResult = {
  readonly ok: boolean;
  readonly errors: readonly string[];
  readonly value?: ComprehensiveReportDraft;
};

export type ComprehensiveReportDraftValidationOptions = {
  readonly allowedSajuTerms?: readonly string[];
  readonly allowedMbtiTerms?: readonly string[];
};

const allowedTones = [
  "saju_first",
  "conversational",
  "direct",
  "warm",
  "cautionary",
] as const satisfies readonly ComprehensiveReportDraftTone[];

const allowedCautionLevels = ["low", "medium", "high"] as const;

const forbiddenOutputPhrases = [
  "반드시 " + "결혼한다",
  "죽" + "는다",
  "사고가 " + "난다",
  "무조건 " + "이혼한다",
  "100% " + "확정",
  "절대 " + "성공한다",
  "절대 " + "실패한다",
  "몇월 " + "며칠에 " + "반드시",
] as const;

const forbiddenInternalMetaPhrases = [
  "초" + "안",
  "검증된 " + "JSON",
  "저장" + "용",
  "fix" + "ture",
  "entry " + "id",
  "entry " + "ids",
  "원문 표는 " + "없고",
  "제공된 만세력 " + "원문",
  "meta" + "data",
  "raw" + "Text",
  "schema",
  "validator",
  "Open" + "AI",
  "프롬" + "프트",
  "디버" + "그",
  "테스트" + "용",
] as const;

const privateOutputMarkers = [
  "paymentKey",
  "providerPaymentId",
  "provider_payment_id",
  "inputSnapshot",
  "input_snapshot",
  "shareToken",
  "accessTokenHash",
  "TOSS_SECRET_KEY",
  "SUPABASE_SERVICE_ROLE",
  "OPENAI_API_KEY",
] as const;

const rawOpenAIMetadataKeys = [
  "id",
  "object",
  "created",
  "created_at",
  "model",
  "usage",
  "choices",
  "output",
  "output_text",
] as const;

const draftRootKeys = [
  "version",
  "productType",
  "tone",
  "openingTitle",
  "openingSummary",
  "coreLine",
  "sections",
  "finalAdvice",
  "safetyNotes",
] as const;
const draftV2RootKeys = [
  "version",
  "productType",
  "openingTitle",
  "openingSummary",
  "coreLine",
  "profileTable",
  "chapters",
  "finalAdvice",
  "safetyNotes",
] as const;

const sectionKeys = [
  "sectionId",
  "titleKo",
  "oneLine",
  "body",
  "evidenceSummary",
  "sajuTermsUsed",
  "mbtiTermsUsed",
  "cautionLevel",
] as const;
const chapterKeys = [
  "chapterId",
  "titleKo",
  "headline",
  "hitReadingLines",
  "body",
  "solutionLines",
  "keyPhrases",
  "sajuTermsUsed",
  "mbtiTermsUsed",
] as const;
const profileTableKeys = [
  "yearPillar",
  "monthPillar",
  "dayPillar",
  "hourPillar",
  "dayMaster",
  "fiveElementSummary",
  "excessiveElements",
  "missingElements",
  "tenGodSummary",
  "specialPatterns",
  "sinsal",
  "gwiin",
  "mbti",
] as const;

const displayOnlySectionIds = ["manse_table", "mbti_table"] as const;
const interpretationSectionIds = [
  "saju_core",
  "saju_mbti_fusion",
  "personality",
  "strengths",
  "weaknesses",
  "work_career",
  "money_asset",
  "love_relationship",
  "human_relations",
  "family_independence",
  "study_growth",
  "environment_luck",
  "final_advice",
] as const satisfies readonly ComprehensiveReportSectionId[];
const mbtiFirstBodyPrefixes = [
  "MBTI상",
  "입력하신 MBTI가 먼저",
] as const;
const visibleEvidenceDebugLabels = [
  "분석 근거 보기",
  "사주 근거",
  "MBTI 참고",
  "근거 요약",
  "primary Saju evidence",
  "supporting MBTI",
  "evidence packet",
  "entry id",
  "entry ids",
] as const;
const genericPlaceholderBodies = [
  "사주 원국의 기본 구조를 정리했습니다.",
  "입력하신 MBTI 유형을 리포트 보조 기준으로 반영했습니다.",
] as const;
const interpretationBodyMinimumLength = 160;
const v2ChapterBodyMinimumLengths = {
  opening: 220,
  saju_identity: 420,
  personality_pattern: 420,
  work_money_study: 520,
  love_relationships: 520,
  people_family_environment: 460,
  risk_and_growth: 420,
  final_message: 260,
} as const satisfies Record<ComprehensiveReportV2ChapterId, number>;
const v2ChapterHitReadingMinimumCounts = {
  opening: 2,
  saju_identity: 2,
  personality_pattern: 3,
  work_money_study: 3,
  love_relationships: 3,
  people_family_environment: 3,
  risk_and_growth: 2,
  final_message: 1,
} as const satisfies Record<ComprehensiveReportV2ChapterId, number>;
const v2ChapterSolutionMinimumCounts = {
  opening: 0,
  saju_identity: 2,
  personality_pattern: 2,
  work_money_study: 4,
  love_relationships: 4,
  people_family_environment: 2,
  risk_and_growth: 4,
  final_message: 0,
} as const satisfies Record<ComprehensiveReportV2ChapterId, number>;
const hitReadingConcreteMarkers = [
  "덕민님",
  "않나요",
  "많지 않나요",
  "자주",
  "이런 상황",
  "그런 적",
  "편입니다",
  "가능성이 큽니다",
  "나올 수 있습니다",
  "먼저",
  "늦게",
  "쉽습니다",
  "힘들 수 있습니다",
  "느껴질 수 있습니다",
] as const;
const genericHitReadingMarkers = [
  "성격이 좋습니다",
  "성장할 수 있습니다",
  "장점과 단점이 있습니다",
] as const;
const studyScopeMarkers = [
  "자격증",
  "전문서",
  "직무 학습",
  "사업 학습",
] as const;
const partnerFitMarkers = [
  "보완하는 사람",
  "맞는 사람",
  "필요한 사람",
  "어울리는 사람",
  "궁합",
  "정서적 완충",
] as const;
const badMatchMarkers = [
  "피해야 할 패턴",
  "맞지 않는",
  "나쁜 궁합",
  "감정 기복",
  "책임이 흐릿",
  "확인받으려는",
  "실행이 약한",
] as const;
const cautiousMbtiRelationMarkers = [
  "MBTI만으로 단정",
  "단정하지",
  "ISFP",
  "INFP",
  "INTP",
] as const;
const elementRemedyMarkers = [
  "밤 산책",
  "수변",
  "수분",
  "사색",
  "기록",
  "잠",
  "햇빛",
  "가벼운 운동",
  "발표",
  "표현 연습",
  "책임 덜어내기",
  "경계선",
  "일정",
] as const;
const repeatedSentenceAllowList = [
  "이렇게 쓰면 좋습니다.",
  "피해야 할 패턴입니다.",
  "맞는 환경입니다.",
  "관계에서 써먹을 것입니다.",
  "공부/일 루틴입니다.",
] as const;
const shortSajuTermContextSuffixes = [
  "일주",
  "귀인",
  "기운",
  "구조",
  "년",
  "월",
  "일",
  "시",
  "살",
  "격",
] as const;
const shortSajuTermCompoundSuffixes = ["일주", "귀인", "살"] as const;
const shortSajuTermBaseAllowedSuffixes = ["기운", "구조", "격"] as const;

function isDisplayOnlySectionId(
  value: ComprehensiveReportSectionId,
): boolean {
  return (displayOnlySectionIds as readonly string[]).includes(value);
}

function isInterpretationSectionId(value: ComprehensiveReportSectionId): boolean {
  return (interpretationSectionIds as readonly string[]).includes(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function hasAnyMarker(text: string, markers: readonly string[]): boolean {
  return markers.some((marker) => text.includes(marker));
}

function findChapter(
  chapters: readonly ComprehensiveReportV2Chapter[],
  chapterId: ComprehensiveReportV2ChapterId,
): ComprehensiveReportV2Chapter | undefined {
  return chapters.find((chapter) => chapter.chapterId === chapterId);
}

function isSectionId(value: unknown): value is ComprehensiveReportSectionId {
  return (
    typeof value === "string" &&
    (COMPREHENSIVE_REPORT_SECTION_IDS as readonly string[]).includes(value)
  );
}

function isV2ChapterId(value: unknown): value is ComprehensiveReportV2ChapterId {
  return (
    typeof value === "string" &&
    (COMPREHENSIVE_REPORT_V2_CHAPTER_IDS as readonly string[]).includes(value)
  );
}

function isTone(value: unknown): value is ComprehensiveReportDraftTone {
  return typeof value === "string" && (allowedTones as readonly string[]).includes(value);
}

function isCautionLevel(
  value: unknown,
): value is ComprehensiveReportDraftSection["cautionLevel"] {
  return (
    typeof value === "string" &&
    (allowedCautionLevels as readonly string[]).includes(value)
  );
}

function collectStrings(value: unknown): string[] {
  if (typeof value === "string") {
    return [value];
  }
  if (Array.isArray(value)) {
    return value.flatMap((item) => collectStrings(item));
  }
  if (isRecord(value)) {
    return Object.entries(value).flatMap(([key, item]) => [
      key,
      ...collectStrings(item),
    ]);
  }

  return [];
}

function isControlledSajuAlias(entry: SajuKnowledgeEntry, alias: string): boolean {
  const normalizedAlias = alias.trim();

  if (!/[가-힣]/.test(normalizedAlias) || normalizedAlias.length < 2) {
    return false;
  }
  if (normalizedAlias === entry.labelKo) {
    return true;
  }

  switch (entry.category) {
    case "day_pillar":
      return /^[갑을병정무기경신임계][자축인묘진사오미신유술해]$/.test(
        normalizedAlias,
      ) || normalizedAlias.endsWith("일주");
    case "ten_god":
    case "special_pattern":
    case "nobleman":
    case "sinsal":
    case "element_balance":
      return true;
    case "day_master":
    case "five_element":
    case "relationship":
      return false;
  }
}

function createKnownSajuTerms(): readonly string[] {
  return [
    ...new Set(
      SAJU_KNOWLEDGE_BASE.flatMap((entry) => [
        entry.labelKo,
        ...entry.aliases.filter((alias) => isControlledSajuAlias(entry, alias)),
      ])
        .map((term) => term.trim())
        .filter((term) => /[가-힣]/.test(term) && term.length >= 2)
        .sort((left, right) => right.length - left.length),
    ),
  ];
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isShortKoreanSajuTerm(term: string): boolean {
  return /^[가-힣]{2}$/.test(term);
}

function isAllowedSajuTerm(
  term: string,
  allowedTerms: ReadonlySet<string>,
): boolean {
  const normalizedTerm = term.replace(/\s+/g, "");

  if (allowedTerms.has(normalizedTerm)) {
    return true;
  }

  const ganjiBase = normalizedTerm.slice(0, 2);

  for (const suffix of shortSajuTermCompoundSuffixes) {
    if (
      normalizedTerm === `${ganjiBase}${suffix}` &&
      isShortKoreanSajuTerm(ganjiBase) &&
      allowedTerms.has(ganjiBase)
    ) {
      return true;
    }
  }

  for (const suffix of shortSajuTermCompoundSuffixes) {
    if (
      isShortKoreanSajuTerm(normalizedTerm) &&
      allowedTerms.has(`${normalizedTerm}${suffix}`)
    ) {
      return true;
    }
  }

  for (const suffix of shortSajuTermBaseAllowedSuffixes) {
    if (
      normalizedTerm === `${ganjiBase}${suffix}` &&
      isShortKoreanSajuTerm(ganjiBase) &&
      allowedTerms.has(ganjiBase)
    ) {
      return true;
    }
  }

  return false;
}

function shouldSkipShortSuffixMatch(
  text: string,
  matchEndIndex: number,
  suffix: string,
): boolean {
  return suffix === "일" && /^\s*주/.test(text.slice(matchEndIndex));
}

function findContextualShortSajuTermMatches(
  text: string,
  term: string,
): readonly string[] {
  const escapedTerm = escapeRegExp(term);
  const matches: string[] = [];

  for (const suffix of shortSajuTermContextSuffixes) {
    const escapedSuffix = escapeRegExp(suffix);
    const regex = new RegExp(`${escapedTerm}\\s*${escapedSuffix}`, "g");

    for (const match of text.matchAll(regex)) {
      const matchEndIndex = (match.index ?? 0) + match[0].length;

      if (shouldSkipShortSuffixMatch(text, matchEndIndex, suffix)) {
        continue;
      }
      matches.push(match[0].replace(/\s+/g, ""));
    }
  }

  return matches;
}

function findSajuTermMatches(text: string, term: string): readonly string[] {
  if (isShortKoreanSajuTerm(term)) {
    return findContextualShortSajuTermMatches(text, term);
  }

  return text.includes(term) ? [term] : [];
}

function removeLessSpecificMatches(
  matches: readonly string[],
): readonly string[] {
  const uniqueMatches = [...new Set(matches)];

  return uniqueMatches.filter(
    (match) =>
      !uniqueMatches.some(
        (other) =>
          other !== match &&
          other.length > match.length &&
          other.includes(match),
      ),
  );
}

function appendUnknownKeyErrors(
  errors: string[],
  label: string,
  value: Record<string, unknown>,
  allowedKeys: readonly string[],
): void {
  const allowed = new Set(allowedKeys);

  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) {
      errors.push(`${label} contains unsupported field: ${key}`);
    }
  }
}

function appendTextSafetyErrors(errors: string[], value: unknown): void {
  const text = collectStrings(value).join("\n");

  for (const phrase of forbiddenOutputPhrases) {
    if (text.includes(phrase)) {
      errors.push(`FORBIDDEN_PROPHECY_PHRASE: ${phrase}`);
    }
  }
  for (const marker of privateOutputMarkers) {
    if (text.includes(marker)) {
      errors.push(`PRIVATE_FIELD_LEAK: ${marker}`);
    }
  }
  for (const phrase of forbiddenInternalMetaPhrases) {
    if (text.includes(phrase)) {
      errors.push(`INTERNAL_META_COPY: ${phrase}`);
    }
  }
}

function appendRawMetadataErrors(
  errors: string[],
  label: string,
  value: Record<string, unknown>,
): void {
  for (const key of rawOpenAIMetadataKeys) {
    if (Object.hasOwn(value, key)) {
      errors.push(`${label} contains raw OpenAI metadata field: ${key}`);
    }
  }
}

function validateStringField(
  errors: string[],
  label: string,
  value: unknown,
  minimumLength: number,
): value is string {
  if (typeof value !== "string") {
    errors.push(`${label} must be a string.`);
    return false;
  }
  if (value.trim().length < minimumLength) {
    errors.push(`${label} is too short.`);
    return false;
  }

  return true;
}

function appendUnsupportedSajuTermErrors(
  errors: string[],
  value: unknown,
  options: ComprehensiveReportDraftValidationOptions,
): void {
  if (options.allowedSajuTerms === undefined) {
    return;
  }

  const allowedTerms = new Set(
    options.allowedSajuTerms
      .map((term) => term.trim())
      .map((term) => term.replace(/\s+/g, ""))
      .filter((term) => term.length > 0),
  );
  const text = collectStrings(value).join("\n");
  const unsupportedMatches: string[] = [];

  for (const term of createKnownSajuTerms()) {
    for (const match of findSajuTermMatches(text, term)) {
      if (!isAllowedSajuTerm(match, allowedTerms)) {
        unsupportedMatches.push(match);
      }
    }
  }

  for (const match of removeLessSpecificMatches(unsupportedMatches)) {
    errors.push(`UNSUPPORTED_SAJU_TERM: ${match}`);
  }
}

function appendDisplaySectionErrors(
  errors: string[],
  sections: readonly ComprehensiveReportDraftSection[],
): void {
  for (const section of sections) {
    if (!isDisplayOnlySectionId(section.sectionId)) {
      continue;
    }
    if (section.body.length > 120) {
      errors.push(`DISPLAY_SECTION_TOO_LONG: ${section.sectionId}`);
    }
    if (section.evidenceSummary.length > 2) {
      errors.push(`DISPLAY_SECTION_EVIDENCE_TOO_LONG: ${section.sectionId}`);
    }
  }
}

function shouldRunQualityDensityChecks(
  options: ComprehensiveReportDraftValidationOptions,
): boolean {
  return options.allowedSajuTerms !== undefined;
}

function compactText(value: string): string {
  return value.replace(/\s+/g, "");
}

function bodyContainsAnyTerm(input: {
  readonly body: string;
  readonly terms: readonly string[];
}): boolean {
  const body = compactText(input.body);

  return input.terms
    .map((term) => compactText(term))
    .filter((term) => term.length > 0)
    .some((term) => body.includes(term));
}

function appendSectionDensityErrors(
  errors: string[],
  sections: readonly ComprehensiveReportDraftSection[],
  options: ComprehensiveReportDraftValidationOptions,
): void {
  if (!shouldRunQualityDensityChecks(options)) {
    return;
  }

  for (const section of sections) {
    if (!isInterpretationSectionId(section.sectionId)) {
      continue;
    }

    if (section.body.trim() === section.oneLine.trim()) {
      errors.push(`SECTION_BODY_SAME_AS_ONELINE: ${section.sectionId}`);
    }
    if (section.body.trim().length < interpretationBodyMinimumLength) {
      errors.push(`SECTION_BODY_TOO_SHORT: ${section.sectionId} body too short`);
    }
    if (
      genericPlaceholderBodies.some((placeholder) =>
        section.body.includes(placeholder),
      )
    ) {
      errors.push(`GENERIC_PLACEHOLDER_BODY: ${section.sectionId}`);
    }
    if (
      section.sajuTermsUsed.length > 0 &&
      !bodyContainsAnyTerm({
        body: section.body,
        terms: section.sajuTermsUsed,
      })
    ) {
      errors.push(`SAJU_TERM_EXPLANATION_MISSING: ${section.sectionId}`);
    }
  }
}

function startsWithMbtiFirstPhrase(text: string): boolean {
  const trimmed = text.trim();

  if (/^[A-Z]{4}(는|라서)/.test(trimmed)) {
    return true;
  }

  return mbtiFirstBodyPrefixes.some((prefix) => trimmed.startsWith(prefix));
}

function appendMbtiFirstErrors(
  errors: string[],
  sections: readonly ComprehensiveReportDraftSection[],
): void {
  for (const section of sections) {
    if (section.sectionId === "mbti_core" || section.sectionId === "mbti_table") {
      continue;
    }
    if (startsWithMbtiFirstPhrase(section.body) || startsWithMbtiFirstPhrase(section.oneLine)) {
      errors.push(`MBTI_FIRST_FORBIDDEN: ${section.sectionId}`);
    }
  }
}

function splitBodySentences(body: string): readonly string[] {
  return body
    .split(/(?<=[.!?。])\s+|\n+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length >= 12)
    .filter(
      (sentence) => !(repeatedSentenceAllowList as readonly string[]).includes(sentence),
    );
}

function appendRepetitionErrors(
  errors: string[],
  sections: readonly ComprehensiveReportDraftSection[],
): void {
  const counts = new Map<string, number>();

  for (const section of sections) {
    if (isDisplayOnlySectionId(section.sectionId)) {
      continue;
    }
    for (const sentence of new Set(splitBodySentences(section.body))) {
      counts.set(sentence, (counts.get(sentence) ?? 0) + 1);
    }
  }

  for (const [sentence, count] of counts) {
    if (count >= 3) {
      errors.push(`REPEATED_SENTENCE: ${sentence}`);
    }
  }
}

function parseSection(
  errors: string[],
  value: unknown,
  index: number,
): ComprehensiveReportDraftSection | undefined {
  if (!isRecord(value)) {
    errors.push(`section ${index} must be an object.`);
    return undefined;
  }

  appendUnknownKeyErrors(errors, `section ${index}`, value, sectionKeys);
  appendRawMetadataErrors(errors, `section ${index}`, value);

  const sectionId = value.sectionId;
  const titleKo = value.titleKo;
  const oneLine = value.oneLine;
  const body = value.body;
  const evidenceSummary = value.evidenceSummary;
  const sajuTermsUsed = value.sajuTermsUsed;
  const mbtiTermsUsed = value.mbtiTermsUsed;
  const cautionLevel = value.cautionLevel;

  if (!isSectionId(sectionId)) {
    errors.push(`section ${index} has invalid section id.`);
    return undefined;
  }
  if (!validateStringField(errors, `${sectionId}.titleKo`, titleKo, 1)) {
    return undefined;
  }
  if (!validateStringField(errors, `${sectionId}.oneLine`, oneLine, 8)) {
    return undefined;
  }
  const bodyMinimumLength =
    isDisplayOnlySectionId(sectionId) ? 8 : 20;

  if (!validateStringField(errors, `${sectionId}.body`, body, bodyMinimumLength)) {
    return undefined;
  }
  if (!isStringArray(evidenceSummary)) {
    errors.push(`${sectionId}.evidenceSummary must be a string array.`);
    return undefined;
  }
  if (!isStringArray(sajuTermsUsed)) {
    errors.push(`${sectionId}.sajuTermsUsed must be a string array.`);
    return undefined;
  }
  if (!isStringArray(mbtiTermsUsed)) {
    errors.push(`${sectionId}.mbtiTermsUsed must be a string array.`);
    return undefined;
  }
  if (!isCautionLevel(cautionLevel)) {
    errors.push(`${sectionId}.cautionLevel is invalid.`);
    return undefined;
  }

  return {
    sectionId,
    titleKo,
    oneLine,
    body,
    evidenceSummary,
    sajuTermsUsed,
    mbtiTermsUsed,
    cautionLevel,
  };
}

function appendSectionCoverageErrors(
  errors: string[],
  sections: readonly ComprehensiveReportDraftSection[],
): void {
  const seen = new Set<ComprehensiveReportSectionId>();

  for (const section of sections) {
    if (seen.has(section.sectionId)) {
      errors.push(`draft has duplicate section: ${section.sectionId}`);
    }
    seen.add(section.sectionId);
  }
  for (const requiredSectionId of COMPREHENSIVE_REPORT_SECTION_IDS) {
    if (!seen.has(requiredSectionId)) {
      errors.push(`draft missing section: ${requiredSectionId}`);
    }
  }
}

function appendSajuFirstErrors(
  errors: string[],
  sections: readonly ComprehensiveReportDraftSection[],
): void {
  const sectionById = new Map(sections.map((section) => [section.sectionId, section]));
  const sajuFirstDefinitions = COMPREHENSIVE_REPORT_SECTION_DEFINITIONS.filter(
    (section) => section.primaryBasis !== "display" && section.id !== "mbti_core",
  );
  let mbtiDominantSections = 0;

  for (const definition of sajuFirstDefinitions) {
    const section = sectionById.get(definition.id);

    if (section === undefined) {
      continue;
    }
    if (section.sajuTermsUsed.length === 0) {
      errors.push(`${definition.id} needs Saju terms for a Saju-first draft.`);
    }
    if (section.mbtiTermsUsed.length > section.sajuTermsUsed.length) {
      mbtiDominantSections += 1;
    }
  }

  if (mbtiDominantSections > Math.floor(sajuFirstDefinitions.length / 2)) {
    errors.push("MBTI terms dominate too many Saju-first sections.");
  }
}

function parseV1Draft(
  input: unknown,
  errors: string[],
  options: ComprehensiveReportDraftValidationOptions,
): ComprehensiveReportV1Draft | undefined {
  if (!isRecord(input)) {
    errors.push("draft must be an object.");
    return undefined;
  }

  appendUnknownKeyErrors(errors, "draft", input, draftRootKeys);
  appendRawMetadataErrors(errors, "draft", input);

  if (input.version !== "comprehensive_v1_draft") {
    errors.push("draft version must be comprehensive_v1_draft.");
  }
  if (input.productType !== "saju_mbti_full") {
    errors.push("draft productType must be saju_mbti_full.");
  }
  if (!Array.isArray(input.tone) || input.tone.length === 0 || !input.tone.every(isTone)) {
    errors.push("draft tone is invalid.");
  }

  validateStringField(errors, "openingTitle", input.openingTitle, 1);
  validateStringField(errors, "openingSummary", input.openingSummary, 20);
  validateStringField(errors, "coreLine", input.coreLine, 8);
  validateStringField(errors, "finalAdvice", input.finalAdvice, 20);

  if (!isStringArray(input.safetyNotes)) {
    errors.push("safetyNotes must be a string array.");
  }
  if (!Array.isArray(input.sections)) {
    errors.push("sections must be an array.");
    return undefined;
  }

  const sections = input.sections
    .map((section, index) => parseSection(errors, section, index))
    .filter((section): section is ComprehensiveReportDraftSection => section !== undefined);

  appendSectionCoverageErrors(errors, sections);
  appendSajuFirstErrors(errors, sections);
  appendDisplaySectionErrors(errors, sections);
  appendSectionDensityErrors(errors, sections, options);
  appendMbtiFirstErrors(errors, sections);
  appendRepetitionErrors(errors, sections);

  if (errors.length > 0) {
    return undefined;
  }

  return {
    version: "comprehensive_v1_draft",
    productType: "saju_mbti_full",
    tone: input.tone as readonly ComprehensiveReportDraftTone[],
    openingTitle: input.openingTitle as string,
    openingSummary: input.openingSummary as string,
    coreLine: input.coreLine as string,
    sections,
    finalAdvice: input.finalAdvice as string,
    safetyNotes: input.safetyNotes as readonly string[],
  };
}

function parseChapter(
  errors: string[],
  value: unknown,
  index: number,
): ComprehensiveReportV2Chapter | undefined {
  if (!isRecord(value)) {
    errors.push(`chapter ${index} must be an object.`);
    return undefined;
  }

  appendUnknownKeyErrors(errors, `chapter ${index}`, value, chapterKeys);
  appendRawMetadataErrors(errors, `chapter ${index}`, value);

  const chapterId = value.chapterId;
  const titleKo = value.titleKo;
  const headline = value.headline;
  const hitReadingLines = value.hitReadingLines;
  const body = value.body;
  const solutionLines = value.solutionLines;
  const keyPhrases = value.keyPhrases;
  const sajuTermsUsed = value.sajuTermsUsed;
  const mbtiTermsUsed = value.mbtiTermsUsed;

  if (!isV2ChapterId(chapterId)) {
    errors.push(`chapter ${index} has invalid chapter id.`);
    return undefined;
  }
  if (!validateStringField(errors, `${chapterId}.titleKo`, titleKo, 1)) {
    return undefined;
  }
  if (!validateStringField(errors, `${chapterId}.headline`, headline, 12)) {
    return undefined;
  }
  if (!isStringArray(hitReadingLines)) {
    errors.push(`${chapterId}.hitReadingLines must be a string array.`);
    return undefined;
  }
  if (!validateStringField(errors, `${chapterId}.body`, body, 40)) {
    return undefined;
  }
  if (!isStringArray(solutionLines)) {
    errors.push(`${chapterId}.solutionLines must be a string array.`);
    return undefined;
  }
  if (!isStringArray(keyPhrases) || keyPhrases.length === 0) {
    errors.push(`${chapterId}.keyPhrases must be a non-empty string array.`);
    return undefined;
  }
  if (!isStringArray(sajuTermsUsed)) {
    errors.push(`${chapterId}.sajuTermsUsed must be a string array.`);
    return undefined;
  }
  if (!isStringArray(mbtiTermsUsed)) {
    errors.push(`${chapterId}.mbtiTermsUsed must be a string array.`);
    return undefined;
  }

  return {
    chapterId,
    titleKo,
    headline,
    hitReadingLines,
    body,
    solutionLines,
    keyPhrases,
    sajuTermsUsed,
    mbtiTermsUsed,
  };
}

function parseOptionalProfilePillar(
  errors: string[],
  value: unknown,
  label: string,
): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== "string" || value.trim().length === 0) {
    errors.push(`profileTable.${label} must be a non-empty string when provided.`);
    return undefined;
  }

  return value;
}

function parseProfileStringArray(
  errors: string[],
  value: unknown,
  label: string,
): readonly string[] {
  if (!isStringArray(value)) {
    errors.push(`profileTable.${label} must be a string array.`);
    return [];
  }

  return value;
}

function parseProfileTable(
  errors: string[],
  value: unknown,
): ComprehensiveReportV2ProfileTable | undefined {
  if (value === undefined) {
    errors.push("profileTable is required for comprehensive_v2_draft.");
    return undefined;
  }
  if (!isRecord(value)) {
    errors.push("profileTable must be an object.");
    return undefined;
  }

  appendUnknownKeyErrors(errors, "profileTable", value, profileTableKeys);

  if (typeof value.mbti !== "string" || value.mbti.trim().length === 0) {
    errors.push("profileTable.mbti must be a non-empty string.");
  }

  return {
    yearPillar: parseOptionalProfilePillar(errors, value.yearPillar, "yearPillar"),
    monthPillar: parseOptionalProfilePillar(errors, value.monthPillar, "monthPillar"),
    dayPillar: parseOptionalProfilePillar(errors, value.dayPillar, "dayPillar"),
    hourPillar: parseOptionalProfilePillar(errors, value.hourPillar, "hourPillar"),
    dayMaster: parseOptionalProfilePillar(errors, value.dayMaster, "dayMaster"),
    fiveElementSummary: parseProfileStringArray(
      errors,
      value.fiveElementSummary,
      "fiveElementSummary",
    ),
    excessiveElements: parseProfileStringArray(
      errors,
      value.excessiveElements,
      "excessiveElements",
    ),
    missingElements: parseProfileStringArray(
      errors,
      value.missingElements,
      "missingElements",
    ),
    tenGodSummary: parseProfileStringArray(errors, value.tenGodSummary, "tenGodSummary"),
    specialPatterns: parseProfileStringArray(
      errors,
      value.specialPatterns,
      "specialPatterns",
    ),
    sinsal: parseProfileStringArray(errors, value.sinsal, "sinsal"),
    gwiin: parseProfileStringArray(errors, value.gwiin, "gwiin"),
    mbti: typeof value.mbti === "string" ? value.mbti : "",
  };
}

function appendChapterCoverageErrors(
  errors: string[],
  chapters: readonly ComprehensiveReportV2Chapter[],
): void {
  const seen = new Set<ComprehensiveReportV2ChapterId>();

  for (const chapter of chapters) {
    if (seen.has(chapter.chapterId)) {
      errors.push(`draft has duplicate chapter: ${chapter.chapterId}`);
    }
    seen.add(chapter.chapterId);
  }
  for (const requiredChapterId of COMPREHENSIVE_REPORT_V2_CHAPTER_IDS) {
    if (!seen.has(requiredChapterId)) {
      errors.push(`draft missing chapter: ${requiredChapterId}`);
    }
  }
}

function appendV2ChapterDensityErrors(
  errors: string[],
  chapters: readonly ComprehensiveReportV2Chapter[],
): void {
  for (const chapter of chapters) {
    const minimumLength = v2ChapterBodyMinimumLengths[chapter.chapterId];

    if (chapter.body.trim().length < minimumLength) {
      errors.push(`CHAPTER_BODY_TOO_SHORT: ${chapter.chapterId}`);
    }
    if (chapter.body.trim() === chapter.headline.trim()) {
      errors.push(`CHAPTER_BODY_SAME_AS_HEADLINE: ${chapter.chapterId}`);
    }
    if (
      chapter.chapterId !== "opening" &&
      chapter.chapterId !== "final_message" &&
      chapter.sajuTermsUsed.length === 0
    ) {
      errors.push(`CHAPTER_SAJU_TERMS_MISSING: ${chapter.chapterId}`);
    }
    if (
      chapter.sajuTermsUsed.length > 0 &&
      !bodyContainsAnyTerm({
        body: chapter.body,
        terms: chapter.sajuTermsUsed,
      })
    ) {
      errors.push(`CHAPTER_SAJU_TERM_EXPLANATION_MISSING: ${chapter.chapterId}`);
    }
  }
}

function appendV2MbtiFirstErrors(
  errors: string[],
  input: {
    readonly openingSummary: string;
    readonly coreLine: string;
    readonly chapters: readonly ComprehensiveReportV2Chapter[];
  },
): void {
  if (
    startsWithMbtiFirstPhrase(input.openingSummary) ||
    startsWithMbtiFirstPhrase(input.coreLine)
  ) {
    errors.push("MBTI_FIRST_FORBIDDEN: opening");
  }

  for (const chapter of input.chapters) {
    if (
      startsWithMbtiFirstPhrase(chapter.headline) ||
      startsWithMbtiFirstPhrase(chapter.body)
    ) {
      errors.push(`MBTI_FIRST_FORBIDDEN: ${chapter.chapterId}`);
    }
  }
}

function appendV2SajuFirstErrors(
  errors: string[],
  chapters: readonly ComprehensiveReportV2Chapter[],
): void {
  let mbtiDominantChapters = 0;

  for (const chapter of chapters) {
    if (
      chapter.chapterId !== "opening" &&
      chapter.chapterId !== "final_message" &&
      chapter.mbtiTermsUsed.length > chapter.sajuTermsUsed.length
    ) {
      mbtiDominantChapters += 1;
    }
  }

  if (mbtiDominantChapters > 2) {
    errors.push("MBTI terms dominate too many narrative chapters.");
  }
}

function appendV2RepetitionErrors(
  errors: string[],
  chapters: readonly ComprehensiveReportV2Chapter[],
): void {
  const counts = new Map<string, number>();

  for (const chapter of chapters) {
    for (const sentence of new Set(splitBodySentences(chapter.body))) {
      counts.set(sentence, (counts.get(sentence) ?? 0) + 1);
    }
  }

  for (const [sentence, count] of counts) {
    if (count >= 3) {
      errors.push(`REPEATED_SENTENCE: ${sentence}`);
    }
  }
}

function appendV2VisibleDebugLabelErrors(
  errors: string[],
  input: ComprehensiveReportV2Draft | {
    readonly openingTitle: string;
    readonly openingSummary: string;
    readonly coreLine: string;
    readonly chapters: readonly ComprehensiveReportV2Chapter[];
    readonly finalAdvice: string;
    readonly safetyNotes: readonly string[];
  },
): void {
  const text = collectStrings(input).join("\n");

  for (const label of visibleEvidenceDebugLabels) {
    if (text.includes(label)) {
      errors.push(`VISIBLE_EVIDENCE_DEBUG_LABEL: ${label}`);
    }
  }
}

function appendV2HitReadingErrors(
  errors: string[],
  chapters: readonly ComprehensiveReportV2Chapter[],
): void {
  const allHitReadingLines = chapters.flatMap((chapter) => chapter.hitReadingLines);

  if (allHitReadingLines.length < 16) {
    errors.push("DIRECT_HIT_READING_MISSING");
  }

  for (const chapter of chapters) {
    const minimumCount = v2ChapterHitReadingMinimumCounts[chapter.chapterId];

    if (chapter.hitReadingLines.length < minimumCount) {
      errors.push(`DIRECT_HIT_READING_MISSING: ${chapter.chapterId}`);
    }
    for (const line of chapter.hitReadingLines) {
      const trimmed = line.trim();

      if (
        trimmed.length < 16 ||
        !hasAnyMarker(trimmed, hitReadingConcreteMarkers) ||
        hasAnyMarker(trimmed, genericHitReadingMarkers)
      ) {
        errors.push(`DIRECT_HIT_READING_TOO_GENERIC: ${chapter.chapterId}`);
        break;
      }
    }
  }
}

function appendV2PrescriptionErrors(
  errors: string[],
  chapters: readonly ComprehensiveReportV2Chapter[],
): void {
  for (const chapter of chapters) {
    const minimumCount = v2ChapterSolutionMinimumCounts[chapter.chapterId];

    if (chapter.solutionLines.length < minimumCount) {
      errors.push(`SOLUTION_LINES_MISSING: ${chapter.chapterId}`);
      continue;
    }
    if (
      minimumCount > 0 &&
      chapter.solutionLines.some((line) => line.trim().length < 8)
    ) {
      errors.push(`SOLUTION_LINES_TOO_GENERIC: ${chapter.chapterId}`);
    }
  }
}

function getV2ChapterSearchText(
  chapter: ComprehensiveReportV2Chapter | undefined,
): string {
  if (chapter === undefined) {
    return "";
  }

  return [
    chapter.headline,
    ...chapter.hitReadingLines,
    chapter.body,
    ...chapter.solutionLines,
    ...chapter.keyPhrases,
  ].join("\n");
}

function appendV2TopicCoverageErrors(
  errors: string[],
  chapters: readonly ComprehensiveReportV2Chapter[],
): void {
  const workChapter = findChapter(chapters, "work_money_study");
  const loveChapter = findChapter(chapters, "love_relationships");
  const riskChapter = findChapter(chapters, "risk_and_growth");
  const workText = getV2ChapterSearchText(workChapter);
  const loveText = getV2ChapterSearchText(loveChapter);
  const riskText = getV2ChapterSearchText(riskChapter);

  if (workChapter !== undefined && !hasAnyMarker(workText, studyScopeMarkers)) {
    errors.push("WORK_STUDY_SCOPE_MISSING");
  }
  if (
    loveChapter !== undefined &&
    !hasAnyMarker(loveText, partnerFitMarkers)
  ) {
    errors.push("LOVE_PARTNER_FIT_MISSING");
  }
  if (loveChapter !== undefined && !hasAnyMarker(loveText, badMatchMarkers)) {
    errors.push("LOVE_BAD_MATCH_PATTERN_MISSING");
  }
  if (
    loveChapter !== undefined &&
    !hasAnyMarker(loveText, cautiousMbtiRelationMarkers)
  ) {
    errors.push("LOVE_MBTI_CAUTION_OR_EXAMPLE_MISSING");
  }
  if (riskChapter !== undefined && !hasAnyMarker(riskText, elementRemedyMarkers)) {
    errors.push("ELEMENT_REMEDY_MISSING");
  }
}

function parseV2Draft(
  input: unknown,
  errors: string[],
): ComprehensiveReportV2Draft | undefined {
  if (!isRecord(input)) {
    errors.push("draft must be an object.");
    return undefined;
  }

  appendUnknownKeyErrors(errors, "draft", input, draftV2RootKeys);
  appendRawMetadataErrors(errors, "draft", input);

  if (input.version !== "comprehensive_v2_draft") {
    errors.push("draft version must be comprehensive_v2_draft.");
  }
  if (input.productType !== "saju_mbti_full") {
    errors.push("draft productType must be saju_mbti_full.");
  }

  validateStringField(errors, "openingTitle", input.openingTitle, 1);
  validateStringField(errors, "openingSummary", input.openingSummary, 30);
  validateStringField(errors, "coreLine", input.coreLine, 12);
  validateStringField(errors, "finalAdvice", input.finalAdvice, 40);

  const profileTable = parseProfileTable(errors, input.profileTable);

  if (!isStringArray(input.safetyNotes)) {
    errors.push("safetyNotes must be a string array.");
  }
  if (!Array.isArray(input.chapters)) {
    errors.push("chapters must be an array.");
    return undefined;
  }

  const chapters = input.chapters
    .map((chapter, index) => parseChapter(errors, chapter, index))
    .filter((chapter): chapter is ComprehensiveReportV2Chapter => chapter !== undefined);

  appendChapterCoverageErrors(errors, chapters);
  appendV2ChapterDensityErrors(errors, chapters);
  appendV2MbtiFirstErrors(errors, {
    openingSummary: typeof input.openingSummary === "string" ? input.openingSummary : "",
    coreLine: typeof input.coreLine === "string" ? input.coreLine : "",
    chapters,
  });
  appendV2SajuFirstErrors(errors, chapters);
  appendV2RepetitionErrors(errors, chapters);
  appendV2HitReadingErrors(errors, chapters);
  appendV2PrescriptionErrors(errors, chapters);
  appendV2TopicCoverageErrors(errors, chapters);
  appendV2VisibleDebugLabelErrors(errors, {
    openingTitle: typeof input.openingTitle === "string" ? input.openingTitle : "",
    openingSummary: typeof input.openingSummary === "string" ? input.openingSummary : "",
    coreLine: typeof input.coreLine === "string" ? input.coreLine : "",
    chapters,
    finalAdvice: typeof input.finalAdvice === "string" ? input.finalAdvice : "",
    safetyNotes: isStringArray(input.safetyNotes) ? input.safetyNotes : [],
  });

  if (errors.length > 0) {
    return undefined;
  }

  return {
    version: "comprehensive_v2_draft",
    productType: "saju_mbti_full",
    openingTitle: input.openingTitle as string,
    openingSummary: input.openingSummary as string,
    coreLine: input.coreLine as string,
    profileTable: profileTable as ComprehensiveReportV2ProfileTable,
    chapters,
    finalAdvice: input.finalAdvice as string,
    safetyNotes: input.safetyNotes as readonly string[],
  };
}

function parseDraft(
  input: unknown,
  errors: string[],
  options: ComprehensiveReportDraftValidationOptions,
): ComprehensiveReportDraft | undefined {
  if (!isRecord(input)) {
    errors.push("draft must be an object.");
    return undefined;
  }

  if (input.version === "comprehensive_v2_draft") {
    return parseV2Draft(input, errors);
  }

  return parseV1Draft(input, errors, options);
}

export function validateComprehensiveReportDraft(
  input: unknown,
  options: ComprehensiveReportDraftValidationOptions = {},
): ComprehensiveReportDraftValidationResult {
  const errors: string[] = [];

  appendTextSafetyErrors(errors, input);
  appendUnsupportedSajuTermErrors(errors, input, options);

  const value = parseDraft(input, errors, options);

  if (errors.length > 0 || value === undefined) {
    return {
      ok: false,
      errors,
    };
  }

  return {
    ok: true,
    errors: [],
    value,
  };
}

export function assertComprehensiveReportDraftIsSafe(
  input: unknown,
  options: ComprehensiveReportDraftValidationOptions = {},
): ComprehensiveReportDraft {
  const result = validateComprehensiveReportDraft(input, options);

  if (!result.ok || result.value === undefined) {
    throw new Error(
      `Comprehensive report draft is unsafe: ${result.errors.join("; ")}`,
    );
  }

  return result.value;
}
