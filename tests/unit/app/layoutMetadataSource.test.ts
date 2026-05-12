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

  it("renders landing page primary CTA", () => {
    expect(pageSource).toContain('href="/report/new"');
    expect(pageSource).toContain("샘플 리포트 생성하기");
  });

  it("renders landing page no-payment preview guard", () => {
    const expectedValues = [
      "결제 없는 미리보기",
      "현재는 실제 결제 없이 리포트 미리보기만 제공합니다.",
      "정식 결제 및 전체 리포트 잠금 해제는 추후 제공 예정입니다.",
    ];

    for (const value of expectedValues) {
      expect(pageSource).toContain(value);
    }
  });

  it("renders landing page product positioning", () => {
    expect(pageSource).toContain("사주와 MBTI");
    expect(pageSource).toContain("자기이해");
    expect(pageSource).toContain("사주와 MBTI를 함께 보며 자기이해를 돕는 리포트");
  });

  it("renders landing page report value content", () => {
    const expectedValues = [
      "일주",
      "오행",
      "십성",
      "신살",
      "MBTI",
      "겹침과 차이",
      "활용",
    ];

    for (const value of expectedValues) {
      expect(pageSource).toContain(value);
    }
  });

  it("renders landing page trust and support placeholders", () => {
    const expectedValues = [
      "안내",
      "official@dvem.ai",
      "이용약관",
      "개인정보 처리방침",
      "정식 출시 전 공개 예정",
    ];

    for (const value of expectedValues) {
      expect(pageSource).toContain(value);
    }
  });

  it("does not link to unsupported policy routes", () => {
    expect(pageSource).toContain("mailto:official@dvem.ai");
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
