import type { ReactNode } from "react";

import type { CareerReportDraft } from "../../../lib/report-generation/careerReportDraftTypes";
import {
  sanitizeCareerReportVisibleText,
} from "../../../lib/report-generation/careerReportDraftValidator";

type CareerReportViewProps = {
  readonly draft: CareerReportDraft;
  readonly reportId?: string;
  readonly devStatus?: string;
  readonly manseRyeokTable?: ReactNode;
  readonly mbtiProfileTable?: ReactNode;
};

type SectionTone = "default" | "summary" | "caution";

function text(value: string): string {
  return sanitizeCareerReportVisibleText(value);
}

function fitLabel(value: "high" | "medium" | "low"): string {
  if (value === "high") {
    return "적합도 높음";
  }

  if (value === "medium") {
    return "적합도 보통";
  }

  return "주의 필요";
}

function renderList(items: readonly string[], label?: string) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {label === undefined ? null : (
        <p className="text-sm font-bold text-[#7f1d38]">{label}</p>
      )}
      <ul className="space-y-2 text-sm leading-6 text-[#51453d]">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c79a43]" />
            <span>{text(item)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function renderKeywordChips(items: readonly string[], label: string) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8b8174]">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-[#d8d1c4] bg-[#fffdf8] px-3 py-1 text-xs font-bold text-[#3a2f29]"
          >
            {text(item)}
          </span>
        ))}
      </div>
    </div>
  );
}

function sectionClassName(tone: SectionTone): string {
  if (tone === "summary") {
    return "space-y-5 rounded-lg border border-[#7f1d38]/20 bg-[#fffdf8] p-5 shadow-[0_18px_60px_rgba(40,24,28,0.08)] sm:p-6";
  }

  if (tone === "caution") {
    return "space-y-5 rounded-lg border border-[#c79a43]/30 bg-[#fff8ea] p-5 sm:p-6";
  }

  return "space-y-5 rounded-lg border border-[#d8d1c4] bg-[#fffdf8] p-5 sm:p-6";
}

function CareerSection({
  id,
  eyebrow,
  title,
  body,
  tone = "default",
  children,
}: {
  readonly id: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly body?: string;
  readonly tone?: SectionTone;
  readonly children?: ReactNode;
}) {
  const titleId = `${id}-title`;

  return (
    <section
      aria-labelledby={titleId}
      data-career-report-section={id}
      className={sectionClassName(tone)}
    >
      <div className="space-y-2">
        <p className="text-sm font-extrabold text-[#7f1d38]">{eyebrow}</p>
        <h2 id={titleId} className="text-2xl font-extrabold tracking-normal text-[#201a18]">
          {title}
        </h2>
        {body === undefined ? null : (
          <p className="text-base leading-8 text-[#51453d]">{text(body)}</p>
        )}
      </div>
      {children}
    </section>
  );
}

function renderContextPills(draft: CareerReportDraft) {
  const pills = [
    ["현재 상태", draft.userContextSummary.lifeStatusLabel],
    ["해석 기준", draft.userContextSummary.fieldLabel],
    ["관계 상태", draft.userContextSummary.relationshipStatusLabel],
  ].filter((item): item is [string, string] => item[1] !== null && item[1] !== "미입력");

  if (pills.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-wrap gap-2" aria-label="현재 맥락">
      {pills.map(([label, value]) => (
        <div
          key={label}
          className="rounded-full border border-[#d8d1c4] bg-[#fffdf8] px-3 py-1.5 text-sm"
        >
          <span className="text-[#8b8174]">{label}</span>
          <span className="ml-2 font-bold text-[#201a18]">{text(value)}</span>
        </div>
      ))}
    </section>
  );
}

function renderTableSlot(input: {
  readonly title: string;
  readonly description: string;
  readonly table?: ReactNode;
}) {
  if (input.table !== undefined) {
    return <div className="min-w-0">{input.table}</div>;
  }

  return (
    <div className="rounded-lg border border-dashed border-[#d8d1c4] bg-[#f8f4ed] p-4">
      <p className="text-sm font-extrabold text-[#201a18]">{input.title}</p>
      <p className="mt-2 text-sm leading-6 text-[#6f675d]">
        {input.description}
      </p>
    </div>
  );
}

