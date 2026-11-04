/**
 * P6c 책 단위 검사(결정론·호출 0). 안전망(문장 삭제 규칙) 뒤에 돈다.
 *  - tidyBook: 뜻을 바꾸지 않는 결정론 정리 — "명리학에서" 떼기(A4), 괄호 밖 MBTI 약어 → "쉬운 이름(Te)"·쉬운 이름(C5),
 *    세운 달 본문 "이번 달" → "이 달"(E5), 소제목마다 핵심 문장 기호 ⟪ ⟫ 하나만(H).
 *  - lintBook: 수리 패스(A5)로 보낼 문장·소제목·카드 줄 목록. 결정론 장은 수리하지 않고 지운다(DB 원문·이전 책 겹침은 보지 않는다).
 *  - enforce: 수리 뒤에도 걸리는 문장을 지운다(문단이 한 문장 아래로 줄면 문단을 뺀다). 빈자리를 DB 원문·안전망 문장으로 채우지 않는다.
 */
import type { BookSection, SectionCard } from "../format";
import type { FinalChapter } from "./index";
import * as L from "./lint";
import { isPastAssertion, splitSentences } from "./patterns";
import { sentenceViolation, type SafetyFacts, type SentenceRule } from "./sentences";
import * as D from "./p6d";

export type P6cRule = "db_copy" | "prior_overlap" | "formula_excess" | "backref_excess" | "meaning_repeat" | "scene_repeat" | "nickname" | "farming" | "second_image"
  | "school_scene" | "presumed_partner" | "past_assertion" | "job_prop" | "yinyang_claim" | "element_claim" | "dayun_claim" | "star_claim" | "ten_god_direction"
  | "marriage_talk" | "card_missing" | "card_form" | "card_overlap" | "card_length" | "card_rule"
  // P6d: 안전망 문장 규칙(삭제하지 않고 수리로) · 묶음 세기 · 조각 문장 · 사실·위치 · 시점 · 부정 단정 · 소품 · 투자
  | "safety" | "group_claim" | "fragment" | "empty_preview" | "count_mismatch" | "dayun_year" | "pair_both" | "self_correction" | "chapter_ref"
  | "time_deictic" | "calendar_month" | "closing_repeat" | "negative_claim" | "prop_repeat" | "invest_directive" | "intensity_claim" | "evidence_missing";
export type CardField = "image" | "todo" | "review" | "caution";
/** paragraph: -1 = 소제목, card가 있으면 카드 줄. */
export type LintFlag = { readonly chapter: number; readonly section: number; readonly paragraph: number; readonly card?: CardField; readonly rule: P6cRule; readonly sentence: string; readonly hint: string; readonly detail?: string };
/**
 * 수리 뒤에도 걸리면 문단째 빼는 규칙(사용자 결정 2026-11-04: 사실·금지 규칙만 문단째, 문체·반복은 그대로 두고 기록).
 * 문장만 지우면 조각 문장이 남는다(P6c "하는 물음이 자주 올라와요").
 */
export const HARD_RULES: ReadonlySet<P6cRule> = new Set<P6cRule>(["safety", "school_scene", "presumed_partner", "past_assertion", "yinyang_claim", "element_claim", "dayun_claim", "star_claim", "ten_god_direction", "marriage_talk",
  "group_claim", "fragment", "empty_preview", "count_mismatch", "dayun_year", "pair_both", "self_correction", "chapter_ref", "time_deictic", "calendar_month", "negative_claim", "invest_directive", "intensity_claim"]);
