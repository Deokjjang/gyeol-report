import { describe, expect, it } from "vitest";
import { localDevAuthAllowed } from "@/lib/account/localDevAccount";
import { writerV5Products } from "@/lib/writer/flags";

describe("로컬 개발 전용 로그인·기능 플래그(P3)", () => {
  it("next dev + 로컬 Supabase일 때만 로컬 로그인 허용", () => {
    expect(localDevAuthAllowed({ NODE_ENV: "development", NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321" })).toBe(true);
    expect(localDevAuthAllowed({ NODE_ENV: "production", NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321" })).toBe(false);
    expect(localDevAuthAllowed({ NODE_ENV: "development", NEXT_PUBLIC_SUPABASE_URL: "https://abc.supabase.co" })).toBe(false);
    expect(localDevAuthAllowed({ NODE_ENV: "development" })).toBe(false);
  });
  it("AM2-14 5부: v5 작가 상품은 코드 상수 6상품(env를 읽지 않는다)", () => {
    expect(writerV5Products()).toEqual(["saju_mbti_full", "career_money_study", "love_marriage_child", "saju_mbti_compatibility", "major_fortune", "annual_fortune"]);
  });
});
