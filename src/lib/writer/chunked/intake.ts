/**
 * AM2 1부 — 입력 정화: 세운·대운 작가에게 「베껴도 안전한 브리프」를 만든다(결정론, 호출 0).
 * - 근거 카드를 주체별로 나눈다(원국 / 대운 / 세운 / 월운 / MBTI / 고객 입력). 줄마다 엔진 값 + 쉬운 뜻 + 쓸 수 있는 장.
 * - 명리 × MBTI 연결은 「명리 근거 id + MBTI 근거 id + 연결 이유」 짝으로만 준다(짝 없는 연결은 쓰지 못하게 한다).
 * - 브리프 본문에는 고객에게 그대로 나가도 되는 말만 둔다: 제약(note·rule·forbiddenFacts)·내부 약어·라벨·점수·한자·화살표는 뺀다.
 *   제약은 작가 시스템 규칙(prompt.ts) 한 곳에만 있다.
 * - 시점: 「지금·올해·이번 달」을 쓰지 않고 날짜는 절대값(「2027년 정미년」「5월 · 을사월」).
 * - 입력에 맞지 않는 장면·소품(연차 소품·연애 상태·자녀·직업과 부딪치는 씨앗)은 여기서 거른다.
 * 기존 브리프(buildBrief)는 그대로 쓰고, 작가에게 보이는 글만 새로 짓는다(엔진·지식 DB·장 구성 유지).
 *
 * AM2-3(2026-11-12) 근본 고침 — 카드(근원 데이터)를 고객 문장 기준으로:
 * - 1-1 작가에게 key(2027-M04)를 보이지 않는다. key마다 이름(「5월 · 을사월」)과 카드 줄 범위(M65~M75)를 둔다(prompt.ts가 이름으로만 보인다).
 * - 1-2 흐름은 서술형 값(「흐름이 느린 편」, 숫자 X/5 없음) · 화살표 없음 · 달 카드의 「…해」 → 「…달」 · 대운 카드의 「…해입니다」 → 「…10년입니다」.
 * - 1-3 관계는 모두(공망 포함) 엔진 뜻 한 줄 + 자리. 신살·운성은 자리를 값으로(「백호대살(태어난 달 · 임술)」), 일반론 줄(「…있을 때 봅니다」)은 뺀다.
 * - 1-4 같은 십성 달·해의 뜻 줄이 글자까지 같으면 두 번째부터는 「앞의 ○와 같은 뜻 — 달라지는 것: 관계·흐름」. 달 표시 없는 월운 줄 금지.
 * - 1-7 거주·가족 전제 줄(「부모 곁을 떠나」)은 입력이 없으니 뺀다.
 * - 2-2 짝은 양쪽 근거가 모두 허용된 장에만(쓰는 장 = 두 줄의 쓰는 장 교집합, 없으면 짝을 뺀다). 연결 뜻 없는 짝(B 줄 복사·다음 대운 주제)은 만들지 않는다.
 * - 2-3 장마다 허용 근거(allowed). 핵심 주장과 되풀이 금지가 같은 근거를 동시에 가리키면 그 근거를 금지 쪽 장에서 뺀다.
 * - 2-4 key마다 반드시 쓸 줄(must): 흐름 단어 · 관계 · 부족한 기운을 채우는 줄.
 * - 3-1 장면 씨앗 정리(card.ts cleanSeed) · 같은 씨앗을 두 장에 쓰지 않는다. 3-2 소망 원문은 렌더 단계가 넣는다(작가는 «바람» 표시만).
 */
import type { Knowledge } from "@/lib/brief/knowledge";
import type { Brief, Material, TimelineEntry } from "@/lib/brief/schema";
import { FLOW_DESC, FLOW_TALK, FLOW_WORD, POSITION_KO } from "@/lib/brief/labels";
import { JOB_ASSUME, type WriterChapter } from "../prompt";
import { FARMING, presumedPartner } from "../safety/lint";
import { RURAL_PROP } from "../safety/patterns";
import { readWish } from "@/lib/brief/design/annual";
import { cleanSeed, dedupeSentences, dropGeneral, SENIORITY_PROP, stripFnCodes, unitFix } from "./card";

export type Subject = "natal" | "dayun" | "year" | "month" | "mbti" | "input";
export const SUBJECT_KO: Readonly<Record<Subject, string>> = { natal: "원국(타고난 사주)", dayun: "대운", year: "세운(그 해)", month: "월운(그 달)", mbti: "MBTI", input: "고객 입력" };
const PREFIX: Readonly<Record<Subject, string>> = { natal: "N", dayun: "D", year: "Y", month: "M", mbti: "B", input: "I" };
/** 근거 한 줄: 엔진 값 + 쉬운 뜻 + 쓸 수 있는 장(장 번호). */
export type Line = { readonly id: string; readonly subject: Subject; readonly value: string; readonly meaning: string; readonly use: readonly number[] };
/** 명리 × MBTI 짝. 이 짝만 한 문장 안에서 잇는다. use = 두 줄 모두 허용된 장. */
export type Pair = { readonly id: string; readonly myeongri: string; readonly mbti: string; readonly why: string; readonly use?: readonly number[] };
/** key에서 반드시 쓸 것(2-4): 이름과 본문에서 찾을 꼴(정규식 원문). */
export type MustItem = { readonly what: string; readonly re: string };
/** 반복 장 key 하나(세운 달·대운 연도): 그 시기 카드. head는 시스템이 첫 문장으로 넣는 머리 문장(작가는 되풀이하지 않는다). */
export type KeyPlan = { readonly key: string; readonly label: string; readonly head: string; readonly when: "past" | "current" | "future"; readonly lines: readonly string[]; readonly claims: readonly string[]; readonly depth?: "deep" | "short"; readonly scene?: string; readonly todo?: string; readonly range?: string; readonly must?: readonly MustItem[] };
export type SectionPlan = { readonly q: string; readonly lines: readonly string[]; readonly angle?: string; readonly claims: readonly string[]; readonly claimIds?: readonly string[]; readonly recapIds?: readonly string[]; readonly scene?: string };
export type ChapterPlan = {
  readonly n: number; readonly id: string; readonly title: string; readonly question: string;
  readonly target: readonly [number, number]; readonly useName: boolean;
  readonly sections?: readonly SectionPlan[]; readonly keys?: readonly KeyPlan[];
  /** 이 장의 핵심 주장(엔진 값에서). 다른 장은 되풀이하지 않는다. */
  readonly claims: readonly string[];
  /** 다른 장이 쓰는 주장 가운데 이 장과 근거가 겹치는 것(반복 금지). */
  readonly avoid: readonly string[];
  /** 장면 씨앗 1~2개(입력으로 거른 생활 소품). */
  readonly scenes?: readonly string[];
  /** 2-3 이 장에서 쓸 수 있는 근거 id(절·key 근거의 합). */
  readonly allowed?: readonly string[];
};
export type Intake = { readonly product: "annual_fortune" | "major_fortune"; readonly person: readonly string[]; readonly lines: readonly Line[]; readonly pairs: readonly Pair[]; readonly chapters: readonly ChapterPlan[]; readonly wish?: string;
  /** 2-1 근거가 없어 뺀 절(기록). */ readonly droppedPlan?: readonly string[];
  /** 엔진이 대운을 계산하지 못한 대운 책(출생 시각 미상 일부 — 계산은 보호 대상, 결정 필요로 보고). */ readonly noDayun?: boolean };

