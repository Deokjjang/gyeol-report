/**
 * 안전망 문장 검사(P3 D, 결정론·호출 0). 위반 문장은 지우고 기록한다.
 * 삭제: 날짜·시기 + 사건 확정 / 입력에 없는 사실(연인·배우자·자녀·직업 형태) / 시간 미상인데 시주·자녀 자리 / MBTI 없음인데 MBTI /
 *       내부 용어 / 옛 부정 낱말(A-3) / 문체 예시와 15자 이상 일치 / 책 안에서 이미 나온 같은 문장(20자 이상, 뒤의 것).
 * 경고(지우지 않음): 과거 경험 단정, 용어가 쉬운 말 없이 먼저 나옴.
 */
import { STYLE_EXAMPLES } from "../prompt/examples";
import { OLD_NEGATIVE, isPastAssertion, splitSentences } from "./patterns";

export type SafetyFacts = {
  readonly birthTimeKnown: boolean;
  readonly mbti: string | null;
  readonly relationship: "single" | "dating" | "married" | "unknown";
  readonly children: "has" | "none" | "unknown";
  readonly job: "employed" | "business" | "student" | "none";
};
export type SentenceRule = "date_event" | "fact_partner" | "fact_spouse" | "fact_children" | "fact_job" | "hour_pillar" | "mbti_absent" | "internal_term" | "old_negative" | "example_copy" | "duplicate_sentence";
export type Deletion = { readonly chapter: number; readonly rule: SentenceRule; readonly sentence: string };

const CONDITIONAL = /(되면|된다면|생기면|생긴다면|만나면|만난다면|라면|이라면|할 때|하게 될|언젠가|훗날|앞으로|미래의|만약|혹시|키우게|키운다면|함께 살게|함께 산다면|결혼한다면|결혼하면|할수록|마음에 둔|좋아하는 사람)/;
const DATE = /(\d{4}년|\d{1,2}월|올해|내년|내후년|이번 달|다음 달|\d+살|\d+세|\d+대 ?(초|중|후)반|\d+년 ?(안|내|뒤|후)|(봄|여름|가을|겨울)에)/;
const EVENT_DEFINITE = /(결혼|혼인|이혼|이별|헤어지|합격|승진|임신|출산|사고|질병|수술|이사|퇴사|이직|취업|창업|당첨|큰돈)[^.?!]{0,12}(합니다|됩니다|하게 됩니다|할 것입니다|할 겁니다|생깁니다|옵니다|찾아옵니다|일어납니다|있을 것입니다|있습니다)/;
const ABSOLUTE = /(반드시|틀림없이|무조건|100%)[^.?!]{0,20}(결혼|이혼|이별|합격|승진|임신|출산|사고|질병|이직|취업|부자)/;
const SPOUSE = /(?<![가-힣])(남편|아내|와이프|배우자)/;
const SPOUSE_TERM = /배우자 ?(자리|별|궁|성)|(남편|아내|배우자)감|배우자를 (보는|고르는)/g;
const PARTNER = /(?<![가-힣])(애인|연인|남자친구|여자친구|남친|여친)/;
const CHILD = /(?<![가-힣])(아이|자녀|아들|딸|애들)(가|를|의|이|와|도|랑|한테|에게|는|은)\s/;
const CHILD_TERM = /자녀 ?(자리|별|궁|성)|어린아이|아이처럼|아이 같은/g;
const JOB_EMPLOYED = /(당신의 회사|다니는 회사|직장 상사|팀장님|부장님|사무실에서|회사 동료)/;
const JOB_BUSINESS = /(당신의 가게|가게 손님|매출|단골손님)/;
const JOB_STUDENT = /(담임|수업 시간|학교 숙제|시험 기간|반 친구)/;
const HOUR = /((?<![가-힣])시주|(?<![가-힣])시지|시간 기둥|태어난 시(간|각)?의? ?(기둥|자리|글자)|자녀 ?자리|자녀궁|말년의? ?자리)/;
const MBTI_WORD = /\b[EI][NS][TF][JP]\b|MBTI|\b(Ni|Ne|Si|Se|Ti|Te|Fi|Fe)\b/;
const INTERNAL = /(브리프|팩폭|Fusion|퓨전|명식|trait|featureId|warmTurn|oneLiner|positionNote|strengthNote|shadows?\.|\bref\b|\bt\d{1,2}\b|\bs\d\b|[a-z][A-Za-z]+:[A-Z가-힣一-鿿_]|계산 연결|재료 ?목록|\{key\}|\[이름\]|\{이름\})/;

