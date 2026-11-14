/**
 * AM2-3 1부·3-1 — 근거 카드 글을 「고객 문장 기준」으로(결정론, 호출 0). intake.ts가 부른다.
 * 원천(엔진·지식 DB)은 그대로 두고, 세운·대운 작가에게 가는 카드 글만 고친다(4종 작가 입력은 이 파일을 쓰지 않는다).
 * - 일반론 줄 빼기: 「…있을 때 봅니다」「…라 부릅니다」「…이면 …두드러집니다」처럼 이 사람에게 해당하는지 모르는 규칙 문장(P2 판독 major-1 백호 자리 오류의 원인).
 * - 단위 맞추기: 달 카드의 「…해」 → 「…달」, 대운 카드의 「…들어오는 해입니다」 → 「…10년입니다」.
 * - 같은 문장 겹침(짝 이유에 같은 문장 두 번), MBTI 기능 기호(Ti·Ne …).
 * - 장면 씨앗 정리(3-1): 시점 말 · 지난 일 전제 · 연차·직급 소품 · 입력 밖 직업·역할 · 나이 · 앞날 결과 꼬리.
 */
import type { Brief } from "@/lib/brief/schema";
import { noticeMeaning } from "../safety/p6e";

const SENT = /(?<=[.!?])\s+/;
/** 문장 단위로 걸러 잇는다(「 · 」로 이어 붙인 카드 마디도 문장으로 본다). */
export const sentences = (t: string) => t.split(/(?<=[.!?])\s+| · /).map(x => x.trim()).filter(Boolean);

// ---------- 일반론 줄 ----------
/** 판정 규칙·정의(이 사람에게 해당하는지 모르는 일반 문장). 「당신」이 든 문장(그 사람에게 건넨 말)은 남긴다. */
const RULE_END = /(있을 때|있으면|있거나|없으면|이면|이거나|오면|놓이면|걸리면|많으면|적으면|둘 이상이거나|셋 이상이면|들면|만나면|함께 있거나|함께 걸리면)[^.!?]{0,60}(봅니다|읽습니다|봐요|읽어요|두드러집니다|또렷합니다|셉니다|진합니다|진하게|넓어집니다|커집니다|붙습니다|단단해집니다|격입니다|드러납니다|강해집니다|줄어듭니다|얻습니다|늦어집니다|이어집니다)[.!]?$/;
const DEFINITION = /(라|이라) 부릅니다[.!]?$|(있을|올|들) 때 봅니다|(때|경우) 붙는 이름입니다[.!]?$|가운데 [^.]{0,30}(하나|중 하나)가 있을 때|기준으로 정해진 [^.]{0,20}(있을|올) 때/;
/** 자리·개수·함께 있음 조건(엔진이 그 사람에게 따로 판정하지 않는 조건 — P2 판독 major-1 「일주에 있을 때 가장 진하게」가 백호를 일주로 옮겼다). */
const SEAT_COUNT_COND = /(연지|월지|일지|시지|연주|월주|일주|시주|연간|월간|시간|일간 바로 옆)(에|이|가)? ?(있|오|놓|들|앉)[^.!?]{0,14}(으면|면|때|거나)|둘이면|둘 이상|셋 이상|두 개 이상|여럿이면|(과|와) 함께 (있으면|있거나|걸리면)|(가|이) (많으면|없으면|적으면)/;
/** 그 사람의 힘 세기와 맞지 않을 수 있는 조건 문장. */
const PERSON_COND = /(일간이|힘이|사주가) (강한|약한|센|여린) (사람|사주)(에게는|이라면|은|이면)/;
const STRONG_COND = /(일간|자기 기운|내 힘)[^.!?]{0,12}(감당할 힘이 있으면|강하면|세면|넉넉하면)/, WEAK_COND = /(일간|자기 기운|내 힘)[^.!?]{0,12}(모자라면|약하면|여리면|부족하면)/;
export type GeneralCtx = { readonly weak?: boolean };
/** 이름 해명 마디(「이름과 달리 건강 상태를 뜻하지 않으며,」 「이름이 거칠어도 … 예언하지 않습니다.」)는 면책 꼴이라 뗀다(뒤 마디가 남으면 그것만). */
function dropNameDisclaimer(s: string): string | null {
  if (!noticeMeaning(s) && !/(뜻하지|예언하지|말하지) 않/.test(s)) return s;
  const m = /^[^,]{4,60}?(않으며|않고|않지만|아니라|아니고),\s*/.exec(s);
  if (m) { const rest = s.slice(m[0].length); return rest.replace(/[^가-힣]/g, "").length >= 10 && !noticeMeaning(rest) ? rest : null; }
  return null;
}
export function dropGeneral(text: string, g: GeneralCtx = {}): string {
  return sentences(text).map(dropNameDisclaimer).filter((s): s is string => s !== null).filter(s => {
    if (DEFINITION.test(s) || PERSON_COND.test(s) || SEAT_COUNT_COND.test(s)) return false;
    if (/당신/.test(s)) return true;
    if (RULE_END.test(s)) return false;
    if (g.weak !== undefined && ((g.weak && STRONG_COND.test(s)) || (!g.weak && WEAK_COND.test(s)))) return false;
    return true;
  }).map(s => s.replace(/쪽으로 읽습니다/g, "쪽입니다").replace(/(으)?로 읽습니다/g, "$1로 봅니다")).join(" · ");
}

