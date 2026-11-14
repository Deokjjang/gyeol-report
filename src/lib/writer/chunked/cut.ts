/**
 * AM2 — 다시 쓰기 뒤에도 남은 차단 결함 문장 지우기(결정론, 호출 0). P 시범 판독(2026-11-11) 뒤 고침:
 * - 걸린 문장만 지우면 다음 문장이 앞말에 기대거나(「그래서」「이렇게」), 앞의 수사 물음(「…낯설죠.」)이 답을 잃는다 → 함께 지운다.
 * - 빈 문단은 뺀다. 빈 소제목은 뺀다(CLAUDE.md 「그 소제목을 뺀다, 장은 비우지 않는다」). 빈 key·빈 장만 결정론으로 채운다(부르는 쪽).
 * - 걸린 소제목은 설계도의 소제목 틀(질문)로 바꾼다(작가 문체 규칙보다 결함 0이 먼저).
 * 예전(P 시범)에는 한 낱말 결함으로 장 통째를 결정론 대체로 보냈고, 그 대체 글(엔진 원문)이 세운 결함 25 가운데 13을 만들었다.
 */
import type { FinalChapter } from "../safety";
import { orphanStart } from "../safety/p6e";
import { splitSentences } from "../safety/patterns";
import type { ChunkFlag } from "./check";

/** 앞 문장에 기대는 첫머리(repair3 LEANS와 같은 꼴 + 「그래서·그러니」). */
/** AM2-4 5부(P3 판독 annual-1 차단 #2 — 「오르는 달에는 넓히고, 흔들리는 달에는…」만 남은 고아): 지운 문장의 목록을 가리키는 말(「오르는 달·흔들리는 달·그 달들」)도 기대는 첫머리. */
const LEANS = /^(이처럼|이렇게|이런|그런|그 덕분|그만큼|여기에|그 결과|그러다(?! 보니)|그때|이때|그래서|그러니|그러면|그렇다면|그럼|그다음은|이 조합|이 두|이 |그 |오르는 달|흔들리는 달|늦출 달|그 달들|이 달들|그 두 달|이 두 달|이 네 달|그 네 달|그 세 달|이 세 달|그때마다)/;
/** 답이 뒤따라야 서는 수사 물음(「…낯설죠.」「…일까요?」).
 *  AM2-4: 물음표 없는 「…나요.」「…가요.」는 서술이다(「어긋나요」「만나요」「드러나요」 — 뒤 문장을 지울 때 함께 지워지던 오탐). */
const ASKS = /([?？]|죠|지요|까요|ㄹ까|을까)[.!]?$/;
const bare = (s: string) => s.replace(/[⟪⟫]/g, "").trim();

export type Cut = { readonly at: string; readonly rule: string; readonly sentence: string; readonly why: "flagged" | "leans" | "question" | "orphan" };

