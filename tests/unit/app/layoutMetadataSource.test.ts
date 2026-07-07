import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const layoutPath = join(process.cwd(), "src/app/layout.tsx");
const layoutSource = readFileSync(layoutPath, "utf8");
const pagePath = join(process.cwd(), "src/app/page.tsx");
const pageSource = readFileSync(pagePath, "utf8");

describe("app layout metadata source", () => {
  it("exports metadata", () => {
    expect(layoutSource).toContain("export const metadata");
    expect(layoutSource).toContain("Metadata");
  });

  it("includes metadata base", () => {
    expect(layoutSource).toContain("metadataBase");
    expect(layoutSource).toContain("https://gyeolreport.com");
  });

  it("includes title defaults", () => {
    expect(layoutSource).toContain('default: "결리포트"');
    expect(layoutSource).toContain('template: "%s | 결리포트"');
  });

  it("includes description", () => {
    expect(layoutSource).toContain(
      "사주 구조와 MBTI 자기인식을 함께 살펴보는 자기이해 리포트.",
    );
  });

  it("includes application name and keywords", () => {
    const expectedValues = [
      "applicationName",
      "keywords",
      "결리포트",
      "사주",
      "MBTI",
      "자기이해",
      "명리학",
      "성향 분석",
    ];

    for (const value of expectedValues) {
      expect(layoutSource).toContain(value);
    }
  });

  it("includes open graph and twitter metadata", () => {
    const expectedValues = [
      "openGraph",
      "siteName",
      "ko_KR",
      "twitter",
      "summary",
    ];

    for (const value of expectedValues) {
      expect(layoutSource).toContain(value);
    }
  });

  it("does not include out-of-scope SEO markers", () => {
    const markers = ["sitemap", "robots", "analytics", "gtag", "pixel"];
    const lowerSource = layoutSource.toLowerCase();

    for (const marker of markers) {
      expect(lowerSource).not.toContain(marker);
    }
  });

  it("renders landing page product grid entry point", () => {
    expect(pageSource).toContain("ProductGrid");
    expect(pageSource).toContain("GYEOL_HOME_PRODUCT_GRID");
  });

  it("renders landing page product review summary", () => {
    const expectedValues = [
      "GYEOL_HOME_PRODUCT_GRID",
      "ProductGrid",
      "사주×MBTI 종합 리포트",
      "입력한 생년월일과 MBTI를 바탕으로 명리 구조와 행동 패턴",
      "상담이 아닌 참고용 리포트",
    ];

    for (const value of expectedValues) {
      expect(pageSource).toContain(value);
    }
  });

  it("renders landing page product positioning", () => {
    expect(pageSource).toContain("사주×MBTI 종합 리포트");
    expect(pageSource).toContain("결제 후 온라인 열람");
    expect(pageSource).toContain("자동 생성 디지털 리포트");
    expect(pageSource).toContain("결리포트");
  });

  it("renders landing page report value content", () => {
    const expectedValues = [
      "ProductGrid",
      "GYEOL_HOME_PRODUCT_GRID",
      "사주×MBTI 종합 리포트",
      "1,290원",
      "90일간 열람",
    ];

    for (const value of expectedValues) {
      expect(pageSource).toContain(value);
    }
  });

  it("renders landing page trust and support placeholders", () => {
    const expectedValues = [
      "상담이 아닌 참고용 리포트",
      "결제 후 온라인 열람",
    ];

    for (const value of expectedValues) {
      expect(pageSource).toContain(value);
    }
  });

  it("links to supported legal policy routes only", () => {
    expect(pageSource).not.toContain('href="/legal/terms"');
    expect(pageSource).not.toContain('href="/legal/privacy"');
    expect(pageSource).not.toContain('href="/legal/refund"');
    expect(pageSource).not.toContain('href="/terms"');
    expect(pageSource).not.toContain('href="/privacy"');
  });

  it("does not include payment implementation markers", () => {
    const markers = [
      "create" + "Payment",
      "confirm" + "Payment",
      "Toss" + "Payments",
      "Pad" + "dle",
      "process" + ".env",
      "fetch" + "(",
    ];

    for (const marker of markers) {
      expect(pageSource).not.toContain(marker);
    }
  });

  it("does not include unsafe exact wording", () => {
    const forbiddenWords = [
      ["무", "조건"].join(""),
      ["반", "드시"].join(""),
      ["운", "명"].join(""),
      ["죽", "음"].join(""),
      ["사고가 ", "난다"].join(""),
      ["바람기가 ", "있다"].join(""),
      ["돈복이 ", "있다"].join(""),
      ["결혼", "한다"].join(""),
      ["망", "한다"].join(""),
      ["절", "대"].join(""),
      ["항", "상"].join(""),
    ];

    for (const word of forbiddenWords) {
      expect(layoutSource).not.toContain(word);
    }
  });

  it("is deterministic when read repeatedly", () => {
    const again = readFileSync(layoutPath, "utf8");

    expect(again).toBe(layoutSource);
  });
});
