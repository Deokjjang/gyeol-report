import { describe, expect, it } from "vitest";
import { buildBrief, loadKnowledge } from "@/lib/brief";
import { customerProps, lifeStage, PROPS } from "@/lib/brief/props";
import { MAX_PROP_USES } from "@/lib/brief/chapters";
import { filterParagraph, type Deletion, type Replacement } from "@/lib/writer/safety/sentences";
import { isPastAssertion, SICK_DEATH_IMAGE, softenExperience } from "@/lib/writer/safety/patterns";
import { glossaryWarnings, TERMS } from "@/lib/writer/safety/terms";
import { PEOPLE } from "../../../tools/p35/people";

const k = loadKnowledge();
const base = "2026-10-29";
const facts = { birthTimeKnown: true, mbti: "ENTJ", relationship: "single", children: "none", job: "employed" } as const;

describe("P3.6 원고 남은 문제", () => {
  it("A1: 직업군 소품 12개 이상, 책 전체에서 같은 소품은 2회까지(usedProps)", () => {
    expect(Math.min(...PROPS.jobs.map(j => j.props.length))).toBeGreaterThanOrEqual(12);
    for (const product of ["saju_mbti_full", "career_money_study", "love_marriage_child"] as const) {
      const brief = buildBrief({ product, person: PEOPLE.c1, baseDate: base }, k);
      const hinted = brief.chapters.flatMap(c => c.sceneHint ?? []);
      const counts = hinted.reduce<Record<string, number>>((a, x) => ({ ...a, [x]: (a[x] ?? 0) + 1 }), {});
      expect(Math.max(...Object.values(counts)), product).toBeLessThanOrEqual(MAX_PROP_USES);
      expect(brief.usedProps).toEqual(counts);
    }
  });

  it("A2: 생활 단계는 나이 × 직업 상태 × 자녀로 고른다(29세 회사원에게 학생 소품 없음)", () => {
    const none = { children: "unknown" } as const;
    expect(lifeStage({ jobStatus: "employee", age: 29 }, none)).toBe("early_career");
    expect(lifeStage({ jobStatus: "employee", age: 37 }, none)).toBe("mid_career");
    expect(lifeStage({ jobStatus: "student", age: 22 }, none)).toBe("student");
    expect(lifeStage({ jobStatus: "freelancer", age: 37 }, none)).toBe("self_employed");
    expect(lifeStage({ jobStatus: "employee", age: 41 }, { children: "has" })).toBe("parenting");
    expect(lifeStage({ jobStatus: "", age: 66 }, none)).toBe("retired");
    const c1 = customerProps({ detailJob: "서비스 기획자", jobStatus: "employee", age: 29 }, { relationship: "single", children: "unknown", job: "employed" });
    expect(c1.stage.key).toBe("early_career");
    expect(c1.stage.props.join(" ")).not.toMatch(/학자금|알바|수강|과제|교복/);
  });

  it("A3: 용어 사전 전체를 경고 범위로, 일상어(일주일·도화지)는 잡지 않는다", () => {
    for (const t of ["축미충", "식신", "도화살", "일간", "십이운성"]) expect(TERMS.some(x => x.term === t), t).toBe(true);
    expect(glossaryWarnings(1, ["식신이 강한 사람은 손이 빠릅니다."], new Set())).toEqual([{ chapter: 1, kind: "term_first", text: "식신" }]);
    expect(glossaryWarnings(1, ["손맛 요리사 같은 힘(식신)이 있습니다. 식신이 또 나옵니다."], new Set())).toEqual([]);
    expect(glossaryWarnings(1, ["일주일 내내 도화지에 그림을 그립니다."], new Set())).toEqual([]);
  });

  it("A4: 합충 자리 문장은 실제로 맞물린 자리만(X 丑未충은 날–시각·달–시각, 달–날 아님)", () => {
    const brief = buildBrief({ product: "saju_mbti_full", person: PEOPLE.x, baseDate: base }, k);
    const chung = brief.traits.find(t => t.featureId === "relation:CHUNG");
    expect(chung?.where).toBe("태어난 달과 시각 사이, 태어난 날과 시각 사이");
    expect(chung?.where).not.toContain("달과 날");
    const shadow = brief.shadows.find(s => s.traitId === chung?.id);
    if (shadow) expect(shadow.basis).not.toMatch(/태어난 달·태어난 날/);
  });

  it("A5: 질병·죽음 이미지 금지어, 무덤덤·상여금·김장독은 허용", () => {
    for (const w of ["병상에서", "장례식", "무덤 앞", "시체", "링거"]) expect(SICK_DEATH_IMAGE.test(w), w).toBe(true);
    for (const w of ["무덤덤한 얼굴", "추석 상여금", "땅속 김장독"]) expect(SICK_DEATH_IMAGE.test(w), w).toBe(false);
    expect(k.features.get("twelveStage:病")?.easyName).toBe("처마 밑 쉼표");
  });

  it("A6: 경험 단정 잔여는 경향형·질문형으로 바꾸고, 못 바꾸면 지운다(메타 기록)", () => {
    expect(softenExperience("회의를 정리하는 요령이 늘어난 것도 그래서입니다.")).toBe("회의를 정리하는 요령이 잘 붙는 것도 그래서입니다.");
    expect(softenExperience("친구 고민을 밤새 들어 본 사람입니다.")).toBe("친구 고민을 밤새 들어 보는 사람입니다.");
    expect(softenExperience("마감 직전에 몰아서 해 본 적이 있을 거예요.")).toBe("마감 직전에 몰아서 해 본 적 있지 않나요?");
    expect(isPastAssertion("아무도 안 해 본 일을 맡으면 눈이 반짝입니다.")).toBe(false);
    const deletions: Deletion[] = [], replacements: Replacement[] = [];
    const out = filterParagraph("팀 일정을 챙기는 요령이 늘어난 것도 그래서입니다. 어릴 때부터 혼자 다 챙겨 왔습니다. 오늘도 메모를 합니다.", facts, 2, deletions, undefined, undefined, false, replacements);
    expect(out).toBe("팀 일정을 챙기는 요령이 잘 붙는 것도 그래서입니다. 오늘도 메모를 합니다.");
    expect(replacements).toHaveLength(1);
    expect(deletions.map(d => d.rule)).toEqual(["experience_assert"]);
  });
});
