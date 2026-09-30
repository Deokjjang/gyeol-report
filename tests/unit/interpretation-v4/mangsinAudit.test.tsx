import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { calculateSaju } from "../../../src/lib/saju/calculateSaju";
import { SHINSAL_RULES } from "../../../src/lib/saju/shinsalConstants";
import { EARTHLY_BRANCHES } from "../../../src/lib/saju/constants";
import { buildCanonicalNatalTable } from "../../../src/lib/report-knowledge/natalTableEvidence";
import { buildCanonicalManseRyeokTableData } from "../../../src/lib/report-tables/manseRyeokTableData";
import ManseRyeokCommonTable from "../../../src/components/report-tables/ManseRyeokCommonTable";
import { buildFusionCore } from "../../../src/lib/interpretation-v4/fusion";

describe("Phase 2 mangsin unresolved source/customer impact audit", () => {
  it("characterizes all 12 same-anchor conflicting lookup entries without choosing a winner", () => {
    const a = SHINSAL_RULES.find(r => r.code === "MANGSINSAL")!.source;
    const b = SHINSAL_RULES.find(r => r.code === "TWELVE_MANGSINSAL")!.source;
    expect(a.kind).toBe("YEAR_BRANCH_TO_BRANCH");
    expect(b.kind).toBe("BRANCH_GROUP_TO_BRANCH");
    if (a.kind !== "YEAR_BRANCH_TO_BRANCH" || b.kind !== "BRANCH_GROUP_TO_BRANCH") return;
    expect(b.reference).toBe("YEAR_BRANCH");
    for (const branch of EARTHLY_BRANCHES) expect(a.table[branch]).not.toEqual(b.table[branch]);
  });
  it("legacy customer table still shows mangsin; only the new V4 evidence is quarantined", () => {
    const c = calculateSaju({ birthDate: "1984-11-18", birthTime: "09:30", birthTimeUnknown: false, calendarType: "SOLAR", gender: "MALE", timezone: "Asia/Seoul" });
    const original = JSON.stringify(c);
    const a = c.shinsal.filter(s => s.code === "MANGSINSAL"), b = c.shinsal.filter(s => s.code === "TWELVE_MANGSINSAL");
    expect(a.length).toBeGreaterThan(0); expect(b.length).toBeGreaterThan(0);
    expect(a.map(s => s.positions)).not.toEqual(b.map(s => s.positions));
    const table = buildCanonicalNatalTable(c.birthTimeContext!);
    const data = buildCanonicalManseRyeokTableData({ natalTableEvidence: { person: table } })!;
    const html = renderToStaticMarkup(createElement(ManseRyeokCommonTable, { data }));
    expect(html).toContain("망신");
    const v4 = buildFusionCore({ calculation: c, mbti: "ENTJ" });
    expect(v4.decisions.some(d => d.evidence.feature === "twelve_sinsal_mangsin" && d.status === "ambiguous/conflicted")).toBe(true);
    expect(v4.fusions.some(f => f.myeongliEvidence.some(d => d.evidence.feature.includes("mangsin")))).toBe(false);
    expect(JSON.stringify(c)).toBe(original);
    expect(renderToStaticMarkup(createElement(ManseRyeokCommonTable, { data }))).toBe(html);
  });
});