/** 안전망 문장 규칙 가운데 문체(삭제·문단 빼기 대상이 아닌 것). */
const SOFT_SAFETY: ReadonlySet<SentenceRule> = new Set<SentenceRule>(["example_copy", "duplicate_sentence", "nickname", "rural_prop"]);
export type LintCtx = {
  readonly facts: SafetyFacts; readonly jobDetail: string; readonly schoolStage: L.SchoolStage | "student";
  readonly yinYang?: { readonly yin: number; readonly yang: number }; readonly presence?: L.ElementPresence; readonly dayunPhase?: L.DayunPhase;
  readonly stars?: { readonly spouse?: L.StarWhere; readonly child?: L.StarWhere };
  readonly coreImage: string; readonly nicknames: readonly string[]; readonly corpus: ReadonlySet<string>; readonly prior: readonly string[];
  readonly jobProps: readonly string[]; readonly noJobChapters: ReadonlySet<number>; readonly parentingChapters: ReadonlySet<number>; readonly monthChapters: ReadonlySet<number>;
  readonly compat: boolean; readonly mbtiPlain: Readonly<Record<string, string>>;
  /** 카드 기간 상태(key → past·current·future). */
  readonly periods?: Readonly<Record<string, "past" | "current" | "future">>;
  /** P6d A: 묶음 세기 단계(만세력 가중값). 궁합은 사람마다(이름이 나온 문장만 본다). */
  readonly groupLevels?: L.GroupLevels; readonly groupLevelsBy?: readonly { readonly name: string; readonly levels: L.GroupLevels }[];
  /** P6d C: 궁합 두 사람의 엔진 값("둘 다" 검사). */
  readonly pair?: D.PairFacts;
  /** P6d C: 대운 연도 key → 대운 안 몇 번째 해(1~10). */
  readonly yearIndex?: Readonly<Record<string, { readonly index: number; readonly total: number }>>;
  /** P6d E: 달력이 있는 책(대운·세운)은 "지금" 전부 금지. calendarChapters: 달력월 이름 금지 장(세운 전체). */
  readonly strictTime?: boolean; readonly calendarChapters?: ReadonlySet<number>;
  /** P6d F: key → 엔진 관계 표시 수(0이면 "건드리지 않는다" 허용). 궁합은 두 사람 날 관계 수. */
  readonly relationCount?: Readonly<Record<string, number>>; readonly pairRelations?: number;
  /** P6d F: 책당 1회만 쓰는 소품 명사. G: 투자 장. 안전망 규칙 문맥(예시 창·조건형 장). */
  readonly props?: readonly string[]; readonly investChapters?: ReadonlySet<number>; readonly allowed?: ReadonlySet<string>; readonly conditionalChapters?: ReadonlySet<number>;
  /** 세기 주장(P6b E-11): key → 흐름 점수와 같은 종류(연·월) 안의 최고·최저. */
  readonly flow?: Readonly<Record<string, { readonly score: number; readonly max: number; readonly min: number }>>;
  /** 카드 key → 천간 십성(같은 십성 key끼리 카드 줄을 더 엄격히 견준다, P6d D). */
  readonly cardTenGod?: Readonly<Record<string, string>>;
  /** 장마다 반드시 써야 하는 근거 낱말(P6d G 커리어·연애): 장 번호 → 낱말 꼴들(하나라도 없으면 evidence_missing). */
  readonly requiredTerms?: ReadonlyMap<number, readonly RegExp[]>;
};
const PEAK = /가장 (거센|센|강한|뜨거운|크게 움직이는|큰|좋은|활발한|바쁜)( [가-힣]+)? ?(달|해|때|시기)/;
const LOW = /가장 (조용한|약한|잔잔한|느린|차분한|한가한)( [가-힣]+)? ?(달|해|때|시기)/;

