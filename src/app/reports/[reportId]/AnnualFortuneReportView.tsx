import type { ReactNode } from "react";

import {
  ManseRyeokCommonTable,
  MbtiCommonProfileTable,
  SaeunFortuneTable,
} from "../../../components/report-tables";
import type { AnnualFortuneReportDraft } from "../../../lib/report-generation/annualFortuneReportDraftTypes";
import {
  buildAnnualDomainLockedFinalAdvice,
  getAnnualMonthlyCardBasisLabel,
  getAnnualMonthlySectionBasisNote,
  sanitizeAnnualFortuneVisibleText,
} from "../../../lib/report-generation/annualFortuneReportDraftValidator";
import type { AnnualFortuneEvidencePacket } from "../../../lib/report-knowledge/annualFortuneEvidence";
import {
  buildAnnualFortuneReportManseRyeokTableData,
  buildAnnualFortuneReportMbtiProfileTableData,
  buildSaeunFortuneTableData,
} from "../../../lib/report-tables";

type AnnualFortuneReportViewProps = {
  readonly draft: AnnualFortuneReportDraft;
  readonly reportId?: string;
  readonly evidencePacket?: AnnualFortuneEvidencePacket;
  readonly manseRyeokTable?: ReactNode;
  readonly mbtiProfileTable?: ReactNode;
};

const panelClass =
  "min-w-0 break-words [overflow-wrap:anywhere] rounded-[8px] border border-[#ded2c2] bg-[#fffaf1] p-5 shadow-[0_16px_40px_rgba(62,45,35,0.08)]";
const sectionTitleClass =
  "break-words [overflow-wrap:anywhere] text-xl font-semibold tracking-normal text-[#2b211b] sm:text-2xl";

type StemMeta = {
  readonly element: string;
  readonly yinYang: string;
};

const stemMetaByStem: Record<string, StemMeta> = {
  甲: { element: "목", yinYang: "양목" },
  乙: { element: "목", yinYang: "음목" },
  丙: { element: "화", yinYang: "양화" },
  丁: { element: "화", yinYang: "음화" },
  戊: { element: "토", yinYang: "양토" },
  己: { element: "토", yinYang: "음토" },
  庚: { element: "금", yinYang: "양금" },
  辛: { element: "금", yinYang: "음금" },
  壬: { element: "수", yinYang: "양수" },
  癸: { element: "수", yinYang: "음수" },
};

const branchMetaByBranch: Record<string, StemMeta> = {
  子: { element: "수", yinYang: "양수" },
  丑: { element: "토", yinYang: "음토" },
  寅: { element: "목", yinYang: "양목" },
  卯: { element: "목", yinYang: "음목" },
  辰: { element: "토", yinYang: "양토" },
  巳: { element: "화", yinYang: "음화" },
  午: { element: "화", yinYang: "양화" },
  未: { element: "토", yinYang: "음토" },
  申: { element: "금", yinYang: "양금" },
  酉: { element: "금", yinYang: "음금" },
  戌: { element: "토", yinYang: "양토" },
  亥: { element: "수", yinYang: "음수" },
};

const annualFortuneFlowAreaLabels = [
  "직업·일",
  "돈·자원",
  "관계·연애",
  "건강관리·생활 리듬",
  "사회·가족",
  "공부·성장",
] as const;

function text(value: string | number | null | undefined): string {
  return sanitizeAnnualFortuneVisibleText(
    value === null || value === undefined ? "" : String(value),
  );
}

function getMonthlyBasisDisplayLabel(basis: string | null): string {
  return getAnnualMonthlyCardBasisLabel(basis);
}

function getHeroDayMasterLabel(draft: AnnualFortuneReportDraft): string | null {
  const source = [
    draft.openingSummary,
    draft.coreLine,
    draft.yearSummary.yearTone,
    draft.annualStructure.tenGodExplanation,
    draft.annualStructure.ganjiExplanation,
  ].join("\n");

  if (source.includes("甲")) {
    return "甲(갑목) 일간";
  }

  return null;
}

