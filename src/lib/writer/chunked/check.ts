/**
 * AM2 검사(결정론, 호출 0).
 * 1) 브리프 검사: 작가에게 갈 글(인물 카드·근거 카드·짝·설계도) 전부를 고객 문장 검사(시점 말·면책 꼴·내부 용어·약어·한자·금지 비유)에 통과시킨다.
 *    하나라도 걸리면 작가를 부르지 않는다(실패 처리).
 * 2) 차단 검사: 묶음 원고의 차단 결함(사실·시점·면책·내부 용어·입력 불일치·근거 주인·달 근거·대운 위치·비문·고아). 걸리면 그 묶음을 다시 쓴다.
 *    장 사이 반복은 모든 묶음이 끝난 뒤 따로(뒤쪽 묶음만 1회). 문체 깃발은 고치지 않고 점수로만.
 */
import * as L from "../safety/lint";
import * as D from "../safety/p6d";
import * as E from "../safety/p6e";
import { RURAL_PROP, splitSentences } from "../safety/patterns";
import { HARD_RULES, type LintFlag } from "../safety/p6c";
import { INTERNAL, INTERNAL_LABEL } from "../safety/sentences";
import type { FinalChapter } from "../safety";
import type { Intake, Line } from "./intake";

// ---------- 1) 브리프 검사 ----------
export type BriefIssue = { readonly where: string; readonly text: string; readonly rule: "time" | "notice" | "internal" | "abbr" | "hanja" | "metaphor" | "symbol" };
const TIME_WORD = /(?<![가-힣])(지금|올해|요즘|최근|당장)|이번 (달|해|한 달)/;
/** 작가에게 주는 제약 꼴(쓰는 법·금지) — 브리프 본문에 있으면 작가가 옮긴다(AM: note의 「경향으로」 「단정하지 않는다」). */
const CONSTRAINT = /단정(하지|하진|할 수 없|하는 (말|건|것)은)|경향(으로|일 뿐|이라서)|(쓰지|넣지|말하지|옮기지|따르지|약속하지|만들지|정하지) (않는다|마)|하지 않는다|(?<![가-힣])금지(?![가-힣])|지시가 아님|자료일 뿐|조건형|가정형|미입력:|고전(의|에서|은)|그렇게 옮기지 않/;
/** 내부 약어(행동 조언 종류 이름·처방 낱말·브리프 키 이름). */
export const ABBR = /하루 두기|한 줄 말하기|지출 한도 쪽|견적 비교 쪽|처방|act::|tenGod:|group:|status:|ganji:|mbti:[A-Z]|depth:|month:20|bridge:20|\btemplateId\b|yearCard|loveYear|moneyIn|nowTheme|lifetime\b/;
const SYMBOL = /→|⇒|×|::|(?<=\S) \/ (?=\S)/;
const RULE_RE: Readonly<Record<string, RegExp>> = { time: /(?<![가-힣])(지금|올해|요즘|최근|당장)|이번 (달|해|한 달)|요즘 들어/, notice: CONSTRAINT, internal: INTERNAL, abbr: ABBR, hanja: /[一-鿿]/, metaphor: new RegExp(`${L.FARMING.source}|${RURAL_PROP.source}`), symbol: SYMBOL };
/** 걸린 자리 앞뒤 40자(보고용). */
function matchContext(t: string, rule: string): string { const m = RULE_RE[rule]?.exec(t); if (!m) return t.slice(0, 120); const a = Math.max(0, m.index - 40); return `${a ? "…" : ""}${t.slice(a, m.index + m[0].length + 40)}…`; }
export function briefCheck(x: Intake, nicknames: readonly string[] = []): BriefIssue[] {
  const out: BriefIssue[] = [];
  const see = (where: string, text: string) => {
    if (!text) return;
    const t = text.replace(/«[^»]*»/g, "«»");
    const rule: BriefIssue["rule"] | null = TIME_WORD.test(t) || D.timeDeictic(t, true) ? "time"
      : E.isNoticeSentence(t) || E.metaInstruction(t) || CONSTRAINT.test(t) ? "notice"
      : INTERNAL.test(t) || INTERNAL_LABEL.test(t) ? "internal"
      : ABBR.test(t) ? "abbr"
      : /[一-鿿]/.test(t) ? "hanja"
      : L.FARMING.test(t) || RURAL_PROP.test(t) || nicknames.some(n => n.length >= 3 && t.includes(n)) ? "metaphor"
      : SYMBOL.test(t) ? "symbol" : null;
    if (rule) out.push({ where, text: matchContext(t, rule), rule });
  };
  x.person.forEach((p, i) => see(`인물 ${i + 1}`, p));
  for (const l of x.lines) { see(`${l.id} 값`, l.value); see(`${l.id} 뜻`, l.meaning); }
  for (const p of x.pairs) see(`${p.id} 이유`, p.why);
  for (const c of x.chapters) {
    see(`${c.n}장 제목`, c.title); see(`${c.n}장 질문`, c.question);
    c.claims.forEach(cl => see(`${c.n}장 주장`, cl));
    for (const s of c.sections ?? []) { see(`${c.n}장 소제목 틀`, s.q); s.claims.forEach(cl => see(`${c.n}장 절 주장`, cl)); if (s.scene) see(`${c.n}장 장면`, s.scene); if (s.angle) see(`${c.n}장 각도`, s.angle); }
    for (const k of c.keys ?? []) { see(`${k.key} 이름`, k.label); see(`${k.key} 머리 문장`, k.head); k.claims.forEach(cl => see(`${k.key} 주장`, cl)); if (k.scene) see(`${k.key} 장면`, k.scene); }
  }
  return out;
}