const HINT: Readonly<Record<P6cRule, string>> = {
  db_copy: "브리프 글을 20자 넘게 그대로 옮겼다 → 같은 뜻을 이 고객의 말로 새로 쓴다",
  prior_overlap: "이 고객의 다른 책과 같은 문장이다 → 다른 장면·다른 말로 쓴다",
  formula_excess: "'이름(한자)은 ~을 뜻해요' 꼴이 책에서 4번을 넘었다 → 장면→용어, 질문→답, 대비(겉은 ~ 속은 ~) 가운데 하나로 연다",
  backref_excess: "'앞에서 본'이 책에서 2번을 넘었다 → 되짚지 말고 이 자리의 새 정보로 쓴다",
  meaning_repeat: "이 특성의 뜻은 책에서 이미 풀었다 → 뜻을 다시 풀지 말고 이 영역의 새 쓰임만",
  scene_repeat: "책 안 다른 곳과 같은 장면·문장이다 → 다른 장면으로 바꾼다",
  nickname: "그림 별명(별칭)을 썼다 → 용어 이름과 뜻으로만",
  farming: "농사·시골 비유를 썼다 → 현대 생활 비유로 바꾸거나 뺀다",
  second_image: "1장에 핵심 이미지 말고 다른 그림을 세웠다 → 핵심 이미지 하나만",
  school_scene: "학교 장면은 이 고객의 생활 단계와 맞지 않는다 → 이 고객의 일·생활 장면으로",
  presumed_partner: "입력에 없는 연인·배우자를 전제했다 → 조건형('생기면·된다면')이나 일반 장면으로",
  past_assertion: "입력에 없는 과거 사건·지인을 사실로 썼다 → 질문형·가정형으로",
  job_prop: "직업 소품이 이 장에 두 번 넘게(연애·가족 장은 0번) 나왔다 → 하나만 남기고 생활 장면으로",
  yinyang_claim: "음양 비율과 다른 말이다 → 브리프 chart.yinYang 비율대로(같으면 균형, 다르면 치우침)",
  element_claim: "겉 글자 0·땅속에 있는 오행을 '없다'고 단정했다 → '겉에는 없고 땅속에 조금'",
  dayun_claim: "대운 안의 위치가 엔진 연차와 다르다 → chart.currentDayun.phase 그대로",
  star_claim: "배우자 별·자녀 별의 자리와 다른 말이다 → chart.stars 그대로",
  ten_god_direction: "십성 누름 방향이 거꾸로다 → 인성→식상, 식상→관성, 재성→인성, 관성→비겁, 비겁→재성",
  marriage_talk: "자녀 장에 결혼·양가 이야기가 나왔다 → 아이를 키울 때의 모습만",
  card_missing: "카드 줄이 없다 → 그 key의 십성·관계에서 한 줄",
  card_form: "카드 꼴이 틀렸다 → 지난 기간은 [돌아보기] 질문형, 지금·앞으로는 [해 볼 것] 명령형",
  card_overlap: "다른 key의 카드와 같은 문장·꼴이다 → 이 시기의 십성·관계에서 나온 다른 한 줄",
  card_length: "카드 줄 길이가 맞지 않는다 → 그림 14~30자, 나머지 10~50자 한 줄",
  card_rule: "카드 줄이 금지 규칙에 걸렸다 → 같은 뜻을 규칙 안에서",
  safety: "금지 규칙(입력에 없는 사실·시주·내부 용어·확정 예언 등)에 걸렸다 → 그 사실 없이 같은 흐름으로 다시 쓴다",
  group_claim: "십성 묶음 세기가 엔진 값과 다르다 → chart.groups 단계(강·보통·약) 그대로",
  fragment: "앞 구절이 빠진 조각 문장이다 → 주어·앞말을 갖춘 온전한 문장으로",
  empty_preview: "예고만 하고 받는 내용이 없다('이런 변화가 있을 거예요') → 무엇이 바뀌는지 바로 쓴다",
  count_mismatch: "'이 세 가지'처럼 가리키는 개수가 앞의 항목 수와 다르다 → 개수를 맞추거나 항목을 직접 부른다",
  dayun_year: "대운 안의 위치(앞쪽·중간·마지막 해·남은 해)가 엔진의 '대운 안 몇 번째 해'와 다르다 → 그 값 그대로",
  pair_both: "'둘 다 ~'가 한 사람에게만 맞는다 → 두 사람 각각의 엔진 값대로 나눠 쓴다",
  self_correction: "괄호 안에 자기 정정('~이 아니라')이 드러났다 → 맞는 이름 하나만",
  chapter_ref: "장 번호로 앞 장을 가리켰다('7장에서') → 번호 없이 그 내용을 짧게 다시 부른다",
  time_deictic: "읽는 때를 못 박는 말('지금·이번 달·올해 남은')이다 → 기준일(이 책의 기준 날짜)·그 해·그 달 이름으로",
  calendar_month: "세운 본문에 달력월 이름('1월·2월')을 썼다 → 간지월 이름(경인월 등)으로",
  closing_repeat: "여러 달이 같은 마무리 문형으로 끝난다 → 이 달만의 끝맺음으로",
  negative_claim: "엔진이 관계(합·충·형·해 등)를 짚었는데 '건드리지 않는다'고 했다 → 관계 표시(marks) 그대로",
  prop_repeat: "같은 소품이 책에서 두 번째로 나왔다 → 다른 생활 장면으로",
  invest_directive: "특정 종목·상품·매수 시점을 말했다 → 성향과 원칙만",
  intensity_claim: "'가장 ~한 달·해'가 엔진 흐름 점수와 다르다 → 그 시기의 기운만",
  evidence_missing: "이 장이 반드시 써야 하는 근거가 본문에 없다 → 그 절 materials의 근거를 한 문장 더해 잇는다",
};

