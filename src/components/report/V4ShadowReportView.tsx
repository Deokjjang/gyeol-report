import type { V4ShadowView } from "../../lib/interpretation-v4/runtimeTypes";
import { ReportCover, ReportReadingFrame, ReportReentry } from "./ReportReadingFrame";
import ManseRyeokCommonTable from "../report-tables/ManseRyeokCommonTable";
import MbtiCommonProfileTable from "../report-tables/MbtiCommonProfileTable";
import styles from "./v3Narrative.module.css";

/** Projection-only local renderer. No route imports this; existing design and
 * share components are reused. Receives neither calculations nor proof. */
export function V4ShadowReportView({ view }: { readonly view: V4ShadowView }) {
  const r = view.report;
  return <ReportReadingFrame createdAtIso={view.createdAtIso}>
    <article className={styles.edition}>
      <ReportCover product="결리포트" title={r.headline} summary={r.opening[0]} />
      <section className="space-y-5 px-4 py-6 sm:px-6" aria-label="계산된 원국과 성향">
        {view.tables.map((t, i) => <div key={i} className="space-y-5">
          <ManseRyeokCommonTable data={t.manse} defaultOpen={false} />
          {t.mbti ? <MbtiCommonProfileTable data={t.mbti} showUsageNotes={false} defaultOpen={false} /> : <p>MBTI · 모름</p>}
        </div>)}
      </section>
      <div className="mx-auto max-w-[44rem] break-keep px-4 [overflow-wrap:anywhere] sm:px-6" data-v4-body>
        {r.opening.slice(1).map((text, i) => <p key={i}>{text}</p>)}
        {r.sections.map((s, i) => <section key={i} data-reading-section className="space-y-5 py-6">
          <h2 className="whitespace-pre-line text-xl font-semibold text-[#6f1d35]">{s.title}</h2>
          {s.paragraphs.map((text, j) => <p key={j}>{text}</p>)}
        </section>)}
        <p className="border-t border-[#cbb589] py-6 text-xl font-semibold text-[#6f1d35]" data-v4-final>{r.finalLine}</p>
      </div>
    </article>
    <ReportReentry productSlug={view.productSlug} />
  </ReportReadingFrame>;
}