export const norm = (t: string) => t.replace(/[\s\p{P}\p{S}]/gu, "");
const EXAMPLE_WINDOW = 15;
const exampleWindows = (() => {
  const set = new Set<string>();
  for (const e of STYLE_EXAMPLES) for (const line of e.text.split("\n")) {
    if (line.startsWith("#")) continue;
    const n = norm(line); for (let i = 0; i + EXAMPLE_WINDOW <= n.length; i++) set.add(n.slice(i, i + EXAMPLE_WINDOW));
  }
  return set;
})();
/** 예시와 15자 이상 같은가. 그 고객 브리프에도 있는 구절(지식 DB 재료)은 예시 복사가 아니다. */
export function copiesExample(sentence: string, allowed?: ReadonlySet<string>): boolean {
  const n = norm(sentence);
  for (let i = 0; i + EXAMPLE_WINDOW <= n.length; i++) { const w = n.slice(i, i + EXAMPLE_WINDOW); if (exampleWindows.has(w) && !allowed?.has(w)) return true; }
  return false;
}
/** 브리프 글에서 예시와 겹치는 15자 창만 모은다(예외 목록). */
export function allowedWindows(briefText: string): Set<string> {
  const out = new Set<string>(); const n = norm(briefText);
  for (let i = 0; i + EXAMPLE_WINDOW <= n.length; i++) { const w = n.slice(i, i + EXAMPLE_WINDOW); if (exampleWindows.has(w)) out.add(w); }
  return out;
}

/** 문장 하나의 위반 규칙(없으면 null). */
export function sentenceViolation(s: string, f: SafetyFacts, allowed?: ReadonlySet<string>): SentenceRule | null {
  if ((DATE.test(s) && EVENT_DEFINITE.test(s)) || ABSOLUTE.test(s)) return "date_event";
  const conditional = CONDITIONAL.test(s);
  if (f.relationship !== "married" && SPOUSE.test(s.replace(SPOUSE_TERM, "")) && !conditional) return "fact_spouse";
  if ((f.relationship === "single" || f.relationship === "unknown") && PARTNER.test(s) && !conditional) return "fact_partner";
  if (f.children !== "has" && CHILD.test(s.replace(CHILD_TERM, "") + " ") && !conditional) return "fact_children";
  if (!conditional && ((f.job !== "employed" && JOB_EMPLOYED.test(s)) || (f.job !== "business" && JOB_BUSINESS.test(s)) || (f.job !== "student" && JOB_STUDENT.test(s)))) return "fact_job";
  if (!f.birthTimeKnown && HOUR.test(s)) return "hour_pillar";
  if (!f.mbti && MBTI_WORD.test(s)) return "mbti_absent";
  if (INTERNAL.test(s)) return "internal_term";
  if (OLD_NEGATIVE.test(s)) return "old_negative";
  if (copiesExample(s, allowed)) return "example_copy";
  return null;
}

/** 문단에서 위반 문장을 지운다. */
export function filterParagraph(p: string, f: SafetyFacts, chapter: number, deletions: Deletion[], allowed?: ReadonlySet<string>, seen?: Set<string>): string {
  const kept: string[] = [];
  for (const s of splitSentences(p)) {
    const key = norm(s);
    const rule = sentenceViolation(s, f, allowed) ?? (seen && key.length >= 20 && seen.has(key) ? "duplicate_sentence" : null);
    if (rule) deletions.push({ chapter, rule, sentence: s }); else { kept.push(s); if (key.length >= 20) seen?.add(key); }
  }
  return kept.join(" ");
}

export type StyleWarning = { readonly chapter: number; readonly kind: "past_assertion" | "term_first"; readonly text: string };
/** 경고: 과거 단정 문장, 용어가 괄호 밖에서 먼저 나온 경우(용어 목록은 호출하는 쪽이 준다). */
export function styleWarnings(chapter: number, paragraphs: readonly string[], terms: readonly string[], introduced: Set<string>): StyleWarning[] {
  const out: StyleWarning[] = [];
  for (const p of paragraphs) {
    for (const s of splitSentences(p)) if (isPastAssertion(s)) out.push({ chapter, kind: "past_assertion", text: s });
    for (const t of terms) {
      if (introduced.has(t)) continue;
      const i = p.indexOf(t); if (i < 0) continue;
      introduced.add(t);
      const open = p.lastIndexOf("(", i), close = p.lastIndexOf(")", i);
      if (!(open > close)) out.push({ chapter, kind: "term_first", text: t });
    }
  }
  return out;
}
