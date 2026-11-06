/**
 * 작가 출력 형식(P3 B): "## N. 장 제목" → "### 소제목" → 문단(빈 줄로 구분). 반복 장은 "### {key}".
 * 스트리밍 중에는 다음 "## " 머리글이 나타난 장까지만 완성으로 본다(마지막 장은 종료 신호 뒤에 완성).
 * P6c: 반복 장 key 아래 카드 줄("[그림] …", "[해 볼 것] …"/"[돌아보기] …", "[살필 점] …")은 문단이 아니라 card로 뺀다(F1).
 *      핵심 문장 기호 ⟪ ⟫는 안전망을 지날 때까지 문단에 두고, 조립 때 위치(keySpan)로 바꾸고 지운다(H).
 */
export type SectionCard = { readonly image?: string; readonly todo?: string; readonly review?: string; readonly caution?: string | null };
/**
 * keySpans: 문단마다 핵심 구절 [시작, 끝)(원문 글자 위치, 없으면 null). 화면은 있으면 굵게 + 옅은 밑줄(P6c-ui2 g).
 * P6c-content H: 작가가 소제목마다 핵심 문장 하나를 ⟪ ⟫로 감싸고, 조립(withKeySpan)이 위치로 바꿔 넣는다 — 소제목당 최대 1개.
 * card(P6c F1): 반복 장 key의 카드 줄. 조립 때 카드로 옮기고 저장 본문에는 남기지 않는다.
 */
export type BookSection = { readonly heading: string; readonly paragraphs: readonly string[]; readonly keySpans?: readonly (readonly [number, number] | null)[]; readonly card?: SectionCard };
export type BookChapter = { readonly n: number; readonly title: string; readonly sections: readonly BookSection[] };
export type ChapterSource = "writer" | "continuation" | "deterministic";

const CHAPTER = /^##\s+(\d+)\.\s*(.+?)\s*$/;
const SECTION = /^###\s+(.+?)\s*$/;

const CARD_LINE = /^\s*[-*]?\s*\[(그림|해 볼 것|돌아보기|살필 점)\]\s*(.*?)\s*$/;
const CARD_FIELD = { 그림: "image", "해 볼 것": "todo", 돌아보기: "review", "살필 점": "caution" } as const;
const COVER_LINE = /^\s*\[표지\]/;

export function parseChapters(text: string): BookChapter[] {
  const out: { n: number; title: string; sections: { heading: string; lines: string[]; card: Record<string, string | null> }[] }[] = [];
  for (const raw of text.replace(/\r\n?/g, "\n").split("\n")) {
    const line = raw.trimEnd();
    const ch = line.match(CHAPTER);
    if (ch && !line.startsWith("###")) { out.push({ n: Number(ch[1]), title: ch[2].replace(/\*\*/g, ""), sections: [] }); continue; }
    const cur = out[out.length - 1];
    if (!cur) continue; // 첫 장 머리글 앞의 말은 버린다.
    const sec = line.match(SECTION);
    if (sec) { cur.sections.push({ heading: sec[1].replace(/\*\*/g, ""), lines: [], card: {} }); continue; }
    if (!cur.sections.length) cur.sections.push({ heading: "", lines: [], card: {} });
    const last = cur.sections[cur.sections.length - 1];
    const card = line.match(CARD_LINE);
    if (card) { const v = card[2].trim(); last.card[CARD_FIELD[card[1] as keyof typeof CARD_FIELD]] = card[1] === "살필 점" && /^(없음|없습니다|없어요)\.?$/.test(v) ? null : v; continue; }
    if (COVER_LINE.test(line)) continue;
    last.lines.push(line);
  }
  return out.map(c => ({ n: c.n, title: c.title, sections: c.sections.map(s => ({ heading: s.heading, paragraphs: paragraphsOf(s.lines), ...(Object.keys(s.card).length ? { card: s.card as SectionCard } : {}) })).filter(s => s.heading || s.paragraphs.length) }));
}

function paragraphsOf(lines: readonly string[]): string[] {
  const out: string[] = []; let buf: string[] = [];
  const flush = () => { const p = buf.join(" ").replace(/\s+/g, " ").trim(); if (p && !/^[-*_]{3,}$/.test(p)) out.push(p); buf = []; };
  for (const l of lines) { if (!l.trim()) flush(); else buf.push(l.trim().replace(/^[-*]\s+/, "")); }
  flush();
  return out;
}

/** 스트리밍 중 완성된 장 수: 마지막 "## " 머리글 앞까지. finished면 전부. */
export function completedChapters(text: string, finished: boolean): BookChapter[] {
  const all = parseChapters(text);
  return finished ? all : all.slice(0, Math.max(0, all.length - 1));
}

export function chapterChars(c: BookChapter): number {
  return c.sections.reduce((s, x) => s + x.heading.length + x.paragraphs.reduce((a, p) => a + p.length, 0), 0) + c.title.length;
}

export function renderChapter(c: BookChapter): string {
  const cardLines = (k?: SectionCard) => k ? [k.image ? `[그림] ${k.image}` : "", k.review ? `[돌아보기] ${k.review}` : k.todo ? `[해 볼 것] ${k.todo}` : "", k.caution !== undefined ? `[살필 점] ${k.caution ?? "없음"}` : ""].filter(Boolean) : [];
  return [`## ${c.n}. ${c.title}`, ...c.sections.flatMap(s => [...(s.heading ? [`### ${s.heading}`] : []), ...s.paragraphs.flatMap(p => [p, ""]), ...(s.card ? [...cardLines(s.card), ""] : [])])].join("\n").trim();
}
