import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { FlowRuleSchema } from "../../../src/data/knowledge-v5/schema";
import { PREDICATES, scoreFlow, type FlowInput } from "../../../src/data/knowledge-v5/flow-score";

const ROOT = resolve(import.meta.dirname, "../../..");
const rule = FlowRuleSchema.parse(JSON.parse(readFileSync(resolve(ROOT, "src/data/knowledge-v5/timeline/flow-rule.json"), "utf8")));

const base: FlowInput = {
  kind: "year", incomingElement: "WOOD", lackElements: [], excessElements: [], tenGod: "食神",
  dayMasterStrength: "BALANCED", clashes: [], haps: [], samhapComplete: false, gongmang: false,
};

describe("flow-rule.json × flow-score.ts", () => {
  it("every weight key in the rule has a predicate (설명 가능성)", () => {
    for (const w of rule.weights) expect(PREDICATES[w.key], `unknown key ${w.key}`).toBeTypeOf("function");
  });
  it("quiet year with nothing happening scores the base", () => {
    const r = scoreFlow(rule, base);
    expect(r.score).toBe(rule.base);
    expect(r.applied).toHaveLength(0);
    expect(r.label).toBe(rule.labels[String(rule.base)]);
  });
  it("month entries sit half a step below the same year", () => {
    const y = scoreFlow(rule, base), m = scoreFlow(rule, { ...base, kind: "month" });
    expect(m.raw).toBeLessThan(y.raw);
    expect(m.applied.map(a => a.key)).toEqual(["monthScope"]);
  });
  it("day clash + officer + wealth on weak day master reaches 5 and is clamped", () => {
    const r = scoreFlow(rule, { ...base, tenGod: "偏官", clashes: ["day", "month"], samhapComplete: true });
    expect(r.raw).toBeGreaterThan(5);
    expect(r.score).toBe(5);
    expect(r.applied.map(a => a.key).sort()).toEqual(["clashDay", "clashMonth", "officerIn", "samhap"]);
  });
  it("peer on strong day master in a gongmang month is clamped at 1", () => {
    const r = scoreFlow(rule, { ...base, kind: "month", tenGod: "劫財", dayMasterStrength: "STRONG", gongmang: true, excessElements: ["WOOD"] });
    expect(r.score).toBe(1);
    expect(r.label).toBe("잔잔함");
  });
  it("filling a lacking element raises the score by exactly the rule delta", () => {
    const delta = rule.weights.find(w => w.key === "fillsLack")!.delta;
    const r = scoreFlow(rule, { ...base, lackElements: ["WOOD"] });
    expect(r.raw - rule.base).toBe(delta);
    expect(r.applied[0].when).toContain("부족");
  });
});