/** B3: 십성 누름 방향(키가 값을 누른다). 문장에 두 십성(묶음)이 능동·수동으로 나오면 방향을 본다. */
const TG_GROUP: Readonly<Record<string, string>> = { 비견: "P", 겁재: "P", 비겁: "P", 식신: "O", 상관: "O", 식상: "O", 편재: "W", 정재: "W", 재성: "W", 편관: "G", 정관: "G", 칠살: "G", 관성: "G", 관살: "G", 편인: "R", 정인: "R", 인성: "R" };
const CTRL: Readonly<Record<string, string>> = { P: "W", O: "G", W: "R", G: "P", R: "O" };
const TG_ALT = Object.keys(TG_GROUP).join("|");
const ACTIVE = new RegExp(`(${TG_ALT})(이|가|은|는)\\s[^.?!]{0,25}?(${TG_ALT})(을|를)\\s?[^.?!]{0,6}?(누르|눌러|막|극하|극해|제어|빼앗|꺾|억누르|짓누르)`);
const PASSIVE = new RegExp(`(${TG_ALT})(이|가|은|는)?\\s?[^.?!]{0,25}?(${TG_ALT})(에|에게)\\s?(눌리|눌려|막히|막혀|꺾이)`);
const REVERSED_CAUSE = /식신이 (있어|있으면)[^.?!]{0,20}생각이[^.?!]{0,10}(실행|행동)을? 막/;
export function tenGodDirection(s: string): boolean {
  const a = s.match(ACTIVE); if (a && TG_GROUP[a[1]] !== TG_GROUP[a[3]] && CTRL[TG_GROUP[a[1]]] !== TG_GROUP[a[3]]) return true;
  const p = s.match(PASSIVE); if (p && TG_GROUP[p[1]] !== TG_GROUP[p[3]] && CTRL[TG_GROUP[p[3]]] !== TG_GROUP[p[1]]) return true;
  return REVERSED_CAUSE.test(s);
}

const MARRIAGE_TALK = /결혼|시댁|처가|양가|시부모|시어머니|시아버지|장인|장모|상견례|신혼|혼수|예식/;
const FARM_JOB = /농|어업|어민|양식|축산|과수|원예/;

/** 문장 하나의 사실·개인화 규칙(소제목·카드에도 같은 규칙). */
function sentenceRules(s: string, n: number, ctx: LintCtx, heading = false): P6cRule | null {
  if (L.nicknameHits(s, ctx.nicknames, [ctx.coreImage]).length) return "nickname";
  if (L.FARMING.test(s) && !FARM_JOB.test(ctx.jobDetail)) return "farming";
  if (n === 1 && !heading && L.secondImage(s, ctx.coreImage)) return "second_image";
  if (n === 1 && heading && L.secondImage(s, ctx.coreImage)) return "second_image";
  if (!ctx.compat && L.schoolHit(s, ctx.schoolStage, ctx.jobDetail)) return "school_scene";
  if (ctx.compat && L.schoolHit(s, "none")) return "school_scene";
  if (!ctx.compat && L.presumedPartner(s, ctx.facts.relationship)) return "presumed_partner";
  if (!heading && L.pastAssertion(s)) return "past_assertion";
  if (ctx.yinYang && L.yinYangClaim(s, ctx.yinYang.yin, ctx.yinYang.yang)) return "yinyang_claim";
  if (ctx.presence && L.elementAbsenceClaims(s, ctx.presence).length) return "element_claim";
  if (ctx.dayunPhase && L.dayunPhaseClaim(s, ctx.dayunPhase)) return "dayun_claim";
  if (ctx.stars?.spouse && L.starClaim(s, "배우자", ctx.stars.spouse)) return "star_claim";
  if (ctx.stars?.child && L.starClaim(s, "자녀", ctx.stars.child)) return "star_claim";
  if (tenGodDirection(s)) return "ten_god_direction";
  if (ctx.parentingChapters.has(n) && MARRIAGE_TALK.test(s)) return "marriage_talk";
  if (ctx.groupLevels && L.groupClaimMismatch(s, ctx.groupLevels)) return "group_claim";
  if (ctx.groupLevelsBy) for (const p of ctx.groupLevelsBy) if (s.includes(p.name) && !ctx.groupLevelsBy.some(o => o !== p && s.includes(o.name)) && L.groupClaimMismatch(s, p.levels)) return "group_claim";
  if (ctx.pair && D.pairBothClaims(s, ctx.pair).length) return "pair_both";
  if (D.selfCorrection(s)) return "self_correction";
  if (D.CHAPTER_REF.test(s)) return "chapter_ref";
  if (D.timeDeictic(s, Boolean(ctx.strictTime))) return "time_deictic";
  if (ctx.calendarChapters?.has(n) && D.calendarMonth(s)) return "calendar_month";
  if (ctx.investChapters?.has(n) && D.INVEST_DIRECTIVE.test(s)) return "invest_directive";
  return null;
}

