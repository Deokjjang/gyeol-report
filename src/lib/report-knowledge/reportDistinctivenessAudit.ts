export type ReportDistinctivenessVerdict =
  | "distinct"
  | "acceptable_overlap"
  | "too_similar";

export type ReportDistinctivenessAudit = {
  readonly comparedReportIds: readonly string[];
  readonly exactSharedSentences: readonly string[];
  readonly repeatedAdvicePhrases: readonly string[];
  readonly sharedScenePhrases: readonly string[];
  readonly similarityScore: number;
  readonly commonEvidenceFeatures: readonly string[];
  readonly suspiciousGenericOverlap: readonly string[];
  readonly verdict: ReportDistinctivenessVerdict;
};

export type ReportDistinctivenessAuditInput = {
  readonly reports: readonly {
    readonly reportId: string;
    readonly text: string;
    readonly evidenceFeatures?: readonly string[];
  }[];
};

const genericAdvicePhrases = [
  "도움을 한 문장으로 요청",
  "계좌 분리",
  "말의 온도",
  "덜 닳게 오래",
  "책임 범위",
  "밤 산책",
  "기록",
  "잠 루틴",
  "결론 전에",
] as const;

const sharedScenePhraseMarkers = [
  "담당자",
  "마감선",
  "기준표",
  "원리",
  "논리",
  "자료",
  "조건과 예외",
  "혼자",
  "질문",
] as const;

const adviceFeatureExplanations: Record<string, readonly string[]> = {
  "도움을 한 문장으로 요청": ["천을귀인", "무인성", "gwiin_cheoneul", "structure_no_resource"],
  "계좌 분리": ["재고귀인", "정재", "편재", "gwiin_jaego"],
  "말의 온도": ["현침살", "화 부족", "원진살", "sinsal_hyeonchim", "element_fire_missing", "sinsal_wonjin"],
  "덜 닳게 오래": ["수 부족", "화 부족", "토 과다", "element_water_missing", "element_fire_missing", "element_earth_excess"],
  "책임 범위": ["정관", "편관", "장성살", "ten_god_zheng_guan", "ten_god_qi_sha", "twelve_sinsal_jangseong"],
  "밤 산책": ["수 부족", "공망", "element_water_missing", "sinsal_gongmang"],
  "기록": ["수 부족", "공망", "INTP", "element_water_missing", "sinsal_gongmang"],
  "잠 루틴": ["수 부족", "화 부족", "element_water_missing", "element_fire_missing"],
  "결론 전에": ["현침살", "ENTJ", "sinsal_hyeonchim"],
};

function normalizeText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function splitSentences(text: string): readonly string[] {
  return [
    ...new Set(
      text
        .split(/(?<=[.!?。！？]|[다요죠니다])\s+/u)
        .map(normalizeText)
        .filter((sentence) => sentence.length > 20),
    ),
  ];
}

function intersection(left: readonly string[], right: readonly string[]): readonly string[] {
  const rightSet = new Set(right);

  return [...new Set(left.filter((value) => rightSet.has(value)))];
}

function getCommonEvidenceFeatures(
  reports: ReportDistinctivenessAuditInput["reports"],
): readonly string[] {
  if (reports.length < 2) {
    return [];
  }

  return reports
    .slice(1)
    .reduce<readonly string[]>(
      (common, report) => intersection(common, report.evidenceFeatures ?? []),
      reports[0]?.evidenceFeatures ?? [],
    );
}

function isPhraseExplainedByEvidence(
  phrase: string,
  commonEvidenceFeatures: readonly string[],
): boolean {
  const explanations = adviceFeatureExplanations[phrase] ?? [];

  return explanations.some((feature) => commonEvidenceFeatures.includes(feature));
}

function getPhrasesPresentInAllReports(
  reports: ReportDistinctivenessAuditInput["reports"],
  phrases: readonly string[],
): readonly string[] {
  return phrases.filter((phrase) =>
    reports.every((report) => report.text.includes(phrase)),
  );
}

function getExactSharedSentences(
  reports: ReportDistinctivenessAuditInput["reports"],
): readonly string[] {
  if (reports.length < 2) {
    return [];
  }

  return reports
    .slice(1)
    .reduce<readonly string[]>(
      (common, report) => intersection(common, splitSentences(report.text)),
      splitSentences(reports[0]?.text ?? ""),
    );
}

function calculateSimilarityScore(input: {
  readonly reports: ReportDistinctivenessAuditInput["reports"];
  readonly exactSharedSentences: readonly string[];
  readonly repeatedAdvicePhrases: readonly string[];
  readonly sharedScenePhrases: readonly string[];
}): number {
  const minTextLength = Math.max(
    1,
    Math.min(...input.reports.map((report) => normalizeText(report.text).length)),
  );
  const sharedSentenceRatio =
    input.exactSharedSentences.join(" ").length / minTextLength;
  const adviceRatio =
    input.repeatedAdvicePhrases.length / genericAdvicePhrases.length;
  const sceneRatio =
    input.sharedScenePhrases.length / sharedScenePhraseMarkers.length;

  return Math.min(
    1,
    Number((sharedSentenceRatio * 0.55 + adviceRatio * 0.35 + sceneRatio * 0.1).toFixed(2)),
  );
}

function getVerdict(input: {
  readonly similarityScore: number;
  readonly repeatedAdvicePhrases: readonly string[];
  readonly suspiciousGenericOverlap: readonly string[];
}): ReportDistinctivenessVerdict {
  if (
    input.similarityScore > 0.35 &&
    input.suspiciousGenericOverlap.length > input.repeatedAdvicePhrases.length / 2
  ) {
    return "too_similar";
  }

  if (input.repeatedAdvicePhrases.length > 0 || input.similarityScore > 0.15) {
    return "acceptable_overlap";
  }

  return "distinct";
}

export function auditReportDistinctiveness(
  input: ReportDistinctivenessAuditInput,
): ReportDistinctivenessAudit {
  const reports = input.reports.slice(0, 2);
  const commonEvidenceFeatures = getCommonEvidenceFeatures(reports);
  const exactSharedSentences = getExactSharedSentences(reports);
  const repeatedAdvicePhrases = getPhrasesPresentInAllReports(
    reports,
    genericAdvicePhrases,
  );
  const sharedScenePhrases = getPhrasesPresentInAllReports(
    reports,
    sharedScenePhraseMarkers,
  );
  const suspiciousGenericOverlap = repeatedAdvicePhrases.filter(
    (phrase) => !isPhraseExplainedByEvidence(phrase, commonEvidenceFeatures),
  );
  const similarityScore = calculateSimilarityScore({
    reports,
    exactSharedSentences,
    repeatedAdvicePhrases,
    sharedScenePhrases,
  });

  return {
    comparedReportIds: reports.map((report) => report.reportId),
    exactSharedSentences,
    repeatedAdvicePhrases,
    sharedScenePhrases,
    similarityScore,
    commonEvidenceFeatures,
    suspiciousGenericOverlap,
    verdict: getVerdict({
      similarityScore,
      repeatedAdvicePhrases,
      suspiciousGenericOverlap,
    }),
  };
}
