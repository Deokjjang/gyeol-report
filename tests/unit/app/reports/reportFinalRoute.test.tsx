import { renderToStaticMarkup } from "react-dom/server";
import { expect, it, vi } from "vitest";
import ReportResultPage from "../../../../src/app/reports/[reportId]/page";
import { createReportPersistenceRuntime } from "../../../../src/lib/persistence/reportPersistenceRuntime";
import { createProductPreviewSnapshot } from "../../../../src/lib/report-generation/productPreviewSnapshot";
import { generateProductReport } from "../../../../src/lib/report-generation/generateProductReport";
import { GAON_MAJOR_FORTUNE_V3_PAYLOAD as payload } from "../../../../src/lib/interpretation-v3/majorFortuneFixtures";
import { COMPATIBILITY_ROLE_VERSION, type ReportProductKey, type ReportProductSlug } from "../../../../src/lib/report-generation/reportInputTypes";
import { getPaidReportResult } from "../../../../src/lib/reports/supabasePaidReportResultAdapter";
import { createComprehensiveV3 } from "../../../../src/lib/report-generation/comprehensiveV3Generation";
import { createCareerV3 } from "../../../../src/lib/report-generation/careerV3Generation";
import { createLoveV3 } from "../../../../src/lib/report-generation/loveV3Generation";
import { createCompatibilityV3 } from "../../../../src/lib/report-generation/compatibilityV3Generation";
import { createMajorFortuneV3 } from "../../../../src/lib/report-generation/majorFortuneV3Generation";

vi.mock("../../../../src/lib/reports/supabasePaidReportResultAdapter", () => ({ getPaidReportResult: vi.fn() }));

const products: [ReportProductKey, ReportProductSlug][] = [
  ["saju_mbti_full", "saju-mbti-full"], ["career_money_study", "career-money-study"], ["love_marriage_child", "love-marriage-child"],
  ["saju_mbti_compatibility", "compatibility"], ["major_fortune", "major-fortune"], ["annual_fortune", "annual-fortune"],
];
it.each(products)("%s generate → publish → saved paid route → exactly one final share section", async (productKey, productSlug) => {
  const reportId = `f5-${productSlug}`, createdAt = new Date().toISOString();
  const input = { ...payload, productKey, productSlug, productOptions: { contentVersion: "v3", selectedYear: "2026" },
    ...(productKey === "saju_mbti_compatibility" ? { compatibilityRoleVersion: COMPATIBILITY_ROLE_VERSION, relationshipType: "love", personA: payload.person,
      personB: { ...payload.person, name: "유나", birthDate: "1993-10-17", gender: "FEMALE", mbtiType: "INFJ" } } : {}) };
  const generated = productKey === "saju_mbti_full" ? createComprehensiveV3(input)
    : productKey === "career_money_study" ? createCareerV3(input)
      : productKey === "love_marriage_child" ? createLoveV3(input)
        : productKey === "saju_mbti_compatibility" ? createCompatibilityV3(input)
          : productKey === "major_fortune" ? await createMajorFortuneV3(input)
            : await generateProductReport(input, { enabled: false, reason: "flag_disabled" }, "deterministic_fallback");
  expect(generated).toBeTruthy(); if (!generated || !("draft" in generated)) return;
  const snapshot = createProductPreviewSnapshot({ reportId, createdAtIso: createdAt, productKey, productSlug, draft: generated.draft, evidencePacket: generated.evidencePacket });
  expect(snapshot.ok).toBe(true); if (!snapshot.ok) return;
  const runtime = createReportPersistenceRuntime({ mode: "preview_memory" });
  expect(runtime.ok).toBe(true); if (!runtime.ok) return;
  const stored = await runtime.adapter.create({ record: { reportId, createdAt, updatedAt: createdAt, status: "generated", reportVersion: "1.0", calculationVersion: "product-preview-v1",
    locale: "ko-KR", accessMode: "paid", accessTokenHash: "sha256:f5-local-only", accessTokenCreatedAt: createdAt, accessTokenVersion: "v1",
    inputSnapshot: { birthDate: payload.person.birthDate, birthTime: payload.person.birthTime, birthTimeUnknown: false, calendarType: "SOLAR", timezone: "Asia/Seoul", mbti: "ENTJ" },
    reportSnapshot: { snapshotKind: "product_preview", productPreview: snapshot.value, report: { version: "v1", titleKo: "리포트", subtitleKo: "", sections: [], notices: [] }, reportVersion: "1.0", renderVersion: "1.0", createdAt },
  } });
  expect(stored.ok).toBe(true);
  const html = renderToStaticMarkup(await ReportResultPage({ params: Promise.resolve({ reportId }) }));
  expect(html.match(/리포트 공유하기/g)).toHaveLength(1);
  expect(html).not.toContain("<footer");
  expect(html.indexOf('aria-label="공유와 다음 리포트"')).toBeGreaterThan(html.lastIndexOf("</article>"));
  expect(html).toContain(`/report/new?product=${productSlug}`);
  expect(html).toContain("data-mbti-detail");
  if (productKey === "annual_fortune") {
    expect(html).toContain('data-report-version="annual_fortune_v3.0-editorial.1"');
    expect(html.match(/data-month-position=/g)).toHaveLength(12);
    expect(html).not.toMatch(/sourceRefs|narrativeAudit|month-v2:/);
  }
  expect(getPaidReportResult).not.toHaveBeenCalled(); expect(fetch).not.toHaveBeenCalled();
});
