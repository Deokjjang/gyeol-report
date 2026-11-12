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
import { RESIDENCE_PREMISE, WISH_MARK } from "./intake";
import { WORKPLACE } from "./card";
import { FLOW_TALK, FLOW_WORD } from "@/lib/brief/labels";

// ---------- 1) 브리프 검사 ----------
export type BriefIssue = { readonly where: string; readonly text: string; readonly rule: "time" | "notice" | "internal" | "abbr" | "hanja" | "metaphor" | "symbol"
  // AM2-3 1-2·2-1·2-3: 카드 문구 자체를 고객 문장 검사에.
  | "noun_value" | "unit" | "tie" | "template" | "month_label" | "general" | "mbti_absent" | "premise" | "plan_basis" | "plan_conflict" | "yinyang" | "screen" };
/** 브리프 검사 문맥(엔진 값): 음양 수 · 흐름 끝값 달(동률 판정) · 화면 카드 글(배지·카드 줄·꼬리표). */
export type BriefCtx = { readonly yin?: number; readonly yang?: number; readonly flowEnds?: { readonly high: readonly string[]; readonly low: readonly string[] }; readonly screen?: readonly { readonly where: string; readonly text: string }[] };
const TIME_WORD = /(?<![가-힣])(지금|올해|요즘|최근|당장)|이번 (달|해|한 달)/;
/** 작가에게 주는 제약 꼴(쓰는 법·금지) — 브리프 본문에 있으면 작가가 옮긴다(AM: note의 「경향으로」 「단정하지 않는다」). */
const CONSTRAINT = /단정(하지|하진|할 수 없|하는 (말|건|것)은)|경향(으로|일 뿐|이라서)|(쓰지|넣지|말하지|옮기지|따르지|약속하지|만들지|정하지) (않는다|마)|하지 않는다|(?<![가-힣])금지(?![가-힣])|지시가 아님|자료일 뿐|조건형|가정형|미입력:|고전(의|에서|은)|그렇게 옮기지 않/;
/** 내부 약어(행동 조언 종류 이름·처방 낱말·브리프 키 이름). */
export const ABBR = /하루 두기|한 줄 말하기|지출 한도 쪽|견적 비교 쪽|처방|act::|tenGod:|group:|status:|ganji:|mbti:[A-Z]|depth:|month:20|bridge:20|\btemplateId\b|yearCard|loveYear|moneyIn|nowTheme|lifetime\b/;
const SYMBOL = /→|⇒|×|::|↑|↓|(?<=\S) \/ (?=\S)/;
/** 카드 칸 이름·MBTI 기능 기호·「(올해)」(1-2). */
const SLOT = /주기능|부기능|3차기능|열등기능|(?<![A-Za-z])(Ni|Ne|Si|Se|Ti|Te|Fi|Fe)(?![A-Za-z])|\(올해\)/;
/** 명사로 준 흐름 값(1-2: 「잔잔함인」 비문의 원인). */
const NOUN_FLOW = /(^|\| |: | · )(잔잔함|느림|활발함|거셈)($| ·|\))/;
/** 화면 카드 틀 문자열(「…해: …살피기」). */
const TEMPLATE = /(해|달): [^.]{2,40}살피기|살피기$|\(\s*\)|\bnull\b|undefined/;
const MONTH_NAME_IN = /(1[0-2]|[1-9])월 · [갑을병정무기경신임계][자축인묘진사오미신유술해]월|[갑을병정무기경신임계][자축인묘진사오미신유술해]월/;
/** 일반론 줄(카드에 남으면 안 된다 — card.ts dropGeneral이 뺀다). */
const GENERAL_LEFT = /(라|이라) 부릅니다|(때|경우) 붙는 이름입니다|(있을|올|들) 때 봅니다|(일주|월지|일지|연지|시지)에 (있을 때|있으면)|일간이 (강한|약한) 사람에게는/;
const YANG_TEXT = /시작 버튼을 먼저 누르는/, YIN_TEXT = /흐름과 속마음을 먼저 읽고/;
const MBTI_WORD = /(?<![A-Z])(I|E)(N|S)(T|F)(J|P)(?![A-Z])|MBTI|성격 유형/;
/** 장 질문이 묻는 것과 근거가 맞물리는지(2-1). 질문 꼴 → 근거 줄에 있어야 할 말. */
const QUESTION_CUES: readonly (readonly [RegExp, RegExp])[] = [
  [/돕는 사람|도와줄 사람/, /돕|도움|도와|사람/], [/도울 때와 기다릴 때/, /오르는 달[\s\S]*늦출 달|늦출 달[\s\S]*오르는 달/], [/기준은\?/, /기준|따져|살피|오르는 달|살필 달/],
  [/오르는 달|늦출 달/, /달/], [/교운기 앞뒤[^?]*마음가짐/, /마음|정리|태도|습관|숙제/], [/언제, 무엇으로 바뀔까/, /교운|무렵부터/], [/좋은 패와 숙제/, /좋은 패[\s\S]*숙제|숙제[\s\S]*좋은 패/], [/색·방향·숫자/, /색[\s\S]*방향/],
];
const RULE_RE: Readonly<Record<string, RegExp>> = { time: /(?<![가-힣])(지금|올해|요즘|최근|당장)|이번 (달|해|한 달)|요즘 들어/, notice: CONSTRAINT, internal: INTERNAL, abbr: ABBR, hanja: /[一-鿿]/, metaphor: new RegExp(`${L.FARMING.source}|${RURAL_PROP.source}`), symbol: SYMBOL };
/** 걸린 자리 앞뒤 40자(보고용). */
function matchContext(t: string, rule: string): string { const m = RULE_RE[rule]?.exec(t); if (!m) return t.slice(0, 120); const a = Math.max(0, m.index - 40); return `${a ? "…" : ""}${t.slice(a, m.index + m[0].length + 40)}…`; }
export function briefCheck(x: Intake, nicknames: readonly string[] = [], bc: BriefCtx = {}): BriefIssue[] {
  const out: BriefIssue[] = [];
  const see = (where: string, text: string) => {
    if (!text) return;
    const t = text.replace(/«[^»]*»/g, "«»");
    const rule: BriefIssue["rule"] | null = TIME_WORD.test(t) || D.timeDeictic(t, true) ? "time"
      : E.isNoticeSentence(t) || E.metaInstruction(t) || CONSTRAINT.test(t) ? "notice"
      : INTERNAL.test(t) || INTERNAL_LABEL.test(t) || SLOT.test(t) ? "internal"
      : ABBR.test(t) ? "abbr"
      : /[一-鿿]/.test(t) ? "hanja"
      : L.FARMING.test(t) || RURAL_PROP.test(t) || nicknames.some(n => n.length >= 3 && t.includes(n)) ? "metaphor"
      : SYMBOL.test(t) ? "symbol"
      : GENERAL_LEFT.test(t) ? "general"
      : RESIDENCE_PREMISE.test(t) ? "premise" : null;
    if (rule) out.push({ where, text: matchContext(t, rule), rule });
  };
  const flag = (rule: BriefIssue["rule"], where: string, text: string) => out.push({ where, rule, text: text.slice(0, 160) });
  const noMbti = x.person.some(p => /^MBTI: 미입력/.test(p));
  x.person.forEach((p, i) => see(`인물 ${i + 1}`, p));
  for (const l of x.lines) {
    see(`${l.id} 값`, l.value); see(`${l.id} 뜻`, l.meaning);
    const both = `${l.value} | ${l.meaning}`;
    if (NOUN_FLOW.test(both) || /흐름 세기 \d\/5/.test(both)) flag("noun_value", l.id, both);
    // 달 카드인데 「…해」로 끝나는 뜻, 대운 카드인데 「…들어오는 해입니다」.
    if (l.subject === "month" && /(?<=[는은운른인던]) 해($| ·|입니다|예요|이에요)/.test(l.meaning)) flag("unit", l.id, l.meaning);
    if (l.subject === "dayun" && /(?<=[는은운른인던]) 해(입니다|예요|이에요)/.test(l.meaning)) flag("unit", l.id, l.meaning);
    if (l.subject === "month" && !MONTH_NAME_IN.test(both) && !/생활 결|같은 결|달 없음|\| 없음$/.test(both)) flag("month_label", l.id, both);
    if (noMbti && (l.subject === "mbti" || MBTI_WORD.test(both))) flag("mbti_absent", l.id, both);
    // 동률인데 「가장」 + 달 하나(P2 판독 annual-1 M14·M179).
    if (bc.flowEnds && /가장 (조용|잔잔)/.test(both) && !/같은 세기/.test(both) && bc.flowEnds.low.length > 1) flag("tie", l.id, both);
    if (bc.flowEnds && /가장 크게 오르/.test(both) && !/같은 세기/.test(both) && bc.flowEnds.high.length > 1) flag("tie", l.id, both);
    // 1-6 음양 문장은 실제 값에서만(음 우세인데 양의 문장 0건).
    if (/^음양/.test(l.value) && bc.yin !== undefined && bc.yang !== undefined && ((bc.yin >= bc.yang + 2 && YANG_TEXT.test(l.meaning)) || (bc.yang >= bc.yin + 2 && YIN_TEXT.test(l.meaning)))) flag("yinyang", l.id, both);
  }
  for (const s2 of bc.screen ?? []) {
    const t = s2.text;
    if (TIME_WORD.test(t.replace(/«[^»]*»/g, "")) || SLOT.test(t) || TEMPLATE.test(t) || /[↑↓]/.test(t)) flag("screen", s2.where, t);
  }
  // 2-1 질문과 근거: 절·key마다 근거 1줄 이상, 질문 꼴이 묻는 것이 근거 줄에 있어야 한다.
  const byId = new Map(x.lines.map(l => [l.id, l]));
  for (const c of x.chapters) {
    for (const sp of c.sections ?? []) {
      if (!sp.lines.length) { flag("plan_basis", `${c.n}장 「${sp.q}」`, "근거 줄 없음"); continue; }
      const basis = sp.lines.map(id => { const l = byId.get(id); return l ? `${l.value} ${l.meaning}` : ""; }).join(" ");
      for (const [q, cue] of QUESTION_CUES) if (q.test(sp.q) && !cue.test(basis) && !x.noDayun) flag("plan_basis", `${c.n}장 「${sp.q}」`, `근거에 ${cue.source} 없음`);
      if (noMbti && MBTI_WORD.test(sp.q)) flag("mbti_absent", `${c.n}장 소제목 틀`, sp.q);
    }
    for (const k of c.keys ?? []) if (!k.lines.length) flag("plan_basis", `${c.n}장 ${k.label}`, "근거 줄 없음");
    if (noMbti && MBTI_WORD.test(`${c.title} ${c.question}`)) flag("mbti_absent", `${c.n}장 제목`, c.title);
  }
  // 2-3 핵심 주장과 되풀이 금지가 같은 근거를 동시에 가리키는 충돌(P2 판독 major-1 D25).
  const owner = new Map<string, number>();
  for (const c of x.chapters) for (const sp of c.sections ?? []) for (const id of sp.claimIds ?? []) if (!owner.has(id)) owner.set(id, c.n);
  for (const c of x.chapters) for (const sp of c.sections ?? []) for (const id of sp.lines) { const o = owner.get(id); if (o !== undefined && o !== c.n && sp.lines.length > 1 && !sp.recapIds?.includes(id)) flag("plan_conflict", `${c.n}장 「${sp.q}」`, `${id}는 ${o}장 핵심 주장`); }
  if (noMbti && x.pairs.length) flag("mbti_absent", "짝", `${x.pairs.length}개`);
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
  "future_event", "sky_ground", "pillar_shape", "degree", "past_assert", "noun_predicate", "reader_directive", "time_extra", "head_repeat",
  // P2 판독(2026-11-11): key별 값 대조 · 따옴표 속 시점 말 · 작은 비문.
  "key_value", "time_quote", "grammar",
  // AM2-3 4부: 관계 동사·뜻 섞임 · 신살 자리 · 근거 주인(MBTI 뜻 → 명리 주어) · 짝 없는 연결 · 앞날·지난 일 단정 사전 · 소제목 꼴 · 지난 대운 나이 × 직장 · 화살표 직역 ·
  // 작성 메모 · 뜻 기준 면책 · 장 첫 문장 소품 연속 · 반드시 쓸 것 · 근거 범위 · 소망 인용.
  "rel_verb", "rel_mix", "seat_claim", "owner_reverse", "pair_link", "future_assert", "past_premise", "heading_form", "past_work", "arrow_literal",
  "meta_trace", "notice_meaning", "opening_prop", "must_miss", "evidence_scope", "wish_quote", "mbti_absent", "domain_list"]);
