/**
 * AM2-4 1부(덕짱님 지시 2026-11-12 「사실은 화면, 해석은 본문」) — 달·해 key의 핵심 고르기(결정론, 호출 0).
 * 엔진 가중치: 일·월 자리 충·합·형 > 대운 겹침 > 그 밖. 설계도(작가 근거 1~2개 · 반드시 쓸 것)와 화면(흐름표·10년표 「뜻」 한 줄)이 같은 함수를 쓴다.
 * 나머지 사실(관계 배지·흐름·오행 채움·할 일)은 화면이 보여 주고 본문은 되풀이하지 않는다.
 */
import type { TimelineEntry } from "./schema";

type Badge = TimelineEntry["badges"][number];
export type CoreItem =
  | { readonly kind: "rel"; readonly badge: Badge; readonly name: string; readonly weight: number }
  | { readonly kind: "tenGod"; readonly side: "sky" | "ground"; readonly name: string; readonly weight: number; readonly overlap?: boolean }
  | { readonly kind: "transition"; readonly name: string; readonly tenGod: string; readonly weight: number };

/** 관계 이름(화면·카드·검사 공통): 「화국(반쯤)」 → 「화국 반합」(괄호 값을 고객 말로, AM2-4 3부). */
export const relName = (label: string) => label.replace(/\(반쯤\)$/, " 반합").trim();
/** 묶음·부딪침·다듬음(충·합·형)은 무겁게, 어긋남·방해·엇박자·빈자리는 가볍게. */
const HEAVY = new Set(["CHUNG", "HYEONG", "YUKHAP", "SAMHAP", "BANGHAP", "STEM_HAP"]);
const tgName = (label: string) => label.replace(/\(.*\)$/, "").trim();
const READ: Readonly<Record<string, string>> = { 甲: "갑", 乙: "을", 丙: "병", 丁: "정", 戊: "무", 己: "기", 庚: "경", 辛: "신", 壬: "임", 癸: "계", 子: "자", 丑: "축", 寅: "인", 卯: "묘", 辰: "진", 巳: "사", 午: "오", 未: "미", 申: "신", 酉: "유", 戌: "술", 亥: "해" };
/** 「丙寅 대운」 → 「병인 대운」(이름에 한자를 두지 않는다 — 한자는 렌더가 붙인다). */
const hangulGanji = (t: string) => t.replace(/[甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥]/g, ch => READ[ch] ?? ch).replace(/\s+/g, " ").trim();

/** 한 key의 후보를 가중치 순으로(같은 무게면 엔진 순서). dayunTenGod: 그 시기가 속한 대운의 천간 십성(세운 달은 그 해의 대운). */
export function coreCandidates(e: Pick<TimelineEntry, "badges" | "tenGod" | "dayun">, dayunTenGod?: string): CoreItem[] {
  const out: CoreItem[] = [];
  e.badges.forEach((b, i) => {
    const w = b.with ?? "", day = /태어난 날/.test(w), month = /태어난 달/.test(w);
    const weight = b.kind === "GONGMANG" ? 1.0 : HEAVY.has(b.kind) ? (day ? 3.2 : month ? 3.0 : 1.5) : (day || month ? 1.3 : 1.2);
    out.push({ kind: "rel", badge: b, name: relName(b.label), weight: weight - i * 0.001 });
  });
  if (e.dayun?.transition) out.push({ kind: "transition", name: `새 대운 ${hangulGanji(e.dayun.ganji).replace(/ 대운$/, "")}`, tenGod: tgName(e.dayun.tenGod ?? ""), weight: 2.5 });
  const dt = dayunTenGod ? tgName(dayunTenGod) : e.dayun?.tenGod ? tgName(e.dayun.tenGod) : undefined;
  const sky = tgName(e.tenGod.stem), ground = tgName(e.tenGod.branch);
  if (dt && !e.dayun?.transition && (sky === dt || ground === dt)) out.push({ kind: "tenGod", side: sky === dt ? "sky" : "ground", name: sky === dt ? sky : ground, weight: 2.0, overlap: true });
  out.push({ kind: "tenGod", side: "sky", name: sky, weight: 0.5 });
  return out.sort((a, b) => b.weight - a.weight);
}

/** 핵심 1~2개: 맨 앞 하나 + 둘째가 실제 관계·겹침(무게 1 이상)이면 둘째까지(짧은 key는 하나). 관계가 없으면 하늘 십성 하나. */
export function coreOf(e: Pick<TimelineEntry, "badges" | "tenGod" | "dayun">, opts: { dayunTenGod?: string; short?: boolean } = {}): CoreItem[] {
  const c = coreCandidates(e, opts.dayunTenGod);
  const first = c[0];
  const second = c.slice(1).find(x => x.weight >= 1.0 && !(x.kind === "tenGod" && first.kind === "tenGod"));
  return first.weight < 1 || opts.short || !second ? [first] : [first, second];
}

