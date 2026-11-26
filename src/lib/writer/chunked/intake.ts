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
import { fitSegments, inputsOf, itemFits, neutralize, premiseHits, type Inputs } from "@/lib/brief/premise";
import type { Knowledge } from "@/lib/brief/knowledge";
import type { Brief, Material, TimelineEntry } from "@/lib/brief/schema";
import { FLOW_DESC, FLOW_WORD, POSITION_KO } from "@/lib/brief/labels";
import { JOB_ASSUME, type WriterChapter } from "../prompt";
import { FARMING, presumedPartner } from "../safety/lint";
import { RURAL_PROP } from "../safety/patterns";
import { meaningOf, readWish, WISH_UP_LINE, wishDomainsOf } from "@/lib/brief/design/annual";
import { MAJOR_RX } from "@/lib/brief/design/majorBook";
import { periodLineFits } from "@/lib/brief/design/major";
/** AM2-13 4부: 대운 책당 MBTI 짝 상한. */
export const MAJOR_PAIR_MAX = 3;
import { pairTextIssue } from "./card";
import { dayunPositionKo } from "../safety/lint";
import { cleanSeed, dedupeSentences, dropGeneral, plainCard, predicate, relCondition, seedAsCondition, seedAsMaybe, seedTagsFit, seedTagsOf, SENIORITY_PROP, stripFnCodes, stripRx, unambiguous, unitFix } from "./card";
import { coreOf, REL_SHORT, relFlow, relName, seatShort, TEN_GOD_SHORT } from "@/lib/brief/core";
import { keyLinks, keyPairWhy, rankWishLinks, REASON_OF, type Link, type LinkCtx, type PairReason } from "./link";
import { allocateChapters, rxKindsOf, type RxKind } from "@/lib/brief/prescriptions";
import { josa, TEN_GOD_GROUP } from "@/lib/brief/labels";
import { toneOf } from "./tone";
import { nameDeictics, type NameCtx } from "./names";
/** 줄 값 앞의 key 이름(「7월 · 정미월 …」 「2030년 경술년 …」). */
const LABEL_OF = (v: string) => /^(20\d\d년 [가-힣]{2}년|(?:20\d\d년 )?(?:1[0-2]|[1-9])월 · [가-힣]{2}월)/.exec(v)?.[1];
import { tidyBookPass } from "./tidyBook";
import { atomsOf, CARD_MAX_DROPS, cardPoles, chartFacts, clashesCard, gradeToMeaning, inputClash, loveSignalMeaning, newRefineLog, refineAtom, refineLog, refineText, specificity, tidyCard, type AtomCtx, type TidyItem } from "./refine";

export type Subject = "natal" | "dayun" | "year" | "month" | "mbti" | "input" | "ziwei";
/** AM2-11 1부 5: 원국 짝 기록(도구 · verdict) — Fusion 규칙 id · 뺀 계산 짝 · 계산 짝 대신 규칙으로 만든 짝. */
export type PairLog = { fusion: string[]; removedComputed: string[]; fromRule: string[] };
export const pairLog: { last?: PairLog } = {};
export const SUBJECT_KO: Readonly<Record<Subject, string>> = { natal: "원국(타고난 사주)", dayun: "대운", year: "세운(해 줄)", month: "월운(달 줄)", mbti: "MBTI", input: "고객 입력", /** ZW-2 자미 책(Z 줄). */ ziwei: "자미 명반(Z 줄)" };
const PREFIX: Readonly<Record<Subject, string>> = { natal: "N", dayun: "D", year: "Y", month: "M", mbti: "B", input: "I", ziwei: "Z" };
/** 근거 한 줄: 엔진 값 + 쉬운 뜻 + 쓸 수 있는 장(장 번호). */
export type Line = { readonly id: string; readonly subject: Subject; readonly value: string; readonly meaning: string; readonly use: readonly number[] };
/** 명리 × MBTI 짝. 이 짝만 한 문장 안에서 잇는다. use = 두 줄 모두 허용된 장. */
export type Pair = { readonly id: string; readonly myeongri: string; readonly mbti: string; readonly why: string; readonly use?: readonly number[]; /** AM2-5 1부 key 짝: 이 key에서만. */ readonly key?: string; /** AM2-11: Fusion DB 규칙 id(있으면). */ readonly fusionId?: string; /** AM2-11: 세운 MBTI 줄 짝의 원문(꼬리표 열쇠). */ readonly srcText?: string;
  /** AM2-6 2부: 잇는 이유(공통·보완·긴장). 이유가 없는 짝(「같은 때」만)은 만들지 않는다. */ readonly reason: PairReason };
/** key에서 반드시 쓸 것(2-4): 이름과 본문에서 찾을 꼴(정규식 원문). */
/** re = 이름·국 별칭·뜻 그림 말(어디서든), weak = 「자리 + 그 관계 종류 말」(그 마디에 다른 관계 이름이 없을 때만 — 오탐 검토 2차: 「태어난 날과 육합」이 겨울 방합을 지우던 것). */
export type MustItem = { readonly what: string; readonly re: string; readonly weak?: string };
/** 반복 장 key 하나(세운 달·대운 연도): 그 시기 카드. head는 시스템이 첫 문장으로 넣는 머리 문장(작가는 되풀이하지 않는다). */
/** AM2-4 1부: core = 설계도가 고른 핵심(엔진 가중치, 1~2개 이름) · screen = 화면 카드가 보여 주는 사실(본문은 되풀이하지 않는다) · todo = 화면 카드의 할 일(엔진·처방 배분, 작가는 쓰지 않는다). */
/** AM2-5 1부: links = 엔진이 만든 연결 고리(0~2, link.ts) · pair = key 짝 id · pointer = 같은 값이 앞 key에 있을 때 엔진이 만든 가리키기 말. */
export type KeyPlan = { /** AM2-13 4부 대운: 핵심 이름 → 뜻 한 마디(고리 재료에 뜻이 없을 때). */ readonly coreWords?: Readonly<Record<string, string>>; readonly key: string; readonly label: string; readonly head: string; readonly when: "past" | "current" | "future"; readonly lines: readonly string[]; readonly claims: readonly string[]; readonly depth?: "deep" | "short"; readonly scene?: string; readonly todo?: string; readonly range?: string; readonly must?: readonly MustItem[]; readonly core?: readonly string[]; readonly screen?: readonly string[];
  readonly links?: readonly Link[]; readonly pair?: string; readonly pointer?: string;
  /** AM2-6 2부 짝 범위(명리 쪽): 그 key의 하늘 십성 줄과 그 십성에서 나온 영역 줄 id. 이 밖(고리·관계 줄·다른 십성·대운)과 MBTI를 잇지 않는다. */ readonly pairScope?: readonly string[];
  /** AM2-6 1부: 이 key의 영역(카드 줄·고리 자리) — 장면 씨앗은 이 영역 안에서만. */ readonly areas?: readonly string[];
  /** AM2-6 1부: 엔진이 고른 바람 고리(책에서 1~3 key만). */ readonly wishLink?: string;
  /** AM2-6 3부: 장면 씨앗의 영역(areas 안이어야 한다 — 2,010명 검사). */ readonly sceneArea?: string;
  /** AM2-9 4부: 세운 장면이 MBTI 장면 씨앗에서 왔다(짝이 빠지면 장면도 뺀다). */ readonly sceneMbti?: true;
  /** AM2-6 4부: 이 key의 대운 안 위치 값(위치 말은 이 값으로만). */ readonly position?: string;
  /** AM2-7 3부 6: 설계도가 정한 첫머리 방식 · 고리 문장 꼴 · 짝 문장 꼴(장 안에서 같은 방식 셋째 없음 · 같은 꼴 둘까지). */ readonly opener?: string; readonly linkForm?: string; readonly pairForm?: string;
  /** AM2-8 2부 뿌리 3: 고리 · 짝이 없는 key의 이 사람 재료(고객이 적은 입력 사실 하나 × 그 key 영역). */ readonly own?: string;
  /** AM2-10 2부 7: 이 달 · 해 기조 한 줄(tone.ts toneOf — 화면 카드 칩과 같은 함수, 등급 낱말 없이 · 작가는 지키고 본문에 옮기지 않는다). */ readonly tone?: string };
/** AM2-5 2부: pointer = 같은 주장이 앞 장에 있을 때 엔진이 만든 가리키기 말(「앞에서 본 2월 · 임인월, 7월 · 정미월」) — 이 절은 주장을 다시 쓰지 않는다. */
export type SectionPlan = { readonly q: string; readonly lines: readonly string[]; readonly angle?: string; readonly claims: readonly string[]; readonly claimIds?: readonly string[]; readonly recapIds?: readonly string[]; readonly scene?: string; readonly pointer?: string; readonly pointerIds?: readonly string[];
  /** ZW-2 자미 책: 소제목 지시 4칸(핵심 · 이 사람 재료 · 짝 또는 장면 · 기조 — 기조는 지킬 것, 본문에 옮기지 않는다). 있으면 chapterText가 이 꼴로 쓴다. */ readonly slots?: { readonly core: string; readonly own: string; readonly third?: string; readonly tone: string } };
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
  readonly rx?: { readonly use: RxKind | null; readonly forbid: readonly RxKind[]; /** AM2-13 4부 대운: 사전 배분 처방 말 · 소제목마다. */ readonly label?: string; readonly each?: boolean };
  /** AM2-6 1부: 바람 고리(엔진이 고른 1~3 key) — 1장 · 소망 장에서만 가리킨다. */
  readonly wishLinks?: readonly string[];
  /** AM2-7 3부 9: 처방을 둘 소제목(없으면 마지막 소제목). */
  readonly rxAt?: number;
};
export type Intake = { /** AM2-13 4부 대운: 5장 앞 묶음 해 수(막 경계에 가장 가까운 4~6). */ readonly keySplit?: number; readonly product: "annual_fortune" | "major_fortune" | "ziwei_full"; readonly person: readonly string[]; readonly lines: readonly Line[]; readonly pairs: readonly Pair[]; readonly chapters: readonly ChapterPlan[]; readonly wish?: string; /** AM2-11: 상한으로 남긴 성향 반대 쌍(기록). */ readonly tidyOver?: readonly string[];
  /** 2-1 근거가 없어 뺀 절(기록). */ readonly droppedPlan?: readonly string[];
  /** 엔진이 대운을 계산하지 못한 대운 책(출생 시각 미상 일부 — 계산은 보호 대상, 결정 필요로 보고). */ readonly noDayun?: boolean;
  /** AM2-6 4부: 대운 안 위치 값(해마다 「2027년: 무진 대운 3번째 해(앞쪽)」). 본문의 위치 말은 이 값으로만. */ readonly positions?: readonly string[];
  /** AM2-7 3부 2: 카드 안 어긋남 경보(칸과 줄 방향 · 오르는 달 = 쉴 달 · 「뚜렷한 달 없음」인데 무리). */ readonly cardAlarms?: readonly string[];
  /** AM2-7 2부: 입력 축(일 · 관계 · 자녀 · 사는 곳) — 낱말표 판정에 쓴다. jobDetail = 하는 일 상세를 적었는지(작가 규칙 조립용 — 문장 재료가 아니다). */ readonly inputs?: Inputs; readonly jobDetail?: boolean };

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
  major_fortune: [["read", "past"], ["now", "turn"], ["keys:0-5"], ["keys:5-"], ["map", "next"], ["plan", "letter"]],
  // ZW-2 자미 9장(ziwei/design ZIWEI_CHUNK_GROUPS와 같은 표): [1+2] [3+4] [5] [6+7] [8] [9].
  ziwei_full: [["read", "me"], ["inner", "moneywork"], ["love"], ["people", "rhythm"], ["mutagen"], ["decade"]],
};
/** AM2-13 4부: 대운 5장 나누기는 사람마다(막 경계에 가장 가까운 곳, 두 묶음 4~6해). 세운 · 옛 대운은 표 그대로. */
export const chunkGroupsOf = (x: { readonly product: Intake["product"]; readonly keySplit?: number }): readonly (readonly string[])[] =>
  x.product === "major_fortune" && x.keySplit ? CHUNK_GROUPS.major_fortune.map(g => g.map(id => (id === "keys:0-5" ? `keys:0-${x.keySplit}` : id === "keys:5-" ? `keys:${x.keySplit}-` : id))) : CHUNK_GROUPS[x.product];
/** AM2-4 2부: 장면 씨앗은 묶음당 하나까지(필수 아님). 장 장면 → 절 장면 → key 장면 순으로 첫 하나만 남긴다(대운은 깊은 key 먼저). */
const omitScene = <T extends { readonly scene?: string }>(o: T): T => { const c = { ...o }; delete (c as { scene?: string }).scene; return c; };
function thinScenes(product: Intake["product"]) {
  const groups = CHUNK_GROUPS[product];
  const keepOf = new Map<string, string>(); // 묶음 번호 → 남긴 자리
  return (p: ChapterPlan): ChapterPlan => {
    const slot = (pos: string, gi: number) => { const k2 = String(gi); if (!keepOf.has(k2)) keepOf.set(k2, pos); return keepOf.get(k2) === pos; };
    if (p.keys) {
      // AM2-5 1부(덕짱님 지시): key의 절반 이상에 입력에 맞는 장면 하나 — 묶음 몫과 따로 센다. 짝이 없는 key부터(이 사람 몫이 고르게), 같은 수면 앞 key부터.
      const want = Math.ceil(p.keys.length * KEY_SCENE_SHARE);
      const order = p.keys.map((k2, idx) => ({ k2, idx })).filter(x => x.k2.scene).sort((a, b) => Number(Boolean(a.k2.pair)) - Number(Boolean(b.k2.pair)) || a.idx - b.idx);
      const keep = new Set(order.slice(0, want).map(x => x.k2.key));
      return { ...p, keys: p.keys.map(k2 => (k2.scene && keep.has(k2.key) ? k2 : omitScene(k2))) };
    }
    const gi = groups.findIndex(g => g.includes(p.id));
    const scenes = (p.scenes ?? []).filter((_x, j) => slot(`ch:${p.n}:${j}`, gi));
    const sections = (p.sections ?? []).map((s2, j) => (s2.scene && slot(`sec:${p.n}:${j}`, gi) ? s2 : omitScene(s2)));
    return { ...p, ...(scenes.length ? { scenes } : { scenes: undefined }), ...(p.sections ? { sections } : {}) };
  };
}
/** AM2-5 1부: 장면을 받는 key 몫(절반 이상). */
export const KEY_SCENE_SHARE = 0.6;
/** AM2-5 1부: 짝을 받는 key는 이웃하지 않게(같은 짝은 책에서 한 번 — 결과는 절반 안). */
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

/** AM2-6 3부: 장면 씨앗 거름 = 뜻 거름(sceneFits) + 씨앗 조건 꼬리표(관계 상태 · 일 · 필요한 상세). 입력과 맞지 않거나 모르는 상세가 필요한 씨앗은 고르지 않는다. */
// AM2-7 2부: + 낱말표(필요한 입력) — 씨앗 글의 전제 말이 입력과 맞지 않으면 고르지 않는다(호감 · 자취방 · 킥오프 · 영업 전화 — P6 판독 차단 넷).
export const seedFits = (s: string, brief: Brief, base: Parameters<typeof seedTagsOf>[1] = {}) => sceneFits(s, brief) && seedTagsFit(seedTagsOf(s, base), brief.person.facts) && !premiseHits(s, inputsOf(brief.person.facts)).length;
/** 장면 씨앗 영역(mbti-seeds 영역 이름)을 글에서 읽는다(엔진 장면 · 장 장면 힌트용). */
export function seedDomainOf(s: string): string {
  if (/돈|지출|결제|통장|적금|월급|가계부|할인|장바구니|쇼핑|용돈|더치페이|송금|저축|카드값|영수증|가격/.test(s)) return "money";
  if (/연인|데이트|소개팅|썸|고백|애인|연애|커플|남자친구|여자친구|기념일|첫 만남/.test(s)) return "love";
  if (/회의|업무|마감|프로젝트|보고|발표|거래처|출근|퇴근|과제|기획|이력서|면접|포트폴리오|일정|견적|작업/.test(s)) return "work";
  if (/친구|모임|단톡|동료|가족|부모|이웃|사람들|연락처|안부|약속|선물/.test(s)) return "relationships";
  return "alone";
}

