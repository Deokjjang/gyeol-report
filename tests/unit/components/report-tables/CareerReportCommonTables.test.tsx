import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import CareerReportCommonTables, {
  CareerReportManseRyeokTable,
  CareerReportMbtiProfileTable,
} from "../../../../src/components/report-tables/CareerReportCommonTables";
import {
  buildCareerReportEvidence,
} from "../../../../src/lib/report-knowledge/careerReportEvidence";
import {
  requireCareerReportFixture,
} from "../../../../src/lib/report-knowledge/careerReportFixtures";

function buildFixtureEvidence(fixtureId = "deokmin-career") {
  const fixture = requireCareerReportFixture(fixtureId);

  return buildCareerReportEvidence({
    fixtureId: fixture.id,
    person: fixture.person,
  });
}

describe("CareerReportCommonTables", () => {
  it("renders career manse ryeok and MBTI common tables from evidence", () => {
    const html = renderToStaticMarkup(
      <CareerReportCommonTables evidence={buildFixtureEvidence()} />,
    );

    expect(html).toContain("덕민님의 만세력");
    expect(html).toContain("시주");
    expect(html).toContain("일주");
    expect(html).toContain("甲");
    expect(html).toContain("申");
    expect(html).toContain("ENTJ 대담한 통솔자");
    expect(html).toContain("선호 지표 비교");
    expect(html).toContain("기능 서열");
    expect(html).toContain("직업 활용");
    expect(html).toContain("돈 관리");
    expect(html).not.toContain("career 섹션");
    expect(html).not.toContain("workplace 문장");
    expect(html).not.toContain("money 섹션");
    expect(html).not.toContain("investment 섹션");
    expect(html).not.toContain("study 섹션");
  });

  it("renders each slot wrapper separately", () => {
    const evidence = buildFixtureEvidence();
    const manseHtml = renderToStaticMarkup(
      <CareerReportManseRyeokTable evidence={evidence} />,
    );
    const mbtiHtml = renderToStaticMarkup(
      <CareerReportMbtiProfileTable evidence={evidence} />,
    );

    expect(manseHtml).toContain("덕민님의 만세력");
    expect(mbtiHtml).toContain("ENTJ 대담한 통솔자");
  });

  it("renders no MBTI slot when evidence has no known MBTI type", () => {
    const html = renderToStaticMarkup(
      <CareerReportMbtiProfileTable
        evidence={{
          ...buildFixtureEvidence(),
          mbtiType: null,
        }}
      />,
    );

    expect(html).toBe("");
  });
});
