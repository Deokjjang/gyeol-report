import type { ReactNode } from "react";

import {
  LoveMarriageChildReportManseRyeokTable,
  LoveMarriageChildReportMbtiProfileTable,
  ManseRyeokCommonTable,
  MbtiCommonProfileTable,
} from "../../../components/report-tables";
import {
  buildManseRyeokCommonTableData,
  buildMbtiCommonProfileTableData,
  getMbtiSourceByType,
} from "../../../lib/report-tables";
import { getPaidReportResult } from "../../../lib/reports/supabasePaidReportResultAdapter";
import { createSupabasePaidReportResultClient } from "../../../lib/reports/supabasePaidReportResultClient";
import type { PaidReportResult } from "../../../lib/reports/paidReportResultTypes";
import type {
  ComprehensiveReportDraft,
  ComprehensiveReportDraftSection,
  ComprehensiveReportV2Chapter,
  ComprehensiveReportV2PillarGridColumn,
  ComprehensiveReportV2ProfileTable,
} from "../../../lib/report-generation/comprehensiveReportDraftTypes";
import {
  isComprehensiveReportV2Draft,
} from "../../../lib/report-generation/comprehensiveReportDraftTypes";
import type {
  CompatibilityReportDraft,
} from "../../../lib/report-generation/compatibilityReportDraftTypes";
import {
  isCompatibilityReportDraft,
} from "../../../lib/report-generation/compatibilityReportDraftTypes";
import type {
  LoveMarriageChildReportDraft,
} from "../../../lib/report-generation/loveMarriageChildReportDraftTypes";
import type {
  MajorFortuneReportDraft,
} from "../../../lib/report-generation/majorFortuneReportDraftTypes";
import type {
  AnnualFortuneReportDraft,
} from "../../../lib/report-generation/annualFortuneReportDraftTypes";
import type {
  MajorFortuneEvidencePacket,
} from "../../../lib/report-knowledge/majorFortuneTypes";
import { getSajuBranchSymbolEntry } from "../../../lib/report-knowledge/sajuBranchSymbolKnowledge";
import { AnnualFortuneReportView } from "./AnnualFortuneReportView";
import { CompatibilityReportView } from "./CompatibilityReportView";
import { LoveMarriageChildReportView } from "./LoveMarriageChildReportView";
import { MajorFortuneReportView } from "./MajorFortuneReportView";

export const dynamic = "force-dynamic";

type ReportResultPageProps = {
  readonly params: Promise<{
    readonly reportId?: string;
  }>;
};

type PageState =
  | {
      readonly kind: "invalid";
    }
  | {
      readonly kind: "invalidSnapshot";
    }
  | {
      readonly kind: "unavailable";
    }
  | {
      readonly kind: "ready";
      readonly result: PaidReportResult;
    };

const displaySectionIds = ["manse_table", "mbti_table"] as const;

function createResultClient() {
  return createSupabasePaidReportResultClient({
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  });
}

async function loadPageState(reportId: string): Promise<PageState> {
  const result = await getPaidReportResult({
    reportId,
    client: createResultClient(),
  });

  if (!result.ok) {
    if (
      result.error.code === "REPORT_RESULT_INVALID_REQUEST" ||
      result.error.code === "REPORT_RESULT_INVALID_REPORT_ID"
    ) {
      return { kind: "invalid" };
    }

    if (result.error.code === "REPORT_RESULT_SNAPSHOT_INVALID") {
      return { kind: "invalidSnapshot" };
    }

    return { kind: "unavailable" };
  }

  return {
    kind: "ready",
    result: result.result,
  };
}

function isDisplaySection(section: ComprehensiveReportDraftSection): boolean {
  return (displaySectionIds as readonly string[]).includes(section.sectionId);
}

function uniqueValues(values: readonly string[]): readonly string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function collectDraftSajuTerms(result: PaidReportResult): readonly string[] {
  if (result.draft === null) {
    return [];
  }
  if (isComprehensiveReportV2Draft(result.draft)) {
    return uniqueValues(
      result.draft.chapters.flatMap((chapter) => chapter.sajuTermsUsed),
    );
  }

  return uniqueValues(
    result.draft.sections.flatMap((section) => [
      ...section.sajuTermsUsed,
      ...section.evidenceSummary.filter((item) => item !== "ENTJ"),
    ]),
  );
}

