/**
 * ZW-2 5부 — 자미 책 원고 검사(생성 중 · 결정론 · 호출 0). 깃발마다 갈래(관문 ① 오류): fact(엔진 값 틀림) · input(입력 상태) · memo(작성 메모 · 내부 말) ·
 * broken(읽을 수 없는 문장) · future(확정 예언) · health(건강 단정). 갈래가 있는 깃발이 차단 — 걸린 문단을 한 번 교체하고, 그래도 남으면 그 문장을 지운다.
 * 갈래 없는 깃발(style)은 기록만.
 *
 * 자미 엔진 주장(종류 → 장치):
 *  star_palace      별이 어느 칸에 있나(「짝 칸의 거문」 「짝 칸에는 거문이 앉아」 「거문이 짝 칸에 있어」) · 같은 칸 별(「천기와 천량이 한 칸에」). 빈 칸은 빌린 별도 맞다.
 *  brightness_claim 별의 밝고 어두움(「환하게 빛나는 천량」 「빛이 약한 천기」): 근거가 「통용」이 아닌 칸의 별이면, 또는 통용이어도 단과 반대 방향이면.
 *  transform_claim  사화(화록 · 화권 · 화과 · 화기)가 붙은 별 · 칸(「거문에 붙은 화권」 「짝 칸의 화권」 「화기가 붙은 내가 기르는 것 칸」).
 *  empty_claim      빈 칸(「짝 칸은 빈 칸」) · 빌려 읽는 맞은편(「짝 칸은 맞은편 일 칸의 별을 빌려」) · 맞은편 칸(「짝 칸의 맞은편 일 칸」).
 *  chart_claim      명궁 지지 칸(「명궁은 축(丑) 칸」) · 신궁이 겹친 칸 · 오행국 이름 · 국수 · 오행국에 성격 · 비유 뜻(오행국 문단 안, 7부 1판).
 *  love_claim       연애 별 자리를 한 칸으로 단정(「마음이 끌리는 쪽은 X 칸에 있습니다」 — 연애 별이 여러 칸이면, 7부 1판).
 *  (empty_claim에 더함) 빈 칸 · 빌려 읽기를 이웃 · 옆 칸으로(7부 1판). health_claim에 몸의 열 말(text.ts ZW_HEAT, 카드에서도 뺌). memo_leak에 9장 기조 말(연도 범위 · 날짜와 사건).
 *  decade_claim     10년 연도 범위(「2026~2035년」) · 지금 · 다음 10년의 칸 · 나이 말(「34세」 「서른 살」 「30대」 — 자미 책은 연도 범위로만).
 *  mbti_outside     짝이 없는 소제목의 MBTI 유형 이름 · MBTI 없는 책의 유형 이름.
 * 재사용: status_claim(연애 상태 말, claims.ts 꼴) · input_premise(premise 낱말표, 칸 이름은 가림) · memo_leak(broken.ts MEMO_LEAK + 자미 지시 말) ·
 *  broken(깨진 글자 · 끊긴 절 · 겹친 구절) · future_event(확정 예언) · health_claim(sentences.ts 꼴 + 병 이름) · lib_name(「iztro」) · school_talk(학파 · 계산 기준) ·
 *  fate_word(극단 운명 말) · grade_word(등급 낱말 · 「살성」).
 */
import type { FinalChapter } from "../safety";
import { HEALTH_BODY, HEALTH_CLAIM } from "../safety/sentences";
import { premiseHits } from "@/lib/brief/premise";
import type { ZiweiBrief } from "@/lib/ziwei/brief";
import type { ZiweiDesign } from "@/lib/ziwei/design";
import { BRANCH_KO, FIVE_CLASS_INFO, MUTAGEN_NAMES, PALACE_NAMES, PALACES, STAR_NAMES, type Branch, type MutagenId, type PalaceId, type StarId } from "@/lib/ziwei/ids";
import { FATE_WORD, GRADE_WORD, maskPalaceNames, ZW_HEAT } from "@/lib/ziwei/text";
import type { ZiweiChart } from "@/lib/ziwei/types";
import { dupPhrase, MEMO_LEAK } from "./broken";
import type { Intake } from "./intake";