// ---------- 단위 ----------
/** 달 카드: 「…드러나는 해」 「…해예요」 → 달. 대운 카드: 「…들어오는 해입니다」 → 「…10년입니다」. */
export function unitFix(text: string, unit: "달" | "10년" | "해"): string {
  if (unit === "해") return text;
  // AM2-4 3부(P3 판독 annual-1 차단 #5·#6, 예전 card.ts:47): 자리 이름 「태어난 해」는 단위가 아니다 — 바꾸지 않는다(「태어난 해·태어난 날」 → 「태어난 달·…」 버그).
  if (unit === "달") return text.replace(/(?<=[가-힣])(?<!태어난) 해(?=$|[.,·]| ·)/g, " 달").replace(/(?<=[는은운른인던])(?<!태어난) 해(예요|입니다|이에요)/g, " 달$1").replace(/한 해 동안/g, "한 달 동안");
  return text.replace(/(?<=[는은운른인던])(?<!태어난) 해(입니다|예요|이에요)/g, (_m, e: string) => ` 10년${e === "입니다" ? "입니다" : "이에요"}`).replace(/(?<=[가-힣])(?<!태어난) 해(?=$|[.,·]| ·)/g, " 10년").replace(/한 해 동안/g, "10년 동안");
}

// ---------- 같은 문장 · 기호 ----------
export function dedupeSentences(text: string): string {
  const seen = new Set<string>(), out: string[] = [];
  for (const s of text.split(SENT)) { const k = s.replace(/[^가-힣A-Za-z0-9]/g, ""); if (k && seen.has(k)) continue; seen.add(k); out.push(s); }
  return out.join(" ");
}
/** MBTI 기능 기호(「ENTP의 Ti는」 「(Ne)」)를 뗀다. 고객 말로 바꾸는 것은 카드의 기능 줄(가장 센 쪽 …)이 맡는다. */
export function stripFnCodes(text: string, type?: string): string {
  let t = text.replace(/\s?\((Ni|Ne|Si|Se|Ti|Te|Fi|Fe)\)/g, "");
  // AM2-7 3부 1(P6 annual-p6b 「ISTJ의 Si도」 → 「ISTJ의 도」): 기능 기호 뒤 조사는 모두 유형 이름 뒤 조사로 옮긴다.
  if (type) t = t.replace(new RegExp(`${type}의 (Ni|Ne|Si|Se|Ti|Te|Fi|Fe)(는|가|은|이|도|만|를|을|와|과|의|에게|까지)?`, "g"), (_m, _f: string, j?: string) => `${type}${!j ? "의" : j === "가" || j === "이" ? "가" : j === "는" || j === "은" ? "는" : j === "를" || j === "을" ? "를" : j === "와" || j === "과" ? "와" : j}`);
  return t.replace(/(?<![A-Za-z])(Ni|Ne|Si|Se|Ti|Te|Fi|Fe)(?![A-Za-z])\s?/g, "");
}

