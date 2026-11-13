/**
 * AM2 검사(결정론, 호출 0).
 * 1) 브리프 검사: 작가에게 갈 글(인물 카드·근거 카드·짝·설계도) 전부를 고객 문장 검사(시점 말·면책 꼴·내부 용어·약어·한자·금지 비유)에 통과시킨다.
 *    하나라도 걸리면 작가를 부르지 않는다(실패 처리).
 * 2) 차단 검사: 묶음 원고의 차단 결함(사실·시점·면책·내부 용어·입력 불일치·근거 주인·달 근거·대운 위치·비문·고아). 걸리면 그 묶음을 다시 쓴다.
 *    장 사이 반복은 모든 묶음이 끝난 뒤 따로(뒤쪽 묶음만 1회). 문체 깃발은 고치지 않고 점수로만.
 */
import { inputsOf, premiseHits } from "@/lib/brief/premise";
import { dayunOrderIssues } from "./accept";
import * as L from "../safety/lint";
import * as D from "../safety/p6d";
import * as E from "../safety/p6e";
import { RURAL_PROP, splitSentences } from "../safety/patterns";
import { HARD_RULES, type LintFlag } from "../safety/p6c";
import { INTERNAL, INTERNAL_LABEL } from "../safety/sentences";
import type { FinalChapter } from "../safety";
import { am28Flags } from "./check8";
import type { Intake, Line } from "./intake";
import { KEY_TARGET, relationshipOf, RESIDENCE_PREMISE, STAGE_RE, WISH_MARK } from "./intake";
import { WORKPLACE } from "./card";
import { FLOW_TALK, FLOW_WORD, josa } from "@/lib/brief/labels";
import type { Brief } from "@/lib/brief/schema";
import { coreOf, coreRowLine, relName, seatShort } from "@/lib/brief/core";
import { rxKindsOf, rxOfSentence, type RxKind } from "@/lib/brief/prescriptions";


// ---------- 1) 브리프 검사 ----------
export type BriefIssue = { readonly where: string; readonly text: string; readonly rule: "time" | "notice" | "internal" | "abbr" | "hanja" | "metaphor" | "symbol"
  // AM2-3 1-2·2-1·2-3: 카드 문구 자체를 고객 문장 검사에.
  | "noun_value" | "unit" | "tie" | "template" | "month_label" | "general" | "mbti_absent" | "premise" | "plan_basis" | "plan_conflict" | "yinyang" | "screen" | "rest_conflict"
  // AM2-4 3부·2부: 카드 ≡ 엔진 · 짝 없는 절 · 할 것·피할 것 행동 줄 · 바람 달 충돌 · 동음 · 화면 「뜻」 길이.
  | "card_engine" | "pair_section" | "plan_advice_only" | "wish_conflict" | "homonym" | "screen_len" };
/** 브리프 검사 문맥(엔진 값): 음양 수 · 흐름 끝값 달(동률 판정) · 화면 카드 글(배지·카드 줄·꼬리표). */
export type BriefCtx = { readonly yin?: number; readonly yang?: number; readonly flowEnds?: { readonly high: readonly string[]; readonly low: readonly string[] }; readonly screen?: readonly { readonly where: string; readonly text: string }[]; readonly brief?: Brief };
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
    // AM2-4 3부: 십이운성 한자 꼴(「쇠(衰)」)은 카드 값이다(한자 규칙에서 뺀다).
    const t = text.replace(/«[^»]*»/g, "«»").replace(STAGE_RE, "$1");
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
      // AM2-5 2부: 가리키기 절은 앞 장 주장 줄(pointerIds)이 근거다(그 목록을 다시 적지 않을 뿐).
      const basis = [...sp.lines, ...(sp.pointerIds ?? [])].map(id => { const l = byId.get(id); return l ? `${l.value} ${l.meaning}` : ""; }).join(" ");
      for (const [q, cue] of QUESTION_CUES) if (q.test(sp.q) && !cue.test(basis) && !x.noDayun) flag("plan_basis", `${c.n}장 「${sp.q}」`, `근거에 ${cue.source} 없음`);
      if (noMbti && MBTI_WORD.test(sp.q)) flag("mbti_absent", `${c.n}장 소제목 틀`, sp.q);
      if (x.noDayun && x.product === "annual_fortune" && /대운/.test(sp.q)) flag("plan_basis", `${c.n}장 「${sp.q}」`, "대운을 정하지 못한 세운 책에 대운 질문");
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
  if (bc.brief) for (const i of cardEngineIssues(x, bc.brief)) out.push({ where: i.where, rule: i.rule, text: i.text.slice(0, 160) });
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
export const BLOCK_RULES: ReadonlySet<string> = new Set<string>([...HARD_RULES, "mbti_trait", "notice_repeat", "awkward", "fn_join", "code_leak", "abbr_leak", "evidence_owner", "month_line", "month_list", "dayun_soon",
  // AM2 P 판독(2026-11-11)에서 자동 검사가 못 본 유형: 앞날 확정 · 하늘·땅 뒤바뀜 · 일주 꼴 · 정도말 · 지난 일 단정 · 명사구 비문 · 읽기 지시 · 시점 말 · 머리 문장 되풀이.
  "future_event", "sky_ground", "pillar_shape", "degree", "past_assert", "noun_predicate", "reader_directive", "time_extra", "head_repeat",
  // P2 판독(2026-11-11): key별 값 대조 · 따옴표 속 시점 말 · 작은 비문.
  "key_value", "time_quote", "grammar",
  // AM2-3 4부: 관계 동사·뜻 섞임 · 신살 자리 · 근거 주인(MBTI 뜻 → 명리 주어) · 짝 없는 연결 · 앞날·지난 일 단정 사전 · 소제목 꼴 · 지난 대운 나이 × 직장 · 화살표 직역 ·
  // 작성 메모 · 뜻 기준 면책 · 장 첫 문장 소품 연속 · 반드시 쓸 것 · 근거 범위 · 소망 인용.
  "rel_verb", "rel_mix", "seat_claim", "owner_reverse", "pair_link", "future_assert", "past_premise", "heading_form", "past_work", "arrow_literal",
  "meta_trace", "notice_meaning", "opening_prop", "must_miss", "evidence_scope", "wish_quote", "mbti_absent", "domain_list",
  // AM2-4 5부: P3 판독 두 건의 결정론 꼴(자리 = 엔진 배지 · key 십성 · 개수 말 · 동음 · 카드 값 꼴 · 관계 주어 비문 · 겪을 일 단정 · 바람 없음 · 관계 틀 비문 · 카드 줄 인과).
  "seat_badge", "key_tengod", "count_claim", "homonym", "label_leak", "subject_unit", "habit_assert", "wish_absent", "relation_frame", "tg_join",
  "head_echo", "angle_name", "pointer_expand", "screen_repeat", "orphan_ref",
  // AM2-5 2부: P4 판독 두 건의 결정론 꼴 가운데 구조로 막히지 않는 것(근거 밖 관계 이름 · 달 목록 범위 말 · 작가 규칙 문구 · 읽는 날 마감 · 지난 경험 물음 · 짧은 key).
  "relation_scope", "month_range", "rule_echo", "date_deadline", "past_question", "key_len",
  // AM2-7: 입력 상태 말 · 바람 자리 · 대운 순서.
  "input_state", "dayun_order", "pair_text"]);
/** 경미 규칙: 그 묶음을 다른 까닭으로 다시 쓸 때만 함께 고치게 하고, 그것만으로는 다시 쓰지도 지우지도 않는다(판독 기준 경미). */
export const PIGGYBACK_RULES: ReadonlySet<string> = new Set<string>(["head_repeat", "head_echo", "angle_name", "pointer_expand"]);
/** AM2-4 1부·5부: 지우기만 하는 규칙(그것만으로는 다시 쓰지 않는다 — 화면 사실 되풀이는 그 문장을 지워도 화면에 남는다). 다시 쓸 때는 함께 넘긴다. */
export const CUT_ONLY_RULES: ReadonlySet<string> = new Set<string>(["screen_repeat"]);
/** 문장이 없는 깃발(지울 문장이 없다 — 다시 쓰기로만 고친다). paragraph = -3. */
export const NO_SENTENCE_RULES: ReadonlySet<string> = new Set<string>(["must_miss"]);
/** 장 사이 반복(모든 묶음 뒤 결정론, 뒤쪽 묶음만 1회 다시 쓴다). */
export const REPEAT_RULES: ReadonlySet<string> = new Set<string>(["phrase_repeat", "scene_repeat", "meaning_repeat", "prior_overlap", "closing_repeat", "rep_adjacent", "advice_repeat", "chapter_repeat"]);
/** AM2-5 2부: 경미 규칙 전부 — 지우지 않고 점수로만 기록한다(그 묶음을 다른 까닭으로 고칠 때만 함께 넘긴다). */
export const MINOR_RULES: ReadonlySet<string> = new Set<string>([...PIGGYBACK_RULES, ...CUT_ONLY_RULES, ...REPEAT_RULES, "rx_repeat", "ending_cap", "promise_tail", "domain_opener", "angle_leak", "advice_repeat_sec", "rx_repeat_sec"]);
const BLOCK_RULES_OLD: ReadonlySet<string> = new Set<string>([...HARD_RULES, "notice_repeat", "awkward", "fn_join", "code_leak", "abbr_leak", "evidence_owner", "month_line", "month_list", "dayun_soon"]);
export type ChunkFlag = { readonly chapter: number; readonly section: number; readonly paragraph: number; readonly rule: string; readonly sentence: string; readonly detail?: string; readonly hint?: string };

const CODE = /(?<![A-Za-z0-9])[NDYMBIP]\d{1,3}(?![A-Za-z0-9])|근거 카드|책 설계도|소제목 틀|핵심 주장|장면 씨앗|할 일 씨앗|되풀이 금지|이번 묶음|머리 문장|주기능|부기능|3차기능|열등기능|두 번째로 쓰는 쪽|세 번째로 쓰는 쪽|가장 늦게 자라는 쪽|가장 센 쪽인|기준 해|생활 결|처방 종류|집 장/;
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
  /** AM2-4: 엔진 항목(배지 자리 · key 십성 대조). */
  readonly brief?: Brief;
};
// ---------- AM2-4: key의 엔진 사실(카드에 다 주지 않아도 그 달·해의 것) ----------
/** 그 key의 엔진 글(배지 뜻 · 영역 줄 · 하늘·땅 십성 뜻 · 달 근거 사실). 카드가 핵심만 주게 된 뒤(1부), 「다른 달의 줄」 검사가 제 달의 엔진 글을 남의 것으로 보지 않게. */
export function engineTextOf(b: Pick<BlockCtx, "brief">, key: string): string {
  const e = b.brief?.timeline?.entries.find(x => x.key === key); if (!e) return "";
  const notes = (b.brief?.timeline?.tenGodNotes ?? {}) as Record<string, { meaning: string }>;
  const mats = (b.brief?.chapters ?? []).filter(c => c.id.endsWith(`:${key}`)).flatMap(c => c.materials).flatMap(m => (m.kind === "evidence" ? m.facts : []));
  return [...e.badges.map(x => x.line), ...(e.material?.domains ?? []), notes[e.tenGod.stem]?.meaning ?? "", notes[e.tenGod.branch]?.meaning ?? "", ...mats, e.material?.scene ?? "", e.todo ?? ""].join(" ");
}
// ---------- AM2-3 4부 보조 ----------
/** 낱말 어간(첫 음절 + 둘째 음절의 첫소리·가운뎃소리): 「눌리는·눌립니다」, 「급하게·급한」을 같은 어간으로. */
const stemOf = (w: string): string | null => {
  if (w.length < 2) return null; const a = w.charCodeAt(0), b = w.charCodeAt(1); if (a < 0xac00 || a > 0xd7a3 || b < 0xac00 || b > 0xd7a3) return null;
  // 오탐 검토(annual): 모음 줄임(봐→보 · 와→오 · 워→우 · 돼→되 · 해→하 · 져→지)을 같은 어간으로(「손봐야·손보는」).
  const cho = Math.floor((b - 0xac00) / 588); let jung = Math.floor(((b - 0xac00) % 588) / 28);
  const J: Readonly<Record<number, number>> = { 9: 8, 14: 13, 10: 11 }; if (J[jung] !== undefined) jung = J[jung];
  if (jung === 1 && cho === 18) jung = 0; if (jung === 6 && (cho === 12 || cho === 14)) jung = 20;
  return w[0] + String.fromCharCode(0xac00 + cho * 588 + jung * 28);
};
const STOP_STEM = new Set(["흐름", "기운", "마음", "사람", "서로", "함께", "있는", "있어", "하는", "되는", "들어", "만나", "일이", "일에", "돈이", "관계", "컨디션", "생활", "쉬운", "좋은", "쪽으로", "때는", "것이", "많이", "먼저", "다시", "모두", "커지", "드러", "이달", "달은", "해는", "글자", "자리", "태어", "나무", "하늘", "땅에", "기운이", "흐르", "보통", "느린", "생기", "늘어", "달이", "도우", "배우", "일으", "맡으", "끝내", "평소", "낯서", "정하", "돈으", "힘이", "일에서", "하루", "먼저"].map(w => stemOf(w)).filter((x): x is string => Boolean(x)));
const stemsOf = (t: string) => new Set(t.split(/[^가-힣]+/).map(stemOf).filter((x): x is string => x !== null && !STOP_STEM.has(x)));
type RelKind = "합" | "충" | "형" | "파" | "해" | "원진" | "공망";
const relKind = (name: string): RelKind | null => (/(합|국)$/.test(name) ? "합" : /충$/.test(name) ? "충" : /형$/.test(name) ? "형" : /파$/.test(name) ? "파" : /해$/.test(name) ? "해" : name === "원진" ? "원진" : name === "공망" ? "공망" : null);
/** 관계 뜻 사전(4부): 합 맺힘·묶임, 충 부딪침, 형 눌러 다듬음, 파 어긋남, 해 방해. */
const REL_VERB: Readonly<Partial<Record<RelKind, RegExp>>> = { 합: /맺|묶/, 충: /부딪|충돌/, 형: /다듬|눌러|벌주|깎아/, 파: /어긋|틀어/, 해: /방해|발이 걸|발목/ };
/** 관계 종류마다 뜻 말(카드 뜻 줄에 없어도 그 종류의 뜻으로 친다 — 오탐 검토 annual rel_mix). */
const REL_SENSE: Readonly<Partial<Record<RelKind, string>>> = { 형: "마찰 다듬고 손보고", 원진: "까끌 미워지는" };
/** 서술 절(동사 끝 뒤 쉼표에서만 나눈다 — 「축미충과 술미파, 축술미형이」의 목록 쉼표는 나누지 않는다). */
const clausesOf = (sen: string) => sen.split(/(?<=고|며|지만|는데|어서|아서|해서|면서|니|면),\s*/);
/** 목록 마디(쉼표마다 — 이름만 놓인 마디를 찾는다). */
const itemsOf = (sen: string) => sen.split(/(?<=고|며|지만|는데|어서|아서|해서),\s*|,\s+/);
/** 국(삼합) 이름의 다른 꼴: 「오술 반합」「해묘미 반합」 「인오술」. */
const GUK_NAMES: Readonly<Record<string, RegExp>> = { 목국: /해묘미|해묘|묘미|해미/, 화국: /인오술|인오|오술|인술/, 금국: /사유축|사유|유축|사축/, 수국: /신자진|신자|자진|신진/ };
const nameIn = (sen: string, nm: string) => sen.includes(nm) || Boolean(GUK_NAMES[nm]?.test(sen) && /반합|삼합|국/.test(sen));
/** 자리 말(「연인과의 사이 자리」 「일터 자리」)은 관계 뜻이 아니다 — 뜻 섞기 셈에서 뺀다(R7 major-p6a 2036 ¶1: 「사이」를 묘진해 뜻으로 잡은 오탐). */
const seatMask = (t: string) => t.replace(/[가-힣]+(과|와)의 사이 자리|(가까운 사람|일터|생활|사회생활|집안|태어난 (해|달|날|시각)) 자리/g, " ");
const esc2 = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/** 앞날·결과·남의 반응 단정 사전(4부): 사람이 해 줄 일 · 결과로 이어짐 · 안정 · 쏟아짐. */
const FUTURE_ASSERT = /(해|알아봐|반응해|도와|챙겨|들어|맞춰|기다려|인정해) 줄 거(예요|에요|랍니다)|(결과|인정|점수|성과|기회|평가|신뢰|수입|합격|승진)(으)?로 이어(집니다|져요)|결과로 이어지는 (해|달)|다음 (대운|10년)으로 이어(집니다|져요)|안정적(이에요|입니다)|쏟아집니다|쏟아져요|찾아옵니다|찾아와요|(가|이) 생길 거예요/;
const FUTURE_IN_KEY = /(생깁니다|생겨요|늘어납니다|늘어나요|들어옵니다|들어와요|커집니다|커져요)[.!]?$/;
/** 「-던」으로 카드에 없는 지난 행동을 전제(P2 판독 annual-1 8.3 「선을 긋는 연습을 하던 마음」). */
const PAST_PREMISE = /(을|를) [가-힣 ]{0,10}하던 (마음|때|날|습관|그때)|해 왔던 [가-힣]|그동안 [가-힣]+(해|하) 온|(때가|적이|날이) 있죠[.!]?$|(때|적)(가|이) 있었(죠|을 거예요)|낯설지 않을 (거예요|겁니다)|익숙하실 (거예요|겁니다)/;
/** 입력이 솔로·미입력인데 이미 있는 인연을 전제(P2 판독 annual-1 2.2 「이미 생긴 인연」). */
const PARTNER_PREMISE = /(이미|벌써) (생긴|만난|있는|사귀는) (인연|사람|연인|상대)|만나는 사람과의|연인과의|애인과/;
/** 원국 이름(일주·신살)의 성질을 그 해의 성질로(P2 판독 annual-1 4.1 「갑오일주의 힘이 … 나오는 해예요」). */
const YEAR_END = /(는|ㄴ|은|운|될|되는) (해|달)(예요|이에요|입니다)[.!]?$/;
/** 소제목 꼴(2-5): 지난 일을 굳히는 평서·결과 단정 명사구. */
const HEADING_PAST = /(았|었|였|했|겼|졌|남았)다[.!]?$|다[.!]$/;
const HEADING_ASSERT = /(커지는|오는|생기는|열리는|이어지는|남는|붙는|편해지는|단단해지는|풀리는|늘어나는|찾아오는|바뀌는|이루는|되는|찾는|얻는) (10년|해|달|인연|때|시기|사람|기회|돈|자리|길)$/;
const HEADING_SOFT = /쉬운|좋은|기 쉬|라면|하면|이면|\?|수 있는|경향|법$|기준|방법|무렵|까$/;
const ARROW_LITERAL = /(위쪽|아래쪽)(을|으로) 향|화살표/;
const META_TRACE2 = /새로운 특성이 없|새 특성 (없이|은 없)|이 (로드맵|장|절|책|부분)에(는|선) [^.?!]{0,24}(없습니다|없어요|담지 않|넣지 않|다루지 않)|설계도|브리프|근거 카드|카드 줄|화면에 (이미 )?(있|나온|나와|보이|적힌|뜨)|여기서는 뜻만/; // P7 major-p6a 2032 「…화면에 이미 있는 줄이라, 여기서는 뜻만 짧게 붙입니다」(카드 「화면(되풀이 금지)」 칸이 샘)
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
  // AM2-4(P3 판독 annual-1 경계 #17): 괄호 앞말 「쇠·나무」에 맞춘 조사.
  [/(?<![가-힣])(쇠|나무)\((금|목)\)(이|을|은|과) /, "괄호 앞말에 맞춘 조사 — 「쇠(금)가」 「나무(목)를」처럼"],
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
// AM2-8 6부(P7 재현 major-p6a 5.8.1 오탐): 카드 꼴 「…기 쉬운 해예요」도 무른 꼴.
const SOFT_RAW = /수 있는 (?:해|달|때|시기|10년)(?:예요|이에요|입니다)|기 쉬운 (?:해|달|때|시기|10년|쪽)(?:예요|이에요|입니다)|어울려요|어울립니다|어울리는|떠올라요|떠오릅니다|그려져요|그려집니다|모습|장면|수 있어요|수 있습니다|수도 있|기 쉬워요|기 쉽습니다|기 좋아요|기 좋습니다|기 쉬운데|좋은 때|좋은 해|좋은 달|다면|라면|(?<![가-힣])면 |면,|거든|보세요|보면|두세요|해 두|해도 좋|볼 만|권해요|추천|[?？]$|나요|까요|지도 몰라|일지도|듯해요|듯합니다|법해요|만해요|죠[.!]?$/;
/** 「평소라면」처럼 조건이 아닌 「라면」은 떼고 본다(P 시범 2035 「평소라면 안 나갈 공모전에 원서를 내고 … 새우는 해예요」를 놓쳤다). */
const soft = (sen: string) => SOFT_RAW.test(sen.replace(/(평소|원래|예전|여느 때|보통)(이)?라면/g, ""));
/** 앞날 장면 씨앗을 그때의 사건으로 옮긴 문장: key 안은 씨앗과 4자 창 8개 이상(P 시범 실측: 단정 23~33, 오탐 3~4), 다른 장은 4개 이상 + 「…는 해·달이에요」. */
const SEED_IN_KEY = 8, SEED_ELSEWHERE = 4;
const EVENT_END = /(는|ㄴ|은) (해|달)(예요|이에요|입니다)[.!]?$/;
/** 지난 일 단정이 아닌 꼴(질문·조건·추측). */
const PAST_SOFT = /[?？]$|다면|라면|었을|았을|였을|했을|ㅆ을|을 수도|ㄹ 수도|수도 있|지도 몰라|않았나요|었나요|았나요|였나요|던가요|았던가|었던가|나요|까요|겠|거예요|거고|테고|텐데|지 않았|기억나|떠올려|돌아보|적어 보|살펴보/;
const PAST_DECL = /(었|았|였|했|졌|됐|웠|켰|렸|냈|섰|왔|갔|겼|쳤|혔|뀌었)(습니다|어요|아요|죠|지요)[.!]?$|(온|해 온|지나온|옮겨 온|익혀 온) (3년|세 해|시간|셈)(이에요|입니다|이죠)[.!]?$|(결|흐름|해|시기|때)(이었|였)(어요|습니다)[.!]?$/;
/** 엔진 사실 문장(그 해의 십성·대운·간지를 말하는 문장)은 지난 일 단정이 아니다. */
const PAST_FACT = new RegExp(`(${TG}|대운|[갑을병정무기경신임계][자축인묘진사오미신유술해](년|월)?)[^.?!]{0,30}(들어온|들어왔|온 해|안이었|안에 있었|자리였|기운이었|해였)` +
  // AM2-7 1부 6(P6 major-p5 2.1 「지난 정묘 대운은 2014년 11월 무렵부터 이어진 비견의 10년이었어요」 — 엔진 사실만 있는 과거형을 지웠다): 대운 이름 · 시작 연월 · 십성 · 「…의 10년이었」은 엔진 사실.
  `|대운[^.?!]{0,50}(10년이었|해였|마지막 해였|시작됐|시작되었|시작된 [^.?!]{0,12}이었|이어졌|열렸)|(${TG})의 10년이었|대운이 (시작됐|시작되었|바뀌었|열렸)` +
  // AM2-8 1부(P7 major-p6b 2.0.1 「…정관에서 편인, 정인으로 날씨가 옮겨 갔습니다」): 해마다 십성이 바뀐 것은 엔진 값의 과거형이다.
  `|(${TG})에서 [^.?!]{0,24}(${TG})(으)?로 [^.?!]{0,24}(옮겨|바뀌|넘어)`);
