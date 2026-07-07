import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const scriptSource = readFileSync(
  join(process.cwd(), "scripts/e2e_launch_product_flows.ts"),
  "utf8",
);

describe("launch product browser E2E source", () => {
  it("covers all six product input URLs", () => {
    const requiredMarkers = [
      "/report/new?product=saju-mbti-full",
      "/report/new?product=career-money-study",
      "/report/new?product=love-marriage-child",
      "/report/new?product=major-fortune",
      "/report/new?product=annual-fortune",
      "/report/new?product=compatibility",
      "saju-mbti-full",
      "career-money-study",
      "love-marriage-child",
      "major-fortune",
      "annual-fortune",
      "compatibility",
    ];

    for (const marker of requiredMarkers) {
      expect(scriptSource).toContain(marker);
    }
  });

  it("performs real browser form interactions", () => {
    const requiredMarkers = [
      "Chrome DevTools Protocol",
      "Runtime.evaluate",
      "Page.navigate",
      "fillSinglePersonProductForm",
      "fillCompatibilityProductForm",
      "setInputValue",
      "setSelectValue",
      "clickButtonByText",
      "#singleProductName",
      "#singleProductBirthDate",
      "#singleProductBirthTime",
      "#singleProductMbtiType",
      "#singleProductJobStatus",
      "#singleProductDetailedJob",
      "#selectedYear",
      "#personAName",
      "#personABirthDate",
      "#personBName",
      "#personBBirthDate",
      "#relationshipType",
    ];

    for (const marker of requiredMarkers) {
      expect(scriptSource).toContain(marker);
    }
  });

  it("checks report redirect and result page markers", () => {
    const requiredMarkers = [
      'const reportPathPrefix = "/reports/"',
      "waitForLocationPath(client, reportPathPrefix)",
      "/reports/ redirect check",
      "종합 리포트",
      "직업·커리어·돈·학업 리포트",
      "연애·결혼·자녀 리포트",
      "대운 리포트",
      "세운 리포트",
      "궁합 리포트",
      "오행 분포",
      "만세력",
      "월운",
      "세운",
      "두 사람 기초표",
      "관계 카테고리",
      "리포트를 찾을 수 없습니다",
      "상품 미리보기 준비 중입니다",
    ];

    for (const marker of requiredMarkers) {
      expect(scriptSource).toContain(marker);
    }
  });

  it("checks shared result URL and reentry CTA", () => {
    const requiredMarkers = [
      "const ctaText = \"나도 내 리포트 보기\"",
      "const secondaryCtaText = \"내 사주×MBTI 리포트 만들기\"",
      "const resultUrl = await getLocationHref(client)",
      "await navigate(client, resultUrl)",
      "sharedResultText",
      "clickLinkByText(client, ctaText)",
      'await waitForLocationPath(client, "/report/new")',
      "내 사주×MBTI 리포트 만들기",
    ];

    for (const marker of requiredMarkers) {
      expect(scriptSource).toContain(marker);
    }
  });

  it("keeps away from paid, Supabase, and external writer imports", () => {
    const forbiddenMarkers = [
      "src/lib/payment",
      "lib/payment",
      "src/lib/supabase",
      "lib/supabase",
      "confirmTossPayment",
      "SUPABASE",
      "OPENAI_API_KEY",
      "new OpenAI",
    ];

    for (const marker of forbiddenMarkers) {
      expect(scriptSource).not.toContain(marker);
    }
  });

  it("marks failures with process exit code", () => {
    expect(scriptSource).toContain("process.exitCode = 1");
    expect(scriptSource).toContain("PASS product=");
    expect(scriptSource).toContain("FAIL product=");
    expect(scriptSource).toContain("browser E2E launch product flows complete");
  });
});