// ---------- 장면 씨앗(3-1) ----------
/** 연차·직급 소품: 입력 직업 글에 연차·직급 말이 없으면 쓰지 않는다(AM: 20대 직장인에게 사수·막내·선배·사원증). */
export const SENIORITY_PROP = /사수|막내|선배|후배|신입|입사 동기|동기 모임|팀장|과장|부장|차장|대리|사원증|연차|인턴|수습|첫 출근|정규직 전환|승진 심사|인사 평가/;
const SEED_TIME_STRIP = /(?<![가-힣])(이번엔|이번에는|요즘|최근|요새)\s?/g;
const SEED_TIME_DROP = /(?<![가-힣])(지금|올해|오늘|어제|이번 ?(달|주|해))/;
const SEED_PAST = /몇 (달|해|년|주)째|오래 미뤄 둔|미뤄 두었던|미뤄 둔|그동안|예전부터|늘 하던|지난번|작년/;
/** 연차·직급·역할 소품(입력 직업 글에 없으면 쓰지 않는다). intake SENIORITY_PROP + 임원·부하·리더. */
const ROLE_PROP = new RegExp(`${SENIORITY_PROP.source}|임원|부하 직원|리더 자리|후임|선임`);
/** 직장 장면 낱말(직업 미입력 · 지난 대운이 만 22세 전이면 쓰지 않는다). */
export const WORKPLACE = /회사|사무실|출근|퇴근|회의|업무|보고서|결재|팀|동료|상사|월급|사원|직장|야근|거래처|인수인계|사내|명함|점심 메뉴 투표|책상 서랍/;
const HOMEMAKER = /주부|살림|집안일|장보기 목록|반찬/;
/** 앞날 장면의 결과 꼬리(건수·반응·완료를 못 박는 마디). */
const OUTCOME = /두세 개|한꺼번에 들어|반응이 [^,.]{0,10}(옵|와)|부탁이 옵|빠르게 찹|끝까지 다 채웁|처음 나옵|들어옵니다|생깁니다|늘어납니다|쏟아집니다|성공|합격|뽑힙니다|잘 팔립/;
export type SeedCtx = { readonly brief: Brief; readonly workplaceOk: boolean };
/** 「-(스)ㅂ니다.」 → 「-는 장면」(받침 ㅂ을 떼어 어간을 얻는다). 꼴이 맞지 않으면 null. */
function toScene(clause: string): string | null {
  const t = clause.trim().replace(/[.!]$/, "");
  const m = /^(.*?)([가-힣])(니다|습니다)$/.exec(t); if (!m) return /(는|ㄴ) (모습|장면|날|때|순간)$/.test(t) ? t : null;
  if (m[3] === "습니다") return `${m[1]}${m[2]}는 장면`;
  const code = m[2].charCodeAt(0) - 0xac00; if (code < 0 || code > 11171 || code % 28 !== 17) return null; // 받침 ㅂ
  const stem = String.fromCharCode(0xac00 + code - 17);
  return `${m[1]}${stem}는 장면`;
}
/** 고객 문장 꼴의 장면 씨앗만 남긴다. 뺄 것이면 null. */
export function cleanSeed(seed: string, c: SeedCtx): string | null {
  const f = c.brief.person.facts, detail = f.job.detail ?? "";
  let t = seed.replace(SEED_TIME_STRIP, "").replace(/\s{2,}/g, " ").trim();
  if (!t || SEED_TIME_DROP.test(t) || SEED_PAST.test(t)) return null;
  if (ROLE_PROP.test(t) && !ROLE_PROP.test(detail)) return null;
  const jobKnown = Boolean(f.job.status) && !/^(other|unknown|none)$/.test(f.job.status);
  if (HOMEMAKER.test(t) && f.job.status !== "homemaker") return null;
  if (WORKPLACE.test(t) && (!c.workplaceOk || !jobKnown || /^(student|unemployed|homemaker|job_seeker)$/.test(f.job.status))) return null;
  if (c.brief.person.age < 20 && /(월급|적금|출근|퇴근|회식|연봉)/.test(t)) return null;
  // 앞날 결과 꼬리: 첫 마디만 남기고 「…는 장면」으로. 남길 수 없으면 뺀다.
  if (OUTCOME.test(t)) {
    const clauses = t.split(/(?<=고|며|는데|더니),\s+|,\s+/);
    const first = clauses[0].replace(/(하)고$/, "$1는 장면").replace(/([가-힣])고$/, (_m, ch: string) => { const code = ch.charCodeAt(0) - 0xac00; if (code < 0) return `${ch}고`; const jong = code % 28; return jong === 8 ? `${String.fromCharCode(0xac00 + code - 8)}는 장면` : `${ch}는 장면`; });
    const scene = /장면$/.test(first) && !OUTCOME.test(first) ? first : toScene(first);
    if (!scene || OUTCOME.test(scene) || scene.replace(/[^가-힣]/g, "").length < 8) return null;
    t = scene;
  }
  return t;
}

