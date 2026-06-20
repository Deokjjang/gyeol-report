import type { CareerReportDraft } from "../../../lib/report-generation/careerReportDraftTypes";
import {
  sanitizeCareerReportVisibleText,
} from "../../../lib/report-generation/careerReportDraftValidator";

type CareerReportViewProps = {
  readonly draft: CareerReportDraft;
  readonly reportId?: string;
  readonly devStatus?: string;
};

function text(value: string): string {
  return sanitizeCareerReportVisibleText(value);
}

function renderList(items: readonly string[]) {
  return (
    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-300">
      {items.map((item) => (
        <li key={item}>{text(item)}</li>
      ))}
    </ul>
  );
}

function renderContextPills(draft: CareerReportDraft) {
  const pills = [
    ["현재 상태", draft.userContextSummary.lifeStatusLabel],
    ["해석 기준", draft.userContextSummary.fieldLabel],
    ["관계 상태", draft.userContextSummary.relationshipStatusLabel],
  ].filter((item): item is [string, string] => item[1] !== null && item[1] !== "미입력");

  return (
    <section className="flex flex-wrap gap-2" aria-label="현재 맥락">
      {pills.map(([label, value]) => (
        <div
          key={label}
          className="rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-sm"
        >
          <span className="text-neutral-500">{label}</span>
          <span className="ml-2 font-semibold text-neutral-100">{text(value)}</span>
        </div>
      ))}
    </section>
  );
}

