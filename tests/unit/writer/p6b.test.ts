import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildBrief, loadKnowledge } from "@/lib/brief";
import { assembleV5Book } from "@/lib/writer/book";
import { buildWriterPrompt, renderWriterBrief } from "@/lib/writer/prompt";
import { applySafetyNet } from "@/lib/writer/safety";
import { PEOPLE } from "../../../tools/p35/people";

const k = loadKnowledge(join(process.cwd(), "src/data/knowledge-v5"));
const BASE = "2026-11-03";
const book = (product: "major_fortune" | "annual_fortune" | "saju_mbti_full", person = PEOPLE.x) => {
  const brief = buildBrief({ product, baseDate: BASE, person, ...(product === "annual_fortune" ? { selectedYear: 2026 } : {}) }, k);
  const plan = buildWriterPrompt(brief).chapters;
  const { chapters, report } = applySafetyNet(brief, plan, new Map());
  const payload = { productKey: product, person: { ...person, birthTimePrecision: "exact" } } as never;
  return { brief, ...assembleV5Book({ brief, plan, finals: chapters, report, payload, generatedAt: `${BASE}T00:00:00.000Z`, people: [], writer: null, calls: [], tokens: { input: 0, cachedInput: 0, output: 0 }, costUsd: 0, durationMs: 0, briefHash: "", knowledgeVersion: "", promptVersion: "", recovered: false }) };
};

describe("P6b 카드 필드(E-2·E-3·E-4·E-5)", () => {
  const { draft } = book("major_fortune");
  const cards = draft.timeline!.cards;
  it("기간 상태·그림 줄·할 일/돌아보기", () => {
    expect(cards.map(c => c.period)).toEqual([...Array(3).fill("past"), "current", ...Array(10).fill("future")]);
    for (const c of cards) {
      expect(c.imageLine, c.key).toMatch(/ 해$/);
      if (c.period === "past") { expect(c.review, c.key).toMatch(/\?$/); expect(c.todo).toBeUndefined(); }
      else { expect(c.todo, c.key).toBe(c.action.text); expect(c.review).toBeUndefined(); }
    }
  });
  it("살필 점은 원국으로 판정한 문장만(조건문이 남지 않는다)", () => {
    for (const c of cards) if (c.caution) expect(c.caution, c.key).not.toMatch(/있으면|약하면|강하면|강한 사람|약한 사람|있는지 보고/);
  });
  it("나이는 만 나이: 카드 = 그해 − 출생 연도, 대운 구간도 만 나이", () => {
    for (const c of cards) expect(c.age, c.key).toBe(Number(c.key) - 1989);
    for (const cy of draft.timeline!.cycles!) expect(cy.ages).toEqual(cy.years.split("~").map(y => Number(y) - 1989));
  });
  it("세운 달 카드는 해→달, 지난 달은 돌아보기", () => {
    const annual = book("annual_fortune", PEOPLE.c1).draft.timeline!.cards.filter(c => c.kind === "month");
    for (const c of annual) { expect(c.imageLine, c.key).toMatch(/ 달$/); expect(c.caution).toBeNull(); }
    expect(annual.filter(c => c.period === "past").every(c => c.review)).toBe(true);
  });
});

describe("P6b 핵심 이미지·판 정보·작가 입력", () => {
  it("본인(1999-07-31 08:27 남, 甲申·여름·신약·수 없음) → 과제 예시 그대로", () => {
    const me = { name: "장덕민", gender: "MALE" as const, birthDate: "1999-07-31", birthTime: "08:27", birthTimeUnknown: false, mbtiType: "ENTJ" as const, context: { relationshipStatus: "single", jobStatus: "business_owner", detailJob: "사업" } };
    const { draft } = book("saju_mbti_full", me);
    expect(draft.coreImage?.line).toBe("한여름 도시 아스팔트 위에 선 큰 나무");
    expect(draft.edition).toEqual({ number: 5, label: "제5판", revisedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/) });
  });
  it("작가 입력에 그림 별명·이미지·한 줄이 없다(뜻·나에게만)", () => {
    for (const product of ["saju_mbti_full", "major_fortune"] as const) {
      const w = renderWriterBrief(book(product).brief) as { traits: Record<string, unknown>[]; chart: Record<string, unknown> };
      for (const t of w.traits) { expect(t).not.toHaveProperty("easyName"); expect(t).not.toHaveProperty("image"); expect(t).not.toHaveProperty("oneLiner"); expect(t.meaning).toBeTruthy(); expect(t.forYou).toBeTruthy(); }
      expect(typeof w.chart.coreImage).toBe("string");
    }
  });
});
