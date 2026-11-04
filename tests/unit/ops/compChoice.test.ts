// v5 최종 2-3: 보상 이용권 A 2장·B 1장(기본 꺼짐), 장마다 내가 쓰기/선물 링크 — 안내 문구도 그 뜻으로.
import { describe, expect, it } from "vitest";
import { compConfig, compSyncArgs } from "@/lib/ops/config";
import { COMP_COPY, compNoticeText } from "@/lib/ops/compMessages";

describe("보상 이용권 설정", () => {
  it("기본: 꺼짐, A 2장(60일)·B 1장(30일), 4종 상품", () => {
    const cfg = compConfig({});
    expect(cfg).toMatchObject({ enabled: false, aQty: 2, aDays: 60, bQty: 1, bDays: 30, products: ["saju_mbti_full", "career_money_study", "love_marriage_child", "saju_mbti_compatibility"] });
    expect(compConfig({ COMP_ENABLED: "1" }).enabled).toBe(true);
    expect(compConfig({ COMP_ENABLED: "true" }).enabled).toBe(false);
    expect(compSyncArgs(cfg)).toEqual({ enabled: false, aQty: 2, aDays: 60, bQty: 1, bDays: 30, products: cfg.products });
    expect(compSyncArgs(cfg, true).enabled).toBe(true);
    // 예전 본인용·선물 전용 나눔 값은 더 이상 쓰지 않는다.
    expect(compSyncArgs(compConfig({ COMP_A_SELF_QTY: "1", COMP_A_GIFT_QTY: "1" }))).not.toHaveProperty("aSelf");
  });
});

describe("보상 안내 문구", () => {
  it("장마다 내가 쓰거나 선물할 수 있다는 뜻, 자리표시자는 남지 않는다", () => {
    const a = compNoticeText("A", "granted", { quantity: 2, until: "12월 31일까지" });
    expect(a).toContain("이용권 2장을 넣어 드렸어요");
    expect(a).toContain("한 장씩 내가 쓰거나 선물 링크로 친구에게 보낼 수 있어요");
    expect(a).toContain("12월 31일까지 쓸 수 있어요");
    expect(compNoticeText("B", "granted", { quantity: 1, until: "12월 31일까지" })).toContain("업그레이드 이용권 1장을 넣어 드렸어요. 내가 쓰거나 선물 링크로 친구에게 보낼 수 있어요.");
    for (const tier of ["A", "B"] as const) for (const state of ["granted", "waiting_profile"] as const) {
      const text = compNoticeText(tier, state, { quantity: tier === "A" ? 2 : 1 });
      expect(text).not.toMatch(/[{}]|선물 링크 \d장|내 책|본인용|  /u);
      expect(text).toMatch(/내가 쓰거나/u);
    }
    expect(JSON.stringify(COMP_COPY)).not.toContain("{구성}");
  });
});