function renderCommonTableArea({
  manseRyeokTable,
  mbtiProfileTable,
}: {
  readonly manseRyeokTable?: ReactNode;
  readonly mbtiProfileTable?: ReactNode;
}) {
  return (
    <CareerSection
      id="common_tables"
      eyebrow="공통 표"
      title="만세력표와 MBTI 성향표"
      body="모든 상품 결과 화면 상단에 공통 표가 들어가는 구조입니다. 현재 CareerReportView는 표 데이터를 prop으로 받으면 그대로 렌더링하고, 없으면 결과 화면 연결 준비 상태를 보여줍니다."
    >
      <div className="grid gap-4">
        {renderTableSlot({
          title: "공통 만세력표",
          description:
            "사주 원국 table data가 연결되면 이 위치에 만세력표가 표시됩니다.",
          table: manseRyeokTable,
        })}
        {renderTableSlot({
          title: "공통 MBTI표",
          description:
            "MBTI source registry data가 연결되면 이 위치에 MBTI 성향표가 표시됩니다.",
          table: mbtiProfileTable,
        })}
      </div>
    </CareerSection>
  );
}

export function CareerReportView({
  draft,
  reportId,
  devStatus,
  manseRyeokTable,
  mbtiProfileTable,
}: CareerReportViewProps) {
  return (
    <article className="mx-auto max-w-5xl space-y-6 text-[#201a18]">
      {devStatus === undefined ? null : (
        <aside className="rounded-lg border border-[#d8d1c4] bg-[#fffdf8] px-4 py-3 text-xs text-[#6f675d]">
          <span className="font-bold text-[#201a18]">개발 상태</span>
          <span className="ml-2">{text(devStatus)}</span>
        </aside>
      )}

      <header
        data-career-report-section="report_header"
        className="space-y-5 rounded-lg border border-[#d8d1c4] bg-[#fffdf8] p-5 shadow-[0_22px_80px_rgba(40,24,28,0.10)] sm:p-7"
      >
        <div className="space-y-3">
          <p className="text-sm font-extrabold tracking-[0.16em] text-[#7f1d38]">
            직업·커리어·돈·학업 리포트
          </p>
          <h1 className="max-w-3xl text-3xl font-extrabold tracking-normal text-[#201a18] sm:text-4xl">
            {text(draft.openingTitle)}
          </h1>
          <p className="max-w-3xl text-base leading-8 text-[#51453d]">
            {text(draft.openingSummary)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-bold text-[#4c433c]">
          <span className="rounded-full border border-[#d8d1c4] bg-[#f4efe7] px-3 py-1">
            {text(draft.personLabel)}
          </span>
          <span className="rounded-full border border-[#d8d1c4] bg-[#f4efe7] px-3 py-1">
            {draft.productType}
          </span>
          {reportId === undefined ? null : (
            <span className="rounded-full border border-[#d8d1c4] bg-[#f4efe7] px-3 py-1">
              report {text(reportId)}
            </span>
          )}
        </div>
        <p className="max-w-3xl rounded-lg border border-[#7f1d38]/20 bg-[#7f1d38]/10 p-4 text-base font-bold leading-8 text-[#7f1d38]">
          {text(draft.coreLine)}
        </p>
      </header>

      {renderCommonTableArea({ manseRyeokTable, mbtiProfileTable })}
      {renderContextPills(draft)}

      <CareerSection
        id="core_summary"
        eyebrow="핵심 요약"
        title="명리 구조와 MBTI 행동층을 분리해서 읽습니다"
        body={draft.myeongliMbtiSummary.combinedReading}
        tone="summary"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <p className="text-sm font-bold text-[#7f1d38]">명리 핵심</p>
            <p className="text-sm leading-7 text-[#51453d]">
              {text(draft.myeongliMbtiSummary.myeongliCore)}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-bold text-[#7f1d38]">MBTI 행동층</p>
            <p className="text-sm leading-7 text-[#51453d]">
              {text(draft.myeongliMbtiSummary.mbtiCore)}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-bold text-[#7f1d38]">현재 맥락</p>
            <p className="text-sm leading-7 text-[#51453d]">
              {text(draft.userContextSummary.contextNote)}
            </p>
          </div>
        </div>
        {draft.myeongliMbtiSummary.tensionNote === null ? null : (
          <p className="rounded-lg border border-[#c79a43]/30 bg-[#fff8ea] p-4 text-sm leading-7 text-[#5a4633]">
            {text(draft.myeongliMbtiSummary.tensionNote)}
          </p>
        )}
      </CareerSection>

      <CareerSection
        id="career_identity"
        eyebrow="직업 정체성"
        title={text(draft.careerIdentity.headline)}
        body={draft.careerIdentity.body}
      >
        <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-3 rounded-lg border border-[#d8d1c4] bg-[#f8f4ed] p-4">
            <p className="text-sm font-bold text-[#7f1d38]">
              {text(draft.careerIdentity.archetypeLabel)}
            </p>
            <p className="text-sm leading-7 text-[#51453d]">
              강한 자리: {text(draft.careerIdentity.strongestFit)}
            </p>
            <p className="text-sm leading-7 text-[#51453d]">
              주의할 자리: {text(draft.careerIdentity.biggestRisk)}
            </p>
          </div>
          <div className="space-y-4">
            {draft.careerPaths.map((path) => (
              <section key={path.label} className="space-y-2 border-l-2 border-[#c79a43] pl-4">
                <p className="text-sm font-bold text-[#7f1d38]">
                  {fitLabel(path.fit)} · {text(path.label)}
                </p>
                <h3 className="text-base font-extrabold text-[#201a18]">
                  {text(path.headline)}
                </h3>
                <p className="text-sm leading-7 text-[#51453d]">
                  {text(path.body)}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {renderList(path.push, "밀어볼 것")}
                  {renderList(path.avoid, "줄일 것")}
                </div>
              </section>
            ))}
          </div>
        </div>
      </CareerSection>

      <CareerSection
        id="money_management"
        eyebrow="돈 관리 성향"
        title={text(draft.moneyEarningStyle.headline)}
        body={draft.moneyEarningStyle.body}
      >
        <div className="grid gap-4 md:grid-cols-3">
          {renderKeywordChips(draft.moneyEarningStyle.bestIncomeChannels, "잘 맞는 수입 채널")}
          {renderKeywordChips(draft.moneyEarningStyle.sideIncomeIdeas, "부수입 아이디어")}
          {renderKeywordChips(draft.moneyEarningStyle.riskyIncomeChannels, "주의할 수입 방식")}
        </div>
      </CareerSection>

      <CareerSection
        id="investment_style"
        eyebrow="투자 성향"
        title={text(draft.investmentAndSavingStyle.headline)}
        body={draft.investmentAndSavingStyle.body}
        tone="caution"
      >
        <div className="grid gap-4 md:grid-cols-2">
          {renderList(draft.investmentAndSavingStyle.suitablePatterns, "맞는 방식")}
          {renderList(draft.investmentAndSavingStyle.cautionPatterns, "주의할 방식")}
        </div>
        <p className="rounded-lg border border-[#c79a43]/30 bg-[#fffdf8] p-4 text-sm font-semibold leading-7 text-[#5a4633]">
          {text(draft.investmentAndSavingStyle.forbiddenNote)}
        </p>
      </CareerSection>

      <CareerSection
        id="study_certificate_strategy"
        eyebrow="공부/자격증 전략"
        title={text(draft.studyCertificatePlan.headline)}
        body={draft.studyCertificatePlan.body}
      >
        <div className="grid gap-4 md:grid-cols-2">
          {renderList(draft.studyCertificatePlan.recommendedCertificates, "추천 자격·분야")}
          {renderList(draft.studyCertificatePlan.recommendedStudyMethods, "공부 방식")}
          {renderList(draft.studyCertificatePlan.portfolioStrategy, "포트폴리오")}
          {renderList(draft.studyCertificatePlan.avoidStudyPatterns, "피할 공부 패턴")}
        </div>
      </CareerSection>

      <CareerSection
        id="recommended_jobs"
        eyebrow="추천 직업"
        title="잘 맞는 직업과 업무 포지션"
      >
        <div className="divide-y divide-[#e5ddcf]">
          {draft.recommendedJobs.map((job) => (
            <section key={job.title} className="grid gap-3 py-4 first:pt-0 last:pb-0 md:grid-cols-[12rem_1fr]">
              <div className="space-y-1">
                <p className="text-xs font-extrabold text-[#7f1d38]">
                  {fitLabel(job.fit)}
                </p>
                <h3 className="text-lg font-extrabold text-[#201a18]">
                  {text(job.title)}
                </h3>
                <p className="text-sm font-bold text-[#6f675d]">
                  {text(job.tagline)}
                </p>
              </div>
              <div className="space-y-3">
                <p className="text-sm leading-7 text-[#51453d]">
                  {text(job.reason)}
                </p>
                <p className="text-sm leading-7 text-[#6f675d]">
                  주의: {text(job.caution)}
                </p>
                {renderKeywordChips(job.exampleFields, "예시 분야")}
              </div>
            </section>
          ))}
        </div>
      </CareerSection>

      <CareerSection
        id="avoid_jobs"
        eyebrow="피해야 할 직무/환경"
        title="지속성이 떨어지는 업무 조건"
      >
        <div className="space-y-4">
          {draft.unsuitableJobs.map((job) => (
            <section key={job.title} className="space-y-2 border-l-2 border-[#7f1d38] pl-4">
              <h3 className="text-base font-extrabold text-[#201a18]">
                {text(job.title)}
              </h3>
              <p className="text-sm leading-7 text-[#51453d]">
                {text(job.reason)}
              </p>
              <p className="text-sm leading-7 text-[#6f675d]">
                {text(job.warning)}
              </p>
            </section>
          ))}
        </div>
      </CareerSection>

      <CareerSection
        id="timing_hints"
        eyebrow="타이밍 힌트"
        title="강하게 밀 시기와 줄일 시기"
      >
        <div className="space-y-4">
          {draft.careerTiming.map((timing) => (
            <section key={timing.year} className="grid gap-3 border-l-2 border-[#c79a43] pl-4 md:grid-cols-[8rem_1fr]">
              <div>
                <p className="text-xl font-extrabold text-[#201a18]">
                  {timing.year}
                </p>
                <p className="text-sm font-bold text-[#7f1d38]">
                  {text(timing.label)}
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-base font-extrabold text-[#201a18]">
                  {text(timing.headline)}
                </h3>
                <p className="text-sm leading-7 text-[#51453d]">
                  {text(timing.body)}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {renderList(timing.push, "밀어볼 것")}
                  {renderList(timing.avoid, "줄일 것")}
                </div>
              </div>
            </section>
          ))}
        </div>
      </CareerSection>

      <CareerSection
        id="action_plan"
        eyebrow="action plan"
        title="바로 실행할 행동 기준"
      >
        <div className="grid gap-4 md:grid-cols-2">
          {draft.actionPlan.map((item) => (
            <section key={item.label} className="space-y-2 rounded-lg border border-[#d8d1c4] bg-[#f8f4ed] p-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#7f1d38]">
                {item.label}
              </p>
              <h3 className="text-base font-extrabold text-[#201a18]">
                {text(item.headline)}
              </h3>
              <p className="text-sm leading-7 text-[#51453d]">
                {text(item.body)}
              </p>
              <p className="text-sm font-bold leading-7 text-[#7f1d38]">
                첫 행동: {text(item.firstAction)}
              </p>
            </section>
          ))}
        </div>
      </CareerSection>

      <CareerSection
        id="risk_warnings"
        eyebrow="리스크 관리"
        title="일과 돈에서 먼저 줄여야 할 패턴"
      >
        <div className="space-y-4">
          {draft.riskWarnings.map((warning) => (
            <section key={warning.title} className="space-y-2 border-l-2 border-[#7f1d38] pl-4">
              <h3 className="text-base font-extrabold text-[#201a18]">
                {text(warning.title)}
              </h3>
              <p className="text-sm leading-7 text-[#51453d]">
                {text(warning.body)}
              </p>
              <p className="text-sm leading-7 text-[#6f675d]">
                예방: {text(warning.prevention)}
              </p>
            </section>
          ))}
        </div>
      </CareerSection>

      <CareerSection
        id="safety_notes"
        eyebrow="safety notes"
        title="안전 안내"
        tone="caution"
      >
        {renderList(draft.safetyNotes)}
      </CareerSection>
    </article>
  );
}
