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
import { FLOW_DESC, FLOW_WORD, POSITION_KO } from "@/lib/brief/labels";
import { JOB_ASSUME, type WriterChapter } from "../prompt";
import { FARMING, presumedPartner } from "../safety/lint";
import { RURAL_PROP } from "../safety/patterns";
import { readWish } from "@/lib/brief/design/annual";
import { cleanSeed, dedupeSentences, dropGeneral, SENIORITY_PROP, stripFnCodes, unitFix } from "./card";
import { coreOf, relFlow, relName, seatShort } from "@/lib/brief/core";
import { allocateChapters, rxKindsOf, type RxKind } from "@/lib/brief/prescriptions";
import { josa, TEN_GOD_GROUP } from "@/lib/brief/labels";

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
/** AM2-4 1부: core = 설계도가 고른 핵심(엔진 가중치, 1~2개 이름) · screen = 화면 카드가 보여 주는 사실(본문은 되풀이하지 않는다) · todo = 화면 카드의 할 일(엔진·처방 배분, 작가는 쓰지 않는다). */
export type KeyPlan = { readonly key: string; readonly label: string; readonly head: string; readonly when: "past" | "current" | "future"; readonly lines: readonly string[]; readonly claims: readonly string[]; readonly depth?: "deep" | "short"; readonly scene?: string; readonly todo?: string; readonly range?: string; readonly must?: readonly MustItem[]; readonly core?: readonly string[]; readonly screen?: readonly string[] };
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
  /** AM2-4 2부: 다른 장이 집인 근거(id → 집 장). 이 장에서는 다른 각도 한 줄로만. */
  readonly away?: Readonly<Record<string, number>>;
  /** AM2-4 2부: 처방 배분(쓸 종류 하나 · 금지 종류). key 장은 본문에 행동을 쓰지 않는다. */
  readonly rx?: { readonly use: RxKind | null; readonly forbid: readonly RxKind[] };
};
export type Intake = { readonly product: "annual_fortune" | "major_fortune"; readonly person: readonly string[]; readonly lines: readonly Line[]; readonly pairs: readonly Pair[]; readonly chapters: readonly ChapterPlan[]; readonly wish?: string;
  /** 2-1 근거가 없어 뺀 절(기록). */ readonly droppedPlan?: readonly string[];
  /** 엔진이 대운을 계산하지 못한 대운 책(출생 시각 미상 일부 — 계산은 보호 대상, 결정 필요로 보고). */ readonly noDayun?: boolean };

