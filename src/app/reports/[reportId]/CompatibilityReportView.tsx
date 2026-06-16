import type { CompatibilityReportDraft } from "../../../lib/report-generation/compatibilityReportDraftTypes";

type CompatibilityReportViewProps = {
  readonly draft: CompatibilityReportDraft;
  readonly reportId?: string;
  readonly status?: string;
};

function formatCompatibilityRelationshipType(
  relationshipType: CompatibilityReportDraft["relationshipType"],
): string {
  const labels = {
    love: "연애",
    some: "썸",
    marriage: "결혼/장기연애",
    friendship: "친구",
  } as const satisfies Record<CompatibilityReportDraft["relationshipType"], string>;

  return labels[relationshipType];
}

const compatibilityScoreLabels = {
  attraction: "끌림",
  communication: "대화",
  lifestyleRhythm: "생활 리듬",
  conflictRecovery: "갈등 회복",
  longTermStability: "장기 안정성",
  growthComplement: "성장 보완",
} as const satisfies Record<
  keyof CompatibilityReportDraft["scoreSummary"]["breakdown"],
  string
>;

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

function renderCompatibilityScoreCards(draft: CompatibilityReportDraft) {
  return (
    <section className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-950/60 p-5">
      <div className="grid gap-4 md:grid-cols-[12rem_1fr]">
        <div
          className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4"
          aria-label="총점"
        >
          <p className="text-xs font-semibold text-amber-200">종합 궁합 점수</p>
          <p className="mt-2 text-4xl font-bold text-amber-100">
            {draft.scoreSummary.totalScore}
          </p>
          <p className="mt-2 text-sm leading-6 text-amber-100/80">
            {draft.scoreSummary.scoreLabel}
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(draft.scoreSummary.breakdown).map(([key, score]) => (
            <div
              key={key}
              className="rounded-md border border-neutral-800 bg-neutral-900/70 p-3"
            >
              <p className="text-xs font-semibold text-neutral-500">
                {
                  compatibilityScoreLabels[
                    key as keyof CompatibilityReportDraft["scoreSummary"]["breakdown"]
                  ]
                }
              </p>
              <p className="mt-1 text-2xl font-semibold text-neutral-50">{score}</p>
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs leading-5 text-neutral-500">
        {draft.scoreSummary.scoreCaution}
      </p>
    </section>
  );
}

function renderCompatibilityChartCard(input: {
  readonly label: string;
  readonly chart: CompatibilityReportDraft["chartComparison"]["personA"];
}) {
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
          {input.chart.mbti ?? "MBTI 미입력"} · {input.chart.dayPillar} ·{" "}
          {input.chart.birthTimeConfidence === "known" ? "출생시간 입력" : "출생시간 미상"}
        </p>
      </div>
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
      <div className="flex flex-wrap gap-2">
        {input.chart.featureLabels.slice(0, 8).map((label) => (
          <span
            key={label}
            className="rounded-full border border-neutral-700 bg-neutral-900 px-2.5 py-1 text-xs text-neutral-300"
          >
            {label}
          </span>
        ))}
      </div>
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
      {groups.map(([title, items]) =>
        items.length === 0 ? null : (
          <article
            key={title}
            className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-5"
          >
            <h3 className="text-sm font-semibold text-neutral-50">{title}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-300">
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ),
      )}
    </section>
  );
}

export function CompatibilityReportView({
  draft,
  reportId,
  status,
}: CompatibilityReportViewProps) {
  return (
    <article className="space-y-8 rounded-xl border border-neutral-800 bg-neutral-900/80 p-6 shadow-2xl shadow-black/30">
      <header className="space-y-4">
        <p className="text-sm font-semibold text-amber-200">
          사주×MBTI 궁합 리포트 v1.0
        </p>
        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-50">
            {draft.openingTitle}
          </h1>
          <p className="text-base leading-7 text-neutral-300">
            {draft.openingSummary}
          </p>
        </div>
        <p className="rounded-lg border border-amber-900/70 bg-amber-950/30 p-4 text-base font-semibold leading-7 text-amber-100">
          {draft.coreLine}
        </p>
      </header>

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
        {status === undefined ? null : (
          <div className="grid gap-1 sm:grid-cols-[9rem_1fr]">
            <dt className="font-medium text-neutral-500">상태</dt>
            <dd className="text-neutral-100">{status}</dd>
          </div>
        )}
      </dl>

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
              <p className="text-sm font-medium leading-6 text-amber-100">
                {chapter.headline}
              </p>
            </div>
            <div className="space-y-3 text-base leading-8 text-neutral-200">
              {chapter.directHitScenes.map((scene) => (
                <p
                  key={scene}
                  className="rounded-md border-l-2 border-amber-500/70 bg-amber-950/20 py-2 pl-4 text-amber-50"
                >
                  {scene}
                </p>
              ))}
              <p className="whitespace-pre-line">{chapter.body}</p>
            </div>
            {chapter.practicalAdvice.length > 0 ? (
              <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-300">
                {chapter.practicalAdvice.map((advice) => (
                  <li key={advice}>{advice}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </section>

      <section className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-950/60 p-5">
        <h2 className="text-lg font-semibold text-neutral-50">오늘부터 할 일</h2>
        <ul className="list-disc space-y-2 pl-5 text-base leading-7 text-neutral-300">
          {draft.finalAdvice.map((advice) => (
            <li key={advice}>{advice}</li>
          ))}
        </ul>
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
