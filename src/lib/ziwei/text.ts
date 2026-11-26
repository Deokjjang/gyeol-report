/**
 * ZW-2 2부 — 자미 DB 글을 작가에게 넘기기 전에 다듬는 결정론 함수(호출 0, DB 원본은 고치지 않는다 — 덕짱님 결정 3).
 * - 조언 꼬리 떼기: 「~세요 · ~면 좋아요 · ~가 순서예요」와 「~하면 …가 가벼워져요」 꼴(행동을 권하는 결과 문장). 앞 마디가 규칙 활용 「-(으)니(까),」이면
 *   그 마디만 「-습니다 / -ㅂ니다」로 살리고, 아니면 그 문장을 뺀다(뜻이 남지 않으면 문장을 뺀다). 처방은 처방 사전 배분에서만 나온다.
 * - 카드 정제: 규칙 · 면책 · 읽는 법 · 판정 안 된 명반 조건(「화기가 붙으면」 「빈 칸이면」) · 내부 말 · 건강 단정 말 · 극단 운명 말 · 등급 낱말 문장을 뺀다.
 * - 지시어를 이름으로(「이 칸」 → 「짝 칸」, 「이 별」 → 「거문」).
 */
import { BRANCH_KO, MUTAGEN_NAMES, PALACE_NAMES, STAR_NAMES, type MutagenId, type PalaceId, type StarId } from "./ids";

export const splitSents = (t: string) => t.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(Boolean);
const hangul = (t: string) => t.replace(/[^가-힣]/g, "").length;

