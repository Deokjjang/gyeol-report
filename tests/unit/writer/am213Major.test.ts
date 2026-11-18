/**
 * AM2-13 3부 시험(호출 0): 대운 「내 인생이라는 책」 결정론 데이터 · 화면 — 고침 + 불변식 한 쌍.
 * 1,000명 전수는 am2.md 23절(무료 검증 도구). 여기서는 시험 인물 4 + 무작위 표본.
 */
import { describe, expect, it, vi } from "vitest";
import { intakeOf, randomPayload } from "../../../tools/annual-major/am2-brief";
import { payloadFor } from "../../../tools/annual-major/am2-6-books";
import { actsOf, CHAPTER_TITLE, decadeSplit, FILL_HELP_LABEL, FILL_LABEL, fillOf, TRANSITION, WINDOW, type MajorPlan } from "@/lib/brief/design/majorBook";
import { luckyOf } from "@/lib/brief/design/annual";
import { chapterHeadOf, domainMapOf, thresholdOf, tocOf } from "@/lib/writer/bookAm";
import type { TenGod } from "@/lib/saju/types";

vi.setConfig({ testTimeout: 120_000 });
const IDS = ["major-1", "major-p5", "major-p6a", "major-p6b"] as const;
const people = [...IDS.map(id => [id, intakeOf(payloadFor(id))] as const), ...Array.from({ length: 24 }, (_, i) => { try { return [`r${i}`, intakeOf(randomPayload(i, "major_fortune", 213))] as const; } catch { return null; } }).filter((x): x is NonNullable<typeof x> => Boolean(x))];
const planOf = (x: (typeof people)[number][1]) => x.brief.timeline?.major as MajorPlan | undefined;

describe("AM2-13 3부 데이터 불변식", () => {
  it.each(people)("%s: 장 제목 = 표 · 겹침 0 · 채움 말 = 넷(+ 부족 없음 채움 말) · 막 = 교운기 · 영역 목록 = 칩 · ★ = 설계도", (_id, x) => {
    const m = planOf(x); if (!m) return;
    expect(m.chapters.every(c => c.title === CHAPTER_TITLE[c.tg])).toBe(true);
    expect(new Set(m.chapters.map(c => c.title)).size).toBe(m.chapters.length);
    for (const c of m.chapters) expect([...Object.values(FILL_LABEL), FILL_HELP_LABEL]).toContain(c.fill.label);
    const win = x.brief.timeline!.entries.filter(e => Number(e.key) >= WINDOW[0] && Number(e.key) <= WINDOW[1]) as (typeof x.brief.timeline.entries[number] & { signals?: Record<string, string> })[];
    const tr = win.find(e => e.dayun?.transition); if (tr) expect(m.turn?.year).toBe(Number(tr.key));
    expect(m.acts.flatMap(a => a.years)).toEqual(Array.from({ length: 10 }, (_, i) => WINDOW[0] + i));
    if (m.turn) for (const a of m.acts) expect(a.years.every(y => (a.n === 1 ? y < m.turn!.year - 1 : a.n === 2 ? y >= m.turn!.year - 1 && y <= m.turn!.year + 1 : y > m.turn!.year + 1))).toBe(true);
    for (const d of ["money", "work", "love", "people", "mind"] as const) expect(m.domains[d].up).toEqual(win.filter(e => e.signals?.[d] === "↑").map(e => Number(e.key)));
    expect([...m.stars]).toEqual(x.brief.timeline!.entries.filter(e => e.keyYear).map(e => Number(e.key)).sort((a, b) => a - b));
    if (m.transition) { expect(TRANSITION[m.transition.from].word.test(m.transition.end)).toBe(true); expect(TRANSITION[m.transition.to].word.test(m.transition.start)).toBe(true); }
  });
  it("전환 표: 서로 다른 십성 쌍 90개 모두 끝 = 지금 뜻 · 시작 = 다음 뜻(옛 D22 「버는 법에서 지키는 법으로」 꼴 0)", () => {
    const tgs = Object.keys(TRANSITION) as TenGod[];
    for (const f of tgs) for (const t of tgs) if (f !== t) { expect(TRANSITION[t].word.test(TRANSITION[f].end)).toBe(false); expect(TRANSITION[f].word.test(TRANSITION[t].start)).toBe(false); }
  });
  it("채움 원천 = 세운 luckyOf(나를 돕는 기운) · 넷째 판정 · 부족 없음 말", () => {
    const st = { excess: ["METAL"], lacking: ["WOOD"], missing: [] } as never;
    expect(fillOf(st, "METAL", "辛卯").kind).toBe("both"); expect(fillOf(st, "METAL", "辛卯").label).toBe(FILL_LABEL.both);
    expect(fillOf(st, "METAL", "癸巳").label).toBe(FILL_LABEL.even); expect(fillOf(st, "METAL", "庚申").label).toBe(FILL_LABEL.excess);
    const none = { excess: ["FIRE"], lacking: [], missing: [] } as never;
    expect(luckyOf(none, "FIRE").element).toBe("EARTH"); expect(fillOf(none, "FIRE", "戊子").label).toBe(FILL_HELP_LABEL);
  });
  it("막 · 5장 나누기: p6b(2028 시작) 1막 없음 · 앞 묶음 4~6해", () => {
    expect(actsOf(2028).map(a => a.n)).toEqual([2, 3]); expect(actsOf(2030).map(a => a.years.length)).toEqual([2, 3, 5]);
    for (const s of [2027, 2028, 2030, 2034, 2036]) { const n = decadeSplit(actsOf(s)); expect(n).toBeGreaterThanOrEqual(4); expect(n).toBeLessThanOrEqual(6); }
  });
});

