import { describe, expect, it } from "vitest";

import {
  evaluateComprehensiveV1QualityGate,
  summarizeComprehensiveV1QualityGate,
} from "../../../src/lib/report-knowledge/reportQualityGate";

describe("comprehensive v1 quality gate", () => {
  it("passes visible v1 report quality markers", () => {
    const gate = evaluateComprehensiveV1QualityGate(`
      사주×MBTI 종합 리포트 v1.0
      시주 일주 월주 연주 천간 지지
      무(戊) 갑(甲) 신(辛) 기(己)
      element-chip--wood element-chip--fire element-chip--earth element-chip--metal element-chip--water
      사주 한줄 별칭
      이 사주에서 특히 눈에 띄는 기운
      읽기 전에 잡고 갈 핵심 포인트
      사람들과 대화할 때 카톡과 팀플에서 드러나는 장면입니다.
      MBTI는 공식 진단이 아니라 자기보고 성향 언어이며 보조 레이어입니다.
      오늘부터 할 수 있는 3가지
    `);

    expect(gate).toMatchObject({
      hasProductVersion: true,
      hasFourPillarGrid: true,
      hasStemBranchHanja: true,
      hasElementChips: true,
      hasSymbolicNickname: true,
      hasSpotlight: true,
      hasDifferentiationModules: true,
      hasUniversalScenes: true,
      hasMbtiCaution: true,
      hasFinalActions: true,
      noGenericUserLabels: true,
      noInternalArtifacts: true,
      noUnsupportedMbtiRecommendations: true,
    });
    expect(summarizeComprehensiveV1QualityGate(gate)).toBe("13/13");
  });

  it("flags generic user labels internal artifacts and unsupported MBTI lists", () => {
    const gate = evaluateComprehensiveV1QualityGate(
      "사용자님 OpenAI JSON debug ISFP, INFP, INTP 같은 유형이 좋습니다.",
    );

    expect(gate.noGenericUserLabels).toBe(false);
    expect(gate.noInternalArtifacts).toBe(false);
    expect(gate.noUnsupportedMbtiRecommendations).toBe(false);
  });
});
