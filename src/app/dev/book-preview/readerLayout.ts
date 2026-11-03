import type { BookData, BookPage } from "./bookTypes";

/** 열람 화면 쪽 구성(P6b-ui). 목차 쪽 두 개는 빼고(목차는 위 버튼이 연다), 만세력·MBTI 쪽은
 * 주인공(궁합은 관계) 쪽에 합친다. 본문 쪽과 그 순서는 그대로 두고 쪽 번호 참조만 다시 맞춘다. */
export function readerBook(data: BookData): BookData {
  if (data.contents) return data;
  const removed = (p: BookPage) => p.kind === "contents" || p.kind === "manse" || p.kind === "mbti";
  const index = new Map<number, number>();
  data.pages.forEach((p, i) => { if (!removed(p)) index.set(i, index.size); });
  // 빠진 쪽(합쳐진 만세력·MBTI, 목차)을 가리키던 참조는 바로 앞에 남은 쪽으로.
  const at = (old: number) => { for (let i = old; i >= 0; i--) if (index.has(i)) return index.get(i)!; return 0; };
  const pages = data.pages.filter(p => !removed(p)).map((p): BookPage => {
    if (p.kind === "timeline") return { ...p, years: p.years.map(y => ({ ...y, page: at(y.page) })), transitions: p.transitions.map(t => ({ ...t, page: at(t.page) })) };
    if (p.kind === "months") return { ...p, months: p.months.map(m => ({ ...m, page: at(m.page) })) };
    if (p.kind === "pair") return { ...p, directions: p.directions.map(d => ({ ...d, page: at(d.page) })) };
    return p;
  });
  const front = data.pages.find(p => p.kind === "contents" && p.id === "contents");
  const contents = front?.kind === "contents" ? front.entries.filter(e => !removed(data.pages[e.page])).map(e => ({ ...e, page: at(e.page) })) : [];
  return { ...data, pages, contents };
}
