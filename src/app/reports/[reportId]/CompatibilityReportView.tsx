import type { CompatibilityReportDraft } from "../../../lib/report-generation/compatibilityReportDraftTypes";
import { sanitizeCompatibilityAwkwardKoreanText } from "../../../lib/report-generation/compatibilityReportDraftValidator";
import {
  getCompatibilityRelationshipTypeLabel,
  getCompatibilityScoreDisplayLabels,
  getCompatibilityScoreExplanation,
} from "../../../lib/report-knowledge/compatibilityTypes";
import type {
  CompatibilityDeepSajuBridgeResult,
  CompatibilityDeepSajuLayer,
} from "../../../lib/report-knowledge/compatibilityDeepSajuBridge";

type CompatibilityReportViewProps = {
  readonly draft: CompatibilityReportDraft;
  readonly reportId?: string;
};

function formatCompatibilityRelationshipType(
  relationshipType: CompatibilityReportDraft["relationshipType"],
): string {
  return getCompatibilityRelationshipTypeLabel(relationshipType);
}

const compatibilityScoreOrder = [
  "attraction",
  "communication",
  "lifestyleRhythm",
  "conflictRecovery",
  "longTermStability",
  "growthComplement",
] as const satisfies readonly (keyof CompatibilityReportDraft["scoreSummary"]["breakdown"])[];

const finalAdviceLabels = ["대화 규칙", "생활 기준", "도움 요청", "갈등 회복"] as const;

const finalAdviceKnownPrefixes = [
  "대화 규칙",
  "생활 기준",
  "도움 요청",
  "갈등 회복",
  "실행 규칙",
  "돈과 생활",
  "관계 기준",
  "감정 표현",
  "거리 조절",
  "역할 분담",
  "피드백 규칙",
  "업무 기준",
  "의사결정",
  "신뢰 관리",
] as const;

const finalAdviceConflictMarkers = [
  "서운",
  "갈등",
  "어긋",
  "감정",
  "싸움",
  "불편",
  "회복",
] as const;

const finalAdviceHelpMarkers = [
  "도움",
  "필요",
  "요청",
  "공유",
] as const;

const deepSajuLayerOrder = [
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
] as const satisfies readonly CompatibilityDeepSajuLayer[];

const expandedDeepSajuNoteLimit = 4;

const expandedDeepSajuLayerOrder = [
  "day_master_relation",
  "element_complement",
  "combined_element_climate",
  "branch_clash",
  "branch_harm",
  "cross_ten_god",
  "branch_trine",
  "spouse_palace",
  "month_rhythm",
  "hour_life_rhythm",
] as const satisfies readonly CompatibilityDeepSajuLayer[];

const pillarElementByChar: Record<string, string> = {
  甲: "wood",
  乙: "wood",
  寅: "wood",
  卯: "wood",
  丙: "fire",
  丁: "fire",
  巳: "fire",
  午: "fire",
  戊: "earth",
  己: "earth",
  辰: "earth",
  戌: "earth",
  丑: "earth",
  未: "earth",
  庚: "metal",
  辛: "metal",
  申: "metal",
  酉: "metal",
  壬: "water",
  癸: "water",
  子: "water",
  亥: "water",
};

const diagnosticOnlyChartLabelFragments = [
  "백" + "호대살",
  "백" + "호살",
  "반" + "안살",
] as const;

const branchAnimalLabels = [
  "쥐",
  "소",
  "호랑이",
  "토끼",
  "용",
  "뱀",
  "말",
  "양",
  "원숭이",
  "닭",
  "개",
  "돼지",
] as const;

function renderPillarValue(pillar: string) {
  return (
    <span className="inline-flex flex-wrap gap-1">
      {[...pillar].map((character, index) => {
        const token = pillarElementByChar[character] ?? "unknown";

        return (
          <span
            key={`${pillar}:${character}:${index}`}
            className={`element-bg--${token} rounded px-1.5 py-0.5 font-semibold text-neutral-50`}
          >
            {character}
          </span>
        );
      })}
    </span>
  );
}

function filterPublicChartLabels(labels: readonly string[]): readonly string[] {
  return labels.filter((label) => {
    const trimmed = label.trim();

    return (
      trimmed.length > 0 &&
      !diagnosticOnlyChartLabelFragments.some((blocked) =>
        trimmed.includes(blocked),
      ) &&
      !branchAnimalLabels.includes(trimmed as (typeof branchAnimalLabels)[number])
    );
  });
}