function collectDraftMbtiTerms(result: PaidReportResult): readonly string[] {
  if (result.draft === null) {
    return [];
  }
  if (isComprehensiveReportV2Draft(result.draft)) {
    return uniqueValues(
      result.draft.chapters.flatMap((chapter) => chapter.mbtiTermsUsed),
    );
  }

  return uniqueValues(result.draft.sections.flatMap((section) => section.mbtiTermsUsed));
}

function ResultShell({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-neutral-950 px-5 py-10 text-neutral-50 sm:px-8">
      <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center gap-6">
        <p className="text-sm font-medium text-neutral-500">결리포트</p>
        {children}
      </section>
    </main>
  );
}

function renderInvalidState() {
  return (
    <ResultShell>
      <div className="space-y-4 rounded-xl border border-neutral-800 bg-neutral-900/80 p-6 shadow-2xl shadow-black/30">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-50">
          리포트 정보가 올바르지 않습니다.
        </h1>
        <p className="text-base leading-7 text-neutral-400">
          리포트 주소를 다시 확인해 주세요.
        </p>
      </div>
    </ResultShell>
  );
}

function renderUnavailableState() {
  return (
    <ResultShell>
      <div className="space-y-4 rounded-xl border border-neutral-800 bg-neutral-900/80 p-6 shadow-2xl shadow-black/30">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-50">
          리포트를 찾을 수 없습니다.
        </h1>
        <p className="text-base leading-7 text-neutral-400">
          결제가 완료된 리포트만 조회할 수 있습니다.
        </p>
      </div>
    </ResultShell>
  );
}

function renderInvalidSnapshotState() {
  return (
    <ResultShell>
      <div className="space-y-4 rounded-xl border border-neutral-800 bg-neutral-900/80 p-6 shadow-2xl shadow-black/30">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-50">
          리포트를 불러오지 못했습니다.
        </h1>
        <p className="text-base leading-7 text-neutral-400">
          저장된 리포트 형식을 확인할 수 없습니다.
        </p>
      </div>
    </ResultShell>
  );
}

function renderTermList(label: string, terms: readonly string[]) {
  if (terms.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-neutral-500">{label}</p>
      <div className="flex flex-wrap gap-2">
        {terms.map((term) => (
          <span
            key={term}
            className="rounded-full border border-neutral-700 bg-neutral-950/70 px-2.5 py-1 text-xs text-neutral-300"
          >
            {term}
          </span>
        ))}
      </div>
    </div>
  );
}

function renderDisplaySummaryCard(input: {
  readonly title: string;
  readonly description: string;
  readonly termsLabel: string;
  readonly terms: readonly string[];
}) {
  return (
    <section className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-950/60 p-5">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-neutral-50">{input.title}</h2>
        <p className="text-sm leading-6 text-neutral-400">{input.description}</p>
      </div>
      {renderTermList(input.termsLabel, input.terms)}
    </section>
  );
}

function renderDisplaySections(
  result: PaidReportResult,
  draft: Extract<ComprehensiveReportDraft, { readonly version: "comprehensive_v1_draft" }>,
) {
  const manseSection = draft.sections.find(
    (section) => section.sectionId === "manse_table",
  );
  const mbtiSection = draft.sections.find(
    (section) => section.sectionId === "mbti_table",
  );

  return (
    <section className="grid gap-4 md:grid-cols-2" aria-label="입력 요약">
      {renderDisplaySummaryCard({
        title: "사주 원국 요약",
        description:
          manseSection?.oneLine ?? "사주 원국에서 해석에 사용한 핵심 근거를 정리했습니다.",
        termsLabel: "사주 근거",
        terms: collectDraftSajuTerms(result),
      })}
      {renderDisplaySummaryCard({
        title: "MBTI 입력 요약",
        description:
          mbtiSection?.oneLine ?? "입력하신 MBTI 유형을 보조 기준으로 정리했습니다.",
        termsLabel: "MBTI 참고",
        terms: collectDraftMbtiTerms(result),
      })}
    </section>
  );
}

function renderEvidenceDetails(section: ComprehensiveReportDraftSection) {
  const hasEvidence =
    section.evidenceSummary.length > 0 ||
    section.sajuTermsUsed.length > 0 ||
    section.mbtiTermsUsed.length > 0;

  if (!hasEvidence) {
    return null;
  }

  return (
    <details className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-4">
      <summary className="cursor-pointer text-sm font-semibold text-neutral-400">
        분석 근거 보기
      </summary>
      <div className="mt-4 space-y-4 border-t border-neutral-800 pt-4">
        {section.evidenceSummary.length > 0 ? (
          <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-300">
            {section.evidenceSummary.map((summary) => (
              <li key={summary}>{summary}</li>
            ))}
          </ul>
        ) : null}
        <div className="grid gap-4 sm:grid-cols-2">
          {renderTermList("사주 근거", section.sajuTermsUsed)}
          {renderTermList("MBTI 참고", section.mbtiTermsUsed)}
        </div>
      </div>
    </details>
  );
}