/** AM2-7 1부 6: 사람의 일을 굳힌 과거형(장 · key와 상관없이) — 「이 10년 동안 당신은 …했습니다」 「…해 온 쪽」 「…었을 거예요」. */
const PERSON_PAST = /당신(은|이|의 [가-힣]{1,4}(은|는|이|가))[^.?!]{0,50}(했습니다|했어요|해 왔습니다|해 왔어요|해 온 쪽이에요|해 온 쪽입니다|해 온 편이에요|겪었습니다|겪었어요|보냈습니다|보냈어요|지나왔습니다|버텨 왔|쌓아 왔습니다|쌓아 왔어요|서 있었습니다|서 있었어요|해 왔던 쪽입니다)[.!]?$|(었|았|였|했|웠|졌)을 거예요[.!]?$|(었|았|였|했)을 겁니다[.!]?$/;
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
  /** 카드에 「가장 ~」이 그대로 있으면(예: 「가장 조용한 달: 계축월」) 작가 말이 아니라 카드 값이다. */
  // AM2-3: 동률 줄(「흐름이 가장 잔잔한 달(같은 세기): 4월 · 갑진월, …」)은 그 줄에 이름이 든 달·해만 「가장」이 맞다.
  // 오탐 검토(annual): 같은 뜻 무리(「가장 조용」≈「가장 잔잔」, 「가장 거센」≈「가장 크게 오르는」)도 카드 값이다. 달 이름이 든 카드 줄이면 그 달·해가 줄에 있어야 한다.
  const SYN: readonly RegExp[] = [/^(잔잔|조용|고요)/, /^(거세|거센|크게 오르)/];
  const onCard = (sen: string, re: RegExp, label?: string) => { const m = re.exec(sen); if (!m) return false; const g = SYN.find(x => x.test(m[1]));
    const months2 = [...monthsIn(sen)];
    return b.intake.lines.some(l => { const t = `${l.value} ${l.meaning}`, i2 = t.indexOf("가장"); if (i2 < 0 || !/달|흐름/.test(t)) return false; const w = t.slice(i2 + 3, i2 + 9);
      const same = t.includes(`가장 ${m[1]}`) || Boolean(g?.test(w)) || (g === SYN[1] && /^크게 오르/.test(w));
      return same && (!MONTH_NAME_IN.test(t) || (label ? t.includes(label) : months2.length ? months2.every(mm => t.includes(`${mm}월`)) : true)); }); };
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
          if ((pi === 0 && sj === 0 && sen.includes(pair.sky) && sen.includes(pair.ground) && /하늘|땅/.test(sen)) || (pi === 0 && (/하늘에 있어|하늘과 땅이 모두|하늘 (정|편|비|겁|식|상)[가-힣]{1,2}(은|는)|대운이 시작되/.test(sen) || (/땅의 [가-힣]{2}(은|는)/.test(sen) && !/기운|뜻|힘/.test(sen))))) add({ ...at, rule: "head_repeat", hint: "머리 문장이 이미 하늘·땅 십성(과 대운 시작)을 말했다 — 바로 다음 문장은 그 뜻·장면부터" });
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
          // AM2-7 8부: 그 달·해 이름을 단 견줌 절(「8월 · 무신월에는 … 수국 반합이 모임으로 왔고, 이번에는 …」 — 카드 연결 고리 「앞:」)의 관계 이름은 다른 key 값이 아니다.
          const cmpClause = (r: string, lab: string) => { const parts = lab.split(/ · | /).filter(x2 => /^(20\d\d년|(1[0-2]|[1-9])월|[가-힣]{2}[월년])$/.test(x2)); return sen.split(/(?<=고|며|지만|는데|어서|아서|해서|면서|니|면|달리),\s*/).some(cl => cl.includes(r) && parts.some(p2 => new RegExp(`(?<![0-9가-힣])${p2}`).test(cl))); };
          for (const [k2, rels] of b.keyRels ?? []) { if (k2 === kp.key) continue; for (const r of rels) if (!mineRel.has(r) && sen.includes(r) && ![...(b.keyRels ?? [])].some(([k3, rs3]) => k3 !== kp.key && rs3.has(r) && cmpClause(r, labelOfKey.get(k3) ?? ""))) { other = `${r}(${labelOfKey.get(k2) ?? k2})`; break; } if (other) break; }
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
        // 오탐 검토(annual): 이 달 카드가 가리키는 앞 달(「X의 뜻은 앞의 L과 같은 결」 · 「L과 같은 생활 결」)의 줄은 이 달 근거다.
        const kpHere = plans.get(c.n)?.keys?.find(k2 => k2.key === s.heading);
        const pointedKeys = new Set((plans.get(c.n)?.keys ?? []).filter(o => o.key !== s.heading && (kpHere?.lines ?? []).some(id => { const m = lineById.get(id)?.meaning ?? ""; return m.includes(`앞의 ${o.label}`) || m.includes(`${o.label}과 같은 생활 결`); })).map(o => o.key));
        const ownEngine = windows(engineTextOf(b, s.heading), 12);
        if (mine) for (const [key, set] of months) if (key !== s.heading && !pointedKeys.has(key) && hit(sen, set, 12) && !hit(sen, mine, 12) && !hit(sen, ownEngine, 12)) { add({ ...at, rule: "month_line", detail: `${labelOfKey.get(key) ?? key}의 근거 줄` }); break; }
      }
      // AM2-4 5부(P3 판독 annual-1 차단 #2 — 한 문장의 두 목록 「일이 오르는 달은 …이고, 4월은 흔들림을 살필 달」을 오탐으로 지움): 「이고·이며·,」 마디마다 따로 대조한다.
      monthList: for (const cl of sen.split(/(?<=이고|이며|이지만|인데),\s*|(?<=고),\s+/)) { const ms = monthsIn(cl);
        if (!ms.size || anyList.some(set => [...ms].every(m => set.has(m)))) continue;
        for (const l of lists) if (l.cue.test(cl) && [...ms].some(m => !l.months.has(m)) && !lists.some(l2 => l2 !== l && l2.cue.test(cl) && [...ms].every(m => l2.months.has(m)))) {
          if (/(달|때)(은|는|이|가)? [^.?!]{0,30}(이에요|입니다|예요|이고|이며)|(오르|늦추|새|무리|쉬어|흔들)[^.?!]{0,10}달/.test(cl)) { add({ ...at, rule: "month_list", detail: `달 목록이 카드와 다름(카드: ${[...l.months].join("·")})` }); break monthList; }
        } }
      if (b.yearsToNextDayun !== undefined && b.yearsToNextDayun > 2 && /곧[^.?!]{0,24}대운(으로|이|에)? ?(넘어가|바뀌|들어가|시작|열리)/.test(sen)) add({ ...at, rule: "dayun_soon", detail: `다음 대운까지 ${b.yearsToNextDayun}년` });
    }
  }));
  for (const f of rootFlags(chapters, b)) add(f);
  for (const f of am24Flags(chapters, b)) add(f);
  for (const f of am25Flags(chapters, b)) add(f);
  for (const f of am26Flags(chapters, b)) add(f);
  for (const f of am28Flags(chapters, b)) add(f);
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
  // AM2-4 3부: 관계 줄 값은 「5월 · 을사월 태어난 해 자리와 인사해」 「… 화국 반합」 「… 공망」(괄호 값 없음). 옛 꼴 「인사해(태어난 해 자리와)」도 읽는다.
  // AM2-4: 그 key의 관계는 엔진 배지 전부(카드는 핵심만 준다) — 이름 → 뜻(「…흐름」). 엔진이 없으면 카드 줄에서.
  const relMeaning = (key: string) => { const m = new Map<string, string>(); const e = b.brief?.timeline?.entries.find(x => x.key === key);
    if (e) { for (const bd of e.badges) { const nm = bd.label.replace(/\(.*\)$/, "").trim(); if (nm.length >= 2) m.set(nm, bd.line.replace(/^반합\([^)]*\): /, "")); } return m; }
    const kp = keyPlans.get(key); for (const id of kp?.lines ?? []) { const l = lineById.get(id); const nm = l?.value.match(/(?:자리와 |(?:월|년) )([가-힣]{1,4}(?:합|충|형|파|해|국)|[가-힣]+ 방합|원진|공망)(?: 반합)?(?:\(|$)/)?.[1]; if (l && nm) m.set(nm, l.meaning); } return m; };
  // 신살·운성 자리(값 「백호대살(태어난 달 · 임술)」).
  // AM2-4 3부: 신살 줄 값은 「태어난 달 자리의 백호대살」(옛 꼴 「백호대살(태어난 달 · 임술)」도 읽는다).
  const seats0 = x.lines.filter(l => l.subject === "natal").map(l => { const m = /^([가-힣]{2,6})\((태어난 (?:해|달|날|시각))(?: · ([가-힣]{2}))?\)$/.exec(l.value), m2 = /^(태어난 (?:해|달|날|시각)) 자리의 ([가-힣]{2,6})$/.exec(l.value);
    const name = m?.[1] ?? m2?.[2], seat = m?.[2] ?? m2?.[1]; return name && seat ? { name, short: name.length >= 4 && /살$/.test(name) ? name.slice(0, 2) : name, seat, ganji: m?.[3] as string | undefined } : null; }).filter(<T,>(v: T | null): v is T => v !== null).filter(v => /살$|귀인$/.test(v.name));
  // 오탐 검토(major): 같은 신살이 여러 줄(특성 줄 · 숙제 줄 「현침살 (태어난 해·태어난 달·…)」)에 있으면 자리는 그 합집합.
  const seatSet = new Map<string, Set<string>>();
  for (const sh of seats0) seatSet.set(sh.name, new Set([sh.seat]));
  for (const l of x.lines) for (const m of `${l.value} ${l.meaning}`.matchAll(/([가-힣]{2,6}(?:살|귀인)) ?\(((?:태어난 (?:해|달|날|시각))(?:·태어난 (?:해|달|날|시각))*)/g)) { const set = seatSet.get(m[1]); if (set) for (const st of m[2].split("·")) set.add(st); }
  // AM2-4 카드 값 고객 말: 「태어난 해·달·날·시각 자리의 현침살」.
  for (const l of x.lines) for (const m of `${l.value} ${l.meaning}`.matchAll(/태어난 ((?:해|달|날|시각)(?:·(?:태어난 )?(?:해|달|날|시각))*) 자리의 ([가-힣]{2,6}(?:살|귀인))/g)) { const set = seatSet.get(m[2]); if (set) for (const st of m[1].split("·")) set.add(`태어난 ${st.replace(/^태어난 /, "")}`); }
  const seats = seats0;
  // 근거 범위(2-3): 일주 이름 · 신살·귀인 이름이 쓰는 장 밖에서.
  // 일주 이름은 그 일주 줄의 쓰는 장 + 자리 값에 일주 이름이 든 줄(「사(태어난 날 · 갑오)」)의 쓰는 장에서 쓸 수 있다.
  // AM2-4: 자리 줄 값이 「태어난 날 자리의 사(死)」처럼 바뀌어(간지 없음) — 태어난 날 자리 줄의 장도 일주 이름을 쓸 수 있다(예전 「(태어난 날 · 갑오)」 줄과 같은 몫).
  const pillarUse = new Set(x.lines.filter(l => l.subject === "natal" && b.dayPillar && (l.value === b.dayPillar || l.value.includes(`· ${b.dayPillar})`) || /^태어난 날 자리의 /.test(l.value))).flatMap(l => l.use));
  const scoped = x.lines.filter(l => l.subject === "natal").map(l => { const nm = l.value.replace(/^태어난 (해|달|날|시각) 자리의 /, "").replace(/\(.*\)$/, "").trim(); return { id: l.id, nm, use: nm === b.dayPillar ? pillarUse : new Set(l.use) }; })
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
      // AM2-7 1부 6(P6 annual-p6b 5.0 「태어난 날 자리의 귀문관살은 …」을 소품 첫 문장으로 읽어 지웠다): 「태어난 해 · 달 · 날 · 시각」은 자리 이름이지 소품 장면이 아니다.
      const isProp = Boolean(first) && !/^태어난 (해|달|날|시각)/.test(first) && (PROP_OPEN.test(first) || (plan?.scenes ?? []).some(sc => overlap4(first, sc) >= 5));
      if (isProp && prevOpenProp) out.push({ chapter: c.n, section: 0, paragraph: 0, rule: "opening_prop", sentence: first, hint: "앞 장도 소품·장면으로 열었다 — 이 장은 질문의 답(근거 하나)으로 연다" });
      prevOpenProp = isProp;
    }
    c.sections.forEach((s, si) => {
      const kp = c.keys?.includes(s.heading) ? keyPlans.get(s.heading) : undefined;
      const at0 = { chapter: c.n, section: si };
      // 소제목 꼴(2-5).
      if (!kp && s.heading && (HEADING_PAST.test(s.heading) || (HEADING_ASSERT.test(s.heading) && !HEADING_SOFT.test(s.heading)))) out.push({ ...at0, paragraph: -1, rule: "heading_form", sentence: s.heading, hint: "소제목은 물음이나 카드의 꼴(경향 「~하기 쉬운」·조건 「~라면」)로 — 결과를 못 박거나 지난 일을 굳히지 않는다" });
      // 반드시 쓸 것(2-4).
      if (kp?.must?.length) { const body = s.paragraphs.join(" ");
        // weak 별칭(자리 + 관계 종류 말)은 다른 관계 이름이 없는 마디에서만 그 관계로 본다.
        const others = (m: { what: string }) => [...(b.keyRels?.get(kp.key) ?? [])].filter(n2 => n2.length >= 2 && n2 !== m.what.replace(/ 반합$/, ""));
        const weakHit = (m: { what: string; weak?: string }) => Boolean(m.weak) && s.paragraphs.flatMap(p2 => splitSentences(p2)).flatMap(clausesOf).some(cl => new RegExp(m.weak!).test(cl) && !others(m).some(n2 => cl.includes(n2)));
        const miss = kp.must.filter(m => !new RegExp(m.re).test(body) && !weakHit(m)); if (miss.length) out.push({ ...at0, paragraph: -3, rule: "must_miss", sentence: `[반드시 쓸 것] ${kp.label}: ${miss.map(m => m.what).join(" / ")}`, hint: `${kp.label} 본문에 빠졌다: ${miss.map(m => m.what).join(" / ")} — 카드 줄의 그 뜻을 한 번씩` }); }
      // 영역 나열(2-6).
      if (kp) { const n = new Set([...s.paragraphs.join(" ").matchAll(DOMAIN_LEAD)].map(m => m[1])).size; if (n >= 3) { const pi = s.paragraphs.findIndex(p => (p.match(DOMAIN_LEAD) ?? []).length >= 2) ; const p = s.paragraphs[Math.max(0, pi)] ?? ""; out.push({ ...at0, paragraph: Math.max(0, pi), rule: "domain_list", sentence: splitSentences(p).find(x2 => DOMAIN_LEAD.test(x2)) ?? p.slice(0, 80), detail: `영역 ${n}개 나열`, hint: "「일에서는… 돈에서는… 관계에서는…」 나열 금지 — 핵심 하나 + 장면 하나 + 행동 하나" }); DOMAIN_LEAD.lastIndex = 0; } }
      const rels = kp ? relMeaning(kp.key) : new Map<string, string>();
      // AM2-7 8부(P7 세운 4권 보류 — 7장 key 「6월 · 병오월에는 … 다듬는 힘이 일했다면, 이번에는 …」): 카드 연결 고리(「앞: 그 달(그때 같은 자리: 관계 — 뜻)」)를 따라
      // 다른 달·해 이름을 단 견줌 절은 그 앞 달의 관계 · 뜻을 말해도 된다 — 관계 뜻 섞기(rel_verb · rel_mix) · 다른 달 뜻(key_value) 셈에서 그 절을 뺀다.
      const otherParts = kp ? [...new Set([...keyPlans.values()].filter(o => o.key !== kp.key).flatMap(o => o.label.split(/ · | /)).filter(x2 => /^(20\d\d년|(1[0-2]|[1-9])월|[가-힣]{2}[월년])$/.test(x2) && !kp.label.split(/ · | /).includes(x2)))] : [];
      const cmpRe = otherParts.length ? new RegExp(otherParts.map(x2 => `(?<![0-9가-힣])${esc2(x2)}`).join("|")) : null;
      const noCmp = (t: string) => (cmpRe ? t.split(/(?<=고|며|지만|는데|어서|아서|해서|면서|니|면|달리),\s*/).filter(cl => !cmpRe.test(cl)).join(", ") : t);
      // 다른 달·해 관계의 뜻(어간 셋 이상 겹침, 이 자리 카드에는 없음 — P2 판독 annual-1 6월 「발이 덜 걸립니다」).
      const mineStems0 = kp ? stemsOf([...kp.lines.map(id => `${lineById.get(id)?.value ?? ""} ${lineById.get(id)?.meaning ?? ""}`), kp.scene ?? "", kp.todo ?? "", kp.head].join(" ")) : new Set<string>();
      // 이 자리 카드가 가리키는 앞 달·해의 줄은 써도 된다: 「X의 뜻은 앞의 ○과 같은 결」 → 그 달의 X 글자 줄, 「○과 같은 생활 결」 → 그 달의 생활 줄(관계 줄은 아니다).
      const pointers = kp ? kp.lines.map(id => lineById.get(id)?.meaning ?? "") : [];
      const allowedOther = (o: KeyPlanLike, l: Line) => pointers.some(m => (m.includes(`앞의 ${o.label}`) && / 글자 /.test(l.value) && m.startsWith(`${l.value.replace(/^.* 글자 /, "").replace(/\(.*$/, "")}의 뜻`)) || (m.includes(`${o.label}과 같은 생활 결`) && / 생활$/.test(l.value)));
      // 오탐 검토(annual): 가리키는 앞 달·해의 허용 줄 어간도 이 자리 몫으로 친다.
      const allowedLines = kp ? [...keyPlans.values()].filter(o => o.key !== kp.key).flatMap(o => o.lines.map(id => lineById.get(id)).filter((l): l is Line => Boolean(l) && allowedOther(o, l!))) : [];
      const mineStems = new Set([...mineStems0, ...stemsOf(allowedLines.map(l => l.meaning).join(" ")), ...(kp ? stemsOf(engineTextOf(b, kp.key)) : [])]);
      const otherRel = kp ? [...keyPlans.values()].filter(o => o.key !== kp.key).flatMap(o => o.lines.map(id => lineById.get(id)).filter((l): l is Line => Boolean(l) && l!.subject === (kp.key.includes("-M") ? "month" : "year") && !/같은 결|과 같고|흐름이 [가-힣]+ 편|영역 흐름/.test(l!.meaning) && !allowedOther(o, l!)).map(l => ({ key: o.key, label: o.label, nm: l.value.replace(`${o.label} `, ""), st: stemsOf(l.meaning), raw: l.meaning }))) : [];
      s.paragraphs.forEach((p, pi) => splitSentences(p).forEach(raw => {
        const sen = raw.replace(/[⟪⟫]/g, ""), at = { ...at0, paragraph: pi, sentence: sen };
        // 관계 동사(뜻 사전).
        if (kp) {
          const named = [...rels.keys()].filter(nm => nameIn(sen, nm)), kinds = new Set(named.map(relKind).filter(Boolean));
          if (named.length) {
            const own = named.map(nm => `${rels.get(nm) ?? ""} ${REL_SENSE[relKind(nm) as RelKind] ?? ""}`).join(" ");
            // 오탐 검토(annual): 동사는 그 이름이 든 절 안에서만 본다(「사해충으로 부딪히고, 금의 기운이 반쯤 묶여」는 절이 다르다).
            // 이름이 없는 절의 동사는 이 달·해의 다른 관계(그 종류가 있거나 뜻에 그 말이 있는)를 뜻으로 풀어 쓴 것이면 괜찮다.
            const keyKinds = new Set([...rels.keys()].map(relKind)), keyMeans = [...rels.values()].join(" ");
            verb: for (const cl of clausesOf(noCmp(sen))) { const inCl = named.filter(nm => nameIn(cl, nm)); const kindsCl = new Set(inCl.map(relKind)), ownCl = inCl.map(nm => rels.get(nm) ?? "").join(" ");
              for (const [j, re] of Object.entries(REL_VERB) as [RelKind, RegExp][]) { if (!re.test(cl) || kindsCl.has(j) || re.test(ownCl)) continue; if (!inCl.length && (keyKinds.has(j) || re.test(keyMeans))) continue;
                out.push({ ...at, rule: "rel_verb", detail: `${(inCl.length ? inCl : named).join("·")}에 ${j}의 말 「${cl.match(re)![0]}」`, hint: "관계마다 그 이름의 뜻만: 합 맺힘·묶임, 충 부딪침, 형 눌러 다듬음, 파 어긋남, 해 방해" }); break verb; } }
            void kinds;
            // 관계 둘 이상을 한 문장에 묶었는데 한쪽 뜻만 썼다(P2 판독 annual-1 6월 「지지형과 … 화국 … 표현과 열정이 모입니다」).
            // 관계 둘을 한 뜻으로 묶음: 뜻이 하나도 안 보이는 관계가, 다른 관계와 「과·와·,」로만 이어졌거나 이름만 덩그러니 놓인 절에 있을 때(오탐 검토: 관계마다 제 절·서술어가 있으면 묶은 것이 아니다).
            // 관계를 잇는 흔한 말(걸리다·겹치다·함께)은 뜻으로 세지 않는다.
            const LINK_STEM = new Set(["걸리", "겹치", "겹쳐", "함께", "반합", "삼합", "방합"].map(w => stemOf(w)!));
            const sst = stemsOf(sen), hitOf = (nm: string) => [...stemsOf(`${rels.get(nm) ?? ""} ${REL_SENSE[relKind(nm) as RelKind] ?? ""}`)].filter(x2 => sst.has(x2) && !LINK_STEM.has(x2)).length;
            const ordered = [...named].sort((p1, p2) => sen.indexOf(p1) - sen.indexOf(p2));
            const adjacent = (nm: string) => ordered.some(o2 => o2 !== nm && /^(과|와|이랑|랑)?\s*[,·]?\s*$/.test(sen.indexOf(o2) > sen.indexOf(nm) ? sen.slice(sen.indexOf(nm) + nm.length, sen.indexOf(o2)) : sen.slice(sen.indexOf(o2) + o2.length, sen.indexOf(nm))));
            const bare = (nm: string) => { const cl = itemsOf(sen).find(c2 => c2.includes(nm)) ?? ""; return cl.replace(new RegExp(named.map(esc2).join("|"), "g"), "").replace(/태어난 (해|달|날|시각)|자리(와|에)?|[과와도이가은는,·\s]/g, "").replace(/[^가-힣]/g, "").length < 4; };
            if (named.length >= 2) { const hits = named.map(hitOf); const joined = named.some(nm => adjacent(nm) || bare(nm)); const lumped = named.filter((_nm, i) => hits[i] === 0); if (joined && lumped.length && hits.some(h => h > 0)) out.push({ ...at, rule: "rel_mix", detail: `${named.join("·")}를 한 뜻으로`, hint: "관계마다 그 이름과 그 뜻을 따로 — 둘을 한 뜻으로 묶지 않는다" }); }
            // 뜻 섞기: 이 자리의 다른 관계 뜻 어간 둘 이상이 이름이 든 절 안에(이름 없는 제 절에 풀어 쓴 것은 괜찮다 — 「…부딪히고, 금의 기운이 반쯤 묶여」).
            // 이름 없는 절도 제 자리·주어(「태어난 날 글자와는 금의 기운이」 「봄 글자가」)가 없으면 앞 관계 문장의 일부다(「…알아주지 않는 느낌이 들 수 있고, 묵은 일이 다시 올라오기도」).
            const ownSubject = /태어난 (해|달|날|시각)|자리와|글자(와|가)|의 기운이|[가-힣]{1,2} 기운이/;
            const ownSt = stemsOf(own), namedCl = stemsOf(clausesOf(seatMask(noCmp(sen))).filter(cl => named.some(nm => nameIn(cl, nm)) || !ownSubject.test(cl)).join(" "));
            for (const [nm2, mean2] of rels) { if (named.includes(nm2)) continue; const hitSt = [...stemsOf(mean2)].filter(x2 => !ownSt.has(x2) && namedCl.has(x2)); if (hitSt.length >= 2) { out.push({ ...at, rule: "rel_mix", detail: `${named.join("·")} 문장에 ${nm2}의 뜻(${hitSt.join("·")})`, hint: `${named.join("·")}에는 그 줄의 뜻만 — ${nm2}의 뜻을 섞지 않는다` }); break; } }
          }
          { const sst = stemsOf(noCmp(sen)); for (const o of otherRel) { const h = [...o.st].filter(x2 => sst.has(x2) && !mineStems.has(x2)); if (h.length >= 3) { out.push({ ...at, rule: "key_value", detail: `다른 달·해(${o.label})의 ${o.nm} 뜻(${h.join("·")})`, hint: `이 자리는 ${kp.label} — 카드 줄 ${kp.range ?? ""}에 적힌 것만` }); break; } } }
        }
        // 신살 자리.
        for (const sh of seats) {
          const i = sen.indexOf(sh.short); if (i < 0) continue;
          const win = sen.slice(Math.max(0, i - 20), i + sh.short.length + 20);
          if ((seatSet.get(sh.name)?.size ?? 1) === 1 && new RegExp(`${sh.short}[가-힣]{0,2}(은|는|이|가)? ${sh.seat}에도`).test(sen)) { out.push({ ...at, rule: "seat_claim", detail: `${sh.name}는 ${sh.seat} 한 자리`, hint: `${sh.name}는 ${sh.seat}${sh.ganji ? `(${sh.ganji})` : ""}에만 있다 — 다른 자리를 말하지 않는다` }); break; }
          let bad: string | null = null;
          const okSeats = seatSet.get(sh.name) ?? new Set([sh.seat]);
          for (const m of win.matchAll(SEAT_WORD)) { const w = m[0]; const seat = /^태어난/.test(w) ? w : /일주$/.test(w) && w.length === 4 ? (sh.ganji && w.startsWith(sh.ganji) ? sh.seat : "태어난 날") : SEAT_OF[w] ?? null; if (seat && !okSeats.has(seat)) { bad = w; break; } }
          if (bad) { out.push({ ...at, rule: "seat_claim", detail: `${sh.name} 자리 「${bad}」 — 카드는 ${sh.seat}`, hint: `${sh.name}는 ${sh.seat}${sh.ganji ? `(${sh.ganji})` : ""} 자리 그대로` }); break; }
        }
        // 근거 범위(2-3).
        // 오탐 검토(annual): 일주 이름이 그 해·달 간지와 같을 수 있다(「같은 정미의 기운」) — 「일주」 또는 「(」가 붙을 때만 원국 일주로 본다.
        for (const v of scoped) if (!v.use.has(c.n) && (v.nm === b.dayPillar ? new RegExp(`${v.nm}(일주|\\(|(은|는) )`).test(sen) && !new RegExp(`${v.nm}(년|월)|같은 ${v.nm}`).test(sen) && !new RegExp(`${v.nm}(\\([^)]*\\))?의 [가-힣]{1,2}(수|목|화|토|금)(?![가-힣])`).test(sen) : sen.includes(v.nm))) { out.push({ ...at, rule: "evidence_scope", detail: `${v.nm}(${v.id})는 ${[...v.use].join("·")}장 근거`, hint: `이 장 근거 밖의 「${v.nm}」 — 이 장의 「쓸 수 있는 근거」로만` }); break; }
        // 근거 주인 반대쪽: MBTI 근거의 뜻을 명리 주어로.
        if (mbtiWord && MY_SUBJECT.test(sen) && !mbtiWord.test(sen)) { const w = hit(sen, bWindows, 8); if (w) out.push({ ...at, rule: "owner_reverse", detail: `MBTI 근거의 뜻 「${w}」를 명리 주어로`, hint: "MBTI 근거의 뜻은 MBTI 주어로만 — 명리 이름의 성질로 옮기지 않는다" }); }
        // 짝 없는 연결.
        if (mbtiWord && mbtiWord.test(sen) && MY_WORD.test(sen) && !chapterPairs.some(pp => overlap4(sen, pp.why) >= 3)) out.push({ ...at, rule: "pair_link", detail: chapterPairs.length ? "이 장의 짝과 다른 연결" : "이 장에는 명리×MBTI 짝이 없다", hint: chapterPairs.length ? `명리와 MBTI는 이 장의 짝(${chapterPairs.map(pp => pp.id).join("·")}) 이유 그대로만 잇는다` : "이 장에서는 명리와 MBTI를 한 문장에서 잇지 않는다(문장을 나눠 각자 근거로)" });
        // 짝 이유·원국 성질을 그 해·달의 성질로(「그래서 …는 해예요」).
        if (!kp && YEAR_END.test(sen) && !soft(sen)) {
          if (x.pairs.some(pp => overlap4(sen, pp.why) >= 3) || (b.dayPillar && new RegExp(`${b.dayPillar}(일주|\\()`).test(sen)) || seats.some(sh => sen.includes(sh.short)))
            out.push({ ...at, rule: "pair_link", detail: "원국·MBTI의 성질을 그 해의 성질로", hint: "원국·MBTI의 성질은 그 사람의 성질 — 「…되는 해예요」로 바꾸지 않는다(그 해는 세운 카드의 말로)" });
        }
        if (PARTNER_PREMISE.test(sen) && /솔로|미입력/.test(relationshipOf(x.person))) out.push({ ...at, rule: "future_assert", detail: sen.match(PARTNER_PREMISE)![0], hint: "인물 카드는 솔로·미입력 — 이미 있는 인연을 전제하지 않는다(「인연이 생긴다면」처럼 조건형)" });
        // 카드에 없는 정도말(3-3): 「가장 X」「한층」「훨씬」 — 그 꼴이 카드 원문에 있을 때만.
        { const dm = /(가장|한층|훨씬) ([가-힣]{1,2})/.exec(sen); const before = dm ? sen.slice(0, dm.index) : "", after = dm ? sen.slice(dm.index) : "";
          // 오탐 검토(annual): 카드와 같은 뜻 무리의 정도말(「가장 조용」≈「가장 잔잔」, 「가장 셉니다」≈「가장 강한」, 「가장 흐름이 크게」)과 순서 말(「가장 급한 것부터」)은 카드 값이다.
          // 뜻 무리: 흐름(잔잔·조용 / 크게 오르·거센)은 달·해를 말하는 문장에서, 세기(센·셉·강 / 약)는 오행 이름이 든 문장에서만 카드 값과 같은 것으로 본다.
          const after6 = dm && dm[1] === "가장" ? sen.slice(dm.index + 3, dm.index + 16) : "";
          const ELEM = /흙|불|물|나무|쇠|[목화토금수](\(|이|가|은|는|의| 기운)/;
          const clDm = clausesOf(sen).find(cl => dm && cl.includes(dm[0])) ?? sen;
          const grp = !after6 ? undefined : /^(잔잔|조용|고요)/.test(after6) && /(달|해|때|시기)(이|은|는|이니|이에요|예요|입니다|이기도)/.test(clDm) ? /가장 (잔잔|조용|고요)/ : /^(흐름이 )?크게 오르|^거세|^거센/.test(after6) ? /가장 (흐름이 )?크게 오르|가장 거세|가장 거센/
            : /^(센|셉|세|강)/.test(after6) && ELEM.test(sen) ? /가장 (강한|센|많은|세)/ : /^(약|여리)/.test(after6) && ELEM.test(sen) ? /가장 (약한|적은|여린)/ : undefined;
          // 「가장」이 든 절의 달만 본다(「쉬어 가기 좋은 달은 2월·3월이고, 가장 조용한 달은 2028년 1월」).
          const labelHere = kp?.label, monthsHere = [...monthsIn(clausesOf(sen).find(cl => dm && cl.includes(dm[0])) ?? sen)];
          const cardGroup = Boolean(grp && [...x.lines.map(l => `${l.value} ${l.meaning}`), ...x.pairs.map(pp => pp.why)].some(t => grp!.test(t) && (!MONTH_NAME_IN.test(t) || (labelHere ? t.includes(labelHere) : monthsHere.every(mm => t.includes(`${mm}월`))))));
          const ordering = /가장 [가-힣]+ (것|일|하나)(부터|만|을|를)|가장 편한 (시간|때)|가장 (가볍게|먼저|급한|부담스러운|중요한 것)/.test(sen);
          // 오탐 검토(major): 읽는 사람이 고르는 말(「가장 편한 사람을 한 명만 떠올려 보세요」)·물음·「~듯」 비유 안의 정도말은 카드 값 부풀림이 아니다.
          const choose = /(떠올려|골라|고르|잡고|표시해|적어|꼽아|정해)[^.?!]*(보세요|세요|봐요|두세요)[.!]?$|[?？]$|나요[.!]?$/.test(sen), analogy = /듯[,，]?\s/.test(after) && !/듯/.test(before);
          // AM2-4: 흐름이 유일한 끝값인 달·해의 「가장 센·거센·잔잔한」은 엔진 값이다.
          const flowVals = [...(b.flows?.values() ?? [])], uniqueEnd = (ganji: string, high: boolean) => { const v = flowVals.find(f2 => f2.ganji === ganji)?.score; if (v === undefined) return false; const ext = high ? Math.max(...flowVals.map(f2 => f2.score)) : Math.min(...flowVals.map(f2 => f2.score)); return v === ext && flowVals.filter(f2 => f2.score === ext).length === 1; };
          const flowEnd = Boolean(dm) && /흐름/.test(sen) && [...monthsIn(sen)].some(g2 => uniqueEnd(g2, /^(센|셉|세|거세|거센|강|크|큰)/.test(after6)) );
          if (dm && !choose && !analogy && !cardGroup && !ordering && !flowEnd && !cardText.includes(`${dm[1]} ${dm[2]}`) && !x.pairs.some(pp => pp.why.includes(`${dm[1]} ${dm[2]}`)) && !/가장 (먼저|마지막|늦게|가까운)/.test(sen)) out.push({ ...at, rule: "degree", detail: `「${dm[0]}」 — 카드에 없는 정도말`, hint: "정도말(가장·한층·훨씬)은 카드 원문에 있을 때만 — 빼고 카드 값 그대로" }); }
        // MBTI 미입력.
        if (!b.mbtiType && /(?<![A-Z])(I|E)(N|S)(T|F)(J|P)(?![A-Z])|MBTI/.test(sen)) out.push({ ...at, rule: "mbti_absent", hint: "MBTI를 적지 않은 책 — MBTI 문장을 쓰지 않는다" });
        // 앞날·결과 단정.
        const past = kp?.when === "past" || plan?.id === "past";
        // 오탐 검토(major): 대운·지도·십성이 「…로 이어져요」(차례 설명), 「경향으로 이어져요」는 단정이 아니다.
        const chain = new RegExp(`^[^,]{0,20}(대운|지도)(은|는|이|가) |(${TG})(으)?로 이어|경향으로 이어`).test(sen);
        if (!past && FUTURE_ASSERT.test(sen) && !soft(sen) && !(/로 이어/.test(sen.match(FUTURE_ASSERT)![0]) && chain)) out.push({ ...at, rule: "future_assert", detail: sen.match(FUTURE_ASSERT)![0], hint: "앞날·결과·남의 반응을 못 박지 않는다 — 카드 꼴(「~하기 좋은」「~하기 쉬운」)이나 조건형으로" });
        // AM2-8 6부(P7 재현 annual-p6b 7.11.0 오탐): 「…묶이는 힘으로 들어와요」 · 「하늘의 정재는 …」은 명리 풀이(앞날 일 아님).
        else if (kp?.when === "future" && FUTURE_IN_KEY.test(sen) && !soft(sen) && !/흐름|기운|쪽|마음[이도은가]|힘[이과도은]|경쟁심|욕심|고집|(맺힘|모임|부딪침|다듬음|어긋남|방해|겹침|힘)(으)?로 들어(와요|옵니다)/.test(sen) && !new RegExp(`(${TG})[^.?!]{0,8}(하늘|땅)|(하늘|땅)(의|에 온|에 든) (${TG})|(${TG})(${TGJ})?(과 (${TG})(${TGJ})?)?(이|가)?( 겹쳐)? 들어(와요|옵니다)`).test(sen)) out.push({ ...at, rule: "future_assert", detail: sen.match(FUTURE_IN_KEY)![0], hint: "앞날 일이 생긴다고 못 박지 않는다 — 「~하기 쉬운 때예요」처럼" });
        if (PAST_PREMISE.test(sen) && !PAST_SOFT.test(sen)) out.push({ ...at, rule: "past_premise", detail: sen.match(PAST_PREMISE)![0], hint: "카드에 없는 지난 행동을 「-던」으로 전제하지 않는다 — 앞으로 할 일로 쓴다" });
        // 지난 대운 나이 × 직장 낱말(대운 2장 둘째 절).
        // 오탐 검토(major): 「동료」 한 낱말이 카드 말(현재형 성향)이면 장면이 아니다 — 지난 장면 꼴이거나 다른 직장 낱말이 있을 때만.
        const pastScene = /(던|었|았|였|했)[^.?!]*$|적은 없었|순간도 있었|때가 있었/.test(sen), workWords = (sen.match(new RegExp(WORKPLACE.source, "g")) ?? []).filter(w => w !== "동료");
        // AM2-4(P3 판독 major-1 B2): 카드(이 장 근거)에 「동료」가 없으면 「동료」 한 낱말도 직장 장면으로 본다(young()이 N 줄도 「또래」로 바꾼다).
        const cardColleague = x.lines.some(l => l.use.includes(c.n) && /동료/.test(`${l.value} ${l.meaning}`));
        if (plan?.id === "past" && si === 1 && (b.prevDayunEndAge ?? 99) < 22 && WORKPLACE.test(sen) && (workWords.length || !cardColleague || (pastScene && !x.lines.some(l => overlap4(sen, l.meaning) >= 6)))) out.push({ ...at, rule: "past_work", detail: `지난 대운은 만 ${b.prevDayunEndAge}세 무렵까지 — 「${sen.match(WORKPLACE)![0]}」`, hint: "지난 대운은 만 22세 전 — 직장·동료 장면을 쓰지 않는다(학교 밖 일상·마음으로)" });
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
/** AM2-7 1부 6: own(장 n) = 그 장 자기 핵심 주장 · 배정된 달 목록 · 설계도 가리키기 말 — 이것과 겹치는 문장은 되풀이로 잡지 않는다. */
export function crossRepeats(chapters: readonly FinalChapter[], skip: ReadonlySet<string> = new Set(), own?: (n: number) => readonly string[]): ChunkFlag[] {
  // 단위 = 장(key 없는 장) 또는 key(달·해 장의 key마다 — P2 판독: 같은 십성 달끼리 생활 문장을 그대로 되풀이). 같은 단위 안의 비슷한 문장은 보지 않는다.
  const out: ChunkFlag[] = [], idx = L.overlapIndex(), phrase = new Map<string, string>();
  const flush = (unit: string, mine: readonly string[]) => { for (const sen of mine) { idx.add(sen); const n = norm(sen); for (let i = 0; i + 14 <= n.length; i++) if (!phrase.has(n.slice(i, i + 14))) phrase.set(n.slice(i, i + 14), unit); } };
  for (const c of chapters) {
    if (c.source === "deterministic") continue;
    let buf: string[] = [];
    c.sections.forEach((s, si) => {
      const isKey = Boolean(c.keys?.includes(s.heading)), unit = isKey ? `${c.n}:${s.heading}` : `${c.n}`, mine: string[] = [];
      s.paragraphs.forEach((p, pi) => { for (const raw of splitSentences(p)) {
        const sen = raw.replace(/[⟪⟫]/g, ""), n = norm(sen); if (skip.has(sen.replace(/[^가-힣A-Za-z0-9]/g, ""))) continue; mine.push(sen);
        let w: string | null = null; for (let i = 0; i + 14 <= n.length && !w; i++) { const x = phrase.get(n.slice(i, i + 14)); if (x !== undefined && x !== unit) w = n.slice(i, i + 14); }
        if ((w || idx.has(sen)) && !(own?.(c.n) ?? []).some(t => t && overlap4(sen, t) >= 6)) out.push({ chapter: c.n, section: si, paragraph: pi, rule: "chapter_repeat", sentence: sen, detail: w ? `앞 장·key와 같은 구절 「${w}」` : "앞 장·key와 거의 같은 문장", hint: "다른 장·key가 이미 쓴 말 — 이 장·key의 근거·장면으로 바꿔 쓴다" });
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
  const out: ChunkFlag[] = [], seen = new Map<string, number>(), secOf = new Map<string, string>();
  let frames = 0, contra = 0;
  for (const c of chapters) {
    if (c.source === "deterministic") continue;
    let framesHere = 0;
    c.sections.forEach((s, si) => s.paragraphs.forEach((p, pi) => { for (const raw of splitSentences(p)) {
      const sen = raw.replace(/[⟪⟫]/g, "");
      const hit = ADVICE.find(([, re]) => re.test(sen));
      // AM2-6 5부: 같은 처방이 한 소제목 안에서 두 번이면 고객이 알아챈다(P5 세운 8.2 「하루 묵히기」 ¶1 → ¶3) — 교체 대상(advice_repeat_sec).
      if (hit) { const n = (seen.get(hit[0]) ?? 0) + 1, here = `${c.n}.${si}`, sameSec = secOf.get(hit[0]) === here; seen.set(hit[0], n); secOf.set(hit[0], here); if (n > 1) out.push({ chapter: c.n, section: si, paragraph: pi, rule: sameSec ? "advice_repeat_sec" : "advice_repeat", sentence: sen, detail: `같은 처방 「${hit[0]}」 ${n}번째${sameSec ? " · 같은 소제목" : ""}`, hint: "같은 처방은 책에서 한 번 — 이 근거에 맞는 다른 행동으로(설계도 「할 일 씨앗」)" }); }
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
  const words = (t: string) => t.replace(/[^가-힣A-Za-z0-9·\s]/g, " ").split(/\s+/).filter(Boolean);
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
          const head2 = norm(`${a[0] ?? ""}${a[1] ?? ""}`), headIsValue = cardValues.some(v => { const nv = norm(v); return nv.length >= 4 && head2.includes(nv.slice(0, Math.min(nv.length, 6))); });
          why = norm(prev) === norm(sen) ? "같은 문장" : E.nearDuplicate(prev, sen) ? "거의 같은 문장" : a.length >= 4 && bw.length >= 4 && a[0] === bw[0] && a[1] === bw[1] && !headIsValue ? "앞 두 어절이 같음" : shared >= 8 ? `${shared}어절 겹침` : jac(prev, sen) >= 0.5 ? "같은 뜻 연속" : null;
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

// ======================================================================
// AM2-4(덕짱님 지시 2026-11-12) — 카드 불변식 · 설계도 빌드 검사 · P3 판독 두 건의 「결정론 검사로 잡을 수 있었던 꼴」 · 처방 사전 · 끝말 상한
// ======================================================================

export type CardIssue = { readonly where: string; readonly rule: "card_engine" | "pair_section" | "plan_advice_only" | "wish_conflict" | "rest_conflict" | "homonym" | "screen_len"; readonly text: string };
const SEAT_LIST = (w: string) => w.split("·").map(x => x.trim()).filter(Boolean).map(x => (/^태어난 /.test(x) ? x : `태어난 ${x}`));
const tgOf = (label: string) => label.replace(/\(.*\)$/, "").trim();
/**
 * 3부 카드 ≡ 엔진 불변식(작가를 부르기 전, 호출 0): 카드의 모든 key 줄(하늘·땅 십성 · 관계 이름·자리 · 공망 · 흐름 · 오행 채움)과 신살·운성 자리를
 * 엔진 배지·특성 값과 대조한다. 화면 「뜻」 한 줄(coreLine)도 같은 엔진 값에서 나왔는지·두 줄 안(26자)인지 본다.
 */
export function cardEngineIssues(x: Intake, brief: Brief): CardIssue[] {
  const out: CardIssue[] = [];
  const entries = new Map((brief.timeline?.entries ?? []).map(e => [e.key, e] as const));
  const byId = new Map(x.lines.map(l => [l.id, l] as const));
  for (const c of x.chapters) for (const k of c.keys ?? []) {
    const e = entries.get(k.key); if (!e) { out.push({ where: k.key, rule: "card_engine", text: "엔진 항목 없음" }); continue; }
    for (const id of k.lines) {
      const l = byId.get(id); if (!l || !l.value.startsWith(`${k.label} `)) continue;
      const v = l.value.slice(k.label.length + 1);
      const tg = /^(하늘|땅) 글자 ([가-힣]{2})/.exec(v);
      if (tg) { const want = tgOf(tg[1] === "하늘" ? e.tenGod.stem : e.tenGod.branch); if (tg[2] !== want) out.push({ where: `${id} ${k.label}`, rule: "card_engine", text: `${tg[1]} 글자 ${tg[2]} ≠ 엔진 ${want}` }); continue; }
      if (v === "공망") { if (!e.badges.some(b => b.kind === "GONGMANG")) out.push({ where: `${id} ${k.label}`, rule: "card_engine", text: "공망 줄인데 엔진 배지에 공망 없음" }); continue; }
      const rel = /^(?:(태어난 [가-힣·]+) 자리와 )?([가-힣]{1,6}(?:합|충|형|파|해|국|방합)(?: 반합)?|원진)$/.exec(v);
      if (rel) {
        const b = e.badges.find(x2 => relName(x2.label) === rel[2]);
        if (!b) { out.push({ where: `${id} ${k.label}`, rule: "card_engine", text: `관계 ${rel[2]} — 엔진 배지에 없음` }); continue; }
        const want = new Set(SEAT_LIST(b.with ?? "")), got = new Set(SEAT_LIST(rel[1] ?? ""));
        if (want.size !== got.size || [...want].some(s2 => !got.has(s2))) out.push({ where: `${id} ${k.label}`, rule: "card_engine", text: `${rel[2]} 자리 「${rel[1] ?? "없음"}」 ≠ 엔진 「${b.with ?? "없음"}」` });
        continue;
      }
      const fl = /흐름\(([가-힣]+)에서 ([가-힣]+)으로\)/.exec(l.meaning);
      if (fl && fl[2] !== FLOW_WORD[e.flow.score]) out.push({ where: `${id} ${k.label}`, rule: "card_engine", text: `흐름 ${fl[2]} ≠ 엔진 ${FLOW_WORD[e.flow.score]}` });
    }
    // 화면이 보여 주는 것(screen) = 엔진 값.
    const sc = k.screen ?? [];
    if (sc[0] !== `흐름 ${FLOW_WORD[e.flow.score]}`) out.push({ where: k.key, rule: "card_engine", text: `화면 흐름 「${sc[0] ?? ""}」 ≠ 엔진 ${FLOW_WORD[e.flow.score]}` });
    for (const b of e.badges) if (!sc.includes(relName(b.label))) out.push({ where: k.key, rule: "card_engine", text: `화면에 배지 ${b.label} 없음` });
    const fills = e.fillsLack?.fills && e.fillsLack.elements.length;
    if (Boolean(fills) !== sc.some(t => / 채움$/.test(t))) out.push({ where: k.key, rule: "card_engine", text: "오행 채움 화면 값 ≠ 엔진" });
    // 핵심(core) = 엔진 가중치로 다시 고른 것(대운 책 — 세운 달은 책의 해 대운 십성을 함께 넘겨 고른다).
    const again = coreOf(e, { short: k.depth === "short" }).map(c2 => c2.name);
    if (x.product === "major_fortune" && JSON.stringify(again) !== JSON.stringify(k.core ?? [])) out.push({ where: k.key, rule: "card_engine", text: `핵심 ${JSON.stringify(k.core)} ≠ 엔진 다시 고름 ${JSON.stringify(again)}` });
    // 흐름표·10년표 「뜻」 한 줄은 390px 표 칸(약 122px)에서 두 줄 안 — 공백 포함 16자 안.
    const line = coreRowLine(coreOf(e, { short: k.depth === "short" }));
    if (line.length > 16) out.push({ where: k.key, rule: "screen_len", text: `「뜻」 한 줄 ${line.length}자: ${line}` });
  }
  // 신살·운성 자리 줄(「태어난 달 자리의 백호대살」) = 특성의 엔진 자리.
  for (const l of x.lines.filter(l2 => l2.subject === "natal")) {
    const m = /^(태어난 (?:해|달|날|시각)) 자리의 ([가-힣]{1,6})(?:\([一-鿿]\))?$/.exec(l.value); if (!m) continue;
    const t = brief.traits.find(t2 => t2.name.replace(/\(.*\)$/, "").trim() === m[2] && t2.chapters.length);
    if (!t) continue;
    const seat = t.positionNote?.match(/^(태어난 (?:해|달|날|시각)) 자리/)?.[1] ?? (t.positions.length === 1 ? ({ year: "태어난 해", month: "태어난 달", day: "태어난 날", hour: "태어난 시각" } as Record<string, string>)[t.positions[0]] : undefined);
    if (seat && seat !== m[1]) out.push({ where: l.id, rule: "card_engine", text: `${m[2]} 자리 ${m[1]} ≠ 엔진 ${seat}` });
  }
  // 십이운성 쇠(衰)와 오행 쇠(금)가 한 책에 함께 있으면 운성 쪽은 한자 꼴로(동음 구분).
  const allText = x.lines.map(l => `${l.value} ${l.meaning}`).join(" ");
  if (/쇠\(금\)/.test(allText)) for (const t of brief.traits.filter(t2 => /^twelveStage/.test(t2.featureId) && t2.name.replace(/\(.*\)$/, "") === "쇠" && t2.chapters.length)) if (!x.lines.some(l => /쇠\(衰\)/.test(l.value))) out.push({ where: t.id, rule: "homonym", text: "십이운성 쇠가 오행 쇠(금)와 같은 꼴" });
  // 2부 짝 없는 명리 줄 × MBTI 줄이 한 절에.
  for (const c of x.chapters) for (const sp of c.sections ?? []) {
    const subj = (id: string) => byId.get(id)?.subject;
    const bs = sp.lines.filter(id => subj(id) === "mbti"), ms = sp.lines.filter(id => /^(natal|dayun|year|month)$/.test(subj(id) ?? ""));
    if (bs.length && ms.length) { const paired = new Set(x.pairs.filter(p2 => bs.includes(p2.mbti) && (p2.use ?? []).includes(c.n)).map(p2 => p2.myeongri)); const lone = ms.filter(id => !paired.has(id)); if (lone.length) out.push({ where: `${c.n}장 「${sp.q}」`, rule: "pair_section", text: `짝 없는 명리 줄 ${lone.join("·")} × MBTI ${bs.join("·")}` }); }
    // 「할 것·피할 것」에는 행동 줄만.
    if (/할 것|피할 것/.test(sp.q)) for (const id of sp.lines) { const l = byId.get(id); if (l && /달(\(같은 세기\))?:|(오르는|살필) 영역|살필 거리|오르는 달|늦출 달|새기 쉬운 달/.test(`${l.value}: ${l.meaning}`)) out.push({ where: `${c.n}장 「${sp.q}」`, rule: "plan_advice_only", text: `${id} ${l.value}` }); }
  }
  // 2부 충돌: 바람 달 ↔ 바람 영역을 늦출 달.
  const wishDomains = (x.lines.find(l => l.subject === "input" && /바람과 이어지는 영역$/.test(l.value))?.meaning ?? "").split("·").map(s2 => s2.trim());
  const wishMonths = new Set(x.lines.filter(l => /바람과 이어지는 영역이 오르는 달|그 바람과 이어지는 영역이 오르는 달/.test(l.value)).flatMap(l => [...monthsIn(l.meaning)]));
  const SLOW: Readonly<Record<string, RegExp>> = { 연애: /연애에서 속도를 늦출 달/, 돈: /돈이 새기 쉬운 달/, 일: /일터 흔들림을 살필 달/, 사람: /관계 속도를 늦출 달/, 마음: /무리하기 쉬운 달/, 공부: /일터 흔들림을 살필 달/ };
  for (const d of wishDomains) { const re = SLOW[d]; if (!re) continue; for (const l of x.lines.filter(l2 => re.test(l2.value))) { const clash = [...monthsIn(l.meaning)].filter(m => wishMonths.has(m)); if (clash.length) out.push({ where: l.id, rule: "wish_conflict", text: `바람 달 ${clash.join("·")}월이 「${l.value}」과 겹침` }); } }
  // AM2-5 2부 충돌: 쉬어 가기 좋은 달 ↔ 연애·사람이 오르는 달 · 바람 달(P4 판독 세운 경계 #6).
  const upMonths = new Set([...wishMonths, ...x.lines.filter(l => /(연애|사람)[^|·]{0,8}오르는 달/.test(l.value)).flatMap(l => [...monthsIn(l.meaning)])]);
  for (const l of x.lines.filter(l2 => /쉬어 가기 좋은 달/.test(l2.value))) { const clash = [...monthsIn(l.meaning)].filter(m => upMonths.has(m)); if (clash.length) out.push({ where: l.id, rule: "rest_conflict", text: `쉬는 달 ${clash.join("·")}월이 연애·사람·바람이 오르는 달과 겹침` }); }
  return out;
}

/** 본문 검사(AM2-4 5부)에 쓰는 문맥: key마다 배지 자리 · 핵심 · 화면 사실. */
const SEAT_PH = "태어난 (?:해|달|날|시각)(?:[·,] ?(?:태어난 )?(?:해|달|날|시각))*";
const SEAT_IN = /태어난 (해|달|날|시각)((?:[·,] ?(?:태어난 )?(?:해|달|날|시각))*)/g;
const seatsIn = (cl: string) => new Set([...cl.matchAll(SEAT_IN)].flatMap(m => [`태어난 ${m[1]}`, ...m[2].split(/[·,]\s*/).filter(Boolean).map(x2 => (/^태어난 /.test(x2) ? x2 : `태어난 ${x2}`))]));
/** 관계 이름 바로 앞(「태어난 Y 자리와(는) X」 「태어난 Y과 X」) 또는 바로 뒤(「X가 태어난 Y 자리와」 「X가 태어난 Y과」)의 자리만 그 관계의 자리로 본다(이웃 관계의 자리를 섞지 않는다). */
const seatNear = (sen: string, i: number, nm: string): Set<string> => {
  const before = sen.slice(Math.max(0, i - 34), i), after = sen.slice(i + nm.length, i + nm.length + 34);
  const mb = new RegExp(`(${SEAT_PH})(?: 자리와(?:는)?|과(?:는)?|와(?:는)?) $`).exec(before), ma = new RegExp(`^(?: 반합|\\(반쯤\\))?(?:이|가|은|는|도)? (${SEAT_PH})(?: 자리와| 자리에|과|와)`).exec(after);
  return seatsIn(mb?.[1] ?? ma?.[1] ?? "");
};
const COUNT_WORD = /절반이 넘|절반 넘게|절반을 넘|대부분의 달|거의 모든 달|모든 달에|열두 달 내내|과반/;
const LABEL_LEAK = /[가-힣]\((태어난 [^)]*자리와)\)|\(태어난 (해|달|날|시각) · [가-힣]{2}\)|생활 결|(연애|돈|일|사람|마음) 신호(는|가)? (오름|내림|보통)|\(반쯤\)\(|\(반쯤\)(은|는|이|가|과|와)/;
// 마디 첫머리·「…의 」 뒤만(「도화살의 매력이 돈 쪽에서는 … 번지기도」는 우리말 쓰임 — 오탐 검토).
const ANGLE_NAME = /(?:^|[,.] |의 |반면 |한편 )(일|돈|연애|성격) 쪽(에서는|에서|에|의 얼굴) /;
// 겪을 일·습관 단정. 「…쉬운 때도 있어요」 「…수 있을 거예요」(경향·가능)는 단정이 아니다.
const HABIT = /떠오르죠|떠오를 거예요|떠오르지 않나요|(?<!(쉬운|좋은|수 있는|있는) )(날|때|순간)이 (있을|올) 거예요|서두를 일이 없|(?<!(쉬운|좋은|수 있는|있는|하기 좋은) )(날|때)(이|가|도) (있어요|있습니다)[.!]?$/;
/** 고아 지시(AM2-4 5부, P3 판독 annual-1 차단 #2): 문단 첫 문장이 앞 문장의 달 목록을 가리킨다(앞 문장이 지워진 자리). */
const ORPHAN_REF = /^(오르는 달|흔들리는 달|늦출 달|살필 달|그 달들|이 달들|그 두 달|이 두 달|그 세 달|이 세 달|그 네 달|이 네 달)(에는|은|는|이|도|엔) /;
const TIME_REL = /오늘 (밤|저녁|퇴근길|안에|중으로|하루)|(?<![가-힣])내일(로| 아침| 하루|은|부터)|(?<![가-힣])다음 달(의|에|이|은|부터)/;
const WISH_TALK = /적어 (주신|준) (바람|소망|고민)|바람을 향한|당신의 바람|그 바람|이 바람|바람과 이어|«바람»/;
// 「X는 태어난 Y 자리와 A과 B가 …」(자리와 뒤에 새 주어 — 동사 없이 명사구가 바로 온다). 「자리와 맺혀 새 일이」는 바른 꼴.
const RELATION_FRAME = /[가-힣](합|충|형|파|해|국|원진)( 반합|\(반쯤\))?(은|는) 태어난 [가-힣·]+ 자리와 [가-힣]{1,6}(과|와) [가-힣 ]{1,8}(이|가) /;
const CAUSAL = /만큼[, ]|니까[, ]|(?<=[가-힣])니, |이라서 |라서[, ]|(?<=[가-힣])이라[, ]|(?<=[가-힣])(와|아|어|여|해|져|워)서[, ]|덕분에 /;
const SCREEN_FLOW = /흐름(이|은|도)? [^.?!]{0,8}(잔잔|느린|느려|보통인|활발|거센|거세)/, SCREEN_FILL = /모자란 쪽을 채|부족한 기운을 채|(쇠|물|불|나무|흙)\((금|수|화|목|토)\)[^.?!]{0,6}(채워|채우)/;
const HEAD_ECHO_END = /(해|달)(예요|입니다|이에요|이기도 해요)[.!]?$/;
const MY_WORD2 = /(나무|불|흙|쇠|물)의 기운|반합|삼합|대운|십성|[갑을병정무기경신임계][자축인묘진사오미신유술해](월|년|일주)/;

/** AM2-4 5부 본문 검사(blockFlags가 부른다). */
export function am24Flags(chapters: readonly FinalChapter[], b: BlockCtx): ChunkFlag[] {
  const out: ChunkFlag[] = [];
  const x = b.intake, plans = new Map(x.chapters.map(c => [c.n, c])), lineById = new Map(x.lines.map(l => [l.id, l]));
  const keyPlans = new Map(x.chapters.flatMap(c => (c.keys ?? []).map(k => [k.key, k] as const)));
  const entries = new Map((b.brief?.timeline?.entries ?? []).map(e => [e.key, e] as const));
  const cardText = x.lines.map(l => `${l.value} ${l.meaning}`).join(" ");
  const noWish = !x.person.some(p => /^적어 준 바람/.test(p));
  const stageSoe = /쇠\(衰\)/.test(cardText) && /쇠\(금\)/.test(cardText);
  const mbtiWord = b.mbtiAnchor ? new RegExp(`${b.mbtiAnchor.source}|성격 유형`) : null;
  // 십성 줄(tg_join): 그 key 하늘·땅 십성의 엔진 뜻·영역 줄.
  const notes = (b.brief?.timeline?.tenGodNotes ?? {}) as Record<string, { meaning: string }>;
  const allNames = new Set([...(b.keyRels?.values() ?? [])].flatMap(s2 => [...s2]));
  for (const c of chapters) {
    if (c.source === "deterministic") continue;
    const plan = plans.get(c.n);
    const chapterPairs = x.pairs.filter(p => !p.use || p.use.includes(c.n));
    c.sections.forEach((s, si) => {
      const kp = c.keys?.includes(s.heading) ? keyPlans.get(s.heading) : undefined, e = kp ? entries.get(kp.key) : undefined;
      // AM2-7 1부 6: 설계도 둘째 핵심(반드시 쓸 것 · 둘째 고리 — 이름 + 뜻 한 마디)은 화면 되풀이가 아니다.
      const coreNames = new Set([...(kp?.core ?? []), ...(kp?.must ?? []).map(m2 => m2.what), ...(kp?.links ?? []).filter(l2 => l2.kind === "second" && l2.rel).map(l2 => l2.rel!)].map(n2 => n2.replace(/ 반합$/, "")));
      let prev = "", paraMbti = false; void prev;
      s.paragraphs.forEach((p, pi) => splitSentences(p).forEach((raw, sj) => {
        const sen = raw.replace(/[⟪⟫]/g, ""), at = { chapter: c.n, section: si, paragraph: pi, sentence: sen };
        const flag = (rule: string, hint: string, detail?: string) => out.push({ ...at, rule, hint, ...(detail ? { detail } : {}) });
        // seat_badge: 관계 이름과 같은 절의 자리 = 엔진 배지 자리(P3 판독 annual-1 차단 #5·#6).
        if (kp && e) seat: for (const bd of e.badges) { const nm = bd.label.replace(/\(.*\)$/, "").trim(); if (nm.length < 2) continue;
          for (let i = sen.indexOf(nm); i >= 0; i = sen.indexOf(nm, i + 1)) { const got = seatNear(sen, i, nm), want = new Set(SEAT_LIST(bd.with ?? "")); const bad = [...got].filter(s2 => !want.has(s2)); if (bad.length && want.size) { flag("seat_badge", `${nm}는 ${bd.with} 자리 — 엔진 배지 그대로`, `${nm} 자리 ${bad.join("·")} ≠ ${bd.with}`); break seat; } } }
        // key_tengod: key 본문의 「X가 하늘·땅」 「X 달·해」 십성 = 그 key의 하늘·땅(한자 주석 오탐 「거센 편인 달」 — P3 판독 annual-1 #4).
        if (kp && e) { const sky = tgOf(e.tenGod.stem), ground = tgOf(e.tenGod.branch), dt = e.dayun?.tenGod ? tgOf(e.dayun.tenGod) : "";
          const m = new RegExp(`(?<!(?:[는은던한인운른큰진된간난센린쁜] ))(${TG})(?:\\([^)]*\\))?(?:이|가)? (하늘|땅)|(?<!(?:[는은던한인운른큰진된간난센린쁜] ))(${TG})(?:\\([^)]*\\))? (달|해)(이라|이에요|입니다|예요|이니|인)`).exec(sen);
          const nm = m?.[1] ?? m?.[3]; if (nm && nm !== sky && nm !== ground && nm !== dt) flag("key_tengod", `${kp.label}은 하늘 ${sky} · 땅 ${ground} — 다른 십성을 그 달·해의 십성으로 쓰지 않는다`, `「${m![0]}」`); }
        // count_claim: 개수 말은 카드 값이 있을 때만(P3 판독 annual-1 차단 #1).
        { const cm = COUNT_WORD.exec(sen); if (cm && !cardText.includes(cm[0])) flag("count_claim", "개수 말(절반·대부분·한 해 내내)은 카드에 그 수가 있을 때만 — 달 이름을 그대로 나열한다", cm[0]); }
        // homonym: 십이운성 쇠(衰)와 오행 쇠(금)가 함께인 책에서 꼴 없는 「쇠」(P3 판독 annual-1 차단 #3).
        // 십이운성 문맥(「쇠에 해당」 「쇠 단계」 「자리의 쇠」 「쇠는 … 물러서·노련·경험으로·판을 읽」)의 꼴 없는 「쇠」만 — 오행 쇠(「쇠 글자」 「땅과 쇠가」)는 오행 말이다.
        if (stageSoe && /(?<![가-힣])쇠(에 해당|\s?단계|의 단계|(이|가|는|은) [^.?!]{0,20}(물러|노련|경험으로|판을 읽|단계|운성|성질))|자리의 쇠(?!\()/.test(sen)) flag("homonym", "십이운성은 「쇠(衰)」, 오행은 「쇠(금)」 — 운성을 꼴 없이 「쇠」로 쓰지 않는다", "운성 「쇠」에 한자 꼴 없음");
        if (LABEL_LEAK.test(sen)) flag("label_leak", "카드 값 꼴(괄호 자리·「생활 결」·「신호는 오름」·「(반쯤)」)을 옮기지 않는다 — 「태어난 날 자리와 축오해가 걸려요」처럼 문장으로", sen.match(LABEL_LEAK)![0]);
        if (ANGLE_NAME.test(sen)) flag("angle_name", "각도 이름(「일 쪽에서는」)을 쓰지 않는다 — 「일에서는」처럼", sen.match(ANGLE_NAME)![0]);
        // subject_unit: 관계가 주어인데 「…달입니다」(P3 판독 annual-1 경계 #8·#9).
        { const nm = [...allNames].filter(n2 => n2.length >= 2 && new RegExp(`${esc2(n2)}(\\([^)]*\\))*(은|는) [^.?!]{4,90} (달|해)(입니다|예요|이에요)[.!]?$`).test(sen)).sort((p1, p2) => sen.lastIndexOf(p2) - sen.lastIndexOf(p1))[0]; if (nm) flag("subject_unit", `「${nm}은 … 달입니다」는 비문 — 「${nm}이 걸려 …하기 쉬워요」처럼`, nm); }
        if (sj === 0 && !kp && ORPHAN_REF.test(sen) && !s.paragraphs.slice(0, pi).some(pp => monthsIn(pp).size > 0)) flag("orphan_ref", "앞 문장의 달 목록을 가리키는데 그 목록이 없다 — 달 이름을 다시 적거나 문장을 다시 쓴다", sen.match(ORPHAN_REF)![0]);
        // AM2-8 1부(P7 major-p5 3.0.2 「다만 말과 결과물이 앞서 나갈 때가 있어요.」 — 카드 경향의 살필 말): 「다만 · 때로는 · 가끔은」으로 여는 경향 문장은 습관 단정이 아니다.
        if (HABIT.test(sen) && !/[?？]$/.test(sen) && !/^(다만|때로는|가끔은|가끔) /.test(sen)) flag("habit_assert", "겪을 일·습관으로 정하지 않는다(「떠오르죠」「…날이 있을 거예요」「서두를 일이 없습니다」) — 「…해 보기 좋은 때예요」처럼", sen.match(HABIT)![0]);
        // 오탐 검토(AM2-4 time_extra 6): 「…날에는 … 내일로」(습관 틀) · 달 이름·「이 달」에 매인 「다음 달」 · 달·해 key 안의 「다음 달」은 이야기 안 상대 시점.
        const relTime = TIME_REL.exec(sen), habitual = /(날|때)(에는|엔|이면|면) |하루 시작에/.test(sen.slice(0, relTime?.index ?? 0)), anchored = Boolean(relTime && /다음 달/.test(relTime[0]) && (kp || monthsIn(sen.slice(0, relTime.index)).size || /이 달(에는|은)/.test(sen)));
        if (relTime && !habitual && !anchored) flag("time_extra", "읽는 날에 기대는 말(「오늘 밤」「내일」「다음 달」)을 쓰지 않는다 — 「그날 저녁」「다음 날」「그다음 달」처럼", sen.match(TIME_REL)![0]);
        if (noWish && WISH_TALK.test(sen)) flag("wish_absent", "이 사람은 바람을 적지 않았다 — 바람·소망을 말하지 않는다", sen.match(WISH_TALK)![0]);
        if (RELATION_FRAME.test(sen)) flag("relation_frame", "「X는 태어난 Y 자리와 A와 B가 …」는 비문 — 「태어난 Y 자리와 X가 걸려 …」처럼", sen.match(RELATION_FRAME)![0]);
        // pair_outside(P3 판독 major-1 C2): 짝 없는 장에서 앞 문장 MBTI 말 + 이 문장 명리 말(「그 생각 가운데 … 쇠의 기운이 돕는 몫」).
        if (sj === 0) paraMbti = false;
        if (mbtiWord && !chapterPairs.length && paraMbti && MY_WORD2.test(sen) && !mbtiWord.test(sen) && /^(그|이)[ 가-힣]{0,8}|그 (생각|힘|마음|가운데|중)|그중/.test(sen)) flag("pair_link", "이 장에는 명리×MBTI 짝이 없다 — 앞 문장의 MBTI 말을 명리 근거에 잇지 않는다(문장을 나눠 각자 근거로)", "앞 문장 MBTI + 이 문장 명리");
        // tg_join(P3 판독 major-1 B7 「평가와 기준이 또렷해지는 만큼, 남들이 안 보는 분야에서 실력이 쌓이기 좋은 해입니다」): 한 key의 하늘 십성 줄과 땅 십성 줄
        // (서로 다른 십성의 뜻·영역 줄)을 「만큼·니·라서」로 원인 → 결과처럼 이은 주장. 오탐 검토(AM2-4 card_join 28/45 오탐)로 넓은 「다른 카드 줄 인과」 검사는 뺐다 — 그 꼴은 작가 규칙(R_BASE 금지 예시)이 맡는다.
        if (kp && e) { const cm = CAUSAL.exec(sen); const sky = tgOf(e.tenGod.stem), ground = tgOf(e.tenGod.branch);
          if (cm && sky !== ground) { const leftAll = sen.slice(0, cm.index), cuts = [...leftAll.matchAll(/(지만|이라면|라면|는데|(?<=[가-힣])고|(?<=[가-힣])며),? /g)].map(m2 => m2.index! + m2[0].length);
            const left = leftAll.slice(cuts.length ? Math.max(...cuts) : 0), right = sen.slice(cm.index + cm[0].length);
            const advice = /(세요|보세요|두세요|마세요|봐요|야 해요|야 합니다|게 좋아요|편이 (좋|낫)[가-힣]*|면 좋(아요|습니다)|필요해요|필요합니다|좋아요|좋습니다)[.!]?$/.test(right.trim());
            const ownOf = (tg: string) => [notes[tg === sky ? e.tenGod.stem : e.tenGod.branch]?.meaning ?? "", ...(tg === sky ? (e.material?.domains ?? []) : [])].filter(Boolean);
            const hitTg = (t2: string, tg: string) => ownOf(tg).some(t3 => overlap4(t2, t3) >= 3);
            // 원인 마디가 결과 줄의 십성을 이름으로 말하면 한 십성의 말이다(오탐 검토 2차: 「…정관이 앉아서 규칙을 지킨 만큼 평판이 쌓여요」).
            const leftNames = new Set([...left.matchAll(new RegExp(TG, "g"))].map(m2 => m2[0]));
            if (!advice && norm(left).length >= 8 && ((hitTg(left, sky) && hitTg(right, ground) && !hitTg(right, sky) && !leftNames.has(ground)) || (hitTg(left, ground) && hitTg(right, sky) && !hitTg(right, ground) && !leftNames.has(sky))))
              flag("tg_join", `하늘 ${sky}와 땅 ${ground}의 뜻은 따로 — 「만큼·니·라서」로 한쪽이 다른 쪽의 원인인 것처럼 잇지 않는다`, `${sky} ${cm[0].trim()} ${ground}`); } }
        // 화면 사실 되풀이(1부): key 본문에 흐름 말 · 오행 채움 · 핵심 밖 관계 이름 · 카드 할 일 · 행동.
        if (kp) {
          if (SCREEN_FLOW.test(sen)) flag("screen_repeat", "흐름은 화면 카드가 보여 준다 — 본문에 되풀이하지 않는다", sen.match(SCREEN_FLOW)![0]);
          else if (SCREEN_FILL.test(sen)) flag("screen_repeat", "오행 채움은 화면 카드가 보여 준다 — 본문에 되풀이하지 않는다", sen.match(SCREEN_FILL)![0]);
          else if (/(세요|보세요|두세요)[.!]?$/.test(sen) && !/(떠올려|그려) 보세요[.!]?$/.test(sen)) flag("screen_repeat", "달·해 본문에는 행동을 쓰지 않는다(할 일은 화면 카드)", "key 본문 행동");
          else if (kp.todo && overlap4(sen, kp.todo) >= 9 && /(보기|하기|두기|기 좋|해 보|해 두)/.test(sen)) flag("screen_repeat", "할 일은 화면 카드가 보여 준다 — 본문에 같은 행동을 쓰지 않는다", "카드 할 일 되풀이");
          else { const other = [...(b.keyRels?.get(kp.key) ?? [])].find(n2 => !coreNames.has(n2) && n2.length >= 2 && sen.includes(n2)); if (other) flag("screen_repeat", `관계 ${other}는 화면 배지가 보여 준다 — 본문은 핵심(${[...coreNames].join("·")})만`, other); }
          // head_echo: 머리 문장 「…달이에요」 바로 뒤 첫 문장도 「…달이에요」(경미, P3 판독 major-1 m15 나).
          if (pi === 0 && sj === 0 && HEAD_ECHO_END.test(sen) && (/^이 (달|해)(은|는) /.test(sen) || HEAD_ECHO_END.test(kp.head))) flag("head_echo", "머리 문장도 「…달·해예요」로 끝난다 — 첫 문장은 그 핵심의 뜻으로 다른 끝을", "머리 뒤 같은 끝");
        }
        prev = sen; if (mbtiWord?.test(sen)) paraMbti = true;
      }));
      // pointer_expand: 카드가 「X의 뜻은 앞의 L과 같고」인데 L의 뜻 줄을 다시 풀어 씀(P3 판독 annual-1 경미 #15).
      if (kp) for (const id of kp.lines) { const l = lineById.get(id), m = /^([가-힣]{2})의 뜻은 앞의 (.+?)과 같고/.exec(l?.meaning ?? ""); if (!m) continue;
        const o = [...keyPlans.values()].find(k2 => k2.label === m[2]); const prevLine = o?.lines.map(i2 => lineById.get(i2)).find(l2 => l2 && / 글자 /.test(l2.value) && l2.value.includes(m[1]))?.meaning ?? "";
        s.paragraphs.forEach((p, pi) => splitSentences(p).forEach(raw => { const sen = raw.replace(/[⟪⟫]/g, ""); if (prevLine && overlap4(sen, prevLine) >= 8) out.push({ chapter: c.n, section: si, paragraph: pi, sentence: sen, rule: "pointer_expand", hint: `${m[1]}의 뜻은 앞의 ${m[2]}과 같다 — 다시 풀지 말고 이 달에 달라지는 것만`, detail: `앞의 ${m[2]} 뜻 되풀이` }); })); }
    });
    void plan;
  }
  return out;
}

/** 처방 종류 되풀이(2부 사전): 같은 종류가 책에서 두 번(화면 카드 할 일이 먼저 자리를 잡는다). 두 번째부터. */
export function rxRepeats(chapters: readonly FinalChapter[], x: Intake): ChunkFlag[] {
  const out: ChunkFlag[] = [], used = new Map<RxKind, string>(), usedSec = new Map<RxKind, string>();
  for (const c of x.chapters) for (const k of c.keys ?? []) if (k.todo) for (const kd of rxKindsOf(k.todo)) if (!used.has(kd)) used.set(kd, `${k.label} 카드`);
  for (const c of chapters) {
    if (c.source === "deterministic") continue;
    const own = x.chapters.find(p => p.n === c.n)?.rx?.use ?? null;
    let ownUsed = false;
    c.sections.forEach((s, si) => s.paragraphs.forEach((p, pi) => { for (const raw of splitSentences(p)) {
      const sen = raw.replace(/[⟪⟫]/g, ""), kinds = rxOfSentence(sen); if (!kinds.length) continue;
      // 그 장이 맡은 종류는 그 장 안에서 풀어 써도 된다(오탐 검토: 쉬기 장의 「쉬는 법」 둘째 문장).
      const taken = kinds.find(kd => used.has(kd) && !(kd === own && used.get(kd) === `${c.n}장`) && !(kd === own && !ownUsed));
      if (taken) { const sameSec = usedSec.get(taken) === `${c.n}.${si}`; out.push({ chapter: c.n, section: si, paragraph: pi, rule: sameSec ? "rx_repeat_sec" : "rx_repeat", sentence: sen, detail: `처방 「${taken}」은 ${josa(used.get(taken) ?? "", "이가")} 맡음${sameSec ? " · 같은 소제목" : ""}`, hint: `같은 처방 종류는 책에서 한 곳 — 이 장의 「쓸 처방 종류」(${own ?? "사전 밖 행동"})로` }); continue; }
      for (const kd of kinds) { used.set(kd, `${c.n}장`); usedSec.set(kd, `${c.n}.${si}`); if (kd === own) ownUsed = true; }
    } }));
  }
  return out;
}

/** 끝말 빈도 상한(5부, 목록 없음): 문장 끝 두 어절(조사·부호 뺀 한글 5자 이상)이 책에서 BOOK_CAP을, 한 장에서 CHAPTER_CAP을 넘으면 넘는 곳마다. 의존 명사 끝(「수 있어요」 「편이에요」)은 문법 꼴이라 세지 않는다. */
export const ENDING_CAP = { book: 4, chapter: 2 } as const;
const GRAMMAR_END = /^(수|것|거|게|편|쪽|중|뿐|만큼|듯|줄|때문|적|법|모양|셈|터|리)(가|이|은|는|도|을|를)? /;
export function endingCaps(chapters: readonly FinalChapter[], skip: ReadonlySet<string> = new Set()): ChunkFlag[] {
  const out: ChunkFlag[] = [], book = new Map<string, number>();
  for (const c of chapters) {
    if (c.source === "deterministic") continue;
    const here = new Map<string, number>();
    c.sections.forEach((s, si) => s.paragraphs.forEach((p, pi) => { for (const raw of splitSentences(p)) {
      if (skip.has(raw.replace(/[^가-힣A-Za-z0-9]/g, ""))) continue;
      const sen = raw.replace(/[⟪⟫«»"“”'‘’]/g, "").replace(/[.!?？]+$/, "").trim(); const w = sen.split(/\s+/); if (w.length < 4) continue;
      const end = w.slice(-2).join(" "); if (GRAMMAR_END.test(`${end} `) || end.replace(/[^가-힣]/g, "").length < 5) continue;
      const n = (book.get(end) ?? 0) + 1, h = (here.get(end) ?? 0) + 1; book.set(end, n); here.set(end, h);
      if (n > ENDING_CAP.book || h > ENDING_CAP.chapter) out.push({ chapter: c.n, section: si, paragraph: pi, rule: "ending_cap", sentence: raw.replace(/[⟪⟫]/g, ""), detail: `끝 「${end}」 책 ${n}번째 · 장 ${h}번째`, hint: "같은 끝 꼴을 되풀이하지 않는다 — 다른 꼴로 끝맺는다" });
    } }));
  }
  return out;
}
void seatShort;

// ======================================================================
// AM2-5 2부(덕짱님 지시 2026-11-12) — P4 판독 두 건의 「결정론으로 잡을 수 있었던 꼴」 가운데 구조(문단 교체 · 지우기 규칙 · 같은 주장 설계 · 카드 고객 말)로 막히지 않는 것만.
// ======================================================================
const RANGE_WORD = /(?:월|월 · [가-힣]{2}월)\s*(?:에서|부터)\s[^.?!]{0,40}(?:사이|까지|이어지)|(?<![가-힣])(봄|여름|가을|겨울|상반기|하반기) (달들|내내 이어지는 달)|(가을|여름|봄|겨울) 달(들)?과/;
const RULE_ECHO = /말할 수 있고|라고만 말할|다고 보지는 않|(으)?로 보지는 않아요|인과로|라는 것만 (말|짚)|만 말할 수 있|한 문장 ?(안|속)에서 겹|(같은|한) ?쪽으로 겹(쳐요|칩니다|쳐 있|친다)|채워지는 쪽|채우는 쪽(을|이)? ?먼저|한쪽의 빈 곳|비는 곳을 다른 쪽이 채우|버릇을 먼저 두고|(받쳐 주는|거스르는|채우는|가리키는) 꼴/;
const PAST_Q = /(적이|날이|때가|순간이|일이) (없나요|있었나요|있지 않나요|없었나요|있지 않았나요|없지 않았나요)[?？]/;
// 오탐 검토: 타고난 성향을 말하는 「…쪽이 당신답습니다」는 습관 단정이 아니다 — 구체 행동(「…하는 모습도 당신답죠」)만.
const HABIT2 = /(?<!쪽이 )당신답(죠|지요|네요|습니다)|당신다워(요|서)|당신다운 (모습|장면)이(죠|에요)/;
/** 근거 밖 관계 이름(P4 판독 세운 차단 #1 「태어난 날 자리와 축오해가 아닌」 — 2장 근거에 축오해가 없다) · 달 목록 범위 말(#2 「2월에서 11월 사이에」 · 경계 #2 「가을 달들」) ·
 *  작가 규칙 문구(대운 B7 「같은 시기라는 것만 말할 수 있고」) · 읽는 날에 기대는 마감(대운 B11 「2026년 안에」) · 지난 경험 물음(세운 경계 #4 「…적이 없나요?」)·습관 단정(#9 「당신답죠」) · 짧은 key(안전망). */
export function am25Flags(chapters: readonly FinalChapter[], b: BlockCtx): ChunkFlag[] {
  const out: ChunkFlag[] = [];
  const x = b.intake, plans = new Map(x.chapters.map(c => [c.n, c])), lineById = new Map(x.lines.map(l => [l.id, l]));
  const keyPlans = new Map(x.chapters.flatMap(c => (c.keys ?? []).map(k => [k.key, k] as const)));
  const yearE = b.brief?.timeline?.entries.find(e => e.kind === "year");
  const yearNames = new Set((yearE?.badges ?? []).map(bd => bd.label.replace(/\(.*\)$/, "").trim()));
  // 카드 달 목록(줄마다 달 번호 — 다음 해 1월은 13).
  const monthNumLists = x.lines.map(l => new Set([...`${l.value} ${l.meaning}`.matchAll(/(?:(2028)년 )?(1[0-2]|[1-9])월 · /g)].map(m => Number(m[2]) + (m[1] ? 12 : 0)))).filter(set2 => set2.size >= 2);
  const names = new Set([...[...(b.keyRels?.values() ?? [])].flatMap(s2 => [...s2]), ...(b.brief?.timeline?.entries ?? []).flatMap(e => e.badges.map(bd => bd.label.replace(/\(.*\)$/, "").trim()))].filter(n => n.length >= 3 && n !== "공망"));
  const baseYear = Number((b.brief?.baseDate ?? "").slice(0, 4)) || undefined;
  void yearE;
  for (const c of chapters) {
    if (c.source === "deterministic") continue;
    const plan = plans.get(c.n), past = plan?.id === "past";
    const chText = [...new Set([...(plan?.sections ?? []).flatMap(sp => [...sp.lines, ...(sp.pointerIds ?? [])]), ...(plan?.allowed ?? [])])].map(id => { const l = lineById.get(id); return l ? `${l.value} ${l.meaning}` : ""; }).join(" ") + " " + x.pairs.filter(p2 => !p2.use || p2.use.includes(c.n)).map(p2 => p2.why).join(" ");
    c.sections.forEach((s, si) => {
      const kp = c.keys?.includes(s.heading) ? keyPlans.get(s.heading) : undefined;
      s.paragraphs.forEach((p, pi) => splitSentences(p).forEach(raw => {
        const sen = raw.replace(/[⟪⟫]/g, ""), at = { chapter: c.n, section: si, paragraph: pi, sentence: sen };
        const flag = (rule: string, hint: string, detail?: string) => out.push({ ...at, rule, hint, ...(detail ? { detail } : {}) });
        // 오탐 검토(AM2-5 18권): 근거 줄이 관계를 이름 없이 풀어 적은 장(「미가 태어난 달 땅 글자 축과 충」)도 그 관계를 가진 것으로 본다 — 이름의 글자와 관계 말이 모두 근거에 있으면.
        const inBasis = (n: string) => { if (chText.includes(n)) return true; const kind = n.slice(-1), cs = [...n.slice(0, -1)].filter(ch2 => /[갑을병정무기경신임계자축인묘진사오미신유술해]/.test(ch2)); if (cs.length < 2) return false;
          const word = ({ 합: "합|묶|맞물", 충: "충|부딪", 형: "형|다듬|눌러", 파: "파|어긋", 해: "방해", 국: "국|반합|삼합|모이|모여" } as Record<string, string>)[kind] ?? "합";
          // 근거가 이름 대신 종류 말(「천간합」 「육합」)로 적힌 합(오탐 검토: 대운 3장 「이 대운 기둥과 태어난 해·날 자리: 천간합」 — 갑기합).
          if (kind === "합" && (cs.every(ch2 => /[갑을병정무기경신임계]/.test(ch2)) ? /천간합|하늘 글자끼리/ : /육합/).test(chText)) return true;
          return new RegExp(`${cs[0]}[^.|·]{0,14}${cs[1]}[^.|·]{0,16}(${word})|${cs[1]}[^.|·]{0,14}${cs[0]}[^.|·]{0,16}(${word})`).test(chText); };
        // 그 해(세운 책의 해) 관계와, 문장에 이름이 나온 달·해의 관계는 사실 그대로라 근거 밖이 아니다(P4 차단 #1은 그 해와 관계없는 축오해).
        const ctxNames = new Set([...(b.intake.product === "annual_fortune" ? yearNames : []), ...[...keyPlans.values()].filter(k2 => sen.includes(k2.label) || (/년 [가-힣]{2}년$/.test(k2.label) && sen.includes(k2.label.replace(/^\d{4}년 /, "")))).flatMap(k2 => [...(b.keyRels?.get(k2.key) ?? [])])]);
        if (!kp) { const nm = [...names].find(n => sen.includes(n) && !inBasis(n) && !ctxNames.has(n)); if (nm) flag("relation_scope", `「${nm}」은 이 장 근거에 없는 관계다 — 이 장 카드 줄의 관계만(부정 「…가 아닌」으로도 쓰지 않는다)`, nm); }
        // 오탐 검토(AM2-5 18권 「7월 정미월부터 10월 경술월까지」): 구간이 카드 목록의 이어진 달과 꼭 같으면 바른 줄임이다 — 끝이 없거나(「…부터 이어지는」) 목록에 없는 달이 끼면 걸린다.
        const exactRun = (t: string) => { const r = /(?:(2028)년 )?(1[0-2]|[1-9])월[^.?!]{0,12}?(?:에서|부터)\s(?:(2028)년 )?(1[0-2]|[1-9])월[^.?!]{0,10}?(?:까지)/.exec(t); if (!r) return false;
          const a = Number(r[2]) + (r[1] ? 12 : 0), z = Number(r[4]) + (r[3] ? 12 : 0); if (z <= a) return false; const want = Array.from({ length: z - a + 1 }, (_, i) => a + i);
          return monthNumLists.some(set => want.every(n2 => set.has(n2))); };
        if (MONTH_NAME_IN.test(sen) || /(봄|여름|가을|겨울) 달/.test(sen)) { const m = RANGE_WORD.exec(sen); if (m && /달|때/.test(sen) && !exactRun(sen)) flag("month_range", "달 목록은 카드의 달 이름을 그대로 나열한다 — 「A에서 B 사이」 「A부터 이어지는」 「가을 달들」처럼 범위·묶음 말로 바꾸지 않는다", m[0]); }
        if (RULE_ECHO.test(sen)) flag("rule_echo", "쓰는 쪽의 규칙 말(「…만 말할 수 있고」 「…다고 보지는 않아요」)을 본문에 쓰지 않는다 — 같은 시기라는 것만 내용으로", sen.match(RULE_ECHO)![0]);
        { const dm = /(20\d\d)년 (안에|안으로|내에|말까지)|올해 안에|연말까지|이달 안에/.exec(sen); if (dm && (!dm[1] || (baseYear && Number(dm[1]) <= baseYear))) flag("date_deadline", "읽는 날에 기대는 마감(「2026년 안에」)을 쓰지 않는다 — 기한 없이 「…해 두면」으로", dm[0]); }
        if (!past && kp?.when !== "past" && PAST_Q.test(sen)) flag("past_question", "겪었는지 모르는 일을 「…적이 없나요?」로 묻지 않는다 — 「…할 때라면」 같은 조건으로", sen.match(PAST_Q)![0]);
        if (HABIT2.test(sen)) flag("habit_assert", "「당신답죠」처럼 그 사람의 습관·모습으로 못 박지 않는다 — 「…해 보기 좋은 때예요」처럼", sen.match(HABIT2)![0]);
      }));
      // 짧은 key(안전망): 머리 문장 뺀 본문이 설계 하한의 60% 아래면 그 key 전체를 고친다(분량은 고리·장면·짝에서 — 덕짱님 결정 14-7 2번).
      if (kp) { const len = s.paragraphs.join(" ").replace(/[⟪⟫]/g, "").length, lo = (kp.depth === "deep" ? KEY_TARGET.deep : kp.depth === "short" ? KEY_TARGET.short : plan?.target ?? KEY_TARGET.month)[0];
        if (len < lo * 0.6) out.push({ chapter: c.n, section: si, paragraph: -3, rule: "key_len", sentence: `[분량] ${kp.label} 본문 ${len}자(하한 ${lo}자)`, hint: `본문이 짧다 — 설계도의 연결 고리·짝·장면으로 이 사람에게 갖는 뜻을 더한다(같은 말로 늘리지 않는다, ${lo}자 안팎)` }); }
    });
  }
  return out;
}
/** AM2-5 2부 경미(점수로만): 처방 뒤 결과 꼬리(대운 m25) · 칸 이름으로 여는 key 문장(대운 m15 마) · 각도 말 되풀이(세운 경미 #2). */
const ANGLE_KO_ALL: Readonly<Record<string, string>> = { love: "연애와 인연", marriage: "결혼과 가족", work: "일과 진로", money: "돈 관리", study: "공부", relationships: "사람 사이", alone: "혼자 있는 시간", family: "가족" };
const PROMISE = /^그 [가-힣 ]{1,14}(이|가) [^.?!]{0,40}(됩니다|될 거예요|만들어 줍니다|되어 줄 거예요|지켜 줄 거예요|열어 줄 거예요)[.!]?$/;
const OPENER = /^(일|돈|관계|컨디션|연애|사람|마음)(에서는|쪽에서는|은|는) /;
export function valueFlags(chapters: readonly FinalChapter[]): ChunkFlag[] {
  const out: ChunkFlag[] = []; let promise = 0; const openerKeys = new Map<string, number>(), angleSeen = new Map<string, number>();
  // 오탐 검토: 한 낱말 각도(「공부」 「가족」)와 우리말로 흔한 「사람 사이」 「돈 관리」는 세지 않는다 — 각도 이름이 문장 재료가 된 꼴(「혼자 있는 시간에」 「일과 진로의 눈으로」)만.
  const angles = [...new Set(Object.values(ANGLE_KO_ALL))].filter(ag => / /.test(ag) && !/^(사람 사이|돈 관리)$/.test(ag));
  for (const c of chapters) { if (c.source === "deterministic") continue;
    c.sections.forEach((s, si) => { const isKey = Boolean(c.keys?.includes(s.heading)); let opened = false;
      s.paragraphs.forEach((p, pi) => splitSentences(p).forEach(raw => { const sen = raw.replace(/[⟪⟫]/g, ""), at = { chapter: c.n, section: si, paragraph: pi, sentence: sen };
        if (PROMISE.test(sen) && ++promise > 3) out.push({ ...at, rule: "promise_tail", detail: `결과 꼬리 ${promise}번째`, hint: "처방 뒤 「그 ○○이 …이 됩니다」 꼬리를 되풀이하지 않는다" });
        const om = OPENER.exec(sen); if (isKey && om && !opened) { opened = true; const n = (openerKeys.get(om[1]) ?? 0) + 1; openerKeys.set(om[1], n); if (n > 3) out.push({ ...at, rule: "domain_opener", detail: `「${om[0].trim()}」로 여는 key ${n}번째`, hint: "칸 이름(「일에서는」)으로 key 문장을 열지 않는다" }); }
        for (const ag of angles) if (sen.includes(ag)) { const n = (angleSeen.get(ag) ?? 0) + 1; angleSeen.set(ag, n); if (n > 2) out.push({ ...at, rule: "angle_leak", detail: `각도 말 「${ag}」 ${n}번째`, hint: "설계도의 보는 쪽 이름을 문장에 되풀이하지 않는다" }); }
      })); });
  }
  return out;
}

// ======================================================================
// AM2-6(덕짱님 지시 2026-11-12) — 고리에 뜻 · 짝에 이유 · 다시 쓰기 사실 고정 · 입력 거름 끝까지. P5 판독 네 건의 차단 18곳 지도와 1~5부 지시의 결정론 몫.
// 등급: 차단(BLOCK — 교체 뒤에도 남으면 지우기 단계) · 교체(FIX_RULES — 경계 · 「고객이 알아챌 것: 예」 경미. 문단 교체로만 고치고 지우지 않는다).
// ======================================================================
/** 교체만 하는 규칙(경계 · 고객이 알아챌 경미 — 덕짱님 지시 5부 「지우지 않고 문단 교체 대상으로」). 순서는 차단 → 경계(FIX_BOUNDARY) → 경미(FIX_NOTICE). */
export const FIX_BOUNDARY: ReadonlySet<string> = new Set(["screen_copy6", "rel_subject_time", "template_third", "cross_copy8", "tone_mismatch", "must_bare", "wish_scope", "pair_last", "pair_causal", "key_paras", "rx_extra", "claim_months"]);
export const FIX_NOTICE: ReadonlySet<string> = new Set(["advice_cliche", "link_template", "pair_opener", "gyeol_cap", "rel_echo", "chapter_repeat", "ending_cap", "head_echo", "advice_repeat_sec", "rep_adjacent", "rx_repeat_sec", "screen_repeat"]);
export const FIX_RULES: ReadonlySet<string> = new Set([...FIX_BOUNDARY, ...FIX_NOTICE]);
/** 관계 이름 사전(4부 relation_scope): 천간합 · 천간충 · 육합 · 육충 · 형 · 파 · 해 · 원진 · 삼합국 · 방합. 이 책의 카드·배지에 없는 이름이 본문에 나오면 차단(부정형 포함). */
const REL_DICT: readonly string[] = (() => {
  const two = ["갑기합", "을경합", "병신합", "정임합", "무계합", "갑경충", "을신충", "병임충", "정계충", "자축합", "인해합", "묘술합", "진유합", "사신합", "오미합", "자오충", "축미충", "인신충", "묘유충", "진술충", "사해충",
    "인사형", "사신형", "인신형", "축술형", "술미형", "축미형", "자묘형", "진진형", "오오형", "유유형", "해해형", "자유파", "축진파", "인해파", "묘오파", "사신파", "술미파", "자미해", "축오해", "인사해", "묘진해", "신해해", "유술해"];
  const rev = two.map(n => `${n[1]}${n[0]}${n[2]}`);
  return [...new Set([...two, ...rev, "인사신형", "축술미형", "자미원진", "축오원진", "인유원진", "묘신원진", "진해원진", "사술원진"])];
})();
const MBTI_TYPE_RE = /(?<![A-Z])(I|E)(N|S)(T|F)(J|P)(?![A-Z])/;
const CONNECT_HEAD = /^(그래서|그만큼|그러니|그러면|그 덕|덕분에|이런|이렇게|그런|그렇게|그 (힘|마음|재미|성향|기운|흐름|쪽)|이 (힘|마음|재미|성향|쪽))/;
const PLUS_TAIL = /(열리|열려|기회|기 좋|좋은 (때|달|해)|빛나|힘이 붙|살아나|풀리|무르익)[^.?!]{0,10}[.!]?$/;
const MINUS_TAIL = /(늦추|조심|살피|살펴|흔들|부딪|어긋|막히|버거|무거워|지치|줄여|아끼|멈추)[^.?!]{0,12}[.!]?$/;
const ADVICE_END = /(세요|보세요|두세요|해 보세요|두면 좋아요|면 좋아요|편이 좋아요|게 좋아요|해 두면 좋|하면 좋습니다)[.!]?$/;
const READ_HJ: Readonly<Record<string, string>> = { 갑: "甲", 을: "乙", 병: "丙", 정: "丁", 무: "戊", 기: "己", 경: "庚", 신: "辛", 임: "壬", 계: "癸", 자: "子", 축: "丑", 인: "寅", 묘: "卯", 진: "辰", 사: "巳", 오: "午", 미: "未", 유: "酉", 술: "戌", 해: "亥" };
const POS_N: Readonly<Record<string, number>> = { 첫: 1, 두: 2, 세: 3, 네: 4, 다섯: 5, 여섯: 6, 일곱: 7, 여덟: 8, 아홉: 9, 열: 10 };
const META_WORDS = /(?<![가-힣])(자리 뜻|관계 뜻|재료 칸)(은|이|을|에|과|와|도)?(?![가-힣])|이어 볼 고리|고리가 (따로 )?없|(?<![가-힣])고리(가|는|를|로|도|와)? |짚어 (볼게요|보겠습니다|볼까요)|라는 뜻이 아니라|(두|세|네) 가지(만)? (짚|살펴|볼게|보겠|이야기)/;
/** 결(길결 · 마음결)을 뺀 낱말 「결」. 짝 긴장 꼴 「…와 부딪치는 결이라」는 세지 않는다(덕짱님 지시 2부의 꼴). */
/** AM2-7 2부 3 · 4: 입력 상태 말 · 지금 상태 말. */
const INPUT_STATE = /(태어난|출생) (시각|시간)(을|이)? ?(아는|알고 있|알려진|정확히 아는|모르는|모르니|몰라)|시각을 아는 사주|하는 일(과 연차)?(을|는|은)? (모르|적지 않)/;
const STATUS_NOW = /취업(을)? 준비(하는|하고 있는| 중인| 중)|쉬는 중인|쉬고 있는 당신|연애 중인|사귀는 중인|학생인 당신|학생이라/;
const GYEOL = /(?<![가-힣])결(?=(?:이|은|을|의|도|에|로|이에요|입니다|이라|이기도)?(?![가-힣]))/g;

export function am26Flags(chapters: readonly FinalChapter[], b: BlockCtx): ChunkFlag[] {
  const out: ChunkFlag[] = [];
  const x = b.intake, plans = new Map(x.chapters.map(c => [c.n, c])), lineById = new Map(x.lines.map(l => [l.id, l]));
  const keyPlans = new Map(x.chapters.flatMap(c => (c.keys ?? []).map(k => [k.key, k] as const)));
  const entries = b.brief?.timeline?.entries ?? [];
  const bookNames = new Set([...entries.flatMap(e => e.badges.map(bd => relName(bd.label).replace(/ 반합$/, ""))), ...[...x.lines.map(l => `${l.value} ${l.meaning}`).join(" ").matchAll(/[갑을병정무기경신임계자축인묘진사오미신유술해]{2,3}(합|충|형|파|해|원진)/g)].map(m => m[0])]);
  const product = x.product, baseYear = Number((b.brief?.baseDate ?? "").slice(0, 4)) || 0;
  const bookYear = product === "annual_fortune" ? Number(entries.find(e => e.kind === "year")?.key) || baseYear : baseYear;
  const life = b.brief?.timeline?.lifetime ?? [];
  const cycleOf = (y: number, ganji?: string) => (ganji ? life.find(c => c.ganji.includes(ganji)) : undefined) ?? life.find(c => c.startYear <= y && y <= c.endYear);
  const facts = b.brief?.person.facts, callName = b.brief?.person.callName ?? "";
  const pname = b.brief?.person.name ?? "", nameForms = [...new Set([callName, callName.replace(/(님|씨)$/, ""), pname, pname.length >= 3 ? pname.slice(1) : ""].filter(n2 => n2.length >= 2))].sort((p1, p2) => p2.length - p1.length);
  const inputs = facts ? inputsOf(facts) : undefined;
  const tenRef = product === "major_fortune" ? { start: baseYear + 1, end: baseYear + 10 } : (() => { const cyc = life.find(c2 => c2.startYear <= bookYear && bookYear <= c2.endYear); return cyc ? { start: cyc.startYear, end: cyc.endYear } : null; })();
  const bSegs = x.lines.filter(l => l.subject === "mbti").flatMap(l => l.meaning.split(/ · |(?<=[.!?])\s+/)).map(t => t.trim()).filter(t => t.replace(/[^가-힣]/g, "").length >= 6);
  // AM2-7 3부 7: 「성장 곡선 · 성격 유형 · MBTI」라는 체계 이름도 MBTI 쪽 말이다(P6 major-1 7.1 「성격의 성장 곡선과 겹쳐 보면」 — 유형 이름 없이 이었다).
  const mbtiHit = (sen: string, pairWhy?: string) => Boolean((b.mbtiType && sen.includes(b.mbtiType)) || (b.mbtiType && MBTI_TYPE_RE.test(sen)) || (b.mbtiType && /성장 곡선|성격 유형|(?<![A-Z])MBTI/.test(sen)) || bSegs.some(sg => overlap4(sen, sg) >= 4) || (pairWhy && overlap4(sen, pairWhy) >= 4));
  const slowMonths = new Set(x.lines.filter(l => /(늦출|새기 쉬운|살필|흔들림을 살필|무리하기 쉬운) 달/.test(l.value)).flatMap(l => [...monthsIn(l.meaning)]));
  const gyeolSeen = { n: 0 };
  const lastCh = Math.max(...x.chapters.map(c => c.n));
  for (const c of chapters) {
    if (c.source === "deterministic") continue;
    const plan = plans.get(c.n);
    const templ = new Map<string, number>(), openers = new Map<string, number>(), skels = new Map<string, number>();
    // 처방 수·자리(5부): 장마다 처방은 마지막 소제목에 하나. 「할 것·피할 것」 소제목은 행동이 본문이다.
    const lastSec = plan?.rxAt ?? c.sections.length - 1; let rxInLast = 0; // AM2-7 3부 9: 설계도가 정한 처방 소제목.
    c.sections.forEach((s, si) => {
      const kp = c.keys?.includes(s.heading) ? keyPlans.get(s.heading) : undefined, e = kp ? entries.find(en => en.key === kp.key) : undefined;
      const sp = !kp ? plan?.sections?.[si] : undefined;
      const sents = s.paragraphs.flatMap((p, pi) => splitSentences(p).map((raw, sj) => ({ sen: raw.replace(/[⟪⟫]/g, ""), pi, sj })));
      const flag = (at: { sen: string; pi: number }, rule: string, hint: string, detail?: string) => out.push({ chapter: c.n, section: si, paragraph: at.pi, sentence: at.sen, rule, hint, ...(detail ? { detail } : {}) });
      const advice = /할 것|피할 것/.test(sp?.q ?? s.heading);
      const pairHere = kp?.pair ? x.pairs.find(p2 => p2.id === kp.pair) : undefined;
      const sectionPairs = !kp ? x.pairs.filter(p2 => !p2.key && (p2.use ?? []).includes(c.n) && (sp?.lines ?? []).includes(p2.myeongri) && (sp?.lines ?? []).includes(p2.mbti)) : [];
      const basisB = kp ? kp.lines.some(id => lineById.get(id)?.subject === "mbti") : (sp?.lines ?? []).some(id => lineById.get(id)?.subject === "mbti");
      // 짝 범위 밖 명리 말(그 key): 고리 자리 뜻 · 관계 이름 · 대운 · 다른 십성(땅 십성이 하늘과 다를 때 · 대운 십성).
      const sky = e ? e.tenGod.stem.replace(/\(.*$/, "") : "", ground = e ? e.tenGod.branch.replace(/\(.*$/, "") : "";
      // 고리 자리 뜻 말(그 key 재료의 자리 뜻 — 「연인과의 사이」 「일터와 맡은 일」 …)과 고리 꼬리(「움직이」)도 짝 밖이다(P5 세운 1월 「사이가 움직이는 때, 곁을 데우는 힘」).
      const seatWords = (kp?.links ?? []).filter(l => l.kind === "seat" && l.seatMeaning).flatMap(l => l.seatMeaning!.split(/[·\s]+/).map(w => w.replace(/(과의|와의|과|와|의|쪽)$/, "")).filter(w => w.length >= 2 && !/^(사이|쪽|맡은|일과|나와|사람|가장|사람들|내|돈|일|자리|바깥|모임|생활|하루|거래|밖|섞인|버는|들고|나는|찾는|꾸리는|혼자|집안에서)$/.test(w)));
      const outScope = kp ? new RegExp([...(b.keyRels?.get(kp.key) ?? [])].filter(n2 => n2.length >= 2).map(esc2).concat([...new Set(seatWords)].map(esc2), ["사이가 (다시 )?움직이", "쪽이 (다시 )?움직이", "대운", "태어난 (해|달|날|시각)", "가까운 사람", "일터", "바깥 모임", "내 생활", "겹치", ...(ground && ground !== sky ? [ground] : []), ...(e?.dayun?.tenGod ? [e.dayun.tenGod.replace(/\(.*$/, "")].filter(t => t !== sky) : [])]).join("|")) : null;
      sents.forEach(({ sen, pi, sj }, i) => {
        const at = { sen, pi };
        const prev = sents[i - 1], next = sents[i + 1];
        // relation_scope(사전 전체): 이 책 카드·배지에 없는 관계 이름.
        // 더 긴 이름 안의 글자(「인사신형」 안의 「사신형」 · 「축술미형」 안의 「술미형」)는 그 이름의 일부다.
        { const longer = [...REL_DICT, ...bookNames].filter(n2 => n2.length >= 4);
          const nm = REL_DICT.find(n2 => { if (bookNames.has(n2) || bookNames.has(`${n2[1]}${n2[0]}${n2.slice(2)}`)) return false; for (let i0 = sen.indexOf(n2); i0 >= 0; i0 = sen.indexOf(n2, i0 + 1)) if (!longer.some(L2 => L2 !== n2 && L2.includes(n2) && sen.slice(Math.max(0, i0 - (L2.length - n2.length)), i0 + L2.length).includes(L2))) return true; return false; });
          if (nm) flag(at, "relation_scope", `「${nm}」은 이 책 카드·배지에 없는 관계다 — 이 책의 관계만(「…가 아닌」 부정으로도 쓰지 않는다)`, nm); }
        // dayun_position: 본문 위치 말 ↔ 엔진 yearIndex.
        if (/대운|10년/.test(sen)) { const m = /(\d+|첫|두|세|네|다섯|여섯|일곱|여덟|아홉|열)\s?(?:번째 해|해째)|한가운데|중반|초반|끝 무렵|막바지|끝자락|후반|첫해|마지막 해/.exec(sen);
          // 대상 해: 문장 안의 해(대운 시작 표기 「20XX년 N월 무렵부터」는 빼고) → 같은 소제목 앞 문장의 마지막 해 → key의 해 → 책의 해.
          const yearsIn = (t: string) => [...t.matchAll(/(20\d\d)년(?! \d{1,2}월 무렵부터| 무렵부터)/g)].map(x => Number(x[1]));
          // 앞 문장의 해는 대운 시작 · 교운 문맥(「무렵부터」 「시작」 「대운」이 든 문장)이면 쓰지 않는다 — 그 해는 위치의 대상이 아니다(AM-01 · P~P3 대운 3장 「일곱 번째 해」 오탐).
          if (m) { const prevYears = sents.slice(0, i).filter(z => z.pi === pi).map(z => z.sen).filter(z => !/무렵부터|시작|대운|교운/.test(z)).join(" ");
            // AM2-8 1부(P7 major-p6b 8.0.1 「쉬는 중이라면 이 대운 끝 무렵에 해 둔 작은 시도가 …」): 해 숫자 없는 「이 대운」은 책의 대운(대운 책은 이 책을 쓴 해, 세운 책은 그 해)이다 — 앞 문장의 해를 대지 않는다.
            const thisCyc = /(?<![가-힣])이 대운/.test(sen) && !yearsIn(sen).length && !kp;
            const ym0 = yearsIn(sen)[0] ?? (kp || thisCyc || /올해|이 책을 쓴|기준일|이 해/.test(sen) ? undefined : yearsIn(prevYears).at(-1)), ym = ym0 ? [String(ym0), String(ym0)] : null, y = ym ? Number(ym[1]) : kp && e?.kind === "year" ? Number(kp.key) : product === "annual_fortune" ? bookYear : baseYear;
            const gm = /([갑을병정무기경신임계][자축인묘진사오미신유술해]) 대운/.exec(sen), next2 = /다음 대운|새 대운/.test(sen) && !gm;
            const cyc0 = cycleOf(y, gm?.[1]), cyc = next2 ? life[life.findIndex(l2 => l2 === cyc0) + 1] ?? cyc0 : cyc0;
            // 엔진 값 먼저: 그 해 카드의 대운 yearIndex(화면 10년표와 같은 값). 이름을 댄 대운이 그 해 카드의 대운과 다르면 평생 대운 줄로 센다.
            const ent = entries.find(en => en.kind === "year" && Number(en.key) === y), entG = ent?.dayun?.ganji.replace(/[^가-힣一-鿿]/g, "") ?? "";
            const sameCyc = ent?.dayun?.yearIndex && (!gm || entG.includes(gm[1]) || [...gm[1]].every(ch => (READ_HJ[ch] ?? "") && entG.includes(READ_HJ[ch]))) && !next2;
            const idx = sameCyc ? ent!.dayun!.yearIndex! : cyc ? y - cyc.startYear + 1 : 0;
            if (cyc && idx >= 1 && idx <= 10) { const n = m[1] ? (POS_N[m[1]] ?? Number(m[1])) : undefined, w = m[0];
              const ok = n !== undefined ? n === idx : /한가운데|중반/.test(w) ? idx >= 4 && idx <= 7 : /초반/.test(w) ? idx <= 3 : /끝 무렵|막바지|끝자락|후반/.test(w) ? idx >= 8 : w === "첫해" ? idx === 1 : w === "마지막 해" ? idx === 10 : true;
              if (!ok) flag(at, "dayun_position", `${y}년은 ${cyc.ganji.replace(/[^가-힣]/g, "").slice(0, 2)} 대운 ${idx}번째 해 — 위치 말은 카드 「위치 값」 그대로`, `「${w}」 ≠ ${idx}번째 해`); } } }
        // month_range 넓힘: 범위·묶음 말(하반기 · 상반기 · 연초 · 연말 · …에 걸쳐 · …사이에)이 달 목록에 섞임.
        if ((MONTH_NAME_IN.test(sen) || /달(이|은|들)/.test(sen)) && /(하반기|상반기|연초|연말)(에|의|와|과|부터|까지|로|에는|에도)?(?![가-힣])|(달|월)[^.?!]{0,24}에 걸쳐|(월|달)[^.?!]{0,10} 사이(에|의)/.test(sen)) flag(at, "month_range", "달 목록은 카드 달 이름 그대로 — 하반기·상반기·연초·…에 걸쳐·…사이에 같은 범위·묶음 말을 섞지 않는다");
        // orphan_deictic: 「그 + (꾸밈말) + 명사」 「이 세 달」 「두 소망」의 앞말이 같은 소제목에 없다.
        { const before = [s.heading, kp?.head ?? "", ...sents.slice(0, i).map(z => z.sen)].join(" ");
          const num = /(?<![가-힣])(이|그) (두|세|네|다섯) (달|해)(은|는|이|가|을|를|에|에는|의|도)/.exec(sen);
          if (num) { const need = POS_N[num[2]], pre = `${before} ${sen.slice(0, num.index)}`; const have = monthsIn(pre).size + [...pre.matchAll(/20\d\d년/g)].length; if (have < need) flag(at, "orphan_deictic", `「${num[0].trim()}」이 가리키는 ${num[3]} 이름이 같은 소제목 앞에 없다 — 달·해 이름을 적는다`, num[0]); }
          else {
            // 「그 + 명사」는 판독 기준으로 앞말 없이 읽히는 경우가 많다(「그 열이」 「그 침묵이」 — 앞 장면을 받는 말). 그래서 둘만 본다:
            // (가) 그림 명사(불 · 등불 · 씨앗 · 꽃 · 문 · 무대 …)가 같은 장 앞에 한 번도 없다(P5 세운 10.2 「그 불을」).
            // (나) 「그 + 꾸밈말(-한 · -운 · -진 · -된 · -던) + 명사」에서 꾸밈말도 명사도 같은 장 앞에 없다(P5 대운 3.2 「그 섬세한 감각이」).
            const chBefore = `${c.sections.slice(0, si).flatMap(s2 => s2.paragraphs).join(" ")} ${before} ${sen.slice(0, Math.max(0, sen.search(/(?<![가-힣])(그|저) /)))}`;
            const stem2 = (w: string) => esc2(w.slice(0, Math.min(2, w.length)));
            const word = (t: string) => t.replace(/(에서는|에서도|에서만|에서|에게는|에게|으로는|으로|로는|로|에는|에도|에|의|을|를|이|가|은|는|도|만|과|와|처럼|까지|부터)+$/, "");
            const mm = /(?<![가-힣])(그|저) ([가-힣]+(?:한|운|진|된|던|센|큰|린)) ([가-힣]+)/.exec(sen);
            const mb = /(?<![가-힣])(그|저) ([가-힣]+)/.exec(sen), noun = mb ? word(mb[2]) : "";
            const IMAGE_N = /^(불|불씨|불꽃|등불|빛|물|물길|씨앗|싹|꽃|나무|뿌리|열매|문|창|무대|판|별|그림|열쇠|다리|파도|바람|날개|배|돛|지도|길잡이|나침반|불길)$/;
            const mn = /(?<![가-힣])(두|세) (소망|바람|갈래)(은|는|이|가|을|를|과|와|의)(?=\s)/.exec(sen);
            if (mm && !/^(위|앞|뒤|안|밖|옆|사이|전|후|가운데|중|때|날|해|달|쪽|무렵)$/.test(word(mm[3])) && !new RegExp(stem2(mm[2])).test(chBefore) && !new RegExp(stem2(word(mm[3]))).test(chBefore)) flag(at, "orphan_deictic", `「${mm[0].trim()}」이 가리키는 말이 앞에 없다 — 가리키는 말을 다시 적거나 문장을 고친다`, mm[0].trim());
            else if (!mm && mb && IMAGE_N.test(noun) && !new RegExp(esc2(noun)).test(chBefore)) flag(at, "orphan_deictic", `「그 ${noun}」이 가리키는 말이 이 장 앞에 없다 — 가리키는 말을 다시 적거나 문장을 고친다`, `그 ${noun}`);
            else if (mn && !/바람|소망|«|갈래|과 |와 |, /.test(`${before} ${sen.slice(0, mn.index)}`)) flag(at, "orphan_deictic", `「${mn[0].trim()}」이 가리키는 말이 같은 소제목 앞에 없다`, mn[0].trim());
          } }
        // 시점(4부): 최근 · 오늘 · 앞날인 달을 지난 일로.
        { const unq = sen.replace(/["“][^"”]*["”]|['‘][^'’]*['’]/g, ""); const t = /(?<![가-힣])(최근|오늘)(?![가-힣]|날)/.exec(unq); if (t) flag(at, "time_extra", "「최근·오늘」은 읽는 날에 기대는 말 — 쓰지 않는다(따옴표 대사 밖)", t[0]); }
        { const fp = /((?:20\d\d년 )?(?:1[0-2]|[1-9])월(?: · [가-힣]{2}월)?|20\d\d년(?: [가-힣]{2}년)?)[^.?!]{0,12}?(을|를)? (지나왔|지나온|지났다면|겪었다면|보냈다면|보낸 뒤)/.exec(sen);
          if (fp) { const yy = /(20\d\d)년/.exec(fp[1]); const isFuture = product === "annual_fortune" ? true : yy ? Number(yy[1]) > baseYear : false; if (isFuture) flag(at, "future_past", "책을 쓴 날 뒤에 오는 달·해를 지난 일로 쓰지 않는다 — 「…이 오면」처럼", fp[0]); } }
        // AM2-7 1부 3: 대운 순서 말(「끝난 뒤 · 다음 줄기」)이 대운 시작 해와 맞는가(P6 major-p6a 8.1 「정미 대운은 이 10년이 끝난 뒤 …」).
        for (const why of dayunOrderIssues(sen, life.map(c2 => ({ ganji: c2.ganji, startYear: c2.startYear, endYear: c2.endYear })), tenRef)) flag(at, "dayun_order", `대운 순서가 엔진과 다르다 — ${why}`, why.slice(0, 40));
        // AM2-7 3부 1: 짝 글이 깨진 채 옮겨진 꼴(「ISTJ의 도 검증된 것만 …」 — 유형 이름 뒤가 비었다).
        if (b.mbtiType && new RegExp(`${b.mbtiType}의 ?(도|는|은|가|이|를|을|만|와|과)\\s`).test(sen)) flag(at, "pair_text", "유형 이름 뒤가 비었다(기능 기호를 뗀 자리) — 문장을 고친다", b.mbtiType);
        // AM2-7 3부 8: 바람 낱말은 1장 · 소망 장 · 바람 고리 key에서만.
        if (WISH_TALK.test(sen) && c.n !== 1 && plan?.id !== "wish" && !(kp?.wishLink)) flag(at, "wish_scope", "바람은 1장 · 소망 장 · 바람 고리가 있는 달·해에서만 가리킨다", sen.match(WISH_TALK)![0]);
        // AM2-7 1부 6: 사람의 일을 굳힌 과거형은 2장 밖에서도 잡는다(질문 · 조건 꼴과 엔진 사실은 뺀다).
        if (PERSON_PAST.test(sen) && !/[?？]$|다면|라면|했다면/.test(sen) && !PAST_FACT.test(sen)) flag(at, "past_assert", "지난 일을 겪었다고 굳히지 않는다(「…했습니다 · …해 온 쪽 · …었을 거예요」) — 질문형 · 조건형으로", "사람의 지난 일 단정");
        // AM2-7 2부: 입력 밖 전제(낱말표 하나 — 필요한 입력이 맞지 않는 말). 바람 원문(«…») 안은 보지 않는다. 조건 꼴(「…이라면」)도 전제다.
        if (facts) {
          const hits = premiseHits(sen, inputs!); if (hits.length) flag(at, "input_premise", `입력과 맞지 않는 전제 말(${hits.map(h => h.word).join(" · ")}) — 이 사람 입력(일 · 연애 · 자녀 · 사는 곳)에 없는 상황을 쓰지 않는다`, hits.map(h => h.word).join("·"));
          // 2부 3: 인물 카드의 입력 상태 값(시각을 아는지 · 일 상세를 아는지)을 문장 이유로 쓰지 않는다(P6 annual-p5 「태어난 시각을 아는 사주라서」).
          const st = INPUT_STATE.exec(sen); if (st) flag(at, "input_state", "입력 상태(태어난 시각을 아는지 · 하는 일을 적었는지)는 본문 말이 아니다 — 그 문장을 쓰지 않는다", st[0]);
          // 2부 4: 지금 상태 말(취업 준비 중 · 쉬는 중 · 연애 중 · 학생)은 기준일 + 2년 안의 해 · 달에만 사실 꼴로. 그 뒤 해는 조건 꼴로.
          if (kp && e?.kind === "year" && Number(kp.key) > baseYear + 2) { const sm = STATUS_NOW.exec(sen); if (sm && !/(라면|다면|면,|이어진다면|이어지면|그때도)/.test(sen)) flag(at, "input_state", `${kp.key}년은 이 책을 쓴 날에서 2년 넘게 뒤 — 지금 상태(「${sm[0]}」)는 「그때도 …라면」 조건 꼴로`, sm[0]); }
        }
        // 작성 메모 · 개수 예고 · 「…라는 뜻이 아니라」.
        { const mw = META_WORDS.exec(sen); if (mw) flag(at, "meta_trace", "작성 메모·개수 예고·「…라는 뜻이 아니라」를 쓰지 않는다", mw[0]); }
        // 이름 부르기(4부): 첫 장 · 끝 장의 첫 문단 밖.
        // AM2-7 재현(R7 annual-1 8.0 「서윤 씨」): 부르는 이름 · 성 뺀 이름 꼴도 이름 부르기다.
        { const nm = nameForms.find(n2 => new RegExp(`(?<![가-힣])${esc2(n2)}(?:\\s?(?:님|씨))?(?![가-힣]{2})`).test(sen)); if (nm && !((c.n === 1 || c.n === lastCh) && si === 0 && pi === 0)) flag(at, "name_call", "이름은 첫 장·끝 장 첫 문단에서만 — 그 밖은 「당신」", nm); }
        // 결(재료 칸 말)은 책에서 세 번까지.
        for (const g of sen.matchAll(GYEOL)) { if (/부딪치는 결이라/.test(sen.slice(Math.max(0, g.index! - 6), g.index! + 4))) continue; if (++gyeolSeen.n > 3) { flag(at, "gyeol_cap", "「결」은 책 전체에서 세 번까지 — 다른 말로", `결 ${gyeolSeen.n}번째`); break; } }
        // ---- 짝(2부) ----
        const mb = mbtiHit(sen, pairHere?.why);
        if (mb) {
          if (kp && !pairHere && !basisB) flag(at, "pair_clause", "이 달·해에는 짝이 없다 — MBTI 유형 이름·MBTI 줄 뜻을 쓰지 않는다", "짝 없는 key");
          if (!kp && !sectionPairs.length && !basisB) flag(at, "pair_clause", "이 소제목에는 MBTI 근거·짝이 없다 — MBTI 유형 이름·MBTI 줄 뜻을 쓰지 않는다", "짝 없는 절");
          if (kp && pairHere && outScope?.test(sen)) flag(at, "pair_scope", `짝 범위 밖(${sen.match(outScope)![0]})과 MBTI를 잇지 않는다 — 짝은 하늘 ${sky}과 그 영역 줄만`, sen.match(outScope)![0]);
          if (/(하늘|땅)에 든 (달|해|때)(이라|라서|라|이니|니까)[, ]/.test(sen)) flag(at, "pair_causal", "「…가 하늘에 든 달이라, 유형은」처럼 한쪽을 다른 쪽의 원인으로 쓰지 않는다 — 잇는 이유 꼴로");
          if (kp && pairHere) { const op = sen.replace(b.mbtiType ?? "§", "〈유형〉").split(/\s+/).slice(0, 2).join(" "); const n = (openers.get(op) ?? 0) + 1; openers.set(op, n); if (n > 2) flag(at, "pair_opener", `짝 첫머리 「${op}」가 장에서 ${n}번째 — 다른 꼴로`, op); }
          // 이웃 문장 잇기: MBTI 문장 바로 다음(앞) 문장이 짝 밖 명리 말을 「그래서 · 그만큼 · 그 …」로 잇는다.
          // 이웃 문장이 「그래서 · 그만큼 · 그 …」로 열거나, MBTI 문장의 낱말을 「그 + 낱말」로 받으면(「그 달력」) 이은 것이다.
          const takes = (z: { sen: string } | undefined, from: string) => Boolean(z && [...z.sen.matchAll(/(?<![가-힣])그 ([가-힣]{2,4})/g)].some(g => from.includes(g[1].replace(/(을|를|이|가|은|는|도|에|의|과|와)$/, ""))));
          const nb = [next && (CONNECT_HEAD.test(next.sen) || takes(next, sen)) ? next : undefined, CONNECT_HEAD.test(sen) || takes({ sen }, prev?.sen ?? "") ? prev : undefined].filter((z): z is typeof sents[number] => Boolean(z));
          for (const z of nb) { const myW = kp ? outScope : new RegExp(`${TG}|대운|세운|태어난 (해|달|날|시각)|[갑을병정무기경신임계][자축인묘진사오미신유술해](월|년|일주)`); if (myW?.test(z.sen) && !(sectionPairs.length && sectionPairs.some(pp => overlap4(`${sen} ${z.sen}`, pp.why) >= 3))) { flag(z === next ? { sen: z.sen, pi: z.pi } : at, kp && pairHere ? "pair_scope" : "pair_link", "MBTI 문장과 짝 밖 명리 문장을 이웃 문장으로 잇지 않는다(문장을 나눠도 같다)", "이웃 문장 잇기"); break; } }
        }
        // ---- 고리·방향·틀(1부) ----
        if (kp) {
          if (pi === 0 && sj === 0) {
            const l0 = (kp.links ?? []).find(l => l.kind === "seat");
            // 틀: 「X이 닿는 태어난 Y 자리는 …」 「X은 태어난 Y 자리에 닿아요」 「…인 당신에게는 … 쪽이 움직이는 때」 · 재료 줄 옮김 · 이름을 가린 꼴이 같은 첫 문장(「〈관계〉과 〈관계〉가 걸려요」).
            const relRe = [...bookNames].filter(n2 => n2.length >= 2).sort((p1, p2) => p2.length - p1.length).map(esc2).join("|");
            const skel = sen.replace(relRe ? new RegExp(relRe, "g") : /$^/, "〈관계〉").replace(/태어난 (해|달|날|시각)/g, "〈자리〉").replace(/(?:20\d\d년 )?(?:1[0-2]|[1-9])월 · [가-힣]{2}월|20\d\d년(?: [가-힣]{2}년)?/g, "〈때〉").replace(/[^가-힣〈〉]/g, "");
            const t1 = /닿/.test(sen) && /태어난 (해|달|날|시각) 자리/.test(sen) ? "닿는 자리" : /(인|한|은) 당신에게(는)? [^.?!]{0,30}(쪽|사이)(이|가)? (다시 )?움직이(는|기 쉬운) (때|달|해)/.test(sen) ? "당신에게는 움직이는 때" : l0 && overlap4(sen, l0.text) >= 10 ? "재료 옮김" : null;
            const same = [...skels.entries()].find(([k2]) => { const A2 = new Set<string>(), B2 = new Set<string>(); for (let q = 0; q + 3 <= k2.length; q++) A2.add(k2.slice(q, q + 3)); for (let q = 0; q + 3 <= skel.length; q++) B2.add(skel.slice(q, q + 3)); let n3 = 0; for (const w of A2) if (B2.has(w)) n3++; return A2.size + B2.size > 0 && n3 / (A2.size + B2.size - n3) >= 0.7; })?.[0];
            const tid = t1 ?? (same ? `꼴 「${same.slice(0, 16)}…」` : null);
            if (!same) skels.set(skel, 1); else skels.set(same, (skels.get(same) ?? 1) + 1);
            if (tid) { const n = t1 ? (templ.get(t1) ?? 0) + 1 : skels.get(same!)!; if (t1) templ.set(t1, n); if (n > 2) flag(at, "link_template", `달·해 첫 문장 틀(${tid})이 장에서 ${n}번째 — 이 달·해의 재료로 다르게 연다`, tid); }
          }
          // 화면 되풀이: 핵심 배지 줄·뜻 한 줄을 본문에 옮김.
          if (e) for (const bd of e.badges) if ((kp.core ?? []).some(cn => cn.replace(/ 반합$/, "") === relName(bd.label).replace(/ 반합$/, "")) && overlap4(sen, bd.line.replace(/^반합\([^)]*\): /, "")) >= 7) { flag(at, "rel_echo", "화면 「명리로 보면」 배지 줄을 옮기지 않는다 — 이 사람 상황에 맞춘 말로", relName(bd.label)); break; }
        }
        // 처방 수·자리.
        if (!kp && !advice && ADVICE_END.test(sen)) { if (si !== lastSec) flag(at, "rx_extra", "처방은 장마다 설계도가 정한 소제목에 하나만 — 이 소제목은 권유로 맺지 않는다", "처방 소제목 밖 권유"); else if (++rxInLast > 2) flag(at, "rx_extra", "처방은 장마다 하나 — 둘째 처방을 더하지 않는다", "처방 셋째"); }
        if (!kp && plan?.rx?.forbid.length) { const kinds = rxOfSentence(sen).filter(kd => plan.rx!.forbid.includes(kd)); if (kinds.length && ADVICE_END.test(sen)) flag(at, "rx_extra", `금지 종류 처방(${kinds.join("·")})은 다른 곳이 맡는다`, kinds.join("·")); }
      });
      if (kp) {
        const body = sents.map(z => z.sen), lastS = sents.at(-1);
        // 짝 문장은 key의 마지막 문장.
        if (pairHere && lastS && sents.some(z => mbtiHit(z.sen)) && !mbtiHit(lastS.sen)) { const m0 = sents.find(z => mbtiHit(z.sen))!; flag(m0, "pair_last", "짝 문장은 이 달·해 본문의 마지막 문장에 둔다", "짝이 끝 문장이 아님"); }
        // 방향: 고리 재료 방향(살필 쪽 · 좋은 쪽)과 끝 문장 꼬리. 다른 장 「늦출 달」에 든 달도 살필 쪽.
        const l0 = (kp.links ?? []).find(l => l.kind === "seat");
        const slow = monthsIn(kp.label).size > 0 && [...monthsIn(kp.label)].some(m2 => slowMonths.has(m2));
        const dir = l0?.dir === "minus" || slow ? "minus" : l0?.dir === "plus" ? "plus" : "none";
        if (lastS && dir === "minus" && PLUS_TAIL.test(lastS.sen) && !/[?？]$/.test(lastS.sen)) flag(lastS, "tone_mismatch", "이 달·해는 살필 쪽(배지·영역 칩·늦출 달) — 좋은 꼬리(열리는·기회·…기 좋은)로 맺지 않는다", "살필 쪽 + 좋은 꼬리");
        if (lastS && dir === "plus" && MINUS_TAIL.test(lastS.sen) && !/[?？]$/.test(lastS.sen) && !mbtiHit(lastS.sen)) flag(lastS, "tone_mismatch", "이 달·해는 좋은 쪽 — 살필 꼬리(흔들·늦추·조심)로 맺지 않는다", "좋은 쪽 + 살필 꼬리");
        // 반드시 쓸 것 이름만(R-G3, 덕짱님 결정 5-3 「이름 + 뜻 한 마디면 쓴 것」): 이름은 있는데 key 본문 어디에도 그 관계 종류의 뜻 말 · 그 배지 그림 말이 없다.
        const SENSE: Readonly<Record<string, RegExp>> = { 합: /맺|묶|맞물|어울|모이|모여|모으|붙|손을 잡|짝이 맞|머무|자리를 잡/, 국: /모이|모여|모으|뭉치|묶|한 기운|한 방향|팀/, 충: /부딪|충돌|흔들|맞서|바뀌|열리|오르내리|전환/, 형: /다듬|눌러|누르|손보|벌주|거칠|몰아|틀어/, 파: /어긋|틀어|깨지|흐트러|비는|다시 올라/, 해: /방해|발이 걸|서운|틈|새는|안 통|알아주지/, 원진: /까끌|엇박|미워/, 공망: /빠져|빈자리|비어|새는|빔/ };
        const bodyAll = body.join(" ");
        for (const m of kp.must ?? []) { if (m.what === "대운과 겹침") continue; const nm = m.what.replace(/ 반합$/, ""); if (!bodyAll.includes(nm)) continue;
          const kind = /국$|방합$/.test(nm) ? "국" : /원진$/.test(nm) ? "원진" : m.what === "공망" ? "공망" : nm.slice(-1);
          const img = e?.badges.find(bd => relName(bd.label).replace(/ 반합$/, "") === nm)?.line.replace(/^반합\([^)]*\): /, "") ?? "";
          const seatL = (kp.links ?? []).find(l => l.kind === "seat" && l.rel === m.what), seatSaid = Boolean(seatL && /가까운 사람|일터|바깥 모임|내 생활|연애|연인|배우자|윗사람|사업|거래|일자리|자녀|맡은 일/.test(bodyAll));
          // 고리가 붙은 관계는 본문 어디든, 둘째 관계는 그 이름이 든 문장이나 바로 다음 문장에 뜻 말이 있어야 한다(첫째 관계의 뜻 말을 둘째 몫으로 세지 않는다 — P5 판독 R-G3 8 key).
          const zi = sents.findIndex(z2 => z2.sen.includes(nm)), near = seatL ? bodyAll : `${sents[zi]?.sen ?? ""} ${sents[zi + 1]?.sen ?? ""}`;
          if (!seatSaid && !(SENSE[kind]?.test(near)) && overlap4(near, img) < 2) { const z = sents.find(z2 => z2.sen.includes(nm))!; flag(z, "must_bare", `「${m.what}」 이름만 나오고 뜻 한 마디가 없다 — 이름과 함께 이 사람 상황에 맞춘 뜻 한 마디`, m.what); } }
        // 형식(5부): 달 key · 짧게 해 key는 문단 2개, 깊게 해 key는 2~3개.
        const np = s.paragraphs.filter(p => p.trim()).length, want = kp.depth === "deep" ? [2, 3] : [2, 2];
        // P6 annual-1: 작가가 문단 하나로 쓴 key(13곳 가운데 11곳)는 문단 교체로 못 나눈다 — 문장 4개 이상이면 발행 직전 문장 경계에서 둘로 나눈다(splitKeyParagraphs, 호출 0). 그래서 교체 대상이 아니다.
        const splittable = np === 1 && splitSentences(s.paragraphs.find(p => p.trim()) ?? "").length >= 4;
        if (np && !splittable && (np < want[0] || np > want[1])) out.push({ chapter: c.n, section: si, paragraph: -3, rule: "key_paras", sentence: `[형식] ${kp.label} 문단 ${np}개`, hint: `${kp.label} 본문은 문단 ${want[0] === want[1] ? want[0] : want.join("~")}개`, detail: `문단 ${np}개` });
      }
      // 핵심 주장 달 목록(4부): 소제목 핵심 주장이 달 목록이면 카드 달 이름이 모두 본문에.
      if (sp && sp.claimIds?.length && !sp.pointer) { const ms = [...new Set((sp.claimIds ?? []).flatMap(id => [...monthsIn(`${lineById.get(id)?.meaning ?? ""}`)]))];
        if (ms.length >= 2) { const got = monthsIn(s.paragraphs.join(" ")); const miss = ms.filter(m2 => !got.has(m2)); if (miss.length) out.push({ chapter: c.n, section: si, paragraph: -3, rule: "claim_months", sentence: `[핵심 주장] ${c.n}.${si + 1} 달 목록에 ${miss.map(m2 => `${m2}월`).join("·")} 빠짐`, hint: `핵심 주장 달 목록은 카드 달 이름 그대로 모두(${ms.map(m2 => `${m2}월`).join("·")}) — 범위·묶음 말 없이`, detail: miss.join("·") }); } }
    });
  }
  return out;
}

/** 그 장의 처방(권유 끝) 문장들(지우기 안전 검사용 — 처방을 지워 장에 처방이 없어지면 지우지 않는다). */
export const adviceSentenceAt = (chs: readonly FinalChapter[], n: number) => (chs.find(c => c.n === n && !c.keys)?.sections ?? []).flatMap(sec => sec.paragraphs.flatMap(p => splitSentences(p))).filter(x => ADVICE_END.test(x.replace(/[⟪⟫]/g, "")));
