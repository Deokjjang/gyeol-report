import type { ReactNode } from "react";
import styles from "../admin.module.css";
import { MIRROR_FACETS } from "../../../data/mirror/items";
import { computeItemStats, ITEM_STAT_RULES, type Flag, type ItemStatRow, type ItemStatsInput } from "../../../lib/mirror/itemStats";
import { Badge } from "../orders/ui";

const pct = (x: number | null) => (x === null ? "-" : `${Math.round(x * 100)}%`);
const r2 = (x: number | null) => (x === null ? "-" : x.toFixed(2));
const R = ITEM_STAT_RULES;

/** 문항 통계 본문(계산 + 그리기, 동기). 페이지(page.tsx)가 관리자 확인 · 읽기를 마친 뒤 그린다. */
export function ItemStatsView({ input, capped }: { input: ItemStatsInput; capped: boolean }) {
  const s = computeItemStats(input), t = s.totals;
  if (t.selfAnswers === 0 && t.friendAnswers === 0) return <p className={styles.note} data-mirror-items-empty="no-data">아직 데이터 없음 — 자가 답 · 친구 답이 하나도 없어요.</p>;
  const lopsided = s.items.filter(x => x.self.flag === "flag" || x.friend.flag === "flag");
  const loose = s.items.filter(x => x.corr.flag === "flag");
  const skippy = s.items.filter(x => x.friend.skipFlag === "flag");
  const counts = [["자가 답한 사람", t.selfPeople], ["자가 답", t.selfAnswers], ["셈에 넣은 친구 세션", t.sessions], ["친구 답(건너뜀 포함)", t.friendAnswers], ["뺀 세션 · 주인 기기", t.ownerDevice], ["뺀 세션 · 무효", t.voided]] as const;
  return (
    <>
      <p className={styles.note}>지금 문항 버전 답만 · 친구 답은 주인 기기 · 무효 세션을 뺀 값(보고서 · 기록판과 같은 기준). 점검 표시는 표본 {R.minN}개 이상일 때만, 그보다 적으면 「표본 부족」.{capped ? " 표가 커서 앞부분(표마다 20만 행)만 읽었어요." : ""}</p>
      <div className={styles.counts}>{counts.map(([k, n]) => <div key={k} className={styles.count}><strong>{n.toLocaleString("ko-KR")}</strong><span>{k}</span></div>)}</div>

      <section className={styles.section} data-check="lopsided">
        <h2>① 한쪽 답이 {Math.round(R.lopsided * 100)}%를 넘는 문항 → 교체 후보</h2>
        <p className={styles.note}>사람을 구분하지 못하는 문항. 자가 답 · 친구 답(「잘 모르겠어요」 제외)을 따로 본다.</p>
        <FlagList rows={lopsided} empty="없어요." render={x => <>{x.self.flag === "flag" ? <Badge alert>자가 {x.self.top} {pct(x.self.topShare)} · {x.self.n}명</Badge> : null}{x.friend.flag === "flag" ? <Badge alert>친구 {x.friend.top} {pct(x.friend.topShare)} · {x.friend.n}개</Badge> : null}</>} />
      </section>
      <section className={styles.section} data-check="loose">
        <h2>② 같은 면의 다른 문항과 따로 노는 문항 → 교체 후보</h2>
        <p className={styles.note}>자가 답으로 「이 문항(A=1)」과 「같은 면 나머지 4문항의 A 수」의 상관 r(그 면 5문항을 다 답한 사람). r {R.lowCorrelation} 미만이면 다른 걸 재고 있다는 뜻.</p>
        <FlagList rows={loose} empty="없어요." render={x => <Badge alert>r {r2(x.corr.r)} · {x.corr.n}명</Badge>} />
      </section>
      <section className={styles.section} data-check="skip">
        <h2>③ 친구의 「잘 모르겠어요」가 {Math.round(R.skipShare * 100)}%를 넘는 문항 → 교체 후보</h2>
        <p className={styles.note}>밖에서 안 보이는 행동. 그 문항에 들어온 친구 답 전체 중 건너뜀 비율.</p>
        <FlagList rows={skippy} empty="없어요." render={x => <Badge alert>건너뜀 {pct(x.friend.skipShare)} · {x.friend.skips}/{x.friend.total}</Badge>} />
      </section>

      <section className={styles.section} data-check="pairs">
        <h2>우선 점검 2쌍(SPEC 「겹치는 지점 주의」)</h2>
        <p className={styles.note}>두 문항끼리 상관 |r|이 각자 면 상관 중 낮은 쪽보다 크면 섞임 의심.</p>
        <ul className={styles.list}>{s.pairs.map(p => (
          <li key={`${p.a.no}-${p.b.no}`} className={styles.item} data-pair={`${p.a.no}-${p.b.no}`}>
            <div className={styles.itemHead}><span>{p.a.no}번 {p.a.facetName} ↔ {p.b.no}번 {p.b.facetName}</span><FlagBadge flag={p.flag} label={`두 문항 r ${r2(p.r)} · ${p.n}명`} /></div>
            <div className={styles.meta}><span>{p.a.no}번 「{p.a.situation}」 면 상관 r {r2(p.a.corr.r)}</span><span>{p.b.no}번 「{p.b.situation}」 면 상관 r {r2(p.b.corr.r)}</span></div>
          </li>
        ))}</ul>
      </section>

      <section className={styles.section} data-check="all">
        <h2>60문항 전체</h2>
        {MIRROR_FACETS.map(f => (
          <div key={f.id} style={{ marginBottom: 14 }}>
            <p className={styles.note} style={{ margin: "0 0 4px" }}><b>{f.domain} · {f.name}</b> (A {f.a} / B {f.b})</p>
            <ul className={styles.list}>{s.items.filter(x => x.facet === f.id).map(x => (
              <li key={x.itemId} className={styles.item} data-item={x.itemId}>
                <div className={styles.itemHead}><span>{x.no}번 「{x.situation}」</span>{s.pairs.some(p => p.a.no === x.no || p.b.no === x.no) ? <Badge>우선 점검</Badge> : null}</div>
                <div className={styles.meta}><span>A {x.a}</span><span>B {x.b}</span></div>
                <div className={styles.badges}>
                  <FlagBadge flag={x.self.flag} label={`자가 A ${pct(x.self.n ? x.self.a / x.self.n : null)} · ${x.self.n}명`} />
                  <FlagBadge flag={x.friend.flag} label={`친구 A ${pct(x.friend.n ? x.friend.a / x.friend.n : null)} · ${x.friend.n}개`} />
                  <FlagBadge flag={x.friend.skipFlag} label={`건너뜀 ${pct(x.friend.skipShare)} · ${x.friend.skips}/${x.friend.total}`} />
                  <FlagBadge flag={x.corr.flag} label={`면 상관 r ${r2(x.corr.r)} · ${x.corr.n}명`} />
                </div>
              </li>
            ))}</ul>
          </div>
        ))}
      </section>
    </>
  );
}

function FlagBadge({ flag, label }: { flag: Flag; label: string }) {
  return <Badge alert={flag === "flag"}>{label}{flag === "thin" ? " · 표본 부족" : flag === "flat" ? " · 모두 같은 답" : flag === "flag" ? " · 점검" : ""}</Badge>;
}
function FlagList({ rows, empty, render }: { rows: readonly ItemStatRow[]; empty: string; render: (x: ItemStatRow) => ReactNode }) {
  if (!rows.length) return <p className={styles.note}>{empty}</p>;
  return <ul className={styles.list}>{rows.map(x => (
    <li key={x.itemId} className={styles.item} data-flag-item={x.itemId}>
      <div className={styles.itemHead}><span>{x.no}번 {x.facetName} 「{x.situation}」</span>{render(x)}</div>
      <div className={styles.meta}><span>A {x.a}</span><span>B {x.b}</span></div>
    </li>
  ))}</ul>;
}