function getPersonCoreSummary(
  chart: CompatibilityReportDraft["chartComparison"]["personA"],
): string {
  if (chart.mbti === "ENTJ") {
    return "구조를 잡고 빠르게 결론을 내려는 쪽";
  }
  if (chart.mbti === "INTP") {
    return "조건과 원리를 확인하며 안정감을 찾는 쪽";
  }
  if (chart.featureLabels.some((label) => label.includes("정관"))) {
    return "기준과 책임을 먼저 확인하며 관계를 안정시키는 쪽";
  }
  if (chart.featureLabels.some((label) => label.includes("재고귀인"))) {
    return "현실 감각과 축적된 기준으로 관계를 정리하는 쪽";
  }

  return `${chart.dayPillar}의 결을 중심으로 관계 리듬을 잡는 쪽`;
}

function getPersonCautionSummary(
  chart: CompatibilityReportDraft["chartComparison"]["personA"],
): string {
  if (chart.mbti === "ENTJ") {
    return "감정 완충이 짧아질 수 있음";
  }
  if (chart.mbti === "INTP") {
    return "생각이 달아오르면 오래 머무를 수 있음";
  }
  if (chart.birthTimeConfidence === "unknown") {
    return "출생시간 근거가 제한되어 생활 리듬 해석은 낮은 확신도로 봐야 함";
  }
  if (chart.featureLabels.some((label) => label.includes("원진살"))) {
    return "가까운 관계일수록 작은 어긋남이 오래 남을 수 있음";
  }

  return "속도와 감정 표현을 상대 기준에 맞춰 확인할 필요가 있음";
}

