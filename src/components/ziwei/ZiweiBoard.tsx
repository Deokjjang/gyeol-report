"use client";
/**
 * ZW-2 4부 — 명반 부품(props만 받는다: lib/ziwei/view.ts ZiweiBoardView). 상품 책 밖(나중의 프로필 「타고난 결」 칸)에서도 그대로 쓴다.
 * - 4×4 바깥 12칸(전통 배치) + 가운데(이름 · 오행국 · 명궁 · 신궁). 칸마다 쉬운 이름 · 지지 · 주성 · 사화 배지 · 밝기 점(근거 「통용」 칸만).
 * - 칸을 누르면 아래 펼침 칸에 곁의 별(보좌 · 살성 · 연애 별 — 쉬운 이름 먼저) · 빌려 읽기 · 그 칸의 10년을 보인다.
 * - 누를 때 살짝 눌리는 반응(「움직임 줄이기」를 켜면 끈다 — CSS).
 */
import { useState } from "react";
import type { PalaceId } from "../../lib/ziwei/ids";
import type { ZiweiBoardView, ZiweiCellView, ZiweiStarView } from "../../lib/ziwei/view";
import z from "./ziwei.module.css";

const BRIGHT_KO = { bright: "환함", normal: "보통", dark: "은은함" } as const;
/** 받침에 맞춘 목적격 조사(을/를) — 이 부품만 쓰는 작은 함수(계산 모듈을 화면에 싣지 않는다). */
const eul = (w: string) => { const c = w.charCodeAt(w.length - 1) - 0xac00; return c >= 0 && c <= 11171 && c % 28 !== 0 ? "을" : "를"; };
const MUT_SHORT = { rok: "록", gwon: "권", gwa: "과", gi: "기" } as const;
function Dot({ s }: { s: ZiweiStarView }) {
  return s.bright ? <span className={z.dot} data-bright={s.bright} role="img" aria-label={`별빛 ${BRIGHT_KO[s.bright]}`} /> : null;
}
function Mut({ s }: { s: ZiweiStarView }) {
  return s.mutagen ? <span className={z.mut} data-mut={s.mutagen.id} title={`${s.mutagen.ko} · ${s.mutagen.easy}`}>{MUT_SHORT[s.mutagen.id]}</span> : null;
}
function Cell({ c, on, pick }: { c: ZiweiCellView; on: boolean; pick: (p: PalaceId) => void }) {
  return <button type="button" className={z.cell} style={{ gridRow: c.row + 1, gridColumn: c.col + 1 }} aria-pressed={on} data-life={c.life || undefined} data-body={c.body || undefined} data-current={c.decade.current || undefined}
    onClick={() => pick(c.palace)} aria-label={`${c.easy} 칸(${c.ko}) · ${c.empty ? "빈 칸" : c.majors.map(s => s.ko).join(" · ")}`}>
    <span className={z.cellHead}><span className={z.pal}>{c.easy}</span><small>{c.branchKo}</small></span>
    {c.life || c.body ? <span className={z.marks}>{c.life ? <i>명궁</i> : null}{c.body ? <i>신궁</i> : null}</span> : null}
    <span className={z.stars}>{c.empty ? <span className={z.emptyStar}>빈 칸</span> : c.majors.map(s => <span key={s.id} className={z.major}>{s.ko}<Dot s={s} /><Mut s={s} /></span>)}
      {c.minors.some(s => s.mutagen) ? c.minors.filter(s => s.mutagen).map(s => <span key={s.id} className={z.minorMut}>{s.ko}<Mut s={s} /></span>) : null}</span>
    {c.decade.current ? <span className={z.nowTag}>지금 10년</span> : null}
  </button>;
}
function Detail({ c }: { c: ZiweiCellView }) {
  return <div className={z.detail} aria-live="polite" data-ziwei-detail>
    <p className={z.detailHead}><b>{c.easy} 칸</b> <small>{c.ko} · {c.branchKo}</small></p>
    {c.empty && c.borrow ? <p>큰 별이 없는 빈 칸이에요. 맞은편 {c.borrow.fromEasy} 칸의 {c.borrow.majors.join(" · ")}{eul(c.borrow.majors.at(-1) ?? "별")} 빌려 읽어요.</p>
      : <p>앉은 별: {c.majors.map(s => `${s.ko}(${s.easy})${s.mutagen ? ` · ${s.mutagen.ko}(${s.mutagen.easy})` : ""}`).join(" · ")}</p>}
    {c.minors.length ? <p>곁의 별: {c.minors.map(s => `${s.easy}(${s.ko})${s.mutagen ? ` · ${s.mutagen.ko}` : ""}`).join(" · ")}</p> : null}
    <p>이 칸의 10년: {c.decade.start}~{c.decade.end}년{c.decade.current ? " · 지금 머무는 10년" : c.decade.next ? " · 다음 10년" : ""}</p>
  </div>;
}
export function ZiweiBoard({ view, name }: { view: ZiweiBoardView; name?: string }) {
  const [sel, setSel] = useState<PalaceId>(view.cells.find(c => c.life)?.palace ?? view.cells[0].palace);
  const cur = view.cells.find(c => c.palace === sel)!;
  return <section className={z.board} aria-label="나의 명반" data-ziwei-board>
    <div className={z.grid}>
      {view.cells.map(c => <Cell key={c.palace} c={c} on={c.palace === sel} pick={setSel} />)}
      <div className={z.center} style={{ gridRow: "2 / 4", gridColumn: "2 / 4" }}>
        {name ? <b className={z.centerName}>{name}</b> : null}
        <span>{view.center.fiveClass}</span><span>명궁 {view.center.life}</span><span>{view.center.body}</span>
      </div>
    </div>
    <p className={z.legend}>칸을 누르면 곁의 별과 그 칸의 10년이 보여요. 점은 별빛(근거가 있는 칸만): <span className={z.dot} data-bright="bright" aria-hidden /> 환함 <span className={z.dot} data-bright="normal" aria-hidden /> 보통 <span className={z.dot} data-bright="dark" aria-hidden /> 은은함</p>
    <Detail c={cur} />
    {view.notes.year ? <p className={z.note} data-ziwei-note="year">{view.notes.year}</p> : null}
  </section>;
}
/** 사화 배지 4칸(8장 앞). 경 · 무 · 임년생에게만 학파 주석. */
export function ZiweiMutagenBadges({ view }: { view: ZiweiBoardView }) {
  return <section className={z.board} aria-label="내 별에 붙은 네 꼬리표" data-ziwei-mutagens>
    <ul className={z.muts}>{view.mutagens.map(m => <li key={m.id} data-mut={m.id}><span className={z.mutBig}>{MUT_SHORT[m.id]}</span><b>{m.ko}</b><small>{m.easy}</small><span>{m.star}({m.starEasy}) · {m.palaceEasy} 칸</span></li>)}</ul>
    {view.notes.school ? <p className={z.note} data-ziwei-note="school">{view.notes.school}</p> : null}
  </section>;
}
/** 대한 띠(9장 앞): 10년 칸 12개를 연도 범위로, 지금 · 다음 칸 표시(나이 없음). */
export function ZiweiDecadeBand({ view }: { view: ZiweiBoardView }) {
  return <section className={z.board} aria-label="10년의 칸" data-ziwei-decades>
    <ol className={z.band}>{view.decades.map(d => <li key={d.start} data-current={d.current || undefined} data-next={d.next || undefined}><span>{d.start}~{d.end}</span><b>{d.palaceEasy}</b>{d.current ? <i>지금</i> : d.next ? <i>다음</i> : null}</li>)}</ol>
  </section>;
}
