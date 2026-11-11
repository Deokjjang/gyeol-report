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
export const BLOCK_RULES: ReadonlySet<string> = new Set<string>([...HARD_RULES, "notice_repeat", "awkward", "fn_join", "code_leak", "abbr_leak", "evidence_owner", "month_line", "month_list", "dayun_soon",
  // AM2 P 판독(2026-11-11)에서 자동 검사가 못 본 유형: 앞날 확정 · 하늘·땅 뒤바뀜 · 일주 꼴 · 정도말 · 지난 일 단정 · 명사구 비문 · 읽기 지시 · 시점 말 · 머리 문장 되풀이.
  "future_event", "sky_ground", "pillar_shape", "degree", "past_assert", "noun_predicate", "reader_directive", "time_extra", "head_repeat"]);
/** 경미 규칙: 그 묶음을 다른 까닭으로 다시 쓸 때만 함께 고치게 하고, 그것만으로는 다시 쓰지도 지우지도 않는다(판독 기준 경미). */
export const PIGGYBACK_RULES: ReadonlySet<string> = new Set<string>(["head_repeat"]);
/** 장 사이 반복(모든 묶음 뒤 결정론, 뒤쪽 묶음만 1회 다시 쓴다). */
export const REPEAT_RULES: ReadonlySet<string> = new Set<string>(["phrase_repeat", "scene_repeat", "meaning_repeat", "prior_overlap", "closing_repeat"]);
const BLOCK_RULES_OLD: ReadonlySet<string> = new Set<string>([...HARD_RULES, "notice_repeat", "awkward", "fn_join", "code_leak", "abbr_leak", "evidence_owner", "month_line", "month_list", "dayun_soon"]);
export type ChunkFlag = { readonly chapter: number; readonly section: number; readonly paragraph: number; readonly rule: string; readonly sentence: string; readonly detail?: string; readonly hint?: string };

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
  /** MBTI 유형 이름(예: ENTP). 근거에 MBTI 줄·짝이 없는 장·key에서 쓰면 근거 주인 오류. */
  readonly mbtiType?: string;
  /** 일주 한글(예: 갑오). 「오화가 … 위에 앉은」처럼 땅 글자를 앉는 쪽으로 쓰면 일주 꼴 오류. */
  readonly dayPillar?: string;
  /** key → 흐름 세기(1~5)와 간지(달·해 이름). 「가장 잔잔」「가장 거센」은 유일한 끝값일 때만. */
  readonly flows?: ReadonlyMap<string, { readonly score: number; readonly ganji: string }>;
};

