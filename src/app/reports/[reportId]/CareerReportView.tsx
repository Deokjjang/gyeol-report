import type { ReactNode } from "react";

import {
  CareerReportManseRyeokTable,
  CareerReportMbtiProfileTable,
} from "../../../components/report-tables";
import type { CareerReportDraft } from "../../../lib/report-generation/careerReportDraftTypes";
import {
  sanitizeCareerReportVisibleText,
} from "../../../lib/report-generation/careerReportDraftValidator";
import type {
  CareerReportEvidencePacket,
} from "../../../lib/report-knowledge/careerReportTypes";

type CareerReportViewProps = {
  readonly draft: CareerReportDraft;
  readonly reportId?: string;
  readonly devStatus?: string;
  readonly evidencePacket?: CareerReportEvidencePacket;
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

function displayArchetypeLabel(value: string): string {
  const labels: Record<string, string> = {
    operator_planner: "운영형 기획자",
    builder_executor: "실행형 빌더",
    specialist_researcher: "전문 탐구형",
    sales_networker: "영업·네트워크형",
    creator_expression: "표현형 크리에이터",
    manager_controller: "관리·통제형 리더",
    independent_freelancer: "독립형 실무자",
    system_architect: "시스템 설계자",
    salary_stability: "안정 수입형",
    contract_project_income: "프로젝트 수입형",
    business_trade_income: "사업·거래 수입형",
    asset_accumulation: "자산 축적형",
    high_risk_high_volatility: "고변동 주의형",
    cost_control_first: "비용 관리형",
    side_income_builder: "부수입 설계형",
    certificate_based: "자격 증명형",
    portfolio_based: "포트폴리오 증명형",
    practice_repetition: "실습 반복형",
    deep_research: "깊이 탐구형",
    structured_curriculum: "커리큘럼형",
    mentor_feedback: "피드백 성장형",
    avoid_cramming: "벼락치기 주의형",
    career_profile: "직업 성향",
  };

  if (labels[value] !== undefined) {
    return labels[value];
  }

  return value.includes("_") ? "직업 성향" : value;
}

function nonDuplicateBody(
  body: string,
  compareWith: readonly string[],
): string | undefined {
  const normalizedBody = body.replace(/\s+/gu, " ").trim();

  if (normalizedBody.length === 0) {
    return undefined;
  }

  return compareWith.some(
    (value) => value.replace(/\s+/gu, " ").trim() === normalizedBody,
  )
    ? undefined
    : body;
}

function uniqueTextValues(values: readonly string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    const normalizedValue = value.replace(/\s+/gu, " ").trim();

    if (normalizedValue.length > 0 && !seen.has(normalizedValue)) {
      seen.add(normalizedValue);
      result.push(value);
    }
  }

  return result;
}

function limitedItems<T>(items: readonly T[], limit: number): readonly T[] {
  return items.slice(0, Math.max(0, limit));
}

function getRecommendedJobExampleFields(
  draft: CareerReportDraft,
): readonly string[] {
  return limitedItems(
    uniqueTextValues(
      draft.recommendedJobs.flatMap((job) => job.exampleFields),
    ),
    12,
  );
}

function splitRecommendedJobs(draft: CareerReportDraft): {
  readonly primaryJobs: CareerReportDraft["recommendedJobs"];
  readonly secondaryJobs: CareerReportDraft["recommendedJobs"];
} {
  return {
    primaryJobs: draft.recommendedJobs.slice(0, 6),
    secondaryJobs: draft.recommendedJobs.slice(6),
  };
}

function getTimingLabel(
  timing: CareerReportDraft["careerTiming"][number],
  index: number,
  timings: readonly CareerReportDraft["careerTiming"][number][],
): string {
  const duplicateYearCount = timings.filter(
    (item) => item.year === timing.year,
  ).length;

  if (duplicateYearCount <= 1) {
    return text(timing.label);
  }

  const sameYearIndex = timings
    .slice(0, index + 1)
    .filter((item) => item.year === timing.year).length;

  return sameYearIndex === 1
    ? `${text(timing.label)} · 연도 흐름`
    : `${text(timing.label)} · 현재 실행 기준`;
}

function renderList(items: readonly string[], label?: string) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {label === undefined ? null : (
        <p className="text-sm font-extrabold text-[#7f1d38]">{label}</p>
      )}
      <ul className="space-y-2 text-sm leading-6 text-[#4f453f]">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#b88932]" />
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
      <div className="flex flex-wrap gap-2.5">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-[#d8d1c4] bg-[#fffaf1] px-3 py-1.5 text-xs font-bold text-[#3a2f29] shadow-[0_6px_18px_rgba(42,31,24,0.04)]"
          >
            {text(item)}
          </span>
        ))}
      </div>
    </div>
  );
}