describe("AM2-13 3부 화면(새 대운 책만)", () => {
  const p6b = planOf(people.find(p => p[0] === "major-p6b")![1])!;
  it("차례: 10장 · 5장 🔖 지금 · 6장 다음 · 장 넘김 줄 = 다음 대운 시작 연월", () => {
    const t = tocOf(p6b); expect(t.toc).toHaveLength(10); expect(t.toc.find(c => c.current)?.n).toBe(5); expect(t.toc.find(c => c.next)?.n).toBe(6);
    expect(t.turn).toContain("2028년 8월 무렵부터");
  });
  it("장 머리 상자 · 맞대기 · 영역 지도: 화면 판정 말 = 계획 판정 말 · 지도 칸 = 영역 목록", () => {
    const now = chapterHeadOf(p6b, "now", "3장")!, next = chapterHeadOf(p6b, "next", "7장")!, th = thresholdOf(p6b, "4장")!, map = domainMapOf(p6b, "6장");
    expect(now.fill.label).toBe(p6b.chapters[4].fill.label); expect(next.fill.label).toBe(p6b.chapters[5].fill.label); expect(next.start).toBe("2028년 8월 무렵부터");
    expect(th.sides.map(s => s.fill.label)).toEqual([now.fill.label, next.fill.label]); expect(th.end).toMatch(/차곡차곡/); expect(th.start).toMatch(/크게 움직/);
    expect(map.rows.find(r => r.domain === "돈")!.cells.filter(c => c === "up")).toHaveLength(p6b.domains.money.up.length);
  });
});

describe("AM2-13 4부 설계도 · 카드 · key 지시", async () => {
  const { chunkPlan, chunkUser, chunkRules, ruleCtxOf, renderCard } = await import("@/lib/writer/chunked/prompt");
  const { MAJOR_PAIR_MAX } = await import("@/lib/writer/chunked/intake");
  it.each(people)("%s: 9장(MBTI 장 없음) · 묶음 6(5장 두 묶음 4~6해) · 짝 ≤ 3(★ 먼저 · 해 key ③에만) · 모든 key에 재료 · 기조에 숫자 · 화살표 0 · ①과 ② 자리 같음", (_id, x) => {
    if (!planOf(x)) return;
    const ix = x.intake, keyed = ix.chapters.find(c => c.keys)!;
    expect(ix.chapters.map(c => c.id)).toEqual(["read", "past", "now", "turn", "decade", "map", "next", "plan", "letter"]);
    const plan = chunkPlan(ix); expect(plan).toHaveLength(6);
    for (const c of plan) for (const p of c.parts) if (p.keys) { expect(p.keys.length).toBeGreaterThanOrEqual(4); expect(p.keys.length).toBeLessThanOrEqual(6); }
    expect(ix.pairs.length).toBeLessThanOrEqual(MAJOR_PAIR_MAX); expect(ix.pairs.every(p => p.key)).toBe(true);
    const stars = new Set((planOf(x)!.stars ?? []).map(String)), paired = ix.pairs.map(p => p.key!);
    { const tgOf = (k: string) => x.brief.timeline!.entries.find(y => y.key === k)!.tenGod.stem.replace(/\(.*$/, ""), usedTg = new Set(paired.map(tgOf));
      // 짝 없는 ★ 해: 같은 하늘 십성이 이미 짝을 받았거나(책에서 한 번), Fusion 줄이 입력 거름에 걸려 없는 해 — 그 밖에 ★ 해를 건너뛰고 다른 해에 짝을 주지 않는다.
      const skipped = [...stars].filter(s2 => keyed.keys!.some(k => k.key === s2) && !paired.includes(s2) && !usedTg.has(tgOf(s2)));
      if (skipped.length && paired.length < MAJOR_PAIR_MAX) expect(paired.every(k => stars.has(k))).toBe(true); }
    for (const k of keyed.keys!) {
      expect(k.own ?? k.pair).toBeTruthy();
      expect(k.tone ?? "").not.toMatch(/[0-9↑↓→]/);
      const ringSeat = /^태어난 (해|달|날|시각) 자리/.exec(k.own ?? "")?.[1];
      if (ringSeat) { const e = x.brief.timeline!.entries.find(y => y.key === k.key)!; const seats = e.badges.filter(b => (k.core ?? []).includes(b.label.replace(/\(반쯤\)$/, " 반합")) || (k.core ?? []).some(n => b.label.startsWith(n.replace(/ 반합$/, "")))).flatMap(b => (b.with ?? "").split("·").map(s => s.replace(/^태어난 /, "")));
        expect(seats).toContain(ringSeat); }
    }
    const text = [renderCard(ix), ...plan.map(c => chunkUser(ix, c))].join("\n");
    expect(text).not.toMatch(/입력 한 마디|앞과 다름|MBTI 성장|성장 곡선/);
    // MBTI 줄은 짝이 든 묶음에만.
    for (const c of plan) { const u = chunkUser(ix, c); if (/- B\d+ \| MBTI/.test(u)) expect(c.parts.some(p => p.keys?.some(k => paired.includes(k)))).toBe(true); }
  });
  it("작가 규칙(대운): 1부 뒤 7,013자 이하 · 차례 · 해 목록은 화면", () => {
    const x = people.find(p => p[0] === "major-p6b")![1]; const r = chunkRules(ruleCtxOf(x.intake));
    expect(r.length).toBeLessThanOrEqual(7013); expect(r).toContain("차례와 영역별 해 목록은 화면 표가 맡으니");
  });
});