/** 소제목 안 핵심 문장 기호: 첫 쌍만 남기고 나머지·짝 없는 기호는 지운다. */
function oneKeySpan(paragraphs: readonly string[]): string[] {
  let found = false;
  return paragraphs.map(p => {
    const m = found ? null : p.match(/⟪([^⟪⟫]+)⟫/);
    if (m) { found = true; const i = p.indexOf(m[0]); return p.slice(0, i).replace(L.KEY_MARK, "") + m[0] + p.slice(i + m[0].length).replace(L.KEY_MARK, ""); }
    return p.replace(L.KEY_MARK, "");
  });
}

export type TidyCount = { readonly prefix: number; readonly mbtiCode: number; readonly monthNow: number; readonly keyMarks: number };
/** 뜻을 바꾸지 않는 결정론 정리(A4·C5·E5·H). */
export function tidyBook(chapters: readonly FinalChapter[], ctx: Pick<LintCtx, "mbtiPlain" | "monthChapters">): { chapters: FinalChapter[]; count: TidyCount } {
  let prefix = 0, mbtiCode = 0, monthNow = 0, keyMarks = 0;
  const introduced = new Set<string>();
  // 조사는 바뀐 낱말의 받침으로 다시 고른다(P6d: "속마음의 가치 기준는"), "Te(일 되게 하는 판단)"은 "일 되게 하는 판단(Te)" 하나로(겹쳐 쓰기 방지).
  const PARTICLE: Readonly<Record<string, string>> = { 은: "은는", 는: "은는", 이: "이가", 가: "이가", 을: "을를", 를: "을를", 과: "과와", 와: "과와" };
  const withJosa = (word: string, particle: string) => { const pair = PARTICLE[particle]; if (!pair) return word + particle; const ch = word.replace(/\([^)]*\)$/, "").slice(-1), code = ch.charCodeAt(0) - 0xac00; return word + ((code >= 0 && code <= 11171 && code % 28 !== 0) ? pair[0] : pair[1]); };
  const fixCodes = (p: string) => p.replace(/(?<![A-Za-z(])(Ni|Ne|Si|Se|Ti|Te|Fi|Fe)(?![A-Za-z)])(\(([^()]{2,24})\))?(은|는|이|가|을|를|과|와)?/g, (all, code: string, _g: string, inner: string | undefined, particle: string | undefined, offset: number, whole: string) => {
    // 괄호 안이면 그대로(쉬운말(Te)).
    const open = whole.lastIndexOf("(", offset), close = whole.lastIndexOf(")", offset);
    if (open > close) return all;
    const plain = ctx.mbtiPlain[code] ?? inner; if (!plain) return all;
    mbtiCode++;
    const word = introduced.has(code) ? plain : `${plain}(${code})`;
    introduced.add(code);
    return particle ? withJosa(word, particle) : word;
  });
  const out = chapters.map(c => ({ ...c, sections: c.sections.map(s => {
    let ps = s.paragraphs.map(p => {
      let q = p;
      if (L.MYEONGRI_PREFIX.test(q)) { const r = L.dropMyeongriPrefix(q); if (r !== q) prefix++; q = r; }
      // 장 번호 참조("7장에서 본 것처럼,")는 뜻을 바꾸지 않고 뗄 수 있는 꼴만 뗀다(P6d C). 나머지는 검사가 수리로 보낸다.
      if (D.CHAPTER_REF.test(q)) { const r = D.dropChapterRef(q); if (r !== q) prefix++; q = r; }
      const r2 = fixCodes(q); q = r2;
      if (ctx.monthChapters.has(c.n) && /이번 달|이번 한 달|지금 이 달/.test(q)) { monthNow++; q = q.replace(/이번 한 달/g, "이 한 달").replace(/이번 달|지금 이 달/g, "이 달"); }
      return q;
    });
    const marks = ps.join("").match(L.KEY_MARK)?.length ?? 0;
    ps = oneKeySpan(ps);
    keyMarks += marks - (ps.join("").match(L.KEY_MARK)?.length ?? 0);
    const heading = L.dropMyeongriPrefix(s.heading).replace(L.KEY_MARK, "");
    return { ...s, heading, paragraphs: ps };
  }) }));
  return { chapters: out, count: { prefix, mbtiCode, monthNow, keyMarks } };
}