function getHeroPersonLabel(
  draft: AnnualFortuneReportDraft,
  userContextSummary: AnnualFortuneReportDraft["userContextSummary"],
): string {
  const originalPersonLabel = text(draft.personLabel);
  const fieldLabel =
    userContextSummary.fieldLabel === null
      ? null
      : text(userContextSummary.fieldLabel);
  const lifeStatusLabel = text(userContextSummary.lifeStatusLabel);
  let cleaned = originalPersonLabel;

  if (fieldLabel !== null && fieldLabel.length > 0) {
    cleaned = cleaned.split(fieldLabel).join("");
  }
  if (lifeStatusLabel.length > 0) {
    cleaned = cleaned.split(lifeStatusLabel).join("");
  }

  cleaned = cleaned.replace(/[·\s]+/g, " ").trim();

  if (cleaned.length > 0) {
    return cleaned;
  }
  if (
    [draft.openingTitle, draft.openingSummary, draft.coreLine].some((value) =>
      value.includes("덕민"),
    )
  ) {
    return "덕민님";
  }

  return "사용자님";
}

function shouldRenderOpeningTitle(
  openingTitle: string,
  heroContextLine: string,
): boolean {
  const sanitizedTitle = text(openingTitle);
  const sanitizedHeroContextLine = text(heroContextLine);

  return (
    sanitizedTitle.length > 0 &&
    sanitizedTitle !== sanitizedHeroContextLine &&
    !sanitizedTitle.includes(sanitizedHeroContextLine)
  );
}

function getAnnualFlowIndexHeading(
  mode: AnnualFortuneReportDraft["mode"],
): string {
  if (mode === "past_review") {
    return "회고 흐름 지표";
  }
  if (mode === "new_year_preview") {
    return "신년 흐름 지표";
  }

  return "올해 흐름 지표";
}

function getGanjiParts(ganji: string): {
  readonly stem: string;
  readonly branch: string;
} {
  const [stem = "-", branch = "-"] = [...ganji];

  return { stem, branch };
}