/** AM2-4 3부: 십이운성 한 글자 이름은 한자를 함께(「쇠(衰)」 — 오행 「쇠(금)」와 글자 꼴을 다르게). 카드 글 정리(say)가 한자를 지우므로 표시 글자로 두었다가 마지막에 붙인다. */
export const STAGE_HANJA: Readonly<Record<string, string>> = { 태: "胎", 양: "養", 쇠: "衰", 병: "病", 사: "死", 묘: "墓", 절: "絶" };
const STAGE_MARK = "\uE000";
export const STAGE_RE = /(?<![가-힣])(태|양|쇠|병|사|묘|절)\((胎|養|衰|病|死|墓|絶)\)/g;
/** 행동 줄(「할 것·피할 것」 소제목에 주는 줄): 「~기 좋은」 「~세요」 「~지 않게」 꼴. */
const ACTION_LINE = /기 좋(은|음|아요|습니다)|세요[.!]?$|(하기|보기|두기|않기|줄이기|살피기|지키기|나누기|정하기|미루기)$|않게|말고|대신/;
const NOT_ACTION = /달(\(같은 세기\))?:|(오르는|살필) 영역|살필 거리|오르는 달|늦출 달|새기 쉬운 달/;
/** 묶음 구성(prompt.ts chunkPlan과 같은 표). keys:a-b = 반복 장 key 구간. */
export const CHUNK_GROUPS: Readonly<Record<Intake["product"], readonly (readonly string[])[]>> = {
  annual_fortune: [["big", "love"], ["money", "work", "people"], ["mind", "keys:0-4"], ["keys:4-9"], ["keys:9-"], ["use", "wish", "next"]],
  major_fortune: [["read", "past"], ["now", "turn"], ["keys:0-5"], ["keys:5-"], ["map", "growth"], ["plan", "letter"]],
};
/** AM2-4 2부: 장면 씨앗은 묶음당 하나까지(필수 아님). 장 장면 → 절 장면 → key 장면 순으로 첫 하나만 남긴다(대운은 깊은 key 먼저). */
const omitScene = <T extends { readonly scene?: string }>(o: T): T => { const c = { ...o }; delete (c as { scene?: string }).scene; return c; };
function thinScenes(product: Intake["product"]) {
  const groups = CHUNK_GROUPS[product];
  const keepOf = new Map<string, string>(); // 묶음 번호 → 남긴 자리
  return (p: ChapterPlan, _i: number, all: readonly ChapterPlan[]): ChapterPlan => {
    const slot = (pos: string, gi: number) => { const k2 = String(gi); if (!keepOf.has(k2)) keepOf.set(k2, pos); return keepOf.get(k2) === pos; };
    if (p.keys) {
      const keyed = all.find(c => c.keys)!.keys!;
      const giOf = (idx: number) => groups.findIndex(g => g.some(x => { const m = /^keys:(\d+)-(\d*)$/.exec(x); return m && idx >= Number(m[1]) && (m[2] === "" || idx < Number(m[2])); }));
      // 묶음마다 장면 씨앗이 있는 첫 key(대운은 깊은 key 먼저) 하나.
      const chosen = new Map<number, string>();
      for (const pass of product === "major_fortune" ? ["deep", "any"] : ["any"]) keyed.forEach((k2, idx) => { const gi = giOf(idx); if (gi < 0 || chosen.has(gi) || !k2.scene || (pass === "deep" && k2.depth !== "deep")) return; const chapterTaken = groups[gi].some(x => !x.startsWith("keys:") && keepOf.has(String(gi))); if (!chapterTaken) chosen.set(gi, k2.key); });
      for (const [gi, key] of chosen) slot(`key:${key}`, gi);
      return { ...p, keys: p.keys.map((k2, idx) => (k2.scene && keepOf.get(String(giOf(idx))) === `key:${k2.key}` ? k2 : omitScene(k2))) };
    }
    const gi = groups.findIndex(g => g.includes(p.id));
    const scenes = (p.scenes ?? []).filter((_x, j) => slot(`ch:${p.n}:${j}`, gi));
    const sections = (p.sections ?? []).map((s2, j) => (s2.scene && slot(`sec:${p.n}:${j}`, gi) ? s2 : omitScene(s2)));
    return { ...p, ...(scenes.length ? { scenes } : { scenes: undefined }), ...(p.sections ? { sections } : {}) };
  };
}
/** 작가가 소망을 인용할 때 쓰는 표시(3-2). 렌더 단계가 원문 «…»으로 바꾼다. */
export const WISH_MARK = "«바람»";

// ---------- 분량(2-4) ----------
/** AM2-3 2-4: 목표 분량 = P2 실측(장별 글자, 2026-11-11 재시범 두 권)과 카드 양(절마다 근거 줄 소화 — 줄당 약 70자, 절 하한 260자) 가운데 큰 쪽, 설계 상한을 넘지 않는다. 숫자를 채우려고 늘리지 않는다(작가 규칙). */
const P2_CHARS: Readonly<Record<string, number>> = { big: 1259, love: 1064, money: 832, work: 890, people: 583, mind: 755, use: 1050, wish: 714, next: 689, read: 946, past: 880, now: 1330, turn: 773, map: 1050, growth: 740, plan: 1043, letter: 836 };
/**
 * AM2-4 1부 key 본문 분량(카드 줄 없음 — 카드는 화면): 실측(tools/annual-major/am2-4-measure.ts)으로 다시 정함.
 * P3 key 본문(머리 문장 뺌) 평균 세운 367 · 대운 367자 → 화면 사실(흐름·오행 채움·핵심 밖 관계·할 일·행동)과 4영역 나열을 빼면 세운 211(p25 172 · p75 249) · 대운 220(179~265),
 * P2는 353(333~380) · 254(216~291). 새 역할(핵심 1~2 + 이 사람에게 주는 의미)의 몫 = 두 판 남은 글의 p25~p75 가운데 띠.
 * 예전(카드 줄 130자 포함) 달 460~600 · 깊은 해 520~680 · 짧은 해 330~430.
 */