/** 작가가 소망을 인용할 때 쓰는 표시(3-2). 렌더 단계가 원문 «…»으로 바꾼다. */
export const WISH_MARK = "«바람»";

// ---------- 글 정리(고객 문장 꼴) ----------
const READING: Readonly<Record<string, string>> = { 甲: "갑", 乙: "을", 丙: "병", 丁: "정", 戊: "무", 己: "기", 庚: "경", 辛: "신", 壬: "임", 癸: "계", 子: "자", 丑: "축", 寅: "인", 卯: "묘", 辰: "진", 巳: "사", 午: "오", 未: "미", 申: "신", 酉: "유", 戌: "술", 亥: "해", 木: "목", 火: "화", 土: "토", 金: "금", 水: "수", 正: "정", 偏: "편", 官: "관", 財: "재", 印: "인", 食: "식", 神: "신", 傷: "상", 比: "비", 肩: "견", 劫: "겁", 胎: "태", 月: "월" };
const noHanja = (t: string) => t.replace(/\s?\(([^()]*[一-鿿][^()]*)\)/g, (_a, inner: string) => { const kept = inner.replace(/[一-鿿]+\s?/g, "").replace(/^[\s·,:]+|[\s·,:]+$/g, ""); return kept ? `(${kept})` : ""; })
  .replace(/[一-鿿]+/g, m => [...m].map(ch => READING[ch] ?? "").join(""));
/** 시점 말(지금·올해·이번 달)을 뜻이 같은 말로 바꾸거나 뗀다(브리프 글만 — 작가 원고에는 쓰지 않는다). */
export function untime(t: string, year?: number): string {
  return t.replace(/지금 이 순간/g, "눈앞의 순간").replace(/지금(보다|처럼|만큼)/g, "눈앞의 일$1").replace(/(?<![가-힣])당장 /g, "눈앞의 ").replace(/지금(?=(을|이|의|도|에) )/g, "이 순간").replace(/지금까지(는|도)?/g, (_m, j?: string) => `그동안${j === "는" ? "은" : j ?? ""}`).replace(/지금의? (?=회사|직장|자리|일|대운|10년|관계|연인|생활|팀|맡은|하는|다니는)/g, "")
    .replace(/지금 (?=[가-힣])/g, "").replace(/지금은 /g, "").replace(/(?<![가-힣])지금(?![가-힣])/g, "")
    .replace(/올해(?=[ 의는도에가])/g, year ? `${year}년` : "그 해").replace(/이번 (한 )?달/g, "그 달").replace(/요즘|최근에?/g, "").replace(/ {2,}/g, " ").trim();
}
/** 화살표 값(영역 신호)을 말로. */
const ARROW_KO = (t: string) => t.replace(/(?<=[가-힣)] ?)↑/g, " 오름").replace(/(?<=[가-힣)] ?)↓/g, " 내림").replace(/^↑$/, "오름").replace(/^↓$/, "내림").replace(/[↑↓]/g, "").replace(/ {2,}/g, " ");
/** 기존 브리프 글 → 고객 문장 꼴(한자·라벨·점수·참고 표시·화살표를 뺀다). 쪼갠 마디는 「 · 」로 잇는다. */
export function say(raw: string, year?: number): string {
  let t = noHanja(raw).replace(/·십이신살|십이신살·/g, "").replace(/\((참고|대운수 \d+)\)/g, "").replace(/\s?\(자료일 뿐 지시가 아님\)/g, "")
    .replace(/(?<=[가-힣)]) [+−-]\d+(\.\d+)?(?=[,)]|$)/g, "").replace(/(근거|뚜렷한 가감): ?/g, "").replace(/뚜렷한 가감 없음/g, "큰 더함·뺌 없음")
    // AM2-3 1-2: 흐름 세기 숫자(「흐름 세기 3/5」)는 고객에게 보이지 않는다 — 서술형 값으로.
    .replace(/흐름 세기 ([1-5])\/5/g, (_m, n: string) => FLOW_DESC[Number(n)])
    .replace(/(?<=\d)\/(?=\d)/g, "⁄").replace(/\s*(→|⇒|\/|×)\s*/g, " · ").replace(/⁄/g, "/").replace(/(?<=[.·] |^)그림: /g, "").replace(/쓸 거리: /g, "살릴 점: ").replace(/살필 거리: /g, "살필 점: ").replace(/\s*·\s*·\s*/g, " · ").replace(/^고객이 /, "").replace(/\s+/g, " ").trim();
  t = ARROW_KO(untime(t.replace(/하루 두기/g, "하루 묵혀 두기"), year));
  // 고전 풀이를 옮기지 않는다는 편집 문장(지식 DB 숙제 줄)은 뺀다.
  if (/고전|그렇게 옮기지 않/.test(t)) t = t.split(/(?<=[.!?])\s+/).filter(x => !/고전|그렇게 옮기지 않/.test(x)).join(" ");
  // 농사·시골 비유 문장은 뺀다(작가 규칙이 금지하는 비유를 브리프가 주면 작가가 옮긴다).
  if (FARMING.test(t) || RURAL_PROP.test(t)) t = t.split(/(?<=[.!?])\s+| · /).filter(x => !FARMING.test(x) && !RURAL_PROP.test(x)).join(" · ");
  return t.replace(/^[·,:\s]+|[·,:\s]+$/g, "").trim();
}