function renderRecommendedJobCard(
  job: CareerReportDraft["recommendedJobs"][number],
) {
  return (
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
          주의 기준: {text(job.caution)}
        </p>
      </div>
    </section>
  );
}

function sectionClassName(tone: SectionTone): string {
  if (tone === "summary") {
    return "motion-safe:animate-[gyeol-reveal_520ms_ease-out_both] min-w-0 max-w-full space-y-5 overflow-hidden rounded-lg border border-[#7f1d38]/20 bg-[#fffdf8] p-5 shadow-[0_22px_80px_rgba(40,24,28,0.08)] ring-1 ring-white/80 sm:p-6";
  }

  if (tone === "caution") {
    return "motion-safe:animate-[gyeol-reveal_520ms_ease-out_both] min-w-0 max-w-full space-y-5 overflow-hidden rounded-lg border border-[#c79a43]/35 bg-[#fff8ea] p-5 shadow-[0_16px_60px_rgba(96,66,22,0.06)] ring-1 ring-white/70 sm:p-6";
  }

  return "motion-safe:animate-[gyeol-reveal_520ms_ease-out_both] min-w-0 max-w-full space-y-5 overflow-hidden rounded-lg border border-[#d8d1c4] bg-[#fffdf8] p-5 shadow-[0_16px_64px_rgba(42,31,24,0.06)] ring-1 ring-white/70 sm:p-6";
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
      <div className="min-w-0 space-y-2.5">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#7f1d38]">
          {eyebrow}
        </p>
        <h2 id={titleId} className="text-[1.45rem] font-extrabold leading-8 tracking-normal text-[#201a18] [overflow-wrap:anywhere] sm:text-2xl">
          {title}
        </h2>
        {body === undefined ? null : (
          <p className="max-w-4xl text-[15px] leading-8 text-[#51453d] sm:text-base">
            {text(body)}
          </p>
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
          className="rounded-full border border-[#d8d1c4] bg-[#fffdf8]/95 px-3 py-1.5 text-sm shadow-[0_8px_24px_rgba(42,31,24,0.04)]"
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
    return (
      <div className="min-w-0 overflow-hidden rounded-lg border border-[#e5ddcf] bg-[#fffaf3] p-2 shadow-[0_14px_46px_rgba(42,31,24,0.06)]">
        {input.table}
      </div>
    );
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
      eyebrow="기초 정보"
      title="원국과 MBTI 행동층을 먼저 봅니다"
      body="직업·돈·학업 해석에 들어가기 전, 사주 원국의 구조와 MBTI 행동 패턴을 같은 화면에서 확인할 수 있게 배치했습니다."
    >
      <div className="grid min-w-0 gap-4 sm:gap-5">
        {renderTableSlot({
          title: "공통 만세력표",
          description:
            "사주 원국 정보가 준비되면 이 위치에 만세력표가 표시됩니다.",
          table: manseRyeokTable,
        })}
        {renderTableSlot({
          title: "공통 MBTI표",
          description:
            "MBTI 성향 정보가 준비되면 이 위치에 성향표가 표시됩니다.",
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
  evidencePacket,
  manseRyeokTable,
  mbtiProfileTable,
}: CareerReportViewProps) {
  const resolvedManseRyeokTable =
    manseRyeokTable ??
    (evidencePacket === undefined ? undefined : (
      <CareerReportManseRyeokTable evidence={evidencePacket} />
    ));
  const resolvedMbtiProfileTable =
    mbtiProfileTable ??
    (evidencePacket === undefined || evidencePacket.mbtiType === null ? undefined : (
      <CareerReportMbtiProfileTable evidence={evidencePacket} />
    ));
  const recommendedJobFields = getRecommendedJobExampleFields(draft);
  const { primaryJobs, secondaryJobs } = splitRecommendedJobs(draft);

  return (
    <article className="mx-auto w-full min-w-0 max-w-5xl space-y-5 text-[#201a18] sm:space-y-6">
      {devStatus === undefined ? null : (
        <aside className="w-fit rounded-md border border-[#d8d1c4] bg-[#fffdf8]/90 px-3 py-1.5 text-[11px] font-bold text-[#8b8174]">
          <span className="text-[#7f1d38]">미리보기</span>
          <span className="ml-2">{text(devStatus)}</span>
        </aside>
      )}

      <header
        data-career-report-section="report_header"
        className="motion-safe:animate-[gyeol-reveal_520ms_ease-out_both] overflow-hidden rounded-lg border border-[#d8d1c4] bg-[#fffdf8] shadow-[0_28px_100px_rgba(42,31,24,0.12)] ring-1 ring-white/80"
      >
        <div className="grid min-w-0 gap-6 border-b border-[#eadfce] bg-[#fffaf3] p-5 sm:p-7 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
          <div className="min-w-0 space-y-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#7f1d38]">
              직업·커리어·돈·학업 리포트
            </p>
            <div className="space-y-3">
              <h1 className="max-w-3xl text-[1.85rem] font-extrabold leading-9 tracking-normal text-[#201a18] [overflow-wrap:anywhere] sm:text-[2.65rem] sm:leading-[3.1rem]">
                {text(draft.openingTitle)}
              </h1>
              <p className="max-w-3xl text-base leading-8 text-[#51453d]">
                {text(draft.openingSummary)}
              </p>
            </div>
          </div>
          <div className="grid min-w-0 gap-2 text-xs font-bold text-[#4c433c] sm:min-w-48">
            <span className="rounded-md border border-[#d8d1c4] bg-[#fffdf8] px-3 py-2">
              이름 · {text(draft.personLabel)}
            </span>
            <span className="rounded-md border border-[#d8d1c4] bg-[#fffdf8] px-3 py-2">
              상품 · 직업·커리어·돈·학업
            </span>
            {reportId === undefined ? null : (
              <span className="rounded-md border border-[#d8d1c4] bg-[#fffdf8] px-3 py-2">
                report · {text(reportId)}
              </span>
            )}
          </div>
        </div>
        <div className="grid min-w-0 gap-4 p-5 sm:p-7 md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]">
          <p className="rounded-lg border border-[#7f1d38]/20 bg-[#7f1d38]/10 p-4 text-base font-extrabold leading-8 text-[#7f1d38] [overflow-wrap:anywhere]">
            {text(draft.coreLine)}
          </p>
          <p className="rounded-lg border border-[#c79a43]/30 bg-[#fff8ea] p-4 text-sm font-semibold leading-7 text-[#5a4633]">
            상담이나 투자 조언이 아닌 자기이해용 디지털 리포트입니다. 직업 선택과 돈 관리는 현실 조건과 함께 판단하세요.
          </p>
        </div>
      </header>

      {renderCommonTableArea({
        manseRyeokTable: resolvedManseRyeokTable,
        mbtiProfileTable: resolvedMbtiProfileTable,
      })}
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
        body={nonDuplicateBody(draft.careerIdentity.body, [
          draft.myeongliMbtiSummary.combinedReading,
        ])}
      >
        <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-3 rounded-lg border border-[#d8d1c4] bg-[#f8f4ed] p-4">
            <p className="text-sm font-bold text-[#7f1d38]">
              {text(displayArchetypeLabel(draft.careerIdentity.archetypeLabel))}
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
        body="직업 후보는 한 번에 전부 고르는 목록이 아니라, 강점이 살아나는 업무 축을 비교하기 위한 기준입니다."
      >
        {renderKeywordChips(recommendedJobFields, "주요 예시 분야")}
        <div className="divide-y divide-[#e5ddcf]">
          {primaryJobs.map(renderRecommendedJobCard)}
        </div>
        {secondaryJobs.length === 0 ? null : (
          <details className="rounded-lg border border-[#d8d1c4] bg-[#f8f4ed] p-4">
            <summary className="cursor-pointer text-sm font-extrabold text-[#7f1d38]">
              나머지 추천 직업 {secondaryJobs.length}개 더 보기
            </summary>
            <div className="mt-3 divide-y divide-[#e5ddcf]">
              {secondaryJobs.map(renderRecommendedJobCard)}
            </div>
          </details>
        )}
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
          {draft.careerTiming.map((timing, index) => (
            <section key={`${timing.year}-${timing.label}-${index}`} className="grid gap-3 border-l-2 border-[#c79a43] pl-4 md:grid-cols-[8rem_1fr]">
              <div>
                <p className="text-xl font-extrabold text-[#201a18]">
                  {timing.year}
                </p>
                <p className="text-sm font-bold text-[#7f1d38]">
                  {getTimingLabel(timing, index, draft.careerTiming)}
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
        eyebrow="실행 기준"
        title="바로 실행할 행동 기준"
        body="여섯 영역을 각각 길게 벌리기보다, 지금 바로 줄일 것과 남길 산출물을 먼저 정합니다."
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
              <div className="rounded-md border border-[#d8d1c4] bg-[#fffdf8] px-3 py-2">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#8b8174]">
                  바로 할 일
                </p>
                <p className="mt-1 text-sm font-bold leading-7 text-[#7f1d38]">
                  {text(item.firstAction)}
                </p>
              </div>
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
              <div className="rounded-md bg-[#f8f4ed] px-3 py-2">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#8b8174]">
                  줄이는 방법
                </p>
                <p className="mt-1 text-sm leading-7 text-[#6f675d]">
                  {text(warning.prevention)}
                </p>
              </div>
            </section>
          ))}
        </div>
      </CareerSection>

      <CareerSection
        id="safety_notes"
        eyebrow="안전 안내"
        title="안전 안내"
        tone="caution"
      >
        {renderList(draft.safetyNotes)}
      </CareerSection>
    </article>
  );
}