export type ZBranch = "fact" | "input" | "memo" | "broken" | "future" | "health";
export type ZFlag = { readonly chapter: number; readonly section: number; readonly paragraph: number; readonly rule: string; readonly sentence: string; readonly detail: string; readonly branch: ZBranch | null };
export type ZCheckCtx = { readonly brief: ZiweiBrief; readonly design: ZiweiDesign; readonly intake: Intake };
/** 문장 나누기. 핵심 문장 기호 ⟫가 마침표 뒤에 붙어도 나눈다(7부 재현: 기호 때문에 두 문장이 한 덩어리가 되어 지우기가 옆 문장까지 지웠다). */
export const splitZ = (t: string) => t.split(/(?<=[.!?]⟫?)\s+/).map(s => s.trim()).filter(Boolean);
export const ZIWEI_RULE_BRANCH: Readonly<Record<string, ZBranch | null>> = {
  star_palace: "fact", brightness_claim: "fact", transform_claim: "fact", empty_claim: "fact", chart_claim: "fact", decade_claim: "fact", mbti_outside: "fact", love_claim: "fact",
  status_claim: "input", input_premise: "input", memo_leak: "memo", lib_name: "memo", school_talk: "memo", grade_word: "memo",
  bad_char: "broken", cut_clause: "broken", dup_phrase: "broken", chapter_missing: "broken", section_empty: "broken",
  future_event: "future", fate_word: "future", health_claim: "health", section_count: null,
};

// ---------- 낱말표 ----------
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const PJ = "(?=[은는이가을를의과와도만에입으로]|\\(|\\s|,|·|\\.|$)";
/** 별: 한글 이름(「천부적」 「천상의 」처럼 별이 아닌 낱말은 뺀다) · 「…별」로 끝나는 쉬운 이름. */
const STAR_ALTS: readonly (readonly [string, StarId])[] = [
  ...(Object.entries(STAR_NAMES) as [StarId, (typeof STAR_NAMES)[StarId]][]).map(([id, n]) => [n.ko, id] as const),
  ...(Object.entries(STAR_NAMES) as [StarId, (typeof STAR_NAMES)[StarId]][]).filter(([, n]) => n.easy.endsWith("별")).map(([id, n]) => [n.easy, id] as const),
].sort((a, b) => b[0].length - a[0].length);
const STAR_RE = new RegExp(`(?<![가-힣])(${STAR_ALTS.map(a => esc(a[0])).join("|")})(?!적)(?!의 (?:세계|목소리|선율))${PJ}`, "g");
const starOf = (w: string) => STAR_ALTS.find(a => a[0] === w)?.[1];
/** 칸: 「쉬운 이름 + 칸」 · 한자 이름(명궁 · 부처궁 …). */
const PALACE_ALTS: readonly (readonly [string, PalaceId])[] = [
  ...PALACES.map(p => [`${PALACE_NAMES[p].easy} 칸`, p] as const), ...PALACES.map(p => [PALACE_NAMES[p].ko, p] as const),
].sort((a, b) => b[0].length - a[0].length);
const PALACE_RE = new RegExp(`(?<![가-힣])(${PALACE_ALTS.map(a => esc(a[0])).join("|")})${PJ}`, "g");
const palaceOf = (w: string) => PALACE_ALTS.find(a => a[0] === w)?.[1];
const MUT_RE = /(?<![가-힣])(화록|화권|화과|화기)(?!애애|자)/g;
const MUT_ID: Readonly<Record<string, MutagenId>> = { 화록: "rok", 화권: "gwon", 화과: "gwa", 화기: "gi" };
const BRANCH_OF_KO = new Map((Object.entries(BRANCH_KO) as [Branch, string][]).map(([b, k]) => [k, b] as const));
type Hit = { readonly at: number; readonly end: number; readonly id: string };
const hits = (s: string, re: RegExp, of: (w: string) => string | undefined): Hit[] => [...s.matchAll(new RegExp(re.source, "g"))].flatMap(m => { const id = of(m[1]); return id ? [{ at: m.index!, end: m.index! + m[1].length, id }] : []; });