// ---------- AM2-5 1부 카드 값은 고객 말로 ----------
/**
 * 명사형 끝(-함·-ㅁ·-짐)을 서술형으로(P4 판독 대운 B3 「필요함이라는 신호」 · B4 「힘이 남」 → 「힘이 남습니다」).
 * 영역 줄 원천(productEvidence DOMAIN_BY_TEN_GOD)은 4종도 쓰므로 고치지 않고, 세운·대운 작가 카드 글만 바꾼다.
 * 마디(「 · 」로 나뉜 조각) 끝 낱말만 본다. 모르는 끝은 그대로 둔다(시험 am25.test가 원천 표의 끝을 모두 덮는지 본다).
 */
const PRED_END: readonly (readonly [RegExp, string])[] = [
  [/쉬움$/, "쉬워요"], [/좋음$/, "좋아요"], [/필요함$/, "필요해요"], [/(?<=[가-힣])해짐$/, "해져요"], [/(?<=[가-힣])어짐$/, "어져요"], [/(?<=[가-힣])워짐$/, "워져요"], [/(?<=[가-힣])커짐$/, "커져요"],
  [/(?<=[가-힣])쳐짐$/, "쳐져요"], [/(?<=[가-힣])짐$/, "져요"], [/(?<=잘 )됨$/, "돼요"], [/(?<=[가-힣 ])됨$/, "돼요"], [/(?<=(힘|기운|활기|신)이 )남$/, "나요"], [/늘어남$/, "늘어나요"], [/드러남$/, "드러나요"], [/생김$/, "생겨요"],
  [/쌓임$/, "쌓여요"], [/실림$/, "실려요"], [/붙음$/, "붙어요"], [/맞음$/, "맞아요"], [/따라옴$/, "따라와요"], [/(?<= )줌$/, "줘요"], [/모임$/, "모여요"], [/보임$/, "보여요"], [/잡힘$/, "잡혀요"],
  [/흔들림$/, "흔들려요"], [/바뀜$/, "바뀌어요"], [/많음$/, "많아요"], [/몰림$/, "몰려요"], [/열림$/, "열려요"], [/풀림$/, "풀려요"], [/옴$/, "와요"],
];
export function predicate(text: string): string {
  return text.split(/( · )/).map(seg => { if (seg === " · ") return seg; const t = seg.trimEnd(); const hit = PRED_END.find(([re]) => re.test(t)); return hit ? t.replace(hit[0], hit[1]) : seg; }).join("");
}
/** 중의 값 고침(P4 판독 대운 B4 「힘이 남」 · B6 D38 「날이 되기도」): 원천이 4종과 함께 쓰는 값은 카드 글에서만 바꾼다. */
export const unambiguous = (t: string) => t.replace(/의욕이 되기도 날이 되기도/g, "의욕이 되기도 날카로움이 되기도").replace(/(?<=[가-힣]) 장면$/g, " 때").replace(/(?<=[가-힣]) 장면(?= · )/g, " 때");
/**
 * 카드 뜻 안의 처방 꼬리(P4 판독 세운 경미 #7~#17: Y19 「· 시간 대비 남는 돈 따지기」 Y23 「· 장바구니는 하루 묵혀 두기」 M29 「· 처음부터 분명히」 —
 * 작가가 꼬리를 옮겨 처방 배분을 넘었다). 처방은 설계도 사전 배분으로만 준다(덕짱님 결정 14-7 3번).
 * - 둘째 마디부터 행동 꼴(「…기」 「…하기」 「…로」 「…먼저」 「…따로」 「…분명히」 「…넘기기」)이면 뗀다.
 * - 문장 끝 권유(「…세요」 「…편이 맞습니다·좋습니다·낫습니다」)도 뗀다(원국 특성 줄의 「하나를 끝낸 뒤 다음 불을 붙이세요」).
 */