// ---------- 2) 차단 검사 ----------
/** 묶음을 다시 쓰게 하는 규칙: 사실·금지(HARD_RULES) + 면책·비문 꼴 + AM2 새 규칙. */
export const BLOCK_RULES: ReadonlySet<string> = new Set<string>([...HARD_RULES, "notice_repeat", "awkward", "fn_join", "code_leak", "abbr_leak", "evidence_owner", "month_line", "month_list", "dayun_soon"]);
/** 장 사이 반복(모든 묶음 뒤 결정론, 뒤쪽 묶음만 1회 다시 쓴다). */
export const REPEAT_RULES: ReadonlySet<string> = new Set<string>(["phrase_repeat", "scene_repeat", "meaning_repeat", "prior_overlap", "closing_repeat"]);
export type ChunkFlag = { readonly chapter: number; readonly section: number; readonly paragraph: number; readonly rule: string; readonly sentence: string; readonly detail?: string };

const CODE = /(?<![A-Za-z0-9])[NDYMBIP]\d{1,2}(?![A-Za-z0-9])|근거 카드|책 설계도|소제목 틀|핵심 주장|장면 씨앗|되풀이 금지|이번 묶음|머리 문장/;
const norm = (t: string) => t.replace(/[^가-힣A-Za-z0-9]/g, "");
const windows = (t: string, w: number) => { const n = norm(t), out = new Set<string>(); for (let i = 0; i + w <= n.length; i++) out.add(n.slice(i, i + w)); return out; };
const hit = (s: string, set: ReadonlySet<string>, w: number) => { const n = norm(s); for (let i = 0; i + w <= n.length; i++) if (set.has(n.slice(i, i + w))) return n.slice(i, i + w); return null; };
const MONTH_NAME = /(1[0-2]|[1-9])월 ?·? ?([갑을병정무기경신임계][자축인묘진사오미신유술해])월|([갑을병정무기경신임계][자축인묘진사오미신유술해])월/g;
const monthsIn = (s: string) => new Set([...s.matchAll(MONTH_NAME)].map(m => m[2] ?? m[3]));

