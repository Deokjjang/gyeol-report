import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  buildLoveMarriageChildReportEvidence,
  LOVE_MARRIAGE_CHILD_DEFAULT_SAFETY_NOTES,
  LOVE_MARRIAGE_CHILD_EVIDENCE_FORBIDDEN_EXPRESSIONS,
  type BuildLoveMarriageChildReportEvidenceInput,
} from "../../../src/lib/report-knowledge/loveMarriageChildReportEvidence";

const baseInput = {
  name: "덕민",
  gender: "male",
  mbtiType: "ENTJ",
  relationshipStatus: "single",
  saju: {
    dayPillar: "甲申",
    labels: [
      "편재",
      "정재",
      "정관",
      "편관",
      "식신",
      "상관",
      "정인",
      "비견",
      "현침살",
      "홍염살",
      "도화살",
      "화개살",
      "천을귀인",
      "월덕귀인",
      "천덕귀인",
      "甲己합",
      "申亥해",
    ],
  },
} as const satisfies BuildLoveMarriageChildReportEvidenceInput;

describe("love marriage child report evidence", () => {
  it("builds the product identity, person context, and day-pillar basis", () => {
    const evidence = buildLoveMarriageChildReportEvidence(baseInput);

    expect(evidence.productType).toBe("love_marriage_child");
    expect(evidence.productVersion).toBe("v1");
    expect(evidence.personContext).toMatchObject({
      name: "덕민",
      gender: "male",
      mbtiType: "ENTJ",
      relationshipStatus: "single",
    });
    expect(evidence.sajuBasis.dayMaster).toBe("甲");
    expect(evidence.sajuBasis.dayBranch).toBe("申");
    expect(evidence.sajuBasis.spousePalaceSignal).toMatchObject({
      label: "일지/배우자궁",
      dayBranch: "申",
    });
  });

  it("maps ten gods, attraction, conflict, support, and interaction signals", () => {
    const evidence = buildLoveMarriageChildReportEvidence(baseInput);
    const allTenGodLabels = [
      ...evidence.sajuBasis.loveTenGodSignals,
      ...evidence.sajuBasis.marriageTenGodSignals,
      ...evidence.sajuBasis.parentingTenGodSignals,
    ].map((signal) => signal.tenGod);

    expect(allTenGodLabels).toEqual(
      expect.arrayContaining(["편재", "정재", "정관", "편관", "식신", "상관"]),
    );
    expect(evidence.sajuBasis.attractionSignals.map((signal) => signal.label)).toEqual(
      expect.arrayContaining(["도화", "홍염"]),
    );
    expect(evidence.sajuBasis.conflictSignals.map((signal) => signal.label)).toEqual(
      expect.arrayContaining(["현침", "화개"]),
    );
    expect(evidence.sajuBasis.supportSignals.map((signal) => signal.label)).toContain(
      "귀인",
    );
    expect(
      evidence.sajuBasis.relationInteractionSignals.map((signal) => signal.label),
    ).toEqual(expect.arrayContaining(["甲己합", "申亥해"]));
  });

  it("connects known MBTI source traits and love-marriage-child bridge evidence", () => {
    const evidence = buildLoveMarriageChildReportEvidence(baseInput);

    expect(evidence.mbtiBasis.reportUseCases.length).toBeGreaterThan(0);
    expect(evidence.mbtiBasis.loveTraits.length).toBeGreaterThan(0);
    expect(evidence.mbtiBasis.marriageTraits.length).toBeGreaterThan(0);
    expect(evidence.mbtiBasis.parentingTraits.length).toBeGreaterThan(0);
    expect(evidence.mbtiBasis.childRoleTraits.length).toBeGreaterThan(0);
    expect(evidence.bridgeEvidence?.productKey).toBe("loveMarriageChild");
    expect(evidence.bridgeEvidence?.forbiddenAngles).toEqual(
      expect.arrayContaining(["무조건 헤어짐", "반드시 결혼"]),
    );
  });

  it("keeps unknown MBTI as a neutral fallback without throwing", () => {
    expect(() =>
      buildLoveMarriageChildReportEvidence({
        ...baseInput,
        mbtiType: "UNKNOWN",
      }),
    ).not.toThrow();

    const evidence = buildLoveMarriageChildReportEvidence({
      ...baseInput,
      mbtiType: "UNKNOWN",
    });

    expect(evidence.mbtiBasis.reportUseCases).toEqual([]);
    expect(evidence.mbtiBasis.loveTraits).toEqual([]);
    expect(evidence.mbtiBasis.marriageTraits).toEqual([]);
    expect(evidence.mbtiBasis.parentingTraits).toEqual([]);
    expect(evidence.bridgeEvidence?.productKey).toBe("loveMarriageChild");
    expect(evidence.bridgeEvidence?.primaryEvidence).toEqual([]);
  });

  it("includes relationship safety notes and forbidden policy constants", () => {
    const evidence = buildLoveMarriageChildReportEvidence(baseInput);
    const safetyText = evidence.safetyNotes.join("\n");

    expect(evidence.safetyNotes).toEqual([
      ...LOVE_MARRIAGE_CHILD_DEFAULT_SAFETY_NOTES,
    ]);
    expect(safetyText).toContain("확정 결혼, 이별, 이혼");
    expect(safetyText).toContain("배우자복이나 자식복");
    expect(safetyText).toContain("임신, 출산, 건강");
    expect(safetyText).toContain("내 반복 패턴");
    expect(safetyText).toContain("내가 부모가 되었을 때");
    expect(LOVE_MARRIAGE_CHILD_EVIDENCE_FORBIDDEN_EXPRESSIONS).toEqual(
      expect.arrayContaining([
        "무조건 헤어짐",
        "반드시 결혼",
        "배우자복 없다",
        "자식복 없다",
        "임신/출산/건강 진단",
      ]),
    );
  });

  it("avoids unsafe child and breakup naming in the evidence source", () => {
    const source = [
      readFileSync(
        join(
          process.cwd(),
          "src/lib/report-knowledge/loveMarriageChildReportEvidence.ts",
        ),
        "utf8",
      ),
      readFileSync(
        join(
          process.cwd(),
          "src/lib/report-knowledge/loveMarriageChildReportTypes.ts",
        ),
        "utf8",
      ),
    ].join("\n");

    for (const forbiddenName of [
      "childFortune",
      "childDestiny",
      "childAnalysis",
      "reunionProbability",
      "willBreakup",
    ]) {
      expect(source).not.toContain(forbiddenName);
    }
  });
});