const stripMarks = (s: string) => s.replace(L.KEY_MARK, "");
/** 수리 패스로 보낼 목록(책 순서). */
export function lintBook(chapters: readonly FinalChapter[], ctx: LintCtx): LintFlag[] {
  const out: LintFlag[] = [];
  const flag = (f: Omit<LintFlag, "hint">) => out.push({ ...f, hint: HINT[f.rule] });
  let formulas = 0, backrefs = 0;
  const propSeen = new Set<string>();
  const explained = new Set<string>();
  // 책 안 반복(A2): 소제목마다 색인 하나, 다른 소제목 색인과 견준다(같은 소제목 안 비슷한 문장은 문단 흐름이라 보지 않는다).
  const bySection: { at: string; idx: ReturnType<typeof L.overlapIndex> }[] = [];
  for (const c of chapters) {
    const writer = c.source !== "deterministic";
    let jobUses = 0;
    c.sections.forEach((s, si) => {
      if (s.heading && !/^\d{4}(-M\d{2})?$/.test(s.heading)) { const r = sentenceRules(s.heading, c.n, ctx, true); if (r) flag({ chapter: c.n, section: si, paragraph: -1, rule: r, sentence: s.heading }); }
      const key = s.heading, keyed = Boolean(c.keys?.includes(key));
      const yi = keyed ? ctx.yearIndex?.[key] : undefined, rel = keyed ? ctx.relationCount?.[key] : ctx.pairRelations, fl = keyed ? ctx.flow?.[key] : undefined;
      // B3 개수 지시: 소제목 글 전체에서 찾고 그 구절이 든 문단에 단다.
      const secText = s.paragraphs.map(stripMarks).join(" ");
      for (const ref of D.countMismatch(secText)) { const pi = s.paragraphs.findIndex(p => stripMarks(p).includes(ref)); if (pi >= 0) flag({ chapter: c.n, section: si, paragraph: pi, rule: "count_mismatch", sentence: ref }); }
      s.paragraphs.forEach((p, pi) => {
        const sens = splitSentences(p);
        for (const [i, raw] of sens.entries()) {
          const sen = stripMarks(raw);
          const at = { chapter: c.n, section: si, paragraph: pi, sentence: sen };
          // 대운 연도의 위치 말은 가장 구체적인 사실이라 먼저 본다(수리 지시에 그 해의 위치를 준다).
          if (yi && D.dayunYearClaim(sen, yi.index, yi.total)) { flag({ ...at, rule: "dayun_year", detail: D.dayunYearClaim(sen, yi.index, yi.total)! }); continue; }
          const r = sentenceRules(sen, c.n, ctx); if (r) { flag({ ...at, rule: r }); continue; }
          // 안전망 문장 규칙(P6d B): 예전에는 지웠다. 이제 수리로 보내고, 수리 뒤에도 걸리면 문단째 뺀다(문체 규칙은 그대로 둔다).
          const sv = sentenceViolation(sen, ctx.facts, ctx.allowed, Boolean(ctx.conditionalChapters?.has(c.n)));
          if (sv && !SOFT_SAFETY.has(sv)) { flag({ ...at, rule: "safety", detail: sv }); continue; }
          if (L.pastAssertion(sen) === null && isPastAssertion(sen)) { flag({ ...at, rule: "past_assertion", detail: "experience_assert" }); continue; }
          if (D.fragmentSentence(raw, i === sens.length - 1)) { flag({ ...at, rule: "fragment" }); continue; }
          if (D.emptyPreview(sen, sens[i + 1])) { flag({ ...at, rule: "empty_preview" }); continue; }
          if (rel !== undefined && rel > 0 && D.NEGATIVE_RELATION.test(sen)) { flag({ ...at, rule: "negative_claim" }); continue; }
          if (fl && ((PEAK.test(sen) && fl.score < fl.max) || (LOW.test(sen) && fl.score > fl.min))) { flag({ ...at, rule: "intensity_claim" }); continue; }
          if (writer && L.copiedWindow(sen, ctx.corpus)) { flag({ ...at, rule: "db_copy" }); continue; }
          if (writer && ctx.prior.length && L.overlapping(ctx.prior, [sen]).length) { flag({ ...at, rule: "prior_overlap" }); continue; }
          if (L.MEANING_FORMULA.test(sen)) {
            const term = sen.match(/([가-힣]{1,10}) ?\([一-鿿]{1,6}\)/)?.[1] ?? sen.match(/([가-힣]{1,10})(은|는) 명리/)?.[1] ?? "";
            if (term && explained.has(term)) { flag({ ...at, rule: "meaning_repeat" }); continue; }
            if (term) explained.add(term);
            if (++formulas > L.MAX_FORMULA) { flag({ ...at, rule: "formula_excess" }); continue; }
          }
          if (L.BACKREF_WORD.test(sen) && ++backrefs > L.MAX_BACKREF) { flag({ ...at, rule: "backref_excess" }); continue; }
          if (ctx.jobProps.some(x => sen.includes(x)) && (ctx.noJobChapters.has(c.n) || ++jobUses > 1)) { flag({ ...at, rule: "job_prop" }); continue; }
          // F 소품 원장: 같은 소품 명사는 책당 1회(두 번째부터).
          const prop = ctx.props?.find(x => sen.includes(x));
          if (prop) { if (propSeen.has(prop)) { flag({ ...at, rule: "prop_repeat", detail: prop }); continue; } propSeen.add(prop); }
          // 책 안 같은 장면·문장(A2): 다른 소제목의 문장과 5-gram 자카드 0.5 이상.
          const at2 = `${c.n}.${si}`;
          if (bySection.some(x => x.at !== at2 && x.idx.has(sen))) { flag({ ...at, rule: "scene_repeat" }); continue; }
          let mine = bySection.find(x => x.at === at2); if (!mine) { mine = { at: at2, idx: L.overlapIndex() }; bySection.push(mine); }
          mine.idx.add(sen);
        }
      });
    });
  }
  // G 장마다 써야 하는 근거(문체 규칙: 문단은 빼지 않고 수리로 근거 한 문장을 더하게 한다).
  for (const c of chapters) { const terms = ctx.requiredTerms?.get(c.n); if (!terms || c.source === "deterministic") continue;
    const text = c.sections.flatMap(s => s.paragraphs).join(" ");
    for (const re of terms) if (!re.test(text)) { const si = Math.max(0, c.sections.findIndex(s => s.paragraphs.length)); if (c.sections[si]?.paragraphs.length) flag({ chapter: c.n, section: si, paragraph: 0, rule: "evidence_missing", sentence: "", detail: re.source }); }
  }
  // E 마무리 문형: 달 장(세운 월)의 key마다 마지막 문장 끝 두 어절, 같은 꼴은 12달 가운데 3번까지.
  for (const c of chapters) if (c.keys && ctx.calendarChapters?.has(c.n)) {
    const seenFrame = new Map<string, number>();
    c.sections.forEach((s, si) => {
      const pi = s.paragraphs.length - 1; if (pi < 0) return;
      const last = splitSentences(s.paragraphs[pi]).at(-1) ?? ""; const f = D.closingFrame(last); if (!f) return;
      const n = (seenFrame.get(f) ?? 0) + 1; seenFrame.set(f, n);
      if (n > D.MAX_CLOSING_REPEAT) flag({ chapter: c.n, section: si, paragraph: pi, rule: "closing_repeat", sentence: stripMarks(last), detail: f });
    });
  }
  out.push(...lintCards(chapters, ctx));
  return out;
}