// ---------- 명반 사실 ----------
function factsOf(chart: ZiweiChart) {
  const pal = new Map(chart.palaces.map(p => [p.id, p] as const));
  const starsIn = (p: PalaceId): Set<StarId> => { const x = pal.get(p)!; const own = [...x.majors, ...x.helpers, ...x.malefics, ...x.loves] as StarId[];
    return new Set(x.empty && x.borrowFrom ? [...own, ...pal.get(x.borrowFrom)!.majors] : own); };
  const palaceOfStar = new Map(chart.stars.map(s => [s.id, s.palace] as const));
  const mut = new Map(chart.mutagens.map(m => [m.mutagen, m] as const));
  const opposite = (p: PalaceId) => PALACES[(PALACES.indexOf(p) + 6) % 12];
  return { pal, starsIn, palaceOfStar, mut, opposite };
}

const BRIGHT_UP = /환하게 빛|밝게 빛|빛이 (?:밝|환|또렷|강)|밝은 별|환한 별|가장 밝/;
const BRIGHT_DOWN = /빛이 (?:약|흐|옅|어두|꺾|가려)|어두운 별|빛을 잃|은은하게 빛|빛이 덜/;
const AGE = /(?<![\d가-힣])\d{1,2}\s?(?:세|살)(?![가-힣])|(?<![가-힣])(?:스무|서른|마흔|쉰|예순|일흔)\s?살|(?<![\d가-힣])[1-9]0대(?![가-힣])/;
/** 오탐 대보기(5부 ③ 저장 책): 「자유파」(子酉破)의 「유파」 · 「프로그램」 · 돈 나누는 「계산 방식」(보통 낱말)은 뺐다 — 계산 말은 명반 · 별 맥락만. */
const SCHOOL = /학파|(?<![가-힣])유파|중주파|북파|삼합파|비성 사화|(?:명반|자미|별자리|사화|별)[^.?!]{0,12}(?:계산 기준|계산 방식|계산법)|라이브러리|(?<![가-힣])전서(?![가-힣])|全書|통용 표|명반을 (?:계산|뽑)/;
/** 오탐 대보기(5부 ① DB 그림 · ③ 저장 책): 「설계도」(그림 낱말) · 「쓰는 장면」은 뺐다 — 카드 칸 이름 꼴만. */
const ZW_MEMO_EXTRA = /(?<![A-Za-z])[ZBP]\d{1,2}(?![0-9A-Za-z])|근거 카드|책 설계도|묶음 지시|소제목 틀|이 사람 재료|(?<![가-힣])기조(?:에|를|대로)|쓰는 장:|새 각도|집 장(?![가-힣])|연도 범위|날짜와 사건|일어날 일을 정하지/;
/** ZW-2 7부 Z5 판독 ①(1판): 연애 별을 한 칸으로 단정 · 빌려 읽기를 맞은편이 아닌 칸으로 · 오행국에 성격 뜻. */
const LOVE_ONE = new RegExp(`(?:(?:마음이 )?(?:끌리는|가는|설레는) 쪽|연애 별(?:들)?)(?:은|이)\\s*(?:[^\\s.,·]+\\s){0,1}?(${PALACE_ALTS.map(a => esc(a[0])).join("|")})(?:에|에만|에는)\\s*(?:다\\s*|모두\\s*|모여\\s*|몰려\\s*)?(?:있|모여|몰려|앉아)`);
const BORROW_WORD = /빈 칸|비어 있|비어서|빌려|큰 별이 없|주성이 없/;
const NEIGHBOR = /(?<![가-힣])(?:이웃한|이웃 칸|이웃의 칸|이웃 무대|이웃한 무대|옆 칸|옆의 칸|옆 무대|양옆|주변 칸|주위 칸)/;
const FIVE_NAME = /수이국|목삼국|금사국|토오국|화육국|오행국/;
const FIVE_TRAIT = /성격|기질|성품|타고난 결/;
const FIVE_SIMILE = /(?<![가-힣])(?:쇠|물|나무|흙|불)(?:처럼|같이|같은)/;
const STATUS_SAY = /(?<![가-힣])(연애 중인|솔로인|기혼인|결혼한|썸 타는|썸 중인) 당신(?!이라면|이라도)/;
const STATUS_OF: Readonly<Record<string, string>> = { "연애 중인": "dating", 솔로인: "single", 기혼인: "married", 결혼한: "married", "썸 타는": "some", "썸 중인": "some" };
const EVENT = /(결혼|이별|이혼|헤어지|재회|합격|승진|이직|취업|창업|임신|출산|사고|이사|큰돈|복권|부자가|성공)[^.?!]{0,24}(?:하게 됩니다|하게 될 것|할 것입니다|하게 돼요|찾아옵니다|찾아와요|일어납니다|일어나요|생깁니다|생겨요|들어옵니다|들어와요|이뤄집니다|이루어집니다|됩니다)[.!]?$/;
const WHEN = /\d{4}년|\d+\s?년 (?:안|뒤|후)|10년 안에|이 10년 안|머지않아|곧(?! 바로)|반드시|틀림없이/;
const DISEASE = /질환|질병|당뇨|고혈압|우울증|불면증|위염|장염|디스크|관절염|암에|암이|암을|종양|수술을/;

