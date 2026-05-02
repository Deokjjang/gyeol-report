import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const pagePath = join(process.cwd(), "src/app/report/new/page.tsx");
const pageSource = readFileSync(pagePath, "utf8");

describe("new report page source", () => {
  it("is a client component", () => {
    expect(pageSource).toContain('"use client";');
  });

  it("has required form field names", () => {
    const fieldNames = [
      'name="birthDate"',
      'name="birthTimeUnknown"',
      'name="birthTime"',
      'name="gender"',
      'name="mbtiType"',
      'name="calendarType"',
      'name="timezone"',
    ];

    for (const fieldName of fieldNames) {
      expect(pageSource).toContain(fieldName);
    }
  });

  it("has required hidden values", () => {
    expect(pageSource).toContain('value="SOLAR"');
    expect(pageSource).toContain('value="Asia/Seoul"');
  });

  it("calls create report API", () => {
    expect(pageSource).toContain('fetch("/api/reports/create"');
  });

  it("renders error and preview text", () => {
    expect(pageSource).toContain("입력값을 확인해 주세요.");
    expect(pageSource).toContain("무료 미리보기 생성");
    expect(pageSource).toContain("생성 중...");
    expect(pageSource).toContain("report.titleKo");
    expect(pageSource).toContain("report.subtitleKo");
    expect(pageSource).toContain("report.notices");
  });

  it("supports report block source types", () => {
    expect(pageSource).toContain("type ReportBlock");
    expect(pageSource).toContain("keyValues");
    expect(pageSource).toContain("itemsKo");
    expect(pageSource).toContain("bodyKo");
  });

  it("has a report block render helper", () => {
    expect(pageSource).toContain("function renderReportBlock");
    expect(pageSource).toContain('block.kind === "KEY_VALUE"');
    expect(pageSource).toContain('block.kind === "BULLET_LIST"');
    expect(pageSource).toContain('block.kind === "WARNING"');
    expect(pageSource).toContain('block.kind === "HIGHLIGHT"');
  });

  it("renders all report sections", () => {
    expect(pageSource).toContain("report.sections.map");
    expect(pageSource).toContain("renderReportBlock");
    expect(pageSource).not.toContain("slice(0, 5)");
  });

  it("renders section level pills", () => {
    expect(pageSource).toContain("FREE_PREVIEW");
    expect(pageSource).toContain("무료 미리보기");
    expect(pageSource).toContain("전체 리포트");
  });

  it("renders development gate notice", () => {
    const normalizedSource = pageSource.replace(/\s+/g, " ");

    expect(normalizedSource).toContain(
      "결제 게이트는 아직 연결되지 않았습니다. 현재는 개발용 미리보기로 전체 구조를 확인합니다.",
    );
  });

  it("does not include persistence auth payment or LLM markers", () => {
    const markers = [
      "supabase",
      "payment",
      "paddle",
      "login",
      "auth",
      "openai",
      "llm",
      "localStorage",
      "sessionStorage",
      "router.push",
    ];
    const lowerSource = pageSource.toLowerCase();

    for (const marker of markers) {
      expect(lowerSource).not.toContain(marker.toLowerCase());
    }
  });

  it("does not include unsafe exact wording", () => {
    const forbiddenWords = [
      "무" + "조건",
      "반" + "드시",
      "운" + "명",
      "죽" + "음",
      "사고가 " + "난다",
      "바람기가 " + "있다",
      "돈복이 " + "있다",
      "결혼" + "한다",
      "망" + "한다",
      "절" + "대",
      "항" + "상",
    ];

    for (const word of forbiddenWords) {
      expect(pageSource).not.toContain(word);
    }
  });

  it("is deterministic when read repeatedly", () => {
    const again = readFileSync(pagePath, "utf8");

    expect(again).toBe(pageSource);
  });
});
