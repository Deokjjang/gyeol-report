/**
 * 공통 문체 기준(AM 1-4, 모든 상품, 결정론·호출 0).
 * - 검사(문체 규칙: 수리로만 보내고 문단은 빼지 않는다): 장 안 같은 구절 3번째부터(1-1 ②), 같은 문장 시작 3번 연속, 같은 연결어 과다.
 * - 점수(책마다, Book meta와 검토 묶음 점검표): 반복률, 문장 시작 다양성, 연결어 분포, 금지 표현 수, 용어표 위반 수, 리듬(문장 길이 섞임·문단 첫 문장 길이).
 */
import type { FinalChapter } from "./index";
import { overlapIndex } from "./lint";
import { ORPHAN_CONNECTIVE } from "./orphan";
import { splitSentences } from "./patterns";
import { TERMS } from "./terms";

export type StyleRule = "chapter_phrase_repeat" | "start_repeat" | "connective_excess" | "advice_repeat" | "stage_bare" | "term_unexplained";
export type StyleFlag = { readonly chapter: number; readonly section: number; readonly paragraph: number; readonly rule: StyleRule; readonly sentence: string; readonly detail?: string };

const stripMarks = (s: string) => s.replace(/[⟪⟫]/g, "");
const norm = (s: string) => stripMarks(s).replace(/[^가-힣]/g, "");
/** 장 안 같은 구절 창(공백·문장부호 뺀 한글 글자 수)과 허용 횟수(1-1 ②: 「맡은 일을 끝까지 책임지고 안정적으로」 한 장 4번). */
export const CHAPTER_PHRASE_WINDOW = 12;
export const CHAPTER_PHRASE_MAX = 2;
/** 같은 연결어로 시작하는 문장: 한 장에 이 수까지. */
export const CONNECTIVE_MAX = 2;
/** 어디서나 쓰는 마디(우연 겹침): 존댓말 끝맺음·호칭·흔한 이음. */
const COMMON = /^[가-힣]{0,5}(입니다|이에요|예요|해요|합니다|습니다|세요|있어요|없어요|거예요|편이에요)[가-힣]{0,4}$|당신에게는|당신의마음|두사람의|두사람이|이책은타고난|하는편이에요/;

