/**
 * AM2-4 2부(덕짱님 지시 2026-11-12 「반복은 고치지 않고, 설계도에서 미리 배분해 막는다」) — 처방 종류 사전(결정론, 호출 0).
 * - 종류마다 책 전체에서 한 곳(장 또는 key)에만 배정한다. key 카드 할 일(엔진 문형)이 먼저 자리를 잡고, 장은 남은 종류에서 고른다.
 * - 설계도는 장마다 「쓸 처방 종류」와 「금지 종류」를 준다. 검사(check.ts rx_repeat)는 같은 종류가 책에서 두 번 나오면 잡는다.
 * P3 판독: 적기 10곳 · 곁에 둘 사람 고르기 5곳 · 쉬기 4곳 · 말 다듬기 5곳 · 월급날 2곳 · 값 매기기 2곳 · 하루 묵히기 3곳 · 혼자 시간 2곳 · 보내기 전 다시 읽기 2곳.
 */
import type { Knowledge } from "./knowledge";
import type { TimelineEntry } from "./schema";
import { TIMELINE_ACTION_DOMAINS } from "@/data/knowledge-v5/schema";

export type RxKind = "보내기 전 다시 읽기" | "값 매기기" | "월급날·먼저 떼어 두기" | "하루 묵히기" | "말 다듬기·한 박자" | "끝까지 듣기" | "사람 고르기" | "쉬기·잠" | "혼자 시간" | "끝낼 일 하나" | "연락·안부" | "몸 움직이기" | "적기·목록";
/** 순서가 곧 우선(구체적인 것 먼저: 「금액을 적어」는 값 매기기, 「보내기 전 다시 읽기」는 적기가 아니다). */
export const RX: readonly (readonly [RxKind, RegExp])[] = [
  ["보내기 전 다시 읽기", /보내기 전[^.?!]{0,14}(다시|한 번 더) 읽|(다시|한 번 더) 읽어 (보|두)|보내기 전에 한 번 더/],
  ["값 매기기", /금액|값을 (매기|매겨|붙)|가격을 (붙|매)|단가|시간과 (받을 )?(금액|돈)/],
  ["월급날·먼저 떼어 두기", /월급날|이체|먼저 떼어|떼어 두|쓸 몫과 모을 몫|모을 몫/],
  ["하루 묵히기", /하룻밤|하루 (두고|뒤에|묵혀|지나|미뤄)|묵혀 두|묵히고/],
  ["말 다듬기·한 박자", /한 박자|말을 꺼내기 전|말하기 전|말을 줄이|온도를 (한 번 더 )?살피|말[^.?!]{0,6}다듬|늦춰 건네|한 줄 먼저 붙/],
  ["끝까지 듣기", /끝까지 듣|먼저 들어 보|듣기만 해/],
  ["사람 고르기", /곁에 둘 사람|사람을 (고르|골라)|추려 (보|두)|가려 (보|두)|동그라미를 치|사람[^.?!]{0,6}(고르|골라)/],
  ["쉬기·잠", /쉬는 (날|시간|칸)|쉬어 가는 날|회복하는 날|잠(을|부터|자리| 시간)|자는 시간|일찍 자|기상 시간|낮잠/],
  ["혼자 시간", /혼자 (있는|보내는|밥|먹는|걷|하는|쓰는)|혼자만의/],
  ["끝낼 일 하나", /끝낼 일|하나만 (먼저 )?끝내|하나를 골라 끝까지|끝까지 (다듬|마무리)/],
  ["연락·안부", /안부|연락(을|해| 한 번)|먼저 연락/],
  ["몸 움직이기", /산책|스트레칭|걷기|몸을 (움직|쓰)|운동|계단/],
  ["적기·목록", /적어 (보세요|두세요|두고|두면|넣)|한 줄로 (적|남기)|목록(을|으로)|메모(해|를|장)|노트에|써 (보세요|두세요)|기록해/],
];
export const rxKindOf = (text: string): RxKind | null => RX.find(([, re]) => re.test(text))?.[0] ?? null;
/** 한 문장·할 일에 든 종류 전부(「목록을 적어 보고 … 두 사람을 고르세요」 = 적기·목록 + 사람 고르기). */
export const rxKindsOf = (text: string): RxKind[] => RX.filter(([, re]) => re.test(text)).map(([kd]) => kd);
/** 본문에서 처방으로 세는 문장 꼴(권유·명령·「…는 장면」). 설명 문장(「쉬는 시간이 등불을 오래 켜 둡니다」)은 세지 않는다. */
export const ADVICE_FORM = /(세요|봐요|두세요|해 두면|하면 좋|편이 좋|게 좋아요|면 충분|는 장면|기 좋은 (때|날|달|해)|해 보기|보세요)[^.?!]{0,8}[.!?]?$/;
/** 비유 마디(「적금 자동이체처럼,」)의 낱말은 처방으로 세지 않는다. */
export const rxOfSentence = (sen: string): RxKind[] => (ADVICE_FORM.test(sen.trim()) ? rxKindsOf(sen.replace(/[^,.?!]{0,24}처럼[, ]\s*/g, "")) : []);