export function CareerReportView({
  draft,
  devStatus,
}: CareerReportViewProps) {
  return (
    <article className="mx-auto max-w-5xl space-y-8 text-neutral-100">
      {devStatus === undefined ? null : (
        <aside className="rounded-md border border-neutral-800 bg-neutral-900/70 px-3 py-2 text-xs text-neutral-500">
          <span className="font-semibold text-neutral-400">개발 상태</span>
          <span className="ml-2">{text(devStatus)}</span>
        </aside>
      )}

      <header className="space-y-4">
        <p className="text-sm font-semibold text-sky-200">
          직업·커리어·금전·학업 리포트
        </p>
        <h1 className="text-3xl font-bold tracking-normal text-neutral-50 sm:text-4xl">
          {text(draft.openingTitle)}
        </h1>
        <p className="max-w-3xl text-base leading-7 text-neutral-300">
          {text(draft.openingSummary)}
        </p>
        <p className="max-w-3xl rounded-lg border border-sky-500/25 bg-sky-500/10 p-4 text-base font-semibold leading-7 text-sky-100">
          {text(draft.coreLine)}
        </p>
      </header>

      {renderContextPills(draft)}

      <section className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-5">
        <p className="text-sm font-semibold text-sky-200">커리어 정체성</p>
        <h2 className="mt-2 text-2xl font-bold text-neutral-50">
          {text(draft.careerIdentity.headline)}
        </h2>
        <p className="mt-2 text-sm font-semibold text-neutral-400">
          {text(draft.careerIdentity.archetypeLabel)}
        </p>
        <p className="mt-4 text-sm leading-7 text-neutral-300">
          {text(draft.careerIdentity.body)}
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <p className="rounded-md border border-sky-500/25 bg-sky-500/10 p-3 text-sm leading-6 text-sky-100">
            강한 자리: {text(draft.careerIdentity.strongestFit)}
          </p>
          <p className="rounded-md border border-neutral-700 bg-neutral-900 p-3 text-sm leading-6 text-neutral-300">
            주의할 자리: {text(draft.careerIdentity.biggestRisk)}
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-4">
          <p className="text-sm font-semibold text-neutral-500">명리 핵심</p>
          <p className="mt-2 text-sm leading-6 text-neutral-300">
            {text(draft.myeongliMbtiSummary.myeongliCore)}
          </p>
        </div>
        <div className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-4">
          <p className="text-sm font-semibold text-neutral-500">MBTI 행동층</p>
          <p className="mt-2 text-sm leading-6 text-neutral-300">
            {text(draft.myeongliMbtiSummary.mbtiCore)}
          </p>
        </div>
        <div className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-4">
          <p className="text-sm font-semibold text-neutral-500">결합 해석</p>
          <p className="mt-2 text-sm leading-6 text-neutral-300">
            {text(draft.myeongliMbtiSummary.combinedReading)}
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-neutral-50">잘 맞는 직업 추천</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {draft.recommendedJobs.map((job) => (
            <article
              key={job.title}
              className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-4"
            >
              <p className="text-xs font-semibold text-sky-200">{job.fit}</p>
              <h3 className="mt-1 text-lg font-bold text-neutral-50">
                {text(job.title)}
              </h3>
              <p className="mt-1 text-sm font-semibold text-neutral-300">
                {text(job.tagline)}
              </p>
              <p className="mt-3 text-sm leading-6 text-neutral-300">
                {text(job.reason)}
              </p>
              <p className="mt-2 text-sm leading-6 text-neutral-500">
                주의: {text(job.caution)}
              </p>
              {renderList(job.exampleFields)}
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-5">
        <h2 className="text-xl font-bold text-neutral-50">덜 맞는 직무·환경</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {draft.unsuitableJobs.map((job) => (
            <article key={job.title} className="rounded-md bg-neutral-900 p-4">
              <h3 className="font-semibold text-neutral-100">{text(job.title)}</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-300">
                {text(job.reason)}
              </p>
              <p className="mt-2 text-sm leading-6 text-neutral-500">
                {text(job.warning)}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-neutral-50">커리어 경로</h2>
        {draft.careerPaths.map((path) => (
          <article
            key={path.label}
            className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-5"
          >
            <p className="text-xs font-semibold text-sky-200">
              {path.fit} · {text(path.label)}
            </p>
            <h3 className="mt-1 text-lg font-bold text-neutral-50">
              {text(path.headline)}
            </h3>
            <p className="mt-3 text-sm leading-7 text-neutral-300">
              {text(path.body)}
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-sky-200">밀어볼 것</p>
                {renderList(path.push)}
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-500">줄일 것</p>
                {renderList(path.avoid)}
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-5">
          <h2 className="text-xl font-bold text-neutral-50">돈 버는 방식</h2>
          <h3 className="mt-2 font-semibold text-sky-100">
            {text(draft.moneyEarningStyle.headline)}
          </h3>
          <p className="mt-3 text-sm leading-7 text-neutral-300">
            {text(draft.moneyEarningStyle.body)}
          </p>
          {renderList(draft.moneyEarningStyle.bestIncomeChannels)}
          {renderList(draft.moneyEarningStyle.sideIncomeIdeas)}
        </div>
        <div className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-5">
          <h2 className="text-xl font-bold text-neutral-50">투자·저축 성향</h2>
          <h3 className="mt-2 font-semibold text-sky-100">
            {text(draft.investmentAndSavingStyle.headline)}
          </h3>
          <p className="mt-3 text-sm leading-7 text-neutral-300">
            {text(draft.investmentAndSavingStyle.body)}
          </p>
          {renderList(draft.investmentAndSavingStyle.suitablePatterns)}
          {renderList(draft.investmentAndSavingStyle.cautionPatterns)}
          <p className="mt-4 rounded-md border border-amber-500/25 bg-amber-500/10 p-3 text-sm leading-6 text-amber-100">
            {text(draft.investmentAndSavingStyle.forbiddenNote)}
          </p>
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-950/60 p-5">
        <h2 className="text-xl font-bold text-neutral-50">강한 시기·조심할 시기</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {draft.careerTiming.map((timing) => (
            <article key={timing.year} className="rounded-md bg-neutral-900 p-4">
              <p className="text-xs font-semibold text-sky-200">
                {timing.year} · {text(timing.label)}
              </p>
              <h3 className="mt-1 font-semibold text-neutral-50">
                {text(timing.headline)}
              </h3>
              <p className="mt-2 text-sm leading-6 text-neutral-300">
                {text(timing.body)}
              </p>
              {renderList(timing.push)}
              {renderList(timing.avoid)}
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-5">
        <h2 className="text-xl font-bold text-neutral-50">학업·자격증·포트폴리오 전략</h2>
        <h3 className="mt-2 font-semibold text-sky-100">
          {text(draft.studyCertificatePlan.headline)}
        </h3>
        <p className="mt-3 text-sm leading-7 text-neutral-300">
          {text(draft.studyCertificatePlan.body)}
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {renderList(draft.studyCertificatePlan.recommendedCertificates)}
          {renderList(draft.studyCertificatePlan.recommendedStudyMethods)}
          {renderList(draft.studyCertificatePlan.portfolioStrategy)}
          {renderList(draft.studyCertificatePlan.avoidStudyPatterns)}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-neutral-50">바로 실행할 액션 플랜</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {draft.actionPlan.map((item) => (
            <article
              key={item.label}
              className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-4"
            >
              <p className="text-xs font-semibold text-sky-200">{item.label}</p>
              <h3 className="mt-1 font-semibold text-neutral-50">
                {text(item.headline)}
              </h3>
              <p className="mt-2 text-sm leading-6 text-neutral-300">
                {text(item.body)}
              </p>
              <p className="mt-3 text-sm font-semibold leading-6 text-sky-100">
                첫 행동: {text(item.firstAction)}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-5">
        <h2 className="text-xl font-bold text-neutral-50">리스크 경고</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {draft.riskWarnings.map((warning) => (
            <article key={warning.title} className="rounded-md bg-neutral-900 p-4">
              <h3 className="font-semibold text-neutral-50">
                {text(warning.title)}
              </h3>
              <p className="mt-2 text-sm leading-6 text-neutral-300">
                {text(warning.body)}
              </p>
              <p className="mt-2 text-sm leading-6 text-neutral-500">
                예방: {text(warning.prevention)}
              </p>
            </article>
          ))}
        </div>
      </section>

      <footer className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-5">
        <h2 className="text-lg font-bold text-neutral-50">안전 안내</h2>
        {renderList(draft.safetyNotes)}
      </footer>
    </article>
  );
}