/** 문장 첫 어절의 뿌리(조사·문장부호 뗌): 「당신은·당신의·당신에게」 → 「당신」. */
export function startKey(sentence: string): string {
  const first = stripMarks(sentence).trim().replace(/^["“'‘「(]+/, "").split(/\s+/)[0] ?? "";
  return first.replace(/[,.!?…"”'’」)]+$/, "").replace(/(에게서|에게는|에게|에서|으로|부터|까지|처럼|만큼|이라|이란|이나|은|는|이|가|을|를|의|도|만|과|와|로|에)$/, "");
}
const connectiveOf = (sentence: string) => stripMarks(sentence).trim().match(ORPHAN_CONNECTIVE)?.[2] ?? null;

type Sen = { c: number; s: number; p: number; text: string; keyed: boolean };
function sentencesOf(chapters: readonly FinalChapter[]): Sen[] {
  return chapters.filter(c => c.source !== "deterministic").flatMap(c => c.sections.flatMap((sec, si) => sec.paragraphs.flatMap((para, pi) => splitSentences(para).map(text => ({ c: c.n, s: si, p: pi, text: stripMarks(text), keyed: Boolean(c.keys?.length) })))));
}

/** 문체 검사 깃발(수리 대상). 같은 문장에 이미 다른 깃발이 있으면 부르는 쪽이 거른다. */
export function styleFlags(chapters: readonly FinalChapter[]): StyleFlag[] {
  const out: StyleFlag[] = [];
  const all = sentencesOf(chapters);
  for (const ch of chapters) {
    const sens = all.filter(x => x.c === ch.n);
    // ① 장 안 같은 구절: 문장마다 한 번만 센다(같은 문장 안 되풀이는 세지 않음).
    const seen = new Map<string, number>();
    for (const x of sens) {
      const n = norm(x.text), wins = new Set<string>();
      for (let i = 0; i + CHAPTER_PHRASE_WINDOW <= n.length; i++) { const w = n.slice(i, i + CHAPTER_PHRASE_WINDOW); if (!COMMON.test(w)) wins.add(w); }
      let hit = "";
      for (const w of wins) { const k = (seen.get(w) ?? 0) + 1; seen.set(w, k); if (k > CHAPTER_PHRASE_MAX && !hit) hit = w; }
      if (hit) out.push({ chapter: x.c, section: x.s, paragraph: x.p, rule: "chapter_phrase_repeat", sentence: x.text, detail: hit });
    }
    // ② 같은 문장 시작 3번 연속(소제목 안에서, 소제목이 바뀌면 다시 센다).
    for (let i = 2; i < sens.length; i++) {
      const [a, b, c] = [sens[i - 2], sens[i - 1], sens[i]];
      if (a.s !== c.s) continue;
      const k = startKey(c.text);
      if (k.length >= 1 && startKey(a.text) === k && startKey(b.text) === k) out.push({ chapter: c.c, section: c.s, paragraph: c.p, rule: "start_repeat", sentence: c.text, detail: k });
    }
    // ④ 십이운성 한 글자 이름 맨몸(AM 1부 판독: 「십이운성의 사가 있어서」·「명리의 양 단계」 — 음양의 양·일상어와 헷갈림).
    for (const x of sens) { const m = x.text.match(STAGE_BARE); if (m) out.push({ chapter: x.c, section: x.s, paragraph: x.p, rule: "stage_bare", sentence: x.text, detail: m[0] }); }
    // ③ 같은 연결어로 여는 문장이 한 장에 셋 이상이면 셋째부터.
    const conn = new Map<string, number>();
    for (const x of sens) { const w = connectiveOf(x.text); if (!w) continue; const k = (conn.get(w) ?? 0) + 1; conn.set(w, k); if (k > CONNECTIVE_MAX) out.push({ chapter: x.c, section: x.s, paragraph: x.p, rule: "connective_excess", sentence: x.text, detail: w }); }
  }
  // ⑤ 같은 행동 조언 계열이 책에서 세 번째부터(AM 1부 판독: 「한 줄 말해 보세요」 6개 장, 「달력에 막아 두기」 3개 장).
  const fam = new Map<string, number>();
  for (const x of all) {
    if (!ADVICE_END.test(x.text)) continue;
    const f = ADVICE_FAMILY.find(([re]) => re.test(x.text))?.[1]; if (!f) continue;
    const k = (fam.get(f) ?? 0) + 1; fam.set(f, k);
    if (k > ADVICE_MAX) out.push({ chapter: x.c, section: x.s, paragraph: x.p, rule: "advice_repeat", sentence: x.text, detail: f });
  }
  // ⑥ W3 P3 4절: 용어가 책에서 처음 나왔는데 쉬운 뜻이 없다(예전에는 styleScore 지표만) → 수리로 뜻을 붙인다(문체 규칙, 지우지 않는다).
  for (const t of unexplainedTerms(all)) out.push({ chapter: t.c, section: t.s, paragraph: t.p, rule: "term_unexplained", sentence: t.text, detail: t.term });
  return out;
}

/** 십이운성 한 글자 이름이 한자·뜻 없이 「단계」·「십이운성의」와 함께 나온 꼴. 두 글자 이름(장생·건록 등)은 헷갈리지 않아 보지 않는다. */
const STAGE_BARE = /십이운성(의|은|이|에서|으로)? (쇠|병|사|묘|절|태|양)(?!\()(?=[이가은는을를의도]|\s)|(?<![가-힣])(쇠|병|사|묘|절|태|양)(?!\()(이라는|라는|의)? ?단계/;
/** 행동 조언 문장(끝맺음)과 계열(prompt ACTION_FAMILIES와 같은 낱말). */
const ADVICE_END = /(세요|면 좋(습니다|아요)|게 좋(습니다|아요)|는 게 좋(습니다|아요)|해 두면 (됩니다|돼요))[.!"”]*$/;
const ADVICE_FAMILY: readonly [RegExp, string][] = [
  [/한 ?줄(로|만|씩)? ?(말|적|쓰|전|남기|정리|건네|덧붙|보내)|한 문장으로/, "한 줄 말하기"], [/하루(만)? (두|묵|미루|기다)|하룻밤/, "하루 두기"], [/(달력|캘린더|일정표)[^.]{0,12}(막아|적어|넣어|표시)/, "달력에 막기"],
  [/한도|상한/, "지출 한도"], [/견적|비교해 보|두 곳 이상/, "견적 비교"], [/고맙|감사/, "고마움 말하기"], [/거절|안 된다고/, "거절 연습"], [/산책|걷기|걸어/, "걷기"], [/통장/, "통장 나누기"],
];
export const ADVICE_MAX = 2;
/** 행동 조언 문장의 계열(조언 끝맺음이 아니거나 계열이 없으면 null). 정보량 지표(info.ts rxRepeat)도 쓴다. */
export const adviceFamilyOf = (sentence: string): string | null => (ADVICE_END.test(sentence) ? ADVICE_FAMILY.find(([re]) => re.test(sentence))?.[1] ?? null : null);

export const STYLE_HINT: Readonly<Record<StyleRule, string>> = {
  chapter_phrase_repeat: "같은 장 안에서 같은 구절을 세 번째로 썼다 → 이번 문장은 다른 말로, 새 정보(장면·근거)를 붙여 다시 쓴다",
  start_repeat: "같은 말로 시작하는 문장이 세 번 이어졌다 → 이 문장의 첫머리를 다른 말로 바꾼다(뜻은 그대로)",
  connective_excess: "같은 연결어(그래서·하지만 등)로 여는 문장이 이 장에 너무 많다 → 연결어를 빼거나 다른 이음으로 바꾼다",
  advice_repeat: "같은 계열의 행동 조언을 책에서 세 번째로 썼다 → 이 장 재료에 맞는 다른 행동으로 바꾸거나, 조언 없이 장면·이해로 마무리한다",
  term_unexplained: "명리 용어(detail)가 책에서 처음 나왔는데 쉬운 뜻이 없다 → 같은 문장 안에 쉬운 말 뜻을 붙인다(예: '편인(혼자 깊이 파고들어 배우는 힘)'), 뜻 공식('~은 명리학에서')은 쓰지 않는다",
  stage_bare: "십이운성 한 글자 이름을 맨몸으로 썼다 → 「사(死) 단계」처럼 한자와 '단계'를 붙이고 쉬운 뜻을 바로 붙인다(땅 글자 자체가 단계인 것처럼 쓰지 않는다)",
};

export type StyleScore = {
  /** 다른 장 문장과 비슷한 문장(5-gram 자카드 0.5 이상)의 몫(%). */
  readonly repeatRate: number;
  /** 서로 다른 문장 시작(첫 어절 뿌리) 수 / 문장 수(%), 같은 시작 3연속 수. */
  readonly startDiversity: number; readonly startRuns: number;
  /** 연결어로 여는 문장의 몫(%)과 많이 쓴 연결어. */
  readonly connectiveShare: number; readonly connectiveTop: readonly (readonly [string, number])[];
  /** 금지 표현 수(사실·금지 규칙 깃발)와 용어표 위반 수(용어 첫 등장에 쉬운 뜻이 없음). */
  readonly banned: number; readonly termViolations: number;
  /** 리듬: 문장 길이 평균·변동계수(%), 짧은 문장(25자 이하)·긴 문장(60자 이상)의 몫(%), 문단 첫 문장 평균 길이. */
  readonly rhythm: { readonly meanLen: number; readonly cv: number; readonly short: number; readonly long: number; readonly firstLen: number };
  readonly sentences: number;
};

const pct = (a: number, b: number) => (b ? Math.round((a / b) * 1000) / 10 : 0);
/** 용어 첫 등장 뒤 쉬운 뜻: 괄호 안(쉬운 말(용어)·용어(쉬운 말)), 같은 문장의 「뜻·말해요·기운·힘」, 또는 다음 문장이 뜻을 푼다. */
const TERM_RES = TERMS.filter(t => t.term.length >= 2).map(t => ({ t, re: new RegExp(`(?<![가-힣])${t.term}(?=[은는이가을를의에과와도로만(]|[^가-힣]|$)`) }));
/** 책에서 처음 나온 용어 가운데 쉬운 뜻이 없는 것(문장 자리·용어). */
function unexplainedTerms(sens: readonly Sen[]): (Sen & { term: string })[] {
  const seen = new Set<string>(), out: (Sen & { term: string })[] = [];
  sens.forEach((x, i) => {
    const s = x.text;
    for (const { t, re } of TERM_RES) {
      if (seen.has(t.term)) continue;
      const at = s.search(re); if (at < 0) continue;
      seen.add(t.term);
      const near = `${s} ${sens[i + 1]?.text ?? ""}`;
      const inParen = s.lastIndexOf("(", at) > s.lastIndexOf(")", at) || /^\s*\(/.test(s.slice(at + t.term.length).replace(/^\([一-鿿]+\)/, "").slice(0, 2));
      if (!inParen && !/뜻|말해요|말합니다|가리켜|기운(이에요|입니다|이라)|힘(이에요|입니다|이라)|이라는|라는/.test(near) && !(t.easy && near.includes(t.easy.slice(0, 4)))) out.push({ ...x, term: t.term });
    }
  });
  return out;
}
function termViolations(chapters: readonly FinalChapter[]): number { return unexplainedTerms(sentencesOf(chapters)).length; }

/** 책 한 권 문체 점수(결정론). banned: 사실·금지 규칙 깃발 수(부르는 쪽이 lint에서 센 값). */
export function styleScore(chapters: readonly FinalChapter[], banned = 0): StyleScore {
  const sens = sentencesOf(chapters);
  const idx = new Map<number, ReturnType<typeof overlapIndex>>();
  for (const x of sens) { let m = idx.get(x.c); if (!m) { m = overlapIndex(); idx.set(x.c, m); } m.add(x.text); }
  const repeated = sens.filter(x => [...idx].some(([c, m]) => c !== x.c && m.has(x.text))).length;
  const starts = new Set(sens.map(x => startKey(x.text)));
  const runs = styleFlags(chapters).filter(f => f.rule === "start_repeat").length;
  const conns = new Map<string, number>(); let connN = 0;
  for (const x of sens) { const w = connectiveOf(x.text); if (w) { connN++; conns.set(w, (conns.get(w) ?? 0) + 1); } }
  const lens = sens.map(x => x.text.length), mean = lens.reduce((a, b) => a + b, 0) / Math.max(1, lens.length);
  const sd = Math.sqrt(lens.reduce((a, b) => a + (b - mean) ** 2, 0) / Math.max(1, lens.length));
  const firsts = chapters.filter(c => c.source !== "deterministic").flatMap(c => c.sections.flatMap(s => s.paragraphs.map(p => stripMarks(splitSentences(p)[0] ?? "").length))).filter(n => n > 0);
  return {
    repeatRate: pct(repeated, sens.length), startDiversity: pct(starts.size, sens.length), startRuns: runs,
    connectiveShare: pct(connN, sens.length), connectiveTop: [...conns].sort((a, b) => b[1] - a[1]).slice(0, 4),
    banned, termViolations: termViolations(chapters),
    rhythm: { meanLen: Math.round(mean), cv: Math.round((sd / Math.max(1, mean)) * 100), short: pct(lens.filter(n => n <= 25).length, lens.length), long: pct(lens.filter(n => n >= 60).length, lens.length), firstLen: Math.round(firsts.reduce((a, b) => a + b, 0) / Math.max(1, firsts.length)) },
    sentences: sens.length,
  };
}

/** MBTI 기능 순서(주기능 → 부기능 → 3차 → 열등)를 유형 글자에서 계산한다(유형론 표준 규칙, 지식 DB와 같은 값). */
export function fnStack(type: string): [string, string, string, string] | null {
  if (!/^[EI][NS][TF][JP]$/.test(type)) return null;
  const [ei, p, j, jp] = type.split("") as [string, string, string, string];
  const flip = (c: string) => ({ S: "N", N: "S", T: "F", F: "T" })[c]!, att = (e: boolean) => (e ? "e" : "i");
  const extravertedJudge = jp === "J"; // 바깥으로 쓰는 기능: J면 판단, P면 인식
  const outer = extravertedJudge ? j : p, inner = extravertedJudge ? p : j;
  const [dom, aux] = ei === "E" ? [`${outer}e`, `${inner}i`] : [`${inner}i`, `${outer}e`];
  const tert = `${flip(aux[0])}${dom[1]}`, inf = `${flip(dom[0])}${att(dom[1] === "i")}`;
  return [dom, aux, tert, inf];
}
/** 「주기능·부기능(보조 기능)」 주장이 유형의 실제 순서와 다른가(AM 1부 판독: 「ISFJ는 마음 살피기가 주기능이라」 — ISFJ 주기능은 Si). plain: 기능 → 쉬운 이름. */
export function fnRoleMismatch(sentence: string, type: string | null | undefined, plain: Readonly<Record<string, string>>): string | null {
  const stack = type ? fnStack(type) : null; if (!stack) return null;
  const roles: [RegExp, number][] = [[/주기능|주 기능|으뜸 기능/, 0], [/부기능|보조 ?기능/, 1]];
  for (const [re, idx] of roles) {
    const at = sentence.search(re); if (at < 0) continue;
    const before = sentence.slice(Math.max(0, at - 24), at);
    const named = Object.entries(plain).filter(([code, name]) => before.includes(`(${code})`) || before.includes(code) || (name && name.length >= 3 && before.includes(name)));
    const wrong = named.find(([code]) => code !== stack[idx]);
    if (named.length === 1 && wrong) return `${type}의 ${idx ? "부기능" : "주기능"}은 ${stack[idx]}(${plain[stack[idx]] ?? ""})`;
  }
  return null;
}