/** 장마다 고를 처방 종류(앞에서부터, 아직 안 쓴 것). 장 질문에 맞는 행동 하나. */
export const CHAPTER_RX: Readonly<Record<string, readonly RxKind[]>> = {
  // 세운
  big: ["적기·목록", "끝낼 일 하나"], love: ["말 다듬기·한 박자", "끝까지 듣기", "연락·안부"], money: ["월급날·먼저 떼어 두기", "하루 묵히기", "값 매기기"], work: ["값 매기기", "보내기 전 다시 읽기", "끝낼 일 하나"],
  people: ["사람 고르기", "연락·안부", "끝까지 듣기"], mind: ["쉬기·잠", "혼자 시간", "몸 움직이기"], use: ["끝낼 일 하나", "적기·목록", "하루 묵히기"], wish: ["적기·목록", "끝낼 일 하나"], next: ["혼자 시간", "적기·목록"],
  // 대운
  read: [], past: [], now: ["끝낼 일 하나", "적기·목록"], turn: ["사람 고르기", "적기·목록"], map: ["값 매기기", "월급날·먼저 떼어 두기"], growth: ["혼자 시간", "말 다듬기·한 박자"], plan: ["적기·목록", "월급날·먼저 떼어 두기"], letter: ["연락·안부", "혼자 시간"],
};

const CARD_TIME = /(?<![가-힣])(지금|올해|요즘|최근|당장|오늘|내일)|이번 ?(달|주|해|한 해|한 번)|궁금했던|연락이 끊긴|예전|오래 미뤄|몇 (달|해)째/;
const tgHanja = (label: string) => label.match(/\(([^)]+)\)/)?.[1] ?? "";
/**
 * key 카드 할 일 배분: 앞 key부터 엔진 문형(그 십성의 모든 갈래·세기 + 십성 기본)에서 아직 안 쓴 종류(또는 종류 없음) 문형을 고른다.
 * 엔진이 고른 문형이 이미 비어 있는 종류면 그대로 둔다. 할 일 문형에 시점 말·지난 전제(「궁금했던」「연락이 끊긴」 — P3 판독 경계 #11·#12·#15)가 든 것은 고르지 않는다.
 * 지난 해(돌아보기)는 할 일이 없다. 반환: 바뀐 항목과 쓴 종류.
 */
export function allocateTodos(entries: TimelineEntry[], k: Pick<Knowledge, "actions">, facts: { job?: string; relationship?: string }): { used: Map<RxKind, string>; changed: number } {
  const used = new Map<RxKind, string>(), texts = new Set<string>();
  const domains = TIMELINE_ACTION_DOMAINS.filter(d => !(d === "study" && facts.job !== "student") && !(d === "love" && facts.relationship === "married"));
  let changed = 0;
  for (const e of entries) {
    if (!e.todo) continue;
    const tg = tgHanja(e.tenGod.stem);
    const pool = [e.todo, ...domains.flatMap(d => ["high", "low"].flatMap(b => k.actions.find(a => a.id === `act:${tg}:${d}:${b}`)?.text ?? [])), ...(k.actions.find(a => a.id === `tg:${tg}`)?.text ?? [])]
      .filter(t => !CARD_TIME.test(t) && !/많아지|한층|훨씬|가장 /.test(t));
    const ok = (t: string) => !texts.has(t) && rxKindsOf(t).every(kd => !used.has(kd));
    const pick = pool.find(ok) ?? pool.find(t => !texts.has(t)) ?? e.todo;
    if (pick !== e.todo) { e.todo = pick; e.action = { templateId: `${e.action.templateId}~rx`, text: pick }; changed++; }
    texts.add(pick); for (const kd of rxKindsOf(pick)) if (!used.has(kd)) used.set(kd, e.key);
  }
  return { used, changed };
}

/** 장 처방 배분: key 카드가 쓴 종류를 빼고, 장마다 선호 순서에서 하나. 쓰는 종류와 금지 종류(책의 다른 곳이 쓴 모든 종류). */
export function allocateChapters(chapterIds: readonly { readonly n: number; readonly id: string; readonly keyed: boolean }[], keyUsed: ReadonlyMap<RxKind, string>): Map<number, { use: RxKind | null; forbid: RxKind[] }> {
  const taken = new Map<RxKind, string>([...keyUsed].map(([kd, key]) => [kd, `key ${key}`] as const));
  const mine = new Map<number, RxKind | null>();
  for (const c of chapterIds) { if (c.keyed) continue; const pref = CHAPTER_RX[c.id.replace(/:.*$/, "")] ?? []; const pick = pref.find(p => !taken.has(p)) ?? null; if (pick) taken.set(pick, `${c.n}장`); mine.set(c.n, pick); }
  const out = new Map<number, { use: RxKind | null; forbid: RxKind[] }>();
  for (const c of chapterIds) { const use = mine.get(c.n) ?? null; out.set(c.n, { use: c.keyed ? null : use, forbid: [...taken.keys()].filter(kd => kd !== use) }); }
  return out;
}
