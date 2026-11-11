/**
 * P6d 원고 검사(결정론·호출 0). p6c.ts lintBook이 부른다. 걸린 문단은 수리 1회로 보내고, 수리 뒤에도 걸리는 사실·금지 규칙은 문단째 뺀다(문장 삭제 없음).
 * B 조각 문장: 앞 구절이 빠진 문장 · 받는 내용이 없는 예고 · 개수가 맞지 않는 지시.
 * C 사실·위치: 대운 안 몇 번째 해 · 궁합 "둘 다" · 괄호 속 자기 정정 · 장 번호 참조.
 * E 시점: "지금·이번 달" · 세운 본문의 달력월 이름 · 지난 달 마무리 문형 반복.
 * F 부정 단정: 엔진 관계 목록이 비어 있을 때만 "건드리지 않는다".  G 투자 지시.
 */
import { groupClaims, type GroupLevels } from "./lint";

/** B1 앞 구절이 빠진 문장: 조사·연결형·인용 꼬리로 시작한다("하는 물음이 자주 올라와요"). */
// AM 재생성 판독(sodam 3.2.2): 「하고 싶은 일의 목록 대신 …」은 온전한 문장이다(「하고 싶」은 조각 시작이 아님).
const FRAGMENT_START = /^(하는|하던|하고(?! 싶)|하며|하면서|하자는|라는|라고|이라는|이라고|이란|싶은|싶다는|다는|냐는|자는|는|은|을|를|에|의|와|과|로|으로|에서|에게|까지|부터|처럼|보다|만큼|한테|이랑|랑)\s/;
/** 끝맺음이 없는 문장(문단 끝이 문장 중간에서 끊김). */
const TERMINATED = /([.!?…]|[다요죠까네])["'”’)⟫]*$/;
export function fragmentSentence(sentence: string, last = false): boolean {
  const s = sentence.replace(/[⟪⟫]/g, "").trim();
  if (!s) return false;
  // 곧은 따옴표(' ")는 여는 따옴표일 수 있어 보지 않는다(r1: "'너 그 자격증 따면…' 하며"를 조각으로 잡았다). 닫는 굽은 따옴표·괄호로 시작하면 조각.
  if (FRAGMENT_START.test(s) || /^[”’)\]]/.test(s) || /^[,.?!·]/.test(s)) return true;
  return last && !TERMINATED.test(s);
}

/** B2 받는 내용이 없는 예고("한 달 뒤에는 이런 변화가 있을 거예요."): 다음 문장이 내용을 펼치지 않으면 실패. */
const PREVIEW = /(이런|이러한|다음과 같은|아래와 같은|다음의|몇 가지) ?[가-힣 ]{0,8}(변화|일|모습|효과|차이|결과|장면|신호|점)(이|가|들이)? (있을|생길|찾아올|올|나타날|보일|생겨날|일어날|따라올)[^.?!]{0,6}(거예요|겁니다|거랍니다|것입니다|거에요)/;
const ELABORATES = /^(첫째|첫 번째|먼저|우선|하나는|하나,|예를 들어|이를테면|가령|바로)/;
export function emptyPreview(sentence: string, next: string | undefined): boolean {
  return PREVIEW.test(sentence) && !(next && ELABORATES.test(next.trim()));
}