function renderCompatibilityScoreCards(draft: CompatibilityReportDraft) {
  const scoreLabels = getCompatibilityScoreDisplayLabels(draft.relationshipType);

  return (
    <section className="space-y-4" aria-label="종합 궁합 점수 세부 항목">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {compatibilityScoreOrder.map((key) => (
          <div
            key={key}
            className="rounded-lg border border-neutral-800 bg-neutral-950/70 p-4"
          >
            <p className="text-xs font-semibold text-neutral-500">
              {scoreLabels[key]}
            </p>
            <p className="mt-1 text-2xl font-bold text-neutral-50">
              {draft.scoreSummary.breakdown[key]}
            </p>
            <p className="mt-2 text-xs leading-5 text-neutral-400">
              {getCompatibilityScoreExplanation({
                relationshipType: draft.relationshipType,
                category: key,
                score: draft.scoreSummary.breakdown[key],
              })}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function formatDayPillarLabel(dayPillar: string): string {
  return dayPillar.endsWith("일주") ? dayPillar : `${dayPillar}일주`;
}

function formatBirthTimeReflectionLabel(
  birthTimeConfidence: CompatibilityReportDraft["chartComparison"]["personA"]["birthTimeConfidence"],
): string {
  return birthTimeConfidence === "known" ? "시주 반영" : "시주 미반영";
}

function renderCompatibilityChartCard(input: {
  readonly label: string;
  readonly chart: CompatibilityReportDraft["chartComparison"]["personA"];
}) {
  const publicLabels = filterPublicChartLabels(input.chart.featureLabels).slice(0, 6);
  const pillars = [
    ["연주", input.chart.pillars.year],
    ["월주", input.chart.pillars.month],
    ["일주", input.chart.pillars.day],
    ["시주", input.chart.pillars.hour ?? "-"],
  ] as const;

  return (
    <article className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-950/60 p-5">
      <div>
        <h3 className="text-lg font-semibold text-neutral-50">{input.label}</h3>
        <p className="text-sm text-neutral-500">
          {input.chart.mbti ?? "MBTI 미입력"} ·{" "}
          {formatDayPillarLabel(input.chart.dayPillar)} ·{" "}
          {formatBirthTimeReflectionLabel(input.chart.birthTimeConfidence)}
        </p>
      </div>
      <dl className="grid gap-2 rounded-md border border-neutral-800 bg-neutral-900/60 p-3 text-sm">
        <div>
          <dt className="text-xs font-semibold text-amber-200">핵심 결</dt>
          <dd className="mt-1 leading-6 text-neutral-100">
            {getPersonCoreSummary(input.chart)}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold text-neutral-400">주의 결</dt>
          <dd className="mt-1 leading-6 text-neutral-300">
            {getPersonCautionSummary(input.chart)}
          </dd>
        </div>
      </dl>
      <dl className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
        {pillars.map(([label, value]) => (
          <div
            key={label}
            className="rounded-md border border-neutral-800 bg-neutral-900/70 p-3"
          >
            <dt className="text-xs font-semibold text-neutral-500">{label}</dt>
            <dd className="mt-1 font-medium text-neutral-100">
              {value === "-" ? "-" : renderPillarValue(value)}
            </dd>
          </div>
        ))}
      </dl>
      {publicLabels.length === 0 ? null : (
        <div className="flex flex-wrap gap-2">
          {publicLabels.map((label) => (
          <span
            key={label}
            className="rounded-full border border-neutral-700 bg-neutral-900 px-2.5 py-1 text-xs text-neutral-300"
          >
            {label}
          </span>
          ))}
        </div>
      )}
    </article>
  );
}

function renderCompatibilityKeyPoints(draft: CompatibilityReportDraft) {
  const groups = [
    ["왜 끌리는지", draft.keyCompatibilityPoints.attractionPoints],
    ["잘 맞는 지점", draft.keyCompatibilityPoints.strengthPoints],
    ["부딪히는 지점", draft.keyCompatibilityPoints.frictionPoints],
    ["관계 규칙", draft.keyCompatibilityPoints.relationshipRules],
  ] as const;

  return (
    <section className="grid gap-4 md:grid-cols-2">
      {groups.map(([title, items]) => (
        <article
          key={title}
          className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-5"
        >
          <h3 className="text-sm font-semibold text-neutral-50">{title}</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-300">
            {items.slice(0, 3).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      ))}
    </section>
  );
}

function getDraftDeepSajuBridge(
  draft: CompatibilityReportDraft,
): CompatibilityDeepSajuBridgeResult | undefined {
  return (draft as { readonly deepSajuBridge?: CompatibilityDeepSajuBridgeResult })
    .deepSajuBridge;
}

function renderDeepSajuExplanationSections(
  note: CompatibilityDeepSajuBridgeResult["notes"][number],
) {
  const sections = [
    ["명리학적으로는", note.principleExplanation],
    ["두 사람에게는", note.relationshipTranslation],
    ["좋게 쓰면", note.positiveExpression],
    ["조심할 점", note.riskExpression],
    ["실제 장면", note.everydayScene],
    ["관계 운영법", note.actionRule],
  ] as const;

  return (
    <dl className="mt-3 space-y-3">
      {sections
        .filter(([, body]) => body.trim().length > 0)
        .map(([label, body]) => (
          <div key={label} className="rounded-md border border-neutral-800 bg-neutral-950/50 p-3">
            <dt className="text-xs font-semibold text-amber-200">{label}</dt>
            <dd className="mt-1 text-sm leading-6 text-neutral-300">
              {formatCompatibilityDisplayText(body)}
            </dd>
          </div>
        ))}
    </dl>
  );
}

function getLayerOrderIndex(
  layer: CompatibilityDeepSajuLayer,
  order: readonly CompatibilityDeepSajuLayer[],
): number {
  const index = order.indexOf(layer);
  return index >= 0 ? index : Number.MAX_SAFE_INTEGER;
}

function formatCompatibilityDisplayText(text: string): string {
  return sanitizeCompatibilityAwkwardKoreanText(text);
}

function formatTechnicalRelationLabel(relationLabel: string): string {
  return formatCompatibilityDisplayText(relationLabel).replace("->", "→");
}

function renderDeepSajuStructureCard(
  draft: CompatibilityReportDraft,
) {
  const deepSajuBridge = getDraftDeepSajuBridge(draft);

  if (deepSajuBridge === undefined || deepSajuBridge.notes.length === 0) {
    return null;
  }

  const sortedNotes = [...deepSajuBridge.notes]
    .sort(
      (left, right) =>
        getLayerOrderIndex(left.layer, deepSajuLayerOrder) -
        getLayerOrderIndex(right.layer, deepSajuLayerOrder),
    );
  const expandedNotes = [...sortedNotes]
    .sort(
      (left, right) =>
        getLayerOrderIndex(left.layer, expandedDeepSajuLayerOrder) -
        getLayerOrderIndex(right.layer, expandedDeepSajuLayerOrder),
    )
    .slice(0, expandedDeepSajuNoteLimit);
  const expandedKeys = new Set(
    expandedNotes.map((note) => `${note.layer}:${note.relationLabel}`),
  );
  const compactNotes = sortedNotes.filter(
    (note) => !expandedKeys.has(`${note.layer}:${note.relationLabel}`),
  );

  return (
    <section className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-950/60 p-5">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-neutral-50">
          두 사람 사이에 생기는 명리학 구조
        </h2>
        <p className="text-sm leading-6 text-neutral-400">
          각자 사주를 따로 놓고 보는 것과 달리, 두 원국이 만났을 때 새로 생기는 관계만 추려서 봅니다.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {expandedNotes.map((note) => (
          <article
            key={`${note.layer}:${note.relationLabel}`}
            className="rounded-lg border border-neutral-800 bg-neutral-900/70 p-4"
          >
            <p className="text-xs font-semibold text-amber-200">{note.title}</p>
            <h3 className="mt-1 text-base font-semibold leading-6 text-neutral-50">
              {note.plainKoreanSummary.trim().length > 0
                ? formatCompatibilityDisplayText(note.plainKoreanSummary)
                : note.title}
            </h3>
            <p className="mt-2 text-xs font-semibold text-neutral-500">
              계산값: {formatTechnicalRelationLabel(note.relationLabel)}
            </p>
            {renderDeepSajuExplanationSections(note)}
          </article>
        ))}
      </div>
      {compactNotes.length === 0 ? null : (
        <section className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-4">
          <h3 className="text-sm font-semibold text-neutral-100">
            더 살펴볼 구조
          </h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-neutral-300">
            {compactNotes.map((note) => (
              <li key={`${note.layer}:${note.relationLabel}`}>
                <span className="font-semibold text-neutral-100">{note.title}</span>
                {": "}
                {formatCompatibilityDisplayText(note.plainKoreanSummary)}
              </li>
            ))}
          </ul>
        </section>
      )}
    </section>
  );
}

function getFinalAdviceLabel(input: {
  readonly advice: string;
  readonly index: number;
}): string {
  const defaultLabel = finalAdviceLabels[input.index] ?? "실행 규칙";

  if (defaultLabel !== "도움 요청") {
    return defaultLabel;
  }
  if (finalAdviceHelpMarkers.some((marker) => input.advice.includes(marker))) {
    return defaultLabel;
  }
  if (finalAdviceConflictMarkers.some((marker) => input.advice.includes(marker))) {
    return "갈등 회복";
  }

  return defaultLabel;
}

export function normalizeCompatibilityFinalAdviceItem(
  item: string,
  fallbackLabel: string,
): {
  readonly label: string;
  readonly body: string;
} {
  const body = sanitizeCompatibilityAwkwardKoreanText(item).trim();
  const prefix = finalAdviceKnownPrefixes.find((candidate) =>
    body.startsWith(`${candidate}:`),
  );

  if (prefix === undefined) {
    return {
      label: fallbackLabel,
      body,
    };
  }

  return {
    label: prefix,
    body: body.slice(prefix.length + 1).trim(),
  };
}

export function CompatibilityReportView({
  draft,
  reportId,
}: CompatibilityReportViewProps) {
  return (
    <article className="space-y-8 rounded-xl border border-neutral-800 bg-neutral-900/80 p-5 shadow-2xl shadow-black/30 sm:p-6">
      <header className="space-y-5">
        <div className="space-y-4 rounded-xl border border-amber-500/20 bg-neutral-950/70 p-5">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase text-amber-200">
              사주×MBTI 궁합 리포트 v1.0
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-50 sm:text-3xl">
              {draft.openingTitle}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-semibold text-neutral-100">
                {draft.personALabel}님 × {draft.personBLabel}님
              </span>
              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-100">
                {formatCompatibilityRelationshipType(draft.relationshipType)} 궁합
              </span>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-[10rem_1fr] sm:items-stretch">
            <div
              className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4"
              aria-label="종합 궁합 점수"
            >
              <p className="text-xs font-semibold text-amber-200">종합 궁합 점수</p>
              <p className="mt-2 text-5xl font-bold tracking-tight text-amber-100">
                {draft.scoreSummary.totalScore}점
              </p>
              <p className="mt-2 text-sm font-semibold leading-6 text-amber-100">
                {draft.scoreSummary.scoreLabel}
              </p>
            </div>
            <div className="flex flex-col justify-center gap-3 rounded-lg border border-neutral-800 bg-neutral-900/70 p-4">
              <p className="text-base font-semibold leading-7 text-neutral-50">
                {draft.coreLine}
              </p>
              <p className="text-sm leading-6 text-neutral-300">
                {draft.scoreSummary.scoreCaution}
              </p>
            </div>
          </div>
          <p className="max-w-prose text-base leading-7 text-neutral-300">
            {draft.openingSummary}
          </p>
        </div>
      </header>

      {reportId === undefined ? null : (
        <dl className="grid gap-3 rounded-lg border border-neutral-800 bg-neutral-950/60 p-4 text-sm">
        {reportId === undefined ? null : (
          <div className="grid gap-1 sm:grid-cols-[9rem_1fr]">
            <dt className="font-medium text-neutral-500">리포트 ID</dt>
            <dd className="break-words text-neutral-100">{reportId}</dd>
          </div>
        )}
        <div className="grid gap-1 sm:grid-cols-[9rem_1fr]">
          <dt className="font-medium text-neutral-500">상품</dt>
          <dd className="text-neutral-100">사주×MBTI 궁합 리포트 v1.0</dd>
        </div>
        <div className="grid gap-1 sm:grid-cols-[9rem_1fr]">
          <dt className="font-medium text-neutral-500">두 사람</dt>
          <dd className="text-neutral-100">
            {draft.personALabel}님 × {draft.personBLabel}님
          </dd>
        </div>
        <div className="grid gap-1 sm:grid-cols-[9rem_1fr]">
          <dt className="font-medium text-neutral-500">관계 유형</dt>
          <dd className="text-neutral-100">
            {formatCompatibilityRelationshipType(draft.relationshipType)}
          </dd>
        </div>
        </dl>
      )}

      {renderCompatibilityScoreCards(draft)}

      <section className="space-y-4" aria-label="두 사람 만세력 비교">
        <h2 className="text-xl font-semibold text-neutral-50">
          두 사람 만세력 비교
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {renderCompatibilityChartCard({
            label: `${draft.personALabel}님`,
            chart: draft.chartComparison.personA,
          })}
          {renderCompatibilityChartCard({
            label: `${draft.personBLabel}님`,
            chart: draft.chartComparison.personB,
          })}
        </div>
      </section>

      {renderDeepSajuStructureCard(draft)}

      {renderCompatibilityKeyPoints(draft)}

      <section className="space-y-5" aria-label="궁합 리포트 본문">
        {draft.chapters.map((chapter) => (
          <section
            key={chapter.id}
            className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-950/60 p-5"
          >
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-neutral-50">
                {chapter.title}
              </h2>
              <p className="text-base font-semibold leading-7 text-amber-100">
                {chapter.headline}
              </p>
            </div>
            <p className="max-w-prose whitespace-pre-line text-base leading-8 text-neutral-200">
              {chapter.body}
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              <section className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-4">
                <h3 className="text-sm font-semibold text-amber-100">
                  반복될 수 있는 장면
                </h3>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-amber-50/90">
                  {chapter.directHitScenes.map((scene) => (
                    <li key={scene}>{scene}</li>
                  ))}
                </ul>
              </section>
              {chapter.practicalAdvice.length > 0 ? (
                <section className="rounded-lg border border-neutral-700 bg-neutral-900/70 p-4">
                  <h3 className="text-sm font-semibold text-neutral-100">
                    실전 조언
                  </h3>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-300">
                    {chapter.practicalAdvice.map((advice) => (
                      <li key={advice}>{advice}</li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>
          </section>
        ))}
      </section>

      <section className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-950/60 p-5">
        <h2 className="text-lg font-semibold text-neutral-50">오늘부터 할 일</h2>
        <ol className="grid gap-3">
          {draft.finalAdvice.map((advice, index) => {
            const fallbackLabel = getFinalAdviceLabel({ advice, index });
            const normalizedAdvice = normalizeCompatibilityFinalAdviceItem(
              advice,
              fallbackLabel,
            );

            return (
              <li
                key={`${normalizedAdvice.label}:${normalizedAdvice.body}`}
                className="rounded-lg border border-neutral-800 bg-neutral-900/70 p-4"
              >
                <p className="text-sm font-semibold text-amber-100">
                  {index + 1}. {normalizedAdvice.label}
                </p>
                <p className="mt-2 text-sm leading-6 text-neutral-300">
                  {normalizedAdvice.body}
                </p>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="space-y-3 rounded-lg border border-neutral-800 bg-neutral-950/60 p-5">
        <h2 className="text-sm font-semibold text-neutral-400">안전 안내</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-500">
          {draft.safetyNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>
    </article>
  );
}