/** 카드 줄(F1·F2, P6d D): 빠짐(살필 점 포함)·꼴·길이·같은 필드끼리 겹침(같은 천간 십성 key끼리는 더 엄격히)·문장 규칙. */
export const SAME_TEN_GOD_JACCARD = 0.3;
export function lintCards(chapters: readonly FinalChapter[], ctx: LintCtx): LintFlag[] {
  const out: LintFlag[] = [];
  const seen: Record<CardField, { v: string; tg?: string }[]> = { image: [], todo: [], review: [], caution: [] };
  for (const c of chapters) if (c.keys) c.sections.forEach((s, si) => {
    const period = ctx.periods?.[s.heading] ?? "current";
    const card: SectionCard = s.card ?? {};
    const tg = ctx.cardTenGod?.[s.heading];
    // 살필 점도 작가가 그 시기의 실제 십성·관계 조합으로 쓴다(P6d D): "없음"은 받지 않는다.
    const want: CardField[] = ["image", period === "past" ? "review" : "todo", "caution"];
    const f = (field: CardField, rule: P6cRule, sentence: string) => out.push({ chapter: c.n, section: si, paragraph: -1, card: field, rule, sentence, hint: HINT[rule] });
    for (const field of want) if (!card[field]) f(field, "card_missing", "");
    if (period === "past" && card.todo && !card.review) f("review", "card_form", card.todo);
    for (const field of ["image", "todo", "review", "caution"] as CardField[]) {
      const v = card[field]; if (!v) continue;
      if (field === "todo" && period === "past") continue;
      const len = v.length;
      if (field === "image" ? len < 10 || len > 34 : len < 8 || len > 60) { f(field, "card_length", v); continue; }
      if (field === "review" && !/\?$/.test(v.trim())) { f(field, "card_form", v); continue; }
      if (field === "todo" && /\?$/.test(v.trim())) { f(field, "card_form", v); continue; }
      if (sentenceRules(v, c.n, ctx, true) || sentenceViolation(v, ctx.facts)) { f(field, "card_rule", v); continue; }
      if (L.overlapping(seen[field].map(x => x.v), [v]).length || (tg && L.overlapping(seen[field].filter(x => x.tg === tg).map(x => x.v), [v], SAME_TEN_GOD_JACCARD).length)) { f(field, "card_overlap", v); continue; }
      seen[field].push({ v, ...(tg ? { tg } : {}) });
    }
  });
  return out;
}