// AM2-6 3부: 「시기 · 계기 · 분위기」처럼 「기」로 끝나는 명사는 행동 꼬리가 아니다(D7 「내 이름으로 서는 시기」가 떨어져 큰 줄기 줄에 나이만 남았다).
const RX_SEG = /((?<!(?:시|계|분위|용|열|온|인|경|향|무|위|전|후|중|초|주|동|생|일|도|전성|활|기|원|패|뒷심|용|자|객|감))기|하기|두기|보기|내기|넘기기|따지기|다듬기|읽기|정하기|줄이기|살피기|지키기|나누기|미루기|않기|말기|먼저|따로|분명히|(으)?로|게|부터|말고)$/;
const RX_SENT = /(세요|보세요|두세요|마세요|해 보세요)[.!]?$|편이 (맞|좋|낫)(습니다|아요|어요)[.!]?$/;
export function stripRx(text: string): string {
  const segs = text.split(" · ");
  const kept = segs.filter((s, i) => i === 0 || !(RX_SEG.test(s.trim()) && s.trim().length <= 40)).map(s => s.split(/(?<=[.!?])\s+/).filter((x, j, all) => !(RX_SENT.test(x.trim()) && (all.length > 1 || segs.length > 1))).join(" ")).filter(s => s.trim());
  return kept.join(" · ");
}


// ---------- AM2-6 3부 입력 거름: 장면 씨앗 조건 꼬리표 · 행동 꼴 → 조건 꼴 · 카드 줄 조건 꼴 ----------
/**
 * 장면 씨앗의 조건 꼬리표(덕짱님 지시 AM2-6 3부): 씨앗 글에서 엔진이 읽는다(지식 DB 씨앗 · 엔진 장면 · 장 장면 힌트 모두 같은 표).
 * - 관계 상태: 솔로 전제(소개팅 · 썸 · 고백 · 첫 만남) · 연인 전제(연인 · 데이트 · 기념일) · 기혼 전제(배우자 · 시댁 · 부부)
 * - 일: 직장인 전제(회의 · 사무실 · 출근 · 퇴근 · 결재 · 상사 · 동료 · 월급 · 회식) · 사업·프리랜서 전제(거래처 · 견적 · 외주 · 클라이언트) · 학생 전제(수업 · 시험 · 과제 · 학교)
 * - 필요한 상세: 가게 · 매장 · 셔터 · 손님 · 오픈 준비 · 단골(일 상세가 그 꼴일 때만 — 하는 일을 모르면 쓰지 않는다)
 */
