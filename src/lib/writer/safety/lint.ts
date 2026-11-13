/**
 * P6c 원고 검사(lint, 결정론·호출 0). 기준선 지표(tools/p6c)와 안전망·수리 패스가 같은 정의를 쓴다.
 * A1 DB 원문 복사(정규화 20자 창) · A3 같은 고객 다른 책 겹침(정규화 글자 5-gram 자카드 0.5) ·
 * A4 문형(용어 뜻 공식 책당 4회, "명리학에서" 금지, "앞에서 본" 책당 2회) · B 사실 정합(음양 비율·오행 유무·대운 위치·배우자/자녀 별) ·
 * C 개인화(학교 장면·관계 전제·입력 없는 과거·MBTI 약어) · D 그림 별명·농사 비유·1장 두 번째 그림.
 */
import { norm } from "./sentences";

/** A1: 고객 문장에 DB 원문이 정규화 기준 이만큼 이어서 들어가면 실패. */
export const COPY_WINDOW = 20;
/** 글 묶음의 정규화 창 집합. */
export function copyWindows(texts: Iterable<string>, w = COPY_WINDOW): Set<string> {
  const out = new Set<string>();
  for (const t of texts) { const n = norm(t); for (let i = 0; i + w <= n.length; i++) out.add(n.slice(i, i + w)); }
  return out;
}
/** 문장이 창 집합과 w자 이상 이어서 겹치면 첫 겹침 창, 아니면 null. */
export function copiedWindow(sentence: string, windows: ReadonlySet<string>, w = COPY_WINDOW): string | null {
  const n = norm(sentence);
  for (let i = 0; i + w <= n.length; i++) { const x = n.slice(i, i + w); if (windows.has(x)) return x; }
  return null;
}

/** A3: 정규화 글자 5-gram. */
export const shingles = (s: string, n = 5): Set<string> => { const t = norm(s), out = new Set<string>(); for (let i = 0; i + n <= t.length; i++) out.add(t.slice(i, i + n)); return out; };
export const OVERLAP_JACCARD = 0.5;
/** 짧은 문장(정규화 10자 미만)은 겹침을 보지 않는다(인사·짧은 질문). */
const MIN_OVERLAP_CHARS = 10;
/** 늘려 가며 쓰는 겹침 색인: has(s) = 이미 넣은 문장 가운데 5-gram 자카드가 기준 이상인 것이 있는가. 책 안 반복 검사·결정론 작가가 쓴다. */
export function overlapIndex(seed: readonly string[] = [], th = OVERLAP_JACCARD) {
  const sets: Set<string>[] = [], index = new Map<string, number[]>();
  const add = (s: string) => { if (norm(s).length < MIN_OVERLAP_CHARS) return; const g = shingles(s), i = sets.length; sets.push(g); for (const x of g) { const l = index.get(x); if (l) l.push(i); else index.set(x, [i]); } };
  const has = (s: string) => {
    if (norm(s).length < MIN_OVERLAP_CHARS) return false;
    const g = shingles(s), shared = new Map<number, number>();
    for (const x of g) for (const i of index.get(x) ?? []) shared.set(i, (shared.get(i) ?? 0) + 1);
    for (const [i, n] of shared) if (n / (g.size + sets[i].size - n) >= th) return true;
    return false;
  };
  for (const s of seed) add(s);
  return { add, has };
}
/** b의 문장 가운데 a의 어떤 문장과 5-gram 자카드가 기준 이상인 것(역색인으로 후보만 비교). */
export function overlapping(a: readonly string[], b: readonly string[], th = OVERLAP_JACCARD): { a: string; b: string; j: number }[] {
  const sa = a.filter(s => norm(s).length >= MIN_OVERLAP_CHARS).map(s => ({ s, g: shingles(s) }));
  const index = new Map<string, number[]>();
  sa.forEach((x, i) => { for (const g of x.g) { const l = index.get(g); if (l) l.push(i); else index.set(g, [i]); } });
  const out: { a: string; b: string; j: number }[] = [];
  for (const s of b) {
    if (norm(s).length < MIN_OVERLAP_CHARS) continue;
    const g = shingles(s), shared = new Map<number, number>();
    for (const x of g) for (const i of index.get(x) ?? []) shared.set(i, (shared.get(i) ?? 0) + 1);
    let best: { i: number; j: number } | null = null;
    for (const [i, n] of shared) { const j = n / (g.size + sa[i].g.size - n); if (j >= th && (!best || j > best.j)) best = { i, j }; }
    if (best) out.push({ a: sa[best.i].s, b: s, j: Math.round(best.j * 100) / 100 });
  }
  return out;
}

