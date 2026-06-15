import type {
  ComprehensiveReportV2Chapter,
  ComprehensiveReportV2Draft,
  ComprehensiveReportV2NarrativeDraft,
} from "./comprehensiveReportDraftTypes";

type SanitizableComprehensiveReportDraft =
  | ComprehensiveReportV2NarrativeDraft
  | ComprehensiveReportV2Draft;

export type ComprehensiveReportDraftSanitizerResult<
  T extends SanitizableComprehensiveReportDraft,
> = {
  readonly draft: T;
  readonly sanitized: boolean;
  readonly sanitizedTerms: readonly string[];
};

type ReplacementRule = {
  readonly term: string;
  readonly replacement: string;
  readonly pattern?: RegExp;
  readonly caseInsensitive?: boolean;
};

const REPORT_COPY_REPLACEMENT_RULES: readonly ReplacementRule[] = [
  { term: "상담치료", replacement: "전문 상담" },
  { term: "의료 상담", replacement: "전문기관 상담" },
  { term: "법률 자문", replacement: "전문가 상담" },
  { term: "투자 추천", replacement: "재무 판단" },
  { term: "수익 보장", replacement: "수익을 단정하는 표현" },
  { term: "운명 확정", replacement: "흐름을 단정하는 표현" },
  { term: "정신질환", replacement: "정신건강 관련 표현" },
  { term: "불안장애", replacement: "불안감" },
  { term: "우울증", replacement: "감정 저하" },
  { term: "진단", replacement: "해석" },
  { term: "치료", replacement: "관리" },
  { term: "이 문서에서는", replacement: "이 리포트에서는" },
  { term: "이 문서는", replacement: "이 리포트는" },
  { term: "작성된 문서", replacement: "작성된 리포트" },
  {
    term: "문서",
    replacement: "$1리포트",
    pattern:
      /(^|[^가-힣])문서(?!화| 작업| 정리|로 남기기)(?=는|를|가|입니다|라고|에서는|에서|로|의|\s|[,.!?]|$)/g,
  },
  { term: "텍스트", replacement: "문장" },
  { term: "원고", replacement: "리포트" },
  { term: "초안", replacement: "리포트" },
  { term: "100%", replacement: "단정적으로" },
  { term: "무조건", replacement: "쉽게" },
  { term: "반드시", replacement: "가능하면" },
  { term: "profileTable", replacement: "명리학 표", caseInsensitive: true },
  { term: "response_format", replacement: "응답 형식", caseInsensitive: true },
  { term: "evidence packet", replacement: "근거", caseInsensitive: true },
  { term: "OpenAI", replacement: "이 리포트", caseInsensitive: true },
  { term: "JSON", replacement: "리포트 형식", caseInsensitive: true },
  { term: "프롬프트", replacement: "작성 기준" },
  { term: "rawText", replacement: "본문", caseInsensitive: true },
  { term: "raw", replacement: "원문", caseInsensitive: true },
  { term: "Authorization", replacement: "", caseInsensitive: true },
  { term: "API key", replacement: "", caseInsensitive: true },
  { term: "체감형 명중", replacement: "실감나는 해석" },
  { term: "정리와 각인", replacement: "마무리" },
  { term: "signature scene", replacement: "구체적인 장면", caseInsensitive: true },
  { term: "spotlight", replacement: "핵심 기운", caseInsensitive: true },
  { term: "feature evidence", replacement: "해석 근거", caseInsensitive: true },
  { term: "selected evidence", replacement: "해석 근거", caseInsensitive: true },
  { term: "computed feature", replacement: "계산된 기운", caseInsensitive: true },
  { term: "prompt", replacement: "작성 기준", caseInsensitive: true },
  { term: "시그니처 장면", replacement: "구체적인 장면" },
  { term: "스포트라이트", replacement: "핵심 기운" },
  { term: "선택된 근거", replacement: "해석 근거" },
  { term: "계산된 feature", replacement: "계산된 기운" },
  { term: "생성 프롬프트", replacement: "작성 기준" },
  { term: "내부 지시", replacement: "작성 기준" },
  { term: "contrast", replacement: "대비", caseInsensitive: true },
  { term: "output", replacement: "표현", caseInsensitive: true },
  { term: "input", replacement: "입력값", caseInsensitive: true },
  { term: "draft", replacement: "리포트", caseInsensitive: true },
  { term: "schema", replacement: "형식", caseInsensitive: true },
  { term: "debug", replacement: "검토", caseInsensitive: true },
  {
    term: "MBTI type examples",
    replacement:
      "MBTI 유형명보다 중요한 것은 실제 생활 리듬, 약속 습관, 감정 표현 방식입니다.",
    pattern: /MBTI 예시:\s*ISFP,\s*INFP,\s*INTP[^.。]*[.。]?/g,
  },
  { term: "MBTI 예시:", replacement: "MBTI 관계 기준:" },
  {
    term: "ISFP, INFP, INTP처럼",
    replacement:
      "MBTI 유형명보다 중요한 것은 실제 생활 리듬, 약속 습관, 감정 표현 방식이라는 점처럼",
  },
  {
    term: "ISFP, INFP, INTP",
    replacement:
      "MBTI 유형명보다 중요한 것은 실제 생활 리듬, 약속 습관, 감정 표현 방식입니다",
  },
];

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function sanitizeText(input: string, sanitizedTerms: Set<string>): string {
  return REPORT_COPY_REPLACEMENT_RULES.reduce((current, rule) => {
    const pattern =
      rule.pattern === undefined
        ? new RegExp(
            escapeRegExp(rule.term),
            rule.caseInsensitive === true ? "gi" : "g",
          )
        : new RegExp(rule.pattern.source, rule.pattern.flags);

    if (!pattern.test(current)) {
      return current;
    }

    sanitizedTerms.add(rule.term);

    return current
      .replace(pattern, rule.replacement)
      .replace(/[ \t]{2,}/g, " ")
      .replace(/\s+([,.!?])/g, "$1")
      .trim();
  }, input);
}

