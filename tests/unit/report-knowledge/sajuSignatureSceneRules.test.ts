import { describe, expect, it } from "vitest";

import {
  SAJU_SIGNATURE_SCENE_RULES,
  UNIVERSAL_SCENE_CONTEXT_SEEDS,
  selectSajuSignatureScenes,
} from "../../../src/lib/report-knowledge/sajuSignatureSceneRules";

describe("Saju signature scene rules", () => {
  it("fires matching rules only when required features and MBTI are present", () => {
    const scenes = selectSajuSignatureScenes({
      mbtiType: "ENTJ",
      featureIds: [
        "sinsal_hyeonchim",
        "gwiin_cheoneul",
        "structure_no_resource",
        "gwiin_jaego",
        "ten_god_pian_cai",
        "ten_god_zheng_cai",
        "sinsal_hongyeom",
        "element_fire_missing",
        "structure_no_output",
        "twelve_sinsal_jangseong",
        "ten_god_zheng_guan",
      ],
    });

    expect(scenes.map((scene) => scene.id)).toEqual(
      expect.arrayContaining([
        "hyeonchim_entj_fast_conclusion",
        "cheoneul_no_resource_late_request",
        "jaego_wealth_storage",
        "hongyeom_fire_missing_no_output_expression",
        "jangseong_zheng_guan_role_clarity",
      ]),
    );
    expect(scenes.map((scene) => scene.title).join("\n")).toContain("ENTJ");
    expect(scenes.map((scene) => scene.title).join("\n")).toContain("현침살");
    expect(scenes.map((scene) => scene.title).join("\n")).toContain("천을귀인");
    expect(
      scenes.find((scene) => scene.id === "hyeonchim_entj_fast_conclusion")
        ?.sceneLines?.length,
    ).toBeGreaterThanOrEqual(2);
    expect(
      scenes.find((scene) => scene.id === "cheoneul_no_resource_late_request")
        ?.sceneLines?.length,
    ).toBeGreaterThanOrEqual(2);
    expect(
      scenes.find((scene) => scene.id === "jaego_wealth_storage")?.sceneLines
        ?.length,
    ).toBeGreaterThanOrEqual(2);
    expect(
      scenes
        .find((scene) => scene.id === "hyeonchim_entj_fast_conclusion")
        ?.sceneLines?.join("\n"),
    ).toContain("사람들과 대화");
    expect(
      scenes
        .find((scene) => scene.id === "hyeonchim_entj_fast_conclusion")
        ?.sceneLines?.join("\n"),
    ).toContain("수업이나 팀플");
    expect(
      scenes.find((scene) => scene.id === "jaego_wealth_storage")?.sceneLines?.join("\n"),
    ).toContain("생활비, 투자금, 비상금");
  });

  it("does not fire rules when required features are missing", () => {
    const scenes = selectSajuSignatureScenes({
      mbtiType: "ENTJ",
      featureIds: ["sinsal_hyeonchim", "gwiin_cheoneul", "gwiin_jaego"],
    });

    expect(scenes.map((scene) => scene.id)).toEqual([
      "hyeonchim_entj_fast_conclusion",
    ]);
    expect(scenes.map((scene) => scene.id)).not.toContain(
      "cheoneul_no_resource_late_request",
    );
    expect(scenes.map((scene) => scene.id)).not.toContain("jaego_wealth_storage");
  });

  it("respects the scene cap", () => {
    const scenes = selectSajuSignatureScenes({
      mbtiType: "ENTJ",
      limit: 3,
      featureIds: [
        "sinsal_hyeonchim",
        "day_pillar_gapsin",
        "ten_god_qi_sha",
        "ten_god_zheng_guan",
        "gwiin_jaego",
        "ten_god_pian_cai",
        "ten_god_zheng_cai",
        "gwiin_cheoneul",
        "structure_no_resource",
        "sinsal_hongyeom",
        "element_fire_missing",
        "structure_no_output",
        "sinsal_wonjin",
        "element_water_missing",
        "twelve_sinsal_jangseong",
      ],
    });

    expect(scenes).toHaveLength(3);
  });

  it("keeps signature scenes usable outside corporate meeting contexts", () => {
    const serialized = JSON.stringify({
      seeds: UNIVERSAL_SCENE_CONTEXT_SEEDS,
      rules: SAJU_SIGNATURE_SCENE_RULES,
    });
    const meetingCount = serialized.match(/회의/g)?.length ?? 0;

    expect(serialized).toContain("사람들과 대화");
    expect(serialized).toContain("카톡");
    expect(serialized).toContain("수업");
    expect(serialized).toContain("팀플");
    expect(serialized).toContain("가족");
    expect(serialized).toContain("돈");
    expect(serialized).toContain("잠들기 전");
    expect(meetingCount).toBeLessThanOrEqual(2);
  });

  it("keeps deterministic scene copy free of unsafe claims", () => {
    const serialized = JSON.stringify(SAJU_SIGNATURE_SCENE_RULES);

    expect(serialized).not.toContain("100%");
    expect(serialized).not.toContain("반드시");
    expect(serialized).not.toContain("무조건");
    expect(serialized).not.toContain("운명 확정");
    expect(serialized).not.toContain("미래 확정");
    expect(serialized).not.toContain("수익 보장");
    expect(serialized).not.toContain("치료");
    expect(serialized).not.toContain("진단");
    expect(serialized).not.toContain("죽음");
    expect(serialized).not.toContain("사망");
    expect(serialized).not.toContain("이혼 확정");
    expect(serialized).not.toContain("파산");
  });
});