export const KEY_TARGET: Readonly<Record<"month" | "deep" | "short", readonly [number, number]>> = { month: [220, 320], deep: [260, 360], short: [180, 260] };
function retarget(id: string, sections: readonly { lines: readonly string[] }[], design: readonly [number, number]): readonly [number, number] {
  const card = sections.reduce((a, s2) => a + Math.max(260, s2.lines.length * 70), 0), p2 = P2_CHARS[id] ?? design[0];
  const base = Math.min(design[1], Math.max(p2, card));
  return [Math.round(base * 0.9), Math.round(base * 1.15)];
}

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
  // AM2-4 3부 카드 값 고객 말: 「화국(반쯤)」 → 「화국 반합」, 「새 대운(대운)」 → 「새 대운」, 「쇠 (태어난 달·태어난 시각) —」 → 「태어난 달·시각 자리의 쇠 —」.
  t = t.replace(/([가-힣]{2,4})\(반쯤\)/g, "$1 반합").replace(/새 대운\(대운\)/g, "새 대운")
    .replace(/(?<![가-힣])([가-힣]{1,6}) \((태어난 (?:해|달|날|시각)(?:·태어난 (?:해|달|날|시각))*)\)/g, (_m, nm: string, seats: string) => `${seats.split("·").length > 1 ? `태어난 ${seats.split("·").map(x => x.replace(/^태어난 /, "")).join("·")}` : seats} 자리의 ${nm}`);
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
/** 절 각도(AM2-4 3부: 「일 쪽」 같은 각도 이름을 작가가 본문에 옮겼다 — 「일 쪽에서는」 — 고객 말로). */
const DOMAIN_KO: Readonly<Record<string, string>> = { love: "연애와 인연", marriage: "결혼과 가족", work: "일과 진로", money: "돈 관리", study: "공부", relationships: "사람 사이", alone: "혼자 있는 시간", family: "가족" };
const ELEMENT_SAY: Readonly<Record<string, string>> = { WOOD: "나무(목)", FIRE: "불(화)", EARTH: "흙(토)", METAL: "쇠(금)", WATER: "물(수)" };
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
    // AM2-4 3부: 괄호 값(「백호대살(태어난 달 · 임술)」)을 고객 말로 — 「태어난 달 자리의 백호대살」. 십이운성 한 글자 이름은 한자 표시(쇠(衰)).
    void ganji;
    const baseName = t.name.replace(/\(.*\)$/, "").trim();
    const nm = /^twelveStage/.test(t.featureId) && STAGE_HANJA[baseName] ? `${baseName}${STAGE_MARK}` : t.name;
    const id = add("natal", `${seat ? `${seat} 자리의 ` : ""}${nm}`, [t.meaning, t.forYou, ...t.good, t.overuse ?? ""].filter(Boolean).map(general).filter(Boolean).join(" · "));
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
  // AM2-4 3부(P3 판독 major-1 B19 「ENTP의 가장 센 쪽인 가능성」): 칸 이름 없이 쉬운 뜻만(먼저 쓰는 순서 그대로).
  void ROLE_KO;
  const mbtiType = mbti ? add("mbti", `MBTI ${mbti.type}`, (k.mbti.get(mbti.type as never)?.cognitiveFunctions ?? []).map(fn => fn.easy.split(/(?<=[.!?])\s/)[0]).join(" · ")) : null;
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
  // 세운 달의 「대운 겹침」: 책의 해가 속한 대운의 천간 십성(엔진 cycles 값).
  const annualDayunTg = product === "annual_fortune" ? (brief.timeline?.cycles ?? []).find(cy => { const [a1, b1] = cy.years.split("~").map(Number); return a1 <= year && year <= b1; })?.tenGod ?? c.currentDayun?.tenGod : undefined;
  const chapters: ChapterPlan[] = built;
  for (const ch of plan) built.push((() => {
    const cb = brief.chapters.find(x => x.id === ch.id) ?? brief.chapters.find(x => x.id.startsWith(`${ch.id}:`));
    const sc = seedCtx(ch.id);
    const scene = (hints: readonly string[] | undefined) => seedOnce((hints ?? []).map(h => cleanSeed(say(h, year), sc)).find(h => h && sceneFits(h, brief)));
    if (ch.keys) {
      const keys: KeyPlan[] = ch.keys.map(key => {
        const e = entries.get(key)!, kb = brief.chapters.find(x => x.id === `${ch.id}:${key}`);
        return keyPlan(e, kb?.materials ?? [], ch.n, add, brief, year, seen, s => seedOnce(cleanSeed(s, sc)), annualDayunTg);
      });
      return { n: ch.n, id: ch.id, title: say(ch.title, year), question: say(ch.question, year), target: product === "annual_fortune" ? KEY_TARGET.month : ch.targetChars, useName: ch.useName, keys, claims: [], avoid: [] };
    }
    const secs: readonly { q: string; domain: string; materials: readonly Material[] }[] = cb?.sections ?? [{ q: ch.question, domain: "alone", materials: ch.materials }];
    const sections: SectionPlan[] = secs.map(s => {
      const ids = [...new Set(s.materials.flatMap(m => matLines(m, ch.n)))];
      const recap = new Set(s.materials.flatMap(m => (m.kind === "ref" && m.ref.startsWith("chapters.") ? refLine(m.ref) : [])));
      const ev = s.materials.find((m): m is Extract<Material, { kind: "evidence" }> => m.kind === "evidence");
      const claim = ev ? ev.facts.filter(x => !DIRECTIVE_FACT.test(x) && !/^(적어 준|연애 상태|일 상황|고객이)/.test(x) && /: |달: | — /.test(x) && sceneFits(x, brief))[0] : undefined;
      const claimId = ev && claim ? add(subjectOfFact(ev.key, claim, product), split(claim).value, split(claim).meaning) : null;
      const sc2 = scene(s.materials.flatMap(m => (m.kind === "trait" && m.scene ? [m.scene] : [])));
      const lineOf = (id: string) => lines.find(l => l.id === id);
      // AM2-4 2부(P3 판독 annual-1 차단 #7 · 경미 #34): 「할 것·피할 것」 소제목에는 행동 줄만 — 달 목록·「살필 거리」·영역 이름 줄은 주지 않는다.
      const advice = /할 것|피할 것/.test(s.q);
      let use0 = advice ? ids.filter(id => { const l = lineOf(id); return Boolean(l) && ACTION_LINE.test(`${l!.value} ${l!.meaning}`.trim()) && !NOT_ACTION.test(`${l!.value} ${l!.meaning}`); }) : ids;
      if (advice && !use0.length) use0 = ids.filter(id => { const l = lineOf(id); return l && !NOT_ACTION.test(`${l.value} ${l.meaning}`); });
      // AM2-4 2부(P3 판독 major-1 C2·B19, annual-1 경계 #2): 짝이 없는 명리 줄과 MBTI 줄은 같은 절에 두지 않는다 — 짝이 있으면 짝 아닌 명리 줄을, 없으면 MBTI 줄을 뺀다.
      const isB = (id: string) => lineOf(id)?.subject === "mbti", isM = (id: string) => /^(natal|dayun|year|month)$/.test(lineOf(id)?.subject ?? "");
      if (use0.some(isB) && use0.some(isM)) { const pm = new Set(pairs.filter(pp => use0.includes(pp.myeongri) && use0.includes(pp.mbti)).map(pp => pp.myeongri)); use0 = pm.size ? use0.filter(id => !isM(id) || pm.has(id)) : use0.filter(id => !isB(id)); }
      const firstAction = advice ? lineOf(use0[0] ?? "") : undefined;
      const claims2 = advice ? (firstAction ? [say(`${firstAction.value}${firstAction.meaning ? `: ${firstAction.meaning}` : ""}`, year)] : []) : claim ? [say(claim, year)] : [];
      const claimIds2 = advice ? (firstAction ? [firstAction.id] : []) : claimId ? [claimId] : [];
      // 개수 말은 카드 값으로만(4부): 행동 줄이 셋보다 적으면 「세 가지」를 뗀다.
      const q2 = advice && use0.length < 3 ? s.q.replace(/ 세 가지(는|은)\?/, "은?").replace(/ 세 가지/, "") : s.q;
      return { q: say(q2, year), lines: use0, claims: claims2, ...(claimIds2.length ? { claimIds: claimIds2 } : {}), ...(recap.size ? { recapIds: [...recap] } : {}), ...(sc2 ? { scene: sc2 } : {}), ...(DOMAIN_KO[s.domain] ? { angle: DOMAIN_KO[s.domain] } : {}) };
    });
    const scenes = (cb?.sceneHint ?? []).map(h => cleanSeed(say(h, year), sc)).filter((h): h is string => Boolean(h) && sceneFits(h!, brief)).map(h => seedOnce(h)).filter((h): h is string => Boolean(h)).slice(0, 2);
    // 2-1 근거가 없는 절(입력으로 근거가 다 걸러진 절 — 솔로·직업 미입력 등)은 질문을 내지 않는다. 장이 다 비면 바탕 줄 하나로(대운이 없는 책의 앞 장 종합 등).
    // AM2-4 7부: 엔진이 대운을 정하지 못한 세운 책(시각 미상 — 대운은 입력 단계에서 막고 세운을 권한다)에서는 대운을 묻는 절을 내지 않는다(근거 없는 질문 금지).
    const kept = sections.filter(sx => sx.lines.length && !(product === "annual_fortune" && !brief.chart.currentDayun && /대운/.test(sx.q)));
    const finalSections = kept.length ? kept : sections.slice(0, 1).map(sx => ({ ...sx, lines: natalBase.slice(0, 2) }));
    if (finalSections.length < sections.length) droppedPlan.push(...sections.filter(sx => !finalSections.includes(sx)).map(sx => `${ch.n}장 「${sx.q}」`));
    // AM2-4 7부: 대운을 정할 수 없는 세운 책(시각 미상)의 10장은 대운 자리를 묻지 않는다(근거 없는 질문 금지).
    const question = product === "annual_fortune" && ch.id === "next" && !brief.chart.currentDayun ? `${year}년을 지나며 붙잡을 한 가지는?` : ch.question;
    return { n: ch.n, id: ch.id, title: say(ch.title, year), question: say(question, year), target: retarget(ch.id, finalSections, ch.targetChars), useName: ch.useName, sections: finalSections, claims: [...new Set(finalSections.flatMap(s => s.claims))], avoid: [], ...(scenes.length ? { scenes } : {}) };
  })());
  // 2-3 핵심 주장과 되풀이 금지가 같은 근거를 동시에 가리키면(P2 판독 major-1 D25: 3장 주장인데 6장 근거) 그 근거를 금지 쪽 장의 절에서 뺀다(절에 다른 근거가 남을 때만).
  const claimOwner = new Map<string, number>();
  for (const p of chapters) for (const s of p.sections ?? []) for (const id of s.claimIds ?? []) if (!claimOwner.has(id)) claimOwner.set(id, p.n);
  const resolved = chapters.map(p => (p.sections ? { ...p, sections: p.sections.map(s => { const keep = s.lines.filter(id => { const o = claimOwner.get(id); return o === undefined || o === p.n || s.recapIds?.includes(id); }); return keep.length ? { ...s, lines: keep } : s; }) } : p));
  // 쓰는 장 = 최종 설계도에서 그 줄을 쓰는 장(뺀 근거·솎은 근거는 그 장에서 쓰지 않는다). AM2-4: 처음부터 다시 센다.
  for (const set of use.values()) set.clear();
  for (const p of resolved) for (const id of [...(p.sections ?? []).flatMap(s2 => s2.lines), ...(p.keys ?? []).flatMap(k2 => k2.lines)]) use.get(id)?.add(p.n);
  // 같은 줄을 여러 장이 쓰면 다른 각도(절 영역)로만 — 각도는 절에 적혀 있다. 근거가 겹치는 다른 장의 주장은 반복 금지 목록으로.
  const linesOf = (p: ChapterPlan) => new Set([...(p.sections ?? []).flatMap(s => s.lines), ...(p.keys ?? []).flatMap(x => x.lines)]);
  const homeOf = (id: string): number | undefined => claimOwner.get(id) ?? resolved.filter(p => !p.keys && (p.sections ?? []).some(s2 => s2.lines.includes(id) && !s2.recapIds?.includes(id))).map(p => p.n).sort((a, b) => a - b)[0];
  // AM2-4 2부 처방 배분: key 카드 할 일(엔진 배분)이 먼저, 장은 남은 종류에서 하나.
  const keyRx = new Map<RxKind, string>();
  for (const e of brief.timeline?.entries ?? []) if (e.todo && e.period !== "past") for (const kd of rxKindsOf(e.todo)) if (!keyRx.has(kd)) keyRx.set(kd, keyLabelOf(e));
  const rxPlan = allocateChapters(resolved.map(p => ({ n: p.n, id: p.id, keyed: Boolean(p.keys) })), keyRx);
  const out = resolved.map(p => { const mine = linesOf(p), recap = new Set((p.sections ?? []).flatMap(s => s.recapIds ?? []));
    const claimsOf = (o: ChapterPlan) => (o.sections ?? []).flatMap(s => s.claims.map((cl, i) => ({ cl, id: s.claimIds?.[i] }))).filter(x => !x.id || !recap.has(x.id)).map(x => x.cl);
    // AM2-4 2부 근거 문장의 집: 줄마다 집 장 하나(핵심 주장 장 → 처음 쓰는 장). 다른 장은 다른 각도 한 줄로만(집 장 문장 복사 0 — P3 판독 major-1 D26).
    const away = Object.fromEntries([...new Set((p.sections ?? []).flatMap(s2 => s2.lines))].filter(id => !recap.has(id)).map(id => [id, homeOf(id)] as const).filter((x): x is readonly [string, number] => x[1] !== undefined && x[1] !== p.n));
    const rx = rxPlan.get(p.n);
    return { ...p, allowed: [...mine], avoid: [...new Set(resolved.filter(o => o.n !== p.n && [...linesOf(o)].some(id => mine.has(id))).flatMap(o => (o.keys ? o.claims : claimsOf(o)).map(cl => `${o.n}장: ${cl}`)))].slice(0, 6), ...(Object.keys(away).length ? { away } : {}), ...(rx ? { rx } : {}) }; }).map(thinScenes(product));
  // 세운 책은 대운 안의 위치를 책의 해 기준으로(덕짱님 결정 2026-11-11 「2027년 기준으로」 — 엔진 값은 발행일 기준 연차, 계산은 그대로 두고 글만 옮긴다).
  const shift = product === "annual_fortune" ? year - brief.chart.thisYear.year : 0;
  const tidy = (t: string) => shiftPhase(t, year, shift).replace(/(\s*·\s*){2,}/g, " · ").replace(/^\s*·\s*|\s*·\s*$/g, "");
  // 지난 대운이 만 22세 전에 끝났으면 대운 2장 둘째 절(그 시기를 지나며) 근거의 「동료」는 「또래」로(카드가 직장 낱말을 건네지 않게 — 오탐 검토 major past_work).
  const pastSec = product === "major_fortune" && prevDayunEndAge < 22 ? new Set(out.find(c => c.id === "past")?.sections?.[1]?.lines.filter(id => /^(D|N)/.test(id)) ?? []) : new Set<string>();
  const young = (id: string, t: string) => (pastSec.has(id) ? t.replace(/동료/g, "또래") : t);
  const stage = (t: string) => t.replace(new RegExp(`(태|양|쇠|병|사|묘|절)${STAGE_MARK}`, "g"), (_m, ch: string) => `${ch}(${STAGE_HANJA[ch]})`);
  const finalLines = lines.map(l => ({ ...l, value: stage(young(l.id, tidy(l.value))), meaning: young(l.id, tidy(l.meaning)), use: [...(use.get(l.id) ?? [])].sort((a, b) => a - b) }));
  // 2-2 짝은 두 줄이 모두 허용된 장에만. 겹치는 장이 없으면 짝을 뺀다(P2 판독 major-1 P1: N7은 1·2·3장, B1은 7·9장 → 작가가 2장·9장에 나눠 씀).
  const useOf = new Map(finalLines.map(l => [l.id, new Set(l.use)]));
  const pairsOut = pairs.filter(p => p.why).map(p => ({ ...p, use: [...(useOf.get(p.myeongri) ?? [])].filter(n => useOf.get(p.mbti)?.has(n)) })).filter(p => p.use.length).map((p, i) => ({ ...p, id: `P${i + 1}` }));
  const wish = product === "annual_fortune" ? readWish(wishRaw) : null;
  return { product, person: personCard(brief, year, wish), lines: finalLines, pairs: pairsOut, chapters: out, ...(wish?.kind === "ok" && wish.text ? { wish: wish.text } : {}), ...(droppedPlan.length ? { droppedPlan } : {}), ...(!brief.chart.currentDayun ? { noDayun: true } : {}) };
}