export function ziweiSentenceFlags(sen: string, c: { readonly chart: ZiweiChart; readonly mbti: string | null; readonly relationship: string; readonly inputs?: ZiweiBrief["inputs"]; readonly pairHere: boolean }): { rule: string; detail: string }[] {
  const out: { rule: string; detail: string }[] = [];
  const f = factsOf(c.chart);
  const plain = sen.replace(/「[^」]*」|"[^"]*"|“[^”]*”/g, m => " ".repeat(m.length));
  const stars = hits(plain, STAR_RE, starOf), pals = hits(plain, PALACE_RE, palaceOf);
  // ---- star_palace ----
  for (const s of stars) {
    for (const p of pals) {
      const before = p.end <= s.at ? plain.slice(p.end, s.at) : null, after = s.end <= p.at ? plain.slice(s.end, p.at) : null;
      const rel = (before !== null && /^(?:에는|에도|에서는|에|의|엔)\s+(?:[^\s.,·]+\s){0,2}$/.test(before) && !/맞은편|빌려|옆|건너/.test(before))
        || (after !== null && /^(?:\([^)]*\))?(?:이|가|은|는|도)\s+(?:[^\s.,·]+\s){0,2}$/.test(after) && /^(?:에|에는|에도)\s*(?:앉|있|자리|들어|놓|머물|함께|나란히)/.test(plain.slice(p.end)));
      if (rel && !f.starsIn(p.id as PalaceId).has(s.id as StarId)) out.push({ rule: "star_palace", detail: `${STAR_NAMES[s.id as StarId].ko}은 ${PALACE_NAMES[p.id as PalaceId].easy} 칸에 없다(엔진: ${PALACE_NAMES[f.palaceOfStar.get(s.id as StarId)!].easy} 칸)` });
    }
  }
  for (const m of plain.matchAll(new RegExp(`(${STAR_ALTS.map(a => esc(a[0])).join("|")})(?:\\([^)]*\\))?(?:과|와) (${STAR_ALTS.map(a => esc(a[0])).join("|")})(?:\\([^)]*\\))?(?:이|가|은|는|도)? ?(?:한 칸|같은 칸|한 자리|함께 앉|나란히 앉)`, "g"))) {
    const a = starOf(m[1]) as StarId, b = starOf(m[2]) as StarId;
    const together = [...f.pal.values()].some(p => { const set = f.starsIn(p.id); return set.has(a) && set.has(b); });
    if (!together) out.push({ rule: "star_palace", detail: `${STAR_NAMES[a].ko} · ${STAR_NAMES[b].ko}은 같은 칸이 아니다` });
  }
  // ---- brightness_claim ----
  for (const s of stars) {
    const win = plain.slice(Math.max(0, s.at - 12), s.end + 16);
    const up = BRIGHT_UP.test(win), down = BRIGHT_DOWN.test(win);
    if (!up && !down) continue;
    const pl = c.chart.stars.find(x => x.id === s.id);
    if (!pl?.brightness || pl.brightnessBasis !== "통용") out.push({ rule: "brightness_claim", detail: `${STAR_NAMES[s.id as StarId].ko}의 밝기는 근거가 약한 칸이다` });
    else if ((up && pl.brightness.level === "dark") || (down && pl.brightness.level === "bright")) out.push({ rule: "brightness_claim", detail: `${STAR_NAMES[s.id as StarId].ko} 밝기 방향이 엔진(${pl.brightness.level})과 반대` });
  }
  // ---- transform_claim ----
  const muts = hits(plain, MUT_RE, w => MUT_ID[w]);
  for (const m of muts) {
    const real = f.mut.get(m.id as MutagenId)!;
    for (const s of stars) {
      const near = s.end <= m.at ? plain.slice(s.end, m.at) : plain.slice(m.end, s.at);
      const rel = s.end <= m.at ? /^(?:\([^)]*\))?(?:에|에는|에게)?\s*(?:붙은|달린|얹힌|더해진)?\s*$/.test(near) : /^(?:\([^)]*\))?(?:이|가)\s+(?:붙은|달린|얹힌|앉은)\s+$/.test(near);
      if (rel && real.star !== s.id) out.push({ rule: "transform_claim", detail: `${MUTAGEN_NAMES[m.id as MutagenId].ko}은 ${STAR_NAMES[real.star].ko}에 붙었다` });
    }
    for (const p of pals) {
      const rel = (p.end <= m.at && /^(?:에|에는|의)\s+(?:[^\s.,·]+\s){0,3}$/.test(plain.slice(p.end, m.at)) && !/맞은편|빌려/.test(plain.slice(p.end, m.at)))
        || (m.end <= p.at && /^(?:\([^)]*\))?(?:이|가)\s+(?:붙은|달린|든|있는|앉은)\s+(?:[^\s.,·]+\s){0,2}$/.test(plain.slice(m.end, p.at)));
      if (rel && real.palace !== p.id) out.push({ rule: "transform_claim", detail: `${MUTAGEN_NAMES[m.id as MutagenId].ko}은 ${PALACE_NAMES[real.palace].easy} 칸에 있다` });
    }
  }
  // ---- empty_claim ----
  for (const p of pals) {
    const x = f.pal.get(p.id as PalaceId)!, tail = plain.slice(p.end, p.end + 26), head = plain.slice(Math.max(0, p.at - 14), p.at);
    if ((/^(?:은|는|이|가|도)?\s*(?:[^\s.,·]+\s){0,2}?(?:빈 칸|큰 별이 없|주성이 없|비어 있)/.test(tail) || /(?:빈 칸인|비어 있는|큰 별이 없는|주성이 없는)\s*$/.test(head)) && !x.empty) out.push({ rule: "empty_claim", detail: `${PALACE_NAMES[x.id].easy} 칸은 빈 칸이 아니다` });
    // 그 칸이 주어(은 · 는)일 때만, 「 · 」로 넘어가지 않는 한 마디 안에서(5부 ① 카드 줄 오탐).
    const bm = new RegExp(`^(?:은|는)\\s*(?:[^\\s.·]+\\s){0,2}?맞은편\\s*(${PALACE_ALTS.map(a => esc(a[0])).join("|")})(?:의|에|에서)?\\s*(?:[^\\s.·]+\\s){0,3}?빌려`).exec(plain.slice(p.end));
    if (bm) { const q = palaceOf(bm[1])!; if (!x.empty || x.borrowFrom !== q) out.push({ rule: "empty_claim", detail: `${PALACE_NAMES[x.id].easy} 칸은 ${x.empty ? `${PALACE_NAMES[x.borrowFrom!].easy} 칸` : "빌려 읽지 않는 칸"}` }); }
    const om = new RegExp(`^의 맞은편(?:은|인|에 있는|에는)?\\s*(${PALACE_ALTS.map(a => esc(a[0])).join("|")})`).exec(plain.slice(p.end));
    if (om && f.opposite(x.id) !== palaceOf(om[1])) out.push({ rule: "empty_claim", detail: `${PALACE_NAMES[x.id].easy} 칸의 맞은편은 ${PALACE_NAMES[f.opposite(x.id)].easy} 칸` });
  }
  // 빈 칸 · 빌려 읽기를 이웃 · 옆 칸으로(빌리는 칸은 맞은편 한 칸뿐). 빈 칸 말이 없는 「이웃」은 보통 낱말이라 통과.
  if (BORROW_WORD.test(plain) && NEIGHBOR.test(plain)) out.push({ rule: "empty_claim", detail: "빈 칸은 맞은편 한 칸의 별만 빌려 읽는다(이웃 · 옆 칸 아님)" });
  // ---- love_claim: 연애 별 자리를 한 칸으로 ----
  const lv = LOVE_ONE.exec(plain);
  if (lv) {
    const at = new Set(c.chart.palaces.filter(p => p.loves.length).map(p => p.id)), named = palaceOf(lv[1]);
    if (at.size !== 1 || !named || !at.has(named)) out.push({ rule: "love_claim", detail: `연애 별은 ${[...at].map(p => PALACE_NAMES[p].easy).join(" · ") || "없음"} 칸에 있다` });
  }
  // ---- chart_claim ----
  const life = /명궁(?:은|이|이 놓인|이 앉은)?\s*([자축인묘진사오미신유술해])(?:\([^)]*\))?\s*(?:칸|자리|궁)/.exec(plain);
  if (life && BRANCH_OF_KO.get(life[1]) !== c.chart.lifePalace.branch) out.push({ rule: "chart_claim", detail: `명궁은 ${BRANCH_KO[c.chart.lifePalace.branch]} 칸` });
  const body = new RegExp(`신궁(?:은|이)?\\s*(?:[^\\s.,·]+\\s){0,2}?(${PALACE_ALTS.map(a => esc(a[0])).join("|")})(?:에|과|와)?\\s*(?:겹|포개|놓)`).exec(plain);
  if (body && palaceOf(body[1]) !== c.chart.bodyPalace.palace) out.push({ rule: "chart_claim", detail: `신궁은 ${PALACE_NAMES[c.chart.bodyPalace.palace].easy} 칸에 겹친다` });
  for (const m of plain.matchAll(/(수이국|목삼국|금사국|토오국|화육국)/g)) if (m[1] !== FIVE_CLASS_INFO[c.chart.fiveClass.id].ko) out.push({ rule: "chart_claim", detail: `오행국은 ${FIVE_CLASS_INFO[c.chart.fiveClass.id].ko}` });
  const num = /국수(?:는|가)?\s*(\d)/.exec(plain); if (num && Number(num[1]) !== c.chart.fiveClass.number) out.push({ rule: "chart_claim", detail: `국수는 ${c.chart.fiveClass.number}` });
  if (FIVE_NAME.test(plain) && (FIVE_TRAIT.test(plain) || FIVE_SIMILE.test(plain))) out.push({ rule: "chart_claim", detail: "오행국에 카드에 없는 뜻(오행국은 첫 10년이 열리는 때만)" });
  // ---- decade_claim ----
  for (const m of plain.matchAll(/(\d{4})\s*[~–-]\s*(\d{4})\s*년|(\d{4})년부터 (\d{4})년까지/g)) {
    const a = Number(m[1] ?? m[3]), b = Number(m[2] ?? m[4]);
    if (!c.chart.decadals.some(d => d.startYear === a && d.endYear === b)) out.push({ rule: "decade_claim", detail: `${a}~${b}년은 10년 칸 범위가 아니다` });
  }
  const cur = c.chart.now.current !== undefined ? c.chart.decadals[c.chart.now.current] : undefined, nxt = c.chart.now.next !== undefined ? c.chart.decadals[c.chart.now.next] : undefined;
  for (const [re, d, name] of [[/지금 (?:머무는 )?10년(?:은|이|의 칸은)?\s*(?:[^.]{0,14}?)/, cur, "지금"], [/다음 10년(?:은|이|의 칸은)?\s*(?:[^.]{0,14}?)/, nxt, "다음"]] as const) {
    const m = re.exec(plain); if (!m) continue;
    const p = hits(plain.slice(m.index + m[0].length), PALACE_RE, palaceOf)[0];
    if (p && p.at < 4 && (!d || d.palace !== p.id)) out.push({ rule: "decade_claim", detail: `${name} 10년은 ${d ? `${PALACE_NAMES[d.palace].easy} 칸` : "없다"}` });
  }
  if (AGE.test(plain)) out.push({ rule: "decade_claim", detail: "나이 말 — 자미 책은 연도 범위로만" });
  // ---- MBTI ----
  for (const m of plain.matchAll(/(?<![A-Za-z])([EI][NS][TF][JP])(?![A-Za-z])/g)) {
    if (!c.mbti) out.push({ rule: "mbti_outside", detail: `MBTI 입력이 없는데 ${m[1]}` });
    else if (m[1] !== c.mbti) out.push({ rule: "mbti_outside", detail: `입력 유형(${c.mbti})이 아닌 ${m[1]}` });
    else if (!c.pairHere) out.push({ rule: "mbti_outside", detail: "짝이 없는 소제목의 유형 이름" });
  }
  // ---- 재사용 · 금지 낱말 ----
  const st = STATUS_SAY.exec(plain); if (st) { const mine = c.relationship === "marriage_preparing" ? "dating" : c.relationship; if (STATUS_OF[st[1]] !== mine) out.push({ rule: "status_claim", detail: `「${st[0]}」 — 입력 연애 상태 ${mine || "미입력"}` }); }
  if (c.inputs) { const ph = premiseHits(maskPalaceNames(plain).text, c.inputs); if (ph.length) out.push({ rule: "input_premise", detail: `입력과 맞지 않는 전제 말(${ph.map(h => h.word).join(" · ")})` }); }
  if (MEMO_LEAK.test(plain) || ZW_MEMO_EXTRA.test(plain)) out.push({ rule: "memo_leak", detail: "작성 메모 · 지시 말" });
  if (/iztro/i.test(sen)) out.push({ rule: "lib_name", detail: "계산 라이브러리 이름" });
  if (SCHOOL.test(plain)) out.push({ rule: "school_talk", detail: "학파 · 계산 기준 이야기(화면 주석만)" });
  if (FATE_WORD.test(plain)) out.push({ rule: "fate_word", detail: "극단 운명 말" });
  if (GRADE_WORD.test(plain)) out.push({ rule: "grade_word", detail: "등급 낱말 · 갈래 이름" });
  if (/�/.test(sen)) out.push({ rule: "bad_char", detail: "깨진 글자" });
  if (/(?:얼마나|어떻게|어디까지|왜|누가|무엇이|언제)[^,.?!]{0,30}(?:는지|은지|인지|던지), [^.?!]*(?:다면|라면)/.test(plain)) out.push({ rule: "cut_clause", detail: "「…는지,」가 받을 말 없이 끊김" });
  { const d = dupPhrase(plain); if (d) out.push({ rule: "dup_phrase", detail: `「${d}」 되풀이` }); }
  if (EVENT.test(plain) && WHEN.test(plain)) out.push({ rule: "future_event", detail: "때와 결과를 정한 예언" });
  if (HEALTH_CLAIM.test(plain) || HEALTH_BODY.test(plain) || DISEASE.test(plain)) out.push({ rule: "health_claim", detail: "건강 단정 · 병 이름" });
  else if (ZW_HEAT.test(plain)) out.push({ rule: "health_claim", detail: "몸의 열 말(몸 증상으로 읽힘)" });
  return out;
}

