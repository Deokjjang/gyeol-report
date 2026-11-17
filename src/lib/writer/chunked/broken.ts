/**
 * AM2-10 4부 — 깨진 문장 안전망(세운·대운 본문 검사, 결정론 · 호출 0). AM2-9 3부에서 기록으로 내린 깨진 갈래 가운데 좁힌 꼴만 되살린다.
 *  dayun_orphan   대운 줄이 없는 절(key · 소제목)의 「이 대운」(P9 annual-1 큰 그림 「이 대운의 땅 글자 축과는」).
 *  mbti_do_orphan 받을 앞말 없는 「유형이름 + 도」(P8 · P9 annual-p6b 7월 「ISTJ도 검증된 것만 믿는 쪽입니다」 — 바로 앞 문장과 뜻 낱말이 하나도 겹치지 않음).
 *  cut_clause     「…는지,」가 받을 말 없이 조건 꼴로 넘어간 끊긴 절(P9 annual-p5 6월 「얼마나 가까워졌는지, … 오르내린다면」).
 *  dup_phrase     한 문장 안에 같은 두 어절 말이 되풀이된 겹친 구절(P9 annual-p6a 4월 「상관 기운은 … 같은 상관 기운이 겹치는 달이에요」).
 *  bad_char       깨진 글자(U+FFFD)가 작가 원문에 그대로 남음(P10 annual-p6a 「뚜렷하게 �잡히지 않아요」 — 첫 원고에 있음, 스트림 해독은 정상).
 *  memo_leak      작성 메모 · 지시 말이 본문에 샘(P12 r1117 「이름과 핵심어만 쓰면 되니 … 두겠습니다」 · 「…라는 이름으로만 두고 … 읽겠습니다」 · 「썸이라는 입력」,
 *                 P9 base-annual-p6b 「정재의 핵심어대로」, P7 major-p6a 「화면에 이미 있는 줄이라, 여기서는 뜻만」 · 카드 표시 기호 ▸). AM2-13 1부, 저장 책 118권 참 7 · 오탐 0.
 *  pair_outside   (잘못된 연결 백업) 짝이 있는 key에서 MBTI 문장이 짝 밖 명리(핵심 관계 · 관계 말)와 인과 · 채움으로 이어짐(P9 annual-p6b 9월 「이 달의 부딪침이 그 빈 곳을 채웁니다」).
 * 각 검사는 저장 책 전수(AM-01 · P~P9 세운·대운)에서 오탐 0일 때만 차단(four.ts)에 둔다. 판정 기록: docs/v5/annual-major/rubric.md 2-6.
 */
import type { FinalChapter } from "../safety";
import type { BlockCtx, ChunkFlag } from "./check";

const SENT = /(?<=[.!?])\s+/;
/** 뜻 낱말(두 글자 이상, 조사 · 흔한 서술 뗌). */
const STOP = new Set(["당신", "쪽입니다", "편입니다", "있습니다", "합니다", "됩니다", "있어요", "해요", "이런", "그런", "그래서", "하는", "있는", "없는", "이번", "그때", "때문", "이에요", "예요", "입니다", "쉽습니다", "쉬운", "달이에요", "달입니다"]);
const PARTICLE = /(으로부터|에게서|으로서|으로써|에서|에게|까지|부터|처럼|보다|마다|만큼|으로|이나|이며|이고|은|는|이|가|을|를|과|와|의|도|에|로|만|요)$/;
const normWord = (w: string) => w.replace(/[^가-힣A-Za-z0-9]/g, "").replace(PARTICLE, "");
const words = (s: string) => s.split(/\s+/).map(normWord).filter(w => w.length >= 2 && !STOP.has(w));
const stem = (w: string) => w.slice(0, 2);
/** 「유형도」 뒤 말이 바로 앞 문장과 뜻 낱말(앞 두 글자)을 하나라도 함께 쓰나. */
const rawStems = (s: string) => s.split(/\s+/).map(w => w.replace(/[^가-힣A-Za-z0-9]/g, "")).filter(w => w.length >= 2 && !STOP.has(w)).map(stem);
const sharesContent = (sen: string, prev: string, type: string) => { const after = sen.slice(sen.indexOf(`${type}도`) + type.length + 1); const a = new Set([...words(after).map(stem), ...rawStems(after)]); return [...words(prev).map(stem), ...rawStems(prev)].some(w => a.has(w)); };
/** 겹친 구절: 두 어절 말이 주제(「X은 · X는」)로 나온 뒤 같은 문장에서 「같은 X」로 되풀이(「상관 기운은 … 같은 상관 기운이 겹치는 달」) — 저장 책 전수 대조로 좁힌 꼴(나란히 쓴 되풀이는 들지 않는다). */
export function dupPhrase(sen: string): string | null {
  const raw = sen.split(/\s+/), ws = raw.map(normWord);
  for (let i = 0; i + 1 < ws.length; i++) {
    const a = ws[i], b = ws[i + 1];
    if (a.length < 2 || b.length < 2 || a.length + b.length < 4 || !/[은는],?$/.test(raw[i + 1])) continue;
    for (let j = i + 3; j + 1 < ws.length; j++) if (ws[j] === a && ws[j + 1] === b && raw[j - 1] === "같은") return `${a} ${b}`;
  }
  return null;
}
/** 관계 말(이름 · 뜻 한 마디) — 짝 밖 명리. */
const REL_TERM = /[자축인묘진사오미신유술해]{2,3}(?:충|형|파|해|합|반합|방합)|(?:이|그) (?:달|해)의 (?:부딪침|맺힘|묶임|모임|다듬음|어긋남|방해|빔)|부딪침이|맺힘이|모임이/;
/** AM2-13 1부: 작성 메모 꼴(따옴표 대사는 뗀 뒤 본다 — 「"이 순서로 하겠습니다"」 같은 인용). 「내 이름으로만 된 통장」(지식 DB 줄)은 들지 않게 「라는 이름으로」만. */
export const MEMO_LEAK = /(?:두|읽|쓰|넘어가)겠습니다|핵심어|라는 이름으로(?:만)? 두|(?:이)?라는 입력|이 책에서(?:는)?[^.!?]{0,40}(?:쓴다|씁니다|부른다|부릅니다)|(?:쓰|두|적|부르)면 되니|화면에 (?:이미 )?있는 (?:줄|값|이름)|여기서는 (?:뜻|이름)만|▸/;
export const memoLeak = (sen: string): string | null => sen.replace(/"[^"]*"|“[^”]*”/g, "").match(MEMO_LEAK)?.[0] ?? null;
const CAUSAL_FILL = /채우|채워|채웁|채운|메우|메워|메웁|덕분|때문|그래서|그만큼|와 만나|과 만나|이 만나|가 만나|겹쳐|바꿔 놓|달라지|이라서|라서 /;