type Seen = { readonly tenGod: Map<string, { label: string; rels: ReadonlySet<string>; flow: number }>; readonly life: Map<string, string> };
/** 반합 뜻의 머리(「반합(세 글자 중 두 글자만 모여 반쯤 묶임): 」)는 이름 「… 반합」이 맡는다. 끝은 「…흐름」(AM2-4 3부). */
const relMeaningOf = (b: TimelineEntry["badges"][number]) => relFlow(b.line.replace(/^반합\([^)]*\): /, ""));
const GROUP_DOMAIN: Readonly<Record<string, string>> = { WEALTH: "돈", OFFICER: "일", OUTPUT: "일", RESOURCE: "컨디션", PEER: "관계" };
/**
 * AM2-4 1부 — 달·해 key 카드(사실은 화면, 해석은 본문):
 * - 작가 근거 = 설계도가 고른 핵심 1~2개(엔진 가중치: 일·월 자리 충·합·형 > 대운 겹침 > 그 밖, brief/core.ts) + 가장 센 영역 1~2개(4영역 나열 금지).
 * - 관계 배지 전부·흐름·오행 채움·할 일·그림은 화면 카드가 보여 준다(screen) — 본문은 되풀이하지 않는다. 할 일(todo)은 엔진 문형(처방 배분), 작가는 쓰지 않는다.
 * - 반드시 쓸 것 = 핵심 관계 이름(1~2). 장면 씨앗은 묶음당 하나까지(intake 끝에서 솎는다).
 */