/** A4 ① 용어 뜻 공식: "식신(食神)은 ~을 뜻해요", "묘는 명리학에서 ~를 뜻해요". 책당 MAX_FORMULA회. */
export const MAX_FORMULA = 4;
export const MEANING_FORMULA = /[가-힣]{1,10} ?\([一-鿿]{1,6}\)(은|는|이란|이라는 [가-힣]{1,4}(은|는))? [^.?!]{0,140}(뜻해요|뜻합니다|뜻이에요|뜻입니다|뜻하죠|뜻하는데|뜻해서|라는 뜻)|[가-힣]{1,10}(은|는) 명리학?에서는? [^.?!]{0,140}(뜻해요|뜻합니다|뜻이에요|뜻입니다)/;
/** 공식의 뒤 문장: "그래서 당신에게는 ~". */
export const FORMULA_FOLLOW = /^(그래서|그러니) 당신(에게는|에게|은|의)/;
/** A4 ② 본문 금지: 명리학에서·명리학적으로·명리에서는. */
export const MYEONGRI_PREFIX = /명리학에서는?|명리학적으로|명리에서는|명리학에선|명리학으로는/;
/** 뜻을 바꾸지 않고 지울 수 있는 꼴("식신은 명리학에서 ~을 뜻해요" → "식신은 ~을 뜻해요"). */
export const dropMyeongriPrefix = (s: string) => s.replace(/명리학적으로 (보면|볼 때),? ?/g, "").replace(/(명리학에서는?|명리학적으로|명리에서는|명리학에선|명리학으로는) /g, "");
/** A4 ③ 되짚기: "앞에서 본" 책당 MAX_BACKREF회. */
export const MAX_BACKREF = 2;
export const BACKREF_WORD = /앞에서 본|앞서 본|앞 장에서 본/;

/** D1 농사 비유(현대 생활로 쓴다). 낱말 앞이 한글이면 다른 낱말이라 뺀다("콩밭"은 잡는다). */
export const FARMING = /씨(를|앗을)? ?뿌리|씨앗을 (심|뿌리|틔우)|싹을 틔우|잡초|(?<![가-힣])밭(을|에|이|에서|처럼|은|과|의)?(?![가-힣])|[가-힣]밭(을|에|이|에서)(?![가-힣])|텃밭|밭흙|밭일|논밭|김장|모내기|추수|농사|(?<![가-힣])거름|이랑|모종|파종|김매기|수확(?!률)|논(을|에|이|처럼)(?![가-힣])|열매를 맺/;
/**
 * D1 그림 별명 사전 = 지식 DB easyName 전체(250, 호출하는 쪽이 넘긴다) + 별명의 머리말 중 그림에만 쓰이는 낱말.
 * 머리말 대부분(지갑·우산·회의실)은 일상어라 넣지 않는다. 아래는 P6b 원고에 DB 문장을 타고 새어 나온 그림 낱말("안장은 무겁습니다", "깃발을 꽂으면").
 */
export const NICKNAME_KEYS: readonly string[] = ["안장", "깃발", "오뚝이", "씨간장", "노을빛", "호위무사", "역참"];
/** D1: 그림 별명이 든 문장의 별명들(핵심 이미지 줄 자체는 뺀다). */
export function nicknameHits(sentence: string, nicknames: readonly string[], exempt: readonly string[] = []): string[] {
  const s = exempt.reduce((x, e) => (e ? x.split(e).join(" ") : x), sentence);
  return nicknames.filter(n => n.length >= 2 && s.includes(n));
}
/** D2: 1장에서 핵심 이미지 말고 다른 그림을 세우는 꼴("가을 쇠 위에 선 큰 나무"). */
const SECOND_IMAGE = /(위에|속에|곁에|아래|앞에) (선|앉은|핀|놓인|뜬|서 있는|자란) [가-힣 ]{0,8}(나무|불|불꽃|물|강|바다|흙|땅|산|쇠|칼|바위|꽃|등불|촛불|태양|별|달)/;
export const secondImage = (s: string, core: string) => Boolean(core) && !s.includes(core) && SECOND_IMAGE.test(s);

