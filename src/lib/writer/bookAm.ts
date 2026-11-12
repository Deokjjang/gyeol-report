/**
 * AM2-3 5부(덕짱님과 정한 시안) — 세운·대운 v5 책 화면 투영(호출 0, 저장본은 그대로 · 읽을 때만).
 * - 세운 앞머리 「2027 한 해 흐름표」: 해 머리(간지 칸 · 「정미년 · 고르게 다질 해」 · 하늘·땅 십성과 쉬운 뜻 · 흐름) · 내 오행 막대(원국 분포 + 그 해 들어오는 기운) ·
 *   13행(달·절입 날짜 | 간지 칸 | 한 줄 뜻 | 십성 하늘·땅 + 영역 신호 오름·살필 | 흐름 점·단어) · 지금 달 표시 · 가장 오르는 달 ★ · 십성 한 줄 사전.
 * - 달·해 카드: 머리(달·날짜·흐름 단어) → 한 줄 뜻 → 좋은 것 / 살필 점 → 이달의 한 가지(지난 때는 돌아보기) → 본문 → 「명리로 보면」(관계 이름 + 쉬운 뜻).
 * - 대운 평생 지도: 같은 주제 대운을 한 띠로, 나이가 주인공, 간지는 오행 색 칸, 대운수·바뀌는 달은 머리에 한 번. 앞으로 10년표: 연도·나이 | 간지 | 한 줄 뜻 | 십성 | 흐름, 핵심 해 ★, 대운이 바뀌는 곳에 구분 줄.
 * 색은 오행에만(화면 CSS), 흐름·오름·살필·지금은 흑백 + 글자.
 */
import type { AmEl, AmElement, AmRow, AmYearHead, BookPage, BookParagraph } from "@/app/dev/book-preview/bookTypes";
import type { BookSection } from "./format";
import { FLOW_WORD, halfHapLine, josa } from "@/lib/brief/labels";
import { coreLine, coreOf, coreRowLine, loveUpOf, relFlow, TEN_GOD_SHORT } from "@/lib/brief/core";
import { BRANCH_MAIN_ELEMENT, STEM_ELEMENT } from "@/lib/saju/constants";
import type { V5BookDraft, V5TimelineCard } from "./book";

const EL: Readonly<Record<string, AmEl>> = { WOOD: "wood", FIRE: "fire", EARTH: "earth", METAL: "metal", WATER: "water" };
export const elsOf = (hanja: string): AmEl[] => { const a = STEM_ELEMENT[hanja[0] as keyof typeof STEM_ELEMENT], b = BRANCH_MAIN_ELEMENT[hanja[1] as keyof typeof BRANCH_MAIN_ELEMENT]; return [EL[a] ?? "earth", EL[b] ?? "earth"]; };
const tg = (label: string) => label.replace(/\(.*\)$/, "").trim();
const DOMAIN_KO: Readonly<Record<string, string>> = { love: "연애", money: "돈", work: "일", people: "사람", mind: "마음" };
const keySpanOf = (s: BookSection, i: number, text: string) => { const k = s.keySpans?.[i]; return k && k[0] >= 0 && k[0] < k[1] && k[1] <= text.length ? { keySpan: [k[0], k[1]] as [number, number] } : {}; };
type Card = V5TimelineCard & { span?: { start: string; end: string }; signals?: Record<string, string>; good?: string; bridge?: boolean; keyYear?: { rank: number; reasons: string[] } };
const md = (iso: string) => `${Number(iso.slice(5, 7))}/${Number(iso.slice(8, 10))}`;
/** 관계 이름 + 쉬운 뜻 한 줄(AM2-4 3부: 뜻 끝은 「…흐름」 — 달 카드의 「…해」도 고친다. 반합은 반쯤 묶임). */
const relationsOf = (c: Card) => c.badges.map(b => { const raw = b.line.replace(/^반합\([^)]*\): /, ""); const half = b.label.endsWith("(반쯤)");
  return { name: `${b.label.replace(/\(반쯤\)$/, " 반합")}${b.with ? ` · ${b.with} 자리와` : ""}`, plain: relFlow(half ? halfHapLine(raw) : raw) }; });