/** 형식 검사(장 · 소제목 수 · 빈 소제목). */
function structure(chs: readonly FinalChapter[], c: ZCheckCtx): ZFlag[] {
  const out: ZFlag[] = [];
  for (const d of c.design.chapters) {
    const ch = chs.find(x => x.n === d.n);
    if (!ch || !ch.sections.length) { out.push({ chapter: d.n, section: -1, paragraph: -1, rule: "chapter_missing", sentence: "", detail: `${d.n}장이 비었다`, branch: "broken" }); continue; }
    if (ch.sections.length !== d.sections.length) out.push({ chapter: d.n, section: -1, paragraph: -1, rule: "section_count", sentence: "", detail: `소제목 ${ch.sections.length}/${d.sections.length}`, branch: null });
    ch.sections.forEach((s, si) => { if (!s.paragraphs.length) out.push({ chapter: d.n, section: si, paragraph: -1, rule: "section_empty", sentence: "", detail: "빈 소제목", branch: "broken" }); });
  }
  return out;
}
/** 본문 문장 검사(소제목 머리글 포함 — 머리글은 paragraph -1). */
function claims(chs: readonly FinalChapter[], c: ZCheckCtx): ZFlag[] {
  const out: ZFlag[] = [], b = c.brief;
  for (const ch of chs) {
    const d = c.design.chapters.find(x => x.n === ch.n);
    ch.sections.forEach((s, si) => {
      const pairHere = Boolean(d?.sections[si]?.pair);
      const ctx = { chart: b.chart, mbti: b.person.mbti, relationship: b.person.relationshipStatus, inputs: b.inputs, pairHere };
      for (const r of ziweiSentenceFlags(s.heading, ctx)) out.push({ chapter: ch.n, section: si, paragraph: -1, rule: r.rule, sentence: s.heading, detail: r.detail, branch: ZIWEI_RULE_BRANCH[r.rule] ?? null });
      s.paragraphs.forEach((p, pi) => {
        const five = FIVE_NAME.test(p);
        for (const sen of splitZ(p.replace(/[⟪⟫]/g, ""))) {
          const rs = ziweiSentenceFlags(sen, ctx);
          // 오행국이 나온 문단: 이어지는 문장의 오행 비유(「쇠처럼 … 결로 읽으면」)도 카드에 없는 오행국 뜻(Z5 판독 ① 1).
          if (five && !FIVE_NAME.test(sen) && (FIVE_SIMILE.test(sen) || FIVE_TRAIT.test(sen)) && !rs.some(r => r.rule === "chart_claim")) rs.push({ rule: "chart_claim", detail: "오행국에 카드에 없는 뜻(오행국은 첫 10년이 열리는 때만)" });
          for (const r of rs) out.push({ chapter: ch.n, section: si, paragraph: pi, rule: r.rule, sentence: sen, detail: r.detail, branch: ZIWEI_RULE_BRANCH[r.rule] ?? null });
        }
      });
    });
  }
  return out;
}
/**
 * 남은 차단 문장 지우기(발행 함수 마지막 단계 · 재현 도구 공통). 문단에서 그 문장만 뺀다. 못 찾으면 undefined, 빼면 문단이 비면 null(보류 몫).
 * 지운 문장이 칸 하나를 말했고 바로 다음 문장이 「그 칸 · 이 칸」으로 받으면 받는 말을 그 칸 이름으로 바꾼다(7부 재현: 지운 뒤 「그 칸」이 앞 문단의 다른 칸을 가리켰다).
 */
