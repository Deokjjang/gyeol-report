"use client";
/**
 * 홈 위에 열리는 층: 받은 이야기 · 모두의 이야기(D6) · 기록판 · 결 보고서(D5). 내 계정은 따로 된 주소 /me(명령 3 D7, components/mirror/account/MeApp.tsx).
 * 서버가 계산한 숫자 · 스냅샷만 그린다(친구 답 원본 · 계정 id 없음). 문구는 SPEC 「문구 정리표」(해요체).
 */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { MIRROR_FACETS } from "../../data/mirror/items";
import type { BoardView } from "../../lib/mirror/boardView";
import { constellationSvg } from "../../lib/mirror/constellationSvg";
import { CLOSENESS_LABEL } from "../../lib/mirror/engine";
import type { IssueRow, PublicStory } from "../../lib/mirror/social";
import type { ReportSnapshot } from "../../lib/mirror/report/types";
import { mirrorApi } from "./client";
import { ReportView } from "./report/ReportView";
import { EmptyPage } from "./screens";
import s from "./mirror.module.css";
import f from "./social.module.css";

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
/** 한 화면에 SVG가 여럿이면 그라데이션 id가 겹친다(홈 2D 하늘 포함) — 겹치지 않게 접미사를 붙인다. */
const uniqueIds = (svg: string, suffix: string) => svg.replace(/id="(g|c)"/g, `id="$1${suffix}"`).replace(/url\(#(g|c)\)/g, `url(#$1${suffix})`);
const mdLabel = (iso: string) => { const d = new Date(iso); return `${d.getMonth() + 1}월 ${d.getDate()}일`; };
type Say = (m: string) => void;

/* ---------- 이야기 카드 ---------- */
function StoryBody({ body, onMore }: { body: string; onMore?: () => void }) {
  const el = useRef<HTMLParagraphElement>(null), [over, setOver] = useState(false), [open, setOpen] = useState(false);
  useLayoutEffect(() => { const p = el.current; if (p) setOver(p.scrollHeight > p.clientHeight + 2); }, [body]);
  return <>
    <p ref={el} className={cx(f.storyBody, !open && f.clamp)}>{body}</p>
    {over && !open ? <button type="button" className={f.more} onClick={() => onMore ? onMore() : setOpen(true)}>더 보기</button> : null}
  </>;
}
function StoryHead({ story, withCloseness }: { story: PublicStory; withCloseness: boolean }) {
  return <div className={f.storyHead}>
    <span className={f.pill}>{story.kindLabel}</span>
    {withCloseness ? <span>{CLOSENESS_LABEL[story.closeness]}</span> : null}
    <span>{story.handle ? `@${story.handle}` : "익명"}</span>
    {story.mine ? <span className={cx(f.pill, f.pillWarm)} data-own>본인 작성</span> : null}
    {story.hidden ? <span className={f.pill}>신고로 숨김</span> : null}
  </div>;
}

/* ---------- 받은 이야기 ---------- */
export function StoriesPage({ onBack, onAsk, say }: { onBack: () => void; onAsk: () => void; say: Say }) {
  const [items, setItems] = useState<PublicStory[] | null>(null), [preview, setPreview] = useState<PublicStory | null>(null);
  useEffect(() => { void mirrorApi<{ items: PublicStory[] }>("stories").then(r => setItems(r.ok ? r.data.items : [])); }, []);
  async function setShared(story: PublicStory, shared: boolean) {
    const r = await mirrorApi<{ shared: boolean }>("story-share", { method: "POST", body: { id: story.id, shared } });
    if (!r.ok) { say(r.data.error ?? "저장하지 못했어요."); return; }
    setItems(list => list?.map(x => x.id === story.id ? { ...x, shared } : x) ?? null); setPreview(null);
    say(shared ? "모두의 이야기에 올렸어요" : "내렸어요");
  }
  return <EmptyPage page="stories" onBack={onBack}>
    <p className={s.sub}>마음이 따뜻해지는 이야기는 모두와 나눠 보세요</p>
    {items === null ? null : items.length === 0 ? <div className={f.empty}><span>아직 받은 이야기가 없어요</span><button type="button" className={cx(s.cta, s.press)} style={{ width: "100%" }} onClick={onAsk}>친구에게 물어보기</button></div>
      : items.map(story => <article key={story.id} className={f.storyCard} data-story={story.id}>
        <StoryHead story={story} withCloseness />
        <StoryBody body={story.body} />
        <div className={f.toggle}><span>모두에게 공유</span>
          <button type="button" role="switch" aria-checked={story.shared} disabled={story.hidden} className={cx(f.switch, story.shared && f.switchOn)} data-share-story
            onClick={() => story.shared ? void setShared(story, false) : setPreview(story)}><i /></button></div>
      </article>)}
    {preview ? <div className={f.preview} role="dialog" aria-label="이렇게 올라가요" data-share-preview>
      <b>이렇게 올라가요</b>
      <p className={s.sub}>이름 · 학교처럼 누군지 알 수 있는 내용이 있으면 올리기 전에 확인해 주세요.</p>
      <article className={f.storyCard}>
        <StoryHead story={{ ...preview, hidden: false }} withCloseness={false} />
        <StoryBody body={preview.body} />
        <div className={f.storyFoot}><span className={f.heart}>♥ {preview.hearts}</span><span className={f.dots}>⋯</span></div>
      </article>
      <div className={f.row}><button type="button" className={f.ghost} onClick={() => setPreview(null)}>취소</button><button type="button" className={cx(s.cta, s.press)} onClick={() => void setShared(preview, true)} data-share-confirm>올리기</button></div>
    </div> : null}
  </EmptyPage>;
}

/* ---------- 모두의 이야기 ---------- */
export function SpacePage({ onBack, say }: { onBack: () => void; say: Say }) {
  const [tab, setTab] = useState<"latest" | "popular">("latest"), [top, setTop] = useState<PublicStory | null>(null);
  const [items, setItems] = useState<PublicStory[] | null>(null), [more, setMore] = useState(false), [full, setFull] = useState<PublicStory | null>(null), [menu, setMenu] = useState<string | null>(null);
  type SpaceRes = Awaited<ReturnType<typeof mirrorApi<{ top: PublicStory | null; items: PublicStory[]; more: boolean }>>>;
  const apply = useCallback((r: SpaceRes, offset: number) => {
    if (!r.ok) { say(r.data.error ?? "불러오지 못했어요."); return; }
    if (offset === 0) { setTop(r.data.top); setItems(r.data.items); } else setItems(list => [...(list ?? []), ...r.data.items]);
    setMore(r.data.more);
  }, [say]);
  const fetchPage = (t: "latest" | "popular", offset: number) => mirrorApi<{ top: PublicStory | null; items: PublicStory[]; more: boolean }>("space", { query: `?tab=${t}&offset=${offset}` });
  const load = async (t: "latest" | "popular", offset: number) => apply(await fetchPage(t, offset), offset);
  useEffect(() => { let live = true; void fetchPage(tab, 0).then(r => { if (live) apply(r, 0); }); return () => { live = false; }; }, [tab, apply]);
  const patch = (id: string, p: Partial<PublicStory>) => { setItems(l => l?.map(x => x.id === id ? { ...x, ...p } : x) ?? null); setTop(t => t && t.id === id ? { ...t, ...p } : t); setFull(x => x && x.id === id ? { ...x, ...p } : x); };
  async function heart(story: PublicStory) {
    const on = !story.hearted;
    patch(story.id, { hearted: on, hearts: story.hearts + (on ? 1 : -1) });
    const r = await mirrorApi("heart", { method: "POST", body: { id: story.id, on } });
    if (!r.ok) { patch(story.id, { hearted: story.hearted, hearts: story.hearts }); say(r.status === 401 ? "로그인하면 마음을 보낼 수 있어요" : r.data.error ?? "보내지 못했어요."); }
  }
  async function report(story: PublicStory) {
    setMenu(null);
    const r = await mirrorApi<{ hidden: boolean }>("report-story", { method: "POST", body: { id: story.id } });
    if (!r.ok) { say(r.data.error ?? "신고하지 못했어요."); return; }
    patch(story.id, { reported: true });
    if (r.data.hidden) { setItems(l => l?.filter(x => x.id !== story.id) ?? null); setTop(t => t?.id === story.id ? null : t); setFull(null); }
    say("신고했어요. 확인해 볼게요");
  }
  const card = (story: PublicStory, label?: string) => <article key={`${label ?? ""}${story.id}`} className={f.storyCard} data-space-story={story.id}>
    {label ? <span className={f.topLabel}>{label}</span> : null}
    <StoryHead story={story} withCloseness={false} />
    <StoryBody body={story.body} onMore={() => setFull(story)} />
    <div className={f.storyFoot}>
      <button type="button" className={cx(f.heart, story.hearted && f.heartOn)} aria-pressed={story.hearted} onClick={() => void heart(story)} data-heart>♥ {story.hearts}</button>
      <button type="button" className={f.dots} aria-label="더 보기 메뉴" onClick={() => setMenu(m => m === story.id ? null : story.id)}>⋯</button>
    </div>
    {menu === story.id ? <div className={f.menu}><button type="button" disabled={story.reported} onClick={() => void report(story)} data-report>{story.reported ? "신고했어요" : "신고하기"}</button></div> : null}
  </article>;
  if (full) return <EmptyPage page="space" onBack={() => setFull(null)}>
    <article className={f.storyCard} data-space-full={full.id}><StoryHead story={full} withCloseness={false} /><p className={f.storyBody}>{full.body}</p>
      <div className={f.storyFoot}><button type="button" className={cx(f.heart, full.hearted && f.heartOn)} onClick={() => void heart(full)}>♥ {full.hearts}</button><button type="button" className={f.dots} onClick={() => setMenu(m => m === full.id ? null : full.id)}>⋯</button></div>
      {menu === full.id ? <div className={f.menu}><button type="button" disabled={full.reported} onClick={() => void report(full)}>{full.reported ? "신고했어요" : "신고하기"}</button></div> : null}
    </article>
  </EmptyPage>;
  return <EmptyPage page="space" onBack={onBack}>
    <p className={s.sub}>친구가 친구에게 써 준 이야기 중, 받은 사람이 고른 것만 올라와요</p>
    {top ? <div className={f.top}>{card(top, "이번 주 가장 많은 마음")}</div> : null}
    <div className={f.tabs} role="tablist">{(["latest", "popular"] as const).map(t => <button key={t} type="button" role="tab" aria-selected={tab === t} className={cx(f.tab, tab === t && f.tabOn)} onClick={() => setTab(t)}>{t === "latest" ? "최신" : "인기"}</button>)}</div>
    {items === null ? null : items.length === 0 ? <div className={f.empty}>아직 올라온 이야기가 없어요</div> : items.map(x => card(x))}
    {more ? <button type="button" className={f.ghost} onClick={() => void load(tab, items?.length ?? 0)}>더 보기</button> : null}
  </EmptyPage>;
}

/* ---------- 기록판 · 결 보고서 ---------- */
export function BoardPage({ onBack, onAsk, onShareScene, say, openIssue }: { onBack: () => void; onAsk: () => void; onShareScene: (sc: { count: string; text: string }) => void; say: Say; openIssue?: number | null }) {
  const [board, setBoard] = useState<BoardView | null>(null), [issues, setIssues] = useState<IssueRow[]>([]), [report, setReport] = useState<ReportSnapshot | null>(null), [busy, setBusy] = useState(false);
  const applyBoard = useCallback((r: Awaited<ReturnType<typeof mirrorApi<{ board: BoardView; issues: IssueRow[] }>>>) => { if (r.ok) { setBoard(r.data.board); setIssues(r.data.issues); } else say(r.data.error ?? "불러오지 못했어요."); }, [say]);
  const applyReport = useCallback((r: Awaited<ReturnType<typeof mirrorApi<{ snapshot: ReportSnapshot }>>>) => { if (r.ok) setReport(r.data.snapshot); else say(r.data.error ?? "불러오지 못했어요."); }, [say]);
  const load = async () => applyBoard(await mirrorApi<{ board: BoardView; issues: IssueRow[] }>("board"));
  const open = async (no: number) => applyReport(await mirrorApi<{ snapshot: ReportSnapshot }>("reports", { query: `?no=${no}` }));
  useEffect(() => { let live = true; void mirrorApi<{ board: BoardView; issues: IssueRow[] }>("board").then(r => { if (live) applyBoard(r); }); return () => { live = false; }; }, [applyBoard]);
  useEffect(() => {
    if (!openIssue || openIssue <= 0) return;
    let live = true; void mirrorApi<{ snapshot: ReportSnapshot }>("reports", { query: `?no=${openIssue}` }).then(r => { if (live) applyReport(r); });
    return () => { live = false; };
  }, [openIssue, applyReport]);
  async function issue() {
    if (busy) return; setBusy(true);
    const r = await mirrorApi<{ snapshot: ReportSnapshot }>("report-issue", { method: "POST", body: {} });
    setBusy(false);
    if (!r.ok) { say(r.data.error ?? "보고서를 만들지 못했어요."); return; }
    setReport(r.data.snapshot); void load();
  }
  if (report) return <EmptyPage page="board" onBack={() => setReport(null)}><ReportView snapshot={report} onShareScene={onShareScene} onAsk={onAsk} /></EmptyPage>;
  if (!board) return <EmptyPage page="board" onBack={onBack} />;
  const b = board, iss = b.issue;
  const selfSvg = uniqueIds(constellationSvg(b.shapes.self, { size: 320, background: null, lineOpacity: .55 }), "bs");
  const friendSvg = b.shapes.friend ? uniqueIds(constellationSvg(b.shapes.friend, { size: 320, background: null, lineOpacity: .5 }), "bf").replace(/#fff"/g, '#CAD7FF"') : "";
  const domains = [...new Set(MIRROR_FACETS.map(x => x.domain))];
  return <EmptyPage page="board" onBack={onBack}>
    <div className={f.stat}>
      <div className={f.box} data-board-sync={b.sync ?? "none"}><span>싱크로율</span><b>{b.sync ?? "?"}<small>%</small></b></div>
      <div className={f.box} data-board-complete={b.completeness}><span>완성도 · 친구 답 {b.answers}개</span><b>{b.completeness}<small>%</small></b></div>
    </div>
    {iss.canIssue ? <button type="button" className={cx(s.cta, s.press)} disabled={busy} onClick={() => void issue()} data-issue>결 보고서 받기</button>
      : <div className={f.box} data-issue-wait>{iss.remaining > 0 ? <span>친구 답 60개부터 · {iss.remaining}개 남음</span> : <span>다음 호는 {iss.nextAt ? mdLabel(iss.nextAt) : ""}</span>}</div>}
    {issues.length ? <div className={f.list}>{issues.map(x => <button key={x.issueNo} type="button" className={f.issue} onClick={() => void open(x.issueNo)} data-open-issue={x.issueNo}><span>결 보고서 {x.issueNo}호<br /><small>{x.title}</small></span><small>{mdLabel(x.issuedAt)}</small></button>)}</div> : null}
    <div className={f.overlay} aria-label="내 별자리와 남이 본 별자리">
      {friendSvg ? <div style={{ opacity: .85 }} dangerouslySetInnerHTML={{ __html: friendSvg }} /> : null}
      <div dangerouslySetInnerHTML={{ __html: selfSvg }} />
    </div>
    <div className={f.legend}><span><i style={{ background: "#fff" }} />내가 본 나</span>{friendSvg ? <span><i style={{ background: "#CAD7FF" }} />친구가 본 나</span> : null}</div>
    {domains.map(d => <section key={d} className={f.domain}><h4>{d}</h4>{b.facets.filter(x => x.domain === d).map(x => {
      const selfPos = 1 - x.self.aCount / 5, friendPos = x.friend ? 1 - x.friend.ratio : null;
      return <div key={x.facet} className={f.facet} data-facet={x.facet}>
        <div className={f.facetTop}><b>{x.name}</b><span>{x.match === null ? "친구 답 전" : `같게 본 비율 ${Math.round(x.match * 100)}%`}</span></div>
        <div className={f.track}><i className={cx(f.mark, f.markSelf)} style={{ left: `${selfPos * 100}%` }} title="○ 내 답" />{friendPos !== null ? <i className={cx(f.mark, f.markFriend)} style={{ left: `${friendPos * 100}%` }} title="● 친구 답" /> : null}</div>
        <div className={f.ends}><span>{x.a}</span><span>{x.b}</span></div>
      </div>;
    })}</section>)}
    <div className={f.legend}><span>○ 내 답 위치</span><span>● 친구 답 위치</span></div>
    <div className={f.box} data-board-friends={b.friends}>
      <span>답해 준 친구 {b.friends}명 · 황금별 {b.golden}개</span>
      <span>{([1, 2, 3] as const).map(k => `${CLOSENESS_LABEL[k]} ${b.byCloseness[k] ?? "-"}`).join(" · ")}</span>
      <span style={{ fontSize: 11, color: "var(--faint)" }}>3명이 안 되는 묶음은 숫자를 숨겨요</span>
    </div>
  </EmptyPage>;
}