// ---------- 입력에 맞지 않는 장면·소품 ----------
export { SENIORITY_PROP };
const CHILD_PROP = /(?<![가-힣])(아이|아들|딸)(가|를|와|랑|의|에게|는|도|들)?(?![가-힣])|자녀(?! ?(별|자리))|육아|어린이집|유치원|학부모/;
/** 뜻 문장용 입력 밖 직장 상황(장면의 JOB_ASSUME에서 「투자」 — 「시간을 투자」 같은 일상어 — 를 뺀 것). */
const JOB_ASSUME_MEANING = /팀원|팀 (회의|미팅)|주간 팀|직원|채용|면담|평가 시즌|실적|사업자 통장/;
/** AM2-3 1-7: 거주·가족 형태 전제(입력 폼에 거주 정보가 없다). */
export const RESIDENCE_PREMISE = /부모 곁을 떠나|부모님 집을 나와|본가를 떠나|분가|자취를 시작|독립해 나와/;
export function sceneFits(s: string, brief: Brief, meaning = false): boolean {
  const f = brief.person.facts, detail = f.job.detail ?? "";
  if (SENIORITY_PROP.test(s) && !SENIORITY_PROP.test(detail)) return false;
  { const m = s.match(meaning ? JOB_ASSUME_MEANING : JOB_ASSUME); if (m && !detail.includes(m[0])) return false; }
  if (presumedPartner(s, f.relationship)) return false;
  if (CHILD_PROP.test(s) && f.children !== "has") return false;
  if (f.job.class !== "student" && /학교|수업|담임|학기|시험지|성적표|모의고사|학원/.test(s)) return false;
  if (/(사업장|매장|손님|직원|매출)/.test(s) && !/^(self_employed|business_owner)$/.test(f.job.status)) return false;
  if (RESIDENCE_PREMISE.test(s)) return false;
  return true;
}

// ---------- 주체 분류 ----------
const ANNUAL_SUBJECT: Readonly<Record<string, Subject>> = { yearCard: "year", yearEnergy: "year", yearMbti: "year", wishLink: "input", wish: "input", wishTiming: "month", loveYear: "year", loveMonths: "month", moneyIn: "year", moneyHole: "month", workYear: "year", workCriteria: "month", studyYear: "year", helpers: "year", carePeople: "year", mindPush: "year", mindRest: "month", useDo: "year", useAvoid: "year", lucky: "natal", samjae: "year", dayunBridge: "dayun" };
const MAJOR_SUBJECT: Readonly<Record<string, Subject>> = { dayunHow: "dayun", lifetime: "dayun", pastSummary: "year", pastDayun: "dayun", nowTheme: "dayun", nowRelation: "dayun", nowCards: "dayun", turnWhen: "dayun", turnMind: "dayun", mapWorkMoney: "dayun", mapLovePeople: "dayun", mapMindMove: "dayun", growthCurve: "mbti", growthDayun: "dayun", ageGrowth: "dayun", ageNext: "dayun", planNear: "year", planFar: "year" };
const MONTH_IN = /(1[0-2]|[1-9])월 · [갑을병정무기경신임계][자축인묘진사오미신유술해]월|[갑을병정무기경신임계][자축인묘진사오미신유술해]월/;
const subjectOfFact = (key: string, fact: string, product: Intake["product"]): Subject => {
  if (/^(적어 준|연애 상태|일 상황|고객이|바람)/.test(fact)) return "input";
  if (/달: |달은 /.test(fact) && !/대운/.test(fact)) return "month";
  if (/^\d{4}년 [가-힣]{2}년의/.test(fact)) return "year";
  if (/대운/.test(fact) && !/^이 해/.test(fact)) return "dayun";
  const s = (product === "annual_fortune" ? ANNUAL_SUBJECT : MAJOR_SUBJECT)[key] ?? (product === "annual_fortune" ? "year" : "dayun");
  // AM2-3 1-4(P2 판독 annual-1 M6 「기분 따라 지르는 소비가 늘기 쉬운 쪽」 — 달 표시가 없는 월운 줄을 작가가 2·3월에 묶었다): 달 이름이 없으면 그 해 줄.
  return s === "month" && !MONTH_IN.test(fact) ? "year" : s;
};
/** 사실 줄을 「값」과 「뜻」으로 나눈다(앞 마디가 이름·값이면 값, 나머지는 뜻). */
function split(fact: string): { value: string; meaning: string } {
  const m = fact.match(/^([^:—]{2,40})(?::| —) (.+)$/);
  return m ? { value: m[1].trim(), meaning: m[2].trim() } : { value: fact, meaning: "" };
}
/** 브리프 근거 줄 가운데 작가에게 줄 필요가 없는 지시 꼴(「짧게 읽는 해」 등). */
const DIRECTIVE_FACT = /^(짧게 읽는 해|연애 상태 미입력|일 상황 미입력|고객이 마음이 많이 힘든)|단정하지 않는다|지시가 아님|쓰지 않는다/;
const DOMAIN_KO: Readonly<Record<string, string>> = { love: "연애 쪽", marriage: "결혼·가족 쪽", work: "일 쪽", money: "돈 쪽", study: "공부 쪽", relationships: "사람 사이", alone: "혼자 있을 때", family: "가족 쪽" };
const SIGNAL_KO = (a: string) => (a === "↑" ? "오름" : a === "↓" ? "내림" : "보통");
const DOMAIN_SIGNAL: Readonly<Record<string, string>> = { love: "연애", money: "돈", work: "일", people: "사람", mind: "마음" };
const ELEMENT_SAY: Readonly<Record<string, string>> = { WOOD: "나무(목)", FIRE: "불(화)", EARTH: "흙(토)", METAL: "쇠(금)", WATER: "물(수)" };
const ELEMENT_RE: Readonly<Record<string, string>> = { WOOD: "나무|목 기운|목\\(|(?<![가-힣])목(?=[이을의과])", FIRE: "불|화 기운|화\\(|(?<![가-힣])화(?=[이을의과])", EARTH: "흙|토 기운|토\\(|(?<![가-힣])토(?=[이을의과])", METAL: "쇠|금 기운|금\\(|(?<![가-힣])금(?=[이을의과])", WATER: "물|수 기운|수\\(" };
/** 삼합 국 이름의 다른 꼴(「해묘미 반합」 「나무의 기운이 반쯤 묶여」) — 반드시 쓸 것 검사가 같은 것으로 본다. */
const GUK_ALIAS: Readonly<Record<string, string>> = { 목국: "해묘미|해묘|묘미|해미|나무의 기운이 (반쯤 )?묶", 화국: "인오술|인오|오술|인술|불의 기운이 (반쯤 )?묶", 금국: "사유축|사유|유축|사축|쇠의 기운이 (반쯤 )?묶", 수국: "신자진|신자|자진|신진|물의 기운이 (반쯤 )?묶" };
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/** 작가에게 보이는 key 이름(1-1): 달 = 「5월 · 을사월」(절입 날짜·다리 꼬리 뺌), 해 = 「2027년 정미년」. 가짜 작가·파서도 이 함수를 쓴다. */
export const keyLabelOf = (e: Pick<TimelineEntry, "kind" | "key" | "label" | "ganji">) => (e.kind === "month" ? e.label.split(" (")[0] : `${e.key}년 ${e.ganji.hangul}년`);