/** 경미 규칙: 그 묶음을 다른 까닭으로 다시 쓸 때만 함께 고치게 하고, 그것만으로는 다시 쓰지도 지우지도 않는다(판독 기준 경미). */
export const PIGGYBACK_RULES: ReadonlySet<string> = new Set<string>(["head_repeat"]);
/** 문장이 없는 깃발(지울 문장이 없다 — 다시 쓰기로만 고친다). paragraph = -3. */
export const NO_SENTENCE_RULES: ReadonlySet<string> = new Set<string>(["must_miss"]);
/** 장 사이 반복(모든 묶음 뒤 결정론, 뒤쪽 묶음만 1회 다시 쓴다). */
export const REPEAT_RULES: ReadonlySet<string> = new Set<string>(["phrase_repeat", "scene_repeat", "meaning_repeat", "prior_overlap", "closing_repeat", "rep_adjacent", "advice_repeat", "chapter_repeat"]);
const BLOCK_RULES_OLD: ReadonlySet<string> = new Set<string>([...HARD_RULES, "notice_repeat", "awkward", "fn_join", "code_leak", "abbr_leak", "evidence_owner", "month_line", "month_list", "dayun_soon"]);
export type ChunkFlag = { readonly chapter: number; readonly section: number; readonly paragraph: number; readonly rule: string; readonly sentence: string; readonly detail?: string; readonly hint?: string };