/** 관계 종류의 짧은 뜻(화면 「뜻」 한 줄). */
export const REL_SHORT: Readonly<Record<string, string>> = {
  CHUNG: "부딪쳐 바꿀 계기", HYEONG: "눌러 다듬을 일", YUKHAP: "맞물려 묶이는 힘", SAMHAP: "한 기운으로 모이는 힘", BANGHAP: "한 계절 기운이 모이는 힘", STEM_HAP: "하늘 글자끼리 묶이는 힘",
  PA: "맞춰 둔 것이 어긋날 일", HAE: "가까운 데서 오는 작은 방해", WONJIN: "까끌한 엇박자", GONGMANG: "힘이 빠져나가는 빈자리",
};
/** 십성 짧은 뜻(해 머리 상자 「하늘 상관 · 틀을 깨는 말과 아이디어」, 대시 연속 없음 · 화면 「뜻」 한 줄). */
export const TEN_GOD_SHORT: Readonly<Record<string, string>> = {
  비견: "내 편이자 경쟁자가 되는 같은 기운", 겁재: "승부욕과 나눔을 부르는 기운", 식신: "손과 입이 즐거운 만드는 기운", 상관: "틀을 깨는 말과 아이디어",
  편재: "크게 움직이는 돈과 거래", 정재: "꾸준히 모으는 돈과 살림", 편관: "마감과 도전으로 다그치는 힘", 정관: "규칙과 평가로 바로잡는 힘",
  편인: "남다른 공부와 생각", 정인: "돌봐 주는 도움과 배움",
};
/** 자리 줄임: 「태어난 날·태어난 달」 → 「태어난 날·달」. */
export const seatShort = (w: string) => { const s = w.split("·").map(x => x.trim()).filter(Boolean); return s.length ? `태어난 ${s.map(x => x.replace(/^태어난 /, "")).join("·")}` : ""; };
/** 표 한 줄 짧은 뜻(390px 표 칸 약 122px — 한 줄 8자 남짓, 두 줄 = 공백 포함 16자 안). */
export const REL_ROW: Readonly<Record<string, string>> = { CHUNG: "부딪쳐 바뀜", HYEONG: "다듬을 일", YUKHAP: "맞물려 묶임", SAMHAP: "기운이 모임", BANGHAP: "계절 기운 모임", STEM_HAP: "하늘 글자 묶임", PA: "어긋날 일", HAE: "작은 방해", WONJIN: "까끌한 엇박자", GONGMANG: "힘이 새는 빈자리" };
export const TEN_GOD_ROW: Readonly<Record<string, string>> = { 비견: "내 편과 경쟁", 겁재: "승부욕과 나눔", 식신: "만드는 즐거움", 상관: "틀을 깨는 말", 편재: "움직이는 큰돈", 정재: "꾸준한 돈", 편관: "다그치는 힘", 정관: "규칙과 평가", 편인: "남다른 공부", 정인: "도움과 배움" };
/** 흐름표·10년표 한 줄 「뜻」(AM2-4 6부): 그 달·해 핵심, 390px에서 두 줄 안. 자리는 카드(명리로 보면)가 보여 준다. */
export function coreRowLine(items: readonly CoreItem[]): string {
  const c = items[0];
  if (!c) return "";
  if (c.kind === "rel") return c.badge.kind === "GONGMANG" ? `공망 · ${REL_ROW.GONGMANG}` : `${c.name} · ${REL_ROW[c.badge.kind] ?? "걸리는 관계"}`;
  if (c.kind === "transition") return `새 대운 · ${TEN_GOD_ROW[c.tenGod] ?? c.tenGod}`;
  return c.overlap ? `${c.name} · 대운과 겹침` : `${c.name} · ${TEN_GOD_ROW[c.name] ?? ""}`.replace(/ · $/, "");
}
/**
 * AM2-6 6부: 화면 핵심 줄에 붙이는 자리 뜻(지식 DB deep/seat-meaning short:* 와 같은 값 — 화면 렌더는 지식 DB를 읽지 않는다. 시험 am26이 두 값이 같은지 본다).
 * 일 자리는 그 달·해에 연애가 오르면 「가까운 사람」, 아니면 「내 생활」(연결 고리 재료와 같은 고름 — loveUpOf).
 */