export const SEED_TAGS: readonly { readonly tag: string; readonly re: RegExp }[] = [
  { tag: "rel:single", re: /소개팅|(?<![가-힣])썸(?![가-힣])|썸 (상대|단계|타는)|고백|첫 만남|소개받|데이트 신청|짝사랑|애프터|새 인연|인연이 생기|프로필 사진|소개팅 앱/ },
  { tag: "rel:partner", re: /연인|애인|남자친구|여자친구|데이트(?! 신청)|기념일|커플/ },
  { tag: "rel:married", re: /배우자|남편|아내|와이프|시댁|처가|시부모|부부|신혼|결혼기념일/ },
  { tag: "job:employee", re: /회의|사무실|출근|퇴근|결재|상사|팀장|동료|월급|회식|사내|야근|보고서|부서|인사팀|사원증|점심시간/ },
  { tag: "job:work", re: /거래처|견적|외주|클라이언트|납품|의뢰인|발주|계약서/ },
  { tag: "job:student", re: /수업|시험|과제|학교|교수|동아리|학기|강의실|기숙사|학점|중간고사|기말고사/ },
  { tag: "detail:shop", re: /가게|매장|셔터|손님|오픈 준비|단골|장사|계산대|진열|포장 주문|영업 시작|마감 정산/ },
  { tag: "children", re: /(?<![가-힣])(아이|아들|딸)(가|를|와|랑|의|에게|는|도|들)?(?![가-힣])|자녀|육아|어린이집|유치원|학부모/ },
];
export const seedTagsOf = (text: string, base: { rel?: string; job?: string; ctx?: readonly string[] } = {}): string[] => {
  const tags = SEED_TAGS.filter(t => t.re.test(text)).map(t => t.tag);
  if (base.rel === "partner") tags.push("rel:partner");
  if (base.job === "employed") tags.push("job:employee"); else if (base.job === "business") tags.push("job:work"); else if (base.job === "student") tags.push("job:student");
  for (const c of base.ctx ?? []) tags.push(c === "office" || c === "team" ? "job:employee" : c === "shop" ? "detail:shop" : c === "freelance" ? "job:work" : `detail:${c}`);
  return [...new Set(tags)];
};
/** 꼬리표가 이 사람 입력과 맞는지. 미입력은 어느 전제도 받지 않는다(모르는 사실을 전제하지 않는다). */
export function seedTagsFit(tags: readonly string[], f: Brief["person"]["facts"]): boolean {
  const job = f.job.status, detail = f.job.detail ?? "";
  for (const t of tags) {
    if (t === "rel:single" && f.relationship !== "single") return false;
    if (t === "rel:partner" && !/^(dating|married)$/.test(f.relationship)) return false;
    if (t === "rel:married" && f.relationship !== "married") return false;
    if (t === "job:employee" && job !== "employee") return false;
    if (t === "job:work" && !/^(self_employed|business_owner|freelancer)$/.test(job)) return false;
    if (t === "job:student" && job !== "student" && f.job.class !== "student") return false;
    if (t === "detail:shop" && !/가게|매장|카페|식당|숍|샵|점포|장사|요식|판매/.test(detail)) return false;
    if (t.startsWith("detail:") && t !== "detail:shop" && !detail) return false;
    if (t === "children" && f.children !== "has") return false;
  }
  return true;
}
/** 행동 꼴 씨앗(「…제안하기」 「…돕기」)을 조건 꼴(「…제안할 때」 「…도울 때」)로. 그 밖의 꼴은 그대로. */
export function seedAsCondition(text: string): string {
  const t = text.trim().replace(/[.!]$/, "");
  const m = /^(.*?)([가-힣])기$/.exec(t); if (!m || /(시기|계기|분위기|용기|일기|날씨)$/.test(t)) return t;
  const [, head, last] = m; const code = last.charCodeAt(0) - 0xac00; if (code < 0 || code > 11171) return t;
  const jong = code % 28, base = code - jong;
  const IRR_B: Readonly<Record<string, string>> = { 돕: "도울", 굽: "구울", 눕: "누울", 줍: "주울", 덥: "더울", 춥: "추울", 쉽: "쉬울", 무섭: "무서울", 어렵: "어려울", 반갑: "반가울", 즐겁: "즐거울", 가볍: "가벼울", 무겁: "무거울" };
  const IRR_D: Readonly<Record<string, string>> = { 듣: "들을", 걷: "걸을", 묻: "물을", 싣: "실을", 깨닫: "깨달을" };
  const stem = `${head.slice(-2)}${last}`.slice(-2), one = last;
  const irr = IRR_B[stem] ?? IRR_B[one] ?? IRR_D[stem] ?? IRR_D[one];
  if (irr) { const cut = (IRR_B[stem] ?? IRR_D[stem]) ? 2 : 1; return `${`${head}${last}`.slice(0, -cut)}${irr} 때`; }
  if (jong === 0) return `${head}${String.fromCharCode(0xac00 + base + 8)} 때`; // 받침 없음 → ㄹ 받침
  if (jong === 8) return `${head}${last} 때`; // ㄹ 받침(만들기 → 만들 때)
  return `${head}${last}을 때`;
}
/** 카드 줄의 연애 조건 꼴을 입력에 맞춘다(「만나는 사람이 있다면」 → 연애 중 「연인과는」 · 솔로 「새 인연을 만난다면」 · 기혼 「배우자와는」). 미입력은 조건 꼴 그대로. */
export function relCondition(t: string, rel: string): string {
  const to = rel === "dating" ? "연인과는" : rel === "married" ? "배우자와는" : rel === "single" ? "새 인연을 만난다면" : null;
  // 「함께하는 사람」(살림·생활비를 함께하는 짝)은 솔로에게는 조건 꼴 그대로 둔다(새 인연 조건으로 바꾸면 살림 줄이 어긋난다).
  if (!to) return t;
  const out = t.replace(/(만나는|사귀는|곁에 있는) 사람이 있다면/g, to);
  return rel === "single" ? out : out.replace(/함께하는 사람이 있다면/g, to);
}
/** 직장 전제 말(월급 · 직함 · 윗사람 · 상사 · 회사)이 든 카드 마디 — 직장인이 아니면 그 마디를 뺀다(AM2-6 3부). */
export const EMPLOYEE_PREMISE = /월급|직함|윗사람|상사|팀장|회사|연봉|승진|부서|사내|인사 평가|결재/;
/** 카드 값의 「-던」 전제(「지키던 내 자리」 「머릿속에만 두던 재능」)와 풀이 없는 용어(일지 · 월지 · 일간)를 고객 말로. */
export function plainCard(t: string): string {
  return t.replace(/(지키|두|하|쌓|모으|미루|붙잡|쓰|놓|품|숨기|참|버티|기르|다지|가꾸|아끼|감추|누르|삼키|삭이|꿈꾸|바라|그리)던(?=\s)/g, "$1는")
    .replace(/(지켜|쌓아|해|모아|이어|길러|다져|가꿔|만들어|버텨) 온(?=\s)/g, "$1 가는")
    .replace(/(?<![가-힣])일지(?=[ 의는가에와인를을이도])/g, "태어난 날 땅 글자").replace(/(?<![가-힣])월지(?=[ 의는가에와인를을이도])/g, "태어난 달 땅 글자")
    .replace(/(?<![가-힣])연지(?=[ 의는가에와인를을이도])/g, "태어난 해 땅 글자").replace(/(?<![가-힣])시지(?=[ 의는가에와인를을이도])/g, "태어난 시각 땅 글자")
    .replace(/(?<![가-힣])일간(이|은|을|과|이라|의|에| )/g, (_m, j: string) => `타고난 바탕 글자${({ 이: "가", 은: "는", 을: "를", 과: "와", 이라: "라" } as Record<string, string>)[j] ?? j}`);
}