/** C1 학교 장면: 학생 입력이 아니면 금지. SCHOOL_MINOR는 초·중·고 장면(대학생도 금지). "숙제"는 관용어("풀어야 할 숙제")라 뺀다. */
export const SCHOOL_SCENE = /모의고사|학원|필기 ?노트|성적표|수능|기출문제|시험지|교과서|담임|급식|야간 자율|야자 시간|중간고사|기말고사|수행평가|독서실|학점|강의실|조별 과제|팀플|쪽지 ?시험|교복|반 친구|수업 시간|수업 중|시험 범위|과제 제출|동아리방|등굣길|하굣길|생활기록부|매점|수강신청|전공 교재|학식|시험 기간|발표 수업/;
export const SCHOOL_MINOR = /모의고사|학원|수능|담임|급식|야간 자율|야자 시간|교복|반 친구|수행평가|쪽지 ?시험|등굣길|하굣길|생활기록부|매점|수업 중 쪽지|성적표/;
export type SchoolStage = "minor" | "college" | "none";
/** 학교 장면 낱말(없으면 null). jobDetail이 학교·학원 일(교사·강사)이면 허용. */
export function schoolHit(sentence: string, stage: SchoolStage | "student", jobDetail = ""): string | null {
  if (/학원|교사|선생|강사|교수|학교|교육/.test(jobDetail)) return null;
  const re = stage === "none" ? SCHOOL_SCENE : stage === "college" ? SCHOOL_MINOR : null;
  return re ? sentence.match(re)?.[0] ?? null : null;
}

