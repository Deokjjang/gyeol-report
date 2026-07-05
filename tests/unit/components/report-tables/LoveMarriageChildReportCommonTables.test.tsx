import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import LoveMarriageChildReportCommonTables, {
  LoveMarriageChildReportManseRyeokTable,
  LoveMarriageChildReportMbtiProfileTable,
} from "../../../../src/components/report-tables/LoveMarriageChildReportCommonTables";
import {
  buildLoveMarriageChildReportEvidence,
  type BuildLoveMarriageChildReportEvidenceInput,
} from "../../../../src/lib/report-knowledge/loveMarriageChildReportEvidence";

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
      "현침살",
      "홍염살",
      "도화살",
      "화개살",
      "천을귀인",
      "월덕귀인",
      "甲己합",
      "申亥해",
    ],
  },
} as const satisfies BuildLoveMarriageChildReportEvidenceInput;

function buildFixtureEvidence(
  input: BuildLoveMarriageChildReportEvidenceInput = baseInput,
) {
  return buildLoveMarriageChildReportEvidence(input);
}

describe("LoveMarriageChildReportCommonTables", () => {
  it("renders love manse ryeok and compact MBTI common tables from evidence", () => {
    const html = renderToStaticMarkup(
      <LoveMarriageChildReportCommonTables evidence={buildFixtureEvidence()} />,
    );

    expect(html).toContain("덕민님의 만세력");
    expect(html).toContain("시주");
    expect(html).toContain("일주");
    expect(html).toContain("甲");
    expect(html).toContain("申");
    expect(html).toContain("신살/귀인");
    expect(html).toContain("도화");
    expect(html).toContain("홍염");
    expect(html).toContain("현침");
    expect(html).toContain("귀인");
    expect(html).toContain("합충형파해");
    expect(html).toContain("甲己합");
    expect(html).toContain("ENTJ 대담한 통솔자");
    expect(html).toContain("가까운 키워드");
    expect(html).toContain("먼 키워드");
    expect(html).toContain("선호 지표와 기능 서열 자세히 보기");
    expect(html).not.toContain("선호 지표 비교");
    expect(html).not.toContain("리포트 활용 포인트");
    expect(html).not.toContain("love 섹션");
    expect(html).not.toContain("marriage 섹션");
    expect(html).not.toContain("careerReportUseCases");
  });

  it("renders each slot wrapper separately", () => {
    const evidence = buildFixtureEvidence();
    const manseHtml = renderToStaticMarkup(
      <LoveMarriageChildReportManseRyeokTable evidence={evidence} />,
    );
    const mbtiHtml = renderToStaticMarkup(
      <LoveMarriageChildReportMbtiProfileTable evidence={evidence} />,
    );

    expect(manseHtml).toContain("덕민님의 만세력");
    expect(mbtiHtml).toContain("ENTJ 대담한 통솔자");
  });

  it("renders no MBTI slot when evidence has no known MBTI type", () => {
    const html = renderToStaticMarkup(
      <LoveMarriageChildReportMbtiProfileTable
        evidence={buildFixtureEvidence({
          ...baseInput,
          mbtiType: "UNKNOWN",
        })}
      />,
    );

    expect(html).toBe("");
  });
});
