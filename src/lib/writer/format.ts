/**
 * 작가 출력 형식(P3 B): "## N. 장 제목" → "### 소제목" → 문단(빈 줄로 구분). 반복 장은 "### {key}".
 * 스트리밍 중에는 다음 "## " 머리글이 나타난 장까지만 완성으로 본다(마지막 장은 종료 신호 뒤에 완성).
 */
export type BookSection = { readonly heading: string; readonly paragraphs: readonly string[] };
export type BookChapter = { readonly n: number; readonly title: string; readonly sections: readonly BookSection[] };
export type ChapterSource = "writer" | "continuation" | "deterministic";

const CHAPTER = /^##\s+(\d+)\.\s*(.+?)\s*$/;
const SECTION = /^###\s+(.+?)\s*$/;

export function parseChapters(text: string): BookChapter[] {
  const out: { n: number; title: string; sections: { heading: string; lines: string[] }[] }[] = [];
  for (const raw of text.replace(/\r\n?/g, "\n").split("\n")) {
    const line = raw.trimEnd();
    const ch = line.match(CHAPTER);
    if (ch && !line.startsWith("###")) { out.push({ n: Number(ch[1]), title: ch[2].replace(/\*\*/g, ""), sections: [] }); continue; }
    const cur = out[out.length - 1];
    if (!cur) continue; // 첫 장 머리글 앞의 말은 버린다.
    const sec = line.match(SECTION);
    if (sec) { cur.sections.push({ heading: sec[1].replace(/\*\*/g, ""), lines: [] }); continue; }
    if (!cur.sections.length) cur.sections.push({ heading: "", lines: [] });
    cur.sections[cur.sections.length - 1].lines.push(line);
  }
  return out.map(c => ({ n: c.n, title: c.title, sections: c.sections.map(s => ({ heading: s.heading, paragraphs: paragraphsOf(s.lines) })).filter(s => s.heading || s.paragraphs.length) }));
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
  return [`## ${c.n}. ${c.title}`, ...c.sections.flatMap(s => [...(s.heading ? [`### ${s.heading}`] : []), ...s.paragraphs.flatMap(p => [p, ""])])].join("\n").trim();
}