function renderList(items: readonly string[]) {
  return (
    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-[#51463c]">
      {items.map((item) => (
        <li key={item}>{text(item)}</li>
      ))}
    </ul>
  );
}

function renderParagraphs(items: readonly (string | null | undefined)[]) {
  const visibleItems = items.map((item) => text(item ?? "")).filter(Boolean);

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 break-words [overflow-wrap:anywhere] text-[15px] leading-8 text-[#4f453c]">
      {visibleItems.map((item) => (
        <p key={item}>{item}</p>
      ))}
    </div>
  );
}

function renderPill(label: string, value: string | number | null | undefined) {
  const visibleValue = value === null || value === undefined ? "" : text(String(value));

  if (!visibleValue) {
    return null;
  }

  return (
    <div className="min-w-0 rounded-[8px] border border-[#e4d8c8] bg-[#fffdf8] px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#95733a]">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-[#2f251f]">{visibleValue}</p>
    </div>
  );
}

function renderYearStructure(draft: AnnualFortuneReportDraft) {
  const { stem, branch } = getGanjiParts(draft.yearSummary.ganji);
  const stemMeta = stemMetaByStem[stem];
  const branchMeta = branchMetaByBranch[branch];
  const rows = [
    ["연도", `${draft.targetYear}`],
    ["간지", draft.yearSummary.ganji],
    ["천간", `${stem} · ${stemMeta?.yinYang ?? "확인 필요"}`],
    ["지지", `${branch} · ${branchMeta?.yinYang ?? "확인 필요"}`],
    [
      "오행",
      stemMeta?.element === branchMeta?.element && stemMeta !== undefined
        ? stemMeta.element
        : draft.yearSummary.elementLabel,
    ],
    ["십성", draft.yearSummary.tenGodLabel],
    ["현재 모드", draft.yearSummary.modeLabel],
  ] as const;

  return (
    <section className={panelClass}>
      <p className="text-sm font-semibold text-[#8b6d2d]">선택 연도 세운 요약</p>
      <h2 className={`${sectionTitleClass} mt-1`}>연도 구조</h2>
      <dl className="mt-4 grid gap-2 text-sm">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="grid grid-cols-[5rem_1fr] rounded-md border border-[#eadfce] bg-[#fffdf8]"
          >
            <dt className="px-3 py-2 font-semibold text-[#806c58]">{label}</dt>
            <dd className="px-3 py-2 font-medium text-[#2f251f]">
              {text(value)}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function explainAnnualSignal(value: string | null | undefined): string {
  const signal = text(value ?? "");

  if (!signal) {
    return "";
  }
  if (/장면|흐름|누적|조율|압박|회복|기준|리듬/.test(signal) && signal.length > 18) {
    return signal;
  }
  if (signal.includes("충")) {
    return `${signal}: 익숙한 흐름과 새 요구가 부딪혀 일정, 역할, 관계 기준을 다시 맞춰야 하는 장면입니다.`;
  }
  if (signal.includes("해")) {
    return `${signal}: 크게 터지는 충돌보다 서운함이나 피로가 천천히 쌓일 수 있는 지점입니다.`;
  }
  if (signal.includes("형")) {
    return `${signal}: 반복 압박이 커질 수 있어 회복 시간과 책임 범위를 먼저 좁혀야 하는 장면입니다.`;
  }
  if (signal.includes("파")) {
    return `${signal}: 기존 방식이 흔들리며 다시 맞춰야 하는 장면이 생기기 쉬운 흐름입니다.`;
  }
  if (signal.includes("반합")) {
    return `${signal}: 일부 흐름이 살아나지만 결론까지 가려면 속도와 기준 조율이 필요합니다.`;
  }
  if (signal.includes("삼합")) {
    return `${signal}: 같은 방향의 힘이 커져 장점과 과열이 함께 생길 수 있는 흐름입니다.`;
  }
  if (signal.includes("합")) {
    return `${signal}: 약속, 관계, 일정이 묶이며 실제 움직임이 생기기 쉬운 흐름입니다.`;
  }

  return signal;
}

function renderSaeunFortuneTable(
  draft: AnnualFortuneReportDraft,
  evidencePacket: AnnualFortuneEvidencePacket | undefined,
) {
  if (
    evidencePacket === undefined &&
    draft.yearSummary.ganji.length === 0 &&
    draft.monthlyFlow.length === 0
  ) {
    return null;
  }

  const tableData =
    evidencePacket === undefined
      ? buildSaeunFortuneTableData({
          title: `${text(draft.personLabel)} ${draft.targetYear}년 세운표`,
          selectedYear: draft.targetYear,
          annualFortune: {
            ganji: text(draft.yearSummary.ganji),
            stemTenGod: text(draft.yearSummary.tenGodLabel),
            interactions: [explainAnnualSignal(draft.annualStructure.branchInteractionExplanation)].filter(
              (value) => value.length > 0,
            ),
          },
          monthlyFortunes: draft.monthlyFlow.map((flow) => ({
            month: flow.month,
            monthLabel: text(flow.label),
            monthGanji: flow.monthGanji === null ? undefined : text(flow.monthGanji),
            oneLine: text(flow.headline),
            caution:
              flow.natalInteractionSummary === null
                ? null
                : explainAnnualSignal(flow.natalInteractionSummary),
            basis: getMonthlyBasisDisplayLabel(flow.monthlyBasis),
            interactions:
              flow.natalInteractionSummary === null
                ? []
                : [explainAnnualSignal(flow.natalInteractionSummary)],
          })),
        })
      : buildSaeunFortuneTableData({
          title: `${text(evidencePacket.personContext.name)} ${evidencePacket.selectedYear}년 세운표`,
          selectedYear: evidencePacket.selectedYear,
          currentDaeunCycle:
            evidencePacket.currentMajorFortune === null
              ? undefined
              : {
                  ganji: evidencePacket.currentMajorFortune.ganji,
                  stemTenGod: evidencePacket.currentMajorFortune.stemTenGod,
                  branchTenGod: evidencePacket.currentMajorFortune.branchTenGod,
                  interactions: [
                    evidencePacket.majorAnnualCross?.majorToAnnualRelation,
                    evidencePacket.majorAnnualCross?.majorTenGodToAnnualTenGod,
                  ]
                    .map(explainAnnualSignal)
                    .filter(Boolean),
                },
          annualFortune: {
            year: evidencePacket.selectedYear,
            ganji: evidencePacket.annualFortune.ganji,
            stem: evidencePacket.annualFortune.stem,
            branch: evidencePacket.annualFortune.branch,
            stemTenGod: evidencePacket.annualFortune.stemTenGod,
            branchTenGod: evidencePacket.annualFortune.branchTenGod,
            interactions: evidencePacket.natalAnnualRelations.interactions
              .map((interaction) => explainAnnualSignal(interaction.plain))
              .filter(Boolean),
          },
          monthlyFortunes: evidencePacket.monthlyFortunes.map((month) => ({
            month: month.month,
            monthLabel: month.label,
            monthGanji: month.ganji,
            stem: month.stem,
            branch: month.branch,
            stemTenGod: month.stemTenGod,
            branchTenGod: month.branchTenGod,
            oneLine: month.monthTheme,
            caution: month.caution,
            basis: "달력월 기준 운영 가이드",
            interactions: [...month.supportSignals, ...month.frictionSignals].map(
              explainAnnualSignal,
            ),
          })),
        });

  return <SaeunFortuneTable data={tableData} defaultOpen={true} />;
}

function renderYearAccessNotice(
  draft: AnnualFortuneReportDraft,
  evidencePacket: AnnualFortuneEvidencePacket | undefined,
) {
  const policy = evidencePacket?.yearAccessPolicy;
  const statusLine =
    policy === undefined
      ? draft.yearAccessNotice
      : policy.status === "locked"
        ? policy.notice
        : policy.isNewYearPreview
          ? `${policy.selectedYear}년은 신년사주 성격으로 미리 열리는 세운입니다.`
          : policy.notice;

  return (
    <section className={panelClass}>
      <p className="text-sm font-semibold text-[#8b6d2d]">조회 가능 연도 안내</p>
      <h2 className={`${sectionTitleClass} mt-1`}>세운 조회 기준</h2>
      <div className="mt-5">{renderParagraphs([
        statusLine,
        policy?.policyLabel ??
          "기본 조회 가능 연도는 과거 5년과 올해이며, 매년 12월부터 다음 해 신년사주가 열립니다.",
      ])}</div>
    </section>
  );
}

function renderCommonFoundation(
  manseRyeokTable: ReactNode | undefined,
  mbtiProfileTable: ReactNode | undefined,
  evidencePacket: AnnualFortuneEvidencePacket | undefined,
  draft: AnnualFortuneReportDraft,
) {
  const resolvedManseRyeokTable =
    manseRyeokTable ??
    (evidencePacket === undefined ? undefined : (
      <ManseRyeokCommonTable
        data={buildAnnualFortuneReportManseRyeokTableData(evidencePacket)}
        defaultOpen
      />
    ));
  const resolvedMbtiProfileTable =
    mbtiProfileTable ??
    (evidencePacket === undefined
      ? undefined
      : (() => {
          const data = buildAnnualFortuneReportMbtiProfileTableData(evidencePacket);

          return data === null ? undefined : (
            <MbtiCommonProfileTable
              data={data}
              defaultOpen={false}
              variant="compact"
            />
          );
        })());

  return (
    <section className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-[#8b6d2d]">공통 기초 정보</p>
        <h2 className={sectionTitleClass}>세운 해석에 쓰는 기본 표</h2>
      </div>
      <div className="grid items-start gap-4 xl:grid-cols-2">
        <div className={panelClass}>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-[#2b211b]">기초 만세력</h3>
            <p className="mt-1 text-sm leading-6 text-[#76685c]">
              {resolvedManseRyeokTable
                ? "선택 연도 세운이 올라오는 기준 원국표입니다."
                : "기초 만세력은 원국 데이터가 연결된 결과에서만 간단히 표시합니다."}
            </p>
          </div>
          {resolvedManseRyeokTable ? (
            <div className="max-w-full overflow-x-auto">
              {resolvedManseRyeokTable}
            </div>
          ) : (
            <p className="text-sm leading-7 text-[#76685c]">
              원국표 데이터가 없는 결과라 세운표와 본문 해석을 중심으로 읽습니다.
            </p>
          )}
        </div>
        <div className={panelClass}>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-[#2b211b]">MBTI 성향표</h3>
            <p className="mt-1 text-sm leading-6 text-[#76685c]">
              MBTI는 세운의 원인이 아니라 흐름이 행동과 선택으로 드러나는 방식을 보조합니다.
            </p>
          </div>
          {resolvedMbtiProfileTable ? (
            <div className="max-w-full overflow-x-auto">
              {resolvedMbtiProfileTable}
            </div>
          ) : (
            <p className="text-sm leading-7 text-[#76685c]">
              {text(draft.mbtiExpression) || "MBTI 성향표는 유형 데이터가 연결된 결과에서 표시됩니다."}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function renderAnnualFortuneSummary(
  draft: AnnualFortuneReportDraft,
  evidencePacket: AnnualFortuneEvidencePacket | undefined,
) {
  const annual = evidencePacket?.annualFortune;

  return (
    <section className={panelClass}>
      <p className="text-sm font-semibold text-[#8b6d2d]">선택 연도 세운</p>
      <h2 className={`${sectionTitleClass} mt-1`}>
        {text(annual?.yearTheme) || text(draft.headline) || "선택 연도 흐름"}
      </h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {renderPill("선택 연도", annual?.year ?? draft.targetYear)}
        {renderPill("간지", annual?.ganji ?? draft.yearSummary.ganji)}
        {renderPill("천간 십성", annual?.stemTenGod ?? draft.yearSummary.tenGodLabel)}
        {renderPill("지지 십성", annual?.branchTenGod)}
      </div>
      <div className="mt-5">{renderParagraphs([
        draft.selectedYearSummary,
        annual?.interpretation,
        annual?.caution,
      ])}</div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-[8px] border border-[#eadfce] bg-[#fffdf8] p-4">
          <h3 className="text-sm font-semibold text-[#6f1d35]">도움이 되는 신호</h3>
          {renderList(annual?.supportSignals ?? [])}
        </div>
        <div className="rounded-[8px] border border-[#eadfce] bg-[#fffdf8] p-4">
          <h3 className="text-sm font-semibold text-[#6f1d35]">마찰로 느껴질 수 있는 신호</h3>
          {renderList(annual?.frictionSignals ?? [])}
        </div>
      </div>
    </section>
  );
}

function renderMajorAnnualCross(
  draft: AnnualFortuneReportDraft,
  evidencePacket: AnnualFortuneEvidencePacket | undefined,
) {
  const major = evidencePacket?.currentMajorFortune;
  const cross = evidencePacket?.majorAnnualCross;

  return (
    <section className={panelClass}>
      <p className="text-sm font-semibold text-[#8b6d2d]">현재 대운과 선택 연도 세운 교차</p>
      <h2 className={`${sectionTitleClass} mt-1`}>10년 배경 위에 올라오는 1년 자극</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {renderPill("현재 대운", major?.ganji)}
        {renderPill("대운 십성", major?.stemTenGod)}
        {renderPill("선택 연도", cross?.annualGanji ?? evidencePacket?.annualFortune.ganji)}
        {renderPill("교차", cross?.majorToAnnualRelation)}
      </div>
      <div className="mt-5">{renderParagraphs([
        draft.majorAnnualCrossReading,
        major?.keyTheme,
        cross?.interpretation,
        cross?.caution,
      ])}</div>
    </section>
  );
}

function renderNatalAnnualRelations(
  draft: AnnualFortuneReportDraft,
  evidencePacket: AnnualFortuneEvidencePacket | undefined,
) {
  const relations = evidencePacket?.natalAnnualRelations;
  const interactionTexts =
    relations?.interactions.map((interaction) =>
      explainAnnualSignal(interaction.plain),
    ) ?? [draft.annualStructure.branchInteractionExplanation];

  return (
    <section className={panelClass}>
      <p className="text-sm font-semibold text-[#8b6d2d]">원국과 세운 관계</p>
      <h2 className={`${sectionTitleClass} mt-1`}>선택 연도가 원국에 닿는 지점</h2>
      <div className="mt-5">{renderParagraphs([
        draft.natalAnnualReading,
        relations?.interpretation,
        relations?.caution,
        ...interactionTexts,
      ])}</div>
    </section>
  );
}

function renderMonthlyFortuneReading(
  draft: AnnualFortuneReportDraft,
  evidencePacket: AnnualFortuneEvidencePacket | undefined,
) {
  const monthly = evidencePacket?.monthlyFortunes ?? [];
  const highlights =
    draft.monthlyHighlights.length > 0
      ? draft.monthlyHighlights
      : monthly.slice(0, 4).map((month) => ({
          monthLabel: month.label,
          headline: month.monthTheme,
          body: month.interpretation,
          actionHint: month.actionHint,
        }));

  return (
    <section className={panelClass}>
      <p className="text-sm font-semibold text-[#8b6d2d]">월운 12개월 흐름</p>
      <h2 className={`${sectionTitleClass} mt-1`}>월별 운영 리듬</h2>
      <div className="mt-5">{renderParagraphs([
        draft.monthlyFlowReading,
        getAnnualMonthlySectionBasisNote(),
      ])}</div>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {highlights.slice(0, 6).map((highlight) => (
          <article
            key={`${highlight.monthLabel}:${highlight.headline}`}
            className="rounded-[8px] border border-[#eadfce] bg-[#fffdf8] p-4"
          >
            <p className="text-xs font-semibold text-[#8b6d2d]">
              {text(highlight.monthLabel)}
            </p>
            <h3 className="mt-1 text-base font-semibold text-[#2f251f]">
              {text(highlight.headline)}
            </h3>
            <p className="mt-2 text-sm leading-7 text-[#5a4d42]">
              {text(highlight.body)}
            </p>
            <p className="mt-3 text-sm leading-7 text-[#6d5f52]">
              {text(highlight.actionHint)}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function renderDomainFlows(
  draft: AnnualFortuneReportDraft,
  evidencePacket: AnnualFortuneEvidencePacket | undefined,
) {
  const domainFlows = evidencePacket?.domainFlows;
  const flows = [
    [annualFortuneFlowAreaLabels[0], domainFlows?.careerWork ?? draft.careerWorkFlow],
    [annualFortuneFlowAreaLabels[1], domainFlows?.moneyResource ?? draft.moneyResourceFlow],
    [annualFortuneFlowAreaLabels[2], domainFlows?.relationshipLove ?? draft.relationshipFlow],
    [annualFortuneFlowAreaLabels[3], domainFlows?.healthRoutine ?? draft.healthRoutineFlow],
    [annualFortuneFlowAreaLabels[4], domainFlows?.socialFamily],
    [annualFortuneFlowAreaLabels[5], domainFlows?.studyGrowth],
  ] as const;

  return (
    <section className={panelClass}>
      <p className="text-sm font-semibold text-[#8b6d2d]">영역별 흐름</p>
      <h2 className={`${sectionTitleClass} mt-1`}>올해 흐름이 생활 영역에 나타나는 방식</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {flows.map(([label, flow]) =>
          flow === undefined ? null : (
            <article key={label} className="rounded-[8px] border border-[#eadfce] bg-[#fffdf8] p-4">
              <p className="text-xs font-semibold text-[#8b6d2d]">{label}</p>
              <h3 className="mt-1 text-base font-semibold text-[#2f251f]">
                {text(flow.title)}
              </h3>
              <p className="mt-2 text-sm leading-7 text-[#5a4d42]">
                {text(flow.summary)}
              </p>
              <p className="mt-3 text-sm leading-7 text-[#6d5f52]">
                {text(flow.actionHint)}
              </p>
            </article>
          ),
        )}
      </div>
    </section>
  );
}

function renderMbtiExpression(
  draft: AnnualFortuneReportDraft,
  evidencePacket: AnnualFortuneEvidencePacket | undefined,
) {
  const mbti = evidencePacket?.mbtiBasis;

  return (
    <section className={panelClass}>
      <p className="text-sm font-semibold text-[#8b6d2d]">MBTI 성향 발현 방식</p>
      <h2 className={`${sectionTitleClass} mt-1`}>
        {text(mbti?.type) ? `${text(mbti?.type)}가 이 세운을 쓰는 방식` : "흐름이 행동으로 드러나는 방식"}
      </h2>
      <div className="mt-5">{renderParagraphs([
        draft.mbtiExpression,
        mbti?.decisionPattern,
        mbti?.workPattern,
        mbti?.relationshipPattern,
      ])}</div>
    </section>
  );
}

function renderRiskAndActionSections(
  draft: AnnualFortuneReportDraft,
  evidencePacket: AnnualFortuneEvidencePacket | undefined,
) {
  const riskItems =
    evidencePacket?.riskPatterns.map((risk) =>
      `${risk.title}: ${risk.summary} ${risk.prevention}`,
    ) ?? draft.riskManagement;
  const actionItems =
    evidencePacket?.actionGuides.map((guide) =>
      `${guide.title}: ${guide.action} ${guide.timingHint}`,
    ) ?? draft.actionPlan;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className={panelClass}>
        <p className="text-sm font-semibold text-[#8b6d2d]">조심할 패턴</p>
        <h2 className={`${sectionTitleClass} mt-1`}>과열과 부담을 줄이는 기준</h2>
        {renderList(riskItems)}
      </section>
      <section className={panelClass}>
        <p className="text-sm font-semibold text-[#8b6d2d]">실행 기준</p>
        <h2 className={`${sectionTitleClass} mt-1`}>올해 먼저 정할 것</h2>
        {renderList(actionItems)}
      </section>
    </div>
  );
}

export function AnnualFortuneReportView({
  draft,
  reportId,
  evidencePacket,
  manseRyeokTable,
  mbtiProfileTable,
}: AnnualFortuneReportViewProps) {
  const userContextSummary = draft.userContextSummary ?? {
    lifeStatusLabel: "기타",
    fieldLabel: null,
    translationNote:
      "현재 상태와 분야 정보가 충분하지 않아 전체 흐름 장면으로 해석했습니다.",
  };
  const heroDayMasterLabel = getHeroDayMasterLabel(draft);
  const heroPersonLabel = getHeroPersonLabel(draft, userContextSummary);
  const heroContextLine = [
    heroPersonLabel,
    heroDayMasterLabel,
    text(userContextSummary.lifeStatusLabel),
  ]
    .filter((item): item is string => item !== null && item.length > 0)
    .join(" · ");
  const domainLockedFinalAdvice = buildAnnualDomainLockedFinalAdvice({ draft });
  const renderOpeningTitle = shouldRenderOpeningTitle(
    draft.openingTitle,
    heroContextLine,
  );

  return (
    <article className="w-full min-w-0 max-w-full overflow-x-hidden break-words [overflow-wrap:anywhere] space-y-8 rounded-[8px] border border-[#d8c8b5] bg-[#f8f0e6] p-5 text-[#2b211b] shadow-[0_22px_70px_rgba(77,48,35,0.12)] sm:p-6">
      <header className="w-full min-w-0 max-w-full overflow-hidden rounded-[8px] border border-[#d9c8b5] bg-[#fffaf1] shadow-[0_22px_70px_rgba(77,48,35,0.12)]">
        <div className="border-b border-[#e6d9c8] bg-[#f4eadc] px-6 py-4">
          <div className="flex min-w-0 flex-wrap items-center gap-2 text-xs font-medium text-[#7d1f39]">
            <span className="rounded-full border border-[#c8a565] bg-[#fff7df] px-3 py-1 text-[#6f4e16]">
              세운 리포트
            </span>
            <span className="min-w-0 break-words [overflow-wrap:anywhere]">
              {heroPersonLabel}의 {draft.targetYear}년 흐름
            </span>
            {reportId ? <span className="text-[#8a8077]">Report {reportId}</span> : null}
          </div>
        </div>
        <div className="min-w-0 px-6 py-8 sm:px-8 sm:py-10">
          <p className="text-sm font-semibold text-[#8b6d2d]">
            선택 연도 흐름과 현재 대운 교차를 함께 읽는 리포트
          </p>
          {renderOpeningTitle ? (
            <h1 className="mt-3 max-w-4xl break-words [overflow-wrap:anywhere] text-3xl font-semibold leading-tight tracking-normal text-[#2b211b] sm:text-4xl">
              {text(draft.openingTitle)}
            </h1>
          ) : (
            <h1 className="mt-3 max-w-4xl break-words [overflow-wrap:anywhere] text-3xl font-semibold leading-tight tracking-normal text-[#2b211b] sm:text-4xl">
              {text(draft.headline) || text(draft.coreLine)}
            </h1>
          )}
          {heroContextLine.length === 0 ? null : (
            <p className="mt-4 text-sm font-semibold leading-6 text-[#5a4d42]">
              {heroContextLine}
            </p>
          )}
          <p className="mt-5 max-w-3xl break-words [overflow-wrap:anywhere] text-base leading-8 text-[#5a4d42]">
            {text(draft.openingSummary)}
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {renderPill("선택 연도", draft.targetYear)}
            {renderPill("세운", draft.yearSummary.displayTitle)}
            {renderPill("모드", draft.yearSummary.modeLabel)}
          </div>
          <div className="mt-5 rounded-[8px] border border-[#eadfce] bg-[#fffdf8] p-4">
            <p className="text-xs font-semibold text-[#8b6d2d]">
              {getAnnualFlowIndexHeading(draft.mode)}
            </p>
            <p className="mt-2 text-4xl font-semibold tracking-tight text-[#6f1d35]">
              {draft.scoreSummary.flowIndex}
            </p>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#2f251f]">
              {text(draft.scoreSummary.flowTypeLabel)}
            </p>
            <p className="mt-2 text-sm leading-7 text-[#5a4d42]">
              {text(draft.scoreSummary.flowIndexCaution)}
            </p>
          </div>
        </div>
      </header>

      {renderYearAccessNotice(draft, evidencePacket)}
      {renderCommonFoundation(
        manseRyeokTable,
        mbtiProfileTable,
        evidencePacket,
        draft,
      )}
      {renderAnnualFortuneSummary(draft, evidencePacket)}
      {renderMajorAnnualCross(draft, evidencePacket)}
      {renderNatalAnnualRelations(draft, evidencePacket)}
      {renderYearStructure(draft)}
      <section className="space-y-4">
        <div>
          <p className="text-sm font-semibold text-[#8b6d2d]">세운·월운 표</p>
          <h2 className={sectionTitleClass}>선택 연도와 월별 운영 기준</h2>
          <p className="mt-2 text-sm leading-7 text-[#76685c]">
            대운·세운 비교와 12개월 월운을 표로 먼저 확인한 뒤, 본문에서는 핵심 월과 영역별 흐름을 읽습니다.
          </p>
        </div>
        {renderSaeunFortuneTable(draft, evidencePacket)}
      </section>
      {renderMonthlyFortuneReading(draft, evidencePacket)}
      {renderDomainFlows(draft, evidencePacket)}
      {renderMbtiExpression(draft, evidencePacket)}

      <section className="space-y-5" aria-label="세운 리포트 본문">
        <div>
          <p className="text-sm font-semibold text-[#8b6d2d]">본문 해석</p>
          <h2 className={sectionTitleClass}>선택 연도 흐름을 생활 장면으로 읽기</h2>
        </div>
        {draft.chapters.map((chapter) => (
          <section
            key={`${chapter.title}:${chapter.headline}`}
            className={panelClass}
          >
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-[#2b211b]">
                {text(chapter.title)}
              </h3>
              <p className="text-base font-semibold leading-7 text-[#7d1f39]">
                {text(chapter.headline)}
              </p>
            </div>
            <p className="mt-4 max-w-prose whitespace-pre-line text-base leading-8 text-[#4f453c]">
              {text(chapter.body)}
            </p>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <section className="rounded-[8px] border border-[#eadfce] bg-[#fffdf8] p-4">
                <h4 className="text-sm font-semibold text-[#6f1d35]">
                  나타날 수 있는 장면
                </h4>
                {renderList(chapter.likelyScenes)}
              </section>
              <section className="rounded-[8px] border border-[#eadfce] bg-[#fffdf8] p-4">
                <h4 className="text-sm font-semibold text-[#6f1d35]">
                  실전 조언
                </h4>
                {renderList(chapter.practicalAdvice)}
              </section>
            </div>
          </section>
        ))}
      </section>

      {renderRiskAndActionSections(draft, evidencePacket)}

      <section className={panelClass}>
        <p className="text-sm font-semibold text-[#8b6d2d]">마지막 조언</p>
        <h2 className={`${sectionTitleClass} mt-1`}>영역별 마무리 기준</h2>
        <ol className="mt-5 grid gap-3">
          {domainLockedFinalAdvice.map((advice, index) => (
            <li
              key={advice.label}
              className="rounded-[8px] border border-[#eadfce] bg-[#fffdf8] p-4"
            >
              <p className="text-sm font-semibold text-[#6f1d35]">
                {index + 1}. {advice.label}
              </p>
              <p className="mt-2 text-sm leading-7 text-[#5a4d42]">
                {text(advice.body)}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className={panelClass}>
        <p className="text-sm font-semibold text-[#8b6d2d]">안전 안내</p>
        <h2 className={`${sectionTitleClass} mt-1`}>리포트를 읽는 기준</h2>
        {renderList(evidencePacket?.safetyNotes ?? draft.safetyNotes)}
      </section>
    </article>
  );
}