export type BlockCtx = {
  readonly intake: Intake;
  /** MBTI 유형·기능 쉬운 이름(주어 단서). 없으면 근거 주인 검사를 하지 않는다. */
  readonly mbtiAnchor?: RegExp;
  /** 대운이 바뀌기까지 남은 해(책 기준 해에서). 2보다 크면 「곧 … 대운으로 넘어가」는 틀린 위치 말. */
  readonly yearsToNextDayun?: number;
};
/** 근거 주인 창: 짝이 없는 명리 줄의 뜻(10자 창). MBTI 주어 문장에 나오면 명리의 뜻이 MBTI로 옮겨 간 것. */
function ownerWindows(x: Intake): Set<string> {
  const paired = new Set(x.pairs.map(p => p.myeongri));
  const out = new Set<string>();
  for (const l of x.lines) if ((l.subject === "natal" || l.subject === "year" || l.subject === "dayun") && !paired.has(l.id)) for (const w of windows(l.meaning, 10)) out.add(w);
  for (const p of x.pairs) for (const w of windows(p.why, 10)) out.delete(w);
  for (const l of x.lines) if (l.subject === "mbti") for (const w of windows(`${l.value} ${l.meaning}`, 10)) out.delete(w);
  return out;
}
/** 달 key마다 그 달 근거 줄의 12자 창(다른 달 줄과 겹치는 창은 뺀다). */
function monthWindows(x: Intake): Map<string, Set<string>> {
  const byId = new Map(x.lines.map(l => [l.id, l]));
  const out = new Map<string, Set<string>>();
  for (const c of x.chapters) for (const k of c.keys ?? []) { const s = new Set<string>(); for (const id of k.lines) { const l = byId.get(id); if (l?.subject === "month") for (const w of windows(l.meaning, 12)) s.add(w); } out.set(k.key, s); }
  const count = new Map<string, number>(); for (const s of out.values()) for (const w of s) count.set(w, (count.get(w) ?? 0) + 1);
  for (const s of out.values()) for (const w of [...s]) if ((count.get(w) ?? 0) > 1) s.delete(w);
  return out;
}
/** 달 목록 줄(「연애 쪽 기운이 오르는 달: 8월 · 무신월, …」)의 낱말 단서와 달 이름. */
function monthLists(x: Intake): { cue: RegExp; months: Set<string> }[] {
  const CUES: [RegExp, RegExp][] = [[/연애/, /연애|인연|만남/], [/돈이 오르|돈이 새/, /돈|지출|수입|씀씀이/], [/일이 오르|일터/, /일|업무|커리어/], [/사람 쪽|관계 속도/, /사람|관계/], [/무리하기|쉬어 가기|조용한/, /무리|쉬어|쉬는|컨디션|마음/]];
  const out: { cue: RegExp; months: Set<string> }[] = [];
  for (const l of x.lines as Line[]) { if (l.subject !== "month" || !/달/.test(l.value)) continue; const ms = monthsIn(l.meaning); if (!ms.size) continue; const cue = CUES.find(([re]) => re.test(l.value))?.[1]; if (cue) out.push({ cue, months: ms }); }
  return out;
}

