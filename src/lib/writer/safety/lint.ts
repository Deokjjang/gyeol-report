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
const PARTNER_PRESUME = /좋아하는 (사람|상대|그 사람)(에게|한테|과|와|의|이랑|앞에서|앞|을|를|이|은|도)|마음에 둔 (사람|상대)(에게|한테|과|와|의|앞)|부부 ?사이|(?<![가-힣])(남편|아내|와이프)(가|와|과|는|를|의|에게|한테|이랑)|배우자(가|와|과|는|를|의|에게|한테)(?! ?(자리|별|궁|성))|연인(과|이|은|에게|한테|의|이랑)|(?<![가-힣])애인|남자친구|여자친구|남친|여친|썸(을|이|타)/;
const PARTNER_COND = /(생기면|생긴다면|생겼을 때|생길 때|생기는 날|생긴 뒤|만나면|만난다면|만날 때|만나게 되면|된다면|되면|이라면|라면|있다면|언젠가|만약|혹시|함께 살게|결혼한다면|결혼하면)/;
/** 기혼이 아닌데 결혼 생활을, 솔로·미입력인데 연인을 전제하는가(규칙 이름, 없으면 null). */
export function presumedPartner(sentence: string, relationship: "single" | "dating" | "married" | "unknown"): string | null {
  if (relationship === "married") return null;
  const m = sentence.match(PARTNER_PRESUME); if (!m) return null;
  if (PARTNER_COND.test(sentence) || /\?$/.test(sentence.trim())) return null;
  // 연애 중이면 연인·좋아하는 사람은 사실이다(결혼 생활만 전제 금지).
  if (relationship === "dating" && !/부부|남편|아내|와이프|배우자/.test(m[0])) return null;
  return m[0];
}
/** C3 입력 없는 과거 사건·관계를 사실로 쓰는 꼴("막내 시절의 빠듯함", "그 말에 진로를 튼 친구도 있고요"). 질문형·가정형은 허용. */
const PAST_LIFE = /(막내|신입|어린|어렸을|학생|학창|사회 ?초년생?|신혼|연애 ?초|사춘기|첫 직장|입사 ?초|대학|어린이집|유치원|중학생|고등학생) ?(시절|때)(의|에|에는|엔|부터|처럼|만큼)?(?![가-힣]*(라면|이라면|처럼 보))/;
const THIRD_PARTY = /[가-힣]+ (친구|동료|선배|후배|지인|사람)(도|이|가) (있(고요|어요|죠|습니다|었어요|었습니다|었죠)|생겼(어요|습니다|죠))/;
export function pastAssertion(sentence: string): string | null {
  const s = sentence.trim();
  if (/\?["'”’)⟫]*$/.test(s) || /(라면|이라면|다면|면 )/.test(s.slice(0, 30))) return null;
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
const QUALIFIED = /겉(으로|에|에서)?(는|도|만)?|드러난|땅속|지장간|숨은|숨어|속에 (조금|살짝)/;
/** B2: 겉 글자 0 · 지장간에 있음인데 "없다"로 단정한 오행(겉·땅속 한정어가 있으면 허용). 겉에 있는데 "없다"도 잡는다. */
export function elementAbsenceClaims(sentence: string, presence: ElementPresence): string[] {
  if (QUALIFIED.test(sentence)) return [];
  const out: string[] = [];
  for (const [e, w] of Object.entries(ELEMENT_WORDS) as [keyof typeof ELEMENT_WORDS, { native: string; reading: string }][]) {
    const p = presence[e]; if (!p || (p.surface === 0 && !p.hidden)) continue;
    const re = new RegExp(`(?<![가-힣])(${w.native}(\\(${w.reading}\\))?( ?기운| ?글자| ?기둥)?|${w.reading} ?(기운|글자))${ABSENT_TAIL}`);
    if (re.test(sentence)) out.push(e);
  }
  return out;
}

/** B1 음양: 같으면 균형, 차이 2 이상(5:3·6:2…)이면 치우침. 비율과 다른 말을 잡는다. */
const YINYANG = /음(과|이|은|의)? ?양|음양|음 기운|양 기운|밀고 기다리는|음이 [0-9]|양이 [0-9]/;
const BALANCED_WORD = /균형|반반|고르게|비슷하게|똑같|같은 비율|4대 ?4|3대 ?3|딱 맞/;
const SKEW_WORD = /치우|쏠려|쏠린|기울|한쪽으로|많은 편|더 많|훨씬 많/;
/** 음양 균형의 설명 문장(지식 DB yinYang:BALANCED). 치우친 사람에게 붙으면 비율과 다른 설명이다(P6b 하람 6:2). */
const BALANCED_DESC = /밀(어야|고) 할 때와 기다려야 할 때|상황에 맞게 (골라|고르)|양쪽 (입장|사정)을 (다 )?이해/;
export function yinYangClaim(sentence: string, yin: number, yang: number): "false_balance" | "false_skew" | null {
  const balanced = yin === yang;
  if (!balanced && BALANCED_DESC.test(sentence)) return "false_balance";
  if (!YINYANG.test(sentence)) return null;
  if (!balanced && BALANCED_WORD.test(sentence) && !/(않|아니|못)/.test(sentence)) return "false_balance";
  if (balanced && SKEW_WORD.test(sentence)) return "false_skew";
  return null;
}

/** B5 대운 안의 위치: 시작 연도 기준 0~2년 앞쪽, 3~6년 중간, 7~9년 끝. */
export type DayunPhase = "early" | "middle" | "late";
export const dayunPhase = (yearIndex: number): DayunPhase => (yearIndex <= 2 ? "early" : yearIndex <= 6 ? "middle" : "late");
export const DAYUN_PHASE_KO: Readonly<Record<DayunPhase, string>> = { early: "앞쪽", middle: "중간", late: "끝 무렵" };
const PHASE_CLAIM: readonly [DayunPhase, RegExp][] = [
  ["early", /초입|막 시작|들어선 지 얼마|시작한 지 얼마|앞쪽|첫머리|문을 연/],
  ["middle", /한가운데|중반|중간쯤|중간 지점|허리/],
  ["late", /끝자락|마무리|막바지|끝나 가|끝 무렵|저물|마지막 (몇 )?해|끝을 향/],
];
/** 대운 이야기에서 위치를 잘못 짚은 말(실제 위치와 다른 단계 이름). */
export function dayunPhaseClaim(sentence: string, actual: DayunPhase): DayunPhase | null {
  if (!/대운|10년 흐름|십 년 흐름|10년의|이번 10년|지금 10년/.test(sentence)) return null;
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