/** B3 개수가 맞지 않는 지시("이 세 가지"): 같은 소제목 앞쪽에 그 개수가 나오지 않았다. */
const NUM: Readonly<Record<string, number>> = { 한: 1, 두: 2, 세: 3, 네: 4, 다섯: 5, 여섯: 6 };
const REF_COUNT = /(?<![가-힣])(이|그|위|앞의|이런|이들) (한|두|세|네|다섯|여섯) (가지|줄|단계|개|마디|약속|습관|행동)/g;
const ANNOUNCED = /(?<![가-힣])(한|두|세|네|다섯|여섯) (가지|줄|단계|개|마디|약속|습관|행동)/g;
const ORDINALS = ["첫째", "둘째", "셋째", "넷째", "다섯째"];
/** 앞 글에서 셀 수 있는 개수 후보: 밝힌 개수, 서수(첫째…), "하나는 … 다른 하나는", 바로 앞 문장의 쉼표 나열. */
function countsBefore(before: string, prevSentence: string): Set<number> {
  const out = new Set<number>();
  for (const m of before.matchAll(ANNOUNCED)) { const pre = before.slice(Math.max(0, (m.index ?? 0) - 3), m.index ?? 0); if (!/(이|그|위|의) $/.test(pre)) out.add(NUM[m[1]]); }
  const ord = ORDINALS.filter(o => before.includes(o)).length; if (ord >= 2) out.add(ord);
  if (/하나는/.test(before) && /다른 하나는|또 하나는|나머지 하나는/.test(before)) out.add(2);
  const items = prevSentence.split(/,|그리고|와 |과 /).filter(x => x.trim().length >= 2).length; if (items >= 2) { out.add(items); out.add(items - 1); }
  return out;
}
export function countMismatch(sectionText: string): string[] {
  const out: string[] = [];
  for (const m of sectionText.matchAll(REF_COUNT)) {
    const at = m.index ?? 0, before = sectionText.slice(0, at);
    const sentences = before.split(/(?<=[.!?])\s+/), prev = sentences.at(-1)?.trim() ? sentences.at(-1)! : sentences.at(-2) ?? "";
    // 같은 문장 안에서 바로 앞에 나열이 있으면 그 문장도 본다("정리 하나, 말 한마디, 쉬는 하루만 붙잡으세요. 그 세 가지면").
    if (!countsBefore(before, prev).has(NUM[m[2]])) out.push(m[0]);
  }
  return out;
}

/** C 궁합 "둘 다 X": 두 사람의 엔진 값으로 본다. */
export type PairFacts = {
  readonly names: readonly [string, string];
  /** 감지된 기운 이름(한자 괄호 앞 한글, 예: 태·관살혼잡·천문성). */
  readonly features: readonly [ReadonlySet<string>, ReadonlySet<string>];
  readonly groups: readonly [GroupLevels, GroupLevels];
  readonly lacking: readonly [readonly string[], readonly string[]];
  readonly excess: readonly [readonly string[], readonly string[]];
  readonly mbti: readonly [string | null, string | null];
};
const BOTH = /(둘 다|두 사람 모두|두 분 모두|둘 모두|두 사람 다|둘이 똑같이)/;
const ELEMENT_KO_RE: Readonly<Record<string, RegExp>> = { WOOD: /나무|목\(木\)|木/, FIRE: /불(?![가-힣])|화\(火\)|火/, EARTH: /흙|토\(土\)|土/, METAL: /쇠|금\(金\)|金/, WATER: /물(?![가-힣])|수\(水\)|水/ };
/** "둘 다" 주장 가운데 한 사람에게 맞지 않는 것(없으면 빈 배열). */
export function pairBothClaims(sentence: string, p: PairFacts): string[] {
  const m = sentence.match(BOTH); if (!m) return [];
  const tail = sentence.slice((m.index ?? 0) + m[0].length);
  const out: string[] = [];
  // 이어 쓴 "둘 다 A, 둘 다 B" 마디마다 본다.
  for (const part of tail.split(BOTH).filter((_, i) => i % 2 === 0)) {
    const clause = part.split(/[,.?!]|하며|하고 /)[0];
    for (const c of groupClaims(clause)) if (p.groups[0][c.group] !== c.level || p.groups[1][c.group] !== c.level) out.push(`${c.group}:${c.level}`);
    const mb = clause.match(/^\s*([EINSTFJP])(?:[이가라형]|\s)/);
    if (mb && !(p.mbti[0]?.includes(mb[1]) && p.mbti[1]?.includes(mb[1]))) out.push(`mbti:${mb[1]}`);
    for (const [e, re] of Object.entries(ELEMENT_KO_RE)) {
      const em = clause.match(new RegExp(`(${re.source})( 기운)?(이|가|은|는)? ?(부족|약|모자라|적|없|많|강|넘치)`));
      if (!em) continue;
      const weak = /부족|약|모자라|적|없/.test(em[em.length - 1]);
      if (weak ? !(p.lacking[0].includes(e) && p.lacking[1].includes(e)) : !(p.excess[0].includes(e) && p.excess[1].includes(e))) out.push(`element:${e}`);
    }
    // 기운 이름 + (이|가) + 있: 두 사람 모두 그 기운이 감지돼야 한다.
    for (const fm of clause.matchAll(/([가-힣]{1,6})(?:\([一-鿿]{1,4}\))?(이|가) (있|들어 있|자리)/g)) {
      const name = fm[1];
      const known = p.features[0].has(name) || p.features[1].has(name);
      if (known && !(p.features[0].has(name) && p.features[1].has(name))) out.push(`feature:${name}`);
    }
    for (const fm of clause.matchAll(/^\s*([가-힣]{2,6})(입니다|이에요|예요|이고|이라)/g)) {
      const name = fm[1];
      if ((p.features[0].has(name) || p.features[1].has(name)) && !(p.features[0].has(name) && p.features[1].has(name))) out.push(`feature:${name}`);
    }
  }
  return out;
}