export const SEAT_SHORT_KO: Readonly<{ day: { close: string; life: string }; month: string; year: string; hour: string }> = { day: { close: "가까운 사람", life: "내 생활" }, month: "일터", year: "바깥 모임", hour: "혼자 시간" };
const HAP_KINDS = new Set(["YUKHAP", "STEM_HAP", "SAMHAP", "BANGHAP"]), CLASH_KINDS = new Set(["CHUNG", "HYEONG", "PA", "HAE", "WONJIN"]);
const GROUP_OF: Readonly<Record<string, string>> = { 比肩: "PEER", 劫財: "PEER", 食神: "OUTPUT", 傷官: "OUTPUT", 偏財: "WEALTH", 正財: "WEALTH", 偏官: "OFFICER", 正官: "OFFICER", 偏印: "RESOURCE", 正印: "RESOURCE" };
/** 연애가 오르는 key인지: 세운 달·해는 엔진 영역 신호, 대운 해(신호 없음 — 화면 칩도 없다)는 같은 엔진 셈의 연애 몫(배우자 별 쪽 십성 · 태어난 날 자리 합 − 충·형). */
export function loveUpOf(e: Pick<TimelineEntry, "signals" | "tenGod" | "badges">, gender: string | null | undefined): boolean {
  if (e.signals) return e.signals.love === "↑";
  const spouse = gender === "FEMALE" ? "OFFICER" : gender === "MALE" ? "WEALTH" : null;
  const grp = (label: string) => GROUP_OF[label.match(/\((.+)\)/)?.[1] ?? ""];
  const onDay = (b: Badge) => (b.with ?? "").split("·").some(x => /날$/.test(x.trim()));
  const score = (spouse && (grp(e.tenGod.stem) === spouse || grp(e.tenGod.branch) === spouse) ? 1 : 0) + (e.badges.some(b => HAP_KINDS.has(b.kind) && onDay(b)) ? 1 : 0) - (e.badges.some(b => CLASH_KINDS.has(b.kind) && onDay(b)) ? 1 : 0);
  return score >= 1;
}
const seatMeaningShort = (w: string, loveUp: boolean): string | undefined => { const s = w.split("·").map(x => x.trim()).filter(Boolean); if (s.length !== 1) return undefined;
  const seat = s[0].replace(/^태어난 /, ""); return seat === "날" ? (loveUp ? SEAT_SHORT_KO.day.close : SEAT_SHORT_KO.day.life) : seat === "달" ? SEAT_SHORT_KO.month : seat === "해" ? SEAT_SHORT_KO.year : seat === "시각" ? SEAT_SHORT_KO.hour : undefined; };
/** 카드 「핵심」 한 줄(그 달·해 핵심, 결정론 — 카드 칸은 넓어 자리까지). AM2-6 6부: 자리가 하나면 자리 뜻을 붙인다(「태어난 날 자리(가까운 사람)와 화국 반합 · 한 기운으로 모이는 힘」). */
export function coreLine(items: readonly CoreItem[], o: { loveUp?: boolean } = {}): string {
  const c = items[0];
  if (!c) return "";
  if (c.kind === "rel") {
    if (c.badge.kind === "GONGMANG") return `공망 · ${REL_SHORT.GONGMANG}`;
    const tail = `${c.name} · ${REL_SHORT[c.badge.kind] ?? "걸리는 관계"}`;
    const mean = c.badge.with ? seatMeaningShort(c.badge.with, Boolean(o.loveUp)) : undefined;
    const withMean = c.badge.with && mean ? `${seatShort(c.badge.with)} 자리(${mean})와 ${tail}` : null;
    if (withMean && withMean.replace(/\s/g, "").length <= 34) return withMean;
    const full = `${c.badge.with ? `${seatShort(c.badge.with)} 자리와 ` : ""}${tail}`;
    // 자리가 셋 이상이면 두 줄을 넘는다 — 자리는 카드(명리로 보면)에 두고 이름과 뜻만.
    return full.replace(/\s/g, "").length <= 24 ? full : tail;
  }
  if (c.kind === "transition") return `새 대운 시작 · ${TEN_GOD_SHORT[c.tenGod] ?? c.tenGod}`;
  return `${c.overlap ? "대운과 겹치는 " : ""}${c.name} · ${TEN_GOD_SHORT[c.name] ?? ""}`.replace(/ · $/, "");
}
/** 관계 뜻 끝을 「…흐름」으로(관계가 주어일 때 「원진은 … 달입니다」 비문 방지, AM2-4 3부). 달·해 카드 배지·작가 카드가 같이 쓴다. */
export const relFlow = (line: string) => line.replace(/(에 든) (해|달),/, "$1 때,").replace(/\s(해|달)(예요|입니다|이에요)?[.]?$/, " 흐름").trim();
