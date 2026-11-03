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

import { sceneTextFits, sceneCtxOf } from "@/lib/brief/facts";
import { filterParagraph, sentenceViolation, type SafetyFacts } from "@/lib/writer/safety/sentences";
import { tidyHeading, tidyText } from "@/lib/writer/safety/patterns";
import { intensityViolations } from "@/lib/writer/safety";

describe("P6b 안전망(E-6·E-8·E-9·E-11·B-2·B-5·B-6)", () => {
  const f: SafetyFacts = { birthTimeKnown: true, mbti: "ENTJ", relationship: "single", children: "unknown", job: "employed", nicknames: ["말 안장", "손맛 요리사"] };
  it.each([
    ["겨울 외양간 등불처럼 버티는 사람이에요.", "rural_prop"],
    ["말 안장 같은 기운이 당신을 앉혀 둡니다.", "nickname"],
    ["엄마가 반찬을 챙겨 주면 그제야 쉽니다.", "family_member"],
    ["당신은 '끝까지 붙듦' 쪽에 가까워요.", "internal_label"],
    ["사교 에너지·규칙·끈기가 모두 높게 나옵니다.", "internal_label"],
    ["이 배지는 올해의 흐름을 보여 줍니다.", "internal_label"],
    ["연애 성향은 제시되지 않습니다.", "internal_label"],
  ])("%s → %s", (s, rule) => expect(sentenceViolation(s, f)).toBe(rule));
  it("형(刑)·평화로운·초가을은 금지어가 아니다", () => {
    for (const s of ["충이나 형과 함께 걸리면 더 잘 보입니다.", "평화로운 주말을 보내요.", "초가을 바람이 불면 걷고 싶어져요."]) expect(sentenceViolation(s, f)).toBeNull();
  });
  it("지운 문장 뒤의 지시어 문장은 지우고, 연결어는 뗀다(E-8)", () => {
    const del: never[] = [];
    expect(filterParagraph("엄마가 반찬을 챙겨 줍니다. 이것이 당신의 쉼이에요. 주말엔 쉬세요.", f, 1, del)).toBe("주말엔 쉬세요.");
    expect(filterParagraph("엄마가 반찬을 챙겨 줍니다. 그래서 주말엔 쉬세요.", f, 1, [])).toBe("주말엔 쉬세요.");
  });
  it("표기 정리(E-9)·금지 문형(C-3)", () => {
    expect(tidyText("일주는 정축·정축(丁丑)이에요. **핵심**은 정축(정축)입니다.")).toBe("일주는 정축(丁丑)이에요. 핵심은 정축입니다.");
    expect(tidyText("퇴근길에 메모 앱을 여는 장면이에요.")).toBe("퇴근길에 메모 앱을 여는 식이에요.");
    expect(tidyHeading("앞에서 본 식신, 일에서는")).toBe("식신, 일에서는");
  });
  it("세기 주장은 엔진 흐름 점수와 같아야 한다(E-11)", () => {
    const { brief } = book("annual_fortune", PEOPLE.c1);
    const months = brief.timeline!.entries.filter(e => e.kind === "month");
    const max = Math.max(...months.map(m => m.flow.score));
    const notTop = months.find(m => m.flow.score < max)!, top = months.find(m => m.flow.score === max)!;
    expect(intensityViolations(brief, notTop.key, "올해 가장 거센 달이에요.")).toHaveLength(1);
    expect(intensityViolations(brief, top.key, "올해 가장 거센 달이에요.")).toHaveLength(0);
  });
  it("장면 필터(B-6): 간호사에 기획서·시제품 없음, 29세 직장인에 성적표 없음, 대학생에 매점 없음, 입력에 없는 가족 없음", () => {
    const nurse = { relationship: "married", children: "unknown", job: "employed", scene: sceneCtxOf({ jobGroupId: "nurse", job: "employed", age: 37 }) } as const;
    const worker = { relationship: "single", children: "unknown", job: "employed", scene: sceneCtxOf({ jobGroupId: "pm-planner", job: "employed", age: 29 }) } as const;
    const college = { relationship: "single", children: "unknown", job: "student", scene: sceneCtxOf({ jobGroupId: "college-student", job: "student", age: 22 }) } as const;
    expect(sceneTextFits("기획서 마감 전날 시제품을 다시 돌려 봅니다.", nurse)).toBe(false);
    expect(sceneTextFits("성적표를 받으면 틀린 문제부터 봅니다.", worker)).toBe(false);
    expect(sceneTextFits("기획서 첫 장을 세 번 고칩니다.", worker)).toBe(true);
    expect(sceneTextFits("매점 앞에서 친구를 기다립니다.", college)).toBe(false);
    expect(sceneTextFits("시험 범위를 표로 정리합니다.", college)).toBe(true);
    expect(sceneTextFits("엄마가 보낸 반찬 사진에 답장합니다.", worker)).toBe(false);
  });
  it("고객 책의 브리프 장면에도 위 규칙이 적용된다(간호사 X 종합)", () => {
    const { brief } = book("saju_mbti_full");
    const scenes = JSON.stringify(brief.chapters.flatMap(c => c.materials)).match(/"scene":"[^"]+"/g) ?? [];
    for (const s of scenes) expect(/기획서|시제품|성적표|매점|엄마|아빠|어머니|아버지/.test(s), s).toBe(false);
  });
});
