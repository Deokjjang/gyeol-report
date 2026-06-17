import { describe, expect, it } from "vitest";

import {
  createBranchRef,
  detectCrossBranchRelations,
  getCrossTenGodRelation,
  getDayMasterElementRelation,
  type CompatibilityBranchRef,
} from "../../../src/lib/report-knowledge/compatibilityRelationRules";

describe("REPORT-18F compatibility relation rules", () => {
  it("detects day-master element relation for 갑목 and 정화", () => {
    const relation = getDayMasterElementRelation("甲", "丁");

    expect(relation?.relation).toBe("generates");
    expect(relation?.relationLabel).toBe("갑목 -> 정화");
    expect(relation?.summary).toContain("갑목이 정화를 살리는 구조");
  });

  it("uses the existing ten-god calculation for cross ten-god relation", () => {
    const deokminToSodam = getCrossTenGodRelation({
      viewerDayStem: "甲",
      targetDayStem: "丁",
    });
    const sodamToDeokmin = getCrossTenGodRelation({
      viewerDayStem: "丁",
      targetDayStem: "甲",
    });

    expect(deokminToSodam?.tenGodKo).toBe("상관");
    expect(sodamToDeokmin?.tenGodKo).toBe("정인");
  });

  it("detects cross-person trine, clash, and harm relations", () => {
    const personARefs = [
      createBranchRef({
        person: "personA",
        personLabel: "덕민",
        position: "year",
        pillar: "己卯",
      }),
      createBranchRef({
        person: "personA",
        personLabel: "덕민",
        position: "month",
        pillar: "辛未",
      }),
      createBranchRef({
        person: "personA",
        personLabel: "덕민",
        position: "day",
        pillar: "甲申",
      }),
      createBranchRef({
        person: "personA",
        personLabel: "덕민",
        position: "hour",
        pillar: "戊辰",
      }),
    ].filter((ref): ref is CompatibilityBranchRef => ref !== undefined);
    const personBRefs = [
      createBranchRef({
        person: "personB",
        personLabel: "소담",
        position: "year",
        pillar: "丙子",
      }),
      createBranchRef({
        person: "personB",
        personLabel: "소담",
        position: "month",
        pillar: "己亥",
      }),
      createBranchRef({
        person: "personB",
        personLabel: "소담",
        position: "day",
        pillar: "丁丑",
      }),
      createBranchRef({
        person: "personB",
        personLabel: "소담",
        position: "hour",
        pillar: "丁未",
      }),
    ].filter((ref): ref is CompatibilityBranchRef => ref !== undefined);

    const relations = detectCrossBranchRelations({ personARefs, personBRefs });
    const labels = relations.map((relation) => relation.relationLabel);

    expect(labels).toEqual(expect.arrayContaining([
      "亥卯未 삼합 목 흐름",
      "申子辰 삼합 수 흐름",
      "丑未 충",
      "申亥 해",
      "子未 해",
    ]));
    expect(relations.every((relation) => relation.refs.length >= 2)).toBe(true);
    expect(
      relations.every(
        (relation) => new Set(relation.refs.map((ref) => ref.person)).size > 1,
      ),
    ).toBe(true);
  });
});