/** C 괄호 속 자기 정정("정인(正人이 아니라 正印)"). */
export const SELF_CORRECTION = /\([^()]{0,24}(이|가)? ?아니(라|고)[^()]{0,24}\)/;
export const selfCorrection = (s: string) => SELF_CORRECTION.test(s) && /[一-鿿]/.test(s.match(SELF_CORRECTION)![0]) || /[一-鿿]{1,4}(이|가) 아니라 [一-鿿]{1,4}/.test(s);

/** C 장 번호 참조("7장에서 본 것처럼"). */
// 최종판3 12: 「앞 장에서 본 어긋남의 뿌리를…」(궁합)처럼 번호 없이 앞·다음 장을 가리키는 꼴도 장 참조다.
export const CHAPTER_REF = /(?<![0-9가-힣])(제 ?)?\d{1,2} ?장(에서|의|에|과|부터|까지|을|를|처럼|에서처럼|에서 본|에서 말한)|(?<![가-힣])(?<!(맨|첫|뒷|한|빈) )(앞|다음|이전|지난) 장(에서|의|에|처럼)/;
/** 뜻을 바꾸지 않고 지울 수 있는 장 번호 참조 꼴(정리 단계). */
export const dropChapterRef = (s: string) => s.replace(/(?<![0-9가-힣])\d{1,2} ?장에서 (본|말한|살핀|짚은) (것처럼|대로),? ?/g, "").replace(/(?<![0-9가-힣])\d{1,2} ?장에서처럼,? ?/g, "")
  .replace(/(?<![가-힣])(앞|이전|지난) 장에서 (본|말한|살핀|짚은|이야기한|다룬) (것처럼|대로),? ?/g, "").replace(/(?<![가-힣])(앞|이전|지난) 장에서 (본|말한|살핀|짚은|이야기한|다룬) (?=[가-힣])/g, "");

/** E 시점 지시: 대운·세운(달력이 있는 책)은 "지금" 전부, 그 밖은 시점을 못 박는 말만. */
// AM 7부(세운 판독: 맨 「올해」 27곳이 검사에 안 걸림): 달력 책은 맨 「올해」도 시점 말이다(남은 것은 tidy가 연도로 바꾼 뒤 — 따옴표 안 대사·「올해 남은」).
const TIME_STRICT = /지금|이번 달|이번 한 달|올해|요즘 들어/;
const TIME_LOOSE = /지금 우리가 있는|지금 (이|그) (시기|때|달|해)(?![가-힣])|이번 달|이번 한 달|올해 남은 (두|세|한|몇) ?(달|개월)|올해 남은/;
/** MBTI 기능 쉬운 이름("지금 이 순간 감각(Se)")은 시점 말이 아니다(r1 커리어: 기능 이름이 걸렸다). */
const FUNCTION_NAME_NOW = /지금 이 순간(의)? 감각/g;
export const timeDeictic = (s: string, strict: boolean) => (strict ? TIME_STRICT : TIME_LOOSE).test(s.replace(FUNCTION_NAME_NOW, ""));