export function blockFlags(chapters: readonly FinalChapter[], lint: readonly LintFlag[], b: BlockCtx): ChunkFlag[] {
  const out: ChunkFlag[] = lint.filter(f => BLOCK_RULES.has(f.rule) && f.paragraph >= 0 && !f.card).map(f => ({ chapter: f.chapter, section: f.section, paragraph: f.paragraph, rule: f.rule, sentence: f.sentence, ...(f.detail ? { detail: f.detail } : {}) }));
  const seen = new Set(out.map(f => `${f.chapter}.${f.section}.${f.paragraph}|${f.sentence}`));
  const owner = b.mbtiAnchor ? ownerWindows(b.intake) : new Set<string>(), months = monthWindows(b.intake), lists = monthLists(b.intake);
  const add = (f: ChunkFlag) => { const k = `${f.chapter}.${f.section}.${f.paragraph}|${f.sentence}`; if (!seen.has(k)) { seen.add(k); out.push(f); } };
  for (const c of chapters) c.sections.forEach((s, si) => s.paragraphs.forEach((p, pi) => {
    for (const raw of splitSentences(p)) {
      const sen = raw.replace(/[⟪⟫]/g, ""), at = { chapter: c.n, section: si, paragraph: pi, sentence: sen };
      if (CODE.test(sen)) { add({ ...at, rule: "code_leak", detail: sen.match(CODE)![0] }); continue; }
      if (ABBR.test(sen)) { add({ ...at, rule: "abbr_leak", detail: sen.match(ABBR)![0] }); continue; }
      if (b.mbtiAnchor?.test(sen)) { const w = hit(sen, owner, 10); if (w) { add({ ...at, rule: "evidence_owner", detail: `명리 근거의 뜻 「${w}」를 MBTI 주어로` }); continue; } }
      if (c.keys?.includes(s.heading)) {
        const mine = months.get(s.heading);
        if (mine) for (const [key, set] of months) if (key !== s.heading && hit(sen, set, 12) && !hit(sen, mine, 12)) { add({ ...at, rule: "month_line", detail: `${key} 달의 근거 줄` }); break; }
      }
      const ms = monthsIn(sen);
      if (ms.size) for (const l of lists) if (l.cue.test(sen) && [...ms].some(m => !l.months.has(m)) && !lists.some(o => o !== l && o.cue === l.cue && [...ms].every(m => o.months.has(m)))) {
        if (/(달|때)(은|는|이|가)? [^.?!]{0,30}(이에요|입니다|예요)|(오르|늦추|새|무리|쉬어)[^.?!]{0,10}달/.test(sen)) { add({ ...at, rule: "month_list", detail: `달 목록이 카드와 다름(카드: ${[...l.months].join("·")})` }); break; }
      }
      if (b.yearsToNextDayun !== undefined && b.yearsToNextDayun > 2 && /곧[^.?!]{0,24}대운(으로|이|에)? ?(넘어가|바뀌|들어가|시작|열리)/.test(sen)) add({ ...at, rule: "dayun_soon", detail: `다음 대운까지 ${b.yearsToNextDayun}년` });
    }
  }));
  return out;
}

/**
 * 장 사이 반복(모든 묶음 뒤): 앞 장의 문장과 5-gram 자카드 0.5 이상이거나 공백·부호 뺀 14자가 같은 뒤 장의 문장(작가 장만, 같은 장 안의 비슷한 문장은 보지 않는다).
 * 묶음은 병렬로 쓰여 서로를 보지 못하므로, 겹치면 뒤쪽 장의 묶음을 1회 다시 쓴다.
 */
export function crossRepeats(chapters: readonly FinalChapter[]): ChunkFlag[] {
  const out: ChunkFlag[] = [], idx = L.overlapIndex(), phrase = new Map<string, number>();
  for (const c of chapters) {
    if (c.source === "deterministic") continue;
    const mine: string[] = [];
    c.sections.forEach((s, si) => s.paragraphs.forEach((p, pi) => { for (const raw of splitSentences(p)) {
      const sen = raw.replace(/[⟪⟫]/g, ""), n = norm(sen); mine.push(sen);
      let w: string | null = null; for (let i = 0; i + 14 <= n.length && !w; i++) { const x = phrase.get(n.slice(i, i + 14)); if (x !== undefined && x !== c.n) w = n.slice(i, i + 14); }
      if (w || idx.has(sen)) out.push({ chapter: c.n, section: si, paragraph: pi, rule: "chapter_repeat", sentence: sen, detail: w ? `앞 장과 같은 구절 「${w}」` : "앞 장과 거의 같은 문장" });
    } }));
    for (const sen of mine) { idx.add(sen); const n = norm(sen); for (let i = 0; i + 14 <= n.length; i++) if (!phrase.has(n.slice(i, i + 14))) phrase.set(n.slice(i, i + 14), c.n); }
  }
  return out;
}

/** 문체 점수(고치지 않는다): 규칙별 수. */
export const styleScoreOf = (lint: readonly LintFlag[]) => lint.filter(f => !BLOCK_RULES.has(f.rule) && !REPEAT_RULES.has(f.rule)).reduce<Record<string, number>>((o, f) => ({ ...o, [f.rule]: (o[f.rule] ?? 0) + 1 }), {});