/**
 * 수리 뒤에도 걸리는 문단(P6d B, 사용자 결정): 사실·금지 규칙(HARD_RULES)에 걸린 문단은 문단째 뺀다. 문장 하나만 지우면 조각 문장이 남는다.
 * 문체·반복 규칙(db_copy·scene_repeat 등)은 문단을 그대로 두고 기록만 한다. 문단이 다 빠진 소제목은 뺀다(반복 장 key는 비워 두고 부르는 쪽이 채운다).
 */
export function enforce(chapters: readonly FinalChapter[], flags: readonly LintFlag[]): { chapters: FinalChapter[]; removed: number; droppedParagraphs: number; emptyKeys: readonly { chapter: number; key: string }[] } {
  let droppedParagraphs = 0;
  const bad = new Set(flags.filter(f => f.paragraph >= 0 && !f.card && HARD_RULES.has(f.rule)).map(f => `${f.chapter}.${f.section}.${f.paragraph}`));
  const emptyKeys: { chapter: number; key: string }[] = [];
  const out = chapters.map(c => ({ ...c, sections: c.sections.map((s, si) => {
    const ps = s.paragraphs.filter((_, pi) => !bad.has(`${c.n}.${si}.${pi}`));
    droppedParagraphs += s.paragraphs.length - ps.length;
    if (!ps.length && c.keys?.includes(s.heading)) emptyKeys.push({ chapter: c.n, key: s.heading });
    return { ...s, paragraphs: ps };
  }).filter(s => s.paragraphs.length || c.keys?.includes(s.heading)) }));
  return { chapters: out.map(c => ({ ...c, chars: c.sections.reduce((a, s) => a + s.paragraphs.join("").length, 0) })), removed: 0, droppedParagraphs, emptyKeys };
}

/** 같은 소제목 수(이전·이후)를 맞춰 볼 때 쓰는 키. */
export const flagKey = (f: Pick<LintFlag, "chapter" | "section" | "paragraph" | "card">) => `${f.chapter}.${f.section}.${f.card ? `c:${f.card}` : f.paragraph}`;
export type { BookSection };