const EL_NAME: Readonly<Record<string, string>> = { WOOD: "나무(목)", FIRE: "불(화)", EARTH: "흙(토)", METAL: "쇠(금)", WATER: "물(수)" };
/** 화면 「뜻」 한 줄(AM2-4 6부): 그 달·해 핵심(엔진 가중치 — 설계도와 같은 함수). dayunTg: 세운 달은 책의 해가 속한 대운 십성. */
// AM2-6 6부: 핵심 줄에 자리 뜻(일 자리는 그 달·해 연애 오름이면 「가까운 사람」, 아니면 「내 생활」 — 연결 고리 재료와 같은 고름).
const meaningOf = (c: Card, dayunTg?: string, gender?: string) => coreLine(coreOf(c, dayunTg ? { dayunTenGod: dayunTg } : {}), { loveUp: loveUpOf(c as never, gender) });
const rowMeaningOf = (c: Card, dayunTg?: string) => coreRowLine(coreOf(c, dayunTg ? { dayunTenGod: dayunTg } : {}));
const signalsOf = (c: Card) => { const s: Readonly<Record<string, string>> = c.signals ?? {}; return { ups: Object.entries(DOMAIN_KO).filter(([k]) => s[k] === "↑").map(([, v]) => v), cautions: Object.entries(DOMAIN_KO).filter(([k]) => s[k] === "↓").map(([, v]) => v) }; };
const monthName = (c: Card) => c.label.split(" (")[0].replace(/ · \d{4}년 .+ 마지막 달$/, "");

/** 세운 달 카드 · 대운 해 카드(같은 문법). */
export function periodCardOf(c: Card, section: BookSection | undefined, a: { eyebrow: string; now: boolean; past: boolean; star: boolean; dayunTg?: string; gender?: string }): Extract<BookPage, { kind: "periodCard" }> {
  const month = c.kind === "month";
  const paragraphs: BookParagraph[] = (section?.paragraphs ?? []).map((text, i) => ({ text, notes: [], ...(section ? keySpanOf(section, i, text) : {}) }));
  const sub = month ? (c.span ? `${md(c.span.start)}~${md(c.span.end)}` : "") : c.age !== undefined ? `만 ${c.age}세` : "";
  // AM2-4 1부(사실은 화면, 해석은 본문): 카드는 결정론 사실만 — 간지 · 하늘·땅 십성과 쉬운 뜻 · 흐름 · 영역 신호 · 관계 배지(접기) · 오행 채움 · 할 일 하나 · 그림 한 줄.
  // 좋은 것·살필 점(해석 줄)은 카드에 두지 않는다(본문이 맡는다). 지난 해·달은 할 일 대신 엔진 돌아보기 질문.
  const one = c.review && (a.past || !c.todo) ? { label: "돌아보기", text: c.review } : c.todo ? { label: month ? "이달의 한 가지" : "해 볼 것", text: c.todo } : undefined;
  const sky = tg(c.tenGod.stem), ground = tg(c.tenGod.branch), sig = signalsOf(c);
  const fills = c.fillsLack?.fills && c.fillsLack.elements.length ? `모자란 ${josa(c.fillsLack.elements.map(x => EL_NAME[x] ?? x).join("·"), "을를")} 채워요` : undefined;
  return { kind: "periodCard", unit: month ? "달" : "해", id: `card-${c.key}`, title: month ? monthName(c) : `${c.key}년 ${c.ganji.hangul}년`, eyebrow: a.eyebrow, sub, ganji: c.ganji.hanja, els: elsOf(c.ganji.hanja),
    flow: c.flow.score, flowWord: FLOW_WORD[c.flow.score] ?? "보통", line: c.imageLine, ...(one ? { one } : {}),
    paragraphs, relations: relationsOf(c), sky, ground, skyLine: TEN_GOD_SHORT[sky] ?? "", groundLine: TEN_GOD_SHORT[ground] ?? "", ups: sig.ups, cautions: sig.cautions, ...(fills ? { fills } : {}), core: meaningOf(c, a.dayunTg, a.gender), past: a.past, now: a.now, star: a.star };
}