// ---------- 조언 꼬리 ----------
export const ADVICE_END = /(?:세요|주세요|두세요|마세요|보세요|하세요|좋아요|좋습니다|순서예요|순서입니다|필요해요|필요합니다|편이 (?:낫|좋|맞)[가-힣]*|게 (?:낫|나)[가-힣]*)[.!]?$/;
/** 행동을 권하는 결과 문장(「…해 두면 정이 지켜져요」 「…알면 한결 가벼워져요」). */
export const ADVICE_RESULT = /(?:면|때|뒤에|다음에|나면|두면|해야|하면) [^.!?]{0,48}(?:열려요|움직여요|가까워져요|쉬워져요|가벼워져요|편해져요|덜해요|줄어요|남아요|풀려요|지켜져요|생겨요|돌아와요|닿아요|들려요|살아나요|깊어져요|단단해져요|빨라져요|덜어져요|좋아져요|나아져요|지켜집니다|열립니다|줄어듭니다|가벼워집니다|풀립니다|가까워집니다|쉬워집니다|남습니다)[.!]?$/;
/** 「~해 두면 힘을 아낍니다」 「~나눠 두면 편합니다」 — 미리 해 두기를 권하는 꼴. */
export const ADVICE_PREP = /[가-힣]+ 두면 [^.!?]{0,60}(?:아낍니다|아껴요|덜합니다|덜해요|편합니다|편해요|낫습니다|나아요|좋습니다|좋아요|쉽습니다|쉬워요|쉬워집니다|든든합니다|든든해요|놓여요|놓입니다|커집니다|커져요|오래 가요|오래 갑니다|반가워요|돼요|됩니다|바뀌어요|바뀝니다|지켜요|지킵니다|버팁니다|얻습니다|섭니다|읽힙니다|짚을 수 있어요|마칠 수 있어요)[.!]?$|면 (?:돼요|됩니다)[.!]?$|(?<!나)면 [^.!?]{0,40}(?:훨씬|한결)[^.!?]{0,24}[.!]?$/;
/** 대사(「…」 · '…' · "…") 안은 보지 않고, 술어(…다 · …요)로 끝나는 문장만 조언으로 본다(그림 별명 · 명사 끝 장면은 아니다). */
const unquote = (s: string) => s.trim().replace(/「[^」]*」|'[^']*'|"[^"]*"|“[^”]*”/g, "「」");
export const isAdvice = (s0: string) => { const s = unquote(s0); if (!/(?:다|요)[.!]?$/.test(s)) return false; return ADVICE_END.test(s) || ADVICE_RESULT.test(s) || ADVICE_PREP.test(s); };
/** ㅂ 불규칙 형용사(「쉬우니」 → 「쉽습니다」). */
const B_IRREG: Readonly<Record<string, string>> = { 쉬우: "쉽", 어려우: "어렵", 가까우: "가깝", 무거우: "무겁", 가벼우: "가볍", 반가우: "반갑", 고마우: "고맙", 즐거우: "즐겁", 아까우: "아깝", 부러우: "부럽", 두려우: "두렵", 새로우: "새롭", 날카로우: "날카롭", 외로우: "외롭", 괴로우: "괴롭", 귀여우: "귀엽", 차가우: "차갑", 뜨거우: "뜨겁", 더우: "덥", 추우: "춥", 매우: "맵", 지루하: "지루하" };
/** 받침 없는 끝 음절 가운데 용언 어간으로 흔한 것(체언 + 「-니」(이니 준말)를 잘못 살리지 않게 좁힌다). */
const VERB_FINAL = new Set([..."리이기지하되치키르드가오나보서려져우꾸추누두주루투내끼티피히시"]);
/** 받침 없이 끝나는 흔한 체언(「자리니」 = 자리 + (이)니 — 용언으로 살리면 틀린다). */
const NOUN_END = /(?:자리|소리|거리|머리|우리|다리|사이|아이|나이|차이|이야기|얘기|아기|가지|처지|하나|자기|부부|친구|기회|문제|신호|때문)$/;
const addB = (syl: string) => { const c = syl.charCodeAt(0) - 0xac00; return c >= 0 && c <= 11171 && c % 28 === 0 ? String.fromCharCode(syl.charCodeAt(0) + 17) : null; };
/** 「…(으)니(까)」로 끝나는 앞 마디를 평서문으로. 안전하지 않으면 null. */
export function closeClause(front: string): string | null {
  const m = /^(.*?)(으니까|으니|니까|니)$/.exec(front.trim());
  if (!m) return null;
  const head = m[1], tail = m[2];
  if (/(?:들|걸|물|나|지|부|이|그|달|실|불)$/.test(head) && tail.startsWith("으")) return null; // ㄷ · ㅅ 불규칙 등
  if (/(?:말|않|못)$/.test(head) || /지 마$/.test(head)) return null;
  if (tail.startsWith("으")) {
    const last = head.slice(-1), c = last.charCodeAt(0) - 0xac00;
    if (c < 0 || c > 11171 || c % 28 === 0) return null;
    return `${head}습니다.`;
  }
  for (const [irr, stem] of Object.entries(B_IRREG)) if (head.endsWith(irr)) return `${head.slice(0, -irr.length)}${stem}${stem.endsWith("하") ? "ㅂ" : "습"}니다.`.replace("하ㅂ니다", "합니다");
  const last = head.slice(-1);
  if (!VERB_FINAL.has(last) || last === "우" || NOUN_END.test(head)) return null;
  const b = addB(last);
  return b ? `${head.slice(0, -1)}${b}니다.` : null;
}
/** 조언 꼬리 떼기(문장 하나): 그대로 · 앞 마디만 살림 · 뺌(null). */
export function stripAdviceSentence(s: string): string | null {
  if (!isAdvice(s)) return s;
  const commas = [...s.matchAll(/, /g)].map(x => x.index!);
  for (let i = commas.length - 1; i >= 0; i--) {
    const front = s.slice(0, commas[i]);
    if (isAdvice(`${front}.`)) continue;
    const closed = closeClause(front);
    if (closed && hangul(closed) >= 10) return closed;
  }
  return null;
}
export function stripAdvice(text: string): string { return splitSents(text).map(stripAdviceSentence).filter((x): x is string => Boolean(x)).join(" "); }