// ---------- AM2 P 판독 규칙(결정론) ----------
const TG = "비견|겁재|식신|상관|편재|정재|편관|정관|편인|정인";
const TGJ = `(?:\\([^)]*\\))?`;
/** 머리 문장 「A가 하늘에, B가 땅에」 → 하늘·땅 십성. */
export function headPair(head: string): { sky: string; ground: string } | null {
  const m = new RegExp(`(${TG})${TGJ}(?:이|가) 하늘에, (${TG})${TGJ}(?:이|가) 땅에`).exec(head);
  return m ? { sky: m[1], ground: m[2] } : null;
}
/** 하늘·땅 배치 문장이 머리 문장과 어긋나면 그 까닭. 「X 위에 Y가 앉아」 = X가 땅·Y가 하늘, 「X 아래 Y」 = X가 하늘·Y가 땅. */
export function skyGroundIssue(sen: string, p: { sky: string; ground: string }): string | null {
  if (p.sky === p.ground) return null;
  const want = `머리 문장은 ${p.sky}가 하늘, ${p.ground}가 땅`;
  const on = new RegExp(`(${TG})${TGJ}[^.?!]{0,30}?위에[^.?!]{0,40}?(${TG})${TGJ}[^.?!]{0,8}?앉`).exec(sen);
  if (on && (on[1] !== p.ground || on[2] !== p.sky)) return `「${on[1]} 위에 ${on[2]}」 — ${want}`;
  const under = new RegExp(`(${TG})${TGJ}[^.?!]{0,10}?아래(?:에|로)?[^.?!]{0,40}?(${TG})`).exec(sen);
  if (under && (under[1] !== p.sky || under[2] !== p.ground)) return `「${under[1]} 아래 ${under[2]}」 — ${want}`;
  for (const m of sen.matchAll(new RegExp(`(${TG})${TGJ}(?:의 [가-힣]+| 기운| 힘)?(?:이|가|은|는)? ?(하늘|땅)(?:에|에서|으로|엔)`, "g"))) {
    if (m[1] !== (m[2] === "하늘" ? p.sky : p.ground)) return `「${m[1]}」이 ${m[2]} — ${want}`;
  }
  return null;
}
const BRANCH_EL: Readonly<Record<string, string>> = { 자: "수", 축: "토", 인: "목", 묘: "목", 진: "토", 사: "화", 오: "화", 미: "토", 신: "금", 유: "금", 술: "토", 해: "수" };
/** 앞날 장면을 받는 부드러운 틀(어울림·가능·권유·조건·질문). 없으면 사건 단정. */
const SOFT_RAW = /어울려요|어울립니다|어울리는|떠올라요|떠오릅니다|그려져요|그려집니다|모습|장면|수 있어요|수 있습니다|수도 있|기 쉬워요|기 쉽습니다|기 좋아요|기 좋습니다|좋은 때|좋은 해|좋은 달|다면|라면|(?<![가-힣])면 |거든|보세요|보면|두세요|해 두|해도 좋|볼 만|권해요|추천|[?？]$|나요|까요|지도 몰라|일지도|듯해요|듯합니다|법해요|만해요|죠[.!]?$/;
/** 「평소라면」처럼 조건이 아닌 「라면」은 떼고 본다(P 시범 2035 「평소라면 안 나갈 공모전에 원서를 내고 … 새우는 해예요」를 놓쳤다). */
const soft = (sen: string) => SOFT_RAW.test(sen.replace(/(평소|원래|예전|여느 때|보통)(이)?라면/g, ""));
/** 앞날 장면 씨앗을 그때의 사건으로 옮긴 문장: key 안은 씨앗과 4자 창 8개 이상(P 시범 실측: 단정 23~33, 오탐 3~4), 다른 장은 4개 이상 + 「…는 해·달이에요」. */
const SEED_IN_KEY = 8, SEED_ELSEWHERE = 4;
const EVENT_END = /(는|ㄴ|은) (해|달)(예요|이에요|입니다)[.!]?$/;
/** 지난 일 단정이 아닌 꼴(질문·조건·추측). */
const PAST_SOFT = /[?？]$|다면|라면|었을|았을|였을|했을|ㅆ을|을 수도|ㄹ 수도|수도 있|지도 몰라|않았나요|었나요|았나요|였나요|던가요|았던가|었던가|나요|까요|겠|거예요|거고|테고|텐데|지 않았|기억나|떠올려|돌아보|적어 보|살펴보/;
const PAST_DECL = /(었|았|였|했|졌|됐|웠|켰|렸|냈|섰|왔|갔|겼|쳤|혔|뀌었)(습니다|어요|아요|죠|지요)[.!]?$|(온|해 온|지나온|옮겨 온|익혀 온) (3년|세 해|시간|셈)(이에요|입니다|이죠)[.!]?$|(결|흐름|해|시기|때)(이었|였)(어요|습니다)[.!]?$/;
/** 엔진 사실 문장(그 해의 십성·대운·간지를 말하는 문장)은 지난 일 단정이 아니다. */
const PAST_FACT = new RegExp(`(${TG}|대운|[갑을병정무기경신임계][자축인묘진사오미신유술해](년|월)?)[^.?!]{0,30}(들어온|들어왔|온 해|안이었|안에 있었|자리였|기운이었|해였)`);
const TIME_EXTRA = /이번 (한 )?해|올 한 해|이번 연도|올해 들어/;
const DIRECTIVE = /(이야기|얘기|것|글|내용|책|말)(으)?로 (읽어|들어|받아들여) (주세요|보세요)|읽어 주세요[.!]?$|가볍게 읽어|참고로 읽/;
const TIME_NOUN = /(달|해|월|년|대운|10년|시기|무렵|기간|계절|봄|여름|가을|겨울|주|날|때|요즘|하반기|상반기|초반|후반|중반|이번|이때|그때|첫해|마지막)$/;
/** 「X는 … 시기입니다」(카드 명사구 「X이 ~하는 시기」를 주제어로 바꾼 비문). X가 때를 뜻하는 말이면 괜찮다. */
function nounPredicate(sen: string): string | null {
  if (!/(는|ㄴ|은|운|던|할|일|을) (시기|때)(입니다|예요|이에요)[.!]?$/.test(sen)) return null;
  // 주제어가 명사(이름꼴 「~함·~음·~움」, 모습·마음·감정 같은 말)일 때만 — 「식은 게」「가는 때」 같은 관형형은 주제어가 아니다.
  const m = /(?:^|\s)([가-힣]*(?:모습|마음|감정|기분|생각|태도|습관|말투|[가-힣]함|[가-힣]음|[가-힣]움|[가-힣]림))(은|는) /.exec(sen);
  if (!m || TIME_NOUN.test(m[1]) || /^(지금|처음|이번|요즘|마지막)/.test(m[1])) return null;
  return `「${m[1]}${m[2]} … 시기·때입니다」`;
}
/** 4자 창 겹침 수(공백·부호 뺀 글). */
const overlap4 = (a: string, b: string) => { const A = windows(a, 4), B = windows(b, 4); let n = 0; for (const w of A) if (B.has(w)) n++; return n; };
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
  // 소제목(paragraph -1)도 차단 대상(P 시범 annual-1: 「쉴 달은 2월과 3월…」·솔로에게 「좋아하는 사람을 한 발씩」이 소제목이라 빠졌다). 카드 줄은 결정론 값으로 바꾸는 기존 길.
  const out: ChunkFlag[] = lint.filter(f => BLOCK_RULES.has(f.rule) && !f.card).map(f => ({ chapter: f.chapter, section: f.section, paragraph: f.paragraph, rule: f.rule, sentence: f.sentence, ...(f.detail ? { detail: f.detail } : {}), ...(f.hint ? { hint: f.hint } : {}) }));
  const seen = new Set(out.map(f => `${f.chapter}.${f.section}.${f.paragraph}|${f.sentence}`));
  const owner = b.mbtiAnchor ? ownerWindows(b.intake) : new Set<string>(), months = monthWindows(b.intake), lists = monthLists(b.intake);
  const anyList = b.intake.lines.filter(l => l.subject === "month").map(l => monthsIn(l.meaning)).filter(s => s.size > 1);
  const add = (f: ChunkFlag) => { const k = `${f.chapter}.${f.section}.${f.paragraph}|${f.sentence}`, kr = `${k}|${f.rule}`; if (!seen.has(k) || (!seen.has(kr) && !BLOCK_RULES_OLD.has(f.rule))) { seen.add(k); seen.add(kr); out.push(f); } };
  const plans = new Map(b.intake.chapters.map(c => [c.n, c]));
  const lineById = new Map(b.intake.lines.map(l => [l.id, l]));
  const paired = new Set(b.intake.pairs.map(p => p.myeongri));
  const mbtiBasis = (ids: readonly string[], sen: string) => ids.some(id => lineById.get(id)?.subject === "mbti" || paired.has(id)) || b.intake.pairs.some(p => overlap4(sen, p.why) >= 3);
  const keySeeds = b.intake.chapters.flatMap(c => (c.keys ?? []).filter(k => k.when === "future" && k.scene).map(k => k.scene!));
  const flowAll = [...(b.flows?.values() ?? [])].map(f => f.score);
  const extreme = (score: number, low: boolean) => { const e = low ? Math.min(...flowAll) : Math.max(...flowAll); return score === e && flowAll.filter(x => x === e).length === 1; };
  const flowByGanji = new Map([...(b.flows?.values() ?? [])].map(f => [f.ganji, f.score]));
  const pillar = b.dayPillar && b.dayPillar.length === 2 ? new RegExp(`${b.dayPillar[1]}${BRANCH_EL[b.dayPillar[1]] ?? ""}${TGJ}(?:가|이|는|은) [^.?!]{0,25}위에`) : null;
  const LOW = /가장 (잔잔|조용|약|낮|느리|느린|순하|순한|고요)/, HIGH = /가장 (거세|거센|세|센|강|높|크|큰|빠르|빠른|뜨겁|뜨거운)/;
  const cardText = b.intake.lines.map(l => `${l.value} ${l.meaning}`).join(" ");
  /** 카드에 「가장 ~」이 그대로 있으면(예: 「가장 조용한 달: 계축월」) 작가 말이 아니라 카드 값이다. */
  const onCard = (sen: string, re: RegExp) => { const m = re.exec(sen); return Boolean(m && cardText.includes(`가장 ${m[1]}`)); };
  for (const c of chapters) c.sections.forEach((s, si) => {
    const plan = plans.get(c.n), kp = plan?.keys?.find(k => k.key === s.heading);
    const chapterLines = [...(plan?.sections ?? []).flatMap(x => x.lines), ...(plan?.keys ?? []).flatMap(x => x.lines)];
    const pair = kp ? headPair(kp.head) : null;
    const small = kp ? kp.lines.flatMap(id => [...(lineById.get(id)?.meaning ?? "").matchAll(/작은 ([가-힣]{2,})/g)].map(m => m[1])) : [];
    if (!kp && TIME_EXTRA.test(s.heading)) add({ chapter: c.n, section: si, paragraph: -1, sentence: s.heading, rule: "time_extra", detail: s.heading.match(TIME_EXTRA)![0], hint: "「이번 해」 대신 해 이름(「2027년」)" });
    s.paragraphs.forEach((p, pi) => splitSentences(p).forEach((raw, sj) => {
      const sen = raw.replace(/[⟪⟫]/g, ""), at = { chapter: c.n, section: si, paragraph: pi, sentence: sen };
      if (TIME_EXTRA.test(sen)) add({ ...at, rule: "time_extra", detail: sen.match(TIME_EXTRA)![0], hint: "「이번 한 해」 대신 해 이름(「2027년 한 해」)" });
      if (DIRECTIVE.test(sen)) add({ ...at, rule: "reader_directive", hint: "읽는 법을 시키는 문장을 쓰지 않는다(그냥 내용으로)" });
      { const w = nounPredicate(sen); if (w) add({ ...at, rule: "noun_predicate", detail: w, hint: "「X는 ~하는 시기입니다」는 비문 — 「X가 ~합니다」처럼 주어와 서술어를 맞춘다" }); }
      if (b.mbtiType && sen.includes(b.mbtiType) && !mbtiBasis(kp ? kp.lines : chapterLines, sen)) add({ ...at, rule: "evidence_owner", detail: `근거에 MBTI 줄·짝이 없는 ${kp ? kp.key : `${c.n}장`}에서 ${b.mbtiType}`, hint: "이 장·key 근거에는 MBTI가 없다 — 유형 이름을 빼고 명리 근거로만" });
      if (pillar?.test(sen)) add({ ...at, rule: "pillar_shape", detail: `일주 ${b.dayPillar}: 하늘 글자가 땅 글자 위에 앉는다`, hint: `일주는 「${b.dayPillar![0]}이 ${b.dayPillar![1]} 위에 앉은」 꼴로만` });
      if (kp) {
        if (pair) {
          const w = skyGroundIssue(sen, pair); if (w) add({ ...at, rule: "sky_ground", detail: w, hint: `머리 문장 그대로 「${pair.sky}가 하늘, ${pair.ground}가 땅」(「X 위에 Y가 앉아」 꼴은 쓰지 않는다)` });
          if (pi === 0 && sj === 0 && sen.includes(pair.sky) && sen.includes(pair.ground) && /하늘|땅/.test(sen)) add({ ...at, rule: "head_repeat", hint: "머리 문장이 이미 하늘·땅 십성을 말했다 — 바로 다음 문장은 그 뜻·장면부터" });
        }
        const f = b.flows?.get(kp.key);
        if (f && ((LOW.test(sen) && !onCard(sen, LOW) && !extreme(f.score, true)) || (HIGH.test(sen) && /흐름|기운|세기/.test(sen) && !onCard(sen, HIGH) && !extreme(f.score, false)))) add({ ...at, rule: "degree", detail: `흐름 세기 ${f.score}/5는 유일한 끝값이 아니다`, hint: "카드에 없는 「가장」을 붙이지 않는다(흐름 세기 값 그대로)" });
        for (const w of small) if (sen.includes(`큰 ${w}`)) { add({ ...at, rule: "degree", detail: `카드는 「작은 ${w}」`, hint: "카드의 정도말(작은)을 바꾸지 않는다" }); break; }
        if (kp.when === "past" && !PAST_SOFT.test(sen) && PAST_DECL.test(sen) && !PAST_FACT.test(sen)) add({ ...at, rule: "past_assert", hint: "지난 때는 질문형·조건형으로만(「…했다면」「…않았나요?」)" });
        if (kp.when === "future" && kp.scene && overlap4(sen, kp.scene) >= SEED_IN_KEY && !soft(sen)) add({ ...at, rule: "future_event", detail: "장면 씨앗을 그때의 사건으로 단정", hint: "앞날 장면은 일어난다고 쓰지 않는다 — 「…하는 모습이 어울려요」「…해 보기 좋은 때예요」처럼, 건수·결과를 못 박지 않는다" });
      } else {
        if (plan?.id === "past" && !PAST_SOFT.test(sen) && PAST_DECL.test(sen) && !PAST_FACT.test(sen)) add({ ...at, rule: "past_assert", hint: "지난 3년은 겪었다고 단정하지 않는다 — 질문형·조건형(「…했다면」「…않았나요?」)으로만" });
        if (plan?.id !== "past" && !soft(sen) && keySeeds.some(seed => { const o = overlap4(sen, seed); return o >= SEED_IN_KEY || (o >= SEED_ELSEWHERE && EVENT_END.test(sen)); })) add({ ...at, rule: "future_event", detail: "앞날 key의 장면 씨앗을 사건으로 단정", hint: "앞날 장면은 일어난다고 쓰지 않는다 — 「…하는 모습이 어울려요」처럼" });
        const ms = [...monthsIn(sen)];
        if (ms.length === 1 && flowByGanji.has(ms[0]) && LOW.test(sen) && !onCard(sen, LOW) && !extreme(flowByGanji.get(ms[0])!, true)) add({ ...at, rule: "degree", detail: `${ms[0]}월 흐름 세기 ${flowByGanji.get(ms[0])}/5는 유일한 끝값이 아니다`, hint: "카드에 없는 「가장」을 붙이지 않는다" });
      }
    }));
  });
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
      if (ms.size && !anyList.some(set => [...ms].every(m => set.has(m)))) for (const l of lists) if (l.cue.test(sen) && [...ms].some(m => !l.months.has(m))) {
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