export function am210Flags(chapters: readonly FinalChapter[], b: BlockCtx): ChunkFlag[] {
  const out: ChunkFlag[] = [], x = b.intake, type = b.mbtiType ?? "";
  const subj = new Map(x.lines.map(l => [l.id, l.subject] as const));
  for (const c of chapters) {
    const plan = x.chapters.find(p => p.n === c.n);
    c.sections.forEach((s, si) => {
      const kp = plan?.keys?.find(k => k.key === s.heading);
      // 대운 줄 · 대운을 부른 말이 같은 key(달 · 해) 또는 같은 장(소제목 장) 안에 있으면 고아가 아니다. 대운 책은 책 전체가 그 대운 이야기라 보지 않는다.
      const scopeLines = kp ? kp.lines : (plan?.sections ?? []).flatMap(q => q.lines);
      const scopeText = kp ? s.paragraphs.join(" ") : c.sections.flatMap(q => q.paragraphs).join(" ");
      const hasDayun = x.product !== "annual_fortune" || scopeLines.some(id => subj.get(id) === "dayun") || /대운/.test(`${s.heading} ${kp?.core?.join(" ") ?? ""} ${(plan?.sections ?? []).map(q => q.q).join(" ")}`) || /[가-힣]{2} 대운/.test(scopeText);
      let namedDayun = false;
      s.paragraphs.forEach((p, pi) => {
        const sents = p.split(SENT);
        sents.forEach((sen, i) => {
          const at = { chapter: c.n, section: si, paragraph: pi, sentence: sen };
          if (/(?<![가-힣])이 대운/.test(sen) && !hasDayun && !namedDayun) out.push({ ...at, rule: "dayun_orphan", detail: "대운 줄이 없는 절의 「이 대운」" });
          if (/[가-힣]{2} 대운/.test(sen)) namedDayun = true;
          if (type && sen.includes(`${type}도 `)) {
            // 받는 말: 같은 문장 앞부분 + 바로 앞 문장.
            const prev = `${i > 0 ? sents[i - 1] : pi > 0 ? (s.paragraphs[pi - 1].split(SENT).pop() ?? "") : ""} ${sen.slice(0, sen.indexOf(`${type}도`))}`.trim();
            if (!prev || !sharesContent(sen, prev, type)) out.push({ ...at, rule: "mbti_do_orphan", detail: `「${type}도」가 받을 앞말이 없다` });
          }
          if (/(?:얼마나|어떻게|어디까지|왜|누가|무엇이|언제)[^,.?!]{0,30}(?:는지|은지|인지|던지), [^.?!]*(?:다면|라면)/.test(sen)) out.push({ ...at, rule: "cut_clause", detail: "「…는지,」가 받을 말 없이 끊김" });
          const d = dupPhrase(sen); if (d) out.push({ ...at, rule: "dup_phrase", detail: `「${d}」 되풀이` });
          if (sen.includes("\uFFFD")) out.push({ ...at, rule: "bad_char", detail: "깨진 글자(U+FFFD)" });
          const memo = memoLeak(sen); if (memo) out.push({ ...at, rule: "memo_leak", detail: `작성 메모 「${memo}」` });
          if (kp?.pair && type && sen.includes(type) && ((kp.core ?? []).some(n => sen.includes(n)) || REL_TERM.test(sen)) && CAUSAL_FILL.test(sen)) out.push({ ...at, rule: "pair_outside", detail: "짝 key의 MBTI 문장이 핵심 관계 · 관계 말과 이어짐" });
        });
      });
    });
  }
  return out;
}
