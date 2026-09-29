import { ReportCover, ReportContents } from "../../../components/report/ReportReadingFrame";
import { hasNarrativeEdition, hasDetailNarrative } from "../../../lib/interpretation-v3/narrativeEdition";
import narrativeStyles from "../../../components/report/v3Narrative.module.css";
import { buildCanonicalManseRyeokTableData } from "../../../lib/report-tables/manseRyeokTableData";
import { buildMbtiCommonProfileTableData, getMbtiSourceByType } from "../../../lib/report-tables";
import { validateProductPublication } from "../../../lib/report-generation/productPublishGate";
import type { CareerV3Draft } from "../../../lib/interpretation-v3/careerEditorial";
import type { EditorialScene } from "../../../lib/interpretation-v3/editorialComposer";
import type { Evidence } from "../../../lib/interpretation-v3/types";
import type { SajuCalcResult } from "../../../lib/saju/types";
import { StoryTables } from "./ComprehensiveReportV3View";

// Input labels, not Career Context Interpreter output. No taxonomy is passed
// to the browser or presented as something the customer entered.
const inputStatusLabels: Readonly<Record<string, string>> = {
  employee: "직장인", business_owner: "사업자·자영업", self_employed: "자영업",
  freelancer: "프리랜서", student: "학생", exam_certificate: "시험·자격 준비",
  job_seeker: "취업 준비", unemployed: "쉬는 중", resting: "쉬는 중",
  homemaker: "전업주부", other: "기타",
};

function CareerReading({ scene, final }: { readonly scene: EditorialScene; readonly final: boolean }) {
  const quote = scene.form === "quote", punch = scene.form === "punchline", tip = scene.form === "tip";
  const body = <>
    <h3 className={quote || punch ? "font-serif text-xl leading-relaxed text-[#6f1d35] sm:text-2xl" : "text-lg font-semibold text-[#6f1d35]"}>{scene.headline}</h3>
    <div className={scene.form === "observations" ? "grid min-w-0 gap-x-7 gap-y-4 sm:grid-cols-2" : "space-y-5"}>
      {scene.parts.map((part, i) => <p key={i} className={final && i === scene.parts.length - 1 ? "border-t border-[#cbb589] pt-6 font-serif text-xl font-semibold leading-relaxed text-[#6f1d35] sm:text-2xl" : part.role === "explanation" ? "text-sm leading-7 text-[#756658] sm:col-span-2" : ""}>{part.text}</p>)}
    </div>
  </>;
  const classes = `space-y-4 ${quote ? "border-l-2 border-[#cbb589] pl-5" : tip ? "rounded-sm bg-[#f6f0e6] px-4 py-5" : ""}`;
  return quote ? <blockquote className={classes} data-editorial-form={scene.form}>{body}</blockquote> : <div className={classes} data-editorial-form={scene.form}>{body}</div>;
}

export function CareerReportV3View({ draft, evidencePacket }: { readonly draft: CareerV3Draft; readonly evidencePacket: unknown }) {
  if (!validateProductPublication("career_money_study", draft, evidencePacket).ok) return <p>리포트를 준비하고 있습니다. 잠시 후 다시 확인해 주세요.</p>;
  const { facts, calculation } = (evidencePacket as { careerV3: { facts: readonly Evidence[]; calculation: SajuCalcResult } }).careerV3;
  const manse = buildCanonicalManseRyeokTableData(evidencePacket, draft.personLabel);
  const source = getMbtiSourceByType(draft.mbti), mbti = source ? buildMbtiCommonProfileTableData(source) : undefined;
  // Only allowlisted display values reach client components; the internal
  // evidence graph stays on the server, including React keys/attributes.
  const usage = { opening: [], sections: draft.chapters.map(c => ({ blocks: c.scenes })) };
  const basis = (evidencePacket as { inputBasis: { person: { mbtiType?: string }; userContext: { jobStatus?: string; detailJob?: string } } }).inputBasis;
  const inputRows = [
    ["현재 상태", inputStatusLabels[basis.userContext.jobStatus ?? ""] ?? "미입력"],
    [basis.userContext.jobStatus === "student" ? "관심 분야" : basis.userContext.jobStatus === "job_seeker" ? "희망 분야" : "현재 직업", basis.userContext.detailJob || "미입력"],
    ["MBTI", basis.person.mbtiType || "모름"],
  ];
  return <article className={`min-w-0 overflow-hidden rounded-[8px] border border-[#ded2c2] bg-[#fffdf8] text-[#2b211b] ${hasNarrativeEdition(draft) ? narrativeStyles.edition : ""}`} data-report-version={draft.version}>
    <ReportCover product="직업·돈·학업 리포트" title={draft.title} summary="일할 때의 나, 이미 가진 좋은 패, 돈과 실력을 키워갈 방향을 읽습니다." />
    <section aria-label={`${draft.personLabel}님의 입력 정보`} data-career-input className="mx-4 mb-7 rounded-sm border border-[#ded2c2] bg-[#f8f3eb] px-4 py-4 sm:mx-6">
      <h2 className="mb-3 text-sm font-semibold text-[#6f1d35]">{draft.personLabel}님의 입력 정보</h2>
      <dl className="grid min-w-0 gap-x-6 gap-y-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
        {inputRows.map(([label, value]) => <div key={label} className="flex min-w-0 items-baseline gap-2">
          <dt className="shrink-0 text-[#756658]">{label}</dt><dd className="min-w-0 break-words [overflow-wrap:anywhere]"><span aria-hidden="true">· </span>{value}</dd>
        </div>)}
      </dl>
    </section>
    <ReportContents items={draft.chapters.map(c => ({ id: `career-${c.id}`, label: c.title }))} />
    <StoryTables facts={facts} calculation={calculation} manse={manse} mbti={mbti} draft={usage} compactMbti={hasNarrativeEdition(draft)} detailMbti={hasDetailNarrative(draft)} />
    <div className="mx-auto max-w-[44rem] break-keep px-4 [overflow-wrap:anywhere] sm:px-6">
      {draft.chapters.map((chapter, i) => {
        const contents = <div className="space-y-10">{chapter.scenes.map((scene, j) => <CareerReading key={j} scene={scene} final={chapter.id === "direction"} />)}</div>;
        return <section id={`career-${chapter.id}`} tabIndex={-1} key={i} data-reading-section className="space-y-8">
          {chapter.collapsed ? <details className="rounded-sm border border-[#ded2c2] p-4" data-career-possibilities>
            <summary className="min-h-11 cursor-pointer pb-4 text-xl font-semibold text-[#6f1d35] focus-visible:outline-2 focus-visible:outline-[#7f1d38]">{chapter.title}</summary>{contents}
          </details> : <><h2 className="text-2xl font-semibold">{chapter.title}</h2>{contents}</>}
        </section>;
      })}
    </div>
  </article>;
}