// AM2-4 6부: 표 한 줄은 그림 문장 대신 「뜻」(그 달·해 핵심 한 줄, 결정론) — 그림은 카드로.
const rowOf = (c: Card, a: { name: string; sub: string; now: boolean; past: boolean; star: boolean; divider?: string; dayunTg?: string }): AmRow => ({ key: c.key, name: a.name, sub: a.sub, ganji: c.ganji.hanja, els: elsOf(c.ganji.hanja), line: rowMeaningOf(c, a.dayunTg),
  sky: tg(c.tenGod.stem), ground: tg(c.tenGod.branch), ...signalsOf(c), flow: c.flow.score, flowWord: FLOW_WORD[c.flow.score] ?? "보통", now: a.now, past: a.past, star: a.star, page: 0, ...(a.divider ? { divider: a.divider } : {}) });
const dictOf = (rows: readonly AmRow[]) => [...new Set(rows.flatMap(r => [r.sky, r.ground]))].filter(n => TEN_GOD_SHORT[n]).map(name => ({ name, line: TEN_GOD_SHORT[name] }));
/** 책의 해가 속한 대운 십성(세운 「대운 겹침」 — 설계도와 같은 값). */
export const yearDayunTg = (d: V5BookDraft, year: number) => (d.timeline?.cycles ?? []).find(cy => { const [a1, b1] = cy.years.split("~").map(Number); return a1 <= year && year <= b1; })?.tenGod;

/** 세운 「YYYY 한 해 흐름표」. naturalElements: 원국 오행(만세력 표의 보이는 수). */
export function flowTableOf(d: V5BookDraft, months: readonly Card[], day: string, natal: readonly { label: string; visible: number }[]): Extract<BookPage, { kind: "flowTable" }> {
  const year = d.annual?.year ?? Number(months[1]?.key.slice(0, 4));
  const yc = (d.timeline?.cards ?? []).find(c => c.kind === "year" && Number(c.key) === year) as Card | undefined;
  const max = Math.max(...months.filter(m => !m.bridge).map(m => m.flow.score));
  const time = (m: Card) => (m.span ? (day >= m.span.end.slice(0, 10) ? "past" : day >= m.span.start.slice(0, 10) ? "now" : "future") : "future");
  const dt = yearDayunTg(d, year);
  const rows = months.map(m => rowOf(m, { name: monthName(m), sub: m.span ? `${md(m.span.start)}~${md(m.span.end)}` : "", now: time(m) === "now", past: time(m) === "past", star: !m.bridge && m.flow.score === max, ...(dt ? { dayunTg: dt } : {}) }));
  const head: AmYearHead | null = yc ? { ganji: yc.ganji.hanja, els: elsOf(yc.ganji.hanja), name: `${yc.ganji.hangul}년`, ...(d.annual?.verdict ? { verdict: d.annual.verdict } : {}), sky: tg(yc.tenGod.stem), ground: tg(yc.tenGod.branch),
    skyLine: TEN_GOD_SHORT[tg(yc.tenGod.stem)] ?? "", groundLine: TEN_GOD_SHORT[tg(yc.tenGod.branch)] ?? "", flow: yc.flow.score, flowWord: FLOW_WORD[yc.flow.score] ?? "보통" } : null;
  const incoming = new Set(yc ? elsOf(yc.ganji.hanja) : []);
  const ORDER: readonly AmEl[] = ["wood", "fire", "earth", "metal", "water"], KO: Readonly<Record<AmEl, string>> = { wood: "목", fire: "화", earth: "토", metal: "금", water: "수" };
  const elOfLabel = (l: string): AmEl | undefined => ORDER.find(e => l.includes(KO[e]) || l.includes({ wood: "나무", fire: "불", earth: "흙", metal: "쇠", water: "물" }[e]));
  const elements: AmElement[] = ORDER.map(el => ({ el, label: `${KO[el]}(${{ wood: "나무", fire: "불", earth: "흙", metal: "쇠", water: "물" }[el]})`, count: natal.filter(n => elOfLabel(n.label) === el).reduce((x, n) => x + n.visible, 0), incoming: incoming.has(el) }));
  return { kind: "flowTable", id: "flow-table", title: `${year} 한 해 흐름표`, year: head, elements, rows, dict: dictOf(rows) };
}

