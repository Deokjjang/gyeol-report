import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { MBTI_TYPES } from "@/data/knowledge-v5/schema";
import { buildBrief, loadKnowledge } from "@/lib/brief";
import { LETTER_FUNCTION_CAP, MBTI_LINK_DENSITY } from "@/lib/brief/traits";

const k = loadKnowledge(join(process.cwd(), "src/data/knowledge-v5"));

describe("브리프 MBTI 연결 규칙(P3)", () => {
  // 생일 12개 × 유형 16개를 돌려 가며 고른 48건(결정론).
  const cases = Array.from({ length: 48 }, (_, i) => ({
    birthDate: `${1970 + (i * 7) % 40}-${String(1 + (i * 5) % 12).padStart(2, "0")}-${String(1 + (i * 11) % 28).padStart(2, "0")}`,
    mbtiType: MBTI_TYPES[(i * 3) % 16],
    product: (["saju_mbti_full", "love_marriage_child", "career_money_study"] as const)[i % 3],
  }));

  it.each(cases)("$birthDate $mbtiType $product: 70% 이상 연결, 핵심 특성 정확 유형, 같은 글자·기능 ≤ 2", ({ birthDate, mbtiType, product }) => {
    const b = buildBrief({ product, baseDate: "2026-10-27", person: { name: "시험", gender: "FEMALE", birthDate, birthTime: "10:00", birthTimeUnknown: false, mbtiType } }, k);
    const linked = b.traits.filter(t => t.fusion);
    expect(linked.length / b.traits.length).toBeGreaterThanOrEqual(MBTI_LINK_DENSITY);
    const core = b.traits.find(t => t.family === "dayPillar" || t.family === "dayMaster");
    expect(core?.fusion?.target).toBe(mbtiType);
    const counts = new Map<string, number>();
    for (const t of linked) if (!/^[EI][NS][TF][JP]$/.test(t.fusion!.target)) counts.set(t.fusion!.target, (counts.get(t.fusion!.target) ?? 0) + 1);
    for (const n of counts.values()) expect(n).toBeLessThanOrEqual(LETTER_FUNCTION_CAP);
  }, 30_000);

  it("MBTI가 없으면 연결을 만들지 않는다(날조 금지)", () => {
    const b = buildBrief({ product: "saju_mbti_full", baseDate: "2026-10-27", person: { name: "시험", gender: "MALE", birthDate: "1978-07-15", birthTime: "22:10", birthTimeUnknown: false, mbtiType: "" } }, k);
    expect(b.traits.some(t => t.fusion)).toBe(false);
  });
});