/**
 * AM2-7 3부 1 짝 글 빌드 검사: 유형 이름 뒤가 비거나(「ISTJ의 도」 「ESTP의 ·는」) 조사만 남은 글, 이유 이름(공통 · 보완 · 긴장)과 글 방향이 어긋난 글.
 * 이유 방향: 긴장 글은 「→ · 쉬움 · 쉽다 · 함정 · 늦게 · 부딪 · 어긋 · 놓치」 같은 말이 있다. 공통 · 보완인데 이 말뿐이면 어긋남.
 */
export function pairTextIssue(why: string, type: string, reason: string): string | null {
  if (new RegExp(`${type}의 ?(도|는|은|가|이|를|을|만|와|과|·)(\\s|$)|(^|\\s)(의|는|은|가|이|를|을|도)\\s(는|은|가|이|도|·)`).test(why) || /(^|\s)·\s?(는|은|가|이|도)/.test(why)) return "유형 이름 뒤 빈 자리";
  if (why.replace(/[^가-힣]/g, "").length < 8) return "글이 너무 짧다";
  const tense = /→|쉬움|쉽다|쉬워|함정|늦게|부딪|어긋|놓치|흔들|지치/.test(why), plus = /채워|맞아|살아|힘이 되|겹쳐|같은 쪽|잘 맞|빛나/.test(why);
  if ((reason === "공통" || reason === "보완") && tense && !plus) return `이유 「${reason}」인데 글은 긴장 쪽`;
  return null;
}
