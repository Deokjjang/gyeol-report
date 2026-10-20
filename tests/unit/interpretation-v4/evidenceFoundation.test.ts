import { describe, expect, it } from "vitest";
import { inspectEvidenceFoundation } from "../../../src/lib/interpretation-v4/evidenceFoundation";
import type { NarrativeBlock, NarrativeSection } from "../../../src/lib/interpretation-v4/narrativeTypes";

const block = (id: string, text: string, feature: string, theme = "precision"): NarrativeBlock => ({
  id, text, tone: "observation", mode: "prose",
  editorial: { variant: "fixture", theme },
  proof: { features: feature ? [feature] : [], seedIds: [], fusionIds: [], sourceRefs: [] },
});
const section = (id: string, blocks: NarrativeBlock[]): NarrativeSection => ({
  id, title: id, domain: "identity", blocks,
});

describe("V4 common evidence foundation diagnostics", () => {
  it("keeps distinct root features and signals a repeated theme with no additional support", () => {
    const a = block("a", "근거에 기초한 첫 설명입니다.", "ten_god_shi_shen");
    const b = block("b", "다른 장에서 다시 같은 이야기를 합니다.", "ten_god_shi_shen");
    const c = block("c", "다른 근거가 추가된 새로운 해석입니다.", "gwiin_cheoneul");
    const result = inspectEvidenceFoundation({ opening: [a], sections: [section("one", [b]), section("two", [c])] });
    expect(result.chapters.map(ch => ch.uniqueFeatures)).toEqual([
      ["ten_god_shi_shen"], ["ten_god_shi_shen"], ["gwiin_cheoneul"],
    ]);
    expect(result.issues).toContainEqual({
      code: "REUSED_THEME_WITHOUT_NEW_SUPPORT", location: "one/b", severity: "review",
    });
    expect(result.issues.some(i => i.location === "two/c")).toBe(false);
  });

  it("detects empty claims, unbound text and duplicate block IDs without mutating a manuscript", () => {
    const manuscript = { opening: [block("x", "", "")], sections: [section("same", [
      block("a", "첫 문장", ""), block("a", "둘째 문장", "ten_god_bijian"),
    ])] };
    const before = JSON.stringify(manuscript);
    const result = inspectEvidenceFoundation(manuscript);
    expect(result.issues.map(i => i.code)).toContain("EMPTY_NARRATIVE");
    expect(result.issues.map(i => i.code)).toContain("MISSING_PROOF");
    expect(result.issues.map(i => i.code)).toContain("DUPLICATE_BLOCK_ID");
    expect(JSON.stringify(manuscript)).toBe(before);
  });

  it("does not treat an intentionally explained and repeated fact as a publication blocker", () => {
    const result = inspectEvidenceFoundation({ opening: [block("a", "첫 문장", "root")],
      sections: [section("later", [block("b", "같은 요소의 다른 상황", "root")])] });
    expect(result.issues.every(issue => issue.severity === "review")).toBe(true);
  });
});