/** C2 관계 전제: 솔로·미입력에게 상대가 있다고 전제하는 말. 조건형("좋아하는 사람이 생기면")은 허용. */
const PARTNER_PRESUME = /좋아하는 (사람|상대|그 사람)(에게|한테|과|와|의|이랑| ?앞에서| ?앞|을|를|이|은|도)|마음에 둔 (사람|상대)(에게|한테|과|와|의| ?앞)|부부 ?사이|(?<![가-힣])(남편|아내|와이프)(가|와|과|는|를|의|에게|한테|이랑)|배우자(가|와|과|는|를|의|에게|한테)(?! ?(자리|별|궁|성))|연인(과|이|은|에게|한테|의|이랑)|(?<![가-힣])애인|남자친구|여자친구|남친|여친|썸(을|이|타)/;
// AM 7부 annual-1 재생성: 고객이 적은 소망 인용 「좋아하는 사람도 생겼으면 좋겠다」는 바람(가정)이다.
const PARTNER_COND = /(생겼으면|생기길|생기기를|만났으면|만나길|생기면|생긴다면|생겼을 때|생길 때|생기는 날|생긴 뒤|만나면|만난다면|만날 때|만나게 되면|된다면|되면|이라면|라면|있다면|언젠가|만약|혹시|함께 살게|결혼한다면|결혼하면)/;
/** 기혼이 아닌데 결혼 생활을, 솔로·미입력인데 연인을 전제하는가(규칙 이름, 없으면 null). */
export function presumedPartner(sentence: string, relationship: "single" | "dating" | "married" | "unknown"): string | null {
  if (relationship === "married") return null;
  const m = sentence.match(PARTNER_PRESUME); if (!m) return null;
  if (PARTNER_COND.test(sentence) || /\?["'”’)⟫]*$/.test(sentence.trim())) return null;
  // 연애 중이면 연인·좋아하는 사람은 사실이다(결혼 생활만 전제 금지).
  if (relationship === "dating" && !/부부|남편|아내|와이프|배우자/.test(m[0])) return null;
  return m[0];
}
/** C3 입력 없는 과거 사건·관계를 사실로 쓰는 꼴("막내 시절의 빠듯함", "그 말에 진로를 튼 친구도 있고요"). 질문형·가정형은 허용. */
const PAST_LIFE = /(막내|신입|어린|어렸을|학생|학창|사회 ?초년생?|신혼|연애 ?초|사춘기|첫 직장|입사 ?초|대학|어린이집|유치원|중학생|고등학생) ?(시절|때)(의|에|에는|엔|부터|처럼|만큼)?(?![가-힣]*(라면|이라면|처럼 보))/;
const THIRD_PARTY = /[가-힣]+ (친구|동료|선배|후배|지인|사람)(도|이|가) (있(고요|어요|죠|습니다|었어요|었습니다|었죠)|생겼(어요|습니다|죠))/;
export function pastAssertion(sentence: string): string | null {
  const s = sentence.trim();
  // 질문형·가정형("만약 ~였다면")만 허용한다. "~해 두면"처럼 앞으로의 조건은 과거 단정을 덮지 않는다.
  if (/\?["'”’)⟫]*$/.test(s) || /(만약|혹시|였다면|었다면|했다면|이었다면)/.test(s)) return null;
  return s.match(PAST_LIFE)?.[0] ?? s.match(THIRD_PARTY)?.[0] ?? null;
}

/** C5 MBTI 기능 약어: 괄호 안("일을 되게 만드는 판단(Te)")에서만 쓴다. 괄호 밖 약어 목록. */
const FN = /(?<![A-Za-z])(Ni|Ne|Si|Se|Ti|Te|Fi|Fe)(?![A-Za-z])/g;
export function bareFunctionCodes(text: string): string[] {
  const out: string[] = [];
  for (const m of text.matchAll(FN)) {
    const i = m.index ?? 0, open = text.lastIndexOf("(", i), close = text.lastIndexOf(")", i);
    if (!(open > close && text.indexOf(")", i) > i)) out.push(m[1]);
  }
  return out;
}

/** B 오행 이름(쉬운 말·한자 읽기). 한 글자 읽기(수·화·목·금·토)는 "할 수 없어요"와 겹쳐 '기운·글자'나 "물(수)" 꼴일 때만 본다. */
export const ELEMENT_WORDS: Readonly<Record<"WOOD" | "FIRE" | "EARTH" | "METAL" | "WATER", { native: string; reading: string }>> = {
  WOOD: { native: "나무", reading: "목" }, FIRE: { native: "불", reading: "화" }, EARTH: { native: "흙", reading: "토" }, METAL: { native: "쇠", reading: "금" }, WATER: { native: "물", reading: "수" },
};
export type ElementPresence = Readonly<Record<keyof typeof ELEMENT_WORDS, { readonly surface: number; readonly hidden: boolean }>>;
const ABSENT_TAIL = "(이|가|은|는)? (전혀 |하나도 |아예 |거의 )?없(어요|습니다|는|고|다|으니|어서|죠|지만|이|는데|음)";
/** P6d C: 오행 이름과 "없다" 사이에 자리 말("원국에·사주에·내 안에")이 끼거나 한자로 쓴 꼴("金이 없어서"). */
const ABSENT_PLACE = "(이|가|은|는)? (원국에|사주에|타고난 자리에|여덟 글자에|내 안에|당신 안에|당신에게|안에)(는|도)? (전혀 |하나도 |아예 |거의 )?없(어요|습니다|는|고|다|으니|어서|죠|지만|이|는데|음|어|으면)";
const HANJA_EL: Readonly<Record<string, string>> = { WOOD: "木", FIRE: "火", EARTH: "土", METAL: "金", WATER: "水" };
const QUALIFIED = /겉(으로|에|에서)?(는|도|만)?|드러난|땅속|지장간|숨은|숨어|속에 (조금|살짝)/;
/** B2: 겉 글자 0 · 지장간에 있음인데 "없다"로 단정한 오행(겉·땅속 한정어가 있으면 허용). 겉에 있는데 "없다"도 잡는다. */
export function elementAbsenceClaims(sentence: string, presence: ElementPresence): string[] {
  if (QUALIFIED.test(sentence)) return [];
  const out: string[] = [];
  for (const [e, w] of Object.entries(ELEMENT_WORDS) as [keyof typeof ELEMENT_WORDS, { native: string; reading: string }][]) {
    const p = presence[e]; if (!p || (p.surface === 0 && !p.hidden)) continue;
    const name = `(?<![가-힣])(${w.native}(\\(${w.reading}\\))?( ?기운| ?글자| ?기둥)?|${w.reading} ?(기운|글자)|${w.reading}\\(${HANJA_EL[e]}\\)( ?기운)?)|${HANJA_EL[e]}( ?기운)?`;
    const re = new RegExp(`(${name})(${ABSENT_TAIL}|${ABSENT_PLACE})`);
    if (re.test(sentence)) out.push(e);
  }
  return out;
}

/**
 * 최종판 1-5 오행 개수: "없다·하나도 없다"(앞에 오는 꼴 "없는 쇠" 포함)·"가장 많다·가장 적다"를 원국 겉 글자 수(presence.surface)와 대조한다.
 * 없다: 겉 1개 이상이면 위반(겉 0·땅속만 있음은 elementAbsenceClaims가 본다). 가장 많다/적다: 겉 수가 최댓값/최솟값이 아니면 위반(같은 수는 허용).
 */
export function elementCountClaims(sentence: string, presence: ElementPresence, strongest?: string): string | null {
  if (QUALIFIED.test(sentence)) return null;
  const counts = Object.values(presence).map(p => p.surface), max = Math.max(...counts), min = Math.min(...counts);
  for (const [e, w] of Object.entries(ELEMENT_WORDS) as [keyof typeof ELEMENT_WORDS, { native: string; reading: string }][]) {
    const p = presence[e]; if (!p) continue;
    const name = `(?:${w.native}(?:\\(${w.reading}\\))?(?: ?기운| ?글자)?|${w.reading} ?(?:기운|글자)|${HANJA_EL[e]})(?=[이가은는을를의도과와로만에]|\\s|[,.]|$)`;
    if (p.surface > 0 && new RegExp(`(?<![가-힣])없는 (?:${name}|${w.native})|(?<![가-힣])${name}(?:이|가|은|는)? (?:하나도|전혀|아예) 없`).test(sentence)) return `${e}:없음≠${p.surface}`;
    // AM 재생성 2 판독(sodam 2장, 세 판째): 「물은 가장 센 기운」은 세기 말이라 개수(겉 2)가 아니라 엔진의 가장 센 오행과 견준다 — 개수로 걸어 수리가 「두 개로 … 세기는 가장 많은 편」 비문을 만들었다.
    const strengthWord = new RegExp(`(?<![가-힣])${name}(?:이|가|은|는)? 가장 (?:센|강하|강한)|가장 (?:센|강한) (?:${name}|${w.native})`).test(sentence);
    if (strengthWord && strongest) { if (strongest !== e) return `${e}:가장 셈≠${strongest}`; }
    else if (p.surface < max && new RegExp(`(?<![가-힣])${name}(?:이|가|은|는)? 가장 (?:많|센|강하|두텁)|가장 많은 (?:${name}|${w.native})`).test(sentence)) return `${e}:가장 많음≠${p.surface}/${max}`;
    if (p.surface > min && new RegExp(`(?<![가-힣])${name}(?:이|가|은|는)? 가장 (?:적|모자라|부족|약하)|가장 (?:적은|모자란|부족한|약한) (?:${name}|${w.native})`).test(sentence)) return `${e}:가장 적음≠${p.surface}/${min}`;
  }
  return null;
}

/** 최종판 1-5 궁합: 두 사람 이름이 함께 나온 문장도 "○○님에게 없는 쇠"처럼 이름 바로 뒤 없음 꼴은 그 사람 값과 견준다(P6e "백은솔님에게 없는 쇠", 庚 1개). */
export function elementOwnedClaims(sentence: string, people: readonly { readonly name: string; readonly presence: ElementPresence }[]): string | null {
  for (const p of people) for (const [e, w] of Object.entries(ELEMENT_WORDS) as [keyof typeof ELEMENT_WORDS, { native: string; reading: string }][]) {
    const pr = p.presence[e]; if (!pr || pr.surface === 0) continue;
    const re = new RegExp(`${p.name}님?(에게는|에게|은|는|의 사주에는|의 원국에는)\\s?(없는|하나도 없는|전혀 없는|빠진) (${w.native}|${w.reading} ?(기운|글자))`);
    if (re.test(sentence)) return `${p.name}:${e}:없음≠${pr.surface}`;
  }
  return null;
}

/** B1 음양: 같으면 균형, 차이 2 이상(5:3·6:2…)이면 치우침. 비율과 다른 말을 잡는다. */
const YINYANG = /음(과|이|은|의)? ?양|음양|음 기운|양 기운|밀고 기다리는|음이 [0-9]|양이 [0-9]/;
const BALANCED_WORD = /균형|반반|고르게|비슷하게|똑같|같은 비율|4대 ?4|3대 ?3|딱 맞/;
const SKEW_WORD = /치우|쏠려|쏠린|기울|한쪽으로|많은 편|더 많|훨씬 많/;
/** 음양 균형의 설명 문장(지식 DB yinYang:BALANCED). 치우친 사람에게 붙으면 비율과 다른 설명이다(P6b 하람 6:2). */
const BALANCED_DESC = /밀(어야|고) 할 때와 기다려야 할 때|상황에 맞게 (골라|고르)|양쪽 (입장|사정)을 (다 )?이해/;
/** 문장이 음·양 가운데 어느 쪽이 많다고 말하나(「양의 기운이 앞서」·「음의 기운이 더 많아」). */
export const yinYangLean = (s: string): "yin" | "yang" | null => /(?<![가-힣])음(?:의)? ?기운(?:이|은)? (?:더 |훨씬 )?(?:많|앞서|우세|강하|세)/.test(s) ? "yin" : /(?<![가-힣])양(?:의)? ?기운(?:이|은)? (?:더 |훨씬 )?(?:많|앞서|우세|강하|세)/.test(s) ? "yang" : null;
export function yinYangClaim(sentence: string, yin: number, yang: number): "false_balance" | "false_skew" | "false_direction" | null {
  const balanced = yin === yang;
  if (!balanced && BALANCED_DESC.test(sentence)) return "false_balance";
  // AM 판독(major-4): 양 4·음 2인데 수리가 「음의 기운이 더 많아」로 바꿨다 — 쪽(방향)을 거꾸로 말한 것도 비율과 다른 말이다.
  const lean = yinYangLean(sentence);
  if (lean && ((lean === "yin" && yin < yang) || (lean === "yang" && yang < yin))) return "false_direction";
  if (!YINYANG.test(sentence)) return null;
  if (!balanced && BALANCED_WORD.test(sentence) && !/(않|아니|못)/.test(sentence)) return "false_balance";
  if (balanced && SKEW_WORD.test(sentence)) return "false_skew";
  return null;
}

/** B5 대운 안의 위치: 시작 연도 기준 0~2년 앞쪽, 3~6년 중간, 7~9년 끝. */
export type DayunPhase = "early" | "middle" | "late";
export const dayunPhase = (yearIndex: number): DayunPhase => (yearIndex <= 2 ? "early" : yearIndex <= 6 ? "middle" : "late");
export const DAYUN_PHASE_KO: Readonly<Record<DayunPhase, string>> = { early: "앞쪽", middle: "중간", late: "끝 무렵" };
/** AM2-7 5부 3: 위치 말 표 하나 — 엔진 위치(대운 안 몇 번째 해, 1~10) → 고객 말. 카드(위치 값) · 화면 · 검사(dayun_claim · dayun_position)가 함께 쓴다. */
export const dayunPositionKo = (yearIndex1: number): string => (yearIndex1 === 1 ? "첫해" : yearIndex1 === 10 ? "마지막 해" : DAYUN_PHASE_KO[dayunPhase(yearIndex1 - 1)]);
const PHASE_CLAIM: readonly [DayunPhase, RegExp][] = [
  ["early", /초입|막 시작|들어선 지 얼마|시작한 지 얼마|앞쪽|첫머리|문을 연/],
  ["middle", /한가운데|중반|중간쯤|중간 지점|허리/],
  // P7 major-p5 3.0 · 3.2: 「하나만큼은 끝까지 마무리하는 원칙」 「이번 대운 안에 끝까지 마무리해 보세요」는 위치 말이 아니다 — 「마무리」는 때를 가리킬 때만.
  ["late", /끝자락|(대운|10년)의 마무리|마무리 (단계|시기|무렵|구간|해)|마무리(하는|되는|짓는) (때|시기|해|구간|10년)|마무리(에|로) (들어|접어)|막바지|끝나 가|끝 무렵|저물|마지막 (몇 )?해|끝을 향/],
];
/** 대운 이야기에서 위치를 잘못 짚은 말(실제 위치와 다른 단계 이름). */
export function dayunPhaseClaim(sentence: string, actual: DayunPhase): DayunPhase | null {
  if (!/대운|10년 흐름|십 년 흐름|10년의|이번 10년|지금 10년/.test(sentence)) return null;
  // AM2-7 1부 6(P6 major-p5 2.0 「2023년은 정묘 대운의 마지막 해였고, …」): 해 이름이 붙은 위치 말은 그 해의 대운 위치다(지금 대운 위치가 아니다 — 세운·대운은 dayun_position이 해 기준으로 본다).
  if (/(19|20)\d\d년/.test(sentence)) return null;
  for (const [p, re] of PHASE_CLAIM) if (p !== actual && re.test(sentence)) return p;
  return null;
}

/** B4 배우자 별·자녀 별: 성별 기준 별과 자리(겉·지장간·없음). 이 사실과 어긋나는 문장. */
export type StarWhere = "surface" | "hidden" | "none";
const STAR_ABSENT = /(없|안 보이|보이지 않|드러나지 않)/;
const STAR_PRESENT = /(뚜렷|또렷|드러나 있|겉에 (있|보)|강하게 (있|자리)|두 개|여러 개|자리 잡고 있)/;
export function starClaim(sentence: string, label: "배우자" | "자녀", where: StarWhere): string | null {
  const re = new RegExp(`${label} ?(별|성)(이|은|는|도)?[^.?!]{0,24}`);
  const m = sentence.match(re); if (!m) return null;
  const tail = m[0];
  if (where === "surface" && STAR_ABSENT.test(tail) && !/조건|않아도|없어도/.test(tail)) return `${label}_absent_claim`;
  if (where === "hidden" && STAR_PRESENT.test(tail)) return `${label}_surface_claim`;
  if (where === "hidden" && STAR_ABSENT.test(tail) && !QUALIFIED.test(sentence)) return `${label}_absent_claim`;
  if (where === "none" && STAR_PRESENT.test(tail)) return `${label}_present_claim`;
  return null;
}

/** H: 핵심 문장 표시 기호. 저장 전에 지우고 위치만 남긴다. 남으면 실패. */
export const KEY_OPEN = "⟪", KEY_CLOSE = "⟫";
export const KEY_MARK = /[⟪⟫]/g;

/**
 * P6d A: 십성 묶음 세기 말. 묶음 이름(비겁·식상·재성·관성·인성, 쉬운 이름 뒤 괄호 "(관성)" 포함) 뒤 같은 마디(쉼표·마침표 전 16자) 안의 세기 낱말.
 * 엔진 단계(만세력 오행 칸 가중값: 강·보통·약)와 다르면 실패. 부정("약하지 않")은 세지 않는다.
 */
export type GroupLevelKo = "강" | "보통" | "약";
/** 최종 A-6: 「있음」 = 신약인데 비겁·인성이 강(한 문장 틀로만 씀) — 강·약 어느 세기 말도 맞지 않는다. */
export type GroupLevels = Readonly<Record<"비겁" | "식상" | "재성" | "관성" | "인성", GroupLevelKo | "있음">>;
// 최종판2 1-5: 쉬운 이름의 활용형("만들고 넓히는 힘", "값을 받아 내는 힘", "배우고 익히는 힘")도 그 묶음 이름으로 읽는다(장덕민 커리어 「만들고 넓히는 힘이 큰 확장형」, 식상 약).
const EASY_FORMS = "내 방식(?:의|대로 [가-힣]{1,6}는) 힘|만들(?:고 [가-힣]{1,6}는|어 내는|어 [가-힣]{1,6}는) 힘|만드는(?: [가-힣]{1,6}는)? 힘|값을 받(?:는|아 내는|고 [가-힣]{1,6}는) 힘|규칙(?:의|을 [가-힣]{1,6}는) 힘|배우(?:는|고 [가-힣]{1,6}는) 힘";
const GROUP_NAME_RE = new RegExp(`(?<![가-힣])(비겁|식상|재성|관성|관살|인성|${EASY_FORMS}|비견|겁재|식신|상관|편재|정재|편관|정관|편인|정인)(?=\\)|\\(|[이가은는의도]|\\s|$|[,.])`, "g");
/** 최종판 1-5 십성 세기: 십성 하나("정인이 강해")의 세기 말은 그 묶음 세기 하나(chart.groups)로만 쓴다 → 묶음 이름으로 읽어 엔진 단계와 대조한다. */
const TEN_GOD_TO_GROUP: Readonly<Record<string, string>> = { 비견: "비겁", 겁재: "비겁", 식신: "식상", 상관: "식상", 편재: "재성", 정재: "재성", 편관: "관성", 정관: "관성", 편인: "인성", 정인: "인성" };
/** P6e 14: 쉬운 이름 → 묶음 이름. */
const EASY_GROUP: Readonly<Record<string, string>> = { "내 방식의 힘": "비겁", "만드는 힘": "식상", "값을 받는 힘": "재성", "규칙의 힘": "관성", "배우는 힘": "인성" };
const easyGroupOf = (name: string): string | undefined => EASY_GROUP[name] ?? (/^내 방식/.test(name) ? "비겁" : /^만[들드]/.test(name) ? "식상" : /^값을 받/.test(name) ? "재성" : /^규칙/.test(name) ? "관성" : /^배우/.test(name) ? "인성" : undefined);
// "많이 쓴다"는 쓰임(일이 그 힘을 많이 쓴다)이지 세기가 아니다(r2 커리어: 문단을 잘못 뺐다).
const LV_STRONG = /^(강하|강한|강해|강합|강하게|강함|많(?!이)|두껍|두텁|두꺼|넘치|넘쳐|세고|센 편|센 쪽|힘이 세|가장 세|크게 자리|큰 (편|쪽|확장형|사람|구조|사주)|크고|큽니|커서|커요|크다)/;
const LV_MEDIUM = /^(보통|중간 정도|적당|평균)/;
const LV_WEAK = /^(약하|약한|약해|약합|약함|옅|부족|모자라|모자란|적은 편|적어|적고|없어|없는|없고|없으|빈약|얇)/;
export function groupClaims(sentence: string): { group: keyof GroupLevels; level: GroupLevelKo }[] {
  const out: { group: keyof GroupLevels; level: GroupLevelKo }[] = [];
  for (const m of sentence.matchAll(GROUP_NAME_RE)) {
    const group = (m[1] === "관살" ? "관성" : easyGroupOf(m[1]) ?? TEN_GOD_TO_GROUP[m[1]] ?? m[1]) as keyof GroupLevels;
    // 마디는 쉼표·마침표 또는 다음 묶음 이름 앞까지(r1: "식상은 있는데 재성이 약하다"의 "약하다"를 식상에 붙였다).
    const tail = sentence.slice((m.index ?? 0) + m[0].length).split(/[,.?!·]|(?<![가-힣])(?:비겁|식상|재성|관성|관살|인성|비견|겁재|식신|상관|편재|정재|편관|정관|편인|정인)(?=[)이가은는의도]|\s)/)[0].slice(0, 16);
    // 괄호 닫힘·조사·"의 힘"·"기운"·"쪽" 다음, 이름 뒤 말을 한 낱말씩 본다.
    const words = tail.replace(/^\([^)]*\)/, "").replace(/^\)?(이|가|은|는|의|도)?\s?/, "").split(/\s+/);
    for (let i = 0; i < Math.min(words.length, 5); i++) {
      const w = words.slice(i).join(" ");
      if (/^(지 않|지는 않|지 않은)/.test(words[i + 1] ?? "") || /지 ?않/.test(w.slice(0, 8))) break;
      const level: GroupLevelKo | null = LV_STRONG.test(w) ? "강" : LV_MEDIUM.test(w) ? "보통" : LV_WEAK.test(w) ? "약" : null;
      if (level) { out.push({ group, level }); break; }
    }
  }
  return out;
}
/** 엔진 단계와 다른 세기 말(없으면 null). */
export function groupClaimMismatch(sentence: string, levels: GroupLevels): string | null {
  // AM2-7 1부 6(P6 major-p6b 1.1 「재성이 가장 많은 결」 — 판독: 묶음끼리 견준 상대 최상급, 카드 값 그대로): 「가장 많은 · 가장 적은」은 단계 말이 아니다.
  if (/가장 (많|적|센|약한|강한)/.test(sentence) && !/(강|약)(해요|합니다|한 편)/.test(sentence)) return null;
  for (const c of groupClaims(sentence)) if (levels[c.group] !== c.level) return `${c.group}:${c.level}≠${levels[c.group]}`;
  return null;
}