/** E 세운 본문의 달력월 이름("1월에 본 결", "2월과 같은 결"). "11월 4일"처럼 날짜는 허용. */
/** 최종판3 8: 대운 표기 「2027년 5월 무렵부터」는 교운 시각 표기라 허용. AM 7부: 연도가 붙은 「2022년 4월 무렵에 시작해 2032년 4월 무렵까지」(교운 연·월 기간, 최종 A-4)도 같은 표기 — calendarMonth가 뗀다(연도 없는 「5월 무렵」은 그대로 걸린다). */
export const CALENDAR_MONTH = /(?<![0-9])(1[0-2]|[1-9]) ?월(?! ?\d{1,2} ?일)(?! 무렵부터)(?![0-9가-힣]*(일 기준|일부터))/;
/** AM 2부(덕짱님 지시 2026-11-11): 세운 달 이름은 표와 본문이 한 체계 「2월 · 임인월」 — 달력 숫자가 그 달 간지월 이름과 짝이면 허용한다. */
const MONTH_NAME_PAIR = /(20\d\d년 )?(1[0-2]|[1-9]) ?월 ?(·|\(|,)? ?[갑을병정무기경신임계][자축인묘진사오미신유술해]월\)?/g;
/**
 * AM 7부: 달력 책의 맨 「올해」 → 그 책이 말하는 해(세운 = 신년판 해 2027, 대운 = 기준일의 해). 조사도 맞춘다(는→은, 가→이, 를→을, 와→과, 로→으로).
 * 따옴표 안 대사와 「올해 남은」(12월 기준 책에서 뜻이 갈림)은 그대로 둔다(검사가 본다).
 */
