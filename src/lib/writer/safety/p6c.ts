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
import { splitSentences } from "./patterns";
import { sentenceViolation, type SafetyFacts } from "./sentences";

export type P6cRule = "db_copy" | "prior_overlap" | "formula_excess" | "backref_excess" | "meaning_repeat" | "scene_repeat" | "nickname" | "farming" | "second_image"
  | "school_scene" | "presumed_partner" | "past_assertion" | "job_prop" | "yinyang_claim" | "element_claim" | "dayun_claim" | "star_claim" | "ten_god_direction"
  | "marriage_talk" | "card_missing" | "card_form" | "card_overlap" | "card_length" | "card_rule";
export type CardField = "image" | "todo" | "review" | "caution";
/** paragraph: -1 = 소제목, card가 있으면 카드 줄. */
export type LintFlag = { readonly chapter: number; readonly section: number; readonly paragraph: number; readonly card?: CardField; readonly rule: P6cRule; readonly sentence: string; readonly hint: string };
export type LintCtx = {
  readonly facts: SafetyFacts; readonly jobDetail: string; readonly schoolStage: L.SchoolStage | "student";
  readonly yinYang?: { readonly yin: number; readonly yang: number }; readonly presence?: L.ElementPresence; readonly dayunPhase?: L.DayunPhase;
  readonly stars?: { readonly spouse?: L.StarWhere; readonly child?: L.StarWhere };
  readonly coreImage: string; readonly nicknames: readonly string[]; readonly corpus: ReadonlySet<string>; readonly prior: readonly string[];
  readonly jobProps: readonly string[]; readonly noJobChapters: ReadonlySet<number>; readonly parentingChapters: ReadonlySet<number>; readonly monthChapters: ReadonlySet<number>;
  readonly compat: boolean; readonly mbtiPlain: Readonly<Record<string, string>>;
  /** 카드 기간 상태(key → past·current·future). */
  readonly periods?: Readonly<Record<string, "past" | "current" | "future">>;
};

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
  const fixCodes = (p: string) => p.replace(/(?<![A-Za-z(])(Ni|Ne|Si|Se|Ti|Te|Fi|Fe)(?![A-Za-z)])/g, (code, _c, offset: number, whole: string) => {
    // 괄호 안이면 그대로(쉬운말(Te)).
    const open = whole.lastIndexOf("(", offset), close = whole.lastIndexOf(")", offset);
    if (open > close) return code;
    const plain = ctx.mbtiPlain[code]; if (!plain) return code;
    mbtiCode++;
    if (introduced.has(code)) return plain;
    introduced.add(code); return `${plain}(${code})`;
  });
  const out = chapters.map(c => ({ ...c, sections: c.sections.map(s => {
    let ps = s.paragraphs.map(p => {
      let q = p;
      if (L.MYEONGRI_PREFIX.test(q)) { const r = L.dropMyeongriPrefix(q); if (r !== q) prefix++; q = r; }
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
  const explained = new Set<string>();
  // 책 안 반복(A2): 소제목마다 색인 하나, 다른 소제목 색인과 견준다(같은 소제목 안 비슷한 문장은 문단 흐름이라 보지 않는다).
  const bySection: { at: string; idx: ReturnType<typeof L.overlapIndex> }[] = [];
  for (const c of chapters) {
    const writer = c.source !== "deterministic";
    let jobUses = 0;
    c.sections.forEach((s, si) => {
      if (s.heading && !/^\d{4}(-M\d{2})?$/.test(s.heading)) { const r = sentenceRules(s.heading, c.n, ctx, true); if (r) flag({ chapter: c.n, section: si, paragraph: -1, rule: r, sentence: s.heading }); }
      s.paragraphs.forEach((p, pi) => {
        for (const raw of splitSentences(p)) {
          const sen = stripMarks(raw);
          const at = { chapter: c.n, section: si, paragraph: pi, sentence: sen };
          const r = sentenceRules(sen, c.n, ctx); if (r) { flag({ ...at, rule: r }); continue; }
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
          // 책 안 같은 장면·문장(A2): 다른 소제목의 문장과 5-gram 자카드 0.5 이상.
          const key = `${c.n}.${si}`;
          if (bySection.some(x => x.at !== key && x.idx.has(sen))) { flag({ ...at, rule: "scene_repeat" }); continue; }
          let mine = bySection.find(x => x.at === key); if (!mine) { mine = { at: key, idx: L.overlapIndex() }; bySection.push(mine); }
          mine.idx.add(sen);
        }
      });
    });
  }
  out.push(...lintCards(chapters, ctx));
  return out;
}

/** 카드 줄(F1·F2): 빠짐·꼴·길이·같은 필드끼리 겹침·문장 규칙. */
export function lintCards(chapters: readonly FinalChapter[], ctx: LintCtx): LintFlag[] {
  const out: LintFlag[] = [];
  const seen: Record<CardField, string[]> = { image: [], todo: [], review: [], caution: [] };
  for (const c of chapters) if (c.keys) c.sections.forEach((s, si) => {
    const period = ctx.periods?.[s.heading] ?? "current";
    const card: SectionCard = s.card ?? {};
    const want: CardField[] = ["image", period === "past" ? "review" : "todo"];
    const f = (field: CardField, rule: P6cRule, sentence: string) => out.push({ chapter: c.n, section: si, paragraph: -1, card: field, rule, sentence, hint: HINT[rule] });
    for (const field of want) if (!card[field]) f(field, "card_missing", "");
    for (const field of ["image", "todo", "review", "caution"] as CardField[]) {
      const v = card[field]; if (!v) continue;
      const len = v.length;
      if (field === "image" ? len < 10 || len > 34 : len < 8 || len > 60) { f(field, "card_length", v); continue; }
      if (field === "review" && !/\?$/.test(v.trim())) { f(field, "card_form", v); continue; }
      if (field === "todo" && /\?$/.test(v.trim())) { f(field, "card_form", v); continue; }
      if (sentenceRules(v, c.n, ctx, true) || sentenceViolation(v, ctx.facts)) { f(field, "card_rule", v); continue; }
      if (L.overlapping(seen[field], [v]).length) { f(field, "card_overlap", v); continue; }
      seen[field].push(v);
    }
  });
  return out;
}

/** 수리 뒤에도 걸리는 문장을 지운다. 지운 뒤 한 문장도 안 남은 문단은 뺀다(소제목에 문단이 하나뿐이면 남긴다). */
export function enforce(chapters: readonly FinalChapter[], flags: readonly LintFlag[]): { chapters: FinalChapter[]; removed: number; droppedParagraphs: number } {
  let removed = 0, droppedParagraphs = 0;
  const by = new Map<string, LintFlag[]>();
  for (const f of flags) { if (f.paragraph < 0 || f.card) continue; const k = `${f.chapter}.${f.section}.${f.paragraph}`; by.set(k, [...(by.get(k) ?? []), f]); }
  const out = chapters.map(c => ({ ...c, sections: c.sections.map((s, si) => {
    const ps = s.paragraphs.map((p, pi) => {
      const fs = by.get(`${c.n}.${si}.${pi}`); if (!fs) return p;
      const bad = new Set(fs.map(f => f.sentence));
      const kept = splitSentences(p).filter(x => !bad.has(stripMarks(x)));
      removed += splitSentences(p).length - kept.length;
      return kept.join(" ");
    });
    const nonEmpty = ps.filter(p => splitSentences(p).length >= 1);
    droppedParagraphs += ps.length - nonEmpty.length;
    return { ...s, paragraphs: nonEmpty.length ? nonEmpty : ps.filter(Boolean).slice(0, 1) };
  }).filter(s => s.paragraphs.length) }));
  return { chapters: out.map(c => ({ ...c, chars: c.sections.reduce((a, s) => a + s.paragraphs.join("").length, 0) })), removed, droppedParagraphs };
}

/** 같은 소제목 수(이전·이후)를 맞춰 볼 때 쓰는 키. */
export const flagKey = (f: Pick<LintFlag, "chapter" | "section" | "paragraph" | "card">) => `${f.chapter}.${f.section}.${f.card ? `c:${f.card}` : f.paragraph}`;
export type { BookSection };