const CODE = /(?<![A-Za-z0-9])[NDYMBIP]\d{1,3}(?![A-Za-z0-9])|근거 카드|책 설계도|소제목 틀|핵심 주장|장면 씨앗|할 일 씨앗|되풀이 금지|이번 묶음|머리 문장|주기능|부기능|3차기능|열등기능/;
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
  /** key → 그 시기 관계 이름(배지, 「지지형」「인사해」…). 다른 key의 관계 이름을 쓰면 달 혼동. */
  readonly keyRels?: ReadonlyMap<string, ReadonlySet<string>>;
  /** AM2-3: 지난 대운이 끝난 만 나이(대운 2장 「그 시기를 지나며」 직장 낱말 검사). */
  readonly prevDayunEndAge?: number;
};
// ---------- AM2-3 4부 보조 ----------
/** 낱말 어간(첫 음절 + 둘째 음절의 첫소리·가운뎃소리): 「눌리는·눌립니다」, 「급하게·급한」을 같은 어간으로. */
const stemOf = (w: string): string | null => { if (w.length < 2) return null; const a = w.charCodeAt(0), b = w.charCodeAt(1); if (a < 0xac00 || a > 0xd7a3 || b < 0xac00 || b > 0xd7a3) return null; return w[0] + String.fromCharCode(0xac00 + Math.floor((b - 0xac00) / 28) * 28); };
const STOP_STEM = new Set(["흐름", "기운", "마음", "사람", "서로", "함께", "있는", "있어", "하는", "되는", "들어", "만나", "일이", "일에", "돈이", "관계", "컨디션", "생활", "쉬운", "좋은", "쪽으로", "때는", "것이", "많이", "먼저", "다시", "모두", "커지", "드러", "이달", "달은", "해는", "글자", "자리", "태어", "나무", "하늘", "땅에", "기운이", "흐르", "보통", "느린", "생기", "늘어"].map(w => stemOf(w)).filter((x): x is string => Boolean(x)));
const stemsOf = (t: string) => new Set(t.split(/[^가-힣]+/).map(stemOf).filter((x): x is string => x !== null && !STOP_STEM.has(x)));
type RelKind = "합" | "충" | "형" | "파" | "해" | "원진" | "공망";
const relKind = (name: string): RelKind | null => (/(합|국)$/.test(name) ? "합" : /충$/.test(name) ? "충" : /형$/.test(name) ? "형" : /파$/.test(name) ? "파" : /해$/.test(name) ? "해" : name === "원진" ? "원진" : name === "공망" ? "공망" : null);
/** 관계 뜻 사전(4부): 합 맺힘·묶임, 충 부딪침, 형 눌러 다듬음, 파 어긋남, 해 방해. */
const REL_VERB: Readonly<Partial<Record<RelKind, RegExp>>> = { 합: /맺|묶/, 충: /부딪|충돌/, 형: /다듬|눌러|벌주|깎아/, 파: /어긋|틀어/, 해: /방해|발이 걸|발목/ };
/** 앞날·결과·남의 반응 단정 사전(4부): 사람이 해 줄 일 · 결과로 이어짐 · 안정 · 쏟아짐. */
const FUTURE_ASSERT = /(해|알아봐|반응해|도와|챙겨|들어|맞춰|기다려|인정해) 줄 거(예요|에요|랍니다)|로 이어집니다|로 이어져요|결과로 이어지는 (해|달)|안정적(이에요|입니다)|쏟아집니다|쏟아져요|찾아옵니다|찾아와요|(가|이) 생길 거예요/;
const FUTURE_IN_KEY = /(생깁니다|생겨요|늘어납니다|늘어나요|들어옵니다|들어와요|커집니다|커져요)[.!]?$/;
/** 「-던」으로 카드에 없는 지난 행동을 전제(P2 판독 annual-1 8.3 「선을 긋는 연습을 하던 마음」). */
const PAST_PREMISE = /(을|를) [가-힣 ]{0,10}하던 (마음|때|날|습관|그때)|해 왔던 [가-힣]|그동안 [가-힣]+(해|하) 온|(때가|적이|날이) 있죠[.!]?$|(때|적)(가|이) 있었(죠|을 거예요)|낯설지 않을 (거예요|겁니다)|익숙하실 (거예요|겁니다)/;
/** 입력이 솔로·미입력인데 이미 있는 인연을 전제(P2 판독 annual-1 2.2 「이미 생긴 인연」). */
const PARTNER_PREMISE = /(이미|벌써) (생긴|만난|있는|사귀는) (인연|사람|연인|상대)|만나는 사람과의|연인과의|애인과/;
/** 원국 이름(일주·신살)의 성질을 그 해의 성질로(P2 판독 annual-1 4.1 「갑오일주의 힘이 … 나오는 해예요」). */
const YEAR_END = /(는|ㄴ|은|운|될|되는) (해|달)(예요|이에요|입니다)[.!]?$/;
/** 소제목 꼴(2-5): 지난 일을 굳히는 평서·결과 단정 명사구. */
const HEADING_PAST = /(았|었|였|했|겼|졌|남았)다[.!]?$|다[.!]$/;
const HEADING_ASSERT = /(커지는|오는|생기는|열리는|이어지는|남는|붙는|편해지는|단단해지는|풀리는|늘어나는|찾아오는|바뀌는|이루는|되는) (10년|해|달|인연|때|시기|사람|기회|돈|자리|길)$/;
const HEADING_SOFT = /쉬운|좋은|기 쉬|라면|하면|이면|\?|수 있는|경향|법$|기준|방법|무렵|까$/;
const ARROW_LITERAL = /(위쪽|아래쪽)(을|으로) 향|화살표/;
const META_TRACE2 = /새로운 특성이 없|새 특성 (없이|은 없)|이 (로드맵|장|절|책|부분)에(는|선) [^.?!]{0,24}(없습니다|없어요|담지 않|넣지 않|다루지 않)|설계도|브리프|근거 카드|카드 줄/;
const DOMAIN_LEAD = /(일에서는|일 쪽에서는|일터에서는|돈에서는|돈 쪽에서는|관계에서는|사람 사이에서는|연애에서는|연애 쪽에서는|컨디션은|컨디션에서는|몸은)/g;
/** 장 첫 문장이 소품·장면으로 여는 꼴(따옴표 대사로 열기, 「…날,」「…길에」 같은 장면 머리). */
const PROP_OPEN = /^(["“'‘]|[가-힣 ]{2,18}(날|길에|길|밤|아침|저녁|주말|퇴근길|출근길|점심)(,| ))/;
const SEAT_WORD = /태어난 (해|달|날|시각)|(연|월|일|시)(주|지)(?![가-힣])|[갑을병정무기경신임계][자축인묘진사오미신유술해]일주/g;
const SEAT_OF: Readonly<Record<string, string>> = { 연주: "태어난 해", 연지: "태어난 해", 월주: "태어난 달", 월지: "태어난 달", 일주: "태어난 날", 일지: "태어난 날", 시주: "태어난 시각", 시지: "태어난 시각" };
/** 따옴표 대사 속 시점 말(고객 소망 «»은 보지 않는다). */
const QUOTE = /["“]([^"”]{1,80})["”]|['‘]([^'’]{1,80})['’]/g;
const QUOTE_TIME = /(?<![가-힣])(지금|올해|요즘|최근|당장|이번엔|이번에는)|이번 ?(달|주|해|한 해)/;
/** 작은 비문(P2 판독): 활용 오류 · 뜻이 뒤집히는 꼴 · 카드 값 명사를 그대로 붙임. */
const GRAMMAR: readonly (readonly [RegExp, string])[] = [
  [/도우는/, "「도우는」 → 「돕는」"],
  [/되는 대신[^.?!]{0,14}되지 않게/, "「A가 되는 대신 B가 되지 않게」는 뜻이 뒤집힌다 → 「B가 아니라 A가 되게」"],
  [/(잔잔함|느림|거셈|고름|빠름|활발함)(인|이라서) /, "카드 값(명사)을 그대로 붙였다 → 「잔잔한」「느린」처럼"],
  [/대운(은|이) (중간|앞쪽|끝 무렵|첫해|마지막 해)(에 있|이에요|입니다)/, "대운이 중간에 있는 것이 아니라 그 해가 대운의 중간 — 「2027년은 이 대운의 여섯 번째 해(중간)예요」처럼"],
];

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
const TIME_EXTRA = /이번 (한 )?해|올 한 해|이번 연도|올해 들어|오늘 안에|오늘 중으로/;
const DIRECTIVE = /(이야기|얘기|것|글|내용|책|말)(으)?로 (읽어|들어|받아들여) (주세요|보세요)|읽어 주세요[.!]?$|가볍게 읽어|참고로 읽|(먼저|천천히|차례로) 읽어 보세요|(쪽|것|뜻)으로 읽어요|(으)?로 읽으면 (돼요|됩니다)/;
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
  const labelOfKey = new Map(b.intake.chapters.flatMap(c => (c.keys ?? []).map(k => [k.key, k.label] as const)));
  const lineById = new Map(b.intake.lines.map(l => [l.id, l]));
  const paired = new Set(b.intake.pairs.map(p => p.myeongri));
  const mbtiBasis = (ids: readonly string[], sen: string) => ids.some(id => lineById.get(id)?.subject === "mbti" || paired.has(id)) || b.intake.pairs.some(p => overlap4(sen, p.why) >= 3);
  const keySeeds = b.intake.chapters.flatMap(c => (c.keys ?? []).filter(k => k.when === "future" && k.scene).map(k => k.scene!));
  const allSeeds = b.intake.chapters.flatMap(c => (c.keys ?? []).filter(k => k.scene).map(k => ({ key: k.key, scene: k.scene! })));
  /** key 근거 줄의 「X기 좋음·쉬움」에서 X의 끝 4자(공백·부호 뺌). */
  const goodStems = (ids: readonly string[]) => [...new Set(ids.flatMap(id => [...(lineById.get(id)?.meaning ?? "").matchAll(/([가-힣][가-힣 ]{2,14})기 (좋음|쉬움|좋아요|쉬워요|좋습니다|쉽습니다)/g)].map(m => norm(m[1]).slice(-4))).filter(x => x.length === 4))];
  const flowAll = [...(b.flows?.values() ?? [])].map(f => f.score);
  const extreme = (score: number, low: boolean) => { const e = low ? Math.min(...flowAll) : Math.max(...flowAll); return score === e && flowAll.filter(x => x === e).length === 1; };
  const flowByGanji = new Map([...(b.flows?.values() ?? [])].map(f => [f.ganji, f.score]));
  const pillar = b.dayPillar && b.dayPillar.length === 2 ? new RegExp(`${b.dayPillar[1]}${BRANCH_EL[b.dayPillar[1]] ?? ""}${TGJ}(?:가|이|는|은) [^.?!]{0,25}위에`) : null;
  const LOW = /가장 (잔잔|조용|약|낮|느리|느린|순하|순한|고요)/, HIGH = /가장 (거세|거센|세|센|강|높|크|큰|빠르|빠른|뜨겁|뜨거운)/;
  const cardText = b.intake.lines.map(l => `${l.value} ${l.meaning}`).join(" ");
  /** 카드에 「가장 ~」이 그대로 있으면(예: 「가장 조용한 달: 계축월」) 작가 말이 아니라 카드 값이다. */
  // AM2-3: 동률 줄(「흐름이 가장 잔잔한 달(같은 세기): 4월 · 갑진월, …」)은 그 줄에 이름이 든 달·해만 「가장」이 맞다.
  const onCard = (sen: string, re: RegExp, label?: string) => { const m = re.exec(sen); return Boolean(m && b.intake.lines.some(l => `${l.value} ${l.meaning}`.includes(`가장 ${m[1]}`) && (!label || !MONTH_NAME_IN.test(`${l.value} ${l.meaning}`) || `${l.value} ${l.meaning}`.includes(label)))); };
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
      for (const m of sen.matchAll(QUOTE)) { const q = m[1] ?? m[2] ?? ""; const t = QUOTE_TIME.exec(q); if (t) { add({ ...at, rule: "time_quote", detail: `대사 속 「${t[0]}」`, hint: "따옴표 대사 안에도 「지금·올해·이번 달·요즘」을 쓰지 않는다(「'2027년엔'」「'이 달은'」「'한동안'」처럼)" }); break; } }
      for (const [re, why] of GRAMMAR) if (re.test(sen)) { add({ ...at, rule: "grammar", detail: why, hint: why }); break; }
      { const w = nounPredicate(sen); if (w) add({ ...at, rule: "noun_predicate", detail: w, hint: "「X는 ~하는 시기입니다」는 비문 — 「X가 ~합니다」처럼 주어와 서술어를 맞춘다" }); }
      if (b.mbtiType && sen.includes(b.mbtiType) && !mbtiBasis(kp ? kp.lines : chapterLines, sen)) add({ ...at, rule: "evidence_owner", detail: `근거에 MBTI 줄·짝이 없는 ${kp ? kp.key : `${c.n}장`}에서 ${b.mbtiType}`, hint: "이 장·key 근거에는 MBTI가 없다 — 유형 이름을 빼고 명리 근거로만" });
      if (pillar?.test(sen)) add({ ...at, rule: "pillar_shape", detail: `일주 ${b.dayPillar}: 하늘 글자가 땅 글자 위에 앉는다`, hint: `일주는 「${b.dayPillar![0]}이 ${b.dayPillar![1]} 위에 앉은」 꼴로만` });
      if (kp) {
        if (pair) {
          const w = skyGroundIssue(sen, pair); if (w) add({ ...at, rule: "sky_ground", detail: w, hint: `머리 문장 그대로 「${pair.sky}가 하늘, ${pair.ground}가 땅」(「X 위에 Y가 앉아」 꼴은 쓰지 않는다)` });
          if ((pi === 0 && sj === 0 && sen.includes(pair.sky) && sen.includes(pair.ground) && /하늘|땅/.test(sen)) || (pi === 0 && /하늘에 있어|하늘과 땅이 모두|하늘 (정|편|비|겁|식|상)[가-힣]{1,2}(은|는)|땅의 [가-힣]{2}(은|는)|대운이 시작되/.test(sen))) add({ ...at, rule: "head_repeat", hint: "머리 문장이 이미 하늘·땅 십성(과 대운 시작)을 말했다 — 바로 다음 문장은 그 뜻·장면부터" });
        }
        const f = b.flows?.get(kp.key);
        if (f && ((LOW.test(sen) && !onCard(sen, LOW, kp.label) && !extreme(f.score, true)) || (HIGH.test(sen) && /흐름|기운|세기/.test(sen) && !onCard(sen, HIGH, kp.label) && !extreme(f.score, false)))) add({ ...at, rule: "degree", detail: `흐름 세기 ${f.score}/5는 유일한 끝값이 아니다`, hint: "카드에 없는 「가장」을 붙이지 않는다(흐름 세기 값 그대로)" });
        for (const w of small) if (sen.includes(`큰 ${w}`)) { add({ ...at, rule: "degree", detail: `카드는 「작은 ${w}」`, hint: "카드의 정도말(작은)을 바꾸지 않는다" }); break; }
        if (kp.when === "past" && !PAST_SOFT.test(sen) && PAST_DECL.test(sen) && !PAST_FACT.test(sen)) add({ ...at, rule: "past_assert", hint: "지난 때는 질문형·조건형으로만(「…했다면」「…않았나요?」)" });
        // key별 값 대조(P2 판독 annual-1 2027-M04 = 5월 · 을사월에 4월 갑진월 값이 통째로): 흐름 세기 · 하늘/땅 글자 · 다른 key의 관계 이름 · 다른 key의 장면 씨앗.
        const kh = `이 자리는 ${kp.label} — 카드 줄 ${kp.range ?? ""}에 적힌 것만(다른 달·해의 줄을 가져오지 않는다)`;
        const fm = /흐름(?: 세기)?(?:는|은|이|가)?\s*(\d)\s*\/\s*5/.exec(sen);
        if (fm && f && Number(fm[1]) !== f.score) add({ ...at, rule: "key_value", detail: `흐름 ${fm[1]}/5 — ${kp.label}은 「${FLOW_WORD[f.score]}」`, hint: kh });
        // AM2-3 1-2: 흐름은 단어로만 — 다른 세기의 단어(「흐름이 잔잔」인데 이 자리는 느림)도 달 혼동.
        { const fw = /흐름[^.?!]{0,12}?(잔잔|느린 편|느려|느림|보통|활발|거세|거센|거셈)/.exec(sen);
          if (fw && f) { const said = Object.entries(FLOW_TALK).find(([, re]) => re.test(fw[1]))?.[0]; if (said && Number(said) !== f.score) add({ ...at, rule: "key_value", detail: `흐름 「${fw[1]}」 — ${kp.label}은 「${FLOW_WORD[f.score]}」`, hint: kh }); } }
        if (pair) { const gm = new RegExp(`(하늘|땅) ?글자(?:인|의|는|가|에)? (${TG})`).exec(sen); if (gm && gm[2] !== (gm[1] === "하늘" ? pair.sky : pair.ground)) add({ ...at, rule: "key_value", detail: `${gm[1]} 글자 ${gm[2]} — ${kp.label}은 ${gm[1] === "하늘" ? pair.sky : pair.ground}`, hint: kh }); }
        { const mineRel = b.keyRels?.get(kp.key) ?? new Set<string>(); let other: string | null = null;
          for (const [k2, rels] of b.keyRels ?? []) { if (k2 === kp.key) continue; for (const r of rels) if (!mineRel.has(r) && sen.includes(r)) { other = `${r}(${labelOfKey.get(k2) ?? k2})`; break; } if (other) break; }
          if (other) add({ ...at, rule: "key_value", detail: `다른 key의 관계 ${other}`, hint: kh }); }
        for (const o of allSeeds) if (o.key !== kp.key && overlap4(sen, o.scene) >= SEED_IN_KEY && (!kp.scene || overlap4(sen, kp.scene) < SEED_IN_KEY)) { add({ ...at, rule: "key_value", detail: `다른 달·해(${labelOfKey.get(o.key) ?? o.key})의 장면 씨앗`, hint: kh }); break; }
        // 카드 생활 줄 「~기 좋음·쉬움」을 「…는 해입니다」로 못 박음(P2 판독 major-1 2033 「결과로 이어지는 해입니다」).
        if (kp.when === "future" && EVENT_END.test(sen) && !soft(sen)) for (const st of goodStems(kp.lines)) if (norm(sen).includes(`${st}는`)) { add({ ...at, rule: "future_event", detail: "카드의 「~기 좋음·쉬움」을 확정형으로", hint: "카드가 「~기 좋음」이면 「~기 좋은 해예요」처럼 그 꼴 그대로" }); break; }
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
        if (mine) for (const [key, set] of months) if (key !== s.heading && hit(sen, set, 12) && !hit(sen, mine, 12)) { add({ ...at, rule: "month_line", detail: `${labelOfKey.get(key) ?? key}의 근거 줄` }); break; }
      }
      const ms = monthsIn(sen);
      if (ms.size && !anyList.some(set => [...ms].every(m => set.has(m)))) for (const l of lists) if (l.cue.test(sen) && [...ms].some(m => !l.months.has(m))) {
        if (/(달|때)(은|는|이|가)? [^.?!]{0,30}(이에요|입니다|예요)|(오르|늦추|새|무리|쉬어)[^.?!]{0,10}달/.test(sen)) { add({ ...at, rule: "month_list", detail: `달 목록이 카드와 다름(카드: ${[...l.months].join("·")})` }); break; }
      }
      if (b.yearsToNextDayun !== undefined && b.yearsToNextDayun > 2 && /곧[^.?!]{0,24}대운(으로|이|에)? ?(넘어가|바뀌|들어가|시작|열리)/.test(sen)) add({ ...at, rule: "dayun_soon", detail: `다음 대운까지 ${b.yearsToNextDayun}년` });
    }
  }));
  for (const f of rootFlags(chapters, b)) add(f);
  return out;
}