const YEAR_PARTICLE: Readonly<Record<string, string>> = { 는: "은", 가: "이", 를: "을", 와: "과", 로: "으로" };
export function namedYear(s: string, year: number): { text: string; count: number } {
  let count = 0;
  const text = s.replace(/올해(?! ?남은)(는|가|를|와|로)?/g, (m: string, p: string | undefined, at: number) => {
    const before = s.slice(0, at);
    const quoted = (before.match(/"/g)?.length ?? 0) % 2 === 1 || before.lastIndexOf("“") > before.lastIndexOf("”") || before.lastIndexOf("「") > before.lastIndexOf("」") || before.lastIndexOf("‘") > before.lastIndexOf("’");
    if (quoted) return m;
    count++; return `${year}년${p ? YEAR_PARTICLE[p] : ""}`;
  });
  return { text, count };
}
const DAYUN_PERIOD = /(19|20)\d\d년 (1[0-2]|[1-9]) ?월 무렵/g;
export const calendarMonth = (s: string) => CALENDAR_MONTH.test(s.replace(MONTH_NAME_PAIR, "").replace(DAYUN_PERIOD, ""));
/**
 * AM 7부(2026-11-11): 세운 본문의 맨 달 이름 「5월」은 그 책 달 표의 짝으로 바꾼다 → 「5월(을사월)」(호출 0, 표와 한 체계).
 * names: "5" → "을사월", "2028년 1" → "계축월"(달 표 라벨에서). 날짜(「5월 3일」)·「무렵부터」·이미 짝인 것·표에 없는 달은 그대로(검사가 본다).
 */
const BARE_MONTH = /(?<![0-9])(20\d\d년 )?(1[0-2]|[1-9]) ?월(?! ?\d{1,2} ?일)(?! 무렵부터)(?![0-9가-힣]*(일 기준|일부터))(?! ?(·|\(|,)? ?[갑을병정무기경신임계][자축인묘진사오미신유술해]월)/g;
export function pairMonthNames(s: string, names: Readonly<Record<string, string>>): { text: string; count: number } {
  let count = 0;
  // AM 판독(annual-1 재생성 4.1.2): 「4월에는 갑진월에…」처럼 바로 뒤에 그 달 이름이 오면 짝을 붙이지 않는다(「4월(갑진월)에는 갑진월에」 겹침).
  const text = s.replace(BARE_MONTH, (m: string, y: string | undefined, n: string, ...rest: unknown[]) => { const g = names[`${y ?? ""}${n}`]; if (!g) return m; const at = rest.find(x => typeof x === "number") as number; if (s.slice(at + m.length, at + m.length + 8).replace(/^(에는|에|은|는|의|부터)?,? ?/, "").startsWith(g)) return m; count++; return `${m}(${g})`; });
  return { text, count };
}

/** E 마무리 문형(소제목 마지막 문장의 끝 두 어절). 12달 가운데 같은 문형은 3번까지. */
export const closingFrame = (lastSentence: string) => lastSentence.replace(/[⟪⟫"'“”‘’]/g, "").trim().split(/\s+/).slice(-2).join(" ").replace(/[.!?…]+$/, "");
export const MAX_CLOSING_REPEAT = 3;

/** F 부정 단정("원국과는 아무것도 건드리지 않아요"): 엔진 관계 목록이 비어 있을 때만 허용. */
export const NEGATIVE_RELATION = /(건드리지 않|부딪치지 않|부딪히지 않|걸리지 않|엮이지 않|충돌하지 않|합도 충도 없|관계(가|는)? (없|하나도 없)|아무 관계|직접 닿지 않)/;

/** G 투자 장: 특정 종목·상품·매수 시점 금지(지식 DB 검사와 같은 정의). */
export const INVEST_DIRECTIVE = /매수|매도|종목|코인|가상 ?화폐|비트코인|레버리지|몰빵|풀매수|사 두세요|팔아 치우|지금 사|지금 팔|타이밍을 노|수익률 \d|\d+ ?% ?(수익|이자|오르)|삼성전자|테슬라|엔비디아|S&P|나스닥/;
/** G 투자 장 안내 문장(책에 1회). */
export const INVEST_NOTICE = "이 장은 투자 권유가 아니라 타고난 돈 성향을 풀이한 것이에요.";

/** C 대운 안 위치(연도 장): 엔진이 준 "대운 안 몇 번째 해"와 다른 위치 말. index 1~10. */
const POS_CLAIMS: readonly [string, RegExp, (i: number, total: number) => boolean][] = [
  ["first", /(대운|10년 흐름|10년)[^.?!]{0,12}(첫해|첫 해|첫 번째 해)|문을 여는 해|첫머리/, i => i === 1],
  ["early", /초입|막 시작|들어선 지 얼마|시작한 지 얼마|앞쪽|초반/, i => i <= 3],
  ["middle", /한가운데|중반|중간쯤|중간 지점|허리|절반(을|쯤)/, i => i >= 4 && i <= 7],
  ["late", /끝자락|마무리|막바지|끝나 가|끝 무렵|저물|후반|끝을 향/, i => i >= 8],
  ["last", /마지막 해|마지막 한 해|끝나는 해/, (i, t) => i === t],
];
export function dayunYearClaim(sentence: string, index: number, total = 10): string | null {
  if (!/대운|10년|십 년|흐름의|흐름 속|흐름에서/.test(sentence)) return null;
  for (const [name, re, ok] of POS_CLAIMS) if (re.test(sentence) && !ok(index, total)) return `${name}≠${index}/${total}`;
  const left = sentence.match(/(\d{1,2}|한|두|세|네|다섯|여섯|일곱|여덟|아홉) ?(해|년)(가|이)? (더 )?남/);
  if (left) { const n = Number(left[1]) || ({ 한: 1, 두: 2, 세: 3, 네: 4, 다섯: 5, 여섯: 6, 일곱: 7, 여덟: 8, 아홉: 9 } as Record<string, number>)[left[1]]; if (n !== total - index) return `left:${n}≠${total - index}`; }
  return null;
}