/** 대운 「앞으로 10년표」(지난 3년 · 기준 해 · 앞으로 10년, 대운이 바뀌는 곳에 구분 줄). */
export function decadeTableOf(d: V5BookDraft, years: readonly Card[], thisYear: number): Extract<BookPage, { kind: "decadeTable" }> {
  const life = d.timeline?.lifetime ?? [];
  const rows = years.map(c => { const y = Number(c.key), cyc = life.find(l => l.startYear <= y && y <= l.endYear);
    const dyName = cyc ? `${cyc.ganji.match(/\(([가-힣]{2})\)/)?.[1] ?? cyc.ganji} 대운` : c.dayun?.ganji ?? "";
    const divider = c.dayun?.transition ? `${c.dayun.start ?? `${y}년 무렵부터`} ${dyName} · ${tg(c.dayun.tenGod ?? "")}${cyc ? ` · ${cyc.theme}` : ""}` : undefined;
    return rowOf(c, { name: `${y}년`, sub: c.age !== undefined ? `만 ${c.age}세` : "", now: y === thisYear, past: y < thisYear, star: Boolean(c.keyYear), ...(divider ? { divider } : {}) }); });
  // AM2-4 6부 머리: 「지난 3년(2023~2025) · 2026년 · 앞으로 10년(2027~2036)」.
  const past = years.filter(c => Number(c.key) < thisYear).map(c => Number(c.key)), next = years.filter(c => Number(c.key) > thisYear).map(c => Number(c.key));
  const head = [past.length ? `지난 ${past.length}년(${past[0]}~${past.at(-1)})` : "", `${thisYear}년`, next.length ? `앞으로 ${next.length}년(${next[0]}~${next.at(-1)})` : ""].filter(Boolean).join(" · ");
  return { kind: "decadeTable", id: "decade-table", title: "앞으로 10년표", head, rows, dict: dictOf(rows) };
}

/** 대운 평생 지도: 같은 주제가 이어지는 대운을 한 띠로, 대운수·바뀌는 달은 머리에 한 번. */
export function lifetimeOf(d: V5BookDraft, thisYear: number): Extract<BookPage, { kind: "lifetime" }> {
  const life = d.timeline?.lifetime ?? [];
  const cycles = life.map(c => ({ label: c.label, ages: c.ages, tenGod: tg(c.tenGod), theme: c.theme, current: c.current, ...(c.hanja ? { hanja: c.hanja, els: elsOf(c.hanja) } : {}), past: c.endYear < thisYear }));
  const bands: { theme: string; cycles: number[] }[] = [];
  cycles.forEach((c, i) => { const last = bands.at(-1); if (last && cycles[last.cycles.at(-1)!].theme === c.theme) last.cycles.push(i); else bands.push({ theme: c.theme, cycles: [i] }); });
  const daeunsu = life[0]?.label.match(/대운수 (\d+)/)?.[1], month = life[0]?.label.match(/(\d{1,2}(?:~\d{1,2})?월) 무렵부터/)?.[1];
  // AM2-6 6부: 첫 대운이 만 0세에 시작하면 「대운수 0」 대신 「태어나면서부터」(값이 빠진 것처럼 보였다 — P5 major-p5). 대운 줄마다 붙은 「(대운수 0)」은 뗀다.
  const head = [daeunsu === "0" ? "첫 대운은 태어나면서부터 시작돼요" : daeunsu ? `대운수 ${daeunsu}(첫 대운이 시작되는 만 나이)` : "", month ? `대운은 10년마다 ${month} 무렵 바뀌어요` : ""].filter(Boolean).join(" · ");
  const cycles2 = daeunsu === "0" ? cycles.map(c => ({ ...c, label: c.label.replace(/ ?\(대운수 0\)/, "") })) : cycles;
  return { kind: "lifetime", title: "평생 대운 지도", cycles: cycles2, ...(head ? { head } : {}), bands };
}