export function buildIntake(brief: Brief, k: Knowledge, plan: readonly WriterChapter[], wishRaw?: string): Intake {
  const product = brief.product as Intake["product"];
  const year = product === "annual_fortune" ? Number(brief.timeline?.entries.find(e => e.kind === "year")?.key) || brief.chart.thisYear.year : brief.chart.thisYear.year;
  const lines: Line[] = [], pairs: Pair[] = [];
  const counter: Record<Subject, number> = { natal: 0, dayun: 0, year: 0, month: 0, mbti: 0, input: 0 };
  const byText = new Map<string, Line>();
  const use = new Map<string, Set<number>>();
  // 뜻 문장도 입력에 맞지 않는 상황(연차·팀원·직원·자녀·연인 전제·학교·거주 전제)이면 그 마디만 뺀다. 일반론(이 사람에게 해당하는지 모르는 규칙 문장)도 뺀다.
  const fits = (t: string) => t.split(/(?<=[.!?])\s+| · /).filter(x => sceneFits(x, brief, true)).join(" · ");
  const add = (subject: Subject, value: string, meaning = "", n?: number): string | null => {
    const unit = subject === "month" ? "달" : subject === "dayun" ? "10년" : "해";
    const v = unitFix(say(value, year), unit), m = unitFix(dropGeneral(fits(say(meaning, year)), { weak: /WEAK/.test(brief.chart.strength.level) }), unit);
    if (!v || v.length < 2) return null;
    const sig = `${subject}|${v}|${m}`;
    let l = byText.get(sig);
    // 같은 주체에 이미 같은 말(공백·부호 뺀 글이 포함됨)이 있으면 그 줄을 쓴다(세운 근거 둘이 같은 대운 줄을 따로 가진다).
    if (!l) { const key = `${v}${m}`.replace(/[^가-힣0-9]/g, ""); if (key.length >= 8) l = lines.find(x => x.subject === subject && `${x.value}${x.meaning}`.replace(/[^가-힣0-9]/g, "").includes(key)); }
    if (!l) { l = { id: `${PREFIX[subject]}${++counter[subject]}`, subject, value: v, meaning: m, use: [] }; byText.set(sig, l); lines.push(l); use.set(l.id, new Set()); }
    if (n) use.get(l.id)!.add(n);
    return l.id;
  };
  const c = brief.chart;
  // 원국(장에 배정된 것 + 바탕).
  const natalBase = [
    add("natal", `타고난 바탕: ${c.dayMaster.name}`, c.coreImage.meaning ?? ""),
    add("natal", `내 힘의 세기: ${c.strength.label}`, c.strength.reading),
    add("natal", `가장 강한 기운: ${c.elements.strongest.name}(${c.elements.strongest.level})`, ""),
    add("natal", `가장 약한 기운: ${c.elements.weakest.name}(${c.elements.weakest.level})`, ""),
    c.groups ? add("natal", "다섯 힘의 세기", c.groups.line.split(" — ")[0]) : null,
    add("natal", `음양: 양 ${c.yinYang.yang} · 음 ${c.yinYang.yin}`, c.yinYang.reading ?? ""),
  ].filter(Boolean) as string[];
  const traitId = new Map<string, string>();
  const SEAT_KO: Readonly<Record<string, string>> = POSITION_KO;
  for (const t of brief.traits) {
    if (!t.chapters.length) continue;
    // AM2 P2 판독(major-1 3장 「갑인일주의 백호대살」, 카드는 태어난 달): 자리를 값으로(AM2-3 1-3: 「백호대살(태어난 달 · 임술)」), 지식 DB 일반론(「…있을 때 봅니다」)은 뺀다.
    const seat = t.positionNote?.match(/^(태어난 (?:해|달|날|시각)) 자리/)?.[1] ?? (/^(shinsal|twelveStage|noble|relation)/.test(t.featureId) && t.positions.length === 1 ? SEAT_KO[t.positions[0]] : undefined);
    const posOf = Object.entries(SEAT_KO).find(([, ko]) => ko === seat)?.[0] as keyof typeof c.pillars | undefined;
    const ganji = posOf ? (c.pillars as Record<string, { hangul: string } | undefined>)[posOf]?.hangul : undefined;
    const general = (x: string) => x.split(/(?<=[.!?])\s+/).filter(y => !/(일주|월주|연주|시주|일지|월지|연지|시지)에 (있을 때|있으면|오면|놓이면)/.test(y)).join(" ");
    const id = add("natal", `${t.name}${seat ? `(${seat}${ganji ? ` · ${ganji}` : ""})` : ""}`, [t.meaning, t.forYou, ...t.good, t.overuse ?? ""].filter(Boolean).map(general).filter(Boolean).join(" · "));
    if (id) traitId.set(t.id, id);
  }
  const weak = /WEAK/.test(c.strength.level);
  const shadowId = new Map(brief.shadows.map(s => [s.id, add("natal", `숙제로 볼 점: ${dropGeneral(say(s.text, year), { weak }).replace(/ · /g, " ")}`, [s.basis, s.warmTurn].join(" · "))] as const));
  // 대운(그 해가 속한 대운 · 다음 대운).
  const cd = c.currentDayun;
  const dayunCur = cd ? add("dayun", `${cd.ganji.hangul} 대운(${cd.period ?? cd.label})`, [`${cd.tenGod}의 10년`, cd.reading ?? "", cd.phase ? `대운 안의 위치: ${cd.phase.yearIndex}번째 해(${cd.phase.label})${cd.phase.remaining ? `, 남은 기간 ${cd.phase.remaining}` : ""}` : ""].filter(Boolean).join(" · ")) : null;
  const dayunNext = cd?.next ? add("dayun", `다음 대운: ${cd.next.ganji.hangul} 대운(${cd.next.start ?? cd.next.label})`, [`${cd.next.tenGod}의 10년`, cd.next.reading ?? ""].filter(Boolean).join(" · ")) : null;
  // MBTI.
  const mbti = brief.mbti;
  // P2 판독: 카드 칸 이름 「부기능·열등기능」을 작가가 그대로 옮겼다 → 고객 말로(가장 센 쪽 · 두 번째 · 세 번째 · 가장 늦게 자라는 쪽).
  const ROLE_KO: Readonly<Record<string, string>> = { 주기능: "가장 센 쪽", 부기능: "두 번째로 쓰는 쪽", "3차기능": "세 번째로 쓰는 쪽", 열등기능: "가장 늦게 자라는 쪽" };
  const mbtiType = mbti ? add("mbti", `MBTI ${mbti.type}`, (k.mbti.get(mbti.type as never)?.cognitiveFunctions ?? []).map(fn => `${ROLE_KO[fn.role] ?? fn.role}: ${fn.easy.split(/(?<=[.!?])\s/)[0]}`).join(" · ")) : null;
  const pairWhy = (t: string) => dedupeSentences(stripFnCodes(say(t, year), mbti?.type));
  for (const t of brief.traits) if (t.fusion && mbtiType && traitId.get(t.id)) pairs.push({ id: `P${pairs.length + 1}`, myeongri: traitId.get(t.id)!, mbti: mbtiType, why: pairWhy(t.fusion.why) });
  // 장 재료 → 줄.
  const built: ChapterPlan[] = [];
  const droppedPlan: string[] = [];
  const refLine = (ref: string): string[] => {
    // 앞 장 종합(recap:now 등, 2-1): 그 장의 핵심 주장 줄을 근거로(대운 9장·세운 10장 — 근거 없는 질문이 되지 않게).
    if (ref.startsWith("chapters.")) { const o = built.find(x => x.id === ref.slice(9)); return [...new Set((o?.sections ?? []).flatMap(sx => sx.claimIds ?? []))]; }
    if (ref === "chart.dayMaster") return natalBase.slice(0, 1);
    if (ref === "chart.currentDayun") return [dayunCur, dayunNext].filter(Boolean) as string[];
    if (ref.startsWith("traits.")) { const id = traitId.get(ref.slice(7)); return id ? [id] : []; }
    if (ref.startsWith("shadows.")) { const id = shadowId.get(ref.slice(8)); return id ? [id] : []; }
    return [];
  };
  const matLines = (m: Material, n: number, evidenceKey?: (key: string) => void): string[] => {
    if (m.kind === "trait") { const id = traitId.get(m.traitId); if (id) use.get(id)!.add(n); return id ? [id] : []; }
    if (m.kind === "ref") { const ids = refLine(m.ref); ids.forEach(id => use.get(id)?.add(n)); return ids; }
    if (m.kind === "mbti") { if (!mbtiType) return []; use.get(mbtiType)!.add(n); const sc = sceneFits(m.scene, brief) ? m.scene : null; const id = sc ? add("mbti", `${mbti!.type}의 장면`, sc, n) : null; return [mbtiType, ...(id ? [id] : [])]; }
    if (m.kind === "evidence") {
      evidenceKey?.(m.key);
      if (/^(depth|month|bridge):/.test(m.key)) return [];
      if (m.key === "yearMbti") {
        // 명리 × MBTI: 첫 줄(명리 쪽)과 나머지(그 유형이 이 기운에 어떻게 반응하는지 — 지식 DB annual-mbti)를 짝으로.
        const [head, ...rest] = m.facts.filter(x => !DIRECTIVE_FACT.test(x));
        const my = head ? add("year", split(head).value, split(head).meaning, n) : null;
        if (my && mbtiType) { use.get(mbtiType)!.add(n); for (const r of rest) pairs.push({ id: `P${pairs.length + 1}`, myeongri: my, mbti: mbtiType, why: pairWhy(r) }); }
        return [my, mbtiType].filter(Boolean) as string[];
      }
      if (m.key === "growthDayun") {
        // AM2-3 2-2(P2 판독 major-1 P3 「다음 대운 주제」 · P4 B5 문구 복사 — 연결 뜻 없는 짝): 짝은 「같은 나이대에 겹친다」는 엔진 사실 하나로만(major.ts growthDayun 첫 줄).
        const [head, overlap] = m.facts.filter(x => !DIRECTIVE_FACT.test(x));
        const my = head ? add("dayun", split(head).value, split(head).meaning, n) : null;
        if (my && mbtiType && overlap) { use.get(mbtiType)!.add(n); pairs.push({ id: `P${pairs.length + 1}`, myeongri: my, mbti: mbtiType, why: pairWhy(overlap) }); }
        return [my, mbtiType].filter(Boolean) as string[];
      }
      return m.facts.filter(x => !DIRECTIVE_FACT.test(x) && sceneFits(x, brief)).map(x => { const s = split(x); return add(subjectOfFact(m.key, x, product), s.value, s.meaning, n); }).filter(Boolean) as string[];
    }
    return [];
  };
  const entries = new Map((brief.timeline?.entries ?? []).map(e => [e.key, e]));
  // 3-1 같은 씨앗을 두 장에 쓰지 않는다(정규화 글 기준, 먼저 나온 장 몫).
  const usedSeeds = new Set<string>();
  const seedOnce = (s: string | null | undefined) => { if (!s) return undefined; const k2 = s.replace(/[^가-힣]/g, ""); if (usedSeeds.has(k2)) return undefined; usedSeeds.add(k2); return s; };
  // 지난 대운(대운 2장 「그 시기를 지나며」)이 만 22세 전에 끝났으면 직장 장면 금지(P2 판독 major-1 2.2 갑자 대운 만 11~21세에 「책상 서랍 간식을 나누던 동료」).
  const birthYear = Number(brief.baseDate.slice(0, 4)) - brief.person.age;
  const prevDayunEndAge = (() => { const cyc = brief.timeline?.lifetime ?? []; const i = cyc.findIndex(x => x.current); const p = i > 0 ? cyc[i - 1] : undefined; return p ? p.endYear - birthYear : 99; })();
  const seedCtx = (chId: string) => ({ brief, workplaceOk: !(product === "major_fortune" && chId === "past" && prevDayunEndAge < 22) });
  const seen = { tenGod: new Map<string, { label: string; rels: ReadonlySet<string>; flow: number }>(), life: new Map<string, string>() };
  const chapters: ChapterPlan[] = built;
  for (const ch of plan) built.push((() => {
    const cb = brief.chapters.find(x => x.id === ch.id) ?? brief.chapters.find(x => x.id.startsWith(`${ch.id}:`));
    const sc = seedCtx(ch.id);
    const scene = (hints: readonly string[] | undefined) => seedOnce((hints ?? []).map(h => cleanSeed(say(h, year), sc)).find(h => h && sceneFits(h, brief)));
    if (ch.keys) {
      const keys: KeyPlan[] = ch.keys.map(key => {
        const e = entries.get(key)!, kb = brief.chapters.find(x => x.id === `${ch.id}:${key}`);
        return keyPlan(e, kb?.materials ?? [], ch.n, add, matLines, brief, year, seen, () => lines, s => seedOnce(cleanSeed(s, sc)));
      });
      return { n: ch.n, id: ch.id, title: say(ch.title, year), question: say(ch.question, year), target: ch.targetChars, useName: ch.useName, keys, claims: [], avoid: [] };
    }
    const secs: readonly { q: string; domain: string; materials: readonly Material[] }[] = cb?.sections ?? [{ q: ch.question, domain: "alone", materials: ch.materials }];
    const sections: SectionPlan[] = secs.map(s => {
      const ids = [...new Set(s.materials.flatMap(m => matLines(m, ch.n)))];
      const recap = new Set(s.materials.flatMap(m => (m.kind === "ref" && m.ref.startsWith("chapters.") ? refLine(m.ref) : [])));
      const ev = s.materials.find((m): m is Extract<Material, { kind: "evidence" }> => m.kind === "evidence");
      const claim = ev ? ev.facts.filter(x => !DIRECTIVE_FACT.test(x) && !/^(적어 준|연애 상태|일 상황|고객이)/.test(x) && /: |달: | — /.test(x) && sceneFits(x, brief))[0] : undefined;
      const claimId = ev && claim ? add(subjectOfFact(ev.key, claim, product), split(claim).value, split(claim).meaning) : null;
      const sc2 = scene(s.materials.flatMap(m => (m.kind === "trait" && m.scene ? [m.scene] : [])));
      return { q: say(s.q, year), lines: ids, claims: claim ? [say(claim, year)] : [], ...(claimId ? { claimIds: [claimId] } : {}), ...(recap.size ? { recapIds: [...recap] } : {}), ...(sc2 ? { scene: sc2 } : {}), ...(DOMAIN_KO[s.domain] ? { angle: DOMAIN_KO[s.domain] } : {}) };
    });
    const scenes = (cb?.sceneHint ?? []).map(h => cleanSeed(say(h, year), sc)).filter((h): h is string => Boolean(h) && sceneFits(h!, brief)).map(h => seedOnce(h)).filter((h): h is string => Boolean(h)).slice(0, 2);
    // 2-1 근거가 없는 절(입력으로 근거가 다 걸러진 절 — 솔로·직업 미입력 등)은 질문을 내지 않는다. 장이 다 비면 바탕 줄 하나로(대운이 없는 책의 앞 장 종합 등).
    const kept = sections.filter(sx => sx.lines.length);
    const finalSections = kept.length ? kept : sections.slice(0, 1).map(sx => ({ ...sx, lines: natalBase.slice(0, 2) }));
    if (finalSections.length < sections.length) droppedPlan.push(...sections.filter(sx => !sx.lines.length).map(sx => `${ch.n}장 「${sx.q}」`));
    return { n: ch.n, id: ch.id, title: say(ch.title, year), question: say(ch.question, year), target: ch.targetChars, useName: ch.useName, sections: finalSections, claims: [...new Set(finalSections.flatMap(s => s.claims))], avoid: [], ...(scenes.length ? { scenes } : {}) };
  })());
  // 2-3 핵심 주장과 되풀이 금지가 같은 근거를 동시에 가리키면(P2 판독 major-1 D25: 3장 주장인데 6장 근거) 그 근거를 금지 쪽 장의 절에서 뺀다(절에 다른 근거가 남을 때만).
  const claimOwner = new Map<string, number>();
  for (const p of chapters) for (const s of p.sections ?? []) for (const id of s.claimIds ?? []) if (!claimOwner.has(id)) claimOwner.set(id, p.n);
  const resolved = chapters.map(p => (p.sections ? { ...p, sections: p.sections.map(s => { const keep = s.lines.filter(id => { const o = claimOwner.get(id); return o === undefined || o === p.n || s.recapIds?.includes(id); }); return keep.length ? { ...s, lines: keep } : s; }) } : p));
  // 쓰는 장도 같은 원리로(뺀 근거는 그 장에서 쓰지 않는다).
  for (const p of resolved) for (const id of new Set(chapters.find(x => x.n === p.n)!.sections?.flatMap(s => s.lines) ?? [])) if (!(p.sections ?? []).some(s => s.lines.includes(id))) use.get(id)?.delete(p.n);
  // 같은 줄을 여러 장이 쓰면 다른 각도(절 영역)로만 — 각도는 절에 적혀 있다. 근거가 겹치는 다른 장의 주장은 반복 금지 목록으로.
  const linesOf = (p: ChapterPlan) => new Set([...(p.sections ?? []).flatMap(s => s.lines), ...(p.keys ?? []).flatMap(x => x.lines)]);
  const out = resolved.map(p => { const mine = linesOf(p), recap = new Set((p.sections ?? []).flatMap(s => s.recapIds ?? []));
    const claimsOf = (o: ChapterPlan) => (o.sections ?? []).flatMap(s => s.claims.map((cl, i) => ({ cl, id: s.claimIds?.[i] }))).filter(x => !x.id || !recap.has(x.id)).map(x => x.cl);
    return { ...p, allowed: [...mine], avoid: [...new Set(resolved.filter(o => o.n !== p.n && [...linesOf(o)].some(id => mine.has(id))).flatMap(o => (o.keys ? o.claims : claimsOf(o)).map(cl => `${o.n}장: ${cl}`)))].slice(0, 6) }; });
  // 세운 책은 대운 안의 위치를 책의 해 기준으로(덕짱님 결정 2026-11-11 「2027년 기준으로」 — 엔진 값은 발행일 기준 연차, 계산은 그대로 두고 글만 옮긴다).
  const shift = product === "annual_fortune" ? year - brief.chart.thisYear.year : 0;
  const tidy = (t: string) => shiftPhase(t, year, shift).replace(/(\s*·\s*){2,}/g, " · ").replace(/^\s*·\s*|\s*·\s*$/g, "");
  // 지난 대운이 만 22세 전에 끝났으면 대운 2장 둘째 절(그 시기를 지나며) 근거의 「동료」는 「또래」로(카드가 직장 낱말을 건네지 않게 — 오탐 검토 major past_work).
  const pastSec = product === "major_fortune" && prevDayunEndAge < 22 ? new Set(out.find(c => c.id === "past")?.sections?.[1]?.lines.filter(id => /^D/.test(id)) ?? []) : new Set<string>();
  const young = (id: string, t: string) => (pastSec.has(id) ? t.replace(/동료/g, "또래") : t);
  const finalLines = lines.map(l => ({ ...l, value: young(l.id, tidy(l.value)), meaning: young(l.id, tidy(l.meaning)), use: [...(use.get(l.id) ?? [])].sort((a, b) => a - b) }));
  // 2-2 짝은 두 줄이 모두 허용된 장에만. 겹치는 장이 없으면 짝을 뺀다(P2 판독 major-1 P1: N7은 1·2·3장, B1은 7·9장 → 작가가 2장·9장에 나눠 씀).
  const useOf = new Map(finalLines.map(l => [l.id, new Set(l.use)]));
  const pairsOut = pairs.filter(p => p.why).map(p => ({ ...p, use: [...(useOf.get(p.myeongri) ?? [])].filter(n => useOf.get(p.mbti)?.has(n)) })).filter(p => p.use.length).map((p, i) => ({ ...p, id: `P${i + 1}` }));
  const wish = product === "annual_fortune" ? readWish(wishRaw) : null;
  return { product, person: personCard(brief, year, wish), lines: finalLines, pairs: pairsOut, chapters: out, ...(wish?.kind === "ok" && wish.text ? { wish: wish.text } : {}), ...(droppedPlan.length ? { droppedPlan } : {}), ...(product === "major_fortune" && !brief.chart.currentDayun ? { noDayun: true } : {}) };
}

