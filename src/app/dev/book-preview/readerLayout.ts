import { earthlyBranchDisplays, heavenlyStemDisplays } from "../../../lib/report-tables/displayDictionaries";
import type { BookData, BookMonth, BookPage } from "./bookTypes";

/** "2026-01-05T17:23:10+09:00" → "1/5". end: 다음 달 0시(달력 달 경계)에서 끝나면 그 전날. */
const md = (iso: string, end = false) => {
  const day = end && iso.slice(11, 19) === "00:00:00" ? new Date(Date.parse(`${iso.slice(0, 10)}T00:00:00Z`) - 86_400_000).toISOString().slice(0, 10) : iso.slice(0, 10);
  return `${Number(day.slice(5, 7))}/${Number(day.slice(8, 10))}`;
};
const hangul = (ganji: string) => `${heavenlyStemDisplays[ganji[0] as keyof typeof heavenlyStemDisplays]?.ko ?? ganji[0]}${earthlyBranchDisplays[ganji[1] as keyof typeof earthlyBranchDisplays]?.ko ?? ganji[1]}`;

/** V4 세운 달 카드(달력 1~12월, P6c-ui2 h·j). 이름은 달력 달 그대로, 아랫줄에 그 카드의 절기월·날짜("기축월 · 1/5~1/31").
 * 지금·돌아보기·앞으로는 저장값(만든 날 기준)을 쓰지 않고 읽는 날(today) 기준. 읽는 날이나 달의 연도를 모르면 숨긴다. */
function v4Month(m: BookMonth, today?: string): { sub: string; time: string; title: string } {
  const segments = m.boundary?.segments ?? [], focus = segments.find(s => s.ganji === m.ganji) ?? segments.at(-1);
  const sub = focus ? `${hangul(m.ganji)}월 · ${md(focus.start)}~${md(focus.end, true)}` : `${hangul(m.ganji)}월`;
  const ym = segments[0]?.start.slice(0, 7), now = today?.slice(0, 7);
  return { sub, time: ym && now ? (ym < now ? "돌아보기" : ym === now ? "지금" : "앞으로") : "", title: `${m.month}월 · ${sub}` };
}

/** 열람 화면 쪽 구성(P6b-ui). 목차 쪽 두 개는 빼고(목차는 위 버튼이 연다), 만세력·MBTI 쪽은
 * 주인공(궁합은 관계) 쪽에 합친다. 본문 쪽과 그 순서는 그대로 두고 쪽 번호 참조만 다시 맞춘다.
 * today(KST 날짜, P6c-ui2 j): V4 세운 표의 지금 기준. v5 표는 투영(projectV5Book)이 이미 읽는 날로 정한다. */
export function readerBook(data: BookData, today?: string): BookData {
  if (data.contents) return data;
  const removed = (p: BookPage) => p.kind === "contents" || p.kind === "manse" || p.kind === "mbti";
  const index = new Map<number, number>();
  data.pages.forEach((p, i) => { if (!removed(p)) index.set(i, index.size); });
  // 빠진 쪽(합쳐진 만세력·MBTI, 목차)을 가리키던 참조는 바로 앞에 남은 쪽으로.
  const at = (old: number) => { for (let i = old; i >= 0; i--) if (index.has(i)) return index.get(i)!; return 0; };
  // V4 세운 상세 쪽 머리 줄 "1월 · 돌아보기"(만든 날 기준 상태)는 표와 같은 이름으로. 둘째 줄(V4 제목)은 그대로.
  const V4_HEAD = /^\d{1,2}월 · (지금|돌아보기|앞으로)(?=\n|$)/;
  const v4Titles = new Map<BookPage, string>();
  for (const p of data.pages) if (p.kind === "months") for (const m of p.months) if (!m.order) {
    const target = data.pages[m.page];
    if (target?.kind === "narrative" && V4_HEAD.test(target.title)) v4Titles.set(target, target.title.replace(V4_HEAD, v4Month(m, today).title));
  }
  const pages = data.pages.filter(p => !removed(p)).map((p): BookPage => {
    if (p.kind === "timeline") return { ...p, years: p.years.map(y => ({ ...y, page: at(y.page) })), transitions: p.transitions.map(t => ({ ...t, page: at(t.page) })) };
    if (p.kind === "months") return { ...p, months: p.months.map(m => {
      if (m.order) return { ...m, page: at(m.page) };
      const { sub, time } = v4Month(m, today);
      return { ...m, sub, time, page: at(m.page) };
    }) };
    if (p.kind === "pair") return { ...p, directions: p.directions.map(d => ({ ...d, page: at(d.page) })) };
    if (p.kind === "narrative" && v4Titles.has(p)) return { ...p, title: v4Titles.get(p)! };
    return p;
  });
  const front = data.pages.find(p => p.kind === "contents" && p.id === "contents");
  const contents = front?.kind === "contents" ? front.entries.filter(e => !removed(data.pages[e.page])).map(e => ({ ...e, page: at(e.page) })) : [];
  return { ...data, pages, contents };
}