export function cutFlagged(chapters: readonly FinalChapter[], flags: readonly ChunkFlag[], headingFor: (chapter: number, section: number) => string | null): { chapters: FinalChapter[]; cut: Cut[]; headings: { at: string; from: string; to: string | null }[]; emptyKeys: { chapter: number; key: string }[]; droppedSections: string[]; missed: ChunkFlag[] } {
  const cut: Cut[] = [], headings: { at: string; from: string; to: string | null }[] = [], missed: ChunkFlag[] = [];
  const out = chapters.map(c => ({ ...c, sections: c.sections.map(s => ({ ...s, paragraphs: [...s.paragraphs] })) }));
  const dropSection = new Set<string>();
  const byPara = new Map<string, ChunkFlag[]>();
  for (const f of flags) {
    const c = out.find(x => x.n === f.chapter); if (!c || c.source === "deterministic") { missed.push(f); continue; }
    const s = c.sections[f.section]; if (!s) { missed.push(f); continue; }
    if (f.paragraph < -1) { missed.push(f); continue; } // 문장 없는 깃발(반드시 쓸 것 · 빈 자리 · 표지)은 다시 쓰기로만.
    if (f.paragraph < 0) {
      if (c.keys?.includes(s.heading)) { missed.push(f); continue; }
      const to = headingFor(c.n, f.section);
      headings.push({ at: `${c.n}.${f.section}`, from: s.heading, to });
      if (to) s.heading = to; else dropSection.add(`${c.n}.${f.section}`);
      continue;
    }
    const k = `${f.chapter}.${f.section}.${f.paragraph}`; byPara.set(k, [...(byPara.get(k) ?? []), f]);
  }
  for (const [k, fs] of byPara) {
    const [n, si, pi] = k.split(".").map(Number);
    const s = out.find(x => x.n === n)!.sections[si], p = s.paragraphs[pi]; if (p === undefined) { missed.push(...fs); continue; }
    const ss = splitSentences(p), gone = new Map<number, Cut["why"]>();
    for (const f of fs) {
      const i = ss.findIndex(x => bare(x).includes(f.sentence) || f.sentence.includes(bare(x)));
      if (i < 0) { missed.push(f); continue; }
      gone.set(i, "flagged");
      for (let j = i + 1, extra = 0; j < ss.length && extra < 2 && (LEANS.test(bare(ss[j])) || orphanStart(bare(ss[j]))); j++, extra++) if (!gone.has(j)) gone.set(j, "leans");
      if (i > 0 && ASKS.test(bare(ss[i - 1])) && !gone.has(i - 1)) gone.set(i - 1, "question");
    }
    let rest = ss.map((x, i) => (gone.has(i) ? null : x));
    // 남은 첫 문장이 앞말에 기대면(지운 문장 뒤가 아니어도 문단 첫머리가 되면) 그것도 뺀다.
    const firstLeft = rest.findIndex(x => x !== null);
    if (firstLeft >= 0 && (LEANS.test(bare(rest[firstLeft]!)) || orphanStart(bare(rest[firstLeft]!))) && gone.has(firstLeft - 1)) { gone.set(firstLeft, "orphan"); rest = rest.map((x, i) => (i === firstLeft ? null : x)); }
    for (const [i, why] of [...gone].sort((a, b) => a[0] - b[0])) cut.push({ at: k, rule: fs.find(f => why === "flagged" && (bare(ss[i]).includes(f.sentence) || f.sentence.includes(bare(ss[i]))))?.rule ?? fs[0].rule, sentence: bare(ss[i]), why });
    s.paragraphs[pi] = rest.filter((x): x is string => x !== null).join(" ");
  }
  const emptyKeys: { chapter: number; key: string }[] = [], droppedSections: string[] = [];
  const result = out.map(c => {
    const sections = c.sections.map(s => ({ ...s, paragraphs: s.paragraphs.filter(x => x.trim()) })).filter((s, si) => {
      if (c.keys?.includes(s.heading)) { if (!s.paragraphs.length) emptyKeys.push({ chapter: c.n, key: s.heading }); return true; }
      const drop = dropSection.has(`${c.n}.${si}`) || !s.paragraphs.length;
      if (drop) droppedSections.push(`${c.n}.${si}:${s.heading}`);
      return !drop;
    });
    return { ...c, sections };
  });
  return { chapters: result, cut, headings, emptyKeys, droppedSections, missed };
}

/**
 * AM2-4 P4 세운 자동 점검(2028년 1월 · 계축월): 되풀이로 지운 문장이 그 key의 「반드시 쓸 것」을 지닌 유일한 문장이었다 → 핵심 누락(차단)이 새로 생겼다.
 * 되풀이는 경미, 빠진 핵심은 차단이다. 그래서 차단 아닌 지우기(되풀이·화면 되풀이)가 새로 빠뜨린 핵심 자리마다, 그 자리를 되살리는 문장 하나를 지우지 않고 남긴다(남긴 문장은 부르는 쪽이 허용 기록).
 * - missing(chs): 그 원고에서 「반드시 쓸 것」이 빠진 자리(`장|소제목`). hard: 차단 결함 깃발(사실 오류 등 — 핵심이 빠지더라도 지운다).
 * - 한 문장에 깃발이 여럿이면 함께 남긴다(같은 장·소제목·문단·문장).
 */
export function spareMustCuts(chapters: readonly FinalChapter[], flags: readonly ChunkFlag[], hard: ReadonlySet<ChunkFlag>, headingFor: (chapter: number, section: number) => string | null, missing: (chs: readonly FinalChapter[]) => ReadonlySet<string>): { r: ReturnType<typeof cutFlagged>; kept: ChunkFlag[] } {
  const keyOf = (f: ChunkFlag) => `${f.chapter}|${chapters.find(c => c.n === f.chapter)?.sections[f.section]?.heading ?? ""}`;
  const same = (f: ChunkFlag) => (g: ChunkFlag) => !hard.has(g) && g.chapter === f.chapter && g.section === f.section && g.paragraph === f.paragraph && bare(g.sentence) === bare(f.sentence);
  const r0 = cutFlagged(chapters, flags, headingFor), before = missing(chapters);
  const lost = [...missing(r0.chapters)].filter(k => !before.has(k));
  if (!lost.length) return { r: r0, kept: [] };
  const kept: ChunkFlag[] = [];
  const rest = (extra: readonly ChunkFlag[]) => flags.filter(g => !kept.includes(g) && !extra.includes(g));
  for (const k of lost) {
    for (const f of flags.filter(g => !hard.has(g) && !kept.includes(g) && g.paragraph >= 0 && keyOf(g) === k)) {
      const group = flags.filter(same(f));
      if (!missing(cutFlagged(chapters, rest(group), headingFor).chapters).has(k)) { kept.push(...group); break; }
    }
  }
  return { r: kept.length ? cutFlagged(chapters, rest([]), headingFor) : r0, kept };
}