type Seen = { readonly tenGod: Map<string, { label: string; rels: ReadonlySet<string>; flow: number }>; readonly life: Map<string, string> };
function keyPlan(e: TimelineEntry, mats: readonly Material[], n: number, add: (s: Subject, v: string, m?: string, n?: number) => string | null, matLines: (m: Material, n: number) => string[], brief: Brief, year: number, seen: Seen, allLines: () => readonly Line[], seed: (s: string) => string | undefined): KeyPlan {
  const month = e.kind === "month", subj: Subject = month ? "month" : "year", unit = month ? "달" : "해";
  const label = keyLabelOf(e);
  const notes = brief.timeline?.tenGodNotes ?? {};
  const stem = e.tenGod.stem, branch = e.tenGod.branch;
  const noteOf = (tg: string) => (notes as Record<string, { meaning: string }>)[tg]?.meaning ?? (Object.entries(notes).find(([k2]) => k2.startsWith(tg.replace(/\(.*$/, "")))?.[1] as { meaning: string } | undefined)?.meaning ?? "";
  const ids: string[] = [];
  const push = (v: string, m = "") => { const id = add(subj, `${label} ${v}`, m, n); if (id) ids.push(id); };
  const rels = e.badges.map(b => b.label.replace(/\(.*\)$/, "").trim()).filter(x => x.length >= 2);
  // 1-4 같은 십성 달·해의 뜻 줄이 글자까지 같으면(P2 판독: Y3=Y27=Y74 「일한 만큼 받는 구조가 단단」 6곳) 두 번째부터는 앞 key를 가리키고 엔진 차이(관계·흐름)만.
  const tgNote = (side: "하늘" | "땅", tg: string) => {
    const name = tg.replace(/\(.*$/, ""), prev = seen.tenGod.get(name);
    if (!prev) { seen.tenGod.set(name, { label, rels: new Set(rels), flow: e.flow.score }); push(`${side} 글자 ${tg}`, noteOf(tg)); return; }
    const newRels = rels.filter(r => !prev.rels.has(r));
    const diff = [newRels.length ? `관계 ${newRels.join("·")}` : "", prev.flow !== e.flow.score ? `흐름은 ${FLOW_WORD[prev.flow]}에서 ${FLOW_WORD[e.flow.score]}으로` : ""].filter(Boolean).join(", ");
    push(`${side} 글자 ${tg}`, `${name}의 뜻은 앞의 ${prev.label}과 같은 결${diff ? ` — 이 ${unit}에 달라지는 것: ${diff}` : ""}`);
  };
  tgNote("하늘", stem);
  if (branch && branch !== stem) tgNote("땅", branch);
  // 1-3 관계는 모두(공망 포함), 엔진 뜻 한 줄 + 자리(P2 판독 annual-1: 화면 배지 원진·묘진해·공망이 카드에 없어 책과 화면이 달랐다 — 예전에는 셋까지만·공망 뺌).
  for (const b of e.badges) push(`${b.label}${b.with ? `(${b.with} 자리와)` : ""}`, b.line);
  const sig = (e as TimelineEntry & { signals?: Record<string, string> }).signals;
  if (sig) push("영역 흐름", Object.entries(DOMAIN_SIGNAL).map(([d, ko]) => `${ko} ${SIGNAL_KO(sig[d] ?? "→")}`).join(" · "));
  const same: string[] = [];
  for (const d of (e.material?.domains ?? []).filter(x => sceneFits(x, brief))) { const prev = seen.life.get(d); if (prev) { if (!same.includes(prev)) same.push(prev); continue; } seen.life.set(d, label); push("생활", d); }
  if (same.length) push("생활 결", `${same.join(" · ")}과 같은 생활 결(일·돈·관계·컨디션)`);
  const fills = e.fillsLack?.fills && e.fillsLack.elements.length ? e.fillsLack.elements : [];
  if (fills.length) push("부족한 기운을 채움", `${fills.map(x => ELEMENT_SAY[x] ?? x).join("·")} 기운이 들어와 원국에 모자란 쪽을 채움`);
  push("흐름", FLOW_DESC[e.flow.score] ?? "");
  if (e.dayun?.position) push("대운 안의 위치", e.dayun.position.replace(/^\d{4}~\d{4} /, ""));
  if (e.dayun?.transition) push(`새 대운 시작: ${e.dayun.ganji}`, e.dayun.tenGod);
  for (const m of mats) if (m.kind === "evidence" && /^(month|bridge):/.test(m.key)) for (const x of m.facts) if (!/^영역 신호/.test(x) && sceneFits(x, brief)) { const s = split(x); push(s.value.replace(/^(연애|돈|일|사람|마음) [↑↓→]$/, "$1 쪽 장면"), s.meaning); }
  for (const m of mats) if (m.kind === "ref") ids.push(...matLines(m, n));
  const deep = mats.find((m): m is Extract<Material, { kind: "evidence" }> => m.kind === "evidence" && m.key.startsWith("depth:"));
  const depth = deep ? (/^핵심 해/.test(deep.facts[0] ?? "") ? "deep" : "short") : undefined;
  if (depth === "deep") push("이 10년에서 눈여겨볼 해", say(deep!.facts[0].replace(/^핵심 해 \d+: /, ""), year));
  const scene = e.material?.scene && sceneFits(e.material.scene, brief) ? seed(say(e.material.scene, year)) : undefined;
  // 할 일 씨앗(엔진이 key마다 겹치지 않게 고른 행동 문형) — 같은 처방이 여러 key에 되풀이되지 않게.
  const todoRaw = e.action?.text && sceneFits(e.action.text, brief) ? say(e.action.text, year) : "";
  const claim = sig ? Object.entries(DOMAIN_SIGNAL).filter(([d]) => sig[d] && sig[d] !== "→").map(([d, ko]) => `${ko} ${SIGNAL_KO(sig[d])}`).join(" · ") : "";
  const when = (e.when ?? e.period ?? "future") as KeyPlan["when"];
  const uniq = [...new Set(ids)];
  // 1-1 카드 줄 범위(다시 쓰기 지시용): 이 key 주체(M·Y)의 첫 줄 ~ 끝 줄.
  const own = uniq.filter(id => id.startsWith(month ? "M" : "Y")).map(id => Number(id.slice(1))).sort((a, b) => a - b);
  const range = own.length ? `${month ? "M" : "Y"}${own[0]}~${month ? "M" : "Y"}${own.at(-1)}` : undefined;
  void allLines;
  // 2-4 반드시 쓸 것: 흐름 단어 · 부족한 기운을 채우는 줄 · 관계(무거운 자리 먼저 둘까지 — 짧은 key는 핵심 하나 + 장면 하나 + 행동 하나로 쓴다).
  const relRank = (b: TimelineEntry["badges"][number]) => (/태어난 날/.test(b.with ?? "") ? 0 : /태어난 달/.test(b.with ?? "") ? 1 : 2) + (b.kind === "GONGMANG" ? 5 : 0);
  const mustRels = [...e.badges].filter(b => b.kind !== "GONGMANG").sort((a, b) => relRank(a) - relRank(b)).slice(0, depth === "short" ? 1 : 2).map(b => b.label.replace(/\(.*\)$/, "").trim());
  const must: MustItem[] = [
    { what: `흐름 ${FLOW_WORD[e.flow.score]}`, re: FLOW_TALK[e.flow.score].source },
    ...(fills.length ? [{ what: `${fills.map(x => ELEMENT_SAY[x] ?? x).join("·")} 채움`, re: `(${fills.map(x => ELEMENT_RE[x] ?? x).join("|")})[^.?!]{0,30}(채|보태|들어)|(채|보태)[^.?!]{0,20}(${fills.map(x => ELEMENT_RE[x] ?? x).join("|")})` }] : []),
    ...mustRels.map(r => ({ what: r, re: GUK_ALIAS[r] ? `${esc(r)}|${GUK_ALIAS[r]}` : esc(r) })),
  ];
  return { key: e.key, label, head: say(e.head ?? "", year), when, lines: uniq, claims: claim ? [`${label}: ${claim}`] : [], ...(depth ? { depth } : {}), ...(scene ? { scene } : {}), ...(todoRaw && when !== "past" ? { todo: todoRaw } : {}), ...(range ? { range } : {}), must };
}

/** 대운 안 위치 말(엔진과 같은 경계: 1 첫해 · 2~3 앞쪽 · 4~7 중간 · 8~9 끝 무렵 · 10 마지막 해). */
const phaseKo = (i: number) => (i === 1 ? "첫해" : i === 10 ? "마지막 해" : i <= 3 ? "앞쪽" : i <= 7 ? "중간" : "끝 무렵");
/** 「5번째 해(중간), 남은 기간 약 5년 4개월(2032년 4월 무렵까지)」 → 「2027년은 6번째 해(중간), 이 대운은 2032년 4월 무렵까지」(책의 해가 발행일의 해보다 뒤일 때). 10번째를 넘으면 그대로 둔다. */
export function shiftPhase(t: string, bookYear: number, shift: number): string {
  if (shift <= 0) return t;
  const to = (n: number, until: string, all: string) => { const m = n + shift; return m > 10 ? all : `${bookYear}년은 ${m}번째 해(${phaseKo(m)}), 이 대운은 ${until}`; };
  return t.replace(/(\d+)번째 해\((?:앞쪽|중간|끝 무렵|첫해|마지막 해)\), 남은 기간 [^(|]*?\(([^)]+)\)/g, (all, n: string, u: string) => to(Number(n), u, all))
    .replace(/(?:앞쪽|중간|끝 무렵|첫해|마지막 해)\((\d+)번째 해\), 남은 기간 [^(|]*?\(([^)]+)\)/g, (all, n: string, u: string) => to(Number(n), u, all));
}

/** 인물 카드(고객 입력만, 제약 문장 없이 사실만). */
function personCard(brief: Brief, year: number, wish: { kind: string; text?: string; topics?: readonly string[] } | null): string[] {
  const p = brief.person, f = p.facts;
  const JOB: Record<string, string> = { employee: "직장인", job_seeker: "취업 준비 중", student: "학생", self_employed: "자영업", business_owner: "사업", freelancer: "프리랜서", unemployed: "쉬는 중", homemaker: "살림", other: "기타" };
  const REL: Record<string, string> = { single: "솔로", some: "솔로(썸)", dating: "연애 중", marriage_preparing: "연애 중(결혼 준비)", married: "기혼", unknown: "미입력" };
  const book = brief.product === "annual_fortune" ? `「나의 ${year}」(${year}년 ${brief.timeline?.entries.find(e => e.kind === "year")?.ganji.hangul ?? ""}년 신년판)` : "「앞으로의 나」(대운 10년)";
  const base = brief.baseDate.split("-").map(Number);
  return [
    `이름: ${p.name}(부를 때 ${p.callName})`,
    `나이: 만 ${p.age}세(${p.ageBand})${p.gender === "FEMALE" ? " · 여성" : p.gender === "MALE" ? " · 남성" : ""}`,
    `MBTI: ${f.mbti ?? "미입력"}`,
    `출생 시각: ${f.birthTimeKnown ? "앎" : "모름(시주 없음)"}`,
    `일: ${JOB[f.job.status] ?? "적지 않음"}${f.job.detail ? `(${say(f.job.detail)})` : " · 하는 일과 연차는 모름"}`,
    `연애: ${REL[f.relationship] ?? "미입력"} · 자녀: ${f.children === "has" ? "있음" : f.children === "none" ? "없음" : "미입력"} · 사는 곳·같이 사는 사람: 모름`,
    ...(wish?.kind === "ok" && wish.text ? [`적어 준 바람: «${wish.text}»`] : wish?.kind === "inject" ? [`적어 준 바람의 주제: ${(wish.topics ?? []).map(t => ({ love: "연애", money: "돈", work: "일", study: "공부", people: "사람", mind: "마음" } as Record<string, string>)[t] ?? t).join("·") || "일상"}`] : wish?.kind === "risk" ? ["적어 준 바람: 마음이 많이 지친 시기일 수 있음"] : []),
    `책: ${book} · 이 책을 쓴 날 ${base[0]}년 ${base[1]}월 ${base[2]}일`,
  ];
}
