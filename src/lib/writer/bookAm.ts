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
import { FLOW_WORD, halfHapLine, TEN_GOD_EASY } from "@/lib/brief/labels";
import { BRANCH_MAIN_ELEMENT, STEM_ELEMENT } from "@/lib/saju/constants";
import type { V5BookDraft, V5TimelineCard } from "./book";

const EL: Readonly<Record<string, AmEl>> = { WOOD: "wood", FIRE: "fire", EARTH: "earth", METAL: "metal", WATER: "water" };
export const elsOf = (hanja: string): AmEl[] => { const a = STEM_ELEMENT[hanja[0] as keyof typeof STEM_ELEMENT], b = BRANCH_MAIN_ELEMENT[hanja[1] as keyof typeof BRANCH_MAIN_ELEMENT]; return [EL[a] ?? "earth", EL[b] ?? "earth"]; };
const tg = (label: string) => label.replace(/\(.*\)$/, "").trim();
const DOMAIN_KO: Readonly<Record<string, string>> = { love: "연애", money: "돈", work: "일", people: "사람", mind: "마음" };
const keySpanOf = (s: BookSection, i: number, text: string) => { const k = s.keySpans?.[i]; return k && k[0] >= 0 && k[0] < k[1] && k[1] <= text.length ? { keySpan: [k[0], k[1]] as [number, number] } : {}; };
type Card = V5TimelineCard & { span?: { start: string; end: string }; signals?: Record<string, string>; good?: string; bridge?: boolean; keyYear?: { rank: number; reasons: string[] } };
const md = (iso: string) => `${Number(iso.slice(5, 7))}/${Number(iso.slice(8, 10))}`;
/** 관계 이름 + 쉬운 뜻 한 줄(달 카드는 「해」 → 「달」, 반합은 반쯤 묶임). */
const relationsOf = (c: Card) => c.badges.map(b => { const unit = c.kind === "month" ? "달" : "해"; const raw = b.line.replace(/^반합\([^)]*\): /, ""); const half = b.label.endsWith("(반쯤)");
  return { name: `${b.label}${b.with ? ` · ${b.with} 자리와` : ""}`, plain: (half ? halfHapLine(raw) : raw).replace(/ 해$/, ` ${unit}`).replace(/에 든 해,/, `에 든 ${unit},`) }; });
const signalsOf = (c: Card) => { const s: Readonly<Record<string, string>> = c.signals ?? {}; return { ups: Object.entries(DOMAIN_KO).filter(([k]) => s[k] === "↑").map(([, v]) => v), cautions: Object.entries(DOMAIN_KO).filter(([k]) => s[k] === "↓").map(([, v]) => v) }; };
const monthName = (c: Card) => c.label.split(" (")[0].replace(/ · \d{4}년 .+ 마지막 달$/, "");

/** 세운 달 카드 · 대운 해 카드(같은 문법). */
export function periodCardOf(c: Card, section: BookSection | undefined, a: { eyebrow: string; now: boolean; past: boolean; star: boolean }): Extract<BookPage, { kind: "periodCard" }> {
  const month = c.kind === "month";
  const paragraphs: BookParagraph[] = (section?.paragraphs ?? []).map((text, i) => ({ text, notes: [], ...(section ? keySpanOf(section, i, text) : {}) }));
  const sub = month ? (c.span ? `${md(c.span.start)}~${md(c.span.end)}` : "") : c.age !== undefined ? `만 ${c.age}세` : "";
  const good = month ? (c.good ? { label: "좋은 것", text: c.good } : undefined) : !a.past && c.todo ? { label: "해 볼 것", text: c.todo } : undefined;
  // 지난 때: 책을 쓴 날 기준으로 지난 해·달은 엔진 돌아보기 질문, 읽는 날에 지난 달(책을 쓸 때는 앞날)은 이달의 한 가지를 그대로(흐리게) — 살필 점은 달지 않는다.
  const one = c.review && (a.past || !c.todo) ? { label: "돌아보기", text: c.review } : month && c.todo ? { label: "이달의 한 가지", text: c.todo } : undefined;
  return { kind: "periodCard", unit: month ? "달" : "해", id: `card-${c.key}`, title: month ? monthName(c) : `${c.key}년 ${c.ganji.hangul}년`, eyebrow: a.eyebrow, sub, ganji: c.ganji.hanja, els: elsOf(c.ganji.hanja),
    flow: c.flow.score, flowWord: FLOW_WORD[c.flow.score] ?? "보통", line: c.imageLine, ...(good ? { good } : {}), ...(!a.past && c.caution ? { caution: c.caution } : {}), ...(one ? { one } : {}),
    paragraphs, relations: relationsOf(c), sky: tg(c.tenGod.stem), ground: tg(c.tenGod.branch), past: a.past, now: a.now, star: a.star };
}