function sanitizeTextList(
  input: readonly string[],
  sanitizedTerms: Set<string>,
): readonly string[] {
  return input.map((item) => sanitizeText(item, sanitizedTerms));
}

function sanitizeChapter(
  chapter: ComprehensiveReportV2Chapter,
  sanitizedTerms: Set<string>,
): ComprehensiveReportV2Chapter {
  return {
    ...chapter,
    titleKo: sanitizeText(chapter.titleKo, sanitizedTerms),
    headline: sanitizeText(chapter.headline, sanitizedTerms),
    hitReadingLines: sanitizeTextList(chapter.hitReadingLines, sanitizedTerms),
    body: sanitizeText(chapter.body, sanitizedTerms),
    solutionLines: sanitizeTextList(chapter.solutionLines, sanitizedTerms),
    keyPhrases: sanitizeTextList(chapter.keyPhrases, sanitizedTerms),
  };
}

export function sanitizeComprehensiveReportNarrativeDraft<
  T extends SanitizableComprehensiveReportDraft,
>(draft: T): ComprehensiveReportDraftSanitizerResult<T> {
  const sanitizedTerms = new Set<string>();
  const sanitizedDraft = {
    ...draft,
    openingTitle: sanitizeText(draft.openingTitle, sanitizedTerms),
    openingSummary: sanitizeText(draft.openingSummary, sanitizedTerms),
    coreLine: sanitizeText(draft.coreLine, sanitizedTerms),
    chapters: draft.chapters.map((chapter) =>
      sanitizeChapter(chapter, sanitizedTerms),
    ),
    finalAdvice: sanitizeText(draft.finalAdvice, sanitizedTerms),
    safetyNotes: sanitizeTextList(draft.safetyNotes, sanitizedTerms),
  } as T;

  return {
    draft: sanitizedDraft,
    sanitized: sanitizedTerms.size > 0,
    sanitizedTerms: [...sanitizedTerms],
  };
}