function keyPlan(e: TimelineEntry, mats: readonly Material[], n: number, add: (s: Subject, v: string, m?: string, n?: number) => string | null, brief: Brief, year: number, seen: Seen, seed: (s: string) => string | undefined, dayunTenGod?: string): KeyPlan {
  const month = e.kind === "month", subj: Subject = month ? "month" : "year", unit = month ? "달" : "해";
  const label = keyLabelOf(e);
  const notes = brief.timeline?.tenGodNotes ?? {};
  const stem = e.tenGod.stem, branch = e.tenGod.branch;
  const noteOf = (tg: string) => (notes as Record<string, { meaning: string }>)[tg]?.meaning ?? (Object.entries(notes).find(([k2]) => k2.startsWith(tg.replace(/\(.*$/, "")))?.[1] as { meaning: string } | undefined)?.meaning ?? "";
  const ids: string[] = [];
  const push = (v: string, m = "") => { const id = add(subj, `${label} ${v}`, m, n); if (id) ids.push(id); return id; };
  const rels = e.badges.map(b => b.label.replace(/\(.*\)$/, "").trim()).filter(x => x.length >= 2);
  const deep = mats.find((m): m is Extract<Material, { kind: "evidence" }> => m.kind === "evidence" && m.key.startsWith("depth:"));
  const depth = deep ? (/^핵심 해/.test(deep.facts[0] ?? "") ? "deep" : "short") : undefined;
  const core = coreOf(e, { ...(dayunTenGod ? { dayunTenGod } : {}), short: depth === "short" });
  // 1-4 같은 십성 달·해의 뜻 줄이 앞 key와 같으면 앞 key를 가리키고 엔진 차이(관계·흐름)만.
  const tgNote = (side: "하늘" | "땅", tg: string) => {
    const name = tg.replace(/\(.*$/, ""), prev = seen.tenGod.get(name);
    if (!prev) { push(`${side} 글자 ${tg}`, noteOf(tg)); return; }
    const newRels = rels.filter(r => !prev.rels.has(r));
    const diff = [newRels.length ? `관계 ${newRels.map(relName).join("·")}` : "", prev.flow !== e.flow.score ? `흐름(${FLOW_WORD[prev.flow]}에서 ${FLOW_WORD[e.flow.score]}으로)` : ""].filter(Boolean).join("과 ");
    push(`${side} 글자 ${tg}`, `${name}의 뜻은 앞의 ${prev.label}과 같고${diff ? `, 이 ${unit}에 달라지는 것은 ${diff}` : ""}`);
  };
  for (const c of core) {
    if (c.kind === "rel") push(c.badge.kind === "GONGMANG" ? "공망" : `${c.badge.with ? `${seatShort(c.badge.with)} 자리와 ` : ""}${c.name}`, relMeaningOf(c.badge));
    else if (c.kind === "transition") push(`새 대운 시작: ${e.dayun?.ganji ?? ""}`, `${c.tenGod}의 10년이 이 해부터 열림`);
    else { tgNote(c.side === "sky" ? "하늘" : "땅", c.side === "sky" ? stem : branch); if (c.overlap) push("대운과 겹침", `이 시기가 속한 대운도 ${c.name}의 10년이라 같은 기운이 겹침`); }
  }
  for (const [side, tg] of [["하늘", stem], ["땅", branch]] as const) { const name = tg.replace(/\(.*$/, ""); if (!seen.tenGod.has(name)) seen.tenGod.set(name, { label, rels: new Set(rels), flow: e.flow.score }); void side; }
  // 영역: 가장 센 1~2(세운 달은 영역 신호의 오름·살필, 대운 해는 핵심 자리·십성 묶음). 앞 key와 같은 생활 줄은 건너뛴다(「같은 생활 결」 줄을 주지 않는다).
  const maxDomains = depth === "short" ? 1 : 2;
  const monthFacts = mats.flatMap(m => (m.kind === "evidence" && /^(month|bridge):/.test(m.key) ? m.facts.filter(x => !/^영역 신호/.test(x) && sceneFits(x, brief)) : []));
  const picked: { v: string; m: string }[] = [];
  for (const x of monthFacts) { const mm = /^(연애|돈|일|사람|마음) ([↑↓→]): (.+)$/.exec(x); if (!mm || picked.length >= maxDomains) continue; if (seen.life.has(mm[3])) continue; seen.life.set(mm[3], label); picked.push({ v: mm[2] === "↑" ? `${josa(mm[1], "이가")} 오르는 ${unit}` : `${josa(mm[1], "을를")} 살필 ${unit}`, m: mm[3] }); }
  if (!picked.length) {
    const tgH = stem.match(/\((.+)\)/)?.[1] ?? "", grp = GROUP_DOMAIN[(TEN_GOD_GROUP as Record<string, string>)[tgH] ?? ""] ?? "일";
    const seatD = core.find(c => c.kind === "rel" && /태어난 날/.test(c.badge.with ?? "")) ? "관계" : core.find(c => c.kind === "rel" && /태어난 달/.test(c.badge.with ?? "")) ? "일" : undefined;
    const order = [...new Set([seatD, grp, "일", "돈", "관계", "컨디션"].filter((d): d is string => Boolean(d)))];
    const dl = (e.material?.domains ?? []).filter(x => sceneFits(x, brief));
    for (const d of order) { if (picked.length >= maxDomains) break; const line = dl.find(x => x.startsWith(`${d}: `)); if (!line) continue; const t = line.replace(/^[^:]+: /, ""); if (seen.life.has(t)) continue; seen.life.set(t, label); picked.push({ v: `${d}에서`, m: t }); }
  }
  for (const pk of picked) push(pk.v, pk.m);
  if (e.dayun?.position && !month) push("대운 안의 위치", e.dayun.position.replace(/^\d{4}~\d{4} /, ""));
  if (depth === "deep") push("이 10년에서 눈여겨볼 해", say(deep!.facts[0].replace(/^핵심 해 \d+: /, ""), year));
  const scene = e.material?.scene && sceneFits(e.material.scene, brief) ? seed(say(e.material.scene, year)) : undefined;
  // 화면 카드의 할 일(엔진 문형 — 처방 종류 사전으로 배분된 것). 작가는 쓰지 않는다.
  const todoRaw = e.todo && sceneFits(e.todo, brief) ? say(e.todo, year) : "";
  const when = (e.when ?? e.period ?? "future") as KeyPlan["when"];
  const uniq = [...new Set(ids)];
  const own = uniq.filter(id => id.startsWith(month ? "M" : "Y")).map(id => Number(id.slice(1))).sort((a, b) => a - b);
  const range = own.length ? `${month ? "M" : "Y"}${own[0]}~${month ? "M" : "Y"}${own.at(-1)}` : undefined;
  const fills = e.fillsLack?.fills && e.fillsLack.elements.length ? e.fillsLack.elements : [];
  // 화면이 보여 주는 것(본문 되풀이 금지): 흐름 · 관계 배지 전부 · 오행 채움 · 할 일.
  const screen = [`흐름 ${FLOW_WORD[e.flow.score]}`, ...e.badges.map(b => relName(b.label)), ...(fills.length ? [`${fills.map(x => ELEMENT_SAY[x] ?? x).join("·")} 채움`] : []), ...(todoRaw && when !== "past" ? [`할 일 「${todoRaw}」`] : [])];
  // 2-4 반드시 쓸 것 = 핵심 관계 이름(1~2). 핵심이 십성이면 머리 문장이 이름을 말한다(반드시 쓸 것 없음), 대운 겹침이면 「대운」.
  const must: MustItem[] = core.flatMap((c): MustItem[] => {
    // 다른 꼴도 같은 것으로(오탐 검토 AM2-4 must_miss 18): 카드 뜻의 그림 말 첫 두 어절(「두 창고가」 「물과 불이」 「봄 글자가」) · 「태어난 X 자리(글자)와 + 그 관계 말」.
    if (c.kind === "rel") { const base = c.name.replace(/ 반합$/, ""); const loose = [...base].map(esc).join(" ?·? ?");
      const image = relMeaningOf(c.badge).split(/\s+/).slice(0, 2).map(esc).join("\\s?");
      const kindWord = ({ CHUNG: "충|부딪", HYEONG: "형|다듬|눌러", PA: "파|어긋", HAE: "해|방해", WONJIN: "원진|까끌|미워", YUKHAP: "합|맞물|묶", SAMHAP: "합|반합|묶|모이", BANGHAP: "합|모여|모이", STEM_HAP: "합|어울|묶", GONGMANG: "공망|빠져" } as Record<string, string>)[c.badge.kind] ?? "합|충|형|파|해";
      const seats = (c.badge.with ?? "").split("·").map(x => x.replace(/^태어난 /, "")).filter(Boolean);
      const seatRe = seats.length ? `태어난 (${seats.join("|")})[^.?!]{0,10}(자리|글자)?(와|과)는? [^.?!]{0,16}(${kindWord})` : "";
      return [{ what: c.name, re: [loose, GUK_ALIAS[base], base === "지지형" ? "([자축인묘진사오미신유술해]) ?\\1 ?형|자리와 형이|형이 걸려|글자가 같아|같은 글자끼리" : "", image.length >= 4 ? image : "", seatRe].filter(Boolean).join("|") }]; }
    if (c.kind === "tenGod" && c.overlap) return [{ what: "대운과 겹침", re: "대운" }];
    return [];
  });
  return { key: e.key, label, head: say(e.head ?? "", year), when, lines: uniq, claims: [`${label}: ${core.map(c => c.name).join(" · ")}`], ...(depth ? { depth } : {}), ...(scene ? { scene } : {}), ...(todoRaw && when !== "past" ? { todo: todoRaw } : {}), ...(range ? { range } : {}), must, core: core.map(c => c.name), screen };
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