const DEICTIC_PALACE = /(?<![가-힣])(?:그|이) 칸(?=[은는이가을를의에도과와]|\s)/;
const normZ = (t: string) => t.replace(/[⟪⟫]/g, "").replace(/[^가-힣A-Za-z0-9]/g, "");
export function cutSentence(para: string, sentence: string): string | null | undefined {
  const parts = splitZ(para), target = normZ(sentence);
  const gone = parts.map(s => normZ(s) === target || normZ(s).includes(target));
  const first = gone.indexOf(true);
  if (first < 0) return undefined;
  const kept = parts.filter((_, i) => !gone[i]);
  if (!kept.length) return null;
  const named = [...new Set(hits(parts[first].replace(/[⟪⟫]/g, ""), PALACE_RE, palaceOf).map(h => h.id))];
  const nextAt = parts.findIndex((_, i) => i > first && !gone[i]);
  if (named.length === 1 && nextAt === first + 1) {
    const k = kept.indexOf(parts[nextAt]);
    if (k >= 0) kept[k] = kept[k].replace(DEICTIC_PALACE, `${PALACE_NAMES[named[0] as PalaceId].easy} 칸`);
  }
  return kept.join(" ");
}
export type ZCheck = (chs: readonly FinalChapter[], c: ZCheckCtx) => ZFlag[];
export const ZIWEI_CHECKS: ZCheck[] = [structure, claims];
export function inspectZiwei(chs: readonly FinalChapter[], c: ZCheckCtx): ZFlag[] { return ZIWEI_CHECKS.flatMap(f => f(chs, c)); }