// ---------- 카드 정제 ----------
/** 규칙 · 정의 · 읽는 법(이 사람에게 해당하는지 판정하지 않은 일반 문장). */
const RULE = /(?:으로|로) 읽습니다|읽는 자리|읽는 칸|를 봅니다|을 봅니다|라고 부릅니다|(?:이라|라) 부릅니다|자리로,|빌려 읽|맞은편 칸을|맞은편을|열두 칸 중|가리킵니다|뜻합니다|나타냅니다|표시입니다|알려 줍니다|붙는 이름/;
const DISCLAIMER = /사람마다 다르|몇 살부터|단정할 수 없|단정하지 않|뜻이 아닙니다|뜻은 아니|말이 아닙니다|사람마다 다릅|경향일 뿐|참고로만|정해진 것이 아니|운명이 아니|예언하지 않|좋고 나쁨이 아니|나쁜 뜻이 아니|흉한 뜻이 아니/;
/** 명반 조건(판정 안 함): 별 · 사화 · 칸 · 밝기 말이 든 조건 마디. */
const CHART_WORD = new RegExp(`(?:${[...Object.values(STAR_NAMES).map(s => s.ko), ...Object.values(MUTAGEN_NAMES).map(m => m.ko), "사화", "빈 칸", "공궁", "맞은편", "밝은", "어두운", "밝게", "어둡게", "칸에", "궁에"].join("|")})`);
const COND = /(?:있으면|붙으면|만나면|들면|놓이면|앉으면|함께라면|이라면|라면|비어 있으면|밝으면|어두우면|겹치면|들어오면|있을 때|붙을 때|만날 때|들 때|앉을 때)/;
const condOnChart = (s: string) => { const m = COND.exec(s); return Boolean(m && CHART_WORD.test(s.slice(0, m.index + m[0].length))); };
/** 내부 말(출처 · 기준 · 학파 · 라이브러리) — 고객 글에 나오면 안 된다. */
export const ZW_MEMO = /통용|全書|전서|추정|학파|유파|중주파|북파|삼합파|비성|계산 기준|라이브러리|iztro|DB|엔진|카드|설계도|근거 id|zw:|engineKey/i;
/** 건강 단정 · 병 이름(질액궁은 「컨디션 리듬」 말만). */
export const ZW_HEALTH = /(?<![가-힣])병(?:이|을|에|원)|질환|질병|증상|통증|아프|아파|소화|위장|심장|혈압|두통|피부|허리|어깨|관절|호흡기|면역|수술|진료|검진|몸살|감기|염증|탈이 나|탈이 납|약을 먹|약이 |건강이 (?:나빠|약해|상)|건강을 해/;
/** 극단 운명 말(fate_word — 0부 덕짱님 수정 2: 지시 · 카드에도 0). */
export const FATE_WORD = /극처|극부|이혼|단명|요절|사별|과부|홀아비|파혼|재혼|형극|횡사|객사|흉사|상부살|상처살|고독살|팔자가 사납|박복/;
/** 등급 낱말(밝기 단 · 길흉 단) — 카드 · 지시 · 본문 모두 0. 「살성」 갈래 이름도(0부 덕짱님 수정 3). */
export const GRADE_WORD = /밝기|밝은 자리|어두운 자리|묘왕|입묘|낙함|(?<![가-힣])(?:묘|왕|득|리|평|불|함)지(?:에|의|라)|길성|흉성|대길|대흉|(?<![가-힣])(?:길|흉)(?:하|한|함|해)|살성|흉한 별|나쁜 별|좋은 별/;

