import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { MajorFortuneReportView } from "../../../src/app/reports/[reportId]/MajorFortuneReportView";
import { generateMajorFortuneProductDraft } from "../../../src/lib/report-generation/majorFortuneGenerationHandler";
import { validateProductPublication } from "../../../src/lib/report-generation/productPublishGate";
import type { SinglePersonGenerationInput } from "../../../src/lib/report-generation/reportInputAdapter";

const customers = [
  { name: "고객A", birthDate: "1996-12-06", birthTime: "14:15", gender: "MALE", mbtiType: "ENTJ", expectedCycle: "壬寅" },
  { name: "고객B", birthDate: "1980-05-15", birthTime: "09:30", gender: "FEMALE", mbtiType: "ISFJ", expectedCycle: "丙子" },
  { name: "고객C", birthDate: "2001-08-20", birthTime: "16:20", gender: "MALE", mbtiType: "ENFP", expectedCycle: "癸巳" },
] as const;

function inputFor(customer: (typeof customers)[number]): SinglePersonGenerationInput {
  return {
    kind: "majorFortune",
    productKey: "major_fortune",
    productSlug: "major-fortune",
    person: {
      name: customer.name,
      birthDate: customer.birthDate,
      birthTime: customer.birthTime,
      birthTimeUnknown: false,
      approximateBirthTimeSlot: "",
      gender: customer.gender,
      mbtiType: customer.mbtiType,
      calendarType: "solar",
      timezone: "Asia/Seoul",
    },
    userContext: {
      relationshipStatus: "single",
      jobStatus: "employee",
      detailJob: "서비스 기획자",
      focusAreas: ["직업", "돈"],
    },
    productOptions: {},
  };
}

function collectStrings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value !== null && typeof value === "object") {
    return Object.values(value).flatMap(collectStrings);
  }
  return [];
}

function longSentences(value: unknown): string[] {
  return collectStrings(value)
    .flatMap((text) => text.split(/(?<=[.!?。！？])\s+|\n+/u))
    .map((sentence) =>
      sentence
        .replace(/[“”"']/gu, "")
        .replace(/\s+/gu, " ")
        .replace(/[.!?。！？]+$/u, "")
        .trim(),
    )
    .filter((sentence) => sentence.length >= 40);
}

function normalizedSentence(value: string): string {
  return value
    .replace(/(?:19|20)\d{2}년?/gu, "YEAR")
    .replace(/고객[ABC](?:님)?/gu, "PERSON")
    .replace(/\d+번째/gu, "N번째");
}

function duplicateCount(values: readonly string[]): number {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.values()].reduce(
    (total, count) => total + Math.max(0, count - 1),
    0,
  );
}

function renderedText(draft: unknown, evidencePacket: unknown): string {
  return renderToStaticMarkup(
    createElement(MajorFortuneReportView, {
      draft,
      evidencePacket,
    } as Parameters<typeof MajorFortuneReportView>[0]),
  )
    .replace(/<[^>]+>/gu, " ")
    .replace(/&[^;]+;/gu, " ")
    .replace(/\s+/gu, " ");
}

describe("major fortune repetition quality", () => {
  const fetchSpy = vi.fn(() => {
    throw new Error("external calls are forbidden in repetition quality tests");
  });

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-21T03:00:00.000Z"));
    vi.stubGlobal("fetch", fetchSpy);
    fetchSpy.mockClear();
  });

  afterEach(() => {
    expect(fetchSpy).not.toHaveBeenCalled();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("publishes and renders three customer-specific fallbacks without artificial filler", async () => {
    const drafts: string[] = [];
    const sentenceSets: Set<string>[] = [];

    for (const customer of customers) {
      const result = await generateMajorFortuneProductDraft(inputFor(customer), {
        now: () => new Date("2026-09-21T03:00:00.000Z"),
      });
      expect(result.ok, JSON.stringify(result)).toBe(true);
      if (!result.ok) continue;

      expect(result.evidencePacket.currentMajorFortune.ganji).toBe(customer.expectedCycle);
      expect(
        validateProductPublication(
          "major_fortune",
          result.draft,
          result.evidencePacket,
        ),
      ).toEqual({ ok: true, errors: [] });

      const serialized = JSON.stringify(result.draft);
      const draftSentences = longSentences(result.draft);
      const htmlText = renderedText(result.draft, result.evidencePacket);
      const htmlSentences = longSentences(htmlText);

      expect(serialized).not.toMatch(/반복\s*압박\s*\d+번째|\d+번째\s*점검/u);
      expect(htmlText).not.toMatch(/반복\s*압박\s*\d+번째|\d+번째\s*점검/u);
      expect(serialized).not.toContain("반복 압박");
      expect(htmlText).not.toContain("반복 압박");
      expect(collectStrings(result.draft).join("").length).toBeGreaterThan(19_000);
      expect(duplicateCount(draftSentences)).toBeLessThanOrEqual(45);
      expect(duplicateCount(draftSentences.map(normalizedSentence))).toBeLessThanOrEqual(45);
      expect(duplicateCount(htmlSentences)).toBeLessThanOrEqual(10);
      expect(duplicateCount(htmlSentences.map(normalizedSentence))).toBeLessThanOrEqual(10);
      expect(new Set(result.draft.finalAdvice.map((item) => item.body)).size).toBe(6);
      expect(
        new Set(
          result.draft.majorFortuneTimelineRows.map(
            (row) =>
              (row.yearDetail as { readonly actionStandard: string }).actionStandard,
          ),
        ).size,
      ).toBe(10);
      expect(
        result.draft.majorFortuneTimelineRows.every(
          (row) => {
            const coreFlow = (
              row.yearDetail as { readonly coreFlow: string }
            ).coreFlow;
            return (
              coreFlow.includes(row.annualGanji) &&
              coreFlow.includes(row.annualTenGodLabel)
            );
          },
        ),
      ).toBe(true);

      drafts.push(serialized);
      sentenceSets.push(new Set(draftSentences));
    }

    expect(new Set(drafts).size).toBe(3);
    const sharedAcrossAll = [...(sentenceSets[0] ?? [])].filter(
      (sentence) => sentenceSets[1]?.has(sentence) && sentenceSets[2]?.has(sentence),
    );
    expect(sharedAcrossAll.length).toBeLessThanOrEqual(80);
  });

  it("keeps numbered replacement copy out of production generation and rendering sources", () => {
    for (const file of [
      "src/lib/report-generation/majorFortuneGenerationHandler.ts",
      "src/lib/report-knowledge/majorFortuneEvidence.ts",
      "src/app/reports/[reportId]/MajorFortuneReportView.tsx",
      "src/app/dev/major-fortune-preview/page.tsx",
    ]) {
      const source = readFileSync(file, "utf8");
      expect(source).not.toMatch(/반복\s*압박\s*\$\{|번째\s*점검/gu);
      expect(source).not.toContain("반복 압박");
      expect(source).not.toContain("repeatedMajorSentenceAlternatives");
    }
  });
});