/**
 * AM2-3 4부 — 판독 두 건(P2 annual-1 · major-1)의 「결정론 검사로 잡을 수 있는 꼴」과 지시 목록(결정론, 호출 0). blockFlags가 부른다.
 * 꼴 하나에 사전 하나: 관계 뜻 사전 · 신살 자리 · 근거 주인(MBTI 뜻 → 명리 주어) · 짝 없는 연결 · 앞날·결과 단정 · 「-던」 전제 · 소제목 꼴 ·
 * 지난 대운 나이 × 직장 · 화살표 직역 · 작성 메모 · 장 첫 문장 소품 연속 · 반드시 쓸 것 · 근거 범위 · 소망 인용 · MBTI 미입력 · 영역 나열 · 숫자 흐름 · 다른 달 관계 뜻.
 */
type KeyPlanLike = { readonly key: string; readonly label: string };
export function rootFlags(chapters: readonly FinalChapter[], b: BlockCtx): ChunkFlag[] {
  const out: ChunkFlag[] = [];
  const x = b.intake, plans = new Map(x.chapters.map(c => [c.n, c])), lineById = new Map(x.lines.map(l => [l.id, l]));
  const keyPlans = new Map(x.chapters.flatMap(c => (c.keys ?? []).map(k => [k.key, k] as const)));
  const relMeaning = (key: string) => { const kp = keyPlans.get(key); const m = new Map<string, string>(); for (const id of kp?.lines ?? []) { const l = lineById.get(id); const nm = l?.value.match(/(?:월|년) ([가-힣]{2,4}(?:합|충|형|파|해|국)|원진|공망)(?:\(|$)/)?.[1]; if (l && nm) m.set(nm, l.meaning); } return m; };
  // 신살·운성 자리(값 「백호대살(태어난 달 · 임술)」).
  const seats = x.lines.filter(l => l.subject === "natal").map(l => { const m = /^([가-힣]{2,6})\((태어난 (?:해|달|날|시각))(?: · ([가-힣]{2}))?\)$/.exec(l.value); return m ? { name: m[1], short: m[1].length >= 4 && /살$/.test(m[1]) ? m[1].slice(0, 2) : m[1], seat: m[2], ganji: m[3] as string | undefined } : null; }).filter(<T,>(v: T | null): v is T => v !== null).filter(v => /살$|귀인$/.test(v.name));
  // 근거 범위(2-3): 일주 이름 · 신살·귀인 이름이 쓰는 장 밖에서.
  const scoped = x.lines.filter(l => l.subject === "natal").map(l => { const nm = l.value.replace(/\(.*\)$/, "").trim(); return { id: l.id, nm, use: new Set(l.use) }; })
    .filter(v => (b.dayPillar && v.nm === b.dayPillar) || /살$|귀인$/.test(v.nm));
  const pairWhys = x.pairs.map(p => p.why);
  const bWindows = new Set<string>(); for (const l of x.lines) if (l.subject === "mbti") for (const w of windows(l.meaning, 8)) bWindows.add(w);
  for (const w of [...bWindows]) if (pairWhys.some(pw => norm(pw).includes(w))) bWindows.delete(w);
  const MY_WORD = new RegExp(`(${TG})|대운|세운|하늘 글자|땅 글자|[갑을병정무기경신임계][자축인묘진사오미신유술해](월|년|일주)|도울 달|(살|귀인)(이|은|는|의)`);
  const MY_SUBJECT = new RegExp(`^(${TG}|[가-힣]{2,4}(살|귀인)|[갑을병정무기경신임계][자축인묘진사오미신유술해](일주|월|년)?|대운|이 대운)(${TGJ})?(은|는|이|가|의) `);
  const mbtiWord = b.mbtiAnchor ? new RegExp(`${b.mbtiAnchor.source}|가장 센 쪽|두 번째로 쓰는 쪽|가장 늦게 자라는`) : null;
  const cardText = x.lines.map(l => `${l.value} ${l.meaning}`).join(" ");
  let prevOpenProp = false;
  for (const c of chapters) {
    if (c.source === "deterministic") continue;
    const plan = plans.get(c.n);
    const chapterPairs = x.pairs.filter(p => !p.use || p.use.includes(c.n));
    // 장 첫 문장 소품 연속(3-1).
    if (!c.keys) {
      const first = (c.sections[0]?.paragraphs[0] ? splitSentences(c.sections[0].paragraphs[0])[0] ?? "" : "").replace(/[⟪⟫]/g, "");
      const isProp = Boolean(first) && (PROP_OPEN.test(first) || (plan?.scenes ?? []).some(sc => overlap4(first, sc) >= 5));
      if (isProp && prevOpenProp) out.push({ chapter: c.n, section: 0, paragraph: 0, rule: "opening_prop", sentence: first, hint: "앞 장도 소품·장면으로 열었다 — 이 장은 질문의 답(근거 하나)으로 연다" });
      prevOpenProp = isProp;
    }
    c.sections.forEach((s, si) => {
      const kp = c.keys?.includes(s.heading) ? keyPlans.get(s.heading) : undefined;
      const at0 = { chapter: c.n, section: si };
      // 소제목 꼴(2-5).
      if (!kp && s.heading && (HEADING_PAST.test(s.heading) || (HEADING_ASSERT.test(s.heading) && !HEADING_SOFT.test(s.heading)))) out.push({ ...at0, paragraph: -1, rule: "heading_form", sentence: s.heading, hint: "소제목은 물음이나 카드의 꼴(경향 「~하기 쉬운」·조건 「~라면」)로 — 결과를 못 박거나 지난 일을 굳히지 않는다" });
      // 반드시 쓸 것(2-4).
      if (kp?.must?.length) { const body = s.paragraphs.join(" "); const miss = kp.must.filter(m => !new RegExp(m.re).test(body)); if (miss.length) out.push({ ...at0, paragraph: -3, rule: "must_miss", sentence: `[반드시 쓸 것] ${kp.label}: ${miss.map(m => m.what).join(" / ")}`, hint: `${kp.label} 본문에 빠졌다: ${miss.map(m => m.what).join(" / ")} — 카드 줄의 그 뜻을 한 번씩` }); }
      // 영역 나열(2-6).
      if (kp) { const n = new Set([...s.paragraphs.join(" ").matchAll(DOMAIN_LEAD)].map(m => m[1])).size; if (n >= 3) { const pi = s.paragraphs.findIndex(p => (p.match(DOMAIN_LEAD) ?? []).length >= 2) ; const p = s.paragraphs[Math.max(0, pi)] ?? ""; out.push({ ...at0, paragraph: Math.max(0, pi), rule: "domain_list", sentence: splitSentences(p).find(x2 => DOMAIN_LEAD.test(x2)) ?? p.slice(0, 80), detail: `영역 ${n}개 나열`, hint: "「일에서는… 돈에서는… 관계에서는…」 나열 금지 — 핵심 하나 + 장면 하나 + 행동 하나" }); DOMAIN_LEAD.lastIndex = 0; } }
      const rels = kp ? relMeaning(kp.key) : new Map<string, string>();
      // 다른 달·해 관계의 뜻(어간 셋 이상 겹침, 이 자리 카드에는 없음 — P2 판독 annual-1 6월 「발이 덜 걸립니다」).
      const mineStems = kp ? stemsOf(kp.lines.map(id => `${lineById.get(id)?.value ?? ""} ${lineById.get(id)?.meaning ?? ""}`).join(" ")) : new Set<string>();
      // 이 자리 카드가 가리키는 앞 달·해의 줄은 써도 된다: 「X의 뜻은 앞의 ○과 같은 결」 → 그 달의 X 글자 줄, 「○과 같은 생활 결」 → 그 달의 생활 줄(관계 줄은 아니다).
      const pointers = kp ? kp.lines.map(id => lineById.get(id)?.meaning ?? "") : [];
      const allowedOther = (o: KeyPlanLike, l: Line) => pointers.some(m => (m.includes(`앞의 ${o.label}`) && / 글자 /.test(l.value) && m.startsWith(`${l.value.replace(/^.* 글자 /, "").replace(/\(.*$/, "")}의 뜻`)) || (m.includes(`${o.label}과 같은 생활 결`) && / 생활$/.test(l.value)));
      const otherRel = kp ? [...keyPlans.values()].filter(o => o.key !== kp.key).flatMap(o => o.lines.map(id => lineById.get(id)).filter((l): l is Line => Boolean(l) && l!.subject === (kp.key.includes("-M") ? "month" : "year") && !/같은 결|흐름이 [가-힣]+ 편|영역 흐름/.test(l!.meaning) && !allowedOther(o, l!)).map(l => ({ key: o.key, label: o.label, nm: l.value.replace(`${o.label} `, ""), st: stemsOf(l.meaning) }))) : [];
      s.paragraphs.forEach((p, pi) => splitSentences(p).forEach(raw => {
        const sen = raw.replace(/[⟪⟫]/g, ""), at = { ...at0, paragraph: pi, sentence: sen };
        // 관계 동사(뜻 사전).
        if (kp) {
          const named = [...rels.keys()].filter(nm => sen.includes(nm)), kinds = new Set(named.map(relKind).filter(Boolean));
          if (named.length) {
            const own = named.map(nm => rels.get(nm) ?? "").join(" ");
            for (const [j, re] of Object.entries(REL_VERB) as [RelKind, RegExp][]) if (!kinds.has(j) && re.test(sen) && !re.test(own)) { out.push({ ...at, rule: "rel_verb", detail: `${named.join("·")}에 ${j}의 말 「${sen.match(re)![0]}」`, hint: "관계마다 그 이름의 뜻만: 합 맺힘·묶임, 충 부딪침, 형 눌러 다듬음, 파 어긋남, 해 방해" }); break; }
            // 관계 둘 이상을 한 문장에 묶었는데 한쪽 뜻만 썼다(P2 판독 annual-1 6월 「지지형과 … 화국 … 표현과 열정이 모입니다」).
            if (named.length >= 2) { const sst = stemsOf(sen), hits = named.map(nm => [...stemsOf(rels.get(nm) ?? "")].filter(x2 => sst.has(x2)).length); if (hits.some(h => h === 0) && hits.some(h => h > 0)) out.push({ ...at, rule: "rel_mix", detail: `${named.join("·")}를 한 뜻으로`, hint: "관계마다 그 이름과 그 뜻을 따로 — 둘을 한 뜻으로 묶지 않는다" }); }
            // 뜻 섞기: 이 자리의 다른 관계 뜻 어간 둘 이상.
            const ownSt = stemsOf(own);
            for (const [nm2, mean2] of rels) { if (named.includes(nm2)) continue; const hitSt = [...stemsOf(mean2)].filter(x2 => !ownSt.has(x2) && stemsOf(sen).has(x2)); if (hitSt.length >= 2) { out.push({ ...at, rule: "rel_mix", detail: `${named.join("·")} 문장에 ${nm2}의 뜻(${hitSt.join("·")})`, hint: `${named.join("·")}에는 그 줄의 뜻만 — ${nm2}의 뜻을 섞지 않는다` }); break; } }
          }
          { const sst = stemsOf(sen); for (const o of otherRel) { const h = [...o.st].filter(x2 => sst.has(x2) && !mineStems.has(x2)); if (h.length >= 3) { out.push({ ...at, rule: "key_value", detail: `다른 달·해(${o.label})의 ${o.nm} 뜻(${h.join("·")})`, hint: `이 자리는 ${kp.label} — 카드 줄 ${kp.range ?? ""}에 적힌 것만` }); break; } } }
        }
        // 신살 자리.
        for (const sh of seats) {
          const i = sen.indexOf(sh.short); if (i < 0) continue;
          const win = sen.slice(Math.max(0, i - 20), i + sh.short.length + 20);
          if (new RegExp(`${sh.short}[가-힣]{0,2}(은|는|이|가)? ${sh.seat}에도`).test(sen)) { out.push({ ...at, rule: "seat_claim", detail: `${sh.name}는 ${sh.seat} 한 자리`, hint: `${sh.name}는 ${sh.seat}${sh.ganji ? `(${sh.ganji})` : ""}에만 있다 — 다른 자리를 말하지 않는다` }); break; }
          let bad: string | null = null;
          for (const m of win.matchAll(SEAT_WORD)) { const w = m[0]; const seat = /^태어난/.test(w) ? w : /일주$/.test(w) && w.length === 4 ? (sh.ganji && w.startsWith(sh.ganji) ? sh.seat : "태어난 날") : SEAT_OF[w] ?? null; if (seat && seat !== sh.seat) { bad = w; break; } }
          if (bad) { out.push({ ...at, rule: "seat_claim", detail: `${sh.name} 자리 「${bad}」 — 카드는 ${sh.seat}`, hint: `${sh.name}는 ${sh.seat}${sh.ganji ? `(${sh.ganji})` : ""} 자리 그대로` }); break; }
        }
        // 근거 범위(2-3).
        for (const v of scoped) if (!v.use.has(c.n) && (v.nm === b.dayPillar ? new RegExp(`${v.nm}(일주|\\(|의 |는 |가 |이 )`).test(sen) : sen.includes(v.nm))) { out.push({ ...at, rule: "evidence_scope", detail: `${v.nm}(${v.id})는 ${[...v.use].join("·")}장 근거`, hint: `이 장 근거 밖의 「${v.nm}」 — 이 장의 「쓸 수 있는 근거」로만` }); break; }
        // 근거 주인 반대쪽: MBTI 근거의 뜻을 명리 주어로.
        if (mbtiWord && MY_SUBJECT.test(sen) && !mbtiWord.test(sen)) { const w = hit(sen, bWindows, 8); if (w) out.push({ ...at, rule: "owner_reverse", detail: `MBTI 근거의 뜻 「${w}」를 명리 주어로`, hint: "MBTI 근거의 뜻은 MBTI 주어로만 — 명리 이름의 성질로 옮기지 않는다" }); }
        // 짝 없는 연결.
        if (mbtiWord && mbtiWord.test(sen) && MY_WORD.test(sen) && !chapterPairs.some(pp => overlap4(sen, pp.why) >= 3)) out.push({ ...at, rule: "pair_link", detail: chapterPairs.length ? "이 장의 짝과 다른 연결" : "이 장에는 명리×MBTI 짝이 없다", hint: chapterPairs.length ? `명리와 MBTI는 이 장의 짝(${chapterPairs.map(pp => pp.id).join("·")}) 이유 그대로만 잇는다` : "이 장에서는 명리와 MBTI를 한 문장에서 잇지 않는다(문장을 나눠 각자 근거로)" });
        // 짝 이유·원국 성질을 그 해·달의 성질로(「그래서 …는 해예요」).
        if (!kp && YEAR_END.test(sen) && !soft(sen)) {
          if (x.pairs.some(pp => overlap4(sen, pp.why) >= 3) || (b.dayPillar && new RegExp(`${b.dayPillar}(일주|\\()`).test(sen)) || seats.some(sh => sen.includes(sh.short)))
            out.push({ ...at, rule: "pair_link", detail: "원국·MBTI의 성질을 그 해의 성질로", hint: "원국·MBTI의 성질은 그 사람의 성질 — 「…되는 해예요」로 바꾸지 않는다(그 해는 세운 카드의 말로)" });
        }
        if (PARTNER_PREMISE.test(sen) && /^(single|unknown)$/.test(x.person.find(pp => pp.startsWith("연애:"))?.match(/솔로|미입력/) ? "single" : "")) out.push({ ...at, rule: "future_assert", detail: sen.match(PARTNER_PREMISE)![0], hint: "인물 카드는 솔로·미입력 — 이미 있는 인연을 전제하지 않는다(「인연이 생긴다면」처럼 조건형)" });
        // 카드에 없는 정도말(3-3): 「가장 X」「한층」「훨씬」 — 그 꼴이 카드 원문에 있을 때만.
        { const dm = /(가장|한층|훨씬) ([가-힣]{1,2})/.exec(sen); if (dm && !cardText.includes(`${dm[1]} ${dm[2]}`) && !/가장 (먼저|마지막|늦게|가까운)/.test(sen)) out.push({ ...at, rule: "degree", detail: `「${dm[0]}」 — 카드에 없는 정도말`, hint: "정도말(가장·한층·훨씬)은 카드 원문에 있을 때만 — 빼고 카드 값 그대로" }); }
        // MBTI 미입력.
        if (!b.mbtiType && /(?<![A-Z])(I|E)(N|S)(T|F)(J|P)(?![A-Z])|MBTI/.test(sen)) out.push({ ...at, rule: "mbti_absent", hint: "MBTI를 적지 않은 책 — MBTI 문장을 쓰지 않는다" });
        // 앞날·결과 단정.
        const past = kp?.when === "past" || plan?.id === "past";
        if (!past && FUTURE_ASSERT.test(sen) && !soft(sen)) out.push({ ...at, rule: "future_assert", detail: sen.match(FUTURE_ASSERT)![0], hint: "앞날·결과·남의 반응을 못 박지 않는다 — 카드 꼴(「~하기 좋은」「~하기 쉬운」)이나 조건형으로" });
        else if (kp?.when === "future" && FUTURE_IN_KEY.test(sen) && !soft(sen) && !/흐름|기운|쪽|마음이/.test(sen)) out.push({ ...at, rule: "future_assert", detail: sen.match(FUTURE_IN_KEY)![0], hint: "앞날 일이 생긴다고 못 박지 않는다 — 「~하기 쉬운 때예요」처럼" });
        if (PAST_PREMISE.test(sen) && !PAST_SOFT.test(sen)) out.push({ ...at, rule: "past_premise", detail: sen.match(PAST_PREMISE)![0], hint: "카드에 없는 지난 행동을 「-던」으로 전제하지 않는다 — 앞으로 할 일로 쓴다" });
        // 지난 대운 나이 × 직장 낱말(대운 2장 둘째 절).
        if (plan?.id === "past" && si === 1 && (b.prevDayunEndAge ?? 99) < 22 && WORKPLACE.test(sen)) out.push({ ...at, rule: "past_work", detail: `지난 대운은 만 ${b.prevDayunEndAge}세 무렵까지 — 「${sen.match(WORKPLACE)![0]}」`, hint: "지난 대운은 만 22세 전 — 직장·동료 장면을 쓰지 않는다(학교 밖 일상·마음으로)" });
        if (ARROW_LITERAL.test(sen)) out.push({ ...at, rule: "arrow_literal", hint: "화살표를 말로 옮기지 않는다 — 「연애 쪽 기운이 오르는 해」처럼" });
        if (META_TRACE2.test(sen)) out.push({ ...at, rule: "meta_trace", detail: sen.match(META_TRACE2)![0], hint: "작성 메모·내부 말을 본문에 쓰지 않는다" });
        if (/\d\s?\/\s?(5(?![0-9])|다섯)/.test(sen) && /흐름|세기|기운/.test(sen)) out.push({ ...at, rule: "key_value", detail: "흐름 숫자", hint: "흐름은 숫자(「3/5」) 대신 카드의 말(「흐름이 보통인 편」)로" });
        // 소망 인용(3-2): «바람» 표시만.
        for (const m of sen.matchAll(/«([^»]*)»/g)) if (`«${m[1]}»` !== WISH_MARK) { out.push({ ...at, rule: "wish_quote", detail: `«${m[1].slice(0, 20)}»`, hint: `바람을 인용할 때는 ${WISH_MARK} 네 글자만(시스템이 원문을 넣는다)` }); break; }
      }));
    });
  }
  return out;
}

/**
 * 장 사이 반복(모든 묶음 뒤): 앞 장의 문장과 5-gram 자카드 0.5 이상이거나 공백·부호 뺀 14자가 같은 뒤 장의 문장(작가 장만, 같은 장 안의 비슷한 문장은 보지 않는다).
 * 묶음은 병렬로 쓰여 서로를 보지 못하므로, 겹치면 뒤쪽 장의 묶음을 1회 다시 쓴다.
 */
export function crossRepeats(chapters: readonly FinalChapter[]): ChunkFlag[] {
  // 단위 = 장(key 없는 장) 또는 key(달·해 장의 key마다 — P2 판독: 같은 십성 달끼리 생활 문장을 그대로 되풀이). 같은 단위 안의 비슷한 문장은 보지 않는다.
  const out: ChunkFlag[] = [], idx = L.overlapIndex(), phrase = new Map<string, string>();
  const flush = (unit: string, mine: readonly string[]) => { for (const sen of mine) { idx.add(sen); const n = norm(sen); for (let i = 0; i + 14 <= n.length; i++) if (!phrase.has(n.slice(i, i + 14))) phrase.set(n.slice(i, i + 14), unit); } };
  for (const c of chapters) {
    if (c.source === "deterministic") continue;
    let buf: string[] = [];
    c.sections.forEach((s, si) => {
      const isKey = Boolean(c.keys?.includes(s.heading)), unit = isKey ? `${c.n}:${s.heading}` : `${c.n}`, mine: string[] = [];
      s.paragraphs.forEach((p, pi) => { for (const raw of splitSentences(p)) {
        const sen = raw.replace(/[⟪⟫]/g, ""), n = norm(sen); mine.push(sen);
        let w: string | null = null; for (let i = 0; i + 14 <= n.length && !w; i++) { const x = phrase.get(n.slice(i, i + 14)); if (x !== undefined && x !== unit) w = n.slice(i, i + 14); }
        if (w || idx.has(sen)) out.push({ chapter: c.n, section: si, paragraph: pi, rule: "chapter_repeat", sentence: sen, detail: w ? `앞 장·key와 같은 구절 「${w}」` : "앞 장·key와 거의 같은 문장", hint: "다른 장·key가 이미 쓴 말 — 이 장·key의 근거·장면으로 바꿔 쓴다" });
      } });
      if (isKey) flush(unit, mine); else buf = [...buf, ...mine];
    });
    if (buf.length) flush(`${c.n}`, buf);
  }
  return out;
}

/**
 * 같은 처방·상투구 되풀이(P2 판독: 쉬기·잠 5곳, 하룻밤 5곳, 월급날 3곳, 「모습이 어울려요」 12~16회, 「반대로」 6회, 「한 줄·한마디」 6회).
 * AM2-3 3-3 상한: 처방 묶음은 책에서 한 번 · 「모습이 어울려요」 책 4회·장 1회 · 「반대로」 책 2회 — 넘는 곳을 장 사이 반복 고침으로 넘긴다.
 */
const ADVICE: readonly (readonly [string, RegExp])[] = [
  ["쉬는 날·잠", /쉬는 날|회복하는 날|쉬어 가는 날|잠(을|부터)|자는 시간|일찍 자|기상 시간/],
  ["하룻밤·하루 묵히기", /하룻밤|하루 (두고|뒤에|묵혀|지나)|한 박자/],
  ["월급날", /월급날|이체 알림/],
  ["끝까지 듣기", /끝까지 듣|먼저 들어 보/],
  ["적어 보기", /(이름|한 줄|세 줄|목록)[^.?!]{0,10}적어 (보세요|두세요)/],
  ["한 줄·한마디", /한 줄(만|로|씩)? (남겨|보내|적|써)|한마디(만|를)? (남겨|건네|보내)/],
  ["끝낼 일 하나", /끝낼 일 (하나|한 가지)|하나만 (먼저 )?끝내/],
];
const FRAME = /모습이 어울(려요|립니다|리는)/;
const CONTRA = /^반대로[ ,]/;
export function adviceRepeats(chapters: readonly FinalChapter[]): ChunkFlag[] {
  const out: ChunkFlag[] = [], seen = new Map<string, number>();
  let frames = 0, contra = 0;
  for (const c of chapters) {
    if (c.source === "deterministic") continue;
    let framesHere = 0;
    c.sections.forEach((s, si) => s.paragraphs.forEach((p, pi) => { for (const raw of splitSentences(p)) {
      const sen = raw.replace(/[⟪⟫]/g, "");
      const hit = ADVICE.find(([, re]) => re.test(sen));
      if (hit) { const n = (seen.get(hit[0]) ?? 0) + 1; seen.set(hit[0], n); if (n > 1) out.push({ chapter: c.n, section: si, paragraph: pi, rule: "advice_repeat", sentence: sen, detail: `같은 처방 「${hit[0]}」 ${n}번째`, hint: "같은 처방은 책에서 한 번 — 이 근거에 맞는 다른 행동으로(설계도 「할 일 씨앗」)" }); }
      if (FRAME.test(sen)) { frames++; framesHere++; if (frames > 4 || framesHere > 1) out.push({ chapter: c.n, section: si, paragraph: pi, rule: "advice_repeat", sentence: sen, detail: `「모습이 어울려요」 책 ${frames}번째 · 장 ${framesHere}번째`, hint: "앞날 받는 틀을 돌려 쓴다(「…해 보기 좋은 때예요」「…라면 …해 보세요」「…쪽으로 마음이 기울기 쉬워요」)" }); }
      if (CONTRA.test(sen) && ++contra > 2) out.push({ chapter: c.n, section: si, paragraph: pi, rule: "advice_repeat", sentence: sen, detail: `「반대로」 ${contra}번째`, hint: "「반대로」는 앞 문장과 뜻이 맞설 때만 — 다른 이음말이나 이음말 없이" });
    } }));
  }
  return out;
}

/**
 * AM2-3 4부 반복 — 같은 문장·같은 뜻 연속(이웃 문장, 문단 안과 문단 사이): 정확히 같음 · 앞 두 어절이 같음(네 어절 이상) · 여덟 어절 이상 겹침 · 4자 창 자카드 0.5 이상.
 * 장 사이 반복(crossRepeats)이 보지 않는 같은 단위 안의 되풀이다. 다시 쓰기 뒤에도 남으면 뒤 문장을 지운다(publish).
 */
export function adjacentRepeats(chapters: readonly FinalChapter[], cardValues: readonly string[] = []): ChunkFlag[] {
  const out: ChunkFlag[] = [];
  const words = (t: string) => t.replace(/[^가-힣A-Za-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
  const jac = (a: string, b: string) => { const A = windows(a, 4), B = windows(b, 4); if (!A.size || !B.size) return 0; let n = 0; for (const w of A) if (B.has(w)) n++; return n / (A.size + B.size - n); };
  // 카드 값(이름·자리·관계 이름)은 여러 문장에 되풀이돼도 된다 — 10자 창 겹침에서 뺀다.
  const valueWin = new Set<string>(); for (const v of cardValues) for (const w of windows(v, 10)) valueWin.add(w);
  for (const c of chapters) {
    if (c.source === "deterministic") continue;
    c.sections.forEach((s, si) => {
      const before: string[] = [];
      s.paragraphs.forEach((p, pi) => { for (const raw of splitSentences(p)) {
        const sen = raw.replace(/[⟪⟫]/g, "");
        const prev = before.at(-1);
        let why: string | null = null;
        if (prev !== undefined) {
          const a = words(prev), bw = words(sen), shared = bw.filter(w => w.length >= 2 && a.includes(w)).length;
          why = norm(prev) === norm(sen) ? "같은 문장" : a.length >= 4 && bw.length >= 4 && a[0] === bw[0] && a[1] === bw[1] ? "앞 두 어절이 같음" : shared >= 8 ? `${shared}어절 겹침` : jac(prev, sen) >= 0.5 ? "같은 뜻 연속" : null;
        }
        // 같은 소제목·key 안의 앞 문장과(이웃이 아니어도): 같은 문장 · 자카드 0.5 · 카드 값 아닌 10자 구절.
        if (!why) for (const q of before.slice(0, -1)) { if (norm(q) === norm(sen) || jac(q, sen) >= 0.5) { why = "같은 소제목 안 같은 뜻"; break; } const w = hit(sen, new Set([...windows(q, 10)].filter(x => !valueWin.has(x))), 10); if (w) { why = `같은 소제목 안 같은 구절 「${w}」`; break; } }
        if (why) out.push({ chapter: c.n, section: si, paragraph: pi, rule: "rep_adjacent", sentence: sen, detail: why, hint: "같은 소제목 안 앞 문장과 같은 말 — 새 근거·장면·행동으로 바꾸거나 뺀다" });
        before.push(sen);
      } });
    });
  }
  return out;
}

/** 문체 점수(고치지 않는다): 규칙별 수. */
export const styleScoreOf = (lint: readonly LintFlag[]) => lint.filter(f => !BLOCK_RULES.has(f.rule) && !REPEAT_RULES.has(f.rule)).reduce<Record<string, number>>((o, f) => ({ ...o, [f.rule]: (o[f.rule] ?? 0) + 1 }), {});
