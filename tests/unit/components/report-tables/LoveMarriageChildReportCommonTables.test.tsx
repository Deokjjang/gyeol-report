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

const fullPillarInput = {
  ...baseInput,
  saju: {
    ...baseInput.saju,
    fullPillars: [
      {
        key: "year",
        pillar: "己卯",
        stem: "己",
        branch: "卯",
        stemTenGod: "정재",
        branchTenGod: "겁재",
        hiddenStems: ["乙 겁재"],
        twelveLifeStage: ["제왕"],
        twelveSinsal: ["장성살"],
        sinsal: ["현침살"],
        gwiin: [],
        interactions: ["연일 천간합 甲己"],
      },
      {
        key: "month",
        pillar: "辛未",
        stem: "辛",
        branch: "未",
        stemTenGod: "정관",
        branchTenGod: "정재",
        hiddenStems: ["己 정재", "丁 상관", "乙 겁재"],
        twelveLifeStage: ["묘"],
        twelveSinsal: ["화개살"],
        sinsal: ["화개"],
        gwiin: ["천을귀인"],
        interactions: [],
      },
      {
        key: "day",
        pillar: "甲申",
        stem: "甲",
        branch: "申",
        stemTenGod: "비견",
        branchTenGod: "편관",
        hiddenStems: ["庚 편관", "壬 편인", "戊 편재"],
        twelveLifeStage: ["절"],
        twelveSinsal: ["겁살"],
        sinsal: ["망신살"],
        gwiin: ["월덕귀인", "천덕귀인"],
        interactions: ["연일 천간합 甲己", "申亥해"],
      },
      {
        key: "hour",
        pillar: "戊辰",
        stem: "戊",
        branch: "辰",
        stemTenGod: "편재",
        branchTenGod: null,
        hiddenStems: ["戊 편재", "乙 겁재", "癸 정인"],
        twelveLifeStage: ["쇠"],
        twelveSinsal: ["반안살"],
        sinsal: ["백호대살"],
        gwiin: [],
        interactions: [],
      },
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
    expect(html).toContain("일주·일지 신호를 우선");
    expect(html).toContain("시주");
    expect(html).toContain("일주");
    expect(html).toContain("甲");
    expect(html).toContain("申");
    expect(html).not.toContain("신살/귀인");
    expect(html).not.toContain("도화");
    expect(html).not.toContain("홍염");
    expect(html).not.toContain("합충형파해");
    expect(html).not.toContain("申亥해");
    expect(html).toContain("ENTJ 대담한 통솔자");
    expect(html).toContain("관계");
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

  it("renders full four-pillar manse ryeok details without the day-pillar note", () => {
    const html = renderToStaticMarkup(
      <LoveMarriageChildReportManseRyeokTable
        evidence={buildFixtureEvidence(fullPillarInput)}
      />,
    );

    expect(html).toContain("戊");
    expect(html).toContain("辰");
    expect(html).toContain("辛");
    expect(html).toContain("未");
    expect(html).toContain("己");
    expect(html).toContain("卯");
    expect(html).toContain("丁 상관");
    expect(html).toContain("겁살");
    expect(html).toContain("망신살");
    expect(html).toContain("월덕귀인");
    expect(html).toContain("천덕귀인");
    expect(html).toContain("연일 천간합 甲己");
    expect(html).not.toContain("申亥해");
    expect(html).not.toContain("일주·일지 신호를 우선");
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
