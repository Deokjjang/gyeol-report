import { describe, expect, it } from "vitest";

import {
  buildOpenAILoveMarriageChildReportWriterMessages,
} from "../../../src/lib/report-generation/openaiLoveMarriageChildReportWriterPrompt";
import {
  buildLoveMarriageChildReportEvidence,
} from "../../../src/lib/report-knowledge/loveMarriageChildReportEvidence";

function buildMessages() {
  const evidencePacket = buildLoveMarriageChildReportEvidence({
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
        "현침살",
        "화개살",
        "천을귀인",
        "甲己합",
      ],
    },
  });

  return buildOpenAILoveMarriageChildReportWriterMessages({ evidencePacket });
}

describe("openaiLoveMarriageChildReportWriterPrompt", () => {
  it("keeps the love marriage child product policy explicit", () => {
    const messages = buildMessages();

    expect(messages.system).toContain("love_marriage_child_report_draft");
    expect(messages.developer).toContain("연애·결혼·자녀 리포트");
    expect(messages.developer).toContain("명리는 근거");
    expect(messages.developer).toContain("MBTI는 행동 방식과 표현 방식의 보조 evidence");
    expect(messages.developer).toContain("명리와 MBTI를 같은 것으로 단정하지 않는다");
    expect(messages.developer).toContain("연애, 결혼, 자녀를 예언하지 않는다");
  });

  it("includes parentMode safety policy", () => {
    const messages = buildMessages();

    expect(messages.developer).toContain("parentMode safety policy");
    expect(messages.developer).toContain("내가 부모가 되었을 때의 역할 방식");
    expect(messages.developer).toContain("실제 자녀의 성향, 운명, 건강");
    expect(messages.developer).toContain("childFortune");
    expect(messages.developer).toContain("childDestiny");
    expect(messages.developer).toContain("childAnalysis");
    expect(messages.developer).toContain("자식복");
  });

  it("includes breakup and reunion safety policy", () => {
    const messages = buildMessages();

    expect(messages.developer).toContain("breakupReunionPattern safety policy");
    expect(messages.developer).toContain("내 반복 패턴, 감정 처리, 회복 습관");
    expect(messages.developer).toContain("상대가 돌아오는지");
    expect(messages.developer).toContain("재회 확률");
    expect(messages.developer).toContain("willBreakup");
    expect(messages.developer).toContain("reunionProbability");
    expect(messages.developer).toContain("반드시 재회");
  });

  it("defines evidence usage for Myeongli, MBTI, and bridgeEvidence", () => {
    const messages = buildMessages();

    expect(messages.developer).toContain("sajuBasis.dayPillar");
    expect(messages.developer).toContain("재성, 관성, 식상, 인성, 비겁");
    expect(messages.developer).toContain("도화·홍염");
    expect(messages.developer).toContain("현침");
    expect(messages.developer).toContain("화개");
    expect(messages.developer).toContain("귀인");
    expect(messages.developer).toContain("합충형파해");
    expect(messages.developer).toContain("mbtiBasis love/marriage/parenting/childRole");
    expect(messages.developer).toContain("bridgeEvidence");
    expect(messages.developer).toContain("bridgeEvidence.forbiddenAngles");
  });

  it("forbids deterministic relationship and family claims", () => {
    const messages = buildMessages();

    for (const forbidden of [
      "무조건 헤어짐",
      "반드시 결혼",
      "결혼 못한다",
      "이혼한다",
      "배우자복 없다",
      "자식복 없다",
      "임신",
      "출산 확정",
      "건강 진단",
      "재회 확률",
      "상대가 돌아온다",
    ]) {
      expect(messages.developer).toContain(forbidden);
    }
  });

  it("embeds the evidence packet without calling writer API", () => {
    const messages = buildMessages();

    expect(messages.user).toContain("Evidence packet:");
    expect(messages.user).toContain('"productType": "love_marriage_child"');
    expect(messages.user).toContain('"productKey": "loveMarriageChild"');
    expect(messages.user).toContain('"mbtiType": "ENTJ"');
    expect(messages.user).toContain('"sajuBasis"');
  });

  it("keeps dense paragraph structure guidance and avoids weak romance app tone", () => {
    const messages = buildMessages();

    expect(messages.developer).toContain("문단 중심으로 쓴다");
    expect(messages.developer).toContain("작은 카드처럼 과도하게 쪼개지 않는다");
    expect(messages.developer).toContain("가능성이 있습니다");
    expect(messages.developer).toContain("그럴 수 있습니다");
    expect(messages.developer).toContain("연애 조언 앱처럼 가볍게 쓰지 않는다");
    expect(messages.developer).toContain("배우자, 자녀, 재회 운명론을 쓰지 않는다");
  });
});