function renderGeneratedState(result: PaidReportResult) {
  const draft = result.draft;

  if (draft === null) {
    return renderPlaceholderState(result);
  }

  const unknownDraft: unknown = draft;

  if (isCompatibilityReportDraft(unknownDraft)) {
    return renderGeneratedCompatibilityState(result, unknownDraft);
  }

  if (isLoveMarriageChildReportDraft(unknownDraft)) {
    return renderGeneratedLoveMarriageChildState(unknownDraft);
  }

  if (isMajorFortuneReportDraft(unknownDraft)) {
    return renderGeneratedMajorFortuneState(result, unknownDraft);
  }

  if (isAnnualFortuneReportDraft(unknownDraft)) {
    return renderGeneratedAnnualFortuneState(result, unknownDraft);
  }

  if (isComprehensiveReportV2Draft(draft)) {
    return renderGeneratedV2State(result, draft);
  }

  return renderGeneratedV1State(result, draft);
}

function isLoveMarriageChildReportDraft(
  value: unknown,
): value is LoveMarriageChildReportDraft {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const draft = value as Partial<LoveMarriageChildReportDraft>;

  return (
    draft.version === "v1" &&
    draft.productType === "love_marriage_child" &&
    draft.productVersion === "v1" &&
    typeof draft.personLabel === "string" &&
    typeof draft.headline === "string" &&
    typeof draft.openingSummary === "string" &&
    typeof draft.loveStyle === "object" &&
    draft.loveStyle !== null &&
    typeof draft.marriageRhythm === "object" &&
    draft.marriageRhythm !== null &&
    typeof draft.parentMode === "object" &&
    draft.parentMode !== null &&
    typeof draft.breakupReunionPattern === "object" &&
    draft.breakupReunionPattern !== null
  );
}

