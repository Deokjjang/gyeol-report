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
  it("WRITER_V5_PRODUCTS: 기본 비어 있음, 모르는 키는 버린다", () => {
    expect(writerV5Products({})).toEqual([]);
    expect(writerV5Products({ WRITER_V5_PRODUCTS: " saju_mbti_full, nope ,annual_fortune,saju_mbti_full" })).toEqual(["saju_mbti_full", "annual_fortune"]);
  });
});