export type CleanCtx = { readonly palace?: PalaceId; readonly star?: StarId; readonly mutagen?: MutagenId; readonly branch?: string };
/** 지시어 → 이름(「이 칸」 → 「짝 칸」, 「이 별」 → 「거문 별」, 「이 표시」 → 「화기 표시」 — 뒤 낱말을 남겨 조사가 그대로 맞는다). 「그 자리」는 DB에서 「그 상황」 뜻이라 두지 않는다. */
export function undeictic(t: string, c: CleanCtx): string {
  const place = c.palace ? PALACE_NAMES[c.palace].easy : null, star = c.star ? STAR_NAMES[c.star].ko : null, mut = c.mutagen ? MUTAGEN_NAMES[c.mutagen].ko : null;
  return t.replace(/(?<![가-힣])(?:이|그) (칸|별|표시)(?=[은는이가을를의에도만과와로으]|\s|$)/g, (m0, w: string) => { const n = w === "별" ? star : w === "표시" ? mut : place; return n ? `${n} ${w}` : m0; });
}
/** 앞 문장을 받는 첫머리(앞 문장을 뺐으면 이 문장도 뺀다). */
const LEANS_BACK = /^(?:그렇게|그런|그래서|그러니|그러면|그러다|이렇게|이런|그때|그 (?:뒤|다음|대신|덕분|만큼)|그 [가-힣]+(?:은|는|이|가|을|를|도))/;
/** 시점이 아닌 「지금」도 9장 밖에서는 쓰지 않는다: 「지금 할 일」 → 「눈앞의 일」, 「지금의 · 지금(은 · 도) 」는 뗀다. */
export const untimeZw = (t: string) => t.replace(/(?<![가-힣])지금 (?:할|해야 할) 일/g, "눈앞의 일").replace(/(?<![가-힣])지금의 /g, "").replace(/(?<![가-힣])지금(?:은|도)? (?=[가-힣])/g, "");
export type CleanLog = { tails: number; salvaged: number; dropped: { why: string; text: string }[] };
export const newCleanLog = (): CleanLog => ({ tails: 0, salvaged: 0, dropped: [] });
/** 작가에게 갈 DB 글 하나를 다듬는다(문장 단위). 남는 문장이 없으면 빈 글. */
export function cleanZiwei(text: string, c: CleanCtx, log?: CleanLog, max = 3): string {
  const out: string[] = [];
  let prevKept = true;
  for (const s0 of splitSents(text)) {
    if (!prevKept && LEANS_BACK.test(s0)) { log?.dropped.push({ why: "orphan", text: s0 }); continue; }
    prevKept = false;
    const why = RULE.test(s0) ? "rule" : DISCLAIMER.test(s0) ? "disclaimer" : condOnChart(s0) ? "cond" : ZW_MEMO.test(s0) ? "memo" : ZW_HEALTH.test(s0) ? "health" : FATE_WORD.test(s0) ? "fate" : GRADE_WORD.test(s0) ? "grade" : null;
    if (why) { log?.dropped.push({ why, text: s0 }); continue; }
    const s1 = stripAdviceSentence(s0);
    if (s1 !== s0) { if (log) { log.tails++; if (s1) log.salvaged++; else log.dropped.push({ why: "advice", text: s0 }); } }
    if (!s1) continue;
    // 시점 말: 「요즘 · 최근 · 올해 · 이번 달 · 당장」 문장은 빼고, 부사 「지금(은 · 도)」은 뗀다(자미 책은 9장 「지금 머무는 10년」만 지금을 말한다).
    if (/(?<![가-힣])(?:요즘|최근|올해|요새|이번 ?(?:달|주|해)|당장|오늘|내일)/.test(s1)) { log?.dropped.push({ why: "time", text: s1 }); continue; }
    const s2 = untimeZw(undeictic(s1, c));
    if (hangul(s2) < 8) continue;
    if (!out.length && LEANS_BACK.test(s2)) { log?.dropped.push({ why: "orphan", text: s2 }); continue; }
    out.push(s2); prevKept = true;
    if (out.length >= max) break;
  }
  return out.join(" ");
}
/** 칸 이름(쉬운 이름 · 한글 이름 · 신궁)은 고정 이름표라 입력 전제 말이 아니다 — 입력 거름 · 전제 검사 전에 가리고 뒤에 되돌린다. */
const PALACE_LABELS = [...new Set([...Object.values(PALACE_NAMES).flatMap(n => [n.easy, n.ko]), "갈수록 드러나는 나", "신궁"])].sort((a, b) => b.length - a.length);
export function maskPalaceNames(t: string): { text: string; unmask: (x: string) => string } {
  const used: string[] = [];
  const text = PALACE_LABELS.reduce((acc, name) => acc.split(name).join(`\uE100${String.fromCharCode(0xe200 + (used.push(name) - 1))}`), t);
  return { text, unmask: (x: string) => x.replace(/\uE100([\uE200-\uE2FF])/g, (_m, c: string) => used[c.charCodeAt(0) - 0xe200] ?? "") };
}
/** 이 사람의 명궁 지지 칸 이름(「인(寅) 칸」). */
export const branchCell = (b: keyof typeof BRANCH_KO) => `${BRANCH_KO[b]}(${b}) 칸`;
