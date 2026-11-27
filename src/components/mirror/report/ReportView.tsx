"use client";
/**
 * 결 보고서 한 호(D5): 발행 때 저장한 스냅샷(ReportSnapshot)만 그린다 — 다시 계산하지 않는다.
 * 결론은 크게, 근거 줄은 작게. 꼭지 2 · 3 장면에는 「공유」(장면 공유 카드), 꼭지 8에는 「친구에게 물어보기」. 맨 아래 「근거 모두 보기」(접힘)와 심층 리포트 한 줄.
 */
import { kstMonthDay, sceneLine } from "../../../lib/mirror/report/format";
import type { ReportSnapshot } from "../../../lib/mirror/report/types";
import s from "./report.module.css";

export type ReportViewProps = {
  snapshot: ReportSnapshot;
  onShareScene?: (share: { count: string; text: string }) => void;
  onAsk?: () => void;
};

export function ReportView({ snapshot: r, onShareScene, onAsk }: ReportViewProps) {
  return <article className={s.report} data-report-issue={r.issueNo}>
    <header className={s.head}>
      <p className={s.issue}>결 보고서 {r.issueNo}호 · {r.ownerName} · {kstMonthDay(r.issuedAt)}</p>
      <h1 className={s.verdict}>{r.verdict.title}</h1>
      <p className={s.sync}><b>{r.verdict.sync}<small>%</small></b><span>싱크로율</span></p>
      <p className={s.summary}>{r.verdict.summary}</p>
    </header>
    {r.sections.map(sec => <section key={sec.key} className={s.section} data-section={sec.key}>
      <h2 className={s.title}>{sec.title}</h2>
      {sec.lead.map((line, i) => <p key={i} className={s.lead}>{line}</p>)}
      {sec.scenes.length ? <ul className={s.scenes}>
        {sec.scenes.map(sc => <li key={sc.itemId} className={s.scene} data-item={sc.itemId}>
          <p className={s.sceneLine}>{sceneLine(sec.key, sc)}</p>
          <div className={s.sceneFoot}>
            <small className={s.count}>{sc.count}</small>
            {sc.share && onShareScene ? <button type="button" className={s.share} onClick={() => onShareScene(sc.share!)} aria-label={`이 장면 공유하기: ${sc.share.text}`}>공유</button> : null}
          </div>
        </li>)}
      </ul> : null}
      {sec.stories?.length ? <ul className={s.stories}>
        {sec.stories.map((st, i) => <li key={i} className={s.story}><small className={s.storyTag}>{st.kindLabel} · {st.closenessLabel}</small><p>{st.body}</p></li>)}
      </ul> : null}
      {sec.body.map((line, i) => <p key={i} className={s.body}>{line}</p>)}
      {sec.notes.map((line, i) => <p key={i} className={s.note}>{line}</p>)}
      {sec.ask && onAsk ? <button type="button" className={s.ask} onClick={onAsk}>친구에게 물어보기</button> : null}
      {sec.key === "next" ? <a className={s.bridge} href={r.bridge.href}>{r.bridge.text}</a> : null}
    </section>)}
    <details className={s.evidence}>
      <summary>근거 모두 보기</summary>
      <p className={s.note}>친구 {r.evidence.friends}명 · 답 {r.evidence.answers}개
        {r.evidence.byCloseness[1] !== null ? ` · 아는 사이 ${r.evidence.byCloseness[1]}명` : ""}
        {r.evidence.byCloseness[2] !== null ? ` · 친구 ${r.evidence.byCloseness[2]}명` : ""}
        {r.evidence.byCloseness[3] !== null ? ` · 가까운 사이 ${r.evidence.byCloseness[3]}명` : ""}</p>
      <table className={s.table}>
        <thead><tr><th scope="col">면</th><th scope="col">내 답 A쪽</th><th scope="col">친구 답 A쪽</th><th scope="col">같게 본 비율</th></tr></thead>
        <tbody>{r.evidence.facets.map(f => <tr key={f.facet}><th scope="row">{f.domain} · {f.name}</th><td>{f.selfA}/5</td><td>{f.friendN ? `${f.friendA}/${f.friendN}` : "-"}</td><td>{f.match === null ? "-" : `${f.match}%`}</td></tr>)}</tbody>
      </table>
    </details>
  </article>;
}

export default ReportView;
