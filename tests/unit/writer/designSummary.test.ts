// W3 P3: 절 설계 카드 → 정보량 지표 카드·설계 카드 검수 요약(호출 0).
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { buildBrief, loadKnowledge, type BriefPersonInput } from "@/lib/brief";
import { designSummaryOf, infoCardsOf } from "@/lib/writer/design";
import { designCardIds } from "@/lib/writer/review";
import { infoMetrics } from "@/lib/writer/safety/info";

const ROOT = join(__dirname, "../../..");
const k = loadKnowledge(join(ROOT, "src/data/knowledge-v5"));
const evalIn = JSON.parse(readFileSync(join(ROOT, "docs/eval/inputs.json"), "utf8"));
const person = (key: string, ctx: string): BriefPersonInput => {
  const p = evalIn.persons[key], c = evalIn.contexts[ctx];
  return { ...p, context: { relationshipStatus: c.relationshipStatus, jobStatus: c.jobStatus, detailJob: c.detailJob } };
};

describe("설계 카드 → 지표·검수 요약", () => {
  const brief = buildBrief({ product: "saju_mbti_full", person: person("haram", "c1"), baseDate: "2026-10-27" }, k);
  const cards = infoCardsOf(brief);
  const summary = designSummaryOf(brief);
  it("4종 브리프는 절마다 카드 하나, 장 번호는 작가 입력 n(1부터)·절은 0부터", () => {
    const sections = brief.chapters.reduce((a, c) => a + (c.sections ?? []).filter(s => s.card).length, 0);
    expect(cards).toHaveLength(sections);
    expect(cards[0]).toMatchObject({ chapter: 1, section: 0 });
    expect(cards.every(c => c.evidence.every(e => e.name.length > 0))).toBe(true);
  });
  it("요약은 한 줄 = 한 절, 검수가 읽는 id(card:장.절)가 카드 수만큼", () => {
    expect(summary.split("\n")).toHaveLength(cards.length);
    expect(designCardIds(summary)).toHaveLength(cards.length);
    expect(summary).toMatch(/^card:1\.0 \| 근거: /);
    expect(summary).not.toMatch(/신강|신약|중화|과다/);
  });
  it("지표는 카드를 받으면 카드 근거로 센다(이름이 본문에 나오면 근거 사용 1)", () => {
    const e = cards[0].evidence[0];
    const m = infoMetrics([{ n: 1, sections: [{ heading: "h", paragraphs: [`${e.name} 이야기를 합니다.`] }] }], { cards });
    expect(m.cards).toBe(true);
    expect(m.totals.evidenceUsed).toBeGreaterThanOrEqual(1);
    expect(m.totals.evidenceZero).toBe(0);
  });
  it("카드 없는 브리프(세운)는 빈 값", () => {
    const am = buildBrief({ product: "annual_fortune", person: person("haram", "c1"), baseDate: "2026-10-27" }, k);
    expect(infoCardsOf(am)).toEqual([]);
    expect(designSummaryOf(am)).toBe("");
  });
});