const rowOf = (c: Card, a: { name: string; sub: string; now: boolean; past: boolean; star: boolean; divider?: string }): AmRow => ({ key: c.key, name: a.name, sub: a.sub, ganji: c.ganji.hanja, els: elsOf(c.ganji.hanja), line: c.imageLine,
  sky: tg(c.tenGod.stem), ground: tg(c.tenGod.branch), ...signalsOf(c), flow: c.flow.score, flowWord: FLOW_WORD[c.flow.score] ?? "보통", now: a.now, past: a.past, star: a.star, page: 0, ...(a.divider ? { divider: a.divider } : {}) });
const dictOf = (rows: readonly AmRow[]) => [...new Set(rows.flatMap(r => [r.sky, r.ground]))].filter(n => TEN_GOD_EASY[n]).map(name => ({ name, line: TEN_GOD_EASY[name] }));

/** 세운 「YYYY 한 해 흐름표」. naturalElements: 원국 오행(만세력 표의 보이는 수). */
export function flowTableOf(d: V5BookDraft, months: readonly Card[], day: string, natal: readonly { label: string; visible: number }[]): Extract<BookPage, { kind: "flowTable" }> {
  const year = d.annual?.year ?? Number(months[1]?.key.slice(0, 4));
  const yc = (d.timeline?.cards ?? []).find(c => c.kind === "year" && Number(c.key) === year) as Card | undefined;
  const max = Math.max(...months.filter(m => !m.bridge).map(m => m.flow.score));
  const time = (m: Card) => (m.span ? (day >= m.span.end.slice(0, 10) ? "past" : day >= m.span.start.slice(0, 10) ? "now" : "future") : "future");
  const rows = months.map(m => rowOf(m, { name: monthName(m), sub: m.span ? `${md(m.span.start)}~${md(m.span.end)}` : "", now: time(m) === "now", past: time(m) === "past", star: !m.bridge && m.flow.score === max }));
  const head: AmYearHead | null = yc ? { ganji: yc.ganji.hanja, els: elsOf(yc.ganji.hanja), name: `${yc.ganji.hangul}년`, ...(d.annual?.verdict ? { verdict: d.annual.verdict } : {}), sky: tg(yc.tenGod.stem), ground: tg(yc.tenGod.branch),
    skyLine: TEN_GOD_EASY[tg(yc.tenGod.stem)] ?? "", groundLine: TEN_GOD_EASY[tg(yc.tenGod.branch)] ?? "", flow: yc.flow.score, flowWord: FLOW_WORD[yc.flow.score] ?? "보통" } : null;
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
  const first = years[0], last = years.at(-1);
  return { kind: "decadeTable", id: "decade-table", title: "앞으로 10년표", head: first && last ? `지난 3년 · ${thisYear}년 · 앞으로 10년(${Number(first.key)}~${Number(last.key)})` : "", rows, dict: dictOf(rows) };
}

/** 대운 평생 지도: 같은 주제가 이어지는 대운을 한 띠로, 대운수·바뀌는 달은 머리에 한 번. */
export function lifetimeOf(d: V5BookDraft, thisYear: number): Extract<BookPage, { kind: "lifetime" }> {
  const life = d.timeline?.lifetime ?? [];
  const cycles = life.map(c => ({ label: c.label, ages: c.ages, tenGod: tg(c.tenGod), theme: c.theme, current: c.current, ...(c.hanja ? { hanja: c.hanja, els: elsOf(c.hanja) } : {}), past: c.endYear < thisYear }));
  const bands: { theme: string; cycles: number[] }[] = [];
  cycles.forEach((c, i) => { const last = bands.at(-1); if (last && cycles[last.cycles.at(-1)!].theme === c.theme) last.cycles.push(i); else bands.push({ theme: c.theme, cycles: [i] }); });
  const daeunsu = life[0]?.label.match(/대운수 (\d+)/)?.[1], month = life[0]?.label.match(/(\d{1,2}(?:~\d{1,2})?월) 무렵부터/)?.[1];
  const head = [daeunsu ? `대운수 ${daeunsu}(첫 대운이 시작되는 만 나이)` : "", month ? `대운은 10년마다 ${month} 무렵 바뀌어요` : ""].filter(Boolean).join(" · ");
  return { kind: "lifetime", title: "평생 대운 지도", cycles, ...(head ? { head } : {}), bands };
}