// ---------- 주체 분류 ----------
const ANNUAL_SUBJECT: Readonly<Record<string, Subject>> = { yearCard: "year", yearEnergy: "year", yearMbti: "year", wishLink: "input", wish: "input", wishTiming: "month", loveYear: "year", loveMonths: "month", moneyIn: "year", moneyHole: "month", workYear: "year", workCriteria: "month", studyYear: "year", helpers: "year", carePeople: "year", mindPush: "year", mindRest: "month", useDo: "year", useAvoid: "year", lucky: "natal", samjae: "year", dayunBridge: "dayun" };
const MAJOR_SUBJECT: Readonly<Record<string, Subject>> = { toc: "dayun", nowHead: "dayun", turnTable: "dayun", mapMoneyWork: "dayun", mapMind: "dayun", nextHead: "dayun", nextRelation: "dayun", letter: "dayun", dayunHow: "dayun", lifetime: "dayun", pastSummary: "year", pastDayun: "dayun", nowTheme: "dayun", nowRelation: "dayun", nowCards: "dayun", turnWhen: "dayun", turnMind: "dayun", mapWorkMoney: "dayun", mapLovePeople: "dayun", mapMindMove: "dayun", growthCurve: "mbti", growthDayun: "dayun", ageGrowth: "dayun", ageNext: "dayun", planNear: "year", planFar: "year" };
const MONTH_IN = /(1[0-2]|[1-9])월 · [갑을병정무기경신임계][자축인묘진사오미신유술해]월|[갑을병정무기경신임계][자축인묘진사오미신유술해]월/;
const subjectOfFact = (key: string, fact: string, product: Intake["product"]): Subject => {
  // AM2-11 1부 1: 바람 영역별 달 줄(「바람의 일 쪽이 오르는 달: …」)은 월운 줄(옛 「그 바람과 이어지는 영역이 오르는 달」과 같은 칸).
  if (/^바람의 [가-힣·]+ 쪽(?:이 오르는| 속도를 늦출) 달: /.test(fact)) return "month";
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

export function buildIntake(brief: Brief, k: Knowledge, plan: readonly WriterChapter[], wishRaw?: string, opts: { readonly timeSlot?: string } = {}): Intake {
  // AM2-13 4부: 새 대운 책(9장 「내 인생이라는 책」 — 계획 있음).
  const majorBook = brief.product === "major_fortune" && Boolean(brief.timeline?.major);
  const product = brief.product as Intake["product"];
  const year = product === "annual_fortune" ? Number(brief.timeline?.entries.find(e => e.kind === "year")?.key) || brief.chart.thisYear.year : brief.chart.thisYear.year;
  const lines: Line[] = [], pairs: Pair[] = [];
  const counter: Record<Subject, number> = { natal: 0, dayun: 0, year: 0, month: 0, mbti: 0, input: 0, ziwei: 0 };
  const byText = new Map<string, Line>();
  const use = new Map<string, Set<number>>();
  // 뜻 문장도 입력에 맞지 않는 상황(연차·팀원·직원·자녀·연인 전제·학교·거주 전제)이면 그 마디만 뺀다. 일반론(이 사람에게 해당하는지 모르는 규칙 문장)도 뺀다.
  // AM2-6 3부: 직장인이 아니면 직장 전제 말(월급 · 직함 · 윗사람 · 상사 · 회사)이 든 마디도 뺀다.
  const employee = brief.person.facts.job.status === "employee";
  // AM2-7 2부: 직장 전제 금지어(EMPLOYEE_PREMISE) 대신 낱말표(필요한 입력) — 맞지 않는 전제 말은 중립 꼴(월급날 → 수입이 들어오는 날 · 동료 → 함께 일하는 사람 …)로, 없으면 그 마디를 뺀다.
  const inputs = inputsOf(brief.person.facts);
  const fits = (t: string) => t.split(/(?<=[.!?])\s+| · /).filter(x => sceneFits(x, brief, true)).map(x => neutralize(x, inputs)).filter((x): x is string => Boolean(x)).join(" · ");
  void employee;
  // AM2-10 2부 카드 정제 층(refine.ts): 원국 조건 판정 · 규칙 · 면책 · 메타 · 처방(원국) · 입력 전제 · 성향 반대 정리. 기록은 refineLog.last(도구 · 보고).
  const rlog = newRefineLog(); refineLog.last = rlog;
  const chart = chartFacts(brief);
  const genCtx: AtomCtx = { chart, inputs, natal: false };
  const add = (subject: Subject, value: string, meaning0 = "", n?: number): string | null => {
    const clash = inputClash(value, inputs); if (clash) { rlog.dropped.push({ kind: "trait", text: value, why: clash }); return null; }
    // 값 칸이 문장인 줄(그림자 · 삼재 풍습 · 십이신살 메모)도 같은 거름 — 다 빠지면 줄째 뺀다.
    if (/[.!?]$|니다|어요|에요/.test(value.trim())) { const v1 = refineText(value, genCtx, rlog, undefined, value.includes(" · ") ? " · " : " "); if (!v1.trim()) return null; value = v1; }
    const meaning = refineText(meaning0, genCtx, rlog);
    if (meaning0.trim() && !meaning.trim() && subject !== "mbti") return null;
    const unit = subject === "month" ? "달" : subject === "dayun" ? "10년" : "해";
    // AM2-13 2부(S-final r1117 Y15 「정해진 뜻밖의 작은 수입을 궁리하게 되는 때」): 낱말표 중립 꼴(「월급 밖 수입」 → 「뜻밖의 작은 수입」 · 「본업 밖 수입」)이 앞 꾸밈말 「정해진」(월급을 꾸미던 말)을 남긴다 — 세운·대운 카드에서 뗀다(premise.ts 낱말표는 4종 보호로 그대로).
    const orphanMod = (t: string) => t.replace(/정해진 (?=뜻밖의 작은 수입|본업 밖 수입)/g, "");
    const v = unitFix(orphanMod(say(value, year)), unit), m0 = unitFix(orphanMod(dropGeneral(fits(say(meaning, year)), { weak: /WEAK/.test(brief.chart.strength.level) })), unit);
    // 낱말표 중립 꼴(neutralize)이 연애 전제를 새로 만들 수 있다(연애 중에게 「좋아하는 사람이 생기면」 → 「연인이 생기면」) — 바꾼 뒤 한 번 더 거른다.
    if (inputClash(v, inputs)) return null;
    const m = m0.split(" · ").filter(a => { const c2 = inputClash(a, inputs); if (c2) rlog.dropped.push({ kind: "trait", text: a, why: `${c2}(중립 꼴 뒤)` }); return !c2; }).join(" · ");
    if (!v || v.length < 2) return null;
    // AM2-7 재현(R7 major-p5 Y17 「2031년 신해년 관계 쪽」 — 기혼에게 맞지 않는 뜻 마디를 거르고 값만 남음): 뜻이 있던 줄이 입력 거름으로 다 비면 줄째 뺀다.
    if (meaning.trim() && !m.trim() && subject !== "mbti") return null;
    if (premiseHits(v, inputs).length) { const v2 = neutralize(v, inputs); if (!v2) return null; return add(subject, v2, meaning, n); }
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
  const general = (x: string) => x.split(/(?<=[.!?])\s+/).filter(y => !/(일주|월주|연주|시주|일지|월지|연지|시지)에 (있을 때|있으면|오면|놓이면)/.test(y)).join(" ");
  const partsOf = (t: Brief["traits"][number]) => [t.meaning, t.forYou, ...t.good, t.overuse ?? ""].filter(Boolean).map(x => general(x!)).filter(Boolean);
  const tctx = (t: Brief["traits"][number]): AtomCtx => ({ chart, positions: t.positions, name: t.name, inputs, natal: true });
  // AM2-10 2부 6: 카드 성향 반대 정리(원국 특징 · MBTI 기능 문장, 같은 사람 · 같은 차원 반대 끝 → 덜 구체적인 출처를 뺀다, 권당 16).
  const mbtiFnSentences = brief.mbti ? (k.mbti.get(brief.mbti.type as never)?.cognitiveFunctions ?? []).map(fn => fn.easy.split(/(?<=[.!?])\s/)[0]) : [];
  const tidyItems: TidyItem[] = []; let tidyOrder = 0;
  for (const t of brief.traits) { if (!t.chapters.length) continue; for (const raw of [t.meaning, t.forYou, ...t.good, t.overuse ?? ""].filter(Boolean) as string[]) { const part = general(raw), as = part ? atomsOf(part) : [];
    // W7 꼬리표는 칸 단위 — 한 문장짜리 칸만 칸 꼬리표를 문장 꼬리표로 쓴다(여러 문장 칸에 물려주면 문장마다 같은 차원이 붙어 과하게 뺀다 — 시험 2,004명 권당 5.7 · 상한 넘는 권 81).
    for (const a of as) if (refineAtom(a, tctx(t)).text !== null) tidyItems.push({ text: a, owner: t.id, rank: specificity(t.featureId, t.positions.length), order: tidyOrder++, ...(atomsOf(raw).length === 1 ? { field: raw } : {}) }); } }
  const mbtiFnFull = brief.mbti ? (k.mbti.get(brief.mbti.type as never)?.cognitiveFunctions ?? []).map(fn => fn.easy) : [];
  mbtiFnSentences.forEach((a, i) => tidyItems.push({ text: a, owner: "mbti", rank: specificity(null, 0), order: tidyOrder++, field: mbtiFnFull[i] }));
  const cardPoleMap = cardPoles(brief, k);
  const tidyGone = tidyCard(tidyItems, k, cardPoleMap, rlog);
  const tidyKept = tidyItems.filter(i => !tidyGone.has(i.text));
  const seedClash = (s0: string) => clashesCard(s0, tidyKept, k, cardPoleMap);
  for (const t of brief.traits) {
    if (!t.chapters.length) continue;
    // AM2 P2 판독(major-1 3장 「갑인일주의 백호대살」, 카드는 태어난 달): 자리를 값으로(AM2-3 1-3: 「백호대살(태어난 달 · 임술)」), 지식 DB 일반론(「…있을 때 봅니다」)은 뺀다.
    const seat = t.positionNote?.match(/^(태어난 (?:해|달|날|시각)) 자리/)?.[1] ?? (/^(shinsal|twelveStage|noble|relation)/.test(t.featureId) && t.positions.length === 1 ? SEAT_KO[t.positions[0]] : undefined);
    const posOf = Object.entries(SEAT_KO).find(([, ko]) => ko === seat)?.[0] as keyof typeof c.pillars | undefined;
    const ganji = posOf ? (c.pillars as Record<string, { hangul: string } | undefined>)[posOf]?.hangul : undefined;
    // AM2-4 3부: 괄호 값(「백호대살(태어난 달 · 임술)」)을 고객 말로 — 「태어난 달 자리의 백호대살」. 십이운성 한 글자 이름은 한자 표시(쇠(衰)).
    void ganji;
    const baseName = t.name.replace(/\(.*\)$/, "").trim();
    const nm = /^twelveStage/.test(t.featureId) && STAGE_HANJA[baseName] ? `${baseName}${STAGE_MARK}` : t.name;
    // AM2-11 1부 3(P10 annual-1 「태어난 날 땅 글자는 사(死)로」 — 줄 이름 「태어난 날 자리의 사(死)」를 땅 글자로 읽음): 십이운성 · 신살 줄 이름에는 종류를 붙인다.
    const kind = /^twelveStage/.test(t.featureId) ? "십이운성 " : /^shinsal/.test(t.featureId) ? "신살 " : "";
    // AM2-11 1부 4: 성향 정리 뒤 특성 줄이 비면(줄째 사라짐) 정리가 뺀 첫 문장 하나를 되살린다 — 그 근거를 쓰는 장 · 동음 표시가 비지 않게(정리 기록에서는 뺀다).
    const vName = `${seat ? `${seat} 자리의 ` : ""}${kind}${nm}`;
    // AM2-12 1부 3(P11 annual-1 「태어난 날 자리의 십이운성 사(死) | 너무 빨리 끝냅니다.」 — 뜻 문장은 정리로 다 빠지고 숙제(overuse) 첫 조각만 남아 근거 뜻이 바뀜):
    //  뜻 문장(뜻 · 너에게 · 좋은 점)이 하나도 남지 않으면 숙제 조각만으로 줄을 만들지 않는다 — 줄이 빈 것으로 보고 아래 되살림으로 간다.
    const refined = (xs: readonly (string | undefined)[]) => xs.filter(Boolean).map(x => general(x!)).filter(Boolean).map(p => refineText(p, tctx(t), rlog, tidyGone)).filter(Boolean);
    const core = refined([t.meaning, t.forYou, ...t.good]), over = refined([t.overuse]);
    // 카드 줄 뜻으로 남는지는 add와 같은 거름(일반론 · 입력 전제)으로 본다(「…에 있을 때 붙는 이름입니다」 같은 일반론은 add에서 빠진다).
    const coreLeft = core.length > 0 && dropGeneral(fits(say(refineText(core.join(" · "), genCtx, newRefineLog()), year)), { weak: /WEAK/.test(brief.chart.strength.level) }).trim().length > 0;
    const parts = coreLeft ? [...core, ...over] : [];

    // 뜻 문장이 있던 줄이 다 걸러졌으면(일반론 · 조건 · 정리) 이름만 남기지도 않는다 — 이름만 주면 작가가 뜻을 지어 쓴다(P11 annual-1 쇠 「속도를 낮추고」 ↔ 1장).
    const emptied = !coreLeft && (core.length > 0 || over.length > 0);
    if (emptied) rlog.dropped.push({ kind: "trait", text: `${vName} | ${over.join(" · ")}`, why: over.length ? "뜻 문장 없이 숙제 조각만 남음(AM2-12 1부 3)" : "뜻 문장이 다 걸러짐(AM2-12 1부 3)" });
    let id = emptied ? null : add("natal", vName, parts.join(" · "));
    // AM2-12 1부 3: 줄이 비면 남은 카드와 반대가 아닌 원자만 되살린다(씨앗 거름과 같은 판정 — 정리가 뺀 원자는 대개 반대라 되살리지 않는다). 없으면 줄을 뺀다.
    if (!id) { const scratch = newRefineLog(), back = partsOf(t).map(p => refineText(p, tctx(t), scratch)).filter(Boolean).flatMap(b2 => atomsOf(b2)).find(a => tidyGone.has(a) && !seedClash(a));
      if (back) { id = add("natal", vName, [...parts, back].join(" · ")); const i = rlog.tidy.findIndex(x2 => x2.text === back); if (id && i >= 0) { rlog.tidyOver.push({ ...rlog.tidy[i], why: `${rlog.tidy[i].why} → 특성 줄 마지막 문장이라 남김` }); rlog.tidy.splice(i, 1); } } }
    if (id) traitId.set(t.id, id);
  }
  const weak = /WEAK/.test(c.strength.level);
  // AM2-6 3부: 카드 칸 머리(「숙제로 볼 점:」)를 작가가 본문에 옮겼다(R-M21) — 머리 없이 값만.
  const shadowId = new Map(brief.shadows.map(s => [s.id, add("natal", dropGeneral(say(s.text, year), { weak }).replace(/ · /g, " "), [s.basis, s.warmTurn].join(" · "))] as const));
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
  const mbtiType = mbti ? add("mbti", `MBTI ${mbti.type}`, mbtiFnSentences.filter(x => !tidyGone.has(x)).join(" · ")) : null;
  const pairWhy = (t: string) => fitSegments(dedupeSentences(stripFnCodes(say(t, year), mbti?.type)), inputs);
  /** AM2-7 3부 7: 짝을 만들지 못한 대운 성장 곡선 장(소제목을 나란히 꼴로). */
  const growthParallel = new Set<number>();
  // AM2-6 2부: 짝은 잇는 이유(Fusion DB 규칙 종류 — 공통·보완·긴장)가 있을 때만.
  // AM2-11 1부 5(덕짱님 결정 2026-11-17 2번): 원국 짝은 Fusion DB 규칙(원국 id × 그 사람 MBTI)만 — 계산 짝(computed · mbtiLink)은 짝 카드로 만들지 않는다.
  //  특성이 계산 짝을 골랐어도 Fusion 규칙이 있으면 그 규칙으로 짝을 만든다. 기록은 pairLog(verdict 「계산 짝 뺀 수 · 남은 수」).
  const plog: PairLog = { fusion: [], removedComputed: [], fromRule: [] }; pairLog.last = plog;
  for (const t of brief.traits) {
    if (!mbtiType || !mbti || !traitId.get(t.id)) continue;
    // Fusion 규칙 대상은 유형(720) 또는 유형 글자(「E」 1 — 도화살 × E): 그 사람 유형에 대상 글자가 모두 들면 그 사람 규칙이다.
    const fits = (target: string) => target === mbti.type || (target.length < 4 && [...target].every(ch => mbti.type.includes(ch)));
    const rule = (k.fusionByFeature.get(t.featureId) ?? []).find(r => r.mbtiTarget === mbti.type) ?? (k.fusionByFeature.get(t.featureId) ?? []).find(r => fits(r.mbtiTarget));
    const src = t.fusion?.source === "fusion" && fits(t.fusion.target) ? { kind: t.fusion.kind, why: t.fusion.why } : rule ? { kind: rule.kind, why: rule.why } : null;
    if (t.fusion && t.fusion.source !== "fusion" && t.chapters.length) plog.removedComputed.push(`${t.name}:${t.fusion.source}`);
    const reason = src ? REASON_OF[src.kind] : undefined; if (!src || !reason) continue;
    if (t.fusion?.source !== "fusion") plog.fromRule.push(t.name);
    plog.fusion.push(rule?.id ?? `${t.featureId}:${mbti.type}`);
    pairs.push({ id: `P${pairs.length + 1}`, myeongri: traitId.get(t.id)!, mbti: mbtiType, why: pairWhy(src.why), reason, ...(rule ? { fusionId: rule.id } : {}) });
  }
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
    // AM2-13 2부(S-final r1117 「ENTP의 때는 혼자 영화관에서 …」 · P12 「ESFJ의 때로 보면」): 줄 이름 「…의 장면」은 card.ts unambiguous가 「…의 때」로 바꿔 작가가 주어로 옮겼다 — 「…다운 모습」.
    if (m.kind === "mbti") { if (!mbtiType) return []; use.get(mbtiType)!.add(n); const sc = seedFits(m.scene, brief) && !seedClash(m.scene) ? seedAsCondition(m.scene) : null; const id = sc ? add("mbti", `${mbti!.type}다운 모습`, sc, n) : null; return [mbtiType, ...(id ? [id] : [])]; }
    if (m.kind === "evidence") {
      evidenceKey?.(m.key);
      if (/^(depth|month|bridge):/.test(m.key)) return [];
      if (m.key === "yearMbti") {
        // 명리 × MBTI: 첫 줄(명리 쪽)과 나머지(그 유형이 이 기운에 어떻게 반응하는지 — 지식 DB annual-mbti)를 짝으로.
        const [head, ...rest] = m.facts.filter(x => !DIRECTIVE_FACT.test(x));
        const my = head ? add("year", split(head).value, split(head).meaning, n) : null;
        // AM2-6 2부: 지식 DB annual-mbti 줄은 「그 해 기운을 이 유형이 겪는 쪽」(반응 = 공통)과 「함정 → 쓰는 법」(긴장) — 잇는 이유가 있는 짝.
        // AM2-9 4부: 짝 이유 글은 뜻만(「→ 처방」 뗌 — 처방은 사전 배분으로만). 잇는 이유(긴장 · 공통)는 뗀 앞 원문으로 가른다.
        if (my && mbtiType) { use.get(mbtiType)!.add(n); for (const r of rest) pairs.push({ id: `P${pairs.length + 1}`, myeongri: my, mbti: mbtiType, why: pairWhy(meaningOf(r)), reason: /→|쉬움|쉽다/.test(r) ? "긴장" : "공통", srcText: meaningOf(r) }); }
        return [my, mbtiType].filter(Boolean) as string[];
      }
      if (m.key === "growthDayun") {
        // AM2-3 2-2(P2 판독 major-1 P3 「다음 대운 주제」 · P4 B5 문구 복사 — 연결 뜻 없는 짝): 짝은 「같은 나이대에 겹친다」는 엔진 사실 하나로만(major.ts growthDayun 첫 줄).
        const [head, overlap] = m.facts.filter(x => !DIRECTIVE_FACT.test(x));
        const my = head ? add("dayun", split(head).value, split(head).meaning, n) : null;
        // AM2-6 2부(덕짱님 지시): 「같은 나이대에 겹친다」는 같은 때일 뿐 잇는 이유가 아니다 — 짝을 만들지 않는다(두 흐름은 각자 근거로).
        void overlap;
        // AM2-7 3부 7: 대운 하늘 십성 × 이 유형에 Fusion 이유가 있으면 짝(그 장에서만). 없으면 소제목을 잇지 않는 나란히 꼴로(아래 growthParallel).
        const dtg = (c.currentDayun?.tenGod ?? "").replace(/\(.*$/, "");
        const got = my && mbtiType && mbti && dtg ? keyPairWhy(k, dtg, mbti.type, t => sceneFits(t, brief, true)) : null;
        // R7 판독(major-p6a 7.1): 같은 십성이 든 연도 key 짝과 같은 이유 글(「ENFJ는 먹는 사람의 표정에서 보람을 얻습니다」)이면 장 짝으로 쓰지 않는다 — 되풀이 · 물음과 어긋남.
        const why7 = got ? pairWhy(got.why) : "";
        if (got && my && !pairs.some(pp => pp.why === why7)) { use.get(mbtiType!)!.add(n); pairs.push({ id: `P${pairs.length + 1}`, myeongri: my, mbti: mbtiType!, why: why7, reason: got.reason, use: [n] }); return [my, mbtiType].filter(Boolean) as string[]; }
        // AM2-8 2부(덕짱님 결정 3 · R-B6): 짝이 없으면 7.1에는 대운 줄만 — MBTI 유형 줄을 주지 않는다(7.0 성장 곡선이 MBTI 쪽을 맡는다).
        growthParallel.add(n);
        return my ? [my] : [];
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
  const seen = { tenGod: new Map<string, { label: string; rels: ReadonlySet<string>; flow: number }>(), life: new Map<string, string>(), overlap: new Map<string, string>() };
  // 세운 달의 「대운 겹침」: 책의 해가 속한 대운의 천간 십성(엔진 cycles 값).
  const annualDayunTg = product === "annual_fortune" ? (brief.timeline?.cycles ?? []).find(cy => { const [a1, b1] = cy.years.split("~").map(Number); return a1 <= year && year <= b1; })?.tenGod ?? c.currentDayun?.tenGod : undefined;
  const chapters: ChapterPlan[] = built;
  // AM2-5 1부 연결 고리 문맥: 적은 바람 주제(세운, 바람이 ok일 때) · 바람 달(설계도 wishMonths와 같은 셈 — 바람 영역 가운데 하나가 오르고 어느 영역도 늦추지 않는 달, 앞 셋).
  const wishRead = product === "annual_fortune" ? readWish(wishRaw) : null;
  const wishTopics = wishRead?.kind === "ok" ? wishRead.topics : [];
  // AM2-11 1부 1: 바람 달은 바람 영역마다(그 영역 칩이 오르는 달, 앞 셋 — 설계도 wishLink 줄과 같은 셈 · 1월 다리 포함).
  const listEntries = (brief.timeline?.entries ?? []).filter(e => e.kind === "month");
  const wishMonthsBy = new Map(wishDomainsOf(wishTopics as readonly ("love" | "money" | "work" | "people" | "mind" | "study")[]).map(w => [w.d, new Set(listEntries.filter(m => m.signals?.[w.d] === "↑").map(keyLabelOf).slice(0, 3))] as const));
  const linkCtx: LinkCtx = { brief, k, wishTopics, wishMonths: new Set([...wishMonthsBy.values()].flatMap(s => [...s])), wishMonthsBy, ...(annualDayunTg ? { dayunTenGod: annualDayunTg } : {}), echoed: new Set(), seatUsed: new Map() };
  for (const ch of plan) built.push((() => {
    const cb = brief.chapters.find(x => x.id === ch.id) ?? brief.chapters.find(x => x.id.startsWith(`${ch.id}:`));
    const sc = seedCtx(ch.id);
    const scene = (hints: readonly string[] | undefined) => { const got = seedOnce((hints ?? []).map(h => cleanSeed(say(h, year), sc)).find(h => h && seedFits(h, brief))); return got ? seedAsCondition(got) : undefined; };
    if (ch.keys) {
      // AM2-5 1부 key 짝: 하늘 십성 × MBTI 규칙이 Fusion DB에 있는 key만, 이웃하지 않게, 같은 짝(십성)은 책에서 한 번.
      const pairPick = new Map<string, { id: string; why: string; reason: PairReason }>();
      // AM2-13 4부 대운 9장(덕짱님 결정 4): 짝은 해 key ③ 칸에만 · 책당 최대 3 · ★ 해 먼저 · Fusion(해 하늘 십성 × 유형)이 있고 아직 안 쓴 것만(이웃 제한 없음).
      if (mbtiType && mbti && majorBook) { const usedTg = new Set<string>(), stars = new Set((brief.timeline?.major?.stars ?? []).map(String));
        const order = [...ch.keys].sort((a2, b2) => Number(stars.has(b2)) - Number(stars.has(a2)) || a2.localeCompare(b2));
        for (const key of order) { if (pairPick.size >= MAJOR_PAIR_MAX) break; const e = entries.get(key)!, tg = e.tenGod.stem.replace(/\(.*$/, ""); if (usedTg.has(tg)) continue;
          const got = keyPairWhy(k, tg, mbti.type, t => sceneFits(t, brief, true)); if (!got) continue; usedTg.add(tg); pairPick.set(key, got); } }
      else if (mbtiType && mbti) { const usedTg = new Set<string>(), usedWhy = new Set(pairs.map(pp => pp.why.replace(/[^가-힣A-Z]/g, "").slice(0, 24))); let last = -2;
        ch.keys.forEach((key, idx) => { const e = entries.get(key)!; const tg = e.tenGod.stem.replace(/\(.*$/, ""); if (idx - last < 2 || usedTg.has(tg)) return;
          const got = keyPairWhy(k, tg, mbti.type, t => sceneFits(t, brief, true)); if (!got) return; const sig = got.why.replace(/[^가-힣A-Z]/g, "").slice(0, 24); if (usedWhy.has(sig)) return;
          usedTg.add(tg); usedWhy.add(sig); pairPick.set(key, got); last = idx; }); }
      // 겹침 고리는 책 안 key(와 세운의 그 해)끼리만 — 지난 해 카드(대운 2023~2025)는 key가 아니다.
      const others = (brief.timeline?.entries ?? []).filter(e => ch.keys!.includes(e.key) || (product === "annual_fortune" && e.kind === "year")).map(e => ({ e, label: keyLabelOf(e) }));
      // MBTI 장면 씨앗(knowledge-v5/mbti-seeds): 연인 전제(rel partner)는 연애 중·기혼만, 직업 전제(job)는 그 직업만, 직군 꼬리표(ctx)가 붙은 것은 쓰지 않는다. 한 번 쓴 씨앗은 다시 쓰지 않는다.
      const f2 = brief.person.facts, jobKind = f2.job.status === "employee" ? "employed" : /^(self_employed|business_owner)$/.test(f2.job.status) ? "business" : f2.job.status === "student" ? "student" : "";
      // AM2-6 3부: 씨앗 꼬리표(rel · job · ctx + 글에서 읽은 조건 — 솔로 전제 · 직장 전제 · 가게 상세)가 이 사람 입력과 맞는 것만.
      const mbtiSeedFor = (d: string) => { if (!mbti) return undefined; const pool = (k.mbtiSeeds.get(mbti.type)?.[d] ?? []).filter(sd => itemFits("seed", sd.text, inputs) && seedFits(sd.text, brief, { rel: sd.rel, job: sd.job, ctx: sd.ctx }) && (!sd.job || sd.job === "any" || sd.job === jobKind) && !SCENE_COUNT.test(sd.text) && !seedClash(sd.text));
        for (const sd of pool) { const got = seedOnce(cleanSeed(sd.text, sc)); if (got) return seedAsCondition(got); } return undefined; };
      const keys: KeyPlan[] = ch.keys.map(key => {
        const e = entries.get(key)!, kb = brief.chapters.find(x => x.id === `${ch.id}:${key}`);
        return keyPlan(e, kb?.materials ?? [], ch.n, add, brief, year, seen, s => seedOnce(cleanSeed(s, sc)), annualDayunTg, { link: linkCtx, others, pair: pairPick.get(key), mbtiType, addPair: (my, why, reason, fid) => { const id = `P${pairs.length + 1}`; pairs.push({ id, myeongri: my, mbti: mbtiType!, why: pairWhy(why), key, reason, ...(fid ? { fusionId: fid } : {}) }); return id; }, mbtiSeed: d => mbtiSeedFor(d) });
      }).map(kp => (majorBook ? majorKeyFix(kp, entries.get(kp.key)!, brief) : kp));
      return { n: ch.n, id: ch.id, title: say(ch.title, year), question: say(ch.question, year), target: product === "annual_fortune" ? KEY_TARGET.month : ch.targetChars, useName: ch.n === 1 || ch.n === plan.length /* AM2-6 4부: 이름 부르기는 첫 장 · 끝 장(세운 1·10장, 대운 1·9장) 첫 문단만 */, keys, claims: [], avoid: [] };
    }
    const secs: readonly { q: string; domain: string; materials: readonly Material[] }[] = cb?.sections ?? [{ q: ch.question, domain: "alone", materials: ch.materials }];
    const sections: SectionPlan[] = secs.map(s => {
      const ids = [...new Set(s.materials.flatMap(m => matLines(m, ch.n)))];
      const recap = new Set(s.materials.flatMap(m => (m.kind === "ref" && m.ref.startsWith("chapters.") ? refLine(m.ref) : [])));
      const ev = s.materials.find((m): m is Extract<Material, { kind: "evidence" }> => m.kind === "evidence");
      const claim = ev ? ev.facts.filter(x => !DIRECTIVE_FACT.test(x) && !/^(적어 준|연애 상태|일 상황|고객이)/.test(x) && /: |달: | — /.test(x) && sceneFits(x, brief))[0] : undefined;
      const claimId = ev && claim ? add(subjectOfFact(ev.key, claim, product), split(claim).value, split(claim).meaning) : null;
      // AM2-11 1부 1: 바람 달 소제목의 핵심 주장은 바람 영역마다 한 줄씩(영역별 달 — 한 줄로 묶지 않는다).
      const wishClaims = ev && (ev.key === "wishLink" || ev.key === "wishTiming") ? ev.facts.filter(x => WISH_UP_LINE.test(split(x).value)) : [];
      const wishClaimIds = wishClaims.length > 1 ? wishClaims.map(x => add(subjectOfFact(ev!.key, x, product), split(x).value, split(x).meaning)).filter((x): x is string => Boolean(x)) : [];
      const sc2 = scene(s.materials.flatMap(m => (m.kind === "trait" && m.scene ? [m.scene] : [])));
      const lineOf = (id: string) => lines.find(l => l.id === id);
      // AM2-4 2부(P3 판독 annual-1 차단 #7 · 경미 #34): 「할 것·피할 것」 소제목에는 행동 줄만 — 달 목록·「살필 거리」·영역 이름 줄은 주지 않는다.
      // AM2-14 2부: 대운 8장 「5년 뒤와 10년 뒤에 준비할 것은?」은 이 거름 대상이 아니다(세운 운을 쓰는 법 「할 것 · 피할 것」 소제목용) — 칩 거름으로 바뀐
      // 10년 뒤 줄(「돈 = 작은 수입이 … 들어오기 좋음」)이 행동 꼴로 읽혀 5년 뒤 · 그 무렵 대운 근거가 빠졌다(major-1).
      const advice = /할 것|피할 것/.test(s.q) && product !== "major_fortune";
      let use0 = advice ? ids.filter(id => { const l = lineOf(id); return Boolean(l) && ACTION_LINE.test(`${l!.value} ${l!.meaning}`.trim()) && !NOT_ACTION.test(`${l!.value} ${l!.meaning}`); }) : ids;
      if (advice && !use0.length) use0 = ids.filter(id => { const l = lineOf(id); return l && !NOT_ACTION.test(`${l.value} ${l.meaning}`); });
      // AM2-4 2부(P3 판독 major-1 C2·B19, annual-1 경계 #2): 짝이 없는 명리 줄과 MBTI 줄은 같은 절에 두지 않는다 — 짝이 있으면 짝 아닌 명리 줄을, 없으면 MBTI 줄을 뺀다.
      const isB = (id: string) => lineOf(id)?.subject === "mbti", isM = (id: string) => /^(natal|dayun|year|month)$/.test(lineOf(id)?.subject ?? "");
      // AM2-11 1부 5(결정 2): 짝 없는 원국 줄은 MBTI 절에서 뺀다(MBTI 줄은 남긴다) — 원국 밖 줄(세운 · 대운)은 예전 그대로.
      if (use0.some(isB) && use0.some(isM)) { const pm = new Set(pairs.filter(pp => use0.includes(pp.myeongri) && use0.includes(pp.mbti)).map(pp => pp.myeongri));
        const natalLone = use0.filter(id => lineOf(id)?.subject === "natal" && !pm.has(id)); if (natalLone.length && use0.some(id => !natalLone.includes(id))) use0 = use0.filter(id => !natalLone.includes(id));
        if (use0.some(isM)) use0 = pm.size ? use0.filter(id => !isM(id) || pm.has(id)) : use0.filter(id => !isB(id)); }
      const firstAction = advice ? lineOf(use0[0] ?? "") : undefined;
      const claims2 = advice ? (firstAction ? [say(`${firstAction.value}${firstAction.meaning ? `: ${firstAction.meaning}` : ""}`, year)] : []) : wishClaimIds.length ? wishClaims.map(x => say(x, year)) : claim ? [say(claim, year)] : [];
      const claimIds2 = advice ? (firstAction ? [firstAction.id] : []) : wishClaimIds.length ? wishClaimIds : claimId ? [claimId] : [];
      // 개수 말은 카드 값으로만(4부): 행동 줄이 셋보다 적으면 「세 가지」를 뗀다.
      const q2 = advice && use0.length < 3 ? s.q.replace(/ 세 가지(는|은)\?/, "은?").replace(/ 세 가지/, "") : s.q;
      // AM2-7 3부 7: 두 체계를 함께 묻는 소제목(「대운과 성장 곡선이 만나는 곳은?」)에 짝이 없으면 잇지 않는 나란히 꼴로 묻는다.
      const twoSys = /대운/.test(q2) && /성장|성격|MBTI/.test(q2) && /만나|겹치|함께|같은 방향|이어/.test(q2);
      const pairedHere = pairs.some(pp => use0.includes(pp.myeongri) && use0.includes(pp.mbti));
      // 짝이 있으면 물음도 짝 범위로(「성장 곡선」을 물으면 짝 밖 성장 곡선 줄 B3·B5를 대운에 잇는다 — R7 major-p6a 7.1 ¶1 · ¶2).
      const q3 = twoSys && growthParallel.has(ch.n) && !pairedHere ? "이 대운 10년은 무엇을 키우는 때일까?" : twoSys && pairedHere && mbti?.type ? "이 대운 10년에 MBTI의 어떤 모습이 쓰일까?" /* AM2-8 2부: 유형 이름은 공유 블록에 두지 않는다(묶음 지시에만) */ : q2;
      return { q: say(q3, year), lines: use0, claims: claims2, ...(claimIds2.length ? { claimIds: claimIds2 } : {}), ...(recap.size ? { recapIds: [...recap] } : {}), ...(sc2 ? { scene: sc2 } : {}), ...(DOMAIN_KO[s.domain] ? { angle: DOMAIN_KO[s.domain] } : {}) };
    });
    const scenes = (cb?.sceneHint ?? []).map(h => cleanSeed(say(h, year), sc)).filter((h): h is string => Boolean(h) && seedFits(h!, brief)).map(h => seedOnce(h)).filter((h): h is string => Boolean(h)).map(seedAsCondition).slice(0, 2);
    // 2-1 근거가 없는 절(입력으로 근거가 다 걸러진 절 — 솔로·직업 미입력 등)은 질문을 내지 않는다. 장이 다 비면 바탕 줄 하나로(대운이 없는 책의 앞 장 종합 등).
    // AM2-4 7부: 엔진이 대운을 정하지 못한 세운 책(시각 미상 — 대운은 입력 단계에서 막고 세운을 권한다)에서는 대운을 묻는 절을 내지 않는다(근거 없는 질문 금지).
    const kept = sections.filter(sx => sx.lines.length && !(product === "annual_fortune" && !brief.chart.currentDayun && /대운/.test(sx.q)));
    const finalSections = kept.length ? kept : sections.slice(0, 1).map(sx => ({ ...sx, lines: natalBase.slice(0, 2) }));
    if (finalSections.length < sections.length) droppedPlan.push(...sections.filter(sx => !finalSections.includes(sx)).map(sx => `${ch.n}장 「${sx.q}」`));
    // AM2-4 7부: 대운을 정할 수 없는 세운 책(시각 미상)의 10장은 대운 자리를 묻지 않는다(근거 없는 질문 금지).
    const question = product === "annual_fortune" && ch.id === "next" && !brief.chart.currentDayun ? `${year}년을 지나며 붙잡을 한 가지는?` : ch.question;
    return { n: ch.n, id: ch.id, title: say(ch.title, year), question: say(question, year), target: retarget(ch.id, finalSections, ch.targetChars), useName: ch.n === 1 || ch.n === plan.length /* AM2-6 4부: 이름 부르기는 첫 장 · 끝 장(세운 1·10장, 대운 1·9장) 첫 문단만 */, sections: finalSections, claims: [...new Set(finalSections.flatMap(s => s.claims))], avoid: [], ...(scenes.length ? { scenes } : {}) };
  })());
  // 2-3 핵심 주장과 되풀이 금지가 같은 근거를 동시에 가리키면(P2 판독 major-1 D25: 3장 주장인데 6장 근거) 그 근거를 금지 쪽 장의 절에서 뺀다(절에 다른 근거가 남을 때만).
  const claimOwner = new Map<string, number>();
  for (const p of chapters) for (const s of p.sections ?? []) for (const id of s.claimIds ?? []) if (!claimOwner.has(id)) claimOwner.set(id, p.n);
  // AM2-11 1부 1: 바람 영역별 달 줄은 1장(바람과 이 해) · 소망 장(도울 때와 기다릴 때)이 함께 쓴다 — 옛 꼴은 두 장이 글이 다른 두 줄이었다.
  const wishLineIds = new Set(lines.filter(l => WISH_UP_LINE.test(l.value.trim())).map(l => l.id));
  const resolved = chapters.map(p => (p.sections ? { ...p, sections: p.sections.map(s => { const keep = s.lines.filter(id => { const o = claimOwner.get(id); return o === undefined || o === p.n || s.recapIds?.includes(id) || wishLineIds.has(id); }); return keep.length ? { ...s, lines: keep } : s; }) } : p));
  // AM2-6 3부 카드 같은 글(P5 Y11=M35=I4 · Y23=M36 · Y13=M44 · Y20=M45): 주체가 다른 줄의 뜻 글이 같으면 집 장(먼저 쓰는 장) 한 곳만 남긴다. 다른 곳은 뺀다(절에 줄이 하나도 안 남거나 핵심 주장 줄이면 둔다).
  const resolved2 = dedupeCardText(resolved, lines);
  // 쓰는 장 = 최종 설계도에서 그 줄을 쓰는 장(뺀 근거·솎은 근거는 그 장에서 쓰지 않는다). AM2-4: 처음부터 다시 센다.
  for (const set of use.values()) set.clear();
  for (const p of resolved2) for (const id of [...(p.sections ?? []).flatMap(s2 => s2.lines), ...(p.keys ?? []).flatMap(k2 => k2.lines)]) use.get(id)?.add(p.n);
  // 같은 줄을 여러 장이 쓰면 다른 각도(절 영역)로만 — 각도는 절에 적혀 있다. 근거가 겹치는 다른 장의 주장은 반복 금지 목록으로.
  const linesOf = (p: ChapterPlan) => new Set([...(p.sections ?? []).flatMap(s => s.lines), ...(p.keys ?? []).flatMap(x => x.lines)]);
  const homeOf = (id: string): number | undefined => claimOwner.get(id) ?? resolved2.filter(p => !p.keys && (p.sections ?? []).some(s2 => s2.lines.includes(id) && !s2.recapIds?.includes(id))).map(p => p.n).sort((a, b) => a - b)[0];
  // AM2-4 2부 처방 배분: key 카드 할 일(엔진 배분)이 먼저, 장은 남은 종류에서 하나.
  const keyRx = new Map<RxKind, string>();
  for (const e of brief.timeline?.entries ?? []) if (e.todo && e.period !== "past") for (const kd of rxKindsOf(e.todo)) if (!keyRx.has(kd)) keyRx.set(kd, keyLabelOf(e));
  const rxPlan = allocateChapters(resolved2.map(p => ({ n: p.n, id: p.id, keyed: Boolean(p.keys) })), keyRx);
  // AM2-5 1부: 같은 각도는 책에서 2절까지(문장 재료로는 보내지 않는다 — 각도는 설계 안 값).
  { const seenA = new Map<string, number>(); for (const p of resolved2) for (const sp of p.sections ?? []) if (sp.angle) { const n = (seenA.get(sp.angle) ?? 0) + 1; seenA.set(sp.angle, n); if (n > 2) delete (sp as { angle?: string }).angle; } }
  const out = resolved2.map(p => { const mine = linesOf(p), recap = new Set((p.sections ?? []).flatMap(s => s.recapIds ?? []));
    const claimsOf = (o: ChapterPlan) => (o.sections ?? []).flatMap(s => s.claims.map((cl, i) => ({ cl, id: s.claimIds?.[i] }))).filter(x => !x.id || !recap.has(x.id)).map(x => x.cl);
    // AM2-4 2부 근거 문장의 집: 줄마다 집 장 하나(핵심 주장 장 → 처음 쓰는 장). 다른 장은 다른 각도 한 줄로만(집 장 문장 복사 0 — P3 판독 major-1 D26).
    const away = Object.fromEntries([...new Set((p.sections ?? []).flatMap(s2 => s2.lines))].filter(id => !recap.has(id)).map(id => [id, homeOf(id)] as const).filter((x): x is readonly [string, number] => x[1] !== undefined && x[1] !== p.n));
    // AM2-13 4부 대운 9장: 처방 사전 배분(장마다 한 종류 · 화면 할 일과 같은 종류는 금지). 1 · 5 · 7장은 처방 없음.
    const mrx = majorBook ? MAJOR_RX[p.id] : undefined;
    const rx = majorBook ? (mrx ? { use: null, forbid: [...keyRx.keys()], label: mrx.label, ...(mrx.each ? { each: true } : {}) } : undefined) : rxPlan.get(p.n);
    return { ...p, allowed: [...mine], avoid: [...new Set(resolved2.filter(o => o.n !== p.n && [...linesOf(o)].some(id => mine.has(id))).flatMap(o => (o.keys ? o.claims : claimsOf(o)).map(cl => `${o.n}장: ${cl}`)))].slice(0, 6), ...(Object.keys(away).length ? { away } : {}), ...(rx ? { rx } : {}) }; }).map(thinScenes(product));
  // 세운 책은 대운 안의 위치를 책의 해 기준으로(덕짱님 결정 2026-11-11 「2027년 기준으로」 — 엔진 값은 발행일 기준 연차, 계산은 그대로 두고 글만 옮긴다).
  const shift = product === "annual_fortune" ? year - brief.chart.thisYear.year : 0;
  const tidy = (t: string) => shiftPhase(t, year, shift).replace(/(\s*·\s*){2,}/g, " · ").replace(/^\s*·\s*|\s*·\s*$/g, "");
  // 지난 대운이 만 22세 전에 끝났으면 대운 2장 둘째 절(그 시기를 지나며) 근거의 「동료」는 「또래」로(카드가 직장 낱말을 건네지 않게 — 오탐 검토 major past_work).
  const pastSec = product === "major_fortune" && prevDayunEndAge < 22 ? new Set(out.find(c => c.id === "past")?.sections?.[1]?.lines.filter(id => /^(D|N)/.test(id)) ?? []) : new Set<string>();
  const young = (id: string, t: string) => (pastSec.has(id) ? t.replace(/동료/g, "또래") : t);
  const stage = (t: string) => t.replace(new RegExp(`(태|양|쇠|병|사|묘|절)${STAGE_MARK}`, "g"), (_m, ch: string) => `${ch}(${STAGE_HANJA[ch]})`);
  // AM2-5 1부 카드 값은 고객 말로: 명사형 끝 → 서술형 · 중의 값 · 처방 꼬리(「할 것·피할 것」 절이 쓰는 행동 줄만 남긴다 — 덕짱님 결정 14-7 3번).
  const adviceIds = new Set(out.flatMap(c => (c.sections ?? []).filter(s2 => /할 것|피할 것/.test(s2.q)).flatMap(s2 => s2.lines)));
  // AM2-6 3부: 카드 줄의 연애 조건 꼴을 입력에 맞추고(「만나는 사람이 있다면」 → 「연인과는」 …), 「-던」 전제 · 풀이 없는 용어(일지 · 일간)를 고객 말로.
  const rel = brief.person.facts.relationshipNote === "some" ? "some" : brief.person.facts.relationship;
  const custom = (id: string, t: string) => plainCard(relCondition(predicate(unambiguous(adviceIds.has(id) ? t : stripRx(t))), rel));
  // 뜻 칸이 빈 줄(「기분 따라 지르는 소비가 늘기 쉬운 쪽 · 장바구니는 하루 묵혀 두기」)은 값 칸에 꼬리가 있다.
  // AM2-10 2부 4: 등급 낱말(보통 · 약 · 강 · 오름 · 내림 · 세기)은 뜻 말로 — 등급은 화면에만.
  const gradeLine = (v: string, m: string) => (/^이 해의 연애 신호$/.test(v.trim()) ? { value: loveSignalMeaning(m, inputs.rel), meaning: "" } : { value: gradeToMeaning(v, inputs.rel), meaning: gradeToMeaning(m, inputs.rel) });
  const finalLines0 = lines.map(l => ({ ...l, ...gradeLine(stage(young(l.id, tidy(l.meaning ? plainCard(relCondition(predicate(unambiguous(l.value)), rel)) : custom(l.id, l.value)))), custom(l.id, young(l.id, tidy(l.meaning)))), use: [...(use.get(l.id) ?? [])].sort((a, b) => a - b) }));
  // AM2-10 2부 6(뒤 정리): 특징 밖에서 온 원국 줄(설계도 근거 사실이 특징 문장을 옮긴 줄)까지 같은 정리를 한 번 더 — 상한은 권당 16을 함께 쓴다.
  const traitOfLine = new Map([...traitId.entries()].map(([tid, lid]) => [lid, brief.traits.find(t => t.id === tid)] as const));
  const postItems: TidyItem[] = finalLines0.filter(l => (l.subject === "natal" || l.subject === "mbti") && l.use.length).flatMap((l, li) => atomsOf(l.meaning).map((a, ai) => {
    const t = traitOfLine.get(l.id); return { text: a, owner: l.id, rank: l.subject === "mbti" ? specificity(null, 0) : t ? specificity(t.featureId, t.positions.length) : 2, order: li * 100 + ai }; }));
  const postGone = tidyCard(postItems, k, cardPoleMap, rlog, Math.max(0, CARD_MAX_DROPS - rlog.tidy.length));
  let finalLines = postGone.size ? finalLines0.map(l => ((l.subject === "natal" || l.subject === "mbti") && atomsOf(l.meaning).some(a => postGone.has(a)) ? { ...l, meaning: atomsOf(l.meaning).filter(a => !postGone.has(a)).join(" · ") } : l)) : finalLines0;
  // 2-2 짝은 두 줄이 모두 허용된 장에만. 겹치는 장이 없으면 짝을 뺀다(P2 판독 major-1 P1: N7은 1·2·3장, B1은 7·9장 → 작가가 2장·9장에 나눠 씀).
  const useOf = new Map(finalLines.map(l => [l.id, new Set(l.use)]));
  // AM2-7 3부 1 짝 글 빌드 검사: 유형 이름 뒤 빈 자리 · 너무 짧은 글은 짝을 뺀다(작가가 그대로 옮겼다 — P6 annual-p6b 「ISTJ의 도」), 이유 이름과 글 방향이 어긋나면 글 쪽(긴장)으로 맞춘다.
  let pairsOut = pairs.map(p => ({ ...p, why: predicate(stripRx(p.why)) })).filter(p => p.why && !/빈 자리|짧다/.test(pairTextIssue(p.why, mbti?.type ?? "§", p.reason) ?? "")).map(p => (pairTextIssue(p.why, mbti?.type ?? "§", p.reason) ? { ...p, reason: "긴장" as PairReason } : p)).map(p => ({ ...p, use: [...(useOf.get(p.myeongri) ?? [])].filter(n => useOf.get(p.mbti)?.has(n)) })).filter(p => p.use.length);
  // AM2-11 1부 4: 책 전체 성향 반대 정리 — 원국 · MBTI 줄 · 세운 Y · M 줄 · 짝 이유(Fusion · 세운 MBTI)를 한 번에 맞댄다(범위마다 따로 하던 정리가 놓친 몫, P10 annual-1 끝맺음 · 돈 습관 쌍).
  //  원국 ↔ MBTI 쪽이 반대이고 Fusion DB에 (원국 id × 유형)이 있으면 지우지 않고 짝(긴장)으로 묶는다(덕짱님 고침 4). 없으면 덜 구체적인 쪽을 뺀다. 상한은 권당 16(카드 정제와 함께).
  const bookDrop = new Set<string>();
  { const res = tidyBookPass({ lines: finalLines, pairs: pairsOut, k, traitOf: id => traitOfLine.get(id), mbtiType, mbti: mbti?.type ?? null, cap: Math.max(0, CARD_MAX_DROPS - rlog.tidy.length), log: rlog, pairWhy });
    finalLines = res.lines.map(l => ({ ...l, use: [...l.use] })); pairsOut = res.pairs.map(p => ({ ...p, use: p.use ?? [...(useOf.get(p.myeongri) ?? [])].filter(n => useOf.get(p.mbti)?.has(n)) })).filter(p => p.use.length) as typeof pairsOut; for (const id of res.dropLines) bookDrop.add(id); }
  // 짝 번호를 다시 매기면 key가 가진 짝 id도 같이 바꾼다.
  const renum = new Map(pairsOut.map((p, i) => [p.id, `P${i + 1}`] as const));
  const pairsFinal = pairsOut.map(p => ({ ...p, id: renum.get(p.id)! }));
  const outFinal = out.map(c => (c.keys ? { ...c, keys: c.keys.map(k2 => (k2.pair ? (renum.has(k2.pair) ? { ...k2, pair: renum.get(k2.pair)! } : (({ pair: _p, ...rest }) => (void _p, rest))(k2)) : k2)) } : c));
  const wish = product === "annual_fortune" ? readWish(wishRaw) : null;
  // AM2-6 1부 바람 고리는 드물게: 책 전체에서 엔진이 강도순(같은 자리가 그 해와 바람 달에 함께 걸림 > 바람 달 > 그 밖)으로 1~3개만 고른다.
  // 그 key와 1장 · 소망 장에서만 쓴다. 다른 key에는 바람 재료를 넣지 않는다.
  const yearEntry = (brief.timeline?.entries ?? []).find(e => e.kind === "year");
  const keyRows = outFinal.flatMap(c => c.keys ?? []);
  // AM2-7 3부 8: 바람 고리는 책에서 한 번(고리 key 하나 + 소망 장).
  const wishPick = rankWishLinks(keyRows, linkCtx, product === "annual_fortune" ? yearEntry : undefined, 1);
  // AM2-11 1부 1 · 3: 바람 고리 글은 바람 영역마다(그 달 오르는 영역만) · 지시어 대신 이름(「그 해에도 같은 자리에 걸림」 → 「2027년 정미년 한 해에도 태어난 날 자리에 오미합」).
  const TOPIC_KO2: Readonly<Record<string, string>> = { love: "연애", money: "돈", work: "일", study: "공부", people: "사람", mind: "마음" };
  const SEAT_NAME: Readonly<Record<string, string>> = { day: "태어난 날", month: "태어난 달", year: "태어난 해", hour: "태어난 시각" };
  const yearName = yearEntry ? keyLabelOf(yearEntry) : `${year}년`;
  const wishText = (w: (typeof wishPick)[number]) => { const ts = w.up.length ? w.up : w.topics, seat = SEAT_NAME[w.seat];
    return `${w.label}: 적어 준 바람의 ${ts.map(t => TOPIC_KO2[t] ?? t).join("·")} 쪽과 같은 ${seat} 자리에 ${w.rel}${w.up.length ? ` · ${w.label} ${w.up.map(t => TOPIC_KO2[t] ?? t).join("·")} 오름` : ""}${w.tier === 1 ? ` · ${yearName} 한 해에도 ${seat} 자리에 ${w.rel}` : ""}`; };
  // 바람만이 입력인 자리 재료(연애 상태 미입력 + 바람의 연애 쪽 등 — 입력 wish:*)는 바람 고리로 뽑힌 key에서만 둔다(다른 key에는 바람을 넣지 않는다).
  const isWishSeat = (l: Link) => (l.kind === "seat" || l.kind === "echo") && l.input.some(x => x.startsWith("wish:"));
  const withWish = outFinal.map(c => {
    if (c.keys) return { ...c, keys: c.keys.map(k0 => { const w = wishPick.find(x => x.key === k0.key);
      const k2: KeyPlan = w ? k0 : (() => { const rest = ((k0 as KeyPlan).links ?? []).filter(l => !isWishSeat(l)); const { links: _l, ...o } = k0 as KeyPlan; void _l; return rest.length ? { ...o, links: rest } : o; })();
      if (!w) return k2;
      const link: Link = { kind: "wish", seat: w.seat, engine: [`${k2.key}:${(k2.links ?? []).find(l => l.kind === "seat")?.engine[0]?.split(":").slice(1).join(":") ?? ""}`].filter(x => /@/.test(x)), input: w.topics.map(t => `wish:${t}`), rel: w.rel, text: `바람 고리 〔${wishText(w).replace(/^[^:]+: /, "")}〕 — ${k2.label}에서 한 번, «바람» 원문 없이 「적어 준 바람」으로` };
      return { ...k2, links: [...(k2.links ?? []), link], wishLink: wishText(w) }; }) };
    return wishPick.length && c.id === "wish" ? { ...c, wishLinks: wishPick.map(wishText) } : c;
  });
  // AM2-6 4부 대운 안 위치 값: 위치를 말할 수 있는 모든 해(타임라인의 해 카드 — 지난 3년 · 기준 해 · 앞으로 10년, 세운은 그 해).
  const positions = (brief.timeline?.entries ?? []).filter(e => e.kind === "year" && e.dayun?.yearIndex).map(e => `${e.key}년: ${e.dayun!.ganji.replace(/[一-鿿]/g, ch => READING[ch] ?? ch)} ${e.dayun!.yearIndex}번째 해(${phaseKo(e.dayun!.yearIndex!)})`);
  // AM2-7 3부 2: 칸과 줄 방향 — 「살필 · 늦출 · 무리 · 새는」 칸에 좋은 뜻만 있는 줄, 「오르는」 칸에 주의 뜻만 있는 줄은 근거로 주지 않는다. 카드 안 어긋남은 경보로 남긴다.
  // AM2-7 3부 3: 화면 [좋은 것] · [살필 점] · 그림 · 배지 줄 · 할 일과 같은 카드 줄은 본문 근거 · 핵심 주장으로 주지 않는다(「화면에 있음」 표시 줄은 이름만 쓰는 줄이라 둔다).
  const screenTexts = (brief.timeline?.entries ?? []).flatMap(e => [e.good, e.caution, e.imageLine, e.todo, ...e.badges.map(b2 => b2.line)].filter((t): t is string => Boolean(t)));
  const g4 = (t: string) => { const n = t.replace(/[^가-힣]/g, ""), st = new Set<string>(); for (let i = 0; i + 4 <= n.length; i++) st.add(n.slice(i, i + 4)); return st; };
  const screenG = screenTexts.map(g4);
  const sameAsScreen = (l: Line) => !l.meaning.includes(SCREEN_MARK) && l.meaning.replace(/[^가-힣]/g, "").length >= 10 && screenG.some(sg => { const a = g4(l.meaning); let n = 0; for (const w of a) if (sg.has(w)) n++; return a.size > 0 && n / a.size >= 0.6; });
  const CELL_CAUTION = /(늦출|살필|새기 쉬운|무리하기 쉬운|흔들림을 살필|쉬어 갈|조용히 보낼) (달|해)/, CELL_UP = /오르는 (달|해)/;
  const GOOD_ONLY = (t: string) => /좋|열리|깊어|쌓이|살아나|풀리|기회|빛나|편안|든든|가벼워/.test(t) && !/조심|살피|흔들|새|무리|부딪|어긋|막히|지치|줄이|늦추|아끼|서운|버거/.test(t);
  const CAUTION_ONLY = (t: string) => /조심|살피|흔들|새기|무리|부딪|어긋|막히|지치|버거|서운/.test(t) && !/좋|열리|깊어|쌓이|살아나|풀리|기회|빛나/.test(t);
  const offCell = (l: Line) => (CELL_CAUTION.test(l.value) && GOOD_ONLY(l.meaning)) || (CELL_UP.test(l.value) && CAUTION_ONLY(l.meaning));
  // AM2-12 1부 2: 해 판정 줄(「밀고 갈 해 | …」)은 기준 한 줄이라 화면과 같은 글이어도 절에 둔다(빠지면 작가가 1장 「밀고 갈 해일까, 다질 해일까?」를 판정 없이 쓴다 — 세운 306명 중 4명).
  const verdictLine = (l: Line) => l.subject === "year" && /^(밀고 갈 해|고르게 다질 해|버티며 다질 해)$/.test(l.value);
  const dropIds = new Set([...finalLines.filter(l => l.subject !== "mbti" && !verdictLine(l) && (offCell(l) || sameAsScreen(l))).map(l => l.id), ...bookDrop]);
  const cardAlarms: string[] = finalLines.filter(offCell).map(l => `칸과 줄 방향: ${l.id} 「${l.value}」 ← ${l.meaning.slice(0, 40)}`);
  { const monthsOf = (re: RegExp) => new Set(finalLines.filter(l => re.test(l.value)).flatMap(l => [...l.meaning.matchAll(/(?:1[0-2]|[1-9])월 · [가-힣]{2}월/g)].map(m => m[0])));
    const up = monthsOf(/오르는 달/), rest = monthsOf(/쉬어 갈 달|쉴 달|무리하기 쉬운 달|조용한 달/); for (const m of up) if (rest.has(m)) cardAlarms.push(`오르는 달과 쉴 달이 같다: ${m}`);
    if (finalLines.some(l => /뚜렷한 달 없음/.test(`${l.value} ${l.meaning}`)) && finalLines.some(l => /무리/.test(l.meaning) && /(1[0-2]|[1-9])월/.test(l.value))) cardAlarms.push("「뚜렷한 달 없음」인데 다른 달 줄에 무리"); }
  const keepId = (id: string) => !dropIds.has(id);
  const withCells = withWish.map(c => ({ ...c, ...(c.keys ? { keys: c.keys.map(k0 => ({ ...k0, lines: k0.lines.filter(id => keepId(id) || (k0.lines.filter(keepId).length === 0)) })) } : {}),
    ...(c.sections ? { sections: c.sections.map(sp => { const lines2 = sp.lines.filter(keepId); const claimIds = (sp.claimIds ?? []).filter(keepId);
      return { ...sp, lines: lines2.length ? lines2 : sp.lines, ...(sp.claimIds ? { claimIds: claimIds.length ? claimIds : sp.claimIds } : {}) }; }) } : {}),
    // AM2-7 3부 9: 마지막 소제목이 「색 · 방향 · 숫자」면 처방은 그 앞 소제목에.
    ...(c.sections && c.sections.length > 1 && /색|방향|숫자/.test(c.sections[c.sections.length - 1].q) ? { rxAt: c.sections.length - 2 } : {}) }));
  // AM2-8 2부: 짝 지킴(짝이 빠진 소제목 · key에는 MBTI 줄을 주지 않고, 두 체계를 묻던 소제목은 나란히 꼴로) → key마다 이 사람 재료 → 꼴 배정(장면 솎기 · 짝 확정 뒤).
  const guarded = guardPairs(homeOnly(withCells, pairsFinal), pairsFinal, finalLines, mbti?.type).map(c => (c.keys ? { ...c, keys: assignForms(c.keys.map(k0 => withOwn(k0, brief, wishTopics, product)), pairsFinal) } : c));
  // 설계도 핵심 주장 · 되풀이 금지도 같은 뜻 말로(카드 줄과 같은 함수).
  const g = (t: string) => (/^이 해의 연애 신호: /.test(t) ? loveSignalMeaning(t, inputs.rel) : gradeToMeaning(t, inputs.rel));
  // AM2-10 3부 절 구성: MBTI 재료(B 줄 · 유형 장면)가 있는 소제목에는 그 짝의 명리 줄만 함께 둔다 — 짝이 없으면 MBTI 줄을 뺀다(설계도 마지막 단계에서 한 번 더).
  const subjOf = new Map(finalLines.map(l => [l.id, l.subject] as const));
  // AM2-11 1부 5(결정 2): MBTI 절의 원국 줄은 짝(Fusion DB)이 있을 때만 — 없으면 그 원국 줄을 절에서 뺀다(MBTI 줄은 남긴다). 원국 밖 줄(세운 · 대운)은 예전 그대로.
  const sectionPairOnly = (n: number, ids0: readonly string[]) => {
    const bs = ids0.filter(id => subjOf.get(id) === "mbti"), ms0 = ids0.filter(id => /^(natal|dayun|year|month)$/.test(subjOf.get(id) ?? ""));
    if (!bs.length || !ms0.length) return ids0;
    const paired = new Set(pairsFinal.filter(p => bs.includes(p.mbti) && p.use.includes(n)).map(p => p.myeongri));
    const ids = ids0.filter(id => subjOf.get(id) !== "natal" || paired.has(id));
    const ms = ms0.filter(id => ids.includes(id));
    if (!ms.length) return ids.length ? ids : ids0;
    const ok = new Set(ms.filter(id => paired.has(id)));
    const kept = ok.size ? ids.filter(id => !ms.includes(id) || ok.has(id)) : ids.filter(id => !bs.includes(id));
    return kept.length ? kept : ids0;
  };
  const chaptersOut = sameClaims(guarded, finalLines).map(c => ({ ...c, claims: c.claims.map(g), avoid: c.avoid.map(g), ...(c.sections ? { sections: c.sections.map(s2 => ({ ...s2, lines: sectionPairOnly(c.n, s2.lines), claims: s2.claims.map(g) })) } : {}), ...(c.keys ? { keys: c.keys.map(k2 => ({ ...k2, claims: k2.claims.map(g) })) } : {}) }));
  // AM2-11 1부 3: 카드 줄 · 설계(소제목 물음 · 핵심 주장 · 되풀이 금지 · 바람 고리) · key 재료의 지시어를 이름으로(머리 문장 · 할 일 · 장면 씨앗은 그대로).
  const nm: NameCtx = { year: `${year}년`, ...(c.currentDayun ? { dayun: `${c.currentDayun.ganji.hangul} 대운` } : {}) };
  const N = (t: string, own?: string) => nameDeictics(t, nm, own, /MBTI [EI][NS][TF][JP]/.test(t) ? { mbti: true } : {});
  const SEAT_HEAD = /^(태어난 (?:해|달|날|시각)(?:·(?:태어난 )?(?:해|달|날|시각))*) 자리의 /;
  const linesNamed = finalLines.map(l => { const seatH = SEAT_HEAD.exec(l.value)?.[1], o = { ...(seatH ? { seat: seatH } : {}), mbti: l.subject === "mbti", ...(l.subject === "natal" && !seatH ? { name: l.value.length <= 14 && !/[.!?]|니다|어요|에요/.test(l.value) ? l.value : "이 기운" } : {}) };
    // 숙제 줄(값이 문장, 뜻이 「태어난 달·날 자리의 사 — …」)은 뜻 머리의 자리로 값의 「이 자리」를 받는다.
    const seatM = SEAT_HEAD.exec(l.meaning)?.[1];
    return { ...l, value: nameDeictics(l.value, nm, undefined, { mbti: o.mbti, ...(seatM ? { seat: seatM } : l.subject === "natal" ? { name: "이 기운" } : {}) }), meaning: nameDeictics(l.meaning, nm, LABEL_OF(l.value), o) }; });
  const chaptersNamed = chaptersOut.map(ch => ({ ...ch, question: N(ch.question), claims: ch.claims.map(t => N(t)), avoid: ch.avoid.map(t => N(t)),
    ...(ch.wishLinks ? { wishLinks: ch.wishLinks.map(t => N(t)) } : {}),
    ...(ch.sections ? { sections: ch.sections.map(sp => ({ ...sp, q: N(sp.q), claims: sp.claims.map(t => N(t)), ...(sp.pointer ? { pointer: N(sp.pointer) } : {}) })) } : {}),
    ...(ch.keys ? { keys: ch.keys.map(k2 => ({ ...k2, claims: k2.claims.map(t => N(t, k2.label)), ...(k2.own ? { own: N(k2.own, k2.label) } : {}), ...(k2.wishLink ? { wishLink: N(k2.wishLink, k2.label) } : {}),
      ...(k2.links ? { links: k2.links.map(l => ({ ...l, text: N(l.text, k2.label) })) } : {}) })) } : {}) }));
  // AM2-11 1부 4: 상한(권당 16)으로 남긴 성향 반대 쌍(카드 정제 · 책 전체 정리) — 브리프 검사 trait_clash(기록)가 센다.
  const tidyOver = [...new Set(rlog.tidyOver.map(o => `${o.text.slice(0, 40)} — ${o.why.slice(0, 60)}`))];
  // AM2-12 1부 4(P11 annual-1 Y20 「꼭 필요한 지출까지 미루기」 — 절에서는 뺐는데 카드에 「쓰는 장: 3」으로 남음): 쓰는 장 = 최종 설계도에서 그 줄이 실제로 든 장(절 · key).
  //  절 · key에서 뺀 줄(책 전체 정리 · 칸 방향 · 화면 같은 글 · 집 장 · 짝 지킴)은 그 장을 쓰는 장에서 지운다 — 어디에도 없으면 카드에 보이지 않는다(짝 줄은 짝으로 보인다).
  const usedAt = new Map<string, Set<number>>();
  for (const ch of chaptersNamed) for (const id of [...(ch.sections ?? []).flatMap(sp => [...sp.lines, ...(sp.claimIds ?? [])]), ...(ch.keys ?? []).flatMap(k2 => k2.lines)]) { const st = usedAt.get(id) ?? new Set<number>(); st.add(ch.n); usedAt.set(id, st); }
  const linesUsed = linesNamed.map(l => { const use = l.use.filter(n => usedAt.get(l.id)?.has(n)); return use.length === l.use.length ? l : { ...l, use }; });
  return { ...(majorBook && brief.timeline?.major ? { keySplit: brief.timeline.major.split } : {}), product, person: personCard(brief, year, wish, opts.timeSlot), lines: linesUsed, pairs: pairsFinal, chapters: chaptersNamed, ...(tidyOver.length ? { tidyOver } : {}), ...(cardAlarms.length ? { cardAlarms } : {}), ...(wish?.kind === "ok" && wish.text ? { wish: wish.text } : {}), ...(droppedPlan.length ? { droppedPlan } : {}), ...(!brief.chart.currentDayun ? { noDayun: true } : {}), ...(positions.length ? { positions } : {}), inputs, jobDetail: Boolean(brief.person.facts.job.detail) };
}

/** AM2-6 3부: 주체가 다른 줄의 뜻 글이 같으면(공백·부호 뺀 한글 12자 이상) 집 장(그 줄들을 쓰는 가장 앞 장) 한 곳만 남긴다. 핵심 주장 줄 · 절의 마지막 줄은 두고, key는 그 줄을 뺀다. */
function dedupeCardText(chapters: readonly ChapterPlan[], lines: readonly Line[]): ChapterPlan[] {
  const groups = new Map<string, string[]>(), byId = new Map(lines.map(l => [l.id, l] as const));
  // 그 해 · 그 달 · 고객 입력 줄(Y · M · I)만 — 시스템 표시 줄(「화면에 있음 …」 「가리키기」 「머리 문장에 있음」)은 key마다 같은 꼴이 정상이다.
  for (const l of lines) { if (!/^(year|month|input)$/.test(l.subject) || /^▸|화면에 있음|머리 문장에 있음|가리키기|이 시기가 속한 대운/.test(l.meaning)) continue; const nm = (l.meaning || l.value).replace(/[^가-힣]/g, ""); if (nm.length >= 12) groups.set(nm, [...(groups.get(nm) ?? []), l.id]); }
  // 자리(장 · key/절)마다: 절의 줄이 그 절 질문의 근거(달 목록 · 핵심 주장)이거나 빼면 절에 줄이 하나 남으면 「지켜야 할 자리」다.
  const isList = (id: string) => /(1[0-2]|[1-9])월 · /.test(`${byId.get(id)?.value ?? ""} ${byId.get(id)?.meaning ?? ""}`);
  type Place = { n: number; id: string; key?: string; sec?: number; keep: boolean };
  const placesOf = (id: string): Place[] => chapters.flatMap(c => [...(c.sections ?? []).flatMap((sp, si) => (sp.lines.includes(id) ? [{ n: c.n, id, sec: si, keep: Boolean(sp.claimIds?.includes(id)) || isList(id) || sp.lines.length <= 2 }] : [])), ...(c.keys ?? []).flatMap(k2 => (k2.lines.includes(id) ? [{ n: c.n, id, key: k2.key, keep: false }] : []))]);
  const drop = new Set<string>(); // 「장|key 또는 절|id」
  const placeKey = (p2: Place) => `${p2.n}|${p2.key ?? `s${p2.sec}`}|${p2.id}`;
  for (const ids of groups.values()) {
    if (new Set(ids).size < 2) continue;
    const all = [...new Set(ids)].flatMap(placesOf); if (new Set(all.map(p2 => p2.n)).size < 2 && all.length < 2) continue;
    // 집: 지켜야 할 절 자리가 있으면 그곳(먼저 나온 장), 없으면 가장 앞 장.
    const home = all.filter(p2 => p2.keep).sort((p1, p2) => p1.n - p2.n)[0] ?? [...all].sort((p1, p2) => p1.n - p2.n)[0];
    for (const p2 of all) if (p2 !== home && !p2.keep) drop.add(placeKey(p2));
  }
  if (!drop.size) return [...chapters];
  return chapters.map(p => ({ ...p,
    ...(p.sections ? { sections: p.sections.map((sp, si) => { const rest = sp.lines.filter(id => !drop.has(`${p.n}|s${si}|${id}`)); return rest.length ? { ...sp, lines: rest } : sp; }) } : {}),
    ...(p.keys ? { keys: p.keys.map(k2 => ({ ...k2, lines: k2.lines.filter(id => !drop.has(`${p.n}|${k2.key}|${id}`)), ...(k2.pairScope ? { pairScope: k2.pairScope.filter(id => !drop.has(`${p.n}|${k2.key}|${id}`)) } : {}) })) } : {}) }));
}

/**
 * AM2-5 2부 같은 주장 두 곳은 설계에서 막는다(P4 판독 세운 차단 #4 — 1.4 핵심 M1과 9.2 핵심 I5가 같은 세 달이라 되풀이 지우기가 9.2 핵심을 지웠다).
 * 두 장의 핵심 주장 줄이 같은 값(같은 달 목록 · 같은 뜻 글)이면 앞 장만 주장으로 두고, 뒤 장에는 엔진이 만든 가리키기 말(「앞에서 본 2월 · 임인월, 7월 · 정미월」)을 준다.
 */
const COUNT_KO = ["", "한", "두", "세", "네", "다섯", "여섯", "일곱", "여덟", "아홉", "열", "열한", "열두", "열세"];
const MONTH_G = /(?:2028년 )?(1[0-2]|[1-9])월 · [갑을병정무기경신임계][자축인묘진사오미신유술해]월/g;
export function sameClaims(chapters: readonly ChapterPlan[], lines: readonly Line[]): ChapterPlan[] {
  const byId = new Map(lines.map(l => [l.id, l] as const)), seen = new Map<string, number>();
  const sigOf = (id: string) => { const l = byId.get(id); if (!l) return null; const t = `${l.value} ${l.meaning}`; const ms = [...new Set([...t.matchAll(MONTH_G)].map(m => m[0]))].sort();
    if (ms.length >= 2) return { sig: `months:${ms.join("|")}`, n: ms.length }; const nm = l.meaning.replace(/[^가-힣]/g, ""); return nm.length >= 12 ? { sig: `text:${nm}`, n: 0 } : null; };
  return chapters.map(c => {
    if (!c.sections) return c;
    const sections = c.sections.map(sp => {
      const id = sp.claimIds?.[0]; const g = id ? sigOf(id) : null; if (!g) return sp;
      const home = seen.get(g.sig); if (home === undefined) { seen.set(g.sig, c.n); return sp; }
      if (home === c.n) return sp;
      // AM2-6 4부: 가리키기 말에도 달 이름은 넣는다(P5 세운 9.2 「세 달」은 9장 안에서 몇 월인지 몰랐다).
      // P6 annual-1: 장 번호(「1장에서」 → chapter_ref)와 맨 달 이름(「2월·7월」 → calendar_month)은 검사에 걸린다 — 번호 없이, 달은 간지 이름 그대로.
      const ms = g.n ? [...new Set([...`${byId.get(id!)?.value ?? ""} ${byId.get(id!)?.meaning ?? ""}`.matchAll(MONTH_G)].map(m => m[0]))] : [];
      // AM2-11 1부 1: 바람 영역별 달 주장이 여럿이면 영역마다(「앞에서 본 연애 쪽(2월 · 임인월, …) · 일 쪽(…)」) — 첫 줄만 가리키면 나머지 영역이 빠진다.
      const wishIds = (sp.claimIds ?? []).filter(x2 => WISH_UP_LINE.test(byId.get(x2)?.value.trim() ?? "") && seen.has(sigOf(x2)?.sig ?? "§"));
      const wishPtr = wishIds.length > 1 ? `앞에서 본 ${wishIds.map(x2 => { const l = byId.get(x2)!; const nm = WISH_UP_LINE.exec(l.value.trim())![1]; return `${nm} 쪽(${[...new Set([...l.meaning.matchAll(MONTH_G)].map(m => m[0]))].join(", ")})`; }).join(" · ")}` : null;
      const pointer = wishPtr ?? (g.n ? `앞에서 본 ${ms.length ? ms.join(", ") : `${COUNT_KO[g.n] ?? g.n} 달`}` : `앞에서 본 그 흐름`);
      const ptrIds = wishPtr ? wishIds : [id!];
      const rest = sp.lines.filter(x2 => !ptrIds.includes(x2));
      return { ...sp, pointer, pointerIds: ptrIds, claims: [`가리키기: 「${pointer}」`], claimIds: [], lines: rest.length ? rest : sp.lines };
    });
    return { ...c, sections, claims: [...new Set(sections.flatMap(s2 => s2.claims))] };
  });
}

type Seen = { readonly tenGod: Map<string, { label: string; rels: ReadonlySet<string>; flow: number }>; readonly life: Map<string, string>; readonly overlap: Map<string, string> };
/** 반합 뜻의 머리(「반합(세 글자 중 두 글자만 모여 반쯤 묶임): 」)는 이름 「… 반합」이 맡는다. 끝은 「…흐름」(AM2-4 3부). */
const relMeaningOf = (b: TimelineEntry["badges"][number]) => relFlow(b.line.replace(/^반합\([^)]*\): /, ""));
const GROUP_DOMAIN: Readonly<Record<string, string>> = { WEALTH: "돈", OFFICER: "일", OUTPUT: "일", RESOURCE: "컨디션", PEER: "관계" };
/**
 * AM2-4 1부 — 달·해 key 카드(사실은 화면, 해석은 본문):
 * - 작가 근거 = 설계도가 고른 핵심 1~2개(엔진 가중치: 일·월 자리 충·합·형 > 대운 겹침 > 그 밖, brief/core.ts) + 가장 센 영역 1~2개(4영역 나열 금지).
 * - 관계 배지 전부·흐름·오행 채움·할 일·그림은 화면 카드가 보여 준다(screen) — 본문은 되풀이하지 않는다. 할 일(todo)은 엔진 문형(처방 배분), 작가는 쓰지 않는다.
 * - 반드시 쓸 것 = 핵심 관계 이름(1~2). 장면 씨앗은 묶음당 하나까지(intake 끝에서 솎는다).
 */
type KeyExtra = { readonly link: LinkCtx; readonly others: readonly { readonly e: TimelineEntry; readonly label: string }[]; readonly pair?: { readonly id: string; readonly why: string; readonly reason: PairReason }; readonly mbtiType: string | null; readonly addPair: (myeongri: string, why: string, reason: PairReason, fusionId?: string) => string; readonly mbtiSeed: (domain: string) => string | undefined };
/** AM2-5 1부: 화면이 보여 주는 뜻 줄은 작가에게 표시와 핵심어만(풀어 쓰지 않는다). */
// AM2-8 4부 뿌리 4: 설계도는 본문용 말만 — 「화면에 있음」 같은 화면 쪽 말을 주지 않는다(P7 major-p6a 5 · 2032 「…화면에 이미 있는 줄이라」가 이 표시에서 샜다).
// AM2-13 1부(P12 r1117 「이름과 핵심어만 쓰면 되니 … 두겠습니다」 · 「…라는 이름으로만 두고 … 읽겠습니다」): 뜻 칸에 지시 말을 두지 않는다 — 표시 기호 + 핵심어만(덕짱님 답 1: 「머리 문장에 있음」 · 가리키기 줄도 같은 꼴).
export const SCREEN_MARK = "▸";
const SCENE_COUNT = /\d|수십|수백|여러 명|(?<![가-힣])(두|세|네|다섯|여섯|일곱|여덟|아홉|열|스무|서른|몇)(\s?)(개|번|명|군데|건|통|시간|가지|사람|달|줄|장|권|곳|일|주|잔|판|층)|(?<![가-힣])(둘|셋|넷)(이|과|와|을|를|은|도)?(?![가-힣])|줄줄이|쏟아|두세|서너/;
function keyPlan(e: TimelineEntry, mats: readonly Material[], n: number, add: (s: Subject, v: string, m?: string, n?: number) => string | null, brief: Brief, year: number, seen: Seen, seed: (s: string) => string | undefined, dayunTenGod: string | undefined, x: KeyExtra): KeyPlan {
  const month = e.kind === "month", subj: Subject = month ? "month" : "year", unit = month ? "달" : "해";
  const label = keyLabelOf(e);
  const stem = e.tenGod.stem, branch = e.tenGod.branch;
  const ids: string[] = [];
  const push = (v: string, m = "") => { const id = add(subj, `${label} ${v}`, m, n); if (id) ids.push(id); return id; };
  const rels = e.badges.map(b => b.label.replace(/\(.*\)$/, "").trim()).filter(x2 => x2.length >= 2);
  const deep = mats.find((m): m is Extract<Material, { kind: "evidence" }> => m.kind === "evidence" && m.key.startsWith("depth:"));
  const depth = deep ? (/^핵심 해/.test(deep.facts[0] ?? "") ? "deep" : "short") : undefined;
  const core = coreOf(e, { ...(dayunTenGod ? { dayunTenGod } : {}), short: depth === "short" });
  // AM2-5 1부(덕짱님 결정 14-7 1번 (가)): 본문은 관계 이름만 한 번 부르고 일반 뜻은 화면에 맡긴다 — 핵심 줄의 뜻은 「화면에 있음 · 풀어 쓰지 않음」과 핵심어만.
  const tgShort = (tg: string) => TEN_GOD_SHORT[tg.replace(/\(.*$/, "")] ?? "";
  let pointer: string | undefined;
  for (const c of core) {
    if (c.kind === "rel") push(c.badge.kind === "GONGMANG" ? "공망" : `${c.badge.with ? `${seatShort(c.badge.with)} 자리와 ` : ""}${c.name}`, `${SCREEN_MARK} ${REL_SHORT[c.badge.kind] ?? "걸리는 관계"}`);
    else if (c.kind === "transition") push(`새 대운 시작: ${e.dayun?.ganji ?? ""}`, `${SCREEN_MARK} ${c.tenGod}의 10년`);
    else {
      const tg = c.side === "sky" ? stem : branch;
      push(`${c.side === "sky" ? "하늘" : "땅"} 글자 ${tg}`, `${SCREEN_MARK} ${tgShort(tg)}`);
      if (c.overlap) {
        // AM2-5 2부 같은 주장 두 곳(P4 세운 M22 = M55): 같은 대운 겹침이 앞 key에 이미 있으면 이 key는 엔진 가리키기 말로만.
        const prev = seen.overlap.get(c.name);
        if (prev) { pointer = `${prev}처럼 대운과 같은 ${c.name} 기운이 겹치는 ${unit}`; push("대운과 겹침", `${SCREEN_MARK} ${pointer}`); }
        else { seen.overlap.set(c.name, label); push("대운과 겹침", `이 시기가 속한 대운도 ${c.name}의 10년이라 같은 기운이 겹침`); }
      }
    }
  }
  // 영역: 가장 센 1~2(세운 달은 영역 신호의 오름·살필, 대운 해는 핵심 자리·십성 묶음). 앞 key와 같은 생활 줄은 건너뛴다.
  const maxDomains = depth === "short" ? 1 : 2;
  const monthFacts = mats.flatMap(m => (m.kind === "evidence" && /^(month|bridge):/.test(m.key) ? m.facts.filter(x2 => !/^영역 신호/.test(x2) && sceneFits(x2, brief)) : []));
  const picked: { v: string; m: string }[] = [];
  for (const x2 of monthFacts) { const mm = /^(연애|돈|일|사람|마음) ([↑↓→]): (.+)$/.exec(x2); if (!mm || picked.length >= maxDomains) continue; if (seen.life.has(mm[3])) continue; seen.life.set(mm[3], label); picked.push({ v: mm[2] === "↑" ? `${josa(mm[1], "이가")} 오르는 ${unit}` : `${josa(mm[1], "을를")} 살필 ${unit}`, m: mm[3] }); }
  if (!picked.length) {
    const tgH = stem.match(/\((.+)\)/)?.[1] ?? "", grp = GROUP_DOMAIN[(TEN_GOD_GROUP as Record<string, string>)[tgH] ?? ""] ?? "일";
    const seatD = core.find(c => c.kind === "rel" && /태어난 날/.test(c.badge.with ?? "")) ? "관계" : core.find(c => c.kind === "rel" && /태어난 달/.test(c.badge.with ?? "")) ? "일" : undefined;
    const order = [...new Set([seatD, grp, "일", "돈", "관계", "컨디션"].filter((d): d is string => Boolean(d)))];
    const dl = (e.material?.domains ?? []).filter(x2 => sceneFits(x2, brief));
    // AM2-5 1부: 영역 줄 값은 「일에서」 같은 칸 이름 대신 「그 해 일 쪽」(P4 판독 대운 m15 마 — 칸 이름으로 여는 문장 9 key).
    // AM2-14 2부(D1 모순 4곳): 대운 해 key는 그 해 칩과 방향이 반대인 영역 줄을 빼고 다음 영역으로(세운 dirFits와 같은 판정 — design/major periodLineFits).
    const chips = brief.product === "major_fortune" ? (e as TimelineEntry & { signals?: Parameters<typeof periodLineFits>[2] }).signals : undefined;
    for (const d of order) { if (picked.length >= maxDomains) break; const line = dl.find(x2 => x2.startsWith(`${d}: `)); if (!line) continue; const t = line.replace(/^[^:]+: /, ""); if (seen.life.has(t)) continue; if (chips && !periodLineFits(d, t, chips)) continue; seen.life.set(t, label); picked.push({ v: `${d} 쪽`, m: t }); }
  }
  const pickedIds: string[] = [];
  for (const pk of picked) { const id = push(pk.v, pk.m); if (id) pickedIds.push(id); }
  // AM2-5 1부: 대운 key의 「대운 안의 위치」 줄은 뺀다(10년표가 맡는다 — P4 판독 대운 m15 라 「N번째 해로 … 남아 있어요」 10 key).
  if (depth === "deep") push("이 10년에서 눈여겨볼 해", say(deep!.facts[0].replace(/^핵심 해 \d+: /, ""), year));
  // AM2-5 1부 key 짝: 하늘 십성 줄(화면 표시) × MBTI — 이 key에서만.
  // AM2-6 2부 짝 범위(명리 쪽) = 하늘 십성 줄 + 그 십성에서 나온 영역 줄(세운 달 annual-domain tenGod:하늘 · 대운 해 periodDomains(하늘 십성)).
  let pairId: string | undefined, pairScope: string[] | undefined;
  if (x.pair && x.mbtiType) { const sky = push(`하늘 글자 ${stem}`, `${SCREEN_MARK} ${tgShort(stem)}`); if (sky) { pairId = x.addPair(sky, x.pair.why, x.pair.reason, x.pair.id); ids.push(x.mbtiType); pairScope = [sky, ...pickedIds]; } }
  // AM2-5 1부: 장면은 문장 안에 넣는 재료라 첫 문장만, 건수·숫자가 든 장면은 주지 않는다(「한 달 동안 스무 개가 넘게」 — 개수 말·사건 단정이 된다).
  const scene0 = e.material?.scene ? say(e.material.scene, year).split(/(?<=[.!?])\s+/)[0] : undefined;
  // 엔진 장면이 맞지 않으면 MBTI 장면 씨앗(유형 × 영역 명사구 — 연애·직업 꼬리표로 거름)에서 그 key의 영역으로 하나.
  // AM2-6 3부: 장면 씨앗은 그 key의 영역(고리 자리의 영역 + 카드 영역 줄) 안에서만(P5 세운 4월 더치페이 · 2028년 1월 연락처 · 11월 회의 — 영역이 다른 씨앗).
  const seatLink = keyLinks(e, { ...x.link, echoed: new Set(), seatUsed: new Map() }, label, x.others, { short: depth === "short" }).find(l => l.kind === "seat");
  const AREA_OF: Readonly<Record<string, string>> = { 연애: "love", 돈: "money", 일: "work", 사람: "relationships", 관계: "relationships", 마음: "alone", 컨디션: "alone" };
  const areas0 = [...(seatLink?.areas ?? []), ...picked.map(pk => AREA_OF[pk.v.split(/[ 이가을를]/)[0]]).filter((d): d is string => Boolean(d))];
  const areas = [...new Set(areas0.length ? areas0 : ["alone"])];
  let scene = scene0 && seedFits(scene0, brief) && !SCENE_COUNT.test(scene0) && areas.includes(seedDomainOf(scene0)) ? seed(scene0) : undefined, sceneArea = scene ? seedDomainOf(scene0!) : undefined;
  if (scene) scene = seedAsCondition(scene);
  // AM2-14 2부: 대운 앞날 key의 장면은 조건 꼴(「…는 날이라면」) — 일어날 일로 못 박는 끝 꼴을 재료에서 뺀다(세운은 그대로).
  const futureMajor = brief.product === "major_fortune" && (e.when ?? e.period ?? "future") !== "past";
  if (scene && futureMajor) scene = seedAsMaybe(scene) ?? undefined;
  // AM2-9 4부: 세운 MBTI 장면 씨앗은 짝 있는 key에서만(짝 없는 key의 MBTI 장면은 짝 밖 잇기의 재료가 된다 — P7 F1 「모임 공지에 요일까지 정확히 적는 사람이라면」).
  let sceneMbti = false;
  for (const d of areas) { if (scene || (brief.product === "annual_fortune" && !x.pair)) break; scene = x.mbtiSeed(d); if (scene && futureMajor) scene = seedAsMaybe(scene) ?? undefined; if (scene) { sceneArea = d; sceneMbti = brief.product === "annual_fortune"; } }
  // AM2-6 4부: 대운 해 key의 위치 값(엔진 yearIndex — 위치 말은 이 값으로만).
  const position = e.kind === "year" && e.dayun?.yearIndex ? `${e.dayun.ganji.replace(/[一-鿿]/g, ch => READING[ch] ?? ch)} ${e.dayun.yearIndex}번째 해(${phaseKo(e.dayun.yearIndex)})` : undefined;
  const todoRaw = e.todo && sceneFits(e.todo, brief) ? say(e.todo, year) : "";
  const when = (e.when ?? e.period ?? "future") as KeyPlan["when"];
  const uniq = [...new Set(ids)];
  const own = uniq.filter(id => id.startsWith(month ? "M" : "Y")).map(id => Number(id.slice(1))).sort((a, b) => a - b);
  const range = own.length ? `${month ? "M" : "Y"}${own[0]}~${month ? "M" : "Y"}${own.at(-1)}` : undefined;
  const fills = e.fillsLack?.fills && e.fillsLack.elements.length ? e.fillsLack.elements : [];
  // 화면이 보여 주는 것(본문 되풀이 금지): 흐름 · 관계 배지 전부 · 오행 채움 · 할 일.
  const screen = [`흐름 ${FLOW_WORD[e.flow.score]}`, ...e.badges.map(b => relName(b.label)), ...(fills.length ? [`${fills.map(x2 => ELEMENT_SAY[x2] ?? x2).join("·")} 채움`] : []), ...(todoRaw && when !== "past" ? [`할 일 「${todoRaw}」`] : [])];
  // 2-4 반드시 쓸 것 = 핵심 관계 이름(1~2). 핵심이 십성이면 머리 문장이 이름을 말한다(반드시 쓸 것 없음), 대운 겹침이면 「대운」.
  const must: MustItem[] = core.flatMap((c): MustItem[] => {
    if (c.kind === "rel") { const base = c.name.replace(/ 반합$/, ""); const loose = [...base].map(esc).join(" ?·? ?");
      const image = relMeaningOf(c.badge).split(/\s+/).slice(0, 2).map(esc).join("\\s?");
      const kindWord = ({ CHUNG: "충|부딪", HYEONG: "형|다듬|눌러", PA: "파|어긋", HAE: "해|방해", WONJIN: "원진|까끌|미워", YUKHAP: "육합|맞물|합(이|과|도|은|을)", SAMHAP: "반합|반쯤 묶|삼합", BANGHAP: "방합|모여|모이", STEM_HAP: "어울|천간합|하늘 글자끼리|합(이|과|도|은|을)", GONGMANG: "공망|빠져" } as Record<string, string>)[c.badge.kind] ?? "합|충|형|파|해";
      const seats = (c.badge.with ?? "").split("·").map(x2 => x2.replace(/^태어난 /, "")).filter(Boolean);
      const weak = seats.length ? `(태어난 (${seats.join("|")})[^.?!]{0,10}(자리|글자)?|(땅|하늘) 글자)(와|과)는? [^.?!]{0,16}(${kindWord})` : "";
      const season = c.badge.kind === "BANGHAP" ? c.name.match(/^(봄|여름|가을|겨울)/)?.[1] : undefined;
      return [{ what: c.name, re: [loose, GUK_ALIAS[base], base === "지지형" ? "([자축인묘진사오미신유술해]) ?\\1 ?형|자리와 형이|형이 걸려|글자가 같아|같은 글자끼리" : "", image.length >= 4 ? image : "", season ? `${season} (글자|기운)[가-힣]{0,2} ?모` : ""].filter(Boolean).join("|"), ...(weak ? { weak } : {}) }]; }
    if (c.kind === "tenGod" && c.overlap) return [{ what: "대운과 겹침", re: "대운" }];
    return [];
  });
  void rels;
  const links = keyLinks(e, x.link, label, x.others, { short: depth === "short" });
  return { key: e.key, label, head: say(e.head ?? "", year), when, tone: toneOf(e).line, lines: uniq, claims: [`${label}: ${core.map(c => c.name).join(" · ")}`], ...(depth ? { depth } : {}), ...(scene ? { scene } : {}), ...(todoRaw && when !== "past" ? { todo: todoRaw } : {}), ...(range ? { range } : {}), must, core: core.map(c => c.name), screen,
    ...(links.length ? { links } : {}), ...(pairId ? { pair: pairId } : {}), ...(pointer ? { pointer } : {}), ...(pairScope ? { pairScope } : {}), areas, ...(sceneArea && scene ? { sceneArea } : {}), ...(sceneMbti && scene ? { sceneMbti: true as const } : {}), ...(position ? { position } : {}) };
}

/**
 * AM2-13 4부 대운 9장 key 지시 4칸(덕짱님 결정 · 0부 답 4 · 5): ① 핵심(관계 · 십성 이름 + 뜻 한 마디) ② 이 사람 재료 하나(①의 원국 자리와 같은 자리의 앞 해 → 입력 사실 → 짝,
 * ★ 해는 하나 더) ③ 짝 또는 장면(비어도 됨) ④ 기조(뜻 말만 — 흐름 숫자 · 화살표 · 영역 기호 없음). 옛 고리 칸(「앞 · 이번 · 앞과 다름 · 입력 한 마디: 솔로(그때도 그렇다면)」 — P7 견줌 틀 · 솔로 틀의 원인)은 주지 않는다.
 */
const SEAT_WORD: Readonly<Record<string, string>> = { 해: "바깥 사람", 달: "사회생활", 날: "가까운 사람", 시각: "아랫사람 · 앞날" };
const DOM_KO: Readonly<Record<string, string>> = { love: "연애", money: "돈", work: "일", people: "사람", mind: "마음" };
export function majorKeyFix(kp: KeyPlan, e: TimelineEntry, brief: Brief): KeyPlan {
  const all = (brief.timeline?.entries ?? []).filter(x => x.kind === "year").sort((a, b) => Number(a.key) - Number(b.key));
  // ①은 key 지시에 적힌 핵심 그대로(kp.core — keyPlan과 같은 깊이의 coreOf).
  const core = coreOf(e, { short: kp.depth === "short" }).filter(c => (kp.core ?? []).includes(c.name));
  const words: Record<string, string> = {};
  for (const c of core) if (c.kind === "rel") words[c.name] = REL_SHORT[c.badge.kind] ?? ""; else if (c.kind === "tenGod") words[c.name] = TEN_GOD_SHORT[c.name.replace(/\(.*$/, "")] ?? "";
  const seats = [...new Set(core.flatMap(c => (c.kind === "rel" && c.badge.kind !== "GONGMANG" ? (c.badge.with ?? "").split("·").map(x => x.replace(/^태어난 /, "").trim()).filter(Boolean) : [])))];
  const f = brief.person.facts, input = [f.job.status && f.job.status !== "unknown" ? `일: ${({ employee: "직장인", job_seeker: "취업 준비", student: "학생", self_employed: "사업", business_owner: "사업", freelancer: "프리랜서", unemployed: "쉬는 중", homemaker: "살림", other: "쉬는 중" } as Record<string, string>)[f.job.status] ?? "적음"}` : "",
    f.relationship && f.relationship !== "unknown" ? `연애: ${({ single: "솔로", dating: "연애 중", married: "기혼" } as Record<string, string>)[f.relationship] ?? f.relationship}` : ""].filter(Boolean);
  // 고리: ①의 원국 자리와 같은 자리에 원국 관계가 걸린 가장 가까운 앞 해(대운 지난 해 포함).
  let ring: string | undefined;
  for (const prev of all.filter(x => Number(x.key) < Number(e.key)).reverse()) {
    const b = prev.badges.find(bd => bd.kind !== "GONGMANG" && (bd.with ?? "").split("·").map(x => x.replace(/^태어난 /, "").trim()).some(st => seats.includes(st)));
    if (b) { const st = (b.with ?? "").split("·").map(x => x.replace(/^태어난 /, "").trim()).find(x => seats.includes(x))!; ring = `태어난 ${st} 자리(${SEAT_WORD[st] ?? ""})의 앞 해: ${prev.key}년 ${prev.ganji.hangul}년 ${relName(b.label)}(${REL_SHORT[b.kind] ?? "걸리는 관계"})`; break; }
  }
  const sig: Readonly<Record<string, string>> = (e as TimelineEntry & { signals?: Record<string, string> }).signals ?? {};
  const top = Object.keys(DOM_KO).find(d => sig[d] === "↑") ?? Object.keys(DOM_KO).find(d => sig[d] === "↓");
  // AM2-13 7부(D1 판독 2027 · 2030 「솔로로 적혀 있으니」): 재료 칸 이름에 「입력」을 두지 않는다.
  const inputFact = input.length ? `이 사람: ${(top === "love" ? input.filter(x => x.startsWith("연애")) : top === "work" || top === "money" ? input.filter(x => x.startsWith("일")) : input).join(" · ") || input.join(" · ")}` : undefined;
  const mats = [ring, inputFact].filter((x): x is string => Boolean(x));
  const own = mats.length ? (kp.depth === "deep" ? mats.slice(0, 2) : mats.slice(0, 1)).join(" · ") : kp.pair ? `짝 ${kp.pair}의 명리 줄(하늘 글자)` : undefined;
  // 기조: 해 판정 뜻 + 열어 둘 쪽 · 속도를 늦출 쪽(낱말만).
  const ups = Object.keys(DOM_KO).filter(d => sig[d] === "↑").map(d => DOM_KO[d]), care = Object.keys(DOM_KO).filter(d => sig[d] === "↓").map(d => DOM_KO[d]);
  const base = e.dayun?.transition ? "바뀌는 문턱에서 손에 익은 것부터 잇는 해" : e.flow.score >= 4 ? "힘을 내 밀어 볼 수 있는 해" : e.flow.score === 3 ? "고르게 다지는 해" : "버티며 다지는 해";
  const tone = `${base}${ups.length ? ` · ${ups.join("·")} 쪽은 열어 둠` : ""}${care.length ? ` · ${care.join("·")} 쪽은 속도를 늦춤` : ""}(지킬 것, 본문에 옮기지 않음)`;
  const { links: _l, ...rest } = kp; void _l;
  // 새 대운 시작은 머리 문장이 말한다(P7 2028 「새 대운 시작」 되풀이) — ①에는 원국 관계 · 십성만.
  const coreNames = (kp.core ?? []).filter(n => !/^새 대운/.test(n));
  return { ...rest, ...(coreNames.length ? { core: coreNames } : {}), coreWords: words, tone, ...(own ? { own } : {}) };
}

/** 대운 안 위치 말(엔진과 같은 경계: 1 첫해 · 2~3 앞쪽 · 4~7 중간 · 8~9 끝 무렵 · 10 마지막 해). */
// AM2-7 5부 3: 위치 말은 표 하나(dayunPositionKo — 화면 · 검사와 같은 값).
const phaseKo = (i: number) => dayunPositionKo(i);
/** 「5번째 해(중간), 남은 기간 약 5년 4개월(2032년 4월 무렵까지)」 → 「2027년은 6번째 해(중간), 이 대운은 2032년 4월 무렵까지」(책의 해가 발행일의 해보다 뒤일 때). 10번째를 넘으면 그대로 둔다. */
export function shiftPhase(t: string, bookYear: number, shift: number): string {
  if (shift <= 0) return t;
  const to = (n: number, until: string, all: string) => { const m = n + shift; return m > 10 ? all : `${bookYear}년은 ${m}번째 해(${phaseKo(m)}), 이 대운은 ${until}`; };
  return t.replace(/(\d+)번째 해\((?:앞쪽|중간|끝 무렵|첫해|마지막 해)\), 남은 기간 [^(|]*?\(([^)]+)\)/g, (all, n: string, u: string) => to(Number(n), u, all))
    .replace(/(?:앞쪽|중간|끝 무렵|첫해|마지막 해)\((\d+)번째 해\), 남은 기간 [^(|]*?\(([^)]+)\)/g, (all, n: string, u: string) => to(Number(n), u, all));
}

/** 인물 카드의 연애 상태 값만(「연애: 연애 중」 「연애: 솔로」 「연애: 기혼」 「연애: 미입력」) — 같은 줄의 「자녀: 미입력」을 연애로 읽지 않게(AM2-5 P5 자동 점검). */
export const relationshipOf = (person: readonly string[]) => `연애: ${person.find(p => p.startsWith("연애:"))?.match(/^연애: ([^·]+)/)?.[1].trim() ?? "미입력"}`;
/** 인물 카드(고객 입력만, 제약 문장 없이 사실만). */
function personCard(brief: Brief, year: number, wish: { kind: string; text?: string; topics?: readonly string[] } | null, slot?: string): string[] {
  const p = brief.person, f = p.facts;
  const JOB: Record<string, string> = { employee: "직장인", job_seeker: "취업 준비 중", student: "학생", self_employed: "자영업", business_owner: "사업", freelancer: "프리랜서", unemployed: "쉬는 중", homemaker: "살림", other: "기타" };
  // AM2-12 1부 1: 썸은 「썸」 한 말(소제목 · 해 재료 · 고리 한 마디와 같은 말), 결혼 준비는 「연애 중(결혼 준비)」(해 재료와 같은 말).
  const REL: Record<string, string> = { single: "솔로", some: "썸", dating: "연애 중", marriage_preparing: "연애 중(결혼 준비)", married: "기혼", unknown: "미입력" };
  const book = brief.product === "annual_fortune" ? `「나의 ${year}」(${year}년 ${brief.timeline?.entries.find(e => e.kind === "year")?.ganji.hangul ?? ""}년 신년판)` : "「앞으로의 나」(대운 10년)";
  const base = brief.baseDate.split("-").map(Number);
  return [
    `이름: ${p.name}(부를 때 ${p.callName})`,
    `나이: 만 ${p.age}세(${p.ageBand})${p.gender === "FEMALE" ? " · 여성" : p.gender === "MALE" ? " · 남성" : ""}`,
    `MBTI: ${f.mbti ?? "미입력"}`,
    // AM2-7 2부 3(P6 annual-p5 「태어난 시각을 아는 사주라서」 — 인물 카드 「출생 시각: 앎」이 문장 이유가 됐다): 입력 상태 값(시각을 아는지 · 일 상세를 아는지)은 문장 재료로 주지 않는다.
    // 시각을 모르면 시주가 없다는 사실만, 대략 시각(시간대)은 「대략(진시)」로.
    ...(!f.birthTimeKnown ? ["태어난 시각: 시주 없음"] : slot ? [`태어난 시각: 대략(${slot})`] : []),
    `일: ${JOB[f.job.status] ?? "적지 않음"}${f.job.detail ? `(${say(f.job.detail)})` : ""}`,
    `연애: ${REL[f.relationshipNote ?? f.relationship] ?? "미입력"}${f.children === "has" ? " · 자녀: 있음" : ""}`,
    ...(wish?.kind === "ok" && wish.text ? [`적어 준 바람: «${wish.text}»`] : wish?.kind === "inject" ? [`적어 준 바람의 주제: ${(wish.topics ?? []).map(t => ({ love: "연애", money: "돈", work: "일", study: "공부", people: "사람", mind: "마음" } as Record<string, string>)[t] ?? t).join("·") || "일상"}`] : wish?.kind === "risk" ? ["적어 준 바람: 마음이 많이 지친 시기일 수 있음"] : []),
    `책: ${book} · 이 책을 쓴 날 ${base[0]}년 ${base[1]}월 ${base[2]}일`,
  ];
}

/**
 * AM2-8 5부 뿌리 8: 근거마다 집 장 하나. 다른 장은 그 소제목에 「새 각도」(절 영역)가 있을 때만 그 근거를 쓴다 — 없으면 그 소제목에서 뺀다(소제목에 줄이 하나도 안 남으면 둔다).
 */
export function homeOnly(chapters: readonly ChapterPlan[], pairs: readonly Pair[] = []): ChapterPlan[] {
  return chapters.map(c => {
    if (!c.sections || !c.away || !Object.keys(c.away).length) return c;
    const away = c.away;
    // 그 소제목의 짝(명리 줄 × MBTI 줄이 함께 든 것)은 집이 다른 장이어도 둔다 — 짝은 그 장에서 쓰라고 준 것이다.
    const sections = c.sections.map(sp => { if (sp.angle) return sp; const pairIds = new Set(pairs.filter(p0 => sp.lines.includes(p0.myeongri) && sp.lines.includes(p0.mbti) && (!p0.use || p0.use.includes(c.n))).flatMap(p0 => [p0.myeongri, p0.mbti]));
      // 핵심 주장 · 앞 장 종합 줄은 그 소제목 물음의 근거라 둔다. 남는 줄이 둘 밑이면 빼지 않는다(물음의 근거가 얇아진다).
      const own = new Set([...(sp.claimIds ?? []), ...(sp.recapIds ?? []), ...pairIds]);
      const rest = sp.lines.filter(id => !(id in away) || own.has(id)); return rest.length >= 2 && rest.length < sp.lines.length ? { ...sp, lines: rest } : sp; });
    const used = new Set(sections.flatMap(sp => sp.lines));
    const away2 = Object.fromEntries(Object.entries(away).filter(([id]) => used.has(id)));
    return { ...c, sections, allowed: [...used], ...(Object.keys(away2).length ? { away: away2 } : { away: undefined }) };
  });
}
/** 두 체계(대운 × MBTI)를 함께 묻는 소제목 물음인지(짝이 있을 때의 꼴 「이 대운 10년에 ENTP의 어떤 모습이 쓰일까?」 포함). */
export const twoSystemQ = (q: string, mbti?: string) => /대운/.test(q) && (/성장|성격|MBTI/.test(q) || Boolean(mbti && q.includes(mbti))) && /만나|겹치|함께|같은 방향|이어|쓰일까/.test(q);
export const PARALLEL_Q = "이 대운 10년은 무엇을 키우는 때일까?";
/**
 * AM2-8 2부 뿌리 1(덕짱님 결정 3): 짝이 최종 목록에 없는 소제목 · key에는 MBTI 줄을 주지 않는다(명리 줄과 함께 있을 때).
 * 짝에 기대던 두 체계 물음은 짝이 빠지면 나란히 꼴(대운 쪽만 묻는 물음)로 같이 바꾼다. 쓸 수 있는 근거(allowed)도 다시 센다.
 */
export function guardPairs(chapters: readonly ChapterPlan[], pairs: readonly Pair[], lines: readonly Line[], mbti?: string): ChapterPlan[] {
  const subj = new Map(lines.map(l => [l.id, l.subject] as const));
  const isB = (id: string) => subj.get(id) === "mbti", isM = (id: string) => /^(natal|dayun|year|month)$/.test(subj.get(id) ?? "");
  return chapters.map(c => {
    if (c.keys) {
      // AM2-9 4부: 짝이 빠진 세운 key는 MBTI 장면 씨앗도 뺀다(짝 없는 key의 MBTI 장면 — 짝 밖 잇기 재료).
      const keys = c.keys.map(k0 => { if (k0.pair && pairs.some(p0 => p0.id === k0.pair)) return k0; const { pairForm: _f, pairScope: _s, pair: _p, ...rest0 } = k0; void _f; void _s; void _p;
        const rest = k0.sceneMbti ? (({ scene: _sc, sceneArea: _sa, sceneMbti: _sm, ...r2 }) => (void _sc, void _sa, void _sm, r2))(rest0) : rest0;
        return { ...rest, lines: k0.lines.filter(id => !isB(id)) }; });
      return { ...c, keys, allowed: [...new Set(keys.flatMap(k0 => k0.lines))] };
    }
    const sections = (c.sections ?? []).map(sp => {
      const paired = pairs.some(p0 => sp.lines.includes(p0.myeongri) && sp.lines.includes(p0.mbti) && (!p0.use || p0.use.includes(c.n)));
      if (paired) {
        // AM2-9 4부(브리프 검사 무작위 2,000명 pair_section 6 — v5/main부터 있던 것): 짝 있는 절의 짝 밖 명리 줄(1장 「명리와 MBTI로 보면」의 일주 줄 N8 × B1)은 MBTI 줄과 한 절에 두지 않는다.
        // 짝 밖 줄이 핵심 주장이 아니면 그 줄만 빼고, 핵심 주장이면 MBTI 줄을 빼서 나란히 꼴로 둔다(짝 밖 잇기 재료를 남기지 않는다).
        const inPair = new Set(pairs.filter(p0 => sp.lines.includes(p0.mbti) && (p0.use ?? []).includes(c.n)).map(p0 => p0.myeongri));
        const lone = sp.lines.filter(id => isM(id) && !inPair.has(id));
        if (!lone.length || !sp.lines.some(isB)) return sp;
        const claims = new Set(sp.claimIds ?? []);
        if (!lone.some(id => claims.has(id))) return { ...sp, lines: sp.lines.filter(id => !lone.includes(id)), ...(sp.recapIds ? { recapIds: sp.recapIds.filter(id => !lone.includes(id)) } : {}) };
        return { ...sp, lines: sp.lines.filter(id => !isB(id)), q: twoSystemQ(sp.q, mbti) ? PARALLEL_Q : sp.q };
      }
      // AM2-11 1부 5(결정 2): 짝 없는 MBTI 절의 원국 줄(핵심 주장 줄은 빼고)은 그 절에서 뺀다 — MBTI 줄은 남긴다(P10 annual-p6b 2장 「사랑에서 지킬 한 가지」 화개 줄 — Fusion DB에 화개 × ISTJ 없음).
      const natalLone = sp.lines.some(isB) ? sp.lines.filter(id => subj.get(id) === "natal" && !(sp.claimIds ?? []).includes(id)) : [];
      const ls = natalLone.length && sp.lines.some(id => !natalLone.includes(id)) ? sp.lines.filter(id => !natalLone.includes(id)) : sp.lines;
      const lines2 = ls.some(isB) && ls.some(isM) ? ls.filter(id => !isB(id)) : ls;
      const q = twoSystemQ(sp.q, mbti) ? PARALLEL_Q : sp.q;
      return { ...sp, lines: lines2.length ? lines2 : sp.lines, q };
    });
    return { ...c, sections, allowed: [...new Set(sections.flatMap(sp => sp.lines))] };
  });
}
/** 뿌리 3 입력 사실 이름(고객이 적은 것만). */
const OWN_JOB: Readonly<Record<string, string>> = { employee: "직장인", job_seeker: "취업 준비 중", student: "학생", self_employed: "자영업", business_owner: "사업", freelancer: "프리랜서", unemployed: "쉬는 중", homemaker: "살림" };
const OWN_REL: Readonly<Record<string, string>> = { single: "솔로", some: "썸", dating: "연애 중", married: "기혼" };
const AREA_KO: Readonly<Record<string, string>> = { love: "연애", relationships: "사람 사이", work: "일", money: "돈", alone: "마음" };
/**
 * AM2-8 2부 뿌리 3: 모든 key에 이 사람 재료 하나 이상. 고리(자리 뜻 × 입력 × 관계 뜻) → 짝 → 인물 사실(그 key 영역과 맞는 것, 고객이 적은 것만) 차례.
 * 고리 · 짝이 있으면 그대로 두고, 없을 때만 인물 사실 하나를 「이 사람 재료」로 정한다. 꼴 예문은 주지 않는다(뜻 조각만).
 */
export function withOwn(k0: KeyPlan, brief: Brief, wishTopics: readonly string[], product: Intake["product"]): KeyPlan {
  if ((k0.links ?? []).some(l => l.kind === "seat") || k0.pair) return k0;
  // AM2-13 4부: 대운 9장 key는 majorKeyFix가 재료(②)를 이미 정했다.
  if (product === "major_fortune" && k0.coreWords && k0.own) return k0;
  const f = brief.person.facts, areas = k0.areas?.length ? k0.areas : ["alone"];
  const rel = OWN_REL[f.relationshipNote === "some" ? "some" : f.relationship], job = OWN_JOB[f.job.status];
  const wishArea = (t: string) => (t === "love" ? ["love"] : t === "people" ? ["relationships"] : t === "mind" ? ["alone"] : t === "study" ? ["work"] : [t]);
  const wish = product === "annual_fortune" ? wishTopics.find(t => wishArea(t).some(a => areas.includes(a))) : undefined;
  const area = areas[0];
  const fact = areas.some(a => a === "love" || a === "relationships") && rel ? `연애: ${rel}` : areas.some(a => a === "work" || a === "money") && job ? `일: ${job}` : wish ? `적어 준 바람의 ${({ love: "연애", money: "돈", work: "일", study: "공부", people: "사람", mind: "마음" } as Record<string, string>)[wish] ?? wish} 쪽` : rel ? `연애: ${rel}` : job ? `일: ${job}` : `나이: ${brief.person.ageBand}`;
  // AM2-11 1부 3: 지시어(이 달 · 이 해) 대신 key 이름.
  return { ...k0, own: `〔${fact}〕 × 〔${k0.label}의 ${AREA_KO[area] ?? "마음"} 쪽 근거〕` };
}
/** 이 사람 재료 수(고리 · 짝 · 인물 사실) — 빌드 시험이 0인 key를 찾는다. */
export const ownCount = (k0: KeyPlan) => (k0.links ?? []).filter(l => l.kind === "seat").length + (k0.pair ? 1 : 0) + (k0.own ? 1 : 0);

/**
 * AM2-7 3부 6(덕짱님 지시): key 첫머리 돌리기 — 설계도가 key마다 시작 방식(장면 · 입력 · 관계 · 대비 · 영역)을 결정론으로 배정한다.
 * 같은 장에서 같은 방식 셋째는 없다. 고리 문장 꼴(경향 · 조건 · 비유 · 견줌)과 짝 문장 꼴도 장 안에서 같은 꼴은 둘까지.
 * 고를 수 있는 방식은 그 key의 재료로 정한다(장면 씨앗이 있어야 장면, 같은 자리 둘째부터 대비, 고리 입력이 있어야 입력).
 */
export function assignForms(keys: readonly KeyPlan[], pairs: readonly Pair[]): KeyPlan[] {
  const used = { opener: new Map<string, number>(), link: new Map<string, number>(), pair: new Map<string, number>() };
  const take = (m: Map<string, number>, cands: readonly string[], cap: number, rot: number) => { const order = [...cands.slice(rot % Math.max(1, cands.length)), ...cands.slice(0, rot % Math.max(1, cands.length))]; const pick = order.find(x => (m.get(x) ?? 0) < cap) ?? order[0]; if (pick) m.set(pick, (m.get(pick) ?? 0) + 1); return pick; };
  // P7 판독(annual-p5 7 · 1월 「…쪽이 한 문장 안에서 겹칩니다」 · P6 「…와 같은 쪽으로 겹쳐요」 21곳): 꼴 이름이 본문에 옮겨졌다 — 옮겨 쓸 말(「겹쳐」 「한 문장」)을 꼴 이름에 두지 않는다. P7 major-1 2036 「채워지는 쪽을 먼저 둡니다」 — 꼴 이름은 화살표 메모 꼴로(본문 문장이 아님이 보이게).
  const PAIR_FORM: Readonly<Record<string, readonly string[]>> = { 공통: ["두 근거가 같은 모습을 가리킴(그 모습을 이 사람의 장면으로)", "유형 버릇 → 그때 기운이 받침(장면으로)"], 긴장: ["유형 버릇 ↔ 그때 기운이 맞섬(「-지만」 한 번)", "유형 버릇 먼저 → 그때 기운이 거스름(장면으로)"], 보완: ["한쪽의 빈 곳 ← 다른 쪽이 채움(장면으로)", "채워지는 쪽 먼저 → 채우는 쪽(장면으로)"] };
  // AM2-8 3부 뿌리 2: 같은 방식이 장 안에서 셋째가 되지 않게 고를 수 있는 방식을 늘리고(앞 key와 견줌 · 물음 · 자리), 다 찼으면 가장 덜 쓴 방식.
  // 입력으로 여는 key는 장마다 둘까지(나머지 key에서는 입력을 첫 문장 밖에 둔다 — prompt.ts).
  const least = (m: Map<string, number>, cands: readonly string[]) => [...cands].sort((a, b) => (m.get(a) ?? 0) - (m.get(b) ?? 0))[0];
  return keys.map((k, i) => {
    const seat = (k.links ?? []).find(l => l.kind === "seat");
    const cands = [...(k.scene ? ["장면"] : []), ...(seat && (seat.nth ?? 1) > 1 ? ["대비"] : []), ...(seat ? ["자리"] : []), ...(seat || k.own ? ["입력"] : []), "관계", "영역", ...(i > 0 ? ["견줌"] : []), "물음"];
    const free = cands.filter(x => (used.opener.get(x) ?? 0) < 2);
    const opener = free.length ? take(used.opener, free, 2, i) : (() => { const pk = least(used.opener, cands.filter(x => x !== "입력")); used.opener.set(pk, (used.opener.get(pk) ?? 0) + 1); return pk; })();
    const linkForm = seat ? take(used.link, ["경향", "조건", "비유", "견줌"], 2, i) : undefined;
    const reason = k.pair ? pairs.find(p => p.id === k.pair)?.reason : undefined;
    const pairForm = reason ? take(used.pair, PAIR_FORM[reason] ?? [], 2, i) : undefined;
    return { ...k, ...(opener ? { opener } : {}), ...(linkForm ? { linkForm } : {}), ...(pairForm ? { pairForm } : {}) };
  });
}
