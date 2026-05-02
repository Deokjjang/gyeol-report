import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const layoutPath = join(process.cwd(), "src/app/layout.tsx");
const layoutSource = readFileSync(layoutPath, "utf8");

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