type MajorFortuneReportDraftWithEvidence = MajorFortuneReportDraft & {
  readonly evidencePacket?: MajorFortuneEvidencePacket;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isMajorFortuneReportDraft(
  value: unknown,
): value is MajorFortuneReportDraftWithEvidence {
  if (!isRecord(value)) {
    return false;
  }

  return (
    value.version === "v1" &&
    value.productType === "major_fortune" &&
    value.productVersion === "v1" &&
    typeof value.personLabel === "string" &&
    typeof value.openingTitle === "string" &&
    typeof value.openingSummary === "string" &&
    typeof value.coreLine === "string" &&
    isRecord(value.cycleSummary) &&
    isRecord(value.calculationBasis) &&
    Array.isArray(value.majorFortuneTimelineRows) &&
    Array.isArray(value.finalAdvice) &&
    Array.isArray(value.safetyNotes)
  );
}

function getMajorFortuneEvidencePacket(
  draft: MajorFortuneReportDraftWithEvidence,
): MajorFortuneEvidencePacket | undefined {
  const evidencePacket = draft.evidencePacket;

  if (!isRecord(evidencePacket)) {
    return undefined;
  }

  return evidencePacket.productType === "major_fortune"
    ? (evidencePacket as MajorFortuneEvidencePacket)
    : undefined;
}

function isAnnualFortuneReportDraft(
  value: unknown,
): value is AnnualFortuneReportDraft {
  if (!isRecord(value)) {
    return false;
  }

  return (
    value.version === "v1" &&
    value.productType === "annual_fortune" &&
    value.productVersion === "v1" &&
    typeof value.personLabel === "string" &&
    typeof value.openingTitle === "string" &&
    typeof value.openingSummary === "string" &&
    typeof value.coreLine === "string" &&
    isRecord(value.yearSummary) &&
    isRecord(value.scoreSummary) &&
    Array.isArray(value.monthlyFlow) &&
    Array.isArray(value.finalAdvice) &&
    Array.isArray(value.safetyNotes)
  );
}

function renderReportMetadata(result: PaidReportResult) {
  return (
    <dl className="grid gap-3 rounded-lg border border-neutral-800 bg-neutral-950/60 p-4 text-sm">
      <div className="grid gap-1 sm:grid-cols-[9rem_1fr]">
        <dt className="font-medium text-neutral-500">리포트 ID</dt>
        <dd className="break-words text-neutral-100">{result.reportId}</dd>
      </div>
      <div className="grid gap-1 sm:grid-cols-[9rem_1fr]">
        <dt className="font-medium text-neutral-500">상품</dt>
        <dd className="text-neutral-100">사주×MBTI 종합 리포트</dd>
      </div>
      <div className="grid gap-1 sm:grid-cols-[9rem_1fr]">
        <dt className="font-medium text-neutral-500">상태</dt>
        <dd className="text-neutral-100">{result.status}</dd>
      </div>
    </dl>
  );
}

function renderGeneratedCompatibilityState(
  result: PaidReportResult,
  draft: CompatibilityReportDraft,
) {
  return (
    <ResultShell>
      <CompatibilityReportView
        draft={draft}
        reportId={result.reportId}
      />
    </ResultShell>
  );
}

function renderGeneratedLoveMarriageChildState(
  draft: LoveMarriageChildReportDraft,
) {
  const evidencePacket = draft.evidencePacket;

  return (
    <LoveMarriageChildReportView
      draft={draft}
      evidencePacket={evidencePacket}
      manseRyeokTable={
        evidencePacket === undefined ? undefined : (
          <LoveMarriageChildReportManseRyeokTable evidence={evidencePacket} />
        )
      }
      mbtiProfileTable={
        evidencePacket === undefined ? undefined : (
          <LoveMarriageChildReportMbtiProfileTable evidence={evidencePacket} />
        )
      }
    />
  );
}

function renderGeneratedMajorFortuneState(
  result: PaidReportResult,
  draft: MajorFortuneReportDraftWithEvidence,
) {
  return (
    <MajorFortuneReportView
      draft={draft}
      reportId={result.reportId}
      evidencePacket={getMajorFortuneEvidencePacket(draft)}
    />
  );
}

function renderGeneratedAnnualFortuneState(
  result: PaidReportResult,
  draft: AnnualFortuneReportDraft,
) {
  return (
    <AnnualFortuneReportView
      draft={draft}
      reportId={result.reportId}
    />
  );
}

function createFallbackProfileTable(
  result: PaidReportResult,
): ComprehensiveReportV2ProfileTable {
  const sajuTerms = collectDraftSajuTerms(result);
  const mbtiTerms = collectDraftMbtiTerms(result);

  return {
    dayPillar: sajuTerms.find((term) => term.endsWith("일주")),
    dayPillarKeywords: [],
    dayMaster: sajuTerms.find(
      (term) =>
        term.endsWith("목") ||
        term.endsWith("화") ||
        term.endsWith("토") ||
        term.endsWith("금") ||
        term.endsWith("수"),
    ),
    fiveElementSummary: sajuTerms.filter(
      (term) => term.includes("과다") || term.includes("부족"),
    ),
    excessiveElements: sajuTerms.filter((term) => term.includes("과다")),
    missingElements: sajuTerms.filter((term) => term.includes("부족")),
    tenGodSummary: sajuTerms.filter((term) =>
      ["비견", "겁재", "식신", "상관", "편재", "정재", "편관", "정관", "편인", "정인"].includes(term),
    ),
    specialPatterns: sajuTerms.filter((term) =>
      ["재" + "다신약", "무인성", "무식상", "신강", "신약"].includes(term),
    ),
    sinsal: sajuTerms.filter((term) => term.endsWith("살")),
    gwiin: sajuTerms.filter((term) => term.endsWith("귀인")),
    mbti: mbtiTerms[0] ?? "입력값 없음",
  };
}

function renderCompactProfileRow(
  label: string,
  value: string | readonly string[] | undefined,
) {
  const values =
    typeof value === "string"
      ? filterDiagnosticOnlyLabels([value])
      : filterDiagnosticOnlyLabels(value ?? []);

  if (values === undefined || values.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-1 rounded-md border border-neutral-800 bg-neutral-950/50 px-3 py-2 sm:grid-cols-[7rem_1fr]">
      <dt className="text-xs font-semibold text-neutral-500">{label}</dt>
      <dd className="text-sm leading-6 text-neutral-100">{values.join(" · ")}</dd>
    </div>
  );
}

const diagnosticOnlyVisibleLabels = ["반안살", "백호살", "백호" + "대살"] as const;

function filterDiagnosticOnlyLabels(values: readonly string[]): readonly string[] {
  return values
    .map((item) => item.trim())
    .filter(
      (item) =>
        item.length > 0 &&
        !diagnosticOnlyVisibleLabels.some((label) => item.includes(label)),
    );
}

function renderFiveElementBadgeRow(
  label: string,
  value: readonly string[] | undefined,
) {
  const values = value?.filter((item) => item.trim().length > 0);

  if (values === undefined || values.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-2 rounded-md border border-neutral-800 bg-neutral-950/50 px-3 py-2 sm:grid-cols-[7rem_1fr]">
      <dt className="text-xs font-semibold text-neutral-500">{label}</dt>
      <dd className="flex flex-wrap gap-1.5 text-sm leading-6 text-neutral-100">
        {values.map((item) => {
          const visibleText = formatVisibleFiveElementBadgeText(item);

          return (
            <span
              key={item}
              className={`element-chip ${getFiveElementChipClassFromText(item)} ${getFiveElementBgClassFromText(item)} rounded border border-neutral-700 px-2 py-0.5 text-xs font-semibold text-neutral-100`}
              aria-label={getFiveElementAccessibleLabel(item)}
            >
              {visibleText}
            </span>
          );
        })}
      </dd>
    </div>
  );
}

const fiveElementChipByKo = {
  목: "wood",
  화: "fire",
  토: "earth",
  금: "metal",
  수: "water",
} as const;

const fiveElementLabelByToken = {
  wood: "목 오행",
  fire: "화 오행",
  earth: "토 오행",
  metal: "금 오행",
  water: "수 오행",
} as const;

const stemHanjaByValue = {
  갑: "甲",
  甲: "甲",
  을: "乙",
  乙: "乙",
  병: "丙",
  丙: "丙",
  정: "丁",
  丁: "丁",
  무: "戊",
  戊: "戊",
  기: "己",
  己: "己",
  경: "庚",
  庚: "庚",
  신: "辛",
  辛: "辛",
  임: "壬",
  壬: "壬",
  계: "癸",
  癸: "癸",
} as const;

type FiveElementToken = keyof typeof fiveElementLabelByToken;

function getFiveElementTokenFromText(text: string): FiveElementToken | undefined {
  const key = Object.keys(fiveElementChipByKo).find((elementKo) =>
    text.includes(elementKo),
  ) as keyof typeof fiveElementChipByKo | undefined;

  return key === undefined ? undefined : fiveElementChipByKo[key];
}

function getFiveElementChipClassFromText(text: string): string {
  const token = getFiveElementTokenFromText(text);

  return token === undefined ? "element-chip--unknown" : `element-chip--${token}`;
}

function getFiveElementBgClassFromText(text: string): string {
  const token = getFiveElementTokenFromText(text);

  return token === undefined ? "element-bg--unknown" : `element-bg--${token}`;
}

function getFiveElementAccessibleLabel(text: string): string {
  const token = getFiveElementTokenFromText(text);
  const visibleText = formatVisibleFiveElementBadgeText(text);

  return token === undefined
    ? visibleText
    : `${visibleText} (${fiveElementLabelByToken[token]})`;
}

function formatVisibleFiveElementBadgeText(text: string): string {
  return text
    .replace(/\s*·\s*(초록|빨강|갈색|금색|파랑)\s*$/u, "")
    .trim();
}

function splitProfilePillar(pillar: string | undefined) {
  if (pillar === undefined) {
    return {};
  }

  const normalized = pillar.replace("일주", "").trim();
  const characters = [...normalized];

  if (characters.length < 2) {
    return {};
  }

  return {
    heavenlyStem: characters[0]!,
    earthlyBranch: characters[1]!,
  };
}

function getFallbackPillarGrid(
  profile: ComprehensiveReportV2ProfileTable,
): readonly ComprehensiveReportV2PillarGridColumn[] {
  const createColumn = (
    columnId: ComprehensiveReportV2PillarGridColumn["columnId"],
    labelKo: string,
    pillar: string | undefined,
  ) => ({
    columnId,
    labelKo,
    ...(pillar === undefined ? {} : { pillar }),
  });

  return [
    createColumn("hour", "시주", profile.hourPillar),
    createColumn("day", "일주", profile.dayPillar),
    createColumn("month", "월주", profile.monthPillar),
    createColumn("year", "연주", profile.yearPillar),
  ].map((column) => ({
    ...column,
    ...splitProfilePillar(column.pillar),
  }));
}

function normalizeStemHanjaForManseRyeokTable(
  stem: string | undefined,
): string | undefined {
  if (stem === undefined) {
    return undefined;
  }

  return stemHanjaByValue[stem.trim() as keyof typeof stemHanjaByValue] ?? stem;
}

function normalizeBranchHanjaForManseRyeokTable(
  branch: string | undefined,
): string | undefined {
  if (branch === undefined) {
    return undefined;
  }

  return getSajuBranchSymbolEntry(branch)?.branch ?? branch;
}

function normalizePillarGridForManseRyeokTable(
  pillarGrid: readonly ComprehensiveReportV2PillarGridColumn[],
): readonly ComprehensiveReportV2PillarGridColumn[] {
  return pillarGrid.map((column) => {
    const splitPillar = splitProfilePillar(column.pillar);
    const heavenlyStem = normalizeStemHanjaForManseRyeokTable(
      column.heavenlyStem ?? splitPillar.heavenlyStem,
    );
    const earthlyBranch = normalizeBranchHanjaForManseRyeokTable(
      column.earthlyBranch ?? splitPillar.earthlyBranch,
    );

    return {
      ...column,
      ...(heavenlyStem === undefined ? {} : { heavenlyStem }),
      ...(earthlyBranch === undefined ? {} : { earthlyBranch }),
    };
  });
}

function normalizeVisibleSentence(input: string): string {
  const normalized = input
    .replace(/\s+/g, " ")
    .replace(/([.!?。])\1+/g, "$1")
    .trim();

  if (/[.!?。]$/.test(normalized)) {
    return normalized;
  }

  return `${normalized}입니다.`;
}

function joinVisibleSentences(...sentences: readonly string[]): string {
  return sentences
    .filter((sentence) => sentence.trim().length > 0)
    .map(normalizeVisibleSentence)
    .join(" ");
}

function renderV2ProfileTable(
  result: PaidReportResult,
  draft: Extract<ComprehensiveReportDraft, { readonly version: "comprehensive_v2_draft" }>,
) {
  const profile = draft.profileTable ?? createFallbackProfileTable(result);
  const pillarGrid = profile.fourPillarGrid ?? getFallbackPillarGrid(profile);
  const manseRyeokTableData = buildManseRyeokCommonTableData({
    title: "만세력",
    fourPillarGrid: normalizePillarGridForManseRyeokTable(pillarGrid),
  });
  const mbtiSource = getMbtiSourceByType(profile.mbti);
  const mbtiTableData =
    mbtiSource === null ? null : buildMbtiCommonProfileTableData(mbtiSource);
  const symbolicNickname = draft.sajuSymbolicNickname;
  const nicknameTitleIsRepeated =
    symbolicNickname !== undefined &&
    draft.openingTitle.includes(symbolicNickname.title);

  return (
    <section className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-950/60 p-5">
      <h2 className="text-lg font-semibold text-neutral-50">
        만세력 및 명리학 표
      </h2>
      <ManseRyeokCommonTable
        data={manseRyeokTableData}
        defaultOpen={true}
      />
      {mbtiTableData === null ? null : (
        <MbtiCommonProfileTable
          data={mbtiTableData}
          defaultOpen={true}
        />
      )}
      {symbolicNickname === undefined ? null : (
        <section className="rounded-lg border border-emerald-900/60 bg-emerald-950/20 p-4">
          <p className="text-xs font-semibold text-emerald-200">사주 한줄 별칭</p>
          {nicknameTitleIsRepeated ? null : (
            <h3 className="mt-1 text-base font-semibold text-neutral-50">
              {symbolicNickname.title}
            </h3>
          )}
          <p className="mt-1 text-sm leading-6 text-neutral-300">
            {symbolicNickname.subtitle}
          </p>
        </section>
      )}
      <dl className="grid gap-2">
        {renderCompactProfileRow("일간", profile.dayMaster)}
        {renderFiveElementBadgeRow(
          "오행 분포",
          profile.fiveElementBadges ?? profile.fiveElementSummary,
        )}
        {renderCompactProfileRow(
          "과다/부족",
          [...profile.excessiveElements, ...profile.missingElements],
        )}
        {renderCompactProfileRow("십성 핵심", profile.tenGodSummary)}
        {renderCompactProfileRow("주요 구조", profile.specialPatterns)}
        {renderCompactProfileRow("신살 요약", profile.majorSinsal ?? profile.sinsal)}
        {renderCompactProfileRow(
          "귀인/길신 요약",
          profile.gwiinGilshin ?? profile.gwiin,
        )}
        {renderCompactProfileRow("MBTI 입력값", profile.mbti)}
      </dl>
    </section>
  );
}

function renderV2FeatureSpotlight(
  draft: Extract<ComprehensiveReportDraft, { readonly version: "comprehensive_v2_draft" }>,
) {
  const spotlight = draft.sajuFeatureSpotlight;

  if (spotlight === undefined || spotlight.groups.length === 0) {
    return null;
  }

  const groups = spotlight.groups.filter((group) => group.items.length > 0);

  if (groups.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-950/60 p-5">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-neutral-50">{spotlight.title}</h2>
        {spotlight.subtitle === undefined ? null : (
          <p className="text-sm leading-6 text-neutral-400">{spotlight.subtitle}</p>
        )}
      </div>
      <div className="grid gap-3">
        {groups.map((group) => (
          <section key={group.groupId} className="space-y-2">
            <h3 className="text-sm font-semibold text-emerald-100">
              {group.title}
            </h3>
            <div className="grid gap-2 md:grid-cols-2">
              {group.items.slice(0, 3).map((item) => (
                <article
                  key={`${group.groupId}:${item.featureId}`}
                  className="space-y-1.5 rounded-md border border-neutral-800 bg-neutral-900/60 p-3"
                >
                  <p className="text-base font-semibold text-neutral-50">{item.labelKo}</p>
                  <p className="text-sm font-semibold leading-5 text-emerald-100">
                    {item.badge}
                  </p>
                  <p className="text-sm leading-6 text-neutral-200">
                    {joinVisibleSentences(item.shortMeaning, item.vividLine)}
                  </p>
                  <p className="text-sm leading-6 text-neutral-400">
                    {item.practicalLine}
                  </p>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}

function renderV2DifferentiationModules(
  draft: Extract<ComprehensiveReportDraft, { readonly version: "comprehensive_v2_draft" }>,
) {
  const modules =
    draft.reportDifferentiationModules?.filter((module) => module.items.length > 0) ??
    [];

  if (modules.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-950/60 p-5">
      <h2 className="text-lg font-semibold text-neutral-50">
        읽기 전에 잡고 갈 핵심 포인트
      </h2>
      <div className="grid gap-3 md:grid-cols-2">
        {modules.map((module) => (
          <section
            key={module.moduleId}
            className="space-y-3 rounded-md border border-neutral-800 bg-neutral-900/60 p-3"
          >
            <h3 className="text-sm font-semibold text-emerald-100">
              {module.title}
            </h3>
            <ul className="space-y-2 text-sm leading-6 text-neutral-200">
              {module.items.slice(0, 3).map((item) => (
                <li key={`${module.moduleId}:${item.title}`}>
                  <span className="text-emerald-200">• </span>
                  <span className="font-semibold text-neutral-50">{item.title}</span>
                  <span className="text-neutral-400">: {item.body}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}

function renderGeneratedV1State(
  result: PaidReportResult,
  draft: Extract<ComprehensiveReportDraft, { readonly version: "comprehensive_v1_draft" }>,
) {
  return (
    <ResultShell>
      <article className="space-y-8 rounded-xl border border-neutral-800 bg-neutral-900/80 p-6 shadow-2xl shadow-black/30">
        <header className="space-y-4">
          <p className="text-sm font-semibold text-emerald-200">
            사주×MBTI 종합 리포트
          </p>
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight text-neutral-50">
              {draft.openingTitle}
            </h1>
            <p className="text-base leading-7 text-neutral-300">
              {draft.openingSummary}
            </p>
          </div>
          <p className="rounded-lg border border-emerald-900/70 bg-emerald-950/30 p-4 text-base font-semibold leading-7 text-emerald-100">
            {draft.coreLine}
          </p>
        </header>

        {renderReportMetadata(result)}

        {renderDisplaySections(result, draft)}

        <section className="space-y-3" aria-label="핵심 해석">
          {draft.sections.filter((section) => !isDisplaySection(section)).map((section, index) => (
            <details
              key={section.sectionId}
              open={index < 2}
              className="group rounded-lg border border-neutral-800 bg-neutral-950/60 p-4"
            >
              <summary className="cursor-pointer list-none space-y-2">
                <span className="block text-lg font-semibold text-neutral-50">
                  {section.titleKo}
                </span>
                <span className="block text-sm leading-6 text-neutral-400">
                  {section.oneLine}
                </span>
              </summary>

              <div className="mt-5 space-y-5 border-t border-neutral-800 pt-5">
                <p className="whitespace-pre-line text-base leading-8 text-neutral-200">
                  {section.body}
                </p>

                {renderEvidenceDetails(section)}
              </div>
            </details>
          ))}
        </section>

        <section className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-5">
          <h2 className="text-lg font-semibold text-neutral-50">최종 조언</h2>
          <p className="mt-3 text-base leading-8 text-neutral-300">
            {draft.finalAdvice}
          </p>
        </section>
      </article>
    </ResultShell>
  );
}

function renderV2IntegratedChapterProse(chapter: ComprehensiveReportV2Chapter) {
  const paragraphs = [
    ...chapter.hitReadingLines,
    chapter.body,
    ...chapter.solutionLines,
  ].filter((line) => line.trim().length > 0);

  return (
    <div className="space-y-4 text-base leading-8 text-neutral-200">
      {paragraphs.map((paragraph, index) => (
        <p
          key={`${chapter.chapterId}:${index}`}
          className={
            index < chapter.hitReadingLines.length
              ? "rounded-md border-l-2 border-emerald-500/70 bg-emerald-950/20 py-2 pl-4 text-emerald-50"
              : "whitespace-pre-line"
          }
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}

function renderGeneratedV2State(
  result: PaidReportResult,
  draft: Extract<ComprehensiveReportDraft, { readonly version: "comprehensive_v2_draft" }>,
) {
  return (
    <ResultShell>
      <article className="space-y-8 rounded-xl border border-neutral-800 bg-neutral-900/80 p-6 shadow-2xl shadow-black/30">
        <header className="space-y-4">
          <p className="text-sm font-semibold text-emerald-200">
            사주×MBTI 종합 리포트
          </p>
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight text-neutral-50">
              {draft.openingTitle}
            </h1>
            <p className="text-base leading-7 text-neutral-300">
              {draft.openingSummary}
            </p>
          </div>
          <p className="rounded-lg border border-emerald-900/70 bg-emerald-950/30 p-4 text-base font-semibold leading-7 text-emerald-100">
            {draft.coreLine}
          </p>
        </header>

        {renderV2ProfileTable(result, draft)}
        {renderV2FeatureSpotlight(draft)}
        {renderV2DifferentiationModules(draft)}

        <section className="space-y-5" aria-label="리포트 본문">
          {draft.chapters.map((chapter) => (
            <section
              key={chapter.chapterId}
              className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-950/60 p-5"
            >
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-neutral-50">
                  {chapter.titleKo}
                </h2>
                <p className="text-sm font-medium leading-6 text-emerald-100">
                  {chapter.headline}
                </p>
              </div>
              {renderV2IntegratedChapterProse(chapter)}
            </section>
          ))}
        </section>
      </article>
    </ResultShell>
  );
}

function renderPlaceholderState(result: PaidReportResult) {
  return (
    <ResultShell>
      <article className="space-y-6 rounded-xl border border-neutral-800 bg-neutral-900/80 p-6 shadow-2xl shadow-black/30">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-emerald-200">
            리포트 준비 완료
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-50">
            결제가 완료되었고 리포트가 생성되었습니다.
          </h1>
        </div>

        <dl className="grid gap-3 rounded-lg border border-neutral-800 bg-neutral-950/60 p-4 text-sm">
          <div className="grid gap-1 sm:grid-cols-[9rem_1fr]">
            <dt className="font-medium text-neutral-500">리포트 ID</dt>
            <dd className="break-words text-neutral-100">{result.reportId}</dd>
          </div>
          <div className="grid gap-1 sm:grid-cols-[9rem_1fr]">
            <dt className="font-medium text-neutral-500">상품</dt>
            <dd className="text-neutral-100">사주×MBTI 종합 리포트</dd>
          </div>
          <div className="grid gap-1 sm:grid-cols-[9rem_1fr]">
            <dt className="font-medium text-neutral-500">상태</dt>
            <dd className="text-neutral-100">{result.status}</dd>
          </div>
        </dl>

        <p className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-4 text-sm leading-7 text-neutral-300">
          상세 리포트 생성 대기 중입니다.
        </p>
      </article>
    </ResultShell>
  );
}

export default async function ReportResultPage({
  params,
}: ReportResultPageProps) {
  const routeParams = await params;
  const state = await loadPageState(routeParams.reportId ?? "");

  if (state.kind === "invalid") {
    return renderInvalidState();
  }

  if (state.kind === "unavailable") {
    return renderUnavailableState();
  }

  if (state.kind === "invalidSnapshot") {
    return renderInvalidSnapshotState();
  }

  return renderGeneratedState(state.result);
}
